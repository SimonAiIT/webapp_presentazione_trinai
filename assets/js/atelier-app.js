/**
 * TRINAI ATELIER // SPA CONTROLLER (LUXURY MOBILE-FIRST CINEMATIC EXPERIENCE)
 * - Video loops 8s per Atto + Scheda Narrativa Circolare + Simulatore Interattivo + Cassetti Espandibili
 * - Zero sovrapposizioni su mobile e desktop
 */
(function () {
  "use strict";

  const DATA = window.TRINAI_DATA;
  let currentVerticalId = "trasversale";
  let currentStationIdx = 0;
  let currentSimIdx = 0;
  let touchStartX = 0;
  let touchStartY = 0;

  // DOM
  const gateScreen = document.getElementById("gate-screen");
  const btnInstantPass = document.getElementById("btn-instant-pass");
  const gateForm = document.getElementById("gate-form");
  const gateInput = document.getElementById("gate-code-input");
  const gateError = document.getElementById("gate-error");
  const appShell = document.getElementById("app-shell");
  const verticalBar = document.getElementById("vertical-bar");
  const stationNavStrip = document.getElementById("station-nav-strip");
  const stageRoot = document.getElementById("stage-root");
  const topbarCount = document.getElementById("topbar-station-count");
  const btnPrev = document.getElementById("hud-prev-btn");
  const btnNext = document.getElementById("hud-next-btn");
  const btnPlay = document.getElementById("hud-play-btn");
  const btnThemeToggle = document.getElementById("btn-theme-toggle");
  const btnSoundToggle = document.getElementById("btn-sound-toggle");
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

  function renderVerticalBar() {
    if (!verticalBar) return;
    verticalBar.innerHTML = "";
    Object.values(DATA.verticals).forEach((v) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "vertical-pill" + (v.id === currentVerticalId ? " active" : "");
      btn.textContent = v.nome;
      btn.addEventListener("click", () => {
        playUiSound("click");
        currentVerticalId = v.id;
        document.documentElement.style.setProperty("--accent", v.colore);
        renderVerticalBar();
        renderStage(false);
      });
      verticalBar.appendChild(btn);
    });
  }

  function renderStationNav() {
    if (!stationNavStrip) return;
    stationNavStrip.innerHTML = "";
    DATA.stations.forEach((s, idx) => {
      const chip = document.createElement("button");
      chip.type = "button";
      chip.className = "station-chip" + (idx === currentStationIdx ? " active" : "");
      chip.textContent = `${s.codice} · ${s.titolo}`;
      chip.addEventListener("click", () => {
        if (idx === currentStationIdx) return;
        playUiSound("open");
        goToStation(idx, true);
      });
      stationNavStrip.appendChild(chip);
      if (idx === currentStationIdx) {
        chip.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
      }
    });
  }

  function renderSimulatorHtml(sim) {
    if (!sim || !sim.opzioni || !sim.opzioni.length) return "";
    const activeOpt = sim.opzioni[currentSimIdx] || sim.opzioni[0];
    const tabsHtml = sim.opzioni
      .map(
        (opt, i) =>
          `<button type="button" class="sim-tab-btn ${i === currentSimIdx ? "active" : ""}" data-sim-idx="${i}">
            ${opt.label}
          </button>`
      )
      .join("");

    return `
      <section class="sim-box" aria-label="${sim.titolo}">
        <div class="sim-title">${sim.titolo}</div>
        <div class="sim-tabs">${tabsHtml}</div>
        <div class="sim-readout">
          <div class="sim-readout-metric" id="sim-metric-val">${activeOpt.tempo}</div>
          <div class="sim-readout-detail" id="sim-metric-desc">${activeOpt.reparti}</div>
        </div>
      </section>
    `;
  }

  function renderDrawersHtml(cassetti) {
    if (!cassetti || !cassetti.length) return "";
    const items = cassetti
      .map(
        (d, idx) => `
        <details class="drawer-item" ${idx === 0 ? "open" : ""}>
          <summary class="drawer-summary">${d.titolo}</summary>
          <div class="drawer-body">${d.testo}</div>
        </details>
      `
      )
      .join("");
    return `
      <div class="section-heading">Approfondimenti Sartoriali Espandibili</div>
      <div class="drawers-section">${items}</div>
    `;
  }

  function renderStage(triggerAudio = true) {
    const st = DATA.stations[currentStationIdx];
    const vert = DATA.verticals[currentVerticalId];
    if (!st || !vert || !stageRoot) return;

    if (topbarCount) {
      topbarCount.textContent = `ATTO ${st.codice} / 08`;
    }

    const demoHtml = st.demoLink
      ? `<button type="button" class="demo-cta" id="btn-launch-demo" data-url="${st.demoLink.url}" data-title="${st.demoLink.label}">
           <span>${st.demoLink.label}</span>
           <span>→</span>
         </button>`
      : "";

    const kpiHtml = vert.kpi
      .map(
        (k) => `<div class="kpi-box">
                  <div class="kpi-val">${k.valore}</div>
                  <div class="kpi-lbl">${k.label}</div>
                </div>`
      )
      .join("");

    const cardsHtml = st.schede
      .map(
        (c) => `<article class="service-card">
                  <span class="card-badge">${c.badge}</span>
                  <h3>${c.titolo}</h3>
                  <p>${c.testo}</p>
                </article>`
      )
      .join("");

    const verticalModsHtml = vert.moduli
      .map(
        (m) => `<article class="service-card">
                  <span class="card-badge">${vert.nome}</span>
                  <h3>${m.titolo}</h3>
                  <p>${m.desc}</p>
                </article>`
      )
      .join("");

    const institutionalHtml = `
      <aside class="institutional-seal-card">
        <strong>${DATA.brand.ragioneSociale} · ${DATA.brand.qualifica}</strong>
        <span>${DATA.brand.estremiLegali}</span>
        <span>${DATA.brand.collaborazioniAccademiche}</span>
      </aside>
    `;

    const closingHtml =
      currentStationIdx === DATA.stations.length - 1
        ? `<div class="signature-banner">${DATA.brand.chiusura}</div>`
        : "";

    stageRoot.innerHTML = `
      <div class="stage-container">
        <!-- 1. IMPATTO VISIVO CINEMATOGRAFICO 8 SECONDI -->
        <section class="act-visual-card">
          <div class="act-header-bar">
            <span class="station-kicker">Atto ${st.codice} · ${vert.nome}</span>
            <h1 class="station-title">
              ${st.titoloLuce || st.titolo}
              <span class="gold-span">${st.titoloOro || ""}</span>
            </h1>
            <p class="station-sub">${st.sottotitolo}</p>
          </div>
          <div class="video-stage-wrap">
            <video
              id="stage-video"
              src="${st.video}"
              poster="${st.img}"
              autoplay
              muted
              loop
              playsinline
            ></video>
          </div>
        </section>

        <!-- 2. SCHEDA NARRATIVA PARLATA E VERTICALIZZAZIONE -->
        <section class="narrative-sphere-card">
          <div class="narrative-emblem-row">
            <div class="narrative-seal">${st.codice}</div>
            <h2 class="guiding-question">${st.domandaGuida}</h2>
          </div>
          <p class="narrative-prose">${st.narrazioneBreve}</p>
          <div class="vertical-context-box">${st.perVerticale[currentVerticalId]}</div>
        </section>

        <!-- 3. METRICHE CHIAVE DEL VERTICALE -->
        <div class="kpi-grid">${kpiHtml}</div>

        <!-- 4. SIMULATORE INTERATTIVO DELL'ATTO -->
        ${renderSimulatorHtml(st.simulatore)}

        ${demoHtml}

        <!-- 5. CASSETTI ESPANDIBILI DI APPROFONDIMENTO -->
        ${renderDrawersHtml(st.cassetti)}

        <!-- 6. SCHEDE DELLA CARTA DEI SERVIZI -->
        <div class="section-heading">Moduli della Carta dei Servizi in Questo Atto</div>
        <div class="cards-grid">${cardsHtml}</div>

        <!-- 7. DECLINAZIONE SUL VERTICALE ATTIVO -->
        <div class="section-heading">Architettura Dedicata · ${vert.nome}</div>
        <div class="cards-grid">${verticalModsHtml}</div>

        ${institutionalHtml}
        ${closingHtml}
      </div>
    `;

    // Bind video playback
    const vid = document.getElementById("stage-video");
    if (vid) {
      vid.play().catch(() => {});
    }

    // Bind Simulator Tabs
    const simBtns = stageRoot.querySelectorAll(".sim-tab-btn");
    simBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        playUiSound("click");
        currentSimIdx = parseInt(btn.dataset.simIdx, 10) || 0;
        const opt = st.simulatore.opzioni[currentSimIdx];
        simBtns.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        const mVal = document.getElementById("sim-metric-val");
        const mDesc = document.getElementById("sim-metric-desc");
        if (mVal && opt) mVal.textContent = opt.tempo;
        if (mDesc && opt) mDesc.textContent = opt.reparti;
      });
    });

    // Single-open accordion behavior on mobile for maximum cleanliness
    const drawers = stageRoot.querySelectorAll(".drawer-item");
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

    const demoBtn = document.getElementById("btn-launch-demo");
    if (demoBtn) {
      demoBtn.addEventListener("click", () => {
        playUiSound("open");
        openLab(demoBtn.dataset.url, demoBtn.dataset.title);
      });
    }

    if (triggerAudio && window.TRINAI_AUDIO_HUD) {
      window.TRINAI_AUDIO_HUD.playStation(st, true);
    }
  }

  function goToStation(idx, autoPlay = true) {
    currentStationIdx = (idx + DATA.stations.length) % DATA.stations.length;
    currentSimIdx = 0;
    renderStationNav();
    renderStage(autoPlay);
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
    renderVerticalBar();
    renderStationNav();
    renderStage(startAudio);
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
      if (window.TRINAI_AUDIO_HUD) window.TRINAI_AUDIO_HUD.togglePlay();
    });
  }

  if (btnThemeToggle) {
    btnThemeToggle.addEventListener("click", () => {
      playUiSound("click");
      if (!window.TRINAI_AUDIO_HUD) return;
      const on = window.TRINAI_AUDIO_HUD.toggleTheme();
      btnThemeToggle.classList.toggle("active", on);
      btnThemeToggle.textContent = on ? "Musica ON" : "Musica OFF";
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
      btnSoundToggle.textContent = on ? "Suoni ON" : "Suoni OFF";
    });
  }

  if (btnCloseLab) {
    btnCloseLab.addEventListener("click", closeLab);
  }

  // Swipe Orizzontale Mobile (ignora lo scroll verticale)
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
      if (!e.changedTouches || !e.changedTouches[0]) return;
      const dx = e.changedTouches[0].screenX - touchStartX;
      const dy = e.changedTouches[0].screenY - touchStartY;
      if (Math.abs(dx) > 95 && Math.abs(dx) > Math.abs(dy) * 1.8) {
        playUiSound("click");
        goToStation(dx < 0 ? currentStationIdx + 1 : currentStationIdx - 1, true);
      }
    },
    { passive: true }
  );

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
