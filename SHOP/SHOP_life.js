(() => {
  'use strict';

  const JOBS = Object.freeze({
    porter: Object.freeze({
      id:'porter',
      name:'荷運び',
      minutes:180,
      payCopper:10,
      reputation:1,
      minReputation:0
    }),
    water_carrier: Object.freeze({
      id:'water_carrier',
      name:'水運び',
      minutes:120,
      payCopper:7,
      reputation:1,
      minReputation:0
    }),
    sweeping: Object.freeze({
      id:'sweeping',
      name:'掃除',
      minutes:150,
      payCopper:8,
      reputation:1,
      minReputation:0
    }),
    stall_helper: Object.freeze({
      id:'stall_helper',
      name:'屋台の手伝い',
      minutes:240,
      payCopper:14,
      reputation:2,
      minReputation:2
    })
  });

  const JOB_ROTATION = Object.freeze([
    Object.freeze(['porter','water_carrier','sweeping']),
    Object.freeze(['water_carrier','sweeping','stall_helper']),
    Object.freeze(['porter','sweeping','stall_helper']),
    Object.freeze(['porter','water_carrier','stall_helper'])
  ]);

  const MARKET_STAGES = Object.freeze({
    0:Object.freeze({
      id:'street',
      name:'路上販売',
      dailyFee:0
    }),
    1:Object.freeze({
      id:'temporary',
      name:'仮の露店',
      unlockReputation:4,
      unlockCost:8,
      dailyFee:2
    }),
    2:Object.freeze({
      id:'licensed',
      name:'市場の正式な露店',
      unlockReputation:10,
      unlockCost:25,
      dailyFee:3
    })
  });

  const MARKET_OPEN_MINUTE = 420;
  const MARKET_CLOSE_MINUTE = 1140;

  function ensureState(state){
    if(!state) return state;

    state.reputation=Math.max(0,Math.floor(Number(state.reputation)||0));

    if(!state.housing || typeof state.housing!=='object'){
      state.housing={roomPaidUntilDay:0};
    }
    if(!Number.isFinite(Number(state.housing.roomPaidUntilDay))){
      state.housing.roomPaidUntilDay=0;
    }

    if(!state.work || typeof state.work!=='object'){
      state.work={day:Math.max(1,Math.floor(Number(state.day)||1)),completed:[]};
    }
    const day=Math.max(1,Math.floor(Number(state.day)||1));
    if(Number(state.work.day)!==day){
      state.work={day,completed:[]};
    }
    if(!Array.isArray(state.work.completed)) state.work.completed=[];

    if(!state.market || typeof state.market!=='object'){
      state.market={stage:0,feePaidDay:0};
    }
    state.market.stage=Math.max(0,Math.min(2,Math.floor(Number(state.market.stage)||0)));
    state.market.feePaidDay=Math.max(0,Math.floor(Number(state.market.feePaidDay)||0));

    if(!state.inventory || typeof state.inventory!=='object') state.inventory={};

    return state;
  }

  function money(state){
    return Math.max(0,Math.floor(Number(state && state.money)||0));
  }

  function addMoney(state,value){
    state.money=money(state)+Math.max(0,Math.floor(Number(value)||0));
  }

  function pay(state,value){
    const cost=Math.max(0,Math.floor(Number(value)||0));
    if(money(state)<cost) return false;
    state.money=money(state)-cost;
    return true;
  }

  function formatMoney(value){
    return window.SHOP_CURRENCY
      ? window.SHOP_CURRENCY.formatAmount(value)
      : String(Math.max(0,Math.floor(Number(value)||0)));
  }

  function reputation(state){
    ensureState(state);
    return Math.max(0,Math.floor(Number(state.reputation)||0));
  }

  function addReputation(state,value){
    ensureState(state);
    state.reputation=Math.max(
      0,
      Math.floor(Number(state.reputation)||0)+Math.floor(Number(value)||0)
    );
    return state.reputation;
  }

  function activeRoom(state){
    ensureState(state);
    return (Number(state.housing.roomPaidUntilDay)||0) >= Math.max(1,Number(state.day)||1);
  }

  function housingLabel(state){
    return activeRoom(state) ? '借りた部屋' : '野宿';
  }

  function sleep(state,kind){
    ensureState(state);

    let cost=0;
    let hpRecovery=0;
    let risk=false;
    let label='';

    if(kind==='room'){
      if(!activeRoom(state)){
        return {ok:false,message:'借りている部屋がない。'};
      }
      label='自室';
      hpRecovery=35;
    }else if(kind==='inn'){
      cost=4;
      if(!pay(state,cost)){
        return {ok:false,message:'安宿代が足りない。'};
      }
      label='安宿';
      hpRecovery=25;
    }else{
      label='野宿';
      hpRecovery=10;
      risk=true;
    }

    if(window.SHOP_TIME) window.SHOP_TIME.advance(state,360,'sleep');

    state.hp=Math.max(0,Math.min(100,(Number(state.hp)||0)+hpRecovery));

    let lost='';
    if(risk && Math.random()<0.12){
      const candidates=Object.keys(state.inventory)
        .filter(id=>Number(state.inventory[id])>0);
      if(candidates.length){
        const id=candidates[Math.floor(Math.random()*candidates.length)];
        const def=window.SHOP_ITEMS && window.SHOP_ITEMS.all
          ? window.SHOP_ITEMS.all[id]
          : null;
        state.inventory[id]=Math.max(0,Number(state.inventory[id]||0)-1);
        if(state.inventory[id]<=0) delete state.inventory[id];
        lost=def ? def.name : id;
      }
    }

    let message=label+'で6時間休んだ。';
    if(cost>0) message+=' '+formatMoney(cost)+'を払った。';
    if(lost) message+=' 起きると'+lost+'が1個なくなっていた。';

    return {ok:true,message};
  }

  function rentRoom(state){
    ensureState(state);

    if(reputation(state)<8){
      return {ok:false,message:'長期の部屋を借りるには信用8が必要。'};
    }
    if(!pay(state,28)){
      return {ok:false,message:'部屋代 '+formatMoney(28)+' が足りない。'};
    }

    const today=Math.max(1,Math.floor(Number(state.day)||1));
    state.housing.roomPaidUntilDay=today+6;

    return {
      ok:true,
      message:'部屋を7日間借りた。'+formatMoney(28)+'を払った。'
    };
  }

  function dailyJobs(state){
    ensureState(state);
    const day=Math.max(1,Math.floor(Number(state.day)||1));
    const ids=JOB_ROTATION[(day-1)%JOB_ROTATION.length];
    return ids.map(id=>JOBS[id]).filter(Boolean);
  }

  function jobDoneToday(state,jobId){
    ensureState(state);
    return state.work.completed.includes(jobId);
  }

  function canWork(state){
    ensureState(state);
    if((Number(state.hp)||0)<=25) return '体力が低すぎて働けない。';
    if((Number(state.hunger)||0)>=90) return '空腹がひどくて働けない。';
    if((Number(state.thirst)||0)>=90) return '喉が渇きすぎて働けない。';
    return '';
  }

  function doJob(state,jobId){
    ensureState(state);

    const job=JOBS[jobId];
    if(!job) return {ok:false,message:'その仕事はない。'};

    const available=dailyJobs(state).some(row=>row.id===jobId);
    if(!available) return {ok:false,message:'今日はその仕事の募集がない。'};

    if(jobDoneToday(state,jobId)){
      return {ok:false,message:'その仕事は今日はもう終えた。'};
    }

    if(reputation(state)<job.minReputation){
      return {
        ok:false,
        message:job.name+'には信用'+job.minReputation+'が必要。'
      };
    }

    const blocked=canWork(state);
    if(blocked) return {ok:false,message:blocked};

    if(window.SHOP_TIME) window.SHOP_TIME.advance(state,job.minutes,'day_job');

    addMoney(state,job.payCopper);
    addReputation(state,job.reputation);
    state.work.completed.push(jobId);

    return {
      ok:true,
      message:job.name+'を終えた。'+
        formatMoney(job.payCopper)+'を受け取り、信用+'+job.reputation+'。'
    };
  }

  function marketStage(state){
    ensureState(state);
    return MARKET_STAGES[state.market.stage] || MARKET_STAGES[0];
  }

  function upgradeMarket(state){
    ensureState(state);

    if(state.sceneKey!=='cityCommon'){
      return {ok:false,message:'露店の手続きは市内・庶民街で行う。'};
    }

    if(state.market.stage>=2){
      return {ok:false,message:'すでに市場の正式な露店を使える。'};
    }

    const next=MARKET_STAGES[state.market.stage+1];
    if(reputation(state)<next.unlockReputation){
      return {
        ok:false,
        message:next.name+'には信用'+next.unlockReputation+'が必要。'
      };
    }

    if(!pay(state,next.unlockCost)){
      return {
        ok:false,
        message:next.name+'の手続きに'+formatMoney(next.unlockCost)+'必要。'
      };
    }

    state.market.stage+=1;
    state.market.feePaidDay=0;

    return {
      ok:true,
      message:next.name+'を使えるようになった。'
    };
  }

  function marketOpen(state){
    const now=Math.max(0,Math.floor(Number(state && state.minutes)||0))%1440;
    return now>=MARKET_OPEN_MINUTE && now<MARKET_CLOSE_MINUTE;
  }

  function payMarketFee(state){
    ensureState(state);

    if(state.sceneKey!=='cityCommon'){
      return {ok:false,message:'場所代は市内・庶民街で支払う。'};
    }

    const stage=marketStage(state);
    if(state.market.stage<=0){
      return {ok:false,message:'まだ正式な露店の場所を持っていない。'};
    }

    const day=Math.max(1,Math.floor(Number(state.day)||1));
    if(Number(state.market.feePaidDay)===day){
      return {ok:false,message:'今日の場所代は支払い済み。'};
    }

    if(!pay(state,stage.dailyFee)){
      return {
        ok:false,
        message:'今日の場所代 '+formatMoney(stage.dailyFee)+' が足りない。'
      };
    }

    state.market.feePaidDay=day;
    return {
      ok:true,
      message:'今日の場所代 '+formatMoney(stage.dailyFee)+' を払った。'
    };
  }

  function hasPaidMarketFee(state){
    ensureState(state);
    const day=Math.max(1,Math.floor(Number(state.day)||1));
    return state.market.stage>0 && Number(state.market.feePaidDay)===day;
  }

  function protectedSelling(state){
    ensureState(state);
    return state.sceneKey==='cityCommon' &&
      state.market.stage>0 &&
      hasPaidMarketFee(state) &&
      marketOpen(state);
  }

  function sellingStopMultiplier(state){
    if(!protectedSelling(state)) return 1;
    return state.market.stage>=2 ? 1.35 : 1.15;
  }

  function marketSummary(state){
    ensureState(state);
    const stage=marketStage(state);
    if(state.market.stage<=0) return stage.name;

    const paid=hasPaidMarketFee(state) ? '本日支払済' : '本日未払い';
    return stage.name+' / 場所代'+formatMoney(stage.dailyFee)+' / '+paid;
  }

  function removePanel(){
    const old=document.getElementById('lifeChoicePanel');
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
    if(window.SHOP_WELL && window.SHOP_WELL.close) window.SHOP_WELL.close();
    if(window.SHOP_STALL && window.SHOP_STALL.close) window.SHOP_STALL.close();
    if(window.SHOP_ACTION && document.getElementById('actionScreen')?.classList.contains('is-open')){
      window.SHOP_ACTION.close();
    }

    const host=document.querySelector('.town-panel');
    if(!host) return;

    const panel=document.createElement('div');
    panel.id='lifeChoicePanel';
    panel.className='stall-choice-panel';

    const title=document.createElement('div');
    title.className='stall-choice-title';
    title.textContent='暮らし';

    const message=document.createElement('div');
    message.className='stall-choice-message';

    const actions=document.createElement('div');
    actions.className='stall-choice-actions';

    const refresh=()=>{
      ensureState(state);
      if(typeof onChange==='function') onChange();
    };

    const summary=()=>{
      message.textContent=
        '信用 '+reputation(state)+
        ' ／ 寝床 '+housingLabel(state)+
        ' ／ 商い '+marketSummary(state);
    };

    const showMain=()=>{
      summary();
      actions.replaceChildren(
        makeButton('今日の仕事',showJobs),
        makeButton('寝床・休む',showHousing),
        makeButton('露店・市場',showMarket),
        makeButton('物乞い',()=>{
          removePanel();
          if(window.SHOP_ACTION) window.SHOP_ACTION.open(state,'beg');
        }),
        makeButton('物売り',()=>{
          removePanel();
          if(window.SHOP_ACTION) window.SHOP_ACTION.open(state,'sell');
        }),
        makeButton('閉じる',removePanel)
      );
    };

    const showJobs=()=>{
      message.textContent='今日の仕事';
      actions.replaceChildren();

      dailyJobs(state).forEach(job=>{
        const done=jobDoneToday(state,job.id);
        const locked=reputation(state)<job.minReputation;
        const label=
          job.name+'　'+
          Math.round(job.minutes/60*10)/10+'時間 ／ '+
          formatMoney(job.payCopper)+' ／ 信用+'+job.reputation+
          (done ? '【済】' : locked ? '【信用'+job.minReputation+'】' : '');

        actions.appendChild(makeButton(label,()=>{
          const result=doJob(state,job.id);
          message.textContent=result.message;
          refresh();
          showJobs();
          message.textContent=result.message;
        },done || locked));
      });

      actions.appendChild(makeButton('戻る',showMain));
    };

    const showHousing=()=>{
      message.textContent=
        '現在の寝床: '+housingLabel(state)+
        (activeRoom(state) ? '（'+state.housing.roomPaidUntilDay+'日目まで）' : '');
      actions.replaceChildren(
        makeButton('野宿する　無料 / 6時間',()=>{
          const result=sleep(state,'rough');
          message.textContent=result.message;
          refresh();
          showHousing();
          message.textContent=result.message;
        }),
        makeButton('安宿で休む　'+formatMoney(4)+' / 6時間',()=>{
          const result=sleep(state,'inn');
          message.textContent=result.message;
          refresh();
          showHousing();
          message.textContent=result.message;
        },money(state)<4),
        makeButton('自室で休む　6時間',()=>{
          const result=sleep(state,'room');
          message.textContent=result.message;
          refresh();
          showHousing();
          message.textContent=result.message;
        },!activeRoom(state)),
        makeButton('部屋を7日借りる　信用8 / '+formatMoney(28),()=>{
          const result=rentRoom(state);
          message.textContent=result.message;
          refresh();
          showHousing();
          message.textContent=result.message;
        },reputation(state)<8 || money(state)<28),
        makeButton('戻る',showMain)
      );
    };

    const showMarket=()=>{
      const stage=marketStage(state);
      message.textContent=
        marketSummary(state)+
        ' ／ 営業時間 07:00〜19:00';

      const buttons=[];

      if(state.market.stage<2){
        const next=MARKET_STAGES[state.market.stage+1];
        buttons.push(makeButton(
          next.name+'を申請　信用'+next.unlockReputation+
            ' / '+formatMoney(next.unlockCost),
          ()=>{
            const result=upgradeMarket(state);
            message.textContent=result.message;
            refresh();
            showMarket();
            message.textContent=result.message;
          },
          reputation(state)<next.unlockReputation || money(state)<next.unlockCost
        ));
      }

      if(state.market.stage>0){
        buttons.push(makeButton(
          '今日の場所代を払う　'+formatMoney(stage.dailyFee),
          ()=>{
            const result=payMarketFee(state);
            message.textContent=result.message;
            refresh();
            showMarket();
            message.textContent=result.message;
          },
          hasPaidMarketFee(state) || money(state)<stage.dailyFee
        ));
      }

      buttons.push(makeButton('戻る',showMain));
      actions.replaceChildren(...buttons);
    };

    panel.append(title,message,actions);
    host.appendChild(panel);
    showMain();
  }

  window.SHOP_LIFE=Object.freeze({
    jobs:JOBS,
    marketStages:MARKET_STAGES,
    ensureState,
    reputation,
    addReputation,
    housingLabel,
    activeRoom,
    sleep,
    rentRoom,
    dailyJobs,
    doJob,
    marketStage,
    upgradeMarket,
    payMarketFee,
    hasPaidMarketFee,
    protectedSelling,
    sellingStopMultiplier,
    marketSummary,
    open,
    close:removePanel
  });
})();