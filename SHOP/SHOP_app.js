(() => {
  'use strict';

  const data = window.SHOP_DATA;
  const clone = value => JSON.parse(JSON.stringify(value));
  window.SHOP_STATE = clone(data.initialState);

  const $ = id => document.getElementById(id);
  const status = $('saveStatus');
  const menu = $('bottomMenu');

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

    saveButton.addEventListener('click', () => saveGame(saveButton));
    loadButton.addEventListener('click', () => loadGame(loadButton));
  }

  function render() {
    const state = window.SHOP_STATE;

    $('dayText').textContent = Number(state.day || 1) + '日目';
    $('timeText').textContent = formatTime(state.minutes);
    $('tempText').textContent = Number(state.temperature || 0) + '℃';
    $('weatherText').textContent = state.weather || '';
    $('sceneName').textContent = state.scene || '';

    const hp = clampPercent(state.hp);
    const hunger = clampPercent(state.hunger);
    const thirst = clampPercent(state.thirst);

    $('hpBar').style.width = hp + '%';
    $('hungerBar').style.width = hunger + '%';
    $('thirstBar').style.width = thirst + '%';

    $('hpText').textContent = hp;
    $('hungerText').textContent = hunger;
    $('thirstText').textContent = thirst;
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

  const params = new URLSearchParams(location.search);
  if (params.get('continue') === '1') {
    status.textContent = '続きから始める場合は「ロード」を押してください。';
  }

  // 町背景は横方向にスクロールする。
  // 背景画像・主人公画像・ゲーム内容は後でJS側から設定する。
  // オートセーブ・オートロード・ブラウザ保存は行わない。
})();
