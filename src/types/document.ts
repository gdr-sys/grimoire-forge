import type { Block } from './block';
import type { Page } from './page';
import type { PresetId } from './preset';
import type { SyncStatus } from './sync';

export interface GrimoireDocument {
  id: string;
  title: string;
  description: string;
  presetId: PresetId;
  pages: Page[];
  blocks: Record<string, Block>;
  tags: string[];
  createdAt: number;
  updatedAt: number;
  driveFileId: string | null;
  syncStatus: SyncStatus;
  version: number;
  thumbnail: string | null;
}

export interface DocumentMeta {
  id: string;
  title: string;
  description: string;
  presetId: PresetId;
  tags: string[];
  createdAt: number;
  updatedAt: number;
  driveFileId: string | null;
  syncStatus: SyncStatus;
  thumbnail: string | null;
  pageCount: number;
}

export function createEmptyDocument(presetId: PresetId = 'parchment-classic'): GrimoireDocument {
  const now = Date.now();
  return {
    id: crypto.randomUUID(),
    title: '',
    description: '',
    presetId,
    pages: [],
    blocks: {},
    tags: [],
    createdAt: now,
    updatedAt: now,
    driveFileId: null,
    syncStatus: 'local-only',
    version: 1,
    thumbnail: null,
  };
}
