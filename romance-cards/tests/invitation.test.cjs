const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
function game(){
 const nodes=new Map(),timers=new Map();let timerId=0,clock=0,choices;
 const node=id=>{if(!nodes.has(id))nodes.set(id,{innerHTML:'',textContent:'',style:{setProperty(){}},classList:{toggle(){},add(){},remove(){}},querySelectorAll(){return []}});return nodes.get(id)};
 const ctx=vm.createContext({document:{getElementById:node},setTimeout(fn,delay=0){timers.set(++timerId,{fn,time:clock+delay});return timerId},clearTimeout(id){timers.delete(id)},Math:Object.assign(Object.create(Math),{random:()=>0})});
 for(const file of ['cards.js','render.js','game.js'])vm.runInContext(fs.readFileSync(path.join(__dirname,'../js',file),'utf8'),ctx);
 ctx.capture=items=>choices=items;
 vm.runInContext('dialog=(title,body,items)=>capture(items)',ctx);
 return {run:code=>vm.runInContext(code,ctx),random:fn=>ctx.Math.random=fn,node,choices:()=>choices,tick(){const [id,timer]=[...timers.entries()].sort((a,b)=>a[1].time-b[1].time)[0];timers.delete(id);clock=timer.time;timer.fn()}};
}
test('only one invitation: NPC invitation cannot be overwritten or duplicated',()=>{
 const g=game();g.run("s.invitation='npc';render();invitePrivate()");
 assert.equal(g.run('s.invitation'),'npc');
 assert.doesNotMatch(g.node('pcInvite').innerHTML,/id="invite"/);
 assert.match(g.node('npcInvite').innerHTML,/id="acceptInvite"/);
 g.run("s.npcMood=70;s.pcMood=60;play('hand','pc')");g.tick();
 assert.equal(g.run('s.invitation'),'npc');assert.equal(g.run('s.history.length'),2);
});
test('invitation bet stacks without consuming a turn or disappearing after a hand',()=>{
 const g=game();g.run("invitePrivate();$('bet').onclick();$('bet').onclick();$('bet').onclick();invitePrivate()");
 assert.equal(g.run('s.inviteBets.pc'),3);assert.equal(g.run('s.turn'),'pc');assert.equal(g.run('s.round'),0);
 g.run("play('hand','pc')");assert.equal(g.run('s.pcDesire'),3);g.tick();
 assert.equal(g.run('s.pcDesire'),9);assert.equal(g.run('s.inviteBets.pc'),3);assert.equal(g.run('s.history.length'),2);
 assert.equal(g.run('s.npcMood'),50);assert.equal(g.run('s.pcMood'),46);
});
test('NPC keeps playing normal cards and adds bets to an existing invitation',()=>{
 const g=game();g.run("s.invitation='npc';s.npcDesire=50;play('hand','pc')");g.tick();
 assert.equal(g.run('s.inviteBets.npc'),1);assert.equal(g.run('s.history.length'),2);assert.equal(g.run('s.npcDesire'),54);
 assert.equal(g.node('bet').disabled,true);
});
test('waiting keeps the invitation; accepting removes it in private mode',()=>{
 const g=game();g.run("s.invitation='npc';acceptPrivate()");g.choices()[1][1]();
 assert.equal(g.run('s.invitation'),'npc');g.run('acceptPrivate()');g.choices()[0][1]();g.tick();
 assert.equal(g.run('s.mode'),'private');assert.equal(g.run('s.invitation'),null);
 g.run('invitePrivate();acceptPrivate()');assert.equal(g.run('s.paused'),false);
 assert.match(g.node('pcInvite').innerHTML,/OK？/);
 assert.equal(g.node('pcInviteTitle').textContent,'自分の確認カード');
 assert.doesNotMatch(g.node('npcInvite').innerHTML,/id="acceptInvite"/);
});
test('an early player invitation can be accepted later while ordinary play continues',()=>{
 const g=game();g.run("invitePrivate();s.npcMood=60;s.pcMood=50;play('hand','pc')");g.tick();
 assert.equal(g.run('s.history.length'),2);assert.equal(g.run('s.paused'),true);
 assert.equal(g.choices()[0][0],'私的卓へ');
});
test('private play never adds invitation desire or creates another invitation',()=>{
 const g=game();g.run("enter('pc',true);s.npcMood=70;s.pcMood=60;play('hand','pc')");g.tick();
 assert.equal(g.run('s.invitation'),null);assert.equal(g.run('s.pcDesire+s.npcDesire'),0);
});

test('private confirmation is single, stacks bets, and waits without ending the turn',()=>{
 const g=game();g.run("enter('pc',true);confirmFinish();$('bet').onclick();$('bet').onclick();confirmFinish()");
 assert.equal(g.run('s.confirmation'),'pc');assert.equal(g.run('s.inviteBets.pc'),2);assert.equal(g.run('s.round'),0);
 g.run("play('hand','pc')");g.tick();
 assert.equal(g.run('s.pcDesire'),7);assert.equal(g.run('s.ended'),false);assert.equal(g.run('s.confirmation'),'pc');
});
test('NPC confirmation keeps normal play available and can be accepted to finish',()=>{
 const g=game();g.run("enter('pc',true);s.npcMood=85;s.pcMood=85;play('hand','pc')");g.tick();
 assert.equal(g.run('s.confirmation'),'npc');g.run('confirmFinish()');assert.equal(g.run('s.confirmation'),'npc');
 assert.doesNotMatch(g.node('pcInvite').innerHTML,/id="invite"/);g.run('acceptFinish()');g.choices()[1][1]();
 assert.equal(g.run('s.ended'),false);assert.equal(g.run('s.confirmation'),'npc');g.run('acceptFinish()');g.choices()[0][1]();g.tick();
 assert.equal(g.run('s.ended'),true);assert.equal(g.run('s.completed'),true);
});
test('player confirmation may be accepted later and completes after fade',()=>{
 const g=game();g.run("enter('pc',true);confirmFinish();s.npcMood=80;s.pcMood=80;play('hand','pc')");g.tick();
 assert.equal(g.run('s.paused'),true);assert.equal(g.run('s.ended'),false);g.choices()[0][1]();g.tick();
 assert.equal(g.run('s.completed'),true);assert.equal(g.run('s.ended'),true);
});

test('NPC plays after inviting: a large preview and persistent card name identify its hand',()=>{
 const g=game();g.run("s.invitation='npc';play('hand','pc')");g.tick();
 assert.equal(g.run('s.lastPlay.who'),'npc');assert.match(g.node('playEffect').innerHTML,/相手が出した札/);
 assert.match(g.node('message').textContent,/相手が「.+」を出しました/);
 g.run('render()');assert.match(g.node('message').textContent,/相手が「.+」を出しました/);
 g.tick();assert.equal(g.node('playEffect').innerHTML,'');assert.equal(g.run('s.history.length'),2);
});
test('restarting clears the animation and the previous play label',()=>{
 const g=game();g.run("play('hand','pc');newGame('pc')");
 assert.equal(g.node('playEffect').innerHTML,'');assert.equal(g.run('s.lastPlay'),null);
 assert.equal(g.node('message').textContent,'あなたの番');
});

test('selecting an opponent body card preserves it and supports cancelling',()=>{
 const g=game();const id=g.run('s.npcHand[0]');g.run('drawNPC(0)');
 assert.equal(g.run('s.drawn.id'),id);assert.equal(g.run('s.npcHand[0]'),id);
 assert.equal(g.run('s.turn'),'pc');assert.equal(g.run('s.round'),0);assert.match(g.node('playEffect').innerHTML,/引き抜いた札/);
 g.run('drawNPC(0)');assert.equal(g.run('s.drawn'),null);assert.equal(g.run('s.npcHand[0]'),id);
});
test('a borrowed card is visibly paired with the player card and strengthens its effect',()=>{
 const g=game();g.run("s.npcHand[0]='neck';s.npcMood=70;s.pcMood=60;drawNPC(0);s.selected='lips';render()");
 assert.match(g.node('hand').innerHTML,/borrowed-card/);g.run("play('lips','pc')");
 assert.equal(g.run('s.stack.length'),2);assert.equal(g.run('s.stack[1].pairedWith'),g.run('s.stack[0].seq'));
 assert.equal(g.run('s.npcMood'),84);assert.equal(g.run('s.drawn'),null);
 assert.match(g.node('pile').innerHTML,/combined-top/);assert.match(g.node('message').textContent,/唇＋首/);
});
test('a card pulled from the table can be paired only once',()=>{
 const g=game();g.run("s.npcMood=70;s.pcMood=60;s.stack=[{id:'neck',who:'npc',seq:300}];selectPair(300);play('lips','pc')");
 assert.equal(g.run('s.stack.length'),3);assert.equal(g.run('s.stack[0].seq'),300);assert.equal(g.run('s.stack[2].pairedWith'),g.run('s.stack[1].seq'));
 g.run("s.turn='pc';selectPair(300)");assert.equal(g.run('s.pair'),null);
});
test('NPC avoids mirroring the player or repeating itself when alternatives exist',()=>{
 const g=game();g.run("s.npcMood=100;s.npcHand=['hand','lips','neck'];s.history=[{id:'hand',who:'pc'},{id:'lips',who:'npc'}]");
 for(const value of [0,.25,.5,.99]){g.random(()=>value);assert.equal(g.run('chooseNPC()[0]'),'neck')}
});
test('teasing activates the wolf effect and it survives moving to the private table',()=>{
 const g=game();g.run("s.turn='npc';s.round=1;s.invitation='npc';s.npcDesire=19;play('hand','npc')");
 assert.equal(g.run('s.wolf.npc'),true);assert.match(g.node('wolfEffect').innerHTML,/相手の狼効果/);
 assert.match(g.node('npcFeeling').textContent,/🐺/);g.run("enter('pc',true)");assert.equal(g.run('s.wolf.npc'),true);
});
test('wolf mode increases the chance of an assertive card',()=>{
 const g=game();g.run("s.npcMood=100;s.npcHand=['hand','lips','neck','cheek','ear'];s.history=[]");
 function assertive(wolf){g.run('s.wolf.npc='+wolf);let count=0;for(let i=0;i<100;i++){g.random(()=>i/100);if(['lips','neck','ear'].includes(g.run('chooseNPC()[0]')))count++}return count}
 assert.ok(assertive(true)>assertive(false));
});
test('completion pauses on an afterglow screen until replay is explicitly chosen',()=>{
 const g=game();g.run('exitCards(true)');assert.deepEqual(Array.from(g.choices(),c=>c[0]),['余韻のまま閉じる','もう一度遊ぶ']);
 g.choices()[0][1]();assert.equal(g.run('s.ended'),true);assert.equal(g.run('s.completed'),true);
 g.run('menu()');assert.equal(g.choices()[1][0],'もう一度遊ぶ');g.choices()[1][1]();assert.equal(g.choices()[0][0],'自分から · 先攻');
});

test('normal table deals five unique cards and private table deals eight',()=>{
 const g=game();
 assert.equal(g.run('s.npcHand.length'),5);
 assert.equal(g.run('new Set(s.npcHand).size'),5);
 assert.equal((g.node('hand').innerHTML.match(/data-card=/g)||[]).length,5);
 g.run("enter('pc',true)");
 assert.equal(g.run('s.npcHand.length'),8);
 assert.equal(g.run('new Set(s.npcHand).size'),8);
 assert.equal((g.node('hand').innerHTML.match(/data-card=/g)||[]).length,8);
});

test('body cards persist after repeated actions and all action layers remain',()=>{
 const g=game();const initial=g.run('JSON.stringify(s.npcHand)');
 for(let i=0;i<10;i++){g.run("s.npcMood=100;s.pcMood=100;s.turn='npc';play('hand','npc')")}
 assert.equal(g.run('JSON.stringify(s.npcHand)'),initial);
 assert.equal(g.run('s.stack.length'),10);
 assert.equal((g.node('pile').innerHTML.match(/class="action-group /g)||[]).length,10);
 assert.equal((g.node('history').innerHTML.match(/data-history-seq=/g)||[]).length,10);
 g.run("s.turn='pc';drawNPC(0);s.selected='hand';play('hand','pc')");
 assert.equal(g.run('JSON.stringify(s.npcHand)'),initial);
 assert.match(g.node('pile').innerHTML,/paired-action/);
});

test('teasing appears on the first declined invitation hand before wolf mode',()=>{
 const g=game();g.run("s.invitation='npc';play('hand','pc')");
 assert.equal(g.run('s.teasing.npc'),true);
 assert.equal(g.run('s.wolf.npc'),false);
 assert.match(g.node('teaseStatus').innerHTML,/焦らし中♡/);
 g.run("enter('pc',true)");assert.equal(g.node('teaseStatus').innerHTML,'');
});
test('stacking an invitation bet raises visible desire immediately',()=>{
 const g=game();g.run("s.invitation='pc';s.teasing.pc=true;$('bet').onclick()");
 assert.equal(g.run('s.pcDesire'),1);assert.match(g.node('teaseStatus').innerHTML,/自分の欲求 1/);
});
