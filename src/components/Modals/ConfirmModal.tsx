import { ModalBase } from './ModalBase';
import { useUiStore } from '../../stores/uiStore';
import { useTranslation } from '../../hooks/useTranslation';

export function ConfirmModal() {
  const closeModal = useUiStore((s) => s.closeModal);
  const modalData = useUiStore((s) => s.confirmOptions);
  const { t } = useTranslation();

  if (!modalData) return null;

  function handleConfirm() {
    modalData!.onConfirm();
    closeModal();
  }

  return (
    <ModalBase title={t('confirm.title')} onClose={closeModal} size="sm">
      <div className="flex flex-col gap-4">
        <p className="text-sm text-slate-600 dark:text-slate-400">{modalData.message}</p>
        <div className="flex justify-end gap-2">
          <button
            onClick={closeModal}
            className="rounded-lg border border-[--color-app-border] px-4 py-1.5 text-sm hover:bg-slate-50 dark:border-[--color-dark-border] dark:hover:bg-slate-700"
          >
            {t('common.cancel')}
          </button>
          <button
            onClick={handleConfirm}
            className={`rounded-lg px-4 py-1.5 text-sm font-semibold text-white ${modalData.danger ? 'bg-red-500 hover:bg-red-600' : 'bg-[--color-forge-purple] hover:opacity-90'}`}
          >
            {modalData.confirmLabel ?? t('confirm.ok')}
          </button>
        </div>
      </div>
    </ModalBase>
  );
}
