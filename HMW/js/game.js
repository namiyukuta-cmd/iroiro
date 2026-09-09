(() => {
  "use strict";
  const HMW = window.HMW;
  const D = HMW.DATA;

  const $ = (id) => document.getElementById(id);
  const clamp = (n, min = 0, max = 100) => Math.max(min, Math.min(max, n));

  function locState(id) {
    if (!HMW.state.world.locations[id]) {
      HMW.state.world.locations[id] = { visits: 0, heat: 0, depletion: 0, complaints: 0 };
    }
    return HMW.state.world.locations[id];
  }

  function rel(id) {
    return HMW.state.relationships[id];
  }

  function deterministic(key, min, max) {
    const raw = `${HMW.state.day}|${HMW.state.slot}|${HMW.state.location}|${key}`;
    let h = 2166136261;
    for (let i = 0; i < raw.length; i += 1) {
      h ^= raw.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    const range = max - min + 1;
    return min + (Math.abs(h >>> 0) % range);
  }

  function unlock(id, reason) {
    if (HMW.state.knownLocations[id]) return false;
    HMW.state.knownLocations[id] = true;
    HMW.addHistory(reason || `${D.locations[id].name}の場所が分かった。`);
    return true;
  }

  function changeStats(effects) {
    Object.entries(effects || {}).forEach(([key, amount]) => {
      if (key in HMW.state.stats) HMW.state.stats[key] = clamp(HMW.state.stats[key] + amount);
    });
    HMW.clampStats();
  }

  function applyTimePressure() {
    const s = HMW.state.stats;
    s.hunger += 5;
    s.fatigue += 4;
    s.hygiene -= 2;
    if (HMW.state.world.weather === "rain") {
      s.wetness += 8;
      s.warmth -= 4;
    } else if (s.wetness > 0) {
      s.wetness -= 4;
    }
    if (s.hunger >= 90) s.health -= 3;
    if (s.fatigue >= 95) s.health -= 2;
    if (s.warmth <= 15) s.health -= 3;
    if (s.wetness >= 85) s.health -= 1;
    HMW.clampStats();
  }

  function rollWeatherForDay() {
    const r = deterministic(`weather-${HMW.state.day}`, 1, 10);
    HMW.state.world.weather = r <= 2 ? "rain" : (r === 3 ? "cold" : "clear");
    if (HMW.state.world.weather === "cold") HMW.state.stats.warmth = clamp(HMW.state.stats.warmth - 5);
  }

  function collapseIfNeeded() {
    if (HMW.state.stats.health > 0) return false;
    const lost = Math.min(HMW.state.money, 300);
    HMW.state.money -= lost;
    HMW.state.day += 1;
    HMW.state.slot = 0;
    HMW.state.location = "charity_center";
    unlock("charity_center");
    HMW.resetDaily();
    HMW.state.stats = { health: 35, hunger: 60, fatigue: 58, hygiene: 30, warmth: 48, wetness: 0 };
    HMW.state.activeEvent = null;
    HMW.addHistory(`路上で倒れ、翌朝まで保護された。${lost ? `${lost}円を失った。` : ""} 生き残ったが一日を失った。`);
    return true;
  }

  function advanceTime(steps = 1, message) {
    for (let i = 0; i < steps; i += 1) {
      applyTimePressure();
      HMW.state.slot += 1;
      if (HMW.state.slot > 3) {
        HMW.state.day += 1;
        HMW.state.slot = 0;
        HMW.resetDaily();
        HMW.state.stats.fatigue = clamp(HMW.state.stats.fatigue + 14);
        HMW.state.stats.health = clamp(HMW.state.stats.health - 2);
        rollWeatherForDay();
        HMW.addHistory("眠らないまま朝になった。疲労が強く残った。");
      }
      if (collapseIfNeeded()) break;
    }
    if (message) HMW.addHistory(message);
    refresh();
  }

  function consumeNoTime(message, effects) {
    changeStats(effects);
    HMW.addHistory(message);
    collapseIfNeeded();
    refresh();
  }

  function setEvent(event) {
    HMW.state.activeEvent = event;
    refresh();
  }

  function clearEvent(message) {
    HMW.state.activeEvent = null;
    if (message) HMW.addHistory(message);
    refresh();
  }

  function maybeArrivalEvent() {
    if (HMW.state.activeEvent) return;
    const id = HMW.state.location;
    const slot = HMW.state.slot;
    const attention = HMW.state.world.policeAttention;

    if ((id === "station_front" || id === "shopping_street") && attention >= 3) {
      const roll = deterministic(`police-${locState(id).visits}`, 1, 100);
      if (roll <= Math.min(75, 25 + attention * 10)) {
        setEvent({
          id: "police_check",
          title: "警官に呼び止められた",
          text: "この辺りで何度も見かけている、と警官が足を止めた。対応するまで普段の行動には戻れない。",
          choices: [
            { id: "calm", label: "落ち着いて答える" },
            { id: "leave", label: "場所を離れる" },
            { id: "argue", label: "反発する" }
          ]
        });
        return;
      }
    }

    if (id === "underpass" && slot === 3 && !HMW.state.progression.thug.safePassage) {
      const roll = deterministic(`underpass-${locState(id).visits}`, 1, 100);
      if (roll <= 42) {
        setEvent({
          id: "underpass_threat",
          title: "高架下を使っている男たち",
          text: "奥へ進む前に止められた。ここで寝るなら無視できない。",
          choices: [
            { id: "backoff", label: "引き返す" },
            { id: "pay", label: "200円渡す", disabled: HMW.state.money < 200 },
            { id: "name", label: "名前付き不良に話を通す", disabled: rel("thug_named").familiarity < 2 }
          ]
        });
      }
    }
  }

  function resolveEvent(choice) {
    const ev = HMW.state.activeEvent;
    if (!ev) return;
    if (ev.id === "police_check") {
      if (choice === "calm") {
        HMW.state.world.policeAttention = Math.max(0, HMW.state.world.policeAttention - 1);
        HMW.state.progression.police.warnings += 1;
        rel("police_named").familiarity += 1;
        clearEvent("質問に答えた。警官は記録だけして立ち去った。");
      } else if (choice === "leave") {
        HMW.state.world.policeAttention = Math.max(0, HMW.state.world.policeAttention - 1);
        HMW.state.location = "park";
        locState("park").visits += 1;
        clearEvent("その場を離れ、公園へ移動した。");
      } else {
        HMW.state.world.policeAttention += 2;
        HMW.state.progression.police.warnings += 1;
        rel("police_named").irritation += 1;
        clearEvent("言い合いになった。今回は解放されたが、警察の注意は強まった。");
      }
      return;
    }

    if (ev.id === "underpass_threat") {
      if (choice === "backoff") {
        HMW.state.location = "park";
        changeStats({ fatigue: 4 });
        clearEvent("高架下を諦めて公園へ戻った。");
      } else if (choice === "pay" && HMW.state.money >= 200) {
        HMW.state.money -= 200;
        HMW.state.progression.thug.debt = Math.max(0, HMW.state.progression.thug.debt - 1);
        clearEvent("200円を渡し、今夜は奥へ進めることになった。");
      } else if (choice === "name" && rel("thug_named").familiarity >= 2) {
        rel("thug_named").trust += 1;
        HMW.state.progression.thug.safePassage = true;
        clearEvent("名前付き不良が一言だけ口を挟み、道を開けさせた。次から扱いが少し変わる。");
      }
    }
  }

  function travelTo(id) {
    if (HMW.state.activeEvent) return;
    const from = D.locations[HMW.state.location];
    if (!from.connections.includes(id) || !HMW.state.knownLocations[id]) return;
    changeStats({ hunger: 1, fatigue: 2, hygiene: -1 });
    HMW.state.location = id;
    locState(id).visits += 1;
    HMW.addHistory(`${D.locations[id].name}へ移動した。`);
    maybeArrivalEvent();
    collapseIfNeeded();
    closeModal();
    refresh();
  }

  function actionBoard() {
    unlock("charity_center", "支援センターの案内を見つけた。公園側から行ける。");
    unlock("labor_office", "労働窓口の場所を確認した。");
    unlock("public_toilet", "無料で使える公衆トイレの位置を確認した。");
    HMW.completeLead("first_board");
    HMW.addLead("support_case", "支援センターで相談する");
    HMW.addHistory("掲示板から、支援・仕事・公衆トイレの場所を把握した。時間はほとんど使っていない。");
    refresh();
  }

  function actionShoppingLook() {
    unlock("convenience_store", "商店街の端に、24時間営業のコンビニがあると分かった。");
    unlock("residential_alley", "店の裏手から住宅裏へ抜けられると分かった。");
    HMW.addHistory("商店街を見回し、使えそうな場所を把握した。");
    refresh();
  }

  function actionBeg() {
    const id = HMW.state.location;
    const used = HMW.state.daily.beg[id] || 0;
    if (used >= 2) return;
    HMW.state.daily.beg[id] = used + 1;
    const amount = deterministic(`beg-${id}-${used}`, 55, 180);
    HMW.state.money += amount;
    HMW.state.world.policeAttention += 1;
    locState(id).heat += 1;
    HMW.completeLead("food_today");
    advanceTime(1, `${D.locations[id].name}で人に頼み、${amount}円を得た。代わりに周囲の注意を少し引いた。`);
  }

  function scavengeYield(id, count) {
    if (id === "industrial_street" || id === "riverside") {
      HMW.addItem("aluminum_can", deterministic(`can-${id}-${count}`, 1, 3));
      if (deterministic(`metal-${id}-${count}`, 1, 100) <= 55) HMW.addItem("scrap_piece", 1);
      return "空き缶と、売れそうな廃材を拾った。";
    }
    if (id === "station_front" || id === "shopping_street" || id === "residential_alley") {
      HMW.addItem("aluminum_can", deterministic(`can-${id}-${count}`, 1, 2));
      if (deterministic(`cardboard-${id}-${count}`, 1, 100) <= 45) HMW.addItem("cardboard", 1);
      return "空き缶など、使える物を拾った。";
    }
    HMW.addItem("aluminum_can", 1);
    if (deterministic(`food-${id}-${count}`, 1, 100) <= 28) HMW.addItem("bread", 1);
    return "捨てられた物の中から、使えそうな物を拾った。";
  }

  function actionScavenge() {
    const id = HMW.state.location;
    const used = HMW.state.daily.scavenge[id] || 0;
    if (used >= 1) return;
    HMW.state.daily.scavenge[id] = used + 1;
    locState(id).depletion += 1;
    changeStats({ fatigue: 5, hygiene: -7 });
    const found = scavengeYield(id, used);
    if (id === "industrial_street" && !HMW.state.knownLocations.recycling_yard) {
      unlock("recycling_yard", "廃材を集めている人の流れから、廃品回収所の場所が分かった。");
    }
    advanceTime(1, found);
  }

  function actionRest() {
    const id = HMW.state.location;
    if (HMW.state.daily.rest[id]) return;
    HMW.state.daily.rest[id] = true;
    changeStats({ fatigue: -15, health: 2 });
    advanceTime(1, "人目の少ない場所でしばらく休んだ。疲労は少し抜けた。時間は進んだ。");
  }

  function actionWash() {
    const id = HMW.state.location;
    if (HMW.state.daily.wash[id]) return;
    HMW.state.daily.wash[id] = true;
    changeStats({ hygiene: 32, wetness: -8 });
    advanceTime(1, "水を使って身体と衣服をできる範囲で整えた。");
  }

  function actionFoodSupport() {
    if (HMW.state.daily.foodSupport || HMW.state.slot === 3) return;
    HMW.state.daily.foodSupport = true;
    HMW.addItem("food_pack", 1);
    changeStats({ hunger: -16 });
    HMW.completeLead("food_today");
    advanceTime(1, "支援の食事を受け取り、その場で少し食べた。残り一食分を持ち物に入れた。");
  }

  function beginSupport() {
    openModal("相談で優先すること", "支援員は、今日すべてを解決できるとは言わない。まず何から進めるかを聞いてきた。", [
      { label: "身分証と手続き", onClick: () => chooseSupportPriority("identity") },
      { label: "連絡手段と住所", onClick: () => chooseSupportPriority("contact") },
      { label: "仕事につながる準備", onClick: () => chooseSupportPriority("work") }
    ]);
  }

  function chooseSupportPriority(priority) {
    const p = HMW.state.progression.support;
    p.stage = 1;
    p.priority = priority;
    p.nextDay = HMW.state.day + 1;
    rel("support_named").familiarity += 1;
    rel("support_named").trust += 1;
    HMW.addLead("support_return", `DAY${p.nextDay}以降に支援センターへ再相談する`);
    closeModal();
    advanceTime(1, "相談記録が作られた。次回までに必要な確認を進めてもらうことになった。");
  }

  function actionSupportConsult() {
    const p = HMW.state.progression.support;
    if (p.stage === 0) return beginSupport();
    if (HMW.state.day < p.nextDay) {
      openInfo("支援相談", `次の手続きはDAY${p.nextDay}以降。今日は待つ必要がある。`);
      return;
    }
    rel("support_named").familiarity += 1;
    rel("support_named").trust += 1;
    p.stage += 1;
    p.nextDay = HMW.state.day + 1;
    let text = "";
    if (p.stage === 2) {
      p.shelterReferral = true;
      HMW.state.sleep.known.charity_referral = true;
      text = "連絡先として使える支援窓口が確保された。緊急時の一時宿泊相談も可能になった。";
    } else if (p.stage === 3) {
      text = "本人確認書類の再取得に必要な手続きが進んだ。";
    } else if (p.stage === 4) {
      p.workAccess = true;
      text = "就労窓口に回せる確認が整った。労働窓口の正式な日雇い紹介を利用できる。";
      HMW.addLead("formal_work", "労働窓口で日雇い仕事を確認する");
      HMW.completeLead("support_return");
    } else {
      text = "ケースの確認を続けた。必要な書類と連絡手段が少しずつ整っている。";
    }
    advanceTime(1, text);
  }

  function buyItem(id) {
    const item = D.items[id];
    if (!item || HMW.state.money < item.price) return;
    HMW.state.money -= item.price;
    HMW.addItem(id, 1);
    HMW.addHistory(`${item.name}を${item.price}円で買った。`);
    closeModal();
    refresh();
  }

  function openShop() {
    const items = ["bread", "rice_ball", "bottled_water", "wet_wipes", "soap", "bandage"];
    openModal("買い物", `所持金 ${HMW.state.money}円`, items.map((id) => ({
      label: `${D.items[id].name}　${D.items[id].price}円`,
      disabled: HMW.state.money < D.items[id].price,
      onClick: () => buyItem(id)
    })));
  }

  function actionClerkTalk() {
    const r = rel("clerk");
    if (HMW.state.daily.talk.clerk) return;
    HMW.state.daily.talk.clerk = true;
    HMW.state.progression.clerk.visits += 1;
    r.familiarity += 1;
    if (r.irritation > 0 && deterministic("clerk-calm", 1, 100) <= 55) r.irritation -= 1;
    if (r.familiarity >= 3 && r.irritation <= 1 && !HMW.state.progression.clerk.cleanupUnlocked) {
      HMW.state.progression.clerk.cleanupUnlocked = true;
      HMW.addLead("clerk_cleanup", "コンビニで閉店前の簡単な清掃を頼めるか確認する");
      advanceTime(1, "何度か顔を合わせた店員から、『夕方なら裏の清掃を頼む日がある』と聞いた。仕事の口が一つできた。");
      return;
    }
    advanceTime(1, "店員と短く話した。特別扱いはないが、顔は覚えられてきた。");
  }

  function actionAskLeftovers() {
    const r = rel("clerk");
    if (HMW.state.slot < 2 || r.familiarity < 2 || HMW.state.progression.clerk.banned) return;
    const chance = clamp(20 + r.familiarity * 12 + r.goodwill * 8 - r.irritation * 18, 5, 80);
    const roll = deterministic(`leftover-${HMW.state.day}`, 1, 100);
    if (roll <= chance) {
      HMW.addItem("leftover_food", 1);
      r.goodwill += 1;
      advanceTime(1, "廃棄前の食べ物を一つ分けてもらえた。毎回もらえる約束ではない。");
    } else {
      r.irritation += 1;
      advanceTime(1, "今日は渡せる物はないと言われた。何度もしつこく聞けば関係は悪くなる。");
    }
  }

  function actionClerkCleanup() {
    if (!HMW.state.progression.clerk.cleanupUnlocked || HMW.state.daily.clerkWork || HMW.state.slot < 2) return;
    HMW.state.daily.clerkWork = true;
    HMW.state.money += 450;
    rel("clerk").trust += 1;
    rel("clerk").goodwill += 1;
    HMW.completeLead("clerk_cleanup");
    changeStats({ fatigue: 10, hunger: 4, hygiene: -4 });
    if (deterministic(`cleanup-food-${HMW.state.day}`, 1, 100) <= 45) HMW.addItem("leftover_food", 1);
    advanceTime(1, "店の裏と搬入口を掃除し、450円を受け取った。次も頼まれる可能性がある。");
  }

  function actionHomelessTalk() {
    const r = rel("homeless_named");
    if (HMW.state.daily.talk.homeless_named) return;
    HMW.state.daily.talk.homeless_named = true;
    r.familiarity += 1;
    HMW.state.progression.homelessNetwork.level = Math.max(HMW.state.progression.homelessNetwork.level, r.familiarity);
    if (r.familiarity === 1) {
      advanceTime(1, "同じ場所を使うホームレスと短く言葉を交わした。まだ互いに距離がある。");
    } else if (r.familiarity === 2) {
      HMW.state.progression.homelessNetwork.underpassKnown = true;
      HMW.state.sleep.known.underpass = true;
      unlock("underpass", "高架下に雨をしのげる場所があると教えられた。安全とは限らない。");
      advanceTime(1, "高架下の場所と、夜に避けた方がいい入口を教えてもらった。");
    } else if (r.familiarity === 3) {
      unlock("riverside", "河川敷に廃品が集まりやすい場所があると聞いた。");
      unlock("recycling_yard", "拾った金属を買い取る回収所を教えてもらった。");
      HMW.state.progression.homelessNetwork.riverKnown = true;
      HMW.addLead("scrap_money", "廃品を集めて回収所へ持ち込む");
      advanceTime(1, "廃品を拾う場所と、買い取ってくれる回収所を教えてもらった。");
    } else {
      r.trust += 1;
      HMW.state.progression.homelessNetwork.safeSleepAdvice = true;
      advanceTime(1, "巡回の時間や、揉め事を避ける寝場所の使い方を教えてもらった。");
    }
  }

  function shareFoodWithHomeless() {
    const candidates = ["bread", "food_pack", "leftover_food"].filter((id) => (HMW.state.inventory[id] || 0) > 0);
    if (!candidates.length) return;
    const id = candidates[0];
    HMW.removeItem(id, 1);
    rel("homeless_named").goodwill += 2;
    rel("homeless_named").trust += 1;
    HMW.addHistory(`${D.items[id].name}を分けた。相手は礼だけ言い、借りを大げさにはしなかった。`);
    refresh();
  }

  function sellScrap() {
    let money = 0;
    let count = 0;
    ["aluminum_can", "scrap_piece"].forEach((id) => {
      const qty = HMW.state.inventory[id] || 0;
      if (!qty) return;
      money += qty * D.items[id].sell;
      count += qty;
      delete HMW.state.inventory[id];
    });
    if (!count) return;
    HMW.state.money += money;
    const p = HMW.state.progression.recycler;
    p.sales += 1;
    p.reliability += 1;
    rel("recycler").familiarity += 1;
    if (p.sales >= 2 && !p.trialDone) HMW.addLead("recycler_trial", "回収所で仕分けの手伝いについて聞く");
    advanceTime(1, `廃品${count}点を${money}円で売った。持ち込みを続ければ顔を覚えられる。`);
  }

  function recyclerTrial() {
    const p = HMW.state.progression.recycler;
    if (p.sales < 2 || p.trialDone) return;
    if (HMW.state.stats.health < 35 || HMW.state.stats.fatigue > 85) {
      openInfo("仕分けの手伝い", "今日は体調が悪すぎて任せられないと言われた。体調を戻せば再挑戦できる。 ");
      return;
    }
    p.trialDone = true;
    p.recurringWork = true;
    p.reliability += 2;
    rel("recycler").trust += 2;
    HMW.state.money += 600;
    changeStats({ fatigue: 13, hunger: 6, hygiene: -8 });
    HMW.completeLead("recycler_trial");
    HMW.addLead("recycler_work", "回収所の仕分け仕事を必要な日に使う");
    advanceTime(1, "二時間ほど仕分けを手伝い、600円を受け取った。今後も空きがある日は頼める。");
  }

  function recyclerWork() {
    const p = HMW.state.progression.recycler;
    if (!p.recurringWork || HMW.state.daily.recyclerWork) return;
    if (HMW.state.stats.health < 35 || HMW.state.stats.fatigue > 88) return;
    HMW.state.daily.recyclerWork = true;
    HMW.state.money += 650;
    p.reliability += 1;
    changeStats({ fatigue: 14, hunger: 7, hygiene: -8 });
    advanceTime(1, "回収所の仕分けを手伝い、650円を受け取った。働いた分だけ消耗した。");
  }

  function formalWork() {
    const p = HMW.state.progression.support;
    if (!p.workAccess || HMW.state.daily.formalWork) return;
    if (HMW.state.stats.health < 45 || HMW.state.stats.fatigue > 72 || HMW.state.stats.hygiene < 25) {
      openInfo("日雇い紹介", "今日は条件不足。体力45以上・疲労72以下・衛生25以上が必要。紹介自体は失われない。 ");
      return;
    }
    HMW.state.daily.formalWork = true;
    HMW.state.money += 1200;
    changeStats({ fatigue: 22, hunger: 11, hygiene: -10 });
    HMW.completeLead("formal_work");
    advanceTime(2, "倉庫の日雇いを終え、1200円を受け取った。大きく稼げたが半日を使い、かなり疲れた。");
  }

  function actionPoliceTalk() {
    if (HMW.state.daily.talk.police_named) return;
    HMW.state.daily.talk.police_named = true;
    const r = rel("police_named");
    r.familiarity += 1;
    if (!HMW.state.progression.police.referralKnown) {
      HMW.state.progression.police.referralKnown = true;
      unlock("charity_center", "警官から、支援センターの場所だけは教えられた。");
      advanceTime(1, "警官は馴れ馴れしくはしない。事情を聞いたうえで、支援センターの場所だけ教えた。");
      return;
    }
    if (HMW.state.world.policeAttention <= 2) r.trust += 1;
    advanceTime(1, "警官と短く話した。職務上の距離は崩れないが、以前よりこちらを把握している。");
  }

  function actionSupportNamedTalk() {
    if (HMW.state.daily.talk.support_named) return;
    HMW.state.daily.talk.support_named = true;
    const r = rel("support_named");
    r.familiarity += 1;
    if (HMW.state.progression.support.stage >= 2) r.trust += 1;
    advanceTime(1, "担当の支援員と少し話した。相談記録とは別に、日々の状態を把握されていく。");
  }

  function actionThugTalk() {
    if (HMW.state.daily.talk.thug_named) return;
    HMW.state.daily.talk.thug_named = true;
    const r = rel("thug_named");
    r.familiarity += 1;
    HMW.state.progression.thug.familiarity = r.familiarity;
    if (r.familiarity === 1) {
      advanceTime(1, "高架下に出入りする不良と目が合い、最低限の言葉を交わした。味方になったわけではない。");
    } else if (r.familiarity === 2) {
      unlock("industrial_street", "不良から、夜でも人の出入りがある工業通りの場所を聞いた。");
      advanceTime(1, "工業通りの場所と、近づかない方がいい倉庫を教えられた。");
    } else {
      r.trust += 1;
      HMW.addLead("thug_carry", "不良から持ちかけられた荷運びを受けるか決める");
      advanceTime(1, "『金が要るなら荷物を運ぶだけの仕事がある』と持ちかけられた。中身は説明されない。");
    }
  }

  function thugCarryJob() {
    if (rel("thug_named").familiarity < 3) return;
    HMW.state.money += 900;
    HMW.state.world.policeAttention += 2;
    rel("thug_named").trust += 1;
    HMW.state.progression.thug.debt += 1;
    changeStats({ fatigue: 12, hunger: 6 });
    HMW.completeLead("thug_carry");
    advanceTime(1, "中身を聞かずに荷物を運び、900円を受け取った。警察に見つかれば説明しづらい行動として注意が増えた。");
  }

  function useItem(id) {
    const item = D.items[id];
    if (!item || !(HMW.state.inventory[id] > 0)) return;
    HMW.removeItem(id, 1);
    const effects = {};
    ["hunger", "health", "hygiene", "warmth", "wetness"].forEach((key) => {
      if (typeof item[key] === "number") effects[key] = item[key];
    });
    changeStats(effects);
    if (["bread", "rice_ball", "food_pack", "leftover_food"].includes(id)) HMW.completeLead("food_today");
    HMW.addHistory(`${item.name}を使った。`);
    closeModal();
    refresh();
  }

  function sleepAt(place) {
    if (HMW.state.slot !== 3) return;
    const s = HMW.state.stats;
    let message = "";
    let risk = 0;
    if (place === "park") {
      risk = 35 + HMW.state.world.policeAttention * 7 - (HMW.state.progression.homelessNetwork.safeSleepAdvice ? 15 : 0);
      s.fatigue -= 52;
      s.health += 4;
      s.hygiene -= 5;
      s.warmth -= HMW.state.world.weather === "cold" ? 10 : 4;
      message = "公園で夜を越した。深くは眠れない。";
    } else if (place === "underpass") {
      risk = HMW.state.progression.thug.safePassage ? 8 : 28;
      s.fatigue -= 62;
      s.health += 6;
      s.hygiene -= 5;
      s.warmth -= 2;
      message = "高架下で夜を越した。公園より雨風はしのげた。";
    } else if (place === "riverside") {
      risk = 22;
      s.fatigue -= 58;
      s.health += 4;
      s.hygiene -= 6;
      s.warmth -= HMW.state.world.weather === "rain" ? 12 : 6;
      message = "河川敷で夜を越した。人目は少ないが天候の影響が強い。";
    } else if (place === "charity_referral") {
      risk = 0;
      s.fatigue -= 68;
      s.health += 8;
      s.hygiene -= 2;
      s.warmth += 5;
      message = "紹介された一時宿泊先で一晩休んだ。ただし毎晩使える場所ではない。";
      HMW.state.progression.support.shelterReferral = false;
    }
    const roll = deterministic(`sleep-${place}-${HMW.state.day}`, 1, 100);
    if (roll <= risk) {
      if (place === "park") {
        HMW.state.world.policeAttention += 1;
        s.fatigue += 10;
        message += " 夜中に起こされて場所を移し、睡眠が削られた。";
      } else if (place === "underpass") {
        const lost = Math.min(HMW.state.money, 150);
        HMW.state.money -= lost;
        s.health -= 4;
        message += ` 夜中に揉め事があり、${lost}円を失った。`;
      } else if (place === "riverside") {
        s.wetness += 15;
        s.warmth -= 8;
        message += " 夜露と冷えで状態が悪くなった。";
      }
    }
    HMW.state.day += 1;
    HMW.state.slot = 0;
    HMW.resetDaily();
    HMW.state.sleep.lastPlace = place;
    s.hunger += 9;
    HMW.clampStats();
    rollWeatherForDay();
    HMW.completeLead("sleep_tonight");
    HMW.addLead("sleep_tonight", "今夜眠れる場所を確保する");
    HMW.addHistory(message);
    collapseIfNeeded();
    refresh();
  }

  function getPeopleActions() {
    const id = HMW.state.location;
    const slot = HMW.state.slot;
    const arr = [];
    if (id === "charity_center" && slot !== 3) {
      arr.push({ id: "support_named", label: "名前付き支援員と話す", desc: "相談とは別の短い会話。関係は急には進まない。", run: actionSupportNamedTalk, disabled: !!HMW.state.daily.talk.support_named });
    }
    if ((id === "park" && slot >= 2) || id === "underpass") {
      arr.push({ id: "homeless_named", label: "名前付きホームレスと話す", desc: "情報は、顔を合わせる回数と信頼で増える。", run: actionHomelessTalk, disabled: !!HMW.state.daily.talk.homeless_named });
      if (rel("homeless_named").familiarity >= 1 && ["bread", "food_pack", "leftover_food"].some((x) => (HMW.state.inventory[x] || 0) > 0)) {
        arr.push({ id: "share_food", label: "食べ物を一つ分ける", desc: "自分の食料を失う代わりに、関係が変わる。", run: shareFoodWithHomeless });
      }
    }
    if ((id === "station_front" && slot >= 1) || id === "police_station") {
      arr.push({ id: "police_named", label: "名前付き警官と話す", desc: "職務上の距離は保たれる。警察の注意度にも影響される。", run: actionPoliceTalk, disabled: !!HMW.state.daily.talk.police_named });
    }
    if ((id === "underpass" && slot >= 2) || (id === "industrial_street" && slot >= 2)) {
      arr.push({ id: "thug_named", label: "名前付き不良と話す", desc: "安全な相手ではない。関係ができれば危険と利益の両方が増える。", run: actionThugTalk, disabled: !!HMW.state.daily.talk.thug_named });
      if (rel("thug_named").familiarity >= 3) arr.push({ id: "thug_job", label: "中身不明の荷運びを受ける", desc: "900円。警察の注意が強まり、相手への借りもできる。", run: thugCarryJob });
    }
    return arr;
  }

  function getLocationActions() {
    const id = HMW.state.location;
    const slot = HMW.state.slot;
    const a = [];
    if (id === "station_front") {
      if (!HMW.state.knownLocations.charity_center) a.push({ label: "掲示板を見る", desc: "支援・仕事・公衆トイレの場所を調べる。時間消費なし。", run: actionBoard });
      a.push({ label: "人に小銭を頼む", desc: "一日2回まで。収入になるが警察の注意が増える。", run: actionBeg, disabled: (HMW.state.daily.beg[id] || 0) >= 2 });
      a.push({ label: "捨てられた物を探す", desc: "一日1回。廃品や段ボール。", run: actionScavenge, disabled: !!HMW.state.daily.scavenge[id] });
    }
    if (id === "shopping_street") {
      if (!HMW.state.knownLocations.convenience_store) a.push({ label: "店と抜け道を確認する", desc: "使える店と住宅裏への道を把握する。時間消費なし。", run: actionShoppingLook });
      a.push({ label: "人に小銭を頼む", desc: "一日2回まで。住民や店側の視線も集める。", run: actionBeg, disabled: (HMW.state.daily.beg[id] || 0) >= 2 });
      a.push({ label: "捨てられた物を探す", desc: "一日1回。", run: actionScavenge, disabled: !!HMW.state.daily.scavenge[id] });
    }
    if (["park", "riverside", "residential_alley", "industrial_street"].includes(id)) {
      a.push({ label: "使える物を探す", desc: id === "industrial_street" ? "廃品が見つかりやすい。" : "一日1回。資源は無限ではない。", run: actionScavenge, disabled: !!HMW.state.daily.scavenge[id] });
      a.push({ label: "休む", desc: "疲労を減らすが時間が進む。", run: actionRest, disabled: !!HMW.state.daily.rest[id] });
    }
    if (id === "park" && slot === 3) a.push({ label: "公園で眠る", desc: "今夜を越す。巡回で起こされる可能性がある。", run: () => sleepAt("park") });
    if (id === "underpass" && slot === 3) a.push({ label: "高架下で眠る", desc: "雨風はしのげる。縄張りの危険がある。", run: () => sleepAt("underpass") });
    if (id === "riverside" && slot === 3) a.push({ label: "河川敷で眠る", desc: "人目は少ないが天候の影響が強い。", run: () => sleepAt("riverside") });
    if (id === "charity_center") {
      a.push({ label: "食料支援を受ける", desc: "一日1回。深夜は利用不可。", run: actionFoodSupport, disabled: HMW.state.daily.foodSupport || slot === 3 });
      a.push({ label: "支援相談をする", desc: supportDescription(), run: actionSupportConsult, disabled: slot === 3 });
      a.push({ label: "洗面を使う", desc: "衛生を大きく回復。一日1回。", run: actionWash, disabled: !!HMW.state.daily.wash[id] || slot === 3 });
      if (slot === 3 && HMW.state.progression.support.shelterReferral) a.push({ label: "一時宿泊の紹介を使う", desc: "今回の紹介を一度使って安全に休む。", run: () => sleepAt("charity_referral") });
    }
    if (id === "public_toilet") {
      a.push({ label: "洗面台で身支度する", desc: "衛生を回復。一日1回。", run: actionWash, disabled: !!HMW.state.daily.wash[id] });
      a.push({ label: "少し休む", desc: "長居はできない。疲労を少し減らす。", run: actionRest, disabled: !!HMW.state.daily.rest[id] });
    }
    if (id === "convenience_store") {
      a.push({ label: "買い物をする", desc: "食料や衛生用品を所持金で買う。", run: openShop });
      a.push({ label: "店員と話す", desc: "同じ店を使うほど関係が積み重なる。", run: actionClerkTalk, disabled: !!HMW.state.daily.talk.clerk || HMW.state.progression.clerk.banned });
      if (slot >= 2 && rel("clerk").familiarity >= 2) a.push({ label: "廃棄予定の食べ物を聞く", desc: "成功は保証されない。しつこいと関係が悪化する。", run: actionAskLeftovers });
      if (HMW.state.progression.clerk.cleanupUnlocked && slot >= 2) a.push({ label: "店の清掃を手伝う", desc: "450円。一日1回。", run: actionClerkCleanup, disabled: HMW.state.daily.clerkWork });
    }
    if (id === "recycling_yard") {
      const scrapCount = (HMW.state.inventory.aluminum_can || 0) + (HMW.state.inventory.scrap_piece || 0);
      a.push({ label: "廃品を売る", desc: `現在 ${scrapCount}点。売却が信用につながる。`, run: sellScrap, disabled: scrapCount === 0 });
      if (HMW.state.progression.recycler.sales >= 2 && !HMW.state.progression.recycler.trialDone) a.push({ label: "仕分けの手伝いを聞く", desc: "持ち込み実績があるため、短い試し仕事を頼める。", run: recyclerTrial });
      if (HMW.state.progression.recycler.recurringWork) a.push({ label: "仕分け仕事をする", desc: "650円。一日1回。体調条件あり。", run: recyclerWork, disabled: HMW.state.daily.recyclerWork });
    }
    if (id === "labor_office") {
      a.push({ label: "仕事の条件を確認する", desc: HMW.state.progression.support.workAccess ? "正式な日雇い紹介が利用できる。" : "本人確認と連絡手段が不足。支援相談で整えられる。", run: () => openInfo("仕事の条件", HMW.state.progression.support.workAccess ? "紹介可能。体力45以上・疲労72以下・衛生25以上が必要。" : "現状は正式紹介不可。ただし回収所や店の小仕事など、別の働き方は可能。") });
      if (HMW.state.progression.support.workAccess) a.push({ label: "日雇い仕事を受ける", desc: "1200円。半日を使い、大きく消耗する。", run: formalWork, disabled: HMW.state.daily.formalWork });
    }
    if (id === "police_station") {
      a.push({ label: "支援先を尋ねる", desc: "金や住居を直接もらうのではなく、利用可能な窓口を聞く。", run: () => {
        unlock("charity_center", "交番で支援センターの場所を教えられた。");
        HMW.state.progression.police.referralKnown = true;
        advanceTime(1, "交番で事情を話し、支援センターの案内を受けた。直接の生活援助ではない。");
      }});
    }
    return a.concat(getPeopleActions());
  }

  function supportDescription() {
    const p = HMW.state.progression.support;
    if (p.stage === 0) return "優先事項を決め、継続相談を開始する。";
    if (HMW.state.day < p.nextDay) return `次の手続きはDAY${p.nextDay}以降。`;
    return "前回から進んだ手続きを確認する。";
  }

  function dynamicLeads() {
    const s = HMW.state;
    const list = s.leads.filter((x) => !x.done).map((x) => x.text);
    if (s.stats.hunger >= 60) list.unshift("空腹が強い。食料支援・購入・持ち物の食料を使う必要がある");
    if (s.stats.fatigue >= 70) list.unshift("疲労が高い。休憩か今夜の睡眠を優先した方がいい");
    if (s.slot === 3) list.unshift("深夜。今夜どこで眠るか決める");
    if (s.world.policeAttention >= 3) list.push(`警察の注意度 ${s.world.policeAttention}。駅前・商店街で呼び止められやすい`);
    return [...new Set(list)].slice(0, 4);
  }

  function renderStatus() {
    $("day").textContent = `DAY ${HMW.state.day}`;
    $("time").textContent = `TIME ${D.slots[HMW.state.slot]}`;
    $("money").textContent = `MONEY ${HMW.state.money}円`;
    const weather = HMW.state.world.weather === "rain" ? "☂ 雨" : HMW.state.world.weather === "cold" ? "❄ 寒い" : "☀ 晴れ";
    $("weather").textContent = weather;
    const s = HMW.state.stats;
    const fields = { health: ["体力", s.health], hunger: ["空腹", s.hunger], fatigue: ["疲労", s.fatigue], hygiene: ["衛生", s.hygiene], warmth: ["体温", s.warmth], wetness: ["濡れ", s.wetness] };
    Object.entries(fields).forEach(([id, pair]) => { $(id).innerHTML = `${pair[0]}<b>${pair[1]}</b>`; });
  }

  function renderScene() {
    const loc = D.locations[HMW.state.location];
    $("location-name").textContent = loc.name;
    $("location-desc").textContent = loc.description;
    $("last-message").textContent = HMW.state.lastMessage;
    const leads = dynamicLeads();
    $("lead-list").innerHTML = leads.length ? `<strong>今ある用事</strong><br>${leads.map((x) => `・${escapeHtml(x)}`).join("<br>")}` : "<strong>今ある用事</strong><br>・特になし";
  }

  function renderActions() {
    const box = $("action-list");
    box.innerHTML = "";
    if (HMW.state.activeEvent) {
      const ev = HMW.state.activeEvent;
      const panel = document.createElement("div");
      panel.className = "event-panel";
      panel.innerHTML = `<h2>${escapeHtml(ev.title)}</h2><p>${escapeHtml(ev.text)}</p>`;
      const choices = document.createElement("div");
      choices.className = "action-grid";
      ev.choices.forEach((choice) => {
        const b = button(choice.label, "この出来事を処理するまで他の行動はできない。", () => resolveEvent(choice.id), !!choice.disabled);
        choices.appendChild(b);
      });
      panel.appendChild(choices);
      box.appendChild(panel);
      return;
    }
    const actions = getLocationActions();
    actions.forEach((a) => box.appendChild(button(a.label, a.desc, a.run, a.disabled)));
    if (!actions.length) {
      const p = document.createElement("div");
      p.className = "message";
      p.textContent = "ここで今できる特別な行動はない。地図から別の場所へ移動できる。";
      box.appendChild(p);
    }
  }

  function button(label, desc, onClick, disabled = false) {
    const b = document.createElement("button");
    b.className = "action-btn";
    b.disabled = !!disabled;
    b.innerHTML = `${escapeHtml(label)}${desc ? `<small>${escapeHtml(desc)}</small>` : ""}`;
    b.addEventListener("click", onClick);
    return b;
  }

  function openMap() {
    if (HMW.state.activeEvent) return openInfo("移動できない", "現在の出来事に対応する必要がある。");
    const loc = D.locations[HMW.state.location];
    const choices = loc.connections.filter((id) => HMW.state.knownLocations[id]).map((id) => ({
      label: D.locations[id].name,
      onClick: () => travelTo(id)
    }));
    openModal("地図", `現在地：${loc.name}。移動そのものでは時間帯は進まないが、少し疲れる。`, choices.length ? choices : [{ label: "行ける場所がまだ分からない", disabled: true }]);
  }

  function openInventory() {
    const entries = Object.entries(HMW.state.inventory).filter(([, qty]) => qty > 0);
    let html = entries.length ? entries.map(([id, qty]) => `<div class="inventory-row"><b>${escapeHtml(D.items[id]?.name || id)}</b> × ${qty}</div>`).join("") : "<p>持ち物はない。</p>";
    const actions = [];
    entries.forEach(([id]) => {
      const item = D.items[id];
      if (item && ["hunger", "health", "hygiene", "warmth", "wetness"].some((k) => typeof item[k] === "number")) actions.push({ label: `${item.name}を使う`, onClick: () => useItem(id) });
    });
    openModal("持ち物", html, actions, true);
  }

  function openPeople() {
    const rows = Object.entries(D.people).map(([id, person]) => {
      const r = rel(id);
      return `<div class="person-row"><b>${escapeHtml(person.name)}</b>　${escapeHtml(person.role)}${person.romance ? "<br><span class=\"muted\">特別な関係に発展する可能性がある人物</span>" : ""}<br><span class="pill">面識 ${r.familiarity}</span><span class="pill">信頼 ${r.trust}</span><span class="pill">好意 ${r.goodwill}</span><span class="pill">苛立ち ${r.irritation}</span></div>`;
    }).join("");
    openModal("人物", rows, [], true);
  }

  function openLog() {
    const rows = HMW.state.history.map((line) => `<div class="log-row">${escapeHtml(line)}</div>`).join("");
    openModal("記録", rows, [], true);
  }

  function openSaveMenu() {
    openModal("セーブ / ロード", "この端末には常に保存できる。GitHub用トークンが登録済みなら private-game-data にも同期する。", [
      { label: "セーブ", onClick: async () => { closeModal(); await HMW.saveGame(); refresh(); } },
      { label: "ロード", onClick: async () => { closeModal(); await HMW.loadGame(); refresh(); } },
      { label: "最初から", className: "danger", onClick: () => {
        openModal("最初から", "現在の端末内セーブを上書きする。", [
          { label: "最初から始める", className: "danger", onClick: () => { HMW.state = HMW.createInitialState(); HMW.saveLocal(); closeModal(); refresh(); } },
          { label: "やめる", onClick: closeModal }
        ]);
      }}
    ]);
  }

  function openInfo(title, text) {
    openModal(title, `<p>${escapeHtml(text)}</p>`, [] , true);
  }

  function openModal(title, body, actions = [], bodyIsHtml = false) {
    $("modal-title").textContent = title;
    $("modal-body").innerHTML = bodyIsHtml || body.includes("<") ? body : `<p>${escapeHtml(body)}</p>`;
    const box = $("modal-actions");
    box.innerHTML = "";
    actions.forEach((a) => {
      const b = document.createElement("button");
      b.className = `modal-btn ${a.className || ""}`;
      b.textContent = a.label;
      b.disabled = !!a.disabled;
      b.addEventListener("click", a.onClick || (() => {}));
      box.appendChild(b);
    });
    $("modal-backdrop").classList.add("open");
  }

  function closeModal() {
    $("modal-backdrop").classList.remove("open");
  }

  function escapeHtml(value) {
    return String(value ?? "").replace(/[&<>'"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" }[c]));
  }

  function refresh() {
    renderStatus();
    renderScene();
    renderActions();
    HMW.saveLocal();
  }

  HMW.refresh = refresh;
  HMW.openModal = openModal;
  HMW.closeModal = closeModal;

  document.addEventListener("DOMContentLoaded", async () => {
    $("nav-map").addEventListener("click", openMap);
    $("nav-inventory").addEventListener("click", openInventory);
    $("nav-log").addEventListener("click", openLog);
    $("nav-people").addEventListener("click", openPeople);
    $("nav-save").addEventListener("click", openSaveMenu);
    $("modal-close").addEventListener("click", closeModal);
    $("modal-backdrop").addEventListener("click", (e) => { if (e.target === $("modal-backdrop")) closeModal(); });
    HMW.loadLocal();
    if (!HMW.state.world.weather) HMW.state.world.weather = "clear";
    locState(HMW.state.location).visits += 1;
    refresh();
  });
})();