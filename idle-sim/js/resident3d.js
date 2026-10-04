import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const resident=document.getElementById('resident');
const canvas=document.getElementById('resident3dCanvas');

if(resident && canvas){
  boot().catch(err=>{
    console.error('3D resident load failed:',err);
  });
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

  scene.add(new THREE.HemisphereLight(0xffffff,0x777777,2.1));
  const key=new THREE.DirectionalLight(0xffffff,2.2);
  key.position.set(2.5,4,3);
  scene.add(key);

  const model=gltf.scene;
  model.traverse(obj=>{
    if(!obj.isMesh)return;
    obj.frustumCulled=false;
    obj.material=new THREE.MeshStandardMaterial({
      color:0xd8d1c2,
      roughness:0.92,
      metalness:0,
      flatShading:true
    });
  });

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

  resident.classList.add('model-ready');

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
