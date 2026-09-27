window.DungeonView = (()=>{
  function create(host,game,data){
    const T=window.THREE;
    const renderer=new T.WebGLRenderer({antialias:true,preserveDrawingBuffer:true});
    renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,2));host.prepend(renderer.domElement);
    const scene=new T.Scene();scene.background=new T.Color(0x555a50);scene.fog=new T.Fog(0x555a50,7,19);
    const camera=new T.PerspectiveCamera(68,1,.05,40);
    scene.add(new T.HemisphereLight(0xfff8df,0x747e6c,2.3));
    const lamp=new T.PointLight(0xffe1a0,22,12);scene.add(lamp);
    let structure=new T.Group(),figures=new T.Group(),floor=-1,lastMode='';scene.add(structure,figures);
    const cube=new T.BoxGeometry(1,1,1);
    const materials={wall:new T.MeshStandardMaterial({color:0x858c7b,roughness:1}),floor:new T.MeshStandardMaterial({color:0x646d5d,roughness:1}),line:new T.LineBasicMaterial({color:0x3b4337}),chest:new T.MeshStandardMaterial({color:0xb79548}),stair:new T.MeshStandardMaterial({color:0xb4bdaa}),enemy:new T.MeshStandardMaterial({color:0x8c625e,flatShading:true}),armor:new T.MeshStandardMaterial({color:0x454d49,metalness:.2,roughness:.8})};
    const edges=new T.EdgesGeometry(cube);
    function box(group,x,y,z,w,h,d,mat,outline=false){const m=new T.Mesh(cube,mat);m.position.set(x,y,z);m.scale.set(w,h,d);group.add(m);if(outline)m.add(new T.LineSegments(edges,materials.line));return m;}
    function rebuild(){structure.clear();const map=data.floors[game.state.floor].map;
      for(let y=0;y<map.length;y++)for(let x=0;x<map[y].length;x++){
        if(map[y][x]==='#'){
          for(let row=0;row<3;row++)box(structure,x*2,row*.8+.4,y*2,1.98,.78,1.98,materials.wall,true);
        }else{box(structure,x*2,-.12,y*2,1.98,.2,1.98,materials.floor,true);}
      }
      floor=game.state.floor;
    }
    function markers(){figures.clear();const s=game.state,map=data.floors[s.floor].map;
      for(let y=0;y<map.length;y++)for(let x=0;x<map[y].length;x++){
        const t=map[y][x];if(t==='C'&&!s.cleared.has(`${s.floor}:${x}:${y}`)){box(figures,x*2,.3,y*2,.65,.6,.5,materials.chest,true);}
        if(t==='S'||t==='X'){for(let n=0;n<4;n++)box(figures,x*2,n*.09,y*2+n*.24-.4,1,.12,.22,materials.stair,true);}
      }
      if(s.mode==='battle'){
        const dir=[[0,-1],[1,0],[0,1],[-1,0]][s.dir],x=s.x*2+dir[0]*1.25,z=s.y*2+dir[1]*1.25;
        box(figures,x,.85,z,.65,.8,.4,materials.armor,true);box(figures,x,1.48,z,.42,.42,.4,materials.enemy,true);
        const side=[-dir[1],dir[0]];
        for(const v of [-1,1]){box(figures,x+side[0]*.19*v,.25,z+side[1]*.19*v,.16,.5,.2,materials.armor);box(figures,x+side[0]*.44*v,.85,z+side[1]*.44*v,.16,.7,.2,materials.enemy);}
      }
    }
    function resize(){const w=host.clientWidth,h=host.clientHeight;if(!w||!h)return;renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix();render();}
    function render(){const s=game.state;if(floor!==s.floor){rebuild();lastMode='';}markers();const dx=Math.sin(s.dir*Math.PI/2),dz=-Math.cos(s.dir*Math.PI/2);camera.position.set(s.x*2,1.25,s.y*2);camera.lookAt(s.x*2+dx,1.25,s.y*2+dz);lamp.position.copy(camera.position);renderer.render(scene,camera);lastMode=s.mode;}
    new ResizeObserver(resize).observe(host);resize();return {render};
  }
  return {create};
})();
