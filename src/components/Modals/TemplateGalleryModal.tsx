import { ModalBase } from './ModalBase';
import { useUiStore } from '../../stores/uiStore';
import { useTranslation } from '../../hooks/useTranslation';

export function TemplateGalleryModal() {
  const closeModal = useUiStore((s) => s.closeModal);
  const { t } = useTranslation();

  return (
    <ModalBase title={t('templates.gallery')} onClose={closeModal} size="xl">
      <div className="flex items-center justify-center h-48 text-slate-400 text-sm">
        Galleria template in arrivo
      </div>
    </ModalBase>
  );
}
