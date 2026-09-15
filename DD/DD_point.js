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
  const clockDial = document.getElementById('clockDial');
  const placeName = document.getElementById('placeName');
  const placeType = document.getElementById('placeType');
  const cardSlot = document.getElementById('cardSlot');
  const slotPrompt = document.getElementById('slotPrompt');
  const cardHint = document.getElementById('cardHint');
  const drawn = document.getElementById('drawn');
  const cardIcon = document.getElementById('cardIcon');
  const cardTitle = document.getElementById('cardTitle');
  const cardSub = document.getElementById('cardSub');
  const cardActions = document.getElementById('cardActions');
  const primaryAction = document.getElementById('primaryAction');
  const discardAction = document.getElementById('discardAction');
  const eventText = document.getElementById('eventText');
  const eventDetail = document.getElementById('eventDetail');
  const result = document.getElementById('result');
  const inventoryButton = document.getElementById('inventoryButton');

  let currentCard = null;
  let acted = false;
  let busy = false;

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

  function refreshClock() {
    const state = window.DDTime?.getState?.() || { day: 1, hour: 7, minute: 0, phase: '朝' };
    timeText.textContent = `${String(state.hour).padStart(2, '0')}:${String(state.minute).padStart(2, '0')}`;
    dayText.textContent = `${state.day}日目　${state.phase}`;
    minuteHand.style.transform = `rotate(${state.minute * 6}deg)`;
    hourHand.style.transform = `rotate(${((state.hour % 12) + state.minute / 60) * 30}deg)`;
  }

  function hideChoices() {
    cardActions.classList.remove('show', 'oneChoice');
    primaryAction.disabled = false;
    discardAction.disabled = false;
  }

  function setDrawnInteractivity() {
    const enabled = Boolean(currentCard && !acted && !busy);
    drawn.style.pointerEvents = enabled ? 'auto' : 'none';
    drawn.style.cursor = enabled ? 'pointer' : 'default';
    drawn.tabIndex = enabled ? 0 : -1;
    drawn.setAttribute('aria-disabled', enabled ? 'false' : 'true');
  }

  function setSlotState() {
    const empty = !currentCard;
    cardSlot.classList.toggle('empty', empty);
    cardSlot.classList.toggle('busy', busy);
    cardSlot.tabIndex = empty && !busy ? 0 : -1;
    cardSlot.setAttribute('aria-disabled', empty && !busy ? 'false' : 'true');
    slotPrompt.style.display = empty ? 'grid' : 'none';
    slotPrompt.textContent = busy ? '時間が進んでいる…' : 'ここをタップして札を出す';
  }

  function resetCardVisual() {
    drawn.style.transition = '';
    drawn.style.transform = '';
    drawn.style.opacity = '';
    drawn.classList.remove('tapFeedback', 'dealIn');
  }

  function setEmptySlot(message = '', detail = '') {
    currentCard = null;
    acted = false;
    busy = false;
    drawn.style.display = 'none';
    resetCardVisual();
    hideChoices();
    setDrawnInteractivity();
    setSlotState();
    cardHint.textContent = `空白をタップして次の札へ　${drawMinutes()}分`;
    if (message) eventText.textContent = message;
    if (detail !== undefined) eventDetail.textContent = detail;
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

  function flashClock(minutes) {
    if (!clockDial) return;
    clockDial.classList.remove('timeReceive');
    void clockDial.offsetWidth;
    clockDial.classList.add('timeReceive');
    setTimeout(() => clockDial.classList.remove('timeReceive'), 360);

    const rect = clockDial.getBoundingClientRect();
    const gain = document.createElement('div');
    gain.className = 'timeGain';
    gain.textContent = `+${minutes}分`;
    gain.style.left = `${rect.left + rect.width / 2}px`;
    gain.style.top = `${rect.bottom + 5}px`;
    document.body.appendChild(gain);
    setTimeout(() => gain.remove(), 700);
  }

  function animateTimeToClock(sourceRect, minutes, onArrive) {
    const target = clockDial?.getBoundingClientRect?.();
    if (!sourceRect || !target || !sourceRect.width || !target.width) {
      flashClock(minutes);
      onArrive?.();
      return;
    }

    const sx = sourceRect.left + sourceRect.width / 2;
    const sy = sourceRect.top + sourceRect.height / 2;
    const tx = target.left + target.width / 2;
    const ty = target.top + target.height / 2;
    const symbols = ['✦', '✧', '✨', '✦', '✧', '✦'];

    symbols.forEach((symbol, index) => {
      const sparkle = document.createElement('span');
      sparkle.className = 'timeSparkle';
      sparkle.textContent = symbol;
      sparkle.style.left = `${sx + (index - 2.5) * 7}px`;
      sparkle.style.top = `${sy + ((index % 2) ? 8 : -7)}px`;
      document.body.appendChild(sparkle);

      const dx = tx - sx + (index - 2.5) * -2;
      const dy = ty - sy;
      const delay = index * 28;
      if (typeof sparkle.animate === 'function') {
        const animation = sparkle.animate([
          { transform: 'translate(0,0) scale(.55)', opacity: 0 },
          { transform: 'translate(0,-8px) scale(1.15)', opacity: 1, offset: .18 },
          { transform: `translate(${dx}px,${dy}px) scale(.22)`, opacity: .08 }
        ], {
          duration: 500,
          delay,
          easing: 'cubic-bezier(.22,.72,.2,1)',
          fill: 'forwards'
        });
        animation.onfinish = () => sparkle.remove();
        animation.oncancel = () => sparkle.remove();
      } else {
        sparkle.style.transition = `transform .5s ease ${delay}ms, opacity .5s ease ${delay}ms`;
        requestAnimationFrame(() => {
          sparkle.style.transform = `translate(${dx}px,${dy}px) scale(.22)`;
          sparkle.style.opacity = '.08';
        });
        setTimeout(() => sparkle.remove(), 700);
      }
    });

    setTimeout(() => {
      flashClock(minutes);
      onArrive?.();
    }, 650);
  }

  function animateCardToInventory(card, sourceRect) {
    const target = inventoryButton?.getBoundingClientRect?.();
    if (!sourceRect || !target || !sourceRect.width || !target.width) {
      pulseInventory();
      return;
    }

    const fly = document.createElement('div');
    fly.className = 'inventoryFly';
    fly.style.left = `${sourceRect.left}px`;
    fly.style.top = `${sourceRect.top}px`;
    fly.style.width = `${sourceRect.width}px`;
    fly.style.height = `${sourceRect.height}px`;

    const icon = document.createElement('div');
    icon.className = 'flyIcon';
    icon.textContent = card?.icon || '▣';
    const title = document.createElement('div');
    title.className = 'flyTitle';
    title.textContent = card?.title || 'アイテム';
    fly.append(icon, title);
    document.body.appendChild(fly);

    const sx = sourceRect.left + sourceRect.width / 2;
    const sy = sourceRect.top + sourceRect.height / 2;
    const tx = target.left + target.width / 2;
    const ty = target.top + target.height / 2;
    const dx = tx - sx;
    const dy = ty - sy;

    fly.style.transform = 'translate(0,0) scale(1) rotate(0deg)';
    fly.style.opacity = '1';
    fly.style.transition = 'transform .68s cubic-bezier(.2,.72,.2,1), opacity .68s ease';
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        fly.style.transform = `translate(${dx}px,${dy}px) scale(.12) rotate(9deg)`;
        fly.style.opacity = '.05';
      });
    });
    setTimeout(pulseInventory, 480);
    setTimeout(() => fly.remove(), 730);
  }

  function pointReturnUrl() {
    return `DD_point.html?zone=${encodeURIComponent(zone)}&place=${encodeURIComponent(place)}&v=${Date.now()}`;
  }

  function showCardInfo(card) {
    hideChoices();
    if (card.type === 'item') {
      cardHint.textContent = '札をタップして選ぶ';
      eventDetail.textContent = `入手すると${card.minutes || 20}分進む。`;
      return;
    }
    if (card.type === 'hunt') {
      cardHint.textContent = '札をタップして選ぶ';
      eventDetail.textContent = '狩猟するか見送るか選ぶ。';
      return;
    }
    if (card.type === 'fish') {
      cardHint.textContent = '札をタップして選ぶ';
      eventDetail.textContent = `捕ると${card.minutes || 10}分進む。`;
      return;
    }
    if (card.type === 'enemy') {
      cardHint.textContent = '遭遇';
      eventDetail.textContent = '戦闘開始。';
      return;
    }
    cardHint.textContent = '札をタップして破棄する';
    eventDetail.textContent = '何もない。';
  }

  function configureChoices(card) {
    cardActions.classList.remove('oneChoice');
    if (card.type === 'item') {
      primaryAction.textContent = '入手する';
      discardAction.textContent = '破棄する';
    } else if (card.type === 'hunt') {
      primaryAction.textContent = '狩猟する';
      discardAction.textContent = '見送る';
    } else if (card.type === 'fish') {
      primaryAction.textContent = '捕る';
      discardAction.textContent = '見送る';
    } else if (card.type === 'none') {
      cardActions.classList.add('oneChoice');
      discardAction.textContent = '破棄する';
    } else {
      return;
    }
    cardActions.classList.add('show');
  }

  function revealCard() {
    const pool = buildDrawPool();
    const card = pickRandom(pool);
    busy = false;

    if (!card) {
      setEmptySlot('出る札がない。', '');
      return;
    }

    currentCard = clone(card);
    acted = false;
    resetCardVisual();
    drawn.style.display = 'flex';
    drawn.classList.add('dealIn');
    setDrawnInteractivity();
    setSlotState();

    cardIcon.textContent = currentCard.icon || '';
    cardTitle.textContent = currentCard.title || '何もない';
    cardSub.textContent = currentCard.type === 'none' ? '空白札' : currentCard.type === 'enemy' ? '遭遇' : '';
    eventText.textContent = currentCard.text || '何も起こらなかった。';
    result.textContent = '';
    showCardInfo(currentCard);

    if (currentCard.type === 'enemy') {
      acted = true;
      setDrawnInteractivity();
      const enemy = currentCard;
      setTimeout(() => doBattle(enemy, true), 180);
    }
  }

  function requestNextCard() {
    if (currentCard || busy) return;
    busy = true;
    hideChoices();
    setSlotState();
    cardHint.textContent = '';
    eventText.textContent = '札を探している…';
    eventDetail.textContent = `${drawMinutes()}分経過する。`;
    result.textContent = '';

    const sourceRect = cardSlot.getBoundingClientRect();
    const minutes = drawMinutes();
    animateTimeToClock(sourceRect, minutes, () => {
      DDTime?.advanceAction?.('exploreDraw');
      revealCard();
    });
  }

  function doGather(card) {
    if (acted || busy) return;
    acted = true;
    busy = true;
    hideChoices();
    setDrawnInteractivity();
    const sourceRect = drawn.getBoundingClientRect();
    const minutes = Math.max(1, Number(card.minutes || 20));
    const item = DDItems?.get?.(card.itemId);
    const name = item?.name || card.title || 'アイテム';

    DDItems?.add?.(card.itemId, 1);
    animateCardToInventory(card, sourceRect);
    drawn.style.display = 'none';
    currentCard = null;
    setSlotState();
    slotPrompt.textContent = '時間が進んでいる…';
    cardHint.textContent = '';

    animateTimeToClock(sourceRect, minutes, () => {
      DDTime?.advance?.(minutes, `point:${zone}:gather`);
      busy = false;
      setEmptySlot(`${name}を1個、手に入れた。`, '空白をタップして次の札を出す。');
      result.textContent = `${name}を1個、手に入れた。`;
    });
  }

  function doHunt(card) {
    if (acted || busy) return;
    acted = true;
    hideChoices();
    setDrawnInteractivity();
    const back = pointReturnUrl();
    const target = `DD_hunt.html?animal=${encodeURIComponent(card.animalId)}&from=point&return=${encodeURIComponent(back)}`;
    setTimeout(() => { location.href = target; }, 120);
  }

  function doFish(card) {
    if (acted || busy) return;
    acted = true;
    busy = true;
    hideChoices();
    setDrawnInteractivity();
    const sourceRect = drawn.getBoundingClientRect();
    const minutes = Math.max(1, Number(card.minutes || 10));
    const attack = 1;
    const hp = Math.max(1, Number(card.fishHp || 2));
    const caught = hp - attack <= 0;

    if (caught) {
      DDItems?.add?.('river_fish', 1);
      animateCardToInventory({ ...card, title: '川魚', icon: card.icon || '🐟' }, sourceRect);
    }

    drawn.style.display = 'none';
    currentCard = null;
    setSlotState();
    slotPrompt.textContent = '時間が進んでいる…';
    cardHint.textContent = '';

    animateTimeToClock(sourceRect, minutes, () => {
      DDTime?.advance?.(minutes, 'point:river:fish');
      busy = false;
      if (caught) {
        setEmptySlot('川魚を1匹、手に入れた。', '空白をタップして次の札を出す。');
        result.textContent = '川魚を1匹、手に入れた。';
      } else {
        setEmptySlot('素手で追ったが魚は逃げた。', '空白をタップして次の札を出す。');
        result.textContent = '素手で追ったが魚は逃げた。';
      }
    });
  }

  function doBattle(card, alreadyLocked = false) {
    if (!alreadyLocked) {
      if (acted || busy) return;
      acted = true;
      setDrawnInteractivity();
    }
    hideChoices();
    const back = pointReturnUrl();
    location.href = `DD_battle.html?enemy=${encodeURIComponent(card.enemyId)}&return=${encodeURIComponent(back)}`;
  }

  function discardCurrentCard() {
    if (!currentCard || acted || busy) return;
    acted = true;
    hideChoices();
    setDrawnInteractivity();
    drawn.style.transition = 'transform .18s ease-out, opacity .18s ease-out';
    drawn.style.transform = 'translateY(20px) scale(.9)';
    drawn.style.opacity = '.05';
    eventText.textContent = '札を破棄した。';
    eventDetail.textContent = '';
    result.textContent = '';
    setTimeout(() => {
      setEmptySlot('札を破棄した。', '空白をタップして次の札を出す。');
    }, 190);
  }

  function openChoices() {
    if (!currentCard || acted || busy || currentCard.type === 'enemy') return;
    tapFeedback();
    if (currentCard.type === 'none') {
      discardCurrentCard();
      return;
    }
    configureChoices(currentCard);
    cardHint.textContent = '下のボタンから選ぶ';
  }

  function runPrimaryAction() {
    if (!currentCard || acted || busy) return;
    const card = currentCard;
    if (card.type === 'item') return doGather(card);
    if (card.type === 'hunt') return doHunt(card);
    if (card.type === 'fish') return doFish(card);
  }

  placeName.textContent = config.placeNames?.[place] || config.placeNames?.[zone] || '探索地点';
  placeType.textContent = zoneConfig.label || zone;

  cardSlot.addEventListener('click', event => {
    if (event.target.closest('#drawn') || event.target.closest('#cardActions')) return;
    if (!currentCard && !busy) requestNextCard();
  });
  cardSlot.addEventListener('keydown', event => {
    if ((event.key === 'Enter' || event.key === ' ') && !currentCard && !busy) {
      event.preventDefault();
      requestNextCard();
    }
  });

  drawn.addEventListener('click', event => {
    event.preventDefault();
    event.stopPropagation();
    openChoices();
  });
  drawn.addEventListener('keydown', event => {
    if ((event.key === 'Enter' || event.key === ' ') && currentCard && !acted && !busy) {
      event.preventDefault();
      openChoices();
    }
  });

  primaryAction.addEventListener('click', event => {
    event.preventDefault();
    event.stopPropagation();
    runPrimaryAction();
  });
  discardAction.addEventListener('click', event => {
    event.preventDefault();
    event.stopPropagation();
    discardCurrentCard();
  });

  window.addEventListener('ddtimechange', refreshClock);
  document.addEventListener('contextmenu', e => e.preventDefault());
  document.addEventListener('selectstart', e => e.preventDefault());

  refreshClock();
  setEmptySlot('空白をタップして札を出す。', `札を出すと${drawMinutes()}分進む。`);
})();