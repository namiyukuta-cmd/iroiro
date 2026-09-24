(() => {
  "use strict";
  const P = window.HMW?.Dialogue?.Phrases;
  if (!P) throw new Error("Phrase registry must load first.");
  P.register([
  {
    "id": "PH_WHAT_ARE_YOU_DOING",
    "text": "what are you doing",
    "tags": [
      "question",
      "daily"
    ],
    "slots": []
  },
  {
    "id": "PH_WHAT_ARE_YOU_THINKING",
    "text": "what are you thinking",
    "tags": [
      "question",
      "clarity"
    ],
    "slots": []
  },
  {
    "id": "PH_WHAT_DO_YOU_WANT",
    "text": "what do you want",
    "tags": [
      "question",
      "desire"
    ],
    "slots": []
  },
  {
    "id": "PH_WHAT_DO_YOU_NEED",
    "text": "what do you need",
    "tags": [
      "question",
      "need"
    ],
    "slots": []
  },
  {
    "id": "PH_WHERE_ARE_YOU_GOING",
    "text": "where are you going",
    "tags": [
      "question",
      "movement"
    ],
    "slots": []
  },
  {
    "id": "PH_WHERE_DID_YOU_GO",
    "text": "where did you go",
    "tags": [
      "question",
      "movement"
    ],
    "slots": []
  },
  {
    "id": "PH_WHEN_ARE_YOU_LEAVING",
    "text": "when are you leaving",
    "tags": [
      "question",
      "parting"
    ],
    "slots": []
  },
  {
    "id": "PH_WHEN_WILL_YOU_RETURN",
    "text": "when will you return",
    "tags": [
      "question",
      "parting"
    ],
    "slots": []
  },
  {
    "id": "PH_WHO_ARE_YOU_WAITING_FOR",
    "text": "who are you waiting for",
    "tags": [
      "question",
      "waiting"
    ],
    "slots": []
  },
  {
    "id": "PH_WHO_WERE_YOU_WITH",
    "text": "who were you with",
    "tags": [
      "question",
      "jealousy"
    ],
    "slots": []
  },
  {
    "id": "PH_HOW_ARE_YOU_FEELING",
    "text": "how are you feeling",
    "tags": [
      "question",
      "health"
    ],
    "slots": []
  },
  {
    "id": "PH_HOW_WAS_YOUR_DAY",
    "text": "how was your day",
    "tags": [
      "question",
      "daily"
    ],
    "slots": []
  },
  {
    "id": "PH_HOW_WAS_WORK",
    "text": "how was work",
    "tags": [
      "question",
      "work"
    ],
    "slots": []
  },
  {
    "id": "PH_DID_SOMETHING_HAPPEN",
    "text": "did something happen",
    "tags": [
      "question",
      "clarity"
    ],
    "slots": []
  },
  {
    "id": "PH_IS_SOMETHING_WRONG",
    "text": "is something wrong",
    "tags": [
      "question",
      "care"
    ],
    "slots": []
  },
  {
    "id": "PH_ARE_YOU_SURE",
    "text": "are you sure",
    "tags": [
      "question",
      "clarity"
    ],
    "slots": []
  },
  {
    "id": "PH_DO_YOU_UNDERSTAND",
    "text": "do you understand",
    "tags": [
      "question",
      "clarity"
    ],
    "slots": []
  },
  {
    "id": "PH_DO_YOU_REMEMBER",
    "text": "do you remember",
    "tags": [
      "question",
      "memory"
    ],
    "slots": []
  },
  {
    "id": "PH_DO_YOU_TRUST_ME",
    "text": "do you trust me",
    "tags": [
      "question",
      "trust"
    ],
    "slots": []
  },
  {
    "id": "PH_CAN_YOU_TRUST_ME",
    "text": "can you trust me",
    "tags": [
      "question",
      "trust"
    ],
    "slots": []
  },
  {
    "id": "PH_CAN_WE_TALK",
    "text": "can we talk",
    "tags": [
      "question",
      "clarity"
    ],
    "slots": []
  },
  {
    "id": "PH_CAN_WE_GO_TOGETHER",
    "text": "can we go together",
    "tags": [
      "question",
      "closeness"
    ],
    "slots": []
  },
  {
    "id": "PH_CAN_WE_STAY_HERE",
    "text": "can we stay here",
    "tags": [
      "question",
      "safety"
    ],
    "slots": []
  },
  {
    "id": "PH_CAN_I_ASK_YOU_SOMETHING",
    "text": "can I ask you something",
    "tags": [
      "question",
      "clarity"
    ],
    "slots": []
  },
  {
    "id": "PH_CAN_I_TELL_YOU_SOMETHING",
    "text": "can I tell you something",
    "tags": [
      "question",
      "clarity"
    ],
    "slots": []
  },
  {
    "id": "PH_CAN_I_HELP_YOU",
    "text": "can I help you",
    "tags": [
      "offer",
      "care"
    ],
    "slots": []
  },
  {
    "id": "PH_CAN_I_GET_YOU_SOMETHING",
    "text": "can I get you something",
    "tags": [
      "offer",
      "care"
    ],
    "slots": []
  },
  {
    "id": "PH_SHOULD_WE_LEAVE",
    "text": "should we leave",
    "tags": [
      "question",
      "movement"
    ],
    "slots": []
  },
  {
    "id": "PH_SHOULD_WE_WAIT",
    "text": "should we wait",
    "tags": [
      "question",
      "waiting"
    ],
    "slots": []
  },
  {
    "id": "PH_SHOULD_WE_GO_INSIDE",
    "text": "should we go inside",
    "tags": [
      "question",
      "safety"
    ],
    "slots": []
  },
  {
    "id": "PH_WE_SHOULD_GO",
    "text": "we should go",
    "tags": [
      "movement"
    ],
    "slots": []
  },
  {
    "id": "PH_WE_SHOULD_WAIT",
    "text": "we should wait",
    "tags": [
      "waiting"
    ],
    "slots": []
  },
  {
    "id": "PH_WE_SHOULD_TALK",
    "text": "we should talk",
    "tags": [
      "clarity"
    ],
    "slots": []
  },
  {
    "id": "PH_WE_NEED_TO_GO",
    "text": "we need to go",
    "tags": [
      "movement"
    ],
    "slots": []
  },
  {
    "id": "PH_WE_NEED_TO_WAIT",
    "text": "we need to wait",
    "tags": [
      "waiting"
    ],
    "slots": []
  },
  {
    "id": "PH_WE_NEED_TO_FIND_SHELTER",
    "text": "we need to find shelter",
    "tags": [
      "safety"
    ],
    "slots": []
  },
  {
    "id": "PH_WE_CAN_STAY_HERE",
    "text": "we can stay here",
    "tags": [
      "safety"
    ],
    "slots": []
  },
  {
    "id": "PH_WE_CANT_STAY_HERE",
    "text": "we cannot stay here",
    "tags": [
      "safety"
    ],
    "slots": []
  },
  {
    "id": "PH_I_HAVE_A_QUESTION",
    "text": "I have a question",
    "tags": [
      "clarity"
    ],
    "slots": []
  },
  {
    "id": "PH_I_HAVE_AN_IDEA",
    "text": "I have an idea",
    "tags": [
      "plan"
    ],
    "slots": []
  },
  {
    "id": "PH_I_HAVE_A_PLAN",
    "text": "I have a plan",
    "tags": [
      "plan"
    ],
    "slots": []
  },
  {
    "id": "PH_I_CHANGED_MY_MIND",
    "text": "I changed my mind",
    "tags": [
      "decision"
    ],
    "slots": []
  },
  {
    "id": "PH_I_MADE_A_MISTAKE",
    "text": "I made a mistake",
    "tags": [
      "repair"
    ],
    "slots": []
  },
  {
    "id": "PH_I_REMEMBER_NOW",
    "text": "I remember now",
    "tags": [
      "memory"
    ],
    "slots": []
  },
  {
    "id": "PH_I_FORGOT",
    "text": "I forgot",
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
    "id": "PH_I_AGREE_WITH_YOU",
    "text": "I agree with you",
    "tags": [
      "agreement"
    ],
    "slots": []
  },
  {
    "id": "PH_I_DONT_AGREE",
    "text": "I do not agree",
    "tags": [
      "disagreement"
    ],
    "slots": []
  },
  {
    "id": "PH_I_THINK_YOU_ARE_RIGHT",
    "text": "I think you are right",
    "tags": [
      "agreement"
    ],
    "slots": []
  },
  {
    "id": "PH_I_THINK_YOU_ARE_WRONG",
    "text": "I think you are wrong",
    "tags": [
      "disagreement"
    ],
    "slots": []
  },
  {
    "id": "PH_I_DONT_THINK_SO",
    "text": "I do not think so",
    "tags": [
      "disagreement"
    ],
    "slots": []
  },
  {
    "id": "PH_MAYBE_YOU_ARE_RIGHT",
    "text": "maybe you are right",
    "tags": [
      "uncertainty",
      "agreement"
    ],
    "slots": []
  },
  {
    "id": "PH_THAT_MAKES_SENSE",
    "text": "that makes sense",
    "tags": [
      "clarity"
    ],
    "slots": []
  },
  {
    "id": "PH_THAT_DOESNT_MAKE_SENSE",
    "text": "that does not make sense",
    "tags": [
      "clarity"
    ],
    "slots": []
  },
  {
    "id": "PH_THATS_FINE",
    "text": "that is fine",
    "tags": [
      "response"
    ],
    "slots": []
  },
  {
    "id": "PH_THATS_OKAY",
    "text": "that is okay",
    "tags": [
      "response"
    ],
    "slots": []
  },
  {
    "id": "PH_THATS_ENOUGH",
    "text": "that is enough",
    "tags": [
      "boundary"
    ],
    "slots": []
  },
  {
    "id": "PH_THATS_NOT_ENOUGH",
    "text": "that is not enough",
    "tags": [
      "boundary"
    ],
    "slots": []
  },
  {
    "id": "PH_I_NEED_MORE_TIME",
    "text": "I need more time",
    "tags": [
      "distance",
      "time"
    ],
    "slots": []
  },
  {
    "id": "PH_I_NEED_MORE_SPACE",
    "text": "I need more space",
    "tags": [
      "distance"
    ],
    "slots": []
  },
  {
    "id": "PH_I_NEED_YOUR_HELP",
    "text": "I need your help",
    "tags": [
      "request",
      "care"
    ],
    "slots": []
  },
  {
    "id": "PH_I_NEED_YOUR_ANSWER",
    "text": "I need your answer",
    "tags": [
      "request",
      "clarity"
    ],
    "slots": []
  },
  {
    "id": "PH_I_NEED_YOU_TO_LISTEN",
    "text": "I need you to listen to me",
    "tags": [
      "request",
      "clarity"
    ],
    "slots": []
  },
  {
    "id": "PH_I_NEED_YOU_TO_STAY",
    "text": "I need you to stay",
    "tags": [
      "request",
      "closeness"
    ],
    "slots": []
  },
  {
    "id": "PH_I_WANT_YOU_TO_STAY",
    "text": "I want you to stay",
    "tags": [
      "request",
      "closeness"
    ],
    "slots": []
  },
  {
    "id": "PH_I_WANT_YOU_TO_GO",
    "text": "I want you to go",
    "tags": [
      "request",
      "distance"
    ],
    "slots": []
  },
  {
    "id": "PH_I_WANT_TO_GO_WITH_YOU",
    "text": "I want to go with you",
    "tags": [
      "closeness"
    ],
    "slots": []
  },
  {
    "id": "PH_I_WANT_TO_HELP_YOU",
    "text": "I want to help you",
    "tags": [
      "care"
    ],
    "slots": []
  },
  {
    "id": "PH_I_WANT_TO_PROTECT_YOU",
    "text": "I want to protect you",
    "tags": [
      "care"
    ],
    "slots": []
  },
  {
    "id": "PH_I_WANT_TO_TALK",
    "text": "I want to talk",
    "tags": [
      "clarity"
    ],
    "slots": []
  },
  {
    "id": "PH_I_WANT_TO_KNOW",
    "text": "I want to know",
    "tags": [
      "clarity"
    ],
    "slots": []
  },
  {
    "id": "PH_I_WANT_TO_UNDERSTAND",
    "text": "I want to understand",
    "tags": [
      "clarity"
    ],
    "slots": []
  },
  {
    "id": "PH_I_WANT_TO_BELIEVE_YOU",
    "text": "I want to believe you",
    "tags": [
      "trust"
    ],
    "slots": []
  },
  {
    "id": "PH_I_TRY_TO_UNDERSTAND",
    "text": "I am trying to understand",
    "tags": [
      "clarity"
    ],
    "slots": []
  },
  {
    "id": "PH_I_AM_LISTENING",
    "text": "I am listening",
    "tags": [
      "clarity"
    ],
    "slots": []
  },
  {
    "id": "PH_I_AM_WAITING",
    "text": "I am waiting",
    "tags": [
      "waiting"
    ],
    "slots": []
  },
  {
    "id": "PH_I_AM_READY",
    "text": "I am ready",
    "tags": [
      "response"
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
    "id": "PH_I_AM_BUSY",
    "text": "I am busy",
    "tags": [
      "daily"
    ],
    "slots": []
  },
  {
    "id": "PH_I_AM_FREE",
    "text": "I am free",
    "tags": [
      "daily"
    ],
    "slots": []
  },
  {
    "id": "PH_I_AM_AT_WORK",
    "text": "I am at work",
    "tags": [
      "work"
    ],
    "slots": []
  },
  {
    "id": "PH_I_AM_HOME",
    "text": "I am home",
    "tags": [
      "daily"
    ],
    "slots": []
  },
  {
    "id": "PH_I_AM_OUTSIDE",
    "text": "I am outside",
    "tags": [
      "daily"
    ],
    "slots": []
  },
  {
    "id": "PH_I_AM_INSIDE",
    "text": "I am inside",
    "tags": [
      "daily"
    ],
    "slots": []
  },
  {
    "id": "PH_I_WILL_CALL_YOU",
    "text": "I will call you",
    "tags": [
      "contact"
    ],
    "slots": []
  },
  {
    "id": "PH_I_WILL_MESSAGE_YOU",
    "text": "I will send you a message",
    "tags": [
      "contact"
    ],
    "slots": []
  },
  {
    "id": "PH_I_WILL_WAIT_HERE",
    "text": "I will wait here",
    "tags": [
      "waiting"
    ],
    "slots": []
  },
  {
    "id": "PH_I_WILL_GO_WITH_YOU",
    "text": "I will go with you",
    "tags": [
      "closeness"
    ],
    "slots": []
  },
  {
    "id": "PH_I_WILL_HELP_YOU",
    "text": "I will help you",
    "tags": [
      "care"
    ],
    "slots": []
  },
  {
    "id": "PH_I_WILL_FIND_YOU",
    "text": "I will find you",
    "tags": [
      "closeness"
    ],
    "slots": []
  },
  {
    "id": "PH_I_WILL_TELL_YOU",
    "text": "I will tell you",
    "tags": [
      "clarity"
    ],
    "slots": []
  },
  {
    "id": "PH_I_WILL_EXPLAIN",
    "text": "I will explain",
    "tags": [
      "clarity"
    ],
    "slots": []
  },
  {
    "id": "PH_I_WONT_ASK_AGAIN",
    "text": "I will not ask again",
    "tags": [
      "boundary"
    ],
    "slots": []
  },
  {
    "id": "PH_I_WONT_CALL",
    "text": "I will not call you",
    "tags": [
      "boundary",
      "contact"
    ],
    "slots": []
  },
  {
    "id": "PH_I_WONT_MESSAGE",
    "text": "I will not message you",
    "tags": [
      "boundary",
      "contact"
    ],
    "slots": []
  },
  {
    "id": "PH_I_WONT_COME_IN",
    "text": "I will not come in",
    "tags": [
      "boundary"
    ],
    "slots": []
  },
  {
    "id": "PH_I_WONT_WAIT",
    "text": "I will not wait",
    "tags": [
      "boundary"
    ],
    "slots": []
  },
  {
    "id": "PH_I_WONT_VISIT",
    "text": "I will not visit you",
    "tags": [
      "boundary"
    ],
    "slots": []
  },
  {
    "id": "PH_YOU_DONT_HAVE_TO_ANSWER",
    "text": "you do not have to answer",
    "tags": [
      "boundary",
      "clarity"
    ],
    "slots": []
  },
  {
    "id": "PH_YOU_DONT_HAVE_TO_TALK",
    "text": "you do not have to talk",
    "tags": [
      "boundary",
      "clarity"
    ],
    "slots": []
  },
  {
    "id": "PH_YOU_DONT_HAVE_TO_STAY",
    "text": "you do not have to stay",
    "tags": [
      "boundary",
      "distance"
    ],
    "slots": []
  },
  {
    "id": "PH_YOU_CAN_GO",
    "text": "you can go",
    "tags": [
      "boundary",
      "distance"
    ],
    "slots": []
  },
  {
    "id": "PH_YOU_CAN_STAY",
    "text": "you can stay",
    "tags": [
      "closeness"
    ],
    "slots": []
  },
  {
    "id": "PH_YOU_CAN_TELL_ME",
    "text": "you can tell me",
    "tags": [
      "clarity"
    ],
    "slots": []
  },
  {
    "id": "PH_YOU_CAN_TAKE_YOUR_TIME",
    "text": "you can take your time",
    "tags": [
      "boundary",
      "time"
    ],
    "slots": []
  },
  {
    "id": "PH_TAKE_YOUR_TIME",
    "text": "take your time",
    "tags": [
      "boundary",
      "time"
    ],
    "slots": []
  },
  {
    "id": "PH_BE_CAREFUL",
    "text": "be careful",
    "tags": [
      "care",
      "safety"
    ],
    "slots": []
  },
  {
    "id": "PH_CALL_ME_IF_YOU_NEED_ME",
    "text": "call me if you need me",
    "tags": [
      "care",
      "contact"
    ],
    "slots": []
  },
  {
    "id": "PH_TELL_ME_IF_YOU_NEED_HELP",
    "text": "tell me if you need help",
    "tags": [
      "care"
    ],
    "slots": []
  },
  {
    "id": "PH_LET_ME_KNOW",
    "text": "let me know",
    "tags": [
      "clarity",
      "contact"
    ],
    "slots": []
  },
  {
    "id": "PH_LET_ME_KNOW_WHEN_YOU_ARRIVE",
    "text": "let me know when you arrive",
    "tags": [
      "care",
      "contact"
    ],
    "slots": []
  },
  {
    "id": "PH_LET_ME_KNOW_IF_YOU_ARE_SAFE",
    "text": "let me know if you are safe",
    "tags": [
      "care",
      "safety"
    ],
    "slots": []
  },
  {
    "id": "PH_I_AM_PROUD_OF_YOU",
    "text": "I am proud of you",
    "tags": [
      "positive",
      "affection"
    ],
    "slots": []
  },
  {
    "id": "PH_I_AM_HAPPY_FOR_YOU",
    "text": "I am happy for you",
    "tags": [
      "positive"
    ],
    "slots": []
  },
  {
    "id": "PH_THATS_GOOD_NEWS",
    "text": "that is good news",
    "tags": [
      "positive"
    ],
    "slots": []
  },
  {
    "id": "PH_THATS_BAD_NEWS",
    "text": "that is bad news",
    "tags": [
      "negative"
    ],
    "slots": []
  },
  {
    "id": "PH_IM_SORRY_THAT_HAPPENED",
    "text": "I am sorry that happened",
    "tags": [
      "care"
    ],
    "slots": []
  },
  {
    "id": "PH_THAT_SOUNDS_HARD",
    "text": "that sounds hard",
    "tags": [
      "care"
    ],
    "slots": []
  },
  {
    "id": "PH_THAT_SOUNDS_DANGEROUS",
    "text": "that sounds dangerous",
    "tags": [
      "care",
      "safety"
    ],
    "slots": []
  }
]);
})();
