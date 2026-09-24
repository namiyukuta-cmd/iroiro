(() => {
  "use strict";
  window.HMW=window.HMW||{};
  HMW.Dialogue=HMW.Dialogue||{};
  HMW.Dialogue.MEANING_PATTERN_MAP=Object.assign(
    HMW.Dialogue.MEANING_PATTERN_MAP||{},
    {
  "GRANT_PERMISSION": [
    {
      "surfaceOverride": "Yes, you can.",
      "weight": 5
    },
    {
      "surfaceOverride": "Yes, that is fine.",
      "weight": 3
    }
  ],
  "DENY_PERMISSION": [
    {
      "surfaceOverride": "No, please do not.",
      "weight": 5
    },
    {
      "surfaceOverride": "No, not right now.",
      "weight": 3
    }
  ],
  "ACCEPT_ACTION_REQUEST": [
    {
      "surfaceOverride": "Yes, I will.",
      "weight": 5
    },
    {
      "surfaceOverride": "I can do that.",
      "weight": 3
    }
  ],
  "DECLINE_ACTION_REQUEST": [
    {
      "surfaceOverride": "No, I will not.",
      "weight": 5
    },
    {
      "surfaceOverride": "I cannot do that.",
      "weight": 3
    }
  ],
  "ACCEPT_INVITATION": [
    {
      "surfaceOverride": "Yes, I would like that.",
      "weight": 5
    }
  ],
  "DECLINE_INVITATION": [
    {
      "surfaceOverride": "No, thank you.",
      "weight": 4
    },
    {
      "surfaceOverride": "Maybe another time.",
      "weight": 3
    }
  ],
  "ACCEPT_SUGGESTION": [
    {
      "surfaceOverride": "That sounds good to me.",
      "weight": 5
    },
    {
      "surfaceOverride": "I agree with that plan.",
      "weight": 3
    }
  ],
  "DECLINE_SUGGESTION": [
    {
      "surfaceOverride": "I do not think we should.",
      "weight": 5
    },
    {
      "surfaceOverride": "I do not agree with that plan.",
      "weight": 3
    }
  ]
}
  );
})();