# Guida di Pubblicazione, Sicurezza e Backup - Digital Heroes

Questa guida documenta l'architettura di produzione, la configurazione di Supabase, la gestione dei segreti, le politiche di backup e ripristino, e i diritti privacy GDPR.

---

## 1. Architettura di Sistema

- **Frontend & Server Actions:** Next.js 15 (App Router), TypeScript, Tailwind CSS. PWA con Service Worker configurato per il caching sicuro (non memorizza cache privata offline).
- **Database & Storage:** Supabase PostgreSQL con Row Level Security (RLS) abilitato su tutte le 10 tabelle.
- **Storage Privato:** Bucket `materials` privato con convalida magic bytes e streaming autorizzato tramite `/api/materials/[id]/download`.
- **Email:** Adapter transazionale con supporto per `mock` (sviluppo/test) e `resend`/`smtp` (produzione).

---

## 2. Configurazione Supabase

1. Crea un nuovo progetto su [Supabase](https://supabase.com).
2. Nel pannello **SQL Editor**, esegui in ordine le migrazioni:
   - `supabase/migrations/20261104000000_init_digitalheroes.sql`
   - `supabase/migrations/20261104000001_storage_setup.sql`
3. Recupera da *Project Settings -> API*:
   - `Project URL`
   - `anon public key`
   - `service_role secret key` (da conservare solo lato server e mai esporre al client).

---

## 3. Creazione del Primo Amministratore

Per garantire che nessun utente possa auto-assegnarsi ruoli privilegiati:
1. Registra l'utente normalmente tramite la pagina `/register` o l'autenticazione Supabase.
2. Esegui la funzione protetta da SQL Editor di Supabase:
   ```sql
   SELECT public.setup_first_admin('admin@digitalheroes.it');
   ```
   *Nota: la funzione rifiuta l'esecuzione se un amministratore è già presente.*
3. In alternativa tramite script Node con `SUPABASE_SERVICE_ROLE_KEY`:
   ```bash
   npx tsx scripts/create-admin.ts admin@digitalheroes.it
   ```

---

## 4. Servizio Email Transazionale

Configura le variabili d'ambiente in produzione:
```bash
EMAIL_PROVIDER=resend
RESEND_API_KEY=re_tua_api_key_segreta
EMAIL_FROM=Digital Heroes <notifiche@digitalheroes.it>
```

Stati gestiti dal motore di invio:
- **created:** messaggio preparato.
- **pending:** accodato per la spedizione.
- **accepted:** accettato con successo dal gateway SMTP/API (in transito).
- **failed:** tentativo fallito con registrazione dell'errore (senza esporre dati sensibili).
- **delivered:** consegna confermata all'inbox del destinatario (solo in presenza di webhook di avvenuto recapito).

---

## 5. Procedure di Backup e Ripristino

### A. Backup del Database PostgreSQL
Esegui periodicamente tramite crontab o automazione di hosting:
```bash
# Dump compresso completo di schema e dati
pg_dump -h db.[PROJECT_REF].supabase.co -U postgres -d postgres -F c -b -v -f /backups/digitalheroes_$(date +%Y%m%d_%H%M).dump
```

### B. Ripristino di Emergenza (Disaster Recovery)
```bash
pg_restore -h db.[PROJECT_REF].supabase.co -U postgres -d postgres --clean --if-exists -v /backups/digitalheroes_YYYYMMDD_HHMM.dump
```

### C. Backup dei File di Storage
I file del bucket privato `materials` possono essere sincronizzati con un bucket S3 secondario o archiviati tramite lo strumento `supabase storage`:
```bash
supabase storage download materials ./backup-materials --project-ref [PROJECT_REF]
```

---

## 6. Procedura GDPR: Esportazione e Cancellazione Utente

- **Esportazione (Art. 20 GDPR):**
  L'utente può scaricare un dump JSON completo cliccando su *Scarica i Miei Dati* in `/profilo` (endpoint `/api/user/gdpr-export`).
- **Cancellazione (Art. 17 GDPR - Diritto all'oblio):**
  L'utente può eliminare definitivamente il proprio profilo e tutte le relative iscrizioni cliccando su *Elimina Definitivamente Account* in `/profilo` (endpoint `/api/user/gdpr-delete`).
