(() => {
 "use strict";
 const P=window.HMW?.Dialogue?.Phrases;
 if(!P) throw new Error("Phrase registry must load first.");
 P.register([
  {
    "id": "PH_I_NEED_TO_FILL_OUT_A_FORM",
    "text": "I need to fill out a form.",
    "tags": [
      "admin"
    ],
    "slots": []
  },
  {
    "id": "PH_I_NEED_TO_SIGN_THIS",
    "text": "I need to sign this.",
    "tags": [
      "admin"
    ],
    "slots": []
  },
  {
    "id": "PH_I_HAVE_AN_APPOINTMENT",
    "text": "I have an appointment.",
    "tags": [
      "admin",
      "health"
    ],
    "slots": []
  },
  {
    "id": "PH_I_MISSED_MY_APPOINTMENT",
    "text": "I missed my appointment.",
    "tags": [
      "admin",
      "health"
    ],
    "slots": []
  },
  {
    "id": "PH_I_NEED_A_PERMIT",
    "text": "I need a permit.",
    "tags": [
      "admin"
    ],
    "slots": []
  },
  {
    "id": "PH_I_HAVE_A_LICENSE",
    "text": "I have a license.",
    "tags": [
      "admin"
    ],
    "slots": []
  },
  {
    "id": "PH_I_DONT_HAVE_A_LICENSE",
    "text": "I do not have a license.",
    "tags": [
      "admin"
    ],
    "slots": []
  },
  {
    "id": "PH_WHERE_IS_THE_OFFICE",
    "text": "Where is the office?",
    "tags": [
      "place",
      "admin"
    ],
    "slots": []
  },
  {
    "id": "PH_WHERE_IS_THE_STATION",
    "text": "Where is the station?",
    "tags": [
      "place",
      "travel"
    ],
    "slots": []
  },
  {
    "id": "PH_WHERE_IS_THE_HOSPITAL",
    "text": "Where is the hospital?",
    "tags": [
      "place",
      "health"
    ],
    "slots": []
  },
  {
    "id": "PH_WHERE_IS_THE_PHARMACY",
    "text": "Where is the pharmacy?",
    "tags": [
      "place",
      "health"
    ],
    "slots": []
  },
  {
    "id": "PH_WHERE_IS_THE_BATHROOM",
    "text": "Where is the bathroom?",
    "tags": [
      "place",
      "daily"
    ],
    "slots": []
  },
  {
    "id": "PH_WHERE_CAN_I_BUY_THIS",
    "text": "Where can I buy this?",
    "tags": [
      "shopping",
      "question"
    ],
    "slots": []
  },
  {
    "id": "PH_DO_YOU_SELL_THIS",
    "text": "Do you sell this?",
    "tags": [
      "shopping",
      "question"
    ],
    "slots": []
  },
  {
    "id": "PH_I_WANT_TO_BUY_THIS",
    "text": "I want to buy this.",
    "tags": [
      "shopping"
    ],
    "slots": []
  },
  {
    "id": "PH_I_WANT_TO_RETURN_THIS",
    "text": "I want to return this.",
    "tags": [
      "shopping"
    ],
    "slots": []
  },
  {
    "id": "PH_CAN_I_GET_A_REFUND",
    "text": "Can I get a refund?",
    "tags": [
      "shopping",
      "money"
    ],
    "slots": []
  },
  {
    "id": "PH_DO_YOU_HAVE_A_SMALLER_SIZE",
    "text": "Do you have a smaller size?",
    "tags": [
      "shopping"
    ],
    "slots": []
  },
  {
    "id": "PH_DO_YOU_HAVE_A_LARGER_SIZE",
    "text": "Do you have a larger size?",
    "tags": [
      "shopping"
    ],
    "slots": []
  },
  {
    "id": "PH_THIS_DOES_NOT_FIT",
    "text": "This does not fit.",
    "tags": [
      "shopping"
    ],
    "slots": []
  },
  {
    "id": "PH_WHERE_IS_THE_PLATFORM",
    "text": "Where is the platform?",
    "tags": [
      "travel",
      "question"
    ],
    "slots": []
  },
  {
    "id": "PH_WHAT_TIME_DOES_IT_LEAVE",
    "text": "What time does it leave?",
    "tags": [
      "travel",
      "time"
    ],
    "slots": []
  },
  {
    "id": "PH_WHAT_TIME_DOES_IT_ARRIVE",
    "text": "What time does it arrive?",
    "tags": [
      "travel",
      "time"
    ],
    "slots": []
  },
  {
    "id": "PH_IS_THIS_THE_RIGHT_TRAIN",
    "text": "Is this the right train?",
    "tags": [
      "travel",
      "question"
    ],
    "slots": []
  },
  {
    "id": "PH_DO_I_NEED_TO_TRANSFER",
    "text": "Do I need to transfer?",
    "tags": [
      "travel",
      "question"
    ],
    "slots": []
  },
  {
    "id": "PH_MY_TRAIN_IS_DELAYED",
    "text": "My train is delayed.",
    "tags": [
      "travel"
    ],
    "slots": []
  },
  {
    "id": "PH_MY_FLIGHT_WAS_CANCELLED",
    "text": "My flight was cancelled.",
    "tags": [
      "travel"
    ],
    "slots": []
  },
  {
    "id": "PH_I_LOST_MY_TICKET",
    "text": "I lost my ticket.",
    "tags": [
      "travel"
    ],
    "slots": []
  },
  {
    "id": "PH_I_LOST_MY_PASSPORT",
    "text": "I lost my passport.",
    "tags": [
      "travel"
    ],
    "slots": []
  },
  {
    "id": "PH_I_NEED_DIRECTIONS",
    "text": "I need directions.",
    "tags": [
      "travel",
      "place"
    ],
    "slots": []
  },
  {
    "id": "PH_I_AM_LOST",
    "text": "I am lost.",
    "tags": [
      "travel",
      "place"
    ],
    "slots": []
  },
  {
    "id": "PH_TURN_LEFT_HERE",
    "text": "Turn left here.",
    "tags": [
      "direction"
    ],
    "slots": []
  },
  {
    "id": "PH_TURN_RIGHT_HERE",
    "text": "Turn right here.",
    "tags": [
      "direction"
    ],
    "slots": []
  },
  {
    "id": "PH_GO_STRAIGHT_AHEAD",
    "text": "Go straight ahead.",
    "tags": [
      "direction"
    ],
    "slots": []
  },
  {
    "id": "PH_IT_IS_NEARBY",
    "text": "It is nearby.",
    "tags": [
      "place"
    ],
    "slots": []
  },
  {
    "id": "PH_IT_IS_FAR_AWAY",
    "text": "It is far away.",
    "tags": [
      "place"
    ],
    "slots": []
  },
  {
    "id": "PH_I_NEED_A_DOCTOR",
    "text": "I need a doctor.",
    "tags": [
      "health"
    ],
    "slots": []
  },
  {
    "id": "PH_I_NEED_MEDICINE",
    "text": "I need medicine.",
    "tags": [
      "health"
    ],
    "slots": []
  },
  {
    "id": "PH_I_HAVE_A_FEVER",
    "text": "I have a fever.",
    "tags": [
      "health"
    ],
    "slots": []
  },
  {
    "id": "PH_I_HAVE_A_HEADACHE",
    "text": "I have a headache.",
    "tags": [
      "health"
    ],
    "slots": []
  },
  {
    "id": "PH_MY_STOMACH_HURTS",
    "text": "My stomach hurts.",
    "tags": [
      "health"
    ],
    "slots": []
  },
  {
    "id": "PH_I_FEEL_DIZZY",
    "text": "I feel dizzy.",
    "tags": [
      "health"
    ],
    "slots": []
  },
  {
    "id": "PH_I_FEEL_SICK",
    "text": "I feel sick.",
    "tags": [
      "health"
    ],
    "slots": []
  },
  {
    "id": "PH_I_FEEL_BETTER_NOW",
    "text": "I feel better now.",
    "tags": [
      "health"
    ],
    "slots": []
  },
  {
    "id": "PH_I_AM_RECOVERING",
    "text": "I am recovering.",
    "tags": [
      "health"
    ],
    "slots": []
  },
  {
    "id": "PH_DOES_IT_HURT",
    "text": "Does it hurt?",
    "tags": [
      "health",
      "question"
    ],
    "slots": []
  },
  {
    "id": "PH_WHERE_DOES_IT_HURT",
    "text": "Where does it hurt?",
    "tags": [
      "health",
      "question"
    ],
    "slots": []
  },
  {
    "id": "PH_TAKE_THIS_MEDICINE",
    "text": "Take this medicine.",
    "tags": [
      "health"
    ],
    "slots": []
  },
  {
    "id": "PH_YOU_NEED_TO_REST",
    "text": "You need to rest.",
    "tags": [
      "health",
      "care"
    ],
    "slots": []
  },
  {
    "id": "PH_I_HAVE_AN_INTERVIEW",
    "text": "I have an interview.",
    "tags": [
      "work"
    ],
    "slots": []
  },
  {
    "id": "PH_I_GOT_THE_JOB",
    "text": "I got the job.",
    "tags": [
      "work"
    ],
    "slots": []
  },
  {
    "id": "PH_I_DID_NOT_GET_THE_JOB",
    "text": "I did not get the job.",
    "tags": [
      "work"
    ],
    "slots": []
  },
  {
    "id": "PH_I_WAS_HIRED",
    "text": "I was hired.",
    "tags": [
      "work"
    ],
    "slots": []
  },
  {
    "id": "PH_I_WAS_FIRED",
    "text": "I was fired.",
    "tags": [
      "work"
    ],
    "slots": []
  },
  {
    "id": "PH_I_RESIGNED",
    "text": "I resigned.",
    "tags": [
      "work"
    ],
    "slots": []
  },
  {
    "id": "PH_I_AM_LOOKING_FOR_WORK",
    "text": "I am looking for work.",
    "tags": [
      "work"
    ],
    "slots": []
  },
  {
    "id": "PH_WHEN_DO_YOU_START_WORK",
    "text": "When do you start work?",
    "tags": [
      "work",
      "time"
    ],
    "slots": []
  },
  {
    "id": "PH_WHEN_DO_YOU_FINISH_WORK",
    "text": "When do you finish work?",
    "tags": [
      "work",
      "time"
    ],
    "slots": []
  },
  {
    "id": "PH_I_START_AT_NINE",
    "text": "I start at nine.",
    "tags": [
      "work",
      "time"
    ],
    "slots": []
  },
  {
    "id": "PH_I_FINISH_AT_FIVE",
    "text": "I finish at five.",
    "tags": [
      "work",
      "time"
    ],
    "slots": []
  },
  {
    "id": "PH_I_WORK_PART_TIME",
    "text": "I work part-time.",
    "tags": [
      "work"
    ],
    "slots": []
  },
  {
    "id": "PH_I_WORK_FULL_TIME",
    "text": "I work full-time.",
    "tags": [
      "work"
    ],
    "slots": []
  },
  {
    "id": "PH_I_AM_SELF_EMPLOYED",
    "text": "I am self-employed.",
    "tags": [
      "work"
    ],
    "slots": []
  },
  {
    "id": "PH_I_RENT_THIS_ROOM",
    "text": "I rent this room.",
    "tags": [
      "home"
    ],
    "slots": []
  },
  {
    "id": "PH_I_LIVE_WITH_A_ROOMMATE",
    "text": "I live with a roommate.",
    "tags": [
      "home"
    ],
    "slots": []
  },
  {
    "id": "PH_THE_RENT_IS_TOO_HIGH",
    "text": "The rent is too high.",
    "tags": [
      "home",
      "money"
    ],
    "slots": []
  },
  {
    "id": "PH_THE_HEATER_IS_BROKEN",
    "text": "The heater is broken.",
    "tags": [
      "home"
    ],
    "slots": []
  },
  {
    "id": "PH_THE_WATER_IS_NOT_WORKING",
    "text": "The water is not working.",
    "tags": [
      "home"
    ],
    "slots": []
  },
  {
    "id": "PH_I_NEED_TO_CALL_THE_LANDLORD",
    "text": "I need to call the landlord.",
    "tags": [
      "home"
    ],
    "slots": []
  },
  {
    "id": "PH_CAN_YOU_FIX_THIS",
    "text": "Can you fix this?",
    "tags": [
      "home",
      "request"
    ],
    "slots": []
  },
  {
    "id": "PH_I_WILL_FIX_IT",
    "text": "I will fix it.",
    "tags": [
      "home",
      "answer"
    ],
    "slots": []
  },
  {
    "id": "PH_I_CANNOT_FIX_IT",
    "text": "I cannot fix it.",
    "tags": [
      "home",
      "answer"
    ],
    "slots": []
  },
  {
    "id": "PH_WE_HAD_AN_ARGUMENT",
    "text": "We had an argument.",
    "tags": [
      "relationship"
    ],
    "slots": []
  },
  {
    "id": "PH_IT_WAS_A_MISUNDERSTANDING",
    "text": "It was a misunderstanding.",
    "tags": [
      "relationship"
    ],
    "slots": []
  },
  {
    "id": "PH_I_DONT_WANT_TO_ARGUE",
    "text": "I do not want to argue.",
    "tags": [
      "relationship"
    ],
    "slots": []
  },
  {
    "id": "PH_I_WANT_TO_EXPLAIN",
    "text": "I want to explain.",
    "tags": [
      "relationship",
      "clarity"
    ],
    "slots": []
  },
  {
    "id": "PH_I_WANT_TO_APOLOGIZE",
    "text": "I want to apologize.",
    "tags": [
      "relationship",
      "repair"
    ],
    "slots": []
  },
  {
    "id": "PH_I_ACCEPT_YOUR_APOLOGY",
    "text": "I accept your apology.",
    "tags": [
      "relationship",
      "repair"
    ],
    "slots": []
  },
  {
    "id": "PH_I_NEED_TIME_TO_FORGIVE",
    "text": "I need time to forgive.",
    "tags": [
      "relationship",
      "repair"
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
    "id": "PH_I_DONT_TRUST_YOU_YET",
    "text": "I do not trust you yet.",
    "tags": [
      "relationship",
      "trust"
    ],
    "slots": []
  },
  {
    "id": "PH_I_BELIEVE_YOU",
    "text": "I believe you.",
    "tags": [
      "relationship",
      "trust"
    ],
    "slots": []
  },
  {
    "id": "PH_I_DONT_BELIEVE_YOU",
    "text": "I do not believe you.",
    "tags": [
      "relationship",
      "trust"
    ],
    "slots": []
  },
  {
    "id": "PH_I_WANT_TO_STAY_FRIENDS",
    "text": "I want to stay friends.",
    "tags": [
      "relationship"
    ],
    "slots": []
  },
  {
    "id": "PH_I_WANT_MORE_THAN_FRIENDSHIP",
    "text": "I want more than friendship.",
    "tags": [
      "relationship",
      "romance"
    ],
    "slots": []
  },
  {
    "id": "PH_I_NEED_SOME_DISTANCE",
    "text": "I need some distance.",
    "tags": [
      "relationship",
      "boundary"
    ],
    "slots": []
  },
  {
    "id": "PH_I_NEED_YOU_CLOSE",
    "text": "I need you close.",
    "tags": [
      "relationship",
      "closeness"
    ],
    "slots": []
  },
  {
    "id": "PH_I_AM_PROUD_OF_YOU",
    "text": "I am proud of you.",
    "tags": [
      "positive"
    ],
    "slots": []
  },
  {
    "id": "PH_I_AM_DISAPPOINTED",
    "text": "I am disappointed.",
    "tags": [
      "emotion"
    ],
    "slots": []
  },
  {
    "id": "PH_I_AM_EMBARRASSED",
    "text": "I am embarrassed.",
    "tags": [
      "emotion"
    ],
    "slots": []
  },
  {
    "id": "PH_I_AM_FRUSTRATED",
    "text": "I am frustrated.",
    "tags": [
      "emotion"
    ],
    "slots": []
  },
  {
    "id": "PH_I_AM_GRATEFUL",
    "text": "I am grateful.",
    "tags": [
      "emotion"
    ],
    "slots": []
  },
  {
    "id": "PH_I_AM_NERVOUS",
    "text": "I am nervous.",
    "tags": [
      "emotion"
    ],
    "slots": []
  },
  {
    "id": "PH_I_AM_CONFIDENT",
    "text": "I am confident.",
    "tags": [
      "emotion"
    ],
    "slots": []
  }
]);
})();