import { useState } from 'react';
import type { DragEndEvent, DragStartEvent } from '@dnd-kit/core';
import { useDocumentStore } from '../stores/documentStore';
import { useHistoryStore } from '../stores/historyStore';
import { createBlock } from '../lib/blockFactory';
import type { BlockType } from '../types/block';

export function useDragDrop(pageId: string) {
  const [draggingBlockId, setDraggingBlockId] = useState<string | null>(null);
  const currentDocument = useDocumentStore((s) => s.currentDocument);
  const addBlock = useDocumentStore((s) => s.addBlock);
  const reorderBlocks = useDocumentStore((s) => s.reorderBlocks);
  const pushHistory = useHistoryStore((s) => s.push);

  function onDragStart({ active }: DragStartEvent) {
    setDraggingBlockId(String(active.id));
  }

  function onDragEnd({ active, over }: DragEndEvent) {
    setDraggingBlockId(null);
    if (!over || active.id === over.id) return;
    if (!currentDocument) return;

    const activeId = String(active.id);
    const overId = String(over.id);

    // Dragging from the palette: activeId starts with "palette-"
    if (activeId.startsWith('palette-')) {
      const type = activeId.replace('palette-', '') as BlockType;
      const page = currentDocument.pages.find((p) => p.id === pageId);
      if (!page) return;
      const overIdx = page.blockIds.indexOf(overId);
      pushHistory(currentDocument);
      const block = createBlock(type);
      addBlock(block, pageId, overIdx >= 0 ? overIdx : undefined);
      return;
    }

    // Reordering within the same page
    const page = currentDocument.pages.find((p) => p.id === pageId);
    if (!page) return;
    const oldIndex = page.blockIds.indexOf(activeId);
    const newIndex = page.blockIds.indexOf(overId);
    if (oldIndex < 0 || newIndex < 0) return;
    pushHistory(currentDocument);
    const newIds = [...page.blockIds];
    newIds.splice(oldIndex, 1);
    newIds.splice(newIndex, 0, activeId);
    reorderBlocks(pageId, newIds);
  }

  return { draggingBlockId, onDragStart, onDragEnd };
}
