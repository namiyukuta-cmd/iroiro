(() => {
  const list = document.getElementById('cookList');
  const result = document.getElementById('cookResult');
  const hungerText = document.getElementById('playerHunger');
  const items = window.DDItems;
  const needs = window.DDNeeds;
  if (!list || !items || !needs) return;

  const recipeIds = ['mushroom', 'meat_deer', 'meat_rabbit', 'meat_bird', 'river_fish'];

  function holdHours(foodType) {
    const minutes = Number(needs.holdMinutesForFood?.(foodType) || 0);
    return minutes > 0 ? Math.round(minutes / 60) : 0;
  }

  function refreshHunger() {
    const state = needs.getState?.() || { playerHunger: 0, maxHunger: 100 };
    hungerText.textContent = `${state.playerHunger} / ${state.maxHunger}`;
  }

  function eatCooked(item) {
    if (!item || items.count(item.id) < 1) return;
    const dish = item.cookingName || item.name;
    items.remove(item.id, 1);
    needs.feedPlayer?.(item.hungerRestore || 100, item.foodType || 'other');
    const hours = holdHours(item.foodType || 'other');
    result.textContent = `${dish}を食べた。${hours}時間、空腹は増えない。`;
    refreshHunger();
    render();
  }

  function makeRecipe(id) {
    const item = items.get(id);
    if (!item) return null;

    const card = document.createElement('section');
    card.className = 'recipe';

    const top = document.createElement('div');
    top.className = 'recipeTop';

    const title = document.createElement('div');
    title.className = 'recipeTitle';
    title.textContent = item.cookingName || item.name;

    const count = document.createElement('div');
    count.className = 'recipeCount';
    count.textContent = `所持 ×${items.count(id)}`;

    const material = document.createElement('div');
    material.className = 'recipeMaterial';
    material.textContent = `材料：${item.name} ×1`;

    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'cookButton';
    button.textContent = `${item.cookingName || item.name}にして食べる`;
    button.disabled = items.count(id) < 1;
    button.addEventListener('click', () => eatCooked(item));

    top.append(title, count);
    card.append(top, material, button);
    return card;
  }

  function render() {
    list.innerHTML = '';
    recipeIds.forEach(id => {
      const card = makeRecipe(id);
      if (card) list.appendChild(card);
    });
    refreshHunger();
  }

  window.addEventListener('ddinventorychange', render);
  window.addEventListener('ddneedschange', refreshHunger);
  window.addEventListener('ddtimechange', refreshHunger);
  render();
})();