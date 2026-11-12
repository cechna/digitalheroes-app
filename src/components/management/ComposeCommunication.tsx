'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Send,
  Users,
  Mail,
  Loader2,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
  Zap,
} from 'lucide-react';
import { Activity } from '@/types/database';

interface ComposeCommunicationProps {
  activities: Activity[];
}

export function ComposeCommunication({ activities }: ComposeCommunicationProps) {
  const router = useRouter();
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [targetType, setTargetType] = useState<'all_members' | 'activity_attendees' | 'selected_users'>(
    'all_members'
  );
  const [targetActivityId, setTargetActivityId] = useState('');
  const [sendEmail, setSendEmail] = useState(true);

  const [previewCount, setPreviewCount] = useState<number | null>(null);
  const [calculatingPreview, setCalculatingPreview] = useState(false);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(
    null
  );

  useEffect(() => {
    let ignore = false;
    const fetchPreview = async () => {
      setCalculatingPreview(true);
      try {
        const res = await fetch('/api/communications/preview', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            targetType,
            targetActivityId: targetActivityId || null,
          }),
        });
        const data = await res.json();
        if (!ignore && res.ok) {
          setPreviewCount(data.count);
        }
      } catch (e) {
        console.error(e);
      } finally {
        if (!ignore) setCalculatingPreview(false);
      }
    };

    fetchPreview();
    return () => {
      ignore = true;
    };
  }, [targetType, targetActivityId]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject || !body) {
      setFeedback({ type: 'error', message: 'Oggetto e testo del messaggio sono obbligatori.' });
      return;
    }

    setLoading(true);
    setFeedback(null);

    try {
      const res = await fetch('/api/communications/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject,
          body,
          targetType,
          targetActivityId: targetActivityId || null,
          sendEmail,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Errore durante l’invio.');
      }

      setFeedback({
        type: 'success',
        message: data.message || `Comunicazione inviata con successo a ${data.recipientsCount} destinatari!`,
      });

      setSubject('');
      setBody('');
      router.refresh();
    } catch (err: unknown) {
      setFeedback({
        type: 'error',
        message: err instanceof Error ? err.message : 'Errore invio comunicazione',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-panel rounded-3xl border border-white/10 p-6 sm:p-10 shadow-2xl space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/10">
        <div>
          <h2 className="text-base font-black text-white flex items-center gap-2">
            <Zap className="w-5 h-5 text-hero-lightning fill-hero-lightning" />
            Componi Comunicazione per gli Heroes
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Invia un messaggio nella casella interna dell&apos;app e una notifica email transazionale.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-hero-fuchsia/15 text-hero-fuchsia-light text-xs font-black border border-hero-fuchsia/30 shadow-fuchsia self-start sm:self-auto">
          <Users className="w-4 h-4 text-hero-fuchsia" />
          <span>
            {calculatingPreview ? (
              <span className="flex items-center gap-1">
                <Loader2 className="w-3 h-3 animate-spin" /> Calcolo...
              </span>
            ) : (
              <span>Destinatari: {previewCount ?? 0}</span>
            )}
          </span>
        </div>
      </div>

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

      <form onSubmit={handleSend} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Target Destinatari *</label>
            <select
              value={targetType}
              onChange={(e) => {
                const val = e.target.value as 'all_members' | 'activity_attendees' | 'selected_users';
                setTargetType(val);
              }}
              className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-hero-card border border-white/10 text-white"
            >
              <option value="all_members">Tutti gli iscritti alla piattaforma</option>
              <option value="activity_attendees">Solo partecipanti di uno specifico meetup</option>
            </select>
          </div>

          {targetType === 'activity_attendees' && (
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Seleziona Attività *</label>
              <select
                required
                value={targetActivityId}
                onChange={(e) => setTargetActivityId(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-hero-card border border-white/10 text-white"
              >
                <option value="">Seleziona un&apos;attività...</option>
                {activities.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.title} ({a.current_participants_count} iscritti)
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-300 mb-1">Oggetto del Messaggio *</label>
          <input
            type="text"
            required
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="es. ⚡ Dettagli per il Meetup di venerdì al Green Hub"
            className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-white/5 border border-white/10 text-white font-bold focus:outline-none focus:border-hero-fuchsia"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-300 mb-1">Testo del Messaggio *</label>
          <textarea
            required
            rows={5}
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Gentile Heroes, vi confermiamo che..."
            className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-hero-fuchsia font-sans"
          />
        </div>

        <div className="pt-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={sendEmail}
              onChange={(e) => setSendEmail(e.target.checked)}
              className="rounded text-hero-fuchsia focus:ring-hero-fuchsia h-4 w-4 bg-white/5 border-white/15"
            />
            <span className="text-xs text-slate-300 font-semibold flex items-center gap-1.5">
              <Mail className="w-4 h-4 text-hero-lightning" />
              Invia anche notifica via email (rispetta le preferenze di consenso privacy impostate da ciascun utente)
            </span>
          </label>
        </div>

        <div className="pt-3 border-t border-white/10 flex items-center justify-between">
          <div className="text-[11px] text-slate-400">
            Il messaggio sarà consultabile nella casella interna dei destinatari.
          </div>
          <button
            type="submit"
            disabled={loading || calculatingPreview}
            className="px-8 py-3 text-xs font-black text-white bg-gradient-to-r from-hero-fuchsia via-pink-600 to-hero-fuchsia hover:shadow-fuchsia-lg rounded-xl shadow-fuchsia transition duration-200 flex items-center gap-2"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            Invia Ora ⚡
          </button>
        </div>
      </form>
    </div>
  );
}
