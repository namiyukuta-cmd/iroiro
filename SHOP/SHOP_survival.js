(() => {
  'use strict';

  function clamp100(value) {
    return Math.max(0, Math.min(100, Number(value) || 0));
  }

  function applyElapsed(state, minutes) {
    if (!state) return state;
    const elapsed = Math.max(0, Number(minutes) || 0);
    if (!elapsed) return state;

    const hours = elapsed / 60;
    const temperature = Number(state.temperature) || 0;
    const weather = String(state.weather || '');

    const hungerRate = 2;
    let thirstRate = 3;
    if (temperature >= 30) thirstRate += 1;
    if (temperature >= 35) thirstRate += 1;
    if (weather.includes('砂')) thirstRate += 0.5;

    state.hunger = clamp100((Number(state.hunger) || 0) + hungerRate * hours);
    state.thirst = clamp100((Number(state.thirst) || 0) + thirstRate * hours);

    let hpLossPerHour = 0;
    if (state.hunger >= 100) hpLossPerHour += 4;
    else if (state.hunger >= 90) hpLossPerHour += 1;

    if (state.thirst >= 100) hpLossPerHour += 8;
    else if (state.thirst >= 90) hpLossPerHour += 2;

    if (hpLossPerHour > 0) {
      state.hp = clamp100((Number(state.hp) || 0) - hpLossPerHour * hours);
    } else {
      state.hp = clamp100(state.hp);
    }

    return state;
  }

  window.SHOP_SURVIVAL = Object.freeze({
    clamp100,
    applyElapsed
  });
})();