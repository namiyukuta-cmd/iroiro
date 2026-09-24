(() => {
  "use strict";
  window.HMW=window.HMW||{};
  HMW.Dialogue=HMW.Dialogue||{};
  HMW.Dialogue.SENTENCE_PATTERNS=Object.assign(
    HMW.Dialogue.SENTENCE_PATTERNS||{},
    {
      "G15_TIME_PRESENT_BEFORE_NOW": {
        "tokens": [
          "{SUBJECT}",
          "have",
          "{VERB_PP}",
          "{OBJECT?}",
          "before"
        ],
        "slots": [
          "SUBJECT",
          "VERB_PP",
          "OBJECT?"
        ]
      },
      "G15_TIME_PRESENT_ALREADY": {
        "tokens": [
          "{SUBJECT}",
          "have already",
          "{VERB_PP}",
          "{OBJECT?}"
        ],
        "slots": [
          "SUBJECT",
          "VERB_PP",
          "OBJECT?"
        ]
      },
      "G15_TIME_PRESENT_JUST": {
        "tokens": [
          "{SUBJECT}",
          "have just",
          "{VERB_PP}",
          "{OBJECT?}"
        ],
        "slots": [
          "SUBJECT",
          "VERB_PP",
          "OBJECT?"
        ]
      },
      "G15_TIME_PRESENT_YET_Q": {
        "tokens": [
          "Have",
          "{SUBJECT}",
          "{VERB_PP}",
          "{OBJECT?}",
          "yet?"
        ],
        "slots": [
          "SUBJECT",
          "VERB_PP",
          "OBJECT?"
        ]
      },
      "G15_TIME_PRESENT_NOT_YET": {
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
      "G15_TIME_EVER_Q": {
        "tokens": [
          "Have",
          "{SUBJECT}",
          "ever",
          "{VERB_PP}",
          "{OBJECT?}?"
        ],
        "slots": [
          "SUBJECT",
          "VERB_PP",
          "OBJECT?"
        ]
      },
      "G15_TIME_NEVER": {
        "tokens": [
          "{SUBJECT}",
          "have never",
          "{VERB_PP}",
          "{OBJECT?}"
        ],
        "slots": [
          "SUBJECT",
          "VERB_PP",
          "OBJECT?"
        ]
      },
      "G15_TIME_SINCE": {
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
      "G15_TIME_FOR": {
        "tokens": [
          "{SUBJECT}",
          "have",
          "{VERB_PP}",
          "{OBJECT?}",
          "for",
          "{DURATION}"
        ],
        "slots": [
          "SUBJECT",
          "VERB_PP",
          "OBJECT?",
          "DURATION"
        ]
      },
      "G15_TIME_RECENTLY": {
        "tokens": [
          "{SUBJECT}",
          "have recently",
          "{VERB_PP}",
          "{OBJECT?}"
        ],
        "slots": [
          "SUBJECT",
          "VERB_PP",
          "OBJECT?"
        ]
      },
      "G15_FUTURE_GOING_TO": {
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
      "G15_FUTURE_GOING_TO_NEG": {
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
      "G15_FUTURE_GOING_TO_Q": {
        "tokens": [
          "{BE}",
          "{SUBJECT}",
          "going to",
          "{VERB_BASE}",
          "{OBJECT?}?"
        ],
        "slots": [
          "BE",
          "SUBJECT",
          "VERB_BASE",
          "OBJECT?"
        ]
      },
      "G15_FUTURE_WILL_Q": {
        "tokens": [
          "Will",
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
      "G15_FUTURE_SHALL_I": {
        "tokens": [
          "Shall I",
          "{VERB_BASE}",
          "{OBJECT?}?"
        ],
        "slots": [
          "VERB_BASE",
          "OBJECT?"
        ]
      },
      "G15_FUTURE_SHALL_WE": {
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
      "G15_FUTURE_LIKELY_TO": {
        "tokens": [
          "{SUBJECT}",
          "{BE}",
          "likely to",
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
      "G15_FUTURE_UNLIKELY_TO": {
        "tokens": [
          "{SUBJECT}",
          "{BE}",
          "unlikely to",
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
      "G15_FUTURE_EXPECTED_TO": {
        "tokens": [
          "{SUBJECT}",
          "{BE}",
          "expected to",
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
      "G15_FUTURE_DUE_TO": {
        "tokens": [
          "{SUBJECT}",
          "{BE}",
          "due to",
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
      "G15_QUESTION_WHAT_DO": {
        "tokens": [
          "What do",
          "{SUBJECT}",
          "{VERB_BASE}?"
        ],
        "slots": [
          "SUBJECT",
          "VERB_BASE"
        ]
      },
      "G15_QUESTION_WHAT_DID": {
        "tokens": [
          "What did",
          "{SUBJECT}",
          "{VERB_BASE}?"
        ],
        "slots": [
          "SUBJECT",
          "VERB_BASE"
        ]
      },
      "G15_QUESTION_WHAT_WILL": {
        "tokens": [
          "What will",
          "{SUBJECT}",
          "{VERB_BASE}?"
        ],
        "slots": [
          "SUBJECT",
          "VERB_BASE"
        ]
      },
      "G15_QUESTION_WHERE_DO": {
        "tokens": [
          "Where do",
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
      "G15_QUESTION_WHERE_DID": {
        "tokens": [
          "Where did",
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
      "G15_QUESTION_WHERE_WILL": {
        "tokens": [
          "Where will",
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
      "G15_QUESTION_WHEN_DO": {
        "tokens": [
          "When do",
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
      "G15_QUESTION_WHEN_DID": {
        "tokens": [
          "When did",
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
      "G15_QUESTION_WHEN_WILL": {
        "tokens": [
          "When will",
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
      "G15_QUESTION_WHY_DO": {
        "tokens": [
          "Why do",
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
      "G15_QUESTION_WHY_DID": {
        "tokens": [
          "Why did",
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
      "G15_QUESTION_WHY_WILL": {
        "tokens": [
          "Why will",
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
      "G15_QUESTION_HOW_DO": {
        "tokens": [
          "How do",
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
      "G15_QUESTION_HOW_DID": {
        "tokens": [
          "How did",
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
      "G15_QUESTION_HOW_WILL": {
        "tokens": [
          "How will",
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
      "G15_QUESTION_WHO_IS": {
        "tokens": [
          "Who is",
          "{NOUN_PHRASE}?"
        ],
        "slots": [
          "NOUN_PHRASE"
        ]
      },
      "G15_QUESTION_WHO_WAS": {
        "tokens": [
          "Who was",
          "{NOUN_PHRASE}?"
        ],
        "slots": [
          "NOUN_PHRASE"
        ]
      },
      "G15_QUESTION_WHICH_IS": {
        "tokens": [
          "Which is",
          "{NOUN_PHRASE}?"
        ],
        "slots": [
          "NOUN_PHRASE"
        ]
      },
      "G15_QUESTION_WHICH_ARE": {
        "tokens": [
          "Which are",
          "{NOUN_PHRASE}?"
        ],
        "slots": [
          "NOUN_PHRASE"
        ]
      },
      "G15_QUESTION_WHOSE_IS": {
        "tokens": [
          "Whose",
          "{NOUN}",
          "is",
          "{NOUN_PHRASE}?"
        ],
        "slots": [
          "NOUN",
          "NOUN_PHRASE"
        ]
      },
      "G15_NEGATION_DONT": {
        "tokens": [
          "{SUBJECT}",
          "do not",
          "{VERB_BASE}",
          "{OBJECT?}"
        ],
        "slots": [
          "SUBJECT",
          "VERB_BASE",
          "OBJECT?"
        ]
      },
      "G15_NEGATION_DOESNT": {
        "tokens": [
          "{SUBJECT}",
          "does not",
          "{VERB_BASE}",
          "{OBJECT?}"
        ],
        "slots": [
          "SUBJECT",
          "VERB_BASE",
          "OBJECT?"
        ]
      },
      "G15_NEGATION_DIDNT": {
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
      "G15_NEGATION_WONT": {
        "tokens": [
          "{SUBJECT}",
          "will not",
          "{VERB_BASE}",
          "{OBJECT?}"
        ],
        "slots": [
          "SUBJECT",
          "VERB_BASE",
          "OBJECT?"
        ]
      },
      "G15_NEGATION_CANT": {
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
      "G15_NEGATION_MUSTNT": {
        "tokens": [
          "{SUBJECT}",
          "must not",
          "{VERB_BASE}",
          "{OBJECT?}"
        ],
        "slots": [
          "SUBJECT",
          "VERB_BASE",
          "OBJECT?"
        ]
      },
      "G15_NEGATION_MAY_NOT": {
        "tokens": [
          "{SUBJECT}",
          "may not",
          "{VERB_BASE}",
          "{OBJECT?}"
        ],
        "slots": [
          "SUBJECT",
          "VERB_BASE",
          "OBJECT?"
        ]
      },
      "G15_NEGATION_MIGHT_NOT": {
        "tokens": [
          "{SUBJECT}",
          "might not",
          "{VERB_BASE}",
          "{OBJECT?}"
        ],
        "slots": [
          "SUBJECT",
          "VERB_BASE",
          "OBJECT?"
        ]
      },
      "G15_NEGATION_WOULDNT": {
        "tokens": [
          "{SUBJECT}",
          "would not",
          "{VERB_BASE}",
          "{OBJECT?}"
        ],
        "slots": [
          "SUBJECT",
          "VERB_BASE",
          "OBJECT?"
        ]
      },
      "G15_NEGATION_COULDNT": {
        "tokens": [
          "{SUBJECT}",
          "could not",
          "{VERB_BASE}",
          "{OBJECT?}"
        ],
        "slots": [
          "SUBJECT",
          "VERB_BASE",
          "OBJECT?"
        ]
      },
      "G15_EXIST_THERE_MIGHT_BE": {
        "tokens": [
          "There might be",
          "{NOUN_PHRASE}",
          "{PLACE?}"
        ],
        "slots": [
          "NOUN_PHRASE",
          "PLACE?"
        ]
      },
      "G15_EXIST_THERE_MAY_BE": {
        "tokens": [
          "There may be",
          "{NOUN_PHRASE}",
          "{PLACE?}"
        ],
        "slots": [
          "NOUN_PHRASE",
          "PLACE?"
        ]
      },
      "G15_EXIST_THERE_WILL_BE": {
        "tokens": [
          "There will be",
          "{NOUN_PHRASE}",
          "{PLACE?}"
        ],
        "slots": [
          "NOUN_PHRASE",
          "PLACE?"
        ]
      },
      "G15_EXIST_THERE_HAS_BEEN": {
        "tokens": [
          "There has been",
          "{NOUN_PHRASE}",
          "{PLACE?}"
        ],
        "slots": [
          "NOUN_PHRASE",
          "PLACE?"
        ]
      },
      "G15_EXIST_THERE_HAVE_BEEN": {
        "tokens": [
          "There have been",
          "{NOUN_PHRASE}",
          "{PLACE?}"
        ],
        "slots": [
          "NOUN_PHRASE",
          "PLACE?"
        ]
      },
      "G15_EXIST_THERE_SEEMS_TO_BE": {
        "tokens": [
          "There seems to be",
          "{NOUN_PHRASE}",
          "{PLACE?}"
        ],
        "slots": [
          "NOUN_PHRASE",
          "PLACE?"
        ]
      },
      "G15_EXIST_THERE_USED_TO_BE": {
        "tokens": [
          "There used to be",
          "{NOUN_PHRASE}",
          "{PLACE?}"
        ],
        "slots": [
          "NOUN_PHRASE",
          "PLACE?"
        ]
      },
      "G15_EXIST_IS_THERE_ANY": {
        "tokens": [
          "Is there any",
          "{NOUN}",
          "{PLACE?}?"
        ],
        "slots": [
          "NOUN",
          "PLACE?"
        ]
      },
      "G15_EXIST_ARE_THERE_ANY": {
        "tokens": [
          "Are there any",
          "{NOUN}",
          "{PLACE?}?"
        ],
        "slots": [
          "NOUN",
          "PLACE?"
        ]
      },
      "G15_EXIST_THERE_IS_NO": {
        "tokens": [
          "There is no",
          "{NOUN_PHRASE}",
          "{PLACE?}"
        ],
        "slots": [
          "NOUN_PHRASE",
          "PLACE?"
        ]
      },
      "G15_QUANTITY_SOME": {
        "tokens": [
          "{SUBJECT}",
          "{VERB}",
          "some",
          "{NOUN}"
        ],
        "slots": [
          "SUBJECT",
          "VERB",
          "NOUN"
        ]
      },
      "G15_QUANTITY_ANY_Q": {
        "tokens": [
          "Do",
          "{SUBJECT}",
          "{VERB_BASE}",
          "any",
          "{NOUN}?"
        ],
        "slots": [
          "SUBJECT",
          "VERB_BASE",
          "NOUN"
        ]
      },
      "G15_QUANTITY_ANY_NEG": {
        "tokens": [
          "{SUBJECT}",
          "do not",
          "{VERB_BASE}",
          "any",
          "{NOUN}"
        ],
        "slots": [
          "SUBJECT",
          "VERB_BASE",
          "NOUN"
        ]
      },
      "G15_QUANTITY_MANY": {
        "tokens": [
          "{SUBJECT}",
          "{VERB}",
          "many",
          "{NOUN}"
        ],
        "slots": [
          "SUBJECT",
          "VERB",
          "NOUN"
        ]
      },
      "G15_QUANTITY_MUCH": {
        "tokens": [
          "{SUBJECT}",
          "{VERB}",
          "much",
          "{NOUN}"
        ],
        "slots": [
          "SUBJECT",
          "VERB",
          "NOUN"
        ]
      },
      "G15_QUANTITY_FEW": {
        "tokens": [
          "{SUBJECT}",
          "{VERB}",
          "few",
          "{NOUN}"
        ],
        "slots": [
          "SUBJECT",
          "VERB",
          "NOUN"
        ]
      },
      "G15_QUANTITY_A_FEW": {
        "tokens": [
          "{SUBJECT}",
          "{VERB}",
          "a few",
          "{NOUN}"
        ],
        "slots": [
          "SUBJECT",
          "VERB",
          "NOUN"
        ]
      },
      "G15_QUANTITY_LITTLE": {
        "tokens": [
          "{SUBJECT}",
          "{VERB}",
          "little",
          "{NOUN}"
        ],
        "slots": [
          "SUBJECT",
          "VERB",
          "NOUN"
        ]
      },
      "G15_QUANTITY_A_LITTLE": {
        "tokens": [
          "{SUBJECT}",
          "{VERB}",
          "a little",
          "{NOUN}"
        ],
        "slots": [
          "SUBJECT",
          "VERB",
          "NOUN"
        ]
      },
      "G15_QUANTITY_ENOUGH": {
        "tokens": [
          "{SUBJECT}",
          "{VERB}",
          "enough",
          "{NOUN}"
        ],
        "slots": [
          "SUBJECT",
          "VERB",
          "NOUN"
        ]
      },
      "G15_DETERMINER_THIS": {
        "tokens": [
          "This",
          "{NOUN}",
          "{VERB}",
          "{COMPLEMENT?}"
        ],
        "slots": [
          "NOUN",
          "VERB",
          "COMPLEMENT?"
        ]
      },
      "G15_DETERMINER_THAT": {
        "tokens": [
          "That",
          "{NOUN}",
          "{VERB}",
          "{COMPLEMENT?}"
        ],
        "slots": [
          "NOUN",
          "VERB",
          "COMPLEMENT?"
        ]
      },
      "G15_DETERMINER_THESE": {
        "tokens": [
          "These",
          "{NOUN}",
          "{VERB}",
          "{COMPLEMENT?}"
        ],
        "slots": [
          "NOUN",
          "VERB",
          "COMPLEMENT?"
        ]
      },
      "G15_DETERMINER_THOSE": {
        "tokens": [
          "Those",
          "{NOUN}",
          "{VERB}",
          "{COMPLEMENT?}"
        ],
        "slots": [
          "NOUN",
          "VERB",
          "COMPLEMENT?"
        ]
      },
      "G15_DETERMINER_EACH": {
        "tokens": [
          "Each",
          "{NOUN}",
          "{VERB}",
          "{COMPLEMENT?}"
        ],
        "slots": [
          "NOUN",
          "VERB",
          "COMPLEMENT?"
        ]
      },
      "G15_DETERMINER_EVERY": {
        "tokens": [
          "Every",
          "{NOUN}",
          "{VERB}",
          "{COMPLEMENT?}"
        ],
        "slots": [
          "NOUN",
          "VERB",
          "COMPLEMENT?"
        ]
      },
      "G15_DETERMINER_EITHER": {
        "tokens": [
          "Either",
          "{NOUN}",
          "{VERB}",
          "{COMPLEMENT?}"
        ],
        "slots": [
          "NOUN",
          "VERB",
          "COMPLEMENT?"
        ]
      },
      "G15_DETERMINER_NEITHER": {
        "tokens": [
          "Neither",
          "{NOUN}",
          "{VERB}",
          "{COMPLEMENT?}"
        ],
        "slots": [
          "NOUN",
          "VERB",
          "COMPLEMENT?"
        ]
      },
      "G15_DETERMINER_ANOTHER": {
        "tokens": [
          "Another",
          "{NOUN}",
          "{VERB}",
          "{COMPLEMENT?}"
        ],
        "slots": [
          "NOUN",
          "VERB",
          "COMPLEMENT?"
        ]
      },
      "G15_DETERMINER_OTHER": {
        "tokens": [
          "The other",
          "{NOUN}",
          "{VERB}",
          "{COMPLEMENT?}"
        ],
        "slots": [
          "NOUN",
          "VERB",
          "COMPLEMENT?"
        ]
      },
      "G15_PREP_WITH": {
        "tokens": [
          "{SUBJECT}",
          "{VERB}",
          "{OBJECT?}",
          "with",
          "{NOUN_PHRASE}"
        ],
        "slots": [
          "SUBJECT",
          "VERB",
          "OBJECT?",
          "NOUN_PHRASE"
        ]
      },
      "G15_PREP_WITHOUT": {
        "tokens": [
          "{SUBJECT}",
          "{VERB}",
          "{OBJECT?}",
          "without",
          "{NOUN_PHRASE}"
        ],
        "slots": [
          "SUBJECT",
          "VERB",
          "OBJECT?",
          "NOUN_PHRASE"
        ]
      },
      "G15_PREP_FOR": {
        "tokens": [
          "{SUBJECT}",
          "{VERB}",
          "{OBJECT?}",
          "for",
          "{NOUN_PHRASE}"
        ],
        "slots": [
          "SUBJECT",
          "VERB",
          "OBJECT?",
          "NOUN_PHRASE"
        ]
      },
      "G15_PREP_FROM": {
        "tokens": [
          "{SUBJECT}",
          "{VERB}",
          "{OBJECT?}",
          "from",
          "{NOUN_PHRASE}"
        ],
        "slots": [
          "SUBJECT",
          "VERB",
          "OBJECT?",
          "NOUN_PHRASE"
        ]
      },
      "G15_PREP_TO": {
        "tokens": [
          "{SUBJECT}",
          "{VERB}",
          "{OBJECT?}",
          "to",
          "{NOUN_PHRASE}"
        ],
        "slots": [
          "SUBJECT",
          "VERB",
          "OBJECT?",
          "NOUN_PHRASE"
        ]
      },
      "G15_PREP_ABOUT": {
        "tokens": [
          "{SUBJECT}",
          "{VERB}",
          "{OBJECT?}",
          "about",
          "{NOUN_PHRASE}"
        ],
        "slots": [
          "SUBJECT",
          "VERB",
          "OBJECT?",
          "NOUN_PHRASE"
        ]
      },
      "G15_PREP_AGAINST": {
        "tokens": [
          "{SUBJECT}",
          "{VERB}",
          "{OBJECT?}",
          "against",
          "{NOUN_PHRASE}"
        ],
        "slots": [
          "SUBJECT",
          "VERB",
          "OBJECT?",
          "NOUN_PHRASE"
        ]
      },
      "G15_PREP_BETWEEN": {
        "tokens": [
          "{SUBJECT}",
          "{VERB}",
          "{OBJECT?}",
          "between",
          "{NOUN_PHRASE_A}",
          "and",
          "{NOUN_PHRASE_B}"
        ],
        "slots": [
          "SUBJECT",
          "VERB",
          "OBJECT?",
          "NOUN_PHRASE_A",
          "NOUN_PHRASE_B"
        ]
      },
      "G15_PREP_AMONG": {
        "tokens": [
          "{SUBJECT}",
          "{VERB}",
          "{OBJECT?}",
          "among",
          "{NOUN_PHRASE}"
        ],
        "slots": [
          "SUBJECT",
          "VERB",
          "OBJECT?",
          "NOUN_PHRASE"
        ]
      },
      "G15_PREP_THROUGH": {
        "tokens": [
          "{SUBJECT}",
          "{VERB}",
          "{OBJECT?}",
          "through",
          "{NOUN_PHRASE}"
        ],
        "slots": [
          "SUBJECT",
          "VERB",
          "OBJECT?",
          "NOUN_PHRASE"
        ]
      },
      "G15_RESPONSE_THATS_RIGHT": {
        "tokens": [
          "That is right"
        ],
        "slots": []
      },
      "G15_RESPONSE_THATS_WRONG": {
        "tokens": [
          "That is wrong"
        ],
        "slots": []
      },
      "G15_RESPONSE_EXACTLY": {
        "tokens": [
          "Exactly"
        ],
        "slots": []
      },
      "G15_RESPONSE_NOT_EXACTLY": {
        "tokens": [
          "Not exactly"
        ],
        "slots": []
      },
      "G15_RESPONSE_OF_COURSE": {
        "tokens": [
          "Of course"
        ],
        "slots": []
      },
      "G15_RESPONSE_I_SEE": {
        "tokens": [
          "I see"
        ],
        "slots": []
      },
      "G15_RESPONSE_I_UNDERSTAND": {
        "tokens": [
          "I understand"
        ],
        "slots": []
      },
      "G15_RESPONSE_I_DONT_UNDERSTAND": {
        "tokens": [
          "I do not understand"
        ],
        "slots": []
      },
      "G15_RESPONSE_THAT_MAKES_SENSE": {
        "tokens": [
          "That makes sense"
        ],
        "slots": []
      },
      "G15_RESPONSE_THAT_DOESNT_MAKE_SENSE": {
        "tokens": [
          "That does not make sense"
        ],
        "slots": []
      }
    }
  );
})();
