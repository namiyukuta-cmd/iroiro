(() => {
  'use strict';

  window.SHOP_DATA = Object.freeze({
    title: 'お店屋さん',
    subtitle: '砂漠都市で暮らし、商いを始める',

    initialState: Object.freeze({
      version: 2,
      day: 1,
      minutes: 360,
      temperature: 24,
      weather: '晴れ',
      scene: '小門外・底辺区',
      sceneKey: 'outerPoor',
      hp: 100,
      hunger: 25,
      thirst: 30,
      money: 0
    }),

    scenes: Object.freeze({
      outerPoor: Object.freeze({
        name: '小門外・底辺区',
        width: 1600,
        background: './asset/bg_desert_wall.jpeg',
        objects: Object.freeze([
          Object.freeze({src:'./asset/house_poor.png', left:35, height:78, layer:2}),
          Object.freeze({src:'./asset/house_poor.png', left:410, height:72, layer:2, flip:true}),
          Object.freeze({src:'./asset/stall.png', left:790, height:61, layer:4}),
          Object.freeze({src:'./asset/house_poor.png', left:1040, height:75, layer:2}),
          Object.freeze({src:'./asset/gate_small.png', left:1250, height:95, layer:5})
        ])
      }),
      cityCommon: Object.freeze({
        name: '市内・庶民街',
        width: 1600,
        background: './asset/bg_desert_wall.jpeg',
        objects: Object.freeze([
          Object.freeze({src:'./asset/house_normal.png', left:70, height:82, layer:2}),
          Object.freeze({src:'./asset/stall.png', left:520, height:62, layer:4}),
          Object.freeze({src:'./asset/house_normal.png', left:860, height:80, layer:2, flip:true}),
          Object.freeze({src:'./asset/gate_small.png', left:1240, height:94, layer:5})
        ])
      }),
      upperArea: Object.freeze({
        name: '上級区',
        width: 1600,
        background: './asset/bg_desert_wall.jpeg',
        objects: Object.freeze([
          Object.freeze({src:'./asset/house_upper.png', left:90, height:88, layer:2}),
          Object.freeze({src:'./asset/house_upper.png', left:640, height:84, layer:2, flip:true}),
          Object.freeze({src:'./asset/house_normal.png', left:1130, height:76, layer:2})
        ])
      })
    }),

    labels: Object.freeze({
      newGame: '新しく始める',
      continueGame: '続きから',
      backToGames: 'ゲーム一覧へ戻る',
      day: '日にち',
      time: '時間',
      temperature: '気温',
      weather: '天気',
      hp: 'HP',
      hunger: '飢え',
      thirst: '渇き',
      portrait: '主人公',
      townPlaceholder: '町の背景絵',
      map: '地図',
      inventory: '持ち物',
      action: '行動',
      save: 'セーブ',
      load: 'ロード'
    }),

    links: Object.freeze({
      newGame: './SHOP_top.html?new=1',
      continueGame: './SHOP_top.html?continue=1',
      backToGames: '../index.html',
      backToShopMenu: './SHOP_index.html'
    })
  });
})();
