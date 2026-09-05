// 砂漠都市生活：世界・生活設定データ
// NPC個人設定は desert_npc.js で管理する。
// 史実参考値とゲーム用設定を混同しないよう sourceType / status を付ける。

window.DESERT_WORLD_DATA = {
  model: {
    title: "砂漠都市の歴史モデル",
    sourceType: "史実参考",
    period: "11〜13世紀ごろ",
    region: "エジプト〜レヴァントの都市・交易圏を主な参考にする",
    note: "特定の実在国家や都市をそのまま再現するのではなく、生活感・貨幣・交易・都市文化の参考モデルとして使う。"
  },

  currency: {
    sourceType: "史実参考",
    main: {
      name: "ディルハム",
      type: "銀貨",
      use: "ゲーム内の日常的な価格・賃金・客の料金の基本単位"
    },
    gold: {
      name: "ディナール",
      type: "金貨",
      use: "高額取引やまとまった財産を表す時に使う"
    },
    copper: {
      name: "ファルス",
      plural: "フルース",
      type: "銅貨",
      use: "細かな日用品や端数を表す時に使う"
    },
    exchangeNote: "ディナールとディルハムの比率は時代・地域で大きく変動するため、ゲームでは固定換算を基本ルールにしない。"
  },

  historicalEconomy: {
    sourceType: "史実参考",
    wages: [
      {label: "単純労働", amount: "1日 2〜3.5ディルハム程度"},
      {label: "熟練工", amount: "1日 5ディルハム前後"}
    ],
    living: [
      {label: "簡単な昼食", amount: "約1.25ディルハムという参考例"},
      {label: "一家の最低生活費", amount: "月約80ディルハムという参考例"}
    ],
    sexWorkReference: [
      {label: "低額帯", amount: "1〜2ディルハム程度の例"},
      {label: "比較的一般的な幅", amount: "2〜10ディルハム程度の例"},
      {label: "高額帯", amount: "10ディルハム以上になる例もある"}
    ],
    intermediaryShare: [
      {label: "仲介者", amount: "料金の約1/6という例"},
      {label: "場所の提供者", amount: "料金の約1/4〜1/2という例"},
      {label: "強い仲介・管理", amount: "約1/2に達する例"}
    ],
    note: "上記は地域・時代・身分・仕事内容で大きく変動する参考値。ゲーム内価格を史実そのものと断定しない。"
  },

  gameEconomy: {
    sourceType: "ゲーム用設定",
    status: "仮",
    unit: "ディルハム",
    prices: [
      {id: "water", label: "水", min: 0, max: 0.1, display: "0〜0.1"},
      {id: "bread", label: "パン", min: 0.2, max: 0.3, display: "0.2〜0.3"},
      {id: "meal", label: "簡単な食事", min: 0.5, max: 1.25, display: "0.5〜1.25"},
      {id: "bath", label: "公衆浴場", min: 0.5, max: 1, display: "0.5〜1"},
      {id: "oil", label: "香油・石鹸など", min: 1, max: 3, display: "1〜3"}
    ],
    wages: [
      {id: "simple", label: "単純労働1日", min: 2, max: 3, display: "2〜3"},
      {id: "skilled", label: "熟練労働1日", min: 5, max: 5, display: "5前後"}
    ],
    customerRates: [
      {id: "cheap", label: "サフィラの客・安め", min: 3, max: 5, display: "3〜5"},
      {id: "normal", label: "サフィラの通常客", min: 5, max: 8, display: "5〜8"},
      {id: "established", label: "評判がついた後", min: 8, max: 12, display: "8〜12以上"}
    ],
    firstCustomer: {
      status: "仮",
      customerId: "customer_rashid_01",
      customerName: "ラシード",
      total: 6,
      landlordShare: 2,
      safiraShare: 4,
      note: "貸主が紹介した最初の客。6ディルハムを払い、貸主2・サフィラ4という案。まだ変更可能。"
    },
    startingBalanceInterpretation: {
      money: 3,
      debt: 30,
      note: "所持金3は一日程度の生活費に近い切迫した額。借金30は単純労働なら約10日分前後の賃金に相当する感覚。"
    }
  },

  customs: {
    sourceType: "世界独自設定",
    footCleaning: {
      name: "客人の足を清める",
      origin: "サフィラの故郷の風習",
      action: "客を迎える時、冷えた水を出し、濡らして固く絞った布で旅の汚れがついた足を拭いてやる。",
      historicalNote: "イスラーム圏全体の一般的な客迎えの作法とは断定せず、サフィラの故郷固有の風習として扱う。"
    }
  },

  prostitutionSetting: {
    sourceType: "世界設定＋史実参考",
    note: "都市では売春が存在し、時期によって禁止・黙認・課税など扱いが変わる。サフィラは貸主の部屋で客を取り、貸主が客を紹介する場合がある。",
    landlordRole: "部屋の提供者であり、客の紹介者にもなり得る。紹介料・場所代として取り分を得る構造をゲームに使える。"
  },

  referenceNotes: [
    "史実参考値はゲームの生活感を整えるための基準で、作品世界の法律や価格を自動的に確定するものではない。",
    "価格・取り分・交換比率は、物語やゲームバランスに合わせて後から変更してよい。",
    "人物ごとの客設定・性格・行動傾向は desert_npc.js を正本とする。"
  ]
};
