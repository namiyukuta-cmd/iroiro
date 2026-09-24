(() => {
  'use strict';

  const DIRECT_DRINK_MINUTES = 5;
  const FILL_MINUTES = 5;
  const PORTABLE_DRINK_MINUTES = 5;

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
    const need=Math.max(0,Number(count)||0);
    const have=Math.max(0,Number(inventory[id])||0);
    if(have<need) return false;
    inventory[id]=have-need;
    if(inventory[id]<=0) delete inventory[id];
    return true;
  }

  function advance(state,minutes,reason){
    if(window.SHOP_TIME) window.SHOP_TIME.advance(state,minutes,reason);
  }

  function drinkAtWell(state){
    if(!state) return {ok:false,message:'状態を読み込めません。'};
    advance(state,DIRECT_DRINK_MINUTES,'drink_at_well');
    state.thirst=0;
    return {ok:true,message:'井戸の水を飲んだ。渇きが癒えた。'};
  }

  function availableContainers(state){
    const inventory=inv(state);
    const result=[];
    if((Number(inventory.bottle)||0)>0){
      result.push({
        id:'bottle',
        label:'空き瓶に汲む',
        detail:'1回分',
        filledItemId:'water_bottle'
      });
    }
    if((Number(inventory.small_pot)||0)>0){
      result.push({
        id:'small_pot',
        label:'小壺に汲む',
        detail:'3回分',
        filledItemId:'water_small_pot_3'
      });
    }
    return result;
  }

  function fillContainer(state,containerId){
    const choices=availableContainers(state);
    const choice=choices.find(row=>row.id===containerId);
    if(!choice){
      return {ok:false,message:'水を汲める空の容器がない。'};
    }

    if(!removeItem(state,choice.id,1)){
      return {ok:false,message:'その容器は持っていない。'};
    }

    addItem(state,choice.filledItemId,1);
    advance(state,FILL_MINUTES,'fill_water');
    return {
      ok:true,
      message:choice.id==='bottle'
        ? '空き瓶に水を汲んだ。1回飲める。'
        : '小壺に水を汲んだ。3回飲める。'
    };
  }

  function drinkCarriedWater(state,itemId){
    const item=window.SHOP_ITEMS && window.SHOP_ITEMS.all
      ? window.SHOP_ITEMS.all[itemId]
      : null;
    if(!state || !item || !item.drinkableWater){
      return {ok:false,message:'これは飲めない。'};
    }

    if(!removeItem(state,itemId,1)){
      return {ok:false,message:'その水は持っていない。'};
    }

    const recovery=Math.max(0,Number(item.thirstRecovery)||0);
    advance(state,PORTABLE_DRINK_MINUTES,'drink_carried_water');
    state.thirst=Math.max(0,(Number(state.thirst)||0)-recovery);
    if(item.nextItemId) addItem(state,item.nextItemId,1);

    return {
      ok:true,
      message:item.name+'を飲んだ。渇きが'+recovery+'回復した。'
    };
  }

  function removePanel(){
    const old=document.getElementById('wellChoicePanel');
    if(old) old.remove();
  }

  function makeButton(label,onClick,disabled=false){
    const button=document.createElement('button');
    button.type='button';
    button.className='well-choice-btn';
    button.textContent=label;
    button.disabled=!!disabled;
    button.addEventListener('click',onClick);
    return button;
  }

  function open(state,onChange){
    removePanel();
    if(window.SHOP_STALL && window.SHOP_STALL.close) window.SHOP_STALL.close();
    if(window.SHOP_LIFE && window.SHOP_LIFE.close) window.SHOP_LIFE.close();
    if(window.SHOP_TRADE && window.SHOP_TRADE.close) window.SHOP_TRADE.close();

    const host=document.querySelector('.town-panel');
    if(!host) return;

    const panel=document.createElement('div');
    panel.id='wellChoicePanel';
    panel.className='well-choice-panel';

    const title=document.createElement('div');
    title.className='well-choice-title';
    title.textContent='井戸';

    const message=document.createElement('div');
    message.className='well-choice-message';
    message.textContent='どうする？';

    const actions=document.createElement('div');
    actions.className='well-choice-actions';

    const refresh=()=>{
      if(typeof onChange==='function') onChange();
    };

    const showMain=()=>{
      actions.replaceChildren();

      actions.appendChild(makeButton('水を飲む',()=>{
        const result=drinkAtWell(state);
        message.textContent=result.message;
        refresh();
      }));

      actions.appendChild(makeButton('水を汲む',()=>{
        const containers=availableContainers(state);
        actions.replaceChildren();

        if(!containers.length){
          message.textContent='空き瓶か小壺があれば水を汲める。';
          actions.appendChild(makeButton('戻る',showMain));
          return;
        }

        message.textContent='どの容器に汲む？';
        containers.forEach(container=>{
          actions.appendChild(makeButton(
            container.label+'（'+container.detail+'）',
            ()=>{
              const result=fillContainer(state,container.id);
              message.textContent=result.message;
              refresh();
              showMain();
            }
          ));
        });
        actions.appendChild(makeButton('戻る',showMain));
      }));

      actions.appendChild(makeButton('閉じる',removePanel));
    };

    panel.append(title,message,actions);
    host.appendChild(panel);
    showMain();
  }

  window.SHOP_WELL=Object.freeze({
    directDrinkMinutes:DIRECT_DRINK_MINUTES,
    fillMinutes:FILL_MINUTES,
    portableDrinkMinutes:PORTABLE_DRINK_MINUTES,
    availableContainers,
    drinkAtWell,
    fillContainer,
    drinkCarriedWater,
    open,
    close:removePanel
  });
})();