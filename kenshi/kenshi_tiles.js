(function(){
"use strict";

var COLS=20,ROWS=20,TILE=64;
var viewport=document.getElementById("viewport");
var world=document.getElementById("world");
var terrainLayer=document.getElementById("terrainLayer");
var objectLayer=document.getElementById("objectLayer");
var entityLayer=document.getElementById("entityLayer");
var playerEl=document.getElementById("player");
var posText=document.getElementById("posText");
var statusText=document.getElementById("statusText");
var pauseBtn=document.getElementById("pauseBtn");

var TERRAIN={
  G:{name:"草原",cls:"grass",walk:true,cost:1},
  R:{name:"道",cls:"road",walk:true,cost:.65},
  W:{name:"水",cls:"water",walk:false,cost:99},
  S:{name:"砂地",cls:"sand",walk:true,cost:1.2},
  M:{name:"岩山",cls:"rock",walk:false,cost:99},
  L:{name:"塩の荒地",cls:"salt",walk:true,cost:1.35},
  F:{name:"農地",cls:"farm",walk:true,cost:1.1}
};

var MAP=[
"SSSSSSMMMMMMMMMMMMMM",
"SSSSSSMMMMMGGGGGMMMM",
"SSSSSGGGGGGGGGGGGMMM",
"SSSSGGRRRRGGGGGGGMMM",
"SSSGGGRGGRGGGMMMMGMM",
"SSGGGGRGGGRGGMMMMGMM",
"WWGGGGRGGGRGGGGGGGMM",
"WWGGGGRRRRRRGGGGGGMM",
"WWGGGGGGGGRGGGGRRGMM",
"WWGGGGGGGGRRRRRRRGMM",
"WWGGGFFFFGRGGGGRRGMM",
"WWGGGFFFFGRGGGGRGGMM",
"WWGGGFFFFGRGGGRRGGMM",
"WWWGGGGRRRRRRRRGGGMM",
"WWWGGGGGGGLLLRGGGGMM",
"WWWWGGGGGLLLLRGGGGMM",
"WWWWGGGGLLLLLRRRRGMM",
"WWWWWGGGGLLLLGGGRGMM",
"WWWWWWGGGGGGGGGGRRRM",
"WWWWWWWWGGGGGGGGGGGM"
];

var objects=[
  {x:4,y:3,type:"town"},
  {x:15,y:4,type:"mine"},
  {x:10,y:9,type:"town"},
  {x:5,y:11,type:"tree"},{x:6,y:11,type:"tree"},
  {x:4,y:12,type:"tree"},{x:7,y:12,type:"tree"},
  {x:14,y:12,type:"ruins"},
  {x:12,y:16,type:"boulder"},{x:13,y:16,type:"boulder"},
  {x:17,y:18,type:"town"}
];

var player={x:9.5,y:9.5,speed:3.1,path:[],target:null};
var paused=false;
var pointer=null;
var manual={x:0,y:0};

var npcs=[
  {x:8.2,y:8.2,type:"human",side:"neutral",vx:.18,vy:.05},
  {x:11.6,y:8.8,type:"human",side:"friend",vx:-.08,vy:.14},
  {x:13.2,y:13.2,type:"human",side:"enemy",vx:.12,vy:-.08},
  {x:14.1,y:13.6,type:"human",side:"enemy",vx:-.06,vy:.1},
  {x:6.4,y:10.5,type:"animal",side:"animal",vx:.1,vy:.08},
  {x:16.5,y:6.3,type:"animal",side:"animal",vx:-.12,vy:.05}
];

function tileSize(){
  var v=getComputedStyle(document.documentElement).getPropertyValue("--tile");
  return parseFloat(v)||64;
}
function idx(x,y){return y*COLS+x}
function inside(x,y){return x>=0&&y>=0&&x<COLS&&y<ROWS}
function terrainAt(x,y){
  x=Math.floor(x);y=Math.floor(y);
  if(!inside(x,y))return TERRAIN.M;
  return TERRAIN[MAP[y][x]]||TERRAIN.M;
}
function walkable(x,y){return terrainAt(x,y).walk}

function renderTerrain(){
  terrainLayer.innerHTML="";
  for(var y=0;y<ROWS;y++){
    for(var x=0;x<COLS;x++){
      var t=TERRAIN[MAP[y][x]];
      var d=document.createElement("div");
      d.className="tile "+t.cls;
      d.dataset.x=x;d.dataset.y=y;
      terrainLayer.appendChild(d);
    }
  }
}
function place(el,x,y){
  var s=tileSize();
  el.style.left=((x+.5)*s)+"px";
  el.style.top=((y+.5)*s)+"px";
}
function renderObjects(){
  objectLayer.innerHTML="";
  objects.forEach(function(o){
    var d=document.createElement("div");
    d.className="mapObject "+o.type;
    place(d,o.x,o.y);
    objectLayer.appendChild(d);
  });
}
function renderEntities(){
  entityLayer.innerHTML="";
  npcs.forEach(function(n){
    var d=document.createElement("div");
    d.className="entity "+n.type+" "+n.side;
    d.style.left=((n.x+.5)*tileSize())+"px";
    d.style.top=((n.y+.5)*tileSize())+"px";
    entityLayer.appendChild(d);
  });
}
function camera(){
  var s=tileSize();
  var r=viewport.getBoundingClientRect();
  var px=(player.x+.5)*s,py=(player.y+.5)*s;
  var tx=r.width*.5-px,ty=r.height*.52-py;
  var ww=COLS*s,wh=ROWS*s;
  if(ww>r.width){
    tx=Math.min(0,Math.max(r.width-ww,tx));
  }else tx=(r.width-ww)/2;
  if(wh>r.height){
    ty=Math.min(0,Math.max(r.height-wh,ty));
  }else ty=(r.height-wh)/2;
  world.style.transform="translate("+tx+"px,"+ty+"px)";
  playerEl.style.left=px+"px";
  playerEl.style.top=py+"px";
}
function status(){
  var t=terrainAt(player.x,player.y);
  posText.textContent=(Math.floor(player.x)+1)+","+(Math.floor(player.y)+1);
  statusText.textContent=t.name+(player.path.length?"　→ 自動移動中":"");
}
function render(){
  renderEntities();
  camera();
  status();
}

function neighbors(x,y){
  var out=[],dirs=[[1,0],[-1,0],[0,1],[0,-1]];
  dirs.forEach(function(d){
    var nx=x+d[0],ny=y+d[1];
    if(inside(nx,ny)&&walkable(nx,ny))out.push([nx,ny]);
  });
  return out;
}
function pathfind(sx,sy,gx,gy){
  sx=Math.floor(sx);sy=Math.floor(sy);gx=Math.floor(gx);gy=Math.floor(gy);
  if(!inside(gx,gy)||!walkable(gx,gy))return [];
  var start=idx(sx,sy),goal=idx(gx,gy);
  var q=[start],came=new Map(),cost=new Map([[start,0]]);
  came.set(start,-1);
  while(q.length){
    q.sort(function(a,b){return cost.get(a)-cost.get(b)});
    var cur=q.shift();
    if(cur===goal)break;
    var cx=cur%COLS,cy=Math.floor(cur/COLS);
    neighbors(cx,cy).forEach(function(n){
      var ni=idx(n[0],n[1]);
      var nc=cost.get(cur)+terrainAt(n[0],n[1]).cost;
      if(!cost.has(ni)||nc<cost.get(ni)){
        cost.set(ni,nc);came.set(ni,cur);q.push(ni);
      }
    });
  }
  if(!came.has(goal))return [];
  var rev=[],c=goal;
  while(c!==start&&c!==-1){
    rev.push({x:c%COLS,y:Math.floor(c/COLS)});
    c=came.get(c);
  }
  return rev.reverse();
}
function setAutoTarget(x,y){
  var p=pathfind(player.x,player.y,x,y);
  if(!p.length)return;
  player.path=p;
  player.target=null;
  manual.x=manual.y=0;
}
function moveToward(tx,ty,dt){
  var dx=tx-player.x,dy=ty-player.y,d=Math.hypot(dx,dy);
  if(d<.04){player.x=tx;player.y=ty;return true}
  var step=player.speed*dt;
  if(step>=d){player.x=tx;player.y=ty;return true}
  var nx=player.x+dx/d*step,ny=player.y+dy/d*step;
  if(walkable(nx,ny)){player.x=nx;player.y=ny}
  return false;
}
function manualStep(dt){
  var m=Math.hypot(manual.x,manual.y);
  if(m<.04)return false;
  player.path=[];
  var dx=manual.x/m,dy=manual.y/m,step=player.speed*1.15*dt;
  var nx=player.x+dx*step,ny=player.y+dy*step;
  if(walkable(nx,player.y))player.x=nx;
  if(walkable(player.x,ny))player.y=ny;
  return true;
}
function npcStep(dt){
  npcs.forEach(function(n){
    var nx=n.x+n.vx*dt,ny=n.y+n.vy*dt;
    if(!walkable(nx,ny)||Math.random()<.004){
      var a=Math.random()*Math.PI*2;
      n.vx=Math.cos(a)*.18;n.vy=Math.sin(a)*.18;
      return;
    }
    n.x=nx;n.y=ny;
  });
}
function tick(now){
  if(!tick.last)tick.last=now;
  var dt=Math.min(.05,(now-tick.last)/1000);tick.last=now;
  if(!paused){
    if(!manualStep(dt)&&player.path.length){
      var p=player.path[0];
      if(moveToward(p.x,p.y,dt))player.path.shift();
    }
    npcStep(dt);
  }
  render();
  requestAnimationFrame(tick);
}

function worldPoint(clientX,clientY){
  var r=viewport.getBoundingClientRect();
  var tr=getComputedStyle(world).transform;
  var m=new DOMMatrixReadOnly(tr==="none"?undefined:tr);
  var s=tileSize();
  return {
    x:(clientX-r.left-m.m41)/s-.5,
    y:(clientY-r.top-m.m42)/s-.5
  };
}
viewport.addEventListener("pointerdown",function(e){
  if(e.target.closest("button"))return;
  viewport.setPointerCapture(e.pointerId);
  pointer={id:e.pointerId,x:e.clientX,y:e.clientY,sx:e.clientX,sy:e.clientY,time:performance.now(),drag:false};
});
viewport.addEventListener("pointermove",function(e){
  if(!pointer||e.pointerId!==pointer.id)return;
  pointer.x=e.clientX;pointer.y=e.clientY;
  var dx=e.clientX-pointer.sx,dy=e.clientY-pointer.sy;
  if(Math.hypot(dx,dy)>14)pointer.drag=true;
  if(pointer.drag){
    var d=Math.max(48,Math.hypot(dx,dy));
    manual.x=dx/d;manual.y=dy/d;
  }
});
viewport.addEventListener("pointerup",function(e){
  if(!pointer||e.pointerId!==pointer.id)return;
  var p=pointer;pointer=null;
  manual.x=manual.y=0;
  if(!p.drag&&performance.now()-p.time<500){
    var w=worldPoint(e.clientX,e.clientY);
    setAutoTarget(Math.floor(w.x),Math.floor(w.y));
  }
});
viewport.addEventListener("pointercancel",function(){
  pointer=null;manual.x=manual.y=0;
});
pauseBtn.addEventListener("click",function(){
  paused=!paused;
  pauseBtn.textContent=paused?"再開":"停止";
});
window.addEventListener("resize",render);

renderTerrain();
renderObjects();
render();
requestAnimationFrame(tick);
})();