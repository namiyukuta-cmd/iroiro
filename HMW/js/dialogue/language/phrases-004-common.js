(() => {
  "use strict";
  const P = window.HMW?.Dialogue?.Phrases;
  if (!P) throw new Error("Phrase registry must load first.");
  P.register([
  {
    "id": "PH_GO_HOME",
    "text": "go home",
    "tags": [
      "daily",
      "movement"
    ],
    "slots": []
  },
  {
    "id": "PH_COME_HOME",
    "text": "come home",
    "tags": [
      "daily",
      "movement"
    ],
    "slots": []
  },
  {
    "id": "PH_GET_HOME",
    "text": "get home",
    "tags": [
      "daily",
      "movement"
    ],
    "slots": []
  },
  {
    "id": "PH_LEAVE_HOME",
    "text": "leave home",
    "tags": [
      "daily",
      "movement"
    ],
    "slots": []
  },
  {
    "id": "PH_GO_INSIDE",
    "text": "go inside",
    "tags": [
      "movement",
      "safety"
    ],
    "slots": []
  },
  {
    "id": "PH_GO_OUTSIDE",
    "text": "go outside",
    "tags": [
      "movement"
    ],
    "slots": []
  },
  {
    "id": "PH_GET_INSIDE",
    "text": "get inside",
    "tags": [
      "movement",
      "safety"
    ],
    "slots": []
  },
  {
    "id": "PH_GET_OUTSIDE",
    "text": "get outside",
    "tags": [
      "movement"
    ],
    "slots": []
  },
  {
    "id": "PH_GET_DRESSED",
    "text": "get dressed",
    "tags": [
      "daily"
    ],
    "slots": []
  },
  {
    "id": "PH_TAKE_OFF",
    "text": "take off {OBJECT}",
    "tags": [
      "daily"
    ],
    "slots": [
      "OBJECT"
    ]
  },
  {
    "id": "PH_PUT_ON",
    "text": "put on {OBJECT}",
    "tags": [
      "daily"
    ],
    "slots": [
      "OBJECT"
    ]
  },
  {
    "id": "PH_WAKE_UP",
    "text": "wake up",
    "tags": [
      "daily"
    ],
    "slots": []
  },
  {
    "id": "PH_GET_UP",
    "text": "get up",
    "tags": [
      "daily"
    ],
    "slots": []
  },
  {
    "id": "PH_GO_TO_BED",
    "text": "go to bed",
    "tags": [
      "daily"
    ],
    "slots": []
  },
  {
    "id": "PH_FALL_ASLEEP",
    "text": "fall asleep",
    "tags": [
      "daily"
    ],
    "slots": []
  },
  {
    "id": "PH_GET_SOME_SLEEP",
    "text": "get some sleep",
    "tags": [
      "daily"
    ],
    "slots": []
  },
  {
    "id": "PH_TAKE_A_BREAK",
    "text": "take a break",
    "tags": [
      "daily",
      "work"
    ],
    "slots": []
  },
  {
    "id": "PH_GO_TO_WORK",
    "text": "go to work",
    "tags": [
      "work"
    ],
    "slots": []
  },
  {
    "id": "PH_GET_OFF_WORK",
    "text": "get off work",
    "tags": [
      "work"
    ],
    "slots": []
  },
  {
    "id": "PH_START_WORK",
    "text": "start work",
    "tags": [
      "work"
    ],
    "slots": []
  },
  {
    "id": "PH_FINISH_WORK",
    "text": "finish work",
    "tags": [
      "work"
    ],
    "slots": []
  },
  {
    "id": "PH_FIND_A_JOB",
    "text": "find a job",
    "tags": [
      "work"
    ],
    "slots": []
  },
  {
    "id": "PH_LOSE_A_JOB",
    "text": "lose a job",
    "tags": [
      "work"
    ],
    "slots": []
  },
  {
    "id": "PH_MAKE_MONEY",
    "text": "make money",
    "tags": [
      "money"
    ],
    "slots": []
  },
  {
    "id": "PH_EARN_MONEY",
    "text": "earn money",
    "tags": [
      "money"
    ],
    "slots": []
  },
  {
    "id": "PH_SAVE_MONEY",
    "text": "save money",
    "tags": [
      "money"
    ],
    "slots": []
  },
  {
    "id": "PH_SPEND_MONEY",
    "text": "spend money",
    "tags": [
      "money"
    ],
    "slots": []
  },
  {
    "id": "PH_PAY_RENT",
    "text": "pay rent",
    "tags": [
      "money"
    ],
    "slots": []
  },
  {
    "id": "PH_PAY_FOR",
    "text": "pay for {OBJECT}",
    "tags": [
      "money"
    ],
    "slots": [
      "OBJECT"
    ]
  },
  {
    "id": "PH_COST_TOO_MUCH",
    "text": "cost too much",
    "tags": [
      "money"
    ],
    "slots": []
  },
  {
    "id": "PH_AFFORD_IT",
    "text": "afford it",
    "tags": [
      "money"
    ],
    "slots": []
  },
  {
    "id": "PH_BUY_FOOD",
    "text": "buy food",
    "tags": [
      "food",
      "money"
    ],
    "slots": []
  },
  {
    "id": "PH_COOK_DINNER",
    "text": "cook dinner",
    "tags": [
      "food",
      "daily"
    ],
    "slots": []
  },
  {
    "id": "PH_MAKE_BREAKFAST",
    "text": "make breakfast",
    "tags": [
      "food",
      "daily"
    ],
    "slots": []
  },
  {
    "id": "PH_EAT_TOGETHER",
    "text": "eat together",
    "tags": [
      "food",
      "closeness"
    ],
    "slots": []
  },
  {
    "id": "PH_DRINK_TOGETHER",
    "text": "have a drink together",
    "tags": [
      "daily",
      "closeness"
    ],
    "slots": []
  },
  {
    "id": "PH_FEEL_BETTER",
    "text": "feel better",
    "tags": [
      "health"
    ],
    "slots": []
  },
  {
    "id": "PH_FEEL_WORSE",
    "text": "feel worse",
    "tags": [
      "health"
    ],
    "slots": []
  },
  {
    "id": "PH_GET_SICK",
    "text": "get sick",
    "tags": [
      "health"
    ],
    "slots": []
  },
  {
    "id": "PH_GET_HURT",
    "text": "get hurt",
    "tags": [
      "health"
    ],
    "slots": []
  },
  {
    "id": "PH_TAKE_MEDICINE",
    "text": "take medicine",
    "tags": [
      "health"
    ],
    "slots": []
  },
  {
    "id": "PH_SEE_A_DOCTOR",
    "text": "see a doctor",
    "tags": [
      "health"
    ],
    "slots": []
  },
  {
    "id": "PH_GO_TO_HOSPITAL",
    "text": "go to the hospital",
    "tags": [
      "health"
    ],
    "slots": []
  },
  {
    "id": "PH_NEED_HELP",
    "text": "need help",
    "tags": [
      "care"
    ],
    "slots": []
  },
  {
    "id": "PH_ASK_FOR_HELP",
    "text": "ask for help",
    "tags": [
      "care"
    ],
    "slots": []
  },
  {
    "id": "PH_GIVE_HELP",
    "text": "give help",
    "tags": [
      "care"
    ],
    "slots": []
  },
  {
    "id": "PH_TAKE_CARE_OF",
    "text": "take care of {OBJECT}",
    "tags": [
      "care"
    ],
    "slots": [
      "OBJECT"
    ]
  },
  {
    "id": "PH_LOOK_AFTER",
    "text": "look after {OBJECT}",
    "tags": [
      "care"
    ],
    "slots": [
      "OBJECT"
    ]
  },
  {
    "id": "PH_STAY_SAFE",
    "text": "stay safe",
    "tags": [
      "safety"
    ],
    "slots": []
  },
  {
    "id": "PH_KEEP_SAFE",
    "text": "keep {OBJECT} safe",
    "tags": [
      "safety"
    ],
    "slots": [
      "OBJECT"
    ]
  },
  {
    "id": "PH_STAY_WARM",
    "text": "stay warm",
    "tags": [
      "weather",
      "care"
    ],
    "slots": []
  },
  {
    "id": "PH_KEEP_WARM",
    "text": "keep {OBJECT} warm",
    "tags": [
      "weather",
      "care"
    ],
    "slots": [
      "OBJECT"
    ]
  },
  {
    "id": "PH_GET_OUT_OF_RAIN",
    "text": "get out of the rain",
    "tags": [
      "weather",
      "safety"
    ],
    "slots": []
  },
  {
    "id": "PH_WAIT_UNTIL",
    "text": "wait until {CLAUSE}",
    "tags": [
      "time"
    ],
    "slots": [
      "CLAUSE"
    ]
  },
  {
    "id": "PH_WAIT_HERE",
    "text": "wait here",
    "tags": [
      "waiting"
    ],
    "slots": []
  },
  {
    "id": "PH_WAIT_OUTSIDE",
    "text": "wait outside",
    "tags": [
      "waiting"
    ],
    "slots": []
  },
  {
    "id": "PH_WAIT_INSIDE",
    "text": "wait inside",
    "tags": [
      "waiting"
    ],
    "slots": []
  },
  {
    "id": "PH_MEET_HERE",
    "text": "meet here",
    "tags": [
      "meeting"
    ],
    "slots": []
  },
  {
    "id": "PH_MEET_LATER",
    "text": "meet later",
    "tags": [
      "meeting"
    ],
    "slots": []
  },
  {
    "id": "PH_SEE_YOU_LATER",
    "text": "see you later",
    "tags": [
      "parting"
    ],
    "slots": []
  },
  {
    "id": "PH_SEE_YOU_TOMORROW",
    "text": "see you tomorrow",
    "tags": [
      "parting"
    ],
    "slots": []
  },
  {
    "id": "PH_COME_BACK_LATER",
    "text": "come back later",
    "tags": [
      "parting"
    ],
    "slots": []
  },
  {
    "id": "PH_CALL_ME_LATER",
    "text": "call me later",
    "tags": [
      "contact"
    ],
    "slots": []
  },
  {
    "id": "PH_SEND_ME_A_MESSAGE",
    "text": "send me a message",
    "tags": [
      "contact"
    ],
    "slots": []
  },
  {
    "id": "PH_TALK_LATER",
    "text": "talk later",
    "tags": [
      "contact"
    ],
    "slots": []
  },
  {
    "id": "PH_KEEP_IN_TOUCH",
    "text": "keep in touch",
    "tags": [
      "contact"
    ],
    "slots": []
  },
  {
    "id": "PH_DONT_CONTACT_ME",
    "text": "do not contact me",
    "tags": [
      "boundary",
      "contact"
    ],
    "slots": []
  },
  {
    "id": "PH_DONT_FOLLOW_ME",
    "text": "do not follow me",
    "tags": [
      "boundary"
    ],
    "slots": []
  },
  {
    "id": "PH_DONT_TOUCH_ME",
    "text": "do not touch me",
    "tags": [
      "boundary",
      "physical"
    ],
    "slots": []
  },
  {
    "id": "PH_DONT_KISS_ME",
    "text": "do not kiss me",
    "tags": [
      "boundary",
      "physical"
    ],
    "slots": []
  },
  {
    "id": "PH_DONT_HUG_ME",
    "text": "do not hug me",
    "tags": [
      "boundary",
      "physical"
    ],
    "slots": []
  },
  {
    "id": "PH_GIVE_ME_SPACE",
    "text": "give me some space",
    "tags": [
      "boundary",
      "distance"
    ],
    "slots": []
  },
  {
    "id": "PH_LEAVE_ME_ALONE",
    "text": "leave me alone",
    "tags": [
      "boundary",
      "distance"
    ],
    "slots": []
  },
  {
    "id": "PH_STAY_AWAY",
    "text": "stay away from me",
    "tags": [
      "boundary",
      "distance"
    ],
    "slots": []
  },
  {
    "id": "PH_I_WILL_RESPECT_THAT",
    "text": "I will respect that",
    "tags": [
      "boundary",
      "respect"
    ],
    "slots": []
  },
  {
    "id": "PH_I_WILL_NOT_PUSH",
    "text": "I will not push you",
    "tags": [
      "boundary",
      "respect"
    ],
    "slots": []
  },
  {
    "id": "PH_I_WILL_WAIT",
    "text": "I will wait",
    "tags": [
      "waiting"
    ],
    "slots": []
  },
  {
    "id": "PH_I_WILL_BE_HERE",
    "text": "I will be here",
    "tags": [
      "closeness"
    ],
    "slots": []
  },
  {
    "id": "PH_I_AM_NOT_GOING_ANYWHERE",
    "text": "I am not going anywhere",
    "tags": [
      "closeness"
    ],
    "slots": []
  },
  {
    "id": "PH_YOU_CAN_TRUST_ME",
    "text": "you can trust me",
    "tags": [
      "trust"
    ],
    "slots": []
  },
  {
    "id": "PH_I_TRUST_YOU",
    "text": "I trust you",
    "tags": [
      "trust"
    ],
    "slots": []
  },
  {
    "id": "PH_I_BELIEVE_YOU",
    "text": "I believe you",
    "tags": [
      "trust"
    ],
    "slots": []
  },
  {
    "id": "PH_I_DONT_BELIEVE_THAT",
    "text": "I do not believe that",
    "tags": [
      "trust"
    ],
    "slots": []
  },
  {
    "id": "PH_I_NEED_THE_TRUTH",
    "text": "I need the truth",
    "tags": [
      "clarity"
    ],
    "slots": []
  },
  {
    "id": "PH_TELL_ME_WHY",
    "text": "tell me why",
    "tags": [
      "clarity",
      "request"
    ],
    "slots": []
  },
  {
    "id": "PH_TELL_ME_MORE",
    "text": "tell me more",
    "tags": [
      "clarity",
      "request"
    ],
    "slots": []
  },
  {
    "id": "PH_EXPLAIN_IT_TO_ME",
    "text": "explain it to me",
    "tags": [
      "clarity",
      "request"
    ],
    "slots": []
  },
  {
    "id": "PH_I_UNDERSTAND_NOW",
    "text": "I understand now",
    "tags": [
      "clarity"
    ],
    "slots": []
  },
  {
    "id": "PH_I_STILL_DONT_UNDERSTAND",
    "text": "I still do not understand",
    "tags": [
      "clarity"
    ],
    "slots": []
  },
  {
    "id": "PH_I_NEED_TO_THINK",
    "text": "I need to think",
    "tags": [
      "clarity",
      "distance"
    ],
    "slots": []
  },
  {
    "id": "PH_GIVE_ME_A_MINUTE",
    "text": "give me a minute",
    "tags": [
      "distance",
      "time"
    ],
    "slots": []
  },
  {
    "id": "PH_GIVE_ME_A_MOMENT",
    "text": "give me a moment",
    "tags": [
      "distance",
      "time"
    ],
    "slots": []
  },
  {
    "id": "PH_I_AM_READY_TO_TALK",
    "text": "I am ready to talk",
    "tags": [
      "clarity"
    ],
    "slots": []
  },
  {
    "id": "PH_I_AM_NOT_READY",
    "text": "I am not ready",
    "tags": [
      "boundary"
    ],
    "slots": []
  },
  {
    "id": "PH_I_WANT_TO_TRY",
    "text": "I want to try",
    "tags": [
      "repair"
    ],
    "slots": []
  },
  {
    "id": "PH_I_DONT_WANT_TO_GIVE_UP",
    "text": "I do not want to give up",
    "tags": [
      "repair",
      "relationship"
    ],
    "slots": []
  },
  {
    "id": "PH_LETS_START_AGAIN",
    "text": "let us start again",
    "tags": [
      "repair"
    ],
    "slots": []
  },
  {
    "id": "PH_CAN_WE_START_AGAIN",
    "text": "can we start again",
    "tags": [
      "repair",
      "question"
    ],
    "slots": []
  },
  {
    "id": "PH_I_AM_SORRY_I_HURT_YOU",
    "text": "I am sorry I hurt you",
    "tags": [
      "repair"
    ],
    "slots": []
  },
  {
    "id": "PH_I_DID_NOT_WANT_TO_HURT_YOU",
    "text": "I did not want to hurt you",
    "tags": [
      "repair"
    ],
    "slots": []
  },
  {
    "id": "PH_I_KNOW_I_HURT_YOU",
    "text": "I know I hurt you",
    "tags": [
      "repair"
    ],
    "slots": []
  },
  {
    "id": "PH_I_FORGIVE_YOU",
    "text": "I forgive you",
    "tags": [
      "repair"
    ],
    "slots": []
  },
  {
    "id": "PH_I_CANNOT_FORGIVE_YOU_YET",
    "text": "I cannot forgive you yet",
    "tags": [
      "repair"
    ],
    "slots": []
  },
  {
    "id": "PH_I_STILL_CARE",
    "text": "I still care about you",
    "tags": [
      "affection"
    ],
    "slots": []
  },
  {
    "id": "PH_I_STILL_LOVE_YOU",
    "text": "I still love you",
    "tags": [
      "affection"
    ],
    "slots": []
  },
  {
    "id": "PH_I_WANT_TO_STAY_WITH_YOU",
    "text": "I want to stay with you",
    "tags": [
      "affection",
      "closeness"
    ],
    "slots": []
  },
  {
    "id": "PH_I_WANT_A_FUTURE_WITH_YOU",
    "text": "I want a future with you",
    "tags": [
      "affection",
      "commitment"
    ],
    "slots": []
  },
  {
    "id": "PH_I_AM_AFRAID_TO_LOSE_YOU",
    "text": "I am afraid to lose you",
    "tags": [
      "fear",
      "affection"
    ],
    "slots": []
  },
  {
    "id": "PH_I_AM_HERE_FOR_YOU",
    "text": "I am here for you",
    "tags": [
      "care",
      "closeness"
    ],
    "slots": []
  },
  {
    "id": "PH_YOU_MATTER_TO_ME",
    "text": "you matter to me",
    "tags": [
      "care",
      "affection"
    ],
    "slots": []
  },
  {
    "id": "PH_I_NEED_YOU",
    "text": "I need you",
    "tags": [
      "closeness"
    ],
    "slots": []
  },
  {
    "id": "PH_I_MISSED_YOU",
    "text": "I missed you",
    "tags": [
      "closeness",
      "reunion"
    ],
    "slots": []
  },
  {
    "id": "PH_I_WAS_LOOKING_FOR_YOU",
    "text": "I was looking for you",
    "tags": [
      "reunion"
    ],
    "slots": []
  },
  {
    "id": "PH_WHERE_HAVE_YOU_BEEN",
    "text": "where have you been",
    "tags": [
      "reunion",
      "question"
    ],
    "slots": []
  },
  {
    "id": "PH_I_WAS_WORRIED_ABOUT_YOU",
    "text": "I was worried about you",
    "tags": [
      "care",
      "reunion"
    ],
    "slots": []
  },
  {
    "id": "PH_I_AM_GLAD_YOU_ARE_SAFE",
    "text": "I am glad you are safe",
    "tags": [
      "care",
      "positive"
    ],
    "slots": []
  }
]);
})();
