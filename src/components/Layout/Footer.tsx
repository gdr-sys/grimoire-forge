import { Heart } from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';
import { KOFI_URL, PORTFOLIO_URL, APP_NAME, APP_VERSION } from '../../lib/constants';

export function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="border-t border-[--color-app-border] bg-[--color-app-sidebar] px-4 py-3 dark:border-[--color-dark-border] dark:bg-[--color-dark-sidebar]">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-2 text-xs text-slate-400 sm:flex-row sm:justify-between">
        <span>
          {APP_NAME} {APP_VERSION} — Creato con{' '}
          <Heart size={10} className="inline text-red-400" /> da{' '}
          <a href={KOFI_URL} target="_blank" rel="noopener noreferrer" className="text-[--color-forge-purple] hover:underline">
            Noemi Marcolini
          </a>
        </span>

        <div className="flex items-center gap-4">
          <a
            href={KOFI_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-[--color-kofi] transition hover:opacity-80"
          >
            ☕ {t('kofi.cta')}
          </a>
          <a
            href={PORTFOLIO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-400 transition hover:text-[--color-forge-purple]"
          >
            {t('portfolio.cta')} →
          </a>
        </div>
      </div>
    </footer>
  );
}
