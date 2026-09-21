/**
 * ExamPilot Real-Time Question Bank & Data Synchronization Service
 *
 * Ensures all Question Bank tabs, PDF OCR Ingestor, Published Mock Tests,
 * and Student Examination sessions remain 100% in sync in real time across
 * active browser windows, tabs, and component lifecycles.
 */

import { useEffect, useRef } from 'react';

export type SyncDataType = 'questions' | 'papers' | 'mocks' | 'users' | 'all';

interface SyncMessagePayload {
  type: SyncDataType;
  timestamp: number;
  originId: string;
  detail?: any;
}

const CHANNEL_NAME = 'exampilot_sync_channel';
const INSTANCE_ID = `tab-${Math.random().toString(36).substring(2, 9)}`;

// BroadcastChannel instance for cross-tab communication (with fallback for older environments)
let syncChannel: BroadcastChannel | null = null;
try {
  if (typeof BroadcastChannel !== 'undefined') {
    syncChannel = new BroadcastChannel(CHANNEL_NAME);
  }
} catch (e) {
  console.warn('[ExamPilot] BroadcastChannel not supported; using storage event bus fallback.');
}

/**
 * Notify all tabs, windows, and components that data has updated
 */
export function notifyDataSync(type: SyncDataType, detail?: any): void {
  const payload: SyncMessagePayload = {
    type,
    timestamp: Date.now(),
    originId: INSTANCE_ID,
    detail
  };

  // 1. Broadcast to other browser tabs
  if (syncChannel) {
    try {
      syncChannel.postMessage(payload);
    } catch (e) {
      console.warn('[ExamPilot] Broadcast error:', e);
    }
  }

  // 2. Storage event bus fallback for cross-tab
  try {
    localStorage.setItem('exampilot_sync_ping', JSON.stringify(payload));
  } catch {}

  // 3. Dispatch in-tab custom event for current window components
  window.dispatchEvent(
    new CustomEvent('exampilot_realtime_sync', {
      detail: payload
    })
  );

  // 4. Also dispatch legacy event for backwards compatibility
  if (type === 'papers' || type === 'mocks' || type === 'all') {
    window.dispatchEvent(new CustomEvent('exampilot_papers_updated', { detail }));
  }
}

/**
 * React Hook to subscribe a component to real-time synchronization updates.
 *
 * IMPORTANT: The callback is stored in a ref so callers do NOT need to memoize it.
 * Listeners are attached exactly once per mount and removed on unmount.
 * The `types` array is converted to a stable string key to prevent spurious re-runs.
 *
 * @param types List of data types to listen for, e.g. ['questions', 'papers', 'all']
 * @param onSync Callback executed when matching data is modified
 */
export function useRealtimeSync(types: SyncDataType[], onSync: (detail?: any) => void): void {
  // Store the latest callback in a ref so the event listeners never go stale
  // and we never need to re-attach them when the callback changes.
  const onSyncRef = useRef(onSync);
  useEffect(() => {
    onSyncRef.current = onSync;
  });

  // Stable key from the sorted type list — only re-attach listeners when the
  // set of listened types actually changes, not on every render.
  const typesKey = [...types].sort().join(',');

  useEffect(() => {
    const handleSyncMessage = (event: MessageEvent<SyncMessagePayload>) => {
      const data = event.data;
      if (!data || !data.type) return;
      if (types.includes('all') || types.includes(data.type) || data.type === 'all') {
        onSyncRef.current(data.detail);
      }
    };

    const handleCustomEvent = (event: Event) => {
      const customEvent = event as CustomEvent<SyncMessagePayload>;
      const data = customEvent.detail;
      if (!data || !data.type) return;
      if (types.includes('all') || types.includes(data.type) || data.type === 'all') {
        onSyncRef.current(data.detail);
      }
    };

    const handleStorageEvent = (event: StorageEvent) => {
      if (event.key === 'exampilot_sync_ping' && event.newValue) {
        try {
          const data: SyncMessagePayload = JSON.parse(event.newValue);
          if (data.originId !== INSTANCE_ID) {
            if (types.includes('all') || types.includes(data.type) || data.type === 'all') {
              onSyncRef.current(data.detail);
            }
          }
        } catch {}
      }
    };

    // Listen on BroadcastChannel
    if (syncChannel) {
      syncChannel.addEventListener('message', handleSyncMessage);
    }

    // Listen on in-tab events
    window.addEventListener('exampilot_realtime_sync', handleCustomEvent);

    // Listen on window storage
    window.addEventListener('storage', handleStorageEvent);

    return () => {
      if (syncChannel) {
        syncChannel.removeEventListener('message', handleSyncMessage);
      }
      window.removeEventListener('exampilot_realtime_sync', handleCustomEvent);
      window.removeEventListener('storage', handleStorageEvent);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [typesKey]); // Only re-run if the set of types changes — NOT on every render
}
