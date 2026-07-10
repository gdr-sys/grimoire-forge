import type { GrimoireDocument } from '../types/document';

export async function importFromJsonFile(file: File): Promise<GrimoireDocument> {
  const text = await file.text();
  return importFromJsonString(text);
}

export function importFromJsonString(json: string): GrimoireDocument {
  const data = JSON.parse(json) as GrimoireDocument;
  // Basic validation
  if (!data.id || !data.pages || !data.blocks) {
    throw new Error('Invalid Grimoire Forge document format');
  }
  // Re-assign a new ID to avoid conflicts when importing
  return { ...data, id: crypto.randomUUID(), driveFileId: null, syncStatus: 'local-only' };
}
