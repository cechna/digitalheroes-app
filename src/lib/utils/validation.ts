import { z } from 'zod';

export const registerSchema = z.object({
  email: z.string().email('Inserisci un indirizzo email valido').toLowerCase().trim(),
  password: z
    .string()
    .min(8, 'La password deve contenere almeno 8 caratteri')
    .regex(/[A-Z]/, 'La password deve contenere almeno una lettera maiuscola')
    .regex(/[0-9]/, 'La password deve contenere almeno un numero'),
  firstName: z.string().min(2, 'Il nome deve contenere almeno 2 caratteri').trim(),
  lastName: z.string().min(2, 'Il cognome deve contenere almeno 2 caratteri').trim(),
  organization: z.string().trim().optional().or(z.literal('')),
  privacyAccepted: z.boolean().refine((val) => val === true, {
    message: "È necessario accettare l'informativa sulla privacy per procedere",
  }),
  privacyVersion: z.string().default('1.0'),
  marketingConsent: z.boolean().default(false),
  emailNotificationsConsent: z.boolean().default(true),
});

export const loginSchema = z.object({
  email: z.string().email('Inserisci un indirizzo email valido').toLowerCase().trim(),
  password: z.string().min(1, 'Inserisci la tua password'),
});

export const profileUpdateSchema = z.object({
  firstName: z.string().min(2, 'Il nome deve contenere almeno 2 caratteri').trim(),
  lastName: z.string().min(2, 'Il cognome deve contenere almeno 2 caratteri').trim(),
  organization: z.string().trim().optional().or(z.literal('')),
  marketingConsent: z.boolean().default(false),
  emailNotificationsConsent: z.boolean().default(true),
});

export const activitySchema = z.object({
  title: z.string().min(3, 'Il titolo deve contenere almeno 3 caratteri').trim(),
  description: z.string().min(10, 'La descrizione deve essere di almeno 10 caratteri').trim(),
  type: z.enum(['event', 'meetup', 'course']),
  status: z.enum(['draft', 'published', 'cancelled', 'completed']),
  startDate: z.string().refine((val) => !isNaN(Date.parse(val)), 'Data di inizio non valida'),
  endDate: z.string().refine((val) => !isNaN(Date.parse(val)), 'Data di fine non valida'),
  isOnline: z.boolean().default(false),
  location: z.string().min(2, 'Specifica il luogo o il link della sessione online').trim(),
  maxParticipants: z
    .union([z.number().int().positive('La capienza deve essere maggiore di zero'), z.null(), z.literal('')])
    .transform((val) => (val === '' ? null : val)),
  coverImageUrl: z.string().url('URL immagine non valido').optional().or(z.literal('')),
}).refine(
  (data) => new Date(data.endDate) >= new Date(data.startDate),
  {
    message: 'La data di fine non può essere precedente alla data di inizio',
    path: ['endDate'],
  }
);

export const materialSchema = z.object({
  title: z.string().min(3, 'Il titolo del materiale deve avere almeno 3 caratteri').trim(),
  description: z.string().trim().optional().or(z.literal('')),
  category: z.string().min(2, 'La categoria è obbligatoria').trim(),
  activityId: z.string().uuid('Seleziona un’attività valida').optional().or(z.literal('')).or(z.null()),
  visibility: z.enum(['all_members', 'activity_attendees']),
  availableFrom: z.string().optional().or(z.literal('')).or(z.null()),
});

export const announcementSchema = z.object({
  title: z.string().min(3, 'Il titolo deve avere almeno 3 caratteri').trim(),
  content: z.string().min(10, 'Il testo deve essere di almeno 10 caratteri').trim(),
  imageUrl: z.string().url('URL immagine non valido').optional().or(z.literal('')),
  externalLink: z.string().url('URL link non valido').optional().or(z.literal('')),
  status: z.enum(['draft', 'published', 'archived']),
  isPinned: z.boolean().default(false),
  visibility: z.enum(['all_members', 'activity_attendees']),
  activityId: z.string().uuid().optional().or(z.literal('')).or(z.null()),
});

export const communicationSchema = z.object({
  subject: z.string().min(3, "L'oggetto deve avere almeno 3 caratteri").trim(),
  body: z.string().min(10, 'Il messaggio deve essere di almeno 10 caratteri').trim(),
  targetType: z.enum(['all_members', 'activity_attendees', 'selected_users']),
  targetActivityId: z.string().uuid().optional().or(z.literal('')).or(z.null()),
  sendEmail: z.boolean().default(false),
  selectedUserIds: z.array(z.string().uuid()).optional().default([]),
});
