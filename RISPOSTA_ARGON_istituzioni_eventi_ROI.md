# Risposta al Briefing Argon · Istituzioni, Eventi, Ritorno in Euro e Controllo Completo sulle Obiezioni del Professore

**Data:** 14 Novembre 2026  
**Riferimento:** `BRIEFING_ARGON_istituzioni_eventi_ROI.md`  
**Ambito di verifica:** Testi parlati (`tools/testi_estesi.json`), etichette a schermo (`assets/js/atelier-data.js`), motore di generazione vocale (`tools/genera_audio_nicola.py`), regia musicale e sonora (`assets/js/audio-hud.js`, `assets/js/suoni.js`) e carosello 3D (`assets/js/atelier-app.js`).

---

## Quadro di sintesi: perché il Professore ha sollevato obiezioni

Dal controllo incrociato di tutti i file della presentazione (11 atti, da **Atto 00** ad **Atto 10**) emergono **tre problemi tecnici sull'audio** e **cinque criticità editoriali e accademiche** che spiegano esattamente le obiezioni del Professore:

1. **Il volume della musica e il ronzio di fondo (problema tecnico reale):**
   - **Su iPhone e iPad (iOS Safari):** il comando JavaScript `themeEl.volume = 0.01` usato in `audio-hud.js` **viene ignorato dal sistema operativo Apple** (su iOS il volume di un elemento `<audio>` semplice è bloccato al **100%** se non passa da un nodo `GainNode` della Web Audio API o se il file `theme.mp3` non viene abbassato alla fonte). Risultato: su iPhone e iPad la musica suona a volume pieno sopra la voce di Nicola.
   - **Su computer e telefoni (`suoni.js`):** al primo tocco dello schermo parte in automatico anche `suoni.js` (`avviaFondo()`), che genera **due oscillatori bassi continui a 42,4 Hz e 44,1 Hz più un rumore filtrato a 115 Hz** (nato come "rumore della nave" per la plancia). Questo ronzio grave continuo si somma alla musica e sporca la voce.
   - **Accelerazione artificiale della voce (`genera_audio_nicola.py`):** lo script accelera tutte le tracce del **20%** (`VELOCITA_FINALE = 1.2`) e taglia i respiri interni a **0,12 secondi**. La voce corre senza pause di pensiero, dando la sensazione di una lettura affannata sopra il sottofondo.
2. **Sovrapposizione tra invito come relatori e titolarità accademica (Atto 07):**
   - Anche se il punto 1 dell'Atto 07 parla di *"invitati come relatori"*, il punto 2 e la chiusura dell'Atto 07 dicono ancora: *"Portiamo il nostro metodo anche nei percorsi di alta direzione... Il metodo che portiamo nelle istituzioni, cucito nei vostri computer"*. Inoltre, in `atelier-data.js` (riga 532) è rimasto il sottotitolo: *"Nelle università insegniamo la metodologia scientifica e manageriale"*. Per un professore universitario, questa formulazione suona ancora come un'attribuzione di cattedra.
3. **Passaggio brusco nell'apertura (Atto 00):**
   - In `Atto 00` la frase *"Qui dentro non troverete venditori di programmi preconfezionati. Perché ogni investimento deve anche tornare in tasca"* lega due concetti che non dipendono l'uno dall'altro e usa l'espressione colloquiale *"tornare in tasca"*, seguita poco dopo da *"E si misura, fino all'ultimo euro"* (che inizia con la *"E"* dopo il punto).
4. **Chiusura dell'Atto 10 dopo i saluti:**
   - Mettere la frase sul ritorno economico **dopo** *"Grazie per essere stati nostri ospiti"* crea un finale doppio: prima ci si congeda con calore, poi arriva una frase contrattuale a freddo.
5. **Incoerenze residue tra i vari atti (Atto 01, Atto 02, Atto 10 e maiuscole a schermo):**
   - Nell'**Atto 02** la voce dice: *"Noi siamo gli inventori del protocollo dell'innesto a freddo dei modelli e dell'innesto dei lobi di fondazione"* (gergo tecnico incomprensibile per un pubblico non tecnico).
   - Nell'**Atto 01** i modelli locali vengono chiamati *"piccoli programmi di intelligenza artificiale"*, sminuendo il valore dell'architettura.
   - Da **Atto 00** ad **Atto 09** i titoli e le 4 schede su schermo (`atelier-data.js`) hanno ancora **Tutte Le Iniziali Maiuscole**, mentre solo Atto 01 e Atto 10 sono scritti in italiano normale.

---

## 1. Sezione 1 · Istituzioni e eventi

### 1.1 Verifica dei punti attuali (Atto 00, Atto 07, Atto 10) e confronto con la versione corretta

#### A. Atto 00 · Punto 4 (voce narrante e scheda a schermo)

| Elemento | Versione attuale (`testi_estesi.json` / `atelier-data.js`) | Criticità rilevata | Versione proposta (pulita e conforme) |
| :--- | :--- | :--- | :--- |
| **Scheda a schermo (`kpi[3]`)** | **Valore:** `Con le Istituzioni` <br> **Etichetta:** `Relatori Nei Più Autorevoli Eventi` | Iniziali tutte maiuscole (vietato dal briefing). | **Valore:** `Con le istituzioni` <br> **Etichetta:** `Relatori negli incontri di settore` |
| **Testo parlato (`00.punti[3]`)** | *"Collaboriamo con le istituzioni. Siamo stati invitati come relatori ai più autorevoli eventi del nostro settore, dal Master dell'Università Cattolica e del San Raffaele fino a Confindustria."* | Frase finale di 23 parole; nomi delle università abbreviati in modo disomogeneo rispetto all'Atto 07. | *"Collaboriamo con le istituzioni. Siamo stati invitati come relatori nei contesti più autorevoli del settore, dai Master universitari fino a Confindustria."* |

---

#### B. Atto 07 · Introduzione, Quattro Punti, Chiusura ed Etichette a schermo

Nell'**Atto 07** il Professore ha ragione su tutta la linea: oggi il primo punto accumula 59 parole spezzettate (*"Da Confindustria. E ci vedrete all'Unidi e a Expo Dental"*), mentre il secondo punto e la chiusura tornano a parlare come se tenessimo noi i corsi (*"Portiamo il nostro metodo anche nei percorsi di alta direzione... Il metodo che portiamo nelle istituzioni"*).

Ecco il confronto completo dell'**Atto 07**:

| Posizione in Atto 07 | Versione attuale | Versione proposta (frasi di 8–16 parole, rispetto assoluto dei ruoli) |
| :--- | :--- | :--- |
| **Titolo a schermo** | `Dall'Università alla Vostra Impresa` · `Il Metodo Spiegato in Aula, Pronto in Azienda` | `Dialogo con le istituzioni` · `Il confronto con il mondo accademico e associativo` |
| **Scheda 1 a schermo (`kpi[0]`)** | `Relatori Invitati` · `Cattolica, San Raffaele, Confindustria` | `Relatori invitati` · `Ospiti nei contesti accademici e associativi` |
| **Scheda 2 a schermo (`kpi[1]`)** | `Alta Direzione` · `Il Metodo Per Guidare l'Impresa` | `Incontri dal vivo` · `Confindustria, Unidi ed Expodental` |
| **Scheda 3 a schermo (`kpi[2]`)** | `Scelta per Fasi` · `Preventivi Chiari Senza Ansia` | `Proposte per fasi` · `Preventivi chiari che mettono a proprio agio` |
| **Scheda 4 a schermo (`kpi[3]`)** | `Ascolto Vero` · `Capire Quando Fermarsi` | `Ascolto vero` · `Riconoscere il momento giusto nel dialogo` |
| **Intro parlata (`07.intro`)** | *"C'è un motivo se il nostro approccio è così diverso da tutto il resto. TrinAI non nasce in uno scantinato di informatici chiusi nel loro mondo. Nasce dal dialogo con le istituzioni."* | *"Il nostro lavoro non nasce in uno scantinato di informatici isolati dal mondo. Nasce dal confronto costante con chi guida le imprese e con le istituzioni."* |
| **Punto 1 parlato (`07.punti[0]`)** | *"Siamo stati invitati come relatori ai più autorevoli eventi del nostro settore. Al Master dell'Università Cattolica del Sacro Cuore e dell'Università Vita-Salute San Raffaele. Da Confindustria. E ci vedrete all'Unidi e a Expo Dental. In quegli eventi avremo il piacere di incontrarvi, con i nostri incaricati alla selezione, per capire insieme se possiamo esservi utili. Chiedeteci i calendari esclusivi."* | *"Collaboriamo con le istituzioni e siamo stati invitati come relatori in contesti di grande prestigio. Tra questi, il Master dell'Università Cattolica del Sacro Cuore e dell'Università Vita-Salute San Raffaele."* |
| **Punto 2 parlato (`07.punti[1]`)** | *"Portiamo il nostro metodo anche nei percorsi di alta direzione per titolari e manager. Spieghiamo come si governa un'impresa con i numeri veri, come si guida la squadra e come si parla al paziente o al cliente."* | *"Presenteremo il nostro progetto anche in Confindustria, e saremo presenti agli appuntamenti Unidi ed Expodental. Lì vi incontreremo con i nostri incaricati alla selezione, per capire se possiamo esservi utili."* |
| **Punto 3 parlato (`07.punti[2]`)** | *"Perché le persone non dicono di no per il prezzo. Dicono di no quando si spaventano o si sentono spinte. Nell'Atelier abbiamo trasformato questo metodo in uno strumento vivo. Presenta i preventivi una tappa alla volta, per non spaventare con cifre enormi."* | *"In questi incontri condividiamo un principio semplice: le persone non dicono di no per il prezzo. Dicono di no quando provano incertezza. Per questo presentiamo ogni percorso una tappa alla volta."* |
| **Punto 4 parlato (`07.punti[3]`)** | *"E avvisa i vostri collaboratori nel momento esatto in cui fermarsi. Perché quando una persona si sente capita e protetta, dice di sì con fiducia."* | *"Il sistema aiuta i vostri collaboratori a cogliere il momento esatto in cui fermarsi e ascoltare. Quando una persona si sente capita e rispettata, nasce subito una fiducia solida."* |
| **Chiusura parlata (`07.chiusura`)** | *"Il metodo che portiamo nelle istituzioni, cucito nei vostri computer. Ora parliamo di numeri."* | *"Chiedeteci i calendari riservati dei prossimi incontri per riservarvi un colloquio dedicato. Passiamo ora al governo dei numeri."* |

> [!IMPORTANT]
> **Perché dividere l'elenco degli eventi tra Punto 1 e Punto 2 dell'Atto 07:**  
> Nella versione attuale, il Punto 1 dura **19,4 secondi** e contiene sia i Master universitari, sia Confindustria, Unidi, Expodental, gli incaricati alla selezione e i calendari. Dividendolo tra **Punto 1** (relatori invitati nei Master di Cattolica e San Raffaele) e **Punto 2** (presentazione del progetto in Confindustria, presenza a Unidi ed Expodental con gli incaricati alla selezione), il carosello 3D ruota in perfetto sincrono con la voce e scompare del tutto il vecchio Punto 2 che sembrava attribuirci corsi di docenza.

---

#### C. Atto 10 · Richiamo finale agli eventi e ai calendari

| Posizione in Atto 10 | Versione attuale (`testi_estesi.json`) | Versione proposta |
| :--- | :--- | :--- |
| **Chiusura parlata (`10.chiusura`)** | *"Questo è l'Atelier. Chiedeteci i calendari esclusivi degli eventi in cui avremo il piacere di incontrarvi. Nessun agente speciale veste di serie. Grazie per essere stati nostri ospiti all'Atelier di TrinAI. Il ritorno economico di ogni progetto si misura sempre rispetto a quello che abbiamo progettato insieme."* | Vedi **Sezione 2.2 e 2.3** qui sotto per le 3 alternative complete e l'ordine esatto dei saluti. |

---

### 1.2 Dove vive meglio questo messaggio: Atto 07, Atto 10 o entrambi?

Il messaggio funziona meglio se distribuito su **tre tocchi leggeri e complementari**, evitando ripetizioni identiche:

1. **In Atto 00 (Punto 4) — Il sigillo di autorevolezza (10 secondi):**  
   Basta dire che collaboriamo con le istituzioni e siamo stati invitati come relatori nei Master universitari e in Confindustria. Serve a rassicurare chi ascolta nei primi sessanta secondi, senza appesantire l'apertura con la lista delle fiere o con la selezione.
2. **In Atto 07 (Punti 1, 2 e chiusura) — Il racconto completo (cuore del messaggio):**  
   Qui trovano spazio i nomi completi (*Master dell'Università Cattolica del Sacro Cuore e dell'Università Vita-Salute San Raffaele*, *Confindustria*, *Unidi*, *Expodental*), la presenza degli *incaricati alla selezione* per capire insieme se possiamo essere utili, e il primo invito a richiedere i calendari.
3. **In Atto 10 (Chiusura) — Il richiamo caldo prima del congedo (una sola frase):**  
   Alla fine della Carta dei Servizi non serve ripetere l'elenco degli enti: basta una sola frase calda che invita a chiedere il calendario degli incontri dal vivo.

---

### 1.3 Come rendere *"Chiedeteci i calendari esclusivi"* un invito caldo e non uno slogan pubblicitario

La parola *"esclusivi"* detta da sola a fine frase (*"Chiedeteci i calendari esclusivi."*) suona brusca, quasi come uno spot televisivo. Ecco **tre formulazioni calde e signorili** (tutte tra 11 e 15 parole):

- **Opzione 1 (Ospitale e personale — consigliata per Atto 07):**  
  *"Chiedeteci i calendari riservati dei prossimi incontri, per riservarvi il piacere di un colloquio dedicato."* (15 parole)
- **Opzione 2 (Sobria e diretta — consigliata per Atto 10):**  
  *"Chiedeteci il calendario dei nostri incontri esclusivi, dove avremo il piacere di conoscervi di persona."* (15 parole)
- **Opzione 3 (Breve e sartoriale):**  
  *"Se desiderate incontrarci dal vivo in queste tappe, chiedeteci i nostri calendari esclusivi."* (13 parole)

---

### 1.4 Verifica delle parole che possono suonare come promesse non mantenibili

Ho controllato tutti gli 11 atti alla ricerca di espressioni che il Professore o un giurista possono contestare come promesse assolute o imprecisioni:

1. **`atelier-data.js` riga 532 (Atto 07):**  
   `sottotitolo: "Nelle università insegniamo la metodologia scientifica e manageriale..."`  
   **Perché va tolta:** dichiara una docenza universitaria diretta. Anche se i sottotitoli non sono mostrati nella card principale, restano nel codice sorgente ispezionabile.
2. **`testi_estesi.json` riga 23 (Atto 02):**  
   *"Noi siamo gli inventori del protocollo dell'innesto a freddo dei modelli e dell'innesto dei lobi di fondazione"*  
   **Perché va tolta o ammorbidita:** parlare di *"inventori del protocollo dell'innesto a freddo..."* davanti a cattedratici o imprenditori suscita scetticismo immediato, perché usa una terminologia chirurgica non standard senza brevetto citato. Meglio dire: *"Abbiamo progettato un'architettura originale che separa il calcolo matematico puro dalla spiegazione parlata."*
3. **`testi_estesi.json` riga 37 (Atto 03):**  
   *"Una volta salvato un documento, nessuno può alterarlo. Nemmeno un virus."*  
   **Perché è rischiosa:** nel settore informatico promettere *"Nemmeno un virus"* in senso assoluto espone a obiezioni tecniche. Meglio: *"Ogni documento viene sigillato in un registro immutabile, protetto anche contro i tentativi di manomissione."*
4. **`testi_estesi.json` righe 95 e 97 (Atto 09) e `atelier-data.js` riga 704:**  
   *"Arriviamo a tagliare oltre il sessanta per cento della spesa reale"* / *"Formazione Gratis · Coperta dai Fondi Aziendali"*  
   **Perché va calibrata:** i crediti d'imposta (Transizione 5.0 / Sabatini) e i fondi interprofessionali dipendono dai requisiti del singolo studio o impresa. Nel parlato conviene inserire sempre *"secondo i requisiti della vostra struttura"* e su schermo sostituire `Formazione Gratis` con `Formazione finanziata` · `Sostenuta dai fondi interprofessionali`.

---

## 2. Sezione 2 · Misurabilità in euro

### 2.1 Tre alternative per la frase di apertura in Atto 00 (`00.intro`)

**Regole applicate:** zero cifre o prezzi, frasi di 8–16 parole, verbi al presente, niente *"E"* dopo il punto, niente espressioni colloquiali come *"tornare in tasca"*.

- **Alternativa A · Emotiva (calda, centrata sulla tranquillità di chi guida l'impresa):**  
  *"Ogni passo compiuto insieme dà serenità al vostro lavoro e misura il proprio valore in euro."* (16 parole)
- **Alternativa B · Sobria (istituzionale, stile alta consulenza direzionale):**  
  *"Ogni scelta che facciamo insieme genera un valore concreto, trasparente e misurabile fino all'ultimo euro."* (15 parole)
- **Alternativa C · Concreta (pragmatica, parlata da imprenditore a imprenditore):**  
  *"Qui non acquistate programmi preconfezionati: costruiamo insieme un risultato solido, misurabile fino all'ultimo euro."* (14 parole)

---

### 2.2 Tre alternative per la frase di chiusura in Atto 10 (`10.chiusura`)

**Regole applicate:** **una sola frase parlata**, **massimo 20 parole**, nessun *"E ricordate:"*, nessuna *"E"* iniziale, nessun prezzo, fuoco sul **ritorno economico misurato rispetto a quello che abbiamo progettato insieme**.

- **Alternativa 1 (Classica e scolpita — 15 parole):**  
  *"Il ritorno economico di ogni intervento si misura sempre rispetto a quanto progettiamo insieme."*
- **Alternativa 2 (Diretta sul valore in euro — 16 parole):**  
  *"Misuriamo il ritorno economico in euro, confrontando ogni risultato con il progetto disegnato insieme a voi."*
- **Alternativa 3 (Solenne e sartoriale — 15 parole):**  
  *"Ogni euro investito si misura sui traguardi concreti che disegniamo e raggiungiamo insieme a voi."*

---

### 2.3 Analisi della posizione del ringraziamento in Atto 10: perché oggi suona freddo e come risolverlo

Nella versione attuale di `testi_estesi.json` (`10.chiusura`), l'ordine delle ultime quattro frasi è questo:
1. *"Questo è l'Atelier."*
2. *"Chiedeteci i calendari esclusivi degli eventi in cui avremo il piacere di incontrarvi."*
3. *"Nessun agente speciale veste di serie."*
4. *"Grazie per essere stati nostri ospiti all'Atelier di TrinAI."*
5. *"Il ritorno economico di ogni progetto si misura sempre rispetto a quello che abbiamo progettato insieme."*

**Diagnosi:**  
Ascoltata in cuffia o dagli altoparlanti, la frase 4 (*"Grazie per essere stati nostri ospiti..."*) ha l'intonazione vocale di un **saluto definitivo**. Quando subito dopo il ringraziamento parte la frase 5 sul ritorno economico, l'ascoltatore percepisce uno stacco freddo, come una clausola aggiunta dopo aver già stretto la mano all'ospite.

**La soluzione consigliata (Ordine invertito con congedo caldo prima del sigillo, oppure ringraziamento integrato):**

Hai due strade perfette per rispettare il vincolo che la frase sul ritorno economico sia l'ultima frase assoluta della presentazione senza raffreddare il saluto:

- **Strada A (Consigliata — Il ringraziamento apre il congedo, seguito dal patto di valore):**  
  1. *"Grazie per aver visitato il nostro Atelier."* (7 parole — apre il momento del saluto con calore)  
  2. *"Chiedeteci il calendario dei nostri prossimi incontri, dove avremo il piacere di conoscervi di persona."* (15 parole)  
  3. *"Nessun agente speciale veste di serie."* (6 parole)  
  4. *"Il ritorno economico di ogni intervento si misura sempre rispetto a quanto progettiamo insieme."* (14 parole — chiude come una firma d'onore, non come una postilla).
- **Strada B (Se si vuole chiudere lasciando insieme gratitudine e misura):**  
  Usare *"Vi ringraziamo per l'ascolto"* subito prima dell'invito ai calendari, così gli ultimi due pensieri restano il motto sartoriale (*"Nessun agente speciale veste di serie"*) e il patto sul risultato (*"Ogni euro investito si misura sui traguardi concreti che disegniamo e raggiungiamo insieme a voi"*).

---

## 3. Sezione 3 · Apertura (Atto 00)

**Obiettivo:** unire in **2–3 frasi brevi** da dire ad alta voce in apertura dell'**Atto 00** i due concetti chiave fissati da Giuseppe:
1. Aumentare **successo, relazioni, valore dell'attività e prestigio**;
2. **Misurabilità in euro** (senza dire alcun prezzo, senza la parola *"idea"*, senza *"E"* iniziale dopo il punto, con frasi di 8–16 parole).

Ecco **due proposte complete** per l'intera `intro` dell'**Atto 00** (incluso l'attacco cinematografico del Prequel 1):

### Proposta 1 · Ritmo solenne e sartoriale (consigliata)

> *"I posti che contano non hanno insegne sulla porta, hanno un invito.*  
> *Benvenuti nell'Atelier TrinAI, dove non troverete mai programmi preconfezionati.*  
> *Qui ogni passo accresce il vostro successo, le vostre relazioni, il valore della vostra attività e il vostro prestigio.*  
> *Ogni risultato nasce su misura per voi e si misura con chiarezza fino all'ultimo euro."*

- **Analisi del parlato:** 4 periodi puliti (12, 9, 17, 15 parole). Toglie la frase spezzata *"Perché ogni investimento deve anche tornare in tasca"* e trasforma la misurabilità in euro nel naturale coronamento di successo, relazioni, valore e prestigio.

### Proposta 2 · Ritmo diretto e imprenditoriale

> *"I posti che contano non hanno insegne sulla porta, hanno un invito.*  
> *Benvenuti nell'Atelier TrinAI.*  
> *Lavoriamo al vostro fianco per far crescere il successo, le relazioni, il prestigio e il valore della vostra impresa.*  
> *Ogni intervento viene cucito sulla vostra realtà e si misura fino all'ultimo euro."*

- **Analisi del parlato:** 4 periodi asciutti (12, 4, 18, 13 parole). Molto incisiva, dà subito il senso di un'alleanza tra pari.

---

## 4. Sezione 4 · Controllo tecnico completo: il volume della musica e tutte le anomalie trovate nel codice

Il Professore ha segnalato il **volume della musica** e varie incongruenze. Ho ispezionato riga per riga `audio-hud.js`, `suoni.js`, `genera_audio_nicola.py`, `atelier-data.js` e `atelier-app.js`. Ecco esattamente **cosa succede oggi** e **come si risolve**.

### 4.1 Perché la musica disturba la voce (3 cause tecniche sovrapposte)

#### Causa 1 · Su iPhone e iPad (`audio-hud.js`, righe 15–19 e 42–44) il volume della musica resta al 100%
In `assets/js/audio-hud.js` la musica di sottofondo (`assets/audio/theme.mp3`) viene creata così:
```javascript
themeEl = new Audio(THEME_SRC);
themeEl.loop = true;
themeEl.preload = "auto";
themeEl.volume = 0.02;
```
e quando parla il narratore:
```javascript
themeEl.volume = speaking ? 0.01 : 0.03;
```
**Il bug:** su **iOS / iPadOS (Safari e tutti i browser su iPhone e iPad)**, la proprietà `HTMLAudioElement.volume` è **bloccata da Apple in sola lettura a `1.0` (100%)**. Qualsiasi assegnazione `themeEl.volume = 0.01` viene ignorata silenziosamente dall'iPhone! Poiché il file `assets/audio/theme.mp3` (2,19 MB) è registrato a volume pieno mentre i file `act_00.mp3`..`act_10.mp3` sono normalizzati a `-16 LUFS`, **su qualunque iPhone o iPad la musica suona a volume massimo sopra la voce**.  
Al contrario, su un PC Windows, `0.01` (1%) è quasi impercettibile.

**Come si risolve in modo definitivo:**
1. **Abbassare direttamente il file `assets/audio/theme.mp3` con `ffmpeg` di `-24 dB`** (così anche su iPhone, dove `volume` vale `1.0`, la musica non potrà mai superare il livello di sottofondo morbido).
2. **Collegare `themeEl` a un nodo `GainNode` della Web Audio API** dentro `audio-hud.js`: a differenza di `themeEl.volume`, il `GainNode` funziona su **tutti** i dispositivi (inclusi iPhone e iPad) e permette di sfumare dolcemente la musica (fade-out di 0,4 secondi) quando Nicola inizia a parlare, oppure di **mettere in pausa la musica mentre parla la voce** e riattivarla solo tra una scheda e l'altra.

#### Causa 2 · C'è un secondo generatore sonoro nascosto (`assets/js/suoni.js`, righe 100–224) che emette un ronzio grave continuo
In `index.html` (riga 15) viene caricato `assets/js/suoni.js`. Appena l'utente tocca *"Entra nell'Atelier"*, la funzione `gestisciPrimoGestoUtente()` (riga 100 di `suoni.js`) avvia automaticamente `avviaFondo()`, che accende:
- un oscillatore sinusoidale continuo a **42,4 Hz**;
- un oscillatore triangolare continuo a **44,1 Hz** (che crea un battimento lento di 1,7 Hz);
- un generatore di rumore filtrato a **115 Hz**.

Questo "rombo di sala macchine" era nato per la plancia operativa CAOS, ma dentro la presentazione parlata crea un **tappeto grave continuo** che impasta le frequenze basse della voce maschile (`im_nicola`, che è stata pure enfatizzata a `220 Hz` con `equalizer=f=220:g=1.8` in `genera_audio_nicola.py`!).  
Inoltre, nel menu hamburger (`atelier-app.js` riga 903), il pulsante dice *"Suoni al tocco: attivi"*, ma in realtà accende e spegne proprio quel ronzio di fondo (`s.avviaFondo() / s.fermaFondo()`).

**Come si risolve:** disattivare `avviaFondo()` automatico in `suoni.js` (lasciando solo i leggeri tocchi sonori sui pulsanti, oppure spegnendo del tutto `avviaFondo()` durante il racconto vocale).

#### Causa 3 · La voce è accelerata del 20% (`VELOCITA_FINALE = 1.2`) con pause tagliate a 0,12 secondi
In `tools/genera_audio_nicola.py`:
- alla riga 20 è impostato `VELOCITA_FINALE = 1.2` (filtro `atempo=1.2` di `ffmpeg`);
- alla riga 79 il filtro `silenceremove` accorcia tutte le pause interne tra una frase e l'altra a **0,12 secondi** (`stop_silence=0.12`), e tra un punto e l'altro lascia solo **0,4 secondi** (che dopo `atempo=1.2` diventano **0,33 secondi**!).

**Effetto percepito dal Professore:** un relatore autorevole non parla mai a velocità `1.2x` con pause di un decimo di secondo tra i concetti. Portando `VELOCITA_FINALE` a **`1.05` (o `1.08`)** e la pausa tra le frasi a **`0.28s`** (e **`0.65s`** tra i quattro punti), la voce di Nicola acquista subito respiro, gravità e chiarezza didattica.

---

### 4.2 Altre anomalie trovate controllando tutti gli 11 atti ("controlla tutto")

Ecco l'elenco puntuale delle incongruenze trovate nel resto della presentazione, così potete decidere insieme cosa autorizzare:

| # | File e posizione | Anomalia rilevata | Correzione consigliata |
| :--- | :--- | :--- | :--- |
| **1** | `assets/js/atelier-app.js` (riga 637) | Il contatore della barra superiore ha ancora scritto in modo fisso `"Atto " + st.codice + " di 08"`, anche se gli atti ora sono **11** (`00`–`10`). | Sostituire `" di 08"` con `" di 10"` (oppure calcolarlo dinamicamente sull'ultimo codice). |
| **2** | `assets/js/atelier-data.js` (Atti `00` e `02`–`09`) | I titoli (`titoloLuce`, `titoloOro`) e tutte le 4 schede (`kpi.valore`, `kpi.label`) degli atti `00` e `02`–`09` usano ancora **Tutte Le Parole Con L'Iniziale Maiuscola** (es. `"Cerchiamo Noi i Fondi Per Ripagare e Blindare l'Investimento"`), in contrasto con la regola del briefing e con gli Atti `01` e `10`. | Convertire tutti i titoli e tutte le etichette `kpi` in italiano normale (solo la prima lettera maiuscola e i nomi propri). |
| **3** | `tools/testi_estesi.json` (`Atto 01`, righe 17–18) | Il parlato dice: *"Due grandi costruttori di intelligenza artificiale hanno creato assistenti capaci di lavorare da soli... E i dati? Restano a piccoli programmi di intelligenza artificiale che girano in sede"*. Chiamare il cuore locale di TrinAI *"piccoli programmi"* sminuisce il prodotto davanti a un cliente o al Professore. | Sostituire *"piccoli programmi di intelligenza artificiale"* con *"modelli dedicati e riservati che lavorano solo dentro la vostra sede"*. |
| **4** | `tools/testi_estesi.json` (`Atto 02`, riga 23) vs `atelier-data.js` (riga 158) | 1) Nel parlato si dice: *"Noi siamo gli inventori del protocollo dell'innesto a freddo dei modelli e dell'innesto dei lobi di fondazione"* (espressione iper-tecnica che viola il divieto di tecnicismi). <br> 2) Nei testi audio è scritto **Viktor** con la **k**, mentre nelle schede di `atelier-data.js` è scritto **Victor** con la **c**. | 1) Sostituire la frase tecnica con: *"Nasce da un metodo progettato nei nostri laboratori, che separa il calcolo matematico dalla parola."* <br> 2) Uniformare ovunque la grafia del nome (**Victor** oppure **Viktor**). |
| **5** | `assets/js/atelier-data.js` (`Atto 10`, righe 778–795) e `atelier-app.js` (riga 459) | Nell'**Atto 10** ci sono **16 schede** montate sullo stesso anello verticale 3D di raggio `128px` pensato per 4 schede (`step = 22,5°`). Su uno schermo verticale le 16 schede si compenetrano visivamente e l'audio legge un elenco di 16 frasi per **86 secondi** consecutivi. | Aumentare automaticamente il raggio dell'anello 3D quando le schede sono più di 4 (oppure raggruppare visivamente i 16 servizi in 4 grandi famiglie da 4 voci ciascuna). |
| **6** | `assets/audio/subtitles.json` | Il file `subtitles.json` è rimasto fermo alla vecchia versione a 9 stazioni (`stazione_00`..`stazione_08`) e contiene ancora la frase *"Come attestato nel Registro delle Imprese, collaboriamo ufficialmente con l'Università Cattolica..."*. Anche se `audio-hud.js` oggi non lo mostra, il file è ancora presente nella cartella `assets/audio/`. | Rimuovere o allineare `subtitles.json` e i vecchi file `stazione_00.mp3`..`stazione_08.mp3` non più usati, così nessuno può aprirli per errore. |

---

## 5. Elenco di dubbi sui fatti da confermare con Giuseppe

Prima di toccare qualsiasi file della presentazione o rigenerare l'audio, ecco i **6 punti fattuali** da confermare con Giuseppe:

1. **Confindustria — tempo verbale e formulazione esatta:**  
   Nell'Atto 00 e nell'Atto 07 preferisci dire al futuro *"in Confindustria, dove presenteremo il nostro progetto"* (come indicato negli appunti del briefing) oppure mantenere una formula valida anche dopo l'evento, come *"in Confindustria, dove presentiamo il nostro progetto"*?
2. **Nomi ufficiali delle manifestazioni di settore (`Unidi` ed `Expodental`):**  
   Nel testo parlato attuale è scritto *"all'Unidi e a Expo Dental"*. Confermi che a schermo vogliamo scrivere **Unidi** ed **Expodental** (tutto attaccato, nome ufficiale di *Expodental Meeting* promosso da UNIDI) e che nella pronuncia vocale va bene *"agli appuntamenti Unidi ed Expodental"*?
3. **Ruolo degli *"incaricati alla selezione"*:**  
   L'espressione *"con i nostri incaricati alla selezione, per capire insieme se possiamo esservi utili"* va mantenuta con queste parole esatte (per sottolineare che l'ingresso nell'Atelier avviene su selezione), oppure il Professore preferisce una dicitura più morbida come *"con i nostri referenti dedicati"* o *"con i responsabili dell'ammissione all'Atelier"*?
4. **Riferimento all'innesto a freddo e ai lobi di fondazione nell'Atto 02:**  
   La frase *"Noi siamo gli inventori del protocollo dell'innesto a freddo dei modelli e dell'innesto dei lobi di fondazione"* (inserita nell'Atto 02) è stata una delle frasi contestate dal Professore per il tono tecnico, oppure vuoi conservarla esattamente così?
5. **Grafia ufficiale del nome: `Victor` o `Viktor`?**  
   Nelle schede a schermo è scritto **Victor** (con la `c`), mentre nei copioni vocali è scritto **Viktor** (con la `k`). Quale delle due grafie fissiamo come unica ufficiale a schermo?
6. **Gestione della musica di sottofondo mentre parla la voce:**  
   Per risolvere subito l'obiezione del Professore sul volume della musica, preferisci che **mentre la voce parla la musica si abbassi a un soffio impercettibile (-26 dB reali anche su iPhone)**, oppure che **la musica si fermi del tutto quando parte la voce** e suoni solo nella schermata di ingresso e nelle pause?
