import type { ExportOptions } from '../types/export';

/** Triggers browser print dialog — the cleanest PDF export available client-side. */
export async function exportToPdf(
  containerEl: HTMLElement,
  options: ExportOptions,
): Promise<void> {
  const style = document.createElement('style');
  style.id = 'gf-print-style';
  style.textContent = `
    @media print {
      body > *:not(#gf-print-root) { display: none !important; }
      #gf-print-root { display: block !important; }
      @page { size: A4; margin: 0; }
    }
  `;
  document.head.appendChild(style);

  const clone = containerEl.cloneNode(true) as HTMLElement;
  clone.id = 'gf-print-root';
  document.body.appendChild(clone);

  window.print();

  document.body.removeChild(clone);
  document.head.removeChild(style);

  void options; // consumed by caller
}
