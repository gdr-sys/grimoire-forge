import { X, Coffee } from 'lucide-react';
import { useSettingsStore } from '../../stores/settingsStore';
import { useTranslation } from '../../hooks/useTranslation';
import { KOFI_URL } from '../../lib/constants';

export function KoFiBanner() {
  const showKofi = useSettingsStore((s) => s.showKofi);
  const setShowKofi = useSettingsStore((s) => s.setShowKofi);
  const { t } = useTranslation();

  if (!showKofi) return null;

  return (
    <div className="relative flex items-center gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900 dark:border-amber-700/40 dark:bg-amber-900/20 dark:text-amber-200">
      <Coffee size={18} className="shrink-0 text-amber-600 dark:text-amber-400" />
      <p className="flex-1">
        {t('kofi.banner')}{' '}
        <a
          href={KOFI_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold underline hover:text-amber-700 dark:hover:text-amber-300"
        >
          Ko-fi
        </a>{' '}
        ☕
      </p>
      <button
        onClick={() => setShowKofi(false)}
        aria-label={t('common.close')}
        className="shrink-0 rounded p-0.5 hover:bg-amber-200 dark:hover:bg-amber-800/40"
      >
        <X size={14} />
      </button>
    </div>
  );
}
