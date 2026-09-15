(() => {
  const list = document.getElementById('craftList');
  const items = window.DDItems;
  if (!list || !items) return;

  function makeRecipe() {
    const branchCount = items.count('branch');
    const arrowCount = items.count('wood_arrow');

    list.innerHTML = '';

    const card = document.createElement('section');
    card.className = 'recipe';

    const title = document.createElement('div');
    title.className = 'recipeTitle';
    title.textContent = '木の矢';

    const material = document.createElement('div');
    material.className = 'recipeMaterial';
    material.textContent = `必要：木の枝 ×1　（所持 ${branchCount}）`;

    const owned = document.createElement('div');
    owned.className = 'recipeOwned';
    owned.textContent = `木の矢 所持：${arrowCount}`;

    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'craftButton';
    button.textContent = '1本作る';
    button.disabled = branchCount < 1;
    button.addEventListener('click', () => {
      if (items.count('branch') < 1) return;
      items.remove('branch', 1);
      items.add('wood_arrow', 1);
      render();
    });

    card.append(title, material, owned, button);
    list.appendChild(card);
  }

  function render() {
    makeRecipe();
  }

  window.addEventListener('ddinventorychange', render);
  render();
})();