(() => {
 "use strict";
 const P=window.HMW?.Dialogue?.Phrases;
 if(!P) throw new Error("Phrase registry must load first.");
 P.register([
  {
    "id": "PH_WHAT_IS_YOUR_NAME",
    "text": "What is your name?",
    "tags": [
      "identity",
      "question"
    ],
    "slots": []
  },
  {
    "id": "PH_MY_NAME_IS",
    "text": "My name is {NAME}.",
    "tags": [
      "identity"
    ],
    "slots": []
  },
  {
    "id": "PH_WHO_ARE_YOU",
    "text": "Who are you?",
    "tags": [
      "identity",
      "question"
    ],
    "slots": []
  },
  {
    "id": "PH_I_AM_A",
    "text": "I am a {ROLE}.",
    "tags": [
      "identity"
    ],
    "slots": []
  },
  {
    "id": "PH_WHAT_DO_YOU_DO",
    "text": "What do you do?",
    "tags": [
      "work",
      "identity",
      "question"
    ],
    "slots": []
  },
  {
    "id": "PH_I_WORK_AS",
    "text": "I work as a {ROLE}.",
    "tags": [
      "work",
      "identity"
    ],
    "slots": []
  },
  {
    "id": "PH_WHERE_ARE_YOU_FROM",
    "text": "Where are you from?",
    "tags": [
      "identity",
      "place",
      "question"
    ],
    "slots": []
  },
  {
    "id": "PH_I_AM_FROM",
    "text": "I am from {PLACE}.",
    "tags": [
      "identity",
      "place"
    ],
    "slots": []
  },
  {
    "id": "PH_WHERE_ARE_YOU_GOING",
    "text": "Where are you going?",
    "tags": [
      "destination",
      "question"
    ],
    "slots": []
  },
  {
    "id": "PH_I_AM_GOING_TO",
    "text": "I am going to {PLACE}.",
    "tags": [
      "destination",
      "movement"
    ],
    "slots": []
  },
  {
    "id": "PH_WHAT_IS_YOUR_DESTINATION",
    "text": "What is your destination?",
    "tags": [
      "destination",
      "question"
    ],
    "slots": []
  },
  {
    "id": "PH_MY_DESTINATION_IS",
    "text": "My destination is {PLACE}.",
    "tags": [
      "destination"
    ],
    "slots": []
  },
  {
    "id": "PH_WHY_ARE_YOU_HERE",
    "text": "Why are you here?",
    "tags": [
      "reason",
      "question"
    ],
    "slots": []
  },
  {
    "id": "PH_I_AM_HERE_BECAUSE",
    "text": "I am here because {CLAUSE}.",
    "tags": [
      "reason"
    ],
    "slots": []
  },
  {
    "id": "PH_WHY_DID_YOU_DO_THAT",
    "text": "Why did you do that?",
    "tags": [
      "reason",
      "question"
    ],
    "slots": []
  },
  {
    "id": "PH_I_DID_IT_BECAUSE",
    "text": "I did it because {CLAUSE}.",
    "tags": [
      "reason"
    ],
    "slots": []
  },
  {
    "id": "PH_WHY_DO_YOU_WANT_THAT",
    "text": "Why do you want that?",
    "tags": [
      "reason",
      "desire",
      "question"
    ],
    "slots": []
  },
  {
    "id": "PH_I_WANT_IT_BECAUSE",
    "text": "I want it because {CLAUSE}.",
    "tags": [
      "reason",
      "desire"
    ],
    "slots": []
  },
  {
    "id": "PH_WHAT_DO_YOU_THINK",
    "text": "What do you think?",
    "tags": [
      "opinion",
      "question"
    ],
    "slots": []
  },
  {
    "id": "PH_I_THINK",
    "text": "I think {CLAUSE}.",
    "tags": [
      "opinion"
    ],
    "slots": []
  },
  {
    "id": "PH_IN_MY_OPINION",
    "text": "In my opinion, {CLAUSE}.",
    "tags": [
      "opinion"
    ],
    "slots": []
  },
  {
    "id": "PH_I_AGREE_WITH_THAT",
    "text": "I agree with that.",
    "tags": [
      "opinion",
      "agreement"
    ],
    "slots": []
  },
  {
    "id": "PH_I_DISAGREE_WITH_THAT",
    "text": "I disagree with that.",
    "tags": [
      "opinion",
      "disagreement"
    ],
    "slots": []
  },
  {
    "id": "PH_I_AM_NOT_SURE_ABOUT_THAT",
    "text": "I am not sure about that.",
    "tags": [
      "opinion",
      "uncertainty"
    ],
    "slots": []
  },
  {
    "id": "PH_HOW_MUCH_DOES_IT_COST",
    "text": "How much does it cost?",
    "tags": [
      "price",
      "money",
      "question"
    ],
    "slots": []
  },
  {
    "id": "PH_IT_COSTS",
    "text": "It costs {AMOUNT}.",
    "tags": [
      "price",
      "money"
    ],
    "slots": []
  },
  {
    "id": "PH_HOW_MUCH_IS_THIS",
    "text": "How much is this?",
    "tags": [
      "price",
      "money",
      "question"
    ],
    "slots": []
  },
  {
    "id": "PH_THIS_IS",
    "text": "This is {AMOUNT}.",
    "tags": [
      "price",
      "money"
    ],
    "slots": []
  },
  {
    "id": "PH_HOW_MANY_ARE_THERE",
    "text": "How many are there?",
    "tags": [
      "quantity",
      "question"
    ],
    "slots": []
  },
  {
    "id": "PH_THERE_ARE",
    "text": "There are {QUANTITY}.",
    "tags": [
      "quantity"
    ],
    "slots": []
  },
  {
    "id": "PH_HOW_MANY_DO_YOU_NEED",
    "text": "How many do you need?",
    "tags": [
      "quantity",
      "question"
    ],
    "slots": []
  },
  {
    "id": "PH_I_NEED_QUANTITY",
    "text": "I need {QUANTITY}.",
    "tags": [
      "quantity",
      "need"
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
    "id": "PH_I_HAVE_QUANTITY",
    "text": "I have {QUANTITY}.",
    "tags": [
      "quantity"
    ],
    "slots": []
  },
  {
    "id": "PH_DO_YOU_HAVE_IT",
    "text": "Do you have it?",
    "tags": [
      "possession",
      "question"
    ],
    "slots": []
  },
  {
    "id": "PH_YES_I_HAVE_IT",
    "text": "Yes, I have it.",
    "tags": [
      "possession",
      "answer"
    ],
    "slots": []
  },
  {
    "id": "PH_NO_I_DONT_HAVE_IT",
    "text": "No, I do not have it.",
    "tags": [
      "possession",
      "answer"
    ],
    "slots": []
  },
  {
    "id": "PH_CAN_YOU_DO_IT",
    "text": "Can you do it?",
    "tags": [
      "capability",
      "question"
    ],
    "slots": []
  },
  {
    "id": "PH_YES_I_CAN",
    "text": "Yes, I can.",
    "tags": [
      "capability",
      "answer"
    ],
    "slots": []
  },
  {
    "id": "PH_NO_I_CANNOT",
    "text": "No, I cannot.",
    "tags": [
      "capability",
      "answer"
    ],
    "slots": []
  },
  {
    "id": "PH_ARE_YOU_FREE",
    "text": "Are you free?",
    "tags": [
      "availability",
      "question"
    ],
    "slots": []
  },
  {
    "id": "PH_YES_I_AM_FREE",
    "text": "Yes, I am free.",
    "tags": [
      "availability",
      "answer"
    ],
    "slots": []
  },
  {
    "id": "PH_NO_I_AM_BUSY",
    "text": "No, I am busy.",
    "tags": [
      "availability",
      "answer"
    ],
    "slots": []
  },
  {
    "id": "PH_WHAT_TIME_ARE_YOU_FREE",
    "text": "What time are you free?",
    "tags": [
      "availability",
      "time",
      "question"
    ],
    "slots": []
  },
  {
    "id": "PH_I_AM_FREE_AT",
    "text": "I am free at {TIME}.",
    "tags": [
      "availability",
      "time"
    ],
    "slots": []
  },
  {
    "id": "PH_WHEN_WILL_YOU_RETURN",
    "text": "When will you return?",
    "tags": [
      "return",
      "time",
      "question"
    ],
    "slots": []
  },
  {
    "id": "PH_I_WILL_RETURN_AT",
    "text": "I will return at {TIME}.",
    "tags": [
      "return",
      "time"
    ],
    "slots": []
  },
  {
    "id": "PH_WHEN_WILL_YOU_LEAVE",
    "text": "When will you leave?",
    "tags": [
      "departure",
      "time",
      "question"
    ],
    "slots": []
  },
  {
    "id": "PH_I_WILL_LEAVE_AT",
    "text": "I will leave at {TIME}.",
    "tags": [
      "departure",
      "time"
    ],
    "slots": []
  },
  {
    "id": "PH_WHEN_DID_YOU_ARRIVE",
    "text": "When did you arrive?",
    "tags": [
      "arrival",
      "time",
      "question"
    ],
    "slots": []
  },
  {
    "id": "PH_I_ARRIVED_AT",
    "text": "I arrived at {TIME}.",
    "tags": [
      "arrival",
      "time"
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
    "id": "PH_I_LIVE_AT",
    "text": "I live at {PLACE}.",
    "tags": [
      "home"
    ],
    "slots": []
  },
  {
    "id": "PH_WHERE_ARE_YOU_STAYING",
    "text": "Where are you staying?",
    "tags": [
      "home",
      "question"
    ],
    "slots": []
  },
  {
    "id": "PH_I_AM_STAYING_AT",
    "text": "I am staying at {PLACE}.",
    "tags": [
      "home"
    ],
    "slots": []
  },
  {
    "id": "PH_DO_YOU_HAVE_A_JOB",
    "text": "Do you have a job?",
    "tags": [
      "work",
      "question"
    ],
    "slots": []
  },
  {
    "id": "PH_YES_I_HAVE_A_JOB",
    "text": "Yes, I have a job.",
    "tags": [
      "work",
      "answer"
    ],
    "slots": []
  },
  {
    "id": "PH_NO_I_DONT_HAVE_A_JOB",
    "text": "No, I do not have a job.",
    "tags": [
      "work",
      "answer"
    ],
    "slots": []
  },
  {
    "id": "PH_WHERE_DO_YOU_WORK",
    "text": "Where do you work?",
    "tags": [
      "work",
      "place",
      "question"
    ],
    "slots": []
  },
  {
    "id": "PH_I_WORK_AT",
    "text": "I work at {PLACE}.",
    "tags": [
      "work",
      "place"
    ],
    "slots": []
  },
  {
    "id": "PH_WHAT_IS_YOUR_JOB",
    "text": "What is your job?",
    "tags": [
      "work",
      "question"
    ],
    "slots": []
  },
  {
    "id": "PH_MY_JOB_IS",
    "text": "My job is {ROLE}.",
    "tags": [
      "work"
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
    "id": "PH_I_HAVE_MONEY_AMOUNT",
    "text": "I have {AMOUNT}.",
    "tags": [
      "money"
    ],
    "slots": []
  },
  {
    "id": "PH_I_HAVE_NO_MONEY",
    "text": "I have no money.",
    "tags": [
      "money"
    ],
    "slots": []
  },
  {
    "id": "PH_CAN_YOU_AFFORD_IT",
    "text": "Can you afford it?",
    "tags": [
      "money",
      "capability",
      "question"
    ],
    "slots": []
  },
  {
    "id": "PH_I_CAN_AFFORD_IT",
    "text": "I can afford it.",
    "tags": [
      "money",
      "answer"
    ],
    "slots": []
  },
  {
    "id": "PH_I_CANNOT_AFFORD_IT",
    "text": "I cannot afford it.",
    "tags": [
      "money",
      "answer"
    ],
    "slots": []
  },
  {
    "id": "PH_WHAT_DO_YOU_WANT",
    "text": "What do you want?",
    "tags": [
      "desire",
      "question"
    ],
    "slots": []
  },
  {
    "id": "PH_I_WANT_OBJECT",
    "text": "I want {OBJECT}.",
    "tags": [
      "desire"
    ],
    "slots": []
  },
  {
    "id": "PH_WHAT_DO_YOU_NEED",
    "text": "What do you need?",
    "tags": [
      "need",
      "question"
    ],
    "slots": []
  },
  {
    "id": "PH_I_NEED_OBJECT",
    "text": "I need {OBJECT}.",
    "tags": [
      "need"
    ],
    "slots": []
  },
  {
    "id": "PH_WHICH_DO_YOU_WANT",
    "text": "Which do you want?",
    "tags": [
      "choice",
      "question"
    ],
    "slots": []
  },
  {
    "id": "PH_I_WANT_THIS",
    "text": "I want this.",
    "tags": [
      "choice"
    ],
    "slots": []
  },
  {
    "id": "PH_I_WANT_THAT",
    "text": "I want that.",
    "tags": [
      "choice"
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
    "id": "PH_I_PREFER_THIS",
    "text": "I prefer this.",
    "tags": [
      "preference"
    ],
    "slots": []
  },
  {
    "id": "PH_I_PREFER_THAT",
    "text": "I prefer that.",
    "tags": [
      "preference"
    ],
    "slots": []
  },
  {
    "id": "PH_DO_YOU_LIKE_IT",
    "text": "Do you like it?",
    "tags": [
      "preference",
      "question"
    ],
    "slots": []
  },
  {
    "id": "PH_I_LIKE_IT",
    "text": "I like it.",
    "tags": [
      "preference",
      "answer"
    ],
    "slots": []
  },
  {
    "id": "PH_I_DONT_LIKE_IT",
    "text": "I do not like it.",
    "tags": [
      "preference",
      "answer"
    ],
    "slots": []
  },
  {
    "id": "PH_ARE_YOU_SURE",
    "text": "Are you sure?",
    "tags": [
      "certainty",
      "question"
    ],
    "slots": []
  },
  {
    "id": "PH_YES_I_AM_SURE",
    "text": "Yes, I am sure.",
    "tags": [
      "certainty",
      "answer"
    ],
    "slots": []
  },
  {
    "id": "PH_NO_I_AM_NOT_SURE",
    "text": "No, I am not sure.",
    "tags": [
      "certainty",
      "answer"
    ],
    "slots": []
  },
  {
    "id": "PH_IS_THAT_TRUE",
    "text": "Is that true?",
    "tags": [
      "fact",
      "question"
    ],
    "slots": []
  },
  {
    "id": "PH_YES_THAT_IS_TRUE",
    "text": "Yes, that is true.",
    "tags": [
      "fact",
      "answer"
    ],
    "slots": []
  },
  {
    "id": "PH_NO_THAT_IS_NOT_TRUE",
    "text": "No, that is not true.",
    "tags": [
      "fact",
      "answer"
    ],
    "slots": []
  },
  {
    "id": "PH_DO_YOU_KNOW",
    "text": "Do you know?",
    "tags": [
      "knowledge",
      "question"
    ],
    "slots": []
  },
  {
    "id": "PH_YES_I_KNOW",
    "text": "Yes, I know.",
    "tags": [
      "knowledge",
      "answer"
    ],
    "slots": []
  },
  {
    "id": "PH_NO_I_DONT_KNOW",
    "text": "No, I do not know.",
    "tags": [
      "knowledge",
      "answer"
    ],
    "slots": []
  },
  {
    "id": "PH_WHAT_HAPPENED",
    "text": "What happened?",
    "tags": [
      "event",
      "question"
    ],
    "slots": []
  },
  {
    "id": "PH_THIS_HAPPENED",
    "text": "{CLAUSE}.",
    "tags": [
      "event",
      "answer"
    ],
    "slots": []
  },
  {
    "id": "PH_WHAT_WILL_YOU_DO",
    "text": "What will you do?",
    "tags": [
      "plan",
      "question"
    ],
    "slots": []
  },
  {
    "id": "PH_I_WILL_ACTION",
    "text": "I will {VERB_BASE} {OBJECT}.",
    "tags": [
      "plan"
    ],
    "slots": []
  },
  {
    "id": "PH_WHAT_ARE_YOU_DOING_LATER",
    "text": "What are you doing later?",
    "tags": [
      "plan",
      "question"
    ],
    "slots": []
  },
  {
    "id": "PH_I_AM_GOING_TO_ACTION",
    "text": "I am going to {VERB_BASE} {OBJECT}.",
    "tags": [
      "plan"
    ],
    "slots": []
  },
  {
    "id": "PH_ARE_YOU_COMING_BACK",
    "text": "Are you coming back?",
    "tags": [
      "return",
      "question"
    ],
    "slots": []
  },
  {
    "id": "PH_YES_I_AM_COMING_BACK",
    "text": "Yes, I am coming back.",
    "tags": [
      "return",
      "answer"
    ],
    "slots": []
  },
  {
    "id": "PH_NO_I_AM_NOT_COMING_BACK",
    "text": "No, I am not coming back.",
    "tags": [
      "return",
      "answer"
    ],
    "slots": []
  },
  {
    "id": "PH_ARE_YOU_STAYING",
    "text": "Are you staying?",
    "tags": [
      "stay",
      "question"
    ],
    "slots": []
  },
  {
    "id": "PH_YES_I_AM_STAYING",
    "text": "Yes, I am staying.",
    "tags": [
      "stay",
      "answer"
    ],
    "slots": []
  },
  {
    "id": "PH_NO_I_AM_LEAVING",
    "text": "No, I am leaving.",
    "tags": [
      "stay",
      "answer"
    ],
    "slots": []
  }
]);
})();