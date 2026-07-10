import { ModalBase } from './ModalBase';
import { useUiStore } from '../../stores/uiStore';
import { useTranslation } from '../../hooks/useTranslation';

export function PresetPreviewModal() {
  const closeModal = useUiStore((s) => s.closeModal);
  const { t } = useTranslation();

  return (
    <ModalBase title={t('presets.preview')} onClose={closeModal} size="xl">
      <div className="flex items-center justify-center h-64 text-slate-400 text-sm">
        Anteprima preset non ancora disponibile
      </div>
    </ModalBase>
  );
}
