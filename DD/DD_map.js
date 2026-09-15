(() => {
  const STORAGE_KEY = 'dd_map_position_v1';
  const SIZE = 7;

  const terrainInfo = {
    forest: { name: '森', moveMinutes: 20, className: 'forest', description: '木々の多い森。' },
    deepForest: { name: '深い森', moveMinutes: 30, className: 'deepForest', description: '木が密集して歩きにくい。' },
    plain: { name: '平原', moveMinutes: 10, className: 'plain', description: '見通しのよい開けた土地。' },
    river: { name: '川辺', moveMinutes: 15, className: 'river', description: '川沿い。漁はまだ未実装。' },
    cabin: { name: '小屋', moveMinutes: 20, className: 'cabin', description: '生活の拠点。' }
  };

  // 7×7。x=横、y=縦。
  const terrain = [
    ['deepForest','deepForest','forest','plain','plain','river','river'],
    ['deepForest','forest','forest','plain','river','river','river'],
    ['forest','forest','forest','forest','plain','river','river'],
    ['forest','forest','cabin','forest','plain','plain','river'],
    ['forest','forest','forest','plain','plain','plain','river'],
    ['forest','forest','plain','plain','forest','river','river'],
    ['deepForest','forest','forest','forest','forest','river','river']
  ];

  const points = {
    '4,1': { type: 'animal', animalId: 'deer', label: '鹿', icon: '🦌' },
    '5,4': { type: 'animal', animalId: 'rabbit', label: 'ウサギ', icon: '🐇' },
    '1,5': { type: 'animal', animalId: 'bird', label: '鳥', icon: '🐦' },
    '0,2': { type: 'harvest', label: '採取場所', icon: '✦' },
    '3,2': { type: 'harvest', label: '採取場所', icon: '✦' },
    '4,6': { type: 'harvest', label: '採取場所', icon: '✦' }
  };

  const board = document.getElementById('board');
  const message = document.getElementById('message');
  const locationName = document.getElementById('locationName');
  const locationText = document.getElementById('locationText');
  const moveCost = document.getElementById('moveCost');
  const actions = document.getElementById('actions');

  function loadPosition() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
      if (saved && Number.isInteger(saved.x) && Number.isInteger(saved.y) && inBounds(saved.x, saved.y)) {
        return saved;
      }
    } catch (_) {}
    return { x: 2, y: 3 };
  }

  let position = loadPosition();
  let selected = { ...position };
  let lastPhase = window.DDTime ? DDTime.phase() : '';

  function key(x, y) {
    return `${x},${y}`;
  }

  function inBounds(x, y) {
    return x >= 0 && x < SIZE && y >= 0 && y < SIZE;
  }

  function savePosition() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(position));
  }

  function isAdjacent(x, y) {
    const dx = Math.abs(x - position.x);
    const dy = Math.abs(y - position.y);
    return (dx <= 1 && dy <= 1 && (dx + dy > 0));
  }

  function getTerrain(x, y) {
    return terrainInfo[terrain[y][x]];
  }

  function phaseMessage(newPhase) {
    if (!newPhase || newPhase === lastPhase) return '';
    const texts = {
      朝: '空が明るくなってきた。',
      昼: '日が高くなった。',
      夕方: '日が傾いてきた。',
      夜: '日が沈み、周囲が暗くなった。',
      深夜: '深夜になった。森はかなり暗い。'
    };
    lastPhase = newPhase;
    return texts[newPhase] || '';
  }

  function moveTo(x, y) {
    if (!isAdjacent(x, y)) {
      selected = { x, y };
      render();
      message.textContent = '移動できるのは現在地の前後左右・斜め1マスだけ。';
      return;
    }

    const info = getTerrain(x, y);
    if (window.DDTime) DDTime.advance(info.moveMinutes, `move:${terrain[y][x]}`);
    position = { x, y };
    selected = { x, y };
    savePosition();

    const phaseText = window.DDTime ? phaseMessage(DDTime.phase()) : '';
    message.textContent = phaseText || `${info.name}へ移動した。${info.moveMinutes}分経過。`;
    render();
  }

  function makeAction(text, onClick, disabled = false) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'action';
    button.textContent = text;
    button.disabled = disabled;
    button.addEventListener('click', onClick);
    actions.appendChild(button);
  }

  function renderInfo() {
    const { x, y } = selected;
    const info = getTerrain(x, y);
    const poi = points[key(x, y)];
    const here = x === position.x && y === position.y;

    locationName.textContent = poi ? `${info.name}・${poi.label}` : info.name;
    moveCost.textContent = here ? '現在地' : `移動 ${info.moveMinutes}分`;
    locationText.textContent = poi ? `${info.description} ${poi.label}がある。` : info.description;
    actions.innerHTML = '';

    if (!here) {
      makeAction('ここへ移動', () => moveTo(x, y), !isAdjacent(x, y));
      return;
    }

    if (poi?.type === 'animal') {
      makeAction('狩猟する', () => {
        location.href = `DD_hunt.html?animal=${encodeURIComponent(poi.animalId)}&from=map`;
      });
    }

    if (poi?.type === 'harvest') {
      makeAction('採取する', () => {
        location.href = 'DD_forest.html?from=map';
      });
    }

    if (terrain[y][x] === 'cabin') {
      makeAction('小屋に入る', () => {
        location.href = 'DD_top.html';
      });
    }
  }

  function render() {
    board.innerHTML = '';

    for (let y = 0; y < SIZE; y++) {
      for (let x = 0; x < SIZE; x++) {
        const info = getTerrain(x, y);
        const poi = points[key(x, y)];
        const button = document.createElement('button');
        button.type = 'button';
        button.className = `cell ${info.className}`;
        if (isAdjacent(x, y)) button.classList.add('reachable');
        button.dataset.x = x;
        button.dataset.y = y;
        button.setAttribute('aria-label', poi ? `${info.name} ${poi.label}` : info.name);

        const label = document.createElement('span');
        label.className = 'terrainLabel';
        label.textContent = terrain[y][x] === 'deepForest' ? '深森' : info.name;
        button.appendChild(label);

        if (poi) {
          const icon = document.createElement('span');
          icon.className = `poi ${poi.type === 'animal' ? 'animal' : ''}`;
          icon.textContent = poi.icon;
          button.appendChild(icon);
        }

        if (x === position.x && y === position.y) {
          const pawn = document.createElement('span');
          pawn.className = 'pawn';
          button.appendChild(pawn);
        }

        button.addEventListener('click', () => {
          selected = { x, y };
          if (isAdjacent(x, y)) {
            render();
          } else {
            renderInfo();
          }
        });

        board.appendChild(button);
      }
    }

    renderInfo();
  }

  board.addEventListener('dblclick', e => e.preventDefault());
  document.addEventListener('contextmenu', e => e.preventDefault());
  document.addEventListener('selectstart', e => e.preventDefault());

  render();
})();
