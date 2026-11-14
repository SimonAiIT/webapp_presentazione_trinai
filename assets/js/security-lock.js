/**
 * TRINAI ATELIER // SECURITY LOCK, MAGIC PASS & WATERMARK
 * - Verifica codice via SHA-256 + supporto Magic Link (?k=...) e Black Card Pass a tocco singolo
 * - Filigrana dinamica non invasiva + deterrente anti-copia UI + listener Ably
 */
(function () {
  "use strict";

  const ALLOWED_HASHES = {
    "e8e35d09f3f6bde23a0a092b44a79ddd9fd73d1e76900a88127256a48999ae1f": { role: "MASTER", label: "DIREZIONE TRINAI" },
    "80bb41008ab9cb80e34ee654b02e4c3fa8f418c0c4565abe0e25f30242057655": { role: "OSPITE", label: "OSPITE RISERVATO" }
  };

  const SESSION_KEY = "trinai_atelier_session_v2";

  async function sha256Hex(str) {
    const buf = new TextEncoder().encode(str.trim().toUpperCase());
    const hash = await crypto.subtle.digest("SHA-256", buf);
    return Array.from(new Uint8Array(hash))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  }

  function getSession() {
    try {
      const raw = sessionStorage.getItem(SESSION_KEY);
      return raw ? JSON.parse(raw) : null;
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
    if (!code) return null;
    const hex = await sha256Hex(code);
    const hit = ALLOWED_HASHES[hex];
    if (!hit) return null;
    const session = {
      role: hit.role,
      label: hit.label,
      sig: hex.slice(0, 8).toUpperCase(),
      ts: Date.now()
    };
    saveSession(session);
    return session;
  }

  function createGuestPassSession() {
    const session = {
      role: "VIP_PASS",
      label: "INVITO BLACK CARD",
      sig: "BC" + Math.random().toString(16).slice(2, 8).toUpperCase(),
      ts: Date.now()
    };
    saveSession(session);
    return session;
  }

  function activateLock(session) {
    renderWatermark(session);
    enableAntiCopy();
    initAblyKillSwitch(session);
  }

  window.TRINAI_LOCK = {
    getSession,
    verifyCode,
    createGuestPassSession,
    activateLock,
    clearSession
  };
})();
