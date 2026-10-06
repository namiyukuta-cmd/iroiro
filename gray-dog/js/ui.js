window.GrayGame = window.GrayGame || {};

(() => {
  const $ = (id) => document.getElementById(id);
  const els = {};

  function cache() {
    ['chapterLabel','dayLabel','placeLabel','sceneText','feedbackBadge','dogStage','distanceLine','observationLabel','observationText','careStatus','actionTitle','actionCount','actions','advanceButton','sheet','sheetTitle','sheetContent','closeSheet','menuButton'].forEach(id => els[id] = $(id));
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
    const intros = [
      ['初めて会うグレイは、少し離れた場所で伏せています。','こちらを見ません。耳だけが、ときどき周囲の音を追っています。'],
      ['二度目。グレイは前と同じ場所にいます。','入ってきたことには気づいています。前回より確認が少し早いようです。'],
      ['三度目。今日はスタッフが散歩用のリードを用意しています。','グレイはこちらを一度見て、そのまま伏せ直しました。']
    ];
    const intro = intros[Math.min(Math.max(s.visit - 1, 0), intros.length - 1)];

    els.chapterLabel.textContent = '保護施設';
    els.dayLabel.textContent = `訪問 ${s.visit}回目`;
    els.placeLabel.textContent = '譲渡会の一角';
    els.sceneText.textContent = s.lastResultText || intro[0];
    els.observationLabel.textContent = '今日の様子';
    els.observationText.textContent = s.lastObservationText || intro[1];
    els.careStatus.classList.add('hidden');
    els.feedbackBadge.classList.add('hidden');
    els.distanceLine.classList.remove('hidden');

    els.actionTitle.textContent = '今日はどう過ごす？';
    els.actionCount.textContent = s.momentsLeft > 0 ? '1回だけ' : '今日はここまで';
    els.dogStage.dataset.distance = distanceForState(s);
    els.dogStage.dataset.outcome = '';
    els.distanceLine.firstElementChild.style.width = `${Math.min(18 + s.visit * 18, 72)}%`;

    els.actions.innerHTML = '';
    GrayGame.availableFacilityActions().forEach(action => {
      const b = document.createElement('button');
      b.className = 'action-button';
      b.innerHTML = `<strong>${action.label}</strong>`;
      b.disabled = s.momentsLeft <= 0;
      b.addEventListener('click', () => {
        if (!GrayGame.doFacilityAction(action.id)) return;
        render();
      });
      els.actions.appendChild(b);
    });

    const canGoHome = GrayGame.canTrial();
    els.advanceButton.classList.toggle('hidden', !canGoHome && s.momentsLeft > 0);
    els.advanceButton.textContent = canGoHome ? 'グレイを迎える' : '今日は帰る';
    els.advanceButton.onclick = () => {
      if (canGoHome) GrayGame.startTrial();
      else GrayGame.advanceFacility();
      render();
    };
  }

  function careLabel(value) {
    if (value >= 80) return '十分';
    if (value >= 55) return '安定';
    if (value >= 35) return '少し気になる';
    return '要注意';
  }

  function renderCareStatus(s) {
    const items = [
      ['satiety','ごはん'],
      ['water','水'],
      ['energy','元気'],
      ['hygiene','清潔'],
      ['health','体調'],
      ['calm','安心']
    ];
    els.careStatus.innerHTML = items.map(([key,label]) => {
      const value = s.care[key];
      return `<div class="care-stat">
        <div class="care-stat-head"><span>${label}</span><small>${careLabel(value)}</small></div>
        <div class="care-meter"><span style="width:${value}%"></span></div>
      </div>`;
    }).join('');
  }

  function renderHome(s) {
    const need = GrayGame.lowestCareNeed();
    const time = GrayGame.homeTimeLabel();

    els.chapterLabel.textContent = 'グレイとの暮らし';
    els.dayLabel.textContent = `${s.homeDay + 1}日目・${time}`;
    els.placeLabel.textContent = 'みどりの家';

    const firstScene = 'グレイが家に来ました。まずは、この家で食べて、眠って、散歩して暮らしていきます。';
    const normalScene = s.daySummary || 'グレイは自分の寝床と水入れの場所を覚えながら過ごしています。';

    els.sceneText.textContent = s.lastResultText || (s.homeDay === 0 ? firstScene : normalScene);
    els.observationLabel.textContent = '今の様子';
    els.observationText.textContent = s.lastObservationText || (
      need.value < 35
        ? `${need.label}がかなり気になります。先に整えた方がよさそうです。`
        : need.value < 55
          ? `${need.label}が少し下がっています。`
          : '今のところ大きく崩れているところはありません。'
    );

    els.careStatus.classList.remove('hidden');
    renderCareStatus(s);
    els.distanceLine.classList.add('hidden');
    els.dogStage.dataset.distance = 'home';
    els.dogStage.dataset.outcome = s.lastOutcome || '';

    const isFirst = s.lastOutcome === 'first';
    els.feedbackBadge.classList.toggle('hidden', !isFirst);
    els.feedbackBadge.textContent = isFirst ? 'はじめて' : '';
    els.feedbackBadge.dataset.outcome = isFirst ? 'fit' : '';

    els.actionTitle.textContent = `${time}の世話`;
    els.actionCount.textContent = s.momentsLeft > 0 ? `あと ${s.momentsLeft}回` : '今日は終了';

    els.actions.innerHTML = '';
    GrayGame.availableHomeActions().forEach(action => {
      const used = s.usedActions.includes(action.id);
      const b = document.createElement('button');
      b.className = 'action-button care-action';
      b.innerHTML = `<strong>${used ? '✓ ' : ''}${action.label}</strong><small>${action.hint}</small>`;
      b.disabled = s.momentsLeft <= 0 || used;
      b.addEventListener('click', () => {
        const result = GrayGame.doHomeAction(action.id);
        if (!result) return;
        render();
      });
      els.actions.appendChild(b);
    });

    els.advanceButton.classList.toggle('hidden', s.momentsLeft > 0);
    els.advanceButton.textContent = '眠る・次の日へ';
    els.advanceButton.onclick = () => {
      GrayGame.advanceHome();
      render();
      window.scrollTo({ top:0, behavior:'smooth' });
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
    const trial = s.mode === 'facility' && GrayGame.canTrial()
      ? '<button class="sheet-action primary" data-trial="1">グレイを迎える</button>'
      : '';

    openSheet('生活用品', `<div class="card-list">${GrayGame.data.PREP_ITEMS.map(item => {
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
      <div class="info-card" id="saveStatus"><small>保存方式</small><strong>自動保存しません。「保存」を押した時だけ保存します。</strong></div>
    </div>
    <div class="sheet-actions">
      <button class="sheet-action primary" data-private-save="1">private-game-dataへセーブ</button>
      <button class="sheet-action" data-private-load="1">private-game-dataからロード</button>
      <button class="sheet-action" data-local-load="1">端末の保存からロード</button>
      <button class="sheet-action danger" data-reset="1">保存せず最初から</button>
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
        if (result.skipped) {
          const localOk = GrayGame.saveLocalManual();
          showStatus(localOk ? '端末へ保存済み' : '未保存', localOk ? 'GitHubトークンがないため端末だけに保存しました。' : '保存できませんでした。', localOk);
        } else {
          showStatus('保存済み', 'グレイ専用セーブと端末へ保存しました。', true);
        }
      } catch (error) {
        console.error(error);
        const localOk = GrayGame.saveLocalManual();
        showStatus('GitHub保存失敗', localOk ? 'private-game-dataへの保存は失敗しましたが、端末には保存しました。' : 'private-game-dataにも端末にも保存できませんでした。', localOk);
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

    els.sheetContent.querySelector('[data-local-load]')?.addEventListener('click', () => {
      const loaded = GrayGame.loadLocalManual();
      if (!loaded) {
        showStatus('端末セーブなし', '端末に明示保存したデータはありません。');
        return;
      }
      closeSheet();
      render();
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