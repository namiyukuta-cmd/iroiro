(() => {
  'use strict';

  function normalize(value) {
    return Number.isFinite(Number(value)) ? Number(value) : 0;
  }

  function format(value) {
    return normalize(value) + '℃';
  }

  window.SHOP_TEMPERATURE = Object.freeze({
    normalize,
    format
  });
})();