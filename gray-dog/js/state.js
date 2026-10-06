window.GrayGame = window.GrayGame || {};

(() => {
  "use strict";

  const MANUAL_STORAGE_KEY = "grayDogGame_manual_v1";
  const clamp = (n) => Math.max(0, Math.min(100, Math.round(n)));

  const defaultCare = () => ({
    satiety: 65,
    water: 70,
    energy: 75,
    hygiene: 70,
    health: 85,
    calm: 35
  });

  const defaultCounts = () => ({
    feed:0, water:0, walk_home:0, brush:0, quiet:0, rest:0, nose:0, training:0
  });

  const freshState = () => ({
    version: 1,
    mode: "facility",
    visit: 1,
    homeDay: 0,
    acted: false,
    momentsLeft: 1,
    todayWins: 0,
    usedActions: [],
    trust: 0,
    familiarity: 0,
    prep: [],
    firsts: [],
    journal: [{ day: "訪問 1回目", text: "保護施設でグレイと初めて会った。" }],
    care: defaultCare(),
    careCounts: defaultCounts(),
    lastEvent: "intro",
    lastOutcome: "",
    lastResultText: "",
    lastObservationText: "",
    daySummary: ""
  });

  const clone = (value) => JSON.parse(JSON.stringify(value));
  let state = freshState();

  function normalize(next) {
    const base = freshState();
    const merged = { ...base, ...clone(next) };
    merged.care = { ...base.care, ...(next.care || {}) };
    merged.careCounts = { ...base.careCounts, ...(next.careCounts || {}) };
    merged.usedActions = Array.isArray(merged.usedActions) ? merged.usedActions : [];
    merged.prep = Array.isArray(merged.prep) ? merged.prep : [];
    merged.firsts = Array.isArray(merged.firsts) ? merged.firsts : [];
    merged.journal = Array.isArray(merged.journal) ? merged.journal : base.journal;
    if (merged.mode === "home" && (!Number.isFinite(merged.momentsLeft) || merged.momentsLeft > 4)) merged.momentsLeft = 4;
    if (merged.mode === "facility" && !Number.isFinite(merged.momentsLeft)) merged.momentsLeft = 1;
    Object.keys(merged.care).forEach((key) => { merged.care[key] = clamp(merged.care[key]); });
    return merged;
  }

  GrayGame.getState = () => state;
  GrayGame.exportState = () => clone(state);
  GrayGame.clamp = clamp;

  GrayGame.replaceState = (next) => {
    if (!next || typeof next !== "object" || next.version !== 1) throw new Error("invalid save");
    state = normalize(next);
    return state;
  };

  GrayGame.reset = () => {
    state = freshState();
    return state;
  };

  GrayGame.patch = (patch) => {
    state = { ...state, ...patch };
    return state;
  };

  GrayGame.patchCare = (patch) => {
    state = {
      ...state,
      care: {
        ...state.care,
        ...Object.fromEntries(Object.entries(patch).map(([k,v]) => [k, clamp(v)]))
      }
    };
    return state.care;
  };

  GrayGame.addJournal = (text, dayLabel) => {
    state.journal.unshift({ day: dayLabel || GrayGame.dayLabel(), text });
  };

  GrayGame.addFirst = (id, label) => {
    if (state.firsts.some((x) => x.id === id)) return false;
    state.firsts.push({ id, label });
    return true;
  };

  GrayGame.addPrep = (id) => {
    if (!state.prep.includes(id)) state.prep.push(id);
  };

  GrayGame.saveLocalManual = () => {
    try {
      localStorage.setItem(MANUAL_STORAGE_KEY, JSON.stringify(state));
      return true;
    } catch (_) {
      return false;
    }
  };

  GrayGame.loadLocalManual = () => {
    try {
      const raw = localStorage.getItem(MANUAL_STORAGE_KEY);
      if (!raw) return false;
      GrayGame.replaceState(JSON.parse(raw));
      return true;
    } catch (_) {
      return false;
    }
  };

  GrayGame.hasLocalManualSave = () => {
    try { return !!localStorage.getItem(MANUAL_STORAGE_KEY); }
    catch (_) { return false; }
  };

  GrayGame.dayLabel = () => state.mode === "facility"
    ? `訪問 ${state.visit}回目`
    : `一緒に暮らして ${state.homeDay + 1}日目`;
})();