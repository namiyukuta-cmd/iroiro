(() => {
  if (!/\/AD\/AD_deck\.html$/i.test(location.pathname)) return;

  window.addEventListener('load', () => {
    const params = new URLSearchParams(location.search);
    const config = window.DDPointConfig || {};
    const zones = config.zones || {};
    const zoneId = zones[params.get('zone')] ? params.get('zone') : 'forest';
    const zone = zones[zoneId] || { label: zoneId, cards: [] };

    const autoControls = document.getElementById('autoControls');
    if (autoControls) autoControls.style.display = 'none';

    const wolfTab = document.getElementById('wolfTab');
    if (wolfTab) wolfTab.remove();
    document.getElementById('partyPanel')?.classList.remove('wolfMode');

    const oldSlot = document.getElementById('cardSlot');
    if (!oldSlot) return;
    const newSlot = oldSlot.cloneNode(true);
    oldSlot.replaceWith(newSlot);

    const oldGrid = document.getElementById('actionGrid');
    if (!oldGrid) return;
    const newGrid = oldGrid.cloneNode(false);
    oldGrid.replaceWith(newGrid);

    const cardSlot = document.getElementById('cardSlot');
    const slotPrompt = document.getElementById('slotPrompt');
    const drawn = document.getElementById('drawn');
    const cardIcon = document.getElementById('cardIcon');
    const cardTitle = document.getElementById('cardTitle');
    const cardSub = document.getElementById('cardSub');
    const statusName = document.getElementById('statusName');
    const statusValue = document.getElementById('statusValue');
    const enemyHpFill = document.getElementById('enemyHpFill');
    const battleRound = document.getElementById('battleRound');
    const enemyIntent = document.getElementById('enemyIntent');
    const cardActions = document.getElementById('cardActions');
    const cardHint = document.getElementById('cardHint');
    const eventText = document.getElementById('eventText');
    const eventDetail = document.getElementById('eventDetail');
    const result = document.getElementById('result');
    const placeType = document.getElementById('placeType');
    const turnLabel = document.getElementById('turnLabel');
    const allyStatusName = document.getElementById('allyStatusName');
    const allyHpFill = document.getElementById('allyHpFill');
    const allyHpValue = document.getElementById('allyHpValue');
    const actionGrid = document.getElementById('actionGrid');
    const partyNote = document.getElementById('partyNote');
    const heroMiniHp = document.getElementById('heroMiniHp');

    if (cardActions) cardActions.style.display = 'none';
    if (heroMiniHp) heroMiniHp.textContent = '';
    if (turnLabel) turnLabel.textContent = '主人公のカード';
    if (allyStatusName) allyStatusName.textContent = '主人公';
    if (allyHpFill) allyHpFill.style.width = '100%';
    if (allyHpValue) allyHpValue.textContent = '—';
    if (partyNote) partyNote.textContent = '持っているカードで、場に出た山札カードへ対処する。';

    const style = document.createElement('style');
    style.textContent = `
      #cardSlot{cursor:default!important}
      #cardSlot:active{transform:none!important}
      #actionGrid{display:grid!important;grid-template-columns:repeat(4,minmax(0,1fr))!important;gap:6px!important}
      .adPlayerCard{min-width:0;height:64px;border:1.5px solid #282722;border-radius:8px;background:#fff;padding:4px 2px;font:inherit;font-size:10px;font-weight:1000;line-height:1.05;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:3px;box-shadow:0 1px 0 rgba(0,0,0,.12)}
      .adPlayerCard:disabled{opacity:.32}
      .adPlayerIcon{font-size:22px;line-height:1}
      .adPlayerCount{font-size:8px;color:#666}
      #drawn.adResolve{animation:adResolve .3s ease forwards!important}
      @keyframes adResolve{to{opacity:0;transform:translateY(-12px) scale(.9)}}
      #drawn.adWin{border-color:#222!important}
    `;
    document.head.appendChild(style);

    function clone(card) { return card ? { ...card } : card; }
    function shuffle(list) {
      const out = (list || []).map(clone);
      for (let i = out.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [out[i], out[j]] = [out[j], out[i]];
      }
      return out;
    }

    // ADでは開始時に山札を一度だけ作る。途中で補充・再抽選しない。
    const deck = shuffle(zone.cards || []);
    const initialDeckSize = deck.length;
    let currentCard = null;
    let resolved = false;
    let finished = false;

    function remainingCount() {
      return deck.length + (currentCard ? 1 : 0);
    }

    function updateDeckStatus() {
      const remain = remainingCount();
      if (placeType) placeType.textContent = `山札 ${remain}/${initialDeckSize}`;
      if (statusName) statusName.textContent = '山札';
      if (statusValue) statusValue.textContent = `残り ${remain}/${initialDeckSize}`;
      if (battleRound) battleRound.textContent = currentCard ? '場に1枚' : '';
      if (enemyHpFill) {
        const rate = initialDeckSize ? (remain / initialDeckSize) * 100 : 0;
        enemyHpFill.style.width = `${Math.max(0, Math.min(100, rate))}%`;
      }
    }

    function cardName(card) {
      return card?.title || (card?.type === 'none' ? '空白札' : 'カード');
    }

    function acceptedCounterIds(card) {
      if (Array.isArray(card?.counterIds)) return card.counterIds;
      if (Array.isArray(card?.requires)) return card.requires;
      if (card?.counterId) return [card.counterId];
      return null;
    }

    function canUsePlayerCard(itemId) {
      if (!currentCard || resolved || finished) return false;
      const accepted = acceptedCounterIds(currentCard);
      return !accepted || accepted.length === 0 || accepted.includes(itemId);
    }

    function playerCards() {
      if (Array.isArray(config.playerCards) && config.playerCards.length) {
        return config.playerCards.map(card => ({
          id: card.id,
          name: card.name || card.id,
          icon: card.icon || '▣',
          count: Math.max(1, Number(card.count || 1)),
          configured: true
        }));
      }
      return (window.DDItems?.getInventory?.() || [])
        .filter(entry => entry?.item?.kind !== 'companion')
        .map(entry => ({
          id: entry.item.id,
          name: entry.item.name || entry.item.id,
          icon: entry.item.kind === 'arrow' ? '➶' : entry.item.category === 'food' ? '◌' : entry.item.id === 'pebble' ? '●' : '▣',
          count: Math.max(1, Number(entry.count || 1)),
          configured: false
        }));
    }

    function renderPlayerCards() {
      actionGrid.innerHTML = '';
      const cards = playerCards();
      if (!cards.length) {
        const empty = document.createElement('div');
        empty.className = 'actionTile emptyActionSlot';
        empty.textContent = 'カードなし';
        actionGrid.appendChild(empty);
        return;
      }
      cards.forEach(card => {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'adPlayerCard';
        button.disabled = !canUsePlayerCard(card.id);
        const icon = document.createElement('span');
        icon.className = 'adPlayerIcon';
        icon.textContent = card.icon;
        const name = document.createElement('span');
        name.textContent = card.name;
        const count = document.createElement('span');
        count.className = 'adPlayerCount';
        count.textContent = `×${card.count}`;
        button.append(icon, name, count);
        button.addEventListener('click', () => resolveWithPlayerCard(card));
        actionGrid.appendChild(button);
      });
    }

    function showCurrentCard() {
      if (!currentCard || finished) return;
      resolved = false;
      drawn.classList.remove('adResolve', 'adWin');
      drawn.style.display = 'flex';
      drawn.style.opacity = '1';
      drawn.style.transform = '';
      slotPrompt.style.display = 'none';
      cardIcon.textContent = currentCard.icon || '';
      cardTitle.textContent = cardName(currentCard);
      cardSub.textContent = currentCard.type === 'none' ? '空白札' : '山札カード';
      eventText.textContent = currentCard.text || `${cardName(currentCard)}が出た。`;
      const accepted = acceptedCounterIds(currentCard);
      eventDetail.textContent = accepted?.length ? '対応できる主人公カードを使う。' : '主人公のカードで対処できる。';
      result.textContent = '';
      if (enemyIntent) enemyIntent.textContent = '主人公のカードで対処する。';
      if (cardHint) cardHint.textContent = '山札カードは自動で出る';
      updateDeckStatus();
      renderPlayerCards();

      // 空白札だけは主人公カードを使わず自動で消える。
      if (currentCard.type === 'none') {
        if (enemyIntent) enemyIntent.textContent = '何もない。自動で消える。';
        setTimeout(() => resolveCurrent(null, '何もない札を消した。'), 550);
      }
    }

    function revealNextCard() {
      if (finished || currentCard) return;
      if (!deck.length) {
        win();
        return;
      }
      currentCard = deck.shift();
      showCurrentCard();
    }

    function resolveWithPlayerCard(playerCard) {
      if (!canUsePlayerCard(playerCard.id)) {
        result.textContent = 'このカードでは対処できない。';
        return;
      }
      resolveCurrent(playerCard, `${playerCard.name}で${cardName(currentCard)}に対処した。`);
    }

    function resolveCurrent(playerCard, message) {
      if (!currentCard || resolved || finished) return;
      resolved = true;
      const cleared = currentCard;

      if (playerCard && cleared.consumeCounter === true && !playerCard.configured) {
        window.DDItems?.remove?.(playerCard.id, 1);
      }

      eventText.textContent = message;
      eventDetail.textContent = '次の山札カードが自動で出る。';
      result.textContent = message;
      drawn.classList.add('adResolve');
      actionGrid.querySelectorAll('button').forEach(button => button.disabled = true);

      setTimeout(() => {
        drawn.style.display = 'none';
        drawn.classList.remove('adResolve');
        currentCard = null;
        updateDeckStatus();
        setTimeout(revealNextCard, 260);
      }, 320);
    }

    function win() {
      finished = true;
      currentCard = null;
      updateDeckStatus();
      slotPrompt.style.display = 'grid';
      slotPrompt.textContent = '山札 0枚';
      drawn.style.display = 'none';
      if (statusName) statusName.textContent = '勝利';
      if (statusValue) statusValue.textContent = '山札 0/0';
      if (battleRound) battleRound.textContent = '';
      if (enemyIntent) enemyIntent.textContent = '山札をすべて消した。';
      if (cardHint) cardHint.textContent = '勝ち';
      eventText.textContent = '山札のカードをすべて消した。勝利。';
      eventDetail.textContent = '';
      result.textContent = 'WIN';
      renderPlayerCards();
    }

    // DD側の「空白をタップして札を出す」はADでは使わない。
    cardSlot.removeAttribute('role');
    cardSlot.removeAttribute('tabindex');
    cardSlot.style.pointerEvents = 'none';

    if (document.getElementById('heroTab')) {
      document.getElementById('heroTab').classList.add('active');
    }

    window.addEventListener('ddinventorychange', renderPlayerCards);

    updateDeckStatus();
    if (initialDeckSize === 0) win();
    else setTimeout(revealNextCard, 250);
  }, { once: true });
})();