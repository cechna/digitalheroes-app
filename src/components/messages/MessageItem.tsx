'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { formatItalianDate, formatItalianTime } from '@/lib/utils/date';
import { Mail, MailOpen, ChevronDown, ChevronUp } from 'lucide-react';

interface MessageItemProps {
  recipientId: string;
  communicationId: string;
  subject: string;
  body: string;
  isRead: boolean;
  sentAt: string;
}

export function MessageItem({
  communicationId,
  subject,
  body,
  isRead: initialIsRead,
  sentAt,
}: MessageItemProps) {
  const router = useRouter();
  const [isRead, setIsRead] = useState(initialIsRead);
  const [isExpanded, setIsExpanded] = useState(false);
  const [loading, setLoading] = useState(false);

  const toggleOpen = async () => {
    setIsExpanded(!isExpanded);
    if (!isRead) {
      setIsRead(true);
      try {
        await fetch(`/api/messages/${communicationId}/read`, { method: 'POST' });
        router.refresh();
      } catch (e) {
        console.error(e);
      }
    }
  };

  const handleMarkAsReadManual = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setLoading(true);
    try {
      await fetch(`/api/messages/${communicationId}/read`, { method: 'POST' });
      setIsRead(true);
      router.refresh();
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      onClick={toggleOpen}
      className={`rounded-2xl border transition duration-200 cursor-pointer p-5 ${
        isRead
          ? 'glass-panel hover:border-white/20'
          : 'glass-panel-fuchsia hover:border-hero-fuchsia/50 shadow-fuchsia'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3.5 min-w-0">
          <div
            className={`p-2.5 rounded-xl shrink-0 mt-0.5 ${
              isRead ? 'bg-white/5 text-slate-400' : 'bg-hero-fuchsia text-white shadow-fuchsia'
            }`}
          >
            {isRead ? <MailOpen className="w-4 h-4" /> : <Mail className="w-4 h-4" />}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-1">
              {!isRead && (
                <span className="w-2.5 h-2.5 rounded-full bg-hero-fuchsia shadow-fuchsia shrink-0 animate-ping" />
              )}
              <h3
                className={`text-sm truncate ${
                  isRead ? 'font-semibold text-slate-200' : 'font-black text-white text-base'
                }`}
              >
                {subject}
              </h3>
            </div>
            <div className="text-[11px] text-slate-400">
              {formatItalianDate(sentAt)}, {formatItalianTime(sentAt)}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {!isRead && (
            <button
              type="button"
              onClick={handleMarkAsReadManual}
              disabled={loading}
              className="text-[11px] font-bold text-hero-fuchsia-light hover:text-white px-2.5 py-1 rounded-lg bg-hero-fuchsia/20 hover:bg-hero-fuchsia/30 border border-hero-fuchsia/30 transition"
              title="Segna come già letto"
            >
              Segna letto
            </button>
          )}
          {isExpanded ? (
            <ChevronUp className="w-4 h-4 text-slate-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-slate-400" />
          )}
        </div>
      </div>

      {isExpanded && (
        <div className="mt-4 pt-4 border-t border-white/10 text-xs text-slate-300 leading-relaxed whitespace-pre-line pl-12 font-medium">
          {body}
        </div>
      )}
    </div>
  );
}
