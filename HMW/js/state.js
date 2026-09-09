(() => {
  "use strict";
  window.HMW = window.HMW || {};
  const HMW = window.HMW;

  const relationship = () => ({ familiarity: 0, trust: 0, goodwill: 0, irritation: 0, lastContactDay: 0, flags: {} });

  HMW.createInitialState = () => ({
    version: 1,
    day: 1,
    slot: 0,
    money: 0,
    location: "station_front",
    stats: { health: 80, hunger: 35, fatigue: 25, hygiene: 45, warmth: 55, wetness: 0 },
    inventory: {},
    knownLocations: {
      station_front: true,
      shopping_street: true,
      park: true,
      police_station: true
    },
    world: {
      locations: {},
      policeAttention: 0,
      residentComplaints: 0,
      weather: "clear"
    },
    relationships: {
      support_named: relationship(),
      police_named: relationship(),
      homeless_named: relationship(),
      thug_named: relationship(),
      clerk: relationship(),
      recycler: relationship()
    },
    progression: {
      support: { stage: 0, priority: null, nextDay: 1, workAccess: false, shelterReferral: false },
      recycler: { sales: 0, reliability: 0, trialDone: false, recurringWork: false },
      clerk: { visits: 0, cleanupUnlocked: false, banned: false },
      homelessNetwork: { level: 0, underpassKnown: false, riverKnown: false, safeSleepAdvice: false },
      police: { warnings: 0, referralKnown: false },
      thug: { familiarity: 0, debt: 0, safePassage: false }
    },
    sleep: {
      known: { park: true },
      access: { park: true },
      lastPlace: null
    },
    daily: {
      beg: {},
      scavenge: {},
      talk: {},
      foodSupport: false,
      wash: {},
      recyclerWork: false,
      clerkWork: false,
      formalWork: false,
      rest: {}
    },
    activeEvent: null,
    leads: [
      { id: "first_board", text: "駅前の掲示板を確認する", done: false },
      { id: "food_today", text: "今日の食料を確保する", done: false },
      { id: "sleep_tonight", text: "今夜眠れる場所を確保する", done: false }
    ],
    history: ["DAY1 朝　駅前。所持金はない。今日をどうつなぐか考える必要がある。"],
    lastMessage: "駅前にいる。人は多いが、ここに立っているだけでは何も変わらない。"
  });

  HMW.state = HMW.createInitialState();

  HMW.resetDaily = () => {
    HMW.state.daily = {
      beg: {}, scavenge: {}, talk: {}, foodSupport: false,
      wash: {}, recyclerWork: false, clerkWork: false, formalWork: false, rest: {}
    };
  };

  HMW.clampStats = () => {
    Object.keys(HMW.state.stats).forEach((key) => {
      HMW.state.stats[key] = Math.max(0, Math.min(100, Number(HMW.state.stats[key]) || 0));
    });
    HMW.state.money = Math.max(0, Math.floor(Number(HMW.state.money) || 0));
  };

  HMW.addHistory = (text) => {
    if (!text) return;
    HMW.state.history.unshift(`DAY${HMW.state.day} ${HMW.DATA.slots[HMW.state.slot]}　${text}`);
    HMW.state.history = HMW.state.history.slice(0, 120);
    HMW.state.lastMessage = text;
  };

  HMW.addItem = (id, qty = 1) => {
    HMW.state.inventory[id] = (HMW.state.inventory[id] || 0) + qty;
  };

  HMW.removeItem = (id, qty = 1) => {
    const have = HMW.state.inventory[id] || 0;
    if (have < qty) return false;
    HMW.state.inventory[id] = have - qty;
    if (HMW.state.inventory[id] <= 0) delete HMW.state.inventory[id];
    return true;
  };

  HMW.addLead = (id, text) => {
    const found = HMW.state.leads.find((lead) => lead.id === id);
    if (found) {
      found.text = text;
      found.done = false;
      return;
    }
    HMW.state.leads.push({ id, text, done: false });
  };

  HMW.completeLead = (id) => {
    const lead = HMW.state.leads.find((item) => item.id === id);
    if (lead) lead.done = true;
  };
})();