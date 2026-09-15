(() => {
  const SESSION_KEY = 'dd_session_map_location_v2';
  const OLD_SESSION_KEY = 'dd_session_map_position_v1';
  const LEGACY_LOCAL_KEY = 'dd_map_position_v1';

  const places = {
    cabin: {
      name: '小屋',
      description: '生活の拠点。休息や料理、保管をする場所。'
    },
    northForest: {
      name: '北の森',
      description: '木の実や枝、蔓などを探しやすい森。',
      harvest: true
    },
    deepForest: {
      name: '深い森',
      description: '木が密集した暗い森。移動に時間がかかる。',
      harvest: true
    },
    plain: {
      name: '開けた平原',
      description: '見通しのよい狩猟地。鹿、ウサギ、鳥を狙える。',
      hunt: true
    },
    river: {
      name: '川辺',
      description: '川沿いの場所。漁はまだ未実装。'
    }
  };

  const travelMinutes = {
    cabin:       { cabin:0, northForest:20, deepForest:40, plain:30, river:40 },
    northForest: { cabin:20, northForest:0, deepForest:20, plain:30, river:45 },
    deepForest:  { cabin:40, northForest:20, deepForest:0, plain:50, river:60 },
    plain:       { cabin:30, northForest:30, deepForest:50, plain:0, river:20 },
    river:       { cabin:40, northForest:45, deepForest:60, plain:20, river:0 }
  };

  const message = document.getElementById('message');
  const locationName = document.getElementById('locationName');
  const locationText = document.getElementById('locationText');
  const moveCost = document.getElementById('moveCost');
  const actions = document.getElementById('actions');
  const dayPhase = document.getElementById('dayPhase');
  const placeButtons = [...document.querySelectorAll('.place[data-place]')];

  function clearOldPersistence() {
    try { localStorage.removeItem(LEGACY_LOCAL_KEY); } catch (_) {}
    try { sessionStorage.removeItem(OLD_SESSION_KEY); } catch (_) {}
  }

  function loadLocation() {
    try {
      const saved = sessionStorage.getItem(SESSION_KEY);
      if (saved && places[saved]) return saved;
    } catch (_) {}
    return 'cabin';
  }

  function syncLocation() {
    try { sessionStorage.setItem(SESSION_KEY, currentLocation); } catch (_) {}
  }

  function timeParts() {
    if (!window.DDTime || typeof DDTime.getState !== 'function') {
      return { day: 1, hour: 7, minute: 0, phase: '朝' };
    }
    return DDTime.getState();
  }

  function compactTime() {
    const state = timeParts();
    return `${String(state.hour).padStart(2, '0')}:${String(state.minute).padStart(2, '0')}`;
  }

  function refreshDayPhase() {
    const state = timeParts();
    if (dayPhase) dayPhase.textContent = `${state.day}日目　${state.phase}`;
  }

  function phaseMessage(newPhase) {
    if (!newPhase || newPhase === lastPhase) return '';
    const texts = {
      朝: '空が明るくなってきた。',
      昼: '日が高くなった。',
      夕方: '日が傾いてきた。',
      夜: '日が沈み、周囲が暗くなった。',
      深夜: '深夜になった。周囲はかなり暗い。'
    };
    lastPhase = newPhase;
    return texts[newPhase] || '';
  }

  function costFromHere(placeId) {
    return Number(travelMinutes[currentLocation]?.[placeId] ?? 0);
  }

  function moveTo(placeId) {
    if (!places[placeId] || placeId === currentLocation) return;

    const minutes = costFromHere(placeId);
    if (minutes > 0 && window.DDTime) {
      DDTime.advance(minutes, `move:${currentLocation}->${placeId}`);
    }

    currentLocation = placeId;
    syncLocation();

    const phaseText = window.DDTime ? phaseMessage(DDTime.phase()) : '';
    message.textContent = phaseText || `${places[placeId].name}へ移動した。${minutes}分経過。`;
    render();
  }

  function makeAction(text, onClick, className = '') {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = `action ${className}`.trim();
    button.textContent = text;
    button.addEventListener('click', onClick);
    actions.appendChild(button);
  }

  function renderActions() {
    const info = places[currentLocation];
    locationName.textContent = info.name;
    moveCost.textContent = '現在地';
    locationText.textContent = info.description;
    actions.innerHTML = '';

    if (currentLocation === 'cabin') {
      makeAction('小屋に入る', () => { location.href = 'DD_top.html'; });
      return;
    }

    if (info.harvest) {
      makeAction('採取する', () => {
        location.href = `DD_forest.html?from=map&place=${encodeURIComponent(currentLocation)}`;
      }, 'harvest');
    }

    if (info.hunt) {
      makeAction('鹿を狩る', () => {
        location.href = 'DD_hunt.html?animal=deer&from=map';
      }, 'hunt');
      makeAction('ウサギを狩る', () => {
        location.href = 'DD_hunt.html?animal=rabbit&from=map';
      }, 'hunt');
      makeAction('鳥を狩る', () => {
        location.href = 'DD_hunt.html?animal=bird&from=map';
      }, 'hunt');
    }
  }

  function renderPlaces() {
    placeButtons.forEach(button => {
      const id = button.dataset.place;
      const here = id === currentLocation;
      const small = button.querySelector('small');
      const clock = button.querySelector('.placeClock');

      button.classList.toggle('current', here);
      if (clock) clock.textContent = here ? compactTime() : '';
      if (small) small.textContent = here ? '現在地' : `移動 ${costFromHere(id)}分`;
      button.disabled = false;
    });
  }

  function render() {
    refreshDayPhase();
    renderPlaces();
    renderActions();
  }

  clearOldPersistence();

  let currentLocation = loadLocation();
  let lastPhase = window.DDTime ? DDTime.phase() : '';

  placeButtons.forEach(button => {
    button.addEventListener('click', () => {
      const id = button.dataset.place;
      if (id === currentLocation) {
        message.textContent = `${places[id].name}にいる。`;
        return;
      }
      moveTo(id);
    });
  });

  if (window.DDTime) {
    window.addEventListener('ddtimechange', render);
  }

  document.addEventListener('contextmenu', e => e.preventDefault());
  document.addEventListener('selectstart', e => e.preventDefault());

  render();
})();
