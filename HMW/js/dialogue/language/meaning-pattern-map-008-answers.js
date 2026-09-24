(() => {
  "use strict";
  window.HMW=window.HMW||{}; HMW.Dialogue=HMW.Dialogue||{};
  HMW.Dialogue.MEANING_PATTERN_MAP=Object.assign(HMW.Dialogue.MEANING_PATTERN_MAP||{},{
    STATE_DESIRE:[
      {pattern:"ANSWER_WANT_OBJECT",slots:{OBJECT:"that"},weight:5}
    ],
    STATE_NEED:[
      {pattern:"ANSWER_NEED_OBJECT",slots:{OBJECT:"that"},weight:5}
    ],
    STATE_CHOICE:[
      {pattern:"ANSWER_CHOICE",slots:{OBJECT:"this"},weight:5}
    ],
    STATE_EVENT:[
      {pattern:"ANSWER_EVENT",slots:{CLAUSE:"Something happened"},weight:5}
    ]
  });
})();