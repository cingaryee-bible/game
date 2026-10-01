import assert from 'node:assert/strict';
import {readFileSync, existsSync} from 'node:fs';
import {createLocalStore} from '../days/local-save.js';
import {EVENTS, fresh} from '../days/world.js';

const memory = () => {
  const map = new Map();
  return {getItem:key=>map.has(key)?map.get(key):null, setItem:(key,value)=>map.set(key,String(value))};
};
let now = 1800000000000;
const disk = memory(), key = 'test';
const device = storage => createLocalStore({storage:()=>storage, now:()=>now, key});
let store = device(disk);
let saved = store.request();
assert.equal(saved.revision,0);
saved = store.request({type:'rename', name:'本機糯米'}, saved.revision);
now += 1000;
saved = store.request({type:'explore'},saved.revision);
assert.ok(saved.state.event);
const pending = saved.state.event;
store = device(disk);
saved = store.request();
assert.equal(saved.state.name,'本機糯米');
assert.equal(saved.state.event,pending,'Unresolved story survives closing/reopening');
saved = store.request({type:'choose', choice:0},saved.revision);
assert.equal(saved.state.event,null);
assert.equal(device(disk).request().state.log[0].art,pending);
assert.equal(device(memory()).request().state.name,'小糯米','Other devices start separately');

// An older tab cannot overwrite a newer tab's save.
const staleRevision = saved.revision;
saved = store.request({type:'rename',name:'新名字'},saved.revision);
assert.throws(()=>device(disk).request({type:'rename',name:'舊分頁'},staleRevision),e=>e.status===409&&e.state.name==='新名字');
assert.equal(device(disk).request().state.name,'新名字');

// Failed writes must leave the last confirmed progress untouched.
const beforeFailure = disk.getItem(key);
const full = {getItem:disk.getItem,setItem(){throw new Error('QuotaExceededError');}};
assert.throws(()=>device(full).request({type:'rename',name:'唔應該寫入'},saved.revision),e=>e.recoverable);
assert.equal(disk.getItem(key),beforeFailure);
const blocked = {getItem(){throw new Error('SecurityError');},setItem(){throw new Error('SecurityError');}};
assert.throws(()=>device(blocked).request(),e=>e.recoverable);
const corrupt = memory();corrupt.setItem(key,'{damaged');
assert.throws(()=>device(corrupt).request(),e=>e.recoverable);
assert.equal(corrupt.getItem(key),'{damaged','Never silently replace a damaged save');

// Offline rest and every illustrated story remain available in the static build.
saved = store.request({type:'rest'},saved.revision);
now += 3600000;
saved = device(disk).request();
assert.equal(saved.state.sleeping,true);assert.equal(saved.state.energy,100);
assert.equal(EVENTS.length,50);
for(const event of EVENTS){
  assert.ok(existsSync(`assets/days/cute/events/${event.id}.webp`),event.id);
  for(let choice=0;choice<2;choice++){
    const d=memory(),state=fresh(now);state.event=event.id;
    d.setItem(key,JSON.stringify({format:1,revision:0,state}));
    const result=device(d).request({type:'choose',choice},0);
    assert.equal(result.state.event,null);
    assert.equal(device(d).request().state.log[0].art,event.id);
  }
}
const code=readFileSync('days/days.js','utf8');
assert.ok(!code.includes('/api/'));assert.ok(!code.includes('fetch('));
const home=readFileSync('index.html','utf8');assert.ok(!home.includes('href="/'));
for(const manifest of ['manifest.webmanifest','manifest-v2.webmanifest','manifest-v3.webmanifest']){
  const m=JSON.parse(readFileSync(manifest,'utf8'));
  assert.equal(m.start_url,'./');assert.equal(m.scope,'./');
  for(const icon of m.icons)assert.ok(existsSync(icon.src));
}
assert.ok(readFileSync('book.html','utf8').includes('src="./assets/cat-today-cingaryee.png?v=repair4"'));
assert.ok(existsSync('assets/cat-today-cingaryee.png'));
for(const page of ['index.html','book.html','days/index.html','sleep/index.html']){
  const html=readFileSync(page,'utf8');
  assert.ok(html.includes('apple-touch-icon-v3.png'),page);
  assert.ok(html.includes('manifest-v3.webmanifest'),page);
}
for(let level=1;level<=20;level++){
  assert.ok(existsSync(`assets/tiles/tile-${String(level).padStart(2,'0')}.webp`));
}
for(const required of ['days/days.js','days/local-save.js','days/world.js','days/days.css','days/home-nav.js','sleep/sleep.js','sleep/sleep.css'])assert.ok(existsSync(required),required);
console.log('PASS: local reload, device isolation, pending events, stale-tab protection, failed/corrupt storage preservation, offline rest, 50 stories / 100 outcomes, relative icons and no backend calls.');
