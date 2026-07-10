import { useAuthStore } from '../stores/authStore';
import type { DriveFile, DriveFolderStructure } from '../types/drive';

const DRIVE_API = 'https://www.googleapis.com/drive/v3';
const DRIVE_UPLOAD_API = 'https://www.googleapis.com/upload/drive/v3';
const APP_PROPERTIES = { appId: 'grimoire-forge', docVersion: '1' };
const ROOT_FOLDER_NAME = 'Grimoire Forge';
const DOCUMENTS_FOLDER_NAME = 'documents';
const IMAGES_FOLDER_NAME = 'images';

async function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

async function fetchWithRetry(
  url: string,
  options: RequestInit,
  retries = 3,
): Promise<Response> {
  for (let i = 0; i < retries; i++) {
    const res = await fetch(url, options);
    if (res.status === 429 || res.status >= 500) {
      if (i < retries - 1) await sleep(1000 * 2 ** i);
      else return res;
      continue;
    }
    return res;
  }
  throw new Error('Request failed after retries');
}

class GoogleDriveService {
  private folderStructure: DriveFolderStructure | null = null;

  private getHeaders(): HeadersInit {
    const token = useAuthStore.getState().oauthToken;
    if (!token) throw new Error('No OAuth token — user not authenticated');
    return {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
  }

  private async findOrCreateFolder(
    name: string,
    parentId?: string,
  ): Promise<string> {
    const q = [
      `name='${name}'`,
      `mimeType='application/vnd.google-apps.folder'`,
      `trashed=false`,
      ...(parentId ? [`'${parentId}' in parents`] : ['sharedWithMe=false']),
    ].join(' and ');

    const res = await fetchWithRetry(
      `${DRIVE_API}/files?q=${encodeURIComponent(q)}&fields=files(id,name)`,
      { headers: this.getHeaders() },
    );
    const data = (await res.json()) as { files: DriveFile[] };
    if (data.files?.length > 0) return data.files[0].id;

    const createRes = await fetchWithRetry(`${DRIVE_API}/files`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({
        name,
        mimeType: 'application/vnd.google-apps.folder',
        ...(parentId ? { parents: [parentId] } : {}),
      }),
    });
    const folder = (await createRes.json()) as DriveFile;
    return folder.id;
  }

  async initializeFolder(): Promise<DriveFolderStructure> {
    if (this.folderStructure) return this.folderStructure;
    const rootFolderId = await this.findOrCreateFolder(ROOT_FOLDER_NAME);
    const documentsFolderId = await this.findOrCreateFolder(
      DOCUMENTS_FOLDER_NAME,
      rootFolderId,
    );
    const imagesFolderId = await this.findOrCreateFolder(
      IMAGES_FOLDER_NAME,
      rootFolderId,
    );
    this.folderStructure = { rootFolderId, documentsFolderId, imagesFolderId };
    return this.folderStructure;
  }

  async listDocuments(): Promise<DriveFile[]> {
    const { documentsFolderId } = await this.initializeFolder();
    const q = `'${documentsFolderId}' in parents and trashed=false and appProperties has { key='appId' and value='grimoire-forge' }`;
    const res = await fetchWithRetry(
      `${DRIVE_API}/files?q=${encodeURIComponent(q)}&fields=files(id,name,modifiedTime,size,appProperties,webContentLink)&orderBy=modifiedTime desc`,
      { headers: this.getHeaders() },
    );
    const data = (await res.json()) as { files: DriveFile[] };
    return data.files ?? [];
  }

  async saveDocument(
    docId: string,
    content: string,
    name: string,
    driveFileId: string | null,
  ): Promise<string> {
    const { documentsFolderId } = await this.initializeFolder();
    const metadata = {
      name: `${docId}.json`,
      mimeType: 'application/json',
      appProperties: { ...APP_PROPERTIES, docTitle: name },
    };

    if (driveFileId) {
      // Update existing file
      await fetchWithRetry(
        `${DRIVE_UPLOAD_API}/files/${driveFileId}?uploadType=media`,
        {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${useAuthStore.getState().oauthToken}`,
            'Content-Type': 'application/json',
          },
          body: content,
        },
      );
      return driveFileId;
    }

    // Create new file (multipart upload)
    const boundary = 'boundary_grimoire';
    const body = [
      `--${boundary}`,
      'Content-Type: application/json; charset=UTF-8',
      '',
      JSON.stringify({ ...metadata, parents: [documentsFolderId] }),
      `--${boundary}`,
      'Content-Type: application/json',
      '',
      content,
      `--${boundary}--`,
    ].join('\r\n');

    const res = await fetchWithRetry(
      `${DRIVE_UPLOAD_API}/files?uploadType=multipart&fields=id`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${useAuthStore.getState().oauthToken}`,
          'Content-Type': `multipart/related; boundary=${boundary}`,
        },
        body,
      },
    );
    const file = (await res.json()) as DriveFile;
    return file.id;
  }

  async loadDocument(fileId: string): Promise<string> {
    const res = await fetchWithRetry(
      `${DRIVE_API}/files/${fileId}?alt=media`,
      { headers: this.getHeaders() },
    );
    return res.text();
  }

  async deleteFile(fileId: string): Promise<void> {
    await fetchWithRetry(`${DRIVE_API}/files/${fileId}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    });
  }

  async uploadImage(
    blob: Blob,
    fileName: string,
    imageId: string,
  ): Promise<string> {
    const { imagesFolderId } = await this.initializeFolder();
    const metadata = {
      name: `${imageId}-${fileName}`,
      mimeType: 'image/webp',
      parents: [imagesFolderId],
      appProperties: { ...APP_PROPERTIES, imageId },
    };

    const boundary = 'boundary_grimoire_img';
    const metaPart = JSON.stringify(metadata);
    const blobBuffer = await blob.arrayBuffer();

    // Build multipart body manually
    const encoder = new TextEncoder();
    const metaBytes = encoder.encode(
      `--${boundary}\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n${metaPart}\r\n--${boundary}\r\nContent-Type: image/webp\r\n\r\n`,
    );
    const endBytes = encoder.encode(`\r\n--${boundary}--`);
    const body = new Uint8Array(
      metaBytes.byteLength + blobBuffer.byteLength + endBytes.byteLength,
    );
    body.set(metaBytes, 0);
    body.set(new Uint8Array(blobBuffer), metaBytes.byteLength);
    body.set(endBytes, metaBytes.byteLength + blobBuffer.byteLength);

    const res = await fetchWithRetry(
      `${DRIVE_UPLOAD_API}/files?uploadType=multipart&fields=id`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${useAuthStore.getState().oauthToken}`,
          'Content-Type': `multipart/related; boundary=${boundary}`,
        },
        body,
      },
    );
    const file = (await res.json()) as DriveFile;
    return file.id;
  }

  async downloadImage(fileId: string): Promise<Blob> {
    const res = await fetchWithRetry(`${DRIVE_API}/files/${fileId}?alt=media`, {
      headers: this.getHeaders(),
    });
    return res.blob();
  }

  getImageUrl(fileId: string): string {
    return `${DRIVE_API}/files/${fileId}?alt=media&access_token=${useAuthStore.getState().oauthToken}`;
  }

  invalidateFolderCache(): void {
    this.folderStructure = null;
  }
}

export const googleDrive = new GoogleDriveService();
