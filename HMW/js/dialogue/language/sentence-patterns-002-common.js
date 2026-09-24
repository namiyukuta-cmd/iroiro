(() => {
  "use strict";
  window.HMW = window.HMW || {};
  HMW.Dialogue = HMW.Dialogue || {};
  HMW.Dialogue.SENTENCE_PATTERNS = Object.assign(
    HMW.Dialogue.SENTENCE_PATTERNS || {},
    {
  "SVO_ADVERB": {
    "tokens": [
      "{SUBJECT}",
      "{VERB}",
      "{OBJECT}",
      "{ADVERB?}"
    ],
    "slots": [
      "SUBJECT",
      "VERB",
      "OBJECT",
      "ADVERB?"
    ]
  },
  "SVC_ADJECTIVE": {
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
  "SVC_PREP": {
    "tokens": [
      "{SUBJECT}",
      "{BE}",
      "{PREP_PHRASE}"
    ],
    "slots": [
      "SUBJECT",
      "BE",
      "PREP_PHRASE"
    ]
  },
  "SVO_PREP": {
    "tokens": [
      "{SUBJECT}",
      "{VERB}",
      "{OBJECT}",
      "{PREP_PHRASE?}"
    ],
    "slots": [
      "SUBJECT",
      "VERB",
      "OBJECT",
      "PREP_PHRASE?"
    ]
  },
  "SVO_TO_INF": {
    "tokens": [
      "{SUBJECT}",
      "{VERB}",
      "{OBJECT}",
      "to",
      "{VERB2}",
      "{OBJECT2?}"
    ],
    "slots": [
      "SUBJECT",
      "VERB",
      "OBJECT",
      "VERB2",
      "OBJECT2?"
    ]
  },
  "SV_TO_INF": {
    "tokens": [
      "{SUBJECT}",
      "{VERB}",
      "to",
      "{VERB2}",
      "{OBJECT?}"
    ],
    "slots": [
      "SUBJECT",
      "VERB",
      "VERB2",
      "OBJECT?"
    ]
  },
  "SV_GERUND": {
    "tokens": [
      "{SUBJECT}",
      "{VERB}",
      "{VERB_ING}",
      "{OBJECT?}"
    ],
    "slots": [
      "SUBJECT",
      "VERB",
      "VERB_ING",
      "OBJECT?"
    ]
  },
  "BE_GOING_TO": {
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
  "BE_NOT_GOING_TO": {
    "tokens": [
      "{SUBJECT}",
      "{BE}",
      "not going to",
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
  "PAST_BE_ADJ": {
    "tokens": [
      "{SUBJECT}",
      "{BE_PAST}",
      "{ADJECTIVE}"
    ],
    "slots": [
      "SUBJECT",
      "BE_PAST",
      "ADJECTIVE"
    ]
  },
  "PAST_NEGATIVE_DO": {
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
  "PRESENT_PERFECT_NEGATIVE": {
    "tokens": [
      "{SUBJECT}",
      "{HAVE_AUX}",
      "not",
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
  "QUESTION_HAVE_YOU": {
    "tokens": [
      "Have",
      "you",
      "{VERB_PP}",
      "{OBJECT?}?"
    ],
    "slots": [
      "VERB_PP",
      "OBJECT?"
    ]
  },
  "QUESTION_DID_YOU": {
    "tokens": [
      "Did",
      "you",
      "{VERB_BASE}",
      "{OBJECT?}?"
    ],
    "slots": [
      "VERB_BASE",
      "OBJECT?"
    ]
  },
  "QUESTION_DO_YOU": {
    "tokens": [
      "Do",
      "you",
      "{VERB_BASE}",
      "{OBJECT?}?"
    ],
    "slots": [
      "VERB_BASE",
      "OBJECT?"
    ]
  },
  "QUESTION_ARE_YOU": {
    "tokens": [
      "Are",
      "you",
      "{ADJECTIVE_OR_PROGRESSIVE}?"
    ],
    "slots": [
      "ADJECTIVE_OR_PROGRESSIVE"
    ]
  },
  "QUESTION_CAN_I": {
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
  "QUESTION_CAN_YOU": {
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
  "QUESTION_WILL_YOU": {
    "tokens": [
      "Will",
      "you",
      "{VERB_BASE}",
      "{OBJECT?}?"
    ],
    "slots": [
      "VERB_BASE",
      "OBJECT?"
    ]
  },
  "QUESTION_WOULD_YOU": {
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
  "QUESTION_WHY_ARE": {
    "tokens": [
      "Why",
      "are",
      "you",
      "{ADJECTIVE_OR_PROGRESSIVE}?"
    ],
    "slots": [
      "ADJECTIVE_OR_PROGRESSIVE"
    ]
  },
  "QUESTION_WHAT_IS": {
    "tokens": [
      "What",
      "is",
      "{SUBJECT}?"
    ],
    "slots": [
      "SUBJECT"
    ]
  },
  "QUESTION_WHAT_DO_YOU": {
    "tokens": [
      "What",
      "do",
      "you",
      "{VERB_BASE}",
      "{OBJECT?}?"
    ],
    "slots": [
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
  "QUESTION_WHO_IS": {
    "tokens": [
      "Who",
      "is",
      "{SUBJECT}?"
    ],
    "slots": [
      "SUBJECT"
    ]
  },
  "IMPERATIVE_PLEASE_END": {
    "tokens": [
      "{VERB_BASE}",
      "{OBJECT?},",
      "please"
    ],
    "slots": [
      "VERB_BASE",
      "OBJECT?"
    ]
  },
  "DONT_IMPERATIVE": {
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
  "NEVER_IMPERATIVE": {
    "tokens": [
      "Never",
      "{VERB_BASE}",
      "{OBJECT?}"
    ],
    "slots": [
      "VERB_BASE",
      "OBJECT?"
    ]
  },
  "LET_ME_VERB": {
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
  "LETS_VERB": {
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
  "THERE_IS": {
    "tokens": [
      "There",
      "is",
      "{ARTICLE?}",
      "{NOUN}",
      "{PREP_PHRASE?}"
    ],
    "slots": [
      "ARTICLE?",
      "NOUN",
      "PREP_PHRASE?"
    ]
  },
  "THERE_ARE": {
    "tokens": [
      "There",
      "are",
      "{NOUN_PLURAL}",
      "{PREP_PHRASE?}"
    ],
    "slots": [
      "NOUN_PLURAL",
      "PREP_PHRASE?"
    ]
  },
  "IT_IS_ADJ_TO": {
    "tokens": [
      "It",
      "is",
      "{ADJECTIVE}",
      "to",
      "{VERB_BASE}",
      "{OBJECT?}"
    ],
    "slots": [
      "ADJECTIVE",
      "VERB_BASE",
      "OBJECT?"
    ]
  },
  "IT_IS_ADJ_THAT": {
    "tokens": [
      "It",
      "is",
      "{ADJECTIVE}",
      "that",
      "{CLAUSE}"
    ],
    "slots": [
      "ADJECTIVE",
      "CLAUSE"
    ]
  },
  "I_THINK_CLAUSE": {
    "tokens": [
      "I",
      "think",
      "{CLAUSE}"
    ],
    "slots": [
      "CLAUSE"
    ]
  },
  "I_DONT_THINK_CLAUSE": {
    "tokens": [
      "I",
      "do not think",
      "{CLAUSE}"
    ],
    "slots": [
      "CLAUSE"
    ]
  },
  "I_KNOW_CLAUSE": {
    "tokens": [
      "I",
      "know",
      "{CLAUSE}"
    ],
    "slots": [
      "CLAUSE"
    ]
  },
  "I_DONT_KNOW_IF": {
    "tokens": [
      "I",
      "do not know if",
      "{CLAUSE}"
    ],
    "slots": [
      "CLAUSE"
    ]
  },
  "BECAUSE_CLAUSE": {
    "tokens": [
      "Because",
      "{CLAUSE_A},",
      "{CLAUSE_B}"
    ],
    "slots": [
      "CLAUSE_A",
      "CLAUSE_B"
    ]
  },
  "SO_CLAUSE": {
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
  "IF_THEN": {
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
  "WHEN_CLAUSE": {
    "tokens": [
      "When",
      "{CLAUSE_A},",
      "{CLAUSE_B}"
    ],
    "slots": [
      "CLAUSE_A",
      "CLAUSE_B"
    ]
  },
  "EVEN_IF_CLAUSE": {
    "tokens": [
      "Even if",
      "{CLAUSE_A},",
      "{CLAUSE_B}"
    ],
    "slots": [
      "CLAUSE_A",
      "CLAUSE_B"
    ]
  },
  "ALTHOUGH_CLAUSE": {
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
  "NOT_BECAUSE_BUT": {
    "tokens": [
      "Not because",
      "{CLAUSE_A},",
      "but because",
      "{CLAUSE_B}"
    ],
    "slots": [
      "CLAUSE_A",
      "CLAUSE_B"
    ]
  },
  "BOTH_AND": {
    "tokens": [
      "{SUBJECT}",
      "{VERB}",
      "both",
      "{OBJECT_A}",
      "and",
      "{OBJECT_B}"
    ],
    "slots": [
      "SUBJECT",
      "VERB",
      "OBJECT_A",
      "OBJECT_B"
    ]
  },
  "EITHER_OR": {
    "tokens": [
      "{SUBJECT}",
      "can",
      "either",
      "{VERB_A}",
      "or",
      "{VERB_B}"
    ],
    "slots": [
      "SUBJECT",
      "VERB_A",
      "VERB_B"
    ]
  },
  "NEITHER_NOR": {
    "tokens": [
      "{SUBJECT}",
      "will",
      "neither",
      "{VERB_A}",
      "nor",
      "{VERB_B}"
    ],
    "slots": [
      "SUBJECT",
      "VERB_A",
      "VERB_B"
    ]
  }
}
  );
})();
