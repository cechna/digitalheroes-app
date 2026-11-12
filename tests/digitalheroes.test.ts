import test from 'node:test';
import assert from 'node:assert/strict';
import { repository } from '@/lib/services/repository';
import { mockStore } from '@/lib/data/mock-store';
import { validateUploadedFile } from '@/lib/utils/file-security';
import { formatSafeContent } from '@/lib/utils/sanitize';

test('DIGITAL HEROES - Verifica Completa dei 12 Percorsi Richiesti', async (t) => {
  // Reset store prima dei test
  mockStore.reset();

  const adminId = '00000000-0000-0000-0000-000000000001'; // Marco Rossi
  const organizerId = '00000000-0000-0000-0000-000000000002'; // Sara Bianchi
  const existingMemberId = '00000000-0000-0000-0000-000000000003'; // Luca Verdi

  // --------------------------------------------------------------------------
  // 1. Un utente si registra e accede (nessuna privilege escalation possibile)
  // --------------------------------------------------------------------------
  await t.test('1. Registrazione utente e verifica ruolo membro', async () => {
    const newUser = await repository.registerUser({
      email: 'nuovo.membro@example.com',
      firstName: 'Matteo',
      lastName: 'Gialli',
      organization: 'Tech Startup',
      privacyVersion: '1.0',
      marketingConsent: true,
      emailNotificationsConsent: true,
    });

    assert.equal(newUser.email, 'nuovo.membro@example.com');
    assert.equal(newUser.first_name, 'Matteo');
    // Verifica rigorosa: il nuovo utente DEVE avere ruolo 'member'
    assert.equal(newUser.role, 'member');
    assert.equal(newUser.privacy_version, '1.0');
    assert.ok(newUser.privacy_accepted_at);

    // Tentativo di registrazione duplicata deve fallire
    await assert.rejects(
      async () => {
        await repository.registerUser({
          email: 'nuovo.membro@example.com',
          firstName: 'Clonato',
          lastName: 'Falso',
          privacyVersion: '1.0',
          marketingConsent: false,
          emailNotificationsConsent: false,
        });
      },
      /già registrato/i
    );
  });

  // --------------------------------------------------------------------------
  // 2. Un organizzatore pubblica un evento con capienza limitata a 2 posti
  // --------------------------------------------------------------------------
  let testActivityId = '';
  await t.test('2. Un organizzatore pubblica un evento', async () => {
    const activity = await repository.createActivity(
      {
        title: 'Corso Avanzato Testing e RLS con Supabase',
        slug: 'corso-avanzato-testing-rls',
        description: 'Laboratorio pratico e intensivo di sicurezza dati.',
        type: 'course',
        status: 'published',
        start_date: '2026-12-10T18:00:00.000Z',
        end_date: '2026-12-10T21:00:00.000Z',
        is_online: true,
        location: 'https://meet.digitalheroes.it/test-rls',
        max_participants: 2, // Capienza fissa di 2 posti per testare limite
        cover_image_url: null,
        created_by: organizerId,
      },
      organizerId
    );

    assert.ok(activity.id);
    assert.equal(activity.title, 'Corso Avanzato Testing e RLS con Supabase');
    assert.equal(activity.status, 'published');
    assert.equal(activity.max_participants, 2);
    testActivityId = activity.id;
  });

  // --------------------------------------------------------------------------
  // 3. Un utente si iscrive senza creare duplicati
  // --------------------------------------------------------------------------
  await t.test('3. Iscrizione utente e prevenzione duplicati', async () => {
    // Prima iscrizione di Luca Verdi
    const res1 = await repository.registerForActivityAtomic(testActivityId, existingMemberId);
    assert.equal(res1.success, true);

    // Secondo tentativo dello stesso utente
    const resDuplicate = await repository.registerForActivityAtomic(testActivityId, existingMemberId);
    assert.equal(resDuplicate.success, false);
    assert.equal(resDuplicate.code, 'ALREADY_REGISTERED');
  });

  // --------------------------------------------------------------------------
  // 4. La capienza viene rispettata (blocco al superamento dei posti)
  // --------------------------------------------------------------------------
  await t.test('4. Rispetto rigoroso della capienza massima', async () => {
    const user2Id = '00000000-0000-0000-0000-000000000004'; // Giulia Neri
    const user3 = await repository.registerUser({
      email: 'terzo.utente@example.it',
      firstName: 'Paolo',
      lastName: 'Bruni',
      privacyVersion: '1.0',
      marketingConsent: false,
      emailNotificationsConsent: true,
    });

    // Seconda iscrizione -> Raggiunge 2/2 posti
    const res2 = await repository.registerForActivityAtomic(testActivityId, user2Id);
    assert.equal(res2.success, true);

    // Terza iscrizione -> Deve essere rifiutata per capienza esaurita
    const res3 = await repository.registerForActivityAtomic(testActivityId, user3.id);
    assert.equal(res3.success, false);
    assert.equal(res3.code, 'CAPACITY_REACHED');
  });

  // --------------------------------------------------------------------------
  // 5. Un organizzatore carica un materiale riservato all’evento
  // --------------------------------------------------------------------------
  let restrictedMaterialId = '';
  await t.test('5. Upload materiale riservato con validazione MIME e magic bytes', async () => {
    // Genera byte reali di un file PDF valido (%PDF-1.4...)
    const validPdfBytes = new TextEncoder().encode(
      '%PDF-1.4\n1 0 obj\n<< /Type /Catalog >>\nendobj\ntrailer\n<< /Root 1 0 R >>\n%%EOF'
    );

    // Verifica helper di validazione magic bytes
    const check = validateUploadedFile('dispensa-esclusiva.pdf', 'application/pdf', validPdfBytes);
    assert.equal(check.valid, true);

    const material = await repository.uploadMaterial(
      {
        title: 'Dispensa Esclusiva: Codice e Soluzioni Laboratorio',
        description: 'File PDF riservato ai soli partecipanti dell’evento.',
        category: 'Dispense',
        activityId: testActivityId,
        visibility: 'activity_attendees', // Riservato agli iscritti
      },
      {
        filename: 'dispensa-esclusiva.pdf',
        mimeType: 'application/pdf',
        bytes: validPdfBytes,
      },
      organizerId
    );

    assert.ok(material.id);
    assert.equal(material.visibility, 'activity_attendees');
    assert.equal(material.activity_id, testActivityId);
    restrictedMaterialId = material.id;
  });

  // --------------------------------------------------------------------------
  // 6. Un partecipante iscritto può scaricarlo
  // --------------------------------------------------------------------------
  await t.test('6. Partecipante autorizzato può effettuare il download', async () => {
    const authCheck = await repository.canUserDownloadMaterial(restrictedMaterialId, existingMemberId);
    assert.equal(authCheck.allowed, true);

    const file = await repository.getMaterialDownload(restrictedMaterialId, existingMemberId);
    assert.ok(file);
    assert.equal(file.mimeType, 'application/pdf');
    assert.ok(file.dataBase64.length > 0);
  });

  // --------------------------------------------------------------------------
  // 7. Un utente non autorizzato NON può accedervi neppure richiamando il download
  // --------------------------------------------------------------------------
  await t.test('7. Utente non iscritto viene rigorosamente bloccato dal download', async () => {
    // Creiamo un utente che NON è iscritto a testActivityId
    const outsider = await repository.registerUser({
      email: 'non.iscritto@example.it',
      firstName: 'Estraneo',
      lastName: 'Esterno',
      privacyVersion: '1.0',
      marketingConsent: false,
      emailNotificationsConsent: false,
    });

    const check = await repository.canUserDownloadMaterial(restrictedMaterialId, outsider.id);
    assert.equal(check.allowed, false);
    assert.match(check.reason || '', /riservato ai soli partecipanti/i);

    // Chiamando getMaterialDownload deve lanciare un'eccezione di sicurezza
    await assert.rejects(
      async () => {
        await repository.getMaterialDownload(restrictedMaterialId, outsider.id);
      },
      /Accesso.*negato|riservato/i
    );
  });

  // --------------------------------------------------------------------------
  // 8. Un organizzatore pubblica un aggiornamento protetto da XSS
  // --------------------------------------------------------------------------
  await t.test('8. Pubblicazione aggiornamento in bacheca con sanificazione XSS', async () => {
    const rawMaliciousContent =
      'Ciao a tutti! Ecco le **istruzioni importanti** e il link sicuro: [Google](https://google.com). <script>alert("hacked")</script>';

    // Verifica sanificatore
    const safeHtml = formatSafeContent(rawMaliciousContent);
    assert.ok(!safeHtml.includes('<script>'));
    assert.ok(safeHtml.includes('&lt;script&gt;'));
    assert.ok(safeHtml.includes('<strong>istruzioni importanti</strong>'));

    const announcement = await repository.createAnnouncement(
      {
        title: 'Promemoria: Portare laptop per le esercitazioni',
        content: rawMaliciousContent,
        image_url: null,
        external_link: null,
        status: 'published',
        is_pinned: true,
        visibility: 'activity_attendees',
        activity_id: testActivityId,
        created_by: organizerId,
      },
      organizerId
    );

    assert.ok(announcement.id);
    assert.equal(announcement.is_pinned, true);
  });

  // --------------------------------------------------------------------------
  // 9. Invio di una comunicazione a un gruppo di destinatari
  // --------------------------------------------------------------------------
  let communicationId = '';
  await t.test('9. Invio comunicazione mirata con calcolo destinatari ed email', async () => {
    const commResult = await repository.sendCommunication(
      {
        subject: 'Dettagli di accesso all’aula virtuale di domani',
        body: 'Vi ricordiamo che il link della sessione è attivo. A domani!',
        targetType: 'activity_attendees',
        targetActivityId: testActivityId,
        sendEmail: true,
      },
      organizerId
    );

    assert.equal(commResult.recipientsCount, 2); // Esattamente i 2 partecipanti iscritti
    assert.ok(commResult.communication.id);
    communicationId = commResult.communication.id;
  });

  // --------------------------------------------------------------------------
  // 10. Il messaggio compare soltanto agli utenti selezionati e può essere segnato come letto
  // --------------------------------------------------------------------------
  await t.test('10. Casella interna: messaggio ricevuto dal partecipante e marcatura lettura', async () => {
    // Partecipante iscritto
    const messages = await repository.listUserMessages(existingMemberId);
    const targetMsg = messages.find((m) => m.communication_id === communicationId);
    assert.ok(targetMsg);
    assert.equal(targetMsg.is_read, false);

    // Utente esterno non deve aver ricevuto il messaggio
    const outsider = await repository.getProfileByEmail('non.iscritto@example.it');
    const outsiderMsgs = await repository.listUserMessages(outsider!.id);
    assert.equal(outsiderMsgs.some((m) => m.communication_id === communicationId), false);

    // Segna come letto
    await repository.markMessageAsRead(communicationId, existingMemberId);
    const updatedMessages = await repository.listUserMessages(existingMemberId);
    const updatedMsg = updatedMessages.find((m) => m.communication_id === communicationId);
    assert.equal(updatedMsg?.is_read, true);
  });

  // --------------------------------------------------------------------------
  // 11. Stato invii email: distingui chiaramente accepted da delivered
  // --------------------------------------------------------------------------
  await t.test('11. Tracciamento accurato degli invii email transazionali', async () => {
    const dispatches = await repository.getCommunicationDispatches(communicationId, organizerId);
    assert.ok(dispatches.length > 0);

    for (const d of dispatches) {
      // Deve essere registrato con status 'accepted' o 'pending', MAI prematuramente 'delivered'
      assert.notEqual(d.status, 'delivered');
      assert.ok(['accepted', 'pending', 'created'].includes(d.status));
      assert.ok(d.recipient_email);
    }
  });

  // --------------------------------------------------------------------------
  // 12. Un iscritto NON può accedere alle funzioni amministrative
  // --------------------------------------------------------------------------
  await t.test('12. Protezione ruoli: un iscritto non può accedere a funzioni admin/organizer', async () => {
    // Tentativo di un membro di promuovere se stesso o altri ad admin
    await assert.rejects(
      async () => {
        await repository.updateProfileRole(existingMemberId, 'admin', existingMemberId);
      },
      /Accesso negato/i
    );

    // Tentativo di un membro di visualizzare la lista utenti
    await assert.rejects(
      async () => {
        await repository.listProfiles(existingMemberId);
      },
      /Accesso negato/i
    );

    // Tentativo di un membro di consultare l'audit log
    await assert.rejects(
      async () => {
        await repository.listAuditLogs(existingMemberId);
      },
      /Accesso negato/i
    );

    // Tentativo di un membro di creare un'attività
    await assert.rejects(
      async () => {
        await repository.createActivity(
          {
            title: 'Evento non autorizzato',
            slug: 'evento-non-autorizzato',
            description: 'Test',
            type: 'event',
            status: 'published',
            start_date: new Date().toISOString(),
            end_date: new Date().toISOString(),
            is_online: false,
            location: 'Roma',
            max_participants: 10,
            created_by: existingMemberId,
          },
          existingMemberId
        );
      },
      /Accesso negato/i
    );
  });
});
