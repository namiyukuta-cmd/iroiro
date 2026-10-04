(() => {
  'use strict';
  window.GrocerInventory.buildGrid(document.getElementById('inventoryGrid'));

  document.getElementById('stockButton').addEventListener('click', () => {
    location.href = './grocer_stock.html?_nc=' + Date.now();
  });

  document.getElementById('openShopButton').addEventListener('click', () => {
    location.href = './grocer_shop.html?_nc=' + Date.now();
  });
})();
