(() => {
  const nameEl = document.getElementById('animalName');
  const itemDb = window.DDItems;
  if (!nameEl || !itemDb || typeof itemDb.add !== 'function') return;

  const params = new URLSearchParams(location.search);
  const fromPoint = params.get('from') === 'point';
  const returnUrl = params.get('return') || 'DD_map.html';

  const meatByAnimal = {
    '鹿': 'meat_deer',
    'ウサギ': 'meat_rabbit',
    '鳥': 'meat_bird'
  };

  let awarded = false;

  function finishPointHunt(itemName) {
    if (!fromPoint) return;

    const searchWindow = document.getElementById('searchWindow');
    const shootArea = document.getElementById('shootArea');
    const timingWrap = document.getElementById('timingWrap');
    const searchText = document.getElementById('searchText');
    const result = document.getElementById('result');

    if (searchWindow) searchWindow.style.display = 'none';
    if (shootArea) shootArea.style.display = 'none';
    if (timingWrap) timingWrap.style.display = 'none';
    if (searchText) searchText.textContent = `${itemName}を手に入れた。`;
    if (result) {
      result.textContent = `${itemName}を手に入れた。`;
      result.style.display = 'block';
    }

    setTimeout(() => {
      location.href = returnUrl;
    }, 1000);
  }

  function checkReward() {
    if (awarded) return;
    const text = nameEl.textContent || '';
    if (!text.includes('仕留めた')) return;

    const animalName = Object.keys(meatByAnimal).find(name => text.startsWith(name));
    if (!animalName) return;

    const itemId = meatByAnimal[animalName];
    const item = itemDb.get?.(itemId);
    itemDb.add(itemId, 1);
    awarded = true;

    finishPointHunt(item?.name || `${animalName}肉`);
  }

  const observer = new MutationObserver(checkReward);
  observer.observe(nameEl, { childList: true, subtree: true, characterData: true });
  checkReward();
})();
