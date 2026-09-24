(() => {
  "use strict";
  window.HMW = window.HMW || {};
  HMW.Dialogue = HMW.Dialogue || {};

  HMW.Dialogue.GENERATION_SPECS = Object.assign(
    HMW.Dialogue.GENERATION_SPECS || {},
    {
      "ASK_WHAT_HAPPENED": {
        "category":"clarity",
        "candidates":[
          {"pattern":"G13_WHAT_HAPPENED","slots":{"TIME_OR_PLACE":""},"weight":5}
        ]
      },
      "ASK_TO_REPAIR": {
        "category":"repair",
        "candidates":[
          {"pattern":"SUGGEST_LETS","verbs":["try"],"object":"again","weight":5}
        ]
      },
      "ACKNOWLEDGE_EVENT": {
        "category":"response",
        "candidates":[
          {"pattern":"G15_RESPONSE_I_SEE","weight":4},
          {"pattern":"G15_RESPONSE_I_UNDERSTAND","weight":4}
        ]
      },
      "ASK_FOR_DETAILS": {
        "category":"clarity",
        "candidates":[
          {"pattern":"G13_WHAT_HAPPENED","slots":{"TIME_OR_PLACE":""},"weight":5},
          {"pattern":"G17_CLARIFY_CAN_YOU_EXPLAIN","slots":{"NOUN_PHRASE":"that"},"weight":4}
        ]
      },
      "EXPRESS_SURPRISE": {
        "category":"emotion",
        "candidates":[
          {"pattern":"G17_REACTION_REALLY_Q","weight":4},
          {"pattern":"G17_REACTION_I_DIDNT_EXPECT_THAT","weight":5}
        ]
      },
      "EXPRESS_SYMPATHY": {
        "category":"care",
        "candidates":[
          {"pattern":"G17_REACTION_THATS_UNFORTUNATE","weight":5}
        ]
      },
      "EXPRESS_APPROVAL": {
        "category":"response",
        "candidates":[
          {"pattern":"G17_REACTION_THATS_GOOD","weight":5},
          {"pattern":"G17_AGREEMENT_THATS_FAIR","weight":3}
        ]
      },
      "EXPRESS_DISAPPROVAL": {
        "category":"response",
        "candidates":[
          {"pattern":"DISLIKE_OBJECT","slots":{"SUBJECT":"I","OBJECT":"that"},"weight":5},
          {"pattern":"G17_AGREEMENT_I_DONT_AGREE","weight":3}
        ]
      },
      "ASK_PLAN": {
        "category":"daily",
        "candidates":[
          {"pattern":"QUESTION_WHAT_WILL","subject":"you","verbs":["do"],"object":"","weight":5}
        ]
      },
      "ASK_PREFERENCE": {
        "category":"daily",
        "candidates":[
          {"pattern":"QUESTION_DO_YOU","subject":"you","verbs":["prefer"],"object":"this","weight":5}
        ]
      },
      "ASK_WORK_STATUS": {
        "category":"daily",
        "candidates":[
          {"pattern":"QUESTION_HOW_ARE","slots":{"SUBJECT":"things at work"},"weight":5}
        ]
      },
      "ASK_MONEY_STATUS": {
        "category":"daily",
        "candidates":[
          {"pattern":"QUESTION_DO_YOU","subject":"you","verbs":["have"],"object":"enough money","weight":5}
        ]
      },
      "ASK_HUNGER": {
        "category":"care",
        "candidates":[
          {"pattern":"G17_FEELING_ARE_YOU_ADJ","adjectives":["hungry"],"weight":5}
        ]
      },
      "ASK_THIRST": {
        "category":"care",
        "candidates":[
          {"pattern":"G17_FEELING_ARE_YOU_ADJ","adjectives":["thirsty"],"weight":5}
        ]
      },
      "ASK_TIREDNESS": {
        "category":"care",
        "candidates":[
          {"pattern":"G17_FEELING_ARE_YOU_ADJ","adjectives":["tired"],"weight":5}
        ]
      },
      "REQUEST_CONTACT": {
        "category":"contact",
        "candidates":[
          {"pattern":"REQUEST_PLEASE","verbs":["call"],"object":"me later","weight":4},
          {"pattern":"REQUEST_PLEASE","verbs":["send"],"object":"me a message","weight":4}
        ]
      },
      "ASK_PERMISSION_ENTER": {
        "category":"boundary",
        "candidates":[
          {"pattern":"PERMISSION_CAN_I","verbs":["come"],"object":"in","weight":5}
        ]
      },
      "ASK_PERMISSION_WAIT": {
        "category":"boundary",
        "candidates":[
          {"pattern":"PERMISSION_CAN_I","verbs":["wait"],"object":"here","weight":5}
        ]
      },
      "EXPRESS_DISAPPOINTMENT": {
        "category":"emotion",
        "candidates":[
          {"pattern":"G17_FEELING_I_FEEL_ADJ","adjectives":["disappointed"],"weight":5}
        ]
      },
      "EXPRESS_HOPE": {
        "category":"emotion",
        "candidates":[
          {"pattern":"G14_SHORT_I_HOPE_SO","weight":5}
        ]
      },
      "EXPRESS_PRIDE": {
        "category":"positive",
        "candidates":[
          {"pattern":"G17_FEELING_I_FEEL_ADJ","adjectives":["proud"],"weight":5}
        ]
      },
      "CONFIRM_ARRIVAL": {
        "category":"movement",
        "candidates":[
          {"pattern":"STATE_BE_LOCATION","slots":{"SUBJECT":"I","BE":"am","LOCATION":"here"},"weight":5}
        ]
      },
      "ANSWER_UNKNOWN": {
        "category":"answer",
        "candidates":[
          {"pattern":"PRESENT_SIMPLE_NEG","subject":"I","verbs":["know"],"object":"","weight":5}
        ]
      },
      "CONFIRM_KNOWLEDGE": {
        "category":"answer",
        "candidates":[
          {"pattern":"PRESENT_SIMPLE_SVO","subject":"I","verbs":["know"],"object":"that","weight":5}
        ]
      },
      "DENY_KNOWLEDGE": {
        "category":"answer",
        "candidates":[
          {"pattern":"PRESENT_SIMPLE_NEG","subject":"I","verbs":["know"],"object":"","weight":5}
        ]
      },
      "CONFIRM_FACT": {
        "category":"answer",
        "candidates":[
          {"pattern":"ANSWER_FACT_POSITIVE","slots":{"CLAUSE":"that is true"},"weight":5}
        ]
      },
      "DENY_FACT": {
        "category":"answer",
        "candidates":[
          {"pattern":"ANSWER_FACT_NEGATIVE","slots":{"CLAUSE":"that is not true"},"weight":5}
        ]
      },
      "GRANT_PERMISSION": {
        "category":"response",
        "candidates":[
          {"pattern":"PERMISSION_GRANT_CAN","verbs":["do"],"object":"that","weight":5}
        ]
      },
      "DENY_PERMISSION": {
        "category":"response",
        "candidates":[
          {"pattern":"PERMISSION_DENY_CANNOT","verbs":["do"],"object":"that","weight":5},
          {"pattern":"PERMISSION_DENY_PLEASE_DONT","verbs":["do"],"object":"that","weight":3}
        ]
      },
      "ACCEPT_ACTION_REQUEST": {
        "category":"response",
        "candidates":[
          {"pattern":"REQUEST_ACCEPT_WILL","verbs":["do"],"object":"that","weight":5},
          {"pattern":"REQUEST_ACCEPT_CAN","verbs":["do"],"object":"that","weight":3}
        ]
      },
      "DECLINE_ACTION_REQUEST": {
        "category":"response",
        "candidates":[
          {"pattern":"REQUEST_DECLINE_WONT","verbs":["do"],"object":"that","weight":5},
          {"pattern":"REQUEST_DECLINE_CANNOT","verbs":["do"],"object":"that","weight":3}
        ]
      },
      "ACCEPT_INVITATION": {
        "category":"response",
        "candidates":[
          {"pattern":"INVITE_ACCEPT","verbs":["join"],"object":"you","weight":5}
        ]
      },
      "DECLINE_INVITATION": {
        "category":"response",
        "candidates":[
          {"pattern":"INVITE_DECLINE","weight":5},
          {"pattern":"INVITE_DECLINE_LATER","weight":4}
        ]
      },
      "ACCEPT_SUGGESTION": {
        "category":"response",
        "candidates":[
          {"pattern":"SUGGEST_ACCEPT_SOUND","weight":5},
          {"pattern":"G17_AGREEMENT_I_AGREE","weight":3}
        ]
      },
      "DECLINE_SUGGESTION": {
        "category":"response",
        "candidates":[
          {"pattern":"SUGGEST_DECLINE_NO","weight":5},
          {"pattern":"G17_AGREEMENT_I_DONT_AGREE","weight":3}
        ]
      }
    }
  );
})();