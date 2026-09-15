(() => {
  const nameEl = document.getElementById('animalName');
  const itemDb = window.DDItems;
  if (!nameEl || !itemDb || typeof itemDb.add !== 'function') return;

  const meatByAnimal = {
    '鹿': 'meat_deer',
    'ウサギ': 'meat_rabbit',
    '鳥': 'meat_bird'
  };

  let awarded = false;

  function checkReward() {
    if (awarded) return;
    const text = nameEl.textContent || '';
    if (!text.includes('仕留めた')) return;

    const animalName = Object.keys(meatByAnimal).find(name => text.startsWith(name));
    if (!animalName) return;

    itemDb.add(meatByAnimal[animalName], 1);
    awarded = true;
  }

  const observer = new MutationObserver(checkReward);
  observer.observe(nameEl, { childList: true, subtree: true, characterData: true });
  checkReward();
})();
