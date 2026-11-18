/**
 * TRINAI ATELIER // SECURITY LOCK & WATERMARK (ACCESSO ESCLUSIVO CON CODICE)
 * - Verifica codice via SHA-256 (codici fissi + hash salati Drive + verifica live GAS per nuovi codici temporanei)
 * - Nessun ingresso libero senza codice
 * - Filigrana dinamica non invasiva + deterrente anti-copia UI + listener Ably
 */
(function () {
  "use strict";

  const GAS_VERIFY_URL =
    "https://script.google.com/macros/s/AKfycbwORN94QznZcSk00icL7DoQwNBRrzdGZY6wEcD8H_V6yyK_h8i6kB4JuUkf3c3M0Xfg/exec";

  const ALLOWED_HASHES = {
    "e8e35d09f3f6bde23a0a092b44a79ddd9fd73d1e76900a88127256a48999ae1f": { role: "MASTER", label: "DIREZIONE TRINAI" },
    "80bb41008ab9cb80e34ee654b02e4c3fa8f418c0c4565abe0e25f30242057655": { role: "OSPITE", label: "OSPITE RISERVATO" }
  };

  // Hash salati SHA-256 allineati con il portale Drive (_config/accessi.json)
  const SALTED_ACCESS_LIST = [
    { salt: "93e1432dee67af8e07ce326849a19c08", hash: "20e5e1ecebe40a2bbb10aeeab1836aa65a06b9e928ee8ae4935c1c1c1b12a53a", role: "OPERATORE", label: "THE APPMANAGER" },
    { salt: "de00a4925dc3a3389ac01b86324f27a1", hash: "803750b26083beb23d8ecb2f8f156abb01d2a79c4190ca50d5e8bb2c9b6e0858", role: "MASTER", label: "DIREZIONE CAIO" },
    { salt: "efae729f89ca15b5d65219b303cee8ae", hash: "622763cfe8e77a0a21ef59f21dac40fd8e38fc54dfb34aa3ad22e2a279a8b0fa", role: "MASTER", label: "CFO & OPINION LEADER" },
    { salt: "0da1c3382a8a14eac6d43beccd010dc0", hash: "6d11010d05563d4ac97d769719e8db7e976d42ff371561b41978f10e22b07f3d", role: "OPERATORE", label: "DIREZIONE COMMERCIALE" },
    { salt: "f0ac2789605dea550f62b1df3e308212", hash: "4954b21395a5d5038d8bd394ba17e2c2a47b37950eb52f418bfc05a8696f2340", role: "OPERATORE", label: "DIREZIONE CTO" },
    { salt: "ee83af288e1d49fcb2a97355b436a4e0", hash: "a555cd5fa8f8beaa32b99e09aa595e6ce88102c2dd24329af7e4992cfa8b3a26", role: "OPERATORE", label: "DIREZIONE DGTI" },
    { salt: "d631c5dada8c9195b6e176bc728aabb6", hash: "c5098a1716ef0605ebf29a306cfb2ac4c06edf8fe73b4730be58ee02b68076cd", role: "OSPITE", label: "OSPITE BROCHURE" },
    { salt: "eed75bd3e7361e77175e5d8a028402e3", hash: "c844adc9ff972897a4f579c93f996e41876dbdeb31e010bc888c6740405f555e", role: "OSPITE", label: "GRUPPO FAVERO" },
    { salt: "ee19dcef9823f6e3c3dbd3130ab665ba", hash: "b0f259abe3966b855e9ad4d24098b8a2b27a157ff2249318d067531c6b5e8e96", role: "OSPITE", label: "OSPITE RISERVATO" },
    { salt: "3c93c4fa317b84600c6dae0113fa718f", hash: "b6efd18d09972771284cb3aa1b6cfbaa0476c36de36156c7940be28372627e9c", role: "OSPITE", label: "GRUPPO FAVERO" }
  ];

  const SESSION_KEY = "trinai_atelier_session_v3";

  async function sha256HexRaw(str) {
    const buf = new TextEncoder().encode(str);
    const hash = await crypto.subtle.digest("SHA-256", buf);
    return Array.from(new Uint8Array(hash))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  }

  function getSession() {
    try {
      const raw = sessionStorage.getItem(SESSION_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      if (!parsed || parsed.role === "VIP_PASS") return null;
      return parsed;
    } catch {
      return null;
    }
  }

  function saveSession(data) {
    try {
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(data));
    } catch {}
  }

  function clearSession() {
    try {
      sessionStorage.removeItem(SESSION_KEY);
      sessionStorage.removeItem("trinai_atelier_session_v2");
    } catch {}
  }

  function renderWatermark(session) {
    let wm = document.getElementById("trinai-watermark");
    if (!wm) {
      wm = document.createElement("div");
      wm.id = "trinai-watermark";
      wm.setAttribute("aria-hidden", "true");
      document.body.appendChild(wm);
    }
    const stamp = new Date().toLocaleString("it-IT", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
    const text = `TRINAI S.R.L. START-UP INNOVATIVA · ${session.label} · ${session.sig} · ${stamp}`;
    wm.innerHTML = "";
    for (let i = 0; i < 5; i++) {
      const span = document.createElement("span");
      span.textContent = text;
      wm.appendChild(span);
    }
  }

  function enableAntiCopy() {
    document.addEventListener("contextmenu", (e) => e.preventDefault());
    document.addEventListener("dragstart", (e) => {
      if (e.target && (e.target.tagName === "IMG" || e.target.tagName === "VIDEO")) {
        e.preventDefault();
      }
    });
    document.addEventListener("keydown", (e) => {
      const k = (e.key || "").toLowerCase();
      if (
        e.key === "F12" ||
        ((e.ctrlKey || e.metaKey) && (k === "s" || k === "u" || k === "p")) ||
        ((e.ctrlKey || e.metaKey) && e.shiftKey && (k === "i" || k === "j" || k === "c"))
      ) {
        e.preventDefault();
        try { window.suoniCAOS && window.suoniCAOS.riproduci("lavoro_errore"); } catch (err) {}
      }
    });
  }

  function initAblyKillSwitch(session) {
    const subKey = window.TRINAI_ABLY_SUB_KEY;
    if (!subKey || typeof Ably === "undefined") return;
    try {
      const realtime = new Ably.Realtime({ key: subKey });
      const ch = realtime.channels.get("trinai-atelier-control");
      ch.subscribe("revoke", (msg) => {
        const target = msg.data && msg.data.sig;
        if (!target || target === "ALL" || target === session.sig) {
          clearSession();
          try { window.suoniCAOS && window.suoniCAOS.riproduci("lavoro_errore"); } catch (err) {}
          window.location.reload();
        }
      });
    } catch {}
  }

  async function verifyCode(code) {
    const clean = (code || "").trim();
    if (!clean) return null;

    // 1. Verifica hash legacy (maiuscolo)
    const upperHex = await sha256HexRaw(clean.toUpperCase());
    if (ALLOWED_HASHES[upperHex]) {
      const hit = ALLOWED_HASHES[upperHex];
      const session = {
        role: hit.role,
        label: hit.label,
        sig: upperHex.slice(0, 8).toUpperCase(),
        ts: Date.now()
      };
      saveSession(session);
      return session;
    }

    // 2. Verifica hash salati locali (istantanea per team e codici fissi)
    for (let i = 0; i < SALTED_ACCESS_LIST.length; i++) {
      const item = SALTED_ACCESS_LIST[i];
      const saltedHex = await sha256HexRaw(item.salt + clean);
      if (saltedHex === item.hash) {
        const session = {
          role: item.role,
          label: item.label,
          sig: saltedHex.slice(0, 8).toUpperCase(),
          ts: Date.now()
        };
        saveSession(session);
        return session;
      }
    }

    // 3. Verifica live su Google Apps Script (per tutti i nuovi codici temporanei generati dal portale Drive)
    try {
      const res = await fetch(GAS_VERIFY_URL, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify({ action: "verifica_codice_pubblico", code: clean })
      });
      if (res.ok) {
        const data = await res.json();
        if (data && data.ok) {
          const sigHex = await sha256HexRaw(clean);
          const session = {
            role: data.role || "OSPITE",
            label: (data.label || "OSPITE RISERVATO").toUpperCase(),
            sig: sigHex.slice(0, 8).toUpperCase(),
            ts: Date.now()
          };
          saveSession(session);
          return session;
        }
      }
    } catch (_e) {}

    return null;
  }

  function activateLock(session) {
    renderWatermark(session);
    enableAntiCopy();
    initAblyKillSwitch(session);
  }

  window.TRINAI_LOCK = {
    getSession,
    verifyCode,
    activateLock,
    clearSession
  };
})();
