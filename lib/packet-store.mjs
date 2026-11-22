import { getStore } from '@netlify/blobs';
import { mkdir, readFile, writeFile, rename } from 'node:fs/promises';
import path from 'node:path';
import { randomUUID, createHash } from 'node:crypto';
const key = 'published-packet';
let localQueue = Promise.resolve();

// Uses a site-wide store, so publishing a new deploy does not reset team data.
export function createPacketRepository(store) {
  async function current() {
    const entry = await store.getWithMetadata(key, { type: 'json', consistency: 'strong' });
    if (entry && (!entry.data || !Number.isSafeInteger(entry.data.version) || entry.data.version < 1 || !entry.data.data)) {
      throw new Error('Invalid saved packet');
    }
    return entry;
  }
  return {
    async read() { return (await current())?.data ?? null; },
    async save(data, expectedVersion) {
      const entry = await current();
      if ((entry?.data.version ?? 0) !== expectedVersion) return null;
      const version = expectedVersion + 1;
      const result = await store.setJSON(key, { data, version }, entry ? { onlyIfMatch: entry.etag } : { onlyIfNew: true });
      return result.modified ? version : null;
    },
  };
}

// Explicit local development/test storage. Never an automatic production fallback.
function localStore(directory) {
  const filename = path.resolve(directory, 'packet.json');
  async function read() {
    try { const text = await readFile(filename, 'utf8'); return { data: JSON.parse(text), etag: createHash('sha256').update(text).digest('hex') }; }
    catch (error) { if (error.code === 'ENOENT') return null; throw error; }
  }
  return {
    getWithMetadata: read,
    async setJSON(_key, data, condition) {
      const operation = localQueue.then(async () => {
        await mkdir(directory, { recursive: true });
        const existing = await read();
        if ((condition.onlyIfNew && existing) || (condition.onlyIfMatch && existing?.etag !== condition.onlyIfMatch)) return { modified: false };
        const temporary = `${filename}.${randomUUID()}.tmp`;
        await writeFile(temporary, JSON.stringify(data), { mode: 0o600 });
        await rename(temporary, filename);
        return { modified: true };
      });
      localQueue = operation.then(() => undefined, () => undefined);
      return operation;
    },
  };
}

export function packetRepository() {
  const localDirectory = process.env.RUGBY_LOCAL_DATA_DIR || (!process.env.NETLIFY && process.env.NODE_ENV === 'development' ? '.local-data' : '');
  if (process.env.NETLIFY && process.env.RUGBY_LOCAL_DATA_DIR) throw new Error('Local storage is disabled on Netlify');
  return createPacketRepository(localDirectory ? localStore(localDirectory) : getStore({ name: 'rugby-travel', consistency: 'strong' }));
}
