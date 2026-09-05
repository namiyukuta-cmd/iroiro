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
    dialogueGeneration: {
      priority: ["departureDialogue", "sceneDialogue", "speech", "personality"],
      notes: "客の場面を生成するときは性格タグだけで似た会話を作らず、NPC固有のセリフ候補と行動を最優先する。特に帰り際は『娼婦と一晩過ごした客』としての満足、不満、名残、金、再訪、秘密、身分差などが台詞に出るようにする。"
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
      id: "customer_mikhail_01",
      category: "客",
      name: "ミハイル",
      age: 46,
      gender: "男",
      role: "富裕な旧市街商人",
      occupation: "染物・香料・ガラス器を扱う商人",
      origin: "旧市街",
      location: "市内に店と倉庫を持つ",
      regular: false,
      status: "生存",
      socialClass: "富裕層",
      customerBehavior: {
        payment: "定額より多く払うことがある。金そのものより品物を置いていく場合もある。",
        generosity: "高い",
        secrecy: "高い",
        repeatChance: "中",
        preferredAtmosphere: "贅沢ではなくても、静かで秘密が守られること"
      },
      speech: {
        style: "柔らかいが、自分が金を持っていることを隠さない。娼婦に対しては気に入ったことを素直に口にする。",
        firstPerson: "私",
        callsSafira: "サフィラ"
      },
      departureDialogue: {
        defaultAction: "帰り際、香油の小瓶や上等な布など換金できる品を、貸主に見えないようサフィラへ直接渡す。",
        lines: [
          "良い夜だった。これは料金とは別だ。貸主に渡す必要はない。",
          "この布は売ってもいいし、自分で使ってもいい。どちらにしても、あの男には見せるなよ。",
          "静かな部屋だ。こういう場所の方が、立派な娼館より落ち着く時もある。",
          "次に来る時は香油を持ってこよう。お前には、もう少し甘い匂いの方が似合いそうだ。",
          "私の名を外で口にしないなら、また来る。こちらもお前のことは余計に話さない。",
          "朝になると帰りたくなくなるな。……商売人がそんなことを言うものではないか。"
        ]
      },
      tags: ["客", "富裕商人", "高額客", "秘密", "贈り物"]
    },

    {
      id: "customer_qasim_01",
      category: "客",
      name: "カシム",
      age: 25,
      gender: "男",
      role: "若い軍人",
      occupation: "騎兵隊に属する若い兵士",
      origin: "遠方",
      location: "任務のため都市に滞在中",
      regular: false,
      status: "生存",
      socialClass: "軍人",
      customerBehavior: {
        payment: "懐に余裕がある時は気前がいい。金を荒っぽく置く癖がある。",
        generosity: "中〜高",
        violenceRisk: "中",
        troubleRisk: "中",
        repeatChance: "低〜中",
        preferredAtmosphere: "自分を怖がりすぎない相手"
      },
      speech: {
        style: "尊大で粗い。満足すると急に機嫌がよくなる。",
        firstPerson: "俺",
        callsSafira: "お前"
      },
      departureDialogue: {
        defaultAction: "武具を身につけ直し、銀貨の入った小袋を乱暴に置く。出立や戦の予定を大げさに語る。",
        lines: [
          "ふん。悪くなかった。お前、その怯えた顔の割にはちゃんと客を見てるな。",
          "ほら、取っとけ。余りだ。次に来た時、まだここにいろよ。",
          "明日にはまた隊に戻る。生きて帰ったら、最初にここへ来てやる。",
          "俺みたいなのが嫌なら、次から扉を開ける前に断れ。中に入れてから震えるな。",
          "昨夜のこと、後悔した顔をするな。俺まで気分が悪くなる。",
          "次はもっと酒を持ってくる。お前にも一杯くらい飲ませてやる。"
        ]
      },
      tags: ["客", "軍人", "荒っぽい", "高めのチップ", "一時滞在"]
    },

    {
      id: "customer_yunus_01",
      category: "客",
      name: "ユーヌス",
      age: 34,
      gender: "男",
      role: "遠方から来た巡礼者",
      occupation: "旅の途中の巡礼者",
      origin: "西方の遠い土地",
      location: "旅の途中で都市に数日滞在中",
      regular: false,
      status: "生存",
      socialClass: "旅人",
      customerBehavior: {
        payment: "定額をきっちり払う",
        generosity: "低〜普通",
        secrecy: "非常に高い",
        repeatChance: "低",
        preferredAtmosphere: "人に見られず、名を聞かれないこと"
      },
      speech: {
        style: "昨夜は自分から来ておきながら、朝になると罪悪感と自己嫌悪がにじむ。サフィラにも距離を取る。",
        firstPerson: "私",
        callsSafira: "あなた"
      },
      departureDialogue: {
        defaultAction: "朝になると急に口数が減り、衣服を急いで整える。昨夜を自分の過ちとして処理しようとする。",
        lines: [
          "……昨夜のことは忘れてください。私も、忘れるつもりです。",
          "あなたが悪いわけではない。ここへ来たのは私です。",
          "もう来ません。……少なくとも、そう決めてここを出ます。",
          "金はそこに置きました。数えなくていい、足りています。",
          "あなたも、いつかここから出られるといい。……余計なことを言いました。",
          "昨夜は確かに楽しかった。それを認めるから、余計に朝が嫌なんです。"
        ]
      },
      tags: ["客", "巡礼者", "罪悪感", "一度きり", "秘密"]
    },

    {
      id: "customer_khalil_01",
      category: "客",
      name: "ハリール",
      age: 37,
      gender: "男",
      role: "砂漠の馬商人",
      occupation: "馬を売買する遊牧系の商人",
      origin: "砂漠の集落",
      location: "市場で馬を売るため都市に滞在中",
      regular: false,
      status: "生存",
      socialClass: "商人",
      customerBehavior: {
        payment: "相場を知っていて値段の話を好む。気に入れば少額を上乗せする。",
        generosity: "普通",
        troubleRisk: "低〜中",
        repeatChance: "中",
        preferredAtmosphere: "都会らしい清潔さと香り"
      },
      speech: {
        style: "冗談が多く、娼婦であるサフィラを女として露骨に褒める。",
        firstPerson: "俺",
        callsSafira: "あんた"
      },
      departureDialogue: {
        defaultAction: "砂埃のついた外套を羽織り、名残惜しそうに振り返る。値段と街の女の違いを冗談にする。",
        lines: [
          "都会の女ってのは、どうしてこういい匂いがするんだろうな。朝になってもまだ残ってる。",
          "六で一晩なら安いもんだ。馬ならその値じゃ蹄一本だって買えやしない。",
          "次に馬を売りに来た時も、ここが残ってりゃ寄るよ。あんたも残ってりゃ、なおいい。",
          "昨夜みたいに黙ってるだけじゃもったいないぞ。客なんて褒めときゃ勝手に機嫌よく帰る。",
          "ほら、これは余りだ。水が冷えてた分くらいにはなるだろ。",
          "砂漠へ戻ったら、たぶんこの狭い部屋が妙に恋しくなる。"
        ]
      },
      tags: ["客", "馬商人", "砂漠", "冗談好き", "再訪可能"]
    },

    {
      id: "customer_nazim_01",
      category: "客",
      name: "ナジーム",
      age: 31,
      gender: "男",
      role: "川港の荷受人",
      occupation: "船荷を運ぶ日雇い労働者",
      origin: "川沿いの貧民街",
      location: "都市に定住",
      regular: false,
      status: "生存",
      socialClass: "下層労働者",
      customerBehavior: {
        payment: "何日も貯めた金を使うため、値切りたい気持ちはあるが最終的には払う。",
        generosity: "低いが、気持ちが高ぶると小銭を残す",
        cleanliness: "仕事帰りは汗と泥の匂いが強い",
        troubleRisk: "低い",
        repeatChance: "低〜中",
        preferredAtmosphere: "自分を見下されないこと"
      },
      speech: {
        style: "身分差を意識し、少し卑屈だが感情は素直。名残惜しさを隠せない。",
        firstPerson: "俺",
        callsSafira: "あんた"
      },
      departureDialogue: {
        defaultAction: "帰りたくなさそうに何度も振り返る。残り少ない銅貨を握りしめ、次に来られる日を考える。",
        lines: [
          "……もう朝か。早いな。金を貯める時はあんなに長かったのに。",
          "俺みたいなの相手でも、ちゃんと名前を呼んでくれたな。あれ、嬉しかったよ。",
          "次はいつ来られるか分からないけど……また金を貯める。",
          "これ、余った小銭だけど置いてく。笑うなよ、俺にはこれでも大事な金なんだ。",
          "外じゃ誰も俺の顔なんか見ない。ここじゃ一晩だけでも人間みたいだった。",
          "忘れてもいいよ。俺の方は、たぶんしばらく忘れられそうにない。"
        ]
      },
      tags: ["客", "下層労働者", "貧しい", "名残惜しい", "再訪は貯金次第"]
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
