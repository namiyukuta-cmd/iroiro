(() => {
 "use strict";
 window.HMW=window.HMW||{}; HMW.Dialogue=HMW.Dialogue||{};
 HMW.Dialogue.SENTENCE_PATTERNS=Object.assign(HMW.Dialogue.SENTENCE_PATTERNS||{},{
  "QUESTION_DOES_SV": {
    "tokens": [
      "Does",
      "{SUBJECT}",
      "{VERB_BASE}",
      "{OBJECT?}?"
    ],
    "slots": [
      "SUBJECT",
      "VERB_BASE",
      "OBJECT?"
    ]
  },
  "QUESTION_CAN_SUBJECT": {
    "tokens": [
      "Can",
      "{SUBJECT}",
      "{VERB_BASE}",
      "{OBJECT?}?"
    ],
    "slots": [
      "SUBJECT",
      "VERB_BASE",
      "OBJECT?"
    ]
  },
  "QUESTION_COULD_SUBJECT": {
    "tokens": [
      "Could",
      "{SUBJECT}",
      "{VERB_BASE}",
      "{OBJECT?}?"
    ],
    "slots": [
      "SUBJECT",
      "VERB_BASE",
      "OBJECT?"
    ]
  },
  "QUESTION_WOULD_SUBJECT": {
    "tokens": [
      "Would",
      "{SUBJECT}",
      "{VERB_BASE}",
      "{OBJECT?}?"
    ],
    "slots": [
      "SUBJECT",
      "VERB_BASE",
      "OBJECT?"
    ]
  },
  "QUESTION_HAS_SUBJECT": {
    "tokens": [
      "Has",
      "{SUBJECT}",
      "{VERB_PP}",
      "{OBJECT?}?"
    ],
    "slots": [
      "SUBJECT",
      "VERB_PP",
      "OBJECT?"
    ]
  },
  "QUESTION_HAVE_SUBJECT": {
    "tokens": [
      "Have",
      "{SUBJECT}",
      "{VERB_PP}",
      "{OBJECT?}?"
    ],
    "slots": [
      "SUBJECT",
      "VERB_PP",
      "OBJECT?"
    ]
  },
  "QUESTION_IS_SUBJECT_ADJ": {
    "tokens": [
      "Is",
      "{SUBJECT}",
      "{ADJECTIVE}?"
    ],
    "slots": [
      "SUBJECT",
      "ADJECTIVE"
    ]
  },
  "QUESTION_ARE_SUBJECT_ADJ": {
    "tokens": [
      "Are",
      "{SUBJECT}",
      "{ADJECTIVE}?"
    ],
    "slots": [
      "SUBJECT",
      "ADJECTIVE"
    ]
  },
  "QUESTION_WHERE_DOES": {
    "tokens": [
      "Where",
      "does",
      "{SUBJECT}",
      "{VERB_BASE}",
      "{OBJECT?}?"
    ],
    "slots": [
      "SUBJECT",
      "VERB_BASE",
      "OBJECT?"
    ]
  },
  "QUESTION_WHERE_DID": {
    "tokens": [
      "Where",
      "did",
      "{SUBJECT}",
      "{VERB_BASE}",
      "{OBJECT?}?"
    ],
    "slots": [
      "SUBJECT",
      "VERB_BASE",
      "OBJECT?"
    ]
  },
  "QUESTION_WHERE_CAN": {
    "tokens": [
      "Where",
      "can",
      "{SUBJECT}",
      "{VERB_BASE}",
      "{OBJECT?}?"
    ],
    "slots": [
      "SUBJECT",
      "VERB_BASE",
      "OBJECT?"
    ]
  },
  "QUESTION_WHEN_DOES": {
    "tokens": [
      "When",
      "does",
      "{SUBJECT}",
      "{VERB_BASE}",
      "{OBJECT?}?"
    ],
    "slots": [
      "SUBJECT",
      "VERB_BASE",
      "OBJECT?"
    ]
  },
  "QUESTION_WHEN_CAN": {
    "tokens": [
      "When",
      "can",
      "{SUBJECT}",
      "{VERB_BASE}",
      "{OBJECT?}?"
    ],
    "slots": [
      "SUBJECT",
      "VERB_BASE",
      "OBJECT?"
    ]
  },
  "QUESTION_WHO_IS": {
    "tokens": [
      "Who",
      "is",
      "{SUBJECT_COMPLEMENT}?"
    ],
    "slots": [
      "SUBJECT_COMPLEMENT"
    ]
  },
  "QUESTION_WHO_DID": {
    "tokens": [
      "Who",
      "did",
      "{SUBJECT}",
      "{VERB_BASE}",
      "{OBJECT?}?"
    ],
    "slots": [
      "SUBJECT",
      "VERB_BASE",
      "OBJECT?"
    ]
  },
  "QUESTION_WHICH_ONE": {
    "tokens": [
      "Which one",
      "{AUX}",
      "{SUBJECT}",
      "{VERB_BASE}?"
    ],
    "slots": [
      "AUX",
      "SUBJECT",
      "VERB_BASE"
    ]
  },
  "QUESTION_HOW_FAR": {
    "tokens": [
      "How far",
      "is",
      "{SUBJECT_COMPLEMENT}?"
    ],
    "slots": [
      "SUBJECT_COMPLEMENT"
    ]
  },
  "QUESTION_HOW_LONG_WILL": {
    "tokens": [
      "How long",
      "will",
      "{SUBJECT}",
      "{VERB_BASE}",
      "{OBJECT?}?"
    ],
    "slots": [
      "SUBJECT",
      "VERB_BASE",
      "OBJECT?"
    ]
  },
  "QUESTION_HOW_LONG_HAVE": {
    "tokens": [
      "How long",
      "have",
      "{SUBJECT}",
      "{VERB_PP}",
      "{OBJECT?}?"
    ],
    "slots": [
      "SUBJECT",
      "VERB_PP",
      "OBJECT?"
    ]
  },
  "QUESTION_HOW_MUCH_NEED": {
    "tokens": [
      "How much",
      "do",
      "{SUBJECT}",
      "need?"
    ],
    "slots": [
      "SUBJECT"
    ]
  },
  "HAVE_NOUN": {
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
  "DO_NOT_HAVE_NOUN": {
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
  "HAS_NOUN": {
    "tokens": [
      "{SUBJECT}",
      "has",
      "{OBJECT}"
    ],
    "slots": [
      "SUBJECT",
      "OBJECT"
    ]
  },
  "DOES_NOT_HAVE_NOUN": {
    "tokens": [
      "{SUBJECT}",
      "does not have",
      "{OBJECT}"
    ],
    "slots": [
      "SUBJECT",
      "OBJECT"
    ]
  },
  "CAN_VERB": {
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
  "CANNOT_VERB": {
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
  "MUST_VERB": {
    "tokens": [
      "{SUBJECT}",
      "must",
      "{VERB_BASE}",
      "{OBJECT?}"
    ],
    "slots": [
      "SUBJECT",
      "VERB_BASE",
      "OBJECT?"
    ]
  },
  "MUST_NOT_VERB": {
    "tokens": [
      "{SUBJECT}",
      "must not",
      "{VERB_BASE}",
      "{OBJECT?}"
    ],
    "slots": [
      "SUBJECT",
      "VERB_BASE",
      "OBJECT?"
    ]
  },
  "SHOULD_VERB": {
    "tokens": [
      "{SUBJECT}",
      "should",
      "{VERB_BASE}",
      "{OBJECT?}"
    ],
    "slots": [
      "SUBJECT",
      "VERB_BASE",
      "OBJECT?"
    ]
  },
  "SHOULD_NOT_VERB": {
    "tokens": [
      "{SUBJECT}",
      "should not",
      "{VERB_BASE}",
      "{OBJECT?}"
    ],
    "slots": [
      "SUBJECT",
      "VERB_BASE",
      "OBJECT?"
    ]
  },
  "MAY_VERB": {
    "tokens": [
      "{SUBJECT}",
      "may",
      "{VERB_BASE}",
      "{OBJECT?}"
    ],
    "slots": [
      "SUBJECT",
      "VERB_BASE",
      "OBJECT?"
    ]
  },
  "MIGHT_VERB": {
    "tokens": [
      "{SUBJECT}",
      "might",
      "{VERB_BASE}",
      "{OBJECT?}"
    ],
    "slots": [
      "SUBJECT",
      "VERB_BASE",
      "OBJECT?"
    ]
  },
  "PLAN_WILL": {
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
  "PLAN_BE_GOING_TO": {
    "tokens": [
      "{SUBJECT}",
      "{BE}",
      "going to",
      "{VERB_BASE}",
      "{OBJECT?}"
    ],
    "slots": [
      "SUBJECT",
      "BE",
      "VERB_BASE",
      "OBJECT?"
    ]
  },
  "PREFERENCE_PREFER": {
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
  "PREFERENCE_WOULD_RATHER": {
    "tokens": [
      "{SUBJECT}",
      "would rather",
      "{VERB_BASE}",
      "{OBJECT?}"
    ],
    "slots": [
      "SUBJECT",
      "VERB_BASE",
      "OBJECT?"
    ]
  },
  "ALREADY_PAST": {
    "tokens": [
      "{SUBJECT}",
      "already",
      "{VERB_PAST}",
      "{OBJECT?}"
    ],
    "slots": [
      "SUBJECT",
      "VERB_PAST",
      "OBJECT?"
    ]
  },
  "NOT_YET_PERFECT": {
    "tokens": [
      "{SUBJECT}",
      "have not",
      "{VERB_PP}",
      "{OBJECT?}",
      "yet"
    ],
    "slots": [
      "SUBJECT",
      "VERB_PP",
      "OBJECT?"
    ]
  },
  "JUST_PAST": {
    "tokens": [
      "{SUBJECT}",
      "just",
      "{VERB_PAST}",
      "{OBJECT?}"
    ],
    "slots": [
      "SUBJECT",
      "VERB_PAST",
      "OBJECT?"
    ]
  },
  "KNOW_OBJECT": {
    "tokens": [
      "{SUBJECT}",
      "know",
      "{OBJECT}"
    ],
    "slots": [
      "SUBJECT",
      "OBJECT"
    ]
  },
  "DO_NOT_KNOW_OBJECT": {
    "tokens": [
      "{SUBJECT}",
      "do not know",
      "{OBJECT}"
    ],
    "slots": [
      "SUBJECT",
      "OBJECT"
    ]
  }
});
})();