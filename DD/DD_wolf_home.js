(() => {
  const wolf = window.DDWolf;
  const items = window.DDItems;
  const wolfName = document.getElementById('wolfName');
  const wolfStage = document.getElementById('wolfStage');
  const growth = document.getElementById('growth');
  const meatList = document.getElementById('meatList');
  const noMeat = document.getElementById('noMeat');
  const behaviorText = document.getElementById('behaviorText');
  const behaviorButton = document.getElementById('behaviorButton');
  const message = document.getElementById('message');

  function formatRemaining(minutes) {
    const value = Math.max(0, Math.floor(Number(minutes) || 0));
    const days = Math.floor(value / 1440);
    const hours = Math.floor((value % 1440) / 60);
    const mins = value % 60;
    const parts = [];
    if (days) parts.push(`${days}日`);
    if (hours) parts.push(`${hours}時間`);
    if (!days && mins) parts.push(`${mins}分`);
    return parts.join(' ') || 'まもなく';
  }

  function renderStatus() {
    wolf.updateAge();
    const state = wolf.getState();

    if (!state.hasCompanion) {
      location.href = 'DD_top.html';
      return;
    }

    wolfName.textContent = state.name;
    wolfStage.textContent = state.stage === 'pup' ? '子狼' : '成長した狼（？）';
    growth.textContent = state.stage === 'pup'
      ? `あと ${formatRemaining(state.remainingGrowthMinutes)} ほどで大きくなる。`
      : 'もう子狼ではない。';

    renderMeat();
  }

  function renderMeat() {
    meatList.innerHTML = '';
    const available = wolf.availableMeat();

    if (!available.length) {
      noMeat.textContent = '与えられる肉を持っていない。';
      return;
    }

    noMeat.textContent = '';

    available.forEach(({ item, count }) => {
      const row = document.createElement('div');
      row.className = 'meatRow';

      const info = document.createElement('div');
      info.className = 'meatInfo';
      info.textContent = `${item.name} ×${count}`;

      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'feedButton';
      button.textContent = '与える';
      button.addEventListener('click', () => {
        const result = wolf.feed(item.id);
        message.textContent = result.message || '';
        renderStatus();
      });

      row.append(info, button);
      meatList.appendChild(row);
    });
  }

  behaviorButton.addEventListener('click', () => {
    const behavior = wolf.randomBehavior();
    if (!behavior) return;
    behaviorText.textContent = behavior.text;
    message.textContent = behavior.combatEffect === 'enemy_flee'
      ? 'この遠吠えは戦闘中なら敵をひるませ、逃走に使える。'
      : '';
  });

  window.addEventListener('ddinventorychange', renderStatus);
  window.addEventListener('ddwolfchange', event => {
    if (event.detail?.type === 'grown') message.textContent = event.detail.message || '';
    renderStatus();
  });
  window.addEventListener('ddtimechange', renderStatus);

  renderStatus();
})();