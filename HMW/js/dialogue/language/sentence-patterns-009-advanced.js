(() => {
 "use strict";
 window.HMW=window.HMW||{}; HMW.Dialogue=HMW.Dialogue||{};
 HMW.Dialogue.SENTENCE_PATTERNS=Object.assign(HMW.Dialogue.SENTENCE_PATTERNS||{},{
  "PASSIVE_PRESENT": {
    "tokens": [
      "{SUBJECT}",
      "{BE}",
      "{VERB_PP}",
      "{COMPLEMENT?}"
    ],
    "slots": [
      "SUBJECT",
      "BE",
      "VERB_PP",
      "COMPLEMENT?"
    ]
  },
  "PASSIVE_PAST": {
    "tokens": [
      "{SUBJECT}",
      "{BE_PAST}",
      "{VERB_PP}",
      "{COMPLEMENT?}"
    ],
    "slots": [
      "SUBJECT",
      "BE_PAST",
      "VERB_PP",
      "COMPLEMENT?"
    ]
  },
  "PASSIVE_FUTURE": {
    "tokens": [
      "{SUBJECT}",
      "will be",
      "{VERB_PP}",
      "{COMPLEMENT?}"
    ],
    "slots": [
      "SUBJECT",
      "VERB_PP",
      "COMPLEMENT?"
    ]
  },
  "PASSIVE_MODAL": {
    "tokens": [
      "{SUBJECT}",
      "{MODAL}",
      "be",
      "{VERB_PP}",
      "{COMPLEMENT?}"
    ],
    "slots": [
      "SUBJECT",
      "MODAL",
      "VERB_PP",
      "COMPLEMENT?"
    ]
  },
  "RELATIVE_WHO": {
    "tokens": [
      "{NOUN_PHRASE}",
      "who",
      "{VERB}",
      "{OBJECT?}"
    ],
    "slots": [
      "NOUN_PHRASE",
      "VERB",
      "OBJECT?"
    ]
  },
  "RELATIVE_WHICH": {
    "tokens": [
      "{NOUN_PHRASE}",
      "which",
      "{VERB}",
      "{OBJECT?}"
    ],
    "slots": [
      "NOUN_PHRASE",
      "VERB",
      "OBJECT?"
    ]
  },
  "RELATIVE_THAT": {
    "tokens": [
      "{NOUN_PHRASE}",
      "that",
      "{SUBJECT}",
      "{VERB}"
    ],
    "slots": [
      "NOUN_PHRASE",
      "SUBJECT",
      "VERB"
    ]
  },
  "RELATIVE_WHERE": {
    "tokens": [
      "{PLACE}",
      "where",
      "{SUBJECT}",
      "{VERB}",
      "{OBJECT?}"
    ],
    "slots": [
      "PLACE",
      "SUBJECT",
      "VERB",
      "OBJECT?"
    ]
  },
  "RELATIVE_WHEN": {
    "tokens": [
      "{TIME}",
      "when",
      "{SUBJECT}",
      "{VERB}",
      "{OBJECT?}"
    ],
    "slots": [
      "TIME",
      "SUBJECT",
      "VERB",
      "OBJECT?"
    ]
  },
  "EMBEDDED_WHAT": {
    "tokens": [
      "{SUBJECT}",
      "{VERB}",
      "what",
      "{CLAUSE_SUBJECT}",
      "{CLAUSE_VERB}"
    ],
    "slots": [
      "SUBJECT",
      "VERB",
      "CLAUSE_SUBJECT",
      "CLAUSE_VERB"
    ]
  },
  "EMBEDDED_WHERE": {
    "tokens": [
      "{SUBJECT}",
      "{VERB}",
      "where",
      "{CLAUSE_SUBJECT}",
      "{CLAUSE_VERB}"
    ],
    "slots": [
      "SUBJECT",
      "VERB",
      "CLAUSE_SUBJECT",
      "CLAUSE_VERB"
    ]
  },
  "EMBEDDED_WHEN": {
    "tokens": [
      "{SUBJECT}",
      "{VERB}",
      "when",
      "{CLAUSE_SUBJECT}",
      "{CLAUSE_VERB}"
    ],
    "slots": [
      "SUBJECT",
      "VERB",
      "CLAUSE_SUBJECT",
      "CLAUSE_VERB"
    ]
  },
  "EMBEDDED_WHY": {
    "tokens": [
      "{SUBJECT}",
      "{VERB}",
      "why",
      "{CLAUSE_SUBJECT}",
      "{CLAUSE_VERB}"
    ],
    "slots": [
      "SUBJECT",
      "VERB",
      "CLAUSE_SUBJECT",
      "CLAUSE_VERB"
    ]
  },
  "EMBEDDED_HOW": {
    "tokens": [
      "{SUBJECT}",
      "{VERB}",
      "how",
      "{CLAUSE_SUBJECT}",
      "{CLAUSE_VERB}"
    ],
    "slots": [
      "SUBJECT",
      "VERB",
      "CLAUSE_SUBJECT",
      "CLAUSE_VERB"
    ]
  },
  "REPORTED_SAID_THAT": {
    "tokens": [
      "{SUBJECT}",
      "said that",
      "{CLAUSE}"
    ],
    "slots": [
      "SUBJECT",
      "CLAUSE"
    ]
  },
  "REPORTED_TOLD_OBJECT": {
    "tokens": [
      "{SUBJECT}",
      "told",
      "{OBJECT}",
      "that",
      "{CLAUSE}"
    ],
    "slots": [
      "SUBJECT",
      "OBJECT",
      "CLAUSE"
    ]
  },
  "REPORTED_ASKED_IF": {
    "tokens": [
      "{SUBJECT}",
      "asked if",
      "{CLAUSE}"
    ],
    "slots": [
      "SUBJECT",
      "CLAUSE"
    ]
  },
  "REPORTED_ASKED_WH": {
    "tokens": [
      "{SUBJECT}",
      "asked",
      "{WH_WORD}",
      "{CLAUSE}"
    ],
    "slots": [
      "SUBJECT",
      "WH_WORD",
      "CLAUSE"
    ]
  },
  "CONDITIONAL_ZERO": {
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
  "CONDITIONAL_FIRST": {
    "tokens": [
      "If",
      "{CLAUSE_A},",
      "{SUBJECT}",
      "will",
      "{VERB_BASE}",
      "{OBJECT?}"
    ],
    "slots": [
      "CLAUSE_A",
      "SUBJECT",
      "VERB_BASE",
      "OBJECT?"
    ]
  },
  "CONDITIONAL_SECOND": {
    "tokens": [
      "If",
      "{CLAUSE_A},",
      "{SUBJECT}",
      "would",
      "{VERB_BASE}",
      "{OBJECT?}"
    ],
    "slots": [
      "CLAUSE_A",
      "SUBJECT",
      "VERB_BASE",
      "OBJECT?"
    ]
  },
  "CONDITIONAL_WOULD_IF": {
    "tokens": [
      "{SUBJECT}",
      "would",
      "{VERB_BASE}",
      "{OBJECT?}",
      "if",
      "{CLAUSE}"
    ],
    "slots": [
      "SUBJECT",
      "VERB_BASE",
      "OBJECT?",
      "CLAUSE"
    ]
  },
  "UNLESS_CONDITION": {
    "tokens": [
      "{CLAUSE_A}",
      "unless",
      "{CLAUSE_B}"
    ],
    "slots": [
      "CLAUSE_A",
      "CLAUSE_B"
    ]
  },
  "IN_CASE_CONDITION": {
    "tokens": [
      "{CLAUSE_A}",
      "in case",
      "{CLAUSE_B}"
    ],
    "slots": [
      "CLAUSE_A",
      "CLAUSE_B"
    ]
  },
  "AS_LONG_AS_CONDITION": {
    "tokens": [
      "{CLAUSE_A}",
      "as long as",
      "{CLAUSE_B}"
    ],
    "slots": [
      "CLAUSE_A",
      "CLAUSE_B"
    ]
  },
  "BECAUSE_OF_NOUN": {
    "tokens": [
      "{CLAUSE}",
      "because of",
      "{NOUN_PHRASE}"
    ],
    "slots": [
      "CLAUSE",
      "NOUN_PHRASE"
    ]
  },
  "DUE_TO_NOUN": {
    "tokens": [
      "{CLAUSE}",
      "due to",
      "{NOUN_PHRASE}"
    ],
    "slots": [
      "CLAUSE",
      "NOUN_PHRASE"
    ]
  },
  "SO_RESULT": {
    "tokens": [
      "{CLAUSE_A},",
      "so",
      "{CLAUSE_B}"
    ],
    "slots": [
      "CLAUSE_A",
      "CLAUSE_B"
    ]
  },
  "THEREFORE_RESULT": {
    "tokens": [
      "{CLAUSE_A}.",
      "Therefore,",
      "{CLAUSE_B}"
    ],
    "slots": [
      "CLAUSE_A",
      "CLAUSE_B"
    ]
  },
  "SO_ADJ_THAT": {
    "tokens": [
      "{SUBJECT}",
      "{BE}",
      "so",
      "{ADJECTIVE}",
      "that",
      "{CLAUSE}"
    ],
    "slots": [
      "SUBJECT",
      "BE",
      "ADJECTIVE",
      "CLAUSE"
    ]
  },
  "TOO_ADJ_TO": {
    "tokens": [
      "{SUBJECT}",
      "{BE}",
      "too",
      "{ADJECTIVE}",
      "to",
      "{VERB_BASE}",
      "{OBJECT?}"
    ],
    "slots": [
      "SUBJECT",
      "BE",
      "ADJECTIVE",
      "VERB_BASE",
      "OBJECT?"
    ]
  },
  "ADJ_ENOUGH_TO": {
    "tokens": [
      "{SUBJECT}",
      "{BE}",
      "{ADJECTIVE}",
      "enough to",
      "{VERB_BASE}",
      "{OBJECT?}"
    ],
    "slots": [
      "SUBJECT",
      "BE",
      "ADJECTIVE",
      "VERB_BASE",
      "OBJECT?"
    ]
  },
  "MORE_ADJ_THAN": {
    "tokens": [
      "{SUBJECT}",
      "{BE}",
      "more",
      "{ADJECTIVE}",
      "than",
      "{OBJECT}"
    ],
    "slots": [
      "SUBJECT",
      "BE",
      "ADJECTIVE",
      "OBJECT"
    ]
  },
  "LESS_ADJ_THAN": {
    "tokens": [
      "{SUBJECT}",
      "{BE}",
      "less",
      "{ADJECTIVE}",
      "than",
      "{OBJECT}"
    ],
    "slots": [
      "SUBJECT",
      "BE",
      "ADJECTIVE",
      "OBJECT"
    ]
  },
  "AS_ADJ_AS": {
    "tokens": [
      "{SUBJECT}",
      "{BE}",
      "as",
      "{ADJECTIVE}",
      "as",
      "{OBJECT}"
    ],
    "slots": [
      "SUBJECT",
      "BE",
      "ADJECTIVE",
      "OBJECT"
    ]
  },
  "NOT_AS_ADJ_AS": {
    "tokens": [
      "{SUBJECT}",
      "{BE}",
      "not as",
      "{ADJECTIVE}",
      "as",
      "{OBJECT}"
    ],
    "slots": [
      "SUBJECT",
      "BE",
      "ADJECTIVE",
      "OBJECT"
    ]
  },
  "THE_MORE_THE_MORE": {
    "tokens": [
      "The more",
      "{CLAUSE_A},",
      "the more",
      "{CLAUSE_B}"
    ],
    "slots": [
      "CLAUSE_A",
      "CLAUSE_B"
    ]
  },
  "BEFORE_CLAUSE": {
    "tokens": [
      "Before",
      "{CLAUSE_A},",
      "{CLAUSE_B}"
    ],
    "slots": [
      "CLAUSE_A",
      "CLAUSE_B"
    ]
  },
  "AFTER_CLAUSE": {
    "tokens": [
      "After",
      "{CLAUSE_A},",
      "{CLAUSE_B}"
    ],
    "slots": [
      "CLAUSE_A",
      "CLAUSE_B"
    ]
  },
  "WHILE_CLAUSE": {
    "tokens": [
      "While",
      "{CLAUSE_A},",
      "{CLAUSE_B}"
    ],
    "slots": [
      "CLAUSE_A",
      "CLAUSE_B"
    ]
  },
  "AS_SOON_AS": {
    "tokens": [
      "As soon as",
      "{CLAUSE_A},",
      "{CLAUSE_B}"
    ],
    "slots": [
      "CLAUSE_A",
      "CLAUSE_B"
    ]
  },
  "BY_THE_TIME": {
    "tokens": [
      "By the time",
      "{CLAUSE_A},",
      "{CLAUSE_B}"
    ],
    "slots": [
      "CLAUSE_A",
      "CLAUSE_B"
    ]
  },
  "UNTIL_CLAUSE": {
    "tokens": [
      "{CLAUSE_A}",
      "until",
      "{CLAUSE_B}"
    ],
    "slots": [
      "CLAUSE_A",
      "CLAUSE_B"
    ]
  },
  "IN_ORDER_TO": {
    "tokens": [
      "{CLAUSE}",
      "in order to",
      "{VERB_BASE}",
      "{OBJECT?}"
    ],
    "slots": [
      "CLAUSE",
      "VERB_BASE",
      "OBJECT?"
    ]
  },
  "SO_THAT_PURPOSE": {
    "tokens": [
      "{CLAUSE_A}",
      "so that",
      "{CLAUSE_B}"
    ],
    "slots": [
      "CLAUSE_A",
      "CLAUSE_B"
    ]
  },
  "WITHOUT_GERUND": {
    "tokens": [
      "{CLAUSE}",
      "without",
      "{VERB_ING}",
      "{OBJECT?}"
    ],
    "slots": [
      "CLAUSE",
      "VERB_ING",
      "OBJECT?"
    ]
  },
  "BY_GERUND": {
    "tokens": [
      "{CLAUSE}",
      "by",
      "{VERB_ING}",
      "{OBJECT?}"
    ],
    "slots": [
      "CLAUSE",
      "VERB_ING",
      "OBJECT?"
    ]
  },
  "INSTEAD_OF_GERUND": {
    "tokens": [
      "{CLAUSE}",
      "instead of",
      "{VERB_ING}",
      "{OBJECT?}"
    ],
    "slots": [
      "CLAUSE",
      "VERB_ING",
      "OBJECT?"
    ]
  },
  "KEEP_GERUND": {
    "tokens": [
      "{SUBJECT}",
      "keep",
      "{VERB_ING}",
      "{OBJECT?}"
    ],
    "slots": [
      "SUBJECT",
      "VERB_ING",
      "OBJECT?"
    ]
  },
  "STOP_GERUND": {
    "tokens": [
      "{SUBJECT}",
      "stop",
      "{VERB_ING}",
      "{OBJECT?}"
    ],
    "slots": [
      "SUBJECT",
      "VERB_ING",
      "OBJECT?"
    ]
  }
});
})();