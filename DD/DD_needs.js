(() => {
  const STATE_KEY = 'dd_session_needs_v1';
  const MAX_HUNGER = 100;
  const PLAYER_HUNGER_PER_HOUR = 2;
  const WOLF_HUNGER_PER_HOUR = 2;
  const OTHER_FOOD_HOLD_MINUTES = 5 * 60;
  const MEAT_FISH_HOLD_MINUTES = 8 * 60;

  function nowMinutes() {
    return Math.max(0, Number(window.DDTime?.getState?.().totalMinutes || 0));
  }

  function clamp(value) {
    return Math.max(0, Math.min(MAX_HUNGER, Number(value) || 0));
  }

  function finiteOr(value, fallback = 0) {
    const number = Number(value);
    return Number.isFinite(number) ? number : fallback;
  }

  function load() {
    const now = nowMinutes();
    try {
      const parsed = JSON.parse(sessionStorage.getItem(STATE_KEY) || 'null');
      if (parsed && typeof parsed === 'object') {
        return {
          playerHunger: clamp(parsed.playerHunger),
          wolfHunger: clamp(parsed.wolfHunger),
          lastMinutes: finiteOr(parsed.lastMinutes, now),
          playerNoHungerUntil: Math.max(0, finiteOr(parsed.playerNoHungerUntil, 0)),
          wolfNoHungerUntil: Math.max(0, finiteOr(parsed.wolfNoHungerUntil, 0))
        };
      }
    } catch (_) {}
    return {
      playerHunger: 0,
      wolfHunger: 0,
      lastMinutes: now,
      playerNoHungerUntil: 0,
      wolfNoHungerUntil: 0
    };
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

  function activeElapsed(start, end, holdUntil) {
    if (end <= start) return 0;
    const activeStart = Math.max(start, Math.max(0, finiteOr(holdUntil, 0)));
    return Math.max(0, end - activeStart);
  }

  function syncTime(reason = 'time') {
    const now = nowMinutes();
    const last = Math.max(0, finiteOr(state.lastMinutes, now));

    if (now < last) {
      state.lastMinutes = now;
      syncStorage();
      return getState(false);
    }

    if (now > last) {
      const playerElapsed = activeElapsed(last, now, state.playerNoHungerUntil);
      state.playerHunger = clamp(
        state.playerHunger + playerElapsed * PLAYER_HUNGER_PER_HOUR / 60
      );

      if (hasWolf()) {
        const wolfElapsed = activeElapsed(last, now, state.wolfNoHungerUntil);
        state.wolfHunger = clamp(
          state.wolfHunger + wolfElapsed * WOLF_HUNGER_PER_HOUR / 60
        );
      }

      state.lastMinutes = now;
      syncStorage();
      emit(reason);
    }

    return getState(false);
  }

  function isMeatOrFish(foodType) {
    const value = String(foodType || '').toLowerCase();
    return value === 'meat' || value === 'fish' || value === '肉' || value === '魚';
  }

  function holdMinutesForFood(foodType) {
    return isMeatOrFish(foodType) ? MEAT_FISH_HOLD_MINUTES : OTHER_FOOD_HOLD_MINUTES;
  }

  function feedPlayer(amount, foodType = 'other') {
    syncTime('before-player-feed');
    const now = nowMinutes();
    state.playerHunger = clamp(state.playerHunger - Math.max(0, Number(amount) || 0));
    state.playerNoHungerUntil = now + holdMinutesForFood(foodType);
    state.lastMinutes = now;
    syncStorage();
    emit('player-feed');
    return state.playerHunger;
  }

  function feedWolf(amount) {
    syncTime('before-wolf-feed');
    const now = nowMinutes();
    state.wolfHunger = clamp(state.wolfHunger - Math.max(0, Number(amount) || 0));
    state.wolfNoHungerUntil = now + MEAT_FISH_HOLD_MINUTES;
    state.lastMinutes = now;
    syncStorage();
    emit('wolf-feed');
    return state.wolfHunger;
  }

  function getState(doSync = true) {
    if (doSync) syncTime('read');
    const now = nowMinutes();
    return {
      maxHunger: MAX_HUNGER,
      playerHunger: Math.round(clamp(state.playerHunger)),
      wolfHunger: Math.round(clamp(state.wolfHunger)),
      hasWolf: hasWolf(),
      playerHungerRatePerHour: PLAYER_HUNGER_PER_HOUR,
      wolfHungerRatePerHour: WOLF_HUNGER_PER_HOUR,
      playerNoHungerUntil: state.playerNoHungerUntil,
      wolfNoHungerUntil: state.wolfNoHungerUntil,
      playerNoHungerMinutesLeft: Math.max(0, Math.ceil(state.playerNoHungerUntil - now)),
      wolfNoHungerMinutesLeft: Math.max(0, Math.ceil(state.wolfNoHungerUntil - now)),
      otherFoodHoldMinutes: OTHER_FOOD_HOLD_MINUTES,
      meatFishHoldMinutes: MEAT_FISH_HOLD_MINUTES
    };
  }

  function reset() {
    state = {
      playerHunger: 0,
      wolfHunger: 0,
      lastMinutes: nowMinutes(),
      playerNoHungerUntil: 0,
      wolfNoHungerUntil: 0
    };
    try { sessionStorage.removeItem(STATE_KEY); } catch (_) {}
    emit('reset');
  }

  window.DDNeeds = {
    stateKey: STATE_KEY,
    maxHunger: MAX_HUNGER,
    otherFoodHoldMinutes: OTHER_FOOD_HOLD_MINUTES,
    meatFishHoldMinutes: MEAT_FISH_HOLD_MINUTES,
    syncTime,
    getState,
    feedPlayer,
    feedWolf,
    holdMinutesForFood,
    reset
  };

  syncTime('load');
  window.addEventListener('ddtimechange', () => syncTime('time'));
  window.addEventListener('ddinventorychange', () => syncTime('inventory'));
})();