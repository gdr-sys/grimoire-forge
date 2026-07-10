import type { ReactNode } from 'react';
import { useAuthStore } from '../../stores/authStore';

interface AuthGuardProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export function AuthGuard({ children, fallback = null }: AuthGuardProps) {
  const user = useAuthStore((s) => s.user);
  if (!user) return <>{fallback}</>;
  return <>{children}</>;
}
