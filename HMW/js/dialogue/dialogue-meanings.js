(() => {
  "use strict";

  window.HMW = window.HMW || {};
  HMW.Dialogue = HMW.Dialogue || {};

  HMW.Dialogue.MEANINGS = {
    AFFIRM_LOVE: {
      category: "affection",
      meaningJa: "相手への恋愛感情を明確に肯定する"
    },
    DENY_LOVE: {
      category: "affection",
      meaningJa: "相手への恋愛感情がないことを明確に伝える"
    },
    ASK_AFFECTION_REASON: {
      category: "affection",
      meaningJa: "なぜ愛されていないと思ったのか尋ねる"
    },
    DENY_BETRAYAL: {
      category: "trust",
      meaningJa: "裏切る意思がないことを明確に伝える"
    },
    ADMIT_BETRAYAL: {
      category: "trust",
      meaningJa: "裏切った、または裏切る意思があることを認める"
    },
    PROMISE_LOYALTY: {
      category: "trust",
      meaningJa: "関係を守る意思を約束する"
    },
    ACCEPT_DISTANCE: {
      category: "distance",
      meaningJa: "距離を置いてほしいという要求を受け入れる"
    },
    REFUSE_DISTANCE: {
      category: "distance",
      meaningJa: "距離を置くことを拒む"
    },
    ASK_DISTANCE_REASON: {
      category: "distance",
      meaningJa: "なぜ距離を置いてほしいのか理由を尋ねる"
    },
    TEMPORARY_STEP_BACK: {
      category: "distance",
      meaningJa: "今はいったん距離を取るが、関係そのものは放棄しない"
    },
    EXPRESS_CONCERN: {
      category: "care",
      meaningJa: "相手を心配していることを伝える"
    },
    EXPRESS_FEAR_OF_LOSS: {
      category: "care",
      meaningJa: "相手を失うことへの恐れを伝える"
    },
    REJECT_DEATH_WISH_CLAIM: {
      category: "care",
      meaningJa: "相手の死を望んでいるという疑いを否定する"
    },
    ASK_WHAT_HAPPENED: {
      category: "clarity",
      meaningJa: "何があったのか尋ねる"
    },
    ASK_FOR_HONEST_ANSWER: {
      category: "clarity",
      meaningJa: "率直に話してほしいと求める"
    },
    REQUEST_STAY: {
      category: "closeness",
      meaningJa: "相手にここにいてほしいと求める"
    }
  };
})();
