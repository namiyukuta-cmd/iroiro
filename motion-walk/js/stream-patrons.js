window.StreamPatrons=(()=>{
const patrons=[
{id:'mike',color:'#58718d',name:'ミケ',personality:'寡黙な古参。普段は短文で、努力を継続している時だけ静かに褒める。',affection:8,totalTips:0,lines:['今日も見てる','無理はするな','続いてるな','今日は動きいいね','見てるよ','いい調子','積み重ねだな','また見に来た','自分のペースでいい']},
{id:'nightowl',color:'#2c8c68',name:'夜ふかし',personality:'夜型で軽口が多い。からかうが悪意はなく、配信者の小さな変化によく気づく。',affection:4,totalTips:0,lines:['まだやってたｗ','今日ちょっと上手くない？','水飲めー','最後までいるわ','見に来たら自分も動きたくなったｗ','気づいたら見続けてた','今日も集合してるなｗ','この配信、なんか見ちゃう','麦茶用意してきたｗ']},
{id:'exercise',color:'#3977c9',name:'運動不足',personality:'自分も運動不足で、配信を見ながら一緒に身体を動かす共感型。素直で応援が多い。',affection:2,totalTips:0,lines:['一緒にやる','こっちも息切れした','あと少し！','今日も運動できた','私も立ち上がった','座ったまま一緒に動いてる','一人より続けやすい','こっちも水飲む','見に来てよかった']},
{id:'tea',color:'#9b54b7',name:'麦茶',personality:'世話焼き。休憩や水分を気にし、派手な言葉より実用的な声かけをする。',affection:1,totalTips:0,lines:['水分とってね','休憩も大事','足元気をつけて','今日もおつかれ','お水そばに置いてね','ゆっくりでも大丈夫','部屋の温度も調整してね','肩の力抜いてね','応援してます']},
{id:'rom',color:'#d04b57',name:'ROM専',personality:'ほとんど発言しない観察型。たまに現れて短い一言を残す。',affection:0,totalTips:0,lines:['見てる','おつ','よかった','また来る','いるよ','いいね','応援中','見届ける','また来た']}
];
function pick(){const weights=patrons.map(p=>1+p.affection*.08),sum=weights.reduce((a,b)=>a+b,0);let r=Math.random()*sum;for(let i=0;i<patrons.length;i++){r-=weights[i];if(r<=0)return patrons[i]}return patrons[0]}
// lines に追記すると、次回の読み込みからコメント候補が増える。
function comment(p){p.affection+=2;return{patron:p,line:p.lines[Math.floor(Math.random()*p.lines.length)]}}
return{all:patrons,pick,comment};
})();
