(() => {
  "use strict";
  window.HMW = window.HMW || {};
  HMW.Dialogue = HMW.Dialogue || {};

  const R = [];
  const add = (id, priority, when, meanings, reason=id, suppressMeanings=[]) =>
    R.push({ id, priority, when, meanings, reason, suppressMeanings });

  // Explicit fact presence / absence for direct answers.
  add("R1701_FACT_LOCATION_PRESENT",930,{questionRequestedFieldAny:["currentLocation"],factPresent:["currentLocation"]},["STATE_CURRENT_LOCATION"],"fact_location_present",["ANSWER_UNKNOWN"]);
  add("R1702_FACT_LOCATION_ABSENT",905,{questionRequestedFieldAny:["currentLocation"],factAbsent:["currentLocation"]},["ANSWER_UNKNOWN"],"fact_location_absent");
  add("R1703_FACT_RETURN_TIME_PRESENT",930,{questionRequestedFieldAny:["returnTime"],factPresent:["returnTime"]},["STATE_RETURN_TIME"],"fact_return_time_present",["ANSWER_UNKNOWN"]);
  add("R1704_FACT_RETURN_TIME_ABSENT",905,{questionRequestedFieldAny:["returnTime"],factAbsent:["returnTime"]},["ANSWER_UNKNOWN"],"fact_return_time_absent");
  add("R1705_FACT_AVAILABLE_TIME_PRESENT",930,{questionRequestedFieldAny:["availableTime"],factPresent:["availableTime"]},["STATE_AVAILABLE_TIME"],"fact_available_time_present",["ANSWER_UNKNOWN"]);
  add("R1706_FACT_AVAILABLE_TIME_ABSENT",905,{questionRequestedFieldAny:["availableTime"],factAbsent:["availableTime"]},["ANSWER_UNKNOWN"],"fact_available_time_absent");
  add("R1707_FACT_NAME_PRESENT",930,{questionRequestedFieldAny:["name"],factPresent:["name"]},["STATE_IDENTITY_NAME"],"fact_name_present",["ANSWER_UNKNOWN"]);
  add("R1708_FACT_NAME_ABSENT",905,{questionRequestedFieldAny:["name"],factAbsent:["name"]},["ANSWER_UNKNOWN"],"fact_name_absent");
  add("R1709_FACT_ROLE_PRESENT",930,{questionRequestedFieldAny:["role","jobRole"],factPresent:["role"]},["STATE_IDENTITY_ROLE"],"fact_role_present",["ANSWER_UNKNOWN"]);
  add("R1710_FACT_ROLE_ABSENT",905,{questionRequestedFieldAny:["role","jobRole"],factAbsent:["role","jobRole"]},["ANSWER_UNKNOWN"],"fact_role_absent");
  add("R1711_FACT_ORIGIN_PRESENT",930,{questionRequestedFieldAny:["origin"],factPresent:["origin"]},["STATE_ORIGIN"],"fact_origin_present",["ANSWER_UNKNOWN"]);
  add("R1712_FACT_ORIGIN_ABSENT",905,{questionRequestedFieldAny:["origin"],factAbsent:["origin"]},["ANSWER_UNKNOWN"],"fact_origin_absent");
  add("R1713_FACT_DEST_PRESENT",930,{questionRequestedFieldAny:["destination"],factPresent:["destination"]},["STATE_DESTINATION"],"fact_destination_present",["ANSWER_UNKNOWN"]);
  add("R1714_FACT_DEST_ABSENT",905,{questionRequestedFieldAny:["destination"],factAbsent:["destination"]},["ANSWER_UNKNOWN"],"fact_destination_absent");
  add("R1715_FACT_WORKLOC_PRESENT",930,{questionRequestedFieldAny:["workLocation"],factPresent:["workLocation"]},["STATE_WORK_LOCATION"],"fact_work_location_present",["ANSWER_UNKNOWN"]);
  add("R1716_FACT_WORKLOC_ABSENT",905,{questionRequestedFieldAny:["workLocation"],factAbsent:["workLocation"]},["ANSWER_UNKNOWN"],"fact_work_location_absent");
  add("R1717_FACT_REL_STATUS_PRESENT",940,{questionRequestedFieldAny:["relationshipStatus"],factPresent:["relationshipStatus"]},["STATE_RELATIONSHIP_STATUS"],"fact_relationship_status_present",["ANSWER_UNKNOWN"]);
  add("R1718_FACT_REL_STATUS_ABSENT",905,{questionRequestedFieldAny:["relationshipStatus"],factAbsent:["relationshipStatus"],relationshipAbsent:["stage"]},["ANSWER_UNKNOWN"],"fact_relationship_status_absent");
  add("R1719_FACT_FEELINGS_PRESENT",940,{questionRequestedFieldAny:["feelingsTowardHeroine"],factPresent:["feelingsTowardHeroine"]},["STATE_FEELINGS_TOWARD_HEROINE"],"fact_feelings_present",["ANSWER_UNKNOWN"]);
  add("R1720_FACT_FEELINGS_ABSENT",905,{questionRequestedFieldAny:["feelingsTowardHeroine"],factAbsent:["feelingsTowardHeroine","lovesHeroine","likesHeroine"]},["ANSWER_UNKNOWN"],"fact_feelings_absent");
  add("R1721_FACT_PLAN_PRESENT",930,{questionRequestedFieldAny:["currentPlan"],factPresent:["currentPlan"]},["STATE_CURRENT_PLAN"],"fact_plan_present",["ANSWER_UNKNOWN"]);
  add("R1722_FACT_PLAN_ABSENT",905,{questionRequestedFieldAny:["currentPlan"],factAbsent:["currentPlan"]},["ANSWER_UNKNOWN"],"fact_plan_absent");
  add("R1723_FACT_PREF_PRESENT",930,{questionRequestedFieldAny:["currentPreference"],factPresent:["currentPreference"]},["STATE_CURRENT_PREFERENCE"],"fact_preference_present",["ANSWER_UNKNOWN"]);
  add("R1724_FACT_PREF_ABSENT",905,{questionRequestedFieldAny:["currentPreference"],factAbsent:["currentPreference"]},["ANSWER_UNKNOWN"],"fact_preference_absent");
  add("R1725_FACT_WORK_PRESENT",930,{questionRequestedFieldAny:["workStatus"],factPresent:["workStatus"]},["STATE_WORK_STATUS"],"fact_work_present",["ANSWER_UNKNOWN"]);
  add("R1726_FACT_WORK_ABSENT",905,{questionRequestedFieldAny:["workStatus"],factAbsent:["workStatus"]},["ANSWER_UNKNOWN"],"fact_work_absent");
  add("R1727_FACT_MONEY_PRESENT",930,{questionRequestedFieldAny:["moneyAmount"],factPresent:["moneyAmount"]},["STATE_MONEY_STATUS"],"fact_money_present",["ANSWER_UNKNOWN"]);
  add("R1728_FACT_NO_MONEY",940,{questionRequestedFieldAny:["hasEnoughMoney"],factEq:{hasEnoughMoney:false}},["STATE_NO_MONEY"],"fact_no_money",["ANSWER_UNKNOWN","STATE_MONEY_STATUS"]);
  add("R1729_FACT_MONEY_ABSENT",905,{questionRequestedFieldAny:["moneyAmount","hasEnoughMoney"],factAbsent:["moneyAmount","hasEnoughMoney"]},["ANSWER_UNKNOWN"],"fact_money_absent");
  add("R1730_FACT_DESIRE_PRESENT",930,{questionRequestedFieldAny:["currentDesire"],factPresent:["currentDesire"]},["STATE_DESIRE"],"fact_desire_present",["ANSWER_UNKNOWN"]);
  add("R1731_FACT_DESIRE_ABSENT",905,{questionRequestedFieldAny:["currentDesire"],factAbsent:["currentDesire"]},["ANSWER_UNKNOWN"],"fact_desire_absent");
  add("R1732_FACT_NEED_PRESENT",930,{questionRequestedFieldAny:["currentNeed"],factPresent:["currentNeed"]},["STATE_NEED"],"fact_need_present",["ANSWER_UNKNOWN"]);
  add("R1733_FACT_NEED_ABSENT",905,{questionRequestedFieldAny:["currentNeed"],factAbsent:["currentNeed"]},["ANSWER_UNKNOWN"],"fact_need_absent");
  add("R1734_FACT_CHOICE_PRESENT",930,{questionRequestedFieldAny:["currentChoice"],factPresent:["currentChoice"]},["STATE_CHOICE"],"fact_choice_present",["ANSWER_UNKNOWN"]);
  add("R1735_FACT_CHOICE_ABSENT",905,{questionRequestedFieldAny:["currentChoice"],factAbsent:["currentChoice"]},["ANSWER_UNKNOWN"],"fact_choice_absent");
  add("R1736_FACT_EVENT_PRESENT",930,{questionRequestedFieldAny:["lastEvent"],factPresent:["lastEvent"]},["STATE_EVENT"],"fact_event_present",["ANSWER_UNKNOWN"]);
  add("R1737_FACT_EVENT_ABSENT",905,{questionRequestedFieldAny:["lastEvent"],factAbsent:["lastEvent"]},["ANSWER_UNKNOWN"],"fact_event_absent");
  add("R1738_FACT_HOME_PRESENT",930,{questionAny:{kindAny:["home"]},factPresent:["home"]},["STATE_HOME"],"fact_home_present",["ANSWER_UNKNOWN"]);
  add("R1739_FACT_HOME_ABSENT",905,{questionAny:{kindAny:["home"]},factAbsent:["home"]},["ANSWER_UNKNOWN"],"fact_home_absent");
  add("R1740_FACT_CERTAIN_TRUE",930,{questionAny:{kindAny:["certainty"]},factEq:{certain:true}},["EXPRESS_CERTAINTY"],"fact_certainty_true",["ANSWER_UNKNOWN","EXPRESS_UNCERTAINTY"]);

  // Relationship/fact fallbacks only when explicit fields are absent.
  R.push({id:"R1741_STAGE_STRANGER_FALLBACK",priority:925,when:{questionRequestedFieldAny:["relationshipStatus"],factAbsent:["relationshipStatus"],relationshipEq:{stage:"stranger"}},meanings:["STATE_RELATIONSHIP_STATUS"],reason:"stage_stranger_fallback",slots:{STATE_RELATIONSHIP_STATUS:{RELATIONSHIP:"strangers"}},suppressMeanings:["ANSWER_UNKNOWN"]});
  R.push({id:"R1742_STAGE_ACQUAINTANCE_FALLBACK",priority:925,when:{questionRequestedFieldAny:["relationshipStatus"],factAbsent:["relationshipStatus"],relationshipEq:{stage:"acquaintance"}},meanings:["STATE_RELATIONSHIP_STATUS"],reason:"stage_acquaintance_fallback",slots:{STATE_RELATIONSHIP_STATUS:{RELATIONSHIP:"acquaintances"}},suppressMeanings:["ANSWER_UNKNOWN"]});
  R.push({id:"R1743_STAGE_FRIEND_FALLBACK",priority:925,when:{questionRequestedFieldAny:["relationshipStatus"],factAbsent:["relationshipStatus"],relationshipEq:{stage:"friend"}},meanings:["STATE_RELATIONSHIP_STATUS"],reason:"stage_friend_fallback",slots:{STATE_RELATIONSHIP_STATUS:{RELATIONSHIP:"friends"}},suppressMeanings:["ANSWER_UNKNOWN"]});
  R.push({id:"R1744_STAGE_CLOSE_FALLBACK",priority:925,when:{questionRequestedFieldAny:["relationshipStatus"],factAbsent:["relationshipStatus"],relationshipEq:{stage:"close"}},meanings:["STATE_RELATIONSHIP_STATUS"],reason:"stage_close_fallback",slots:{STATE_RELATIONSHIP_STATUS:{RELATIONSHIP:"close"}},suppressMeanings:["ANSWER_UNKNOWN"]});
  R.push({id:"R1745_STAGE_ROMANTIC_FALLBACK",priority:925,when:{questionRequestedFieldAny:["relationshipStatus"],factAbsent:["relationshipStatus"],relationshipEq:{stage:"romantic"}},meanings:["STATE_RELATIONSHIP_STATUS"],reason:"stage_romantic_fallback",slots:{STATE_RELATIONSHIP_STATUS:{RELATIONSHIP:"romantic"}},suppressMeanings:["ANSWER_UNKNOWN"]});
  R.push({id:"R1746_STAGE_PARTNER_FALLBACK",priority:925,when:{questionRequestedFieldAny:["relationshipStatus"],factAbsent:["relationshipStatus"],relationshipEq:{stage:"partner"}},meanings:["STATE_RELATIONSHIP_STATUS"],reason:"stage_partner_fallback",slots:{STATE_RELATIONSHIP_STATUS:{RELATIONSHIP:"partners"}},suppressMeanings:["ANSWER_UNKNOWN"]});
  add("R1747_FEELINGS_LOVE_FALLBACK",930,{questionAny:{kindAny:["feelings"]},factAbsent:["feelingsTowardHeroine"],factEq:{lovesHeroine:true}},["AFFIRM_LOVE"],"feelings_love_fallback",["ANSWER_UNKNOWN","DENY_LOVE"]);
  add("R1748_FEELINGS_LIKE_FALLBACK",920,{questionAny:{kindAny:["feelings"]},factAbsent:["feelingsTowardHeroine"],factEq:{likesHeroine:true}},["EXPRESS_CARE"],"feelings_like_fallback",["ANSWER_UNKNOWN"]);
  add("R1749_FEELINGS_NEGATIVE_FALLBACK",930,{questionAny:{kindAny:["feelings"]},factAbsent:["feelingsTowardHeroine"],factEq:{lovesHeroine:false,likesHeroine:false}},["DENY_LOVE"],"feelings_negative_fallback",["ANSWER_UNKNOWN","AFFIRM_LOVE"]);
  add("R1750_LOVE_TRUE_HARD",960,{focusAny:["love","like"],factEq:{lovesHeroine:true}},["AFFIRM_LOVE"],"love_true_hard",["DENY_LOVE","ANSWER_UNKNOWN","EXPRESS_UNCERTAINTY"]);
  add("R1751_LOVE_FALSE_HARD",960,{focusAny:["love","like"],factEq:{lovesHeroine:false}},["DENY_LOVE"],"love_false_hard",["AFFIRM_LOVE"]);
  add("R1752_TRUST_TRUE_HARD",950,{focusAny:["trust"],factEq:{trustsHeroine:true}},["CONFIRM_TRUST"],"trust_true_hard",["ANSWER_UNKNOWN"]);
  add("R1753_BETRAY_FALSE_HARD",960,{focusAny:["betrayal"],factEq:{intendsBetrayal:false}},["DENY_BETRAYAL"],"betrayal_false_hard",["ADMIT_BETRAYAL","ANSWER_UNKNOWN"]);
  add("R1754_BETRAY_TRUE_HARD",970,{focusAny:["betrayal"],factEq:{hasBetrayed:true}},["ADMIT_BETRAYAL"],"betrayal_true_hard",["DENY_BETRAYAL"]);
  add("R1755_ABANDON_FALSE_HARD",950,{focusAny:["abandonment"],factEq:{willAbandonHeroine:false}},["DENY_ABANDONMENT","REASSURE_NOT_LEAVING"],"abandon_false_hard",["ANSWER_UNKNOWN"]);
  add("R1756_CHOICE_TRUE_HARD",940,{focusAny:["relationship","other_person"],factEq:{choosesHeroine:true}},["CONFIRM_CHOICE"],"choice_true_hard",["ANSWER_UNKNOWN"]);
  add("R1757_RETURN_TRUE_HARD",930,{focusAny:["return"],factEq:{willReturn:true}},["PROMISE_RETURN"],"return_true_hard",["ANSWER_UNKNOWN"]);
  add("R1758_LOYAL_TRUE_HARD",940,{focusAny:["trust","betrayal"],factEq:{loyalToHeroine:true}},["PROMISE_LOYALTY"],"loyal_true_hard",["ANSWER_UNKNOWN"]);
  add("R1759_NO_HARM_WISH_HARD",960,{focusAny:["harm","death"],factEq:{wantsToHarmHeroine:false}},["REJECT_DEATH_WISH_CLAIM"],"no_harm_wish_hard",["ANSWER_UNKNOWN"]);
  add("R1760_EXPLICIT_FEELINGS_HARD",960,{questionAny:{kindAny:["feelings"]},factPresent:["feelingsTowardHeroine"]},["STATE_FEELINGS_TOWARD_HEROINE"],"explicit_feelings_hard",["ANSWER_UNKNOWN"]);

  // Explicit negative policy is a hard veto over relationship/context approvals.
  add("R1761_POLICY_MEET_FALSE",1080,{intentAny:["ask_to_meet"],policyEq:{willingToMeet:false}},["DECLINE_REQUEST"],"policy_meet_false",["AGREE_REQUEST"]);
  add("R1762_POLICY_TALK_FALSE",1080,{intentAny:["ask_to_talk"],policyEq:{willingToTalk:false}},["DECLINE_REQUEST"],"policy_talk_false",["AGREE_REQUEST"]);
  add("R1763_POLICY_STAY_FALSE",1080,{intentAny:["request_stay"],policyEq:{willingToStay:false}},["DECLINE_REQUEST"],"policy_stay_false",["AGREE_REQUEST"]);
  add("R1764_POLICY_CONTACT_FALSE",1100,{intentAny:["request_contact"],policyEq:{allowContact:false}},["DECLINE_CONTACT"],"policy_contact_false",["ACCEPT_CONTACT","OFFER_CONTACT"]);
  add("R1765_POLICY_ENTRY_FALSE",1080,{intentAny:["ask_permission_enter"],policyEq:{allowEntry:false}},["DECLINE_REQUEST"],"policy_entry_false",["AGREE_REQUEST"]);
  add("R1766_POLICY_WAIT_FALSE",1080,{intentAny:["ask_permission_wait"],policyEq:{allowWaiting:false}},["DECLINE_REQUEST"],"policy_wait_false",["AGREE_REQUEST"]);
  add("R1767_POLICY_TOUCH_FALSE",1080,{questionAny:{kindAny:["permission"],actionAny:["touch"]},policyEq:{"permissions.touch":false}},["DENY_PERMISSION"],"policy_touch_false",["GRANT_PERMISSION"]);
  add("R1768_POLICY_HUG_FALSE",1080,{questionAny:{kindAny:["permission"],actionAny:["hug"]},policyEq:{"permissions.hug":false}},["DENY_PERMISSION"],"policy_hug_false",["GRANT_PERMISSION"]);
  add("R1769_POLICY_KISS_FALSE",1080,{questionAny:{kindAny:["permission"],actionAny:["kiss"]},policyEq:{"permissions.kiss":false}},["DENY_PERMISSION"],"policy_kiss_false",["GRANT_PERMISSION"]);
  add("R1770_POLICY_ENTER_FALSE",1080,{questionAny:{kindAny:["permission"],actionAny:["enter"]},policyEq:{"permissions.enter":false}},["DENY_PERMISSION"],"policy_enter_false",["GRANT_PERMISSION"]);
  add("R1771_POLICY_WAIT_ACTION_FALSE",1080,{questionAny:{kindAny:["permission"],actionAny:["wait"]},policyEq:{"permissions.wait":false}},["DENY_PERMISSION"],"policy_wait_action_false",["GRANT_PERMISSION"]);
  add("R1772_POLICY_VISIT_FALSE",1080,{questionAny:{kindAny:["permission"],actionAny:["visit"]},policyEq:{"permissions.visit":false}},["DENY_PERMISSION"],"policy_visit_false",["GRANT_PERMISSION"]);
  add("R1773_POLICY_FOLLOW_FALSE",1080,{questionAny:{kindAny:["permission"],actionAny:["follow"]},policyEq:{"permissions.follow":false}},["DENY_PERMISSION"],"policy_follow_false",["GRANT_PERMISSION"]);
  add("R1774_POLICY_CALL_FALSE",1080,{questionAny:{kindAny:["permission"],actionAny:["call"]},policyEq:{"permissions.call":false}},["DENY_PERMISSION"],"policy_call_false",["GRANT_PERMISSION"]);
  add("R1775_POLICY_MESSAGE_FALSE",1080,{questionAny:{kindAny:["permission"],actionAny:["message"]},policyEq:{"permissions.message":false}},["DENY_PERMISSION"],"policy_message_false",["GRANT_PERMISSION"]);
  add("R1776_REQUEST_TOUCH_FALSE",1080,{questionAny:{kindAny:["request_action"],actionAny:["touch"]},policyEq:{"requestResponses.touch":false}},["DECLINE_ACTION_REQUEST"],"request_touch_false",["ACCEPT_ACTION_REQUEST"]);
  add("R1777_REQUEST_HUG_FALSE",1080,{questionAny:{kindAny:["request_action"],actionAny:["hug"]},policyEq:{"requestResponses.hug":false}},["DECLINE_ACTION_REQUEST"],"request_hug_false",["ACCEPT_ACTION_REQUEST"]);
  add("R1778_REQUEST_KISS_FALSE",1080,{questionAny:{kindAny:["request_action"],actionAny:["kiss"]},policyEq:{"requestResponses.kiss":false}},["DECLINE_ACTION_REQUEST"],"request_kiss_false",["ACCEPT_ACTION_REQUEST"]);
  add("R1779_REQUEST_CALL_FALSE",1080,{questionAny:{kindAny:["request_action"],actionAny:["call"]},policyEq:{"requestResponses.call":false}},["DECLINE_ACTION_REQUEST"],"request_call_false",["ACCEPT_ACTION_REQUEST"]);
  add("R1780_REQUEST_MESSAGE_FALSE",1080,{questionAny:{kindAny:["request_action"],actionAny:["message"]},policyEq:{"requestResponses.message":false}},["DECLINE_ACTION_REQUEST"],"request_message_false",["ACCEPT_ACTION_REQUEST"]);

  // Explicit positive policy fills the answer when no stronger veto suppresses it.
  add("R1781_POLICY_MEET_TRUE",760,{intentAny:["ask_to_meet"],policyEq:{willingToMeet:true}},["AGREE_REQUEST"],"policy_meet_true",["ANSWER_UNKNOWN"]);
  add("R1782_POLICY_TALK_TRUE",760,{intentAny:["ask_to_talk"],policyEq:{willingToTalk:true}},["AGREE_REQUEST"],"policy_talk_true",["ANSWER_UNKNOWN"]);
  add("R1783_POLICY_STAY_TRUE",760,{intentAny:["request_stay"],policyEq:{willingToStay:true}},["AGREE_REQUEST"],"policy_stay_true",["ANSWER_UNKNOWN"]);
  add("R1784_POLICY_CONTACT_TRUE",760,{intentAny:["request_contact"],policyEq:{allowContact:true}},["ACCEPT_CONTACT"],"policy_contact_true",["ANSWER_UNKNOWN"]);
  add("R1785_POLICY_ENTRY_TRUE",750,{intentAny:["ask_permission_enter"],policyEq:{allowEntry:true}},["AGREE_REQUEST"],"policy_entry_true",["ANSWER_UNKNOWN"]);
  add("R1786_POLICY_WAIT_TRUE",750,{intentAny:["ask_permission_wait"],policyEq:{allowWaiting:true}},["AGREE_REQUEST"],"policy_wait_true",["ANSWER_UNKNOWN"]);
  add("R1787_POLICY_TOUCH_TRUE",760,{questionAny:{kindAny:["permission"],actionAny:["touch"]},policyEq:{"permissions.touch":true}},["GRANT_PERMISSION"],"policy_touch_true",["ANSWER_UNKNOWN"]);
  add("R1788_POLICY_HUG_TRUE",760,{questionAny:{kindAny:["permission"],actionAny:["hug"]},policyEq:{"permissions.hug":true}},["GRANT_PERMISSION"],"policy_hug_true",["ANSWER_UNKNOWN"]);
  add("R1789_POLICY_KISS_TRUE",760,{questionAny:{kindAny:["permission"],actionAny:["kiss"]},policyEq:{"permissions.kiss":true}},["GRANT_PERMISSION"],"policy_kiss_true",["ANSWER_UNKNOWN"]);
  add("R1790_POLICY_ENTER_TRUE",750,{questionAny:{kindAny:["permission"],actionAny:["enter"]},policyEq:{"permissions.enter":true}},["GRANT_PERMISSION"],"policy_enter_true",["ANSWER_UNKNOWN"]);
  add("R1791_POLICY_WAIT_ACTION_TRUE",750,{questionAny:{kindAny:["permission"],actionAny:["wait"]},policyEq:{"permissions.wait":true}},["GRANT_PERMISSION"],"policy_wait_action_true",["ANSWER_UNKNOWN"]);
  add("R1792_POLICY_VISIT_TRUE",750,{questionAny:{kindAny:["permission"],actionAny:["visit"]},policyEq:{"permissions.visit":true}},["GRANT_PERMISSION"],"policy_visit_true",["ANSWER_UNKNOWN"]);
  add("R1793_POLICY_FOLLOW_TRUE",750,{questionAny:{kindAny:["permission"],actionAny:["follow"]},policyEq:{"permissions.follow":true}},["GRANT_PERMISSION"],"policy_follow_true",["ANSWER_UNKNOWN"]);
  add("R1794_POLICY_CALL_TRUE",750,{questionAny:{kindAny:["permission"],actionAny:["call"]},policyEq:{"permissions.call":true}},["GRANT_PERMISSION"],"policy_call_true",["ANSWER_UNKNOWN"]);
  add("R1795_POLICY_MESSAGE_TRUE",750,{questionAny:{kindAny:["permission"],actionAny:["message"]},policyEq:{"permissions.message":true}},["GRANT_PERMISSION"],"policy_message_true",["ANSWER_UNKNOWN"]);
  add("R1796_REQUEST_TOUCH_TRUE",750,{questionAny:{kindAny:["request_action"],actionAny:["touch"]},policyEq:{"requestResponses.touch":true}},["ACCEPT_ACTION_REQUEST"],"request_touch_true",["ANSWER_UNKNOWN"]);
  add("R1797_REQUEST_HUG_TRUE",750,{questionAny:{kindAny:["request_action"],actionAny:["hug"]},policyEq:{"requestResponses.hug":true}},["ACCEPT_ACTION_REQUEST"],"request_hug_true",["ANSWER_UNKNOWN"]);
  add("R1798_REQUEST_KISS_TRUE",750,{questionAny:{kindAny:["request_action"],actionAny:["kiss"]},policyEq:{"requestResponses.kiss":true}},["ACCEPT_ACTION_REQUEST"],"request_kiss_true",["ANSWER_UNKNOWN"]);
  add("R1799_REQUEST_CALL_TRUE",750,{questionAny:{kindAny:["request_action"],actionAny:["call"]},policyEq:{"requestResponses.call":true}},["ACCEPT_ACTION_REQUEST"],"request_call_true",["ANSWER_UNKNOWN"]);
  add("R1800_REQUEST_MESSAGE_TRUE",750,{questionAny:{kindAny:["request_action"],actionAny:["message"]},policyEq:{"requestResponses.message":true}},["ACCEPT_ACTION_REQUEST"],"request_message_true",["ANSWER_UNKNOWN"]);

  if (R.length !== 100) throw new Error("Expected 100 response rules, got " + R.length);
  HMW.Dialogue.registerResponseRules(R);
})();