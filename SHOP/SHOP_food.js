(() => {
  'use strict';

  const EAT_MINUTES = 10;

  function inv(state){
    if(!state.inventory || typeof state.inventory!=='object') state.inventory={};
    return state.inventory;
  }

  function addItem(state,id,count=1){
    const inventory=inv(state);
    inventory[id]=(Number(inventory[id])||0)+Math.max(0,Number(count)||0);
  }

  function removeItem(state,id,count=1){
    const inventory=inv(state);
    const have=Math.max(0,Number(inventory[id])||0);
    const need=Math.max(0,Number(count)||0);
    if(have<need) return false;
    inventory[id]=have-need;
    if(inventory[id]<=0) delete inventory[id];
    return true;
  }

  function recoverHunger(state,item){
    const recovery=Math.max(0,Number(item && item.hungerRecovery)||0);
    state.hunger=Math.max(0,(Number(state.hunger)||0)-recovery);
    return recovery;
  }

  function eatDirect(state,itemId){
    const item=window.SHOP_ITEMS && window.SHOP_ITEMS.all
      ? window.SHOP_ITEMS.all[itemId]
      : null;
    if(!state || !item || !Number.isFinite(Number(item.hungerRecovery))){
      return {ok:false,message:'これは食べられない。'};
    }

    if(window.SHOP_TIME) window.SHOP_TIME.advance(state,EAT_MINUTES,'eat_food');
    const recovery=recoverHunger(state,item);
    return {ok:true,message:item.name+'を食べた。空腹が'+recovery+'回復した。'};
  }

  function eatInventory(state,itemId){
    const item=window.SHOP_ITEMS && window.SHOP_ITEMS.all
      ? window.SHOP_ITEMS.all[itemId]
      : null;
    if(!state || !item || !Number.isFinite(Number(item.hungerRecovery))){
      return {ok:false,message:'これは食べられない。'};
    }
    if(!removeItem(state,itemId,1)){
      return {ok:false,message:'その食べ物は持っていない。'};
    }

    if(window.SHOP_TIME) window.SHOP_TIME.advance(state,EAT_MINUTES,'eat_carried_food');
    const recovery=recoverHunger(state,item);
    if(item.returnContainerId) addItem(state,item.returnContainerId,1);

    return {ok:true,message:item.name+'を食べた。空腹が'+recovery+'回復した。'};
  }

  window.SHOP_FOOD=Object.freeze({
    eatMinutes:EAT_MINUTES,
    eatDirect,
    eatInventory
  });
})();