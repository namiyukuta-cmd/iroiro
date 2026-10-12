'use strict';
const $=id=>document.getElementById(id);
function svg(path){return `<svg viewBox="0 0 100 100" aria-hidden="true"><path d="${path}" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>`}
function cardHTML(id,cls='',extra=''){const c=DECK.find(c=>c[0]===id);return `<button class="card ${cls}" ${extra} aria-label="${c[1]}">${svg(c[3])}<span>${c[1]}</span></button>`}
function feeling(npc){let f=npc?s.npcFeeling:s.pcFeeling,v=npc?s.npcMood:s.pcMood;if(f==='calm'&&v>=55)f='warm';return `${FEEL[f][0]} · ♡ ${v}${pendingCard()===(npc?'npc':'pc')?' · 欲求 '+(npc?s.npcDesire:s.pcDesire):''}`}
function dialog(title,body,choices){
 $('modal').innerHTML=`<div class="overlay"><section class="dialog" role="dialog" aria-modal="true" aria-label="${title}"><h2>${title}</h2><p>${body}</p><div class="choices"></div></section></div>`;
 const box=document.querySelector('.choices');
 choices.forEach(([label,fn,primary])=>{const b=document.createElement('button');b.textContent=label;if(primary)b.className='primary';b.onclick=()=>{$('modal').innerHTML='';fn()};box.append(b)});
 box.querySelector('button')?.focus();
}
function stackHTML(cards,interactive){
 if(!cards.length)return '<div class="empty-pile" aria-label="札なし"></div>';
 const visible=cards.slice(-5);
 return visible.map((c,i)=>cardHTML(c.id,`${c.who} ${s.pair===c.seq?'picked':''}`,`style="--x:${(i-visible.length+1)*-2}px;--y:${(i-visible.length+1)*-2}px;z-index:${i}" data-seq="${c.seq}" ${!interactive||c.who!=='npc'||s.turn!=='pc'||s.paused||s.ended?'disabled':''}`)).join('');
}
function render(){
 const inactive=s.paused||s.ended,pcTurn=s.turn==='pc'&&!inactive;
 $('scene').classList.toggle('private',s.mode==='private');
 $('gameDate').textContent='日付 '+(s.date||'—');
 $('gameTime').textContent='時間 '+(s.time||'—');
 $('moods').innerHTML=`<span aria-hidden="true">♡</span><div class="meter" style="--value:${s.npcMood}%" role="progressbar" aria-label="相手のムード" aria-valuenow="${s.npcMood}" aria-valuemin="0" aria-valuemax="100"><i></i></div><span>${s.npcMood}</span>`;
 $('npcName').textContent='相手手札 · オリヴァー';
 $('npcFeeling').textContent=feeling(true);
 $('pcFeeling').textContent=feeling(false);
 $('tableNote').textContent=s.mode==='private'?'私的卓':'通常卓';
 $('message').textContent=s.ended?(s.completed?'ふたりの時間を終えました':'カードを仕舞いました'):s.turn==='npc'?'相手の番…':'あなたの番';
 $('npcHand').innerHTML=DECK.map((c,i)=>`<div class="card" style="--order:${i}" aria-label="相手の手札・裏向き"><i class="card-back" aria-hidden="true"></i></div>`).join('');
 $('hand').innerHTML=DECK.map((c,i)=>cardHTML(c[0],`${s.selected===c[0]?'selected':''} ${!canCard(c[0])?'unavailable':''}`,`style="--order:${i}" data-card="${c[0]}" aria-pressed="${s.selected===c[0]}" ${!canCard(c[0])||!pcTurn?'disabled':''}`)).join('');
 $('hand').querySelectorAll('[data-card]').forEach(e=>e.onclick=()=>{s.selected=e.dataset.card;render()});
 $('pile').innerHTML=stackHTML(s.stack,true);
 $('discard').innerHTML=stackHTML(s.discard,false);
 $('pile').querySelectorAll('[data-seq]').forEach(e=>e.onclick=()=>{s.pair=s.pair===+e.dataset.seq?null:+e.dataset.seq;render()});
 const recent=s.history.slice(-24);
 $('history').innerHTML=recent.length?recent.map(c=>{
  const deck=DECK.find(d=>d[0]===c.id),available=pcTurn&&c.who==='npc'&&s.stack.some(p=>p.seq===c.seq);
  return `<button class="history-icon ${c.who} ${s.pair===c.seq?'picked':''}" aria-label="${c.who==='npc'?'相手':'自分'}：${deck[1]}" data-history-seq="${c.seq}" ${available?'':'disabled'}>${svg(deck[3])}</button>`;
 }).join(''):'<span class="history-empty">—</span>';
 $('history').querySelectorAll('[data-history-seq]').forEach(e=>e.onclick=()=>{s.pair=s.pair===+e.dataset.historySeq?null:+e.dataset.historySeq;render()});
 const inviting=pendingCard();
 const privateMode=s.mode==='private';
 $('npcInviteTitle').textContent=privateMode?'相手の確認カード':'相手の誘いカード';
 $('pcInviteTitle').textContent=privateMode?'自分の確認カード':'自分の誘いカード';
 $('npcBet').innerHTML=`<div class="bet-card" aria-label="相手のベット ＋${inviting?s.inviteBets.npc:0}">＋${inviting?s.inviteBets.npc:0}</div>`;
 const pcBet=inviting?s.inviteBets.pc:s.bet;
 $('bet').textContent='＋'+pcBet;
 $('bet').classList.toggle('has-bet',pcBet>0);
 $('bet').disabled=!pcTurn||(inviting&&inviting!=='pc');
 $('send').disabled=!pcTurn||!s.selected;
 $('npcInvite').innerHTML=inviting==='npc'?`<button class="invite-card placed" id="acceptInvite" aria-label="${privateMode?'相手の確認に応じる':'相手の誘いに応じる'}" ${!pcTurn?'disabled':''}><span class="invite-symbol">♡</span><span>${privateMode?'OK？':'誘い'}</span></button>`:'<div class="invite-empty" aria-label="相手の提案なし"></div>';
 $('pcInvite').innerHTML=inviting!=='npc'?`<button class="invite-card ${inviting==='pc'?'placed':''}" id="invite" ${!pcTurn||inviting!==null?'disabled':''}><span class="invite-symbol">♡</span><span>${privateMode?'OK？':inviting==='pc'?'誘い':'誘う'}</span></button>`:'<div class="invite-empty" aria-label="自分の提案なし"></div>';
 if($('invite'))$('invite').onclick=privateMode?confirmFinish:invitePrivate;
 if($('acceptInvite'))$('acceptInvite').onclick=privateMode?acceptFinish:acceptPrivate;
 $('cardHelp').textContent=s.pair!==null?'相手の札と組み合わせます':inviting==='npc'?(privateMode?'相手の「OK？」をタップして応じられます':'相手の誘い札をタップして応じられます'):inviting==='pc'?'ベットを重ね、手札を出して続けます':s.bet?'ベットでこの手の変化が大きくなります':'札を選んで「カードを出す」';
}
