// All storage is wrapped: private browsing or blocked storage must never break the app.
const KEY = 'rs:apiKey';
const MODEL = 'rs:model';
const HISTORY = 'rs:history';

export const DEFAULT_MODEL = 'gpt-4o-mini';

function read(k: string): string | null {
  try { return localStorage.getItem(k); } catch { return null; }
}
function write(k: string, v: string | null) {
  try { v === null ? localStorage.removeItem(k) : localStorage.setItem(k, v); } catch { /* ignore */ }
}

export const storage = {
  getKey: () => read(KEY) ?? '',
  setKey: (v: string | null) => write(KEY, v),
  getModel: () => read(MODEL) ?? DEFAULT_MODEL,
  setModel: (v: string) => write(MODEL, v),
  getHistory<T>(): T[] {
    try { return JSON.parse(read(HISTORY) ?? '[]') as T[]; } catch { return []; }
  },
  setHistory: (items: unknown[]) => write(HISTORY, JSON.stringify(items.slice(0, 30))),
};
