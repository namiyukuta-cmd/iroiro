(() => {
  const SESSION_KEY = 'dd_session_time_v1';
  const LEGACY_LOCAL_KEYS = ['dd_time_v1', 'dd_map_position_v1'];
  const START_MINUTES = 7 * 60;

  const actionCosts = Object.freeze({
    travel: 30,
    forestTurn: 6,
    gather: 20,
    hunt: 120,
    returnHome: 30
  });

  function clearLegacyPersistence() {
    try {
      LEGACY_LOCAL_KEYS.forEach(key => localStorage.removeItem(key));
    } catch (_) {}
  }

  function installNoCacheGuards() {
    const directives = [
      ['Cache-Control', 'no-cache, no-store, must-revalidate'],
      ['Pragma', 'no-cache'],
      ['Expires', '0']
    ];

    directives.forEach(([name, content]) => {
      if (document.head.querySelector(`meta[http-equiv="${name}"]`)) return;
      const meta = document.createElement('meta');
      meta.httpEquiv = name;
      meta.content = content;
      document.head.appendChild(meta);
    });

    window.addEventListener('pageshow', event => {
      if (event.persisted) location.reload();
    });
  }

  function load() {
    try {
      const saved = JSON.parse(sessionStorage.getItem(SESSION_KEY) || 'null');
      if (saved && Number.isFinite(saved.totalMinutes) && saved.totalMinutes >= 0) {
        return { totalMinutes: Math.floor(saved.totalMinutes) };
      }
    } catch (_) {}
    return { totalMinutes: START_MINUTES };
  }

  let state = load();

  function syncSession() {
    try {
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(state));
    } catch (_) {}
  }

  function parts() {
    const total = Math.max(0, Math.floor(state.totalMinutes));
    const day = Math.floor(total / 1440) + 1;
    const minuteOfDay = total % 1440;
    const hour = Math.floor(minuteOfDay / 60);
    const minute = minuteOfDay % 60;
    return { day, hour, minute, minuteOfDay, totalMinutes: total };
  }

  function phase() {
    const { hour } = parts();
    if (hour >= 5 && hour < 10) return '朝';
    if (hour >= 10 && hour < 16) return '昼';
    if (hour >= 16 && hour < 19) return '夕方';
    if (hour >= 19) return '夜';
    return '深夜';
  }

  function format() {
    const { day, hour, minute } = parts();
    return `${day}日目 ${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
  }

  function label() {
    return `${format()}　${phase()}`;
  }

  function refresh() {
    document.querySelectorAll('[data-dd-clock]').forEach(el => {
      el.textContent = label();
    });
    document.documentElement.dataset.ddPhase = phase();
  }

  function emit(reason, minutes) {
    window.dispatchEvent(new CustomEvent('ddtimechange', {
      detail: { ...parts(), phase: phase(), reason: reason || '', minutes: minutes || 0 }
    }));
  }

  function advance(minutes, reason = '') {
    const value = Math.max(0, Math.floor(Number(minutes) || 0));
    if (!value) return parts();
    state.totalMinutes += value;
    syncSession();
    refresh();
    emit(reason, value);
    return parts();
  }

  function advanceAction(actionName) {
    const minutes = actionCosts[actionName];
    if (!Number.isFinite(minutes)) return parts();
    return advance(minutes, actionName);
  }

  function reset() {
    state = { totalMinutes: START_MINUTES };
    syncSession();
    refresh();
    emit('reset', 0);
    return parts();
  }

  function resetAllSessionState() {
    try {
      sessionStorage.removeItem('dd_session_map_position_v1');
      sessionStorage.removeItem('dd_session_map_location_v2');
      sessionStorage.removeItem('dd_session_inventory_v1');
      sessionStorage.removeItem('dd_session_events_v1');
      sessionStorage.removeItem('dd_session_wolf_v1');
      sessionStorage.removeItem(SESSION_KEY);
    } catch (_) {}
    clearLegacyPersistence();
    return reset();
  }

  function getState() {
    return { ...parts(), phase: phase(), label: label() };
  }

  clearLegacyPersistence();
  installNoCacheGuards();

  window.DDTime = {
    actionCosts,
    getState,
    format,
    label,
    phase,
    refresh,
    advance,
    advanceAction,
    reset,
    resetAllSessionState
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', refresh, { once: true });
  } else {
    refresh();
  }
})();