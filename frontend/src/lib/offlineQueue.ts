import { openDB, IDBPDatabase } from 'idb';
import type { OfflineAscent } from '@/types';

const DB_NAME = 'craglog';
const STORE = 'offline_ascents';
const DB_VERSION = 1;

let dbPromise: Promise<IDBPDatabase> | null = null;

function getDb() {
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(STORE)) {
          db.createObjectStore(STORE, { keyPath: '_offlineId' });
        }
      },
    });
  }
  return dbPromise;
}

export async function queueAscent(ascent: Omit<OfflineAscent, '_offlineId' | '_createdAt'>): Promise<string> {
  const db = await getDb();
  const id = `offline_${Date.now()}_${Math.random().toString(36).slice(2)}`;
  const record: OfflineAscent = {
    ...ascent,
    _offlineId: id,
    _createdAt: new Date().toISOString(),
  };
  await db.put(STORE, record);
  return id;
}

export async function getPendingAscents(): Promise<OfflineAscent[]> {
  const db = await getDb();
  return db.getAll(STORE);
}

export async function removePendingAscent(offlineId: string): Promise<void> {
  const db = await getDb();
  await db.delete(STORE, offlineId);
}

export async function clearPendingAscents(): Promise<void> {
  const db = await getDb();
  await db.clear(STORE);
}

export async function getPendingCount(): Promise<number> {
  const db = await getDb();
  return db.count(STORE);
}
