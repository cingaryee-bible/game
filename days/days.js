import {AREAS,ITEMS,DECOR,EVENTS,clock,stage} from './world.js';
import {createLocalStore,STORAGE_KEY} from './local-save.js';
const localStore=createLocalStore();
import {createCompanion,poseArt,eventArt,actionArt,EVENT_ART} from './companion.js';
const $=s=>document.querySelector(s);
let state=null,busy=false,connected=false,toastTimer,revision=0,lastArea='',lastSpeech='',playRun=null;
const companion=createCompanion({image:$('#catImage'),zone:$('#catZone'),speech:$('#catSpeech'),paused:()=>busy||!connected||$('#sheet').open});
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function toast(text,art){$('#toast').innerHTML=`${art?`<img src="${art}" alt="">`:''}<span>${esc(text)}</span>`;$('#toast').classList.add('visible');clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('#toast').classList.remove('visible'),4200);}
function sheet(title,html){$('#sheetTitle').textContent=title;$('#sheetBody').innerHTML=html;if(!$('#sheet').open)$('#sheet').showModal();}
function close(){playRun=null;$('#sheet').close();}
$('#closeSheet').onclick=close;$('#sheet').addEventListener('click',e=>{if(e.target===$('#sheet')){const r=$('#sheet').getBoundingClientRect();if(e.clientY<r.top||e.clientX<r.left||e.clientX>r.right)close();}});
function lock(){document.querySelectorAll('.care button,#cat,#play,.scene-spot,#eventPeek,#nameButton').forEach(b=>b.disabled=busy||!connected);}
async function request(action){
 try{
   const operation=()=>localStore.request(action,revision);
   return navigator.locks?.request ? await navigator.locks.request(STORAGE_KEY,operation) : operation();
 }catch(e){
   if(e.state){state=e.state;revision=e.revision;render();}
   throw e;
 }
}
async function load(){if(busy)return;busy=true;lock();$('#saveState').textContent='正在讀取存檔…';try{const data=await request();state=data.state;revision=data.revision;connected=true;$('#connection').hidden=true;render();$('#saveState').textContent='已存喺本機';}catch(e){connectionError(e);}finally{busy=false;lock();}}
function connectionError(e){connected=false;$('#connection').hidden=false;$('#connectionText').textContent=e.message||'暫時未能讀取本機存檔。請再試一次。';$('#saveState').textContent='本機存檔未完成';}
async function act(action,{quiet=false,keepSheet=false}={}){
 if(busy||!connected)return false;busy=true;lock();$('#saveState').textContent='儲存中…';
 const prevStage=stage(state),eventBefore=state.event;
 try{
   const data=await request(action);state=data.state;revision=data.revision;render();$('#saveState').textContent='已存喺本機';
   if(!keepSheet&&action.type!=='heartbeat')close();
   if(action.type!=='heartbeat')companion.play(action.type);
   if(action.type==='choose')showEventResult(eventBefore,data.message);
   else if(data.message&&!quiet)toast(data.message,actionArt(action.type));
   if(prevStage!==stage(state))setTimeout(()=>toast(`長大咗！${state.name} 依家係${stage(state)}。`,poseArt('happy')),4500);
   if(action.type==='explore'&&state.event)showEvent();
   return true;
 }catch(e){if(e.recoverable||!e.status)connectionError(e);else{toast(e.message);$('#saveState').textContent='已存喺本機';}return false;}
 finally{busy=false;lock();}
}
function renderClock(){if(!state)return;const c=clock(state);$('#clock').textContent=`${String(c.hour).padStart(2,'0')}:${String(c.minute).padStart(2,'0')}`;$('#day').textContent=`第 ${c.day} 日`;$('#weather').textContent=c.weather==='rain'?'☂ 微雨':c.weather==='cloud'?'☁ 多雲':c.night?'☾ 晴夜':'☀ 晴天';$('#scene').classList.toggle('night',c.night);$('#scene').classList.toggle('raining',c.weather==='rain');$('#scene').classList.toggle('cloud',c.weather==='cloud');}
function render(){if(!state)return;$('#petName').textContent=state.name;$('#stage').textContent=stage(state);$('#coins').textContent=state.coins;$('#bond').textContent=`♡ ${state.bond<15?'慢慢熟悉':state.bond<50?'開始黐你':'最安心嘅朋友'} · 成長 ${state.xp}`;for(const key of ['food','mood','clean','energy']){$('#'+key).value=Math.round(state[key]);$('#'+key+'N').textContent=Math.round(state[key]);}
 const area=AREAS[state.area];$('#location').textContent=area.name;$('#sceneLine').textContent=area.sub;
 if(lastArea!==state.area){$('#scene').classList.remove('home-scene','garden-scene','pond-scene','village-scene');$('#scene').classList.add(`${state.area}-scene`);$('#sceneArt').src=`../assets/days/${area.image}.webp`;$('#sceneArt').alt=`手繪${area.name}場景`;lastArea=state.area;}
 companion.sync(state);$('#catImage').style.width=stage(state)==='幼貓'?'92%':'100%';$('#rest b').textContent=state.sleeping?'起身':'休息';$('#rest img').src=poseArt(state.sleeping?'stretch':'sleep');$('#cat').setAttribute('aria-label',state.sleeping?'輕輕叫醒貓貓':'摸摸貓貓');
 const speech=state.sleeping?'陪我瞓一陣……':state.food<35?'肚仔有啲餓喇。':state.energy<35?'想返屋企瞓一陣。':state.clean<35?'毛毛想梳一梳。':state.mood<40?'陪我玩吖？':['有你陪住就好。','呢度聞落好有趣。','水入面係咪有魚？','轉角有乜嘢呢？'][Object.keys(AREAS).indexOf(state.area)];if(lastSpeech!==speech){$('#catSpeech').textContent=speech;lastSpeech=speech;}
 const spots={home:['窗邊望望','紙箱探險'],garden:['花叢聞聞','樹下尋寶'],pond:['水邊望望','沿岸拾貝'],village:['書店探訪','小街轉轉']};$('#spotOne span').textContent=spots[state.area][0];$('#spotTwo span').textContent=spots[state.area][1];$('#eventPeek').hidden=!state.event;if(state.event){$('#eventThumb').src=eventArt(state.event);$('#eventLabel').textContent=EVENTS.find(e=>e.id===state.event)?.title||'有小事情發生';}$('#decoration').textContent=state.area==='home'&&state.equipped?DECOR[state.equipped].icon:'';$('#decoration').ariaLabel=state.equipped?DECOR[state.equipped].name:'小屋佈置';$('#collectionN').textContent=`${state.items.length}/12`;renderClock();}
function eventProgress(area){const stories=EVENTS.filter(e=>!area||e.areas.includes(area));return `${stories.filter(e=>(state.seenEvents||[]).includes(e.id)).length} / ${stories.length}`;}
function showMap(){if(!state)return;sheet('今日去邊度？',`<p class="intro">${EVENTS.length} 款小故事，散步會優先遇到未見過嘅。</p><div class="map-grid">${Object.entries(AREAS).map(([id,a])=>`<button class="area-card ${state.area===id?'active':''}" data-area="${id}" aria-disabled="${state.xp<a.xp}"><img src="../assets/days/${a.image}.webp" alt="${a.name}" loading="lazy"><strong>${a.name}${state.xp<a.xp?' · 🔒':''}</strong><small>${state.xp<a.xp?`成長 ${a.xp} 解鎖（現有 ${state.xp}）`:state.area===id?'你同貓貓喺呢度':a.sub}</small><small class="area-story-count">故事 ${eventProgress(id)}</small></button>`).join('')}</div><button class="primary explore-button" id="exploreNow">喺${AREAS[state.area].name}探索</button><small class="sheet-footer">每次探索會用少少精神；雨天出門，毛毛會濕少少。</small>`);document.querySelectorAll('[data-area]').forEach(b=>b.onclick=()=>{if(state.xp<AREAS[b.dataset.area].xp){toast(`成長到 ${AREAS[b.dataset.area].xp} 就開放。`);return;}act({type:'move',area:b.dataset.area});});$('#exploreNow').onclick=()=>act({type:'explore'});}
function showCollection(){if(!state)return;sheet('小小收藏冊',`<p class="intro">${state.items.length} / 12 件小發現。未遇見嘅，就留返下次散步。</p><div class="collection-grid">${Object.entries(ITEMS).map(([id,i])=>`<div class="collect-item ${state.items.includes(id)?'':'missing'}"><span>${state.items.includes(id)?i.icon:'?'}</span><strong>${state.items.includes(id)?i.name:`${AREAS[i.area].name}小發現`}</strong></div>`).join('')}</div><h3 class="section-label">小屋佈置 · 🐟 ${state.coins}</h3>${Object.entries(DECOR).map(([id,d])=>`<div class="decor-item"><span>${d.icon}</span><strong>${d.name}</strong><button data-decor="${id}">${state.equipped===id?'已放好':state.decor.includes(id)?'擺出嚟':`🐟 ${d.cost}`}</button></div>`).join('')}<small class="sheet-footer">散步、陪玩同幫朋友小忙，都可以儲到小魚乾。</small>`);document.querySelectorAll('[data-decor]').forEach(b=>b.onclick=async()=>{if(await act({type:'decorate',item:b.dataset.decor},{keepSheet:true}))showCollection();});}
function showEvent(){
 if(!state?.event)return;const e=EVENTS.find(e=>e.id===state.event);
 sheet(e.title,`<img class="event-illustration" src="${eventArt(e.id)}" alt="${esc(e.title)}的貓貓故事插畫"><p class="event-body">${esc(e.body)}</p>${e.choices.map((c,i)=>`<button class="choice" data-choice="${i}"><img src="${poseArt(i?'sit':'happy')}" alt=""><span>${esc(c.text)}</span></button>`).join('')}<small class="sheet-footer">${state.eventCounts?.[e.id]===1?'第一次遇見 · ':''}慢慢揀，呢件小事會等你。</small>`);
 document.querySelectorAll('[data-choice]').forEach(b=>b.onclick=()=>act({type:'choose',choice:Number(b.dataset.choice)}));
}
function showEventResult(id,message){
 sheet('又多一個小回憶',`<img class="event-illustration result-illustration" src="${eventArt(id)}" alt="貓貓完成了${esc(EVENTS.find(e=>e.id===id)?.title||'一件小事')}"><div class="result-message"><img src="${poseArt('happy')}" alt="開心舉起肉球的貓貓"><p>${esc(message||'今日又多一個小回憶。')}</p></div><button class="primary result-done" id="resultDone">繼續過小日子</button>`);$('#resultDone').onclick=close;
}
function memoryArt(entry){
 if(EVENT_ART.includes(entry.art))return eventArt(entry.art);
 if(entry.art)return actionArt(entry.art);
 const t=entry.text;
 if(/開飯|舔舔嘴|食到/.test(t))return actionArt('feed');if(/梳梳|肉球|乾淨/.test(t))return actionArt('clean');
 if(/瞓|懶腰|起身/.test(t))return actionArt('rest');if(/捉到|遊戲/.test(t))return actionArt('play');if(/咕嚕|蹭你/.test(t))return actionArt('pet');
 for(const e of EVENTS)if(e.choices.some(c=>t.startsWith(c.line)))return eventArt(e.id);
 return eventArt('explore');
}
function showJournal(){if(!state)return;sheet('我哋嘅圖畫日記',`<p class="intro">已遇見 ${eventProgress()} 款小故事。呢度記低最近 35 段回憶。</p>${state.log.map(l=>`<article class="journal-entry"><img src="${memoryArt(l)}" alt="這段貓貓回憶的插畫" loading="lazy"><div><time>${new Date(l.at).toLocaleString('zh-HK',{month:'short',day:'numeric',hour:'2-digit',minute:'2-digit'})}</time>${esc(l.text)}</div></article>`).join('')}`);}
function play(){
 if(!state||!connected||busy)return;if(state.sleeping){toast('貓貓瞓緊，起身再玩啦。',poseArt('sleep'));return;}
 if(Date.now()-(state.careAt.play||0)<15000){toast('俾貓貓抖幾秒先。',poseArt('wash'));return;}
 playRun={hits:0};
 sheet('陪貓貓捉毛冷',`<p class="intro">輕輕捉住毛冷 5 次，貓貓會跟住撲過去！</p><div class="play-field" id="playField"><img class="play-cat" id="playCat" src="${poseArt('crouch')}" alt="準備撲毛冷的貓貓"><button class="toy" id="toy" aria-label="捉毛冷" style="left:60%;top:25%"><img src="../assets/yarn/ball.webp" alt="藍色毛冷"></button></div><div class="play-count" id="playCount">0 / 5</div>`);
 $('#toy').onclick=async()=>{
   if(!playRun)return;playRun.hits++;$('#playCount').textContent=`${playRun.hits} / 5`;
   const toy=$('#toy'),cat=$('#playCat'),field=$('#playField');
   cat.src=poseArt('pounce');cat.classList.add('leaping');cat.style.left=`${Math.max(0,Math.min(field.clientWidth-104,toy.offsetLeft-30))}px`;cat.style.top=`${Math.max(20,Math.min(field.clientHeight-115,toy.offsetTop+5))}px`;
   setTimeout(()=>{if(cat.isConnected){cat.src=poseArt('crouch');cat.classList.remove('leaping');}},550);
   if(playRun.hits===5){toy.disabled=true;const ok=await act({type:'play'},{keepSheet:true});if(!field.isConnected)return;
     if(ok){field.innerHTML=`<div class="play-complete"><img src="${poseArt('happy')}" alt="玩得開心舉起肉球的貓貓"><strong>捉到晒！</strong><span>貓貓玩得好滿足。</span></div>`;playRun=null;}
     else field.innerHTML=`<div class="play-complete"><img src="${poseArt('sit')}" alt="等待的貓貓"><span>暫時未能儲存呢次陪玩，請檢查本機存檔後再玩啦。</span></div>`;
   }else{toy.style.left=`${12+Math.random()*(field.clientWidth-90)}px`;toy.style.top=`${12+Math.random()*(field.clientHeight-90)}px`;}
 };
}
$('#help').onclick=()=>sheet('慢慢過小日子',`<div class="help-text"><p>🥣 <b>照顧：</b>餵食、梳毛、陪玩、休息。撳貓貓可以摸摸佢。</p><p>⌖ <b>探索：</b>撳場景入面嘅小光點，或者「去散步」。一共有 ${EVENTS.length} 款配圖故事，每次探索會優先遇到未見過嘅。唔同日夜天氣有唔同際遇，仲有 12 件小物等你發現。</p><p>☀ <b>日夜天氣：</b>遊戲 24 分鐘係一日，每 3 分鐘天氣會轉。夜晚同雨天會遇到唔同事情；呢個係貓貓世界嘅天氣。</p><p>♡ <b>成長：</b>累積 12 成長開放池塘、30 開放小街；25 成長變少年貓，85 變大個貓。</p><p>🌙 <b>放心休息：</b>離開後狀態只會慢慢下降，唔會死亡或走失。瞓覺會持續回復精神。</p><p>💾 <b>本機存檔：</b>唔使登入，每個動作都會儲存喺呢部裝置、呢個瀏覽器，見到「已存喺本機」就完成。換裝置或瀏覽器唔會自動同步；同一瀏覽器共用同一份進度。清除網站資料會清走存檔，私密瀏覽亦可能喺關閉後移除資料。</p></div>`);
$('#nameButton').onclick=()=>{if(!state)return;sheet('幫貓貓改個名',`<form class="rename-form" id="renameForm"><label for="newName">貓貓名字</label><input id="newName" maxlength="12" value="${esc(state.name)}" required autocomplete="off"><button class="primary" type="submit">就叫呢個名</button></form>`);$('#renameForm').onsubmit=e=>{e.preventDefault();act({type:'rename',name:$('#newName').value});};};
$('#map').onclick=showMap;$('#collection').onclick=showCollection;$('#journal').onclick=showJournal;$('#eventPeek').onclick=showEvent;$('#cat').onclick=()=>act({type:state.sleeping?'wake':'pet'});$('#play').onclick=play;$('#retry').onclick=load;
for(const b of document.querySelectorAll('[data-action]'))b.onclick=()=>act({type:b.dataset.action});for(const b of document.querySelectorAll('.scene-spot'))b.onclick=()=>act({type:'explore'});
setInterval(()=>{if(!document.hidden)renderClock();},1000);setInterval(()=>{if(connected&&!document.hidden&&!busy&&!$('#sheet').open)act({type:'heartbeat'},{quiet:true,keepSheet:true});},30000);
window.addEventListener('storage',e=>{if((e.key===STORAGE_KEY||e.key===null)&&!busy){close();load();}});
document.addEventListener('visibilitychange',()=>{if(!document.hidden&&!busy)load();});window.addEventListener('pageshow',e=>{if(e.persisted&&!busy)load();});load();
