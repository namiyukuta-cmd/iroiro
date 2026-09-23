(() => {
  'use strict';

  const COOKED = Object.freeze([
    'food_tharid','food_harisa','food_sikbaj','food_muhallabiya'
  ]);
  const PORTABLE = Object.freeze([
    'food_flatbread','food_dried_meat'
  ]);
  const TOOLS = Object.freeze([
    'bottle','small_pot','bowl'
  ]);

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

  function canPay(state,price){
    return Math.max(0,Number(state && state.money)||0) >= Math.max(0,Number(price)||0);
  }

  function pay(state,price){
    const value=Math.max(0,Math.floor(Number(price)||0));
    if(!canPay(state,value)) return false;
    state.money=Math.max(0,Math.floor(Number(state.money)||0)-value);
    return true;
  }

  function fmt(price){
    return window.SHOP_CURRENCY
      ? window.SHOP_CURRENCY.formatAmount(price)
      : String(price);
  }

  function removePanel(){
    const old=document.getElementById('stallChoicePanel');
    if(old) old.remove();
  }

  function makeButton(label,onClick,disabled=false){
    const button=document.createElement('button');
    button.type='button';
    button.className='stall-choice-btn';
    button.textContent=label;
    button.disabled=!!disabled;
    button.addEventListener('click',onClick);
    return button;
  }

  function itemDef(id){
    return window.SHOP_ITEMS && window.SHOP_ITEMS.all
      ? window.SHOP_ITEMS.all[id]
      : null;
  }

  function open(state,onChange){
    removePanel();
    if(window.SHOP_WELL && window.SHOP_WELL.close) window.SHOP_WELL.close();

    const host=document.querySelector('.town-panel');
    if(!host) return;

    const panel=document.createElement('div');
    panel.id='stallChoicePanel';
    panel.className='stall-choice-panel';

    const title=document.createElement('div');
    title.className='stall-choice-title';
    title.textContent='屋台';

    const message=document.createElement('div');
    message.className='stall-choice-message';
    message.textContent='何を見る？';

    const actions=document.createElement('div');
    actions.className='stall-choice-actions';

    const refresh=()=>{
      if(typeof onChange==='function') onChange();
    };

    const showMain=()=>{
      message.textContent='何を見る？';
      actions.replaceChildren(
        makeButton('その場で食べる',showCooked),
        makeButton('持ち歩ける食べ物',showPortable),
        makeButton('道具',showTools),
        makeButton('閉じる',removePanel)
      );
    };

    const showCooked=()=>{
      message.textContent='その場で食べる料理';
      actions.replaceChildren();

      COOKED.forEach(id=>{
        const item=itemDef(id);
        if(!item) return;
        const price=Math.max(0,Number(item.buyPriceCopper)||0);

        actions.appendChild(makeButton(
          item.name+'　'+fmt(price),
          ()=>{
            if(!canPay(state,price)){
              message.textContent='お金が足りない。';
              return;
            }
            pay(state,price);
            const result=window.SHOP_FOOD
              ? window.SHOP_FOOD.eatDirect(state,id)
              : {ok:false,message:'食事処理を読み込めない。'};
            message.textContent=result.message;
            refresh();
          }
        ));

        const inventory=inv(state);
        if((Number(inventory.bowl)||0)>0){
          actions.appendChild(makeButton(
            '↳ 椀で持ち帰る　'+fmt(price),
            ()=>{
              if(!canPay(state,price)){
                message.textContent='お金が足りない。';
                return;
              }
              if(!removeItem(state,'bowl',1)){
                message.textContent='空の椀がない。';
                return;
              }
              pay(state,price);
              addItem(state,id,1);
              if(window.SHOP_TIME) window.SHOP_TIME.advance(state,5,'takeout_food');
              refresh();
              showCooked();
              message.textContent=item.name+'を椀に入れて持ち帰った。';
            }
          ));
        }
      });

      actions.appendChild(makeButton('戻る',showMain));
    };

    const showPortable=()=>{
      message.textContent='保存のきく食べ物';
      actions.replaceChildren();

      PORTABLE.forEach(id=>{
        const item=itemDef(id);
        if(!item) return;
        const price=Math.max(0,Number(item.buyPriceCopper)||0);
        actions.appendChild(makeButton(
          item.name+'　'+fmt(price),
          ()=>{
            if(!pay(state,price)){
              message.textContent='お金が足りない。';
              return;
            }
            addItem(state,id,1);
            if(window.SHOP_TIME) window.SHOP_TIME.advance(state,5,'buy_food');
            message.textContent=item.name+'を買った。';
            refresh();
          }
        ));
      });

      actions.appendChild(makeButton('戻る',showMain));
    };

    const showTools=()=>{
      message.textContent='道具';
      actions.replaceChildren();

      TOOLS.forEach(id=>{
        const item=itemDef(id);
        if(!item) return;
        const price=Math.max(0,Number(item.buyPriceCopper)||0);
        actions.appendChild(makeButton(
          item.name+'　'+fmt(price),
          ()=>{
            if(!pay(state,price)){
              message.textContent='お金が足りない。';
              return;
            }
            addItem(state,id,1);
            if(window.SHOP_TIME) window.SHOP_TIME.advance(state,5,'buy_tool');
            message.textContent=item.name+'を買った。';
            refresh();
          }
        ));
      });

      actions.appendChild(makeButton('戻る',showMain));
    };

    panel.append(title,message,actions);
    host.appendChild(panel);
    showMain();
  }

  window.SHOP_STALL=Object.freeze({
    open,
    close:removePanel
  });
})();