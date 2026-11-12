#!/bin/bash
# ==============================================================================
# Script di Deploy Automatico per Hostinger VPS / Linux
# ==============================================================================

set -e

echo "⚡ Avvio deploy Digital Heroes su Hostinger..."

# 1. Recupero ultimo codice da Git (se usato)
if [ -d ".git" ]; then
  echo "📥 Aggiornamento repository Git..."
  git pull origin main
fi

# 2. Installazione dipendenze di produzione
echo "📦 Installazione dipendenze..."
npm ci --omit=dev

# 3. Compilazione Next.js
echo "🏗️ Compilazione Next.js in produzione..."
npm run build

# 4. Copia delle risorse statiche nella cartella standalone (richiesto da Next.js)
echo "📂 Copia risorse statiche per output standalone..."
cp -r public .next/standalone/ || true
cp -r .next/static .next/standalone/.next/ || true

# 5. Riavvio processo con PM2
if command -v pm2 &> /dev/null; then
  echo "🔄 Riavvio servizio con PM2..."
  pm2 restart ecosystem.config.js || pm2 start ecosystem.config.js
  pm2 save
  echo "✅ Applicazione riavviata con successo su PM2!"
else
  echo "⚠️ PM2 non trovato. Puoi avviare l'app con: node .next/standalone/server.js"
fi

echo "🚀 Deploy completato con successo su Hostinger!"
