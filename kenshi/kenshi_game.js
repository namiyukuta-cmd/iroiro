(function(){
"use strict";

var SAVE_KEY="iroiro_kenshi_save_v1";

var PLACES={
  dust:{name:"砂塵街",x:23,y:18,neighbors:["cross","farm"],kind:"town"},
  cross:{name:"十字路",x:51,y:34,neighbors:["dust","mine","ruins","farm"],kind:"road"},
  mine:{name:"鉄鉱山",x:79,y:19,neighbors:["cross","camp"],kind:"mine"},
  ruins:{name:"旧遺跡",x:76,y:55,neighbors:["cross","salt","camp"],kind:"ruins"},
  farm:{name:"南農場",x:21,y:57,neighbors:["dust","cross","salt"],kind:"farm"},
  salt:{name:"塩の荒地",x:43,y:79,neighbors:["farm","ruins","camp"],kind:"wild"},
  camp:{name:"盗賊野営地",x:82,y:82,neighbors:["mine","ruins","salt"],kind:"bandit"}
};

var ROADS=[
  ["dust","cross"],["dust","farm"],["cross","mine"],["cross","ruins"],
  ["cross","farm"],["mine","camp"],["ruins","salt"],["ruins","camp"],
  ["farm","salt"],["salt","camp"]
];

var NPC_BLUEPRINTS=[
  ["行商人","交易組合","trader","dust",95,180],
  ["護衛","交易組合","guard","dust",120,35],
  ["鉱夫","自由民","worker","mine",100,28],
  ["鉱夫","自由民","worker","mine",100,22],
  ["農民","南農場","worker","farm",90,18],
  ["農民","南農場","worker","farm",90,15],
  ["放浪者","無所属","wanderer","cross",100,15],
  ["旅人","無所属","wanderer","ruins",100,24],
  ["砂盗賊","砂盗賊","bandit","camp",105,35],
  ["砂盗賊","砂盗賊","bandit","camp",105,30],
  ["砂盗賊","砂盗賊","bandit","salt",105,28]
];

var state=null;
var activeTab="actions";
var timer=null;

function makeNPCs(){
  return NPC_BLUEPRINTS.map(function(b,i){
    return {id:i+1,name:b[0],faction:b[1],role:b[2],loc:b[3],hp:b[4],maxHp:b[4],money:b[5],down:false,recruited:false};
  });
}

function freshState(){
  return {
    version:1,day:1,hour:8,minute:0,paused:false,ticks:0,
    weather:"乾燥",
    player:{loc:"dust",hp:100,maxHp:100,hunger:0,money:100,food:2,med:1,ore:0,scrap:0,attack:13,defense:3,down:false},
    party:[{name:"主人公",hp:100,maxHp:100}],
    npcs:makeNPCs(),
    relations:{"交易組合":0,"南農場":0,"砂盗賊":-100,"自由民":0,"無所属":0},
    log:["砂塵街から始まった。世界はすでに動いている。"]
  };
}

function byId(id){return document.getElementById(id)}
function choice(a){return a[Math.floor(Math.random()*a.length)]}
function clamp(n,a,b){return Math.max(a,Math.min(b,n))}
function pad(n){return String(n).padStart(2,"0")}

function log(msg){
  state.log.unshift(msg);
  state.log=state.log.slice(0,40);
}

function advance(minutes){
  state.minute+=minutes;
  while(state.minute>=60){state.minute-=60;state.hour+=1}
  while(state.hour>=24){state.hour-=24;state.day+=1}
}

function isHostile(npc){
  return npc.faction==="砂盗賊";
}

function livingAt(loc){
  return state.npcs.filter(function(n){return n.loc===loc && !n.down && !n.recruited});
}

function downAt(loc){
  return state.npcs.filter(function(n){return n.loc===loc && n.down && !n.recruited});
}

function connected(a,b){
  return PLACES[a].neighbors.indexOf(b)>=0;
}

function travelTime(a,b){
  var ax=PLACES[a].x,ay=PLACES[a].y,bx=PLACES[b].x,by=PLACES[b].y;
  var d=Math.hypot(ax-bx,ay-by);
  return Math.round(20+d*0.7);
}

function moveNPCs(){
  state.npcs.forEach(function(n){
    if(n.down||n.recruited) return;
    var chance=n.role==="wanderer"?0.45:n.role==="trader"?0.32:n.role==="bandit"?0.36:0.18;
    if(Math.random()>chance) return;
    var opts=PLACES[n.loc].neighbors.slice();
    if(n.role==="trader" && opts.indexOf("dust")>=0 && Math.random()<0.45){n.loc="dust";return}
    if(n.role==="worker" && n.faction==="自由民" && n.loc!=="mine" && opts.indexOf("mine")>=0 && Math.random()<0.55){n.loc="mine";return}
    if(n.role==="worker" && n.faction==="南農場" && n.loc!=="farm" && opts.indexOf("farm")>=0 && Math.random()<0.55){n.loc="farm";return}
    n.loc=choice(opts);
  });
}

function resolveWorldCombat(){
  Object.keys(PLACES).forEach(function(loc){
    var here=livingAt(loc);
    var bandits=here.filter(function(n){return isHostile(n)});
    var others=here.filter(function(n){return !isHostile(n)});
    if(!bandits.length||!others.length||Math.random()>0.36) return;
    var a=choice(bandits),b=choice(others);
    var da=4+Math.floor(Math.random()*12);
    var db=6+Math.floor(Math.random()*15);
    a.hp=clamp(a.hp-da,0,a.maxHp);
    b.hp=clamp(b.hp-db,0,b.maxHp);
    log(PLACES[loc].name+"で"+a.name+"と"+b.name+"が戦闘。");
    if(a.hp<=0){a.down=true;log(a.name+"が倒れた。")}
    if(b.hp<=0){b.down=true;log(b.name+"が倒れた。")}
  });
}

function banditEncounter(){
  if(state.player.down) return;
  var bandits=livingAt(state.player.loc).filter(isHostile);
  if(!bandits.length||Math.random()>0.34) return;
  var enemy=choice(bandits);
  var playerDamage=Math.max(1,Math.floor(state.player.attack*(0.7+Math.random()*0.7)));
  var enemyDamage=Math.max(1,Math.floor((12+Math.random()*10)-state.player.defense));
  enemy.hp=clamp(enemy.hp-playerDamage,0,enemy.maxHp);
  state.player.hp=clamp(state.player.hp-enemyDamage,0,state.player.maxHp);
  log(enemy.name+"に襲われた。主人公 -"+enemyDamage+" / "+enemy.name+" -"+playerDamage);
  if(enemy.hp<=0){enemy.down=true;log(enemy.name+"が倒れた。")}
  if(state.player.hp<=0){
    state.player.down=true;
    state.paused=true;
    log("主人公は倒れた。休息か治療で立て直す必要がある。");
  }
}

function worldTick(){
  if(!state||state.paused) return;
  state.ticks+=1;
  advance(10);
  state.player.hunger=clamp(state.player.hunger+1,0,100);
  if(state.player.hunger>=85 && state.ticks%3===0){
    state.player.hp=clamp(state.player.hp-2,0,state.player.maxHp);
    if(state.player.hp<=0){state.player.down=true;state.paused=true;log("空腹で倒れた。")}
  }
  if(state.ticks%2===0) moveNPCs();
  resolveWorldCombat();
  banditEncounter();
  if(state.ticks%12===0){
    state.weather=choice(["乾燥","強風","砂埃","薄曇り"]);
  }
  render();
  if(state.ticks%6===0) save(false);
}

function movePlayer(target){
  if(state.player.down) return;
  if(!connected(state.player.loc,target)) return;
  var from=state.player.loc;
  var mins=travelTime(from,target);
  state.player.loc=target;
  advance(mins);
  state.player.hunger=clamp(state.player.hunger+4,0,100);
  log(PLACES[target].name+"へ移動した。");
  banditEncounter();
  render();
}

function mine(){
  if(state.player.loc!=="mine"||state.player.down) return;
  var got=1+Math.floor(Math.random()*3);
  state.player.ore+=got;
  advance(50);
  state.player.hunger=clamp(state.player.hunger+5,0,100);
  log("鉄鉱石を"+got+"個採掘した。");
  if(Math.random()<0.18) banditEncounter();
  render();
}

function scavenge(){
  if(["ruins","cross","salt"].indexOf(state.player.loc)<0||state.player.down) return;
  advance(40);
  state.player.hunger=clamp(state.player.hunger+4,0,100);
  var r=Math.random();
  if(r<0.35){var s=1+Math.floor(Math.random()*2);state.player.scrap+=s;log("廃材を"+s+"個見つけた。")}
  else if(r<0.55){state.player.food+=1;log("保存食を1個見つけた。")}
  else if(r<0.68){state.player.med+=1;log("治療具を1個見つけた。")}
  else if(r<0.82){var m=5+Math.floor(Math.random()*18);state.player.money+=m;log(m+"を拾った。")}
  else log("使える物は見つからなかった。");
  if(Math.random()<0.2) banditEncounter();
  render();
}

function workFarm(){
  if(state.player.loc!=="farm"||state.player.down) return;
  advance(60);
  var pay=8+Math.floor(Math.random()*8);
  state.player.money+=pay;
  state.player.food+=1;
  state.player.hunger=clamp(state.player.hunger+5,0,100);
  state.relations["南農場"]+=1;
  log("農作業をして"+pay+"と保存食1個を得た。");
  render();
}

function eat(){
  if(state.player.food<=0) return;
  state.player.food-=1;
  state.player.hunger=clamp(state.player.hunger-38,0,100);
  log("保存食を食べた。");
  render();
}

function useMed(){
  if(state.player.med<=0||state.player.hp>=state.player.maxHp) return;
  state.player.med-=1;
  state.player.hp=clamp(state.player.hp+35,0,state.player.maxHp);
  if(state.player.hp>0) state.player.down=false;
  log("治療具を使った。");
  render();
}

function rest(){
  if(["dust","farm"].indexOf(state.player.loc)<0) return;
  advance(180);
  state.player.hp=clamp(state.player.hp+40,0,state.player.maxHp);
  state.player.hunger=clamp(state.player.hunger+8,0,100);
  state.player.down=false;
  state.paused=false;
  log("休息した。");
  render();
}

function sellOre(){
  if(state.player.loc!=="dust"||state.player.ore<=0) return;
  var value=state.player.ore*13;
  log("鉄鉱石"+state.player.ore+"個を"+value+"で売った。");
  state.player.money+=value;
  state.player.ore=0;
  render();
}

function sellScrap(){
  if(state.player.loc!=="dust"||state.player.scrap<=0) return;
  var value=state.player.scrap*9;
  log("廃材"+state.player.scrap+"個を"+value+"で売った。");
  state.player.money+=value;
  state.player.scrap=0;
  render();
}

function buyFood(){
  if(state.player.loc!=="dust"||state.player.money<12) return;
  state.player.money-=12;state.player.food+=1;log("保存食を12で買った。");render();
}

function buyMed(){
  if(state.player.loc!=="dust"||state.player.money<28) return;
  state.player.money-=28;state.player.med+=1;log("治療具を28で買った。");render();
}

function lootDown(){
  var list=downAt(state.player.loc).filter(function(n){return n.money>0});
  if(!list.length) return;
  var n=list[0],gain=n.money;
  n.money=0;state.player.money+=gain;
  if(Math.random()<0.35){state.player.scrap+=1;log("倒れている"+n.name+"から"+gain+"と廃材1個を回収した。")}
  else log("倒れている"+n.name+"から"+gain+"を回収した。");
  render();
}

function healNPC(){
  if(state.player.med<=0) return;
  var list=downAt(state.player.loc).filter(function(n){return !isHostile(n)});
  if(!list.length) return;
  var n=list[0];
  state.player.med-=1;
  n.hp=Math.max(30,Math.round(n.maxHp*0.35));
  n.down=false;
  state.relations[n.faction]=(state.relations[n.faction]||0)+4;
  log(n.name+"を治療した。"+n.faction+"との関係が少し良くなった。");
  render();
}

function recruit(){
  var list=livingAt(state.player.loc).filter(function(n){return n.role==="wanderer" && n.faction==="無所属" && !n.recruited});
  if(!list.length||state.player.money<50) return;
  var n=list[0];
  state.player.money-=50;n.recruited=true;
  state.party.push({name:n.name,hp:n.hp,maxHp:n.maxHp});
  log(n.name+"を仲間にした。");
  render();
}

function save(show){
  try{
    localStorage.setItem(SAVE_KEY,JSON.stringify(state));
    if(show) log("セーブした。");
  }catch(e){if(show) log("セーブに失敗した。")}
  if(show) render();
}

function load(){
  try{
    var raw=localStorage.getItem(SAVE_KEY);
    if(!raw){log("セーブデータがない。");render();return}
    state=JSON.parse(raw);
    state.paused=true;
    log("ロードした。");
    render();
  }catch(e){state=freshState();log("セーブデータを読み込めなかったため新規状態に戻した。");render()}
}

function button(label,fn,disabled){
  var b=document.createElement("button");
  b.type="button";b.className="action";b.textContent=label;b.disabled=!!disabled;
  b.addEventListener("click",fn);
  return b;
}

function renderRoads(){
  var map=byId("map");
  ROADS.forEach(function(pair){
    var a=PLACES[pair[0]],b=PLACES[pair[1]];
    var dx=b.x-a.x,dy=b.y-a.y;
    var len=Math.hypot(dx,dy);
    var angle=Math.atan2(dy,dx)*180/Math.PI;
    var r=document.createElement("div");
    r.className="road";
    r.style.left=a.x+"%";r.style.top=a.y+"%";
    r.style.width=len+"%";r.style.transform="rotate("+angle+"deg)";
    map.appendChild(r);
  });
}

function renderMap(){
  var map=byId("map");
  map.innerHTML="";
  renderRoads();
  Object.keys(PLACES).forEach(function(key){
    var p=PLACES[key];
    var b=document.createElement("button");
    b.type="button";b.className="place";
    if(key===state.player.loc)b.classList.add("current");
    if(connected(state.player.loc,key))b.classList.add("adjacent");
    b.style.left=p.x+"%";b.style.top=p.y+"%";
    var alive=livingAt(key).length,down=downAt(key).length;
    b.innerHTML=p.name+"<span class='count'>人 "+alive+(down?" / 倒 "+down:"")+"</span>";
    b.disabled=key!==state.player.loc&&!connected(state.player.loc,key);
    if(connected(state.player.loc,key)) b.addEventListener("click",function(){movePlayer(key)});
    map.appendChild(b);
  });
  var cur=PLACES[state.player.loc];
  var mark=document.createElement("div");
  mark.className="playerMark";mark.style.left=cur.x+"%";mark.style.top=(cur.y+8)+"%";
  map.appendChild(mark);
}

function renderActions(){
  var pane=byId("pane");pane.innerHTML="";
  var grid=document.createElement("div");grid.className="actionGrid";
  var loc=state.player.loc;
  if(loc==="mine")grid.appendChild(button("採掘",mine,state.player.down));
  if(["ruins","cross","salt"].indexOf(loc)>=0)grid.appendChild(button("漁る",scavenge,state.player.down));
  if(loc==="farm")grid.appendChild(button("農作業",workFarm,state.player.down));
  if(loc==="dust"){
    grid.appendChild(button("鉱石を売る",sellOre,state.player.ore<=0));
    grid.appendChild(button("廃材を売る",sellScrap,state.player.scrap<=0));
    grid.appendChild(button("食料を買う",buyFood,state.player.money<12));
    grid.appendChild(button("治療具を買う",buyMed,state.player.money<28));
  }
  if(["dust","farm"].indexOf(loc)>=0)grid.appendChild(button("休息",rest,false));
  grid.appendChild(button("食べる",eat,state.player.food<=0));
  grid.appendChild(button("自分を治療",useMed,state.player.med<=0||state.player.hp>=state.player.maxHp));
  var canLoot=downAt(loc).some(function(n){return n.money>0});
  grid.appendChild(button("倒れた者を漁る",lootDown,!canLoot));
  var canHeal=downAt(loc).some(function(n){return !isHostile(n)});
  grid.appendChild(button("倒れた者を治療",healNPC,!canHeal||state.player.med<=0));
  var canRecruit=livingAt(loc).some(function(n){return n.role==="wanderer"&&n.faction==="無所属"});
  grid.appendChild(button("放浪者を雇う 50",recruit,!canRecruit||state.player.money<50));
  pane.appendChild(grid);
  var inv=document.createElement("div");inv.className="inventory";inv.style.marginTop="10px";
  [["食料",state.player.food],["治療具",state.player.med],["鉄鉱石",state.player.ore],["廃材",state.player.scrap]].forEach(function(it){
    var d=document.createElement("div");d.className="item";d.innerHTML=it[0]+"<strong>"+it[1]+"</strong>";inv.appendChild(d);
  });
  pane.appendChild(inv);
}

function renderNearby(){
  var pane=byId("pane");pane.innerHTML="";
  var cards=document.createElement("div");cards.className="cards";
  var list=state.npcs.filter(function(n){return n.loc===state.player.loc&&!n.recruited});
  if(!list.length){cards.innerHTML="<div class='card'>周囲には誰もいない。</div>";pane.appendChild(cards);return}
  list.forEach(function(n){
    var c=document.createElement("div");c.className="card";
    var stateText=n.down?"倒れている":"行動中";
    var side=isHostile(n)?"bad":"";
    c.innerHTML="<div><b>"+n.name+"</b><br><span class='"+side+"'>"+n.faction+"</span> ・ "+stateText+"</div><div>HP "+n.hp+"/"+n.maxHp+"</div>";
    cards.appendChild(c);
  });
  pane.appendChild(cards);
}

function renderParty(){
  var pane=byId("pane");pane.innerHTML="";
  var cards=document.createElement("div");cards.className="cards";
  var p=document.createElement("div");p.className="card";
  p.innerHTML="<div><b>主人公</b><br>攻撃 "+state.player.attack+" / 防御 "+state.player.defense+"</div><div>HP "+state.player.hp+"/"+state.player.maxHp+"</div>";
  cards.appendChild(p);
  state.party.slice(1).forEach(function(m){
    var c=document.createElement("div");c.className="card";
    c.innerHTML="<div><b>"+m.name+"</b><br>部隊員</div><div>HP "+m.hp+"/"+m.maxHp+"</div>";
    cards.appendChild(c);
  });
  var rel=document.createElement("div");rel.style.marginTop="10px";rel.className="cards";
  Object.keys(state.relations).forEach(function(k){
    var c=document.createElement("div");c.className="card";
    var v=state.relations[k],cls=v<0?"bad":(v>0?"good":"");
    c.innerHTML="<div>"+k+"</div><div class='"+cls+"'>"+v+"</div>";rel.appendChild(c);
  });
  pane.appendChild(cards);pane.appendChild(rel);
}

function renderLog(){
  var pane=byId("pane");pane.innerHTML="";
  var box=document.createElement("div");box.className="log";
  state.log.slice(0,16).forEach(function(t){var d=document.createElement("div");d.textContent=t;box.appendChild(d)});
  pane.appendChild(box);
}

function renderPane(){
  if(activeTab==="actions")renderActions();
  else if(activeTab==="nearby")renderNearby();
  else if(activeTab==="party")renderParty();
  else renderLog();
}

function render(){
  byId("locName").textContent=PLACES[state.player.loc].name;
  byId("clock").textContent=state.day+"日目 "+pad(state.hour)+":"+pad(state.minute);
  byId("weather").textContent=state.weather;
  byId("hp").textContent=state.player.hp+"/"+state.player.maxHp;
  byId("hunger").textContent=state.player.hunger;
  byId("money").textContent=state.player.money;
  byId("party").textContent=state.party.length;
  byId("condition").textContent=state.player.down?"倒れている":(state.player.hunger>=80?"飢餓":(state.player.hp<45?"負傷":"正常"));
  byId("pauseBtn").textContent=state.paused?"再開":"一時停止";
  renderMap();renderPane();
}

function init(){
  var newGame=new URLSearchParams(location.search).get("new")==="1";
  if(newGame){
    state=freshState();
    save(false);
  }else{
    try{
      var raw=localStorage.getItem(SAVE_KEY);
      state=raw?JSON.parse(raw):freshState();
    }catch(e){state=freshState()}
  }

  document.querySelectorAll(".tab").forEach(function(t){
    t.addEventListener("click",function(){
      activeTab=t.getAttribute("data-tab");
      document.querySelectorAll(".tab").forEach(function(x){x.classList.toggle("active",x===t)});
      renderPane();
    });
  });

  byId("pauseBtn").addEventListener("click",function(){state.paused=!state.paused;render()});
  byId("saveBtn").addEventListener("click",function(){save(true)});
  byId("loadBtn").addEventListener("click",load);

  render();
  timer=setInterval(worldTick,1600);
  window.addEventListener("beforeunload",function(){save(false)});
}

init();
})();