import {EVENTS} from './world.js';
export const POSES = ['sit','blink','walk-a','walk-b','stretch','roll','wash','sleep','eat-a','eat-b','brush-a','brush-b','crouch','pounce','pet','happy'];
export const poseArt = name => `../assets/days/cute/poses/${POSES.includes(name)?name:'sit'}.webp`;
export const EVENT_ART = [...EVENTS.map(e=>e.id),'explore','decorate'];
export const eventArt = id => `../assets/days/cute/events/${EVENT_ART.includes(id)?id:'explore'}.webp`;
export const actionArt = type => ({feed:poseArt('eat-a'),clean:poseArt('brush-a'),pet:poseArt('pet'),rest:poseArt('sleep'),wake:poseArt('stretch'),play:poseArt('pounce'),move:eventArt('explore'),explore:eventArt('explore'),decorate:eventArt('decorate'),rename:poseArt('happy')})[type] || poseArt('sit');

// Only this component changes the companion's pose. Page refreshes never interrupt
// a care animation, and hidden pages have no running frame or idle timers.
export function createCompanion({image,zone,speech,paused}) {
 let pet=null,frameTimer=null,idleTimer=null,activity=null,frameIndex=0,expires=0,lastArea=null;
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const face=document.createElement('span');face.className='cat-affection';face.ariaHidden='true';face.textContent='♡  ♡';zone.appendChild(face);
 POSES.forEach(name=>{const img=new Image();img.src=poseArt(name);});
 const frame=(name)=>{const src=poseArt(name);if(image.getAttribute('src')!==src)image.src=src;image.alt=({sleep:'蜷成一團睡覺的貓貓','eat-a':'低頭吃飯的貓貓','eat-b':'舔嘴的貓貓','brush-a':'享受梳毛的貓貓','brush-b':'歪頭享受梳毛的貓貓',roll:'露肚撒嬌的貓貓',stretch:'伸懶腰的貓貓',pet:'被摸頭的貓貓',wash:'洗面的貓貓',pounce:'跳起捉毛冷的貓貓'})[name]||'可愛的三花貓';zone.dataset.pose=name;};
 function clearFrames(){clearTimeout(frameTimer);frameTimer=null;}
 function base(){activity=null;zone.dataset.activity=pet?.sleeping?'sleep':'idle';zone.style.setProperty('--facing','1');frame(pet?.sleeping?'sleep':'sit');}
 function scheduleIdle(){clearTimeout(idleTimer);if(document.hidden||reduced.matches)return;idleTimer=setTimeout(idle,4200+Math.random()*3400);}
 function sequence(kind,frames,duration=2600,step=330){
   clearFrames();clearTimeout(idleTimer);activity=kind;zone.dataset.activity=kind;zone.style.setProperty('--facing','1');expires=Date.now()+duration;frameIndex=0;
   function next(){if(document.hidden){base();return;}frame(frames[frameIndex++%frames.length]);if(Date.now()>=expires){base();scheduleIdle();return;}frameTimer=setTimeout(next,reduced.matches?duration:step);}
   next();
 }
 function walk(target){if(!pet||pet.sleeping)return;const old=Number.parseFloat(zone.style.left)||53;sequence('walk',['walk-a','walk-b'],2300,190);zone.style.setProperty('--facing',target<old?'-1':'1');zone.style.left=`${target}%`;}
 function idle(){if(!pet||pet.sleeping||paused()){scheduleIdle();return;}const p=Math.random();if(p<.45)walk(pet.area==='pond'?30+Math.random()*18:30+Math.random()*40);else if(p<.65)sequence('stretch',['stretch'],2400);else if(p<.8)sequence('wash',['wash','blink','wash'],2700,650);else if(p<.92)sequence('roll',['roll'],2500);else sequence('blink',['sit','blink','sit'],1300,430);}
 function sync(next){pet=next;zone.classList.toggle('sleeping',pet.sleeping);if(lastArea!==pet.area){lastArea=pet.area;zone.style.left=pet.area==='pond'?'37%':'53%';}if(!activity){base();scheduleIdle();}if(pet.sleeping&&activity!=='rest'){clearFrames();base();}}
 function play(type){if(!pet)return;if(type==='feed')sequence('eat',['eat-a','eat-b','eat-a'],3700,490);else if(type==='clean')sequence('brush',['brush-a','brush-b'],3600,550);else if(type==='pet')sequence('love',['pet','roll','pet','happy'],3600,900);else if(type==='rest'){sequence('rest',pet.sleeping?['stretch','sleep','sleep']:['stretch','happy','sit'],2400,800);}else if(type==='wake')sequence('stretch',['stretch','happy'],2600,1300);else if(type==='play')sequence('play',['crouch','pounce','happy'],2600,520);else if(type==='explore'||type==='move')walk(pet.area==='pond'?40:33+Math.random()*34);else if(type==='choose'||type==='decorate')sequence('happy',['happy','pet'],2600,650);}
 document.addEventListener('visibilitychange',()=>{if(document.hidden){clearFrames();clearTimeout(idleTimer);activity=null;}else if(pet){base();scheduleIdle();}});
 reduced.addEventListener('change',()=>{clearFrames();base();scheduleIdle();});
 return {sync,play};
}
