(() => {
  "use strict";

  window.HMW = window.HMW || {};
  HMW.Dialogue = HMW.Dialogue || {};

  HMW.Dialogue.BASIC_PATTERNS = {
    AFFIRM_LOVE: [
      "I love you.",
      "Yes, I love you.",
      "I do love you."
    ],
    DENY_LOVE: [
      "I do not love you.",
      "No, I do not love you."
    ],
    ASK_AFFECTION_REASON: [
      "Why do you think I do not love you?",
      "What made you think I do not love you?"
    ],
    DENY_BETRAYAL: [
      "I will not betray you.",
      "I am not going to betray you."
    ],
    ADMIT_BETRAYAL: [
      "I betrayed you.",
      "I was not loyal to you."
    ],
    PROMISE_LOYALTY: [
      "I will stay loyal to you.",
      "I will not turn against you."
    ],
    ACCEPT_DISTANCE: [
      "All right. I will leave you alone.",
      "I will give you some space."
    ],
    REFUSE_DISTANCE: [
      "No. I cannot just leave you alone.",
      "I do not want to leave you alone."
    ],
    ASK_DISTANCE_REASON: [
      "Why do you want me to leave you alone?",
      "Tell me why you want me to go."
    ],
    TEMPORARY_STEP_BACK: [
      "I will step back for now.",
      "I will give you some space for now."
    ],
    EXPRESS_CONCERN: [
      "I am worried about you.",
      "I am concerned about you."
    ],
    EXPRESS_FEAR_OF_LOSS: [
      "I do not want to lose you.",
      "I am afraid of losing you."
    ],
    REJECT_DEATH_WISH_CLAIM: [
      "No. I do not want you to die.",
      "I never said I wanted you to die."
    ],
    ASK_WHAT_HAPPENED: [
      "What happened?",
      "Tell me what happened."
    ],
    ASK_FOR_HONEST_ANSWER: [
      "Please tell me the truth.",
      "Tell me honestly."
    ],
    REQUEST_STAY: [
      "Please stay.",
      "I want you to stay."
    ]
  };
})();
