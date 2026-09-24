(() => {
 "use strict";
 window.HMW=window.HMW||{}; HMW.Dialogue=HMW.Dialogue||{};
 HMW.Dialogue.MEANING_PATTERN_MAP=Object.assign(HMW.Dialogue.MEANING_PATTERN_MAP||{},{
  "STATE_IDENTITY_NAME": [
    {
      "pattern": "ANSWER_IDENTITY_NAME",
      "slots": {
        "NAME": "unknown"
      },
      "weight": 5
    }
  ],
  "STATE_IDENTITY_ROLE": [
    {
      "pattern": "ANSWER_IDENTITY_ROLE",
      "slots": {
        "ARTICLE": "",
        "ROLE": "worker"
      },
      "weight": 5
    }
  ],
  "STATE_ORIGIN": [
    {
      "pattern": "ANSWER_ORIGIN",
      "slots": {
        "PLACE": "here"
      },
      "weight": 5
    }
  ],
  "STATE_DESTINATION": [
    {
      "pattern": "ANSWER_DESTINATION",
      "slots": {
        "PLACE": "there"
      },
      "weight": 5
    }
  ],
  "STATE_REASON": [
    {
      "pattern": "ANSWER_REASON_BECAUSE",
      "slots": {
        "VERB": "did it",
        "OBJECT": "",
        "CLAUSE": "I had to"
      },
      "weight": 5
    }
  ],
  "STATE_OPINION": [
    {
      "pattern": "ANSWER_OPINION_THINK",
      "slots": {
        "CLAUSE": "it is fine"
      },
      "weight": 5
    }
  ],
  "STATE_PRICE": [
    {
      "pattern": "ANSWER_PRICE",
      "slots": {
        "AMOUNT": "0"
      },
      "weight": 5
    }
  ],
  "STATE_COUNT": [
    {
      "pattern": "ANSWER_QUANTITY_HAVE",
      "slots": {
        "QUANTITY": "0",
        "OBJECT": "items"
      },
      "weight": 5
    }
  ],
  "STATE_WORK_LOCATION": [
    {
      "pattern": "ANSWER_WORK_LOCATION",
      "slots": {
        "PLACE": "here"
      },
      "weight": 5
    }
  ],
  "STATE_JOB_ROLE": [
    {
      "pattern": "ANSWER_JOB_ROLE",
      "slots": {
        "ROLE": "worker"
      },
      "weight": 5
    }
  ],
  "CONFIRM_KNOWLEDGE": [
    {
      "surfaceOverride": "Yes, I know.",
      "weight": 5
    }
  ],
  "DENY_KNOWLEDGE": [
    {
      "surfaceOverride": "No, I do not know.",
      "weight": 5
    }
  ],
  "CONFIRM_FACT": [
    {
      "surfaceOverride": "Yes, that is true.",
      "weight": 5
    }
  ],
  "DENY_FACT": [
    {
      "surfaceOverride": "No, that is not true.",
      "weight": 5
    }
  ]
});
})();