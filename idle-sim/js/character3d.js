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
  torso:[160,40,192,150],
  pelvis:[160,190,192,34],
  armL:[72,52,76,170],
  armR:[364,52,76,170],
  handL:[76,232,68,72],
  handR:[368,232,68,72],
  legL:[160,230,88,205],
  legR:[264,230,88,205],
  footL:[160,442,88,48],
  footR:[264,442,88,48],
  neck:[230,0,52,38]
};

function makeBodyAtlas(){
  const c=document.createElement('canvas');
  c.width=512;c.height=512;
  const ctx=c.getContext('2d');
  const skin=skins[state.skin];
  const outfit=outfits[state.bodyTexture];

  ctx.fillStyle=shade(skin,-7);
  ctx.fillRect(0,0,512,512);

  // torso: one painted skin, like classic Sims body skins
  ctx.fillStyle=outfit.shirt;
  ctx.fillRect(...BODY_UV.torso);
  const [tx,ty,tw,th]=BODY_UV.torso;
  const tg=ctx.createLinearGradient(tx,ty,tx+tw,ty);
  tg.addColorStop(0,'rgba(0,0,0,.18)');
  tg.addColorStop(.35,'rgba(255,255,255,.06)');
  tg.addColorStop(.65,'rgba(255,255,255,.06)');
  tg.addColorStop(1,'rgba(0,0,0,.18)');
  ctx.fillStyle=tg;ctx.fillRect(tx,ty,tw,th);
  ctx.fillStyle=outfit.trim;
  ctx.beginPath();
  ctx.moveTo(236,40);ctx.lineTo(276,40);ctx.lineTo(266,72);ctx.lineTo(246,72);ctx.closePath();ctx.fill();

  // pelvis / waistband
  ctx.fillStyle=shade(outfit.pants,7);ctx.fillRect(...BODY_UV.pelvis);
  ctx.fillStyle=outfit.trim;ctx.fillRect(160,190,192,5);

  // arms: short sleeves then skin
  for(const rect of [BODY_UV.armL,BODY_UV.armR]){
    const [x,y,w,h]=rect;
    ctx.fillStyle=outfit.shirt;ctx.fillRect(x,y,w,Math.round(h*.32));
    ctx.fillStyle=skin;ctx.fillRect(x,y+Math.round(h*.32),w,h-Math.round(h*.32));
    const g=ctx.createLinearGradient(x,y,x+w,y);
    g.addColorStop(0,'rgba(0,0,0,.13)');
    g.addColorStop(.5,'rgba(255,255,255,.04)');
    g.addColorStop(1,'rgba(0,0,0,.13)');
    ctx.fillStyle=g;ctx.fillRect(x,y,w,h);
  }

  // hands
  ctx.fillStyle=skin;ctx.fillRect(...BODY_UV.handL);ctx.fillRect(...BODY_UV.handR);

  // legs / trousers
  for(const rect of [BODY_UV.legL,BODY_UV.legR]){
    const [x,y,w,h]=rect;
    ctx.fillStyle=outfit.pants;ctx.fillRect(x,y,w,h);
    const g=ctx.createLinearGradient(x,y,x+w,y);
    g.addColorStop(0,'rgba(0,0,0,.18)');
    g.addColorStop(.5,'rgba(255,255,255,.05)');
    g.addColorStop(1,'rgba(0,0,0,.18)');
    ctx.fillStyle=g;ctx.fillRect(x,y,w,h);
  }

  // shoes
  ctx.fillStyle=outfit.shoes;ctx.fillRect(...BODY_UV.footL);ctx.fillRect(...BODY_UV.footR);
  ctx.fillStyle=shade(outfit.shoes,18);
  ctx.fillRect(160,474,88,16);ctx.fillRect(264,474,88,16);

  // neck
  ctx.fillStyle=skin;ctx.fillRect(...BODY_UV.neck);

  // subtle seams/details
  ctx.globalAlpha=.22;ctx.fillStyle='#000';
  ctx.fillRect(252,230,3,205);ctx.fillRect(308,230,3,205);
  ctx.globalAlpha=1;

  return c;
}

function bodyGeometry(){
  const pos=[],uv=[],idx=[];

  function uvPair(rect,u,v){
    const [x,y,w,h]=rect;
    return [(x+u*w)/512,1-(y+v*h)/512];
  }

  function addTube(a,b,rTopX,rTopZ,rBottomX,rBottomZ,segments,rect){
    const ax=new THREE.Vector3(...a), bx=new THREE.Vector3(...b);
    const dir=new THREE.Vector3().subVectors(bx,ax).normalize();
    const helper=Math.abs(dir.y)>.92?new THREE.Vector3(0,0,1):new THREE.Vector3(0,1,0);
    const right=new THREE.Vector3().crossVectors(dir,helper).normalize();
    const forward=new THREE.Vector3().crossVectors(right,dir).normalize();
    const base=pos.length/3;

    for(let ring=0;ring<2;ring++){
      const center=ring===0?ax:bx;
      const rx=ring===0?rTopX:rBottomX;
      const rz=ring===0?rTopZ:rBottomZ;
      for(let i=0;i<=segments;i++){
        const t=i/segments;
        const ang=t*Math.PI*2;
        const p=center.clone()
          .add(right.clone().multiplyScalar(Math.cos(ang)*rx))
          .add(forward.clone().multiplyScalar(Math.sin(ang)*rz));
        pos.push(p.x,p.y,p.z);
        const [u,v]=uvPair(rect,t,ring);
        uv.push(u,v);
      }
    }

    for(let i=0;i<segments;i++){
      const a0=base+i,b0=base+i+1,a1=base+(segments+1)+i,b1=a1+1;
      idx.push(a0,a1,b0,b0,a1,b1);
    }

    // caps
    for(const [center,ringIndex,flip] of [[ax,0,true],[bx,1,false]]){
      const ci=pos.length/3;
      pos.push(center.x,center.y,center.z);
      const [cu,cv]=uvPair(rect,.5,ringIndex);
      uv.push(cu,cv);
      const ringBase=base+ringIndex*(segments+1);
      for(let i=0;i<segments;i++){
        if(flip) idx.push(ci,ringBase+i+1,ringBase+i);
        else idx.push(ci,ringBase+i,ringBase+i+1);
      }
    }
  }

  // shoulder -> waist
  addTube([0,1.31,0],[0,.80,0],.34,.175,.225,.14,8,BODY_UV.torso);
  // waist -> hips
  addTube([0,.80,0],[0,.59,0],.225,.14,.29,.16,8,BODY_UV.pelvis);
  // neck
  addTube([0,1.39,0],[0,1.31,0],.095,.085,.09,.08,8,BODY_UV.neck);

  // arms, slightly angled
  addTube([-.34,1.23,0],[-.40,.67,.015],.095,.085,.065,.06,7,BODY_UV.armL);
  addTube([ .34,1.23,0],[ .40,.67,.015],.095,.085,.065,.06,7,BODY_UV.armR);
  addTube([-.40,.67,.015],[-.40,.52,.035],.072,.062,.07,.06,7,BODY_UV.handL);
  addTube([ .40,.67,.015],[ .40,.52,.035],.072,.062,.07,.06,7,BODY_UV.handR);

  // legs, wider thighs and slimmer ankles
  addTube([-.155,.60,0],[-.135,.06,.015],.135,.12,.082,.078,8,BODY_UV.legL);
  addTube([[.155,.60,0][0],[.155,.60,0][1],[.155,.60,0][2]],[.135,.06,.015],.135,.12,.082,.078,8,BODY_UV.legR);

  // shoes extend forward
  addTube([-.135,.06,.02],[-.135,-.05,.16],.095,.10,.115,.16,6,BODY_UV.footL);
  addTube([ .135,.06,.02],[ .135,-.05,.16],.095,.10,.115,.16,6,BODY_UV.footR);

  const g=new THREE.BufferGeometry();
  g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));
  g.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));
  g.setIndex(idx);
  g.computeVertexNormals();
  g.computeBoundingSphere();
  return g;
}

function makeFaceCanvas(){
  const c=document.createElement('canvas');
  c.width=256;c.height=256;
  const ctx=c.getContext('2d');
  const skin=skins[state.skin];

  // full head skin; seam goes at the back of the mesh
  ctx.fillStyle=skin;ctx.fillRect(0,0,256,256);

  // side shading like old painted skins
  const side=ctx.createLinearGradient(0,0,256,0);
  side.addColorStop(0,'rgba(0,0,0,.20)');
  side.addColorStop(.18,'rgba(0,0,0,.06)');
  side.addColorStop(.5,'rgba(255,255,255,.08)');
  side.addColorStop(.82,'rgba(0,0,0,.06)');
  side.addColorStop(1,'rgba(0,0,0,.20)');
  ctx.fillStyle=side;ctx.fillRect(0,0,256,256);

  // ears live toward the sides of the wrap
  ctx.fillStyle=shade(skin,-17);
  ctx.beginPath();ctx.ellipse(50,132,13,24,0,0,Math.PI*2);ctx.fill();
  ctx.beginPath();ctx.ellipse(206,132,13,24,0,0,Math.PI*2);ctx.fill();
  ctx.fillStyle=shade(skin,-30);
  ctx.beginPath();ctx.ellipse(50,132,5,12,0,0,Math.PI*2);ctx.fill();
  ctx.beginPath();ctx.ellipse(206,132,5,12,0,0,Math.PI*2);ctx.fill();

  // face front is centered in the texture
  ctx.globalAlpha=.15;ctx.fillStyle='#b75f5c';
  ctx.beginPath();ctx.ellipse(96,151,16,12,0,0,Math.PI*2);ctx.fill();
  ctx.beginPath();ctx.ellipse(160,151,16,12,0,0,Math.PI*2);ctx.fill();
  ctx.globalAlpha=1;

  ctx.fillStyle='#2d2724';
  if(state.faceTexture==='soft'){
    ctx.fillRect(96,116,22,5);ctx.fillRect(138,116,22,5);
    ctx.fillRect(104,112,5,14);ctx.fillRect(146,112,5,14);
    ctx.strokeStyle='#6e433c';ctx.lineWidth=4;
    ctx.beginPath();ctx.arc(128,157,26,.20*Math.PI,.80*Math.PI);ctx.stroke();
  }else if(state.faceTexture==='sharp'){
    ctx.save();ctx.translate(107,119);ctx.rotate(-.15);ctx.fillRect(-13,-3,26,6);ctx.restore();
    ctx.save();ctx.translate(149,119);ctx.rotate(.15);ctx.fillRect(-13,-3,26,6);ctx.restore();
    ctx.fillStyle='#68413a';ctx.fillRect(113,165,30,5);
  }else{
    ctx.beginPath();ctx.arc(107,120,6,0,Math.PI*2);ctx.fill();
    ctx.beginPath();ctx.arc(149,120,6,0,Math.PI*2);ctx.fill();
    ctx.strokeStyle='#6e433c';ctx.lineWidth=4;
    ctx.beginPath();ctx.arc(128,156,29,.12*Math.PI,.88*Math.PI);ctx.stroke();
  }

  ctx.strokeStyle=shade(skin,-34);ctx.lineWidth=3;
  ctx.beginPath();ctx.moveTo(128,127);ctx.lineTo(123,148);ctx.lineTo(132,151);ctx.stroke();
  ctx.strokeStyle='#594338';ctx.lineWidth=3;
  ctx.beginPath();ctx.moveTo(94,108);ctx.lineTo(117,106);ctx.stroke();
  ctx.beginPath();ctx.moveTo(139,106);ctx.lineTo(162,108);ctx.stroke();

  return c;
}

function headGeometry(width,height,depth){
  const g=new THREE.SphereGeometry(1,12,8,-Math.PI/2,Math.PI*2,0,Math.PI);
  g.scale(width/2,height/2,depth/2);
  g.computeVertexNormals();
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
    roughness:.95,
    metalness:0
  });

  const mesh=new THREE.Mesh(bodyGeometry(),bodyMat);
  mesh.name='BodyMesh_shared';
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
    roughness:.96,
    metalness:0,
    side:THREE.DoubleSide
  });

  const cap=new THREE.Mesh(
    new THREE.SphereGeometry(1,10,5,-Math.PI/2,Math.PI*2,0,Math.PI*.44),
    mat
  );
  cap.scale.set(.265,.31,.235);
  cap.position.set(0,1.69,0);
  cap.castShadow=true;
  hairGroup.add(cap);

  if(state.hairMesh==='short'){
    const back=new THREE.Mesh(new THREE.CapsuleGeometry(.055,.16,3,6),mat);
    back.scale.set(2.6,1,1.2);
    back.position.set(0,1.77,-.19);
    back.castShadow=true;
    hairGroup.add(back);
  }else if(state.hairMesh==='bob'){
    for(const x of [-.23,.23]){
      const side=new THREE.Mesh(new THREE.CapsuleGeometry(.075,.29,4,7),mat);
      side.position.set(x,1.65,-.015);
      side.castShadow=true;
      hairGroup.add(side);
    }
    const back=new THREE.Mesh(new THREE.CapsuleGeometry(.10,.32,4,7),mat);
    back.scale.set(1.65,1,1);
    back.position.set(0,1.64,-.18);
    back.castShadow=true;
    hairGroup.add(back);
  }else{
    const back=new THREE.Mesh(new THREE.CapsuleGeometry(.075,.25,4,7),mat);
    back.scale.set(2.0,1,1);
    back.position.set(0,1.67,-.19);
    back.castShadow=true;
    hairGroup.add(back);
    const bun=new THREE.Mesh(new THREE.IcosahedronGeometry(.15,1),mat);
    bun.position.set(0,1.99,-.08);
    bun.castShadow=true;
    hairGroup.add(bun);
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
