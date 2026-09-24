(() => {
  "use strict";
  window.HMW=window.HMW||{}; HMW.Dialogue=HMW.Dialogue||{};
  HMW.Dialogue.SENTENCE_PATTERNS=Object.assign(HMW.Dialogue.SENTENCE_PATTERNS||{},{
  "PRESENT_PERFECT_CONTINUOUS": {
    "tokens": [
      "{SUBJECT}",
      "{HAVE_AUX}",
      "been",
      "{VERB_ING}",
      "{OBJECT?}"
    ],
    "slots": [
      "SUBJECT",
      "HAVE_AUX",
      "VERB_ING",
      "OBJECT?"
    ]
  },
  "PAST_PERFECT": {
    "tokens": [
      "{SUBJECT}",
      "had",
      "{VERB_PP}",
      "{OBJECT?}"
    ],
    "slots": [
      "SUBJECT",
      "VERB_PP",
      "OBJECT?"
    ]
  },
  "PAST_PERFECT_NEG": {
    "tokens": [
      "{SUBJECT}",
      "had not",
      "{VERB_PP}",
      "{OBJECT?}"
    ],
    "slots": [
      "SUBJECT",
      "VERB_PP",
      "OBJECT?"
    ]
  },
  "FUTURE_PERFECT": {
    "tokens": [
      "{SUBJECT}",
      "will have",
      "{VERB_PP}",
      "{OBJECT?}"
    ],
    "slots": [
      "SUBJECT",
      "VERB_PP",
      "OBJECT?"
    ]
  },
  "FUTURE_CONTINUOUS": {
    "tokens": [
      "{SUBJECT}",
      "will be",
      "{VERB_ING}",
      "{OBJECT?}"
    ],
    "slots": [
      "SUBJECT",
      "VERB_ING",
      "OBJECT?"
    ]
  },
  "BE_ABOUT_TO": {
    "tokens": [
      "{SUBJECT}",
      "{BE}",
      "about to",
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
  "BE_SUPPOSED_TO": {
    "tokens": [
      "{SUBJECT}",
      "{BE}",
      "supposed to",
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
  "BE_ALLOWED_TO": {
    "tokens": [
      "{SUBJECT}",
      "{BE}",
      "allowed to",
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
  "BE_NOT_ALLOWED_TO": {
    "tokens": [
      "{SUBJECT}",
      "{BE}",
      "not allowed to",
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
  "HAVE_GOT_TO": {
    "tokens": [
      "{SUBJECT}",
      "have got to",
      "{VERB_BASE}",
      "{OBJECT?}"
    ],
    "slots": [
      "SUBJECT",
      "VERB_BASE",
      "OBJECT?"
    ]
  },
  "OUGHT_TO": {
    "tokens": [
      "{SUBJECT}",
      "ought to",
      "{VERB_BASE}",
      "{OBJECT?}"
    ],
    "slots": [
      "SUBJECT",
      "VERB_BASE",
      "OBJECT?"
    ]
  },
  "MIGHT_HAVE": {
    "tokens": [
      "{SUBJECT}",
      "might have",
      "{VERB_PP}",
      "{OBJECT?}"
    ],
    "slots": [
      "SUBJECT",
      "VERB_PP",
      "OBJECT?"
    ]
  },
  "MUST_HAVE": {
    "tokens": [
      "{SUBJECT}",
      "must have",
      "{VERB_PP}",
      "{OBJECT?}"
    ],
    "slots": [
      "SUBJECT",
      "VERB_PP",
      "OBJECT?"
    ]
  },
  "COULD_HAVE": {
    "tokens": [
      "{SUBJECT}",
      "could have",
      "{VERB_PP}",
      "{OBJECT?}"
    ],
    "slots": [
      "SUBJECT",
      "VERB_PP",
      "OBJECT?"
    ]
  },
  "SHOULD_HAVE": {
    "tokens": [
      "{SUBJECT}",
      "should have",
      "{VERB_PP}",
      "{OBJECT?}"
    ],
    "slots": [
      "SUBJECT",
      "VERB_PP",
      "OBJECT?"
    ]
  },
  "SHOULD_NOT_HAVE": {
    "tokens": [
      "{SUBJECT}",
      "should not have",
      "{VERB_PP}",
      "{OBJECT?}"
    ],
    "slots": [
      "SUBJECT",
      "VERB_PP",
      "OBJECT?"
    ]
  },
  "WISH_PAST": {
    "tokens": [
      "{SUBJECT}",
      "wish",
      "{CLAUSE}"
    ],
    "slots": [
      "SUBJECT",
      "CLAUSE"
    ]
  },
  "HOPE_CLAUSE": {
    "tokens": [
      "{SUBJECT}",
      "hope",
      "{CLAUSE}"
    ],
    "slots": [
      "SUBJECT",
      "CLAUSE"
    ]
  },
  "EXPECT_OBJECT_TO": {
    "tokens": [
      "{SUBJECT}",
      "expect",
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
  "ALLOW_OBJECT_TO": {
    "tokens": [
      "{SUBJECT}",
      "allow",
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
  "ASK_OBJECT_TO": {
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
  "TELL_OBJECT_TO": {
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
  "HELP_OBJECT_VERB": {
    "tokens": [
      "{SUBJECT}",
      "help",
      "{OBJECT}",
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
  "MAKE_OBJECT_VERB": {
    "tokens": [
      "{SUBJECT}",
      "make",
      "{OBJECT}",
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
  "LET_OBJECT_VERB": {
    "tokens": [
      "{SUBJECT}",
      "let",
      "{OBJECT}",
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
  "ENJOY_GERUND": {
    "tokens": [
      "{SUBJECT}",
      "enjoy",
      "{VERB_ING}",
      "{OBJECT?}"
    ],
    "slots": [
      "SUBJECT",
      "VERB_ING",
      "OBJECT?"
    ]
  },
  "AVOID_GERUND": {
    "tokens": [
      "{SUBJECT}",
      "avoid",
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
  "MIND_GERUND_QUESTION": {
    "tokens": [
      "Would",
      "{SUBJECT}",
      "mind",
      "{VERB_ING}",
      "{OBJECT?}?"
    ],
    "slots": [
      "SUBJECT",
      "VERB_ING",
      "OBJECT?"
    ]
  },
  "THANK_FOR_GERUND": {
    "tokens": [
      "Thank you for",
      "{VERB_ING}",
      "{OBJECT?}"
    ],
    "slots": [
      "VERB_ING",
      "OBJECT?"
    ]
  },
  "APOLOGIZE_FOR_GERUND": {
    "tokens": [
      "{SUBJECT}",
      "apologize for",
      "{VERB_ING}",
      "{OBJECT?}"
    ],
    "slots": [
      "SUBJECT",
      "VERB_ING",
      "OBJECT?"
    ]
  },
  "BE_INTERESTED_IN_GERUND": {
    "tokens": [
      "{SUBJECT}",
      "{BE}",
      "interested in",
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
  "BE_AFRAID_OF_GERUND": {
    "tokens": [
      "{SUBJECT}",
      "{BE}",
      "afraid of",
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
  "THERE_IS": {
    "tokens": [
      "There is",
      "{NOUN_PHRASE}",
      "{PLACE?}"
    ],
    "slots": [
      "NOUN_PHRASE",
      "PLACE?"
    ]
  },
  "THERE_ARE": {
    "tokens": [
      "There are",
      "{NOUN_PHRASE}",
      "{PLACE?}"
    ],
    "slots": [
      "NOUN_PHRASE",
      "PLACE?"
    ]
  },
  "THERE_WAS": {
    "tokens": [
      "There was",
      "{NOUN_PHRASE}",
      "{PLACE?}"
    ],
    "slots": [
      "NOUN_PHRASE",
      "PLACE?"
    ]
  },
  "THERE_WERE": {
    "tokens": [
      "There were",
      "{NOUN_PHRASE}",
      "{PLACE?}"
    ],
    "slots": [
      "NOUN_PHRASE",
      "PLACE?"
    ]
  },
  "QUESTION_TAG_POSITIVE": {
    "tokens": [
      "{CLAUSE},",
      "{TAG}?"
    ],
    "slots": [
      "CLAUSE",
      "TAG"
    ]
  },
  "QUESTION_TAG_NEGATIVE": {
    "tokens": [
      "{CLAUSE},",
      "{TAG}?"
    ],
    "slots": [
      "CLAUSE",
      "TAG"
    ]
  },
  "EXCLAMATION_HOW_ADJ": {
    "tokens": [
      "How",
      "{ADJECTIVE}",
      "{SUBJECT}",
      "{BE}!"
    ],
    "slots": [
      "ADJECTIVE",
      "SUBJECT",
      "BE"
    ]
  },
  "EXCLAMATION_WHAT_NOUN": {
    "tokens": [
      "What",
      "{ARTICLE}",
      "{ADJECTIVE?}",
      "{NOUN}!"
    ],
    "slots": [
      "ARTICLE",
      "ADJECTIVE?",
      "NOUN"
    ]
  },
  "EITHER_OR": {
    "tokens": [
      "Either",
      "{OPTION_A}",
      "or",
      "{OPTION_B}"
    ],
    "slots": [
      "OPTION_A",
      "OPTION_B"
    ]
  },
  "NEITHER_NOR": {
    "tokens": [
      "Neither",
      "{OPTION_A}",
      "nor",
      "{OPTION_B}"
    ],
    "slots": [
      "OPTION_A",
      "OPTION_B"
    ]
  },
  "NOT_ONLY_BUT_ALSO": {
    "tokens": [
      "{SUBJECT}",
      "not only",
      "{VERB_A}",
      "but also",
      "{VERB_B}"
    ],
    "slots": [
      "SUBJECT",
      "VERB_A",
      "VERB_B"
    ]
  },
  "BOTH_AND": {
    "tokens": [
      "Both",
      "{OPTION_A}",
      "and",
      "{OPTION_B}"
    ],
    "slots": [
      "OPTION_A",
      "OPTION_B"
    ]
  }
});
})();