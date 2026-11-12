'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Calendar,
  FileDown,
  Bell,
  MessageSquare,
  ShieldCheck,
  Menu,
  X,
  Zap,
  ChevronDown,
} from 'lucide-react';
import { Profile } from '@/types/database';

interface NavbarProps {
  currentUser: Profile | null;
  unreadCount?: number;
}

export function Navbar({ currentUser, unreadCount = 0 }: NavbarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roleSwitcherOpen, setRoleSwitcherOpen] = useState(false);

  const isManager = currentUser?.role === 'admin' || currentUser?.role === 'organizer';
  const showRoleSwitcher = process.env.NEXT_PUBLIC_ENABLE_DEMO_SWITCHER === 'true' || process.env.NODE_ENV !== 'production';

  // Demo users per collaudo rapido
  const testUsers = [
    { id: '00000000-0000-0000-0000-000000000001', name: 'Marco Rossi', role: 'admin', label: 'Amministratore' },
    { id: '00000000-0000-0000-0000-000000000002', name: 'Sara Bianchi', role: 'organizer', label: 'Organizzatrice' },
    { id: '00000000-0000-0000-0000-000000000003', name: 'Luca Verdi', role: 'member', label: 'Iscritto' },
  ];

  const handleSwitchUser = async (userId: string) => {
    try {
      const res = await fetch('/api/auth/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });
      if (res.ok) {
        setRoleSwitcherOpen(false);
        router.refresh();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const navLinks = [
    { href: '/', label: 'Home', icon: Zap },
    { href: '/attivita', label: 'Meetup & Corsi', icon: Calendar },
    { href: '/materiali', label: 'Materiali', icon: FileDown },
    { href: '/bacheca', label: 'Bacheca', icon: Bell },
    {
      href: '/messaggi',
      label: 'Messaggi',
      icon: MessageSquare,
      badge: unreadCount > 0 ? unreadCount : undefined,
    },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#060B23]/80 backdrop-blur-xl border-b border-white/10 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* Logo con il fulmine iconico */}
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="relative">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-hero-fuchsia to-pink-500 flex items-center justify-center font-black shadow-fuchsia group-hover:scale-105 group-hover:shadow-fuchsia-lg transition duration-300">
                  <Zap className="w-6 h-6 text-hero-lightning fill-hero-lightning animate-pulse" />
                </div>
                <span className="absolute -bottom-1 -right-1 w-3 h-3 bg-hero-lightning rounded-full border-2 border-hero-navy" />
              </div>
              <div className="flex flex-col">
                <div className="font-black text-xl tracking-tight text-white flex items-center gap-1">
                  DIGITAL <span className="text-hero-fuchsia font-extrabold group-hover:text-pink-400 transition">HEROES</span>
                </div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-hero-lightning">
                  Salerno ⚡ Community
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-1">
              {navLinks.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition duration-200 ${
                      isActive
                        ? 'bg-hero-fuchsia/20 text-hero-fuchsia-light border border-hero-fuchsia/40 shadow-sm'
                        : 'text-slate-300 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-hero-fuchsia' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                    {item.badge !== undefined && (
                      <span className="ml-1 px-1.5 py-0.5 text-[10px] font-black rounded-full bg-hero-fuchsia text-white shadow-fuchsia">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}

              {/* Sezione Gestione per Admin / Organizzatori */}
              {isManager && (
                <Link
                  href="/gestione"
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition ml-2 border ${
                    pathname.startsWith('/gestione')
                      ? 'bg-gradient-to-r from-purple-900/60 to-hero-fuchsia/40 text-pink-300 border-hero-fuchsia/50 shadow-fuchsia'
                      : 'border-purple-500/30 text-purple-300 hover:bg-purple-950/40 hover:text-white'
                  }`}
                >
                  <ShieldCheck className="w-4 h-4 text-hero-fuchsia" />
                  <span>Pannello Gestione</span>
                </Link>
              )}
            </nav>
          </div>

          {/* User & Role Switcher Actions */}
          <div className="hidden md:flex items-center gap-3">
            {/* Selettore rapido ruoli per test/collaudo (visibile solo se abilitato) */}
            {showRoleSwitcher && (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setRoleSwitcherOpen(!roleSwitcherOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 text-xs rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-slate-200 transition backdrop-blur-md"
                  title="Cambia utente per testare ruoli e permessi"
                >
                  <span className="font-semibold text-slate-400 text-[11px]">Ruolo test:</span>
                  <span
                    className={`font-black px-2 py-0.5 rounded text-[10px] uppercase tracking-wider ${
                      currentUser?.role === 'admin'
                        ? 'bg-hero-lightning text-slate-950 font-black shadow-lightning'
                        : currentUser?.role === 'organizer'
                        ? 'bg-hero-fuchsia text-white shadow-fuchsia'
                        : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    }`}
                  >
                    {currentUser?.role === 'admin'
                      ? 'Admin'
                      : currentUser?.role === 'organizer'
                      ? 'Organizzatore'
                      : 'Iscritto'}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {roleSwitcherOpen && (
                  <div className="absolute right-0 mt-2 w-64 rounded-xl bg-hero-surface/95 backdrop-blur-2xl shadow-2xl border border-white/15 p-2 z-50 text-xs">
                    <div className="px-2 py-1.5 text-slate-400 font-semibold border-b border-white/10 mb-1 text-[11px]">
                      Simula Ruolo di Test:
                    </div>
                    {testUsers.map((u) => (
                      <button
                        key={u.id}
                        onClick={() => handleSwitchUser(u.id)}
                        className={`w-full text-left px-2.5 py-2 rounded-lg flex items-center justify-between hover:bg-white/10 transition ${
                          currentUser?.id === u.id ? 'bg-hero-fuchsia/25 text-white font-bold border border-hero-fuchsia/40' : 'text-slate-300'
                        }`}
                      >
                        <div>
                          <div className="font-bold text-slate-100">{u.name}</div>
                          <div className="text-[10px] text-slate-400">{u.label}</div>
                        </div>
                        {currentUser?.id === u.id && (
                          <span className="text-hero-fuchsia font-extrabold text-[10px] uppercase tracking-wider">Attivo</span>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Profile Pill */}
            {currentUser ? (
              <Link
                href="/profilo"
                className="flex items-center gap-2.5 pl-2 pr-3.5 py-1.5 rounded-full border border-white/10 hover:border-hero-fuchsia/40 bg-white/5 hover:bg-white/10 transition group"
              >
                <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-hero-fuchsia to-pink-500 flex items-center justify-center text-white font-black text-xs shadow-fuchsia group-hover:scale-105 transition">
                  {currentUser.first_name[0]}
                  {currentUser.last_name[0]}
                </div>
                <div className="text-left text-xs">
                  <div className="font-bold text-slate-100 group-hover:text-hero-fuchsia-light transition leading-none">
                    {currentUser.first_name} {currentUser.last_name}
                  </div>
                </div>
              </Link>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="px-3.5 py-2 text-xs font-bold text-slate-300 hover:text-white"
                >
                  Accedi
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 text-xs font-black text-white bg-gradient-to-r from-hero-fuchsia to-pink-600 hover:from-pink-600 hover:to-hero-fuchsia rounded-xl shadow-fuchsia hover:shadow-fuchsia-lg transition duration-300"
                >
                  Unisciti ⚡
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden gap-2">
            {unreadCount > 0 && (
              <Link
                href="/messaggi"
                className="relative p-2 text-slate-300 hover:text-hero-fuchsia"
                aria-label="Messaggi non letti"
              >
                <MessageSquare className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-hero-fuchsia shadow-fuchsia animate-ping" />
              </Link>
            )}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 border border-white/10"
              aria-label="Apri menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-white/10 bg-hero-surface/95 backdrop-blur-2xl px-4 pt-4 pb-6 space-y-4 shadow-2xl">
          <div className="space-y-1">
            {navLinks.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-bold ${
                    isActive
                      ? 'bg-hero-fuchsia/20 text-hero-fuchsia-light border border-hero-fuchsia/40'
                      : 'text-slate-300 hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-5 h-5 text-hero-fuchsia" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && (
                    <span className="px-2 py-0.5 text-xs font-black rounded-full bg-hero-fuchsia text-white shadow-fuchsia">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}

            {isManager && (
              <Link
                href="/gestione"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-bold text-purple-300 border border-purple-500/30 bg-purple-950/20"
              >
                <ShieldCheck className="w-5 h-5 text-hero-fuchsia" />
                <span>Pannello Gestione</span>
              </Link>
            )}
          </div>

          {showRoleSwitcher && (
            <div className="border-t border-white/10 pt-3">
              <div className="text-[11px] font-bold text-slate-400 mb-2">Simula Ruolo per Test:</div>
              <div className="grid grid-cols-3 gap-1.5">
                {testUsers.map((u) => (
                  <button
                    key={u.id}
                    onClick={() => {
                      handleSwitchUser(u.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`py-2 px-2 text-xs rounded-lg border text-center transition font-bold ${
                      currentUser?.id === u.id
                        ? 'border-hero-fuchsia bg-hero-fuchsia text-white shadow-fuchsia'
                        : 'border-white/10 bg-white/5 text-slate-300'
                    }`}
                  >
                    {u.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="border-t border-white/10 pt-3">
            {currentUser ? (
              <div className="flex items-center justify-between">
                <Link
                  href="/profilo"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3"
                >
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-hero-fuchsia to-pink-500 flex items-center justify-center font-black text-white shadow-fuchsia">
                    {currentUser.first_name[0]}
                    {currentUser.last_name[0]}
                  </div>
                  <div>
                    <div className="font-bold text-white">
                      {currentUser.first_name} {currentUser.last_name}
                    </div>
                    <div className="text-xs text-slate-400">{currentUser.email}</div>
                  </div>
                </Link>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 text-xs font-bold text-slate-200 border border-white/20 rounded-xl"
                >
                  Accedi
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 text-xs font-black text-white bg-gradient-to-r from-hero-fuchsia to-pink-600 rounded-xl shadow-fuchsia"
                >
                  Unisciti a Digital ⚡ Heroes
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
