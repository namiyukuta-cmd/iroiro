(() => {
  "use strict";
  window.HMW=window.HMW||{};
  HMW.Dialogue=HMW.Dialogue||{};
  HMW.Dialogue.SENTENCE_PATTERNS=Object.assign(
    HMW.Dialogue.SENTENCE_PATTERNS||{},
    {
      "G13_ZERO_CONDITIONAL": {
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
      "G13_FIRST_CONDITIONAL": {
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
      "G13_FIRST_CONDITIONAL_NEG": {
        "tokens": [
          "If",
          "{CLAUSE_A},",
          "{SUBJECT}",
          "will not",
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
      "G13_SECOND_CONDITIONAL": {
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
      "G13_THIRD_CONDITIONAL": {
        "tokens": [
          "If",
          "{CLAUSE_A},",
          "{SUBJECT}",
          "would have",
          "{VERB_PP}",
          "{OBJECT?}"
        ],
        "slots": [
          "CLAUSE_A",
          "SUBJECT",
          "VERB_PP",
          "OBJECT?"
        ]
      },
      "G13_MIXED_CONDITIONAL_PAST_PRESENT": {
        "tokens": [
          "If",
          "{CLAUSE_A},",
          "{SUBJECT}",
          "would",
          "{VERB_BASE}",
          "{OBJECT?}",
          "now"
        ],
        "slots": [
          "CLAUSE_A",
          "SUBJECT",
          "VERB_BASE",
          "OBJECT?"
        ]
      },
      "G13_UNLESS_CONDITION": {
        "tokens": [
          "Unless",
          "{CLAUSE_A},",
          "{CLAUSE_B}"
        ],
        "slots": [
          "CLAUSE_A",
          "CLAUSE_B"
        ]
      },
      "G13_AS_LONG_AS_CONDITION": {
        "tokens": [
          "As long as",
          "{CLAUSE_A},",
          "{CLAUSE_B}"
        ],
        "slots": [
          "CLAUSE_A",
          "CLAUSE_B"
        ]
      },
      "G13_EVEN_IF_CONDITION": {
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
      "G13_IN_CASE_CONDITION": {
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
      "G13_PRESENT_SIMPLE_PASSIVE": {
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
      "G13_PAST_SIMPLE_PASSIVE": {
        "tokens": [
          "{SUBJECT}",
          "was",
          "{VERB_PP}",
          "{COMPLEMENT?}"
        ],
        "slots": [
          "SUBJECT",
          "VERB_PP",
          "COMPLEMENT?"
        ]
      },
      "G13_FUTURE_PASSIVE": {
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
      "G13_PRESENT_PERFECT_PASSIVE": {
        "tokens": [
          "{SUBJECT}",
          "has been",
          "{VERB_PP}",
          "{COMPLEMENT?}"
        ],
        "slots": [
          "SUBJECT",
          "VERB_PP",
          "COMPLEMENT?"
        ]
      },
      "G13_MODAL_CAN_PASSIVE": {
        "tokens": [
          "{SUBJECT}",
          "can be",
          "{VERB_PP}",
          "{COMPLEMENT?}"
        ],
        "slots": [
          "SUBJECT",
          "VERB_PP",
          "COMPLEMENT?"
        ]
      },
      "G13_MODAL_MUST_PASSIVE": {
        "tokens": [
          "{SUBJECT}",
          "must be",
          "{VERB_PP}",
          "{COMPLEMENT?}"
        ],
        "slots": [
          "SUBJECT",
          "VERB_PP",
          "COMPLEMENT?"
        ]
      },
      "G13_MODAL_SHOULD_PASSIVE": {
        "tokens": [
          "{SUBJECT}",
          "should be",
          "{VERB_PP}",
          "{COMPLEMENT?}"
        ],
        "slots": [
          "SUBJECT",
          "VERB_PP",
          "COMPLEMENT?"
        ]
      },
      "G13_GET_PASSIVE": {
        "tokens": [
          "{SUBJECT}",
          "get",
          "{VERB_PP}",
          "{COMPLEMENT?}"
        ],
        "slots": [
          "SUBJECT",
          "VERB_PP",
          "COMPLEMENT?"
        ]
      },
      "G13_PASSIVE_BY_AGENT": {
        "tokens": [
          "{SUBJECT}",
          "{BE}",
          "{VERB_PP}",
          "by",
          "{AGENT}"
        ],
        "slots": [
          "SUBJECT",
          "BE",
          "VERB_PP",
          "AGENT"
        ]
      },
      "G13_PASSIVE_NEGATIVE": {
        "tokens": [
          "{SUBJECT}",
          "{BE}",
          "not",
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
      "G13_REPORT_SAY_THAT": {
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
      "G13_REPORT_TELL_OBJECT_THAT": {
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
      "G13_REPORT_ASK_IF": {
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
      "G13_REPORT_ASK_WH": {
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
      "G13_REPORT_PROMISE_TO": {
        "tokens": [
          "{SUBJECT}",
          "promised to",
          "{VERB_BASE}",
          "{OBJECT?}"
        ],
        "slots": [
          "SUBJECT",
          "VERB_BASE",
          "OBJECT?"
        ]
      },
      "G13_REPORT_ADVISE_TO": {
        "tokens": [
          "{SUBJECT}",
          "advised",
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
      "G13_REPORT_WARN_NOT_TO": {
        "tokens": [
          "{SUBJECT}",
          "warned",
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
      "G13_REPORT_REQUEST_TO": {
        "tokens": [
          "{SUBJECT}",
          "asked",
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
      "G13_REPORT_THINK_THAT": {
        "tokens": [
          "{SUBJECT}",
          "thought that",
          "{CLAUSE}"
        ],
        "slots": [
          "SUBJECT",
          "CLAUSE"
        ]
      },
      "G13_REPORT_BELIEVE_THAT": {
        "tokens": [
          "{SUBJECT}",
          "believed that",
          "{CLAUSE}"
        ],
        "slots": [
          "SUBJECT",
          "CLAUSE"
        ]
      },
      "G13_RELATIVE_WHO": {
        "tokens": [
          "{NOUN_PHRASE}",
          "who",
          "{CLAUSE}"
        ],
        "slots": [
          "NOUN_PHRASE",
          "CLAUSE"
        ]
      },
      "G13_RELATIVE_WHICH": {
        "tokens": [
          "{NOUN_PHRASE}",
          "which",
          "{CLAUSE}"
        ],
        "slots": [
          "NOUN_PHRASE",
          "CLAUSE"
        ]
      },
      "G13_RELATIVE_THAT": {
        "tokens": [
          "{NOUN_PHRASE}",
          "that",
          "{CLAUSE}"
        ],
        "slots": [
          "NOUN_PHRASE",
          "CLAUSE"
        ]
      },
      "G13_RELATIVE_WHERE": {
        "tokens": [
          "{NOUN_PHRASE}",
          "where",
          "{CLAUSE}"
        ],
        "slots": [
          "NOUN_PHRASE",
          "CLAUSE"
        ]
      },
      "G13_RELATIVE_WHEN": {
        "tokens": [
          "{NOUN_PHRASE}",
          "when",
          "{CLAUSE}"
        ],
        "slots": [
          "NOUN_PHRASE",
          "CLAUSE"
        ]
      },
      "G13_RELATIVE_WHOSE": {
        "tokens": [
          "{NOUN_PHRASE}",
          "whose",
          "{NOUN}",
          "{CLAUSE}"
        ],
        "slots": [
          "NOUN_PHRASE",
          "NOUN",
          "CLAUSE"
        ]
      },
      "G13_NONDEFINING_WHO": {
        "tokens": [
          "{NOUN_PHRASE},",
          "who",
          "{CLAUSE},",
          "{MAIN_CLAUSE}"
        ],
        "slots": [
          "NOUN_PHRASE",
          "CLAUSE",
          "MAIN_CLAUSE"
        ]
      },
      "G13_NONDEFINING_WHICH": {
        "tokens": [
          "{NOUN_PHRASE},",
          "which",
          "{CLAUSE},",
          "{MAIN_CLAUSE}"
        ],
        "slots": [
          "NOUN_PHRASE",
          "CLAUSE",
          "MAIN_CLAUSE"
        ]
      },
      "G13_RELATIVE_PREPOSITION_WHOM": {
        "tokens": [
          "{NOUN_PHRASE}",
          "with whom",
          "{CLAUSE}"
        ],
        "slots": [
          "NOUN_PHRASE",
          "CLAUSE"
        ]
      },
      "G13_REDUCED_RELATIVE_ING": {
        "tokens": [
          "{NOUN_PHRASE}",
          "{VERB_ING}",
          "{COMPLEMENT?}"
        ],
        "slots": [
          "NOUN_PHRASE",
          "VERB_ING",
          "COMPLEMENT?"
        ]
      },
      "G13_COMPARATIVE_THAN": {
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
      "G13_SUPERLATIVE_IN": {
        "tokens": [
          "{SUBJECT}",
          "{BE}",
          "the",
          "{SUPERLATIVE}",
          "in",
          "{GROUP}"
        ],
        "slots": [
          "SUBJECT",
          "BE",
          "SUPERLATIVE",
          "GROUP"
        ]
      },
      "G13_AS_ADJ_AS": {
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
      "G13_NOT_AS_ADJ_AS": {
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
      "G13_THE_MORE_THE_MORE": {
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
      "G13_MUCH_COMPARATIVE": {
        "tokens": [
          "{SUBJECT}",
          "{BE}",
          "much",
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
      "G13_SLIGHTLY_COMPARATIVE": {
        "tokens": [
          "{SUBJECT}",
          "{BE}",
          "slightly",
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
      "G13_PREFER_A_TO_B": {
        "tokens": [
          "{SUBJECT}",
          "prefer",
          "{OBJECT_A}",
          "to",
          "{OBJECT_B}"
        ],
        "slots": [
          "SUBJECT",
          "OBJECT_A",
          "OBJECT_B"
        ]
      },
      "G13_WOULD_RATHER_A_THAN_B": {
        "tokens": [
          "{SUBJECT}",
          "would rather",
          "{VERB_A}",
          "than",
          "{VERB_B}"
        ],
        "slots": [
          "SUBJECT",
          "VERB_A",
          "VERB_B"
        ]
      },
      "G13_WOULD_PREFER_TO_VERB": {
        "tokens": [
          "{SUBJECT}",
          "would prefer to",
          "{VERB_BASE}",
          "{OBJECT?}"
        ],
        "slots": [
          "SUBJECT",
          "VERB_BASE",
          "OBJECT?"
        ]
      },
      "G13_BECAUSE_CLAUSE": {
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
      "G13_SINCE_REASON": {
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
      "G13_AS_REASON": {
        "tokens": [
          "As",
          "{CLAUSE_A},",
          "{CLAUSE_B}"
        ],
        "slots": [
          "CLAUSE_A",
          "CLAUSE_B"
        ]
      },
      "G13_SO_RESULT": {
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
      "G13_THEREFORE_RESULT": {
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
      "G13_SO_THAT_PURPOSE": {
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
      "G13_IN_ORDER_TO": {
        "tokens": [
          "{SUBJECT}",
          "{VERB}",
          "{OBJECT?}",
          "in order to",
          "{VERB_BASE}",
          "{COMPLEMENT?}"
        ],
        "slots": [
          "SUBJECT",
          "VERB",
          "OBJECT?",
          "VERB_BASE",
          "COMPLEMENT?"
        ]
      },
      "G13_SO_AS_TO": {
        "tokens": [
          "{SUBJECT}",
          "{VERB}",
          "{OBJECT?}",
          "so as to",
          "{VERB_BASE}",
          "{COMPLEMENT?}"
        ],
        "slots": [
          "SUBJECT",
          "VERB",
          "OBJECT?",
          "VERB_BASE",
          "COMPLEMENT?"
        ]
      },
      "G13_TOO_ADJ_TO": {
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
      "G13_ADJ_ENOUGH_TO": {
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
      "G13_DESPITE_NOUN": {
        "tokens": [
          "Despite",
          "{NOUN_PHRASE},",
          "{CLAUSE}"
        ],
        "slots": [
          "NOUN_PHRASE",
          "CLAUSE"
        ]
      },
      "G13_IN_SPITE_OF_GERUND": {
        "tokens": [
          "In spite of",
          "{VERB_ING}",
          "{OBJECT?},",
          "{CLAUSE}"
        ],
        "slots": [
          "VERB_ING",
          "OBJECT?",
          "CLAUSE"
        ]
      },
      "G13_ALTHOUGH_CONCESSION": {
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
      "G13_EVEN_THOUGH_CONCESSION": {
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
      "G13_WHILE_CONTRAST": {
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
      "G13_WHEREAS_CONTRAST": {
        "tokens": [
          "{CLAUSE_A},",
          "whereas",
          "{CLAUSE_B}"
        ],
        "slots": [
          "CLAUSE_A",
          "CLAUSE_B"
        ]
      },
      "G13_DUE_TO_NOUN": {
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
      "G13_BECAUSE_OF_NOUN": {
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
      "G13_AS_A_RESULT": {
        "tokens": [
          "{CLAUSE_A}.",
          "As a result,",
          "{CLAUSE_B}"
        ],
        "slots": [
          "CLAUSE_A",
          "CLAUSE_B"
        ]
      },
      "G13_FOR_THIS_REASON": {
        "tokens": [
          "{CLAUSE_A}.",
          "For this reason,",
          "{CLAUSE_B}"
        ],
        "slots": [
          "CLAUSE_A",
          "CLAUSE_B"
        ]
      },
      "G13_BEFORE_CLAUSE": {
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
      "G13_AFTER_CLAUSE": {
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
      "G13_WHILE_CLAUSE": {
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
      "G13_WHEN_CLAUSE": {
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
      "G13_UNTIL_CLAUSE": {
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
      "G13_AS_SOON_AS": {
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
      "G13_ONCE_CLAUSE": {
        "tokens": [
          "Once",
          "{CLAUSE_A},",
          "{CLAUSE_B}"
        ],
        "slots": [
          "CLAUSE_A",
          "CLAUSE_B"
        ]
      },
      "G13_BY_THE_TIME": {
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
      "G13_FIRST_THEN": {
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
      "G13_EVENTUALLY_CLAUSE": {
        "tokens": [
          "Eventually,",
          "{CLAUSE}"
        ],
        "slots": [
          "CLAUSE"
        ]
      },
      "G13_HOW_LONG_QUESTION": {
        "tokens": [
          "How long",
          "{AUX}",
          "{SUBJECT}",
          "{VERB_BASE}",
          "{OBJECT?}?"
        ],
        "slots": [
          "AUX",
          "SUBJECT",
          "VERB_BASE",
          "OBJECT?"
        ]
      },
      "G13_HOW_OFTEN_QUESTION": {
        "tokens": [
          "How often",
          "{AUX}",
          "{SUBJECT}",
          "{VERB_BASE}",
          "{OBJECT?}?"
        ],
        "slots": [
          "AUX",
          "SUBJECT",
          "VERB_BASE",
          "OBJECT?"
        ]
      },
      "G13_HOW_MUCH_QUESTION": {
        "tokens": [
          "How much",
          "{NOUN}",
          "{AUX}",
          "{SUBJECT}",
          "{VERB_BASE}?"
        ],
        "slots": [
          "NOUN",
          "AUX",
          "SUBJECT",
          "VERB_BASE"
        ]
      },
      "G13_HOW_MANY_QUESTION": {
        "tokens": [
          "How many",
          "{NOUN}",
          "{AUX}",
          "{SUBJECT}",
          "{VERB_BASE}?"
        ],
        "slots": [
          "NOUN",
          "AUX",
          "SUBJECT",
          "VERB_BASE"
        ]
      },
      "G13_WHAT_KIND_OF": {
        "tokens": [
          "What kind of",
          "{NOUN}",
          "{AUX}",
          "{SUBJECT}",
          "{VERB_BASE}?"
        ],
        "slots": [
          "NOUN",
          "AUX",
          "SUBJECT",
          "VERB_BASE"
        ]
      },
      "G13_WHICH_ONE_QUESTION": {
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
      "G13_WHO_DO_QUESTION": {
        "tokens": [
          "Who",
          "{AUX}",
          "{SUBJECT}",
          "{VERB_BASE}",
          "{OBJECT?}?"
        ],
        "slots": [
          "AUX",
          "SUBJECT",
          "VERB_BASE",
          "OBJECT?"
        ]
      },
      "G13_WHAT_HAPPENED": {
        "tokens": [
          "What happened",
          "{TIME_OR_PLACE?}?"
        ],
        "slots": [
          "TIME_OR_PLACE?"
        ]
      },
      "G13_IS_THERE_QUESTION": {
        "tokens": [
          "Is there",
          "{NOUN_PHRASE}",
          "{PLACE?}?"
        ],
        "slots": [
          "NOUN_PHRASE",
          "PLACE?"
        ]
      },
      "G13_ARE_THERE_QUESTION": {
        "tokens": [
          "Are there",
          "{NOUN_PHRASE}",
          "{PLACE?}?"
        ],
        "slots": [
          "NOUN_PHRASE",
          "PLACE?"
        ]
      },
      "G13_DO_YOU_MEAN": {
        "tokens": [
          "Do you mean",
          "{CLAUSE}?"
        ],
        "slots": [
          "CLAUSE"
        ]
      },
      "G13_ARE_YOU_SAYING": {
        "tokens": [
          "Are you saying that",
          "{CLAUSE}?"
        ],
        "slots": [
          "CLAUSE"
        ]
      },
      "G13_IF_I_UNDERSTAND": {
        "tokens": [
          "If I understand correctly,",
          "{CLAUSE}"
        ],
        "slots": [
          "CLAUSE"
        ]
      },
      "G13_LET_ME_CLARIFY": {
        "tokens": [
          "Let me clarify:",
          "{CLAUSE}"
        ],
        "slots": [
          "CLAUSE"
        ]
      },
      "G13_FROM_MY_POINT_OF_VIEW": {
        "tokens": [
          "From my point of view,",
          "{CLAUSE}"
        ],
        "slots": [
          "CLAUSE"
        ]
      },
      "G13_AS_FAR_AS_I_KNOW": {
        "tokens": [
          "As far as I know,",
          "{CLAUSE}"
        ],
        "slots": [
          "CLAUSE"
        ]
      },
      "G13_I_AM_NOT_SURE_WHETHER": {
        "tokens": [
          "I am not sure whether",
          "{CLAUSE}"
        ],
        "slots": [
          "CLAUSE"
        ]
      },
      "G13_IT_SEEMS_THAT": {
        "tokens": [
          "It seems that",
          "{CLAUSE}"
        ],
        "slots": [
          "CLAUSE"
        ]
      },
      "G13_IT_DEPENDS_ON": {
        "tokens": [
          "It depends on",
          "{NOUN_PHRASE}"
        ],
        "slots": [
          "NOUN_PHRASE"
        ]
      },
      "G13_WHAT_MATTERS_IS": {
        "tokens": [
          "What matters is",
          "{NOUN_PHRASE}"
        ],
        "slots": [
          "NOUN_PHRASE"
        ]
      }
    }
  );
})();
