(() => {
  "use strict";
  window.HMW = window.HMW || {};
  HMW.Dialogue = HMW.Dialogue || {};
  HMW.Dialogue.SENTENCE_PATTERNS = Object.assign(
    HMW.Dialogue.SENTENCE_PATTERNS || {},
    {
  "DECLARATIVE_WITH_THAT": {
    "tokens": [
      "{SUBJECT}",
      "{VERB}",
      "that",
      "{CLAUSE}"
    ],
    "slots": [
      "SUBJECT",
      "VERB",
      "CLAUSE"
    ]
  },
  "DECLARATIVE_WITH_IF": {
    "tokens": [
      "{SUBJECT}",
      "{VERB}",
      "if",
      "{CLAUSE}"
    ],
    "slots": [
      "SUBJECT",
      "VERB",
      "CLAUSE"
    ]
  },
  "DECLARATIVE_WITH_WHAT": {
    "tokens": [
      "{SUBJECT}",
      "{VERB}",
      "what",
      "{CLAUSE}"
    ],
    "slots": [
      "SUBJECT",
      "VERB",
      "CLAUSE"
    ]
  },
  "DECLARATIVE_WITH_WHY": {
    "tokens": [
      "{SUBJECT}",
      "{VERB}",
      "why",
      "{CLAUSE}"
    ],
    "slots": [
      "SUBJECT",
      "VERB",
      "CLAUSE"
    ]
  },
  "DECLARATIVE_WITH_HOW": {
    "tokens": [
      "{SUBJECT}",
      "{VERB}",
      "how",
      "{CLAUSE}"
    ],
    "slots": [
      "SUBJECT",
      "VERB",
      "CLAUSE"
    ]
  },
  "DECLARATIVE_TOO_ADJ_TO": {
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
  "DECLARATIVE_ADJ_ENOUGH_TO": {
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
  "WOULD_LIKE_TO": {
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
  },
  "WOULD_NOT_LIKE_TO": {
    "tokens": [
      "{SUBJECT}",
      "would not like to",
      "{VERB_BASE}",
      "{OBJECT?}"
    ],
    "slots": [
      "SUBJECT",
      "VERB_BASE",
      "OBJECT?"
    ]
  },
  "WOULD_RATHER": {
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
  "HAD_BETTER": {
    "tokens": [
      "{SUBJECT}",
      "had better",
      "{VERB_BASE}",
      "{OBJECT?}"
    ],
    "slots": [
      "SUBJECT",
      "VERB_BASE",
      "OBJECT?"
    ]
  },
  "USED_TO": {
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
  "NOT_USED_TO": {
    "tokens": [
      "{SUBJECT}",
      "{BE}",
      "not used to",
      "{NOUN_OR_GERUND}"
    ],
    "slots": [
      "SUBJECT",
      "BE",
      "NOUN_OR_GERUND"
    ]
  },
  "GET_USED_TO": {
    "tokens": [
      "{SUBJECT}",
      "{BE}",
      "getting used to",
      "{NOUN_OR_GERUND}"
    ],
    "slots": [
      "SUBJECT",
      "BE",
      "NOUN_OR_GERUND"
    ]
  },
  "WANT_SOMEONE_TO": {
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
  "NEED_SOMEONE_TO": {
    "tokens": [
      "{SUBJECT}",
      "need",
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
  "ASK_SOMEONE_TO": {
    "tokens": [
      "{SUBJECT}",
      "ask",
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
  "TELL_SOMEONE_TO": {
    "tokens": [
      "{SUBJECT}",
      "tell",
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
  "TELL_SOMEONE_NOT_TO": {
    "tokens": [
      "{SUBJECT}",
      "tell",
      "{OBJECT}",
      "not to",
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
  "PROMISE_TO": {
    "tokens": [
      "{SUBJECT}",
      "promise to",
      "{VERB_BASE}",
      "{OBJECT?}"
    ],
    "slots": [
      "SUBJECT",
      "VERB_BASE",
      "OBJECT?"
    ]
  },
  "TRY_NOT_TO": {
    "tokens": [
      "{SUBJECT}",
      "try not to",
      "{VERB_BASE}",
      "{OBJECT?}"
    ],
    "slots": [
      "SUBJECT",
      "VERB_BASE",
      "OBJECT?"
    ]
  },
  "DECIDE_TO": {
    "tokens": [
      "{SUBJECT}",
      "decide to",
      "{VERB_BASE}",
      "{OBJECT?}"
    ],
    "slots": [
      "SUBJECT",
      "VERB_BASE",
      "OBJECT?"
    ]
  },
  "REFUSE_TO": {
    "tokens": [
      "{SUBJECT}",
      "refuse to",
      "{VERB_BASE}",
      "{OBJECT?}"
    ],
    "slots": [
      "SUBJECT",
      "VERB_BASE",
      "OBJECT?"
    ]
  },
  "AGREE_TO": {
    "tokens": [
      "{SUBJECT}",
      "agree to",
      "{VERB_BASE}",
      "{OBJECT?}"
    ],
    "slots": [
      "SUBJECT",
      "VERB_BASE",
      "OBJECT?"
    ]
  },
  "SEEM_TO": {
    "tokens": [
      "{SUBJECT}",
      "seem to",
      "{VERB_BASE}",
      "{OBJECT?}"
    ],
    "slots": [
      "SUBJECT",
      "VERB_BASE",
      "OBJECT?"
    ]
  },
  "APPEAR_TO": {
    "tokens": [
      "{SUBJECT}",
      "appear to",
      "{VERB_BASE}",
      "{OBJECT?}"
    ],
    "slots": [
      "SUBJECT",
      "VERB_BASE",
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
  },
  "START_GERUND": {
    "tokens": [
      "{SUBJECT}",
      "start",
      "{VERB_ING}",
      "{OBJECT?}"
    ],
    "slots": [
      "SUBJECT",
      "VERB_ING",
      "OBJECT?"
    ]
  },
  "FINISH_GERUND": {
    "tokens": [
      "{SUBJECT}",
      "finish",
      "{VERB_ING}",
      "{OBJECT?}"
    ],
    "slots": [
      "SUBJECT",
      "VERB_ING",
      "OBJECT?"
    ]
  },
  "MIND_GERUND": {
    "tokens": [
      "{SUBJECT}",
      "mind",
      "{VERB_ING}",
      "{OBJECT?}"
    ],
    "slots": [
      "SUBJECT",
      "VERB_ING",
      "OBJECT?"
    ]
  },
  "QUESTION_WOULD_YOU_MIND": {
    "tokens": [
      "Would",
      "you",
      "mind",
      "{VERB_ING}",
      "{OBJECT?}?"
    ],
    "slots": [
      "VERB_ING",
      "OBJECT?"
    ]
  },
  "QUESTION_DO_YOU_MIND": {
    "tokens": [
      "Do",
      "you",
      "mind",
      "if",
      "{CLAUSE}?"
    ],
    "slots": [
      "CLAUSE"
    ]
  },
  "QUESTION_WHY_DONT_WE": {
    "tokens": [
      "Why",
      "do not",
      "we",
      "{VERB_BASE}",
      "{OBJECT?}?"
    ],
    "slots": [
      "VERB_BASE",
      "OBJECT?"
    ]
  },
  "QUESTION_SHOULD_I": {
    "tokens": [
      "Should",
      "I",
      "{VERB_BASE}",
      "{OBJECT?}?"
    ],
    "slots": [
      "VERB_BASE",
      "OBJECT?"
    ]
  },
  "QUESTION_SHOULD_WE": {
    "tokens": [
      "Should",
      "we",
      "{VERB_BASE}",
      "{OBJECT?}?"
    ],
    "slots": [
      "VERB_BASE",
      "OBJECT?"
    ]
  },
  "QUESTION_MAY_I": {
    "tokens": [
      "May",
      "I",
      "{VERB_BASE}",
      "{OBJECT?}?"
    ],
    "slots": [
      "VERB_BASE",
      "OBJECT?"
    ]
  },
  "QUESTION_WHAT_HAPPENED_TO": {
    "tokens": [
      "What",
      "happened to",
      "{OBJECT}?"
    ],
    "slots": [
      "OBJECT"
    ]
  },
  "QUESTION_HOW_LONG": {
    "tokens": [
      "How long",
      "{AUX}",
      "{SUBJECT}",
      "{VERB_FORM}",
      "{OBJECT?}?"
    ],
    "slots": [
      "AUX",
      "SUBJECT",
      "VERB_FORM",
      "OBJECT?"
    ]
  },
  "QUESTION_HOW_MUCH": {
    "tokens": [
      "How much",
      "{NOUN}",
      "{AUX}",
      "{SUBJECT}",
      "{VERB_FORM}?"
    ],
    "slots": [
      "NOUN",
      "AUX",
      "SUBJECT",
      "VERB_FORM"
    ]
  },
  "QUESTION_HOW_MANY": {
    "tokens": [
      "How many",
      "{NOUN_PLURAL}",
      "{AUX}",
      "{SUBJECT}",
      "{VERB_FORM}?"
    ],
    "slots": [
      "NOUN_PLURAL",
      "AUX",
      "SUBJECT",
      "VERB_FORM"
    ]
  },
  "QUESTION_WHICH": {
    "tokens": [
      "Which",
      "{NOUN}",
      "{AUX}",
      "{SUBJECT}",
      "{VERB_FORM}?"
    ],
    "slots": [
      "NOUN",
      "AUX",
      "SUBJECT",
      "VERB_FORM"
    ]
  },
  "QUESTION_WHO_DO_YOU": {
    "tokens": [
      "Who",
      "do",
      "you",
      "{VERB_BASE}",
      "{COMPLEMENT?}?"
    ],
    "slots": [
      "VERB_BASE",
      "COMPLEMENT?"
    ]
  },
  "COMPARATIVE_THAN": {
    "tokens": [
      "{SUBJECT}",
      "{BE}",
      "{COMPARATIVE}",
      "than",
      "{OBJECT}"
    ],
    "slots": [
      "SUBJECT",
      "BE",
      "COMPARATIVE",
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
  "MORE_NOUN_THAN": {
    "tokens": [
      "{SUBJECT}",
      "{VERB}",
      "more",
      "{NOUN}",
      "than",
      "{OBJECT}"
    ],
    "slots": [
      "SUBJECT",
      "VERB",
      "NOUN",
      "OBJECT"
    ]
  },
  "LESS_NOUN_THAN": {
    "tokens": [
      "{SUBJECT}",
      "{VERB}",
      "less",
      "{NOUN}",
      "than",
      "{OBJECT}"
    ],
    "slots": [
      "SUBJECT",
      "VERB",
      "NOUN",
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
  }
}
  );
})();
