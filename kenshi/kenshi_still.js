(function(){
"use strict";

var SAVE_KEY="iroiro_kenshi_still_save_v1";
var INVENTORY_CAPACITY=20;
var ITEMS=window.KENSHI_ITEMS||{};
var MAP_POS={
  road:{x:41,y:56},
  dust:{x:18,y:24},
  cross:{x:49,y:45},
  mine:{x:79,y:25},
  farm:{x:20,y:77},
  ruins:{x:77,y:72}
};

var PLACES={
  road:{name:"街道",kind:"移動中の道",scene:"roadScene"},
  dust:{name:"砂塵街",kind:"町",scene:"townScene"},
  cross:{name:"十字路",kind:"街道の交差点",scene:"roadScene"},
  mine:{name:"鉄鉱山",kind:"採掘場",scene:"mineScene"},
  farm:{name:"南農場",kind:"農場",scene:"farmScene"},
  ruins:{name:"旧遺跡",kind:"廃墟",scene:"ruinsScene"}
};

function freshState(){
  return {
    day:1,hour:8,minute:0,
    place:"cross",
    hp:100,maxHp:100,hunger:0,money:100,
    items:{bread:2,bandage:1},
    party:["主人公"],
    travel:null,
    log:["十字路から始まった。"]
  };
}

var state=freshState();
var activeTab="items";
var toastTimer=null;
var mapOpen=false;
var travelTimer=null;

function clamp(v,min,max){return Math.max(min,Math.min(max,v))}
function pad(n){return String(n).padStart(2,"0")}

function itemCount(key){
  return state.items&&Number.isFinite(state.items[key])?state.items[key]:0;
}

function itemSlots(key,count){
  var meta=ITEMS[key];
  if(!meta||count<=0)return 0;
  return Math.ceil(count/(meta.stack||1));
}

function inventorySlotsUsed(){
  if(!state.items)return 0;
  return Object.keys(state.items).reduce(function(total,key){
    return total+itemSlots(key,itemCount(key));
  },0);
}

function inventorySlotsWith(key,newCount){
  var keys=Object.keys(state.items||{});
  if(keys.indexOf(key)<0)keys.push(key);
  return keys.reduce(function(total,itemKey){
    var count=itemKey===key?newCount:itemCount(itemKey);
    return total+itemSlots(itemKey,count);
  },0);
}

function addItemLimited(key,qty){
  if(!ITEMS[key]||qty<=0)return 0;
  var added=qty;
  while(added>0&&inventorySlotsWith(key,itemCount(key)+added)>INVENTORY_CAPACITY){
    added--;
  }
  if(added<=0)return 0;
  state.items[key]=itemCount(key)+added;
  return added;
}

function removeItem(key,qty){
  if(!state.items||qty<=0)return 0;
  var have=itemCount(key);
  var removed=Math.min(have,qty);
  state.items[key]=have-removed;
  if(state.items[key]<=0)delete state.items[key];
  return removed;
}

function useItem(key){
  var meta=ITEMS[key];
  if(!meta||itemCount(key)<=0)return;

  if(meta.category==="food"){
    if(state.hunger<=0){toast("空腹ではない");return}
    removeItem(key,1);
    state.hunger=clamp(state.hunger-(meta.hungerRecovery||0),0,100);
    note(meta.name+"を食べた。");
    toast("空腹 -"+(meta.hungerRecovery||0));
  }else if(meta.category==="medical"){
    if(state.hp>=state.maxHp){toast("治療できない");return}
    removeItem(key,1);
    var before=state.hp;
    state.hp=clamp(state.hp+(meta.heal||0),0,state.maxHp);
    note(meta.name+"を使った。");
    toast("HP +"+Math.round(state.hp-before));
  }
  renderAll();
}

function normalizeState(){
  if(!state||typeof state!=="object")state=freshState();
  if(!PLACES[state.place])state.place="cross";
  if(!state.travel&&state.place==="road")state.place="cross";
  if(!Array.isArray(state.party))state.party=["主人公"];
  if(!Array.isArray(state.log))state.log=[];
  if(!("travel" in state))state.travel=null;
  if(state.travel&&!state.travel.from)state.travel.from="road";
  if(!Number.isFinite(state.hp))state.hp=100;
  if(!Number.isFinite(state.maxHp))state.maxHp=100;
  if(!Number.isFinite(state.hunger))state.hunger=0;
  if(!Number.isFinite(state.money))state.money=100;
  if(!state.items||typeof state.items!=="object"||Array.isArray(state.items))state.items={};

  var legacy={food:"bread",med:"bandage",ore:"iron_ore",scrap:"scrap_iron"};
  Object.keys(legacy).forEach(function(oldKey){
    if(Number.isFinite(state[oldKey])&&state[oldKey]>0){
      var newKey=legacy[oldKey];
      state.items[newKey]=(Number(state.items[newKey])||0)+state[oldKey];
    }
    delete state[oldKey];
  });

  Object.keys(state.items).forEach(function(key){
    var count=Number(state.items[key]);
    if(!ITEMS[key]||!Number.isFinite(count)||count<=0)delete state.items[key];
    else state.items[key]=Math.floor(count);
  });
}

function advance(mins){
  state.minute+=mins;
  state.hunger=clamp(state.hunger+Math.max(1,Math.round(mins/75)),0,100);
  while(state.minute>=60){state.minute-=60;state.hour++}
  while(state.hour>=24){state.hour-=24;state.day++}
}

function note(msg){
  state.log.unshift(msg);
  state.log=state.log.slice(0,40);
}

function toast(msg){
  var el=document.getElementById("toast");
  el.textContent=msg;
  el.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer=setTimeout(function(){el.classList.remove("show")},1200);
}

function save(){
  localStorage.setItem(SAVE_KEY,JSON.stringify(state));
  toast("セーブ");
}

function load(){
  var raw=localStorage.getItem(SAVE_KEY);
  if(!raw){toast("セーブなし");return}
  try{
    state=JSON.parse(raw);
    normalizeState();
    mapOpen=false;
    restartTravelTimer();
    toast("ロード");
    renderAll();
  }catch(e){toast("ロード失敗")}
}

function startTravel(key){
  if(!PLACES[key]||key==="road")return;
  if(state.travel&&state.travel.to===key){
    mapOpen=false;
    renderAll();
    return;
  }
  if(key===state.place&&!state.travel){
    toast("すでにここにいる");
    return;
  }

  state.travel={from:state.place||"road",to:key,remaining:75,total:75};
  state.place="road";
  mapOpen=false;
  note(PLACES[key].name+"へ向かった。");
  toast(PLACES[key].name+"へ出発");
  restartTravelTimer();
  renderAll();
}

function restartTravelTimer(){
  clearInterval(travelTimer);
  travelTimer=null;
  if(!state.travel)return;

  travelTimer=setInterval(function(){
    if(!state.travel){clearInterval(travelTimer);travelTimer=null;return}
    var step=Math.min(15,state.travel.remaining);
    advance(step);
    state.travel.remaining-=step;

    if(state.travel.remaining<=0){
      var key=state.travel.to;
      state.place=key;
      state.travel=null;
      clearInterval(travelTimer);
      travelTimer=null;
      note(PLACES[key].name+"に到着した。");
      toast(PLACES[key].name+"に到着");
    }
    renderAll();
  },900);
}

function doAction(type){
  if(state.travel){toast("移動中");return}

  if(type==="mine"){
    var got=1+Math.floor(Math.random()*3);
    var mined=addItemLimited("iron_ore",got);
    if(mined<=0){toast("所持品がいっぱい");return}
    advance(45);
    note("鉄鉱石を"+mined+"個採掘した。");
    toast("鉄鉱石 +"+mined);
  }else if(type==="scavenge"){
    var found=Math.random()<.55?"scrap_iron":"dried_meat";
    if(addItemLimited(found,1)<=0){toast("所持品がいっぱい");return}
    note(ITEMS[found].name+"を1個見つけた。");
    toast(ITEMS[found].name+" +1");
    advance(35);
  }else if(type==="farm"){
    if(addItemLimited("bread",1)<=0){toast("所持品がいっぱい");return}
    state.money+=8;
    advance(50);
    note("農作業を手伝った。");
    toast("パン +1 / 金 +8");
  }else if(type==="rest"){
    var before=state.hp;
    state.hp=clamp(state.hp+35,0,state.maxHp);
    advance(180);
    note("休息した。");
    toast("HP +"+(state.hp-before));
  }else if(type==="shop"){
    openShop();
    return;
  }
  renderAll();
}

function shopBuy(key){
  var meta=ITEMS[key];
  if(!meta||!meta.buy){toast("買えない");return}
  if(state.money<meta.buy){toast("金が足りない");return}
  if(addItemLimited(key,1)<=0){toast("所持品がいっぱい");return}
  state.money-=meta.buy;
  note(meta.name+"を買った。");
  toast(meta.name+" +1");
  renderAll();
  openShop();
}

function sellAll(key){
  var meta=ITEMS[key];
  var n=itemCount(key);
  if(!meta||!meta.sell||n<=0){toast("売る物がない");return}
  removeItem(key,n);
  state.money+=n*meta.sell;
  note(meta.name+"を"+n+"個売った。");
  toast("金 +"+(n*meta.sell));
  renderAll();
  openShop();
}

function openShop(){
  activeTab="shop";
  setTabButtons();
  var p=document.getElementById("panelContent");
  p.innerHTML=
    "<div class='placeHead'><b>店</b><span>"+PLACES[state.place].name+"</span></div>"+
    "<div class='actionGrid'>"+
      "<button id='buyBread'>パン "+ITEMS.bread.buy+"</button>"+
      "<button id='buyBandage'>包帯 "+ITEMS.bandage.buy+"</button>"+
      "<button id='sellIronOre'>鉄鉱石を売る</button>"+
      "<button id='sellScrapIron'>鉄くずを売る</button>"+
    "</div>"+
    "<button id='backItems' class='logRow' type='button'>持物へ戻る</button>";
  document.getElementById("buyBread").onclick=function(){shopBuy("bread")};
  document.getElementById("buyBandage").onclick=function(){shopBuy("bandage")};
  document.getElementById("sellIronOre").onclick=function(){sellAll("iron_ore")};
  document.getElementById("sellScrapIron").onclick=function(){sellAll("scrap_iron")};
  document.getElementById("backItems").onclick=function(){
    activeTab="items";
    setTabButtons();
    renderPanel();
  };
}

function placeActions(){
  var rows=[];
  if(state.travel)return rows;
  if(state.place==="mine")rows.push(["採掘","mine"],["補給所","shop"],["休息","rest"]);
  else if(state.place==="farm")rows.push(["農作業","farm"],["売店","shop"],["休息","rest"]);
  else if(state.place==="dust")rows.push(["雑貨店","shop"],["休息","rest"]);
  else if(state.place==="cross")rows.push(["漁る","scavenge"],["交易所","shop"],["休息","rest"]);
  else if(state.place==="ruins")rows.push(["漁る","scavenge"],["野営","rest"]);
  else rows.push(["野営","rest"]);
  return rows;
}

function renderPanel(){
  var p=document.getElementById("panelContent");

  if(activeTab==="items"){
    var used=inventorySlotsUsed();
    var slots=[];

    Object.keys(ITEMS).forEach(function(key){
      var meta=ITEMS[key];
      var remaining=itemCount(key);
      while(remaining>0){
        var count=Math.min(meta.stack||1,remaining);
        slots.push({key:key,meta:meta,count:count});
        remaining-=count;
      }
    });

    var html="<div class='inventoryHead'><b>所持品</b><span>"+used+" / "+INVENTORY_CAPACITY+"枠</span></div><div class='itemGrid'>";
    for(var i=0;i<INVENTORY_CAPACITY;i++){
      var slot=slots[i];
      if(slot){
        var usable=slot.meta.category==="food"||slot.meta.category==="medical";
        var tag=usable?"button":"div";
        html+="<"+tag+" class='itemCard' "+(usable?"type='button' data-use-item='"+slot.key+"'":"")+">"+
          "<img class='itemIcon' src='"+slot.meta.image+"' alt=''>"+
          "<span class='itemName'>"+slot.meta.name+"</span>"+
          "<b class='itemQty'>"+slot.count+"</b>"+
        "</"+tag+">";
      }else{
        html+="<div class='itemCard emptySlot' aria-hidden='true'></div>";
      }
    }
    html+="</div>";
    p.innerHTML=html;

    p.querySelectorAll("[data-use-item]").forEach(function(button){
      button.addEventListener("click",function(){useItem(button.dataset.useItem)});
    });
    return;
  }

  if(activeTab==="party"){
    p.innerHTML=state.party.map(function(name){
      return "<div class='partyCard'><span>"+name+"</span><b>HP "+state.hp+"/"+state.maxHp+"</b></div>";
    }).join("");
    return;
  }

  p.innerHTML=state.log.map(function(x){return "<div class='logRow'>"+x+"</div>"}).join("");
}

function setTabButtons(){
  document.querySelectorAll(".tab").forEach(function(b){
    b.classList.toggle("active",b.dataset.tab===activeTab);
  });
}

function renderCelestial(){
  document.getElementById("dayText").textContent=state.day+"日目";
  document.getElementById("clockText").textContent=pad(state.hour)+":"+pad(state.minute);

  var t=state.hour+state.minute/60;
  var celestial=document.getElementById("sunMoon");
  var isDay=t>=6&&t<18;
  var progress=isDay?(t-6)/12:((t<6?t+6:t-18)/12);

  /* 右の地平線 → 中央上空 → 左の地平線。
     一枚絵の外側の余白を通る大きな半円軌道。 */
  var angle=progress*Math.PI;
  var x=50+46*Math.cos(angle);
  var y=68-58*Math.sin(angle);

  celestial.className="sunMoon "+(isDay?"sun":"moon");
  celestial.style.left=x+"%";
  celestial.style.top=y+"%";
}

function renderSceneActions(){
  var box=document.getElementById("sceneActions");
  box.innerHTML="";

  if(mapOpen||state.travel){
    box.hidden=true;
    return;
  }

  var rows=placeActions();
  box.hidden=rows.length===0;
  rows.forEach(function(x){
    var b=document.createElement("button");
    b.type="button";
    b.textContent=x[0];
    b.addEventListener("click",function(){doAction(x[1])});
    box.appendChild(b);
  });
}

function renderScene(){
  var place=PLACES[state.place];
  var art=document.getElementById("sceneArt");
  art.className="sceneArt "+place.scene;
  document.getElementById("placeName").textContent=state.travel?"街道":place.name;
  document.getElementById("placeKind").textContent=state.travel?(PLACES[state.travel.to].name+"へ移動中"):place.kind;

  var travelState=document.getElementById("travelState");
  if(state.travel){
    travelState.hidden=false;
    travelState.textContent=PLACES[state.travel.to].name+"へ　あと"+state.travel.remaining+"分";
  }else{
    travelState.hidden=true;
    travelState.textContent="";
  }
}

function renderMap(){
  var view=document.getElementById("mapView");
  var win=document.getElementById("sceneWindow");
  view.hidden=!mapOpen;
  win.classList.toggle("mapMode",mapOpen);
  document.getElementById("destinationBtn").classList.toggle("active",mapOpen);
  document.getElementById("destinationBtn").textContent=mapOpen?"景色":"行き先";

  document.querySelectorAll(".mapNode").forEach(function(b){
    var key=b.dataset.destination;
    b.classList.toggle("current",!state.travel&&key===state.place);
  });

  var marker=document.getElementById("mapPlayerMarker");
  var x,y;
  if(state.travel){
    var from=MAP_POS[state.travel.from]||MAP_POS.road;
    var to=MAP_POS[state.travel.to]||MAP_POS.road;
    var progress=clamp(1-(state.travel.remaining/state.travel.total),0,1);
    x=from.x+(to.x-from.x)*progress;
    y=from.y+(to.y-from.y)*progress;
    marker.classList.add("traveling");
    marker.querySelector("b").textContent="移動中";
  }else{
    var at=MAP_POS[state.place]||MAP_POS.road;
    x=at.x;y=at.y;
    marker.classList.remove("traveling");
    marker.querySelector("b").textContent="現在地";
  }
  marker.style.left=x+"%";
  marker.style.top=y+"%";

  var here=document.getElementById("mapHere");
  here.textContent=state.travel?("現在地：移動中 → "+PLACES[state.travel.to].name):("現在地： "+PLACES[state.place].name);
}

function renderStatus(){
  document.getElementById("hpText").textContent=Math.round(state.hp)+"/"+state.maxHp;
  document.getElementById("hungerText").textContent=Math.round(state.hunger)+"/100";
  document.getElementById("moneyText").textContent=state.money;
  document.getElementById("hpFill").style.width=clamp(state.hp/state.maxHp*100,0,100)+"%";
  document.getElementById("hungerFill").style.width=clamp(state.hunger,0,100)+"%";
}

function renderAll(){
  renderCelestial();
  renderScene();
  renderMap();
  renderSceneActions();
  renderStatus();
  setTabButtons();
  renderPanel();
}

document.getElementById("destinationBtn").addEventListener("click",function(){
  mapOpen=!mapOpen;
  renderMap();
  renderSceneActions();
});

document.querySelectorAll("[data-destination]").forEach(function(b){
  b.addEventListener("click",function(){startTravel(b.dataset.destination)});
});

document.querySelectorAll(".tab").forEach(function(b){
  b.addEventListener("click",function(){
    activeTab=b.dataset.tab;
    setTabButtons();
    renderPanel();
  });
});

document.getElementById("menuBtn").addEventListener("click",function(){
  var q=document.getElementById("quickMenu");
  q.hidden=!q.hidden;
});
document.getElementById("saveBtn").addEventListener("click",function(){save();document.getElementById("quickMenu").hidden=true});
document.getElementById("loadBtn").addEventListener("click",function(){load();document.getElementById("quickMenu").hidden=true});

normalizeState();
restartTravelTimer();
renderAll();
})();