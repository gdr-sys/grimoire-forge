import { create } from 'zustand';

type ModalKey =
  | 'export'
  | 'import'
  | 'settings'
  | 'welcome'
  | 'loginPrompt'
  | 'templateGallery'
  | 'presetPreview'
  | 'imageGallery'
  | 'shortcuts'
  | 'changelog'
  | 'confirm'
  | 'drivePicker'
  | null;

interface ConfirmOptions {
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
}

interface UiState {
  activeModal: ModalKey;
  confirmOptions: ConfirmOptions | null;
  selectedBlockId: string | null;
  activePageIndex: number;
  zoom: number;
  isFullscreen: boolean;
  isSidebarOpen: boolean;
  isPropertiesPanelOpen: boolean;
  activeSidebarTab: 'blocks' | 'pages' | 'presets';

  openModal: (modal: NonNullable<ModalKey>) => void;
  closeModal: () => void;
  openLoginPrompt: () => void;
  openConfirm: (opts: ConfirmOptions) => void;
  setSelectedBlock: (id: string | null) => void;
  setActivePageIndex: (idx: number) => void;
  setZoom: (zoom: number) => void;
  zoomIn: () => void;
  zoomOut: () => void;
  zoomReset: () => void;
  toggleFullscreen: () => void;
  toggleSidebar: () => void;
  togglePropertiesPanel: () => void;
  setActiveSidebarTab: (tab: UiState['activeSidebarTab']) => void;
}

export const useUiStore = create<UiState>((set) => ({
  activeModal: null,
  confirmOptions: null,
  selectedBlockId: null,
  activePageIndex: 0,
  zoom: 1,
  isFullscreen: false,
  isSidebarOpen: true,
  isPropertiesPanelOpen: true,
  activeSidebarTab: 'blocks',

  openModal: (modal) => set({ activeModal: modal }),
  closeModal: () => set({ activeModal: null, confirmOptions: null }),
  openLoginPrompt: () => set({ activeModal: 'loginPrompt' }),
  openConfirm: (opts) => set({ activeModal: 'confirm', confirmOptions: opts }),
  setSelectedBlock: (selectedBlockId) => set({ selectedBlockId }),
  setActivePageIndex: (activePageIndex) => set({ activePageIndex }),
  setZoom: (zoom) => set({ zoom: Math.min(3, Math.max(0.25, zoom)) }),
  zoomIn: () => set((s) => ({ zoom: Math.min(3, s.zoom + 0.1) })),
  zoomOut: () => set((s) => ({ zoom: Math.max(0.25, s.zoom - 0.1) })),
  zoomReset: () => set({ zoom: 1 }),
  toggleFullscreen: () => set((s) => ({ isFullscreen: !s.isFullscreen })),
  toggleSidebar: () => set((s) => ({ isSidebarOpen: !s.isSidebarOpen })),
  togglePropertiesPanel: () =>
    set((s) => ({ isPropertiesPanelOpen: !s.isPropertiesPanelOpen })),
  setActiveSidebarTab: (activeSidebarTab) => set({ activeSidebarTab }),
}));
