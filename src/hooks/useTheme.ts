import { useSettingsStore } from '../stores/settingsStore';

export function useTheme() {
  return {
    theme: useSettingsStore((s) => s.theme),
    setTheme: useSettingsStore((s) => s.setTheme),
    toggleTheme: useSettingsStore((s) => s.toggleTheme),
  };
}
