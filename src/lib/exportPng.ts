import html2canvas from 'html2canvas';
import type { ExportOptions } from '../types/export';

export async function exportPageToPng(
  pageEl: HTMLElement,
  options: ExportOptions,
): Promise<Blob> {
  const scale = options.quality === 'print' ? 3 : options.quality === 'high' ? 2 : 1;
  const canvas = await html2canvas(pageEl, {
    scale,
    useCORS: true,
    allowTaint: false,
    backgroundColor: options.includeBackground ? null : '#ffffff',
    logging: false,
  });

  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error('PNG export failed'))),
      'image/png',
    );
  });
}
