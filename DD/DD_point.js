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
  const result = document.getElementById('result');

  let currentCard = null;
  let acted = false;

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

  function drawMinutes() {
    const value = Number(window.DDTime?.actionCosts?.exploreDraw ?? 6);
    return Number.isFinite(value) && value > 0 ? Math.floor(value) : 6;
  }

  function setDrawnInteractivity(card) {
    const actionable = Boolean(card && card.type !== 'none');
    drawn.style.pointerEvents = actionable ? 'auto' : 'none';
    drawn.style.cursor = actionable ? 'pointer' : 'default';
    drawn.tabIndex = actionable ? 0 : -1;
    drawn.setAttribute('aria-disabled', actionable ? 'false' : 'true');
  }

  function clearCardView() {
    currentCard = null;
    acted = false;
    drawn.style.display = 'none';
    setDrawnInteractivity(null);
    eventText.textContent = 'カードをめくる。';
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
    deckButton.disabled = false;
    const minutes = drawMinutes();
    deckHint.textContent = currentCard
      ? `山札をタップして次のカードをめくる　${minutes}分`
      : `山札をタップして1枚めくる　${minutes}分`;
  }

  function doGather(card) {
    if (acted) return;
    acted = true;
    DDTime?.advance?.(card.minutes || 20, `point:${zone}:gather`);
    const item = DDItems?.get?.(card.itemId);
    const name = item?.name || card.title || 'アイテム';
    DDItems?.add?.(card.itemId, 1);
    result.textContent = `${name}を1個、手に入れた。`;
    eventDetail.textContent = '山札をタップすると次のカード。';
  }

  function doHunt(card) {
    if (acted) return;
    acted = true;
    const back = `DD_point.html?zone=${encodeURIComponent(zone)}&place=${encodeURIComponent(place)}`;
    location.href = `DD_hunt.html?animal=${encodeURIComponent(card.animalId)}&from=point&return=${encodeURIComponent(back)}`;
  }

  function doFish(card) {
    if (acted) return;
    acted = true;
    const attack = 1;
    const hp = Math.max(1, Number(card.fishHp || 2));
    const minutes = Math.max(1, Number(card.minutes || 10));
    DDTime?.advance?.(minutes, 'point:river:fish');
    if (hp - attack <= 0) {
      DDItems?.add?.('river_fish', 1);
      result.textContent = '川魚を1匹、手に入れた。';
    } else {
      result.textContent = '素手で追ったが魚は逃げた。';
    }
    eventDetail.textContent = '山札をタップすると次のカード。';
  }

  function doBattle(card) {
    if (acted) return;
    acted = true;
    const back = `DD_point.html?zone=${encodeURIComponent(zone)}&place=${encodeURIComponent(place)}`;
    location.href = `DD_battle.html?enemy=${encodeURIComponent(card.enemyId)}&return=${encodeURIComponent(back)}`;
  }

  function showCardInfo(card) {
    if (card.type === 'item') {
      eventDetail.textContent = `カードをタップして手に入れる。 ${card.minutes || 20}分`;
      return;
    }
    if (card.type === 'hunt') {
      eventDetail.textContent = 'カードをタップして狩猟する。';
      return;
    }
    if (card.type === 'fish') {
      eventDetail.textContent = `カードをタップして捕る。 ${card.minutes || 10}分`;
      return;
    }
    if (card.type === 'enemy') {
      eventDetail.textContent = '戦闘開始。';
      return;
    }
    eventDetail.textContent = '';
  }

  function actOnCurrentCard() {
    if (!currentCard || acted) return;
    if (currentCard.type === 'item') return doGather(currentCard);
    if (currentCard.type === 'hunt') return doHunt(currentCard);
    if (currentCard.type === 'fish') return doFish(currentCard);
    if (currentCard.type === 'enemy') return doBattle(currentCard);
  }

  function drawCard() {
    clearCardView();

    const pool = buildDrawPool();
    const card = pickRandom(pool);
    if (!card) {
      refreshDeck();
      return;
    }

    DDTime?.advanceAction?.('exploreDraw');

    currentCard = clone(card);
    acted = false;
    drawn.style.display = 'flex';
    setDrawnInteractivity(currentCard);
    cardIcon.textContent = currentCard.icon || '';
    cardTitle.textContent = currentCard.title || '何もない';
    cardSub.textContent = currentCard.type === 'none' ? '空白札' : currentCard.type === 'enemy' ? '遭遇' : '';
    eventText.textContent = currentCard.text || '何も起こらなかった。';
    result.textContent = '';
    showCardInfo(currentCard);
    refreshDeck();

    if (currentCard.type === 'enemy') {
      doBattle(currentCard);
    }
  }

  placeName.textContent = config.placeNames?.[place] || config.placeNames?.[zone] || '探索地点';
  placeType.textContent = zoneConfig.label || zone;

  deckButton.addEventListener('click', event => {
    event.preventDefault();
    drawCard();
  });
  drawn.addEventListener('click', actOnCurrentCard);
  drawn.addEventListener('keydown', event => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      actOnCurrentCard();
    }
  });
  window.addEventListener('ddtimechange', refreshClock);
  document.addEventListener('contextmenu', e => e.preventDefault());
  document.addEventListener('selectstart', e => e.preventDefault());

  refreshClock();
  clearCardView();
  refreshDeck();
})();