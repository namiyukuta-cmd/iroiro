(() => {
  'use strict';

  const data = window.SHOP_DATA;
  const clone = value => JSON.parse(JSON.stringify(value));
  window.SHOP_STATE = clone(data.initialState);

  const title = document.getElementById('gameTitle');
  const dayText = document.getElementById('dayText');
  const timeText = document.getElementById('timeText');
  const moneyText = document.getElementById('moneyText');
  const shelf = document.getElementById('shelf');
  const floor = document.getElementById('floor');
  const status = document.getElementById('saveStatus');
  const nav = document.getElementById('bottomNav');

  function formatTime(totalMinutes) {
    const value = Math.max(0, Number(totalMinutes) || 0) % 1440;
    const hour = Math.floor(value / 60);
    const minute = value % 60;
    return String(hour).padStart(2, '0') + ':' + String(minute).padStart(2, '0');
  }

  function makeButton(id, label) {
    const button = document.createElement('button');
    button.type = 'button';
    button.id = id;
    button.textContent = label;
    return button;
  }

  function buildLayout() {
    document.title = data.title;
    title.textContent = data.title;
    floor.textContent = data.labels.floor;

    shelf.replaceChildren();
    for (let i = 0; i < data.layout.shelfSlots; i += 1) {
      const slot = document.createElement('div');
      slot.className = 'shelf-slot';
      slot.dataset.slot = String(i);
      shelf.append(slot);
    }

    const loadButton = makeButton('loadButton', data.labels.load);
    const saveButton = makeButton('saveButton', data.labels.save);
    const backLink = document.createElement('a');
    backLink.className = 'navbtn';
    backLink.href = data.links.backToShopMenu;
    backLink.textContent = data.labels.back;
    nav.replaceChildren(loadButton, saveButton, backLink);

    loadButton.addEventListener('click', () => loadGame(loadButton));
    saveButton.addEventListener('click', () => saveGame(saveButton));
  }

  function render() {
    const state = window.SHOP_STATE;
    dayText.textContent = Number(state.day || 1) + data.labels.daySuffix;
    timeText.textContent = formatTime(state.minutes);
    moneyText.textContent = data.labels.money + ' ' + Number(state.money || 0);
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
        window.SHOP_STATE = loaded;
        render();
      }
      status.textContent = '読み込みました';
    } catch (error) {
      status.textContent = error && error.message ? error.message : '読み込みに失敗しました';
    } finally {
      button.disabled = false;
    }
  }

  buildLayout();
  render();

  const params = new URLSearchParams(location.search);
  if (params.get('continue') === '1') {
    status.textContent = '続きから始める場合は「ロード」を押してください。';
  }

  // オートセーブ・オートロード・ブラウザ保存は行わない。
})();
