(() => {
  "use strict";
  window.HMW = window.HMW || {};
  HMW.Dialogue = HMW.Dialogue || {};
  HMW.Dialogue.SENTENCE_PATTERNS = Object.assign(
    HMW.Dialogue.SENTENCE_PATTERNS || {},
    {
  "DECLARATIVE_SVO": {
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
  "DECLARATIVE_BE_ADJ": {
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
  "DECLARATIVE_BE_NOUN": {
    "tokens": [
      "{SUBJECT}",
      "{BE}",
      "{ARTICLE?}",
      "{NOUN}"
    ],
    "slots": [
      "SUBJECT",
      "BE",
      "ARTICLE?",
      "NOUN"
    ]
  },
  "NEGATIVE_DO_SVO": {
    "tokens": [
      "{SUBJECT}",
      "{DO_AUX}",
      "not",
      "{VERB_BASE}",
      "{OBJECT}"
    ],
    "slots": [
      "SUBJECT",
      "DO_AUX",
      "VERB_BASE",
      "OBJECT"
    ]
  },
  "NEGATIVE_BE_ADJ": {
    "tokens": [
      "{SUBJECT}",
      "{BE}",
      "not",
      "{ADJECTIVE}"
    ],
    "slots": [
      "SUBJECT",
      "BE",
      "ADJECTIVE"
    ]
  },
  "FUTURE_WILL": {
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
  "FUTURE_WILL_NOT": {
    "tokens": [
      "{SUBJECT}",
      "will",
      "not",
      "{VERB_BASE}",
      "{OBJECT?}"
    ],
    "slots": [
      "SUBJECT",
      "VERB_BASE",
      "OBJECT?"
    ]
  },
  "MODAL_CAN": {
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
  "MODAL_CANNOT": {
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
  "MODAL_SHOULD": {
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
  "MODAL_SHOULD_NOT": {
    "tokens": [
      "{SUBJECT}",
      "should",
      "not",
      "{VERB_BASE}",
      "{OBJECT?}"
    ],
    "slots": [
      "SUBJECT",
      "VERB_BASE",
      "OBJECT?"
    ]
  },
  "WANT_TO": {
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
  "WANT_OBJECT_TO": {
    "tokens": [
      "{SUBJECT}",
      "want",
      "{OBJECT}",
      "to",
      "{VERB_BASE}",
      "{COMPLEMENT?}"
    ],
    "slots": [
      "SUBJECT",
      "OBJECT",
      "VERB_BASE",
      "COMPLEMENT?"
    ]
  },
  "NEED_TO": {
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
  "HAVE_TO": {
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
  "PRESENT_PROGRESSIVE": {
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
  "PAST_SVO": {
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
  "PRESENT_PERFECT": {
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
  "YES_NO_DO": {
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
  "YES_NO_BE": {
    "tokens": [
      "{BE_CAP}",
      "{SUBJECT}",
      "{ADJECTIVE_OR_NOUN}?"
    ],
    "slots": [
      "BE_CAP",
      "SUBJECT",
      "ADJECTIVE_OR_NOUN"
    ]
  },
  "YES_NO_CAN": {
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
  "WH_WHY_DO": {
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
  "WH_WHAT_DO": {
    "tokens": [
      "What",
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
  "WH_WHERE_BE": {
    "tokens": [
      "Where",
      "{BE}",
      "{SUBJECT}?"
    ],
    "slots": [
      "BE",
      "SUBJECT"
    ]
  },
  "WH_WHERE_GOING": {
    "tokens": [
      "Where",
      "{BE}",
      "{SUBJECT}",
      "going?"
    ],
    "slots": [
      "BE",
      "SUBJECT"
    ]
  },
  "WH_HOW_FEEL": {
    "tokens": [
      "How",
      "{DO_AUX}",
      "{SUBJECT}",
      "feel",
      "{COMPLEMENT?}?"
    ],
    "slots": [
      "DO_AUX",
      "SUBJECT",
      "COMPLEMENT?"
    ]
  },
  "IMPERATIVE": {
    "tokens": [
      "{VERB_BASE}",
      "{OBJECT?}"
    ],
    "slots": [
      "VERB_BASE",
      "OBJECT?"
    ]
  },
  "NEGATIVE_IMPERATIVE": {
    "tokens": [
      "Do",
      "not",
      "{VERB_BASE}",
      "{OBJECT?}"
    ],
    "slots": [
      "VERB_BASE",
      "OBJECT?"
    ]
  },
  "PLEASE_IMPERATIVE": {
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
  "LET_ME": {
    "tokens": [
      "Let",
      "me",
      "{VERB_BASE}",
      "{OBJECT?}"
    ],
    "slots": [
      "VERB_BASE",
      "OBJECT?"
    ]
  },
  "LET_US": {
    "tokens": [
      "Let",
      "us",
      "{VERB_BASE}",
      "{OBJECT?}"
    ],
    "slots": [
      "VERB_BASE",
      "OBJECT?"
    ]
  },
  "CONDITIONAL_IF": {
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
  "REASON_BECAUSE": {
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
  "CONTRAST_BUT": {
    "tokens": [
      "{CLAUSE_A},",
      "but",
      "{CLAUSE_B}"
    ],
    "slots": [
      "CLAUSE_A",
      "CLAUSE_B"
    ]
  },
  "SEQUENCE_AND": {
    "tokens": [
      "{CLAUSE_A},",
      "and",
      "{CLAUSE_B}"
    ],
    "slots": [
      "CLAUSE_A",
      "CLAUSE_B"
    ]
  }
}
  );
})();
