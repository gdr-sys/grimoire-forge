import { create } from 'zustand';
import type { GrimoireDocument } from '../types/document';

const MAX_HISTORY = 100;

interface HistoryState {
  past: GrimoireDocument[];
  future: GrimoireDocument[];
  canUndo: boolean;
  canRedo: boolean;
  push: (snapshot: GrimoireDocument) => void;
  undo: () => GrimoireDocument | null;
  redo: () => GrimoireDocument | null;
  clear: () => void;
}

export const useHistoryStore = create<HistoryState>((set, get) => ({
  past: [],
  future: [],
  canUndo: false,
  canRedo: false,

  push: (snapshot) =>
    set((s) => {
      const past = [...s.past, snapshot].slice(-MAX_HISTORY);
      return { past, future: [], canUndo: past.length > 0, canRedo: false };
    }),

  undo: () => {
    const { past, future } = get();
    if (past.length === 0) return null;
    const prev = past[past.length - 1];
    const newPast = past.slice(0, -1);
    // The caller should push the current state to future before undoing
    set({ past: newPast, future, canUndo: newPast.length > 0, canRedo: true });
    return prev;
  },

  redo: () => {
    const { past, future } = get();
    if (future.length === 0) return null;
    const next = future[0];
    const newFuture = future.slice(1);
    set({
      past: [...past, next],
      future: newFuture,
      canUndo: true,
      canRedo: newFuture.length > 0,
    });
    return next;
  },

  clear: () => set({ past: [], future: [], canUndo: false, canRedo: false }),
}));
