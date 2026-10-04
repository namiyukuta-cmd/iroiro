(() => {
  'use strict';

  function buildGrid(target, options = {}) {
    if (!target) return;
    const state = options.state || (window.GrocerState ? window.GrocerState.load() : { inventory: [] });
    const items = state.inventory || [];

    target.textContent = '';

    for (let i = 0; i < 24; i += 1) {
      const slot = document.createElement('button');
      slot.type = 'button';
      slot.className = 'inventory-slot';
      slot.dataset.slot = String(i);

      const row = items[i];
      if (row && row.count > 0 && window.GrocerState) {
        const meta = window.GrocerState.item(row.id);
        if (meta) {
          slot.dataset.itemId = row.id;
          slot.innerHTML = '<span class="inventory-name"></span><span class="inventory-count"></span>';
          slot.querySelector('.inventory-name').textContent = meta.name;
          slot.querySelector('.inventory-count').textContent = '×' + row.count;
          if (typeof options.onItemClick === 'function') {
            slot.addEventListener('click', () => options.onItemClick(row.id));
          }
        }
      } else {
        slot.disabled = true;
      }

      target.appendChild(slot);
    }
  }

  window.GrocerInventory = { buildGrid };
})();
