(() => {
  const params = new URLSearchParams(location.search);
  const zone = ['forest', 'plain', 'river'].includes(params.get('zone')) ? params.get('zone') : 'forest';
  const place = params.get('place') || zone;

  const placeNames = {
    northForest: '北の森',
    deepForest: '深い森',
    plain: '開けた平原',
    river: '川辺',
    forest: '森'
  };

  const decks = {
    forest: [
      { type: 'item', icon: '👜', title: '木の実', text: '木の実を見つけた。', itemId: 'nuts', minutes: 20 },
      { type: 'item', icon: '👜', title: '木の枝', text: '使えそうな木の枝を見つけた。', itemId: 'branch', minutes: 20 },
      { type: 'item', icon: '👜', title: '蔓', text: '丈夫そうな蔓を見つけた。', itemId: 'vine', minutes: 20 },
      { type: 'item', icon: '👜', title: 'キノコ', text: 'キノコを見つけた。', itemId: 'mushroom', minutes: 20 },
      { type: 'item', icon: '👜', title: '薬草', text: '薬草になりそうな草を見つけた。', itemId: 'herb', minutes: 20 },
      { type: 'none', icon: '', title: '', text: '何も見つからなかった。' },
      { type: 'none', icon: '', title: '', text: '何も見つからなかった。' },
      { type: 'item', icon: '👜', title: '木の枝', text: '使えそうな木の枝を見つけた。', itemId: 'branch', minutes: 20 }
    ],
    plain: [
      { type: 'hunt', icon: '🏹', title: '鹿', text: '鹿を見つけた。', animalId: 'deer' },
      { type: 'hunt', icon: '🏹', title: 'ウサギ', text: 'ウサギを見つけた。', animalId: 'rabbit' },
      { type: 'hunt', icon: '🏹', title: '鳥', text: '鳥を見つけた。', animalId: 'bird' },
      { type: 'item', icon: '👜', title: '薬草', text: '薬草になりそうな草を見つけた。', itemId: 'herb', minutes: 20 },
      { type: 'item', icon: '👜', title: '木の実', text: '食べられそうな木の実を見つけた。', itemId: 'nuts', minutes: 20 },
      { type: 'none', icon: '', title: '', text: '何も見つからなかった。' },
      { type: 'none', icon: '', title: '', text: '何も見つからなかった。' },
      { type: 'none', icon: '', title: '', text: '風が草を揺らしている。何もいない。' }
    ],
    river: [
      { type: 'fish', icon: '🐟', title: '魚', text: '浅瀬に魚を見つけた。', fishHp: 2, minutes: 10 },
      { type: 'fish', icon: '🐟', title: '魚', text: '水面近くに魚がいる。', fishHp: 2, minutes: 10 },
      { type: 'item', icon: '👜', title: '河原の石', text: '使えそうな小石を見つけた。', itemId: 'pebble', minutes: 10 },
      { type: 'item', icon: '👜', title: '河原の石', text: '丸い小石を見つけた。', itemId: 'pebble', minutes: 10 },
      { type: 'item', icon: '👜', title: '流木', text: '乾いた流木を見つけた。', itemId: 'branch', minutes: 15 },
      { type: 'none', icon: '', title: '', text: '水音だけが聞こえる。何も見つからなかった。' },
      { type: 'none', icon: '', title: '', text: '何も見つからなかった。' },
      { type: 'fish', icon: '🐟', title: '魚', text: '石陰に魚がいる。', fishHp: 2, minutes: 10 }
    ]
  };

  const encounterCards = {
    forest: [
      { type: 'enemy', icon: '⚔', title: '狼', text: '狼がこちらに気づいた。', enemyId: 'wolf' },
      { type: 'enemy', icon: '⚔', title: '野犬', text: '野犬が唸りながら近づいてくる。', enemyId: 'wild_dog' }
    ],
    plain: [
      { type: 'enemy', icon: '⚔', title: '野犬', text: '野犬がこちらを狙っている。', enemyId: 'wild_dog' }
    ],
    river: [
      { type: 'enemy', icon: '⚔', title: '野犬', text: '水辺にいた野犬がこちらへ向かってくる。', enemyId: 'wild_dog' }
    ]
  };

  const timeText = document.getElementById('timeText');
  const dayText = document.getElementById('dayText');
  const hourHand = document.getElementById('hourHand');
  const minuteHand = document.getElementById('minuteHand');
  const placeName = document.getElementById('placeName');
  const placeType = document.getElementById('placeType');
  const deckButton = document.getElementById('deck');
  const deckCount = document.getElementById('deckCount');
  const deckHint = document.getElementById('deckHint');
  const drawn = document.getElementById('drawn');
  const cardIcon = document.getElementById('cardIcon');
  const cardTitle = document.getElementById('cardTitle');
  const cardSub = document.getElementById('cardSub');
  const eventText = document.getElementById('eventText');
  const eventDetail = document.getElementById('eventDetail');
  const actions = document.getElementById('actions');
  const result = document.getElementById('result');

  let deck = [];
  let currentCard = null;
  let resolved = true;

  function shuffle(list) {
    const out = list.map(card => ({ ...card }));
    for (let i = out.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [out[i], out[j]] = [out[j], out[i]];
    }
    return out;
  }

  function buildDeck() {
    const list = decks[zone].map(card => ({ ...card }));
    (encounterCards[zone] || []).forEach(card => {
      const weight = Math.max(1, Math.floor(Number(window.DDWolf?.getEncounterRisk?.(card.enemyId, 1) || 1)));
      for (let i = 0; i < weight; i++) list.push({ ...card });
    });
    return list;
  }

  function resetDeck() {
    deck = shuffle(buildDeck());
    currentCard = null;
    resolved = true;
    drawn.style.display = 'none';
    actions.innerHTML = '';
    eventText.textContent = 'カードを引く。';
    eventDetail.textContent = '';
    result.textContent = '';
    refreshDeck();
  }

  function refreshClock() {
    const state = window.DDTime?.getState?.() || { day: 1, hour: 7, minute: 0, phase: '朝' };
    timeText.textContent = `${String(state.hour).padStart(2, '0')}:${String(state.minute).padStart(2, '0')}`;
    dayText.textContent = `${state.day}日目　${state.phase}`;
    const minuteAngle = state.minute * 6;
    const hourAngle = ((state.hour % 12) + state.minute / 60) * 30;
    minuteHand.style.transform = `rotate(${minuteAngle}deg)`;
    hourHand.style.transform = `rotate(${hourAngle}deg)`;
  }

  function refreshDeck() {
    deckCount.textContent = `${deck.length}枚`;
    deckButton.disabled = !resolved;
    if (!deck.length && resolved) {
      deckHint.textContent = '山札をタップして混ぜ直す';
    } else if (!resolved) {
      deckHint.textContent = '引いた札の行動を選ぶ';
    } else {
      deckHint.textContent = '山札をタップして1枚引く';
    }
  }

  function makeButton(label, handler, primary = false) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = `action${primary ? ' primary' : ''}`;
    button.textContent = label;
    button.addEventListener('click', handler);
    actions.appendChild(button);
    return button;
  }

  function resolveCard(message = '') {
    resolved = true;
    actions.innerHTML = '';
    if (message) result.textContent = message;
    makeButton('次のカード', () => {
      result.textContent = '';
      currentCard = null;
      drawn.style.display = 'none';
      eventText.textContent = 'カードを引く。';
      eventDetail.textContent = '';
      actions.innerHTML = '';
      refreshDeck();
    }, true);
    refreshDeck();
  }

  function ignoreCard() {
    resolveCard('見送った。');
  }

  function doGather(card) {
    if (window.DDTime) DDTime.advance(card.minutes || 20, `point:${zone}:gather`);
    const item = window.DDItems?.get?.(card.itemId);
    const name = item?.name || card.title || 'アイテム';
    window.DDItems?.add?.(card.itemId, 1);
    resolveCard(`${name}を1個、アイテムに入れた。`);
  }

  function doHunt(card) {
    location.href = `DD_hunt.html?animal=${encodeURIComponent(card.animalId)}&from=map`;
  }

  function doFish(card) {
    const attack = 1;
    const turns = 1;
    const hp = Math.max(1, Number(card.fishHp || 2));
    const minutes = Math.max(1, Number(card.minutes || 10));
    if (window.DDTime) DDTime.advance(minutes, 'point:river:fish');
    const remaining = Math.max(0, hp - attack * turns);
    if (remaining <= 0) {
      window.DDItems?.add?.('river_fish', 1);
      resolveCard('川魚を1匹、アイテムに入れた。');
    } else {
      resolveCard(`素手で追ったが魚は逃げた。　攻撃 ${attack} / ターン ${turns}`);
    }
  }

  function doBattle(card) {
    const back = `DD_point.html?zone=${encodeURIComponent(zone)}&place=${encodeURIComponent(place)}`;
    location.href = `DD_battle.html?enemy=${encodeURIComponent(card.enemyId)}&return=${encodeURIComponent(back)}`;
  }

  function showActions(card) {
    actions.innerHTML = '';
    eventDetail.textContent = '';

    if (card.type === 'item') {
      eventDetail.textContent = `採集には ${card.minutes || 20}分かかる。`;
      makeButton(`採集する　${card.minutes || 20}分`, () => doGather(card), true);
      makeButton('見送る', ignoreCard);
      return;
    }

    if (card.type === 'hunt') {
      eventDetail.textContent = '狩猟するなら本格狩猟画面へ移る。';
      makeButton('狩猟する', () => doHunt(card), true);
      makeButton('見逃す', ignoreCard);
      return;
    }

    if (card.type === 'fish') {
      eventDetail.textContent = `魚 HP ${card.fishHp || 2}　素手：攻撃1 / 1ターン　${card.minutes || 10}分`;
      makeButton(`素手で捕る　${card.minutes || 10}分`, () => doFish(card), true);
      makeButton('見送る', ignoreCard);
      return;
    }

    if (card.type === 'enemy') {
      const increased = window.DDWolf?.hasCompanion?.() ? ' 狼の気配のせいか、犬科の敵に見つかりやすくなっている。' : '';
      eventDetail.textContent = `戦闘になる。${increased}`;
      makeButton('戦う', () => doBattle(card), true);
      return;
    }

    eventDetail.textContent = '行動はない。';
    makeButton('次へ', () => resolveCard(), true);
  }

  function drawCard() {
    if (!resolved) return;
    if (!deck.length) {
      resetDeck();
      return;
    }

    currentCard = deck.shift();
    resolved = false;
    drawn.style.display = 'flex';
    cardIcon.textContent = currentCard.icon || '';
    cardTitle.textContent = currentCard.title || '何もない';
    cardSub.textContent = currentCard.type === 'none' ? '空白札' : currentCard.type === 'enemy' ? '遭遇' : '';
    eventText.textContent = currentCard.text || '何も起こらなかった。';
    result.textContent = '';
    showActions(currentCard);
    refreshDeck();
  }

  placeName.textContent = placeNames[place] || placeNames[zone] || '探索地点';
  placeType.textContent = zone === 'forest' ? '森' : zone === 'plain' ? '平原' : '川';

  deckButton.addEventListener('click', drawCard);
  if (window.DDTime) window.addEventListener('ddtimechange', refreshClock);

  document.addEventListener('contextmenu', e => e.preventDefault());
  document.addEventListener('selectstart', e => e.preventDefault());

  refreshClock();
  resetDeck();
})();