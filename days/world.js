import {MORE_EVENTS} from './events-more.js';
export const AREAS = {
  home:{name:'小屋',sub:'一盞燈，等你返屋企',image:'cute/places/home',xp:0},
  garden:{name:'花園',sub:'沿住花香，行多兩步',image:'cute/places/garden',xp:0},
  pond:{name:'池塘',sub:'聽一陣水聲，睇一陣魚',image:'cute/places/pond',xp:12},
  village:{name:'小街',sub:'轉角可能遇到新朋友',image:'cute/places/village',xp:30},
};
export const ITEMS = {
  feather:{name:'藍色羽毛',icon:'🪶',area:'garden'},
  flower:{name:'小雛菊',icon:'🌼',area:'garden'},
  clover:{name:'四葉草',icon:'🍀',area:'garden'},
  acorn:{name:'橡子',icon:'🌰',area:'garden'},
  stone:{name:'圓圓石',icon:'🪨',area:'pond'},
  shell:{name:'珍珠貝殼',icon:'🐚',area:'pond'},
  leaf:{name:'睡蓮葉',icon:'🍃',area:'pond'},
  star:{name:'星星碎光',icon:'✨',area:'pond'},
  postcard:{name:'海邊明信片',icon:'💌',area:'village'},
  bell:{name:'小銅鈴',icon:'🔔',area:'village'},
  ribbon:{name:'藍絲帶',icon:'🎀',area:'village'},
  book:{name:'迷你故事書',icon:'📘',area:'village'},
};
export const DECOR = {
  cushion:{name:'海藍軟墊',icon:'🛏️',cost:12},
  plant:{name:'窗邊小盆栽',icon:'🪴',cost:18},
  lamp:{name:'星星小夜燈',icon:'🌟',cost:25},
};
export const EVENTS = [
 {id:'box',areas:['home'],title:'紙箱送到！',body:'門口有個啱啱好嘅紙箱。貓貓探咗半個頭入去。',choices:[{text:'一齊匿入紙箱',effect:{mood:13,bond:2},line:'窄窄嘅紙箱，裝住滿滿嘅安全感。'},{text:'整成秘密基地',effect:{xp:3,coins:3},line:'新基地開張，貓貓決定擔任屋主。'}]},
 {id:'window',areas:['home'],title:'窗外嘅小訪客',body:'一隻雀仔停喺窗邊，歪住頭望入嚟。',choices:[{text:'陪貓貓靜靜睇',effect:{mood:10,bond:3},line:'隔住玻璃，交換咗一個早晨。'},{text:'畫低小訪客',effect:{coins:3},item:'feather',line:'今日嘅小發現，記低咗。'}]},
 {id:'rain',areas:['garden','pond'],weather:'rain',title:'突然一陣雨',body:'雨點落喺大葉上，啪嗒啪嗒。前面有個小涼亭。',choices:[{text:'去涼亭聽雨',effect:{energy:10,mood:8},line:'避雨都可以係一個小旅行。'},{text:'踩兩下小水窪',effect:{mood:17,clean:-8},item:'stone',line:'啪嗒！肉球濕咗，心情亮咗。'}]},
 {id:'butterfly',areas:['garden'],title:'蝴蝶帶路',body:'一隻小蝴蝶，喺花叢同貓貓鼻尖之間飛過。',choices:[{text:'慢慢跟住佢',effect:{xp:4,mood:8},item:'flower',line:'跟到花園另一角，原來呢度開咗花。'},{text:'坐低等佢返嚟',effect:{energy:8,bond:2},item:'clover',line:'等一等，反而發現腳邊嘅幸運。'}]},
 {id:'gardener',areas:['garden'],title:'園丁嘅小請求',body:'風吹散咗一籃橡子。幫手執返好嗎？',choices:[{text:'幫手執橡子',effect:{energy:-4,coins:6,xp:3},item:'acorn',line:'園丁送你一粒最圓嘅橡子。'},{text:'陪園丁休息',effect:{mood:8,bond:2},line:'有人陪住，慢慢做都幾好。'}]},
 {id:'fish',areas:['pond'],title:'水底一閃',body:'魚仔游近岸邊，水面盪開一個又一個圈。',choices:[{text:'靜靜觀察',effect:{mood:12,xp:3},item:'leaf',line:'貓貓學識咗：有啲朋友只可以遠遠欣賞。'},{text:'沿岸散步',effect:{energy:-3,coins:4},item:'shell',line:'行到水邊，拾到一隻小貝殼。'}]},
 {id:'stars',areas:['pond','garden'],night:true,title:'夜色裏嘅螢火蟲',body:'草叢有幾點微光，一閃一閃，好似會飛嘅星。',choices:[{text:'躺低睇一陣',effect:{energy:10,mood:12},item:'star',line:'今晚嘅星空，近到伸手就似乎摸得到。'},{text:'許個小小願望',effect:{bond:4,xp:3},line:'希望聽日，都有你一齊行。'}]},
 {id:'baker',areas:['village'],title:'麵包店開門',body:'麵包師見到貓貓，拎出一份貓咪專用小點心。',choices:[{text:'多謝款待',effect:{food:18,mood:8},line:'係貓咪可以食嘅點心，食到舔舔嘴。'},{text:'幫手送張卡',effect:{coins:7,xp:3},item:'postcard',line:'第一次做小信差，任務完成！'}]},
 {id:'bookshop',areas:['village'],title:'書店嘅藍色蝴蝶結',body:'店主想搵個朋友，試戴新做嘅小蝴蝶結。',choices:[{text:'試戴，行個貓步',effect:{mood:12,bond:2},item:'ribbon',line:'店主笑住話：簡直係為你而做。'},{text:'坐低聽個故事',effect:{energy:8,xp:4},item:'book',line:'故事講完，貓貓已經瞓著咗。'}]},
 {id:'friend',areas:['village','garden'],title:'隔籬嘅貓朋友',body:'遠處一聲喵，有位朋友帶住小銅鈴行過嚟。',choices:[{text:'輕輕碰一碰鼻',effect:{mood:14,bond:3},item:'bell',line:'由今日開始，多咗一位散步朋友。'},{text:'一齊曬太陽',effect:{energy:12,mood:6},line:'唔使講嘢，都可以做朋友。'}]},
 ...MORE_EVENTS,
];
const clamp = n => Math.max(0, Math.min(100,n));
export function fresh(now=Date.now()) {return {schema:1,name:'小糯米',born:now,updated:now,seed:(now%2147483646)+1,food:82,mood:82,clean:88,energy:86,bond:0,xp:0,coins:8,area:'home',sleeping:false,items:[],decor:[],equipped:null,event:null,lastEvent:0,lastExplore:0,lastPlay:0,careAt:{},visits:['home'],seenEvents:[],recentEvents:[],eventCounts:{},log:[{at:now,text:'小糯米搬入小屋。今日開始，一齊過小日子。'}],ops:[]};}
export function clock(s,now=Date.now()) {const mins=Math.floor((now-s.born)/1000)+480; const minute=((mins%1440)+1440)%1440; const hour=Math.floor(minute/60); const weather=['sun','sun','cloud','rain','cloud','sun'][Math.floor(Math.max(0,now-s.born)/180000)%6]; return {day:Math.floor(Math.max(0,now-s.born)/1440000)+1,hour,minute:minute%60,night:hour<6||hour>=18,weather};}
export function tick(s,now=Date.now()) {ensureEventHistory(s);const hours=Math.max(0,Math.min(12,(now-s.updated)/3600000)); s.food=Math.max(Math.min(15,s.food),s.food-hours*4);s.clean=Math.max(Math.min(15,s.clean),s.clean-hours*2);s.mood=Math.max(Math.min(20,s.mood),s.mood-hours*2);s.energy=s.sleeping?clamp(s.energy+hours*100):Math.max(Math.min(15,s.energy),s.energy-hours*2);s.updated=now;return s;}
function roll(s) {s.seed=(s.seed*48271)%2147483647;return s.seed/2147483647;}
function pick(s,arr){return arr[Math.floor(roll(s)*arr.length)];}
function note(s,text,now,art){s.log.unshift({at:now,text,...(art?{art}:{})});s.log=s.log.slice(0,35);return text;}
function effect(s,e){for(const [key,value] of Object.entries(e||{})) {s[key]+=value;if(['food','mood','clean','energy'].includes(key))s[key]=clamp(s[key]);}}
function collect(s,id){if(!id||s.items.includes(id))return '';s.items.push(id);s.coins+=2;return ` 收集到「${ITEMS[id].name}」！`;}
// Add history to older JSON saves in place; all care, collection and progress fields survive.
function ensureEventHistory(s){
 const valid=new Set(EVENTS.map(e=>e.id));
 if(!Array.isArray(s.seenEvents)){
   s.seenEvents=[...new Set((s.log||[]).map(l=>valid.has(l.art)?l.art:EVENTS.find(e=>e.choices.some(c=>String(l.text||'').startsWith(c.line)))?.id).filter(Boolean))];
 }
 s.seenEvents=s.seenEvents.filter(id=>valid.has(id));
 if(!Array.isArray(s.recentEvents))s.recentEvents=s.seenEvents.slice(-6);
 if(!s.eventCounts||typeof s.eventCounts!=='object')s.eventCounts=Object.fromEntries(s.seenEvents.map(id=>[id,1]));
 if(s.event&&valid.has(s.event)&&!s.seenEvents.includes(s.event)){s.seenEvents.push(s.event);s.eventCounts[s.event]=Math.max(1,s.eventCounts[s.event]||0);}
}
export function eligibleEvents(s,now=Date.now()){
 const c=clock(s,now);
 return EVENTS.filter(e=>e.areas.includes(s.area)&&(!e.night||c.night)&&(!e.daytime||!c.night)&&(!e.weather||e.weather===c.weather));
}
function event(s,now,force=false){
 if(s.sleeping||s.event||(!force&&now-s.lastEvent<45000))return false;
 ensureEventHistory(s);
 const choices=eligibleEvents(s,now);if(!choices.length)return false;
 const unseen=choices.filter(e=>!s.seenEvents.includes(e.id));
 let pool=unseen.length?unseen:choices.filter(e=>!s.recentEvents.includes(e.id));
 if(!pool.length)pool=choices.filter(e=>e.id!==s.recentEvents.at(-1));
 if(!pool.length)pool=choices;
 const least=Math.min(...pool.map(e=>s.eventCounts[e.id]||0));
 const selected=pick(s,pool.filter(e=>(s.eventCounts[e.id]||0)===least));
 s.event=selected.id;s.lastEvent=now;
 if(!s.seenEvents.includes(selected.id))s.seenEvents.push(selected.id);
 s.recentEvents=[...s.recentEvents,selected.id].slice(-6);
 s.eventCounts[selected.id]=(s.eventCounts[selected.id]||0)+1;
 return true;
}
export function stage(s){return s.xp<25?'幼貓':s.xp<85?'少年貓':'大個貓';}
export function applyAction(original,action,now=Date.now()) {
 const s=tick(structuredClone(original),now);let message='';const type=action.type;
 if(type==='rename'){const name=String(action.name||'').trim().slice(0,12);if(!name)throw Error('幫貓貓改個名先。');s.name=name;message=note(s,`以後就叫 ${name} 啦！`,now,'rename');}
 else if(type==='move'){if(!AREAS[action.area]||s.xp<AREAS[action.area].xp)throw Error('再照顧貓貓一陣，就可以去呢個地方。');if(s.sleeping)throw Error('貓貓瞓緊，起身先出發啦。');s.area=action.area;if(!s.visits.includes(s.area))s.visits.push(s.area);message=`到咗${AREAS[s.area].name}。周圍望吓？`;}
 else if(type==='wake'){s.sleeping=false;message=note(s,'伸個懶腰，慢慢起身。',now,'wake');}
 else if(type==='rest'){s.area='home';s.sleeping=!s.sleeping;effect(s,{energy:12,bond:1});message=note(s,s.sleeping?'返到軟綿綿嘅窩，瞓一陣。':'伸個懶腰，起身啦。',now,'rest');}
 else if(type==='choose'){const e=EVENTS.find(e=>e.id===s.event);const choice=e?.choices[action.choice];if(!choice)throw Error('呢件小事已經完成。');effect(s,choice.effect);effect(s,{xp:2});message=note(s,choice.line+collect(s,choice.item),now,e.id);s.event=null;}
 else if(type==='decorate'){if(!DECOR[action.item])throw Error('搵唔到呢件佈置。');if(!s.decor.includes(action.item)){const price=DECOR[action.item].cost;if(s.coins<price)throw Error('小魚乾仲未夠，再探索吓。');s.coins-=price;s.decor.push(action.item);}s.equipped=action.item;message=note(s,`小屋放好咗${DECOR[action.item].name}。`,now,'decorate');}
 else if(type==='heartbeat'){event(s,now);}
 else if(['feed','clean','pet','play','explore'].includes(type)) {
   if(s.sleeping)throw Error('貓貓瞓緊，輕輕叫醒佢先啦。');
   if(type==='explore'&&s.event)return {state:s,message:'有件小事等你回應，睇埋先再出發啦。'};
   const cooldown=type==='explore'?12000:type==='play'?15000:4000;
   if(now-(s.careAt[type]||0)<cooldown)throw Error(type==='explore'?'貓貓聞緊花香，等多幾秒再行。':'俾貓貓慢慢享受先。');
   s.careAt[type]=now;
   if(type==='feed'){effect(s,{food:22,mood:3,xp:2,bond:1});message='開飯！貓貓食到舔舔嘴。';}
   if(type==='clean'){effect(s,{clean:28,mood:5,xp:2,bond:1});message='梳梳毛、抹抹肉球，又乾淨又鬆軟。';}
   if(type==='pet'){effect(s,{mood:12,bond:3,xp:1});message='咕嚕咕嚕……貓貓用頭仔蹭你隻手。';}
   if(type==='play'){effect(s,{mood:20,energy:-7,food:-3,bond:2,xp:4,coins:2});message='捉到啦！一場遊戲，換到滿足嘅咕嚕聲。';}
   if(type==='explore') {
     if(s.energy<12)throw Error('有啲攰，返小屋休息一陣先。');
     const c=clock(s,now);effect(s,{energy:-5,food:-3,clean:c.weather==='rain'&&s.area!=='home'?-6:-2,mood:7,xp:3,coins:2});
     if(!s.event&&event(s,now,true)){message='好似有件有趣嘅事發生……';}
     else {const pool=Object.entries(ITEMS).filter(([id,v])=>v.area===s.area&&(id!=='star'||c.night));const missing=pool.filter(([id])=>!s.items.includes(id));const chosen=pick(s,missing.length?missing:pool);message=pick(s,['沿住小路行咗一圈，心情鬆咗。','停一停，聞到今日唔同嘅味道。','貓貓忽然跑兩步，又返嚟等你。'])+(chosen&&roll(s)<.72?collect(s,chosen[0]):'');}
     s.lastExplore=now;
   }
   note(s,message,now,type);
 } else throw Error('未能完成呢個動作。');
 return {state:s,message};
}
