import { LogIn } from 'lucide-react';
import { signInWithPopup } from 'firebase/auth';
import { toast } from 'sonner';
import { auth, googleProvider, isFirebaseConfigured } from '../../services/firebase';
import { useTranslation } from '../../hooks/useTranslation';
import { useAuthStore } from '../../stores/authStore';
import type { User } from '../../types/auth';

export function LoginButton() {
  const { t } = useTranslation();
  const isLoading = useAuthStore((s) => s.isLoading);
  const setUser = useAuthStore((s) => s.setUser);
  const setOauthToken = useAuthStore((s) => s.setOauthToken);

  async function handleLogin() {
    if (!isFirebaseConfigured) {
      toast.error('Firebase non configurato — aggiungi le variabili d\'ambiente.');
      return;
    }
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user: User = {
        uid: result.user.uid,
        email: result.user.email,
        displayName: result.user.displayName,
        photoURL: result.user.photoURL,
      };
      setUser(user);
      // Extract the OAuth access token for Drive API
      const credential = result as unknown as { _tokenResponse?: { oauthAccessToken?: string } };
      const token = credential._tokenResponse?.oauthAccessToken ?? null;
      if (token) setOauthToken(token);
    } catch {
      toast.error(t('auth.loginError'));
    }
  }

  return (
    <button
      onClick={() => void handleLogin()}
      disabled={isLoading}
      className="inline-flex items-center gap-1.5 rounded-md bg-[--color-forge-purple] px-3 py-1.5 text-xs font-medium text-white transition hover:bg-[--color-forge-purple-700] disabled:opacity-60"
    >
      <LogIn size={13} />
      <span className="hidden sm:block">{t('auth.login')}</span>
    </button>
  );
}
