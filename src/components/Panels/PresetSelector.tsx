import { useState } from 'react';
import { Check, Eye } from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';
import { useDocumentStore } from '../../stores/documentStore';

interface PresetOption {
  id: string;
  label: string;
  description: string;
  thumbnail?: string;
  gameSystem?: string;
}

const PRESET_OPTIONS: PresetOption[] = [
  { id: 'dnd5e-phb', label: 'D&D 5e PHB', description: "Stile del Player's Handbook", gameSystem: 'dnd5e' },
  { id: 'parchment-classic', label: 'Pergamena Classica', description: 'Sfondo pergamena con font serif' },
  { id: 'dark-tome', label: 'Tomo Oscuro', description: 'Sfondo scuro con testo dorato' },
  { id: 'pathfinder2', label: 'Pathfinder 2e', description: 'Stile Pathfinder Society', gameSystem: 'pathfinder2' },
  { id: 'custom-blank', label: 'Foglio Bianco', description: 'Senza stile predefinito' },
  { id: 'call-of-cthulhu', label: 'Call of Cthulhu', description: 'Stile anni \'30, horror cosmico', gameSystem: 'coc7' },
  { id: 'shadowrun', label: 'Shadowrun', description: 'Estetica cyberpunk', gameSystem: 'shadowrun6' },
  { id: 'fate-core', label: 'FATE Core', description: 'Pulito e minimalista', gameSystem: 'fate' },
];

export function PresetSelector() {
  const { t } = useTranslation();
  const currentDocument = useDocumentStore((s) => s.currentDocument);
  const updateDocument = useDocumentStore((s) => s.updateDocument);
  const [previewing, setPreviewing] = useState<string | null>(null);

  const currentPreset = currentDocument?.presetId ?? 'custom-blank';

  function handleSelect(presetId: string) {
    if (!currentDocument) return;
    updateDocument({ presetId: presetId as typeof currentDocument.presetId });
  }

  return (
    <div className="flex flex-col gap-1 p-3">
      <p className="mb-2 text-xs text-slate-500 dark:text-slate-400">
        {t('presets.description')}
      </p>

      {PRESET_OPTIONS.map((preset) => {
        const isActive = currentPreset === preset.id;
        return (
          <button
            key={preset.id}
            onClick={() => handleSelect(preset.id)}
            className={`group flex w-full items-center justify-between rounded-md border px-3 py-2 text-left text-sm transition ${
              isActive
                ? 'border-[--color-forge-purple] bg-[--color-forge-purple]/5 text-[--color-forge-purple] dark:bg-[--color-forge-purple]/10'
                : 'border-[--color-app-border] text-slate-700 hover:border-slate-300 hover:bg-slate-50 dark:border-[--color-dark-border] dark:text-slate-300 dark:hover:bg-slate-700/40'
            }`}
          >
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <span className="truncate font-medium">{preset.label}</span>
                {preset.gameSystem && (
                  <span className="shrink-0 rounded bg-slate-100 px-1 text-[10px] text-slate-500 dark:bg-slate-700 dark:text-slate-400">
                    {preset.gameSystem}
                  </span>
                )}
              </div>
              <p className="mt-0.5 truncate text-xs text-slate-400 dark:text-slate-500">
                {preset.description}
              </p>
            </div>
            <div className="ml-2 shrink-0">
              {isActive ? (
                <Check size={14} className="text-[--color-forge-purple]" />
              ) : (
                <Eye
                  size={13}
                  className="opacity-0 text-slate-400 group-hover:opacity-100"
                />
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
}
