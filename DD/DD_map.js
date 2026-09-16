(() => {
  const SESSION_KEY='dd_session_map_location_v2';
  const OLD_SESSION_KEY='dd_session_map_position_v1';
  const LEGACY_LOCAL_KEY='dd_map_position_v1';

  const places={
    cabin:{name:'小屋',description:'生活の拠点。休息や料理、保管をする場所。',x:39,y:58},
    northForest:{name:'北の森',description:'木の実や枝、蔓などを探しやすい森。',zone:'forest',x:31,y:29},
    deepForest:{name:'深い森',description:'木が密集した暗い森。移動に時間がかかる。',zone:'forest',x:14,y:15},
    plain:{name:'開けた平原',description:'見通しのよい平原。採集や狩猟ができる。',zone:'plain',x:67,y:40},
    river:{name:'川辺',description:'川沿いの場所。魚や河原のものを探せる。',zone:'river',x:84,y:72}
  };
  const order=['deepForest','northForest','cabin','plain','river'];
  const travelMinutes={
    cabin:{cabin:0,northForest:20,deepForest:40,plain:30,river:40},
    northForest:{cabin:20,northForest:0,deepForest:20,plain:30,river:45},
    deepForest:{cabin:40,northForest:20,deepForest:0,plain:50,river:60},
    plain:{cabin:30,northForest:30,deepForest:50,plain:0,river:20},
    river:{cabin:40,northForest:45,deepForest:60,plain:20,river:0}
  };

  const message=document.getElementById('message');
  const dayPhase=document.getElementById('dayPhase');
  const pin=document.getElementById('mapPin');
  const pinLabel=document.getElementById('pinLabel');
  const prev=document.getElementById('placePrev');
  const next=document.getElementById('placeNext');
  const selectedPlace=document.getElementById('selectedPlace');
  const selectedInfo=document.getElementById('selectedInfo');
  const confirmMove=document.getElementById('confirmMove');

  function clearOldPersistence(){try{localStorage.removeItem(LEGACY_LOCAL_KEY)}catch(_){}try{sessionStorage.removeItem(OLD_SESSION_KEY)}catch(_){}}
  function loadLocation(){try{const saved=sessionStorage.getItem(SESSION_KEY);if(saved&&places[saved])return saved}catch(_){}return'cabin'}
  function syncLocation(){try{sessionStorage.setItem(SESSION_KEY,currentLocation)}catch(_){}}
  function timeParts(){return window.DDTime?.getState?.()||{day:1,hour:7,minute:0,phase:'朝'}}
  function refreshDayPhase(){const state=timeParts();dayPhase.textContent=`${state.day}日目　${state.phase}`}
  function costFromHere(placeId){return Number(travelMinutes[currentLocation]?.[placeId]??0)}
  function selectedId(){return order[selectedIndex]||currentLocation}
  function setPin(id){const p=places[id];pin.style.left=`${p.x}%`;pin.style.top=`${p.y}%`;pinLabel.style.left=`${p.x}%`;pinLabel.style.top=`${p.y}%`;pinLabel.textContent=p.name}

  function render(){
    refreshDayPhase();
    const id=selectedId();
    const info=places[id];
    const here=id===currentLocation;
    const cost=costFromHere(id);
    setPin(id);
    selectedPlace.innerHTML=`${info.name}${here?'<span class="currentMark">現在地</span>':''}`;
    selectedInfo.textContent=here?info.description:`${info.description}　移動 ${cost}分`;
    if(here) confirmMove.textContent=id==='cabin'?'小屋に入る':'この地点に入る';
    else confirmMove.textContent=`ここへ移動する　${cost}分`;
  }

  function moveSelection(step){selectedIndex=(selectedIndex+step+order.length)%order.length;message.textContent='▲▼で場所を選ぶ。';render()}
  function enterCurrent(){const info=places[currentLocation];if(currentLocation==='cabin'){location.href='DD_top.html';return}location.href=`DD_point.html?zone=${encodeURIComponent(info.zone)}&place=${encodeURIComponent(currentLocation)}&v=${Date.now()}`}
  function completeMove(placeId){
    const from=currentLocation;
    const minutes=Number(travelMinutes[from]?.[placeId]??0);
    if(minutes>0&&window.DDTime)DDTime.advance(minutes,`move:${from}->${placeId}`);
    currentLocation=placeId;syncLocation();selectedIndex=order.indexOf(placeId);
    message.textContent=`${places[placeId].name}へ移動した。${minutes}分経過。`;
    render();
  }
  function moveTo(placeId){
    if(!places[placeId]||placeId===currentLocation)return;
    const from=currentLocation;
    const event=window.DDEvents?.find?.({type:'beforeTravel',from,to:placeId});
    if(event){DDEvents.run(event,{onComplete:()=>completeMove(placeId)});return}
    completeMove(placeId);
  }
  function confirm(){const id=selectedId();if(id===currentLocation)enterCurrent();else moveTo(id)}

  clearOldPersistence();
  let currentLocation=loadLocation();
  let selectedIndex=Math.max(0,order.indexOf(currentLocation));
  prev.addEventListener('click',()=>moveSelection(-1));
  next.addEventListener('click',()=>moveSelection(1));
  selectedPlace.addEventListener('click',confirm);
  confirmMove.addEventListener('click',confirm);
  window.addEventListener('ddtimechange',render);
  document.addEventListener('contextmenu',e=>e.preventDefault());
  document.addEventListener('selectstart',e=>e.preventDefault());
  render();
})();