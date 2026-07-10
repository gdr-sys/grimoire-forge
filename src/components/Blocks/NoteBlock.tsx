import type { NoteBlockData } from '../../types/block';

interface Props {
  data: NoteBlockData;
  isSelected: boolean;
  onChange: (patch: Partial<NoteBlockData>) => void;
}

const VARIANTS: NoteBlockData['variant'][] = ['info', 'tip', 'warning', 'danger', 'custom'];

const VARIANT_STYLES: Record<NoteBlockData['variant'], string> = {
  info:    'border-blue-400 bg-blue-50 dark:bg-blue-950/30',
  tip:     'border-emerald-400 bg-emerald-50 dark:bg-emerald-950/30',
  warning: 'border-amber-400 bg-amber-50 dark:bg-amber-950/30',
  danger:  'border-red-400 bg-red-50 dark:bg-red-950/30',
  custom:  'border-slate-400 bg-slate-50 dark:bg-slate-800',
};

const VARIANT_ICONS: Record<NoteBlockData['variant'], string> = {
  info: 'ℹ️', tip: '💡', warning: '⚠️', danger: '🔴', custom: '📌',
};

export function NoteBlock({ data, isSelected, onChange }: Props) {
  return (
    <div className={`rounded-md border-l-4 px-4 py-3 text-sm ${VARIANT_STYLES[data.variant]}`}>
      <div className="flex items-center gap-2 mb-1">
        <span aria-hidden>{VARIANT_ICONS[data.variant]}</span>
        <span
          contentEditable={isSelected}
          suppressContentEditableWarning
          onBlur={(e) => onChange({ title: (e.target as HTMLElement).textContent ?? '' })}
          className="font-semibold outline-none"
        >
          {data.title}
        </span>
      </div>
      <div
        contentEditable={isSelected}
        suppressContentEditableWarning
        onBlur={(e) => onChange({ html: (e.target as HTMLElement).innerHTML })}
        dangerouslySetInnerHTML={{ __html: data.html }}
        className="outline-none"
      />
      {isSelected && (
        <div className="mt-2 flex flex-wrap gap-1 border-t border-black/5 pt-2">
          {VARIANTS.map((v) => (
            <button
              key={v}
              onClick={() => onChange({ variant: v })}
              className={`rounded px-2 py-0.5 text-xs capitalize ${data.variant === v ? 'bg-[--color-forge-purple] text-white' : 'bg-white/60 text-slate-600 dark:bg-slate-700 dark:text-slate-300'}`}
            >
              {v}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
