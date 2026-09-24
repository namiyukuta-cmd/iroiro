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
    const boundaryList = Array.isArray(a.boundaries) ? a.boundaries : [];

    const distanceBoundary =
      has(boundaryList, "leave_me_alone") ||
      has(boundaryList, "do_not_follow") ||
      has(boundaryList, "do_not_contact") ||
      has(boundaryList, "stop_conversation");

    const touchBoundary =
      has(boundaryList, "do_not_touch") ||
      has(boundaryList, "do_not_kiss") ||
      has(boundaryList, "do_not_hug");

    if (boundaryList.length) {
      add(meaningIds, "RESPECT_BOUNDARY");
      reasons.push("explicit_boundary");
    }

    if (distanceBoundary) {
      add(meaningIds, "ACCEPT_DISTANCE");
      if (has(boundaryList, "do_not_follow")) add(meaningIds, "PROMISE_NOT_FOLLOW");
      if (has(boundaryList, "do_not_contact")) add(meaningIds, "PROMISE_NOT_CONTACT");
      reasons.push("distance_boundary_active");
    }

    if (touchBoundary) {
      if (has(boundaryList, "do_not_touch")) add(meaningIds, "PROMISE_NOT_TOUCH");
      if (has(boundaryList, "do_not_kiss")) add(meaningIds, "PROMISE_NOT_KISS");
      if (has(boundaryList, "do_not_hug")) add(meaningIds, "PROMISE_NOT_HUG");
      reasons.push("physical_boundary_active");
    }

    if (has(a.intents, "question_affection") || has(a.focusConcepts, "love")) {
      if (characterFacts.lovesHeroine === true) {
        add(meaningIds, "AFFIRM_LOVE");
        if (characterFacts.choosesHeroine === true) add(meaningIds, "CONFIRM_CHOICE");
        reasons.push("character_fact_loves_heroine");
      } else if (characterFacts.lovesHeroine === false) {
        add(meaningIds, "DENY_LOVE");
        reasons.push("character_fact_does_not_love_heroine");
      } else {
        add(meaningIds, "EXPRESS_UNCERTAINTY");
        reasons.push("affection_fact_unknown");
      }
    }

    if (has(a.intents, "affirm_affection") && characterFacts.lovesHeroine === true) {
      add(meaningIds, "EXPRESS_CARE");
      reasons.push("mutual_affection_topic");
    }

    if (
      has(a.intents, "fear_betrayal") ||
      has(a.intents, "accuse_betrayal") ||
      has(a.focusConcepts, "betrayal")
    ) {
      if (characterFacts.intendsBetrayal === true || characterFacts.hasBetrayed === true) {
        add(meaningIds, "ADMIT_BETRAYAL");
        reasons.push("betrayal_true");
      } else if (characterFacts.intendsBetrayal === false) {
        add(meaningIds, "DENY_BETRAYAL");
        if (characterFacts.loyalToHeroine === true) add(meaningIds, "PROMISE_LOYALTY");
        reasons.push("betrayal_false");
      } else {
        add(meaningIds, "EXPRESS_NEED_CLARITY");
        reasons.push("betrayal_fact_unclear");
      }
    }

    if (has(a.focusConcepts, "abandonment") || has(a.intents, "seek_reassurance")) {
      if (characterFacts.willAbandonHeroine === false) {
        add(meaningIds, "DENY_ABANDONMENT");
        reasons.push("not_abandoning");
      }
    }

    if (has(a.focusConcepts, "death") || has(a.focusConcepts, "harm")) {
      if (characterFacts.wantsHeroineDead === false || characterFacts.wantsToHarmHeroine === false) {
        add(meaningIds, "REJECT_DEATH_WISH_CLAIM");
        reasons.push("no_death_or_harm_wish");
      }
      if ((psychology.fearOfLoss || 0) >= 40) {
        add(meaningIds, "EXPRESS_FEAR_OF_LOSS");
        reasons.push("fear_of_loss_high");
      }
      if ((psychology.care || psychology.tenderness || 0) >= 40) {
        add(meaningIds, "EXPRESS_CARE");
        reasons.push("care_high");
      }
    }

    if (has(a.intents, "request_reassurance") || has(a.intents, "seek_reassurance")) {
      if (characterFacts.willAbandonHeroine === false) add(meaningIds, "REASSURE_NOT_LEAVING");
      if (characterFacts.trustsHeroine === true) add(meaningIds, "CONFIRM_TRUST");
      if (characterFacts.choosesHeroine === true) add(meaningIds, "CONFIRM_CHOICE");
      reasons.push("reassurance_requested");
    }

    if (has(a.intents, "express_hurt")) {
      if ((psychology.empathy || psychology.tenderness || 0) >= 35) add(meaningIds, "EXPRESS_CONCERN");
      if ((psychology.hurt || 0) >= 35) add(meaningIds, "EXPRESS_HURT");
      reasons.push("hurt_topic");
    }

    if (has(a.intents, "express_anger")) {
      if ((psychology.anger || 0) >= 35) add(meaningIds, "EXPRESS_ANGER");
      if ((psychology.confusion || 0) >= 35) add(meaningIds, "EXPRESS_CONFUSION");
      reasons.push("anger_topic");
    }

    if (has(a.intents, "express_loneliness")) {
      if ((psychology.loneliness || 0) >= 35) add(meaningIds, "EXPRESS_LONELINESS");
      if (!distanceBoundary && (psychology.seekHeroine || 0) >= 50) add(meaningIds, "EXPRESS_WANT_TO_BE_TOGETHER");
      reasons.push("loneliness_topic");
    }

    if (has(a.intents, "express_jealousy")) {
      if ((psychology.jealousy || 0) >= 35) add(meaningIds, "EXPRESS_JEALOUSY");
      if (!distanceBoundary && characterPolicy.askAboutOtherPerson !== false) add(meaningIds, "ASK_ABOUT_OTHER_PERSON");
      reasons.push("jealousy_topic");
    }

    if (has(a.intents, "apologize")) {
      if (characterPolicy.acceptApology === true) add(meaningIds, "ACCEPT_APOLOGY");
      else if (characterPolicy.acceptApology === false) add(meaningIds, "DECLINE_FOR_NOW");
      else add(meaningIds, "EXPRESS_NEED_CLARITY");
      reasons.push("apology_received");
    }

    if (has(a.intents, "ask_relationship_status")) {
      if (characterFacts.wantsRelationship === true) {
        add(meaningIds, "EXPRESS_WANT_TO_BE_TOGETHER");
        if (characterFacts.choosesHeroine === true) add(meaningIds, "CONFIRM_CHOICE");
      } else if (characterFacts.wantsRelationship === false) {
        add(meaningIds, "DENY_LOVE");
      } else {
        add(meaningIds, "EXPRESS_UNCERTAINTY");
      }
      reasons.push("relationship_status_question");
    }

    if (has(a.intents, "ask_feelings")) {
      if (characterFacts.lovesHeroine === true) add(meaningIds, "AFFIRM_LOVE");
      else if (characterFacts.likesHeroine === true) add(meaningIds, "EXPRESS_CARE");
      else if (characterFacts.lovesHeroine === false && characterFacts.likesHeroine === false) add(meaningIds, "DENY_LOVE");
      else add(meaningIds, "EXPRESS_UNCERTAINTY");
      reasons.push("feelings_question");
    }

    if (has(a.intents, "ask_to_meet") && !distanceBoundary) {
      if (characterPolicy.willingToMeet !== false) add(meaningIds, "ASK_TO_MEET");
      else add(meaningIds, "DECLINE_REQUEST");
      reasons.push("meeting_request");
    }

    if (has(a.intents, "ask_to_talk") && !distanceBoundary) {
      add(meaningIds, "ASK_TO_TALK");
      reasons.push("conversation_requested");
    }

    if (has(a.intents, "ask_for_help")) {
      if (characterPolicy.willingToHelp !== false) add(meaningIds, "OFFER_HELP");
      else add(meaningIds, "DECLINE_REQUEST");
      reasons.push("help_request");
    }

    if (has(a.intents, "request_stay") && !distanceBoundary) {
      if (characterPolicy.willingToStay === true) {
        add(meaningIds, "AGREE_REQUEST");
        add(meaningIds, "REQUEST_STAY");
      } else if (characterPolicy.willingToStay === false) {
        add(meaningIds, "DECLINE_REQUEST");
      } else {
        add(meaningIds, "EXPRESS_UNCERTAINTY");
      }
      reasons.push("stay_request");
    }

    if (has(a.intents, "report_condition")) {
      if (has(a.focusConcepts, "food") && characterPolicy.canOfferFood === true) add(meaningIds, "OFFER_FOOD");
      if (has(a.focusConcepts, "water") && characterPolicy.canOfferWater === true) add(meaningIds, "OFFER_DRINK");
      if (has(a.focusConcepts, "health")) add(meaningIds, "ASK_IF_OKAY");
      reasons.push("condition_report");
    }

    if (has(a.intents, "refuse")) {
      add(meaningIds, "RESPECT_BOUNDARY");
      reasons.push("refusal_received");
    }

    if (has(a.intents, "agree")) {
      add(meaningIds, "EXPRESS_RELIEF");
      reasons.push("agreement_received");
    }

    if (meaningIds.length === 0 && has(a.intents, "ask_question")) {
      add(meaningIds, "ASK_FOR_ANSWER");
      reasons.push("generic_question_fallback");
    }

    if (meaningIds.length === 0) {
      add(meaningIds, "EXPRESS_NEED_CLARITY");
      reasons.push("generic_clarity_fallback");
    }

    return {
      meaningIds,
      reasons,
      lexicalTargets: HMW.Dialogue.expandLexicalTargets
        ? HMW.Dialogue.expandLexicalTargets(a)
        : (Array.isArray(a.lexicalTargets) ? [...a.lexicalTargets] : []),
      boundaryActive: distanceBoundary || touchBoundary,
      analysis: a
    };
  };
})();
