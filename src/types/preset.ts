import type { GameSystemId } from './gameSystem';

export type PresetId =
  | 'dnd5e-phb'
  | 'dnd5e-dmg'
  | 'dnd5e-mm'
  | 'dnd5e-tasha'
  | 'dnd5e-2024'
  | 'pathfinder2e'
  | 'pathfinder1e'
  | 'vampire-v5'
  | 'call-of-cthulhu'
  | 'shadowrun'
  | 'fate-core'
  | 'blades-in-dark'
  | 'mork-borg'
  | 'pirate-borg'
  | 'cy-borg'
  | 'mothership'
  | 'warhammer-frp'
  | 'swn'
  | 'wwn'
  | 'ose'
  | 'dungeon-world'
  | 'savage-worlds'
  | 'parchment-classic'
  | 'dark-grimoire'
  | 'modern-clean'
  | 'steampunk'
  | 'fey-enchanted'
  | 'nautical-pirate'
  | 'sci-fi-terminal'
  | 'horror-blood'
  | 'oriental-wuxia'
  | 'norse-viking'
  | 'custom-blank';

export interface HeadingStyle {
  fontFamily: string;
  fontSize: string;
  fontWeight: string;
  color: string;
  textTransform?: string;
  letterSpacing?: string;
  borderBottom?: string;
  marginBottom?: string;
}

export interface PageStyles {
  background: string;
  fontFamily: string;
  fontSize: string;
  lineHeight: number;
  color: string;
  columns: 1 | 2 | 3;
  columnGap: string;
  padding: { top: string; right: string; bottom: string; left: string };
}

export interface PresetStyles {
  page: PageStyles;
  headings: {
    h1: HeadingStyle;
    h2: HeadingStyle;
    h3: HeadingStyle;
    h4: HeadingStyle;
  };
  statBlock: Record<string, string>;
  note: Record<string, string>;
  quote: Record<string, string>;
  table: Record<string, string>;
  divider: Record<string, string>;
  dropCap: Record<string, string>;
  footer: Record<string, string>;
  decorations: Record<string, string>;
}

export interface Preset {
  id: PresetId;
  name_it: string;
  name_en: string;
  description_it: string;
  description_en: string;
  gameSystem: GameSystemId;
  preview: string;
  styles: PresetStyles;
  colorPalette: string[];
  cssFile: string;
}
