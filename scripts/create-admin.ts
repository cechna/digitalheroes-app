/**
 * Script per la configurazione sicura del primo amministratore di Digital Heroes.
 * Utilizzo:
 *   npx tsx scripts/create-admin.ts admin@digitalheroes.it
 *
 * Verifica che non esista già un amministratore nel sistema per prevenire
 * escalation non autorizzate.
 */

import { repository } from '../src/lib/services/repository';
import { mockStore } from '../src/lib/data/mock-store';

async function main() {
  const emailArg = process.argv[2] || 'admin@digitalheroes.it';

  console.log(`[SETUP ADMIN] Verifica configurazione amministratore per: ${emailArg}`);

  const user = await repository.getProfileByEmail(emailArg);
  if (!user) {
    console.error(`[ERRORE] Utente con email ${emailArg} non trovato nel sistema. Effettua prima la registrazione.`);
    process.exit(1);
  }

  // Controlla se esiste già un admin attivo diverso da questo utente
  const existingAdmins = mockStore.data.profiles.filter((p) => p.role === 'admin' && p.id !== user.id);
  if (existingAdmins.length > 0) {
    console.error(`[ATTENZIONE] Esiste già un amministratore nel sistema (${existingAdmins[0].email}). Assegnazione non consentita da questo script di primo avvio.`);
    process.exit(1);
  }

  user.role = 'admin';
  user.updated_at = new Date().toISOString();

  await repository.logAudit(user.id, 'PROMOTE_FIRST_ADMIN', 'profile', user.id, {
    email: user.email,
  });

  console.log(`[SUCCESSO] L'utente ${user.first_name} ${user.last_name} (${user.email}) è ora Amministratore di Digital Heroes.`);
}

main().catch((err) => {
  console.error('[ERRORE FATALE]', err);
  process.exit(1);
});
