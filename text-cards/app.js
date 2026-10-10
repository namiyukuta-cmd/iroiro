(function () {
  'use strict';
  const R = globalThis.TextCardRules;
  const $ = id => document.getElementById(id);
  const KEY = 'iroiro-text-card-life-v1';
  const LABELS = { money: 'お金', energy: '体力', food: '食料', comfort: '部屋の整い' };
  const signed = n => n > 0 ? '+' + n : n < 0 ? '−' + Math.abs(n) : '0';
  const changes = effect => Object.keys(LABELS).filter(key => effect[key]).map(key => LABELS[key] + ' ' + signed(effect[key]));
  let storageError = false;
  let startupNotice = '';
  let lastPlayTime = -1000;
  function newSeed() {
    if (globalThis.crypto && crypto.getRandomValues) return crypto.getRandomValues(new Uint32Array(1))[0] || 1;
    return Math.floor(Math.random() * 0xffffffff) + 1;
  }
  function fresh() { return { version: 1, state: R.create(newSeed()), undo: [], redo: [] }; }
  function restoreSession(raw) {
    if (!raw || raw.version !== 1 || !Array.isArray(raw.undo) || !Array.isArray(raw.redo) || raw.undo.length > R.DAYS || raw.redo.length > R.DAYS) throw new Error('このゲームのセーブではありません。');
    const state = R.restore(raw.state);
    const undo = raw.undo.map(R.restore);
    const redo = raw.redo.map(R.restore);
    if ([...undo, ...redo].some(item => item.seed !== state.seed)) throw new Error('別の週のデータが混ざっています。');
    return { version: 1, state, undo, redo };
  }
  function load() {
    try {
      const saved = localStorage.getItem(KEY);
      if (saved) return restoreSession(JSON.parse(saved));
    } catch (error) {
      startupNotice = '前回の続きは読み込めませんでした。セーブファイルがあれば読み込めます。';
    }
    return fresh();
  }
  let session = load();
  function persist() {
    try { localStorage.setItem(KEY, JSON.stringify(session)); storageError = false; }
    catch (error) { storageError = true; }
    $('saveNote').textContent = storageError ? '端末保存ができません' : '自動保存';
    $('saveNote').classList.toggle('error', storageError);
    if (storageError) $('menuStatus').textContent = '自動保存できません。メニューの「セーブを保存」から、ファイルに保存できます。';
  }
  function announce(text) { $('announcement').textContent = text; }
  function showRecords() {
    const list = $('recordList');
    list.replaceChildren();
    let before = R.create(session.state.seed);
    if (!session.state.history.length) {
      const li = document.createElement('li');
      li.textContent = 'まだカードを使っていません。';
      list.append(li);
    }
    session.state.history.forEach((id, index) => {
      const after = R.play(before, id);
      const info = R.lastMove(after);
      const li = document.createElement('li');
      li.textContent = (index + 1) + '日目 · ' + info.title;
      const detail = document.createElement('div');
      detail.className = 'record-detail';
      detail.textContent = changes(info.delta).join(' / ') || '変化なし';
      li.append(detail);
      list.append(li);
      before = after;
    });
  }
  function useCard(id) {
    if (performance.now() - lastPlayTime < 250 || R.blocked(session.state, id)) return;
    const next = R.play(session.state, id);
    session.undo.push(session.state);
    session.state = next;
    session.redo = [];
    lastPlayTime = performance.now();
    persist();
    render();
    const move = R.lastMove(next);
    const ending = next.day > R.DAYS ? '今週が終わりました。' : next.day + '日目です。';
    announce(move.title + 'を使用。' + changes(move.delta).join('。') + '。' + ending);
  }
  function render() {
    const state = session.state;
    const finished = state.day > R.DAYS;
    $('dayLabel').textContent = finished ? '7日間 おわり' : state.day + '日目 / 7日間';
    $('moneyValue').textContent = state.money;
    $('energyValue').textContent = state.energy;
    $('foodValue').textContent = state.food;
    $('roomLine').textContent = '部屋の整い ' + state.comfort + ' · 休息の回復 +' + (4 + state.comfort);
    $('days').replaceChildren();
    for (let day = 1; day <= R.DAYS; day++) {
      const mark = document.createElement('span');
      mark.className = 'day-mark' + (day < state.day ? ' done' : day === state.day ? ' current' : '');
      $('days').append(mark);
    }
    $('hand').replaceChildren();
    R.hand(state).forEach((id, index) => {
      const info = R.card(id, state);
      const reason = R.blocked(state, id);
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'word-card';
      button.disabled = Boolean(reason);
      button.dataset.cardId = id;
      button.setAttribute('aria-label', info.title + '。' + changes(info.effect).join('。') + '。' + (reason || '使うと1日進みます。'));
      const kind = document.createElement('span'); kind.className = 'kind'; kind.textContent = info.kind;
      const word = document.createElement('span'); word.className = 'word'; word.textContent = info.title;
      const effects = document.createElement('span'); effects.className = 'effects'; effects.textContent = changes(info.effect).join('\n');
      button.append(kind, word, effects);
      if (reason) { const label = document.createElement('span'); label.className = 'reason'; label.textContent = reason; button.append(label); }
      button.addEventListener('click', () => useCard(id));
      button.title = '手札 ' + (index + 1);
      $('hand').append(button);
    });
    $('handSection').hidden = finished;
    $('resultSection').hidden = !finished;
    $('undoButton').disabled = session.undo.length === 0;
    $('redoButton').disabled = session.redo.length === 0;
    $('tableTitle').removeAttribute('tabindex');
    $('table').classList.toggle('finished', finished);
    const move = R.lastMove(state);
    if (finished) {
      const result = R.result(state);
      $('tableLabel').textContent = '今週の目標';
      $('tableTitle').textContent = result.won ? '家賃を確保しました' : 'あと' + result.shortage + 'で家賃に届きます';
      $('tableDetail').textContent = '所持金 ' + state.money + ' / 家賃 30';
      $('resultDetail').textContent = (result.won ? '家賃を払った後に残るお金：' + result.remaining : '家賃に足りないお金：' + result.shortage) + '\n部屋の整い：' + state.comfort + ' / 体力：' + state.energy;
    } else if (move) {
      $('tableLabel').textContent = move.day + '日目に使ったカード';
      $('tableTitle').textContent = move.title;
      $('tableDetail').textContent = (changes(move.delta).join(' / ') || '変化なし') + '\n毎日の消費を含みます。' + (move.hungry ? '食料なし：体力 −2。' : '');
    } else {
      $('tableLabel').textContent = '今週の目標';
      $('tableTitle').textContent = '7日後の家賃を用意する';
      $('tableDetail').textContent = 'カードを1枚選ぶと、1日進みます。';
    }
    showRecords();
  }
  function newWeek() {
    session = fresh();
    lastPlayTime = -1000;
    startupNotice = '';
    $('menuStatus').textContent = '';
    persist(); render(); announce('新しい1週間を始めました。1日目です。');
  }
  $('undoButton').addEventListener('click', () => {
    if (!session.undo.length) return;
    session.redo.push(session.state);
    session.state = session.undo.pop();
    lastPlayTime = -1000;
    persist(); render(); announce('1手戻しました。' + session.state.day + '日目です。');
  });
  $('redoButton').addEventListener('click', () => {
    if (!session.redo.length) return;
    session.undo.push(session.state);
    session.state = session.redo.pop();
    lastPlayTime = -1000;
    persist(); render(); announce('前の手をやり直しました。');
  });
  $('menuButton').addEventListener('click', () => {
    if (!storageError) $('menuStatus').textContent = startupNotice;
    $('menuDialog').showModal();
  });
  $('closeMenuButton').addEventListener('click', () => $('menuDialog').close());
  $('restartButton').addEventListener('click', () => { $('menuDialog').close(); $('restartDialog').showModal(); });
  $('cancelRestartButton').addEventListener('click', () => { $('restartDialog').close(); $('menuDialog').showModal(); });
  $('confirmRestartButton').addEventListener('click', () => { $('restartDialog').close(); newWeek(); });
  $('newWeekButton').addEventListener('click', newWeek);
  $('exportButton').addEventListener('click', () => {
    const url = URL.createObjectURL(new Blob([JSON.stringify(session, null, 2)], { type: 'application/json' }));
    const link = document.createElement('a');
    link.href = url; link.download = 'moji-card-save.json';
    document.body.append(link); link.click(); link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    $('menuStatus').textContent = 'セーブファイルを保存します。';
  });
  $('importButton').addEventListener('click', () => $('importFile').click());
  $('importFile').addEventListener('change', async event => {
    const file = event.target.files[0];
    event.target.value = '';
    if (!file) return;
    try {
      if (file.size > 100000) throw new Error('このゲームのセーブファイルを選んでください。');
      const loaded = restoreSession(JSON.parse(await file.text()));
      session = loaded; startupNotice = ''; lastPlayTime = -1000;
      persist(); render(); $('menuDialog').close(); announce('セーブを読み込みました。');
    } catch (error) { $('menuStatus').textContent = '読み込めませんでした。' + (error instanceof SyntaxError ? 'JSONのセーブファイルを選んでください。' : error.message); }
  });
  document.addEventListener('keydown', event => {
    if (event.repeat || event.ctrlKey || event.metaKey || event.altKey || $('menuDialog').open || $('restartDialog').open) return;
    if (/^[1-4]$/.test(event.key)) {
      const id = R.hand(session.state)[Number(event.key) - 1];
      if (id) { event.preventDefault(); useCard(id); }
    }
  });
  $('dailyRule').textContent = '毎日の消費：食料 −1、なければ体力 −2';
  render();
  if (!startupNotice) persist();
  else { $('saveNote').textContent = '前回のセーブ読込に失敗'; $('menuStatus').textContent = startupNotice; }
})();
