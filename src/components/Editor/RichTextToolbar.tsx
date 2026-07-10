import {
  Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, AlignJustify,
  List, ListOrdered, Link, Strikethrough, Highlighter, RemoveFormatting,
} from 'lucide-react';
import { useActiveEditorState } from '../../lib/activeEditor';

export function RichTextToolbar() {
  const editor = useActiveEditorState();

  function run(cmd: () => void) {
    return (e: React.MouseEvent) => {
      e.preventDefault();
      if (!editor) return;
      cmd();
      editor.commands.focus();
    };
  }

  function isActive(name: string, attrs?: Record<string, unknown>) {
    return editor?.isActive(name, attrs) ?? false;
  }

  return (
    <div className="flex h-9 shrink-0 items-center gap-0.5 border-b border-[--color-app-border] bg-[--color-app-toolbar] px-2 dark:border-[--color-dark-border] dark:bg-[--color-dark-toolbar]">
      <Btn icon={Bold} title="Grassetto (Ctrl+B)" active={isActive('bold')} onClick={run(() => editor?.chain().toggleBold().run())} disabled={!editor} />
      <Btn icon={Italic} title="Corsivo (Ctrl+I)" active={isActive('italic')} onClick={run(() => editor?.chain().toggleItalic().run())} disabled={!editor} />
      <Btn icon={Underline} title="Sottolineato (Ctrl+U)" active={isActive('underline')} onClick={run(() => editor?.chain().toggleUnderline().run())} disabled={!editor} />
      <Btn icon={Strikethrough} title="Barrato" active={isActive('strike')} onClick={run(() => editor?.chain().toggleStrike().run())} disabled={!editor} />
      <Divider />
      <Btn icon={AlignLeft} title="Sinistra" active={isActive('textAlign', { textAlign: 'left' })} onClick={run(() => editor?.chain().setTextAlign('left').run())} disabled={!editor} />
      <Btn icon={AlignCenter} title="Centra" active={isActive('textAlign', { textAlign: 'center' })} onClick={run(() => editor?.chain().setTextAlign('center').run())} disabled={!editor} />
      <Btn icon={AlignRight} title="Destra" active={isActive('textAlign', { textAlign: 'right' })} onClick={run(() => editor?.chain().setTextAlign('right').run())} disabled={!editor} />
      <Btn icon={AlignJustify} title="Giustifica" active={isActive('textAlign', { textAlign: 'justify' })} onClick={run(() => editor?.chain().setTextAlign('justify').run())} disabled={!editor} />
      <Divider />
      <Btn icon={List} title="Elenco puntato" active={isActive('bulletList')} onClick={run(() => editor?.chain().toggleBulletList().run())} disabled={!editor} />
      <Btn icon={ListOrdered} title="Elenco numerato" active={isActive('orderedList')} onClick={run(() => editor?.chain().toggleOrderedList().run())} disabled={!editor} />
      <Divider />
      <Btn icon={Highlighter} title="Evidenzia" active={isActive('highlight')} onClick={run(() => editor?.chain().toggleHighlight().run())} disabled={!editor} />
      <Btn icon={RemoveFormatting} title="Rimuovi formattazione" onClick={run(() => editor?.chain().clearNodes().unsetAllMarks().run())} disabled={!editor} />

      {!editor && (
        <span className="ml-2 text-[10px] text-slate-400 dark:text-slate-500">
          Seleziona un blocco testo per modificare
        </span>
      )}
    </div>
  );
}

function Btn({
  icon: Icon, title, onClick, active = false, disabled = false,
}: {
  icon: typeof Bold;
  title: string;
  onClick: (e: React.MouseEvent) => void;
  active?: boolean;
  disabled?: boolean;
}) {
  return (
    <button
      onMouseDown={onClick}
      title={title}
      disabled={disabled}
      className={`rounded p-1 transition ${
        active
          ? 'bg-[--color-forge-purple]/10 text-[--color-forge-purple]'
          : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-slate-200'
      } disabled:opacity-30`}
    >
      <Icon size={14} />
    </button>
  );
}

function Divider() {
  return <div className="mx-1 h-4 w-px bg-slate-200 dark:bg-slate-700" />;
}
