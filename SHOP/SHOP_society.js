(() => {
  'use strict';

  /*
    ゲーム内で使う最小限の社会ルール層。
    歴史資料を丸ごと辞典化するためではなく、
    市場監督・公共空間・施し・事情酌量をゲーム判定へ渡す。
  */

  const RULE_NOTES = Object.freeze([
    Object.freeze({
      id:'market_supervision',
      title:'市場の監督',
      summary:'市場では秤・量目・商品の質や不正な商いが監督対象になる。'
    }),
    Object.freeze({
      id:'public_space',
      title:'公共の場所',
      summary:'門前や通りを塞ぐ、長時間居座るなどは注意や退去の理由になりうる。'
    }),
    Object.freeze({
      id:'warning_first',
      title:'まず警告',
      summary:'軽い違反や迷惑行為は、いきなり重罰ではなく注意・警告から始まることがある。'
    }),
    Object.freeze({
      id:'charity',
      title:'施し',
      summary:'困窮者への施しは宗教的に重んじられるが、物乞いがどこでも無制限に許される意味ではない。'
    }),
    Object.freeze({
      id:'mercy',
      title:'事情酌量',
      summary:'ゲームでは明らかな困窮状態を、注意回数や取締り確率を少し緩める事情として扱う。'
    })
  ]);

  function clamp01(value){
    return Math.max(0,Math.min(1,Number(value)||0));
  }

  function minuteOfDay(state){
    return ((Number(state && state.minutes)||0)%1440+1440)%1440;
  }

  function needLevel(state){
    const hp=Number(state && state.hp);
    const hunger=Number(state && state.hunger);
    const thirst=Number(state && state.thirst);

    if(hp<=25 || hunger>=95 || thirst>=95) return 'critical';
    if(hp<=40 || hunger>=85 || thirst>=85) return 'severe';
    if(hp<=60 || hunger>=70 || thirst>=70) return 'strained';
    return 'normal';
  }

  function isPrayerWindow(state){
    if(!window.SHOP_TIME || !Array.isArray(window.SHOP_TIME.prayers)) return false;
    const now=minuteOfDay(state);
    return window.SHOP_TIME.prayers.some(prayer=>
      now>=prayer.minute-20 && now<prayer.minute+30
    );
  }

  function charityMultiplier(state){
    let multiplier=1;

    if(isPrayerWindow(state)) multiplier*=1.35;

    const need=needLevel(state);
    if(need==='strained') multiplier*=1.05;
    else if(need==='severe') multiplier*=1.12;
    else if(need==='critical') multiplier*=1.18;

    return multiplier;
  }

  function enforcementModifiers(state,mode){
    const need=needLevel(state);
    let checkChanceMultiplier=1;
    let extraWarnings=0;

    if(mode==='beg'){
      if(need==='strained') checkChanceMultiplier*=0.92;
      if(need==='severe'){
        checkChanceMultiplier*=0.78;
        extraWarnings+=1;
      }
      if(need==='critical'){
        checkChanceMultiplier*=0.65;
        extraWarnings+=1;
      }

      if(isPrayerWindow(state)){
        checkChanceMultiplier*=0.9;
      }
    }else if(mode==='sell'){
      if(need==='severe') checkChanceMultiplier*=0.9;
      if(need==='critical'){
        checkChanceMultiplier*=0.82;
        extraWarnings+=1;
      }
    }

    return Object.freeze({
      need,
      checkChanceMultiplier,
      extraWarnings
    });
  }

  function sellingInterestMultiplier(state){
    const now=minuteOfDay(state);
    if(now<300 || now>=1320) return 0.35;
    if(now<480) return 0.7;
    if(now>=720 && now<900) return 0.82;
    if(now>=1020 && now<1200) return 1.12;
    if(now>=1200) return 0.75;
    return 1;
  }

  window.SHOP_SOCIETY=Object.freeze({
    notes:RULE_NOTES,
    clamp01,
    minuteOfDay,
    needLevel,
    isPrayerWindow,
    charityMultiplier,
    enforcementModifiers,
    sellingInterestMultiplier
  });
})();