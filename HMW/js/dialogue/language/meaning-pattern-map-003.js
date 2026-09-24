(() => {
  "use strict";
  window.HMW = window.HMW || {};
  HMW.Dialogue = HMW.Dialogue || {};
  HMW.Dialogue.MEANING_PATTERN_MAP = Object.assign(
    HMW.Dialogue.MEANING_PATTERN_MAP || {},
    {
  "EXPRESS_NEED_CLARITY": [
    {
      "pattern": "DECLARATIVE_SVO",
      "slots": {
        "SUBJECT": "I",
        "VERB": "need",
        "OBJECT": "an answer"
      },
      "weight": 4
    },
    {
      "pattern": "NEED_TO",
      "slots": {
        "SUBJECT": "I",
        "VERB_BASE": "know",
        "OBJECT": "the truth"
      },
      "weight": 4
    }
  ],
  "DENY_ABANDONMENT": [
    {
      "pattern": "FUTURE_WILL_NOT",
      "slots": {
        "SUBJECT": "I",
        "VERB_BASE": "leave",
        "OBJECT": "you"
      },
      "weight": 5
    },
    {
      "pattern": "DECLARATIVE_SVO",
      "slots": {
        "SUBJECT": "I",
        "VERB": "am",
        "OBJECT": "still here"
      },
      "weight": 2
    }
  ],
  "CONFIRM_CHOICE": [
    {
      "pattern": "DECLARATIVE_SVO",
      "slots": {
        "SUBJECT": "I",
        "VERB": "choose",
        "OBJECT": "you"
      },
      "weight": 5
    },
    {
      "pattern": "DECLARATIVE_SVO",
      "slots": {
        "SUBJECT": "I",
        "VERB": "still choose",
        "OBJECT": "you"
      },
      "weight": 3
    }
  ],
  "EXPRESS_CARE": [
    {
      "pattern": "SVO_PREP",
      "slots": {
        "SUBJECT": "I",
        "VERB": "care",
        "OBJECT": "",
        "PREP_PHRASE": "about you"
      },
      "weight": 5
    },
    {
      "pattern": "DECLARATIVE_SVO",
      "slots": {
        "SUBJECT": "You",
        "VERB": "matter",
        "OBJECT": "to me"
      },
      "weight": 3
    }
  ],
  "EXPRESS_RELIEF": [
    {
      "pattern": "SVC_ADJECTIVE",
      "slots": {
        "SUBJECT": "I",
        "BE": "am",
        "ADJECTIVE": "relieved"
      },
      "weight": 5
    },
    {
      "pattern": "SVC_ADJECTIVE",
      "slots": {
        "SUBJECT": "I",
        "BE": "am",
        "ADJECTIVE": "glad you are here"
      },
      "weight": 3
    }
  ],
  "EXPRESS_CONFUSION": [
    {
      "pattern": "SVC_ADJECTIVE",
      "slots": {
        "SUBJECT": "I",
        "BE": "am",
        "ADJECTIVE": "confused"
      },
      "weight": 5
    },
    {
      "pattern": "DECLARATIVE_SVO",
      "slots": {
        "SUBJECT": "I",
        "VERB": "do not understand",
        "OBJECT": "this"
      },
      "weight": 3
    }
  ],
  "EXPRESS_UNCERTAINTY": [
    {
      "pattern": "SVC_ADJECTIVE",
      "slots": {
        "SUBJECT": "I",
        "BE": "am not",
        "ADJECTIVE": "sure"
      },
      "weight": 5
    },
    {
      "pattern": "I_DONT_KNOW_IF",
      "slots": {
        "CLAUSE": "this will work"
      },
      "weight": 2
    }
  ],
  "EXPRESS_CERTAINTY": [
    {
      "pattern": "SVC_ADJECTIVE",
      "slots": {
        "SUBJECT": "I",
        "BE": "am",
        "ADJECTIVE": "sure"
      },
      "weight": 5
    }
  ],
  "ASK_FOR_TRUST": [
    {
      "pattern": "IMPERATIVE",
      "slots": {
        "VERB_BASE": "trust",
        "OBJECT": "me"
      },
      "weight": 4
    },
    {
      "pattern": "WANT_OBJECT_TO",
      "slots": {
        "SUBJECT": "I",
        "OBJECT": "you",
        "VERB_BASE": "believe",
        "COMPLEMENT": "me"
      },
      "weight": 3
    }
  ],
  "ASK_FOR_ANSWER": [
    {
      "pattern": "IMPERATIVE",
      "slots": {
        "VERB_BASE": "answer",
        "OBJECT": "me"
      },
      "weight": 4
    },
    {
      "pattern": "DECLARATIVE_SVO",
      "slots": {
        "SUBJECT": "I",
        "VERB": "want",
        "OBJECT": "an answer"
      },
      "weight": 3
    }
  ],
  "RESPECT_BOUNDARY": [
    {
      "pattern": "DECLARATIVE_SVO",
      "slots": {
        "SUBJECT": "I",
        "VERB": "respect",
        "OBJECT": "that"
      },
      "weight": 5
    }
  ],
  "PROMISE_NOT_FOLLOW": [
    {
      "pattern": "FUTURE_WILL_NOT",
      "slots": {
        "SUBJECT": "I",
        "VERB_BASE": "follow",
        "OBJECT": "you"
      },
      "weight": 5
    }
  ],
  "PROMISE_NOT_TOUCH": [
    {
      "pattern": "FUTURE_WILL_NOT",
      "slots": {
        "SUBJECT": "I",
        "VERB_BASE": "touch",
        "OBJECT": "you"
      },
      "weight": 5
    }
  ],
  "PROMISE_NOT_KISS": [
    {
      "pattern": "FUTURE_WILL_NOT",
      "slots": {
        "SUBJECT": "I",
        "VERB_BASE": "kiss",
        "OBJECT": "you"
      },
      "weight": 5
    }
  ],
  "PROMISE_NOT_HUG": [
    {
      "pattern": "FUTURE_WILL_NOT",
      "slots": {
        "SUBJECT": "I",
        "VERB_BASE": "hug",
        "OBJECT": "you"
      },
      "weight": 5
    }
  ],
  "PROMISE_NOT_CONTACT": [
    {
      "pattern": "FUTURE_WILL_NOT",
      "slots": {
        "SUBJECT": "I",
        "VERB_BASE": "contact",
        "OBJECT": "you"
      },
      "weight": 5
    }
  ],
  "ASK_TO_REPAIR": [
    {
      "pattern": "QUESTION_CAN_YOU",
      "slots": {
        "VERB_BASE": "try",
        "OBJECT": "again with me"
      },
      "surfaceOverride": "Can we try again?",
      "weight": 5
    }
  ],
  "EXPRESS_REPAIR_DESIRE": [
    {
      "pattern": "WANT_TO",
      "slots": {
        "SUBJECT": "I",
        "VERB_BASE": "fix",
        "OBJECT": "this"
      },
      "weight": 5
    },
    {
      "pattern": "NEGATIVE_DO_SVO",
      "slots": {
        "SUBJECT": "I",
        "DO_AUX": "do",
        "VERB_BASE": "want",
        "OBJECT": "to end this"
      },
      "weight": 3
    }
  ],
  "DECLINE_FOR_NOW": [
    {
      "pattern": "MODAL_CANNOT",
      "slots": {
        "SUBJECT": "I",
        "VERB_BASE": "do",
        "OBJECT": "that right now"
      },
      "weight": 5
    }
  ],
  "ASK_TO_SIT_TOGETHER": [
    {
      "pattern": "QUESTION_CAN_I",
      "slots": {
        "VERB_BASE": "sit",
        "OBJECT": "with you"
      },
      "weight": 5
    }
  ]
}
  );
})();
