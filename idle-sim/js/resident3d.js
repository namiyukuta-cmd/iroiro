import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const resident=document.getElementById('resident');
const canvas=document.getElementById('resident3dCanvas');
const outfitBtn=document.getElementById('outfitBtn');

const APPEARANCE_KEY='idle-sim-body-texture-v1';
const BODY_TEXTURES=[
  '../textures/female_v1/body_green.svg',
  '../textures/female_v1/body_blue.svg'
];

let outfitIndex=Number(localStorage.getItem(APPEARANCE_KEY)||0);
if(!Number.isInteger(outfitIndex) || outfitIndex<0)outfitIndex=0;
outfitIndex%=BODY_TEXTURES.length;

if(resident && canvas){
  boot().catch(err=>{
    console.error('3D resident load failed:',err);
  });
}

function clamp01(v){return Math.max(0,Math.min(1,v))}

function classifyPanel(nx,ny,nz){
  const ax=Math.abs(nx),ay=Math.abs(ny),az=Math.abs(nz);
  if(az>=ax && az>=ay)return nz>=0?0:1; // FRONT / BACK
  if(ax>=ay)return nx>=0?3:2;            // RIGHT / LEFT
  return ny>=0?4:5;                      // TOP / BOTTOM
}

function projectUV(x,y,z,panel,min,max){
  const dx=max.x-min.x||1;
  const dy=max.y-min.y||1;
  const dz=max.z-min.z||1;
  let a=0.5,b=0.5;

  if(panel===0){
    a=(x-min.x)/dx;b=(y-min.y)/dy;
  }else if(panel===1){
    a=1-(x-min.x)/dx;b=(y-min.y)/dy;
  }else if(panel===2){
    a=(z-min.z)/dz;b=(y-min.y)/dy;
  }else if(panel===3){
    a=1-(z-min.z)/dz;b=(y-min.y)/dy;
  }else if(panel===4){
    a=(x-min.x)/dx;b=(z-min.z)/dz;
  }else{
    a=(x-min.x)/dx;b=1-(z-min.z)/dz;
  }

  a=clamp01(a);b=clamp01(b);

  const cells=[[0,0],[1,0],[2,0],[0,1],[1,1],[2,1]];
  const [col,row]=cells[panel];

  // Matches female_base_uv_template_v1.png:
  // 768x512, 3x2 cells, each 256x256 with 10px padding.
  const px=col*256+10+a*236;
  const py=row*256+10+(1-b)*236;

  return [px/768,1-py/512];
}

function unwrapForTexture(mesh){
  const source=mesh.geometry;
  const pos=source.getAttribute('position');
  const idx=source.index;
  if(!pos || !idx)return;

  const skinIndex=source.getAttribute('skinIndex');
  const skinWeight=source.getAttribute('skinWeight');

  const min=new THREE.Vector3(Infinity,Infinity,Infinity);
  const max=new THREE.Vector3(-Infinity,-Infinity,-Infinity);
  const p=new THREE.Vector3();
  for(let i=0;i<pos.count;i++){
    p.fromBufferAttribute(pos,i);
    min.min(p);max.max(p);
  }

  const positions=[];
  const uvs=[];
  const joints=[];
  const weights=[];
  const indices=[];
  const vertexMap=new Map();

  const a=new THREE.Vector3();
  const b=new THREE.Vector3();
  const c=new THREE.Vector3();
  const ab=new THREE.Vector3();
  const ac=new THREE.Vector3();
  const normal=new THREE.Vector3();

  function addVertex(original,panel){
    const key=original+'|'+panel;
    const found=vertexMap.get(key);
    if(found!==undefined)return found;

    p.fromBufferAttribute(pos,original);
    const next=positions.length/3;
    positions.push(p.x,p.y,p.z);
    const uv=projectUV(p.x,p.y,p.z,panel,min,max);
    uvs.push(uv[0],uv[1]);

    if(skinIndex){
      joints.push(
        skinIndex.getX(original),skinIndex.getY(original),
        skinIndex.getZ(original),skinIndex.getW(original)
      );
    }
    if(skinWeight){
      weights.push(
        skinWeight.getX(original),skinWeight.getY(original),
        skinWeight.getZ(original),skinWeight.getW(original)
      );
    }

    vertexMap.set(key,next);
    return next;
  }

  for(let i=0;i<idx.count;i+=3){
    const ia=idx.getX(i),ib=idx.getX(i+1),ic=idx.getX(i+2);
    a.fromBufferAttribute(pos,ia);
    b.fromBufferAttribute(pos,ib);
    c.fromBufferAttribute(pos,ic);
    ab.subVectors(b,a);
    ac.subVectors(c,a);
    normal.crossVectors(ab,ac);
    const panel=classifyPanel(normal.x,normal.y,normal.z);

    indices.push(
      addVertex(ia,panel),
      addVertex(ib,panel),
      addVertex(ic,panel)
    );
  }

  const g=new THREE.BufferGeometry();
  g.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));
  g.setAttribute('uv',new THREE.Float32BufferAttribute(uvs,2));
  if(joints.length)g.setAttribute('skinIndex',new THREE.Uint16BufferAttribute(joints,4));
  if(weights.length)g.setAttribute('skinWeight',new THREE.Float32BufferAttribute(weights,4));
  g.setIndex(indices);
  g.computeVertexNormals();
  g.computeBoundingBox();
  g.computeBoundingSphere();

  mesh.geometry=g;
  source.dispose();
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

  const textureLoader=new THREE.TextureLoader();
  const textures=await Promise.all(BODY_TEXTURES.map(async rel=>{
    const texture=await textureLoader.loadAsync(new URL(rel,import.meta.url).href);
    texture.colorSpace=THREE.SRGBColorSpace;
    texture.minFilter=THREE.LinearFilter;
    texture.magFilter=THREE.LinearFilter;
    texture.generateMipmaps=false;
    return texture;
  }));

  const model=gltf.scene;
  const meshes=[];
  model.traverse(obj=>{
    if(!(obj.isSkinnedMesh||obj.isMesh))return;
    unwrapForTexture(obj);
    obj.frustumCulled=false;
    obj.material=new THREE.MeshStandardMaterial({
      map:textures[outfitIndex],
      roughness:.92,
      metalness:0
    });
    meshes.push(obj);
  });

  function applyOutfit(){
    const texture=textures[outfitIndex];
    for(const mesh of meshes){
      mesh.material.map=texture;
      mesh.material.needsUpdate=true;
    }
    localStorage.setItem(APPEARANCE_KEY,String(outfitIndex));
  }

  outfitBtn?.addEventListener('click',()=>{
    outfitIndex=(outfitIndex+1)%textures.length;
    applyOutfit();
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

  window.IdleSimResident={
    getOutfit(){return outfitIndex},
    setOutfit(index){
      outfitIndex=((Number(index)||0)%textures.length+textures.length)%textures.length;
      applyOutfit();
    },
    textureFiles:[...BODY_TEXTURES],
    uvTemplate:'../textures/female_v1/uv_template.svg',
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
    for(const t of textures)t.dispose();
    for(const m of meshes)m.material.dispose();
    renderer.dispose();
  },{once:true});
}
