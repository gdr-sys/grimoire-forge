interface QuoteBlockData {
  quote: string;
  attribution: string;
  variant: 'pullquote' | 'sidebar' | 'flavor';
}

interface Props {
  data: QuoteBlockData;
  isSelected: boolean;
  onChange: (patch: Partial<QuoteBlockData>) => void;
}

export function QuoteBlock({ data, isSelected, onChange }: Props) {
  const variantCls = {
    pullquote: 'border-l-4 border-[--color-forge-gold] pl-4 italic text-slate-600 dark:text-slate-400',
    sidebar: 'rounded-lg bg-[--color-forge-purple]/8 border border-[--color-forge-purple]/20 px-4 py-3',
    flavor: 'text-center italic text-slate-500 dark:text-slate-400',
  }[data.variant] ?? '';

  return (
    <blockquote className={variantCls}>
      <p
        contentEditable={isSelected}
        suppressContentEditableWarning
        onBlur={(e) => onChange({ quote: (e.target as HTMLElement).textContent ?? '' })}
        className="outline-none mb-1"
      >
        {data.quote || (isSelected ? '' : '"Testo della citazione…"')}
      </p>
      {(data.attribution || isSelected) && (
        <cite
          contentEditable={isSelected}
          suppressContentEditableWarning
          onBlur={(e) => onChange({ attribution: (e.target as HTMLElement).textContent ?? '' })}
          className="text-sm not-italic font-medium text-slate-500 dark:text-slate-400 outline-none block"
        >
          {data.attribution || (isSelected ? '— Attribuzione' : '')}
        </cite>
      )}
      {isSelected && (
        <div className="mt-2 flex gap-1">
          {(['pullquote', 'sidebar', 'flavor'] as const).map((v) => (
            <button
              key={v}
              onClick={() => onChange({ variant: v })}
              className={`rounded px-2 py-0.5 text-xs ${data.variant === v ? 'bg-[--color-forge-purple] text-white' : 'bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-400'}`}
            >
              {v}
            </button>
          ))}
        </div>
      )}
    </blockquote>
  );
}
