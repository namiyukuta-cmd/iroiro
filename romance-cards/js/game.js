'use strict';
const fresh=()=>({pcMood:38,npcMood:40,pcFeeling:'calm',npcFeeling:'calm',mode:'public',turn:'pc',stack:[],discard:[],history:[],round:0,selected:null,pair:null,bet:0,paused:false,ended:false,invitation:null,date:null,time:null});
let s=fresh(),timer=null,generation=0,sequence=0;
const clamp=n=>Math.max(0,Math.min(100,n));
function change(k,n){s[k]=clamp(s[k]+n)}
function canCard(id){const c=DECK.find(c=>c[0]===id);return !!c&&(s.mode==='private'||!['leg','back','outfit'].includes(id))}
function eligible(){return DECK.filter(c=>canCard(c[0])&&c[2]<=s.npcMood)}
function enter(first,privateMode=false){
 generation++;clearTimeout(timer);s.mode=privateMode?'private':'public';s.round=0;s.selected=null;s.pair=null;s.bet=0;s.turn=first;s.paused=false;s.ended=false;s.invitation=null;render();if(first==='npc')scheduleNPC();
}
function scheduleNPC(){
 const g=generation;
 timer=setTimeout(()=>{
  if(g!==generation||s.paused||s.ended||s.turn!=='npc')return;
  const opts=eligible();if(!opts.length){exitCards();return}
  const last=s.stack.at(-1),same=last&&opts.find(c=>c[0]===last.id);
  const c=same&&Math.random()<.55?same:opts[Math.floor(Math.random()*opts.length)];
  play(c[0],'npc');
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
 if(who==='npc'&&s.mode==='public'&&s.npcMood>=60&&s.pcMood>=50&&s.invitation===null)s.invitation='npc';
 render();if(risky)$('message').textContent='💦';
 if(s.npcMood<25){exitCards();return}
 if(s.turn==='npc')scheduleNPC();
}
function readyForPrivate(){return s.npcMood>=60&&s.pcMood>=50}
function invitePrivate(){
 if(s.mode!=='public'||s.turn!=='pc'||s.paused||s.ended)return;
 s.invitation='pc';render();
 if(!readyForPrivate()){$('message').textContent='💦';return}
 generation++;clearTimeout(timer);s.paused=true;render();
 dialog('ふたりの時間','相手が誘いに応じました。',[['私的卓へ',()=>blackout(()=>enter('npc',true)),true],['卓で続ける',()=>{s.invitation=null;resume()}]]);
}
function acceptPrivate(){
 if(s.invitation!=='npc'||s.turn!=='pc'||s.paused||s.ended)return;
 generation++;clearTimeout(timer);s.paused=true;render();
 dialog('もう少し、ふたりで','“I’d like some time alone with you.”<br>「君とふたりきりで過ごしたいです。」',[['応じる',()=>blackout(()=>enter('pc',true)),true],['卓で続ける',()=>{s.invitation=null;resume()}]]);
}
function blackout(next){
 generation++;clearTimeout(timer);s.paused=true;render();const g=generation;
 $('fade').innerHTML='<div class="fade">ふたりの時間</div>';
 timer=setTimeout(()=>{if(g!==generation)return;$('fade').innerHTML='';next()},1500);
}
function exitCards(){generation++;clearTimeout(timer);s.selected=null;s.pair=null;s.bet=0;s.ended=true;s.paused=true;render();startMenu()}
function newGame(first){s=fresh();enter(first)}
function startMenu(){dialog('カードを仕舞いました','次のカードゲームの先攻・後攻を選べます。',[['自分から · 先攻',()=>newGame('pc'),true],['相手から · 後攻',()=>newGame('npc')]])}
function resume(){s.paused=false;render();if(s.turn==='npc')scheduleNPC()}
function menu(){
 if(s.ended){startMenu();return}
 generation++;clearTimeout(timer);s.paused=true;render();
 dialog('宵の間','カードメニュー',[['続ける',resume,true],['初めから · 先攻',()=>newGame('pc')],['初めから · 後攻',()=>newGame('npc')],['遊び方',()=>dialog('遊び方','絵柄を選び「カードを出す」を押します。上の履歴か山の相手の札をタップすると組み合わせられます。<br>卓の「自分ベット」で、この手のムード変化を大きくできます。<br>私的卓へは、独立した誘いカードを使って移ります。手数では自動移行しません。衣装・足・背中は私的卓で使えます。<br>「仕舞う」で終了します。',[['卓へ戻る',resume]])]]);
}
$('send').onclick=()=>play(s.selected,'pc');
$('bet').onclick=()=>{if(s.paused||s.ended||s.turn!=='pc')return;s.bet=(s.bet+1)%3;render()};
$('leave').onclick=exitCards;
$('menu').onclick=menu;
enter('pc');
