(() => {
  "use strict";
  const H = window.HMW;
  const D = H.DATA;
  const G = H.Game = H.Game || {};
  const $ = (id) => document.getElementById(id);
  const clamp = (n, min = 0, max = 100) => Math.max(min, Math.min(max, n));

  function ensureState() {
    const fresh = H.createInitialState();
    const s = H.state || fresh;
    const oldVersion = Number(s.version) || 1;
    s.version = 3;
    s.world = { ...fresh.world, ...(s.world || {}) };
    s.world.locations = s.world.locations || {};
    s.inventory = s.inventory || {};
    s.knownLocations = { ...fresh.knownLocations, ...(s.knownLocations || {}) };
    s.relationships = s.relationships || {};
    Object.keys(fresh.relationships).forEach((id) => {
      s.relationships[id] = { ...fresh.relationships[id], ...(s.relationships[id] || {}) };
      s.relationships[id].flags = s.relationships[id].flags || {};
    });
    s.progression = s.progression || {};
    Object.keys(fresh.progression).forEach((key) => {
      s.progression[key] = { ...fresh.progression[key], ...(s.progression[key] || {}) };
    });
    s.progression.stability = { ...fresh.progression.stability, ...(s.progression.stability || {}) };
    s.story = { ...fresh.story, ...(s.story || {}) };
    s.story.seen = { ...fresh.story.seen, ...((s.story && s.story.seen) || {}) };
    s.story.counters = { ...fresh.story.counters, ...((s.story && s.story.counters) || {}) };
    s.sleep = { ...fresh.sleep, ...(s.sleep || {}) };
    s.sleep.known = { ...fresh.sleep.known, ...((s.sleep && s.sleep.known) || {}) };
    s.daily = { ...H.createDailyState(), ...(s.daily || {}) };
    ["beg", "scavenge", "talk", "wash", "rest", "sceneKeys"].forEach((k) => { s.daily[k] = s.daily[k] || {}; });
    s.leads = Array.isArray(s.leads) ? s.leads : fresh.leads;
    s.history = Array.isArray(s.history) ? s.history : fresh.history;
    s.stats = { ...fresh.stats, ...(s.stats || {}) };

    if (oldVersion < 2) {
      s.stats.health = Math.max(60, s.stats.health);
      s.stats.hunger = Math.min(55, s.stats.hunger);
      s.stats.fatigue = Math.min(45, s.stats.fatigue);
      s.stats.hygiene = Math.max(35, s.stats.hygiene);
      s.stats.warmth = Math.max(45, s.stats.warmth);
      s.stats.wetness = Math.min(20, s.stats.wetness);
      s.activeEvent = null;
    }
    if (oldVersion < 3) {
      s.activeEvent = null;
      s.lastMessage = "セーブを新しい生活シミュレーション方式へ移行した。深夜を越えるのは睡眠を選んだ時だけ。";
    }
    if (!D.locations[s.location]) s.location = "station_front";
    H.state = s;
    H.clampStats();
  }

  function locState(id) {
    if (!H.state.world.locations[id]) {
      H.state.world.locations[id] = { visits: 0, heat: 0, depletion: 0, complaints: 0 };
    }
    return H.state.world.locations[id];
  }

  function rel(id) { return H.state.relationships[id]; }

  function random(key, min, max) {
    const raw = `${H.state.day}|${H.state.slot}|${H.state.location}|${key}`;
    let n = 2166136261;
    for (let i = 0; i < raw.length; i += 1) {
      n ^= raw.charCodeAt(i);
      n = Math.imul(n, 16777619);
    }
    return min + ((n >>> 0) % (max - min + 1));
  }

  function changeStats(effects) {
    Object.entries(effects || {}).forEach(([key, amount]) => {
      if (typeof H.state.stats[key] === "number" && typeof amount === "number") {
        H.state.stats[key] = clamp(H.state.stats[key] + amount);
      }
    });
    H.clampStats();
  }

  function unlock(id, message) {
    if (H.state.knownLocations[id]) return false;
    H.state.knownLocations[id] = true;
    if (message) H.addHistory(message);
    return true;
  }

  function rollWeather() {
    const n = random(`weather-${H.state.day}`, 1, 10);
    H.state.world.weather = n <= 2 ? "rain" : (n === 3 ? "cold" : "clear");
  }

  function actionTick() {
    changeStats({ hunger: 3, fatigue: 2, hygiene: -1 });
    if (H.state.world.weather === "rain") changeStats({ wetness: 5, warmth: -2 });
    else if (H.state.stats.wetness > 0) changeStats({ wetness: -3 });
    if (H.state.world.weather === "cold") changeStats({ warmth: -1 });
  }

  function advanceTime(steps = 1, message = "") {
    const count = Math.max(0, Number(steps) || 0);
    for (let i = 0; i < count; i += 1) {
      actionTick();
      if (H.state.slot < 3) H.state.slot += 1;
    }
    if (message) H.addHistory(message);
    G.refresh?.();
  }

  function setEvent(e) { H.state.activeEvent = e; G.refresh?.(); }
  function clearEvent(message) { H.state.activeEvent = null; if (message) H.addHistory(message); G.refresh?.(); }

  function policeCheck(reason) {
    const attention = H.state.world.policeAttention;
    if (attention < 3 || !["station_front", "shopping_street"].includes(H.state.location)) return false;
    const roll = random(`police-${reason}-${locState(H.state.location).heat}`, 1, 100);
    if (roll > Math.min(72, 18 + attention * 10)) return false;
    setEvent({
      id: "police",
      title: "警官に呼び止められた",
      text: "これまでの物乞いや長居への反応だ。移動した罰ではない。",
      choices: [
        { id: "calm", label: "落ち着いて答える" },
        { id: "stop", label: "今日はここで目立つ行動をやめる" },
        { id: "argue", label: "反発する" }
      ]
    });
    return true;
  }

  function underpassCheck() {
    if (H.state.progression.thug.safePassage) return false;
    if (random(`underpass-${H.state.day}`, 1, 100) > 38) return false;
    setEvent({
      id: "underpass",
      title: "高架下の縄張り",
      text: "ここで寝るなら話を通せと言われた。移動しただけでは発生しない。",
      choices: [
        { id: "back", label: "公園で寝る" },
        { id: "pay", label: "200円払う", disabled: H.state.money < 200 },
        { id: "name", label: "名前付き不良に話を通す", disabled: rel("thug_named").familiarity < 2 }
      ]
    });
    return true;
  }

  function resolveEvent(choice) {
    const e = H.state.activeEvent;
    if (!e) return;
    if (e.id === "police") {
      if (choice === "calm") {
        H.state.world.policeAttention = Math.max(0, H.state.world.policeAttention - 1);
        rel("police_named").familiarity += 1;
        clearEvent("質問に答えた。注意度が少し下がった。");
      } else if (choice === "stop") {
        H.state.world.policeAttention = Math.max(0, H.state.world.policeAttention - 1);
        clearEvent("今日はこの場所で目立つ行動をやめた。行き先は自分で選べる。");
      } else {
        H.state.world.policeAttention += 2;
        rel("police_named").irritation += 1;
        clearEvent("言い合いになった。金も体力も減らないが、今後は警戒されやすい。");
      }
      return;
    }
    if (e.id === "underpass") {
      if (choice === "back") {
        H.state.location = "park";
        clearEvent("公園へ戻った。移動による消耗はない。");
      } else if (choice === "pay" && H.state.money >= 200) {
        H.state.money -= 200;
        H.state.progression.thug.safePassage = true;
        clearEvent("200円を払い、今夜は高架下を使える。");
      } else if (choice === "name" && rel("thug_named").familiarity >= 2) {
        rel("thug_named").trust += 1;
        H.state.progression.thug.safePassage = true;
        clearEvent("名前付き不良が口を挟み、寝場所を使えるようになった。");
      }
    }
  }

  function travel(id) {
    if (H.state.activeEvent || !H.state.knownLocations[id] || !D.locations[id]) return;
    H.state.location = id;
    locState(id).visits += 1;
    H.state.lastMessage = `${D.locations[id].name}へ移った。街の様子と、そこで今起きていることが変わる。`;
    closeModal();
    G.refresh?.();
  }

  function stabilityScore() {
    const p = H.state.progression;
    let score = 0;
    if (p.stability.paidWorkDays >= 1) score += 1;
    if (p.stability.safeNights >= 1) score += 1;
    if (p.support.caseOpened || p.stability.supportBase) score += 1;
    if (p.recycler.recurringWork || p.clerk.cleanupUnlocked || p.support.workAccess || p.stability.regularIncome) score += 1;
    if (p.homelessNetwork.safeSleepAdvice || rel("clerk").trust >= 1 || rel("support_named").trust >= 2 || p.stability.streetNetwork) score += 1;
    return Math.min(5, score);
  }

  function escapeHtml(value) {
    return String(value ?? "").replace(/[&<>'"]/g, (c) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;"
    }[c]));
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

  function closeModal() { $("modal-backdrop").classList.remove("open"); }
  function info(title, text) { openModal(title, `<p>${escapeHtml(text)}</p>`, [], true); }

  Object.assign(G, {
    $, clamp, ensureState, locState, rel, random, changeStats, unlock, rollWeather,
    advanceTime, policeCheck, underpassCheck, resolveEvent, travel, stabilityScore,
    escapeHtml, openModal, closeModal, info
  });
})();