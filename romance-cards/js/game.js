'use strict';
const fresh=()=>({pcMood:38,npcMood:40,pcFeeling:'calm',npcFeeling:'calm',mode:'public',turn:'pc',stack:[],discard:[],history:[],round:0,selected:null,pair:null,bet:0,paused:false,ended:false,invitation:null,confirmation:null,completed:false,inviteBets:{pc:0,npc:0},pcDesire:0,npcDesire:0,date:null,time:null});
let s=fresh(),timer=null,generation=0,sequence=0;
const clamp=n=>Math.max(0,Math.min(100,n));
function change(k,n){s[k]=clamp(s[k]+n)}
function canCard(id){const c=DECK.find(c=>c[0]===id);return !!c&&(s.mode==='private'||!['leg','back','outfit'].includes(id))}
function eligible(){return DECK.filter(c=>canCard(c[0])&&c[2]<=s.npcMood)}
function enter(first,privateMode=false){
 generation++;clearTimeout(timer);s.mode=privateMode?'private':'public';s.round=0;s.selected=null;s.pair=null;s.bet=0;s.turn=first;s.paused=false;s.ended=false;s.invitation=null;s.confirmation=null;s.completed=false;s.inviteBets={pc:0,npc:0};render();if(first==='npc')scheduleNPC();
}
function pendingCard(){return s.mode==='public'?s.invitation:s.confirmation}
function readyForFinish(){return s.npcMood>=80&&s.pcMood>=80}
function scheduleNPC(){
 const g=generation;
 timer=setTimeout(()=>{
  if(g!==generation||s.paused||s.ended||s.turn!=='npc')return;
  const opts=eligible();if(!opts.length){exitCards();return}
  const last=s.stack.at(-1),same=last&&opts.find(c=>c[0]===last.id);
  const c=same&&Math.random()<.55?same:opts[Math.floor(Math.random()*opts.length)];
  if(pendingCard()==='npc'&&Math.random()<s.npcDesire/100)s.inviteBets.npc++;
  play(c[0],'npc');
  if(s.invitation==='pc'&&readyForPrivate()&&!s.ended)offerPrivate();
  if(s.mode==='private'&&s.confirmation==='pc'&&readyForFinish()&&!s.ended)offerFinish();
 },850);
}
function pairBonus(id,other){return id===other?4:([id,other].includes('hand')?5:2)}
function play(id,who){
 if(s.paused||s.ended||!canCard(id)||s.turn!==who)return;
 const c=DECK.find(c=>c[0]===id),chosen=s.stack.find(c=>c.seq===s.pair&&c.who==='npc'),risky=c[2]>s.npcMood;
 let gain=risky?-7:5;if(chosen)gain+=risky?0:pairBonus(id,chosen.id);
 gain*=1+(who==='pc'?s.bet:0)*.5;change('npcMood',Math.round(gain));change('pcMood',Math.round(gain*.7));
 if(chosen){s.stack=s.stack.filter(c=>c.seq!==chosen.seq);s.stack.push(chosen)}
 const played={id,who,seq:++sequence};s.stack.push(played);s.history.push({...played});
 s.round++;s.selected=null;s.pair=null;s.bet=0;s.turn=who==='pc'?'npc':'pc';
 if(s.round%2===0&&pendingCard())change(pendingCard()+'Desire',3+Math.min(7,s.inviteBets[pendingCard()]));
 if(who==='npc'&&s.mode==='public'&&s.npcMood>=60&&s.pcMood>=50&&s.invitation===null)s.invitation='npc';
 if(who==='npc'&&s.mode==='private'&&readyForFinish()&&s.confirmation===null)s.confirmation='npc';
 render();if(risky)$('message').textContent='💦';
 if(s.npcMood<25){exitCards();return}
 if(s.turn==='npc')scheduleNPC();
}
function readyForPrivate(){return s.npcMood>=60&&s.pcMood>=50}
function offerPrivate(){
 generation++;clearTimeout(timer);s.paused=true;render();
 dialog('ふたりの時間','相手が誘いに応じました。',[['私的卓へ',()=>blackout(()=>enter('npc',true)),true],['卓で続ける',resume]]);
}
function invitePrivate(){
 if(s.mode!=='public'||s.turn!=='pc'||s.paused||s.ended||s.invitation!==null)return;
 s.invitation='pc';render();
 if(readyForPrivate())offerPrivate();
}

function acceptPrivate(){
 if(s.mode!=='public'||s.invitation!=='npc'||s.turn!=='pc'||s.paused||s.ended)return;
 generation++;clearTimeout(timer);s.paused=true;render();
 dialog('もう少し、ふたりで','“I’d like some time alone with you.”<br>「君とふたりきりで過ごしたいです。」',[['応じる',()=>blackout(()=>enter('pc',true)),true],['卓で続ける',resume]]);
}
function offerFinish(){
 generation++;clearTimeout(timer);s.paused=true;render();
 dialog('ふたりの時間','相手が「OK？」に応じました。',[['進む',()=>blackout(()=>exitCards(true)),true],['卓で続ける',resume]]);
}
function confirmFinish(){
 if(s.mode!=='private'||s.turn!=='pc'||s.paused||s.ended||s.confirmation!==null)return;
 s.confirmation='pc';render();if(readyForFinish())offerFinish();
}
function acceptFinish(){
 if(s.mode!=='private'||s.confirmation!=='npc'||s.turn!=='pc'||s.paused||s.ended)return;
 generation++;clearTimeout(timer);s.paused=true;render();
 dialog('ふたりの時間','“OK?”<br>「この先へ進んでも？」',[['OK',()=>blackout(()=>exitCards(true)),true],['卓で続ける',resume]]);
}
function blackout(next){
 generation++;clearTimeout(timer);s.paused=true;render();const g=generation;
 $('fade').innerHTML='<div class="fade">ふたりの時間</div>';
 timer=setTimeout(()=>{if(g!==generation)return;$('fade').innerHTML='';next()},1500);
}
function exitCards(completed=false){generation++;clearTimeout(timer);s.selected=null;s.pair=null;s.bet=0;s.completed=completed;s.ended=true;s.paused=true;render();startMenu()}
function newGame(first){s=fresh();enter(first)}
function startMenu(){dialog(s.completed?'ふたりの時間を終えました':'カードを仕舞いました','次のカードゲームの先攻・後攻を選べます。',[['自分から · 先攻',()=>newGame('pc'),true],['相手から · 後攻',()=>newGame('npc')]])}
function resume(){s.paused=false;render();if(s.turn==='npc')scheduleNPC()}
function menu(){
 if(s.ended){startMenu();return}
 generation++;clearTimeout(timer);s.paused=true;render();
 dialog('宵の間','カードメニュー',[['続ける',resume,true],['初めから · 先攻',()=>newGame('pc')],['初めから · 後攻',()=>newGame('npc')],['遊び方',()=>dialog('遊び方','絵柄を選び「カードを出す」を押します。上の履歴か山の相手の札をタップすると組み合わせられます。<br>誘いカードは場に1枚だけ出せます。誘った後も手札を出して続けます。誘いを重ねる時はベットを追加します。ベットだけでは番は終わりません。<br>誘い・確認が残ったまま1ターン（双方1手）が終わると、誘った側の欲求が増えます。<br>誘いがない時のベットは、この手のムード変化を大きくします。<br>私的卓へは、独立した誘いカードを使って移ります。私的卓では代わりに「OK？」カードを使います。双方のムードが80以上なら相手が応じられ、受け取られたら暗転して終了します。確認も場に1枚だけで、ベットを重ねても番は終わりません。手数では自動移行しません。衣装・足・背中は私的卓で使えます。<br>「仕舞う」で終了します。',[['卓へ戻る',resume]])]]);
}
$('send').onclick=()=>play(s.selected,'pc');
$('bet').onclick=()=>{
 if(s.paused||s.ended||s.turn!=='pc')return;
 if(pendingCard()){if(pendingCard()!=='pc')return;s.inviteBets.pc++}
 else s.bet=(s.bet+1)%3;
 render();
};
$('leave').onclick=()=>exitCards();
$('menu').onclick=menu;
enter('pc');
