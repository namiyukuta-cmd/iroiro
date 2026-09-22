(() => {
  'use strict';

  const data = window.SHOP_DATA;
  document.title = data.title;
  document.getElementById('gameTitle').textContent = data.title;
  document.getElementById('gameSubtitle').textContent = data.subtitle;

  const newGame = document.getElementById('newGameLink');
  newGame.textContent = data.labels.newGame;
  newGame.href = data.links.newGame;

  const continueGame = document.getElementById('continueGameLink');
  continueGame.textContent = data.labels.continueGame;
  continueGame.href = data.links.continueGame;

  const back = document.getElementById('backLink');
  back.textContent = data.labels.backToGames;
  back.href = data.links.backToGames;
})();
