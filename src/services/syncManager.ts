import { db } from '../lib/db';
import { googleDrive } from './googleDrive';
import { useAuthStore } from '../stores/authStore';
import { useSyncStore } from '../stores/syncStore';
import { useDocumentStore } from '../stores/documentStore';
import { syncAllPendingImages } from './imageManager';
import type { GrimoireDocument } from '../types/document';

const SYNC_INTERVAL_MS = 60_000;
const POST_SAVE_DELAY_MS = 5_000;

let syncIntervalId: ReturnType<typeof setInterval> | null = null;
let postSaveTimeoutId: ReturnType<typeof setTimeout> | null = null;

export async function syncDocument(doc: GrimoireDocument): Promise<void> {
  const { user } = useAuthStore.getState();
  if (!user) return;

  const syncStore = useSyncStore.getState();
  syncStore.setDocumentStatus(doc.id, 'syncing');
  syncStore.setSyncing(true);

  try {
    const content = JSON.stringify(doc);
    const driveFileId = await googleDrive.saveDocument(
      doc.id,
      content,
      doc.title || 'Untitled',
      doc.driveFileId,
    );

    // Update local record with the drive file ID
    await db.documents.update(doc.id, {
      driveFileId,
      syncStatus: 'synced',
    });

    useDocumentStore.getState().setCurrentDocument({ ...doc, driveFileId, syncStatus: 'synced' });
    syncStore.setDocumentStatus(doc.id, 'synced');
    syncStore.setLastSyncAt(Date.now());
  } catch (err) {
    syncStore.setDocumentStatus(doc.id, 'error');
    syncStore.setError(err instanceof Error ? err.message : 'Sync error');
    throw err;
  } finally {
    syncStore.setSyncing(false);
  }
}

export async function syncAll(): Promise<void> {
  const { user } = useAuthStore.getState();
  if (!user) return;

  try {
    await syncAllPendingImages();

    const pending = await db.documents
      .where('syncStatus')
      .anyOf('local-only', 'local-ahead', 'error')
      .toArray();

    for (const record of pending) {
      try {
        const doc: GrimoireDocument = JSON.parse(record.data);
        await syncDocument(doc);
      } catch {
        // Continue with next document
      }
    }

    useSyncStore.getState().setGlobalStatus('synced');
    useSyncStore.getState().setLastSyncAt(Date.now());
  } catch {
    useSyncStore.getState().setGlobalStatus('error');
  }
}

export function schedulePostSaveSync(doc: GrimoireDocument): void {
  if (postSaveTimeoutId) clearTimeout(postSaveTimeoutId);
  postSaveTimeoutId = setTimeout(() => void syncDocument(doc), POST_SAVE_DELAY_MS);
}

export function startAutoSync(): void {
  stopAutoSync();
  syncIntervalId = setInterval(() => void syncAll(), SYNC_INTERVAL_MS);
}

export function stopAutoSync(): void {
  if (syncIntervalId) {
    clearInterval(syncIntervalId);
    syncIntervalId = null;
  }
}

export function setupSyncListeners(): () => void {
  const handleOnline = () => void syncAll();
  const handleVisibility = () => {
    if (document.visibilityState === 'visible') void syncAll();
  };

  window.addEventListener('online', handleOnline);
  document.addEventListener('visibilitychange', handleVisibility);

  return () => {
    window.removeEventListener('online', handleOnline);
    document.removeEventListener('visibilitychange', handleVisibility);
    stopAutoSync();
  };
}
