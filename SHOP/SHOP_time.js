(() => {
  'use strict';

  const PRAYERS = Object.freeze([
    Object.freeze({id:'fajr', label:'ファジュル', minute:300}),
    Object.freeze({id:'dhuhr', label:'ズフル', minute:720}),
    Object.freeze({id:'asr', label:'アスル', minute:930}),
    Object.freeze({id:'maghrib', label:'マグリブ', minute:1080}),
    Object.freeze({id:'isha', label:'イシャー', minute:1170})
  ]);

  const PRAYER_NOTICE_MINUTES = 30;

  function format(totalMinutes) {
    const value = Math.max(0, Number(totalMinutes) || 0) % 1440;
    const hour = Math.floor(value / 60);
    const minute = value % 60;
    return String(hour).padStart(2, '0') + ':' + String(minute).padStart(2, '0');
  }

  function getPrayerStatus(totalMinutes) {
    const now = Math.max(0, Number(totalMinutes) || 0) % 1440;
    const active = PRAYERS.find(prayer =>
      now >= prayer.minute && now < prayer.minute + PRAYER_NOTICE_MINUTES
    );
    if (active) return '🕌 ' + active.label;

    const next = PRAYERS.find(prayer => prayer.minute > now) || PRAYERS[0];
    return '→' + format(next.minute);
  }

  function syncClimate(state) {
    if (!state) return state;

    state.day = Math.max(1, Math.floor(Number(state.day) || 1));
    state.minutes = Math.max(0, Math.floor(Number(state.minutes) || 0));

    if (state.minutes >= 1440) {
      state.day += Math.floor(state.minutes / 1440);
      state.minutes %= 1440;
    }

    if (window.SHOP_WEATHER) window.SHOP_WEATHER.update(state);
    if (window.SHOP_TEMPERATURE) window.SHOP_TEMPERATURE.update(state);
    return state;
  }

  function advance(state, minutes, reason='') {
    if (!state) return null;
    let remaining = Math.max(0, Math.floor(Number(minutes) || 0));
    if (!remaining) {
      syncClimate(state);
      return state;
    }

    syncClimate(state);

    while (remaining > 0) {
      const step = Math.min(10, remaining);

      state.minutes += step;
      if (state.minutes >= 1440) {
        state.day += Math.floor(state.minutes / 1440);
        state.minutes %= 1440;
      }

      if (window.SHOP_WEATHER) window.SHOP_WEATHER.update(state);
      if (window.SHOP_TEMPERATURE) window.SHOP_TEMPERATURE.update(state);
      if (window.SHOP_SURVIVAL) window.SHOP_SURVIVAL.applyElapsed(state, step);

      remaining -= step;
    }

    window.dispatchEvent(new CustomEvent('shoptimechange', {
      detail: {
        day: state.day,
        minutes: state.minutes,
        weather: state.weather,
        temperature: state.temperature,
        reason: String(reason || '')
      }
    }));

    return state;
  }

  window.SHOP_TIME = Object.freeze({
    prayers: PRAYERS,
    prayerNoticeMinutes: PRAYER_NOTICE_MINUTES,
    format,
    getPrayerStatus,
    syncClimate,
    advance
  });
})();