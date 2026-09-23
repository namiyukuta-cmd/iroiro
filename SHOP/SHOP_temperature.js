(() => {
  'use strict';

  const DAILY_CURVE = Object.freeze([
    Object.freeze({minute:0, value:20}),
    Object.freeze({minute:180, value:18}),
    Object.freeze({minute:360, value:24}),
    Object.freeze({minute:540, value:30}),
    Object.freeze({minute:720, value:35}),
    Object.freeze({minute:900, value:37}),
    Object.freeze({minute:1080, value:31}),
    Object.freeze({minute:1260, value:25}),
    Object.freeze({minute:1440, value:20})
  ]);

  const WEATHER_OFFSET = Object.freeze({
    '晴れ': 0,
    '曇り': -3,
    '砂風': -2,
    '雨': -7
  });

  function normalize(value) {
    return Number.isFinite(Number(value)) ? Number(value) : 0;
  }

  function format(value) {
    return Math.round(normalize(value)) + '℃';
  }

  function interpolate(minutes) {
    const minute = Math.max(0, Math.min(1439, Math.floor(Number(minutes) || 0)));
    for (let i = 0; i < DAILY_CURVE.length - 1; i += 1) {
      const a = DAILY_CURVE[i];
      const b = DAILY_CURVE[i + 1];
      if (minute >= a.minute && minute <= b.minute) {
        const span = Math.max(1, b.minute - a.minute);
        const ratio = (minute - a.minute) / span;
        return a.value + (b.value - a.value) * ratio;
      }
    }
    return DAILY_CURVE[0].value;
  }

  function calculate(minutes, weather) {
    const base = interpolate(minutes);
    const offset = Object.prototype.hasOwnProperty.call(WEATHER_OFFSET, weather)
      ? WEATHER_OFFSET[weather]
      : 0;
    return Math.round(base + offset);
  }

  function update(state) {
    if (!state) return 0;
    state.temperature = calculate(state.minutes, state.weather);
    return state.temperature;
  }

  window.SHOP_TEMPERATURE = Object.freeze({
    dailyCurve: DAILY_CURVE,
    weatherOffset: WEATHER_OFFSET,
    normalize,
    format,
    calculate,
    update
  });
})();