(() => {
 "use strict";
 window.HMW=window.HMW||{}; HMW.Dialogue=HMW.Dialogue||{};
 HMW.Dialogue.SENTENCE_PATTERNS=Object.assign(HMW.Dialogue.SENTENCE_PATTERNS||{},{
  "STATE_BE_LOCATION": {
    "tokens": [
      "{SUBJECT}",
      "{BE}",
      "{LOCATION}"
    ],
    "slots": [
      "SUBJECT",
      "BE",
      "LOCATION"
    ]
  },
  "STATE_BE_TIME": {
    "tokens": [
      "{SUBJECT}",
      "{BE}",
      "{TIME}"
    ],
    "slots": [
      "SUBJECT",
      "BE",
      "TIME"
    ]
  },
  "STATE_BE_CONDITION": {
    "tokens": [
      "{SUBJECT}",
      "{BE}",
      "{ADJECTIVE}"
    ],
    "slots": [
      "SUBJECT",
      "BE",
      "ADJECTIVE"
    ]
  },
  "STATE_BE_AVAILABLE_TIME": {
    "tokens": [
      "{SUBJECT}",
      "{BE}",
      "{AVAILABILITY}",
      "{TIME?}"
    ],
    "slots": [
      "SUBJECT",
      "BE",
      "AVAILABILITY",
      "TIME?"
    ]
  },
  "STATE_HAVE_OBJECT": {
    "tokens": [
      "{SUBJECT}",
      "have",
      "{OBJECT}"
    ],
    "slots": [
      "SUBJECT",
      "OBJECT"
    ]
  },
  "STATE_NOT_HAVE_OBJECT": {
    "tokens": [
      "{SUBJECT}",
      "do not have",
      "{OBJECT}"
    ],
    "slots": [
      "SUBJECT",
      "OBJECT"
    ]
  },
  "STATE_HAVE_QUANTITY": {
    "tokens": [
      "{SUBJECT}",
      "have",
      "{QUANTITY}",
      "{OBJECT}"
    ],
    "slots": [
      "SUBJECT",
      "QUANTITY",
      "OBJECT"
    ]
  },
  "STATE_CAN_ACTION": {
    "tokens": [
      "{SUBJECT}",
      "can",
      "{VERB_BASE}",
      "{OBJECT?}"
    ],
    "slots": [
      "SUBJECT",
      "VERB_BASE",
      "OBJECT?"
    ]
  },
  "STATE_CANNOT_ACTION": {
    "tokens": [
      "{SUBJECT}",
      "cannot",
      "{VERB_BASE}",
      "{OBJECT?}"
    ],
    "slots": [
      "SUBJECT",
      "VERB_BASE",
      "OBJECT?"
    ]
  },
  "STATE_PLAN_ACTION": {
    "tokens": [
      "{SUBJECT}",
      "will",
      "{VERB_BASE}",
      "{OBJECT?}",
      "{TIME?}"
    ],
    "slots": [
      "SUBJECT",
      "VERB_BASE",
      "OBJECT?",
      "TIME?"
    ]
  },
  "STATE_PREFERENCE_OBJECT": {
    "tokens": [
      "{SUBJECT}",
      "prefer",
      "{OBJECT}"
    ],
    "slots": [
      "SUBJECT",
      "OBJECT"
    ]
  },
  "STATE_RETURN_TIME": {
    "tokens": [
      "{SUBJECT}",
      "will",
      "return",
      "{TIME}"
    ],
    "slots": [
      "SUBJECT",
      "TIME"
    ]
  },
  "STATE_WORK": {
    "tokens": [
      "Work",
      "{BE}",
      "{ADJECTIVE}"
    ],
    "slots": [
      "BE",
      "ADJECTIVE"
    ]
  },
  "STATE_MONEY_HAVE": {
    "tokens": [
      "{SUBJECT}",
      "have",
      "{AMOUNT}"
    ],
    "slots": [
      "SUBJECT",
      "AMOUNT"
    ]
  },
  "STATE_MONEY_NONE": {
    "tokens": [
      "{SUBJECT}",
      "do not have enough money"
    ],
    "slots": [
      "SUBJECT"
    ]
  },
  "STATE_SLEEP_WELL": {
    "tokens": [
      "{SUBJECT}",
      "slept",
      "well"
    ],
    "slots": [
      "SUBJECT"
    ]
  },
  "STATE_SLEEP_BADLY": {
    "tokens": [
      "{SUBJECT}",
      "did not sleep well"
    ],
    "slots": [
      "SUBJECT"
    ]
  },
  "STATE_ATE_ALREADY": {
    "tokens": [
      "{SUBJECT}",
      "already ate"
    ],
    "slots": [
      "SUBJECT"
    ]
  },
  "STATE_NOT_EATEN": {
    "tokens": [
      "{SUBJECT}",
      "have not eaten yet"
    ],
    "slots": [
      "SUBJECT"
    ]
  },
  "STATE_HOME_LOCATION": {
    "tokens": [
      "{SUBJECT}",
      "stay",
      "{LOCATION}"
    ],
    "slots": [
      "SUBJECT",
      "LOCATION"
    ]
  }
});
})();