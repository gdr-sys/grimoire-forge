import { createContext, useContext, useReducer, useEffect } from 'react';
import type { Editor } from '@tiptap/react';

interface ActiveEditorCtx {
  editor: Editor | null;
  setEditor: (e: Editor | null) => void;
}

export const ActiveEditorContext = createContext<ActiveEditorCtx>({
  editor: null,
  setEditor: () => {},
});

export function useActiveEditor() {
  return useContext(ActiveEditorContext);
}

/** Re-renders the caller on every TipTap transaction (for toolbar reactivity). */
export function useActiveEditorState(): Editor | null {
  const { editor } = useContext(ActiveEditorContext);
  const [, tick] = useReducer((n: number) => n + 1, 0);

  useEffect(() => {
    if (!editor) return;
    editor.on('transaction', tick);
    return () => { editor.off('transaction', tick); };
  }, [editor]);

  return editor;
}
