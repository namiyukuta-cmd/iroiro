(() => {
  "use strict";
  window.HMW = window.HMW || {};
  HMW.DATA = HMW.DATA || {};

  HMW.DATA.items = {
    bread: { name: "パン", hunger: -14, price: 120 },
    rice_ball: { name: "おにぎり", hunger: -18, price: 170 },
    food_pack: { name: "支援食", hunger: -24, price: 0 },
    leftover_food: { name: "廃棄予定の食べ物", hunger: -20, price: 0 },
    bottled_water: { name: "水", hunger: -2, price: 100 },
    toothbrush: { name: "歯ブラシ", price: 150 },
    toothpaste: { name: "歯磨き粉", price: 220 },
    hair_tie: { name: "髪ゴム", price: 100 },
    hair_brush: { name: "ヘアブラシ", price: 300 },
    disposable_razor: { name: "簡易カミソリ", price: 250 },
    scissors: { name: "ハサミ", price: 500 },
    sanitary_products: { name: "生理用品（1日分）", price: 90, periodCare: true },
    soap: { name: "石けん", hygiene: 18, price: 120 },
    wet_wipes: { name: "ウェットティッシュ", hygiene: 10, price: 110 },
    bandage: { name: "手当用品", health: 10, price: 260 },
    blanket: { name: "毛布", warmth: 12, price: 900 },
    aluminum_can: { name: "空き缶", sell: 25 },
    scrap_piece: { name: "金属片", sell: 70 },
    cardboard: { name: "段ボール", warmth: 4, price: 0 }
  };
})();
