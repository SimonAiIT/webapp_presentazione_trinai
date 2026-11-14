/**
 * TRINAI ATELIER // AUDIO HUD, COLONNA SONORA LYRIA CON DUCKING & SOTTOTITOLI DOCKED
 * - Voce narrante femminile unificata Elsa masterizzata in studio
 * - Sottotitoli ancorati dentro la plancia inferiore per zero sovrapposizioni su mobile
 * - Colonna sonora cinematografica Lyria con abbassamento automatico del volume durante il parlato
 */
(function () {
  "use strict";

  const voiceEl = new Audio();
  voiceEl.preload = "auto";
  voiceEl.playsInline = true;

  const themeEl = new Audio();
  themeEl.src = "assets/audio/theme.mp3";
  themeEl.loop = true;
  themeEl.preload = "auto";
  themeEl.playsInline = true;
  themeEl.volume = 0.04;

  let subtitlesMap = {};
  let currentSubKey = null;
  let isPlaying = false;
  let isThemeEnabled = true;
  let onEndedCallback = null;
  let hasEnded = false;
  let onTimeCallback = null;

  async function loadSubtitles() {
    try {
      const res = await fetch("assets/audio/subtitles.json", { cache: "no-store" });
      if (res.ok) {
        subtitlesMap = await res.json();
      }
    } catch {}
  }

  function duckTheme(speaking) {
    if (!isThemeEnabled) {
      themeEl.pause();
      return;
    }
    themeEl.volume = speaking ? 0.022 : 0.065;
    if (themeEl.paused) {
      themeEl.play().catch(() => {});
    }
  }

  function updateSubtitleUI(timeSec) {
    const subBox = document.getElementById("hud-subtitle-text");
    if (!subBox) return;
    const cues = subtitlesMap[currentSubKey] || [];
    const active = cues.find((c) => timeSec >= c.start && timeSec <= c.end + 0.4);
    if (active) {
      subBox.textContent = active.text;
      subBox.classList.add("visible");
    } else if (!isPlaying && !subBox.textContent) {
      subBox.classList.remove("visible");
    }
  }

  function updatePlayButtonUI() {
    const btn = document.getElementById("hud-play-btn");
    const icon = document.getElementById("hud-main-icon");
    const label = document.getElementById("hud-main-label");
    const state = isPlaying ? "playing" : hasEnded ? "ended" : "paused";
    if (btn) {
      btn.dataset.state = state;
      btn.setAttribute(
        "aria-label",
        state === "playing" ? "Pausa narrazione" : state === "ended" ? "Vai all'atto successivo" : "Avvia narrazione"
      );
    }
    disegnaPulsanteDestro();
    if (icon) icon.textContent = state === "playing" ? "❚❚" : state === "ended" ? "" : "▶";
    if (label) label.textContent = state === "playing" ? "Metti in pausa" : state === "ended" ? "Avanti" : "Ascolta il racconto";
  }

  function updateProgressUI() {
    const fill = document.getElementById("hud-audio-progress");
    if (!fill || !voiceEl.duration || isNaN(voiceEl.duration)) return;
    const pct = Math.min(100, (voiceEl.currentTime / voiceEl.duration) * 100);
    fill.style.width = pct.toFixed(1) + "%";
  }

  voiceEl.addEventListener("timeupdate", () => {
    updateProgressUI();
    updateSubtitleUI(voiceEl.currentTime);
    if (onTimeCallback) onTimeCallback(voiceEl.currentTime, voiceEl.duration);
  });

  voiceEl.addEventListener("ended", () => {
    isPlaying = false;
    hasEnded = true;
    duckTheme(false);
    updatePlayButtonUI();
    if (typeof onEndedCallback === "function") {
      onEndedCallback();
    }
  });

  voiceEl.addEventListener("pause", () => {
    isPlaying = false;
    duckTheme(false);
    updatePlayButtonUI();
  });

  voiceEl.addEventListener("play", () => {
    isPlaying = true;
    hasEnded = false;
    duckTheme(true);
    updatePlayButtonUI();
  });

  function playStation(station, autoPlay = true, startAt = 0) {
    if (!station) return;
    currentSubKey = "stazione_" + station.codice;
    hasEnded = false;

    const speakerBadge = document.getElementById("hud-speaker-badge");
    const speakerName = document.getElementById("hud-speaker-name");
    if (speakerBadge && speakerName) {
      speakerBadge.dataset.voice = station.voce || "elsa";
      speakerName.textContent = station.voceNome || "Elsa · Voce Atelier";
    }

    const fill = document.getElementById("hud-audio-progress");
    if (fill) fill.style.width = "0%";

    const subBox = document.getElementById("hud-subtitle-text");
    if (subBox) {
      const cues = subtitlesMap[currentSubKey] || [];
      subBox.textContent = cues[0] ? cues[0].text : station.sottotitolo;
      subBox.classList.add("visible");
    }

    voiceEl.src = station.audio;
    if (startAt > 0) {
      const seek = () => {
        voiceEl.removeEventListener("loadedmetadata", seek);
        const d = voiceEl.duration;
        voiceEl.currentTime = d && startAt < d - 4 ? startAt : 0;
      };
      voiceEl.addEventListener("loadedmetadata", seek);
    }
    if (autoPlay) {
      voiceEl.play().catch(() => {
        isPlaying = false;
        updatePlayButtonUI();
      });
    } else {
      isPlaying = false;
      updatePlayButtonUI();
    }
  }

  function togglePlay() {
    if (isPlaying) {
      voiceEl.pause();
    } else {
      voiceEl.play().catch(() => {});
    }
  }

  function toggleTheme() {
    isThemeEnabled = !isThemeEnabled;
    if (!isThemeEnabled) {
      themeEl.pause();
    } else {
      duckTheme(isPlaying);
    }
    return isThemeEnabled;
  }

  function startSoundtrack() {
    if (isThemeEnabled) {
      duckTheme(isPlaying);
    }
  }

  function stop() {
    voiceEl.pause();
    voiceEl.currentTime = 0;
    isPlaying = false;
    duckTheme(false);
    updatePlayButtonUI();
  }

  const CHIAVE_VELOCITA = "trinai_atelier_velocita";
  const VELOCITA = [1, 1.25, 1.5];
  const SVG_AVANTI =
    '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 7l5 5-5 5"/><path d="M13 7l5 5-5 5"/></svg>';
  // Pulsante destro: in pausa porta avanti, in riproduzione cambia la velocita
  function disegnaPulsanteDestro() {
    const btn = document.getElementById("hud-speed-btn");
    if (!btn) return;
    if (isPlaying) {
      btn.textContent = String(voiceEl.defaultPlaybackRate || 1).replace(".", ",") + "×";
      btn.setAttribute("aria-label", "Cambia la velocità della voce");
    } else {
      btn.innerHTML = SVG_AVANTI;
      btn.setAttribute("aria-label", "Vai avanti");
    }
  }
  function applicaVelocita(r) {
    voiceEl.defaultPlaybackRate = r;
    voiceEl.playbackRate = r;
    disegnaPulsanteDestro();
  }
  function cambiaVelocita() {
    let attuale = voiceEl.defaultPlaybackRate || 1;
    let i = VELOCITA.indexOf(attuale);
    const prossima = VELOCITA[(i + 1) % VELOCITA.length];
    applicaVelocita(prossima);
    try { localStorage.setItem(CHIAVE_VELOCITA, String(prossima)); } catch (e) {}
    return prossima;
  }
  function ripristinaVelocita() {
    let r = 1;
    try { r = parseFloat(localStorage.getItem(CHIAVE_VELOCITA)) || 1; } catch (e) {}
    if (VELOCITA.indexOf(r) < 0) r = 1;
    applicaVelocita(r);
  }

  function riparti() {
    voiceEl.currentTime = 0;
    hasEnded = false;
    voiceEl.play().catch(() => {});
  }

  // Mute generale: voce e colonna sonora, ricordato su questo dispositivo
  const CHIAVE_MUTE = "trinai_atelier_mute";
  let muted = false;
  const SVG_ALTOPARLANTE_ON =
    '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 9v6h4l5 4V5L8 9H4z"/><path d="M16.5 9a4.5 4.5 0 010 6"/><path d="M19 6.5a8 8 0 010 11"/></svg>';
  const SVG_ALTOPARLANTE_OFF =
    '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 9v6h4l5 4V5L8 9H4z"/><path d="M17 9.5l5 5"/><path d="M22 9.5l-5 5"/></svg>';
  function applicaMute() {
    voiceEl.muted = muted;
    themeEl.muted = muted;
    const btn = document.getElementById("btn-mute");
    if (btn) {
      btn.innerHTML = muted ? SVG_ALTOPARLANTE_OFF : SVG_ALTOPARLANTE_ON;
      btn.setAttribute("aria-label", muted ? "Riattiva l'audio" : "Disattiva l'audio");
      btn.setAttribute("aria-pressed", muted ? "true" : "false");
    }
  }
  function toggleMute() {
    muted = !muted;
    try { localStorage.setItem(CHIAVE_MUTE, muted ? "1" : "0"); } catch (e) {}
    applicaMute();
    return muted;
  }
  function isMuted() {
    return muted;
  }
  function ripristinaMute() {
    try { muted = localStorage.getItem(CHIAVE_MUTE) === "1"; } catch (e) {}
    applicaMute();
  }

  function getTime() {
    return voiceEl.currentTime || 0;
  }

  function getState() {
    return isPlaying ? "playing" : hasEnded ? "ended" : "paused";
  }

  function setOnTime(cb) {
    onTimeCallback = cb;
  }

  function setOnEnded(cb) {
    onEndedCallback = cb;
  }

  loadSubtitles();
  document.addEventListener("DOMContentLoaded", () => { ripristinaVelocita(); ripristinaMute(); });
  if (document.readyState !== "loading") { ripristinaVelocita(); ripristinaMute(); }

  window.TRINAI_AUDIO_HUD = {
    playStation,
    togglePlay,
    toggleTheme,
    startSoundtrack,
    stop,
    getState,
    getTime,
    toggleMute,
    isMuted,
    cambiaVelocita,
    ripristinaVelocita,
    riparti,
    setOnTime,
    setOnEnded
  };
})();
