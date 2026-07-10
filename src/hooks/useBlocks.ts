import { useDocumentStore } from '../stores/documentStore';
import { useHistoryStore } from '../stores/historyStore';
import { createBlock } from '../lib/blockFactory';
import type { BlockType } from '../types/block';

export function useBlocks(pageId: string) {
  const currentDocument = useDocumentStore((s) => s.currentDocument);
  const addBlock = useDocumentStore((s) => s.addBlock);
  const removeBlock = useDocumentStore((s) => s.removeBlock);
  const updateBlockData = useDocumentStore((s) => s.updateBlockData);
  const updateBlockStyle = useDocumentStore((s) => s.updateBlockStyle);
  const pushHistory = useHistoryStore((s) => s.push);

  const page = currentDocument?.pages.find((p) => p.id === pageId);
  const blocks = (page?.blockIds ?? [])
    .map((id) => currentDocument?.blocks[id])
    .filter(Boolean);

  function insertBlock(type: BlockType, index?: number): string {
    if (!currentDocument) return '';
    pushHistory(currentDocument);
    const block = createBlock(type);
    addBlock(block, pageId, index);
    return block.id;
  }

  function deleteBlock(blockId: string): void {
    if (!currentDocument) return;
    pushHistory(currentDocument);
    removeBlock(blockId, pageId);
  }

  return { blocks, insertBlock, deleteBlock, updateBlockData, updateBlockStyle };
}
