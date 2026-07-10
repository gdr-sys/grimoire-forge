import { ModalBase } from './ModalBase';
import { useUiStore } from '../../stores/uiStore';
import { useTranslation } from '../../hooks/useTranslation';
import { useGoogleDrive } from '../../hooks/useGoogleDrive';
import { useDocumentStore } from '../../stores/documentStore';
import { db } from '../../lib/db';
import type { GrimoireDocument } from '../../types/document';
import { useState } from 'react';

export function DrivePickerModal() {
  const closeModal = useUiStore((s) => s.closeModal);
  const { t } = useTranslation();
  const { listDocuments, loadDocument: loadFromDrive } = useGoogleDrive();
  const loadDocument = useDocumentStore((s) => s.loadDocument);
  const [files, setFiles] = useState<{ id: string; name: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function fetchList() {
    setIsLoading(true);
    setError(null);
    try {
      const result = await listDocuments();
      setFiles(result);
    } catch (err) {
      setError(String(err));
    } finally {
      setIsLoading(false);
    }
  }

  async function handleOpen(fileId: string) {
    setIsLoading(true);
    try {
      const json = await loadFromDrive(fileId);
      if (json) {
        const doc: GrimoireDocument = JSON.parse(json);
        await db.documents.put({
          id: doc.id,
          title: doc.title,
          data: json,
          presetId: doc.presetId,
          updatedAt: doc.updatedAt,
          createdAt: doc.createdAt,
          driveFileId: fileId,
          syncStatus: 'synced',
          thumbnail: doc.thumbnail,
        });
        loadDocument(doc);
        closeModal();
      }
    } catch (err) {
      setError(String(err));
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <ModalBase title={t('drive.picker')} onClose={closeModal} size="md">
      <div className="flex flex-col gap-3">
        {files.length === 0 && !isLoading && (
          <button
            onClick={fetchList}
            className="w-full rounded-lg bg-[--color-forge-purple] py-2 text-sm font-semibold text-white hover:opacity-90"
          >
            {t('drive.loadList')}
          </button>
        )}

        {isLoading && (
          <div className="flex justify-center py-6 text-sm text-slate-400">
            {t('common.loading')}…
          </div>
        )}

        {files.length > 0 && (
          <ul className="max-h-64 overflow-y-auto flex flex-col gap-1">
            {files.map((f) => (
              <li key={f.id}>
                <button
                  onClick={() => handleOpen(f.id)}
                  className="w-full rounded-md px-3 py-2 text-left text-sm hover:bg-slate-50 dark:hover:bg-slate-700/40"
                >
                  📄 {f.name}
                </button>
              </li>
            ))}
          </ul>
        )}

        {error && (
          <p className="rounded-lg bg-red-50 p-3 text-xs text-red-600 dark:bg-red-900/30 dark:text-red-400">
            {error}
          </p>
        )}
      </div>
    </ModalBase>
  );
}
