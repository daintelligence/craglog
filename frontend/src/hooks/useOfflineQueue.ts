'use client';
import { useState, useEffect, useCallback } from 'react';
import {
  getPendingAscents,
  removePendingAscent,
  getPendingCount,
} from '@/lib/offlineQueue';
import { ascentsApi } from '@/lib/api';
import type { OfflineAscent } from '@/types';

export function useOfflineQueue() {
  const [pendingCount, setPendingCount] = useState(0);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true,
  );

  const refreshCount = useCallback(async () => {
    try {
      const count = await getPendingCount();
      setPendingCount(count);
    } catch {}
  }, []);

  const sync = useCallback(async () => {
    if (isSyncing || !isOnline) return;
    const pending = await getPendingAscents();
    if (!pending.length) return;

    setIsSyncing(true);
    let synced = 0;

    for (const item of pending) {
      try {
        const { _offlineId, _createdAt, _routeName, _cragName, _grade, ...payload } = item as OfflineAscent;
        await ascentsApi.create(payload);
        await removePendingAscent(_offlineId);
        synced++;
      } catch (err: any) {
        // If 4xx (bad data) — remove permanently; 5xx — keep for retry
        if (err?.response?.status >= 400 && err?.response?.status < 500) {
          await removePendingAscent((item as OfflineAscent)._offlineId);
        }
      }
    }

    setIsSyncing(false);
    await refreshCount();
    return synced;
  }, [isSyncing, isOnline, refreshCount]);

  useEffect(() => {
    refreshCount();

    const handleOnline = () => {
      setIsOnline(true);
      sync();
    };
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Listen for background sync trigger from service worker
    const handleSwMessage = (event: MessageEvent) => {
      if (event.data?.type === 'SYNC_ASCENTS') {
        sync();
      }
    };
    navigator.serviceWorker?.addEventListener('message', handleSwMessage);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      navigator.serviceWorker?.removeEventListener('message', handleSwMessage);
    };
  }, [refreshCount, sync]);

  return { pendingCount, isSyncing, isOnline, sync, refreshCount };
}
