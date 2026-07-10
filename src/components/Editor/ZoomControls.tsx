import { ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';
import { useZoom } from '../../hooks/useZoom';
import { useTranslation } from '../../hooks/useTranslation';

export function ZoomControls() {
  const { zoom, zoomIn, zoomOut, zoomReset } = useZoom();
  const { t } = useTranslation();

  return (
    <div className="absolute bottom-4 right-4 flex items-center gap-1 rounded-lg border border-[--color-app-border] bg-[--color-app-toolbar] px-2 py-1 shadow-md dark:border-[--color-dark-border] dark:bg-[--color-dark-toolbar]">
      <button
        onClick={zoomOut}
        className="rounded p-1 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700"
        aria-label="Zoom out"
        title="Riduci (Ctrl+-)"
      >
        <ZoomOut size={14} />
      </button>
      <button
        onClick={zoomReset}
        className="min-w-[3rem] text-center text-xs font-medium text-slate-600 hover:text-[--color-forge-purple] dark:text-slate-300"
        title={t('editor.zoomReset')}
      >
        {Math.round(zoom * 100)}%
      </button>
      <button
        onClick={zoomIn}
        className="rounded p-1 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700"
        aria-label="Zoom in"
        title="Ingrandisci (Ctrl++)"
      >
        <ZoomIn size={14} />
      </button>
      <div className="mx-1 h-3 w-px bg-slate-200 dark:bg-slate-700" />
      <button
        className="rounded p-1 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700"
        aria-label={t('editor.zoomFit')}
        title={t('editor.zoomFit')}
      >
        <Maximize2 size={14} />
      </button>
    </div>
  );
}
