const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
function game(){
 const nodes=new Map(),timers=new Map();let timerId=0,clock=0,choices;
 const node=id=>{if(!nodes.has(id))nodes.set(id,{innerHTML:'',textContent:'',classList:{toggle(){}},querySelectorAll(){return []}});return nodes.get(id)};
 const ctx=vm.createContext({document:{getElementById:node},setTimeout(fn,delay=0){timers.set(++timerId,{fn,time:clock+delay});return timerId},clearTimeout(id){timers.delete(id)},Math:Object.assign(Object.create(Math),{random:()=>0})});
 for(const file of ['cards.js','render.js','game.js'])vm.runInContext(fs.readFileSync(path.join(__dirname,'../js',file),'utf8'),ctx);
 ctx.capture=items=>choices=items;
 vm.runInContext('dialog=(title,body,items)=>capture(items)',ctx);
 return {run:code=>vm.runInContext(code,ctx),node,choices:()=>choices,tick(){const [id,timer]=[...timers.entries()].sort((a,b)=>a[1].time-b[1].time)[0];timers.delete(id);clock=timer.time;timer.fn()}};
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
 g.run("play('hand','pc')");assert.equal(g.run('s.pcDesire'),0);g.tick();
 assert.equal(g.run('s.pcDesire'),6);assert.equal(g.run('s.inviteBets.pc'),3);assert.equal(g.run('s.history.length'),2);
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
 assert.equal(g.run('s.pcDesire'),5);assert.equal(g.run('s.ended'),false);assert.equal(g.run('s.confirmation'),'pc');
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
 assert.match(g.node('message').textContent,/相手が「手」を出しました/);
 g.run('render()');assert.match(g.node('message').textContent,/相手が「手」を出しました/);
 g.tick();assert.equal(g.node('playEffect').innerHTML,'');assert.equal(g.run('s.history.length'),2);
});
test('restarting clears the animation and the previous play label',()=>{
 const g=game();g.run("play('hand','pc');newGame('pc')");
 assert.equal(g.node('playEffect').innerHTML,'');assert.equal(g.run('s.lastPlay'),null);
 assert.equal(g.node('message').textContent,'あなたの番');
});
