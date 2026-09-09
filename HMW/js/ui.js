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
      a.push({ label: "名前付き支援員と話す", desc: "話す内容を選ぶ。", run: G.supportPersonTalk, disabled: !!H.state.daily.talk.support_named });
    }
    if ((id === "park" && slot >= 2) || id === "underpass") {
      a.push({ label: "名前付きホームレスと話す", desc: "情報・食料・寝場所の選択がある。", run: G.homelessTalk });
    }
    if ((id === "station_front" && slot >= 1) || id === "police_station") {
      a.push({ label: "名前付き警官と話す", desc: "支援・巡回・距離の選択がある。", run: G.policeTalk, disabled: !!H.state.daily.talk.police_named });
    }
    if ((id === "underpass" && slot >= 2) || (id === "industrial_street" && slot >= 2)) {
      a.push({ label: "名前付き不良と話す", desc: "寝場所・危ない仕事・距離の選択。", run: G.thugTalk, disabled: !!H.state.daily.talk.thug_named });
      if (H.state.progression.thug.carryKnown) {
        a.push({ label: "中身不明の荷運びを受ける", desc: "900円。警察注意と借りが増える。", run: G.thugJob });
      }
    }
    return a;
  }

  function actions() {
    const id = H.state.location;
    const slot = H.state.slot;
    const a = [];

    if (id === "station_front") {
      if (!H.state.knownLocations.charity_center) {
        a.push({ label: "掲示板を見る", desc: "DAY1から複数の生活手段を知る。時間消費なし。", run: G.board });
      }
      if (H.state.progression.informal.casualWorkKnown) {
        a.push({
          label: "今日の小仕事を確認する",
          desc: H.state.daily.casualChecked
            ? (H.state.daily.casualOffer ? "今日は募集あり。" : "今日は募集なし。")
            : "書類不要の仕事を確認。時間消費なし。",
          run: G.checkCasualWork,
          disabled: H.state.daily.casualChecked
        });
        if (H.state.daily.casualOffer && !H.state.daily.casualDone) {
          a.push({ label: "荷下ろしの小仕事をする", desc: "550円。", run: G.casualWork });
        }
      }
      a.push({ label: "人に小銭を頼む", desc: "収入になるが警察の注意が増える。", run: G.beg, disabled: (H.state.daily.beg[id] || 0) >= 2 });
      a.push({ label: "廃品を探す", desc: "一日1回。", run: G.scavenge, disabled: !!H.state.daily.scavenge[id] });
    }

    if (id === "shopping_street") {
      if (!H.state.knownLocations.convenience_store) {
        a.push({ label: "店と裏道を確認する", desc: "時間消費なし。", run: G.shoppingLook });
      }
      a.push({ label: "人に小銭を頼む", desc: "警察の注意が増える。", run: G.beg, disabled: (H.state.daily.beg[id] || 0) >= 2 });
      a.push({ label: "廃品を探す", desc: "一日1回。", run: G.scavenge, disabled: !!H.state.daily.scavenge[id] });
    }

    if (["park", "riverside", "residential_alley", "industrial_street"].includes(id)) {
      a.push({ label: "使える物を探す", desc: id === "industrial_street" ? "金属片が見つかりやすい。" : "一日1回。", run: G.scavenge, disabled: !!H.state.daily.scavenge[id] });
      a.push({ label: "休む", desc: "時間を使い疲労を戻す。", run: G.rest, disabled: !!H.state.daily.rest[id] });
    }

    if (id === "park" && slot === 3) a.push({ label: "公園で眠る", desc: "助言や巡回情報でリスクが変わる。", run: () => G.sleepAt("park") });
    if (id === "underpass" && slot === 3) a.push({ label: "高架下で眠る", desc: "寝ようとした時だけ縄張り問題が起こり得る。", run: () => G.sleepAt("underpass") });
    if (id === "riverside" && slot === 3) a.push({ label: "河川敷で眠る", desc: "天候の影響が強い。", run: () => G.sleepAt("riverside") });

    if (id === "charity_center") {
      a.push({ label: "食料支援を受ける", desc: "時間消費なし。", run: G.foodSupport, disabled: H.state.daily.foodSupport || slot === 3 });
      a.push({ label: "支援相談をする", desc: H.state.progression.support.stage ? `次回 DAY${H.state.progression.support.nextDay} 以降` : "継続相談を始める。", run: G.supportConsult, disabled: slot === 3 });
      a.push({ label: "洗面を使う", desc: "時間消費なし。", run: G.wash, disabled: !!H.state.daily.wash[id] || slot === 3 });
      if (slot === 3 && H.state.progression.support.shelterReferral) {
        a.push({ label: "一時宿泊の紹介を使う", desc: "今回の紹介を使う。", run: () => G.sleepAt("charity_referral") });
      }
    }

    if (id === "public_toilet") {
      a.push({ label: "身支度する", desc: "時間消費なし。", run: G.wash, disabled: !!H.state.daily.wash[id] });
      a.push({ label: "少し休む", desc: "疲労を戻す。", run: G.rest, disabled: !!H.state.daily.rest[id] });
    }

    if (id === "convenience_store") {
      a.push({ label: "買い物をする", desc: "時間消費なし。", run: G.openShop });
      a.push({ label: "店員と話す", desc: "関係や小仕事につながる。", run: G.clerkTalk, disabled: !!H.state.daily.talk.clerk });
    }

    if (id === "recycling_yard") {
      const count = (H.state.inventory.aluminum_can || 0) + (H.state.inventory.scrap_piece || 0);
      a.push({ label: "廃品を売る", desc: `${count}点。時間消費なし。`, run: G.sellScrap, disabled: !count });
      if (H.state.progression.recycler.sales >= 2 && !H.state.progression.recycler.trialDone) {
        a.push({ label: "仕分けの試し仕事を聞く", desc: "持ち込み実績から仕事へ。", run: G.recyclerTrial });
      }
      if (H.state.progression.recycler.recurringWork) {
        a.push({ label: "仕分け仕事をする", desc: "650円。", run: G.recyclerWork, disabled: H.state.daily.recyclerWork });
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
        a.push({ label: "日雇い仕事を受ける", desc: "1200円。半日。", run: G.formalWork, disabled: H.state.daily.formalWork });
      }
    }

    if (id === "police_station") {
      a.push({ label: "名前付き警官に用件を伝える", desc: "支援先や巡回を聞ける。", run: G.policeTalk, disabled: !!H.state.daily.talk.police_named });
    }

    return a.concat(peopleActions());
  }

  function dynamicLeads() {
    const s = H.state;
    const list = s.leads.filter((x) => !x.done).map((x) => x.text);
    if (s.stats.hunger >= 72) list.unshift("空腹が強い。食料支援・購入・持ち物で戻せる");
    if (s.stats.fatigue >= 78) list.unshift("疲労が高い。休むか今夜の寝場所を優先");
    if (s.slot === 3) list.unshift("深夜。今夜どこで眠るか決める");
    if (s.world.policeAttention >= 3) list.push(`警察の注意度 ${s.world.policeAttention}`);
    return [...new Set(list)].slice(0, 5);
  }

  function renderStatus() {
    $("day").textContent = `DAY ${H.state.day}`;
    $("time").textContent = `TIME ${D.slots[H.state.slot]}`;
    $("money").textContent = `MONEY ${H.state.money}円`;
    $("weather").textContent = H.state.world.weather === "rain" ? "☂ 雨" : H.state.world.weather === "cold" ? "❄ 寒い" : "☀ 晴れ";
    const s = H.state.stats;
    const fields = { health: ["体力", s.health], hunger: ["空腹", s.hunger], fatigue: ["疲労", s.fatigue], hygiene: ["衛生", s.hygiene], warmth: ["体温", s.warmth], wetness: ["濡れ", s.wetness] };
    Object.entries(fields).forEach(([id, value]) => { $(id).innerHTML = `${value[0]}<b>${value[1]}</b>`; });
  }

  function renderScene() {
    const loc = D.locations[H.state.location];
    $("location-name").textContent = loc.name;
    $("location-desc").textContent = loc.description;
    $("last-message").textContent = H.state.lastMessage;
    const list = dynamicLeads();
    $("lead-list").innerHTML = list.length
      ? `<strong>今ある用事</strong><br>${list.map((x) => `・${esc(x)}`).join("<br>")}`
      : "<strong>今ある用事</strong><br>・特になし";
  }

  function button(label, desc, run, disabled = false) {
    const b = document.createElement("button");
    b.className = "action-btn";
    b.disabled = !!disabled;
    b.innerHTML = `${esc(label)}${desc ? `<small>${esc(desc)}</small>` : ""}`;
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
      e.choices.forEach((x) => choices.appendChild(button(x.label, "対応する。", () => G.resolveEvent(x.id), x.disabled)));
      panel.appendChild(choices);
      box.appendChild(panel);
      return;
    }
    const list = actions();
    list.forEach((x) => box.appendChild(button(x.label, x.desc, x.run, x.disabled)));
    if (!list.length) {
      const p = document.createElement("div");
      p.className = "message";
      p.textContent = "ここで今使う生活行動はない。地図は場所切替で、移動だけでは消耗しない。";
      box.appendChild(p);
    }
  }

  function openMap() {
    if (H.state.activeEvent) return info("地図", "現在の出来事への対応が先になる。");
    const current = H.state.location;
    const list = Object.keys(D.locations)
      .filter((id) => H.state.knownLocations[id] && id !== current)
      .map((id) => ({ label: D.locations[id].name, onClick: () => travel(id) }));
    openModal("地図", `現在地：${D.locations[current].name}。知っている場所へ直接切り替えられる。移動では何も消耗しない。`, list.length ? list : [{ label: "まだ他の場所を知らない", disabled: true }]);
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

  function refresh() {
    renderStatus();
    renderScene();
    renderActions();
    H.saveLocal();
  }

  G.refresh = refresh;

  document.addEventListener("DOMContentLoaded", () => {
    $("nav-map").addEventListener("click", openMap);
    $("nav-inventory").addEventListener("click", openInventory);
    $("nav-log").addEventListener("click", openLog);
    $("nav-people").addEventListener("click", openPeople);
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