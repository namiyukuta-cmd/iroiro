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

  let stateRef = null;
  let mode = 'beg';

  const IMPORTANT_TIMES = Object.freeze([
    Object.freeze({minutes:360, label:'朝'}),
    Object.freeze({minutes:720, label:'昼'}),
    Object.freeze({minutes:1080, label:'アザーン'}),
    Object.freeze({minutes:1260, label:'夜'})
  ]);

  function timeTop(minutes){
    const m = Math.max(0, Math.min(1439, Number(minutes) || 0));
    return (m / 1440) * 100;
  }

  function renderTimeRail(){
    if(!timeTrack) return;
    timeTrack.replaceChildren();

    // 2時間ごとのメモリ。6時間ごとは長い目盛り。
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
      .slice(0,6);

    for(let i=0;i<6;i++){
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
  }

  function close(){
    screen.classList.remove('is-open');
    dialog.classList.remove('is-open');
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
