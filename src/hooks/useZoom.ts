import { useUiStore } from '../stores/uiStore';

export function useZoom() {
  return {
    zoom: useUiStore((s) => s.zoom),
    setZoom: useUiStore((s) => s.setZoom),
    zoomIn: useUiStore((s) => s.zoomIn),
    zoomOut: useUiStore((s) => s.zoomOut),
    zoomReset: useUiStore((s) => s.zoomReset),
  };
}
