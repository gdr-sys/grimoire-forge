import { WifiOff } from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';
import { useOnlineStatus } from '../../hooks/useOnlineStatus';

export function OfflineBanner() {
  const { t } = useTranslation();
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div
      role="status"
      className="flex items-center gap-2 bg-amber-50 px-4 py-1.5 text-xs text-amber-800 dark:bg-amber-950/50 dark:text-amber-200"
    >
      <WifiOff size={13} />
      <span>{t('offline.desc')}</span>
    </div>
  );
}
