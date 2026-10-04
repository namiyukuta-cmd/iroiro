(() => {
  'use strict';
  const go = (mode) => {
    location.href = './grocer_top.html?' + mode + '=1&_nc=' + Date.now();
  };
  document.getElementById('newGameLink').addEventListener('click', (e) => {
    e.preventDefault();
    go('new');
  });
  document.getElementById('continueGameLink').addEventListener('click', (e) => {
    e.preventDefault();
    go('continue');
  });
})();
