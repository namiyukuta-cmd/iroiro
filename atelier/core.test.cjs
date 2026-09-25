// Run: node atelier/core.test.cjs (requires @napi-rs/canvas in the test environment).
const assert=require('node:assert/strict');
const {createCanvas}=require('@napi-rs/canvas');
const C=require('./core.js');
const assets=new Map(),sheets=[];
for(let i=0;i<18;i++){
 const c=createCanvas(80+i,100+i),ctx=c.getContext('2d');ctx.fillStyle=`rgb(${i*13},${255-i*11},80)`;ctx.fillRect(0,0,c.width,c.height);assets.set(i,c);
 if(i%6===0)sheets.push({w:1190,h:2526,bg:null,grid:6,layers:[]});
 const p=sheets.at(-1),box=C.cells(p.w,p.h,6)[i%6];
 p.layers.push({id:i,asset:i,w:c.width,h:c.height,visible:true,opacity:1,...C.placement(c,box,'cover')});
}
assert.equal(sheets.length,3);
const outputFiles=[];
for(const p of sheets){
 const c=createCanvas(p.w,p.h);C.render(c.getContext('2d'),p,assets,true);
 for(const [i,r] of C.cells(p.w,p.h,6).entries()){
  assert.equal(r.w,595);assert.equal(r.h,842);
  const tile=createCanvas(r.w,r.h);tile.getContext('2d').drawImage(c,r.x,r.y,r.w,r.h,0,0,r.w,r.h);
  const rgba=tile.getContext('2d').getImageData(297,421,1,1).data,id=p.layers[i].id;
  assert.deepEqual([...rgba],[id*13,255-id*11,80,255]);
  outputFiles.push({name:`card_${String(outputFiles.length+1).padStart(3,'0')}.png`,data:tile.toBuffer('image/png')});
 }
}
assert.equal(outputFiles.length,18);
const zip=C.zip(outputFiles),view=new DataView(zip.buffer);let offset=0,count=0;
while(view.getUint32(offset,true)===0x04034b50){const size=view.getUint32(offset+18,true),nameLength=view.getUint16(offset+26,true);const data=zip.slice(offset+30+nameLength,offset+30+nameLength+size);assert.equal(C.crc32(data),view.getUint32(offset+14,true));assert.equal(data[0],137);offset+=30+nameLength+size;count++}
assert.equal(count,18);assert.equal(view.getUint16(zip.length-12,true),18);
for(const n of [1,2,4,6,9]){const cs=C.cells(601,847,n);assert.equal(cs.reduce((sum,r)=>sum+r.w*r.h,0),601*847)}
const transparent=createCanvas(100,100);C.render(transparent.getContext('2d'),{w:100,h:100,bg:'#ffffff',layers:[]},assets,true);assert.equal(transparent.getContext('2d').getImageData(0,0,1,1).data[3],0);
C.render(transparent.getContext('2d'),{w:100,h:100,bg:'#ffffff',layers:[]},assets,false);assert.equal(transparent.getContext('2d').getImageData(0,0,1,1).data[3],255);
const l={w:40,h:60,x:100,y:200,scale:2,rotation:90,visible:true};assert.deepEqual(C.localPoint(l,{x:100,y:200}),{x:20,y:30});assert.equal(C.hit(l,{x:100,y:200}),true);assert.equal(C.hit({...l,frame:{x:0,y:0,w:10,h:10}},{x:100,y:200}),false);
console.log('PASS: 18 images → 3 sheets → 18 distinct 595×842 PNGs; ZIP CRC and count; gap-free 1/2/4/6/9 splits; transparency; rotated selection; clipping');
