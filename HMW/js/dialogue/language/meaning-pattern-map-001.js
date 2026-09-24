(() => {
  "use strict";
  window.HMW = window.HMW || {};
  HMW.Dialogue = HMW.Dialogue || {};
  HMW.Dialogue.MEANING_PATTERN_MAP = Object.assign(
    HMW.Dialogue.MEANING_PATTERN_MAP || {},
    {
  "AFFIRM_LOVE": [
    {
      "pattern": "DECLARATIVE_SVO",
      "slots": {
        "SUBJECT": "I",
        "VERB": "love",
        "OBJECT": "you"
      },
      "weight": 5
    },
    {
      "pattern": "DECLARATIVE_SVO",
      "slots": {
        "SUBJECT": "I",
        "VERB": "love",
        "OBJECT": "you"
      },
      "prefix": "Yes,",
      "weight": 2
    }
  ],
  "DENY_LOVE": [
    {
      "pattern": "NEGATIVE_DO_SVO",
      "slots": {
        "SUBJECT": "I",
        "DO_AUX": "do",
        "VERB_BASE": "love",
        "OBJECT": "you"
      },
      "weight": 5
    }
  ],
  "DENY_BETRAYAL": [
    {
      "pattern": "FUTURE_WILL_NOT",
      "slots": {
        "SUBJECT": "I",
        "VERB_BASE": "betray",
        "OBJECT": "you"
      },
      "weight": 5
    },
    {
      "pattern": "NEGATIVE_DO_SVO",
      "slots": {
        "SUBJECT": "I",
        "DO_AUX": "do",
        "VERB_BASE": "want",
        "OBJECT": "to betray you"
      },
      "weight": 1
    }
  ],
  "PROMISE_LOYALTY": [
    {
      "pattern": "FUTURE_WILL",
      "slots": {
        "SUBJECT": "I",
        "VERB_BASE": "stay",
        "OBJECT": "loyal to you"
      },
      "weight": 4
    }
  ],
  "ACCEPT_DISTANCE": [
    {
      "pattern": "FUTURE_WILL",
      "slots": {
        "SUBJECT": "I",
        "VERB_BASE": "give",
        "OBJECT": "you some space"
      },
      "weight": 4
    }
  ],
  "REFUSE_DISTANCE": [
    {
      "pattern": "MODAL_CANNOT",
      "slots": {
        "SUBJECT": "I",
        "VERB_BASE": "leave",
        "OBJECT": "you alone"
      },
      "weight": 4
    },
    {
      "pattern": "NEGATIVE_DO_SVO",
      "slots": {
        "SUBJECT": "I",
        "DO_AUX": "do",
        "VERB_BASE": "want",
        "OBJECT": "to leave you alone"
      },
      "weight": 3
    }
  ],
  "ASK_DISTANCE_REASON": [
    {
      "pattern": "WH_WHY_DO",
      "slots": {
        "DO_AUX": "do",
        "SUBJECT": "you",
        "VERB_BASE": "want",
        "OBJECT": "me to leave you alone"
      },
      "weight": 5
    }
  ],
  "EXPRESS_CONCERN": [
    {
      "pattern": "DECLARATIVE_BE_ADJ",
      "slots": {
        "SUBJECT": "I",
        "BE": "am",
        "ADJECTIVE": "worried about you"
      },
      "weight": 5
    }
  ],
  "EXPRESS_FEAR_OF_LOSS": [
    {
      "pattern": "NEGATIVE_DO_SVO",
      "slots": {
        "SUBJECT": "I",
        "DO_AUX": "do",
        "VERB_BASE": "want",
        "OBJECT": "to lose you"
      },
      "weight": 5
    }
  ],
  "REJECT_DEATH_WISH_CLAIM": [
    {
      "pattern": "NEGATIVE_DO_SVO",
      "slots": {
        "SUBJECT": "I",
        "DO_AUX": "do",
        "VERB_BASE": "want",
        "OBJECT": "you to die"
      },
      "weight": 5
    }
  ],
  "ASK_WHAT_HAPPENED": [
    {
      "pattern": "WH_WHAT_DO",
      "slots": {
        "DO_AUX": "did",
        "SUBJECT": "",
        "VERB_BASE": "happen",
        "OBJECT": ""
      },
      "surfaceOverride": "What happened?",
      "weight": 5
    }
  ],
  "REQUEST_STAY": [
    {
      "pattern": "PLEASE_IMPERATIVE",
      "slots": {
        "VERB_BASE": "stay",
        "OBJECT": ""
      },
      "weight": 3
    },
    {
      "pattern": "WANT_OBJECT_TO",
      "slots": {
        "SUBJECT": "I",
        "OBJECT": "you",
        "VERB_BASE": "stay",
        "COMPLEMENT": ""
      },
      "weight": 5
    }
  ],
  "APOLOGIZE": [
    {
      "pattern": "DECLARATIVE_BE_ADJ",
      "slots": {
        "SUBJECT": "I",
        "BE": "am",
        "ADJECTIVE": "sorry"
      },
      "weight": 5
    }
  ],
  "EXPRESS_HURT": [
    {
      "pattern": "PAST_SVO",
      "slots": {
        "SUBJECT": "That",
        "VERB_PAST": "hurt",
        "OBJECT": "me"
      },
      "weight": 5
    }
  ],
  "EXPRESS_ANGER": [
    {
      "pattern": "DECLARATIVE_BE_ADJ",
      "slots": {
        "SUBJECT": "I",
        "BE": "am",
        "ADJECTIVE": "angry"
      },
      "weight": 5
    }
  ],
  "REASSURE_NOT_LEAVING": [
    {
      "pattern": "PRESENT_PROGRESSIVE",
      "slots": {
        "SUBJECT": "I",
        "BE": "am not",
        "VERB_ING": "leaving",
        "OBJECT": "you"
      },
      "weight": 4
    },
    {
      "pattern": "DECLARATIVE_SVO",
      "slots": {
        "SUBJECT": "I",
        "VERB": "am",
        "OBJECT": "still here"
      },
      "weight": 3
    }
  ],
  "ASK_TO_TALK": [
    {
      "pattern": "PLEASE_IMPERATIVE",
      "slots": {
        "VERB_BASE": "talk",
        "OBJECT": "to me"
      },
      "weight": 4
    },
    {
      "pattern": "YES_NO_CAN",
      "slots": {
        "SUBJECT": "we",
        "VERB_BASE": "talk",
        "OBJECT": "about this"
      },
      "weight": 4
    }
  ],
  "EXPRESS_MISSING": [
    {
      "pattern": "PAST_SVO",
      "slots": {
        "SUBJECT": "I",
        "VERB_PAST": "missed",
        "OBJECT": "you"
      },
      "weight": 5
    }
  ],
  "ASK_TO_MEET": [
    {
      "pattern": "YES_NO_CAN",
      "slots": {
        "SUBJECT": "I",
        "VERB_BASE": "see",
        "OBJECT": "you again"
      },
      "weight": 4
    },
    {
      "pattern": "WANT_TO",
      "slots": {
        "SUBJECT": "I",
        "VERB_BASE": "see",
        "OBJECT": "you again"
      },
      "weight": 4
    }
  ],
  "EXPRESS_JEALOUSY": [
    {
      "pattern": "DECLARATIVE_BE_ADJ",
      "slots": {
        "SUBJECT": "I",
        "BE": "am",
        "ADJECTIVE": "jealous"
      },
      "weight": 5
    }
  ],
  "CONFIRM_TRUST": [
    {
      "pattern": "DECLARATIVE_SVO",
      "slots": {
        "SUBJECT": "I",
        "VERB": "trust",
        "OBJECT": "you"
      },
      "weight": 5
    }
  ],
  "ASK_IF_OKAY": [
    {
      "pattern": "YES_NO_BE",
      "slots": {
        "BE_CAP": "Are",
        "SUBJECT": "you",
        "ADJECTIVE_OR_NOUN": "all right"
      },
      "weight": 5
    }
  ],
  "EXPRESS_LONELINESS": [
    {
      "pattern": "DECLARATIVE_BE_ADJ",
      "slots": {
        "SUBJECT": "I",
        "BE": "was",
        "ADJECTIVE": "lonely"
      },
      "weight": 5
    }
  ],
  "EXPRESS_ANXIETY": [
    {
      "pattern": "DECLARATIVE_BE_ADJ",
      "slots": {
        "SUBJECT": "I",
        "BE": "am",
        "ADJECTIVE": "worried"
      },
      "weight": 3
    }
  ],
  "EXPRESS_WANT_TO_BE_TOGETHER": [
    {
      "pattern": "WANT_TO",
      "slots": {
        "SUBJECT": "I",
        "VERB_BASE": "be",
        "OBJECT": "with you"
      },
      "weight": 5
    }
  ],
  "ASK_TO_STAY_CLOSE": [
    {
      "pattern": "IMPERATIVE",
      "slots": {
        "VERB_BASE": "stay",
        "OBJECT": "close to me"
      },
      "weight": 5
    }
  ],
  "ASK_PERMISSION_TOUCH": [
    {
      "pattern": "YES_NO_CAN",
      "slots": {
        "SUBJECT": "I",
        "VERB_BASE": "touch",
        "OBJECT": "you"
      },
      "weight": 5
    }
  ],
  "ASK_PERMISSION_HUG": [
    {
      "pattern": "YES_NO_CAN",
      "slots": {
        "SUBJECT": "I",
        "VERB_BASE": "hug",
        "OBJECT": "you"
      },
      "weight": 5
    }
  ],
  "ASK_PERMISSION_KISS": [
    {
      "pattern": "YES_NO_CAN",
      "slots": {
        "SUBJECT": "I",
        "VERB_BASE": "kiss",
        "OBJECT": "you"
      },
      "weight": 5
    }
  ],
  "EXPRESS_TIRED": [
    {
      "pattern": "DECLARATIVE_BE_ADJ",
      "slots": {
        "SUBJECT": "I",
        "BE": "am",
        "ADJECTIVE": "tired"
      },
      "weight": 5
    }
  ],
  "EXPRESS_HUNGRY": [
    {
      "pattern": "DECLARATIVE_BE_ADJ",
      "slots": {
        "SUBJECT": "I",
        "BE": "am",
        "ADJECTIVE": "hungry"
      },
      "weight": 5
    }
  ],
  "EXPRESS_COLD": [
    {
      "pattern": "DECLARATIVE_BE_ADJ",
      "slots": {
        "SUBJECT": "I",
        "BE": "am",
        "ADJECTIVE": "cold"
      },
      "weight": 5
    }
  ],
  "OFFER_HELP": [
    {
      "pattern": "YES_NO_CAN",
      "slots": {
        "SUBJECT": "I",
        "VERB_BASE": "help",
        "OBJECT": "you"
      },
      "weight": 5
    }
  ],
  "ASK_FOR_HELP": [
    {
      "pattern": "YES_NO_CAN",
      "slots": {
        "SUBJECT": "you",
        "VERB_BASE": "help",
        "OBJECT": "me"
      },
      "weight": 5
    }
  ],
  "ASK_TO_WAIT": [
    {
      "pattern": "IMPERATIVE",
      "slots": {
        "VERB_BASE": "wait",
        "OBJECT": "for me"
      },
      "weight": 5
    }
  ],
  "ASK_TO_GO_TOGETHER": [
    {
      "pattern": "LET_US",
      "slots": {
        "VERB_BASE": "go",
        "OBJECT": "together"
      },
      "weight": 5
    }
  ],
  "ASK_DESTINATION": [
    {
      "pattern": "WH_WHERE_GOING",
      "slots": {
        "BE": "are",
        "SUBJECT": "you"
      },
      "weight": 5
    }
  ]
}
  );
})();
