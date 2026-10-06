import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const resident=document.getElementById('resident');
const canvas=document.getElementById('resident3dCanvas');
const skinBtn=document.getElementById('skinBtn');
const outfitBtn=document.getElementById('outfitBtn');
const hairBtn=document.getElementById('hairBtn');

const APPEARANCE_KEY='idle-sim-appearance-v1';

const SKINS=[0xd6a77a,0xf0c7a3,0xa56f4f,0x704735];
const HAIRS=[0x553421,0x211c19,0xb58a4c,0x7c3427];
const OUTFITS=[
  {top:0x4f7658,bottom:0x687482,shoes:0x302c28},
  {top:0x39556f,bottom:0x34383d,shoes:0x211f1d},
  {top:0x7b454c,bottom:0xb3a285,shoes:0x46382f},
  {top:0xa2763d,bottom:0x4b514b,shoes:0x2b2926}
];

let appearance=loadAppearance();
let materials=null;

if(resident && canvas){
  boot().catch(err=>{
    console.error('3D resident load failed:',err);
  });
}

function loadAppearance(){
  try{
    const saved=JSON.parse(localStorage.getItem(APPEARANCE_KEY)||'{}');
    return {
      skin:Number.isInteger(saved.skin)?saved.skin%SKINS.length:0,
      outfit:Number.isInteger(saved.outfit)?saved.outfit%OUTFITS.length:0,
      hair:Number.isInteger(saved.hair)?saved.hair%HAIRS.length:0
    };
  }catch(_){
    return {skin:0,outfit:0,hair:0};
  }
}

function saveAppearance(){
  localStorage.setItem(APPEARANCE_KEY,JSON.stringify(appearance));
}

function applyAppearance(){
  if(!materials)return;
  const outfit=OUTFITS[appearance.outfit];
  materials.skin.color.setHex(SKINS[appearance.skin]);
  materials.top.color.setHex(outfit.top);
  materials.bottom.color.setHex(outfit.bottom);
  materials.shoes.color.setHex(outfit.shoes);
  materials.hair.color.setHex(HAIRS[appearance.hair]);
}

function bindAppearanceButtons(){
  skinBtn?.addEventListener('click',()=>{
    appearance.skin=(appearance.skin+1)%SKINS.length;
    applyAppearance();saveAppearance();
  });
  outfitBtn?.addEventListener('click',()=>{
    appearance.outfit=(appearance.outfit+1)%OUTFITS.length;
    applyAppearance();saveAppearance();
  });
  hairBtn?.addEventListener('click',()=>{
    appearance.hair=(appearance.hair+1)%HAIRS.length;
    applyAppearance();saveAppearance();
  });
}

function regionFor(x,y,z){
  // 0 skin / 1 top / 2 bottom / 3 shoes / 4 hair
  if(y < -0.82)return 3;
  if(y < 0.08 && Math.abs(x)<0.23)return 2;
  if(y>=0.08 && y<0.59 && Math.abs(x)<0.22)return 1;
  if(y>=0.43 && y<0.60 && Math.abs(x)>=0.22 && Math.abs(x)<0.38)return 1;
  if(y>0.62 && (z < -0.025 || y>0.86 || (y>0.80 && Math.abs(x)>0.07)))return 4;
  return 0;
}

function splitIntoSimMaterials(mesh){
  const geometry=mesh.geometry;
  const position=geometry.getAttribute('position');
  const index=geometry.index;
  if(!position || !index)return;

  const buckets=[[],[],[],[],[]];
  for(let i=0;i<index.count;i+=3){
    const a=index.getX(i),b=index.getX(i+1),c=index.getX(i+2);
    const x=(position.getX(a)+position.getX(b)+position.getX(c))/3;
    const y=(position.getY(a)+position.getY(b)+position.getY(c))/3;
    const z=(position.getZ(a)+position.getZ(b)+position.getZ(c))/3;
    buckets[regionFor(x,y,z)].push(a,b,c);
  }

  const IndexArray=position.count>65535?Uint32Array:Uint16Array;
  const ordered=new IndexArray(index.count);
  geometry.clearGroups();

  let offset=0;
  for(let materialIndex=0;materialIndex<buckets.length;materialIndex++){
    const bucket=buckets[materialIndex];
    ordered.set(bucket,offset);
    geometry.addGroup(offset,bucket.length,materialIndex);
    offset+=bucket.length;
  }
  geometry.setIndex(new THREE.BufferAttribute(ordered,1));
  geometry.computeVertexNormals();

  materials={
    skin:new THREE.MeshStandardMaterial({name:'MAT_Skin',roughness:.94,metalness:0,flatShading:true}),
    top:new THREE.MeshStandardMaterial({name:'MAT_Top',roughness:.9,metalness:0,flatShading:true}),
    bottom:new THREE.MeshStandardMaterial({name:'MAT_Bottom',roughness:.92,metalness:0,flatShading:true}),
    shoes:new THREE.MeshStandardMaterial({name:'MAT_Shoes',roughness:.86,metalness:0,flatShading:true}),
    hair:new THREE.MeshStandardMaterial({name:'MAT_Hair',roughness:.96,metalness:0,flatShading:true})
  };

  mesh.material=[materials.skin,materials.top,materials.bottom,materials.shoes,materials.hair];
  mesh.frustumCulled=false;
  applyAppearance();
}

function addSimpleFace(model){
  const head=model.getObjectByName('mixamorig:Head');
  if(!head)return;

  const ink=new THREE.MeshBasicMaterial({color:0x2a211d,side:THREE.DoubleSide});
  const eyeGeo=new THREE.CircleGeometry(0.011,7);

  for(const x of [-0.030,0.030]){
    const eye=new THREE.Mesh(eyeGeo,ink);
    eye.position.set(x,0.092,0.108);
    head.add(eye);
  }

  const mouth=new THREE.Mesh(new THREE.PlaneGeometry(0.040,0.006),ink);
  mouth.position.set(0,0.025,0.108);
  head.add(mouth);
}

async function boot(){
  if(typeof DecompressionStream==='undefined')throw new Error('gzip decompression is unavailable');

  const partUrls=Array.from({length:11},(_,i)=>
    new URL('../models/maya-lowpoly-autorig.glb.gz.b64.'+String(i).padStart(2,'0'),import.meta.url)
  );
  const texts=await Promise.all(partUrls.map(async url=>{
    const res=await fetch(url,{cache:'no-store'});
    if(!res.ok)throw new Error('model part '+res.status);
    return res.text();
  }));
  const b64=texts.join('').replace(/\s+/g,'');
  const binary=atob(b64);
  const gz=new Uint8Array(binary.length);
  for(let i=0;i<binary.length;i++)gz[i]=binary.charCodeAt(i);

  const stream=new Blob([gz]).stream().pipeThrough(new DecompressionStream('gzip'));
  const buffer=await new Response(stream).arrayBuffer();

  const gltf=await new Promise((resolve,reject)=>{
    new GLTFLoader().parse(buffer,'',resolve,reject);
  });

  const renderer=new THREE.WebGLRenderer({canvas,alpha:true,antialias:true,powerPreference:'low-power'});
  renderer.setClearColor(0x000000,0);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,1.5));
  renderer.outputColorSpace=THREE.SRGBColorSpace;

  const scene=new THREE.Scene();
  const camera=new THREE.PerspectiveCamera(30,1,0.01,100);
  camera.position.set(0,0.04,4.15);
  camera.lookAt(0,0,0);

  scene.add(new THREE.HemisphereLight(0xffffff,0x6d675e,1.8));
  const key=new THREE.DirectionalLight(0xffffff,1.8);
  key.position.set(2.5,4,3);
  scene.add(key);

  const model=gltf.scene;
  model.traverse(obj=>{
    if(obj.isSkinnedMesh || obj.isMesh)splitIntoSimMaterials(obj);
  });
  addSimpleFace(model);

  const box=new THREE.Box3().setFromObject(model);
  const size=box.getSize(new THREE.Vector3());
  const center=box.getCenter(new THREE.Vector3());
  model.position.set(-center.x,-center.y,-center.z);
  const scale=size.y>0?1.82/size.y:1;
  model.scale.setScalar(scale);
  scene.add(model);

  const mixer=new THREE.AnimationMixer(model);
  const actions={};
  for(const clip of gltf.animations||[])actions[clip.name]=mixer.clipAction(clip);

  let current=null;
  function play(name){
    const next=actions[name]||actions.Idle||Object.values(actions)[0];
    if(!next||next===current)return;
    next.reset().fadeIn(0.12).play();
    if(current)current.fadeOut(0.12);
    current=next;
  }
  play('Idle');

  let walkTimer=null;
  let lastLeft=resident.style.left;
  let lastTop=resident.style.top;
  const observer=new MutationObserver(()=>{
    const left=resident.style.left;
    const top=resident.style.top;
    if(left===lastLeft && top===lastTop)return;
    lastLeft=left;
    lastTop=top;
    play('Walk');
    clearTimeout(walkTimer);
    walkTimer=setTimeout(()=>play('Idle'),620);
  });
  observer.observe(resident,{attributes:true,attributeFilter:['style']});

  function resize(){
    const rect=canvas.getBoundingClientRect();
    const w=Math.max(1,Math.round(rect.width));
    const h=Math.max(1,Math.round(rect.height));
    renderer.setSize(w,h,false);
    camera.aspect=w/h;
    camera.updateProjectionMatrix();
  }
  resize();
  const resizeObserver=new ResizeObserver(resize);
  resizeObserver.observe(canvas);

  bindAppearanceButtons();
  resident.classList.add('model-ready');

  window.IdleSimResident={
    setAppearance(next={}){
      if(Number.isInteger(next.skin))appearance.skin=((next.skin%SKINS.length)+SKINS.length)%SKINS.length;
      if(Number.isInteger(next.outfit))appearance.outfit=((next.outfit%OUTFITS.length)+OUTFITS.length)%OUTFITS.length;
      if(Number.isInteger(next.hair))appearance.hair=((next.hair%HAIRS.length)+HAIRS.length)%HAIRS.length;
      applyAppearance();saveAppearance();
    },
    getAppearance(){return {...appearance}},
    materialNames:['MAT_Skin','MAT_Top','MAT_Bottom','MAT_Shoes','MAT_Hair'],
    animationNames:Object.keys(actions)
  };

  const clock=new THREE.Clock();
  let raf=0;
  function frame(){
    raf=requestAnimationFrame(frame);
    mixer.update(Math.min(clock.getDelta(),0.05));
    renderer.render(scene,camera);
  }
  frame();

  window.addEventListener('pagehide',()=>{
    cancelAnimationFrame(raf);
    clearTimeout(walkTimer);
    observer.disconnect();
    resizeObserver.disconnect();
    renderer.dispose();
  },{once:true});
}
