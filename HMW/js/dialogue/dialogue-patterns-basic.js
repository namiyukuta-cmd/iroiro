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
    ],
    EXPRESS_JOY: [
      "I am happy.",
      "I am glad.",
      "I am really happy to see you."
    ],
    EXPRESS_LONELINESS: [
      "I was lonely.",
      "I have been feeling lonely.",
      "I did not like being alone."
    ],
    EXPRESS_ANXIETY: [
      "I am worried.",
      "I feel uneasy.",
      "I do not know what will happen."
    ],
    ASK_RELATIONSHIP_STATUS: [
      "What are we?",
      "What do you think we are?",
      "How do you see our relationship?"
    ],
    ASK_FEELINGS: [
      "How do you feel about me?",
      "What do you think of me?",
      "Do you have feelings for me?"
    ],
    EXPRESS_WANT_TO_BE_TOGETHER: [
      "I want to be with you.",
      "I want us to stay together.",
      "I want to spend more time with you."
    ],
    ASK_TO_STAY_CLOSE: [
      "Stay close to me.",
      "Please stay near me.",
      "I want you close to me."
    ],
    ASK_PERMISSION_TOUCH: [
      "Can I touch you?",
      "May I touch your hand?",
      "Is it all right if I touch you?"
    ],
    ASK_PERMISSION_HUG: [
      "Can I hug you?",
      "May I hold you?",
      "Is it all right if I hug you?"
    ],
    ASK_PERMISSION_KISS: [
      "Can I kiss you?",
      "May I kiss you?",
      "Is it all right if I kiss you?"
    ],
    EXPRESS_TIRED: [
      "I am tired.",
      "I am really tired.",
      "I need some rest."
    ],
    EXPRESS_HUNGRY: [
      "I am hungry.",
      "I have not eaten yet.",
      "I need something to eat."
    ],
    EXPRESS_COLD: [
      "I am cold.",
      "It is too cold for me.",
      "I cannot get warm."
    ],
    OFFER_HELP: [
      "Can I help you?",
      "Let me help you.",
      "I can help you."
    ],
    ASK_FOR_HELP: [
      "Can you help me?",
      "Please help me.",
      "I need your help."
    ],
    OFFER_FOOD: [
      "Would you like something to eat?",
      "You should eat something.",
      "I have some food for you."
    ],
    OFFER_DRINK: [
      "Would you like something to drink?",
      "Do you want some water?",
      "I have something for you to drink."
    ],
    ASK_TO_WAIT: [
      "Wait for me.",
      "Please wait a moment.",
      "Can you wait for me?"
    ],
    ASK_TO_GO_TOGETHER: [
      "Let us go together.",
      "Come with me.",
      "Can we go together?"
    ],
    ASK_DESTINATION: [
      "Where are you going?",
      "Where are you headed?",
      "Where do you want to go?"
    ],
    EXPRESS_SLEEPY: [
      "I am sleepy.",
      "I am getting sleepy.",
      "I need some sleep."
    ],
    ASK_TO_REST: [
      "Let us rest for a while.",
      "We should rest.",
      "Can we take a break?"
    ],
    ASK_ABOUT_WORK: [
      "How was work?",
      "Did you work today?",
      "What kind of work did you do?"
    ],
    EXPRESS_WORK_TIREDNESS: [
      "Work was tiring today.",
      "I am tired from work.",
      "It was a long day at work."
    ],
    ASK_ABOUT_MONEY: [
      "Do you have enough money?",
      "How much money do you have?",
      "Can you afford it?"
    ],
    EXPRESS_NO_MONEY: [
      "I do not have any money.",
      "I am out of money.",
      "I cannot afford it."
    ],
    COMMENT_RAIN: [
      "It is raining.",
      "The rain is getting heavier.",
      "It looks like it will keep raining."
    ],
    COMMENT_COLD_WEATHER: [
      "It is cold today.",
      "The weather is getting colder.",
      "It is colder than I expected."
    ],
    SAY_GOING_HOME: [
      "I am going home.",
      "I should head back.",
      "I am going back now."
    ],
    ASK_IF_COMING_BACK: [
      "Are you coming back?",
      "Will you come back later?",
      "When will you be back?"
    ]
  };
})();
