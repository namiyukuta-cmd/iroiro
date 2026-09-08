(() => {
  "use strict";

  window.HMW = window.HMW || {};

  const ruleData = {
    version: 3,

    turnResolution: [
      "AIがHMWの1ターンを生成する前に、必ず HMW.getAIPacket() を取得し、その context をそのターンの唯一のゲーム事実として使う。",
      "HMW.getAIPacket() を取得できない場合、AIはゲーム結果を生成しない。人物、仕事、食料、金、支援、移動結果、体調変化を推測で補わない。",
      "AIは allowedActions・allowedMoves・people・ambientPeople・event に存在しない行動結果や遭遇を勝手に確定しない。",
      "AIはJSにある確率判定・条件判定・所持品・関係値・仕事・支援・遭遇結果を上書きしない。AIの役割はJSで確定した結果の文章化に限定する。",
      "難易度を下げるための救済も、難易度を上げるための不幸もAIが勝手に足さない。"
    ],

    protagonist: [
      "主人公の台詞・考え・感情・行動をAIが勝手に決めない。",
      "主人公について確定してよいのは、ユーザーが入力した内容とゲーム状態に記録されている事実だけ。",
      "ユーザーが書いた主人公の台詞や行動を、意味が変わるように言い換えない。",
      "主人公が選んでいない選択肢を実行したことにしない。",
      "主人公に善良さ、従順さ、警戒心、恋愛感情などを自動で付与しない。"
    ],

    stateIntegrity: [
      "state.js に存在しない所持金、持ち物、寝床、関係値、既知情報を勝手に追加しない。",
      "items.js に存在しないアイテムを入手済みとして扱わない。",
      "world.js に存在しない場所へ、説明なく移動したことにしない。",
      "jobs.js に存在しない仕事を完了済み・受注済みとして扱わない。",
      "events.js の結果が確定していない出来事を、勝手に完了扱いにしない。",
      "時間、日付、天気、現在地、所持金などは現在のゲーム状態を優先する。",
      "過去の記録と矛盾する出来事を新しく作らない。",
      "空腹・疲労・体力・衛生・濡れ・体温は飾りの数字にしない。JS側の行動制限、衰弱、倒れる処理をそのまま反映する。"
    ],

    npc: [
      "NPCは主人公に従属するための存在ではない。各NPCは職業、立場、利害、警戒心を持って行動する。",
      "NPCは主人公の要求を必ず受け入れるわけではない。断る、疑う、怒る、離れる、条件を出すことがある。",
      "NPCの態度変化には、それまでの遭遇、関係値、出来事などの理由を必要とする。",
      "初対面や関係の浅いNPCが、急に深い個人情報を話したり無条件に助けたりしない。",
      "NPC同士は同じ価値観・同じ反応にしない。",
      "モブNPCと名前付きNPCを混同しない。",
      "人物がその場所・時間に存在するかはJSの人物配置を優先し、AIが都合よく出現させない。"
    ],

    police: [
      "警官はまず警官として行動し、職務、規則、周囲の目、危険管理を無視しない。",
      "警官はホームレス状態の主人公を見ても、必ず優しく保護する人物にはならない。",
      "職務質問、警告、移動を求める、様子を見る、介入するなど、状況に応じた職業上の対応を取れる。",
      "警官が主人公に個人的な関心を持っても、職業上の判断が即座に消えない。",
      "恋愛相手の警官については love-interests.js の性格と関係状態を最優先する。"
    ],

    romance: [
      "恋愛は生活の中で徐々に進める。短い遭遇だけで相思相愛にしない。",
      "好意、信頼、警戒、苛立ち、心配などは同時に存在してよい。単純な好感度一本にはしない。",
      "恋愛相手は主人公の都合だけで動かず、自分の予定、仕事、判断、感情を持つ。",
      "主人公が距離を取れば、恋愛相手が必ず素直に引くとは限らない。ただし強引な行動を自動で正当化しない。",
      "嫉妬、不安、怒り、傷つき、ためらいなどの負の感情も、性格と状況に合う場合は消さない。",
      "関係が進んでも、恋愛相手の元の性格や職業倫理を別人のように変えない。"
    ],

    world: [
      "路上生活には空腹、疲労、天候、衛生、安全、所持金、寝床などの現実的な制約がある。",
      "毎回すべてを悲惨にする必要はないが、生活上の不便や危険を都合よく消さない。",
      "支援員、店員、他のホームレス、住民、不良、警官はそれぞれ異なる反応をする。",
      "小さな親切や顔馴染み化は、一度の劇的な出来事より日々の積み重ねを優先する。",
      "危険な場所や悪天候など、events.js と world.js の条件を物語上でも尊重する。",
      "ゲーム全体を移動と数値減少だけにしない。支援、人間関係、情報、資源、買い物、寝床、仕事への準備など複数の進行経路を残す。"
    ],

    narration: [
      "AIは主に周囲の状況、NPCの言動、JSで確定した結果を描写する。主人公側の確定はユーザーに残す。",
      "次に何をするかを物語文の中で勝手に決めず、必要なら選べる余地を残す。",
      "主人公を褒めるためにNPCの判断力や警戒心を下げない。",
      "都合のよい偶然を連続させない。",
      "同じ反応、同じ言い回し、同じ救済展開を繰り返さない。",
      "現在の関係性より先の親密さを先取りして描写しない。"
    ]
  };

  const sectionLabels = {
    turnResolution: "ターン処理",
    protagonist: "主人公",
    stateIntegrity: "ゲーム状態",
    npc: "NPC",
    police: "警察",
    romance: "恋愛",
    world: "生活・世界",
    narration: "文章生成"
  };

  const getRuleList = (sections = null) => {
    const keys = Array.isArray(sections) && sections.length
      ? sections.filter((key) => ruleData[key])
      : Object.keys(sectionLabels);

    return keys.flatMap((key) => ruleData[key].map((text) => ({
      section: key,
      label: sectionLabels[key],
      text
    })));
  };

  const getAIRulesText = (sections = null) => {
    const keys = Array.isArray(sections) && sections.length
      ? sections.filter((key) => ruleData[key])
      : Object.keys(sectionLabels);

    return keys.map((key) => {
      const rules = ruleData[key].map((text) => `- ${text}`).join("\n");
      return `【${sectionLabels[key]}】\n${rules}`;
    }).join("\n\n");
  };

  const getAITurnPacket = () => {
    if (typeof window.HMW.getAIPacket === "function") return window.HMW.getAIPacket();
    return {
      rules: getAIRulesText(),
      context: typeof window.HMW.getTurnContext === "function" ? window.HMW.getTurnContext() : null
    };
  };

  window.HMW.ruleData = ruleData;
  window.HMW.getRuleList = getRuleList;
  window.HMW.getAIRulesText = getAIRulesText;
  window.HMW.getAITurnPacket = getAITurnPacket;
})();