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
    psychology = {},
    relationship = {},
    conversationContext = {},
    recentMeaningIds = []
  } = {}) {
    const a = HMW.Dialogue.normalizeInputAnalysis
      ? HMW.Dialogue.normalizeInputAnalysis(analysis)
      : analysis;

    const meaningIds = [];
    const reasons = [];
    const slotOverridesByMeaning = {};
    const setSlots = (id, slots) => {
      slotOverridesByMeaning[id] = {
        ...(slotOverridesByMeaning[id] || {}),
        ...(slots || {})
      };
    };
    const boundaryList = Array.isArray(a.boundaries) ? a.boundaries : [];
    const questions = Array.isArray(a.questions) ? a.questions : [];
    const firstQuestion = questions[0] || null;
    const questionOfKind = kind =>
      questions.find(question => question?.kind === kind) || null;

    const claimInfo = HMW.Dialogue.interpretClaims
      ? HMW.Dialogue.interpretClaims(a.claims || [])
      : {
          concepts: [],
          has: () => false,
          hasType: () => false,
          needsNpcFactLookup: () => false
        };
    const claimHas = concept =>
      typeof claimInfo.has === "function" && claimInfo.has(concept);


    const distanceBoundary =
      has(boundaryList, "leave_me_alone") ||
      has(boundaryList, "do_not_follow") ||
      has(boundaryList, "do_not_contact") ||
      has(boundaryList, "stop_conversation");

    const touchBoundary =
      has(boundaryList, "do_not_touch") ||
      has(boundaryList, "do_not_kiss") ||
      has(boundaryList, "do_not_hug");

    const actionBlockedByBoundary = action => {
      const value = String(action || "").toLowerCase();
      if (
        value === "touch" &&
        (has(boundaryList, "do_not_touch") ||
         has(boundaryList, "do_not_hug") ||
         has(boundaryList, "do_not_kiss"))
      ) return true;
      if (
        value === "hug" &&
        (has(boundaryList, "do_not_hug") || has(boundaryList, "do_not_touch"))
      ) return true;
      if (
        value === "kiss" &&
        (has(boundaryList, "do_not_kiss") || has(boundaryList, "do_not_touch"))
      ) return true;
      if (
        (value === "call" || value === "message" || value === "contact") &&
        (has(boundaryList, "do_not_contact") ||
         has(boundaryList, "do_not_call") ||
         has(boundaryList, "do_not_message"))
      ) return true;
      if (value === "enter" && has(boundaryList, "do_not_enter")) return true;
      if (value === "wait" && has(boundaryList, "do_not_wait")) return true;
      if (value === "visit" && has(boundaryList, "do_not_visit")) return true;
      if (value === "follow" && has(boundaryList, "do_not_follow")) return true;
      if (
        (value === "talk" || value === "ask") &&
        (has(boundaryList, "stop_conversation") || has(boundaryList, "do_not_ask"))
      ) return true;
      return false;
    };

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

    if (
      has(a.intents, "question_affection") ||
      has(a.focusConcepts, "love") ||
      claimHas("love") ||
      claimHas("like")
    ) {
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
      has(a.focusConcepts, "betrayal") ||
      claimHas("betrayal")
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

    if (
      has(a.focusConcepts, "abandonment") ||
      has(a.intents, "seek_reassurance") ||
      claimHas("abandonment")
    ) {
      if (characterFacts.willAbandonHeroine === false) {
        add(meaningIds, "DENY_ABANDONMENT");
        reasons.push("not_abandoning");
      }
    }

    if (
      has(a.focusConcepts, "death") ||
      has(a.focusConcepts, "harm") ||
      claimHas("death") ||
      claimHas("harm")
    ) {
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

    if (
      has(a.intents, "ask_relationship_status") ||
      questionOfKind("relationship_status")
    ) {
      const status = characterFacts.relationshipStatus;
      if (status != null && status !== "") {
        add(meaningIds, "STATE_RELATIONSHIP_STATUS");
        setSlots("STATE_RELATIONSHIP_STATUS", {
          RELATIONSHIP: String(status)
        });
      } else {
        add(meaningIds, "ANSWER_UNKNOWN");
      }
      reasons.push("answer_relationship_status_question");
    }

    if (
      has(a.intents, "ask_feelings") ||
      questionOfKind("feelings")
    ) {
      const feelings = characterFacts.feelingsTowardHeroine;
      if (feelings != null && feelings !== "") {
        add(meaningIds, "STATE_FEELINGS_TOWARD_HEROINE");
        setSlots("STATE_FEELINGS_TOWARD_HEROINE", {
          FEELINGS: String(feelings)
        });
      } else if (characterFacts.lovesHeroine === true) {
        add(meaningIds, "AFFIRM_LOVE");
      } else if (characterFacts.likesHeroine === true) {
        add(meaningIds, "EXPRESS_CARE");
      } else if (
        characterFacts.lovesHeroine === false &&
        characterFacts.likesHeroine === false
      ) {
        add(meaningIds, "DENY_LOVE");
      } else {
        add(meaningIds, "ANSWER_UNKNOWN");
      }
      reasons.push("answer_feelings_question");
    }

    if (has(a.intents, "ask_to_meet") && !distanceBoundary) {
      if (conversationContext.availableNow === false || conversationContext.mustLeaveNow === true) {
        add(meaningIds, "DECLINE_REQUEST");
        add(meaningIds, "REQUEST_TIME");
        reasons.push("conversation_context_blocks_meeting");
      } else if (characterPolicy.willingToMeet !== false) {
        add(meaningIds, "AGREE_REQUEST");
      } else {
        add(meaningIds, "DECLINE_REQUEST");
      }
      reasons.push("meeting_request_answered");
    }

    if (has(a.intents, "ask_to_talk") && !distanceBoundary) {
      if (
        conversationContext.canTalkFreely === false ||
        conversationContext.mustLeaveNow === true ||
        conversationContext.timePressure === true
      ) {
        add(meaningIds, "DECLINE_REQUEST");
        add(meaningIds, "REQUEST_TIME");
        reasons.push("conversation_context_blocks_talk");
      } else if (characterPolicy.willingToTalk !== false) {
        add(meaningIds, "AGREE_REQUEST");
      } else {
        add(meaningIds, "DECLINE_REQUEST");
      }
      reasons.push("conversation_request_answered");
    }

    if (has(a.intents, "ask_for_help")) {
      if (characterPolicy.willingToHelp !== false) add(meaningIds, "OFFER_HELP");
      else add(meaningIds, "DECLINE_REQUEST");
      reasons.push("help_request");
    }

    if (has(a.intents, "request_stay") && !distanceBoundary) {
      if (conversationContext.mustLeaveNow === true) {
        add(meaningIds, "DECLINE_REQUEST");
        add(meaningIds, "REQUEST_TIME");
        reasons.push("conversation_context_blocks_stay");
      } else if (characterPolicy.willingToStay === true) {
        add(meaningIds, "AGREE_REQUEST");
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
      if (has(a.focusConcepts, "health")) {
        const positivity = Number(a.tone?.positivity);
        const hesitation = Number(a.tone?.hesitation);
        if (
          Number.isFinite(positivity) &&
          positivity >= 65 &&
          (!Number.isFinite(hesitation) || hesitation <= 35)
        ) {
          add(meaningIds, "EXPRESS_RELIEF");
        } else {
          add(meaningIds, "ASK_IF_OKAY");
        }
      }
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


    if (has(a.intents, "greet")) {
      add(meaningIds, "RETURN_GREETING");
      reasons.push("greeting_received");
    }

    if (has(a.intents, "say_goodbye")) {
      add(meaningIds, "SAY_GOODBYE");
      reasons.push("parting_received");
    }

    if (has(a.intents, "ask_where") || questionOfKind("where")) {
      if (characterFacts.currentLocation) {
        add(meaningIds, "STATE_CURRENT_LOCATION");
        setSlots("STATE_CURRENT_LOCATION", {
          SUBJECT: "I",
          BE: "am",
          LOCATION: String(characterFacts.currentLocation)
        });
        reasons.push("answer_current_location");
      } else {
        add(meaningIds, "ANSWER_UNKNOWN");
        reasons.push("current_location_unknown");
      }
    }

    if (has(a.intents, "ask_when") || questionOfKind("when")) {
      const whenQuestion = questionOfKind("when");
      const requestedField = whenQuestion?.requestedField;
      const timeValue =
        (requestedField && characterFacts[requestedField] != null
          ? characterFacts[requestedField]
          : null) ??
        characterFacts.availableTime ??
        characterFacts.returnTime;
      if (timeValue != null) {
        add(meaningIds, "STATE_AVAILABLE_TIME");
        setSlots("STATE_AVAILABLE_TIME", {
          SUBJECT: "I",
          BE: "am",
          TIME: String(timeValue)
        });
        reasons.push("answer_time");
      } else {
        add(meaningIds, "ANSWER_UNKNOWN");
        reasons.push("time_unknown");
      }
    }

    if (has(a.intents, "ask_health")) {
      if (characterFacts.healthStatus) {
        add(meaningIds, "STATE_CONDITION");
        setSlots("STATE_CONDITION", {
          SUBJECT: "I",
          BE: "am",
          ADJECTIVE: String(characterFacts.healthStatus)
        });
      } else {
        add(meaningIds, "ANSWER_UNKNOWN");
      }
      reasons.push("answer_health_question");
    }

    if (has(a.intents, "ask_sleep")) {
      if (characterFacts.sleptWell === true) add(meaningIds, "STATE_SLEEP_STATUS_GOOD");
      else if (characterFacts.sleptWell === false) add(meaningIds, "STATE_SLEEP_STATUS_BAD");
      else add(meaningIds, "ANSWER_UNKNOWN");
      reasons.push("answer_sleep_question");
    }

    if (has(a.intents, "ask_food")) {
      if (characterFacts.hasEaten === true) add(meaningIds, "STATE_FOOD_STATUS_EATEN");
      else if (characterFacts.hasEaten === false) add(meaningIds, "STATE_FOOD_STATUS_NOT_EATEN");
      else add(meaningIds, "ANSWER_UNKNOWN");
      reasons.push("answer_food_question");
    }

    if (has(a.intents, "ask_home")) {
      const home = characterFacts.homeLocation ?? characterFacts.currentShelter;
      if (home) {
        add(meaningIds, "STATE_HOME");
        setSlots("STATE_HOME", { SUBJECT:"I", LOCATION:String(home) });
      } else {
        add(meaningIds, "ANSWER_UNKNOWN");
      }
      reasons.push("answer_home_question");
    }

    if (has(a.intents, "offer_help")) {
      if (has(a.focusConcepts, "sleep")) add(meaningIds, "OFFER_REST");
      else if (has(a.focusConcepts, "weather")) {
        add(meaningIds, "OFFER_WARMTH");
        add(meaningIds, "OFFER_SHELTER");
      } else {
        add(meaningIds, "OFFER_HELP");
      }
      reasons.push("help_offered");
    }

    if (has(a.intents, "report_event")) {
      add(meaningIds, "ACKNOWLEDGE_EVENT");
      if ((a.emotions?.sadness || 0) >= 45 || (a.emotions?.hurt || 0) >= 45) {
        add(meaningIds, "EXPRESS_SYMPATHY");
      } else if ((a.emotions?.joy || 0) >= 45) {
        add(meaningIds, "EXPRESS_APPROVAL");
      } else if ((a.emotions?.fear || 0) >= 45) {
        add(meaningIds, "EXPRESS_CONCERN");
      } else {
        add(meaningIds, "ASK_FOR_DETAILS");
      }
      reasons.push("event_reported");
    }

    if (has(a.intents, "state_plan")) {
      add(meaningIds, "STATE_PLAN");
      reasons.push("plan_stated");
    }

    if (has(a.intents, "state_preference")) {
      add(meaningIds, "STATE_PREFERENCE");
      reasons.push("preference_stated");
    }

    if (has(a.intents, "express_surprise")) {
      add(meaningIds, "EXPRESS_SURPRISE");
      reasons.push("surprise_topic");
    }

    if (has(a.intents, "express_approval")) {
      add(meaningIds, "EXPRESS_APPROVAL");
      reasons.push("approval_topic");
    }

    if (has(a.intents, "express_disapproval")) {
      add(meaningIds, "EXPRESS_DISAPPROVAL");
      reasons.push("disapproval_topic");
    }


    if (has(a.intents, "ask_plan") || questionOfKind("plan")) {
      const plan = characterFacts.currentPlan;
      if (plan && typeof plan === "object" && plan.verb) {
        add(meaningIds, "STATE_CURRENT_PLAN");
        setSlots("STATE_CURRENT_PLAN", {
          SUBJECT: "I",
          VERB_BASE: String(plan.verb),
          OBJECT: String(plan.object || ""),
          TIME: String(plan.time || "")
        });
      } else {
        add(meaningIds, "ANSWER_UNKNOWN");
      }
      reasons.push("answer_plan_question");
    }

    if (has(a.intents, "ask_preference") || questionOfKind("preference")) {
      const preferenceQuestion = questionOfKind("preference");
      const preference = characterFacts.currentPreference ??
        characterFacts.preferences?.[preferenceQuestion?.target || ""];
      if (preference != null) {
        add(meaningIds, "STATE_CURRENT_PREFERENCE");
        setSlots("STATE_CURRENT_PREFERENCE", {
          SUBJECT: "I",
          OBJECT: String(preference)
        });
      } else {
        add(meaningIds, "ANSWER_UNKNOWN");
      }
      reasons.push("answer_preference_question");
    }

    if (has(a.intents, "ask_work")) {
      if (characterFacts.workStatus) {
        add(meaningIds, "STATE_WORK_STATUS");
        setSlots("STATE_WORK_STATUS", {
          BE: "is",
          ADJECTIVE: String(characterFacts.workStatus)
        });
      } else {
        add(meaningIds, "ANSWER_UNKNOWN");
      }
      reasons.push("answer_work_status_question");
    }

    if (has(a.intents, "ask_money")) {
      if (characterFacts.hasEnoughMoney === false) {
        add(meaningIds, "STATE_NO_MONEY");
      } else if (characterFacts.moneyAmount != null || characterFacts.hasEnoughMoney === true) {
        add(meaningIds, "STATE_MONEY_STATUS");
        setSlots("STATE_MONEY_STATUS", {
          SUBJECT: "I",
          AMOUNT: characterFacts.moneyAmount != null
            ? String(characterFacts.moneyAmount)
            : "enough money"
        });
      } else {
        add(meaningIds, "ANSWER_UNKNOWN");
      }
      reasons.push("answer_money_status_question");
    }

    if (has(a.intents, "ask_hunger")) {
      if (typeof characterFacts.hungry === "boolean") {
        add(meaningIds, "STATE_CONDITION");
        setSlots("STATE_CONDITION", {
          SUBJECT:"I", BE:"am",
          ADJECTIVE:characterFacts.hungry ? "hungry" : "not hungry"
        });
      } else add(meaningIds, "ANSWER_UNKNOWN");
      reasons.push("answer_hunger_question");
    }

    if (has(a.intents, "ask_thirst")) {
      if (typeof characterFacts.thirsty === "boolean") {
        add(meaningIds, "STATE_CONDITION");
        setSlots("STATE_CONDITION", {
          SUBJECT:"I", BE:"am",
          ADJECTIVE:characterFacts.thirsty ? "thirsty" : "not thirsty"
        });
      } else add(meaningIds, "ANSWER_UNKNOWN");
      reasons.push("answer_thirst_question");
    }

    if (has(a.intents, "ask_tiredness")) {
      if (typeof characterFacts.tired === "boolean") {
        add(meaningIds, "STATE_CONDITION");
        setSlots("STATE_CONDITION", {
          SUBJECT:"I", BE:"am",
          ADJECTIVE:characterFacts.tired ? "tired" : "not tired"
        });
      } else add(meaningIds, "ANSWER_UNKNOWN");
      reasons.push("answer_tiredness_question");
    }

    if (has(a.intents, "offer_company") && !distanceBoundary) {
      add(meaningIds, "OFFER_COMPANY");
      reasons.push("company_offered");
    }

    if (has(a.intents, "offer_contact") && !has(boundaryList, "do_not_contact")) {
      add(meaningIds, "OFFER_CONTACT");
      reasons.push("contact_offered");
    }

    if (has(a.intents, "request_contact")) {
      if (characterPolicy.allowContact === false || has(boundaryList, "do_not_contact")) {
        add(meaningIds, "DECLINE_CONTACT");
        reasons.push("contact_declined");
      } else {
        add(meaningIds, "ACCEPT_CONTACT");
        reasons.push("contact_accepted");
      }
    }

    if (has(a.intents, "ask_permission_enter")) {
      add(
        meaningIds,
        characterPolicy.allowEntry === false ? "DECLINE_REQUEST" : "AGREE_REQUEST"
      );
      reasons.push("entry_permission_answered");
    }

    if (has(a.intents, "ask_permission_wait")) {
      add(
        meaningIds,
        characterPolicy.allowWaiting === false ? "DECLINE_REQUEST" : "AGREE_REQUEST"
      );
      reasons.push("wait_permission_answered");
    }

    if (has(a.intents, "express_disappointment")) {
      add(meaningIds, "EXPRESS_DISAPPOINTMENT");
      reasons.push("disappointment_expression");
    }

    if (has(a.intents, "express_hope")) {
      add(meaningIds, "EXPRESS_HOPE");
      reasons.push("hope_expression");
    }

    if (has(a.intents, "express_pride")) {
      add(meaningIds, "EXPRESS_PRIDE");
      reasons.push("pride_expression");
    }

    if (has(a.intents, "confirm_arrival")) {
      add(meaningIds, "CONFIRM_ARRIVAL");
      reasons.push("arrival_confirmation");
    }

    if (has(a.intents, "confirm_departure")) {
      add(meaningIds, "CONFIRM_DEPARTURE");
      reasons.push("departure_confirmation");
    }

    if (has(a.intents, "ask_return_time")) {
      if (characterFacts.returnTime != null) {
        add(meaningIds, "STATE_RETURN_TIME");
        setSlots("STATE_RETURN_TIME", {
          SUBJECT:"I",
          TIME:String(characterFacts.returnTime)
        });
      } else {
        add(meaningIds, "ANSWER_UNKNOWN");
      }
      reasons.push("answer_return_time_question");
    }

    if (has(a.intents, "ask_possession") || questionOfKind("possession")) {
      const possessionQuestion = questionOfKind("possession");
      const target = possessionQuestion?.target || a.lexicalTargets?.[0] || "it";
      const value = characterFacts.possessions?.[target];
      if (typeof value === "number") {
        add(meaningIds, "STATE_QUANTITY");
        setSlots("STATE_QUANTITY", {
          SUBJECT:"I", QUANTITY:String(value), OBJECT:String(target)
        });
      } else if (value === true) {
        add(meaningIds, "CONFIRM_POSSESSION");
        setSlots("CONFIRM_POSSESSION", { SUBJECT:"I", OBJECT:String(target) });
      } else if (value === false) {
        add(meaningIds, "DENY_POSSESSION");
        setSlots("DENY_POSSESSION", { SUBJECT:"I", OBJECT:String(target) });
      } else {
        add(meaningIds, "ANSWER_UNKNOWN");
      }
      reasons.push("answer_possession_question");
    }

    if (has(a.intents, "ask_capability") || questionOfKind("capability")) {
      const capabilityQuestion = questionOfKind("capability");
      const action = capabilityQuestion?.action || capabilityQuestion?.target || a.lexicalTargets?.[0] || "do";
      const value = characterFacts.capabilities?.[action];
      if (value === true) {
        add(meaningIds, "CONFIRM_CAPABILITY");
        setSlots("CONFIRM_CAPABILITY", {
          SUBJECT:"I", VERB_BASE:String(action), OBJECT:""
        });
      } else if (value === false) {
        add(meaningIds, "DENY_CAPABILITY");
        setSlots("DENY_CAPABILITY", {
          SUBJECT:"I", VERB_BASE:String(action), OBJECT:""
        });
      } else {
        add(meaningIds, "ANSWER_UNKNOWN");
      }
      reasons.push("answer_capability_question");
    }

    if (has(a.intents, "ask_availability") || questionOfKind("availability")) {
      if (characterFacts.available === true) {
        add(meaningIds, "CONFIRM_AVAILABLE");
        setSlots("CONFIRM_AVAILABLE", {
          SUBJECT:"I", BE:"am", AVAILABILITY:"available",
          TIME:String(characterFacts.availableTime || "")
        });
      } else if (characterFacts.available === false) {
        add(meaningIds, "DENY_AVAILABLE");
        setSlots("DENY_AVAILABLE", {
          SUBJECT:"I", BE:"am", AVAILABILITY:"not available",
          TIME:String(characterFacts.availableTime || "")
        });
      } else {
        add(meaningIds, "ANSWER_UNKNOWN");
      }
      reasons.push("answer_availability_question");
    }


    if (has(a.intents, "ask_identity") || questionOfKind("identity")) {
      const identityQuestion = questionOfKind("identity");
      const field = identityQuestion?.requestedField || "name";
      if (field === "role" || field === "jobRole") {
        const role = characterFacts.jobRole ?? characterFacts.role;
        if (role) {
          add(meaningIds, "STATE_IDENTITY_ROLE");
          setSlots("STATE_IDENTITY_ROLE", {
            ARTICLE: "",
            ROLE: String(role)
          });
        } else add(meaningIds, "ANSWER_UNKNOWN");
      } else {
        const name = characterFacts.name;
        if (name) {
          add(meaningIds, "STATE_IDENTITY_NAME");
          setSlots("STATE_IDENTITY_NAME", { NAME:String(name) });
        } else add(meaningIds, "ANSWER_UNKNOWN");
      }
      reasons.push("answer_identity_question");
    }

    if (has(a.intents, "ask_origin") || questionOfKind("origin")) {
      const origin = characterFacts.origin;
      if (origin) {
        add(meaningIds, "STATE_ORIGIN");
        setSlots("STATE_ORIGIN", { PLACE:String(origin) });
      } else add(meaningIds, "ANSWER_UNKNOWN");
      reasons.push("answer_origin_question");
    }

    if (has(a.intents, "ask_destination") || questionOfKind("destination")) {
      const destination = characterFacts.destination;
      if (destination) {
        add(meaningIds, "STATE_DESTINATION");
        setSlots("STATE_DESTINATION", { PLACE:String(destination) });
      } else add(meaningIds, "ANSWER_UNKNOWN");
      reasons.push("answer_destination_question");
    }

    if (has(a.intents, "ask_reason") || questionOfKind("reason")) {
      const reasonQuestion = questionOfKind("reason");
      const key = reasonQuestion?.target || reasonQuestion?.action || "default";
      const reason =
        characterFacts.reasons?.[key] ??
        characterFacts.reason ??
        characterFacts.currentReason;
      if (reason) {
        add(meaningIds, "STATE_REASON");
        setSlots("STATE_REASON", {
          VERB:"did it",
          OBJECT:"",
          CLAUSE:String(reason)
        });
      } else {
        add(meaningIds, "ANSWER_UNKNOWN");
      }
      reasons.push("answer_reason_question");
    }

    if (has(a.intents, "ask_opinion") || questionOfKind("opinion")) {
      const opinionQuestion = questionOfKind("opinion");
      const key = opinionQuestion?.target || "default";
      const opinion = characterFacts.opinions?.[key] ?? characterFacts.opinion;
      if (opinion) {
        add(meaningIds, "STATE_OPINION");
        setSlots("STATE_OPINION", { CLAUSE:String(opinion) });
      } else add(meaningIds, "ANSWER_UNKNOWN");
      reasons.push("answer_opinion_question");
    }

    if (has(a.intents, "ask_price") || questionOfKind("price")) {
      const priceQuestion = questionOfKind("price");
      const target = priceQuestion?.target || a.lexicalTargets?.[0] || "item";
      const price = characterFacts.prices?.[target] ?? characterFacts.price;
      if (price != null) {
        add(meaningIds, "STATE_PRICE");
        setSlots("STATE_PRICE", { AMOUNT:String(price) });
      } else add(meaningIds, "ANSWER_UNKNOWN");
      reasons.push("answer_price_question");
    }

    if (has(a.intents, "ask_quantity") || questionOfKind("quantity")) {
      const quantityQuestion = questionOfKind("quantity");
      const target = quantityQuestion?.target || a.lexicalTargets?.[0] || "item";
      const count = characterFacts.quantities?.[target] ?? characterFacts.quantity;
      if (count != null) {
        add(meaningIds, "STATE_COUNT");
        setSlots("STATE_COUNT", {
          QUANTITY:String(count),
          OBJECT:String(target)
        });
      } else add(meaningIds, "ANSWER_UNKNOWN");
      reasons.push("answer_quantity_question");
    }

    if (has(a.intents, "ask_work_location") || questionOfKind("work_location")) {
      const workLocation = characterFacts.workLocation;
      if (workLocation) {
        add(meaningIds, "STATE_WORK_LOCATION");
        setSlots("STATE_WORK_LOCATION", { PLACE:String(workLocation) });
      } else add(meaningIds, "ANSWER_UNKNOWN");
      reasons.push("answer_work_location_question");
    }

    if (has(a.intents, "ask_job_role") || questionOfKind("job_role")) {
      const jobRole = characterFacts.jobRole ?? characterFacts.role;
      if (jobRole) {
        add(meaningIds, "STATE_JOB_ROLE");
        setSlots("STATE_JOB_ROLE", { ROLE:String(jobRole) });
      } else add(meaningIds, "ANSWER_UNKNOWN");
      reasons.push("answer_job_role_question");
    }

    if (has(a.intents, "ask_knowledge") || questionOfKind("knowledge")) {
      const knowledgeQuestion = questionOfKind("knowledge");
      const target = knowledgeQuestion?.target || "default";
      const knows = characterFacts.knowledge?.[target];
      if (knows === true) add(meaningIds, "CONFIRM_KNOWLEDGE");
      else if (knows === false) add(meaningIds, "DENY_KNOWLEDGE");
      else add(meaningIds, "ANSWER_UNKNOWN");
      reasons.push("answer_knowledge_question");
    }

    if (has(a.intents, "ask_fact") || questionOfKind("fact")) {
      const factQuestion = questionOfKind("fact");
      const target = factQuestion?.target || "default";
      const fact = characterFacts.facts?.[target];
      if (fact === true) add(meaningIds, "CONFIRM_FACT");
      else if (fact === false) add(meaningIds, "DENY_FACT");
      else add(meaningIds, "ANSWER_UNKNOWN");
      reasons.push("answer_fact_question");
    }


    if (has(a.intents, "ask_desire") || questionOfKind("desire")) {
      const desireQuestion = questionOfKind("desire");
      const value =
        characterFacts.currentDesire ??
        characterFacts.desires?.[desireQuestion?.target || "default"];
      if (value != null) {
        add(meaningIds, "STATE_DESIRE");
        setSlots("STATE_DESIRE", { OBJECT:String(value) });
      } else {
        add(meaningIds, "ANSWER_UNKNOWN");
      }
      reasons.push("answer_desire_question");
    }

    if (has(a.intents, "ask_need") || questionOfKind("need")) {
      const needQuestion = questionOfKind("need");
      const value =
        characterFacts.currentNeed ??
        characterFacts.needs?.[needQuestion?.target || "default"];
      if (value != null) {
        add(meaningIds, "STATE_NEED");
        setSlots("STATE_NEED", { OBJECT:String(value) });
      } else {
        add(meaningIds, "ANSWER_UNKNOWN");
      }
      reasons.push("answer_need_question");
    }

    if (has(a.intents, "ask_choice") || questionOfKind("choice")) {
      const choiceQuestion = questionOfKind("choice");
      const value =
        characterFacts.currentChoice ??
        characterFacts.choices?.[choiceQuestion?.target || "default"];
      if (value != null) {
        add(meaningIds, "STATE_CHOICE");
        setSlots("STATE_CHOICE", { OBJECT:String(value) });
      } else {
        add(meaningIds, "ANSWER_UNKNOWN");
      }
      reasons.push("answer_choice_question");
    }

    if (has(a.intents, "ask_certainty") || questionOfKind("certainty")) {
      const value =
        typeof characterFacts.certain === "boolean"
          ? characterFacts.certain
          : characterFacts.certainty;
      if (value === true || Number(value) >= 70) {
        add(meaningIds, "EXPRESS_CERTAINTY");
      } else if (value === false || (Number.isFinite(Number(value)) && Number(value) < 70)) {
        add(meaningIds, "EXPRESS_UNCERTAINTY");
      } else {
        add(meaningIds, "ANSWER_UNKNOWN");
      }
      reasons.push("answer_certainty_question");
    }

    if (has(a.intents, "ask_event") || questionOfKind("event")) {
      const eventQuestion = questionOfKind("event");
      const event =
        characterFacts.lastEvent ??
        characterFacts.events?.[eventQuestion?.target || "latest"];
      if (event != null) {
        add(meaningIds, "STATE_EVENT");
        setSlots("STATE_EVENT", { CLAUSE:String(event) });
      } else {
        add(meaningIds, "ANSWER_UNKNOWN");
      }
      reasons.push("answer_event_question");
    }


    if (
      has(a.intents, "ask_permission_action") ||
      questionOfKind("permission")
    ) {
      const actionQuestion = questionOfKind("permission");
      const action = actionQuestion?.action || actionQuestion?.target || "default";
      const value = characterPolicy.permissions?.[action];
      if (actionBlockedByBoundary(action)) {
        add(meaningIds, "DENY_PERMISSION");
        reasons.push("permission_blocked_by_boundary");
      } else if (value === true) add(meaningIds, "GRANT_PERMISSION");
      else if (value === false) add(meaningIds, "DENY_PERMISSION");
      else add(meaningIds, "ANSWER_UNKNOWN");
      reasons.push("answer_permission_question");
    }

    if (
      has(a.intents, "request_action") ||
      questionOfKind("request_action")
    ) {
      const actionQuestion = questionOfKind("request_action");
      const action = actionQuestion?.action || actionQuestion?.target || "default";
      const value = characterPolicy.requestResponses?.[action];
      if (actionBlockedByBoundary(action)) {
        add(meaningIds, "DECLINE_ACTION_REQUEST");
        reasons.push("action_request_blocked_by_boundary");
      } else if (value === true) add(meaningIds, "ACCEPT_ACTION_REQUEST");
      else if (value === false) add(meaningIds, "DECLINE_ACTION_REQUEST");
      else add(meaningIds, "ANSWER_UNKNOWN");
      reasons.push("answer_action_request");
    }

    if (
      has(a.intents, "invite_action") ||
      questionOfKind("invitation")
    ) {
      const actionQuestion = questionOfKind("invitation");
      const action = actionQuestion?.action || actionQuestion?.target || "default";
      const value = characterPolicy.invitationResponses?.[action];
      if (actionBlockedByBoundary(action)) {
        add(meaningIds, "DECLINE_INVITATION");
        reasons.push("invitation_blocked_by_boundary");
      } else if (value === true) add(meaningIds, "ACCEPT_INVITATION");
      else if (value === false) add(meaningIds, "DECLINE_INVITATION");
      else add(meaningIds, "ANSWER_UNKNOWN");
      reasons.push("answer_invitation");
    }

    if (
      has(a.intents, "suggest_action") ||
      questionOfKind("suggestion")
    ) {
      const actionQuestion = questionOfKind("suggestion");
      const action = actionQuestion?.action || actionQuestion?.target || "default";
      const value = characterPolicy.suggestionResponses?.[action];
      if (actionBlockedByBoundary(action)) {
        add(meaningIds, "DECLINE_SUGGESTION");
        reasons.push("suggestion_blocked_by_boundary");
      } else if (value === true) add(meaningIds, "ACCEPT_SUGGESTION");
      else if (value === false) add(meaningIds, "DECLINE_SUGGESTION");
      else add(meaningIds, "ANSWER_UNKNOWN");
      reasons.push("answer_suggestion");
    }

    const rulePlan =
      typeof HMW.Dialogue.evaluateResponseRules === "function"
        ? HMW.Dialogue.evaluateResponseRules({
            analysis: a,
            characterFacts,
            characterPolicy,
            psychology,
            relationship,
            conversationContext,
            recentMeaningIds
          })
        : null;

    if (rulePlan) {
      const suppressed = new Set(rulePlan.suppressedMeaningIds || []);
      if (suppressed.size) {
        for (let i = meaningIds.length - 1; i >= 0; i--) {
          if (suppressed.has(meaningIds[i])) meaningIds.splice(i, 1);
        }
      }
      for (const id of rulePlan.meaningIds || []) {
        if (!suppressed.has(id)) add(meaningIds, id);
      }
      for (const reason of rulePlan.reasons || []) {
        if (reason && !reasons.includes(reason)) reasons.push(reason);
      }
      for (const [id, slots] of Object.entries(rulePlan.slotOverridesByMeaning || {})) {
        slotOverridesByMeaning[id] = {
          ...(slots || {}),
          ...(slotOverridesByMeaning[id] || {})
        };
      }
    }

    if (meaningIds.length === 0 && has(a.intents, "ask_question")) {
      add(meaningIds, "ANSWER_UNKNOWN");
      reasons.push("generic_question_fallback_unknown");
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
      boundaryActive:
        distanceBoundary ||
        touchBoundary ||
        meaningIds.includes("RESPECT_BOUNDARY") ||
        meaningIds.includes("ACCEPT_DISTANCE") ||
        meaningIds.includes("DECLINE_CONTACT"),
      slotOverridesByMeaning,
      claimInterpretation: claimInfo,
      matchedResponseRuleIds: rulePlan?.matchedRuleIds || [],
      suppressedMeaningIds: rulePlan?.suppressedMeaningIds || [],
      preferredMeaningIds: rulePlan?.preferredMeaningIds || [],
      relationship,
      conversationContext,
      analysis: a
    };
  };
})();
