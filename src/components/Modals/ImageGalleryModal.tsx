import { ModalBase } from './ModalBase';
import { useUiStore } from '../../stores/uiStore';
import { useTranslation } from '../../hooks/useTranslation';

export function ImageGalleryModal() {
  const closeModal = useUiStore((s) => s.closeModal);
  const { t } = useTranslation();

  return (
    <ModalBase title={t('images.gallery')} onClose={closeModal} size="xl">
      <div className="flex items-center justify-center h-48 text-slate-400 text-sm">
        Galleria immagini in arrivo
      </div>
    </ModalBase>
  );
}
