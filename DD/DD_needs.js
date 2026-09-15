(() => {
  const STATE_KEY = 'dd_session_needs_v1';
  const MAX_HUNGER = 100;
  const PLAYER_HUNGER_PER_HOUR = 2;
  const WOLF_HUNGER_PER_HOUR = 2;

  function nowMinutes() {
    return Math.max(0, Number(window.DDTime?.getState?.().totalMinutes || 0));
  }

  function clamp(value) {
    return Math.max(0, Math.min(MAX_HUNGER, Number(value) || 0));
  }

  function load() {
    try {
      const parsed = JSON.parse(sessionStorage.getItem(STATE_KEY) || 'null');
      if (parsed && typeof parsed === 'object') {
        return {
          playerHunger: clamp(parsed.playerHunger),
          wolfHunger: clamp(parsed.wolfHunger),
          lastMinutes: Number.isFinite(Number(parsed.lastMinutes)) ? Number(parsed.lastMinutes) : nowMinutes()
        };
      }
    } catch (_) {}
    return { playerHunger: 0, wolfHunger: 0, lastMinutes: nowMinutes() };
  }

  let state = load();

  function syncStorage() {
    try { sessionStorage.setItem(STATE_KEY, JSON.stringify(state)); } catch (_) {}
  }

  function emit(reason = '') {
    window.dispatchEvent(new CustomEvent('ddneedschange', {
      detail: { reason, ...getState(false) }
    }));
  }

  function hasWolf() {
    return Number(window.DDItems?.count?.('wolf_pup') || 0) > 0 ||
      Number(window.DDItems?.count?.('wolf_companion') || 0) > 0;
  }

  function syncTime(reason = 'time') {
    const now = nowMinutes();
    const elapsed = Math.max(0, now - Number(state.lastMinutes || 0));
    if (elapsed > 0) {
      state.playerHunger = clamp(state.playerHunger + elapsed * PLAYER_HUNGER_PER_HOUR / 60);
      if (hasWolf()) {
        state.wolfHunger = clamp(state.wolfHunger + elapsed * WOLF_HUNGER_PER_HOUR / 60);
      }
      state.lastMinutes = now;
      syncStorage();
      emit(reason);
    } else if (now < Number(state.lastMinutes || 0)) {
      state.lastMinutes = now;
      syncStorage();
    }
    return getState(false);
  }

  function feedPlayer(amount) {
    syncTime('before-player-feed');
    state.playerHunger = clamp(state.playerHunger - Math.max(0, Number(amount) || 0));
    syncStorage();
    emit('player-feed');
    return state.playerHunger;
  }

  function feedWolf(amount) {
    syncTime('before-wolf-feed');
    state.wolfHunger = clamp(state.wolfHunger - Math.max(0, Number(amount) || 0));
    syncStorage();
    emit('wolf-feed');
    return state.wolfHunger;
  }

  function getState(doSync = true) {
    if (doSync) syncTime('read');
    return {
      maxHunger: MAX_HUNGER,
      playerHunger: Math.round(clamp(state.playerHunger)),
      wolfHunger: Math.round(clamp(state.wolfHunger)),
      hasWolf: hasWolf(),
      playerHungerRatePerHour: PLAYER_HUNGER_PER_HOUR,
      wolfHungerRatePerHour: WOLF_HUNGER_PER_HOUR
    };
  }

  function reset() {
    state = { playerHunger: 0, wolfHunger: 0, lastMinutes: nowMinutes() };
    try { sessionStorage.removeItem(STATE_KEY); } catch (_) {}
    emit('reset');
  }

  window.DDNeeds = {
    stateKey: STATE_KEY,
    maxHunger: MAX_HUNGER,
    syncTime,
    getState,
    feedPlayer,
    feedWolf,
    reset
  };

  syncTime('load');
  window.addEventListener('ddtimechange', () => syncTime('time'));
  window.addEventListener('ddinventorychange', () => syncTime('inventory'));
})();