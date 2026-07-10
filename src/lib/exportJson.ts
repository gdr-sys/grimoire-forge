import type { GrimoireDocument } from '../types/document';

export function exportToJson(doc: GrimoireDocument): void {
  const json = JSON.stringify(doc, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${slugify(doc.title || 'grimoire-forge-document')}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export function documentToJsonString(doc: GrimoireDocument): string {
  return JSON.stringify(doc, null, 2);
}

function slugify(str: string): string {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}
