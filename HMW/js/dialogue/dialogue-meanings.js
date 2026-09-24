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
    },
    EXPRESS_GRATITUDE: {
      category: "positive",
      meaningJa: "相手への感謝を伝える"
    },
    REASSURE_SAFETY: {
      category: "care",
      meaningJa: "今は安全だ、または危害を加えないと安心させる"
    },
    EXPRESS_MISSING: {
      category: "closeness",
      meaningJa: "会えなかった間に相手を恋しく思っていたと伝える"
    },
    ASK_TO_MEET: {
      category: "closeness",
      meaningJa: "また会いたい、会う時間を作りたいと求める"
    },
    EXPRESS_JEALOUSY: {
      category: "emotion",
      meaningJa: "嫉妬していることを伝える"
    },
    ASK_ABOUT_OTHER_PERSON: {
      category: "clarity",
      meaningJa: "話題に出た別の人物について尋ねる"
    },
    AGREE_REQUEST: {
      category: "response",
      meaningJa: "相手の依頼や提案を受け入れる"
    },
    DECLINE_REQUEST: {
      category: "response",
      meaningJa: "相手の依頼や提案を断る"
    },
    CONFIRM_TRUST: {
      category: "trust",
      meaningJa: "相手を信じていることを伝える"
    },
    ASK_IF_OKAY: {
      category: "care",
      meaningJa: "相手が大丈夫か確認する"
    },
    EXPRESS_JOY: {
      category: "positive",
      meaningJa: "嬉しい気持ちを伝える"
    },
    EXPRESS_LONELINESS: {
      category: "emotion",
      meaningJa: "寂しさを伝える"
    },
    EXPRESS_ANXIETY: {
      category: "emotion",
      meaningJa: "不安を感じていることを伝える"
    },
    ASK_RELATIONSHIP_STATUS: {
      category: "clarity",
      meaningJa: "二人の関係をどう考えているか確認する"
    },
    ASK_FEELINGS: {
      category: "clarity",
      meaningJa: "相手が自分をどう思っているか尋ねる"
    },
    EXPRESS_WANT_TO_BE_TOGETHER: {
      category: "closeness",
      meaningJa: "相手と一緒にいたい気持ちを伝える"
    },
    ASK_TO_STAY_CLOSE: {
      category: "closeness",
      meaningJa: "近くにいてほしいと求める"
    },
    ASK_PERMISSION_TOUCH: {
      category: "physical",
      meaningJa: "相手に触れてよいか確認する"
    },
    ASK_PERMISSION_HUG: {
      category: "physical",
      meaningJa: "抱きしめてよいか確認する"
    },
    ASK_PERMISSION_KISS: {
      category: "physical",
      meaningJa: "キスしてよいか確認する"
    },
    EXPRESS_TIRED: {
      category: "condition",
      meaningJa: "疲れていることを伝える"
    },
    EXPRESS_HUNGRY: {
      category: "condition",
      meaningJa: "空腹であることを伝える"
    },
    EXPRESS_COLD: {
      category: "condition",
      meaningJa: "寒さを感じていることを伝える"
    },
    OFFER_HELP: {
      category: "care",
      meaningJa: "相手を助けることを申し出る"
    },
    ASK_FOR_HELP: {
      category: "request",
      meaningJa: "相手に助けを求める"
    },
    OFFER_FOOD: {
      category: "care",
      meaningJa: "食べ物を差し出す、または食事を勧める"
    },
    OFFER_DRINK: {
      category: "care",
      meaningJa: "飲み物を差し出す、または飲むことを勧める"
    },
    ASK_TO_WAIT: {
      category: "request",
      meaningJa: "少し待ってほしいと求める"
    },
    ASK_TO_GO_TOGETHER: {
      category: "closeness",
      meaningJa: "一緒に行こうと誘う"
    },
    ASK_DESTINATION: {
      category: "clarity",
      meaningJa: "相手がどこへ行くのか尋ねる"
    },
    EXPRESS_SLEEPY: {
      category: "condition",
      meaningJa: "眠いことを伝える"
    },
    ASK_TO_REST: {
      category: "request",
      meaningJa: "少し休もうと提案する"
    },
    ASK_ABOUT_WORK: {
      category: "daily",
      meaningJa: "仕事について尋ねる"
    },
    EXPRESS_WORK_TIREDNESS: {
      category: "daily",
      meaningJa: "仕事で疲れたことを伝える"
    },
    ASK_ABOUT_MONEY: {
      category: "daily",
      meaningJa: "お金や支払いについて尋ねる"
    },
    EXPRESS_NO_MONEY: {
      category: "daily",
      meaningJa: "お金がないことを伝える"
    },
    COMMENT_RAIN: {
      category: "environment",
      meaningJa: "雨について話す"
    },
    COMMENT_COLD_WEATHER: {
      category: "environment",
      meaningJa: "寒い天気について話す"
    },
    SAY_GOING_HOME: {
      category: "parting",
      meaningJa: "家や寝場所へ帰ることを伝える"
    },
    ASK_IF_COMING_BACK: {
      category: "parting",
      meaningJa: "また戻ってくるか尋ねる"
    }
  };
})();
