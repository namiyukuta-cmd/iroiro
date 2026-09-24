(() => {
  "use strict";
  window.HMW = window.HMW || {};
  HMW.Dialogue = HMW.Dialogue || {};
  HMW.Dialogue.MEANING_PATTERN_MAP = Object.assign(HMW.Dialogue.MEANING_PATTERN_MAP || {}, {
  "GREET": [
    {
      "surfaceOverride": "Hello.",
      "weight": 4
    },
    {
      "surfaceOverride": "Hi.",
      "weight": 3
    }
  ],
  "RETURN_GREETING": [
    {
      "surfaceOverride": "Hello.",
      "weight": 4
    },
    {
      "surfaceOverride": "Hi.",
      "weight": 3
    }
  ],
  "SAY_GOODBYE": [
    {
      "surfaceOverride": "Goodbye.",
      "weight": 3
    },
    {
      "surfaceOverride": "See you later.",
      "weight": 4
    }
  ],
  "ASK_REASON": [
    {
      "pattern": "QUESTION_WHY_DO",
      "slots": {
        "DO_AUX": "do",
        "SUBJECT": "you",
        "VERB_BASE": "say",
        "OBJECT": "that"
      },
      "weight": 4
    },
    {
      "surfaceOverride": "Why?",
      "weight": 2
    }
  ],
  "ASK_WHERE": [
    {
      "pattern": "QUESTION_WHERE_ARE",
      "slots": {
        "SUBJECT": "you"
      },
      "weight": 4
    }
  ],
  "ASK_WHEN": [
    {
      "pattern": "QUESTION_WHEN_WILL",
      "slots": {
        "SUBJECT": "you",
        "VERB_BASE": "come",
        "OBJECT": "back"
      },
      "weight": 4
    }
  ],
  "ASK_ABOUT_HEALTH": [
    {
      "pattern": "QUESTION_HOW_ARE",
      "slots": {
        "SUBJECT": "you"
      },
      "weight": 4
    },
    {
      "surfaceOverride": "Are you feeling all right?",
      "weight": 3
    }
  ],
  "ASK_ABOUT_SLEEP": [
    {
      "pattern": "PAST_SIMPLE_QUESTION",
      "slots": {
        "SUBJECT": "you",
        "VERB_BASE": "sleep",
        "OBJECT": "well"
      },
      "weight": 4
    }
  ],
  "ASK_ABOUT_FOOD": [
    {
      "pattern": "PAST_SIMPLE_QUESTION",
      "slots": {
        "SUBJECT": "you",
        "VERB_BASE": "eat",
        "OBJECT": "anything"
      },
      "weight": 4
    }
  ],
  "ASK_ABOUT_HOME": [
    {
      "pattern": "QUESTION_WHERE_ARE",
      "slots": {
        "SUBJECT": "you staying"
      },
      "weight": 3
    },
    {
      "surfaceOverride": "Are you going home?",
      "weight": 3
    }
  ],
  "OFFER_REST": [
    {
      "pattern": "SUGGEST_SHOULD",
      "slots": {
        "VERB_BASE": "rest",
        "OBJECT": "for a while"
      },
      "weight": 4
    }
  ],
  "OFFER_WARMTH": [
    {
      "pattern": "SUGGEST_SHOULD",
      "slots": {
        "VERB_BASE": "get",
        "OBJECT": "somewhere warm"
      },
      "weight": 4
    }
  ],
  "OFFER_SHELTER": [
    {
      "pattern": "SUGGEST_LETS",
      "slots": {
        "VERB_BASE": "find",
        "OBJECT": "shelter"
      },
      "weight": 4
    }
  ],
  "STATE_PLAN": [
    {
      "pattern": "BE_GOING_TO",
      "slots": {
        "SUBJECT": "I",
        "BE": "am",
        "VERB_BASE": "go",
        "OBJECT": "home"
      },
      "weight": 3
    }
  ],
  "STATE_PREFERENCE": [
    {
      "pattern": "PRESENT_SIMPLE_SVO",
      "slots": {
        "SUBJECT": "I",
        "VERB": "prefer",
        "OBJECT": "this"
      },
      "weight": 3
    }
  ],
  "ACKNOWLEDGE_EVENT": [
    {
      "surfaceOverride": "I understand.",
      "weight": 3
    },
    {
      "surfaceOverride": "I see.",
      "weight": 4
    }
  ],
  "ASK_FOR_DETAILS": [
    {
      "surfaceOverride": "Tell me more.",
      "weight": 4
    },
    {
      "surfaceOverride": "What happened?",
      "weight": 3
    }
  ],
  "EXPRESS_SURPRISE": [
    {
      "surfaceOverride": "Really?",
      "weight": 3
    },
    {
      "surfaceOverride": "I did not expect that.",
      "weight": 4
    }
  ],
  "EXPRESS_SYMPATHY": [
    {
      "surfaceOverride": "I am sorry to hear that.",
      "weight": 4
    }
  ],
  "EXPRESS_APPROVAL": [
    {
      "surfaceOverride": "That sounds good.",
      "weight": 4
    }
  ],
  "EXPRESS_DISAPPROVAL": [
    {
      "surfaceOverride": "I do not like that.",
      "weight": 4
    }
  ]
});
})();
