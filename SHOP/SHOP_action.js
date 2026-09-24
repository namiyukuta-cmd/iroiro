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
  const globalStatus = $('saveStatus');
  const speedButtons = Array.from(document.querySelectorAll('[data-action-speed]'));

  let stateRef = null;
  let mode = 'beg';
  let passerbyTimer = null;
  let passerbySprite = null;
  let selectedSellItemId = null;
  let activitySessionStartMinute = null;

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

  function activityHistoryForScene(targetMode=mode){
    const storeKey=targetMode==='sell' ? 'sellingHistory' : 'beggingHistory';
    if(!stateRef[storeKey] || typeof stateRef[storeKey]!=='object'){
      stateRef[storeKey]={};
    }

    const key=stateRef.sceneKey || 'outerPoor';
    const day=Math.max(1,Math.floor(Number(stateRef.day)||1));
    const existing=stateRef[storeKey][key];

    if(!existing || Number(existing.day)!==day){
      stateRef[storeKey][key]={day,attempts:0,strikes:0,blockedUntil:0};
    }else{
      if(!Number.isFinite(Number(existing.attempts))) existing.attempts=0;
      if(!Number.isFinite(Number(existing.strikes))) existing.strikes=0;
      if(!Number.isFinite(Number(existing.blockedUntil))) existing.blockedUntil=0;
    }
    return stateRef[storeKey][key];
  }

  function beggingHistoryForScene(){
    return activityHistoryForScene('beg');
  }

  function beggingFatigueMultiplier(attempts){
    const n=Math.max(0,Math.floor(Number(attempts)||0));
    if(n<5) return 1;
    if(n<10) return 0.8;
    if(n<15) return 0.6;
    if(n<25) return 0.45;
    return 0.3;
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
    const charity=window.SHOP_SOCIETY && window.SHOP_SOCIETY.charityMultiplier
      ? window.SHOP_SOCIETY.charityMultiplier(stateRef)
      : 1;
    const chance=(Number(rule.stopChance)||0) *
      beggingFatigueMultiplier(history.attempts) *
      timeOfDayBeggingMultiplier() *
      charity *
      weatherBeggingMultiplier();
    return Math.max(0.03,Math.min(0.75,chance));
  }

  function weatherSellingMultiplier(){
    const weather=String(stateRef && stateRef.weather || '');
    if(weather.includes('砂')) return 0.72;
    if(weather.includes('雨')) return 0.78;
    return 1;
  }

  function effectiveSellingStopChance(){
    const rule=currentSellingRule();
    const interest=window.SHOP_SOCIETY && window.SHOP_SOCIETY.sellingInterestMultiplier
      ? window.SHOP_SOCIETY.sellingInterestMultiplier(stateRef)
      : 1;
    const marketMultiplier=window.SHOP_LIFE && window.SHOP_LIFE.sellingStopMultiplier
      ? window.SHOP_LIFE.sellingStopMultiplier(stateRef)
      : 1;
    const chance=(Number(rule.stopChance)||0.32) *
      interest *
      weatherSellingMultiplier() *
      marketMultiplier;
    return Math.max(0.03,Math.min(0.85,chance));
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

  function currentSellingRule(){
    const key = stateRef && stateRef.sceneKey ? stateRef.sceneKey : 'outerPoor';
    const scene = window.SHOP_DATA && window.SHOP_DATA.scenes
      ? window.SHOP_DATA.scenes[key]
      : null;

    return scene && scene.selling
      ? scene.selling
      : {stopChance:0.32,enforcement:null};
  }

  function currentActivityRule(targetMode=mode){
    return targetMode==='sell' ? currentSellingRule() : currentBeggingRule();
  }

  function absoluteGameMinute(){
    const day=Math.max(1,Math.floor(Number(stateRef && stateRef.day)||1));
    const minutes=Math.max(0,Math.floor(Number(stateRef && stateRef.minutes)||0));
    return (day-1)*1440+minutes;
  }

  function currentActivityEnforcement(targetMode=mode){
    const rule=currentActivityRule(targetMode);
    return rule && rule.enforcement ? rule.enforcement : null;
  }

  function activityBlockRemaining(targetMode=mode){
    const history=activityHistoryForScene(targetMode);
    return Math.max(0,Math.floor(Number(history.blockedUntil)||0)-absoluteGameMinute());
  }

  function activitySessionMinutes(){
    if(!Number.isFinite(Number(activitySessionStartMinute))) return 0;
    return Math.max(0,absoluteGameMinute()-Number(activitySessionStartMinute));
  }

  function isActivityEnforcementActive(rule,history){
    if(!rule) return false;
    const attempts=Math.max(0,Math.floor(Number(history.attempts)||0));
    const minAttempts=Math.max(0,Math.floor(Number(rule.startAfter)||0));
    const minMinutes=Math.max(0,Math.floor(Number(rule.startAfterMinutes)||0));
    return attempts>=minAttempts || activitySessionMinutes()>=minMinutes;
  }

  function enforcementModifiers(targetMode=mode){
    if(window.SHOP_SOCIETY && window.SHOP_SOCIETY.enforcementModifiers){
      return window.SHOP_SOCIETY.enforcementModifiers(stateRef,targetMode);
    }
    return {need:'normal',checkChanceMultiplier:1,extraWarnings:0};
  }

  function enforcementWarningText(rule,strikes,targetMode,modifiers){
    const authority=String(rule.authority || '見回り');
    const need=modifiers && modifiers.need ? modifiers.need : 'normal';
    const distressed=need==='severe' || need==='critical';

    if(targetMode==='sell'){
      if(distressed && strikes<=1){
        return authority+'「事情は分かるが、ここで商いを続けるな。場所を空けろ」';
      }
      if(strikes<=1){
        return authority+'「ここで勝手に商いを広げるな。場所を空けろ」';
      }
      return authority+'「まだ売っているのか。次はここから出すぞ」';
    }

    if(distressed && strikes<=1){
      return authority+'「ひどい有様だな……。だが、ここには居座るな」';
    }
    if(strikes<=1){
      return authority+'「ここに居座るな。少し場所を空けろ」';
    }
    return authority+'「まだいるのか。次はここから出すぞ」';
  }

  function finishForcedRemoval(rule,targetMode){
    clearPasserby();
    screen.classList.remove('is-open');
    delete screen.dataset.mode;
    const app=document.querySelector('.app');
    if(app) app.classList.remove('action-open');
    dialog.classList.remove('is-open');
    setTimeSpeed(1);

    if(window.SHOP_TIME && stateRef){
      window.SHOP_TIME.advance(
        stateRef,
        10,
        targetMode==='sell' ? 'selling_removed' : 'begging_removed'
      );
    }

    const activityName=targetMode==='sell' ? '物売り' : '物乞い';
    let message='追い立てられた。しばらくここでは'+activityName+'できない。';
    const forcedScene=rule && rule.forcedScene;
    if(forcedScene && window.SHOP_DATA && window.SHOP_DATA.scenes && window.SHOP_DATA.scenes[forcedScene]){
      stateRef.sceneKey=forcedScene;
      const name=window.SHOP_DATA.scenes[forcedScene].name || forcedScene;
      message='追い立てられて「'+name+'」へ移された。';
    }

    activitySessionStartMinute=null;
    refreshPersistentUi();
    if(globalStatus) globalStatus.textContent=message;
  }

  function maybeHandleActivityEnforcement(){
    if(
      mode==='sell' &&
      window.SHOP_LIFE &&
      window.SHOP_LIFE.protectedSelling &&
      window.SHOP_LIFE.protectedSelling(stateRef)
    ){
      return false;
    }

    const rule=currentActivityEnforcement(mode);
    if(!rule) return false;

    const history=activityHistoryForScene(mode);
    if(!isActivityEnforcementActive(rule,history)) return false;

    const modifiers=enforcementModifiers(mode);
    const chance=Math.max(
      0,
      Math.min(
        1,
        (Number(rule.checkChance)||0) *
          Math.max(0,Number(modifiers.checkChanceMultiplier)||1)
      )
    );
    if(Math.random()>=chance) return false;

    history.strikes=Math.max(0,Math.floor(Number(history.strikes)||0))+1;
    const warningsBeforeRemoval=
      Math.max(0,Math.floor(Number(rule.warningsBeforeRemoval)||0)) +
      Math.max(0,Math.floor(Number(modifiers.extraWarnings)||0));

    dialog.textContent=enforcementWarningText(rule,history.strikes,mode,modifiers);
    dialog.classList.add('is-open');

    if(history.strikes<=warningsBeforeRemoval){
      passerbyTimer=setTimeout(()=>{
        dialog.classList.remove('is-open');
        scheduleNextPasserby(800+Math.round(Math.random()*900));
      },2600);
      return true;
    }

    const cooldown=Math.max(15,Math.floor(Number(rule.cooldownMinutes)||60));
    history.blockedUntil=absoluteGameMinute()+cooldown;
    dialog.textContent=String(rule.authority || '見回り')+
      (mode==='sell'
        ? '「その品を片付けろ。ここから離れろ」'
        : '「何度言わせる。ここから離れろ」');

    passerbyTimer=setTimeout(()=>{
      finishForcedRemoval(rule,mode);
    },2200);
    return true;
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

    if(maybeHandleActivityEnforcement()) return;

    const fromLeft=Math.random()>=0.5;
    const stopChance=mode==='beg'
      ? effectiveBeggingStopChance()
      : effectiveSellingStopChance();
    const willStop=Math.random()<stopChance;

    const history=activityHistoryForScene(mode);
    history.attempts=Math.max(0,Math.floor(Number(history.attempts)||0))+1;
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
      title.textContent=
        window.SHOP_LIFE &&
        window.SHOP_LIFE.protectedSelling &&
        window.SHOP_LIFE.protectedSelling(stateRef)
          ? '露店営業中'
          : '物売り中';
      pot.style.display='none';
      grid.style.display='grid';
      renderGrid();
    }
    return true;
  }

  function open(state,initialMode='beg'){
    stateRef=state || window.SHOP_STATE || {};
    const requestedMode=initialMode==='sell' ? 'sell' : 'beg';

    if(requestedMode==='sell' && !hasSellableItems()){
      if(globalStatus) globalStatus.textContent='売れる物がない。';
      return false;
    }

    const remaining=activityBlockRemaining(requestedMode);
    if(remaining>0){
      const activityName=requestedMode==='sell' ? '物売り' : '物乞い';
      if(globalStatus){
        globalStatus.textContent='さっき追い立てられた。あと約'+remaining+
          '分はここで'+activityName+'できない。';
      }
      return false;
    }

    mode=requestedMode;
    activitySessionStartMinute=absoluteGameMinute();

    const app=document.querySelector('.app');
    if(app) app.classList.add('action-open');
    screen.classList.add('is-open');

    if(!setMode(requestedMode)){
      screen.classList.remove('is-open');
      if(app) app.classList.remove('action-open');
      activitySessionStartMinute=null;
      return false;
    }
    setTimeSpeed(1);

    if(globalStatus) globalStatus.textContent='';
    clearPasserby();
    scheduleNextPasserby(350);
    return true;
  }

  function close(){
    clearPasserby();
    screen.classList.remove('is-open');
    delete screen.dataset.mode;
    const app=document.querySelector('.app');
    if(app) app.classList.remove('action-open');
    dialog.classList.remove('is-open');
    activitySessionStartMinute=null;
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
