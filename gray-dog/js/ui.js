window.GrayGame = window.GrayGame || {};

(() => {
  const $ = (id) => document.getElementById(id);
  const els = {};

  function cache() {
    ['chapterLabel','dayLabel','placeLabel','sceneText','dogStage','distanceLine','observationText','actionTitle','actionCount','actions','advanceButton','sheet','sheetTitle','sheetContent','closeSheet','menuButton'].forEach(id => els[id] = $(id));
  }

  function distanceForState(s) {
    if (s.mode === 'home') return 'home';
    if (s.visit <= 2) return 'far';
    if (s.visit <= 4) return 'mid';
    return 'near';
  }

  function facilityIntro(s) {
    const entries = [
      ['大きな黒灰色の犬が、少し離れた場所で伏せています。','こちらを見ません。耳だけが、ときどき周囲の音を追っています。'],
      ['前と同じ場所にグレイがいます。こちらが入ってきても、立ち上がりません。','一度だけこちらを確認して、また前を向きました。'],
      ['グレイの前で足を止めると、今日は最初からこちらの位置を把握しているようです。','以前より、こちらを確認するまでの時間が短くなっています。'],
      ['スタッフが散歩用のリードを持ってきています。','外へ出る気配には少し緊張しますが、逃げようとはしていません。'],
      ['こちらが来ると、グレイの耳が先に動きました。','まだ大きな反応はありません。ただ、来訪を覚えているように見えます。'],
      ['今日のグレイは、こちらを見たあとその場で伏せ直しました。','近くにいても休める時間が少し長くなっています。']
    ];
    return entries[Math.min(s.visit - 1, entries.length - 1)];
  }

  function renderFacility(s) {
    const intro = facilityIntro(s);
    const lastAction = s.acted ? GrayGame.data.FACILITY_ACTIONS.find(a => a.id === s.lastEvent) : null;
    els.chapterLabel.textContent = '保護施設';
    els.dayLabel.textContent = `訪問 ${s.visit}回目`;
    els.placeLabel.textContent = '譲渡会の一角';
    els.sceneText.textContent = lastAction ? lastAction.result : intro[0];
    els.observationText.textContent = lastAction ? lastAction.observation : intro[1];
    els.actionTitle.textContent = 'どうする？';
    els.actionCount.textContent = s.acted ? '今日は行動済み' : '1回選べます';
    els.dogStage.dataset.distance = distanceForState(s);
    els.distanceLine.firstElementChild.style.width = `${Math.min(18 + s.visit * 11, 86)}%`;

    els.actions.innerHTML = '';
    GrayGame.availableFacilityActions().forEach(action => {
      const b = document.createElement('button');
      b.className = 'action-button';
      b.textContent = action.label;
      b.disabled = s.acted;
      b.addEventListener('click', () => {
        const result = GrayGame.doFacilityAction(action.id);
        if (!result) return;
        els.sceneText.textContent = result.result;
        els.observationText.textContent = result.observation;
        GrayGame.UI.render();
      });
      els.actions.appendChild(b);
    });

    els.advanceButton.classList.toggle('hidden', !s.acted);
    els.advanceButton.textContent = GrayGame.canTrial() ? 'トライアルへ進む' : '今日は帰る';
    els.advanceButton.onclick = () => {
      if (GrayGame.canTrial()) GrayGame.startTrial();
      else GrayGame.advanceFacility();
      GrayGame.UI.render();
    };
  }

  function renderHome(s) {
    const lastAction = s.acted ? GrayGame.data.HOME_ACTIONS.find(a => a.id === s.lastEvent) : null;
    els.chapterLabel.textContent = 'トライアル';
    els.dayLabel.textContent = `一緒に暮らして ${s.homeDay + 1}日目`;
    els.placeLabel.textContent = 'みどりの家';
    const defaultScene = s.homeDay === 0 ? 'グレイが家に来ました。玄関から室内を静かに見ています。' : '朝。グレイは昨日より少しだけ部屋の奥で過ごしています。';
    const defaultObservation = s.homeDay === 0 ? '知らない場所です。今日は「何もしない時間」も大切そうです。' : '生活の音を覚えながら、自分で休める場所を探しています。';
    els.sceneText.textContent = lastAction ? lastAction.text : defaultScene;
    els.observationText.textContent = lastAction ? lastAction.obs : defaultObservation;
    els.actionTitle.textContent = '今日はどう過ごす？';
    els.actionCount.textContent = s.acted ? '今日は行動済み' : '1回選べます';
    els.dogStage.dataset.distance = 'home';
    els.distanceLine.firstElementChild.style.width = `${Math.min(78 + s.homeDay * 3, 98)}%`;

    els.actions.innerHTML = '';
    GrayGame.data.HOME_ACTIONS.forEach(action => {
      const b = document.createElement('button');
      b.className = 'action-button';
      b.textContent = action.label;
      b.disabled = s.acted;
      b.addEventListener('click', () => {
        const result = GrayGame.doHomeAction(action.id);
        if (!result) return;
        els.sceneText.textContent = result.text;
        els.observationText.textContent = result.obs;
        GrayGame.UI.render();
      });
      els.actions.appendChild(b);
    });

    els.advanceButton.classList.toggle('hidden', !s.acted);
    els.advanceButton.textContent = '次の日へ';
    els.advanceButton.onclick = () => {
      GrayGame.advanceHome();
      GrayGame.UI.render();
    };
  }

  function openSheet(title, html) {
    els.sheetTitle.textContent = title;
    els.sheetContent.innerHTML = html;
    els.sheet.classList.remove('hidden');
  }

  function prepSheet() {
    const s = GrayGame.getState();
    const items = GrayGame.data.PREP_ITEMS.map(item => {
      const done = s.prep.includes(item.id);
      return `<button class="sheet-action ${done ? 'primary' : ''}" data-prep="${item.id}" ${done ? 'disabled' : ''}>${done ? '✓ ' : ''}${item.label}</button>`;
    }).join('');
    const trial = GrayGame.canTrial()
      ? '<button class="sheet-action primary" data-trial="1">準備できた。トライアルを始める</button>'
      : `<div class="info-card"><small>トライアルまで</small><strong>訪問を重ね、家の準備を4つ以上整えると進めます。現在 ${s.prep.length}/4。</strong></div>`;

    openSheet('迎える準備', `<div class="card-list">${GrayGame.data.PREP_ITEMS.map(item => {
      const done = s.prep.includes(item.id);
      return `<div class="info-card ${done ? 'done' : ''}"><small>${done ? '準備済み' : 'まだ'}</small><strong>${item.label}</strong></div>`;
    }).join('')}</div><div class="sheet-actions">${items}${trial}</div>`);

    els.sheetContent.querySelectorAll('[data-prep]').forEach(btn => {
      btn.addEventListener('click', () => {
        const item = GrayGame.data.PREP_ITEMS.find(x => x.id === btn.dataset.prep);
        if (!item) return;
        GrayGame.addPrep(item.id);
        GrayGame.addJournal(item.text, '家の準備');
        prepSheet();
      });
    });
    els.sheetContent.querySelector('[data-trial]')?.addEventListener('click', () => {
      GrayGame.startTrial();
      closeSheet();
      render();
    });
  }

  function journalSheet() {
    const s = GrayGame.getState();
    const firsts = s.firsts.length
      ? s.firsts.slice().reverse().map(x => `<div class="info-card done"><small>はじめて</small><strong>${x.label}</strong></div>`).join('')
      : '<div class="info-card"><strong>まだありません。</strong></div>';
    const journal = s.journal.map(x => `<div class="info-card"><small>${x.day}</small><strong>${x.text}</strong></div>`).join('');
    openSheet('グレイの記録', `<p class="progress-label">はじめての記録</p><div class="card-list">${firsts}</div><p class="progress-label">日記</p><div class="card-list">${journal}</div>`);
  }

  function saveSheet() {
    const s = GrayGame.getState();
    openSheet('保存', `<div class="card-list">
      <div class="info-card done"><small>専用セーブ</small><strong>private-game-data / gray-dog / saves / slot1.json</strong></div>
      <div class="info-card"><small>現在</small><strong>${s.mode === 'facility' ? `訪問 ${s.visit}回目` : `一緒に暮らして ${s.homeDay + 1}日目`}</strong></div>
      <div class="info-card" id="saveStatus"><small>端末</small><strong>操作のたびに予備保存しています。</strong></div>
    </div>
    <div class="sheet-actions">
      <button class="sheet-action primary" data-private-save="1">private-game-dataへセーブ</button>
      <button class="sheet-action" data-private-load="1">private-game-dataからロード</button>
      <button class="sheet-action danger" data-reset="1">端末データを最初からに戻す</button>
    </div>`);

    const status = () => els.sheetContent.querySelector('#saveStatus');
    const showStatus = (title, message, done = false) => {
      const box = status();
      if (!box) return;
      box.classList.toggle('done', done);
      box.innerHTML = `<small>${title}</small><strong>${message}</strong>`;
    };

    els.sheetContent.querySelector('[data-private-save]')?.addEventListener('click', async (event) => {
      event.currentTarget.disabled = true;
      showStatus('セーブ中', 'private-game-dataへ書き込んでいます。');
      try {
        const result = await GrayGame.savePrivate();
        if (result.skipped) showStatus('未保存', 'GitHubトークンが端末に登録されていません。');
        else showStatus('保存済み', 'グレイ専用セーブへ保存しました。', true);
      } catch (error) {
        console.error(error);
        showStatus('保存失敗', 'private-game-dataへの保存に失敗しました。端末の予備保存は残っています。');
      } finally {
        event.currentTarget.disabled = false;
      }
    });

    els.sheetContent.querySelector('[data-private-load]')?.addEventListener('click', async (event) => {
      event.currentTarget.disabled = true;
      showStatus('ロード中', 'グレイ専用セーブを読み込んでいます。');
      try {
        const result = await GrayGame.loadPrivate();
        if (result.skipped) {
          showStatus('未ロード', 'GitHubトークンが端末に登録されていません。');
        } else if (result.missing) {
          showStatus('セーブなし', 'グレイ専用セーブがまだありません。');
        } else {
          closeSheet();
          render();
        }
      } catch (error) {
        console.error(error);
        showStatus('ロード失敗', 'private-game-dataから読み込めませんでした。');
      } finally {
        event.currentTarget.disabled = false;
      }
    });

    els.sheetContent.querySelector('[data-reset]')?.addEventListener('click', () => {
      GrayGame.reset();
      closeSheet();
      render();
    });
  }

  function closeSheet() { els.sheet.classList.add('hidden'); }

  function render() {
    const s = GrayGame.getState();
    if (s.mode === 'home') renderHome(s);
    else renderFacility(s);
  }

  GrayGame.UI = {
    init() {
      cache();
      els.closeSheet.addEventListener('click', closeSheet);
      els.sheet.addEventListener('click', (e) => { if (e.target === els.sheet) closeSheet(); });
      els.menuButton.addEventListener('click', journalSheet);
      document.querySelectorAll('.nav-button').forEach(btn => {
        btn.addEventListener('click', () => {
          document.querySelectorAll('.nav-button').forEach(x => x.classList.remove('active'));
          btn.classList.add('active');
          const panel = btn.dataset.panel;
          if (panel === 'main') return closeSheet();
          if (panel === 'home') return prepSheet();
          if (panel === 'journal') return journalSheet();
          if (panel === 'settings') return saveSheet();
        });
      });
      render();
    },
    render,
    prepSheet,
    journalSheet,
    closeSheet
  };
})();