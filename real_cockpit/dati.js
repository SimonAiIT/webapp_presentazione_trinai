/**
 * COCKPIT DIREZIONALE VICTOR — Polo Arcada Demo & ATELIER TRINAI
 * Dati dimostrativi coerenti per tutte le 10 sedi e il gruppo.
 * AVVISO: Nomi e numeri sono simulati a scopo dimostrativo ("Dati dimostrativi").
 */

const DATI_COCKPIT = {
  meta: {
    aggiornatoAlle: "13:35",
    dataOggi: "Lunedì 9 Novembre 2026",
    versioneVictor: "Victor Core 3.4.2 — Lobi Attivi",
    avvisoPrivacy: "Dati dimostrativi sintetici per simulazione direzionale. Nessun dato sanitario reale."
  },

  gruppo: {
    nome: "Polo Arcada Demo — Odontoiatria e Implantologia Avanzata",
    fondazione: 1979,
    totaleSedi: 10,
    poltroneTotali: 46,
    macchineMonitorate: 184,
    sensoriAttivi: 1482,
    
    // Telemetria odierna
    saturazioneOggi: 84.6, // percentuale media
    primeVisiteOggi: 28,
    primeVisiteMese: 412,
    
    preventiviOggiPresentati: 94200,
    preventiviOggiAccettati: 72500,
    percentualeAccettazioneOggi: 77.0,
    
    preventiviMesePresentati: 1420000,
    preventiviMeseAccettati: 1085000,
    percentualeAccettazioneMese: 76.4,

    incassiOggi: 68400,
    incassiMeseAttuali: 892000,
    proiezioneChiusuraMese: 1240000,
    targetMese: 1160000,
    scostamentoTargetPercentuale: 6.9, // +6.9% rispetto al target concordato

    richiamiIgieneScadenza30gg: 538,
    richiamiGiaSchedulati: 491,
    tassoAdesioneRichiami: 91.2,

    scorteImpiantiTotali: 1240,
    scorteImpiantiPerMarca: {
      straumann: { nome: "Straumann SLActive / BLX", pezzi: 512, sogliaMinima: 120, stato: "regolare" },
      nobel: { nome: "Nobel Biocare Active / Parallel", pezzi: 388, sogliaMinima: 90, stato: "regolare" },
      astra: { nome: "Astra Tech Implant EV", pezzi: 215, sogliaMinima: 60, stato: "regolare" },
      zimmer: { nome: "Zimmer Biomet Tapered", pezzi: 125, sogliaMinima: 40, stato: "sottoscorta_lieve" }
    },

    sensiStatus: {
      orecchie: { stato: "allerta_lieve", attive: 32, anomalie: 1, label: "1 scostamento armonico rilevato (Conegliano)" },
      pelle: { stato: "ottimale", attive: 240, anomalie: 0, label: "Parametri microclimatici e sicurezza ottimali" },
      occhi: { stato: "ottimale", attive: 18, anomalie: 0, label: "74 scansioni elaborate oggi — 100% tracciate" },
      flusso: { stato: "ricostruito", attive: 46, anomalie: 1, label: "1 sensore muto ricostruito via scialitica (Conegliano)" }
    }
  },

  // Coordinate geografiche stilizzate (x: 0-500, y: 0-420) per la mappa vettoriale del Triveneto
  sedi: [
    {
      id: "treviso",
      nome: "Treviso",
      denominazioneUfficiale: "Polo Arcada Demo Treviso — Centro Chirurgico Principale",
      indirizzo: "Via del Nodo Centrale, 1",
      cap: "31100",
      citta: "Treviso (TV)",
      telefono: "0000 000000",
      direttoreSanitario: "Direttore Sanitario",
      semaforo: "verde", // verde, ambra, rosso
      statusMotivo: "Regime nominale eccellente. 6 sale attive, saturazione all'88%.",
      poltroneCount: 6,
      saturazioneOggi: 88.0,
      primeVisiteOggi: 5,
      incassiOggi: 14800,
      preventiviOggiPresentati: 19500,
      preventiviOggiAccettati: 16200,
      richiamiMese: 84,
      mapCoords: { x: 285, y: 260, labelX: 295, labelY: 265 },
      
      sale: [
        { id: "S1", nome: "Sala 1 — Chirurgia Guidata A", stato: "chirurgia", procedura: "Impianto All-on-4 arcata sup.", paziente: "Soggetto Demo 01", codicePz: "PZ_3914_TRE", operatore: "Direttore Clinico", orario: "11:30 - 13:45", fineStimata: "fra 18 min" },
        { id: "S2", nome: "Sala 2 — Chirurgia Guidata B", stato: "in_sanificazione", procedura: "Sanificazione aerosol post-estrazione complessa", paziente: "—", codicePz: "—", operatore: "Équipe Assistenza", orario: "13:20 - 13:45", fineStimata: "fra 8 min" },
        { id: "S3", nome: "Sala 3 — Riabilitazione Protesica", stato: "occupata", procedura: "Impronta ottica 3D e prova struttura zirconia", paziente: "Soggetto Demo 02", codicePz: "PZ_4120_TRE", operatore: "Direttore Sanitario", orario: "13:00 - 14:00", fineStimata: "fra 25 min" },
        { id: "S4", nome: "Sala 4 — Igiene & Terapia Parodontale", stato: "occupata", procedura: "Protocollo GBT AirFlow e debridement sonico", paziente: "Soggetto Demo 03", codicePz: "PZ_2744_TRE", operatore: "Dott.ssa B. Barbieri", orario: "13:15 - 14:15", fineStimata: "fra 40 min" },
        { id: "S5", nome: "Sala 5 — Ortodonzia Invisibile & Pedo", stato: "libera", procedura: "Pronta per prima visita allineatori ore 14:00", paziente: "—", codicePz: "—", operatore: "Dott.ssa L. Meneghel", orario: "14:00 - 14:45", fineStimata: "Disponibile" },
        { id: "S6", nome: "Sala 6 — Prima Visita & Diagnosi 3D", stato: "occupata", procedura: "Valutazione TAC CBCT e piano di trattamento", paziente: "Soggetto Demo 04", codicePz: "PZ_5201_TRE", operatore: "Dott. S. Rinaldi", orario: "13:30 - 14:15", fineStimata: "Iniziata da 5 min" }
      ],

      agendaGiornata: [
        { ora: "08:30 - 09:30", sala: "Sala 1", procedura: "Revisione carico immediato", paziente: "Soggetto Demo 05", codicePz: "PZ_1904_TRE", stato: "completato" },
        { ora: "09:45 - 11:15", sala: "Sala 1", procedura: "Grande rialzo di seno mascellare bilaterale", paziente: "Soggetto Demo 06", codicePz: "PZ_2118_TRE", stato: "completato" },
        { ora: "11:30 - 13:45", sala: "Sala 1", procedura: "Impianto All-on-4 arcata superiore", paziente: "Soggetto Demo 07", codicePz: "PZ_3914_TRE", stato: "in_corso" },
        { ora: "14:30 - 16:00", sala: "Sala 1", procedura: "Inserimento 2 impianti Straumann BLX guidati", paziente: "Soggetto Demo 08", codicePz: "PZ_4833_TRE", stato: "programmato" },
        { ora: "16:15 - 18:00", sala: "Sala 1", procedura: "Chirurgia mucogengivale con innesto connettivale", paziente: "Soggetto Demo 09", codicePz: "PZ_3129_TRE", stato: "programmato" },
        { ora: "13:00 - 14:00", sala: "Sala 3", procedura: "Prova barretta Toronto Bridge", paziente: "Soggetto Demo 10", codicePz: "PZ_4120_TRE", stato: "in_corso" },
        { ora: "14:15 - 15:30", sala: "Sala 3", procedura: "Consegna circolare ceramica su impianti", paziente: "Soggetto Demo 11", codicePz: "PZ_1402_TRE", stato: "programmato" },
        { ora: "13:15 - 14:15", sala: "Sala 4", procedura: "Igiene orale professionale richiamo semestrale", paziente: "Soggetto Demo 12", codicePz: "PZ_2744_TRE", stato: "in_corso" },
        { ora: "14:30 - 15:30", sala: "Sala 4", procedura: "Mantenimento implantare e sondaggio perimplantare", paziente: "Soggetto Demo 13", codicePz: "PZ_3619_TRE", stato: "programmato" }
      ],

      macchine: {
        autoclavi: [
          { nome: "Melag Vacuklav 44B+ (Sterilizzatrice 1)", ciclo: "Ciclo B Prione 134°C", stato: "asciugatura", pressione: "0.22 bar", temp: "84.5 °C", tempoResiduo: "11 min", cicliOggiConformi: 5, cicliTotaliOggi: 5 },
          { nome: "Melag Vacuklav 40B+ (Sterilizzatrice 2)", ciclo: "Stand-by pronto ciclo", stato: "pronto", pressione: "1.01 bar", temp: "42.0 °C", tempoResiduo: "—", cicliOggiConformi: 4, cicliTotaliOggi: 4 }
        ],
        compressore: {
          modello: "Dürr Dental Tornado 4 con essiccatore",
          pressioneEsercizio: "7.1 bar",
          frequenzaArmonica: "49.8 Hz",
          vibrazioneRMS: "0.78 mm/s",
          statoAudio: "Suona come il suo normale",
          statoDettaglio: "Onde acustiche conformi allo spettro di riferimento (scostamento < 0.3 dB)"
        },
        aspiratore: {
          modello: "Dürr Tyscor VS 4 Centrale",
          portata: "320 l/min",
          depressione: "-175 mbar",
          stato: "ottimale"
        }
      },

      sensi: {
        orecchie: "Normale (compressore 49.8 Hz, aspirazione 320 l/min lineare)",
        pelle: "Temp 21.2°C, Umidità 47%, Fumo assente, Allagamento locale tecnico 0.0 mm, Porta notte armata",
        occhi: "14 CBCT elaborate, 100% matched Straumann BLX, nessun disallineamento",
        datoMancante: "Tutti i sensori trasmettono regolarmente."
      }
    },

    {
      id: "oderzo",
      nome: "Oderzo",
      denominazioneUfficiale: "Polo Arcada Demo Oderzo — Polo Opitergino",
      indirizzo: "Piazzale Europa, 1/B",
      cap: "31046",
      citta: "Oderzo (TV)",
      telefono: "0422 815000",
      direttoreSanitario: "Dott. Michele Dal Vera",
      semaforo: "verde",
      statusMotivo: "4 sale su 4 operative, flusso regolare, accettazione preventivi all'82%.",
      poltroneCount: 4,
      saturazioneOggi: 86.5,
      primeVisiteOggi: 3,
      incassiOggi: 8900,
      preventiviOggiPresentati: 11400,
      preventiviOggiAccettati: 9400,
      richiamiMese: 56,
      mapCoords: { x: 355, y: 230, labelX: 365, labelY: 235 },

      sale: [
        { id: "S1", nome: "Sala 1 — Chirurgia Avanzata", stato: "occupata", procedura: "Impianto post-estrattivo immediato", paziente: "Soggetto Demo 14", codicePz: "PZ_2819_ODE", operatore: "Dott. Michele Dal Vera", orario: "13:00 - 14:15", fineStimata: "fra 35 min" },
        { id: "S2", nome: "Sala 2 — Conservativa & Protesi", stato: "occupata", procedura: "Intarsio in disilicato su 2.6", paziente: "Soggetto Demo 15", codicePz: "PZ_1194_ODE", operatore: "Dott. F. Tomasi", orario: "13:15 - 14:00", fineStimata: "fra 20 min" },
        { id: "S3", nome: "Sala 3 — Igiene & Mantenimento", stato: "libera", procedura: "Sanificata e predisposta per seduta ore 14:00", paziente: "—", codicePz: "—", operatore: "Dott.ssa M. Furlan", orario: "14:00 - 15:00", fineStimata: "Disponibile" },
        { id: "S4", nome: "Sala 4 — Prima Visita & Ortodonzia", stato: "occupata", procedura: "Check-up ortodontico 3D", paziente: "Soggetto Demo 16", codicePz: "PZ_4901_ODE", operatore: "Dott. A. Varaschin", orario: "13:30 - 14:15", fineStimata: "In corso" }
      ],

      agendaGiornata: [
        { ora: "09:00 - 10:15", sala: "Sala 1", procedura: "Rigenerazione guidata con membrana titanio", paziente: "Soggetto Demo 17", codicePz: "PZ_3480_ODE", stato: "completato" },
        { ora: "10:30 - 12:00", sala: "Sala 1", procedura: "Inserimento 2 impianti Nobel Parallel", paziente: "Soggetto Demo 18", codicePz: "PZ_1977_ODE", stato: "completato" },
        { ora: "13:00 - 14:15", sala: "Sala 1", procedura: "Impianto post-estrattivo immediato", paziente: "Soggetto Demo 19", codicePz: "PZ_2819_ODE", stato: "in_corso" },
        { ora: "14:30 - 16:00", sala: "Sala 1", procedura: "Rialzo di seno transcrestale", paziente: "Soggetto Demo 20", codicePz: "PZ_4291_ODE", stato: "programmato" }
      ],

      macchine: {
        autoclavi: [
          { nome: "Melag Vacuklav 44B+", ciclo: "Ciclo B 134°C", stato: "sterilizzazione", pressione: "2.14 bar", temp: "134.1 °C", tempoResiduo: "18 min", cicliOggiConformi: 4, cicliTotaliOggi: 4 }
        ],
        compressore: {
          modello: "Dürr Dental Tornado 2",
          pressioneEsercizio: "6.9 bar",
          frequenzaArmonica: "50.1 Hz",
          vibrazioneRMS: "0.82 mm/s",
          statoAudio: "Suona come il suo normale",
          statoDettaglio: "Armonica di testa stabile su 50 Hz. Cuscinetti integri."
        },
        aspiratore: { modello: "Dürr VS 300 S", portata: "295 l/min", depressione: "-170 mbar", stato: "ottimale" }
      },

      sensi: {
        orecchie: "Normale (profilo acustico perfetto)",
        pelle: "Temp 21.0°C, Umidità 49%, Allagamento 0.0 mm",
        occhi: "9 radiografie/scansioni lette e archiviate con successo",
        datoMancante: "Regolare."
      }
    },

    {
      id: "conegliano",
      nome: "Conegliano",
      denominazioneUfficiale: "Polo Arcada Demo Conegliano — Polo Colline del Prosecco",
      indirizzo: "Via Adolfo Vital, 96",
      cap: "31015",
      citta: "Conegliano (TV)",
      telefono: "0438 418140",
      direttoreSanitario: "Dott. Pietro Cantice",
      semaforo: "ambra", // ALLERTA: Autoclave 2 + Sensore sala 2
      statusMotivo: "Anomalia lieve: Autoclave 2 scostamento vuoto frazionato. Sensore flusso Sala 2 offline (ricostruito via scialitica).",
      poltroneCount: 5,
      saturazioneOggi: 82.0,
      primeVisiteOggi: 4,
      incassiOggi: 9200,
      preventiviOggiPresentati: 14100,
      preventiviOggiAccettati: 10800,
      richiamiMese: 68,
      mapCoords: { x: 285, y: 195, labelX: 295, labelY: 195 },

      sale: [
        { id: "S1", nome: "Sala 1 — Chirurgia Guidata", stato: "chirurgia", procedura: "Chirurgia implantare computer-assistita", paziente: "Soggetto Demo 21", codicePz: "PZ_3108_CON", operatore: "Dott. Pietro Cantice", orario: "12:45 - 14:15", fineStimata: "fra 30 min" },
        { id: "S2", nome: "Sala 2 — Conservativa Avanzata", stato: "occupata", procedura: "Ricostruzione estetica composito (Flusso ricostruito)", paziente: "Soggetto Demo 22", codicePz: "PZ_1842_CON", operatore: "Dott. M. Pol", orario: "13:15 - 14:30", fineStimata: "fra 45 min" },
        { id: "S3", nome: "Sala 3 — Riabilitazione Orale", stato: "occupata", procedura: "Registrazione masticatoria e montaggio articolatore", paziente: "Soggetto Demo 23", codicePz: "PZ_5022_CON", operatore: "Dott.ssa G. Zanon", orario: "13:00 - 13:45", fineStimata: "fra 10 min" },
        { id: "S4", nome: "Sala 4 — Igiene & Laser Terapia", stato: "in_sanificazione", procedura: "Sanificazione post laser-terapia perimplantare", paziente: "—", codicePz: "—", operatore: "Équipe Assistenza", orario: "13:30 - 13:45", fineStimata: "fra 5 min" },
        { id: "S5", nome: "Sala 5 — Diagnostica & Prime Visite", stato: "libera", procedura: "Pronta per accoglienza prima visita ore 14:00", paziente: "—", codicePz: "—", operatore: "Dott. P. Cantice", orario: "14:00 - 14:45", fineStimata: "Disponibile" }
      ],

      agendaGiornata: [
        { ora: "08:45 - 10:00", sala: "Sala 1", procedura: "Rimozione radice inclusa e innesto bio-oss", paziente: "Soggetto Demo 24", codicePz: "PZ_2391_CON", stato: "completato" },
        { ora: "10:15 - 12:15", sala: "Sala 1", procedura: "All-on-4 inferiore guidato", paziente: "Soggetto Demo 25", codicePz: "PZ_4190_CON", stato: "completato" },
        { ora: "12:45 - 14:15", sala: "Sala 1", procedura: "Chirurgia implantare computer-assistita", paziente: "Soggetto Demo 26", codicePz: "PZ_3108_CON", stato: "in_corso" },
        { ora: "14:45 - 16:30", sala: "Sala 1", procedura: "Inserimento 3 impianti Straumann", paziente: "Soggetto Demo 27", codicePz: "PZ_3771_CON", stato: "programmato" }
      ],

      macchine: {
        autoclavi: [
          { nome: "Melag Vacuklav 44B+ (Autoclave 1)", ciclo: "Ciclo B 134°C", stato: "pronto", pressione: "1.02 bar", temp: "45.0 °C", tempoResiduo: "—", cicliOggiConformi: 5, cicliTotaliOggi: 5 },
          { nome: "W&H Lisa Mini (Autoclave 2)", ciclo: "Pre-vuoto frazionato P3", stato: "anomalia_vuoto", pressione: "0.19 bar (anomalia)", temp: "112.4 °C", tempoResiduo: "24 min (a rischio)", cicliOggiConformi: 2, cicliTotaliOggi: 3 }
        ],
        compressore: {
          modello: "Dürr Dental Tornado 4",
          pressioneEsercizio: "6.8 bar",
          frequenzaArmonica: "51.4 Hz",
          vibrazioneRMS: "1.18 mm/s (+22%)",
          statoAudio: "Diverso dal normale: scostamento su armonica 1.820 Hz",
          statoDettaglio: "Rilevata micro-risonanza sulla valvola di sfiato condensa da 42 minuti. Non blocca l'operatività ma richiede ispezione filtri serbatoio."
        },
        aspiratore: { modello: "Dürr Tyscor VS 2", portata: "280 l/min", depressione: "-162 mbar", stato: "ottimale" }
      },

      sensi: {
        orecchie: "Diverso dal normale (+3.4 dB a 1.820 Hz su scarico compressore da 42 min)",
        pelle: "Temp 21.8°C, Umidità 46%, Porte sicure, Sala tecnica asciutta",
        occhi: "11 radiografie lette. Riconosciuti 2 impianti Straumann BLX 4.5 e 1 Nobel Parallel",
        datoMancante: "Sensore di flusso riunito Sala 2 offline dalle 11:15. Ricostruzione attiva via assorbimento scialitica (380W) e valvola aspirazione (presenza operatore: 94.6%)."
      }
    },

    {
      id: "venezia",
      nome: "Venezia",
      denominazioneUfficiale: "Polo Arcada Demo Venezia — Sede Storica San Marco",
      indirizzo: "San Marco, 5254",
      cap: "30124",
      citta: "Venezia (VE)",
      telefono: "041 5210068",
      direttoreSanitario: "Direttore Clinico",
      semaforo: "verde",
      statusMotivo: "Prestazioni esclusive in corso. 3 sale a saturazione piena (92%), comfort pazienti 98/100.",
      poltroneCount: 3,
      saturazioneOggi: 92.0,
      primeVisiteOggi: 2,
      incassiOggi: 7800,
      preventiviOggiPresentati: 12800,
      preventiviOggiAccettati: 11500,
      richiamiMese: 42,
      mapCoords: { x: 315, y: 345, labelX: 325, labelY: 350 },

      sale: [
        { id: "S1", nome: "Sala San Marco — Chirurgia & Estetica", stato: "chirurgia", procedura: "Faccette ceramiche e allineamento guidato", paziente: "Soggetto Demo 28", codicePz: "PZ_2290_VEN", operatore: "Direttore Clinico", orario: "12:30 - 14:30", fineStimata: "fra 45 min" },
        { id: "S2", nome: "Sala Rialto — Riabilitazione Implantare", stato: "occupata", procedura: "Finalizzazione protesica Toronto Bridge su 6 impianti", paziente: "Soggetto Demo 29", codicePz: "PZ_1044_VEN", operatore: "Dott. G. Arcada / Équipe", orario: "13:15 - 14:15", fineStimata: "fra 30 min" },
        { id: "S3", nome: "Sala Fenice — Igiene & Comfort Spa", stato: "occupata", procedura: "Detartrasi piezoelettrica a temperatura corporea", paziente: "Soggetto Demo 30", codicePz: "PZ_3821_VEN", operatore: "Dott.ssa C. Trevisiol", orario: "13:30 - 14:15", fineStimata: "Iniziata" }
      ],

      agendaGiornata: [
        { ora: "09:30 - 11:30", sala: "Sala San Marco", procedura: "Chirurgia implantare post-estrattiva 1.4-1.5", paziente: "Soggetto Demo 31", codicePz: "PZ_1912_VEN", stato: "completato" },
        { ora: "12:30 - 14:30", sala: "Sala San Marco", procedura: "Faccette ceramiche e allineamento guidato", paziente: "Soggetto Demo 32", codicePz: "PZ_2290_VEN", stato: "in_corso" },
        { ora: "15:00 - 17:00", sala: "Sala San Marco", procedura: "Consulenza direzionale seconda opinione riabilitativa", paziente: "Soggetto Demo 33", codicePz: "PZ_5109_VEN", stato: "programmato" }
      ],

      macchine: {
        autoclavi: [
          { nome: "Euronda EXL 29L", ciclo: "Ciclo B Prione 134°C", stato: "sterilizzazione", pressione: "2.18 bar", temp: "134.4 °C", tempoResiduo: "14 min", cicliOggiConformi: 3, cicliTotaliOggi: 3 }
        ],
        compressore: {
          modello: "Dürr Dental Trio Silver",
          pressioneEsercizio: "7.0 bar",
          frequenzaArmonica: "50.0 Hz",
          vibrazioneRMS: "0.64 mm/s",
          statoAudio: "Suona come il suo normale",
          statoDettaglio: "Isolamento antivibrante veneziano perfetto. Zero risonanze verso il piano nobile."
        },
        aspiratore: { modello: "Dürr VS 600", portata: "310 l/min", depressione: "-178 mbar", stato: "ottimale" }
      },

      sensi: {
        orecchie: "Normale (silenziosità clinica assoluta 34 dB in corridoio)",
        pelle: "Temp 21.5°C, Umidità 48% (deumidificatore lagunare attivo al 100%), Sensore marea/acqua alta sala tecnica 0.0 cm",
        occhi: "6 radiografie e fotografie d'arcata verificate",
        datoMancante: "Nessun sensore muto."
      }
    },

    {
      id: "mestre",
      nome: "Mestre",
      denominazioneUfficiale: "Polo Arcada Demo Mestre — Centro Diagnostico e Riabilitativo",
      indirizzo: "Via Torquato Tasso, 21",
      cap: "30172",
      citta: "Mestre — Venezia (VE)",
      telefono: "041 970147",
      direttoreSanitario: "Direttore Clinico",
      semaforo: "verde",
      statusMotivo: "6 sale attive, altissima affluenza prime visite (6 oggi), chirurgia a pieno regime.",
      poltroneCount: 6,
      saturazioneOggi: 89.2,
      primeVisiteOggi: 6,
      incassiOggi: 13600,
      preventiviOggiPresentati: 18200,
      preventiviOggiAccettati: 14500,
      richiamiMese: 88,
      mapCoords: { x: 280, y: 330, labelX: 250, labelY: 335 },

      sale: [
        { id: "S1", nome: "Sala Chirurgica 1", stato: "chirurgia", procedura: "All-on-6 arcata sup. con carico immediato", paziente: "Soggetto Demo 34", codicePz: "PZ_4412_MES", operatore: "Direttore Clinico", orario: "11:00 - 13:45", fineStimata: "fra 10 min" },
        { id: "S2", nome: "Sala Chirurgica 2", stato: "occupata", procedura: "Innesto biomateriale e sutura", paziente: "Soggetto Demo 35", codicePz: "PZ_3019_MES", operatore: "Dott. F. Scarpa", orario: "13:00 - 14:15", fineStimata: "fra 35 min" },
        { id: "S3", nome: "Sala Riabilitazione 3", stato: "occupata", procedura: "Rimozione punti e controllo guarigione impianti", paziente: "Soggetto Demo 36", codicePz: "PZ_2100_MES", operatore: "Dott.ssa M. Zaccaria", orario: "13:20 - 13:50", fineStimata: "fra 15 min" },
        { id: "S4", nome: "Sala Ortodonzia 4", stato: "libera", procedura: "Predisposta per consegna allineatori ore 14:00", paziente: "—", codicePz: "—", operatore: "Dott. P. Barbato", orario: "14:00 - 14:45", fineStimata: "Disponibile" },
        { id: "S5", nome: "Sala Igiene 5", stato: "occupata", procedura: "Seduta di igiene orale e fluoro-profilassi", paziente: "Soggetto Demo 37", codicePz: "PZ_4890_MES", operatore: "Dott.ssa A. Pavan", orario: "13:15 - 14:00", fineStimata: "fra 20 min" },
        { id: "S6", nome: "Sala Prima Visita 6", stato: "occupata", procedura: "Prima visita chirurgia computer-guidata con TAC", paziente: "Soggetto Demo 38", codicePz: "PZ_5301_MES", operatore: "Dott. R. Vecchiato", orario: "13:30 - 14:15", fineStimata: "In corso" }
      ],

      agendaGiornata: [
        { ora: "08:30 - 10:30", sala: "Sala Chirurgica 1", procedura: "Rialzo di seno e inserimento 3 impianti Straumann", paziente: "Soggetto Demo 39", codicePz: "PZ_1820_MES", stato: "completato" },
        { ora: "11:00 - 13:45", sala: "Sala Chirurgica 1", procedura: "All-on-6 arcata sup. con carico immediato", paziente: "Soggetto Demo 40", codicePz: "PZ_4412_MES", stato: "in_corso" },
        { ora: "14:30 - 16:30", sala: "Sala Chirurgica 1", procedura: "Chirurgia implantare post-estrattiva multipla", paziente: "Soggetto Demo 41", codicePz: "PZ_3514_MES", stato: "programmato" }
      ],

      macchine: {
        autoclavi: [
          { nome: "Melag Vacuklav 44B+ n.1", ciclo: "Ciclo B 134°C", stato: "pronto", pressione: "1.00 bar", temp: "40.0 °C", tempoResiduo: "—", cicliOggiConformi: 6, cicliTotaliOggi: 6 },
          { nome: "Melag Vacuklav 44B+ n.2", ciclo: "Ciclo B 134°C", stato: "sterilizzazione", pressione: "2.16 bar", temp: "134.2 °C", tempoResiduo: "21 min", cicliOggiConformi: 5, cicliTotaliOggi: 5 }
        ],
        compressore: {
          modello: "Dürr Dental Power Tower Silence",
          pressioneEsercizio: "7.2 bar",
          frequenzaArmonica: "50.0 Hz",
          vibrazioneRMS: "0.72 mm/s",
          statoAudio: "Suona come il suo normale",
          statoDettaglio: "Valvola bistadio a regime costante. Rumore acustico medio 52 dB(A)."
        },
        aspiratore: { modello: "Dürr Tyscor VS 4", portata: "340 l/min", depressione: "-180 mbar", stato: "ottimale" }
      },

      sensi: {
        orecchie: "Normale (linea aspirazione fluida a 340 l/min)",
        pelle: "Temp 21.4°C, Umidità 47%, Fumo assente, Locale compressori 23.1°C",
        occhi: "16 CBCT e 8 scansioni 3Shape elaborate senza errori",
        datoMancante: "Nessun dato mancante."
      }
    },

    {
      id: "vittorio_veneto",
      nome: "Vittorio Veneto",
      denominazioneUfficiale: "Polo Arcada Demo Vittorio Veneto — Centro Pedemontano",
      indirizzo: "Viale A. Da Mosto, 22",
      cap: "31029",
      citta: "Vittorio Veneto (TV)",
      telefono: "0438 554420",
      direttoreSanitario: "Dott. Marco Da Re",
      semaforo: "verde",
      statusMotivo: "4 sale operative, pieno controllo flussi di sterilizzazione, nessun disallineamento.",
      poltroneCount: 4,
      saturazioneOggi: 81.5,
      primeVisiteOggi: 2,
      incassiOggi: 5900,
      preventiviOggiPresentati: 8200,
      preventiviOggiAccettati: 6400,
      richiamiMese: 51,
      mapCoords: { x: 270, y: 155, labelX: 230, labelY: 155 },

      sale: [
        { id: "S1", nome: "Sala Chirurgia 1", stato: "occupata", procedura: "Moncone implantare e provvisorio immediato", paziente: "Soggetto Demo 42", codicePz: "PZ_2911_VIT", operatore: "Dott. M. Da Re", orario: "13:00 - 14:00", fineStimata: "fra 25 min" },
        { id: "S2", nome: "Sala Conservativa 2", stato: "libera", procedura: "Disponibile per seduta ore 14:00", paziente: "—", codicePz: "—", operatore: "Dott. A. De Marchi", orario: "14:00 - 15:00", fineStimata: "Disponibile" },
        { id: "S3", nome: "Sala Igiene 3", stato: "occupata", procedura: "Terapia igienica e polishing al glicina", paziente: "Soggetto Demo 43", codicePz: "PZ_3408_VIT", operatore: "Dott.ssa E. Bernardi", orario: "13:15 - 14:00", fineStimata: "fra 20 min" },
        { id: "S4", nome: "Sala Ortodonzia & Diagnosi 4", stato: "occupata", procedura: "Scansione digitale per espansore rapido palato", paziente: "Soggetto Demo 44", codicePz: "PZ_4719_VIT", operatore: "Dott. S. Salvador", orario: "13:30 - 14:15", fineStimata: "Iniziata" }
      ],

      agendaGiornata: [
        { ora: "09:00 - 11:00", sala: "Sala Chirurgia 1", procedura: "Chirurgia implantare bilaterale premolari", paziente: "Soggetto Demo 45", codicePz: "PZ_1994_VIT", stato: "completato" },
        { ora: "11:15 - 12:30", sala: "Sala Chirurgia 1", procedura: "Rigenerazione con granuli fosfato bicalcico", paziente: "Soggetto Demo 46", codicePz: "PZ_3120_VIT", stato: "completato" },
        { ora: "13:00 - 14:00", sala: "Sala Chirurgia 1", procedura: "Moncone implantare e provvisorio immediato", paziente: "Soggetto Demo 47", codicePz: "PZ_2911_VIT", stato: "in_corso" }
      ],

      macchine: {
        autoclavi: [
          { nome: "Melag Vacuklav 40B+", ciclo: "Ciclo B 134°C", stato: "pronto", pressione: "1.01 bar", temp: "41.5 °C", tempoResiduo: "—", cicliOggiConformi: 4, cicliTotaliOggi: 4 }
        ],
        compressore: {
          modello: "Dürr Dental Tornado 2",
          pressioneEsercizio: "6.9 bar",
          frequenzaArmonica: "50.0 Hz",
          vibrazioneRMS: "0.80 mm/s",
          statoAudio: "Suona come il suo normale",
          statoDettaglio: "Funzionamento regolare, assorbimento elettrico 1.8 kW in linea."
        },
        aspiratore: { modello: "Dürr VS 300 S", portata: "290 l/min", depressione: "-168 mbar", stato: "ottimale" }
      },

      sensi: {
        orecchie: "Normale",
        pelle: "Temp 20.9°C, Umidità 49%, Nessuna anomalia ambientale",
        occhi: "5 scansioni verificate, 100% conformi",
        datoMancante: "Nessun dato mancante."
      }
    },

    {
      id: "belluno",
      nome: "Belluno",
      denominazioneUfficiale: "Polo Arcada Demo Belluno — Polo Dolomiti",
      indirizzo: "Via Vittorio Veneto, 158/L",
      cap: "32100",
      citta: "Belluno (BL)",
      telefono: "0437 940088",
      direttoreSanitario: "Direttore Clinico",
      semaforo: "verde",
      statusMotivo: "4 sale attive, protocollo alta montagna operativo, pressione linea stabile a 7.0 bar.",
      poltroneCount: 4,
      saturazioneOggi: 80.0,
      primeVisiteOggi: 2,
      incassiOggi: 4800,
      preventiviOggiPresentati: 6900,
      preventiviOggiAccettati: 5200,
      richiamiMese: 44,
      mapCoords: { x: 230, y: 80, labelX: 240, labelY: 85 },

      sale: [
        { id: "S1", nome: "Sala Dolomiti — Chirurgia", stato: "chirurgia", procedura: "Innesto osseo autologo e impianto Straumann BLX", paziente: "Soggetto Demo 48", codicePz: "PZ_1982_BEL", operatore: "Direttore Clinico", orario: "12:00 - 14:00", fineStimata: "fra 25 min" },
        { id: "S2", nome: "Sala 2 — Conservativa & Estetica", stato: "occupata", procedura: "Restauro adesivo ceramico indiretto", paziente: "Soggetto Demo 49", codicePz: "PZ_3411_BEL", operatore: "Dott. R. Fontana", orario: "13:15 - 14:15", fineStimata: "fra 35 min" },
        { id: "S3", nome: "Sala 3 — Igiene & Prevenzione", stato: "occupata", procedura: "Igiene orale e motivazione domiciliare", paziente: "Soggetto Demo 50", codicePz: "PZ_4102_BEL", operatore: "Dott.ssa F. Viel", orario: "13:30 - 14:15", fineStimata: "Iniziata" },
        { id: "S4", nome: "Sala 4 — Prima Visita & Diagnosi", stato: "libera", procedura: "Pronta per consulto implantare ore 14:30", paziente: "—", codicePz: "—", operatore: "Dott. G. Arcada", orario: "14:30 - 15:15", fineStimata: "Disponibile" }
      ],

      agendaGiornata: [
        { ora: "09:30 - 11:30", sala: "Sala Dolomiti", procedura: "Impianto post-estrattivo 2.4 con carico immediato", paziente: "Soggetto Demo 51", codicePz: "PZ_2481_BEL", stato: "completato" },
        { ora: "12:00 - 14:00", sala: "Sala Dolomiti", procedura: "Innesto osseo autologo e impianto Straumann BLX", paziente: "Soggetto Demo 52", codicePz: "PZ_1982_BEL", stato: "in_corso" }
      ],

      macchine: {
        autoclavi: [
          { nome: "Melag Vacuklav 44B+", ciclo: "Ciclo B 134°C", stato: "pronto", pressione: "1.00 bar", temp: "42.0 °C", tempoResiduo: "—", cicliOggiConformi: 3, cicliTotaliOggi: 3 }
        ],
        compressore: {
          modello: "Dürr Dental Tornado 2 con baro-compensazione",
          pressioneEsercizio: "7.0 bar",
          frequenzaArmonica: "50.0 Hz",
          vibrazioneRMS: "0.75 mm/s",
          statoAudio: "Suona come il suo normale",
          statoDettaglio: "Compensazione altimetrica 390m s.l.m. attiva e conforme."
        },
        aspiratore: { modello: "Dürr VS 300 S", portata: "295 l/min", depressione: "-172 mbar", stato: "ottimale" }
      },

      sensi: {
        orecchie: "Normale (frequenze conformi al profilo altimetrico)",
        pelle: "Temp 20.8°C, Umidità 45%, Riscaldamento a pavimento calibrato",
        occhi: "7 radiografie digitali verificate",
        datoMancante: "Regolare."
      }
    },

    {
      id: "pordenone",
      nome: "Pordenone",
      denominazioneUfficiale: "Ottoboni Dental Clinic — Gruppo Polo Arcada Demo",
      indirizzo: "Piazzetta Ottoboni, 4/C",
      cap: "33170",
      citta: "Pordenone (PN)",
      telefono: "0434 29112",
      direttoreSanitario: "Dott. Alberto Ottoboni",
      semaforo: "verde",
      statusMotivo: "Polo friulano a regime ideale. 5 sale operative, accettazione preventivi all'80%.",
      poltroneCount: 5,
      saturazioneOggi: 85.0,
      primeVisiteOggi: 3,
      incassiOggi: 7400,
      preventiviOggiPresentati: 9800,
      preventiviOggiAccettati: 7900,
      richiamiMese: 59,
      mapCoords: { x: 410, y: 185, labelX: 420, labelY: 190 },

      sale: [
        { id: "S1", nome: "Sala Ottoboni 1 — Chirurgia", stato: "chirurgia", procedura: "Impianti multipli settore posteriore inferiore", paziente: "Soggetto Demo 53", codicePz: "PZ_3190_POR", operatore: "Dott. A. Ottoboni", orario: "12:30 - 14:00", fineStimata: "fra 25 min" },
        { id: "S2", nome: "Sala 2 — Protesi Fissa", stato: "occupata", procedura: "Cementazione ponte su impianti con serraggio dinamometrico", paziente: "Soggetto Demo 54", codicePz: "PZ_1740_POR", operatore: "Dott. E. Santarossa", orario: "13:00 - 13:45", fineStimata: "fra 10 min" },
        { id: "S3", nome: "Sala 3 — Igiene & Prevenzione", stato: "in_sanificazione", procedura: "Sanificazione e ricambio filtri aria", paziente: "—", codicePz: "—", operatore: "Équipe Assistenza", orario: "13:30 - 13:45", fineStimata: "fra 6 min" },
        { id: "S4", nome: "Sala 4 — Ortodonzia Digitale", stato: "occupata", procedura: "Applicazione bottoni ortodontici per allineatori", paziente: "Soggetto Demo 55", codicePz: "PZ_4812_POR", operatore: "Dott.ssa S. Del Ben", orario: "13:15 - 14:00", fineStimata: "fra 20 min" },
        { id: "S5", nome: "Sala 5 — Prima Visita & CBCT", stato: "libera", procedura: "Pronta per prima visita ore 14:00", paziente: "—", codicePz: "—", operatore: "Dott. A. Ottoboni", orario: "14:00 - 14:45", fineStimata: "Disponibile" }
      ],

      agendaGiornata: [
        { ora: "09:00 - 11:00", sala: "Sala Ottoboni 1", procedura: "Inserimento 2 impianti Nobel Biocare", paziente: "Soggetto Demo 56", codicePz: "PZ_2388_POR", stato: "completato" },
        { ora: "12:30 - 14:00", sala: "Sala Ottoboni 1", procedura: "Impianti multipli settore posteriore", paziente: "Soggetto Demo 57", codicePz: "PZ_3190_POR", stato: "in_corso" }
      ],

      macchine: {
        autoclavi: [
          { nome: "Melag Vacuklav 44B+", ciclo: "Ciclo B 134°C", stato: "sterilizzazione", pressione: "2.15 bar", temp: "134.0 °C", tempoResiduo: "16 min", cicliOggiConformi: 4, cicliTotaliOggi: 4 }
        ],
        compressore: {
          modello: "Dürr Dental Tornado 4",
          pressioneEsercizio: "7.1 bar",
          frequenzaArmonica: "49.9 Hz",
          vibrazioneRMS: "0.76 mm/s",
          statoAudio: "Suona come il suo normale",
          statoDettaglio: "Pressione di erogazione e deumidificazione al punto di rugiada -20°C."
        },
        aspiratore: { modello: "Dürr Tyscor VS 2", portata: "305 l/min", depressione: "-175 mbar", stato: "ottimale" }
      },

      sensi: {
        orecchie: "Normale (nessuna vibrazione atipica)",
        pelle: "Temp 21.1°C, Umidità 48%, Fumo assente, Porte notte chiuse e armate",
        occhi: "8 scansioni e impronte digitali conformi",
        datoMancante: "Regolare."
      }
    },

    {
      id: "villorba",
      nome: "Villorba",
      denominazioneUfficiale: "Polo Arcada Demo Villorba — Polo Tecnologico Nord",
      indirizzo: "Viale della Repubblica, 12",
      cap: "31020",
      citta: "Villorba (TV)",
      telefono: "0422 910034",
      direttoreSanitario: "Direttore Sanitario",
      semaforo: "verde",
      statusMotivo: "5 sale operative, laboratorio protesico digitale integrato ad altissima efficienza.",
      poltroneCount: 5,
      saturazioneOggi: 87.0,
      primeVisiteOggi: 2,
      incassiOggi: 7100,
      preventiviOggiPresentati: 9100,
      preventiviOggiAccettati: 7300,
      richiamiMese: 58,
      mapCoords: { x: 285, y: 242, labelX: 235, labelY: 240 },

      sale: [
        { id: "S1", nome: "Sala Chirurgia 1", stato: "chirurgia", procedura: "Chirurgia implantare con guida dima 3D", paziente: "Soggetto Demo 58", codicePz: "PZ_3822_VIL", operatore: "Dott. G. Arcada", orario: "12:15 - 13:45", fineStimata: "fra 10 min" },
        { id: "S2", nome: "Sala 2 — Protesi Digitale", stato: "occupata", procedura: "Fresatura chairside e prova corona ceramica integrale", paziente: "Soggetto Demo 59", codicePz: "PZ_1903_VIL", operatore: "Dott. R. Marcon", orario: "13:00 - 14:15", fineStimata: "fra 35 min" },
        { id: "S3", nome: "Sala 3 — Igiene & Mantenimento", stato: "occupata", procedura: "Richiamo semestrale igiene orale con decontaminazione", paziente: "Soggetto Demo 60", codicePz: "PZ_2741_VIL", operatore: "Dott.ssa S. De Vidi", orario: "13:15 - 14:00", fineStimata: "fra 20 min" },
        { id: "S4", nome: "Sala 4 — Ortodonzia Digitale", stato: "libera", procedura: "Predisposta per controllo apparecchio ore 14:00", paziente: "—", codicePz: "—", operatore: "Dott.ssa C. Sartori", orario: "14:00 - 14:45", fineStimata: "Disponibile" },
        { id: "S5", nome: "Sala 5 — Diagnosi & Prime Visite", stato: "occupata", procedura: "Colloquio preliminare e foto intraorali", paziente: "Soggetto Demo 61", codicePz: "PZ_5199_VIL", operatore: "Dott. A. Bordin", orario: "13:30 - 14:15", fineStimata: "Iniziata" }
      ],

      agendaGiornata: [
        { ora: "09:00 - 11:00", sala: "Sala Chirurgia 1", procedura: "Inserimento 2 impianti Straumann SLActive", paziente: "Soggetto Demo 62", codicePz: "PZ_2940_VIL", stato: "completato" },
        { ora: "12:15 - 13:45", sala: "Sala Chirurgia 1", procedura: "Chirurgia implantare con guida dima 3D", paziente: "Soggetto Demo 63", codicePz: "PZ_3822_VIL", stato: "in_corso" }
      ],

      macchine: {
        autoclavi: [
          { nome: "Melag Vacuklav 44B+", ciclo: "Ciclo B 134°C", stato: "pronto", pressione: "1.00 bar", temp: "43.0 °C", tempoResiduo: "—", cicliOggiConformi: 5, cicliTotaliOggi: 5 }
        ],
        compressore: {
          modello: "Dürr Dental Power Tower Silence",
          pressioneEsercizio: "7.1 bar",
          frequenzaArmonica: "50.0 Hz",
          vibrazioneRMS: "0.69 mm/s",
          statoAudio: "Suona come il suo normale",
          statoDettaglio: "Isolamento acustico totale. Ciclo essiccatore rigenerato alle 12:45."
        },
        aspiratore: { modello: "Dürr Tyscor VS 4", portata: "330 l/min", depressione: "-178 mbar", stato: "ottimale" }
      },

      sensi: {
        orecchie: "Normale",
        pelle: "Temp 21.3°C, Umidità 47%, Fumo assente, Rack server 22.0°C",
        occhi: "12 scansioni intraorali matchate con il software CAD/CAM",
        datoMancante: "Regolare."
      }
    },

    {
      id: "londra",
      nome: "Londra",
      denominazioneUfficiale: "Polo Arcada Demo London — Harley Street Medical Area",
      indirizzo: "18 Wimpole Street",
      cap: "W1G 8GD",
      citta: "London (UK)",
      telefono: "+44 20 7935 4811",
      direttoreSanitario: "Dr. Giovanni Arcada (GDC Registered)",
      semaforo: "verde",
      statusMotivo: "Sede internazionale di prestigio. 4 sale attive, protocolli clinici Arcada sincronizzati.",
      poltroneCount: 4,
      saturazioneOggi: 83.0,
      primeVisiteOggi: 1,
      incassiOggi: 6700, // sterline convertite in euro equivalenti per coerenza di gruppo
      preventiviOggiPresentati: 9500,
      preventiviOggiAccettati: 8100,
      richiamiMese: 38,
      mapCoords: { x: 450, y: 70, labelX: 430, labelY: 95, isLondonInset: true },

      sale: [
        { id: "S1", nome: "Suite Mayfair — Surgical & Implantology", stato: "chirurgia", procedura: "Full-arch immediate loading surgical protocol", paziente: "Soggetto Demo 64", codicePz: "PZ_7102_LON", operatore: "Dr. Giovanni Arcada", orario: "11:45 - 14:00", fineStimata: "fra 20 min" },
        { id: "S2", nome: "Suite Cavendish — Cosmetic & Veneers", stato: "occupata", procedura: "Minimal-prep ceramic veneers trial", paziente: "Soggetto Demo 65", codicePz: "PZ_6819_LON", operatore: "Dr. E. Hamilton", orario: "13:00 - 14:15", fineStimata: "fra 35 min" },
        { id: "S3", nome: "Suite Marylebone — Hygiene & Periodontics", stato: "occupata", procedura: "Air-Flow Master subgingival biofilm removal", paziente: "Soggetto Demo 66", codicePz: "PZ_6304_LON", operatore: "Dr.ssa S. Edwards", orario: "13:15 - 14:00", fineStimata: "fra 20 min" },
        { id: "S4", nome: "Suite Wimpole — Consultation & Digital Smile", stato: "libera", procedura: "Ready for initial consultation 14:15", paziente: "—", codicePz: "—", operatore: "Dr. G. Arcada", orario: "14:15 - 15:00", fineStimata: "Available" }
      ],

      agendaGiornata: [
        { ora: "09:00 - 11:15", sala: "Suite Mayfair", procedura: "Sinus lift & Straumann BLX implant placement", paziente: "Soggetto Demo 67", codicePz: "PZ_5901_LON", stato: "completato" },
        { ora: "11:45 - 14:00", sala: "Suite Mayfair", procedura: "Full-arch immediate loading surgical protocol", paziente: "Soggetto Demo 68", codicePz: "PZ_7102_LON", stato: "in_corso" }
      ],

      macchine: {
        autoclavi: [
          { nome: "Melag Vacuklav 44B+ UK Medical Edition", ciclo: "B-Cycle 134°C HTM 01-05", stato: "asciugatura", pressione: "0.20 bar", temp: "82.0 °C", tempoResiduo: "8 min", cicliOggiConformi: 4, cicliTotaliOggi: 4 }
        ],
        compressore: {
          modello: "Dürr Dental Trio Silver HTM Compliant",
          pressioneEsercizio: "7.0 bar",
          frequenzaArmonica: "50.0 Hz",
          vibrazioneRMS: "0.71 mm/s",
          statoAudio: "Suona come il suo normale",
          statoDettaglio: "Conforme standard HTM 01-05. Pressione aria chirurgica costante."
        },
        aspiratore: { modello: "Dürr VS 300 S Dental", portata: "300 l/min", depressione: "-174 mbar", stato: "ottimale" }
      },

      sensi: {
        orecchie: "Normale (conformità acustica Wimpole Street rispettata)",
        pelle: "Temp 21.0°C, Umidità 48%, Rack server 25.4°C (ventola ausiliaria raccomandata per sicurezza estiva)",
        occhi: "7 CBCT/panoramiche elaborate con matching lotto Straumann",
        datoMancante: "Regolare. Canale criptato Londra-Treviso latenza 24 ms."
      }
    }
  ],

  // ALLARMI E DECISIONI (Solo scostamenti certificati dai lobi, ognuno con confidenza e conferma umana)
  allarmi: [
    {
      id: "ALL_01",
      titolo: "Anomalia Vuoto Frazionato — Autoclave 2 Conegliano",
      sedeId: "conegliano",
      sedeNome: "Conegliano (Via Adolfo Vital)",
      senso: "Orecchie & Pelle (Pressione)",
      livello: "alta_priorita", // alta_priorita, media_priorita, preventiva
      confidenza: 94.2,
      rilevatoDaMinuti: 34,
      descrizione: "La curva del secondo ciclo di vuoto frazionato (P3) mostra una caduta di efficienza dell'8.4% rispetto al valore nominale di riferimento. Rischio di mancata sterilizzazione per il kit chirurgico programmato per le ore 14:30.",
      propostaVictor: "Bloccare preventivamente l'Autoclave 2 per i cicli chirurgici; reindirizzare la sterilizzazione del kit All-on-4 sull'Autoclave 1 (Melag 44B+ attualmente libera e pronta); generare ticket automatico per il tecnico certificato Melag per sostituzione guarnizione sportello prima di domattina.",
      azioneRichiesta: "Conferma Blocco Autoclave 2 e Switch Kit",
      confermato: false,
      confermatoTimestamp: null
    },
    {
      id: "ALL_02",
      titolo: "Discrepanza Riconoscimento Lotto Impianto in Sala 1 Treviso",
      sedeId: "treviso",
      sedeNome: "Treviso (Nodo Centrale)",
      senso: "Occhi (Computer Vision Impianti)",
      livello: "media_priorita",
      confidenza: 98.6,
      rilevatoDaMinuti: 18,
      descrizione: "La scansione visiva e il codice a barre della confezione sterile aperta in Sala 1 identificano un impianto Straumann BLX 4.5x10mm per il paziente Caso Clinico A1, mentre a scheda gestionale era associato un lotto BLX 4.0x10mm.",
      propostaVictor: "Aggiornare automaticamente la cartella clinica digitale e il passaporto implantare della paziente con il lotto effettivo BLX 4.5x10mm (Lotto CH-89211-B) e scalare dal magazzino centrale di Treviso la scorta corretta, notificando la segreteria clinica.",
      azioneRichiesta: "Conferma Allineamento Passaporto e Magazzino",
      confermato: false,
      confermatoTimestamp: null
    },
    {
      id: "ALL_03",
      titolo: "Ricalibrazione Preventiva Filtro Aspirazione Liquidi Belluno",
      sedeId: "belluno",
      sedeNome: "Belluno (Via Vittorio Veneto)",
      senso: "Orecchie & Flusso",
      livello: "preventiva",
      confidenza: 88.4,
      rilevatoDaMinuti: 49,
      descrizione: "Rilevata micro-turbolenza acustica a 1.250 Hz sull'aspiratore chirurgico di Belluno combinata con un calo di depressione da -175 a -168 mbar durante l'intervento osseo.",
      propostaVictor: "Notificare l'assistente alla poltrona di turno per la sostituzione rapida della cartuccia filtro nell'intervallo tra la chirurgia delle 12:00 e la successiva seduta delle 14:30, prevenendo il blocco a metà seduta.",
      azioneRichiesta: "Invia Notifica Operativa Assistente Capo",
      confermato: false,
      confermatoTimestamp: null
    },
    {
      id: "ALL_04",
      titolo: "Soglia Termica Rack Edge Londra (18 Wimpole St)",
      sedeId: "londra",
      sedeNome: "Londra (Wimpole Street)",
      senso: "Pelle (Temperatura Server)",
      livello: "preventiva",
      confidenza: 91.0,
      rilevatoDaMinuti: 62,
      descrizione: "La temperatura interna del rack Victor Edge a Londra ha raggiunto 25.8°C (soglia di allerta preventiva fissata a 25.5°C) a causa della chiusura della porta del locale CED durante il weekend.",
      propostaVictor: "Attivare da remoto il profilo di ventilazione dinamica ausiliaria del nodo server e inviare promemoria al facility manager londinese per verificare la bocchetta di mandata dell'aria condizionata.",
      azioneRichiesta: "Attiva Ventilazione Dinamica Ausiliaria",
      confermato: false,
      confermatoTimestamp: null
    }
  ],

  // MEMORIA E CRESCITA (Le richieste di Victor al team TrinAI e le lezioni quadripartite cue/lesson/evidence/confidence)
  memoria: {
    richiesteAlTeamTrinAI: [
      {
        id: "REQ_01",
        data: "07/11/2026",
        oggetto: "Sonda di contropressione differenziale su aspirazione Belluno",
        testo: "Victor richiede l'installazione di una sonda piezoresistiva a monte del collettore di aspirazione di Belluno. La quota altimetrica (390 m s.l.m.) genera una variazione barometrica di 14 mbar che falsa la stima predittiva dell'intasamento dei micro-filtri a canula stretta.",
        priorita: "Alta — Riduzione falsi positivi",
        stato: "In lavorazione nel laboratorio TrinAI (consegna prevista 18/11/2026)"
      },
      {
        id: "REQ_02",
        data: "04/11/2026",
        oggetto: "Modello ottico per riconoscimento frese usurate Zimmer Biomet",
        testo: "Victor ha un'accuratezza del 99.2% su impianti e frese Straumann e Nobel, ma scende all'89.4% sulle frese sagomate Zimmer a gradino. Si richiede dataset addizionale di 400 fotogrammi macro con diversa angolazione d'illuminazione.",
        priorita: "Media — Espansione catalogo computer vision",
        stato: "Dataset fotografico in acquisizione presso la clinica di Oderzo"
      },
      {
        id: "REQ_03",
        data: "29/10/2026",
        oggetto: "Integrazione driver contatore polimerizzazione lampade scialitiche Conegliano",
        testo: "Per garantire la totale affidabilità della ricostruzione del 'dato mancante' in assenza di segnale dal riunito, Victor richiede l'accesso al bus seriale delle lampade LED di Sala 2 e 3 a Conegliano.",
        priorita: "Bassa — Affinamento sensori surrogati",
        stato: "Studio di fattibilità hardware completato"
      }
    ],

    lezioniDaApprovare: [
      {
        id: "LEZ_01",
        cue: "Caduta temporanea di vuoto (0.16 bar) al 14° minuto del ciclo 3 su Melag 44B+ verificatasi contemporaneamente all'apertura simultanea delle turbine chirurgiche in 3 sale adiacenti a Oderzo.",
        lesson: "Sfasare di almeno 6 minuti l'avvio del ciclo di sterilizzazione pesante rispetto all'orario di inizio delle chirurgie a carico immediato nelle sale attigue per stabilizzare la portata dell'aria compressa sul generatore di vuoto pneumatico.",
        evidence: "Zero cali di vuoto e 14 cicli consecutivi 100% conformi registrati nelle ultime due settimane a Oderzo dopo aver applicato la regola empirica.",
        confidence: 96.8,
        stato: "in_attesa" // in_attesa, approvata, scartata
      },
      {
        id: "LEZ_02",
        cue: "I pazienti anziani sopra i 65 anni assegnati a prime visite implantari mostrano un tasso di accettazione preventivo del +14.2% quando il tempo di attesa in sala non supera i 5 minuti e la temperatura percepita è compresa tra 21.5°C e 22.0°C.",
        lesson: "Impostare una pre-accoglienza termica specifica nelle sale diagnosi prima dell'arrivo del paziente over 65 e sincronizzare la segreteria con Victor per far trovare la stanza già pronta all'ingresso del paziente.",
        evidence: "Campione di 128 prime visite comparate su Treviso, Mestre e Villorba negli ultimi 45 giorni.",
        confidence: 93.4,
        stato: "in_attesa"
      },
      {
        id: "LEZ_03",
        cue: "Vibrazione ad alta frequenza (3.8 kHz) rilevata sui manipoli contrangolo per chirurgia guidata dopo 42 ore continuative d'impiego a Venezia.",
        lesson: "Anticipare il ciclo di lubrificazione automatica pressurizzata a 35 ore di lavoro effettivo invece delle 50 ore raccomandate dalla casa madre per evitare micro-giochi sui cuscinetti ceramici.",
        evidence: "Riduzione del 100% dei blocchi manipolo su Venezia e zero surriscaldamenti percepiti durante le mascherine dima chirurgica.",
        confidence: 98.1,
        stato: "in_attesa"
      }
    ],

    lezioniStoricheAdottate: [
      {
        titolo: "Protocollo pre-raffreddamento manipoli implantari All-on-4",
        origine: "Treviso (Chirurgia A)",
        estesaA: "Tutte le 10 sedi del gruppo",
        dataAdozione: "14 Ottobre 2026",
        risultato: "Azzerato il micro-surriscaldamento osseo durante la fresatura ossea corticale."
      },
      {
        titolo: "Sincronizzazione oraria scarico condensa compressori in orario non clinico",
        origine: "Mestre",
        estesaA: "Conegliano, Villorba, Belluno, Oderzo",
        dataAdozione: "22 Settembre 2026",
        risultato: "Eliminati i rumori di spurgo improvviso durante i colloqui delicati di prima visita."
      }
    ]
  },

  // CUORE: Come i pazienti preferiscono essere informati (minigiochi accettazione in aggregato), comfort, tempi
  cuore: {
    totalePazientiCoinvolti: 1840,
    periodo: "Ultimi 60 giorni — Rilevamento anonimo su tablet d'accoglienza",
    
    preferenzeVisuali: {
      paletteCaldaRassicurante: 66.8, // % preferenza toni legno, champagne, sabbia
      paletteClinicaLuminosa: 33.2   // % preferenza bianco puro, azzurro clinico
    },

    preferenzeComunicazionePreventivo: {
      render3DeSorriso: 72.4,        // % simulazione estetica e anteprima del sorriso finale
      schemiTecniciERadiografici: 27.6 // % dettagli anatomici e radiografie con misure millimetriche
    },

    stilePreventivo: {
      essenzialeAStadi: 81.5,       // % piano terapeutico a tappe chiare e rateizzazione trasparente
      dettagliatoVocePerVoce: 18.5   // % capitolato analitico riga per riga di ogni singolo materiale
    },

    metricheComfortGruppo: {
      tempoMedioAttesaSala: "6.2 minuti", // Target eccellenza < 10 min
      targetGruppo: "< 8 min",
      benessereTermicoIndice: 97.4,       // su 100
      benessereAcusticoIndice: 95.8,      // su 100
      rassicurazionePercepita: 96.2,      // su 100
      sediePoltroneSanificateVisibili: 99.1 // % pazienti che apprezzano la sanificazione a vista
    },

    dettaglioPerSede: [
      { sede: "Treviso", attesaMedia: "5.8 min", comfortAcustico: "96%", preferenzaRender: "74%", stile: "Essenziale a tappe" },
      { sede: "Oderzo", attesaMedia: "6.4 min", comfortAcustico: "95%", preferenzaRender: "70%", stile: "Essenziale a tappe" },
      { sede: "Conegliano", attesaMedia: "7.1 min", comfortAcustico: "94%", preferenzaRender: "71%", stile: "Essenziale a tappe" },
      { sede: "Venezia", attesaMedia: "4.9 min", comfortAcustico: "99%", preferenzaRender: "78%", stile: "Essenziale a tappe" },
      { sede: "Mestre", attesaMedia: "6.8 min", comfortAcustico: "95%", preferenzaRender: "73%", stile: "Essenziale a tappe" },
      { sede: "Vittorio Veneto", attesaMedia: "6.0 min", comfortAcustico: "96%", preferenzaRender: "68%", stile: "Essenziale a tappe" },
      { sede: "Belluno", attesaMedia: "5.5 min", comfortAcustico: "97%", preferenzaRender: "66%", stile: "Dettaglio anatomico" },
      { sede: "Pordenone", attesaMedia: "6.2 min", comfortAcustico: "96%", preferenzaRender: "72%", stile: "Essenziale a tappe" },
      { sede: "Villorba", attesaMedia: "6.3 min", comfortAcustico: "96%", preferenzaRender: "71%", stile: "Essenziale a tappe" },
      { sede: "Londra", attesaMedia: "4.5 min", comfortAcustico: "98%", preferenzaRender: "82%", stile: "Essenziale su misura" }
    ]
  },

  // FIDUCIA E CONFORMITÀ (Privacy zero-knowledge, rubrica locale vs PZ_, log cloud mascherato, sonno e rack)
  fiducia: {
    architettura: {
      modelloPrivacy: "Crittografia asimmetrica a conoscenza zero (Zero-Knowledge Telemetry)",
      motoreAnonimizzazione: "Tokenizzazione unidirezionale locale SHA-256 + Salt Hardware HSM",
      regolaAccessoNomi: "I nomi anagrafici dei pazienti risiedono unicamente nel database locale cifrato della clinica. Compaiono sullo schermo solo se la sessione autenticata appartiene al Direttore Clinico o alla Direzione Sanitaria abilitata. A qualsiasi entità esterna, cloud o lobo algoritmico remoto, il paziente è esclusivamente un identificativo pseudonimo crittografico 'PZ_xxxx'."
    },

    registroPayloadCloud: [
      { ora: "13:34:50", tipo: "Telemetria Acustica", nodo: "Treviso Node", payloadTrasmesso: "{\"node\":\"TRE_01\",\"freq_rms\":[49.8, 50.1, 49.9],\"db_a\":51.2,\"hash\":\"8f3c...b12a\"}", note: "Zero dati anagrafici. Solo serie numeriche fisiche." },
      { ora: "13:32:15", tipo: "Conferma Ciclo Autoclave", nodo: "Mestre Node", payloadTrasmesso: "{\"node\":\"MES_02\",\"cycle_id\":\"C_9811\",\"temp_peak\":134.4,\"bar_peak\":2.18,\"status\":\"OK\"}", note: "Crittografia AES-256 GCM end-to-end verso il vault TrinAI." },
      { ora: "13:28:40", tipo: "Aggiornamento Scorte Impianti", nodo: "Magazzino Centrale", payloadTrasmesso: "{\"brand\":\"STR_BLX\",\"qty_delta\":-1,\"location_code\":\"WH_TRE\",\"lot_hash\":\"3d91...99e2\"}", note: "Nessun riferimento a identità paziente né a cartella clinica." },
      { ora: "13:20:05", tipo: "Vettore Pesi Gradiente Sonno", nodo: "All-Nodes Edge", payloadTrasmesso: "{\"weights_delta\":[0.0012, -0.0004, 0.0021],\"loss\":0.0042,\"epoch\":412}", note: "Federated Learning locale: i dati grezzi non lasciano mai la sede." }
    ],

    sonnoDiVictor: {
      orarioNotturno: "Dalle 03:00 alle 04:30 ogni notte",
      fasiCiclo: [
        { ora: "03:00", fase: "Spegnimento sensori non perimetrali", stato: "Completato ore 03:02" },
        { ora: "03:10", fase: "Consolidamento memoria a lungo termine & pruning dei pesi", stato: "Completato ore 03:42" },
        { ora: "03:45", fase: "Ricalibrazione soglie acustiche compressori su rumore di fondo notturno", stato: "Completato ore 04:05" },
        { ora: "04:10", fase: "Backup triplo ridondato cifrato (NVMe Locale + NAS Sede + Cold Cloud)", stato: "Certificato con hash SHA-512" },
        { ora: "04:25", fase: "Verifica integrità sensori perimetrali e risveglio lobi", stato: "Tutti i 10 nodi pronti ore 04:30" }
      ],
      ultimoBackup: "Oggi 09/11/2026 ore 04:18 (Dimensione: 14.8 GB compresso, 0 errori)",
      integritaHash: "SHA512: d41d8cd98f00b204e9800998ecf8427e991204892c9f..."
    },

    telemetriaServer: {
      cpuTempMedia: "41.8 °C",
      gpuEdgeTemp: "44.2 °C",
      storageNvmeUsato: "28.4% (1.4 TB su 5.0 TB ridondati RAID 10)",
      uptimeSistema: "99.998% (attivo da 184 giorni continui)",
      latenzaReteNodiLocali: "0.8 ms",
      canaleLondraLatenza: "24.2 ms (VPN WireGuard cifrata ChaCha20-Poly1305)"
    }
  },

  // DOMANDE E RISPOSTE PER IL COMPAGNO DIREZIONALE
  chat: {
    domandeSuggerite: [
      "Come sta andando oggi la saturazione a Conegliano e a Treviso?",
      "Ci sono forniture o impianti bloccati?",
      "Qual è la proiezione di incasso e chiusura del mese?",
      "Quali autoclavi richiedono manutenzione o attenzione preventiva?",
      "Mostrami la situazione del comfort e i tempi di attesa a Venezia"
    ],

    rispostePredefinite: {
      saturazione: {
        keywords: ["saturazione", "conegliano", "treviso", "poltrone", "occupazione"],
        testo: "Oggi a **Treviso** la saturazione delle 6 sale è all'**88.0%**: 4 sale sono attualmente impegnate in sedute complesse (tra cui la chirurgia All-on-4 in Sala 1 del Direttore Clinico per la paziente Caso Clinico A1), 1 in sanificazione rapida e 1 pronta per le prime visite delle 14:00. A **Conegliano** registriamo una saturazione dell'**82.0%** su 5 sale, con la Sala 1 impegnata in chirurgia guidata dal Dott. Pietro Cantice. L'andamento complessivo del gruppo è all'**84.6%**, in perfetto equilibrio con la capacità operativa pianificata."
      },
      forniture: {
        keywords: ["forniture", "impianti", "bloccati", "scorte", "magazzino", "straumann", "nobel"],
        testo: "Non abbiamo ordini bloccati con i produttori primari, ma è attiva una segnalazione di **media priorità a Treviso**: in Sala 1 il lobo degli Occhi ha riconosciuto l'apertura di un impianto **Straumann BLX 4.5x10mm** mentre a scheda gestionale era associato un BLX 4.0. Ti ho predisposto un allarme con un clic per allineare subito il passaporto implantare e aggiornare la giacenza. A livello di gruppo abbiamo **1.240 impianti a magazzino**: Straumann (512 pezzi, giacenza ottima), Nobel Biocare (388 pezzi) e Astra Tech (215 pezzi). Abbiamo invece 125 pezzi su Zimmer Biomet, con riordino automatico già programmato."
      },
      proiezione: {
        keywords: ["proiezione", "incasso", "incassi", "chiusura", "mese", "fatturato", "preventivi"],
        testo: "Gli incassi registrati oggi alle 13:35 ammontano a **68.400 €**. Nel mese corrente abbiamo raggiunto **892.000 €** incassati a fronte di 1.085.000 € di preventivi accettati (tasso di accettazione eccellente al **76.4%**). La proiezione statistica elaborata dai modelli previsionali indica una chiusura del mese a **1.240.000 €**, superando il target concordato con la tua direzione (1.160.000 €) del **+6.9%**. I motori principali di questa settimana sono le riabilitazioni All-on-4 a Treviso e Mestre e l'ottimo afflusso della clinica di Venezia."
      },
      autoclavi: {
        keywords: ["autoclavi", "manutenzione", "sterilizzazione", "macchine", "melag"],
        testo: "Sul gruppo ci sono 14 autoclavi operative: 13 lavorano in perfetta conformità (32 cicli completati stamattina con parametri di pressione e temperatura al 100%). L'unica criticità riguarda **l'Autoclave 2 di Conegliano (W&H Lisa Mini)**: durante il pre-vuoto frazionato abbiamo rilevato una caduta di vuoto di 0.19 bar con una confidenza del 94.2%. Ti consiglio di approvare l'allarme nella vista *Allarmi e decisioni* per deviare il kit delle 14:30 sulla Melag 44B+ (Sala Sterilizzazione 1) e chiamare l'assistenza Melag prima dell'inizio delle sedute di domani."
      },
      comfort: {
        keywords: ["comfort", "venezia", "attesa", "tempi", "pazienti", "cuore"],
        testo: "A **Venezia (San Marco 5254)** la situazione per i pazienti è eccellente: il tempo medio di attesa prima della visita è di appena **4.9 minuti** (il più basso di tutto il gruppo). L'indice di comfort acustico percepito è del **99%**, grazie all'insonorizzazione dei locali e all'isolamento antivibrante della sala macchine. Dai rilievi del lobo del Cuore emerge inoltre che il 78% dei pazienti veneziani preferisce visualizzare il preventivo tramite render 3D e simulazione estetica del sorriso rispetto agli schemi radiografici puri."
      }
    }
  }
};
