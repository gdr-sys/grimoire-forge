import { create } from 'zustand';
import type { GrimoireDocument, DocumentMeta } from '../types/document';
import type { Block } from '../types/block';
import type { Page } from '../types/page';
import type { PresetId } from '../types/preset';
import type { BlockStyle } from '../types/style';

interface DocumentState {
  currentDocument: GrimoireDocument | null;
  documentList: DocumentMeta[];
  isDirty: boolean;
  lastSaveAt: number | null;

  setCurrentDocument: (doc: GrimoireDocument | null) => void;
  loadDocument: (doc: GrimoireDocument) => void;
  updateDocument: (patch: Partial<GrimoireDocument>) => void;
  setDocumentList: (list: DocumentMeta[]) => void;
  updateTitle: (title: string) => void;
  updatePreset: (presetId: PresetId) => void;

  // Pages
  addPage: (page: Page) => void;
  removePage: (pageId: string) => void;
  updatePage: (pageId: string, patch: Partial<Page>) => void;
  reorderPages: (pageIds: string[]) => void;

  // Blocks
  addBlock: (block: Block, pageId: string, index?: number) => void;
  removeBlock: (blockId: string, pageId: string) => void;
  updateBlockData: (blockId: string, data: Partial<Block['data']>) => void;
  updateBlockStyle: (blockId: string, style: Partial<BlockStyle>) => void;
  reorderBlocks: (pageId: string, blockIds: string[]) => void;
  moveBlockToPage: (blockId: string, fromPageId: string, toPageId: string, index?: number) => void;

  markClean: () => void;
  markDirty: () => void;
}

export const useDocumentStore = create<DocumentState>((set, get) => ({
  currentDocument: null,
  documentList: [],
  isDirty: false,
  lastSaveAt: null,

  setCurrentDocument: (doc) => set({ currentDocument: doc, isDirty: false }),
  loadDocument: (doc) => set({ currentDocument: doc, isDirty: false }),
  updateDocument: (patch) =>
    set((s) => ({
      currentDocument: s.currentDocument
        ? { ...s.currentDocument, ...patch, updatedAt: Date.now() }
        : null,
      isDirty: true,
    })),
  setDocumentList: (list) => set({ documentList: list }),

  updateTitle: (title) =>
    set((s) => ({
      currentDocument: s.currentDocument
        ? { ...s.currentDocument, title, updatedAt: Date.now() }
        : null,
      isDirty: true,
    })),

  updatePreset: (presetId) =>
    set((s) => ({
      currentDocument: s.currentDocument
        ? { ...s.currentDocument, presetId, updatedAt: Date.now() }
        : null,
      isDirty: true,
    })),

  addPage: (page) =>
    set((s) => {
      if (!s.currentDocument) return s;
      return {
        currentDocument: {
          ...s.currentDocument,
          pages: [...s.currentDocument.pages, page],
          updatedAt: Date.now(),
        },
        isDirty: true,
      };
    }),

  removePage: (pageId) =>
    set((s) => {
      if (!s.currentDocument) return s;
      // Also remove orphaned blocks
      const page = s.currentDocument.pages.find((p) => p.id === pageId);
      const orphanBlockIds = page?.blockIds ?? [];
      const newBlocks = { ...s.currentDocument.blocks };
      for (const id of orphanBlockIds) delete newBlocks[id];
      return {
        currentDocument: {
          ...s.currentDocument,
          pages: s.currentDocument.pages.filter((p) => p.id !== pageId),
          blocks: newBlocks,
          updatedAt: Date.now(),
        },
        isDirty: true,
      };
    }),

  updatePage: (pageId, patch) =>
    set((s) => {
      if (!s.currentDocument) return s;
      return {
        currentDocument: {
          ...s.currentDocument,
          pages: s.currentDocument.pages.map((p) =>
            p.id === pageId ? { ...p, ...patch } : p,
          ),
          updatedAt: Date.now(),
        },
        isDirty: true,
      };
    }),

  reorderPages: (pageIds) =>
    set((s) => {
      if (!s.currentDocument) return s;
      const pageMap = new Map(s.currentDocument.pages.map((p) => [p.id, p]));
      return {
        currentDocument: {
          ...s.currentDocument,
          pages: pageIds.map((id) => pageMap.get(id)!).filter(Boolean),
          updatedAt: Date.now(),
        },
        isDirty: true,
      };
    }),

  addBlock: (block, pageId, index) =>
    set((s) => {
      if (!s.currentDocument) return s;
      const pages = s.currentDocument.pages.map((p) => {
        if (p.id !== pageId) return p;
        const blockIds = [...p.blockIds];
        if (index !== undefined) blockIds.splice(index, 0, block.id);
        else blockIds.push(block.id);
        return { ...p, blockIds };
      });
      return {
        currentDocument: {
          ...s.currentDocument,
          pages,
          blocks: { ...s.currentDocument.blocks, [block.id]: block },
          updatedAt: Date.now(),
        },
        isDirty: true,
      };
    }),

  removeBlock: (blockId, pageId) =>
    set((s) => {
      if (!s.currentDocument) return s;
      const newBlocks = { ...s.currentDocument.blocks };
      delete newBlocks[blockId];
      return {
        currentDocument: {
          ...s.currentDocument,
          pages: s.currentDocument.pages.map((p) =>
            p.id === pageId
              ? { ...p, blockIds: p.blockIds.filter((id) => id !== blockId) }
              : p,
          ),
          blocks: newBlocks,
          updatedAt: Date.now(),
        },
        isDirty: true,
      };
    }),

  updateBlockData: (blockId, data) =>
    set((s) => {
      if (!s.currentDocument) return s;
      const existing = s.currentDocument.blocks[blockId];
      if (!existing) return s;
      return {
        currentDocument: {
          ...s.currentDocument,
          blocks: {
            ...s.currentDocument.blocks,
            [blockId]: { ...existing, data: { ...existing.data, ...data } as Block['data'] },
          },
          updatedAt: Date.now(),
        },
        isDirty: true,
      };
    }),

  updateBlockStyle: (blockId, style) =>
    set((s) => {
      if (!s.currentDocument) return s;
      const existing = s.currentDocument.blocks[blockId];
      if (!existing) return s;
      return {
        currentDocument: {
          ...s.currentDocument,
          blocks: {
            ...s.currentDocument.blocks,
            [blockId]: { ...existing, style: { ...existing.style, ...style } },
          },
          updatedAt: Date.now(),
        },
        isDirty: true,
      };
    }),

  reorderBlocks: (pageId, blockIds) =>
    set((s) => {
      if (!s.currentDocument) return s;
      return {
        currentDocument: {
          ...s.currentDocument,
          pages: s.currentDocument.pages.map((p) =>
            p.id === pageId ? { ...p, blockIds } : p,
          ),
          updatedAt: Date.now(),
        },
        isDirty: true,
      };
    }),

  moveBlockToPage: (blockId, fromPageId, toPageId, index) => {
    const { addBlock, removeBlock } = get();
    const doc = get().currentDocument;
    if (!doc) return;
    const block = doc.blocks[blockId];
    if (!block) return;
    removeBlock(blockId, fromPageId);
    addBlock(block, toPageId, index);
  },

  markClean: () => set({ isDirty: false, lastSaveAt: Date.now() }),
  markDirty: () => set({ isDirty: true }),
}));
