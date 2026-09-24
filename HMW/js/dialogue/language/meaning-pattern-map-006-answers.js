(() => {
 "use strict";
 window.HMW=window.HMW||{}; HMW.Dialogue=HMW.Dialogue||{};
 HMW.Dialogue.MEANING_PATTERN_MAP=Object.assign(HMW.Dialogue.MEANING_PATTERN_MAP||{},{
  "STATE_CURRENT_LOCATION": [
    {
      "pattern": "STATE_BE_LOCATION",
      "slots": {
        "SUBJECT": "I",
        "BE": "am",
        "LOCATION": "here"
      },
      "weight": 5
    }
  ],
  "STATE_AVAILABLE_TIME": [
    {
      "pattern": "STATE_BE_TIME",
      "slots": {
        "SUBJECT": "I",
        "BE": "am",
        "TIME": "free now"
      },
      "weight": 5
    }
  ],
  "STATE_CONDITION": [
    {
      "pattern": "STATE_BE_CONDITION",
      "slots": {
        "SUBJECT": "I",
        "BE": "am",
        "ADJECTIVE": "fine"
      },
      "weight": 5
    }
  ],
  "CONFIRM_POSSESSION": [
    {
      "pattern": "STATE_HAVE_OBJECT",
      "slots": {
        "SUBJECT": "I",
        "OBJECT": "it"
      },
      "weight": 5
    }
  ],
  "DENY_POSSESSION": [
    {
      "pattern": "STATE_NOT_HAVE_OBJECT",
      "slots": {
        "SUBJECT": "I",
        "OBJECT": "it"
      },
      "weight": 5
    }
  ],
  "STATE_QUANTITY": [
    {
      "pattern": "STATE_HAVE_QUANTITY",
      "slots": {
        "SUBJECT": "I",
        "QUANTITY": "one",
        "OBJECT": "item"
      },
      "weight": 5
    }
  ],
  "CONFIRM_CAPABILITY": [
    {
      "pattern": "STATE_CAN_ACTION",
      "slots": {
        "SUBJECT": "I",
        "VERB_BASE": "do",
        "OBJECT": "that"
      },
      "weight": 5
    }
  ],
  "DENY_CAPABILITY": [
    {
      "pattern": "STATE_CANNOT_ACTION",
      "slots": {
        "SUBJECT": "I",
        "VERB_BASE": "do",
        "OBJECT": "that"
      },
      "weight": 5
    }
  ],
  "STATE_CURRENT_PLAN": [
    {
      "pattern": "STATE_PLAN_ACTION",
      "slots": {
        "SUBJECT": "I",
        "VERB_BASE": "go",
        "OBJECT": "home",
        "TIME": "later"
      },
      "weight": 5
    }
  ],
  "STATE_CURRENT_PREFERENCE": [
    {
      "pattern": "STATE_PREFERENCE_OBJECT",
      "slots": {
        "SUBJECT": "I",
        "OBJECT": "this"
      },
      "weight": 5
    }
  ],
  "CONFIRM_AVAILABLE": [
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
  ],
  "DENY_AVAILABLE": [
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
  ],
  "ANSWER_UNKNOWN": [
    {
      "surfaceOverride": "I do not know.",
      "weight": 5
    }
  ],
  "STATE_RETURN_TIME": [
    {
      "pattern": "STATE_RETURN_TIME",
      "slots": {
        "SUBJECT": "I",
        "TIME": "later"
      },
      "weight": 5
    }
  ],
  "STATE_WORK_STATUS": [
    {
      "pattern": "STATE_WORK",
      "slots": {
        "BE": "is",
        "ADJECTIVE": "fine"
      },
      "weight": 5
    }
  ],
  "STATE_MONEY_STATUS": [
    {
      "pattern": "STATE_MONEY_HAVE",
      "slots": {
        "SUBJECT": "I",
        "AMOUNT": "enough money"
      },
      "weight": 5
    }
  ],
  "STATE_NO_MONEY": [
    {
      "pattern": "STATE_MONEY_NONE",
      "slots": {
        "SUBJECT": "I"
      },
      "weight": 5
    }
  ],
  "STATE_SLEEP_STATUS_GOOD": [
    {
      "pattern": "STATE_SLEEP_WELL",
      "slots": {
        "SUBJECT": "I"
      },
      "weight": 5
    }
  ],
  "STATE_SLEEP_STATUS_BAD": [
    {
      "pattern": "STATE_SLEEP_BADLY",
      "slots": {
        "SUBJECT": "I"
      },
      "weight": 5
    }
  ],
  "STATE_FOOD_STATUS_EATEN": [
    {
      "pattern": "STATE_ATE_ALREADY",
      "slots": {
        "SUBJECT": "I"
      },
      "weight": 5
    }
  ],
  "STATE_FOOD_STATUS_NOT_EATEN": [
    {
      "pattern": "STATE_NOT_EATEN",
      "slots": {
        "SUBJECT": "I"
      },
      "weight": 5
    }
  ],
  "STATE_HOME": [
    {
      "pattern": "STATE_HOME_LOCATION",
      "slots": {
        "SUBJECT": "I",
        "LOCATION": "at home"
      },
      "weight": 5
    }
  ]
});
})();