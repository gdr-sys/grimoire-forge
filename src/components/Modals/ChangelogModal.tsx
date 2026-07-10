import { ModalBase } from './ModalBase';
import { useUiStore } from '../../stores/uiStore';
import { useTranslation } from '../../hooks/useTranslation';
import { APP_VERSION } from '../../lib/constants';

export function ChangelogModal() {
  const closeModal = useUiStore((s) => s.closeModal);
  const { t } = useTranslation();

  return (
    <ModalBase title={`Novità — v${APP_VERSION}`} onClose={closeModal} size="md">
      <div className="flex flex-col gap-3 text-sm text-slate-600 dark:text-slate-400">
        <div>
          <p className="font-semibold text-slate-800 dark:text-slate-100 mb-1">v0.1.0 — Rilascio iniziale</p>
          <ul className="list-disc list-inside space-y-0.5 text-xs">
            <li>Editor visuale drag & drop</li>
            <li>Supporto preset D&D 5e e Pergamena Classica</li>
            <li>Sincronizzazione Google Drive opzionale</li>
            <li>Modalità offline completa con IndexedDB</li>
            <li>Esportazione PDF, PNG, HTML, JSON</li>
            <li>Interfaccia in italiano e inglese</li>
          </ul>
        </div>
      </div>
    </ModalBase>
  );
}
