(function(){
"use strict";

var SAVE_KEY="iroiro_kenshi_still_save_v1";
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
    place:"road",
    hp:100,maxHp:100,hunger:0,money:100,
    food:2,med:1,ore:0,scrap:0,
    party:["主人公"],
    travel:null,
    log:["街道から始まった。"]
  };
}

var state=freshState();
var activeTab="place";
var toastTimer=null;
var mapOpen=false;
var travelTimer=null;

function clamp(v,min,max){return Math.max(min,Math.min(max,v))}
function pad(n){return String(n).padStart(2,"0")}

function normalizeState(){
  if(!state||typeof state!=="object")state=freshState();
  if(!PLACES[state.place])state.place="road";
  if(!Array.isArray(state.party))state.party=["主人公"];
  if(!Array.isArray(state.log))state.log=[];
  if(!("travel" in state))state.travel=null;
  if(!Number.isFinite(state.hp))state.hp=100;
  if(!Number.isFinite(state.maxHp))state.maxHp=100;
  if(!Number.isFinite(state.hunger))state.hunger=0;
  if(!Number.isFinite(state.money))state.money=100;
  ["food","med","ore","scrap"].forEach(function(k){if(!Number.isFinite(state[k]))state[k]=0});
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

  state.travel={to:key,remaining:75,total:75};
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
    state.ore+=got;advance(45);note("鉄鉱石を"+got+"個採掘した。");toast("鉄鉱石 +"+got);
  }else if(type==="scavenge"){
    if(Math.random()<.55){state.scrap++;note("廃材を1個見つけた。");toast("廃材 +1")}
    else{state.food++;note("保存食を1個見つけた。");toast("食料 +1")}
    advance(35);
  }else if(type==="farm"){
    state.food++;state.money+=8;advance(50);note("農作業を手伝った。");toast("食料 +1 / 金 +8");
  }else if(type==="rest"){
    var before=state.hp;state.hp=clamp(state.hp+35,0,state.maxHp);advance(180);note("休息した。");toast("HP +"+(state.hp-before));
  }else if(type==="shop"){
    openShop();return;
  }else if(type==="eat"){
    if(state.food<=0){toast("食料がない");return}
    state.food--;state.hunger=clamp(state.hunger-35,0,100);note("保存食を食べた。");toast("空腹 -35");
  }else if(type==="heal"){
    if(state.med<=0||state.hp>=state.maxHp){toast("治療できない");return}
    state.med--;state.hp=clamp(state.hp+30,0,state.maxHp);note("治療した。");toast("HP +30");
  }
  renderAll();
}

function shopBuy(item,price){
  if(state.money<price){toast("金が足りない");return}
  state.money-=price;
  state[item]++;
  note((item==="food"?"保存食":"治療具")+"を買った。");
  toast((item==="food"?"食料":"治療具")+" +1");
  renderAll();
  openShop();
}

function sellAll(item,unit){
  var n=state[item]||0;
  if(n<=0){toast("売る物がない");return}
  state[item]=0;
  state.money+=n*unit;
  note((item==="ore"?"鉄鉱石":"廃材")+"を売った。");
  toast("金 +"+(n*unit));
  renderAll();
  openShop();
}

function openShop(){
  activeTab="place";
  setTabButtons();
  var p=document.getElementById("panelContent");
  p.innerHTML=
    "<div class='placeHead'><b>店</b><span>"+PLACES[state.place].name+"</span></div>"+
    "<div class='actionGrid'>"+
      "<button id='buyFood'>保存食 12</button>"+
      "<button id='buyMed'>治療具 28</button>"+
      "<button id='sellOre'>鉄鉱石を売る</button>"+
      "<button id='sellScrap'>廃材を売る</button>"+
    "</div>"+
    "<button id='backPlace' class='logRow' type='button'>戻る</button>";
  document.getElementById("buyFood").onclick=function(){shopBuy("food",12)};
  document.getElementById("buyMed").onclick=function(){shopBuy("med",28)};
  document.getElementById("sellOre").onclick=function(){sellAll("ore",13)};
  document.getElementById("sellScrap").onclick=function(){sellAll("scrap",9)};
  document.getElementById("backPlace").onclick=renderPanel;
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

  if(activeTab==="place"){
    var place=PLACES[state.place];
    var html="<div class='placeHead'><b>"+(state.travel?"移動中":place.name)+"</b><span>"+(state.travel?(PLACES[state.travel.to].name+"へ向かっている"):place.kind)+"</span></div>";
    if(state.travel){
      html+="<div class='logRow'>到着まで "+state.travel.remaining+"分</div>";
    }else{
      html+="<div class='actionGrid'>";
      placeActions().forEach(function(x){html+="<button type='button' data-action='"+x[1]+"'>"+x[0]+"</button>"});
      html+="</div>";
    }
    p.innerHTML=html;
    p.querySelectorAll("[data-action]").forEach(function(b){b.onclick=function(){doAction(b.dataset.action)}});
    return;
  }

  if(activeTab==="items"){
    p.innerHTML="<div class='itemGrid'>"+
      "<button class='itemCard' id='eatItem'>食料<b>"+state.food+"</b></button>"+
      "<button class='itemCard' id='healItem'>治療具<b>"+state.med+"</b></button>"+
      "<div class='itemCard'>鉄鉱石<b>"+state.ore+"</b></div>"+
      "<div class='itemCard'>廃材<b>"+state.scrap+"</b></div>"+
    "</div>";
    document.getElementById("eatItem").onclick=function(){doAction("eat")};
    document.getElementById("healItem").onclick=function(){doAction("heal")};
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

  /* 右→中央上→左の半円軌道 */
  var x=90-progress*80;
  var y=63-Math.sin(progress*Math.PI)*50;

  celestial.className="sunMoon "+(isDay?"sun":"moon");
  celestial.style.left=x+"%";
  celestial.style.top=y+"%";
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
  view.hidden=!mapOpen;
  document.getElementById("destinationBtn").classList.toggle("active",mapOpen);
  document.getElementById("destinationBtn").textContent=mapOpen?"景色":"行き先";
  document.querySelectorAll(".mapNode").forEach(function(b){
    var key=b.dataset.destination;
    b.classList.toggle("current",!state.travel&&key===state.place);
  });
  var here=document.getElementById("mapHere");
  here.textContent=state.travel?("移動中 → "+PLACES[state.travel.to].name):("現在地： "+PLACES[state.place].name);
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
  renderStatus();
  setTabButtons();
  renderPanel();
}

document.getElementById("destinationBtn").addEventListener("click",function(){
  mapOpen=!mapOpen;
  renderMap();
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