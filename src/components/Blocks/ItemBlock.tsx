import type { ItemBlockData } from '../../types/block';

interface Props {
  data: ItemBlockData;
  isSelected: boolean;
  onChange: (patch: Partial<ItemBlockData>) => void;
}

const RARITIES = ['Comune', 'Non comune', 'Raro', 'Molto raro', 'Leggendario', 'Artefatto'];

const RARITY_COLORS: Record<string, string> = {
  'Comune': 'text-slate-500',
  'Non comune': 'text-emerald-600',
  'Raro': 'text-blue-600',
  'Molto raro': 'text-purple-600',
  'Leggendario': 'text-amber-500',
  'Artefatto': 'text-red-600',
};

export function ItemBlock({ data, isSelected, onChange }: Props) {
  const rarityColor = RARITY_COLORS[data.rarity] ?? 'text-slate-500';

  return (
    <div className="rounded-lg border border-amber-200 bg-amber-50/60 p-3 dark:border-amber-800/40 dark:bg-amber-900/10">
      {/* Name */}
      {isSelected ? (
        <input
          value={data.name}
          onChange={(e) => onChange({ name: e.target.value })}
          className="mb-0.5 w-full bg-transparent text-base font-bold outline-none"
          placeholder="Nome oggetto"
        />
      ) : (
        <h3 className="text-base font-bold">{data.name}</h3>
      )}

      {/* Type & rarity */}
      <div className="mb-2 flex flex-wrap items-center gap-2 text-xs">
        {isSelected ? (
          <input
            value={data.type}
            onChange={(e) => onChange({ type: e.target.value })}
            className="flex-1 rounded border border-slate-200 bg-transparent px-1 py-0.5 outline-none dark:border-slate-600"
            placeholder="Tipo (es. Arma, Armatura…)"
          />
        ) : (
          <span className="text-slate-600 dark:text-slate-400">{data.type}</span>
        )}
        <span>·</span>
        {isSelected ? (
          <select value={data.rarity} onChange={(e) => onChange({ rarity: e.target.value })} className={`bg-transparent text-xs font-semibold outline-none ${rarityColor}`}>
            {RARITIES.map((r) => <option key={r}>{r}</option>)}
          </select>
        ) : (
          <span className={`font-semibold ${rarityColor}`}>{data.rarity}</span>
        )}
      </div>

      {/* Attunement */}
      <div className="mb-2 text-xs italic text-slate-500">
        {isSelected ? (
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={data.requiresAttunement} onChange={(e) => onChange({ requiresAttunement: e.target.checked })} />
            Richiede sintonizzazione
            {data.requiresAttunement && (
              <input value={data.attunementBy} onChange={(e) => onChange({ attunementBy: e.target.value })} className="ml-1 flex-1 border-b border-slate-200 bg-transparent outline-none dark:border-slate-600" placeholder="da parte di…" />
            )}
          </label>
        ) : (
          data.requiresAttunement && (
            <p>Richiede sintonizzazione{data.attunementBy ? ` da parte di ${data.attunementBy}` : ''}</p>
          )
        )}
      </div>

      {/* Description */}
      <div
        contentEditable={isSelected}
        suppressContentEditableWarning
        onBlur={(e) => onChange({ description: (e.target as HTMLElement).innerHTML })}
        dangerouslySetInnerHTML={{ __html: data.description }}
        className="text-sm outline-none"
      />

      {/* Flavor text */}
      {(data.flavorText || isSelected) && (
        <div
          contentEditable={isSelected}
          suppressContentEditableWarning
          onBlur={(e) => onChange({ flavorText: (e.target as HTMLElement).textContent ?? '' })}
          className="mt-2 border-t border-amber-200 pt-2 text-xs italic text-slate-500 outline-none dark:border-amber-800/40"
        >
          {data.flavorText || (isSelected ? 'Testo flavour…' : '')}
        </div>
      )}
    </div>
  );
}
