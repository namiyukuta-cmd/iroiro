(() => {
  'use strict';

  window.SHOP_DATA = Object.freeze({
    title: 'お店屋さん',
    subtitle: '砂漠都市で暮らし、商いを始める',

    initialState: Object.freeze({
      version: 10,
      day: 1,
      minutes: 360,
      temperature: 24,
      weather: '晴れ',
      scene: '小門外・底辺区',
      sceneKey: 'outerPoor',
      hp: 100,
      hunger: 25,
      thirst: 30,
      money: 0,
      beggingHistory: Object.freeze({}),
      sellingHistory: Object.freeze({}),
      access: Object.freeze({
        upperArea: false
      }),
      inventory: Object.freeze({}),
      collectedPickups: Object.freeze([])
    }),

    layers: Object.freeze({
      far: 0,            // ①スクロール背景
      house: 20,         // ②背景としての家
      backgroundNpc: 40, // ③背景としてのNPC
      interactive: 60,   // ④選択可能：ショップ/NPC
      town: 20,          // 既存シーン互換
      people: 40         // 既存シーン互換
    }),

    scenes: Object.freeze({
      outerPoor: Object.freeze({
        name: '小門外・底辺区',
        facilityLinks: Object.freeze([
          Object.freeze({label:'井戸', sceneKey:'outerWell'})
        ]),
        begging: Object.freeze({
          stopChance: 0.24,
          enforcement: Object.freeze({
            startAfter: 20,
            startAfterMinutes: 120,
            checkChance: 0.04,
            warningsBeforeRemoval: 2,
            cooldownMinutes: 45,
            forcedScene: null,
            authority: '近くの商人'
          }),
          outcomes: Object.freeze([
            Object.freeze({weight:78, type:'none'}),
            Object.freeze({weight:17, type:'copper', minCopper:1, maxCopper:1}),
            Object.freeze({weight:4, type:'copper', minCopper:2, maxCopper:3}),
            Object.freeze({weight:1, type:'item', itemId:'food_flatbread', count:1})
          ])
        }),
        selling: Object.freeze({
          stopChance: 0.34,
          enforcement: Object.freeze({
            startAfter: 14,
            startAfterMinutes: 90,
            checkChance: 0.05,
            warningsBeforeRemoval: 2,
            cooldownMinutes: 45,
            forcedScene: null,
            authority: '近くの店主',
            reason: '通りを長く占めて商いを続けている'
          })
        }),
        background: './asset/bg_desert_wall.jpeg',
        pickups: Object.freeze([
          Object.freeze({id:'outer_rag_01', itemId:'rag', left:66, bottom:18}),
          Object.freeze({id:'outer_bottle_01', itemId:'bottle', left:10, bottom:16})
        ]),

        objects: Object.freeze([
          // ② 背景としての家配置層
          Object.freeze({src:'./asset/house_poor.png', left:-8, bottom:34, height:38, layer:'house'}),
          Object.freeze({src:'./asset/house_poor.png', left:76, bottom:34, height:38, layer:'house', flip:true}),
          Object.freeze({src:'./asset/house_poor.png', left:20, bottom:35, height:21, layer:'house', flip:true}),
          Object.freeze({src:'./asset/house_poor.png', left:59, bottom:35, height:21, layer:'house'}),

          // ③ 背景NPC。④より奥・小さく・左右へ離す。
          Object.freeze({src:'https://raw.githubusercontent.com/namiyukuta-cmd/iroiro/main/SHOP/asset/Npc/npc_oldman_01.png', left:15, bottom:30, height:15, layer:'backgroundNpc'}),
          Object.freeze({src:'https://raw.githubusercontent.com/namiyukuta-cmd/iroiro/main/SHOP/asset/Npc/npc_porter_01.png', left:83, bottom:30, height:15, layer:'backgroundNpc'}),

          // ④ 選択可能層。⑤へ食い込ませない。
          Object.freeze({src:'./asset/stall.png', left:49, bottom:26, height:25, layer:'interactive', selectable:true, selectableType:'shop'}),
          Object.freeze({src:'https://raw.githubusercontent.com/namiyukuta-cmd/iroiro/main/SHOP/asset/Npc/npc_beggar_01.png', left:28, bottom:26, height:21, layer:'interactive', selectable:true, selectableType:'npc'})
        ])
      }),
      smallGateOutside: Object.freeze({
        name: '小門前',
        facilityLinks: Object.freeze([
          Object.freeze({label:'公衆浴場', sceneKey:'smallGateBathhouse'})
        ]),
        begging: Object.freeze({
          stopChance: 0.28,
          enforcement: Object.freeze({
            startAfter: 8,
            startAfterMinutes: 45,
            checkChance: 0.11,
            warningsBeforeRemoval: 2,
            cooldownMinutes: 60,
            forcedScene: 'outerPoor',
            authority: '門番'
          }),
          outcomes: Object.freeze([
            Object.freeze({weight:72, type:'none'}),
            Object.freeze({weight:22, type:'copper', minCopper:1, maxCopper:2}),
            Object.freeze({weight:5, type:'copper', minCopper:3, maxCopper:3}),
            Object.freeze({weight:1, type:'item', itemId:'food_flatbread', count:1})
          ])
        }),
        selling: Object.freeze({
          stopChance: 0.30,
          enforcement: Object.freeze({
            startAfter: 8,
            startAfterMinutes: 45,
            checkChance: 0.10,
            warningsBeforeRemoval: 2,
            cooldownMinutes: 60,
            forcedScene: 'outerPoor',
            authority: '門番',
            reason: '門前で通行の邪魔になる'
          })
        }),
        background: './asset/bg_desert_wall.jpeg',
        pickups: Object.freeze([
          Object.freeze({id:'gate_wood_01', itemId:'wood', left:24, bottom:17})
        ]),
        objects: Object.freeze([
          Object.freeze({src:'./asset/house_poor.png', left:-7, bottom:34, height:34, layer:'house'}),
          Object.freeze({src:'./asset/gate_small.png', left:34, bottom:30, height:32, layer:'house'}),
          Object.freeze({src:'./asset/house_poor.png', left:76, bottom:34, height:34, layer:'house', flip:true}),
          Object.freeze({src:'https://raw.githubusercontent.com/namiyukuta-cmd/iroiro/main/SHOP/asset/Npc/npc_man_01.png', left:16, bottom:20, height:18, layer:'backgroundNpc'}),
          Object.freeze({src:'https://raw.githubusercontent.com/namiyukuta-cmd/iroiro/main/SHOP/asset/Npc/npc_guard_01.png', left:69, bottom:13, height:25, layer:'interactive', selectable:true, selectableType:'npc'})
        ])
      }),

      cityCommon: Object.freeze({
        name: '市内・庶民街',
        facilityLinks: Object.freeze([
          Object.freeze({label:'井戸', sceneKey:'cityWell'}),
          Object.freeze({label:'小モスク', sceneKey:'cityMosque'})
        ]),
        begging: Object.freeze({
          stopChance: 0.34,
          enforcement: Object.freeze({
            startAfter: 10,
            startAfterMinutes: 60,
            checkChance: 0.09,
            warningsBeforeRemoval: 2,
            cooldownMinutes: 60,
            forcedScene: 'smallGateOutside',
            authority: '市場の見回り'
          }),
          outcomes: Object.freeze([
            Object.freeze({weight:65, type:'none'}),
            Object.freeze({weight:25, type:'copper', minCopper:1, maxCopper:2}),
            Object.freeze({weight:7, type:'copper', minCopper:3, maxCopper:4}),
            Object.freeze({weight:2, type:'copper', minCopper:5, maxCopper:5}),
            Object.freeze({weight:1, type:'item', itemId:'food_flatbread', count:1})
          ])
        }),
        selling: Object.freeze({
          stopChance: 0.40,
          enforcement: Object.freeze({
            startAfter: 10,
            startAfterMinutes: 60,
            checkChance: 0.12,
            warningsBeforeRemoval: 2,
            cooldownMinutes: 60,
            forcedScene: 'smallGateOutside',
            authority: '市場の見回り',
            reason: '市場の場所を取って商いを続けている'
          })
        }),
        background: './asset/bg_desert_wall.jpeg',
        pickups: Object.freeze([
          Object.freeze({id:'city_bottle_01', itemId:'bottle', left:69, bottom:17}),
          Object.freeze({id:'city_rag_01', itemId:'rag', left:8, bottom:15})
        ]),
        objects: Object.freeze([
          Object.freeze({src:'./asset/house_normal.png', left:-5, bottom:33, height:37, layer:'house'}),
          Object.freeze({src:'./asset/house_normal.png', left:74, bottom:33, height:37, layer:'house', flip:true}),
          Object.freeze({src:'./asset/house_normal.png', left:25, bottom:34, height:20, layer:'house', flip:true}),
          Object.freeze({src:'./asset/house_normal.png', left:56, bottom:34, height:20, layer:'house'}),
          Object.freeze({src:'https://raw.githubusercontent.com/namiyukuta-cmd/iroiro/main/SHOP/asset/Npc/npc_woman_01.png', left:16, bottom:20, height:18, layer:'backgroundNpc'}),
          Object.freeze({src:'https://raw.githubusercontent.com/namiyukuta-cmd/iroiro/main/SHOP/asset/Npc/npc_child_01.png', left:83, bottom:20, height:13, layer:'backgroundNpc'}),
          Object.freeze({src:'./asset/stall.png', left:47, bottom:13, height:24, layer:'interactive', selectable:true, selectableType:'shop'}),
          Object.freeze({src:'https://raw.githubusercontent.com/namiyukuta-cmd/iroiro/main/SHOP/asset/Npc/npc_traveler_01.png', left:29, bottom:12, height:23, layer:'interactive', selectable:true, selectableType:'npc'})
        ])
      }),

      outerWell: Object.freeze({
        name: '小門外・井戸',
        returnTo: 'outerPoor',
        background: './asset/bg_desert_wall.jpeg',
        pickups: Object.freeze([]),
        objects: Object.freeze([
          Object.freeze({
            src:'./asset/desert_well_01.png',
            left:50, bottom:12, height:60,
            layer:'interactive', centered:true,
            selectable:true, selectableType:'well'
          })
        ])
      }),

      smallGateBathhouse: Object.freeze({
        name: '小門前・公衆浴場',
        returnTo: 'smallGateOutside',
        background: './asset/bg_desert_wall.jpeg',
        pickups: Object.freeze([]),
        objects: Object.freeze([
          Object.freeze({
            src:'./asset/desert_bathhouse_01.png',
            left:50, bottom:8, height:72,
            layer:'house', centered:true
          })
        ])
      }),

      cityWell: Object.freeze({
        name: '庶民街・井戸',
        returnTo: 'cityCommon',
        background: './asset/bg_desert_wall.jpeg',
        pickups: Object.freeze([]),
        objects: Object.freeze([
          Object.freeze({
            src:'./asset/desert_well_01.png',
            left:50, bottom:12, height:60,
            layer:'interactive', centered:true,
            selectable:true, selectableType:'well'
          })
        ])
      }),

      cityMosque: Object.freeze({
        name: '庶民街・小モスク',
        returnTo: 'cityCommon',
        background: './asset/bg_desert_wall.jpeg',
        pickups: Object.freeze([]),
        objects: Object.freeze([
          Object.freeze({
            src:'./asset/desert_small_mosque01.png',
            left:50, bottom:8, height:70,
            layer:'house', centered:true
          })
        ])
      }),

      upperArea: Object.freeze({
        name: '上級区',
        begging: Object.freeze({
          stopChance: 0.16,
          enforcement: Object.freeze({
            startAfter: 3,
            startAfterMinutes: 20,
            checkChance: 0.22,
            warningsBeforeRemoval: 1,
            cooldownMinutes: 120,
            forcedScene: 'cityCommon',
            authority: '衛兵'
          }),
          outcomes: Object.freeze([
            Object.freeze({weight:70, type:'none'}),
            Object.freeze({weight:15, type:'copper', minCopper:2, maxCopper:3}),
            Object.freeze({weight:8, type:'copper', minCopper:4, maxCopper:5}),
            Object.freeze({weight:4, type:'copper', minCopper:10, maxCopper:10}),
            Object.freeze({weight:3, type:'item', itemId:'food_flatbread', count:1})
          ])
        }),
        selling: Object.freeze({
          stopChance: 0.18,
          enforcement: Object.freeze({
            startAfter: 4,
            startAfterMinutes: 30,
            checkChance: 0.18,
            warningsBeforeRemoval: 1,
            cooldownMinutes: 90,
            forcedScene: 'cityCommon',
            authority: '衛兵',
            reason: '路上で商いを続けて目立っている'
          })
        }),
        background: './asset/bg_desert_wall.jpeg',
        pickups: Object.freeze([
          Object.freeze({id:'upper_scrap_01', itemId:'scrap', left:58, bottom:16})
        ]),
        objects: Object.freeze([
          Object.freeze({src:'./asset/house_upper.png', left:-4, bottom:32, height:40, layer:'house'}),
          Object.freeze({src:'./asset/house_upper.png', left:70, bottom:32, height:40, layer:'house', flip:true}),
          Object.freeze({src:'./asset/house_upper.png', left:33, bottom:34, height:22, layer:'house'}),
          Object.freeze({src:'https://raw.githubusercontent.com/namiyukuta-cmd/iroiro/main/SHOP/asset/Npc/npc_woman_01.png', left:17, bottom:20, height:18, layer:'backgroundNpc'}),
          Object.freeze({src:'https://raw.githubusercontent.com/namiyukuta-cmd/iroiro/main/SHOP/asset/Npc/npc_guard_01.png', left:82, bottom:20, height:19, layer:'backgroundNpc'}),
          Object.freeze({src:'https://raw.githubusercontent.com/namiyukuta-cmd/iroiro/main/SHOP/asset/Npc/npc_beggar_01.png', left:36, bottom:12, height:23, layer:'interactive', selectable:true, selectableType:'npc'})
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
      newGame: './SHOP_top.html?new=1&build=20260924-social-rules-v1',
      continueGame: './SHOP_top.html?continue=1&build=20260924-social-rules-v1',
      backToGames: '../index.html',
      backToShopMenu: './SHOP_index.html'
    })
  });
})();
