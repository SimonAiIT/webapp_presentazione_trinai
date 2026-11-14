/**
 * TRINAI ATELIER // DATI AGNOSTICI E VERTICALI
 * Estratti canonici da Carta dei Servizi TrinAI S.r.l. e Manifest Verticali
 * Regole editoriali: zero TheWALL, zero duepunti e zero parentesi nelle etichette visibili.
 */

window.TRINAI_DATA = {
  brand: {
    formula: "Victor + Harness + Monolito Hardware = Agente Speciale",
    chiusura: "Nessun agente speciale veste di serie.",
    sla: [
      { label: "Residenza Dati", value: "100% Unione Europea" },
      { label: "Privacy Operativa", value: "Zero-PII verso AI terze" },
      { label: "Disponibilità", value: "99,8% mensile garantito" },
      { label: "Crittografia", value: "TLS 1.3 · AES-256 · HMAC-SHA256" }
    ]
  },

  verticals: {
    trasversale: {
      id: "trasversale",
      nome: "Atelier Trasversale",
      tag: "TrinAI S.r.l. · Startup Innovativa",
      colore: "#d4af37",
      riassunto: "Ingegneria dei sistemi cibernetici, digital twin operativi, intelligence camerale e app sovrane su misura.",
      kpi: [
        { valore: "6", label: "Pilastri di Servizio" },
        { valore: "100% UE", label: "Sovranità Dati" },
        { valore: "0-60s", label: "Onboarding Cold-Start" }
      ],
      moduli: [
        { titolo: "Piattaforma Sovrana SiTeBoS", desc: "Business Operating System comportamentale con 6 moduli nativi per processi, finanza e sicurezza D.Lgs 81." },
        { titolo: "Intelligence OpenAPI CCIAA", desc: "Connettori ufficiali Registro Imprese, scoring rischio credito, market radar territoriale ed ETL." },
        { titolo: "Custom App Telegram e Mongo", desc: "WebApp a barriera zero con firma crittografica HMAC-SHA256 per squadre sul campo." },
        { titolo: "Consulenza EU AI Act", desc: "Classificazione rischio, dossier FRIA e DPIA, perizie Industria 4.0 e Transizione 5.0." }
      ]
    },
    arcada: {
      id: "arcada",
      nome: "Arcada · Clinico",
      tag: "Agente Speciale per Studi e Cliniche",
      colore: "#38bdf8",
      riassunto: "AgentOS sovrano su rete locale per studi odontoiatrici e poliambulatori senza inviare dati clinici all'esterno.",
      kpi: [
        { valore: "26 Voci", label: "Controlling CLC" },
        { valore: "3 Fasi", label: "Comunicazione Riunito" },
        { valore: "0 Byte", label: "Dati Clinici in Cloud" }
      ],
      moduli: [
        { titolo: "Segreteria Deterministica", desc: "Richiami e conferme su WhatsApp e Telegram governati da regole certe senza allucinazioni." },
        { titolo: "Controllo di Gestione CLC", desc: "Ventisei voci calcolate da script deterministici su margine orario, saturazione e incassi." },
        { titolo: "Preventivatore Vivo A4", desc: "Tre opzioni chiare al riunito con simulatore rate e pulsante di controllo per il paziente." },
        { titolo: "Consiglio Direzionale e STL", desc: "Valutazione casi 3D a otto viste e supporto decisionale locale per il direttore clinico." }
      ]
    },
    sinter: {
      id: "sinter",
      nome: "Sinter · Laboratorio",
      tag: "Agente Speciale per Laboratori CAD CAM",
      colore: "#a78bfa",
      riassunto: "AgentOS per laboratori odontotecnici, centri di fresaggio e tracciabilità dispositivi medici su misura.",
      kpi: [
        { valore: "17", label: "Lavorazioni Standard" },
        { valore: "MDR", label: "Conformità UE 2017/745" },
        { valore: "LAN", label: "Ponte Diretto Arcada" }
      ],
      moduli: [
        { titolo: "Commesse e Modelli 3D STL", desc: "Ricezione file STL con segmentazione MeshSegNet locale su GPU dedicata." },
        { titolo: "Listino Interattivo Tecnico", desc: "Diciassette lavorazioni standardizzate con tempi ciclo e distinta materiali." },
        { titolo: "Tracciabilità Lotti MDR", desc: "Schede lotto e certificazione materiali conformi al regolamento europeo 2017/745." },
        { titolo: "Ponte Bidirezionale LAN", desc: "Sincronizzazione protetta con gli studi clinici su stato lavorazione e consegne." }
      ]
    },
    vinea: {
      id: "vinea",
      nome: "Vinea · Agritech",
      tag: "Agente Speciale per Viticoltura di Precisione",
      colore: "#34d399",
      riassunto: "Stazione mobile e controllo filiera per cantine e aziende agricole con guida autonoma e zero cloud terzi.",
      kpi: [
        { valore: "RTK", label: "Guida GNSS e LiDAR" },
        { valore: "254nm", label: "Trattamento UV-C" },
        { valore: "QR", label: "Scheda Lotto Cantina" }
      ],
      moduli: [
        { titolo: "Mezzo Cingolato Autonomo", desc: "Autopilota ArduPilot Rover con sterzo differenziale, GNSS RTK e LiDAR interfila." },
        { titolo: "Monitoraggio per Pianta", desc: "Mappa filare, stima grappoli, vigore chioma e visione locale senza connessione." },
        { titolo: "UV-C e Spruzzo Mirato", desc: "Monoblocco UV-C notturno anti-oidio e trattamento localizzato con arresto di sicurezza." },
        { titolo: "Quaderno di Campagna", desc: "Registrazione automatica a regole da note vocali Whisper e scheda lotto QR per la cantina." }
      ]
    }
  },

  stations: [
    {
      id: "briefing",
      codice: "00",
      titolo: "L'Atelier e la Formula",
      sottotitolo: "Architettura Sovrana su Misura",
      voce: "diego",
      voceNome: "Diego",
      audio: "assets/audio/stazione_00.mp3",
      img: "assets/img/regia_sala.jpg",
      narrazione: "Benvenuto nell'Atelier TrinAI. Non vendiamo software preconfezionati a canone. Progettiamo Agenti Speciali unendo il pattern neurale Victor, il guscio di sicurezza locale Harness e un Monolito Hardware dedicato. Ogni dato sensibile resta dentro la tua sede.",
      sottotitoli: [
        { start: 0.0, end: 2.3, text: "Benvenuto nell'Atelier TrinAI." },
        { start: 2.3, end: 5.5, text: "Non vendiamo software preconfezionati a canone." },
        { start: 5.5, end: 11.4, text: "Progettiamo Agenti Speciali unendo Victor, il guscio Harness e un Monolito Hardware dedicato." },
        { start: 11.4, end: 15.2, text: "Ogni dato sensibile resta dentro la tua sede." }
      ],
      schede: [
        { badge: "Pilastro 01", titolo: "Sovranità Digitale 100% UE", testo: "Gateway Zero-PII prima di qualsiasi inferenza e cluster esclusivamente europei." },
        { badge: "Pilastro 02", titolo: "Interfacce a Frizione Zero", testo: "Operatività sul campo tramite cruscotti sintetici e Telegram MiniApp crittografate." },
        { badge: "Pilastro 03", titolo: "Controllo Predittivo", testo: "Trasformiamo l'azienda in un sistema cibernetico che previene errori e fermi." },
        { badge: "Pilastro 04", titolo: "Competenza AI Literacy", testo: "Formazione certificata Articolo 4 EU AI Act integrata nel percorso." }
      ],
      perVerticale: {
        trasversale: "Sei pilastri operativi dalla Carta dei Servizi per PMI, studi professionali e gruppi multi-sede.",
        arcada: "Configurazione Arcada per cliniche e studi odontoiatrici con separazione totale tra dati clinici e rete esterna.",
        sinter: "Configurazione Sinter per laboratori odontotecnici con gestione file STL e tracciabilità MDR.",
        vinea: "Configurazione Vinea per cantine e filiere agricole con stazione locale e mezzi autonomi."
      }
    },
    {
      id: "regia",
      codice: "01",
      titolo: "La Sala di Regia",
      sottotitolo: "Monolito Hardware e Collaudo",
      voce: "diego",
      voceNome: "Diego",
      audio: "assets/audio/stazione_01.mp3",
      img: "assets/img/casa_presidio.jpg",
      narrazione: "Ogni installazione nasce da un audit preliminare e da una sala di regia locale. Il Monolito Hardware viene configurato, collaudato presso i nostri laboratori e consegnato pronto per operare anche senza connessione internet.",
      sottotitoli: [
        { start: 0.0, end: 4.8, text: "Ogni installazione nasce da un audit preliminare e da una sala di regia locale." },
        { start: 4.8, end: 10.6, text: "Il Monolito Hardware viene configurato e collaudato nei nostri laboratori prima della consegna." },
        { start: 10.6, end: 14.5, text: "Progettato per continuare a funzionare anche senza collegamento esterno." }
      ],
      schede: [
        { badge: "Scheda 01", titolo: "Progettazione su Misura", testo: "Audit preliminare da remoto e rilievo in sede con verbale firmato e punti aperti assegnati." },
        { badge: "Scheda 03", titolo: "Fornitura Hardware Dedicata", testo: "Postazioni operative, nodo locale, archivio ridondato e continuità elettrica." },
        { badge: "Scheda 04", titolo: "Installazione in Serie", testo: "Due specialisti per sede, collaudo completo e avviamento guidato della squadra." }
      ],
      perVerticale: {
        trasversale: "Architettura locale con backup cifrato e ripristino automatico notturno in caso di anomalia.",
        arcada: "Nodo clinico in segreteria separato dai riuniti, con archivio diagnostico residente in sede.",
        sinter: "Server di laboratorio ottimizzato per calcolo GPU locale su modelli 3D e commesse.",
        vinea: "Server di cantina con collegamento di campo verso i mezzi autonomi e i sensori di vigneto."
      }
    },
    {
      id: "rete",
      codice: "02",
      titolo: "La Rete e i Nodi",
      sottotitolo: "Presidio Multi-Sede e Continuità",
      voce: "elsa",
      voceNome: "Elsa",
      audio: "assets/audio/stazione_02.mp3",
      img: "assets/img/clinica_struttura.jpg",
      narrazione: "Quando un gruppo cresce su più sedi, la complessità esplode. TrinAI collega ogni nodo operativo in un cruscotto unico di confronto, mantenendo i dati sensibili confinati nella sede in cui nascono.",
      sottotitoli: [
        { start: 0.0, end: 4.5, text: "Quando un gruppo cresce su più sedi, la complessità esplode." },
        { start: 4.5, end: 9.8, text: "TrinAI collega ogni nodo operativo in un cruscotto unico di confronto." },
        { start: 9.8, end: 13.8, text: "I dati sensibili restano sempre confinati nella sede in cui nascono." }
      ],
      schede: [
        { badge: "Scheda 02", titolo: "Supervisione Dodici Mesi", testo: "Presidio sistemistico da remoto, manutenzione periodica e rilascio nuove ricette operative." },
        { badge: "Scheda 16", titolo: "Assistenza Tracciata", testo: "Canale sicuro attivato solo con consenso del titolare e registro completo delle attività." },
        { badge: "Continuità", titolo: "Aggiornamenti Notturni", testo: "Rollback automatico alla versione precedente se un controllo rileva un'anomalia." }
      ],
      perVerticale: {
        trasversale: "Confronto prestazioni tra filiali, preparazione ordini centralizzata e accesso sicuro fuori sede.",
        arcada: "Dieci o più cliniche sincronizzate su un unico quadro direzionale senza spostare immagini TAC.",
        sinter: "Ponte bidirezionale cifrato tra laboratorio odontotecnico e studi clinici collegati.",
        vinea: "Collegamento tra appezzamenti, stazione meteo-sensoriale e cantina centrale."
      }
    },
    {
      id: "precisione",
      codice: "03",
      titolo: "Strumenti di Precisione",
      sottotitolo: "Calcolo Spaziale 3D e Controllo Umano",
      voce: "elsa",
      voceNome: "Elsa",
      audio: "assets/audio/stazione_03.mp3",
      img: "assets/img/clinica_riunito.jpg",
      narrazione: "L'intelligenza artificiale propone e prepara, ma non sostituisce mai il professionista. Ogni misura dichiara il proprio margine di incertezza e ogni decisione critica richiede conferma umana.",
      sottotitoli: [
        { start: 0.0, end: 4.8, text: "L'intelligenza artificiale propone e prepara, ma non sostituisce mai il professionista." },
        { start: 4.8, end: 10.6, text: "Ogni misura dichiara il proprio margine di incertezza e ogni passo critico attende conferma umana." }
      ],
      demoLink: { label: "Apri Laboratorio 3D Interattivo", url: "arkangel_viewer/index.html" },
      schede: [
        { badge: "Principio", titolo: "Controllo Umano Permanente", testo: "Supervisione umana nativa, nessuna azione non annullabile parte senza conferma." },
        { badge: "Visione 3D", titolo: "Calcolo Spaziale Proprietario", testo: "Rendering Three.js in tempo reale con punti di repere e misure trasparenti." },
        { badge: "Determinismo", titolo: "Zero Allucinazioni sui Numeri", testo: "Calcoli economici, scorte e dosaggi eseguiti da script certificati, mai da modelli linguistici." }
      ],
      perVerticale: {
        trasversale: "Separazione netta tra calcolo deterministico dei numeri e supporto linguistico controllato.",
        arcada: "Dettatura vocale a mani libere al riunito, mappatura 3D e riconoscimento componenti.",
        sinter: "Segmentazione automatica STL su MeshSegNet e verifica spessori prima del fresaggio.",
        vinea: "Sensori LiDAR e telecamere multispettrali con arresto di sicurezza automatico in presenza di persone."
      }
    },
    {
      id: "risorse",
      codice: "04",
      titolo: "Risorse e Magazzino",
      sottotitolo: "Tracciabilità Lotti e Controllo Margini",
      voce: "diego",
      voceNome: "Diego",
      audio: "assets/audio/stazione_04.mp3",
      img: "assets/img/stage_magazzino.jpg",
      narrazione: "Basta inventari manuali a fine mese o rotture di stock improvvise. Il sistema riconosce i materiali sul vassoio, traccia lotti e scadenze e prepara gli ordini prima che le scorte finiscano.",
      sottotitoli: [
        { start: 0.0, end: 4.6, text: "Basta inventari manuali a fine mese o rotture di stock improvvise." },
        { start: 4.6, end: 10.2, text: "Il sistema riconosce i materiali, traccia lotti e scadenze e prepara gli ordini in anticipo." }
      ],
      schede: [
        { badge: "Scheda 08", titolo: "Controllo di Gestione 26 Voci", testo: "Costi diretti, laboratorio, cassa, marginalità oraria e bilancio previsionale a 3-6 mesi." },
        { badge: "Automazione", titolo: "Scarico Senza Riprendere Persone", testo: "Camera stretta sul solo vassoio operativo, senza registrazione video né riconoscimento facciale." },
        { badge: "Manutenzione", titolo: "Ascolto Acustico Macchine", testo: "Analisi armonica su compressori e impianti per prevedere i guasti prima del fermo." }
      ],
      perVerticale: {
        trasversale: "Gestione commesse, logistica predittiva, scadenzario DPI e controllo margini orari.",
        arcada: "Tracciabilità completa impianti e cicli autoclave collegati alla scheda operativa.",
        sinter: "Gestione materie prime, dischi zirconia e tracciabilità lotti MDR 2017/745.",
        vinea: "Quaderno di campagna automatico, consumo prodotti e schede lotto QR verso la cantina."
      }
    },
    {
      id: "orchestra",
      codice: "05",
      titolo: "Squadra e Formazione",
      sottotitolo: "Ruolo, Delega e Conformità AI Act",
      voce: "elsa",
      voceNome: "Elsa",
      audio: "assets/audio/stazione_05.mp3",
      img: "assets/img/stage_personale.jpg",
      narrazione: "La tecnologia fallisce se la squadra non la adotta. TrinAI distingue il ruolo e mai la persona, misura le dinamiche di delega e certifica l'alfabetizzazione obbligatoria prevista dall'AI Act europeo.",
      sottotitoli: [
        { start: 0.0, end: 4.0, text: "La tecnologia fallisce se la squadra non la adotta." },
        { start: 4.0, end: 10.8, text: "TrinAI distingue il ruolo e mai la persona, e certifica l'alfabetizzazione prevista dall'AI Act." }
      ],
      schede: [
        { badge: "Scheda 13", titolo: "Certificazione Art. 4 AI Act", testo: "Percorso formativo con verifica finale e attestati nominali per il fascicolo di conformità." },
        { badge: "HR Advisory", titolo: "Matrice 150 Soft Skill", testo: "Assessment scenario-based e cross-matching tra titolare e team per sbloccare la delega." },
        { badge: "Principio", titolo: "Nessuna Classifica Personale", testo: "Gli indicatori leggono sedi, sale e fasce orarie, mai pagelle sui singoli collaboratori." }
      ],
      perVerticale: {
        trasversale: "Piano d'azione 30 60 90 giorni, micro-learning via Telegram e mappatura corsi D.Lgs 81/08.",
        arcada: "Permessi differenziati per ruolo, la segreteria non accede alle immagini cliniche.",
        sinter: "Allineamento protocolli tra tecnici CAD, ceramisti e controllo qualità finale.",
        vinea: "Checklist sicurezza pre-lavoro e istruzioni vocali sul campo per operatori agricoli."
      }
    },
    {
      id: "flusso",
      codice: "06",
      titolo: "Flusso e Relazione",
      sottotitolo: "Esperienza Fluida e Zero Pressione",
      voce: "diego",
      voceNome: "Diego",
      audio: "assets/audio/stazione_06.mp3",
      img: "assets/img/pazienti_accoglienza.jpg",
      narrazione: "Dalla prima accoglienza al seguito nel tempo, ogni interazione è progettata per ridurre l'attrito. Comunicazione visiva chiara, richiami automatici e interfacce leggere su canali che tutti già usano.",
      sottotitoli: [
        { start: 0.0, end: 5.0, text: "Dalla prima accoglienza al seguito nel tempo, ogni interazione riduce l'attrito." },
        { start: 5.0, end: 10.6, text: "Comunicazione visiva chiara, richiami automatici e interfacce leggere sui canali quotidiani." }
      ],
      schede: [
        { badge: "Scheda 06-07", titolo: "Immagine e Posizionamento", testo: "Ottimizzazione locale, recensioni verificate e automazioni approvate sempre dal titolare." },
        { badge: "Scheda 09", titolo: "Comunicazione Trasparente", testo: "Spiegazioni visive in tre opzioni con simulatore chiaro e pieno controllo all'utente." },
        { badge: "Area 02", titolo: "OpenAPI CCIAA e Scoring", testo: "Qualificazione istantanea di clienti B2B e fornitori tramite registri camerali ufficiali." }
      ],
      perVerticale: {
        trasversale: "Telegram MiniApp a barriera zero senza download da store e con firma HMAC-SHA256.",
        arcada: "Riduzione no-show, richiami automatici igiene e preventivo comprensibile senza immagini cruente.",
        sinter: "Catalogo ordini digitale per gli studi clienti con notifiche di avanzamento in tempo reale.",
        vinea: "Scheda lotto con QR pubblico verso il consumatore finale e tracciabilità trasparente."
      }
    },
    {
      id: "terminale",
      codice: "07",
      titolo: "Terminale Mobile H24",
      sottotitolo: "Il Cockpit Direzionale in Tasca",
      voce: "diego",
      voceNome: "Diego",
      audio: "assets/audio/stazione_07.mp3",
      img: "assets/img/stage_viaggio.jpg",
      narrazione: "Ovunque ti trovi, il tuo Agente Speciale risponde in tempo reale. Interroghi i numeri della giornata, controlli lo stato delle sedi o dei cantieri e confermi le azioni critiche con un tocco.",
      sottotitoli: [
        { start: 0.0, end: 4.5, text: "Ovunque ti trovi, il tuo Agente Speciale risponde in tempo reale." },
        { start: 4.5, end: 10.4, text: "Interroghi i numeri, controlli lo stato delle sedi e confermi le azioni critiche con un tocco." }
      ],
      demoLink: { label: "Apri Cockpit Direzionale Live", url: "real_cockpit/index.html" },
      schede: [
        { badge: "Mobile", titolo: "Accesso con Secondo Fattore", testo: "Collegamento crittografato verso il nodo di sede basato su ruolo e conferma." },
        { badge: "Voce", titolo: "Interrogazione Naturale", testo: "Comandi vocali trascritti in locale con Whisper senza inviare audio a server esterni." },
        { badge: "Allarmi", titolo: "Sensori Locali in Tempo Reale", testo: "Avvisi immediati per allagamento, aperture porte, fumo o derive termiche." }
      ],
      perVerticale: {
        trasversale: "Cruscotto direzionale sintetico accessibile da smartphone in qualsiasi momento.",
        arcada: "Stato poltrone, saturazione, preventivi accettati e allarmi macchine in un'unica vista.",
        sinter: "Avanzamento commesse urgenti, colli di bottiglia fresatori e stato spedizioni.",
        vinea: "Report di fine giornata dal vigneto, stato batteria rover e conferma trattamenti."
      }
    },
    {
      id: "sovranita",
      codice: "08",
      titolo: "Conformità e Chiusura",
      sottotitolo: "Dossier Tecnico, Finanziamenti e Tempo",
      voce: "elsa",
      voceNome: "Elsa + Diego",
      audio: "assets/audio/stazione_08.mp3",
      img: "assets/img/stage_santuario.jpg",
      narrazione: "L'eccellenza tecnologica vale solo se è giuridicamente blindata e sostenibile. Consegniamo il fascicolo completo di conformità, supportiamo le perizie per i crediti d'imposta e restituiamo tempo alla tua direzione. Nessun agente speciale veste di serie.",
      sottotitoli: [
        { start: 0.0, end: 5.2, text: "L'eccellenza tecnologica vale solo se è giuridicamente blindata e sostenibile." },
        { start: 5.2, end: 11.4, text: "Consegniamo il fascicolo completo di conformità e le perizie tecniche per i bandi." },
        { start: 11.4, end: 15.0, text: "Nessun agente speciale veste di serie." }
      ],
      schede: [
        { badge: "Scheda 14", titolo: "Fascicolo DPIA e FRIA", testo: "Valutazioni d'impatto privacy, diritti fondamentali e dossier sicurezza di rete." },
        { badge: "Scheda 15", titolo: "Finanziamenti e Perizie", testo: "Relazioni tecniche asseverate per Transizione 5.0, Industria 4.0 e bandi digitali." },
        { badge: "SLA Garanzia", titolo: "Proprietà Totale dei Dati", testo: "I dati restano del cliente e vengono restituiti in formato leggibile in ogni momento." }
      ],
      perVerticale: {
        trasversale: "Un percorso modulare costruito su misura per restituire controllo, margine e tempo.",
        arcada: "Conformità sanitaria, GDPR e AI Act pronti per qualunque ispezione.",
        sinter: "Fascicolo tecnico dispositivi su misura e tracciabilità completa di filiera.",
        vinea: "Registro inviolabile delle operazioni agricole e certificazione di sostenibilità."
      }
    }
  ]
};
