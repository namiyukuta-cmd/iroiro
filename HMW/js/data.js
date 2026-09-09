(() => {
  "use strict";
  window.HMW = window.HMW || {};

  HMW.DATA = {
    slots: ["朝", "昼", "夕方", "深夜"],
    locations: {
      station_front: {
        name: "駅前",
        description: "人通りが多い。掲示板、ベンチ、植え込み、ゴミ箱がある。長居すると警官や店側に目を付けられやすい。",
        connections: ["shopping_street", "park", "labor_office", "police_station"],
        visibleFromStart: true
      },
      shopping_street: {
        name: "商店街",
        description: "個人商店とコンビニが並ぶ通り。買い物、店員との関係、短い仕事の口が生まれる場所。",
        connections: ["station_front", "convenience_store", "public_toilet", "residential_alley"],
        visibleFromStart: true
      },
      park: {
        name: "公園",
        description: "ベンチと水場がある。昼は休みやすいが、夜は巡回や他の野宿者の影響を受ける。",
        connections: ["station_front", "underpass", "charity_center", "public_toilet"],
        visibleFromStart: true
      },
      convenience_store: {
        name: "コンビニ",
        description: "安い食べ物を買える。店員は、こちらの態度とこれまでの行動を覚えている。",
        connections: ["shopping_street"],
        visibleFromStart: false
      },
      charity_center: {
        name: "支援センター",
        description: "食料、洗面、相談。支援は一度で全部解決するものではなく、日をまたいで進む。",
        connections: ["park", "residential_alley"],
        visibleFromStart: false
      },
      public_toilet: {
        name: "公衆トイレ",
        description: "水道と洗面台がある。最低限の身支度ができる。",
        connections: ["shopping_street", "park"],
        visibleFromStart: false
      },
      labor_office: {
        name: "労働窓口",
        description: "身分や連絡先が必要な仕事が多い。条件が整えば日雇いの紹介を受けられる。",
        connections: ["station_front"],
        visibleFromStart: false
      },
      underpass: {
        name: "高架下",
        description: "雨風をしのげるが、縄張りと夜の危険がある。安全に使うには情報が必要。",
        connections: ["park", "riverside", "recycling_yard"],
        visibleFromStart: false
      },
      riverside: {
        name: "河川敷",
        description: "廃品を拾えることがある。夜は人目が少なく、天候の影響を強く受ける。",
        connections: ["underpass", "industrial_street"],
        visibleFromStart: false
      },
      industrial_street: {
        name: "工業通り",
        description: "廃材や回収品が出やすい。非正規の仕事もあるが、夜は危険が増す。",
        connections: ["riverside", "recycling_yard"],
        visibleFromStart: false
      },
      recycling_yard: {
        name: "廃品回収所",
        description: "空き缶や金属片を買い取る。何度か真面目に持ち込むと仕事の口が生まれる。",
        connections: ["underpass", "industrial_street"],
        visibleFromStart: false
      },
      residential_alley: {
        name: "住宅裏",
        description: "捨てられた物を拾えることがあるが、住民の目が厳しい。",
        connections: ["shopping_street", "charity_center"],
        visibleFromStart: false
      },
      police_station: {
        name: "交番",
        description: "相談や落とし物の窓口。警察との関係が悪ければ居心地はよくない。",
        connections: ["station_front"],
        visibleFromStart: true
      }
    },

    items: {
      bread: { name: "パン", hunger: -14, price: 120 },
      rice_ball: { name: "おにぎり", hunger: -18, price: 170 },
      food_pack: { name: "支援食", hunger: -24, price: 0 },
      leftover_food: { name: "廃棄予定の食べ物", hunger: -20, price: 0 },
      bottled_water: { name: "水", hunger: -2, price: 100 },
      soap: { name: "石けん", hygiene: 18, price: 120 },
      wet_wipes: { name: "ウェットティッシュ", hygiene: 10, price: 110 },
      bandage: { name: "手当用品", health: 10, price: 260 },
      blanket: { name: "毛布", warmth: 12, price: 900 },
      aluminum_can: { name: "空き缶", sell: 25 },
      scrap_piece: { name: "金属片", sell: 70 },
      cardboard: { name: "段ボール", warmth: 4, price: 0 }
    },

    people: {
      support_named: { name: "アーロン", role: "支援センター職員", romance: true },
      police_named: { name: "マーク", role: "警察官", romance: true },
      homeless_named: { name: "サム", role: "高架下で暮らす男", romance: true },
      thug_named: { name: "レオン", role: "工業通りの男", romance: true },
      clerk: { name: "コンビニ店員", role: "店員", romance: false },
      recycler: { name: "回収所の作業員", role: "回収所", romance: false }
    }
  };
})();