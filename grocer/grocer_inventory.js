(() => {
  'use strict';
  window.GrocerInventory = {
    buildGrid(target, count = 24) {
      if (!target) return;
      target.textContent = '';
      for (let i = 0; i < count; i += 1) {
        const slot = document.createElement('div');
        slot.className = 'inventory-slot';
        slot.dataset.slot = String(i);
        target.appendChild(slot);
      }
    }
  };
})();
