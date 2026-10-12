'use strict';
const $=id=>document.getElementById(id);
function svg(path){return `<svg viewBox="0 0 100 100" aria-hidden="true"><path d="${path}" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>`}
function cardArt(c,who='pc'){const variants=CARD_ART_BY_OWNER[who]||CARD_ART_BY_OWNER.pc;const src=Object.hasOwn(variants,c[0])?variants[c[0]]:CARD_ART[c[0]];return src?`<img class="card-art" src="${src}" alt="" draggable="false">`:svg(c[3])}
function cardName(id,who='pc'){return who==='npc'&&id==='back'?'ネクタイ':DECK.find(c=>c[0]===id)[1]}
function cardHTML(id,cls='',extra='',who='pc'){const c=DECK.find(c=>c[0]===id);return `<button class="card ${cls}" ${extra} aria-label="${cardName(id,who)}">${cardArt(c,who)}<span>${cardName(id,who)}</span></button>`}
function feeling(npc){let f=npc?s.npcFeeling:s.pcFeeling,v=npc?s.npcMood:s.pcMood;if(f==='calm'&&v>=55)f='warm';return `${s.wolf[npc?'npc':'pc']?'🐺 ':''}${FEEL[f][0]} · ♡ ${v}${pendingCard()===(npc?'npc':'pc')?' · 欲求 '+(npc?s.npcDesire:s.pcDesire):''}`}
function dialog(title,body,choices){
 $('modal').innerHTML=`<div class="overlay"><section class="dialog" role="dialog" aria-modal="true" aria-label="${title}"><h2>${title}</h2><p>${body}</p><div class="choices"></div></section></div>`;
 const box=document.querySelector('.choices');
 choices.forEach(([label,fn,primary])=>{const b=document.createElement('button');b.textContent=label;if(primary)b.className='primary';b.onclick=()=>{$('modal').innerHTML='';fn()};box.append(b)});
 box.querySelector('button')?.focus();
}
function stackHTML(cards,interactive){
 if(!cards.length)return '<div class="empty-pile" aria-label="行為の記録なし"></div>';
 const actions=cards.filter(c=>!c.pairedWith);
 return actions.map((c,i)=>{
  const partner=cards.find(p=>p.pairedWith===c.seq);
  const disabled=!interactive||c.who!=='npc'||c.usedForPair||s.turn!=='pc'||s.paused||s.ended;
  const attrs=`data-seq="${c.seq}" ${disabled?'disabled':''}`;
  return `<div class="action-group ${partner?'paired-action':''}" style="--x:${(i-actions.length+1)*Math.min(2,24/Math.max(1,actions.length-1))}px;--y:${(i-actions.length+1)*Math.min(2,24/Math.max(1,actions.length-1))}px;z-index:${i}">${cardHTML(c.id,`${c.who} ${partner?'combined-base':''} ${c.seq===s.lastPlay?.seq?'latest-card':''} ${s.pair===c.seq?'picked':''}`,attrs,c.who)}${partner?cardHTML(partner.id,`${partner.who} combined-top`,'disabled',partner.who):''}</div>`;
 }).join('');
}
let effectTimer=null;
function clearPlayEffect(){clearTimeout(effectTimer);$('playEffect').innerHTML=''}
function showPlayed(card,partner=null,labelOverride=null){
 clearPlayEffect();
 const label=labelOverride||(partner?(card.who==='npc'?'相手がこちらの札を重ねた':'重ねた札'):card.who==='npc'?'相手が出した札':'自分が出した札');
 $('playEffect').innerHTML=`<div class="played-preview ${card.who}"><span class="played-label">${label}</span><div class="played-cards">${cardHTML(card.id,'','',card.who)}${partner?cardHTML(partner.id,'','',partner.who||'npc'):''}</div></div>`;
 effectTimer=setTimeout(clearPlayEffect,1400);
}
let wolfTimer=null;
function clearWolfEffect(){clearTimeout(wolfTimer);$('wolfEffect').innerHTML=''}
function showWolfEffect(who){
 clearWolfEffect();
 $('wolfEffect').innerHTML=`<div class="wolf-burst"><span aria-hidden="true">🐺</span><strong>${who==='npc'?'相手':'自分'}の狼効果</strong><span>焦らしで欲求が高まっています</span></div>`;
 wolfTimer=setTimeout(clearWolfEffect,2400);
}
function showTeaseBet(who){
 const target=$(who==='npc'?'npcInvite':'pcInvite');
 target.classList.remove('bet-pulse');void target.offsetWidth;target.classList.add('bet-pulse');
 target.onanimationend=e=>{if(e.animationName==='tease-bet')target.classList.remove('bet-pulse')};
}
function render(){
 const inactive=s.paused||s.ended,pcTurn=s.turn==='pc'&&!inactive;
 const handCount=DECK.filter(c=>canCard(c[0])).length;
 $('npcHand').style.setProperty('--hand-count',handCount);
 $('hand').style.setProperty('--hand-count',handCount);
 $('scene').classList.toggle('private',s.mode==='private');
 $('scene').classList.toggle('wolf-active',s.wolf.npc||s.wolf.pc);
 $('gameDate').textContent='日付 '+(s.date||'—');
 $('gameTime').textContent='時間 '+(s.time||'—');
 $('moods').innerHTML=`<span aria-hidden="true">♡</span><div class="meter" style="--value:${s.npcMood}%" role="progressbar" aria-label="相手のムード" aria-valuenow="${s.npcMood}" aria-valuemin="0" aria-valuemax="100"><i></i></div><span>${s.npcMood}</span>`;
 $('npcName').textContent='相手手札 · オリヴァー';
 $('npcFeeling').textContent=feeling(true);
 $('pcFeeling').textContent=feeling(false);
 $('tableNote').textContent=s.mode==='private'?'私的卓':'通常卓';
 const turnMessage=s.turn==='npc'?'相手の番…':'あなたの番';
 const playedName=s.lastPlay&&cardName(s.lastPlay.id,s.lastPlay.who)+(s.lastPlay.partner?'＋'+cardName(s.lastPlay.partner,s.lastPlay.who==='npc'?'pc':'npc'):'');
 $('message').textContent=s.ended?(s.completed?'ふたりの時間を終えました':'カードを仕舞いました'):s.lastPlay?`${s.lastPlay.who==='npc'?'相手':'自分'}が「${playedName}」を出しました · ${turnMessage}`:turnMessage;
 $('npcHand').innerHTML=s.npcHand.map((id,i)=>{
  if(id){const card=DECK.find(c=>c[0]===id);return cardHTML(id,`opponent-face ${s.drawn?.index===i?'picked':''}`,`style="--order:${i}" data-npc-index="${i}" aria-description="相手の${cardName(id,'npc')}を引き抜く" ${!pcTurn?'disabled':''}`,'npc')}
  return `<button class="card empty-hand" style="--order:${i}" data-npc-index="${i}" aria-label="${s.drawn?.index===i?'引き抜いた札を戻す':'札なし'}" ${!pcTurn||s.drawn?.index!==i?'disabled':''}>${s.drawn?.index===i?'戻す':''}</button>`;
 }).join('');
 $('npcHand').querySelectorAll('[data-npc-index]').forEach(e=>e.onclick=()=>drawNPC(+e.dataset.npcIndex));
 $('hand').innerHTML=DECK.filter(c=>canCard(c[0])).map((c,i)=>{
  let html=cardHTML(c[0],`${s.selected===c[0]?'selected':''} ${!canCard(c[0])?'unavailable':''}`,`style="--order:${i}" data-card="${c[0]}" aria-pressed="${s.selected===c[0]}" ${!canCard(c[0])||!pcTurn?'disabled':''}`);
  const partner=s.drawn||s.stack.find(p=>p.seq===s.pair&&p.who==='npc'&&!p.pairedWith&&!p.usedForPair);
  if(s.selected===c[0]&&partner){const other=DECK.find(d=>d[0]===partner.id);html=html.replace('</button>',`<span class="borrowed-card">${cardArt(other,'npc')}<small>${cardName(other[0],'npc')}</small></span></button>`)}
  return html;
 }).join('');
 $('hand').querySelectorAll('[data-card]').forEach(e=>e.onclick=()=>{s.selected=e.dataset.card;render()});
 $('pile').innerHTML=stackHTML(s.stack,true);
 $('discard').innerHTML=stackHTML(s.discard,false);
 $('pile').querySelectorAll('[data-seq]').forEach(e=>e.onclick=()=>selectPair(+e.dataset.seq));
 const recent=s.history;
 $('history').innerHTML=recent.length?recent.map(c=>{
  const deck=DECK.find(d=>d[0]===c.id),available=pcTurn&&c.who==='npc'&&s.stack.some(p=>p.seq===c.seq&&!p.pairedWith&&!p.usedForPair);
  return `<button class="history-icon ${c.who} ${s.pair===c.seq?'picked':''}" aria-label="${c.who==='npc'?'相手':'自分'}：${cardName(c.id,c.who)}" data-history-seq="${c.seq}" ${available?'':'disabled'}>${cardArt(deck,c.who)}</button>`;
 }).join(''):'<span class="history-empty">—</span>';
 $('history').querySelectorAll('[data-history-seq]').forEach(e=>e.onclick=()=>selectPair(+e.dataset.historySeq));
 const inviting=pendingCard();
 const privateMode=s.mode==='private';
 const teasing=!!(inviting&&s.teasing[inviting]);
 const desire=inviting?(inviting==='npc'?s.npcDesire:s.pcDesire):0;
 const intensity=Math.min(1,desire/20);
 $('teaseStatus').innerHTML=teasing?`<strong>焦らし中♡</strong><span>${inviting==='npc'?'相手':'自分'}の欲求 ${desire}</span><div class="tease-meter" role="progressbar" aria-label="${inviting==='npc'?'相手':'自分'}の欲求" aria-valuenow="${desire}" aria-valuemin="0" aria-valuemax="100"><i style="width:${desire}%"></i></div>`:'';
 $('teaseStatus').classList.toggle('active',teasing);
 $('scene').classList.toggle('teasing-active',teasing);
 for(const who of ['pc','npc']){
  const slot=$(who==='npc'?'npcInvite':'pcInvite');
  slot.classList.toggle('teasing-invite',teasing&&inviting===who);
  slot.style.setProperty('--tease-speed',`${1.1-intensity*.65}s`);
  slot.style.setProperty('--tease-glow',`${6+intensity*18}px`);
  slot.style.setProperty('--tease-color',`hsl(${335+intensity*20} 45% ${28+intensity*8}%)`);
 }

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
 $('cardHelp').textContent=s.ended?(s.completed?'静かな余韻が残っています':'カードを仕舞いました'):s.drawn?`相手の「${cardName(s.drawn.id,'npc')}」を自分の札に重ねます`:s.pair!==null?'相手の場札を自分の札に重ねます':inviting==='npc'?(privateMode?'相手の「OK？」をタップして応じられます':'相手の誘い札をタップして応じられます'):inviting==='pc'?'ベットを重ね、手札を出して続けます':s.bet?'ベットでこの手の変化が大きくなります':'札を選んで「カードを出す」';
}
