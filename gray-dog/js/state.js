window.GrayGame = window.GrayGame || {};

(() => {
  "use strict";

  // 明示的に「保存」を押した時だけ使うキー。
  // 旧 grayDogGame_v1 は自動保存だったため、今後は読み込まない。
  const MANUAL_STORAGE_KEY = "grayDogGame_manual_v1";

  const freshState = () => ({
    version: 1,
    mode: "facility",
    visit: 1,
    homeDay: 0,
    acted: false,
    trust: 0,
    familiarity: 0,
    prep: [],
    firsts: [],
    journal: [{ day: "訪問 1回目", text: "保護施設でグレイと初めて会った。" }],
    lastEvent: "intro"
  });

  const clone = (value) => JSON.parse(JSON.stringify(value));

  // 起動時は勝手にロードしない。新規状態から開始する。
  let state = freshState();

  GrayGame.getState = () => state;
  GrayGame.exportState = () => clone(state);

  GrayGame.replaceState = (next) => {
    if (!next || typeof next !== "object" || next.version !== 1) {
      throw new Error("invalid save");
    }
    state = { ...freshState(), ...clone(next) };
    return state;
  };

  GrayGame.reset = () => {
    state = freshState();
    return state;
  };

  // ゲーム進行はメモリ上だけ変更。ここでは保存しない。
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
      const parsed = JSON.parse(raw);
      GrayGame.replaceState(parsed);
      return true;
    } catch (_) {
      return false;
    }
  };

  GrayGame.hasLocalManualSave = () => {
    try {
      return !!localStorage.getItem(MANUAL_STORAGE_KEY);
    } catch (_) {
      return false;
    }
  };

  GrayGame.dayLabel = () => state.mode === "facility"
    ? `訪問 ${state.visit}回目`
    : `一緒に暮らして ${state.homeDay + 1}日目`;
})();