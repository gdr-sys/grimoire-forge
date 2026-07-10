import { initializeApp, type FirebaseApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, type Auth } from 'firebase/auth';

const apiKey = import.meta.env.VITE_FIREBASE_API_KEY;
const authDomain = import.meta.env.VITE_FIREBASE_AUTH_DOMAIN;
const projectId = import.meta.env.VITE_FIREBASE_PROJECT_ID;

export const isFirebaseConfigured = Boolean(apiKey && authDomain && projectId);

let app: FirebaseApp;
let auth: Auth;
let googleProvider: GoogleAuthProvider;

if (isFirebaseConfigured) {
  app = initializeApp({ apiKey, authDomain, projectId });
  auth = getAuth(app);
  googleProvider = new GoogleAuthProvider();
  googleProvider.addScope('https://www.googleapis.com/auth/drive.file');
  googleProvider.setCustomParameters({ access_type: 'offline', prompt: 'consent' });
} else {
  // Stub — avoids crash when env vars are missing (e.g. dev senza .env)
  app = {} as FirebaseApp;
  auth = {
    onAuthStateChanged: (_next: unknown, _error?: unknown) => () => {},
    currentUser: null,
  } as unknown as Auth;
  googleProvider = new GoogleAuthProvider();
}

export { app, auth, googleProvider };
export default app;
