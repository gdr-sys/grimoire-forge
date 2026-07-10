import { useRef, useState } from 'react';
import { ModalBase } from './ModalBase';
import { useUiStore } from '../../stores/uiStore';
import { useTranslation } from '../../hooks/useTranslation';
import { importFromJsonFile } from '../../lib/importJson';
import { importFromHomebrewery } from '../../lib/importHomebrewery';
import { useDocumentStore } from '../../stores/documentStore';
import { db } from '../../lib/db';

type Tab = 'json' | 'homebrewery' | 'gmbinder';

export function ImportModal() {
  const closeModal = useUiStore((s) => s.closeModal);
  const { t } = useTranslation();
  const loadDocument = useDocumentStore((s) => s.loadDocument);
  const [tab, setTab] = useState<Tab>('json');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const [mdText, setMdText] = useState('');

  async function handleFileImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);
    setIsLoading(true);
    try {
      const doc = await importFromJsonFile(file);
      await db.documents.put({
        id: doc.id,
        title: doc.title,
        data: JSON.stringify(doc),
        presetId: doc.presetId,
        updatedAt: doc.updatedAt,
        createdAt: doc.createdAt,
        driveFileId: null,
        syncStatus: 'local-only',
        thumbnail: doc.thumbnail,
      });
      loadDocument(doc);
      closeModal();
    } catch (err) {
      setError(String(err));
    } finally {
      setIsLoading(false);
    }
  }

  async function handleMdImport() {
    if (!mdText.trim()) return;
    setError(null);
    setIsLoading(true);
    try {
      const doc = importFromHomebrewery(mdText);
      await db.documents.put({
        id: doc.id,
        title: doc.title,
        data: JSON.stringify(doc),
        presetId: doc.presetId,
        updatedAt: doc.updatedAt,
        createdAt: doc.createdAt,
        driveFileId: null,
        syncStatus: 'local-only',
        thumbnail: doc.thumbnail,
      });
      loadDocument(doc);
      closeModal();
    } catch (err) {
      setError(String(err));
    } finally {
      setIsLoading(false);
    }
  }

  const TABS: { id: Tab; label: string }[] = [
    { id: 'json', label: 'JSON' },
    { id: 'homebrewery', label: 'Homebrewery' },
    { id: 'gmbinder', label: 'GMBinder' },
  ];

  return (
    <ModalBase title={t('import.title')} onClose={closeModal} size="md">
      <div className="flex flex-col gap-4">
        <div className="flex gap-1 rounded-lg border border-[--color-app-border] p-1 dark:border-[--color-dark-border]">
          {TABS.map((tb) => (
            <button
              key={tb.id}
              onClick={() => setTab(tb.id)}
              className={`flex-1 rounded-md py-1 text-xs font-medium transition ${tab === tb.id ? 'bg-[--color-forge-purple] text-white' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'}`}
            >
              {tb.label}
            </button>
          ))}
        </div>

        {tab === 'json' ? (
          <div
            className="flex cursor-pointer flex-col items-center gap-2 rounded-xl border-2 border-dashed border-slate-200 py-8 text-center text-sm text-slate-400 hover:border-[--color-forge-purple] hover:text-[--color-forge-purple] dark:border-slate-700"
            onClick={() => fileRef.current?.click()}
          >
            <span className="text-3xl">📂</span>
            <p>{t('import.dropJson')}</p>
            <input ref={fileRef} type="file" accept=".json" className="hidden" onChange={handleFileImport} />
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            <textarea
              value={mdText}
              onChange={(e) => setMdText(e.target.value)}
              placeholder={`Incolla il tuo Markdown ${tab === 'homebrewery' ? 'Homebrewery' : 'GMBinder'} qui...`}
              className="h-36 w-full resize-none rounded-lg border border-[--color-app-border] bg-transparent p-3 font-mono text-xs outline-none focus:border-[--color-forge-purple] dark:border-[--color-dark-border]"
            />
            <button
              onClick={handleMdImport}
              disabled={!mdText.trim() || isLoading}
              className="w-full rounded-lg bg-[--color-forge-purple] py-2 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-50"
            >
              {isLoading ? 'Importazione...' : t('import.button')}
            </button>
          </div>
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
