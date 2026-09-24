(() => {
 "use strict";
 const P=window.HMW?.Dialogue?.Phrases;
 if(!P) throw new Error("Phrase registry must load first.");
 P.register([
  {
    "id": "PH_WHERE_ARE_YOU_NOW",
    "text": "Where are you now?",
    "tags": [
      "place",
      "question"
    ],
    "slots": []
  },
  {
    "id": "PH_WHERE_DO_YOU_LIVE",
    "text": "Where do you live?",
    "tags": [
      "home",
      "question"
    ],
    "slots": []
  },
  {
    "id": "PH_WHERE_DO_YOU_WORK",
    "text": "Where do you work?",
    "tags": [
      "work",
      "question"
    ],
    "slots": []
  },
  {
    "id": "PH_WHERE_DID_YOU_FIND_IT",
    "text": "Where did you find it?",
    "tags": [
      "place",
      "question"
    ],
    "slots": []
  },
  {
    "id": "PH_WHERE_SHOULD_I_GO",
    "text": "Where should I go?",
    "tags": [
      "place",
      "question"
    ],
    "slots": []
  },
  {
    "id": "PH_WHEN_DID_YOU_ARRIVE",
    "text": "When did you arrive?",
    "tags": [
      "time",
      "question"
    ],
    "slots": []
  },
  {
    "id": "PH_WHEN_ARE_YOU_FREE",
    "text": "When are you free?",
    "tags": [
      "time",
      "question"
    ],
    "slots": []
  },
  {
    "id": "PH_WHEN_DOES_WORK_END",
    "text": "When does work end?",
    "tags": [
      "work",
      "time"
    ],
    "slots": []
  },
  {
    "id": "PH_WHEN_CAN_WE_TALK",
    "text": "When can we talk?",
    "tags": [
      "time",
      "clarity"
    ],
    "slots": []
  },
  {
    "id": "PH_WHEN_CAN_I_SEE_YOU",
    "text": "When can I see you?",
    "tags": [
      "time",
      "closeness"
    ],
    "slots": []
  },
  {
    "id": "PH_HOW_LONG_WILL_YOU_STAY",
    "text": "How long will you stay?",
    "tags": [
      "time",
      "closeness"
    ],
    "slots": []
  },
  {
    "id": "PH_HOW_LONG_HAVE_YOU_BEEN_HERE",
    "text": "How long have you been here?",
    "tags": [
      "time",
      "place"
    ],
    "slots": []
  },
  {
    "id": "PH_HOW_FAR_IS_IT",
    "text": "How far is it?",
    "tags": [
      "distance",
      "question"
    ],
    "slots": []
  },
  {
    "id": "PH_HOW_MUCH_DO_YOU_NEED",
    "text": "How much do you need?",
    "tags": [
      "money",
      "question"
    ],
    "slots": []
  },
  {
    "id": "PH_HOW_MANY_DO_YOU_HAVE",
    "text": "How many do you have?",
    "tags": [
      "quantity",
      "question"
    ],
    "slots": []
  },
  {
    "id": "PH_WHICH_ONE_DO_YOU_WANT",
    "text": "Which one do you want?",
    "tags": [
      "choice",
      "question"
    ],
    "slots": []
  },
  {
    "id": "PH_WHICH_DO_YOU_PREFER",
    "text": "Which do you prefer?",
    "tags": [
      "preference",
      "question"
    ],
    "slots": []
  },
  {
    "id": "PH_WHO_IS_THAT",
    "text": "Who is that?",
    "tags": [
      "person",
      "question"
    ],
    "slots": []
  },
  {
    "id": "PH_WHO_TOLD_YOU",
    "text": "Who told you?",
    "tags": [
      "person",
      "question"
    ],
    "slots": []
  },
  {
    "id": "PH_WHO_ARE_YOU_MEETING",
    "text": "Who are you meeting?",
    "tags": [
      "meeting",
      "question"
    ],
    "slots": []
  },
  {
    "id": "PH_DO_YOU_HAVE_TIME",
    "text": "Do you have time?",
    "tags": [
      "time",
      "question"
    ],
    "slots": []
  },
  {
    "id": "PH_DO_YOU_HAVE_MONEY",
    "text": "Do you have money?",
    "tags": [
      "money",
      "question"
    ],
    "slots": []
  },
  {
    "id": "PH_DO_YOU_HAVE_FOOD",
    "text": "Do you have food?",
    "tags": [
      "food",
      "question"
    ],
    "slots": []
  },
  {
    "id": "PH_DO_YOU_HAVE_WATER",
    "text": "Do you have water?",
    "tags": [
      "water",
      "question"
    ],
    "slots": []
  },
  {
    "id": "PH_DO_YOU_HAVE_A_PLACE_TO_STAY",
    "text": "Do you have a place to stay?",
    "tags": [
      "home",
      "question"
    ],
    "slots": []
  },
  {
    "id": "PH_DO_YOU_HAVE_WORK_TODAY",
    "text": "Do you have work today?",
    "tags": [
      "work",
      "question"
    ],
    "slots": []
  },
  {
    "id": "PH_DO_YOU_WANT_TO_GO",
    "text": "Do you want to go?",
    "tags": [
      "movement",
      "question"
    ],
    "slots": []
  },
  {
    "id": "PH_DO_YOU_WANT_TO_STAY",
    "text": "Do you want to stay?",
    "tags": [
      "closeness",
      "question"
    ],
    "slots": []
  },
  {
    "id": "PH_DO_YOU_WANT_TO_EAT",
    "text": "Do you want to eat?",
    "tags": [
      "food",
      "question"
    ],
    "slots": []
  },
  {
    "id": "PH_DO_YOU_WANT_TO_DRINK",
    "text": "Do you want something to drink?",
    "tags": [
      "water",
      "question"
    ],
    "slots": []
  },
  {
    "id": "PH_DO_YOU_WANT_TO_REST",
    "text": "Do you want to rest?",
    "tags": [
      "rest",
      "question"
    ],
    "slots": []
  },
  {
    "id": "PH_DO_YOU_WANT_COMPANY",
    "text": "Do you want company?",
    "tags": [
      "closeness",
      "question"
    ],
    "slots": []
  },
  {
    "id": "PH_CAN_YOU_COME",
    "text": "Can you come?",
    "tags": [
      "meeting",
      "question"
    ],
    "slots": []
  },
  {
    "id": "PH_CAN_YOU_WAIT",
    "text": "Can you wait?",
    "tags": [
      "waiting",
      "question"
    ],
    "slots": []
  },
  {
    "id": "PH_CAN_YOU_STAY",
    "text": "Can you stay?",
    "tags": [
      "closeness",
      "question"
    ],
    "slots": []
  },
  {
    "id": "PH_CAN_YOU_HELP",
    "text": "Can you help me?",
    "tags": [
      "help",
      "question"
    ],
    "slots": []
  },
  {
    "id": "PH_CAN_YOU_EXPLAIN",
    "text": "Can you explain?",
    "tags": [
      "clarity",
      "question"
    ],
    "slots": []
  },
  {
    "id": "PH_CAN_YOU_SHOW_ME",
    "text": "Can you show me?",
    "tags": [
      "clarity",
      "question"
    ],
    "slots": []
  },
  {
    "id": "PH_CAN_YOU_TELL_ME_WHERE",
    "text": "Can you tell me where it is?",
    "tags": [
      "place",
      "question"
    ],
    "slots": []
  },
  {
    "id": "PH_CAN_YOU_TELL_ME_WHEN",
    "text": "Can you tell me when?",
    "tags": [
      "time",
      "question"
    ],
    "slots": []
  },
  {
    "id": "PH_I_HAVE_TIME",
    "text": "I have time.",
    "tags": [
      "time"
    ],
    "slots": []
  },
  {
    "id": "PH_I_DONT_HAVE_TIME",
    "text": "I do not have time.",
    "tags": [
      "time"
    ],
    "slots": []
  },
  {
    "id": "PH_I_HAVE_MONEY",
    "text": "I have money.",
    "tags": [
      "money"
    ],
    "slots": []
  },
  {
    "id": "PH_I_DONT_HAVE_MONEY",
    "text": "I do not have money.",
    "tags": [
      "money"
    ],
    "slots": []
  },
  {
    "id": "PH_I_HAVE_FOOD",
    "text": "I have food.",
    "tags": [
      "food"
    ],
    "slots": []
  },
  {
    "id": "PH_I_DONT_HAVE_FOOD",
    "text": "I do not have food.",
    "tags": [
      "food"
    ],
    "slots": []
  },
  {
    "id": "PH_I_HAVE_WATER",
    "text": "I have water.",
    "tags": [
      "water"
    ],
    "slots": []
  },
  {
    "id": "PH_I_DONT_HAVE_WATER",
    "text": "I do not have water.",
    "tags": [
      "water"
    ],
    "slots": []
  },
  {
    "id": "PH_I_HAVE_A_PLACE_TO_STAY",
    "text": "I have a place to stay.",
    "tags": [
      "home"
    ],
    "slots": []
  },
  {
    "id": "PH_I_DONT_HAVE_A_PLACE_TO_STAY",
    "text": "I do not have a place to stay.",
    "tags": [
      "home"
    ],
    "slots": []
  },
  {
    "id": "PH_I_HAVE_WORK",
    "text": "I have work.",
    "tags": [
      "work"
    ],
    "slots": []
  },
  {
    "id": "PH_I_DONT_HAVE_WORK",
    "text": "I do not have work.",
    "tags": [
      "work"
    ],
    "slots": []
  },
  {
    "id": "PH_I_CAN_GO",
    "text": "I can go.",
    "tags": [
      "movement"
    ],
    "slots": []
  },
  {
    "id": "PH_I_CANNOT_GO",
    "text": "I cannot go.",
    "tags": [
      "movement"
    ],
    "slots": []
  },
  {
    "id": "PH_I_CAN_STAY",
    "text": "I can stay.",
    "tags": [
      "closeness"
    ],
    "slots": []
  },
  {
    "id": "PH_I_CANNOT_STAY",
    "text": "I cannot stay.",
    "tags": [
      "closeness"
    ],
    "slots": []
  },
  {
    "id": "PH_I_CAN_WAIT",
    "text": "I can wait.",
    "tags": [
      "waiting"
    ],
    "slots": []
  },
  {
    "id": "PH_I_CANNOT_WAIT",
    "text": "I cannot wait.",
    "tags": [
      "waiting"
    ],
    "slots": []
  },
  {
    "id": "PH_I_CAN_HELP",
    "text": "I can help.",
    "tags": [
      "help"
    ],
    "slots": []
  },
  {
    "id": "PH_I_CANNOT_HELP",
    "text": "I cannot help.",
    "tags": [
      "help"
    ],
    "slots": []
  },
  {
    "id": "PH_I_CAN_AFFORD_IT",
    "text": "I can afford it.",
    "tags": [
      "money"
    ],
    "slots": []
  },
  {
    "id": "PH_I_CANNOT_AFFORD_IT",
    "text": "I cannot afford it.",
    "tags": [
      "money"
    ],
    "slots": []
  },
  {
    "id": "PH_I_WANT_THIS_ONE",
    "text": "I want this one.",
    "tags": [
      "choice"
    ],
    "slots": []
  },
  {
    "id": "PH_I_WANT_THE_OTHER_ONE",
    "text": "I want the other one.",
    "tags": [
      "choice"
    ],
    "slots": []
  },
  {
    "id": "PH_I_PREFER_THIS_ONE",
    "text": "I prefer this one.",
    "tags": [
      "preference"
    ],
    "slots": []
  },
  {
    "id": "PH_I_PREFER_THE_OTHER_ONE",
    "text": "I prefer the other one.",
    "tags": [
      "preference"
    ],
    "slots": []
  },
  {
    "id": "PH_I_DONT_MIND",
    "text": "I do not mind.",
    "tags": [
      "preference"
    ],
    "slots": []
  },
  {
    "id": "PH_EITHER_IS_FINE",
    "text": "Either is fine.",
    "tags": [
      "preference"
    ],
    "slots": []
  },
  {
    "id": "PH_BOTH_ARE_FINE",
    "text": "Both are fine.",
    "tags": [
      "preference"
    ],
    "slots": []
  },
  {
    "id": "PH_NEITHER_IS_GOOD",
    "text": "Neither is good.",
    "tags": [
      "preference"
    ],
    "slots": []
  },
  {
    "id": "PH_I_WILL_GO_TOMORROW",
    "text": "I will go tomorrow.",
    "tags": [
      "plan",
      "movement"
    ],
    "slots": []
  },
  {
    "id": "PH_I_WILL_GO_TONIGHT",
    "text": "I will go tonight.",
    "tags": [
      "plan",
      "movement"
    ],
    "slots": []
  },
  {
    "id": "PH_I_WILL_STAY_HOME",
    "text": "I will stay home.",
    "tags": [
      "plan",
      "home"
    ],
    "slots": []
  },
  {
    "id": "PH_I_WILL_WORK_TOMORROW",
    "text": "I will work tomorrow.",
    "tags": [
      "plan",
      "work"
    ],
    "slots": []
  },
  {
    "id": "PH_I_WILL_REST_TODAY",
    "text": "I will rest today.",
    "tags": [
      "plan",
      "rest"
    ],
    "slots": []
  },
  {
    "id": "PH_I_WILL_CALL_LATER",
    "text": "I will call later.",
    "tags": [
      "plan",
      "contact"
    ],
    "slots": []
  },
  {
    "id": "PH_I_WILL_WAIT_UNTIL_TOMORROW",
    "text": "I will wait until tomorrow.",
    "tags": [
      "plan",
      "waiting"
    ],
    "slots": []
  },
  {
    "id": "PH_I_AM_GOING_HOME",
    "text": "I am going home.",
    "tags": [
      "movement",
      "home"
    ],
    "slots": []
  },
  {
    "id": "PH_I_AM_GOING_TO_WORK",
    "text": "I am going to work.",
    "tags": [
      "movement",
      "work"
    ],
    "slots": []
  },
  {
    "id": "PH_I_AM_GOING_OUT",
    "text": "I am going out.",
    "tags": [
      "movement"
    ],
    "slots": []
  },
  {
    "id": "PH_I_AM_COMING_BACK",
    "text": "I am coming back.",
    "tags": [
      "movement",
      "return"
    ],
    "slots": []
  },
  {
    "id": "PH_I_JUST_ARRIVED",
    "text": "I just arrived.",
    "tags": [
      "arrival"
    ],
    "slots": []
  },
  {
    "id": "PH_I_ALREADY_ATE",
    "text": "I already ate.",
    "tags": [
      "food"
    ],
    "slots": []
  },
  {
    "id": "PH_I_HAVE_NOT_EATEN_YET",
    "text": "I have not eaten yet.",
    "tags": [
      "food"
    ],
    "slots": []
  },
  {
    "id": "PH_I_ALREADY_PAID",
    "text": "I already paid.",
    "tags": [
      "money"
    ],
    "slots": []
  },
  {
    "id": "PH_I_HAVE_NOT_PAID_YET",
    "text": "I have not paid yet.",
    "tags": [
      "money"
    ],
    "slots": []
  },
  {
    "id": "PH_I_ALREADY_CALLED",
    "text": "I already called.",
    "tags": [
      "contact"
    ],
    "slots": []
  },
  {
    "id": "PH_I_HAVE_NOT_CALLED_YET",
    "text": "I have not called yet.",
    "tags": [
      "contact"
    ],
    "slots": []
  },
  {
    "id": "PH_I_KNOW_THE_PLACE",
    "text": "I know the place.",
    "tags": [
      "place"
    ],
    "slots": []
  },
  {
    "id": "PH_I_DONT_KNOW_THE_PLACE",
    "text": "I do not know the place.",
    "tags": [
      "place"
    ],
    "slots": []
  },
  {
    "id": "PH_I_KNOW_THE_WAY",
    "text": "I know the way.",
    "tags": [
      "place"
    ],
    "slots": []
  },
  {
    "id": "PH_I_DONT_KNOW_THE_WAY",
    "text": "I do not know the way.",
    "tags": [
      "place"
    ],
    "slots": []
  },
  {
    "id": "PH_SHOW_ME_THE_WAY",
    "text": "Show me the way.",
    "tags": [
      "place",
      "request"
    ],
    "slots": []
  },
  {
    "id": "PH_TELL_ME_THE_ADDRESS",
    "text": "Tell me the address.",
    "tags": [
      "place",
      "request"
    ],
    "slots": []
  },
  {
    "id": "PH_WRITE_IT_DOWN",
    "text": "Write it down.",
    "tags": [
      "clarity",
      "request"
    ],
    "slots": []
  },
  {
    "id": "PH_SAY_IT_AGAIN",
    "text": "Say it again.",
    "tags": [
      "clarity",
      "request"
    ],
    "slots": []
  },
  {
    "id": "PH_SPEAK_SLOWLY",
    "text": "Speak slowly.",
    "tags": [
      "clarity",
      "request"
    ],
    "slots": []
  },
  {
    "id": "PH_I_HEARD_YOU",
    "text": "I heard you.",
    "tags": [
      "clarity"
    ],
    "slots": []
  },
  {
    "id": "PH_I_DID_NOT_HEAR_YOU",
    "text": "I did not hear you.",
    "tags": [
      "clarity"
    ],
    "slots": []
  },
  {
    "id": "PH_I_UNDERSTOOD",
    "text": "I understood.",
    "tags": [
      "clarity"
    ],
    "slots": []
  },
  {
    "id": "PH_I_DID_NOT_UNDERSTAND",
    "text": "I did not understand.",
    "tags": [
      "clarity"
    ],
    "slots": []
  },
  {
    "id": "PH_THAT_ANSWERED_MY_QUESTION",
    "text": "That answered my question.",
    "tags": [
      "clarity"
    ],
    "slots": []
  },
  {
    "id": "PH_THAT_DID_NOT_ANSWER_MY_QUESTION",
    "text": "That did not answer my question.",
    "tags": [
      "clarity"
    ],
    "slots": []
  }
]);
})();