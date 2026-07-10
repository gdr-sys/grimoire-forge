import type { SpellBlockData } from '../../types/block';

interface Props {
  data: SpellBlockData;
  isSelected: boolean;
  onChange: (patch: Partial<SpellBlockData>) => void;
}

const SCHOOLS = ['Ammaliamento', 'Divinazione', 'Evocazione', 'Illusione', 'Invocazione', 'Necromanzia', 'Trasmutazione', 'Abiauration'];
const LEVELS_LABEL = ['Trucchetto', '1°', '2°', '3°', '4°', '5°', '6°', '7°', '8°', '9°'];

function Field({ label, value, isSelected, onChange }: { label: string; value: string; isSelected: boolean; onChange: (v: string) => void }) {
  if (!isSelected) return <p className="text-sm"><strong>{label}:</strong> {value}</p>;
  return (
    <div className="flex items-center gap-2 text-sm">
      <span className="w-28 shrink-0 font-semibold text-slate-600 dark:text-slate-400">{label}</span>
      <input value={value} onChange={(e) => onChange(e.target.value)} className="flex-1 rounded border border-slate-200 bg-transparent px-1 py-0.5 text-sm outline-none focus:border-[--color-forge-purple] dark:border-slate-600" />
    </div>
  );
}

export function SpellBlock({ data, isSelected, onChange }: Props) {
  const levelLabel = data.level === 0 ? 'Trucchetto' : `Incantesimo di ${LEVELS_LABEL[data.level]} livello`;

  return (
    <div className="rounded-lg border border-[--color-forge-purple]/30 bg-[--color-forge-purple]/5 p-3 text-sm dark:bg-[--color-forge-purple]/10">
      {/* Header */}
      <div className="mb-2 border-b border-[--color-forge-purple]/20 pb-2">
        {isSelected ? (
          <input
            value={data.name}
            onChange={(e) => onChange({ name: e.target.value })}
            className="mb-0.5 w-full bg-transparent text-lg font-bold outline-none"
            placeholder="Nome incantesimo"
          />
        ) : (
          <h3 className="text-lg font-bold text-[--color-forge-purple]">{data.name}</h3>
        )}
        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
          {isSelected ? (
            <>
              <select value={data.level} onChange={(e) => onChange({ level: Number(e.target.value) })} className="bg-transparent text-xs outline-none">
                {LEVELS_LABEL.map((l, i) => <option key={i} value={i}>{l}</option>)}
              </select>
              <span>·</span>
              <select value={data.school} onChange={(e) => onChange({ school: e.target.value })} className="bg-transparent text-xs outline-none">
                {SCHOOLS.map((s) => <option key={s}>{s}</option>)}
              </select>
            </>
          ) : (
            <span>{levelLabel} · {data.school}</span>
          )}
        </div>
      </div>

      {/* Properties */}
      <div className="mb-2 flex flex-col gap-0.5">
        <Field label="Tempo di lancio" value={data.castingTime} isSelected={isSelected} onChange={(v) => onChange({ castingTime: v })} />
        <Field label="Gittata" value={data.range} isSelected={isSelected} onChange={(v) => onChange({ range: v })} />
        <Field label="Componenti" value={data.components} isSelected={isSelected} onChange={(v) => onChange({ components: v })} />
        <Field label="Durata" value={data.duration} isSelected={isSelected} onChange={(v) => onChange({ duration: v })} />
      </div>

      {/* Description */}
      <div className="border-t border-[--color-forge-purple]/20 pt-2">
        <div
          contentEditable={isSelected}
          suppressContentEditableWarning
          onBlur={(e) => onChange({ description: (e.target as HTMLElement).textContent ?? '' })}
          className="outline-none"
        >
          {data.description}
        </div>
        {(data.atHigherLevels || isSelected) && (
          <div className="mt-1">
            <p className="font-semibold text-xs">A livelli superiori.</p>
            <div
              contentEditable={isSelected}
              suppressContentEditableWarning
              onBlur={(e) => onChange({ atHigherLevels: (e.target as HTMLElement).textContent ?? '' })}
              className="outline-none text-xs text-slate-600 dark:text-slate-400"
            >
              {data.atHigherLevels}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
