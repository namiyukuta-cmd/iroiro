(() => {
  'use strict';

  const stockButton = document.getElementById('stockButton');
  const openShopButton = document.getElementById('openShopButton');

  stockButton.addEventListener('click', () => {
    window.dispatchEvent(new CustomEvent('shop-top-action', {
      detail: { action: 'stock' }
    }));
  });

  openShopButton.addEventListener('click', () => {
    window.dispatchEvent(new CustomEvent('shop-top-action', {
      detail: { action: 'open' }
    }));
  });
})();
