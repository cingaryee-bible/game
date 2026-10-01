import {fresh, tick, applyAction, AREAS, ITEMS, DECOR, EVENTS} from './world.js';

// Separate this site's saves from other projects under the same GitHub Pages host.
export const STORAGE_KEY = `catDays-local-v1:${new URL('../', import.meta.url).pathname}`;
const eventIds = new Set(EVENTS.map(event => event.id));
const fail = message => Object.assign(new Error(message), {recoverable: true});

function validate(record) {
  const s = record?.state;
  const numbers = ['born', 'updated', 'seed', 'food', 'mood', 'clean', 'energy', 'bond', 'xp', 'coins', 'lastEvent', 'lastExplore', 'lastPlay'];
  if (record?.format !== 1 || !Number.isInteger(record.revision) || record.revision < 0 || !s || s.schema !== 1 ||
      typeof s.name !== 'string' || !s.name.trim() || !numbers.every(key => Number.isFinite(s[key])) ||
      !AREAS[s.area] || typeof s.sleeping !== 'boolean' || !s.careAt || typeof s.careAt !== 'object' ||
      !Array.isArray(s.items) || !s.items.every(id => ITEMS[id]) ||
      !Array.isArray(s.decor) || !s.decor.every(id => DECOR[id]) ||
      (s.equipped !== null && !DECOR[s.equipped]) || (s.event !== null && !eventIds.has(s.event)) ||
      !Array.isArray(s.visits) || !s.visits.every(id => AREAS[id]) || !Array.isArray(s.log) ||
      !s.log.every(entry => Number.isFinite(entry.at) && typeof entry.text === 'string') || !Array.isArray(s.ops)) {
    throw fail('未能讀取呢個瀏覽器嘅存檔，原資料未有被覆蓋。請先保留網站資料，再尋求協助。');
  }
  return record;
}

// The storage provider is injectable so failure and reload behavior can be checked
// without writing to any player's browser storage.
export function createLocalStore({storage = () => globalThis.localStorage, now = () => Date.now(), key = STORAGE_KEY} = {}) {
  function read() {
    let raw;
    try { raw = storage().getItem(key); }
    catch { throw fail('瀏覽器未允許讀取存檔。請允許網站儲存資料，再撳「再試一次」。'); }
    if (raw === null) return null;
    let record;
    try { record = JSON.parse(raw); }
    catch { throw fail('呢個瀏覽器嘅存檔格式有問題，原資料未有被覆蓋。請先保留網站資料。'); }
    return validate(record);
  }
  function write(record) {
    try { storage().setItem(key, JSON.stringify(record)); }
    catch { throw fail('瀏覽器未能儲存進度。請檢查網站儲存權限及裝置空間，再撳「再試一次」。'); }
  }
  return {
    request(action, expectedRevision) {
      let record = read();
      if (!record) {
        record = {format: 1, revision: 0, state: fresh(now())};
        write(record);
      }
      if (!action) return {state: tick(structuredClone(record.state), now()), revision: record.revision};
      if (expectedRevision !== record.revision) {
        throw Object.assign(new Error('另一個分頁有新進度，已幫你更新。請再撳一次。'), {
          status: 409, state: tick(structuredClone(record.state), now()), revision: record.revision,
        });
      }
      let result;
      try { result = applyAction(record.state, action, now()); }
      catch (error) { error.status = 400; throw error; }
      const next = {format: 1, revision: record.revision + 1, state: result.state};
      write(next);
      return {...result, revision: next.revision};
    },
  };
}
