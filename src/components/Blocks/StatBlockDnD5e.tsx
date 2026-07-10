import { useState } from 'react';
import { Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import type { StatBlockDnD5eData } from '../../types/block';

interface Props {
  data: StatBlockDnD5eData;
  isSelected: boolean;
  onChange: (patch: Partial<StatBlockDnD5eData>) => void;
}

function abilityMod(score: number) {
  const mod = Math.floor((score - 10) / 2);
  return mod >= 0 ? `+${mod}` : `${mod}`;
}

// ─── Sub-components ───────────────────────────────────────────────

function AbilityScore({ label, score, isSelected, onChange }: { label: string; score: number; isSelected: boolean; onChange: (v: number) => void }) {
  return (
    <div className="flex flex-col items-center">
      <span className="text-[10px] font-bold uppercase text-[#7a200d]">{label}</span>
      {isSelected ? (
        <input
          type="number"
          min={1} max={30}
          value={score}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-10 bg-transparent text-center text-sm font-bold outline-none border-b border-[#7a200d]/40"
        />
      ) : (
        <span className="text-sm font-bold">{score}</span>
      )}
      <span className="text-xs">({abilityMod(score)})</span>
    </div>
  );
}

function TraitList({
  title,
  items,
  isSelected,
  onChange,
}: {
  title: string;
  items: { name: string; desc: string }[];
  isSelected: boolean;
  onChange: (items: { name: string; desc: string }[]) => void;
}) {
  if (items.length === 0 && !isSelected) return null;

  function update(idx: number, field: 'name' | 'desc', val: string) {
    const next = items.map((it, i) => i === idx ? { ...it, [field]: val } : it);
    onChange(next);
  }

  return (
    <div className="mt-1">
      <p className="font-bold text-[#7a200d] text-sm border-b border-[#7a200d]/30 mb-1">{title}</p>
      {items.map((it, idx) => (
        <div key={idx} className="mb-1 text-sm">
          {isSelected ? (
            <div className="flex gap-1 items-start">
              <div className="flex-1">
                <input
                  value={it.name}
                  onChange={(e) => update(idx, 'name', e.target.value)}
                  className="w-full bg-transparent font-bold italic outline-none border-b border-slate-200 dark:border-slate-600 mb-0.5"
                  placeholder="Nome"
                />
                <textarea
                  value={it.desc}
                  onChange={(e) => update(idx, 'desc', e.target.value)}
                  rows={2}
                  className="w-full resize-none bg-transparent outline-none text-xs border border-slate-100 rounded px-1 dark:border-slate-700"
                  placeholder="Descrizione"
                />
              </div>
              <button onClick={() => onChange(items.filter((_, i) => i !== idx))} className="mt-1 text-slate-300 hover:text-red-400 shrink-0">
                <Trash2 size={12} />
              </button>
            </div>
          ) : (
            <p><em className="font-semibold">{it.name}.</em> {it.desc}</p>
          )}
        </div>
      ))}
      {isSelected && (
        <button
          onClick={() => onChange([...items, { name: '', desc: '' }])}
          className="flex items-center gap-1 text-xs text-[--color-forge-purple] hover:underline mt-0.5"
        >
          <Plus size={11} /> Aggiungi
        </button>
      )}
    </div>
  );
}

function StringListField({ label, value, isSelected, onChange }: { label: string; value: string[]; isSelected: boolean; onChange: (v: string[]) => void }) {
  if (value.length === 0 && !isSelected) return null;
  return (
    <p className="text-sm">
      <strong>{label} </strong>
      {isSelected ? (
        <input
          value={value.join(', ')}
          onChange={(e) => onChange(e.target.value.split(',').map((s) => s.trim()).filter(Boolean))}
          className="bg-transparent outline-none border-b border-slate-300 flex-1 w-48 dark:border-slate-600"
        />
      ) : value.join(', ')}
    </p>
  );
}

// ─── Main component ───────────────────────────────────────────────

export function StatBlockDnD5e({ data, isSelected, onChange }: Props) {
  const [showEdit, setShowEdit] = useState(false);
  const editMode = isSelected && showEdit;

  const crXpMap: Record<string, string> = {
    '0': '10 PX', '1/8': '25 PX', '1/4': '50 PX', '1/2': '100 PX',
    '1': '200 PX', '2': '450 PX', '3': '700 PX', '4': '1.100 PX',
    '5': '1.800 PX', '6': '2.300 PX', '7': '2.900 PX', '8': '3.900 PX',
    '9': '5.000 PX', '10': '5.900 PX', '11': '7.200 PX', '12': '8.400 PX',
    '13': '10.000 PX', '14': '11.500 PX', '15': '13.000 PX', '16': '15.000 PX',
    '17': '18.000 PX', '18': '20.000 PX', '19': '22.000 PX', '20': '25.000 PX',
    '21': '33.000 PX', '22': '41.000 PX', '23': '50.000 PX', '24': '62.000 PX',
    '25': '75.000 PX', '26': '90.000 PX', '27': '105.000 PX', '28': '120.000 PX',
    '29': '135.000 PX', '30': '155.000 PX',
  };

  const speedParts = [
    data.speed.walk > 0 && `${data.speed.walk} m`,
    data.speed.fly > 0 && `volare ${data.speed.fly} m`,
    data.speed.swim > 0 && `nuotare ${data.speed.swim} m`,
    data.speed.burrow > 0 && `scavare ${data.speed.burrow} m`,
    data.speed.climb > 0 && `scalare ${data.speed.climb} m`,
  ].filter(Boolean).join(', ');

  return (
    <div className="stat-block-5e relative rounded border border-[#7a200d]/40 bg-[#fdf1dc] text-[#231f20] shadow-md dark:bg-[#2a1a10] dark:text-[#e8d5b0]" style={{ fontFamily: 'Bookman Old Style, Georgia, serif' }}>

      {/* Edit toggle */}
      {isSelected && (
        <button
          onClick={() => setShowEdit((p) => !p)}
          className="absolute right-2 top-2 flex items-center gap-1 rounded-full bg-[#7a200d] px-2 py-0.5 text-[10px] text-white"
        >
          {showEdit ? <><ChevronUp size={10} /> Vista</> : <><ChevronDown size={10} /> Modifica</>}
        </button>
      )}

      {/* Header */}
      <div className="rounded-t bg-[#7a200d] px-3 py-2 text-white">
        {editMode ? (
          <input value={data.name} onChange={(e) => onChange({ name: e.target.value })} className="w-full bg-transparent text-xl font-bold outline-none placeholder:text-white/40" placeholder="Nome creatura" />
        ) : (
          <h2 className="text-xl font-bold" style={{ fontFamily: 'Cinzel, serif' }}>{data.name}</h2>
        )}
        <div className="text-sm italic text-[#f0c070]">
          {editMode ? (
            <div className="flex flex-wrap gap-2 mt-1">
              {[
                { label: 'Taglia', key: 'size' as const },
                { label: 'Tipo', key: 'type' as const },
                { label: 'Sottotipo', key: 'subtype' as const },
                { label: 'Allineamento', key: 'alignment' as const },
              ].map(({ label, key }) => (
                <label key={key} className="flex items-center gap-1 text-xs">
                  <span className="opacity-70">{label}</span>
                  <input value={data[key]} onChange={(e) => onChange({ [key]: e.target.value })} className="bg-transparent border-b border-white/30 outline-none w-24" />
                </label>
              ))}
            </div>
          ) : (
            <p>{data.size} {data.type}{data.subtype ? ` (${data.subtype})` : ''}, {data.alignment}</p>
          )}
        </div>
      </div>

      <div className="px-3 py-2">
        {/* CA / PF / Velocità */}
        <div className="border-b border-[#7a200d]/30 pb-2 mb-2 text-sm">
          {editMode ? (
            <div className="flex flex-wrap gap-3">
              <label className="flex items-center gap-1">
                <span className="font-bold text-[#7a200d]">CA</span>
                <input type="number" value={data.ac} onChange={(e) => onChange({ ac: Number(e.target.value) })} className="w-10 bg-transparent border-b border-[#7a200d]/40 outline-none text-center" />
                <input value={data.acType} onChange={(e) => onChange({ acType: e.target.value })} className="bg-transparent border-b border-[#7a200d]/40 outline-none w-32" placeholder="tipo armatura" />
              </label>
              <label className="flex items-center gap-1">
                <span className="font-bold text-[#7a200d]">PF</span>
                <input type="number" value={data.hp} onChange={(e) => onChange({ hp: Number(e.target.value) })} className="w-10 bg-transparent border-b border-[#7a200d]/40 outline-none text-center" />
                <input value={data.hpFormula} onChange={(e) => onChange({ hpFormula: e.target.value })} className="bg-transparent border-b border-[#7a200d]/40 outline-none w-16" placeholder="formula" />
              </label>
            </div>
          ) : (
            <>
              <p><strong>Classe Armatura</strong> {data.ac}{data.acType ? ` (${data.acType})` : ''}</p>
              <p><strong>Punti Ferita</strong> {data.hp} ({data.hpFormula})</p>
              <p><strong>Velocità</strong> {speedParts}</p>
            </>
          )}
          {editMode && (
            <div className="flex flex-wrap gap-2 mt-2">
              {(['walk', 'fly', 'swim', 'burrow', 'climb'] as const).map((spd) => (
                <label key={spd} className="flex items-center gap-1 text-xs">
                  <span className="capitalize opacity-70">{spd === 'walk' ? 'Cam.' : spd === 'fly' ? 'Volo' : spd === 'swim' ? 'Nuoto' : spd === 'burrow' ? 'Scava' : 'Scala'}</span>
                  <input type="number" value={data.speed[spd]} onChange={(e) => onChange({ speed: { ...data.speed, [spd]: Number(e.target.value) } })} className="w-10 bg-transparent border-b border-[#7a200d]/40 outline-none text-center" />
                  <span className="opacity-50">m</span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Ability scores */}
        <div className="grid grid-cols-6 gap-1 border-b border-[#7a200d]/30 pb-2 mb-2 text-center">
          {(['str', 'dex', 'con', 'int', 'wis', 'cha'] as const).map((ab) => (
            <AbilityScore
              key={ab}
              label={ab === 'str' ? 'FOR' : ab === 'dex' ? 'DES' : ab === 'con' ? 'COS' : ab === 'int' ? 'INT' : ab === 'wis' ? 'SAG' : 'CAR'}
              score={data[ab]}
              isSelected={editMode}
              onChange={(v) => onChange({ [ab]: v })}
            />
          ))}
        </div>

        {/* Secondary stats */}
        <div className="border-b border-[#7a200d]/30 pb-2 mb-2 text-sm flex flex-col gap-0.5">
          <StringListField label="Tiri Salvezza" value={data.savingThrows} isSelected={editMode} onChange={(v) => onChange({ savingThrows: v })} />
          <StringListField label="Abilità" value={data.skills} isSelected={editMode} onChange={(v) => onChange({ skills: v })} />
          <StringListField label="Vulnerabilità" value={data.damageVulnerabilities} isSelected={editMode} onChange={(v) => onChange({ damageVulnerabilities: v })} />
          <StringListField label="Resistenze" value={data.damageResistances} isSelected={editMode} onChange={(v) => onChange({ damageResistances: v })} />
          <StringListField label="Immunità ai danni" value={data.damageImmunities} isSelected={editMode} onChange={(v) => onChange({ damageImmunities: v })} />
          <StringListField label="Immunità alle condizioni" value={data.conditionImmunities} isSelected={editMode} onChange={(v) => onChange({ conditionImmunities: v })} />
          <p className="text-sm"><strong>Sensi </strong>
            {editMode ? <input value={data.senses} onChange={(e) => onChange({ senses: e.target.value })} className="bg-transparent border-b border-slate-300 outline-none flex-1 w-48 dark:border-slate-600" /> : data.senses}
          </p>
          <p className="text-sm"><strong>Linguaggi </strong>
            {editMode ? <input value={data.languages} onChange={(e) => onChange({ languages: e.target.value })} className="bg-transparent border-b border-slate-300 outline-none w-48 dark:border-slate-600" /> : data.languages}
          </p>
          <p className="text-sm"><strong>Grado di Sfida </strong>
            {editMode ? (
              <input value={data.cr} onChange={(e) => onChange({ cr: e.target.value })} className="bg-transparent border-b border-slate-300 outline-none w-12 dark:border-slate-600" />
            ) : (
              <>{data.cr} ({crXpMap[data.cr] ?? '?'})</>
            )}
          </p>
        </div>

        {/* Traits, Actions, etc. */}
        <TraitList title="Tratti" items={data.traits} isSelected={editMode} onChange={(v) => onChange({ traits: v })} />
        <TraitList title="Azioni" items={data.actions} isSelected={editMode} onChange={(v) => onChange({ actions: v })} />
        {(data.bonusActions.length > 0 || editMode) && (
          <TraitList title="Azioni Bonus" items={data.bonusActions} isSelected={editMode} onChange={(v) => onChange({ bonusActions: v })} />
        )}
        {(data.reactions.length > 0 || editMode) && (
          <TraitList title="Reazioni" items={data.reactions} isSelected={editMode} onChange={(v) => onChange({ reactions: v })} />
        )}
        {(data.legendaryActions.length > 0 || editMode) && (
          <TraitList title="Azioni Leggendarie" items={data.legendaryActions} isSelected={editMode} onChange={(v) => onChange({ legendaryActions: v })} />
        )}
        {(data.lairActions.length > 0 || editMode) && (
          <TraitList title="Azioni di Tana" items={data.lairActions} isSelected={editMode} onChange={(v) => onChange({ lairActions: v })} />
        )}

        {/* Flavor text */}
        {(data.flavorText || editMode) && (
          <div className="mt-2 border-t border-[#7a200d]/20 pt-2">
            <div
              contentEditable={editMode}
              suppressContentEditableWarning
              onBlur={(e) => onChange({ flavorText: (e.target as HTMLElement).textContent ?? '' })}
              className="text-xs italic text-slate-500 outline-none dark:text-slate-400"
            >
              {data.flavorText || (editMode ? 'Testo flavour…' : '')}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
