# 🚀 Guida alla Pubblicazione in Produzione: Digital Heroes

Questa guida ti accompagna passo dopo passo nella messa online dell'applicazione Digital Heroes per la community.

---

## 📋 Checklist Prima del Rilascio

- [x] **Privacy Policy GDPR:** Redatta e consultabile alla pagina `/privacy` (nessun cookie di profilazione, solo cookie tecnici di sessione, piena conformità Artt. 13-14 GDPR).
- [x] **Termini di Utilizzo:** Bozza standard community disponibile a `/termini`.
- [x] **SEO & Motori di Ricerca:** File `robots.txt` e `sitemap.xml` generati automaticamente.
- [x] **Sicurezza Ruoli & Sessioni:** Disabilitazione del selettore demo in produzione per prevenire privilege escalation non autorizzate.
- [x] **Funzione di Logout:** Endpoint `/api/auth/logout` e pulsante nel profilo attivo.
- [x] **Esportazione & Oblio GDPR:** Download dei dati JSON e cancellazione account pienamente funzionanti.

---

## 1. Configurazione Supabase (Database & Storage)

1. Crea un progetto gratuito o pro su [supabase.com](https://supabase.com). Seleziona la regione europea (es. **Frankfurt (eu-central-1)**) per garantire la conformità GDPR.
2. Vai nella sezione **SQL Editor** ed esegui i file di migrazione inclusi nella cartella `supabase/migrations/`:
   - Copia e incolla l'intero contenuto di `20261104000000_init_digitalheroes.sql` e clicca su **Run**.
   - Copia e incolla il contenuto di `20261104000001_storage_setup.sql` e clicca su **Run** (crea il bucket privato `materials` e le relative policy di sicurezza).
3. **Crea il Primo Amministratore:**
   - Sempre nell'SQL Editor di Supabase, esegui:
     ```sql
     SELECT public.setup_first_admin('tua-email-admin@digital-heroes.net');
     ```
   - In questo modo l'amministratore principale viene creato senza che nessun altro utente possa auto-assegnarsi ruoli privilegiati.
4. Recupera le chiavi API da **Project Settings -> API**:
   - `Project URL`
   - `anon public key`
   - `service_role key` (segreta)

---

## 2. Configurazione Email Transazionali (Resend)

1. Registrati su [resend.com](https://resend.com) e genera una API Key.
2. Aggiungi e verifica il tuo dominio (es. `digital-heroes.net`) inserendo i record DNS (DKIM, SPF e MX).
3. Imposta l'indirizzo mittente:
   `EMAIL_FROM=Digital Heroes <notifiche@digital-heroes.net>`

---

## 3. Distribuzione su Vercel (Consigliato)

1. Carica il repository su GitHub o GitLab.
2. Accedi a [vercel.com](https://vercel.com) e fai **Import Project**.
3. In **Environment Variables**, incolla i valori dal file `.env.production.example`:
   ```bash
   NEXT_PUBLIC_SITE_URL=https://digital-heroes.net
   NEXT_PUBLIC_SUPABASE_URL=https://<TUO-PROJECT-REF>.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=<TUA-ANON-KEY>
   SUPABASE_SERVICE_ROLE_KEY=<TUA-SERVICE-ROLE-KEY>
   EMAIL_PROVIDER=resend
   RESEND_API_KEY=re_...
   EMAIL_FROM=Digital Heroes <notifiche@digital-heroes.net>
   NODE_ENV=production
   NEXT_PUBLIC_ENABLE_DEMO_SWITCHER=false
   ENABLE_DEMO_SWITCHER=false
   DISABLE_DEV_AUTO_LOGIN=true
   MAX_FILE_SIZE_BYTES=26214400
   TZ=Europe/Rome
   ```
4. Clicca su **Deploy**. La build Next.js installerà le dipendenze e compilerà le 33 rotte.
5. In **Project Settings -> Domains**, collega il tuo dominio personalizzato `digital-heroes.net` con i record CNAME / A indicati da Vercel.

---

## 4. Verifica Post-Rilascio

1. Apri il sito in navigazione anonima:
   - Verifica che l'utente non autenticato veda la landing pubblica con i pulsanti "Accedi" e "Unisciti".
   - Verifica che il selettore di test dei ruoli nella navbar sia nascosto.
2. Registra un nuovo utente di prova:
   - Compila nome, cognome, email e accetta l'informativa privacy.
   - Verifica che il profilo venga creato col ruolo standard di `member` (iscritto).
3. Esegui il login con l'account Amministratore creato allo step 1:
   - Verifica la comparsa del link **Pannello Gestione**.
   - Crea un meetup di test a Salerno o al The Green Hub.
   - Carica una slide protetta e verifica il download.
