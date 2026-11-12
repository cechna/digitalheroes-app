/**
 * Sanificazione sicura per contenuti formattati per proteggere da attacchi XSS.
 * Supporta markdown di base (grassetto, corsivo, liste, link sicuri, paragrafi).
 */

export function sanitizeHtml(rawHtml: string): string {
  if (!rawHtml) return '';

  // Escaping dei tag HTML pericolosi per prevenire XSS
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };

  return rawHtml.replace(/[&<>"']/g, (m) => map[m]);
}

/**
 * Converte testo formattato (stile Markdown semplificato) in HTML sicuro
 */
export function formatSafeContent(text: string): string {
  if (!text) return '';

  // 1. Sanitize raw HTML characters first
  let safe = sanitizeHtml(text);

  // 2. Bold: **testo** o __testo__
  safe = safe.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  safe = safe.replace(/__(.*?)__/g, '<strong>$1</strong>');

  // 3. Italic: *testo* o _testo_
  safe = safe.replace(/\*(.*?)\*/g, '<em>$1</em>');
  safe = safe.replace(/_(.*?)_/g, '<em>$1</em>');

  // 4. Safe Links: [titolo](https://...)
  safe = safe.replace(
    /\[(.*?)\]\((https?:\/\/[^\s<]+)\)/g,
    '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-blue-600 dark:text-blue-400 underline hover:opacity-80">$1</a>'
  );

  // 5. Line breaks to paragraphs
  const paragraphs = safe.split(/\n\s*\n/);
  return paragraphs
    .map((p) => `<p class="mb-3 leading-relaxed">${p.replace(/\n/g, '<br />')}</p>`)
    .join('');
}
