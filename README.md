# Digital Heroes Platform

Piattaforma web completa, responsive e installabile come **PWA** per la gestione della community **Digital Heroes**, corsi, meetup, comunicazioni interne e archivio materiali riservati da scaricare.

Interfaccia 100% in italiano, fuso orario predefinito **Europe/Rome** con gestione automatica di ora solare/legale, controllo accessi server-side e database Row Level Security (RLS).

---

## 🚀 Funzionalità Principali

### A. Iscritti e Community
- **Accesso e Profilo:** registrazione con email, preferenze comunicazioni e accettazione informativa privacy v1.0.
- **Home Personale:** bacheca, prossimi eventi, iscrizioni attive, nuovi materiali e messaggi non letti.
- **Attività & Iscrizioni:** catalogo eventi, meetup e corsi con capienza massima gestita atomicamente (prevenzione race-condition).
- **Materiali da Scaricare:** documenti PDF, fogli di calcolo, presentazioni e archivi ZIP con link temporanei riservati e verifica autorizzativa.
- **Casella Messaggi:** ricezione comunicazioni mirate e tracciamento lettura.
- **Privacy & GDPR:** esportazione completa dati personali (JSON) e diritto all'oblio direttamente dall'area profilo.

### B. Gestione (Amministratori e Organizzatori)
- **Pannello Riservato:** accesso protetto a livello di route e API per Amministratori e Organizzatori.
- **Gestione Utenti & Ruoli:** assegnazione ruoli protetta contro privilege escalation non autorizzate.
- **Gestione Attività:** creazione, modifica orari e visualizzazione della lista partecipanti registrati.
- **Upload File Riservati:** verifica magic bytes ed estensione, associazione a eventi o accesso per tutti gli iscritti.
- **Bacheca & Aggiornamenti:** pubblicazione comunicati formattati in sicurezza contro attacchi XSS.
- **Invio Comunicazioni:** selezione destinatari (tutti, per attività o singoli), anteprima contatore in tempo reale e invio email transazionale con stati accurati (`created`, `pending`, `accepted`, `failed`, `delivered`).
- **Registro Audit:** audit log di tutte le operazioni amministrative.

---

## 🛠️ Stack Tecnologico

- **Framework:** Next.js 15 (App Router), TypeScript, React 19.
- **Stile:** Tailwind CSS, Lucide React.
- **Database & Auth:** Supabase PostgreSQL con Row Level Security (RLS).
- **Storage:** Supabase Storage (bucket privato `materials`).
- **Email:** Gateway transazionale configurabile (Mock per test/sviluppo, Resend o SMTP per produzione).
- **Test:** Test Runner nativo di Node 24 con TypeScript (`tsx --test`).

---

## 📦 Avvio Rapido in Locale

### 1. Prerequisiti
- Node.js versione 20 o superiore (testato e verificato su Node 24).
- npm.

### 2. Installazione delle dipendenze
```bash
npm install
```

### 3. Configurazione dell'Ambiente
Copia il file delle variabili d'ambiente:
```bash
cp .env.example .env.local
```
*Nota: In modalità locale senza credenziali Supabase configurate, l'applicazione si avvia automaticamente con il repository dati locale precaricato con dati dimostrativi completi (eventi, materiali, comunicazioni e utenti di test), garantendo una verifica immediata e senza errori.*

### 4. Esecuzione dei Test Automatizzati
Esegui la suite di test che verifica tutti i 12 percorsi operativi e di sicurezza richiesti:
```bash
npm test
```

### 5. Avvio del Server di Sviluppo
```bash
npm run dev
```
Apri il browser all'indirizzo [http://localhost:3000](http://localhost:3000).

---

## 👥 Utenti Dimostrativi Preconfigurati per il Collaudo

Nella barra di navigazione in alto è presente un pratico selettore rapido **Ruolo test** che consente di passare istantaneamente tra i diversi profili per verificare i permessi:

1. **Marco Rossi (Amministratore):** `admin@digitalheroes.it`  
   Accesso completo: gestione utenti, attività, materiali, bacheca, comunicazioni e registro audit.
2. **Sara Bianchi (Organizzatrice):** `organizzatore@digitalheroes.it`  
   Gestione delle attività assegnate, lista iscritti, caricamento materiali e invio comunicazioni.
3. **Luca Verdi (Iscritto):** `iscritto@digitalheroes.it`  
   Accesso all'area membro, iscrizione agli eventi, download materiali autorizzati e casella messaggi.

---

## 📂 Struttura del Progetto

```
digitalheroes-app/
├── docs/                                  # Guide operative e documentazione tecnica
│   ├── GUIDA_ORGANIZZATORI.md             # Manuale pratico per organizzatori
│   └── GUIDA_DEPLOY_BACKUP.md             # Istruzioni deploy, RLS e backup
├── public/                                # File statici e PWA manifest/worker
│   ├── manifest.json
│   └── sw.js
├── scripts/                               # Script operativi
│   └── create-admin.ts                    # Creazione sicura primo amministratore
├── src/
│   ├── app/                               # Pagine e API Routes Next.js App Router
│   │   ├── (auth)/                        # Login, registrazione, recupero password
│   │   ├── attivita/                      # Elenco e dettaglio attività/iscrizioni
│   │   ├── bacheca/                       # Bacheca annunci della community
│   │   ├── gestione/                      # Sezioni del pannello di gestione
│   │   ├── materiali/                     # Download file con permessi riservati
│   │   ├── messaggi/                      # Casella messaggi interna
│   │   ├── profilo/                       # Dati personali, GDPR export e cancellazione
│   │   ├── privacy/                       # Informativa privacy con placeholder titolare
│   │   └── api/                           # Endpoint REST autorizzati
│   ├── components/                        # Componenti UI riutilizzabili
│   ├── lib/
│   │   ├── data/mock-store.ts             # Store di simulazione locale persistente
│   │   ├── services/                      # Repository, auth ed email transazionale
│   │   ├── supabase/                      # Client Supabase browser, server e admin
│   │   └── utils/                         # Date (Europe/Rome), Magic Bytes, Sanitize, Zod
│   └── types/database.ts                  # Tipi TypeScript di tutte le entità
├── supabase/
│   └── migrations/                        # Script SQL per schema, indici, RLS e bucket
└── tests/
    └── digitalheroes.test.ts              # Suite di test automatizzati sui 12 requisiti
```

---

## 🔒 Sicurezza & RLS

Tutte le tabelle del database integrano le policy Row Level Security:
- I membri possono scaricare solo i materiali pubblici o riservati alle attività a cui risultano confermati.
- L'elenco degli iscritti è visibile unicamente agli organizzatori assegnati all'evento e agli amministratori.
- L'audit log è consultabile esclusivamente dagli amministratori.
- Nessun utente può elevare i propri privilegi a livello di API.
