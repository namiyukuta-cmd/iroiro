(() => {
  const config = window.DDHuntConfig || {};
  const itemDb = window.DDItems || {};
  const equipment = config.equipment || {};
  const rules = config.huntRules || {};
  const animals = Array.isArray(config.animals) && config.animals.length
    ? config.animals
    : [
        { id: 'deer', name: '鹿', hp: 3, speed: 1.2 },
        { id: 'rabbit', name: 'ウサギ', hp: 3, speed: 1.8 },
        { id: 'bird', name: '鳥', hp: 1, speed: 2.6 }
      ];

  const params = new URLSearchParams(location.search);
  const source = params.get('from') || '';
  const fromMap = source === 'map';
  const fromPoint = source === 'point';
  const returnUrl = params.get('return') || '';
  const requestedAnimalId = params.get('animal') || '';
  const requestedAnimalIndex = animals.findIndex(entry => entry.id === requestedAnimalId);
  const fixedAnimalMode = (fromMap || fromPoint) && requestedAnimalIndex >= 0;

  const bowInfo = equipment.bow || {};
  const stringInfo = equipment.bowstring || {};
  const arrowInfo = equipment.arrows || {};

  const stats = document.getElementById('stats');
  const searchWindow = document.getElementById('searchWindow');
  const animal = document.getElementById('animal');
  const animalImage = document.getElementById('animalImage');
  const animalGlyph = document.getElementById('animalGlyph');
  const animalName = document.getElementById('animalName');
  const searchText = document.getElementById('searchText');
  const shootArea = document.getElementById('shootArea');
  const game = document.getElementById('game');
  const bowString = document.getElementById('string');
  const arrow = document.getElementById('arrow');
  const marker = document.getElementById('timingMarker');
  const hitZone = document.getElementById('hitZone');
  const timingWrap = document.getElementById('timingWrap');
  const result = document.getElementById('result');
  const guide = document.getElementById('guide');
  const backHome = document.getElementById('backHome');

  let arrowsLeft = Math.max(0, Number(arrowInfo.count || 3));
  let ready = false;
  let pulling = false;
  let engaged = false;
  let pullStart = 0;
  let markerPos = 0;
  let markerDir = 1;
  let markerRaf = 0;
  let pullRaf = 0;
  let currentAnimalIndex = fixedAnimalMode ? requestedAnimalIndex : 0;
  let currentHp = 0;
  let swipeStartX = null;
  let encounterTimeCharged = false;

  const hitZoneWidth = Math.max(
    4,
    Math.min(60, Number(bowInfo.hitZoneBonus || 0) + Number(stringInfo.hitZoneBonus || 0))
  );
  const arrowDamage = Math.max(1, Number(arrowInfo.damage || 1));
  const retryHpRatio = Math.max(0, Math.min(1, Number(rules.retryHpRatio ?? 0.5)));

  hitZone.style.width = `${hitZoneWidth}%`;
  hitZone.style.left = `${(100 - hitZoneWidth) / 2}%`;

  function returnTarget() {
    if (fromPoint && returnUrl) return returnUrl;
    if (fromMap) return 'DD_map.html';
    return 'DD_top.html';
  }

  if (backHome) {
    backHome.href = returnTarget();
    if (fromPoint) backHome.textContent = '← 山札へ';
    else if (fromMap) backHome.textContent = '← マップへ';
  }

  function currentAnimal() {
    return animals[currentAnimalIndex] || animals[0];
  }

  function glyphFor(id) {
    return id === 'deer' ? '🦌' : id === 'rabbit' ? '🐇' : '🐦';
  }

  function updateStats() {
    stats.innerHTML = `${bowInfo.name || '弓'}：${bowInfo.description || ''}<br>` +
      `${stringInfo.name || '弓弦'}：${stringInfo.description || ''}<br>` +
      `${arrowInfo.name || '矢'}：残り ${arrowsLeft}本`;
  }

  function bowIsUsable() {
    if (bowInfo.broken === true) return false;
    const durability = Number(bowInfo.durability);
    return !Number.isFinite(durability) || durability > 0;
  }

  function hasTimeForAnotherHunt() {
    if (!window.DDTime?.getState) return true;
    const state = DDTime.getState();
    const now = Number(state.minuteOfDay);
    const huntCost = Number(DDTime.actionCosts?.hunt || 120);
    const huntingStart = 5 * 60;
    const nightStart = 19 * 60;
    return Number.isFinite(now) && now >= huntingStart && now + huntCost <= nightStart;
  }

  function stopReason() {
    const destination = fromPoint ? '山札へ戻る。' : fromMap ? 'マップへ戻る。' : '小屋へ帰る。';
    if (arrowsLeft <= 0) return `矢がなくなった。${destination}`;
    if (!bowIsUsable()) return `弓が壊れている。${destination}`;
    if (!hasTimeForAnotherHunt()) return `もう狩りを続ける時間がない。${destination}`;
    return destination;
  }

  function chargeEncounterTime() {
    if (encounterTimeCharged) return;
    DDTime?.advanceAction?.('hunt');
    encounterTimeCharged = true;
  }

  function setAnimalImage(data) {
    const imagePath = data.image || '';
    animalGlyph.textContent = glyphFor(data.id);
    animalGlyph.style.display = 'none';
    animalImage.style.display = 'none';
    animalImage.removeAttribute('src');

    if (!imagePath) {
      animalGlyph.style.display = 'block';
      return;
    }

    animalImage.onload = () => {
      animalImage.style.display = 'block';
      animalGlyph.style.display = 'none';
    };
    animalImage.onerror = () => {
      animalImage.style.display = 'none';
      animalGlyph.style.display = 'block';
    };
    animalImage.style.objectPosition = data.imagePosition || '50% 50%';
    animalImage.style.setProperty('--animal-image-scale', String(data.imageScale || 1));
    animalImage.src = imagePath;
  }

  function updateAnimalDisplay() {
    const data = currentAnimal();
    animal.className = '';
    setAnimalImage(data);
    animalName.textContent = data.name || '獲物';
    searchText.textContent = `${data.name || '獲物'}　HP ${currentHp}/${data.hp || 1}` +
      `${!fixedAnimalMode && !engaged ? '　←→ スワイプで変更' : ''}`;
  }

  function show(text, duration = 1200) {
    result.textContent = text;
    result.style.display = 'block';
    clearTimeout(show.t);
    show.t = setTimeout(() => { result.style.display = 'none'; }, duration);
  }

  function hideCombatUi() {
    timingWrap.style.display = 'none';
    shootArea.style.display = 'none';
  }

  function prepareEncounter() {
    ready = false;
    pulling = false;
    engaged = false;
    encounterTimeCharged = false;
    hideCombatUi();
    animal.style.display = 'none';
    animal.className = '';
  }

  function revealAnimal(fixed) {
    if (!fixed) currentAnimalIndex = Math.floor(Math.random() * animals.length);
    currentHp = Number(currentAnimal().hp || 1);
    updateAnimalDisplay();
    animal.style.display = 'block';
    animal.style.opacity = '1';
    animal.style.transform = 'translate(-50%,-50%)';
    timingWrap.style.display = 'block';
    shootArea.style.display = 'block';
    guide.textContent = '長押しで弓を引く　狙った位置で離す';
    ready = true;
  }

  function moveSearchWindow() {
    const positions = [
      { left: '6%', top: '18%' },
      { left: '30%', top: '25%' },
      { left: '11%', top: '34%' },
      { left: '28%', top: '15%' },
      { left: '18%', top: '28%' }
    ];
    const moves = 2 + Math.floor(Math.random() * 2);
    let step = 0;

    function next() {
      const p = positions[Math.floor(Math.random() * positions.length)];
      searchWindow.style.left = p.left;
      searchWindow.style.top = p.top;
      step += 1;
      if (step < moves) {
        setTimeout(next, 560);
        return;
      }
      setTimeout(() => revealAnimal(false), 600);
    }

    setTimeout(next, 300);
  }

  function endHuntAndReturn(message, delay = 900) {
    ready = false;
    hideCombatUi();
    animal.style.opacity = '0';
    animal.style.transform = 'translate(120%,-50%)';
    searchText.textContent = message;
    show(message, delay);
    if (!fromMap && !fromPoint) DDTime?.advanceAction?.('returnHome');
    setTimeout(() => { location.href = returnTarget(); }, delay);
  }

  function startSearch() {
    if (!hasTimeForAnotherHunt() || arrowsLeft <= 0 || !bowIsUsable()) {
      endHuntAndReturn(stopReason());
      return;
    }

    prepareEncounter();

    if (fixedAnimalMode) {
      currentAnimalIndex = requestedAnimalIndex;
      searchText.textContent = `${currentAnimal().name}を狙う。`;
      revealAnimal(true);
      return;
    }

    searchText.textContent = '獲物を探している…';
    moveSearchWindow();
  }

  function switchAnimal(direction) {
    if (fixedAnimalMode || !ready || pulling || engaged || animals.length < 2) return;
    ready = false;
    animal.style.opacity = '0';
    animal.style.transform = `translate(${direction > 0 ? 80 : -180}%,-50%)`;

    setTimeout(() => {
      currentAnimalIndex = (currentAnimalIndex + direction + animals.length) % animals.length;
      currentHp = Number(currentAnimal().hp || 1);
      updateAnimalDisplay();
      animal.style.transition = 'none';
      animal.style.transform = `translate(${direction > 0 ? -180 : 80}%,-50%)`;
      animal.offsetHeight;
      animal.style.transition = 'transform .22s ease,opacity .22s ease';
      animal.style.opacity = '1';
      animal.style.transform = 'translate(-50%,-50%)';
      setTimeout(() => { ready = true; }, 220);
    }, 180);
  }

  function animateMarker() {
    const speed = Math.max(.2, Number(currentAnimal().speed || 1.8));
    markerPos += markerDir * speed;
    if (markerPos >= 100) {
      markerPos = 100;
      markerDir = -1;
    } else if (markerPos <= 0) {
      markerPos = 0;
      markerDir = 1;
    }
    marker.style.left = `calc(${markerPos}% - 2px)`;
    markerRaf = requestAnimationFrame(animateMarker);
  }

  function animatePull() {
    if (!pulling) return;
    const pullPx = Math.min(48, (performance.now() - pullStart) / 22);
    bowString.style.transform = `translate(${-pullPx}px,-50%)`;
    arrow.style.transform = `translate(${-pullPx}px,-50%)`;
    pullRaf = requestAnimationFrame(animatePull);
  }

  function begin(e) {
    if (!ready || pulling || arrowsLeft <= 0 || !bowIsUsable()) return;
    if (!shootArea.contains(e.target)) return;
    e.preventDefault();
    pulling = true;
    engaged = true;
    updateAnimalDisplay();
    pullStart = performance.now();
    markerPos = 0;
    markerDir = 1;
    cancelAnimationFrame(markerRaf);
    cancelAnimationFrame(pullRaf);
    markerRaf = requestAnimationFrame(animateMarker);
    pullRaf = requestAnimationFrame(animatePull);
  }

  function resetBow() {
    bowString.style.transform = 'translateY(-50%)';
    arrow.style.transform = 'translateY(-50%)';
  }

  function flashHit() {
    animal.classList.remove('hit');
    void animal.offsetWidth;
    animal.classList.add('hit');
    setTimeout(() => animal.classList.remove('hit'), 280);
  }

  function escapeAfterMiss(message) {
    ready = false;
    hideCombatUi();
    animal.style.opacity = '0';
    animal.style.transform = 'translate(120%,-50%)';

    if (fromMap || fromPoint) {
      const text = `${message}　獲物は逃げた。`;
      searchText.textContent = text;
      show(text, 850);
      setTimeout(() => { location.href = returnTarget(); }, 850);
      return;
    }

    if (arrowsLeft <= 0 || !bowIsUsable() || !hasTimeForAnotherHunt()) {
      setTimeout(() => endHuntAndReturn(stopReason()), 250);
      return;
    }

    searchText.textContent = `${message}　次の獲物を探す…`;
    show(`${message}　次の獲物を探す`, 900);
    setTimeout(startSearch, 900);
  }

  function killMessage(data) {
    const item = data.meatItemId && typeof itemDb.get === 'function'
      ? itemDb.get(data.meatItemId)
      : null;
    return item ? `${data.name}を仕留めた　${item.name}` : `${data.name}を仕留めた`;
  }

  function release(e) {
    if (!pulling) return;
    e.preventDefault();
    pulling = false;
    cancelAnimationFrame(markerRaf);
    cancelAnimationFrame(pullRaf);
    arrowsLeft = Math.max(0, arrowsLeft - 1);
    updateStats();

    const data = currentAnimal();
    const min = (100 - hitZoneWidth) / 2;
    const max = min + hitZoneWidth;
    const hit = markerPos >= min && markerPos <= max;
    resetBow();

    if (!hit) {
      chargeEncounterTime();
      escapeAfterMiss('外れ');
      return;
    }

    currentHp = Math.max(0, currentHp - arrowDamage);
    flashHit();

    if (currentHp <= 0) {
      ready = false;
      hideCombatUi();
      chargeEncounterTime();
      setTimeout(() => {
        animal.classList.remove('hit');
        animal.classList.add('dead');
        animalName.textContent = `${data.name}　仕留めた`;
        const message = killMessage(data);
        searchText.textContent = message;
        show(message);
      }, 220);
      return;
    }

    const canRetry = currentHp <= Number(data.hp || 1) * retryHpRatio && arrowsLeft > 0 && bowIsUsable();
    if (canRetry) {
      show(`命中 -${arrowDamage}　もう1射できる`);
      setTimeout(updateAnimalDisplay, 280);
      ready = true;
      return;
    }

    chargeEncounterTime();
    setTimeout(() => escapeAfterMiss(`命中 -${arrowDamage}`), 260);
  }

  searchWindow.addEventListener('pointerdown', e => {
    if (fixedAnimalMode || !ready || pulling || engaged) return;
    swipeStartX = e.clientX;
  });

  searchWindow.addEventListener('pointerup', e => {
    if (fixedAnimalMode || swipeStartX === null || !ready || pulling || engaged) return;
    const dx = e.clientX - swipeStartX;
    swipeStartX = null;
    if (Math.abs(dx) >= 45) switchAnimal(dx < 0 ? 1 : -1);
  });

  searchWindow.addEventListener('pointercancel', () => { swipeStartX = null; });

  if (backHome) {
    backHome.addEventListener('click', () => {
      if (!fromMap && !fromPoint) DDTime?.advanceAction?.('returnHome');
    });
  }

  document.addEventListener('contextmenu', e => e.preventDefault());
  document.addEventListener('selectstart', e => e.preventDefault());

  updateStats();
  game.addEventListener('pointerdown', begin, { passive: false });
  game.addEventListener('pointerup', release, { passive: false });
  game.addEventListener('pointercancel', release, { passive: false });
  startSearch();
})();
