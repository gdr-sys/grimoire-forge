import type { GrimoireDocument } from '../types/document';
import { createEmptyDocument } from '../types/document';
import { createBlock } from './blockFactory';
import { DEFAULT_PAGE } from '../types/page';
import type { Page } from '../types/page';

/**
 * Best-effort converter from Homebrewery Markdown to Grimoire Forge document.
 * Handles the most common constructs: headings, paragraphs, stat blocks, notes.
 */
export function importFromHomebrewery(markdown: string): GrimoireDocument {
  const doc = createEmptyDocument('dnd5e-phb');
  const firstPage: Page = { ...DEFAULT_PAGE, id: crypto.randomUUID() };
  doc.pages = [firstPage];

  const lines = markdown.split('\n');
  let i = 0;
  let currentHtml = '';

  function flushText() {
    if (!currentHtml.trim()) return;
    const block = createBlock('text', { data: { html: currentHtml } });
    doc.blocks[block.id] = block;
    firstPage.blockIds.push(block.id);
    currentHtml = '';
  }

  while (i < lines.length) {
    const line = lines[i];

    if (/^#{1,4} /.test(line)) {
      flushText();
      const level = line.match(/^(#{1,4})/)?.[1].length ?? 2;
      const text = line.replace(/^#{1,4} /, '').trim();
      const hLevel = (['h1', 'h2', 'h3', 'h4'] as const)[Math.min(level - 1, 3)];
      const block = createBlock('heading', { data: { level: hLevel, text, showDropCap: false } });
      doc.blocks[block.id] = block;
      firstPage.blockIds.push(block.id);
    } else if (line.startsWith('> ')) {
      currentHtml += `<blockquote>${line.slice(2)}</blockquote>`;
    } else if (line.trim() === '___' || line.trim() === '---') {
      flushText();
      const block = createBlock('divider');
      doc.blocks[block.id] = block;
      firstPage.blockIds.push(block.id);
    } else if (line.trim()) {
      currentHtml += `<p>${line}</p>`;
    }

    i++;
  }

  flushText();
  return doc;
}
