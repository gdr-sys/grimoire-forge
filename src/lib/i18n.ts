import {
  createElement,
  createContext,
  useCallback,
  useContext,
  type ReactNode,
} from 'react';
import it from '../locales/it';
import en from '../locales/en';
import { useSettingsStore } from '../stores/settingsStore';
import type { Lang } from '../types/i18n';

export type { Lang };
export type TranslationKey = keyof typeof it;

type Locales = { it: typeof it; en: typeof en };
const locales: Locales = { it, en };

export interface I18nContextValue {
  lang: Lang;
  setLanguage: (lang: Lang) => void;
  t: (key: string, params?: Record<string, string>) => string;
}

export const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const lang = useSettingsStore((s) => s.lang);
  const setLang = useSettingsStore((s) => s.setLang);

  const t = useCallback(
    (key: string, params?: Record<string, string>): string => {
      const map = locales[lang] as Record<string, string>;
      const fallback = locales.it as Record<string, string>;
      let str = map[key] ?? fallback[key] ?? key;
      if (params) {
        for (const [k, v] of Object.entries(params)) {
          str = str.replace(new RegExp(`\\{${k}\\}`, 'g'), v);
        }
      }
      return str;
    },
    [lang],
  );

  return createElement(I18nContext.Provider, { value: { lang, setLanguage: setLang, t } }, children);
}

export function useI18n(): I18nContextValue {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used within I18nProvider');
  return ctx;
}
