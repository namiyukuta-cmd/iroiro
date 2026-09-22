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

    layers: Object.freeze({
      far: 0,
      town: 20,
      people: 40,
      interactive: 60,
      player: 100
    }),

    scenes: Object.freeze({
      outerPoor: Object.freeze({
        name: '小門外・底辺区',
        background: './asset/bg_desert_wall.jpeg',
        objects: Object.freeze([
          Object.freeze({src:'./asset/house_poor.png', left:-2, bottom:5.5, height:30, layer:'town'}),
          Object.freeze({src:'./asset/house_poor.png', left:26, bottom:5.2, height:28, layer:'town', flip:true}),
          Object.freeze({src:'./asset/house_poor.png', left:55, bottom:5.5, height:31, layer:'town'}),
          Object.freeze({src:'./asset/house_poor.png', left:80, bottom:5.2, height:27, layer:'town', flip:true}),
          Object.freeze({src:'https://raw.githubusercontent.com/namiyukuta-cmd/iroiro/main/SHOP/asset/Npc/npc_oldman_01.png', left:12, bottom:5, height:22, layer:'people'}),
          Object.freeze({src:'https://raw.githubusercontent.com/namiyukuta-cmd/iroiro/main/SHOP/asset/Npc/npc_porter_01.png', left:76, bottom:5, height:22, layer:'people'})
        ])
      }),
      smallGateOutside: Object.freeze({
        name: '小門前',
        background: './asset/bg_desert_wall.jpeg',
        objects: Object.freeze([
          Object.freeze({src:'./asset/house_poor.png', left:-7, bottom:5.5, height:27, layer:'town'}),
          Object.freeze({src:'./asset/gate_small.png', left:30, bottom:4.8, height:39, layer:'town'}),
          Object.freeze({src:'./asset/house_poor.png', left:73, bottom:5.5, height:26, layer:'town', flip:true}),
          Object.freeze({src:'https://raw.githubusercontent.com/namiyukuta-cmd/iroiro/main/SHOP/asset/Npc/npc_man_01.png', left:12, bottom:5, height:22, layer:'people'}),
          Object.freeze({src:'https://raw.githubusercontent.com/namiyukuta-cmd/iroiro/main/SHOP/asset/Npc/npc_guard_01.png', left:76, bottom:5, height:22, layer:'people'})
        ])
      }),
      cityCommon: Object.freeze({
        name: '市内・庶民街',
        background: './asset/bg_desert_wall.jpeg',
        objects: Object.freeze([
          Object.freeze({src:'./asset/house_normal.png', left:-5, bottom:5.5, height:31, layer:'town'}),
          Object.freeze({src:'./asset/stall.png', left:36, bottom:3.8, height:22, layer:'interactive'}),
          Object.freeze({src:'./asset/house_normal.png', left:64, bottom:5.5, height:30, layer:'town', flip:true}),
          Object.freeze({src:'https://raw.githubusercontent.com/namiyukuta-cmd/iroiro/main/SHOP/asset/Npc/npc_woman_01.png', left:8, bottom:5, height:21, layer:'people'}),
          Object.freeze({src:'https://raw.githubusercontent.com/namiyukuta-cmd/iroiro/main/SHOP/asset/Npc/npc_traveler_01.png', left:73, bottom:5, height:21, layer:'people'}),
          Object.freeze({src:'https://raw.githubusercontent.com/namiyukuta-cmd/iroiro/main/SHOP/asset/Npc/npc_child_01.png', left:88, bottom:5, height:14, layer:'people'})
        ])
      }),
      upperArea: Object.freeze({
        name: '上級区',
        background: './asset/bg_desert_wall.jpeg',
        objects: Object.freeze([
          Object.freeze({src:'./asset/house_upper.png', left:3, bottom:5.8, height:35, layer:'town'}),
          Object.freeze({src:'./asset/house_upper.png', left:51, bottom:5.8, height:34, layer:'town', flip:true}),
          Object.freeze({src:'https://raw.githubusercontent.com/namiyukuta-cmd/iroiro/main/SHOP/asset/Npc/npc_beggar_01.png', left:74, bottom:5, height:21, layer:'people'})
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
