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

  function hasSellableItems(){
    return window.SHOP_ITEMS &&
      window.SHOP_ITEMS.getInventoryCount(stateRef) > 0;
  }

  function renderGrid(){
    grid.replaceChildren();
    const inv = stateRef && stateRef.inventory ? stateRef.inventory : {};
    const items = window.SHOP_ITEMS ? window.SHOP_ITEMS.all : {};

    const owned = Object.entries(inv)
      .filter(([,count]) => Number(count) > 0)
      .map(([id,count]) => ({item:items[id], count:Number(count)}))
      .filter(row => row.item)
      .slice(0,8);

    for(let i=0;i<8;i++){
      const cell=document.createElement('div');
      cell.className='sell-cell';
      const row=owned[i];
      if(row){
        cell.textContent=row.item.name + ' ×' + row.count;
        cell.dataset.itemId=row.item.id;
      }else{
        cell.classList.add('empty');
        cell.textContent='';
      }
      grid.appendChild(cell);
    }
  }

  function randomItem(list){
    return list[Math.floor(Math.random()*list.length)];
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
    const lines = mode==='sell' ? SELL_LINES : BEG_LINES;
    passerbyPopup.textContent=randomItem(lines);
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

  function open(state, initialMode='beg'){
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
    if (typeof window.SHOP_RENDER === 'function') window.SHOP_RENDER();
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
