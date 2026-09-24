(() => {
  "use strict";
  window.HMW = window.HMW || {};
  HMW.Dialogue = HMW.Dialogue || {};

  const has = (arr, value) => Array.isArray(arr) && arr.includes(value);
  const add = (list, id) => {
    if (id && !list.includes(id)) list.push(id);
  };

  HMW.Dialogue.planResponse = function planResponse({
    analysis = {},
    characterFacts = {},
    characterPolicy = {},
    psychology = {}
  } = {}) {
    const a = HMW.Dialogue.normalizeInputAnalysis
      ? HMW.Dialogue.normalizeInputAnalysis(analysis)
      : analysis;

    const meaningIds = [];
    const reasons = [];
    const boundaryList = Array.isArray(a.boundaries)
      ? a.boundaries
      : Object.entries(a.boundaries || {}).filter(([,v]) => !!v).map(([k]) => k);

    const explicitDistance =
      has(boundaryList, "leave_me_alone") ||
      has(boundaryList, "do_not_follow") ||
      has(boundaryList, "do_not_contact") ||
      has(boundaryList, "stop_conversation");

    if (explicitDistance) {
      add(meaningIds, "ACCEPT_DISTANCE");
      reasons.push("explicit_distance_boundary");
    }

    if (has(a.intents, "question_affection") || has(a.focusConcepts, "love")) {
      if (characterFacts.lovesHeroine === true) {
        add(meaningIds, "AFFIRM_LOVE");
        reasons.push("character_fact_loves_heroine");
      } else if (characterFacts.lovesHeroine === false) {
        add(meaningIds, "DENY_LOVE");
        reasons.push("character_fact_does_not_love_heroine");
      }
    }

    if (
      has(a.intents, "fear_betrayal") ||
      has(a.intents, "accuse_betrayal") ||
      has(a.focusConcepts, "betrayal")
    ) {
      if (characterFacts.intendsBetrayal === true || characterFacts.hasBetrayed === true) {
        add(meaningIds, "ADMIT_BETRAYAL");
        reasons.push("character_fact_betrayal_true");
      } else if (characterFacts.intendsBetrayal === false) {
        add(meaningIds, "DENY_BETRAYAL");
        reasons.push("character_fact_betrayal_false");
      }
    }

    if (has(a.focusConcepts, "death") || has(a.focusConcepts, "harm")) {
      if (characterFacts.wantsHeroineDead === false || characterFacts.wantsToHarmHeroine === false) {
        add(meaningIds, "REJECT_DEATH_WISH_CLAIM");
        reasons.push("character_fact_no_death_wish");
      }
      if ((psychology.fearOfLoss || 0) >= 40) {
        add(meaningIds, "EXPRESS_FEAR_OF_LOSS");
        reasons.push("fear_of_loss_high");
      }
    }

    if (has(a.intents, "seek_reassurance") || has(a.intents, "request_reassurance")) {
      if (characterFacts.willAbandonHeroine === false) {
        add(meaningIds, "REASSURE_NOT_LEAVING");
        reasons.push("character_fact_not_abandoning");
      }
      if (characterFacts.trustsHeroine === true) {
        add(meaningIds, "CONFIRM_TRUST");
        reasons.push("character_fact_trusts_heroine");
      }
    }

    if (has(a.intents, "express_hurt")) {
      add(meaningIds, "EXPRESS_HURT");
      reasons.push("respond_to_hurt_topic");
    }

    if (has(a.intents, "express_anger") && (psychology.anger || 0) >= 35) {
      add(meaningIds, "EXPRESS_ANGER");
      reasons.push("npc_anger_active");
    }

    if (has(a.intents, "apologize")) {
      if (characterPolicy.acceptApology === true) {
        add(meaningIds, "ACCEPT_APOLOGY");
        reasons.push("policy_accept_apology");
      }
    }

    if (has(a.intents, "ask_to_talk") && !explicitDistance) {
      add(meaningIds, "ASK_TO_TALK");
      reasons.push("conversation_requested");
    }

    if (has(a.intents, "ask_for_help")) {
      if (characterPolicy.willingToHelp !== false) {
        add(meaningIds, "OFFER_HELP");
        reasons.push("help_allowed");
      } else {
        add(meaningIds, "DECLINE_REQUEST");
        reasons.push("help_refused");
      }
    }

    if (has(a.intents, "request_stay") && !explicitDistance) {
      if (characterPolicy.willingToStay === true) {
        add(meaningIds, "AGREE_REQUEST");
        add(meaningIds, "REQUEST_STAY");
        reasons.push("stay_mutual");
      } else if (characterPolicy.willingToStay === false) {
        add(meaningIds, "DECLINE_REQUEST");
        reasons.push("stay_refused");
      }
    }

    if (meaningIds.length === 0 && has(a.intents, "ask_question")) {
      add(meaningIds, "ASK_FOR_HONEST_ANSWER");
      reasons.push("generic_question_fallback");
    }

    return {
      meaningIds,
      reasons,
      lexicalTargets: Array.isArray(a.lexicalTargets) ? [...a.lexicalTargets] : [],
      boundaryActive: explicitDistance,
      analysis: a
    };
  };
})();
