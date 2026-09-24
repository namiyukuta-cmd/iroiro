(() => {
  "use strict";
  window.HMW=window.HMW||{};
  HMW.Dialogue=HMW.Dialogue||{};
  HMW.Dialogue.SENTENCE_PATTERNS=Object.assign(
    HMW.Dialogue.SENTENCE_PATTERNS||{},
    {
  "PERMISSION_CAN_I": {
    "tokens": [
      "Can",
      "I",
      "{VERB_BASE}",
      "{OBJECT?}?"
    ],
    "slots": [
      "VERB_BASE",
      "OBJECT?"
    ]
  },
  "PERMISSION_MAY_I": {
    "tokens": [
      "May",
      "I",
      "{VERB_BASE}",
      "{OBJECT?}?"
    ],
    "slots": [
      "VERB_BASE",
      "OBJECT?"
    ]
  },
  "PERMISSION_GRANT_CAN": {
    "tokens": [
      "Yes,",
      "you can",
      "{VERB_BASE}",
      "{OBJECT?}"
    ],
    "slots": [
      "VERB_BASE",
      "OBJECT?"
    ]
  },
  "PERMISSION_DENY_CANNOT": {
    "tokens": [
      "No,",
      "you cannot",
      "{VERB_BASE}",
      "{OBJECT?}"
    ],
    "slots": [
      "VERB_BASE",
      "OBJECT?"
    ]
  },
  "PERMISSION_DENY_PLEASE_DONT": {
    "tokens": [
      "No,",
      "please do not",
      "{VERB_BASE}",
      "{OBJECT?}"
    ],
    "slots": [
      "VERB_BASE",
      "OBJECT?"
    ]
  },
  "REQUEST_WILL_YOU": {
    "tokens": [
      "Will",
      "you",
      "{VERB_BASE}",
      "{OBJECT?}?"
    ],
    "slots": [
      "VERB_BASE",
      "OBJECT?"
    ]
  },
  "REQUEST_WOULD_YOU_PLEASE": {
    "tokens": [
      "Would",
      "you please",
      "{VERB_BASE}",
      "{OBJECT?}?"
    ],
    "slots": [
      "VERB_BASE",
      "OBJECT?"
    ]
  },
  "REQUEST_ACCEPT_WILL": {
    "tokens": [
      "Yes,",
      "I will",
      "{VERB_BASE}",
      "{OBJECT?}"
    ],
    "slots": [
      "VERB_BASE",
      "OBJECT?"
    ]
  },
  "REQUEST_ACCEPT_CAN": {
    "tokens": [
      "I can",
      "{VERB_BASE}",
      "{OBJECT?}"
    ],
    "slots": [
      "VERB_BASE",
      "OBJECT?"
    ]
  },
  "REQUEST_DECLINE_WONT": {
    "tokens": [
      "No,",
      "I will not",
      "{VERB_BASE}",
      "{OBJECT?}"
    ],
    "slots": [
      "VERB_BASE",
      "OBJECT?"
    ]
  },
  "REQUEST_DECLINE_CANNOT": {
    "tokens": [
      "I cannot",
      "{VERB_BASE}",
      "{OBJECT?}"
    ],
    "slots": [
      "VERB_BASE",
      "OBJECT?"
    ]
  },
  "INVITE_DO_YOU_WANT_TO": {
    "tokens": [
      "Do",
      "you want to",
      "{VERB_BASE}",
      "{OBJECT?}?"
    ],
    "slots": [
      "VERB_BASE",
      "OBJECT?"
    ]
  },
  "INVITE_WOULD_YOU_LIKE_TO": {
    "tokens": [
      "Would",
      "you like to",
      "{VERB_BASE}",
      "{OBJECT?}?"
    ],
    "slots": [
      "VERB_BASE",
      "OBJECT?"
    ]
  },
  "INVITE_ACCEPT": {
    "tokens": [
      "Yes,",
      "I would like to",
      "{VERB_BASE}",
      "{OBJECT?}"
    ],
    "slots": [
      "VERB_BASE",
      "OBJECT?"
    ]
  },
  "INVITE_DECLINE": {
    "tokens": [
      "No,",
      "thank you"
    ],
    "slots": []
  },
  "INVITE_DECLINE_LATER": {
    "tokens": [
      "Maybe another time"
    ],
    "slots": []
  },
  "SUGGEST_LETS_ACTION": {
    "tokens": [
      "Let us",
      "{VERB_BASE}",
      "{OBJECT?}"
    ],
    "slots": [
      "VERB_BASE",
      "OBJECT?"
    ]
  },
  "SUGGEST_SHOULD_WE": {
    "tokens": [
      "Should",
      "we",
      "{VERB_BASE}",
      "{OBJECT?}?"
    ],
    "slots": [
      "VERB_BASE",
      "OBJECT?"
    ]
  },
  "SUGGEST_ACCEPT": {
    "tokens": [
      "Yes,",
      "let us",
      "{VERB_BASE}",
      "{OBJECT?}"
    ],
    "slots": [
      "VERB_BASE",
      "OBJECT?"
    ]
  },
  "SUGGEST_ACCEPT_SOUND": {
    "tokens": [
      "That sounds good"
    ],
    "slots": []
  },
  "SUGGEST_DECLINE": {
    "tokens": [
      "I do not think we should",
      "{VERB_BASE}",
      "{OBJECT?}"
    ],
    "slots": [
      "VERB_BASE",
      "OBJECT?"
    ]
  },
  "SUGGEST_DECLINE_NO": {
    "tokens": [
      "No,",
      "I would rather not"
    ],
    "slots": []
  },
  "REQUEST_PLEASE_ACTION": {
    "tokens": [
      "Please",
      "{VERB_BASE}",
      "{OBJECT?}"
    ],
    "slots": [
      "VERB_BASE",
      "OBJECT?"
    ]
  },
  "REQUEST_DONT_ACTION": {
    "tokens": [
      "Please do not",
      "{VERB_BASE}",
      "{OBJECT?}"
    ],
    "slots": [
      "VERB_BASE",
      "OBJECT?"
    ]
  },
  "ANSWER_YES_SIMPLE": {
    "tokens": [
      "Yes"
    ],
    "slots": []
  },
  "ANSWER_NO_SIMPLE": {
    "tokens": [
      "No"
    ],
    "slots": []
  },
  "ANSWER_NOT_NOW": {
    "tokens": [
      "Not right now"
    ],
    "slots": []
  },
  "ANSWER_MAYBE_LATER": {
    "tokens": [
      "Maybe later"
    ],
    "slots": []
  },
  "ASK_IF_OKAY_TO": {
    "tokens": [
      "Is it okay if I",
      "{VERB_BASE}",
      "{OBJECT?}?"
    ],
    "slots": [
      "VERB_BASE",
      "OBJECT?"
    ]
  },
  "ASK_DO_YOU_MIND_IF": {
    "tokens": [
      "Do you mind if I",
      "{VERB_BASE}",
      "{OBJECT?}?"
    ],
    "slots": [
      "VERB_BASE",
      "OBJECT?"
    ]
  },
  "ASK_WOULD_IT_BE_OKAY": {
    "tokens": [
      "Would it be okay if I",
      "{VERB_BASE}",
      "{OBJECT?}?"
    ],
    "slots": [
      "VERB_BASE",
      "OBJECT?"
    ]
  },
  "OFFER_SHALL_I_ACTION": {
    "tokens": [
      "Shall I",
      "{VERB_BASE}",
      "{OBJECT?}?"
    ],
    "slots": [
      "VERB_BASE",
      "OBJECT?"
    ]
  },
  "OFFER_WOULD_YOU_LIKE_ME_TO": {
    "tokens": [
      "Would you like me to",
      "{VERB_BASE}",
      "{OBJECT?}?"
    ],
    "slots": [
      "VERB_BASE",
      "OBJECT?"
    ]
  },
  "OFFER_ACCEPT": {
    "tokens": [
      "Yes,",
      "please"
    ],
    "slots": []
  },
  "OFFER_DECLINE": {
    "tokens": [
      "No,",
      "thank you"
    ],
    "slots": []
  }
}
  );
})();