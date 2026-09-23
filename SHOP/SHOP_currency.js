(() => {
  'use strict';

  const COPPER_PER_SILVER = 10;
  const SILVER_PER_GOLD = 10;
  const COPPER_PER_GOLD = COPPER_PER_SILVER * SILVER_PER_GOLD;

  function normalizeCopper(value) {
    return Math.max(0, Math.floor(Number(value) || 0));
  }

  function split(totalCopper) {
    let rest = normalizeCopper(totalCopper);
    const gold = Math.floor(rest / COPPER_PER_GOLD);
    rest %= COPPER_PER_GOLD;
    const silver = Math.floor(rest / COPPER_PER_SILVER);
    const copper = rest % COPPER_PER_SILVER;
    return { gold, silver, copper };
  }

  function format(totalCopper) {
    const coins = split(totalCopper);
    return '金 ' + coins.gold + '　銀 ' + coins.silver + '　銅 ' + coins.copper;
  }

  function add(state, copperAmount) {
    if (!state) return 0;
    state.money = normalizeCopper(state.money) + normalizeCopper(copperAmount);
    return state.money;
  }

  function formatAmount(copperAmount) {
    const coins = split(copperAmount);
    const parts = [];
    if (coins.gold) parts.push('金 ' + coins.gold);
    if (coins.silver) parts.push('銀 ' + coins.silver);
    if (coins.copper || !parts.length) parts.push('銅 ' + coins.copper);
    return parts.join(' ');
  }

  window.SHOP_CURRENCY = Object.freeze({
    copperPerSilver: COPPER_PER_SILVER,
    silverPerGold: SILVER_PER_GOLD,
    copperPerGold: COPPER_PER_GOLD,
    normalizeCopper,
    split,
    format,
    add,
    formatAmount
  });
})();