(() => {
  "use strict";
  window.HMW=window.HMW||{}; HMW.Dialogue=HMW.Dialogue||{};
  HMW.Dialogue.GENERATION_SPECS=Object.assign(HMW.Dialogue.GENERATION_SPECS||{},{
  "STATE_CURRENT_LOCATION": {
    "category": "answer",
    "candidates": [
      {
        "pattern": "STATE_BE_LOCATION",
        "slots": {
          "SUBJECT": "I",
          "BE": "am",
          "LOCATION": "here"
        },
        "weight": 5
      }
    ]
  },
  "STATE_IDENTITY_NAME": {
    "category": "answer",
    "candidates": [
      {
        "pattern": "ANSWER_IDENTITY_NAME",
        "slots": {
          "NAME": "unknown"
        },
        "weight": 5
      }
    ]
  },
  "STATE_IDENTITY_ROLE": {
    "category": "answer",
    "candidates": [
      {
        "pattern": "ANSWER_IDENTITY_ROLE",
        "slots": {
          "ARTICLE": "",
          "ROLE": "worker"
        },
        "weight": 5
      }
    ]
  },
  "STATE_ORIGIN": {
    "category": "answer",
    "candidates": [
      {
        "pattern": "ANSWER_ORIGIN",
        "slots": {
          "PLACE": "here"
        },
        "weight": 5
      }
    ]
  },
  "STATE_DESTINATION": {
    "category": "answer",
    "candidates": [
      {
        "pattern": "ANSWER_DESTINATION",
        "slots": {
          "PLACE": "there"
        },
        "weight": 5
      }
    ]
  },
  "STATE_REASON": {
    "category": "answer",
    "candidates": [
      {
        "pattern": "ANSWER_REASON_BECAUSE",
        "slots": {
          "VERB": "did it",
          "OBJECT": "",
          "CLAUSE": "I had to"
        },
        "weight": 5
      }
    ]
  },
  "STATE_OPINION": {
    "category": "answer",
    "candidates": [
      {
        "pattern": "ANSWER_OPINION_THINK",
        "slots": {
          "CLAUSE": "it is fine"
        },
        "weight": 5
      }
    ]
  },
  "STATE_PRICE": {
    "category": "answer",
    "candidates": [
      {
        "pattern": "ANSWER_PRICE",
        "slots": {
          "AMOUNT": "0"
        },
        "weight": 5
      }
    ]
  },
  "STATE_COUNT": {
    "category": "answer",
    "candidates": [
      {
        "pattern": "ANSWER_QUANTITY_HAVE",
        "slots": {
          "QUANTITY": "0",
          "OBJECT": "items"
        },
        "weight": 5
      }
    ]
  },
  "STATE_WORK_LOCATION": {
    "category": "answer",
    "candidates": [
      {
        "pattern": "ANSWER_WORK_LOCATION",
        "slots": {
          "PLACE": "here"
        },
        "weight": 5
      }
    ]
  },
  "STATE_JOB_ROLE": {
    "category": "answer",
    "candidates": [
      {
        "pattern": "ANSWER_JOB_ROLE",
        "slots": {
          "ROLE": "worker"
        },
        "weight": 5
      }
    ]
  },
  "STATE_DESIRE": {
    "category": "answer",
    "candidates": [
      {
        "pattern": "ANSWER_WANT_OBJECT",
        "slots": {
          "OBJECT": "that"
        },
        "weight": 5
      }
    ]
  },
  "STATE_NEED": {
    "category": "answer",
    "candidates": [
      {
        "pattern": "ANSWER_NEED_OBJECT",
        "slots": {
          "OBJECT": "that"
        },
        "weight": 5
      }
    ]
  },
  "STATE_CHOICE": {
    "category": "answer",
    "candidates": [
      {
        "pattern": "ANSWER_CHOICE",
        "slots": {
          "OBJECT": "this"
        },
        "weight": 5
      }
    ]
  },
  "STATE_EVENT": {
    "category": "answer",
    "candidates": [
      {
        "pattern": "ANSWER_EVENT",
        "slots": {
          "CLAUSE": "Something happened"
        },
        "weight": 5
      }
    ]
  },
  "STATE_RELATIONSHIP_STATUS": {
    "category": "answer",
    "candidates": [
      {
        "pattern": "RELATIONSHIP_STATUS",
        "slots": {
          "RELATIONSHIP": "close"
        },
        "weight": 5
      }
    ]
  },
  "STATE_FEELINGS_TOWARD_HEROINE": {
    "category": "answer",
    "candidates": [
      {
        "pattern": "FEELINGS_TOWARD_HEROINE",
        "slots": {
          "FEELING": "affection"
        },
        "weight": 5
      }
    ]
  },
  "CONFIRM_POSSESSION": {
    "category": "answer",
    "candidates": [
      {
        "pattern": "STATE_HAVE_OBJECT",
        "slots": {
          "SUBJECT": "I",
          "OBJECT": "it"
        },
        "weight": 5
      }
    ]
  },
  "DENY_POSSESSION": {
    "category": "answer",
    "candidates": [
      {
        "pattern": "STATE_NOT_HAVE_OBJECT",
        "slots": {
          "SUBJECT": "I",
          "OBJECT": "it"
        },
        "weight": 5
      }
    ]
  },
  "CONFIRM_CAPABILITY": {
    "category": "answer",
    "candidates": [
      {
        "pattern": "STATE_CAN_ACTION",
        "slots": {
          "SUBJECT": "I",
          "VERB_BASE": "do",
          "OBJECT": "that"
        },
        "weight": 5
      }
    ]
  },
  "DENY_CAPABILITY": {
    "category": "answer",
    "candidates": [
      {
        "pattern": "STATE_CANNOT_ACTION",
        "slots": {
          "SUBJECT": "I",
          "VERB_BASE": "do",
          "OBJECT": "that"
        },
        "weight": 5
      }
    ]
  },
  "CONFIRM_AVAILABLE": {
    "category": "answer",
    "candidates": [
      {
        "pattern": "STATE_BE_AVAILABLE_TIME",
        "slots": {
          "SUBJECT": "I",
          "BE": "am",
          "AVAILABILITY": "available",
          "TIME": "now"
        },
        "weight": 5
      }
    ]
  },
  "DENY_AVAILABLE": {
    "category": "answer",
    "candidates": [
      {
        "pattern": "STATE_BE_AVAILABLE_TIME",
        "slots": {
          "SUBJECT": "I",
          "BE": "am",
          "AVAILABILITY": "not available",
          "TIME": "now"
        },
        "weight": 5
      }
    ]
  },
  "STATE_RETURN_TIME": {
    "category": "answer",
    "candidates": [
      {
        "pattern": "STATE_RETURN_TIME",
        "slots": {
          "SUBJECT": "I",
          "TIME": "later"
        },
        "weight": 5
      }
    ]
  }
});
})();