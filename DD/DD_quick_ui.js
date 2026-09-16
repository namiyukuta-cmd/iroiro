(() => {
  const actionGrid = document.getElementById('actionGrid');
  const partyPanel = document.getElementById('partyPanel');
  const partyNote = document.getElementById('partyNote');
  if (!actionGrid || !partyPanel) return;

  const QUICK_LIMIT = 7;
  const SKILL_LIMIT = 7;
  let arranging = false;

  function makeLabel(text, className) {
    const label = document.createElement('div');
    label.className = `quickUiLabel ${className}`;
    label.textContent = text;
    return label;
  }

  function makeEmptySlot(kind) {
    const slot = document.createElement('div');
    slot.className = `actionTile emptyActionSlot ${kind}`;
    slot.setAttribute('aria-hidden', 'true');
    const icon = document.createElement('span');
    icon.className = 'actionIcon';
    icon.textContent = '·';
    slot.appendChild(icon);
    return slot;
  }

  function makeBowTile() {
    const bow = window.DDHuntConfig?.equipment?.bow;
    if (!bow) return null;
    const tile = document.createElement('button');
    tile.type = 'button';
    tile.className = 'actionTile quickSlot quickUiSynthetic equipmentTile';
    tile.dataset.action = 'equipment:bow';
    tile.disabled = true;
    const icon = document.createElement('span');
    icon.className = 'actionIcon';
    icon.textContent = '🏹';
    const label = document.createElement('span');
    label.textContent = bow.name || '弓';
    tile.append(icon, label);
    return tile;
  }

  function actionId(tile) {
    return tile?.dataset?.action || '';
  }

  function isWolfTile(id) {
    return id.startsWith('wolf:') || ['bite', 'claw', 'growl', 'guard'].includes(id);
  }

  function classify(tile, wolfMode) {
    const id = actionId(tile);
    tile.classList.remove('quickSlot', 'skillSlot');

    if (wolfMode || isWolfTile(id) || id === 'wait') {
      tile.classList.add('skillSlot');
      return 'skill';
    }
    if (id.startsWith('hero:')) {
      tile.classList.add('skillSlot');
      return 'skill';
    }
    tile.classList.add('quickSlot');
    return 'quick';
  }

  function quickPriority(tile) {
    const id = actionId(tile);
    if (id === 'equipment:bow') return 0;
    if (id.includes('wood_arrow') || id.includes('arrow')) return 1;
    if (id.includes('pebble')) return 2;
    return 10;
  }

  function skillPriority(tile) {
    const id = actionId(tile).replace('hero:', '').replace('wolf:', '');
    const order = { strike: 0, bite: 0, claw: 1, guard: 2, growl: 3, flee: 4, wait: 9 };
    return order[id] ?? 5;
  }

  function arrange() {
    if (arranging) return;
    arranging = true;
    observer.disconnect();

    actionGrid.querySelectorAll('.quickUiLabel,.quickUiSynthetic,.emptyActionSlot').forEach(node => node.remove());
    const tiles = [...actionGrid.querySelectorAll('.actionTile')];
    const wolfMode = partyPanel.classList.contains('wolfMode') || tiles.some(tile => isWolfTile(actionId(tile)));
    actionGrid.classList.toggle('wolfLayout', wolfMode);

    const quick = [];
    const skills = [];
    tiles.forEach(tile => {
      tile.hidden = false;
      if (classify(tile, wolfMode) === 'skill') skills.push(tile);
      else quick.push(tile);
    });

    if (!wolfMode) {
      const bowTile = makeBowTile();
      if (bowTile) quick.unshift(bowTile);
    }

    quick.sort((a, b) => quickPriority(a) - quickPriority(b));
    skills.sort((a, b) => skillPriority(a) - skillPriority(b));

    const visibleQuick = wolfMode ? [] : quick.slice(0, QUICK_LIMIT);
    const visibleSkills = skills.slice(0, SKILL_LIMIT);
    quick.slice(QUICK_LIMIT).forEach(tile => { tile.hidden = true; });
    skills.slice(SKILL_LIMIT).forEach(tile => { tile.hidden = true; });

    actionGrid.innerHTML = '';

    if (!wolfMode) {
      actionGrid.appendChild(makeLabel('装備・すぐ使う', 'quickLabel'));
      visibleQuick.forEach(tile => actionGrid.appendChild(tile));
      for (let i = visibleQuick.length; i < QUICK_LIMIT; i++) actionGrid.appendChild(makeEmptySlot('quickSlot'));
    }

    actionGrid.appendChild(makeLabel(wolfMode ? '能力' : '行動・スキル', 'skillLabel'));
    visibleSkills.forEach(tile => actionGrid.appendChild(tile));
    for (let i = visibleSkills.length; i < SKILL_LIMIT; i++) actionGrid.appendChild(makeEmptySlot('skillSlot'));

    if (partyNote) {
      if (wolfMode) partyNote.textContent = '狼（？）の能力。戦闘中は使える能力だけ明るく表示する。';
      else if (tiles.some(tile => actionId(tile).startsWith('hero:'))) partyNote.textContent = '上段は装備・すぐ使える物、下段は行動・スキル。';
      else partyNote.textContent = '上段に装備・すぐ使える物を最大7枠表示する。';
    }

    observer.observe(actionGrid, { childList: true, subtree: false });
    arranging = false;
  }

  const observer = new MutationObserver(() => queueMicrotask(arrange));
  observer.observe(actionGrid, { childList: true, subtree: false });
  window.addEventListener('ddinventorychange', () => queueMicrotask(arrange));
  window.addEventListener('ddwolfchange', () => queueMicrotask(arrange));
  queueMicrotask(arrange);
})();
