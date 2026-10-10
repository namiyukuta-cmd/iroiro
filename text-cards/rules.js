(function (root) {
  'use strict';
  const DAYS = 7, RENT = 30, MAX_ENERGY = 10, MAX_FOOD = 9, MAX_COMFORT = 8;
  const CARDS = Object.freeze({
    shop: { title: '店番', kind: '仕事', money: 10, energy: -2 },
    clean: { title: '掃除', kind: '仕事', money: 8, energy: -1 },
    carry: { title: '荷運び', kind: '仕事', money: 14, energy: -4 },
    help: { title: '手伝い', kind: '仕事', money: 11, energy: -3 },
    cook: { title: '自炊', kind: '食料', money: -5, food: 4 },
    groceries: { title: '買い出し', kind: '食料', money: -6, food: 5 },
    simple: { title: '簡単な食事', kind: '食料', money: -3, food: 2 },
    rest: { title: '休息', kind: '休息', energy: 4 },
    tidy: { title: '部屋を整える', kind: '暮らし', energy: -2, comfort: 1 },
    chair: { title: '椅子', kind: '家具', money: -6, comfort: 1 },
    lamp: { title: '照明', kind: '家具', money: -8, comfort: 2 },
    prep: { title: '作り置き', kind: '暮らし', energy: -1, food: 2 },
    walk: { title: '散歩', kind: '休息', energy: 2 },
    sale: { title: '不用品を売る', kind: '暮らし', money: 5 },
    small: { title: '小さな依頼', kind: '仕事', money: 6, energy: -1 }
  });
  const WORK = ['shop', 'clean', 'carry', 'help'];
  const FOOD = ['cook', 'groceries', 'simple'];
  const EXTRA = ['tidy', 'chair', 'lamp', 'prep', 'walk', 'sale', 'small'];
  const clamp = (n, max) => Math.max(0, Math.min(max, n));
  function seedNumber(seed) {
    if (!Number.isInteger(seed) || seed < 1 || seed > 0xffffffff) throw new Error('不正なゲーム番号です。');
    return seed;
  }
  function create(seed) {
    return { seed: seedNumber(seed), day: 1, money: 12, energy: 7, food: 3, comfort: 0, history: [] };
  }
  function hand(state) {
    if (state.day > DAYS) return [];
    let n = (state.seed ^ Math.imul(state.day, 0x9e3779b9)) >>> 0;
    const pick = list => {
      n = (n + 0x6d2b79f5) >>> 0;
      let t = Math.imul(n ^ (n >>> 15), n | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return list[((t ^ (t >>> 14)) >>> 0) % list.length];
    };
    return [pick(WORK), pick(FOOD), 'rest', pick(EXTRA)];
  }
  function card(id, state) {
    const definition = CARDS[id];
    if (!definition) throw new Error('知らないカードです。');
    const effect = { money: 0, energy: 0, food: 0, comfort: 0 };
    for (const key of Object.keys(effect)) effect[key] = definition[key] || 0;
    if (id === 'rest') effect.energy += state.comfort;
    return { id, title: definition.title, kind: definition.kind, effect };
  }
  function blocked(state, id) {
    if (state.day > DAYS) return '今週は終了しています';
    if (!hand(state).includes(id)) return '今日の手札にありません';
    const effect = card(id, state).effect;
    if (state.money + effect.money < 0) return 'お金が' + (-effect.money) + '必要';
    if (state.energy + effect.energy < 0) return '体力が' + (-effect.energy) + '必要';
    return '';
  }
  function play(state, id) {
    const reason = blocked(state, id);
    if (reason) throw new Error(reason);
    const effect = card(id, state).effect;
    const next = {
      seed: state.seed, day: state.day + 1,
      money: state.money + effect.money,
      energy: clamp(state.energy + effect.energy, MAX_ENERGY),
      food: clamp(state.food + effect.food, MAX_FOOD),
      comfort: clamp(state.comfort + effect.comfort, MAX_COMFORT),
      history: [...state.history, id]
    };
    if (next.food > 0) next.food -= 1;
    else next.energy = clamp(next.energy - 2, MAX_ENERGY);
    return next;
  }
  function restore(raw) {
    if (!raw || typeof raw !== 'object' || !Array.isArray(raw.history) || raw.history.length > DAYS) throw new Error('セーブの形式が違います。');
    let rebuilt = create(raw.seed);
    for (const id of raw.history) {
      if (typeof id !== 'string' || !Object.hasOwn(CARDS, id)) throw new Error('セーブに不正なカードがあります。');
      rebuilt = play(rebuilt, id);
    }
    for (const key of ['day', 'money', 'energy', 'food', 'comfort']) {
      if (rebuilt[key] !== raw[key]) throw new Error('セーブの内容を確認できません。');
    }
    return rebuilt;
  }
  function lastMove(state) {
    if (!state.history.length) return null;
    let before = create(state.seed);
    for (const id of state.history.slice(0, -1)) before = play(before, id);
    const id = state.history[state.history.length - 1];
    const item = card(id, before);
    const delta = {};
    for (const key of ['money', 'energy', 'food', 'comfort']) delta[key] = state[key] - before[key];
    return { day: before.day, id, title: item.title, delta, hungry: before.food + item.effect.food <= 0 };
  }
  function result(state) {
    if (state.day <= DAYS) return null;
    return { won: state.money >= RENT, remaining: Math.max(0, state.money - RENT), shortage: Math.max(0, RENT - state.money), comfort: state.comfort };
  }
  const api = Object.freeze({ DAYS, RENT, MAX_ENERGY, MAX_FOOD, MAX_COMFORT, CARDS, create, hand, card, blocked, play, restore, lastMove, result });
  root.TextCardRules = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(globalThis);
