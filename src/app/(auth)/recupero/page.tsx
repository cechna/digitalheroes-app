'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, ArrowLeft, Loader2, CheckCircle2, Zap } from 'lucide-react';

export default function RecuperoPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
    }, 600);
  };

  return (
    <div className="max-w-md mx-auto py-12">
      <div className="glass-panel rounded-3xl border border-white/10 p-8 sm:p-10 shadow-2xl space-y-6">
        <Link
          href="/login"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-hero-fuchsia-light"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Torna al login
        </Link>

        <div>
          <h1 className="text-2xl font-black text-white mb-2">Recupero Password</h1>
          <p className="text-xs text-slate-400">
            Inserisci l&apos;indirizzo email con cui ti sei registrato. Ti invieremo un link sicuro per reimpostare la tua password.
          </p>
        </div>

        {success ? (
          <div className="p-5 bg-emerald-500/15 border border-emerald-500/30 rounded-2xl text-center space-y-2">
            <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
            <h2 className="text-sm font-bold text-white">Email di recupero inviata</h2>
            <p className="text-xs text-slate-300">
              Se l&apos;indirizzo <strong>{email}</strong> è registrato nel nostro database, riceverai a breve le istruzioni.
            </p>
          </div>
        ) : (
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
                  placeholder="mario.rossi@example.it"
                  className="w-full pl-10 pr-3.5 py-2.5 text-xs rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-hero-fuchsia"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl text-xs font-black bg-gradient-to-r from-hero-fuchsia via-pink-600 to-hero-fuchsia text-white shadow-fuchsia transition duration-200 flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              Invia Istruzioni di Recupero
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
