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
      far: 0,            // ①スクロール背景
      house: 20,         // ②背景としての家
      backgroundNpc: 40, // ③背景としてのNPC
      interactive: 60,   // ④選択可能：ショップ/NPC
      player: 100,       // ⑤主人公移動・配置
      town: 20,          // 既存シーン互換
      people: 40         // 既存シーン互換
    }),

    scenes: Object.freeze({
      outerPoor: Object.freeze({
        name: '小門外・底辺区',
        background: './asset/bg_desert_wall.jpeg',

        objects: Object.freeze([
          // ② 背景としての家配置層
          Object.freeze({src:'./asset/house_poor.png', left:-8, bottom:24, height:38, layer:'house'}),
          Object.freeze({src:'./asset/house_poor.png', left:76, bottom:24, height:38, layer:'house', flip:true}),
          Object.freeze({src:'./asset/house_poor.png', left:20, bottom:25, height:21, layer:'house', flip:true}),
          Object.freeze({src:'./asset/house_poor.png', left:59, bottom:25, height:21, layer:'house'}),

          // ③ 背景NPC。④より奥・小さく・左右へ離す。
          Object.freeze({src:'https://raw.githubusercontent.com/namiyukuta-cmd/iroiro/main/SHOP/asset/Npc/npc_oldman_01.png', left:13, bottom:10, height:18, layer:'backgroundNpc'}),
          Object.freeze({src:'https://raw.githubusercontent.com/namiyukuta-cmd/iroiro/main/SHOP/asset/Npc/npc_porter_01.png', left:84, bottom:10, height:18, layer:'backgroundNpc'}),

          // ④ 選択可能層。⑤へ食い込ませない。
          Object.freeze({src:'./asset/stall.png', left:48, bottom:3, height:26, layer:'interactive', selectable:true, selectableType:'shop'}),
          Object.freeze({src:'https://raw.githubusercontent.com/namiyukuta-cmd/iroiro/main/SHOP/asset/Npc/npc_beggar_01.png', left:28, bottom:2, height:24, layer:'interactive', selectable:true, selectableType:'npc'})
        ])
      }),
      smallGateOutside: Object.freeze({
        name: '小門前',
        background: './asset/bg_desert_wall.jpeg',
        objects: Object.freeze([
          Object.freeze({src:'./asset/house_poor.png', left:-5, bottom:8, height:19, layer:'town'}),
          Object.freeze({src:'./asset/gate_small.png', left:31, bottom:6, height:32, layer:'town'}),
          Object.freeze({src:'./asset/house_poor.png', left:76, bottom:8, height:18, layer:'town', flip:true}),
          Object.freeze({src:'https://raw.githubusercontent.com/namiyukuta-cmd/iroiro/main/SHOP/asset/Npc/npc_man_01.png', left:14, bottom:5, height:22, layer:'people'}),
          Object.freeze({src:'https://raw.githubusercontent.com/namiyukuta-cmd/iroiro/main/SHOP/asset/Npc/npc_guard_01.png', left:58, bottom:5, height:22, layer:'people'})
        ])
      }),
      cityCommon: Object.freeze({
        name: '市内・庶民街',
        background: './asset/bg_desert_wall.jpeg',
        objects: Object.freeze([
          Object.freeze({src:'./asset/house_normal.png', left:-3, bottom:8, height:23, layer:'town'}),
          Object.freeze({src:'./asset/stall.png', left:37, bottom:2, height:17, layer:'interactive'}),
          Object.freeze({src:'./asset/house_normal.png', left:67, bottom:8, height:22, layer:'town', flip:true}),
          Object.freeze({src:'https://raw.githubusercontent.com/namiyukuta-cmd/iroiro/main/SHOP/asset/Npc/npc_woman_01.png', left:17, bottom:5, height:21, layer:'people'}),
          Object.freeze({src:'https://raw.githubusercontent.com/namiyukuta-cmd/iroiro/main/SHOP/asset/Npc/npc_traveler_01.png', left:49, bottom:5, height:21, layer:'people'}),
          Object.freeze({src:'https://raw.githubusercontent.com/namiyukuta-cmd/iroiro/main/SHOP/asset/Npc/npc_child_01.png', left:77, bottom:5, height:14, layer:'people'})
        ])
      }),
      upperArea: Object.freeze({
        name: '上級区',
        background: './asset/bg_desert_wall.jpeg',
        objects: Object.freeze([
          Object.freeze({src:'./asset/house_upper.png', left:5, bottom:9, height:27, layer:'town'}),
          Object.freeze({src:'./asset/house_upper.png', left:53, bottom:9, height:26, layer:'town', flip:true}),
          Object.freeze({src:'https://raw.githubusercontent.com/namiyukuta-cmd/iroiro/main/SHOP/asset/Npc/npc_beggar_01.png', left:41, bottom:5, height:21, layer:'people'})
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
      newGame: './SHOP_top.html?new=1&build=20260923-0923r',
      continueGame: './SHOP_top.html?continue=1&build=20260923-0923r',
      backToGames: '../index.html',
      backToShopMenu: './SHOP_index.html'
    })
  });
})();
