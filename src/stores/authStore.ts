import { create } from 'zustand';
import type { User } from '../types/auth';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  /** OAuth access token for Google Drive API calls. Kept in memory, never localStorage. */
  oauthToken: string | null;
  tokenExpiry: number | null;
  setUser: (user: User | null) => void;
  setOauthToken: (token: string | null, expiresIn?: number) => void;
  setLoading: (loading: boolean) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: true,
  oauthToken: null,
  tokenExpiry: null,
  setUser: (user) => set({ user }),
  setOauthToken: (token, expiresIn = 3600) =>
    set({
      oauthToken: token,
      tokenExpiry: token ? Date.now() + expiresIn * 1000 : null,
    }),
  setLoading: (isLoading) => set({ isLoading }),
  clearAuth: () =>
    set({ user: null, oauthToken: null, tokenExpiry: null, isLoading: false }),
}));
