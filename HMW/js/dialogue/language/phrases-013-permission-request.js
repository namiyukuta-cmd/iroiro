(() => {
  "use strict";
  const P=window.HMW?.Dialogue?.Phrases;
  if(!P) throw new Error("Phrase registry must load first.");
  P.register([
  {
    "id": "PH_CAN_I_TOUCH_YOU",
    "text": "Can I touch you?",
    "tags": [
      "permission",
      "physical"
    ],
    "slots": []
  },
  {
    "id": "PH_CAN_I_HUG_YOU",
    "text": "Can I hug you?",
    "tags": [
      "permission",
      "physical"
    ],
    "slots": []
  },
  {
    "id": "PH_CAN_I_KISS_YOU",
    "text": "Can I kiss you?",
    "tags": [
      "permission",
      "physical"
    ],
    "slots": []
  },
  {
    "id": "PH_CAN_I_SIT_HERE",
    "text": "Can I sit here?",
    "tags": [
      "permission",
      "daily"
    ],
    "slots": []
  },
  {
    "id": "PH_CAN_I_COME_IN",
    "text": "Can I come in?",
    "tags": [
      "permission",
      "entry"
    ],
    "slots": []
  },
  {
    "id": "PH_CAN_I_WAIT_HERE",
    "text": "Can I wait here?",
    "tags": [
      "permission",
      "waiting"
    ],
    "slots": []
  },
  {
    "id": "PH_CAN_I_CALL_YOU",
    "text": "Can I call you?",
    "tags": [
      "permission",
      "contact"
    ],
    "slots": []
  },
  {
    "id": "PH_CAN_I_MESSAGE_YOU",
    "text": "Can I message you?",
    "tags": [
      "permission",
      "contact"
    ],
    "slots": []
  },
  {
    "id": "PH_YES_YOU_CAN",
    "text": "Yes, you can.",
    "tags": [
      "permission",
      "answer"
    ],
    "slots": []
  },
  {
    "id": "PH_NO_PLEASE_DONT",
    "text": "No, please do not.",
    "tags": [
      "permission",
      "answer"
    ],
    "slots": []
  },
  {
    "id": "PH_YES_THAT_IS_FINE",
    "text": "Yes, that is fine.",
    "tags": [
      "permission",
      "answer"
    ],
    "slots": []
  },
  {
    "id": "PH_NO_NOT_RIGHT_NOW",
    "text": "No, not right now.",
    "tags": [
      "permission",
      "answer"
    ],
    "slots": []
  },
  {
    "id": "PH_WILL_YOU_HELP_ME",
    "text": "Will you help me?",
    "tags": [
      "request"
    ],
    "slots": []
  },
  {
    "id": "PH_WILL_YOU_WAIT_FOR_ME",
    "text": "Will you wait for me?",
    "tags": [
      "request",
      "waiting"
    ],
    "slots": []
  },
  {
    "id": "PH_WILL_YOU_STAY_WITH_ME",
    "text": "Will you stay with me?",
    "tags": [
      "request",
      "closeness"
    ],
    "slots": []
  },
  {
    "id": "PH_WILL_YOU_CALL_ME",
    "text": "Will you call me?",
    "tags": [
      "request",
      "contact"
    ],
    "slots": []
  },
  {
    "id": "PH_WILL_YOU_COME_WITH_ME",
    "text": "Will you come with me?",
    "tags": [
      "request",
      "closeness"
    ],
    "slots": []
  },
  {
    "id": "PH_YES_I_WILL",
    "text": "Yes, I will.",
    "tags": [
      "request",
      "answer"
    ],
    "slots": []
  },
  {
    "id": "PH_NO_I_WONT",
    "text": "No, I will not.",
    "tags": [
      "request",
      "answer"
    ],
    "slots": []
  },
  {
    "id": "PH_I_CAN_DO_THAT",
    "text": "I can do that.",
    "tags": [
      "request",
      "answer"
    ],
    "slots": []
  },
  {
    "id": "PH_I_CANT_DO_THAT",
    "text": "I cannot do that.",
    "tags": [
      "request",
      "answer"
    ],
    "slots": []
  },
  {
    "id": "PH_DO_YOU_WANT_TO_COME_WITH_ME",
    "text": "Do you want to come with me?",
    "tags": [
      "invitation"
    ],
    "slots": []
  },
  {
    "id": "PH_DO_YOU_WANT_TO_EAT_WITH_ME",
    "text": "Do you want to eat with me?",
    "tags": [
      "invitation"
    ],
    "slots": []
  },
  {
    "id": "PH_DO_YOU_WANT_TO_STAY_HERE",
    "text": "Do you want to stay here?",
    "tags": [
      "invitation"
    ],
    "slots": []
  },
  {
    "id": "PH_WOULD_YOU_LIKE_TO_TALK",
    "text": "Would you like to talk?",
    "tags": [
      "invitation",
      "clarity"
    ],
    "slots": []
  },
  {
    "id": "PH_WOULD_YOU_LIKE_TO_SIT_DOWN",
    "text": "Would you like to sit down?",
    "tags": [
      "invitation"
    ],
    "slots": []
  },
  {
    "id": "PH_YES_ID_LIKE_THAT",
    "text": "Yes, I would like that.",
    "tags": [
      "invitation",
      "answer"
    ],
    "slots": []
  },
  {
    "id": "PH_NO_THANK_YOU",
    "text": "No, thank you.",
    "tags": [
      "invitation",
      "answer"
    ],
    "slots": []
  },
  {
    "id": "PH_MAYBE_ANOTHER_TIME",
    "text": "Maybe another time.",
    "tags": [
      "invitation",
      "answer"
    ],
    "slots": []
  },
  {
    "id": "PH_LETS_GO_TOGETHER",
    "text": "Let us go together.",
    "tags": [
      "suggestion",
      "closeness"
    ],
    "slots": []
  },
  {
    "id": "PH_LETS_WAIT_HERE",
    "text": "Let us wait here.",
    "tags": [
      "suggestion",
      "waiting"
    ],
    "slots": []
  },
  {
    "id": "PH_LETS_TALK_ABOUT_IT",
    "text": "Let us talk about it.",
    "tags": [
      "suggestion",
      "clarity"
    ],
    "slots": []
  },
  {
    "id": "PH_WE_SHOULD_LEAVE_NOW",
    "text": "We should leave now.",
    "tags": [
      "suggestion",
      "departure"
    ],
    "slots": []
  },
  {
    "id": "PH_WE_SHOULD_STAY_HERE",
    "text": "We should stay here.",
    "tags": [
      "suggestion",
      "safety"
    ],
    "slots": []
  },
  {
    "id": "PH_THAT_SOUNDS_GOOD_TO_ME",
    "text": "That sounds good to me.",
    "tags": [
      "suggestion",
      "answer"
    ],
    "slots": []
  },
  {
    "id": "PH_I_DONT_THINK_WE_SHOULD",
    "text": "I do not think we should.",
    "tags": [
      "suggestion",
      "answer"
    ],
    "slots": []
  },
  {
    "id": "PH_I_AGREE_WITH_THAT_PLAN",
    "text": "I agree with that plan.",
    "tags": [
      "suggestion",
      "answer"
    ],
    "slots": []
  },
  {
    "id": "PH_I_DONT_AGREE_WITH_THAT_PLAN",
    "text": "I do not agree with that plan.",
    "tags": [
      "suggestion",
      "answer"
    ],
    "slots": []
  },
  {
    "id": "PH_PLEASE_GIVE_ME_A_MOMENT",
    "text": "Please give me a moment.",
    "tags": [
      "request",
      "time"
    ],
    "slots": []
  },
  {
    "id": "PH_PLEASE_LISTEN_TO_ME",
    "text": "Please listen to me.",
    "tags": [
      "request",
      "clarity"
    ],
    "slots": []
  },
  {
    "id": "PH_PLEASE_TELL_ME_THE_TRUTH",
    "text": "Please tell me the truth.",
    "tags": [
      "request",
      "trust"
    ],
    "slots": []
  },
  {
    "id": "PH_PLEASE_STAY_HERE",
    "text": "Please stay here.",
    "tags": [
      "request",
      "closeness"
    ],
    "slots": []
  },
  {
    "id": "PH_PLEASE_DONT_GO",
    "text": "Please do not go.",
    "tags": [
      "request",
      "closeness"
    ],
    "slots": []
  },
  {
    "id": "PH_PLEASE_LEAVE",
    "text": "Please leave.",
    "tags": [
      "request",
      "distance"
    ],
    "slots": []
  },
  {
    "id": "PH_PLEASE_STOP",
    "text": "Please stop.",
    "tags": [
      "boundary"
    ],
    "slots": []
  },
  {
    "id": "PH_STOP_ASKING",
    "text": "Stop asking.",
    "tags": [
      "boundary"
    ],
    "slots": []
  },
  {
    "id": "PH_DONT_COME_CLOSER",
    "text": "Do not come closer.",
    "tags": [
      "boundary",
      "distance"
    ],
    "slots": []
  },
  {
    "id": "PH_DONT_WAIT_FOR_ME",
    "text": "Do not wait for me.",
    "tags": [
      "boundary"
    ],
    "slots": []
  },
  {
    "id": "PH_DONT_CALL_ME",
    "text": "Do not call me.",
    "tags": [
      "boundary",
      "contact"
    ],
    "slots": []
  },
  {
    "id": "PH_DONT_MESSAGE_ME",
    "text": "Do not message me.",
    "tags": [
      "boundary",
      "contact"
    ],
    "slots": []
  },
  {
    "id": "PH_DONT_COME_IN",
    "text": "Do not come in.",
    "tags": [
      "boundary",
      "entry"
    ],
    "slots": []
  },
  {
    "id": "PH_I_UNDERSTAND_YOUR_BOUNDARY",
    "text": "I understand your boundary.",
    "tags": [
      "boundary",
      "respect"
    ],
    "slots": []
  },
  {
    "id": "PH_I_WILL_NOT_CROSS_THAT_BOUNDARY",
    "text": "I will not cross that boundary.",
    "tags": [
      "boundary",
      "respect"
    ],
    "slots": []
  },
  {
    "id": "PH_THANK_YOU_FOR_TELLING_ME",
    "text": "Thank you for telling me.",
    "tags": [
      "boundary",
      "respect"
    ],
    "slots": []
  },
  {
    "id": "PH_YOU_CAN_CHANGE_YOUR_MIND",
    "text": "You can change your mind.",
    "tags": [
      "permission",
      "respect"
    ],
    "slots": []
  },
  {
    "id": "PH_I_CHANGED_MY_MIND",
    "text": "I changed my mind.",
    "tags": [
      "decision"
    ],
    "slots": []
  },
  {
    "id": "PH_THAT_IS_MY_DECISION",
    "text": "That is my decision.",
    "tags": [
      "decision"
    ],
    "slots": []
  },
  {
    "id": "PH_I_HAVE_NOT_DECIDED_YET",
    "text": "I have not decided yet.",
    "tags": [
      "decision",
      "uncertainty"
    ],
    "slots": []
  },
  {
    "id": "PH_I_NEED_TO_THINK_ABOUT_IT",
    "text": "I need to think about it.",
    "tags": [
      "decision",
      "uncertainty"
    ],
    "slots": []
  },
  {
    "id": "PH_I_AM_SURE_ABOUT_THIS",
    "text": "I am sure about this.",
    "tags": [
      "certainty"
    ],
    "slots": []
  },
  {
    "id": "PH_I_AM_NOT_SURE_ABOUT_THIS",
    "text": "I am not sure about this.",
    "tags": [
      "certainty"
    ],
    "slots": []
  },
  {
    "id": "PH_I_WANT_TO_ASK_YOU_SOMETHING",
    "text": "I want to ask you something.",
    "tags": [
      "clarity"
    ],
    "slots": []
  },
  {
    "id": "PH_ASK_ME",
    "text": "Ask me.",
    "tags": [
      "clarity"
    ],
    "slots": []
  },
  {
    "id": "PH_I_WILL_TELL_YOU",
    "text": "I will tell you.",
    "tags": [
      "clarity"
    ],
    "slots": []
  },
  {
    "id": "PH_I_DONT_WANT_TO_ANSWER",
    "text": "I do not want to answer.",
    "tags": [
      "boundary",
      "clarity"
    ],
    "slots": []
  },
  {
    "id": "PH_I_CANT_ANSWER_THAT",
    "text": "I cannot answer that.",
    "tags": [
      "clarity"
    ],
    "slots": []
  },
  {
    "id": "PH_I_DONT_KNOW_THE_ANSWER",
    "text": "I do not know the answer.",
    "tags": [
      "clarity"
    ],
    "slots": []
  },
  {
    "id": "PH_THAT_IS_ALL_I_KNOW",
    "text": "That is all I know.",
    "tags": [
      "clarity"
    ],
    "slots": []
  },
  {
    "id": "PH_I_NEED_MORE_INFORMATION",
    "text": "I need more information.",
    "tags": [
      "clarity"
    ],
    "slots": []
  },
  {
    "id": "PH_THAT_IS_NOT_CLEAR",
    "text": "That is not clear.",
    "tags": [
      "clarity"
    ],
    "slots": []
  },
  {
    "id": "PH_NOW_I_UNDERSTAND",
    "text": "Now I understand.",
    "tags": [
      "clarity"
    ],
    "slots": []
  }
]);
})();