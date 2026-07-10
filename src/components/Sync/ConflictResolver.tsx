import { AlertTriangle } from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';
import { useSyncStore } from '../../stores/syncStore';

export function ConflictResolver() {
  const { t } = useTranslation();
  const pendingConflicts = useSyncStore((s) => s.pendingConflicts);
  const resolveConflict = useSyncStore((s) => s.resolveConflict);

  if (pendingConflicts.length === 0) return null;

  const conflict = pendingConflicts[0];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl dark:bg-slate-800">
        <div className="flex items-start gap-3">
          <AlertTriangle size={20} className="mt-0.5 shrink-0 text-orange-500" />
          <div>
            <h3 className="font-semibold text-slate-800 dark:text-slate-100">{t('conflict.title')}</h3>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{t('conflict.desc')}</p>
          </div>
        </div>
        <div className="mt-4 flex flex-col gap-2">
          <button
            onClick={() => resolveConflict(conflict.documentId)}
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium hover:bg-slate-50 dark:border-slate-600 dark:hover:bg-slate-700"
          >
            {t('conflict.keepLocal')}
          </button>
          <button
            onClick={() => resolveConflict(conflict.documentId)}
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium hover:bg-slate-50 dark:border-slate-600 dark:hover:bg-slate-700"
          >
            {t('conflict.keepDrive')}
          </button>
          <button
            onClick={() => resolveConflict(conflict.documentId)}
            className="rounded-lg bg-[--color-forge-purple] px-3 py-2 text-sm font-medium text-white hover:bg-[--color-forge-purple-700]"
          >
            {t('conflict.duplicate')}
          </button>
        </div>
      </div>
    </div>
  );
}
