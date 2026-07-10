import { useHistoryStore } from '../stores/historyStore';
import { useDocumentStore } from '../stores/documentStore';

export function useHistory() {
  const canUndo = useHistoryStore((s) => s.canUndo);
  const canRedo = useHistoryStore((s) => s.canRedo);
  const undoFn = useHistoryStore((s) => s.undo);
  const redoFn = useHistoryStore((s) => s.redo);
  const push = useHistoryStore((s) => s.push);
  const setCurrentDocument = useDocumentStore((s) => s.setCurrentDocument);
  const currentDocument = useDocumentStore((s) => s.currentDocument);

  function undo(): void {
    if (!currentDocument) return;
    push(currentDocument);
    const prev = undoFn();
    if (prev) setCurrentDocument(prev);
  }

  function redo(): void {
    const next = redoFn();
    if (next) setCurrentDocument(next);
  }

  return { canUndo, canRedo, undo, redo };
}
