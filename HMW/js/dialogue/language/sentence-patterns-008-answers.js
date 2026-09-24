(() => {
 "use strict";
 window.HMW=window.HMW||{}; HMW.Dialogue=HMW.Dialogue||{};
 HMW.Dialogue.SENTENCE_PATTERNS=Object.assign(HMW.Dialogue.SENTENCE_PATTERNS||{},{
  "ANSWER_IDENTITY_NAME": {
    "tokens": [
      "My name is",
      "{NAME}"
    ],
    "slots": [
      "NAME"
    ]
  },
  "ANSWER_IDENTITY_ROLE": {
    "tokens": [
      "I am",
      "{ARTICLE?}",
      "{ROLE}"
    ],
    "slots": [
      "ARTICLE?",
      "ROLE"
    ]
  },
  "ANSWER_ORIGIN": {
    "tokens": [
      "I am from",
      "{PLACE}"
    ],
    "slots": [
      "PLACE"
    ]
  },
  "ANSWER_DESTINATION": {
    "tokens": [
      "I am going",
      "{DIRECTION_PREP?}",
      "{PLACE}"
    ],
    "slots": [
      "DIRECTION_PREP?",
      "PLACE"
    ]
  },
  "ANSWER_REASON_BECAUSE": {
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
  "ANSWER_OPINION_THINK": {
    "tokens": [
      "I think",
      "{CLAUSE}"
    ],
    "slots": [
      "CLAUSE"
    ]
  },
  "ANSWER_OPINION_DIRECT": {
    "tokens": [
      "In my opinion,",
      "{CLAUSE}"
    ],
    "slots": [
      "CLAUSE"
    ]
  },
  "ANSWER_PRICE": {
    "tokens": [
      "It costs",
      "{AMOUNT}"
    ],
    "slots": [
      "AMOUNT"
    ]
  },
  "ANSWER_QUANTITY_THERE_ARE": {
    "tokens": [
      "There are",
      "{QUANTITY}",
      "{OBJECT?}"
    ],
    "slots": [
      "QUANTITY",
      "OBJECT?"
    ]
  },
  "ANSWER_QUANTITY_HAVE": {
    "tokens": [
      "I have",
      "{QUANTITY}",
      "{OBJECT?}"
    ],
    "slots": [
      "QUANTITY",
      "OBJECT?"
    ]
  },
  "ANSWER_NEED_QUANTITY": {
    "tokens": [
      "I need",
      "{QUANTITY}",
      "{OBJECT?}"
    ],
    "slots": [
      "QUANTITY",
      "OBJECT?"
    ]
  },
  "ANSWER_AVAILABILITY_TIME": {
    "tokens": [
      "I am free at",
      "{TIME}"
    ],
    "slots": [
      "TIME"
    ]
  },
  "ANSWER_RETURN_TIME": {
    "tokens": [
      "I will return at",
      "{TIME}"
    ],
    "slots": [
      "TIME"
    ]
  },
  "ANSWER_DEPARTURE_TIME": {
    "tokens": [
      "I will leave at",
      "{TIME}"
    ],
    "slots": [
      "TIME"
    ]
  },
  "ANSWER_ARRIVAL_TIME": {
    "tokens": [
      "I arrived at",
      "{TIME}"
    ],
    "slots": [
      "TIME"
    ]
  },
  "ANSWER_HOME_LOCATION": {
    "tokens": [
      "I live",
      "{PLACE}"
    ],
    "slots": [
      "PLACE"
    ]
  },
  "ANSWER_STAY_LOCATION": {
    "tokens": [
      "I am staying",
      "{PLACE}"
    ],
    "slots": [
      "PLACE"
    ]
  },
  "ANSWER_WORK_LOCATION": {
    "tokens": [
      "I work",
      "{LOCATION_PREP?}",
      "{PLACE}"
    ],
    "slots": [
      "LOCATION_PREP?",
      "PLACE"
    ]
  },
  "ANSWER_JOB_ROLE": {
    "tokens": [
      "I work as",
      "{ARTICLE?}",
      "{ROLE}"
    ],
    "slots": [
      "ARTICLE?",
      "ROLE"
    ]
  },
  "ANSWER_MONEY_AMOUNT": {
    "tokens": [
      "I have",
      "{AMOUNT}"
    ],
    "slots": [
      "AMOUNT"
    ]
  },
  "ANSWER_WANT_OBJECT": {
    "tokens": [
      "I want",
      "{OBJECT}"
    ],
    "slots": [
      "OBJECT"
    ]
  },
  "ANSWER_NEED_OBJECT": {
    "tokens": [
      "I need",
      "{OBJECT}"
    ],
    "slots": [
      "OBJECT"
    ]
  },
  "ANSWER_CHOICE": {
    "tokens": [
      "I choose",
      "{OBJECT}"
    ],
    "slots": [
      "OBJECT"
    ]
  },
  "ANSWER_PREFERENCE": {
    "tokens": [
      "I prefer",
      "{OBJECT}"
    ],
    "slots": [
      "OBJECT"
    ]
  },
  "ANSWER_FACT_POSITIVE": {
    "tokens": [
      "Yes,",
      "{CLAUSE}"
    ],
    "slots": [
      "CLAUSE"
    ]
  },
  "ANSWER_FACT_NEGATIVE": {
    "tokens": [
      "No,",
      "{CLAUSE}"
    ],
    "slots": [
      "CLAUSE"
    ]
  },
  "ANSWER_EVENT": {
    "tokens": [
      "{CLAUSE}"
    ],
    "slots": [
      "CLAUSE"
    ]
  },
  "ANSWER_PLAN_WILL": {
    "tokens": [
      "I will",
      "{VERB_BASE}",
      "{OBJECT?}",
      "{TIME?}"
    ],
    "slots": [
      "VERB_BASE",
      "OBJECT?",
      "TIME?"
    ]
  },
  "ANSWER_PLAN_GOING_TO": {
    "tokens": [
      "I am going to",
      "{VERB_BASE}",
      "{OBJECT?}",
      "{TIME?}"
    ],
    "slots": [
      "VERB_BASE",
      "OBJECT?",
      "TIME?"
    ]
  },
  "QUESTION_IDENTITY_NAME": {
    "tokens": [
      "What is your name?"
    ],
    "slots": []
  },
  "QUESTION_IDENTITY_ROLE": {
    "tokens": [
      "What do you do?"
    ],
    "slots": []
  },
  "QUESTION_ORIGIN": {
    "tokens": [
      "Where are you from?"
    ],
    "slots": []
  },
  "QUESTION_DESTINATION": {
    "tokens": [
      "Where are you going?"
    ],
    "slots": []
  },
  "QUESTION_REASON": {
    "tokens": [
      "Why",
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
  "QUESTION_OPINION": {
    "tokens": [
      "What do you think",
      "{ABOUT?}?"
    ],
    "slots": [
      "ABOUT?"
    ]
  },
  "QUESTION_PRICE": {
    "tokens": [
      "How much does",
      "{SUBJECT}",
      "cost?"
    ],
    "slots": [
      "SUBJECT"
    ]
  },
  "QUESTION_QUANTITY": {
    "tokens": [
      "How many",
      "{OBJECT_PLURAL}",
      "are there?"
    ],
    "slots": [
      "OBJECT_PLURAL"
    ]
  },
  "QUESTION_AVAILABILITY": {
    "tokens": [
      "Are you free",
      "{TIME?}?"
    ],
    "slots": [
      "TIME?"
    ]
  },
  "QUESTION_RETURN_TIME": {
    "tokens": [
      "When will you return?"
    ],
    "slots": []
  },
  "QUESTION_DEPARTURE_TIME": {
    "tokens": [
      "When will you leave?"
    ],
    "slots": []
  },
  "QUESTION_ARRIVAL_TIME": {
    "tokens": [
      "When did you arrive?"
    ],
    "slots": []
  },
  "QUESTION_WORK_LOCATION": {
    "tokens": [
      "Where do you work?"
    ],
    "slots": []
  },
  "QUESTION_JOB_ROLE": {
    "tokens": [
      "What is your job?"
    ],
    "slots": []
  }
});
})();
