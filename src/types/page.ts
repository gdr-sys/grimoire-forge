export type PageSize = 'A4' | 'A5' | 'Letter' | 'Legal' | 'Tabloid';
export type PageOrientation = 'portrait' | 'landscape';

export interface Page {
  id: string;
  blockIds: string[];
  size: PageSize;
  orientation: PageOrientation;
  columns: 1 | 2 | 3;
  columnGap: string;
  padding: { top: string; right: string; bottom: string; left: string };
  background: string | null;
  showHeader: boolean;
  showFooter: boolean;
  headerText: string;
  footerText: string;
}

export const DEFAULT_PAGE: Omit<Page, 'id'> = {
  blockIds: [],
  size: 'A4',
  orientation: 'portrait',
  columns: 1,
  columnGap: '1rem',
  padding: { top: '2cm', right: '1.5cm', bottom: '2cm', left: '1.5cm' },
  background: null,
  showHeader: false,
  showFooter: false,
  headerText: '',
  footerText: '',
};
