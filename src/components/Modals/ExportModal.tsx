import { useState } from 'react';
import { ModalBase } from './ModalBase';
import { useUiStore } from '../../stores/uiStore';
import { useTranslation } from '../../hooks/useTranslation';
import { useExport } from '../../hooks/useExport';
import type { ExportFormat } from '../../types/export';

const FORMATS: { id: ExportFormat; label: string; icon: string; description: string }[] = [
  { id: 'pdf', label: 'PDF', icon: '📄', description: 'Stampa via browser (Ctrl+P)' },
  { id: 'png', label: 'PNG', icon: '🖼', description: 'Immagine ad alta risoluzione' },
  { id: 'html', label: 'HTML', icon: '🌐', description: 'File HTML con CSS inline' },
  { id: 'json', label: 'JSON', icon: '💾', description: 'Formato nativo Grimoire Forge' },
];

export function ExportModal() {
  const closeModal = useUiStore((s) => s.closeModal);
  const { t } = useTranslation();
  const { exportAs, isExporting } = useExport();
  const [selected, setSelected] = useState<ExportFormat>('pdf');

  return (
    <ModalBase title={t('export.title')} onClose={closeModal} size="sm">
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-2">
          {FORMATS.map((f) => (
            <button
              key={f.id}
              onClick={() => setSelected(f.id)}
              className={`flex flex-col items-center gap-1 rounded-lg border p-3 text-center transition ${selected === f.id ? 'border-[--color-forge-purple] bg-[--color-forge-purple]/5 text-[--color-forge-purple]' : 'border-[--color-app-border] hover:bg-slate-50 dark:border-[--color-dark-border] dark:hover:bg-slate-700/40'}`}
            >
              <span className="text-2xl">{f.icon}</span>
              <span className="font-semibold text-sm">{f.label}</span>
              <span className="text-[10px] text-slate-400 dark:text-slate-500">{f.description}</span>
            </button>
          ))}
        </div>

        <button
          onClick={() => exportAs(selected)}
          disabled={isExporting}
          className="w-full rounded-lg bg-[--color-forge-purple] py-2 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-50"
        >
          {isExporting ? t('export.exporting') : t('export.button')}
        </button>
      </div>
    </ModalBase>
  );
}
