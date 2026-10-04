(function(root){
'use strict';

function makeCanvas(w,h){
  const c=document.createElement('canvas');
  c.width=Math.max(1,Math.round(w));
  c.height=Math.max(1,Math.round(h));
  return c;
}
function clamp(v,min,max){return Math.max(min,Math.min(max,v));}
function median(values){
  if(!values.length)return 255;
  values.sort((a,b)=>a-b);
  return values[Math.floor(values.length/2)];
}
function splitCells(w,h){
  const out=[];
  for(let row=0;row<3;row++)for(let col=0;col<2;col++){
    const x=Math.round(col*w/2),y=Math.round(row*h/3);
    const x2=Math.round((col+1)*w/2),y2=Math.round((row+1)*h/3);
    out.push({x,y,w:x2-x,h:y2-y});
  }
  return out;
}
function backgroundColor(data,w,h){
  const r=[],g=[],b=[];
  const step=Math.max(1,Math.floor(Math.min(w,h)/90));
  const band=Math.max(3,Math.round(Math.min(w,h)*.045));
  for(let y=0;y<h;y+=step){
    for(let x=0;x<w;x+=step){
      if(x>=band&&x<w-band&&y>=band&&y<h-band)continue;
      const i=(y*w+x)*4;
      if(data[i+3]<20)continue;
      r.push(data[i]);g.push(data[i+1]);b.push(data[i+2]);
    }
  }
  return{r:median(r),g:median(g),b:median(b)};
}
function isBackground(data,i,bg,threshold){
  if(data[i+3]<20)return true;
  return Math.max(
    Math.abs(data[i]-bg.r),
    Math.abs(data[i+1]-bg.g),
    Math.abs(data[i+2]-bg.b)
  )<=threshold;
}
function extractCell(source,rect,options){
  const threshold=clamp(Math.round(options?.threshold??28),4,80);
  const paddingRatio=clamp(Number(options?.paddingRatio??.055),0,.2);
  const cell=makeCanvas(rect.w,rect.h),cx=cell.getContext('2d',{willReadFrequently:true});
  cx.drawImage(source,rect.x,rect.y,rect.w,rect.h,0,0,rect.w,rect.h);
  const image=cx.getImageData(0,0,rect.w,rect.h),data=image.data,w=rect.w,h=rect.h,total=w*h;
  const bg=backgroundColor(data,w,h),outside=new Uint8Array(total),queue=new Uint32Array(total);
  let head=0,tail=0;
  function add(x,y){
    if(x<0||y<0||x>=w||y>=h)return;
    const p=y*w+x;if(outside[p])return;
    if(!isBackground(data,p*4,bg,threshold))return;
    outside[p]=1;queue[tail++]=p;
  }
  for(let x=0;x<w;x++){add(x,0);add(x,h-1);}
  for(let y=1;y<h-1;y++){add(0,y);add(w-1,y);}
  while(head<tail){
    const p=queue[head++],x=p%w,y=(p/w)|0;
    add(x-1,y);add(x+1,y);add(x,y-1);add(x,y+1);
  }
  const rowCount=new Uint32Array(h),colCount=new Uint32Array(w);
  for(let p=0;p<total;p++){
    if(outside[p])continue;
    const i=p*4;
    if(data[i+3]<20)continue;
    const x=p%w,y=(p/w)|0;
    rowCount[y]++;colCount[x]++;
  }
  const minRowPixels=Math.max(2,Math.round(w*.003));
  const minColPixels=Math.max(2,Math.round(h*.003));
  let minX=w,minY=h,maxX=-1,maxY=-1;
  for(let x=0;x<w;x++)if(colCount[x]>=minColPixels){minX=Math.min(minX,x);maxX=Math.max(maxX,x);}
  for(let y=0;y<h;y++)if(rowCount[y]>=minRowPixels){minY=Math.min(minY,y);maxY=Math.max(maxY,y);}
  if(maxX<minX||maxY<minY){
    minX=0;minY=0;maxX=w-1;maxY=h-1;
  }
  const pad=Math.max(4,Math.round(Math.max(maxX-minX+1,maxY-minY+1)*paddingRatio));
  minX=Math.max(0,minX-pad);minY=Math.max(0,minY-pad);
  maxX=Math.min(w-1,maxX+pad);maxY=Math.min(h-1,maxY+pad);
  for(let p=0;p<total;p++)if(outside[p])data[p*4+3]=0;
  cx.putImageData(image,0,0);
  const cw=maxX-minX+1,ch=maxY-minY+1,out=makeCanvas(cw,ch);
  out.getContext('2d').drawImage(cell,minX,minY,cw,ch,0,0,cw,ch);
  return out;
}
function extractSix(source,options={}){
  return splitCells(source.width,source.height).map(r=>extractCell(source,r,options));
}
function drawBlackGoldFrame(w=595,h=842){
  const c=makeCanvas(w,h),cx=c.getContext('2d'),u=w/595;
  const gold='#b68a22',black='#050505',white='#ffffff';
  cx.fillStyle=white;cx.fillRect(0,0,w,h);
  function insetRect(inset,color){
    cx.fillStyle=color;
    cx.fillRect(inset,inset,w-inset*2,h-inset*2);
  }
  insetRect(0,gold);
  insetRect(Math.max(3,Math.round(4*u)),black);
  insetRect(Math.max(24,Math.round(31*u)),gold);
  insetRect(Math.max(27,Math.round(34*u)),white);
  insetRect(Math.max(48,Math.round(53*u)),gold);
  insetRect(Math.max(51,Math.round(56*u)),black);
  insetRect(Math.max(54,Math.round(59*u)),gold);
  insetRect(Math.max(56,Math.round(61*u)),white);
  return c;
}
function fitFrame(source,w=595,h=842){
  const out=makeCanvas(w,h),cx=out.getContext('2d');
  cx.fillStyle='#ffffff';cx.fillRect(0,0,w,h);
  const z=Math.max(w/source.width,h/source.height);
  const dw=source.width*z,dh=source.height*z;
  cx.drawImage(source,(w-dw)/2,(h-dh)/2,dw,dh);
  return out;
}
function innerBox(w=595,h=842,sizePercent=92){
  const base={x:Math.round(w*.105),y:Math.round(h*.082),w:Math.round(w*.79),h:Math.round(h*.836)};
  const k=clamp(Number(sizePercent)||92,55,100)/100;
  const bw=Math.round(base.w*k),bh=Math.round(base.h*k);
  return{x:Math.round(base.x+(base.w-bw)/2),y:Math.round(base.y+(base.h-bh)/2),w:bw,h:bh};
}
const api={splitCells,extractCell,extractSix,drawBlackGoldFrame,fitFrame,innerBox};
if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.BatchCard=api;
})(typeof window!=='undefined'?window:this);
