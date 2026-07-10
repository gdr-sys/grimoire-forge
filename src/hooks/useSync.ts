import { useSyncStore } from '../stores/syncStore';
import { syncAll } from '../services/syncManager';

export function useSync() {
  return {
    globalStatus: useSyncStore((s) => s.globalStatus),
    isSyncing: useSyncStore((s) => s.isSyncing),
    lastSyncAt: useSyncStore((s) => s.lastSyncAt),
    error: useSyncStore((s) => s.error),
    syncNow: syncAll,
  };
}
