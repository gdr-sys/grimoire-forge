/**
 * Tipi per il sistema immagini di Grimoire Forge.
 *
 * Tre sorgenti possibili per un ImageBlock:
 *  - 'local'    → file caricato dall'utente, salvato in IndexedDB
 *                 (+ sync su Google Drive se loggato)
 *  - 'external' → URL esterno (Imgur, ecc.), solo riferimento
 *  - 'drive'    → immagine già sincronizzata su Google Drive
 *                 (stato raggiunto da 'local' dopo sync riuscita)
 */

export type ImageSource = 'local' | 'external' | 'drive';

export type ImageSyncStatus =
  | 'local-only'   // solo IndexedDB, non loggato o sync non ancora avvenuta
  | 'pending'      // in coda per upload su Drive
  | 'syncing'      // upload in corso
  | 'synced'       // presente sia in locale che su Drive
  | 'error';       // upload fallito (retry con backoff)

/** Record immagine salvato in IndexedDB (tabella `images` di Dexie). */
export interface StoredImage {
  /** UUID generato alla creazione, chiave primaria. */
  id: string;
  /** Nome file originale, sanificato. */
  fileName: string;
  /** Blob WebP compresso (max 2MB, vedi imageManager). */
  blob: Blob;
  /** Dimensioni originali in pixel, per layout senza flash. */
  width: number;
  height: number;
  /** Byte del blob compresso. */
  sizeBytes: number;
  mimeType: 'image/webp';
  createdAt: number;
  /** fileId Google Drive quando synced, altrimenti null. */
  driveFileId: string | null;
  syncStatus: ImageSyncStatus;
  /** Timestamp ultimo tentativo di sync (per backoff). */
  lastSyncAttempt: number | null;
  syncRetryCount: number;
}

/** Dati dell'ImageBlock persistiti dentro il documento JSON. */
export interface ImageBlockData {
  source: ImageSource;
  /**
   * Per 'local' e 'drive': id del record StoredImage.
   * Per 'external': null.
   */
  imageId: string | null;
  /**
   * Per 'external': l'URL fornito dall'utente.
   * Per 'drive': URL webContentLink come fallback cross-device.
   * Per 'local': null (si risolve da IndexedDB).
   */
  url: string | null;
  /** Testo alternativo per accessibilità. */
  alt: string;
  /** Didascalia opzionale mostrata sotto l'immagine. */
  caption: string;
  /** Percentuale della larghezza colonna (10–100). */
  widthPercent: number;
  alignment: 'left' | 'center' | 'right';
  float: 'none' | 'left' | 'right';
  /** Mascheramento forma (spec: cerchio, esagono, scudo). */
  maskShape: 'none' | 'circle' | 'hexagon' | 'shield';
  borderRadius: number;
}

export const DEFAULT_IMAGE_BLOCK_DATA: ImageBlockData = {
  source: 'local',
  imageId: null,
  url: null,
  alt: '',
  caption: '',
  widthPercent: 100,
  alignment: 'center',
  float: 'none',
  maskShape: 'none',
  borderRadius: 0,
};

/** Limite dimensione post-compressione (spec: max 2MB). */
export const MAX_IMAGE_BYTES = 2 * 1024 * 1024;

/** Formati accettati in input (convertiti tutti in WebP). */
export const ACCEPTED_IMAGE_TYPES = [
  'image/png',
  'image/jpeg',
  'image/webp',
  'image/gif',
  'image/svg+xml',
] as const;
