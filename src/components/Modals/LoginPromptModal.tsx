import { ModalBase } from './ModalBase';
import { useUiStore } from '../../stores/uiStore';
import { useTranslation } from '../../hooks/useTranslation';
import { LoginButton } from '../Auth/LoginButton';

export function LoginPromptModal() {
  const closeModal = useUiStore((s) => s.closeModal);
  const { t } = useTranslation();

  return (
    <ModalBase title={t('auth.loginRequired')} onClose={closeModal} size="sm">
      <div className="flex flex-col items-center gap-5 text-center">
        <p className="text-sm text-slate-600 dark:text-slate-400">
          {t('auth.loginPromptDescription')}
        </p>
        <div className="flex flex-col gap-2 w-full">
          <LoginButton />
          <button
            onClick={closeModal}
            className="text-sm text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
          >
            {t('auth.continueOffline')}
          </button>
        </div>
      </div>
    </ModalBase>
  );
}
