(() => {
  'use strict';

  const CONDITIONS = Object.freeze([
    Object.freeze({name:'晴れ', weight:72}),
    Object.freeze({name:'曇り', weight:16}),
    Object.freeze({name:'砂風', weight:9}),
    Object.freeze({name:'雨', weight:3})
  ]);

  function icon(weather) {
    const value = String(weather || '');
    if (value.includes('晴')) return '☀️';
    if (value.includes('曇')) return '☁️';
    if (value.includes('雨')) return '🌧️';
    if (value.includes('雷')) return '⛈️';
    if (value.includes('雪')) return '❄️';
    if (value.includes('砂')) return '🌪️';
    return value || '—';
  }

  function dayRoll(day) {
    const n = Math.max(1, Math.floor(Number(day) || 1));
    return ((n * 9301 + 49297) % 233280) / 233280;
  }

  function forDay(day) {
    const roll = dayRoll(day) * 100;
    let cursor = 0;
    for (const condition of CONDITIONS) {
      cursor += condition.weight;
      if (roll < cursor) return condition.name;
    }
    return CONDITIONS[0].name;
  }

  function update(state) {
    if (!state) return '';
    state.weather = forDay(state.day);
    return state.weather;
  }

  window.SHOP_WEATHER = Object.freeze({
    conditions: CONDITIONS,
    icon,
    forDay,
    update
  });
})();