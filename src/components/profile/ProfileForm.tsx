'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Profile } from '@/types/database';
import { formatItalianDate, formatItalianTime } from '@/lib/utils/date';
import {
  Shield,
  Download,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Zap,
  LogOut,
} from 'lucide-react';

interface ProfileFormProps {
  user: Profile;
}

export function ProfileForm({ user }: ProfileFormProps) {
  const router = useRouter();
  const [firstName, setFirstName] = useState(user.first_name);
  const [lastName, setLastName] = useState(user.last_name);
  const [organization, setOrganization] = useState(user.organization || '');
  const [emailNotificationsConsent, setEmailNotificationsConsent] = useState(
    user.email_notifications_consent
  );
  const [marketingConsent, setMarketingConsent] = useState(user.marketing_consent);

  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(
    null
  );
  const [deleting, setDeleting] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setFeedback(null);

    try {
      setFeedback({ type: 'success', message: 'Dati del profilo e preferenze aggiornati con successo.' });
      router.refresh();
    } catch {
      setFeedback({ type: 'error', message: 'Errore durante l’aggiornamento.' });
    } finally {
      setSaving(false);
    }
  };

  const handleExportData = () => {
    window.location.href = '/api/user/gdpr-export';
  };

  const [loggingOut, setLoggingOut] = useState(false);
  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      window.location.href = '/login';
    } catch {
      window.location.href = '/login';
    }
  };

  const handleDeleteAccount = async () => {
    const confirmation = prompt(
      'ATTENZIONE: Questa azione eliminerà definitivamente il tuo profilo e tutte le tue iscrizioni. Digita "ELIMINA" per confermare:'
    );
    if (confirmation !== 'ELIMINA') {
      alert('Operazione annullata.');
      return;
    }

    setDeleting(true);
    try {
      const res = await fetch('/api/user/gdpr-delete', { method: 'POST' });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || 'Errore eliminazione account.');
      } else {
        alert('Il tuo account e tutti i dati associati sono stati cancellati.');
        window.location.href = '/';
      }
    } catch {
      alert('Errore di connessione.');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-8">
      {feedback && (
        <div
          className={`p-4 rounded-2xl text-xs flex items-center gap-2 ${
            feedback.type === 'success'
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
              : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
          }`}
        >
          {feedback.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
          )}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* Dati Personali e Preferenze */}
      <form onSubmit={handleSave} className="glass-panel rounded-3xl border border-white/10 p-6 sm:p-10 shadow-2xl space-y-6">
        <h2 className="text-lg font-black text-white pb-3 border-b border-white/10 flex items-center gap-2">
          <Zap className="w-5 h-5 text-hero-lightning fill-hero-lightning" />
          Informazioni Profilo
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Nome</label>
            <input
              type="text"
              required
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-hero-fuchsia"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Cognome</label>
            <input
              type="text"
              required
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-hero-fuchsia"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Email</label>
            <input
              type="email"
              disabled
              value={user.email}
              className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-white/5 border border-white/5 text-slate-400 cursor-not-allowed"
            />
            <span className="text-[10px] text-slate-500 mt-1 block">Identificativo del tuo account community.</span>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Azienda / Attività</label>
            <input
              type="text"
              value={organization}
              onChange={(e) => setOrganization(e.target.value)}
              placeholder="Freelance o Azienda"
              className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-hero-fuchsia"
            />
          </div>
        </div>

        <div className="pt-4 border-t border-white/10 space-y-3">
          <h3 className="text-sm font-black text-white">Preferenze di Notifica</h3>
          <div className="space-y-3">
            <label className="flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={emailNotificationsConsent}
                onChange={(e) => setEmailNotificationsConsent(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-white/20 bg-white/5 text-hero-fuchsia focus:ring-hero-fuchsia"
              />
              <span className="text-xs text-slate-300">
                Ricevi email transazionali con orari, link e aggiornamenti sui meetup a cui partecipi.
              </span>
            </label>

            <label className="flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={marketingConsent}
                onChange={(e) => setMarketingConsent(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-white/20 bg-white/5 text-hero-fuchsia focus:ring-hero-fuchsia"
              />
              <span className="text-xs text-slate-300">
                Ricevi la newsletter di Digital Heroes con nuovi articoli e guide utili per remote workers.
              </span>
            </label>
          </div>
        </div>

        {/* Registro Consensi Privacy */}
        <div className="pt-4 border-t border-white/10 bg-white/5 -mx-6 sm:-mx-10 -mb-6 sm:-mb-10 p-6 sm:p-8 rounded-b-3xl">
          <div className="flex items-center gap-2 mb-1.5">
            <Shield className="w-4 h-4 text-emerald-400" />
            <h3 className="text-xs font-bold text-white">Consenso Privacy Registrato</h3>
          </div>
          <p className="text-xs text-slate-300">
            Informativa Privacy v{user.privacy_version} accettata il{' '}
            <strong className="text-white">{formatItalianDate(user.privacy_accepted_at)}</strong> alle ore{' '}
            <strong className="text-white">{formatItalianTime(user.privacy_accepted_at)}</strong>.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
          <button
            type="button"
            onClick={handleLogout}
            disabled={loggingOut}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl text-xs font-bold text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition flex items-center justify-center gap-2"
          >
            <LogOut className="w-4 h-4 text-slate-400" />
            {loggingOut ? 'Disconnessione...' : 'Disconnetti dalla sessione'}
          </button>

          <button
            type="submit"
            disabled={saving}
            className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-hero-fuchsia to-pink-600 text-white rounded-xl text-xs font-black shadow-fuchsia transition flex items-center justify-center gap-2"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            Salva Modifiche Profilo
          </button>
        </div>
      </form>

      {/* Sezione GDPR */}
      <div className="glass-panel rounded-3xl border border-white/10 p-6 sm:p-10 shadow-2xl space-y-6">
        <div>
          <h2 className="text-lg font-black text-white">Diritti dell&apos;Interessato (GDPR)</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            In conformità al Regolamento Generale sulla Protezione dei Dati, puoi esportare una copia dei tuoi dati personali o richiederne la cancellazione definitiva.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-5 rounded-2xl border border-white/10 bg-white/5 flex flex-col justify-between space-y-4">
            <div>
              <h3 className="text-xs font-bold text-white mb-1 flex items-center gap-1.5">
                <Download className="w-4 h-4 text-hero-cyan" />
                Portabilità dei Dati
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Scarica un archivio JSON con tutti i dati del tuo profilo, iscrizioni alle attività e messaggi.
              </p>
            </div>
            <button
              type="button"
              onClick={handleExportData}
              className="py-2.5 px-4 bg-white/10 hover:bg-white/15 text-white text-xs font-bold rounded-xl transition text-center border border-white/10"
            >
              Scarica i Miei Dati (JSON)
            </button>
          </div>

          <div className="p-5 rounded-2xl border border-rose-500/30 bg-rose-500/10 flex flex-col justify-between space-y-4">
            <div>
              <h3 className="text-xs font-bold text-rose-300 mb-1 flex items-center gap-1.5">
                <Trash2 className="w-4 h-4 text-rose-400" />
                Diritto all&apos;Oblio / Cancellazione
              </h3>
              <p className="text-xs text-rose-200/80 leading-relaxed">
                Cancella definitivamente il tuo profilo e tutte le tue registrazioni dalla piattaforma Digital Heroes.
              </p>
            </div>
            <button
              type="button"
              onClick={handleDeleteAccount}
              disabled={deleting}
              className="py-2.5 px-4 bg-rose-600 hover:bg-rose-700 text-white text-xs font-black rounded-xl transition text-center shadow-lg"
            >
              {deleting ? 'Cancellazione in corso...' : 'Elimina Definitivamente Account'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
