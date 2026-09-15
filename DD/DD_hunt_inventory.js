(() => {
  const nameEl = document.getElementById('animalName');
  const searchTextEl = document.getElementById('searchText');
  const itemDb = window.DDItems;
  if (!nameEl || !itemDb || typeof itemDb.add !== 'function') return;

  const params = new URLSearchParams(location.search);
  const returnUrl = params.get('return') || '';
  const fromPoint = params.get('from') === 'point' && Boolean(returnUrl);

  const meatByAnimal = {
    '鹿': 'meat_deer',
    'ウサギ': 'meat_rabbit',
    '鳥': 'meat_bird'
  };

  let awarded = false;
  let returning = false;

  function hideHuntWindow() {
    const searchWindow = document.getElementById('searchWindow');
    const shootArea = document.getElementById('shootArea');
    const timingWrap = document.getElementById('timingWrap');
    if (searchWindow) searchWindow.style.display = 'none';
    if (shootArea) shootArea.style.display = 'none';
    if (timingWrap) timingWrap.style.display = 'none';
  }

  function returnToDeck(message, delay = 1000) {
    if (!fromPoint || returning) return;
    returning = true;
    hideHuntWindow();

    if (searchTextEl) searchTextEl.textContent = message;
    const result = document.getElementById('result');
    if (result) {
      result.textContent = message;
      result.style.display = 'block';
    }

    setTimeout(() => {
      location.href = returnUrl;
    }, delay);
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

    returnToDeck(`${item?.name || `${animalName}肉`}を手に入れた。`);
  }

  const rewardObserver = new MutationObserver(checkReward);
  rewardObserver.observe(nameEl, { childList: true, subtree: true, characterData: true });
  checkReward();
})();
