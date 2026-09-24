(() => {
  'use strict';

  const GOODS = Object.freeze([
    Object.freeze({id:'trade_cloth_bundle', name:'布束', buyPrice:4, minReputation:3}),
    Object.freeze({id:'trade_spice_packet', name:'香辛料小包', buyPrice:7, minReputation:5}),
    Object.freeze({id:'trade_oil_jar', name:'油壺', buyPrice:9, minReputation:7})
  ]);

  function ensureState(state){
    if(!state.trade || typeof state.trade!=='object'){
      state.trade={
        delivery:{status:'none', completed:false}
      };
    }
    if(!state.trade.delivery || typeof state.trade.delivery!=='object'){
      state.trade.delivery={status:'none',completed:false};
    }
    if(typeof state.trade.delivery.status!=='string'){
      state.trade.delivery.status='none';
    }
    if(typeof state.trade.delivery.completed!=='boolean'){
      state.trade.delivery.completed=false;
    }
    if(!state.inventory || typeof state.inventory!=='object') state.inventory={};
    if(!state.access || typeof state.access!=='object') state.access={upperArea:false};
    return state;
  }

  function money(state){
    return Math.max(0,Math.floor(Number(state && state.money)||0));
  }

  function reputation(state){
    return Math.max(0,Math.floor(Number(state && state.reputation)||0));
  }

  function pay(state,value){
    const cost=Math.max(0,Math.floor(Number(value)||0));
    if(money(state)<cost) return false;
    state.money=money(state)-cost;
    return true;
  }

  function fmt(value){
    return window.SHOP_CURRENCY
      ? window.SHOP_CURRENCY.formatAmount(value)
      : String(value);
  }

  function addItem(state,id,count=1){
    ensureState(state);
    state.inventory[id]=(Number(state.inventory[id])||0)+Math.max(1,Math.floor(Number(count)||1));
  }

  function removeItem(state,id,count=1){
    ensureState(state);
    const have=Math.max(0,Number(state.inventory[id])||0);
    const need=Math.max(0,Math.floor(Number(count)||1));
    if(have<need) return false;
    state.inventory[id]=have-need;
    if(state.inventory[id]<=0) delete state.inventory[id];
    return true;
  }

  function availableGoods(state){
    ensureState(state);
    return GOODS.map(row=>Object.assign({},row,{
      unlocked:reputation(state)>=row.minReputation
    }));
  }

  function buyGood(state,id){
    ensureState(state);
    if(state.sceneKey!=='cityCommon'){
      return {ok:false,message:'仕入れは市内・庶民街の行商人から行う。'};
    }

    const good=GOODS.find(row=>row.id===id);
    if(!good) return {ok:false,message:'その商品は仕入れられない。'};

    if(reputation(state)<good.minReputation){
      return {ok:false,message:good.name+'の仕入れには信用'+good.minReputation+'が必要。'};
    }

    if(!pay(state,good.buyPrice)){
      return {ok:false,message:good.name+'の仕入れ代 '+fmt(good.buyPrice)+' が足りない。'};
    }

    addItem(state,good.id,1);
    if(window.SHOP_TIME) window.SHOP_TIME.advance(state,5,'buy_trade_good');

    return {
      ok:true,
      message:good.name+'を'+fmt(good.buyPrice)+'で1個仕入れた。'
    };
  }

  function canAcceptDelivery(state){
    ensureState(state);
    if(state.trade.delivery.completed) return false;
    if(state.trade.delivery.status==='active') return false;
    return reputation(state)>=5 &&
      !!(state.market && Number(state.market.stage)>=1) &&
      state.sceneKey==='cityCommon';
  }

  function acceptDelivery(state){
    ensureState(state);

    if(state.trade.delivery.completed){
      return {ok:false,message:'この配達はすでに終えている。'};
    }
    if(state.trade.delivery.status==='active'){
      return {ok:false,message:'商人の荷包をすでに預かっている。'};
    }
    if(state.sceneKey!=='cityCommon'){
      return {ok:false,message:'配達の依頼は市内・庶民街で受ける。'};
    }
    if(reputation(state)<5){
      return {ok:false,message:'配達を任されるには信用5が必要。'};
    }
    if(!state.market || Number(state.market.stage)<1){
      return {ok:false,message:'まず仮の露店を使える程度の商い実績が必要。'};
    }

    state.trade.delivery.status='active';
    addItem(state,'delivery_parcel',1);
    state.access.upperArea=true;

    return {
      ok:true,
      message:'商人から上級区への荷物を預かった。上級区へ入る理由ができた。'
    };
  }

  function completeDelivery(state){
    ensureState(state);

    if(state.trade.delivery.completed){
      return {ok:false,message:'この配達はすでに終えている。'};
    }
    if(state.trade.delivery.status!=='active'){
      return {ok:false,message:'届ける荷物を預かっていない。'};
    }
    if(state.sceneKey!=='upperArea'){
      return {ok:false,message:'荷物の届け先は上級区。'};
    }
    if(!removeItem(state,'delivery_parcel',1)){
      return {ok:false,message:'預かった荷物が見つからない。'};
    }

    state.trade.delivery.status='done';
    state.trade.delivery.completed=true;
    state.access.upperArea=true;
    state.money=money(state)+12;
    state.reputation=reputation(state)+2;

    if(window.SHOP_TIME) window.SHOP_TIME.advance(state,20,'complete_delivery');

    return {
      ok:true,
      message:'荷物を届けた。'+fmt(12)+'を受け取り、信用+2。上級区へ今後も出入りできるようになった。'
    };
  }

  function deliveryLabel(state){
    ensureState(state);
    if(state.trade.delivery.completed) return '配達済み';
    if(state.trade.delivery.status==='active') return '配達中';
    if(canAcceptDelivery(state)) return '依頼を受けられる';
    return 'まだ任されない';
  }

  function removePanel(){
    const old=document.getElementById('tradeChoicePanel');
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

  function open(state,onChange){
    ensureState(state);
    removePanel();
    if(window.SHOP_LIFE && window.SHOP_LIFE.close) window.SHOP_LIFE.close();
    if(window.SHOP_STALL && window.SHOP_STALL.close) window.SHOP_STALL.close();
    if(window.SHOP_WELL && window.SHOP_WELL.close) window.SHOP_WELL.close();

    const host=document.querySelector('.town-panel');
    if(!host) return;

    const panel=document.createElement('div');
    panel.id='tradeChoicePanel';
    panel.className='stall-choice-panel';

    const title=document.createElement('div');
    title.className='stall-choice-title';
    title.textContent='仕入れ・配達';

    const message=document.createElement('div');
    message.className='stall-choice-message';

    const actions=document.createElement('div');
    actions.className='stall-choice-actions';

    const refresh=()=>{
      ensureState(state);
      if(typeof onChange==='function') onChange();
    };

    const showMain=()=>{
      message.textContent='仕入れと商人からの依頼';
      actions.replaceChildren(
        makeButton('行商人から仕入れる',showGoods),
        makeButton(
          '上級区への配達　'+deliveryLabel(state),
          ()=>{
            if(state.trade.delivery.status==='active' && state.sceneKey==='upperArea'){
              const result=completeDelivery(state);
              message.textContent=result.message;
              refresh();
              showMain();
              message.textContent=result.message;
              return;
            }
            const result=acceptDelivery(state);
            message.textContent=result.message;
            refresh();
            showMain();
            message.textContent=result.message;
          },
          !canAcceptDelivery(state) &&
            !(state.trade.delivery.status==='active' && state.sceneKey==='upperArea')
        ),
        makeButton('閉じる',removePanel)
      );
    };

    const showGoods=()=>{
      if(state.sceneKey!=='cityCommon'){
        message.textContent='仕入れは市内・庶民街の行商人から行う。';
        actions.replaceChildren(makeButton('戻る',showMain));
        return;
      }

      message.textContent='信用が上がるほど扱ってくれる品が増える。';
      const buttons=availableGoods(state).map(good=>
        makeButton(
          good.name+'　仕入れ '+fmt(good.buyPrice)+
            ' / 信用'+good.minReputation,
          ()=>{
            const result=buyGood(state,good.id);
            message.textContent=result.message;
            refresh();
            showGoods();
            message.textContent=result.message;
          },
          !good.unlocked || money(state)<good.buyPrice
        )
      );
      buttons.push(makeButton('戻る',showMain));
      actions.replaceChildren(...buttons);
    };

    panel.append(title,message,actions);
    host.appendChild(panel);
    showMain();
  }

  window.SHOP_TRADE=Object.freeze({
    goods:GOODS,
    ensureState,
    availableGoods,
    buyGood,
    canAcceptDelivery,
    acceptDelivery,
    completeDelivery,
    deliveryLabel,
    open,
    close:removePanel
  });
})();