(function(){
"use strict";

var SAVE_KEY="iroiro_kenshi_save_v2";
var world=document.getElementById("world");
var actorLayer=document.getElementById("actors");
var landmarkLayer=document.getElementById("landmarks");
var routeSvg=document.getElementById("routeSvg");
var drawer=document.getElementById("drawer");
var selectedId="player";
var openDrawer="";
var lastTick=Date.now();
var simTimer=null;

var PLACES={
  dust:{name:"砂塵街",x:18,y:20,kind:"town"},
  cross:{name:"十字路",x:49,y:35,kind:"cross"},
  mine:{name:"鉄鉱山",x:80,y:19,kind:"mine"},
  ruins:{name:"旧遺跡",x:78,y:55,kind:"ruins"},
  farm:{name:"南農場",x:20,y:59,kind:"farm"},
  salt:{name:"塩の荒地",x:45,y:80,kind:"salt"},
  camp:{name:"盗賊野営地",x:83,y:82,kind:"camp"}
};

var ROADS=[["dust","cross"],["dust","farm"],["cross","mine"],["cross","ruins"],["cross","farm"],["mine","camp"],["ruins","salt"],["ruins","camp"],["farm","salt"],["salt","camp"]];

function dist(a,b){var dx=a.x-b.x,dy=a.y-b.y;return Math.hypot(dx,dy)}
function clamp(v,a,b){return Math.max(a,Math.min(b,v))}
function pad(n){return String(n).padStart(2,"0")}
function rnd(a,b){return a+Math.random()*(b-a)}
function choice(a){return a[Math.floor(Math.random()*a.length)]}

function actor(id,name,faction,type,x,y,extra){
  var o={id:id,name:name,faction:faction,type:type,x:x,y:y,hp:100,maxHp:100,money:20,down:false,
    target:null,speed:rnd(1.1,1.8),group:null,owner:null,loot:0,recruited:false,attackCd:0};
  return Object.assign(o,extra||{});
}

function freshState(){
  var a=[];
  a.push(actor("trader","商人","交易組合","trader",18,20,{money:220,group:"caravan",route:["dust","cross","mine","cross","dust"],routeIndex:1,speed:1.25}));
  a.push(actor("guard","護衛","交易組合","guard",16.5,21,{hp:120,maxHp:120,group:"caravan",follow:"trader",speed:1.45}));
  a.push(actor("pack","荷獣","交易組合","pack",15.5,19.5,{hp:130,maxHp:130,group:"caravan",follow:"trader",speed:1.25}));

  a.push(actor("wanderer","放浪者","無所属","wanderer",48,38,{money:35,route:["cross","ruins","salt","farm","cross"],routeIndex:1,speed:1.15}));
  a.push(actor("dog","犬","無所属","dog",46.5,39,{hp:80,maxHp:80,owner:"wanderer",follow:"wanderer",speed:1.65}));

  a.push(actor("miner1","鉱夫","自由民","worker",79,20,{money:24,home:"mine",speed:1.0}));
  a.push(actor("miner2","鉱夫","自由民","worker",82,21,{money:18,home:"mine",speed:1.0}));
  a.push(actor("farmer1","農民","南農場","worker",18,59,{money:16,home:"farm",speed:.9}));
  a.push(actor("farmer2","農民","南農場","worker",22,61,{money:14,home:"farm",speed:.9}));

  a.push(actor("bandit1","砂盗賊","砂盗賊","bandit",81,81,{money:30,group:"bandits",speed:1.45}));
  a.push(actor("bandit2","砂盗賊","砂盗賊","bandit",84,83,{money:22,group:"bandits",speed:1.42}));
  a.push(actor("bandit3","砂盗賊","砂盗賊","bandit",86,80,{money:26,group:"bandits",speed:1.38}));

  return {
    version:2,day:1,hour:8,minute:0,paused:false,speed:1,weather:"乾燥",tick:0,
    player:{x:18,y:24,hp:100,maxHp:100,hunger:0,money:100,food:2,med:1,ore:0,scrap:0,attack:16,defense:4,speed:1.7,down:false,target:null,attackTarget:null},
    actors:a,party:["player"],relations:{"交易組合":0,"南農場":0,"自由民":0,"無所属":0,"砂盗賊":-100},
    log:["砂塵街の外から始まった。人々は主人公と無関係に動いている。"]
  };
}

var state=freshState();

function log(msg){state.log.unshift(msg);state.log=state.log.slice(0,50)}

function advance(minutes){
  state.minute+=minutes;
  while(state.minute>=60){state.minute-=60;state.hour++}
  while(state.hour>=24){state.hour-=24;state.day++}
}

function getActor(id){return state.actors.find(function(a){return a.id===id})||null}
function aliveActors(){return state.actors.filter(function(a){return !a.down})}
function hostile(a,bFaction){
  if(a.faction==="砂盗賊" && bFaction!=="砂盗賊") return true;
  if(bFaction==="砂盗賊" && a.faction!=="砂盗賊") return true;
  return false;
}

function nearestPlace(pos){
  var best=null,bd=999;
  Object.keys(PLACES).forEach(function(k){
    var d=dist(pos,PLACES[k]);if(d<bd){bd=d;best=k}
  });
  return {key:best,d:bd};
}

function setTarget(a,x,y){a.target={x:clamp(x,2,98),y:clamp(y,3,97)}}

function routeActor(a){
  if(a.follow) return;
  if(a.route && (!a.target || dist(a,a.target)<2)){
    var key=a.route[a.routeIndex%a.route.length];
    a.routeIndex=(a.routeIndex+1)%a.route.length;
    setTarget(a,PLACES[key].x+rnd(-1.8,1.8),PLACES[key].y+rnd(-1.8,1.8));
    return;
  }
  if(a.home && (!a.target || dist(a,a.target)<1.5) && Math.random()<.35){
    var h=PLACES[a.home];setTarget(a,h.x+rnd(-4,4),h.y+rnd(-4,4));return;
  }
  if(a.type==="bandit" && (!a.target || dist(a,a.target)<2)){
    var choices=["camp","salt","ruins","cross"];var p=PLACES[choice(choices)];
    setTarget(a,p.x+rnd(-3,3),p.y+rnd(-3,3));
  }
}

function followActor(a){
  if(!a.follow) return false;
  var lead=getActor(a.follow);
  if(!lead || lead.down) return false;
  var ox=(a.type==="dog"?-2.1:-1.5),oy=(a.type==="dog"?1.4:1.1);
  if(a.type==="pack"){ox=-2.8;oy=-1.2}
  setTarget(a,lead.x+ox,lead.y+oy);
  return true;
}

function moveTowards(o,dt){
  if(!o.target) return;
  var dx=o.target.x-o.x,dy=o.target.y-o.y,d=Math.hypot(dx,dy);
  if(!Number.isFinite(d)){o.target=null;return}
  if(d<.25){o.target=null;return}
  var speed=Number.isFinite(o.speed)?o.speed:1.4;
  var step=speed*dt*state.speed;
  o.x+=dx/d*Math.min(step,d);
  o.y+=dy/d*Math.min(step,d);
  if(!Number.isFinite(o.x)||!Number.isFinite(o.y)){
    o.x=18;o.y=24;o.target=null;
  }
}

function chooseBanditTargets(){
  var targets=aliveActors().filter(function(a){return a.faction!=="砂盗賊" && a.type!=="dog" && a.type!=="pack"});
  state.actors.filter(function(a){return a.type==="bandit"&&!a.down}).forEach(function(b){
    var best=null,bd=18;
    targets.forEach(function(t){var d=dist(b,t);if(d<bd){bd=d;best=t}});
    var pd=dist(b,state.player);
    if(!state.player.down && pd<bd){best={id:"player",x:state.player.x,y:state.player.y};bd=pd}
    if(best) setTarget(b,best.x,best.y);
  });
}

function damagePlayer(amount,from){
  state.player.hp=clamp(state.player.hp-amount,0,state.player.maxHp);
  if(state.player.hp<=0&&!state.player.down){
    state.player.down=true;state.player.target=null;state.player.attackTarget=null;log("主人公が倒れた。");
  } else if(from && Math.random()<.18){log(from.name+"に襲われた。")}
}

function damageActor(a,amount,fromName){
  a.hp=clamp(a.hp-amount,0,a.maxHp);
  if(a.hp<=0&&!a.down){a.down=true;a.target=null;a.loot=a.money;a.money=0;log(a.name+"が倒れた。")}
  else if(fromName && Math.random()<.12){log(fromName+"と"+a.name+"が戦っている。")}
}

function combatStep(dt){
  state.actors.forEach(function(a){a.attackCd=Math.max(0,a.attackCd-dt)});

  var alive=aliveActors();
  for(var i=0;i<alive.length;i++){
    for(var j=i+1;j<alive.length;j++){
      var a=alive[i],b=alive[j];
      if(!hostile(a,b.faction) || dist(a,b)>3.4) continue;
      if(a.attackCd<=0){damageActor(b,Math.floor(rnd(6,15)),a.name);a.attackCd=1.4}
      if(b.attackCd<=0 && !b.down){damageActor(a,Math.floor(rnd(5,14)),b.name);b.attackCd=1.4}
    }
  }

  state.actors.filter(function(a){return a.type==="bandit"&&!a.down}).forEach(function(b){
    if(state.player.down||dist(b,state.player)>3.5) return;
    if(b.attackCd<=0){damagePlayer(Math.max(1,Math.floor(rnd(7,15)-state.player.defense)),b);b.attackCd=1.35}
  });

  if(state.player.attackTarget && !state.player.down){
    var t=getActor(state.player.attackTarget);
    if(!t||t.down){state.player.attackTarget=null;return}
    var d=dist(state.player,t);
    if(d>3){state.player.target={x:t.x,y:t.y}}
    else{
      state.player.target=null;
      if(!state.player._attackCd||state.player._attackCd<=0){
        damageActor(t,Math.floor(rnd(state.player.attack*.7,state.player.attack*1.25)),"主人公");
        state.player._attackCd=1.1;
      }
    }
  }
  state.player._attackCd=Math.max(0,(state.player._attackCd||0)-dt);
}

function worldAI(dt){
  state.tick++;
  chooseBanditTargets();
  state.actors.forEach(function(a){
    if(a.down||a.recruited)return;
    if(a.follow){followActor(a)}
    else if(state.tick%12===0){routeActor(a)}
    moveTowards(a,dt);
  });

  state.actors.filter(function(a){return a.recruited&&!a.down}).forEach(function(a){
    setTarget(a,state.player.x-1.5+rnd(-.5,.5),state.player.y+1+rnd(-.5,.5));
    moveTowards(a,dt);
  });

  if(!state.player.down) moveTowards(state.player,dt);
  combatStep(dt);
}

function simulationTick(){
  if(state.paused)return;
  var now=Date.now(),dt=Math.min(.25,(now-lastTick)/1000);lastTick=now;
  worldAI(dt);
  advance(.55*state.speed);
  state.player.hunger=clamp(state.player.hunger+.018*state.speed,0,100);
  if(state.player.hunger>85 && Math.random()<.03) damagePlayer(1);
  if(state.tick%600===0) state.weather=choice(["乾燥","強風","砂埃","薄曇り"]);
  renderActors();
  renderHud();
  renderContext();
}

function createLandmarks(){
  routeSvg.innerHTML="";
  ROADS.forEach(function(r){
    var a=PLACES[r[0]],b=PLACES[r[1]];
    var line=document.createElementNS("http://www.w3.org/2000/svg","line");
    line.setAttribute("x1",a.x);line.setAttribute("y1",a.y);line.setAttribute("x2",b.x);line.setAttribute("y2",b.y);
    routeSvg.appendChild(line);
  });
  landmarkLayer.innerHTML="";
  Object.keys(PLACES).forEach(function(k){
    var p=PLACES[k],d=document.createElement("div");
    d.className="landmark lm-"+p.kind;d.style.left=p.x+"%";d.style.top=p.y+"%";
    d.innerHTML="<div class='icon'></div><span>"+p.name+"</span>";
    landmarkLayer.appendChild(d);
  });
}

function actorClass(a){
  var cls="actor "+a.type;
  if(a.type==="dog"||a.type==="pack")cls+=" animal";
  if(a.down)cls+=" down";
  if(a.recruited)cls+=" party";
  if(selectedId===a.id)cls+=" selected";
  return cls;
}

function actorTag(a){
  if(a.type==="dog") return "犬";
  if(a.type==="pack") return "荷獣";
  if(a.type==="bandit") return "盗賊";
  if(a.type==="trader") return "商人";
  if(a.type==="guard") return "護衛";
  return "";
}

function renderActors(){
  actorLayer.innerHTML="";
  var p=document.createElement("button");
  p.type="button";p.className="actor player"+(selectedId==="player"?" selected":"")+(state.player.down?" down":"");
  p.style.left=state.player.x+"%";p.style.top=state.player.y+"%";
  p.innerHTML="<span class='head'></span><span class='body'></span><span class='leg1'></span><span class='leg2'></span>";
  p.addEventListener("click",function(e){e.stopPropagation();selectedId="player";openDrawer="";renderAll()});
  actorLayer.appendChild(p);

  state.actors.forEach(function(a){
    var b=document.createElement("button");
    b.type="button";b.className=actorClass(a);b.style.left=a.x+"%";b.style.top=a.y+"%";
    var tag=actorTag(a);
    b.innerHTML=(tag?"<span class='tag'>"+tag+"</span>":"")+"<span class='head'></span><span class='body'></span><span class='leg1'></span><span class='leg2'></span>";
    b.addEventListener("click",function(e){e.stopPropagation();selectedId=a.id;openDrawer="";renderAll()});
    actorLayer.appendChild(b);
  });
}

function renderHud(){
  document.getElementById("clock").textContent=state.day+"日目 "+pad(state.hour)+":"+pad(Math.floor(state.minute));
  document.getElementById("weather").textContent=state.weather;
  document.getElementById("hpText").textContent=Math.round(state.player.hp)+"/"+state.player.maxHp;
  document.getElementById("hpBar").style.width=(state.player.hp/state.player.maxHp*100)+"%";
  document.getElementById("hungerText").textContent=Math.round(state.player.hunger);
  document.getElementById("moneyText").textContent=state.player.money;
  document.getElementById("pauseBtn").textContent=state.paused?"再開":"一時停止";
  document.getElementById("speedBtn").textContent="×"+state.speed;
  document.getElementById("hint").textContent="地面をタップして移動";
}

function clearContext(){
  document.getElementById("context").classList.remove("show");
  document.getElementById("contextText").innerHTML="";
  document.getElementById("contextActions").innerHTML="";
}

function addContextButton(label,fn,disabled){
  var b=document.createElement("button");b.type="button";b.textContent=label;b.disabled=!!disabled;b.addEventListener("click",fn);return b;
}

function nearbyLandmark(){
  var n=nearestPlace(state.player);return n.d<7?n.key:null;
}

function healActor(a){
  if(state.player.med<=0||!a.down)return;
  state.player.med--;a.down=false;a.hp=Math.max(30,Math.round(a.maxHp*.35));
  state.relations[a.faction]=(state.relations[a.faction]||0)+4;log(a.name+"を治療した。");renderAll();
}
function lootActor(a){
  if(!a.down||a.loot<=0)return;
  var gain=a.loot;a.loot=0;state.player.money+=gain;
  if(Math.random()<.4)state.player.scrap++;log(a.name+"から"+gain+"を回収した。");renderAll();
}
function recruitActor(a){
  if(a.down||a.faction!=="無所属"||state.player.money<50)return;
  state.player.money-=50;a.recruited=true;a.faction="主人公";a.follow=null;a.route=null;state.party.push(a.id);
  if(a.id==="wanderer"){
    var dog=getActor("dog");if(dog&&!dog.down){dog.recruited=true;dog.faction="主人公";state.party.push("dog")}
  }
  log(a.name+"が仲間になった。");renderAll();
}
function buyFood(){if(state.player.money<12)return;state.player.money-=12;state.player.food++;log("保存食を買った。");renderAll()}
function buyMed(){if(state.player.money<28)return;state.player.money-=28;state.player.med++;log("治療具を買った。");renderAll()}
function sellOre(){if(state.player.ore<=0)return;var v=state.player.ore*13;state.player.money+=v;state.player.ore=0;log("鉄鉱石を"+v+"で売った。");renderAll()}
function sellScrap(){if(state.player.scrap<=0)return;var v=state.player.scrap*9;state.player.money+=v;state.player.scrap=0;log("廃材を"+v+"で売った。");renderAll()}
function eat(){if(state.player.food<=0)return;state.player.food--;state.player.hunger=clamp(state.player.hunger-38,0,100);log("保存食を食べた。");renderAll()}
function selfHeal(){if(state.player.med<=0||state.player.hp>=state.player.maxHp)return;state.player.med--;state.player.hp=clamp(state.player.hp+35,0,state.player.maxHp);state.player.down=false;log("治療した。");renderAll()}
function mine(){state.player.ore+=1+Math.floor(Math.random()*3);state.player.hunger=clamp(state.player.hunger+4,0,100);advance(40);log("鉄鉱石を採掘した。");renderAll()}
function scavenge(){
  var r=Math.random();if(r<.38){state.player.scrap++;log("廃材を見つけた。")}else if(r<.62){state.player.food++;log("保存食を見つけた。")}
  else if(r<.78){state.player.med++;log("治療具を見つけた。")}else log("使える物はなかった。");
  advance(30);renderAll();
}
function farm(){state.player.money+=10;state.player.food++;advance(50);state.relations["南農場"]++;log("農作業を手伝った。");renderAll()}
function rest(){state.player.hp=clamp(state.player.hp+40,0,state.player.maxHp);state.player.down=false;advance(180);log("休息した。");renderAll()}

function renderContext(){
  var box=document.getElementById("context"),txt=document.getElementById("contextText"),acts=document.getElementById("contextActions");
  txt.innerHTML="";acts.innerHTML="";

  if(selectedId && selectedId!=="player"){
    var a=getActor(selectedId);
    if(!a){clearContext();return}
    var d=dist(state.player,a);
    txt.innerHTML="<b>"+a.name+"</b><br>"+a.faction+" ／ HP "+Math.round(a.hp)+"/"+a.maxHp+(d>8?" ／ 遠い":"");
    if(d<=8){
      if(a.down){
        acts.appendChild(addContextButton("治療",function(){healActor(a)},state.player.med<=0||a.faction==="砂盗賊"));
        acts.appendChild(addContextButton("漁る",function(){lootActor(a)},a.loot<=0));
      }else if(a.faction==="無所属" && (a.type==="wanderer")){
        acts.appendChild(addContextButton("雇う 50",function(){recruitActor(a)},state.player.money<50));
      }else if(a.type==="trader"){
        acts.appendChild(addContextButton("食料 12",buyFood,state.player.money<12));
        acts.appendChild(addContextButton("治療具 28",buyMed,state.player.money<28));
        acts.appendChild(addContextButton("鉱石売却",sellOre,state.player.ore<=0));
        acts.appendChild(addContextButton("廃材売却",sellScrap,state.player.scrap<=0));
      }else if(a.faction==="砂盗賊"){
        acts.appendChild(addContextButton("攻撃",function(){state.player.attackTarget=a.id;selectedId="player";renderAll()},false));
      }
    }
    box.classList.add("show");return;
  }

  var place=nearbyLandmark();
  if(place){
    var p=PLACES[place];
    txt.innerHTML="<b>"+p.name+"</b><br>近くにいる";
    if(place==="mine")acts.appendChild(addContextButton("採掘",mine,false));
    if(place==="ruins"||place==="salt"||place==="cross")acts.appendChild(addContextButton("漁る",scavenge,false));
    if(place==="farm"){acts.appendChild(addContextButton("農作業",farm,false));acts.appendChild(addContextButton("休息",rest,false))}
    if(place==="dust"){acts.appendChild(addContextButton("休息",rest,false))}
    box.classList.add("show");return;
  }
  clearContext();
}

function renderInventory(){
  drawer.innerHTML="<div class='drawerGrid'>"+
    "<div class='cell'>食料<b>"+state.player.food+"</b></div>"+
    "<div class='cell'>治療具<b>"+state.player.med+"</b></div>"+
    "<div class='cell'>鉄鉱石<b>"+state.player.ore+"</b></div>"+
    "<div class='cell'>廃材<b>"+state.player.scrap+"</b></div>"+
    "</div><div class='drawerActions'><button id='eatBtn'>食べる</button><button id='healBtn'>治療</button></div>";
  drawer.querySelector("#eatBtn").addEventListener("click",eat);
  drawer.querySelector("#healBtn").addEventListener("click",selfHeal);
}
function renderParty(){
  var html="<div class='drawerGrid'><div class='cell'>主人公<b>"+Math.round(state.player.hp)+"/"+state.player.maxHp+"</b></div>";
  state.party.filter(function(id){return id!=="player"}).forEach(function(id){
    var a=getActor(id);if(a)html+="<div class='cell'>"+a.name+"<b>"+Math.round(a.hp)+"/"+a.maxHp+"</b></div>";
  });
  html+="</div>";drawer.innerHTML=html;
}
function renderWorldDrawer(){
  var near=aliveActors().filter(function(a){return dist(a,state.player)<16}).sort(function(a,b){return dist(a,state.player)-dist(b,state.player)}).slice(0,8);
  drawer.innerHTML="<div class='log'>"+(near.length?near.map(function(a){return "<div>"+a.name+" ／ "+a.faction+" ／ 約"+Math.round(dist(a,state.player))+"</div>"}).join(""):"<div>近くに人影はない。</div>")+"</div>";
}
function renderLog(){
  drawer.innerHTML="<div class='log'>"+state.log.slice(0,14).map(function(x){return "<div>"+x+"</div>"}).join("")+"</div>";
}
function renderDrawer(){
  drawer.classList.toggle("show",!!openDrawer);
  if(!openDrawer){drawer.innerHTML="";return}
  if(openDrawer==="inventory")renderInventory();
  else if(openDrawer==="party")renderParty();
  else if(openDrawer==="world")renderWorldDrawer();
  else renderLog();
}

function renderAll(){renderActors();renderHud();renderContext();renderDrawer()}

function worldTap(e){
  if(state.player.down)return;
  var rect=world.getBoundingClientRect();
  var x=(e.clientX-rect.left)/rect.width*100,y=(e.clientY-rect.top)/rect.height*100;
  state.player.target={x:clamp(x,2,98),y:clamp(y,3,97)};
  state.player.attackTarget=null;selectedId="player";openDrawer="";renderAll();
}

function save(show){
  try{localStorage.setItem(SAVE_KEY,JSON.stringify(state));if(show)log("セーブした。")}catch(e){if(show)log("セーブに失敗した。")}
  if(show)renderAll();
}
function load(){
  try{
    var raw=localStorage.getItem(SAVE_KEY);
    if(!raw){log("セーブデータがない。");renderAll();return}
    state=JSON.parse(raw);
    if(!Number.isFinite(state.player.speed)) state.player.speed=1.7;
    if(!Number.isFinite(state.player.x)||!Number.isFinite(state.player.y)){state.player.x=18;state.player.y=24;state.player.target=null;}
    selectedId="player";openDrawer="";log("ロードした。");renderAll();
  }catch(e){state=freshState();log("セーブデータを読み込めなかった。");renderAll()}
}

function init(){
  createLandmarks();
  world.addEventListener("click",worldTap);
  document.getElementById("pauseBtn").addEventListener("click",function(){state.paused=!state.paused;lastTick=Date.now();renderAll()});
  document.getElementById("speedBtn").addEventListener("click",function(){state.speed=state.speed===1?2:(state.speed===2?4:1);renderHud()});
  document.getElementById("saveBtn").addEventListener("click",function(){save(true)});
  document.getElementById("loadBtn").addEventListener("click",load);
  document.querySelectorAll("[data-drawer]").forEach(function(b){
    b.addEventListener("click",function(){
      var v=b.getAttribute("data-drawer");openDrawer=openDrawer===v?"":v;selectedId="player";renderAll();
    });
  });

  var isNew=new URLSearchParams(location.search).get("new")==="1";
  if(!isNew){
    try{
      var raw=localStorage.getItem(SAVE_KEY);
      if(raw){
        state=JSON.parse(raw);
        if(!Number.isFinite(state.player.speed)) state.player.speed=1.7;
        if(!Number.isFinite(state.player.x)||!Number.isFinite(state.player.y)){state.player.x=18;state.player.y=24;state.player.target=null;}
      }
    }catch(e){}
  }else localStorage.removeItem(SAVE_KEY);

  renderAll();
  lastTick=Date.now();
  simTimer=setInterval(simulationTick,120);
}

init();
})();