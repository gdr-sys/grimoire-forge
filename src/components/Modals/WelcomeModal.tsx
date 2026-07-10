import { ModalBase } from './ModalBase';
import { useUiStore } from '../../stores/uiStore';
import { useTranslation } from '../../hooks/useTranslation';
import { useDocumentStore } from '../../stores/documentStore';
import { createEmptyDocument } from '../../types/document';
import { db } from '../../lib/db';
import { useNavigate } from 'react-router-dom';

export function WelcomeModal() {
  const closeModal = useUiStore((s) => s.closeModal);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const loadDocument = useDocumentStore((s) => s.loadDocument);

  async function handleNewDocument() {
    const doc = createEmptyDocument('custom-blank');
    await db.documents.put({ ...doc, syncStatus: 'local-only', driveFileId: null });
    loadDocument(doc);
    closeModal();
    navigate(`/editor/${doc.id}`);
  }

  return (
    <ModalBase title={t('welcome.title')} onClose={closeModal} size="lg">
      <div className="flex flex-col gap-6">
        <div className="text-center">
          <div className="mx-auto mb-3 text-5xl">📖✨</div>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            {t('welcome.description')}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={handleNewDocument}
            className="flex flex-col items-center gap-2 rounded-xl border-2 border-[--color-forge-purple] bg-[--color-forge-purple]/5 p-4 text-center hover:bg-[--color-forge-purple]/10 transition"
          >
            <span className="text-2xl">✏️</span>
            <span className="text-sm font-semibold text-[--color-forge-purple]">{t('welcome.newDoc')}</span>
          </button>
          <button
            onClick={() => { closeModal(); }}
            className="flex flex-col items-center gap-2 rounded-xl border border-[--color-app-border] p-4 text-center hover:bg-slate-50 transition dark:border-[--color-dark-border] dark:hover:bg-slate-700/40"
          >
            <span className="text-2xl">📂</span>
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">{t('welcome.openDoc')}</span>
          </button>
        </div>
      </div>
    </ModalBase>
  );
}
