(() => {
  'use strict';

  const $ = id => document.getElementById(id);
  const screen = $('actionScreen');
  const title = $('actionTitle');
  const back = $('actionBack');
  const pot = $('begPot');
  const grid = $('sellGrid');
  const dialog = $('actionDialog');
  const passerbyLane = $('passerbyLane');
  const passerbyPopup = $('passerbyPopup');
  const speedButtons = Array.from(document.querySelectorAll('[data-action-speed]'));

  let stateRef = null;
  let mode = 'beg';
  let passerbyTimer = null;
  let passerbySprite = null;
  let selectedSellItemId = null;

  const PASSERBY_IMAGES = Object.freeze([
    './asset/Npc/npc_man_01.png',
    './asset/Npc/npc_woman_01.png',
    './asset/Npc/npc_oldman_01.png',
    './asset/Npc/npc_porter_01.png',
    './asset/Npc/npc_traveler_01.png'
  ]);

  const BEG_GIVE_LINES = Object.freeze([
    '「……少しだけだぞ」',
    '「これで何か口にしな」',
    '「今日はこれだけだ」',
    '「困っているなら持っていけ」'
  ]);

  const BEG_NONE_LINES = Object.freeze([
    '「悪いが、余裕がない」',
    '「今日は勘弁してくれ」',
    '「……すまない」',
    '「神の加護を」'
  ]);

  const SELL_LINES = Object.freeze([
    '「何を売ってる？」',
    '「ちょっと見せてくれ」',
    '「それはいくらだ？」',
    '「使えそうな物はあるか？」'
  ]);

  function randomItem(list){
    return list[Math.floor(Math.random()*list.length)];
  }

  function randomInt(min,max){
    const low=Math.floor(Number(min)||0);
    const high=Math.max(low,Math.floor(Number(max)||0));
    return low + Math.floor(Math.random()*(high-low+1));
  }

  function inventory(){
    if(!stateRef.inventory || typeof stateRef.inventory!=='object') stateRef.inventory={};
    return stateRef.inventory;
  }

  function addInventoryItem(itemId,count=1){
    const inv=inventory();
    inv[itemId]=(Number(inv[itemId])||0)+Math.max(1,Math.floor(Number(count)||1));
  }

  function beggingHistoryForScene(){
    if(!stateRef.beggingHistory || typeof stateRef.beggingHistory!=='object'){
      stateRef.beggingHistory={};
    }
    const key=stateRef.sceneKey || 'outerPoor';
    const day=Math.max(1,Math.floor(Number(stateRef.day)||1));
    const existing=stateRef.beggingHistory[key];

    if(!existing || Number(existing.day)!==day){
      stateRef.beggingHistory[key]={day,attempts:0};
    }
    return stateRef.beggingHistory[key];
  }

  function beggingFatigueMultiplier(attempts){
    const n=Math.max(0,Math.floor(Number(attempts)||0));
    if(n<5) return 1;
    if(n<10) return 0.8;
    if(n<15) return 0.6;
    if(n<25) return 0.45;
    return 0.3;
  }

  function prayerCharityMultiplier(){
    if(!window.SHOP_TIME || !Array.isArray(window.SHOP_TIME.prayers) || !stateRef) return 1;
    const now=((Number(stateRef.minutes)||0)%1440+1440)%1440;
    const nearPrayer=window.SHOP_TIME.prayers.some(prayer=>
      now>=prayer.minute-20 && now<prayer.minute+30
    );
    return nearPrayer ? 1.35 : 1;
  }

  function timeOfDayBeggingMultiplier(){
    const now=((Number(stateRef && stateRef.minutes)||0)%1440+1440)%1440;
    if(now<300 || now>=1320) return 0.25;
    if(now<480) return 0.75;
    if(now<720) return 1;
    if(now<900) return 0.7;
    if(now<1080) return 1.05;
    if(now<1260) return 0.9;
    return 0.6;
  }

  function weatherBeggingMultiplier(){
    const weather=String(stateRef && stateRef.weather || '');
    if(weather.includes('砂')) return 0.65;
    if(weather.includes('雨')) return 0.7;
    return 1;
  }

  function effectiveBeggingStopChance(){
    const rule=currentBeggingRule();
    const history=beggingHistoryForScene();
    const chance=(Number(rule.stopChance)||0) *
      beggingFatigueMultiplier(history.attempts) *
      timeOfDayBeggingMultiplier() *
      prayerCharityMultiplier() *
      weatherBeggingMultiplier();
    return Math.max(0.03,Math.min(0.75,chance));
  }

  function refreshPersistentUi(){
    if(typeof window.SHOP_RENDER==='function') window.SHOP_RENDER();
  }

  function addMoney(copper){
    if(!window.SHOP_CURRENCY || !stateRef) return;
    window.SHOP_CURRENCY.add(stateRef,copper);
    refreshPersistentUi();
  }

  function hasSellableItems(){
    return !!(window.SHOP_ITEMS &&
      window.SHOP_ITEMS.getSellableInventoryCount &&
      window.SHOP_ITEMS.getSellableInventoryCount(stateRef) > 0);
  }

  function ownedSellRows(){
    const inv = stateRef && stateRef.inventory ? stateRef.inventory : {};
    const items = window.SHOP_ITEMS ? window.SHOP_ITEMS.all : {};
    return Object.entries(inv)
      .filter(([,count]) => Number(count) > 0)
      .map(([id,count]) => ({item:items[id], count:Number(count)}))
      .filter(row => row.item && window.SHOP_ITEMS.isSellable(row.item))
      .slice(0,8);
  }

  function ensureSelectedSellItem(){
    const owned=ownedSellRows();
    if(!owned.length){
      selectedSellItemId=null;
      return;
    }
    if(!owned.some(row=>row.item.id===selectedSellItemId)){
      selectedSellItemId=owned[0].item.id;
    }
  }

  function renderGrid(){
    grid.replaceChildren();
    const owned=ownedSellRows();
    ensureSelectedSellItem();

    for(let i=0;i<8;i++){
      const row=owned[i];
      const cell=document.createElement('button');
      cell.type='button';
      cell.className='sell-cell';

      if(row){
        cell.textContent=row.item.name + ' ×' + row.count;
        cell.dataset.itemId=row.item.id;
        if(row.item.id===selectedSellItemId) cell.classList.add('selected');
        cell.addEventListener('click',()=>{
          selectedSellItemId=row.item.id;
          renderGrid();
        });
      }else{
        cell.classList.add('empty');
        cell.textContent='空き';
        cell.disabled=true;
      }
      grid.appendChild(cell);
    }
  }

  function currentBeggingRule(){
    const key = stateRef && stateRef.sceneKey ? stateRef.sceneKey : 'outerPoor';
    const scene = window.SHOP_DATA && window.SHOP_DATA.scenes
      ? window.SHOP_DATA.scenes[key]
      : null;

    return scene && scene.begging
      ? scene.begging
      : {
          stopChance:0.48,
          outcomes:[
            {weight:55,minCopper:0,maxCopper:0},
            {weight:30,minCopper:1,maxCopper:3},
            {weight:12,minCopper:5,maxCopper:5},
            {weight:3,minCopper:10,maxCopper:10}
          ]
        };
  }

  function rollBeggingOutcome(){
    const rule=currentBeggingRule();
    const outcomes=Array.isArray(rule.outcomes) ? rule.outcomes : [];
    const total=outcomes.reduce((sum,row)=>sum+Math.max(0,Number(row.weight)||0),0);
    if(total<=0) return {type:'none'};

    let roll=Math.random()*total;
    for(const row of outcomes){
      roll-=Math.max(0,Number(row.weight)||0);
      if(roll<0) return row;
    }
    return {type:'none'};
  }

  function handleBeggingResult(){
    const outcome=rollBeggingOutcome();

    if(!outcome || outcome.type==='none'){
      return randomItem(BEG_NONE_LINES) + '　何も置かずに去った。';
    }

    if(outcome.type==='item' && outcome.itemId){
      const count=Math.max(1,Math.floor(Number(outcome.count)||1));
      addInventoryItem(outcome.itemId,count);
      refreshPersistentUi();
      const item=window.SHOP_ITEMS && window.SHOP_ITEMS.all
        ? window.SHOP_ITEMS.all[outcome.itemId]
        : null;
      const name=item ? item.name : outcome.itemId;
      return randomItem(BEG_GIVE_LINES) + '　' + name + 'を' + count + '個もらった。';
    }

    const donation=randomInt(outcome.minCopper,outcome.maxCopper);
    if(donation<=0){
      return randomItem(BEG_NONE_LINES) + '　何も置かずに去った。';
    }

    addMoney(donation);
    return randomItem(BEG_GIVE_LINES) + '　' +
      window.SHOP_CURRENCY.formatAmount(donation) + 'を恵んでもらった。';
  }

  function handleSellingResult(){
    ensureSelectedSellItem();
    if(!selectedSellItemId){
      return randomItem(SELL_LINES) + '　売れる物がない。';
    }

    const inv=stateRef && stateRef.inventory ? stateRef.inventory : {};
    const item=window.SHOP_ITEMS && window.SHOP_ITEMS.all
      ? window.SHOP_ITEMS.all[selectedSellItemId]
      : null;

    if(!item || Number(inv[selectedSellItemId]||0)<=0){
      ensureSelectedSellItem();
      return randomItem(SELL_LINES);
    }

    if(Math.random()>=0.55){
      return randomItem(SELL_LINES) + '　今回は買わずに去った。';
    }

    const price=randomInt(item.sellMinCopper,item.sellMaxCopper);
    inv[selectedSellItemId]=Math.max(0,Number(inv[selectedSellItemId]||0)-1);
    if(inv[selectedSellItemId]<=0) delete inv[selectedSellItemId];

    addMoney(price);
    const soldName=item.name;
    ensureSelectedSellItem();
    renderGrid();

    return '「' + soldName + 'をもらおう」　' +
      window.SHOP_CURRENCY.formatAmount(price) + 'で1個売れた。';
  }

  function passerbyDelayMultiplier(){
    const now=((Number(stateRef && stateRef.minutes)||0)%1440+1440)%1440;
    let multiplier=1;

    if(now<300 || now>=1320) multiplier*=2.6;
    else if(now<480) multiplier*=1.35;
    else if(now>=720 && now<900) multiplier*=1.35;
    else if(now>=1020 && now<1260) multiplier*=0.85;

    const weather=String(stateRef && stateRef.weather || '');
    if(weather.includes('砂')) multiplier*=1.6;
    else if(weather.includes('雨')) multiplier*=1.4;

    return multiplier;
  }

  function clearPasserby(){
    if(passerbyTimer){
      clearTimeout(passerbyTimer);
      passerbyTimer=null;
    }
    if(passerbySprite){
      passerbySprite.remove();
      passerbySprite=null;
    }
    if(passerbyPopup){
      passerbyPopup.classList.remove('is-open');
      passerbyPopup.textContent='';
    }
  }

  function scheduleNextPasserby(delay=700){
    if(passerbyTimer) clearTimeout(passerbyTimer);
    const adjusted=Math.max(250,Math.round(delay*passerbyDelayMultiplier()));
    passerbyTimer=setTimeout(runPasserby, adjusted);
  }

  function showPasserbyConversation(stopAt){
    if(!passerbyPopup) return;

    passerbyPopup.textContent =
      mode==='sell' ? handleSellingResult() : handleBeggingResult();

    passerbyPopup.style.left=stopAt+'%';
    passerbyPopup.classList.add('is-open');
  }

  function runPasserby(){
    if(!screen || !screen.classList.contains('is-open') || !passerbyLane) return;

    clearPasserby();

    const fromLeft=Math.random()>=0.5;
    const stopChance=mode==='beg'
      ? effectiveBeggingStopChance()
      : 0.48;
    const willStop=Math.random()<stopChance;

    if(mode==='beg'){
      const history=beggingHistoryForScene();
      history.attempts=Math.max(0,Math.floor(Number(history.attempts)||0))+1;
    }
    const stopAt=38 + Math.round(Math.random()*24);

    const image=document.createElement('img');
    image.className='passerby-sprite';
    image.src=randomItem(PASSERBY_IMAGES);
    image.alt='';
    image.draggable=false;
    image.style.left=fromLeft ? '-24%' : '124%';
    image.style.transform=fromLeft ? 'translateX(-50%)' : 'translateX(-50%) scaleX(-1)';
    passerbyLane.appendChild(image);
    passerbySprite=image;

    requestAnimationFrame(()=>{
      requestAnimationFrame(()=>{
        if(!passerbySprite) return;

        if(willStop){
          image.style.transition='left 2.8s linear';
          image.style.left=stopAt+'%';

          passerbyTimer=setTimeout(()=>{
            if(!passerbySprite) return;
            showPasserbyConversation(stopAt);

            passerbyTimer=setTimeout(()=>{
              if(passerbyPopup) passerbyPopup.classList.remove('is-open');
              if(!passerbySprite) return;

              image.style.transition='left 2.4s linear';
              image.style.left=fromLeft ? '124%' : '-24%';

              passerbyTimer=setTimeout(()=>{
                clearPasserby();
                scheduleNextPasserby(650 + Math.round(Math.random()*900));
              },2450);
            },2200);
          },2850);
        }else{
          image.style.transition='left 5.2s linear';
          image.style.left=fromLeft ? '124%' : '-24%';

          passerbyTimer=setTimeout(()=>{
            clearPasserby();
            scheduleNextPasserby(500 + Math.round(Math.random()*850));
          },5250);
        }
      });
    });
  }

  function setTimeSpeed(multiplier){
    const value=[1,2,4].includes(Number(multiplier)) ? Number(multiplier) : 1;
    if(window.SHOP_TIME && window.SHOP_TIME.setRealtimeMultiplier){
      window.SHOP_TIME.setRealtimeMultiplier(value);
    }
    speedButtons.forEach(button=>{
      const active=Number(button.dataset.actionSpeed)===value;
      button.classList.toggle('active',active);
      button.setAttribute('aria-pressed',active ? 'true' : 'false');
    });
  }

  function setMode(next){
    if(next==='sell' && !hasSellableItems()) return false;
    mode=next;
    dialog.classList.remove('is-open');
    dialog.textContent='';
    screen.dataset.mode=mode;

    if(mode==='beg'){
      title.textContent='物乞い中';
      pot.style.display='block';
      grid.style.display='none';
    }else{
      title.textContent='物売り中';
      pot.style.display='none';
      grid.style.display='grid';
      renderGrid();
    }
    return true;
  }

  function open(state,initialMode='beg'){
    stateRef=state || window.SHOP_STATE || {};
    const app=document.querySelector('.app');
    if(app) app.classList.add('action-open');
    screen.classList.add('is-open');

    if(!setMode(initialMode)) setMode('beg');
    setTimeSpeed(1);

    clearPasserby();
    scheduleNextPasserby(350);
  }

  function close(){
    clearPasserby();
    screen.classList.remove('is-open');
    delete screen.dataset.mode;
    const app=document.querySelector('.app');
    if(app) app.classList.remove('action-open');
    dialog.classList.remove('is-open');
    setTimeSpeed(1);
    refreshPersistentUi();
  }

  function showConversation(text){
    dialog.textContent=String(text || '');
    dialog.classList.add('is-open');
  }

  back.addEventListener('click',close);
  speedButtons.forEach(button=>{
    button.addEventListener('click',()=>{
      setTimeSpeed(button.dataset.actionSpeed);
    });
  });
  setTimeSpeed(1);

  window.SHOP_ACTION=Object.freeze({
    open,
    close,
    setMode,
    showConversation
  });
})();
