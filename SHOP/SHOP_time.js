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

  const REALTIME_TICK_MS = 2000;
  const REALTIME_GAME_MINUTES = 1;
  const REALTIME_SPEEDS = Object.freeze([1,2,4]);
  let realtimeTimer = null;
  let realtimeMultiplier = 1;

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

  function setRealtimeMultiplier(value) {
    const next = Number(value);
    realtimeMultiplier = REALTIME_SPEEDS.includes(next) ? next : 1;
    return realtimeMultiplier;
  }

  function getRealtimeMultiplier() {
    return realtimeMultiplier;
  }

  function stopRealtime() {
    if (realtimeTimer) {
      clearInterval(realtimeTimer);
      realtimeTimer = null;
    }
  }

  function startRealtime(getState, onTick) {
    stopRealtime();

    realtimeTimer = setInterval(() => {
      if (document.visibilityState !== 'visible') return;

      const state = typeof getState === 'function' ? getState() : getState;
      if (!state) return;

      advance(
        state,
        REALTIME_GAME_MINUTES * realtimeMultiplier,
        'realtime'
      );

      if (typeof onTick === 'function') onTick(state);
    }, REALTIME_TICK_MS);

    return realtimeTimer;
  }

  window.SHOP_TIME = Object.freeze({
    prayers: PRAYERS,
    prayerNoticeMinutes: PRAYER_NOTICE_MINUTES,
    realtimeTickMs: REALTIME_TICK_MS,
    realtimeGameMinutes: REALTIME_GAME_MINUTES,
    realtimeSpeeds: REALTIME_SPEEDS,
    format,
    getPrayerStatus,
    syncClimate,
    advance,
    setRealtimeMultiplier,
    getRealtimeMultiplier,
    startRealtime,
    stopRealtime
  });
})();