(() => {
  "use strict";
  window.HMW = window.HMW || {};
  const HMW = window.HMW;

  const clamp100 = (value) => Math.max(0, Math.min(100, Number(value) || 0));

  HMW.RELATIONSHIP_LABELS = Object.freeze({
    familiarity: "親密度",
    trust: "信頼",
    goodwill: "好意",
    desire: "欲求",
    conscience: "良心",
    malice: "悪心"
  });

  HMW.RELATIONSHIP_DISPLAY_KEYS = Object.freeze([
    "familiarity",
    "trust",
    "goodwill",
    "desire",
    "conscience",
    "malice"
  ]);

  HMW.ROMANCE_GROWTH = Object.freeze({
    conversation: Object.freeze({ familiarity: 1, trust: 0, goodwill: 0, desire: 0 }),
    shared_time: Object.freeze({ familiarity: 1, trust: 0, goodwill: 1, desire: 0 }),
    share_food: Object.freeze({ familiarity: 1, trust: 1, goodwill: 2, desire: 0 }),
    help: Object.freeze({ familiarity: 1, trust: 2, goodwill: 1, desire: 0 }),
    personal: Object.freeze({ familiarity: 2, trust: 2, goodwill: 1, desire: 0 }),
    affection: Object.freeze({ familiarity: 2, trust: 1, goodwill: 2, desire: 1 }),
    confession: Object.freeze({ familiarity: 3, trust: 1, goodwill: 3, desire: 2 }),
    touch: Object.freeze({ familiarity: 2, trust: 1, goodwill: 2, desire: 2 }),
    overnight: Object.freeze({ familiarity: 2, trust: 1, goodwill: 2, desire: 1 })
  });

  HMW.growRomance = (id, type, extra = {}) => {
    const rel = HMW.state.relationships?.[id];
    const person = HMW.DATA?.people?.[id];
    if (!rel || !person?.romance) return null;

    const base = HMW.ROMANCE_GROWTH[type] || {};
    ["familiarity", "trust", "goodwill", "desire"].forEach((key) => {
      const amount = (Number(base[key]) || 0) + (Number(extra[key]) || 0);
      if (amount) rel[key] = clamp100((Number(rel[key]) || 0) + amount);
    });
    rel.lastContactDay = HMW.state.day;
    HMW.applyPsychologyEvent?.(id, type, {
      reason: `HMW.growRomance:${type}`
    });
    return rel;
  };

  const relationship = (id) => {
    const mind = HMW.DATA?.people?.[id]?.mind || {};
    const rel = {
      familiarity: 0,
      trust: 0,
      goodwill: 0,
      irritation: 0,
      desire: clamp100(mind.desire),
      conscience: clamp100(mind.conscience),
      malice: clamp100(mind.malice),
      lastContactDay: 0,
      flags: {}
    };
    if (HMW.DATA?.people?.[id]?.romance) {
      rel.psychology = HMW.createPsychologyState?.(id, rel) || null;
      rel.psychologyHistory = [];
    }
    return rel;
  };

  const createDaily = () => ({
    beg: {},
    scavenge: {},
    talk: {},
    foodSupport: false,
    supportShowerLaundry: false,
    periodCare: false,
    wash: {},
    recyclerWork: false,
    clerkWork: false,
    formalWork: false,
    rest: {},
    casualChecked: false,
    casualOffer: false,
    casualDone: false,
    recyclerTalk: false,
    sceneKeys: {}
  });

  HMW.createInitialState = () => ({
    version: 4,
    day: 1,
    slot: 0,
    money: 0,
    location: "station_front",
    stats: {
      health: 80,
      hunger: 35,
      fatigue: 25,
      hygiene: 45,
      warmth: 55,
      wetness: 0
    },
    inventory: {},
    body: {
      cycleDay: 24,
      cycleLength: 28,
      periodLength: 5
    },
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
      support_named: relationship("support_named"),
      police_named: relationship("police_named"),
      homeless_named: relationship("homeless_named"),
      thug_named: relationship("thug_named"),
      clerk: relationship("clerk"),
      recycler: relationship("recycler")
    },
    progression: {
      support: {
        stage: 0,
        priority: null,
        nextDay: 1,
        workAccess: false,
        shelterReferral: false,
        caseOpened: false,
        lastLaundryDay: 0
      },
      recycler: {
        sales: 0,
        reliability: 0,
        trialDone: false,
        recurringWork: false
      },
      clerk: {
        visits: 0,
        cleanupUnlocked: false,
        banned: false
      },
      homelessNetwork: {
        level: 0,
        underpassKnown: false,
        riverKnown: false,
        safeSleepAdvice: false
      },
      police: {
        warnings: 0,
        referralKnown: false,
        patrolTipKnown: false
      },
      thug: {
        familiarity: 0,
        debt: 0,
        safePassage: false,
        carryKnown: false
      },
      informal: {
        recyclingNoticeKnown: false,
        casualWorkKnown: false
      },
      stability: {
        paidWorkDays: 0,
        safeNights: 0,
        regularIncome: false,
        supportBase: false,
        streetNetwork: false
      },
      housing: {
        current: "street_base",
        target: "transitional_housing"
      }
    },
    story: {
      seen: {},
      counters: {}
    },
    sleep: {
      known: { park: true },
      access: { park: true },
      lastPlace: null
    },
    daily: createDaily(),
    activeEvent: null,
    leads: [
      { id: "first_board", text: "駅前で今日使える情報を探す", done: false },
      { id: "food_today", text: "今日の食料を確保する", done: false },
      { id: "sleep_tonight", text: "今夜眠れる場所を確保する", done: false }
    ],
    history: [
      "DAY1 朝　駅前。所持金はない。街の中で、食事・仕事・人とのつながりを一つずつ作っていく。"
    ],
    lastMessage: "駅前にいる。ここには掲示板だけでなく、仕事を探す人、通勤客、店の搬入口、休める場所がある。"
  });

  HMW.state = HMW.createInitialState();
  HMW.createDailyState = createDaily;

  HMW.resetDaily = () => {
    HMW.state.daily = createDaily();
  };

  HMW.getMenstrualStatus = () => {
    const body = HMW.state.body || {};
    const cycleLength = Math.max(1, Number(body.cycleLength) || 28);
    const periodLength = Math.max(1, Math.min(cycleLength, Number(body.periodLength) || 5));
    const cycleDay = Math.max(1, Math.min(cycleLength, Number(body.cycleDay) || 1));
    return {
      cycleDay,
      cycleLength,
      periodLength,
      active: cycleDay <= periodLength,
      periodDay: cycleDay <= periodLength ? cycleDay : 0
    };
  };

  HMW.advanceMenstrualCycle = () => {
    const body = HMW.state.body || (HMW.state.body = { cycleDay: 24, cycleLength: 28, periodLength: 5 });
    const cycleLength = Math.max(1, Number(body.cycleLength) || 28);
    body.cycleDay = ((Math.max(1, Number(body.cycleDay) || 1)) % cycleLength) + 1;
    return HMW.getMenstrualStatus();
  };

  HMW.clampStats = () => {
    Object.keys(HMW.state.stats).forEach((key) => {
      HMW.state.stats[key] = Math.max(0, Math.min(100, Number(HMW.state.stats[key]) || 0));
    });
    HMW.state.money = Math.max(0, Math.floor(Number(HMW.state.money) || 0));
  };

  HMW.getNpcMind = (id) => {
    const rel = HMW.state.relationships?.[id];
    if (!rel || !HMW.DATA?.people?.[id]?.romance) return null;
    const desire = clamp100(rel.desire);
    const conscience = clamp100(rel.conscience);
    const malice = clamp100(rel.malice);
    const pressure = desire * (1 + malice / 100) - conscience;
    const rule = HMW.DATA?.npcMindRule || {};
    const restrainedMax = Number(rule.restrainedMax ?? 20);
    const conflictedMax = Number(rule.conflictedMax ?? 50);
    const mode = pressure <= restrainedMax
      ? "restrained"
      : (pressure <= conflictedMax ? "conflicted" : "desire_led");
    return { desire, conscience, malice, pressure, mode };
  };

  HMW.adjustNpcMind = (id, changes = {}) => {
    const rel = HMW.state.relationships?.[id];
    if (!rel || !HMW.DATA?.people?.[id]?.romance) return null;
    ["desire", "conscience", "malice"].forEach((key) => {
      if (typeof changes[key] === "number") rel[key] = clamp100((Number(rel[key]) || 0) + changes[key]);
    });
    HMW.applyPsychologyEvent?.(id, "mind_adjust", {
      reason: "HMW.adjustNpcMind",
      psychologyChanges: {
        ...(typeof changes.desire === "number" ? { physicalNeed: changes.desire } : {}),
        ...(typeof changes.conscience === "number" ? { ethics: changes.conscience } : {})
      }
    });
    return HMW.getNpcMind(id);
  };

  HMW.getNpcStatus = (id) => {
    const rel = HMW.state.relationships?.[id];
    const person = HMW.DATA?.people?.[id];
    if (!rel || !person) return null;
    const values = {};
    HMW.RELATIONSHIP_DISPLAY_KEYS.forEach((key) => {
      values[key] = Number(rel[key]) || 0;
    });
    return {
      id,
      name: person.name,
      labels: HMW.RELATIONSHIP_LABELS,
      values
    };
  };

  HMW.formatNpcStatus = (id) => {
    const status = HMW.getNpcStatus(id);
    if (!status) return "";
    const body = HMW.RELATIONSHIP_DISPLAY_KEYS
      .map((key) => `${HMW.RELATIONSHIP_LABELS[key]} ${status.values[key]}`)
      .join("／");
    return `${status.name}：${body}`;
  };

  HMW.addHistory = (text) => {
    if (!text) return;
    const slotName = HMW.DATA?.slots?.[HMW.state.slot] || "";
    HMW.state.history.unshift(`DAY${HMW.state.day} ${slotName}　${text}`);
    HMW.state.history = HMW.state.history.slice(0, 180);
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