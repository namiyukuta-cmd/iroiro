(() => {
  'use strict';

  const stockList = document.getElementById('stockList');
  const reservationList = document.getElementById('reservationList');
  const inventoryGrid = document.getElementById('inventoryGrid');
  const totalEl = document.getElementById('stockTotal');
  const moneyEl = document.getElementById('stockMoney');
  const buyButton = document.getElementById('buyButton');

  let state = window.GrocerState.load();
  const cart = new Map();

  function total() {
    let value = 0;
    cart.forEach((count, id) => {
      const meta = window.GrocerState.item(id);
      if (meta) value += meta.buy * count;
    });
    return value;
  }

  function renderStock() {
    stockList.textContent = '';
    window.GrocerState.catalog.forEach(meta => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'stock-item';
      button.innerHTML = '<span>' + meta.name + '</span><strong>' + meta.buy + 'G</strong>';
      button.addEventListener('click', () => {
        cart.set(meta.id, (cart.get(meta.id) || 0) + 1);
        render();
      });
      stockList.appendChild(button);
    });
  }

  function renderReservation() {
    reservationList.textContent = '';
    if (!cart.size) {
      reservationList.textContent = 'なし';
      return;
    }

    cart.forEach((count, id) => {
      const meta = window.GrocerState.item(id);
      if (!meta) return;
      const row = document.createElement('button');
      row.type = 'button';
      row.className = 'reservation-item';
      row.textContent = meta.name + ' ×' + count;
      row.addEventListener('click', () => {
        if (count <= 1) cart.delete(id);
        else cart.set(id, count - 1);
        render();
      });
      reservationList.appendChild(row);
    });
  }

  function render() {
    moneyEl.textContent = state.money + 'G';
    totalEl.textContent = total() + 'G';
    buyButton.disabled = cart.size === 0;
    renderReservation();
    window.GrocerInventory.buildGrid(inventoryGrid, { state });
  }

  renderStock();
  render();

  document.getElementById('backButton').addEventListener('click', () => {
    location.href = './grocer_top.html?_nc=' + Date.now();
  });

  buyButton.addEventListener('click', () => {
    const price = total();
    if (!price || price > state.money) {
      buyButton.textContent = 'G不足';
      setTimeout(() => { buyButton.textContent = '買うOK'; }, 700);
      return;
    }

    state.money -= price;
    cart.forEach((count, id) => {
      state = window.GrocerState.add(state, id, count);
    });
    state = window.GrocerState.save(state);
    cart.clear();
    render();
  });
})();
