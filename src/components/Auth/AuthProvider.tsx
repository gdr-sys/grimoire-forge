// Auth state is managed by useAuthStore and observed in App.tsx via onAuthStateChanged.
// This file re-exports the auth hooks for convenience.
export { useAuthStore } from '../../stores/authStore';
