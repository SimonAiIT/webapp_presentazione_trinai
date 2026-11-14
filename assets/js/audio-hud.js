/**
 * TRINAI ATELIER // AUDIO HUD & SOTTOTITOLI SINCRONIZZATI
 * Gestisce la voce narrante alternata Diego / Elsa, i sottotitoli live
 * e il sound design procedurale di suoni.js senza interrompersi su mobile.
 */
(function () {
  "use strict";

  const audioEl = new Audio();
  audioEl.preload = "auto";
  audioEl.playsInline = true;

  let subtitlesMap = {};
  let currentStationId = null;
  let currentSubKey = null;
  let isPlaying = false;
  let onEndedCallback = null;

  async function loadSubtitles() {
    try {
      const res = await fetch("assets/audio/subtitles.json", { cache: "no-store" });
      if (res.ok) {
        subtitlesMap = await res.json();
      }
    } catch {}
  }

  function updateSubtitleUI(timeSec) {
    const subBox = document.getElementById("hud-subtitle-text");
    if (!subBox) return;
    const cues = subtitlesMap[currentSubKey] || [];
    const active = cues.find((c) => timeSec >= c.start && timeSec <= c.end + 0.35);
    if (active) {
      subBox.textContent = active.text;
      subBox.classList.add("visible");
    } else if (!isPlaying) {
      subBox.classList.remove("visible");
    }
  }

  function updatePlayButtonUI() {
    const btn = document.getElementById("hud-play-btn");
    const wave = document.getElementById("hud-voice-wave");
    if (btn) {
      btn.setAttribute("aria-label", isPlaying ? "Pausa narrazione" : "Avvia narrazione");
      btn.dataset.state = isPlaying ? "playing" : "paused";
      btn.textContent = isPlaying ? "Pausa" : "Play";
    }
    if (wave) {
      wave.classList.toggle("active", isPlaying);
    }
  }

  function updateProgressUI() {
    const fill = document.getElementById("hud-audio-progress");
    if (!fill || !audioEl.duration || isNaN(audioEl.duration)) return;
    const pct = Math.min(100, (audioEl.currentTime / audioEl.duration) * 100);
    fill.style.width = pct.toFixed(1) + "%";
  }

  audioEl.addEventListener("timeupdate", () => {
    updateProgressUI();
    updateSubtitleUI(audioEl.currentTime);
  });

  audioEl.addEventListener("ended", () => {
    isPlaying = false;
    updatePlayButtonUI();
    if (typeof onEndedCallback === "function") {
      onEndedCallback();
    }
  });

  audioEl.addEventListener("pause", () => {
    isPlaying = false;
    updatePlayButtonUI();
  });

  audioEl.addEventListener("play", () => {
    isPlaying = true;
    updatePlayButtonUI();
  });

  function playStation(station, autoPlay = true) {
    if (!station) return;
    currentStationId = station.id;
    currentSubKey = "stazione_" + station.codice;

    const speakerBadge = document.getElementById("hud-speaker-badge");
    const speakerName = document.getElementById("hud-speaker-name");
    if (speakerBadge && speakerName) {
      speakerBadge.dataset.voice = station.voce;
      speakerName.textContent = station.voceNome;
    }

    const fill = document.getElementById("hud-audio-progress");
    if (fill) fill.style.width = "0%";

    const subBox = document.getElementById("hud-subtitle-text");
    if (subBox) subBox.textContent = "";

    audioEl.src = station.audio;
    if (autoPlay) {
      audioEl.play().catch(() => {
        isPlaying = false;
        updatePlayButtonUI();
      });
    }
  }

  function togglePlay() {
    if (isPlaying) {
      audioEl.pause();
    } else {
      audioEl.play().catch(() => {});
    }
  }

  function stop() {
    audioEl.pause();
    audioEl.currentTime = 0;
    isPlaying = false;
    updatePlayButtonUI();
  }

  function setOnEnded(cb) {
    onEndedCallback = cb;
  }

  loadSubtitles();

  window.TRINAI_AUDIO_HUD = {
    playStation,
    togglePlay,
    stop,
    setOnEnded
  };
})();
