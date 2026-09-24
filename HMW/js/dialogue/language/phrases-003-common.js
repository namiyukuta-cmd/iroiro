(() => {
  "use strict";
  const P = window.HMW?.Dialogue?.Phrases;
  if (!P) throw new Error("Phrase registry must load first.");
  P.register([
  {
    "id": "PH_DO_YOU_MEAN",
    "text": "do you mean {CLAUSE}",
    "tags": [
      "clarity"
    ],
    "slots": [
      "CLAUSE"
    ]
  },
  {
    "id": "PH_ARE_YOU_SAYING",
    "text": "are you saying {CLAUSE}",
    "tags": [
      "clarity"
    ],
    "slots": [
      "CLAUSE"
    ]
  },
  {
    "id": "PH_I_MEANT",
    "text": "I meant {CLAUSE}",
    "tags": [
      "clarity"
    ],
    "slots": [
      "CLAUSE"
    ]
  },
  {
    "id": "PH_I_DID_NOT_MEAN",
    "text": "I did not mean {CLAUSE}",
    "tags": [
      "clarity"
    ],
    "slots": [
      "CLAUSE"
    ]
  },
  {
    "id": "PH_THAT_IS_NOT_TRUE",
    "text": "that is not true",
    "tags": [
      "clarity",
      "denial"
    ],
    "slots": []
  },
  {
    "id": "PH_THAT_IS_TRUE",
    "text": "that is true",
    "tags": [
      "clarity",
      "confirmation"
    ],
    "slots": []
  },
  {
    "id": "PH_YOU_ARE_RIGHT",
    "text": "you are right",
    "tags": [
      "agreement"
    ],
    "slots": []
  },
  {
    "id": "PH_YOU_ARE_WRONG",
    "text": "you are wrong",
    "tags": [
      "disagreement"
    ],
    "slots": []
  },
  {
    "id": "PH_I_AGREE",
    "text": "I agree",
    "tags": [
      "agreement"
    ],
    "slots": []
  },
  {
    "id": "PH_I_DISAGREE",
    "text": "I disagree",
    "tags": [
      "disagreement"
    ],
    "slots": []
  },
  {
    "id": "PH_I_AM_NOT_SURE",
    "text": "I am not sure",
    "tags": [
      "uncertainty"
    ],
    "slots": []
  },
  {
    "id": "PH_I_AM_SURE",
    "text": "I am sure",
    "tags": [
      "certainty"
    ],
    "slots": []
  },
  {
    "id": "PH_I_PROMISE",
    "text": "I promise",
    "tags": [
      "trust"
    ],
    "slots": []
  },
  {
    "id": "PH_KEEP_YOUR_PROMISE",
    "text": "keep your promise",
    "tags": [
      "trust",
      "request"
    ],
    "slots": []
  },
  {
    "id": "PH_DONT_LIE_TO_ME",
    "text": "do not lie to me",
    "tags": [
      "trust",
      "request"
    ],
    "slots": []
  },
  {
    "id": "PH_I_AM_NOT_LYING",
    "text": "I am not lying",
    "tags": [
      "trust"
    ],
    "slots": []
  },
  {
    "id": "PH_TELL_ME_HONESTLY",
    "text": "tell me honestly",
    "tags": [
      "clarity",
      "request"
    ],
    "slots": []
  },
  {
    "id": "PH_I_WANT_THE_TRUTH",
    "text": "I want the truth",
    "tags": [
      "clarity"
    ],
    "slots": []
  },
  {
    "id": "PH_I_WANT_AN_ANSWER",
    "text": "I want an answer",
    "tags": [
      "clarity"
    ],
    "slots": []
  },
  {
    "id": "PH_ANSWER_ME",
    "text": "answer me",
    "tags": [
      "clarity",
      "request"
    ],
    "slots": []
  },
  {
    "id": "PH_I_NEED_TO_KNOW",
    "text": "I need to know",
    "tags": [
      "clarity"
    ],
    "slots": []
  },
  {
    "id": "PH_I_DONT_NEED_TO_KNOW",
    "text": "I do not need to know",
    "tags": [
      "clarity"
    ],
    "slots": []
  },
  {
    "id": "PH_IT_MATTERS_TO_ME",
    "text": "it matters to me",
    "tags": [
      "emotion"
    ],
    "slots": []
  },
  {
    "id": "PH_IT_DOES_NOT_MATTER",
    "text": "it does not matter",
    "tags": [
      "emotion"
    ],
    "slots": []
  },
  {
    "id": "PH_THIS_IS_IMPORTANT",
    "text": "this is important",
    "tags": [
      "clarity"
    ],
    "slots": []
  },
  {
    "id": "PH_THIS_IS_NOT_EASY",
    "text": "this is not easy",
    "tags": [
      "emotion"
    ],
    "slots": []
  },
  {
    "id": "PH_I_AM_TRYING",
    "text": "I am trying",
    "tags": [
      "effort"
    ],
    "slots": []
  },
  {
    "id": "PH_I_CANT_PROMISE",
    "text": "I cannot promise that",
    "tags": [
      "trust",
      "refusal"
    ],
    "slots": []
  },
  {
    "id": "PH_I_CAN_PROMISE",
    "text": "I can promise that",
    "tags": [
      "trust"
    ],
    "slots": []
  },
  {
    "id": "PH_I_NEED_YOUR_TRUST",
    "text": "I need your trust",
    "tags": [
      "trust",
      "closeness"
    ],
    "slots": []
  },
  {
    "id": "PH_I_WANT_YOUR_TRUST",
    "text": "I want your trust",
    "tags": [
      "trust",
      "closeness"
    ],
    "slots": []
  },
  {
    "id": "PH_I_NEED_YOU_TO_BELIEVE_ME",
    "text": "I need you to believe me",
    "tags": [
      "trust",
      "request"
    ],
    "slots": []
  },
  {
    "id": "PH_I_WANT_YOU_TO_BELIEVE_ME",
    "text": "I want you to believe me",
    "tags": [
      "trust",
      "request"
    ],
    "slots": []
  },
  {
    "id": "PH_I_DONT_WANT_TO_ARGUE",
    "text": "I do not want to argue",
    "tags": [
      "conflict"
    ],
    "slots": []
  },
  {
    "id": "PH_WE_NEED_TO_TALK",
    "text": "we need to talk",
    "tags": [
      "clarity"
    ],
    "slots": []
  },
  {
    "id": "PH_WE_CAN_TALK_LATER",
    "text": "we can talk later",
    "tags": [
      "clarity",
      "time"
    ],
    "slots": []
  },
  {
    "id": "PH_NOT_RIGHT_NOW",
    "text": "not right now",
    "tags": [
      "time",
      "refusal"
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
    "id": "PH_STAY_FOR_A_WHILE",
    "text": "stay for a while",
    "tags": [
      "closeness",
      "request"
    ],
    "slots": []
  },
  {
    "id": "PH_STAY_A_LITTLE_LONGER",
    "text": "stay a little longer",
    "tags": [
      "closeness",
      "request"
    ],
    "slots": []
  },
  {
    "id": "PH_DONT_LEAVE_YET",
    "text": "do not leave yet",
    "tags": [
      "closeness",
      "request"
    ],
    "slots": []
  },
  {
    "id": "PH_I_WANT_MORE_TIME",
    "text": "I want more time with you",
    "tags": [
      "closeness"
    ],
    "slots": []
  },
  {
    "id": "PH_I_NEED_SOME_DISTANCE",
    "text": "I need some distance",
    "tags": [
      "distance"
    ],
    "slots": []
  },
  {
    "id": "PH_I_WILL_GIVE_YOU_SPACE",
    "text": "I will give you some space",
    "tags": [
      "distance"
    ],
    "slots": []
  },
  {
    "id": "PH_I_WILL_NOT_FOLLOW_YOU",
    "text": "I will not follow you",
    "tags": [
      "boundary"
    ],
    "slots": []
  },
  {
    "id": "PH_I_WILL_NOT_TOUCH_YOU",
    "text": "I will not touch you",
    "tags": [
      "boundary",
      "physical"
    ],
    "slots": []
  },
  {
    "id": "PH_I_WILL_NOT_KISS_YOU",
    "text": "I will not kiss you",
    "tags": [
      "boundary",
      "physical"
    ],
    "slots": []
  },
  {
    "id": "PH_I_WILL_NOT_HUG_YOU",
    "text": "I will not hug you",
    "tags": [
      "boundary",
      "physical"
    ],
    "slots": []
  },
  {
    "id": "PH_I_WILL_NOT_CONTACT_YOU",
    "text": "I will not contact you",
    "tags": [
      "boundary"
    ],
    "slots": []
  },
  {
    "id": "PH_I_WILL_STOP",
    "text": "I will stop",
    "tags": [
      "boundary"
    ],
    "slots": []
  },
  {
    "id": "PH_I_RESPECT_THAT",
    "text": "I respect that",
    "tags": [
      "boundary",
      "respect"
    ],
    "slots": []
  },
  {
    "id": "PH_I_HEAR_YOU",
    "text": "I hear you",
    "tags": [
      "clarity",
      "respect"
    ],
    "slots": []
  },
  {
    "id": "PH_I_WONT_PUSH",
    "text": "I will not push you",
    "tags": [
      "boundary",
      "respect"
    ],
    "slots": []
  },
  {
    "id": "PH_I_WILL_WAIT_UNTIL_YOU_ARE_READY",
    "text": "I will wait until you are ready",
    "tags": [
      "boundary",
      "waiting"
    ],
    "slots": []
  },
  {
    "id": "PH_I_CHOOSE_YOU",
    "text": "I choose you",
    "tags": [
      "affection",
      "commitment"
    ],
    "slots": []
  },
  {
    "id": "PH_I_STILL_CHOOSE_YOU",
    "text": "I still choose you",
    "tags": [
      "affection",
      "commitment"
    ],
    "slots": []
  },
  {
    "id": "PH_I_WANT_US",
    "text": "I want us to be together",
    "tags": [
      "affection",
      "commitment"
    ],
    "slots": []
  },
  {
    "id": "PH_I_WANT_THIS_RELATIONSHIP",
    "text": "I want this relationship",
    "tags": [
      "relationship",
      "commitment"
    ],
    "slots": []
  },
  {
    "id": "PH_I_DONT_WANT_THIS_RELATIONSHIP",
    "text": "I do not want this relationship",
    "tags": [
      "relationship",
      "rejection"
    ],
    "slots": []
  },
  {
    "id": "PH_I_NEED_TO_THINK_ABOUT_US",
    "text": "I need to think about us",
    "tags": [
      "relationship",
      "uncertainty"
    ],
    "slots": []
  },
  {
    "id": "PH_I_DONT_KNOW_WHAT_WE_ARE",
    "text": "I do not know what we are",
    "tags": [
      "relationship",
      "uncertainty"
    ],
    "slots": []
  },
  {
    "id": "PH_I_KNOW_WHAT_I_FEEL",
    "text": "I know what I feel",
    "tags": [
      "affection",
      "certainty"
    ],
    "slots": []
  },
  {
    "id": "PH_I_DONT_KNOW_WHAT_I_FEEL",
    "text": "I do not know what I feel",
    "tags": [
      "affection",
      "uncertainty"
    ],
    "slots": []
  },
  {
    "id": "PH_I_CARE_ABOUT_YOU",
    "text": "I care about you",
    "tags": [
      "affection",
      "care"
    ],
    "slots": []
  },
  {
    "id": "PH_YOU_MATTER_TO_ME",
    "text": "you matter to me",
    "tags": [
      "affection",
      "care"
    ],
    "slots": []
  },
  {
    "id": "PH_YOU_ARE_IMPORTANT_TO_ME",
    "text": "you are important to me",
    "tags": [
      "affection",
      "care"
    ],
    "slots": []
  },
  {
    "id": "PH_I_NEED_YOU_NEAR",
    "text": "I need you near me",
    "tags": [
      "closeness"
    ],
    "slots": []
  },
  {
    "id": "PH_I_WANT_YOU_CLOSE",
    "text": "I want you close to me",
    "tags": [
      "closeness"
    ],
    "slots": []
  },
  {
    "id": "PH_I_DONT_WANT_YOU_TO_GO",
    "text": "I do not want you to go",
    "tags": [
      "closeness"
    ],
    "slots": []
  },
  {
    "id": "PH_I_DONT_WANT_TO_BE_ALONE",
    "text": "I do not want to be alone",
    "tags": [
      "loneliness"
    ],
    "slots": []
  },
  {
    "id": "PH_I_HATED_BEING_APART",
    "text": "I hated being apart from you",
    "tags": [
      "separation"
    ],
    "slots": []
  },
  {
    "id": "PH_I_WAS_AFRAID_YOU_WOULD_NOT_RETURN",
    "text": "I was afraid you would not come back",
    "tags": [
      "fear",
      "separation"
    ],
    "slots": []
  },
  {
    "id": "PH_I_THOUGHT_I_LOST_YOU",
    "text": "I thought I lost you",
    "tags": [
      "fear",
      "separation"
    ],
    "slots": []
  },
  {
    "id": "PH_I_WAS_LOOKING_FOR_YOU",
    "text": "I was looking for you",
    "tags": [
      "reunion",
      "search"
    ],
    "slots": []
  },
  {
    "id": "PH_I_WAITED_FOR_YOU",
    "text": "I waited for you",
    "tags": [
      "reunion",
      "waiting"
    ],
    "slots": []
  },
  {
    "id": "PH_I_WANTED_TO_SEE_YOU",
    "text": "I wanted to see you",
    "tags": [
      "reunion",
      "affection"
    ],
    "slots": []
  },
  {
    "id": "PH_I_AM_RELIEVED",
    "text": "I am relieved",
    "tags": [
      "positive"
    ],
    "slots": []
  },
  {
    "id": "PH_I_AM_GLAD_YOU_ARE_HERE",
    "text": "I am glad you are here",
    "tags": [
      "positive",
      "reunion"
    ],
    "slots": []
  },
  {
    "id": "PH_I_AM_GLAD_YOU_CAME_BACK",
    "text": "I am glad you came back",
    "tags": [
      "positive",
      "reunion"
    ],
    "slots": []
  },
  {
    "id": "PH_YOU_SCARED_ME",
    "text": "you scared me",
    "tags": [
      "fear",
      "emotion"
    ],
    "slots": []
  },
  {
    "id": "PH_DONT_DO_THAT_AGAIN",
    "text": "do not do that again",
    "tags": [
      "boundary",
      "request"
    ],
    "slots": []
  },
  {
    "id": "PH_I_DONT_LIKE_THAT",
    "text": "I do not like that",
    "tags": [
      "dislike"
    ],
    "slots": []
  },
  {
    "id": "PH_I_LIKE_THAT",
    "text": "I like that",
    "tags": [
      "positive"
    ],
    "slots": []
  },
  {
    "id": "PH_I_WANT_THAT",
    "text": "I want that",
    "tags": [
      "desire"
    ],
    "slots": []
  },
  {
    "id": "PH_I_DONT_WANT_THAT",
    "text": "I do not want that",
    "tags": [
      "refusal"
    ],
    "slots": []
  },
  {
    "id": "PH_CAN_WE_TRY_AGAIN",
    "text": "can we try again",
    "tags": [
      "repair",
      "question"
    ],
    "slots": []
  },
  {
    "id": "PH_I_WANT_TO_FIX_THIS",
    "text": "I want to fix this",
    "tags": [
      "repair"
    ],
    "slots": []
  },
  {
    "id": "PH_I_DONT_WANT_TO_END_THIS",
    "text": "I do not want to end this",
    "tags": [
      "repair",
      "relationship"
    ],
    "slots": []
  },
  {
    "id": "PH_I_AM_NOT_READY_TO_FORGIVE",
    "text": "I am not ready to forgive you",
    "tags": [
      "repair",
      "hurt"
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
    "id": "PH_I_NEED_AN_APOLOGY",
    "text": "I need an apology",
    "tags": [
      "repair",
      "request"
    ],
    "slots": []
  },
  {
    "id": "PH_THAT_WAS_NOT_OKAY",
    "text": "that was not okay",
    "tags": [
      "boundary",
      "hurt"
    ],
    "slots": []
  },
  {
    "id": "PH_DONT_SPEAK_TO_ME_LIKE_THAT",
    "text": "do not speak to me like that",
    "tags": [
      "boundary",
      "conflict"
    ],
    "slots": []
  },
  {
    "id": "PH_I_DONT_WANT_TO_FIGHT",
    "text": "I do not want to fight",
    "tags": [
      "conflict"
    ],
    "slots": []
  },
  {
    "id": "PH_I_AM_TOO_ANGRY_TO_TALK",
    "text": "I am too angry to talk right now",
    "tags": [
      "conflict",
      "emotion"
    ],
    "slots": []
  },
  {
    "id": "PH_I_NEED_TO_CALM_DOWN",
    "text": "I need to calm down",
    "tags": [
      "conflict",
      "emotion"
    ],
    "slots": []
  },
  {
    "id": "PH_I_WILL_TALK_WHEN_I_AM_READY",
    "text": "I will talk when I am ready",
    "tags": [
      "conflict",
      "boundary"
    ],
    "slots": []
  },
  {
    "id": "PH_CAN_I_SIT_WITH_YOU",
    "text": "can I sit with you",
    "tags": [
      "closeness",
      "question"
    ],
    "slots": []
  },
  {
    "id": "PH_CAN_I_STAY_HERE",
    "text": "can I stay here",
    "tags": [
      "closeness",
      "question"
    ],
    "slots": []
  },
  {
    "id": "PH_CAN_I_COME_WITH_YOU",
    "text": "can I come with you",
    "tags": [
      "closeness",
      "question"
    ],
    "slots": []
  },
  {
    "id": "PH_DO_YOU_WANT_ME_HERE",
    "text": "do you want me here",
    "tags": [
      "closeness",
      "question"
    ],
    "slots": []
  },
  {
    "id": "PH_DO_YOU_WANT_ME_TO_GO",
    "text": "do you want me to go",
    "tags": [
      "distance",
      "question"
    ],
    "slots": []
  },
  {
    "id": "PH_SHOULD_I_LEAVE",
    "text": "should I leave",
    "tags": [
      "distance",
      "question"
    ],
    "slots": []
  },
  {
    "id": "PH_I_CAN_LEAVE_IF_YOU_WANT",
    "text": "I can leave if you want",
    "tags": [
      "distance"
    ],
    "slots": []
  },
  {
    "id": "PH_I_WILL_STAY_IF_YOU_WANT",
    "text": "I will stay if you want",
    "tags": [
      "closeness"
    ],
    "slots": []
  },
  {
    "id": "PH_I_HAVE_FOOD",
    "text": "I have some food",
    "tags": [
      "daily",
      "food"
    ],
    "slots": []
  },
  {
    "id": "PH_I_HAVE_WATER",
    "text": "I have some water",
    "tags": [
      "daily",
      "water"
    ],
    "slots": []
  },
  {
    "id": "PH_EAT_THIS",
    "text": "eat this",
    "tags": [
      "daily",
      "food",
      "request"
    ],
    "slots": []
  },
  {
    "id": "PH_DRINK_THIS",
    "text": "drink this",
    "tags": [
      "daily",
      "water",
      "request"
    ],
    "slots": []
  },
  {
    "id": "PH_YOU_NEED_TO_EAT",
    "text": "you need to eat",
    "tags": [
      "care",
      "food"
    ],
    "slots": []
  },
  {
    "id": "PH_YOU_NEED_TO_DRINK",
    "text": "you need to drink",
    "tags": [
      "care",
      "water"
    ],
    "slots": []
  },
  {
    "id": "PH_YOU_NEED_TO_REST",
    "text": "you need to rest",
    "tags": [
      "care",
      "rest"
    ],
    "slots": []
  },
  {
    "id": "PH_YOU_LOOK_TIRED",
    "text": "you look tired",
    "tags": [
      "care",
      "condition"
    ],
    "slots": []
  },
  {
    "id": "PH_YOU_LOOK_COLD",
    "text": "you look cold",
    "tags": [
      "care",
      "condition"
    ],
    "slots": []
  },
  {
    "id": "PH_YOU_LOOK_SICK",
    "text": "you look sick",
    "tags": [
      "care",
      "condition"
    ],
    "slots": []
  },
  {
    "id": "PH_LETS_FIND_SHELTER",
    "text": "let us find shelter",
    "tags": [
      "care",
      "safety"
    ],
    "slots": []
  },
  {
    "id": "PH_WE_SHOULD_GET_INSIDE",
    "text": "we should get inside",
    "tags": [
      "care",
      "safety"
    ],
    "slots": []
  },
  {
    "id": "PH_STAY_OUT_OF_THE_RAIN",
    "text": "stay out of the rain",
    "tags": [
      "care",
      "weather"
    ],
    "slots": []
  }
]);
})();
