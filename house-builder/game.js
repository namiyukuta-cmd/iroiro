(()=>{
"use strict";
const D=window.ROOM_DATA,SAVE_KEY="iroiroSoloRoomV1";
const grid=document.getElementById("grid"),sceneTitle=document.getElementById("sceneTitle"),sceneNav=document.getElementById("sceneNav"),gridToggle=document.getElementById("gridToggle"),moneyEl=document.getElementById("money"),statusEl=document.getElementById("statusText"),progressEl=document.getElementById("goalProgress"),goalTitleEl=document.getElementById("goalTitle"),toast=document.getElementById("toast"),completeBtn=document.getElementById("completeBtn"),rotateBtn=document.getElementById("rotateBtn");
let money=D.startMoney,selected="bed",rotated=false,goalIndex=0,nextId=1,items={},scene="myroom";let toastTimer=0;
const GRID_PREF_KEY="iroiroSoloRoomGridVisibleV1";
let gridVisible=false;
try{gridVisible=localStorage.getItem(GRID_PREF_KEY)==="1"}catch{}
function setGridVisible(on){
  gridVisible=!!on;
  grid.classList.toggle("show-grid",gridVisible);
  gridToggle.setAttribute("aria-pressed",String(gridVisible));
  gridToggle.textContent="マス目："+(gridVisible?"ON":"OFF");
  try{localStorage.setItem(GRID_PREF_KEY,gridVisible?"1":"0")}catch{}
}


function xy(i){return{x:i%D.cols,y:Math.floor(i/D.cols)}}
function idx(x,y){return y*D.cols+x}
function fixedType(x,y){
  // 横から見た1区画の編集面。外周だけを固定し、背景の絵は別レイヤー。
  return (x===0||x===D.cols-1||y===0||y===D.rows-1)?"wall":"floor";
}
const BACKDROPS={
  myroom:'<div class="scene-window"><div class="scene-window-inner"></div></div>',
  balcony:'<div class="balcony-sky"></div><div class="balcony-rail"></div>',
  opposite:'<div class="scene-wallpanel"></div>',
  kitchen:'<div class="kitchen-wall"></div><div class="kitchen-counter"><div class="kitchen-sink"></div><div class="kitchen-burners"><i></i><i></i></div></div>',
  bathroom:'<div class="bath-tile"></div><div class="bath-tub"></div><div class="bath-toilet"></div>',
  entrance:'<div class="entry-door"><div class="entry-knob"></div></div>'
};
const DIRECTION_LABELS={left:"←",up:"↑",down:"↓",right:"→"};
function showScene(name){
  if(!D.scenes[name])return;
  scene=name;
  sceneTitle.textContent=D.scenes[scene].label;
  grid.setAttribute("aria-label",D.scenes[scene].label);
  for(const button of sceneNav.querySelectorAll(".scene-step")){
    const dest=D.scenes[scene].exits[button.dataset.direction];
    button.hidden=!dest;
    button.disabled=!dest;
    button.dataset.target=dest||"";
    if(dest)button.textContent=DIRECTION_LABELS[button.dataset.direction]+" "+(dest==="opposite"?"反対側":D.scenes[dest].label);
  }
  statusEl.textContent="表示："+D.scenes[scene].label;
  render();
}

function footprint(type,anchor,rot){
  const f=D.furniture[type],p=xy(anchor),w=rot?f.h:f.w,h=rot?f.w:f.h,out=[];
  for(let dy=0;dy<h;dy++)for(let dx=0;dx<w;dx++)out.push(idx(p.x+dx,p.y+dy));
  return{cells:out,w,h,x:p.x,y:p.y};
}
function occupiedMap(forScene=scene){
  const map={};
  Object.entries(items).forEach(([id,it])=>{
    if((it.scene||"myroom")!==forScene)return;
    footprint(it.type,it.anchor,it.rotated).cells.forEach(i=>map[i]=id);
  });
  return map;
}
function counts(){const c={};Object.values(items).forEach(it=>c[it.type]=(c[it.type]||0)+1);return c}
function show(msg){clearTimeout(toastTimer);toast.textContent=msg;toast.classList.add("show");toastTimer=setTimeout(()=>toast.classList.remove("show"),1400)}
function yen(n){return Number(n).toLocaleString("ja-JP")}
function label(k){return D.furniture[k]?.name||k}

function renderGoal(){
  if(goalIndex>=D.goals.length){goalTitleEl.textContent="好きに模様替え";progressEl.innerHTML='<span class="req ok">全目標達成</span>';completeBtn.disabled=true;completeBtn.textContent="達成済";return}
  const g=D.goals[goalIndex],c=counts();goalTitleEl.textContent=g.title;progressEl.innerHTML="";
  Object.entries(g.requirements).forEach(([k,n])=>{const s=document.createElement("span");const have=c[k]||0;s.className="req"+(have>=n?" ok":"");s.textContent=label(k)+" "+have+"/"+n;progressEl.appendChild(s)});
  completeBtn.disabled=false;completeBtn.textContent="達成";
}
function render(){
  moneyEl.textContent=yen(money);grid.innerHTML="";
  const backdrop=document.createElement("div");
  backdrop.className="scene-backdrop scene-backdrop--"+scene;
  backdrop.innerHTML=BACKDROPS[scene]||"";
  grid.appendChild(backdrop);
  const occ=occupiedMap();
  for(let i=0;i<D.cols*D.rows;i++){
    const p=xy(i),base=fixedType(p.x,p.y),b=document.createElement("button");b.type="button";b.className="cell "+base+(base!=="floor"?" fixed":"");b.dataset.index=i;b.setAttribute("role","gridcell");
    const id=occ[i];
    if(id){const it=items[id];b.classList.add("occupied",it.type);if(i===it.anchor){b.classList.add("anchor");b.dataset.label=D.furniture[it.type].short}b.dataset.itemId=id}
    grid.appendChild(b);
  }
  // 1つの家具を複数の色付きセルではなく、単一の絵の重ね合わせで表示。
  // 当たり判定とタップ位置は下のセル側に残す。
  Object.values(items).forEach(it=>{
    if((it.scene||"myroom")!==scene)return;
    const f=D.furniture[it.type];
    if(!f)return;
    const fp=footprint(it.type,it.anchor,it.rotated);
    const piece=document.createElement("div");
    piece.className="room-piece "+it.type;
    piece.style.left=(fp.x/D.cols*100)+"%";
    piece.style.top=(fp.y/D.rows*100)+"%";
    piece.style.width=(fp.w/D.cols*100)+"%";
    piece.style.height=(fp.h/D.rows*100)+"%";
    if(f.image){
      const picture=document.createElement("img");
      picture.src=f.image;
      picture.alt=f.name;
      piece.appendChild(picture);
    }else{
      piece.textContent=f.short;
      piece.setAttribute("aria-label",f.name);
    }
    grid.appendChild(piece);
  });
  renderGoal();
}
function canPlace(type,anchor,rot,ignoreId=null,targetScene=scene){
  const fp=footprint(type,anchor,rot);
  if(fp.x<1||fp.y<1||fp.x+fp.w>D.cols-1||fp.y+fp.h>D.rows-1)return false;
  const occ=occupiedMap(targetScene);return fp.cells.every(i=>!occ[i]||occ[i]===ignoreId);
}
function place(anchor){
  const f=D.furniture[selected];if(!f)return;
  if(!canPlace(selected,anchor,rotated)){show("そこには置けません");return}
  if(money<f.price){show("お金が足りません");return}
  money-=f.price;items[nextId++]={type:selected,anchor,rotated,scene};statusEl.textContent=f.name+"を置きました";render();
}
function removeAt(i){
  const occ=occupiedMap(),id=occ[i];if(!id){show("家具がありません");return}
  const it=items[id],f=D.furniture[it.type];money+=Math.floor(f.price/2);delete items[id];statusEl.textContent=f.name+"を撤去しました";render();
}
function selectTool(type){
  selected=type;document.querySelectorAll(".tool").forEach(b=>b.classList.toggle("active",b.dataset.tool===type));statusEl.textContent=D.furniture[type].name+"を選択中";
}
function switchTab(tab){
  document.querySelectorAll(".tab").forEach(b=>b.classList.toggle("active",b.dataset.tab===tab));
  document.getElementById("furnitureTools").classList.toggle("hidden",tab!=="furniture");
  document.getElementById("applianceTools").classList.toggle("hidden",tab!=="appliance");
  document.getElementById("manageTools").classList.toggle("hidden",tab!=="manage");
  rotateBtn.classList.toggle("hidden",tab==="manage");
  if(tab==="furniture"&&!["bed","desk","table","sofa","shelf"].includes(selected))selectTool("bed");
  if(tab==="appliance"&&!["fridge","washer","tv","rug","plant"].includes(selected))selectTool("fridge");
}
function completeGoal(){
  if(goalIndex>=D.goals.length)return;const g=D.goals[goalIndex],c=counts();
  if(!Object.entries(g.requirements).every(([k,n])=>(c[k]||0)>=n)){show("まだ必要な家具が足りません");return}
  money+=g.reward;goalIndex++;show("達成！ +"+yen(g.reward)+"円");render();
}
function save(){localStorage.setItem(SAVE_KEY,JSON.stringify({version:2,money,goalIndex,nextId,items,scene}));show("保存しました")}
function load(){
  const raw=localStorage.getItem(SAVE_KEY);if(!raw){show("保存データがありません");return}
  try{const d=JSON.parse(raw);money=Number.isFinite(d.money)?d.money:D.startMoney;goalIndex=Number.isInteger(d.goalIndex)?Math.max(0,Math.min(d.goalIndex,D.goals.length)):0;nextId=Number.isInteger(d.nextId)?d.nextId:1;items={};
    Object.entries(d.items||{}).forEach(([id,it])=>{
      const targetScene=D.scenes[it.scene]?it.scene:"myroom";
      if(!D.furniture[it.type]||!Number.isInteger(it.anchor))return;
      // 旧セーブはマイルームへ移行。
      if(canPlace(it.type,it.anchor,!!it.rotated,id,targetScene))items[id]={type:it.type,anchor:it.anchor,rotated:!!it.rotated,scene:targetScene};
    });
    showScene(D.scenes[d.scene]?d.scene:"myroom");show("読み込みました");
  }catch{show("保存データを読み込めません")}
}
function reset(){if(!confirm("部屋を空の状態に戻しますか？"))return;money=D.startMoney;goalIndex=0;nextId=1;items={};showScene("myroom");show("空の部屋に戻しました")}

sceneNav.addEventListener("click",e=>{
  const button=e.target.closest(".scene-step");
  if(button&&!button.disabled&&D.scenes[button.dataset.target])showScene(button.dataset.target);
});
gridToggle.addEventListener("click",()=>setGridVisible(!gridVisible));
grid.addEventListener("click",e=>{const cell=e.target.closest(".cell");if(!cell||cell.classList.contains("fixed"))return;const i=Number(cell.dataset.index);if(selected==="remove")removeAt(i);else place(i)});
document.querySelectorAll(".tool").forEach(b=>b.addEventListener("click",()=>selectTool(b.dataset.tool)));
document.querySelectorAll(".tab").forEach(b=>b.addEventListener("click",()=>switchTab(b.dataset.tab)));
rotateBtn.addEventListener("click",()=>{rotated=!rotated;rotateBtn.textContent=rotated?"↻ 回転：横":"↻ 回転：縦";show("向きを変えました")});
document.getElementById("removeBtn").addEventListener("click",()=>{selected="remove";statusEl.textContent="撤去する家具をタップ";show("撤去モード")});
document.getElementById("saveBtn").addEventListener("click",save);document.getElementById("loadBtn").addEventListener("click",load);document.getElementById("resetBtn").addEventListener("click",reset);completeBtn.addEventListener("click",completeGoal);
setGridVisible(gridVisible);
showScene("myroom");
})();