import type { BlockStyle } from './style';
import type { ImageBlockData } from './image';

export type BlockType =
  | 'text'
  | 'heading'
  | 'statblock-dnd5e'
  | 'statblock-dnd5e-2024'
  | 'statblock-pf2e'
  | 'statblock-pf1e'
  | 'statblock-generic'
  | 'statblock-vampire'
  | 'statblock-coc'
  | 'statblock-morkborg'
  | 'statblock-mothership'
  | 'spell'
  | 'item'
  | 'note'
  | 'quote'
  | 'table'
  | 'random-table'
  | 'image'
  | 'divider'
  | 'class-feature'
  | 'race'
  | 'background'
  | 'feat'
  | 'encounter'
  | 'drop-cap'
  | 'sidebar'
  | 'cover-page'
  | 'toc'
  | 'footer'
  | 'header'
  | 'watermark'
  | 'page-break'
  | 'column-break'
  | 'spacer'
  | 'two-column-compare'
  | 'timeline'
  | 'flowchart'
  | 'map-legend'
  | 'rumors-table'
  | 'shop-inventory'
  | 'faction'
  | 'settlement'
  | 'clock'
  | 'playbook'
  | 'custom-html';

export type HeadingLevel = 'h1' | 'h2' | 'h3' | 'h4';

export interface TextBlockData {
  html: string;
}

export interface HeadingBlockData {
  level: HeadingLevel;
  text: string;
  showDropCap: boolean;
}

export interface StatBlockDnD5eData {
  name: string;
  size: string;
  type: string;
  subtype: string;
  alignment: string;
  ac: number;
  acType: string;
  hp: number;
  hpFormula: string;
  speed: { walk: number; fly: number; swim: number; burrow: number; climb: number };
  str: number; dex: number; con: number; int: number; wis: number; cha: number;
  savingThrows: string[];
  skills: string[];
  damageVulnerabilities: string[];
  damageResistances: string[];
  damageImmunities: string[];
  conditionImmunities: string[];
  senses: string;
  languages: string;
  cr: string;
  traits: { name: string; desc: string }[];
  actions: { name: string; desc: string }[];
  bonusActions: { name: string; desc: string }[];
  reactions: { name: string; desc: string }[];
  legendaryActions: { name: string; desc: string }[];
  lairActions: { name: string; desc: string }[];
  regionalEffects: { name: string; desc: string }[];
  flavorText: string;
}

export interface SpellBlockData {
  name: string;
  level: number;
  school: string;
  castingTime: string;
  range: string;
  components: string;
  duration: string;
  description: string;
  atHigherLevels: string;
  classes: string[];
}

export interface ItemBlockData {
  name: string;
  type: string;
  rarity: string;
  requiresAttunement: boolean;
  attunementBy: string;
  properties: string[];
  description: string;
  flavorText: string;
}

export interface NoteBlockData {
  variant: 'info' | 'tip' | 'warning' | 'danger' | 'custom';
  title: string;
  html: string;
  customColor: string;
  customIcon: string;
}

export interface TableBlockData {
  headers: string[];
  rows: string[][];
  caption: string;
  striped: boolean;
  bordered: boolean;
  compact: boolean;
}

export interface DividerBlockData {
  style: string;
  color: string;
  thickness: number;
}

export interface SpacerBlockData {
  height: number;
}

export interface CustomHtmlBlockData {
  html: string;
  css: string;
}

export interface CoverPageBlockData {
  title: string;
  subtitle: string;
  author: string;
  system: string;
  imageUrl: string | null;
  imageId: string | null;
}

export interface WatermarkBlockData {
  assetId: string;
  opacity: number;
}

export type BlockData =
  | TextBlockData
  | HeadingBlockData
  | StatBlockDnD5eData
  | SpellBlockData
  | ItemBlockData
  | NoteBlockData
  | TableBlockData
  | DividerBlockData
  | SpacerBlockData
  | ImageBlockData
  | CustomHtmlBlockData
  | CoverPageBlockData
  | WatermarkBlockData
  | Record<string, unknown>;

export interface Block {
  id: string;
  type: BlockType;
  data: BlockData;
  style: BlockStyle;
}
