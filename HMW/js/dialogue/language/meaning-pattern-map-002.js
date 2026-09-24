(() => {
  "use strict";
  window.HMW = window.HMW || {};
  HMW.Dialogue = HMW.Dialogue || {};
  HMW.Dialogue.MEANING_PATTERN_MAP = Object.assign(
    HMW.Dialogue.MEANING_PATTERN_MAP || {},
    {
  "ASK_AFFECTION_REASON": [
    {
      "pattern": "QUESTION_WHY_DID",
      "slots": {
        "SUBJECT": "you",
        "VERB_BASE": "think",
        "OBJECT": "I do not love you"
      },
      "weight": 5
    }
  ],
  "TEMPORARY_STEP_BACK": [
    {
      "pattern": "FUTURE_WILL",
      "slots": {
        "SUBJECT": "I",
        "VERB_BASE": "give",
        "OBJECT": "you some space for now"
      },
      "weight": 5
    }
  ],
  "ASK_FOR_HONEST_ANSWER": [
    {
      "pattern": "IMPERATIVE",
      "slots": {
        "VERB_BASE": "tell",
        "OBJECT": "me the truth"
      },
      "weight": 5
    }
  ],
  "ACCEPT_APOLOGY": [
    {
      "pattern": "DECLARATIVE_SVO",
      "slots": {
        "SUBJECT": "I",
        "VERB": "accept",
        "OBJECT": "your apology"
      },
      "weight": 4
    },
    {
      "pattern": "DECLARATIVE_SVO",
      "slots": {
        "SUBJECT": "I",
        "VERB": "hear",
        "OBJECT": "you"
      },
      "prefix": "All right,",
      "weight": 2
    }
  ],
  "SAY_GOODBYE_TEMPORARY": [
    {
      "pattern": "HAVE_TO",
      "slots": {
        "SUBJECT": "I",
        "VERB_BASE": "go",
        "OBJECT": "for now"
      },
      "weight": 4
    },
    {
      "pattern": "FUTURE_WILL",
      "slots": {
        "SUBJECT": "I",
        "VERB_BASE": "see",
        "OBJECT": "you later"
      },
      "weight": 3
    }
  ],
  "PROMISE_RETURN": [
    {
      "pattern": "FUTURE_WILL",
      "slots": {
        "SUBJECT": "I",
        "VERB_BASE": "come",
        "OBJECT": "back"
      },
      "weight": 5
    }
  ],
  "ASK_NOT_TO_DISAPPEAR": [
    {
      "pattern": "NEGATIVE_IMPERATIVE",
      "slots": {
        "VERB_BASE": "disappear",
        "OBJECT": "without telling me"
      },
      "weight": 5
    }
  ],
  "EXPRESS_GRATITUDE": [
    {
      "pattern": "DECLARATIVE_SVO",
      "slots": {
        "SUBJECT": "I",
        "VERB": "appreciate",
        "OBJECT": "it"
      },
      "weight": 3
    },
    {
      "pattern": "IMPERATIVE",
      "slots": {
        "VERB_BASE": "thank",
        "OBJECT": "you"
      },
      "surfaceOverride": "Thank you.",
      "weight": 5
    }
  ],
  "REASSURE_SAFETY": [
    {
      "pattern": "SVC_ADJECTIVE",
      "slots": {
        "SUBJECT": "You",
        "BE": "are",
        "ADJECTIVE": "safe with me"
      },
      "weight": 4
    },
    {
      "pattern": "FUTURE_WILL_NOT",
      "slots": {
        "SUBJECT": "I",
        "VERB_BASE": "hurt",
        "OBJECT": "you"
      },
      "weight": 4
    }
  ],
  "ASK_ABOUT_OTHER_PERSON": [
    {
      "pattern": "QUESTION_WHO_IS",
      "slots": {
        "SUBJECT": "that person"
      },
      "weight": 4
    },
    {
      "pattern": "QUESTION_DO_YOU",
      "slots": {
        "VERB_BASE": "know",
        "OBJECT": "that person well"
      },
      "weight": 3
    }
  ],
  "AGREE_REQUEST": [
    {
      "pattern": "MODAL_CAN",
      "slots": {
        "SUBJECT": "I",
        "VERB_BASE": "do",
        "OBJECT": "that"
      },
      "prefix": "Yes,",
      "weight": 4
    },
    {
      "pattern": "FUTURE_WILL",
      "slots": {
        "SUBJECT": "I",
        "VERB_BASE": "do",
        "OBJECT": "it"
      },
      "prefix": "All right,",
      "weight": 3
    }
  ],
  "DECLINE_REQUEST": [
    {
      "pattern": "MODAL_CANNOT",
      "slots": {
        "SUBJECT": "I",
        "VERB_BASE": "do",
        "OBJECT": "that"
      },
      "weight": 5
    },
    {
      "pattern": "NEGATIVE_DO_SVO",
      "slots": {
        "SUBJECT": "I",
        "DO_AUX": "do",
        "VERB_BASE": "want",
        "OBJECT": "to do that"
      },
      "weight": 3
    }
  ],
  "EXPRESS_JOY": [
    {
      "pattern": "DECLARATIVE_BE_ADJ",
      "slots": {
        "SUBJECT": "I",
        "BE": "am",
        "ADJECTIVE": "glad"
      },
      "weight": 3
    },
    {
      "pattern": "DECLARATIVE_BE_ADJ",
      "slots": {
        "SUBJECT": "I",
        "BE": "am",
        "ADJECTIVE": "happy to see you"
      },
      "weight": 4
    }
  ],
  "ASK_RELATIONSHIP_STATUS": [
    {
      "pattern": "QUESTION_WHAT_IS",
      "slots": {
        "SUBJECT": "our relationship"
      },
      "weight": 3
    },
    {
      "pattern": "QUESTION_WHAT_DO_YOU",
      "slots": {
        "VERB_BASE": "think",
        "OBJECT": "we are"
      },
      "weight": 5
    }
  ],
  "ASK_FEELINGS": [
    {
      "pattern": "QUESTION_WHAT_DO_YOU",
      "slots": {
        "VERB_BASE": "think",
        "OBJECT": "of me"
      },
      "weight": 3
    },
    {
      "pattern": "QUESTION_DO_YOU",
      "slots": {
        "VERB_BASE": "have",
        "OBJECT": "feelings for me"
      },
      "weight": 4
    }
  ],
  "OFFER_FOOD": [
    {
      "pattern": "QUESTION_WOULD_YOU",
      "slots": {
        "VERB_BASE": "like",
        "OBJECT": "something to eat"
      },
      "weight": 5
    },
    {
      "pattern": "MODAL_SHOULD",
      "slots": {
        "SUBJECT": "You",
        "VERB_BASE": "eat",
        "OBJECT": "something"
      },
      "weight": 3
    }
  ],
  "OFFER_DRINK": [
    {
      "pattern": "QUESTION_WOULD_YOU",
      "slots": {
        "VERB_BASE": "like",
        "OBJECT": "something to drink"
      },
      "weight": 4
    },
    {
      "pattern": "QUESTION_DO_YOU",
      "slots": {
        "VERB_BASE": "want",
        "OBJECT": "some water"
      },
      "weight": 4
    }
  ],
  "EXPRESS_SLEEPY": [
    {
      "pattern": "DECLARATIVE_BE_ADJ",
      "slots": {
        "SUBJECT": "I",
        "BE": "am",
        "ADJECTIVE": "sleepy"
      },
      "weight": 5
    },
    {
      "pattern": "NEED_TO",
      "slots": {
        "SUBJECT": "I",
        "VERB_BASE": "sleep",
        "OBJECT": ""
      },
      "weight": 3
    }
  ],
  "ASK_TO_REST": [
    {
      "pattern": "LET_US",
      "slots": {
        "VERB_BASE": "rest",
        "OBJECT": "for a while"
      },
      "weight": 5
    },
    {
      "pattern": "MODAL_SHOULD",
      "slots": {
        "SUBJECT": "We",
        "VERB_BASE": "rest",
        "OBJECT": ""
      },
      "weight": 3
    }
  ],
  "ASK_ABOUT_WORK": [
    {
      "pattern": "QUESTION_DID_YOU",
      "slots": {
        "VERB_BASE": "work",
        "OBJECT": "today"
      },
      "weight": 3
    },
    {
      "pattern": "QUESTION_WHAT_DO_YOU",
      "slots": {
        "VERB_BASE": "do",
        "OBJECT": "for work"
      },
      "weight": 3
    }
  ],
  "EXPRESS_WORK_TIREDNESS": [
    {
      "pattern": "DECLARATIVE_BE_ADJ",
      "slots": {
        "SUBJECT": "I",
        "BE": "am",
        "ADJECTIVE": "tired from work"
      },
      "weight": 5
    }
  ],
  "ASK_ABOUT_MONEY": [
    {
      "pattern": "QUESTION_DO_YOU",
      "slots": {
        "VERB_BASE": "have",
        "OBJECT": "enough money"
      },
      "weight": 4
    },
    {
      "pattern": "QUESTION_CAN_YOU",
      "slots": {
        "VERB_BASE": "afford",
        "OBJECT": "it"
      },
      "weight": 3
    }
  ],
  "EXPRESS_NO_MONEY": [
    {
      "pattern": "NEGATIVE_DO_SVO",
      "slots": {
        "SUBJECT": "I",
        "DO_AUX": "do",
        "VERB_BASE": "have",
        "OBJECT": "any money"
      },
      "weight": 4
    },
    {
      "pattern": "MODAL_CANNOT",
      "slots": {
        "SUBJECT": "I",
        "VERB_BASE": "afford",
        "OBJECT": "it"
      },
      "weight": 3
    }
  ],
  "COMMENT_RAIN": [
    {
      "pattern": "PRESENT_PROGRESSIVE",
      "slots": {
        "SUBJECT": "It",
        "BE": "is",
        "VERB_ING": "raining",
        "OBJECT": ""
      },
      "weight": 5
    }
  ],
  "COMMENT_COLD_WEATHER": [
    {
      "pattern": "SVC_ADJECTIVE",
      "slots": {
        "SUBJECT": "It",
        "BE": "is",
        "ADJECTIVE": "cold today"
      },
      "weight": 5
    }
  ],
  "SAY_GOING_HOME": [
    {
      "pattern": "PRESENT_PROGRESSIVE",
      "slots": {
        "SUBJECT": "I",
        "BE": "am",
        "VERB_ING": "going",
        "OBJECT": "home"
      },
      "weight": 5
    }
  ],
  "ASK_IF_COMING_BACK": [
    {
      "pattern": "QUESTION_ARE_YOU",
      "slots": {
        "ADJECTIVE_OR_PROGRESSIVE": "coming back"
      },
      "weight": 4
    },
    {
      "pattern": "QUESTION_WILL_YOU",
      "slots": {
        "VERB_BASE": "come",
        "OBJECT": "back later"
      },
      "weight": 4
    }
  ]
}
  );
})();
