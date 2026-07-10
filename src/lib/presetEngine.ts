import type { CSSProperties } from 'react';

interface HeadingStyle {
  fontFamily: string;
  fontSize: string;
  color: string;
  borderBottom: string;
}

export interface PresetData {
  id: string;
  name: string;
  styles: {
    pageBackground: string;
    pageFontFamily: string;
    pageFontSize: string;
    pageLineHeight: string;
    pageColor: string;
    headings: {
      h1: HeadingStyle;
      h2: HeadingStyle;
      h3: HeadingStyle;
    };
  };
}

const cache = new Map<string, PresetData | null>();

export async function loadPreset(id: string): Promise<PresetData | null> {
  if (cache.has(id)) return cache.get(id) ?? null;
  try {
    const res = await fetch(`/presets/${id}.json`);
    if (!res.ok) { cache.set(id, null); return null; }
    const data: PresetData = await res.json();
    cache.set(id, data);
    return data;
  } catch {
    cache.set(id, null);
    return null;
  }
}

export function presetToPageStyle(preset: PresetData | null): CSSProperties {
  if (!preset) return {};
  return {
    background: preset.styles.pageBackground,
    fontFamily: preset.styles.pageFontFamily,
    fontSize: preset.styles.pageFontSize,
    lineHeight: preset.styles.pageLineHeight,
    color: preset.styles.pageColor,
  };
}

export function presetHeadingStyle(preset: PresetData | null, level: 'h1' | 'h2' | 'h3'): CSSProperties {
  if (!preset?.styles.headings[level]) return {};
  const h = preset.styles.headings[level];
  return {
    fontFamily: h.fontFamily,
    fontSize: h.fontSize,
    color: h.color,
    borderBottom: h.borderBottom !== 'none' ? h.borderBottom : undefined,
  };
}

/** Inject preset heading styles into the document as a <style> tag. */
export function injectPresetStyles(presetId: string, preset: PresetData | null) {
  const existing = document.getElementById(`gf-preset-${presetId}`);
  if (existing) return;
  if (!preset) return;

  const s = preset.styles;
  const css = `
    [data-preset="${presetId}"] {
      background: ${s.pageBackground};
      font-family: ${s.pageFontFamily};
      font-size: ${s.pageFontSize};
      line-height: ${s.pageLineHeight};
      color: ${s.pageColor};
    }
    [data-preset="${presetId}"] h1 {
      font-family: ${s.headings.h1.fontFamily};
      font-size: ${s.headings.h1.fontSize};
      color: ${s.headings.h1.color};
      border-bottom: ${s.headings.h1.borderBottom};
    }
    [data-preset="${presetId}"] h2 {
      font-family: ${s.headings.h2.fontFamily};
      font-size: ${s.headings.h2.fontSize};
      color: ${s.headings.h2.color};
      border-bottom: ${s.headings.h2.borderBottom};
    }
    [data-preset="${presetId}"] h3 {
      font-family: ${s.headings.h3.fontFamily};
      font-size: ${s.headings.h3.fontSize};
      color: ${s.headings.h3.color};
      border-bottom: ${s.headings.h3.borderBottom};
    }
  `;

  const styleEl = document.createElement('style');
  styleEl.id = `gf-preset-${presetId}`;
  styleEl.textContent = css;
  document.head.appendChild(styleEl);
}
