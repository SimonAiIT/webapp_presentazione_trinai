/**
 * TRINAI ATELIER // CLOUDFLARE EDGE SECURITY GATE (per atelier.trinai.it)
 * - Protegge TUTTI i file statici a monte: finche il cookie firmato non e valido,
 *   l'HTML, i JS e gli audio della presentazione NON vengono serviti.
 * - Supporta su Cloudflare KV (binding: ATELIER_CODES):
 *   1) Codici MASTER (nessuna scadenza, riusabili)
 *   2) Codici a SCADENZA (es. 14 giorni, TTL automatico o expiresAt)
 *   3) Codici USA-E-GETTA (singleUse: true -> bruciati su KV al primo utilizzo)
 */

const COOKIE_NAME = "trinai_atelier_auth";

async function signHmac(payload, secret) {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(payload));
  return btoa(String.fromCharCode(...new Uint8Array(sig)));
}

async function verifySessionCookie(cookieHeader, secret) {
  if (!cookieHeader) return null;
  const match = cookieHeader.match(new RegExp(`${COOKIE_NAME}=([^;]+)`));
  if (!match) return null;
  const parts = decodeURIComponent(match[1]).split(".");
  if (parts.length !== 2) return null;
  const [payloadB64, sigB64] = parts;
  const expectedSig = await signHmac(payloadB64, secret);
  if (sigB64 !== expectedSig) return null;
  const data = JSON.parse(atob(payloadB64));
  if (data.exp && Date.now() > data.exp) return null;
  return data;
}

function gateHtml(err = "") {
  return `<!DOCTYPE html><html lang="it"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
  <title>TrinAI Atelier</title>
  <style>body{margin:0;min-height:100vh;display:flex;align-items:center;justify-content:center;background:#06070b;color:#f1f5f9;font-family:system-ui,sans-serif;padding:20px}
  form{width:100%;max-width:380px;background:#0e111a;border:1px solid rgba(212,175,55,.3);border-radius:16px;padding:26px}
  h1{margin:0 0 8px;font-size:20px;color:#fff}p{margin:0 0 18px;font-size:13px;color:#94a3b8}
  input,button{width:100%;box-sizing:border-box;min-height:46px;border-radius:10px;font-size:14px}
  input{background:#050609;border:1px solid rgba(255,255,255,.15);color:#fff;padding:0 12px;margin-bottom:10px;text-transform:uppercase}
  button{background:#d4af37;color:#06070b;border:0;font-weight:700;cursor:pointer}
  .err{color:#ef4444;font-size:12px;margin-top:10px}</style></head>
  <body><form method="POST" action="/_auth">
    <h1>TrinAI Atelier</h1>
    <p>Accesso riservato. Inserisci il codice personale.</p>
    <input name="code" type="password" placeholder="CODICE" required autofocus>
    <button type="submit">Sblocca</button>
    ${err ? `<div class="err">${err}</div>` : ""}
  </form></body></html>`;
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const secret = env.SESSION_SECRET; // Imposta come Secret su Cloudflare

    // 1. Endpoint di verifica codice
    if (url.pathname === "/_auth" && request.method === "POST") {
      const form = await request.formData();
      const rawCode = String(form.get("code") || "").trim().toUpperCase();
      const recordRaw = await env.ATELIER_CODES.get(`code:${rawCode}`);

      if (!recordRaw) {
        return new Response(gateHtml("Codice non valido o scaduto."), { status: 403, headers: { "Content-Type": "text/html; charset=utf-8" } });
      }

      const record = JSON.parse(recordRaw);
      if (record.expiresAt && Date.now() > record.expiresAt) {
        await env.ATELIER_CODES.delete(`code:${rawCode}`);
        return new Response(gateHtml("Codice scaduto."), { status: 403, headers: { "Content-Type": "text/html; charset=utf-8" } });
      }

      if (record.singleUse) {
        await env.ATELIER_CODES.delete(`code:${rawCode}`);
      }

      const ttlMs = (record.sessionDays || 14) * 86400 * 1000;
      const payloadB64 = btoa(JSON.stringify({ role: record.role || "OSPITE", exp: Date.now() + ttlMs }));
      const sigB64 = await signHmac(payloadB64, secret);
      const cookieVal = encodeURIComponent(`${payloadB64}.${sigB64}`);

      return new Response(null, {
        status: 302,
        headers: {
          "Location": "/",
          "Set-Cookie": `${COOKIE_NAME}=${cookieVal}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=${Math.floor(ttlMs / 1000)}`
        }
      });
    }

    // 2. Verifica cookie firmato su ogni richiesta
    const session = await verifySessionCookie(request.headers.get("Cookie"), secret);
    if (!session) {
      return new Response(gateHtml(), {
        status: 401,
        headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store" }
      });
    }

    // 3. Inoltra all'origin (GitHub Pages / Cloudflare Pages) con header anti-cache
    const originRes = await fetch(request);
    const res = new Response(originRes.body, originRes);
    res.headers.set("Cache-Control", "no-store, no-cache, must-revalidate");
    res.headers.set("X-Frame-Options", "SAMEORIGIN");
    res.headers.set("X-Robots-Tag", "noindex, nofollow");
    return res;
  }
};
