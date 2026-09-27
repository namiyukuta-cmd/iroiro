(() => {
  const $=id=>document.getElementById(id),data=window.DungeonData;
  let game=DungeonEngine.create(data),view=null,sound=true,audio=null;
  // リスタートでも描画側が同じ参照を使えるようにします。
  const viewGame={get state(){return game.state;}};
  try{view=DungeonView.create($('scene'),viewGame,data);}catch(error){$('viewError').hidden=false;$('viewError').textContent='立体表示を開始できません。WebGL対応ブラウザで開き直してください。';console.error(error);}
  function tone(){if(!sound||!audio)return;const o=audio.createOscillator(),g=audio.createGain();o.frequency.value=game.state.mode==='battle'?220:440;g.gain.setValueAtTime(.018,audio.currentTime);g.gain.exponentialRampToValueAtTime(.001,audio.currentTime+.08);o.connect(g);g.connect(audio.destination);o.start();o.stop(audio.currentTime+.08);}
  function unlock(){try{const API=window.AudioContext||window.webkitAudioContext;if(API&&!audio)audio=new API();if(audio?.state==='suspended')audio.resume().catch(()=>{});}catch{}}
  function update(){const s=game.state;$('place').textContent=`地下${s.floor+1}階・${data.floors[s.floor].name}`;$('direction').textContent=['北','東','南','西'][s.dir];$('log').textContent=s.log;$('hp').textContent=`${s.hp} / ${s.maxHp}`;$('level').textContent=s.level;$('xp').textContent=`${s.xp} / ${game.nextXp()}`;$('gold').textContent=s.gold+' G';document.querySelectorAll('.potions').forEach(el=>el.textContent=s.potions);
    $('exploreControls').hidden=s.mode!=='explore';$('battleControls').hidden=s.mode!=='battle';$('endControls').hidden=!['dead','complete'].includes(s.mode);$('enemyStatus').hidden=s.mode!=='battle';$('enemyStatus').textContent=s.enemy?`${s.enemy.name}　HP ${s.enemy.hp}`:'';$('sceneLabel').textContent=s.paused?'一時停止':({explore:'探索中',battle:'戦闘',dead:'冒険終了',complete:'迷宮踏破'})[s.mode];
    const choices=['attack','guard','heal','flee'];document.querySelectorAll('#battleControls [data-command]').forEach(el=>el.classList.toggle('selected',el.dataset.command===choices[s.selection]));view?.render();
  }
  function command(cmd){game.command(cmd);update();tone();}
  const voice=DungeonVoice.create({commands:data.commands,onCommand:command,onStatus:(message,active)=>{$('voiceStatus').textContent=message;$('mic').textContent=active?'音声停止':'音声開始';$('mic').setAttribute('aria-pressed',String(active));},onHeard:text=>$('heard').textContent='認識：'+text});
  if(!voice.supported)$('voiceStatus').textContent='音声認識未対応・ボタン操作可';
  document.querySelectorAll('[data-command]').forEach(el=>el.addEventListener('click',()=>{unlock();command(el.dataset.command);}));
  $('mic').onclick=()=>{voice.toggle();unlock();};$('sound').onclick=()=>{sound=!sound;unlock();$('sound').textContent=sound?'SE ON':'SE OFF';};
  $('restart').onclick=()=>{game=DungeonEngine.create(data);update();};
  document.addEventListener('keydown',e=>{const cmd={ArrowUp:'forward',ArrowDown:'back',ArrowLeft:'left',ArrowRight:'right',Enter:'confirm',' ':'inspect'}[e.key];if(cmd){e.preventDefault();command(cmd);}});
  update();
})();
