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

  function renderQuickInventory() {
    if (!quickInventory) return;
    const state = window.SHOP_STATE || {};
    const inventory = state.inventory || {};
    const defs = (window.SHOP_ITEMS && window.SHOP_ITEMS.all) || {};
    const entries = Object.keys(defs)
      .map(id => ({
        id,
        def: defs[id],
        name: defs[id].name || id,
        count: Math.max(0, Number(inventory[id]) || 0)
      }))
      .filter(item => item.count > 0 || !item.def.hiddenWhenEmpty);

    const slots = [];
    entries.forEach(item => {
      const isDrinkable = item.count > 0 && item.def.drinkableWater;
      const isEdible = item.count > 0 && Number.isFinite(Number(item.def.hungerRecovery));
      const isUsable = isDrinkable || isEdible;
      const slot = document.createElement(isUsable ? 'button' : 'div');
      if (isUsable) slot.type = 'button';
      slot.className = 'quick-slot' + (item.count > 0 ? '' : ' is-empty') + (isUsable ? ' is-usable' : '');
      slot.textContent = item.count > 0 ? item.name + ' ×' + item.count : item.name;

      if (isDrinkable) {
        slot.addEventListener('click', () => {
          if (!window.SHOP_WELL) return;
          const result = window.SHOP_WELL.drinkCarriedWater(state, item.id);
          if (status) status.textContent = result.message;
          render();
        });
      } else if (isEdible) {
        slot.addEventListener('click', () => {
          if (!window.SHOP_FOOD) return;
          const result = window.SHOP_FOOD.eatInventory(state, item.id);
          if (status) status.textContent = result.message;
          render();
        });
      }

      slots.push(slot);
    });

    while (slots.length < 8) {
      const slot = document.createElement('div');
      slot.className = 'quick-slot is-empty';
      slot.textContent = '空き';
      slots.push(slot);
    }
    quickInventory.replaceChildren(...slots.slice(0,8));

    const sellableCount = window.SHOP_ITEMS && window.SHOP_ITEMS.getSellableInventoryCount
      ? window.SHOP_ITEMS.getSellableInventoryCount(state)
      : 0;

    if (quickSellButton) quickSellButton.disabled = sellableCount <= 0;
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
      if (!window.SHOP_ACTION) return;
      const screen = document.getElementById('actionScreen');
      if (screen && screen.classList.contains('is-open')) {
        window.SHOP_ACTION.close();
      } else {
        window.SHOP_ACTION.open(window.SHOP_STATE, 'beg');
      }
    });

    if (quickBegButton) {
      quickBegButton.addEventListener('click', () => {
        if (!window.SHOP_ACTION) return;
        window.SHOP_ACTION.open(window.SHOP_STATE, 'beg');
      });
    }
    if (quickSellButton) {
      quickSellButton.addEventListener('click', () => {
        if (!window.SHOP_ACTION) return;
        window.SHOP_ACTION.open(window.SHOP_STATE, 'sell');
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

  function canAccessScene(sceneKey,state=window.SHOP_STATE){
    if(sceneKey==='upperArea'){
      return !!(state && state.access && state.access.upperArea);
    }
    return true;
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
      if(item.selectable && (item.selectableType==='shop' || item.selectableType==='well')){
        image.classList.add('selectable-place');
      }

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
      const transforms = [];
      if (item.centered) transforms.push('translateX(-50%)');
      if (item.flip) transforms.push('scaleX(-1)');
      if (transforms.length) image.style.transform = transforms.join(' ');

      if (item.selectable && item.selectableType === 'well') {
        image.style.pointerEvents = 'auto';
        image.style.cursor = 'pointer';
        image.setAttribute('role', 'button');
        image.setAttribute('aria-label', '井戸を使う');
        image.addEventListener('click', event => {
          event.stopPropagation();
          if (!window.SHOP_WELL) return;
          window.SHOP_WELL.open(state, () => {
            if (status) status.textContent = '';
            render();
          });
        });
      }

      if (item.selectable && item.selectableType === 'shop') {
        image.style.pointerEvents = 'auto';
        image.style.cursor = 'pointer';
        image.setAttribute('role', 'button');
        image.setAttribute('aria-label', '屋台を見る');
        image.addEventListener('click', event => {
          event.stopPropagation();
          if (!window.SHOP_STALL) return;
          window.SHOP_STALL.open(state, () => {
            render();
          });
        });
      }

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
      if (canAccessScene(nextKey,state)) {
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
    }

    const facilityLinks = Array.isArray(scene.facilityLinks) ? scene.facilityLinks : [];
    if (facilityLinks.length || scene.returnTo) {
      const facilityWrap = document.createElement('div');
      facilityWrap.className = 'scene-nav-facilities';

      facilityLinks.forEach(link => {
        if (!link || !data.scenes[link.sceneKey]) return;
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'scene-nav-btn scene-nav-facility-btn';
        button.textContent = '↑' + (link.label || data.scenes[link.sceneKey].name);
        button.setAttribute('aria-label', data.scenes[link.sceneKey].name + 'へ移動');
        button.addEventListener('click', event => {
          event.stopPropagation();
          state.sceneKey = link.sceneKey;
          render();
        });
        facilityWrap.appendChild(button);
      });

      if (scene.returnTo && data.scenes[scene.returnTo]) {
        const backButton = document.createElement('button');
        backButton.type = 'button';
        backButton.className = 'scene-nav-btn scene-nav-facility-btn';
        backButton.textContent = '↓戻る';
        backButton.setAttribute('aria-label', data.scenes[scene.returnTo].name + 'へ戻る');
        backButton.addEventListener('click', event => {
          event.stopPropagation();
          state.sceneKey = scene.returnTo;
          render();
        });
        facilityWrap.appendChild(backButton);
      }

      navLayer.appendChild(facilityWrap);
    }

    strip.appendChild(navLayer);

    placeholder.style.display = 'none';
    state.scene = scene.name;
  }

  function render() {
    const state = window.SHOP_STATE;

    if (window.SHOP_TIME) window.SHOP_TIME.syncClimate(state);
    renderScene();

    const gameDay = Math.max(1, Number(state.day) || 1);
    const lunar = window.SHOP_CALENDAR.getDate(gameDay);
    $('dayLabel').textContent = lunar.monthName + 'の月 ' + lunar.dayInMonth + '日';
    $('dayText').textContent = '（' + gameDay + '日目）';

    $('timeLabel').textContent = window.SHOP_TIME.getPrayerStatus(state.minutes);
    $('timeText').textContent = window.SHOP_TIME.format(state.minutes);

    $('tempLabel').textContent = '';
    $('tempText').textContent = window.SHOP_TEMPERATURE.format(state.temperature);

    $('weatherLabel').textContent = '';
    $('weatherText').textContent = window.SHOP_WEATHER.icon(state.weather);
    $('weatherText').title = state.weather || '';

    $('sceneName').textContent = state.scene || '';

    const hp = clampPercent(state.hp);
    const hunger = clampPercent(state.hunger);
    const thirst = clampPercent(state.thirst);

    $('hpBar').style.width = hp + '%';
    $('hungerBar').style.width = hunger + '%';
    $('thirstBar').style.width = thirst + '%';

    $('hpText').textContent = Math.round(hp);
    $('hungerText').textContent = Math.round(hunger);
    $('thirstText').textContent = Math.round(thirst);
    const moneyText = $('moneyText');
    if (moneyText) {
      moneyText.textContent = window.SHOP_CURRENCY
        ? window.SHOP_CURRENCY.format(state.money)
        : String(Number(state.money || 0));
    }
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
