/**
 * SUPABASE DOC STORE
 *
 * A small Firestore-style document layer over the `public.app_docs` table:
 *   (collection, doc_id) → { user_id, sort_key, data jsonb }
 *
 * It replaces the per-collection Firestore primitives that used to live in
 * firebase/config + firebase/firestore. Every operation is best-effort with a
 * hard timeout: services in this codebase are offline-first and fall back to
 * their LocalStorage cache, so this layer never throws — it returns null/false
 * and logs a notice instead.
 *
 * Requires the `20260926_auth_and_docs.sql` migration to be applied.
 */
import { supabase, isSupabaseConfigured } from './supabaseClient';

const DEFAULT_TIMEOUT_MS = 5000;

export interface CloudDoc<T> {
  collection: string;
  docId: string;
  userId?: string | null;
  sortKey?: string | null;
  data: T;
}

export interface CloudDocQuery {
  /** Filter on the owner column (maps to Firestore `where('userId', '==', …)`). */
  userId?: string;
  limit?: number;
  /** Order by the `sort_key` column (maps to Firestore `orderBy(…)`). */
  orderBySortKey?: boolean;
  descending?: boolean;
}

function withTimeout<T>(promise: PromiseLike<T>, ms: number, label: string): Promise<T> {
  return Promise.race([
    Promise.resolve(promise),
    new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error(`${label} timed out after ${ms}ms`)), ms)
    )
  ]);
}

function notConfiguredWarning(op: string): void {
  console.warn(`[SupabaseDocStore] ${op} skipped — Supabase is not configured.`);
}

/**
 * Reads a single document. Returns null when missing, unreachable, or
 * Supabase is not configured.
 */
export async function getCloudDoc<T>(
  collection: string,
  docId: string
): Promise<T | null> {
  if (!isSupabaseConfigured || !supabase) {
    notConfiguredWarning(`get(${collection}/${docId})`);
    return null;
  }
  try {
    const { data, error } = await withTimeout(
      supabase
        .from('app_docs')
        .select('data')
        .eq('collection', collection)
        .eq('doc_id', docId)
        .limit(1),
      DEFAULT_TIMEOUT_MS,
      `get(${collection}/${docId})`
    );
    if (error) {
      console.warn(`[SupabaseDocStore] get(${collection}/${docId}) error:`, error.message);
      return null;
    }
    return (data?.[0]?.data as T) ?? null;
  } catch (err: any) {
    console.warn(`[SupabaseDocStore] get(${collection}/${docId}) notice:`, err?.message || err);
    return null;
  }
}

/**
 * Upserts a single document (insert-or-replace, Firestore `setDoc` semantics).
 * `merge` is approximated as a replace — callers in this codebase always pass
 * the full document after merging locally, matching the previous behaviour.
 */
export async function setCloudDoc(
  collection: string,
  docId: string,
  data: unknown,
  options?: { userId?: string; sortKey?: string }
): Promise<boolean> {
  if (!isSupabaseConfigured || !supabase) {
    notConfiguredWarning(`set(${collection}/${docId})`);
    return false;
  }
  try {
    const row = {
      collection,
      doc_id: docId,
      user_id: options?.userId ?? null,
      sort_key: options?.sortKey ?? null,
      data: sanitize(data),
      updated_at: new Date().toISOString()
    };
    const { error } = await withTimeout(
      supabase.from('app_docs').upsert(row),
      DEFAULT_TIMEOUT_MS,
      `set(${collection}/${docId})`
    );
    if (error) {
      console.warn(`[SupabaseDocStore] set(${collection}/${docId}) error:`, error.message);
      return false;
    }
    return true;
  } catch (err: any) {
    console.warn(`[SupabaseDocStore] set(${collection}/${docId}) notice:`, err?.message || err);
    return false;
  }
}

/** Bulk upsert (one request per chunk) — replaces Firestore write batches. */
export async function setCloudDocs(
  collection: string,
  docs: Array<{ id: string; data: unknown; userId?: string; sortKey?: string }>
): Promise<boolean> {
  if (!isSupabaseConfigured || !supabase) {
    notConfiguredWarning(`setMany(${collection})`);
    return false;
  }
  if (docs.length === 0) return true;
  try {
    const now = new Date().toISOString();
    const rows = docs.map((d) => ({
      collection,
      doc_id: d.id,
      user_id: d.userId ?? null,
      sort_key: d.sortKey ?? null,
      data: sanitize(d.data),
      updated_at: now
    }));
    const { error } = await withTimeout(
      supabase.from('app_docs').upsert(rows),
      DEFAULT_TIMEOUT_MS,
      `setMany(${collection})`
    );
    if (error) {
      console.warn(`[SupabaseDocStore] setMany(${collection}) error:`, error.message);
      return false;
    }
    return true;
  } catch (err: any) {
    console.warn(`[SupabaseDocStore] setMany(${collection}) notice:`, err?.message || err);
    return false;
  }
}

/** Deletes one document. Missing documents are not an error. */
export async function deleteCloudDoc(collection: string, docId: string): Promise<boolean> {
  if (!isSupabaseConfigured || !supabase) {
    notConfiguredWarning(`delete(${collection}/${docId})`);
    return false;
  }
  try {
    const { error } = await withTimeout(
      supabase
        .from('app_docs')
        .delete()
        .eq('collection', collection)
        .eq('doc_id', docId),
      DEFAULT_TIMEOUT_MS,
      `delete(${collection}/${docId})`
    );
    if (error) {
      console.warn(`[SupabaseDocStore] delete(${collection}/${docId}) error:`, error.message);
      return false;
    }
    return true;
  } catch (err: any) {
    console.warn(`[SupabaseDocStore] delete(${collection}/${docId}) notice:`, err?.message || err);
    return false;
  }
}

/**
 * Queries a collection: optional owner filter, optional sort by `sort_key`,
 * optional limit. Returns [] on any failure so callers can use local caches.
 */
export async function queryCloudDocs<T>(
  collection: string,
  query: CloudDocQuery = {}
): Promise<T[]> {
  if (!isSupabaseConfigured || !supabase) {
    notConfiguredWarning(`query(${collection})`);
    return [];
  }
  try {
    let req = supabase
      .from('app_docs')
      .select('data')
      .eq('collection', collection);

    if (query.userId) {
      req = req.eq('user_id', query.userId);
    }
    if (query.orderBySortKey) {
      req = req.order('sort_key', {
        ascending: query.descending === true,
        nullsFirst: false
      });
    }
    if (query.limit && query.limit > 0) {
      req = req.limit(query.limit);
    }

    const { data, error } = await withTimeout(
      req,
      DEFAULT_TIMEOUT_MS,
      `query(${collection})`
    );
    if (error) {
      console.warn(`[SupabaseDocStore] query(${collection}) error:`, error.message);
      return [];
    }
    return (data || []).map((row) => row.data as T);
  } catch (err: any) {
    console.warn(`[SupabaseDocStore] query(${collection}) notice:`, err?.message || err);
    return [];
  }
}

/**
 * Reads every document in a collection (admin views: syllabi, custom
 * questions, learned modules, the profile roster helper).
 */
export async function listCloudDocs<T>(collection: string, limit = 1000): Promise<T[]> {
  return queryCloudDocs<T>(collection, { limit });
}

/**
 * JSON round-trip so payloads match what Postgres jsonb will store
 * (drops undefined/function values, converts Date → ISO string).
 */
function sanitize(data: unknown): unknown {
  try {
    return JSON.parse(JSON.stringify(data));
  } catch {
    return data;
  }
}
