(() => {
  'use strict';

  const stockButton = document.getElementById('shopStockButton');
  const openButton = document.getElementById('shopOpenButton');

  stockButton?.addEventListener('click', () => {
    window.dispatchEvent(new CustomEvent('shop-home-action', {
      detail: { action: 'stock' }
    }));
  });

  openButton?.addEventListener('click', () => {
    window.dispatchEvent(new CustomEvent('shop-home-action', {
      detail: { action: 'open' }
    }));
  });
})();
