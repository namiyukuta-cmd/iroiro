(()=>{
'use strict';

const $=id=>document.getElementById(id);
const ui={
  day:$('dayText'),time:$('timeText'),money:$('moneyText'),
  hunger:$('hungerBar'),energy:$('energyBar'),hygiene:$('hygieneBar'),social:$('socialBar'),
  hungerText:$('hungerText'),energyText:$('energyText'),hygieneText:$('hygieneText'),socialText:$('socialText'),
  action:$('actionText'),thought:$('thoughtText'),resident:$('resident'),log:$('logList'),
  pause:$('pauseBtn'),speed:$('speedBtn'),save:$('saveBtn'),load:$('loadBtn')
};

const STORAGE_KEY='idle-sim-save-v1';
const zonePos={
  bed:[16.7,25],kitchen:[50,25],bath:[83.3,25],
  desk:[16.7,75],sofa:[50,75],door:[83.3,75]
};

let state=freshState();
let timer=null;
let speed=1;
let paused=false;

function freshState(){
  return {
    day:1,minute:420,money:1500,
    hunger:72,energy:78,hygiene:80,social:55,
    action:null,remaining:0,zone:'bed',
    logs:[{day:1,minute:420,text:'新しい生活が始まりました。'}]
  };
}

function clamp(v){return Math.max(0,Math.min(100,Math.round(v)))}
function hhmm(minute){
  const m=((minute%1440)+1440)%1440;
  return String(Math.floor(m/60)).padStart(2,'0')+':'+String(m%60).padStart(2,'0');
}
function addLog(text){
  state.logs.unshift({day:state.day,minute:state.minute,text});
  state.logs=state.logs.slice(0,12);
}
function advanceClock(mins){
  state.minute+=mins;
  while(state.minute>=1440){state.minute-=1440;state.day+=1}
}
function hour(){return Math.floor(state.minute/60)}

const actions={
  sleep:{label:'眠っています',zone:'bed',duration:60,thought:'眠いので休む',run(){
    state.energy+=20;state.hunger-=5;state.hygiene-=2;state.social-=1;
  }},
  eat:{label:'食事をしています',zone:'kitchen',duration:30,thought:'お腹が空いた',run(){
    if(state.money>=120){state.money-=120;state.hunger+=38;state.energy+=2}
    else{state.hunger+=12}
  }},
  shower:{label:'シャワーを浴びています',zone:'bath',duration:30,thought:'さっぱりしたい',run(){
    state.hygiene+=44;state.energy-=2;
  }},
  work:{label:'仕事をしています',zone:'desk',duration:60,thought:'お金を稼いでおこう',run(){
    state.money+=320;state.energy-=13;state.hunger-=10;state.hygiene-=4;state.social-=3;
  }},
  relax:{label:'くつろいでいます',zone:'sofa',duration:30,thought:'少しのんびりしよう',run(){
    state.energy+=7;state.social+=2;state.hunger-=3;
  }},
  socialize:{label:'近所へ出かけています',zone:'door',duration:30,thought:'誰かと話したい',run(){
    state.social+=28;state.energy-=4;state.hunger-=3;state.money-=40;
  }}
};

function chooseAction(){
  const h=hour();
  if(state.energy<=24) return 'sleep';
  if(state.hunger<=28) return 'eat';
  if(state.hygiene<=26) return 'shower';
  if(state.social<=22 && h>=10 && h<21) return 'socialize';
  if(h>=23 || h<6) return 'sleep';
  if(state.money<600 && h>=7 && h<20) return 'work';
  if(h>=9 && h<17 && state.energy>42 && state.hunger>40) return 'work';

  const options=[
    ['eat',(100-state.hunger)*1.25],
    ['sleep',(100-state.energy)*1.15],
    ['shower',(100-state.hygiene)*.8],
    ['socialize',(100-state.social)*.72],
    ['relax',24]
  ];
  options.sort((a,b)=>b[1]-a[1]);
  return options[0][0];
}

function startAction(key){
  const a=actions[key];
  state.action=key;
  state.remaining=a.duration;
  state.zone=a.zone;
  addLog(a.label.replace('ています','始めました'));
}

function finishAction(){
  if(!state.action)return;
  const a=actions[state.action];
  a.run();
  state.hunger=clamp(state.hunger);
  state.energy=clamp(state.energy);
  state.hygiene=clamp(state.hygiene);
  state.social=clamp(state.social);
  addLog(a.label.replace('ています','終えました'));
  state.action=null;
  state.remaining=0;
}

function step(){
  if(paused)return;
  if(!state.action)startAction(chooseAction());
  const delta=Math.min(10,state.remaining);
  advanceClock(delta);
  state.remaining-=delta;

  state.hunger=clamp(state.hunger-.7);
  state.energy=clamp(state.energy-.35);
  state.hygiene=clamp(state.hygiene-.16);
  state.social=clamp(state.social-.18);

  if(state.remaining<=0)finishAction();
  render();
}

function render(){
  ui.day.textContent=state.day+'日目';
  ui.time.textContent=hhmm(state.minute);
  ui.money.textContent='¥'+Math.max(0,Math.round(state.money)).toLocaleString('ja-JP');

  for(const key of ['hunger','energy','hygiene','social']){
    ui[key].value=state[key];
    ui[key+'Text'].textContent=state[key];
  }

  const a=state.action?actions[state.action]:null;
  ui.action.textContent=a?a.label:'次の行動を考えています';
  ui.thought.textContent=a?a.thought:'様子を見ています';

  document.querySelectorAll('.zone').forEach(el=>el.classList.toggle('active',el.dataset.zone===state.zone));
  const pos=zonePos[state.zone]||zonePos.sofa;
  ui.resident.style.left=pos[0]+'%';
  ui.resident.style.top=pos[1]+'%';

  ui.log.innerHTML=state.logs.slice(0,7).reverse().map(row =>
    '<div class="log-row"><time>'+hhmm(row.minute)+'</time>'+escapeHtml(row.text)+'</div>'
  ).join('');

  ui.pause.textContent=paused?'再開':'一時停止';
  ui.speed.textContent='速度 ×'+speed;
}
function escapeHtml(s){
  return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}
function restartTimer(){
  if(timer)clearInterval(timer);
  timer=setInterval(step,1000/speed);
}
function saveGame(){
  const payload={...state,savedAt:Date.now()};
  localStorage.setItem(STORAGE_KEY,JSON.stringify(payload));
  addLog('手動保存しました。');
  render();
}
function loadGame(){
  const raw=localStorage.getItem(STORAGE_KEY);
  if(!raw){addLog('保存データがありません。');render();return}
  try{
    const saved=JSON.parse(raw);
    const elapsed=Math.min(12*60,Math.max(0,Math.floor((Date.now()-(saved.savedAt||Date.now()))/60000)));
    delete saved.savedAt;
    state=Object.assign(freshState(),saved);
    if(elapsed>0){
      const loops=Math.floor(elapsed/10);
      for(let i=0;i<loops;i++){
        if(!state.action)startAction(chooseAction());
        const delta=Math.min(10,state.remaining);
        advanceClock(delta);
        state.remaining-=delta;
        state.hunger=clamp(state.hunger-.7);
        state.energy=clamp(state.energy-.35);
        state.hygiene=clamp(state.hygiene-.16);
        state.social=clamp(state.social-.18);
        if(state.remaining<=0)finishAction();
      }
      addLog('留守のあいだに '+elapsed+'分 生活が進みました。');
    }else{
      addLog('保存データを読み込みました。');
    }
  }catch(e){
    state=freshState();
    addLog('保存データを読み込めませんでした。');
  }
  render();
}

ui.pause.addEventListener('click',()=>{paused=!paused;render()});
ui.speed.addEventListener('click',()=>{speed=speed===1?4:speed===4?12:1;restartTimer();render()});
ui.save.addEventListener('click',saveGame);
ui.load.addEventListener('click',loadGame);

render();
restartTimer();
})();
