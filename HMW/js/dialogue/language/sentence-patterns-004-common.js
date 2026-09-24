(() => {
  "use strict";
  window.HMW = window.HMW || {};
  HMW.Dialogue = HMW.Dialogue || {};
  HMW.Dialogue.SENTENCE_PATTERNS = Object.assign(HMW.Dialogue.SENTENCE_PATTERNS || {}, {
  "PRESENT_SIMPLE_SV": {
    "tokens": [
      "{SUBJECT}",
      "{VERB}"
    ],
    "slots": [
      "SUBJECT",
      "VERB"
    ]
  },
  "PRESENT_SIMPLE_SVO": {
    "tokens": [
      "{SUBJECT}",
      "{VERB}",
      "{OBJECT}"
    ],
    "slots": [
      "SUBJECT",
      "VERB",
      "OBJECT"
    ]
  },
  "PRESENT_SIMPLE_NEG": {
    "tokens": [
      "{SUBJECT}",
      "{DO_AUX}",
      "not",
      "{VERB_BASE}",
      "{OBJECT?}"
    ],
    "slots": [
      "SUBJECT",
      "DO_AUX",
      "VERB_BASE",
      "OBJECT?"
    ]
  },
  "PRESENT_SIMPLE_QUESTION": {
    "tokens": [
      "{DO_AUX_CAP}",
      "{SUBJECT}",
      "{VERB_BASE}",
      "{OBJECT?}?"
    ],
    "slots": [
      "DO_AUX_CAP",
      "SUBJECT",
      "VERB_BASE",
      "OBJECT?"
    ]
  },
  "PAST_SIMPLE_SV": {
    "tokens": [
      "{SUBJECT}",
      "{VERB_PAST}"
    ],
    "slots": [
      "SUBJECT",
      "VERB_PAST"
    ]
  },
  "PAST_SIMPLE_SVO": {
    "tokens": [
      "{SUBJECT}",
      "{VERB_PAST}",
      "{OBJECT?}"
    ],
    "slots": [
      "SUBJECT",
      "VERB_PAST",
      "OBJECT?"
    ]
  },
  "PAST_SIMPLE_NEG": {
    "tokens": [
      "{SUBJECT}",
      "did not",
      "{VERB_BASE}",
      "{OBJECT?}"
    ],
    "slots": [
      "SUBJECT",
      "VERB_BASE",
      "OBJECT?"
    ]
  },
  "PAST_SIMPLE_QUESTION": {
    "tokens": [
      "Did",
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
  "FUTURE_SIMPLE": {
    "tokens": [
      "{SUBJECT}",
      "will",
      "{VERB_BASE}",
      "{OBJECT?}"
    ],
    "slots": [
      "SUBJECT",
      "VERB_BASE",
      "OBJECT?"
    ]
  },
  "FUTURE_NEG": {
    "tokens": [
      "{SUBJECT}",
      "will not",
      "{VERB_BASE}",
      "{OBJECT?}"
    ],
    "slots": [
      "SUBJECT",
      "VERB_BASE",
      "OBJECT?"
    ]
  },
  "FUTURE_QUESTION": {
    "tokens": [
      "Will",
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
  "PRESENT_CONTINUOUS": {
    "tokens": [
      "{SUBJECT}",
      "{BE}",
      "{VERB_ING}",
      "{OBJECT?}"
    ],
    "slots": [
      "SUBJECT",
      "BE",
      "VERB_ING",
      "OBJECT?"
    ]
  },
  "PRESENT_CONTINUOUS_NEG": {
    "tokens": [
      "{SUBJECT}",
      "{BE}",
      "not",
      "{VERB_ING}",
      "{OBJECT?}"
    ],
    "slots": [
      "SUBJECT",
      "BE",
      "VERB_ING",
      "OBJECT?"
    ]
  },
  "PRESENT_CONTINUOUS_QUESTION": {
    "tokens": [
      "{BE_CAP}",
      "{SUBJECT}",
      "{VERB_ING}",
      "{OBJECT?}?"
    ],
    "slots": [
      "BE_CAP",
      "SUBJECT",
      "VERB_ING",
      "OBJECT?"
    ]
  },
  "PRESENT_PERFECT_SIMPLE": {
    "tokens": [
      "{SUBJECT}",
      "{HAVE_AUX}",
      "{VERB_PP}",
      "{OBJECT?}"
    ],
    "slots": [
      "SUBJECT",
      "HAVE_AUX",
      "VERB_PP",
      "OBJECT?"
    ]
  },
  "PRESENT_PERFECT_QUESTION": {
    "tokens": [
      "{HAVE_AUX_CAP}",
      "{SUBJECT}",
      "{VERB_PP}",
      "{OBJECT?}?"
    ],
    "slots": [
      "HAVE_AUX_CAP",
      "SUBJECT",
      "VERB_PP",
      "OBJECT?"
    ]
  },
  "MODAL_MUST": {
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
  "MODAL_MUST_NOT": {
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
  "MODAL_MAY": {
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
  "MODAL_MIGHT": {
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
  "MODAL_WOULD": {
    "tokens": [
      "{SUBJECT}",
      "would",
      "{VERB_BASE}",
      "{OBJECT?}"
    ],
    "slots": [
      "SUBJECT",
      "VERB_BASE",
      "OBJECT?"
    ]
  },
  "MODAL_COULD": {
    "tokens": [
      "{SUBJECT}",
      "could",
      "{VERB_BASE}",
      "{OBJECT?}"
    ],
    "slots": [
      "SUBJECT",
      "VERB_BASE",
      "OBJECT?"
    ]
  },
  "QUESTION_WHAT_DID": {
    "tokens": [
      "What",
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
  "QUESTION_WHAT_WILL": {
    "tokens": [
      "What",
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
  "QUESTION_WHERE_ARE": {
    "tokens": [
      "Where",
      "are",
      "{SUBJECT}?"
    ],
    "slots": [
      "SUBJECT"
    ]
  },
  "QUESTION_WHERE_WERE": {
    "tokens": [
      "Where",
      "were",
      "{SUBJECT}?"
    ],
    "slots": [
      "SUBJECT"
    ]
  },
  "QUESTION_WHERE_WILL": {
    "tokens": [
      "Where",
      "will",
      "{SUBJECT}",
      "{VERB_BASE}?"
    ],
    "slots": [
      "SUBJECT",
      "VERB_BASE"
    ]
  },
  "QUESTION_WHEN_DID": {
    "tokens": [
      "When",
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
  "QUESTION_WHEN_WILL": {
    "tokens": [
      "When",
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
  "QUESTION_WHY_DID": {
    "tokens": [
      "Why",
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
  "QUESTION_WHY_DO": {
    "tokens": [
      "Why",
      "{DO_AUX}",
      "{SUBJECT}",
      "{VERB_BASE}",
      "{OBJECT?}?"
    ],
    "slots": [
      "DO_AUX",
      "SUBJECT",
      "VERB_BASE",
      "OBJECT?"
    ]
  },
  "QUESTION_HOW_ARE": {
    "tokens": [
      "How",
      "are",
      "{SUBJECT}?"
    ],
    "slots": [
      "SUBJECT"
    ]
  },
  "QUESTION_HOW_DID": {
    "tokens": [
      "How",
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
  "REQUEST_CAN_YOU": {
    "tokens": [
      "Can",
      "you",
      "{VERB_BASE}",
      "{OBJECT?}?"
    ],
    "slots": [
      "VERB_BASE",
      "OBJECT?"
    ]
  },
  "REQUEST_COULD_YOU": {
    "tokens": [
      "Could",
      "you",
      "{VERB_BASE}",
      "{OBJECT?}?"
    ],
    "slots": [
      "VERB_BASE",
      "OBJECT?"
    ]
  },
  "REQUEST_WOULD_YOU": {
    "tokens": [
      "Would",
      "you",
      "{VERB_BASE}",
      "{OBJECT?}?"
    ],
    "slots": [
      "VERB_BASE",
      "OBJECT?"
    ]
  },
  "REQUEST_PLEASE": {
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
  "OFFER_CAN_I": {
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
  "OFFER_SHALL_I": {
    "tokens": [
      "Shall",
      "I",
      "{VERB_BASE}",
      "{OBJECT?}?"
    ],
    "slots": [
      "VERB_BASE",
      "OBJECT?"
    ]
  },
  "SUGGEST_LETS": {
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
  "SUGGEST_SHOULD": {
    "tokens": [
      "We",
      "should",
      "{VERB_BASE}",
      "{OBJECT?}"
    ],
    "slots": [
      "VERB_BASE",
      "OBJECT?"
    ]
  },
  "WANT_TO_PATTERN": {
    "tokens": [
      "{SUBJECT}",
      "want to",
      "{VERB_BASE}",
      "{OBJECT?}"
    ],
    "slots": [
      "SUBJECT",
      "VERB_BASE",
      "OBJECT?"
    ]
  },
  "NEED_TO_PATTERN": {
    "tokens": [
      "{SUBJECT}",
      "need to",
      "{VERB_BASE}",
      "{OBJECT?}"
    ],
    "slots": [
      "SUBJECT",
      "VERB_BASE",
      "OBJECT?"
    ]
  },
  "HAVE_TO_PATTERN": {
    "tokens": [
      "{SUBJECT}",
      "have to",
      "{VERB_BASE}",
      "{OBJECT?}"
    ],
    "slots": [
      "SUBJECT",
      "VERB_BASE",
      "OBJECT?"
    ]
  },
  "FEEL_ADJECTIVE": {
    "tokens": [
      "{SUBJECT}",
      "feel",
      "{ADJECTIVE}"
    ],
    "slots": [
      "SUBJECT",
      "ADJECTIVE"
    ]
  },
  "LOOK_ADJECTIVE": {
    "tokens": [
      "{SUBJECT}",
      "look",
      "{ADJECTIVE}"
    ],
    "slots": [
      "SUBJECT",
      "ADJECTIVE"
    ]
  },
  "SOUND_ADJECTIVE": {
    "tokens": [
      "That",
      "sounds",
      "{ADJECTIVE}"
    ],
    "slots": [
      "ADJECTIVE"
    ]
  },
  "BECAUSE_REASON": {
    "tokens": [
      "{CLAUSE_A}",
      "because",
      "{CLAUSE_B}"
    ],
    "slots": [
      "CLAUSE_A",
      "CLAUSE_B"
    ]
  },
  "IF_CONDITION": {
    "tokens": [
      "If",
      "{CLAUSE_A},",
      "{CLAUSE_B}"
    ],
    "slots": [
      "CLAUSE_A",
      "CLAUSE_B"
    ]
  },
  "UNTIL_TIME": {
    "tokens": [
      "{CLAUSE_A}",
      "until",
      "{CLAUSE_B}"
    ],
    "slots": [
      "CLAUSE_A",
      "CLAUSE_B"
    ]
  }
});
})();
