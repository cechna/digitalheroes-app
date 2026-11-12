# Guida Operativa per gli Organizzatori di Digital Heroes

Benvenuto nel pannello di gestione di **Digital Heroes**. Questa guida rapida illustra come gestire eventi, caricare materiali didattici, pubblicare annunci in bacheca e inviare comunicazioni agli iscritti.

---

## 1. Accesso al Pannello di Gestione

- Effettua il login con il tuo account organizzatore.
- Nella barra di navigazione in alto comparirà il pulsante viola **Pannello Gestione** (visibile solo a utenti con ruolo *Organizzatore* o *Amministratore*).
- Dallo smartphone, trovi la voce aprendo il menu laterale.

---

## 2. Creazione e Pubblicazione di un'Attività

1. Vai su **Attività & Iscrizioni** (`/gestione/attivita`).
2. Clicca su **+ Nuova Attività**.
3. Compila i campi:
   - **Titolo e Descrizione:** spiega chiaramente obiettivi, prerequisiti e programma.
   - **Tipologia:** Evento, Meetup o Corso.
   - **Date e Orari:** specificate nel fuso orario *Europe/Rome* (la piattaforma gestisce in automatico l'ora solare e legale).
   - **Capienza:** inserisci il numero massimo di posti disponibili. Il sistema bloccherà atomicamente ulteriori registrazioni una volta esauriti i posti.
   - **Luogo o Link:** inserisci l'indirizzo della sede fisica o il link alla sessione online (mostrato agli utenti iscritti).
   - **Stato:** *Bozza* (visibile solo a te per revisione) o *Pubblicato* (visibile a tutta la community).

---

## 3. Gestione e Consultazione Iscritti

- Dal dettaglio dell'attività (`/attivita/[id]`), la sezione **Elenco Partecipanti** è visibile **esclusivamente agli organizzatori assegnati e agli amministratori**.
- Puoi consultare nome, cognome, indirizzo email e organizzazione di ciascun iscritto.

---

## 4. Caricamento e Riservatezza dei Materiali

1. Vai su **Archivio Materiali** (`/gestione/materiali`).
2. Clicca su **Carica Materiale**.
3. Seleziona il file da caricare:
   - Formati supportati: PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX, ZIP, PNG, JPG, WEBP.
   - Limite dimensione predefinito: 25 MB.
   - Il server verifica sia l'estensione che i *magic bytes* effettivi del file.
4. Scegli la **Visibilità**:
   - **Tutti gli iscritti:** accessibile a qualsiasi membro registrato della community.
   - **Solo iscritti attività:** il file è protetto e scaricabile *esclusivamente* dagli utenti che risultano regolarmente iscritti a quella specifica attività. Eventuali utenti non iscritti riceveranno un errore 403 Forbidden anche digitando direttamente il link.
5. (Facoltativo) **Data disponibilità:** puoi programmare la data a partire dalla quale il file sarà reso scaricabile.

---

## 5. Bacheca e Aggiornamenti

1. Vai su **Bacheca & Novità** (`/gestione/bacheca`).
2. Clicca su **Nuovo Aggiornamento**.
3. Puoi formattare il testo con markdown (`**grassetto**`, `*corsivo*`, `[link](https://...)`). Il testo viene sanificato contro codice dannoso prima del rendering.
4. Spunta **In Evidenza** per fissare l'annuncio in cima alla bacheca.

---

## 6. Comunicazioni ed Email Transazionali

1. Vai su **Comunicazioni & Email** (`/gestione/comunicazioni`).
2. Scegli il **Target Destinatari**:
   - *Tutti gli iscritti:* per annunci generali.
   - *Iscritti Attività:* seleziona l'attività per inviare istruzioni logistiche solo ai partecipanti.
3. Il contatore calcola in tempo reale il numero esatto di destinatari.
4. Spunta **Invia anche notifica via email** se desideri recapitare una notifica transazionale oltre al messaggio nella casella interna dell'app. Il sistema rispetta i consensi privacy impostati dai singoli utenti.
5. Nello **Storico Invii**, puoi verificare per ogni messaggio:
   - Numero destinatari in-app e quanti hanno aperto il messaggio.
   - Stato email: *Accettata dal provider*, *In coda*, *Fallita* o *Consegna confermata*.
