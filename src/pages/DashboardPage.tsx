import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus, Search, FileText, Clock, Filter, Trash2,
  Copy, Edit3, Download, Upload, BookOpen,
} from 'lucide-react';
import { toast } from 'sonner';
import { useTranslation } from '../hooks/useTranslation';
import { useDocumentStore } from '../stores/documentStore';
import { useSettingsStore } from '../stores/settingsStore';
import { useUiStore } from '../stores/uiStore';
import { db } from '../lib/db';
import { createEmptyDocument } from '../types/document';
import type { DocumentMeta } from '../types/document';
import type { PresetId } from '../types/preset';
import { Header } from '../components/Layout/Header';
import { Footer } from '../components/Layout/Footer';
import { KoFiBanner } from '../components/Branding/KoFiBanner';
import { AllModals } from '../components/Layout/AllModals';

export default function DashboardPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const setCurrentDocument = useDocumentStore((s) => s.setCurrentDocument);
  const setDocumentList = useDocumentStore((s) => s.setDocumentList);
  const documentList = useDocumentStore((s) => s.documentList);
  const showKofi = useSettingsStore((s) => s.showKofi);
  const openModal = useUiStore((s) => s.openModal);

  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<'modified' | 'created' | 'name'>('modified');

  useEffect(() => {
    void loadDocuments();
  }, []);

  async function loadDocuments() {
    try {
      const records = await db.documents.orderBy('updatedAt').reverse().toArray();
      const metas: DocumentMeta[] = records.map((r) => {
        const data = JSON.parse(r.data);
        return {
          id: r.id,
          title: r.title,
          description: data.description ?? '',
          presetId: (r.presetId as PresetId) ?? 'custom-blank',
          tags: data.tags ?? [],
          createdAt: r.createdAt,
          updatedAt: r.updatedAt,
          driveFileId: r.driveFileId,
          syncStatus: (r.syncStatus as DocumentMeta['syncStatus']) ?? 'local-only',
          thumbnail: r.thumbnail,
          pageCount: data.pages?.length ?? 0,
        };
      });
      setDocumentList(metas);
    } catch (err) {
      console.error('Failed to load documents', err);
    }
  }

  async function handleNewDocument() {
    const doc = createEmptyDocument('parchment-classic');
    doc.title = t('editor.untitled');
    setCurrentDocument(doc);
    navigate('/editor');
  }

  async function handleOpenDocument(id: string) {
    const record = await db.documents.get(id);
    if (!record) { toast.error(t('error.generic')); return; }
    const doc = JSON.parse(record.data);
    setCurrentDocument(doc);
    navigate(`/editor/${id}`);
  }

  async function handleDeleteDocument(id: string) {
    await db.documents.delete(id);
    await loadDocuments();
    toast.success('Documento eliminato');
  }

  async function handleDuplicate(id: string) {
    const record = await db.documents.get(id);
    if (!record) return;
    const doc = JSON.parse(record.data);
    const newDoc = { ...doc, id: crypto.randomUUID(), title: doc.title + ' (copia)', createdAt: Date.now(), updatedAt: Date.now(), driveFileId: null, syncStatus: 'local-only' };
    await db.documents.put({ ...record, id: newDoc.id, title: newDoc.title, data: JSON.stringify(newDoc), updatedAt: newDoc.updatedAt, driveFileId: null, syncStatus: 'local-only' });
    await loadDocuments();
  }

  const filtered = documentList
    .filter((d) => !search || d.title.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === 'name') return a.title.localeCompare(b.title);
      if (sortBy === 'created') return b.createdAt - a.createdAt;
      return b.updatedAt - a.updatedAt;
    });

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
        {/* Top bar */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
              {t('dashboard.title')}
            </h1>
            <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
              {filtered.length} {filtered.length === 1 ? 'documento' : 'documenti'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => openModal('import')}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300"
            >
              <Upload size={15} />
              {t('nav.import')}
            </button>
            <button
              onClick={handleNewDocument}
              className="inline-flex items-center gap-1.5 rounded-lg bg-[--color-forge-purple] px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-[--color-forge-purple-700]"
            >
              <Plus size={15} />
              {t('dashboard.new')}
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t('dashboard.search')}
              className="w-full rounded-lg border border-slate-300 bg-white py-2 pl-9 pr-3 text-sm text-slate-700 placeholder-slate-400 focus:border-[--color-forge-purple] focus:outline-none dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter size={14} className="text-slate-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="rounded-lg border border-slate-300 bg-white px-2 py-2 text-sm dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200"
            >
              <option value="modified">{t('dashboard.sort.modified')}</option>
              <option value="created">{t('dashboard.sort.created')}</option>
              <option value="name">{t('dashboard.sort.name')}</option>
            </select>
          </div>
        </div>

        {/* Document grid */}
        {filtered.length === 0 ? (
          <EmptyState onNew={handleNewDocument} t={t} />
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((doc) => (
              <DocumentCard
                key={doc.id}
                doc={doc}
                onOpen={() => void handleOpenDocument(doc.id)}
                onDuplicate={() => void handleDuplicate(doc.id)}
                onDelete={() => void handleDeleteDocument(doc.id)}
                t={t}
              />
            ))}
          </div>
        )}
      </main>

      {showKofi && <KoFiBanner />}
      <Footer />
      <AllModals />
    </div>
  );
}

function EmptyState({ onNew, t }: { onNew: () => void; t: (k: string) => string }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <BookOpen size={56} className="mb-4 text-[--color-forge-purple] opacity-30" strokeWidth={1.5} />
      <h2 className="text-lg font-semibold text-slate-700 dark:text-slate-300">{t('dashboard.empty')}</h2>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{t('dashboard.emptyDesc')}</p>
      <button
        onClick={onNew}
        className="mt-6 inline-flex items-center gap-2 rounded-lg bg-[--color-forge-purple] px-5 py-2.5 text-sm font-medium text-white shadow hover:bg-[--color-forge-purple-700] transition"
      >
        <Plus size={16} />
        {t('dashboard.new')}
      </button>
    </div>
  );
}

function DocumentCard({
  doc, onOpen, onDuplicate, onDelete, t,
}: {
  doc: DocumentMeta;
  onOpen: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
  t: (k: string) => string;
}) {
  const [showActions, setShowActions] = useState(false);
  const ago = formatRelative(doc.updatedAt);

  return (
    <div
      className="group relative flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md dark:border-slate-700 dark:bg-slate-800"
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      {/* Thumbnail / preview */}
      <button
        onClick={onOpen}
        className="aspect-[3/4] w-full overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800"
        aria-label={`${t('dashboard.actions.open')}: ${doc.title}`}
      >
        {doc.thumbnail ? (
          <img src={doc.thumbnail} alt="" className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <FileText size={40} className="text-[--color-forge-purple] opacity-40" strokeWidth={1.5} />
          </div>
        )}
      </button>

      {/* Info */}
      <div className="flex flex-col gap-1 p-3">
        <button
          onClick={onOpen}
          className="truncate text-left text-sm font-semibold text-slate-800 hover:text-[--color-forge-purple] dark:text-slate-100"
        >
          {doc.title || t('editor.untitled')}
        </button>
        <div className="flex items-center gap-1 text-xs text-slate-400">
          <Clock size={11} />
          <span>{ago}</span>
          <span className="mx-1 opacity-40">·</span>
          <span>{doc.pageCount === 1 ? t('dashboard.page') : t('dashboard.pages').replace('{n}', String(doc.pageCount))}</span>
        </div>
      </div>

      {/* Quick actions */}
      {showActions && (
        <div className="absolute right-2 top-2 flex gap-1 rounded-lg bg-white/90 p-1 shadow-lg backdrop-blur dark:bg-slate-800/90">
          <ActionBtn icon={Edit3} label={t('dashboard.actions.open')} onClick={onOpen} />
          <ActionBtn icon={Copy} label={t('dashboard.actions.duplicate')} onClick={onDuplicate} />
          <ActionBtn icon={Download} label={t('dashboard.actions.export')} onClick={() => {}} />
          <ActionBtn icon={Trash2} label={t('dashboard.actions.delete')} onClick={onDelete} danger />
        </div>
      )}
    </div>
  );
}

function ActionBtn({ icon: Icon, label, onClick, danger = false }: { icon: typeof Trash2; label: string; onClick: () => void; danger?: boolean }) {
  return (
    <button
      onClick={(e) => { e.stopPropagation(); onClick(); }}
      title={label}
      className={`rounded p-1.5 transition ${danger ? 'hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/40' : 'hover:bg-slate-100 dark:hover:bg-slate-700'} text-slate-600 dark:text-slate-300`}
    >
      <Icon size={13} />
    </button>
  );
}

function formatRelative(ts: number): string {
  const diff = Date.now() - ts;
  const m = Math.floor(diff / 60_000);
  if (m < 1) return 'Adesso';
  if (m < 60) return `${m} min fa`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h fa`;
  const d = Math.floor(h / 24);
  return `${d}g fa`;
}
