(() => {
  const params = new URLSearchParams(location.search);
  const config = window.DDPointConfig || {};
  const zones = config.zones || {};
  const zone = zones[params.get('zone')] ? params.get('zone') : 'forest';
  const place = params.get('place') || zone;
  const zoneConfig = zones[zone] || { label: zone, cards: [], encounters: [] };

  const timeText = document.getElementById('timeText');
  const dayText = document.getElementById('dayText');
  const hourHand = document.getElementById('hourHand');
  const minuteHand = document.getElementById('minuteHand');
  const placeName = document.getElementById('placeName');
  const placeType = document.getElementById('placeType');
  const deckButton = document.getElementById('deck');
  const deckHint = document.getElementById('deckHint');
  const drawn = document.getElementById('drawn');
  const cardIcon = document.getElementById('cardIcon');
  const cardTitle = document.getElementById('cardTitle');
  const cardSub = document.getElementById('cardSub');
  const eventText = document.getElementById('eventText');
  const eventDetail = document.getElementById('eventDetail');
  const actions = document.getElementById('actions');
  const result = document.getElementById('result');

  let currentCard = null;
  let resolved = true;

  function clone(card) {
    return { ...card };
  }

  function pickRandom(list) {
    if (!Array.isArray(list) || !list.length) return null;
    return list[Math.floor(Math.random() * list.length)] || null;
  }

  function battleUnlocked() {
    const eventId = config.battleUnlockEventId || 'return_with_meat_01';
    return Boolean(window.DDEvents?.hasSeen?.(eventId));
  }

  function buildDrawPool() {
    const pool = (zoneConfig.cards || []).map(clone);
    if (!battleUnlocked()) return pool;

    const encounters = zoneConfig.encounters || [];
    const weight = Math.max(0, Math.floor(Number(config.encounterWeight ?? 1)));
    for (let i = 0; i < weight; i++) {
      const encounter = pickRandom(encounters);
      if (encounter) pool.push(clone(encounter));
    }
    return pool;
  }

  function clearCardView() {
    currentCard = null;
    drawn.style.display = 'none';
    actions.innerHTML = '';
    eventText.textContent = 'カードを引く。';
    eventDetail.textContent = '';
    result.textContent = '';
  }

  function refreshClock() {
    const state = window.DDTime?.getState?.() || { day: 1, hour: 7, minute: 0, phase: '朝' };
    timeText.textContent = `${String(state.hour).padStart(2, '0')}:${String(state.minute).padStart(2, '0')}`;
    dayText.textContent = `${state.day}日目　${state.phase}`;
    minuteHand.style.transform = `rotate(${state.minute * 6}deg)`;
    hourHand.style.transform = `rotate(${((state.hour % 12) + state.minute / 60) * 30}deg)`;
  }

  function refreshDeck() {
    deckButton.disabled = !resolved;
    deckHint.textContent = resolved
      ? '山札をタップして1枚引く'
      : '引いた札の行動を選ぶ';
  }

  function makeButton(label, handler, primary = false) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = `action${primary ? ' primary' : ''}`;
    button.textContent = label;
    button.addEventListener('click', handler);
    actions.appendChild(button);
  }

  function drawNextCard() {
    resolved = true;
    clearCardView();
    refreshDeck();
    drawCard();
  }

  function resolveCard(message = '') {
    resolved = true;
    actions.innerHTML = '';
    if (message) result.textContent = message;
    makeButton('次のカード', drawNextCard, true);
    refreshDeck();
  }

  function ignoreCard() {
    resolveCard('見送った。');
  }

  function doGather(card) {
    DDTime?.advance?.(card.minutes || 20, `point:${zone}:gather`);
    const item = DDItems?.get?.(card.itemId);
    const name = item?.name || card.title || 'アイテム';
    DDItems?.add?.(card.itemId, 1);
    resolveCard(`${name}を1個、アイテムに入れた。`);
  }

  function doHunt(card) {
    const back = `DD_point.html?zone=${encodeURIComponent(zone)}&place=${encodeURIComponent(place)}`;
    location.href = `DD_hunt.html?animal=${encodeURIComponent(card.animalId)}&from=point&return=${encodeURIComponent(back)}`;
  }

  function doFish(card) {
    const attack = 1;
    const hp = Math.max(1, Number(card.fishHp || 2));
    const minutes = Math.max(1, Number(card.minutes || 10));
    DDTime?.advance?.(minutes, 'point:river:fish');
    if (hp - attack <= 0) {
      DDItems?.add?.('river_fish', 1);
      resolveCard('川魚を1匹、アイテムに入れた。');
    } else {
      resolveCard('素手で追ったが魚は逃げた。');
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
      eventDetail.textContent = '狩猟画面へ移る。';
      makeButton('狩猟する', () => doHunt(card), true);
      makeButton('見逃す', ignoreCard);
      return;
    }

    if (card.type === 'fish') {
      eventDetail.textContent = `魚 HP ${card.fishHp || 2}　素手：攻撃1　${card.minutes || 10}分`;
      makeButton(`素手で捕る　${card.minutes || 10}分`, () => doFish(card), true);
      makeButton('見送る', ignoreCard);
      return;
    }

    if (card.type === 'enemy') {
      eventDetail.textContent = '狼の子を連れ帰った後から、犬科の敵に狙われるようになった。';
      makeButton('戦う', () => doBattle(card), true);
      return;
    }

    makeButton('次のカード', drawNextCard, true);
  }

  function drawCard() {
    if (!resolved) return;
    const pool = buildDrawPool();
    const card = pickRandom(pool);
    if (!card) return;

    currentCard = clone(card);
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

  placeName.textContent = config.placeNames?.[place] || config.placeNames?.[zone] || '探索地点';
  placeType.textContent = zoneConfig.label || zone;

  deckButton.addEventListener('click', drawCard);
  window.addEventListener('ddtimechange', refreshClock);
  document.addEventListener('contextmenu', e => e.preventDefault());
  document.addEventListener('selectstart', e => e.preventDefault());

  refreshClock();
  clearCardView();
  refreshDeck();
})();