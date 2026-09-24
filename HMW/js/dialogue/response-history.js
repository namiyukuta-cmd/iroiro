(() => {
  "use strict";

  window.HMW = window.HMW || {};
  HMW.Dialogue = HMW.Dialogue || {};

  const ALWAYS_KEEP = new Set([
    "RESPECT_BOUNDARY","ACCEPT_DISTANCE","PROMISE_NOT_FOLLOW","PROMISE_NOT_TOUCH",
    "PROMISE_NOT_KISS","PROMISE_NOT_HUG","PROMISE_NOT_CONTACT",
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
    "CONFIRM_FACT","DENY_FACT","STATE_DESIRE","STATE_NEED","STATE_CHOICE","STATE_EVENT",
    "STATE_RELATIONSHIP_STATUS","STATE_FEELINGS_TOWARD_HEROINE",
    "AFFIRM_LOVE","DENY_LOVE","DENY_BETRAYAL","ADMIT_BETRAYAL",
    "REJECT_DEATH_WISH_CLAIM","DENY_ABANDONMENT"
  ]);

  HMW.Dialogue.filterRepeatedMeanings=function filterRepeatedMeanings(
    meaningIds=[],
    {
      recentMeaningIds=[],
      repeatWindow=4
    }={}
  ){
    const recent=(Array.isArray(recentMeaningIds)?recentMeaningIds:[])
      .slice(-Math.max(0,Number(repeatWindow)||4));
    const recentSet=new Set(recent);

    return [...new Set((meaningIds||[]).filter(Boolean))].filter(id =>
      ALWAYS_KEEP.has(id) || !recentSet.has(id)
    );
  };

  HMW.Dialogue.updateMeaningHistory=function updateMeaningHistory(
    history=[],
    meaningIds=[],
    {maxHistory=20}={}
  ){
    const merged=[
      ...(Array.isArray(history)?history:[]),
      ...(Array.isArray(meaningIds)?meaningIds:[])
    ].filter(Boolean);
    return merged.slice(-Math.max(1,Number(maxHistory)||20));
  };
})();