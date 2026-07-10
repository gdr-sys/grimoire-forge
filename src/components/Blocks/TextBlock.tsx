import { useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextStyle from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import Highlight from '@tiptap/extension-highlight';
import TextAlign from '@tiptap/extension-text-align';
import Subscript from '@tiptap/extension-subscript';
import Superscript from '@tiptap/extension-superscript';
import Link from '@tiptap/extension-link';
import { useActiveEditor } from '../../lib/activeEditor';
import type { TextBlockData } from '../../types/block';

interface Props {
  data: TextBlockData;
  isSelected: boolean;
  onChange: (patch: Partial<TextBlockData>) => void;
}

const EXTENSIONS = [
  StarterKit,
  Underline,
  TextStyle,
  Color,
  Highlight.configure({ multicolor: true }),
  TextAlign.configure({ types: ['heading', 'paragraph'] }),
  Subscript,
  Superscript,
  Link.configure({ openOnClick: false }),
];

export function TextBlock({ data, isSelected, onChange }: Props) {
  const { setEditor } = useActiveEditor();

  const editor = useEditor({
    extensions: EXTENSIONS,
    content: data.html,
    editable: isSelected,
    onUpdate: ({ editor: e }) => onChange({ html: e.getHTML() }),
    onFocus: ({ editor: e }) => setEditor(e),
    onBlur: () => setEditor(null),
  });

  useEffect(() => {
    editor?.setEditable(isSelected);
  }, [isSelected, editor]);

  useEffect(() => {
    return () => { setEditor(null); };
  }, []);

  return (
    <EditorContent
      editor={editor}
      className="
        prose prose-sm max-w-none dark:prose-invert
        [&_.ProseMirror]:outline-none
        [&_.ProseMirror]:min-h-[1.5em]
        [&_.ProseMirror_p.is-editor-empty:first-child::before]:content-[attr(data-placeholder)]
        [&_.ProseMirror_p.is-editor-empty:first-child::before]:text-slate-300
        [&_.ProseMirror_p.is-editor-empty:first-child::before]:pointer-events-none
        [&_.ProseMirror_p.is-editor-empty:first-child::before]:float-left
        [&_.ProseMirror_p.is-editor-empty:first-child::before]:h-0
      "
    />
  );
}
