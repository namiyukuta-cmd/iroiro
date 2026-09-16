(() => {
  const params = new URLSearchParams(location.search);
  const config = window.DDPointConfig || {};
  const huntConfig = window.DDHuntConfig || {};
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
  const autoButton = document.getElementById('autoButton');
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
  let autoMode = false;
  let autoTimer = 0;

  const AUTO_ENEMIES = {
    wolf: {
      name: '狼',
      deck: [
        { id: 'attack', damage: 1 },
        { id: 'attack', damage: 1 },
        { id: 'strong', damage: 2 },
        { id: 'guard', damage: 0 },
        { id: 'watch', damage: 0 }
      ]
    },
    wild_dog: {
      name: '野犬',
      deck: [
        { id: 'attack', damage: 1 },
        { id: 'attack', damage: 1 },
        { id: 'strong', damage: 2 },
        { id: 'watch', damage: 0 }
      ]
    }
  };

  function clone(card) {
    return { ...card };
  }

  function pickRandom(list) {
    if (!Array.isArray(list) || !list.length) return null;
    return list[Math.floor(Math.random() * list.length)] || null;
  }

  function shuffle(list) {
    const out = (list || []).map(clone);
    for (let i = out.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [out[i], out[j]] = [out[j], out[i]];
    }
    return out;
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

  function showChoices(card) {
    hideChoices();
    if (card.type === 'item') {
      primaryAction.textContent = '入手する';
      discardAction.textContent = '見送る';
    } else if (card.type === 'hunt') {
      primaryAction.textContent = '狩猟する';
      discardAction.textContent = '見送る';
    } else if (card.type === 'fish') {
      primaryAction.textContent = '捕る';
      discardAction.textContent = '見送る';
    } else {
      return;
    }
    cardActions.classList.add('show');
  }

  function updateAutoButton() {
    if (!autoButton) return;
    autoButton.textContent = autoMode ? 'オート：ON' : 'オート：OFF';
    autoButton.classList.toggle('on', autoMode);
    autoButton.setAttribute('aria-pressed', autoMode ? 'true' : 'false');
  }

  function setDrawnInteractivity() {
    const enabled = Boolean(currentCard && !acted && !busy && !autoMode);
    drawn.style.pointerEvents = enabled ? 'auto' : 'none';
    drawn.style.cursor = enabled ? 'pointer' : 'default';
    drawn.tabIndex = enabled ? 0 : -1;
    drawn.setAttribute('aria-disabled', enabled ? 'false' : 'true');
  }

  function setSlotState() {
    const empty = !currentCard;
    cardSlot.classList.toggle('empty', empty);
    cardSlot.classList.toggle('busy', busy || autoMode);
    cardSlot.tabIndex = empty && !busy && !autoMode ? 0 : -1;
    cardSlot.setAttribute('aria-disabled', empty && !busy && !autoMode ? 'false' : 'true');
    slotPrompt.style.display = empty ? 'grid' : 'none';
    if (busy) slotPrompt.textContent = '時間が進んでいる…';
    else if (autoMode) slotPrompt.textContent = 'オート探索中…';
    else slotPrompt.textContent = 'ここをタップして札を出す';
  }

  function resetCardVisual() {
    drawn.style.transition = '';
    drawn.style.transform = '';
    drawn.style.opacity = '';
    drawn.classList.remove('tapFeedback', 'dealIn');
  }

  function clearAutoTimer() {
    if (autoTimer) clearTimeout(autoTimer);
    autoTimer = 0;
  }

  function scheduleAutoNext(delay = 360) {
    clearAutoTimer();
    if (!autoMode) return;
    autoTimer = setTimeout(() => {
      autoTimer = 0;
      if (!autoMode || busy || currentCard) return;
      requestNextCard();
    }, delay);
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
    cardHint.textContent = autoMode
      ? `オートで次の札へ　${drawMinutes()}分`
      : `空白をタップして次の札へ　${drawMinutes()}分`;
    if (message) eventText.textContent = message;
    if (detail !== undefined) eventDetail.textContent = detail;
    if (autoMode) scheduleAutoNext();
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
    if (autoMode) {
      cardHint.textContent = 'オート処理中';
      if (card.type === 'item') eventDetail.textContent = '自動で入手する。';
      else if (card.type === 'hunt') eventDetail.textContent = '装備と矢を確認して自動判定する。';
      else if (card.type === 'fish') eventDetail.textContent = '自動で捕獲を試みる。';
      else if (card.type === 'enemy') eventDetail.textContent = '自動で逃走を試みる。';
      else eventDetail.textContent = '自動で見送る。';
      return;
    }

    if (card.type === 'item') {
      cardHint.textContent = '入手する / 見送る';
      eventDetail.textContent = `入手すると${card.minutes || 20}分進む。`;
      return;
    }
    if (card.type === 'hunt') {
      cardHint.textContent = '狩猟する / 見送る';
      eventDetail.textContent = '狩猟するか見送るか選ぶ。';
      return;
    }
    if (card.type === 'fish') {
      cardHint.textContent = '捕る / 見送る';
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

    if (autoMode) {
      hideChoices();
      setDrawnInteractivity();
      const autoCard = currentCard;
      setTimeout(() => {
        if (autoMode && currentCard === autoCard && !acted && !busy) runAutoAction(autoCard);
      }, 220);
      return;
    }

    if (currentCard.type === 'enemy') {
      acted = true;
      hideChoices();
      setDrawnInteractivity();
      const enemy = currentCard;
      setTimeout(() => doBattle(enemy, true), 180);
      return;
    }

    if (currentCard.type === 'none') {
      hideChoices();
      return;
    }

    showChoices(currentCard);
  }

  function requestNextCard() {
    if (currentCard || busy) return;
    busy = true;
    hideChoices();
    setSlotState();
    cardHint.textContent = '';
    eventText.textContent = autoMode ? 'オートで札を探している…' : '札を探している…';
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
      setEmptySlot(`${name}を1個、手に入れた。`, autoMode ? 'オート探索を続ける。' : '空白をタップして次の札を出す。');
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
        setEmptySlot('川魚を1匹、手に入れた。', autoMode ? 'オート探索を続ける。' : '空白をタップして次の札を出す。');
        result.textContent = '川魚を1匹、手に入れた。';
      } else {
        setEmptySlot('素手で追ったが魚は逃げた。', autoMode ? 'オート探索を続ける。' : '空白をタップして次の札を出す。');
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

  function discardCurrentCard(message = '札を見送った。') {
    if (!currentCard || acted || busy) return;
    acted = true;
    hideChoices();
    setDrawnInteractivity();
    drawn.style.transition = 'transform .18s ease-out, opacity .18s ease-out';
    drawn.style.transform = 'translateY(20px) scale(.9)';
    drawn.style.opacity = '.05';
    eventText.textContent = message;
    eventDetail.textContent = '';
    result.textContent = '';
    setTimeout(() => {
      setEmptySlot(message, autoMode ? 'オート探索を続ける。' : '空白をタップして次の札を出す。');
    }, 190);
  }

  function equipmentPartUsable(part) {
    if (!part || part.broken === true) return false;
    const durability = Number(part.durability);
    return !Number.isFinite(durability) || durability > 0;
  }

  function huntEquipmentState() {
    const equipment = huntConfig.equipment || {};
    return {
      bow: equipment.bow || null,
      bowstring: equipment.bowstring || null,
      bowOk: equipmentPartUsable(equipment.bow),
      bowstringOk: equipmentPartUsable(equipment.bowstring)
    };
  }

  function inventoryArrows() {
    const defaultDamage = Math.max(1, Number(huntConfig.equipment?.arrows?.damage || 1));
    const entries = DDItems?.getInventory?.() || [];
    return entries
      .filter(entry => entry?.item?.kind === 'arrow' && Number(entry.count || 0) > 0)
      .map(entry => ({
        id: entry.item.id,
        name: entry.item.name || '矢',
        count: Number(entry.count || 0),
        damage: Math.max(1, Number(entry.item.damage || defaultDamage))
      }))
      .sort((a, b) => a.damage - b.damage);
  }

  function animalData(animalId) {
    return (huntConfig.animals || []).find(animal => animal.id === animalId) || null;
  }

  function arrowForAnimal(animal) {
    const hp = Math.max(1, Number(animal?.hp || 1));
    return inventoryArrows().find(arrow => arrow.damage >= hp) || null;
  }

  function hasTimeForAutoHunt() {
    if (!window.DDTime?.getState) return true;
    const state = DDTime.getState();
    const now = Number(state.minuteOfDay);
    const huntCost = Math.max(1, Number(DDTime.actionCosts?.hunt || 120));
    return Number.isFinite(now) && now >= 5 * 60 && now + huntCost <= 19 * 60;
  }

  function autoSkipHunt(reason) {
    discardCurrentCard(`狩猟を見送った。${reason}`);
  }

  function doAutoHunt(card) {
    if (acted || busy) return;
    const equipment = huntEquipmentState();
    const animal = animalData(card.animalId);
    const arrow = arrowForAnimal(animal);

    if (!animal) return autoSkipHunt('獲物の情報がない。');
    if (!equipment.bowOk) return autoSkipHunt('弓が使えない。');
    if (!equipment.bowstringOk) return autoSkipHunt('弓弦が使えない。');
    if (!inventoryArrows().length) return autoSkipHunt('矢を持っていない。');
    if (!arrow) return autoSkipHunt('持っている矢の攻撃力では仕留められない。');
    if (!hasTimeForAutoHunt()) return autoSkipHunt('狩りを続ける時間がない。');

    acted = true;
    busy = true;
    hideChoices();
    setDrawnInteractivity();
    const sourceRect = drawn.getBoundingClientRect();
    const minutes = Math.max(1, Number(DDTime?.actionCosts?.hunt || 120));
    const hitZoneWidth = Math.max(4, Math.min(60,
      Number(equipment.bow?.hitZoneBonus || 0) + Number(equipment.bowstring?.hitZoneBonus || 0)
    ));
    const hit = Math.random() * 100 < hitZoneWidth;

    DDItems?.remove?.(arrow.id, 1);

    let message = `${animal.name}を狙ったが外れた。${arrow.name}を1本使った。`;
    if (hit) {
      const meat = DDItems?.get?.(animal.meatItemId);
      if (animal.meatItemId) DDItems?.add?.(animal.meatItemId, 1);
      if (meat) animateCardToInventory({ icon: '🍖', title: meat.name }, sourceRect);
      message = `${animal.name}を仕留めた。${meat?.name || '獲物'}を手に入れた。${arrow.name}を1本使った。`;
    }

    drawn.style.display = 'none';
    currentCard = null;
    setSlotState();
    slotPrompt.textContent = '時間が進んでいる…';
    cardHint.textContent = '';

    animateTimeToClock(sourceRect, minutes, () => {
      DDTime?.advance?.(minutes, `point:${zone}:auto-hunt`);
      busy = false;
      setEmptySlot(message, autoMode ? 'オート探索を続ける。' : '空白をタップして次の札を出す。');
      result.textContent = message;
    });
  }

  function resolveAutoBattle(enemyId) {
    const enemy = AUTO_ENEMIES[enemyId] || AUTO_ENEMIES.wild_dog;
    let playerHp = 5;
    let turns = 0;
    let deck = shuffle(enemy.deck);
    let escaped = false;
    let howlText = '';

    while (turns < 20 && playerHp > 0 && !escaped) {
      turns += 1;

      if (window.DDWolf?.hasCompanion?.()) {
        const behavior = DDWolf.randomBehavior?.();
        if (behavior?.combatEffect === 'enemy_flee') {
          const howl = DDWolf.combatHowl?.() || {};
          escaped = true;
          howlText = howl.text || `${DDWolf.name?.() || '狼'}が遠吠えした。敵がひるんだ。`;
          break;
        }
      }

      if (!deck.length) deck = shuffle(enemy.deck);
      const enemyCard = deck.shift() || { id: 'watch', damage: 0 };
      if (enemyCard.id === 'watch' || enemyCard.id === 'guard') {
        escaped = true;
        break;
      }

      playerHp = Math.max(0, playerHp - Math.max(0, Number(enemyCard.damage || 0)));
    }

    return { enemyName: enemy.name, turns: Math.max(1, turns), playerHp, escaped, howlText };
  }

  function doAutoBattle(card) {
    if (acted || busy) return;
    acted = true;
    busy = true;
    hideChoices();
    setDrawnInteractivity();
    const sourceRect = drawn.getBoundingClientRect();
    const outcome = resolveAutoBattle(card.enemyId);
    const minutes = outcome.turns;
    const message = outcome.escaped
      ? (outcome.howlText || `${outcome.enemyName}の隙をついて逃げた。`)
      : `${outcome.enemyName}から逃げ切れず、戦闘を続けられない。`;

    drawn.style.display = 'none';
    currentCard = null;
    setSlotState();
    slotPrompt.textContent = '戦闘判定中…';
    cardHint.textContent = '';

    animateTimeToClock(sourceRect, minutes, () => {
      DDTime?.advance?.(minutes, `point:${zone}:auto-battle`);
      busy = false;
      if (!outcome.escaped) {
        autoMode = false;
        clearAutoTimer();
        updateAutoButton();
      }
      setEmptySlot(message, outcome.escaped && autoMode ? 'オート探索を続ける。' : 'オートを停止した。');
      result.textContent = message;
    });
  }

  function runAutoAction(card) {
    if (!autoMode || !card || card !== currentCard || acted || busy) return;
    if (card.type === 'item') return doGather(card);
    if (card.type === 'hunt') return doAutoHunt(card);
    if (card.type === 'fish') return doFish(card);
    if (card.type === 'enemy') return doAutoBattle(card);
    return discardCurrentCard('何もないので見送った。');
  }

  function setAutoMode(next) {
    autoMode = Boolean(next);
    clearAutoTimer();
    updateAutoButton();
    setDrawnInteractivity();
    setSlotState();

    if (!autoMode) {
      eventDetail.textContent = 'この地点のオートを終了した。';
      if (!currentCard) {
        cardHint.textContent = `空白をタップして次の札へ　${drawMinutes()}分`;
        return;
      }

      showCardInfo(currentCard);
      if (currentCard.type === 'enemy' && !acted && !busy) {
        acted = true;
        hideChoices();
        setDrawnInteractivity();
        const enemy = currentCard;
        setTimeout(() => doBattle(enemy, true), 180);
      } else if (currentCard.type === 'none') {
        hideChoices();
      } else if (!acted && !busy) {
        showChoices(currentCard);
      }
      return;
    }

    hideChoices();
    eventDetail.textContent = 'この地点にいる間だけ自動で探索する。';
    if (currentCard && !acted && !busy) {
      showCardInfo(currentCard);
      const card = currentCard;
      autoTimer = setTimeout(() => {
        autoTimer = 0;
        if (autoMode && currentCard === card && !acted && !busy) runAutoAction(card);
      }, 120);
      return;
    }

    if (!currentCard && !busy) requestNextCard();
  }

  function runPrimaryAction() {
    if (!currentCard || acted || busy || autoMode) return;
    const card = currentCard;
    if (card.type === 'item') return doGather(card);
    if (card.type === 'hunt') return doHunt(card);
    if (card.type === 'fish') return doFish(card);
  }

  function tapCard() {
    if (!currentCard || acted || busy || autoMode || currentCard.type === 'enemy') return;
    tapFeedback();
    if (currentCard.type === 'none') discardCurrentCard();
  }

  placeName.textContent = config.placeNames?.[place] || config.placeNames?.[zone] || '探索地点';
  placeType.textContent = zoneConfig.label || zone;

  autoButton?.addEventListener('click', () => setAutoMode(!autoMode));

  cardSlot.addEventListener('click', event => {
    if (event.target.closest('#drawn') || event.target.closest('#cardActions')) return;
    if (!autoMode && !currentCard && !busy) requestNextCard();
  });
  cardSlot.addEventListener('keydown', event => {
    if ((event.key === 'Enter' || event.key === ' ') && !autoMode && !currentCard && !busy) {
      event.preventDefault();
      requestNextCard();
    }
  });

  drawn.addEventListener('click', event => {
    event.preventDefault();
    event.stopPropagation();
    tapCard();
  });
  drawn.addEventListener('keydown', event => {
    if ((event.key === 'Enter' || event.key === ' ') && !autoMode && currentCard && !acted && !busy) {
      event.preventDefault();
      tapCard();
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
    if (!autoMode) discardCurrentCard();
  });

  window.addEventListener('ddtimechange', refreshClock);
  window.addEventListener('pagehide', () => {
    autoMode = false;
    clearAutoTimer();
  });
  document.addEventListener('contextmenu', e => e.preventDefault());
  document.addEventListener('selectstart', e => e.preventDefault());

  refreshClock();
  updateAutoButton();
  setEmptySlot('空白をタップして札を出す。', `札を出すと${drawMinutes()}分進む。`);
})();
