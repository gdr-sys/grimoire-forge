import { TTRPG_FONTS } from './constants';

const loadedFamilies = new Set<string>();
const BASE_URL = 'https://fonts.googleapis.com/css2?';

export function loadFontFamily(familyId: string): void {
  if (loadedFamilies.has(familyId)) return;
  const font = TTRPG_FONTS.find((f) => f.id === familyId);
  if (!font) return;
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = `${BASE_URL}family=${font.googleFamily}&display=swap`;
  document.head.appendChild(link);
  loadedFamilies.add(familyId);
}

export function loadPresetFonts(fontFamilies: string[]): void {
  const families = fontFamilies
    .map((f) => TTRPG_FONTS.find((t) => t.name === f || t.id === f))
    .filter(Boolean)
    .filter((f) => !loadedFamilies.has(f!.id))
    .map((f) => f!.googleFamily);

  if (families.length === 0) return;
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = `${BASE_URL}${families.map((f) => `family=${f}`).join('&')}&display=swap`;
  document.head.appendChild(link);
  families.forEach((_, i) => {
    const font = TTRPG_FONTS.find((t) => t.googleFamily === families[i]);
    if (font) loadedFamilies.add(font.id);
  });
}
