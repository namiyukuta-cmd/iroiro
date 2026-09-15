(() => {
  const config = window.DDHuntConfig || {};
  const itemDb = window.DDItems || {};
  const equipment = config.equipment || {};
  const rules = config.huntRules || {};
  const animals = Array.isArray(config.animals) && config.animals.length ? config.animals : [
    { id: 'deer', name: '鹿', hp: 3, speed: 1.2 },
    { id: 'rabbit', name: 'ウサギ', hp: 3, speed: 1.8 },
    { id: 'bird', name: '鳥', hp: 1, speed: 2.6 }
  ];

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

  let arrowsLeft = Number(arrowInfo.count || 3);
  let ready = false;
  let pulling = false;
  let engaged = false;
  let pullStart = 0;
  let markerPos = 0;
  let markerDir = 1;
  let markerRaf = 0;
  let pullRaf = 0;
  let currentAnimalIndex = 0;
  let currentHp = 0;
  let swipeStartX = null;
  let encounterTimeCharged = false;

  const hitZoneWidth = Math.max(
    4,
    Math.min(60, Number(bowInfo.hitZoneBonus || 0) + Number(stringInfo.hitZoneBonus || 0))
  );
  const arrowDamage = Math.max(1, Number(arrowInfo.damage || 1));
  const retryHpRatio = Math.max(0, Math.min(1, Number(rules.retryHpRatio ?? 0.5)));

  hitZone.style.width = hitZoneWidth + '%';
  hitZone.style.left = ((100 - hitZoneWidth) / 2) + '%';

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
    if (Number.isFinite(durability) && durability <= 0) return false;
    return true;
  }

  function hasTimeForAnotherHunt() {
    if (!window.DDTime || typeof DDTime.getState !== 'function') return true;

    const state = DDTime.getState();
    const now = Number(state.minuteOfDay);
    const huntCost = Number(DDTime.actionCosts?.hunt || 120);
    const huntingStart = 5 * 60;
    const nightStart = 19 * 60;

    return Number.isFinite(now) && now >= huntingStart && now + huntCost <= nightStart;
  }

  function chargeEncounterTime() {
    if (encounterTimeCharged) return;
    if (window.DDTime) DDTime.advanceAction('hunt');
    encounterTimeCharged = true;
  }

  function canContinueHunt() {
    return arrowsLeft > 0 && bowIsUsable() && hasTimeForAnotherHunt();
  }

  function stopReason() {
    if (arrowsLeft <= 0) return '矢がなくなった。小屋へ帰る。';
    if (!bowIsUsable()) return '弓が壊れている。小屋へ帰る。';
    if (!hasTimeForAnotherHunt()) return 'もう狩りを続ける時間がない。小屋へ帰る。';
    return '小屋へ帰る。';
  }

  function setAnimalImage(data) {
    const imagePath = data.image || '';
    const fallbackGlyph = glyphFor(data.id);

    animalGlyph.textContent = fallbackGlyph;
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

  function updateAnimalDisplay(resetHp = true) {
    const data = currentAnimal();
    if (resetHp) currentHp = Number(data.hp || 1);

    animal.className = '';
    setAnimalImage(data);
    animalName.textContent = data.name || '獲物';
    searchText.textContent = `${data.name || '獲物'}　HP ${currentHp}/${data.hp || 1}` +
      `${engaged ? '' : '　←→ スワイプで変更'}`;
  }

  function flashHit() {
    animal.classList.remove('hit');
    void animal.offsetWidth;
    animal.classList.add('hit');
    setTimeout(() => animal.classList.remove('hit'), 280);
  }

  function show(text) {
    result.textContent = text;
    result.style.display = 'block';
    clearTimeout(show.t);
    show.t = setTimeout(() => result.style.display = 'none', 1200);
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
      step++;
      if (step < moves) {
        setTimeout(next, 560);
        return;
      }
      setTimeout(revealAnimal, 600);
    }

    setTimeout(next, 300);
  }

  function startSearch() {
    if (!hasTimeForAnotherHunt()) {
      endHuntAndReturn(stopReason());
      return;
    }
    if (arrowsLeft <= 0 || !bowIsUsable()) {
      endHuntAndReturn(stopReason());
      return;
    }

    ready = false;
    pulling = false;
    engaged = false;
    encounterTimeCharged = false;
    shootArea.style.display = 'none';
    timingWrap.style.display = 'none';
    animal.style.display = 'none';
    animal.className = '';
    searchText.textContent = '獲物を探している…';
    moveSearchWindow();
  }

  function revealAnimal() {
    currentAnimalIndex = Math.floor(Math.random() * animals.length);
    currentHp = Number(currentAnimal().hp || 1);
    updateAnimalDisplay(false);
    animal.style.display = 'block';
    animal.style.opacity = '1';
    animal.style.transform = 'translate(-50%,-50%)';
    timingWrap.style.display = 'block';
    shootArea.style.display = 'block';
    guide.textContent = '長押しで弓を引く　狙った位置で離す';
    ready = true;
  }

  function switchAnimal(direction) {
    if (!ready || pulling || engaged || animals.length < 2) return;

    ready = false;
    animal.style.opacity = '0';
    animal.style.transform = `translate(${direction > 0 ? 80 : -180}%,-50%)`;

    setTimeout(() => {
      currentAnimalIndex = (currentAnimalIndex + direction + animals.length) % animals.length;
      currentHp = Number(currentAnimal().hp || 1);
      updateAnimalDisplay(false);
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
    }
    if (markerPos <= 0) {
      markerPos = 0;
      markerDir = 1;
    }
    marker.style.left = `calc(${markerPos}% - 2px)`;
    markerRaf = requestAnimationFrame(animateMarker);
  }

  function animatePull() {
    if (!pulling) return;
    const elapsed = performance.now() - pullStart;
    const pullPx = Math.min(48, elapsed / 22);
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
    updateAnimalDisplay(false);
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

  function endHuntAndReturn(message) {
    ready = false;
    if (window.DDTime) DDTime.advanceAction('returnHome');
    show(message);
    timingWrap.style.display = 'none';
    animal.style.opacity = '0';
    animal.style.transform = 'translate(120%,-50%)';
    shootArea.style.display = 'none';
    searchText.textContent = message;
    setTimeout(() => { location.href = 'DD_top.html'; }, 1200);
  }

  function searchAgain(message) {
    ready = false;
    timingWrap.style.display = 'none';
    shootArea.style.display = 'none';
    animal.style.opacity = '0';
    animal.style.transform = 'translate(120%,-50%)';

    if (!canContinueHunt()) {
      setTimeout(() => endHuntAndReturn(stopReason()), 300);
      return;
    }

    show(`${message}　次の獲物を探す`);
    searchText.textContent = `${message}　次の獲物を探す…`;
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
      searchAgain('外れ　逃げた');
      return;
    }

    currentHp = Math.max(0, currentHp - arrowDamage);
    flashHit();

    if (currentHp <= 0) {
      ready = false;
      timingWrap.style.display = 'none';
      shootArea.style.display = 'none';
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

    const canRetrySameAnimal = currentHp <= Number(data.hp || 1) * retryHpRatio && arrowsLeft > 0 && bowIsUsable();
    if (canRetrySameAnimal) {
      show(`命中 -${arrowDamage}　もう1射できる`);
      setTimeout(() => updateAnimalDisplay(false), 280);
      ready = true;
      return;
    }

    chargeEncounterTime();
    setTimeout(() => searchAgain(`命中 -${arrowDamage}　逃げた`), 260);
  }

  searchWindow.addEventListener('pointerdown', e => {
    if (!ready || pulling || engaged) return;
    swipeStartX = e.clientX;
  });

  searchWindow.addEventListener('pointerup', e => {
    if (swipeStartX === null || !ready || pulling || engaged) return;
    const dx = e.clientX - swipeStartX;
    swipeStartX = null;
    if (Math.abs(dx) < 45) return;
    switchAnimal(dx < 0 ? 1 : -1);
  });

  searchWindow.addEventListener('pointercancel', () => {
    swipeStartX = null;
  });

  if (backHome) {
    backHome.addEventListener('click', () => {
      if (window.DDTime) DDTime.advanceAction('returnHome');
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
