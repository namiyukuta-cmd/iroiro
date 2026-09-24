(() => {
  "use strict";
  window.HMW=window.HMW||{};
  HMW.Dialogue=HMW.Dialogue||{};
  HMW.Dialogue.SENTENCE_PATTERNS=Object.assign(
    HMW.Dialogue.SENTENCE_PATTERNS||{},
    {
      "G14_MODAL_CAN": {
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
      "G14_MODAL_CANNOT": {
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
      "G14_MODAL_MAY": {
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
      "G14_MODAL_MIGHT": {
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
      "G14_MODAL_MUST": {
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
      "G14_MODAL_SHOULD": {
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
      "G14_MODAL_SHOULD_NOT": {
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
      "G14_MODAL_COULD": {
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
      "G14_MODAL_WOULD": {
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
      "G14_MODAL_NEED_NOT": {
        "tokens": [
          "{SUBJECT}",
          "need not",
          "{VERB_BASE}",
          "{OBJECT?}"
        ],
        "slots": [
          "SUBJECT",
          "VERB_BASE",
          "OBJECT?"
        ]
      },
      "G14_CAUSE_HAVE_OBJECT_PP": {
        "tokens": [
          "{SUBJECT}",
          "have",
          "{OBJECT}",
          "{VERB_PP}"
        ],
        "slots": [
          "SUBJECT",
          "OBJECT",
          "VERB_PP"
        ]
      },
      "G14_CAUSE_GET_OBJECT_TO": {
        "tokens": [
          "{SUBJECT}",
          "get",
          "{OBJECT}",
          "to",
          "{VERB_BASE}"
        ],
        "slots": [
          "SUBJECT",
          "OBJECT",
          "VERB_BASE"
        ]
      },
      "G14_CAUSE_MAKE_OBJECT_ADJ": {
        "tokens": [
          "{SUBJECT}",
          "make",
          "{OBJECT}",
          "{ADJECTIVE}"
        ],
        "slots": [
          "SUBJECT",
          "OBJECT",
          "ADJECTIVE"
        ]
      },
      "G14_KEEP_OBJECT_ADJ": {
        "tokens": [
          "{SUBJECT}",
          "keep",
          "{OBJECT}",
          "{ADJECTIVE}"
        ],
        "slots": [
          "SUBJECT",
          "OBJECT",
          "ADJECTIVE"
        ]
      },
      "G14_LEAVE_OBJECT_ADJ": {
        "tokens": [
          "{SUBJECT}",
          "leave",
          "{OBJECT}",
          "{ADJECTIVE}"
        ],
        "slots": [
          "SUBJECT",
          "OBJECT",
          "ADJECTIVE"
        ]
      },
      "G14_FIND_OBJECT_ADJ": {
        "tokens": [
          "{SUBJECT}",
          "find",
          "{OBJECT}",
          "{ADJECTIVE}"
        ],
        "slots": [
          "SUBJECT",
          "OBJECT",
          "ADJECTIVE"
        ]
      },
      "G14_SEE_OBJECT_VERB": {
        "tokens": [
          "{SUBJECT}",
          "see",
          "{OBJECT}",
          "{VERB_BASE}"
        ],
        "slots": [
          "SUBJECT",
          "OBJECT",
          "VERB_BASE"
        ]
      },
      "G14_HEAR_OBJECT_VERB": {
        "tokens": [
          "{SUBJECT}",
          "hear",
          "{OBJECT}",
          "{VERB_BASE}"
        ],
        "slots": [
          "SUBJECT",
          "OBJECT",
          "VERB_BASE"
        ]
      },
      "G14_WATCH_OBJECT_ING": {
        "tokens": [
          "{SUBJECT}",
          "watch",
          "{OBJECT}",
          "{VERB_ING}"
        ],
        "slots": [
          "SUBJECT",
          "OBJECT",
          "VERB_ING"
        ]
      },
      "G14_NOTICE_OBJECT_ING": {
        "tokens": [
          "{SUBJECT}",
          "notice",
          "{OBJECT}",
          "{VERB_ING}"
        ],
        "slots": [
          "SUBJECT",
          "OBJECT",
          "VERB_ING"
        ]
      },
      "G14_NOUN_CLAUSE_THAT": {
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
      "G14_NOUN_CLAUSE_WHAT": {
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
      "G14_NOUN_CLAUSE_WHETHER": {
        "tokens": [
          "{SUBJECT}",
          "{VERB}",
          "whether",
          "{CLAUSE}"
        ],
        "slots": [
          "SUBJECT",
          "VERB",
          "CLAUSE"
        ]
      },
      "G14_NOUN_CLAUSE_IF": {
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
      "G14_NOUN_CLAUSE_WHY": {
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
      "G14_NOUN_CLAUSE_HOW": {
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
      "G14_NOUN_CLAUSE_WHEN": {
        "tokens": [
          "{SUBJECT}",
          "{VERB}",
          "when",
          "{CLAUSE}"
        ],
        "slots": [
          "SUBJECT",
          "VERB",
          "CLAUSE"
        ]
      },
      "G14_NOUN_CLAUSE_WHERE": {
        "tokens": [
          "{SUBJECT}",
          "{VERB}",
          "where",
          "{CLAUSE}"
        ],
        "slots": [
          "SUBJECT",
          "VERB",
          "CLAUSE"
        ]
      },
      "G14_NOUN_CLAUSE_WHO": {
        "tokens": [
          "{SUBJECT}",
          "{VERB}",
          "who",
          "{CLAUSE}"
        ],
        "slots": [
          "SUBJECT",
          "VERB",
          "CLAUSE"
        ]
      },
      "G14_NOUN_CLAUSE_WHICH": {
        "tokens": [
          "{SUBJECT}",
          "{VERB}",
          "which",
          "{CLAUSE}"
        ],
        "slots": [
          "SUBJECT",
          "VERB",
          "CLAUSE"
        ]
      },
      "G14_WANT_TO": {
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
      "G14_NEED_TO": {
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
      "G14_PLAN_TO": {
        "tokens": [
          "{SUBJECT}",
          "plan to",
          "{VERB_BASE}",
          "{OBJECT?}"
        ],
        "slots": [
          "SUBJECT",
          "VERB_BASE",
          "OBJECT?"
        ]
      },
      "G14_DECIDE_TO": {
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
      "G14_HOPE_TO": {
        "tokens": [
          "{SUBJECT}",
          "hope to",
          "{VERB_BASE}",
          "{OBJECT?}"
        ],
        "slots": [
          "SUBJECT",
          "VERB_BASE",
          "OBJECT?"
        ]
      },
      "G14_PROMISE_TO": {
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
      "G14_REFUSE_TO": {
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
      "G14_AGREE_TO": {
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
      "G14_MANAGE_TO": {
        "tokens": [
          "{SUBJECT}",
          "manage to",
          "{VERB_BASE}",
          "{OBJECT?}"
        ],
        "slots": [
          "SUBJECT",
          "VERB_BASE",
          "OBJECT?"
        ]
      },
      "G14_FAIL_TO": {
        "tokens": [
          "{SUBJECT}",
          "fail to",
          "{VERB_BASE}",
          "{OBJECT?}"
        ],
        "slots": [
          "SUBJECT",
          "VERB_BASE",
          "OBJECT?"
        ]
      },
      "G14_KEEP_GERUND": {
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
      "G14_STOP_GERUND": {
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
      "G14_CONSIDER_GERUND": {
        "tokens": [
          "{SUBJECT}",
          "consider",
          "{VERB_ING}",
          "{OBJECT?}"
        ],
        "slots": [
          "SUBJECT",
          "VERB_ING",
          "OBJECT?"
        ]
      },
      "G14_SUGGEST_GERUND": {
        "tokens": [
          "{SUBJECT}",
          "suggest",
          "{VERB_ING}",
          "{OBJECT?}"
        ],
        "slots": [
          "SUBJECT",
          "VERB_ING",
          "OBJECT?"
        ]
      },
      "G14_RECOMMEND_GERUND": {
        "tokens": [
          "{SUBJECT}",
          "recommend",
          "{VERB_ING}",
          "{OBJECT?}"
        ],
        "slots": [
          "SUBJECT",
          "VERB_ING",
          "OBJECT?"
        ]
      },
      "G14_PRACTICE_GERUND": {
        "tokens": [
          "{SUBJECT}",
          "practice",
          "{VERB_ING}",
          "{OBJECT?}"
        ],
        "slots": [
          "SUBJECT",
          "VERB_ING",
          "OBJECT?"
        ]
      },
      "G14_MISS_GERUND": {
        "tokens": [
          "{SUBJECT}",
          "miss",
          "{VERB_ING}",
          "{OBJECT?}"
        ],
        "slots": [
          "SUBJECT",
          "VERB_ING",
          "OBJECT?"
        ]
      },
      "G14_IMAGINE_GERUND": {
        "tokens": [
          "{SUBJECT}",
          "imagine",
          "{VERB_ING}",
          "{OBJECT?}"
        ],
        "slots": [
          "SUBJECT",
          "VERB_ING",
          "OBJECT?"
        ]
      },
      "G14_DELAY_GERUND": {
        "tokens": [
          "{SUBJECT}",
          "delay",
          "{VERB_ING}",
          "{OBJECT?}"
        ],
        "slots": [
          "SUBJECT",
          "VERB_ING",
          "OBJECT?"
        ]
      },
      "G14_RISK_GERUND": {
        "tokens": [
          "{SUBJECT}",
          "risk",
          "{VERB_ING}",
          "{OBJECT?}"
        ],
        "slots": [
          "SUBJECT",
          "VERB_ING",
          "OBJECT?"
        ]
      },
      "G14_DISCOURSE_IN_FACT": {
        "tokens": [
          "In fact,",
          "{CLAUSE}"
        ],
        "slots": [
          "CLAUSE"
        ]
      },
      "G14_DISCOURSE_FOR_EXAMPLE": {
        "tokens": [
          "For example,",
          "{CLAUSE}"
        ],
        "slots": [
          "CLAUSE"
        ]
      },
      "G14_DISCOURSE_IN_OTHER_WORDS": {
        "tokens": [
          "In other words,",
          "{CLAUSE}"
        ],
        "slots": [
          "CLAUSE"
        ]
      },
      "G14_DISCOURSE_ON_THE_OTHER_HAND": {
        "tokens": [
          "On the other hand,",
          "{CLAUSE}"
        ],
        "slots": [
          "CLAUSE"
        ]
      },
      "G14_DISCOURSE_AT_LEAST": {
        "tokens": [
          "At least,",
          "{CLAUSE}"
        ],
        "slots": [
          "CLAUSE"
        ]
      },
      "G14_DISCOURSE_AFTER_ALL": {
        "tokens": [
          "After all,",
          "{CLAUSE}"
        ],
        "slots": [
          "CLAUSE"
        ]
      },
      "G14_DISCOURSE_BY_THE_WAY": {
        "tokens": [
          "By the way,",
          "{CLAUSE}"
        ],
        "slots": [
          "CLAUSE"
        ]
      },
      "G14_DISCOURSE_INSTEAD": {
        "tokens": [
          "Instead,",
          "{CLAUSE}"
        ],
        "slots": [
          "CLAUSE"
        ]
      },
      "G14_DISCOURSE_OTHERWISE": {
        "tokens": [
          "Otherwise,",
          "{CLAUSE}"
        ],
        "slots": [
          "CLAUSE"
        ]
      },
      "G14_DISCOURSE_MEANWHILE": {
        "tokens": [
          "Meanwhile,",
          "{CLAUSE}"
        ],
        "slots": [
          "CLAUSE"
        ]
      },
      "G14_POLITE_COULD_I": {
        "tokens": [
          "Could I",
          "{VERB_BASE}",
          "{OBJECT?}?"
        ],
        "slots": [
          "VERB_BASE",
          "OBJECT?"
        ]
      },
      "G14_POLITE_WOULD_IT_BE_POSSIBLE": {
        "tokens": [
          "Would it be possible to",
          "{VERB_BASE}",
          "{OBJECT?}?"
        ],
        "slots": [
          "VERB_BASE",
          "OBJECT?"
        ]
      },
      "G14_POLITE_WOULD_YOU_MIND": {
        "tokens": [
          "Would you mind",
          "{VERB_ING}",
          "{OBJECT?}?"
        ],
        "slots": [
          "VERB_ING",
          "OBJECT?"
        ]
      },
      "G14_POLITE_ID_APPRECIATE_IF": {
        "tokens": [
          "I would appreciate it if",
          "{CLAUSE}"
        ],
        "slots": [
          "CLAUSE"
        ]
      },
      "G14_POLITE_IF_YOU_DONT_MIND": {
        "tokens": [
          "If you do not mind,",
          "{CLAUSE}"
        ],
        "slots": [
          "CLAUSE"
        ]
      },
      "G14_POLITE_PLEASE_LET_ME_KNOW": {
        "tokens": [
          "Please let me know",
          "{CLAUSE?}"
        ],
        "slots": [
          "CLAUSE?"
        ]
      },
      "G14_POLITE_COULD_YOU_TELL_ME": {
        "tokens": [
          "Could you tell me",
          "{WH_WORD}",
          "{CLAUSE}?"
        ],
        "slots": [
          "WH_WORD",
          "CLAUSE"
        ]
      },
      "G14_POLITE_MAY_I_ASK": {
        "tokens": [
          "May I ask",
          "{WH_WORD}",
          "{CLAUSE}?"
        ],
        "slots": [
          "WH_WORD",
          "CLAUSE"
        ]
      },
      "G14_POLITE_ID_LIKE_TO": {
        "tokens": [
          "I would like to",
          "{VERB_BASE}",
          "{OBJECT?}"
        ],
        "slots": [
          "VERB_BASE",
          "OBJECT?"
        ]
      },
      "G14_POLITE_WOULD_YOU_LIKE": {
        "tokens": [
          "Would you like",
          "{NOUN_PHRASE}?"
        ],
        "slots": [
          "NOUN_PHRASE"
        ]
      },
      "G14_UNCERTAIN_I_THINK": {
        "tokens": [
          "I think",
          "{CLAUSE}"
        ],
        "slots": [
          "CLAUSE"
        ]
      },
      "G14_UNCERTAIN_I_DONT_THINK": {
        "tokens": [
          "I do not think",
          "{CLAUSE}"
        ],
        "slots": [
          "CLAUSE"
        ]
      },
      "G14_UNCERTAIN_I_GUESS": {
        "tokens": [
          "I guess",
          "{CLAUSE}"
        ],
        "slots": [
          "CLAUSE"
        ]
      },
      "G14_UNCERTAIN_I_SUPPOSE": {
        "tokens": [
          "I suppose",
          "{CLAUSE}"
        ],
        "slots": [
          "CLAUSE"
        ]
      },
      "G14_UNCERTAIN_IT_MIGHT_BE": {
        "tokens": [
          "It might be",
          "{ADJECTIVE}"
        ],
        "slots": [
          "ADJECTIVE"
        ]
      },
      "G14_UNCERTAIN_THERE_MAY_BE": {
        "tokens": [
          "There may be",
          "{NOUN_PHRASE}"
        ],
        "slots": [
          "NOUN_PHRASE"
        ]
      },
      "G14_UNCERTAIN_IM_NOT_CERTAIN": {
        "tokens": [
          "I am not certain whether",
          "{CLAUSE}"
        ],
        "slots": [
          "CLAUSE"
        ]
      },
      "G14_UNCERTAIN_AS_FAR_AS_I_CAN_TELL": {
        "tokens": [
          "As far as I can tell,",
          "{CLAUSE}"
        ],
        "slots": [
          "CLAUSE"
        ]
      },
      "G14_UNCERTAIN_IT_LOOKS_LIKE": {
        "tokens": [
          "It looks like",
          "{CLAUSE}"
        ],
        "slots": [
          "CLAUSE"
        ]
      },
      "G14_UNCERTAIN_IT_SOUNDS_LIKE": {
        "tokens": [
          "It sounds like",
          "{CLAUSE}"
        ],
        "slots": [
          "CLAUSE"
        ]
      },
      "G14_EMPHASIS_DO_VERB": {
        "tokens": [
          "{SUBJECT}",
          "do",
          "{VERB_BASE}",
          "{OBJECT?}"
        ],
        "slots": [
          "SUBJECT",
          "VERB_BASE",
          "OBJECT?"
        ]
      },
      "G14_EMPHASIS_DID_VERB": {
        "tokens": [
          "{SUBJECT}",
          "did",
          "{VERB_BASE}",
          "{OBJECT?}"
        ],
        "slots": [
          "SUBJECT",
          "VERB_BASE",
          "OBJECT?"
        ]
      },
      "G14_EMPHASIS_REALLY": {
        "tokens": [
          "{SUBJECT}",
          "really",
          "{VERB}",
          "{OBJECT?}"
        ],
        "slots": [
          "SUBJECT",
          "VERB",
          "OBJECT?"
        ]
      },
      "G14_EMPHASIS_ACTUALLY": {
        "tokens": [
          "{SUBJECT}",
          "actually",
          "{VERB}",
          "{OBJECT?}"
        ],
        "slots": [
          "SUBJECT",
          "VERB",
          "OBJECT?"
        ]
      },
      "G14_EMPHASIS_EVEN": {
        "tokens": [
          "{SUBJECT}",
          "even",
          "{VERB}",
          "{OBJECT?}"
        ],
        "slots": [
          "SUBJECT",
          "VERB",
          "OBJECT?"
        ]
      },
      "G14_EMPHASIS_ONLY": {
        "tokens": [
          "{SUBJECT}",
          "only",
          "{VERB}",
          "{OBJECT?}"
        ],
        "slots": [
          "SUBJECT",
          "VERB",
          "OBJECT?"
        ]
      },
      "G14_EMPHASIS_JUST": {
        "tokens": [
          "{SUBJECT}",
          "just",
          "{VERB}",
          "{OBJECT?}"
        ],
        "slots": [
          "SUBJECT",
          "VERB",
          "OBJECT?"
        ]
      },
      "G14_EMPHASIS_ALL_I_WANT": {
        "tokens": [
          "All I want is",
          "{NOUN_PHRASE}"
        ],
        "slots": [
          "NOUN_PHRASE"
        ]
      },
      "G14_EMPHASIS_WHAT_I_NEED": {
        "tokens": [
          "What I need is",
          "{NOUN_PHRASE}"
        ],
        "slots": [
          "NOUN_PHRASE"
        ]
      },
      "G14_EMPHASIS_THE_THING_IS": {
        "tokens": [
          "The thing is,",
          "{CLAUSE}"
        ],
        "slots": [
          "CLAUSE"
        ]
      },
      "G14_SHORT_ME_TOO": {
        "tokens": [
          "Me too"
        ],
        "slots": []
      },
      "G14_SHORT_ME_NEITHER": {
        "tokens": [
          "Me neither"
        ],
        "slots": []
      },
      "G14_SHORT_SO_DO_I": {
        "tokens": [
          "So do I"
        ],
        "slots": []
      },
      "G14_SHORT_NEITHER_DO_I": {
        "tokens": [
          "Neither do I"
        ],
        "slots": []
      },
      "G14_SHORT_I_THINK_SO": {
        "tokens": [
          "I think so"
        ],
        "slots": []
      },
      "G14_SHORT_I_DONT_THINK_SO": {
        "tokens": [
          "I do not think so"
        ],
        "slots": []
      },
      "G14_SHORT_I_HOPE_SO": {
        "tokens": [
          "I hope so"
        ],
        "slots": []
      },
      "G14_SHORT_I_HOPE_NOT": {
        "tokens": [
          "I hope not"
        ],
        "slots": []
      },
      "G14_SHORT_NOT_YET": {
        "tokens": [
          "Not yet"
        ],
        "slots": []
      },
      "G14_SHORT_NOT_ANYMORE": {
        "tokens": [
          "Not anymore"
        ],
        "slots": []
      }
    }
  );
})();
