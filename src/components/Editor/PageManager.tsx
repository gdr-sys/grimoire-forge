import { Plus, Trash2, Copy } from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';
import { usePages } from '../../hooks/usePages';
import { useUiStore } from '../../stores/uiStore';

export function PageManager() {
  const { t } = useTranslation();
  const { pages, addPage, removePage } = usePages();
  const activePageIndex = useUiStore((s) => s.activePageIndex);
  const setActivePageIndex = useUiStore((s) => s.setActivePageIndex);

  return (
    <div className="flex flex-col gap-1 p-3">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          {t('editor.pages')}
        </span>
        <button
          onClick={addPage}
          className="rounded p-0.5 text-slate-400 hover:bg-slate-100 hover:text-[--color-forge-purple] dark:hover:bg-slate-700"
          title={t('page.add')}
        >
          <Plus size={14} />
        </button>
      </div>

      {pages.map((page, idx) => (
        <button
          key={page.id}
          onClick={() => setActivePageIndex(idx)}
          className={`group flex w-full items-center justify-between rounded-md px-2 py-1.5 text-left text-sm transition ${
            idx === activePageIndex
              ? 'bg-[--color-forge-purple-100] text-[--color-forge-purple] dark:bg-[--color-forge-purple]/20'
              : 'text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700'
          }`}
        >
          <span className="truncate">{t('page.number').replace('{n}', String(idx + 1))}</span>
          <div className="hidden items-center gap-0.5 group-hover:flex">
            <span
              onClick={(e) => { e.stopPropagation(); removePage(page.id); }}
              className="cursor-pointer rounded p-0.5 hover:text-red-500"
              title={t('page.delete')}
            >
              <Trash2 size={11} />
            </span>
          </div>
        </button>
      ))}

      {pages.length === 0 && (
        <button
          onClick={addPage}
          className="flex w-full items-center justify-center gap-1 rounded-md border border-dashed border-slate-300 py-3 text-sm text-slate-400 hover:border-[--color-forge-purple] hover:text-[--color-forge-purple] dark:border-slate-600"
        >
          <Plus size={14} />
          {t('page.add')}
        </button>
      )}
    </div>
  );
}
