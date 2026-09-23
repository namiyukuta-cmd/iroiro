(() => {
  'use strict';

  const ITEMS = Object.freeze({
    rag: Object.freeze({id:'rag', name:'布切れ', sellPrice:1}),
    bottle: Object.freeze({id:'bottle', name:'空き瓶', sellPrice:2}),
    wood: Object.freeze({id:'wood', name:'木片', sellPrice:1}),
    scrap: Object.freeze({id:'scrap', name:'金属片', sellPrice:3})
  });

  function getInventoryCount(state){
    const inv = state && state.inventory ? state.inventory : {};
    return Object.values(inv).reduce((sum,n)=>sum + Math.max(0, Number(n)||0), 0);
  }

  window.SHOP_ITEMS = Object.freeze({
    all: ITEMS,
    getInventoryCount
  });
})();
