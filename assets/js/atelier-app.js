/**
 * TRINAI ATELIER // SPA CONTROLLER (MOBILE-FIRST VIDEOGAME EXPERIENCE)
 */
(function () {
  "use strict";

  const DATA = window.TRINAI_DATA;
  let currentVerticalId = "trasversale";
  let currentStationIdx = 0;
  let touchStartX = 0;

  // DOM
  const gateScreen = document.getElementById("gate-screen");
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
  const btnSoundToggle = document.getElementById("btn-sound-toggle");
  const labModal = document.getElementById("lab-modal");
  const labIframe = document.getElementById("lab-iframe");
  const labTitle = document.getElementById("lab-modal-title");
  const btnCloseLab = document.getElementById("btn-close-lab");

  const SFX_MAP = { click: "file_toccato", open: "chat_inviato", unlock: "pipe_avvio", error: "lavoro_errore" };
  function playUiSound(type) {
    const s = window.suoniCAOS;
    if (s && typeof s.riproduci === "function" && SFX_MAP[type]) {
      try { s.riproduci(SFX_MAP[type]); } catch (e) {}
    }
  }
  function renderVerticalBar() {
    if (!verticalBar) return;
    verticalBar.innerHTML = "";
    Object.values(DATA.verticals).forEach((v) => {
      const btn = document.createElement("button");
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
      chip.className = "station-chip" + (idx === currentStationIdx ? " active" : "");
      chip.textContent = `${s.codice} ${s.titolo}`;
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

  function renderStage(triggerAudio = true) {
    const st = DATA.stations[currentStationIdx];
    const vert = DATA.verticals[currentVerticalId];
    if (!st || !vert || !stageRoot) return;

    if (topbarCount) {
      topbarCount.textContent = `${st.codice} / 08`;
    }

    const demoHtml = st.demoLink
      ? `<button class="demo-cta" id="btn-launch-demo" data-url="${st.demoLink.url}" data-title="${st.demoLink.label}">
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

    const closingHtml =
      currentStationIdx === DATA.stations.length - 1
        ? `<div class="signature-banner">${DATA.brand.chiusura}</div>`
        : "";

    stageRoot.innerHTML = `
      <div class="stage-container">
        <section class="hero-card">
          <div class="hero-media" style="background-image: url('${st.img}')"></div>
          <div class="hero-overlay">
            <span class="station-kicker">Stazione ${st.codice} · Voce ${st.voceNome}</span>
            <h1 class="station-title">${st.titolo}</h1>
            <p class="station-sub">${st.sottotitolo}</p>
            <div class="vertical-context-box">${st.perVerticale[currentVerticalId]}</div>
          </div>
        </section>

        <div class="kpi-grid">${kpiHtml}</div>

        ${demoHtml}

        <div class="section-heading">Moduli della Stazione</div>
        <div class="cards-grid">${cardsHtml}</div>

        <div class="section-heading">Applicazione su ${vert.nome}</div>
        <div class="cards-grid">${verticalModsHtml}</div>

        ${closingHtml}
      </div>
    `;

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

  function enterExperience(session) {
    window.TRINAI_LOCK.activateLock(session);
    if (gateScreen) gateScreen.classList.add("hidden");
    if (appShell) appShell.classList.add("active");
    renderVerticalBar();
    renderStationNav();
    renderStage(true);
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

      const count = 220;
      const geo = new THREE.BufferGeometry();
      const pos = new Float32Array(count * 3);
      for (let i = 0; i < count * 3; i++) {
        pos[i] = (Math.random() - 0.5) * 12;
      }
      geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
      const mat = new THREE.PointsMaterial({ color: 0xd4af37, size: 0.035, transparent: true, opacity: 0.65 });
      const points = new THREE.Points(geo, mat);
      scene.add(points);

      function animate() {
        requestAnimationFrame(animate);
        points.rotation.y += 0.0008;
        points.rotation.x += 0.0003;
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
  if (gateForm) {
    gateForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      if (gateError) gateError.textContent = "";
      const code = gateInput ? gateInput.value : "";
      const session = await window.TRINAI_LOCK.verifyCode(code);
      if (!session) {
        playUiSound("error");
        if (gateError) gateError.textContent = "Codice non riconosciuto o scaduto.";
        return;
      }
      playUiSound("unlock");
      enterExperience(session);
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

  if (btnSoundToggle) {
    btnSoundToggle.addEventListener("click", () => {
      const s = window.suoniCAOS; if (!s) return;
      const on = !btnSoundToggle.classList.contains("active");
      try { on ? s.avviaFondo() : s.fermaFondo(); } catch (e) {}
      btnSoundToggle.classList.toggle("active", on);
      btnSoundToggle.textContent = on ? "Ambiente ON" : "Ambiente OFF";
    });
  }

  if (btnCloseLab) {
    btnCloseLab.addEventListener("click", closeLab);
  }

  // Swipe Mobile tra Stazioni
  document.addEventListener(
    "touchstart",
    (e) => {
      if (e.changedTouches && e.changedTouches[0]) {
        touchStartX = e.changedTouches[0].screenX;
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
      if (Math.abs(dx) > 85) {
        playUiSound("click");
        goToStation(dx < 0 ? currentStationIdx + 1 : currentStationIdx - 1, true);
      }
    },
    { passive: true }
  );

  // Ripristina sessione se già sbloccata nella scheda corrente
  const existing = window.TRINAI_LOCK.getSession();
  if (existing) {
    enterExperience(existing);
  }
})();
