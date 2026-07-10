/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_FIREBASE_API_KEY: string;
  readonly VITE_FIREBASE_AUTH_DOMAIN: string;
  readonly VITE_FIREBASE_PROJECT_ID: string;
  readonly VITE_GOOGLE_CLIENT_ID: string;
  readonly VITE_KOFI_URL?: string;
  readonly VITE_PORTFOLIO_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
