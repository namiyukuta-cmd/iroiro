(() => {
  const PAGE_VERSION = '202609160820';
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
  const inventoryButton = document.getElementById('inventoryButton');

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
    const actionable = Boolean(card && card.type !== 'none' && !acted);
    drawn.style.pointerEvents = actionable ? 'auto' : 'none';
    drawn.style.cursor = actionable ? 'pointer' : 'default';
    drawn.tabIndex = actionable ? 0 : -1;
    drawn.setAttribute('aria-disabled', actionable ? 'false' : 'true');
  }

  function tapFeedback() {
    drawn.classList.remove('tapFeedback');
    void drawn.offsetWidth;
    drawn.classList.add('tapFeedback');
    setTimeout(() => drawn.classList.remove('tapFeedback'), 170);
  }

  function pulseInventory() {
    if (!inventoryButton) return;
    inventoryButton.classList.remove('receive');
    void inventoryButton.offsetWidth;
    inventoryButton.classList.add('receive');
    setTimeout(() => inventoryButton.classList.remove('receive'), 260);
  }

  function removeDrawnCard() {
    drawn.style.display = 'none';
    drawn.classList.remove('tapFeedback', 'acquired');
    drawn.style.pointerEvents = 'none';
    drawn.tabIndex = -1;
    drawn.setAttribute('aria-disabled', 'true');
    currentCard = null;
    refreshDeck();
  }

  function animateToInventory(card) {
    const source = drawn?.getBoundingClientRect?.();
    const target = inventoryButton?.getBoundingClientRect?.();

    // 入手した瞬間、元の札は探索画面から必ず消す。
    removeDrawnCard();

    if (!source || !target || !source.width || !source.height || !target.width || !target.height) {
      pulseInventory();
      return;
    }

    const fly = document.createElement('div');
    fly.className = 'inventoryFly';
    fly.style.left = `${source.left}px`;
    fly.style.top = `${source.top}px`;
    fly.style.width = `${source.width}px`;
    fly.style.height = `${source.height}px`;

    const icon = document.createElement('div');
    icon.className = 'flyIcon';
    icon.textContent = card?.icon || '▣';

    const title = document.createElement('div');
    title.className = 'flyTitle';
    title.textContent = card?.title || 'アイテム';

    fly.append(icon, title);
    document.body.appendChild(fly);

    const sourceCenterX = source.left + source.width / 2;
    const sourceCenterY = source.top + source.height / 2;
    const targetCenterX = target.left + target.width / 2;
    const targetCenterY = target.top + target.height / 2;
    const dx = targetCenterX - sourceCenterX;
    const dy = targetCenterY - sourceCenterY;

    fly.style.transform = 'translate(0,0) scale(1) rotate(0deg)';
    fly.style.opacity = '1';
    fly.style.transition = 'transform .7s cubic-bezier(.2,.72,.2,1), opacity .7s ease';

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        fly.style.transform = `translate(${dx}px,${dy}px) scale(.12) rotate(9deg)`;
        fly.style.opacity = '.05';
      });
    });

    setTimeout(pulseInventory, 500);
    setTimeout(() => fly.remove(), 760);
  }

  function clearCardView() {
    currentCard = null;
    acted = false;
    drawn.style.display = 'none';
    drawn.classList.remove('tapFeedback', 'acquired');
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

  function pointReturnUrl() {
    return `DD_point.html?zone=${encodeURIComponent(zone)}&place=${encodeURIComponent(place)}&v=${PAGE_VERSION}`;
  }

  function doGather(card) {
    if (acted) return;
    acted = true;
    DDTime?.advance?.(card.minutes || 20, `point:${zone}:gather`);
    const item = DDItems?.get?.(card.itemId);
    const name = item?.name || card.title || 'アイテム';
    DDItems?.add?.(card.itemId, 1);
    animateToInventory(card);
    result.textContent = `${name}を1個、手に入れた。`;
    eventDetail.textContent = 'アイテムに入った。';
  }

  function doHunt(card) {
    if (acted) return;
    acted = true;
    setDrawnInteractivity(currentCard);
    const back = pointReturnUrl();
    const target = `DD_hunt.html?animal=${encodeURIComponent(card.animalId)}&from=point&return=${encodeURIComponent(back)}`;
    setTimeout(() => { location.href = target; }, 150);
  }

  function doFish(card) {
    if (acted) return;
    acted = true;
    setDrawnInteractivity(currentCard);
    const attack = 1;
    const hp = Math.max(1, Number(card.fishHp || 2));
    const minutes = Math.max(1, Number(card.minutes || 10));
    DDTime?.advance?.(minutes, 'point:river:fish');
    if (hp - attack <= 0) {
      DDItems?.add?.('river_fish', 1);
      animateToInventory({ ...card, title: '川魚', icon: card.icon || '🐟' });
      result.textContent = '川魚を1匹、手に入れた。';
      eventDetail.textContent = 'アイテムに入った。';
    } else {
      result.textContent = '素手で追ったが魚は逃げた。';
      eventDetail.textContent = '山札をタップすると次のカード。';
    }
  }

  function doBattle(card) {
    if (acted) return;
    acted = true;
    const back = pointReturnUrl();
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
    tapFeedback();
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