import { lazy, Suspense } from 'react';
import { useUiStore } from '../../stores/uiStore';

const ExportModal = lazy(() => import('../Modals/ExportModal').then((m) => ({ default: m.ExportModal })));
const ImportModal = lazy(() => import('../Modals/ImportModal').then((m) => ({ default: m.ImportModal })));
const SettingsModal = lazy(() => import('../Modals/SettingsModal').then((m) => ({ default: m.SettingsModal })));
const WelcomeModal = lazy(() => import('../Modals/WelcomeModal').then((m) => ({ default: m.WelcomeModal })));
const LoginPromptModal = lazy(() => import('../Modals/LoginPromptModal').then((m) => ({ default: m.LoginPromptModal })));
const ConfirmModal = lazy(() => import('../Modals/ConfirmModal').then((m) => ({ default: m.ConfirmModal })));
const KeyboardShortcutsModal = lazy(() => import('../Modals/KeyboardShortcutsModal').then((m) => ({ default: m.KeyboardShortcutsModal })));
const PresetPreviewModal = lazy(() => import('../Modals/PresetPreviewModal').then((m) => ({ default: m.PresetPreviewModal })));
const ImageGalleryModal = lazy(() => import('../Modals/ImageGalleryModal').then((m) => ({ default: m.ImageGalleryModal })));
const TemplateGalleryModal = lazy(() => import('../Modals/TemplateGalleryModal').then((m) => ({ default: m.TemplateGalleryModal })));
const ChangelogModal = lazy(() => import('../Modals/ChangelogModal').then((m) => ({ default: m.ChangelogModal })));
const DrivePickerModal = lazy(() => import('../Modals/DrivePickerModal').then((m) => ({ default: m.DrivePickerModal })));

export function AllModals() {
  const activeModal = useUiStore((s) => s.activeModal);

  return (
    <Suspense fallback={null}>
      {activeModal === 'export' && <ExportModal />}
      {activeModal === 'import' && <ImportModal />}
      {activeModal === 'settings' && <SettingsModal />}
      {activeModal === 'welcome' && <WelcomeModal />}
      {activeModal === 'loginPrompt' && <LoginPromptModal />}
      {activeModal === 'confirm' && <ConfirmModal />}
      {activeModal === 'shortcuts' && <KeyboardShortcutsModal />}
      {activeModal === 'presetPreview' && <PresetPreviewModal />}
      {activeModal === 'imageGallery' && <ImageGalleryModal />}
      {activeModal === 'templateGallery' && <TemplateGalleryModal />}
      {activeModal === 'changelog' && <ChangelogModal />}
      {activeModal === 'drivePicker' && <DrivePickerModal />}
    </Suspense>
  );
}
