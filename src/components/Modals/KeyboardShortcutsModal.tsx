import { ModalBase } from './ModalBase';
import { useUiStore } from '../../stores/uiStore';
import { useTranslation } from '../../hooks/useTranslation';

const SHORTCUTS = [
  { key: 'Ctrl+Z', label: 'Annulla' },
  { key: 'Ctrl+Y', label: 'Ripristina' },
  { key: 'Ctrl+S', label: 'Salva manualmente' },
  { key: 'Ctrl++', label: 'Zoom in' },
  { key: 'Ctrl+-', label: 'Zoom out' },
  { key: 'Ctrl+0', label: 'Zoom 100%' },
  { key: 'Ctrl+P', label: 'Stampa / Esporta PDF' },
  { key: 'Canc', label: 'Elimina blocco selezionato' },
  { key: 'Esc', label: 'Deseleziona / Chiudi' },
  { key: 'Ctrl+/', label: 'Mostra scorciatoie' },
];

export function KeyboardShortcutsModal() {
  const closeModal = useUiStore((s) => s.closeModal);
  const { t } = useTranslation();

  return (
    <ModalBase title={t('shortcuts.title')} onClose={closeModal} size="sm">
      <div className="flex flex-col gap-1">
        {SHORTCUTS.map((s) => (
          <div key={s.key} className="flex items-center justify-between py-1.5 text-sm">
            <span className="text-slate-600 dark:text-slate-400">{s.label}</span>
            <kbd className="rounded border border-[--color-app-border] bg-slate-50 px-2 py-0.5 font-mono text-xs dark:border-[--color-dark-border] dark:bg-slate-800">
              {s.key}
            </kbd>
          </div>
        ))}
      </div>
    </ModalBase>
  );
}
