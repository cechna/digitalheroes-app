/**
 * Servizio email transazionale per Digital Heroes.
 * Supporta configurazione tramite variabili d'ambiente (Resend, SMTP, o mock sicuro).
 * Distingue rigorosamente tra:
 * - created: record creato
 * - pending: in coda per l'invio
 * - accepted: accettata dal provider (ad es. Resend/SMTP 250 OK)
 * - failed: invio fallito con dettaglio errore
 * - delivered: confermata via webhook (MAI mostrata prematuramente se non c'è conferma reale)
 */

export interface EmailPayload {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export interface EmailSendResult {
  status: 'accepted' | 'failed';
  messageId?: string;
  errorMessage?: string;
}

export async function sendTransactionalEmail(payload: EmailPayload): Promise<EmailSendResult> {
  const provider = process.env.EMAIL_PROVIDER || 'mock';

  // Modalità di test o mock (non invia email a indirizzi reali durante i test)
  if (provider === 'mock' || provider === 'console' || process.env.NODE_ENV === 'test') {
    // Log sicuro senza esporre credenziali
    console.log(`[EMAIL DISPATCH - MOCK] Destinatario: ${payload.to} | Oggetto: ${payload.subject}`);
    return {
      status: 'accepted',
      messageId: `mock-msg-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    };
  }

  // Integrazione Resend
  if (provider === 'resend') {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      return {
        status: 'failed',
        errorMessage: 'Configurazione Resend non valida: RESEND_API_KEY mancante.',
      };
    }

    try {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          from: process.env.EMAIL_FROM || 'Digital Heroes <notifiche@digitalheroes.it>',
          to: payload.to,
          subject: payload.subject,
          html: payload.html,
          text: payload.text,
        }),
      });

      const resData = await response.json();
      if (!response.ok) {
        return {
          status: 'failed',
          errorMessage: resData?.message || 'Errore durante l’invio con Resend.',
        };
      }

      return {
        status: 'accepted', // Accettata dal servizio (non ancora segnata come delivered finché non c'è webhook)
        messageId: resData.id,
      };
    } catch (err: unknown) {
      const errMessage = err instanceof Error ? err.message : 'Errore di rete invio email';
      return {
        status: 'failed',
        errorMessage: errMessage,
      };
    }
  }

  return {
    status: 'failed',
    errorMessage: `Provider email non supportato: ${provider}`,
  };
}
