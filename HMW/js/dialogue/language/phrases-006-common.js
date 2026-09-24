(() => {
 "use strict";
 const P=window.HMW?.Dialogue?.Phrases;
 if(!P) throw new Error("Phrase registry must load first.");
 P.register([
  {
    "id": "PH_ARE_YOU_HUNGRY",
    "text": "Are you hungry?",
    "tags": [
      "care",
      "food"
    ],
    "slots": []
  },
  {
    "id": "PH_ARE_YOU_THIRSTY",
    "text": "Are you thirsty?",
    "tags": [
      "care",
      "drink"
    ],
    "slots": []
  },
  {
    "id": "PH_ARE_YOU_TIRED",
    "text": "Are you tired?",
    "tags": [
      "care",
      "rest"
    ],
    "slots": []
  },
  {
    "id": "PH_DID_YOU_EAT",
    "text": "Did you eat?",
    "tags": [
      "care",
      "food"
    ],
    "slots": []
  },
  {
    "id": "PH_HAVE_YOU_EATEN",
    "text": "Have you eaten?",
    "tags": [
      "care",
      "food"
    ],
    "slots": []
  },
  {
    "id": "PH_DO_YOU_NEED_WATER",
    "text": "Do you need water?",
    "tags": [
      "care",
      "drink"
    ],
    "slots": []
  },
  {
    "id": "PH_DO_YOU_NEED_REST",
    "text": "Do you need to rest?",
    "tags": [
      "care",
      "rest"
    ],
    "slots": []
  },
  {
    "id": "PH_YOU_SHOULD_EAT",
    "text": "You should eat something.",
    "tags": [
      "care",
      "food"
    ],
    "slots": []
  },
  {
    "id": "PH_YOU_SHOULD_DRINK",
    "text": "You should drink some water.",
    "tags": [
      "care",
      "drink"
    ],
    "slots": []
  },
  {
    "id": "PH_YOU_SHOULD_REST",
    "text": "You should rest.",
    "tags": [
      "care",
      "rest"
    ],
    "slots": []
  },
  {
    "id": "PH_I_CAN_COOK",
    "text": "I can cook something.",
    "tags": [
      "care",
      "food"
    ],
    "slots": []
  },
  {
    "id": "PH_I_CAN_GET_WATER",
    "text": "I can get you some water.",
    "tags": [
      "care",
      "drink"
    ],
    "slots": []
  },
  {
    "id": "PH_I_CAN_WAIT_OUTSIDE",
    "text": "I can wait outside.",
    "tags": [
      "boundary",
      "waiting"
    ],
    "slots": []
  },
  {
    "id": "PH_I_CAN_LEAVE",
    "text": "I can leave.",
    "tags": [
      "boundary",
      "distance"
    ],
    "slots": []
  },
  {
    "id": "PH_I_WILL_GIVE_SPACE",
    "text": "I will give you some space.",
    "tags": [
      "boundary",
      "distance"
    ],
    "slots": []
  },
  {
    "id": "PH_I_WONT_FOLLOW",
    "text": "I will not follow you.",
    "tags": [
      "boundary"
    ],
    "slots": []
  },
  {
    "id": "PH_I_WONT_TOUCH",
    "text": "I will not touch you.",
    "tags": [
      "boundary",
      "physical"
    ],
    "slots": []
  },
  {
    "id": "PH_I_WONT_KISS",
    "text": "I will not kiss you.",
    "tags": [
      "boundary",
      "physical"
    ],
    "slots": []
  },
  {
    "id": "PH_I_WONT_HUG",
    "text": "I will not hug you.",
    "tags": [
      "boundary",
      "physical"
    ],
    "slots": []
  },
  {
    "id": "PH_I_WONT_ENTER",
    "text": "I will not come in.",
    "tags": [
      "boundary"
    ],
    "slots": []
  },
  {
    "id": "PH_I_WONT_CONTACT",
    "text": "I will not contact you.",
    "tags": [
      "boundary",
      "contact"
    ],
    "slots": []
  },
  {
    "id": "PH_TELL_ME_WHEN_READY",
    "text": "Tell me when you are ready.",
    "tags": [
      "boundary",
      "clarity"
    ],
    "slots": []
  },
  {
    "id": "PH_WE_CAN_TALK_LATER",
    "text": "We can talk later.",
    "tags": [
      "boundary",
      "clarity"
    ],
    "slots": []
  },
  {
    "id": "PH_NO_RUSH",
    "text": "There is no rush.",
    "tags": [
      "boundary",
      "time"
    ],
    "slots": []
  },
  {
    "id": "PH_I_WAS_WORRIED",
    "text": "I was worried.",
    "tags": [
      "care",
      "emotion"
    ],
    "slots": []
  },
  {
    "id": "PH_I_AM_RELIEVED",
    "text": "I am relieved.",
    "tags": [
      "positive",
      "emotion"
    ],
    "slots": []
  },
  {
    "id": "PH_I_AM_GLAD_TO_SEE_YOU",
    "text": "I am glad to see you.",
    "tags": [
      "positive",
      "reunion"
    ],
    "slots": []
  },
  {
    "id": "PH_I_WANTED_TO_SEE_YOU",
    "text": "I wanted to see you.",
    "tags": [
      "closeness",
      "reunion"
    ],
    "slots": []
  },
  {
    "id": "PH_I_CAME_BACK",
    "text": "I came back.",
    "tags": [
      "reunion"
    ],
    "slots": []
  },
  {
    "id": "PH_I_THOUGHT_I_LOST_YOU",
    "text": "I thought I lost you.",
    "tags": [
      "fear",
      "affection"
    ],
    "slots": []
  },
  {
    "id": "PH_STAY_A_LITTLE_LONGER",
    "text": "Stay a little longer.",
    "tags": [
      "closeness"
    ],
    "slots": []
  },
  {
    "id": "PH_SIT_WITH_ME",
    "text": "Sit with me.",
    "tags": [
      "closeness"
    ],
    "slots": []
  },
  {
    "id": "PH_WALK_WITH_ME",
    "text": "Walk with me.",
    "tags": [
      "closeness"
    ],
    "slots": []
  },
  {
    "id": "PH_COME_WITH_ME",
    "text": "Come with me.",
    "tags": [
      "closeness"
    ],
    "slots": []
  },
  {
    "id": "PH_YOU_ARE_NOT_ALONE",
    "text": "You are not alone.",
    "tags": [
      "care",
      "closeness"
    ],
    "slots": []
  },
  {
    "id": "PH_I_CARE_ABOUT_YOU",
    "text": "I care about you.",
    "tags": [
      "care",
      "affection"
    ],
    "slots": []
  },
  {
    "id": "PH_YOU_ARE_IMPORTANT_TO_ME",
    "text": "You are important to me.",
    "tags": [
      "care",
      "affection"
    ],
    "slots": []
  },
  {
    "id": "PH_I_CHOOSE_YOU",
    "text": "I choose you.",
    "tags": [
      "affection",
      "commitment"
    ],
    "slots": []
  },
  {
    "id": "PH_I_DONT_WANT_TO_LOSE_YOU",
    "text": "I do not want to lose you.",
    "tags": [
      "fear",
      "affection"
    ],
    "slots": []
  },
  {
    "id": "PH_I_AM_NOT_LEAVING_YOU",
    "text": "I am not leaving you.",
    "tags": [
      "closeness",
      "commitment"
    ],
    "slots": []
  },
  {
    "id": "PH_I_WILL_COME_BACK",
    "text": "I will come back.",
    "tags": [
      "parting",
      "commitment"
    ],
    "slots": []
  },
  {
    "id": "PH_I_PROMISE_TO_RETURN",
    "text": "I promise I will return.",
    "tags": [
      "parting",
      "commitment"
    ],
    "slots": []
  },
  {
    "id": "PH_I_PROMISE_TO_LISTEN",
    "text": "I promise I will listen.",
    "tags": [
      "repair",
      "clarity"
    ],
    "slots": []
  },
  {
    "id": "PH_I_PROMISE_TO_BE_HONEST",
    "text": "I promise I will be honest.",
    "tags": [
      "trust",
      "commitment"
    ],
    "slots": []
  },
  {
    "id": "PH_I_WONT_LIE",
    "text": "I will not lie to you.",
    "tags": [
      "trust"
    ],
    "slots": []
  },
  {
    "id": "PH_I_WONT_BETRAY",
    "text": "I will not betray you.",
    "tags": [
      "trust"
    ],
    "slots": []
  },
  {
    "id": "PH_I_DID_NOT_BETRAY",
    "text": "I did not betray you.",
    "tags": [
      "trust"
    ],
    "slots": []
  },
  {
    "id": "PH_I_WAS_WRONG",
    "text": "I was wrong.",
    "tags": [
      "repair"
    ],
    "slots": []
  },
  {
    "id": "PH_YOU_WERE_RIGHT",
    "text": "You were right.",
    "tags": [
      "repair"
    ],
    "slots": []
  },
  {
    "id": "PH_I_SHOULD_HAVE_LISTENED",
    "text": "I should have listened.",
    "tags": [
      "repair"
    ],
    "slots": []
  },
  {
    "id": "PH_I_REGRET_THAT",
    "text": "I regret that.",
    "tags": [
      "repair"
    ],
    "slots": []
  },
  {
    "id": "PH_I_WANT_TO_FIX_THIS",
    "text": "I want to fix this.",
    "tags": [
      "repair"
    ],
    "slots": []
  },
  {
    "id": "PH_CAN_WE_FIX_THIS",
    "text": "Can we fix this?",
    "tags": [
      "repair",
      "question"
    ],
    "slots": []
  },
  {
    "id": "PH_TELL_ME_WHAT_YOU_NEED",
    "text": "Tell me what you need.",
    "tags": [
      "care",
      "request"
    ],
    "slots": []
  },
  {
    "id": "PH_TELL_ME_WHAT_YOU_WANT",
    "text": "Tell me what you want.",
    "tags": [
      "clarity",
      "request"
    ],
    "slots": []
  },
  {
    "id": "PH_I_WILL_DO_WHAT_I_CAN",
    "text": "I will do what I can.",
    "tags": [
      "care"
    ],
    "slots": []
  },
  {
    "id": "PH_I_CANT_PROMISE_THAT",
    "text": "I cannot promise that.",
    "tags": [
      "honesty",
      "boundary"
    ],
    "slots": []
  },
  {
    "id": "PH_I_DONT_KNOW_YET",
    "text": "I do not know yet.",
    "tags": [
      "uncertainty"
    ],
    "slots": []
  },
  {
    "id": "PH_LET_ME_THINK",
    "text": "Let me think.",
    "tags": [
      "decision"
    ],
    "slots": []
  },
  {
    "id": "PH_I_HAVE_DECIDED",
    "text": "I have decided.",
    "tags": [
      "decision"
    ],
    "slots": []
  },
  {
    "id": "PH_MY_ANSWER_IS_YES",
    "text": "My answer is yes.",
    "tags": [
      "answer"
    ],
    "slots": []
  },
  {
    "id": "PH_MY_ANSWER_IS_NO",
    "text": "My answer is no.",
    "tags": [
      "answer"
    ],
    "slots": []
  },
  {
    "id": "PH_NOT_NOW",
    "text": "Not now.",
    "tags": [
      "boundary",
      "time"
    ],
    "slots": []
  },
  {
    "id": "PH_MAYBE_LATER",
    "text": "Maybe later.",
    "tags": [
      "boundary",
      "time"
    ],
    "slots": []
  },
  {
    "id": "PH_WHERE_SHOULD_WE_MEET",
    "text": "Where should we meet?",
    "tags": [
      "meeting"
    ],
    "slots": []
  },
  {
    "id": "PH_WHEN_SHOULD_WE_MEET",
    "text": "When should we meet?",
    "tags": [
      "meeting"
    ],
    "slots": []
  },
  {
    "id": "PH_I_WILL_BE_THERE",
    "text": "I will be there.",
    "tags": [
      "meeting"
    ],
    "slots": []
  },
  {
    "id": "PH_I_AM_ON_MY_WAY",
    "text": "I am on my way.",
    "tags": [
      "movement"
    ],
    "slots": []
  },
  {
    "id": "PH_I_WILL_BE_LATE",
    "text": "I will be late.",
    "tags": [
      "time"
    ],
    "slots": []
  },
  {
    "id": "PH_SORRY_I_AM_LATE",
    "text": "I am sorry I am late.",
    "tags": [
      "repair",
      "time"
    ],
    "slots": []
  },
  {
    "id": "PH_WORK_WAS_HARD",
    "text": "Work was hard today.",
    "tags": [
      "work"
    ],
    "slots": []
  },
  {
    "id": "PH_I_HAVE_WORK_TOMORROW",
    "text": "I have work tomorrow.",
    "tags": [
      "work"
    ],
    "slots": []
  },
  {
    "id": "PH_I_NEED_A_JOB",
    "text": "I need a job.",
    "tags": [
      "work"
    ],
    "slots": []
  },
  {
    "id": "PH_I_FOUND_A_JOB",
    "text": "I found a job.",
    "tags": [
      "work"
    ],
    "slots": []
  },
  {
    "id": "PH_I_LOST_MY_JOB",
    "text": "I lost my job.",
    "tags": [
      "work"
    ],
    "slots": []
  },
  {
    "id": "PH_I_GOT_PAID",
    "text": "I got paid.",
    "tags": [
      "money",
      "work"
    ],
    "slots": []
  },
  {
    "id": "PH_I_NEED_TO_PAY_RENT",
    "text": "I need to pay rent.",
    "tags": [
      "money"
    ],
    "slots": []
  },
  {
    "id": "PH_I_CANT_AFFORD_IT",
    "text": "I cannot afford it.",
    "tags": [
      "money"
    ],
    "slots": []
  },
  {
    "id": "PH_I_DONT_HAVE_ENOUGH",
    "text": "I do not have enough.",
    "tags": [
      "money"
    ],
    "slots": []
  },
  {
    "id": "PH_HOW_MUCH_IS_IT",
    "text": "How much is it?",
    "tags": [
      "money",
      "question"
    ],
    "slots": []
  },
  {
    "id": "PH_THAT_IS_TOO_EXPENSIVE",
    "text": "That is too expensive.",
    "tags": [
      "money"
    ],
    "slots": []
  },
  {
    "id": "PH_I_WILL_PAY",
    "text": "I will pay.",
    "tags": [
      "money"
    ],
    "slots": []
  },
  {
    "id": "PH_WE_CAN_SHARE",
    "text": "We can share.",
    "tags": [
      "daily"
    ],
    "slots": []
  },
  {
    "id": "PH_TAKE_THIS",
    "text": "Take this.",
    "tags": [
      "offer"
    ],
    "slots": []
  },
  {
    "id": "PH_KEEP_THIS",
    "text": "Keep this.",
    "tags": [
      "offer"
    ],
    "slots": []
  },
  {
    "id": "PH_YOU_NEED_THIS",
    "text": "You need this.",
    "tags": [
      "care"
    ],
    "slots": []
  }
]);
})();