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
  const cardHint = document.getElementById('cardHint');
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
  let pointerId = null;
  let startX = 0;
  let startY = 0;
  let lastX = 0;
  let lastY = 0;
  let dragging = false;

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

  function resetCardTransform() {
    drawn.style.transition = '';
    drawn.style.transform = '';
    drawn.style.opacity = '';
  }

  function setDrawnInteractivity() {
    const enabled = Boolean(currentCard && !acted);
    drawn.style.pointerEvents = enabled ? 'auto' : 'none';
    drawn.style.cursor = enabled ? 'pointer' : 'default';
    drawn.tabIndex = enabled ? 0 : -1;
    drawn.setAttribute('aria-disabled', enabled ? 'false' : 'true');
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
    drawn.classList.remove('tapFeedback', 'dealIn');
    resetCardTransform();
    currentCard = null;
    acted = false;
    dragging = false;
    pointerId = null;
    setDrawnInteractivity();
  }

  function animateToInventory(card) {
    const source = drawn?.getBoundingClientRect?.();
    const target = inventoryButton?.getBoundingClientRect?.();

    if (!source || !target || !source.width || !source.height || !target.width || !target.height) {
      removeDrawnCard();
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

    removeDrawnCard();

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

  function refreshClock() {
    const state = window.DDTime?.getState?.() || { day: 1, hour: 7, minute: 0, phase: '朝' };
    timeText.textContent = `${String(state.hour).padStart(2, '0')}:${String(state.minute).padStart(2, '0')}`;
    dayText.textContent = `${state.day}日目　${state.phase}`;
    minuteHand.style.transform = `rotate(${state.minute * 6}deg)`;
    hourHand.style.transform = `rotate(${((state.hour % 12) + state.minute / 60) * 30}deg)`;
  }

  function pointReturnUrl() {
    return `DD_point.html?zone=${encodeURIComponent(zone)}&place=${encodeURIComponent(place)}&v=${Date.now()}`;
  }

  function showCardInfo(card) {
    const minutes = drawMinutes();
    if (card.type === 'item') {
      cardHint.textContent = 'タップ：手に入れる　　左右スワイプ：捨てる';
      eventDetail.textContent = `タップで入手 ${card.minutes || 20}分　／　次の札 ${minutes}分`;
      return;
    }
    if (card.type === 'hunt') {
      cardHint.textContent = 'タップ：狩猟する　　左右スワイプ：見送る';
      eventDetail.textContent = `タップで狩猟　／　次の札 ${minutes}分`;
      return;
    }
    if (card.type === 'fish') {
      cardHint.textContent = 'タップ：捕る　　左右スワイプ：見送る';
      eventDetail.textContent = `タップで捕る ${card.minutes || 10}分　／　次の札 ${minutes}分`;
      return;
    }
    if (card.type === 'enemy') {
      cardHint.textContent = '遭遇';
      eventDetail.textContent = '戦闘開始。';
      return;
    }
    cardHint.textContent = '左右スワイプ：次の札へ';
    eventDetail.textContent = `左右にスワイプして次へ　${minutes}分`;
  }

  function drawCard() {
    removeDrawnCard();

    const pool = buildDrawPool();
    const card = pickRandom(pool);
    if (!card) {
      eventText.textContent = '出る札がない。';
      eventDetail.textContent = '';
      cardHint.textContent = '';
      return;
    }

    DDTime?.advanceAction?.('exploreDraw');

    currentCard = clone(card);
    acted = false;
    resetCardTransform();
    drawn.style.display = 'flex';
    drawn.classList.remove('dealIn');
    void drawn.offsetWidth;
    drawn.classList.add('dealIn');
    setDrawnInteractivity();

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
      setTimeout(() => doBattle(enemy, true), 90);
    }
  }

  function doGather(card) {
    if (acted) return;
    acted = true;
    setDrawnInteractivity();
    DDTime?.advance?.(card.minutes || 20, `point:${zone}:gather`);
    const item = DDItems?.get?.(card.itemId);
    const name = item?.name || card.title || 'アイテム';
    DDItems?.add?.(card.itemId, 1);
    animateToInventory(card);
    result.textContent = `${name}を1個、手に入れた。`;
    eventDetail.textContent = 'アイテムに入った。';
    setTimeout(drawCard, 760);
  }

  function doHunt(card) {
    if (acted) return;
    acted = true;
    setDrawnInteractivity();
    const back = pointReturnUrl();
    const target = `DD_hunt.html?animal=${encodeURIComponent(card.animalId)}&from=point&return=${encodeURIComponent(back)}`;
    setTimeout(() => { location.href = target; }, 120);
  }

  function doFish(card) {
    if (acted) return;
    acted = true;
    setDrawnInteractivity();
    const attack = 1;
    const hp = Math.max(1, Number(card.fishHp || 2));
    const minutes = Math.max(1, Number(card.minutes || 10));
    DDTime?.advance?.(minutes, 'point:river:fish');

    if (hp - attack <= 0) {
      DDItems?.add?.('river_fish', 1);
      animateToInventory({ ...card, title: '川魚', icon: card.icon || '🐟' });
      result.textContent = '川魚を1匹、手に入れた。';
      eventDetail.textContent = 'アイテムに入った。';
      setTimeout(drawCard, 760);
      return;
    }

    result.textContent = '素手で追ったが魚は逃げた。';
    eventDetail.textContent = '次の札へ。';
    drawn.style.transition = 'transform .22s ease, opacity .22s ease';
    drawn.style.transform = 'translateY(28px) scale(.88)';
    drawn.style.opacity = '.15';
    setTimeout(() => {
      removeDrawnCard();
      drawCard();
    }, 520);
  }

  function doBattle(card, alreadyLocked = false) {
    if (!alreadyLocked) {
      if (acted) return;
      acted = true;
      setDrawnInteractivity();
    }
    const back = pointReturnUrl();
    location.href = `DD_battle.html?enemy=${encodeURIComponent(card.enemyId)}&return=${encodeURIComponent(back)}`;
  }

  function actOnCurrentCard() {
    if (!currentCard || acted) return;
    const card = currentCard;
    tapFeedback();
    if (card.type === 'item') return doGather(card);
    if (card.type === 'hunt') return doHunt(card);
    if (card.type === 'fish') return doFish(card);
    if (card.type === 'enemy') return doBattle(card);
    // 「何もない」はタップでは何もしない。スワイプで捨てる。
  }

  function discardCurrentCard(direction) {
    if (!currentCard || acted) return;
    acted = true;
    setDrawnInteractivity();
    const distance = Math.max(window.innerWidth, 420) * .8 * direction;
    drawn.style.transition = 'transform .22s ease-out, opacity .22s ease-out';
    drawn.style.transform = `translateX(${distance}px) rotate(${direction * 16}deg)`;
    drawn.style.opacity = '.05';
    eventText.textContent = '札を捨てた。';
    eventDetail.textContent = '次の札へ。';
    result.textContent = '';
    setTimeout(drawCard, 230);
  }

  function beginGesture(event) {
    if (!currentCard || acted || pointerId !== null) return;
    pointerId = event.pointerId;
    startX = lastX = event.clientX;
    startY = lastY = event.clientY;
    dragging = true;
    drawn.classList.remove('dealIn', 'tapFeedback');
    drawn.style.transition = 'none';
    try { drawn.setPointerCapture(event.pointerId); } catch (_) {}
  }

  function moveGesture(event) {
    if (!dragging || event.pointerId !== pointerId || !currentCard || acted) return;
    lastX = event.clientX;
    lastY = event.clientY;
    const dx = lastX - startX;
    const dy = lastY - startY;
    if (Math.abs(dx) < 4 && Math.abs(dy) < 4) return;
    event.preventDefault();
    const rotate = Math.max(-12, Math.min(12, dx / 18));
    const opacity = Math.max(.45, 1 - Math.abs(dx) / 360);
    drawn.style.transform = `translateX(${dx}px) rotate(${rotate}deg)`;
    drawn.style.opacity = String(opacity);
  }

  function endGesture(event) {
    if (!dragging || event.pointerId !== pointerId) return;
    const dx = (event.clientX ?? lastX) - startX;
    const dy = (event.clientY ?? lastY) - startY;
    dragging = false;
    pointerId = null;
    try { drawn.releasePointerCapture(event.pointerId); } catch (_) {}

    if (!currentCard || acted) return;

    const horizontalSwipe = Math.abs(dx) >= 55 && Math.abs(dx) > Math.abs(dy) * 1.1;
    if (horizontalSwipe) {
      discardCurrentCard(dx > 0 ? 1 : -1);
      return;
    }

    drawn.style.transition = 'transform .14s ease, opacity .14s ease';
    drawn.style.transform = '';
    drawn.style.opacity = '1';

    const tap = Math.abs(dx) < 12 && Math.abs(dy) < 12;
    if (tap) actOnCurrentCard();
  }

  placeName.textContent = config.placeNames?.[place] || config.placeNames?.[zone] || '探索地点';
  placeType.textContent = zoneConfig.label || zone;

  drawn.addEventListener('pointerdown', beginGesture);
  drawn.addEventListener('pointermove', moveGesture, { passive: false });
  drawn.addEventListener('pointerup', endGesture);
  drawn.addEventListener('pointercancel', event => {
    if (event.pointerId !== pointerId) return;
    dragging = false;
    pointerId = null;
    if (currentCard && !acted) {
      drawn.style.transition = 'transform .14s ease, opacity .14s ease';
      drawn.style.transform = '';
      drawn.style.opacity = '1';
    }
  });
  drawn.addEventListener('keydown', event => {
    if ((event.key === 'Enter' || event.key === ' ') && currentCard && !acted) {
      event.preventDefault();
      actOnCurrentCard();
    }
  });

  window.addEventListener('ddtimechange', refreshClock);
  document.addEventListener('contextmenu', e => e.preventDefault());
  document.addEventListener('selectstart', e => e.preventDefault());

  refreshClock();
  drawCard();
})();