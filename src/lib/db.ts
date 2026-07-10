import Dexie, { type Table } from 'dexie';
import type { StoredImage } from '../types/image';

interface DocumentRecord {
  id: string;
  title: string;
  data: string;
  presetId: string;
  updatedAt: number;
  createdAt: number;
  driveFileId: string | null;
  syncStatus: string;
  thumbnail: string | null;
}

class GrimoireDB extends Dexie {
  documents!: Table<DocumentRecord>;
  images!: Table<StoredImage>;

  constructor() {
    super('grimoire-forge-db');
    this.version(1).stores({
      documents: 'id, updatedAt, createdAt, syncStatus, driveFileId',
      images: 'id, syncStatus, createdAt, driveFileId',
    });
  }
}

export const db = new GrimoireDB();
