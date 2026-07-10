export const APP_NAME = 'Grimoire Forge';
export const APP_VERSION = '1.0.0';
export const KOFI_URL = import.meta.env.VITE_KOFI_URL ?? 'https://ko-fi.com/noemimarcolini';
export const PORTFOLIO_URL = import.meta.env.VITE_PORTFOLIO_URL ?? 'https://gdr-sys-portfolio2026.vercel.app/';

export const DND5E_SIZES = ['Minuscola', 'Piccola', 'Media', 'Grande', 'Enorme', 'Mastodontica'] as const;
export const DND5E_SIZES_EN = ['Tiny', 'Small', 'Medium', 'Large', 'Huge', 'Gargantuan'] as const;

export const DND5E_CREATURE_TYPES_IT = [
  'Aberrazione', 'Bestia', 'Celestiale', 'Costrutto', 'Drago',
  'Elementale', 'Fatato', 'Folletto', 'Forma gassosa', 'Gigante',
  'Inumano', 'Mostruosità', 'Non morto', 'Ooze', 'Pianta', 'Umanoide',
] as const;

export const DND5E_ALIGNMENTS_IT = [
  'Legale Buono', 'Neutrale Buono', 'Caotico Buono',
  'Legale Neutrale', 'Neutrale', 'Caotico Neutrale',
  'Legale Malvagio', 'Neutrale Malvagio', 'Caotico Malvagio',
  'Non allineato', 'Qualsiasi allineamento',
] as const;

export const DND5E_CR_TABLE: Record<string, { xp: number; profBonus: number }> = {
  '0': { xp: 10, profBonus: 2 },
  '1/8': { xp: 25, profBonus: 2 },
  '1/4': { xp: 50, profBonus: 2 },
  '1/2': { xp: 100, profBonus: 2 },
  '1': { xp: 200, profBonus: 2 },
  '2': { xp: 450, profBonus: 2 },
  '3': { xp: 700, profBonus: 2 },
  '4': { xp: 1100, profBonus: 2 },
  '5': { xp: 1800, profBonus: 3 },
  '6': { xp: 2300, profBonus: 3 },
  '7': { xp: 2900, profBonus: 3 },
  '8': { xp: 3900, profBonus: 3 },
  '9': { xp: 5000, profBonus: 4 },
  '10': { xp: 5900, profBonus: 4 },
  '11': { xp: 7200, profBonus: 4 },
  '12': { xp: 8400, profBonus: 4 },
  '13': { xp: 10000, profBonus: 5 },
  '14': { xp: 11500, profBonus: 5 },
  '15': { xp: 13000, profBonus: 5 },
  '16': { xp: 15000, profBonus: 5 },
  '17': { xp: 18000, profBonus: 6 },
  '18': { xp: 20000, profBonus: 6 },
  '19': { xp: 22000, profBonus: 6 },
  '20': { xp: 25000, profBonus: 6 },
  '21': { xp: 33000, profBonus: 7 },
  '22': { xp: 41000, profBonus: 7 },
  '23': { xp: 50000, profBonus: 7 },
  '24': { xp: 62000, profBonus: 7 },
  '25': { xp: 75000, profBonus: 8 },
  '26': { xp: 90000, profBonus: 8 },
  '27': { xp: 105000, profBonus: 8 },
  '28': { xp: 120000, profBonus: 8 },
  '29': { xp: 135000, profBonus: 9 },
  '30': { xp: 155000, profBonus: 9 },
};

export const TTRPG_FONTS = [
  { id: 'cinzel', name: 'Cinzel', category: 'fantasy', googleFamily: 'Cinzel:wght@400;700;900' },
  { id: 'crimson-text', name: 'Crimson Text', category: 'serif', googleFamily: 'Crimson+Text:ital,wght@0,400;0,600;1,400' },
  { id: 'noto-sans', name: 'Noto Sans', category: 'sans', googleFamily: 'Noto+Sans:wght@400;700' },
  { id: 'noto-serif', name: 'Noto Serif', category: 'serif', googleFamily: 'Noto+Serif:wght@400;700' },
  { id: 'courier-prime', name: 'Courier Prime', category: 'mono', googleFamily: 'Courier+Prime:ital,wght@0,400;0,700;1,400' },
  { id: 'unifraktur-maguntia', name: 'UnifrakturMaguntia', category: 'gothic', googleFamily: 'UnifrakturMaguntia' },
  { id: 'special-elite', name: 'Special Elite', category: 'typewriter', googleFamily: 'Special+Elite' },
  { id: 'pirata-one', name: 'Pirata One', category: 'fantasy', googleFamily: 'Pirata+One' },
  { id: 'im-fell-english', name: 'IM Fell English', category: 'gothic', googleFamily: 'IM+Fell+English:ital@0;1' },
  { id: 'spectral', name: 'Spectral', category: 'serif', googleFamily: 'Spectral:ital,wght@0,400;0,700;1,400' },
  { id: 'alegreya', name: 'Alegreya', category: 'serif', googleFamily: 'Alegreya:ital,wght@0,400;0,700;1,400' },
  { id: 'vollkorn', name: 'Vollkorn', category: 'serif', googleFamily: 'Vollkorn:ital,wght@0,400;0,700;1,400' },
] as const;

export const DEBOUNCE_AUTOSAVE_MS = 2000;
export const DEBOUNCE_STYLE_INPUT_MS = 200;
export const MAX_ZOOM = 3;
export const MIN_ZOOM = 0.25;
export const ZOOM_STEP = 0.1;
