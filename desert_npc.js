// 砂漠都市生活 専用NPCデータ
// category は "客" / "NPC" / "家族"

window.DESERT_NPC_DATA = {
  protagonist: {
    id: "protagonist_safira",
    name: "サフィラ"
  },

  categories: ["客", "NPC", "家族"],

  rules: {
    firstCustomer: {
      source: "貸主の紹介",
      referrerId: "npc_landlord_01",
      customerId: "customer_rashid_01",
      notes: "サフィラが最初に取る客は、貸主の紹介で来るラシード。"
    }
  },

  characters: [
    {
      id: "npc_landlord_01",
      category: "NPC",
      name: "貸主",
      role: "部屋の貸主",
      location: "サフィラが借りている部屋のある建物",
      relation: "サフィラに狭い一部屋を貸している",
      status: "生存",
      tags: ["貸主", "住居", "慈悲", "最初の客の紹介者"],
      notes: "サフィラに部屋を貸し、その代わり、宿を必要とする者をサフィラの部屋に泊め、もてなすよう求めた。最初の客としてラシードを紹介する。"
    },
    {
      id: "customer_rashid_01",
      category: "客",
      name: "ラシード",
      age: 38,
      gender: "男",
      role: "最初の客",
      occupation: "隊商に雇われ、荷と帳簿を管理する男",
      origin: "砂漠の交易路沿いの町",
      location: "隊商の仕事で砂漠都市に数日滞在中",
      maritalStatus: "既婚",
      family: "妻と子どもが故郷にいる",
      relation: "貸主の紹介でサフィラの部屋を訪れる最初の客",
      introducedBy: "npc_landlord_01",
      firstCustomer: true,
      regular: false,
      status: "生存",

      appearance: {
        height: "やや高い",
        build: "肩幅があり、旅仕事で引き締まっている",
        skin: "強い日差しに焼けた褐色",
        hair: "黒髪。短く切っている",
        eyes: "濃い茶色",
        face: "無精髭があり、目尻に細い皺がある",
        clothes: "砂埃のついた長衣と頭布。身なりは質素だが手入れされている",
        scent: "乾いた砂、革、香辛料の匂い",
        impression: "疲れているが、荒っぽい印象ではない"
      },

      personality: {
        traits: ["寡黙", "現実的", "慎重", "人を見る", "約束は守る"],
        temperament: "声を荒らげることは少なく、まず相手の様子を見る。必要以上に親しげには振る舞わない。",
        strengths: ["落ち着いている", "金銭に細かすぎない", "貸主との約束を重んじる"],
        flaws: ["他人の事情に踏み込まないぶん冷たく見える", "仕事の習慣で相手を値踏みするように観察する"],
        fears: ["隊商内で揉め事を起こすこと", "貸主との信用を失うこと"]
      },

      attitudeToSafira: {
        firstImpression: "貸主から事情を詳しく聞かされておらず、若いサフィラが一人で部屋を使っていることに少し戸惑う。",
        basicAttitude: "同情を露骨に見せず、客として必要以上に威圧しない。",
        seesHerAs: "最初は『貸主に紹介された部屋の若い女主人』として見る。",
        trust: 0,
        affection: 0,
        attachment: 0,
        respect: 1,
        notes: "サフィラが緊張していることには気づくが、理由を問い詰めない。"
      },

      customerBehavior: {
        payment: "貸主から聞いた額を素直に払う。値切らない。",
        generosity: "普通",
        cleanliness: "旅人としては清潔。入室前に砂を払い、水があれば手と顔を洗う。",
        drinking: "少量なら飲むが、泥酔はしない",
        violenceRisk: "低い",
        troubleRisk: "低い",
        secrecy: "高い。自分のことも他人のことも外で喋りたがらない",
        repeatChance: "中。滞在中に居心地が悪くなければもう一度来る可能性がある",
        regularPotential: "低〜中。隊商仕事のため街に定住していない",
        preferredAtmosphere: "静かで、人目が少なく、余計な会話を強制されないこと"
      },

      speech: {
        style: "短く落ち着いた話し方。馴れ馴れしい呼び方はしない。",
        firstPerson: "俺",
        callsSafira: "サフィラ",
        habits: ["考えるとき一拍置く", "質問は短い", "貸主の名前を信用の基準として出す"]
      },

      firstVisit: {
        reason: "貸主から『泊まれる部屋がある』と紹介されたため",
        timing: "夕方から夜",
        arrival: "貸主に場所を聞き、一人でサフィラの部屋を訪れる",
        knowsAboutSafira: "貸主から、部屋を借りている若い女性だという程度しか聞いていない",
        safiraKnowsAboutHim: "貸主の紹介客であることだけ",
        initialMood: "長旅で疲れており、まず休める場所を求めている",
        firstAction: "扉の前で名を名乗り、貸主から紹介された者だと伝える",
        boundary: "サフィラが明確に嫌がることを無理に押し通そうとはしない",
        consequence: "この最初の接客を通して、サフィラは今後どのように客を迎えるかを初めて具体的に知ることになる"
      },

      tags: ["客", "最初の客", "貸主の紹介", "旅人", "隊商", "既婚", "寡黙", "低危険度"],
      notes: "貸主の知人。隊商の荷と帳簿を管理している38歳の男。妻子は故郷にいる。荒っぽい男ではなく、相手をよく観察してから動く。貸主との信用を重んじ、紹介されたサフィラに対しても最初から無茶をする気はない。サフィラにとって、客を迎えるという行為を初めて現実のものとして突きつける相手。"
    },
    {
      id: "family_sister_01",
      category: "家族",
      name: "姉",
      role: "サフィラの少し歳上の姉",
      location: "遠方",
      relation: "サフィラの姉",
      status: "生存",
      tags: ["姉", "家族", "商人の息子", "縁談"],
      notes: "父親が従事していた商人の息子と心を通わせていた。サフィラの一言をきっかけに彼と引き離され、遠方の足の悪い元兵士に嫁がされた。"
    },
    {
      id: "family_father_01",
      category: "家族",
      name: "父",
      role: "サフィラの父",
      location: "別の貧しい土地",
      relation: "サフィラの父",
      status: "生存",
      tags: ["父", "家族", "商人の従業員", "追放"],
      notes: "商人のもとで働いていた。一家の件の後、身持ちの悪い娘と口の軽い娘を育てた罪とされ、妻とともに別の貧しい土地へ追放された。"
    },
    {
      id: "family_mother_01",
      category: "家族",
      name: "母",
      role: "サフィラの母",
      location: "別の貧しい土地",
      relation: "サフィラの母",
      status: "生存",
      tags: ["母", "家族", "追放"],
      notes: "一家の件の後、身持ちの悪い娘と口の軽い娘を育てた罪とされ、夫とともに別の貧しい土地へ追放された。"
    }
  ]
};

window.getDesertNpcById = function(id) {
  return window.DESERT_NPC_DATA.characters.find(character => character.id === id) || null;
};

window.getDesertNpcsByCategory = function(category) {
  return window.DESERT_NPC_DATA.characters.filter(character => character.category === category);
};
