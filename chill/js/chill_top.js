(()=>{
const room=document.getElementById('room');
const moneyEl=document.getElementById('money');
const timeEl=document.getElementById('time');
const dateEl=document.getElementById('date');
const messageEl=document.getElementById('message');
const customerLayer=document.getElementById('customerLayer');
const productLayer=document.getElementById('productLayer');
const stationLayer=document.getElementById('stationLayer');
const gardenLayer=document.getElementById('gardenLayer');
const travelLayer=document.getElementById('travelLayer');
const SRC_W=864,SRC_H=1536;
const box=(x0,y0,x1,y1)=>({x:x0/SRC_W*100,y:y0/SRC_H*100,w:(x1-x0)/SRC_W*100,h:(y1-y0)/SRC_H*100});
const centerBox=(cx,cy,w,h)=>box(cx-w/2,cy-h/2,cx+w/2,cy+h/2);

const regions={
  customers:[box(155,190,310,385),box(490,190,635,385)],
  products:[box(100,455,190,590),box(225,455,335,590),box(385,440,490,590),box(535,450,625,590),box(665,455,770,590)],
  stations:{
    drying:box(70,790,210,955),
    cauldron:box(215,790,350,960),
    chop:box(375,825,515,955),
    mortar:box(515,800,655,965),
    basket:box(650,820,800,965)
  },
  book:box(748,620,862,775)
};
const plantCenters=[
  [195,1120],[315,1120],[435,1120],[555,1120],[675,1120],
  [195,1195],[315,1195],[435,1195],[555,1195],[675,1195],
  [195,1275],[315,1275],[435,1275],[555,1275],[675,1275]
];
regions.herbs=plantCenters.map(([x,y])=>centerBox(x,y,58,70));

const herbNames=['ラベンダー','カモミール','ミント','セージ','ローズマリー','セントジョーンズワート','エキナセア','レモンバーム','カレンデュラ','エルダー','ローズヒップ','リンデン','クローバー','ネトル','スミレ'];
const seedCosts=[35,40,35,55,60,70,75,55,60,80,85,90,50,65,70];
const herbs=herbNames.map((name,i)=>({name:name,cost:seedCosts[i],unlocked:i<3,grow:i<3?22+i*21:0}));
const tools={drying:true,cauldron:true,basket:true,chop:false,mortar:false};
const toolCosts={chop:240,mortar:320};
const recipes=[
  {name:'安らぎの茶',cost:0,unlocked:true,bonus:0},
  {name:'香草の煎じ液',cost:120,unlocked:false,bonus:2},
  {name:'乾燥薬草包',cost:150,unlocked:false,bonus:3},
  {name:'粉末ブレンド',cost:190,unlocked:false,bonus:5}
];

let money=120,minutes=8*60,day=1,tickNo=0,activeTab='seeds';
let customerSerial=0,currentCustomer=null,saleBusy=false,nextCustomerTick=1,placingProduct=false;
const shelf=[null,null,null,null,null];
const finishedQueue=[];
const rawQueue=[];
const jobs=[];
const shelfEls=[],stationEls={},plotEls=[];

function applyCrop(el,r){
  el.style.backgroundSize=(10000/r.w)+'% '+(10000/r.h)+'%';
  const px=r.w>=99?0:r.x/(100-r.w)*100;
  const py=r.h>=99?0:r.y/(100-r.h)*100;
  el.style.backgroundPosition=px+'% '+py+'%';
}
function placeRegion(el,r){
  el.style.left=r.x+'%';el.style.top=r.y+'%';el.style.width=r.w+'%';el.style.height=r.h+'%';
}
function cropSpan(r,cls){
  const el=document.createElement('span');
  el.className='crop '+(cls||'');
  applyCrop(el,r);
  return el;
}
function say(t){messageEl.textContent=t}
function renderStatus(){
  moneyEl.textContent=money;
  timeEl.textContent=String(Math.floor(minutes/60)%24).padStart(2,'0')+':'+String(minutes%60).padStart(2,'0');
  dateEl.textContent=day+'日目';
}
function bumpMoney(){
  moneyEl.classList.remove('money-bump');void moneyEl.offsetWidth;moneyEl.classList.add('money-bump');
}
function point(el){
  const rr=room.getBoundingClientRect(),r=el.getBoundingClientRect();
  return {x:r.left-rr.left+r.width/2,y:r.top-rr.top+r.height/2};
}
function flyRegion(region,fromEl,toEl,size,duration,done){
  if(!fromEl||!toEl){if(done)done();return}
  const s=point(fromEl),e=point(toEl),m={x:(s.x+e.x)/2,y:Math.min(s.y,e.y)-22};
  const f=cropSpan(region,'traveler');
  f.style.width=(size||22)+'px';f.style.height=(size||22)+'px';
  f.style.left=s.x+'px';f.style.top=s.y+'px';
  travelLayer.appendChild(f);
  const a=f.animate([
    {left:s.x+'px',top:s.y+'px',transform:'translate(-50%,-50%) scale(.72)',opacity:.35},
    {left:m.x+'px',top:m.y+'px',transform:'translate(-50%,-50%) scale(1.06)',opacity:1,offset:.48},
    {left:e.x+'px',top:e.y+'px',transform:'translate(-50%,-50%) scale(.82)',opacity:.25}
  ],{duration:duration||650,easing:'cubic-bezier(.2,.72,.24,1)'});
  a.onfinish=()=>{f.remove();if(done)done()};
}
function pulseStation(key){
  const el=stationEls[key];if(!el)return;
  el.classList.remove('working');void el.offsetWidth;el.classList.add('working');
  setTimeout(()=>el.classList.remove('working'),650);
}

function installMasks(){
  const cm=document.createElement('div');cm.className='customer-mask';customerLayer.appendChild(cm);
  const pm=document.createElement('div');pm.className='product-mask';productLayer.appendChild(pm);
}
function makeStation(key){
  const r=regions.stations[key];
  const b=document.createElement('button');b.type='button';b.className='hit station-hit';placeRegion(b,r);b.dataset.station=key;
  b.appendChild(cropSpan(r,'station-art'));
  b.addEventListener('click',()=>tapStation(key));
  stationLayer.appendChild(b);stationEls[key]=b;
}
function renderStations(){
  Object.keys(stationEls).forEach(k=>{
    stationEls[k].classList.toggle('locked',!tools[k]);
    stationEls[k].classList.toggle('unlocked',!!tools[k]);
  });
}
function makePlot(i){
  const [cx,cy]=plantCenters[i];
  const b=document.createElement('button');b.type='button';b.className='hit plot-hit';
  b.style.left=(cx/SRC_W*100)+'%';b.style.top=(cy/SRC_H*100)+'%';
  const cover=document.createElement('span');cover.className='plot-cover';b.appendChild(cover);
  const art=cropSpan(regions.herbs[i],'plant-art');b.appendChild(art);
  b.addEventListener('click',()=>tapHerb(i));
  b.style.setProperty('--delay',(-i*.17)+'s');gardenLayer.appendChild(b);plotEls[i]={button:b,art:art};
}
function renderGarden(){
  herbs.forEach((h,i)=>{
    const p=plotEls[i],scale=.36+.64*Math.min(1,h.grow/100);
    p.button.classList.toggle('locked',!h.unlocked);
    p.button.classList.toggle('ready',h.unlocked&&h.grow>=100);
    p.art.style.setProperty('--grow',scale);
  });
}

function makeShelfSlot(i){
  const r=regions.products[i];
  const b=document.createElement('button');b.type='button';b.className='shelf-slot';placeRegion(b,r);b.dataset.slot=i;
  b.addEventListener('click',()=>{if(shelf[i]!=null)sellShelfSlot(i,true)});
  productLayer.appendChild(b);shelfEls[i]=b;
}
function paintShelfSlot(i,pop){
  const el=shelfEls[i];el.replaceChildren();
  const type=shelf[i];
  el.classList.toggle('filled',type!=null);
  el.classList.remove('pop');
  if(type==null)return;
  el.appendChild(cropSpan(regions.products[type],'product-art'));
  if(pop){void el.offsetWidth;el.classList.add('pop');setTimeout(()=>el.classList.remove('pop'),360)}
}
function renderShelf(){shelf.forEach((_,i)=>paintShelfSlot(i,false))}
function firstEmptyShelf(){return shelf.findIndex(v=>v==null)}
function shelfTypes(){return shelf.filter(v=>v!=null)}

function harvest(i,manual){
  const h=herbs[i];if(!h.unlocked||h.grow<100)return false;
  h.grow=0;rawQueue.push(i);
  flyRegion(regions.herbs[i],plotEls[i].button,stationEls.basket,18,520);
  pulseStation('basket');
  say((manual?'収穫：':'自動収穫：')+h.name);
  renderGarden();return true;
}
function tapHerb(i){
  const h=herbs[i];
  if(!h.unlocked){say('本から種を買うと植えられます');return}
  if(h.grow>=100){harvest(i,true);return}
  h.grow=Math.min(100,h.grow+28);say(h.name+'に手をかけました');renderGarden();
  if(h.grow>=100)setTimeout(()=>harvest(i,true),180);
}
function routeNow(){
  const r=['drying'];
  if(tools.chop)r.push('chop');
  if(tools.mortar)r.push('mortar');
  r.push('cauldron');return r;
}
function startJob(){
  if(rawQueue.length===0||jobs.length>=1)return;
  jobs.push({herb:rawQueue.shift(),route:routeNow(),step:0,finishing:false});
}
function advanceJob(job){
  if(!job||job.finishing)return;
  if(job.step>=job.route.length){finishJob(job);return}
  const toKey=job.route[job.step];
  const fromEl=job.step===0?stationEls.basket:stationEls[job.route[job.step-1]];
  const toEl=stationEls[toKey];
  flyRegion(regions.herbs[job.herb],fromEl,toEl,18,470);
  pulseStation(toKey);job.step++;
  say(herbs[job.herb].name+'を自動加工中');
  if(job.step>=job.route.length){job.finishing=true;setTimeout(()=>finishJob(job),520)}
}
function finishJob(job){
  const idx=jobs.indexOf(job);if(idx<0)return;
  jobs.splice(idx,1);
  finishedQueue.push(job.herb%5);
  placeNextFinished();
}
function placeNextFinished(){
  if(placingProduct||finishedQueue.length===0)return;
  const slot=firstEmptyShelf();if(slot<0){say('商品棚がいっぱいです');return}
  placingProduct=true;
  const type=finishedQueue.shift();
  say('商品が1個できました');
  flyRegion(regions.products[type],stationEls.cauldron,shelfEls[slot],32,620,()=>{
    shelf[slot]=type;paintShelfSlot(slot,true);placingProduct=false;say('商品が棚にポコッと並びました');
    setTimeout(()=>{tryServeCustomer();placeNextFinished()},180);
  });
}
function tapStation(key){
  if(!tools[key]){say('本からこの道具を買えます');return}
  pulseStation(key);
  const j=jobs[0];
  if(j&&j.route[j.step]===key){advanceJob(j);say('作業を手伝いました')}
  else say(key==='basket'?'収穫したハーブ '+rawQueue.length+'束':'今は自動作業待ちです');
}

function chooseWant(){
  const stocked=shelfTypes();
  if(stocked.length)return stocked[Math.floor(Math.random()*stocked.length)];
  const available=Math.max(1,Math.min(5,herbs.filter(h=>h.unlocked).length));
  return Math.floor(Math.random()*available);
}
function enterCustomer(){
  if(currentCustomer||saleBusy)return;
  const artIndex=customerSerial++%2;
  const r=regions.customers[artIndex];
  const el=document.createElement('button');el.type='button';el.className='hit customer-hit entering';placeRegion(el,r);
  el.appendChild(cropSpan(r,'customer-art'));
  const req=cropSpan(regions.herbs[0],'customer-request');el.appendChild(req);
  el.addEventListener('click',()=>tryServeCustomer(true));
  customerLayer.appendChild(el);
  const want=chooseWant();applyCrop(req,regions.herbs[want]);
  currentCustomer={el:el,want:want,artIndex:artIndex,arrived:false,waitTicks:0};
  say('お客さんが入ってきました');
  requestAnimationFrame(()=>requestAnimationFrame(()=>el.classList.remove('entering')));
  setTimeout(()=>{if(!currentCustomer||currentCustomer.el!==el)return;currentCustomer.arrived=true;el.classList.add('waiting');tryServeCustomer()},620);
}
function leaveCustomer(reason){
  if(!currentCustomer)return;
  const c=currentCustomer;currentCustomer=null;
  c.el.classList.remove('waiting');c.el.classList.add('leaving');
  say(reason||'お客さんが買い物を終えて帰りました');
  setTimeout(()=>{c.el.remove();nextCustomerTick=tickNo+2},560);
}
function findShelfSlotFor(type){return shelf.findIndex(v=>v===type)}
function priceFor(type){return 14+type*3+recipes.filter(r=>r.unlocked).reduce((s,r)=>s+r.bonus,0)}
function makeCoinBurst(customerEl,amount,done){
  const start=point(customerEl);
  const target=point(moneyEl);
  const total=Math.max(1,Math.floor(amount));
  let landed=0;

  const sparkCount=Math.max(12,Math.min(24,total));
  for(let i=0;i<sparkCount;i++){
    const s=document.createElement('span');
    s.className='coin-speck';
    s.style.left=start.x+'px';
    s.style.top=start.y+'px';
    travelLayer.appendChild(s);

    const angle=(Math.PI*2*i/sparkCount)+((i%2)*.11);
    const dist=24+(i%5)*9;
    const dx=Math.cos(angle)*dist;
    const dy=Math.sin(angle)*dist;

    const a=s.animate([
      {left:start.x+'px',top:start.y+'px',transform:'translate(-50%,-50%) scale(.15)',opacity:0},
      {left:(start.x+dx*.65)+'px',top:(start.y+dy*.65)+'px',transform:'translate(-50%,-50%) scale(1.3)',opacity:1,offset:.38},
      {left:(start.x+dx)+'px',top:(start.y+dy)+'px',transform:'translate(-50%,-50%) scale(.1)',opacity:0}
    ],{duration:520,easing:'cubic-bezier(.18,.9,.32,1)'});
    a.onfinish=()=>s.remove();
  }

  for(let i=0;i<total;i++){
    const coin=document.createElement('span');
    coin.className='coin';
    coin.textContent='G';
    coin.style.left=start.x+'px';
    coin.style.top=start.y+'px';
    coin.style.animation='coinSpin .42s linear infinite';
    travelLayer.appendChild(coin);

    const spread=((i/Math.max(1,total-1))-.5)*Math.PI*1.15;
    const burstDist=30+(i%7)*5;
    const burstX=start.x+Math.sin(spread)*burstDist;
    const burstY=start.y-Math.cos(spread)*burstDist-(i%4)*3;
    const curveX=target.x+((i%9)-4)*5;
    const curveY=target.y-30-(i%5)*5;
    const delay=i*16;

    const burst=coin.animate([
      {left:start.x+'px',top:start.y+'px',transform:'translate(-50%,-50%) scale(.2)',opacity:0},
      {left:burstX+'px',top:burstY+'px',transform:'translate(-50%,-50%) scale(1.18)',opacity:1}
    ],{
      delay:delay,
      duration:210,
      easing:'cubic-bezier(.18,.9,.32,1.28)',
      fill:'forwards'
    });

    burst.onfinish=()=>{
      const fly=coin.animate([
        {left:burstX+'px',top:burstY+'px',transform:'translate(-50%,-50%) scale(1.08)',opacity:1},
        {left:curveX+'px',top:curveY+'px',transform:'translate(-50%,-50%) scale(.95)',opacity:1,offset:.56},
        {left:target.x+'px',top:target.y+'px',transform:'translate(-50%,-50%) scale(.62)',opacity:.9}
      ],{
        duration:610+(i%6)*22,
        easing:'cubic-bezier(.22,.72,.24,1)',
        fill:'forwards'
      });

      fly.onfinish=()=>{
        coin.remove();
        money+=1;
        landed++;
        renderStatus();
        bumpMoney();
        if(landed===total&&done)done();
      };
    };
  }
}
function sellShelfSlot(slot,manual){
  if(saleBusy||!currentCustomer||!currentCustomer.arrived||shelf[slot]==null)return false;
  if(shelf[slot]!==currentCustomer.want){
    if(manual)say('このお客さんが欲しい商品ではありません');
    return false;
  }
  saleBusy=true;
  const type=shelf[slot],gain=priceFor(type),customerEl=currentCustomer.el;
  shelf[slot]=null;paintShelfSlot(slot,false);
  say('商品がお客さんへヒュン');
  flyRegion(regions.products[type],shelfEls[slot],customerEl,34,620,()=>{
    say('コインが弾けました');
    makeCoinBurst(customerEl,gain,()=>{
      say('+'+gain+'G');
      saleBusy=false;
      leaveCustomer();
      setTimeout(placeNextFinished,180);
    });
  });
  return true;
}
function tryServeCustomer(manual){
  if(!currentCustomer||!currentCustomer.arrived||saleBusy)return false;
  const slot=findShelfSlotFor(currentCustomer.want);
  if(slot<0){if(manual)say('欲しい商品がまだありません');return false}
  return sellShelfSlot(slot,!!manual);
}

function renderBook(){
  document.querySelectorAll('.book-tab').forEach(b=>b.classList.toggle('active',b.dataset.tab===activeTab));
  const c=document.getElementById('bookContent');
  if(activeTab==='seeds'){
    c.innerHTML=herbs.map((h,i)=>'<div class="book-item"><span class="book-mini crop" data-mini-herb="'+i+'"></span><div><div class="book-name">'+h.name+'</div><div class="book-desc">'+(h.unlocked?'庭で育成中':'庭に追加する種')+'</div></div><button class="buy" data-buy-seed="'+i+'" '+(h.unlocked||money<h.cost?'disabled':'')+'>'+(h.unlocked?'所持':h.cost+'G')+'</button></div>').join('');
    c.querySelectorAll('[data-mini-herb]').forEach(e=>applyCrop(e,regions.herbs[+e.dataset.miniHerb]));
  }else if(activeTab==='tools'){
    c.innerHTML=['chop','mortar'].map(k=>'<div class="book-item"><span class="book-mini crop" data-mini-tool="'+k+'"></span><div><div class="book-name">'+(k==='chop'?'刻み台':'乳鉢')+'</div><div class="book-desc">'+(tools[k]?'設置済み':'調合部屋に追加')+'</div></div><button class="buy" data-buy-tool="'+k+'" '+(tools[k]||money<toolCosts[k]?'disabled':'')+'>'+(tools[k]?'設置済':toolCosts[k]+'G')+'</button></div>').join('');
    c.querySelectorAll('[data-mini-tool]').forEach(e=>applyCrop(e,regions.stations[e.dataset.miniTool]));
  }else{
    c.innerHTML=recipes.map((r,i)=>'<div class="book-item"><span class="book-mini crop" data-mini-product="'+Math.min(i,4)+'"></span><div><div class="book-name">'+r.name+'</div><div class="book-desc">'+(r.unlocked?'覚えています':'商品の価値が上がります')+'</div></div><button class="buy" data-buy-recipe="'+i+'" '+(r.unlocked||money<r.cost?'disabled':'')+'>'+(r.unlocked?'読了':r.cost+'G')+'</button></div>').join('');
    c.querySelectorAll('[data-mini-product]').forEach(e=>applyCrop(e,regions.products[+e.dataset.miniProduct]));
  }
}
function openBook(){renderBook();document.getElementById('bookShade').hidden=false;document.getElementById('bookPanel').hidden=false}
function closeBook(){document.getElementById('bookShade').hidden=true;document.getElementById('bookPanel').hidden=true}
document.getElementById('bookButton').addEventListener('click',openBook);
document.getElementById('bookClose').addEventListener('click',closeBook);
document.getElementById('bookShade').addEventListener('click',closeBook);
document.querySelectorAll('.book-tab').forEach(b=>b.addEventListener('click',()=>{activeTab=b.dataset.tab;renderBook()}));
document.getElementById('bookContent').addEventListener('click',e=>{
  const s=e.target.closest('[data-buy-seed]');
  if(s){const i=+s.dataset.buySeed,h=herbs[i];if(!h.unlocked&&money>=h.cost){money-=h.cost;h.unlocked=true;h.grow=0;renderStatus();renderGarden();renderBook();say(h.name+'を植えました')}return}
  const t=e.target.closest('[data-buy-tool]');
  if(t){const k=t.dataset.buyTool;if(!tools[k]&&money>=toolCosts[k]){money-=toolCosts[k];tools[k]=true;stationEls[k].classList.add('reveal');renderStatus();renderStations();renderBook();say((k==='chop'?'刻み台':'乳鉢')+'を置きました');setTimeout(()=>stationEls[k].classList.remove('reveal'),500)}return}
  const r=e.target.closest('[data-buy-recipe]');
  if(r){const i=+r.dataset.buyRecipe,rec=recipes[i];if(!rec.unlocked&&money>=rec.cost){money-=rec.cost;rec.unlocked=true;renderStatus();renderBook();say(rec.name+'を覚えました')}}
});

function autoTick(){
  tickNo++;minutes+=10;if(minutes>=1440){minutes-=1440;day++}
  herbs.forEach((h,i)=>{if(!h.unlocked)return;h.grow=Math.min(100,h.grow+12+(i%3)*2);if(h.grow>=100)harvest(i,false)});
  startJob();if(jobs.length)advanceJob(jobs[0]);
  placeNextFinished();
  if(!currentCustomer&&!saleBusy&&tickNo>=nextCustomerTick)enterCustomer();
  if(currentCustomer&&currentCustomer.arrived){
    const sold=tryServeCustomer();
    if(currentCustomer&&!saleBusy&&!sold){
      currentCustomer.waitTicks++;
      if(currentCustomer.waitTicks>=5)leaveCustomer('商品が間に合わず、お客さんは帰りました');
    }
  }
  renderGarden();renderStatus();
}

installMasks();
Object.keys(regions.stations).forEach(makeStation);
plantCenters.forEach((_,i)=>makePlot(i));
regions.products.forEach((_,i)=>makeShelfSlot(i));
placeRegion(document.getElementById('bookButton'),regions.book);
applyCrop(document.getElementById('bookArt'),regions.book);
renderStations();renderGarden();renderShelf();renderStatus();
setInterval(autoTick,1050);
})();