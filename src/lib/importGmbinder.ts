import type { GrimoireDocument } from '../types/document';
import { importFromHomebrewery } from './importHomebrewery';

/** GMBinder uses a very similar Markdown dialect to Homebrewery. */
export function importFromGmbinder(markdown: string): GrimoireDocument {
  return importFromHomebrewery(markdown);
}
