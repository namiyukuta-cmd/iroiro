(() => {
  "use strict";
  window.HMW=window.HMW||{}; HMW.Dialogue=HMW.Dialogue||{};
  HMW.Dialogue.SENTENCE_PATTERNS=Object.assign(HMW.Dialogue.SENTENCE_PATTERNS||{},{
  "RELATIONSHIP_STATUS": {
    "tokens": [
      "We are",
      "{RELATIONSHIP}"
    ],
    "slots": [
      "RELATIONSHIP"
    ]
  },
  "FEELINGS_TOWARD_HEROINE": {
    "tokens": [
      "I feel",
      "{FEELING}",
      "about you"
    ],
    "slots": [
      "FEELING"
    ]
  },
  "LIKE_OBJECT": {
    "tokens": [
      "{SUBJECT}",
      "like",
      "{OBJECT}"
    ],
    "slots": [
      "SUBJECT",
      "OBJECT"
    ]
  },
  "DISLIKE_OBJECT": {
    "tokens": [
      "{SUBJECT}",
      "do not like",
      "{OBJECT}"
    ],
    "slots": [
      "SUBJECT",
      "OBJECT"
    ]
  },
  "LOVE_OBJECT": {
    "tokens": [
      "{SUBJECT}",
      "love",
      "{OBJECT}"
    ],
    "slots": [
      "SUBJECT",
      "OBJECT"
    ]
  },
  "CARE_ABOUT_OBJECT": {
    "tokens": [
      "{SUBJECT}",
      "care about",
      "{OBJECT}"
    ],
    "slots": [
      "SUBJECT",
      "OBJECT"
    ]
  },
  "TRUST_OBJECT": {
    "tokens": [
      "{SUBJECT}",
      "trust",
      "{OBJECT}"
    ],
    "slots": [
      "SUBJECT",
      "OBJECT"
    ]
  },
  "MISS_OBJECT": {
    "tokens": [
      "{SUBJECT}",
      "miss",
      "{OBJECT}"
    ],
    "slots": [
      "SUBJECT",
      "OBJECT"
    ]
  },
  "NEED_OBJECT_SIMPLE": {
    "tokens": [
      "{SUBJECT}",
      "need",
      "{OBJECT}"
    ],
    "slots": [
      "SUBJECT",
      "OBJECT"
    ]
  },
  "WANT_OBJECT_SIMPLE": {
    "tokens": [
      "{SUBJECT}",
      "want",
      "{OBJECT}"
    ],
    "slots": [
      "SUBJECT",
      "OBJECT"
    ]
  },
  "CHOOSE_OBJECT": {
    "tokens": [
      "{SUBJECT}",
      "choose",
      "{OBJECT}"
    ],
    "slots": [
      "SUBJECT",
      "OBJECT"
    ]
  },
  "PREFER_OBJECT_OVER": {
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
  "WOULD_RATHER_THAN": {
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
  "ASK_PREFERENCE_BETWEEN": {
    "tokens": [
      "Do you prefer",
      "{OBJECT_A}",
      "or",
      "{OBJECT_B}?"
    ],
    "slots": [
      "OBJECT_A",
      "OBJECT_B"
    ]
  },
  "ASK_CHOICE_BETWEEN": {
    "tokens": [
      "Which do you want,",
      "{OBJECT_A}",
      "or",
      "{OBJECT_B}?"
    ],
    "slots": [
      "OBJECT_A",
      "OBJECT_B"
    ]
  },
  "ASK_FEELING_ABOUT": {
    "tokens": [
      "How do you feel about",
      "{OBJECT}?"
    ],
    "slots": [
      "OBJECT"
    ]
  },
  "ASK_OPINION_ABOUT": {
    "tokens": [
      "What do you think about",
      "{OBJECT}?"
    ],
    "slots": [
      "OBJECT"
    ]
  },
  "ASK_REASON_FOR": {
    "tokens": [
      "Why did you",
      "{VERB_BASE}",
      "{OBJECT?}?"
    ],
    "slots": [
      "VERB_BASE",
      "OBJECT?"
    ]
  },
  "ANSWER_REASON_TO": {
    "tokens": [
      "I",
      "{VERB}",
      "{OBJECT?}",
      "because",
      "{CLAUSE}"
    ],
    "slots": [
      "VERB",
      "OBJECT?",
      "CLAUSE"
    ]
  },
  "ASK_PERMISSION_CAN_I": {
    "tokens": [
      "Can I",
      "{VERB_BASE}",
      "{OBJECT?}?"
    ],
    "slots": [
      "VERB_BASE",
      "OBJECT?"
    ]
  },
  "ASK_PERMISSION_MAY_I": {
    "tokens": [
      "May I",
      "{VERB_BASE}",
      "{OBJECT?}?"
    ],
    "slots": [
      "VERB_BASE",
      "OBJECT?"
    ]
  },
  "GRANT_PERMISSION": {
    "tokens": [
      "Yes, you can",
      "{VERB_BASE}",
      "{OBJECT?}"
    ],
    "slots": [
      "VERB_BASE",
      "OBJECT?"
    ]
  },
  "DENY_PERMISSION": {
    "tokens": [
      "No, you cannot",
      "{VERB_BASE}",
      "{OBJECT?}"
    ],
    "slots": [
      "VERB_BASE",
      "OBJECT?"
    ]
  },
  "POLITE_REQUEST_CAN_YOU": {
    "tokens": [
      "Can you please",
      "{VERB_BASE}",
      "{OBJECT?}?"
    ],
    "slots": [
      "VERB_BASE",
      "OBJECT?"
    ]
  },
  "POLITE_REQUEST_COULD_YOU": {
    "tokens": [
      "Could you please",
      "{VERB_BASE}",
      "{OBJECT?}?"
    ],
    "slots": [
      "VERB_BASE",
      "OBJECT?"
    ]
  },
  "POLITE_REQUEST_WOULD_YOU": {
    "tokens": [
      "Would you please",
      "{VERB_BASE}",
      "{OBJECT?}?"
    ],
    "slots": [
      "VERB_BASE",
      "OBJECT?"
    ]
  },
  "OFFER_SHALL_WE": {
    "tokens": [
      "Shall we",
      "{VERB_BASE}",
      "{OBJECT?}?"
    ],
    "slots": [
      "VERB_BASE",
      "OBJECT?"
    ]
  },
  "SUGGEST_WHY_DONT_WE": {
    "tokens": [
      "Why do not we",
      "{VERB_BASE}",
      "{OBJECT?}?"
    ],
    "slots": [
      "VERB_BASE",
      "OBJECT?"
    ]
  },
  "SUGGEST_HOW_ABOUT_GERUND": {
    "tokens": [
      "How about",
      "{VERB_ING}",
      "{OBJECT?}?"
    ],
    "slots": [
      "VERB_ING",
      "OBJECT?"
    ]
  },
  "AGREE_SIMPLE": {
    "tokens": [
      "Yes,",
      "{CLAUSE}"
    ],
    "slots": [
      "CLAUSE"
    ]
  },
  "DISAGREE_SIMPLE": {
    "tokens": [
      "No,",
      "{CLAUSE}"
    ],
    "slots": [
      "CLAUSE"
    ]
  },
  "CORRECT_FACT": {
    "tokens": [
      "Actually,",
      "{CLAUSE}"
    ],
    "slots": [
      "CLAUSE"
    ]
  },
  "CLARIFY_MEANING": {
    "tokens": [
      "What I mean is",
      "{CLAUSE}"
    ],
    "slots": [
      "CLAUSE"
    ]
  },
  "ADD_DETAIL": {
    "tokens": [
      "Also,",
      "{CLAUSE}"
    ],
    "slots": [
      "CLAUSE"
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
  "CONTRAST_YET": {
    "tokens": [
      "{CLAUSE_A},",
      "yet",
      "{CLAUSE_B}"
    ],
    "slots": [
      "CLAUSE_A",
      "CLAUSE_B"
    ]
  },
  "REASON_THATS_WHY": {
    "tokens": [
      "{CLAUSE_A}.",
      "That is why",
      "{CLAUSE_B}"
    ],
    "slots": [
      "CLAUSE_A",
      "CLAUSE_B"
    ]
  },
  "CONFIRM_YES": {
    "tokens": [
      "Yes,",
      "{CLAUSE}"
    ],
    "slots": [
      "CLAUSE"
    ]
  },
  "CONFIRM_NO": {
    "tokens": [
      "No,",
      "{CLAUSE}"
    ],
    "slots": [
      "CLAUSE"
    ]
  },
  "UNCERTAIN_MAYBE": {
    "tokens": [
      "Maybe",
      "{CLAUSE}"
    ],
    "slots": [
      "CLAUSE"
    ]
  },
  "UNCERTAIN_PROBABLY": {
    "tokens": [
      "Probably",
      "{CLAUSE}"
    ],
    "slots": [
      "CLAUSE"
    ]
  },
  "CERTAIN_DEFINITELY": {
    "tokens": [
      "Definitely,",
      "{CLAUSE}"
    ],
    "slots": [
      "CLAUSE"
    ]
  },
  "TIME_AT": {
    "tokens": [
      "{CLAUSE}",
      "at",
      "{TIME}"
    ],
    "slots": [
      "CLAUSE",
      "TIME"
    ]
  },
  "TIME_ON": {
    "tokens": [
      "{CLAUSE}",
      "on",
      "{DATE}"
    ],
    "slots": [
      "CLAUSE",
      "DATE"
    ]
  },
  "TIME_IN": {
    "tokens": [
      "{CLAUSE}",
      "in",
      "{TIME_PERIOD}"
    ],
    "slots": [
      "CLAUSE",
      "TIME_PERIOD"
    ]
  },
  "PLACE_AT": {
    "tokens": [
      "{CLAUSE}",
      "at",
      "{PLACE}"
    ],
    "slots": [
      "CLAUSE",
      "PLACE"
    ]
  },
  "PLACE_IN": {
    "tokens": [
      "{CLAUSE}",
      "in",
      "{PLACE}"
    ],
    "slots": [
      "CLAUSE",
      "PLACE"
    ]
  },
  "PLACE_NEAR": {
    "tokens": [
      "{CLAUSE}",
      "near",
      "{PLACE}"
    ],
    "slots": [
      "CLAUSE",
      "PLACE"
    ]
  },
  "FREQUENCY_ALWAYS": {
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
  "FREQUENCY_OFTEN": {
    "tokens": [
      "{SUBJECT}",
      "often",
      "{VERB}",
      "{OBJECT?}"
    ],
    "slots": [
      "SUBJECT",
      "VERB",
      "OBJECT?"
    ]
  },
  "FREQUENCY_SOMETIMES": {
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
  "FREQUENCY_NEVER": {
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
  }
});
})();