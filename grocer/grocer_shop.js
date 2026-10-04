(() => {
  'use strict';
  window.GrocerInventory.buildGrid(document.getElementById('inventoryGrid'));

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
