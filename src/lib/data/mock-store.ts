import {
  Profile,
  Activity,
  Registration,
  Material,
  Announcement,
  Communication,
  CommunicationRecipient,
  EmailDispatch,
  AuditLog,
} from '@/types/database';

export interface StoredFile {
  id: string;
  filename: string;
  mimeType: string;
  dataBase64: string; // File simulato salvato in locale
  size: number;
}

export interface MockStoreData {
  profiles: Profile[];
  activities: Activity[];
  activityOrganizers: { activity_id: string; user_id: string; created_at: string }[];
  registrations: Registration[];
  materials: Material[];
  announcements: Announcement[];
  communications: Communication[];
  communicationRecipients: CommunicationRecipient[];
  emailDispatches: EmailDispatch[];
  auditLogs: AuditLog[];
  files: Map<string, StoredFile>;
}

// Initial seed data
const initialProfiles: Profile[] = [
  {
    id: '00000000-0000-0000-0000-000000000001',
    email: 'admin@digitalheroes.it',
    first_name: 'Marco',
    last_name: 'Rossi',
    organization: 'Digital Heroes Team',
    role: 'admin',
    privacy_accepted_at: '2026-01-01T10:00:00.000Z',
    privacy_version: '1.0',
    marketing_consent: true,
    email_notifications_consent: true,
    created_at: '2026-01-01T10:00:00.000Z',
    updated_at: '2026-01-01T10:00:00.000Z',
  },
  {
    id: '00000000-0000-0000-0000-000000000002',
    email: 'organizzatore@digitalheroes.it',
    first_name: 'Sara',
    last_name: 'Bianchi',
    organization: 'AI Innovation Hub',
    role: 'organizer',
    privacy_accepted_at: '2026-01-05T11:00:00.000Z',
    privacy_version: '1.0',
    marketing_consent: false,
    email_notifications_consent: true,
    created_at: '2026-01-05T11:00:00.000Z',
    updated_at: '2026-01-05T11:00:00.000Z',
  },
  {
    id: '00000000-0000-0000-0000-000000000003',
    email: 'iscritto@digitalheroes.it',
    first_name: 'Luca',
    last_name: 'Verdi',
    organization: 'Freelance Developer',
    role: 'member',
    privacy_accepted_at: '2026-02-10T09:30:00.000Z',
    privacy_version: '1.0',
    marketing_consent: true,
    email_notifications_consent: true,
    created_at: '2026-02-10T09:30:00.000Z',
    updated_at: '2026-02-10T09:30:00.000Z',
  },
  {
    id: '00000000-0000-0000-0000-000000000004',
    email: 'giulia.neri@example.it',
    first_name: 'Giulia',
    last_name: 'Neri',
    organization: 'Tech Academy',
    role: 'member',
    privacy_accepted_at: '2026-02-15T14:20:00.000Z',
    privacy_version: '1.0',
    marketing_consent: false,
    email_notifications_consent: true,
    created_at: '2026-02-15T14:20:00.000Z',
    updated_at: '2026-02-15T14:20:00.000Z',
  },
];

const initialActivities: Activity[] = [
  {
    id: '10000000-0000-0000-0000-000000000001',
    title: '⚡ 4° Meetup Digital Heroes: Networking & Coworking',
    slug: '4-meetup-digital-heroes-green-hub',
    description: 'Il giorno che stavamo attendendo! Incontro di networking informale, scambio di idee, lightning talks e aperitivo rilassato per remote workers e freelance di Salerno e provincia.',
    type: 'meetup',
    status: 'published',
    start_date: '2026-11-20T18:00:00.000Z',
    end_date: '2026-11-20T21:30:00.000Z',
    is_online: false,
    location: 'Green Hub, Cava de’ Tirreni (Salerno)',
    max_participants: 45,
    cover_image_url: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1200&q=80',
    created_by: '00000000-0000-0000-0000-000000000001',
    created_at: '2026-10-01T08:00:00.000Z',
    updated_at: '2026-10-01T08:00:00.000Z',
  },
  {
    id: '10000000-0000-0000-0000-000000000002',
    title: '⚡ Lightning Talks & AI: Strumenti Intelligenti per Remote Workers',
    slug: 'lightning-talks-ai-remote-workers',
    description: 'Interventi rapidi da 10 minuti su automazione, intelligenza artificiale per freelancer e gestione del tempo senza burnout.',
    type: 'event',
    status: 'published',
    start_date: '2026-11-28T18:30:00.000Z',
    end_date: '2026-11-28T21:00:00.000Z',
    is_online: false,
    location: 'Spazio Innovazione Lungomare, Salerno',
    max_participants: 35,
    cover_image_url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80',
    created_by: '00000000-0000-0000-0000-000000000002',
    created_at: '2026-10-05T09:00:00.000Z',
    updated_at: '2026-10-05T09:00:00.000Z',
  },
  {
    id: '10000000-0000-0000-0000-000000000003',
    title: 'Corso Operativo: Postazione Smart Working & Benessere Psico-Fisico',
    slug: 'corso-benessere-smart-working',
    description: 'Come impostare abitudini sostenibili, pause efficaci e confini tra lavoro e vita privata quando la casa è anche il tuo ufficio.',
    type: 'course',
    status: 'published',
    start_date: '2026-12-05T10:00:00.000Z',
    end_date: '2026-12-05T13:00:00.000Z',
    is_online: true,
    location: 'https://meet.digitalheroes.it/benessere-smartworking',
    max_participants: 20,
    cover_image_url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80',
    created_by: '00000000-0000-0000-0000-000000000001',
    created_at: '2026-10-10T10:00:00.000Z',
    updated_at: '2026-10-10T10:00:00.000Z',
  },
  {
    id: '10000000-0000-0000-0000-000000000004',
    title: 'Sessione di Co-Working Riservata: Progetti Indipendenti',
    slug: 'sessione-coworking-progetti-indipendenti',
    description: 'Mattinata di lavoro condiviso e focus room.',
    type: 'course',
    status: 'draft',
    start_date: '2026-12-15T09:00:00.000Z',
    end_date: '2026-12-15T13:00:00.000Z',
    is_online: true,
    location: 'https://meet.digitalheroes.it/focus-room',
    max_participants: 12,
    cover_image_url: null,
    created_by: '00000000-0000-0000-0000-000000000002',
    created_at: '2026-10-20T11:00:00.000Z',
    updated_at: '2026-10-20T11:00:00.000Z',
  },
];

const initialOrganizers = [
  {
    activity_id: '10000000-0000-0000-0000-000000000001',
    user_id: '00000000-0000-0000-0000-000000000001', // Admin
    created_at: '2026-10-01T08:00:00.000Z',
  },
  {
    activity_id: '10000000-0000-0000-0000-000000000002',
    user_id: '00000000-0000-0000-0000-000000000002', // Sara
    created_at: '2026-10-05T09:00:00.000Z',
  },
  {
    activity_id: '10000000-0000-0000-0000-000000000003',
    user_id: '00000000-0000-0000-0000-000000000001',
    created_at: '2026-10-10T10:00:00.000Z',
  },
  {
    activity_id: '10000000-0000-0000-0000-000000000004',
    user_id: '00000000-0000-0000-0000-000000000002',
    created_at: '2026-10-20T11:00:00.000Z',
  },
];

const initialRegistrations: Registration[] = [
  {
    id: '20000000-0000-0000-0000-000000000001',
    activity_id: '10000000-0000-0000-0000-000000000001',
    user_id: '00000000-0000-0000-0000-000000000003', // Luca iscritto
    status: 'confirmed',
    registered_at: '2026-10-15T12:00:00.000Z',
  },
  {
    id: '20000000-0000-0000-0000-000000000002',
    activity_id: '10000000-0000-0000-0000-000000000002',
    user_id: '00000000-0000-0000-0000-000000000004', // Giulia
    status: 'confirmed',
    registered_at: '2026-10-16T14:30:00.000Z',
  },
];

// File base64 di esempio per PDF reale
const samplePdfBase64 = Buffer.from(
  '%PDF-1.4\n1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj\n2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj\n3 0 obj<</Type/Page/MediaBox[0 0 612 792]/Parent 2 0 R/Resources<<>>>>endobj\nxref\n0 4\n0000000000 65535 f \n0000000010 00000 n \n0000000060 00000 n \n0000000117 00000 n \ntrailer<</Size 4/Root 1 0 R>>\nstartxref\n201\n%%EOF'
).toString('base64');

const initialFiles = new Map<string, StoredFile>([
  [
    'materials/guida-community-2026.pdf',
    {
      id: 'f-1',
      filename: 'guida-community-2026.pdf',
      mimeType: 'application/pdf',
      dataBase64: samplePdfBase64,
      size: 154200,
    },
  ],
  [
    'materials/slide-workshop-agenti-ai.pdf',
    {
      id: 'f-2',
      filename: 'slide-workshop-agenti-ai.pdf',
      mimeType: 'application/pdf',
      dataBase64: samplePdfBase64,
      size: 2450000,
    },
  ],
  [
    'materials/checklist-pwa-moderna.pdf',
    {
      id: 'f-3',
      filename: 'checklist-pwa-moderna.pdf',
      mimeType: 'application/pdf',
      dataBase64: samplePdfBase64,
      size: 890000,
    },
  ],
]);

const initialMaterials: Material[] = [
  {
    id: '30000000-0000-0000-0000-000000000001',
    title: '⚡ Mappa & Censimento Spazi Work-Friendly: Salerno e Provincia',
    description: 'Guida e censimento completo dei luoghi con ottima connettività, ristoro e servizi ideali per smart working e nomadismo digitale sul territorio.',
    category: 'Spazi & Territorio',
    file_path: 'materials/guida-community-2026.pdf',
    file_name: 'mappa-spazi-workfriendly-salerno.pdf',
    file_size: 154200,
    mime_type: 'application/pdf',
    activity_id: null,
    visibility: 'all_members',
    available_from: null,
    is_archived: false,
    uploaded_by: '00000000-0000-0000-0000-000000000001',
    created_at: '2026-10-01T10:00:00.000Z',
    updated_at: '2026-10-01T10:00:00.000Z',
  },
  {
    id: '30000000-0000-0000-0000-000000000002',
    title: 'Slide & Risorse Tecniche - 4° Meetup Green Hub',
    description: 'Dispensa esclusiva con slide, appunti pratici e contatti del network per chi ha partecipato all’incontro.',
    category: 'Meetup',
    file_path: 'materials/slide-workshop-agenti-ai.pdf',
    file_name: 'slide-4-meetup-green-hub.pdf',
    file_size: 2450000,
    mime_type: 'application/pdf',
    activity_id: '10000000-0000-0000-0000-000000000001',
    visibility: 'activity_attendees', // Riservato agli iscritti
    available_from: null,
    is_archived: false,
    uploaded_by: '00000000-0000-0000-0000-000000000001',
    created_at: '2026-10-12T15:00:00.000Z',
    updated_at: '2026-10-12T15:00:00.000Z',
  },
  {
    id: '30000000-0000-0000-0000-000000000003',
    title: 'Guida Benessere Psico-Fisico & Work-Life Balance per Remote Workers',
    description: 'Consigli, routine ergonomiche e riflessioni pratiche per evitare il burnout e bilanciare vita privata e lavoro da remoto.',
    category: 'Benessere',
    file_path: 'materials/checklist-pwa-moderna.pdf',
    file_name: 'guida-benessere-remote-working.pdf',
    file_size: 890000,
    mime_type: 'application/pdf',
    activity_id: '10000000-0000-0000-0000-000000000002',
    visibility: 'all_members',
    available_from: null,
    is_archived: false,
    uploaded_by: '00000000-0000-0000-0000-000000000002',
    created_at: '2026-10-14T09:00:00.000Z',
    updated_at: '2026-10-14T09:00:00.000Z',
  },
];

const initialAnnouncements: Announcement[] = [
  {
    id: '40000000-0000-0000-0000-000000000001',
    title: '⚡ Benvenuto in Digital Heroes: non passare la vita da solo davanti a uno schermo!',
    content: 'Se lavori in remoto, hai orari flessibili e tutti quelli che conosci ti guardano in maniera strana... **sei nel posto giusto!** Cerchiamo di dare una smossa a Salerno e provincia creando nuove opportunità di confronto, networking rilassato e supporto reciproco.',
    image_url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80',
    external_link: 'https://www.digital-heroes.net',
    status: 'published',
    is_pinned: true,
    visibility: 'all_members',
    activity_id: null,
    published_at: '2026-10-01T09:00:00.000Z',
    created_by: '00000000-0000-0000-0000-000000000001',
    created_at: '2026-10-01T09:00:00.000Z',
    updated_at: '2026-10-01T09:00:00.000Z',
  },
  {
    id: '40000000-0000-0000-0000-000000000002',
    title: 'Nessuno Scopo Commerciale, Zero Marchette: La Nostra Promessa',
    content: 'Digital Heroes **non ha scopi commerciali**. Le nostre attività non hanno nessun secondo fine e non nascondono marchette. Non siamo legati ad alcuna corporazione, partito politico o sponsor vincolante: solo una community autonoma per far crescere il territorio.',
    image_url: null,
    external_link: null,
    status: 'published',
    is_pinned: false,
    visibility: 'all_members',
    activity_id: null,
    published_at: '2026-10-15T10:00:00.000Z',
    created_by: '00000000-0000-0000-0000-000000000001',
    created_at: '2026-10-15T10:00:00.000Z',
    updated_at: '2026-10-15T10:00:00.000Z',
  },
  {
    id: '40000000-0000-0000-0000-000000000003',
    title: '⚡ Il Green Hub di Cava de’ Tirreni accoglie i Remote Workers!',
    content: 'Abbiamo ufficializzato la collaborazione per le giornate di coworking libero e i prossimi meetup. Consulta la sezione **Attività** per riservare il tuo posto.',
    image_url: null,
    external_link: null,
    status: 'published',
    is_pinned: false,
    visibility: 'activity_attendees',
    activity_id: '10000000-0000-0000-0000-000000000001',
    published_at: '2026-10-18T10:00:00.000Z',
    created_by: '00000000-0000-0000-0000-000000000001',
    created_at: '2026-10-18T10:00:00.000Z',
    updated_at: '2026-10-18T10:00:00.000Z',
  },
];

const initialCommunications: Communication[] = [
  {
    id: '50000000-0000-0000-0000-000000000001',
    subject: 'Conferma iscrizione e istruzioni per il Workshop Agenti AI',
    body: 'Gentile iscritto, la tua registrazione al Workshop del 20 Novembre è confermata. Ti aspettiamo alle 17:30.',
    target_type: 'activity_attendees',
    target_activity_id: '10000000-0000-0000-0000-000000000001',
    status: 'sent',
    send_email: true,
    sender_id: '00000000-0000-0000-0000-000000000001',
    sent_at: '2026-10-16T10:00:00.000Z',
    created_at: '2026-10-16T09:55:00.000Z',
  },
];

const initialRecipients: CommunicationRecipient[] = [
  {
    id: '60000000-0000-0000-0000-000000000001',
    communication_id: '50000000-0000-0000-0000-000000000001',
    user_id: '00000000-0000-0000-0000-000000000003', // Luca Verdi
    is_read: false,
    read_at: null,
    created_at: '2026-10-16T10:00:00.000Z',
  },
];

const initialEmailDispatches: EmailDispatch[] = [
  {
    id: '70000000-0000-0000-0000-000000000001',
    communication_id: '50000000-0000-0000-0000-000000000001',
    recipient_id: '00000000-0000-0000-0000-000000000003',
    recipient_email: 'iscritto@digitalheroes.it',
    status: 'accepted',
    attempts: 1,
    error_message: null,
    sent_at: '2026-10-16T10:00:02.000Z',
    delivery_confirmed_at: null,
    created_at: '2026-10-16T10:00:00.000Z',
  },
];

const initialAuditLogs: AuditLog[] = [
  {
    id: '80000000-0000-0000-0000-000000000001',
    admin_id: '00000000-0000-0000-0000-000000000001',
    action: 'CREATE_ACTIVITY',
    entity_type: 'activity',
    entity_id: '10000000-0000-0000-0000-000000000001',
    details: { title: 'Workshop Pratico: Agenti AI e Automazione per PMI' },
    ip_address: '127.0.0.1',
    created_at: '2026-10-01T08:00:00.000Z',
  },
  {
    id: '80000000-0000-0000-0000-000000000002',
    admin_id: '00000000-0000-0000-0000-000000000001',
    action: 'UPLOAD_MATERIAL',
    entity_type: 'material',
    entity_id: '30000000-0000-0000-0000-000000000001',
    details: { filename: 'guida-community-2026.pdf', visibility: 'all_members' },
    ip_address: '127.0.0.1',
    created_at: '2026-10-01T10:00:00.000Z',
  },
];

// In-memory persistent singleton during server lifetime
class MockStore {
  public data: MockStoreData = {
    profiles: [...initialProfiles],
    activities: [...initialActivities],
    activityOrganizers: [...initialOrganizers],
    registrations: [...initialRegistrations],
    materials: [...initialMaterials],
    announcements: [...initialAnnouncements],
    communications: [...initialCommunications],
    communicationRecipients: [...initialRecipients],
    emailDispatches: [...initialEmailDispatches],
    auditLogs: [...initialAuditLogs],
    files: new Map(initialFiles),
  };

  // Metodo per resettare lo stato (usato nei test)
  public reset() {
    this.data = {
      profiles: JSON.parse(JSON.stringify(initialProfiles)),
      activities: JSON.parse(JSON.stringify(initialActivities)),
      activityOrganizers: JSON.parse(JSON.stringify(initialOrganizers)),
      registrations: JSON.parse(JSON.stringify(initialRegistrations)),
      materials: JSON.parse(JSON.stringify(initialMaterials)),
      announcements: JSON.parse(JSON.stringify(initialAnnouncements)),
      communications: JSON.parse(JSON.stringify(initialCommunications)),
      communicationRecipients: JSON.parse(JSON.stringify(initialRecipients)),
      emailDispatches: JSON.parse(JSON.stringify(initialEmailDispatches)),
      auditLogs: JSON.parse(JSON.stringify(initialAuditLogs)),
      files: new Map(initialFiles),
    };
  }
}

// Global singleton across hot reloads
const globalForStore = globalThis as unknown as { mockStoreInstance?: MockStore };
export const mockStore = globalForStore.mockStoreInstance || new MockStore();
if (process.env.NODE_ENV !== 'production') globalForStore.mockStoreInstance = mockStore;
