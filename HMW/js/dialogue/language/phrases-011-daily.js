(() => {
  "use strict";
  const P=window.HMW?.Dialogue?.Phrases;
  if(!P) throw new Error("Phrase registry must load first.");
  P.register([
  {
    "id": "PH_I_NEED_TO_APPLY",
    "text": "I need to apply.",
    "tags": [
      "work",
      "admin"
    ],
    "slots": []
  },
  {
    "id": "PH_I_SUBMITTED_THE_FORM",
    "text": "I submitted the form.",
    "tags": [
      "admin"
    ],
    "slots": []
  },
  {
    "id": "PH_MY_APPLICATION_WAS_APPROVED",
    "text": "My application was approved.",
    "tags": [
      "admin"
    ],
    "slots": []
  },
  {
    "id": "PH_MY_APPLICATION_WAS_REJECTED",
    "text": "My application was rejected.",
    "tags": [
      "admin"
    ],
    "slots": []
  },
  {
    "id": "PH_I_NEED_A_REFERENCE",
    "text": "I need a reference.",
    "tags": [
      "work",
      "admin"
    ],
    "slots": []
  },
  {
    "id": "PH_I_HAVE_EXPERIENCE",
    "text": "I have experience.",
    "tags": [
      "work"
    ],
    "slots": []
  },
  {
    "id": "PH_I_DONT_HAVE_EXPERIENCE",
    "text": "I do not have experience.",
    "tags": [
      "work"
    ],
    "slots": []
  },
  {
    "id": "PH_I_AM_QUALIFIED",
    "text": "I am qualified.",
    "tags": [
      "work"
    ],
    "slots": []
  },
  {
    "id": "PH_I_AM_NOT_QUALIFIED",
    "text": "I am not qualified.",
    "tags": [
      "work"
    ],
    "slots": []
  },
  {
    "id": "PH_I_NEED_INSURANCE",
    "text": "I need insurance.",
    "tags": [
      "money",
      "admin"
    ],
    "slots": []
  },
  {
    "id": "PH_I_HAVE_TO_PAY_A_FEE",
    "text": "I have to pay a fee.",
    "tags": [
      "money",
      "admin"
    ],
    "slots": []
  },
  {
    "id": "PH_I_MADE_A_DEPOSIT",
    "text": "I made a deposit.",
    "tags": [
      "money"
    ],
    "slots": []
  },
  {
    "id": "PH_I_HAVE_SAVINGS",
    "text": "I have savings.",
    "tags": [
      "money"
    ],
    "slots": []
  },
  {
    "id": "PH_I_HAVE_DEBT",
    "text": "I have debt.",
    "tags": [
      "money"
    ],
    "slots": []
  },
  {
    "id": "PH_I_OWE_MONEY",
    "text": "I owe money.",
    "tags": [
      "money"
    ],
    "slots": []
  },
  {
    "id": "PH_I_WILL_REPAY_IT",
    "text": "I will repay it.",
    "tags": [
      "money",
      "promise"
    ],
    "slots": []
  },
  {
    "id": "PH_I_NEED_A_RESERVATION",
    "text": "I need a reservation.",
    "tags": [
      "travel"
    ],
    "slots": []
  },
  {
    "id": "PH_I_HAVE_A_RESERVATION",
    "text": "I have a reservation.",
    "tags": [
      "travel"
    ],
    "slots": []
  },
  {
    "id": "PH_MY_RESERVATION_WAS_CANCELLED",
    "text": "My reservation was cancelled.",
    "tags": [
      "travel"
    ],
    "slots": []
  },
  {
    "id": "PH_WHERE_IS_THE_TERMINAL",
    "text": "Where is the terminal?",
    "tags": [
      "travel",
      "place"
    ],
    "slots": []
  },
  {
    "id": "PH_WHERE_IS_THE_CHECKPOINT",
    "text": "Where is the checkpoint?",
    "tags": [
      "travel",
      "place"
    ],
    "slots": []
  },
  {
    "id": "PH_I_NEED_MY_PASSPORT",
    "text": "I need my passport.",
    "tags": [
      "travel"
    ],
    "slots": []
  },
  {
    "id": "PH_I_FORGOT_MY_PASSPORT",
    "text": "I forgot my passport.",
    "tags": [
      "travel"
    ],
    "slots": []
  },
  {
    "id": "PH_MY_BAGGAGE_IS_MISSING",
    "text": "My baggage is missing.",
    "tags": [
      "travel"
    ],
    "slots": []
  },
  {
    "id": "PH_I_NEED_TO_TRANSFER",
    "text": "I need to transfer.",
    "tags": [
      "travel"
    ],
    "slots": []
  },
  {
    "id": "PH_I_MISSED_THE_TRAIN",
    "text": "I missed the train.",
    "tags": [
      "travel"
    ],
    "slots": []
  },
  {
    "id": "PH_I_MISSED_THE_BUS",
    "text": "I missed the bus.",
    "tags": [
      "travel"
    ],
    "slots": []
  },
  {
    "id": "PH_THE_ROAD_IS_BLOCKED",
    "text": "The road is blocked.",
    "tags": [
      "travel"
    ],
    "slots": []
  },
  {
    "id": "PH_THIS_WAY_IS_FASTER",
    "text": "This way is faster.",
    "tags": [
      "travel",
      "comparison"
    ],
    "slots": []
  },
  {
    "id": "PH_THIS_WAY_IS_SAFER",
    "text": "This way is safer.",
    "tags": [
      "travel",
      "safety"
    ],
    "slots": []
  },
  {
    "id": "PH_I_HAVE_AN_ALLERGY",
    "text": "I have an allergy.",
    "tags": [
      "health"
    ],
    "slots": []
  },
  {
    "id": "PH_I_FEEL_NAUSEOUS",
    "text": "I feel nauseous.",
    "tags": [
      "health"
    ],
    "slots": []
  },
  {
    "id": "PH_I_HAVE_A_BRUISE",
    "text": "I have a bruise.",
    "tags": [
      "health"
    ],
    "slots": []
  },
  {
    "id": "PH_MY_ANKLE_IS_SWOLLEN",
    "text": "My ankle is swollen.",
    "tags": [
      "health"
    ],
    "slots": []
  },
  {
    "id": "PH_I_NEED_A_PRESCRIPTION",
    "text": "I need a prescription.",
    "tags": [
      "health"
    ],
    "slots": []
  },
  {
    "id": "PH_TAKE_ONE_TABLET",
    "text": "Take one tablet.",
    "tags": [
      "health"
    ],
    "slots": []
  },
  {
    "id": "PH_TAKE_THIS_TWICE_A_DAY",
    "text": "Take this twice a day.",
    "tags": [
      "health"
    ],
    "slots": []
  },
  {
    "id": "PH_I_AM_GETTING_BETTER",
    "text": "I am getting better.",
    "tags": [
      "health"
    ],
    "slots": []
  },
  {
    "id": "PH_I_AM_GETTING_WORSE",
    "text": "I am getting worse.",
    "tags": [
      "health"
    ],
    "slots": []
  },
  {
    "id": "PH_I_NEED_TREATMENT",
    "text": "I need treatment.",
    "tags": [
      "health"
    ],
    "slots": []
  },
  {
    "id": "PH_I_AM_EMBARRASSED_ABOUT_IT",
    "text": "I am embarrassed about it.",
    "tags": [
      "emotion"
    ],
    "slots": []
  },
  {
    "id": "PH_I_REGRET_SAYING_THAT",
    "text": "I regret saying that.",
    "tags": [
      "repair",
      "emotion"
    ],
    "slots": []
  },
  {
    "id": "PH_I_WAS_JEALOUS",
    "text": "I was jealous.",
    "tags": [
      "emotion",
      "relationship"
    ],
    "slots": []
  },
  {
    "id": "PH_I_WAS_INSECURE",
    "text": "I was insecure.",
    "tags": [
      "emotion",
      "relationship"
    ],
    "slots": []
  },
  {
    "id": "PH_I_WAS_AFRAID",
    "text": "I was afraid.",
    "tags": [
      "emotion"
    ],
    "slots": []
  },
  {
    "id": "PH_I_PANICKED",
    "text": "I panicked.",
    "tags": [
      "emotion"
    ],
    "slots": []
  },
  {
    "id": "PH_I_HESITATED",
    "text": "I hesitated.",
    "tags": [
      "emotion"
    ],
    "slots": []
  },
  {
    "id": "PH_I_NEED_REASSURANCE",
    "text": "I need reassurance.",
    "tags": [
      "emotion",
      "relationship"
    ],
    "slots": []
  },
  {
    "id": "PH_I_WANT_TO_REASSURE_YOU",
    "text": "I want to reassure you.",
    "tags": [
      "care",
      "relationship"
    ],
    "slots": []
  },
  {
    "id": "PH_I_DONT_WANT_A_MISUNDERSTANDING",
    "text": "I do not want a misunderstanding.",
    "tags": [
      "relationship",
      "clarity"
    ],
    "slots": []
  },
  {
    "id": "PH_THAT_WAS_A_MISUNDERSTANDING",
    "text": "That was a misunderstanding.",
    "tags": [
      "relationship",
      "clarity"
    ],
    "slots": []
  },
  {
    "id": "PH_I_WANT_A_COMPROMISE",
    "text": "I want a compromise.",
    "tags": [
      "relationship"
    ],
    "slots": []
  },
  {
    "id": "PH_CAN_WE_COMPROMISE",
    "text": "Can we compromise?",
    "tags": [
      "relationship",
      "question"
    ],
    "slots": []
  },
  {
    "id": "PH_I_ACCEPT_THE_COMPROMISE",
    "text": "I accept the compromise.",
    "tags": [
      "relationship"
    ],
    "slots": []
  },
  {
    "id": "PH_I_DONT_ACCEPT_THAT",
    "text": "I do not accept that.",
    "tags": [
      "relationship",
      "boundary"
    ],
    "slots": []
  },
  {
    "id": "PH_I_WAS_WRONG_TO_BLAME_YOU",
    "text": "I was wrong to blame you.",
    "tags": [
      "repair"
    ],
    "slots": []
  },
  {
    "id": "PH_DONT_BLAME_YOURSELF",
    "text": "Do not blame yourself.",
    "tags": [
      "care"
    ],
    "slots": []
  },
  {
    "id": "PH_I_AM_NOT_BLAMING_YOU",
    "text": "I am not blaming you.",
    "tags": [
      "repair"
    ],
    "slots": []
  },
  {
    "id": "PH_I_WANT_THE_TRUTH",
    "text": "I want the truth.",
    "tags": [
      "clarity",
      "trust"
    ],
    "slots": []
  },
  {
    "id": "PH_I_WILL_TELL_YOU_THE_TRUTH",
    "text": "I will tell you the truth.",
    "tags": [
      "clarity",
      "trust"
    ],
    "slots": []
  },
  {
    "id": "PH_I_HAVE_PROOF",
    "text": "I have proof.",
    "tags": [
      "fact"
    ],
    "slots": []
  },
  {
    "id": "PH_I_DONT_HAVE_PROOF",
    "text": "I do not have proof.",
    "tags": [
      "fact"
    ],
    "slots": []
  },
  {
    "id": "PH_I_SAW_IT_MYSELF",
    "text": "I saw it myself.",
    "tags": [
      "fact"
    ],
    "slots": []
  },
  {
    "id": "PH_I_HEARD_A_RUMOR",
    "text": "I heard a rumor.",
    "tags": [
      "fact",
      "uncertainty"
    ],
    "slots": []
  },
  {
    "id": "PH_I_DONT_BELIEVE_THE_RUMOR",
    "text": "I do not believe the rumor.",
    "tags": [
      "fact",
      "uncertainty"
    ],
    "slots": []
  },
  {
    "id": "PH_CAN_YOU_CONFIRM_IT",
    "text": "Can you confirm it?",
    "tags": [
      "fact",
      "question"
    ],
    "slots": []
  },
  {
    "id": "PH_I_CAN_CONFIRM_IT",
    "text": "I can confirm it.",
    "tags": [
      "fact",
      "answer"
    ],
    "slots": []
  },
  {
    "id": "PH_I_CANNOT_CONFIRM_IT",
    "text": "I cannot confirm it.",
    "tags": [
      "fact",
      "answer"
    ],
    "slots": []
  },
  {
    "id": "PH_I_NEED_MORE_EVIDENCE",
    "text": "I need more evidence.",
    "tags": [
      "fact",
      "clarity"
    ],
    "slots": []
  },
  {
    "id": "PH_I_AM_CERTAIN",
    "text": "I am certain.",
    "tags": [
      "certainty"
    ],
    "slots": []
  },
  {
    "id": "PH_I_AM_NOT_CERTAIN",
    "text": "I am not certain.",
    "tags": [
      "certainty"
    ],
    "slots": []
  },
  {
    "id": "PH_THAT_IS_POSSIBLE",
    "text": "That is possible.",
    "tags": [
      "certainty"
    ],
    "slots": []
  },
  {
    "id": "PH_THAT_IS_UNLIKELY",
    "text": "That is unlikely.",
    "tags": [
      "certainty"
    ],
    "slots": []
  },
  {
    "id": "PH_I_EXPECT_HIM_TO_RETURN",
    "text": "I expect him to return.",
    "tags": [
      "expectation",
      "return"
    ],
    "slots": []
  },
  {
    "id": "PH_I_DID_NOT_EXPECT_THAT",
    "text": "I did not expect that.",
    "tags": [
      "expectation",
      "surprise"
    ],
    "slots": []
  },
  {
    "id": "PH_I_INTEND_TO_STAY",
    "text": "I intend to stay.",
    "tags": [
      "plan",
      "closeness"
    ],
    "slots": []
  },
  {
    "id": "PH_I_INTEND_TO_LEAVE",
    "text": "I intend to leave.",
    "tags": [
      "plan",
      "departure"
    ],
    "slots": []
  },
  {
    "id": "PH_I_CHANGED_MY_PLAN",
    "text": "I changed my plan.",
    "tags": [
      "plan"
    ],
    "slots": []
  },
  {
    "id": "PH_MY_PLAN_HAS_NOT_CHANGED",
    "text": "My plan has not changed.",
    "tags": [
      "plan"
    ],
    "slots": []
  },
  {
    "id": "PH_I_HAVE_NO_CHOICE",
    "text": "I have no choice.",
    "tags": [
      "choice"
    ],
    "slots": []
  },
  {
    "id": "PH_I_HAVE_A_CHOICE",
    "text": "I have a choice.",
    "tags": [
      "choice"
    ],
    "slots": []
  },
  {
    "id": "PH_I_CHOSE_THIS",
    "text": "I chose this.",
    "tags": [
      "choice"
    ],
    "slots": []
  },
  {
    "id": "PH_I_DID_NOT_CHOOSE_THAT",
    "text": "I did not choose that.",
    "tags": [
      "choice"
    ],
    "slots": []
  }
]);
})();