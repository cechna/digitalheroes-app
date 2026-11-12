import React from 'react';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/services/auth';
import { ProfileForm } from '@/components/profile/ProfileForm';
import { Zap } from 'lucide-react';

export default async function ProfiloPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/login');
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="pb-6 border-b border-white/10">
        <div className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-hero-lightning mb-1">
          <Zap className="w-3.5 h-3.5 fill-hero-lightning" />
          Area Personale
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          Profilo & <span className="text-hero-fuchsia">Preferenze</span>
        </h1>
        <p className="text-sm text-slate-300 mt-1">
          Gestisci le tue informazioni personali, le preferenze per le notifiche e i consensi privacy.
        </p>
      </div>

      <ProfileForm user={user} />
    </div>
  );
}
