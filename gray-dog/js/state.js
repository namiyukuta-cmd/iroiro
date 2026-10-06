window.GrayGame = window.GrayGame || {};

(() => {
  "use strict";

  const MANUAL_STORAGE_KEY = "grayDogGame_manual_v1";

  const freshState = () => ({
    version: 1,
    mode: "facility",
    visit: 1,
    homeDay: 0,
    acted: false,
    momentsLeft: 4,
    usedActions: [],
    actionCounts: { sit:0, snack:0, hand:0, walk:0, staff:0 },
    trust: 0,
    familiarity: 0,
    prep: [],
    firsts: [],
    journal: [{ day: "訪問 1回目", text: "保護施設でグレイと初めて会った。" }],
    lastEvent: "intro",
    lastOutcome: "",
    lastResultText: "",
    lastObservationText: ""
  });

  const clone = (value) => JSON.parse(JSON.stringify(value));
  let state = freshState();

  GrayGame.getState = () => state;
  GrayGame.exportState = () => clone(state);

  GrayGame.replaceState = (next) => {
    if (!next || typeof next !== "object" || next.version !== 1) throw new Error("invalid save");
    state = { ...freshState(), ...clone(next) };
    state.actionCounts = { ...freshState().actionCounts, ...(next.actionCounts || {}) };
    state.usedActions = Array.isArray(state.usedActions) ? state.usedActions : [];
    if (!Number.isFinite(state.momentsLeft)) state.momentsLeft = state.acted ? 0 : 4;
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