(() => {
  const STATE_KEY = 'dd_session_wolf_v1';
  const PUP_ID = 'wolf_pup';
  const ADULT_ID = 'wolf_companion';
  const GROWTH_MINUTES = 2 * 24 * 60;
  const MEAT_IDS = ['meat_bird', 'meat_rabbit', 'meat_deer'];
  const CANINE_ENEMIES = ['wolf', 'wild_dog'];

  function nowMinutes() {
    return Number(window.DDTime?.getState?.().totalMinutes || 0);
  }

  function hasAdoptionTime() {
    return state.adoptedAt !== null && state.adoptedAt !== '' && Number.isFinite(Number(state.adoptedAt));
  }

  function loadState() {
    try {
      const parsed = JSON.parse(sessionStorage.getItem(STATE_KEY) || 'null');
      if (parsed && typeof parsed === 'object') return parsed;
    } catch (_) {}
    return { adoptedAt: null, fedCount: 0, stage: null };
  }

  let state = loadState();

  function sync() {
    try { sessionStorage.setItem(STATE_KEY, JSON.stringify(state)); } catch (_) {}
  }

  function emit(type, detail = {}) {
    window.dispatchEvent(new CustomEvent('ddwolfchange', {
      detail: { type, ...detail, state: getState() }
    }));
  }

  function hasPup() {
    return Number(window.DDItems?.count?.(PUP_ID) || 0) > 0;
  }

  function hasAdult() {
    return Number(window.DDItems?.count?.(ADULT_ID) || 0) > 0;
  }

  function hasCompanion() {
    return hasPup() || hasAdult();
  }

  function ensureStateForExistingCompanion() {
    if (!hasCompanion()) return;
    if (!hasAdoptionTime()) {
      state.adoptedAt = nowMinutes();
      state.stage = hasAdult() ? 'adult' : 'pup';
      sync();
    }
  }

  function adopt() {
    if (!window.DDItems) return false;
    if (!hasCompanion()) DDItems.add(PUP_ID, 1);
    if (!hasAdoptionTime()) state.adoptedAt = nowMinutes();
    state.stage = hasAdult() ? 'adult' : 'pup';
    state.fedCount = Math.max(0, Number(state.fedCount) || 0);
    sync();
    updateAge();
    emit('adopted');
    return true;
  }

  function ageMinutes() {
    if (!hasCompanion() || !hasAdoptionTime()) return 0;
    return Math.max(0, nowMinutes() - Number(state.adoptedAt));
  }

  function updateAge() {
    ensureStateForExistingCompanion();
    if (!hasPup()) {
      if (hasAdult() && state.stage !== 'adult') {
        state.stage = 'adult';
        sync();
      }
      return false;
    }

    if (ageMinutes() < GROWTH_MINUTES) return false;

    DDItems.remove(PUP_ID, 1);
    DDItems.add(ADULT_ID, 1);
    state.stage = 'adult';
    sync();
    emit('grown', { message: '狼の子（？）が大きくなり、狼（？）になった。' });
    return true;
  }

  function stage() {
    updateAge();
    if (hasAdult()) return 'adult';
    if (hasPup()) return 'pup';
    return null;
  }

  function name() {
    return stage() === 'adult' ? '狼（？）' : stage() === 'pup' ? '狼の子（？）' : '';
  }

  function remainingGrowthMinutes() {
    if (stage() !== 'pup') return 0;
    return Math.max(0, GROWTH_MINUTES - ageMinutes());
  }

  function availableMeat() {
    if (!window.DDItems) return [];
    return MEAT_IDS.map(id => ({
      item: DDItems.get(id),
      count: DDItems.count(id)
    })).filter(entry => entry.item && entry.count > 0);
  }

  function feed(meatId) {
    if (!hasCompanion()) return { ok: false, message: '狼はいない。' };
    if (!MEAT_IDS.includes(meatId)) return { ok: false, message: '肉以外は食べない。' };
    if (Number(DDItems?.count?.(meatId) || 0) <= 0) return { ok: false, message: 'その肉を持っていない。' };

    const item = DDItems.get(meatId);
    DDItems.remove(meatId, 1);
    state.fedCount = Math.max(0, Number(state.fedCount) || 0) + 1;
    sync();
    const message = `${name()}に${item?.name || '肉'}を与えた。`;
    emit('fed', { meatId, message });
    return { ok: true, message };
  }

  const pupBehaviors = [
    { id: 'warm', text: '体をぴたりと寄せてくる。小さな体が温かい。' },
    { id: 'mew', text: '「みゅう、みゅう」と頼りなく鳴く。' },
    { id: 'howl', text: '首を伸ばして、子狼なりの小さな遠吠えをする。', combatEffect: 'enemy_flee' }
  ];

  const adultBehaviors = [
    { id: 'warm', text: '体を寄せてくる。毛皮越しに温かい。' },
    { id: 'voice', text: '喉の奥で低く鳴く。' },
    { id: 'howl', text: '顔を上げて遠吠えする。', combatEffect: 'enemy_flee' }
  ];

  function randomBehavior() {
    if (!hasCompanion()) return null;
    const list = stage() === 'adult' ? adultBehaviors : pupBehaviors;
    const behavior = { ...list[Math.floor(Math.random() * list.length)] };
    emit('behavior', { behavior });
    return behavior;
  }

  function getEncounterRisk(enemyId, baseWeight = 1) {
    const base = Math.max(0, Number(baseWeight) || 0);
    if (!hasCompanion() || !CANINE_ENEMIES.includes(enemyId)) return base;
    return base + 1;
  }

  function combatHowl() {
    if (!hasCompanion()) return { canEscape: false, text: '' };
    const pup = stage() === 'pup';
    return {
      canEscape: true,
      text: pup
        ? '子狼が小さな遠吠えをする。敵がひるんだ。逃げられる。'
        : '狼（？）が遠吠えする。敵がひるんだ。逃げられる。'
    };
  }

  function getState() {
    return {
      hasCompanion: hasCompanion(),
      stage: hasAdult() ? 'adult' : hasPup() ? 'pup' : null,
      name: hasAdult() ? '狼（？）' : hasPup() ? '狼の子（？）' : '',
      adoptedAt: hasAdoptionTime() ? Number(state.adoptedAt) : null,
      ageMinutes: ageMinutes(),
      remainingGrowthMinutes: hasPup() ? Math.max(0, GROWTH_MINUTES - ageMinutes()) : 0,
      fedCount: Math.max(0, Number(state.fedCount) || 0),
      diet: 'meat_only',
      canineEncounterRisk: hasCompanion() ? 'increased' : 'normal',
      howlCanEscape: hasCompanion()
    };
  }

  function reset() {
    state = { adoptedAt: null, fedCount: 0, stage: null };
    try { sessionStorage.removeItem(STATE_KEY); } catch (_) {}
  }

  window.DDWolf = {
    stateKey: STATE_KEY,
    pupId: PUP_ID,
    adultId: ADULT_ID,
    growthMinutes: GROWTH_MINUTES,
    meatIds: [...MEAT_IDS],
    adopt,
    hasCompanion,
    stage,
    name,
    ageMinutes,
    remainingGrowthMinutes,
    availableMeat,
    feed,
    randomBehavior,
    getEncounterRisk,
    combatHowl,
    updateAge,
    getState,
    reset
  };

  ensureStateForExistingCompanion();
  updateAge();
  window.addEventListener('ddtimechange', updateAge);
})();