import { useEffect, lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import { I18nProvider } from './lib/i18n';
import { useSettingsStore } from './stores/settingsStore';
import { useAuthStore } from './stores/authStore';
import { auth, isFirebaseConfigured } from './services/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { startAutoSync, setupSyncListeners } from './services/syncManager';
import type { User } from './types/auth';

const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const EditorPage = lazy(() => import('./pages/EditorPage'));

function AuthWatcher() {
  const setUser = useAuthStore((s) => s.setUser);
  const setLoading = useAuthStore((s) => s.setLoading);
  const setOauthToken = useAuthStore((s) => s.setOauthToken);
  const autoSync = useSettingsStore((s) => s.autoSync);

  useEffect(() => {
    if (!isFirebaseConfigured) { setLoading(false); return; }
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const user: User = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          photoURL: firebaseUser.photoURL,
        };
        setUser(user);
        // Get the OAuth access token (includes Drive scope)
        const token = await firebaseUser.getIdToken();
        setOauthToken(token);
        if (autoSync) startAutoSync();
      } else {
        setUser(null);
        setOauthToken(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, [setUser, setLoading, setOauthToken, autoSync]);

  useEffect(() => {
    const cleanup = setupSyncListeners();
    return cleanup;
  }, []);

  return null;
}

function ThemeWatcher() {
  const theme = useSettingsStore((s) => s.theme);
  useEffect(() => {
    const html = document.documentElement;
    const applyDark = (dark: boolean) => {
      html.classList.toggle('dark', dark);
      html.setAttribute('data-theme', dark ? 'dark' : 'light');
    };
    if (theme === 'system') {
      const mq = window.matchMedia('(prefers-color-scheme: dark)');
      applyDark(mq.matches);
      const listener = (e: MediaQueryListEvent) => applyDark(e.matches);
      mq.addEventListener('change', listener);
      return () => mq.removeEventListener('change', listener);
    } else {
      applyDark(theme === 'dark');
    }
  }, [theme]);
  return null;
}

function AppShell() {
  return (
    <div className="min-h-screen bg-[--color-app-bg] dark:bg-[--color-dark-bg] text-[--color-app-text] dark:text-[--color-dark-text]">
      <AuthWatcher />
      <ThemeWatcher />
      <Suspense fallback={<AppLoader />}>
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/editor/:id" element={<EditorPage />} />
          <Route path="/editor" element={<EditorPage />} />
          <Route path="*" element={<DashboardPage />} />
        </Routes>
      </Suspense>
      <Toaster
        richColors
        position="bottom-right"
        toastOptions={{
          className: 'font-sans',
          duration: 3000,
        }}
      />
    </div>
  );
}

function AppLoader() {
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-[--color-forge-purple] border-t-transparent" />
        <p className="text-sm text-[--color-app-muted] dark:text-[--color-dark-muted]">Caricamento…</p>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <I18nProvider>
      <AppShell />
    </I18nProvider>
  );
}
