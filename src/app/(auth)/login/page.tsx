'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, Loader2, AlertCircle, Zap } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/auth/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Credenziali non valide o utente non trovato.');
      }

      router.push('/');
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Errore durante l’accesso.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto py-12">
      <div className="glass-panel rounded-3xl border border-white/10 p-8 sm:p-10 shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-hero-fuchsia to-pink-500 text-white flex items-center justify-center mx-auto shadow-fuchsia">
            <Zap className="w-8 h-8 text-hero-lightning fill-hero-lightning" />
          </div>
          <h1 className="text-2xl font-black text-white">Accedi a Digital Heroes</h1>
          <p className="text-xs text-slate-400">
            Inserisci le tue credenziali per accedere all&apos;area riservata.
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-rose-500/20 border border-rose-500/30 text-xs text-rose-300 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Indirizzo Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nome@dominio.it"
                className="w-full pl-10 pr-3.5 py-2.5 text-xs rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-hero-fuchsia focus:ring-1 focus:ring-hero-fuchsia"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-slate-300">Password</label>
              <Link href="/recupero" className="text-[11px] font-bold text-hero-fuchsia-light hover:underline">
                Hai dimenticato la password?
              </Link>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-3.5 py-2.5 text-xs rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-hero-fuchsia focus:ring-1 focus:ring-hero-fuchsia"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 rounded-xl text-xs font-black bg-gradient-to-r from-hero-fuchsia via-pink-600 to-hero-fuchsia hover:shadow-fuchsia-lg text-white shadow-fuchsia transition duration-200 flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            Accedi all&apos;Area Riservata
          </button>
        </form>

        <div className="pt-4 border-t border-white/10 text-center text-xs text-slate-400">
          Non sei ancora iscritto?{' '}
          <Link href="/register" className="font-bold text-hero-fuchsia-light hover:underline">
            Unisciti alla Community ⚡
          </Link>
        </div>
      </div>
    </div>
  );
}
