(() => {
  'use strict';
  window.GrocerInventory.buildGrid(document.getElementById('inventoryGrid'));

  document.getElementById('backButton').addEventListener('click', () => {
    location.href = './grocer_top.html?_nc=' + Date.now();
  });

  document.getElementById('buyButton').addEventListener('click', () => {
    window.dispatchEvent(new CustomEvent('grocer-stock-buy'));
  });
})();
