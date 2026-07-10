import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Lang } from '../types/i18n';

interface SettingsState {
  lang: Lang;
  theme: 'light' | 'dark' | 'system';
  showKofi: boolean;
  autoSync: boolean;
  reducedMotion: boolean;
  setLang: (lang: Lang) => void;
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  toggleTheme: () => void;
  setShowKofi: (show: boolean) => void;
  setAutoSync: (auto: boolean) => void;
  setReducedMotion: (reduced: boolean) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      lang: 'it',
      theme: 'light',
      showKofi: true,
      autoSync: true,
      reducedMotion: false,
      setLang: (lang) => set({ lang }),
      setTheme: (theme) => set({ theme }),
      toggleTheme: () => set((s) => ({ theme: s.theme === 'light' ? 'dark' : 'light' })),
      setShowKofi: (showKofi) => set({ showKofi }),
      setAutoSync: (autoSync) => set({ autoSync }),
      setReducedMotion: (reducedMotion) => set({ reducedMotion }),
    }),
    {
      name: 'gf-settings',
    },
  ),
);
