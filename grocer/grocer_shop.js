(() => {
  'use strict';

  const customerPanel = document.getElementById('customerPanel');
  const reservationBox = document.getElementById('reservationBox');
  const inventoryGrid = document.getElementById('inventoryGrid');
  const daySalesEl = document.getElementById('daySales');
  const moneyEl = document.getElementById('shopMoney');

  let state = window.GrocerState.load();
  let requestId = null;

  function chooseRequest() {
    const available = state.inventory.filter(row => row.count > 0);
    if (!available.length) {
      requestId = null;
      customerPanel.innerHTML = '<div class="customer-empty">売れる商品がありません</div>';
      return;
    }
    requestId = available[Math.floor(Math.random() * available.length)].id;
    const meta = window.GrocerState.item(requestId);
    customerPanel.innerHTML =
      '<div class="customer-card">' +
      '<div class="customer-face">客</div>' +
      '<div class="customer-request">' +
      '<strong>' + meta.name + '</strong><span>×1</span><small>' + meta.sell + 'G</small>' +
      '</div></div>';
  }

  function render() {
    daySalesEl.textContent = state.daySales + 'G';
    moneyEl.textContent = state.money + 'G';
    reservationBox.textContent = 'なし';

    window.GrocerInventory.buildGrid(inventoryGrid, {
      state,
      onItemClick(id) {
        if (!requestId || id !== requestId) return;

        const meta = window.GrocerState.item(id);
        if (!meta || window.GrocerState.getCount(state, id) < 1) return;

        state = window.GrocerState.add(state, id, -1);
        state.money += meta.sell;
        state.daySales += meta.sell;
        state = window.GrocerState.save(state);

        chooseRequest();
        render();
      }
    });
  }

  chooseRequest();
  render();

  document.getElementById('backButton').addEventListener('click', () => {
    location.href = './grocer_top.html?_nc=' + Date.now();
  });

  document.getElementById('replyButton').addEventListener('click', () => {
    window.dispatchEvent(new CustomEvent('grocer-shop-conversation', { detail: { reply: true } }));
  });

  document.getElementById('skipButton').addEventListener('click', () => {
    window.dispatchEvent(new CustomEvent('grocer-shop-conversation', { detail: { reply: false } }));
  });
})();
