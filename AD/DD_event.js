(() => {
  const HISTORY_KEY = 'dd_session_events_v1';
  const MEAT_IDS = ['meat_bird', 'meat_rabbit', 'meat_deer'];

  function loadHistory() {
    try {
      const parsed = JSON.parse(sessionStorage.getItem(HISTORY_KEY) || '[]');
      return Array.isArray(parsed) ? new Set(parsed.filter(Boolean)) : new Set();
    } catch (_) {
      return new Set();
    }
  }

  let history = loadHistory();

  function syncHistory() {
    try {
      sessionStorage.setItem(HISTORY_KEY, JSON.stringify([...history]));
    } catch (_) {}
  }

  function hasAnyMeat() {
    if (!window.DDItems || typeof DDItems.count !== 'function') return false;
    return MEAT_IDS.some(id => DDItems.count(id) > 0);
  }

  const events = [
    {
      id: 'return_with_meat_01',
      once: true,
      title: '帰り道',
      text: [
        '小屋へ戻る途中、草むらの奥から頼りない鳴き声がする。',
        '',
        '「みゅう、みゅう」',
        '',
        '覗いてみると、狼……らしい小さな子が一匹でうずくまっていた。',
        '周囲を見ても、親や群れの姿はない。',
        '',
        'そのまま置いていかず、小屋へ連れ帰ることにした。',
        '',
        '狼の子（？）を手に入れた。'
      ].join('\n'),
      when(context) {
        return context?.type === 'beforeTravel' &&
          context?.to === 'cabin' &&
          context?.from && context.from !== 'cabin' &&
          hasAnyMeat();
      },
      resolve() {
        if (window.DDWolf && typeof DDWolf.adopt === 'function') {
          DDWolf.adopt();
          return;
        }
        if (!window.DDItems || typeof DDItems.add !== 'function') return;
        if (DDItems.count('wolf_pup') <= 0) DDItems.add('wolf_pup', 1);
      }
    }
  ];

  function hasSeen(id) {
    return history.has(id);
  }

  function markSeen(id) {
    if (!id) return;
    history.add(id);
    syncHistory();
  }

  function find(context) {
    return events.find(event => {
      if (event.once && hasSeen(event.id)) return false;
      try {
        return event.when(context);
      } catch (_) {
        return false;
      }
    }) || null;
  }

  function closeOverlay(overlay) {
    if (overlay?.parentNode) overlay.parentNode.removeChild(overlay);
  }

  function run(event, options = {}) {
    if (!event) {
      if (typeof options.onComplete === 'function') options.onComplete();
      return;
    }

    const overlay = document.createElement('div');
    overlay.style.cssText = [
      'position:fixed',
      'inset:0',
      'z-index:9999',
      'display:grid',
      'place-items:center',
      'padding:24px',
      'background:rgba(8,10,8,.78)'
    ].join(';');

    const panel = document.createElement('section');
    panel.style.cssText = [
      'width:min(100%,420px)',
      'border:2px solid #e9e5d9',
      'border-radius:12px',
      'background:#1d211b',
      'color:#f5f2e9',
      'padding:22px',
      'box-shadow:0 12px 40px rgba(0,0,0,.48)'
    ].join(';');

    const title = document.createElement('div');
    title.textContent = event.title || 'イベント';
    title.style.cssText = 'font-size:22px;font-weight:900;margin-bottom:18px';

    const text = document.createElement('div');
    text.textContent = event.text || '';
    text.style.cssText = 'min-height:92px;font-size:17px;font-weight:700;line-height:1.7;white-space:pre-wrap';

    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = '連れて帰る';
    button.style.cssText = [
      'width:100%',
      'min-height:50px',
      'margin-top:18px',
      'border:0',
      'border-radius:9px',
      'background:#f2eee3',
      'color:#1b1b18',
      'font:inherit',
      'font-size:16px',
      'font-weight:900'
    ].join(';');

    button.addEventListener('click', () => {
      if (typeof event.resolve === 'function') {
        try { event.resolve(); } catch (_) {}
      }
      if (event.once) markSeen(event.id);
      closeOverlay(overlay);
      if (typeof options.onComplete === 'function') options.onComplete();
    }, { once: true });

    panel.append(title, text, button);
    overlay.appendChild(panel);
    document.body.appendChild(overlay);
  }

  function resetHistory() {
    history = new Set();
    try { sessionStorage.removeItem(HISTORY_KEY); } catch (_) {}
  }

  window.DDEvents = {
    historyKey: HISTORY_KEY,
    events,
    find,
    run,
    hasSeen,
    markSeen,
    resetHistory,
    hasAnyMeat
  };
})();