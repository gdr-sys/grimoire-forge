import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useTranslation } from '../hooks/useTranslation';
import { useDocumentStore } from '../stores/documentStore';
import { db } from '../lib/db';
import { createEmptyDocument } from '../types/document';
import { DEFAULT_PAGE } from '../types/page';
import { AppShell } from '../components/Layout/AppShell';

export default function EditorPage() {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const currentDocument = useDocumentStore((s) => s.currentDocument);
  const setCurrentDocument = useDocumentStore((s) => s.setCurrentDocument);

  useEffect(() => {
    if (!currentDocument) {
      if (id) {
        void loadDocument(id);
      } else {
        // New document
        const doc = createEmptyDocument('parchment-classic');
        doc.title = t('editor.untitled');
        const firstPage = { ...DEFAULT_PAGE, id: crypto.randomUUID() };
        doc.pages = [firstPage];
        setCurrentDocument(doc);
      }
    }
  }, [id]);

  async function loadDocument(docId: string) {
    const record = await db.documents.get(docId);
    if (!record) {
      toast.error(t('error.generic'));
      navigate('/');
      return;
    }
    try {
      const doc = JSON.parse(record.data);
      setCurrentDocument(doc);
    } catch {
      toast.error(t('error.generic'));
      navigate('/');
    }
  }

  if (!currentDocument) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[--color-forge-purple] border-t-transparent" />
      </div>
    );
  }

  return <AppShell />;
}
