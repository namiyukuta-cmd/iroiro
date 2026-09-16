(() => {
  const inventory = document.getElementById('inventory');
  const empty = document.getElementById('empty');
  const totalCount = document.getElementById('totalCount');
  const foodMessage = document.getElementById('foodMessage');
  const itemDb = window.DDItems;

  function fallbackIcon(item) {
    if (!item) return '□';
    if (item.kind === 'companion') return '🐺';
    if (item.id === 'nuts') return '🌰';
    if (item.id === 'mushroom') return '🍄';
    if (item.foodGroup === '魚') return '🐟';
    if (item.category === 'food') return '🍖';
    return '👜';
  }

  function categoryLabel(item) {
    if (!item) return '';
    if (item.category === 'food') {
      const base = item.foodGroup ? `食料・${item.foodGroup}` : '食料';
      if (item.requiresCooking) return `${base}・要調理`;
      if (item.edible) return `${base}・食べられる`;
      return base;
    }
    if (item.category === 'material') return '素材';
    if (item.kind === 'companion') return '同行・完全肉食';
    if (item.category === 'special') return '特別';
    return item.category || '';
  }

  function makeVisual(item) {
    const wrap = document.createElement('div');
    wrap.className = 'itemVisual';

    if (item?.image) {
      const img = document.createElement('img');
      img.src = item.image;
      img.alt = item.name || '';
      img.onerror = () => {
        wrap.innerHTML = '';
        wrap.textContent = fallbackIcon(item);
      };
      wrap.appendChild(img);
      return wrap;
    }

    wrap.textContent = fallbackIcon(item);
    return wrap;
  }

  function addFoodControls(card, item) {
    if (item?.category !== 'food') return;

    if (item.requiresCooking) {
      const note = document.createElement('div');
      note.className = 'itemBehavior';
      note.textContent = '小屋で調理が必要。';
      card.appendChild(note);
      return;
    }

    if (!item.edible || !window.DDNeeds) return;

    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'itemAction';
    button.textContent = '食べる';
    button.addEventListener('click', () => {
      if (itemDb.count(item.id) < 1) return;
      itemDb.remove(item.id, 1);
      DDNeeds.feedPlayer?.(item.hungerRestore || 100, item.foodType || 'other');
      const holdMinutes = Number(DDNeeds.holdMinutesForFood?.(item.foodType || 'other') || 0);
      const hours = Math.round(holdMinutes / 60);
      if (foodMessage) foodMessage.textContent = `${item.name}を食べた。${hours}時間、空腹は増えない。`;
    });
    card.appendChild(button);
  }

  function addCompanionControls(card, item) {
    if (item?.kind !== 'companion' || !window.DDWolf) return;

    card.classList.add('companion');

    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'itemAction';
    button.textContent = '様子を見る';

    const behaviorText = document.createElement('div');
    behaviorText.className = 'itemBehavior';

    button.addEventListener('click', () => {
      const behavior = DDWolf.randomBehavior();
      if (!behavior) return;
      behaviorText.textContent = behavior.combatEffect === 'enemy_flee'
        ? `${behavior.text}　戦闘中なら敵をひるませて逃げられる。`
        : behavior.text;
    });

    card.append(button, behaviorText);
  }

  function render() {
    window.DDWolf?.updateAge?.();
    const entries = itemDb?.getInventory?.() || [];
    inventory.innerHTML = '';

    const total = entries.reduce((sum, entry) => sum + Number(entry.count || 0), 0);
    totalCount.textContent = `${total}個`;

    if (!entries.length) {
      empty.style.display = 'block';
      return;
    }

    empty.style.display = 'none';

    entries.forEach(({ item, count }) => {
      const card = document.createElement('article');
      card.className = 'item';

      const badge = document.createElement('div');
      badge.className = 'itemCount';
      badge.textContent = item?.unique ? '所持' : `×${count}`;

      const name = document.createElement('div');
      name.className = 'itemName';
      name.textContent = item?.name || '不明なアイテム';

      const meta = document.createElement('div');
      meta.className = 'itemMeta';
      meta.textContent = categoryLabel(item);

      card.appendChild(badge);
      card.appendChild(makeVisual(item));
      card.appendChild(name);
      card.appendChild(meta);
      addFoodControls(card, item);
      addCompanionControls(card, item);
      inventory.appendChild(card);
    });
  }

  window.addEventListener('ddinventorychange', render);
  window.addEventListener('ddwolfchange', render);
  render();
})();