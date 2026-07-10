import { googleDrive } from '../services/googleDrive';
import { useAuthStore } from '../stores/authStore';

export function useGoogleDrive() {
  const user = useAuthStore((s) => s.user);
  const isAvailable = Boolean(user && useAuthStore.getState().oauthToken);

  return {
    isAvailable,
    listDocuments: googleDrive.listDocuments.bind(googleDrive),
    loadDocument: googleDrive.loadDocument.bind(googleDrive),
    deleteFile: googleDrive.deleteFile.bind(googleDrive),
  };
}
