import type { Page, PageSize } from '../types/page';

const PAGE_DIMENSIONS_MM: Record<PageSize, { width: number; height: number }> = {
  A4: { width: 210, height: 297 },
  A5: { width: 148, height: 210 },
  Letter: { width: 215.9, height: 279.4 },
  Legal: { width: 215.9, height: 355.6 },
  Tabloid: { width: 279.4, height: 431.8 },
};

// 96dpi → 1mm ≈ 3.7795px
const MM_TO_PX = 3.7795275591;

export function getPageDimensionsPx(page: Page): { width: number; height: number } {
  const dims = PAGE_DIMENSIONS_MM[page.size];
  const w = dims.width * MM_TO_PX;
  const h = dims.height * MM_TO_PX;
  return page.orientation === 'landscape'
    ? { width: h, height: w }
    : { width: w, height: h };
}

export function mmToPx(mm: number): number {
  return mm * MM_TO_PX;
}

export function pxToMm(px: number): number {
  return px / MM_TO_PX;
}
