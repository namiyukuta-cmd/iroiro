(() => {
  "use strict";
  window.HMW=window.HMW||{};
  HMW.Dialogue=HMW.Dialogue||{};
  HMW.Dialogue.SENTENCE_PATTERNS=Object.assign(
    HMW.Dialogue.SENTENCE_PATTERNS||{},
    {
      "G17_REQUEST_CAN_YOU": {
        "tokens": [
          "Can you",
          "{VERB_BASE}",
          "{OBJECT?}?"
        ],
        "slots": [
          "VERB_BASE",
          "OBJECT?"
        ]
      },
      "G17_REQUEST_COULD_YOU": {
        "tokens": [
          "Could you",
          "{VERB_BASE}",
          "{OBJECT?}?"
        ],
        "slots": [
          "VERB_BASE",
          "OBJECT?"
        ]
      },
      "G17_REQUEST_WOULD_YOU": {
        "tokens": [
          "Would you",
          "{VERB_BASE}",
          "{OBJECT?}?"
        ],
        "slots": [
          "VERB_BASE",
          "OBJECT?"
        ]
      },
      "G17_REQUEST_WILL_YOU": {
        "tokens": [
          "Will you",
          "{VERB_BASE}",
          "{OBJECT?}?"
        ],
        "slots": [
          "VERB_BASE",
          "OBJECT?"
        ]
      },
      "G17_REQUEST_PLEASE": {
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
      "G17_REQUEST_DONT_FORGET": {
        "tokens": [
          "Do not forget to",
          "{VERB_BASE}",
          "{OBJECT?}"
        ],
        "slots": [
          "VERB_BASE",
          "OBJECT?"
        ]
      },
      "G17_REQUEST_REMEMBER_TO": {
        "tokens": [
          "Remember to",
          "{VERB_BASE}",
          "{OBJECT?}"
        ],
        "slots": [
          "VERB_BASE",
          "OBJECT?"
        ]
      },
      "G17_REQUEST_MAKE_SURE": {
        "tokens": [
          "Make sure to",
          "{VERB_BASE}",
          "{OBJECT?}"
        ],
        "slots": [
          "VERB_BASE",
          "OBJECT?"
        ]
      },
      "G17_REQUEST_LET_ME": {
        "tokens": [
          "Let me",
          "{VERB_BASE}",
          "{OBJECT?}"
        ],
        "slots": [
          "VERB_BASE",
          "OBJECT?"
        ]
      },
      "G17_REQUEST_HELP_ME": {
        "tokens": [
          "Help me",
          "{VERB_BASE}",
          "{OBJECT?}"
        ],
        "slots": [
          "VERB_BASE",
          "OBJECT?"
        ]
      },
      "G17_INVITE_WANT_TO": {
        "tokens": [
          "Do you want to",
          "{VERB_BASE}",
          "{OBJECT?}?"
        ],
        "slots": [
          "VERB_BASE",
          "OBJECT?"
        ]
      },
      "G17_INVITE_WOULD_YOU_LIKE_TO": {
        "tokens": [
          "Would you like to",
          "{VERB_BASE}",
          "{OBJECT?}?"
        ],
        "slots": [
          "VERB_BASE",
          "OBJECT?"
        ]
      },
      "G17_INVITE_HOW_ABOUT": {
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
      "G17_INVITE_WHY_NOT": {
        "tokens": [
          "Why not",
          "{VERB_BASE}",
          "{OBJECT?}?"
        ],
        "slots": [
          "VERB_BASE",
          "OBJECT?"
        ]
      },
      "G17_INVITE_LETS": {
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
      "G17_INVITE_SHALL_WE": {
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
      "G17_INVITE_WE_COULD": {
        "tokens": [
          "We could",
          "{VERB_BASE}",
          "{OBJECT?}"
        ],
        "slots": [
          "VERB_BASE",
          "OBJECT?"
        ]
      },
      "G17_INVITE_MAYBE_WE_SHOULD": {
        "tokens": [
          "Maybe we should",
          "{VERB_BASE}",
          "{OBJECT?}"
        ],
        "slots": [
          "VERB_BASE",
          "OBJECT?"
        ]
      },
      "G17_INVITE_ID_LIKE_YOU_TO": {
        "tokens": [
          "I would like you to",
          "{VERB_BASE}",
          "{OBJECT?}"
        ],
        "slots": [
          "VERB_BASE",
          "OBJECT?"
        ]
      },
      "G17_INVITE_JOIN_ME": {
        "tokens": [
          "Would you join me for",
          "{NOUN_PHRASE}?"
        ],
        "slots": [
          "NOUN_PHRASE"
        ]
      },
      "G17_PLAN_IM_PLANNING_TO": {
        "tokens": [
          "I am planning to",
          "{VERB_BASE}",
          "{OBJECT?}"
        ],
        "slots": [
          "VERB_BASE",
          "OBJECT?"
        ]
      },
      "G17_PLAN_IM_THINKING_OF": {
        "tokens": [
          "I am thinking of",
          "{VERB_ING}",
          "{OBJECT?}"
        ],
        "slots": [
          "VERB_ING",
          "OBJECT?"
        ]
      },
      "G17_PLAN_I_INTEND_TO": {
        "tokens": [
          "I intend to",
          "{VERB_BASE}",
          "{OBJECT?}"
        ],
        "slots": [
          "VERB_BASE",
          "OBJECT?"
        ]
      },
      "G17_PLAN_I_MIGHT": {
        "tokens": [
          "I might",
          "{VERB_BASE}",
          "{OBJECT?}"
        ],
        "slots": [
          "VERB_BASE",
          "OBJECT?"
        ]
      },
      "G17_PLAN_I_WILL_PROBABLY": {
        "tokens": [
          "I will probably",
          "{VERB_BASE}",
          "{OBJECT?}"
        ],
        "slots": [
          "VERB_BASE",
          "OBJECT?"
        ]
      },
      "G17_PLAN_I_HAVE_TO": {
        "tokens": [
          "I have to",
          "{VERB_BASE}",
          "{OBJECT?}"
        ],
        "slots": [
          "VERB_BASE",
          "OBJECT?"
        ]
      },
      "G17_PLAN_I_NEED_TO": {
        "tokens": [
          "I need to",
          "{VERB_BASE}",
          "{OBJECT?}"
        ],
        "slots": [
          "VERB_BASE",
          "OBJECT?"
        ]
      },
      "G17_PLAN_IM_SUPPOSED_TO": {
        "tokens": [
          "I am supposed to",
          "{VERB_BASE}",
          "{OBJECT?}"
        ],
        "slots": [
          "VERB_BASE",
          "OBJECT?"
        ]
      },
      "G17_PLAN_IM_ABOUT_TO": {
        "tokens": [
          "I am about to",
          "{VERB_BASE}",
          "{OBJECT?}"
        ],
        "slots": [
          "VERB_BASE",
          "OBJECT?"
        ]
      },
      "G17_PLAN_I_DECIDED_TO": {
        "tokens": [
          "I decided to",
          "{VERB_BASE}",
          "{OBJECT?}"
        ],
        "slots": [
          "VERB_BASE",
          "OBJECT?"
        ]
      },
      "G17_REACTION_REALLY_Q": {
        "tokens": [
          "Really?"
        ],
        "slots": []
      },
      "G17_REACTION_ARE_YOU_SURE": {
        "tokens": [
          "Are you sure?"
        ],
        "slots": []
      },
      "G17_REACTION_THATS_SURPRISING": {
        "tokens": [
          "That is surprising"
        ],
        "slots": []
      },
      "G17_REACTION_THATS_GOOD": {
        "tokens": [
          "That is good"
        ],
        "slots": []
      },
      "G17_REACTION_THATS_BAD": {
        "tokens": [
          "That is bad"
        ],
        "slots": []
      },
      "G17_REACTION_THATS_INTERESTING": {
        "tokens": [
          "That is interesting"
        ],
        "slots": []
      },
      "G17_REACTION_THATS_UNFORTUNATE": {
        "tokens": [
          "That is unfortunate"
        ],
        "slots": []
      },
      "G17_REACTION_I_DIDNT_EXPECT_THAT": {
        "tokens": [
          "I did not expect that"
        ],
        "slots": []
      },
      "G17_REACTION_I_KNEW_IT": {
        "tokens": [
          "I knew it"
        ],
        "slots": []
      },
      "G17_REACTION_THAT_EXPLAINS_IT": {
        "tokens": [
          "That explains it"
        ],
        "slots": []
      },
      "G17_AGREEMENT_I_AGREE": {
        "tokens": [
          "I agree"
        ],
        "slots": []
      },
      "G17_AGREEMENT_I_DONT_AGREE": {
        "tokens": [
          "I do not agree"
        ],
        "slots": []
      },
      "G17_AGREEMENT_YOURE_RIGHT": {
        "tokens": [
          "You are right"
        ],
        "slots": []
      },
      "G17_AGREEMENT_IM_NOT_SURE": {
        "tokens": [
          "I am not sure about that"
        ],
        "slots": []
      },
      "G17_AGREEMENT_THATS_TRUE": {
        "tokens": [
          "That is true"
        ],
        "slots": []
      },
      "G17_AGREEMENT_NOT_NECESSARILY": {
        "tokens": [
          "Not necessarily"
        ],
        "slots": []
      },
      "G17_AGREEMENT_I_SEE_YOUR_POINT": {
        "tokens": [
          "I see your point"
        ],
        "slots": []
      },
      "G17_AGREEMENT_I_DISAGREE": {
        "tokens": [
          "I disagree"
        ],
        "slots": []
      },
      "G17_AGREEMENT_THATS_FAIR": {
        "tokens": [
          "That is fair"
        ],
        "slots": []
      },
      "G17_AGREEMENT_FAIR_ENOUGH": {
        "tokens": [
          "Fair enough"
        ],
        "slots": []
      },
      "G17_CLARIFY_WHAT_DO_YOU_MEAN": {
        "tokens": [
          "What do you mean by",
          "{NOUN_PHRASE}?"
        ],
        "slots": [
          "NOUN_PHRASE"
        ]
      },
      "G17_CLARIFY_CAN_YOU_EXPLAIN": {
        "tokens": [
          "Can you explain",
          "{NOUN_PHRASE}?"
        ],
        "slots": [
          "NOUN_PHRASE"
        ]
      },
      "G17_CLARIFY_CAN_YOU_REPEAT": {
        "tokens": [
          "Can you repeat that?"
        ],
        "slots": []
      },
      "G17_CLARIFY_CAN_YOU_SAY_AGAIN": {
        "tokens": [
          "Can you say that again?"
        ],
        "slots": []
      },
      "G17_CLARIFY_DID_YOU_MEAN": {
        "tokens": [
          "Did you mean",
          "{NOUN_PHRASE}?"
        ],
        "slots": [
          "NOUN_PHRASE"
        ]
      },
      "G17_CLARIFY_TO_BE_CLEAR": {
        "tokens": [
          "To be clear,",
          "{CLAUSE}"
        ],
        "slots": [
          "CLAUSE"
        ]
      },
      "G17_CLARIFY_WHAT_I_MEAN": {
        "tokens": [
          "What I mean is",
          "{CLAUSE}"
        ],
        "slots": [
          "CLAUSE"
        ]
      },
      "G17_CLARIFY_MORE_SPECIFICALLY": {
        "tokens": [
          "More specifically,",
          "{CLAUSE}"
        ],
        "slots": [
          "CLAUSE"
        ]
      },
      "G17_FEELING_I_FEEL_ADJ": {
        "tokens": [
          "I feel",
          "{ADJECTIVE}"
        ],
        "slots": [
          "ADJECTIVE"
        ]
      },
      "G17_FEELING_YOU_SEEM_ADJ": {
        "tokens": [
          "You seem",
          "{ADJECTIVE}"
        ],
        "slots": [
          "ADJECTIVE"
        ]
      },
      "G17_FEELING_ARE_YOU_ADJ": {
        "tokens": [
          "Are you",
          "{ADJECTIVE}?"
        ],
        "slots": [
          "ADJECTIVE"
        ]
      },
      "G17_FEELING_I_AM_GLAD_THAT": {
        "tokens": [
          "I am glad that",
          "{CLAUSE}"
        ],
        "slots": [
          "CLAUSE"
        ]
      },
      "G17_FEELING_I_AM_SORRY_THAT": {
        "tokens": [
          "I am sorry that",
          "{CLAUSE}"
        ],
        "slots": [
          "CLAUSE"
        ]
      },
      "G17_FEELING_I_AM_WORRIED_THAT": {
        "tokens": [
          "I am worried that",
          "{CLAUSE}"
        ],
        "slots": [
          "CLAUSE"
        ]
      },
      "G17_FEELING_I_AM_AFRAID_THAT": {
        "tokens": [
          "I am afraid that",
          "{CLAUSE}"
        ],
        "slots": [
          "CLAUSE"
        ]
      },
      "G17_FEELING_I_AM_HAPPY_TO": {
        "tokens": [
          "I am happy to",
          "{VERB_BASE}",
          "{OBJECT?}"
        ],
        "slots": [
          "VERB_BASE",
          "OBJECT?"
        ]
      },
      "G17_FEELING_I_AM_RELIEVED_THAT": {
        "tokens": [
          "I am relieved that",
          "{CLAUSE}"
        ],
        "slots": [
          "CLAUSE"
        ]
      },
      "G17_FEELING_IT_BOTHERS_ME": {
        "tokens": [
          "It bothers me that",
          "{CLAUSE}"
        ],
        "slots": [
          "CLAUSE"
        ]
      },
      "G17_MEMORY_I_REMEMBER": {
        "tokens": [
          "I remember",
          "{VERB_ING}",
          "{OBJECT?}"
        ],
        "slots": [
          "VERB_ING",
          "OBJECT?"
        ]
      },
      "G17_MEMORY_I_REMEMBER_THAT": {
        "tokens": [
          "I remember that",
          "{CLAUSE}"
        ],
        "slots": [
          "CLAUSE"
        ]
      },
      "G17_MEMORY_I_FORGOT_TO": {
        "tokens": [
          "I forgot to",
          "{VERB_BASE}",
          "{OBJECT?}"
        ],
        "slots": [
          "VERB_BASE",
          "OBJECT?"
        ]
      },
      "G17_MEMORY_DONT_FORGET": {
        "tokens": [
          "Do not forget",
          "{NOUN_PHRASE}"
        ],
        "slots": [
          "NOUN_PHRASE"
        ]
      },
      "G17_MEMORY_DO_YOU_REMEMBER": {
        "tokens": [
          "Do you remember",
          "{NOUN_PHRASE}?"
        ],
        "slots": [
          "NOUN_PHRASE"
        ]
      },
      "G17_MEMORY_IT_REMINDS_ME_OF": {
        "tokens": [
          "It reminds me of",
          "{NOUN_PHRASE}"
        ],
        "slots": [
          "NOUN_PHRASE"
        ]
      },
      "G17_MEMORY_AS_I_RECALL": {
        "tokens": [
          "As I recall,",
          "{CLAUSE}"
        ],
        "slots": [
          "CLAUSE"
        ]
      },
      "G17_MEMORY_IF_I_REMEMBER": {
        "tokens": [
          "If I remember correctly,",
          "{CLAUSE}"
        ],
        "slots": [
          "CLAUSE"
        ]
      },
      "G17_MEMORY_I_CANT_REMEMBER": {
        "tokens": [
          "I cannot remember",
          "{NOUN_PHRASE}"
        ],
        "slots": [
          "NOUN_PHRASE"
        ]
      },
      "G17_MEMORY_I_WONT_FORGET": {
        "tokens": [
          "I will not forget",
          "{NOUN_PHRASE}"
        ],
        "slots": [
          "NOUN_PHRASE"
        ]
      },
      "G17_POSSIBILITY_ITS_POSSIBLE": {
        "tokens": [
          "It is possible that",
          "{CLAUSE}"
        ],
        "slots": [
          "CLAUSE"
        ]
      },
      "G17_POSSIBILITY_ITS_UNLIKELY": {
        "tokens": [
          "It is unlikely that",
          "{CLAUSE}"
        ],
        "slots": [
          "CLAUSE"
        ]
      },
      "G17_POSSIBILITY_THERES_A_CHANCE": {
        "tokens": [
          "There is a chance that",
          "{CLAUSE}"
        ],
        "slots": [
          "CLAUSE"
        ]
      },
      "G17_POSSIBILITY_THERES_NO_WAY": {
        "tokens": [
          "There is no way that",
          "{CLAUSE}"
        ],
        "slots": [
          "CLAUSE"
        ]
      },
      "G17_POSSIBILITY_IT_COULD_BE": {
        "tokens": [
          "It could be",
          "{NOUN_PHRASE}"
        ],
        "slots": [
          "NOUN_PHRASE"
        ]
      },
      "G17_POSSIBILITY_IT_MAY_HAVE": {
        "tokens": [
          "It may have",
          "{VERB_PP}",
          "{OBJECT?}"
        ],
        "slots": [
          "VERB_PP",
          "OBJECT?"
        ]
      },
      "G17_POSSIBILITY_IT_MIGHT_HAVE": {
        "tokens": [
          "It might have",
          "{VERB_PP}",
          "{OBJECT?}"
        ],
        "slots": [
          "VERB_PP",
          "OBJECT?"
        ]
      },
      "G17_POSSIBILITY_IT_CANT_BE": {
        "tokens": [
          "It cannot be",
          "{NOUN_PHRASE}"
        ],
        "slots": [
          "NOUN_PHRASE"
        ]
      },
      "G17_POSSIBILITY_IT_MUST_BE": {
        "tokens": [
          "It must be",
          "{NOUN_PHRASE}"
        ],
        "slots": [
          "NOUN_PHRASE"
        ]
      },
      "G17_POSSIBILITY_PROBABLY": {
        "tokens": [
          "It is probably",
          "{NOUN_PHRASE}"
        ],
        "slots": [
          "NOUN_PHRASE"
        ]
      },
      "G17_DECISION_IVE_DECIDED": {
        "tokens": [
          "I have decided to",
          "{VERB_BASE}",
          "{OBJECT?}"
        ],
        "slots": [
          "VERB_BASE",
          "OBJECT?"
        ]
      },
      "G17_DECISION_I_HAVENT_DECIDED": {
        "tokens": [
          "I have not decided yet"
        ],
        "slots": []
      },
      "G17_DECISION_LET_ME_THINK": {
        "tokens": [
          "Let me think"
        ],
        "slots": []
      },
      "G17_DECISION_GIVE_ME_A_MOMENT": {
        "tokens": [
          "Give me a moment"
        ],
        "slots": []
      },
      "G17_DECISION_ILL_CHOOSE": {
        "tokens": [
          "I will choose",
          "{OBJECT}"
        ],
        "slots": [
          "OBJECT"
        ]
      },
      "G17_DECISION_ID_CHOOSE": {
        "tokens": [
          "I would choose",
          "{OBJECT}"
        ],
        "slots": [
          "OBJECT"
        ]
      }
    }
  );
})();
