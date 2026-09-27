(function(root){
'use strict';
const styles={full:'全面画像',name:'名前＋画像',detail:'名前＋画像＋説明'};
function geometry(w,h,type){
 const margin=Math.round(w*.065),gap=Math.round(w*.025),inner=w-2*margin;
 const title=type==='full'?null:{x:margin,y:margin,w:inner,h:Math.round(h*.09)};
 const description=type==='detail'?{x:margin,y:Math.round(h*.75),w:inner,h:h-margin-Math.round(h*.75)}:null;
 const top=title?title.y+title.h+gap:margin,bottom=description?description.y-gap:h-margin;
 return{image:{x:margin,y:top,w:inner,h:bottom-top},title,description};
}
function textLines(ctx,text,box,size,maxLines){
 ctx.font=`${size}px sans-serif`;ctx.textBaseline='top';
 const pad=Math.round(size*.4),width=box.w-pad*2,lines=[];
 for(const paragraph of text.split('\n')){let line='';for(const char of paragraph){if(line&&ctx.measureText(line+char).width>width){lines.push(line);line='';}line+=char;}lines.push(line);}
 const visible=lines.slice(0,maxLines);
 if(lines.length>maxLines){let last=visible.at(-1)||'';while(last&&ctx.measureText(last+'…').width>width)last=last.slice(0,-1);visible[visible.length-1]=last+'…';}
 visible.forEach((line,i)=>ctx.fillText(line,box.x+pad,box.y+pad+i*size*1.4));
}
function draw(ctx,w,h,settings){
 const g=geometry(w,h,settings.type);ctx.clearRect(0,0,w,h);
 ctx.strokeStyle=settings.color;ctx.fillStyle=settings.color;
 const inset=Math.round(w*.025),line=Math.max(2,Math.round(w*.012));
 ctx.lineWidth=line;ctx.strokeRect(inset,inset,w-2*inset,h-2*inset);
 ctx.lineWidth=Math.max(1,Math.round(w*.003));
 for(const box of [g.image,g.title,g.description].filter(Boolean))ctx.strokeRect(box.x,box.y,box.w,box.h);
 if(g.title)textLines(ctx,settings.title,g.title,Math.round(w*.042),1);
 if(g.description){const size=Math.round(w*.031);textLines(ctx,settings.description,g.description,size,Math.max(1,Math.floor((g.description.h-size*.8)/(size*1.4))));}
 return g;
}
const api={styles,geometry,draw};if(typeof module!=='undefined')module.exports=api;else root.CardLayout=api;
})(typeof window!=='undefined'?window:this);
