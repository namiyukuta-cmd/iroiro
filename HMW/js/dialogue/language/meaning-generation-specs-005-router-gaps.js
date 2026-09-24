(() => {
  "use strict";
  window.HMW = window.HMW || {};
  HMW.Dialogue = HMW.Dialogue || {};
  HMW.Dialogue.GENERATION_SPECS = Object.assign(
    HMW.Dialogue.GENERATION_SPECS || {},
    {
  "ASK_WHAT_HAPPENED": {
    "category": "clarity",
    "candidates": [
      {
        "pattern": "G17_CLARIFY_CAN_YOU_EXPLAIN",
        "slots": {
          "NOUN_PHRASE": "what happened"
        },
        "weight": 5
      }
    ]
  },
  "ASK_TO_REPAIR": {
    "category": "repair",
    "candidates": [
      {
        "pattern": "REQUEST_CAN_YOU",
        "verbs": [
          "try"
        ],
        "object": "again with me",
        "weight": 5
      },
      {
        "pattern": "REQUEST_CAN_YOU",
        "verbs": [
          "work"
        ],
        "object": "this out with me",
        "weight": 4
      }
    ]
  },
  "GREET": {
    "category": "social",
    "candidates": [
      {
        "pattern": "PRESENT_SIMPLE_SVO",
        "subject": "I",
        "verbs": [
          "wish"
        ],
        "object": "you a good day",
        "weight": 4
      }
    ]
  },
  "RETURN_GREETING": {
    "category": "social",
    "candidates": [
      {
        "pattern": "PRESENT_SIMPLE_SVO",
        "subject": "I",
        "verbs": [
          "wish"
        ],
        "object": "you a good day too",
        "weight": 4
      }
    ]
  },
  "SAY_GOODBYE": {
    "category": "parting",
    "candidates": [
      {
        "pattern": "FUTURE_SIMPLE",
        "subject": "I",
        "verbs": [
          "see"
        ],
        "object": "you later",
        "weight": 5
      }
    ]
  },
  "ACKNOWLEDGE_EVENT": {
    "category": "response",
    "candidates": [
      {
        "pattern": "PRESENT_SIMPLE_SVO",
        "subject": "I",
        "verbs": [
          "understand"
        ],
        "object": "that",
        "weight": 5
      }
    ]
  },
  "ASK_FOR_DETAILS": {
    "category": "clarity",
    "candidates": [
      {
        "pattern": "REQUEST_CAN_YOU",
        "verbs": [
          "tell"
        ],
        "object": "me more",
        "weight": 5
      },
      {
        "pattern": "REQUEST_CAN_YOU",
        "verbs": [
          "explain"
        ],
        "object": "that",
        "weight": 4
      }
    ]
  },
  "EXPRESS_SURPRISE": {
    "category": "emotion",
    "candidates": [
      {
        "pattern": "PAST_SIMPLE_NEG",
        "subject": "I",
        "verbs": [
          "expect"
        ],
        "object": "that",
        "weight": 5
      }
    ]
  },
  "EXPRESS_SYMPATHY": {
    "category": "care",
    "candidates": [
      {
        "pattern": "FEEL_ADJECTIVE",
        "subject": "I",
        "adjectives": [
          "sorry"
        ],
        "weight": 5
      }
    ]
  },
  "EXPRESS_APPROVAL": {
    "category": "response",
    "candidates": [
      {
        "pattern": "SOUND_ADJECTIVE",
        "adjectives": [
          "good",
          "reasonable"
        ],
        "weight": 5
      }
    ]
  },
  "EXPRESS_DISAPPROVAL": {
    "category": "response",
    "candidates": [
      {
        "pattern": "PRESENT_SIMPLE_NEG",
        "subject": "I",
        "verbs": [
          "like"
        ],
        "object": "that",
        "weight": 5
      }
    ]
  },
  "ASK_PLAN": {
    "category": "daily",
    "candidates": [
      {
        "pattern": "QUESTION_WHAT_WILL",
        "subject": "you",
        "verbs": [
          "do"
        ],
        "object": "",
        "weight": 5
      }
    ]
  },
  "ASK_PREFERENCE": {
    "category": "daily",
    "candidates": [
      {
        "pattern": "ASK_PREFERENCE_BETWEEN",
        "slots": {
          "OBJECT_A": "this",
          "OBJECT_B": "that"
        },
        "weight": 5
      }
    ]
  },
  "ASK_WORK_STATUS": {
    "category": "daily",
    "candidates": [
      {
        "pattern": "QUESTION_HOW_WAS",
        "nounPhrase": "work",
        "weight": 5
      }
    ]
  },
  "ASK_MONEY_STATUS": {
    "category": "daily",
    "candidates": [
      {
        "pattern": "PRESENT_SIMPLE_QUESTION",
        "subject": "you",
        "verbs": [
          "have"
        ],
        "object": "enough money",
        "weight": 5
      }
    ]
  },
  "ASK_HUNGER": {
    "category": "care",
    "candidates": [
      {
        "pattern": "G17_FEELING_ARE_YOU_ADJ",
        "adjectives": [
          "hungry"
        ],
        "weight": 5
      }
    ]
  },
  "ASK_THIRST": {
    "category": "care",
    "candidates": [
      {
        "pattern": "G17_FEELING_ARE_YOU_ADJ",
        "adjectives": [
          "thirsty"
        ],
        "weight": 5
      }
    ]
  },
  "ASK_TIREDNESS": {
    "category": "care",
    "candidates": [
      {
        "pattern": "G17_FEELING_ARE_YOU_ADJ",
        "adjectives": [
          "tired"
        ],
        "weight": 5
      }
    ]
  },
  "REQUEST_CONTACT": {
    "category": "contact",
    "candidates": [
      {
        "pattern": "REQUEST_PLEASE",
        "verbs": [
          "call"
        ],
        "object": "me later",
        "weight": 5
      },
      {
        "pattern": "REQUEST_PLEASE",
        "verbs": [
          "message"
        ],
        "object": "me",
        "weight": 4
      }
    ]
  },
  "ASK_PERMISSION_ENTER": {
    "category": "boundary",
    "candidates": [
      {
        "pattern": "PERMISSION_CAN_I",
        "verbs": [
          "come"
        ],
        "object": "in",
        "weight": 5
      }
    ]
  },
  "ASK_PERMISSION_WAIT": {
    "category": "boundary",
    "candidates": [
      {
        "pattern": "PERMISSION_CAN_I",
        "verbs": [
          "wait"
        ],
        "object": "here",
        "weight": 5
      }
    ]
  },
  "EXPRESS_DISAPPOINTMENT": {
    "category": "emotion",
    "candidates": [
      {
        "pattern": "FEEL_ADJECTIVE",
        "subject": "I",
        "adjectives": [
          "disappointed"
        ],
        "weight": 5
      }
    ]
  },
  "EXPRESS_HOPE": {
    "category": "emotion",
    "candidates": [
      {
        "pattern": "HOPE_CLAUSE",
        "slots": {
          "CLAUSE": "things get better"
        },
        "weight": 5
      },
      {
        "pattern": "G14_SHORT_I_HOPE_SO",
        "weight": 3
      }
    ]
  },
  "EXPRESS_PRIDE": {
    "category": "positive",
    "candidates": [
      {
        "pattern": "DECLARATIVE_BE_ADJ",
        "subject": "I",
        "adjectives": [
          "proud"
        ],
        "weight": 5
      }
    ]
  },
  "CONFIRM_ARRIVAL": {
    "category": "movement",
    "candidates": [
      {
        "pattern": "PAST_SIMPLE_SV",
        "subject": "I",
        "verbs": [
          "arrive"
        ],
        "weight": 5
      }
    ]
  },
  "ANSWER_UNKNOWN": {
    "category": "answer",
    "candidates": [
      {
        "pattern": "DO_NOT_KNOW_OBJECT",
        "slots": {
          "SUBJECT": "I",
          "OBJECT": "that"
        },
        "weight": 5
      }
    ]
  },
  "CONFIRM_KNOWLEDGE": {
    "category": "answer",
    "candidates": [
      {
        "pattern": "KNOW_OBJECT",
        "slots": {
          "SUBJECT": "I",
          "OBJECT": "that"
        },
        "weight": 5
      }
    ]
  },
  "DENY_KNOWLEDGE": {
    "category": "answer",
    "candidates": [
      {
        "pattern": "DO_NOT_KNOW_OBJECT",
        "slots": {
          "SUBJECT": "I",
          "OBJECT": "that"
        },
        "weight": 5
      }
    ]
  },
  "CONFIRM_FACT": {
    "category": "answer",
    "candidates": [
      {
        "pattern": "ANSWER_FACT_POSITIVE",
        "slots": {
          "CLAUSE": "that is true"
        },
        "weight": 5
      }
    ]
  },
  "DENY_FACT": {
    "category": "answer",
    "candidates": [
      {
        "pattern": "ANSWER_FACT_NEGATIVE",
        "slots": {
          "CLAUSE": "that is not true"
        },
        "weight": 5
      }
    ]
  },
  "GRANT_PERMISSION": {
    "category": "response",
    "candidates": [
      {
        "pattern": "PERMISSION_GRANT_CAN",
        "verbs": [
          "do"
        ],
        "object": "that",
        "weight": 5
      }
    ]
  },
  "DENY_PERMISSION": {
    "category": "response",
    "candidates": [
      {
        "pattern": "PERMISSION_DENY_PLEASE_DONT",
        "verbs": [
          "do"
        ],
        "object": "that",
        "weight": 5
      }
    ]
  },
  "ACCEPT_ACTION_REQUEST": {
    "category": "response",
    "candidates": [
      {
        "pattern": "REQUEST_ACCEPT_WILL",
        "verbs": [
          "do"
        ],
        "object": "that",
        "weight": 5
      }
    ]
  },
  "DECLINE_ACTION_REQUEST": {
    "category": "response",
    "candidates": [
      {
        "pattern": "REQUEST_DECLINE_WONT",
        "verbs": [
          "do"
        ],
        "object": "that",
        "weight": 5
      }
    ]
  },
  "ACCEPT_INVITATION": {
    "category": "response",
    "candidates": [
      {
        "pattern": "INVITE_ACCEPT",
        "verbs": [
          "join"
        ],
        "object": "you",
        "weight": 5
      }
    ]
  },
  "DECLINE_INVITATION": {
    "category": "response",
    "candidates": [
      {
        "pattern": "INVITE_DECLINE",
        "weight": 5
      },
      {
        "pattern": "INVITE_DECLINE_LATER",
        "weight": 3
      }
    ]
  },
  "ACCEPT_SUGGESTION": {
    "category": "response",
    "candidates": [
      {
        "pattern": "SUGGEST_ACCEPT",
        "verbs": [
          "do"
        ],
        "object": "that",
        "weight": 5
      },
      {
        "pattern": "SUGGEST_ACCEPT_SOUND",
        "weight": 3
      }
    ]
  },
  "DECLINE_SUGGESTION": {
    "category": "response",
    "candidates": [
      {
        "pattern": "SUGGEST_DECLINE",
        "verbs": [
          "do"
        ],
        "object": "that",
        "weight": 5
      },
      {
        "pattern": "SUGGEST_DECLINE_NO",
        "weight": 3
      }
    ]
  }
}
  );
})();