import { useState, useRef, useEffect } from 'react';
import { LogOut, ChevronDown } from 'lucide-react';
import { signOut } from 'firebase/auth';
import { auth } from '../../services/firebase';
import { useAuthStore } from '../../stores/authStore';
import { useTranslation } from '../../hooks/useTranslation';

export function UserMenu() {
  const { t } = useTranslation();
  const user = useAuthStore((s) => s.user);
  const clearAuth = useAuthStore((s) => s.clearAuth);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  if (!user) return null;

  async function handleSignOut() {
    await signOut(auth);
    clearAuth();
    setOpen(false);
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5 rounded-md px-2 py-1.5 text-sm transition hover:bg-slate-100 dark:hover:bg-slate-700"
      >
        {user.photoURL ? (
          <img src={user.photoURL} alt="" className="h-6 w-6 rounded-full" referrerPolicy="no-referrer" />
        ) : (
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[--color-forge-purple] text-xs font-bold text-white">
            {(user.displayName ?? user.email ?? '?')[0].toUpperCase()}
          </span>
        )}
        <ChevronDown size={12} className="text-slate-400" />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1 min-w-[180px] rounded-lg border border-slate-200 bg-white py-1 shadow-lg dark:border-slate-700 dark:bg-slate-800">
          <div className="border-b border-slate-100 px-3 py-2 dark:border-slate-700">
            <p className="truncate text-xs font-medium text-slate-700 dark:text-slate-200">
              {user.displayName ?? user.email}
            </p>
            {user.displayName && (
              <p className="truncate text-xs text-slate-400">{user.email}</p>
            )}
          </div>
          <button
            onClick={() => void handleSignOut()}
            className="flex w-full items-center gap-2 px-3 py-2 text-sm text-slate-600 transition hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-700"
          >
            <LogOut size={14} />
            {t('auth.logout')}
          </button>
        </div>
      )}
    </div>
  );
}
