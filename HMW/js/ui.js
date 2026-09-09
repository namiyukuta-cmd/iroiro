(() => {
  "use strict";
  const H = window.HMW;
  const D = H.DATA;
  const G = H.Game;
  const { $, escapeHtml: esc, openModal, closeModal, info, travel } = G;

  function peopleActions() {
    const id = H.state.location;
    const slot = H.state.slot;
    const a = [];
    if (id === "charity_center" && slot !== 3) {
      a.push({ label: "名前付き支援員と話す", desc: "これまでの相談内容を踏まえて話す。", run: G.supportPersonTalk, disabled: !!H.state.daily.talk.support_named });
    }
    if ((id === "park" && slot >= 2) || id === "underpass") {
      a.push({ label: "名前付きホームレスと話す", desc: "顔見知りになるほど、寝場所や回収所の情報が具体的になる。", run: G.homelessTalk });
    }
    if ((id === "station_front" && slot >= 1) || id === "police_station") {
      a.push({ label: "名前付き警官と話す", desc: "支援先・巡回・距離の取り方が、前の接触から続く。", run: G.policeTalk, disabled: !!H.state.daily.talk.police_named });
    }
    if ((id === "underpass" && slot >= 2) || (id === "industrial_street" && slot >= 2)) {
      a.push({ label: "名前付き不良と話す", desc: "寝場所・危ない仕事・借りが後に残る。", run: G.thugTalk, disabled: !!H.state.daily.talk.thug_named });
      if (H.state.progression.thug.carryKnown) {
        a.push({ label: "中身不明の荷運びを受ける", desc: "900円。警察注意と相手への借りが残る。", run: G.thugJob });
      }
    }
    return a;
  }

  function locationActions() {
    const id = H.state.location;
    const slot = H.state.slot;
    const a = [];

    if (id === "station_front") {
      if (!H.state.knownLocations.charity_center) {
        a.push({ label: "掲示板を見る", desc: "支援・廃品回収・小仕事という別々の生活手段を知る。", run: G.board });
      }
      if (H.state.progression.informal.casualWorkKnown) {
        a.push({
          label: "今日の小仕事を確認する",
          desc: H.state.daily.casualChecked
            ? (H.state.daily.casualOffer ? "今日は搬入口の募集あり。" : "今日は募集なし。")
            : "書類不要の当日仕事が出ているか確認する。",
          run: G.checkCasualWork,
          disabled: H.state.daily.casualChecked
        });
        if (H.state.daily.casualOffer && !H.state.daily.casualDone) {
          a.push({ label: "荷下ろしを手伝う", desc: "荷札を見て実際に仕分ける小仕事。", run: G.casualWork });
        }
      }
      a.push({ label: "人に小銭を頼む", desc: "収入になるが、この場所で続ければ警察の注意が増える。", run: G.beg, disabled: (H.state.daily.beg[id] || 0) >= 2 });
      a.push({ label: "使える物を探す", desc: "三か所を自分で調べる。見つけた物は持ち帰れる。", run: G.scavenge, disabled: !!H.state.daily.scavenge[id] });
    }

    if (id === "shopping_street") {
      if (!H.state.knownLocations.convenience_store) {
        a.push({ label: "店と裏道を確認する", desc: "店・住宅裏・仕事につながる場所を把握する。", run: G.shoppingLook });
      }
      a.push({ label: "人に小銭を頼む", desc: "収入になるが、この場所での視線が増える。", run: G.beg, disabled: (H.state.daily.beg[id] || 0) >= 2 });
      a.push({ label: "使える物を探す", desc: "三か所を選んで調べる。", run: G.scavenge, disabled: !!H.state.daily.scavenge[id] });
    }

    if (["park", "riverside", "residential_alley", "industrial_street"].includes(id)) {
      a.push({ label: "使える物を探す", desc: id === "industrial_street" ? "金属片が見つかりやすい。三か所を選んで調べる。" : "三か所を選んで調べる。", run: G.scavenge, disabled: !!H.state.daily.scavenge[id] });
      a.push({ label: "休む", desc: "その場で時間を使い、疲労を戻す。", run: G.rest, disabled: !!H.state.daily.rest[id] });
    }

    if (id === "park" && slot === 3) a.push({ label: "公園で眠る", desc: "巡回情報や人との関係で、夜の結果が変わる。", run: () => G.sleepAt("park") });
    if (id === "underpass" && slot === 3) a.push({ label: "高架下で眠る", desc: "縄張りの話を通しているかで結果が変わる。", run: () => G.sleepAt("underpass") });
    if (id === "riverside" && slot === 3) a.push({ label: "河川敷で眠る", desc: "人目は少ないが天候の影響が強い。", run: () => G.sleepAt("riverside") });

    if (id === "charity_center") {
      a.push({ label: "食料支援を受ける", desc: "今日の食料を確保し、残りを持ち物に入れる。", run: G.foodSupport, disabled: H.state.daily.foodSupport || slot === 3 });
      a.push({ label: "支援相談をする", desc: H.state.progression.support.stage ? `前回の続き。次回 DAY${H.state.progression.support.nextDay} 以降` : "何を優先するか決め、継続相談を始める。", run: G.supportConsult, disabled: slot === 3 });
      a.push({ label: "洗面を使う", desc: "身支度を整える。", run: G.wash, disabled: !!H.state.daily.wash[id] || slot === 3 });
      if (slot === 3 && H.state.progression.support.shelterReferral) {
        a.push({ label: "一時宿泊の紹介を使う", desc: "今回の紹介を使って一晩休む。", run: () => G.sleepAt("charity_referral") });
      }
    }

    if (id === "public_toilet") {
      a.push({ label: "身支度する", desc: "衛生を戻す。", run: G.wash, disabled: !!H.state.daily.wash[id] });
      a.push({ label: "少し休む", desc: "長居はできないが疲労を戻せる。", run: G.rest, disabled: !!H.state.daily.rest[id] });
    }

    if (id === "convenience_store") {
      a.push({ label: "買い物をする", desc: "食料・水・衛生用品を買う。", run: G.openShop });
      a.push({ label: "店員と話す", desc: "同じ店を使った履歴が、小仕事や対応の変化につながる。", run: G.clerkTalk, disabled: !!H.state.daily.talk.clerk });
      if (H.state.progression.clerk.cleanupUnlocked && slot >= 2 && !H.state.daily.clerkWork) {
        a.push({ label: "店の裏を清掃する", desc: "汚れた場所を実際に片付ける小仕事。", run: G.clerkWork });
      }
    }

    if (id === "recycling_yard") {
      const count = (H.state.inventory.aluminum_can || 0) + (H.state.inventory.scrap_piece || 0);
      a.push({ label: "廃品を売る", desc: `${count}点。持ち込み回数が信用として残る。`, run: G.sellScrap, disabled: !count });
      if (H.state.progression.recycler.sales >= 2 && !H.state.progression.recycler.trialDone) {
        a.push({ label: "仕分けの試し仕事をする", desc: "回収物を実際に仕分ける。結果が継続仕事につながる。", run: G.recyclerTrial });
      }
      if (H.state.progression.recycler.recurringWork) {
        a.push({ label: "仕分け仕事をする", desc: "回収物を仕分けて報酬を得る。", run: G.recyclerWork, disabled: H.state.daily.recyclerWork });
      }
    }

    if (id === "labor_office") {
      a.push({
        label: "仕事の条件を確認する",
        desc: H.state.progression.support.workAccess ? "正式紹介を使える。" : "正式紹介には手続きが必要。別の仕事は使える。",
        run: () => info("仕事の条件", H.state.progression.support.workAccess
          ? "紹介可能。体力40以上・疲労75以下・衛生25以上・空腹82以下。"
          : "正式紹介はまだ不可。駅前の小仕事、回収所、店の清掃は別に利用できる。")
      });
      if (H.state.progression.support.workAccess) {
        a.push({ label: "倉庫の日雇いをする", desc: "伝票を見て箱を揃える作業。報酬は作業結果で変わる。", run: G.formalWork, disabled: H.state.daily.formalWork });
      }
    }

    if (id === "police_station") {
      a.push({ label: "名前付き警官に用件を伝える", desc: "前の接触を踏まえて、支援先や巡回を聞ける。", run: G.policeTalk, disabled: !!H.state.daily.talk.police_named });
    }

    return a;
  }

  function dynamicLeads() {
    const s = H.state;
    const list = s.leads.filter((x) => !x.done).map((x) => x.text);
    if (s.stats.hunger >= 72) list.unshift("空腹が強い。食料支援・購入・持ち物で戻せる");
    if (s.stats.fatigue >= 78) list.unshift("疲労が高い。休むか今夜の寝場所を優先");
    if (s.slot === 3) list.unshift("深夜。眠る場所を選ぶまで翌朝には進まない");
    if (s.world.policeAttention >= 3) list.push(`警察の注意度 ${s.world.policeAttention}`);
    return [...new Set(list)].slice(0, 5);
  }

  function renderStatus() {
    $("day").innerHTML = `DAY<b>${H.state.day}</b>`;
    $("time").innerHTML = `TIME<b>${esc(D.slots[H.state.slot])}</b>`;
    $("money").innerHTML = `MONEY<b>${H.state.money}</b>`;
    $("weather").textContent = H.state.world.weather === "rain" ? "☂️" : H.state.world.weather === "cold" ? "❄️" : "☀️";
    const s = H.state.stats;
    const fields = {
      health: ["体力", s.health],
      hunger: ["空腹", s.hunger],
      hygiene: ["衛生", s.hygiene],
      warmth: ["体温", s.warmth],
      wetness: ["濡れ", s.wetness],
      fatigue: ["疲労", s.fatigue]
    };
    Object.entries(fields).forEach(([id, value]) => { $(id).innerHTML = `${value[0]}<b>${value[1]}</b>`; });
    $("night-bed").textContent = "未定";
  }

  function renderCityScene() {
    const box = $("city-scene");
    if (!box) return;
    const scene = G.getCityScene?.();
    if (!scene) {
      box.classList.add("hidden");
      box.innerHTML = "";
      return;
    }
    box.classList.remove("hidden");
    box.innerHTML = `<strong>${esc(scene.title)}</strong><p>${esc(scene.text)}</p><div class="scene-choice-row"></div>`;
    const row = box.querySelector(".scene-choice-row");
    scene.actions.forEach((action) => {
      const b = document.createElement("button");
      b.className = "scene-choice";
      b.textContent = action.label;
      b.disabled = !!action.disabled;
      b.addEventListener("click", action.run);
      row.appendChild(b);
    });
  }

  function renderScene() {
    const loc = D.locations[H.state.location];
    $("location-name").textContent = loc.name;
    $("location-desc").textContent = loc.description;
    $("last-message").textContent = H.state.lastMessage;
    renderCityScene();
  }

  function modalAction(a) {
    return {
      label: a.label,
      disabled: !!a.disabled,
      onClick: () => {
        closeModal();
        a.run();
      }
    };
  }

  function openLocationActions() {
    if (H.state.activeEvent) return info("行動", "現在の出来事への対応が先になる。");
    const list = locationActions();
    if (!list.length) return info(D.locations[H.state.location].name, "今ここでできる特別な行動はない。");
    openModal(D.locations[H.state.location].name, "ここで何をするか選ぶ。", list.map(modalAction));
  }

  function openPeopleHere() {
    if (H.state.activeEvent) return info("人と関わる", "現在の出来事への対応が先になる。");
    const list = peopleActions();
    if (!list.length) return info("人と関わる", "今ここで話しかけられる相手はいない。");
    openModal("人と関わる", "今ここにいる相手。", list.map(modalAction));
  }

  function mainButton(label, run) {
    const b = document.createElement("button");
    b.className = "primary-action";
    b.textContent = label;
    b.addEventListener("click", run);
    return b;
  }

  function eventButton(label, run, disabled = false) {
    const b = document.createElement("button");
    b.className = "action-btn";
    b.textContent = label;
    b.disabled = !!disabled;
    b.addEventListener("click", run);
    return b;
  }

  function renderActions() {
    const box = $("action-list");
    box.innerHTML = "";
    if (H.state.activeEvent) {
      const e = H.state.activeEvent;
      const panel = document.createElement("div");
      panel.className = "event-panel";
      panel.innerHTML = `<h2>${esc(e.title)}</h2><p>${esc(e.text)}</p>`;
      const choices = document.createElement("div");
      choices.className = "action-grid";
      e.choices.forEach((x) => choices.appendChild(eventButton(x.label, () => G.resolveEvent(x.id), x.disabled)));
      panel.appendChild(choices);
      box.appendChild(panel);
      return;
    }
    box.appendChild(mainButton("行動する", openLocationActions));
    box.appendChild(mainButton("人と関わる", openPeopleHere));
    box.appendChild(mainButton("移動する", openMap));
  }

  function openMap() {
    if (H.state.activeEvent) return info("マップ", "現在の出来事への対応が先になる。");
    const current = H.state.location;
    const list = Object.keys(D.locations)
      .filter((id) => H.state.knownLocations[id] && id !== current)
      .map((id) => ({ label: D.locations[id].name, onClick: () => travel(id) }));
    openModal("マップ", `現在地：${D.locations[current].name}`, list.length ? list : [{ label: "まだ他の場所を知らない", disabled: true }]);
  }

  function openInventory() {
    const entries = Object.entries(H.state.inventory).filter(([, qty]) => qty > 0);
    const html = entries.length
      ? entries.map(([id, qty]) => `<div class="inventory-row"><b>${esc(D.items[id]?.name || id)}</b> × ${qty}</div>`).join("")
      : "<p>持ち物はない。</p>";
    const buttons = [];
    entries.forEach(([id]) => {
      const item = D.items[id];
      if (item && ["hunger", "health", "hygiene", "warmth", "wetness"].some((k) => typeof item[k] === "number")) {
        buttons.push({ label: `${item.name}を使う`, onClick: () => G.useItem(id) });
      }
    });
    openModal("持ち物", html, buttons, true);
  }

  function openPeople() {
    const html = Object.entries(D.people).map(([id, person]) => {
      const r = G.rel(id);
      return `<div class="person-row"><b>${esc(person.name)}</b> ${esc(person.role)}${person.romance ? "<br><span class=\"muted\">特別な関係に発展する可能性がある人物</span>" : ""}<br><span class="pill">面識 ${r.familiarity}</span><span class="pill">信頼 ${r.trust}</span><span class="pill">好意 ${r.goodwill}</span><span class="pill">苛立ち ${r.irritation}</span></div>`;
    }).join("");
    openModal("人物", html, [], true);
  }

  function openTasks() {
    const stability = typeof G.stabilityScore === "function" ? G.stabilityScore() : 0;
    const leads = dynamicLeads();
    const html = `<div class="menu-summary"><b>生活基盤 ${stability}/5</b><br><span class="stability-dots">${"●".repeat(stability)}${"○".repeat(5 - stability)}</span></div>` +
      `<div class="menu-summary"><b>今ある用事</b>${leads.length ? leads.map((x) => `<div class="task-row">${esc(x)}</div>`).join("") : "<p>特になし</p>"}</div>`;
    openModal("状況", html, [], true);
  }

  function openLog() {
    openModal("記録", H.state.history.map((x) => `<div class="log-row">${esc(x)}</div>`).join(""), [], true);
  }

  function openSave() {
    openModal("セーブ / ロード", "端末保存。トークン登録済みならprivate-game-dataにも同期。", [
      { label: "セーブ", onClick: async () => { closeModal(); await H.saveGame(); refresh(); } },
      { label: "ロード", onClick: async () => { closeModal(); await H.loadGame(); G.ensureState(); refresh(); } },
      { label: "最初から", className: "danger", onClick: () => openModal("最初から", "現在のセーブを上書きする。", [
        { label: "最初から始める", className: "danger", onClick: () => { H.state = H.createInitialState(); H.saveLocal(); closeModal(); refresh(); } },
        { label: "やめる", onClick: closeModal }
      ]) }
    ]);
  }

  function openMenu() {
    openModal("メニュー", "", [
      { label: "状況・今ある用事", onClick: () => { closeModal(); openTasks(); } },
      { label: "人物一覧", onClick: () => { closeModal(); openPeople(); } }
    ]);
  }

  function refresh() {
    renderStatus();
    renderScene();
    renderActions();
    H.saveLocal();
  }

  G.refresh = refresh;

  document.addEventListener("DOMContentLoaded", () => {
    $("nav-menu").addEventListener("click", openMenu);
    $("nav-map").addEventListener("click", openMap);
    $("nav-inventory").addEventListener("click", openInventory);
    $("nav-log").addEventListener("click", openLog);
    $("nav-save").addEventListener("click", openSave);
    $("modal-close").addEventListener("click", closeModal);
    $("modal-backdrop").addEventListener("click", (e) => { if (e.target === $("modal-backdrop")) closeModal(); });
    H.loadLocal();
    G.ensureState();
    if (!H.state.world.weather) H.state.world.weather = "clear";
    G.locState(H.state.location).visits += 1;
    refresh();
  });
})();