export type ExportFormat = 'pdf' | 'png' | 'html' | 'json' | 'markdown';

export interface ExportOptions {
  format: ExportFormat;
  quality: 'low' | 'medium' | 'high' | 'print';
  pageRange: 'all' | 'current' | string;
  includeBackground: boolean;
  fileName: string;
}

export interface ExportProgress {
  current: number;
  total: number;
  stage: string;
}

export const DEFAULT_EXPORT_OPTIONS: ExportOptions = {
  format: 'pdf',
  quality: 'high',
  pageRange: 'all',
  includeBackground: true,
  fileName: 'grimoire-forge-document',
};
