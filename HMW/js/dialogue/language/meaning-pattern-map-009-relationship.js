(() => {
  "use strict";
  window.HMW=window.HMW||{}; HMW.Dialogue=HMW.Dialogue||{};
  HMW.Dialogue.MEANING_PATTERN_MAP=Object.assign(HMW.Dialogue.MEANING_PATTERN_MAP||{},{
    STATE_RELATIONSHIP_STATUS:[
      {surfaceOverride:"We are {RELATIONSHIP}.",weight:5}
    ],
    STATE_FEELINGS_TOWARD_HEROINE:[
      {surfaceOverride:"I feel {FEELING} about you.",weight:5}
    ]
  });
})();