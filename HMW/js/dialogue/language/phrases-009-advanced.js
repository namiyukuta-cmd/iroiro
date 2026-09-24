(() => {
 "use strict";
 const P=window.HMW?.Dialogue?.Phrases;
 if(!P) throw new Error("Phrase registry must load first.");
 P.register([
  {
    "id": "PH_I_KNOW_WHAT_YOU_MEAN",
    "text": "I know what you mean.",
    "tags": [
      "clarity"
    ],
    "slots": []
  },
  {
    "id": "PH_I_KNOW_WHERE_IT_IS",
    "text": "I know where it is.",
    "tags": [
      "place",
      "knowledge"
    ],
    "slots": []
  },
  {
    "id": "PH_I_KNOW_WHEN_IT_STARTS",
    "text": "I know when it starts.",
    "tags": [
      "time",
      "knowledge"
    ],
    "slots": []
  },
  {
    "id": "PH_I_KNOW_WHY_YOU_ASKED",
    "text": "I know why you asked.",
    "tags": [
      "reason",
      "knowledge"
    ],
    "slots": []
  },
  {
    "id": "PH_I_DONT_KNOW_WHAT_HAPPENED",
    "text": "I do not know what happened.",
    "tags": [
      "event",
      "uncertainty"
    ],
    "slots": []
  },
  {
    "id": "PH_I_DONT_KNOW_WHERE_HE_WENT",
    "text": "I do not know where he went.",
    "tags": [
      "place",
      "uncertainty"
    ],
    "slots": []
  },
  {
    "id": "PH_I_DONT_KNOW_WHEN_SHE_LEFT",
    "text": "I do not know when she left.",
    "tags": [
      "time",
      "uncertainty"
    ],
    "slots": []
  },
  {
    "id": "PH_TELL_ME_WHAT_HAPPENED",
    "text": "Tell me what happened.",
    "tags": [
      "event",
      "clarity"
    ],
    "slots": []
  },
  {
    "id": "PH_TELL_ME_WHERE_YOU_WENT",
    "text": "Tell me where you went.",
    "tags": [
      "place",
      "clarity"
    ],
    "slots": []
  },
  {
    "id": "PH_TELL_ME_WHEN_YOU_KNEW",
    "text": "Tell me when you knew.",
    "tags": [
      "time",
      "clarity"
    ],
    "slots": []
  },
  {
    "id": "PH_TELL_ME_WHY_YOU_DID_IT",
    "text": "Tell me why you did it.",
    "tags": [
      "reason",
      "clarity"
    ],
    "slots": []
  },
  {
    "id": "PH_TELL_ME_HOW_YOU_FEEL",
    "text": "Tell me how you feel.",
    "tags": [
      "emotion",
      "clarity"
    ],
    "slots": []
  },
  {
    "id": "PH_HE_SAID_HE_WAS_FINE",
    "text": "He said that he was fine.",
    "tags": [
      "reported"
    ],
    "slots": []
  },
  {
    "id": "PH_SHE_SAID_SHE_WOULD_RETURN",
    "text": "She said that she would return.",
    "tags": [
      "reported",
      "return"
    ],
    "slots": []
  },
  {
    "id": "PH_HE_TOLD_ME_TO_WAIT",
    "text": "He told me to wait.",
    "tags": [
      "reported",
      "waiting"
    ],
    "slots": []
  },
  {
    "id": "PH_SHE_ASKED_IF_I_WAS_OKAY",
    "text": "She asked if I was okay.",
    "tags": [
      "reported",
      "care"
    ],
    "slots": []
  },
  {
    "id": "PH_IF_YOU_WANT_I_WILL_STAY",
    "text": "If you want, I will stay.",
    "tags": [
      "conditional",
      "closeness"
    ],
    "slots": []
  },
  {
    "id": "PH_IF_YOU_NEED_ME_CALL_ME",
    "text": "If you need me, call me.",
    "tags": [
      "conditional",
      "care",
      "contact"
    ],
    "slots": []
  },
  {
    "id": "PH_IF_YOU_ARE_TIRED_REST",
    "text": "If you are tired, rest.",
    "tags": [
      "conditional",
      "care"
    ],
    "slots": []
  },
  {
    "id": "PH_IF_IT_RAINS_STAY_INSIDE",
    "text": "If it rains, stay inside.",
    "tags": [
      "conditional",
      "weather"
    ],
    "slots": []
  },
  {
    "id": "PH_IF_I_CAN_HELP_I_WILL",
    "text": "If I can help, I will.",
    "tags": [
      "conditional",
      "care"
    ],
    "slots": []
  },
  {
    "id": "PH_IF_I_KNEW_I_WOULD_TELL_YOU",
    "text": "If I knew, I would tell you.",
    "tags": [
      "conditional",
      "clarity"
    ],
    "slots": []
  },
  {
    "id": "PH_UNLESS_YOU_ASK_I_WONT_GO",
    "text": "I will not go unless you ask me.",
    "tags": [
      "conditional",
      "boundary"
    ],
    "slots": []
  },
  {
    "id": "PH_AS_LONG_AS_YOU_ARE_SAFE",
    "text": "As long as you are safe, I am fine.",
    "tags": [
      "conditional",
      "care"
    ],
    "slots": []
  },
  {
    "id": "PH_I_LEFT_BECAUSE_OF_WORK",
    "text": "I left because of work.",
    "tags": [
      "reason",
      "work"
    ],
    "slots": []
  },
  {
    "id": "PH_I_WAS_LATE_BECAUSE_OF_TRAFFIC",
    "text": "I was late because of traffic.",
    "tags": [
      "reason",
      "travel"
    ],
    "slots": []
  },
  {
    "id": "PH_IT_WAS_COLD_SO_I_LEFT",
    "text": "It was cold, so I left.",
    "tags": [
      "result",
      "weather"
    ],
    "slots": []
  },
  {
    "id": "PH_I_WAS_TIRED_SO_I_RESTED",
    "text": "I was tired, so I rested.",
    "tags": [
      "result",
      "rest"
    ],
    "slots": []
  },
  {
    "id": "PH_I_AM_TOO_TIRED_TO_GO",
    "text": "I am too tired to go.",
    "tags": [
      "condition"
    ],
    "slots": []
  },
  {
    "id": "PH_I_AM_STRONG_ENOUGH_TO_HELP",
    "text": "I am strong enough to help.",
    "tags": [
      "capability"
    ],
    "slots": []
  },
  {
    "id": "PH_THIS_IS_MORE_EXPENSIVE_THAN_THAT",
    "text": "This is more expensive than that.",
    "tags": [
      "comparison",
      "money"
    ],
    "slots": []
  },
  {
    "id": "PH_THIS_IS_LESS_DANGEROUS_THAN_THAT",
    "text": "This is less dangerous than that.",
    "tags": [
      "comparison",
      "safety"
    ],
    "slots": []
  },
  {
    "id": "PH_THIS_IS_AS_GOOD_AS_THAT",
    "text": "This is as good as that.",
    "tags": [
      "comparison"
    ],
    "slots": []
  },
  {
    "id": "PH_BEFORE_YOU_GO_TELL_ME",
    "text": "Before you go, tell me.",
    "tags": [
      "time",
      "contact"
    ],
    "slots": []
  },
  {
    "id": "PH_AFTER_WORK_I_WILL_CALL",
    "text": "After work, I will call you.",
    "tags": [
      "time",
      "work",
      "contact"
    ],
    "slots": []
  },
  {
    "id": "PH_WHILE_YOU_REST_I_WILL_WAIT",
    "text": "While you rest, I will wait.",
    "tags": [
      "time",
      "care"
    ],
    "slots": []
  },
  {
    "id": "PH_AS_SOON_AS_I_KNOW_I_WILL_TELL_YOU",
    "text": "As soon as I know, I will tell you.",
    "tags": [
      "time",
      "clarity"
    ],
    "slots": []
  },
  {
    "id": "PH_WAIT_UNTIL_I_RETURN",
    "text": "Wait until I return.",
    "tags": [
      "time",
      "return"
    ],
    "slots": []
  },
  {
    "id": "PH_I_CAME_TO_HELP",
    "text": "I came to help.",
    "tags": [
      "purpose",
      "care"
    ],
    "slots": []
  },
  {
    "id": "PH_I_CALLED_TO_CHECK_ON_YOU",
    "text": "I called to check on you.",
    "tags": [
      "purpose",
      "care"
    ],
    "slots": []
  },
  {
    "id": "PH_I_LEFT_WITHOUT_SAYING_GOODBYE",
    "text": "I left without saying goodbye.",
    "tags": [
      "parting"
    ],
    "slots": []
  },
  {
    "id": "PH_I_LEARNED_BY_WATCHING",
    "text": "I learned by watching.",
    "tags": [
      "learning"
    ],
    "slots": []
  },
  {
    "id": "PH_STOP_SHOUTING",
    "text": "Stop shouting.",
    "tags": [
      "boundary",
      "conflict"
    ],
    "slots": []
  },
  {
    "id": "PH_KEEP_TALKING",
    "text": "Keep talking.",
    "tags": [
      "clarity"
    ],
    "slots": []
  },
  {
    "id": "PH_KEEP_GOING",
    "text": "Keep going.",
    "tags": [
      "encouragement"
    ],
    "slots": []
  },
  {
    "id": "PH_STOP_FOLLOWING_ME",
    "text": "Stop following me.",
    "tags": [
      "boundary"
    ],
    "slots": []
  },
  {
    "id": "PH_THE_MORE_I_WAIT_THE_MORE_I_WORRY",
    "text": "The more I wait, the more I worry.",
    "tags": [
      "emotion",
      "waiting"
    ],
    "slots": []
  }
]);
})();