import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

interface ModalBaseProps {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const SIZES = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-2xl',
};

export function ModalBase({ title, onClose, children, size = 'md' }: ModalBaseProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const el = dialogRef.current;
    if (!el) return;
    el.showModal();
    const handler = (e: MouseEvent) => {
      if (e.target === el) onClose();
    };
    el.addEventListener('click', handler);
    return () => {
      el.removeEventListener('click', handler);
      el.close();
    };
  }, [onClose]);

  return (
    <dialog
      ref={dialogRef}
      className="m-auto w-full rounded-xl border border-[--color-app-border] bg-white p-0 shadow-2xl backdrop:bg-black/50 dark:border-[--color-dark-border] dark:bg-[--color-dark-surface]"
      style={{ maxWidth: SIZES[size].replace('max-w-', '') === 'sm' ? '24rem' : SIZES[size].replace('max-w-', '') === 'md' ? '28rem' : SIZES[size].replace('max-w-', '') === 'lg' ? '32rem' : '42rem' }}
      onKeyDown={(e) => { if (e.key === 'Escape') onClose(); }}
    >
      <div className="flex items-center justify-between border-b border-[--color-app-border] px-4 py-3 dark:border-[--color-dark-border]">
        <h2 className="text-sm font-semibold text-slate-800 dark:text-slate-100">{title}</h2>
        <button
          onClick={onClose}
          className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-700"
          aria-label="Chiudi"
        >
          <X size={16} />
        </button>
      </div>
      <div className="p-4">{children}</div>
    </dialog>
  );
}
