import { useTranslation } from '../../hooks/useTranslation';
import { useUiStore } from '../../stores/uiStore';
import { usePages } from '../../hooks/usePages';
import type { PageSize, PageOrientation } from '../../types/page';

const SIZES: { id: PageSize; label: string; hint: string }[] = [
  { id: 'A4', label: 'A4', hint: '210 × 297 mm' },
  { id: 'A5', label: 'A5', hint: '148 × 210 mm' },
  { id: 'Letter', label: 'Letter', hint: '215.9 × 279.4 mm' },
  { id: 'Legal', label: 'Legal', hint: '215.9 × 355.6 mm' },
  { id: 'Tabloid', label: 'Tabloid', hint: '279.4 × 431.8 mm' },
];

export function PageSettings() {
  const { t } = useTranslation();
  const { pages, updatePage } = usePages();
  const activePageIndex = useUiStore((s) => s.activePageIndex);
  const page = pages[activePageIndex];

  if (!page) return null;

  function applyToAll(patch: Partial<typeof page>) {
    pages.forEach((p) => updatePage(p.id, patch));
  }

  return (
    <div className="flex flex-col gap-3 border-b border-[--color-app-border] p-3 dark:border-[--color-dark-border]">
      <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
        {t('page.size')}
      </span>

      <select
        value={page.size}
        onChange={(e) => updatePage(page.id, { size: e.target.value as PageSize })}
        className="input-xs"
      >
        {SIZES.map((s) => (
          <option key={s.id} value={s.id}>
            {s.label} — {s.hint}
          </option>
        ))}
      </select>

      <div className="flex items-center justify-between">
        <span className="text-xs text-slate-500 dark:text-slate-400">{t('page.orientation')}</span>
        <div className="flex gap-1">
          {(['portrait', 'landscape'] as PageOrientation[]).map((o) => (
            <button
              key={o}
              onClick={() => updatePage(page.id, { orientation: o })}
              className={`rounded-md border px-2 py-1 text-xs capitalize transition ${
                page.orientation === o
                  ? 'border-[--color-forge-purple] bg-[--color-forge-purple]/10 text-[--color-forge-purple]'
                  : 'border-[--color-app-border] text-slate-500 hover:bg-slate-100 dark:border-[--color-dark-border] dark:text-slate-400 dark:hover:bg-slate-700'
              }`}
            >
              {o === 'portrait' ? 'Verticale' : 'Orizzontale'}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-xs text-slate-500 dark:text-slate-400">{t('page.columns')}</span>
        <div className="flex gap-1">
          {[1, 2, 3].map((c) => (
            <button
              key={c}
              onClick={() => updatePage(page.id, { columns: c as 1 | 2 | 3 })}
              className={`h-6 w-6 rounded-md border text-xs transition ${
                page.columns === c
                  ? 'border-[--color-forge-purple] bg-[--color-forge-purple]/10 text-[--color-forge-purple]'
                  : 'border-[--color-app-border] text-slate-500 hover:bg-slate-100 dark:border-[--color-dark-border] dark:text-slate-400 dark:hover:bg-slate-700'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {pages.length > 1 && (
        <button
          onClick={() => applyToAll({ size: page.size, orientation: page.orientation, columns: page.columns })}
          className="text-xs text-[--color-forge-purple] hover:underline"
        >
          Applica a tutte le pagine
        </button>
      )}
    </div>
  );
}
