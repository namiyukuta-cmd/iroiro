// 砂漠都市生活 専用NPCデータ
// category は "客" / "NPC" / "家族"
// 宗教史・実在史の正確な再現より、架空世界の人物としての一貫性と会話生成を優先する。

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
      notes: "サフィラが最初に取る客は、貸主の紹介で来るラシード。ラシードは最初から売春の客として紹介されたことを理解している。"
    },
    secondCustomer: {
      source: "貸主の紹介",
      referrerId: "npc_landlord_01",
      customerId: "customer_nadir_01",
      notes: "二人目の客はナーディル。ラシードより口数が多く、女慣れしており、客としての満足や好みを言葉にする。"
    },
    dialogueGeneration: {
      basis: ["personality", "speech", "customerBehavior", "attitudeToSafira", "sceneDialogue", "departureDialogue"],
      notes: "場面生成では性格・立場・客としての行動傾向・サフィラへの態度・話し方・固有セリフを全部合わせて使う。固有セリフは性格設定を上書きするものではなく、その人物らしい会話を具体化するための材料。どれか一つだけを優先して人物像を崩さない。"
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
      notes: "サフィラに部屋を貸し、その代わり、宿を必要とする者をサフィラの部屋に泊め、もてなすよう求めた。最初の売春客としてラシードを紹介する。"
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
      relation: "貸主の紹介でサフィラの部屋を訪れる最初の売春客",
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
        firstImpression: "貸主から売春の客として紹介されて来ているため、若い女の部屋を訪れる意味は最初から理解している。ただし、サフィラが明らかに慣れていないことには入室してすぐ気づく。",
        basicAttitude: "客として来た自覚があり、サフィラを娼婦として扱う。ただし、必要以上に威圧したり、戸惑いを面白がったりはしない。",
        seesHerAs: "貸主が紹介した若い娼婦。経験が浅い、あるいは初めて客を取る可能性があると見ている。",
        trust: 0,
        affection: 0,
        attachment: 0,
        respect: 1,
        notes: "サフィラが緊張していることにはすぐ気づく。なぜこの仕事をしているのかは尋ねないが、自分が何のためにここへ来たのかを曖昧には考えていない。"
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
        style: "短く落ち着いた話し方。馴れ馴れしい呼び方はしない。だが娼婦相手の客として、満足や再訪については遠回しにしすぎない。",
        firstPerson: "俺",
        callsSafira: "サフィラ",
        habits: ["値段や条件を具体的に口にする", "必要なら短く褒める", "帰り際は次に来る可能性を言葉にする"]
      },

      firstVisit: {
        reason: "貸主から、サフィラの部屋で女を買えると紹介されたため",
        timing: "夕方から夜",
        arrival: "貸主に場所を聞き、一人でサフィラの部屋を訪れる",
        knowsAboutSafira: "貸主から、若い女が部屋で客を取ることと、代金の額を聞いている。事情や身の上までは知らない。",
        safiraKnowsAboutHim: "貸主の紹介客であることだけ",
        initialMood: "長旅で疲れているが、単なる宿泊ではなく売春の客として来ている意識がある",
        firstAction: "扉の前で名を名乗り、貸主から紹介された客だと伝える",
        boundary: "サフィラが明確に嫌がることを無理に押し通そうとはしない",
        consequence: "サフィラにとって、貸主の言う『もてなす』の意味が、最初の客を前にして現実のものになる"
      },

      departureDialogue: {
        defaultAction: "朝、身支度を整えながら昨夜を客として振り返る。金額や次の滞在予定を現実的に話し、気に入れば再訪の意思をはっきり示す。",
        lines: [
          "……悪くなかった。初めてなら、なおさらな。",
          "六で朝まで置いて、水と飯まで出すなら、俺は文句はない。",
          "あと何日かはこの街にいる。空いていれば、また来る。",
          "貸主には、次も俺をここへ回してくれと言っておく。",
          "昨夜みたいに灯りを消してくれて構わん。お前がその方が楽ならな。",
          "そんなに気まずそうな顔をするな。俺は金を払って来た客だ。お前は俺を泊めた。それでいい。",
          "他の客にも同じ値で朝まで付き合うなら、せめて貸主に客は選ばせろ。安い部屋には、安い客も寄ってくる。",
          "次に来た時まで覚えていろとは言わん。だが、俺はお前の顔を覚えておく。"
        ]
      },

      sceneDialogue: {
        arrival: [
          "貸主から聞いている。今夜はここでいいんだな。",
          "六で朝まで、と聞いた。違うなら今言ってくれ。"
        ],
        morning: [
          "水をもらう。昨夜の分とは別に取るなら払う。",
          "もう出る。隊商の連中が起きる前にな。"
        ]
      },

      tags: ["客", "最初の客", "貸主の紹介", "売春客", "旅人", "隊商", "既婚", "寡黙", "低危険度"],
      notes: "貸主の知人。隊商の荷と帳簿を管理している38歳の男。妻子は故郷にいる。貸主からサフィラを売春の相手として紹介され、その意味を理解したうえで部屋を訪れる。荒っぽい男ではなく、相手をよく観察してから動く。"
    },

    {
      id: "customer_nadir_01",
      category: "客",
      name: "ナーディル",
      age: 30,
      gender: "男",
      role: "二人目の客",
      occupation: "市場で布と染料を扱う店の番頭",
      origin: "砂漠都市",
      location: "市場近くに住む",
      maritalStatus: "未婚",
      relation: "貸主の紹介でサフィラの部屋を訪れる二人目の売春客",
      introducedBy: "npc_landlord_01",
      secondCustomer: true,
      regular: false,
      status: "生存",

      appearance: {
        height: "平均より少し低い",
        build: "細身だが華奢ではない",
        skin: "浅く日に焼けている",
        hair: "黒髪をきちんと撫でつけている",
        eyes: "黒に近い茶色",
        face: "髭は短く整えている。口元によく笑みが浮かぶ",
        clothes: "市場勤めらしく清潔な長衣。袖や指先に薄く染料の色が残っている",
        scent: "石鹸と染料、わずかな香油",
        impression: "身なりに気を使い、客としても女の前で格好をつけたがる"
      },

      personality: {
        traits: ["話好き", "女慣れしている", "軽口が多い", "観察好き", "見栄っ張り"],
        temperament: "沈黙が続くのを嫌い、相手の反応を見ながらよく喋る。悪意よりも、自分が好かれていると思いたがる気持ちが強い。",
        strengths: ["機嫌がよく社交的", "気に入った相手には気前がよくなる", "相手の反応をよく見る"],
        flaws: ["褒め言葉が軽い", "相手も自分を楽しんでいると思い込みやすい", "自分の経験を少し誇張する"],
        fears: ["女に露骨に嫌われること", "自分が退屈な男だと思われること"]
      },

      attitudeToSafira: {
        firstImpression: "若く、まだ客あしらいに慣れていない娼婦だとすぐ気づく。ラシードのように黙って見守るのではなく、その不慣れさ自体を可愛らしいと感じる。",
        basicAttitude: "サフィラを娼婦として扱いながらも、客と女の間の軽いやり取りを楽しみたがる。気に入れば言葉でも態度でもそれを隠さない。",
        seesHerAs: "貸主が新しく客を取らせ始めた若い娼婦。まだ型が決まっていないぶん、自分にどう応じるかを見るのが面白い相手。",
        trust: 0,
        affection: 0,
        attachment: 0,
        respect: 0,
        notes: "サフィラの事情には興味を持つが、初回から深く聞き出そうとはしない。まずは自分が客として気分よく過ごせるかを見る。"
      },

      customerBehavior: {
        payment: "六ディルハムを払う。値切らない。気分がよければ端数程度の小さな上乗せをする可能性がある。",
        generosity: "普通〜やや高い",
        cleanliness: "清潔。女の前に出る前に身なりを整える習慣がある",
        drinking: "酒があれば飲むが、なくても気にしない",
        violenceRisk: "低い",
        troubleRisk: "低〜中。口が軽くなりやすい",
        secrecy: "中。客として来たことを吹聴はしないが、親しい男友達には店や女の話をする可能性がある",
        repeatChance: "高め。気に入れば同じ女を繰り返し選ぶ",
        regularPotential: "中〜高。街に定住している",
        preferredAtmosphere: "女から多少でも言葉や反応が返ってくること。静かすぎる相手は苦手"
      },

      speech: {
        style: "よく喋り、冗談と褒め言葉を混ぜる。娼婦相手であることを隠さず、昨夜を楽しんだなら帰り際にもはっきり言う。",
        firstPerson: "俺",
        callsSafira: "サフィラ",
        habits: ["見た目や仕草を褒める", "昨夜のことを曖昧にせず感想として口にする", "次回の話を冗談半分に早く出す", "相手が照れたり困ったりすると少し面白がる"]
      },

      firstVisit: {
        reason: "貸主から、サフィラという若い娼婦が客を取り始めたと聞いたため",
        timing: "夕方から夜",
        arrival: "貸主から場所と料金を聞き、一人で来る",
        knowsAboutSafira: "若く、客を取り始めたばかりらしいことと、一晩六ディルハムで水とアシーダが付くことを聞いている",
        safiraKnowsAboutHim: "貸主の紹介客で、市場勤めの男だという程度",
        initialMood: "新しい女を紹介されたことへの好奇心が強い。緊張より期待が勝っている",
        firstAction: "名乗ったあと部屋を見回し、狭さを気にせずサフィラ本人をよく見る",
        boundary: "明確に拒まれれば押し通さないが、遠慮より親しげな距離の詰め方をする",
        consequence: "ラシードとは違い、客がサフィラを女としてどう評価するかを言葉にするため、サフィラは客商売としての視線をより強く意識する"
      },

      departureDialogue: {
        defaultAction: "朝、まだ名残惜しそうに身支度をしながら、昨夜の感想を隠さず口にする。扉を出る直前までサフィラへ軽口を残す。",
        lines: [
          "六なら安いな。朝まで一緒で、腹まで満たしてくれるんだから。",
          "昨夜はあんなに固かったのに、朝になったら少しは俺の顔を見られるようになったな。",
          "お前、客に慣れたらもっと人気が出るぞ。……まあ、俺としては慣れる前の方が面白いけどな。",
          "次に来た時も灯りを消すのか？　俺はどっちでも楽しめるが。",
          "悪くなかった、じゃ足りないな。俺はかなり気に入った。",
          "貸主には何て言おうか。『また同じ女を寄越せ』で通じるかな。",
          "その顔、他の客にも見せるんだろ。金を払ってるのに、少し惜しい気がするな。",
          "また来るよ。今度はお前の方から俺の名前を呼んでくれ。"
        ]
      },

      sceneDialogue: {
        arrival: [
          "サフィラ？　へえ。貸主の話よりずっと若く見えるな。",
          "六で朝までって聞いた。安いから来た、って言ったら怒るか？"
        ],
        morning: [
          "もう朝か。客の側からすると、こういう夜だけは短いな。",
          "水、もう一杯もらえるか。喉が渇いた。"
        ]
      },

      tags: ["客", "二人目の客", "貸主の紹介", "売春客", "市場", "番頭", "未婚", "話好き", "女慣れ", "再訪しやすい"],
      notes: "二人目の客。市場の布と染料を扱う店で番頭をしている30歳の男。ラシードより会話が多く、女慣れしており、客としての満足・好み・再訪の意思を言葉にする。"
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

window.getDesertCustomerDepartureLines = function(id) {
  const customer = window.getDesertNpcById(id);
  return customer?.departureDialogue?.lines || [];
};