window.StreamPatrons=(()=>{
const patrons=[
{id:'mike',name:'ミケ',personality:'寡黙な古参。普段は短文で、努力を継続している時だけ静かに褒める。',affection:8,totalTips:0,lines:['今日も見てる','無理はするな','続いてるな','今日は動きいいね']},
{id:'nightowl',name:'夜ふかし',personality:'夜型で軽口が多い。からかうが悪意はなく、配信者の小さな変化によく気づく。',affection:4,totalTips:0,lines:['まだやってたｗ','今日ちょっと上手くない？','水飲めー','最後までいるわ']},
{id:'exercise',name:'運動不足',personality:'自分も運動不足で、配信を見ながら一緒に身体を動かす共感型。素直で応援が多い。',affection:2,totalTips:0,lines:['一緒にやる','こっちも息切れした','あと少し！','今日も運動できた']},
{id:'tea',name:'麦茶',personality:'世話焼き。休憩や水分を気にし、派手な言葉より実用的な声かけをする。',affection:1,totalTips:0,lines:['水分とってね','休憩も大事','足元気をつけて','今日もおつかれ']},
{id:'rom',name:'ROM専',personality:'ほとんど発言しない観察型。たまに現れて短い一言と投げ銭だけ残す。',affection:0,totalTips:0,lines:['見てる','おつ','よかった','また来る']}
];
function pick(){const weights=patrons.map(p=>1+p.affection*.08),sum=weights.reduce((a,b)=>a+b,0);let r=Math.random()*sum;for(let i=0;i<patrons.length;i++){r-=weights[i];if(r<=0)return patrons[i]}return patrons[0]}
function tip(p){const amount=p.affection>=18?500:p.affection>=10?300:p.affection>=5?200:100;p.affection+=2;p.totalTips+=amount;return{patron:p,amount,line:p.lines[Math.floor(Math.random()*p.lines.length)]}}
return{all:patrons,pick,tip};
})();