'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle, AlertCircle, Loader2, Zap } from 'lucide-react';

interface RegistrationButtonProps {
  activityId: string;
  isRegistered: boolean;
  isFull: boolean;
  isPublished: boolean;
}

export function RegistrationButton({
  activityId,
  isRegistered,
  isFull,
  isPublished,
}: RegistrationButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleRegister = async () => {
    setLoading(true);
    setFeedback(null);
    try {
      const res = await fetch(`/api/activities/${activityId}/register`, { method: 'POST' });
      const data = await res.json();
      if (!res.ok) {
        setFeedback({ type: 'error', message: data.error || 'Impossibile completare l’iscrizione.' });
      } else {
        setFeedback({ type: 'success', message: 'Iscrizione confermata con successo! Ci vediamo al meetup!' });
        router.refresh();
      }
    } catch {
      setFeedback({ type: 'error', message: 'Errore di connessione.' });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    if (!confirm('Sei sicuro di voler annullare la tua partecipazione?')) {
      return;
    }

    setLoading(true);
    setFeedback(null);
    try {
      const res = await fetch(`/api/activities/${activityId}/cancel`, { method: 'POST' });
      const data = await res.json();
      if (!res.ok) {
        setFeedback({ type: 'error', message: data.error || 'Errore durante l’annullamento.' });
      } else {
        setFeedback({ type: 'success', message: 'La tua iscrizione è stata annullata.' });
        router.refresh();
      }
    } catch {
      setFeedback({ type: 'error', message: 'Errore di connessione.' });
    } finally {
      setLoading(false);
    }
  };

  if (!isPublished) {
    return (
      <div className="p-3 bg-amber-500/10 text-amber-300 text-xs rounded-xl border border-amber-500/30 font-semibold">
        Questa attività è in stato di bozza o archiviata. Le iscrizioni non sono aperte.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {feedback && (
        <div
          className={`p-3.5 rounded-xl text-xs flex items-center gap-2 ${
            feedback.type === 'success'
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
              : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
          }`}
        >
          {feedback.type === 'success' ? (
            <CheckCircle className="w-4 h-4 shrink-0 text-emerald-400" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
          )}
          <span>{feedback.message}</span>
        </div>
      )}

      {isRegistered ? (
        <div className="space-y-2">
          <div className="p-3.5 bg-emerald-500/15 border border-emerald-500/30 rounded-xl text-xs text-emerald-300 font-bold flex items-center justify-between">
            <span className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              Sei regolarmente iscritto! Ti aspettiamo!
            </span>
          </div>
          <button
            type="button"
            onClick={handleCancel}
            disabled={loading}
            className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-rose-400 hover:text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 transition flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
            Annulla partecipazione
          </button>
        </div>
      ) : isFull ? (
        <button
          type="button"
          disabled
          className="w-full py-3.5 px-4 rounded-xl text-sm font-bold bg-white/5 text-slate-500 border border-white/5 cursor-not-allowed text-center"
        >
          Capienza massima raggiunta (Posti esauriti)
        </button>
      ) : (
        <button
          type="button"
          onClick={handleRegister}
          disabled={loading}
          className="w-full py-4 px-6 rounded-2xl text-sm font-black bg-gradient-to-r from-hero-fuchsia via-pink-600 to-hero-fuchsia hover:shadow-fuchsia-lg text-white shadow-fuchsia hover:scale-[1.02] transition duration-300 flex items-center justify-center gap-2"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Zap className="w-4 h-4 text-hero-lightning fill-hero-lightning" />
          )}
          <span>CONFERMA IL TUO POSTO ORA ⚡</span>
        </button>
      )}
    </div>
  );
}
