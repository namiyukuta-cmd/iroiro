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
  const autoSpeedButton = document.getElementById('autoSpeedButton');
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
  const statusName = document.getElementById('statusName');
  const enemyHpFill = document.getElementById('enemyHpFill');
  const statusValue = document.getElementById('statusValue');
  const battleRound = document.getElementById('battleRound');
  const enemyIntent = document.getElementById('enemyIntent');
  const eventText = document.getElementById('eventText');
  const eventDetail = document.getElementById('eventDetail');
  const result = document.getElementById('result');
  const heroTab = document.getElementById('heroTab');
  const wolfTab = document.getElementById('wolfTab');
  const heroMiniHp = document.getElementById('heroMiniHp');
  const wolfMiniHp = document.getElementById('wolfMiniHp');
  const partyPanel = document.getElementById('partyPanel');
  const turnLabel = document.getElementById('turnLabel');
  const allyStatusName = document.getElementById('allyStatusName');
  const allyHpFill = document.getElementById('allyHpFill');
  const allyHpValue = document.getElementById('allyHpValue');
  const actionGrid = document.getElementById('actionGrid');
  const partyNote = document.getElementById('partyNote');
  const inventoryButton = document.getElementById('inventoryButton');

  const AUTO_SPEEDS = {
    slow: { label: 'ゆっくり', next: 1800, action: 900, battle: 850 },
    normal: { label: '普通', next: 800, action: 400, battle: 430 },
    fast: { label: '速い', next: 320, action: 160, battle: 180 }
  };
  const AUTO_SPEED_ORDER = ['slow', 'normal', 'fast'];
  const HERO_MAX_HP = 5;
  const WOLF_MAX_HP = 5;
  const COVER_CHANCE = 0.35;

  const ENEMIES = {
    wolf: {
      id: 'wolf', name: '狼', hp: 4,
      deck: [
        { id: 'attack', name: '噛みつく', icon: '⚔', damage: 1 },
        { id: 'attack', name: '噛みつく', icon: '⚔', damage: 1 },
        { id: 'strong', name: '飛びかかる', icon: '‼', damage: 2 },
        { id: 'guard', name: '身構える', icon: '◼', guard: 1 },
        { id: 'watch', name: '様子を見る', icon: '…', damage: 0 }
      ]
    },
    wild_dog: {
      id: 'wild_dog', name: '野犬', hp: 3,
      deck: [
        { id: 'attack', name: '噛みつく', icon: '⚔', damage: 1 },
        { id: 'attack', name: '噛みつく', icon: '⚔', damage: 1 },
        { id: 'strong', name: '飛びかかる', icon: '‼', damage: 2 },
        { id: 'watch', name: '様子を見る', icon: '…', damage: 0 }
      ]
    }
  };

  let currentCard = null;
  let acted = false;
  let busy = false;
  let autoMode = false;
  let autoTimer = 0;
  let autoSpeed = 'slow';
  let activeParty = 'hero';
  let battle = null;

  function clone(value) { return value ? { ...value } : value; }
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
  function clamp(value, min, max) { return Math.max(min, Math.min(max, value)); }
  function percent(value, max) { return max > 0 ? clamp((value / max) * 100, 0, 100) : 0; }

  function adultWolfPresent() {
    return window.DDWolf?.stage?.() === 'adult';
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
    cardActions.classList.remove('show');
    primaryAction.disabled = false;
    discardAction.disabled = false;
  }

  function showChoices(card) {
    hideChoices();
    if (card.type === 'item') primaryAction.textContent = '入手する';
    else if (card.type === 'hunt') primaryAction.textContent = '狩猟する';
    else if (card.type === 'fish') primaryAction.textContent = '捕る';
    else return;
    discardAction.textContent = '見送る';
    cardActions.classList.add('show');
  }

  function updateAutoButton() {
    autoButton.textContent = autoMode ? 'オート：ON' : 'オート：OFF';
    autoButton.classList.toggle('on', autoMode);
    autoButton.setAttribute('aria-pressed', autoMode ? 'true' : 'false');
  }

  function updateAutoSpeedButton() {
    const setting = AUTO_SPEEDS[autoSpeed] || AUTO_SPEEDS.slow;
    autoSpeedButton.textContent = `速度：${setting.label}`;
  }

  function autoDelay(kind) {
    return Math.max(0, Number((AUTO_SPEEDS[autoSpeed] || AUTO_SPEEDS.slow)[kind] || 0));
  }

  function clearAutoTimer() {
    if (autoTimer) clearTimeout(autoTimer);
    autoTimer = 0;
  }

  function setDrawnInteractivity() {
    const enabled = Boolean(currentCard && !acted && !busy && !autoMode && !battle);
    drawn.style.pointerEvents = enabled ? 'auto' : 'none';
    drawn.style.cursor = enabled ? 'pointer' : 'default';
    drawn.tabIndex = enabled ? 0 : -1;
  }

  function setSlotState() {
    const empty = !currentCard && !battle;
    cardSlot.classList.toggle('empty', empty);
    cardSlot.classList.toggle('busy', busy || autoMode || Boolean(battle));
    cardSlot.tabIndex = empty && !busy && !autoMode ? 0 : -1;
    slotPrompt.style.display = empty ? 'grid' : 'none';
    if (busy) slotPrompt.textContent = '時間が進んでいる…';
    else if (autoMode) slotPrompt.textContent = 'オート探索中…';
    else slotPrompt.textContent = 'ここをタップして札を出す';
  }

  function resetCardVisual() {
    drawn.style.transition = '';
    drawn.style.transform = '';
    drawn.style.opacity = '';
    drawn.classList.remove('dealIn', 'hitFlash');
  }

  function resetEncounterStatus() {
    statusName.textContent = currentCard?.title || '出る札';
    enemyHpFill.style.width = '0%';
    statusValue.textContent = '—';
    battleRound.textContent = '';
    enemyIntent.textContent = currentCard ? (currentCard.type === 'none' ? '何もない。' : '札を確認する。') : '';
  }

  function scheduleAutoNext() {
    clearAutoTimer();
    if (!autoMode || battle) return;
    autoTimer = setTimeout(() => {
      autoTimer = 0;
      if (!autoMode || busy || currentCard || battle) return;
      requestNextCard();
    }, autoDelay('next'));
  }

  function scheduleAutoAction(card) {
    clearAutoTimer();
    if (!autoMode || !card || battle) return;
    autoTimer = setTimeout(() => {
      autoTimer = 0;
      if (autoMode && currentCard === card && !acted && !busy && !battle) runAutoAction(card);
    }, autoDelay('action'));
  }

  function setEmptySlot(message = '', detail = '') {
    battle = null;
    currentCard = null;
    acted = false;
    busy = false;
    drawn.style.display = 'none';
    resetCardVisual();
    hideChoices();
    setDrawnInteractivity();
    setSlotState();
    resetEncounterStatus();
    cardHint.textContent = autoMode ? `オートで次の札へ　${drawMinutes()}分` : `空白をタップして次の札へ　${drawMinutes()}分`;
    if (message) eventText.textContent = message;
    if (detail !== undefined) eventDetail.textContent = detail;
    renderParty();
    if (autoMode) scheduleAutoNext();
  }

  function flashClock(minutes) {
    clockDial.classList.remove('timeReceive');
    void clockDial.offsetWidth;
    clockDial.classList.add('timeReceive');
    setTimeout(() => clockDial.classList.remove('timeReceive'), 340);
    const rect = clockDial.getBoundingClientRect();
    const gain = document.createElement('div');
    gain.className = 'timeGain';
    gain.textContent = `+${minutes}分`;
    gain.style.left = `${rect.left + rect.width / 2}px`;
    gain.style.top = `${rect.bottom + 4}px`;
    document.body.appendChild(gain);
    setTimeout(() => gain.remove(), 700);
  }

  function animateTimeToClock(sourceRect, minutes, onArrive) {
    const target = clockDial.getBoundingClientRect();
    if (!sourceRect?.width || !target?.width) {
      flashClock(minutes);
      onArrive?.();
      return;
    }
    const sx = sourceRect.left + sourceRect.width / 2;
    const sy = sourceRect.top + sourceRect.height / 2;
    const tx = target.left + target.width / 2;
    const ty = target.top + target.height / 2;
    ['✦','✧','✦','✧','✦'].forEach((symbol, index) => {
      const sparkle = document.createElement('span');
      sparkle.className = 'timeSparkle';
      sparkle.textContent = symbol;
      sparkle.style.left = `${sx + (index - 2) * 7}px`;
      sparkle.style.top = `${sy + (index % 2 ? 6 : -6)}px`;
      document.body.appendChild(sparkle);
      const dx = tx - sx;
      const dy = ty - sy;
      const animation = sparkle.animate([
        { transform: 'translate(0,0) scale(.7)', opacity: 0 },
        { transform: 'translate(0,-7px) scale(1.1)', opacity: 1, offset: .2 },
        { transform: `translate(${dx}px,${dy}px) scale(.2)`, opacity: .05 }
      ], { duration: 480, delay: index * 25, easing: 'ease-out', fill: 'forwards' });
      animation.onfinish = () => sparkle.remove();
    });
    setTimeout(() => { flashClock(minutes); onArrive?.(); }, 610);
  }

  function animateCardToInventory(card, sourceRect) {
    const target = inventoryButton.getBoundingClientRect();
    if (!sourceRect?.width || !target?.width) return;
    const fly = document.createElement('div');
    fly.className = 'inventoryFly';
    fly.style.left = `${sourceRect.left}px`;
    fly.style.top = `${sourceRect.top}px`;
    fly.style.width = `${sourceRect.width}px`;
    fly.style.height = `${sourceRect.height}px`;
    fly.innerHTML = `<div class="flyIcon">${card?.icon || '▣'}</div><div class="flyTitle"></div>`;
    fly.querySelector('.flyTitle').textContent = card?.title || 'アイテム';
    document.body.appendChild(fly);
    const sx = sourceRect.left + sourceRect.width / 2;
    const sy = sourceRect.top + sourceRect.height / 2;
    const tx = target.left + target.width / 2;
    const ty = target.top + target.height / 2;
    requestAnimationFrame(() => {
      fly.style.transition = 'transform .62s ease,opacity .62s ease';
      fly.style.transform = `translate(${tx - sx}px,${ty - sy}px) scale(.12)`;
      fly.style.opacity = '.05';
    });
    setTimeout(() => fly.remove(), 680);
  }

  function damagePop(targetEl, text) {
    const rect = targetEl.getBoundingClientRect();
    const pop = document.createElement('div');
    pop.className = 'damagePop';
    pop.textContent = text;
    pop.style.left = `${rect.left + rect.width / 2}px`;
    pop.style.top = `${rect.top + 10}px`;
    document.body.appendChild(pop);
    setTimeout(() => pop.remove(), 650);
  }

  function flyAction(sourceEl, targetEl, symbol = '✦', onArrive) {
    const source = sourceEl.getBoundingClientRect();
    const target = targetEl.getBoundingClientRect();
    const fx = document.createElement('div');
    fx.className = 'attackFx';
    fx.textContent = symbol;
    const sx = source.left + source.width / 2;
    const sy = source.top + source.height / 2;
    const tx = target.left + target.width / 2;
    const ty = target.top + target.height / 2;
    fx.style.left = `${sx}px`;
    fx.style.top = `${sy}px`;
    document.body.appendChild(fx);
    const animation = fx.animate([
      { transform: 'translate(-50%,-50%) scale(.8)', opacity: 1 },
      { transform: `translate(calc(-50% + ${tx - sx}px),calc(-50% + ${ty - sy}px)) scale(1.15)`, opacity: 1 }
    ], { duration: autoMode ? Math.max(160, autoDelay('battle')) : 360, easing: 'ease-in', fill: 'forwards' });
    animation.onfinish = () => {
      fx.remove();
      targetEl.classList.remove('hitFlash');
      void targetEl.offsetWidth;
      targetEl.classList.add('hitFlash');
      setTimeout(() => targetEl.classList.remove('hitFlash'), 300);
      onArrive?.();
    };
  }

  function equipmentPartUsable(part) {
    if (!part || part.broken === true) return false;
    const durability = Number(part.durability);
    return !Number.isFinite(durability) || durability > 0;
  }

  function inventoryArrows() {
    const defaultDamage = Math.max(1, Number(huntConfig.equipment?.arrows?.damage || 1));
    return (DDItems?.getInventory?.() || [])
      .filter(entry => entry?.item?.kind === 'arrow' && Number(entry.count || 0) > 0)
      .map(entry => ({ id: entry.item.id, name: entry.item.name || '矢', count: Number(entry.count || 0), damage: Math.max(1, Number(entry.item.damage || defaultDamage)) }))
      .sort((a,b) => a.damage - b.damage);
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
    const cost = Math.max(1, Number(DDTime.actionCosts?.hunt || 120));
    return Number.isFinite(now) && now >= 5 * 60 && now + cost <= 19 * 60;
  }

  function showCardInfo(card) {
    resetEncounterStatus();
    if (autoMode) {
      cardHint.textContent = `オート処理中・${AUTO_SPEEDS[autoSpeed].label}`;
      if (card.type === 'item') eventDetail.textContent = '自動で入手する。';
      else if (card.type === 'hunt') eventDetail.textContent = '装備と矢を確認して自動判定する。';
      else if (card.type === 'fish') eventDetail.textContent = '自動で捕獲を試みる。';
      else if (card.type === 'enemy') eventDetail.textContent = 'この画面のまま戦闘する。';
      else eventDetail.textContent = '自動で見送る。';
      return;
    }
    if (card.type === 'item') { cardHint.textContent = '入手する / 見送る'; eventDetail.textContent = `入手すると${card.minutes || 20}分進む。`; return; }
    if (card.type === 'hunt') { cardHint.textContent = '狩猟する / 見送る'; eventDetail.textContent = '狩猟するか見送るか選ぶ。'; return; }
    if (card.type === 'fish') { cardHint.textContent = '捕る / 見送る'; eventDetail.textContent = `捕ると${card.minutes || 10}分進む。`; return; }
    if (card.type === 'enemy') { cardHint.textContent = '戦闘'; eventDetail.textContent = 'この画面のまま戦闘する。'; return; }
    cardHint.textContent = '札をタップして破棄する';
    eventDetail.textContent = '何もない。';
  }

  function revealCard() {
    const card = pickRandom(buildDrawPool());
    busy = false;
    if (!card) { setEmptySlot('出る札がない。', ''); return; }

    currentCard = clone(card);
    acted = false;
    resetCardVisual();
    drawn.style.display = 'flex';
    drawn.classList.add('dealIn');
    cardIcon.textContent = currentCard.icon || '';
    cardTitle.textContent = currentCard.title || '何もない';
    cardSub.textContent = currentCard.type === 'none' ? '空白札' : currentCard.type === 'enemy' ? '遭遇' : '';
    eventText.textContent = currentCard.text || '何も起こらなかった。';
    result.textContent = '';
    showCardInfo(currentCard);
    setDrawnInteractivity();
    setSlotState();

    if (currentCard.type === 'enemy') {
      hideChoices();
      startBattle(currentCard);
      return;
    }

    renderParty();
    if (autoMode) {
      hideChoices();
      scheduleAutoAction(currentCard);
      return;
    }
    if (currentCard.type === 'none') { hideChoices(); return; }
    showChoices(currentCard);
  }

  function requestNextCard() {
    if (currentCard || busy || battle) return;
    busy = true;
    hideChoices();
    setSlotState();
    cardHint.textContent = '';
    eventText.textContent = autoMode ? 'オートで札を探している…' : '札を探している…';
    eventDetail.textContent = `${drawMinutes()}分経過する。`;
    result.textContent = '';
    const sourceRect = cardSlot.getBoundingClientRect();
    animateTimeToClock(sourceRect, drawMinutes(), () => {
      DDTime?.advanceAction?.('exploreDraw');
      revealCard();
    });
  }

  function doGather(card) {
    if (acted || busy || battle) return;
    acted = true;
    busy = true;
    hideChoices();
    const sourceRect = drawn.getBoundingClientRect();
    const minutes = Math.max(1, Number(card.minutes || 20));
    const item = DDItems?.get?.(card.itemId);
    const name = item?.name || card.title || 'アイテム';
    DDItems?.add?.(card.itemId, 1);
    animateCardToInventory(card, sourceRect);
    drawn.style.display = 'none';
    currentCard = null;
    setSlotState();
    animateTimeToClock(sourceRect, minutes, () => {
      DDTime?.advance?.(minutes, `point:${zone}:gather`);
      busy = false;
      setEmptySlot(`${name}を1個、手に入れた。`, autoMode ? 'オート探索を続ける。' : '空白をタップして次の札を出す。');
      result.textContent = `${name}を1個、手に入れた。`;
    });
  }

  function doHunt(card) {
    if (acted || busy || battle) return;
    acted = true;
    hideChoices();
    const back = `DD_point.html?zone=${encodeURIComponent(zone)}&place=${encodeURIComponent(place)}&v=${Date.now()}`;
    location.href = `DD_hunt.html?animal=${encodeURIComponent(card.animalId)}&from=point&return=${encodeURIComponent(back)}`;
  }

  function doFish(card) {
    if (acted || busy || battle) return;
    acted = true;
    busy = true;
    hideChoices();
    const sourceRect = drawn.getBoundingClientRect();
    const minutes = Math.max(1, Number(card.minutes || 10));
    const caught = Math.max(1, Number(card.fishHp || 2)) - 1 <= 0;
    if (caught) {
      DDItems?.add?.('river_fish', 1);
      animateCardToInventory({ ...card, title: '川魚' }, sourceRect);
    }
    drawn.style.display = 'none';
    currentCard = null;
    setSlotState();
    animateTimeToClock(sourceRect, minutes, () => {
      DDTime?.advance?.(minutes, 'point:river:fish');
      busy = false;
      const message = caught ? '川魚を1匹、手に入れた。' : '素手で追ったが魚は逃げた。';
      setEmptySlot(message, autoMode ? 'オート探索を続ける。' : '空白をタップして次の札を出す。');
      result.textContent = message;
    });
  }

  function discardCurrentCard(message = '札を見送った。') {
    if (!currentCard || acted || busy || battle) return;
    acted = true;
    hideChoices();
    drawn.style.transition = 'transform .18s ease-out,opacity .18s ease-out';
    drawn.style.transform = 'translateY(16px) scale(.92)';
    drawn.style.opacity = '.05';
    eventText.textContent = message;
    eventDetail.textContent = '';
    setTimeout(() => setEmptySlot(message, autoMode ? 'オート探索を続ける。' : '空白をタップして次の札を出す。'), 190);
  }

  function doAutoHunt(card) {
    if (acted || busy || battle) return;
    const equipment = huntConfig.equipment || {};
    const animal = animalData(card.animalId);
    const arrows = inventoryArrows();
    const arrow = arrowForAnimal(animal);
    if (!animal) return discardCurrentCard('狩猟を見送った。獲物の情報がない。');
    if (!equipmentPartUsable(equipment.bow)) return discardCurrentCard('狩猟を見送った。弓が使えない。');
    if (!equipmentPartUsable(equipment.bowstring)) return discardCurrentCard('狩猟を見送った。弓弦が使えない。');
    if (!arrows.length) return discardCurrentCard('狩猟を見送った。矢を持っていない。');
    if (!arrow) return discardCurrentCard('狩猟を見送った。持っている矢の攻撃力では仕留められない。');
    if (!hasTimeForAutoHunt()) return discardCurrentCard('狩猟を見送った。狩りを続ける時間がない。');

    acted = true;
    busy = true;
    const sourceRect = drawn.getBoundingClientRect();
    const minutes = Math.max(1, Number(DDTime?.actionCosts?.hunt || 120));
    const hitZoneWidth = clamp(Number(equipment.bow?.hitZoneBonus || 0) + Number(equipment.bowstring?.hitZoneBonus || 0), 4, 60);
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
    animateTimeToClock(sourceRect, minutes, () => {
      DDTime?.advance?.(minutes, `point:${zone}:auto-hunt`);
      busy = false;
      setEmptySlot(message, autoMode ? 'オート探索を続ける。' : '空白をタップして次の札を出す。');
      result.textContent = message;
    });
  }

  function runAutoAction(card) {
    if (!autoMode || !card || card !== currentCard || acted || busy || battle) return;
    if (card.type === 'item') return doGather(card);
    if (card.type === 'hunt') return doAutoHunt(card);
    if (card.type === 'fish') return doFish(card);
    return discardCurrentCard('何もないので見送った。');
  }

  function makeAction(id, icon, label, sub = '', disabled = false) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'actionTile';
    button.dataset.action = id;
    button.disabled = disabled;
    const iconEl = document.createElement('span');
    iconEl.className = 'actionIcon';
    iconEl.textContent = icon;
    const labelEl = document.createElement('span');
    labelEl.textContent = label;
    button.append(iconEl, labelEl);
    if (sub) {
      const subEl = document.createElement('span');
      subEl.className = 'actionCount';
      subEl.textContent = sub;
      button.appendChild(subEl);
    }
    return button;
  }

  function renderExplorationInventory() {
    actionGrid.innerHTML = '';
    const entries = (DDItems?.getInventory?.() || []).filter(entry => entry?.item?.kind !== 'companion');
    if (!entries.length) {
      actionGrid.appendChild(makeAction('empty', '□', '所持品なし', '', true));
      partyNote.textContent = '探索中。ここに所持品が並ぶ。';
      return;
    }
    entries.slice(0, 12).forEach(entry => {
      const icon = entry.item.kind === 'arrow' ? '➶' : entry.item.category === 'food' ? '◌' : entry.item.id === 'pebble' ? '●' : '▣';
      const tile = makeAction(`view:${entry.item.id}`, icon, entry.item.name, `×${entry.count}`, true);
      actionGrid.appendChild(tile);
    });
    partyNote.textContent = entries.length > 12 ? '所持品の一部を表示中。全アイテムから確認できる。' : '探索中の所持品。';
  }

  function renderWolfPreview() {
    actionGrid.innerHTML = '';
    [['bite','牙','牙'],['claw','爪','爪'],['growl','唸る','唸'],['guard','防御','◼']].forEach(([id,label,icon]) => {
      actionGrid.appendChild(makeAction(id, icon, label, '', true));
    });
    partyNote.textContent = '成長した狼（？）が同行している。戦闘では狼（？）→主人公→敵の順。';
  }

  function renderParty() {
    const hasWolf = adultWolfPresent();
    wolfTab.style.display = hasWolf ? 'block' : 'none';
    if (!hasWolf && activeParty === 'wolf') activeParty = 'hero';

    if (battle) {
      if (battle.phase === 'wolf' && battle.wolfHp > 0) activeParty = 'wolf';
      else if (battle.phase === 'hero') activeParty = 'hero';
    }

    heroTab.classList.toggle('active', activeParty === 'hero');
    wolfTab.classList.toggle('active', activeParty === 'wolf');
    partyPanel.classList.toggle('wolfMode', activeParty === 'wolf');

    if (battle) {
      heroMiniHp.textContent = `HP ${battle.heroHp}/${HERO_MAX_HP}`;
      wolfMiniHp.textContent = hasWolf ? `HP ${battle.wolfHp}/${WOLF_MAX_HP}` : '';
      const isWolf = activeParty === 'wolf';
      const hp = isWolf ? battle.wolfHp : battle.heroHp;
      const max = isWolf ? WOLF_MAX_HP : HERO_MAX_HP;
      allyStatusName.textContent = isWolf ? '狼（？）' : '主人公';
      allyHpFill.style.width = `${percent(hp, max)}%`;
      allyHpValue.textContent = `${hp}/${max}`;
      turnLabel.textContent = battle.phase === 'enemy' ? '敵の行動' : `${isWolf ? '狼（？）' : '主人公'}の行動`;
      renderBattleActions();
      return;
    }

    heroMiniHp.textContent = '';
    wolfMiniHp.textContent = '';
    allyStatusName.textContent = activeParty === 'wolf' ? '狼（？）' : '主人公';
    allyHpFill.style.width = '100%';
    allyHpValue.textContent = '—';
    turnLabel.textContent = activeParty === 'wolf' ? '狼（？）' : '主人公';
    if (activeParty === 'wolf') renderWolfPreview();
    else renderExplorationInventory();
  }

  function renderBattleActions() {
    actionGrid.innerHTML = '';
    if (!battle || battle.ended) return;
    const manual = !autoMode;

    if (battle.phase === 'wolf') {
      partyNote.textContent = autoMode ? 'オート：狼（？）は攻撃を選ぶ。' : '狼（？）の行動を選ぶ。';
      const defs = [
        ['wolf:bite','🦷','牙','攻撃2'],
        ['wolf:claw','爪','爪','攻撃1'],
        ['wolf:growl','唸','唸る','敵攻撃-1'],
        ['wolf:guard','◼','防御','庇う時-1']
      ];
      defs.forEach(def => {
        const tile = makeAction(def[0], def[1], def[2], def[3], !manual || battle.wolfHp <= 0);
        if (manual) tile.addEventListener('click', () => performWolfAction(def[0].split(':')[1], tile));
        actionGrid.appendChild(tile);
      });
      return;
    }

    if (battle.phase === 'hero') {
      partyNote.textContent = autoMode ? (battle.hasWolf ? 'オート：主人公は身を守る。' : 'オート：主人公は逃げる。') : '主人公の行動を選ぶ。所持品もここから使える。';
      const base = [
        ['hero:flee','↩','逃げる','敵の隙を狙う'],
        ['hero:guard','◼','身を守る','被害-1'],
        ['hero:strike','✊','素手','攻撃1']
      ];
      base.forEach(def => {
        const tile = makeAction(def[0], def[1], def[2], def[3], !manual);
        if (manual) tile.addEventListener('click', () => performHeroAction(def[0].split(':')[1], tile));
        actionGrid.appendChild(tile);
      });
      (DDItems?.getInventory?.() || []).filter(entry => entry?.item?.kind !== 'companion').slice(0, 9).forEach(entry => {
        const usable = entry.item.id === 'pebble';
        const icon = entry.item.id === 'pebble' ? '●' : entry.item.kind === 'arrow' ? '➶' : entry.item.category === 'food' ? '◌' : '▣';
        const tile = makeAction(`item:${entry.item.id}`, icon, entry.item.name, `×${entry.count}`, !manual || !usable);
        if (manual && usable) tile.addEventListener('click', () => performHeroItem(entry.item.id, tile));
        actionGrid.appendChild(tile);
      });
      return;
    }

    partyNote.textContent = '敵の行動中。';
    actionGrid.appendChild(makeAction('wait','…','敵の行動','',true));
  }

  function updateBattleStatus(intent = '') {
    if (!battle) return;
    statusName.textContent = battle.enemy.name;
    enemyHpFill.style.width = `${percent(battle.enemyHp, battle.enemy.hp)}%`;
    statusValue.textContent = `HP ${battle.enemyHp}/${battle.enemy.hp}`;
    battleRound.textContent = `${battle.round}ターン目`;
    enemyIntent.textContent = intent || (battle.phase === 'enemy' ? '敵が動く。' : 'こちらの行動。');
    renderParty();
  }

  function refillEnemyDeck() {
    if (!battle) return;
    battle.enemyDeck = shuffle(battle.enemy.deck);
  }

  function drawEnemyAction() {
    if (!battle.enemyDeck.length) refillEnemyDeck();
    return battle.enemyDeck.shift() || { id:'watch', name:'様子を見る', damage:0, icon:'…' };
  }

  function startBattle(card) {
    const enemy = ENEMIES[card.enemyId] || ENEMIES.wild_dog;
    const hasWolf = adultWolfPresent();
    battle = {
      enemy,
      enemyHp: enemy.hp,
      enemyGuard: 0,
      enemyWeaken: 0,
      enemyDeck: [],
      heroHp: HERO_MAX_HP,
      heroGuard: 0,
      fleeAttempt: false,
      hasWolf,
      wolfHp: hasWolf ? WOLF_MAX_HP : 0,
      wolfGuard: 0,
      round: 1,
      phase: hasWolf ? 'wolf' : 'hero',
      ended: false
    };
    refillEnemyDeck();
    acted = true;
    busy = false;
    hideChoices();
    cardSub.textContent = '戦闘';
    eventText.textContent = `${enemy.name}と遭遇した。`;
    eventDetail.textContent = hasWolf ? '狼（？）→主人公→敵の順。' : '主人公→敵の順。';
    result.textContent = '';
    cardHint.textContent = autoMode ? `オート戦闘・${AUTO_SPEEDS[autoSpeed].label}` : '下の味方タブから行動する';
    setDrawnInteractivity();
    setSlotState();
    updateBattleStatus();
    if (autoMode) scheduleBattlePhase();
  }

  function scheduleBattlePhase() {
    clearAutoTimer();
    if (!autoMode || !battle || battle.ended || busy) return;
    autoTimer = setTimeout(() => {
      autoTimer = 0;
      if (!autoMode || !battle || battle.ended || busy) return;
      if (battle.phase === 'wolf') {
        const action = Math.random() < .5 ? 'bite' : 'claw';
        performWolfAction(action, wolfTab);
      } else if (battle.phase === 'hero') {
        performHeroAction(battle.hasWolf ? 'guard' : 'flee', heroTab);
      } else if (battle.phase === 'enemy') {
        performEnemyAction();
      }
    }, autoDelay('battle'));
  }

  function consumeEnemyGuard(damage) {
    const reduced = Math.max(0, damage - battle.enemyGuard);
    battle.enemyGuard = 0;
    return reduced;
  }

  function performWolfAction(action, sourceEl) {
    if (!battle || battle.ended || battle.phase !== 'wolf' || busy || battle.wolfHp <= 0) return;
    busy = true;
    let damage = 0;
    let symbol = '🦷';
    let message = '';
    if (action === 'bite') { damage = 2; symbol = '🦷'; message = '狼（？）が牙を立てる。'; }
    else if (action === 'claw') { damage = 1; symbol = '爪'; message = '狼（？）が爪を振るう。'; }
    else if (action === 'growl') { battle.enemyWeaken = 1; message = '狼（？）が低く唸る。敵の次の攻撃が弱まる。'; }
    else if (action === 'guard') { battle.wolfGuard = 1; message = '狼（？）が身構える。'; }

    eventText.textContent = message;
    if (damage > 0) {
      flyAction(sourceEl, drawn, symbol, () => {
        const dealt = consumeEnemyGuard(damage);
        battle.enemyHp = Math.max(0, battle.enemyHp - dealt);
        damagePop(drawn, `-${dealt}`);
        afterWolfAction();
      });
    } else {
      setTimeout(afterWolfAction, autoMode ? autoDelay('battle') : 280);
    }
  }

  function afterWolfAction() {
    busy = false;
    if (!battle) return;
    if (battle.enemyHp <= 0) { finishBattle(`${battle.enemy.name}を倒した。`); return; }
    battle.phase = 'hero';
    updateBattleStatus();
    if (autoMode) scheduleBattlePhase();
  }

  function performHeroItem(itemId, sourceEl) {
    if (itemId !== 'pebble' || Number(DDItems?.count?.('pebble') || 0) <= 0) return;
    performHeroAttack(2, sourceEl, '●', '小石を投げた。');
    DDItems.remove('pebble', 1);
  }

  function performHeroAttack(damage, sourceEl, symbol, message) {
    if (!battle || battle.ended || battle.phase !== 'hero' || busy) return;
    busy = true;
    eventText.textContent = message;
    flyAction(sourceEl, drawn, symbol, () => {
      const dealt = consumeEnemyGuard(damage);
      battle.enemyHp = Math.max(0, battle.enemyHp - dealt);
      damagePop(drawn, `-${dealt}`);
      finishHeroPhase();
    });
  }

  function performHeroAction(action, sourceEl) {
    if (!battle || battle.ended || battle.phase !== 'hero' || busy) return;
    if (action === 'strike') { performHeroAttack(1, sourceEl, '✊', '主人公が素手で攻撃する。'); return; }
    busy = true;
    if (action === 'guard') {
      battle.heroGuard = 1;
      eventText.textContent = '主人公は身を守る。';
    } else if (action === 'flee') {
      battle.fleeAttempt = true;
      eventText.textContent = '主人公は逃げる隙をうかがう。';
    }
    setTimeout(finishHeroPhase, autoMode ? autoDelay('battle') : 260);
  }

  function finishHeroPhase() {
    busy = false;
    if (!battle) return;
    if (battle.enemyHp <= 0) { finishBattle(`${battle.enemy.name}を倒した。`); return; }
    battle.phase = 'enemy';
    updateBattleStatus('敵の行動。');
    if (autoMode) scheduleBattlePhase();
    else setTimeout(performEnemyAction, 350);
  }

  function performEnemyAction() {
    if (!battle || battle.ended || battle.phase !== 'enemy' || busy) return;
    busy = true;
    const enemyAction = drawEnemyAction();
    enemyIntent.textContent = `${enemyAction.icon || ''} ${enemyAction.name}`;

    if (battle.fleeAttempt && (enemyAction.id === 'watch' || enemyAction.id === 'guard')) {
      DDTime?.advance?.(1, `point:${zone}:battle-turn`);
      battle.fleeAttempt = false;
      setTimeout(() => finishBattle(`${battle.enemy.name}の隙をついて逃げた。`), autoMode ? autoDelay('battle') : 300);
      return;
    }

    if (enemyAction.id === 'guard') {
      battle.enemyGuard = Math.max(battle.enemyGuard, Number(enemyAction.guard || 1));
      eventText.textContent = `${battle.enemy.name}は身構えた。`;
      DDTime?.advance?.(1, `point:${zone}:battle-turn`);
      setTimeout(afterEnemyAction, autoMode ? autoDelay('battle') : 300);
      return;
    }

    if (enemyAction.id === 'watch') {
      eventText.textContent = `${battle.enemy.name}はこちらを窺っている。`;
      DDTime?.advance?.(1, `point:${zone}:battle-turn`);
      setTimeout(afterEnemyAction, autoMode ? autoDelay('battle') : 300);
      return;
    }

    let damage = Math.max(0, Number(enemyAction.damage || 0) - battle.enemyWeaken);
    battle.enemyWeaken = 0;
    let target = 'hero';
    let covered = false;
    if (battle.hasWolf && battle.wolfHp > 0 && Math.random() < COVER_CHANCE) {
      target = 'wolf';
      covered = true;
    }
    const targetEl = target === 'wolf' ? wolfTab : heroTab;
    eventText.textContent = covered ? `狼（？）が主人公を庇った。` : `${battle.enemy.name}が主人公を攻撃する。`;

    flyAction(drawn, targetEl, enemyAction.icon || '⚔', () => {
      if (target === 'wolf') {
        damage = Math.max(0, damage - battle.wolfGuard);
        battle.wolfGuard = 0;
        battle.wolfHp = Math.max(0, battle.wolfHp - damage);
      } else {
        damage = Math.max(0, damage - battle.heroGuard);
        battle.heroGuard = 0;
        battle.heroHp = Math.max(0, battle.heroHp - damage);
      }
      damagePop(targetEl, `-${damage}`);
      DDTime?.advance?.(1, `point:${zone}:battle-turn`);
      afterEnemyAction();
    });
  }

  function afterEnemyAction() {
    busy = false;
    if (!battle) return;
    battle.fleeAttempt = false;
    if (battle.heroHp <= 0) {
      autoMode = false;
      updateAutoButton();
      finishBattle('戦闘を続けられない。');
      return;
    }
    battle.round += 1;
    battle.phase = battle.hasWolf && battle.wolfHp > 0 ? 'wolf' : 'hero';
    updateBattleStatus();
    if (autoMode) scheduleBattlePhase();
  }

  function finishBattle(message) {
    if (!battle || battle.ended) return;
    battle.ended = true;
    busy = true;
    clearAutoTimer();
    eventText.textContent = message;
    eventDetail.textContent = autoMode ? 'オート探索を続ける。' : '戦闘終了。';
    result.textContent = message;
    updateBattleStatus('戦闘終了');
    setTimeout(() => {
      busy = false;
      setEmptySlot(message, autoMode ? 'オート探索を続ける。' : '空白をタップして次の札を出す。');
    }, autoMode ? autoDelay('next') : 700);
  }

  function runPrimaryAction() {
    if (!currentCard || acted || busy || autoMode || battle) return;
    if (currentCard.type === 'item') doGather(currentCard);
    else if (currentCard.type === 'hunt') doHunt(currentCard);
    else if (currentCard.type === 'fish') doFish(currentCard);
  }

  function tapCard() {
    if (!currentCard || acted || busy || autoMode || battle || currentCard.type === 'enemy') return;
    if (currentCard.type === 'none') discardCurrentCard();
  }

  function setAutoMode(next) {
    autoMode = Boolean(next);
    clearAutoTimer();
    updateAutoButton();
    setDrawnInteractivity();
    setSlotState();

    if (!autoMode) {
      eventDetail.textContent = 'この地点のオートを終了した。';
      if (battle) { renderParty(); return; }
      if (!currentCard) {
        cardHint.textContent = `空白をタップして次の札へ　${drawMinutes()}分`;
        return;
      }
      showCardInfo(currentCard);
      if (currentCard.type !== 'none') showChoices(currentCard);
      return;
    }

    hideChoices();
    eventDetail.textContent = `この地点にいる間だけ自動で探索する。速度：${AUTO_SPEEDS[autoSpeed].label}`;
    if (battle) { renderParty(); scheduleBattlePhase(); return; }
    if (currentCard && !acted && !busy) { showCardInfo(currentCard); scheduleAutoAction(currentCard); return; }
    if (!currentCard && !busy) requestNextCard();
  }

  function cycleAutoSpeed() {
    const index = AUTO_SPEED_ORDER.indexOf(autoSpeed);
    autoSpeed = AUTO_SPEED_ORDER[(index + 1) % AUTO_SPEED_ORDER.length];
    updateAutoSpeedButton();
    if (!autoMode) return;
    eventDetail.textContent = `オート速度を「${AUTO_SPEEDS[autoSpeed].label}」に変更した。`;
    clearAutoTimer();
    if (busy) return;
    if (battle) scheduleBattlePhase();
    else if (currentCard && !acted) scheduleAutoAction(currentCard);
    else if (!currentCard) scheduleAutoNext();
  }

  placeName.textContent = config.placeNames?.[place] || config.placeNames?.[zone] || '探索地点';
  placeType.textContent = zoneConfig.label || zone;

  autoButton.addEventListener('click', () => setAutoMode(!autoMode));
  autoSpeedButton.addEventListener('click', cycleAutoSpeed);

  cardSlot.addEventListener('click', event => {
    if (event.target.closest('#drawn')) return;
    if (!autoMode && !currentCard && !busy && !battle) requestNextCard();
  });
  cardSlot.addEventListener('keydown', event => {
    if ((event.key === 'Enter' || event.key === ' ') && !autoMode && !currentCard && !busy && !battle) {
      event.preventDefault();
      requestNextCard();
    }
  });
  drawn.addEventListener('click', event => { event.preventDefault(); event.stopPropagation(); tapCard(); });
  primaryAction.addEventListener('click', event => { event.preventDefault(); runPrimaryAction(); });
  discardAction.addEventListener('click', event => { event.preventDefault(); if (!autoMode) discardCurrentCard(); });
  heroTab.addEventListener('click', () => {
    if (battle && battle.phase !== 'hero') return;
    activeParty = 'hero';
    renderParty();
  });
  wolfTab.addEventListener('click', () => {
    if (!adultWolfPresent()) return;
    if (battle && battle.phase !== 'wolf') return;
    activeParty = 'wolf';
    renderParty();
  });

  window.addEventListener('ddtimechange', refreshClock);
  window.addEventListener('ddinventorychange', renderParty);
  window.addEventListener('ddwolfchange', renderParty);
  window.addEventListener('pagehide', () => { autoMode = false; clearAutoTimer(); });
  document.addEventListener('contextmenu', event => event.preventDefault());
  document.addEventListener('selectstart', event => event.preventDefault());

  refreshClock();
  updateAutoButton();
  updateAutoSpeedButton();
  renderParty();
  setEmptySlot('空白をタップして札を出す。', `札を出すと${drawMinutes()}分進む。`);
})();
