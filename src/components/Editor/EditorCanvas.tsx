import { useRef } from 'react';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { useUiStore } from '../../stores/uiStore';
import { useDocumentStore } from '../../stores/documentStore';
import { useDragDrop } from '../../hooks/useDragDrop';
import { useZoom } from '../../hooks/useZoom';
import { PageView } from './PageView';
import { ZoomControls } from './ZoomControls';
import { RichTextToolbar } from './RichTextToolbar';

export function EditorCanvas() {
  const currentDocument = useDocumentStore((s) => s.currentDocument);
  const activePageIndex = useUiStore((s) => s.activePageIndex);
  const { zoom } = useZoom();
  const canvasRef = useRef<HTMLDivElement>(null);

  const activePage = currentDocument?.pages[activePageIndex];
  const pageId = activePage?.id ?? '';

  const { onDragStart, onDragEnd } = useDragDrop(pageId);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
  );

  if (!currentDocument) return null;

  return (
    <div className="relative flex flex-1 flex-col overflow-hidden bg-[--color-app-canvas] dark:bg-[--color-dark-canvas]">
      <RichTextToolbar />

      <div
        ref={canvasRef}
        className="flex-1 overflow-auto p-8 scrollbar-thin"
        id="gf-editor-canvas"
      >
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={onDragStart}
          onDragEnd={onDragEnd}
        >
          <div
            className="mx-auto origin-top transition-transform duration-100"
            style={{ transform: `scale(${zoom})`, transformOrigin: 'top center' }}
          >
            {currentDocument.pages.map((page, idx) => (
              <div key={page.id} className="mb-8">
                <PageView
                  page={page}
                  pageIndex={idx}
                  isActive={idx === activePageIndex}
                />
              </div>
            ))}
          </div>
        </DndContext>
      </div>

      <ZoomControls />
    </div>
  );
}
