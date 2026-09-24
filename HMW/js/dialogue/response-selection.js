(() => {
  "use strict";

  window.HMW = window.HMW || {};
  HMW.Dialogue = HMW.Dialogue || {};

  const BOUNDARY = new Set([
    "RESPECT_BOUNDARY","ACCEPT_DISTANCE","PROMISE_NOT_FOLLOW","PROMISE_NOT_TOUCH",
    "PROMISE_NOT_KISS","PROMISE_NOT_HUG","PROMISE_NOT_CONTACT","DECLINE_CONTACT"
  ]);

  const DIRECT_ANSWER = new Set([
    "STATE_CURRENT_LOCATION","STATE_AVAILABLE_TIME","STATE_CONDITION",
    "CONFIRM_POSSESSION","DENY_POSSESSION","STATE_QUANTITY",
    "CONFIRM_CAPABILITY","DENY_CAPABILITY","STATE_CURRENT_PLAN",
    "STATE_CURRENT_PREFERENCE","CONFIRM_AVAILABLE","DENY_AVAILABLE",
    "STATE_RETURN_TIME","STATE_WORK_STATUS","STATE_MONEY_STATUS","STATE_NO_MONEY",
    "STATE_SLEEP_STATUS_GOOD","STATE_SLEEP_STATUS_BAD",
    "STATE_FOOD_STATUS_EATEN","STATE_FOOD_STATUS_NOT_EATEN","STATE_HOME",
    "STATE_IDENTITY_NAME","STATE_IDENTITY_ROLE","STATE_ORIGIN","STATE_DESTINATION",
    "STATE_REASON","STATE_OPINION","STATE_PRICE","STATE_COUNT",
    "STATE_WORK_LOCATION","STATE_JOB_ROLE","CONFIRM_KNOWLEDGE","DENY_KNOWLEDGE",
    "CONFIRM_FACT","DENY_FACT","STATE_DESIRE","STATE_NEED","STATE_CHOICE",
    "STATE_EVENT","STATE_RELATIONSHIP_STATUS","STATE_FEELINGS_TOWARD_HEROINE"
  ]);

  const CORE_RELATION = new Set([
    "AFFIRM_LOVE","DENY_LOVE","DENY_BETRAYAL","ADMIT_BETRAYAL",
    "REJECT_DEATH_WISH_CLAIM","DENY_ABANDONMENT","CONFIRM_TRUST",
    "PROMISE_LOYALTY","CONFIRM_CHOICE","REASSURE_NOT_LEAVING"
  ]);

  const CARE = new Set([
    "EXPRESS_FEAR_OF_LOSS","EXPRESS_CARE","EXPRESS_CONCERN","EXPRESS_SYMPATHY",
    "OFFER_HELP","OFFER_FOOD","OFFER_DRINK","OFFER_REST","OFFER_WARMTH",
    "OFFER_SHELTER","OFFER_COMPANY"
  ]);

  const REQUEST_RESPONSE = new Set([
    "AGREE_REQUEST","DECLINE_REQUEST","ACCEPT_APOLOGY","DECLINE_FOR_NOW",
    "ACCEPT_CONTACT","EXPRESS_REPAIR_DESIRE",
    "GRANT_PERMISSION","DENY_PERMISSION","ACCEPT_ACTION_REQUEST","DECLINE_ACTION_REQUEST",
    "ACCEPT_INVITATION","DECLINE_INVITATION","ACCEPT_SUGGESTION","DECLINE_SUGGESTION"
  ]);

  const EMOTION = new Set([
    "EXPRESS_HURT","EXPRESS_ANGER","EXPRESS_LONELINESS","EXPRESS_JEALOUSY",
    "EXPRESS_ANXIETY","EXPRESS_CONFUSION","EXPRESS_RELIEF","EXPRESS_JOY",
    "EXPRESS_DISAPPOINTMENT","EXPRESS_HOPE","EXPRESS_PRIDE"
  ]);

  const FOLLOWUP = new Set([
    "ASK_FOR_DETAILS","ASK_ABOUT_OTHER_PERSON","ASK_TO_TALK","ASK_FOR_ANSWER",
    "EXPRESS_NEED_CLARITY","ASK_DISTANCE_REASON","ASK_AFFECTION_REASON"
  ]);

  const take = (source, set, limit) => {
    const found = source.filter(id => set.has(id));
    return Number.isFinite(limit) ? found.slice(0, limit) : found;
  };

  const CONFLICT_GROUPS = [
    ["AFFIRM_LOVE","DENY_LOVE"],
    ["DENY_BETRAYAL","ADMIT_BETRAYAL"],
    ["ACCEPT_DISTANCE","REFUSE_DISTANCE"],
    ["AGREE_REQUEST","DECLINE_REQUEST"],
    ["ACCEPT_CONTACT","DECLINE_CONTACT"],
    ["GRANT_PERMISSION","DENY_PERMISSION"],
    ["ACCEPT_ACTION_REQUEST","DECLINE_ACTION_REQUEST"],
    ["ACCEPT_INVITATION","DECLINE_INVITATION"],
    ["ACCEPT_SUGGESTION","DECLINE_SUGGESTION"],
    ["ACCEPT_APOLOGY","DECLINE_FOR_NOW"],
    ["OFFER_CONTACT","DECLINE_CONTACT"],
    ["CONFIRM_POSSESSION","DENY_POSSESSION"],
    ["CONFIRM_CAPABILITY","DENY_CAPABILITY"],
    ["CONFIRM_AVAILABLE","DENY_AVAILABLE"],
    ["CONFIRM_KNOWLEDGE","DENY_KNOWLEDGE"],
    ["CONFIRM_FACT","DENY_FACT"],
    ["EXPRESS_CERTAINTY","EXPRESS_UNCERTAINTY"],
    ["STATE_SLEEP_STATUS_GOOD","STATE_SLEEP_STATUS_BAD"],
    ["STATE_FOOD_STATUS_EATEN","STATE_FOOD_STATUS_NOT_EATEN"]
  ];

  const removeConflicts = source => {
    let out = [...source];
    for (const group of CONFLICT_GROUPS) {
      const first = out.find(id => group.includes(id));
      if (!first) continue;
      out = out.filter(id => !group.includes(id) || id === first);
    }
    return out;
  };

  HMW.Dialogue.selectResponseMeanings = function selectResponseMeanings(
    meaningIds = [],
    {
      maxMeanings = 5,
      boundaryActive = false,
      preferredMeaningIds = []
    } = {}
  ) {
    let ordered = removeConflicts([...new Set((meaningIds || []).filter(Boolean))]);

    const hasSpecificAnswer = ordered.some(id => DIRECT_ANSWER.has(id));
    const hasSpecificRequestResponse = ordered.some(id => REQUEST_RESPONSE.has(id));
    if (hasSpecificAnswer || hasSpecificRequestResponse) {
      ordered = ordered.filter(id =>
        id !== "ANSWER_UNKNOWN" &&
        id !== "ASK_FOR_ANSWER" &&
        id !== "EXPRESS_NEED_CLARITY"
      );
    }

    const selected = [];
    const pushUnique = ids => {
      for (const id of ids) if (!selected.includes(id)) selected.push(id);
    };
    const preferred = [...new Set((preferredMeaningIds || []).filter(id => ordered.includes(id)))];

    pushUnique(take(ordered, BOUNDARY, Infinity));
    pushUnique(preferred);
    pushUnique(take(ordered, DIRECT_ANSWER, 2));
    pushUnique(take(ordered, CORE_RELATION, 3));
    pushUnique(take(ordered, REQUEST_RESPONSE, 1));
    pushUnique(take(ordered, CARE, 1));
    pushUnique(take(ordered, EMOTION, 1));

    if (!boundaryActive) {
      pushUnique(take(ordered, FOLLOWUP, 1));
    }

    for (const id of ordered) {
      if (!selected.includes(id)) selected.push(id);
    }

    const preferredSet = new Set(preferred);
    const criticalCount = selected.filter(id =>
      BOUNDARY.has(id) || DIRECT_ANSWER.has(id) || preferredSet.has(id)
    ).length;

    const limit = Math.max(
      criticalCount,
      Number.isFinite(Number(maxMeanings)) && Number(maxMeanings) > 0
        ? Number(maxMeanings)
        : 5
    );

    return selected.slice(0, limit);
  };
})();