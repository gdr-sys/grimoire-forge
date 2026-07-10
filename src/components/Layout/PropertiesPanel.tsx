import { X } from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';
import { useUiStore } from '../../stores/uiStore';
import { useDocumentStore } from '../../stores/documentStore';
import { StyleEditor } from '../Panels/StyleEditor';

export function PropertiesPanel() {
  const { t } = useTranslation();
  const selectedBlockId = useUiStore((s) => s.selectedBlockId);
  const setSelectedBlock = useUiStore((s) => s.setSelectedBlock);
  const isOpen = useUiStore((s) => s.isPropertiesPanelOpen);
  const togglePanel = useUiStore((s) => s.togglePropertiesPanel);
  const currentDocument = useDocumentStore((s) => s.currentDocument);

  const selectedBlock = selectedBlockId && currentDocument
    ? currentDocument.blocks[selectedBlockId]
    : null;

  if (!isOpen) return null;

  return (
    <aside className="flex w-72 shrink-0 flex-col border-l border-[--color-app-border] bg-[--color-app-sidebar] dark:border-[--color-dark-border] dark:bg-[--color-dark-sidebar]">
      <div className="flex h-10 items-center justify-between border-b border-[--color-app-border] px-3 dark:border-[--color-dark-border]">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          {t('props.title')}
        </h2>
        <button
          onClick={togglePanel}
          className="rounded p-0.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          aria-label="Chiudi pannello"
        >
          <X size={14} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-thin p-3">
        {selectedBlock ? (
          <StyleEditor />
        ) : (
          <div className="flex h-32 items-center justify-center text-center text-sm text-slate-400 dark:text-slate-500">
            Seleziona un blocco per modificarne le proprietà
          </div>
        )}
      </div>
    </aside>
  );
}
