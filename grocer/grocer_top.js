(() => {
  'use strict';

  let state = window.GrocerState.load();

  const render = () => {
    document.getElementById('dayLabel').textContent = state.day + '日目';
    document.getElementById('moneyLabel').textContent = state.money + 'G';
  };

  render();

  document.getElementById('stockButton').addEventListener('click', () => {
    location.href = './grocer_stock.html?_nc=' + Date.now();
  });

  document.getElementById('openShopButton').addEventListener('click', () => {
    location.href = './grocer_shop.html?_nc=' + Date.now();
  });

  document.getElementById('inventoryButton').addEventListener('click', () => {
    location.href = './grocer_inventory.html?_nc=' + Date.now();
  });

  document.getElementById('restButton').addEventListener('click', () => {
    state.day += 1;
    state.daySales = 0;
    state = window.GrocerState.save(state);
    render();
  });
})();
