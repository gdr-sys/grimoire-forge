import { useAuthStore } from '../stores/authStore';

export function useAuth() {
  return {
    user: useAuthStore((s) => s.user),
    isLoading: useAuthStore((s) => s.isLoading),
    oauthToken: useAuthStore((s) => s.oauthToken),
  };
}
