import React from 'react';
import { getCurrentUser } from '@/lib/services/auth';
import { Settings, Shield, Mail, Database, HardDrive, Key, Zap, CheckCircle2 } from 'lucide-react';

export default async function GestioneImpostazioniPage() {
  const user = await getCurrentUser();

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-white flex items-center gap-2">
          <Settings className="w-6 h-6 text-hero-fuchsia" />
          Impostazioni e Documentazione Operativa
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Parametri di configurazione dell&apos;infrastruttura, credenziali Supabase, invio email e procedure di sicurezza.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* Procedura di Creazione Primo Amministratore */}
        <div className="glass-panel rounded-2xl p-6 border border-white/10 space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-hero-lightning border border-hero-lightning/20">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                Procedura Sicura di Creazione Primo Amministratore
                <Zap className="w-4 h-4 text-hero-lightning" />
              </h2>
              <p className="text-xs text-slate-400">
                Come previsto dai requisiti, gli utenti non possono auto-assegnarsi ruoli privilegiati.
              </p>
            </div>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            Per configurare il primo account amministratore in produzione:
          </p>

          <div className="bg-hero-navy/90 border border-white/10 text-slate-200 p-4 rounded-xl text-xs font-mono overflow-x-auto space-y-2">
            <p className="text-slate-400"># Opzione A: Esegui la funzione sicura SQL nell&apos;SQL Editor di Supabase</p>
            <p className="text-hero-fuchsia font-semibold">SELECT public.setup_first_admin(&apos;admin@digitalheroes.it&apos;);</p>
            <p className="text-slate-400 mt-2"># Opzione B: Esegui lo script Node dedicato con Service Role Key</p>
            <p className="text-hero-cyan font-semibold">npm run create-admin -- --email admin@digitalheroes.it</p>
          </div>

          <p className="text-[11px] text-slate-400">
            La procedura verifica che non esista già un amministratore nel sistema per prevenire privilege escalation non autorizzate.
          </p>
        </div>

        {/* Configurazione Servizio Email */}
        <div className="glass-panel rounded-2xl p-6 border border-white/10 space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-hero-fuchsia/10 text-hero-fuchsia border border-hero-fuchsia/20">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">
                Configurazione Email Transazionali
              </h2>
              <p className="text-xs text-slate-400">
                Configurabile tramite variabili d&apos;ambiente (Resend, SMTP o Mock locale).
              </p>
            </div>
          </div>

          <div className="bg-hero-navy/90 border border-white/10 text-slate-200 p-4 rounded-xl text-xs font-mono overflow-x-auto space-y-1">
            <p className="text-slate-400"># Nel file .env.local per abilitare l&apos;invio con Resend in produzione:</p>
            <p><span className="text-hero-lightning">EMAIL_PROVIDER</span>=resend</p>
            <p><span className="text-hero-lightning">RESEND_API_KEY</span>=re_123456789abcdef</p>
            <p><span className="text-hero-lightning">EMAIL_FROM</span>=Digital Heroes &lt;notifiche@digitalheroes.it&gt;</p>
            <p className="text-slate-400 mt-2"># In ambiente di test / sviluppo locale:</p>
            <p><span className="text-hero-cyan">EMAIL_PROVIDER</span>=mock</p>
          </div>
        </div>

        {/* Procedure di Backup e Ripristino */}
        <div className="glass-panel rounded-2xl p-6 border border-white/10 space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">
                Backup e Ripristino Database
              </h2>
              <p className="text-xs text-slate-400">
                Istruzioni per il dump e il restore del database PostgreSQL Supabase.
              </p>
            </div>
          </div>

          <div className="bg-hero-navy/90 border border-white/10 text-slate-200 p-4 rounded-xl text-xs font-mono overflow-x-auto space-y-2">
            <p className="text-slate-400"># Backup dump completo con supabase CLI o pg_dump</p>
            <p className="text-emerald-400">pg_dump -h db.ref.supabase.co -U postgres -d postgres -F c -b -v -f digitalheroes_backup_$(date +%Y%m%d).dump</p>
            <p className="text-slate-400 mt-2"># Ripristino di emergenza</p>
            <p className="text-emerald-400">pg_restore -h db.ref.supabase.co -U postgres -d postgres -v digitalheroes_backup_20261104.dump</p>
          </div>
        </div>
      </div>
    </div>
  );
}
