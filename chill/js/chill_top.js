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
const herbs=herbNames.map((name,i)=>({name,cost:seedCosts[i],unlocked:i<3,grow:i<3?25+i*18:0}));
const tools={drying:true,cauldron:true,basket:true,chop:false,mortar:false};
const toolCosts={chop:240,mortar:320};
const recipes=[
  {name:'安らぎの茶',cost:0,unlocked:true,bonus:0},
  {name:'香草の煎じ液',cost:120,unlocked:false,bonus:2},
  {name:'乾燥薬草包',cost:150,unlocked:false,bonus:3},
  {name:'粉末ブレンド',cost:190,unlocked:false,bonus:5}
];

let money=120,minutes=8*60,day=1,tickNo=0,activeTab='seeds';
const stocks=[0,0,0,0,0];
const rawQueue=[];
const jobs=[];
const customerWants=[0,1];
const productEls=[],customerEls=[],stationEls={},plotEls=[],requestEls=[];

function applyCrop(el,r){
  el.style.backgroundSize=(10000/r.w)+'% '+(10000/r.h)+'%';
  const px=r.w>=99?0:r.x/(100-r.w)*100;
  const py=r.h>=99?0:r.y/(100-r.h)*100;
  el.style.backgroundPosition=px+'% '+py+'%';
}
function placeRegion(el,r){
  el.style.left=r.x+'%';el.style.top=r.y+'%';el.style.width=r.w+'%';el.style.height=r.h+'%';
}
function cropSpan(r,cls=''){
  const el=document.createElement('span');
  el.className='crop '+cls;
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
function flyRegion(region,fromEl,toEl,size=20,duration=700){
  if(!fromEl||!toEl)return;
  const s=point(fromEl),e=point(toEl),m={x:(s.x+e.x)/2,y:Math.min(s.y,e.y)-18};
  const f=cropSpan(region,'traveler');
  f.style.width=size+'px';f.style.height=size+'px';
  f.style.left=s.x+'px';f.style.top=s.y+'px';
  travelLayer.appendChild(f);
  const a=f.animate([
    {left:s.x+'px',top:s.y+'px',transform:'translate(-50%,-50%) scale(.72)',opacity:.2},
    {left:m.x+'px',top:m.y+'px',transform:'translate(-50%,-50%) scale(1.08)',opacity:1,offset:.5},
    {left:e.x+'px',top:e.y+'px',transform:'translate(-50%,-50%) scale(.75)',opacity:.15}
  ],{duration,easing:'ease-in-out'});
  a.onfinish=()=>f.remove();
}
function pulseStation(key){
  const el=stationEls[key];if(!el)return;
  el.classList.remove('working');void el.offsetWidth;el.classList.add('working');
  setTimeout(()=>el.classList.remove('working'),650);
}
function coinPop(target,amount){
  const p=point(target),el=document.createElement('span');
  el.className='coin-pop';el.textContent='+'+amount+'G';el.style.left=p.x+'px';el.style.top=p.y+'px';
  travelLayer.appendChild(el);
  const a=el.animate([{transform:'translate(-50%,0)',opacity:0},{transform:'translate(-50%,-16px)',opacity:1,offset:.35},{transform:'translate(-50%,-34px)',opacity:0}],{duration:900,easing:'ease-out'});
  a.onfinish=()=>el.remove();
}

function makeCustomer(i){
  const r=regions.customers[i];
  const b=document.createElement('button');b.type='button';b.className='hit customer-hit active';placeRegion(b,r);
  const art=cropSpan(r,'customer-art');b.appendChild(art);
  b.addEventListener('click',()=>sellToCustomer(i,true));
  customerLayer.appendChild(b);customerEls[i]=b;
  const req=document.createElement('span');req.className='crop request-icon';
  req.style.left=(i===0?'40.5':'80')+'%';req.style.top=(i===0?'15.3':'15.7')+'%';
  req.style.transform='translate(-50%,-50%)';
  customerLayer.appendChild(req);requestEls[i]=req;
}
function renderCustomers(){
  customerWants.forEach((w,i)=>applyCrop(requestEls[i],regions.herbs[w]));
}
function makeProduct(i){
  const r=regions.products[i];
  const b=document.createElement('button');b.type='button';b.className='hit product-hit';placeRegion(b,r);
  const art=cropSpan(r,'product-art');b.appendChild(art);
  const stock=document.createElement('span');stock.className='stock-badge';b.appendChild(stock);
  b.addEventListener('click',()=>sellProduct(i,true));
  productLayer.appendChild(b);productEls[i]=b;
}
function renderProducts(){
  stocks.forEach((n,i)=>{productEls[i].classList.toggle('stocked',n>0);productEls[i].querySelector('.stock-badge').textContent=n});
}
function makeStation(key){
  const r=regions.stations[key];
  const b=document.createElement('button');b.type='button';b.className='hit station-hit';placeRegion(b,r);b.dataset.station=key;
  const art=cropSpan(r,'station-art');b.appendChild(art);
  b.addEventListener('click',()=>tapStation(key));
  stationLayer.appendChild(b);stationEls[key]=b;
}
function renderStations(){
  Object.keys(stationEls).forEach(k=>{stationEls[k].classList.toggle('locked',!tools[k]);stationEls[k].classList.toggle('unlocked',!!tools[k])});
}
function makePlot(i){
  const [cx,cy]=plantCenters[i];
  const b=document.createElement('button');b.type='button';b.className='hit plot-hit';b.style.left=(cx/SRC_W*100)+'%';b.style.top=(cy/SRC_H*100)+'%';
  const cover=document.createElement('span');cover.className='plot-cover';b.appendChild(cover);
  const art=cropSpan(regions.herbs[i],'plant-art');b.appendChild(art);
  b.addEventListener('click',()=>tapHerb(i));
  gardenLayer.appendChild(b);plotEls[i]={button:b,art};
}
function renderGarden(){
  herbs.forEach((h,i)=>{
    const p=plotEls[i],scale=.36+.64*Math.min(1,h.grow/100);
    p.button.classList.toggle('locked',!h.unlocked);
    p.button.classList.toggle('ready',h.unlocked&&h.grow>=100);
    p.art.style.setProperty('--grow',scale);
  });
}

function harvest(i,manual=false){
  const h=herbs[i];if(!h.unlocked||h.grow<100)return false;
  h.grow=0;rawQueue.push(i);
  flyRegion(regions.herbs[i],plotEls[i].button,stationEls.basket,18,620);
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
  if(rawQueue.length===0||jobs.length>=2)return;
  jobs.push({herb:rawQueue.shift(),route:routeNow(),step:0});
}
function advanceJob(job){
  if(!job)return;
  if(job.step>=job.route.length)return finishJob(job);
  const toKey=job.route[job.step],fromEl=job.step===0?stationEls.basket:stationEls[job.route[job.step-1]],toEl=stationEls[toKey];
  flyRegion(regions.herbs[job.herb],fromEl,toEl,18,640);pulseStation(toKey);job.step++;
  say(herbs[job.herb].name+'を自動加工中');
  if(job.step>=job.route.length)setTimeout(()=>finishJob(job),690);
}
function finishJob(job){
  const idx=jobs.indexOf(job);if(idx<0)return;
  jobs.splice(idx,1);
  const p=job.herb%5;stocks[p]++;
  flyRegion(regions.products[p],stationEls.cauldron,productEls[p],27,720);
  setTimeout(()=>{renderProducts();say('商品が棚に並びました')},500);
}
function tapStation(key){
  if(!tools[key]){say('本からこの道具を買えます');return}
  pulseStation(key);
  const j=jobs.find(x=>x.route[x.step]===key);
  if(j){advanceJob(j);say('作業を手伝いました')}else say(key==='basket'?'収穫したハーブ '+rawQueue.length+'束':'今は自動作業待ちです');
}
function priceFor(i){return 14+i*3+recipes.filter(r=>r.unlocked).reduce((s,r)=>s+r.bonus,0)}
function newWant(i){
  const available=Math.max(1,Math.min(5,herbs.filter(h=>h.unlocked).length));
  customerWants[i]=Math.floor(Math.random()*available);renderCustomers();
}
function sellToCustomer(ci,manual=false){
  const p=customerWants[ci];
  if(stocks[p]<=0){say('このお客さんの商品はまだ出来ていません');return false}
  stocks[p]--;const gain=priceFor(p);money+=gain;
  flyRegion(regions.products[p],productEls[p],customerEls[ci],28,650);coinPop(customerEls[ci],gain);
  customerEls[ci].classList.remove('active');void customerEls[ci].offsetWidth;customerEls[ci].classList.add('active');
  renderProducts();renderStatus();bumpMoney();say(manual?'商品を手渡しました':'商品が自動で売れました');
  setTimeout(()=>newWant(ci),700);return true;
}
function sellProduct(p,manual=false){
  if(stocks[p]<=0){say('この商品はまだありません');return}
  const ci=customerWants.findIndex(w=>w===p);
  if(ci>=0){sellToCustomer(ci,manual);return}
  const fallback=0;stocks[p]--;const gain=Math.max(8,priceFor(p)-3);money+=gain;
  flyRegion(regions.products[p],productEls[p],customerEls[fallback],28,650);coinPop(customerEls[fallback],gain);
  renderProducts();renderStatus();bumpMoney();say('商品を販売しました');
}

function renderBook(){
  document.querySelectorAll('.book-tab').forEach(b=>b.classList.toggle('active',b.dataset.tab===activeTab));
  const c=document.getElementById('bookContent');
  if(activeTab==='seeds'){
    c.innerHTML=herbs.map((h,i)=>`<div class="book-item"><span class="book-mini crop" data-mini-herb="${i}"></span><div><div class="book-name">${h.name}</div><div class="book-desc">${h.unlocked?'庭で育成中':'庭に追加する種'}</div></div><button class="buy" data-buy-seed="${i}" ${h.unlocked||money<h.cost?'disabled':''}>${h.unlocked?'所持':h.cost+'G'}</button></div>`).join('');
    c.querySelectorAll('[data-mini-herb]').forEach(e=>applyCrop(e,regions.herbs[+e.dataset.miniHerb]));
  }else if(activeTab==='tools'){
    c.innerHTML=['chop','mortar'].map(k=>`<div class="book-item"><span class="book-mini crop" data-mini-tool="${k}"></span><div><div class="book-name">${k==='chop'?'刻み台':'乳鉢'}</div><div class="book-desc">${tools[k]?'設置済み':'調合部屋に追加'}</div></div><button class="buy" data-buy-tool="${k}" ${tools[k]||money<toolCosts[k]?'disabled':''}>${tools[k]?'設置済':toolCosts[k]+'G'}</button></div>`).join('');
    c.querySelectorAll('[data-mini-tool]').forEach(e=>applyCrop(e,regions.stations[e.dataset.miniTool]));
  }else{
    c.innerHTML=recipes.map((r,i)=>`<div class="book-item"><span class="book-mini crop" data-mini-product="${Math.min(i,4)}"></span><div><div class="book-name">${r.name}</div><div class="book-desc">${r.unlocked?'覚えています':'商品の価値が上がります'}</div></div><button class="buy" data-buy-recipe="${i}" ${r.unlocked||money<r.cost?'disabled':''}>${r.unlocked?'読了':r.cost+'G'}</button></div>`).join('');
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
  herbs.forEach((h,i)=>{if(!h.unlocked)return;h.grow=Math.min(100,h.grow+16+(i%3)*2);if(h.grow>=100)harvest(i,false)});
  startJob();if(jobs.length)advanceJob(jobs[0]);
  if(tickNo%4===0){for(let i=0;i<customerWants.length;i++){if(sellToCustomer(i,false))break}}
  renderGarden();renderStatus();
}

regions.customers.forEach((_,i)=>makeCustomer(i));
regions.products.forEach((_,i)=>makeProduct(i));
Object.keys(regions.stations).forEach(makeStation);
plantCenters.forEach((_,i)=>makePlot(i));
placeRegion(document.getElementById('bookButton'),regions.book);
applyCrop(document.getElementById('bookArt'),regions.book);
renderCustomers();renderProducts();renderStations();renderGarden();renderStatus();
setInterval(autoTick,1300);
})();