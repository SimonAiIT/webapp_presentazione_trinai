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
  themeEl.volume = 0.05;

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
    themeEl.volume = speaking ? 0.03 : 0.09;
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
    if (icon) icon.textContent = state === "playing" ? "❚❚" : state === "ended" ? "→" : "▶";
    if (label) label.textContent = state === "playing" ? "Pausa" : state === "ended" ? "Avanti" : "Ascolta";
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

  function playStation(station, autoPlay = true) {
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

  window.TRINAI_AUDIO_HUD = {
    playStation,
    togglePlay,
    toggleTheme,
    startSoundtrack,
    stop,
    getState,
    setOnTime,
    setOnEnded
  };
})();
