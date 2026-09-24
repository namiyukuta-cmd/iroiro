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
      "relationship"
    ],
    "slots": []
  },
  {
    "id": "PH_WE_ARE_DATING",
    "text": "We are dating.",
    "tags": [
      "relationship"
    ],
    "slots": []
  },
  {
    "id": "PH_WE_ARE_MARRIED",
    "text": "We are married.",
    "tags": [
      "relationship"
    ],
    "slots": []
  },
  {
    "id": "PH_WE_ARE_SEPARATED",
    "text": "We are separated.",
    "tags": [
      "relationship"
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
    "id": "PH_WE_ARE_STILL_TOGETHER",
    "text": "We are still together.",
    "tags": [
      "relationship"
    ],
    "slots": []
  },
  {
    "id": "PH_I_SEE_YOU_AS_A_FRIEND",
    "text": "I see you as a friend.",
    "tags": [
      "relationship",
      "feelings"
    ],
    "slots": []
  },
  {
    "id": "PH_I_SEE_YOU_AS_MY_PARTNER",
    "text": "I see you as my partner.",
    "tags": [
      "relationship",
      "feelings"
    ],
    "slots": []
  },
  {
    "id": "PH_I_CARE_DEEPLY_ABOUT_YOU",
    "text": "I care deeply about you.",
    "tags": [
      "feelings",
      "care"
    ],
    "slots": []
  },
  {
    "id": "PH_I_HAVE_FEELINGS_FOR_YOU",
    "text": "I have feelings for you.",
    "tags": [
      "feelings",
      "romance"
    ],
    "slots": []
  },
  {
    "id": "PH_I_AM_ATTRACTED_TO_YOU",
    "text": "I am attracted to you.",
    "tags": [
      "feelings",
      "romance"
    ],
    "slots": []
  },
  {
    "id": "PH_I_AM_INTERESTED_IN_YOU",
    "text": "I am interested in you.",
    "tags": [
      "feelings",
      "romance"
    ],
    "slots": []
  },
  {
    "id": "PH_I_FEEL_CLOSE_TO_YOU",
    "text": "I feel close to you.",
    "tags": [
      "feelings",
      "closeness"
    ],
    "slots": []
  },
  {
    "id": "PH_I_FEEL_SAFE_WITH_YOU",
    "text": "I feel safe with you.",
    "tags": [
      "feelings",
      "trust"
    ],
    "slots": []
  },
  {
    "id": "PH_I_FEEL_UNCERTAIN",
    "text": "I feel uncertain.",
    "tags": [
      "feelings",
      "uncertainty"
    ],
    "slots": []
  },
  {
    "id": "PH_I_AM_CONFUSED_ABOUT_US",
    "text": "I am confused about us.",
    "tags": [
      "relationship",
      "uncertainty"
    ],
    "slots": []
  },
  {
    "id": "PH_I_WANT_US_TO_WORK",
    "text": "I want us to work.",
    "tags": [
      "relationship",
      "repair"
    ],
    "slots": []
  },
  {
    "id": "PH_I_WANT_THIS_RELATIONSHIP",
    "text": "I want this relationship.",
    "tags": [
      "relationship",
      "commitment"
    ],
    "slots": []
  },
  {
    "id": "PH_I_DONT_WANT_TO_END_THIS",
    "text": "I do not want to end this.",
    "tags": [
      "relationship",
      "commitment"
    ],
    "slots": []
  },
  {
    "id": "PH_I_DONT_WANT_TO_LOSE_US",
    "text": "I do not want to lose us.",
    "tags": [
      "relationship",
      "fear"
    ],
    "slots": []
  },
  {
    "id": "PH_I_WANT_TO_STAY_WITH_YOU",
    "text": "I want to stay with you.",
    "tags": [
      "relationship",
      "closeness"
    ],
    "slots": []
  },
  {
    "id": "PH_I_WANT_TO_BUILD_TRUST",
    "text": "I want to build trust.",
    "tags": [
      "trust",
      "repair"
    ],
    "slots": []
  },
  {
    "id": "PH_I_NEED_YOUR_TRUST",
    "text": "I need your trust.",
    "tags": [
      "trust"
    ],
    "slots": []
  },
  {
    "id": "PH_I_TRUST_YOUR_WORD",
    "text": "I trust your word.",
    "tags": [
      "trust"
    ],
    "slots": []
  },
  {
    "id": "PH_I_DONT_TRUST_THIS_SITUATION",
    "text": "I do not trust this situation.",
    "tags": [
      "trust",
      "uncertainty"
    ],
    "slots": []
  },
  {
    "id": "PH_I_BELIEVE_YOU_NOW",
    "text": "I believe you now.",
    "tags": [
      "trust"
    ],
    "slots": []
  },
  {
    "id": "PH_I_STILL_BELIEVE_YOU",
    "text": "I still believe you.",
    "tags": [
      "trust"
    ],
    "slots": []
  },
  {
    "id": "PH_I_NEED_THE_TRUTH_FROM_YOU",
    "text": "I need the truth from you.",
    "tags": [
      "trust",
      "clarity"
    ],
    "slots": []
  },
  {
    "id": "PH_I_WILL_BE_HONEST_WITH_YOU",
    "text": "I will be honest with you.",
    "tags": [
      "trust"
    ],
    "slots": []
  },
  {
    "id": "PH_I_WAS_HONEST_WITH_YOU",
    "text": "I was honest with you.",
    "tags": [
      "trust"
    ],
    "slots": []
  },
  {
    "id": "PH_I_DID_NOT_MEAN_TO_HURT_YOU",
    "text": "I did not mean to hurt you.",
    "tags": [
      "repair"
    ],
    "slots": []
  },
  {
    "id": "PH_I_KNOW_THAT_HURT_YOU",
    "text": "I know that hurt you.",
    "tags": [
      "repair",
      "care"
    ],
    "slots": []
  },
  {
    "id": "PH_I_UNDERSTAND_WHY_YOU_ARE_HURT",
    "text": "I understand why you are hurt.",
    "tags": [
      "repair",
      "care"
    ],
    "slots": []
  },
  {
    "id": "PH_I_UNDERSTAND_WHY_YOU_ARE_ANGRY",
    "text": "I understand why you are angry.",
    "tags": [
      "repair",
      "care"
    ],
    "slots": []
  },
  {
    "id": "PH_I_WANT_TO_MAKE_THIS_RIGHT",
    "text": "I want to make this right.",
    "tags": [
      "repair"
    ],
    "slots": []
  },
  {
    "id": "PH_I_WANT_TO_EARN_YOUR_TRUST",
    "text": "I want to earn your trust.",
    "tags": [
      "repair",
      "trust"
    ],
    "slots": []
  },
  {
    "id": "PH_I_WILL_NOT_PRESSURE_YOU",
    "text": "I will not pressure you.",
    "tags": [
      "boundary",
      "respect"
    ],
    "slots": []
  },
  {
    "id": "PH_I_WILL_GIVE_YOU_TIME",
    "text": "I will give you time.",
    "tags": [
      "boundary",
      "respect"
    ],
    "slots": []
  },
  {
    "id": "PH_I_WILL_GIVE_YOU_SPACE",
    "text": "I will give you space.",
    "tags": [
      "boundary",
      "respect"
    ],
    "slots": []
  },
  {
    "id": "PH_I_WILL_RESPECT_YOUR_DECISION",
    "text": "I will respect your decision.",
    "tags": [
      "boundary",
      "respect"
    ],
    "slots": []
  },
  {
    "id": "PH_I_WILL_RESPECT_YOUR_BOUNDARY",
    "text": "I will respect your boundary.",
    "tags": [
      "boundary",
      "respect"
    ],
    "slots": []
  },
  {
    "id": "PH_TELL_ME_WHEN_YOU_ARE_READY",
    "text": "Tell me when you are ready.",
    "tags": [
      "boundary",
      "clarity"
    ],
    "slots": []
  },
  {
    "id": "PH_YOU_CAN_SAY_NO",
    "text": "You can say no.",
    "tags": [
      "boundary"
    ],
    "slots": []
  },
  {
    "id": "PH_YOU_DO_NOT_HAVE_TO_EXPLAIN",
    "text": "You do not have to explain.",
    "tags": [
      "boundary"
    ],
    "slots": []
  },
  {
    "id": "PH_I_WILL_NOT_ASK_AGAIN",
    "text": "I will not ask again.",
    "tags": [
      "boundary"
    ],
    "slots": []
  },
  {
    "id": "PH_I_AM_NOT_ANGRY_WITH_YOU",
    "text": "I am not angry with you.",
    "tags": [
      "emotion",
      "care"
    ],
    "slots": []
  },
  {
    "id": "PH_I_AM_HURT_BUT_I_AM_LISTENING",
    "text": "I am hurt, but I am listening.",
    "tags": [
      "emotion",
      "clarity"
    ],
    "slots": []
  },
  {
    "id": "PH_I_AM_AFRAID_BUT_I_WANT_TO_TRY",
    "text": "I am afraid, but I want to try.",
    "tags": [
      "emotion",
      "repair"
    ],
    "slots": []
  },
  {
    "id": "PH_I_AM_JEALOUS_AND_I_KNOW_IT",
    "text": "I am jealous, and I know it.",
    "tags": [
      "emotion"
    ],
    "slots": []
  },
  {
    "id": "PH_I_MISSED_YOU_A_LOT",
    "text": "I missed you a lot.",
    "tags": [
      "closeness"
    ],
    "slots": []
  },
  {
    "id": "PH_I_WAS_AFRAID_YOU_WOULD_LEAVE",
    "text": "I was afraid you would leave.",
    "tags": [
      "fear",
      "abandonment"
    ],
    "slots": []
  },
  {
    "id": "PH_I_WAS_AFRAID_YOU_WOULD_NOT_RETURN",
    "text": "I was afraid you would not return.",
    "tags": [
      "fear",
      "return"
    ],
    "slots": []
  },
  {
    "id": "PH_I_WAS_WORRIED_WHEN_YOU_LEFT",
    "text": "I was worried when you left.",
    "tags": [
      "care",
      "departure"
    ],
    "slots": []
  },
  {
    "id": "PH_I_AM_GLAD_YOU_CAME_BACK",
    "text": "I am glad you came back.",
    "tags": [
      "relief",
      "return"
    ],
    "slots": []
  },
  {
    "id": "PH_I_AM_GLAD_WE_TALKED",
    "text": "I am glad we talked.",
    "tags": [
      "relief",
      "repair"
    ],
    "slots": []
  },
  {
    "id": "PH_I_DONT_WANT_TO_FIGHT",
    "text": "I do not want to fight.",
    "tags": [
      "conflict",
      "repair"
    ],
    "slots": []
  },
  {
    "id": "PH_LETS_NOT_FIGHT",
    "text": "Let us not fight.",
    "tags": [
      "conflict",
      "repair"
    ],
    "slots": []
  },
  {
    "id": "PH_CAN_WE_TALK_CALMLY",
    "text": "Can we talk calmly?",
    "tags": [
      "conflict",
      "repair"
    ],
    "slots": []
  },
  {
    "id": "PH_I_NEED_A_MOMENT_TO_CALM_DOWN",
    "text": "I need a moment to calm down.",
    "tags": [
      "emotion",
      "boundary"
    ],
    "slots": []
  },
  {
    "id": "PH_I_AM_READY_TO_LISTEN",
    "text": "I am ready to listen.",
    "tags": [
      "clarity",
      "repair"
    ],
    "slots": []
  },
  {
    "id": "PH_I_AM_READY_TO_ANSWER",
    "text": "I am ready to answer.",
    "tags": [
      "clarity"
    ],
    "slots": []
  },
  {
    "id": "PH_ASK_ME_DIRECTLY",
    "text": "Ask me directly.",
    "tags": [
      "clarity"
    ],
    "slots": []
  },
  {
    "id": "PH_I_WILL_ANSWER_HONESTLY",
    "text": "I will answer honestly.",
    "tags": [
      "clarity",
      "trust"
    ],
    "slots": []
  }
]);
})();