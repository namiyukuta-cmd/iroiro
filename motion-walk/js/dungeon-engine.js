window.DungeonEngine = (() => {
  const vectors=[[0,-1],[1,0],[0,1],[-1,0]];
  function create(data, random=Math.random) {
    const s={...data.start,floor:0,hp:data.player.hp,maxHp:data.player.hp,atk:data.player.atk,potions:data.player.potions,level:1,xp:0,gold:0,kills:0,steps:0,mode:'explore',paused:false,enemy:null,selection:0,log:'「進め」で1マス移動。「調べる」で足元や正面を確認。',cleared:new Set(),previous:null};
    const key=()=>`${s.floor}:${s.x}:${s.y}`;
    const tile=(x,y)=>data.floors[s.floor].map[y]?.[x]||'#';
    const nextXp=()=>s.level*20;
    function encounter(){s.enemy={...data.enemies[Math.min(s.floor,data.enemies.length-1)]};s.mode='battle';s.selection=0;s.log=s.enemy.name+'が現れた。行動を選んでください。';}
    function retaliation(guard=false){const d=Math.max(1,s.enemy.atk+Math.floor(random()*3)-(guard?5:0));s.hp=Math.max(0,s.hp-d);s.log+=` 敵の攻撃、${d}ダメージ。`;if(!s.hp){s.mode='dead';s.enemy=null;s.log='力尽きました。「最初から」でやり直せます。';}}
    function heal(){if(!s.potions){s.log='回復薬がありません。';return false;}if(s.hp===s.maxHp){s.log='HPは満タンです。';return false;}s.potions--;const h=Math.min(data.healAmount,s.maxHp-s.hp);s.hp+=h;s.log=`回復薬でHPが${h}回復。`;return true;}
    function command(cmd){
      if(cmd==='pause'){s.paused=true;s.log='一時停止中。「再開」で戻ります。';return;}
      if(cmd==='resume'){s.paused=false;s.log='再開しました。';return;}
      if(s.paused||s.mode==='dead'||s.mode==='complete')return;
      if(s.mode==='battle'){
        const choices=['attack','guard','heal','flee'];
        if(cmd==='left'||cmd==='right'){s.selection=(s.selection+(cmd==='right'?1:3))%4;return;}
        if(cmd==='confirm')cmd=choices[s.selection];
        if(cmd==='attack'){
          const d=s.atk+Math.floor(random()*6);s.enemy.hp=Math.max(0,s.enemy.hp-d);s.log=`攻撃！ ${d}ダメージ。`;
          if(!s.enemy.hp){const e=s.enemy;s.xp+=e.xp;s.gold+=e.gold;s.kills++;s.cleared.add(key());s.enemy=null;s.mode='explore';s.log=`${e.name}を倒した。経験値${e.xp}、${e.gold}G獲得。`;
            while(s.xp>=nextXp()){s.xp-=nextXp();s.level++;s.atk+=3;s.maxHp+=6;s.hp=s.maxHp;s.log+=' レベルアップ！HP回復。';}return;}
          retaliation();
        }else if(cmd==='guard'){s.log='身を守った。';retaliation(true);}
        else if(cmd==='heal'){if(heal())retaliation();}
        else if(cmd==='flee'){if(random()<.8){Object.assign(s,s.previous);s.enemy=null;s.mode='explore';s.log='直前のマスへ逃げ戻った。';}else{s.log='逃げ道をふさがれた。';retaliation();}}
        else{s.log='戦闘中：攻撃・防御・回復・逃げる。';}
        return;
      }
      if(cmd==='left'||cmd==='right'){s.dir=(s.dir+(cmd==='right'?1:3))%4;s.log=(cmd==='right'?'右':'左')+'を向いた。';}
      else if(cmd==='forward'||cmd==='back'){
        const [dx,dy]=vectors[s.dir],sign=cmd==='back'?-1:1,x=s.x+dx*sign,y=s.y+dy*sign;
        if(tile(x,y)==='#'){s.log='石壁があり、進めません。';return;}
        s.previous={x:s.x,y:s.y};s.x=x;s.y=y;s.steps++;
        const t=tile(x,y);s.log=cmd==='back'?'1マス後退した。':'1マス進んだ。';
        if(t==='E'&&!s.cleared.has(key()))encounter();
        else if(t==='C'&&!s.cleared.has(key()))s.log='宝箱がある。「調べる」で開きます。';
        else if(t==='S')s.log='下り階段がある。「調べる」で次の階へ。';
        else if(t==='X')s.log='最奥の祭壇に到着。「調べる」で封印を解きます。';
      }else if(cmd==='heal')heal();
      else if(cmd==='inspect'||cmd==='confirm'){
        const t=tile(s.x,s.y);
        if(t==='C'&&!s.cleared.has(key())){s.cleared.add(key());s.gold+=10;s.potions++;s.log='宝箱：10Gと回復薬1個を手に入れた。';}
        else if(t==='S'&&s.floor<data.floors.length-1){s.floor++;Object.assign(s,data.start);s.log='階段を降りた。'+data.floors[s.floor].name+'に到着。';}
        else if(t==='X'){s.mode='complete';s.log='祭壇の封印が解けた。迷宮踏破！';}
        else{const [dx,dy]=vectors[s.dir];s.log=tile(s.x+dx,s.y+dy)==='#'?'正面は石壁。左右を向いて通路を探してください。':'正面に通路が続いている。';}
      }else s.log='探索中：進め・戻れ・右・左・調べる。';
    }
    return {state:s,tile,command,nextXp,key};
  }
  return {create};
})();
