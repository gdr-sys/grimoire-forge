import { useState } from 'react';
import { Search } from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';
import { useDocumentStore } from '../../stores/documentStore';
import { useUiStore } from '../../stores/uiStore';
import { useHistoryStore } from '../../stores/historyStore';
import { createBlock } from '../../lib/blockFactory';
import type { BlockType } from '../../types/block';

interface PaletteItem {
  type: BlockType;
  label: string;
  icon: string;
  category: string;
}

const PALETTE_ITEMS: PaletteItem[] = [
  // Testo
  { type: 'heading', label: 'Titolo', icon: 'H', category: 'Testo' },
  { type: 'text', label: 'Testo', icon: '¶', category: 'Testo' },
  { type: 'quote', label: 'Citazione', icon: '"', category: 'Testo' },
  { type: 'note', label: 'Nota / Callout', icon: '📌', category: 'Testo' },
  { type: 'custom-html', label: 'HTML libero', icon: '<>', category: 'Testo' },
  // Layout
  { type: 'divider', label: 'Divisore', icon: '—', category: 'Layout' },
  { type: 'spacer', label: 'Spaziatore', icon: '↕', category: 'Layout' },
  { type: 'page-break', label: 'Interruzione pagina', icon: '⏎', category: 'Layout' },
  // Media
  { type: 'image', label: 'Immagine', icon: '🖼', category: 'Media' },
  // GDR
  { type: 'statblock-dnd5e', label: 'Stat Block D&D 5e', icon: '⚔', category: 'GDR' },
  { type: 'spell', label: 'Incantesimo', icon: '✨', category: 'GDR' },
  { type: 'item', label: 'Oggetto magico', icon: '🗡', category: 'GDR' },
  { type: 'encounter', label: 'Incontro', icon: '⚡', category: 'GDR' },
  { type: 'class-feature', label: 'Feature di classe', icon: '🛡', category: 'GDR' },
  { type: 'feat', label: 'Talento', icon: '⭐', category: 'GDR' },
  { type: 'background', label: 'Background', icon: '📜', category: 'GDR' },
  { type: 'race', label: 'Tratto razziale', icon: '🧝', category: 'GDR' },
  // Dati
  { type: 'table', label: 'Tabella', icon: '⊞', category: 'Dati' },
  { type: 'random-table', label: 'Tabella casuale', icon: '🎲', category: 'Dati' },
  // Struttura
  { type: 'toc', label: 'Indice', icon: '📋', category: 'Struttura' },
  { type: 'cover-page', label: 'Copertina', icon: '📖', category: 'Struttura' },
  { type: 'watermark', label: 'Filigrana', icon: '💧', category: 'Struttura' },
];

const CATEGORIES = [...new Set(PALETTE_ITEMS.map((i) => i.category))];

export function BlocksPalette() {
  const { t } = useTranslation();
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const currentDocument = useDocumentStore((s) => s.currentDocument);
  const activePageIndex = useUiStore((s) => s.activePageIndex);
  const addBlock = useDocumentStore((s) => s.addBlock);
  const setSelectedBlock = useUiStore((s) => s.setSelectedBlock);
  const pushHistory = useHistoryStore((s) => s.push);

  const filtered = PALETTE_ITEMS.filter((item) => {
    const matchSearch = !search || item.label.toLowerCase().includes(search.toLowerCase()) || item.type.includes(search.toLowerCase());
    const matchCat = activeCategory === null || item.category === activeCategory;
    return matchSearch && matchCat;
  });

  function handleAddBlock(type: BlockType) {
    if (!currentDocument) return;
    const page = currentDocument.pages[activePageIndex];
    if (!page) return;
    pushHistory(currentDocument);
    const block = createBlock(type);
    addBlock(block, page.id);
    setSelectedBlock(block.id);
  }

  return (
    <div className="flex flex-col gap-2 p-3">
      <div className="relative">
        <Search size={13} className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t('blocks.search')}
          className="w-full rounded-md border border-[--color-app-border] bg-transparent py-1.5 pl-7 pr-2 text-xs outline-none placeholder:text-slate-400 focus:border-[--color-forge-purple] dark:border-[--color-dark-border]"
        />
      </div>

      {!search && (
        <div className="flex flex-wrap gap-1">
          <button
            onClick={() => setActiveCategory(null)}
            className={`rounded-full px-2 py-0.5 text-xs ${activeCategory === null ? 'bg-[--color-forge-purple] text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300'}`}
          >
            Tutti
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(activeCategory === cat ? null : cat)}
              className={`rounded-full px-2 py-0.5 text-xs ${activeCategory === cat ? 'bg-[--color-forge-purple] text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300'}`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      <div className="grid grid-cols-2 gap-1">
        {filtered.map((item) => (
          <button
            key={item.type}
            onClick={() => handleAddBlock(item.type)}
            className="flex items-center gap-2 rounded-md border border-[--color-app-border] px-2 py-1.5 text-left text-xs transition hover:border-[--color-forge-purple] hover:bg-[--color-forge-purple]/5 dark:border-[--color-dark-border] dark:text-slate-300"
            title={`Aggiungi ${item.label}`}
          >
            <span className="w-5 shrink-0 text-center text-sm" aria-hidden>{item.icon}</span>
            <span className="truncate">{item.label}</span>
          </button>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="py-4 text-center text-xs text-slate-400">{t('blocks.noResults')}</p>
      )}
    </div>
  );
}
