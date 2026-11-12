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
  UserRole,
} from '@/types/database';
import { mockStore, StoredFile } from '@/lib/data/mock-store';
import { validateUploadedFile } from '@/lib/utils/file-security';

// Determina se siamo in modalità Mock locale o connessi a Supabase
export function isMockMode(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  return !url || url.includes('mock.supabase.co') || url === '';
}

// Interfaccia del Repository
export const repository = {
  // --------------------------------------------------------------------------
  // UTENTI E PROFILI
  // --------------------------------------------------------------------------
  async getProfileById(userId: string): Promise<Profile | null> {
    const profile = mockStore.data.profiles.find((p) => p.id === userId);
    return profile ? { ...profile } : null;
  },

  async getProfileByEmail(email: string): Promise<Profile | null> {
    const profile = mockStore.data.profiles.find((p) => p.email.toLowerCase() === email.toLowerCase());
    return profile ? { ...profile } : null;
  },

  async listProfiles(
    requesterId: string,
    filters?: { role?: UserRole; search?: string; page?: number; limit?: number }
  ): Promise<{ profiles: Profile[]; total: number }> {
    const requester = await this.getProfileById(requesterId);
    if (!requester || requester.role !== 'admin') {
      throw new Error('Accesso negato: operazione riservata agli amministratori.');
    }

    let items = [...mockStore.data.profiles];
    if (filters?.role) {
      items = items.filter((p) => p.role === filters.role);
    }
    if (filters?.search) {
      const q = filters.search.toLowerCase();
      items = items.filter(
        (p) =>
          p.email.toLowerCase().includes(q) ||
          p.first_name.toLowerCase().includes(q) ||
          p.last_name.toLowerCase().includes(q) ||
          (p.organization && p.organization.toLowerCase().includes(q))
      );
    }

    const total = items.length;
    const page = filters?.page || 1;
    const limit = filters?.limit || 20;
    const offset = (page - 1) * limit;
    const paginated = items.slice(offset, offset + limit);

    return { profiles: paginated, total };
  },

  async updateProfileRole(targetUserId: string, newRole: UserRole, adminId: string): Promise<Profile> {
    const admin = await this.getProfileById(adminId);
    if (!admin || admin.role !== 'admin') {
      throw new Error('Accesso negato: solo un amministratore può modificare i ruoli.');
    }

    const targetIndex = mockStore.data.profiles.findIndex((p) => p.id === targetUserId);
    if (targetIndex === -1) {
      throw new Error('Utente non trovato.');
    }

    const oldRole = mockStore.data.profiles[targetIndex].role;
    mockStore.data.profiles[targetIndex].role = newRole;
    mockStore.data.profiles[targetIndex].updated_at = new Date().toISOString();

    await this.logAudit(adminId, 'UPDATE_USER_ROLE', 'profile', targetUserId, {
      oldRole,
      newRole,
      targetEmail: mockStore.data.profiles[targetIndex].email,
    });

    return { ...mockStore.data.profiles[targetIndex] };
  },

  async updateProfile(
    userId: string,
    data: {
      firstName: string;
      lastName: string;
      organization?: string;
      marketingConsent: boolean;
      emailNotificationsConsent: boolean;
    }
  ): Promise<Profile> {
    const index = mockStore.data.profiles.findIndex((p) => p.id === userId);
    if (index === -1) {
      throw new Error('Utente non trovato.');
    }

    mockStore.data.profiles[index] = {
      ...mockStore.data.profiles[index],
      first_name: data.firstName,
      last_name: data.lastName,
      organization: data.organization || null,
      marketing_consent: data.marketingConsent,
      email_notifications_consent: data.emailNotificationsConsent,
      updated_at: new Date().toISOString(),
    };

    return { ...mockStore.data.profiles[index] };
  },

  async registerUser(userData: {
    email: string;
    firstName: string;
    lastName: string;
    organization?: string;
    privacyVersion: string;
    marketingConsent: boolean;
    emailNotificationsConsent: boolean;
  }): Promise<Profile> {
    const existing = await this.getProfileByEmail(userData.email);
    if (existing) {
      throw new Error('Un utente con questo indirizzo email è già registrato.');
    }

    const newProfile: Profile = {
      id: crypto.randomUUID(),
      email: userData.email.toLowerCase().trim(),
      first_name: userData.firstName.trim(),
      last_name: userData.lastName.trim(),
      organization: userData.organization?.trim() || null,
      role: 'member', // Nessun utente può auto-assegnarsi ruoli privilegiati!
      privacy_accepted_at: new Date().toISOString(),
      privacy_version: userData.privacyVersion || '1.0',
      marketing_consent: userData.marketingConsent,
      email_notifications_consent: userData.emailNotificationsConsent,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    mockStore.data.profiles.push(newProfile);
    return { ...newProfile };
  },

  // --------------------------------------------------------------------------
  // ATTIVITÀ (EVENTI, MEETUP, CORSI)
  // --------------------------------------------------------------------------
  async listActivities(options?: {
    userId?: string;
    status?: string;
    type?: string;
    onlyRegistered?: boolean;
    search?: string;
  }): Promise<Activity[]> {
    let list = [...mockStore.data.activities];

    if (options?.status) {
      list = list.filter((a) => a.status === options.status);
    } else {
      // Di default i membri vedono solo pubblicato o concluso
      const user = options?.userId ? await this.getProfileById(options.userId) : null;
      if (!user || user.role === 'member') {
        list = list.filter((a) => a.status === 'published' || a.status === 'completed');
      }
    }

    if (options?.type) {
      list = list.filter((a) => a.type === options.type);
    }

    if (options?.search) {
      const q = options.search.toLowerCase();
      list = list.filter((a) => a.title.toLowerCase().includes(q) || a.description.toLowerCase().includes(q));
    }

    // Aggiungi conteggio iscritti e stato iscrizione per l'utente richiedente
    const enriched: Activity[] = list.map((activity) => {
      const activeRegs = mockStore.data.registrations.filter(
        (r) => r.activity_id === activity.id && r.status === 'confirmed'
      );
      const isRegistered = options?.userId
        ? activeRegs.some((r) => r.user_id === options.userId)
        : false;

      return {
        ...activity,
        current_participants_count: activeRegs.length,
        is_user_registered: isRegistered,
      };
    });

    if (options?.onlyRegistered && options.userId) {
      return enriched.filter((a) => a.is_user_registered);
    }

    // Ordina per data inizio
    enriched.sort((a, b) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime());
    return enriched;
  },

  async getActivityById(id: string, userId?: string): Promise<Activity | null> {
    const activity = mockStore.data.activities.find((a) => a.id === id);
    if (!activity) return null;

    const activeRegs = mockStore.data.registrations.filter(
      (r) => r.activity_id === activity.id && r.status === 'confirmed'
    );
    const isRegistered = userId ? activeRegs.some((r) => r.user_id === userId) : false;

    // Recupera organizzatori
    const orgLinks = mockStore.data.activityOrganizers.filter((ao) => ao.activity_id === activity.id);
    const organizers = mockStore.data.profiles.filter((p) => orgLinks.some((o) => o.user_id === p.id));

    return {
      ...activity,
      current_participants_count: activeRegs.length,
      is_user_registered: isRegistered,
      organizers,
    };
  },

  async createActivity(
    data: Omit<Activity, 'id' | 'created_at' | 'updated_at' | 'current_participants_count' | 'is_user_registered'>,
    requesterId: string
  ): Promise<Activity> {
    const requester = await this.getProfileById(requesterId);
    if (!requester || (requester.role !== 'admin' && requester.role !== 'organizer')) {
      throw new Error('Accesso negato: operazione riservata ad amministratori e organizzatori.');
    }

    const newActivity: Activity = {
      ...data,
      id: crypto.randomUUID(),
      created_by: requesterId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    mockStore.data.activities.push(newActivity);
    // Assegna il creatore come organizzatore dell'attività
    mockStore.data.activityOrganizers.push({
      activity_id: newActivity.id,
      user_id: requesterId,
      created_at: new Date().toISOString(),
    });

    await this.logAudit(requesterId, 'CREATE_ACTIVITY', 'activity', newActivity.id, {
      title: newActivity.title,
      type: newActivity.type,
    });

    return { ...newActivity, current_participants_count: 0, is_user_registered: false };
  },

  async updateActivity(
    id: string,
    data: Partial<Activity>,
    requesterId: string
  ): Promise<Activity> {
    const requester = await this.getProfileById(requesterId);
    if (!requester || (requester.role !== 'admin' && requester.role !== 'organizer')) {
      throw new Error('Accesso negato.');
    }

    const index = mockStore.data.activities.findIndex((a) => a.id === id);
    if (index === -1) {
      throw new Error('Attività non trovata.');
    }

    // Se organizzatore, verifica assegnazione
    if (requester.role === 'organizer') {
      const isAssigned = mockStore.data.activityOrganizers.some(
        (ao) => ao.activity_id === id && ao.user_id === requesterId
      );
      if (!isAssigned) {
        throw new Error('Accesso negato: non sei assegnato a questa attività.');
      }
    }

    mockStore.data.activities[index] = {
      ...mockStore.data.activities[index],
      ...data,
      updated_at: new Date().toISOString(),
    };

    await this.logAudit(requesterId, 'UPDATE_ACTIVITY', 'activity', id, data);
    return { ...mockStore.data.activities[index] };
  },

  /**
   * Iscrizione atomica con blocco concorrenza e rispetto della capienza
   */
  async registerForActivityAtomic(
    activityId: string,
    userId: string
  ): Promise<{ success: boolean; message: string; code?: string }> {
    // 1. Verifica esistenza e stato attività
    const activity = mockStore.data.activities.find((a) => a.id === activityId);
    if (!activity) {
      return { success: false, message: 'Attività non trovata.', code: 'ACTIVITY_NOT_FOUND' };
    }
    if (activity.status !== 'published') {
      return { success: false, message: 'Le iscrizioni a questa attività non sono aperte.', code: 'NOT_OPEN' };
    }

    // 2. Controllo duplicati
    const existing = mockStore.data.registrations.find(
      (r) => r.activity_id === activityId && r.user_id === userId
    );
    if (existing && existing.status === 'confirmed') {
      return { success: false, message: 'Sei già iscritto a questa attività.', code: 'ALREADY_REGISTERED' };
    }

    // 3. Controllo capienza massima
    const currentConfirmed = mockStore.data.registrations.filter(
      (r) => r.activity_id === activityId && r.status === 'confirmed'
    ).length;

    if (activity.max_participants !== null && currentConfirmed >= activity.max_participants) {
      return { success: false, message: 'Spiacenti, i posti per questa attività sono esauriti.', code: 'CAPACITY_REACHED' };
    }

    // 4. Inserimento atomico
    if (existing) {
      existing.status = 'confirmed';
      existing.registered_at = new Date().toISOString();
    } else {
      mockStore.data.registrations.push({
        id: crypto.randomUUID(),
        activity_id: activityId,
        user_id: userId,
        status: 'confirmed',
        registered_at: new Date().toISOString(),
      });
    }

    return { success: true, message: 'Iscrizione confermata con successo!' };
  },

  async cancelRegistration(
    activityId: string,
    userId: string
  ): Promise<{ success: boolean; message: string }> {
    const reg = mockStore.data.registrations.find(
      (r) => r.activity_id === activityId && r.user_id === userId && r.status === 'confirmed'
    );
    if (!reg) {
      return { success: false, message: 'Nessuna iscrizione attiva trovata.' };
    }

    reg.status = 'cancelled';
    return { success: true, message: 'Iscrizione annullata con successo.' };
  },

  async getActivityAttendees(activityId: string, requesterId: string): Promise<Profile[]> {
    const requester = await this.getProfileById(requesterId);
    if (!requester) throw new Error('Accesso negato.');

    if (requester.role === 'member') {
      throw new Error('Accesso negato: l’elenco degli iscritti è visibile solo agli organizzatori.');
    }

    if (requester.role === 'organizer') {
      const isAssigned = mockStore.data.activityOrganizers.some(
        (ao) => ao.activity_id === activityId && ao.user_id === requesterId
      );
      if (!isAssigned) {
        throw new Error('Accesso negato: non sei assegnato come organizzatore a questa attività.');
      }
    }

    const confirmedUserIds = mockStore.data.registrations
      .filter((r) => r.activity_id === activityId && r.status === 'confirmed')
      .map((r) => r.user_id);

    return mockStore.data.profiles.filter((p) => confirmedUserIds.includes(p.id));
  },

  // --------------------------------------------------------------------------
  // MATERIALI DA SCARICARE (DOWNLOAD RISERVATI E VERIFICA PERMESSI)
  // --------------------------------------------------------------------------
  async listMaterials(userId?: string): Promise<Material[]> {
    const user = userId ? await this.getProfileById(userId) : null;
    const now = new Date().getTime();

    // Se admin -> vede tutti i materiali non archiviati
    if (user?.role === 'admin') {
      return mockStore.data.materials.filter((m) => !m.is_archived);
    }

    // Attività a cui l'utente è iscritto
    const registeredActivityIds = user
      ? mockStore.data.registrations
          .filter((r) => r.user_id === user.id && r.status === 'confirmed')
          .map((r) => r.activity_id)
      : [];

    // Attività assegnate all'organizzatore
    const organizedActivityIds = user?.role === 'organizer'
      ? mockStore.data.activityOrganizers
          .filter((ao) => ao.user_id === user.id)
          .map((ao) => ao.activity_id)
      : [];

    return mockStore.data.materials.filter((m) => {
      if (m.is_archived) return false;

      // Se organizzatore assegnato all'attività collegata
      if (m.activity_id && organizedActivityIds.includes(m.activity_id)) {
        return true;
      }

      // Controllo data di disponibilità
      if (m.available_from && new Date(m.available_from).getTime() > now) {
        return false;
      }

      // Visibile a tutti gli iscritti
      if (m.visibility === 'all_members') {
        return true;
      }

      // Visibile solo ai partecipanti registrati
      if (m.visibility === 'activity_attendees' && m.activity_id) {
        return registeredActivityIds.includes(m.activity_id);
      }

      return false;
    });
  },

  async canUserDownloadMaterial(
    materialId: string,
    userId: string
  ): Promise<{ allowed: boolean; reason?: string; material?: Material }> {
    const material = mockStore.data.materials.find((m) => m.id === materialId);
    if (!material) {
      return { allowed: false, reason: 'Materiale non trovato.' };
    }

    if (material.is_archived) {
      return { allowed: false, reason: 'Il materiale è stato archiviato.' };
    }

    const user = await this.getProfileById(userId);
    if (!user) {
      return { allowed: false, reason: 'Autenticazione richiesta.' };
    }

    // Amministratore può sempre scaricare
    if (user.role === 'admin') {
      return { allowed: true, material };
    }

    // Organizzatore assegnato
    if (user.role === 'organizer' && material.activity_id) {
      const isAssigned = mockStore.data.activityOrganizers.some(
        (ao) => ao.activity_id === material.activity_id && ao.user_id === user.id
      );
      if (isAssigned) return { allowed: true, material };
    }

    // Controllo data disponibilità per utenti normali
    if (material.available_from && new Date(material.available_from).getTime() > Date.now()) {
      return { allowed: false, reason: 'Il materiale non è ancora disponibile per il download.' };
    }

    // Se pubblico per tutti gli iscritti
    if (material.visibility === 'all_members') {
      return { allowed: true, material };
    }

    // Se riservato ai soli partecipanti dell'attività
    if (material.visibility === 'activity_attendees' && material.activity_id) {
      const isRegistered = mockStore.data.registrations.some(
        (r) => r.activity_id === material.activity_id && r.user_id === user.id && r.status === 'confirmed'
      );
      if (isRegistered) {
        return { allowed: true, material };
      }
      return { allowed: false, reason: 'Questo file è riservato ai soli partecipanti registrati all’attività.' };
    }

    return { allowed: false, reason: 'Accesso non autorizzato.' };
  },

  async getMaterialDownload(materialId: string, userId: string): Promise<StoredFile | null> {
    const check = await this.canUserDownloadMaterial(materialId, userId);
    if (!check.allowed || !check.material) {
      throw new Error(check.reason || 'Accesso al file negato.');
    }

    const file = mockStore.data.files.get(check.material.file_path);
    if (!file) {
      throw new Error('File non presente nell’archivio.');
    }

    return file;
  },

  async uploadMaterial(
    meta: {
      title: string;
      description?: string;
      category: string;
      activityId?: string | null;
      visibility: 'all_members' | 'activity_attendees';
      availableFrom?: string | null;
    },
    fileInfo: {
      filename: string;
      mimeType: string;
      bytes: Uint8Array;
    },
    requesterId: string
  ): Promise<Material> {
    const requester = await this.getProfileById(requesterId);
    if (!requester || (requester.role !== 'admin' && requester.role !== 'organizer')) {
      throw new Error('Accesso negato: solo organizzatori e amministratori possono caricare materiali.');
    }

    // Validazione rigorosa del file (MIME type e magic bytes reali)
    const validation = validateUploadedFile(fileInfo.filename, fileInfo.mimeType, fileInfo.bytes);
    if (!validation.valid) {
      throw new Error(validation.error || 'File non valido.');
    }

    const filePath = `materials/${Date.now()}_${validation.sanitizedFilename}`;
    const base64Data = Buffer.from(fileInfo.bytes).toString('base64');

    // Salva il file nel mock storage
    mockStore.data.files.set(filePath, {
      id: crypto.randomUUID(),
      filename: validation.sanitizedFilename!,
      mimeType: validation.detectedMime!,
      dataBase64: base64Data,
      size: fileInfo.bytes.byteLength,
    });

    const newMaterial: Material = {
      id: crypto.randomUUID(),
      title: meta.title.trim(),
      description: meta.description?.trim() || null,
      category: meta.category.trim(),
      file_path: filePath,
      file_name: validation.sanitizedFilename!,
      file_size: fileInfo.bytes.byteLength,
      mime_type: validation.detectedMime!,
      activity_id: meta.activityId || null,
      visibility: meta.visibility,
      available_from: meta.availableFrom || null,
      is_archived: false,
      uploaded_by: requesterId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    mockStore.data.materials.push(newMaterial);
    await this.logAudit(requesterId, 'UPLOAD_MATERIAL', 'material', newMaterial.id, {
      title: newMaterial.title,
      fileName: newMaterial.file_name,
      visibility: newMaterial.visibility,
    });

    return { ...newMaterial };
  },

  async archiveMaterial(materialId: string, requesterId: string): Promise<void> {
    const requester = await this.getProfileById(requesterId);
    if (!requester || (requester.role !== 'admin' && requester.role !== 'organizer')) {
      throw new Error('Accesso negato.');
    }

    const mat = mockStore.data.materials.find((m) => m.id === materialId);
    if (!mat) throw new Error('Materiale non trovato.');

    mat.is_archived = true;
    mat.updated_at = new Date().toISOString();

    await this.logAudit(requesterId, 'ARCHIVE_MATERIAL', 'material', materialId, { title: mat.title });
  },

  // --------------------------------------------------------------------------
  // BACHECA E AGGIORNAMENTI
  // --------------------------------------------------------------------------
  async listAnnouncements(userId?: string): Promise<Announcement[]> {
    const user = userId ? await this.getProfileById(userId) : null;
    let list = [...mockStore.data.announcements];

    if (!user || user.role === 'member') {
      const registeredActivityIds = user
        ? mockStore.data.registrations
            .filter((r) => r.user_id === user.id && r.status === 'confirmed')
            .map((r) => r.activity_id)
        : [];

      list = list.filter((a) => {
        if (a.status !== 'published') return false;
        if (a.visibility === 'all_members') return true;
        if (a.visibility === 'activity_attendees' && a.activity_id) {
          return registeredActivityIds.includes(a.activity_id);
        }
        return false;
      });
    }

    // Ordina: elementi fissati in alto per primi, poi per data di pubblicazione desc
    list.sort((a, b) => {
      if (a.is_pinned !== b.is_pinned) {
        return a.is_pinned ? -1 : 1;
      }
      const dateA = new Date(a.published_at || a.created_at).getTime();
      const dateB = new Date(b.published_at || b.created_at).getTime();
      return dateB - dateA;
    });

    return list;
  },

  async createAnnouncement(
    data: Omit<Announcement, 'id' | 'created_at' | 'updated_at'>,
    requesterId: string
  ): Promise<Announcement> {
    const requester = await this.getProfileById(requesterId);
    if (!requester || (requester.role !== 'admin' && requester.role !== 'organizer')) {
      throw new Error('Accesso negato: solo organizzatori e amministratori possono pubblicare annunci.');
    }

    const newAnnouncement: Announcement = {
      ...data,
      id: crypto.randomUUID(),
      created_by: requesterId,
      published_at: data.status === 'published' ? new Date().toISOString() : null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    mockStore.data.announcements.push(newAnnouncement);
    await this.logAudit(requesterId, 'CREATE_ANNOUNCEMENT', 'announcement', newAnnouncement.id, {
      title: newAnnouncement.title,
      status: newAnnouncement.status,
    });

    return { ...newAnnouncement };
  },

  // --------------------------------------------------------------------------
  // COMUNICAZIONI E CASELLA INTERNA
  // --------------------------------------------------------------------------
  async resolveRecipients(
    targetType: 'all_members' | 'activity_attendees' | 'selected_users',
    targetActivityId?: string | null,
    selectedUserIds?: string[]
  ): Promise<Profile[]> {
    if (targetType === 'all_members') {
      return mockStore.data.profiles.filter((p) => p.role === 'member');
    }

    if (targetType === 'activity_attendees' && targetActivityId) {
      const attendeesIds = mockStore.data.registrations
        .filter((r) => r.activity_id === targetActivityId && r.status === 'confirmed')
        .map((r) => r.user_id);
      return mockStore.data.profiles.filter((p) => attendeesIds.includes(p.id));
    }

    if (targetType === 'selected_users' && selectedUserIds) {
      return mockStore.data.profiles.filter((p) => selectedUserIds.includes(p.id));
    }

    return [];
  },

  async sendCommunication(
    data: {
      subject: string;
      body: string;
      targetType: 'all_members' | 'activity_attendees' | 'selected_users';
      targetActivityId?: string | null;
      sendEmail: boolean;
      selectedUserIds?: string[];
    },
    senderId: string
  ): Promise<{ communication: Communication; recipientsCount: number }> {
    const sender = await this.getProfileById(senderId);
    if (!sender || (sender.role !== 'admin' && sender.role !== 'organizer')) {
      throw new Error('Accesso negato: solo organizzatori e amministratori possono inviare comunicazioni.');
    }

    const recipients = await this.resolveRecipients(
      data.targetType,
      data.targetActivityId,
      data.selectedUserIds
    );

    const commId = crypto.randomUUID();
    const nowIso = new Date().toISOString();

    const newComm: Communication = {
      id: commId,
      subject: data.subject.trim(),
      body: data.body.trim(),
      target_type: data.targetType,
      target_activity_id: data.targetActivityId || null,
      status: 'sent',
      send_email: data.sendEmail,
      sender_id: senderId,
      sent_at: nowIso,
      created_at: nowIso,
    };

    mockStore.data.communications.push(newComm);

    // Inserisci destinatari nella casella interna
    for (const recipient of recipients) {
      mockStore.data.communicationRecipients.push({
        id: crypto.randomUUID(),
        communication_id: commId,
        user_id: recipient.id,
        is_read: false,
        read_at: null,
        created_at: nowIso,
      });

      // Se richiesto invio email e l'utente ha consentito le notifiche
      if (data.sendEmail && recipient.email_notifications_consent) {
        // Simulazione stato invio transazionale
        mockStore.data.emailDispatches.push({
          id: crypto.randomUUID(),
          communication_id: commId,
          recipient_id: recipient.id,
          recipient_email: recipient.email,
          status: 'accepted', // Distingue chiaramente "accepted dal servizio" rispetto a "delivered"
          attempts: 1,
          error_message: null,
          sent_at: nowIso,
          delivery_confirmed_at: null,
          created_at: nowIso,
        });
      }
    }

    await this.logAudit(senderId, 'SEND_COMMUNICATION', 'communication', commId, {
      subject: newComm.subject,
      targetType: newComm.target_type,
      recipientsCount: recipients.length,
      sendEmail: newComm.send_email,
    });

    return { communication: newComm, recipientsCount: recipients.length };
  },

  async listUserMessages(userId: string): Promise<Array<CommunicationRecipient & { communication: Communication }>> {
    const userRecipients = mockStore.data.communicationRecipients.filter((r) => r.user_id === userId);

    const result = userRecipients.map((rec) => {
      const comm = mockStore.data.communications.find((c) => c.id === rec.communication_id);
      return {
        ...rec,
        communication: comm!,
      };
    }).filter((item) => item.communication !== undefined);

    // Ordina dal più recente
    result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    return result;
  },

  async markMessageAsRead(communicationId: string, userId: string): Promise<void> {
    const rec = mockStore.data.communicationRecipients.find(
      (r) => r.communication_id === communicationId && r.user_id === userId
    );
    if (rec) {
      rec.is_read = true;
      rec.read_at = new Date().toISOString();
    }
  },

  async listSentCommunications(senderOrAdminId: string): Promise<Communication[]> {
    const user = await this.getProfileById(senderOrAdminId);
    if (!user || (user.role !== 'admin' && user.role !== 'organizer')) {
      throw new Error('Accesso negato.');
    }

    let list = [...mockStore.data.communications];
    if (user.role === 'organizer') {
      list = list.filter((c) => c.sender_id === user.id);
    }

    // Aggiungi statistiche destinatari e letture
    return list.map((c) => {
      const recs = mockStore.data.communicationRecipients.filter((r) => r.communication_id === c.id);
      const readCount = recs.filter((r) => r.is_read).length;
      return {
        ...c,
        recipients_count: recs.length,
        read_count: readCount,
      };
    }).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  },

  async getCommunicationDispatches(communicationId: string, requesterId: string): Promise<EmailDispatch[]> {
    const user = await this.getProfileById(requesterId);
    if (!user || (user.role !== 'admin' && user.role !== 'organizer')) {
      throw new Error('Accesso negato.');
    }

    return mockStore.data.emailDispatches.filter((d) => d.communication_id === communicationId);
  },

  // --------------------------------------------------------------------------
  // REGISTRO AUDIT (LOG OPERAZIONI AMMINISTRATIVE)
  // --------------------------------------------------------------------------
  async logAudit(
    adminId: string,
    action: string,
    entityType: string,
    entityId?: string | null,
    details?: Record<string, unknown> | null,
    ipAddress = '127.0.0.1'
  ): Promise<AuditLog> {
    const newLog: AuditLog = {
      id: crypto.randomUUID(),
      admin_id: adminId,
      action,
      entity_type: entityType,
      entity_id: entityId || null,
      details: details || null,
      ip_address: ipAddress,
      created_at: new Date().toISOString(),
    };

    mockStore.data.auditLogs.unshift(newLog);
    return newLog;
  },

  async listAuditLogs(
    adminId: string,
    options?: { page?: number; limit?: number }
  ): Promise<{ logs: AuditLog[]; total: number }> {
    const admin = await this.getProfileById(adminId);
    if (!admin || admin.role !== 'admin') {
      throw new Error('Accesso negato: solo gli amministratori possono consultare l’audit log.');
    }

    const total = mockStore.data.auditLogs.length;
    const page = options?.page || 1;
    const limit = options?.limit || 20;
    const offset = (page - 1) * limit;

    const enriched = mockStore.data.auditLogs.slice(offset, offset + limit).map((log) => ({
      ...log,
      admin: mockStore.data.profiles.find((p) => p.id === log.admin_id),
    }));

    return { logs: enriched, total };
  },

  // --------------------------------------------------------------------------
  // GDPR: ESPORTAZIONE E CANCELLAZIONE DATI UTENTE
  // --------------------------------------------------------------------------
  async exportUserData(userId: string): Promise<Record<string, unknown>> {
    const profile = await this.getProfileById(userId);
    if (!profile) throw new Error('Utente non trovato.');

    const registrations = mockStore.data.registrations.filter((r) => r.user_id === userId);
    const messages = await this.listUserMessages(userId);
    const uploadedMaterials = mockStore.data.materials.filter((m) => m.uploaded_by === userId);

    return {
      exported_at: new Date().toISOString(),
      profilo: profile,
      iscrizioni_attivita: registrations,
      messaggi_ricevuti: messages,
      materiali_caricati: uploadedMaterials,
    };
  },

  async deleteUserData(userId: string): Promise<void> {
    const index = mockStore.data.profiles.findIndex((p) => p.id === userId);
    if (index === -1) throw new Error('Utente non trovato.');

    // Rimuovi iscrizioni
    mockStore.data.registrations = mockStore.data.registrations.filter((r) => r.user_id !== userId);
    // Rimuovi messaggi ricevuti
    mockStore.data.communicationRecipients = mockStore.data.communicationRecipients.filter((r) => r.user_id !== userId);
    // Rimuovi profilo
    mockStore.data.profiles.splice(index, 1);
  },
};
