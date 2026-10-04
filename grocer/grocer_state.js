(() => {
  'use strict';

  const KEY = 'grocer-runtime-state-v1';

  const catalog = [
    { id: 'bread', name: 'パン', buy: 30, sell: 50 },
    { id: 'tomato', name: 'トマト', buy: 20, sell: 35 },
    { id: 'cheese', name: 'チーズ', buy: 40, sell: 65 }
  ];

  const makeDefault = () => ({
    day: 1,
    money: 500,
    daySales: 0,
    inventory: [
      { id: 'bread', count: 2 },
      { id: 'tomato', count: 2 },
      { id: 'cheese', count: 2 }
    ]
  });

  const clone = value => JSON.parse(JSON.stringify(value));

  const normalize = raw => {
    const base = makeDefault();
    if (!raw || typeof raw !== 'object') return base;

    const inventory = Array.isArray(raw.inventory)
      ? raw.inventory
          .filter(item => item && catalog.some(c => c.id === item.id))
          .map(item => ({ id: item.id, count: Math.max(0, Number(item.count) || 0) }))
      : base.inventory;

    return {
      day: Math.max(1, Number(raw.day) || 1),
      money: Math.max(0, Number(raw.money) || 0),
      daySales: Math.max(0, Number(raw.daySales) || 0),
      inventory
    };
  };

  const load = () => {
    try {
      const raw = sessionStorage.getItem(KEY);
      return raw ? normalize(JSON.parse(raw)) : makeDefault();
    } catch (_) {
      return makeDefault();
    }
  };

  const save = state => {
    const next = normalize(state);
    sessionStorage.setItem(KEY, JSON.stringify(next));
    return next;
  };

  const item = id => catalog.find(entry => entry.id === id) || null;

  const getCount = (state, id) => {
    const row = state.inventory.find(entry => entry.id === id);
    return row ? row.count : 0;
  };

  const add = (state, id, amount) => {
    const next = clone(state);
    let row = next.inventory.find(entry => entry.id === id);
    if (!row) {
      row = { id, count: 0 };
      next.inventory.push(row);
    }
    row.count = Math.max(0, row.count + amount);
    return next;
  };

  window.GrocerState = {
    catalog: clone(catalog),
    load,
    save,
    item,
    getCount,
    add,
    resetRuntime() {
      const state = makeDefault();
      sessionStorage.setItem(KEY, JSON.stringify(state));
      return clone(state);
    }
  };
})();
