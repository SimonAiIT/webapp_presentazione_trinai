# Briefing e Report di Revisione: Etichette e Fruibilità per un Pubblico Non Tecnico

**Progetto:** `webapp_presentazione_trinai` (TrinAI Atelier)  
**Stato intervento:** **Sola analisi e proposta editoriale (nessun file di codice modificato)**  
**Obiettivo:** Eliminare ogni residuo di gergo informatico, sigle legali/burocratiche, inglesismi tecnici e diciture da interfaccia software ("da programmatore"), sostituendoli con un linguaggio **imprenditoriale, caldo, sartoriale e immediatamente comprensibile** da qualsiasi titolare d'azienda, medico, professionista o decisore non tecnico.

---

## 1. Diagnosi Generale: Perché alcune etichette attuali respingono il non-tecnico

Dall'ispezione integrale di [index.html](file:///C:/Users/garof/Desktop/TrinAi/TrinAi-Comunicazione/webapp_presentazione_trinai/index.html), [atelier-data.js](file:///C:/Users/garof/Desktop/TrinAi/TrinAi-Comunicazione/webapp_presentazione_trinai/assets/js/atelier-data.js), [atelier-app.js](file:///C:/Users/garof/Desktop/TrinAi/TrinAi-Comunicazione/webapp_presentazione_trinai/assets/js/atelier-app.js), [real_cockpit/index.html](file:///C:/Users/garof/Desktop/TrinAi/TrinAi-Comunicazione/webapp_presentazione_trinai/real_cockpit/index.html) e [arkangel_viewer/index.html](file:///C:/Users/garof/Desktop/TrinAi/TrinAi-Comunicazione/webapp_presentazione_trinai/arkangel_viewer/index.html), emergono **5 difetti di comunicazione** nelle etichette brevi:

1. **Sindrome da "Scheda Tecnica Hardware":**
   - Etichette come `32 GB`, `128 GB`, `0 MB Scheda Video`, `WORM`, `Demone in Rust`, `k >= 5` parlano della *ferraglia* e non del *beneficio*. Un imprenditore non vuole comprare gigabyte o linguaggi di programmazione (`Rust`): vuole sapere che **il computer non si blocca mai**, che **i suoi segreti sono in cassaforte** e che **nessuno può cancellargli l'archivio**.
2. **Inglesismi da Consulenza IT:**
   - Parole come `Audit`, `Deploy Fisico`, `Scouting`, `Postgraduate Executive Decision Intelligence`, `Cloud`, `Background`, `Target` raffreddano il tono da alta sartoria italiana. Vanno tradotte in italiano nobile e concreto: **Ascolto della Struttura**, **Installazione in Sede**, **Ricerca Bandi**, **Corsi di Alta Direzione**, **Dietro le Quinte**.
3. **Sigle Burocratiche e Legali Nude nei Titoli e nei KPI:**
   - Mettere `D.L. 179/2012 art. 25`, `DPIA FRIA`, `AI Act Art. 4`, `GDPR Art. 35`, `CCIAA`, `ZES`, `ISI INAIL` dentro i badge o i quadranti principali spaventa il lettore. La legge va citata nel testo di garanzia in fondo, mentre l'etichetta in alto deve dire: **Scudo Legale Completo**, **Zero Sorprese ai Controlli**, **Formazione Riconosciuta**.
4. **Etichette "Meta-Interfaccia" (che spiegano la pagina invece del valore):**
   - Titoli di sezione come `Dove e Come Si Applica in Parole Semplici` (dire *"in parole semplici"* a un imprenditore suona scolastico), `Approfondimenti Espandibili` (descrive il componente grafico invece del contenuto!) o `Carosello 3D · Scorri o clicca ai lati ↔` tolgono magia all'esperienza.
5. **Residui nei Due Laboratori Interattivi (`real_cockpit` e `arkangel_viewer`):**
   - In [real_cockpit/index.html](file:///C:/Users/garof/Desktop/TrinAi/TrinAi-Comunicazione/webapp_presentazione_trinai/real_cockpit/index.html) compaiono ancora il riferimento al verticale `Polo Arcada Demo`, i due punti in `LOBI:` e le parentesi in `Direzione (Nomi in chiaro)`.
   - In [arkangel_viewer/index.html](file:///C:/Users/garof/Desktop/TrinAi/TrinAi-Comunicazione/webapp_presentazione_trinai/arkangel_viewer/index.html) il titolo `ArkAng-EL · Cockpit` e voci come `Esporta guida STL`, `semicorda Dx`, `freccia AP Dx` risultano ostici per chi non è un chirurgo o un odontotecnico.

---

## 2. Revisione Globale dell'Interfaccia Fissa ([index.html](file:///C:/Users/garof/Desktop/TrinAi/TrinAi-Comunicazione/webapp_presentazione_trinai/index.html) e [atelier-app.js](file:///C:/Users/garof/Desktop/TrinAi/TrinAi-Comunicazione/webapp_presentazione_trinai/assets/js/atelier-app.js))

| Posizione | Etichetta Attuale (Critica) | Nuova Etichetta Consigliata (Non Tecnica & Luxury) | Perché funziona meglio |
| :--- | :--- | :--- | :--- |
| **Gate · Sottotitolo** | *Sblocca il carosello tridimensionale e la voce narrante per esplorare la nostra architettura sovrana.* | *Entra nel laboratorio sartoriale e lasciati guidare dalla voce narrante.* | Non parla del "carosello 3D" (meccanismo tecnico), ma dell'esperienza. |
| **Gate · Bottone** | `Apri l'Invito e Avvia Esperienza` | `Entra nell'Atelier` | Più netto, esclusivo, immediato. |
| **Gate · Cassetto** | `Accesso con codice direzionale` | `Hai ricevuto una chiave riservata` | Coerente con lo storytelling dell'Invito. |
| **Topbar · Contatore** | `ATTO 00 / 08` | `CAPITOLO 1 DI 9` *(oppure `TAPPA 1 DI 9`)* | Partire da `00` è un'abitudine da programmatori (array 0-indexed). Il pubblico normale conta da `1` a `9`. |
| **Topbar · Musica** | `Musica ON` / `Musica OFF` | `Sottofondo Musicale` | Più elegante di "ON/OFF". |
| **Topbar · Menu** | `Indice` | `Tutte le Tappe` | Fa capire subito cosa si trova aprendo il menu. |
| **Card · Kicker DX** | `Carosello 3D · Scorri o clicca ai lati ↔` | `Scorri per cambiare tappa ↔` | Semplice, non nomina il componente "Carosello 3D". |
| **Card · Sezione 1** | `Dove e Come Si Applica in Parole Semplici` | `Cosa Cambia nel Vostro Lavoro di Ogni Giorno` | Rispetta l'intelligenza dell'imprenditore e punta dritto al risultato pratico. |
| **Card · Sezione 2** | `Approfondimenti Espandibili` | `Domande Frequenti di Chi Guida l'Impresa` *(o `Per Chi Vuole Approfondire`)* | Elimina la parola tecnica "Espandibili". |
| **Card · Sezione 3** | `Moduli della Carta dei Servizi` | `Cosa Facciamo per Voi in Questa Tappa` | Trasforma il "catalogo burocratico" in servizio concreto. |
| **HUD · Bottone Play** | `Ascolta Atto` / `Pausa Voce` | `Ascolta il Racconto` / `Metti in Pausa` | "Atto" e "Pausa Voce" sono rigidi; "Ascolta il Racconto" invita al clic. |
| **Drawer · Suoni** | `Suoni Interfaccia ON` | `Suoni al Tocco` | "Interfaccia" è gergo informatico. |

---

## 3. Revisione Completa Tappa per Tappa ([atelier-data.js](file:///C:/Users/garof/Desktop/TrinAi/TrinAi-Comunicazione/webapp_presentazione_trinai/assets/js/atelier-data.js))

Di seguito la mappa completa delle sostituzioni consigliate per **Titoli, KPI, Simulatori, Badge e Tavole Grafiche SVG** di ciascuna delle 9 card, depurate da ogni tecnicismo.

---

### Tappa 1 (ex Atto 00) · L'Invito e la Partenza in Cinque Minuti

* **Problema attuale:** Uso di termini come *"Genesi Architettura di Fondazione"*, *"Inizializzazione Genetica"*, *"Compagine Multidisciplinare"*, *"D.L. 179/2012 art. 25"*.
* **Proposta non tecnica:**
  - **Titolo Card:** `L'Invito Riservato` · **Oro:** `E la Vostra Azienda Pronta in Cinque Minuti`
  - **Sottotitolo:** `Non partiamo mai da un foglio bianco ma dalla storia reale della vostra attività`
  - **Domanda Guida:** `Perché con noi non perdete settimane a inserire dati a mano per iniziare a lavorare`
  - **4 Riquadri Numerici (ex KPI):**
    1. `5 Minuti` $\rightarrow$ `Per Creare la Vostra Base` *(invece di "Genesi Architettura di Fondazione")*
    2. `6 Aree` $\rightarrow$ `Pronte fin dal Primo Giorno` *(invece di "Attivati Nativamente al Primo Avvio")*
    3. `7 Specialisti` $\rightarrow$ `Soci tra Medici, Ingegneri e Formatori` *(invece di "Compagine Multidisciplinare Certificata")*
    4. `2 Università` $\rightarrow$ `Collaborazioni Accademiche Ufficiali` *(invece di "2 Atenei")*
  - **Pulsanti Simulatore (`Come Nasce il Vostro Sistema in Cinque Minuti`):**
    - `Minuto 1 · Inseriamo la Partita IVA` (invece di *"Lettura Dati Ufficiali / registri camerali"*)
    - `Minuto 3 · Si Accendono le Sei Aree di Lavoro` (invece di *"Cucitura dei Sei Reparti"*)
    - `Minuto 5 · Siete Pronti a Operare` (invece di *"Plancia Pronta all'Uso"*)
  - **Badge e Titoli Schede:**
    - `PARTENZA RAPIDA` · **Niente Settimane Perse a Caricare Dati** (invece di *"FONDAZIONE · Inizializzazione Genetica in Cinque Minuti"*)
    - `TUTTO IN UNO` · **Sei Aree che Si Parlano tra Loro** (invece di *"SEI REPARTI · Un Solo Sistema Operativo..."*)
    - `CHI SIAMO` · **Imprenditori, Medici e Ingegneri al Vostro Fianco** (invece di *"ISTITUZIONALE · Garanzia di Start-up Innovativa..."*)

---

### Tappa 2 (ex Atto 01) · Chi è Victor e Come Ragiona

* **Problema attuale:** *"Automa decisionale"*, *"1,97 ms"*, *"Primo Cervello / Secondo Cervello"*, *"Zero Cloud"*, *"Serie nel Tempo"*, *"Visione Ottica"*.
* **Proposta non tecnica:**
  - **Titolo Card:** `Chi è Victor` · **Oro:** `Il Direttore Operativo che Non Dorme Mai`
  - **Sottotitolo:** `Osserva, ascolta, fa i conti all'istante e vi avvisa in due righe chiare solo quando serve`
  - **Domanda Guida:** `Qual è la differenza tra i programmi che chiacchierano su internet e un vero compagno di squadra`
  - **4 Riquadri Numerici:**
    1. `Un Istante` $\rightarrow$ `Due Millisecondi per Decidere` *(invece di "1,97 ms · Primo Cervello")*
    2. `Due Righe` $\rightarrow$ `Per Spiegarvi Cosa Fare` *(invece di "Secondo Cervello · Spiegazione Chiara")*
    3. `Cinque Sensi` $\rightarrow$ `Vede, Ascolta e Fa i Conti` *(invece di "Vista, Spazio 3D, Suono, Tempo e Numeri")*
    4. `Zero Invenzioni` $\rightarrow$ `Parla Solo su Dati Veri` *(invece di "Zero Cloud")*
  - **Tavola Grafica SVG (`victor_dual_brain`):**
    - Sostituire le 5 etichette tecniche a sinistra con: `1. VEDE LE FORME 3D` · `2. ASCOLTA I MACCHINARI` · `3. LEGGE L'ANDAMENTO` · `4. INCROCIA I CONTI` · `5. OSSERVA IL TAVOLO`
    - Al centro: `1° PASSO · IL CALCOLO` (`In Due Millisecondi`) $\rightarrow$ A destra: `2° PASSO · LA SPIEGAZIONE` (`Due Righe Chiare · Mai Numeri Inventati`).
  - **Badge e Titoli Schede:**
    - `OCCHIO CLINICO` · **Si Accorge Subito se Qualcosa Non Quadra**
    - `PAROLE CHIARE` · **Vi Spiega il Perché in Due Sole Righe**
    - `CINQUE SENSI` · **Ascolta Anche la Salute delle Attrezzature**

---

### Tappa 3 (ex Atto 02) · I Vostri Segreti Restano in Casa Vostra

* **Problema attuale:** *"Sovranità Fisica e Intelligenza Diffusa"*, *"Modalità Isola Attiva"*, *"WORM · Backup Immutabile Anti-Riscrittura"*, *"Minimo 5 · Soglia Anonimizzazione"*, *"32 GB / 128 GB"*, *"k >= 5"*.
* **Proposta non tecnica:**
  - **Titolo Card:** `I Vostri Dati Restano` · **Oro:** `Chiusi a Chiave in Casa Vostra`
  - **Sottotitolo:** `Nessun segreto inviato su internet, lavoro garantito anche se cade la linea e controllo sicuro su più sedi`
  - **Domanda Guida:** `Perché tenere l'intelligenza dentro le vostre mura è l'unica vera garanzia di sicurezza`
  - **4 Riquadri Numerici:**
    1. `100% in Sede` $\rightarrow$ `Nessun Dato Mandato Fuori`
    2. `Sempre Attivo` $\rightarrow$ `Funziona Anche Senza Internet` *(invece di "Isola Attiva")*
    3. `Incancellabile` $\rightarrow$ `Archivio Protetto da Manomissioni` *(invece di "WORM · Backup Immutabile")*
    4. `Più Sedi` $\rightarrow$ `Controllo Centrale Riservato` *(invece di "Minimo 5 · Soglia Anonimizzazione")*
  - **Tavola Grafica SVG (`two_planes_sovereign`):**
    - Sostituire `POSTAZIONI 32 GB · Modalita Isola Offline` con `I COMPUTER DELLE SALE · Lavorano Anche Senza Rete`.
    - Sostituire `NODO SOVRANO 128 GB · Archivio WORM Immutabile` con `LA CASSAFORTE DELLA SEDE · Archivio Incancellabile`.
    - Sostituire `Solo Aggregati k >= 5` con `Solo Totali Anonimi · Zero Nomi Esposti`.

---

### Tappa 4 (ex Atto 03) · Usa i Vostri Programmi di Sempre al Posto Vostro

* **Problema attuale:** *"Il Computer Use sui Vostri Programmi Attuali"*, *"0 MB · Consumo Scheda Video"*, *"Demone in Rust"*, *"Background"*, *"Presidio Umano"*.
* **Proposta non tecnica:**
  - **Titolo Card:** `Tenete i Vostri Programmi` · **Oro:** `Al Lavoro Ripetitivo Pensa Lui`
  - **Sottotitolo:** `Non dovete cambiare gestionale né imparare nuovi software perché l'assistente compila i vostri programmi dietro le quinte`
  - **Domanda Guida:** `Come si elimina la fatica di caricare dati senza costringere la squadra a cambiare abitudini`
  - **4 Riquadri Numerici:**
    1. `Zero Cambi` $\rightarrow$ `Usate i Programmi che Avete Già`
    2. `Mani Libere` $\rightarrow$ `Non Vi Blocca Mai il Mouse` *(invece di "Zero Furto")*
    3. `Leggerissimo` $\rightarrow$ `Non Rallenta Mai il Computer` *(invece di "0 MB Consumo Scheda Video")*
    4. `Voi Decidete` $\rightarrow$ `Lui Prepara e Voi Confermate`
  - **Tavola Grafica SVG (`rust_semantic_daemon`):**
    - Sostituire `DEMONE IN RUST · 0 MB Scheda Video` con `ASSISTENTE SILENZIOSO · Non Rallenta il PC e Non Tocca il Mouse`.
  - **Bottone Laboratorio 3D:**
    - Invece di `Apri Laboratorio Visivo 3D e Geometria` $\rightarrow$ `Prova dal Vivo il Visore 3D di Precisione`

---

### Tappa 5 (ex Atto 04) · Pronti in Sede in Due Giorni Senza Fermare il Lavoro

* **Problema attuale:** *"Pre-Addestramento in Lab e Deploy in Due Giorni"*, *"Audit ed estrazione cifrata"*, *"Deploy Fisico"*, *"Vassoio Ottico"*.
* **Proposta non tecnica:**
  - **Titolo Card:** `Prepariamo Tutto Prima` · **Oro:** `E in Due Giorni Siete Attivi`
  - **Sottotitolo:** `Facciamo il lavoro pesante nei nostri laboratori così nella vostra sede bastano due giorni di installazione e formazione, salvo imprevisti`
  - **Domanda Guida:** `Come si attiva l'intero sistema in quarantotto ore senza perdere nemmeno un cliente o un'ora di lavoro`
  - **4 Riquadri Numerici:**
    1. `4 Passi` $\rightarrow$ `Metodo Chiaro e Collaudato`
    2. `Da Noi` $\rightarrow$ `Prepariamo le Macchine Prima` *(invece di "In Lab")*
    3. `2 Giorni` $\rightarrow$ `Installazione e Corso in Sede` *(invece di "Deploy Fisico e Istruzione")*
    4. `Riservatezza` $\rightarrow$ `Vede gli Strumenti e Mai i Volti` *(invece di "Zero Volti · Vassoio Ottico")*
  - **Tavola Grafica SVG (`lab_to_site_48h`):**
    - `1 · ASCOLTO E RACCOLTA` (invece di `FASE 1 · AUDIT / Estrazione Cifrata`)
    - `2 · PREPARAZIONE DA NOI` (invece di `FASE 2 · LAB TRINAI / Pre-Addestramento`)
    - `3 · PROVA GENERALE` (invece di `FASE 3 · COLLAUDO / Simulazione`)
    - `4 · IN SEDE IN 2 GIORNI` (`Installazione e Corso Pratico · Salvo Imprevisti`)

---

### Tappa 6 (ex Atto 05) · Aiutare la Squadra a Crescere e Saper Delegare

* **Problema attuale:** *"L'Orchestra Umana e le Centocinquanta Soft Skill"*, *"Mappatura Attitudini"*, *"Articolo 4 · Certificazione Europea"*, *"Micro-Training Pratico"*.
* **Proposta non tecnica:**
  - **Titolo Card:** `Far Crescere la Squadra` · **Oro:** `E Liberare il Tempo del Titolare`
  - **Sottotitolo:** `Capire il talento di ogni collaboratore per mettere la persona giusta al posto giusto e delegare con serenità`
  - **Domanda Guida:** `Come si passa da un'azienda dove il titolare deve controllare tutto a una squadra organizzata e autonoma`
  - **4 Riquadri Numerici:**
    1. `150 Casi Reali` $\rightarrow$ `Per Scoprire i Punti di Forza` *(invece di "150 Scenari · Mappatura Attitudini")*
    2. `90 Giorni` $\rightarrow$ `Per Imparare a Delegare Davvero` *(invece di "30·60·90 gg")*
    3. `Zero Giudizi` $\rightarrow$ `Aiuto al Ruolo e Mai Classifiche`
    4. `Attestato UE` $\rightarrow$ `Personale Formato a Norma di Legge` *(invece di "Articolo 4")*

---

### Tappa 7 (ex Atto 06) · Dai Master Universitari al Dialogo con il Cliente

* **Problema attuale:** *"Master Universitari, Postgraduate e Metodo Un Passo alla Volta"*, *"Corsi Executive Decision Intelligence"*, *"Tavole Progettuali Anti-Ansia"*.
* **Proposta non tecnica:**
  - **Titolo Card:** `Il Metodo che Insegniamo` · **Oro:** `Nelle Università Entra in Azienda`
  - **Sottotitolo:** `Nei Master Universitari e nei corsi di Alta Direzione insegniamo la metodologia di gestione e comunicazione che qui ritrovate già pronta`
  - **Domanda Guida:** `Perché un cliente o un paziente accetta più volentieri quando viene accompagnato un passo alla volta`
  - **4 Riquadri Numerici:**
    1. `Master II Livello` $\rightarrow$ `Cattolica e San Raffaele`
    2. `Alta Direzione` $\rightarrow$ `Corsi per Imprenditori e Titolari` *(invece di "Postgraduate · Executive Decision Intelligence")*
    3. `Un Passo per Volta` $\rightarrow$ `Spiegazioni Chiare Senza Spaventare`
    4. `Basta Così` $\rightarrow$ `Fermarsi Quando il Cliente Dice Sì`

---

### Tappa 8 (ex Atto 07) · Quanto Vale Ogni Minuto e Come Recuperare Lavoro

* **Problema attuale:** *"Il Valore di Ogni Minuto, il ROI e il Mercato"*, *"26 Indici · Calcolo Matematico Certificato"*, *"Deterministic_roi_26"*, *"Capitale Dormiente"*, *"Radar Competitivo"*.
* **Proposta non tecnica:**
  - **Titolo Card:** `Conoscere il Guadagno Vero` · **Oro:** `Di Ogni Minuto e Recuperare i Sospesi`
  - **Sottotitolo:** `Conti esatti al centesimo, cura dei clienti che si erano fermati e visione chiara del mercato intorno a voi`
  - **Domanda Guida:** `Quanto lavoro e quanto margine recuperate quando sapete esattamente dove state guadagnando e chi ricontattare`
  - **4 Riquadri Numerici:**
    1. `26 Voci Chiave` $\rightarrow$ `Conti Veri Fatti al Centesimo`
    2. `Ogni Minuto` $\rightarrow$ `Sapete Quanto Costa e Quanto Rende`
    3. `Lavoro Recuperato` $\rightarrow$ `Preventivi e Richiami Riattivati` *(invece di "Capitale Dormiente")*
    4. `Uno Sguardo Fuori` $\rightarrow$ `Come Si Muove il Vostro Territorio` *(invece di "Radar Competitivo")*
  - **Bottone Laboratorio Live:**
    - Invece di `Apri Plancia Direzionale Multi-Sede Live` $\rightarrow$ `Guarda un Esempio Reale di Cruscotto Direzionale`

---

### Tappa 9 (ex Atto 08) · Ricerca dei Fondi Pubblici e Protezione Legale

* **Problema attuale:** *"Dossier DPIA FRIA e AI Act Incluso"*, *"Scouting · Ricerca Attiva Bandi"*, *"CCIAA"*, *"ZES"*, *"ISI INAIL"*, *"Perizia di interconnessione"*.
* **Proposta non tecnica:**
  - **Titolo Card:** `Cerchiamo Noi i Fondi` · **Oro:** `Per Ripagare e Blindare l'Investimento`
  - **Sottotitolo:** `Individuiamo i bandi e gli incentivi per farvi risparmiare oltre il sessanta percento e vi consegniamo tutte le carte in regola per la legge europea`
  - **Domanda Guida:** `Come si riduce la spesa reale attingendo ai contributi pubblici senza doversi preoccupare della burocrazia`
  - **4 Riquadri Numerici:**
    1. `Fino al -60,1%` $\rightarrow$ `Risparmio Reale con gli Incentivi`
    2. `Ricerca Bandi` $\rightarrow$ `Troviamo i Fondi Adatti a Voi` *(invece di "Scouting")*
    3. `Formazione Gratis` $\rightarrow$ `Coperta dai Fondi Aziendali` *(invece di "Fondi Interprofessionali")*
    4. `Carte in Regola` $\rightarrow$ `Tutela Completa per Ogni Controllo` *(invece di "100% UE · Dossier DPIA FRIA")*

---

## 4. Note di Allineamento sui Due Laboratori Interattivi

Quando deciderai di applicare il restyling lessicale, ti consiglio di includere anche questi piccoli ritocchi nei due laboratori collegati:

1. **Plancia Direzionale ([real_cockpit/index.html](file:///C:/Users/garof/Desktop/TrinAi/TrinAi-Comunicazione/webapp_presentazione_trinai/real_cockpit/index.html)):**
   - Sostituire `VICTOR · Polo Arcada Demo` con `VICTOR · Plancia Direzionale Dimostrativa` (per coerenza con l'eliminazione dei verticali).
   - Sostituire `LOBI: OCCHI · ORECCHIE · PELLE · CUORE · MEMORIA` con `SENSI ATTIVI · VISTA · UDITO · CONTATTO · RELAZIONE · MEMORIA` (eliminando i due punti).
   - Sostituire `Direzione (Nomi in chiaro)` con `Vista Direzione · Nomi Visibili` (eliminando le parentesi).
2. **Visore 3D ([arkangel_viewer/index.html](file:///C:/Users/garof/Desktop/TrinAi/TrinAi-Comunicazione/webapp_presentazione_trinai/arkangel_viewer/index.html)):**
   - Sostituire `ArkAng-EL · Cockpit` con `TrinAI Atelier · Laboratorio Geometrico 3D`.
   - Sostituire le sottovoci latine/tecniche (`arcus dentalis`, `semicorda Dx`, `freccia AP Dx`) con diciture immediate (`Arcata anatomica`, `Misura destra`, `Profondità anteriore`).
