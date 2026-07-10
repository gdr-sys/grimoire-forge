import { useRef, useState } from 'react';
import { toast } from 'sonner';
import { useTranslation } from './useTranslation';
import { exportToPdf } from '../lib/exportPdf';
import { exportPageToPng } from '../lib/exportPng';
import { exportToHtml } from '../lib/exportHtml';
import { exportToJson } from '../lib/exportJson';
import { useDocumentStore } from '../stores/documentStore';
import type { ExportOptions } from '../types/export';
import { DEFAULT_EXPORT_OPTIONS } from '../types/export';

export function useExport() {
  const { t } = useTranslation();
  const currentDocument = useDocumentStore((s) => s.currentDocument);
  const canvasRef = useRef<HTMLElement | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  async function exportDocument(options: Partial<ExportOptions> = {}): Promise<void> {
    if (!currentDocument) return;
    const opts = { ...DEFAULT_EXPORT_OPTIONS, ...options };
    const container = document.getElementById('gf-editor-canvas');
    if (!container) { toast.error(t('export.error')); return; }

    setIsExporting(true);
    try {
      switch (opts.format) {
        case 'pdf': await exportToPdf(container as HTMLElement, opts); break;
        case 'png': {
          const blob = await exportPageToPng(container as HTMLElement, opts);
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url; a.download = `${opts.fileName}.png`; a.click();
          URL.revokeObjectURL(url);
          break;
        }
        case 'html': exportToHtml(currentDocument, container as HTMLElement); break;
        case 'json': exportToJson(currentDocument); break;
      }
      toast.success(t('export.success'));
    } catch {
      toast.error(t('export.error'));
    } finally {
      setIsExporting(false);
    }
  }

  async function exportAs(format: ExportOptions['format']): Promise<void> {
    return exportDocument({ format });
  }

  return { exportDocument, exportAs, isExporting, canvasRef };
}
