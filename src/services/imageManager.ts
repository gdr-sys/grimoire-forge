/**
 * imageManager — servizio centrale per le immagini.
 *
 * Responsabilità:
 *  1. Ingest da file (upload o drag&drop): compressione WebP client-side,
 *     salvataggio in IndexedDB, accodamento sync Drive se loggato.
 *  2. Risoluzione URL visualizzabile per ogni sorgente (object URL cache).
 *  3. Sync su Google Drive con retry + exponential backoff.
 *
 * Dipendenze dal resto dell'app (già definite nella spec):
 *  - db (Dexie)            → src/lib/db.ts, tabella `images`
 *  - googleDrive           → src/services/googleDrive.ts
 *  - authStore (Zustand)   → src/stores/authStore.ts
 */

import { db } from '../lib/db';
import { googleDrive } from './googleDrive';
import { useAuthStore } from '../stores/authStore';
import {
  ACCEPTED_IMAGE_TYPES,
  MAX_IMAGE_BYTES,
  type StoredImage,
} from '../types/image';

// ---------------------------------------------------------------------------
// Object URL cache — evita di ricreare blob URL a ogni render e li revoca
// quando l'immagine viene eliminata.
// ---------------------------------------------------------------------------

const objectUrlCache = new Map<string, string>();

function getCachedObjectUrl(imageId: string, blob: Blob): string {
  let url = objectUrlCache.get(imageId);
  if (!url) {
    url = URL.createObjectURL(blob);
    objectUrlCache.set(imageId, url);
  }
  return url;
}

function revokeCachedObjectUrl(imageId: string): void {
  const url = objectUrlCache.get(imageId);
  if (url) {
    URL.revokeObjectURL(url);
    objectUrlCache.delete(imageId);
  }
}

// ---------------------------------------------------------------------------
// Compressione WebP client-side
// ---------------------------------------------------------------------------

interface CompressedImage {
  blob: Blob;
  width: number;
  height: number;
}

/**
 * Converte qualsiasi immagine raster in WebP, riducendo qualità e — se
 * necessario — dimensioni finché il blob rientra in MAX_IMAGE_BYTES.
 * Gli SVG vengono lasciati intatti se già sotto il limite (sono vettoriali,
 * ricomprimerli in raster peggiorerebbe la qualità di stampa).
 */
async function compressToWebP(file: File): Promise<CompressedImage> {
  if (file.type === 'image/svg+xml' && file.size <= MAX_IMAGE_BYTES) {
    const dims = await readImageDimensions(file);
    return { blob: file, ...dims };
  }

  const bitmap = await createImageBitmap(file);
  let { width, height } = bitmap;
  let quality = 0.9;

  // Cap iniziale ragionevole per documenti di stampa (300dpi A4 ≈ 2480px)
  const MAX_DIMENSION = 2560;
  if (Math.max(width, height) > MAX_DIMENSION) {
    const scale = MAX_DIMENSION / Math.max(width, height);
    width = Math.round(width * scale);
    height = Math.round(height * scale);
  }

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas 2D context unavailable');

  for (let attempt = 0; attempt < 8; attempt++) {
    canvas.width = width;
    canvas.height = height;
    ctx.clearRect(0, 0, width, height);
    ctx.drawImage(bitmap, 0, 0, width, height);

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, 'image/webp', quality),
    );
    if (!blob) throw new Error('WebP encoding failed');

    if (blob.size <= MAX_IMAGE_BYTES) {
      bitmap.close();
      return { blob, width, height };
    }

    // Prima riduci la qualità, poi le dimensioni.
    if (quality > 0.5) {
      quality -= 0.15;
    } else {
      width = Math.round(width * 0.8);
      height = Math.round(height * 0.8);
    }
  }

  bitmap.close();
  throw new ImageTooLargeError();
}

async function readImageDimensions(
  file: File,
): Promise<{ width: number; height: number }> {
  const url = URL.createObjectURL(file);
  try {
    const img = new Image();
    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = () => reject(new Error('Image decode failed'));
      img.src = url;
    });
    return { width: img.naturalWidth, height: img.naturalHeight };
  } finally {
    URL.revokeObjectURL(url);
  }
}

export class ImageTooLargeError extends Error {
  constructor() {
    super('Image exceeds size limit after compression');
    this.name = 'ImageTooLargeError';
  }
}

export class UnsupportedImageTypeError extends Error {
  constructor(public readonly mimeType: string) {
    super(`Unsupported image type: ${mimeType}`);
    this.name = 'UnsupportedImageTypeError';
  }
}

// ---------------------------------------------------------------------------
// API pubblica
// ---------------------------------------------------------------------------

/**
 * Ingest di un file immagine (upload o drag&drop).
 * Salva sempre in IndexedDB; se l'utente è loggato accoda la sync su Drive.
 * Ritorna il record salvato — il chiamante (ImageBlock) usa `id`.
 */
export async function ingestImageFile(file: File): Promise<StoredImage> {
  if (!ACCEPTED_IMAGE_TYPES.includes(file.type as never)) {
    throw new UnsupportedImageTypeError(file.type);
  }

  const { blob, width, height } = await compressToWebP(file);
  const isLoggedIn = useAuthStore.getState().user !== null;

  const record: StoredImage = {
    id: crypto.randomUUID(),
    fileName: sanitizeFileName(file.name),
    blob,
    width,
    height,
    sizeBytes: blob.size,
    mimeType: 'image/webp',
    createdAt: Date.now(),
    driveFileId: null,
    syncStatus: isLoggedIn ? 'pending' : 'local-only',
    lastSyncAttempt: null,
    syncRetryCount: 0,
  };

  await db.images.put(record);

  if (isLoggedIn) {
    void syncImageToDrive(record.id); // fire-and-forget, lo stato è nel record
  }

  return record;
}

/**
 * Risolve un URL visualizzabile per un'immagine locale/drive.
 * Ritorna null se il record non esiste su questo dispositivo — in quel caso
 * l'ImageBlock prova il fallback `url` (webContentLink Drive) se presente.
 */
export async function resolveImageUrl(imageId: string): Promise<string | null> {
  const record = await db.images.get(imageId);
  if (!record) return null;
  return getCachedObjectUrl(record.id, record.blob);
}

export async function getImageRecord(
  imageId: string,
): Promise<StoredImage | undefined> {
  return db.images.get(imageId);
}

/** Elimina l'immagine da IndexedDB e (se synced) da Google Drive. */
export async function deleteImage(imageId: string): Promise<void> {
  const record = await db.images.get(imageId);
  if (!record) return;

  revokeCachedObjectUrl(imageId);
  await db.images.delete(imageId);

  if (record.driveFileId && useAuthStore.getState().user) {
    try {
      await googleDrive.deleteFile(record.driveFileId);
    } catch {
      // Best-effort: l'immagine resta orfana su Drive dell'utente,
      // non è un errore bloccante.
    }
  }
}

// ---------------------------------------------------------------------------
// Sync Google Drive
// ---------------------------------------------------------------------------

const MAX_SYNC_RETRIES = 5;

/** Upload di una singola immagine su Drive, con stato tracciato nel record. */
export async function syncImageToDrive(imageId: string): Promise<void> {
  const record = await db.images.get(imageId);
  if (!record || record.syncStatus === 'synced' || record.syncStatus === 'syncing') {
    return;
  }
  if (!useAuthStore.getState().user) return;

  await db.images.update(imageId, {
    syncStatus: 'syncing',
    lastSyncAttempt: Date.now(),
  });

  try {
    const driveFileId = await googleDrive.uploadImage(
      record.blob,
      record.fileName,
      record.id,
    );
    await db.images.update(imageId, {
      driveFileId,
      syncStatus: 'synced',
      syncRetryCount: 0,
    });
  } catch (err) {
    const retryCount = record.syncRetryCount + 1;
    await db.images.update(imageId, {
      syncStatus: retryCount >= MAX_SYNC_RETRIES ? 'error' : 'pending',
      syncRetryCount: retryCount,
    });
    if (retryCount < MAX_SYNC_RETRIES) {
      // Exponential backoff: 2s, 4s, 8s, 16s...
      const delay = 2000 * 2 ** (retryCount - 1);
      setTimeout(() => void syncImageToDrive(imageId), delay);
    } else {
      throw err;
    }
  }
}

/**
 * Chiamata dal SyncEngine al login e al ritorno online:
 * accoda tutte le immagini non ancora sincronizzate.
 */
export async function syncAllPendingImages(): Promise<void> {
  if (!useAuthStore.getState().user) return;
  const pending = await db.images
    .where('syncStatus')
    .anyOf('local-only', 'pending', 'error')
    .toArray();
  for (const record of pending) {
    await db.images.update(record.id, { syncStatus: 'pending', syncRetryCount: 0 });
    await syncImageToDrive(record.id).catch(() => {
      /* stato già aggiornato nel record */
    });
  }
}

// ---------------------------------------------------------------------------

function sanitizeFileName(name: string): string {
  return name
    .normalize('NFKD')
    .replace(/[^\w.\-]+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 120);
}
