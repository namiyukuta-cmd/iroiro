(() => {
  'use strict';

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

  window.SHOP_WEATHER = Object.freeze({
    icon
  });
})();