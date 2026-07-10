import { ModalBase } from './ModalBase';
import { useUiStore } from '../../stores/uiStore';
import { useSettingsStore } from '../../stores/settingsStore';
import { useTranslation } from '../../hooks/useTranslation';
import type { Lang } from '../../types/i18n';

export function SettingsModal() {
  const closeModal = useUiStore((s) => s.closeModal);
  const { t } = useTranslation();
  const lang = useSettingsStore((s) => s.lang);
  const setLang = useSettingsStore((s) => s.setLang);
  const theme = useSettingsStore((s) => s.theme);
  const setTheme = useSettingsStore((s) => s.setTheme);
  const autoSync = useSettingsStore((s) => s.autoSync);
  const setAutoSync = useSettingsStore((s) => s.setAutoSync);

  return (
    <ModalBase title={t('settings.title')} onClose={closeModal}>
      <div className="flex flex-col gap-5 text-sm">
        <Row label={t('settings.language')}>
          <div className="flex gap-2">
            {(['it', 'en'] as Lang[]).map((l) => (
              <button
                key={l}
                onClick={() => setLang(l)}
                className={`rounded-full px-3 py-1 text-xs ${lang === l ? 'bg-[--color-forge-purple] text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300'}`}
              >
                {l === 'it' ? '🇮🇹 Italiano' : '🇬🇧 English'}
              </button>
            ))}
          </div>
        </Row>

        <Row label={t('settings.theme')}>
          <div className="flex gap-2">
            {(['light', 'dark', 'system'] as const).map((th) => (
              <button
                key={th}
                onClick={() => setTheme(th)}
                className={`rounded-full px-3 py-1 text-xs capitalize ${theme === th ? 'bg-[--color-forge-purple] text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300'}`}
              >
                {th === 'light' ? '☀️ Chiaro' : th === 'dark' ? '🌙 Scuro' : '💻 Sistema'}
              </button>
            ))}
          </div>
        </Row>

        <Row label={t('settings.autoSync')}>
          <button
            role="switch"
            aria-checked={autoSync}
            onClick={() => setAutoSync(!autoSync)}
            className={`relative inline-flex h-5 w-9 items-center rounded-full transition ${autoSync ? 'bg-[--color-forge-purple]' : 'bg-slate-200 dark:bg-slate-600'}`}
          >
            <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition ${autoSync ? 'translate-x-4' : 'translate-x-0.5'}`} />
          </button>
        </Row>
      </div>
    </ModalBase>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-slate-600 dark:text-slate-400">{label}</span>
      {children}
    </div>
  );
}
