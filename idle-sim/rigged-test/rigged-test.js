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

const camera=new THREE.PerspectiveCamera(32,1,.01,100);
camera.position.set(2.6,1.55,4.5);

const controls=new OrbitControls(camera,canvas);
controls.enableDamping=true;
controls.enablePan=false;
controls.target.set(0,1,0);

scene.add(new THREE.HemisphereLight(0xffffff,0x665f55,2.3));
const sun=new THREE.DirectionalLight(0xffffff,2.6);
sun.position.set(3,5,4);
sun.castShadow=true;
scene.add(sun);

const floor=new THREE.Mesh(
  new THREE.CircleGeometry(1.45,64),
  new THREE.MeshStandardMaterial({color:0xded7ca,roughness:1})
);
floor.rotation.x=-Math.PI/2;
floor.receiveShadow=true;
scene.add(floor);

let root=null,mixer=null,clips=[],clipIndex=0,currentAction=null,playing=true;

function fitModel(obj){
  obj.updateMatrixWorld(true);
  const box=new THREE.Box3().setFromObject(obj);
  const size=box.getSize(new THREE.Vector3());
  const center=box.getCenter(new THREE.Vector3());
  const wantedHeight=2.05;
  const scale=wantedHeight/Math.max(size.y,.0001);
  obj.scale.multiplyScalar(scale);
  obj.updateMatrixWorld(true);

  const box2=new THREE.Box3().setFromObject(obj);
  const center2=box2.getCenter(new THREE.Vector3());
  obj.position.x-=center2.x;
  obj.position.z-=center2.z;
  obj.position.y-=box2.min.y;
  obj.updateMatrixWorld(true);

  floor.position.y=-.015;
  controls.target.set(0,1.0,0);
  camera.position.set(2.6,1.5,4.4);
  controls.update();
}

function playClip(i){
  if(!clips.length)return;
  clipIndex=(i+clips.length)%clips.length;
  if(currentAction)currentAction.fadeOut(.15);
  currentAction=mixer.clipAction(clips[clipIndex]);
  currentAction.reset().fadeIn(.15).play();
  playing=true;
  document.getElementById('play').textContent='停止';
  status.textContent=`動作 ${clipIndex+1}/${clips.length}：${clips[clipIndex].name||'名称なし'}`;
}

new GLTFLoader().load(
  '../models/cc0-human-rigged.glb',
  gltf=>{
    root=gltf.scene;
    root.traverse(o=>{
      if(o.isMesh){
        o.castShadow=true;
        o.receiveShadow=true;
        if(o.material){
          o.material.roughness=.9;
          o.material.metalness=0;
        }
      }
    });
    scene.add(root);
    fitModel(root);
    clips=gltf.animations||[];
    if(clips.length){
      mixer=new THREE.AnimationMixer(root);
      playClip(0);
    }else{
      status.textContent='人体ベース読み込み完了（アニメーションなし）';
    }
  },
  undefined,
  err=>{
    console.error(err);
    status.textContent='読み込みエラー';
  }
);

document.getElementById('prev').onclick=()=>playClip(clipIndex-1);
document.getElementById('next').onclick=()=>playClip(clipIndex+1);
document.getElementById('play').onclick=()=>{
  if(!mixer)return;
  playing=!playing;
  mixer.timeScale=playing?1:0;
  document.getElementById('play').textContent=playing?'停止':'再生';
};
document.getElementById('front').onclick=()=>{
  camera.position.set(0,1.25,4.3);
  controls.target.set(0,1,0);
  controls.update();
};
document.getElementById('side').onclick=()=>{
  camera.position.set(4.3,1.25,0);
  controls.target.set(0,1,0);
  controls.update();
};
document.getElementById('reset').onclick=()=>{
  camera.position.set(2.6,1.5,4.4);
  controls.target.set(0,1,0);
  controls.update();
};

const clock=new THREE.Clock();
function resize(){
  const w=Math.max(1,canvas.clientWidth),h=Math.max(1,canvas.clientHeight);
  const pr=Math.min(devicePixelRatio||1,2);
  if(canvas.width!==Math.floor(w*pr)||canvas.height!==Math.floor(h*pr)){
    renderer.setSize(w,h,false);
    camera.aspect=w/h;
    camera.updateProjectionMatrix();
  }
}
function loop(){
  resize();
  const dt=Math.min(clock.getDelta(),.05);
  if(mixer)mixer.update(dt);
  controls.update();
  renderer.render(scene,camera);
  requestAnimationFrame(loop);
}
loop();