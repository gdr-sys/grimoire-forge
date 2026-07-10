import { useRef } from 'react';
import type { HeadingBlockData, HeadingLevel } from '../../types/block';

interface Props {
  data: HeadingBlockData;
  isSelected: boolean;
  onChange: (patch: Partial<HeadingBlockData>) => void;
}

const LEVELS: HeadingLevel[] = ['h1', 'h2', 'h3', 'h4'];

export function HeadingBlock({ data, isSelected, onChange }: Props) {
  const Tag = data.level;
  const ref = useRef<HTMLElement>(null);

  function handleBlur() {
    onChange({ text: ref.current?.textContent ?? '' });
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter') { e.preventDefault(); }
  }

  return (
    <div className="relative">
      {isSelected && (
        <div className="absolute -top-7 left-0 flex gap-0.5 rounded-md border border-[--color-app-border] bg-white px-1 py-0.5 shadow-sm dark:border-[--color-dark-border] dark:bg-slate-800">
          {LEVELS.map((lvl) => (
            <button
              key={lvl}
              onMouseDown={(e) => { e.preventDefault(); onChange({ level: lvl }); }}
              className={`rounded px-1.5 py-0.5 text-xs font-bold uppercase transition ${
                data.level === lvl
                  ? 'bg-[--color-forge-purple] text-white'
                  : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
            >
              {lvl.toUpperCase()}
            </button>
          ))}
        </div>
      )}

      <Tag
        // @ts-expect-error ref on dynamic tag
        ref={ref}
        contentEditable={isSelected}
        suppressContentEditableWarning
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        className="outline-none"
        style={{ margin: 0 }}
        dangerouslySetInnerHTML={{ __html: data.text }}
      />
    </div>
  );
}
