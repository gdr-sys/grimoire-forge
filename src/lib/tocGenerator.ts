import type { GrimoireDocument } from '../types/document';
import type { HeadingBlockData } from '../types/block';

export interface TocEntry {
  id: string;
  level: 'h1' | 'h2' | 'h3' | 'h4';
  text: string;
  pageNumber: number;
  anchorId: string;
}

export function generateToc(doc: GrimoireDocument): TocEntry[] {
  const entries: TocEntry[] = [];
  doc.pages.forEach((page, pageIdx) => {
    for (const blockId of page.blockIds) {
      const block = doc.blocks[blockId];
      if (!block || block.type !== 'heading') continue;
      const data = block.data as HeadingBlockData;
      entries.push({
        id: blockId,
        level: data.level,
        text: data.text,
        pageNumber: pageIdx + 1,
        anchorId: block.style.anchorId || blockId,
      });
    }
  });
  return entries;
}
