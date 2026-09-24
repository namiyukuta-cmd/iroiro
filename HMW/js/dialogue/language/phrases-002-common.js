(() => {
  "use strict";
  const P = window.HMW?.Dialogue?.Phrases;
  if (!P) throw new Error("Phrase registry must load first.");
  P.register([
  {
    "id": "PH_I_DONT_KNOW",
    "text": "I do not know",
    "tags": [
      "clarity"
    ],
    "slots": []
  },
  {
    "id": "PH_I_DONT_UNDERSTAND",
    "text": "I do not understand",
    "tags": [
      "clarity"
    ],
    "slots": []
  },
  {
    "id": "PH_I_UNDERSTAND",
    "text": "I understand",
    "tags": [
      "clarity"
    ],
    "slots": []
  },
  {
    "id": "PH_I_REMEMBER",
    "text": "I remember",
    "tags": [
      "memory"
    ],
    "slots": []
  },
  {
    "id": "PH_I_DONT_REMEMBER",
    "text": "I do not remember",
    "tags": [
      "memory"
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
    "id": "PH_I_DONT_BELIEVE_YOU",
    "text": "I do not believe you",
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
    "id": "PH_I_DONT_TRUST_YOU",
    "text": "I do not trust you",
    "tags": [
      "trust"
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
    "id": "PH_I_WANT_YOU_HERE",
    "text": "I want you here",
    "tags": [
      "closeness"
    ],
    "slots": []
  },
  {
    "id": "PH_I_WANT_TO_STAY",
    "text": "I want to stay",
    "tags": [
      "closeness"
    ],
    "slots": []
  },
  {
    "id": "PH_I_HAVE_TO_GO",
    "text": "I have to go",
    "tags": [
      "parting"
    ],
    "slots": []
  },
  {
    "id": "PH_I_DONT_WANT_TO_GO",
    "text": "I do not want to go",
    "tags": [
      "parting",
      "closeness"
    ],
    "slots": []
  },
  {
    "id": "PH_I_WILL_STAY",
    "text": "I will stay",
    "tags": [
      "closeness"
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
    "id": "PH_I_WILL_RETURN",
    "text": "I will come back",
    "tags": [
      "parting"
    ],
    "slots": []
  },
  {
    "id": "PH_I_WONT_LEAVE",
    "text": "I will not leave",
    "tags": [
      "closeness"
    ],
    "slots": []
  },
  {
    "id": "PH_I_WONT_HURT_YOU",
    "text": "I will not hurt you",
    "tags": [
      "care",
      "safety"
    ],
    "slots": []
  },
  {
    "id": "PH_I_WONT_BETRAY_YOU",
    "text": "I will not betray you",
    "tags": [
      "trust"
    ],
    "slots": []
  },
  {
    "id": "PH_I_AM_HERE",
    "text": "I am here",
    "tags": [
      "closeness"
    ],
    "slots": []
  },
  {
    "id": "PH_I_AM_STILL_HERE",
    "text": "I am still here",
    "tags": [
      "closeness"
    ],
    "slots": []
  },
  {
    "id": "PH_YOU_ARE_SAFE",
    "text": "you are safe",
    "tags": [
      "safety"
    ],
    "slots": []
  },
  {
    "id": "PH_YOU_ARE_NOT_ALONE",
    "text": "you are not alone",
    "tags": [
      "care"
    ],
    "slots": []
  },
  {
    "id": "PH_ARE_YOU_OKAY",
    "text": "are you okay",
    "tags": [
      "care",
      "question"
    ],
    "slots": []
  },
  {
    "id": "PH_ARE_YOU_HURT",
    "text": "are you hurt",
    "tags": [
      "care",
      "question"
    ],
    "slots": []
  },
  {
    "id": "PH_ARE_YOU_COLD",
    "text": "are you cold",
    "tags": [
      "care",
      "question"
    ],
    "slots": []
  },
  {
    "id": "PH_ARE_YOU_HUNGRY",
    "text": "are you hungry",
    "tags": [
      "care",
      "question"
    ],
    "slots": []
  },
  {
    "id": "PH_DID_YOU_EAT",
    "text": "did you eat",
    "tags": [
      "care",
      "question"
    ],
    "slots": []
  },
  {
    "id": "PH_DID_YOU_SLEEP",
    "text": "did you sleep",
    "tags": [
      "care",
      "question"
    ],
    "slots": []
  },
  {
    "id": "PH_WHAT_HAPPENED",
    "text": "what happened",
    "tags": [
      "clarity",
      "question"
    ],
    "slots": []
  },
  {
    "id": "PH_WHAT_DO_YOU_MEAN",
    "text": "what do you mean",
    "tags": [
      "clarity",
      "question"
    ],
    "slots": []
  },
  {
    "id": "PH_WHY_DID_YOU_SAY_THAT",
    "text": "why did you say that",
    "tags": [
      "clarity",
      "question"
    ],
    "slots": []
  },
  {
    "id": "PH_WHY_DO_YOU_THINK_THAT",
    "text": "why do you think that",
    "tags": [
      "clarity",
      "question"
    ],
    "slots": []
  },
  {
    "id": "PH_TELL_ME_WHAT_HAPPENED",
    "text": "tell me what happened",
    "tags": [
      "clarity",
      "request"
    ],
    "slots": []
  },
  {
    "id": "PH_TELL_ME_THE_TRUTH",
    "text": "tell me the truth",
    "tags": [
      "clarity",
      "request"
    ],
    "slots": []
  },
  {
    "id": "PH_TALK_TO_ME",
    "text": "talk to me",
    "tags": [
      "clarity",
      "request"
    ],
    "slots": []
  },
  {
    "id": "PH_LOOK_AT_ME",
    "text": "look at me",
    "tags": [
      "attention",
      "request"
    ],
    "slots": []
  },
  {
    "id": "PH_LISTEN_TO_ME",
    "text": "listen to me",
    "tags": [
      "attention",
      "request"
    ],
    "slots": []
  },
  {
    "id": "PH_WAIT_FOR_ME",
    "text": "wait for me",
    "tags": [
      "request"
    ],
    "slots": []
  },
  {
    "id": "PH_STAY_HERE",
    "text": "stay here",
    "tags": [
      "request",
      "closeness"
    ],
    "slots": []
  },
  {
    "id": "PH_STAY_WITH_ME",
    "text": "stay with me",
    "tags": [
      "request",
      "closeness"
    ],
    "slots": []
  },
  {
    "id": "PH_COME_WITH_ME",
    "text": "come with me",
    "tags": [
      "request",
      "closeness"
    ],
    "slots": []
  },
  {
    "id": "PH_DONT_GO",
    "text": "do not go",
    "tags": [
      "request",
      "closeness"
    ],
    "slots": []
  },
  {
    "id": "PH_DONT_LEAVE",
    "text": "do not leave",
    "tags": [
      "request",
      "closeness"
    ],
    "slots": []
  },
  {
    "id": "PH_GIVE_ME_TIME",
    "text": "give me some time",
    "tags": [
      "distance",
      "request"
    ],
    "slots": []
  },
  {
    "id": "PH_GIVE_ME_SPACE",
    "text": "give me some space",
    "tags": [
      "distance",
      "request"
    ],
    "slots": []
  },
  {
    "id": "PH_I_NEED_TIME",
    "text": "I need some time",
    "tags": [
      "distance"
    ],
    "slots": []
  },
  {
    "id": "PH_I_NEED_SPACE",
    "text": "I need some space",
    "tags": [
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
    "id": "PH_I_AM_SORRY",
    "text": "I am sorry",
    "tags": [
      "repair"
    ],
    "slots": []
  },
  {
    "id": "PH_THAT_WAS_MY_FAULT",
    "text": "that was my fault",
    "tags": [
      "repair"
    ],
    "slots": []
  },
  {
    "id": "PH_I_WAS_WRONG",
    "text": "I was wrong",
    "tags": [
      "repair"
    ],
    "slots": []
  },
  {
    "id": "PH_I_SHOULD_NOT_HAVE_DONE_THAT",
    "text": "I should not have done that",
    "tags": [
      "repair"
    ],
    "slots": []
  },
  {
    "id": "PH_CAN_YOU_FORGIVE_ME",
    "text": "can you forgive me",
    "tags": [
      "repair",
      "question"
    ],
    "slots": []
  },
  {
    "id": "PH_THANK_YOU",
    "text": "thank you",
    "tags": [
      "positive"
    ],
    "slots": []
  },
  {
    "id": "PH_THANK_YOU_FOR_HELPING",
    "text": "thank you for helping me",
    "tags": [
      "positive"
    ],
    "slots": []
  },
  {
    "id": "PH_I_APPRECIATE_IT",
    "text": "I appreciate it",
    "tags": [
      "positive"
    ],
    "slots": []
  },
  {
    "id": "PH_I_AM_GLAD",
    "text": "I am glad",
    "tags": [
      "positive"
    ],
    "slots": []
  },
  {
    "id": "PH_I_AM_HAPPY_TO_SEE_YOU",
    "text": "I am happy to see you",
    "tags": [
      "positive",
      "reunion"
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
    "id": "PH_I_WAS_WORRIED",
    "text": "I was worried",
    "tags": [
      "care",
      "emotion"
    ],
    "slots": []
  },
  {
    "id": "PH_I_AM_WORRIED_ABOUT_YOU",
    "text": "I am worried about you",
    "tags": [
      "care",
      "emotion"
    ],
    "slots": []
  },
  {
    "id": "PH_I_WAS_SCARED",
    "text": "I was scared",
    "tags": [
      "emotion"
    ],
    "slots": []
  },
  {
    "id": "PH_I_AM_ANGRY",
    "text": "I am angry",
    "tags": [
      "emotion"
    ],
    "slots": []
  },
  {
    "id": "PH_I_AM_STILL_ANGRY",
    "text": "I am still angry",
    "tags": [
      "emotion"
    ],
    "slots": []
  },
  {
    "id": "PH_THAT_HURT_ME",
    "text": "that hurt me",
    "tags": [
      "emotion"
    ],
    "slots": []
  },
  {
    "id": "PH_I_WAS_HURT",
    "text": "I was hurt",
    "tags": [
      "emotion"
    ],
    "slots": []
  },
  {
    "id": "PH_I_AM_JEALOUS",
    "text": "I am jealous",
    "tags": [
      "emotion"
    ],
    "slots": []
  },
  {
    "id": "PH_I_WAS_JEALOUS",
    "text": "I was jealous",
    "tags": [
      "emotion"
    ],
    "slots": []
  },
  {
    "id": "PH_I_AM_CONFUSED",
    "text": "I am confused",
    "tags": [
      "emotion"
    ],
    "slots": []
  },
  {
    "id": "PH_I_AM_LONELY",
    "text": "I am lonely",
    "tags": [
      "emotion"
    ],
    "slots": []
  },
  {
    "id": "PH_I_WAS_LONELY",
    "text": "I was lonely",
    "tags": [
      "emotion"
    ],
    "slots": []
  },
  {
    "id": "PH_I_AM_TIRED",
    "text": "I am tired",
    "tags": [
      "condition"
    ],
    "slots": []
  },
  {
    "id": "PH_I_AM_HUNGRY",
    "text": "I am hungry",
    "tags": [
      "condition"
    ],
    "slots": []
  },
  {
    "id": "PH_I_AM_COLD",
    "text": "I am cold",
    "tags": [
      "condition"
    ],
    "slots": []
  },
  {
    "id": "PH_I_AM_SICK",
    "text": "I am sick",
    "tags": [
      "condition"
    ],
    "slots": []
  },
  {
    "id": "PH_I_NEED_REST",
    "text": "I need some rest",
    "tags": [
      "condition"
    ],
    "slots": []
  },
  {
    "id": "PH_YOU_SHOULD_REST",
    "text": "you should rest",
    "tags": [
      "care"
    ],
    "slots": []
  },
  {
    "id": "PH_YOU_SHOULD_EAT",
    "text": "you should eat something",
    "tags": [
      "care"
    ],
    "slots": []
  },
  {
    "id": "PH_DRINK_SOME_WATER",
    "text": "drink some water",
    "tags": [
      "care",
      "request"
    ],
    "slots": []
  },
  {
    "id": "PH_LET_ME_HELP",
    "text": "let me help you",
    "tags": [
      "care",
      "offer"
    ],
    "slots": []
  },
  {
    "id": "PH_CAN_I_HELP",
    "text": "can I help you",
    "tags": [
      "care",
      "offer"
    ],
    "slots": []
  },
  {
    "id": "PH_I_CAN_HELP",
    "text": "I can help you",
    "tags": [
      "care",
      "offer"
    ],
    "slots": []
  },
  {
    "id": "PH_I_CANT_DO_THAT",
    "text": "I cannot do that",
    "tags": [
      "refusal"
    ],
    "slots": []
  },
  {
    "id": "PH_I_DONT_WANT_TO_DO_THAT",
    "text": "I do not want to do that",
    "tags": [
      "refusal"
    ],
    "slots": []
  },
  {
    "id": "PH_ALL_RIGHT_I_WILL",
    "text": "all right, I will",
    "tags": [
      "agreement"
    ],
    "slots": []
  },
  {
    "id": "PH_YES_I_CAN",
    "text": "yes, I can",
    "tags": [
      "agreement"
    ],
    "slots": []
  },
  {
    "id": "PH_NO_I_CANT",
    "text": "no, I cannot",
    "tags": [
      "refusal"
    ],
    "slots": []
  },
  {
    "id": "PH_WHO_WAS_THAT",
    "text": "who was that",
    "tags": [
      "jealousy",
      "question"
    ],
    "slots": []
  },
  {
    "id": "PH_DO_YOU_KNOW_THEM",
    "text": "do you know them",
    "tags": [
      "question"
    ],
    "slots": []
  },
  {
    "id": "PH_DO_YOU_LIKE_THEM",
    "text": "do you like them",
    "tags": [
      "jealousy",
      "question"
    ],
    "slots": []
  },
  {
    "id": "PH_DO_YOU_LOVE_ME",
    "text": "do you love me",
    "tags": [
      "affection",
      "question"
    ],
    "slots": []
  },
  {
    "id": "PH_HOW_DO_YOU_FEEL_ABOUT_ME",
    "text": "how do you feel about me",
    "tags": [
      "affection",
      "question"
    ],
    "slots": []
  },
  {
    "id": "PH_WHAT_ARE_WE",
    "text": "what are we",
    "tags": [
      "relationship",
      "question"
    ],
    "slots": []
  },
  {
    "id": "PH_I_LOVE_YOU",
    "text": "I love you",
    "tags": [
      "affection"
    ],
    "slots": []
  },
  {
    "id": "PH_I_DO_LOVE_YOU",
    "text": "I do love you",
    "tags": [
      "affection"
    ],
    "slots": []
  },
  {
    "id": "PH_I_DONT_LOVE_YOU",
    "text": "I do not love you",
    "tags": [
      "affection"
    ],
    "slots": []
  },
  {
    "id": "PH_I_LIKE_YOU",
    "text": "I like you",
    "tags": [
      "affection"
    ],
    "slots": []
  },
  {
    "id": "PH_I_WANT_TO_BE_WITH_YOU",
    "text": "I want to be with you",
    "tags": [
      "affection",
      "closeness"
    ],
    "slots": []
  },
  {
    "id": "PH_I_DONT_WANT_TO_LOSE_YOU",
    "text": "I do not want to lose you",
    "tags": [
      "affection",
      "fear"
    ],
    "slots": []
  },
  {
    "id": "PH_CAN_I_HOLD_YOUR_HAND",
    "text": "can I hold your hand",
    "tags": [
      "physical",
      "question"
    ],
    "slots": []
  },
  {
    "id": "PH_CAN_I_HUG_YOU",
    "text": "can I hug you",
    "tags": [
      "physical",
      "question"
    ],
    "slots": []
  },
  {
    "id": "PH_CAN_I_KISS_YOU",
    "text": "can I kiss you",
    "tags": [
      "physical",
      "question"
    ],
    "slots": []
  },
  {
    "id": "PH_I_WANT_TO_HOLD_YOU",
    "text": "I want to hold you",
    "tags": [
      "physical",
      "affection"
    ],
    "slots": []
  },
  {
    "id": "PH_COME_CLOSER",
    "text": "come closer",
    "tags": [
      "physical",
      "closeness"
    ],
    "slots": []
  },
  {
    "id": "PH_STEP_BACK",
    "text": "step back",
    "tags": [
      "distance"
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
    "id": "PH_RIGHT_NOW",
    "text": "right now",
    "tags": [
      "time"
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
    "id": "PH_NOT_ANYMORE",
    "text": "not anymore",
    "tags": [
      "negation"
    ],
    "slots": []
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
    "id": "PH_MORE_THAN_THAT",
    "text": "more than that",
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
    "id": "PH_MAYBE_LATER",
    "text": "maybe later",
    "tags": [
      "response"
    ],
    "slots": []
  },
  {
    "id": "PH_I_DONT_MIND",
    "text": "I do not mind",
    "tags": [
      "response"
    ],
    "slots": []
  },
  {
    "id": "PH_I_DO_MIND",
    "text": "I do mind",
    "tags": [
      "response"
    ],
    "slots": []
  }
]);
})();
