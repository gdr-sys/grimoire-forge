import { useEffect, useState } from 'react';
import { useDocumentStore } from '../stores/documentStore';
import { loadPreset } from '../lib/presetLoader';
import { loadPresetFonts } from '../lib/fontLoader';
import type { Preset } from '../types/preset';

export function usePreset() {
  const currentDocument = useDocumentStore((s) => s.currentDocument);
  const updatePreset = useDocumentStore((s) => s.updatePreset);
  const [preset, setPreset] = useState<Preset | null>(null);

  useEffect(() => {
    if (!currentDocument?.presetId) return;
    void loadPreset(currentDocument.presetId).then((p) => {
      if (!p) return;
      setPreset(p);
      const fonts = [
        p.styles.page.fontFamily,
        ...Object.values(p.styles.headings).map((h) => h.fontFamily),
      ].filter(Boolean);
      loadPresetFonts(fonts);
    });
  }, [currentDocument?.presetId]);

  return { preset, updatePreset };
}
