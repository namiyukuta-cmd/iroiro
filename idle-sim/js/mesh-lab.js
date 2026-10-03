import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const canvas=document.getElementById('meshCanvas');
const renderer=new THREE.WebGLRenderer({canvas,antialias:true,alpha:true});
renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,2));
renderer.shadowMap.enabled=true;
renderer.outputColorSpace=THREE.SRGBColorSpace;

const scene=new THREE.Scene();
const camera=new THREE.PerspectiveCamera(30,1,.1,100);
camera.position.set(3.2,2.2,5.2);

const controls=new OrbitControls(camera,canvas);
controls.enableDamping=true;
controls.enablePan=false;
controls.target.set(0,.95,0);
controls.minDistance=3;
controls.maxDistance=7;

scene.add(new THREE.HemisphereLight(0xffffff,0x6e665b,2.1));
const key=new THREE.DirectionalLight(0xffffff,2.4);
key.position.set(3,5,4);
key.castShadow=true;
scene.add(key);

const floor=new THREE.Mesh(
  new THREE.CircleGeometry(1.35,48),
  new THREE.MeshStandardMaterial({color:0xd9d2c5,roughness:1})
);
floor.rotation.x=-Math.PI/2;
floor.position.y=-.14;
floor.receiveShadow=true;
scene.add(floor);

const person=new THREE.Group();
person.rotation.y=-.14;
scene.add(person);

const skinMat=new THREE.MeshStandardMaterial({color:0xc5906d,roughness:.95,metalness:0,flatShading:true});
const clothMat=new THREE.MeshStandardMaterial({color:0x68715f,roughness:.98,metalness:0,flatShading:true});
const pantsMat=new THREE.MeshStandardMaterial({color:0x34383c,roughness:1,metalness:0,flatShading:true});
const shoeMat=new THREE.MeshStandardMaterial({color:0x242425,roughness:1,metalness:0,flatShading:true});
const hairMat=new THREE.MeshStandardMaterial({color:0x49342b,roughness:1,metalness:0,flatShading:true});

function buildLoft(name,rings,material,segments=8){
  const pos=[],idx=[];
  for(const ring of rings){
    for(let i=0;i<segments;i++){
      const p=ring[i];
      pos.push(p[0],p[1],p[2]);
    }
  }
  for(let r=0;r<rings.length-1;r++){
    const a=r*segments;
    const b=(r+1)*segments;
    for(let i=0;i<segments;i++){
      const n=(i+1)%segments;
      idx.push(a+i,b+i,a+n,a+n,b+i,b+n);
    }
  }
  const topCenter=pos.length/3;
  const tr=rings[0];
  pos.push(tr.reduce((s,p)=>s+p[0],0)/segments,tr.reduce((s,p)=>s+p[1],0)/segments,tr.reduce((s,p)=>s+p[2],0)/segments);
  for(let i=0;i<segments;i++){const n=(i+1)%segments;idx.push(topCenter,n,i);}
  const bottomCenter=pos.length/3;
  const br=rings[rings.length-1];
  pos.push(br.reduce((s,p)=>s+p[0],0)/segments,br.reduce((s,p)=>s+p[1],0)/segments,br.reduce((s,p)=>s+p[2],0)/segments);
  const bo=(rings.length-1)*segments;
  for(let i=0;i<segments;i++){const n=(i+1)%segments;idx.push(bottomCenter,bo+i,bo+n);}
  const g=new THREE.BufferGeometry();
  g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));
  g.setIndex(idx);
  g.computeVertexNormals();
  const m=new THREE.Mesh(g,material);
  m.name=name;m.castShadow=true;m.receiveShadow=true;person.add(m);
  return m;
}

const torso=[
[[0,1.36,.17],[.25,1.36,.12],[.35,1.36,0],[.25,1.36,-.11],[0,1.36,-.14],[-.25,1.36,-.11],[-.35,1.36,0],[-.25,1.36,.12]],
[[0,1.22,.19],[.23,1.22,.14],[.32,1.22,0],[.23,1.22,-.13],[0,1.22,-.16],[-.23,1.22,-.13],[-.32,1.22,0],[-.23,1.22,.14]],
[[0,1.03,.16],[.19,1.03,.12],[.27,1.03,0],[.19,1.03,-.11],[0,1.03,-.14],[-.19,1.03,-.11],[-.27,1.03,0],[-.19,1.03,.12]],
[[0,.84,.13],[.16,.84,.10],[.22,.84,0],[.16,.84,-.09],[0,.84,-.12],[-.16,.84,-.09],[-.22,.84,0],[-.16,.84,.10]],
[[0,.67,.16],[.21,.67,.12],[.29,.67,0],[.21,.67,-.11],[0,.67,-.15],[-.21,.67,-.11],[-.29,.67,0],[-.21,.67,.12]]
];
buildLoft('torso',torso,clothMat,8);

const neck=[
[[0,1.46,.075],[.06,1.46,.055],[.085,1.46,0],[.06,1.46,-.05],[0,1.46,-.065],[-.06,1.46,-.05],[-.085,1.46,0],[-.06,1.46,.055]],
[[0,1.36,.08],[.065,1.36,.06],[.09,1.36,0],[.065,1.36,-.055],[0,1.36,-.07],[-.065,1.36,-.055],[-.09,1.36,0],[-.065,1.36,.06]]
];
buildLoft('neck',neck,skinMat,8);

function arm(side){
  const s=side;
  return [
  [[s*.34,1.30,.07],[s*.39,1.29,.05],[s*.405,1.29,0],[s*.39,1.29,-.05],[s*.34,1.30,-.07],[s*.30,1.31,-.05],[s*.29,1.31,0],[s*.30,1.31,.05]],
  [[s*.36,1.12,.065],[s*.40,1.11,.045],[s*.415,1.11,0],[s*.40,1.11,-.045],[s*.36,1.12,-.065],[s*.325,1.13,-.045],[s*.315,1.13,0],[s*.325,1.13,.045]],
  [[s*.385,.91,.055],[s*.415,.90,.04],[s*.425,.90,0],[s*.415,.90,-.04],[s*.385,.91,-.055],[s*.355,.92,-.04],[s*.345,.92,0],[s*.355,.92,.04]],
  [[s*.395,.71,.05],[s*.422,.70,.035],[s*.43,.70,0],[s*.422,.70,-.035],[s*.395,.71,-.05],[s*.368,.72,-.035],[s*.36,.72,0],[s*.368,.72,.035]]
  ];
}
buildLoft('armL',arm(-1),skinMat,8);
buildLoft('armR',arm(1),skinMat,8);

function hand(side){
  const s=side;
  return [
  [[s*.395,.71,.05],[s*.425,.71,.035],[s*.435,.71,0],[s*.425,.71,-.035],[s*.395,.71,-.05],[s*.365,.71,-.035],[s*.355,.71,0],[s*.365,.71,.035]],
  [[s*.395,.55,.045],[s*.423,.55,.03],[s*.432,.55,0],[s*.423,.55,-.03],[s*.395,.55,-.045],[s*.367,.55,-.03],[s*.358,.55,0],[s*.367,.55,.03]]
  ];
}
buildLoft('handL',hand(-1),skinMat,8);
buildLoft('handR',hand(1),skinMat,8);

function leg(side){
  const s=side;
  return [
  [[s*.15,.67,.11],[s*.24,.66,.08],[s*.27,.66,0],[s*.24,.66,-.08],[s*.15,.67,-.11],[s*.08,.67,-.08],[s*.06,.67,0],[s*.08,.67,.08]],
  [[s*.145,.50,.105],[s*.225,.49,.075],[s*.25,.49,0],[s*.225,.49,-.075],[s*.145,.50,-.105],[s*.08,.50,-.075],[s*.065,.50,0],[s*.08,.50,.075]],
  [[s*.135,.31,.085],[s*.195,.30,.06],[s*.215,.30,0],[s*.195,.30,-.06],[s*.135,.31,-.085],[s*.085,.31,-.06],[s*.07,.31,0],[s*.085,.31,.06]],
  [[s*.132,.16,.078],[s*.18,.15,.055],[s*.195,.15,0],[s*.18,.15,-.055],[s*.132,.16,-.078],[s*.09,.16,-.055],[s*.078,.16,0],[s*.09,.16,.055]],
  [[s*.13,.045,.065],[s*.17,.04,.045],[s*.182,.04,0],[s*.17,.04,-.045],[s*.13,.045,-.065],[s*.095,.045,-.045],[s*.085,.045,0],[s*.095,.045,.045]]
  ];
}
buildLoft('legL',leg(-1),pantsMat,8);
buildLoft('legR',leg(1),pantsMat,8);

function shoe(side){
  const m=new THREE.Mesh(new THREE.BoxGeometry(.18,.12,.32),shoeMat);
  m.position.set(side*.13,-.02,.08);m.castShadow=true;person.add(m);
}
shoe(-1);shoe(1);

const head=[
[[0,2.02,.08],[.11,2.01,.06],[.15,2.00,0],[.11,2.01,-.06],[0,2.02,-.08],[-.11,2.01,-.06],[-.15,2.00,0],[-.11,2.01,.06]],
[[0,1.94,.18],[.18,1.93,.13],[.23,1.92,0],[.18,1.93,-.13],[0,1.94,-.17],[-.18,1.93,-.13],[-.23,1.92,0],[-.18,1.93,.13]],
[[0,1.78,.20],[.19,1.77,.145],[.24,1.76,0],[.19,1.77,-.145],[0,1.78,-.19],[-.19,1.77,-.145],[-.24,1.76,0],[-.19,1.77,.145]],
[[0,1.63,.19],[.18,1.62,.14],[.22,1.61,0],[.18,1.62,-.14],[0,1.63,-.18],[-.18,1.62,-.14],[-.22,1.61,0],[-.18,1.62,.14]],
[[0,1.51,.14],[.13,1.50,.10],[.16,1.49,0],[.13,1.50,-.10],[0,1.51,-.13],[-.13,1.50,-.10],[-.16,1.49,0],[-.13,1.50,.10]]
];
buildLoft('head',head,skinMat,8);

const hair=[
[[0,2.08,.05],[.10,2.07,.04],[.14,2.06,0],[.10,2.07,-.04],[0,2.08,-.055],[-.10,2.07,-.04],[-.14,2.06,0],[-.10,2.07,.04]],
[[0,2.01,.15],[.16,2.00,.11],[.21,1.99,0],[.16,2.00,-.11],[0,2.01,-.15],[-.16,2.00,-.11],[-.21,1.99,0],[-.16,2.00,.11]],
[[0,1.91,.205],[.19,1.90,.145],[.235,1.89,0],[.19,1.90,-.145],[0,1.91,-.20],[-.19,1.90,-.145],[-.235,1.89,0],[-.19,1.90,.145]]
];
buildLoft('hair',hair,hairMat,8);

const wireMaterial=new THREE.MeshBasicMaterial({color:0x242424,wireframe:true,transparent:true,opacity:.55});
const savedMaterials=new Map();
function setWire(on){
  person.traverse(o=>{
    if(!o.isMesh)return;
    if(on){
      if(!savedMaterials.has(o))savedMaterials.set(o,o.material);
      o.material=wireMaterial;
    }else if(savedMaterials.has(o)){
      o.material=savedMaterials.get(o);
    }
  });
}

document.getElementById('frontBtn').onclick=()=>person.rotation.y=0;
document.getElementById('sideBtn').onclick=()=>person.rotation.y=-Math.PI/2;
document.getElementById('backBtn').onclick=()=>person.rotation.y=Math.PI;
document.getElementById('wireBtn').onclick=()=>setWire(true);
document.getElementById('solidBtn').onclick=()=>setWire(false);
document.getElementById('resetBtn').onclick=()=>{person.rotation.y=-.14;camera.position.set(3.2,2.2,5.2);controls.target.set(0,.95,0);controls.update();};

function resize(){
  const w=Math.max(1,canvas.clientWidth),h=Math.max(1,canvas.clientHeight);
  const pr=Math.min(window.devicePixelRatio||1,2);
  if(canvas.width!==Math.floor(w*pr)||canvas.height!==Math.floor(h*pr)){
    renderer.setSize(w,h,false);
    camera.aspect=w/h;
    camera.updateProjectionMatrix();
  }
}
function animate(){resize();controls.update();renderer.render(scene,camera);requestAnimationFrame(animate);}
animate();
