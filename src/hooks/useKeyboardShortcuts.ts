import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUiStore } from '../stores/uiStore';
import { useHistoryStore } from '../stores/historyStore';
import { useDocumentStore } from '../stores/documentStore';

export function useKeyboardShortcuts(): void {
  const navigate = useNavigate();
  const openModal = useUiStore((s) => s.openModal);
  const zoomIn = useUiStore((s) => s.zoomIn);
  const zoomOut = useUiStore((s) => s.zoomOut);
  const zoomReset = useUiStore((s) => s.zoomReset);
  const toggleFullscreen = useUiStore((s) => s.toggleFullscreen);
  const canUndo = useHistoryStore((s) => s.canUndo);
  const canRedo = useHistoryStore((s) => s.canRedo);

  useEffect(() => {
    function handler(e: KeyboardEvent) {
      const ctrl = e.ctrlKey || e.metaKey;
      const target = e.target as HTMLElement;
      const isEditing = target.isContentEditable
        || target.tagName === 'INPUT'
        || target.tagName === 'TEXTAREA';

      if (ctrl && e.key === 'n') { e.preventDefault(); navigate('/editor'); }
      if (ctrl && e.key === 'o') { e.preventDefault(); navigate('/'); }
      if (ctrl && e.key === 'e') { e.preventDefault(); openModal('export'); }
      if (ctrl && e.key === 'p') { e.preventDefault(); openModal('export'); }
      if (ctrl && e.key === '=') { e.preventDefault(); zoomIn(); }
      if (ctrl && e.key === '-') { e.preventDefault(); zoomOut(); }
      if (ctrl && e.key === '0') { e.preventDefault(); zoomReset(); }
      if (e.key === 'F11') { e.preventDefault(); toggleFullscreen(); }
      if (e.key === '?' && !isEditing) { e.preventDefault(); openModal('shortcuts'); }
    }

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [navigate, openModal, zoomIn, zoomOut, zoomReset, toggleFullscreen]);
}
