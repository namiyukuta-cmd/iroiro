window.GrayGame = window.GrayGame || {};

(() => {
  "use strict";

  const $ = (id) => document.getElementById(id);
  const els = {};
  let placementMode = "";

  function cache() {
    [
      "chapterLabel","dayLabel","placeLabel","sceneText","feedbackBadge","dogStage",
      "interactionBoard","boardPrompt","zoneTrack","observationText",
      "actionTitle","actionCount","actions","advanceButton","sheet","sheetTitle",
      "sheetContent","closeSheet","menuButton"
    ].forEach((id) => els[id] = $(id));
  }

  function dogDistanceForGap(s) {
    const gap = Math.max(0, s.grayZone - s.playerZone);
    if (gap >= 3) return "far";
    if (gap >= 2) return "mid";
    return "near";
  }

  function facilityIntro(s) {
    if (s.visit === 1) return [
      "大きな黒灰色の犬が、部屋の奥で伏せています。",
      "まだこちらから距離を取っています。今日は4回だけ、同じ場所で過ごせます。"
    ];
    if (s.visit <= 3) return [
      "前と同じ部屋にグレイがいます。入ってきたことには気づいています。",
      "前回より、こちらの動きを確認する時間が短くなっています。"
    ];
    if (s.visit <= 6) return [
      "グレイはこちらを一度見てから、伏せ直しました。",
      "最初の頃より、近い位置でもその場に残るようになっています。"
    ];
    return [
      "部屋へ入ると、グレイの耳が先にこちらへ向きました。",
      "来訪そのものには、もうかなり慣れています。"
    ];
  }

  function renderBoard(s) {
    const labels = ["4m","3m","2m","1m","寝床"];
    els.zoneTrack.innerHTML = "";

    labels.forEach((label, zone) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "zone-button";
      b.dataset.zone = String(zone);

      const markers = [];
      if (s.playerZone === zone) markers.push('<span class="zone-marker you">●</span>');
      if (s.grayZone === zone) markers.push('<span class="zone-marker gray">G</span>');
      if (s.snackZone === zone) markers.push('<span class="zone-marker snack">◆</span>');

      b.innerHTML = `<span class="zone-label">${label}</span><span class="zone-markers">${markers.join("")}</span>`;

      const validSit = placementMode === "sit" && zone <= 3 && zone < s.grayZone;
      const validSnack = placementMode === "snack" && zone >= 1 && zone <= 3 && zone > s.playerZone && zone < s.grayZone;
      const selectable = validSit || validSnack;
      b.classList.toggle("selectable", selectable);
      b.disabled = !!placementMode && !selectable;

      if (selectable) {
        b.addEventListener("click", () => {
          const done = placementMode === "sit"
            ? GrayGame.sitAt(zone)
            : GrayGame.placeSnack(zone);
          if (!done) return;
          placementMode = "";
          render();
        });
      }

      els.zoneTrack.appendChild(b);
    });

    if (placementMode === "sit") {
      els.boardPrompt.textContent = "座る位置をタップ";
    } else if (placementMode === "snack") {
      els.boardPrompt.textContent = "おやつを置く位置をタップ";
    } else {
      const gap = Math.max(0, s.grayZone - s.playerZone);
      els.boardPrompt.textContent = gap <= 1
        ? "グレイはすぐ近くにいます。"
        : `今は ${gap}区画ぶん離れています。`;
    }
  }

  function actionButton(label, id, onClick, options = {}) {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "action-button";
    if (options.selected) b.classList.add("selected");
    b.innerHTML = options.note
      ? `<strong>${label}</strong><small>${options.note}</small>`
      : `<strong>${label}</strong>`;
    b.disabled = !!options.disabled;
    b.dataset.action = id;
    b.addEventListener("click", onClick);
    return b;
  }

  function renderFacility(s) {
    const intro = facilityIntro(s);

    els.chapterLabel.textContent = "保護施設";
    els.dayLabel.textContent = `訪問 ${s.visit}回目`;
    els.placeLabel.textContent = "譲渡会の一角";
    els.sceneText.textContent = s.lastResultText || intro[0];
    els.observationText.textContent = s.lastObservationText || intro[1];
    els.actionTitle.textContent = placementMode ? "位置を選ぶ" : "どう過ごす？";
    els.actionCount.textContent = `あと ${s.momentsLeft}回`;

    els.interactionBoard.classList.remove("hidden");
    renderBoard(s);

    const approached = s.lastOutcome === "approach";
    els.feedbackBadge.classList.toggle("hidden", !approached);
    els.feedbackBadge.textContent = approached ? "グレイが動いた" : "";
    els.feedbackBadge.dataset.outcome = approached ? "fit" : "";

    els.dogStage.dataset.distance = dogDistanceForGap(s);
    els.dogStage.dataset.outcome = approached ? "fit" : "";

    els.actions.innerHTML = "";

    if (s.momentsLeft > 0) {
      els.actions.appendChild(actionButton(
        "座る位置を決める",
        "sit",
        () => {
          placementMode = placementMode === "sit" ? "" : "sit";
          render();
        },
        { selected: placementMode === "sit", note:"4m〜1mから選ぶ" }
      ));

      const gap = Math.max(0, s.grayZone - s.playerZone);
      els.actions.appendChild(actionButton(
        "おやつを置く",
        "snack",
        () => {
          placementMode = placementMode === "snack" ? "" : "snack";
          render();
        },
        { selected: placementMode === "snack", disabled:gap <= 1, note:gap <= 1 ? "もう間に置く場所がない" : "間の地点を選んで置く" }
      ));

      els.actions.appendChild(actionButton(
        "そのまま待つ",
        "wait",
        () => {
          placementMode = "";
          if (GrayGame.waitQuietly()) render();
        },
        { note:"グレイから動ける時間を作る" }
      ));

      if (s.visit >= 3) {
        els.actions.appendChild(actionButton(
          "手を低く出して待つ",
          "hand",
          () => {
            placementMode = "";
            if (GrayGame.offerHand()) render();
          },
          { note:"届く距離なら匂いを確認できる" }
        ));

        els.actions.appendChild(actionButton(
          "一緒に散歩する",
          "walk",
          () => {
            placementMode = "";
            if (GrayGame.takeWalk()) render();
          },
          { note:"戻った後の位置が変わることがある" }
        ));
      }
    }

    els.advanceButton.classList.toggle("hidden", s.momentsLeft > 0);
    els.advanceButton.textContent = GrayGame.canTrial() ? "トライアルへ進む" : "今日は帰る";
    els.advanceButton.onclick = () => {
      placementMode = "";
      if (GrayGame.canTrial()) GrayGame.startTrial();
      else GrayGame.advanceFacility();
      render();
      window.scrollTo({ top:0, behavior:"smooth" });
    };
  }

  function renderHome(s) {
    placementMode = "";
    els.interactionBoard.classList.add("hidden");

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
      els.actions.appendChild(actionButton(
        used ? `✓ ${action.label}` : action.label,
        action.id,
        () => {
          if (GrayGame.doHomeAction(action.id)) render();
        },
        { disabled:s.momentsLeft <= 0 || used }
      ));
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
      : `<div class="info-card"><small>トライアルまで</small><strong>訪問6回以上・家の準備4つ以上・手の匂いを確認できるところまで進むと開始できます。現在 準備 ${s.prep.length}/4。</strong></div>`;

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
        if (result.skipped) {
          showStatus("未ロード", "GitHubトークンが端末に登録されていません。");
        } else if (result.missing) {
          showStatus("セーブなし", "グレイ専用セーブがまだありません。");
        } else {
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
      placementMode = "";
      closeSheet();
      render();
    });
  }

  function closeSheet() {
    els.sheet.classList.add("hidden");
  }

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