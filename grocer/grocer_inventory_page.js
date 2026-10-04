(() => {
  'use strict';

  const state = window.GrocerState.load();
  window.GrocerInventory.buildGrid(document.getElementById('inventoryGrid'), { state });

  document.getElementById('backButton').addEventListener('click', () => {
    location.href = './grocer_top.html?_nc=' + Date.now();
  });
})();
