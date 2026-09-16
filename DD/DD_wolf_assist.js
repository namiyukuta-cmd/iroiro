(() => {
  function adult() {
    return window.DDWolf?.stage?.() === 'adult';
  }

  function baseHp(animal) {
    return Math.max(1, Number(animal?._wolfAssistBaseHp ?? animal?.hp ?? 1));
  }

  function canCoverMiss(animalId) {
    return adult() && (animalId === 'bird' || animalId === 'rabbit');
  }

  function canFinishHunt(animalId, currentHp, maxHp) {
    if (!adult()) return false;
    if (animalId === 'bird' || animalId === 'rabbit') return true;
    if (animalId !== 'deer') return false;
    const max = Math.max(1, Number(maxHp || 1));
    return Number(currentHp) <= max / 2;
  }

  window.DDWolfAssist = {
    adult,
    canCoverMiss,
    canFinishHunt
  };

  if (!/DD_point\.html$/i.test(location.pathname)) return;
  if (!window.DDItems || !window.DDHuntConfig || !window.DDPointConfig) return;

  const params = new URLSearchParams(location.search);
  const zoneId = params.get('zone') || 'forest';
  const zoneConfig = DDPointConfig.zones?.[zoneId] || null;
  const animals = Array.isArray(DDHuntConfig.animals) ? DDHuntConfig.animals : [];
  const originalAdd = DDItems.add.bind(DDItems);
  const originalRemove = DDItems.remove.bind(DDItems);
  let internalAdd = false;
  let pendingResultMessage = '';
  let fishAssistHandled = false;

  animals.forEach(animal => {
    if (!Number.isFinite(Number(animal._wolfAssistBaseHp))) {
      animal._wolfAssistBaseHp = Math.max(1, Number(animal.hp || 1));
    }
  });

  function applyAutoHuntThresholds() {
    animals.forEach(animal => {
      const hp = baseHp(animal);
      if (!adult()) {
        animal.hp = hp;
      } else if (animal.id === 'bird' || animal.id === 'rabbit') {
        animal.hp = 1;
      } else if (animal.id === 'deer') {
        animal.hp = Math.ceil(hp / 2);
      } else {
        animal.hp = hp;
      }
    });
  }

  function drawnIsVisible() {
    const drawn = document.getElementById('drawn');
    return Boolean(drawn && drawn.style.display !== 'none');
  }

  function currentPointCard() {
    if (!zoneConfig || !drawnIsVisible()) return null;
    const title = document.getElementById('cardTitle')?.textContent || '';
    if (!title) return null;
    return (zoneConfig.cards || []).find(card => card.title === title) || null;
  }

  function currentAnimalFromCard(card) {
    if (!card || card.type !== 'hunt') return null;
    return animals.find(animal => animal.id === card.animalId) || null;
  }

  function itemName(id) {
    return DDItems.get?.(id)?.name || id;
  }

  function pickRandom(list) {
    if (!Array.isArray(list) || !list.length) return null;
    return list[Math.floor(Math.random() * list.length)] || null;
  }

  function setPendingResult(message) {
    pendingResultMessage = message || '';
  }

  DDItems.add = function(id, amount = 1) {
    const card = currentPointCard();
    const gatherByHero = !internalAdd && adult() && card?.type === 'item' && card.itemId === id && Number(amount) > 0;
    const result = originalAdd(id, amount);

    if (gatherByHero) {
      const wolfDraw = pickRandom(zoneConfig?.cards || []);
      if (wolfDraw?.type === 'item' && wolfDraw.itemId) {
        internalAdd = true;
        originalAdd(wolfDraw.itemId, 1);
        internalAdd = false;
        setPendingResult(`${itemName(id)}を1個、手に入れた。狼（？）は別に${itemName(wolfDraw.itemId)}を1個見つけた。`);
      } else {
        setPendingResult(`${itemName(id)}を1個、手に入れた。狼（？）も別に周囲を探したが、何も見つけなかった。`);
      }
    }

    return result;
  };

  DDItems.remove = function(id, amount = 1) {
    const card = currentPointCard();
    const animal = currentAnimalFromCard(card);
    const item = DDItems.get?.(id);
    const isAutoHuntArrow = adult() && animal && item?.kind === 'arrow' && Number(amount) > 0;
    const meatId = animal?.meatItemId || '';
    const beforeMeat = meatId ? Number(DDItems.count?.(meatId) || 0) : 0;
    const arrowDamage = Math.max(1, Number(item?.damage || DDHuntConfig.equipment?.arrows?.damage || 1));
    const maxHp = animal ? baseHp(animal) : 1;
    const result = originalRemove(id, amount);

    if (isAutoHuntArrow && meatId) {
      queueMicrotask(() => {
        const afterMeat = Number(DDItems.count?.(meatId) || 0);
        const heroSucceeded = afterMeat > beforeMeat;

        if (animal.id === 'bird' || animal.id === 'rabbit') {
          if (!heroSucceeded) {
            internalAdd = true;
            originalAdd(meatId, 1);
            internalAdd = false;
            setPendingResult(`主人公の狩りは失敗したが、狼（？）が${animal.name}を仕留めた。${itemName(meatId)}を手に入れた。`);
          } else if (arrowDamage < maxHp) {
            setPendingResult(`主人公が傷を負わせ、狼（？）が${animal.name}を仕留めた。${itemName(meatId)}を手に入れた。`);
          }
          return;
        }

        if (animal.id === 'deer' && heroSucceeded && arrowDamage < maxHp) {
          setPendingResult(`鹿の体力が半分以下になり、狼（？）がとどめを刺した。${itemName(meatId)}を手に入れた。`);
        }
      });
    }

    return result;
  };

  function installResultObserver() {
    const resultEl = document.getElementById('result');
    const eventTextEl = document.getElementById('eventText');
    if (!resultEl) return;

    const observer = new MutationObserver(() => {
      const text = resultEl.textContent || '';

      if (pendingResultMessage && text) {
        const message = pendingResultMessage;
        pendingResultMessage = '';
        resultEl.textContent = message;
        if (eventTextEl) eventTextEl.textContent = message;
        return;
      }

      if (adult() && text.includes('魚は逃げた') && !fishAssistHandled) {
        fishAssistHandled = true;
        internalAdd = true;
        originalAdd('river_fish', 1);
        internalAdd = false;
        const message = '主人公は魚を逃したが、狼（？）が追って川魚を1匹捕まえた。';
        resultEl.textContent = message;
        if (eventTextEl) eventTextEl.textContent = message;
        return;
      }

      if (!text.includes('魚は逃げた')) fishAssistHandled = false;
    });

    observer.observe(resultEl, { childList: true, subtree: true, characterData: true });
  }

  applyAutoHuntThresholds();
  installResultObserver();
  window.addEventListener('ddwolfchange', applyAutoHuntThresholds);
  window.addEventListener('ddtimechange', applyAutoHuntThresholds);
})();
