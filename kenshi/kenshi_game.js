(function(){
"use strict";

var SAVE_KEY="iroiro_kenshi_save_v2";

var fieldStage=document.getElementById("fieldStage");
var fieldObjects=document.getElementById("fieldObjects");
var contextActions=document.getElementById("contextActions");
var resultToast=document.getElementById("resultToast");
var hotbar=document.getElementById("hotbar");
var mapOverlay=document.getElementById("mapOverlay");
var panelOverlay=document.getElementById("panelOverlay");
var panelContent=document.getElementById("panelContent");

var manual={x:0,y:0};
var activePanel="inventory";
var contextSignature=null;
var hotbarSignature=null;
var toastTimer=null;
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

var ROADS=[
  ["dust","cross"],["dust","farm"],["cross","mine"],["cross","ruins"],
  ["cross","farm"],["mine","camp"],["ruins","salt"],["ruins","camp"],
  ["farm","salt"],["salt","camp"]
];

function clamp(v,a,b){return Math.max(a,Math.min(b,v))}
function dist(a,b){var dx=a.x-b.x,dy=a.y-b.y;return Math.hypot(dx,dy)}
function rnd(a,b){return a+Math.random()*(b-a)}
function choice(a){return a[Math.floor(Math.random()*a.length)]}
function pad(n){return String(Math.floor(n)).padStart(2,"0")}

function actor(id,name,faction,type,x,y,extra){
  var base={
    id:id,name:name,faction:faction,type:type,x:x,y:y,
    hp:100,maxHp:100,money:20,down:false,target:null,
    speed:rnd(1.05,1.65),group:null,owner:null,follow:null,
    route:null,routeIndex:0,home:null,loot:0,recruited:false,attackCd:0
  };
  return Object.assign(base,extra||{});
}

function freshState(){
  var actors=[];
  actors.push(actor("trader","商人","交易組合","trader",18,20,{money:220,group:"caravan",route:["dust","cross","mine","cross","dust"],routeIndex:1,speed:1.25}));
  actors.push(actor("guard","護衛","交易組合","guard",16.5,21,{hp:120,maxHp:120,group:"caravan",follow:"trader",speed:1.45}));
  actors.push(actor("pack","荷獣","交易組合","pack",15.5,19.5,{hp:130,maxHp:130,group:"caravan",follow:"trader",speed:1.25}));

  actors.push(actor("wanderer","放浪者","無所属","wanderer",48,38,{money:35,route:["cross","ruins","salt","farm","cross"],routeIndex:1,speed:1.15}));
  actors.push(actor("dog","犬","無所属","dog",46.5,39,{hp:80,maxHp:80,owner:"wanderer",follow:"wanderer",speed:1.65}));

  actors.push(actor("miner1","鉱夫","自由民","worker",79,20,{money:24,home:"mine",speed:1.0}));
  actors.push(actor("miner2","鉱夫","自由民","worker",82,21,{money:18,home:"mine",speed:1.0}));
  actors.push(actor("farmer1","農民","南農場","worker",18,59,{money:16,home:"farm",speed:.9}));
  actors.push(actor("farmer2","農民","南農場","worker",22,61,{money:14,home:"farm",speed:.9}));

  actors.push(actor("bandit1","砂盗賊","砂盗賊","bandit",81,81,{money:30,group:"bandits",speed:1.45}));
  actors.push(actor("bandit2","砂盗賊","砂盗賊","bandit",84,83,{money:22,group:"bandits",speed:1.42}));
  actors.push(actor("bandit3","砂盗賊","砂盗賊","bandit",86,80,{money:26,group:"bandits",speed:1.38}));

  return {
    version:4,
    day:1,hour:8,minute:0,
    paused:false,speed:1,weather:"乾燥",tick:0,
    travelDestination:null,
    player:{
      x:18,y:24,hp:100,maxHp:100,hunger:0,money:100,
      food:2,med:1,ore:0,scrap:0,attack:16,defense:4,
      speed:1.7,down:false,target:null,attackTarget:null,_attackCd:0
    },
    actors:actors,
    party:["player"],
    relations:{"交易組合":0,"南農場":0,"自由民":0,"無所属":0,"砂盗賊":-100},
    log:["砂塵街の外から始まった。人々は主人公と無関係に動いている。"]
  };
}

var state=freshState();

function normalizeState(){
  if(!state||!state.player){state=freshState();return}
  if(!Array.isArray(state.actors))state.actors=[];
  if(!Array.isArray(state.party))state.party=["player"];
  if(!state.relations)state.relations={"交易組合":0,"南農場":0,"自由民":0,"無所属":0,"砂盗賊":-100};
  if(!Array.isArray(state.log))state.log=[];
  if(!Number.isFinite(state.speed))state.speed=1;
  if(!Number.isFinite(state.day))state.day=1;
  if(!Number.isFinite(state.hour))state.hour=8;
  if(!Number.isFinite(state.minute))state.minute=0;
  if(!Number.isFinite(state.player.speed))state.player.speed=1.7;
  if(!Number.isFinite(state.player.x)||!Number.isFinite(state.player.y)){
    state.player.x=18;state.player.y=24;state.player.target=null;
  }
  if(!Number.isFinite(state.player._attackCd))state.player._attackCd=0;
  if(state.travelDestination&&!PLACES[state.travelDestination])state.travelDestination=null;
}

function log(msg){
  state.log.unshift(msg);
  state.log=state.log.slice(0,60);
}

function showResult(msg){
  resultToast.textContent=msg;
  resultToast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer=setTimeout(function(){resultToast.classList.remove("show")},1400);
}

function advance(minutes){
  state.minute+=minutes;
  while(state.minute>=60){state.minute-=60;state.hour++}
  while(state.hour>=24){state.hour-=24;state.day++}
}

function getActor(id){
  return state.actors.find(function(a){return a.id===id})||null;
}

function aliveActors(){
  return state.actors.filter(function(a){return !a.down});
}

function nearestPlace(pos){
  var best=null,bd=999;
  Object.keys(PLACES).forEach(function(k){
    var d=dist(pos,PLACES[k]);
    if(d<bd){bd=d;best=k}
  });
  return {key:best,d:bd};
}

function nearbyPlace(){
  var n=nearestPlace(state.player);
  return n.d<5.8?n.key:null;
}

function hostile(a,bFaction){
  if(a.faction==="砂盗賊"&&bFaction!=="砂盗賊")return true;
  if(bFaction==="砂盗賊"&&a.faction!=="砂盗賊")return true;
  return false;
}

function setTarget(a,x,y){
  a.target={x:clamp(x,2,98),y:clamp(y,3,97)};
}

function moveTowards(o,dt){
  if(!o.target)return;
  var dx=o.target.x-o.x,dy=o.target.y-o.y,d=Math.hypot(dx,dy);
  if(!Number.isFinite(d)){o.target=null;return}
  if(d<.22){o.target=null;return}
  var s=Number.isFinite(o.speed)?o.speed:1.4;
  var step=s*dt*state.speed;
  o.x+=dx/d*Math.min(step,d);
  o.y+=dy/d*Math.min(step,d);
  o.x=clamp(o.x,2,98);
  o.y=clamp(o.y,3,97);
}

function routeActor(a){
  if(a.follow)return;
  if(a.route&&(!a.target||dist(a,a.target)<1.8)){
    var key=a.route[a.routeIndex%a.route.length];
    a.routeIndex=(a.routeIndex+1)%a.route.length;
    setTarget(a,PLACES[key].x+rnd(-1.6,1.6),PLACES[key].y+rnd(-1.6,1.6));
    return;
  }
  if(a.home&&(!a.target||dist(a,a.target)<1.3)&&Math.random()<.35){
    var h=PLACES[a.home];
    setTarget(a,h.x+rnd(-4,4),h.y+rnd(-4,4));
    return;
  }
  if(a.type==="bandit"&&(!a.target||dist(a,a.target)<1.8)){
    var p=PLACES[choice(["camp","salt","ruins","cross"])];
    setTarget(a,p.x+rnd(-3,3),p.y+rnd(-3,3));
  }
}

function followActor(a){
  if(!a.follow)return false;
  var lead=getActor(a.follow);
  if(!lead||lead.down)return false;
  var ox=(a.type==="dog"?-2.0:-1.5);
  var oy=(a.type==="dog"?1.3:1.0);
  if(a.type==="pack"){ox=-2.7;oy=-1.1}
  setTarget(a,lead.x+ox,lead.y+oy);
  return true;
}

function chooseBanditTargets(){
  var targets=aliveActors().filter(function(a){
    return a.faction!=="砂盗賊"&&a.type!=="dog"&&a.type!=="pack";
  });

  state.actors.filter(function(a){
    return a.type==="bandit"&&!a.down;
  }).forEach(function(b){
    var best=null,bd=18;
    targets.forEach(function(t){
      var d=dist(b,t);
      if(d<bd){bd=d;best=t}
    });
    var pd=dist(b,state.player);
    if(!state.player.down&&pd<bd){
      best={id:"player",x:state.player.x,y:state.player.y};
      bd=pd;
    }
    if(best)setTarget(b,best.x,best.y);
  });
}

function damagePlayer(amount,from){
  state.player.hp=clamp(state.player.hp-amount,0,state.player.maxHp);
  if(state.player.hp<=0&&!state.player.down){
    state.player.down=true;
    state.player.target=null;
    state.player.attackTarget=null;
    state.travelDestination=null;
    log("主人公が倒れた。");
    showResult("主人公が倒れた");
  }else if(from&&Math.random()<.16){
    log(from.name+"に襲われた。");
  }
}

function damageActor(a,amount,fromName){
  a.hp=clamp(a.hp-amount,0,a.maxHp);
  if(a.hp<=0&&!a.down){
    a.down=true;
    a.target=null;
    a.loot=a.money;
    a.money=0;
    log(a.name+"が倒れた。");
  }else if(fromName&&Math.random()<.12){
    log(fromName+"と"+a.name+"が戦っている。");
  }
}

function combatStep(dt){
  state.actors.forEach(function(a){
    a.attackCd=Math.max(0,(a.attackCd||0)-dt);
  });

  var alive=aliveActors();
  for(var i=0;i<alive.length;i++){
    for(var j=i+1;j<alive.length;j++){
      var a=alive[i],b=alive[j];
      if(!hostile(a,b.faction)||dist(a,b)>3.2)continue;
      if(a.attackCd<=0){
        damageActor(b,Math.floor(rnd(6,15)),a.name);
        a.attackCd=1.4;
      }
      if(b.attackCd<=0&&!b.down){
        damageActor(a,Math.floor(rnd(5,14)),b.name);
        b.attackCd=1.4;
      }
    }
  }

  state.actors.filter(function(a){
    return a.type==="bandit"&&!a.down;
  }).forEach(function(b){
    if(state.player.down||dist(b,state.player)>3.4)return;
    if(b.attackCd<=0){
      damagePlayer(Math.max(1,Math.floor(rnd(7,15)-state.player.defense)),b);
      b.attackCd=1.35;
    }
  });

  if(state.player.attackTarget&&!state.player.down){
    var t=getActor(state.player.attackTarget);
    if(!t||t.down){
      state.player.attackTarget=null;
    }else{
      var d=dist(state.player,t);
      if(d>2.8){
        state.player.target={x:t.x,y:t.y};
      }else{
        state.player.target=null;
        if(state.player._attackCd<=0){
          damageActor(t,Math.floor(rnd(state.player.attack*.7,state.player.attack*1.25)),"主人公");
          state.player._attackCd=1.1;
        }
      }
    }
  }
  state.player._attackCd=Math.max(0,state.player._attackCd-dt);
}

function applyManualMovement(dt){
  var m=Math.hypot(manual.x,manual.y);
  if(m<.05||state.player.down)return false;
  state.travelDestination=null;
  state.player.target=null;
  state.player.attackTarget=null;
  var dx=manual.x/m,dy=manual.y/m;
  var speed=state.player.speed*1.9*state.speed;
  state.player.x=clamp(state.player.x+dx*speed*dt,2,98);
  state.player.y=clamp(state.player.y+dy*speed*dt,3,97);
  return true;
}

function checkTravelArrival(){
  if(!state.travelDestination)return;
  var p=PLACES[state.travelDestination];
  if(!p){state.travelDestination=null;return}
  if(dist(state.player,p)<.8){
    var name=p.name;
    state.travelDestination=null;
    state.player.target=null;
    log(name+"に到着した。");
    showResult(name+" 到着");
  }
}

function worldAI(dt){
  state.tick++;
  chooseBanditTargets();

  state.actors.forEach(function(a){
    if(a.down||a.recruited)return;
    if(a.follow)followActor(a);
    else if(state.tick%12===0)routeActor(a);
    moveTowards(a,dt);
  });

  state.actors.filter(function(a){
    return a.recruited&&!a.down;
  }).forEach(function(a){
    setTarget(a,state.player.x-1.5+rnd(-.45,.45),state.player.y+1+rnd(-.45,.45));
    moveTowards(a,dt);
  });

  if(!applyManualMovement(dt)&&!state.player.down){
    moveTowards(state.player,dt);
  }

  checkTravelArrival();
  combatStep(dt);
}

function simulationTick(){
  var now=Date.now();
  var dt=Math.min(.25,(now-lastTick)/1000);
  lastTick=now;
  if(state.paused){
    renderHud();
    return;
  }

  worldAI(dt);
  advance(.55*state.speed);
  state.player.hunger=clamp(state.player.hunger+.018*state.speed,0,100);
  if(state.player.hunger>85&&Math.random()<.03)damagePlayer(1);
  if(state.tick%600===0)state.weather=choice(["乾燥","強風","砂埃","薄曇り"]);

  renderField();
  renderHud();
  renderContext();
  renderHotbar();
  if(!mapOverlay.hidden)renderWorldMap();
}

function projection(wx,wy){
  var r=fieldStage.getBoundingClientRect();
  var scale=Math.max(8.5,Math.min(r.width,r.height)/31);
  return {
    x:r.width/2+(wx-state.player.x)*scale,
    y:r.height*.56+(wy-state.player.y)*scale,
    scale:scale,w:r.width,h:r.height
  };
}

function roadElement(a,b){
  var pa=projection(a.x,a.y),pb=projection(b.x,b.y);
  if((pa.x<-120&&pb.x<-120)||(pa.x>pa.w+120&&pb.x>pa.w+120)||
     (pa.y<-120&&pb.y<-120)||(pa.y>pa.h+120&&pb.y>pa.h+120))return null;
  var dx=pb.x-pa.x,dy=pb.y-pa.y;
  var d=document.createElement("div");
  d.className="fieldRoad";
  d.style.left=pa.x+"px";
  d.style.top=pa.y+"px";
  d.style.width=Math.hypot(dx,dy)+"px";
  d.style.transform="rotate("+Math.atan2(dy,dx)+"rad)";
  return d;
}

function actorVisual(a){
  if(a.type==="dog"||a.type==="pack"){
    return "<div class='miniAnimal'></div><span class='actorLabel'>"+a.name+"</span>";
  }
  return "<div class='miniHuman'>"+
    "<span class='h'></span><span class='b'></span>"+
    "<span class='a1'></span><span class='a2'></span>"+
    "<span class='l1'></span><span class='l2'></span>"+
    "</div><span class='actorLabel'>"+a.name+"</span>";
}

function renderField(){
  fieldObjects.innerHTML="";

  ROADS.forEach(function(r){
    var el=roadElement(PLACES[r[0]],PLACES[r[1]]);
    if(el)fieldObjects.appendChild(el);
  });

  Object.keys(PLACES).forEach(function(k){
    var p=PLACES[k],q=projection(p.x,p.y);
    if(q.x<-80||q.x>q.w+80||q.y<-80||q.y>q.h+80)return;
    var d=document.createElement("div");
    d.className="fieldLandmark "+p.kind;
    d.style.left=q.x+"px";
    d.style.top=q.y+"px";
    d.innerHTML="<div class='landIcon'></div><span>"+p.name+"</span>";
    fieldObjects.appendChild(d);
  });

  state.actors.forEach(function(a){
    var q=projection(a.x,a.y);
    if(q.x<-70||q.x>q.w+70||q.y<-70||q.y>q.h+70)return;
    var d=document.createElement("div");
    d.className="fieldActor "+a.type+(a.down?" down":"")+(a.recruited?" party":"");
    d.style.left=q.x+"px";
    d.style.top=q.y+"px";
    d.innerHTML=actorVisual(a);
    fieldObjects.appendChild(d);
  });

  document.getElementById("playerFixed").classList.toggle("down",state.player.down);

  var np=nearestPlace(state.player);
  document.getElementById("locationText").textContent=np.d<8?PLACES[np.key].name:"荒野";
  document.getElementById("travelText").textContent=state.travelDestination?("→ "+PLACES[state.travelDestination].name):"";
}

function renderHud(){
  document.getElementById("dayText").textContent=state.day+"日目";
  document.getElementById("clock").textContent=pad(state.hour)+":"+pad(state.minute);
  document.getElementById("weather").textContent=state.weather;
  document.getElementById("hpText").textContent=Math.round(state.player.hp)+"/"+state.player.maxHp;
  document.getElementById("hungerText").textContent=Math.round(state.player.hunger);
  document.getElementById("moneyText").textContent=state.player.money;
  document.getElementById("pauseBtn").textContent=state.paused?"再開":"停止";
  document.getElementById("speedBtn").textContent="×"+state.speed;
}

function actionButton(label,fn,disabled){
  var b=document.createElement("button");
  b.type="button";
  b.textContent=label;
  b.disabled=!!disabled;
  b.addEventListener("click",fn);
  return b;
}

function nearestEncounterActor(){
  var near=state.actors.filter(function(a){
    return dist(a,state.player)<=6.5;
  });
  if(!near.length)return null;
  near.sort(function(a,b){
    var ap=(a.faction==="砂盗賊"&&!a.down)?0:(a.down?1:2);
    var bp=(b.faction==="砂盗賊"&&!b.down)?0:(b.down?1:2);
    if(ap!==bp)return ap-bp;
    return dist(a,state.player)-dist(b,state.player);
  });
  return near[0];
}

function healActor(a){
  if(state.player.med<=0||!a.down)return;
  state.player.med--;
  a.down=false;
  a.hp=Math.max(30,Math.round(a.maxHp*.35));
  state.relations[a.faction]=(state.relations[a.faction]||0)+4;
  log(a.name+"を治療した。");
  showResult(a.name+"を治療");
  renderAll();
}

function lootActor(a){
  if(!a.down||a.loot<=0)return;
  var gain=a.loot;
  a.loot=0;
  state.player.money+=gain;
  if(Math.random()<.4){
    state.player.scrap++;
    log(a.name+"から"+gain+"と廃材1個を回収した。");
    showResult("金 +"+gain+" / 廃材 +1");
  }else{
    log(a.name+"から"+gain+"を回収した。");
    showResult("金 +"+gain);
  }
  renderAll();
}

function recruitActor(a){
  if(a.down||a.faction!=="無所属"||state.player.money<50)return;
  state.player.money-=50;
  a.recruited=true;
  a.faction="主人公";
  a.follow=null;
  a.route=null;
  if(state.party.indexOf(a.id)<0)state.party.push(a.id);

  if(a.id==="wanderer"){
    var dog=getActor("dog");
    if(dog&&!dog.down){
      dog.recruited=true;
      dog.faction="主人公";
      if(state.party.indexOf("dog")<0)state.party.push("dog");
    }
  }

  log(a.name+"が仲間になった。");
  showResult(a.name+"が仲間になった");
  renderAll();
}

function fleeFrom(a){
  if(!a)return;
  manual.x=0;manual.y=0;
  state.travelDestination=null;
  state.player.attackTarget=null;
  var dx=state.player.x-a.x,dy=state.player.y-a.y,d=Math.hypot(dx,dy)||1;
  state.player.target={
    x:clamp(state.player.x+(dx/d)*16,2,98),
    y:clamp(state.player.y+(dy/d)*16,3,97)
  };
  log(a.name+"から逃げた。");
  showResult("逃走");
}

function buyFood(){
  if(state.player.money<12)return;
  state.player.money-=12;
  state.player.food++;
  log("保存食を買った。");
  showResult("食料 +1");
  renderAll();
}

function buyMed(){
  if(state.player.money<28)return;
  state.player.money-=28;
  state.player.med++;
  log("治療具を買った。");
  showResult("治療具 +1");
  renderAll();
}

function sellOre(){
  if(state.player.ore<=0)return;
  var count=state.player.ore,value=count*13;
  state.player.ore=0;
  state.player.money+=value;
  log("鉄鉱石"+count+"個を売った。");
  showResult("金 +"+value);
  renderAll();
}

function sellScrap(){
  if(state.player.scrap<=0)return;
  var count=state.player.scrap,value=count*9;
  state.player.scrap=0;
  state.player.money+=value;
  log("廃材"+count+"個を売った。");
  showResult("金 +"+value);
  renderAll();
}

function eat(){
  if(state.player.food<=0)return;
  state.player.food--;
  state.player.hunger=clamp(state.player.hunger-38,0,100);
  log("保存食を食べた。");
  showResult("空腹 -38");
  renderAll();
}

function selfHeal(){
  if(state.player.med<=0||state.player.hp>=state.player.maxHp)return;
  var before=state.player.hp;
  state.player.med--;
  state.player.hp=clamp(state.player.hp+35,0,state.player.maxHp);
  state.player.down=false;
  log("治療した。");
  showResult("HP +"+Math.round(state.player.hp-before));
  renderAll();
}

function mine(){
  var got=1+Math.floor(Math.random()*3);
  state.player.ore+=got;
  state.player.hunger=clamp(state.player.hunger+4,0,100);
  advance(40);
  log("鉄鉱石を"+got+"個採掘した。");
  showResult("鉄鉱石 +"+got);
  renderAll();
}

function scavenge(){
  var r=Math.random(),msg="";
  if(r<.38){state.player.scrap++;msg="廃材 +1";log("廃材を見つけた。")}
  else if(r<.62){state.player.food++;msg="食料 +1";log("保存食を見つけた。")}
  else if(r<.78){state.player.med++;msg="治療具 +1";log("治療具を見つけた。")}
  else{msg="何も見つからなかった";log("使える物はなかった。")}
  advance(30);
  showResult(msg);
  renderAll();
}

function farm(){
  state.player.money+=10;
  state.player.food++;
  state.relations["南農場"]=(state.relations["南農場"]||0)+1;
  advance(50);
  log("農作業を手伝った。");
  showResult("金 +10 / 食料 +1");
  renderAll();
}

function rest(){
  var before=state.player.hp;
  state.player.hp=clamp(state.player.hp+40,0,state.player.maxHp);
  state.player.down=false;
  advance(180);
  log("休息した。");
  showResult("HP +"+Math.round(state.player.hp-before));
  renderAll();
}

function renderContext(){
  var a=nearestEncounterActor();
  var place=nearbyPlace();
  var sig=[
    state.player.down?1:0,
    a?a.id:"",
    a&&a.down?1:0,
    a?a.faction:"",
    a?a.type:"",
    a?Math.round(a.loot||0):0,
    place||"",
    state.player.med,
    state.player.money,
    state.player.ore,
    state.player.scrap
  ].join("|");

  if(sig===contextSignature)return;
  contextSignature=sig;
  contextActions.innerHTML="";

  if(state.player.down){
    if(place==="dust"||place==="farm"){
      contextActions.appendChild(actionButton("休息",rest,false));
    }
    return;
  }

  if(a){
    if(a.down){
      contextActions.appendChild(actionButton("治療",function(){healActor(a)},state.player.med<=0||a.faction==="砂盗賊"));
      contextActions.appendChild(actionButton("漁る",function(){lootActor(a)},a.loot<=0));
      return;
    }

    if(a.faction==="砂盗賊"){
      contextActions.appendChild(actionButton("戦う",function(){
        state.travelDestination=null;
        state.player.attackTarget=a.id;
        showResult("戦闘");
      },false));
      contextActions.appendChild(actionButton("逃げる",function(){fleeFrom(a)},false));
      return;
    }

    if(a.type==="trader"){
      contextActions.appendChild(actionButton("食料 12",buyFood,state.player.money<12));
      contextActions.appendChild(actionButton("治療具 28",buyMed,state.player.money<28));
      contextActions.appendChild(actionButton("鉱石売却",sellOre,state.player.ore<=0));
      contextActions.appendChild(actionButton("廃材売却",sellScrap,state.player.scrap<=0));
      return;
    }

    if(a.type==="wanderer"&&a.faction==="無所属"){
      contextActions.appendChild(actionButton("雇う 50",function(){recruitActor(a)},state.player.money<50));
      return;
    }
  }

  if(place==="mine"){
    contextActions.appendChild(actionButton("採掘",mine,false));
  }else if(place==="ruins"||place==="salt"||place==="cross"){
    contextActions.appendChild(actionButton("漁る",scavenge,false));
  }else if(place==="farm"){
    contextActions.appendChild(actionButton("農作業",farm,false));
    contextActions.appendChild(actionButton("休息",rest,false));
  }else if(place==="dust"){
    contextActions.appendChild(actionButton("休息",rest,false));
  }
}

function renderHotbar(){
  var sig=[state.player.food,state.player.med,state.player.ore,state.player.scrap].join("|");
  if(sig===hotbarSignature)return;
  hotbarSignature=sig;

  var slots=[
    {name:"食料",count:state.player.food,fn:eat},
    {name:"治療具",count:state.player.med,fn:selfHeal},
    {name:"鉄鉱石",count:state.player.ore},
    {name:"廃材",count:state.player.scrap},
    null
  ];

  hotbar.innerHTML="";
  slots.forEach(function(s){
    var b=document.createElement("button");
    b.type="button";
    b.className="hotbarSlot"+(!s?" empty":"");
    if(s){
      b.innerHTML="<b>"+s.name+"</b><span>"+s.count+"</span>";
      if(s.fn)b.addEventListener("click",s.fn);
    }else{
      b.innerHTML="<b>空き</b><span>·</span>";
      b.disabled=true;
    }
    hotbar.appendChild(b);
  });
}

function renderPanel(){
  document.querySelectorAll("[data-panel]").forEach(function(b){
    b.classList.toggle("active",b.getAttribute("data-panel")===activePanel);
  });

  document.getElementById("panelTitle").textContent=
    activePanel==="inventory"?"持物":
    activePanel==="party"?"部隊":
    activePanel==="faction"?"勢力":"記録";

  if(activePanel==="inventory"){
    panelContent.innerHTML=
      "<div class='panelGrid'>"+
      "<div class='panelItem'><span>食料</span><b>"+state.player.food+"</b></div>"+
      "<div class='panelItem'><span>治療具</span><b>"+state.player.med+"</b></div>"+
      "<div class='panelItem'><span>鉄鉱石</span><b>"+state.player.ore+"</b></div>"+
      "<div class='panelItem'><span>廃材</span><b>"+state.player.scrap+"</b></div>"+
      "</div>"+
      "<div class='panelActions'><button id='panelEat'>食べる</button><button id='panelHeal'>治療</button></div>";
    document.getElementById("panelEat").addEventListener("click",eat);
    document.getElementById("panelHeal").addEventListener("click",selfHeal);
    return;
  }

  if(activePanel==="party"){
    var ph="<div class='panelList'><div class='panelRow'><span>主人公</span><b>HP "+Math.round(state.player.hp)+"/"+state.player.maxHp+"</b></div>";
    state.party.filter(function(id){return id!=="player"}).forEach(function(id){
      var a=getActor(id);
      if(a)ph+="<div class='panelRow'><span>"+a.name+"</span><b>HP "+Math.round(a.hp)+"/"+a.maxHp+"</b></div>";
    });
    panelContent.innerHTML=ph+"</div>";
    return;
  }

  if(activePanel==="faction"){
    var fh="<div class='panelList'>";
    Object.keys(state.relations).forEach(function(k){
      fh+="<div class='panelRow'><span>"+k+"</span><b>"+state.relations[k]+"</b></div>";
    });
    panelContent.innerHTML=fh+"</div>";
    return;
  }

  panelContent.innerHTML="<div class='panelList'>"+
    state.log.slice(0,25).map(function(x){return "<div class='panelRow'><span>"+x+"</span></div>"}).join("")+
    "</div>";
}

function renderWorldMap(){
  var routes=document.getElementById("mapRoutes");
  var places=document.getElementById("mapPlaces");
  var actors=document.getElementById("mapActors");
  var player=document.getElementById("mapPlayerDot");
  var list=document.getElementById("destinationList");

  routes.innerHTML="";
  ROADS.forEach(function(r){
    var a=PLACES[r[0]],b=PLACES[r[1]];
    var line=document.createElementNS("http://www.w3.org/2000/svg","line");
    line.setAttribute("x1",a.x);line.setAttribute("y1",a.y);
    line.setAttribute("x2",b.x);line.setAttribute("y2",b.y);
    routes.appendChild(line);
  });

  places.innerHTML="";
  Object.keys(PLACES).forEach(function(k){
    var p=PLACES[k],d=document.createElement("div");
    d.className="mapPlace";
    d.style.left=p.x+"%";
    d.style.top=p.y+"%";
    d.textContent=p.name;
    places.appendChild(d);
  });

  actors.innerHTML="";
  state.actors.forEach(function(a){
    var d=document.createElement("div");
    d.className="mapActorDot"+(a.type==="bandit"?" bandit":"")+(a.recruited?" party":"");
    d.style.left=a.x+"%";
    d.style.top=a.y+"%";
    actors.appendChild(d);
  });

  player.style.left=state.player.x+"%";
  player.style.top=state.player.y+"%";

  var nearest=nearestPlace(state.player).key;
  list.innerHTML="";
  Object.keys(PLACES).forEach(function(k){
    var p=PLACES[k],b=document.createElement("button");
    b.type="button";
    b.textContent=p.name;
    if(k===nearest)b.classList.add("current");
    if(k===state.travelDestination)b.classList.add("traveling");
    b.addEventListener("click",function(){
      startTravel(k);
      mapOverlay.hidden=true;
    });
    list.appendChild(b);
  });
}

function startTravel(key){
  var p=PLACES[key];
  if(!p||state.player.down)return;
  manual.x=0;manual.y=0;
  state.travelDestination=key;
  state.player.attackTarget=null;
  state.player.target={x:p.x,y:p.y};
  log(p.name+"へ向かった。");
  showResult(p.name+"へ移動");
  renderHud();
}

var fieldPointer=null;
var FIELD_DRAG_DEADZONE=8;
var FIELD_DRAG_RADIUS=64;
var FIELD_TAP_MAX_MS=450;

function stopMovement(show){
  manual.x=0;manual.y=0;
  state.player.target=null;
  state.player.attackTarget=null;
  state.travelDestination=null;
  if(show)showResult("停止");
}

function isFieldUiTarget(target){
  if(!(target instanceof Element))return false;
  return Boolean(target.closest("button,a,.contextActions"));
}

function cancelAutoForManual(){
  state.travelDestination=null;
  state.player.target=null;
  state.player.attackTarget=null;
}

function beginFieldMove(e){
  if(state.player.down||isFieldUiTarget(e.target))return;
  if(e.pointerType==="mouse"&&e.button!==0)return;
  e.preventDefault();
  fieldStage.setPointerCapture(e.pointerId);
  fieldPointer={
    id:e.pointerId,
    startX:e.clientX,
    startY:e.clientY,
    lastX:e.clientX,
    lastY:e.clientY,
    startedAt:performance.now(),
    dragging:false
  };
}

function moveFieldMove(e){
  if(!fieldPointer||e.pointerId!==fieldPointer.id)return;
  e.preventDefault();
  fieldPointer.lastX=e.clientX;
  fieldPointer.lastY=e.clientY;

  var dx=e.clientX-fieldPointer.startX;
  var dy=e.clientY-fieldPointer.startY;
  var d=Math.hypot(dx,dy);

  if(!fieldPointer.dragging&&d>=FIELD_DRAG_DEADZONE){
    fieldPointer.dragging=true;
    cancelAutoForManual();
  }
  if(!fieldPointer.dragging)return;

  var scale=Math.max(FIELD_DRAG_RADIUS,d);
  manual.x=clamp(dx/scale,-1,1);
  manual.y=clamp(dy/scale,-1,1);
}

function screenToWorld(clientX,clientY){
  var r=fieldStage.getBoundingClientRect();
  var scale=Math.max(8.5,Math.min(r.width,r.height)/31);
  return {
    x:clamp(state.player.x+(clientX-r.left-r.width/2)/scale,2,98),
    y:clamp(state.player.y+(clientY-r.top-r.height*.56)/scale,3,97)
  };
}

function tapFieldMove(clientX,clientY){
  if(state.player.down)return;
  var target=screenToWorld(clientX,clientY);
  manual.x=0;manual.y=0;
  state.travelDestination=null;
  state.player.attackTarget=null;
  state.player.target=target;
}

function endFieldMove(e){
  if(!fieldPointer||e.pointerId!==fieldPointer.id)return;
  e.preventDefault();

  var p=fieldPointer;
  var dx=e.clientX-p.startX;
  var dy=e.clientY-p.startY;
  var d=Math.hypot(dx,dy);
  var elapsed=performance.now()-p.startedAt;

  fieldPointer=null;

  if(p.dragging){
    manual.x=0;manual.y=0;
    return;
  }

  if(d<FIELD_DRAG_DEADZONE&&elapsed<=FIELD_TAP_MAX_MS){
    tapFieldMove(e.clientX,e.clientY);
  }
}

function cancelFieldMove(e){
  if(fieldPointer&&(!e||e.pointerId===fieldPointer.id)){
    fieldPointer=null;
  }
  manual.x=0;manual.y=0;
}

function save(show){
  try{
    localStorage.setItem(SAVE_KEY,JSON.stringify(state));
    if(show){
      log("セーブした。");
      showResult("セーブ");
    }
  }catch(e){
    if(show)showResult("セーブ失敗");
  }
}

function load(){
  try{
    var raw=localStorage.getItem(SAVE_KEY);
    if(!raw){showResult("セーブなし");return}
    state=JSON.parse(raw);
    normalizeState();
    contextSignature=null;
    hotbarSignature=null;
    manual.x=0;manual.y=0;
    log("ロードした。");
    showResult("ロード");
    renderAll();
  }catch(e){
    state=freshState();
    contextSignature=null;
    hotbarSignature=null;
    showResult("ロード失敗");
    renderAll();
  }
}

function openPanel(panel){
  activePanel=panel||"inventory";
  renderPanel();
  panelOverlay.hidden=false;
}

function renderAll(){
  renderField();
  renderHud();
  renderContext();
  renderHotbar();
  renderPanel();
  if(!mapOverlay.hidden)renderWorldMap();
}

function init(){
  var isNew=new URLSearchParams(location.search).get("new")==="1";
  if(isNew){
    localStorage.removeItem(SAVE_KEY);
    state=freshState();
  }else{
    try{
      var raw=localStorage.getItem(SAVE_KEY);
      if(raw)state=JSON.parse(raw);
    }catch(e){}
  }
  normalizeState();

  fieldStage.addEventListener("pointerdown",beginFieldMove,{passive:false});
  fieldStage.addEventListener("pointermove",moveFieldMove,{passive:false});
  fieldStage.addEventListener("pointerup",endFieldMove,{passive:false});
  fieldStage.addEventListener("pointercancel",cancelFieldMove);

  document.getElementById("mapBtn").addEventListener("click",function(){
    cancelFieldMove();
    renderWorldMap();
    mapOverlay.hidden=false;
  });
  document.getElementById("closeMapBtn").addEventListener("click",function(){mapOverlay.hidden=true});

  document.getElementById("inventoryBtn").addEventListener("click",function(){cancelFieldMove();openPanel("inventory")});
  document.getElementById("partyBtn").addEventListener("click",function(){cancelFieldMove();openPanel("party")});
  document.getElementById("closePanelBtn").addEventListener("click",function(){panelOverlay.hidden=true});

  document.querySelectorAll("[data-panel]").forEach(function(b){
    b.addEventListener("click",function(){
      activePanel=b.getAttribute("data-panel");
      renderPanel();
    });
  });

  document.getElementById("quickMenuBtn").addEventListener("click",function(){
    var q=document.getElementById("quickMenu");
    q.hidden=!q.hidden;
  });
  document.getElementById("saveBtn").addEventListener("click",function(){
    save(true);
    document.getElementById("quickMenu").hidden=true;
  });
  document.getElementById("loadBtn").addEventListener("click",function(){
    load();
    document.getElementById("quickMenu").hidden=true;
  });

  document.getElementById("pauseBtn").addEventListener("click",function(){
    state.paused=!state.paused;
    lastTick=Date.now();
    renderHud();
  });

  document.getElementById("speedBtn").addEventListener("click",function(){
    state.speed=state.speed===1?2:(state.speed===2?4:1);
    renderHud();
  });

  window.addEventListener("blur",cancelFieldMove);
  window.addEventListener("resize",function(){cancelFieldMove();renderField()});

  renderAll();
  lastTick=Date.now();
  simTimer=setInterval(simulationTick,120);
}

init();
})();