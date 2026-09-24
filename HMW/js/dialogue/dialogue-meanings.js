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
    },
    EXPRESS_NEED_CLARITY: {
      category: "clarity",
      meaningJa: "曖昧なままにせず答えや説明が必要だと伝える"
    },
    DENY_ABANDONMENT: {
      category: "closeness",
      meaningJa: "相手を見捨てるつもりがないことを明確に伝える"
    },
    CONFIRM_CHOICE: {
      category: "commitment",
      meaningJa: "相手を自分が選んでいることを明確に伝える"
    },
    EXPRESS_CARE: {
      category: "care",
      meaningJa: "相手を大切に思い気にかけていることを伝える"
    },
    EXPRESS_RELIEF: {
      category: "positive",
      meaningJa: "安心した、ほっとした気持ちを伝える"
    },
    EXPRESS_CONFUSION: {
      category: "emotion",
      meaningJa: "状況や相手の言葉を理解しきれず混乱していると伝える"
    },
    EXPRESS_UNCERTAINTY: {
      category: "clarity",
      meaningJa: "自分の判断や先行きに確信がないことを伝える"
    },
    EXPRESS_CERTAINTY: {
      category: "clarity",
      meaningJa: "自分の判断や気持ちに確信があることを伝える"
    },
    ASK_FOR_TRUST: {
      category: "trust",
      meaningJa: "自分を信じてほしいと求める"
    },
    ASK_FOR_ANSWER: {
      category: "clarity",
      meaningJa: "相手に返答を求める"
    },
    RESPECT_BOUNDARY: {
      category: "boundary",
      meaningJa: "相手が示した境界を尊重すると伝える"
    },
    PROMISE_NOT_FOLLOW: {
      category: "boundary",
      meaningJa: "相手を追わないと明確に約束する"
    },
    PROMISE_NOT_TOUCH: {
      category: "boundary",
      meaningJa: "相手に触れないと明確に約束する"
    },
    PROMISE_NOT_KISS: {
      category: "boundary",
      meaningJa: "相手にキスしないと明確に約束する"
    },
    PROMISE_NOT_HUG: {
      category: "boundary",
      meaningJa: "相手を抱きしめないと明確に約束する"
    },
    PROMISE_NOT_CONTACT: {
      category: "boundary",
      meaningJa: "相手へ連絡しないと明確に約束する"
    },
    ASK_TO_REPAIR: {
      category: "repair",
      meaningJa: "関係をもう一度修復しようと提案する"
    },
    EXPRESS_REPAIR_DESIRE: {
      category: "repair",
      meaningJa: "壊れた関係や問題を直したい意思を伝える"
    },
    DECLINE_FOR_NOW: {
      category: "response",
      meaningJa: "今は受け入れられないと一時的に断る"
    },
    ASK_TO_SIT_TOGETHER: {
      category: "closeness",
      meaningJa: "一緒に座ってよいか尋ねる"
    },
    GREET: {
      category: "social",
      meaningJa: "相手へ挨拶する"
    },
    RETURN_GREETING: {
      category: "social",
      meaningJa: "相手の挨拶へ返す"
    },
    SAY_GOODBYE: {
      category: "parting",
      meaningJa: "別れの挨拶をする"
    },
    ASK_REASON: {
      category: "clarity",
      meaningJa: "理由を尋ねる"
    },
    ASK_WHERE: {
      category: "clarity",
      meaningJa: "場所を尋ねる"
    },
    ASK_WHEN: {
      category: "clarity",
      meaningJa: "時期や時刻を尋ねる"
    },
    ASK_ABOUT_HEALTH: {
      category: "care",
      meaningJa: "体調について尋ねる"
    },
    ASK_ABOUT_SLEEP: {
      category: "care",
      meaningJa: "睡眠について尋ねる"
    },
    ASK_ABOUT_FOOD: {
      category: "care",
      meaningJa: "食事を取ったか尋ねる"
    },
    ASK_ABOUT_HOME: {
      category: "daily",
      meaningJa: "帰宅や寝場所について尋ねる"
    },
    OFFER_REST: {
      category: "care",
      meaningJa: "休むことを提案する"
    },
    OFFER_WARMTH: {
      category: "care",
      meaningJa: "暖かい場所や暖を取ることを提案する"
    },
    OFFER_SHELTER: {
      category: "care",
      meaningJa: "雨風を避ける場所を提案する"
    },
    STATE_PLAN: {
      category: "daily",
      meaningJa: "自分のこれからの予定を伝える"
    },
    STATE_PREFERENCE: {
      category: "daily",
      meaningJa: "自分の好みや選好を伝える"
    },
    ACKNOWLEDGE_EVENT: {
      category: "response",
      meaningJa: "相手が話した出来事を受け止めたことを示す"
    },
    ASK_FOR_DETAILS: {
      category: "clarity",
      meaningJa: "出来事についてさらに詳しく尋ねる"
    },
    EXPRESS_SURPRISE: {
      category: "emotion",
      meaningJa: "驚きを伝える"
    },
    EXPRESS_SYMPATHY: {
      category: "care",
      meaningJa: "相手のつらい出来事に同情やいたわりを示す"
    },
    EXPRESS_APPROVAL: {
      category: "response",
      meaningJa: "相手の案や出来事へ肯定的な反応を示す"
    },
    EXPRESS_DISAPPROVAL: {
      category: "response",
      meaningJa: "相手の案や出来事へ否定的な反応を示す"
    },
    ASK_PLAN: {
      category: "daily",
      meaningJa: "相手のこれからの予定を尋ねる"
    },
    ASK_PREFERENCE: {
      category: "daily",
      meaningJa: "相手の好みや選好を尋ねる"
    },
    ASK_WORK_STATUS: {
      category: "daily",
      meaningJa: "仕事の状況について尋ねる"
    },
    ASK_MONEY_STATUS: {
      category: "daily",
      meaningJa: "お金や支払いの余裕について尋ねる"
    },
    ASK_HUNGER: {
      category: "care",
      meaningJa: "空腹かどうか尋ねる"
    },
    ASK_THIRST: {
      category: "care",
      meaningJa: "喉が渇いているか尋ねる"
    },
    ASK_TIREDNESS: {
      category: "care",
      meaningJa: "疲れているか尋ねる"
    },
    OFFER_COMPANY: {
      category: "closeness",
      meaningJa: "一緒にいることを申し出る"
    },
    OFFER_CONTACT: {
      category: "contact",
      meaningJa: "あとで連絡することを申し出る"
    },
    REQUEST_CONTACT: {
      category: "contact",
      meaningJa: "相手に連絡してほしいと求める"
    },
    ACCEPT_CONTACT: {
      category: "contact",
      meaningJa: "連絡を続けることに同意する"
    },
    DECLINE_CONTACT: {
      category: "contact",
      meaningJa: "連絡を取ることを断る"
    },
    ASK_PERMISSION_ENTER: {
      category: "boundary",
      meaningJa: "中へ入ってよいか確認する"
    },
    ASK_PERMISSION_WAIT: {
      category: "boundary",
      meaningJa: "ここで待ってよいか確認する"
    },
    EXPRESS_DISAPPOINTMENT: {
      category: "emotion",
      meaningJa: "落胆していることを伝える"
    },
    EXPRESS_HOPE: {
      category: "emotion",
      meaningJa: "希望を持っていることを伝える"
    },
    EXPRESS_PRIDE: {
      category: "positive",
      meaningJa: "相手を誇りに思っていることを伝える"
    },
    CONFIRM_ARRIVAL: {
      category: "movement",
      meaningJa: "到着したことを伝える"
    },
    CONFIRM_DEPARTURE: {
      category: "movement",
      meaningJa: "これから出発することを伝える"
    },
    ASK_RETURN_TIME: {
      category: "parting",
      meaningJa: "いつ戻るのか尋ねる"
    },
    STATE_CURRENT_LOCATION: {
      category: "answer",
      meaningJa: "自分の現在地を答える"
    },
    STATE_AVAILABLE_TIME: {
      category: "answer",
      meaningJa: "自分が対応できる時間を答える"
    },
    STATE_CONDITION: {
      category: "answer",
      meaningJa: "自分の現在の体調や状態を答える"
    },
    CONFIRM_POSSESSION: {
      category: "answer",
      meaningJa: "尋ねられた物を持っていると答える"
    },
    DENY_POSSESSION: {
      category: "answer",
      meaningJa: "尋ねられた物を持っていないと答える"
    },
    STATE_QUANTITY: {
      category: "answer",
      meaningJa: "尋ねられた物の数量を答える"
    },
    CONFIRM_CAPABILITY: {
      category: "answer",
      meaningJa: "尋ねられた行動ができると答える"
    },
    DENY_CAPABILITY: {
      category: "answer",
      meaningJa: "尋ねられた行動ができないと答える"
    },
    STATE_CURRENT_PLAN: {
      category: "answer",
      meaningJa: "自分の予定を答える"
    },
    STATE_CURRENT_PREFERENCE: {
      category: "answer",
      meaningJa: "自分の好みを答える"
    },
    CONFIRM_AVAILABLE: {
      category: "answer",
      meaningJa: "対応可能であると答える"
    },
    DENY_AVAILABLE: {
      category: "answer",
      meaningJa: "対応できないと答える"
    },
    ANSWER_UNKNOWN: {
      category: "answer",
      meaningJa: "答えを知らない、または事実が未設定だと伝える"
    },
    STATE_RETURN_TIME: {
      category: "answer",
      meaningJa: "戻る予定時刻を答える"
    },
    STATE_WORK_STATUS: {
      category: "answer",
      meaningJa: "自分の仕事の状況を答える"
    },
    STATE_MONEY_STATUS: {
      category: "answer",
      meaningJa: "自分のお金の状況を答える"
    },
    STATE_NO_MONEY: {
      category: "answer",
      meaningJa: "十分なお金がないと答える"
    },
    STATE_SLEEP_STATUS_GOOD: {
      category: "answer",
      meaningJa: "よく眠れたと答える"
    },
    STATE_SLEEP_STATUS_BAD: {
      category: "answer",
      meaningJa: "よく眠れなかったと答える"
    },
    STATE_FOOD_STATUS_EATEN: {
      category: "answer",
      meaningJa: "すでに食事をしたと答える"
    },
    STATE_FOOD_STATUS_NOT_EATEN: {
      category: "answer",
      meaningJa: "まだ食事をしていないと答える"
    },
    STATE_HOME: {
      category: "answer",
      meaningJa: "自分の家や寝場所を答える"
    },
    STATE_IDENTITY_NAME: {
      category: "answer",
      meaningJa: "自分の名前を答える"
    },
    STATE_IDENTITY_ROLE: {
      category: "answer",
      meaningJa: "自分の職業や役割を答える"
    },
    STATE_ORIGIN: {
      category: "answer",
      meaningJa: "自分の出身地を答える"
    },
    STATE_DESTINATION: {
      category: "answer",
      meaningJa: "自分の目的地を答える"
    },
    STATE_REASON: {
      category: "answer",
      meaningJa: "自分の理由を答える"
    },
    STATE_OPINION: {
      category: "answer",
      meaningJa: "自分の意見を答える"
    },
    STATE_PRICE: {
      category: "answer",
      meaningJa: "値段を答える"
    },
    STATE_COUNT: {
      category: "answer",
      meaningJa: "数量を答える"
    },
    STATE_WORK_LOCATION: {
      category: "answer",
      meaningJa: "自分の勤務場所を答える"
    },
    STATE_JOB_ROLE: {
      category: "answer",
      meaningJa: "自分の仕事の種類を答える"
    },
    CONFIRM_KNOWLEDGE: {
      category: "answer",
      meaningJa: "尋ねられたことを知っていると答える"
    },
    DENY_KNOWLEDGE: {
      category: "answer",
      meaningJa: "尋ねられたことを知らないと答える"
    },
    CONFIRM_FACT: {
      category: "answer",
      meaningJa: "尋ねられた事実が正しいと答える"
    },
    DENY_FACT: {
      category: "answer",
      meaningJa: "尋ねられた事実が正しくないと答える"
    }
  };
})();
