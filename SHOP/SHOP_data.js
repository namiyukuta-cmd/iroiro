(() => {
  'use strict';

  window.SHOP_DATA = Object.freeze({
    title: 'お店屋さん',
    subtitle: '砂漠都市で暮らし、商いを始める',
    initialState: Object.freeze({
      version: 1,
      day: 1,
      minutes: 360,
      money: 0
    }),
    layout: Object.freeze({
      shelfSlots: 9
    }),
    labels: Object.freeze({
      newGame: '新しく始める',
      continueGame: '続きから',
      backToGames: 'ゲーム一覧へ戻る',
      floor: '店内',
      save: 'セーブ',
      load: 'ロード',
      back: '戻る',
      money: '所持金',
      daySuffix: '日目'
    }),
    links: Object.freeze({
      newGame: './SHOP_top.html?new=1',
      continueGame: './SHOP_top.html?continue=1',
      backToGames: '../index.html',
      backToShopMenu: './SHOP_index.html'
    })
  });
})();
