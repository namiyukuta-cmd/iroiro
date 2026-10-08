window.GrayGame = window.GrayGame || {};

(() => {
  "use strict";

  const $ = (id) => document.getElementById(id);
  const els = {};

  function cache() {
    [
      "chapterLabel","dayLabel","placeLabel","sceneText","feedbackBadge","dogStage",
      "observationText","actionTitle","actionCount","actions","advanceButton","sheet",
      "sheetTitle","sheetContent","closeSheet","menuButton"
    ].forEach((id) => els[id] = $(id));
  }

  function relationStage(s) {
    const total = Object.values(s.actionCounts || {}).reduce((a,b) => a + b, 0);
    const progress = Math.max(total, Math.floor((s.visit || 1) / 2), Math.floor((s.familiarity || 0) / 2));
    if (progress >= 8) return "near";
    if (progress >= 3) return "mid";
    return "far";
  }

  function facilityIntro(s) {
    const ids = new Set((s.firsts || []).map(x => x.id));

    if (ids.has("walk_wait") || ids.has("beside_rest") || ids.has("hand_stay")) return [
      "部屋へ入ると、グレイが顔を上げます。少しして、自分からこちらの近くまで来ました。",
      "もう「ただ耐えている」だけではありません。グレイの方から距離を縮めています。"
    ];

    if (ids.has("nose_touch") || ids.has("walk_side")) return [
      "こちらが入ると、グレイはすぐに気づいて顔を上げました。",
      "前より明らかにこちらを意識しています。離れるのではなく、その場に残っています。"
    ];

    if (ids.has("snack_near") || ids.has("look_back")) return [
      "前と同じ場所にグレイがいます。こちらが入ると、一度こちらを見ました。",
      "以前より確認が早く、そのまま落ち着いて伏せています。"
    ];

    if (s.visit === 1) return [
      "大きな黒灰色の犬が、少し離れた場所で伏せています。",
      "こちらを見ません。耳だけが、ときどき周囲の音を追っています。"
    ];

    if (s.visit >= 10) return [
      "部屋へ入ると、グレイがすぐに顔を上げます。こちらを見たまま、少し近い場所へ移って伏せました。",
      "何度も会ってきた相手として、こちらをはっきり覚えています。"
    ];

    if (s.visit >= 6) return [
      "こちらが入ると、グレイは顔を上げてしばらくこちらを見ます。",
      "もう毎回『知らない人』として見ているわけではありません。"
    ];

    return [
      "グレイはこちらの来訪には気づいています。",
      "前より落ち着いて、同じ場所にいられます。"
    ];
  }

  function addActionButton(id, label, note="") {
    const b = document.createElement("button");
    b.className = "action-button";
    b.innerHTML = note ? `<strong>${label}</strong><small>${note}</small>` : `<strong>${label}</strong>`;
    b.addEventListener("click", () => {
      if (!GrayGame.doFacilityAction(id)) return;
      render();
    });
    els.actions.appendChild(b);
  }

  function renderFacility(s) {
    const intro = facilityIntro(s);
    els.chapterLabel.textContent = "保護施設";
    els.dayLabel.textContent = `訪問 ${s.visit}回目`;
    els.placeLabel.textContent = "譲渡会の一角";
    els.sceneText.textContent = s.lastResultText || intro[0];
    els.observationText.textContent = s.lastObservationText || intro[1];
    els.actionTitle.textContent = "どう過ごす？";
    els.actionCount.textContent = `あと ${s.momentsLeft}回`;

    const first = s.lastOutcome === "first";
    els.feedbackBadge.classList.toggle("hidden", !first);
    els.feedbackBadge.textContent = first ? "はじめて" : "";
    els.feedbackBadge.dataset.outcome = first ? "fit" : "";

    els.dogStage.dataset.distance = relationStage(s);
    els.dogStage.dataset.outcome = first ? "fit" : "";

    els.actions.innerHTML = "";
    if (s.momentsLeft > 0) {
      GrayGame.availableFacilityActions().forEach((id) => {
        const meta = GrayGame.data.ACTIONS[id];
        const notes = {
          sit:"何も求めず同じ場所で過ごす",
          snack:"手渡しせず置いて待つ",
          hand:"グレイから確認できるようにする",
          walk:"短く外を歩く",
          staff:"最近の様子を聞く"
        };
        addActionButton(id, meta.label, notes[id]);
      });
    }

    els.advanceButton.classList.toggle("hidden", s.momentsLeft > 0);
    els.advanceButton.textContent = GrayGame.canTrial() ? "トライアルへ進む" : "今日は帰る";
    els.advanceButton.onclick = () => {
      if (GrayGame.canTrial()) GrayGame.startTrial();
      else GrayGame.advanceFacility();
      render();
      window.scrollTo({ top:0, behavior:"smooth" });
    };
  }

  function renderHome(s) {
    els.chapterLabel.textContent = "トライアル";
    els.dayLabel.textContent = `一緒に暮らして ${s.homeDay + 1}日目`;
    els.placeLabel.textContent = "みどりの家";

    const defaultScene = s.homeDay === 0
      ? "グレイが家に来ました。玄関から室内を静かに見ています。"
      : "朝。グレイは昨日より少しだけ部屋の奥で過ごしています。";
    const defaultObservation = s.homeDay === 0
      ? "知らない場所です。今日は何もしない時間も大切そうです。"
      : "生活の音を覚えながら、自分で休める場所を探しています。";

    els.sceneText.textContent = s.lastResultText || defaultScene;
    els.observationText.textContent = s.lastObservationText || defaultObservation;
    els.actionTitle.textContent = "今日はどう過ごす？";
    els.actionCount.textContent = `あと ${s.momentsLeft}回`;

    els.feedbackBadge.classList.add("hidden");
    els.dogStage.dataset.distance = "home";
    els.dogStage.dataset.outcome = "";

    els.actions.innerHTML = "";
    GrayGame.data.HOME_ACTIONS.forEach((action) => {
      const used = s.usedActions.includes(action.id);
      const b = document.createElement("button");
      b.className = "action-button";
      b.innerHTML = `<strong>${used ? "✓ " : ""}${action.label}</strong>`;
      b.disabled = s.momentsLeft <= 0 || used;
      b.addEventListener("click", () => {
        if (GrayGame.doHomeAction(action.id)) render();
      });
      els.actions.appendChild(b);
    });

    els.advanceButton.classList.toggle("hidden", s.momentsLeft > 0);
    els.advanceButton.textContent = "次の日へ";
    els.advanceButton.onclick = () => {
      GrayGame.advanceHome();
      render();
    };
  }

  function openSheet(title, html) {
    els.sheetTitle.textContent = title;
    els.sheetContent.innerHTML = html;
    els.sheet.classList.remove("hidden");
  }

  function prepSheet() {
    const s = GrayGame.getState();
    const items = GrayGame.data.PREP_ITEMS.map((item) => {
      const done = s.prep.includes(item.id);
      return `<button class="sheet-action ${done ? "primary" : ""}" data-prep="${item.id}" ${done ? "disabled" : ""}>${done ? "✓ " : ""}${item.label}</button>`;
    }).join("");

    const trial = GrayGame.canTrial()
      ? '<button class="sheet-action primary" data-trial="1">準備できた。トライアルを始める</button>'
      : `<div class="info-card"><small>トライアルまで</small><strong>訪問6回以上・家の準備4つ以上・手の匂い確認・散歩まで進むと開始できます。現在 準備 ${s.prep.length}/4。</strong></div>`;

    openSheet("迎える準備", `<div class="card-list">${GrayGame.data.PREP_ITEMS.map((item) => {
      const done = s.prep.includes(item.id);
      return `<div class="info-card ${done ? "done" : ""}"><small>${done ? "準備済み" : "まだ"}</small><strong>${item.label}</strong></div>`;
    }).join("")}</div><div class="sheet-actions">${items}${trial}</div>`);

    els.sheetContent.querySelectorAll("[data-prep]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const item = GrayGame.data.PREP_ITEMS.find((x) => x.id === btn.dataset.prep);
        if (!item) return;
        GrayGame.addPrep(item.id);
        GrayGame.addJournal(item.text, "家の準備");
        prepSheet();
      });
    });

    els.sheetContent.querySelector("[data-trial]")?.addEventListener("click", () => {
      GrayGame.startTrial();
      closeSheet();
      render();
    });
  }

  function journalSheet() {
    const s = GrayGame.getState();
    const firsts = s.firsts.length
      ? s.firsts.slice().reverse().map((x) => `<div class="info-card done"><small>はじめて</small><strong>${x.label}</strong></div>`).join("")
      : '<div class="info-card"><strong>まだありません。</strong></div>';
    const journal = s.journal.map((x) => `<div class="info-card"><small>${x.day}</small><strong>${x.text}</strong></div>`).join("");
    openSheet("グレイの記録", `<p class="progress-label">はじめての記録</p><div class="card-list">${firsts}</div><p class="progress-label">日記</p><div class="card-list">${journal}</div>`);
  }

  function saveSheet() {
    const s = GrayGame.getState();
    openSheet("保存", `<div class="card-list">
      <div class="info-card done"><small>専用セーブ</small><strong>private-game-data / gray-dog / saves / slot1.json</strong></div>
      <div class="info-card"><small>現在</small><strong>${s.mode === "facility" ? `訪問 ${s.visit}回目` : `一緒に暮らして ${s.homeDay + 1}日目`}</strong></div>
      <div class="info-card" id="saveStatus"><small>保存方式</small><strong>自動保存しません。「保存」を押した時だけ保存します。</strong></div>
    </div>
    <div class="sheet-actions">
      <button class="sheet-action primary" data-private-save="1">private-game-dataへセーブ</button>
      <button class="sheet-action" data-private-load="1">private-game-dataからロード</button>
      <button class="sheet-action" data-local-load="1">端末の保存からロード</button>
      <button class="sheet-action danger" data-reset="1">保存せず最初から</button>
    </div>`);

    const status = () => els.sheetContent.querySelector("#saveStatus");
    const showStatus = (title, message, done = false) => {
      const box = status();
      if (!box) return;
      box.classList.toggle("done", done);
      box.innerHTML = `<small>${title}</small><strong>${message}</strong>`;
    };

    els.sheetContent.querySelector("[data-private-save]")?.addEventListener("click", async (event) => {
      event.currentTarget.disabled = true;
      showStatus("セーブ中", "private-game-dataへ書き込んでいます。");
      try {
        const result = await GrayGame.savePrivate();
        if (result.skipped) {
          const localOk = GrayGame.saveLocalManual();
          showStatus(localOk ? "端末へ保存済み" : "未保存", localOk ? "GitHubトークンがないため端末だけに保存しました。" : "保存できませんでした。", localOk);
        } else {
          showStatus("保存済み", "グレイ専用セーブと端末へ保存しました。", true);
        }
      } catch (error) {
        console.error(error);
        const localOk = GrayGame.saveLocalManual();
        showStatus("GitHub保存失敗", localOk ? "private-game-dataへの保存は失敗しましたが、端末には保存しました。" : "private-game-dataにも端末にも保存できませんでした。", localOk);
      } finally {
        event.currentTarget.disabled = false;
      }
    });

    els.sheetContent.querySelector("[data-private-load]")?.addEventListener("click", async (event) => {
      event.currentTarget.disabled = true;
      showStatus("ロード中", "グレイ専用セーブを読み込んでいます。");
      try {
        const result = await GrayGame.loadPrivate();
        if (result.skipped) showStatus("未ロード", "GitHubトークンが端末に登録されていません。");
        else if (result.missing) showStatus("セーブなし", "グレイ専用セーブがまだありません。");
        else {
          closeSheet();
          render();
        }
      } catch (error) {
        console.error(error);
        showStatus("ロード失敗", "private-game-dataから読み込めませんでした。");
      } finally {
        event.currentTarget.disabled = false;
      }
    });

    els.sheetContent.querySelector("[data-local-load]")?.addEventListener("click", () => {
      const loaded = GrayGame.loadLocalManual();
      if (!loaded) {
        showStatus("端末セーブなし", "端末に明示保存したデータはありません。");
        return;
      }
      closeSheet();
      render();
    });

    els.sheetContent.querySelector("[data-reset]")?.addEventListener("click", () => {
      GrayGame.reset();
      closeSheet();
      render();
    });
  }

  function closeSheet() { els.sheet.classList.add("hidden"); }

  function render() {
    const s = GrayGame.getState();
    if (s.mode === "home") renderHome(s);
    else renderFacility(s);
  }

  GrayGame.UI = {
    init() {
      cache();
      els.closeSheet.addEventListener("click", closeSheet);
      els.sheet.addEventListener("click", (e) => { if (e.target === els.sheet) closeSheet(); });
      els.menuButton.addEventListener("click", journalSheet);
      document.querySelectorAll(".nav-button").forEach((btn) => {
        btn.addEventListener("click", () => {
          document.querySelectorAll(".nav-button").forEach((x) => x.classList.remove("active"));
          btn.classList.add("active");
          const panel = btn.dataset.panel;
          if (panel === "main") return closeSheet();
          if (panel === "home") return prepSheet();
          if (panel === "journal") return journalSheet();
          if (panel === "settings") return saveSheet();
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