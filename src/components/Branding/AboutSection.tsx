import { APP_NAME, APP_VERSION, KOFI_URL, PORTFOLIO_URL } from '../../lib/constants';
import { useTranslation } from '../../hooks/useTranslation';

export function AboutSection() {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-3 text-sm text-slate-600 dark:text-slate-400">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[--color-forge-purple] text-white text-lg">
          📖
        </div>
        <div>
          <p className="font-semibold text-slate-800 dark:text-slate-100">{APP_NAME}</p>
          <p className="text-xs">v{APP_VERSION}</p>
        </div>
      </div>
      <p>{t('about.description')}</p>
      <div className="flex gap-3 text-xs">
        <a href={KOFI_URL} target="_blank" rel="noopener noreferrer" className="text-[--color-forge-purple] hover:underline">
          ☕ Ko-fi
        </a>
        <a href={PORTFOLIO_URL} target="_blank" rel="noopener noreferrer" className="text-[--color-forge-purple] hover:underline">
          🌐 Portfolio
        </a>
      </div>
    </div>
  );
}
