import { useEffect, useState } from 'react';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useUiStore } from '../../stores/uiStore';
import { useDocumentStore } from '../../stores/documentStore';
import { getPageDimensionsPx } from '../../lib/pageCalculator';
import { loadPreset, presetToPageStyle, injectPresetStyles } from '../../lib/presetEngine';
import { BlockRenderer } from './BlockRenderer';
import type { Page } from '../../types/page';
import type { CSSProperties } from 'react';

interface PageViewProps {
  page: Page;
  pageIndex: number;
  isActive: boolean;
}

export function PageView({ page, pageIndex, isActive }: PageViewProps) {
  const currentDocument = useDocumentStore((s) => s.currentDocument);
  const setActivePageIndex = useUiStore((s) => s.setActivePageIndex);
  const setSelectedBlock = useUiStore((s) => s.setSelectedBlock);
  const selectedBlockId = useUiStore((s) => s.selectedBlockId);
  const [presetStyle, setPresetStyle] = useState<CSSProperties>({});

  const dims = getPageDimensionsPx(page);
  const presetId = currentDocument?.presetId ?? 'custom-blank';

  useEffect(() => {
    let cancelled = false;
    loadPreset(presetId).then((preset) => {
      if (cancelled) return;
      injectPresetStyles(presetId, preset);
      setPresetStyle(presetToPageStyle(preset));
    });
    return () => { cancelled = true; };
  }, [presetId]);

  function handlePageClick(e: React.MouseEvent) {
    if ((e.target as HTMLElement).closest('[data-block-id]')) return;
    setSelectedBlock(null);
    setActivePageIndex(pageIndex);
  }

  const pageStyle: CSSProperties = {
    width: dims.width,
    minHeight: dims.height,
    padding: `${page.padding.top} ${page.padding.right} ${page.padding.bottom} ${page.padding.left}`,
    columnCount: page.columns > 1 ? page.columns : undefined,
    columnGap: page.columns > 1 ? page.columnGap : undefined,
    // Page-level background overrides preset if set
    background: page.background ?? presetStyle.background ?? '#fff',
    fontFamily: presetStyle.fontFamily,
    fontSize: presetStyle.fontSize,
    lineHeight: presetStyle.lineHeight,
    color: presetStyle.color,
  };

  return (
    <div
      className={`page-shadow relative mx-auto cursor-default transition-all duration-150 ${isActive ? 'ring-2 ring-[--color-forge-purple]' : ''}`}
      style={pageStyle}
      onClick={handlePageClick}
      data-page-id={page.id}
      data-preset={presetId}
    >
      <div className="absolute -top-6 left-0 text-xs text-slate-400">
        Pagina {pageIndex + 1}
      </div>

      <SortableContext items={page.blockIds} strategy={verticalListSortingStrategy}>
        {page.blockIds.length === 0 ? (
          <EmptyPageHint />
        ) : (
          page.blockIds.map((blockId) => {
            const block = currentDocument?.blocks[blockId];
            if (!block) return null;
            return (
              <BlockRenderer
                key={blockId}
                block={block}
                pageId={page.id}
                isSelected={selectedBlockId === blockId}
              />
            );
          })
        )}
      </SortableContext>
    </div>
  );
}

function EmptyPageHint() {
  return (
    <div className="flex h-48 items-center justify-center rounded-lg border-2 border-dashed border-slate-200 text-sm text-slate-400 dark:border-slate-700">
      Trascina blocchi qui dalla palette →
    </div>
  );
}
