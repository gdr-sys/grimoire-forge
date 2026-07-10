/**
 * Chiavi i18n dell'ImageBlock — da unire (spread) in src/locales/it.ts
 * e src/locales/en.ts:
 *
 *   import { imageBlockIt } from './partials/imageBlock';
 *   export default { ...baseIt, ...imageBlockIt };
 */

export const imageBlockIt = {
  'imageBlock.emptyTitle': 'Aggiungi un\u2019immagine',
  'imageBlock.dropHere': 'Rilascia qui l\u2019immagine',
  'imageBlock.dropToReplace': 'Rilascia per sostituire l\u2019immagine',
  'imageBlock.uploadButton': 'Carica dal dispositivo',
  'imageBlock.or': 'oppure',
  'imageBlock.urlPlaceholder': 'Incolla un URL (Imgur, ecc.)',
  'imageBlock.useUrl': 'Usa questo URL',
  'imageBlock.externalHint':
    'Gli URL esterni sono solo riferimenti: l\u2019immagine non viene scaricata né salvata.',
  'imageBlock.uploadSuccess': 'Immagine caricata',
  'imageBlock.removeImage': 'Rimuovi immagine',
  'imageBlock.retrySync': 'Riprova sincronizzazione',

  // Badge sorgente
  'imageBlock.source.local': 'Solo locale',
  'imageBlock.source.drive': 'Su Google Drive',
  'imageBlock.source.syncing': 'Sincronizzazione\u2026',
  'imageBlock.source.syncError': 'Errore sync',
  'imageBlock.source.external': 'URL esterno',

  // Avviso locale-only (utente non loggato)
  'imageBlock.localOnlyWarning':
    'Questa immagine è salvata solo su questo dispositivo.',
  'imageBlock.localOnlyCta':
    'Accedi con Google per sincronizzarla nel cloud.',

  // Errori
  'imageBlock.errorUnsupportedType':
    'Formato non supportato. Usa PNG, JPEG, WebP, GIF o SVG.',
  'imageBlock.errorTooLarge':
    'Immagine troppo grande anche dopo la compressione (max 2MB).',
  'imageBlock.errorInvalidUrl': 'URL non valido. Deve iniziare con https://',
  'imageBlock.errorExternalLoad':
    'Impossibile caricare l\u2019immagine da questo URL.',
  'imageBlock.errorGeneric': 'Errore durante il caricamento dell\u2019immagine.',
  'imageBlock.missingLocally':
    'Immagine non disponibile su questo dispositivo. Accedi con lo stesso account Google per scaricarla dal tuo Drive.',
} as const;

export const imageBlockEn = {
  'imageBlock.emptyTitle': 'Add an image',
  'imageBlock.dropHere': 'Drop the image here',
  'imageBlock.dropToReplace': 'Drop to replace the image',
  'imageBlock.uploadButton': 'Upload from device',
  'imageBlock.or': 'or',
  'imageBlock.urlPlaceholder': 'Paste a URL (Imgur, etc.)',
  'imageBlock.useUrl': 'Use this URL',
  'imageBlock.externalHint':
    'External URLs are references only: the image is never downloaded or stored.',
  'imageBlock.uploadSuccess': 'Image uploaded',
  'imageBlock.removeImage': 'Remove image',
  'imageBlock.retrySync': 'Retry sync',

  'imageBlock.source.local': 'Local only',
  'imageBlock.source.drive': 'On Google Drive',
  'imageBlock.source.syncing': 'Syncing\u2026',
  'imageBlock.source.syncError': 'Sync error',
  'imageBlock.source.external': 'External URL',

  'imageBlock.localOnlyWarning':
    'This image is saved only on this device.',
  'imageBlock.localOnlyCta':
    'Sign in with Google to sync it to the cloud.',

  'imageBlock.errorUnsupportedType':
    'Unsupported format. Use PNG, JPEG, WebP, GIF or SVG.',
  'imageBlock.errorTooLarge':
    'Image is too large even after compression (max 2MB).',
  'imageBlock.errorInvalidUrl': 'Invalid URL. It must start with https://',
  'imageBlock.errorExternalLoad': 'Could not load the image from this URL.',
  'imageBlock.errorGeneric': 'Something went wrong while loading the image.',
  'imageBlock.missingLocally':
    'Image not available on this device. Sign in with the same Google account to fetch it from your Drive.',
} as const;
