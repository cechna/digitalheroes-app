# ⚡ Guida Completa al Deploy di Digital Heroes su Hostinger

Questa guida ti spiega esattamente come mandare online l'app **Digital Heroes** (Next.js 15) sui server di **Hostinger**.

---

## 📌 Quale piano Hostinger hai a disposizione?

Hostinger offre due tipologie di ambienti per le applicazioni:

| Ambiente Hostinger | Compatibilità Next.js 15 | Metodo Consigliato |
| :--- | :--- | :--- |
| **Hostinger VPS (KVM)** *(Consigliato)* | 100% Nativo (Node.js 20+, Docker, PM2) | **Metodo A (PM2 / Script)** oppure **Metodo B (Docker)** |
| **Hostinger Cloud / Web Hosting (hPanel)** | Supportato tramite il gestore Node.js di hPanel | **Metodo C (hPanel Node.js Standalone)** |

---

## 🚀 METODO A: Hostinger VPS con PM2 (Consigliato per massime prestazioni)

Hostinger VPS ti offre un server virtuale Linux (Ubuntu o Debian) con accesso root/SSH completo.

### Passo 1: Accedi via SSH al tuo VPS Hostinger
Dalla dashboard di Hostinger (sezione VPS), recupera l'IP del server e la password di root:
```bash
ssh root@<IP_DEL_TUO_VPS_HOSTINGER>
```

### Passo 2: Installa Node.js 20 e PM2 (se non già presenti)
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt update && sudo apt install -y nodejs git nginx
sudo npm install -g pm2
```

### Passo 3: Carica il codice dell'app
Puoi clonare direttamente il repository Git sul server:
```bash
cd ~
git clone https://github.com/<TUO-UTENTE>/digitalheroes-app.git
cd digitalheroes-app
```
*(In alternativa, puoi caricare la cartella dei file via SFTP/FileZilla usando le credenziali SSH di Hostinger).*

### Passo 4: Configura le Variabili d'Ambiente
Crea il file `.env.production` sul server:
```bash
nano .env.production
```
Incolla i valori (da `.env.production.example`):
```bash
NEXT_PUBLIC_SITE_URL=https://digital-heroes.net
NEXT_PUBLIC_SUPABASE_URL=https://<TUO-REF>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<ANON_KEY>
SUPABASE_SERVICE_ROLE_KEY=<SERVICE_KEY>
EMAIL_PROVIDER=resend
RESEND_API_KEY=re_...
EMAIL_FROM=Digital Heroes <notifiche@digital-heroes.net>
NODE_ENV=production
NEXT_PUBLIC_ENABLE_DEMO_SWITCHER=false
DISABLE_DEV_AUTO_LOGIN=true
MAX_FILE_SIZE_BYTES=26214400
TZ=Europe/Rome
```
Salva con `CTRL + O`, `INVIO` e chiudi con `CTRL + X`.

### Passo 5: Esegui lo Script di Deploy Incluso
Abbiamo preparato lo script [`deploy-hostinger.sh`](file:///c:/Users/info/Downloads/digitalheroes-app/deploy-hostinger.sh) pronto all'uso:
```bash
chmod +x deploy-hostinger.sh
./deploy-hostinger.sh
```
Questo comando:
1. Installa i pacchetti necessari.
2. Compila Next.js in modalità `standalone`.
3. Avvia il processo su PM2 in modalità cluster su porta `3000`.
4. Salva la configurazione per riavviarsi automaticamente in caso di riavvio del server.

---

## 🐳 METODO B: Hostinger VPS con Docker (1-Click)

Se hai selezionato il template **Ubuntu con Docker** nella dashboard VPS di Hostinger:

```bash
cd ~/digitalheroes-app
# Costruisci ed avvia il container
docker compose up -d --build
```
L'app sarà immediatamente attiva e isolata nel container `digitalheroes-app` su porta 3000.

---

## 🌐 METODO C: Hostinger Cloud / Web Hosting (hPanel)

Se hai un piano **Cloud Hosting** o **Business Web Hosting** con pannello hPanel:

1. Accedi a **hPanel Hostinger** -> vai sul tuo dominio.
2. Cerca la sezione **Node.js** (o **Avanzate -> Applicazioni Node.js**):
   - **Versione Node.js:** Seleziona `20.x` o superiore.
   - **Modalità applicazione:** `Production`.
   - **Directory principale applicazione (Root):** la cartella dove hai caricato l'app (es. `public_html/digitalheroes`).
   - **File di avvio:** `node_modules/next/dist/bin/next` con argomento `start -p $PORT` (oppure `.next/standalone/server.js`).
3. Clicca su **Salva** e poi su **Installa dipendenze (NPM Install)** e **Esegui Build**.
4. In **Variabili d'ambiente** di hPanel, inserisci le chiavi di `.env.production`.

---

## 🔒 Configurazione Dominio e Nginx (Reverse Proxy SSL)

Se usi **Hostinger VPS**, configura Nginx per reindirizzare il traffico da `https://digital-heroes.net` alla porta locale `3000`:

1. Crea la configurazione Nginx:
   ```bash
   sudo nano /etc/nginx/sites-available/digitalheroes
   ```
2. Incolla questo blocco:
   ```nginx
   server {
       server_name digital-heroes.net www.digital-heroes.net;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
       }
   }
   ```
3. Abilita il sito e riavvia Nginx:
   ```bash
   sudo ln -s /etc/nginx/sites-available/digitalheroes /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
   ```
4. Attiva il certificato SSL gratuito (HTTPS) con Certbot:
   ```bash
   sudo apt install -y certbot python3-certbot-nginx
   sudo certbot --nginx -d digital-heroes.net -d www.digital-heroes.net
   ```

---

## 🔄 Deploy Automatico Continuo con GitHub Actions (Opzionale)

Nel repository è già configurato il workflow [`.github/workflows/deploy-hostinger.yml`](file:///c:/Users/info/Downloads/digitalheroes-app/.github/workflows/deploy-hostinger.yml).
Se colleghi il codice a GitHub, puoi inserire nei **Secrets** del repository:
- `HOSTINGER_HOST`: IP del tuo VPS Hostinger
- `HOSTINGER_USER`: `root` (o utente deploy)
- `HOSTINGER_SSH_KEY`: la tua chiave privata SSH
Ogni volta che farai `git push origin main`, GitHub aggiornerà e riavvierà automaticamente l'app su Hostinger senza che tu debba fare nulla!
