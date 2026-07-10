import { useEffect, useRef } from 'react';
import { useDocumentStore } from '../stores/documentStore';
import { useAuthStore } from '../stores/authStore';
import { db } from '../lib/db';
import { schedulePostSaveSync } from '../services/syncManager';
import { DEBOUNCE_AUTOSAVE_MS } from '../lib/constants';

export function useAutoSave(): void {
  const currentDocument = useDocumentStore((s) => s.currentDocument);
  const isDirty = useDocumentStore((s) => s.isDirty);
  const markClean = useDocumentStore((s) => s.markClean);
  const user = useAuthStore((s) => s.user);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!isDirty || !currentDocument) return;

    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(async () => {
      try {
        await db.documents.put({
          id: currentDocument.id,
          title: currentDocument.title,
          data: JSON.stringify(currentDocument),
          presetId: currentDocument.presetId,
          updatedAt: currentDocument.updatedAt,
          createdAt: currentDocument.createdAt,
          driveFileId: currentDocument.driveFileId,
          syncStatus: user ? 'local-ahead' : 'local-only',
          thumbnail: currentDocument.thumbnail,
        });
        markClean();
        if (user) schedulePostSaveSync(currentDocument);
      } catch (err) {
        console.error('Autosave failed', err);
      }
    }, DEBOUNCE_AUTOSAVE_MS);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isDirty, currentDocument, user, markClean]);
}
