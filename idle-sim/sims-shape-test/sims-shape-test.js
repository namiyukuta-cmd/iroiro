import * as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';

const canvas=document.getElementById('c');
const status=document.getElementById('status');
const renderer=new THREE.WebGLRenderer({canvas,antialias:true,alpha:true});
renderer.setPixelRatio(Math.min(devicePixelRatio||1,2));
renderer.shadowMap.enabled=true;
renderer.outputColorSpace=THREE.SRGBColorSpace;

const scene=new THREE.Scene();
scene.background=new THREE.Color(0xf8f5ee);
const camera=new THREE.PerspectiveCamera(30,1,.01,100);
camera.position.set(2.5,1.35,4.2);

const controls=new OrbitControls(camera,canvas);
controls.enableDamping=true;
controls.enablePan=false;
controls.target.set(0,1,0);

scene.add(new THREE.HemisphereLight(0xffffff,0x665f55,2.2));
const sun=new THREE.DirectionalLight(0xffffff,2.8);
sun.position.set(3,5,4);
sun.castShadow=true;
scene.add(sun);

const floor=new THREE.Mesh(
  new THREE.CircleGeometry(1.35,64),
  new THREE.MeshStandardMaterial({color:0xddd6c9,roughness:1})
);
floor.rotation.x=-Math.PI/2;
floor.position.y=-.015;
floor.receiveShadow=true;
scene.add(floor);

const PROFILES={
  simsMale:{leg:1.08,torso:1.00,headHeight:.90,shoulders:.98,waist:.74,hips:.88,arms:.94,headWidth:.89,chestDepth:.91,bellyDepth:.76},
  simsFemale:{leg:1.08,torso:.99,headHeight:.91,shoulders:.90,waist:.72,hips:.94,arms:.90,headWidth:.90,chestDepth:.88,bellyDepth:.74},
  slimMale:{leg:1.10,torso:.98,headHeight:.88,shoulders:.91,waist:.68,hips:.82,arms:.88,headWidth:.86,chestDepth:.84,bellyDepth:.70},
  slimFemale:{leg:1.10,torso:.97,headHeight:.89,shoulders:.86,waist:.67,hips:.90,arms:.86,headWidth:.87,chestDepth:.84,bellyDepth:.69}
};
const HIP_Y=.95,NECK_Y=1.56;
const loader=new GLTFLoader();

let sex='male';
let shape='sims';
let root=null;
let walking=false;
let bones={};
let restQ={};

function blend(a,b,t){return a+(b-a)*Math.min(1,Math.max(0,t));}
function widthAt(y,p){
  if(y<HIP_Y)return p.hips;
  if(y<1.13)return blend(p.hips,p.waist,(y-HIP_Y)/.18);
  if(y<1.43)return blend(p.waist,p.shoulders,(y-1.13)/.3);
  return blend(p.shoulders,p.headWidth,(y-1.43)/.21);
}
function depthAt(y,p){
  if(y<.82)return p.hips;
  if(y<1.08)return blend(p.hips,p.bellyDepth,(y-.82)/.26);
  if(y<1.3)return blend(p.bellyDepth,p.chestDepth,(y-1.08)/.22);
  return blend(p.chestDepth,p.headWidth,(y-1.3)/.34);
}
function deform(point,p){
  const y=point.y;
  const h=y<HIP_Y
    ? y*p.leg
    : y<NECK_Y
      ? HIP_Y*p.leg+(y-HIP_Y)*p.torso
      : HIP_Y*p.leg+(NECK_Y-HIP_Y)*p.torso+(y-NECK_Y)*p.headHeight;
  const width=widthAt(y,p);
  const armBlend=Math.min(1,Math.max(0,(Math.abs(point.x)-.28)/.17));
  const horizontal=blend(width,p.arms,armBlend);
  const depth=depthAt(y,p);
  return point.set(point.x*horizontal,h,point.z*depth);
}
function reshape(root,p){
  if(!p)return;
  root.updateMatrixWorld(true);
  const rootToWorld=root.matrixWorld.clone();
  const worldToRoot=rootToWorld.clone().invert();
  const allBones=[],original=new Map(),meshes=[];
  root.traverse(o=>{
    if(o.isBone){allBones.push(o);original.set(o,o.getWorldPosition(new THREE.Vector3()).applyMatrix4(worldToRoot));}
    if(o.isSkinnedMesh)meshes.push(o);
  });
  for(const mesh of meshes){
    const geometry=mesh.geometry.clone();
    const positions=geometry.getAttribute('position');
    const meshToWorld=mesh.matrixWorld.clone();
    const worldToMesh=meshToWorld.clone().invert();
    const point=new THREE.Vector3();
    for(let i=0;i<positions.count;i++){
      point.fromBufferAttribute(positions,i).applyMatrix4(meshToWorld).applyMatrix4(worldToRoot);
      deform(point,p).applyMatrix4(rootToWorld).applyMatrix4(worldToMesh);
      positions.setXYZ(i,point.x,point.y,point.z);
    }
    positions.needsUpdate=true;
    geometry.computeVertexNormals();
    geometry.computeBoundingBox();
    geometry.computeBoundingSphere();
    mesh.geometry=geometry;
  }
  for(const bone of allBones){
    const originalPos=original.get(bone);
    const parentInverse=bone.parent?.matrixWorld.clone().invert()??new THREE.Matrix4();
    bone.position.copy(deform(originalPos.clone(),p).applyMatrix4(rootToWorld).applyMatrix4(parentInverse));
    bone.updateMatrixWorld(true);
  }
  root.updateMatrixWorld(true);
  for(const skeleton of new Set(meshes.map(m=>m.skeleton)))skeleton.calculateInverses();
}

function findBone(name){
  let found=null;
  root?.traverse(o=>{if(o.isBone&&o.name===name)found=o;});
  return found;
}
function captureBones(){
  bones={
    lArm:findBone('upperarm_l'),rArm:findBone('upperarm_r'),
    lFore:findBone('lowerarm_l'),rFore:findBone('lowerarm_r'),
    lThigh:findBone('thigh_l'),rThigh:findBone('thigh_r'),
    lCalf:findBone('calf_l'),rCalf:findBone('calf_r'),
    pelvis:findBone('pelvis'),spine:findBone('spine_01')
  };
  restQ={};
  for(const [k,b] of Object.entries(bones))if(b)restQ[k]=b.quaternion.clone();
}
function addRot(b,key,x=0,y=0,z=0){
  if(!b||!restQ[key])return;
  b.quaternion.copy(restQ[key]);
  b.quaternion.multiply(new THREE.Quaternion().setFromEuler(new THREE.Euler(x,y,z,'XYZ')));
}
function poseStand(){
  addRot(bones.lArm,'lArm',0,0,1.28);
  addRot(bones.rArm,'rArm',0,0,1.28);
  addRot(bones.lFore,'lFore');
  addRot(bones.rFore,'rFore');
  addRot(bones.lThigh,'lThigh');
  addRot(bones.rThigh,'rThigh');
  addRot(bones.lCalf,'lCalf');
  addRot(bones.rCalf,'rCalf');
  addRot(bones.pelvis,'pelvis');
  addRot(bones.spine,'spine');
}
function fit(){
  root.updateMatrixWorld(true);
  const box=new THREE.Box3().setFromObject(root);
  const size=box.getSize(new THREE.Vector3());
  const s=2.05/Math.max(size.y,.001);
  root.scale.multiplyScalar(s);
  root.updateMatrixWorld(true);
  const b2=new THREE.Box3().setFromObject(root);
  const c=b2.getCenter(new THREE.Vector3());
  root.position.x-=c.x;root.position.z-=c.z;root.position.y-=b2.min.y;
  root.updateMatrixWorld(true);
  controls.target.set(0,1,0);
  camera.position.set(2.45,1.35,4.15);
  controls.update();
}

async function loadModel(){
  walking=false;
  document.getElementById('walk').textContent='歩く';
  if(root){scene.remove(root);root=null;}
  status.textContent='読み込み中…';
  const url=sex==='male'?'../models/ubc-male.glb':'../models/ubc-female.glb';
  loader.load(url,gltf=>{
    root=gltf.scene;
    root.traverse(o=>{
      if(o.isMesh){
        o.castShadow=true;o.receiveShadow=true;
        const m=new THREE.MeshStandardMaterial({
          color:sex==='male'?0xb6aca0:0xc0b5aa,
          roughness:.95,
          metalness:0,
          flatShading:false
        });
        o.material=m;
      }
    });
    scene.add(root);
    if(shape!=='base')reshape(root,PROFILES[(shape==='slim'?'slim':'sims')+(sex==='male'?'Male':'Female')]);
    fit();
    captureBones();
    poseStand();
    status.textContent=(sex==='male'?'男性':'女性')+'・'+(shape==='base'?'元の体型':shape==='slim'?'細身':'シム寄り');
  },undefined,err=>{console.error(err);status.textContent='読み込みエラー';});
}

function setButtonGroup(ids,on){
  for(const id of ids)document.getElementById(id).classList.toggle('on',id===on);
}
document.getElementById('male').onclick=()=>{sex='male';setButtonGroup(['male','female'],'male');loadModel();};
document.getElementById('female').onclick=()=>{sex='female';setButtonGroup(['male','female'],'female');loadModel();};
document.getElementById('base').onclick=()=>{shape='base';setButtonGroup(['base','sims','slim'],'base');loadModel();};
document.getElementById('sims').onclick=()=>{shape='sims';setButtonGroup(['base','sims','slim'],'sims');loadModel();};
document.getElementById('slim').onclick=()=>{shape='slim';setButtonGroup(['base','sims','slim'],'slim');loadModel();};
document.getElementById('walk').onclick=()=>{walking=!walking;document.getElementById('walk').textContent=walking?'停止':'歩く';if(!walking)poseStand();};
document.getElementById('front').onclick=()=>{camera.position.set(0,1.25,4.15);controls.target.set(0,1,0);controls.update();};
document.getElementById('side').onclick=()=>{camera.position.set(4.15,1.25,0);controls.target.set(0,1,0);controls.update();};
document.getElementById('reset').onclick=()=>{camera.position.set(2.45,1.35,4.15);controls.target.set(0,1,0);controls.update();};

const clock=new THREE.Clock();
let time=0;
function animateWalk(dt){
  if(!walking||!root)return;
  time+=dt*5.2;
  const s=Math.sin(time);
  const s2=Math.sin(time+Math.PI);
  addRot(bones.lArm,'lArm',-.45*s,0,1.28);
  addRot(bones.rArm,'rArm',-.45*s2,0,1.28);
  addRot(bones.lFore,'lFore',Math.max(0,-s)*.35,0,0);
  addRot(bones.rFore,'rFore',Math.max(0,-s2)*.35,0,0);
  addRot(bones.lThigh,'lThigh',.55*s,0,0);
  addRot(bones.rThigh,'rThigh',.55*s2,0,0);
  addRot(bones.lCalf,'lCalf',Math.max(0,-s)*.65,0,0);
  addRot(bones.rCalf,'rCalf',Math.max(0,-s2)*.65,0,0);
  addRot(bones.pelvis,'pelvis',0,.04*s,0);
  addRot(bones.spine,'spine',0,-.025*s,0);
  root.position.y+=Math.abs(Math.sin(time*2))*.00035;
}

function resize(){
  const w=Math.max(1,canvas.clientWidth),h=Math.max(1,canvas.clientHeight);
  const pr=Math.min(devicePixelRatio||1,2);
  if(canvas.width!==Math.floor(w*pr)||canvas.height!==Math.floor(h*pr)){
    renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix();
  }
}
function loop(){
  resize();
  const dt=Math.min(clock.getDelta(),.05);
  animateWalk(dt);
  controls.update();
  renderer.render(scene,camera);
  requestAnimationFrame(loop);
}
loadModel();
loop();