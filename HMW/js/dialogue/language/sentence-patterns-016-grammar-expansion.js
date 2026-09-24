(() => {
  "use strict";
  window.HMW=window.HMW||{};
  HMW.Dialogue=HMW.Dialogue||{};
  HMW.Dialogue.SENTENCE_PATTERNS=Object.assign(
    HMW.Dialogue.SENTENCE_PATTERNS||{},
    {
      "G16_INVERSION_NEVER": {
        "tokens": [
          "Never",
          "have",
          "{SUBJECT}",
          "{VERB_PP}",
          "{OBJECT?}"
        ],
        "slots": [
          "SUBJECT",
          "VERB_PP",
          "OBJECT?"
        ]
      },
      "G16_INVERSION_RARELY": {
        "tokens": [
          "Rarely",
          "does",
          "{SUBJECT}",
          "{VERB_BASE}",
          "{OBJECT?}"
        ],
        "slots": [
          "SUBJECT",
          "VERB_BASE",
          "OBJECT?"
        ]
      },
      "G16_INVERSION_SELDOM": {
        "tokens": [
          "Seldom",
          "does",
          "{SUBJECT}",
          "{VERB_BASE}",
          "{OBJECT?}"
        ],
        "slots": [
          "SUBJECT",
          "VERB_BASE",
          "OBJECT?"
        ]
      },
      "G16_INVERSION_HARDLY": {
        "tokens": [
          "Hardly",
          "had",
          "{SUBJECT}",
          "{VERB_PP}",
          "when",
          "{CLAUSE}"
        ],
        "slots": [
          "SUBJECT",
          "VERB_PP",
          "CLAUSE"
        ]
      },
      "G16_INVERSION_NO_SOONER": {
        "tokens": [
          "No sooner",
          "had",
          "{SUBJECT}",
          "{VERB_PP}",
          "than",
          "{CLAUSE}"
        ],
        "slots": [
          "SUBJECT",
          "VERB_PP",
          "CLAUSE"
        ]
      },
      "G16_INVERSION_NOT_ONLY": {
        "tokens": [
          "Not only",
          "does",
          "{SUBJECT}",
          "{VERB_BASE}",
          "{OBJECT?},",
          "but",
          "{CLAUSE}"
        ],
        "slots": [
          "SUBJECT",
          "VERB_BASE",
          "OBJECT?",
          "CLAUSE"
        ]
      },
      "G16_INVERSION_ONLY_THEN": {
        "tokens": [
          "Only then",
          "did",
          "{SUBJECT}",
          "{VERB_BASE}",
          "{OBJECT?}"
        ],
        "slots": [
          "SUBJECT",
          "VERB_BASE",
          "OBJECT?"
        ]
      },
      "G16_INVERSION_ONLY_IF": {
        "tokens": [
          "Only if",
          "{CLAUSE_A}",
          "will",
          "{SUBJECT}",
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
      "G16_INVERSION_UNDER_NO_CIRCUMSTANCES": {
        "tokens": [
          "Under no circumstances",
          "should",
          "{SUBJECT}",
          "{VERB_BASE}",
          "{OBJECT?}"
        ],
        "slots": [
          "SUBJECT",
          "VERB_BASE",
          "OBJECT?"
        ]
      },
      "G16_INVERSION_LITTLE_DID": {
        "tokens": [
          "Little did",
          "{SUBJECT}",
          "know that",
          "{CLAUSE}"
        ],
        "slots": [
          "SUBJECT",
          "CLAUSE"
        ]
      },
      "G16_PARTICIPLE_PRESENT": {
        "tokens": [
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
      "G16_PARTICIPLE_PAST": {
        "tokens": [
          "{VERB_PP}",
          "{COMPLEMENT?},",
          "{CLAUSE}"
        ],
        "slots": [
          "VERB_PP",
          "COMPLEMENT?",
          "CLAUSE"
        ]
      },
      "G16_PARTICIPLE_HAVING_PP": {
        "tokens": [
          "Having",
          "{VERB_PP}",
          "{OBJECT?},",
          "{CLAUSE}"
        ],
        "slots": [
          "VERB_PP",
          "OBJECT?",
          "CLAUSE"
        ]
      },
      "G16_PARTICIPLE_WHILE_ING": {
        "tokens": [
          "While",
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
      "G16_PARTICIPLE_WHEN_PP": {
        "tokens": [
          "When",
          "{VERB_PP}",
          "{COMPLEMENT?},",
          "{CLAUSE}"
        ],
        "slots": [
          "VERB_PP",
          "COMPLEMENT?",
          "CLAUSE"
        ]
      },
      "G16_PARTICIPLE_IF_PP": {
        "tokens": [
          "If",
          "{VERB_PP}",
          "{COMPLEMENT?},",
          "{CLAUSE}"
        ],
        "slots": [
          "VERB_PP",
          "COMPLEMENT?",
          "CLAUSE"
        ]
      },
      "G16_PARTICIPLE_UNLESS_PP": {
        "tokens": [
          "Unless",
          "{VERB_PP}",
          "{COMPLEMENT?},",
          "{CLAUSE}"
        ],
        "slots": [
          "VERB_PP",
          "COMPLEMENT?",
          "CLAUSE"
        ]
      },
      "G16_PARTICIPLE_ON_ING": {
        "tokens": [
          "On",
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
      "G16_PARTICIPLE_AFTER_ING": {
        "tokens": [
          "After",
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
      "G16_PARTICIPLE_BEFORE_ING": {
        "tokens": [
          "Before",
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
      "G16_CLEFT_IT_IS_THAT": {
        "tokens": [
          "It is",
          "{FOCUS}",
          "that",
          "{CLAUSE}"
        ],
        "slots": [
          "FOCUS",
          "CLAUSE"
        ]
      },
      "G16_CLEFT_IT_WAS_THAT": {
        "tokens": [
          "It was",
          "{FOCUS}",
          "that",
          "{CLAUSE}"
        ],
        "slots": [
          "FOCUS",
          "CLAUSE"
        ]
      },
      "G16_CLEFT_WHAT_IS": {
        "tokens": [
          "What",
          "{SUBJECT}",
          "{VERB}",
          "is",
          "{FOCUS}"
        ],
        "slots": [
          "SUBJECT",
          "VERB",
          "FOCUS"
        ]
      },
      "G16_CLEFT_WHAT_WAS": {
        "tokens": [
          "What",
          "{SUBJECT}",
          "{VERB}",
          "was",
          "{FOCUS}"
        ],
        "slots": [
          "SUBJECT",
          "VERB",
          "FOCUS"
        ]
      },
      "G16_CLEFT_THE_REASON_IS": {
        "tokens": [
          "The reason is that",
          "{CLAUSE}"
        ],
        "slots": [
          "CLAUSE"
        ]
      },
      "G16_CLEFT_THE_THING_I_NEED": {
        "tokens": [
          "The thing",
          "{SUBJECT}",
          "need is",
          "{NOUN_PHRASE}"
        ],
        "slots": [
          "SUBJECT",
          "NOUN_PHRASE"
        ]
      },
      "G16_CLEFT_ALL_I_CAN_DO": {
        "tokens": [
          "All",
          "{SUBJECT}",
          "can do is",
          "{VERB_BASE}",
          "{OBJECT?}"
        ],
        "slots": [
          "SUBJECT",
          "VERB_BASE",
          "OBJECT?"
        ]
      },
      "G16_CLEFT_WHERE_I_WANT": {
        "tokens": [
          "Where",
          "{SUBJECT}",
          "want to be is",
          "{PLACE}"
        ],
        "slots": [
          "SUBJECT",
          "PLACE"
        ]
      },
      "G16_CLEFT_WHEN_I_NEED": {
        "tokens": [
          "When",
          "{SUBJECT}",
          "need it is",
          "{TIME}"
        ],
        "slots": [
          "SUBJECT",
          "TIME"
        ]
      },
      "G16_CLEFT_WHO_I_MEAN": {
        "tokens": [
          "Who",
          "{SUBJECT}",
          "mean is",
          "{NOUN_PHRASE}"
        ],
        "slots": [
          "SUBJECT",
          "NOUN_PHRASE"
        ]
      },
      "G16_EMBEDDED_WHAT": {
        "tokens": [
          "Do you know what",
          "{CLAUSE}?"
        ],
        "slots": [
          "CLAUSE"
        ]
      },
      "G16_EMBEDDED_WHERE": {
        "tokens": [
          "Do you know where",
          "{CLAUSE}?"
        ],
        "slots": [
          "CLAUSE"
        ]
      },
      "G16_EMBEDDED_WHEN": {
        "tokens": [
          "Do you know when",
          "{CLAUSE}?"
        ],
        "slots": [
          "CLAUSE"
        ]
      },
      "G16_EMBEDDED_WHY": {
        "tokens": [
          "Do you know why",
          "{CLAUSE}?"
        ],
        "slots": [
          "CLAUSE"
        ]
      },
      "G16_EMBEDDED_HOW": {
        "tokens": [
          "Do you know how",
          "{CLAUSE}?"
        ],
        "slots": [
          "CLAUSE"
        ]
      },
      "G16_EMBEDDED_WHO": {
        "tokens": [
          "Do you know who",
          "{CLAUSE}?"
        ],
        "slots": [
          "CLAUSE"
        ]
      },
      "G16_EMBEDDED_IF": {
        "tokens": [
          "Do you know if",
          "{CLAUSE}?"
        ],
        "slots": [
          "CLAUSE"
        ]
      },
      "G16_EMBEDDED_WONDER_WHAT": {
        "tokens": [
          "I wonder what",
          "{CLAUSE}"
        ],
        "slots": [
          "CLAUSE"
        ]
      },
      "G16_EMBEDDED_WONDER_WHETHER": {
        "tokens": [
          "I wonder whether",
          "{CLAUSE}"
        ],
        "slots": [
          "CLAUSE"
        ]
      },
      "G16_EMBEDDED_TELL_ME_WHERE": {
        "tokens": [
          "Tell me where",
          "{CLAUSE}"
        ],
        "slots": [
          "CLAUSE"
        ]
      },
      "G16_CONCESSION_NO_MATTER_WHAT": {
        "tokens": [
          "No matter what",
          "{CLAUSE_A},",
          "{CLAUSE_B}"
        ],
        "slots": [
          "CLAUSE_A",
          "CLAUSE_B"
        ]
      },
      "G16_CONCESSION_NO_MATTER_WHO": {
        "tokens": [
          "No matter who",
          "{CLAUSE_A},",
          "{CLAUSE_B}"
        ],
        "slots": [
          "CLAUSE_A",
          "CLAUSE_B"
        ]
      },
      "G16_CONCESSION_NO_MATTER_WHERE": {
        "tokens": [
          "No matter where",
          "{CLAUSE_A},",
          "{CLAUSE_B}"
        ],
        "slots": [
          "CLAUSE_A",
          "CLAUSE_B"
        ]
      },
      "G16_CONCESSION_NO_MATTER_WHEN": {
        "tokens": [
          "No matter when",
          "{CLAUSE_A},",
          "{CLAUSE_B}"
        ],
        "slots": [
          "CLAUSE_A",
          "CLAUSE_B"
        ]
      },
      "G16_CONCESSION_NO_MATTER_HOW": {
        "tokens": [
          "No matter how",
          "{CLAUSE_A},",
          "{CLAUSE_B}"
        ],
        "slots": [
          "CLAUSE_A",
          "CLAUSE_B"
        ]
      },
      "G16_CONCESSION_WHATEVER": {
        "tokens": [
          "Whatever",
          "{CLAUSE_A},",
          "{CLAUSE_B}"
        ],
        "slots": [
          "CLAUSE_A",
          "CLAUSE_B"
        ]
      },
      "G16_CONCESSION_WHOEVER": {
        "tokens": [
          "Whoever",
          "{CLAUSE_A},",
          "{CLAUSE_B}"
        ],
        "slots": [
          "CLAUSE_A",
          "CLAUSE_B"
        ]
      },
      "G16_CONCESSION_WHEREVER": {
        "tokens": [
          "Wherever",
          "{CLAUSE_A},",
          "{CLAUSE_B}"
        ],
        "slots": [
          "CLAUSE_A",
          "CLAUSE_B"
        ]
      },
      "G16_CONCESSION_WHENEVER": {
        "tokens": [
          "Whenever",
          "{CLAUSE_A},",
          "{CLAUSE_B}"
        ],
        "slots": [
          "CLAUSE_A",
          "CLAUSE_B"
        ]
      },
      "G16_CONCESSION_HOWEVER_ADJ": {
        "tokens": [
          "However",
          "{ADJECTIVE}",
          "{CLAUSE_A},",
          "{CLAUSE_B}"
        ],
        "slots": [
          "ADJECTIVE",
          "CLAUSE_A",
          "CLAUSE_B"
        ]
      },
      "G16_CORRELATIVE_SO_THAT": {
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
      "G16_CORRELATIVE_SUCH_THAT": {
        "tokens": [
          "{SUBJECT}",
          "{VERB}",
          "such",
          "{ARTICLE}",
          "{ADJECTIVE?}",
          "{NOUN}",
          "that",
          "{CLAUSE}"
        ],
        "slots": [
          "SUBJECT",
          "VERB",
          "ARTICLE",
          "ADJECTIVE?",
          "NOUN",
          "CLAUSE"
        ]
      },
      "G16_CORRELATIVE_TOO_TO": {
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
      "G16_CORRELATIVE_ENOUGH_TO": {
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
      "G16_CORRELATIVE_AS_IF": {
        "tokens": [
          "{SUBJECT}",
          "{VERB}",
          "as if",
          "{CLAUSE}"
        ],
        "slots": [
          "SUBJECT",
          "VERB",
          "CLAUSE"
        ]
      },
      "G16_CORRELATIVE_AS_THOUGH": {
        "tokens": [
          "{SUBJECT}",
          "{VERB}",
          "as though",
          "{CLAUSE}"
        ],
        "slots": [
          "SUBJECT",
          "VERB",
          "CLAUSE"
        ]
      },
      "G16_CORRELATIVE_RATHER_THAN": {
        "tokens": [
          "Rather than",
          "{VERB_BASE}",
          "{OBJECT_A},",
          "{SUBJECT}",
          "{VERB}",
          "{OBJECT_B}"
        ],
        "slots": [
          "VERB_BASE",
          "OBJECT_A",
          "SUBJECT",
          "VERB",
          "OBJECT_B"
        ]
      },
      "G16_CORRELATIVE_NOT_BUT": {
        "tokens": [
          "{SUBJECT}",
          "{VERB}",
          "not",
          "{OBJECT_A}",
          "but",
          "{OBJECT_B}"
        ],
        "slots": [
          "SUBJECT",
          "VERB",
          "OBJECT_A",
          "OBJECT_B"
        ]
      },
      "G16_CORRELATIVE_BOTH_AND_VERB": {
        "tokens": [
          "{SUBJECT}",
          "both",
          "{VERB_A}",
          "and",
          "{VERB_B}"
        ],
        "slots": [
          "SUBJECT",
          "VERB_A",
          "VERB_B"
        ]
      },
      "G16_CORRELATIVE_WHETHER_OR": {
        "tokens": [
          "Whether",
          "{CLAUSE_A}",
          "or",
          "{CLAUSE_B},",
          "{MAIN_CLAUSE}"
        ],
        "slots": [
          "CLAUSE_A",
          "CLAUSE_B",
          "MAIN_CLAUSE"
        ]
      },
      "G16_DEGREE_SO_ADJ": {
        "tokens": [
          "{SUBJECT}",
          "{BE}",
          "so",
          "{ADJECTIVE}"
        ],
        "slots": [
          "SUBJECT",
          "BE",
          "ADJECTIVE"
        ]
      },
      "G16_DEGREE_TOO_ADJ": {
        "tokens": [
          "{SUBJECT}",
          "{BE}",
          "too",
          "{ADJECTIVE}"
        ],
        "slots": [
          "SUBJECT",
          "BE",
          "ADJECTIVE"
        ]
      },
      "G16_DEGREE_VERY_ADJ": {
        "tokens": [
          "{SUBJECT}",
          "{BE}",
          "very",
          "{ADJECTIVE}"
        ],
        "slots": [
          "SUBJECT",
          "BE",
          "ADJECTIVE"
        ]
      },
      "G16_DEGREE_QUITE_ADJ": {
        "tokens": [
          "{SUBJECT}",
          "{BE}",
          "quite",
          "{ADJECTIVE}"
        ],
        "slots": [
          "SUBJECT",
          "BE",
          "ADJECTIVE"
        ]
      },
      "G16_DEGREE_RATHER_ADJ": {
        "tokens": [
          "{SUBJECT}",
          "{BE}",
          "rather",
          "{ADJECTIVE}"
        ],
        "slots": [
          "SUBJECT",
          "BE",
          "ADJECTIVE"
        ]
      },
      "G16_DEGREE_FAIRLY_ADJ": {
        "tokens": [
          "{SUBJECT}",
          "{BE}",
          "fairly",
          "{ADJECTIVE}"
        ],
        "slots": [
          "SUBJECT",
          "BE",
          "ADJECTIVE"
        ]
      },
      "G16_DEGREE_EXTREMELY_ADJ": {
        "tokens": [
          "{SUBJECT}",
          "{BE}",
          "extremely",
          "{ADJECTIVE}"
        ],
        "slots": [
          "SUBJECT",
          "BE",
          "ADJECTIVE"
        ]
      },
      "G16_DEGREE_NOT_VERY_ADJ": {
        "tokens": [
          "{SUBJECT}",
          "{BE}",
          "not very",
          "{ADJECTIVE}"
        ],
        "slots": [
          "SUBJECT",
          "BE",
          "ADJECTIVE"
        ]
      },
      "G16_DEGREE_ALMOST_ADJ": {
        "tokens": [
          "{SUBJECT}",
          "{BE}",
          "almost",
          "{ADJECTIVE}"
        ],
        "slots": [
          "SUBJECT",
          "BE",
          "ADJECTIVE"
        ]
      },
      "G16_DEGREE_NEARLY_ADJ": {
        "tokens": [
          "{SUBJECT}",
          "{BE}",
          "nearly",
          "{ADJECTIVE}"
        ],
        "slots": [
          "SUBJECT",
          "BE",
          "ADJECTIVE"
        ]
      },
      "G16_OPINION_AS_I_SEE_IT": {
        "tokens": [
          "As I see it,",
          "{CLAUSE}"
        ],
        "slots": [
          "CLAUSE"
        ]
      },
      "G16_OPINION_IN_MY_VIEW": {
        "tokens": [
          "In my view,",
          "{CLAUSE}"
        ],
        "slots": [
          "CLAUSE"
        ]
      },
      "G16_OPINION_TO_ME": {
        "tokens": [
          "To me,",
          "{CLAUSE}"
        ],
        "slots": [
          "CLAUSE"
        ]
      },
      "G16_OPINION_I_BELIEVE": {
        "tokens": [
          "I believe",
          "{CLAUSE}"
        ],
        "slots": [
          "CLAUSE"
        ]
      },
      "G16_OPINION_I_FEEL_THAT": {
        "tokens": [
          "I feel that",
          "{CLAUSE}"
        ],
        "slots": [
          "CLAUSE"
        ]
      },
      "G16_OPINION_IT_APPEARS": {
        "tokens": [
          "It appears that",
          "{CLAUSE}"
        ],
        "slots": [
          "CLAUSE"
        ]
      },
      "G16_OPINION_I_ASSUME": {
        "tokens": [
          "I assume",
          "{CLAUSE}"
        ],
        "slots": [
          "CLAUSE"
        ]
      },
      "G16_OPINION_I_EXPECT": {
        "tokens": [
          "I expect",
          "{CLAUSE}"
        ],
        "slots": [
          "CLAUSE"
        ]
      },
      "G16_OPINION_I_SUSPECT": {
        "tokens": [
          "I suspect",
          "{CLAUSE}"
        ],
        "slots": [
          "CLAUSE"
        ]
      },
      "G16_OPINION_I_DOUBT": {
        "tokens": [
          "I doubt",
          "{CLAUSE}"
        ],
        "slots": [
          "CLAUSE"
        ]
      },
      "G16_SEQUENCE_TO_BEGIN_WITH": {
        "tokens": [
          "To begin with,",
          "{CLAUSE}"
        ],
        "slots": [
          "CLAUSE"
        ]
      },
      "G16_SEQUENCE_FIRST_OF_ALL": {
        "tokens": [
          "First of all,",
          "{CLAUSE}"
        ],
        "slots": [
          "CLAUSE"
        ]
      },
      "G16_SEQUENCE_SECONDLY": {
        "tokens": [
          "Secondly,",
          "{CLAUSE}"
        ],
        "slots": [
          "CLAUSE"
        ]
      },
      "G16_SEQUENCE_THEN": {
        "tokens": [
          "Then,",
          "{CLAUSE}"
        ],
        "slots": [
          "CLAUSE"
        ]
      },
      "G16_SEQUENCE_AFTER_THAT": {
        "tokens": [
          "After that,",
          "{CLAUSE}"
        ],
        "slots": [
          "CLAUSE"
        ]
      },
      "G16_SEQUENCE_NEXT": {
        "tokens": [
          "Next,",
          "{CLAUSE}"
        ],
        "slots": [
          "CLAUSE"
        ]
      },
      "G16_SEQUENCE_FINALLY": {
        "tokens": [
          "Finally,",
          "{CLAUSE}"
        ],
        "slots": [
          "CLAUSE"
        ]
      },
      "G16_SEQUENCE_IN_THE_END": {
        "tokens": [
          "In the end,",
          "{CLAUSE}"
        ],
        "slots": [
          "CLAUSE"
        ]
      },
      "G16_SEQUENCE_SOON_AFTER": {
        "tokens": [
          "Soon after,",
          "{CLAUSE}"
        ],
        "slots": [
          "CLAUSE"
        ]
      },
      "G16_SEQUENCE_FROM_THEN_ON": {
        "tokens": [
          "From then on,",
          "{CLAUSE}"
        ],
        "slots": [
          "CLAUSE"
        ]
      },
      "G16_BOUNDARY_I_DONT_WANT_TO": {
        "tokens": [
          "I do not want to",
          "{VERB_BASE}",
          "{OBJECT?}"
        ],
        "slots": [
          "VERB_BASE",
          "OBJECT?"
        ]
      },
      "G16_BOUNDARY_ID_RATHER_NOT": {
        "tokens": [
          "I would rather not",
          "{VERB_BASE}",
          "{OBJECT?}"
        ],
        "slots": [
          "VERB_BASE",
          "OBJECT?"
        ]
      },
      "G16_BOUNDARY_PLEASE_DONT": {
        "tokens": [
          "Please do not",
          "{VERB_BASE}",
          "{OBJECT?}"
        ],
        "slots": [
          "VERB_BASE",
          "OBJECT?"
        ]
      },
      "G16_BOUNDARY_STOP_GERUND": {
        "tokens": [
          "Please stop",
          "{VERB_ING}",
          "{OBJECT?}"
        ],
        "slots": [
          "VERB_ING",
          "OBJECT?"
        ]
      },
      "G16_BOUNDARY_NOT_COMFORTABLE": {
        "tokens": [
          "I am not comfortable with",
          "{NOUN_PHRASE}"
        ],
        "slots": [
          "NOUN_PHRASE"
        ]
      },
      "G16_BOUNDARY_NEED_SPACE": {
        "tokens": [
          "I need",
          "{NOUN_PHRASE}"
        ],
        "slots": [
          "NOUN_PHRASE"
        ]
      },
      "G16_BOUNDARY_NOT_OKAY": {
        "tokens": [
          "That is not okay with me"
        ],
        "slots": []
      },
      "G16_BOUNDARY_DONT_DO_THAT": {
        "tokens": [
          "Do not do that"
        ],
        "slots": []
      },
      "G16_BOUNDARY_LEAVE_ME_ALONE": {
        "tokens": [
          "Please leave me alone"
        ],
        "slots": []
      },
      "G16_BOUNDARY_I_SAID_NO": {
        "tokens": [
          "I said no"
        ],
        "slots": []
      }
    }
  );
})();
