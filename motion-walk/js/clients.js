(()=>{
'use strict';

const clients={
  clinic_staff:{id:'clinic_staff',name:'ミラ',role:'第9区診療所の夜勤スタッフ',personality:'穏やかで忙しい。患者を最優先する。',affection:0,deliveries:0,lines:['ありがとう。助かったよ','また来てくれたんだね。ありがとう','あなたなら安心して任せられる'],special:{at:5,title:'緊急医療便',item:'緊急用ナノ血液',from:'第9区診療所',to:'北区救護所',km:.42,pay:75}},
  hooded_man:{id:'hooded_man',name:'ヴェイル',role:'素性を明かさない情報屋',personality:'無口で警戒心が強い。余計な質問を嫌う。',affection:0,deliveries:0,lines:['……ご苦労','またお前か。悪くない','お前には任せられる'],special:{at:5,title:'無記名便',item:'黒いデータケース',from:'第3高架下',to:'旧通信塔',km:.46,pay:82}},
  mechanic:{id:'mechanic',name:'ローク',role:'南ブロックの義肢整備士',personality:'ぶっきらぼうだが面倒見がいい。',affection:0,deliveries:0,lines:['おう、ありがとな','また頼んだぜ','来たか。待ってたぞ'],special:{at:5,title:'工房特急便',item:'試作義肢フレーム',from:'機械街',to:'南ブロック工房',km:.38,pay:72}},
  resident:{id:'resident',name:'ニア',role:'居住塔C-17の住民',personality:'人懐っこく、配達人との短い会話を楽しみにしている。',affection:0,deliveries:0,lines:['ありがとう！','今日も来てくれたんだ','あなたが来るとちょっと嬉しい'],special:{at:5,title:'小さな贈り物',item:'誕生日用の包み',from:'ネオン市場',to:'居住塔C-17',km:.25,pay:65}},
  researcher:{id:'researcher',name:'セラ',role:'NEXUS研究棟の研究員',personality:'理性的で時間に厳しい。仕事の正確さを評価する。',affection:0,deliveries:0,lines:['受領しました。ありがとう','予定通りですね','あなたの配送記録は信頼できます'],special:{at:5,title:'極低温輸送',item:'実験用冷却コア',from:'港湾倉庫',to:'NEXUS隔離棟',km:.49,pay:85}},
  repairer:{id:'repairer',name:'バズ',role:'第6修理区のドローン修理屋',personality:'陽気で機械の話になると止まらない。',affection:0,deliveries:0,lines:['助かった！','お、いつもの配達屋！','最高だ。また頼むよ！'],special:{at:5,title:'墜落機回収便',item:'損傷ドローン中枢',from:'外周路',to:'第6修理区',km:.35,pay:70}},
  requester:{id:'requester',name:'シアン',role:'雨路地に現れる謎の依頼人',personality:'静かで秘密が多い。荷物の中身を説明しない。',affection:0,deliveries:0,lines:['確かに受け取った','また会ったね','君には少し話してもいいかもしれない'],special:{at:5,title:'雨路地の秘密',item:'封印された銀色の箱',from:'地下商店街',to:'旧地下鉄入口',km:.44,pay:88}},
  tailor:{id:'tailor',name:'エダ',role:'東区の仕立屋',personality:'気さくで観察眼が鋭い。',affection:0,deliveries:0,lines:['ありがとう、助かったよ','また来たね。お疲れさま','あんた、ずいぶん頼もしくなったね'],special:{at:5,title:'特注素材便',item:'発光合成繊維',from:'工業区',to:'東区仕立屋',km:.29,pay:68}}
};

function get(id){return clients[id]||null;}
function lineFor(npc){
  if(npc.affection>=5)return npc.lines[2];
  if(npc.affection>=2)return npc.lines[1];
  return npc.lines[0];
}
function completeDelivery(id){
  const npc=get(id);
  if(!npc)return null;
  npc.deliveries++;
  npc.affection++;
  return {...npc,line:lineFor(npc),specialUnlocked:npc.affection===npc.special.at};
}
function getSpecial(id){
  const npc=get(id);
  if(!npc || npc.affection<npc.special.at)return null;
  return {...npc.special,clientId:id};
}
function all(){return Object.values(clients).map(n=>({...n}));}
function reset(){Object.values(clients).forEach(n=>{n.affection=0;n.deliveries=0;});}
window.DeliveryNPC={get,completeDelivery,getSpecial,all,reset,lineFor};
})();