/**
 * VICTOR · Polo Arcada Demo — COCKPIT DIREZIONALE
 * ATELIER TRINAI · ENGINE JAVASCRIPT A 60 FPS
 * Conforme alla Direzione di Stile: Sala di Controllo Viva con Grafo Canvas
 */

(function () {
  'use strict';

  // STATO GLOBALE DELL'APPLICAZIONE
  const STATO = {
    vistaAttiva: 'torre',
    sedeAttivaId: 'nodo_alfa',
    nomiInChiaro: true, // true = Dottore vede nomi autentici; false = modalità riservata PZ_
    allarmi: JSON.parse(JSON.stringify(DATI_COCKPIT.allarmi)),
    lezioni: JSON.parse(JSON.stringify(DATI_COCKPIT.memoria.lezioniDaApprovare)),
    activeGraphNode: null,
    draggedNode: null
  };

  // Espone globalmente la navigazione per trigger inline
  window.navToView = function (viewName) {
    cambiaVista(viewName);
  };

  window.selezionaSede = function (sedeId) {
    STATO.sedeAttivaId = sedeId;
    aggiornaDettaglioSede(sedeId);
    cambiaVista('sede');
  };

  // INIZIALIZZAZIONE AL CARICAMENTO DOM
  document.addEventListener('DOMContentLoaded', () => {
    gestisciHashUrl();
    window.addEventListener('hashchange', gestisciHashUrl);
    inizializzaNavigazione();
    inizializzaPrivacyToggle();
    inizializzaGrafoMemoria60FPS();
    inizializzaAlberoBezier();
    inizializzaOrologioAnalogico();
    inizializzaDotMatrixRegole();
    inizializzaMappaCelle46();
    inizializzaMarqueeFeed();
    inizializzaSedeDettaglio();
    inizializzaMappaRete();
    inizializzaSpettroAudio();
    inizializzaAllarmi();
    inizializzaCompagnoChat();
    inizializzaMemoriaCrescita();
    inizializzaCuore();
    inizializzaFiducia();
    gestisciHashUrl();
  });

  /* ==========================================================================
     1. GESTIONE NAVIGAZIONE A 8 TAB & HASH
     ========================================================================== */
  function inizializzaNavigazione() {
    const tabs = document.querySelectorAll('.nav-tab');
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const targetView = tab.getAttribute('data-view');
        cambiaVista(targetView);
      });
    });
  }

  function cambiaVista(viewName) {
    if (!viewName) return;
    STATO.vistaAttiva = viewName;

    // Aggiorna tab
    document.querySelectorAll('.nav-tab').forEach(tab => {
      if (tab.getAttribute('data-view') === viewName) {
        tab.classList.add('active');
      } else {
        tab.classList.remove('active');
      }
    });

    // Aggiorna viste
    document.querySelectorAll('.view-container').forEach(view => {
      if (view.id === `view-${viewName}`) {
        view.classList.add('active');
      } else {
        view.classList.remove('active');
      }
    });

    // Aggiorna hash
    if (window.location.hash !== `#${viewName}`) {
      window.location.hash = `#${viewName}`;
    }

    // Scroll morbido in cima alla vista
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function gestisciHashUrl() {
    const params = new URLSearchParams(window.location.search);
    const vistaParam = params.get('vista');
    const hash = window.location.hash.replace('#', '').trim();
    const v = vistaParam || hash;

    const visteValide = ['torre', 'sede', 'sensi', 'allarmi', 'compagno', 'memoria', 'cuore', 'fiducia'];
    if (visteValide.includes(v)) {
      cambiaVista(v);
    }
  }

  /* ==========================================================================
     2. PRIVACY TOGGLE: NOMI IN CHIARO VS IDENTIFICATIVI PZ_
     ========================================================================== */
  function inizializzaPrivacyToggle() {
    const btn = document.getElementById('btnTogglePrivacy');
    const label = document.getElementById('privacyModeLabel');
    if (!btn || !label) return;

    btn.addEventListener('click', () => {
      STATO.nomiInChiaro = !STATO.nomiInChiaro;
      if (STATO.nomiInChiaro) {
        btn.classList.add('active');
        label.textContent = 'Vista Direzione · Nomi Visibili';
      } else {
        btn.classList.remove('active');
        label.textContent = 'Modalità Riservata (PZ_)';
      }
      aggiornaDettaglioSede(STATO.sedeAttivaId);
      aggiornaAllarmi();
    });
  }

  /* ==========================================================================
     3. HERO PANEL: GRAFO VIVO DELLA MEMORIA DI VICTOR A 60 FPS (700+ NODI)
     ========================================================================== */
  function inizializzaGrafoMemoria60FPS() {
    const canvas = document.getElementById('grafoMemoriaCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let width = 0;
    let height = 0;

    function resize() {
      const rect = canvas.parentElement.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = width * window.devicePixelRatio;
      canvas.height = height * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    }
    resize();
    window.addEventListener('resize', resize);

    // GENERAZIONE NUVOLA DENSA DELLA MEMORIA (700-900 NODI, PROFONDITÀ A LIVELLI)
    const nodes = [];
    const edges = [];
    const pulses = [];
    const sparks = [];

    // 1. Nodo Centrale Victor Core Hub
    const hub = {
      id: 'victor_hub',
      label: 'VICTOR CORE',
      type: 'hub',
      x: width * 0.50,
      y: height * 0.48,
      vx: 0,
      vy: 0,
      r: 15,
      color: '#f97316',
      fixed: true,
      alpha: 1
    };
    nodes.push(hub);

    // 2. Le 10 Sedi Arcada distribuite su tutta la larghezza e altezza con ancoraggi dedicati
    const sediConfig = [
      { id: 'nodo_alfa', nome: 'Polo Alfa HQ', rx: 0.52, ry: 0.52, align: 'right' },
      { id: 'nodo_beta', nome: 'Polo Beta', rx: 0.72, ry: 0.46, align: 'right' },
      { id: 'nodo_gamma', nome: 'Polo Gamma', rx: 0.65, ry: 0.26, align: 'top-right' },
      { id: 'nodo_delta', nome: 'Polo Delta S. Marco', rx: 0.58, ry: 0.78, align: 'bottom' },
      { id: 'nodo_epsilon', nome: 'Polo Epsilon', rx: 0.38, ry: 0.80, align: 'bottom-left' },
      { id: 'vittorio', nome: 'Polo Zeta', rx: 0.50, ry: 0.16, align: 'top' },
      { id: 'nodo_eta', nome: 'Polo Eta', rx: 0.30, ry: 0.22, align: 'top-left' },
      { id: 'nodo_theta', nome: 'Polo Theta', rx: 0.85, ry: 0.32, align: 'top-right' },
      { id: 'nodo_iota', nome: 'Polo Iota', rx: 0.34, ry: 0.46, align: 'left' },
      { id: 'nodo_omega', nome: 'Polo Omega Wimpole St', rx: 0.14, ry: 0.48, align: 'left' }
    ];

    const sedeNodesMap = {};

    sediConfig.forEach(cfg => {
      const sNode = {
        id: `sede_${cfg.id}`,
        sedeId: cfg.id,
        label: cfg.nome,
        type: 'sede',
        x: width * cfg.rx,
        y: height * cfg.ry,
        homeX: width * cfg.rx,
        homeY: height * cfg.ry,
        align: cfg.align,
        vx: 0,
        vy: 0,
        r: 8.5,
        color: '#f97316',
        alpha: 1
      };
      nodes.push(sNode);
      sedeNodesMap[cfg.id] = sNode;

      // Arco principale con il core
      edges.push({
        source: hub,
        target: sNode,
        length: 120,
        strength: 0.03,
        color: 'rgba(249, 115, 22, 0.45)',
        width: 1.4
      });

      // 3. Nodi operativi per ciascuna sede (~28 nodi a clinica = 280 nodi)
      // A. Sensi (Ciano) - 6 nodi
      for (let s = 0; s < 6; s++) {
        const ang = (s / 6) * Math.PI * 2 + Math.random() * 0.4;
        const d = 35 + Math.random() * 45;
        const oNode = {
          id: `senso_${cfg.id}_${s}`,
          type: 'senso',
          x: sNode.x + Math.cos(ang) * d,
          y: sNode.y + Math.sin(ang) * d,
          vx: (Math.random() - 0.5) * 0.2,
          vy: (Math.random() - 0.5) * 0.2,
          r: 3.5,
          color: '#38bdf8',
          alpha: 0.85
        };
        nodes.push(oNode);
        edges.push({ source: sNode, target: oNode, length: d, strength: 0.05, color: 'rgba(56, 189, 248, 0.22)', width: 0.8 });
      }

      // B. Macchine e autoclavi (Verde) - 5 nodi
      for (let m = 0; m < 5; m++) {
        const ang = (m / 5) * Math.PI * 2 + Math.random() * 0.4;
        const d = 40 + Math.random() * 55;
        const mNode = {
          id: `mach_${cfg.id}_${m}`,
          type: 'macchina',
          x: sNode.x + Math.cos(ang) * d,
          y: sNode.y + Math.sin(ang) * d,
          vx: (Math.random() - 0.5) * 0.2,
          vy: (Math.random() - 0.5) * 0.2,
          r: 4,
          color: '#10b981',
          alpha: 0.85
        };
        nodes.push(mNode);
        edges.push({ source: sNode, target: mNode, length: d, strength: 0.04, color: 'rgba(16, 185, 129, 0.22)', width: 0.8 });
      }

      // C. Pazienti in trattamento (Viola) - 12 nodi
      for (let p = 0; p < 12; p++) {
        const ang = (p / 12) * Math.PI * 2 + Math.random() * 0.5;
        const d = 50 + Math.random() * 70;
        const pNode = {
          id: `pz_${cfg.id}_${p}`,
          type: 'paziente',
          x: sNode.x + Math.cos(ang) * d,
          y: sNode.y + Math.sin(ang) * d,
          vx: (Math.random() - 0.5) * 0.2,
          vy: (Math.random() - 0.5) * 0.2,
          r: 3,
          color: '#a855f7',
          alpha: 0.8
        };
        nodes.push(pNode);
        edges.push({ source: sNode, target: pNode, length: d, strength: 0.03, color: 'rgba(168, 85, 247, 0.18)', width: 0.7 });
      }

      // D. Regole & Lezioni (Rosa) - 5 nodi
      for (let r = 0; r < 5; r++) {
        const ang = (r / 5) * Math.PI * 2 + Math.random() * 0.5;
        const d = 45 + Math.random() * 65;
        const rNode = {
          id: `reg_${cfg.id}_${r}`,
          type: 'regola',
          x: sNode.x + Math.cos(ang) * d,
          y: sNode.y + Math.sin(ang) * d,
          vx: (Math.random() - 0.5) * 0.2,
          vy: (Math.random() - 0.5) * 0.2,
          r: 3.2,
          color: '#ec4899',
          alpha: 0.8
        };
        nodes.push(rNode);
        edges.push({ source: sNode, target: rNode, length: d, strength: 0.03, color: 'rgba(236, 72, 153, 0.18)', width: 0.7 });
      }
    });

    // 4. Connessioni sinaptiche incrociate tra cliniche vicine (Maglia di rete)
    const sinapsi = [
      ['nodo_alfa', 'nodo_iota'],
      ['nodo_alfa', 'nodo_epsilon'],
      ['nodo_alfa', 'nodo_gamma'],
      ['nodo_epsilon', 'nodo_delta'],
      ['nodo_gamma', 'vittorio'],
      ['nodo_gamma', 'nodo_beta'],
      ['vittorio', 'nodo_eta'],
      ['nodo_beta', 'nodo_theta'],
      ['nodo_iota', 'nodo_eta'],
      ['nodo_alfa', 'nodo_omega']
    ];

    sinapsi.forEach(([id1, id2]) => {
      const n1 = sedeNodesMap[id1];
      const n2 = sedeNodesMap[id2];
      if (n1 && n2) {
        edges.push({
          source: n1,
          target: n2,
          length: 160,
          strength: 0.015,
          color: 'rgba(249, 115, 22, 0.25)',
          width: 1
        });
      }
    });

    // 5. Profondità di Fondo: Nuvola di 450 micro-nodi diffusi su tutto lo spazio (Background Dust)
    const dustColors = [
      'rgba(56, 189, 248, 0.35)',
      'rgba(249, 115, 22, 0.30)',
      'rgba(168, 85, 247, 0.30)',
      'rgba(16, 185, 129, 0.30)',
      'rgba(201, 162, 75, 0.35)'
    ];

    for (let d = 0; d < 450; d++) {
      const dustNode = {
        id: `dust_${d}`,
        type: 'dust',
        x: 20 + Math.random() * (width - 40),
        y: 20 + Math.random() * (height - 40),
        vx: (Math.random() - 0.5) * 0.15,
        vy: (Math.random() - 0.5) * 0.15,
        r: 1.2 + Math.random() * 1.3,
        color: dustColors[d % dustColors.length],
        alpha: 0.25 + Math.random() * 0.35
      };
      nodes.push(dustNode);

      // Collega occasionalmente ad un nodo vicino per creare filamenti sottili
      if (d % 3 === 0 && d > 2) {
        const prev = nodes[nodes.length - 2];
        const dist = Math.hypot(dustNode.x - prev.x, dustNode.y - prev.y);
        if (dist < 100) {
          edges.push({
            source: dustNode,
            target: prev,
            length: dist,
            strength: 0.005,
            color: 'rgba(255, 255, 255, 0.06)',
            width: 0.5
          });
        }
      }
    }

    // EVENTI LIVE A 1.5 SECONDI CON IMPULSI LUMINOSI & HUD SEGNALATORE
    const eventiClinici = [
      {
        tag: "CHIRURGIA ALL-ON-4",
        title: "Direttore Clinico · Caso Clinico A1",
        detail: "Polo Alfa Chirurgia 1 · Straumann BLX 4.5 guidato · Osteotomia corticale nominale",
        targetNodeId: 'sede_nodo_alfa',
        targetXRatio: 0.52, targetYRatio: 0.52
      },
      {
        tag: "MONITORAGGIO ACUSTICO",
        title: "Compressore Kaeser SX6",
        detail: "Polo Gamma Sala Macchine · Frequenza 53.4 Hz sotto osservazione preventiva",
        targetNodeId: 'sede_nodo_gamma',
        targetXRatio: 0.65, targetYRatio: 0.26
      },
      {
        tag: "PIANO TERAPEUTICO ACCETTATO",
        title: "Dott. Cantice · Caso Clinico B2",
        detail: "Polo Delta San Marco · Accettato Toronto Bridge €14.800 con anteprima 3D",
        targetNodeId: 'sede_nodo_delta',
        targetXRatio: 0.58, targetYRatio: 0.78
      },
      {
        tag: "STERILIZZAZIONE CERTIFICATA",
        title: "Melag Vacuklav 44B+ · 134°C",
        detail: "Polo Epsilon Centrale Sterilizzazione · Pressione 2.18 bar validata da Victor",
        targetNodeId: 'sede_nodo_epsilon',
        targetXRatio: 0.38, targetYRatio: 0.80
      },
      {
        tag: "RICONOSCIMENTO IMPIANTO",
        title: "Computer Vision Impianti",
        detail: "Polo Iota Sala 2 · Straumann BLX verificato e scalato dal magazzino",
        targetNodeId: 'sede_nodo_iota',
        targetXRatio: 0.34, targetYRatio: 0.46
      },
      {
        tag: "DIAGNOSI COMPUTER-GUIDATA",
        title: "Planmeca ProFace 3D",
        detail: "Polo Eta Diagnostica · Acquisizione volumetrica ossea completata",
        targetNodeId: 'sede_nodo_eta',
        targetXRatio: 0.30, targetYRatio: 0.22
      },
      {
        tag: "CANALE POLO OMEGA ATTIVO",
        title: "Avamposto Wimpole Street",
        detail: "Polo Omega · Sincronizzazione 6 sale in tempo reale · Protocollo Victor",
        targetNodeId: 'sede_nodo_omega',
        targetXRatio: 0.14, targetYRatio: 0.48
      }
    ];

    let evIndex = 0;
    const hudEl = document.getElementById('graphHud');
    const hudTag = document.getElementById('hudTag');
    const hudTime = document.getElementById('hudTime');
    const hudTitle = document.getElementById('hudTitle');
    const hudDetail = document.getElementById('hudDetail');

    function scattaEventoClinico() {
      evIndex = (evIndex + 1) % eventiClinici.length;
      const ev = eventiClinici[evIndex];
      const now = new Date();
      const hh = String(now.getHours()).padStart(2, '0');
      const mm = String(now.getMinutes()).padStart(2, '0');
      const ss = String(now.getSeconds()).padStart(2, '0');

      if (hudTag) hudTag.textContent = ev.tag;
      if (hudTime) hudTime.textContent = `${hh}:${mm}:${ss}`;
      if (hudTitle) hudTitle.textContent = ev.title;
      if (hudDetail) hudDetail.textContent = ev.detail;

      // Trova il nodo di destinazione
      const targetNode = sedeNodesMap[ev.targetNodeId.replace('sede_', '')] || hub;
      targetNode.pulseRadius = 26;

      // Invia treno di impulsi luminosi che viaggiano dal Core verso la clinica e i suoi satelliti
      const directEdge = edges.find(e => (e.source === hub && e.target === targetNode) || (e.source === targetNode && e.target === hub));
      if (directEdge) {
        pulses.push({ edge: directEdge, progress: 0, speed: 0.035 });
        setTimeout(() => {
          pulses.push({ edge: directEdge, progress: 0, speed: 0.045 });
        }, 120);
      }

      // Propaga impulsi sui rami periferici della clinica
      const subEdges = edges.filter(e => e.source === targetNode && e.target.type !== 'hub').slice(0, 4);
      subEdges.forEach((se, idx) => {
        setTimeout(() => {
          pulses.push({ edge: se, progress: 0, speed: 0.04 + idx * 0.01 });
          se.target.pulseRadius = 14;
        }, 200 + idx * 80);
      });

      // Sposta morbidamente la posizione dell'HUD verso il quadrante del nodo attivo
      if (hudEl) {
        if (ev.targetXRatio > 0.5) {
          hudEl.style.left = 'auto';
          hudEl.style.right = '16px';
        } else {
          hudEl.style.right = 'auto';
          hudEl.style.left = '220px';
        }
      }
    }

    setInterval(scattaEventoClinico, 1800);

    // Nascita occasionale di un nuovo nodo con lampo di luce (ogni 3.5 secondi)
    setInterval(() => {
      const parentSede = sediConfig[Math.floor(Math.random() * sediConfig.length)];
      const pNode = sedeNodesMap[parentSede.id];
      if (!pNode) return;

      const ang = Math.random() * Math.PI * 2;
      const dist = 30 + Math.random() * 50;
      const newNode = {
        id: `spark_node_${Date.now()}`,
        type: 'evento_dinamico',
        x: pNode.x + Math.cos(ang) * dist,
        y: pNode.y + Math.sin(ang) * dist,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        r: 4.5,
        color: '#c9a24b',
        alpha: 1,
        pulseRadius: 20
      };
      nodes.push(newNode);
      edges.push({ source: pNode, target: newNode, length: dist, strength: 0.04, color: 'rgba(201, 162, 75, 0.4)', width: 1 });

      // Effetto scintilla lampo
      sparks.push({ x: newNode.x, y: newNode.y, r: 24, alpha: 1 });

      // Mantieni il totale controllato potando nodi evento temporanei vecchi
      if (nodes.length > 850) {
        const oldIdx = nodes.findIndex(n => n.type === 'evento_dinamico');
        if (oldIdx !== -1) nodes.splice(oldIdx, 1);
      }
    }, 3500);

    // Interazione Mouse
    let mouseX = -100;
    let mouseY = -100;
    let hoveredNode = null;

    canvas.addEventListener('mousemove', e => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;

      if (STATO.draggedNode) {
        STATO.draggedNode.x = mouseX;
        STATO.draggedNode.y = mouseY;
        STATO.draggedNode.vx = 0;
        STATO.draggedNode.vy = 0;
        return;
      }

      hoveredNode = null;
      for (let n of nodes) {
        if (n.type === 'dust') continue;
        const dx = n.x - mouseX;
        const dy = n.y - mouseY;
        if (dx * dx + dy * dy < (n.r + 8) * (n.r + 8)) {
          hoveredNode = n;
          break;
        }
      }
      canvas.style.cursor = hoveredNode ? 'pointer' : 'grab';
    });

    canvas.addEventListener('mousedown', () => {
      if (hoveredNode) {
        STATO.draggedNode = hoveredNode;
      }
    });

    window.addEventListener('mouseup', () => {
      if (STATO.draggedNode) {
        if (STATO.draggedNode.type === 'sede' && STATO.draggedNode.sedeId) {
          window.selezionaSede(STATO.draggedNode.sedeId);
        }
        STATO.draggedNode = null;
      }
    });

    // SIMULAZIONE FISICA OTTIMIZZATA & RENDER 60 FPS
    function loop() {
      ctx.clearRect(0, 0, width, height);

      // Griglia tecnica di precisione
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.02)';
      ctx.lineWidth = 1;
      const step = 40;
      for (let x = 0; x < width; x += step) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += step) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // 1. Dinamica a molle degli archi primari e operativi
      edges.forEach(e => {
        if (e.source.type === 'dust' && e.target.type === 'dust') return;
        const dx = e.target.x - e.source.x;
        const dy = e.target.y - e.source.y;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;
        const force = (dist - e.length) * e.strength;
        const fx = (dx / dist) * force;
        const fy = (dy / dist) * force;

        if (e.source !== hub && e.source !== STATO.draggedNode) {
          e.source.vx += fx;
          e.source.vy += fy;
        }
        if (e.target !== STATO.draggedNode) {
          e.target.vx -= fx;
          e.target.vy -= fy;
        }
      });

      // 2. Repulsione orizzontale/verticale limitata alle cliniche per evitare sovrapposizioni
      for (let i = 1; i <= 10; i++) {
        const n1 = nodes[i];
        if (!n1) continue;
        for (let j = i + 1; j <= 10; j++) {
          const n2 = nodes[j];
          if (!n2) continue;
          const dx = n2.x - n1.x;
          const dy = n2.y - n1.y;
          const dSq = dx * dx + dy * dy || 1;
          if (dSq < 28000) {
            const push = 60 / dSq;
            n1.vx -= (dx / Math.sqrt(dSq)) * push;
            n1.vy -= (dy / Math.sqrt(dSq)) * push;
            n2.vx += (dx / Math.sqrt(dSq)) * push;
            n2.vy += (dy / Math.sqrt(dSq)) * push;
          }
        }
      }

      // 3. Spostamento, viscosità e richiamo alle posizioni ideali
      nodes.forEach(n => {
        if (n === hub) {
          n.x = width * 0.50;
          n.y = height * 0.48;
          return;
        }

        if (n === STATO.draggedNode) return;

        if (n.type === 'sede') {
          // Attrazione morbida alla sua home geografica per garantire leggibilità
          const hdx = n.homeX - n.x;
          const hdy = n.homeY - n.y;
          n.vx += hdx * 0.015;
          n.vy += hdy * 0.015;
        }

        if (n.type === 'dust') {
          // Lieve moto browniano armonico
          n.x += n.vx;
          n.y += n.vy;
          if (n.x < 15 || n.x > width - 15) n.vx *= -1;
          if (n.y < 15 || n.y > height - 15) n.vy *= -1;
          return;
        }

        n.vx *= 0.86;
        n.vy *= 0.86;
        n.x += n.vx;
        n.y += n.vy;

        n.x = Math.max(25, Math.min(width - 25, n.x));
        n.y = Math.max(25, Math.min(height - 25, n.y));
      });

      // 4. Disegno Archi (Maglia di filamenti)
      edges.forEach(e => {
        ctx.beginPath();
        ctx.moveTo(e.source.x, e.source.y);
        ctx.lineTo(e.target.x, e.target.y);
        ctx.strokeStyle = e.color;
        ctx.lineWidth = e.width || 0.8;
        ctx.stroke();
      });

      // 5. Disegno Scintille di Nascita Nodi
      for (let s = sparks.length - 1; s >= 0; s--) {
        const sp = sparks[s];
        ctx.beginPath();
        ctx.arc(sp.x, sp.y, sp.r, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(201, 162, 75, ${sp.alpha})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();
        sp.r += 0.8;
        sp.alpha -= 0.035;
        if (sp.alpha <= 0) sparks.splice(s, 1);
      }

      // 6. Disegno e Aggiornamento Fotoni / Pacchetti Luminosi
      for (let p = pulses.length - 1; p >= 0; p--) {
        const pulse = pulses[p];
        pulse.progress += pulse.speed;
        if (pulse.progress >= 1) {
          pulses.splice(p, 1);
          continue;
        }
        const px = pulse.edge.source.x + (pulse.edge.target.x - pulse.edge.source.x) * pulse.progress;
        const py = pulse.edge.source.y + (pulse.edge.target.y - pulse.edge.source.y) * pulse.progress;

        ctx.beginPath();
        ctx.arc(px, py, 3.2, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.shadowColor = '#f97316';
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      // 7. Disegno Nodi
      nodes.forEach(n => {
        // Onde di pulsazione su eventi
        if (n.pulseRadius && n.pulseRadius > 0) {
          ctx.beginPath();
          ctx.arc(n.x, n.y, n.r + n.pulseRadius, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(249, 115, 22, ${n.pulseRadius / 26})`;
          ctx.lineWidth = 2;
          ctx.stroke();
          n.pulseRadius -= 0.5;
        }

        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fillStyle = n.color;

        if (n === hub || n.type === 'sede') {
          ctx.shadowColor = n.color;
          ctx.shadowBlur = 14;
        }
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      // 8. DISEGNO ETICHETTE A PILLOLA SULLE SEDI (LIVELLO SUPERIORE ANTI-SOVRAPPOSIZIONE)
      nodes.forEach(n => {
        if (n.type !== 'sede' && n.type !== 'hub') return;

        ctx.font = "700 10px 'JetBrains Mono', monospace";
        const txt = n.label;
        const textW = ctx.measureText(txt).width;
        const padX = 7;
        const pillW = textW + padX * 2;
        const pillH = 17;

        let pillX = n.x - pillW / 2;
        let pillY = n.y + n.r + 7;

        // Ancoraggio geometrico anti-collisione calibrato per ogni sede
        if (n.align === 'top') {
          pillX = n.x - pillW / 2;
          pillY = n.y - n.r - 22;
        } else if (n.align === 'bottom') {
          pillX = n.x - pillW / 2;
          pillY = n.y + n.r + 9;
        } else if (n.align === 'right') {
          pillX = n.x + n.r + 8;
          pillY = n.y - pillH / 2;
        } else if (n.align === 'left') {
          pillX = n.x - n.r - pillW - 8;
          pillY = n.y - pillH / 2;
        } else if (n.align === 'top-right') {
          pillX = n.x + n.r + 6;
          pillY = n.y - n.r - 18;
        } else if (n.align === 'top-left') {
          pillX = n.x - n.r - pillW - 6;
          pillY = n.y - n.r - 18;
        } else if (n.align === 'bottom-left') {
          pillX = n.x - n.r - pillW - 6;
          pillY = n.y + n.r + 8;
        }

        // Rettangolo pillola pieno ad alto contrasto per non essere mai coperto dai nodi
        ctx.fillStyle = '#070b13';
        ctx.strokeStyle = n.color;
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.roundRect(pillX, pillY, pillW, pillH, 3);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#f8fafc';
        ctx.fillText(txt, pillX + padX, pillY + 12);
      });

      requestAnimationFrame(loop);
    }

    requestAnimationFrame(loop);
  }

  /* ==========================================================================
     4. PANNELLO 02: ALBERO DEI LOBI & 10 SEDI (PILLOLE CHIARE INTERE IN SVG)
     ========================================================================== */
  function inizializzaAlberoBezier() {
    const svg = document.getElementById('treeBezierSvg');
    if (!svg) return;

    const startX = 64;
    const startY = 130;
    const endX = 300;
    const sedi = DATI_COCKPIT.sedi;
    const rowHeight = 230 / (sedi.length - 1);

    // Nodo Victor a sinistra dentro pillola intera non tagliata
    let html = `
      <!-- Nodo e Pillola Victor Hub -->
      <rect x="8" y="117" width="56" height="26" rx="3" fill="#080d15" stroke="#f97316" stroke-width="1.5" />
      <circle cx="20" cy="130" r="4" fill="#f97316" />
      <text x="29" y="134" font-family="'JetBrains Mono'" font-size="9" font-weight="800" fill="#f97316">VICTOR</text>
    `;

    sedi.forEach((s, i) => {
      const targetY = 16 + i * rowHeight;
      const cp1X = startX + 110;
      const cp1Y = startY;
      const cp2X = endX - 80;
      const cp2Y = targetY;

      const pathData = `M ${startX} ${startY} C ${cp1X} ${cp1Y}, ${cp2X} ${cp2Y}, ${endX} ${targetY}`;
      const color = s.semaforo === 'verde' ? '#10b981' : '#f97316';
      const pillW = 200;
      const pillH = 20;

      html += `
        <path d="${pathData}" fill="none" stroke="rgba(56, 189, 248, 0.35)" stroke-width="1.2" />
        <g style="cursor: pointer;" onclick="window.selezionaSede('${s.id}')">
          <rect x="${endX}" y="${targetY - 10}" width="${pillW}" height="${pillH}" rx="3" fill="#0c111a" stroke="${color}" stroke-width="1.2" />
          <circle cx="${endX + 10}" cy="${targetY}" r="3.5" fill="${color}" />
          <text x="${endX + 20}" y="${targetY + 4}" font-family="'JetBrains Mono'" font-size="10" font-weight="600" fill="#f8fafc">${s.nome} · ${s.poltroneCount} sale</text>
        </g>
      `;
    });

    svg.innerHTML = html;
  }

  /* ==========================================================================
     5. PANNELLO 05: OROLOGIO ANALOGICO A 24H E DOT MATRIX REGOLE
     ========================================================================== */
  function inizializzaOrologioAnalogico() {
    const hand = document.getElementById('clockHand');
    if (!hand) return;

    function update() {
      const now = new Date();
      const hours = now.getHours() + now.getMinutes() / 60;
      // 24 ore su 360 gradi = 15 gradi all'ora
      const angle = (hours / 24) * 360 - 90;
      const rad = (angle * Math.PI) / 180;
      const cx = 60;
      const cy = 60;
      const len = 34;
      const x2 = cx + Math.cos(rad) * len;
      const y2 = cy + Math.sin(rad) * len;

      hand.setAttribute('x2', x2);
      hand.setAttribute('y2', y2);
    }
    update();
    setInterval(update, 10000);
  }

  function inizializzaDotMatrixRegole() {
    const grid = document.getElementById('rulesDotGrid');
    if (!grid) return;

    let html = '';
    for (let i = 0; i < 48; i++) {
      let state = 'lit-cyan';
      if (i % 5 === 0) state = 'lit-pink';
      if (i % 7 === 0) state = 'lit-green';
      html += `<div class="dot-cell ${state}"></div>`;
    }
    grid.innerHTML = html;

    // Fai pulsare alcuni pallini casualmente per dinamismo visivo
    setInterval(() => {
      const cells = grid.querySelectorAll('.dot-cell');
      const rndIdx = Math.floor(Math.random() * cells.length);
      cells[rndIdx].style.opacity = Math.random() > 0.5 ? '1' : '0.2';
    }, 400);
  }

  /* ==========================================================================
     6. PANNELLO 06: MAPPA A CELLE DELLE 46 POLTRONE CHIRURGICHE
     ========================================================================== */
  function inizializzaMappaCelle46() {
    const grid = document.getElementById('postazioniGrid46');
    if (!grid) return;

    let html = '';
    let count = 0;

    DATI_COCKPIT.sedi.forEach(s => {
      s.sale.forEach(sala => {
        count++;
        let css = 'cell-surgery';
        if (sala.stato === 'in_sanificazione') css = 'cell-sanitizing';
        else if (sala.stato === 'libera') css = 'cell-free';
        else if (sala.procedura.toLowerCase().includes('visita') || sala.procedura.toLowerCase().includes('igiene')) css = 'cell-visit';

        const label = `${s.nome.substring(0, 2).toUpperCase()}-${sala.id}`;
        html += `
          <div class="postazione-cell ${css}" title="${s.nome}: ${sala.nome} (${sala.procedura})" onclick="window.selezionaSede('${s.id}')">
            ${label}
          </div>
        `;
      });
    });

    grid.innerHTML = html;
  }

  /* ==========================================================================
     7. LIVE MARQUEE NEWS FEED A PIÈ DI PAGINA
     ========================================================================== */
  function inizializzaMarqueeFeed() {
    const track = document.getElementById('liveMarqueeTrack');
    if (!track) return;

    const news = [
      { time: '13:46:12', tag: 'POLO ALFA', text: 'Chirurgia All-on-4 Sala 1: completato inserimento 4 impianti Straumann BLX da Direttore Clinico' },
      { time: '13:45:01', tag: 'POLO GAMMA', text: 'Compressore Kaeser SX6: frequenza monitorata a 53.4 Hz, parametri di sicurezza nominali' },
      { time: '13:43:20', tag: 'POLO DELTA', text: 'Accettato piano di riabilitazione arcata superiore con Toronto Bridge in zirconia (€14.800)' },
      { time: '13:41:15', tag: 'POLO EPSILON', text: 'Centrale sterilizzazione: ciclo autoclave 134°C registrato con successo (32/32 lotti conformi)' },
      { time: '13:38:50', tag: 'POLO OMEGA', text: 'Wimpole Street: sincronizzazione WireGuard nominale a 24.2 ms, prima visita delle 14:00 pronta' },
      { time: '13:35:40', tag: 'POLO BETA', text: 'Sensore perimetrale pelle: passaggio automatico a protocollo diurno verificato' },
      { time: '13:32:00', tag: 'POLO ETA', text: 'CBCT 3D Planmeca: acquisita scansione volumetrica per chirurgia guidata computerizzata' },
      { time: '13:28:10', tag: 'POLO IOTA', text: 'Richiamo igiene orale: 8 pazienti hanno confermato lappuntamento tramite recall automatico' }
    ];

    let itemsHtml = '';
    // Duplica l'array per garantire scorrimento infinito continuo
    [...news, ...news].forEach(n => {
      itemsHtml += `
        <div class="news-item">
          <span class="news-time">${n.time}</span>
          <span class="news-tag">${n.tag}</span>
          <span>${n.text}</span>
          <span class="news-sep">◆</span>
        </div>
      `;
    });

    track.innerHTML = itemsHtml;
  }

  /* ==========================================================================
     8. VISTA 02: SEDE NEL DETTAGLIO
     ========================================================================== */
  function inizializzaSedeDettaglio() {
    const strip = document.getElementById('sediTabStrip');
    if (!strip) return;

    let html = '';
    DATI_COCKPIT.sedi.forEach(s => {
      const activeClass = s.id === STATO.sedeAttivaId ? 'active' : '';
      const semClass = s.semaforo === 'verde' ? 'sem-verde' : s.semaforo === 'ambra' ? 'sem-ambra' : 'sem-rosso';
      html += `
        <button type="button" class="btn-sede-tab ${activeClass}" data-sede="${s.id}" onclick="window.selezionaSede('${s.id}')">
          <span class="semaforo-dot ${semClass}"></span>
          ${s.nome} (${s.poltroneCount})
        </button>
      `;
    });
    strip.innerHTML = html;

    aggiornaDettaglioSede(STATO.sedeAttivaId);
  }

  function aggiornaDettaglioSede(sedeId) {
    const sede = DATI_COCKPIT.sedi.find(s => s.id === sedeId) || DATI_COCKPIT.sedi[0];
    STATO.sedeAttivaId = sede.id;

    // Aggiorna bottoni sede
    document.querySelectorAll('.btn-sede-tab').forEach(b => {
      if (b.getAttribute('data-sede') === sede.id) b.classList.add('active');
      else b.classList.remove('active');
    });

    // Aggiorna Hero
    const dNome = document.getElementById('sedeDettNome');
    const dInd = document.getElementById('sedeDettIndirizzo');
    const dSt = document.getElementById('sedeDettStatus');
    const dSat = document.getElementById('sedeDettSaturazione');
    const dPv = document.getElementById('sedeDettPrimeVisite');
    const dInc = document.getElementById('sedeDettIncasso');

    if (dNome) dNome.textContent = `${sede.nome} — ${sede.denominazioneUfficiale || 'Clinica Odontoiatrica'}`;
    if (dInd) dInd.textContent = `${sede.indirizzo}, ${sede.cap || ''} ${sede.citta || ''} · Direttore Sanitario: ${sede.direttoreSanitario}`;
    if (dSt) dSt.textContent = `● ${sede.statusMotivo}`;
    if (dSat) dSat.textContent = `${sede.saturazioneOggi}%`;
    if (dPv) dPv.textContent = `${sede.primeVisiteOggi} visite`;
    if (dInc) dInc.textContent = `${(sede.incassiOggi || 0).toLocaleString('it-IT')} €`;

    // Aggiorna Sale Grid
    const saleContainer = document.getElementById('saleContainer');
    if (saleContainer) {
      let saleHtml = '';
      sede.sale.forEach(sala => {
        let tagCss = 'tag-chirurgia';
        let statusLabel = 'In Intervento';
        if (sala.stato === 'in_sanificazione') { tagCss = 'tag-sanificazione'; statusLabel = 'In Sanificazione'; }
        else if (sala.stato === 'libera') { tagCss = 'tag-libera'; statusLabel = 'Libera Pronta'; }
        else if (sala.stato === 'occupata') { tagCss = 'tag-occupata'; statusLabel = 'Occupata'; }

        const pazienteDisplay = STATO.nomiInChiaro ? sala.paziente : sala.codicePz;

        saleHtml += `
          <div class="sala-card">
            <div class="sala-card-top">
              <span class="sala-id-badge">${sala.nome}</span>
              <span class="sala-status-tag ${tagCss}">${statusLabel}</span>
            </div>
            <div class="sala-procedure">${sala.procedura}</div>
            <div style="font-family: var(--font-mono); font-size: 11px; color: var(--text-secondary);">
              Operatore: <strong style="color: var(--text-primary);">${sala.operatore}</strong> · Orario: ${sala.orario} (${sala.fineStimata})
            </div>
            <div class="sala-patient-info">
              <span>Paziente: <strong class="pz-name" title="Codice: ${sala.codicePz}">${pazienteDisplay}</strong></span>
              <span class="pz-code">${sala.codicePz}</span>
            </div>
          </div>
        `;
      });
      saleContainer.innerHTML = saleHtml;
    }

    // Aggiorna Agenda Table
    const agendaBody = document.getElementById('agendaTableBody');
    if (agendaBody) {
      let agendaHtml = '';
      (sede.agendaGiornata || []).forEach(ag => {
        const pzLabel = STATO.nomiInChiaro ? ag.paziente : ag.codicePz;
        agendaHtml += `
          <tr>
            <td><strong>${ag.ora}</strong></td>
            <td><span style="color: var(--accent-orange);">${ag.sala}</span></td>
            <td>${ag.procedura}</td>
            <td><strong style="color: var(--accent-gold);">${pzLabel}</strong></td>
            <td><code class="payload-code">${ag.codicePz}</code></td>
            <td><span class="sala-status-tag tag-libera">${ag.stato}</span></td>
          </tr>
        `;
      });
      agendaBody.innerHTML = agendaHtml || '<tr><td colspan="6" style="text-align: center; color: var(--text-muted);">Nessuna seduta schedulata</td></tr>';
    }

    // Aggiorna Sala Macchine
    const machinesGrid = document.getElementById('machinesGrid');
    if (machinesGrid) {
      let machHtml = '';
      const macchine = [
        { nome: 'Compressore Kaeser SX6', stato: sede.id === 'nodo_gamma' ? 'Scostamento armonico' : 'Regime Nominale', vibrazione: sede.id === 'nodo_gamma' ? '4.2 mm/s' : '0.42 mm/s', t: '48.2 °C' },
        { nome: 'Autoclave Melag Vacuklav 44B+', stato: '100% Conforme', cicli: '4 cicli oggi (134°C)', p: '2.18 bar' },
        { nome: 'Centrale Aspirazione Cattani', stato: 'In aspirazione', vuoto: '-0.22 bar', db: '48 dB(A)' },
        { nome: 'Gruppo Continuità Riello UPS', stato: 'Batterie Cariche (100%)', autonom: '45 minuti', carico: '28%' }
      ];

      macchine.forEach(m => {
        machHtml += `
          <div class="machine-card">
            <div class="machine-name">${m.nome}</div>
            <div class="machine-status" style="color: ${m.stato.includes('Scostamento') ? 'var(--accent-orange)' : 'var(--accent-green)'};">● ${m.stato}</div>
            ${m.vibrazione ? `<div class="machine-metric-row"><span>Vibrazione cuscinetti:</span><strong>${m.vibrazione}</strong></div>` : ''}
            ${m.t ? `<div class="machine-metric-row"><span>Temperatura testa:</span><strong>${m.t}</strong></div>` : ''}
            ${m.cicli ? `<div class="machine-metric-row"><span>Cicli di sterilizzazione:</span><strong>${m.cicli}</strong></div>` : ''}
            ${m.p ? `<div class="machine-metric-row"><span>Pressione vapore frazionato:</span><strong>${m.p}</strong></div>` : ''}
            ${m.vuoto ? `<div class="machine-metric-row"><span>Depressione aspirazione:</span><strong>${m.vuoto}</strong></div>` : ''}
            ${m.db ? `<div class="machine-metric-row"><span>Rumore acustico:</span><strong>${m.db}</strong></div>` : ''}
            ${m.autonom ? `<div class="machine-metric-row"><span>Autonomia residua:</span><strong>${m.autonom}</strong></div>` : ''}
          </div>
        `;
      });
      machinesGrid.innerHTML = machHtml;
    }

    aggiornaMappaRete(sede.id);
  }

  /* ==========================================================================
     8B. MAPPA VETTORIALE STILIZZATA RETE TERRITORIALE + POLO OMEGA INSET
     ========================================================================== */
  function inizializzaMappaRete() {
    aggiornaMappaRete(STATO.sedeAttivaId);
  }

  function aggiornaMappaRete(activeSedeId) {
    const svg = document.getElementById('reteMapSvg');
    if (!svg) return;

    const sedi = DATI_COCKPIT.sedi;

    // Linee di collegamento tra sedi del Rete Territoriale
    let linesHtml = '';
    const nodo_alfa = sedi.find(s => s.id === 'nodo_alfa');
    if (nodo_alfa && nodo_alfa.mapCoords) {
      sedi.forEach(s => {
        if (s.id !== 'nodo_alfa' && s.id !== 'nodo_omega' && s.mapCoords) {
          linesHtml += `
            <line x1="${nodo_alfa.mapCoords.x}" y1="${nodo_alfa.mapCoords.y}" x2="${s.mapCoords.x}" y2="${s.mapCoords.y}" stroke="rgba(56, 189, 248, 0.2)" stroke-width="1.2" stroke-dasharray="3,3" />
          `;
        }
      });
    }

    // Punti sedi
    let dotsHtml = '';
    sedi.forEach(s => {
      if (!s.mapCoords) return;
      const isActive = s.id === activeSedeId;
      const color = s.semaforo === 'verde' ? '#10b981' : '#f97316';
      const r = isActive ? 7 : 4.5;

      dotsHtml += `
        <g style="cursor: pointer;" onclick="window.selezionaSede('${s.id}')">
          ${isActive ? `<circle cx="${s.mapCoords.x}" cy="${s.mapCoords.y}" r="12" fill="none" stroke="#f97316" stroke-width="1.5" opacity="0.6" />` : ''}
          <circle cx="${s.mapCoords.x}" cy="${s.mapCoords.y}" r="${r}" fill="${isActive ? '#f97316' : color}" />
          <text x="${s.mapCoords.labelX || (s.mapCoords.x + 8)}" y="${s.mapCoords.labelY || (s.mapCoords.y + 4)}" font-family="'JetBrains Mono'" font-size="${isActive ? 11 : 9.5}" font-weight="${isActive ? '800' : '500'}" fill="${isActive ? '#f97316' : '#94a3b8'}">${s.nome}</text>
        </g>
      `;
    });

    // Inset Polo Omega (Wimpole Street)
    const londonInsetHtml = `
      <rect x="15" y="15" width="130" height="90" rx="3" fill="#0c111a" stroke="rgba(201, 162, 75, 0.4)" stroke-width="1" />
      <text x="25" y="32" font-family="'JetBrains Mono'" font-size="8.5" font-weight="700" fill="#c9a24b" letter-spacing="0.5">REGNO UNITO · INSET</text>
      <text x="25" y="44" font-family="'JetBrains Mono'" font-size="7.5" fill="#64748b">18 Wimpole St, London</text>
      <line x1="15" y1="52" x2="145" y2="52" stroke="rgba(255, 255, 255, 0.08)" />
      <g style="cursor: pointer;" onclick="window.selezionaSede('nodo_omega')">
        <circle cx="45" cy="74" r="${activeSedeId === 'nodo_omega' ? 6 : 4}" fill="${activeSedeId === 'nodo_omega' ? '#f97316' : '#10b981'}" />
        <text x="56" y="78" font-family="'JetBrains Mono'" font-size="10" font-weight="700" fill="${activeSedeId === 'nodo_omega' ? '#f97316' : '#f8fafc'}">Polo Omega HQ</text>
      </g>
    `;

    svg.innerHTML = `
      <!-- Sfondo stilizzato Rete Territoriale -->
      <path d="M 220 50 L 320 60 L 410 140 L 420 220 L 340 330 L 260 340 L 230 290 Z" fill="rgba(255, 255, 255, 0.015)" stroke="rgba(255, 255, 255, 0.05)" stroke-width="1" />
      ${linesHtml}
      ${dotsHtml}
      ${londonInsetHtml}
    `;
  }

  /* ==========================================================================
     9. VISTA 03: SPETTRO AUDIO ANIMATO PER I SENSI
     ========================================================================== */
  function inizializzaSpettroAudio() {
    const spPoloGamma = document.getElementById('spectrumPoloGamma');
    const spPoloAlfa = document.getElementById('spectrumPoloAlfa');

    function createBars(container, isAnomaly) {
      if (!container) return;
      let html = '';
      for (let i = 0; i < 24; i++) {
        const height = isAnomaly && i > 14 && i < 18 ? 85 : Math.floor(20 + Math.random() * 40);
        html += `<span class="spectrum-bar" style="height: ${height}%; background-color: ${isAnomaly && i > 14 && i < 18 ? '#f97316' : '#38bdf8'}"></span>`;
      }
      container.innerHTML = html;
    }

    createBars(spPoloGamma, true);
    createBars(spPoloAlfa, false);

    setInterval(() => {
      createBars(spPoloGamma, true);
      createBars(spPoloAlfa, false);
    }, 800);
  }

  /* ==========================================================================
     10. VISTA 04: ALLARMI E DECISIONI (CONFERMA UMANA DEL DOTTORE)
     ========================================================================== */
  function inizializzaAllarmi() {
    aggiornaAllarmi();
  }

  function aggiornaAllarmi() {
    const container = document.getElementById('alarmsContainer');
    if (!container) return;

    let openCount = 0;
    let html = '';

    (STATO.allarmi || []).forEach((al, idx) => {
      const isConfirmed = al.confermato === true || al.stato === 'risolto';
      if (!isConfirmed) openCount++;
      const sensoLabel = al.senso || al.loboRilevatore || 'Lobi Attivi';
      const confidenzaVal = al.confidenza || al.confidenzaPercentuale || 94.2;
      const sedeText = al.sedeNome || al.sede || 'Polo Arcada Demo';
      const pzLabel = STATO.nomiInChiaro ? (al.paziente || al.codicePz || 'Paziente') : (al.codicePz || 'PZ_');

      html += `
        <div class="alarm-cert-card ${isConfirmed ? 'resolved' : ''}">
          <div class="alarm-content">
            <div class="alarm-meta-header">
              <span class="alarm-lobo-pill">${sensoLabel.toUpperCase()}</span>
              <span>${sedeText}</span>
              <span style="color: var(--accent-pink);">Confidenza: ${confidenzaVal}%</span>
              <span>Rilevato da: ${al.rilevatoDaMinuti ? al.rilevatoDaMinuti + ' min' : '34 min'}</span>
            </div>
            <div class="alarm-title">${al.titolo}</div>
            <div class="alarm-desc">${al.descrizione}</div>
            ${al.paziente || al.codicePz ? `<div style="font-family: var(--font-mono); font-size: 11px; color: var(--accent-gold);">Paziente associato: ${pzLabel} (${al.codicePz || ''})</div>` : ''}
            <div class="alarm-proposal">
              <strong>PROPOSTA DI VICTOR:</strong> ${al.propostaVictor}
            </div>
          </div>
          <div class="alarm-actions">
            ${isConfirmed 
              ? `<span style="font-family: var(--font-mono); color: var(--accent-green); font-size: 11px;">✓ CONFERMATO DAL DOTTORE</span>`
              : `<button type="button" class="btn-confirm-doctor" onclick="window.confermaAllarme(${idx})">
                   ${al.azioneRichiesta || 'Conferma del Dottore →'}
                 </button>`
            }
          </div>
        </div>
      `;
    });

    container.innerHTML = html;

    // Aggiorna contatore testata e badge
    const hdrCnt = document.getElementById('hdrCntAllarmi');
    const navBadge = document.getElementById('navBadgeAllarmi');
    if (hdrCnt) hdrCnt.textContent = openCount;
    if (navBadge) navBadge.textContent = openCount;
  }

  window.confermaAllarme = function (index) {
    if (STATO.allarmi[index]) {
      STATO.allarmi[index].confermato = true;
      STATO.allarmi[index].stato = 'risolto';
      aggiornaAllarmi();
    }
  };

  /* ==========================================================================
     11. VISTA 05: COMPAGNO DIREZIONALE INTERATTIVO
     ========================================================================== */
  function inizializzaCompagnoChat() {
    const stream = document.getElementById('chatStream');
    const input = document.getElementById('chatInputField');
    const btnSend = document.getElementById('btnSendChat');
    const chipsContainer = document.getElementById('suggestedChipsContainer');
    const btnMic = document.getElementById('btnMicChat');

    if (!stream) return;

    // Messaggi iniziali
    const initialMsgs = [
      {
        sender: 'victor',
        time: '13:30',
        text: 'Buon pomeriggio Direttore Clinico. Sono Victor, il tuo compagno direzionale per il Gruppo Polo Arcada Demo. Tutte le 10 sedi sono collegate. Come posso supportare le decisioni cliniche e gestionali di oggi?'
      }
    ];

    function renderMessages() {
      stream.innerHTML = initialMsgs.map(m => `
        <div class="msg-item ${m.sender === 'user' ? 'msg-user' : 'msg-victor'}">
          <div class="msg-meta">${m.sender === 'user' ? 'Direzione' : 'Victor'} · ${m.time}</div>
          <div class="msg-bubble">${m.text}</div>
        </div>
      `).join('');
      stream.scrollTop = stream.scrollHeight;
    }
    renderMessages();

    // Render chips suggerite
    if (chipsContainer) {
      chipsContainer.innerHTML = DATI_COCKPIT.chat.domandeSuggerite.map(q => `
        <button type="button" class="chip-btn" onclick="window.inviaDomandaChat('${q.replace(/'/g, "\\'")}')">
          ${q}
        </button>
      `).join('');
    }

    function elaboraRisposta(testoUtente) {
      const q = testoUtente.toLowerCase();
      let rispostaTrovata = null;

      for (let k in DATI_COCKPIT.chat.rispostePredefinite) {
        const item = DATI_COCKPIT.chat.rispostePredefinite[k];
        if (item.keywords.some(kw => q.includes(kw))) {
          rispostaTrovata = item.testo;
          break;
        }
      }

      if (!rispostaTrovata) {
        rispostaTrovata = `Ho analizzato i flussi in tempo reale delle 10 sedi. Per la richiesta specifica "${testoUtente}", posso confermarti che l'efficienza complessiva è all'84.6%, gli incassi attuali ammontano a 68.400 € e non risultano blocchi critici non segnalati in sala operatoria.`;
      }

      const now = new Date();
      const hh = String(now.getHours()).padStart(2, '0');
      const mm = String(now.getMinutes()).padStart(2, '0');

      initialMsgs.push({
        sender: 'victor',
        time: `${hh}:${mm}`,
        text: rispostaTrovata
      });
      renderMessages();
    }

    window.inviaDomandaChat = function (testo) {
      if (!testo) return;
      const now = new Date();
      const hh = String(now.getHours()).padStart(2, '0');
      const mm = String(now.getMinutes()).padStart(2, '0');

      initialMsgs.push({
        sender: 'user',
        time: `${hh}:${mm}`,
        text: testo
      });
      renderMessages();

      setTimeout(() => elaboraRisposta(testo), 400);
    };

    if (btnSend && input) {
      btnSend.addEventListener('click', () => {
        const val = input.value.trim();
        if (val) {
          window.inviaDomandaChat(val);
          input.value = '';
        }
      });

      input.addEventListener('keydown', e => {
        if (e.key === 'Enter') {
          btnSend.click();
        }
      });
    }

    if (btnMic) {
      btnMic.addEventListener('click', () => {
        btnMic.style.backgroundColor = '#f97316';
        btnMic.style.color = '#000';
        input.value = "Come sta andando oggi la saturazione a Polo Gamma e a Polo Alfa?";
        setTimeout(() => {
          btnMic.style.backgroundColor = '';
          btnMic.style.color = '';
          btnSend.click();
        }, 800);
      });
    }
  }

  /* ==========================================================================
     12. VISTA 06: MEMORIA E CRESCITA (RICHIESTE VICTOR & LEZIONI DA APPROVARE)
     ========================================================================== */
  function inizializzaMemoriaCrescita() {
    // Richieste per TrinAI
    const reqContainer = document.getElementById('richiesteVictorContainer');
    if (reqContainer && DATI_COCKPIT.memoria && DATI_COCKPIT.memoria.richiesteAlTeamTrinAI) {
      reqContainer.innerHTML = DATI_COCKPIT.memoria.richiesteAlTeamTrinAI.map(r => {
        const isAlta = (r.priorita || '').toLowerCase().includes('alta');
        return `
          <div class="subbox-terminal">
            <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
              <strong style="color: var(--text-primary); font-size: 11.5px;">${r.oggetto || r.titolo || ''}</strong>
              <span class="alarm-lobo-pill" style="background: ${isAlta ? 'var(--accent-orange)' : 'var(--accent-cyan)'};">${isAlta ? 'ALTA PRIORITÀ' : 'MEDIA PRIORITÀ'}</span>
            </div>
            <div style="color: var(--text-secondary); line-height: 1.4; margin-bottom: 6px;">${r.testo || r.descrizione || ''}</div>
            <div style="font-size: 9.5px; color: var(--accent-gold);">Stato: ${r.stato}</div>
          </div>
        `;
      }).join('');
    }

    // Lezioni da Approvare
    aggiornaLezioni();

    // Lezioni Storiche
    const storicheContainer = document.getElementById('lezioniStoricheContainer');
    if (storicheContainer) {
      storicheContainer.innerHTML = DATI_COCKPIT.memoria.lezioniStoricheAdottate.map(l => `
        <div class="subbox-terminal">
          <div style="font-weight: 700; color: var(--accent-green); margin-bottom: 3px;">✓ ${l.titolo}</div>
          <div style="color: var(--text-secondary); line-height: 1.4; margin-bottom: 4px;">${l.risultato}</div>
          <div style="font-size: 10px; color: var(--text-muted);">Origine: ${l.origine} → Estesa a: ${l.estesaA} (${l.dataAdozione})</div>
        </div>
      `).join('');
    }
  }

  function aggiornaLezioni() {
    const container = document.getElementById('lessonsContainer');
    if (!container) return;

    container.innerHTML = STATO.lezioni.map((lz, idx) => {
      const isApproved = lz.stato === 'approvata';
      const isRejected = lz.stato === 'scartata';

      return `
        <div class="lesson-card">
          <div class="lesson-grid-fields">
            <div class="lesson-field">
              <div class="lesson-field-label">CUE (SEGNALE TRIGGER)</div>
              <div class="lesson-field-val">${lz.cue}</div>
            </div>
            <div class="lesson-field">
              <div class="lesson-field-label">LESSON (REGOLA PROPOSTA DA VICTOR)</div>
              <div class="lesson-field-val">${lz.lesson}</div>
            </div>
            <div class="lesson-field">
              <div class="lesson-field-label">EVIDENCE (EVIDENZA OSSERVATA)</div>
              <div class="lesson-field-val">${lz.evidence}</div>
            </div>
            <div class="lesson-field">
              <div class="lesson-field-label">CONFIDENCE &amp; STATO</div>
              <div class="lesson-field-val">
                <span class="confidence-meter">Grado di Fiducia: <strong>${lz.confidence}%</strong></span>
              </div>
            </div>
          </div>
          <div class="lesson-footer-actions">
            <div>
              ${isApproved ? '<span style="color: var(--accent-green); font-weight: 700;">✓ APPROVATA DAL DOTTORE E INTEGRATA IN MEMORIA</span>' : ''}
              ${isRejected ? '<span style="color: var(--text-muted); font-weight: 700;">✗ SCARTATA</span>' : ''}
              ${!isApproved && !isRejected ? '<span style="color: var(--text-secondary); font-size: 11px;">In attesa di ratifica direzionale</span>' : ''}
            </div>
            ${!isApproved && !isRejected ? `
              <div class="lesson-btn-group">
                <button type="button" class="btn-lesson-approve" onclick="window.approvaLezione(${idx})">Approva e Diffondi su 10 Sedi</button>
                <button type="button" class="btn-lesson-reject" onclick="window.scartaLezione(${idx})">Scarta</button>
              </div>
            ` : ''}
          </div>
        </div>
      `;
    }).join('');
  }

  window.approvaLezione = function (idx) {
    if (STATO.lezioni[idx]) {
      STATO.lezioni[idx].stato = 'approvata';
      aggiornaLezioni();
    }
  };

  window.scartaLezione = function (idx) {
    if (STATO.lezioni[idx]) {
      STATO.lezioni[idx].stato = 'scartata';
      aggiornaLezioni();
    }
  };

  /* ==========================================================================
     13. VISTA 07: CUORE (PREFERENZE PAZIENTI & TABELLA AGGREGATA)
     ========================================================================== */
  function inizializzaCuore() {
    const tbody = document.getElementById('cuoreTableBody');
    if (!tbody) return;

    tbody.innerHTML = DATI_COCKPIT.cuore.dettaglioPerSede.map(d => `
      <tr>
        <td><strong style="color: var(--text-primary);">${d.sede}</strong></td>
        <td><span style="color: var(--accent-green); font-weight: 700;">${d.attesaMedia}</span></td>
        <td><span style="color: var(--accent-cyan);">${d.comfortAcustico}</span></td>
        <td>${d.preferenzaRender}</td>
        <td><span style="color: var(--accent-gold);">${d.stile}</span></td>
      </tr>
    `).join('');
  }

  /* ==========================================================================
     14. VISTA 08: FIDUCIA E CONFORMITÀ
     ========================================================================== */
  function inizializzaFiducia() {
    const tableBody = document.getElementById('cloudPayloadTableBody');
    if (tableBody) {
      tableBody.innerHTML = DATI_COCKPIT.fiducia.registroPayloadCloud.map(p => `
        <tr>
          <td><strong>${p.ora}</strong></td>
          <td><span style="color: var(--accent-cyan);">${p.tipo}</span></td>
          <td>${p.nodo}</td>
          <td><code class="payload-code">${p.payloadTrasmesso}</code></td>
          <td style="color: var(--text-muted); font-size: 10.5px;">${p.note}</td>
        </tr>
      `).join('');
    }

    // Sonno Ciclo
    const sonnoBody = document.getElementById('sonnoCicloBody');
    if (sonnoBody) {
      const s = DATI_COCKPIT.fiducia.sonnoDiVictor;
      sonnoBody.innerHTML = `
        <div style="font-family: var(--font-mono); font-size: 11.5px; color: var(--text-secondary); margin-bottom: 12px;">
          Orario programmato: <strong>${s.orarioNotturno}</strong> · Backup: ${s.ultimoBackup}
        </div>
        <div class="memory-subboxes-grid" style="grid-template-columns: 1fr; gap: 8px;">
          ${s.fasiCiclo.map(f => `
            <div class="subbox-terminal" style="display: flex; justify-content: space-between;">
              <span><strong>${f.ora}</strong> — ${f.fase}</span>
              <span style="color: var(--accent-green);">${f.stato}</span>
            </div>
          `).join('')}
        </div>
        <div style="font-family: var(--font-mono); font-size: 10px; color: var(--text-muted); margin-top: 10px; word-break: break-all;">
          Integrità SHA-512: ${s.integritaHash}
        </div>
      `;
    }

    // Rack Telemetria
    const rackBody = document.getElementById('rackTelemetryBody');
    if (rackBody) {
      const r = DATI_COCKPIT.fiducia.telemetriaServer;
      rackBody.innerHTML = `
        <div class="memory-subboxes-grid" style="grid-template-columns: repeat(2, 1fr); gap: 10px;">
          <div class="subbox-terminal">
            <div class="subbox-name">Temperatura CPU Media</div>
            <div class="subbox-val" style="color: var(--accent-green);">${r.cpuTempMedia}</div>
          </div>
          <div class="subbox-terminal">
            <div class="subbox-name">Temperatura GPU Edge</div>
            <div class="subbox-val" style="color: var(--accent-green);">${r.gpuEdgeTemp}</div>
          </div>
          <div class="subbox-terminal">
            <div class="subbox-name">Storage NVMe Usato</div>
            <div class="subbox-val">${r.storageNvmeUsato}</div>
          </div>
          <div class="subbox-terminal">
            <div class="subbox-name">Uptime Certificato</div>
            <div class="subbox-val" style="color: var(--accent-cyan);">${r.uptimeSistema}</div>
          </div>
          <div class="subbox-terminal">
            <div class="subbox-name">Latenza LAN Nodi Locali</div>
            <div class="subbox-val" style="color: var(--accent-green);">${r.latenzaReteNodiLocali}</div>
          </div>
          <div class="subbox-terminal">
            <div class="subbox-name">Canale Polo Omega Wimpole St</div>
            <div class="subbox-val" style="color: var(--accent-cyan);">${r.canaleOmegaLatenza}</div>
          </div>
        </div>
      `;
    }
  }

})();
