import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const canvas = document.getElementById('simCanvas');
const bodyPreview = document.getElementById('bodyTexturePreview');
const facePreview = document.getElementById('faceTexturePreview');
const bodyPreviewCtx = bodyPreview.getContext('2d');
const facePreviewCtx = facePreview.getContext('2d');

const renderer = new THREE.WebGLRenderer({canvas, antialias:true, alpha:true});
renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.outputColorSpace = THREE.SRGBColorSpace;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100);
camera.position.set(3.15, 2.2, 5.0);

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.enablePan = false;
controls.minDistance = 3.0;
controls.maxDistance = 7.5;
controls.target.set(0, 0.92, 0);

scene.add(new THREE.HemisphereLight(0xffffff, 0x746b60, 2.0));
const key = new THREE.DirectionalLight(0xffffff, 2.5);
key.position.set(3, 5, 4);
key.castShadow = true;
scene.add(key);

const floor = new THREE.Mesh(
  new THREE.CircleGeometry(1.25, 48),
  new THREE.MeshStandardMaterial({color:0xd9d3c7, roughness:1})
);
floor.rotation.x = -Math.PI / 2;
floor.position.y = -0.13;
floor.receiveShadow = true;
scene.add(floor);

const state = {
  skin:'warm',
  bodyTexture:'green',
  faceTexture:'soft',
  headMesh:'classic',
  hairMesh:'short',
  hairColor:'brown'
};

const skins = {
  light:'#e3b996',
  warm:'#c99069',
  deep:'#81563e'
};

const hairColors = {
  brown:'#4a342b',
  black:'#202123',
  auburn:'#713e32'
};

const outfits = {
  green:{name:'グリーン普段着', shirt:'#6a745f', trim:'#d9d3c8', pants:'#35393b', shoes:'#262627'},
  red:{name:'レンガ色普段着', shirt:'#84514d', trim:'#ead9c5', pants:'#403a39', shoes:'#2b2828'},
  blue:{name:'ブルー作業着', shirt:'#506b7a', trim:'#c9d7dd', pants:'#303840', shoes:'#202427'}
};

const faceStyles = {
  soft:'ソフト',
  sharp:'シャープ',
  cheerful:'朗らか'
};

const headNames = {
  classic:'クラシック',
  narrow:'細め',
  round:'丸め'
};

const hairNames = {
  short:'ショート',
  bob:'ボブ',
  bun:'まとめ髪'
};

function hexToRgb(hex){
  const n = parseInt(hex.slice(1), 16);
  return {r:n>>16, g:(n>>8)&255, b:n&255};
}

function shade(hex, amount){
  const {r,g,b} = hexToRgb(hex);
  const c = n => Math.max(0, Math.min(255, n + amount));
  return '#' + ((1<<24) + (c(r)<<16) + (c(g)<<8) + c(b)).toString(16).slice(1);
}

const BODY_UV={
  torso:[8,8,236,236],
  arm:[252,8,112,236],
  skin:[372,8,132,236],
  legs:[8,252,236,252],
  shoes:[252,252,112,112],
  spare:[372,252,132,252]
};

function makeBodyAtlas(){
  const c=document.createElement('canvas');
  c.width=512;c.height=512;
  const ctx=c.getContext('2d');
  const skin=skins[state.skin];
  const outfit=outfits[state.bodyTexture];

  ctx.fillStyle=shade(skin,-8);
  ctx.fillRect(0,0,512,512);

  // torso island
  ctx.fillStyle=outfit.shirt;
  ctx.fillRect(...BODY_UV.torso);
  const [tx,ty,tw,th]=BODY_UV.torso;
  const torsoShade=ctx.createLinearGradient(tx,ty,tx+tw,ty);
  torsoShade.addColorStop(0,'rgba(0,0,0,.18)');
  torsoShade.addColorStop(.32,'rgba(255,255,255,.05)');
  torsoShade.addColorStop(.68,'rgba(255,255,255,.05)');
  torsoShade.addColorStop(1,'rgba(0,0,0,.18)');
  ctx.fillStyle=torsoShade;ctx.fillRect(tx,ty,tw,th);
  ctx.fillStyle=outfit.trim;
  ctx.beginPath();
  ctx.moveTo(105,8);ctx.lineTo(147,8);ctx.lineTo(140,54);ctx.lineTo(112,54);ctx.closePath();ctx.fill();

  // arms island: upper sleeve, lower skin
  const [ax,ay,aw,ah]=BODY_UV.arm;
  ctx.fillStyle=outfit.shirt;ctx.fillRect(ax,ay,aw,74);
  ctx.fillStyle=skin;ctx.fillRect(ax,ay+74,aw,ah-74);
  const armShade=ctx.createLinearGradient(ax,ay,ax+aw,ay);
  armShade.addColorStop(0,'rgba(0,0,0,.16)');
  armShade.addColorStop(.5,'rgba(255,255,255,.04)');
  armShade.addColorStop(1,'rgba(0,0,0,.16)');
  ctx.fillStyle=armShade;ctx.fillRect(ax,ay,aw,ah);

  // exposed skin / neck / hands
  ctx.fillStyle=skin;ctx.fillRect(...BODY_UV.skin);

  // legs island
  ctx.fillStyle=outfit.pants;ctx.fillRect(...BODY_UV.legs);
  const [lx,ly,lw,lh]=BODY_UV.legs;
  const legShade=ctx.createLinearGradient(lx,ly,lx+lw,ly);
  legShade.addColorStop(0,'rgba(0,0,0,.18)');
  legShade.addColorStop(.5,'rgba(255,255,255,.04)');
  legShade.addColorStop(1,'rgba(0,0,0,.18)');
  ctx.fillStyle=legShade;ctx.fillRect(lx,ly,lw,lh);

  // shoes
  ctx.fillStyle=outfit.shoes;ctx.fillRect(...BODY_UV.shoes);
  ctx.fillStyle=shade(outfit.shoes,18);ctx.fillRect(252,334,112,30);

  // spare / palette
  ctx.fillStyle=shade(outfit.shirt,-9);ctx.fillRect(...BODY_UV.spare);

  return c;
}

function rectUV(rect,u,v,size=512){
  const [x,y,w,h]=rect;
  return [(x+u*w)/size,1-(y+v*h)/size];
}

function addRingSurface(buffers,rings,segments,rect,closeTop=true,closeBottom=true){
  const {pos,uv,idx}=buffers;
  const base=pos.length/3;

  rings.forEach((r,ri)=>{
    for(let i=0;i<=segments;i++){
      const t=i/segments;
      const a=t*Math.PI*2;
      const x=r.cx+Math.sin(a)*r.rx;
      const z=r.cz+Math.cos(a)*r.rz;
      pos.push(x,r.y,z);
      const [u,v]=rectUV(rect,t,ri/(rings.length-1));
      uv.push(u,v);
    }
  });

  for(let r=0;r<rings.length-1;r++){
    const row0=base+r*(segments+1);
    const row1=row0+(segments+1);
    for(let i=0;i<segments;i++){
      idx.push(row0+i,row1+i,row0+i+1);
      idx.push(row0+i+1,row1+i,row1+i+1);
    }
  }

  const addCap=(ringIndex,flip)=>{
    const ring=rings[ringIndex];
    const center=pos.length/3;
    pos.push(ring.cx,ring.y,ring.cz);
    const [cu,cv]=rectUV(rect,.5,ringIndex===0?0:1);
    uv.push(cu,cv);
    const row=base+ringIndex*(segments+1);
    for(let i=0;i<segments;i++){
      if(flip) idx.push(center,row+i+1,row+i);
      else idx.push(center,row+i,row+i+1);
    }
  };
  if(closeTop)addCap(0,true);
  if(closeBottom)addCap(rings.length-1,false);
}

function addWedge(buffers,{cx,cy,cz,w,h,d,front,rect}){
  const {pos,uv,idx}=buffers;
  const b=pos.length/3;
  const x0=cx-w/2,x1=cx+w/2;
  const y0=cy-h/2,y1=cy+h/2;
  const z0=cz-d/2,z1=cz+d/2;
  const tip=front?z1:z0;
  const heel=front?z0:z1;
  const verts=[
    [x0,y0,heel],[x1,y0,heel],[x1,y1,heel],[x0,y1,heel],
    [x0,y0,tip],[x1,y0,tip],[x1,y1-.025,tip],[x0,y1-.025,tip]
  ];
  verts.forEach(v=>pos.push(...v));
  const uvPts=[[0,1],[1,1],[1,0],[0,0],[0,1],[1,1],[1,0],[0,0]];
  uvPts.forEach(p=>uv.push(...rectUV(rect,p[0],p[1])));
  const faces=[
    [0,1,2,0,2,3],[4,6,5,4,7,6],
    [0,4,5,0,5,1],[3,2,6,3,6,7],
    [1,5,6,1,6,2],[0,3,7,0,7,4]
  ];
  faces.flat().forEach(i=>idx.push(b+i));
}

function bodyGeometry(){
  const buffers={pos:[],uv:[],idx:[]};

  // torso: shoulder -> chest -> waist -> hips
  addRingSurface(buffers,[
    {cx:0,cz:0,y:1.31,rx:.34,rz:.145},
    {cx:0,cz:.006,y:1.17,rx:.315,rz:.165},
    {cx:0,cz:.008,y:.96,rx:.255,rz:.145},
    {cx:0,cz:.006,y:.80,rx:.225,rz:.135},
    {cx:0,cz:.005,y:.65,rx:.285,rz:.155}
  ],8,BODY_UV.torso,true,true);

  // neck
  addRingSurface(buffers,[
    {cx:0,cz:0,y:1.405,rx:.085,rz:.075},
    {cx:0,cz:0,y:1.31,rx:.095,rz:.082}
  ],8,BODY_UV.skin,true,false);

  // arms: no spikes, several gradual rings
  for(const side of [-1,1]){
    const rect=BODY_UV.arm;
    addRingSurface(buffers,[
      {cx:side*.36,cz:0,y:1.235,rx:.090,rz:.083},
      {cx:side*.385,cz:.004,y:1.08,rx:.083,rz:.076},
      {cx:side*.40,cz:.008,y:.89,rx:.072,rz:.067},
      {cx:side*.405,cz:.012,y:.70,rx:.062,rz:.060}
    ],6,rect,true,false);
    addRingSurface(buffers,[
      {cx:side*.405,cz:.012,y:.70,rx:.064,rz:.060},
      {cx:side*.405,cz:.025,y:.57,rx:.068,rz:.055},
      {cx:side*.405,cz:.03,y:.515,rx:.062,rz:.050}
    ],6,BODY_UV.skin,false,true);
  }

  // legs: thigh -> knee -> calf -> ankle
  for(const side of [-1,1]){
    addRingSurface(buffers,[
      {cx:side*.155,cz:.004,y:.65,rx:.135,rz:.120},
      {cx:side*.145,cz:.012,y:.47,rx:.120,rz:.108},
      {cx:side*.135,cz:.016,y:.31,rx:.098,rz:.092},
      {cx:side*.132,cz:.020,y:.17,rx:.089,rz:.082},
      {cx:side*.13,cz:.024,y:.045,rx:.078,rz:.074}
    ],8,BODY_UV.legs,true,true);
    addWedge(buffers,{
      cx:side*.13,cy:-.02,cz:.09,w:.18,h:.12,d:.32,front:true,rect:BODY_UV.shoes
    });
  }

  const g=new THREE.BufferGeometry();
  g.setAttribute('position',new THREE.Float32BufferAttribute(buffers.pos,3));
  g.setAttribute('uv',new THREE.Float32BufferAttribute(buffers.uv,2));
  g.setIndex(buffers.idx);
  g.computeVertexNormals();
  g.computeBoundingSphere();
  return g;
}

function makeFaceCanvas(){
  const c=document.createElement('canvas');
  c.width=256;c.height=256;
  const ctx=c.getContext('2d');
  const skin=skins[state.skin];

  ctx.fillStyle=skin;ctx.fillRect(0,0,256,256);

  // wrap shading
  const wrap=ctx.createLinearGradient(0,0,256,0);
  wrap.addColorStop(0,'rgba(0,0,0,.18)');
  wrap.addColorStop(.18,'rgba(0,0,0,.06)');
  wrap.addColorStop(.5,'rgba(255,255,255,.07)');
  wrap.addColorStop(.82,'rgba(0,0,0,.06)');
  wrap.addColorStop(1,'rgba(0,0,0,.18)');
  ctx.fillStyle=wrap;ctx.fillRect(0,0,256,256);

  // ears at quarter turns of the wrapped UV
  ctx.fillStyle=shade(skin,-18);
  ctx.beginPath();ctx.ellipse(64,135,10,19,0,0,Math.PI*2);ctx.fill();
  ctx.beginPath();ctx.ellipse(192,135,10,19,0,0,Math.PI*2);ctx.fill();
  ctx.fillStyle=shade(skin,-30);
  ctx.beginPath();ctx.ellipse(64,135,4,9,0,0,Math.PI*2);ctx.fill();
  ctx.beginPath();ctx.ellipse(192,135,4,9,0,0,Math.PI*2);ctx.fill();

  // front face centred at u=.5
  ctx.globalAlpha=.15;ctx.fillStyle='#b95f60';
  ctx.beginPath();ctx.ellipse(103,151,13,10,0,0,Math.PI*2);ctx.fill();
  ctx.beginPath();ctx.ellipse(153,151,13,10,0,0,Math.PI*2);ctx.fill();
  ctx.globalAlpha=1;

  ctx.fillStyle='#2b2623';
  if(state.faceTexture==='soft'){
    ctx.fillRect(101,118,16,4);ctx.fillRect(139,118,16,4);
    ctx.fillRect(107,114,4,12);ctx.fillRect(145,114,4,12);
    ctx.strokeStyle='#70453d';ctx.lineWidth=4;
    ctx.beginPath();ctx.arc(128,158,23,.20*Math.PI,.80*Math.PI);ctx.stroke();
  }else if(state.faceTexture==='sharp'){
    ctx.save();ctx.translate(109,120);ctx.rotate(-.15);ctx.fillRect(-10,-3,20,6);ctx.restore();
    ctx.save();ctx.translate(147,120);ctx.rotate(.15);ctx.fillRect(-10,-3,20,6);ctx.restore();
    ctx.fillStyle='#69423b';ctx.fillRect(115,166,26,4);
  }else{
    ctx.beginPath();ctx.arc(109,120,5,0,Math.PI*2);ctx.fill();
    ctx.beginPath();ctx.arc(147,120,5,0,Math.PI*2);ctx.fill();
    ctx.strokeStyle='#70453d';ctx.lineWidth=4;
    ctx.beginPath();ctx.arc(128,157,26,.12*Math.PI,.88*Math.PI);ctx.stroke();
  }

  ctx.strokeStyle=shade(skin,-32);ctx.lineWidth=3;
  ctx.beginPath();ctx.moveTo(128,128);ctx.lineTo(124,148);ctx.lineTo(132,151);ctx.stroke();
  ctx.strokeStyle='#5b4438';ctx.lineWidth=3;
  ctx.beginPath();ctx.moveTo(99,109);ctx.lineTo(117,107);ctx.stroke();
  ctx.beginPath();ctx.moveTo(139,107);ctx.lineTo(157,109);ctx.stroke();

  return c;
}

function headGeometry(width,height,depth){
  const buffers={pos:[],uv:[],idx:[]};
  const rings=[
    {y:.50,rx:.22,rz:.16},
    {y:.39,rx:.42,rz:.33},
    {y:.18,rx:.50,rz:.45},
    {y:-.05,rx:.47,rz:.47},
    {y:-.25,rx:.40,rz:.40},
    {y:-.42,rx:.29,rz:.31},
    {y:-.50,rx:.16,rz:.20}
  ].map(r=>({
    cx:0,cz:0,
    y:r.y*height,
    rx:r.rx*width,
    rz:r.rz*depth
  }));
  addRingSurface(buffers,rings,12,[0,0,256,256],true,true);
  const g=new THREE.BufferGeometry();
  g.setAttribute('position',new THREE.Float32BufferAttribute(buffers.pos,3));
  g.setAttribute('uv',new THREE.Float32BufferAttribute(buffers.uv,2));
  g.setIndex(buffers.idx);
  g.computeVertexNormals();
  g.computeBoundingSphere();
  return g;
}

function canvasTexture(source){
  const tex = new THREE.CanvasTexture(source);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.magFilter = THREE.NearestFilter;
  tex.minFilter = THREE.LinearFilter;
  tex.wrapS = tex.wrapT = THREE.ClampToEdgeWrapping;
  tex.needsUpdate = true;
  return tex;
}

function atlasTexture(source, x, y, w, h){
  const tex = canvasTexture(source);
  tex.repeat.set(w/512, h/512);
  tex.offset.set(x/512, 1 - ((y+h)/512));
  return tex;
}

const person = new THREE.Group();
person.rotation.y = -.16;
scene.add(person);

let bodyGroup = null;
let headGroup = null;
let hairGroup = null;
let currentTextures = [];

function disposeGroup(group){
  if(!group) return;
  group.traverse(obj=>{
    if(obj.geometry) obj.geometry.dispose();
    if(obj.material){
      const mats = Array.isArray(obj.material) ? obj.material : [obj.material];
      mats.forEach(m=>m.dispose());
    }
  });
  group.removeFromParent();
}

function clearTextures(){
  currentTextures.forEach(t=>t.dispose());
  currentTextures = [];
}

function textureMaterial(tex, rough=.95){
  currentTextures.push(tex);
  return new THREE.MeshStandardMaterial({map:tex, color:0xffffff, roughness:rough, metalness:0});
}

function addBox(parent,name,w,h,d,x,y,z,material){
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(w,h,d), material);
  mesh.name = name;
  mesh.position.set(x,y,z);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  parent.add(mesh);
  return mesh;
}

function buildBody(bodyAtlas){
  disposeGroup(bodyGroup);
  bodyGroup=new THREE.Group();
  bodyGroup.name='BodyMesh';
  person.add(bodyGroup);

  const bodyTex=canvasTexture(bodyAtlas);
  currentTextures.push(bodyTex);
  const bodyMat=new THREE.MeshStandardMaterial({
    map:bodyTex,
    color:0xffffff,
    roughness:.96,
    metalness:0
  });

  const mesh=new THREE.Mesh(bodyGeometry(),bodyMat);
  mesh.name='BodyMesh_lowpoly';
  mesh.castShadow=true;
  mesh.receiveShadow=true;
  bodyGroup.add(mesh);
}

function buildHead(faceCanvas){
  disposeGroup(headGroup);
  headGroup = new THREE.Group();
  headGroup.name = 'HeadMesh';
  person.add(headGroup);

  const faceTex = canvasTexture(faceCanvas);
  currentTextures.push(faceTex);
  const headMat = new THREE.MeshStandardMaterial({
    map:faceTex,
    color:0xffffff,
    roughness:.95,
    metalness:0
  });

  let scale = [.46,.50,.40];
  if(state.headMesh === 'narrow') scale = [.40,.52,.38];
  if(state.headMesh === 'round') scale = [.49,.49,.43];

  const geom = headGeometry(...scale);
  const head = new THREE.Mesh(geom,headMat);
  head.name = 'HeadMesh_' + state.headMesh;
  head.position.set(0,1.66,0);
  head.castShadow = true;
  head.receiveShadow = true;
  headGroup.add(head);
}

function buildHair(){
  disposeGroup(hairGroup);
  hairGroup=new THREE.Group();
  hairGroup.name='HairMesh';
  person.add(hairGroup);

  const mat=new THREE.MeshStandardMaterial({
    color:hairColors[state.hairColor],
    roughness:.98,
    metalness:0,
    flatShading:true
  });

  const makePart=(rings,segments=8)=>{
    const b={pos:[],uv:[],idx:[]};
    addRingSurface(b,rings,segments,[0,0,256,256],true,true);
    const g=new THREE.BufferGeometry();
    g.setAttribute('position',new THREE.Float32BufferAttribute(b.pos,3));
    g.setAttribute('uv',new THREE.Float32BufferAttribute(b.uv,2));
    g.setIndex(b.idx);g.computeVertexNormals();
    const m=new THREE.Mesh(g,mat);m.castShadow=true;hairGroup.add(m);return m;
  };

  makePart([
    {cx:0,cz:-.01,y:1.96,rx:.11,rz:.09},
    {cx:0,cz:-.005,y:1.91,rx:.22,rz:.19},
    {cx:0,cz:-.01,y:1.82,rx:.245,rz:.215},
    {cx:0,cz:-.025,y:1.76,rx:.23,rz:.205}
  ],10);

  if(state.hairMesh==='bob'){
    for(const side of [-1,1]){
      makePart([
        {cx:side*.215,cz:-.01,y:1.82,rx:.055,rz:.07},
        {cx:side*.225,cz:-.015,y:1.62,rx:.060,rz:.075},
        {cx:side*.215,cz:-.02,y:1.49,rx:.050,rz:.065}
      ],6);
    }
    makePart([
      {cx:0,cz:-.19,y:1.80,rx:.17,rz:.055},
      {cx:0,cz:-.20,y:1.60,rx:.18,rz:.060},
      {cx:0,cz:-.18,y:1.48,rx:.14,rz:.050}
    ],8);
  }else if(state.hairMesh==='bun'){
    makePart([
      {cx:0,cz:-.17,y:1.82,rx:.16,rz:.055},
      {cx:0,cz:-.18,y:1.63,rx:.16,rz:.060},
      {cx:0,cz:-.17,y:1.52,rx:.11,rz:.050}
    ],8);
    makePart([
      {cx:0,cz:-.07,y:2.03,rx:.07,rz:.06},
      {cx:0,cz:-.08,y:2.08,rx:.13,rz:.11},
      {cx:0,cz:-.08,y:2.14,rx:.07,rz:.06}
    ],8);
  }else{
    makePart([
      {cx:0,cz:-.18,y:1.82,rx:.15,rz:.05},
      {cx:0,cz:-.19,y:1.69,rx:.14,rz:.055},
      {cx:0,cz:-.17,y:1.61,rx:.10,rz:.045}
    ],8);
  }
}

function drawPreview(source,targetCtx){
  targetCtx.clearRect(0,0,targetCtx.canvas.width,targetCtx.canvas.height);
  targetCtx.imageSmoothingEnabled = false;
  targetCtx.drawImage(source,0,0,targetCtx.canvas.width,targetCtx.canvas.height);
}

function updateAll(){
  clearTextures();
  const bodyAtlas = makeBodyAtlas();
  const faceCanvas = makeFaceCanvas();

  buildBody(bodyAtlas);
  buildHead(faceCanvas);
  buildHair();

  drawPreview(bodyAtlas, bodyPreviewCtx);
  drawPreview(faceCanvas, facePreviewCtx);

  document.getElementById('layerStatus').textContent =
    'Bodyメッシュ：共通 / Head：' + headNames[state.headMesh] +
    ' / Hair：' + hairNames[state.hairMesh] +
    ' / Bodyテクスチャ：' + outfits[state.bodyTexture].name +
    ' / Face：' + faceStyles[state.faceTexture];
}

function wire(id,key){
  document.getElementById(id).addEventListener('change',e=>{
    state[key] = e.target.value;
    updateAll();
  });
}

wire('skin','skin');
wire('bodyTexture','bodyTexture');
wire('faceTexture','faceTexture');
wire('headMesh','headMesh');
wire('hairMesh','hairMesh');
wire('hairColor','hairColor');

document.getElementById('randomBtn').addEventListener('click',()=>{
  const pools = {
    skin:['light','warm','deep'],
    bodyTexture:['green','red','blue'],
    faceTexture:['soft','sharp','cheerful'],
    headMesh:['classic','narrow','round'],
    hairMesh:['short','bob','bun'],
    hairColor:['brown','black','auburn']
  };
  for(const [key,values] of Object.entries(pools)){
    state[key] = values[Math.floor(Math.random()*values.length)];
    document.getElementById(key).value = state[key];
  }
  updateAll();
});

function resize(){
  const w = Math.max(1,canvas.clientWidth);
  const h = Math.max(1,canvas.clientHeight);
  const pr = Math.min(window.devicePixelRatio || 1,2);
  if(canvas.width !== Math.floor(w*pr) || canvas.height !== Math.floor(h*pr)){
    renderer.setSize(w,h,false);
    camera.aspect = w/h;
    camera.updateProjectionMatrix();
  }
}

let last = 0;
function animate(t){
  resize();
  const dt = Math.min(.05,(t-last)/1000 || 0);
  last = t;
  if(!matchMedia('(prefers-reduced-motion: reduce)').matches){
    person.position.y = Math.sin(t*.0015)*.006;
    person.rotation.z = Math.sin(t*.0011)*.008;
  }
  controls.update(dt);
  renderer.render(scene,camera);
  requestAnimationFrame(animate);
}

updateAll();
requestAnimationFrame(animate);
