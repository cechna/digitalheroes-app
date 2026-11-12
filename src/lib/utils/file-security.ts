/**
 * Validazione sicura dei file caricati:
 * - Controllo dimensione configurabile
 * - Controllo estensione consentita
 * - Ispezione dei magic bytes (header binario) per impedire spoofing del MIME type
 * - Sanificazione del nome file contro path-traversal
 */

export const MAX_FILE_SIZE_BYTES = parseInt(process.env.MAX_FILE_SIZE_BYTES || '26214400', 10); // 25 MB default

export interface FileValidationResult {
  valid: boolean;
  error?: string;
  detectedMime?: string;
  sanitizedFilename?: string;
}

const ALLOWED_EXTENSIONS = new Set([
  'pdf',
  'doc',
  'docx',
  'xls',
  'xlsx',
  'ppt',
  'pptx',
  'zip',
  'png',
  'jpg',
  'jpeg',
  'webp',
]);

export function sanitizeFilename(filename: string): string {
  // Rimuove qualsiasi path traversal (../, ..\, /)
  const base = filename.replace(/^.*[\\/]/, '');
  // Rimuove caratteri non sicuri
  return base.replace(/[^a-zA-Z0-9._-]/g, '_');
}

export function validateUploadedFile(
  filename: string,
  declaredMimeType: string,
  fileBytes: Uint8Array
): FileValidationResult {
  // 1. Dimensione
  if (fileBytes.byteLength === 0) {
    return { valid: false, error: 'Il file è vuoto.' };
  }
  if (fileBytes.byteLength > MAX_FILE_SIZE_BYTES) {
    const maxMb = Math.round(MAX_FILE_SIZE_BYTES / (1024 * 1024));
    return { valid: false, error: `La dimensione del file supera il limite consentito di ${maxMb} MB.` };
  }

  // 2. Estensione
  const parts = filename.split('.');
  if (parts.length < 2) {
    return { valid: false, error: 'Il file deve avere un’estensione valida.' };
  }
  const ext = parts.pop()!.toLowerCase();
  if (!ALLOWED_EXTENSIONS.has(ext)) {
    return {
      valid: false,
      error: `Formato file .${ext} non consentito. Formati ammessi: PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX, ZIP, PNG, JPG, WEBP.`,
    };
  }

  // 3. Magic Bytes Verification
  const header = Array.from(fileBytes.slice(0, 8))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
    .toLowerCase();

  let detectedMime = declaredMimeType;

  if (ext === 'pdf') {
    // PDF magic bytes: %PDF (25 50 44 46)
    if (!header.startsWith('25504446')) {
      return { valid: false, error: 'Il contenuto del file non corrisponde a un formato PDF valido.' };
    }
    detectedMime = 'application/pdf';
  } else if (ext === 'png') {
    // PNG magic bytes: 89 50 4e 47 0d 0a 1a 0a
    if (!header.startsWith('89504e47')) {
      return { valid: false, error: 'Il file non è un’immagine PNG valida.' };
    }
    detectedMime = 'image/png';
  } else if (ext === 'jpg' || ext === 'jpeg') {
    // JPEG magic bytes: ff d8 ff
    if (!header.startsWith('ffd8ff')) {
      return { valid: false, error: 'Il file non è un’immagine JPEG valida.' };
    }
    detectedMime = 'image/jpeg';
  } else if (ext === 'webp') {
    // RIFF (52 49 46 46)
    if (!header.startsWith('52494646')) {
      return { valid: false, error: 'Il file non è un’immagine WEBP valida.' };
    }
    detectedMime = 'image/webp';
  } else if (ext === 'zip' || ext === 'docx' || ext === 'xlsx' || ext === 'pptx') {
    // PK zip signature: 50 4b 03 04 or 50 4b 05 06 or 50 4b 07 08
    if (!header.startsWith('504b')) {
      return { valid: false, error: 'Il file zip/office non corrisponde a un archivio o documento valido.' };
    }
  } else if (ext === 'doc' || ext === 'xls' || ext === 'ppt') {
    // Compound file binary format: d0 cf 11 e0
    if (!header.startsWith('d0cf11e0')) {
      return { valid: false, error: 'Il documento Office legacy non è valido.' };
    }
  }

  return {
    valid: true,
    detectedMime,
    sanitizedFilename: sanitizeFilename(filename),
  };
}
