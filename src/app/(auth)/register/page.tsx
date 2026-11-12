'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, User, Building, Loader2, AlertCircle, Zap } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    organization: '',
    privacyAccepted: false,
    marketingConsent: false,
    emailNotificationsConsent: true,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setFieldErrors({});

    if (formData.password !== formData.confirmPassword) {
      setError('Le due password inserite non coincidono.');
      setLoading(false);
      return;
    }

    if (!formData.privacyAccepted) {
      setError('È necessario accettare l’informativa sulla privacy per procedere.');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          firstName: formData.firstName,
          lastName: formData.lastName,
          organization: formData.organization,
          privacyAccepted: formData.privacyAccepted,
          privacyVersion: '1.0',
          marketingConsent: formData.marketingConsent,
          emailNotificationsConsent: formData.emailNotificationsConsent,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        if (data.details) {
          setFieldErrors(data.details);
        }
        throw new Error(data.error || 'Errore durante la registrazione.');
      }

      router.push('/');
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Errore registrazione');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto py-10">
      <div className="glass-panel rounded-3xl border border-white/10 p-8 sm:p-10 shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-hero-fuchsia to-pink-500 text-white flex items-center justify-center mx-auto shadow-fuchsia">
            <Zap className="w-8 h-8 text-hero-lightning fill-hero-lightning" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">Unisciti a Digital Heroes ⚡</h1>
          <p className="text-xs text-slate-400">
            Crea il tuo profilo gratuito per partecipare ai meetup e accedere all&apos;archivio materiali.
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-rose-500/20 border border-rose-500/30 text-xs text-rose-300 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Nome *</label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                <input
                  type="text"
                  required
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  placeholder="Mario"
                  className="w-full pl-10 pr-3.5 py-2.5 text-xs rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-hero-fuchsia"
                />
              </div>
              {fieldErrors.firstName && (
                <p className="text-[11px] text-rose-400 mt-1">{fieldErrors.firstName[0]}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Cognome *</label>
              <input
                type="text"
                required
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                placeholder="Rossi"
                className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-hero-fuchsia"
              />
              {fieldErrors.lastName && (
                <p className="text-[11px] text-rose-400 mt-1">{fieldErrors.lastName[0]}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Azienda / Attività</label>
            <div className="relative">
              <Building className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
              <input
                type="text"
                value={formData.organization}
                onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                placeholder="es. Freelance o Nome Azienda (facoltativo)"
                className="w-full pl-10 pr-3.5 py-2.5 text-xs rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-hero-fuchsia"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Indirizzo Email *</label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="mario.rossi@example.com"
                className="w-full pl-10 pr-3.5 py-2.5 text-xs rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-hero-fuchsia"
              />
            </div>
            {fieldErrors.email && (
              <p className="text-[11px] text-rose-400 mt-1">{fieldErrors.email[0]}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Password *</label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Min. 8 caratteri"
                  className="w-full pl-10 pr-3.5 py-2.5 text-xs rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-hero-fuchsia"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Conferma Password *</label>
              <input
                type="password"
                required
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                placeholder="Ripeti password"
                className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-hero-fuchsia"
              />
            </div>
          </div>
          {fieldErrors.password && (
            <p className="text-[11px] text-rose-400">{fieldErrors.password[0]}</p>
          )}

          {/* Consensi Privacy e Preferenze */}
          <div className="pt-3 border-t border-white/10 space-y-3">
            <label className="flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                required
                checked={formData.privacyAccepted}
                onChange={(e) => setFormData({ ...formData, privacyAccepted: e.target.checked })}
                className="mt-0.5 h-4 w-4 rounded border-white/20 bg-white/5 text-hero-fuchsia focus:ring-hero-fuchsia"
              />
              <span className="text-xs text-slate-300 leading-relaxed">
                Accetto l&apos;<Link href="/privacy" target="_blank" className="text-hero-fuchsia-light font-bold underline">Informativa sulla Privacy</Link> (v1.0) e acconsento al trattamento dei dati per partecipare alle attività. *
              </span>
            </label>

            <label className="flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.emailNotificationsConsent}
                onChange={(e) => setFormData({ ...formData, emailNotificationsConsent: e.target.checked })}
                className="mt-0.5 h-4 w-4 rounded border-white/20 bg-white/5 text-hero-fuchsia focus:ring-hero-fuchsia"
              />
              <span className="text-xs text-slate-300 leading-relaxed">
                Desidero ricevere via email gli avvisi su orari e dettagli dei meetup a cui mi iscrivo. (Consigliato)
              </span>
            </label>

            <label className="flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.marketingConsent}
                onChange={(e) => setFormData({ ...formData, marketingConsent: e.target.checked })}
                className="mt-0.5 h-4 w-4 rounded border-white/20 bg-white/5 text-hero-fuchsia focus:ring-hero-fuchsia"
              />
              <span className="text-xs text-slate-300 leading-relaxed">
                Ricevi la newsletter Heroes con zero spam e approfondimenti utili per chi lavora in remoto.
              </span>
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-4 rounded-xl text-xs font-black bg-gradient-to-r from-hero-fuchsia via-pink-600 to-hero-fuchsia hover:shadow-fuchsia-lg text-white shadow-fuchsia transition duration-200 flex items-center justify-center gap-2 mt-4"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4 text-hero-lightning fill-hero-lightning" />}
            Completa Registrazione ⚡
          </button>
        </form>

        <div className="pt-4 border-t border-white/10 text-center text-xs text-slate-400">
          Hai già un account?{' '}
          <Link href="/login" className="font-bold text-hero-fuchsia-light hover:underline">
            Accedi qui
          </Link>
        </div>
      </div>
    </div>
  );
}
