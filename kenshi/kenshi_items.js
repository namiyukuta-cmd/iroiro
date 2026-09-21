(function(){
"use strict";

window.KENSHI_ITEMS={
  bread:{name:"パン",category:"food",image:"asset/item/item_bread.png",stack:5,hungerRecovery:18,buy:10,sell:5},
  dried_meat:{name:"干し肉",category:"food",image:"asset/item/item_dried_meat.png",stack:5,hungerRecovery:24,buy:14,sell:7},
  dried_fish:{name:"干し魚",category:"food",image:"asset/item/item_dried_fish.png",stack:5,hungerRecovery:22,buy:13,sell:6},
  rice_bowl:{name:"ライスボウル",category:"food",image:"asset/item/item_rice_bowl.png",stack:5,hungerRecovery:28,buy:18,sell:9},
  gohan:{name:"ゴハン",category:"food",image:"asset/item/item_gohan.png",stack:5,hungerRecovery:32,buy:22,sell:11},
  dustwich:{name:"ダストウィッチ",category:"food",image:"asset/item/item_dustwich.png",stack:5,hungerRecovery:35,buy:24,sell:12},
  meatwrap:{name:"ミートラップ",category:"food",image:"asset/item/item_meatwrap.png",stack:5,hungerRecovery:40,buy:28,sell:14},
  foodcube:{name:"フードキューブ",category:"food",image:"asset/item/item_foodcube.png",stack:5,hungerRecovery:45,buy:32,sell:16},
  ration_pack:{name:"レーションパック",category:"food",image:"asset/item/item_ration_pack.png",stack:5,hungerRecovery:55,buy:40,sell:20},

  bandage:{name:"包帯",category:"medical",image:"asset/item/item_bandage.png",stack:5,heal:30,buy:24,sell:12},

  iron_ore:{name:"鉄鉱石",category:"material",image:"asset/item/item_iron_ore.png",stack:5,buy:0,sell:13},
  copper_ore:{name:"銅鉱石",category:"material",image:"asset/item/item_copper_ore.png",stack:5,buy:0,sell:16},
  scrap_iron:{name:"鉄くず",category:"material",image:"asset/item/item_scrap_iron.png",stack:5,buy:0,sell:9},
  cloth:{name:"布",category:"material",image:"asset/item/item_cloth.png",stack:5,buy:12,sell:6},
  leather:{name:"革",category:"material",image:"asset/item/item_leather.png",stack:5,buy:18,sell:9}
};

window.KENSHI_ITEM_CATEGORIES={
  food:"食料",
  medical:"医療",
  material:"素材"
};

window.KENSHI_LEGACY_ITEM_META={
  food:{name:"食料",stack:5},
  med:{name:"治療具",stack:5},
  ore:{name:"鉄鉱石",stack:5},
  scrap:{name:"廃材",stack:5}
};
})();