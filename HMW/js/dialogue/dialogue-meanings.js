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
    },
    APOLOGIZE: {
      category: "repair",
      meaningJa: "自分の行為について謝る"
    },
    ACCEPT_APOLOGY: {
      category: "repair",
      meaningJa: "相手の謝罪を受け入れる"
    },
    EXPRESS_HURT: {
      category: "emotion",
      meaningJa: "相手の言動で傷ついたことを伝える"
    },
    EXPRESS_ANGER: {
      category: "emotion",
      meaningJa: "現在怒っていることを明確に伝える"
    },
    REASSURE_NOT_LEAVING: {
      category: "closeness",
      meaningJa: "相手を見捨てて去るつもりがないと伝える"
    },
    ASK_TO_TALK: {
      category: "clarity",
      meaningJa: "会話を続けて話し合いたいと求める"
    },
    REQUEST_TIME: {
      category: "distance",
      meaningJa: "考えたり落ち着いたりするための時間を求める"
    },
    SAY_GOODBYE_TEMPORARY: {
      category: "parting",
      meaningJa: "関係を終わらせず、一時的な別れを告げる"
    },
    PROMISE_RETURN: {
      category: "parting",
      meaningJa: "あとで戻る、また会う意思を伝える"
    },
    ASK_NOT_TO_DISAPPEAR: {
      category: "closeness",
      meaningJa: "何も言わずにいなくならないでほしいと求める"
    }
  };
})();
