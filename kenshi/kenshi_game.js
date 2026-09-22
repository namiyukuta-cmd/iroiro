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
var tapMarker={x:0,y:0,active:false};
var activePanel="inventory";
var autoWork={type:null,nextAt:0};
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

var SHOPS={
  dust:{name:"雑貨店",food:12,med:28,sword:90,armor:120,sellOre:true,sellScrap:true},
  cross:{name:"交易所",food:14,med:25,sword:95,armor:115,sellOre:true,sellScrap:true},
  farm:{name:"売店",food:8,med:30,sword:null,armor:null,sellOre:false,sellScrap:true},
  mine:{name:"補給所",food:16,med:24,sword:85,armor:null,sellOre:true,sellScrap:true}
};

var QUESTS={
  ore_delivery:{
    title:"鉄鉱石の納品",
    desc:"鉄鉱石を8個集めて砂塵街へ届ける。",
    acceptPlace:"dust",turnPlace:"dust",type:"resource",item:"ore",need:8,
    reward:120,faction:"交易組合",relation:4
  },
  scrap_recovery:{
    title:"廃材の回収",
    desc:"廃材を6個集めて十字路へ持ち帰る。",
    acceptPlace:"cross",turnPlace:"cross",type:"resource",item:"scrap",need:6,
    reward:95,faction:"自由民",relation:3
  },
  bandit_bounty:{
    title:"砂盗賊の賞金",
    desc:"砂盗賊を2人倒して砂塵街へ報告する。",
    acceptPlace:"dust",turnPlace:"dust",type:"kill",need:2,
    reward:180,faction:"交易組合",relation:6
  },
  field_medic:{
    title:"負傷者の救護",
    desc:"砂盗賊以外の負傷者を2人治療し、南農場へ報告する。",
    acceptPlace:"farm",turnPlace:"farm",type:"heal",need:2,
    reward:110,faction:"南農場",relation:5
  }
};

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

var ENEMY_FACTIONS={
  "砂盗賊":true,
  "野盗":true,
  "飢えた盗賊":true,
  "野犬":true
};

var POPULATION_RULES={
  sand:{min:6,max:10,groupMin:2,groupMax:4},
  outlaw:{min:4,max:8,groupMin:2,groupMax:3},
  hungry:{min:4,max:8,groupMin:2,groupMax:4},
  wildDog:{min:3,max:6,groupMin:2,groupMax:3},
  guard:{min:3,max:5,groupMin:1,groupMax:1},
  wanderer:{min:3,max:5,groupMin:1,groupMax:1},
  miner:{min:3,max:5,groupMin:1,groupMax:1},
  farmer:{min:3,max:5,groupMin:1,groupMax:1}
};

function isEnemyActor(a){
  return !!(a&&ENEMY_FACTIONS[a.faction]);
}

function populationKind(a){
  if(!a||a.recruited)return null;
  if(a.faction==="砂盗賊")return "sand";
  if(a.faction==="野盗")return "outlaw";
  if(a.faction==="飢えた盗賊")return "hungry";
  if(a.faction==="野犬")return "wildDog";
  if(a.type==="guard")return "guard";
  if(a.type==="wanderer"&&a.faction==="無所属")return "wanderer";
  if(a.type==="worker"&&a.home==="mine")return "miner";
  if(a.type==="worker"&&a.home==="farm")return "farmer";
  return null;
}

function spawnPoint(kind){
  var p;
  if(kind==="sand"){
    p=Math.random()<.65?PLACES.camp:null;
    if(p)return {x:clamp(p.x+rnd(-5,5),2,98),y:clamp(p.y+rnd(-5,5),3,97)};
  }
  if(kind==="outlaw"){
    p=choice([PLACES.ruins,PLACES.salt,PLACES.cross]);
    return {x:clamp(p.x+rnd(-7,7),2,98),y:clamp(p.y+rnd(-7,7),3,97)};
  }
  if(kind==="hungry"){
    p=choice([PLACES.farm,PLACES.cross,PLACES.dust]);
    return {x:clamp(p.x+rnd(-8,8),2,98),y:clamp(p.y+rnd(-8,8),3,97)};
  }
  if(kind==="guard"){
    p=choice([PLACES.dust,PLACES.cross]);
    return {x:clamp(p.x+rnd(-3,3),2,98),y:clamp(p.y+rnd(-3,3),3,97)};
  }
  if(kind==="wanderer"){
    p=choice([PLACES.cross,PLACES.dust,PLACES.farm]);
    return {x:clamp(p.x+rnd(-5,5),2,98),y:clamp(p.y+rnd(-5,5),3,97)};
  }
  if(kind==="miner"){
    p=PLACES.mine;
    return {x:clamp(p.x+rnd(-4,4),2,98),y:clamp(p.y+rnd(-4,4),3,97)};
  }
  if(kind==="farmer"){
    p=PLACES.farm;
    return {x:clamp(p.x+rnd(-4,4),2,98),y:clamp(p.y+rnd(-4,4),3,97)};
  }

  var edge=Math.floor(Math.random()*4);
  if(edge===0)return {x:2,y:rnd(8,92)};
  if(edge===1)return {x:98,y:rnd(8,92)};
  if(edge===2)return {x:rnd(8,92),y:3};
  return {x:rnd(8,92),y:97};
}

function createPopulationActor(kind){
  state.spawnSerial=(state.spawnSerial||1)+1;
  var id="spawn_"+kind+"_"+state.spawnSerial;
  var p=spawnPoint(kind);
  if(kind==="sand")return actor(id,"砂盗賊","砂盗賊","bandit",p.x,p.y,{money:Math.floor(rnd(16,36)),group:"sand_spawn",speed:rnd(1.3,1.55)});
  if(kind==="outlaw")return actor(id,"野盗","野盗","bandit",p.x,p.y,{money:Math.floor(rnd(10,28)),group:"outlaw_spawn",speed:rnd(1.25,1.5),hp:90,maxHp:90});
  if(kind==="hungry")return actor(id,"飢えた盗賊","飢えた盗賊","bandit",p.x,p.y,{money:Math.floor(rnd(2,14)),group:"hungry_spawn",speed:rnd(1.2,1.45),hp:78,maxHp:78});
  if(kind==="wildDog")return actor(id,"野犬","野犬","dog",p.x,p.y,{money:0,group:"wilddog_spawn",speed:rnd(1.5,1.8),hp:68,maxHp:68});
  if(kind==="guard")return actor(id,"衛兵","交易組合","guard",p.x,p.y,{money:Math.floor(rnd(18,35)),route:["dust","cross","dust"],routeIndex:1,speed:1.25,hp:115,maxHp:115});
  if(kind==="wanderer")return actor(id,"旅人","無所属","wanderer",p.x,p.y,{money:Math.floor(rnd(12,42)),route:["cross","ruins","farm","dust","cross"],routeIndex:1,speed:rnd(1.05,1.3)});
  if(kind==="miner")return actor(id,"鉱夫","自由民","worker",p.x,p.y,{money:Math.floor(rnd(10,28)),home:"mine",speed:1.0});
  return actor(id,"農民","南農場","worker",p.x,p.y,{money:Math.floor(rnd(8,22)),home:"farm",speed:.9});
}

function countPopulation(kind){
  return state.actors.filter(function(a){
    return !a.down&&!a.recruited&&populationKind(a)===kind;
  }).length;
}

function ensurePopulation(fillToMinimum){
  Object.keys(POPULATION_RULES).forEach(function(kind){
    var rule=POPULATION_RULES[kind];
    var current=countPopulation(kind);
    if(current>=rule.min||current>=rule.max)return;
    var need=rule.min-current;
    var amount=fillToMinimum?need:Math.min(need,Math.floor(rnd(rule.groupMin,rule.groupMax+1)));
    amount=Math.min(amount,rule.max-current);
    for(var i=0;i<amount;i++)state.actors.push(createPopulationActor(kind));
  });
}

function cleanupWorldActors(){
  var now=Date.now();
  state.actors=state.actors.filter(function(a){
    if(!a.down||a.recruited)return true;
    if(!a._downAt)a._downAt=now;
    return now-a._downAt<45000;
  });
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
    version:5,
    day:1,hour:8,minute:0,
    paused:false,speed:1,weather:"乾燥",tick:0,spawnSerial:1,
    travelDestination:null,
    activeQuest:null,
    completedQuests:[],
    player:{
      x:18,y:24,hp:100,maxHp:100,hunger:0,money:100,
      food:2,med:1,ore:0,scrap:0,attack:16,defense:4,
      sword:false,armor:false,
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
  if(!state.relations)state.relations={"交易組合":0,"南農場":0,"自由民":0,"無所属":0,"砂盗賊":-100,"野盗":-100,"飢えた盗賊":-100,"野犬":-100};
  if(!Number.isFinite(state.spawnSerial))state.spawnSerial=1;
  if(!Number.isFinite(state.relations["野盗"]))state.relations["野盗"]=-100;
  if(!Number.isFinite(state.relations["飢えた盗賊"]))state.relations["飢えた盗賊"]=-100;
  if(!Number.isFinite(state.relations["野犬"]))state.relations["野犬"]=-100;
  if(!Array.isArray(state.log))state.log=[];
  if(!Array.isArray(state.completedQuests))state.completedQuests=[];
  if(state.activeQuest&&(!state.activeQuest.id||!QUESTS[state.activeQuest.id]))state.activeQuest=null;
  if(typeof state.player.sword!=="boolean")state.player.sword=false;
  if(typeof state.player.armor!=="boolean")state.player.armor=false;
  state.actors.forEach(function(a){
    if(a.recruited&&!a.job)a.job="follow";
    if(!Number.isFinite(a.workCd))a.workCd=0;
  });
  if(!Number.isFinite(state.speed))state.speed=1;
  if(!Number.isFinite(state.tick))state.tick=0;
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
  var aEnemy=!!ENEMY_FACTIONS[a.faction];
  var bEnemy=!!ENEMY_FACTIONS[bFaction];
  if(aEnemy===bEnemy)return false;
  return aEnemy||bEnemy;
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
  if(isEnemyActor(a)&&(!a.target||dist(a,a.target)<1.8)){
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
    return !isEnemyActor(a)&&a.type!=="pack";
  });

  state.actors.filter(function(a){
    return isEnemyActor(a)&&!a.down;
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

function markAttack(attacker,target){
  var now=Date.now();
  if(attacker){
    attacker._attackUntil=now+260;
    attacker._combatUntil=now+2600;
  }
  if(target)target._combatUntil=now+2600;
}

function markHit(target,amount){
  var now=Date.now();
  target._hitUntil=now+300;
  target._damageAt=now;
  target._damageUntil=now+760;
  target._lastDamage=Math.max(1,Math.round(amount));
  target._combatUntil=now+2600;
}

function appendDamagePop(amount,q,at,until){
  if(!amount||!q||!at||!until)return;
  var now=Date.now();
  if(now>=until)return;
  var life=Math.max(1,until-at);
  var p=clamp((now-at)/life,0,1);
  var d=document.createElement("div");
  d.className="damagePop";
  d.textContent="-"+Math.round(amount);
  d.style.left=q.x+"px";
  d.style.top=(q.y-24-p*18)+"px";
  d.style.opacity=String(1-p);
  fieldObjects.appendChild(d);
}

function damagePlayer(amount,from){
  markHit(state.player,amount);
  state.player.hp=clamp(state.player.hp-amount,0,state.player.maxHp);
  if(from&&from.id&&!state.player.attackTarget&&!state.player.target&&!state.travelDestination&&Math.hypot(manual.x,manual.y)<.05){
    state.player.attackTarget=from.id;
  }
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
  markHit(a,amount);
  a.hp=clamp(a.hp-amount,0,a.maxHp);
  if(a.hp<=0&&!a.down){
    a.down=true;
    a._downAt=Date.now();
    a.target=null;
    a.loot=a.money;
    a.money=0;
    if(a.faction==="砂盗賊"&&fromName==="主人公"&&state.activeQuest&&state.activeQuest.id==="bandit_bounty"){
      state.activeQuest.progress=(state.activeQuest.progress||0)+1;
      contextSignature=null;
    }
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
        markAttack(a,b);
        damageActor(b,Math.floor(rnd(6,15)),a.name);
        a.attackCd=1.4;
      }
      if(b.attackCd<=0&&!b.down){
        markAttack(b,a);
        damageActor(a,Math.floor(rnd(5,14)),b.name);
        b.attackCd=1.4;
      }
    }
  }

  state.actors.filter(function(a){
    return isEnemyActor(a)&&!a.down;
  }).forEach(function(b){
    if(state.player.down||dist(b,state.player)>3.4)return;
    if(b.attackCd<=0){
      markAttack(b,state.player);
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
          markAttack(state.player,t);
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
  if(state.tick%80===0)ensurePopulation(false);
  if(state.tick%100===0)cleanupWorldActors();
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
    partyJobStep(a,dt);
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
  if(tapMarker.active&&dist(state.player,tapMarker)<.45){
    clearTapMarker();
  }
  runAutoWork(now,false);
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

function clearTapMarker(){
  tapMarker.active=false;
}

function setTapMarker(x,y){
  tapMarker.x=x;
  tapMarker.y=y;
  tapMarker.active=true;
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
  var hpPct=clamp((a.hp/a.maxHp)*100,0,100);
  var hp=(a._combatUntil||0)>Date.now()&&!a.down
    ?"<div class='actorHp'><i style='width:"+hpPct+"%'></i></div>":"";
  if(a.type==="dog"||a.type==="pack"){
    return hp+"<div class='miniAnimal'></div><span class='actorLabel'>"+a.name+"</span>";
  }
  return hp+"<div class='miniHuman'>"+
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
    var now=Date.now();
    d.className="fieldActor "+a.type+
      (a.down?" down":"")+
      (a.recruited?" party":"")+
      ((a._attackUntil||0)>now?" attacking":"")+
      ((a._hitUntil||0)>now?" hit":"");
    d.style.left=q.x+"px";
    d.style.top=q.y+"px";
    d.innerHTML=actorVisual(a);
    fieldObjects.appendChild(d);
    appendDamagePop(a._lastDamage,q,a._damageAt,a._damageUntil);
  });

  if(tapMarker.active){
    var mq=projection(tapMarker.x,tapMarker.y);
    if(mq.x>-40&&mq.x<mq.w+40&&mq.y>-40&&mq.y<mq.h+40){
      var marker=document.createElement("div");
      marker.className="tapMoveMarker";
      marker.style.left=mq.x+"px";
      marker.style.top=mq.y+"px";
      fieldObjects.appendChild(marker);
    }
  }

  var playerEl=document.getElementById("playerFixed");
  var now=Date.now();
  playerEl.classList.toggle("down",state.player.down);
  playerEl.classList.toggle("attacking",(state.player._attackUntil||0)>now&&!state.player.down);
  playerEl.classList.toggle("hit",(state.player._hitUntil||0)>now&&!state.player.down);
  fieldStage.classList.toggle("combatShake",(state.player._hitUntil||0)>now&&!state.player.down);
  var pq=projection(state.player.x,state.player.y);
  appendDamagePop(state.player._lastDamage,pq,state.player._damageAt,state.player._damageUntil);

  var np=nearestPlace(state.player);
  document.getElementById("locationText").textContent=np.d<8?PLACES[np.key].name:"荒野";
  document.getElementById("travelText").textContent=state.travelDestination?("→ "+PLACES[state.travelDestination].name):"";
}

function renderHud(){
  document.getElementById("dayText").textContent=state.day+"日目";
  document.getElementById("clock").textContent=pad(state.hour)+":"+pad(state.minute);
  document.getElementById("weather").textContent=state.weather;
  var hpNow=Math.round(state.player.hp);
  var hungerNow=Math.round(state.player.hunger);
  document.getElementById("hpText").textContent=hpNow+"/"+state.player.maxHp;
  document.getElementById("hungerText").textContent=hungerNow+"/100";
  document.getElementById("moneyText").textContent=state.player.money;

  var hpPct=clamp((state.player.hp/state.player.maxHp)*100,0,100);
  var hungerPct=clamp(state.player.hunger,0,100);
  document.getElementById("hpBarFill").style.width=hpPct+"%";
  document.getElementById("hungerBarFill").style.width=hungerPct+"%";
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
    var ap=(isEnemyActor(a)&&!a.down)?0:(a.down?1:2);
    var bp=(isEnemyActor(b)&&!b.down)?0:(b.down?1:2);
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
  if(state.activeQuest&&state.activeQuest.id==="field_medic"&&a.faction!=="砂盗賊"){
    state.activeQuest.progress=(state.activeQuest.progress||0)+1;
    contextSignature=null;
  }
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
  a.job="follow";
  a.workCd=0;
  if(state.party.indexOf(a.id)<0)state.party.push(a.id);

  if(a.id==="wanderer"){
    var dog=getActor("dog");
    if(dog&&!dog.down){
      dog.recruited=true;
      dog.faction="主人公";
      dog.job="follow";
      dog.workCd=0;
      if(state.party.indexOf("dog")<0)state.party.push("dog");
    }
  }

  log(a.name+"が仲間になった。");
  showResult(a.name+"が仲間になった");
  renderAll();
}

function fleeFrom(a){
  if(!a)return;
  clearTapMarker();
  stopAutoWork(false);
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

var questBoardPlace=null;
var tradeActorId=null;
var tradePlaceKey=null;

function questProgressValue(q){
  if(!q)return 0;
  var def=QUESTS[q.id];
  if(!def)return 0;
  if(def.type==="resource")return state.player[def.item]||0;
  return q.progress||0;
}

function questReady(){
  if(!state.activeQuest)return false;
  var def=QUESTS[state.activeQuest.id];
  if(!def)return false;
  return questProgressValue(state.activeQuest)>=def.need;
}

function acceptQuest(id){
  var def=QUESTS[id];
  if(!def||state.activeQuest||state.completedQuests.indexOf(id)>=0)return;
  state.activeQuest={id:id,progress:0};
  contextSignature=null;
  log("依頼「"+def.title+"」を受けた。");
  showResult("依頼開始");
  renderPanel();
  renderContext();
}

function completeQuest(){
  if(!state.activeQuest||!questReady())return;
  var def=QUESTS[state.activeQuest.id];
  if(nearbyPlace()!==def.turnPlace){
    showResult(PLACES[def.turnPlace].name+"で報告");
    return;
  }

  if(def.type==="resource"){
    state.player[def.item]=Math.max(0,(state.player[def.item]||0)-def.need);
    hotbarSignature=null;
  }

  state.player.money+=def.reward;
  state.relations[def.faction]=(state.relations[def.faction]||0)+def.relation;
  state.completedQuests.push(state.activeQuest.id);
  log("依頼「"+def.title+"」を完了した。報酬 "+def.reward+"。");
  showResult("報酬 +"+def.reward);
  state.activeQuest=null;
  contextSignature=null;
  renderAll();
}

function openQuestBoard(place){
  questBoardPlace=place||nearbyPlace();
  activePanel="jobs";
  renderPanel();
  panelOverlay.hidden=false;
}

function questBoardHtml(){
  var html="";
  if(state.activeQuest){
    var q=state.activeQuest,def=QUESTS[q.id],p=questProgressValue(q);
    html+="<div class='questCard activeQuest'>"+
      "<b>"+def.title+"</b><span>"+def.desc+"</span>"+
      "<strong>"+Math.min(p,def.need)+" / "+def.need+"</strong>"+
      "<small>報告先： "+PLACES[def.turnPlace].name+"　報酬： "+def.reward+"</small>";
    if(questReady()&&nearbyPlace()===def.turnPlace){
      html+="<button id='questCompleteBtn' type='button'>報告して報酬を受け取る</button>";
    }
    html+="</div>";
  }else{
    html+="<div class='questEmpty'>受注中の依頼はありません。</div>";
  }

  var available=Object.keys(QUESTS).filter(function(id){
    var q=QUESTS[id];
    return q.acceptPlace===questBoardPlace&&state.completedQuests.indexOf(id)<0&&(!state.activeQuest||state.activeQuest.id===id);
  });

  if(!state.activeQuest&&available.length){
    html+="<div class='questSectionTitle'>受けられる依頼</div>";
    available.forEach(function(id){
      var q=QUESTS[id];
      html+="<div class='questCard'>"+
        "<b>"+q.title+"</b><span>"+q.desc+"</span>"+
        "<small>報酬： "+q.reward+"</small>"+
        "<button type='button' data-accept-quest='"+id+"'>受ける</button>"+
        "</div>";
    });
  }else if(!state.activeQuest){
    html+="<div class='questEmpty'>ここでは新しい依頼はありません。</div>";
  }
  return html;
}

function bindQuestPanel(){
  var complete=document.getElementById("questCompleteBtn");
  if(complete)complete.addEventListener("click",completeQuest);
  document.querySelectorAll("[data-accept-quest]").forEach(function(b){
    b.addEventListener("click",function(){acceptQuest(b.getAttribute("data-accept-quest"))});
  });
}

function talkActor(a){
  var lines={
    trader:[
      "商人「鉄鉱石は町でよく売れる。盗賊には気をつけろ。」",
      "商人「荷獣がいると長旅がずいぶん楽になる。」"
    ],
    guard:[
      "護衛「道から外れるなら、逃げ道だけは見ておけ。」",
      "護衛「盗賊は倒れていても仲間が近くにいることがある。」"
    ],
    worker:[
      "鉱夫「採掘は仲間に任せれば、自分は別のことができる。」",
      "農民「南農場じゃ人手がいつも足りない。」"
    ],
    wanderer:[
      "放浪者「金さえ払うなら、一緒に行ってもいい。」",
      "放浪者「犬は俺より鼻が利く。」"
    ],
    dog:["犬は主人公の匂いを嗅いでいる。"],
    pack:["荷獣は重そうな荷を背負っている。"]
  };
  var pool=lines[a.type]||["相手は周囲を警戒している。"];
  var msg=choice(pool);
  log(msg);
  showResult("話した");
}

function openTrade(a){
  tradeActorId=a.id;
  tradePlaceKey=null;
  activePanel="trade";
  renderPanel();
  panelOverlay.hidden=false;
}

function openPlaceShop(place){
  if(!SHOPS[place]||nearbyPlace()!==place)return;
  tradeActorId=null;
  tradePlaceKey=place;
  activePanel="trade";
  renderPanel();
  panelOverlay.hidden=false;
}

function buyFoodAt(price){
  if(state.player.money<price)return;
  state.player.money-=price;
  state.player.food++;
  log("保存食を買った。");
  showResult("食料 +1");
  hotbarSignature=null;
  renderAll();
}

function buyMedAt(price){
  if(state.player.money<price)return;
  state.player.money-=price;
  state.player.med++;
  log("治療具を買った。");
  showResult("治療具 +1");
  hotbarSignature=null;
  renderAll();
}

function buySwordAt(price){
  if(state.player.sword||price==null||state.player.money<price)return;
  state.player.money-=price;
  state.player.sword=true;
  state.player.attack+=4;
  log("簡易剣を買った。攻撃力が4上がった。");
  showResult("簡易剣を装備");
  renderAll();
}

function buyArmorAt(price){
  if(state.player.armor||price==null||state.player.money<price)return;
  state.player.money-=price;
  state.player.armor=true;
  state.player.defense+=3;
  log("革鎧を買った。防御力が3上がった。");
  showResult("革鎧を装備");
  renderAll();
}

/* existing calls remain valid */
function buyFood(){buyFoodAt(12)}
function buyMed(){buyMedAt(28)}
function buySword(){buySwordAt(90)}
function buyArmor(){buyArmorAt(120)}

function renderTradePanel(){
  var profile=null;
  var shopName="行商人";

  if(tradePlaceKey){
    if(nearbyPlace()!==tradePlaceKey||!SHOPS[tradePlaceKey]){
      panelContent.innerHTML="<div class='questEmpty'>店から離れています。</div>";
      return;
    }
    profile=SHOPS[tradePlaceKey];
    shopName=PLACES[tradePlaceKey].name+"・"+profile.name;
  }else{
    var a=getActor(tradeActorId);
    if(!a||a.down||dist(a,state.player)>7){
      panelContent.innerHTML="<div class='questEmpty'>商人が近くにいません。</div>";
      return;
    }
    profile={name:"行商人",food:12,med:28,sword:90,armor:120,sellOre:true,sellScrap:true};
    shopName=a.name;
  }

  var itemHtml=
    "<button id='shopFood' type='button'><b>保存食</b><span>"+profile.food+"</span></button>"+
    "<button id='shopMed' type='button'><b>治療具</b><span>"+profile.med+"</span></button>";

  if(profile.sword!=null){
    itemHtml+="<button id='shopSword' type='button' "+(state.player.sword?"disabled":"")+"><b>簡易剣</b><span>"+(state.player.sword?"装備済":profile.sword)+"</span></button>";
  }
  if(profile.armor!=null){
    itemHtml+="<button id='shopArmor' type='button' "+(state.player.armor?"disabled":"")+"><b>革鎧</b><span>"+(state.player.armor?"装備済":profile.armor)+"</span></button>";
  }

  var sellHtml="";
  if(profile.sellOre)sellHtml+="<button id='shopSellOre' type='button'>鉄鉱石を全部売る</button>";
  if(profile.sellScrap)sellHtml+="<button id='shopSellScrap' type='button'>廃材を全部売る</button>";

  panelContent.innerHTML=
    "<div class='shopName'>"+shopName+"</div>"+
    "<div class='shopGrid'>"+itemHtml+"</div>"+
    (sellHtml?"<div class='panelActions'>"+sellHtml+"</div>":"")+
    "<div class='tradeStats'>攻撃 "+state.player.attack+"　防御 "+state.player.defense+"　所持金 "+state.player.money+"</div>";

  document.getElementById("shopFood").addEventListener("click",function(){buyFoodAt(profile.food);renderPanel()});
  document.getElementById("shopMed").addEventListener("click",function(){buyMedAt(profile.med);renderPanel()});

  var swordBtn=document.getElementById("shopSword");
  if(swordBtn)swordBtn.addEventListener("click",function(){buySwordAt(profile.sword);renderPanel()});

  var armorBtn=document.getElementById("shopArmor");
  if(armorBtn)armorBtn.addEventListener("click",function(){buyArmorAt(profile.armor);renderPanel()});

  var oreBtn=document.getElementById("shopSellOre");
  if(oreBtn)oreBtn.addEventListener("click",function(){sellOre();renderPanel()});

  var scrapBtn=document.getElementById("shopSellScrap");
  if(scrapBtn)scrapBtn.addEventListener("click",function(){sellScrap();renderPanel()});
}

function campRest(withFire){
  stopAutoWork(false);
  if(withFire){
    if(state.player.scrap<1||state.player.food<1){showResult("廃材1・食料1が必要");return}
    state.player.scrap--;
    state.player.food--;
    state.player.hp=clamp(state.player.hp+45,0,state.player.maxHp);
    state.player.hunger=clamp(state.player.hunger-22,0,100);
    advance(360);
    log("焚き火をして野営した。");
    showResult("焚き火で休息");
  }else{
    state.player.hp=clamp(state.player.hp+20,0,state.player.maxHp);
    state.player.hunger=clamp(state.player.hunger+14,0,100);
    advance(300);
    log("荒野で野営した。");
    showResult("野営");
  }
  hotbarSignature=null;
  renderAll();
}

function assignPartyJob(id,job){
  var a=getActor(id);
  if(!a||!a.recruited)return;
  if(a.type==="dog"&&(job==="mine"||job==="farm"||job==="scavenge"))return;
  a.job=job;
  a.target=null;
  a.workCd=0;
  log(a.name+"の仕事を「"+({follow:"追従",mine:"採掘",farm:"農作業",scavenge:"漁り",wait:"待機"}[job]||job)+"」にした。");
  showResult(a.name+"：仕事変更");
  renderPanel();
}

function partyJobStep(a,dt){
  var job=a.job||"follow";
  if(job==="wait"){
    a.target=null;
    return;
  }
  if(job==="follow"||a.type==="dog"){
    setTarget(a,state.player.x-1.5+rnd(-.35,.35),state.player.y+1+rnd(-.35,.35));
    moveTowards(a,dt);
    return;
  }

  var placeKey=job==="mine"?"mine":(job==="farm"?"farm":"ruins");
  var p=PLACES[placeKey];
  if(dist(a,p)>3){
    setTarget(a,p.x+rnd(-1,1),p.y+rnd(-1,1));
    moveTowards(a,dt);
    return;
  }

  a.target=null;
  a.workCd=Math.max(0,(a.workCd||0)-dt*state.speed);
  if(a.workCd>0)return;

  if(job==="mine"){
    state.player.ore++;
    log(a.name+"が鉄鉱石を1個採掘した。");
  }else if(job==="farm"){
    state.player.food++;
    state.player.money+=3;
    log(a.name+"が農作業をした。");
  }else{
    if(Math.random()<.6)state.player.scrap++;
    else state.player.food++;
    log(a.name+"が旧遺跡を漁った。");
  }
  a.workCd=8;
  hotbarSignature=null;
}

function autoWorkLabel(type){
  if(type==="mine")return "採掘";
  if(type==="scavenge")return "漁る";
  if(type==="farm")return "農作業";
  return "";
}

function validAutoWorkPlace(type){
  var place=nearbyPlace();
  if(type==="mine")return place==="mine";
  if(type==="scavenge")return place==="ruins"||place==="salt"||place==="cross";
  if(type==="farm")return place==="farm";
  return false;
}

function stopAutoWork(show){
  if(!autoWork.type)return;
  var label=autoWorkLabel(autoWork.type);
  autoWork.type=null;
  autoWork.nextAt=0;
  contextSignature=null;
  if(show)showResult(label+" 停止");
  renderContext();
}

function startAutoWork(type){
  if(autoWork.type===type){
    stopAutoWork(true);
    return;
  }
  if(!validAutoWorkPlace(type))return;

  autoWork.type=type;
  autoWork.nextAt=0;
  contextSignature=null;
  showResult(autoWorkLabel(type)+" 開始");
  runAutoWork(Date.now(),true);
  renderContext();
}

function runAutoWork(now,force){
  if(!autoWork.type)return;
  if(state.player.down||state.player.attackTarget||state.travelDestination||
     Math.hypot(manual.x,manual.y)>.05||state.player.target){
    stopAutoWork(false);
    return;
  }
  if(!validAutoWorkPlace(autoWork.type)){
    stopAutoWork(false);
    return;
  }
  if(!force&&now<autoWork.nextAt)return;

  var type=autoWork.type;
  if(type==="mine")mine(true);
  else if(type==="scavenge")scavenge(true);
  else if(type==="farm")farm(true);

  autoWork.nextAt=now+1100;
}

function mine(fromAuto){
  var got=1+Math.floor(Math.random()*3);
  state.player.ore+=got;
  state.player.hunger=clamp(state.player.hunger+4,0,100);
  advance(40);
  log("鉄鉱石を"+got+"個採掘した。");
  showResult("鉄鉱石 +"+got);
  hotbarSignature=null;
  if(!fromAuto)renderAll();
}

function scavenge(fromAuto){
  var r=Math.random(),msg="";
  if(r<.38){state.player.scrap++;msg="廃材 +1";log("廃材を見つけた。")}
  else if(r<.62){state.player.food++;msg="食料 +1";log("保存食を見つけた。")}
  else if(r<.78){state.player.med++;msg="治療具 +1";log("治療具を見つけた。")}
  else{msg="何も見つからなかった";log("使える物はなかった。")}
  advance(30);
  showResult(msg);
  hotbarSignature=null;
  if(!fromAuto)renderAll();
}

function farm(fromAuto){
  state.player.money+=10;
  state.player.food++;
  state.relations["南農場"]=(state.relations["南農場"]||0)+1;
  advance(50);
  log("農作業を手伝った。");
  showResult("金 +10 / 食料 +1");
  hotbarSignature=null;
  if(!fromAuto)renderAll();
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

function makeActionRow(label,className){
  var wrap=document.createElement("div");
  wrap.className="actionRow "+className;

  var target=document.createElement("span");
  target.className="actionTarget";
  target.textContent=label;

  var buttons=document.createElement("div");
  buttons.className="actionButtons";

  wrap.appendChild(target);
  wrap.appendChild(buttons);
  return {wrap:wrap,buttons:buttons};
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
    state.player.scrap,
    autoWork.type||"",
    state.activeQuest?state.activeQuest.id:"",
    state.activeQuest?(state.activeQuest.progress||0):0,
    state.player.sword?1:0,
    state.player.armor?1:0
  ].join("|");

  if(sig===contextSignature)return;
  contextSignature=sig;
  contextActions.innerHTML="";

  var actorRow=a?makeActionRow(a.name,"actorRow"):null;
  var placeName=place?PLACES[place].name:"荒野";
  var placeRow=makeActionRow(placeName,"placeRow");
  var actorCount=0;
  var placeCount=0;

  function addActor(label,fn,disabled){
    if(!actorRow)return;
    actorRow.buttons.appendChild(actionButton(label,fn,disabled));
    actorCount++;
  }

  function addPlace(label,fn,disabled){
    placeRow.buttons.appendChild(actionButton(label,fn,disabled));
    placeCount++;
  }

  if(state.player.down){
    if(place==="dust"||place==="farm")addPlace("休息",rest,false);
    if(placeCount)contextActions.appendChild(placeRow.wrap);
    return;
  }

  if(a){
    if(a.down){
      addActor("治療",function(){healActor(a)},state.player.med<=0||isEnemyActor(a));
      addActor("漁る",function(){lootActor(a)},a.loot<=0);
    }else if(isEnemyActor(a)){
      addActor("戦う",function(){
        clearTapMarker();
        stopAutoWork(false);
        state.travelDestination=null;
        state.player.attackTarget=a.id;
        showResult("戦闘");
      },false);
      addActor("逃げる",function(){fleeFrom(a)},false);
    }else if(a.type==="trader"){
      addActor("話す",function(){talkActor(a)},false);
      addActor("取引",function(){openTrade(a)},false);
    }else if(a.type==="wanderer"&&a.faction==="無所属"){
      addActor("話す",function(){talkActor(a)},false);
      addActor("雇う 50",function(){recruitActor(a)},state.player.money<50);
    }else if(a.type==="guard"||a.type==="worker"||a.type==="dog"||a.type==="pack"){
      addActor("話す",function(){talkActor(a)},false);
    }
  }

  if(state.activeQuest){
    var qdef=QUESTS[state.activeQuest.id];
    if(place===qdef.turnPlace&&questReady())addPlace("依頼報告",completeQuest,false);
  }

  if(place==="mine"){
    addPlace(autoWork.type==="mine"?"採掘中・停止":"採掘",function(){startAutoWork("mine")},false);
    addPlace("補給所",function(){openPlaceShop("mine")},false);
    addPlace("依頼",function(){openQuestBoard("mine")},false);
  }else if(place==="ruins"||place==="salt"){
    addPlace(autoWork.type==="scavenge"?"漁り中・停止":"漁る",function(){startAutoWork("scavenge")},false);
  }else if(place==="cross"){
    addPlace(autoWork.type==="scavenge"?"漁り中・停止":"漁る",function(){startAutoWork("scavenge")},false);
    addPlace("交易所",function(){openPlaceShop("cross")},false);
    addPlace("依頼",function(){openQuestBoard("cross")},false);
  }else if(place==="farm"){
    addPlace(autoWork.type==="farm"?"農作業中・停止":"農作業",function(){startAutoWork("farm")},false);
    addPlace("売店",function(){openPlaceShop("farm")},false);
    addPlace("依頼",function(){openQuestBoard("farm")},false);
    addPlace("休息",rest,false);
  }else if(place==="dust"){
    addPlace("雑貨店",function(){openPlaceShop("dust")},false);
    addPlace("依頼",function(){openQuestBoard("dust")},false);
    addPlace("休息",rest,false);
  }else{
    addPlace("野営",function(){campRest(false)},false);
    addPlace("焚き火",function(){campRest(true)},state.player.scrap<1||state.player.food<1);
  }

  if(actorCount)contextActions.appendChild(actorRow.wrap);
  if(placeCount)contextActions.appendChild(placeRow.wrap);
}

function renderHotbar(){
  var sig=[state.player.food,state.player.med,state.player.ore,state.player.scrap].join("|");
  if(sig===hotbarSignature)return;
  hotbarSignature=sig;

  var slots=[
    {name:"食料",count:state.player.food,fn:eat},
    {name:"治療具",count:state.player.med,fn:selfHeal},
    {name:"鉄鉱石",count:state.player.ore},
    {name:"廃材",count:state.player.scrap}
  ];
  while(slots.length<20)slots.push(null);

  hotbar.innerHTML="";
  slots.forEach(function(s){
    var b=document.createElement("button");
    b.type="button";
    b.className="hotbarSlot"+(!s?" empty":"");
    if(s){
      b.setAttribute("aria-label",s.name+" "+s.count+"個");
      b.innerHTML="<b>"+s.name+"</b><span>"+s.count+"</span>";
      if(s.fn)b.addEventListener("click",s.fn);
    }else{
      b.setAttribute("aria-label","空き");
      b.disabled=true;
    }
    hotbar.appendChild(b);
  });
}

function renderPanel(){
  document.querySelectorAll("[data-panel]").forEach(function(b){
    b.classList.toggle("active",b.getAttribute("data-panel")===activePanel);
  });
  document.querySelectorAll("[data-bottom-panel]").forEach(function(b){
    b.classList.toggle("active",b.getAttribute("data-bottom-panel")===activePanel);
  });

  document.getElementById("panelTitle").textContent=
    activePanel==="inventory"?"持物":
    activePanel==="party"?"部隊":
    activePanel==="faction"?"勢力":
    activePanel==="jobs"?"依頼":
    activePanel==="trade"?"取引":"記録";

  if(activePanel==="jobs"){
    panelContent.innerHTML=questBoardHtml();
    bindQuestPanel();
    return;
  }

  if(activePanel==="trade"){
    renderTradePanel();
    return;
  }

  if(activePanel==="inventory"){
    panelContent.innerHTML=
      "<div class='panelGrid'>"+
      "<div class='panelItem'><span>食料</span><b>"+state.player.food+"</b></div>"+
      "<div class='panelItem'><span>治療具</span><b>"+state.player.med+"</b></div>"+
      "<div class='panelItem'><span>鉄鉱石</span><b>"+state.player.ore+"</b></div>"+
      "<div class='panelItem'><span>廃材</span><b>"+state.player.scrap+"</b></div>"+
      "</div>"+
      "<div class='equipmentLine'>装備："+(state.player.sword?"簡易剣 ":"")+(state.player.armor?"革鎧":"")+(state.player.sword||state.player.armor?"":"なし")+"　攻撃 "+state.player.attack+"　防御 "+state.player.defense+"</div>"+
      "<div class='panelActions'><button id='panelEat'>食べる</button><button id='panelHeal'>治療</button></div>";
    document.getElementById("panelEat").addEventListener("click",eat);
    document.getElementById("panelHeal").addEventListener("click",selfHeal);
    return;
  }

  if(activePanel==="party"){
    var ph="<div class='panelList'><div class='panelRow'><span>主人公</span><b>HP "+Math.round(state.player.hp)+"/"+state.player.maxHp+"</b></div>";
    state.party.filter(function(id){return id!=="player"}).forEach(function(id){
      var a=getActor(id);
      if(!a)return;
      var job=a.job||"follow";
      ph+="<div class='partyJobCard'><div class='panelRow'><span>"+a.name+"</span><b>HP "+Math.round(a.hp)+"/"+a.maxHp+"</b></div>"+
        "<small>仕事："+({follow:"追従",mine:"採掘",farm:"農作業",scavenge:"漁り",wait:"待機"}[job]||job)+"</small>"+
        "<div class='jobButtons'>"+
          "<button data-job-id='"+a.id+"' data-job='follow'>追従</button>"+
          (a.type==="dog"?"":"<button data-job-id='"+a.id+"' data-job='mine'>採掘</button><button data-job-id='"+a.id+"' data-job='farm'>農作業</button><button data-job-id='"+a.id+"' data-job='scavenge'>漁り</button>")+
          "<button data-job-id='"+a.id+"' data-job='wait'>待機</button>"+
        "</div></div>";
    });
    panelContent.innerHTML=ph+"</div>";
    document.querySelectorAll("[data-job-id]").forEach(function(b){
      b.addEventListener("click",function(){assignPartyJob(b.getAttribute("data-job-id"),b.getAttribute("data-job"))});
    });
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
  clearTapMarker();
  stopAutoWork(false);
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
  clearTapMarker();
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
  clearTapMarker();
  stopAutoWork(false);
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
  stopAutoWork(false);
  var target=screenToWorld(clientX,clientY);
  manual.x=0;manual.y=0;
  state.travelDestination=null;
  state.player.attackTarget=null;
  state.player.target=target;
  setTapMarker(target.x,target.y);
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
    tapMarker={x:0,y:0,active:false};
    autoWork={type:null,nextAt:0};
    questBoardPlace=null;
    tradeActorId=null;
    tradePlaceKey=null;
    contextSignature=null;
    hotbarSignature=null;
    manual.x=0;manual.y=0;
    log("ロードした。");
    showResult("ロード");
    renderAll();
  }catch(e){
    state=freshState();
    tapMarker={x:0,y:0,active:false};
    autoWork={type:null,nextAt:0};
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
  ensurePopulation(true);

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

  document.querySelectorAll("[data-bottom-panel]").forEach(function(b){
    b.addEventListener("click",function(){
      cancelFieldMove();
      openPanel(b.getAttribute("data-bottom-panel"));
    });
  });
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