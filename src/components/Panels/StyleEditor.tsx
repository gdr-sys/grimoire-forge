import { useTranslation } from '../../hooks/useTranslation';
import { useDocumentStore } from '../../stores/documentStore';
import { useUiStore } from '../../stores/uiStore';
import type { BlockStyle } from '../../types/style';

export function StyleEditor() {
  const { t } = useTranslation();
  const selectedBlockId = useUiStore((s) => s.selectedBlockId);
  const currentDocument = useDocumentStore((s) => s.currentDocument);
  const updateBlockStyle = useDocumentStore((s) => s.updateBlockStyle);

  if (!selectedBlockId || !currentDocument) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 p-6 text-center text-xs text-slate-400">
        <span className="text-2xl">🎨</span>
        <p>{t('style.noSelection')}</p>
      </div>
    );
  }

  const block = currentDocument.blocks[selectedBlockId];
  if (!block) return null;

  const style = block.style;

  function patch(updates: Partial<BlockStyle>) {
    updateBlockStyle(selectedBlockId!, updates);
  }

  return (
    <div className="flex flex-col gap-4 overflow-y-auto p-3 text-xs">
      {/* Spacing */}
      <Section title={t('style.spacing')}>
        <SpacingRow
          label="Margine"
          top={style.marginTop}
          bottom={style.marginBottom}
          onTop={(v) => patch({ marginTop: v })}
          onBottom={(v) => patch({ marginBottom: v })}
        />
        <SpacingRow
          label="Padding"
          top={style.paddingTop}
          bottom={style.paddingBottom}
          onTop={(v) => patch({ paddingTop: v })}
          onBottom={(v) => patch({ paddingBottom: v })}
        />
        <LabelRow label="Larghezza">
          <input
            type="text"
            value={style.width}
            onChange={(e) => patch({ width: e.target.value })}
            className="input-xs"
            placeholder="auto"
          />
        </LabelRow>
      </Section>

      {/* Opacity */}
      <Section title={t('style.opacity')}>
        <LabelRow label={`${style.opacity}%`}>
          <input
            type="range"
            min="0"
            max="100"
            value={style.opacity}
            onChange={(e) => patch({ opacity: Number(e.target.value) })}
            className="w-full accent-[--color-forge-purple]"
          />
        </LabelRow>
      </Section>

      {/* Alignment / Float */}
      <Section title={t('style.float')}>
        <div className="flex gap-1">
          {(['none', 'left', 'right'] as const).map((f) => (
            <button
              key={f}
              onClick={() => patch({ float: f })}
              className={`flex-1 rounded border py-1 text-center capitalize ${style.float === f ? 'border-[--color-forge-purple] bg-[--color-forge-purple]/10 text-[--color-forge-purple]' : 'border-[--color-app-border] hover:bg-slate-50 dark:border-[--color-dark-border] dark:hover:bg-slate-700'}`}
            >
              {f === 'none' ? 'Nessuno' : f === 'left' ? 'Sin.' : 'Des.'}
            </button>
          ))}
        </div>
      </Section>

      {/* Border */}
      <Section title={t('style.border')}>
        <LabelRow label="Stile">
          <select
            value={style.border.style}
            onChange={(e) => patch({ border: { ...style.border, style: e.target.value as 'none' | 'solid' | 'dashed' | 'dotted' | 'double' } })}
            className="input-xs"
          >
            <option value="none">Nessuno</option>
            <option value="solid">Continuo</option>
            <option value="dashed">Tratteggiato</option>
            <option value="dotted">Puntinato</option>
            <option value="double">Doppio</option>
          </select>
        </LabelRow>
        {style.border.style !== 'none' && (
          <>
            <LabelRow label="Spessore">
              <input
                type="number"
                min="0"
                max="20"
                value={style.border.width}
                onChange={(e) => patch({ border: { ...style.border, width: Number(e.target.value) } })}
                className="input-xs"
              />
            </LabelRow>
            <LabelRow label="Colore">
              <input
                type="color"
                value={style.border.color}
                onChange={(e) => patch({ border: { ...style.border, color: e.target.value } })}
                className="h-7 w-full cursor-pointer rounded border-0"
              />
            </LabelRow>
            <LabelRow label="Raggio">
              <input
                type="text"
                value={style.border.radius}
                onChange={(e) => patch({ border: { ...style.border, radius: e.target.value } })}
                className="input-xs"
                placeholder="4px"
              />
            </LabelRow>
          </>
        )}
      </Section>

      {/* Background */}
      <Section title={t('style.background')}>
        <div className="flex gap-1">
          {(['transparent', 'solid'] as const).map((bt) => (
            <button
              key={bt}
              onClick={() => patch({ backgroundType: bt })}
              className={`flex-1 rounded border py-1 text-center text-xs ${style.backgroundType === bt ? 'border-[--color-forge-purple] bg-[--color-forge-purple]/10 text-[--color-forge-purple]' : 'border-[--color-app-border] hover:bg-slate-50 dark:border-[--color-dark-border]'}`}
            >
              {bt === 'transparent' ? 'Trasparente' : 'Colore'}
            </button>
          ))}
        </div>
        {style.backgroundType === 'solid' && (
          <LabelRow label="Colore">
            <input
              type="color"
              value={style.background ?? '#ffffff'}
              onChange={(e) => patch({ background: e.target.value })}
              className="h-7 w-full cursor-pointer rounded border-0"
            />
          </LabelRow>
        )}
      </Section>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h4 className="mb-2 font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400" style={{ fontSize: '10px' }}>
        {title}
      </h4>
      <div className="flex flex-col gap-1.5">{children}</div>
    </div>
  );
}

function LabelRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2">
      <label className="w-20 shrink-0 text-slate-500 dark:text-slate-400">{label}</label>
      <div className="flex-1">{children}</div>
    </div>
  );
}

function SpacingRow({
  label,
  top,
  bottom,
  onTop,
  onBottom,
}: {
  label: string;
  top: string;
  bottom: string;
  onTop: (v: string) => void;
  onBottom: (v: string) => void;
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="w-20 shrink-0 text-slate-500 dark:text-slate-400">{label}</span>
      <input
        type="text"
        value={top}
        onChange={(e) => onTop(e.target.value)}
        className="input-xs w-16"
        placeholder="Alto"
        title="Alto"
      />
      <input
        type="text"
        value={bottom}
        onChange={(e) => onBottom(e.target.value)}
        className="input-xs w-16"
        placeholder="Basso"
        title="Basso"
      />
    </div>
  );
}
