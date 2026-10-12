'use strict';
const fresh=()=>({pcMood:38,npcMood:40,pcFeeling:'calm',npcFeeling:'calm',mode:'public',turn:'pc',stack:[],discard:[],history:[],lastPlay:null,drawn:null,npcHand:[],wolf:{pc:false,npc:false},teasing:{pc:false,npc:false},round:0,selected:null,pair:null,bet:0,paused:false,ended:false,invitation:null,confirmation:null,completed:false,inviteBets:{pc:0,npc:0},pcDesire:0,npcDesire:0,date:null,time:null});
let s=fresh(),timer=null,generation=0,sequence=0;
const clamp=n=>Math.max(0,Math.min(100,n));
function change(k,n){s[k]=clamp(s[k]+n)}
function canCard(id){const c=DECK.find(c=>c[0]===id);return !!c&&(s.mode==='private'||!['leg','back','outfit'].includes(id))}
function dealNPC(){
 const cards=DECK.filter(c=>canCard(c[0])).map(c=>c[0]);
 for(let i=cards.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[cards[i],cards[j]]=[cards[j],cards[i]]}
 s.npcHand=cards;
}
function eligible(){return DECK.filter(c=>s.npcHand.includes(c[0])&&canCard(c[0])&&c[2]<=s.npcMood)}
function chooseNPC(){
 if(!s.npcHand.some(Boolean))dealNPC();
 let opts=eligible();
 if(!opts.length)opts=DECK.filter(c=>s.npcHand.includes(c[0])&&canCard(c[0])).sort((a,b)=>a[2]-b[2]).slice(0,1);
 if(!opts.length)return null;
 const lastPC=s.history.findLast(c=>c.who==='pc'),lastNPC=s.history.findLast(c=>c.who==='npc');
 const varied=opts.filter(c=>c[0]!==lastPC?.id&&c[0]!==lastNPC?.id);
 if(varied.length)opts=varied;
 const weighted=opts.map(c=>({card:c,weight:s.wolf.npc&&['lips','neck','ear','back','outfit'].includes(c[0])?4:1}));
 let roll=Math.random()*weighted.reduce((n,c)=>n+c.weight,0);
 for(const option of weighted){roll-=option.weight;if(roll<0)return option.card}
 return weighted.at(-1).card;
}
function chooseNPCPartner(id){
 if(s.npcMood<45||Math.random()> (s.wolf.npc ? .8 : .45))return null;
 const options=DECK.filter(c=>canCard(c[0])&&c[2]<=s.npcMood);
 if(!options.length)return null;
 const weights=options.map(c=>({id:c[0],weight:pairBonus(id,c[0])+(s.history.findLast(p=>p.who==='pc')?.id===c[0]?2:0)}));
 let roll=Math.random()*weights.reduce((sum,c)=>sum+c.weight,0);
 for(const c of weights){roll-=c.weight;if(roll<0)return c.id}
 return weights.at(-1).id;
}
function addNPCBet(){
 if(pendingCard()!=='npc')return;
 s.inviteBets.npc++;change('npcDesire',1);
 if(!s.wolf.npc&&s.npcDesire>=20){s.wolf.npc=true;showWolfEffect('npc')}
 showTeaseBet('npc');
}
function drawNPC(index){
 if(s.paused||s.ended||s.turn!=='pc'||!Number.isInteger(index)||index<0||index>=s.npcHand.length)return;
 const id=s.npcHand[index];
 if(s.drawn?.index===index){s.drawn=null;render();return}
 if(!id){s.drawn=null;render();return}
 s.drawn={id,index};s.pair=null;render();showPlayed({id,who:'npc'},null,'引き抜いた札');
}
function selectPair(seq){
 if(s.paused||s.ended||s.turn!=='pc'||!s.stack.some(c=>c.seq===seq&&c.who==='npc'&&!c.pairedWith&&!c.usedForPair))return;
 s.drawn=null;
 s.pair=s.pair===seq?null:seq;render();
}
function enter(first,privateMode=false){
 generation++;clearTimeout(timer);clearPlayEffect();clearWolfEffect();s.lastPlay=null;s.drawn=null;s.mode=privateMode?'private':'public';s.round=0;s.selected=null;s.pair=null;s.bet=0;s.turn=first;s.paused=false;s.ended=false;s.invitation=null;s.confirmation=null;s.completed=false;s.inviteBets={pc:0,npc:0};s.teasing={pc:false,npc:false};dealNPC();render();if(first==='npc')scheduleNPC();
}
function pendingCard(){return s.mode==='public'?s.invitation:s.confirmation}
function readyForFinish(){return s.npcMood>=80&&s.pcMood>=80}
function scheduleNPC(){
 const g=generation;
 timer=setTimeout(()=>{
  if(g!==generation||s.paused||s.ended||s.turn!=='npc')return;
  const c=chooseNPC();if(!c){exitCards();return}
  if(pendingCard()==='npc'&&((s.teasing.npc&&s.inviteBets.npc===0)||Math.random()<(s.wolf.npc ? .8 : s.teasing.npc ? .65 : .4)))addNPCBet();
  play(c[0],'npc',chooseNPCPartner(c[0]));
  if(s.invitation==='pc'&&readyForPrivate()&&!s.ended)offerPrivate();
  if(s.mode==='private'&&s.confirmation==='pc'&&readyForFinish()&&!s.ended)offerFinish();
 },850);
}
function pairBonus(id,other){const ids=[id,other];return ids.includes('neck')&&ids.includes('lips')?9:id===other?4:ids.includes('hand')?5:3}
function play(id,who,otherId=null){
 if(s.paused||s.ended||!canCard(id)||s.turn!==who)return;
 const waiting=pendingCard();
 if(waiting&&waiting!==who)s.teasing[waiting]=true;
 const c=DECK.find(c=>c[0]===id),chosen=who==='pc'?s.stack.find(c=>c.seq===s.pair&&c.who==='npc'&&!c.pairedWith&&!c.usedForPair):null;
 const partner=who==='pc'?(s.drawn?{id:s.drawn.id,who:'npc',seq:++sequence,fromHand:true}:chosen?{id:chosen.id,who:chosen.who,seq:++sequence,sourceSeq:chosen.seq}:null):(otherId&&canCard(otherId)?{id:otherId,who:'pc',seq:++sequence,fromHand:true}:null);
 const risky=c[2]>s.npcMood||(partner&&DECK.find(c=>c[0]===partner.id)[2]>s.npcMood);
 let gain=risky?-7:5;if(partner)gain+=risky?0:pairBonus(id,partner.id);
 if(s.wolf[who]&&['lips','neck','ear','back','outfit'].includes(id)&&!risky)gain+=2;
 gain*=1+(who==='pc'?s.bet:0)*.5;change('npcMood',Math.round(gain));change('pcMood',Math.round(gain*.7));
 if(chosen)chosen.usedForPair=true;
 const played={id,who,seq:++sequence,partner:partner?.id};s.stack.push(played);s.history.push({...played});s.lastPlay=played;
 if(partner)s.stack.push({...partner,pairedWith:played.seq});
 s.drawn=null;
 s.round++;s.selected=null;s.pair=null;s.bet=0;s.turn=who==='pc'?'npc':'pc';
 let wolfActivated=null;
 if(s.round%2===0&&pendingCard()){
  const proposer=pendingCard();change(proposer+'Desire',3+Math.min(7,s.inviteBets[proposer]));
  if(!s.wolf[proposer]&&s[proposer+'Desire']>=20){s.wolf[proposer]=true;wolfActivated=proposer}
 }
 if(who==='npc'&&s.mode==='public'&&s.npcMood>=60&&s.pcMood>=50&&s.invitation===null)s.invitation='npc';
 if(who==='npc'&&s.mode==='private'&&readyForFinish()&&s.confirmation===null)s.confirmation='npc';
 render();showPlayed(played,partner);if(wolfActivated)showWolfEffect(wolfActivated);if(risky)$('message').textContent+=' 💦';
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
 generation++;clearTimeout(timer);clearPlayEffect();clearWolfEffect();s.paused=true;render();const g=generation;
 $('fade').innerHTML='<div class="fade">ふたりの時間</div>';
 timer=setTimeout(()=>{if(g!==generation)return;$('fade').innerHTML='';next()},1500);
}
function exitCards(completed=false){generation++;clearTimeout(timer);clearPlayEffect();clearWolfEffect();s.selected=null;s.pair=null;s.bet=0;s.completed=completed;s.ended=true;s.paused=true;render();if(completed)endingScreen();else startMenu()}
function newGame(first){s=fresh();enter(first)}
function endingScreen(){
 dialog('ふたりの時間','卓の札が伏せられ、灯りが落ちます。<br>……<br>ふたりだけの時間が過ぎ、静かな余韻が残っています。',[['余韻のまま閉じる',()=>{$('modal').innerHTML=''},true],['もう一度遊ぶ',startMenu]]);
}
function startMenu(){dialog(s.completed?'ふたりの時間を終えました':'カードを仕舞いました','次のカードゲームの先攻・後攻を選べます。',[['自分から · 先攻',()=>newGame('pc'),true],['相手から · 後攻',()=>newGame('npc')]])}
function resume(){s.paused=false;render();if(s.turn==='npc')scheduleNPC()}
function menu(){
 if(s.ended){if(s.completed)endingScreen();else startMenu();return}
 generation++;clearTimeout(timer);s.paused=true;render();
 dialog('宵の間','カードメニュー',[['続ける',resume,true],['初めから · 先攻',()=>newGame('pc')],['初めから · 後攻',()=>newGame('npc')],['遊び方',()=>dialog('遊び方','絵柄を選び「カードを出す」を押します。相手の表向き手札をタップして引き抜き、自分の札を選ぶと重ねられます。もう一度同じ空き枠をタップすると戻せます。上の履歴や山から相手の場札を選んでも重ねられます。相手もこちらの部位札を選んで自分の札と組み合わせます。相手自身の誘いを焦らされている時は、ベットも重ねやすくなります。部位の札は使っても残ります。中央の山は行った行為の記録で、組み合わせた2枚は一組として積まれます。<br>誘いカードは場に1枚だけ出せます。誘った後も手札を出して続けます。誘いを重ねる時はベットを追加します。ベットだけでは番は終わりません。<br>誘い・確認が残ったまま1ターン（双方1手）が終わると、誘った側の欲求が増えます。欲求20で狼効果が発動し、積極的な札を選びやすくなり、その札のムード効果も強まります。<br>誘いがない時のベットは、この手のムード変化を大きくします。<br>私的卓へは、独立した誘いカードを使って移ります。私的卓では代わりに「OK？」カードを使います。双方のムードが80以上なら相手が応じられ、受け取られたら暗転して余韻の画面になります。次のゲームは「もう一度遊ぶ」を選ぶまで始まりません。確認も場に1枚だけで、ベットを重ねても番は終わりません。手数では自動移行しません。衣装・足・背中は私的卓で使えます。<br>「仕舞う」で終了します。',[['卓へ戻る',resume]])]]);
}
$('send').onclick=()=>play(s.selected,'pc');
$('bet').onclick=()=>{
 if(s.paused||s.ended||s.turn!=='pc')return;
 if(pendingCard()){if(pendingCard()!=='pc')return;s.inviteBets.pc++;change('pcDesire',1);if(!s.wolf.pc&&s.pcDesire>=20){s.wolf.pc=true;showWolfEffect('pc')}showTeaseBet('pc')}
 else s.bet=(s.bet+1)%3;
 render();
};
$('leave').onclick=()=>{if(s.ended&&s.completed)endingScreen();else exitCards()};
$('menu').onclick=menu;
enter('pc');
