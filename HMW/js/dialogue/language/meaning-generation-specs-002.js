(() => {
  "use strict";
  window.HMW = window.HMW || {};
  HMW.Dialogue = HMW.Dialogue || {};
  HMW.Dialogue.GENERATION_SPECS = Object.assign(HMW.Dialogue.GENERATION_SPECS || {}, {
  "ASK_HUNGER": {
    "category": "care",
    "candidates": [
      {
        "pattern": "QUESTION_IS_SOMETHING",
        "surfaceOverride": "Are you hungry?",
        "weight": 5
      }
    ]
  },
  "ASK_THIRST": {
    "category": "care",
    "candidates": [
      {
        "pattern": "QUESTION_IS_SOMETHING",
        "surfaceOverride": "Are you thirsty?",
        "weight": 5
      }
    ]
  },
  "ASK_TIREDNESS": {
    "category": "care",
    "candidates": [
      {
        "pattern": "QUESTION_IS_SOMETHING",
        "surfaceOverride": "Are you tired?",
        "weight": 5
      }
    ]
  },
  "OFFER_COMPANY": {
    "category": "closeness",
    "candidates": [
      {
        "pattern": "MODAL_CAN",
        "subject": "I",
        "verbs": [
          "stay"
        ],
        "object": "with you",
        "weight": 5
      }
    ]
  },
  "OFFER_CONTACT": {
    "category": "contact",
    "candidates": [
      {
        "pattern": "MODAL_CAN",
        "subject": "I",
        "verbs": [
          "call"
        ],
        "object": "you later",
        "weight": 4
      },
      {
        "pattern": "MODAL_CAN",
        "subject": "I",
        "verbs": [
          "send"
        ],
        "object": "you a message later",
        "weight": 4
      }
    ]
  },
  "ACCEPT_CONTACT": {
    "category": "contact",
    "candidates": [
      {
        "pattern": "FUTURE_SIMPLE",
        "subject": "I",
        "verbs": [
          "call",
          "contact"
        ],
        "object": "you",
        "weight": 5
      }
    ]
  },
  "DECLINE_CONTACT": {
    "category": "contact",
    "candidates": [
      {
        "pattern": "FUTURE_NEG",
        "subject": "I",
        "verbs": [
          "call",
          "contact"
        ],
        "object": "you",
        "weight": 5
      }
    ]
  },
  "CONFIRM_DEPARTURE": {
    "category": "movement",
    "candidates": [
      {
        "pattern": "PRESENT_CONTINUOUS",
        "subject": "I",
        "verbs": [
          "leave",
          "go"
        ],
        "object": "now",
        "weight": 5
      }
    ]
  },
  "ASK_RETURN_TIME": {
    "category": "parting",
    "candidates": [
      {
        "pattern": "QUESTION_WHEN_WILL",
        "subject": "you",
        "verbs": [
          "return",
          "come"
        ],
        "object": "back",
        "weight": 5
      }
    ]
  },
  "EXPRESS_PRIDE": {
    "category": "positive",
    "candidates": [
      {
        "surfaceOverride": "I am proud of you.",
        "weight": 5
      }
    ]
  }
});
})();
