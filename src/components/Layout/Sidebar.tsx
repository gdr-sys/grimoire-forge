import { useTranslation } from '../../hooks/useTranslation';
import { useUiStore } from '../../stores/uiStore';
import { BlocksPalette } from '../Panels/BlocksPalette';
import { PageManager } from '../Editor/PageManager';
import { PresetSelector } from '../Panels/PresetSelector';

const TABS = [
  { id: 'blocks', labelKey: 'editor.blocks' },
  { id: 'pages', labelKey: 'editor.pages' },
  { id: 'presets', labelKey: 'preset.title' },
] as const;

export function Sidebar() {
  const { t } = useTranslation();
  const activeTab = useUiStore((s) => s.activeSidebarTab);
  const setTab = useUiStore((s) => s.setActiveSidebarTab);
  const isSidebarOpen = useUiStore((s) => s.isSidebarOpen);

  if (!isSidebarOpen) return null;

  return (
    <aside className="flex w-64 shrink-0 flex-col border-r border-[--color-app-border] bg-[--color-app-sidebar] dark:border-[--color-dark-border] dark:bg-[--color-dark-sidebar]">
      {/* Tabs */}
      <div className="flex border-b border-[--color-app-border] dark:border-[--color-dark-border]">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setTab(tab.id)}
            className={`flex-1 py-2 text-xs font-medium transition ${
              activeTab === tab.id
                ? 'border-b-2 border-[--color-forge-purple] text-[--color-forge-purple]'
                : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            {t(tab.labelKey)}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="flex-1 overflow-y-auto scrollbar-thin">
        {activeTab === 'blocks' && <BlocksPalette />}
        {activeTab === 'pages' && <PageManager />}
        {activeTab === 'presets' && <PresetSelector />}
      </div>
    </aside>
  );
}
