export type SyncStatus =
  | 'synced'
  | 'local-ahead'
  | 'drive-ahead'
  | 'conflict'
  | 'local-only'
  | 'drive-only'
  | 'syncing'
  | 'error';

export interface SyncRecord {
  documentId: string;
  status: SyncStatus;
  localUpdatedAt: number;
  driveModifiedTime: string | null;
  driveFileId: string | null;
  lastSyncAt: number | null;
  errorMessage: string | null;
}

export interface ConflictInfo {
  documentId: string;
  localTitle: string;
  driveTitle: string;
  localUpdatedAt: number;
  driveModifiedTime: string;
}
