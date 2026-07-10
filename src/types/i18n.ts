export type Lang = 'it' | 'en';

// Resolved after locales are built — used for type-safe t() calls.
// TranslationKey is re-exported from src/locales/it to avoid duplication.
export type { Lang as I18nLang };
