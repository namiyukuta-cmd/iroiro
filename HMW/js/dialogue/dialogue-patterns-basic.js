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
    ],
    APOLOGIZE: [
      "I am sorry.",
      "I am sorry for what I did.",
      "I should not have done that."
    ],
    ACCEPT_APOLOGY: [
      "I accept your apology.",
      "All right. I hear you.",
      "Thank you for apologizing."
    ],
    EXPRESS_HURT: [
      "That hurt me.",
      "What you said hurt me.",
      "I was hurt by that."
    ],
    EXPRESS_ANGER: [
      "I am angry.",
      "I am still angry.",
      "I am angry about what happened."
    ],
    REASSURE_NOT_LEAVING: [
      "I am not leaving you.",
      "I am not going to abandon you.",
      "I am still here."
    ],
    ASK_TO_TALK: [
      "Please talk to me.",
      "Can we talk about this?",
      "I want to talk to you."
    ],
    REQUEST_TIME: [
      "I need some time.",
      "Give me a little time.",
      "I need time to think."
    ],
    SAY_GOODBYE_TEMPORARY: [
      "I have to go for now.",
      "I will see you later.",
      "I am leaving for now."
    ],
    PROMISE_RETURN: [
      "I will come back.",
      "I will see you again.",
      "I will come back later."
    ],
    ASK_NOT_TO_DISAPPEAR: [
      "Do not disappear without telling me.",
      "Please do not just disappear.",
      "Tell me before you go."
    ],
    EXPRESS_GRATITUDE: [
      "Thank you.",
      "Thank you for that.",
      "I appreciate it."
    ],
    REASSURE_SAFETY: [
      "You are safe with me.",
      "I will not hurt you.",
      "It is all right. You are safe."
    ],
    EXPRESS_MISSING: [
      "I missed you.",
      "I have missed you.",
      "I wanted to see you."
    ],
    ASK_TO_MEET: [
      "Can I see you again?",
      "I want to see you again.",
      "Can we meet again?"
    ],
    EXPRESS_JEALOUSY: [
      "I was jealous.",
      "I am jealous.",
      "I did not like seeing you with someone else."
    ],
    ASK_ABOUT_OTHER_PERSON: [
      "Who was that?",
      "Who is that person?",
      "Do you know that person well?"
    ],
    AGREE_REQUEST: [
      "All right. I will do it.",
      "Yes. I can do that.",
      "Okay. I agree."
    ],
    DECLINE_REQUEST: [
      "No. I cannot do that.",
      "I do not want to do that.",
      "I am sorry, but I cannot agree."
    ],
    CONFIRM_TRUST: [
      "I trust you.",
      "Yes. I believe you.",
      "I still trust you."
    ],
    ASK_IF_OKAY: [
      "Are you all right?",
      "Are you okay?",
      "Do you feel all right?"
    ]
  };
})();
