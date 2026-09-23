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

  const BEG_LINES = Object.freeze([
    '「……腹が減ってるのか？」',
    '「今日は暑いな」',
    '「これで何か食べな」',
    '「ここでずっと座ってるのか？」',
    '「……少しだけだぞ」'
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

  function refreshPersistentUi(){
    if(typeof window.SHOP_RENDER==='function') window.SHOP_RENDER();
  }

  function addMoney(copper){
    if(!window.SHOP_CURRENCY || !stateRef) return;
    window.SHOP_CURRENCY.add(stateRef,copper);
    refreshPersistentUi();
  }

  function hasSellableItems(){
    return window.SHOP_ITEMS &&
      window.SHOP_ITEMS.getInventoryCount(stateRef) > 0;
  }

  function ownedSellRows(){
    const inv = stateRef && stateRef.inventory ? stateRef.inventory : {};
    const items = window.SHOP_ITEMS ? window.SHOP_ITEMS.all : {};
    return Object.entries(inv)
      .filter(([,count]) => Number(count) > 0)
      .map(([id,count]) => ({item:items[id], count:Number(count)}))
      .filter(row => row.item)
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

  function rollBeggingDonation(){
    const roll=Math.random()*100;
    if(roll<55) return 0;
    if(roll<85) return randomInt(1,3);
    if(roll<97) return 5;
    return 10;
  }

  function handleBeggingResult(){
    const line=randomItem(BEG_LINES);
    const donation=rollBeggingDonation();

    if(donation<=0){
      return line + '　何も置かずに去った。';
    }

    addMoney(donation);
    return line + '　' + window.SHOP_CURRENCY.formatAmount(donation) + 'を恵んでもらった。';
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
    passerbyTimer=setTimeout(runPasserby, delay);
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
    const willStop=Math.random()<0.48;
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
    refreshPersistentUi();
  }

  function showConversation(text){
    dialog.textContent=String(text || '');
    dialog.classList.add('is-open');
  }

  back.addEventListener('click',close);

  window.SHOP_ACTION=Object.freeze({
    open,
    close,
    setMode,
    showConversation
  });
})();
