window.GrayGame = window.GrayGame || {};

(() => {
  const STORAGE_KEY = 'grayDogGame_v1';
  const freshState = () => ({
    version: 1,
    mode: 'facility',
    visit: 1,
    homeDay: 0,
    acted: false,
    trust: 0,
    familiarity: 0,
    prep: [],
    firsts: [],
    journal: [{ day: '訪問 1回目', text: '保護施設でグレイと初めて会った。' }],
    lastEvent: 'intro'
  });

  function load() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
      if (!saved || saved.version !== 1) return freshState();
      return { ...freshState(), ...saved };
    } catch {
      return freshState();
    }
  }

  let state = load();

  GrayGame.getState = () => state;
  GrayGame.save = () => localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  GrayGame.reset = () => {
    state = freshState();
    GrayGame.save();
    return state;
  };
  GrayGame.patch = (patch) => {
    state = { ...state, ...patch };
    GrayGame.save();
    return state;
  };
  GrayGame.addJournal = (text, dayLabel) => {
    state.journal.unshift({ day: dayLabel || GrayGame.dayLabel(), text });
    GrayGame.save();
  };
  GrayGame.addFirst = (id, label) => {
    if (state.firsts.some(x => x.id === id)) return false;
    state.firsts.push({ id, label });
    GrayGame.save();
    return true;
  };
  GrayGame.addPrep = (id) => {
    if (!state.prep.includes(id)) state.prep.push(id);
    GrayGame.save();
  };
  GrayGame.dayLabel = () => state.mode === 'facility'
    ? `訪問 ${state.visit}回目`
    : `一緒に暮らして ${state.homeDay + 1}日目`;
})();