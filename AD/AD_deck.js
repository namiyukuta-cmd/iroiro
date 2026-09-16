(() => {
  const params = new URLSearchParams(location.search);
  const enemyId = ['wolf', 'wild_dog'].includes(params.get('enemy')) ? params.get('enemy') : 'wild_dog';
  const returnUrl = params.get('return') || 'AD_top.html';

  const enemies = {
    wolf: {
      id: 'wolf',
      name: '狼',
      hp: 4,
      deck: [
        { id: 'attack', icon: '⚔', name: '噛みつく', damage: 1 },
        { id: 'attack', icon: '⚔', name: '噛みつく', damage: 1 },
        { id: 'strong', icon: '‼', name: '飛びかかる', damage: 2 },
        { id: 'guard', icon: '◼', name: '身構える', guard: 1 },
        { id: 'watch', icon: '…', name: '様子を見る', damage: 0 }
      ]
    },
    wild_dog: {
      id: 'wild_dog',
      name: '野犬',
      hp: 3,
      deck: [
        { id: 'attack', icon: '⚔', name: '噛みつく', damage: 1 },
        { id: 'attack', icon: '⚔', name: '噛みつく', damage: 1 },
        { id: 'strong', icon: '‼', name: '飛びかかる', damage: 2 },
        { id: 'watch', icon: '…', name: '様子を見る', damage: 0 }
      ]
    }
  };

  const enemy = enemies[enemyId];
  const PLAYER_MAX_HP = 5;
  const TURN_MINUTES = 1;

  const enemyName = document.getElementById('enemyName');
  const enemyHpText = document.getElementById('enemyHpText');
  const enemyHpFill = document.getElementById('enemyHpFill');
  const enemyDeckCount = document.getElementById('enemyDeckCount');
  const enemyDrawn = document.getElementById('enemyDrawn');
  const enemyIcon = document.getElementById('enemyIcon');
  const enemyAction = document.getElementById('enemyAction');
  const enemyPower = document.getElementById('enemyPower');
  const playerHpText = document.getElementById('playerHpText');
  const playerHpFill = document.getElementById('playerHpFill');
  const hand = document.getElementById('hand');
  const log = document.getElementById('log');
  const turnEl = document.getElementById('turn');
  const endActions = document.getElementById('endActions');
  const returnButton = document.getElementById('returnButton');

  let enemyHp = enemy.hp;
  let playerHp = PLAYER_MAX_HP;
  let turn = 1;
  let ended = false;
  let enemyDeck = [];

  function shuffle(list) {
    const out = list.map(card => ({ ...card }));
    for (let i = out.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [out[i], out[j]] = [out[j], out[i]];
    }
    return out;
  }

  function refillEnemyDeck() {
    enemyDeck = shuffle(enemy.deck);
  }

  function drawEnemyCard() {
    if (!enemyDeck.length) refillEnemyDeck();
    return enemyDeck.shift();
  }

  function percent(value, max) {
    if (!max) return 0;
    return Math.max(0, Math.min(100, (value / max) * 100));
  }

  function refreshStatus() {
    enemyName.textContent = enemy.name;
    enemyHpText.textContent = `${enemyHp} / ${enemy.hp}`;
    enemyHpFill.style.width = `${percent(enemyHp, enemy.hp)}%`;
    playerHpText.textContent = `${playerHp} / ${PLAYER_MAX_HP}`;
    playerHpFill.style.width = `${percent(playerHp, PLAYER_MAX_HP)}%`;
    enemyDeckCount.textContent = `${enemyDeck.length}枚`;
    turnEl.textContent = `${turn}ターン目`;
  }

  function makeHandCard(card) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'handCard';
    button.disabled = ended;

    const icon = document.createElement('div');
    icon.className = 'icon';
    icon.textContent = card.icon || '□';

    const name = document.createElement('div');
    name.textContent = card.name;

    const sub = document.createElement('div');
    sub.className = 'sub';
    sub.textContent = card.sub || '';

    button.append(icon, name, sub);
    button.addEventListener('click', () => play(card));
    return button;
  }

  function getPlayerHand() {
    const cards = [
      { id: 'strike', icon: '✊', name: '素手', damage: 1, sub: '攻撃 1' },
      { id: 'guard', icon: '◼', name: '防御', guard: 1, sub: '被害 -1' },
      { id: 'flee', icon: '↩', name: '逃げる', sub: '敵札次第' }
    ];

    if (Number(window.DDItems?.count?.('pebble') || 0) > 0) {
      cards.push({ id: 'stone', icon: '●', name: '石を投げる', damage: 2, consume: 'pebble', sub: '攻撃 2 / 小石×1' });
    }

    if (window.DDWolf?.hasCompanion?.()) {
      const label = window.DDWolf.stage?.() === 'pup' ? '子狼の遠吠え' : '遠吠え';
      cards.push({ id: 'howl', icon: '🐺', name: label, sub: '確実に逃走' });
    }

    return cards;
  }

  function renderHand() {
    hand.innerHTML = '';
    getPlayerHand().forEach(card => hand.appendChild(makeHandCard(card)));
  }

  function showEnemyCard(card) {
    enemyDrawn.style.visibility = 'visible';
    enemyIcon.textContent = card.icon || '□';
    enemyAction.textContent = card.name || '';
    if (card.damage) enemyPower.textContent = `攻撃 ${card.damage}`;
    else if (card.guard) enemyPower.textContent = `防御 ${card.guard}`;
    else enemyPower.textContent = '行動なし';
  }

  function finish(text, buttonLabel = '探索へ戻る', target = returnUrl) {
    ended = true;
    log.textContent = text;
    renderHand();
    endActions.style.display = 'flex';
    returnButton.textContent = buttonLabel;
    returnButton.onclick = () => { location.href = target; };
  }

  function escapeByHowl() {
    const result = window.DDWolf?.combatHowl?.() || { canEscape: false, text: '' };
    if (!result.canEscape) return false;
    if (window.DDTime) DDTime.advance(TURN_MINUTES, 'battle:howl');
    finish(result.text || '敵がひるんだ。逃げられる。');
    return true;
  }

  function play(playerCard) {
    if (ended) return;

    if (playerCard.id === 'howl') {
      escapeByHowl();
      return;
    }

    const enemyCard = drawEnemyCard();
    showEnemyCard(enemyCard);
    if (window.DDTime) DDTime.advance(TURN_MINUTES, `battle:${enemy.id}:turn`);

    let enemyDamage = Math.max(0, Number(enemyCard.damage || 0));
    let playerDamage = Math.max(0, Number(playerCard.damage || 0));
    const enemyGuard = Math.max(0, Number(enemyCard.guard || 0));
    const playerGuard = Math.max(0, Number(playerCard.guard || 0));
    const messages = [];

    if (playerCard.id === 'flee') {
      const success = enemyCard.id === 'watch' || enemyCard.id === 'guard';
      if (success) {
        refreshStatus();
        finish(`${enemy.name}の隙をついて逃げた。`);
        return;
      }
      messages.push('逃げようとしたが、回り込まれた。');
    }

    if (playerCard.consume) {
      const before = Number(window.DDItems?.count?.(playerCard.consume) || 0);
      if (before <= 0) {
        renderHand();
        log.textContent = '使える小石がない。';
        return;
      }
      window.DDItems.remove(playerCard.consume, 1);
    }

    if (enemyGuard > 0 && playerDamage > 0) {
      playerDamage = Math.max(0, playerDamage - enemyGuard);
    }

    if (playerDamage > 0) {
      enemyHp = Math.max(0, enemyHp - playerDamage);
      messages.push(`${enemy.name}に ${playerDamage} ダメージ。`);
    } else if (playerCard.id === 'strike' || playerCard.id === 'stone') {
      messages.push(`${enemy.name}に防がれた。`);
    }

    if (enemyHp <= 0) {
      refreshStatus();
      renderHand();
      finish(`${enemy.name}を倒した。`);
      return;
    }

    if (playerGuard > 0 && enemyDamage > 0) {
      enemyDamage = Math.max(0, enemyDamage - playerGuard);
    }

    if (enemyDamage > 0) {
      playerHp = Math.max(0, playerHp - enemyDamage);
      messages.push(`${enemy.name}から ${enemyDamage} ダメージ。`);
    } else if (Number(enemyCard.damage || 0) > 0) {
      messages.push('攻撃を防いだ。');
    } else if (enemyCard.id === 'watch') {
      messages.push(`${enemy.name}はこちらを窺っている。`);
    } else if (enemyCard.id === 'guard') {
      messages.push(`${enemy.name}は身構えている。`);
    }

    refreshStatus();
    renderHand();

    if (playerHp <= 0) {
      finish('戦闘を続けられない。', 'トップへ戻る', 'AD_top.html');
      return;
    }

    log.textContent = messages.join(' ');
    turn += 1;
    turnEl.textContent = `${turn}ターン目`;
  }

  returnButton.addEventListener('click', () => { location.href = returnUrl; });
  refillEnemyDeck();
  refreshStatus();
  renderHand();
})();