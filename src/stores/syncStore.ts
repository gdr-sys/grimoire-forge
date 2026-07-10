import { create } from 'zustand';
import type { SyncStatus, ConflictInfo } from '../types/sync';

interface SyncState {
  globalStatus: SyncStatus;
  documentStatuses: Record<string, SyncStatus>;
  lastSyncAt: number | null;
  pendingConflicts: ConflictInfo[];
  isSyncing: boolean;
  error: string | null;
  setGlobalStatus: (status: SyncStatus) => void;
  setDocumentStatus: (docId: string, status: SyncStatus) => void;
  setLastSyncAt: (ts: number) => void;
  addConflict: (conflict: ConflictInfo) => void;
  resolveConflict: (documentId: string) => void;
  setError: (err: string | null) => void;
  setSyncing: (syncing: boolean) => void;
}

export const useSyncStore = create<SyncState>((set) => ({
  globalStatus: 'local-only',
  documentStatuses: {},
  lastSyncAt: null,
  pendingConflicts: [],
  isSyncing: false,
  error: null,
  setGlobalStatus: (globalStatus) => set({ globalStatus }),
  setDocumentStatus: (docId, status) =>
    set((s) => ({ documentStatuses: { ...s.documentStatuses, [docId]: status } })),
  setLastSyncAt: (lastSyncAt) => set({ lastSyncAt }),
  addConflict: (conflict) =>
    set((s) => ({ pendingConflicts: [...s.pendingConflicts, conflict] })),
  resolveConflict: (documentId) =>
    set((s) => ({
      pendingConflicts: s.pendingConflicts.filter((c) => c.documentId !== documentId),
    })),
  setError: (error) => set({ error }),
  setSyncing: (isSyncing) => set({ isSyncing }),
}));
