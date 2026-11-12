/**
 * Utilità di formattazione date per il fuso orario Europe/Rome
 * Gestisce correttamente il cambio tra ora solare (CET, UTC+1) e legale (CEST, UTC+2).
 */

export const ROME_TIMEZONE = 'Europe/Rome';

export function formatItalianDate(dateString: string | Date, options?: Intl.DateTimeFormatOptions): string {
  if (!dateString) return '';
  const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
  if (isNaN(date.getTime())) return '';

  const defaultOptions: Intl.DateTimeFormatOptions = {
    timeZone: ROME_TIMEZONE,
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    ...options,
  };

  return new Intl.DateTimeFormat('it-IT', defaultOptions).format(date);
}

export function formatItalianDateTime(dateString: string | Date): string {
  if (!dateString) return '';
  const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
  if (isNaN(date.getTime())) return '';

  return new Intl.DateTimeFormat('it-IT', {
    timeZone: ROME_TIMEZONE,
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

export function formatItalianTime(dateString: string | Date): string {
  if (!dateString) return '';
  const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
  if (isNaN(date.getTime())) return '';

  return new Intl.DateTimeFormat('it-IT', {
    timeZone: ROME_TIMEZONE,
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

export function isUpcoming(dateString: string | Date): boolean {
  if (!dateString) return false;
  const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
  return date.getTime() > Date.now();
}

export function isPast(dateString: string | Date): boolean {
  if (!dateString) return false;
  const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
  return date.getTime() <= Date.now();
}
