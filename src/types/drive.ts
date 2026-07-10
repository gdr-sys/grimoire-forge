export interface DriveFile {
  id: string;
  name: string;
  mimeType: string;
  modifiedTime: string;
  size?: string;
  appProperties?: Record<string, string>;
  webContentLink?: string;
  thumbnailLink?: string;
  parents?: string[];
}

export interface DriveFolderStructure {
  rootFolderId: string;
  documentsFolderId: string;
  imagesFolderId: string;
}

export interface DriveUploadOptions {
  name: string;
  mimeType: string;
  parents: string[];
  appProperties?: Record<string, string>;
}
