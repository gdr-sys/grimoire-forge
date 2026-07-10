/**
 * ImageBlock — blocco immagine con tre sorgenti:
 *
 *  1. Upload da dispositivo → IndexedDB + sync Google Drive (se loggato)
 *  2. URL esterno (Imgur, qualsiasi) → solo riferimento, nessun download
 *  3. Drag & drop file direttamente sul blocco → come upload
 *
 * L'utente vede sempre quale modalità sta usando (badge sorgente).
 * Per le immagini locali senza login: avviso "salvata solo su questo
 * dispositivo" con invito ad accedere.
 */

import { useCallback, useRef, useState, type DragEvent } from 'react';
import {
  Upload,
  Link2,
  HardDrive,
  Cloud,
  CloudOff,
  RefreshCw,
  AlertTriangle,
  ImageIcon,
  Trash2,
} from 'lucide-react';
import { toast } from 'sonner';
import { useTranslation } from '../../hooks/useTranslation';
import { useAuthStore } from '../../stores/authStore';
import { useImageSource } from '../../hooks/useImageSource';
import { useUiStore } from '../../stores/uiStore';
import {
  ingestImageFile,
  deleteImage,
  syncImageToDrive,
  ImageTooLargeError,
  UnsupportedImageTypeError,
} from '../../services/imageManager';
import {
  ACCEPTED_IMAGE_TYPES,
  type ImageBlockData,
  type ImageSource,
} from '../../types/image';

interface ImageBlockProps {
  blockId: string;
  data: ImageBlockData;
  isSelected: boolean;
  /** Aggiorna i dati del blocco nel documentStore (già history-aware). */
  onChange: (patch: Partial<ImageBlockData>) => void;
}

const MASK_CLIP_PATHS: Record<ImageBlockData['maskShape'], string | undefined> = {
  none: undefined,
  circle: 'circle(50% at 50% 50%)',
  hexagon: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)',
  shield: 'polygon(0% 0%, 100% 0%, 100% 65%, 50% 100%, 0% 65%)',
};

export function ImageBlock({ blockId, data, isSelected, onChange }: ImageBlockProps) {
  const { t } = useTranslation();
  const user = useAuthStore((s) => s.user);
  const openLoginPrompt = useUiStore((s) => s.openLoginPrompt);
  const { displayUrl, syncStatus, loading, missingLocally } = useImageSource(data);

  const [isDragOver, setIsDragOver] = useState(false);
  const [urlDraft, setUrlDraft] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // -------------------------------------------------------------------------
  // Ingest (upload + drag&drop condividono lo stesso percorso)
  // -------------------------------------------------------------------------

  const handleFile = useCallback(
    async (file: File) => {
      try {
        // Se il blocco aveva già un'immagine locale, rimuovi la vecchia.
        if (data.imageId) await deleteImage(data.imageId);

        const record = await ingestImageFile(file);
        onChange({
          source: 'local',
          imageId: record.id,
          url: null,
          alt: data.alt || record.fileName,
        });
        toast.success(t('imageBlock.uploadSuccess'));
      } catch (err) {
        if (err instanceof UnsupportedImageTypeError) {
          toast.error(t('imageBlock.errorUnsupportedType'));
        } else if (err instanceof ImageTooLargeError) {
          toast.error(t('imageBlock.errorTooLarge'));
        } else {
          toast.error(t('imageBlock.errorGeneric'));
        }
      }
    },
    [data.imageId, data.alt, onChange, t],
  );

  const handleDrop = useCallback(
    (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragOver(false);
      const file = e.dataTransfer.files?.[0];
      if (file) void handleFile(file);
    },
    [handleFile],
  );

  const handleExternalUrl = useCallback(() => {
    const url = urlDraft.trim();
    if (!url) return;
    try {
      const parsed = new URL(url);
      if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') {
        throw new Error('invalid protocol');
      }
    } catch {
      toast.error(t('imageBlock.errorInvalidUrl'));
      return;
    }
    onChange({ source: 'external', imageId: null, url });
    setUrlDraft('');
  }, [urlDraft, onChange, t]);

  // -------------------------------------------------------------------------
  // Badge sorgente — l'utente vede SEMPRE quale modalità sta usando
  // -------------------------------------------------------------------------

  const renderSourceBadge = () => {
    let icon: React.ReactNode;
    let label: string;
    let tone: string;

    if (data.source === 'external') {
      icon = <Link2 size={12} aria-hidden />;
      label = t('imageBlock.source.external');
      tone = 'bg-sky-100 text-sky-800 dark:bg-sky-900/60 dark:text-sky-200';
    } else if (syncStatus === 'synced') {
      icon = <Cloud size={12} aria-hidden />;
      label = t('imageBlock.source.drive');
      tone = 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-200';
    } else if (syncStatus === 'syncing' || syncStatus === 'pending') {
      icon = <RefreshCw size={12} className="animate-spin" aria-hidden />;
      label = t('imageBlock.source.syncing');
      tone = 'bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-200';
    } else if (syncStatus === 'error') {
      icon = <CloudOff size={12} aria-hidden />;
      label = t('imageBlock.source.syncError');
      tone = 'bg-red-100 text-red-800 dark:bg-red-900/60 dark:text-red-200';
    } else {
      icon = <HardDrive size={12} aria-hidden />;
      label = t('imageBlock.source.local');
      tone = 'bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-200';
    }

    return (
      <span
        className={`absolute top-2 left-2 z-10 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium shadow-sm ${tone}`}
        role="status"
      >
        {icon}
        {label}
      </span>
    );
  };

  // -------------------------------------------------------------------------
  // Avviso locale-only per utenti non loggati
  // -------------------------------------------------------------------------

  const showLocalOnlyWarning =
    data.source === 'local' && syncStatus === 'local-only' && !user;

  const renderLocalOnlyWarning = () => (
    <div
      className="mt-2 flex items-start gap-2 rounded-md border border-amber-300 bg-amber-50 px-3 py-2 text-sm text-amber-900 dark:border-amber-700 dark:bg-amber-950/50 dark:text-amber-200"
      role="alert"
    >
      <AlertTriangle size={16} className="mt-0.5 shrink-0" aria-hidden />
      <div>
        <p>{t('imageBlock.localOnlyWarning')}</p>
        <button
          type="button"
          onClick={openLoginPrompt}
          className="mt-1 font-medium underline underline-offset-2 hover:text-amber-950 dark:hover:text-amber-100"
        >
          {t('imageBlock.localOnlyCta')}
        </button>
      </div>
    </div>
  );

  // -------------------------------------------------------------------------
  // Stato vuoto: selettore sorgente (upload / URL / drop zone)
  // -------------------------------------------------------------------------

  const hasImage = Boolean(displayUrl) && !loading;

  if (!hasImage) {
    return (
      <div
        className={`relative rounded-lg border-2 border-dashed p-6 text-center transition-colors ${
          isDragOver
            ? 'border-violet-500 bg-violet-50 dark:bg-violet-950/40'
            : 'border-slate-300 bg-slate-50 dark:border-slate-600 dark:bg-slate-800/40'
        }`}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragOver(true);
        }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={handleDrop}
        data-block-id={blockId}
      >
        <ImageIcon size={32} className="mx-auto text-slate-400" aria-hidden />
        <p className="mt-2 text-sm font-medium text-slate-600 dark:text-slate-300">
          {isDragOver ? t('imageBlock.dropHere') : t('imageBlock.emptyTitle')}
        </p>

        <div className="mt-4 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          {/* Sorgente 1: upload da dispositivo */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center gap-2 rounded-md bg-violet-600 px-3 py-1.5 text-sm font-medium text-white shadow-sm transition hover:bg-violet-700"
          >
            <Upload size={16} aria-hidden />
            {t('imageBlock.uploadButton')}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept={ACCEPTED_IMAGE_TYPES.join(',')}
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) void handleFile(file);
              e.target.value = '';
            }}
          />

          <span className="text-xs text-slate-400">{t('imageBlock.or')}</span>

          {/* Sorgente 2: URL esterno */}
          <div className="flex w-full max-w-xs items-center gap-1">
            <input
              type="url"
              value={urlDraft}
              onChange={(e) => setUrlDraft(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleExternalUrl()}
              placeholder={t('imageBlock.urlPlaceholder')}
              aria-label={t('imageBlock.urlPlaceholder')}
              className="min-w-0 flex-1 rounded-md border border-slate-300 bg-white px-2 py-1.5 text-sm dark:border-slate-600 dark:bg-slate-900"
            />
            <button
              type="button"
              onClick={handleExternalUrl}
              disabled={!urlDraft.trim()}
              className="rounded-md border border-slate-300 px-2 py-1.5 text-sm disabled:opacity-40 dark:border-slate-600"
              aria-label={t('imageBlock.useUrl')}
            >
              <Link2 size={16} aria-hidden />
            </button>
          </div>
        </div>

        <p className="mt-3 text-xs text-slate-400">
          {t('imageBlock.externalHint')}
        </p>
      </div>
    );
  }

  // -------------------------------------------------------------------------
  // Stato con immagine
  // -------------------------------------------------------------------------

  const figureAlignClass =
    data.float !== 'none'
      ? data.float === 'left'
        ? 'float-left mr-4'
        : 'float-right ml-4'
      : data.alignment === 'left'
        ? 'mr-auto'
        : data.alignment === 'right'
          ? 'ml-auto'
          : 'mx-auto';

  return (
    <figure
      className={`group relative ${figureAlignClass}`}
      style={{ width: `${data.widthPercent}%` }}
      data-block-id={blockId}
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragOver(true);
      }}
      onDragLeave={() => setIsDragOver(false)}
      onDrop={handleDrop}
    >
      {renderSourceBadge()}

      {isSelected && (
        <button
          type="button"
          onClick={() => {
            if (data.imageId) void deleteImage(data.imageId);
            onChange({ imageId: null, url: null, source: 'local' });
          }}
          className="absolute top-2 right-2 z-10 rounded-full bg-white/90 p-1.5 text-slate-600 opacity-0 shadow transition group-hover:opacity-100 hover:text-red-600 dark:bg-slate-800/90 dark:text-slate-300"
          aria-label={t('imageBlock.removeImage')}
        >
          <Trash2 size={14} aria-hidden />
        </button>
      )}

      <img
        src={displayUrl!}
        alt={data.alt}
        loading="lazy"
        className="block h-auto w-full"
        style={{
          clipPath: MASK_CLIP_PATHS[data.maskShape],
          borderRadius: data.maskShape === 'none' ? data.borderRadius : undefined,
        }}
        onError={(e) => {
          // URL esterno rotto: mostra placeholder d'errore, non rompere il layout.
          (e.target as HTMLImageElement).style.display = 'none';
          toast.error(t('imageBlock.errorExternalLoad'));
        }}
      />

      {isDragOver && (
        <div className="absolute inset-0 flex items-center justify-center rounded bg-violet-600/70 text-sm font-medium text-white">
          {t('imageBlock.dropToReplace')}
        </div>
      )}

      {data.caption && (
        <figcaption className="mt-1 text-center text-sm italic opacity-75">
          {data.caption}
        </figcaption>
      )}

      {missingLocally && data.source !== 'external' && !data.url && (
        <div className="mt-2 rounded-md border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-800 dark:border-red-800 dark:bg-red-950/50 dark:text-red-200" role="alert">
          {t('imageBlock.missingLocally')}
        </div>
      )}

      {syncStatus === 'error' && (
        <button
          type="button"
          onClick={() => data.imageId && void syncImageToDrive(data.imageId)}
          className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-red-700 underline underline-offset-2 dark:text-red-300"
        >
          <RefreshCw size={14} aria-hidden />
          {t('imageBlock.retrySync')}
        </button>
      )}

      {showLocalOnlyWarning && renderLocalOnlyWarning()}
    </figure>
  );
}

/** Registrazione nel blockRegistry (vedi src/lib/blockRegistry.ts). */
export const imageBlockMeta = {
  type: 'image' as const,
  category: 'decorative' as const,
  labelKey: 'blocks.image',
  icon: ImageIcon,
};
