(() => {
  "use strict";
  const P=window.HMW?.Dialogue?.Phrases;
  if(!P) throw new Error("Phrase registry must load first.");
  P.register([
  {
    "id": "PH_WE_ARE_FRIENDS",
    "text": "We are friends.",
    "tags": [
      "relationship"
    ],
    "slots": []
  },
  {
    "id": "PH_WE_ARE_PARTNERS",
    "text": "We are partners.",
    "tags": [
      "relationship"
    ],
    "slots": []
  },
  {
    "id": "PH_WE_ARE_TOGETHER",
    "text": "We are together.",
    "tags": [
      "relationship",
      "romance"
    ],
    "slots": []
  },
  {
    "id": "PH_WE_ARE_DATING",
    "text": "We are dating.",
    "tags": [
      "relationship",
      "romance"
    ],
    "slots": []
  },
  {
    "id": "PH_WE_ARE_MARRIED",
    "text": "We are married.",
    "tags": [
      "relationship",
      "romance"
    ],
    "slots": []
  },
  {
    "id": "PH_WE_ARE_NOT_TOGETHER",
    "text": "We are not together.",
    "tags": [
      "relationship"
    ],
    "slots": []
  },
  {
    "id": "PH_I_LIKE_YOU",
    "text": "I like you.",
    "tags": [
      "relationship",
      "affection"
    ],
    "slots": []
  },
  {
    "id": "PH_I_LOVE_YOU",
    "text": "I love you.",
    "tags": [
      "relationship",
      "affection"
    ],
    "slots": []
  },
  {
    "id": "PH_I_CARE_ABOUT_YOU",
    "text": "I care about you.",
    "tags": [
      "relationship",
      "care"
    ],
    "slots": []
  },
  {
    "id": "PH_I_TRUST_YOU",
    "text": "I trust you.",
    "tags": [
      "relationship",
      "trust"
    ],
    "slots": []
  },
  {
    "id": "PH_I_MISS_YOU",
    "text": "I miss you.",
    "tags": [
      "relationship",
      "closeness"
    ],
    "slots": []
  },
  {
    "id": "PH_I_AM_ATTRACTED_TO_YOU",
    "text": "I am attracted to you.",
    "tags": [
      "relationship",
      "romance"
    ],
    "slots": []
  },
  {
    "id": "PH_I_HAVE_FEELINGS_FOR_YOU",
    "text": "I have feelings for you.",
    "tags": [
      "relationship",
      "romance"
    ],
    "slots": []
  },
  {
    "id": "PH_I_AM_CONFUSED_ABOUT_MY_FEELINGS",
    "text": "I am confused about my feelings.",
    "tags": [
      "relationship",
      "uncertainty"
    ],
    "slots": []
  },
  {
    "id": "PH_I_DONT_FEEL_THAT_WAY",
    "text": "I do not feel that way.",
    "tags": [
      "relationship"
    ],
    "slots": []
  },
  {
    "id": "PH_I_WANT_TO_BE_WITH_YOU",
    "text": "I want to be with you.",
    "tags": [
      "relationship",
      "closeness"
    ],
    "slots": []
  },
  {
    "id": "PH_I_WANT_TO_STAY_CLOSE",
    "text": "I want to stay close to you.",
    "tags": [
      "relationship",
      "closeness"
    ],
    "slots": []
  },
  {
    "id": "PH_I_NEED_SOME_SPACE",
    "text": "I need some space.",
    "tags": [
      "relationship",
      "boundary"
    ],
    "slots": []
  },
  {
    "id": "PH_CAN_I_STAY",
    "text": "Can I stay?",
    "tags": [
      "permission",
      "closeness"
    ],
    "slots": []
  },
  {
    "id": "PH_CAN_I_COME_IN",
    "text": "Can I come in?",
    "tags": [
      "permission"
    ],
    "slots": []
  },
  {
    "id": "PH_CAN_I_SIT_HERE",
    "text": "Can I sit here?",
    "tags": [
      "permission"
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
    "id": "PH_CAN_I_HOLD_YOUR_HAND",
    "text": "Can I hold your hand?",
    "tags": [
      "permission",
      "physical"
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
    "id": "PH_NO_YOU_CANNOT",
    "text": "No, you cannot.",
    "tags": [
      "permission",
      "answer"
    ],
    "slots": []
  },
  {
    "id": "PH_PLEASE_WAIT_HERE",
    "text": "Please wait here.",
    "tags": [
      "request",
      "waiting"
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
    "id": "PH_PLEASE_CALL_ME",
    "text": "Please call me.",
    "tags": [
      "request",
      "contact"
    ],
    "slots": []
  },
  {
    "id": "PH_PLEASE_TELL_ME",
    "text": "Please tell me.",
    "tags": [
      "request",
      "clarity"
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
    "id": "PH_COULD_YOU_HELP_ME",
    "text": "Could you help me?",
    "tags": [
      "request",
      "help"
    ],
    "slots": []
  },
  {
    "id": "PH_COULD_YOU_WAIT",
    "text": "Could you wait?",
    "tags": [
      "request",
      "waiting"
    ],
    "slots": []
  },
  {
    "id": "PH_COULD_YOU_EXPLAIN",
    "text": "Could you explain?",
    "tags": [
      "request",
      "clarity"
    ],
    "slots": []
  },
  {
    "id": "PH_SHALL_WE_GO",
    "text": "Shall we go?",
    "tags": [
      "suggestion",
      "movement"
    ],
    "slots": []
  },
  {
    "id": "PH_SHALL_WE_WAIT",
    "text": "Shall we wait?",
    "tags": [
      "suggestion",
      "waiting"
    ],
    "slots": []
  },
  {
    "id": "PH_SHALL_WE_TALK",
    "text": "Shall we talk?",
    "tags": [
      "suggestion",
      "clarity"
    ],
    "slots": []
  },
  {
    "id": "PH_HOW_ABOUT_TOMORROW",
    "text": "How about tomorrow?",
    "tags": [
      "suggestion",
      "time"
    ],
    "slots": []
  },
  {
    "id": "PH_HOW_ABOUT_HERE",
    "text": "How about here?",
    "tags": [
      "suggestion",
      "place"
    ],
    "slots": []
  },
  {
    "id": "PH_THAT_WORKS_FOR_ME",
    "text": "That works for me.",
    "tags": [
      "agreement"
    ],
    "slots": []
  },
  {
    "id": "PH_THAT_DOES_NOT_WORK_FOR_ME",
    "text": "That does not work for me.",
    "tags": [
      "disagreement"
    ],
    "slots": []
  },
  {
    "id": "PH_I_AGREE",
    "text": "I agree.",
    "tags": [
      "agreement"
    ],
    "slots": []
  },
  {
    "id": "PH_I_DISAGREE",
    "text": "I disagree.",
    "tags": [
      "disagreement"
    ],
    "slots": []
  },
  {
    "id": "PH_YOU_ARE_RIGHT",
    "text": "You are right.",
    "tags": [
      "agreement"
    ],
    "slots": []
  },
  {
    "id": "PH_YOU_ARE_WRONG",
    "text": "You are wrong.",
    "tags": [
      "disagreement"
    ],
    "slots": []
  },
  {
    "id": "PH_ACTUALLY_THAT_IS_NOT_TRUE",
    "text": "Actually, that is not true.",
    "tags": [
      "correction"
    ],
    "slots": []
  },
  {
    "id": "PH_ACTUALLY_I_CHANGED_MY_MIND",
    "text": "Actually, I changed my mind.",
    "tags": [
      "correction",
      "decision"
    ],
    "slots": []
  },
  {
    "id": "PH_WHAT_I_MEAN_IS",
    "text": "What I mean is this.",
    "tags": [
      "clarity"
    ],
    "slots": []
  },
  {
    "id": "PH_LET_ME_EXPLAIN",
    "text": "Let me explain.",
    "tags": [
      "clarity"
    ],
    "slots": []
  },
  {
    "id": "PH_THERE_IS_MORE",
    "text": "There is more.",
    "tags": [
      "clarity"
    ],
    "slots": []
  },
  {
    "id": "PH_ONE_MORE_THING",
    "text": "One more thing.",
    "tags": [
      "clarity"
    ],
    "slots": []
  },
  {
    "id": "PH_BUT_I_STILL_CARE",
    "text": "But I still care about you.",
    "tags": [
      "contrast",
      "care"
    ],
    "slots": []
  },
  {
    "id": "PH_BUT_I_CANNOT_STAY",
    "text": "But I cannot stay.",
    "tags": [
      "contrast",
      "distance"
    ],
    "slots": []
  },
  {
    "id": "PH_YET_I_AM_STILL_HERE",
    "text": "Yet I am still here.",
    "tags": [
      "contrast",
      "closeness"
    ],
    "slots": []
  },
  {
    "id": "PH_THAT_IS_WHY_I_CAME",
    "text": "That is why I came.",
    "tags": [
      "reason"
    ],
    "slots": []
  },
  {
    "id": "PH_THAT_IS_WHY_I_LEFT",
    "text": "That is why I left.",
    "tags": [
      "reason"
    ],
    "slots": []
  },
  {
    "id": "PH_THAT_IS_WHY_I_CALLED",
    "text": "That is why I called.",
    "tags": [
      "reason",
      "contact"
    ],
    "slots": []
  },
  {
    "id": "PH_MAYBE_YOU_ARE_RIGHT",
    "text": "Maybe you are right.",
    "tags": [
      "uncertainty"
    ],
    "slots": []
  },
  {
    "id": "PH_MAYBE_I_WAS_WRONG",
    "text": "Maybe I was wrong.",
    "tags": [
      "uncertainty",
      "repair"
    ],
    "slots": []
  },
  {
    "id": "PH_PROBABLY_TOMORROW",
    "text": "Probably tomorrow.",
    "tags": [
      "uncertainty",
      "time"
    ],
    "slots": []
  },
  {
    "id": "PH_DEFINITELY_TODAY",
    "text": "Definitely today.",
    "tags": [
      "certainty",
      "time"
    ],
    "slots": []
  },
  {
    "id": "PH_I_ALWAYS_COME_BACK",
    "text": "I always come back.",
    "tags": [
      "frequency",
      "return"
    ],
    "slots": []
  },
  {
    "id": "PH_I_OFTEN_WORK_LATE",
    "text": "I often work late.",
    "tags": [
      "frequency",
      "work"
    ],
    "slots": []
  },
  {
    "id": "PH_I_SOMETIMES_NEED_SPACE",
    "text": "I sometimes need space.",
    "tags": [
      "frequency",
      "boundary"
    ],
    "slots": []
  },
  {
    "id": "PH_I_NEVER_FORGOT_YOU",
    "text": "I never forgot you.",
    "tags": [
      "frequency",
      "relationship"
    ],
    "slots": []
  },
  {
    "id": "PH_I_NEVER_WANTED_TO_HURT_YOU",
    "text": "I never wanted to hurt you.",
    "tags": [
      "relationship",
      "repair"
    ],
    "slots": []
  },
  {
    "id": "PH_I_ALWAYS_TELL_THE_TRUTH",
    "text": "I always tell the truth.",
    "tags": [
      "frequency",
      "trust"
    ],
    "slots": []
  },
  {
    "id": "PH_I_OFTEN_THINK_ABOUT_YOU",
    "text": "I often think about you.",
    "tags": [
      "frequency",
      "affection"
    ],
    "slots": []
  },
  {
    "id": "PH_I_SOMETIMES_WORRY_ABOUT_YOU",
    "text": "I sometimes worry about you.",
    "tags": [
      "frequency",
      "care"
    ],
    "slots": []
  }
]);
})();