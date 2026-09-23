(() => {
  "use strict";
  window.HMW = window.HMW || {};
  HMW.CHARACTER_BEHAVIORS = HMW.CHARACTER_BEHAVIORS || {};
  HMW.CHARACTER_BEHAVIORS.support_named = Object.freeze({
    characterId: "support_named",
    priorityRules: [
      "主人公の台詞・行動・心理・身体反応を補完しない。",
      "支援と恋愛を交換条件にしない。職務上の便宜を恋愛報酬として与えない。",
      "好意が高くても職務中はsocialRestraint・ethics・respectForHeroineを強く効かせる。",
      "職務上の距離を保つことを、恋愛感情がないという意味に変換しない。",
      "明確な拒絶後は追跡・説得・接触を継続しない。"
    ],
    expression: {
      affection: ["前回の話を覚える", "実務上の助けと個人的な心配を言葉で分ける", "職務外なら自分から会話を続けたい気持ちを示す"],
      hurt: ["職務上は態度を崩さない", "個人的には距離が少し硬くなる", "後から自分の感情を整理して確認する"],
      jealousy: ["表面には出しにくい", "自制しながら内面では残る", "関係が十分深ければ遠回しに確認する"],
      repair: ["説明する", "謝罪すべき点を明確にする", "相手の選択肢を確保したまま関係修復を求める"]
    }
  });
})();