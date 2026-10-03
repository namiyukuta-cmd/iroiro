import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const canvas=document.getElementById('simCanvas');
const renderer=new THREE.WebGLRenderer({canvas,antialias:true,alpha:true});
renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,2));
renderer.shadowMap.enabled=true;
renderer.shadowMap.type=THREE.PCFSoftShadowMap;
renderer.outputColorSpace=THREE.SRGBColorSpace;

const scene=new THREE.Scene();
const camera=new THREE.PerspectiveCamera(30,1,0.1,100);
camera.position.set(3.2,2.25,5.2);

const controls=new OrbitControls(camera,canvas);
controls.enableDamping=true;
controls.enablePan=false;
controls.minDistance=3.2;
controls.maxDistance=8;
controls.target.set(0,0.9,0);

scene.add(new THREE.HemisphereLight(0xffffff,0x756b5e,2.1));
const key=new THREE.DirectionalLight(0xffffff,2.4);
key.position.set(3,5,4);
key.castShadow=true;
scene.add(key);

const floor=new THREE.Mesh(
  new THREE.CircleGeometry(1.25,48),
  new THREE.MeshStandardMaterial({color:0xd8d2c5,roughness:1})
);
floor.rotation.x=-Math.PI/2;
floor.position.y=-0.13;
floor.receiveShadow=true;
scene.add(floor);

const state={
  skin:'warm',
  face:'soft',
  outfit:'green',
  hair:'short',
  hairColor:'brown'
};

const skins={
  warm:'#c99470',
  light:'#e2b995',
  deep:'#83583f'
};

const hairColors={
  brown:'#4a342b',
  black:'#1f2021',
  auburn:'#713e32'
};

const outfits={
  green:{shirt:'#69745f',detail:'#d6d1c5',pants:'#34383a',shoes:'#252526'},
  red:{shirt:'#7e504c',detail:'#e4d7c5',pants:'#413a38',shoes:'#292627'},
  blue:{shirt:'#526878',detail:'#c7d3d8',pants:'#2f3439',shoes:'#202326'}
};

function canvasTexture(draw,size=128){
  const c=document.createElement('canvas');
  c.width=size;c.height=size;
  const ctx=c.getContext('2d');
  draw(ctx,size);
  const tex=new THREE.CanvasTexture(c);
  tex.colorSpace=THREE.SRGBColorSpace;
  tex.magFilter=THREE.NearestFilter;
  tex.minFilter=THREE.LinearFilter;
  tex.needsUpdate=true;
  return tex;
}

function makeSkinTexture(color){
  return canvasTexture((ctx,s)=>{
    const g=ctx.createLinearGradient(0,0,s,s);
    g.addColorStop(0,color);
    g.addColorStop(1,shade(color,-8));
    ctx.fillStyle=g;
    ctx.fillRect(0,0,s,s);
  },64);
}

function makeClothTexture(base,detail,type){
  return canvasTexture((ctx,s)=>{
    ctx.fillStyle=base;
    ctx.fillRect(0,0,s,s);
    ctx.globalAlpha=.13;
    ctx.fillStyle='#ffffff';
    for(let y=0;y<s;y+=8)ctx.fillRect(0,y,s,1);
    ctx.globalAlpha=1;
    ctx.fillStyle=detail;
    if(type==='shirt'){
      ctx.fillRect(s*.43,0,s*.14,s*.24);
      ctx.fillRect(s*.46,s*.24,s*.08,s*.52);
    }
  },128);
}

function makeFaceTexture(style,skinColor){
  return canvasTexture((ctx,s)=>{
    ctx.clearRect(0,0,s,s);
    ctx.fillStyle=skinColor;
    ctx.fillRect(0,0,s,s);

    const eyeY=47;
    ctx.fillStyle='#2c2622';
    if(style==='soft'){
      ctx.fillRect(29,eyeY,13,5);
      ctx.fillRect(86,eyeY,13,5);
      ctx.fillRect(34,45,4,8);
      ctx.fillRect(90,45,4,8);
      ctx.strokeStyle='#6f443b';ctx.lineWidth=4;
      ctx.beginPath();ctx.arc(64,79,18,.22*Math.PI,.78*Math.PI);ctx.stroke();
    }else if(style==='sharp'){
      ctx.save();
      ctx.translate(35,47);ctx.rotate(-.14);ctx.fillRect(-8,-2,16,5);
      ctx.restore();
      ctx.save();
      ctx.translate(93,47);ctx.rotate(.14);ctx.fillRect(-8,-2,16,5);
      ctx.restore();
      ctx.fillStyle='#5f3b34';
      ctx.fillRect(50,82,28,4);
    }else{
      ctx.beginPath();ctx.arc(35,48,6,0,Math.PI*2);ctx.fill();
      ctx.beginPath();ctx.arc(93,48,6,0,Math.PI*2);ctx.fill();
      ctx.strokeStyle='#6f443b';ctx.lineWidth=4;
      ctx.beginPath();ctx.arc(64,79,20,.12*Math.PI,.88*Math.PI);ctx.stroke();
    }

    ctx.globalAlpha=.24;
    ctx.fillStyle='#b15f5c';
    ctx.beginPath();ctx.arc(22,67,12,0,Math.PI*2);ctx.fill();
    ctx.beginPath();ctx.arc(106,67,12,0,Math.PI*2);ctx.fill();
    ctx.globalAlpha=1;
  },128);
}

function shade(hex,amount){
  const n=parseInt(hex.slice(1),16);
  const r=Math.max(0,Math.min(255,(n>>16)+amount));
  const g=Math.max(0,Math.min(255,((n>>8)&255)+amount));
  const b=Math.max(0,Math.min(255,(n&255)+amount));
  return '#'+((1<<24)+(r<<16)+(g<<8)+b).toString(16).slice(1);
}

const skinMat=new THREE.MeshStandardMaterial({roughness:.92,metalness:0});
const faceMat=new THREE.MeshStandardMaterial({transparent:true,roughness:.95,metalness:0});
const shirtMat=new THREE.MeshStandardMaterial({roughness:1,metalness:0});
const pantsMat=new THREE.MeshStandardMaterial({roughness:1,metalness:0});
const shoeMat=new THREE.MeshStandardMaterial({roughness:.85,metalness:0});

const person=new THREE.Group();
person.rotation.y=-.15;
scene.add(person);

function box(name,w,h,d,x,y,z,mat,parent=person){
  const mesh=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),mat);
  mesh.name=name;
  mesh.position.set(x,y,z);
  mesh.castShadow=true;
  mesh.receiveShadow=true;
  parent.add(mesh);
  return mesh;
}

box('head',.46,.50,.40,0,1.66,0,skinMat);
box('neck',.17,.15,.17,0,1.34,0,skinMat);
box('torso',.60,.61,.31,0,1.03,0,shirtMat);
box('pelvis',.49,.23,.29,0,.65,0,pantsMat);

box('upperArmL',.17,.34,.18,-.40,1.13,0,shirtMat);
box('upperArmR',.17,.34,.18,.40,1.13,0,shirtMat);
box('lowerArmL',.15,.34,.16,-.40,.80,0,skinMat);
box('lowerArmR',.15,.34,.16,.40,.80,0,skinMat);
box('handL',.16,.14,.17,-.40,.56,.01,skinMat);
box('handR',.16,.14,.17,.40,.56,.01,skinMat);

box('legL',.21,.62,.22,-.14,.28,0,pantsMat);
box('legR',.21,.62,.22,.14,.28,0,pantsMat);
box('shoeL',.24,.14,.39,-.14,-.075,.075,shoeMat);
box('shoeR',.24,.14,.39,.14,-.075,.075,shoeMat);

const face=new THREE.Mesh(new THREE.PlaneGeometry(.34,.32),faceMat);
face.name='faceTexture';
face.position.set(0,1.64,.204);
face.castShadow=false;
person.add(face);

const hairGroup=new THREE.Group();
hairGroup.name='hair3D';
person.add(hairGroup);

function hairPiece(w,h,d,x,y,z,mat,geometry=null){
  const mesh=new THREE.Mesh(geometry||new THREE.BoxGeometry(w,h,d),mat);
  mesh.position.set(x,y,z);
  mesh.castShadow=true;
  hairGroup.add(mesh);
}

function rebuildHair(){
  hairGroup.clear();
  const color=hairColors[state.hairColor];
  const mat=new THREE.MeshStandardMaterial({color,roughness:.95,metalness:0});

  if(state.hair==='short'){
    hairPiece(.49,.14,.43,0,1.94,-.005,mat);
    hairPiece(.08,.24,.42,-.225,1.82,-.01,mat);
    hairPiece(.08,.24,.42,.225,1.82,-.01,mat);
    hairPiece(.45,.20,.08,0,1.82,-.205,mat);
  }else if(state.hair==='bob'){
    hairPiece(.50,.15,.44,0,1.94,-.005,mat);
    hairPiece(.10,.47,.43,-.225,1.73,-.01,mat);
    hairPiece(.10,.47,.43,.225,1.73,-.01,mat);
    hairPiece(.46,.42,.10,0,1.73,-.205,mat);
  }else{
    hairPiece(.49,.14,.43,0,1.94,-.005,mat);
    hairPiece(.08,.28,.42,-.225,1.82,-.01,mat);
    hairPiece(.08,.28,.42,.225,1.82,-.01,mat);
    hairPiece(.45,.30,.09,0,1.80,-.205,mat);
    const bun=new THREE.Mesh(new THREE.IcosahedronGeometry(.16,1),mat);
    bun.position.set(0,2.09,-.08);
    bun.castShadow=true;
    hairGroup.add(bun);
  }
}

function updateAppearance(){
  const skin=skins[state.skin];
  if(skinMat.map)skinMat.map.dispose();
  skinMat.map=makeSkinTexture(skin);
  skinMat.color.set('#ffffff');
  skinMat.needsUpdate=true;

  if(faceMat.map)faceMat.map.dispose();
  faceMat.map=makeFaceTexture(state.face,skin);
  faceMat.color.set('#ffffff');
  faceMat.needsUpdate=true;

  const outfit=outfits[state.outfit];
  if(shirtMat.map)shirtMat.map.dispose();
  shirtMat.map=makeClothTexture(outfit.shirt,outfit.detail,'shirt');
  shirtMat.color.set('#ffffff');
  shirtMat.needsUpdate=true;

  if(pantsMat.map)pantsMat.map.dispose();
  pantsMat.map=makeClothTexture(outfit.pants,outfit.detail,'pants');
  pantsMat.color.set('#ffffff');
  pantsMat.needsUpdate=true;

  shoeMat.map=null;
  shoeMat.color.set(outfit.shoes);
  shoeMat.needsUpdate=true;

  rebuildHair();

  document.getElementById('layerStatus').textContent=
    '肌：'+labelOf('skin',state.skin)+' / 顔：'+labelOf('face',state.face)+
    ' / 服：'+labelOf('outfit',state.outfit)+' / 髪：'+labelOf('hair',state.hair);
}

function labelOf(id,value){
  const select=document.getElementById(id);
  const option=[...select.options].find(o=>o.value===value);
  return option?option.textContent:value;
}

['skin','face','outfit','hair','hairColor'].forEach(id=>{
  document.getElementById(id).addEventListener('change',e=>{
    state[id]=e.target.value;
    updateAppearance();
  });
});

document.getElementById('randomBtn').addEventListener('click',()=>{
  const picks={
    skin:['warm','light','deep'],
    face:['soft','sharp','cheerful'],
    outfit:['green','red','blue'],
    hair:['short','bob','bun'],
    hairColor:['brown','black','auburn']
  };
  for(const [id,values] of Object.entries(picks)){
    state[id]=values[Math.floor(Math.random()*values.length)];
    document.getElementById(id).value=state[id];
  }
  updateAppearance();
});

function resize(){
  const w=Math.max(1,canvas.clientWidth);
  const h=Math.max(1,canvas.clientHeight);
  const pr=Math.min(window.devicePixelRatio||1,2);
  if(canvas.width!==Math.floor(w*pr)||canvas.height!==Math.floor(h*pr)){
    renderer.setSize(w,h,false);
    camera.aspect=w/h;
    camera.updateProjectionMatrix();
  }
}

let last=0;
function animate(t){
  resize();
  const dt=Math.min(.05,(t-last)/1000||0);
  last=t;
  person.position.y=Math.sin(t*.0015)*.006;
  person.rotation.z=Math.sin(t*.0011)*.008;
  controls.update(dt);
  renderer.render(scene,camera);
  requestAnimationFrame(animate);
}

updateAppearance();
requestAnimationFrame(animate);
