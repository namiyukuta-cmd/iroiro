(() => {
  "use strict";
  const H = window.HMW;
  const D = H.DATA;
  const G = H.Game;
  const { $, escapeHtml: esc, openModal, closeModal, info, travel } = G;
  let autoSaveEnabled = false;

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
    if (id === "convenience_store") {
      a.push({ label: "店員と話す", desc: "同じ店を使った履歴が、小仕事や対応の変化につながる。", run: G.clerkTalk, disabled: !!H.state.daily.talk.clerk });
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
      a.push({ label: "シャワーと洗濯を利用する", desc: "1日1回。衛生を整え、濡れを落とし、衣類も清潔にする。", run: G.supportShowerLaundry, disabled: H.state.daily.supportShowerLaundry || slot === 3 });
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
      const workSummary = H.getJobSummary?.();
      const offers = H.getLaborOfficeOffers?.() || [];
      const next = workSummary?.nextReferral;
      a.push({
        label: "仕事の条件・実績を確認する",
        desc: workSummary
          ? `勤務実績${workSummary.verifiedWorkDays}日。紹介される仕事は実績で増える。`
          : "正式紹介の条件を確認する。",
        run: () => {
          if (!H.state.progression.support.workAccess) {
            return info("仕事の条件", "正式紹介はまだ不可。駅前の小仕事、回収所、店の清掃は別に利用できる。");
          }
          const offerText = offers.map((offer) =>
            `${offer.name}：${offer.status.unlocked ? "紹介可" : offer.status.reason}`
          ).join("／");
          const nextText = next
            ? `次の紹介まであと${next.remainingDays}日（${next.name}）`
            : "現在の紹介段階はすべて解禁済み。";
          info("仕事の条件・実績",
            `勤務実績 ${workSummary?.verifiedWorkDays || 0}日。累計仕事収入 ${workSummary?.totalEarnings || 0}円。体力40以上・疲労75以下・衛生25以上・空腹82以下。\n${offerText}\n${nextText}`
          );
        }
      });

      offers.filter((offer) => offer.status.unlocked).forEach((offer) => {
        const availability = offer.availability || {};
        a.push({
          label: `${offer.name}をする`,
          desc: availability.available === false ? availability.reason : offer.description,
          run: offer.id === "warehouse_day"
            ? G.formalWork
            : () => G.referralWork(offer.id),
          disabled: availability.available === false
        });
      });
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
    const period = H.getMenstrualStatus?.();
    if (period?.active && !s.daily.periodCare) list.unshift(`生理${period.periodDay}日目。今日の生理用品が必要`);
    if (s.slot === 3) list.unshift("深夜。眠る場所を選ぶまで翌朝には進まない");
    if (s.world.policeAttention >= 3) list.push(`警察の注意度 ${s.world.policeAttention}`);
    return [...new Set(list)].slice(0, 5);
  }

  function renderStatus() {
    $("day-value").textContent = H.state.day;
    $("time-value").textContent = D.slots[H.state.slot];
    $("money-value").textContent = H.state.money;
    $("weather").textContent = H.state.world.weather === "rain" ? "☂️" : H.state.world.weather === "cold" ? "❄️" : "☀️";
    const s = H.state.stats;
    const fields = {
      health: ["体力", s.health],
      hunger: ["空腹", s.hunger],
      hygiene: ["衛生", s.hygiene],
      warmth: ["暖かさ", s.warmth],
      wetness: ["濡れ", s.wetness],
      fatigue: ["疲労", s.fatigue]
    };
    Object.entries(fields).forEach(([id, value]) => { $(id).innerHTML = `${value[0]}<b>${value[1]}</b>`; });

    const period = H.getMenstrualStatus?.();
    const cycleLabel = $("cycle-label");
    const cycleTrack = $("cycle-track");
    if (period && cycleLabel && cycleTrack) {
      const ovulationDay = Math.max(1, period.cycleLength - 14);
      const care = period.active
        ? `・${H.state.daily.periodCare ? "用品済" : "用品未使用"}`
        : "";
      cycleLabel.textContent = period.active
        ? `生理 ${period.periodDay}日目 ${period.cycleDay}/${period.cycleLength}${care}`
        : `${period.cycleDay}/${period.cycleLength}`;

      cycleTrack.innerHTML = Array.from({ length: period.cycleLength }, (_, i) => {
        const day = i + 1;
        const icon = day <= period.periodLength ? "🌙" : (day === ovulationDay ? "🥚" : "");
        const today = day === period.cycleDay ? " today" : "";
        return `<span class="cycle-day${today}" title="${day}日目">${icon}</span>`;
      }).join("");
    }
  }

  const LOCATION_INTRO_EXTRA = {
    station_front: "駅前にいる。ここには掲示板だけでなく、仕事を探す人、通勤客、店の搬入口、休める場所がある。"
  };

  const LOCATION_POINT_ICONS = {
    station_front: { street:"🛣️", board:"📌", loading:"📦", bench:"🪑", bin:"♻️" },
    shopping_street: { shops:"🏪", alley:"↪️" },
    park: { bench:"🪑", water:"🚰", notice:"📋" },
    convenience_store: { shelf:"🛒", counter:"🧾", back:"📦" },
    charity_center: { desk:"💬", food:"🍞", wash:"🚿" },
    public_toilet: { sink:"🚰", rest:"☕" },
    labor_office: { desk:"🧑‍💼" },
    underpass: { entrance:"🌉", pillars:"🧱", sleep:"🛏️" },
    riverside: { bank:"🌊", rest:"🪑" },
    industrial_street: { scrap:"🔩", warehouse:"🏭" },
    recycling_yard: { scale:"⚖️" },
    residential_alley: { alley:"🏘️" },
    police_station: { desk:"👮" }
  };

  const LOCATION_POINTS = {
    station_front: [
      { id:"street", label:"公道", text:"駅前の公道。人に小銭を頼む、周囲を探すなど、この場所でできる行動を選べる。" },
      { id:"board", label:"掲示板", text:"支援、廃品回収、小仕事など、今日の生活につながる情報が貼られている。" },
      { id:"loading", label:"駅の搬入口", text:"当日手伝いの募集があるか確認できる。募集が出ていれば、そのまま荷下ろしの仕事を受けられる。" },
      { id:"bench", label:"ベンチ", text:"通勤客の流れから少し外れて座れるベンチ。人の出入りを見ながら休める。" },
      { id:"bin", label:"ゴミ箱", text:"駅前のゴミ箱とその周辺。使える物が残っていることもある。" }
    ],
    shopping_street: [
      { id:"shops", label:"店先", text:"個人商店が並ぶ。店の貼り紙や手伝いの募集が出ることがある。" },
      { id:"alley", label:"裏道", text:"店の裏手へ続く道。住宅裏やコンビニにつながる。" }
    ],
    park: [
      { id:"bench", label:"ベンチ", text:"昼は休みやすいベンチ。夜は巡回や他の利用者の影響を受ける。" },
      { id:"water", label:"水場", text:"公園の水場。周囲には掲示や落とし物が見つかることもある。" },
      { id:"notice", label:"掲示板", text:"地域の案内や支援情報が貼られる掲示板。" }
    ],
    convenience_store: [
      { id:"shelf", label:"商品棚", text:"食料、水、衛生用品などを買える。" },
      { id:"counter", label:"レジ", text:"店員がいる。何度も利用すれば顔を覚えられる。" },
      { id:"back", label:"店の裏", text:"段ボールや清掃道具が置かれている。仕事につながることもある。" }
    ],
    charity_center: [
      { id:"desk", label:"受付", text:"生活相談の受付。相談記録を作れば、日をまたいで続きを進められる。" },
      { id:"food", label:"食料支援", text:"その日の食料支援を受けられる。" },
      { id:"wash", label:"洗面・洗濯", text:"身支度、シャワー、洗濯に使える設備がある。" }
    ],
    public_toilet: [
      { id:"sink", label:"洗面台", text:"水道と洗面台があり、最低限の身支度ができる。" },
      { id:"rest", label:"休める所", text:"長居はできないが、少しだけ休める。" }
    ],
    labor_office: [
      { id:"desk", label:"受付", text:"仕事の条件や、現在紹介を受けられる仕事を確認できる。" }
    ],
    underpass: [
      { id:"entrance", label:"入口", text:"人の出入りが多い側。夜は使い方に注意が必要。" },
      { id:"pillars", label:"柱の陰", text:"雨風を避けやすい場所。古い書き込みや残された物が見つかることもある。" },
      { id:"sleep", label:"寝場所", text:"夜に使える可能性があるが、縄張りや安全の情報が必要になる。" }
    ],
    riverside: [
      { id:"bank", label:"河原", text:"人目が少ない河原。廃品が見つかることがある。" },
      { id:"rest", label:"休める所", text:"天候の影響は強いが、少し休める場所がある。" }
    ],
    industrial_street: [
      { id:"scrap", label:"廃材置場", text:"金属片などの回収品が出やすい。" },
      { id:"warehouse", label:"倉庫前", text:"倉庫が並ぶ通り。夕方以降は人通りが減る。" }
    ],
    recycling_yard: [
      { id:"scale", label:"計量台", text:"缶や金属片を種類ごとに分けて計量し、買い取っている。" }
    ],
    residential_alley: [
      { id:"alley", label:"路地", text:"住宅の裏側。捨てられた物が見つかることもあるが、住民の目がある。" }
    ],
    police_station: [
      { id:"desk", label:"窓口", text:"相談や落とし物の窓口。警官に用件を伝えられる。" }
    ]
  };

  function locationIntroPages(id) {
    const loc = D.locations[id];
    if (!loc) return [];
    const pages = [loc.description];
    if (LOCATION_INTRO_EXTRA[id]) pages.push(LOCATION_INTRO_EXTRA[id]);
    return pages.filter(Boolean);
  }

  function openLocationIntro(id, pageIndex = 0) {
    const loc = D.locations[id];
    const pages = locationIntroPages(id);
    if (!loc || !pages.length) return;

    const page = Math.max(0, Math.min(pageIndex, pages.length - 1));
    const isLast = page >= pages.length - 1;
    openModal(loc.name, `<div class="location-intro-text">${esc(pages[page])}</div><div class="location-intro-tap">Tap</div>`, [], true);
    const backdrop = $("modal-backdrop");
    backdrop.classList.add("tap-popup");
    backdrop.onclick = () => {
      if (isLast) closeModal();
      else openLocationIntro(id, page + 1);
    };
  }

  function openScenePopup(scene) {
    if (!scene) return;
    const actions = (scene.actions || []).map((action) => ({
      label: action.label,
      disabled: !!action.disabled,
      onClick: () => {
        closeModal();
        action.run();
      }
    }));
    openModal(scene.title, `<div class="scene-popup-text">${esc(scene.text)}</div>`, actions, true);
    $("modal-actions")?.classList.add("scene-popup-actions");
  }

  function pointActions(locationId, pointId) {
    const actions = [];

    const peoplePointMap = {
      charity_center: ["desk"],
      convenience_store: ["counter"],
      park: ["bench"],
      underpass: ["entrance", "pillars"],
      industrial_street: ["warehouse"],
      police_station: ["desk"]
    };
    if ((peoplePointMap[locationId] || []).includes(pointId)) {
      peopleActions().filter((a) => !a.disabled).forEach((a) => {
        actions.push({
          label: a.label,
          onClick: () => {
            closeModal();
            a.run();
          }
        });
      });
    }

    if (locationId === "station_front" && pointId === "board" && !H.state.knownLocations.charity_center) {
      actions.push({ label:"掲示板を見る", onClick:() => { closeModal(); G.board(); } });
    }
    if (locationId === "station_front" && pointId === "loading") {
      if (H.state.progression.informal.casualWorkKnown && !H.state.daily.casualChecked) {
        actions.push({ label:"今日の募集を確認する", onClick:() => { closeModal(); G.checkCasualWork(); } });
      }
      if (H.state.daily.casualOffer && !H.state.daily.casualDone) {
        actions.push({ label:"荷下ろしを手伝う", onClick:() => { closeModal(); G.casualWork(); } });
      }
    }
    if (locationId === "station_front" && pointId === "bin" && !H.state.daily.scavenge[locationId]) {
      actions.push({ label:"使える物を探す", onClick:() => { closeModal(); G.scavenge(); } });
    }
    if (locationId === "shopping_street" && pointId === "shops" && !H.state.knownLocations.convenience_store) {
      actions.push({ label:"店と裏道を確認する", onClick:() => { closeModal(); G.shoppingLook(); } });
    }
    if (locationId === "convenience_store" && pointId === "shelf") {
      actions.push({ label:"買い物をする", onClick:() => { closeModal(); G.openShop(); } });
    }
    if (locationId === "charity_center" && pointId === "food" && !H.state.daily.foodSupport && H.state.slot !== 3) {
      actions.push({ label:"食料支援を受ける", onClick:() => { closeModal(); G.foodSupport(); } });
    }
    if (locationId === "charity_center" && pointId === "wash" && !H.state.daily.supportShowerLaundry && H.state.slot !== 3) {
      actions.push({ label:"シャワーと洗濯を使う", onClick:() => { closeModal(); G.supportShowerLaundry(); } });
    }
    if (locationId === "public_toilet" && pointId === "sink" && !H.state.daily.wash[locationId]) {
      actions.push({ label:"身支度する", onClick:() => { closeModal(); G.wash(); } });
    }
    if (locationId === "public_toilet" && pointId === "rest" && !H.state.daily.rest[locationId]) {
      actions.push({ label:"少し休む", onClick:() => { closeModal(); G.rest(); } });
    }
    if (["park","riverside","residential_alley","industrial_street"].includes(locationId) &&
        ["bench","bank","alley","scrap"].includes(pointId) &&
        !H.state.daily.scavenge[locationId]) {
      actions.push({ label:"使える物を探す", onClick:() => { closeModal(); G.scavenge(); } });
    }
    if (["park","riverside","residential_alley","industrial_street"].includes(locationId) &&
        ["bench","rest","alley","warehouse"].includes(pointId) &&
        !H.state.daily.rest[locationId]) {
      actions.push({ label:"休む", onClick:() => { closeModal(); G.rest(); } });
    }

    return actions;
  }

  function openLocationPoint(locationId, point) {
    if (locationId === "station_front" && point.id === "street") {
      openLocationActions();
      return;
    }
    const liveScene = G.getCityScene?.();
    if (locationId === "station_front" && point.id === "loading" &&
        liveScene && ["station_morning_work","daily_station_shortage"].includes(liveScene.id)) {
      openScenePopup(liveScene);
      return;
    }
    const actions = pointActions(locationId, point.id);
    if (actions.length === 1) {
      actions[0].onClick();
      return;
    }
    openModal(point.label, `<div class="point-popup-text">${esc(point.text)}</div>`, actions, true);
  }

  function renderLocationPoints() {
    const box = $("location-points");
    if (!box) return;
    const id = H.state.location;
    const points = LOCATION_POINTS[id] || [];
    box.innerHTML = "";

    points.forEach((point) => {
      const button = document.createElement("button");
      button.className = "location-point-btn";
      button.type = "button";
      button.dataset.locationId = id;
      button.dataset.pointId = point.id;
      const icon = LOCATION_POINT_ICONS[id]?.[point.id] || "•";
      button.innerHTML = `<span class="point-icon" aria-hidden="true">${icon}</span><span class="point-label">${esc(point.label)}</span>`;
      button.addEventListener("click", () => openLocationPoint(id, point));
      box.appendChild(button);
    });
  }

  function renderCityScene() {
    const box = $("city-scene");
    if (!box) return;
    const scene = G.getCityScene?.();
    const mergedIntoPoint = H.state.location === "station_front" &&
      scene && ["station_morning_work","daily_station_shortage"].includes(scene.id);

    if (!scene || mergedIntoPoint) {
      box.classList.add("hidden");
      box.innerHTML = "";
      return;
    }

    box.classList.remove("hidden");
    box.innerHTML = "";
    const button = document.createElement("button");
    button.className = "location-point-btn event-point-btn";
    button.type = "button";
    button.textContent = scene.title;
    button.addEventListener("click", () => openScenePopup(scene));
    box.appendChild(button);
  }

  function renderScene() {
    const loc = D.locations[H.state.location];
    const sceneEl = document.querySelector(".scene");
    if (sceneEl) sceneEl.dataset.location = H.state.location;
    $("location-name").textContent = loc.name;
    const housingGoalText = $("housing-goal-text");
    if (housingGoalText) housingGoalText.textContent = H.getHousingGoalText?.() || "";
    renderLocationPoints();
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
    const merged = [...locationActions(), ...peopleActions()];
    const list = merged.filter((item, index, all) =>
      all.findIndex((other) => other.label === item.label) === index
    );
    if (!list.length) return info(D.locations[H.state.location].name, "今ここでできる特別な行動はない。");
    openModal(D.locations[H.state.location].name, "ここでできること。", list.map(modalAction));
  }

  function openPeopleHere() {
    if (H.state.activeEvent) return info("人と関わる", "現在の出来事への対応が先になる。");
    const list = peopleActions();
    if (!list.length) return info("人と関わる", "今ここで話しかけられる相手はいない。");
    openModal("人と関わる", "今ここにいる相手。", list.map(modalAction));
  }

  function mainButton(label, run, className = "") {
    const b = document.createElement("button");
    b.className = `primary-action${className ? ` ${className}` : ""}`;
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
    if (!H.state.activeEvent) return;
    const e = H.state.activeEvent;
    const panel = document.createElement("div");
    panel.className = "event-panel";
    panel.innerHTML = `<h2>${esc(e.title)}</h2><p>${esc(e.text)}</p>`;
    const choices = document.createElement("div");
    choices.className = "action-grid";
    e.choices.forEach((x) => choices.appendChild(eventButton(x.label, () => G.resolveEvent(x.id), x.disabled)));
    panel.appendChild(choices);
    box.appendChild(panel);
  }

  function openMap() {
    if (H.state.activeEvent) return info("移動", "現在の出来事への対応が先になる。");

    const current = H.state.location;
    const knownIds = Object.keys(D.locations).filter((id) => H.state.knownLocations[id]);
    const destinationIds = knownIds.filter((id) => id !== current);

    const layout = {
      station_front:      [13, 17],
      shopping_street:    [38, 17],
      park:               [69, 17],
      police_station:     [12, 38],
      labor_office:       [34, 38],
      public_toilet:      [56, 38],
      convenience_store:  [82, 38],
      residential_alley:  [23, 62],
      charity_center:     [53, 62],
      underpass:          [78, 62],
      industrial_street:  [23, 84],
      recycling_yard:     [52, 84],
      riverside:          [78, 84]
    };

    const edgeKeys = new Set();
    const edges = [];
    knownIds.forEach((id) => {
      const from = layout[id];
      if (!from) return;
      (D.locations[id].connections || []).forEach((toId) => {
        if (!knownIds.includes(toId) || !layout[toId]) return;
        const key = [id, toId].sort().join("|");
        if (edgeKeys.has(key)) return;
        edgeKeys.add(key);
        edges.push([id, toId]);
      });
    });

    const destinationHtml = destinationIds.length
      ? destinationIds.map((id) =>
          `<button class="travel-destination" data-travel-id="${esc(id)}">${esc(D.locations[id].name)}</button>`
        ).join("")
      : `<div class="travel-empty">まだ他の場所を知らない</div>`;

    const lineHtml = edges.map(([fromId, toId]) => {
      const [x1, y1] = layout[fromId];
      const [x2, y2] = layout[toId];
      return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"></line>`;
    }).join("");

    const nodeHtml = knownIds
      .filter((id) => layout[id])
      .map((id) => {
        const [x, y] = layout[id];
        const currentClass = id === current ? " current" : "";
        return `<div class="travel-map-node${currentClass}" data-map-id="${esc(id)}" style="left:${x}%;top:${y}%">
          <span></span><small>${esc(D.locations[id].name)}</small>
        </div>`;
      }).join("");

    const body = `
      <div class="travel-window">
        <div class="travel-section-title">行き先</div>
        <div class="travel-destinations">${destinationHtml}</div>
        <div class="travel-map">
          <svg class="travel-map-lines" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">${lineHtml}</svg>
          ${nodeHtml}
        </div>
        <div class="travel-hint" id="travel-hint">行き先を1回押すと地図で確認できます</div>
      </div>`;

    openModal("移動", body, [], true);
    $("modal-backdrop")?.classList.add("travel-popup");

    let selectedId = null;
    const hint = $("travel-hint");
    const buttons = [...document.querySelectorAll(".travel-destination")];

    const selectDestination = (id) => {
      buttons.forEach((button) => {
        button.classList.toggle("selected", button.dataset.travelId === id);
      });

      document.querySelectorAll(".travel-map-node").forEach((node) => {
        node.classList.toggle("selected", node.dataset.mapId === id);
      });

      const marker = document.querySelector(`.travel-map-node[data-map-id="${CSS.escape(id)}"]`);
      if (marker) {
        marker.classList.remove("ping");
        void marker.offsetWidth;
        marker.classList.add("ping");
      }
    };

    buttons.forEach((button) => {
      button.addEventListener("click", () => {
        const id = button.dataset.travelId;
        if (!id) return;

        if (selectedId === id) {
          closeModal();
          travel(id);
          openLocationIntro(id);
          return;
        }

        selectedId = id;
        selectDestination(id);
        if (hint) hint.textContent = `${D.locations[id].name}をもう1回押すと移動`;
      });
    });
  }

  function openInventory() {
    const entries = Object.entries(H.state.inventory).filter(([, qty]) => qty > 0);
    const html = entries.length
      ? entries.map(([id, qty]) => `<div class="inventory-row"><b>${esc(D.items[id]?.name || id)}</b> × ${qty}</div>`).join("")
      : "<p>持ち物はない。</p>";
    const buttons = [];
    entries.forEach(([id]) => {
      const item = D.items[id];
      if (item && (item.periodCare || ["hunger", "health", "hygiene", "warmth", "wetness"].some((k) => typeof item[k] === "number"))) {
        buttons.push({ label: `${item.name}を使う`, onClick: () => G.useItem(id) });
      }
    });
    openModal("持ち物", html, buttons, true);
  }

  function defaultDialogueCharacter() {
    const byLocation = {
      charity_center: "support_named",
      park: "homeless_named",
      underpass: "homeless_named",
      police_station: "police_named",
      industrial_street: "thug_named"
    };
    return byLocation[H.state.location] || "support_named";
  }

  function openDialogueJson() {
    const body = `
      <div class="game-dialogue-json">
        <label class="dialogue-json-label" for="game-dialogue-character">相手</label>
        <select class="dialogue-json-select" id="game-dialogue-character">
          <option value="support_named">アーロン</option>
          <option value="homeless_named">サム</option>
          <option value="police_named">マーク</option>
          <option value="thug_named">レオン</option>
        </select>

        <label class="dialogue-json-label" for="game-dialogue-analysis">分析JSON</label>
        <textarea class="dialogue-json-textarea" id="game-dialogue-analysis"
          spellcheck="false" autocomplete="off" autocapitalize="off" autocorrect="off"
          placeholder="ChatGPTから受け取った分析JSONをここに貼る"></textarea>

        <div class="dialogue-json-result hidden" id="game-dialogue-result">
          <div class="dialogue-json-output">
            <b>⑥ JSが生成した英文</b>
            <div class="dialogue-json-english" id="game-dialogue-english"></div>
          </div>
          <div class="dialogue-json-output">
            <b>⑤ JSが選んだ意味ID</b>
            <pre id="game-dialogue-meaning"></pre>
          </div>
          <details class="dialogue-json-proof">
            <summary>文ごとの証拠</summary>
            <pre id="game-dialogue-proof"></pre>
          </details>
        </div>
      </div>`;

    const run = () => {
      const input = $("game-dialogue-analysis");
      const character = $("game-dialogue-character");
      const resultBox = $("game-dialogue-result");
      const english = $("game-dialogue-english");
      const meaning = $("game-dialogue-meaning");
      const proof = $("game-dialogue-proof");

      try {
        if (!H.DialogueTest?.runAnalysis) throw new Error("会話JSが読み込まれていません。");
        const analysis = JSON.parse(input.value);
        const result = H.DialogueTest.runAnalysis(analysis, character.value);

        resultBox.classList.remove("hidden");
        english.classList.remove("error");
        english.textContent = result.english || "(英文なし)";
        meaning.textContent = result.selectedMeaningIds.join("\n");
        proof.textContent = result.composed.map((item, index) => [
          `${index + 1}. ${item.meaningId}`,
          `英文: ${item.english || "(なし)"}`,
          `生成元: ${item.source || "(不明)"}`,
          `文型: ${item.patternId || "(なし)"}`
        ].join("\n")).join("\n\n");
      } catch (error) {
        resultBox.classList.remove("hidden");
        english.classList.add("error");
        english.textContent = String(error?.message || error);
        meaning.textContent = "";
        proof.textContent = "";
      }
    };

    const clear = () => {
      const input = $("game-dialogue-analysis");
      if (input) {
        input.value = "";
        input.focus();
      }
      $("game-dialogue-result")?.classList.add("hidden");
    };

    openModal("会話JSON", body, [
      { label: "JSで英文生成", className: "good", onClick: run },
      { label: "全消去", onClick: clear }
    ], true);

    const character = $("game-dialogue-character");
    if (character) character.value = defaultDialogueCharacter();
  }

  function openPeople() {
    const html = Object.entries(D.people).map(([id, person]) => {
      const r = G.rel(id);
      const relationHtml = person.romance
        ? H.RELATIONSHIP_DISPLAY_KEYS
            .map((key) => `<span class="pill">${esc(H.RELATIONSHIP_LABELS[key])} ${Number(r[key]) || 0}</span>`)
            .join("")
        : `<span class="pill">親密度 ${r.familiarity}</span><span class="pill">信頼 ${r.trust}</span><span class="pill">好意 ${r.goodwill}</span>`;
      return `<div class="person-row"><b>${esc(person.name)}</b> ${esc(person.role)}${person.romance ? "<br><span class=\"muted\">特別な関係に発展する可能性がある人物</span>" : ""}<br>${relationHtml}</div>`;
    }).join("");
    openModal("人物", html, [], true);
  }

  function openTasks() {
    const stability = typeof G.stabilityScore === "function" ? G.stabilityScore() : 0;
    const leads = dynamicLeads();
    const housing = H.getHousingProgress?.() || [];
    const housingRoutes = housing.filter((x) => x.questRoute);
    const housingHtml = housingRoutes.length
      ? housingRoutes.map((x) => {
          const req = x.requirements.map((r) => `${r.met ? "✓" : "・"} ${esc(r.text)}`).join("<br>");
          return `<div class="task-row"><b>${esc(x.name)}</b><br><span class="muted">${esc(x.description)}</span><br>${req}</div>`;
        }).join("")
      : "<p>住居目標なし</p>";

    const work = H.getJobSummary?.();
    const workRows = work
      ? Object.entries(work.records)
          .filter(([, record]) => record.days > 0)
          .map(([id, record]) => {
            const job = H.getJob?.(id);
            return `<div class="task-row"><b>${esc(job?.name || id)}</b>　${record.days}日／${record.earnings}円</div>`;
          }).join("")
      : "";
    const nextWork = work?.nextReferral
      ? `次の紹介：${esc(work.nextReferral.name)}まであと${work.nextReferral.remainingDays}日`
      : "現在の紹介仕事はすべて解禁済み";
    const workHtml = work
      ? `<div class="task-row"><b>正式な勤務実績 ${work.verifiedWorkDays}日</b><br>累計仕事収入 ${work.totalEarnings}円<br><span class="muted">${nextWork}</span></div>${workRows}`
      : "<p>仕事実績なし</p>";

    const html = `<div class="menu-summary"><b>生活基盤 ${stability}/5</b><br><span class="stability-dots">${"●".repeat(stability)}${"○".repeat(5 - stability)}</span></div>` +
      `<div class="menu-summary"><b>仕事実績</b>${workHtml}</div>` +
      `<div class="menu-summary"><b>住居目標</b>${housingHtml}</div>` +
      `<div class="menu-summary"><b>今ある用事</b>${leads.length ? leads.map((x) => `<div class="task-row">${esc(x)}</div>`).join("") : "<p>特になし</p>"}</div>`;
    openModal("状況", html, [], true);
  }

  function openLog() {
    openModal("ログ", H.state.history.map((x) => `<div class="log-row">${esc(x)}</div>`).join(""), [], true);
  }

  function saveSlotActions() {
    return Array.from({ length: H.SAVE_SLOT_COUNT || 3 }, (_, i) => {
      const slot = i + 1;
      return {
        label: H.describeSaveSlot ? H.describeSaveSlot(slot) : `スロット${slot}`,
        onClick: async () => {
          closeModal();
          await H.saveGame(slot);
          autoSaveEnabled = true;
          refresh();
        }
      };
    });
  }

  function loadSlotActions(fromStart = false) {
    return Array.from({ length: H.SAVE_SLOT_COUNT || 3 }, (_, i) => {
      const slot = i + 1;
      return {
        label: H.describeSaveSlot ? H.describeSaveSlot(slot) : `スロット${slot}`,
        onClick: async () => {
          closeModal();
          const loaded = await H.loadGame(slot);
          if (!loaded) return info("ロード", `スロット${slot}にはセーブデータがない。`);
          autoSaveEnabled = true;
          if (fromStart) {
            enterGame();
            return;
          }
          G.ensureState();
          refresh();
        }
      };
    });
  }

  function openSave() {
    const actions = saveSlotActions();
    actions.push({
      label: "最初から",
      className: "danger",
      onClick: () => openModal("最初から", "現在の進行を最初からにする。セーブスロットは消さない。", [
        { label: "最初から始める", className: "danger", onClick: () => { H.state = H.createInitialState(); autoSaveEnabled = false; closeModal(); G.ensureState(); refresh(); } },
        { label: "やめる", onClick: closeModal }
      ])
    });
    openModal("セーブ", "保存先を選ぶ。スロットごとに別のデータとして残る。", actions);
  }

  function openLoad(fromStart = false) {
    const actions = loadSlotActions(fromStart);
    actions.push({ label: "やめる", onClick: closeModal });
    openModal(fromStart ? "続きから" : "ロード", "読み込むスロットを選ぶ。", actions);
  }

  function refresh() {
    renderStatus();
    renderScene();
    renderActions();
    if (autoSaveEnabled) H.saveLocal();
  }

  function enterGame(showLocationIntro = false) {
    G.ensureState();
    if (!H.state.world.weather) H.state.world.weather = "clear";
    G.locState(H.state.location).visits += 1;
    $("start-screen")?.classList.add("hidden");
    $("game-app")?.classList.remove("game-not-started");
    refresh();
    if (showLocationIntro) openLocationIntro(H.state.location);
  }

  function startNewGame() {
    H.state = H.createInitialState();
    autoSaveEnabled = false;
    enterGame(true);
  }

  async function continueGame() {
    const loaded = await H.loadGame(H.activeSaveSlot || 1);
    if (!loaded) {
      openLoad(true);
      return;
    }
    autoSaveEnabled = true;
    enterGame();
  }

  G.refresh = refresh;

  document.addEventListener("DOMContentLoaded", () => {
    $("location-name").addEventListener("click", () => openLocationIntro(H.state.location));
    $("dialogue-json")?.addEventListener("click", openDialogueJson);
    $("side-tasks").addEventListener("click", openTasks);
    $("side-move").addEventListener("click", openMap);
    $("side-inventory").addEventListener("click", openInventory);
    $("nav-save").addEventListener("click", openSave);
    $("nav-load").addEventListener("click", () => openLoad(false));
    $("nav-log").addEventListener("click", openLog);
    $("nav-people").addEventListener("click", openPeople);
    $("start-new").addEventListener("click", startNewGame);
    $("start-continue").addEventListener("click", continueGame);
    $("modal-close").addEventListener("click", closeModal);
    $("modal-backdrop").addEventListener("click", (e) => { if (e.target === $("modal-backdrop")) closeModal(); });
  });
})();