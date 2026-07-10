import { Cloud, CloudOff, RefreshCw, AlertCircle, CheckCircle } from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';
import { useSyncStore } from '../../stores/syncStore';
import { useAuthStore } from '../../stores/authStore';
import { useDocumentStore } from '../../stores/documentStore';
import { syncDocument } from '../../services/syncManager';
import type { SyncStatus } from '../../types/sync';

const STATUS_ICONS: Record<SyncStatus, typeof Cloud> = {
  synced: CheckCircle,
  'local-ahead': Cloud,
  'drive-ahead': Cloud,
  conflict: AlertCircle,
  'local-only': CloudOff,
  'drive-only': Cloud,
  syncing: RefreshCw,
  error: AlertCircle,
};

const STATUS_COLORS: Record<SyncStatus, string> = {
  synced: 'text-emerald-500',
  'local-ahead': 'text-amber-500',
  'drive-ahead': 'text-blue-500',
  conflict: 'text-orange-500',
  'local-only': 'text-slate-400',
  'drive-only': 'text-blue-500',
  syncing: 'text-blue-500 animate-spin',
  error: 'text-red-500',
};

export function SyncIndicator() {
  const { t } = useTranslation();
  const user = useAuthStore((s) => s.user);
  const currentDocument = useDocumentStore((s) => s.currentDocument);
  const globalStatus = useSyncStore((s) => s.globalStatus);
  const isSyncing = useSyncStore((s) => s.isSyncing);

  if (!user) return null;

  const status: SyncStatus = isSyncing ? 'syncing' : globalStatus;
  const Icon = STATUS_ICONS[status];
  const colorClass = STATUS_COLORS[status];

  const labelKey: Record<SyncStatus, string> = {
    synced: 'sync.synced',
    'local-ahead': 'sync.pending',
    'drive-ahead': 'sync.pending',
    conflict: 'sync.error',
    'local-only': 'sync.localOnly',
    'drive-only': 'sync.driveOnly',
    syncing: 'sync.syncing',
    error: 'sync.error',
  };

  async function handleSyncNow() {
    if (!currentDocument || status === 'syncing') return;
    await syncDocument(currentDocument);
  }

  return (
    <button
      onClick={() => void handleSyncNow()}
      title={t(labelKey[status])}
      className={`rounded-md p-1.5 transition hover:bg-slate-100 dark:hover:bg-slate-700 ${colorClass}`}
      aria-label={t(labelKey[status])}
    >
      <Icon size={15} />
    </button>
  );
}
