import { useState } from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { PropertiesPanel } from './PropertiesPanel';
import { Footer } from './Footer';
import { EditorCanvas } from '../Editor/EditorCanvas';
import { useUiStore } from '../../stores/uiStore';
import { useKeyboardShortcuts } from '../../hooks/useKeyboardShortcuts';
import { useAutoSave } from '../../hooks/useAutoSave';
import { OfflineBanner } from '../Sync/OfflineBanner';
import { AllModals } from './AllModals';
import { ActiveEditorContext } from '../../lib/activeEditor';
import type { Editor } from '@tiptap/react';

export function AppShell() {
  useKeyboardShortcuts();
  useAutoSave();

  const isFullscreen = useUiStore((s) => s.isFullscreen);
  const [activeEditor, setActiveEditor] = useState<Editor | null>(null);

  return (
    <ActiveEditorContext.Provider value={{ editor: activeEditor, setEditor: setActiveEditor }}>
      <div className="flex h-screen flex-col overflow-hidden">
        {!isFullscreen && <Header />}
        <OfflineBanner />

        <div className="flex min-h-0 flex-1">
          {!isFullscreen && <Sidebar />}
          <EditorCanvas />
          {!isFullscreen && <PropertiesPanel />}
        </div>

        {!isFullscreen && <Footer />}
        <AllModals />
      </div>
    </ActiveEditorContext.Provider>
  );
}
