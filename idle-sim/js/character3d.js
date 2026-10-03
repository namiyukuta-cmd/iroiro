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

function makeBodyAtlas(){
  const c = document.createElement('canvas');
  c.width = 512;
  c.height = 512;
  const ctx = c.getContext('2d');
  const skin = skins[state.skin];
  const outfit = outfits[state.bodyTexture];

  ctx.fillStyle = '#9f9a90';
  ctx.fillRect(0,0,512,512);

  // torso
  ctx.fillStyle = outfit.shirt;
  ctx.fillRect(0,0,256,256);
  ctx.fillStyle = outfit.trim;
  ctx.fillRect(112,0,32,72);
  ctx.globalAlpha = .16;
  ctx.fillStyle = '#ffffff';
  for(let y=12;y<256;y+=20) ctx.fillRect(0,y,256,2);
  ctx.globalAlpha = 1;

  // arms: upper cloth, lower skin
  ctx.fillStyle = outfit.shirt;
  ctx.fillRect(256,0,128,126);
  ctx.fillStyle = skin;
  ctx.fillRect(256,126,128,130);

  // legs
  ctx.fillStyle = outfit.pants;
  ctx.fillRect(0,256,256,256);
  ctx.globalAlpha = .13;
  ctx.fillStyle = '#ffffff';
  for(let x=18;x<256;x+=28) ctx.fillRect(x,256,2,256);
  ctx.globalAlpha = 1;

  // hands / neck / skin region
  ctx.fillStyle = skin;
  ctx.fillRect(256,256,128,128);

  // shoes
  ctx.fillStyle = outfit.shoes;
  ctx.fillRect(384,256,128,128);
  ctx.fillStyle = shade(outfit.shoes,18);
  ctx.fillRect(384,350,128,34);

  // spare region / palette
  ctx.fillStyle = shade(skin,-8);
  ctx.fillRect(256,384,128,128);
  ctx.fillStyle = shade(outfit.shirt,-10);
  ctx.fillRect(384,384,128,128);

  return c;
}

const HEAD_UV = {
  front:[80,72,96,112],
  left:[32,72,48,112],
  right:[176,72,48,112],
  top:[80,24,96,48],
  bottom:[80,184,96,48],
  back:[80,232,96,24]
};

function makeFaceCanvas(){
  const c = document.createElement('canvas');
  c.width = 256;
  c.height = 256;
  const ctx = c.getContext('2d');
  const skin = skins[state.skin];

  ctx.fillStyle = shade(skin,-14);
  ctx.fillRect(0,0,256,256);

  // scalp / top
  ctx.fillStyle = shade(skin,5);
  ctx.fillRect(...HEAD_UV.top);

  // back of head
  ctx.fillStyle = shade(skin,-10);
  ctx.fillRect(...HEAD_UV.back);

  // side of head
  ctx.fillStyle = shade(skin,-3);
  ctx.fillRect(...HEAD_UV.left);
  ctx.fillRect(...HEAD_UV.right);

  // underside / jaw
  ctx.fillStyle = shade(skin,-18);
  ctx.fillRect(...HEAD_UV.bottom);

  // face front
  const [fx,fy,fw,fh] = HEAD_UV.front;
  const g = ctx.createLinearGradient(fx,fy,fx+fw,fy+fh);
  g.addColorStop(0,shade(skin,7));
  g.addColorStop(.58,skin);
  g.addColorStop(1,shade(skin,-12));
  ctx.fillStyle = g;
  ctx.fillRect(fx,fy,fw,fh);

  // ears on the side panels
  ctx.fillStyle = shade(skin,-18);
  ctx.beginPath();ctx.ellipse(56,128,10,18,0,0,Math.PI*2);ctx.fill();
  ctx.beginPath();ctx.ellipse(200,128,10,18,0,0,Math.PI*2);ctx.fill();
  ctx.fillStyle = shade(skin,-30);
  ctx.beginPath();ctx.ellipse(56,128,4,9,0,0,Math.PI*2);ctx.fill();
  ctx.beginPath();ctx.ellipse(200,128,4,9,0,0,Math.PI*2);ctx.fill();

  // subtle cheeks
  ctx.globalAlpha = .16;
  ctx.fillStyle = '#b95f60';
  ctx.beginPath();ctx.arc(101,143,12,0,Math.PI*2);ctx.fill();
  ctx.beginPath();ctx.arc(155,143,12,0,Math.PI*2);ctx.fill();
  ctx.globalAlpha = 1;

  // face features are painted only in the front UV island
  ctx.fillStyle = '#2b2623';
  if(state.faceTexture === 'soft'){
    ctx.fillRect(100,116,17,5);
    ctx.fillRect(139,116,17,5);
    ctx.fillRect(106,112,4,13);
    ctx.fillRect(146,112,4,13);
    ctx.strokeStyle = '#70453d';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(128,151,22,.20*Math.PI,.80*Math.PI);
    ctx.stroke();
  }else if(state.faceTexture === 'sharp'){
    ctx.save();ctx.translate(108,119);ctx.rotate(-.16);ctx.fillRect(-11,-3,22,6);ctx.restore();
    ctx.save();ctx.translate(148,119);ctx.rotate(.16);ctx.fillRect(-11,-3,22,6);ctx.restore();
    ctx.fillStyle = '#69423b';
    ctx.fillRect(114,160,28,5);
  }else{
    ctx.beginPath();ctx.arc(108,119,6,0,Math.PI*2);ctx.fill();
    ctx.beginPath();ctx.arc(148,119,6,0,Math.PI*2);ctx.fill();
    ctx.strokeStyle = '#70453d';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(128,151,25,.12*Math.PI,.88*Math.PI);
    ctx.stroke();
  }

  // nose and brows
  ctx.strokeStyle = shade(skin,-32);
  ctx.lineWidth = 3;
  ctx.beginPath();ctx.moveTo(128,126);ctx.lineTo(124,145);ctx.lineTo(132,147);ctx.stroke();
  ctx.strokeStyle = '#5b4438';
  ctx.lineWidth = 3;
  ctx.beginPath();ctx.moveTo(98,108);ctx.lineTo(117,106);ctx.stroke();
  ctx.beginPath();ctx.moveTo(139,106);ctx.lineTo(158,108);ctx.stroke();

  // neck transition along lower front
  ctx.fillStyle = shade(skin,-8);
  ctx.fillRect(115,174,26,10);

  return c;
}

function headGeometry(width,height,depth){
  const hx=width/2, hy=height/2, hz=depth/2;
  const faces=[
    {name:'right', normal:[1,0,0], p:[[hx,-hy,hz],[hx,-hy,-hz],[hx,hy,-hz],[hx,hy,hz]]},
    {name:'left', normal:[-1,0,0], p:[[-hx,-hy,-hz],[-hx,-hy,hz],[-hx,hy,hz],[-hx,hy,-hz]]},
    {name:'top', normal:[0,1,0], p:[[-hx,hy,hz],[hx,hy,hz],[hx,hy,-hz],[-hx,hy,-hz]]},
    {name:'bottom', normal:[0,-1,0], p:[[-hx,-hy,-hz],[hx,-hy,-hz],[hx,-hy,hz],[-hx,-hy,hz]]},
    {name:'front', normal:[0,0,1], p:[[-hx,-hy,hz],[hx,-hy,hz],[hx,hy,hz],[-hx,hy,hz]]},
    {name:'back', normal:[0,0,-1], p:[[hx,-hy,-hz],[-hx,-hy,-hz],[-hx,hy,-hz],[hx,hy,-hz]]}
  ];
  const pos=[],norm=[],uv=[],idx=[];
  faces.forEach((face,fi)=>{
    const base=fi*4;
    face.p.forEach(p=>pos.push(...p));
    for(let i=0;i<4;i++)norm.push(...face.normal);
    const [x,y,w,h]=HEAD_UV[face.name];
    const u0=x/256, u1=(x+w)/256;
    const v0=1-(y+h)/256, v1=1-y/256;
    uv.push(u0,v0, u1,v0, u1,v1, u0,v1);
    idx.push(base,base+1,base+2, base,base+2,base+3);
  });
  const g=new THREE.BufferGeometry();
  g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));
  g.setAttribute('normal',new THREE.Float32BufferAttribute(norm,3));
  g.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));
  g.setIndex(idx);
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
  bodyGroup = new THREE.Group();
  bodyGroup.name = 'BodyMesh';
  person.add(bodyGroup);

  const torsoMat = textureMaterial(atlasTexture(bodyAtlas,0,0,256,256));
  const armUpperMat = textureMaterial(atlasTexture(bodyAtlas,256,0,128,126));
  const armLowerMat = textureMaterial(atlasTexture(bodyAtlas,256,126,128,130));
  const legMat = textureMaterial(atlasTexture(bodyAtlas,0,256,256,256));
  const skinMat = textureMaterial(atlasTexture(bodyAtlas,256,256,128,128));
  const shoeMat = textureMaterial(atlasTexture(bodyAtlas,384,256,128,128),.85);

  addBox(bodyGroup,'neck',.17,.15,.17,0,1.34,0,skinMat);
  addBox(bodyGroup,'torso',.60,.61,.31,0,1.03,0,torsoMat);
  addBox(bodyGroup,'pelvis',.49,.23,.29,0,.65,0,legMat);

  addBox(bodyGroup,'upperArmL',.17,.34,.18,-.40,1.13,0,armUpperMat);
  addBox(bodyGroup,'upperArmR',.17,.34,.18,.40,1.13,0,armUpperMat);
  addBox(bodyGroup,'lowerArmL',.15,.34,.16,-.40,.80,0,armLowerMat);
  addBox(bodyGroup,'lowerArmR',.15,.34,.16,.40,.80,0,armLowerMat);
  addBox(bodyGroup,'handL',.16,.14,.17,-.40,.56,.01,skinMat);
  addBox(bodyGroup,'handR',.16,.14,.17,.40,.56,.01,skinMat);

  addBox(bodyGroup,'legL',.21,.62,.22,-.14,.28,0,legMat);
  addBox(bodyGroup,'legR',.21,.62,.22,.14,.28,0,legMat);
  addBox(bodyGroup,'shoeL',.24,.14,.39,-.14,-.075,.075,shoeMat);
  addBox(bodyGroup,'shoeR',.24,.14,.39,.14,-.075,.075,shoeMat);
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
  hairGroup = new THREE.Group();
  hairGroup.name = 'HairMesh';
  person.add(hairGroup);

  const mat = new THREE.MeshStandardMaterial({
    color:hairColors[state.hairColor],
    roughness:.96,
    metalness:0
  });

  const piece = (w,h,d,x,y,z,geometry=null)=>{
    const mesh = new THREE.Mesh(geometry || new THREE.BoxGeometry(w,h,d),mat);
    mesh.position.set(x,y,z);
    mesh.castShadow = true;
    hairGroup.add(mesh);
  };

  if(state.hairMesh === 'short'){
    piece(.49,.14,.43,0,1.94,-.005);
    piece(.08,.24,.42,-.225,1.82,-.01);
    piece(.08,.24,.42,.225,1.82,-.01);
    piece(.45,.20,.08,0,1.82,-.205);
  }else if(state.hairMesh === 'bob'){
    piece(.50,.15,.44,0,1.94,-.005);
    piece(.10,.47,.43,-.225,1.73,-.01);
    piece(.10,.47,.43,.225,1.73,-.01);
    piece(.46,.42,.10,0,1.73,-.205);
  }else{
    piece(.49,.14,.43,0,1.94,-.005);
    piece(.08,.28,.42,-.225,1.82,-.01);
    piece(.08,.28,.42,.225,1.82,-.01);
    piece(.45,.30,.09,0,1.80,-.205);
    piece(0,0,0,0,2.09,-.08,new THREE.IcosahedronGeometry(.16,1));
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
