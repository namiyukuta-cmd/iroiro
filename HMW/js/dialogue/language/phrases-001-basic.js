(() => {
  "use strict";
  const P = window.HMW?.Dialogue?.Phrases;
  if (!P) throw new Error("Phrase registry must load first.");
  P.register([
  {
    "id": "PH_WANT_TO",
    "text": "want to",
    "tags": [
      "verb_chain",
      "desire"
    ],
    "slots": []
  },
  {
    "id": "PH_NEED_TO",
    "text": "need to",
    "tags": [
      "verb_chain",
      "need"
    ],
    "slots": []
  },
  {
    "id": "PH_HAVE_TO",
    "text": "have to",
    "tags": [
      "verb_chain",
      "obligation"
    ],
    "slots": []
  },
  {
    "id": "PH_GOING_TO",
    "text": "be going to",
    "tags": [
      "future",
      "intention"
    ],
    "slots": []
  },
  {
    "id": "PH_TRY_TO",
    "text": "try to",
    "tags": [
      "verb_chain"
    ],
    "slots": []
  },
  {
    "id": "PH_START_TO",
    "text": "start to",
    "tags": [
      "verb_chain"
    ],
    "slots": []
  },
  {
    "id": "PH_KEEP_ING",
    "text": "keep {VERB_ING}",
    "tags": [
      "verb_chain"
    ],
    "slots": [
      "VERB_ING"
    ]
  },
  {
    "id": "PH_COME_BACK",
    "text": "come back",
    "tags": [
      "movement",
      "return"
    ],
    "slots": []
  },
  {
    "id": "PH_GO_BACK",
    "text": "go back",
    "tags": [
      "movement",
      "return"
    ],
    "slots": []
  },
  {
    "id": "PH_GO_AWAY",
    "text": "go away",
    "tags": [
      "movement",
      "distance"
    ],
    "slots": []
  },
  {
    "id": "PH_STAY_HERE",
    "text": "stay here",
    "tags": [
      "closeness"
    ],
    "slots": []
  },
  {
    "id": "PH_STAY_WITH",
    "text": "stay with {OBJECT}",
    "tags": [
      "closeness"
    ],
    "slots": [
      "OBJECT"
    ]
  },
  {
    "id": "PH_WAIT_FOR",
    "text": "wait for {OBJECT}",
    "tags": [
      "waiting"
    ],
    "slots": [
      "OBJECT"
    ]
  },
  {
    "id": "PH_LOOK_AT",
    "text": "look at {OBJECT}",
    "tags": [
      "attention"
    ],
    "slots": [
      "OBJECT"
    ]
  },
  {
    "id": "PH_LOOK_FOR",
    "text": "look for {OBJECT}",
    "tags": [
      "search"
    ],
    "slots": [
      "OBJECT"
    ]
  },
  {
    "id": "PH_LISTEN_TO",
    "text": "listen to {OBJECT}",
    "tags": [
      "attention"
    ],
    "slots": [
      "OBJECT"
    ]
  },
  {
    "id": "PH_TALK_TO",
    "text": "talk to {OBJECT}",
    "tags": [
      "speech"
    ],
    "slots": [
      "OBJECT"
    ]
  },
  {
    "id": "PH_TALK_ABOUT",
    "text": "talk about {OBJECT}",
    "tags": [
      "speech"
    ],
    "slots": [
      "OBJECT"
    ]
  },
  {
    "id": "PH_THINK_ABOUT",
    "text": "think about {OBJECT}",
    "tags": [
      "thought"
    ],
    "slots": [
      "OBJECT"
    ]
  },
  {
    "id": "PH_CARE_ABOUT",
    "text": "care about {OBJECT}",
    "tags": [
      "care"
    ],
    "slots": [
      "OBJECT"
    ]
  },
  {
    "id": "PH_WORRY_ABOUT",
    "text": "worry about {OBJECT}",
    "tags": [
      "worry"
    ],
    "slots": [
      "OBJECT"
    ]
  },
  {
    "id": "PH_ASK_ABOUT",
    "text": "ask about {OBJECT}",
    "tags": [
      "question"
    ],
    "slots": [
      "OBJECT"
    ]
  },
  {
    "id": "PH_TELL_ABOUT",
    "text": "tell {OBJECT} about {TOPIC}",
    "tags": [
      "speech"
    ],
    "slots": [
      "OBJECT",
      "TOPIC"
    ]
  },
  {
    "id": "PH_BE_AFRAID_OF",
    "text": "be afraid of {OBJECT}",
    "tags": [
      "fear"
    ],
    "slots": [
      "OBJECT"
    ]
  },
  {
    "id": "PH_BE_ANGRY_WITH",
    "text": "be angry with {OBJECT}",
    "tags": [
      "anger"
    ],
    "slots": [
      "OBJECT"
    ]
  },
  {
    "id": "PH_BE_ANGRY_ABOUT",
    "text": "be angry about {OBJECT}",
    "tags": [
      "anger"
    ],
    "slots": [
      "OBJECT"
    ]
  },
  {
    "id": "PH_BE_WORRIED_ABOUT",
    "text": "be worried about {OBJECT}",
    "tags": [
      "worry"
    ],
    "slots": [
      "OBJECT"
    ]
  },
  {
    "id": "PH_BE_HAPPY_TO",
    "text": "be happy to {VERB}",
    "tags": [
      "positive"
    ],
    "slots": [
      "VERB"
    ]
  },
  {
    "id": "PH_BE_GLAD_TO",
    "text": "be glad to {VERB}",
    "tags": [
      "positive"
    ],
    "slots": [
      "VERB"
    ]
  },
  {
    "id": "PH_BE_SORRY_FOR",
    "text": "be sorry for {OBJECT}",
    "tags": [
      "repair"
    ],
    "slots": [
      "OBJECT"
    ]
  },
  {
    "id": "PH_LEAVE_ALONE",
    "text": "leave {OBJECT} alone",
    "tags": [
      "distance"
    ],
    "slots": [
      "OBJECT"
    ]
  },
  {
    "id": "PH_STAY_CLOSE",
    "text": "stay close to {OBJECT}",
    "tags": [
      "closeness"
    ],
    "slots": [
      "OBJECT"
    ]
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
    "id": "PH_HELP_WITH",
    "text": "help {OBJECT} with {TOPIC}",
    "tags": [
      "care"
    ],
    "slots": [
      "OBJECT",
      "TOPIC"
    ]
  },
  {
    "id": "PH_GIVE_SPACE",
    "text": "give {OBJECT} some space",
    "tags": [
      "distance"
    ],
    "slots": [
      "OBJECT"
    ]
  },
  {
    "id": "PH_GIVE_TIME",
    "text": "give {OBJECT} some time",
    "tags": [
      "distance"
    ],
    "slots": [
      "OBJECT"
    ]
  },
  {
    "id": "PH_TELL_TRUTH",
    "text": "tell {OBJECT} the truth",
    "tags": [
      "clarity"
    ],
    "slots": [
      "OBJECT"
    ]
  },
  {
    "id": "PH_KEEP_PROMISE",
    "text": "keep a promise",
    "tags": [
      "trust"
    ],
    "slots": []
  },
  {
    "id": "PH_BREAK_PROMISE",
    "text": "break a promise",
    "tags": [
      "trust"
    ],
    "slots": []
  },
  {
    "id": "PH_CHANGE_MIND",
    "text": "change {POSSESSIVE} mind",
    "tags": [
      "decision"
    ],
    "slots": [
      "POSSESSIVE"
    ]
  },
  {
    "id": "PH_MAKE_SURE",
    "text": "make sure",
    "tags": [
      "clarity"
    ],
    "slots": []
  },
  {
    "id": "PH_FIND_OUT",
    "text": "find out",
    "tags": [
      "clarity"
    ],
    "slots": []
  },
  {
    "id": "PH_CALM_DOWN",
    "text": "calm down",
    "tags": [
      "emotion"
    ],
    "slots": []
  },
  {
    "id": "PH_SIT_DOWN",
    "text": "sit down",
    "tags": [
      "movement"
    ],
    "slots": []
  },
  {
    "id": "PH_STAND_UP",
    "text": "stand up",
    "tags": [
      "movement"
    ],
    "slots": []
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
    "id": "PH_GO_TO_SLEEP",
    "text": "go to sleep",
    "tags": [
      "daily"
    ],
    "slots": []
  },
  {
    "id": "PH_GET_REST",
    "text": "get some rest",
    "tags": [
      "daily"
    ],
    "slots": []
  },
  {
    "id": "PH_GET_WARM",
    "text": "get warm",
    "tags": [
      "daily"
    ],
    "slots": []
  },
  {
    "id": "PH_GET_COLD",
    "text": "get cold",
    "tags": [
      "daily"
    ],
    "slots": []
  },
  {
    "id": "PH_EAT_SOMETHING",
    "text": "eat something",
    "tags": [
      "daily",
      "food"
    ],
    "slots": []
  },
  {
    "id": "PH_DRINK_WATER",
    "text": "drink some water",
    "tags": [
      "daily",
      "water"
    ],
    "slots": []
  },
  {
    "id": "PH_HAVE_BREAKFAST",
    "text": "have breakfast",
    "tags": [
      "daily",
      "food"
    ],
    "slots": []
  },
  {
    "id": "PH_HAVE_LUNCH",
    "text": "have lunch",
    "tags": [
      "daily",
      "food"
    ],
    "slots": []
  },
  {
    "id": "PH_HAVE_DINNER",
    "text": "have dinner",
    "tags": [
      "daily",
      "food"
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
    "id": "PH_GET_TO_WORK",
    "text": "get to work",
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
    "id": "PH_FIND_WORK",
    "text": "find work",
    "tags": [
      "work"
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
    "id": "PH_RUN_OUT_OF",
    "text": "run out of {OBJECT}",
    "tags": [
      "resource"
    ],
    "slots": [
      "OBJECT"
    ]
  },
  {
    "id": "PH_BE_OUT_OF",
    "text": "be out of {OBJECT}",
    "tags": [
      "resource"
    ],
    "slots": [
      "OBJECT"
    ]
  },
  {
    "id": "PH_COME_WITH",
    "text": "come with {OBJECT}",
    "tags": [
      "closeness",
      "movement"
    ],
    "slots": [
      "OBJECT"
    ]
  },
  {
    "id": "PH_GO_WITH",
    "text": "go with {OBJECT}",
    "tags": [
      "closeness",
      "movement"
    ],
    "slots": [
      "OBJECT"
    ]
  },
  {
    "id": "PH_HOLD_HAND",
    "text": "hold {POSSESSIVE} hand",
    "tags": [
      "physical"
    ],
    "slots": [
      "POSSESSIVE"
    ]
  },
  {
    "id": "PH_PUT_ARM_AROUND",
    "text": "put an arm around {OBJECT}",
    "tags": [
      "physical"
    ],
    "slots": [
      "OBJECT"
    ]
  },
  {
    "id": "PH_LOOK_AWAY",
    "text": "look away",
    "tags": [
      "reaction"
    ],
    "slots": []
  },
  {
    "id": "PH_LOOK_BACK",
    "text": "look back",
    "tags": [
      "reaction"
    ],
    "slots": []
  },
  {
    "id": "PH_TAKE_STEP_BACK",
    "text": "take a step back",
    "tags": [
      "distance"
    ],
    "slots": []
  },
  {
    "id": "PH_STEP_CLOSER",
    "text": "step closer",
    "tags": [
      "closeness"
    ],
    "slots": []
  },
  {
    "id": "PH_TURN_AWAY",
    "text": "turn away",
    "tags": [
      "reaction"
    ],
    "slots": []
  },
  {
    "id": "PH_COME_CLOSER",
    "text": "come closer",
    "tags": [
      "closeness"
    ],
    "slots": []
  },
  {
    "id": "PH_NOT_ANYMORE",
    "text": "not anymore",
    "tags": [
      "negation"
    ],
    "slots": []
  },
  {
    "id": "PH_NOT_YET",
    "text": "not yet",
    "tags": [
      "time",
      "negation"
    ],
    "slots": []
  },
  {
    "id": "PH_RIGHT_NOW",
    "text": "right now",
    "tags": [
      "time"
    ],
    "slots": []
  },
  {
    "id": "PH_FOR_NOW",
    "text": "for now",
    "tags": [
      "time"
    ],
    "slots": []
  },
  {
    "id": "PH_A_LITTLE",
    "text": "a little",
    "tags": [
      "degree"
    ],
    "slots": []
  },
  {
    "id": "PH_A_LOT",
    "text": "a lot",
    "tags": [
      "degree"
    ],
    "slots": []
  },
  {
    "id": "PH_TOO_MUCH",
    "text": "too much",
    "tags": [
      "degree"
    ],
    "slots": []
  },
  {
    "id": "PH_MORE_THAN",
    "text": "more than {OBJECT}",
    "tags": [
      "comparison"
    ],
    "slots": [
      "OBJECT"
    ]
  },
  {
    "id": "PH_AS_LONG_AS",
    "text": "as long as {CLAUSE}",
    "tags": [
      "condition"
    ],
    "slots": [
      "CLAUSE"
    ]
  },
  {
    "id": "PH_EVEN_IF",
    "text": "even if {CLAUSE}",
    "tags": [
      "condition"
    ],
    "slots": [
      "CLAUSE"
    ]
  },
  {
    "id": "PH_BECAUSE_OF",
    "text": "because of {OBJECT}",
    "tags": [
      "reason"
    ],
    "slots": [
      "OBJECT"
    ]
  },
  {
    "id": "PH_AT_LEAST",
    "text": "at least",
    "tags": [
      "degree"
    ],
    "slots": []
  },
  {
    "id": "PH_OF_COURSE",
    "text": "of course",
    "tags": [
      "response"
    ],
    "slots": []
  },
  {
    "id": "PH_ALL_RIGHT",
    "text": "all right",
    "tags": [
      "response"
    ],
    "slots": []
  },
  {
    "id": "PH_I_MEAN",
    "text": "I mean",
    "tags": [
      "discourse"
    ],
    "slots": []
  },
  {
    "id": "PH_YOU_KNOW",
    "text": "you know",
    "tags": [
      "discourse"
    ],
    "slots": []
  },
  {
    "id": "PH_TELL_ME",
    "text": "tell me",
    "tags": [
      "speech",
      "request"
    ],
    "slots": []
  },
  {
    "id": "PH_TRUST_ME",
    "text": "trust me",
    "tags": [
      "trust",
      "request"
    ],
    "slots": []
  },
  {
    "id": "PH_BELIEVE_ME",
    "text": "believe me",
    "tags": [
      "trust",
      "request"
    ],
    "slots": []
  },
  {
    "id": "PH_LISTEN_TO_ME",
    "text": "listen to me",
    "tags": [
      "speech",
      "request"
    ],
    "slots": []
  },
  {
    "id": "PH_WAIT_FOR_ME",
    "text": "wait for me",
    "tags": [
      "waiting",
      "request"
    ],
    "slots": []
  },
  {
    "id": "PH_COME_WITH_ME",
    "text": "come with me",
    "tags": [
      "movement",
      "request"
    ],
    "slots": []
  },
  {
    "id": "PH_STAY_WITH_ME",
    "text": "stay with me",
    "tags": [
      "closeness",
      "request"
    ],
    "slots": []
  },
  {
    "id": "PH_DONT_GO",
    "text": "do not go",
    "tags": [
      "distance",
      "request"
    ],
    "slots": []
  },
  {
    "id": "PH_DONT_LEAVE",
    "text": "do not leave",
    "tags": [
      "distance",
      "request"
    ],
    "slots": []
  }
]);
})();
