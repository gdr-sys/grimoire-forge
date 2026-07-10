import type { Preset, PresetId } from '../types/preset';
import type { Lang } from './i18n';

const presetCache = new Map<PresetId, Preset>();

export async function loadPreset(id: PresetId): Promise<Preset | null> {
  if (presetCache.has(id)) return presetCache.get(id)!;
  try {
    const res = await fetch(`/presets/${id}.json`);
    if (!res.ok) return null;
    const preset = (await res.json()) as Preset;
    presetCache.set(id, preset);
    return preset;
  } catch {
    return null;
  }
}

export async function listPresets(): Promise<PresetId[]> {
  return [
    'dnd5e-phb', 'dnd5e-dmg', 'dnd5e-mm', 'dnd5e-tasha', 'dnd5e-2024',
    'pathfinder2e', 'pathfinder1e', 'vampire-v5', 'call-of-cthulhu',
    'shadowrun', 'fate-core', 'blades-in-dark', 'mork-borg', 'pirate-borg',
    'cy-borg', 'mothership', 'warhammer-frp', 'swn', 'wwn', 'ose',
    'dungeon-world', 'savage-worlds', 'parchment-classic', 'dark-grimoire',
    'modern-clean', 'steampunk', 'fey-enchanted', 'nautical-pirate',
    'sci-fi-terminal', 'horror-blood', 'oriental-wuxia', 'norse-viking',
    'custom-blank',
  ];
}

export function getPresetName(preset: Preset, lang: Lang): string {
  return lang === 'en' ? preset.name_en : preset.name_it;
}

export function getPresetDescription(preset: Preset, lang: Lang): string {
  return lang === 'en' ? preset.description_en : preset.description_it;
}
