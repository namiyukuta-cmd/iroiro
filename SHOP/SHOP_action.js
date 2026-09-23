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

  let stateRef = null;
  let mode = 'beg';

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
