(() => {
  "use strict";
  window.HMW = window.HMW || {};
  HMW.Dialogue = HMW.Dialogue || {};
  HMW.Dialogue.SENTENCE_PATTERNS = Object.assign(HMW.Dialogue.SENTENCE_PATTERNS || {}, {
  "QUESTION_WHAT_ARE_YOU_DOING": {
    "tokens": [
      "What",
      "are",
      "you",
      "{VERB_ING}",
      "{OBJECT?}?"
    ],
    "slots": [
      "VERB_ING",
      "OBJECT?"
    ]
  },
  "QUESTION_WHAT_WERE_YOU_DOING": {
    "tokens": [
      "What",
      "were",
      "you",
      "{VERB_ING}",
      "{OBJECT?}?"
    ],
    "slots": [
      "VERB_ING",
      "OBJECT?"
    ]
  },
  "QUESTION_WHAT_HAVE_YOU_DONE": {
    "tokens": [
      "What",
      "have",
      "you",
      "{VERB_PP}",
      "{OBJECT?}?"
    ],
    "slots": [
      "VERB_PP",
      "OBJECT?"
    ]
  },
  "QUESTION_WHERE_ARE_YOU_GOING": {
    "tokens": [
      "Where",
      "are",
      "you",
      "going",
      "{COMPLEMENT?}?"
    ],
    "slots": [
      "COMPLEMENT?"
    ]
  },
  "QUESTION_WHERE_HAVE_YOU_BEEN": {
    "tokens": [
      "Where",
      "have",
      "you",
      "been?"
    ],
    "slots": []
  },
  "QUESTION_WHEN_ARE_YOU": {
    "tokens": [
      "When",
      "are",
      "you",
      "{VERB_ING}",
      "{OBJECT?}?"
    ],
    "slots": [
      "VERB_ING",
      "OBJECT?"
    ]
  },
  "QUESTION_WHO_ARE_YOU_WITH": {
    "tokens": [
      "Who",
      "are",
      "you",
      "with?"
    ],
    "slots": []
  },
  "QUESTION_WHO_WERE_YOU_WITH": {
    "tokens": [
      "Who",
      "were",
      "you",
      "with?"
    ],
    "slots": []
  },
  "QUESTION_WHO_DO_YOU_TRUST": {
    "tokens": [
      "Who",
      "do",
      "you",
      "trust?"
    ],
    "slots": []
  },
  "QUESTION_HOW_WAS": {
    "tokens": [
      "How",
      "was",
      "{NOUN_PHRASE}?"
    ],
    "slots": [
      "NOUN_PHRASE"
    ]
  },
  "QUESTION_HOW_DO_YOU_FEEL": {
    "tokens": [
      "How",
      "do",
      "you",
      "feel",
      "{COMPLEMENT?}?"
    ],
    "slots": [
      "COMPLEMENT?"
    ]
  },
  "QUESTION_IS_THERE": {
    "tokens": [
      "Is",
      "there",
      "{NOUN_PHRASE}?"
    ],
    "slots": [
      "NOUN_PHRASE"
    ]
  },
  "QUESTION_ARE_THERE": {
    "tokens": [
      "Are",
      "there",
      "{NOUN_PHRASE}?"
    ],
    "slots": [
      "NOUN_PHRASE"
    ]
  },
  "QUESTION_IS_SOMETHING": {
    "tokens": [
      "Is",
      "something",
      "{ADJECTIVE}?"
    ],
    "slots": [
      "ADJECTIVE"
    ]
  },
  "QUESTION_HAVE_YOU_EVER": {
    "tokens": [
      "Have",
      "you",
      "ever",
      "{VERB_PP}",
      "{OBJECT?}?"
    ],
    "slots": [
      "VERB_PP",
      "OBJECT?"
    ]
  },
  "QUESTION_HAVE_YOU_YET": {
    "tokens": [
      "Have",
      "you",
      "{VERB_PP}",
      "{OBJECT?}",
      "yet?"
    ],
    "slots": [
      "VERB_PP",
      "OBJECT?"
    ]
  },
  "QUESTION_DO_YOU_STILL": {
    "tokens": [
      "Do",
      "you",
      "still",
      "{VERB_BASE}",
      "{OBJECT?}?"
    ],
    "slots": [
      "VERB_BASE",
      "OBJECT?"
    ]
  },
  "QUESTION_DID_YOU_STILL": {
    "tokens": [
      "Did",
      "you",
      "still",
      "{VERB_BASE}",
      "{OBJECT?}?"
    ],
    "slots": [
      "VERB_BASE",
      "OBJECT?"
    ]
  },
  "DECLARATIVE_STILL_VERB": {
    "tokens": [
      "{SUBJECT}",
      "still",
      "{VERB}",
      "{OBJECT?}"
    ],
    "slots": [
      "SUBJECT",
      "VERB",
      "OBJECT?"
    ]
  },
  "DECLARATIVE_ALREADY_VERB": {
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
  "DECLARATIVE_JUST_VERB": {
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
  "DECLARATIVE_NEVER_VERB": {
    "tokens": [
      "{SUBJECT}",
      "never",
      "{VERB}",
      "{OBJECT?}"
    ],
    "slots": [
      "SUBJECT",
      "VERB",
      "OBJECT?"
    ]
  },
  "DECLARATIVE_ALWAYS_VERB": {
    "tokens": [
      "{SUBJECT}",
      "always",
      "{VERB}",
      "{OBJECT?}"
    ],
    "slots": [
      "SUBJECT",
      "VERB",
      "OBJECT?"
    ]
  },
  "DECLARATIVE_SOMETIMES_VERB": {
    "tokens": [
      "{SUBJECT}",
      "sometimes",
      "{VERB}",
      "{OBJECT?}"
    ],
    "slots": [
      "SUBJECT",
      "VERB",
      "OBJECT?"
    ]
  },
  "DECLARATIVE_PROBABLY_WILL": {
    "tokens": [
      "{SUBJECT}",
      "will probably",
      "{VERB_BASE}",
      "{OBJECT?}"
    ],
    "slots": [
      "SUBJECT",
      "VERB_BASE",
      "OBJECT?"
    ]
  },
  "DECLARATIVE_MAYBE_WILL": {
    "tokens": [
      "Maybe",
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
  "DECLARATIVE_USED_TO": {
    "tokens": [
      "{SUBJECT}",
      "used to",
      "{VERB_BASE}",
      "{OBJECT?}"
    ],
    "slots": [
      "SUBJECT",
      "VERB_BASE",
      "OBJECT?"
    ]
  },
  "DECLARATIVE_NO_LONGER": {
    "tokens": [
      "{SUBJECT}",
      "no longer",
      "{VERB}",
      "{OBJECT?}"
    ],
    "slots": [
      "SUBJECT",
      "VERB",
      "OBJECT?"
    ]
  },
  "DECLARATIVE_NOT_ANYMORE": {
    "tokens": [
      "{SUBJECT}",
      "do not",
      "{VERB_BASE}",
      "{OBJECT?}",
      "anymore"
    ],
    "slots": [
      "SUBJECT",
      "VERB_BASE",
      "OBJECT?"
    ]
  },
  "DECLARATIVE_NOT_YET": {
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
  "DECLARATIVE_FOR_TIME": {
    "tokens": [
      "{SUBJECT}",
      "have",
      "{VERB_PP}",
      "{OBJECT?}",
      "for",
      "{TIME_SPAN}"
    ],
    "slots": [
      "SUBJECT",
      "VERB_PP",
      "OBJECT?",
      "TIME_SPAN"
    ]
  },
  "DECLARATIVE_SINCE_TIME": {
    "tokens": [
      "{SUBJECT}",
      "have",
      "{VERB_PP}",
      "{OBJECT?}",
      "since",
      "{TIME_POINT}"
    ],
    "slots": [
      "SUBJECT",
      "VERB_PP",
      "OBJECT?",
      "TIME_POINT"
    ]
  },
  "CONDITIONAL_IF_CAN": {
    "tokens": [
      "If",
      "{SUBJECT_A}",
      "can",
      "{VERB_A},",
      "{SUBJECT_B}",
      "will",
      "{VERB_B}",
      "{OBJECT?}"
    ],
    "slots": [
      "SUBJECT_A",
      "VERB_A",
      "SUBJECT_B",
      "VERB_B",
      "OBJECT?"
    ]
  },
  "CONDITIONAL_IF_WANT": {
    "tokens": [
      "If",
      "you",
      "want,",
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
  "CONDITIONAL_IF_NEED": {
    "tokens": [
      "If",
      "you",
      "need",
      "{NOUN_PHRASE},",
      "{SUBJECT}",
      "can",
      "{VERB_BASE}",
      "{OBJECT?}"
    ],
    "slots": [
      "NOUN_PHRASE",
      "SUBJECT",
      "VERB_BASE",
      "OBJECT?"
    ]
  },
  "CONDITIONAL_UNLESS": {
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
  "CONDITIONAL_AS_LONG_AS": {
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
  "PURPOSE_TO": {
    "tokens": [
      "{CLAUSE_A}",
      "to",
      "{VERB_BASE}",
      "{OBJECT?}"
    ],
    "slots": [
      "CLAUSE_A",
      "VERB_BASE",
      "OBJECT?"
    ]
  },
  "PURPOSE_SO_THAT": {
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
  "REASON_SINCE": {
    "tokens": [
      "Since",
      "{CLAUSE_A},",
      "{CLAUSE_B}"
    ],
    "slots": [
      "CLAUSE_A",
      "CLAUSE_B"
    ]
  },
  "CONTRAST_ALTHOUGH": {
    "tokens": [
      "Although",
      "{CLAUSE_A},",
      "{CLAUSE_B}"
    ],
    "slots": [
      "CLAUSE_A",
      "CLAUSE_B"
    ]
  },
  "CONTRAST_EVEN_THOUGH": {
    "tokens": [
      "Even though",
      "{CLAUSE_A},",
      "{CLAUSE_B}"
    ],
    "slots": [
      "CLAUSE_A",
      "CLAUSE_B"
    ]
  },
  "CONTRAST_HOWEVER": {
    "tokens": [
      "{CLAUSE_A}.",
      "However,",
      "{CLAUSE_B}"
    ],
    "slots": [
      "CLAUSE_A",
      "CLAUSE_B"
    ]
  },
  "ADDITION_ALSO": {
    "tokens": [
      "{CLAUSE_A}.",
      "Also,",
      "{CLAUSE_B}"
    ],
    "slots": [
      "CLAUSE_A",
      "CLAUSE_B"
    ]
  },
  "ADDITION_BESIDES": {
    "tokens": [
      "{CLAUSE_A}.",
      "Besides,",
      "{CLAUSE_B}"
    ],
    "slots": [
      "CLAUSE_A",
      "CLAUSE_B"
    ]
  },
  "RESULT_THEREFORE": {
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
  "SEQUENCE_FIRST_THEN": {
    "tokens": [
      "First,",
      "{CLAUSE_A}.",
      "Then,",
      "{CLAUSE_B}"
    ],
    "slots": [
      "CLAUSE_A",
      "CLAUSE_B"
    ]
  },
  "SEQUENCE_BEFORE_AFTER": {
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
  "POLITE_WOULD_LIKE": {
    "tokens": [
      "{SUBJECT}",
      "would like",
      "{OBJECT}"
    ],
    "slots": [
      "SUBJECT",
      "OBJECT"
    ]
  },
  "POLITE_WOULD_LIKE_TO": {
    "tokens": [
      "{SUBJECT}",
      "would like to",
      "{VERB_BASE}",
      "{OBJECT?}"
    ],
    "slots": [
      "SUBJECT",
      "VERB_BASE",
      "OBJECT?"
    ]
  }
});
})();
