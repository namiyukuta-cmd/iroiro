(() => {
  "use strict";
  window.HMW = window.HMW || {};
  HMW.Dialogue = HMW.Dialogue || {};
  HMW.Dialogue.MEANING_PATTERN_MAP = Object.assign(HMW.Dialogue.MEANING_PATTERN_MAP || {}, {
  "ASK_PLAN": [
    {
      "surfaceOverride": "What are you going to do?",
      "weight": 5
    }
  ],
  "ASK_PREFERENCE": [
    {
      "surfaceOverride": "What would you prefer?",
      "weight": 5
    }
  ],
  "ASK_WORK_STATUS": [
    {
      "surfaceOverride": "How is work going?",
      "weight": 5
    }
  ],
  "ASK_MONEY_STATUS": [
    {
      "surfaceOverride": "Do you have enough money?",
      "weight": 5
    }
  ],
  "ASK_HUNGER": [
    {
      "surfaceOverride": "Are you hungry?",
      "weight": 5
    }
  ],
  "ASK_THIRST": [
    {
      "surfaceOverride": "Are you thirsty?",
      "weight": 5
    }
  ],
  "ASK_TIREDNESS": [
    {
      "surfaceOverride": "Are you tired?",
      "weight": 5
    }
  ],
  "OFFER_COMPANY": [
    {
      "surfaceOverride": "I can stay with you.",
      "weight": 5
    }
  ],
  "OFFER_CONTACT": [
    {
      "surfaceOverride": "I can call you later.",
      "weight": 4
    },
    {
      "surfaceOverride": "I can send you a message later.",
      "weight": 4
    }
  ],
  "REQUEST_CONTACT": [
    {
      "surfaceOverride": "Call me later.",
      "weight": 4
    },
    {
      "surfaceOverride": "Send me a message.",
      "weight": 4
    }
  ],
  "ACCEPT_CONTACT": [
    {
      "surfaceOverride": "All right. I will contact you.",
      "weight": 5
    }
  ],
  "DECLINE_CONTACT": [
    {
      "surfaceOverride": "No. I will not contact you.",
      "weight": 5
    }
  ],
  "ASK_PERMISSION_ENTER": [
    {
      "surfaceOverride": "Can I come in?",
      "weight": 5
    }
  ],
  "ASK_PERMISSION_WAIT": [
    {
      "surfaceOverride": "Can I wait here?",
      "weight": 5
    }
  ],
  "EXPRESS_DISAPPOINTMENT": [
    {
      "surfaceOverride": "I am disappointed.",
      "weight": 5
    }
  ],
  "EXPRESS_HOPE": [
    {
      "surfaceOverride": "I hope so.",
      "weight": 5
    }
  ],
  "EXPRESS_PRIDE": [
    {
      "surfaceOverride": "I am proud of you.",
      "weight": 5
    }
  ],
  "CONFIRM_ARRIVAL": [
    {
      "surfaceOverride": "I am here.",
      "weight": 5
    }
  ],
  "CONFIRM_DEPARTURE": [
    {
      "surfaceOverride": "I am leaving now.",
      "weight": 5
    }
  ],
  "ASK_RETURN_TIME": [
    {
      "surfaceOverride": "When will you come back?",
      "weight": 5
    }
  ]
});
})();
