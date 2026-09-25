(() => {
  "use strict";
  const H = window.HMW;
  const D = H.DATA;
  const G = H.Game;
  const { $, random, changeStats, openModal, closeModal, advanceTime, rel } = G;

  function addReward(found, id, qty = 1) {
    found[id] = (found[id] || 0) + qty;
  }

  function rewardLabel(id, qty) {
    return `${D.items[id]?.name || id}${qty > 1 ? `×${qty}` : ""}`;
  }

  function searchReward(locationId, index) {
    const roll = random(`search-${locationId}-${index}`, 1, 100);
    if (["industrial_street", "riverside"].includes(locationId)) {
      if (roll <= 36) return { id: "aluminum_can", qty: 2 };
      if (roll <= 66) return { id: "scrap_piece", qty: 1 };
      if (roll <= 82) return { id: "cardboard", qty: 1 };
      return null;
    }
    if (locationId === "residential_alley") {
      if (roll <= 32) return { id: "aluminum_can", qty: 1 };
      if (roll <= 52) return { id: "cardboard", qty: 1 };
      if (roll <= 61) return { id: "wet_wipes", qty: 1 };
      return null;
    }
    if (locationId === "park") {
      if (roll <= 35) return { id: "aluminum_can", qty: 1 };
      if (roll <= 48) return { id: "bread", qty: 1 };
      if (roll <= 62) return { id: "cardboard", qty: 1 };
      return null;
    }
    if (roll <= 40) return { id: "aluminum_can", qty: 1 };
    if (roll <= 58) return { id: "cardboard", qty: 1 };
    if (roll <= 66) return { id: "wet_wipes", qty: 1 };
    return null;
  }

  function startScavenge() {
    const id = H.state.location;
    if (H.state.daily.scavenge[id]) return false;

    const found = {};
    for (let i = 0; i < 3; i += 1) {
      const reward = searchReward(id, i);
      if (reward) addReward(found, reward.id, reward.qty);
    }

    Object.entries(found).forEach(([itemId, qty]) => H.addItem(itemId, qty));
    H.state.daily.scavenge[id] = 1;
    G.locState(id).depletion += 1;
    changeStats({ fatigue: 3, hygiene: -4 });

    const list = Object.entries(found).map(([itemId, qty]) => rewardLabel(itemId, qty));
    advanceTime(1, list.length
      ? `${list.join("、")}を持ち帰った。`
      : "今日は使える物を見つけられなかった。");
    return true;
  }


  function startCasualWork() {
    if (!H.state.daily.casualOffer || H.state.daily.casualDone) return false;

    const pay = 550;
    H.state.daily.casualDone = true;
    H.state.money += pay;
    H.recordJobResult?.("casual_unloading", { pay });
    changeStats({ fatigue: 8, hunger: 4, hygiene: -2 });
    H.completeLead("casual_work");
    advanceTime(1, `荷下ろしを終え${pay}円を受け取った。`);
    return true;
  }

  function startCleanupWork() {
    if (H.state.daily.clerkWork) return false;

    const pay = 450;
    H.state.daily.clerkWork = true;
    H.state.money += pay;
    H.recordJobResult?.("clerk_cleanup", { pay });
    rel("clerk").trust += 1;
    changeStats({ fatigue: 7, hunger: 3, hygiene: -3 });
    advanceTime(1, `清掃を終え${pay}円を受け取った。店との仕事の関係が一段深まった。`);
    return true;
  }

  function startRecyclerWork(trial = false) {
    const pay = trial ? 600 : 654;
    const p = H.state.progression.recycler;

    if (trial) {
      if (p.trialDone) return false;
      p.trialDone = true;
      p.recurringWork = true;
      p.reliability += 2;
      rel("recycler").trust += 2;
    } else {
      if (H.state.daily.recyclerWork) return false;
      H.state.daily.recyclerWork = true;
      p.reliability += 1;
    }

    H.state.money += pay;
    H.recordJobResult?.("recycler_sort", { pay });
    changeStats({ fatigue: trial ? 9 : 10, hunger: 4, hygiene: -6 });
    advanceTime(1, `回収所の仕分け仕事を終え${pay}円を受け取った。`);
    return true;
  }

  function startFormalWork() {
    if (H.state.daily.formalWork) return false;

    const pay = 1250;
    H.state.daily.formalWork = true;
    H.state.money += pay;
    H.recordJobResult?.("warehouse_day", { pay });
    changeStats({ fatigue: 16, hunger: 7, hygiene: -7 });
    advanceTime(2, `倉庫勤務を終え${pay}円を受け取った。`);
    return true;
  }

  function startReferralWork(jobId) {
    const configs = {
      delivery_sort: { title: "配送所の仕分け", pay: 1280, fatigue: 13, hunger: 6, hygiene: -5, time: 2 },
      hotel_linen: { title: "ホテルのリネン作業", pay: 1320, fatigue: 11, hunger: 5, hygiene: -3, time: 2 }
    };
    const config = configs[jobId];
    if (!config) return false;
    if (H.state.daily?.jobs?.[jobId]) return false;

    H.state.money += config.pay;
    H.recordJobResult?.(jobId, { pay: config.pay });
    changeStats({ fatigue: config.fatigue, hunger: config.hunger, hygiene: config.hygiene });
    advanceTime(config.time, `${config.title}を終え${config.pay}円を受け取った。`);
    return true;
  }

  Object.assign(G, {
    startScavenge,
    startCasualWork,
    startCleanupWork,
    startRecyclerWork,
    startFormalWork,
    startReferralWork
  });
})();