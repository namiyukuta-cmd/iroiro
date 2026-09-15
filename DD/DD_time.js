(() => {
  const STORAGE_KEY = 'dd_time_v1';
  const START_MINUTES = 7 * 60;

  const actionCosts = Object.freeze({
    travel: 30,
    forestTurn: 6,
    gather: 20,
    hunt: 120,
    returnHome: 30
  });

  function load() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
      if (saved && Number.isFinite(saved.totalMinutes) && saved.totalMinutes >= 0) {
        return { totalMinutes: Math.floor(saved.totalMinutes) };
      }
    } catch (_) {}
    return { totalMinutes: START_MINUTES };
  }

  let state = load();

  function save() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
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
    save();
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
    save();
    refresh();
    emit('reset', 0);
    return parts();
  }

  function getState() {
    return { ...parts(), phase: phase(), label: label() };
  }

  window.DDTime = {
    actionCosts,
    getState,
    format,
    label,
    phase,
    refresh,
    advance,
    advanceAction,
    reset
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', refresh, { once: true });
  } else {
    refresh();
  }
})();
