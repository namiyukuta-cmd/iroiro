(() => {
  "use strict";
  window.HMW=window.HMW||{}; HMW.Dialogue=HMW.Dialogue||{};
  HMW.Dialogue.MEANING_PATTERN_MAP=Object.assign(HMW.Dialogue.MEANING_PATTERN_MAP||{},{
    STATE_RELATIONSHIP_STATUS:[
      {pattern:"RELATIONSHIP_STATUS",slots:{RELATIONSHIP:"close"},weight:5}
    ],
    STATE_FEELINGS_TOWARD_HEROINE:[
      {pattern:"FEELINGS_TOWARD_HEROINE",slots:{FEELING:"affection"},weight:5}
    ]
  });
})();