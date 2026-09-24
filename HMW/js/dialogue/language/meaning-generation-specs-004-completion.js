(() => {
  "use strict";
  window.HMW = window.HMW || {};
  HMW.Dialogue = HMW.Dialogue || {};

  HMW.Dialogue.GENERATION_SPECS = Object.assign(
    HMW.Dialogue.GENERATION_SPECS || {},
    {
      "ADMIT_BETRAYAL": {
        "category": "trust",
        "candidates": [
          {
            "pattern": "PAST_SIMPLE_SVO",
            "subject": "I",
            "verbs": ["betray"],
            "object": "you",
            "weight": 5
          }
        ]
      },
      "REQUEST_TIME": {
        "category": "request",
        "candidates": [
          {
            "pattern": "REQUEST_PLEASE",
            "verbs": ["give"],
            "object": "me some time",
            "weight": 5
          }
        ]
      }
    }
  );
})();