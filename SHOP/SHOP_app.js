(() => {
  'use strict';

  const data = window.SHOP_DATA;
  const clone = value => JSON.parse(JSON.stringify(value));
  window.SHOP_STATE = clone(data.initialState);

  const $ = id => document.getElementById(id);
  const status = $('saveStatus');
  const menu = $('bottomMenu');
  const quickInventory = $('quickInventory');
  const quickBegButton = $('quickBegButton');
  const quickSellButton = $('quickSellButton');
  const timeRail = $('timeRail');
  const moonRail = $('moonRail');
  const moonPhaseText = $('moonPhaseText');
  const railPopup = $('railPopup');
  let railPopupTimer = null;

  function formatTime(totalMinutes) {
    const value = Math.max(0, Number(totalMinutes) || 0) % 1440;
    const hour = Math.floor(value / 60);
    const minute = value % 60;
    return String(hour).padStart(2, '0') + ':' + String(minute).padStart(2, '0');
  }

  function clampPercent(value) {
    return Math.max(0, Math.min(100, Number(value) || 0));
  }

  function makeButton(id, label) {
    const button = document.createElement('button');
    button.type = 'button';
    button.id = id;
    button.className = 'menu-btn';
    button.textContent = label;
    return button;
  }

  function minutePercent(minute) {
    return Math.max(0, Math.min(100, (Number(minute) || 0) / 1440 * 100));
  }

  function showRailPopup(text) {
    if (!railPopup) return;
    railPopup.textContent = String(text || '');
    railPopup.classList.add('is-open');
    if (railPopupTimer) clearTimeout(railPopupTimer);
    railPopupTimer = setTimeout(() => railPopup.classList.remove('is-open'), 2200);
  }

  function lunarPhaseName(age, cycle) {
    const p = ((age % cycle) + cycle) % cycle / cycle;
    if (p < 0.0625 || p >= 0.9375) return '新月';
    if (p < 0.1875) return '三日月';
    if (p < 0.3125) return '上弦';
    if (p < 0.4375) return '十三夜';
    if (p < 0.5625) return '満月';
    if (p < 0.6875) return '寝待月';
    if (p < 0.8125) return '下弦';
    return '有明月';
  }

  function renderTimeMoonRails() {
    const state = window.SHOP_STATE || {};
    const config = data.timeSystem || {};
    const prayers = Array.isArray(config.prayers) ? config.prayers : [];
    const now = Math.max(0, Math.min(1439, Number(state.minutes) || 0));

    if (timeRail) {
      const nodes = [];

      const track = document.createElement('div');
      track.className = 'time-track-line';
      nodes.push(track);

      for (let hour = 0; hour <= 24; hour += 1) {
        const tick = document.createElement('span');
        const major = hour % 6 === 0;
        tick.className = 'hour-tick' + (major ? ' major' : '');
        tick.style.left = (hour / 24 * 100) + '%';
        nodes.push(tick);

        if (major) {
          const label = document.createElement('span');
          label.className = 'hour-label';
          label.style.left = (hour / 24 * 100) + '%';
          label.textContent = String(hour);
          nodes.push(label);
        }
      }

      const fastingStart = prayers.find(item => item.id === config.fastingStartId);
      const fastingEnd = prayers.find(item => item.id === config.fastingEndId);
      if (fastingStart && fastingEnd) {
        const band = document.createElement('div');
        band.className = 'fasting-band';
        const startPct = minutePercent(fastingStart.minute);
        const endPct = minutePercent(fastingEnd.minute);
        band.style.left = startPct + '%';
        band.style.width = Math.max(0, endPct - startPct) + '%';
        nodes.push(band);

        const fastingStatus = document.createElement('div');
        fastingStatus.className = 'fasting-status';
        fastingStatus.textContent =
          now >= fastingStart.minute && now < fastingEnd.minute
            ? '断食中'
            : '断食外';
        nodes.push(fastingStatus);
      }

      prayers.forEach(prayer => {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'prayer-mark';
        button.style.left = minutePercent(prayer.minute) + '%';
        button.setAttribute('aria-label', prayer.label + ' ' + formatTime(prayer.minute));
        const code = document.createElement('span');
        code.className = 'prayer-code';
        code.textContent = prayer.code || '';
        button.appendChild(code);
        button.addEventListener('click', () => {
          showRailPopup(prayer.label + '  ' + formatTime(prayer.minute));
        });
        nodes.push(button);
      });

      const nowMarker = document.createElement('div');
      nowMarker.className = 'time-now-marker';
      nowMarker.style.left = minutePercent(now) + '%';
      nodes.push(nowMarker);

      timeRail.replaceChildren(...nodes);
    }

    if (moonRail) {
      const nodes = [];
      const cycle = Math.max(1, Number(config.lunarCycleDays) || 29.53);
      const day = Math.max(1, Number(state.day) || 1);
      const age = (day - 1) % cycle;
      const position = age / cycle * 100;

      const track = document.createElement('div');
      track.className = 'moon-track-line';
      nodes.push(track);

      const phaseMarks = [
        {p:0, symbol:'●', name:'新月'},
        {p:25, symbol:'◐', name:'上弦'},
        {p:50, symbol:'○', name:'満月'},
        {p:75, symbol:'◑', name:'下弦'},
        {p:100, symbol:'●', name:'新月'}
      ];
      phaseMarks.forEach(phase => {
        const mark = document.createElement('span');
        mark.className = 'moon-phase-mark';
        mark.style.left = phase.p + '%';
        mark.textContent = phase.symbol;
        mark.setAttribute('aria-label', phase.name);
        nodes.push(mark);
      });

      const current = document.createElement('div');
      current.className = 'moon-now-marker';
      current.style.left = position + '%';
      nodes.push(current);

      moonRail.replaceChildren(...nodes);
      if (moonPhaseText) moonPhaseText.textContent = lunarPhaseName(age, cycle);
    }
  }

  function renderQuickInventory() {
    if (!quickInventory) return;
    const state = window.SHOP_STATE || {};
    const inventory = state.inventory || {};
    const defs = (window.SHOP_ITEMS && window.SHOP_ITEMS.all) || {};
    const entries = Object.keys(defs).map(id => ({
      id,
      name: defs[id].name || id,
      count: Math.max(0, Number(inventory[id]) || 0)
    }));

    const slots = [];
    entries.forEach(item => {
      const slot = document.createElement('div');
      slot.className = 'quick-slot' + (item.count > 0 ? '' : ' is-empty');
      slot.textContent = item.count > 0 ? item.name + ' ×' + item.count : item.name;
      slots.push(slot);
    });

    while (slots.length < 8) {
      const slot = document.createElement('div');
      slot.className = 'quick-slot is-empty';
      slot.textContent = '空き';
      slots.push(slot);
    }
    quickInventory.replaceChildren(...slots.slice(0,8));

    const count = window.SHOP_ITEMS && window.SHOP_ITEMS.getInventoryCount
      ? window.SHOP_ITEMS.getInventoryCount(state)
      : Object.values(inventory).reduce((sum,n)=>sum + Math.max(0, Number(n)||0),0);

    if (quickSellButton) quickSellButton.disabled = count <= 0;
  }

  function buildStaticContent() {
    document.title = data.title;

    $('dayLabel').textContent = data.labels.day;
    $('timeLabel').textContent = data.labels.time;
    $('tempLabel').textContent = data.labels.temperature;
    $('weatherLabel').textContent = data.labels.weather;

    $('hpLabel').textContent = data.labels.hp;
    $('hungerLabel').textContent = data.labels.hunger;
    $('thirstLabel').textContent = data.labels.thirst;
    $('portrait').textContent = data.labels.portrait;
    $('townPlaceholder').textContent = data.labels.townPlaceholder;

    const mapButton = makeButton('mapButton', data.labels.map);
    const inventoryButton = makeButton('inventoryButton', data.labels.inventory);
    const actionButton = makeButton('actionButton', data.labels.action);
    const saveButton = makeButton('saveButton', data.labels.save);
    const loadButton = makeButton('loadButton', data.labels.load);

    menu.replaceChildren(mapButton, inventoryButton, actionButton, saveButton, loadButton);

    actionButton.addEventListener('click', () => {
      if (window.SHOP_ACTION) window.SHOP_ACTION.open(window.SHOP_STATE);
    });

    if (quickBegButton) {
      quickBegButton.addEventListener('click', () => {
        if (!window.SHOP_ACTION) return;
        window.SHOP_ACTION.open(window.SHOP_STATE);
        window.SHOP_ACTION.setMode('beg');
      });
    }
    if (quickSellButton) {
      quickSellButton.addEventListener('click', () => {
        if (!window.SHOP_ACTION) return;
        window.SHOP_ACTION.open(window.SHOP_STATE);
        window.SHOP_ACTION.setMode('sell');
      });
    }

    saveButton.addEventListener('click', () => saveGame(saveButton));
    loadButton.addEventListener('click', () => loadGame(loadButton));
  }

  function collectPickup(pickup, marker) {
    const state = window.SHOP_STATE;
    if (!Array.isArray(state.collectedPickups)) state.collectedPickups = [];
    if (!state.inventory || typeof state.inventory !== 'object') state.inventory = {};
    if (state.collectedPickups.includes(pickup.id)) return;

    state.collectedPickups.push(pickup.id);
    state.inventory[pickup.itemId] = (Number(state.inventory[pickup.itemId]) || 0) + 1;
    if (marker) marker.remove();
    renderQuickInventory();
  }

  function renderPickups(scene, layer) {
    const state = window.SHOP_STATE;
    const collected = Array.isArray(state.collectedPickups) ? state.collectedPickups : [];

    (scene.pickups || []).forEach(pickup => {
      if (collected.includes(pickup.id)) return;

      const marker = document.createElement('button');
      marker.type = 'button';
      marker.className = 'pickup-marker';
      marker.textContent = '✴︎';
      marker.setAttribute('aria-label', '拾う');
      marker.style.left = pickup.left + '%';
      marker.style.bottom = (pickup.bottom || 0) + '%';
      marker.addEventListener('click', event => {
        event.stopPropagation();
        collectPickup(pickup, marker);
      });
      layer.appendChild(marker);
    });
  }

  function renderScene() {
    const state = window.SHOP_STATE;
    const key = state.sceneKey && data.scenes[state.sceneKey] ? state.sceneKey : 'outerPoor';
    const scene = data.scenes[key];
    const strip = $('townStrip');
    const placeholder = $('townPlaceholder');

    strip.style.minWidth = '0';
    strip.style.width = '100%';
    strip.style.backgroundImage = 'none';

    strip.querySelectorAll('.scene-layer,.scene-nav-layer').forEach(node => node.remove());

    // 5層は上下に分割する帯ではなく、同じ画面全面に重なる5枚のレイヤー。
    const layerFar=document.createElement('div');
    layerFar.className='scene-layer scene-layer-far';
    layerFar.style.backgroundImage='url("' + scene.background + '")';
    layerFar.style.backgroundPosition='center center';
    layerFar.style.backgroundSize='cover';
    layerFar.style.backgroundRepeat='no-repeat';

    // 全地区に同じ補正をかける。地区ごとの相対配置はsceneデータ側で維持する。
    const farShiftPx = Math.round(strip.clientHeight * 0.10);
    const commonShiftPx = Math.round(strip.clientHeight * 0.08);

    const layerHouse=document.createElement('div');
    layerHouse.className='scene-layer scene-layer-house';

    const layerBackgroundNpc=document.createElement('div');
    layerBackgroundNpc.className='scene-layer scene-layer-backgroundNpc';

    const layerInteractive=document.createElement('div');
    layerInteractive.className='scene-layer scene-layer-interactive';

    const layerPlayer=document.createElement('div');
    layerPlayer.className='scene-layer scene-layer-player';

    layerFar.style.transform='translateY(-' + (farShiftPx + commonShiftPx) + 'px)';
    layerFar.style.willChange='transform';

    [layerHouse,layerBackgroundNpc,layerInteractive,layerPlayer].forEach(layer=>{
      layer.style.transform='translateY(-' + commonShiftPx + 'px)';
      layer.style.willChange='transform';
    });

    strip.style.backgroundColor='#664e44';
    strip.append(layerFar,layerHouse,layerBackgroundNpc,layerInteractive,layerPlayer);

    const layerMap={
      far:layerFar,
      house:layerHouse,
      backgroundNpc:layerBackgroundNpc,
      interactive:layerInteractive,
      player:layerPlayer,
      town:layerHouse,
      people:layerBackgroundNpc
    };

    scene.objects.forEach(item => {
      const image = document.createElement('img');
      image.className = 'scene-object layer-' + (item.layer || 'house');
      if(item.selectable) image.classList.add('is-selectable');
      if(item.selectable && item.selectableType==='npc') image.classList.add('selectable-npc');

      if(item.layer==='backgroundNpc'){
        image.style.filter='drop-shadow(1px 2px 2px rgba(0,0,0,.22))';
        image.style.opacity='0.92';
      }
      if(item.selectable && item.selectableType==='npc'){
        image.style.filter=
          'drop-shadow(2px 0 0 #ffe600) '+
          'drop-shadow(-2px 0 0 #ffe600) '+
          'drop-shadow(0 2px 0 #ffe600) '+
          'drop-shadow(0 -2px 0 #ffe600) '+
          'drop-shadow(3px 3px 3px rgba(0,0,0,.32))';
      }
      image.src = item.src;
      image.alt = '';
      image.draggable = false;
      image.style.left = item.left + '%';
      image.style.bottom = (item.bottom || 0) + '%';
      image.style.height = item.height + '%';
      const z = typeof item.layer === 'string' ? data.layers[item.layer] : item.layer;
      image.style.zIndex = String(z ?? data.layers.house);
      if (item.flip) image.style.transform = 'scaleX(-1)';
      (layerMap[item.layer] || layerHouse).appendChild(image);
    });

    renderPickups(scene, layerInteractive);

    // 茶色の下端スペースに、前後の場所へ移動する矢印を置く。
    // 町の人物・建物・遠景の配置には干渉させない独立レイヤー。
    const sceneOrder = ['outerPoor','smallGateOutside','cityCommon','upperArea'];
    const sceneIndex = sceneOrder.indexOf(key);
    const navLayer = document.createElement('div');
    navLayer.className = 'scene-nav-layer';

    if (sceneIndex > 0) {
      const prevKey = sceneOrder[sceneIndex - 1];
      const prevButton = document.createElement('button');
      prevButton.type = 'button';
      prevButton.className = 'scene-nav-btn scene-nav-prev';
      prevButton.textContent = '←';
      prevButton.setAttribute('aria-label', data.scenes[prevKey].name + 'へ移動');
      prevButton.addEventListener('click', event => {
        event.stopPropagation();
        state.sceneKey = prevKey;
        render();
      });
      navLayer.appendChild(prevButton);
    }

    if (sceneIndex >= 0 && sceneIndex < sceneOrder.length - 1) {
      const nextKey = sceneOrder[sceneIndex + 1];
      const nextButton = document.createElement('button');
      nextButton.type = 'button';
      nextButton.className = 'scene-nav-btn scene-nav-next';
      nextButton.textContent = '→';
      nextButton.setAttribute('aria-label', data.scenes[nextKey].name + 'へ移動');
      nextButton.addEventListener('click', event => {
        event.stopPropagation();
        state.sceneKey = nextKey;
        render();
      });
      navLayer.appendChild(nextButton);
    }

    strip.appendChild(navLayer);

    placeholder.style.display = 'none';
    state.scene = scene.name;
  }

  function render() {
    const state = window.SHOP_STATE;

    renderScene();

    $('dayText').textContent = Number(state.day || 1) + '日目';
    $('timeText').textContent = formatTime(state.minutes);
    $('tempText').textContent = Number(state.temperature || 0) + '℃';
    $('weatherText').textContent = state.weather || '';
    $('sceneName').textContent = state.scene || '';
    renderTimeMoonRails();

    const hp = clampPercent(state.hp);
    const hunger = clampPercent(state.hunger);
    const thirst = clampPercent(state.thirst);

    $('hpBar').style.width = hp + '%';
    $('hungerBar').style.width = hunger + '%';
    $('thirstBar').style.width = thirst + '%';

    $('hpText').textContent = hp;
    $('hungerText').textContent = hunger;
    $('thirstText').textContent = thirst;
    const moneyText = $('moneyText');
    if (moneyText) moneyText.textContent = Number(state.money || 0);
    renderQuickInventory();
  }

  async function saveGame(button) {
    button.disabled = true;
    status.textContent = '保存中';
    try {
      await window.SHOP_SAVE.save(window.SHOP_STATE);
      status.textContent = '保存しました';
    } catch (error) {
      status.textContent = error && error.message ? error.message : '保存に失敗しました';
    } finally {
      button.disabled = false;
    }
  }

  async function loadGame(button) {
    button.disabled = true;
    status.textContent = '読込中';
    try {
      const loaded = await window.SHOP_SAVE.load();
      if (loaded && typeof loaded === 'object') {
        window.SHOP_STATE = Object.assign(clone(data.initialState), loaded);
        render();
      }
      status.textContent = '読み込みました';
    } catch (error) {
      status.textContent = error && error.message ? error.message : '読み込みに失敗しました';
    } finally {
      button.disabled = false;
    }
  }

  buildStaticContent();
  render();
  window.SHOP_RENDER = render;

  const params = new URLSearchParams(location.search);
  if (params.get('continue') === '1') {
    status.textContent = '続きから始める場合は「ロード」を押してください。';
  }

  // 1つの「場」は1画面で表示し、移動時にsceneKeyを切り替える。
  // 遠景=far、町背景=town、人=people、会話対象/店=interactive、主人公=player の奥行きで重ねる。
  // 背景・建物・門・屋台はJSデータから重ねて表示する。
  // オートセーブ・オートロード・ブラウザ保存は行わない。
})();
