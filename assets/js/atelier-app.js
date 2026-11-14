/**
 * TRINAI ATELIER // SPA CONTROLLER CON CAROSELLO CARD 3D & MENU HAMBURGER
 * - Carosello prospettico 3D interattivo + Menu Hamburger laterale
 * - Video Prequel 1 per L'Invito + Tavole Architettoniche SVG Animate per gli Atti 01-08
 * - Zero divisione in verticali chiusi: casi d'uso universali comprensibili a tutti
 */
(function () {
  "use strict";

  const DATA = window.TRINAI_DATA;
  let currentStationIdx = 0;
  let resumeAt = 0; // secondi da cui riprendere la voce, una sola volta

  // Progresso salvato su questo dispositivo (localStorage): atto e punto della voce
  const CHIAVE_PROGRESSO = "trinai_atelier_progresso";
  function leggiProgresso() {
    try {
      const v = JSON.parse(localStorage.getItem(CHIAVE_PROGRESSO) || "null");
      if (v && Number.isInteger(v.idx) && v.idx >= 0 && v.idx < DATA.stations.length) return v;
    } catch (e) {}
    return null;
  }
  let ultimoSalvataggio = 0;
  function salvaProgresso(force) {
    if (!appShell || !appShell.classList.contains("active")) return;
    const now = Date.now();
    if (!force && now - ultimoSalvataggio < 2000) return;
    ultimoSalvataggio = now;
    const hud = window.TRINAI_AUDIO_HUD;
    try {
      localStorage.setItem(
        CHIAVE_PROGRESSO,
        JSON.stringify({ idx: currentStationIdx, t: hud ? Math.floor(hud.getTime()) : 0 })
      );
    } catch (e) {}
  }
  let touchStartX = 0;
  let touchStartY = 0;

  // DOM
  const gateScreen = document.getElementById("gate-screen");
  const btnInstantPass = document.getElementById("btn-instant-pass");
  const gateForm = document.getElementById("gate-form");
  const gateInput = document.getElementById("gate-code-input");
  const gateError = document.getElementById("gate-error");
  const appShell = document.getElementById("app-shell");
  const carouselTrack = document.getElementById("carousel-3d-track");
  const topbarCount = document.getElementById("topbar-station-count");
  const hudDots = document.getElementById("hud-dots");
  const btnPrev = document.getElementById("hud-prev-btn");
  const btnNext = document.getElementById("hud-next-btn");
  const btnPlay = document.getElementById("hud-play-btn");
  const btnThemeToggle = document.getElementById("btn-theme-toggle");
  const btnSoundToggle = document.getElementById("btn-sound-toggle");

  // Hamburger Drawer DOM
  const btnHamburger = document.getElementById("btn-hamburger");
  const btnCloseDrawer = document.getElementById("btn-close-drawer");
  const drawerBackdrop = document.getElementById("drawer-backdrop");
  const hamburgerDrawer = document.getElementById("hamburger-drawer");
  const drawerNavList = document.getElementById("drawer-nav-list");

  // Lab Modal DOM
  const labModal = document.getElementById("lab-modal");
  const labIframe = document.getElementById("lab-iframe");
  const labTitle = document.getElementById("lab-modal-title");
  const btnCloseLab = document.getElementById("btn-close-lab");

  const SFX_MAP = {
    click: "file_toccato",
    open: "chat_inviato",
    unlock: "pipe_avvio",
    error: "lavoro_errore"
  };

  function playUiSound(type) {
    const s = window.suoniCAOS;
    if (s && typeof s.riproduci === "function" && SFX_MAP[type]) {
      try {
        s.riproduci(SFX_MAP[type]);
      } catch (e) {}
    }
  }

  function toggleHamburger(open) {
    if (!hamburgerDrawer || !drawerBackdrop) return;
    const isOpen = typeof open === "boolean" ? open : !hamburgerDrawer.classList.contains("open");
    hamburgerDrawer.classList.toggle("open", isOpen);
    drawerBackdrop.classList.toggle("open", isOpen);
    if (btnHamburger) {
      btnHamburger.setAttribute("aria-expanded", isOpen ? "true" : "false");
    }
  }

  function renderHamburgerMenu() {
    if (!drawerNavList) return;
    drawerNavList.innerHTML = "";
    DATA.stations.forEach((s, idx) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "drawer-act-btn" + (idx === currentStationIdx ? " active" : "");
      btn.innerHTML = `
        <span class="drawer-act-num">${s.codice}</span>
        <span class="drawer-act-name">${s.titolo}</span>
      `;
      btn.addEventListener("click", () => {
        playUiSound("open");
        toggleHamburger(false);
        goToStation(idx, true);
      });
      drawerNavList.appendChild(btn);
    });
  }

  function renderHudDots() {
    if (!hudDots) return;
    hudDots.innerHTML = "";
    DATA.stations.forEach((s, idx) => {
      const dot = document.createElement("button");
      dot.type = "button";
      dot.className = "hud-dot" + (idx === currentStationIdx ? " active" : "");
      dot.setAttribute("aria-label", `Vai all'Atto ${s.codice}`);
      dot.addEventListener("click", () => {
        playUiSound("click");
        goToStation(idx, true);
      });
      hudDots.appendChild(dot);
    });
  }

  function getBlueprintVisualHtml(st) {
    if (st.blueprintType === "video_invito" && st.video) {
      return `
        <div class="visual-stage-box">
          <div class="video-invito-wrap">
            <video
              class="act-video-el"
              src="${st.video}"
              poster="${st.img}"
              autoplay
              muted
              loop
              playsinline
            ></video>
          </div>
        </div>
      `;
    }

    const blueprints = {
      victor_dual_brain: `
        <svg viewBox="0 0 680 230" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="gGold1" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stop-color="#f5d76e"/>
              <stop offset="100%" stop-color="#b8860b"/>
            </linearGradient>
          </defs>
          <rect x="8" y="8" width="664" height="214" rx="14" fill="rgba(8,11,18,0.9)" stroke="rgba(212,175,55,0.35)"/>
          <!-- 5 Sensi a Sinistra -->
          <g font-family="JetBrains Mono, monospace" font-size="10" fill="#cbd5e1">
            <rect x="24" y="24" width="130" height="28" rx="6" fill="rgba(56,189,248,0.1)" stroke="#38bdf8"/>
            <text x="36" y="42">1. GEOMETRIA 3D</text>
            <rect x="24" y="60" width="130" height="28" rx="6" fill="rgba(56,189,248,0.1)" stroke="#38bdf8"/>
            <text x="36" y="78">2. SUONO MACCHINE</text>
            <rect x="24" y="96" width="130" height="28" rx="6" fill="rgba(56,189,248,0.1)" stroke="#38bdf8"/>
            <text x="36" y="114">3. SERIE NEL TEMPO</text>
            <rect x="24" y="132" width="130" height="28" rx="6" fill="rgba(56,189,248,0.1)" stroke="#38bdf8"/>
            <text x="36" y="150">4. NUMERI E TABELLE</text>
            <rect x="24" y="168" width="130" height="28" rx="6" fill="rgba(56,189,248,0.1)" stroke="#38bdf8"/>
            <text x="36" y="186">5. VISIONE OTTICA</text>
          </g>
          <!-- Primo Cervello -->
          <circle cx="310" cy="115" r="64" fill="rgba(212,175,55,0.14)" stroke="url(#gGold1)" stroke-width="2"/>
          <circle cx="310" cy="115" r="46" fill="none" stroke="#f5d76e" stroke-dasharray="4 4">
            <animateTransform attributeName="transform" type="rotate" from="0 310 115" to="360 310 115" dur="14s" repeatCount="indefinite"/>
          </circle>
          <text x="310" y="106" text-anchor="middle" font-family="Cinzel, serif" font-size="13" font-weight="700" fill="#f5d76e">PRIMO CERVELLO</text>
          <text x="310" y="126" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="12" fill="#f8fafc">1,97 ms · Istinto</text>
          <!-- Connessioni -->
          <path d="M154 38 L246 95 M154 74 L246 105 M154 110 L246 115 M154 146 L246 125 M154 182 L246 135" stroke="rgba(212,175,55,0.45)" stroke-width="1.5"/>
          <path d="M374 115 L446 115" stroke="#f5d76e" stroke-width="2.5"/>
          <!-- Secondo Cervello -->
          <rect x="448" y="62" width="204" height="106" rx="12" fill="rgba(212,175,55,0.1)" stroke="#d4af37" stroke-width="1.8"/>
          <text x="550" y="92" text-anchor="middle" font-family="Cinzel, serif" font-size="12" font-weight="700" fill="#f5d76e">SECONDO CERVELLO</text>
          <text x="550" y="114" text-anchor="middle" font-family="Inter, sans-serif" font-size="11" fill="#f8fafc">Spiegazione in 2 Righe</text>
          <text x="550" y="134" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="10" fill="#38bdf8">Zero Dati Inventati</text>
          <text x="550" y="152" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="10" fill="#cbd5e1">Chiuso a Chiave in Sede</text>
        </svg>
      `,
      two_planes_sovereign: `
        <svg viewBox="0 0 680 230" xmlns="http://www.w3.org/2000/svg">
          <rect x="8" y="8" width="664" height="214" rx="14" fill="rgba(8,11,18,0.9)" stroke="rgba(212,175,55,0.35)"/>
          <!-- Piano 1 Locale -->
          <rect x="24" y="26" width="380" height="178" rx="12" fill="rgba(212,175,55,0.08)" stroke="#d4af37" stroke-width="1.8"/>
          <text x="42" y="50" font-family="Cinzel, serif" font-size="12" font-weight="700" fill="#f5d76e">PIANO 1 · DENTRO LA VOSTRA SEDE</text>
          <rect x="42" y="66" width="155" height="54" rx="8" fill="rgba(0,0,0,0.5)" stroke="#38bdf8"/>
          <text x="119" y="88" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="10" fill="#f8fafc">POSTAZIONI 32 GB</text>
          <text x="119" y="106" text-anchor="middle" font-family="Inter, sans-serif" font-size="10" fill="#38bdf8">Modalita Isola Offline</text>
          <rect x="218" y="66" width="168" height="54" rx="8" fill="rgba(212,175,55,0.16)" stroke="#f5d76e"/>
          <text x="302" y="88" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="10" fill="#f5d76e">NODO SOVRANO 128 GB</text>
          <text x="302" y="106" text-anchor="middle" font-family="Inter, sans-serif" font-size="10" fill="#f8fafc">Archivio WORM Immutabile</text>
          <text x="214" y="152" text-anchor="middle" font-family="Inter, sans-serif" font-size="11" fill="#cbd5e1">Nomi, immagini, voce e segreti non escono mai da qui</text>
          <text x="214" y="176" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="10" fill="#34d399">100% OPERATIVO ANCHE SENZA INTERNET</text>
          <!-- Ponte Crittografico -->
          <path d="M404 115 L458 115" stroke="#f5d76e" stroke-width="2" stroke-dasharray="5 4"/>
          <!-- Piano 2 Gruppo -->
          <rect x="458" y="26" width="198" height="178" rx="12" fill="rgba(56,189,248,0.08)" stroke="#38bdf8" stroke-width="1.5"/>
          <text x="557" y="52" text-anchor="middle" font-family="Cinzel, serif" font-size="12" font-weight="700" fill="#38bdf8">PIANO 2 · DIREZIONE</text>
          <text x="557" y="86" text-anchor="middle" font-family="Inter, sans-serif" font-size="11" fill="#f8fafc">Controllo Multi-Sede</text>
          <text x="557" y="114" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="11" fill="#f5d76e">Solo Aggregati k &gt;= 5</text>
          <text x="557" y="142" text-anchor="middle" font-family="Inter, sans-serif" font-size="10" fill="#cbd5e1">Margini · Rese · Cassa</text>
          <text x="557" y="168" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="10" fill="#34d399">Zero Dati Personali</text>
        </svg>
      `,
      rust_semantic_daemon: `
        <svg viewBox="0 0 680 230" xmlns="http://www.w3.org/2000/svg">
          <rect x="8" y="8" width="664" height="214" rx="14" fill="rgba(8,11,18,0.9)" stroke="rgba(212,175,55,0.35)"/>
          <rect x="28" y="42" width="185" height="146" rx="12" fill="rgba(255,255,255,0.04)" stroke="#94a3b8"/>
          <text x="120" y="74" text-anchor="middle" font-family="Cinzel, serif" font-size="12" font-weight="700" fill="#f8fafc">VOSTRI PROGRAMMI</text>
          <text x="120" y="102" text-anchor="middle" font-family="Inter, sans-serif" font-size="11" fill="#cbd5e1">Gestionale Storico</text>
          <text x="120" y="124" text-anchor="middle" font-family="Inter, sans-serif" font-size="11" fill="#cbd5e1">Cartelle e Calendari</text>
          <text x="120" y="154" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="10" fill="#34d399">Nessun Cambio Software</text>

          <path d="M213 115 L255 115" stroke="#f5d76e" stroke-width="2"/>
          <rect x="255" y="42" width="190" height="146" rx="12" fill="rgba(212,175,55,0.14)" stroke="#f5d76e" stroke-width="2"/>
          <text x="350" y="74" text-anchor="middle" font-family="Cinzel, serif" font-size="12" font-weight="700" fill="#f5d76e">DEMONE IN RUST</text>
          <text x="350" y="102" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="11" fill="#f8fafc">0 MB Scheda Video</text>
          <text x="350" y="124" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="11" fill="#38bdf8">Non Ruba Mai il Mouse</text>
          <text x="350" y="154" text-anchor="middle" font-family="Inter, sans-serif" font-size="10" fill="#cbd5e1">Lavora Dietro le Quinte</text>

          <path d="M445 115 L485 115" stroke="#f5d76e" stroke-width="2"/>
          <rect x="485" y="42" width="167" height="146" rx="12" fill="rgba(52,211,153,0.1)" stroke="#34d399" stroke-width="1.8"/>
          <text x="568" y="74" text-anchor="middle" font-family="Cinzel, serif" font-size="12" font-weight="700" fill="#34d399">PREPARA E CHIEDI</text>
          <text x="568" y="104" text-anchor="middle" font-family="Inter, sans-serif" font-size="11" fill="#f8fafc">Pratica Compilata</text>
          <text x="568" y="128" text-anchor="middle" font-family="Inter, sans-serif" font-size="11" fill="#cbd5e1">Voi Confermate col Clic</text>
          <text x="568" y="154" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="10" fill="#f5d76e">100% Controllo Umano</text>
        </svg>
      `,
      lab_to_site_48h: `
        <svg viewBox="0 0 680 230" xmlns="http://www.w3.org/2000/svg">
          <rect x="8" y="8" width="664" height="214" rx="14" fill="rgba(8,11,18,0.9)" stroke="rgba(212,175,55,0.35)"/>
          <g font-family="Inter, sans-serif">
            <rect x="22" y="48" width="146" height="134" rx="10" fill="rgba(255,255,255,0.04)" stroke="#94a3b8"/>
            <text x="95" y="76" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="11" fill="#f5d76e">FASE 1 · AUDIT</text>
            <text x="95" y="104" text-anchor="middle" font-size="11" fill="#f8fafc">Mappatura Flussi</text>
            <text x="95" y="126" text-anchor="middle" font-size="10" fill="#cbd5e1">Estrazione Cifrata</text>
            <text x="95" y="148" text-anchor="middle" font-size="10" fill="#38bdf8">Dati Storici Reali</text>

            <rect x="182" y="48" width="152" height="134" rx="10" fill="rgba(212,175,55,0.1)" stroke="#d4af37"/>
            <text x="258" y="76" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="11" fill="#f5d76e">FASE 2 · LAB TRINAI</text>
            <text x="258" y="104" text-anchor="middle" font-size="11" fill="#f8fafc">Pre-Addestramento</text>
            <text x="258" y="126" text-anchor="middle" font-size="10" fill="#cbd5e1">Cucitura Modelli</text>
            <text x="258" y="148" text-anchor="middle" font-size="10" fill="#38bdf8">Fuori dalla Vostra Sede</text>

            <rect x="348" y="48" width="144" height="134" rx="10" fill="rgba(56,189,248,0.1)" stroke="#38bdf8"/>
            <text x="420" y="76" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="11" fill="#38bdf8">FASE 3 · COLLAUDO</text>
            <text x="420" y="104" text-anchor="middle" font-size="11" fill="#f8fafc">Simulazione Completa</text>
            <text x="420" y="126" text-anchor="middle" font-size="10" fill="#cbd5e1">Test su Casi Reali</text>
            <text x="420" y="148" text-anchor="middle" font-size="10" fill="#34d399">Pronto all'Uso</text>

            <rect x="506" y="48" width="152" height="134" rx="10" fill="rgba(212,175,55,0.2)" stroke="#f5d76e" stroke-width="2"/>
            <text x="582" y="76" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="11" font-weight="700" fill="#f5d76e">FASE 4 · 2 GIORNI</text>
            <text x="582" y="104" text-anchor="middle" font-size="11" font-weight="700" fill="#f8fafc">Deploy Fisico +</text>
            <text x="582" y="124" text-anchor="middle" font-size="11" font-weight="700" fill="#f8fafc">Istruzione Squadra</text>
            <text x="582" y="150" text-anchor="middle" font-size="10" fill="#34d399">Salvo Imprevisti</text>
          </g>
        </svg>
      `,
      human_orchestra_150: `
        <svg viewBox="0 0 680 230" xmlns="http://www.w3.org/2000/svg">
          <rect x="8" y="8" width="664" height="214" rx="14" fill="rgba(8,11,18,0.9)" stroke="rgba(212,175,55,0.35)"/>
          <circle cx="145" cy="115" r="68" fill="rgba(212,175,55,0.12)" stroke="#f5d76e" stroke-width="1.8"/>
          <text x="145" y="104" text-anchor="middle" font-family="Cinzel, serif" font-size="14" font-weight="700" fill="#f5d76e">150 SCENARI</text>
          <text x="145" y="124" text-anchor="middle" font-family="Inter, sans-serif" font-size="11" fill="#f8fafc">Ruolo e Mai Persona</text>
          <text x="145" y="142" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="10" fill="#38bdf8">Zero Classifiche</text>

          <path d="M213 115 L268 115" stroke="#f5d76e" stroke-width="2"/>
          <rect x="268" y="45" width="180" height="140" rx="12" fill="rgba(255,255,255,0.04)" stroke="#d4af37"/>
          <text x="358" y="76" text-anchor="middle" font-family="Cinzel, serif" font-size="12" font-weight="700" fill="#f5d76e">MATRICE DI DELEGA</text>
          <text x="358" y="102" text-anchor="middle" font-family="Inter, sans-serif" font-size="11" fill="#f8fafc">Incrocio Stile Titolare</text>
          <text x="358" y="122" text-anchor="middle" font-family="Inter, sans-serif" font-size="11" fill="#f8fafc">+ Talento Collaboratori</text>
          <text x="358" y="152" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="11" fill="#34d399">Piano 30 · 60 · 90 Giorni</text>

          <path d="M448 115 L492 115" stroke="#f5d76e" stroke-width="2"/>
          <rect x="492" y="45" width="162" height="140" rx="12" fill="rgba(56,189,248,0.1)" stroke="#38bdf8"/>
          <text x="573" y="76" text-anchor="middle" font-family="Cinzel, serif" font-size="12" font-weight="700" fill="#38bdf8">AI ACT ART. 4</text>
          <text x="573" y="104" text-anchor="middle" font-family="Inter, sans-serif" font-size="11" fill="#f8fafc">3 Minuti a Settimana</text>
          <text x="573" y="126" text-anchor="middle" font-family="Inter, sans-serif" font-size="10" fill="#cbd5e1">Micro-Training Pratico</text>
          <text x="573" y="152" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="10" fill="#f5d76e">Attestato Certificato UE</text>
        </svg>
      `,
      accademia_master_postgrad: `
        <svg viewBox="0 0 680 230" xmlns="http://www.w3.org/2000/svg">
          <rect x="8" y="8" width="664" height="214" rx="14" fill="rgba(8,11,18,0.9)" stroke="rgba(212,175,55,0.35)"/>
          <rect x="26" y="34" width="285" height="162" rx="12" fill="rgba(212,175,55,0.12)" stroke="#f5d76e" stroke-width="1.8"/>
          <text x="168" y="64" text-anchor="middle" font-family="Cinzel, serif" font-size="12" font-weight="700" fill="#f5d76e">1 · L'ACCADEMIA UNIVERSITARIA</text>
          <text x="168" y="90" text-anchor="middle" font-family="Inter, sans-serif" font-size="11" font-weight="600" fill="#f8fafc">Master di II Livello e Postgraduate</text>
          <text x="168" y="114" text-anchor="middle" font-family="Inter, sans-serif" font-size="10" fill="#cbd5e1">Cattolica del Sacro Cuore · San Raffaele</text>
          <text x="168" y="142" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="11" fill="#38bdf8">QUI INSEGNIAMO LA METODOLOGIA</text>
          <text x="168" y="166" text-anchor="middle" font-family="Inter, sans-serif" font-size="10" fill="#cbd5e1">Gestione · Delega · Comunicazione Etica</text>

          <path d="M311 115 L369 115" stroke="#f5d76e" stroke-width="2.5"/>
          <rect x="369" y="34" width="285" height="162" rx="12" fill="rgba(56,189,248,0.1)" stroke="#38bdf8" stroke-width="1.8"/>
          <text x="511" y="64" text-anchor="middle" font-family="Cinzel, serif" font-size="12" font-weight="700" fill="#38bdf8">2 · L'ATELIER IN AZIENDA</text>
          <text x="511" y="90" text-anchor="middle" font-family="Inter, sans-serif" font-size="11" font-weight="600" fill="#f8fafc">Metodo Un Passo alla Volta</text>
          <text x="511" y="114" text-anchor="middle" font-family="Inter, sans-serif" font-size="10" fill="#cbd5e1">Tavole Progettuali Anti-Ansia</text>
          <text x="511" y="142" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="11" fill="#f5d76e">IL METODO DIVENTA CODICE VIVO</text>
          <text x="511" y="166" text-anchor="middle" font-family="Inter, sans-serif" font-size="10" fill="#34d399">Presentazione Graduale per Fasi</text>
        </svg>
      `,
      deterministic_roi_26: `
        <svg viewBox="0 0 680 230" xmlns="http://www.w3.org/2000/svg">
          <rect x="8" y="8" width="664" height="214" rx="14" fill="rgba(8,11,18,0.9)" stroke="rgba(212,175,55,0.35)"/>
          <rect x="26" y="38" width="198" height="154" rx="12" fill="rgba(212,175,55,0.12)" stroke="#f5d76e"/>
          <text x="125" y="70" text-anchor="middle" font-family="Cinzel, serif" font-size="13" font-weight="700" fill="#f5d76e">26 INDICI ESATTI</text>
          <text x="125" y="98" text-anchor="middle" font-family="Inter, sans-serif" font-size="11" fill="#f8fafc">Costo Vivo del Minuto</text>
          <text x="125" y="120" text-anchor="middle" font-family="Inter, sans-serif" font-size="11" fill="#cbd5e1">Margine per Postazione</text>
          <text x="125" y="152" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="10" fill="#34d399">Calcolo Matematico Puro</text>

          <rect x="242" y="38" width="196" height="154" rx="12" fill="rgba(56,189,248,0.1)" stroke="#38bdf8"/>
          <text x="340" y="70" text-anchor="middle" font-family="Cinzel, serif" font-size="13" font-weight="700" fill="#38bdf8">CAPITALE DORMIENTE</text>
          <text x="340" y="98" text-anchor="middle" font-family="Inter, sans-serif" font-size="11" fill="#f8fafc">Preventivi Sospesi</text>
          <text x="340" y="120" text-anchor="middle" font-family="Inter, sans-serif" font-size="11" fill="#cbd5e1">Richiami e Fasi Ferme</text>
          <text x="340" y="152" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="10" fill="#f5d76e">Riattivazione con Garbo</text>

          <rect x="456" y="38" width="198" height="154" rx="12" fill="rgba(52,211,153,0.1)" stroke="#34d399"/>
          <text x="555" y="70" text-anchor="middle" font-family="Cinzel, serif" font-size="13" font-weight="700" fill="#34d399">RADAR TERRITORIO</text>
          <text x="555" y="98" text-anchor="middle" font-family="Inter, sans-serif" font-size="11" fill="#f8fafc">Dati Camerali Ufficiali</text>
          <text x="555" y="120" text-anchor="middle" font-family="Inter, sans-serif" font-size="11" fill="#cbd5e1">Confronto Competitivo</text>
          <text x="555" y="152" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="10" fill="#f8fafc">Previsione Cassa 90 gg</text>
        </svg>
      `,
      fund_scouting_eu_shield: `
        <svg viewBox="0 0 680 230" xmlns="http://www.w3.org/2000/svg">
          <rect x="8" y="8" width="664" height="214" rx="14" fill="rgba(8,11,18,0.9)" stroke="rgba(212,175,55,0.35)"/>
          <rect x="26" y="38" width="200" height="154" rx="12" fill="rgba(212,175,55,0.15)" stroke="#f5d76e" stroke-width="1.8"/>
          <text x="126" y="68" text-anchor="middle" font-family="Cinzel, serif" font-size="12" font-weight="700" fill="#f5d76e">RICERCA ATTIVA FONDI</text>
          <text x="126" y="96" text-anchor="middle" font-family="Inter, sans-serif" font-size="11" fill="#f8fafc">Bandi Regionali e CCIAA</text>
          <text x="126" y="118" text-anchor="middle" font-family="Inter, sans-serif" font-size="11" fill="#cbd5e1">Fondi Interprofessionali</text>
          <text x="126" y="150" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="10" fill="#34d399">Formazione Finanziata</text>

          <rect x="242" y="38" width="196" height="154" rx="12" fill="rgba(52,211,153,0.12)" stroke="#34d399" stroke-width="1.8"/>
          <text x="340" y="68" text-anchor="middle" font-family="Cinzel, serif" font-size="12" font-weight="700" fill="#34d399">PERIZIA E INCENTIVI</text>
          <text x="340" y="98" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="16" font-weight="700" fill="#f5d76e">-60,1% COSTO NETTO</text>
          <text x="340" y="124" text-anchor="middle" font-family="Inter, sans-serif" font-size="10" fill="#f8fafc">Transizione 5.0 · Industria 4.0</text>
          <text x="340" y="150" text-anchor="middle" font-family="Inter, sans-serif" font-size="10" fill="#cbd5e1">Nuova Sabatini · ZES</text>

          <rect x="454" y="38" width="200" height="154" rx="12" fill="rgba(56,189,248,0.1)" stroke="#38bdf8" stroke-width="1.8"/>
          <text x="554" y="68" text-anchor="middle" font-family="Cinzel, serif" font-size="12" font-weight="700" fill="#38bdf8">SCUDO LEGALE UE</text>
          <text x="554" y="96" text-anchor="middle" font-family="Inter, sans-serif" font-size="11" fill="#f8fafc">Dossier DPIA e FRIA</text>
          <text x="554" y="118" text-anchor="middle" font-family="Inter, sans-serif" font-size="11" fill="#cbd5e1">16 Schede Carta Servizi</text>
          <text x="554" y="150" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="10" fill="#f5d76e">Zero Sorprese in Verifica</text>
        </svg>
      `
    };

    const svgContent = blueprints[st.blueprintType] || blueprints.victor_dual_brain;
    return `
      <div class="visual-stage-box">
        <div class="blueprint-svg-wrap">${svgContent}</div>
      </div>
    `;
  }

  function buildCardHtml(st, idx) {
    const kpiHtml = (st.kpi || [])
      .map(
        (k) => `<div class="kpi-box">
                  <div class="kpi-val">${k.valore}</div>
                  <div class="kpi-lbl">${k.label}</div>
                </div>`
      )
      .join("");

    const useCasesHtml = (st.doveSiApplica || [])
      .map(
        (u) => `<div class="usecase-card">
                  <div class="usecase-title">${u.ambito}</div>
                  <div class="usecase-desc">${u.esempio}</div>
                </div>`
      )
      .join("");

    const sim = st.simulatore;
    const firstOpt = sim && sim.opzioni ? sim.opzioni[0] : null;
    const simTabsHtml = sim && sim.opzioni
      ? sim.opzioni
          .map(
            (opt, i) =>
              `<button type="button" class="sim-tab-btn ${i === 0 ? "active" : ""}" data-sim-idx="${i}">
                ${opt.label}
              </button>`
          )
          .join("")
      : "";

    const simHtml = firstOpt
      ? `<section class="sim-box" aria-label="${sim.titolo}">
           <div class="sim-title">${sim.titolo}</div>
           <div class="sim-tabs">${simTabsHtml}</div>
           <div class="sim-readout">
             <div class="sim-readout-metric">${firstOpt.tempo}</div>
             <div class="sim-readout-detail">${firstOpt.reparti}</div>
           </div>
         </section>`
      : "";

    const demoHtml = st.demoLink
      ? `<button type="button" class="demo-cta btn-launch-demo" data-url="${st.demoLink.url}" data-title="${st.demoLink.label}">
           <span>${st.demoLink.label}</span>
           <span>→</span>
         </button>`
      : "";

    const drawersHtml = (st.cassetti || [])
      .map(
        (d, i) => `
        <details class="drawer-item" ${i === 0 ? "open" : ""}>
          <summary class="drawer-summary">${d.titolo}</summary>
          <div class="drawer-body">${d.testo}</div>
        </details>
      `
      )
      .join("");

    const cardsHtml = (st.schede || [])
      .map(
        (c) => `<article class="service-card">
                  <span class="card-badge">${c.badge}</span>
                  <h3>${c.titolo}</h3>
                  <p>${c.testo}</p>
                </article>`
      )
      .join("");

    const closingHtml =
      idx === DATA.stations.length - 1
        ? `<div class="signature-banner">${DATA.brand.chiusura}</div>`
        : "";

    const punti = st.kpi || [];
    const puntiHtml = punti
      .map(
        (k, i) => `<div class="vc-item" data-vc="${i}">
                     <div class="vc-val">${k.valore}</div>
                     <div class="vc-lbl">${k.label}</div>
                   </div>`
      )
      .join("");

    return `
      <div class="card-3d-inner card-presentazione">
        <section class="hero-emotion">
          ${getHeroVisualHtml(st)}
          <div class="hero-veil"></div>
          <div class="hero-text">
            <h1 class="station-title">
              ${st.titoloLuce || st.titolo}
              <span class="gold-span">${st.titoloOro || ""}</span>
            </h1>
            <p class="hero-question">${st.domandaGuida}</p>
          </div>
        </section>

        <section class="vc-stage" aria-label="Punti chiave dell'atto">
          <div class="vc-ring">${puntiHtml}</div>
          <div class="vc-dots"></div>
        </section>

        ${demoHtml}
        ${closingHtml}
      </div>
    `;
  }

  function getHeroVisualHtml(st) {
    if (st.video) {
      return `<video class="hero-media act-video-el" src="${st.video}" poster="${st.img}" muted loop playsinline preload="none"></video>`;
    }
    return `<img class="hero-media" src="${st.img}" alt="" loading="lazy" onerror="this.style.display='none'">`;
  }

  // Carosello verticale 3D dei punti chiave: sincronizzato con la voce
  const vcState = { idx: 0, lockUntil: 0 };

  function setPoint(idx, manual) {
    const card = carouselTrack ? carouselTrack.querySelector('.card-3d-slide[data-pos="0"]') : null;
    if (!card) return;
    const items = card.querySelectorAll(".vc-item");
    const n = items.length;
    if (!n) return;
    idx = Math.max(0, Math.min(n - 1, idx));
    if (manual) vcState.lockUntil = Date.now() + 6000;
    vcState.idx = idx;
    items.forEach((el, i) => {
      const o = i - idx;
      el.style.setProperty("--o", o);
      el.style.setProperty("--a", Math.abs(o));
      el.classList.toggle("on", o === 0);
    });
    const dots = card.querySelector(".vc-dots");
    if (dots) {
      if (dots.childElementCount !== n) dots.innerHTML = "<i></i>".repeat(n);
      Array.from(dots.children).forEach((d, i) => d.classList.toggle("on", i === idx));
    }
  }

  const INTRO_FRAC = 0.22; // piano B se mancano i tempi veri dei punti
  let puntiTempi = {};
  fetch("assets/audio/punti.json", { cache: "no-store" })
    .then((r) => (r.ok ? r.json() : {}))
    .then((j) => { puntiTempi = j || {}; })
    .catch(() => {});

  function syncPointsToVoice(t, dur) {
    salvaProgresso(false);
    if (!dur || Date.now() < vcState.lockUntil) return;
    const card = carouselTrack ? carouselTrack.querySelector('.card-3d-slide[data-pos="0"]') : null;
    if (!card) return;
    const n = card.querySelectorAll(".vc-item").length;
    if (!n) return;
    const st = DATA.stations[currentStationIdx];
    const tempi = st && puntiTempi["stazione_" + st.codice];
    let idx;
    if (tempi && tempi.inizi && tempi.inizi.length) {
      idx = Math.max(0, tempi.inizi.filter((x) => t >= x).length - 1);
    } else {
      const f = t / dur;
      idx = f < INTRO_FRAC ? 0 : Math.floor(((f - INTRO_FRAC) / (1 - INTRO_FRAC)) * n);
    }
    if (idx !== vcState.idx) setPoint(idx, false);
  }

  function bindPointsCarousel(card) {
    const ring = card.querySelector(".vc-ring");
    if (!ring) return;
    let y0 = null;
    ring.addEventListener("touchstart", (e) => { y0 = e.touches[0].clientY; }, { passive: true });
    ring.addEventListener("touchend", (e) => {
      if (y0 === null) return;
      const dy = e.changedTouches[0].clientY - y0;
      y0 = null;
      if (Math.abs(dy) > 30) {
        e.stopPropagation();
        setPoint(vcState.idx + (dy < 0 ? 1 : -1), true);
      }
    });
    ring.querySelectorAll(".vc-item").forEach((el, i) => {
      el.addEventListener("click", (e) => {
        e.stopPropagation();
        setPoint(i, true);
      });
    });
  }

  function renderCarousel3D() {
    if (!carouselTrack) return;
    carouselTrack.innerHTML = "";
    DATA.stations.forEach((st, idx) => {
      const card = document.createElement("article");
      card.className = "card-3d-slide";
      card.dataset.idx = String(idx);
      card.innerHTML = buildCardHtml(st, idx);

      // Clicking an adjacent 3D card rotates the carousel to that card
      card.addEventListener("click", (e) => {
        if (idx !== currentStationIdx) {
          e.stopPropagation();
          playUiSound("open");
          goToStation(idx, true);
        }
      });

      // Bind simulator tabs inside this card
      const simBtns = card.querySelectorAll(".sim-tab-btn");
      const mVal = card.querySelector(".sim-readout-metric");
      const mDesc = card.querySelector(".sim-readout-detail");
      simBtns.forEach((btn) => {
        btn.addEventListener("click", (e) => {
          e.stopPropagation();
          playUiSound("click");
          const sIdx = parseInt(btn.dataset.simIdx, 10) || 0;
          const opt = st.simulatore && st.simulatore.opzioni ? st.simulatore.opzioni[sIdx] : null;
          simBtns.forEach((b) => b.classList.remove("active"));
          btn.classList.add("active");
          if (mVal && opt) mVal.textContent = opt.tempo;
          if (mDesc && opt) mDesc.textContent = opt.reparti;
        });
      });

      // Bind single-open drawers inside this card
      const drawers = card.querySelectorAll(".drawer-item");
      drawers.forEach((dt) => {
        dt.addEventListener("toggle", () => {
          if (dt.open) {
            playUiSound("click");
            drawers.forEach((other) => {
              if (other !== dt) other.removeAttribute("open");
            });
          }
        });
      });

      // Bind interactive lab button inside this card
      const demoBtn = card.querySelector(".btn-launch-demo");
      if (demoBtn) {
        demoBtn.addEventListener("click", (e) => {
          e.stopPropagation();
          playUiSound("open");
          openLab(demoBtn.dataset.url, demoBtn.dataset.title);
        });
      }

      bindPointsCarousel(card);
      carouselTrack.appendChild(card);
    });
    update3DPositions(false);
  }

  function update3DPositions(triggerAudio = true) {
    const total = DATA.stations.length;
    const st = DATA.stations[currentStationIdx];
    if (topbarCount && st) {
      topbarCount.textContent = `Atto ${st.codice} di 08`;
    }

    const prevIdx = (currentStationIdx - 1 + total) % total;
    const nextIdx = (currentStationIdx + 1) % total;

    const cards = carouselTrack ? carouselTrack.querySelectorAll(".card-3d-slide") : [];
    cards.forEach((card, idx) => {
      const vid = card.querySelector(".act-video-el");
      if (idx === currentStationIdx) {
        card.dataset.pos = "0";
        if (vid) vid.play().catch(() => {});
      } else if (idx === prevIdx) {
        card.dataset.pos = "-1";
        if (vid) vid.pause();
      } else if (idx === nextIdx) {
        card.dataset.pos = "1";
        if (vid) vid.pause();
      } else {
        card.dataset.pos = "hidden";
        if (vid) vid.pause();
      }
    });

    vcState.idx = 0;
    vcState.lockUntil = 0;
    setPoint(0, false);
    renderHamburgerMenu();
    renderHudDots();

    if (window.TRINAI_AUDIO_HUD && st) {
      window.TRINAI_AUDIO_HUD.playStation(st, triggerAudio, resumeAt);
    }
  }

  if (window.TRINAI_AUDIO_HUD) window.TRINAI_AUDIO_HUD.setOnTime(syncPointsToVoice);

  function goToStation(idx, autoPlay = true) {
    const total = DATA.stations.length;
    currentStationIdx = (idx + total) % total;
    resumeAt = 0;
    update3DPositions(autoPlay);
    salvaProgresso(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function openLab(url, title) {
    if (!labModal || !labIframe) return;
    if (labTitle) labTitle.textContent = title || "Laboratorio Interattivo";
    labIframe.src = url;
    labModal.classList.add("open");
  }

  function closeLab() {
    if (!labModal || !labIframe) return;
    playUiSound("click");
    labModal.classList.remove("open");
    labIframe.src = "about:blank";
  }

  function enterExperience(session, startAudio = true) {
    window.TRINAI_LOCK.activateLock(session);
    if (gateScreen) gateScreen.classList.add("hidden");
    if (appShell) appShell.classList.add("active");
    if (window.TRINAI_AUDIO_HUD && startAudio) {
      window.TRINAI_AUDIO_HUD.startSoundtrack();
    }
    const salvato = leggiProgresso();
    if (salvato) {
      currentStationIdx = salvato.idx;
      resumeAt = salvato.t || 0;
    }
    renderCarousel3D();
    update3DPositions(startAudio);
    resumeAt = 0;
    initThreeBackground();
  }

  function initThreeBackground() {
    const canvas = document.getElementById("bg-canvas");
    if (!canvas || typeof THREE === "undefined") return;
    try {
      const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
      renderer.setSize(window.innerWidth, window.innerHeight);

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
      camera.position.z = 5;

      const count = 180;
      const geo = new THREE.BufferGeometry();
      const pos = new Float32Array(count * 3);
      for (let i = 0; i < count * 3; i++) {
        pos[i] = (Math.random() - 0.5) * 12;
      }
      geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
      const mat = new THREE.PointsMaterial({ color: 0xd4af37, size: 0.032, transparent: true, opacity: 0.55 });
      const points = new THREE.Points(geo, mat);
      scene.add(points);

      function animate() {
        requestAnimationFrame(animate);
        points.rotation.y += 0.0006;
        points.rotation.x += 0.0002;
        renderer.render(scene, camera);
      }
      animate();

      window.addEventListener("resize", () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      });
    } catch {}
  }

  // Event Listeners
  if (btnInstantPass) {
    btnInstantPass.addEventListener("click", () => {
      playUiSound("unlock");
      const session = window.TRINAI_LOCK.createGuestPassSession();
      enterExperience(session, true);
    });
  }

  if (gateForm) {
    gateForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      if (gateError) gateError.textContent = "";
      const code = gateInput ? gateInput.value : "";
      const session = await window.TRINAI_LOCK.verifyCode(code);
      if (!session) {
        playUiSound("error");
        if (gateError) gateError.textContent = "Codice non riconosciuto.";
        return;
      }
      playUiSound("unlock");
      enterExperience(session, true);
    });
  }

  if (btnHamburger) {
    btnHamburger.addEventListener("click", () => {
      playUiSound("click");
      toggleHamburger();
    });
  }

  if (btnCloseDrawer) {
    btnCloseDrawer.addEventListener("click", () => {
      playUiSound("click");
      toggleHamburger(false);
    });
  }

  if (drawerBackdrop) {
    drawerBackdrop.addEventListener("click", () => {
      toggleHamburger(false);
    });
  }

  // Bind Lab buttons inside Hamburger drawer
  document.querySelectorAll(".drawer-lab-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      playUiSound("open");
      toggleHamburger(false);
      openLab(btn.dataset.labUrl, btn.dataset.labTitle);
    });
  });

  if (btnPrev) {
    btnPrev.addEventListener("click", () => {
      playUiSound("click");
      goToStation(currentStationIdx - 1, true);
    });
  }

  if (btnNext) {
    btnNext.addEventListener("click", () => {
      playUiSound("click");
      goToStation(currentStationIdx + 1, true);
    });
  }

  if (btnPlay) {
    btnPlay.addEventListener("click", () => {
      playUiSound("click");
      const hud = window.TRINAI_AUDIO_HUD;
      if (!hud) return;
      if (hud.getState() === "ended") {
        goToStation(currentStationIdx + 1, true);
      } else {
        hud.togglePlay();
      }
    });
  }

  const btnBack = document.getElementById("hud-back-btn");
  const btnSpeed = document.getElementById("hud-speed-btn");
  if (btnBack) {
    btnBack.addEventListener("click", () => {
      playUiSound("click");
      const hud = window.TRINAI_AUDIO_HUD;
      // oltre i primi secondi riparte l'atto, altrimenti torna a quello precedente
      if (hud && hud.getTime() > 3) hud.riparti();
      else goToStation(currentStationIdx - 1, true);
    });
  }
  if (btnSpeed) {
    btnSpeed.addEventListener("click", () => {
      playUiSound("click");
      const hud = window.TRINAI_AUDIO_HUD;
      if (!hud) return;
      // in riproduzione velocizza, in pausa va all'atto successivo
      if (hud.getState() === "playing") hud.cambiaVelocita();
      else goToStation(currentStationIdx + 1, true);
    });
  }

  // Header che si nasconde scorrendo verso il basso e ricompare risalendo
  const topbarEl = document.querySelector(".topbar");
  let lastScrollY = 0;
  window.addEventListener(
    "scroll",
    () => {
      if (!topbarEl) return;
      const y = window.scrollY || 0;
      const goingDown = y > lastScrollY + 6;
      const goingUp = y < lastScrollY - 6;
      if (y < 60 || goingUp) topbarEl.classList.remove("topbar-hidden");
      else if (goingDown) topbarEl.classList.add("topbar-hidden");
      lastScrollY = y;
    },
    { passive: true }
  );

  if (btnThemeToggle) {
    btnThemeToggle.addEventListener("click", () => {
      playUiSound("click");
      if (!window.TRINAI_AUDIO_HUD) return;
      const on = window.TRINAI_AUDIO_HUD.toggleTheme();
      btnThemeToggle.classList.toggle("active", on);
      btnThemeToggle.textContent = on ? "Sottofondo musicale: acceso" : "Sottofondo musicale: spento";
    });
  }

  if (btnSoundToggle) {
    btnSoundToggle.addEventListener("click", () => {
      const s = window.suoniCAOS;
      if (!s) return;
      const on = !btnSoundToggle.classList.contains("active");
      try {
        on ? s.avviaFondo() : s.fermaFondo();
      } catch (e) {}
      btnSoundToggle.classList.toggle("active", on);
      btnSoundToggle.textContent = on ? "Suoni al tocco: attivi" : "Suoni al tocco: spenti";
    });
  }

  if (btnCloseLab) {
    btnCloseLab.addEventListener("click", closeLab);
  }

  // Keyboard navigation for 3D Carousel
  document.addEventListener("keydown", (e) => {
    if (!appShell || !appShell.classList.contains("active")) return;
    if (labModal && labModal.classList.contains("open")) return;
    if (e.key === "ArrowLeft") {
      playUiSound("click");
      goToStation(currentStationIdx - 1, true);
    } else if (e.key === "ArrowRight") {
      playUiSound("click");
      goToStation(currentStationIdx + 1, true);
    }
  });

  // Swipe Orizzontale Mobile per Ruotare il Carosello 3D
  document.addEventListener(
    "touchstart",
    (e) => {
      if (e.changedTouches && e.changedTouches[0]) {
        touchStartX = e.changedTouches[0].screenX;
        touchStartY = e.changedTouches[0].screenY;
      }
    },
    { passive: true }
  );

  document.addEventListener(
    "touchend",
    (e) => {
      if (!appShell || !appShell.classList.contains("active")) return;
      if (labModal && labModal.classList.contains("open")) return;
      if (hamburgerDrawer && hamburgerDrawer.classList.contains("open")) return;
      if (!e.changedTouches || !e.changedTouches[0]) return;
      const dx = e.changedTouches[0].screenX - touchStartX;
      const dy = e.changedTouches[0].screenY - touchStartY;
      if (Math.abs(dx) > 85 && Math.abs(dx) > Math.abs(dy) * 1.7) {
        playUiSound("click");
        goToStation(dx < 0 ? currentStationIdx + 1 : currentStationIdx - 1, true);
      }
    },
    { passive: true }
  );

  window.addEventListener("pagehide", () => salvaProgresso(true));
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") salvaProgresso(true);
  });

  // Controllo Magic Link (?k=...) o sessione esistente
  (async function initBoot() {
    const params = new URLSearchParams(window.location.search);
    const magicCode = params.get("k");
    if (magicCode) {
      const session = await window.TRINAI_LOCK.verifyCode(magicCode);
      if (session) {
        enterExperience(session, false);
        return;
      }
    }
    const existing = window.TRINAI_LOCK.getSession();
    if (existing) {
      enterExperience(existing, false);
    }
  })();
})();
