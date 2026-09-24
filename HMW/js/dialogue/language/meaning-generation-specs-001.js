(() => {
  "use strict";
  window.HMW = window.HMW || {};
  HMW.Dialogue = HMW.Dialogue || {};
  HMW.Dialogue.GENERATION_SPECS = Object.assign(HMW.Dialogue.GENERATION_SPECS || {}, {
  "AFFIRM_LOVE": {
    "category": "affection",
    "candidates": [
      {
        "pattern": "PRESENT_SIMPLE_SVO",
        "subject": "I",
        "verbs": [
          "love"
        ],
        "object": "you",
        "weight": 6
      },
      {
        "pattern": "PRESENT_SIMPLE_SVO",
        "subject": "I",
        "verbs": [
          "adore"
        ],
        "object": "you",
        "weight": 2
      }
    ]
  },
  "DENY_LOVE": {
    "category": "affection",
    "candidates": [
      {
        "pattern": "PRESENT_SIMPLE_NEG",
        "subject": "I",
        "verbs": [
          "love"
        ],
        "object": "you",
        "weight": 6
      }
    ]
  },
  "CONFIRM_TRUST": {
    "category": "trust",
    "candidates": [
      {
        "pattern": "PRESENT_SIMPLE_SVO",
        "subject": "I",
        "verbs": [
          "trust",
          "believe"
        ],
        "object": "you",
        "weight": 5
      }
    ]
  },
  "DENY_BETRAYAL": {
    "category": "trust",
    "candidates": [
      {
        "pattern": "FUTURE_NEG",
        "subject": "I",
        "verbs": [
          "betray"
        ],
        "object": "you",
        "weight": 6
      }
    ]
  },
  "PROMISE_LOYALTY": {
    "category": "trust",
    "candidates": [
      {
        "pattern": "FUTURE_SIMPLE",
        "subject": "I",
        "verbs": [
          "stay"
        ],
        "object": "loyal to you",
        "weight": 5
      }
    ]
  },
  "DENY_ABANDONMENT": {
    "category": "closeness",
    "candidates": [
      {
        "pattern": "FUTURE_NEG",
        "subject": "I",
        "verbs": [
          "leave",
          "abandon"
        ],
        "object": "you",
        "weight": 5
      }
    ]
  },
  "EXPRESS_CARE": {
    "category": "care",
    "candidates": [
      {
        "pattern": "PRESENT_SIMPLE_SVO",
        "subject": "I",
        "verbs": [
          "care"
        ],
        "object": "about you",
        "weight": 5
      },
      {
        "pattern": "PRESENT_SIMPLE_SVO",
        "subject": "You",
        "verbs": [
          "matter"
        ],
        "object": "to me",
        "weight": 3
      }
    ]
  },
  "EXPRESS_CONCERN": {
    "category": "care",
    "candidates": [
      {
        "pattern": "FEEL_ADJECTIVE",
        "subject": "I",
        "adjectives": [
          "worried",
          "anxious"
        ],
        "weight": 5
      }
    ]
  },
  "EXPRESS_HURT": {
    "category": "emotion",
    "candidates": [
      {
        "pattern": "PAST_SIMPLE_SVO",
        "subject": "That",
        "verbs": [
          "hurt"
        ],
        "object": "me",
        "weight": 5
      }
    ]
  },
  "EXPRESS_ANGER": {
    "category": "emotion",
    "candidates": [
      {
        "pattern": "FEEL_ADJECTIVE",
        "subject": "I",
        "adjectives": [
          "angry",
          "upset"
        ],
        "weight": 5
      }
    ]
  },
  "EXPRESS_JEALOUSY": {
    "category": "emotion",
    "candidates": [
      {
        "pattern": "FEEL_ADJECTIVE",
        "subject": "I",
        "adjectives": [
          "jealous"
        ],
        "weight": 5
      }
    ]
  },
  "EXPRESS_LONELINESS": {
    "category": "emotion",
    "candidates": [
      {
        "pattern": "FEEL_ADJECTIVE",
        "subject": "I",
        "adjectives": [
          "lonely",
          "alone"
        ],
        "weight": 5
      }
    ]
  },
  "EXPRESS_RELIEF": {
    "category": "positive",
    "candidates": [
      {
        "pattern": "FEEL_ADJECTIVE",
        "subject": "I",
        "adjectives": [
          "relieved",
          "glad"
        ],
        "weight": 5
      }
    ]
  },
  "EXPRESS_TIRED": {
    "category": "condition",
    "candidates": [
      {
        "pattern": "FEEL_ADJECTIVE",
        "subject": "I",
        "adjectives": [
          "tired"
        ],
        "weight": 5
      }
    ]
  },
  "EXPRESS_HUNGRY": {
    "category": "condition",
    "candidates": [
      {
        "pattern": "FEEL_ADJECTIVE",
        "subject": "I",
        "adjectives": [
          "hungry"
        ],
        "weight": 5
      }
    ]
  },
  "EXPRESS_COLD": {
    "category": "condition",
    "candidates": [
      {
        "pattern": "FEEL_ADJECTIVE",
        "subject": "I",
        "adjectives": [
          "cold"
        ],
        "weight": 5
      }
    ]
  },
  "OFFER_HELP": {
    "category": "care",
    "candidates": [
      {
        "pattern": "OFFER_CAN_I",
        "subject": "I",
        "verbs": [
          "help"
        ],
        "object": "you",
        "weight": 5
      }
    ]
  },
  "ASK_FOR_HELP": {
    "category": "request",
    "candidates": [
      {
        "pattern": "REQUEST_CAN_YOU",
        "verbs": [
          "help"
        ],
        "object": "me",
        "weight": 5
      }
    ]
  },
  "REQUEST_STAY": {
    "category": "closeness",
    "candidates": [
      {
        "pattern": "REQUEST_PLEASE",
        "verbs": [
          "stay"
        ],
        "object": "with me",
        "weight": 5
      },
      {
        "pattern": "WANT_TO_PATTERN",
        "subject": "I",
        "verbs": [
          "stay"
        ],
        "object": "with you",
        "weight": 2
      }
    ]
  },
  "ASK_TO_TALK": {
    "category": "clarity",
    "candidates": [
      {
        "pattern": "REQUEST_CAN_YOU",
        "verbs": [
          "talk"
        ],
        "object": "to me",
        "weight": 4
      },
      {
        "pattern": "QUESTION_WHAT_ARE_YOU_DOING",
        "verbs": [
          "talk"
        ],
        "object": "",
        "surfaceOverride": "Can we talk?",
        "weight": 5
      }
    ]
  },
  "ASK_TO_WAIT": {
    "category": "request",
    "candidates": [
      {
        "pattern": "REQUEST_PLEASE",
        "verbs": [
          "wait"
        ],
        "object": "for me",
        "weight": 5
      }
    ]
  },
  "ASK_TO_GO_TOGETHER": {
    "category": "closeness",
    "candidates": [
      {
        "pattern": "SUGGEST_LETS",
        "verbs": [
          "go"
        ],
        "object": "together",
        "weight": 5
      }
    ]
  },
  "ASK_IF_OKAY": {
    "category": "care",
    "candidates": [
      {
        "pattern": "QUESTION_HOW_ARE",
        "surfaceOverride": "Are you all right?",
        "weight": 5
      }
    ]
  },
  "ASK_ABOUT_HEALTH": {
    "category": "care",
    "candidates": [
      {
        "pattern": "QUESTION_HOW_DO_YOU_FEEL",
        "weight": 5
      }
    ]
  },
  "ASK_ABOUT_SLEEP": {
    "category": "care",
    "candidates": [
      {
        "pattern": "PAST_SIMPLE_QUESTION",
        "subject": "you",
        "verbs": [
          "sleep"
        ],
        "object": "well",
        "weight": 5
      }
    ]
  },
  "ASK_ABOUT_FOOD": {
    "category": "care",
    "candidates": [
      {
        "pattern": "PAST_SIMPLE_QUESTION",
        "subject": "you",
        "verbs": [
          "eat"
        ],
        "object": "anything",
        "weight": 5
      }
    ]
  },
  "ASK_ABOUT_WORK": {
    "category": "daily",
    "candidates": [
      {
        "pattern": "QUESTION_HOW_WAS",
        "nounPhrase": "work",
        "weight": 5
      }
    ]
  },
  "COMMENT_RAIN": {
    "category": "environment",
    "candidates": [
      {
        "pattern": "PRESENT_CONTINUOUS",
        "subject": "It",
        "verbs": [
          "rain"
        ],
        "weight": 5
      }
    ]
  },
  "SAY_GOING_HOME": {
    "category": "parting",
    "candidates": [
      {
        "pattern": "PRESENT_CONTINUOUS",
        "subject": "I",
        "verbs": [
          "go"
        ],
        "object": "home",
        "weight": 5
      }
    ]
  },
  "PROMISE_RETURN": {
    "category": "parting",
    "candidates": [
      {
        "pattern": "FUTURE_SIMPLE",
        "subject": "I",
        "verbs": [
          "return",
          "come"
        ],
        "object": "back",
        "weight": 5
      }
    ]
  }
});
})();
