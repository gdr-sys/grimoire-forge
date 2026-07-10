import { BookOpen, Sun, Moon, Settings, Keyboard, Menu } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '../../hooks/useTranslation';
import { useSettingsStore } from '../../stores/settingsStore';
import { useUiStore } from '../../stores/uiStore';
import { useDocumentStore } from '../../stores/documentStore';
import { useAuthStore } from '../../stores/authStore';
import { SyncIndicator } from '../Sync/SyncIndicator';
import { UserMenu } from '../Auth/UserMenu';
import { LoginButton } from '../Auth/LoginButton';
import { APP_NAME } from '../../lib/constants';

export function Header() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const toggleTheme = useSettingsStore((s) => s.toggleTheme);
  const theme = useSettingsStore((s) => s.theme);
  const openModal = useUiStore((s) => s.openModal);
  const toggleSidebar = useUiStore((s) => s.toggleSidebar);
  const user = useAuthStore((s) => s.user);
  const isDirty = useDocumentStore((s) => s.isDirty);
  const currentDocument = useDocumentStore((s) => s.currentDocument);
  const isEditorPage = Boolean(currentDocument);

  return (
    <header className="sticky top-0 z-50 flex h-14 items-center gap-2 border-b border-[--color-app-border] bg-[--color-app-toolbar] px-3 shadow-sm dark:border-[--color-dark-border] dark:bg-[--color-dark-toolbar]">
      {/* Logo */}
      <button
        onClick={() => navigate('/')}
        className="flex items-center gap-2 rounded-md px-2 py-1 transition hover:bg-slate-100 dark:hover:bg-slate-700"
        aria-label={APP_NAME}
      >
        <BookOpen size={20} className="text-[--color-forge-purple]" />
        <span className="hidden font-bold text-slate-800 dark:text-slate-100 sm:block">
          {APP_NAME}
        </span>
      </button>

      {/* Mobile sidebar toggle (editor only) */}
      {isEditorPage && (
        <button
          onClick={toggleSidebar}
          className="rounded-md p-1.5 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-700 lg:hidden"
          aria-label="Menu"
        >
          <Menu size={18} />
        </button>
      )}

      {/* Document title (editor only) */}
      {isEditorPage && currentDocument && (
        <div className="flex min-w-0 flex-1 items-center gap-2">
          <DocumentTitleInput />
          {isDirty && (
            <span className="hidden shrink-0 text-xs text-slate-400 sm:block">
              {t('editor.saving')}
            </span>
          )}
        </div>
      )}

      {!isEditorPage && <div className="flex-1" />}

      {/* Right actions */}
      <div className="flex items-center gap-1">
        {isEditorPage && <SyncIndicator />}

        <button
          onClick={toggleTheme}
          className="rounded-md p-1.5 text-slate-500 transition hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-700"
          aria-label={theme === 'light' ? t('settings.theme.dark') : t('settings.theme.light')}
          title={theme === 'light' ? t('settings.theme.dark') : t('settings.theme.light')}
        >
          {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
        </button>

        <button
          onClick={() => openModal('shortcuts')}
          className="hidden rounded-md p-1.5 text-slate-500 transition hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-700 sm:block"
          aria-label={t('nav.shortcuts')}
          title={t('nav.shortcuts')}
        >
          <Keyboard size={16} />
        </button>

        <button
          onClick={() => openModal('settings')}
          className="rounded-md p-1.5 text-slate-500 transition hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-700"
          aria-label={t('nav.settings')}
          title={t('nav.settings')}
        >
          <Settings size={16} />
        </button>

        {user ? <UserMenu /> : <LoginButton />}
      </div>
    </header>
  );
}

function DocumentTitleInput() {
  const { t } = useTranslation();
  const currentDocument = useDocumentStore((s) => s.currentDocument);
  const updateTitle = useDocumentStore((s) => s.updateTitle);

  if (!currentDocument) return null;

  return (
    <input
      type="text"
      value={currentDocument.title}
      onChange={(e) => updateTitle(e.target.value)}
      placeholder={t('editor.untitled')}
      className="min-w-0 flex-1 truncate rounded bg-transparent px-1 py-0.5 text-sm font-medium text-slate-700 transition focus:bg-white focus:outline focus:outline-2 focus:outline-[--color-forge-purple] dark:text-slate-200 dark:focus:bg-slate-800"
      aria-label="Titolo documento"
    />
  );
}
