// CAOS Suoni della Plancia
// Generazione procedurale dei rumori della nave e dei segnali degli eventi tramite Web Audio API
// Nessun file audio, nessuna libreria esterna, nessun generatore casuale nativo (zero Math.random), nessun innerHTML

(function() {
  'use strict';

  // -------------------------------------------------------------
  // Generatore pseudo casuale deterministico con seme fisso
  // -------------------------------------------------------------
  function creaPrngDeterministico(semeIniziale) {
    let s = (semeIniziale >>> 0) || 314159265;
    return function() {
      s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
      return (s / 4294967296) * 2 - 1; // Intervallo fra meno uno e più uno
    };
  }

  // -------------------------------------------------------------
  // Rilevamento delle preferenze di movimento ridotto
  // -------------------------------------------------------------
  function preferisceMovimentoRidotto() {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }
    return false;
  }

  // -------------------------------------------------------------
  // Stato e persistenza con localStorage in blocco protetto
  // -------------------------------------------------------------
  const CHIAVE_ATTIVO = 'caos_suoni_attivo';
  const CHIAVE_FONDO = 'caos_suoni_volume_fondo';
  const CHIAVE_EVENTI = 'caos_suoni_volume_eventi';

  const stato = {
    attivo: true,
    volumeFondo: 25,
    volumeEventi: 50
  };

  function caricaPreferenze() {
    if (preferisceMovimentoRidotto()) {
      stato.attivo = false;
    }
    try {
      const salvatoAttivo = localStorage.getItem(CHIAVE_ATTIVO);
      if (salvatoAttivo !== null) {
        stato.attivo = (salvatoAttivo === '1' || salvatoAttivo === 'true');
      }
      const salvatoFondo = localStorage.getItem(CHIAVE_FONDO);
      if (salvatoFondo !== null) {
        const nF = parseInt(salvatoFondo, 10);
        if (!isNaN(nF)) stato.volumeFondo = Math.max(0, Math.min(100, nF));
      }
      const salvatoEventi = localStorage.getItem(CHIAVE_EVENTI);
      if (salvatoEventi !== null) {
        const nE = parseInt(salvatoEventi, 10);
        if (!isNaN(nE)) stato.volumeEventi = Math.max(0, Math.min(100, nE));
      }
    } catch (err) {
      // Prosegue con i valori predefiniti se localStorage non e accessibile
    }
  }

  function salvaPreferenze() {
    try {
      localStorage.setItem(CHIAVE_ATTIVO, stato.attivo ? '1' : '0');
      localStorage.setItem(CHIAVE_FONDO, String(stato.volumeFondo));
      localStorage.setItem(CHIAVE_EVENTI, String(stato.volumeEventi));
    } catch (err) {
      // Ignora errori di salvataggio in modalita privata
    }
  }

  // Carica le preferenze salvate
  caricaPreferenze();

  // -------------------------------------------------------------
  // Gestione del contesto audio e avvio solo dopo un gesto
  // -------------------------------------------------------------
  let audioCtx = null;
  let nodiFondo = null;
  let ultimoClicFile = 0;
  const domandeNotificate = new Set();
  let utenteHaInteragito = false;

  function assicuraContestoAudio() {
    if (!audioCtx) {
      const AudioCtxClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtxClass) return null;
      audioCtx = new AudioCtxClass();
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume().catch(function() {});
    }
    return audioCtx;
  }

  function gestisciPrimoGestoUtente() {
    utenteHaInteragito = true;
    const ctx = assicuraContestoAudio();
    if (ctx && ctx.state === 'suspended') {
      ctx.resume().then(function() {
        if (stato.attivo && !nodiFondo) {
          avviaFondo();
        }
      }).catch(function() {});
    } else {
      if (stato.attivo && !nodiFondo) {
        avviaFondo();
      }
    }
  }

  if (typeof window !== 'undefined') {
    window.addEventListener('click', gestisciPrimoGestoUtente, { passive: true, capture: true });
    window.addEventListener('pointerdown', gestisciPrimoGestoUtente, { passive: true, capture: true });
    window.addEventListener('keydown', gestisciPrimoGestoUtente, { passive: true, capture: true });
  }

  // -------------------------------------------------------------
  // Fondo della nave (due oscillatori bassi e rumore filtrato)
  // -------------------------------------------------------------
  function avviaFondo() {
    if (!audioCtx || nodiFondo || !stato.attivo) return;
    if (audioCtx.state === 'suspended') {
      audioCtx.resume().catch(function() {});
    }

    const now = audioCtx.currentTime;

    // Nodo di guadagno principale del fondo
    const masterGainFondo = audioCtx.createGain();
    const volDest = (stato.volumeFondo / 100) * 0.12;
    masterGainFondo.gain.setValueAtTime(0.0001, now);
    masterGainFondo.gain.exponentialRampToValueAtTime(Math.max(0.0001, volDest), now + 1.0);
    masterGainFondo.connect(audioCtx.destination);

    // Primo oscillatore basso a 42.4 Hz
    const osc1 = audioCtx.createOscillator();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(42.4, now);
    const gainOsc1 = audioCtx.createGain();
    gainOsc1.gain.setValueAtTime(0.45, now);
    osc1.connect(gainOsc1);
    gainOsc1.connect(masterGainFondo);

    // Secondo oscillatore basso a 44.1 Hz (stonato di 1.7 Hz per battimento lento naturale)
    const osc2 = audioCtx.createOscillator();
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(44.1, now);
    const gainOsc2 = audioCtx.createGain();
    gainOsc2.gain.setValueAtTime(0.22, now);
    osc2.connect(gainOsc2);
    gainOsc2.connect(masterGainFondo);

    // Buffer di rumore deterministico di 8 secondi (ripetuto in loop continuo senza stacchi)
    const sr = audioCtx.sampleRate || 44100;
    const campioniTotali = sr * 8;
    const bufferRumore = audioCtx.createBuffer(1, campioniTotali, sr);
    const canale = bufferRumore.getChannelData(0);
    const generatore = creaPrngDeterministico(314159);
    let f0 = 0.0;
    let f1 = 0.0;
    for (let i = 0; i < campioniTotali; i++) {
      const r = generatore();
      f0 = 0.98 * f0 + r * 0.07;
      f1 = 0.95 * f1 + r * 0.11;
      canale[i] = (f0 + f1) * 0.75;
    }

    const sorgenteRumore = audioCtx.createBufferSource();
    sorgenteRumore.buffer = bufferRumore;
    sorgenteRumore.loop = true;

    // Filtro passa basso con frequenza centrale a 115 Hz
    const filtroRumore = audioCtx.createBiquadFilter();
    filtroRumore.type = 'lowpass';
    filtroRumore.frequency.setValueAtTime(115, now);
    filtroRumore.Q.setValueAtTime(1.4, now);

    // Modulatore lento 1: frequenza del filtro con periodo 15.15 secondi (0.066 Hz)
    const lfoFiltro = audioCtx.createOscillator();
    lfoFiltro.type = 'sine';
    lfoFiltro.frequency.setValueAtTime(0.066, now);
    const gainLfoFiltro = audioCtx.createGain();
    gainLfoFiltro.gain.setValueAtTime(45, now);
    lfoFiltro.connect(gainLfoFiltro);
    gainLfoFiltro.connect(filtroRumore.frequency);

    // Modulatore lento 2: volume del rumore con periodo 23.80 secondi (0.042 Hz, incommensurato)
    const lfoAmpiezza = audioCtx.createOscillator();
    lfoAmpiezza.type = 'sine';
    lfoAmpiezza.frequency.setValueAtTime(0.042, now);
    const gainLfoAmp = audioCtx.createGain();
    gainLfoAmp.gain.setValueAtTime(0.12, now);
    lfoAmpiezza.connect(gainLfoAmp);

    const gainRumore = audioCtx.createGain();
    gainRumore.gain.setValueAtTime(0.35, now);
    gainLfoAmp.connect(gainRumore.gain);

    sorgenteRumore.connect(filtroRumore);
    filtroRumore.connect(gainRumore);
    gainRumore.connect(masterGainFondo);

    osc1.start(now);
    osc2.start(now);
    sorgenteRumore.start(now);
    lfoFiltro.start(now);
    lfoAmpiezza.start(now);

    nodiFondo = {
      masterGain: masterGainFondo,
      osc1: osc1,
      osc2: osc2,
      sorgenteRumore: sorgenteRumore,
      lfoFiltro: lfoFiltro,
      lfoAmpiezza: lfoAmpiezza,
      filtroRumore: filtroRumore,
      gainRumore: gainRumore
    };
  }

  function fermaFondo() {
    if (!nodiFondo || !audioCtx) {
      nodiFondo = null;
      return;
    }
    const nodi = nodiFondo;
    nodiFondo = null;
    const now = audioCtx.currentTime;
    try {
      nodi.masterGain.gain.setValueAtTime(nodi.masterGain.gain.value, now);
      nodi.masterGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.18);
    } catch (err) {}

    setTimeout(function() {
      try { nodi.osc1.stop(); nodi.osc1.disconnect(); } catch (e) {}
      try { nodi.osc2.stop(); nodi.osc2.disconnect(); } catch (e) {}
      try { nodi.sorgenteRumore.stop(); nodi.sorgenteRumore.disconnect(); } catch (e) {}
      try { nodi.lfoFiltro.stop(); nodi.lfoFiltro.disconnect(); } catch (e) {}
      try { nodi.lfoAmpiezza.stop(); nodi.lfoAmpiezza.disconnect(); } catch (e) {}
      try { nodi.masterGain.disconnect(); } catch (e) {}
    }, 200);
  }

  function aggiornaVolumeFondo() {
    if (!nodiFondo || !audioCtx) return;
    const now = audioCtx.currentTime;
    const volDest = (stato.volumeFondo / 100) * 0.12;
    try {
      nodiFondo.masterGain.gain.cancelScheduledValues(now);
      nodiFondo.masterGain.gain.setValueAtTime(Math.max(0.0001, nodiFondo.masterGain.gain.value), now);
      nodiFondo.masterGain.gain.exponentialRampToValueAtTime(Math.max(0.0001, volDest), now + 0.08);
    } catch (err) {
      nodiFondo.masterGain.gain.value = volDest;
    }
  }

  // -------------------------------------------------------------
  // Sintesi degli eventi sonori (tutti brevi, sotto un secondo)
  // -------------------------------------------------------------
  function ottieniGainEventi(ctx, moltiplicatore) {
    const g = ctx.createGain();
    const volBase = (stato.volumeEventi / 100) * 0.22 * (moltiplicatore || 1);
    g.gain.setValueAtTime(volBase, ctx.currentTime);
    g.connect(ctx.destination);
    return g;
  }

  // 1. Messaggio inviato in chat: trillo morbido ascendente (~0.22s)
  function suonaChatInviato(ctx) {
    const t0 = ctx.currentTime;
    const gainEvento = ottieniGainEventi(ctx, 0.7);
    const note = [523.25, 659.25, 783.99];
    for (let i = 0; i < note.length; i++) {
      const start = t0 + i * 0.055;
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(note[i], start);
      g.gain.setValueAtTime(0.0001, start);
      g.gain.exponentialRampToValueAtTime(0.5, start + 0.015);
      g.gain.exponentialRampToValueAtTime(0.0001, start + 0.11);
      osc.connect(g);
      g.connect(gainEvento);
      osc.start(start);
      osc.stop(start + 0.12);
    }
  }

  // 2. Risposta di CAOS: due note calde (~0.44s)
  function suonaChatRisposta(ctx) {
    const t0 = ctx.currentTime;
    const gainEvento = ottieniGainEventi(ctx, 0.85);
    const filtro = ctx.createBiquadFilter();
    filtro.type = 'lowpass';
    filtro.frequency.setValueAtTime(1400, t0);
    filtro.connect(gainEvento);

    const note = [
      { freq: 349.23, delay: 0.00, durata: 0.20 },
      { freq: 440.00, delay: 0.15, durata: 0.27 }
    ];
    for (let i = 0; i < note.length; i++) {
      const start = t0 + note[i].delay;
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(note[i].freq, start);
      g.gain.setValueAtTime(0.0001, start);
      g.gain.exponentialRampToValueAtTime(0.55, start + 0.025);
      g.gain.exponentialRampToValueAtTime(0.0001, start + note[i].durata);
      osc.connect(g);
      g.connect(filtro);
      osc.start(start);
      osc.stop(start + note[i].durata + 0.02);
    }
  }

  // 3. Lavoro della pipe che parte: ronzio che sale (~0.55s)
  function suonaPipeAvvio(ctx) {
    const t0 = ctx.currentTime;
    const gainEvento = ottieniGainEventi(ctx, 0.75);
    const osc = ctx.createOscillator();
    const filtro = ctx.createBiquadFilter();
    const g = ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(65, t0);
    osc.frequency.exponentialRampToValueAtTime(180, t0 + 0.45);

    filtro.type = 'lowpass';
    filtro.frequency.setValueAtTime(150, t0);
    filtro.frequency.exponentialRampToValueAtTime(620, t0 + 0.45);
    filtro.Q.setValueAtTime(2.0, t0);

    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(0.45, t0 + 0.08);
    g.gain.setValueAtTime(0.45, t0 + 0.35);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.54);

    osc.connect(filtro);
    filtro.connect(g);
    g.connect(gainEvento);
    osc.start(t0);
    osc.stop(t0 + 0.55);
  }

  // 4. File toccato dai costruttori: piccolo clic metallico (al massimo uno ogni due secondi)
  function suonaFileToccato(ctx) {
    const nowMs = performance.now();
    if (nowMs - ultimoClicFile < 2000) return;
    ultimoClicFile = nowMs;

    const t0 = ctx.currentTime;
    const gainEvento = ottieniGainEventi(ctx, 0.5);

    [2650, 3950].forEach(function(f) {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(f, t0);
      g.gain.setValueAtTime(0.4, t0);
      g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.038);
      osc.connect(g);
      g.connect(gainEvento);
      osc.start(t0);
      osc.stop(t0 + 0.04);
    });
  }

  // 5. Domanda di Sonnet per Giuseppe: segnale di attenzione gentile, una sola volta (~0.55s)
  function suonaDomandaSonnet(ctx, idDomanda) {
    if (idDomanda) {
      if (domandeNotificate.has(idDomanda)) return;
      domandeNotificate.add(idDomanda);
    }
    const t0 = ctx.currentTime;
    const gainEvento = ottieniGainEventi(ctx, 0.7);
    const rintocchi = [
      { freq: 659.25, ritardo: 0.00 },
      { freq: 987.77, ritardo: 0.12 }
    ];
    rintocchi.forEach(function(r) {
      const start = t0 + r.ritardo;
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(r.freq, start);
      g.gain.setValueAtTime(0.0001, start);
      g.gain.exponentialRampToValueAtTime(0.5, start + 0.015);
      g.gain.exponentialRampToValueAtTime(0.0001, start + 0.40);
      osc.connect(g);
      g.connect(gainEvento);
      osc.start(start);
      osc.stop(start + 0.42);
    });
  }

  // 6. Lavoro finito e approvato: accordo luminoso (~0.75s)
  function suonaLavoroFinito(ctx) {
    const t0 = ctx.currentTime;
    const gainEvento = ottieniGainEventi(ctx, 0.75);
    const accordo = [523.25, 659.25, 783.99, 1046.50];
    accordo.forEach(function(freq, idx) {
      const start = t0 + idx * 0.036;
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, start);
      g.gain.setValueAtTime(0.0001, start);
      g.gain.exponentialRampToValueAtTime(0.45, start + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, start + 0.58);
      osc.connect(g);
      g.connect(gainEvento);
      osc.start(start);
      osc.stop(start + 0.60);
    });
  }

  // 7. Lavoro fermo o in errore: suono basso e breve (~0.26s)
  function suonaLavoroErrore(ctx) {
    const t0 = ctx.currentTime;
    const gainEvento = ottieniGainEventi(ctx, 0.7);
    const osc = ctx.createOscillator();
    const filtro = ctx.createBiquadFilter();
    const g = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(115, t0);
    osc.frequency.exponentialRampToValueAtTime(80, t0 + 0.22);

    filtro.type = 'lowpass';
    filtro.frequency.setValueAtTime(280, t0);

    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(0.5, t0 + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.24);

    osc.connect(filtro);
    filtro.connect(g);
    g.connect(gainEvento);
    osc.start(t0);
    osc.stop(t0 + 0.25);
  }

  // 8. Monitor di scouting che scende o risale: sibilo idraulico (~0.44s)
  function suonaScoutMovimento(ctx) {
    const t0 = ctx.currentTime;
    const gainEvento = ottieniGainEventi(ctx, 0.65);
    const sr = ctx.sampleRate || 44100;
    const num = Math.floor(sr * 0.44);
    const buf = ctx.createBuffer(1, num, sr);
    const data = buf.getChannelData(0);
    const prng = creaPrngDeterministico(456789);
    for (let i = 0; i < num; i++) {
      data[i] = prng() * 0.6;
    }
    const src = ctx.createBufferSource();
    src.buffer = buf;

    const filtro = ctx.createBiquadFilter();
    filtro.type = 'bandpass';
    filtro.frequency.setValueAtTime(820, t0);
    filtro.frequency.exponentialRampToValueAtTime(290, t0 + 0.40);
    filtro.Q.setValueAtTime(2.2, t0);

    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(0.5, t0 + 0.06);
    g.gain.setValueAtTime(0.45, t0 + 0.24);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.42);

    src.connect(filtro);
    filtro.connect(g);
    g.connect(gainEvento);
    src.start(t0);
    src.stop(t0 + 0.44);
  }

  // 9. Schermo dei contesti che si apre: fruscio (~0.28s)
  function suonaContestiAperto(ctx) {
    const t0 = ctx.currentTime;
    const gainEvento = ottieniGainEventi(ctx, 0.55);
    const sr = ctx.sampleRate || 44100;
    const num = Math.floor(sr * 0.28);
    const buf = ctx.createBuffer(1, num, sr);
    const data = buf.getChannelData(0);
    const prng = creaPrngDeterministico(123890);
    for (let i = 0; i < num; i++) {
      data[i] = prng() * 0.5;
    }
    const src = ctx.createBufferSource();
    src.buffer = buf;

    const filtro = ctx.createBiquadFilter();
    filtro.type = 'highpass';
    filtro.frequency.setValueAtTime(2200, t0);

    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(0.4, t0 + 0.04);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.26);

    src.connect(filtro);
    filtro.connect(g);
    g.connect(gainEvento);
    src.start(t0);
    src.stop(t0 + 0.28);
  }

  function riproduci(nomeEvento, opzioni) {
    if (!stato.attivo) return;
    const ctx = assicuraContestoAudio();
    if (!ctx) return;
    if (ctx.state === 'suspended') {
      ctx.resume().catch(function() {});
    }

    switch (nomeEvento) {
      case 'chat_inviato':
        suonaChatInviato(ctx);
        break;
      case 'chat_risposta':
        suonaChatRisposta(ctx);
        break;
      case 'pipe_avvio':
        suonaPipeAvvio(ctx);
        break;
      case 'file_toccato':
        suonaFileToccato(ctx);
        break;
      case 'domanda_sonnet':
        suonaDomandaSonnet(ctx, opzioni && opzioni.idDomanda);
        break;
      case 'lavoro_finito':
        suonaLavoroFinito(ctx);
        break;
      case 'lavoro_errore':
        suonaLavoroErrore(ctx);
        break;
      case 'scout_movimento':
        suonaScoutMovimento(ctx);
        break;
      case 'contesti_aperto':
        suonaContestiAperto(ctx);
        break;
      default:
        break;
    }
  }

  // -------------------------------------------------------------
  // Sorveglianza periodica di /api/vivo per lavori e file
  // -------------------------------------------------------------
  let ultimoEventoVivoId = null;
  let lavoriPrecedenti = new Set();
  let timerMonitorVivo = null;

  function controllaStatoVivo() {
    if (typeof fetch === 'undefined') return;
    fetch('/api/vivo')
      .then(function(res) {
        if (!res.ok) return null;
        return res.json();
      })
      .then(function(dati) {
        if (!dati || !Array.isArray(dati.lavori)) return;
        const lavori = dati.lavori;
        const idAttuali = new Set();

        for (let i = 0; i < lavori.length; i++) {
          const lav = lavori[i];
          idAttuali.add(lav.id);

          // Lavoro comparso per la prima volta
          if (lavoriPrecedenti.size > 0 && !lavoriPrecedenti.has(lav.id)) {
            riproduci('pipe_avvio');
          }

          // Domanda di Sonnet che aspetta Giuseppe
          if (lav.stato === 'in_attesa_risposte') {
            const idDomanda = lav.id + '_' + (lav.domande ? lav.domande.length : '1');
            riproduci('domanda_sonnet', { idDomanda: idDomanda });
          }

          // File toccato dai costruttori
          if (Array.isArray(lav.eventi) && lav.eventi.length > 0) {
            const ultimoEv = lav.eventi[lav.eventi.length - 1];
            const evId = ultimoEv.file + '_' + ultimoEv.ora;
            if (evId !== ultimoEventoVivoId) {
              ultimoEventoVivoId = evId;
              riproduci('file_toccato');
            }
          }
        }

        lavoriPrecedenti = idAttuali;
      })
      .catch(function() {});
  }

  function avviaSorveglianzaVivo() {
    if (timerMonitorVivo) return;
    controllaStatoVivo();
    timerMonitorVivo = setInterval(controllaStatoVivo, 3000);
  }

  if (typeof window !== 'undefined') {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', avviaSorveglianzaVivo);
    } else {
      avviaSorveglianzaVivo();
    }
  }

  // -------------------------------------------------------------
  // Esposizione dell'interfaccia pubblica
  // -------------------------------------------------------------
  window.suoniCAOS = {
    attiva: function() {
      stato.attivo = true;
      salvaPreferenze();
      utenteHaInteragito = true;
      assicuraContestoAudio();
      if (!nodiFondo) {
        avviaFondo();
      }
    },
    disattiva: function() {
      stato.attivo = false;
      salvaPreferenze();
      fermaFondo();
    },
    impostaVolumeFondo: function(val) {
      stato.volumeFondo = Math.max(0, Math.min(100, Number(val) || 0));
      salvaPreferenze();
      aggiornaVolumeFondo();
    },
    impostaVolumeEventi: function(val) {
      stato.volumeEventi = Math.max(0, Math.min(100, Number(val) || 0));
      salvaPreferenze();
    },
    riproduci: riproduci,
    ottieniStato: function() {
      return {
        attivo: stato.attivo,
        volumeFondo: stato.volumeFondo,
        volumeEventi: stato.volumeEventi,
        contestoInEsecuzione: !!(audioCtx && audioCtx.state === 'running'),
        fondoInEsecuzione: !!nodiFondo
      };
    },
    avviaFondo: avviaFondo,
    fermaFondo: fermaFondo,
    dammiContestoAudio: function() {
      return audioCtx;
    },
    gestisciPrimoGesto: gestisciPrimoGestoUtente
  };

})();
