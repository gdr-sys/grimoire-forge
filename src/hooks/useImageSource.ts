/**
 * useImageSource — risolve l'URL visualizzabile e lo stato di sync
 * per un ImageBlock, in base alla sorgente configurata.
 */

import { useEffect, useState } from 'react';
import { liveQuery } from 'dexie';
import { db } from '../lib/db';
import { resolveImageUrl } from '../services/imageManager';
import type { ImageBlockData, ImageSyncStatus } from '../types/image';

interface ImageSourceState {
  /** URL pronto per <img src>, null se non risolvibile. */
  displayUrl: string | null;
  /** Stato sync (solo per source local/drive, null per external). */
  syncStatus: ImageSyncStatus | null;
  loading: boolean;
  /** true se il record locale non esiste su questo dispositivo. */
  missingLocally: boolean;
}

export function useImageSource(data: ImageBlockData): ImageSourceState {
  const [state, setState] = useState<ImageSourceState>({
    displayUrl: null,
    syncStatus: null,
    loading: true,
    missingLocally: false,
  });

  useEffect(() => {
    // Sorgente esterna: nessuna risoluzione, l'URL è il dato stesso.
    if (data.source === 'external') {
      setState({
        displayUrl: data.url,
        syncStatus: null,
        loading: false,
        missingLocally: false,
      });
      return;
    }

    if (!data.imageId) {
      setState({ displayUrl: null, syncStatus: null, loading: false, missingLocally: false });
      return;
    }

    // liveQuery: lo stato sync si aggiorna in tempo reale mentre
    // imageManager fa l'upload su Drive.
    const subscription = liveQuery(() => db.images.get(data.imageId!)).subscribe({
      next: async (record) => {
        if (!record) {
          // Record assente su questo dispositivo: fallback all'URL Drive
          // se il blocco ne ha uno (documento aperto su altro device).
          setState({
            displayUrl: data.url,
            syncStatus: null,
            loading: false,
            missingLocally: true,
          });
          return;
        }
        const url = await resolveImageUrl(record.id);
        setState({
          displayUrl: url,
          syncStatus: record.syncStatus,
          loading: false,
          missingLocally: false,
        });
      },
      error: () => {
        setState({ displayUrl: data.url, syncStatus: null, loading: false, missingLocally: true });
      },
    });

    return () => subscription.unsubscribe();
  }, [data.source, data.imageId, data.url]);

  return state;
}
