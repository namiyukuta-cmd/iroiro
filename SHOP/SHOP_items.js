(() => {
  'use strict';

  const ITEMS = Object.freeze({
    rag: Object.freeze({id:'rag', name:'布切れ', sellMinCopper:2, sellMaxCopper:4}),
    bottle: Object.freeze({
      id:'bottle',
      name:'空き瓶',
      sellMinCopper:3,
      sellMaxCopper:5,
      waterContainer:true,
      waterCapacity:1
    }),
    wood: Object.freeze({id:'wood', name:'木片', sellMinCopper:2, sellMaxCopper:5}),
    scrap: Object.freeze({id:'scrap', name:'金属片', sellMinCopper:8, sellMaxCopper:10}),

    small_pot: Object.freeze({
      id:'small_pot',
      name:'小壺',
      waterContainer:true,
      waterCapacity:3,
      hiddenWhenEmpty:true
    }),

    water_bottle: Object.freeze({
      id:'water_bottle',
      name:'水入り瓶 1/1',
      drinkableWater:true,
      thirstRecovery:35,
      nextItemId:'bottle',
      hiddenWhenEmpty:true
    }),
    water_small_pot_3: Object.freeze({
      id:'water_small_pot_3',
      name:'小壺の水 3/3',
      drinkableWater:true,
      thirstRecovery:35,
      nextItemId:'water_small_pot_2',
      hiddenWhenEmpty:true
    }),
    water_small_pot_2: Object.freeze({
      id:'water_small_pot_2',
      name:'小壺の水 2/3',
      drinkableWater:true,
      thirstRecovery:35,
      nextItemId:'water_small_pot_1',
      hiddenWhenEmpty:true
    }),
    water_small_pot_1: Object.freeze({
      id:'water_small_pot_1',
      name:'小壺の水 1/3',
      drinkableWater:true,
      thirstRecovery:35,
      nextItemId:'small_pot',
      hiddenWhenEmpty:true
    }),

    food_tharid: Object.freeze({
      id:'food_tharid',
      name:'サリード',
      icon:'./asset/food/food_tharid.png',
      hungerRecovery:45,
      portable:false,
      containerRequired:true,
      containerType:'bowl',
      shelfLifeMinutes:360,
      hiddenWhenEmpty:true
    }),
    food_harisa: Object.freeze({
      id:'food_harisa',
      name:'ハリーサ',
      icon:'./asset/food/food_harisa.png',
      hungerRecovery:50,
      portable:false,
      containerRequired:true,
      containerType:'bowl',
      shelfLifeMinutes:480,
      hiddenWhenEmpty:true
    }),
    food_sikbaj: Object.freeze({
      id:'food_sikbaj',
      name:'シクバージュ',
      icon:'./asset/food/food_sikbaj.png',
      hungerRecovery:55,
      portable:false,
      containerRequired:true,
      containerType:'bowl',
      shelfLifeMinutes:420,
      hiddenWhenEmpty:true
    }),
    food_muhallabiya: Object.freeze({
      id:'food_muhallabiya',
      name:'ムハッラビーヤ',
      icon:'./asset/food/food_muhallabiya.png',
      hungerRecovery:30,
      portable:false,
      containerRequired:true,
      containerType:'bowl',
      shelfLifeMinutes:300,
      hiddenWhenEmpty:true
    })
  });

  function getInventoryCount(state){
    const inv = state && state.inventory ? state.inventory : {};
    return Object.values(inv).reduce((sum,n)=>sum + Math.max(0, Number(n)||0), 0);
  }

  function isSellable(item){
    return !!item &&
      Number.isFinite(Number(item.sellMinCopper)) &&
      Number.isFinite(Number(item.sellMaxCopper));
  }

  function getSellableInventoryCount(state){
    const inv = state && state.inventory ? state.inventory : {};
    return Object.entries(inv).reduce((sum,[id,count])=>{
      const item=ITEMS[id];
      if(!isSellable(item)) return sum;
      return sum + Math.max(0,Number(count)||0);
    },0);
  }

  window.SHOP_ITEMS = Object.freeze({
    all: ITEMS,
    getInventoryCount,
    getSellableInventoryCount,
    isSellable
  });
})();