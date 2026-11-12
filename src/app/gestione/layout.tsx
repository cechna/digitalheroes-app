import React from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/services/auth';
import {
  LayoutDashboard,
  Users,
  Calendar,
  FileDown,
  Bell,
  MessageSquare,
  History,
  Settings,
  ShieldCheck,
  Zap,
} from 'lucide-react';

export default async function GestioneLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user || (user.role !== 'admin' && user.role !== 'organizer')) {
    redirect('/');
  }

  const isAdmin = user.role === 'admin';

  const menuItems = [
    { href: '/gestione', label: 'Panoramica', icon: LayoutDashboard },
    ...(isAdmin ? [{ href: '/gestione/utenti', label: 'Utenti & Ruoli', icon: Users }] : []),
    { href: '/gestione/attivita', label: 'Meetup & Corsi', icon: Calendar },
    { href: '/gestione/materiali', label: 'Archivio Materiali', icon: FileDown },
    { href: '/gestione/bacheca', label: 'Bacheca & News', icon: Bell },
    { href: '/gestione/comunicazioni', label: 'Comunicazioni & Email', icon: MessageSquare },
    ...(isAdmin ? [{ href: '/gestione/registro', label: 'Registro Audit', icon: History }] : []),
    { href: '/gestione/impostazioni', label: 'Impostazioni', icon: Settings },
  ];

  return (
    <div className="space-y-8">
      {/* Top Banner di Gestione con Fulmine e Fucsia Elettrico */}
      <div className="relative overflow-hidden rounded-3xl p-6 sm:p-8 border border-hero-fuchsia/40 bg-gradient-to-r from-purple-950 via-[#1A0933] to-hero-navy shadow-fuchsia">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-6 h-6 rounded-lg bg-hero-fuchsia flex items-center justify-center text-white shadow-fuchsia">
                <Zap className="w-4 h-4 text-hero-lightning fill-hero-lightning" />
              </span>
              <span className="text-xs font-black uppercase tracking-widest text-hero-fuchsia-light">
                Pannello Operativo Organizzatori & Admin
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Gestione <span className="text-hero-fuchsia">Digital ⚡ Heroes</span>
            </h1>
            <p className="text-xs text-slate-300 mt-1">
              Connesso come: <strong className="text-white">{user.first_name} {user.last_name}</strong> (
              <span className="text-hero-lightning font-bold uppercase">{user.role === 'admin' ? 'Amministratore' : 'Organizzatore'}</span>)
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="px-4 py-2 bg-white/10 hover:bg-white/15 border border-white/15 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5"
            >
              <span>← Vista Iscritti</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Navigazione Sezioni Gestione */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 text-xs font-bold">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl glass-panel text-slate-300 hover:text-white hover:border-hero-fuchsia/40 hover:bg-white/10 whitespace-nowrap transition"
            >
              <Icon className="w-4 h-4 text-hero-fuchsia" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>

      {/* Contenuto della sezione */}
      <div>{children}</div>
    </div>
  );
}
