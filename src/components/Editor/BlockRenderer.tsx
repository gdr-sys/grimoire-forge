import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Trash2, Copy } from 'lucide-react';
import { useUiStore } from '../../stores/uiStore';
import { useDocumentStore } from '../../stores/documentStore';
import { useHistoryStore } from '../../stores/historyStore';
import { createBlock } from '../../lib/blockFactory';
import { ImageBlock } from '../Blocks/ImageBlock.tsx';
import { TextBlock } from '../Blocks/TextBlock';
import { HeadingBlock } from '../Blocks/HeadingBlock';
import { StatBlockDnD5e } from '../Blocks/StatBlockDnD5e';
import { SpellBlock } from '../Blocks/SpellBlock';
import { ItemBlock } from '../Blocks/ItemBlock';
import { TableBlock } from '../Blocks/TableBlock';
import { QuoteBlock } from '../Blocks/QuoteBlock';
import { NoteBlock } from '../Blocks/NoteBlock';
import type { Block } from '../../types/block';
import type { ImageBlockData } from '../../types/image';
import type { TextBlockData, HeadingBlockData, StatBlockDnD5eData, SpellBlockData, ItemBlockData, TableBlockData, NoteBlockData } from '../../types/block';

interface BlockRendererProps {
  block: Block;
  pageId: string;
  isSelected: boolean;
}

export function BlockRenderer({ block, pageId, isSelected }: BlockRendererProps) {
  const setSelectedBlock = useUiStore((s) => s.setSelectedBlock);
  const removeBlock = useDocumentStore((s) => s.removeBlock);
  const addBlock = useDocumentStore((s) => s.addBlock);
  const updateBlockData = useDocumentStore((s) => s.updateBlockData);
  const currentDocument = useDocumentStore((s) => s.currentDocument);
  const pushHistory = useHistoryStore((s) => s.push);

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: block.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  function handleSelect(e: React.MouseEvent) {
    e.stopPropagation();
    setSelectedBlock(block.id);
  }

  function handleDelete(e: React.MouseEvent) {
    e.stopPropagation();
    if (!currentDocument) return;
    pushHistory(currentDocument);
    removeBlock(block.id, pageId);
  }

  function handleDuplicate(e: React.MouseEvent) {
    e.stopPropagation();
    if (!currentDocument) return;
    pushHistory(currentDocument);
    const page = currentDocument.pages.find((p) => p.id === pageId);
    const idx = page?.blockIds.indexOf(block.id) ?? -1;
    const newBlock = createBlock(block.type, { data: block.data, style: block.style });
    addBlock(newBlock, pageId, idx + 1);
  }

  const blockStyle: React.CSSProperties = {
    paddingTop: block.style.paddingTop,
    paddingRight: block.style.paddingRight,
    paddingBottom: block.style.paddingBottom,
    paddingLeft: block.style.paddingLeft,
    marginTop: block.style.marginTop,
    marginBottom: block.style.marginBottom,
    opacity: block.style.opacity / 100,
    width: block.style.width !== 'auto' ? block.style.width : undefined,
    float: block.style.float !== 'none' ? (block.style.float as 'left' | 'right') : undefined,
    background: block.style.backgroundType !== 'transparent' ? block.style.background : undefined,
    borderRadius: block.style.border.radius,
    border: block.style.border.style !== 'none'
      ? `${block.style.border.width}px ${block.style.border.style} ${block.style.border.color}`
      : undefined,
  };

  return (
    <div
      ref={setNodeRef}
      style={{ ...style, ...blockStyle }}
      className={`group relative mb-2 ${isSelected ? 'ring-1 ring-[--color-forge-purple]' : 'hover:ring-1 hover:ring-slate-200 dark:hover:ring-slate-600'} rounded transition-shadow`}
      onClick={handleSelect}
      data-block-id={block.id}
    >
      {/* Drag handle */}
      {isSelected && (
        <div className="absolute -left-7 top-0 flex flex-col gap-0.5">
          <button
            {...attributes}
            {...listeners}
            className="cursor-grab rounded p-0.5 text-slate-400 hover:bg-slate-100 active:cursor-grabbing dark:hover:bg-slate-700"
            aria-label="Trascina blocco"
          >
            <GripVertical size={14} />
          </button>
        </div>
      )}

      {/* Quick actions */}
      {isSelected && (
        <div className="absolute -right-16 top-0 flex flex-col gap-0.5">
          <button onClick={handleDuplicate} className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-700" title="Duplica">
            <Copy size={13} />
          </button>
          <button onClick={handleDelete} className="rounded p-1 text-slate-400 hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/40" title="Elimina">
            <Trash2 size={13} />
          </button>
        </div>
      )}

      <BlockContent block={block} isSelected={isSelected} onChange={(patch) => updateBlockData(block.id, patch)} />
    </div>
  );
}

function BlockContent({
  block, isSelected, onChange,
}: {
  block: Block;
  isSelected: boolean;
  onChange: (patch: Partial<Block['data']>) => void;
}) {
  switch (block.type) {
    case 'image':
      return <ImageBlock blockId={block.id} data={block.data as ImageBlockData} isSelected={isSelected} onChange={onChange as (p: Partial<ImageBlockData>) => void} />;

    case 'text':
      return <TextBlock data={block.data as TextBlockData} isSelected={isSelected} onChange={onChange as (p: Partial<TextBlockData>) => void} />;

    case 'heading':
      return <HeadingBlock data={block.data as HeadingBlockData} isSelected={isSelected} onChange={onChange as (p: Partial<HeadingBlockData>) => void} />;

    case 'statblock-dnd5e':
      return <StatBlockDnD5e data={block.data as StatBlockDnD5eData} isSelected={isSelected} onChange={onChange as (p: Partial<StatBlockDnD5eData>) => void} />;

    case 'spell':
      return <SpellBlock data={block.data as SpellBlockData} isSelected={isSelected} onChange={onChange as (p: Partial<SpellBlockData>) => void} />;

    case 'item':
      return <ItemBlock data={block.data as ItemBlockData} isSelected={isSelected} onChange={onChange as (p: Partial<ItemBlockData>) => void} />;

    case 'table':
      return <TableBlock data={block.data as TableBlockData} isSelected={isSelected} onChange={onChange as (p: Partial<TableBlockData>) => void} />;

    case 'quote':
      return <QuoteBlock data={block.data as { quote: string; attribution: string; variant: 'pullquote' | 'sidebar' | 'flavor' }} isSelected={isSelected} onChange={onChange as (p: { quote?: string; attribution?: string; variant?: 'pullquote' | 'sidebar' | 'flavor' }) => void} />;

    case 'note':
      return <NoteBlock data={block.data as NoteBlockData} isSelected={isSelected} onChange={onChange as (p: Partial<NoteBlockData>) => void} />;

    case 'divider': {
      const d = block.data as { style?: string; color?: string; thickness?: number };
      return (
        <hr
          style={{ borderColor: d.color ?? 'currentColor', borderTopWidth: d.thickness ?? 1 }}
          className="my-2"
        />
      );
    }

    case 'spacer': {
      const d = block.data as { height: number };
      return <div style={{ height: d.height }} aria-hidden />;
    }

    case 'page-break':
      return (
        <div className="my-2 flex items-center gap-2 text-xs text-slate-400 print:hidden">
          <hr className="flex-1 border-dashed" />
          <span>Interruzione pagina</span>
          <hr className="flex-1 border-dashed" />
        </div>
      );

    case 'custom-html': {
      const d = block.data as { html: string; css: string };
      return (
        <div className="relative">
          {d.css && <style>{d.css}</style>}
          {isSelected ? (
            <div className="flex flex-col gap-1">
              <label className="text-[10px] uppercase tracking-wide text-slate-400">HTML</label>
              <textarea
                value={d.html}
                onChange={(e) => onChange({ html: e.target.value })}
                rows={6}
                className="w-full resize-y rounded border border-slate-200 bg-slate-50 p-2 font-mono text-xs outline-none focus:border-[--color-forge-purple] dark:border-slate-700 dark:bg-slate-800"
              />
              <label className="text-[10px] uppercase tracking-wide text-slate-400">CSS</label>
              <textarea
                value={d.css}
                onChange={(e) => onChange({ css: e.target.value })}
                rows={3}
                className="w-full resize-y rounded border border-slate-200 bg-slate-50 p-2 font-mono text-xs outline-none focus:border-[--color-forge-purple] dark:border-slate-700 dark:bg-slate-800"
              />
            </div>
          ) : (
            <div dangerouslySetInnerHTML={{ __html: d.html }} />
          )}
        </div>
      );
    }

    default:
      return (
        <div className="rounded border border-dashed border-slate-300 bg-slate-50 p-3 text-center text-xs text-slate-400 dark:border-slate-600 dark:bg-slate-800/40">
          Blocco: <code>{block.type}</code>
        </div>
      );
  }
}
