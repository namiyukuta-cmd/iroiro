(() => {
  'use strict';

  const $ = id => document.getElementById(id);
  const screen = $('actionScreen');
  const title = $('actionTitle');
  const back = $('actionBack');
  const begButton = $('begModeButton');
  const sellButton = $('sellModeButton');
  const pot = $('begPot');
  const grid = $('sellGrid');
  const dialog = $('actionDialog');
  const timeTrack = $('timeTrack');
  const passerbyLane = $('passerbyLane');
  const passerbyPopup = $('passerbyPopup');

  let stateRef = null;
  let mode = 'beg';
  let passerbyTimer = null;
  let passerbySprite = null;

  const IMPORTANT_TIMES = Object.freeze([
    Object.freeze({minutes:360, label:'朝'}),
    Object.freeze({minutes:720, label:'昼'}),
    Object.freeze({minutes:1080, label:'アザーン'}),
    Object.freeze({minutes:1260, label:'夜'})
  ]);

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

  function timeTop(minutes){
    const m = Math.max(0, Math.min(1439, Number(minutes) || 0));
    return (m / 1440) * 100;
  }

  function renderTimeRail(){
    if(!timeTrack) return;
    timeTrack.replaceChildren();

    for(let hour=0; hour<24; hour+=2){
      const minutes=hour*60;
      const tick=document.createElement('span');
      tick.className='time-tick' + (hour%6===0 ? ' major' : '');
      tick.style.top=timeTop(minutes)+'%';
      timeTrack.appendChild(tick);

      if(hour%6===0){
        const label=document.createElement('span');
        label.className='time-label';
        label.style.top=timeTop(minutes)+'%';
        label.textContent=String(hour).padStart(2,'0');
        timeTrack.appendChild(label);
      }
    }

    IMPORTANT_TIMES.forEach(mark=>{
      const bar=document.createElement('span');
      bar.className='time-special';
      bar.style.top=timeTop(mark.minutes)+'%';
      timeTrack.appendChild(bar);

      const label=document.createElement('span');
      label.className='time-special-label';
      label.style.top=timeTop(mark.minutes)+'%';
      label.textContent=mark.label;
      timeTrack.appendChild(label);
    });

    const now=document.createElement('span');
    now.className='time-now';
    now.style.top=timeTop(stateRef && stateRef.minutes)+'%';
    now.title='現在時刻';
    timeTrack.appendChild(now);
  }

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
      .slice(0,9);

    for(let i=0;i<9;i++){
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
    if(next==='sell' && !hasSellableItems()) return;
    mode=next;
    dialog.classList.remove('is-open');
    dialog.textContent='';

    if(mode==='beg'){
      title.textContent='物乞い';
      pot.style.display='block';
      grid.style.display='none';
    }else{
      title.textContent='物を売る';
      pot.style.display='none';
      grid.style.display='grid';
      renderGrid();
    }
  }

  function open(state){
    stateRef=state || window.SHOP_STATE || {};
    sellButton.disabled=!hasSellableItems();
    screen.classList.add('is-open');
    renderTimeRail();
    setMode('beg');
    clearPasserby();
    scheduleNextPasserby(350);
  }

  function close(){
    clearPasserby();
    screen.classList.remove('is-open');
    dialog.classList.remove('is-open');
    if (typeof window.SHOP_RENDER === 'function') window.SHOP_RENDER();
  }

  function showConversation(text){
    dialog.textContent=String(text || '');
    dialog.classList.add('is-open');
  }

  back.addEventListener('click',close);
  begButton.addEventListener('click',()=>setMode('beg'));
  sellButton.addEventListener('click',()=>setMode('sell'));

  window.SHOP_ACTION=Object.freeze({
    open,
    close,
    setMode,
    showConversation
  });
})();
