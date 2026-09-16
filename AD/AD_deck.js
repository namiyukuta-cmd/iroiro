(() => {
  const params = new URLSearchParams(location.search);
  const config = window.ADDeckConfig || {};
  const zones = config.zones || {};
  const zone = zones[params.get('zone')] ? params.get('zone') : 'forest';
  const zoneConfig = zones[zone] || { label: zone, cards: [], encounters: [] };

  const placeName = document.getElementById('placeName');
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
  const statusValue = document.getElementById('statusValue');
  const enemyIntent = document.getElementById('enemyIntent');
  const eventText = document.getElementById('eventText');
  const eventDetail = document.getElementById('eventDetail');
  const result = document.getElementById('result');

  const AUTO_SPEEDS = {
    slow: { label: 'ゆっくり', next: 1800, action: 900 },
    normal: { label: '普通', next: 800, action: 400 },
    fast: { label: '速い', next: 320, action: 160 }
  };
  const AUTO_SPEED_ORDER = ['slow', 'normal', 'fast'];

  let currentCard = null;
  let acted = false;
  let busy = false;
  let autoMode = false;
  let autoTimer = 0;
  let autoSpeed = 'slow';

  function clone(value) { return value ? { ...value } : value; }
  function pickRandom(list) {
    if (!Array.isArray(list) || !list.length) return null;
    return list[Math.floor(Math.random() * list.length)] || null;
  }

  function buildDrawPool() {
    return (zoneConfig.cards || []).map(clone);
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
    autoSpeedButton.textContent = `速度：${AUTO_SPEEDS[autoSpeed].label}`;
  }

  function clearAutoTimer() {
    if (autoTimer) clearTimeout(autoTimer);
    autoTimer = 0;
  }

  function setDrawnInteractivity() {
    const enabled = Boolean(currentCard && !acted && !busy && !autoMode);
    drawn.style.pointerEvents = enabled ? 'auto' : 'none';
    drawn.style.cursor = enabled ? 'pointer' : 'default';
    drawn.tabIndex = enabled ? 0 : -1;
  }

  function setSlotState() {
    const empty = !currentCard;
    cardSlot.classList.toggle('empty', empty);
    cardSlot.classList.toggle('busy', busy || autoMode);
    cardSlot.tabIndex = empty && !busy && !autoMode ? 0 : -1;
    slotPrompt.style.display = empty ? 'grid' : 'none';
    if (busy) slotPrompt.textContent = '札を探している…';
    else if (autoMode) slotPrompt.textContent = 'オート探索中…';
    else slotPrompt.textContent = 'ここをタップして札を出す';
  }

  function scheduleAutoNext() {
    clearAutoTimer();
    if (!autoMode) return;
    autoTimer = setTimeout(() => {
      autoTimer = 0;
      if (!autoMode || busy || currentCard) return;
      requestNextCard();
    }, AUTO_SPEEDS[autoSpeed].next);
  }

  function scheduleAutoAction(card) {
    clearAutoTimer();
    if (!autoMode || !card) return;
    autoTimer = setTimeout(() => {
      autoTimer = 0;
      if (autoMode && currentCard === card && !acted && !busy) discardCurrentCard('札を見送った。');
    }, AUTO_SPEEDS[autoSpeed].action);
  }

  function setEmptySlot(message = '', detail = '') {
    currentCard = null;
    acted = false;
    busy = false;
    drawn.style.display = 'none';
    drawn.style.transition = '';
    drawn.style.transform = '';
    drawn.style.opacity = '';
    drawn.classList.remove('dealIn');
    hideChoices();
    setDrawnInteractivity();
    setSlotState();
    statusName.textContent = '出る札';
    statusValue.textContent = '—';
    enemyIntent.textContent = '';
    cardHint.textContent = autoMode ? 'オートで次の札へ' : '空白をタップして次の札へ';
    if (message) eventText.textContent = message;
    if (detail !== undefined) eventDetail.textContent = detail;
    if (autoMode) scheduleAutoNext();
  }

  function showCardInfo(card) {
    statusName.textContent = card?.title || '出る札';
    statusValue.textContent = card?.type || '—';
    enemyIntent.textContent = card?.type === 'none' ? '何もない。' : '札を確認する。';

    if (autoMode) {
      cardHint.textContent = `オート処理中・${AUTO_SPEEDS[autoSpeed].label}`;
      eventDetail.textContent = '自動で見送る。';
      return;
    }

    if (card.type === 'item') { cardHint.textContent = '入手する / 見送る'; eventDetail.textContent = `入手すると${card.minutes || 20}分進む。`; return; }
    if (card.type === 'hunt') { cardHint.textContent = '狩猟する / 見送る'; eventDetail.textContent = '狩猟するか見送るか選ぶ。'; return; }
    if (card.type === 'fish') { cardHint.textContent = '捕る / 見送る'; eventDetail.textContent = `捕ると${card.minutes || 10}分進む。`; return; }
    cardHint.textContent = '札をタップして破棄する';
    eventDetail.textContent = '何もない。';
  }

  function revealCard() {
    const card = pickRandom(buildDrawPool());
    busy = false;
    if (!card) { setEmptySlot('出る札がない。', ''); return; }

    currentCard = clone(card);
    acted = false;
    drawn.style.transition = '';
    drawn.style.transform = '';
    drawn.style.opacity = '';
    drawn.classList.remove('dealIn');
    void drawn.offsetWidth;
    drawn.style.display = 'flex';
    drawn.classList.add('dealIn');
    cardIcon.textContent = currentCard.icon || '';
    cardTitle.textContent = currentCard.title || '何もない';
    cardSub.textContent = currentCard.type === 'none' ? '空白札' : '';
    eventText.textContent = currentCard.text || '何も起こらなかった。';
    result.textContent = '';
    showCardInfo(currentCard);
    setDrawnInteractivity();
    setSlotState();

    if (autoMode) {
      hideChoices();
      scheduleAutoAction(currentCard);
      return;
    }
    if (currentCard.type === 'none') { hideChoices(); return; }
    showChoices(currentCard);
  }

  function requestNextCard() {
    if (currentCard || busy) return;
    busy = true;
    hideChoices();
    setSlotState();
    cardHint.textContent = '';
    eventText.textContent = autoMode ? 'オートで札を探している…' : '札を探している…';
    eventDetail.textContent = '6分経過する。';
    result.textContent = '';
    setTimeout(revealCard, autoMode ? AUTO_SPEEDS[autoSpeed].action : 300);
  }

  function discardCurrentCard(message = '札を見送った。') {
    if (!currentCard || acted || busy) return;
    acted = true;
    hideChoices();
    drawn.style.transition = 'transform .18s ease-out,opacity .18s ease-out';
    drawn.style.transform = 'translateY(16px) scale(.92)';
    drawn.style.opacity = '.05';
    eventText.textContent = message;
    eventDetail.textContent = '';
    setTimeout(() => setEmptySlot(message, autoMode ? 'オート探索を続ける。' : '空白をタップして次の札を出す。'), 190);
  }

  function resolvePrimary() {
    if (!currentCard || acted || busy) return;
    const label = currentCard.type === 'item' ? '入手した。' : currentCard.type === 'hunt' ? '狩猟を選んだ。' : currentCard.type === 'fish' ? '捕るを選んだ。' : '札を処理した。';
    result.textContent = label;
    discardCurrentCard(label);
  }

  function setAutoMode(enabled) {
    autoMode = Boolean(enabled);
    clearAutoTimer();
    updateAutoButton();
    setDrawnInteractivity();
    setSlotState();
    hideChoices();
    eventDetail.textContent = `この画面にいる間だけ自動で札を出す。速度：${AUTO_SPEEDS[autoSpeed].label}`;
    if (currentCard && !acted && !busy) scheduleAutoAction(currentCard);
    else if (!currentCard && !busy) requestNextCard();
  }

  function cycleAutoSpeed() {
    const index = AUTO_SPEED_ORDER.indexOf(autoSpeed);
    autoSpeed = AUTO_SPEED_ORDER[(index + 1) % AUTO_SPEED_ORDER.length];
    updateAutoSpeedButton();
    if (autoMode) setAutoMode(true);
  }

  placeName.textContent = zoneConfig.label || zone;
  autoButton.addEventListener('click', () => setAutoMode(!autoMode));
  autoSpeedButton.addEventListener('click', cycleAutoSpeed);

  cardSlot.addEventListener('click', event => {
    if (event.target.closest('#drawn')) return;
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
    if (currentCard?.type === 'none') discardCurrentCard();
  });
  primaryAction.addEventListener('click', resolvePrimary);
  discardAction.addEventListener('click', () => discardCurrentCard());

  updateAutoButton();
  updateAutoSpeedButton();
  setEmptySlot('札を出す。', '');
})();