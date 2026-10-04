(() => {
  'use strict';

  const inventoryGrid = document.getElementById('inventoryGrid');
  const stockButton = document.getElementById('stockButton');
  const openShopButton = document.getElementById('openShopButton');

  for (let i = 0; i < 24; i += 1) {
    const slot = document.createElement('div');
    slot.className = 'inventory-slot';
    slot.dataset.slot = String(i);
    inventoryGrid.appendChild(slot);
  }

  stockButton.addEventListener('click', () => {
    window.dispatchEvent(new CustomEvent('grocer-top-action', {
      detail: { action: 'stock' }
    }));
  });

  openShopButton.addEventListener('click', () => {
    window.dispatchEvent(new CustomEvent('grocer-top-action', {
      detail: { action: 'open' }
    }));
  });
})();
