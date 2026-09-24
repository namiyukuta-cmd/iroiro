(() => {
  "use strict";
  window.HMW = window.HMW || {};
  HMW.Dialogue = HMW.Dialogue || {};

  const R = [];
  const add = (id, priority, when, meanings, reason=id, suppressMeanings=[]) =>
    R.push({ id, priority, when, meanings, reason, suppressMeanings });

  // Primary question: direct facts should answer the first question first.
  add("R1801_PRIMARY_WHERE",945,{primaryQuestionAny:{kindAny:["where"]},factPresent:["currentLocation"]},["STATE_CURRENT_LOCATION"],"primary_where",["ANSWER_UNKNOWN"]);
  add("R1802_PRIMARY_WHEN_RETURN",945,{primaryQuestionAny:{kindAny:["when"],requestedFieldAny:["returnTime"]},factPresent:["returnTime"]},["STATE_RETURN_TIME"],"primary_when_return",["ANSWER_UNKNOWN"]);
  add("R1803_PRIMARY_WHEN_AVAILABLE",945,{primaryQuestionAny:{kindAny:["when"],requestedFieldAny:["availableTime"]},factPresent:["availableTime"]},["STATE_AVAILABLE_TIME"],"primary_when_available",["ANSWER_UNKNOWN"]);
  add("R1804_PRIMARY_REL_STATUS_FACT",950,{primaryQuestionAny:{kindAny:["relationship_status"]},factPresent:["relationshipStatus"]},["STATE_RELATIONSHIP_STATUS"],"primary_relationship_status_fact",["ANSWER_UNKNOWN"]);
  add("R1805_PRIMARY_REL_STATUS_STAGE",940,{primaryQuestionAny:{kindAny:["relationship_status"]},factAbsent:["relationshipStatus"],relationshipPresent:["stage"]},["STATE_RELATIONSHIP_STATUS"],"primary_relationship_status_stage",["ANSWER_UNKNOWN"]);
  add("R1806_PRIMARY_FEELINGS_FACT",950,{primaryQuestionAny:{kindAny:["feelings"]},factPresent:["feelingsTowardHeroine"]},["STATE_FEELINGS_TOWARD_HEROINE"],"primary_feelings_fact",["ANSWER_UNKNOWN"]);
  add("R1807_PRIMARY_FEELINGS_LOVE",940,{primaryQuestionAny:{kindAny:["feelings"]},factAbsent:["feelingsTowardHeroine"],factEq:{lovesHeroine:true}},["AFFIRM_LOVE"],"primary_feelings_love",["ANSWER_UNKNOWN","DENY_LOVE"]);
  add("R1808_PRIMARY_FEELINGS_NOLOVE",940,{primaryQuestionAny:{kindAny:["feelings"]},factAbsent:["feelingsTowardHeroine"],factEq:{lovesHeroine:false}},["DENY_LOVE"],"primary_feelings_no_love",["AFFIRM_LOVE"]);
  add("R1809_PRIMARY_PLAN",945,{primaryQuestionAny:{kindAny:["plan"]},factPresent:["currentPlan"]},["STATE_CURRENT_PLAN"],"primary_plan",["ANSWER_UNKNOWN"]);
  add("R1810_PRIMARY_PREFERENCE",945,{primaryQuestionAny:{kindAny:["preference"]},factPresent:["currentPreference"]},["STATE_CURRENT_PREFERENCE"],"primary_preference",["ANSWER_UNKNOWN"]);
  add("R1811_PRIMARY_WORK",945,{primaryQuestionAny:{kindAny:["work"]},factPresent:["workStatus"]},["STATE_WORK_STATUS"],"primary_work",["ANSWER_UNKNOWN"]);
  add("R1812_PRIMARY_HOME",945,{primaryQuestionAny:{kindAny:["home"]},factPresent:["home"]},["STATE_HOME"],"primary_home",["ANSWER_UNKNOWN"]);
  add("R1813_PRIMARY_DESIRE",945,{primaryQuestionAny:{kindAny:["desire"]},factPresent:["currentDesire"]},["STATE_DESIRE"],"primary_desire",["ANSWER_UNKNOWN"]);
  add("R1814_PRIMARY_NEED",945,{primaryQuestionAny:{kindAny:["need"]},factPresent:["currentNeed"]},["STATE_NEED"],"primary_need",["ANSWER_UNKNOWN"]);
  add("R1815_PRIMARY_CHOICE",945,{primaryQuestionAny:{kindAny:["choice"]},factPresent:["currentChoice"]},["STATE_CHOICE"],"primary_choice",["ANSWER_UNKNOWN"]);
  add("R1816_PRIMARY_EVENT",945,{primaryQuestionAny:{kindAny:["event"]},factPresent:["lastEvent"]},["STATE_EVENT"],"primary_event",["ANSWER_UNKNOWN"]);
  add("R1817_PRIMARY_NAME",945,{primaryQuestionAny:{kindAny:["identity"],requestedFieldAny:["name"]},factPresent:["name"]},["STATE_IDENTITY_NAME"],"primary_name",["ANSWER_UNKNOWN"]);
  add("R1818_PRIMARY_ORIGIN",945,{primaryQuestionAny:{kindAny:["origin"]},factPresent:["origin"]},["STATE_ORIGIN"],"primary_origin",["ANSWER_UNKNOWN"]);
  add("R1819_PRIMARY_DESTINATION",945,{primaryQuestionAny:{kindAny:["destination"]},factPresent:["destination"]},["STATE_DESTINATION"],"primary_destination",["ANSWER_UNKNOWN"]);
  add("R1820_PRIMARY_OPINION",945,{primaryQuestionAny:{kindAny:["opinion"]},factPresent:["opinion"]},["STATE_OPINION"],"primary_opinion",["ANSWER_UNKNOWN"]);

  // Primary action question: explicit policy and boundaries decide the first requested action.
  add("R1821_PRIMARY_PERMISSION_TOUCH_DENY",1120,{primaryQuestionAny:{kindAny:["permission"],actionAny:["touch"]},policyEq:{"permissions.touch":false}},["DENY_PERMISSION"],"primary_permission_touch_deny",["GRANT_PERMISSION"]);
  add("R1822_PRIMARY_PERMISSION_TOUCH_ALLOW",780,{primaryQuestionAny:{kindAny:["permission"],actionAny:["touch"]},policyEq:{"permissions.touch":true},boundaryNone:["do_not_touch"]},["GRANT_PERMISSION"],"primary_permission_touch_allow",["ANSWER_UNKNOWN"]);
  add("R1823_PRIMARY_PERMISSION_HUG_DENY",1120,{primaryQuestionAny:{kindAny:["permission"],actionAny:["hug"]},policyEq:{"permissions.hug":false}},["DENY_PERMISSION"],"primary_permission_hug_deny",["GRANT_PERMISSION"]);
  add("R1824_PRIMARY_PERMISSION_HUG_ALLOW",780,{primaryQuestionAny:{kindAny:["permission"],actionAny:["hug"]},policyEq:{"permissions.hug":true},boundaryNone:["do_not_hug","do_not_touch"]},["GRANT_PERMISSION"],"primary_permission_hug_allow",["ANSWER_UNKNOWN"]);
  add("R1825_PRIMARY_PERMISSION_KISS_DENY",1120,{primaryQuestionAny:{kindAny:["permission"],actionAny:["kiss"]},policyEq:{"permissions.kiss":false}},["DENY_PERMISSION"],"primary_permission_kiss_deny",["GRANT_PERMISSION"]);
  add("R1826_PRIMARY_PERMISSION_KISS_ALLOW",780,{primaryQuestionAny:{kindAny:["permission"],actionAny:["kiss"]},policyEq:{"permissions.kiss":true},boundaryNone:["do_not_kiss","do_not_touch"]},["GRANT_PERMISSION"],"primary_permission_kiss_allow",["ANSWER_UNKNOWN"]);
  add("R1827_PRIMARY_REQUEST_CALL_DENY",1120,{primaryQuestionAny:{kindAny:["request_action"],actionAny:["call"]},policyEq:{"requestResponses.call":false}},["DECLINE_ACTION_REQUEST"],"primary_request_call_deny",["ACCEPT_ACTION_REQUEST"]);
  add("R1828_PRIMARY_REQUEST_CALL_ALLOW",780,{primaryQuestionAny:{kindAny:["request_action"],actionAny:["call"]},policyEq:{"requestResponses.call":true},boundaryNone:["do_not_call","do_not_contact"]},["ACCEPT_ACTION_REQUEST"],"primary_request_call_allow",["ANSWER_UNKNOWN"]);
  add("R1829_PRIMARY_REQUEST_MESSAGE_DENY",1120,{primaryQuestionAny:{kindAny:["request_action"],actionAny:["message"]},policyEq:{"requestResponses.message":false}},["DECLINE_ACTION_REQUEST"],"primary_request_message_deny",["ACCEPT_ACTION_REQUEST"]);
  add("R1830_PRIMARY_REQUEST_MESSAGE_ALLOW",780,{primaryQuestionAny:{kindAny:["request_action"],actionAny:["message"]},policyEq:{"requestResponses.message":true},boundaryNone:["do_not_message","do_not_contact"]},["ACCEPT_ACTION_REQUEST"],"primary_request_message_allow",["ANSWER_UNKNOWN"]);
  add("R1831_PRIMARY_REQUEST_VISIT_DENY",1120,{primaryQuestionAny:{kindAny:["request_action"],actionAny:["visit"]},policyEq:{"requestResponses.visit":false}},["DECLINE_ACTION_REQUEST"],"primary_request_visit_deny",["ACCEPT_ACTION_REQUEST"]);
  add("R1832_PRIMARY_REQUEST_VISIT_ALLOW",780,{primaryQuestionAny:{kindAny:["request_action"],actionAny:["visit"]},policyEq:{"requestResponses.visit":true},boundaryNone:["do_not_visit","leave_me_alone"]},["ACCEPT_ACTION_REQUEST"],"primary_request_visit_allow",["ANSWER_UNKNOWN"]);
  add("R1833_PRIMARY_REQUEST_ENTER_DENY",1120,{primaryQuestionAny:{kindAny:["request_action"],actionAny:["enter"]},policyEq:{"requestResponses.enter":false}},["DECLINE_ACTION_REQUEST"],"primary_request_enter_deny",["ACCEPT_ACTION_REQUEST"]);
  add("R1834_PRIMARY_REQUEST_ENTER_ALLOW",780,{primaryQuestionAny:{kindAny:["request_action"],actionAny:["enter"]},policyEq:{"requestResponses.enter":true},boundaryNone:["do_not_enter"]},["ACCEPT_ACTION_REQUEST"],"primary_request_enter_allow",["ANSWER_UNKNOWN"]);
  add("R1835_PRIMARY_INVITE_DENY",1080,{primaryQuestionAny:{kindAny:["invitation"]},policyEq:{"invitationResponses.default":false}},["DECLINE_INVITATION"],"primary_invitation_deny",["ACCEPT_INVITATION"]);
  add("R1836_PRIMARY_INVITE_ALLOW",760,{primaryQuestionAny:{kindAny:["invitation"]},policyEq:{"invitationResponses.default":true}},["ACCEPT_INVITATION"],"primary_invitation_allow",["ANSWER_UNKNOWN"]);
  add("R1837_PRIMARY_SUGGEST_DENY",1080,{primaryQuestionAny:{kindAny:["suggestion"]},policyEq:{"suggestionResponses.default":false}},["DECLINE_SUGGESTION"],"primary_suggestion_deny",["ACCEPT_SUGGESTION"]);
  add("R1838_PRIMARY_SUGGEST_ALLOW",760,{primaryQuestionAny:{kindAny:["suggestion"]},policyEq:{"suggestionResponses.default":true}},["ACCEPT_SUGGESTION"],"primary_suggestion_allow",["ANSWER_UNKNOWN"]);
  add("R1839_PRIMARY_PERMISSION_BOUNDARY",1200,{primaryQuestionAny:{kindAny:["permission"]},boundaryAny:["do_not_touch","do_not_hug","do_not_kiss","do_not_contact","do_not_enter","do_not_wait","do_not_visit","do_not_follow"]},["RESPECT_BOUNDARY"],"primary_permission_boundary");
  add("R1840_PRIMARY_REQUEST_BOUNDARY",1200,{primaryQuestionAny:{kindAny:["request_action"]},boundaryAny:["do_not_touch","do_not_hug","do_not_kiss","do_not_contact","do_not_enter","do_not_wait","do_not_visit","do_not_follow","stop_conversation"]},["RESPECT_BOUNDARY"],"primary_request_boundary");

  // Multi-question prioritization: preserve the first question and avoid generic drift.
  add("R1841_MULTI_PRIMARY_WHERE",955,{questionCountMin:2,primaryQuestionAny:{kindAny:["where"]},factPresent:["currentLocation"]},["STATE_CURRENT_LOCATION"],"multi_primary_where",["ANSWER_UNKNOWN"]);
  add("R1842_MULTI_PRIMARY_WHEN_RETURN",955,{questionCountMin:2,primaryQuestionAny:{kindAny:["when"],requestedFieldAny:["returnTime"]},factPresent:["returnTime"]},["STATE_RETURN_TIME"],"multi_primary_return_time",["ANSWER_UNKNOWN"]);
  add("R1843_MULTI_PRIMARY_REL_STATUS",955,{questionCountMin:2,primaryQuestionAny:{kindAny:["relationship_status"]},factPresent:["relationshipStatus"]},["STATE_RELATIONSHIP_STATUS"],"multi_primary_relationship_status",["ANSWER_UNKNOWN"]);
  add("R1844_MULTI_PRIMARY_FEELINGS",955,{questionCountMin:2,primaryQuestionAny:{kindAny:["feelings"]},factPresent:["feelingsTowardHeroine"]},["STATE_FEELINGS_TOWARD_HEROINE"],"multi_primary_feelings",["ANSWER_UNKNOWN"]);
  add("R1845_MULTI_PRIMARY_PLAN",955,{questionCountMin:2,primaryQuestionAny:{kindAny:["plan"]},factPresent:["currentPlan"]},["STATE_CURRENT_PLAN"],"multi_primary_plan",["ANSWER_UNKNOWN"]);
  add("R1846_MULTI_PRIMARY_PREF",955,{questionCountMin:2,primaryQuestionAny:{kindAny:["preference"]},factPresent:["currentPreference"]},["STATE_CURRENT_PREFERENCE"],"multi_primary_preference",["ANSWER_UNKNOWN"]);
  add("R1847_MULTI_PRIMARY_WORK",955,{questionCountMin:2,primaryQuestionAny:{kindAny:["work"]},factPresent:["workStatus"]},["STATE_WORK_STATUS"],"multi_primary_work",["ANSWER_UNKNOWN"]);
  add("R1848_MULTI_PRIMARY_HOME",955,{questionCountMin:2,primaryQuestionAny:{kindAny:["home"]},factPresent:["home"]},["STATE_HOME"],"multi_primary_home",["ANSWER_UNKNOWN"]);
  add("R1849_MULTI_PRIMARY_DESIRE",955,{questionCountMin:2,primaryQuestionAny:{kindAny:["desire"]},factPresent:["currentDesire"]},["STATE_DESIRE"],"multi_primary_desire",["ANSWER_UNKNOWN"]);
  add("R1850_MULTI_PRIMARY_NEED",955,{questionCountMin:2,primaryQuestionAny:{kindAny:["need"]},factPresent:["currentNeed"]},["STATE_NEED"],"multi_primary_need",["ANSWER_UNKNOWN"]);
  add("R1851_MULTI_PRIMARY_CHOICE",955,{questionCountMin:2,primaryQuestionAny:{kindAny:["choice"]},factPresent:["currentChoice"]},["STATE_CHOICE"],"multi_primary_choice",["ANSWER_UNKNOWN"]);
  add("R1852_MULTI_PRIMARY_EVENT",955,{questionCountMin:2,primaryQuestionAny:{kindAny:["event"]},factPresent:["lastEvent"]},["STATE_EVENT"],"multi_primary_event",["ANSWER_UNKNOWN"]);
  add("R1853_MULTI_PRIMARY_PERMISSION_DENY",1130,{questionCountMin:2,primaryQuestionAny:{kindAny:["permission"],actionAny:["kiss"]},policyEq:{"permissions.kiss":false}},["DENY_PERMISSION"],"multi_primary_permission_deny",["GRANT_PERMISSION"]);
  add("R1854_MULTI_PRIMARY_REQUEST_DENY",1130,{questionCountMin:2,primaryQuestionAny:{kindAny:["request_action"],actionAny:["call"]},policyEq:{"requestResponses.call":false}},["DECLINE_ACTION_REQUEST"],"multi_primary_request_deny",["ACCEPT_ACTION_REQUEST"]);
  add("R1855_MULTI_PRIMARY_PERMISSION_ALLOW",790,{questionCountMin:2,primaryQuestionAny:{kindAny:["permission"],actionAny:["hug"]},policyEq:{"permissions.hug":true},boundaryNone:["do_not_hug","do_not_touch"]},["GRANT_PERMISSION"],"multi_primary_permission_allow",["ANSWER_UNKNOWN"]);
  add("R1856_MULTI_PRIMARY_REQUEST_ALLOW",790,{questionCountMin:2,primaryQuestionAny:{kindAny:["request_action"],actionAny:["message"]},policyEq:{"requestResponses.message":true},boundaryNone:["do_not_message","do_not_contact"]},["ACCEPT_ACTION_REQUEST"],"multi_primary_request_allow",["ANSWER_UNKNOWN"]);
  add("R1857_MULTI_RELATIONSHIP_SECONDARY",610,{questionCountMin:2,primaryQuestionAny:{kindAny:["where","when","plan","work"]},questionAny:{kindAny:["relationship_status","feelings"]}},["EXPRESS_CARE"],"multi_secondary_relationship");
  add("R1858_MULTI_HEALTH_SECONDARY",600,{questionCountMin:2,primaryQuestionAny:{kindAny:["where","when","plan","work"]},questionAny:{kindAny:["health"]}},["EXPRESS_CONCERN"],"multi_secondary_health");
  add("R1859_MULTI_ACTION_SECONDARY",590,{questionCountMin:2,primaryQuestionAny:{kindAny:["where","when","plan","work"]},questionAny:{kindAny:["permission","request_action"]}},["EXPRESS_NEED_CLARITY"],"multi_secondary_action");
  add("R1860_MULTI_THREE_PLUS",580,{questionCountMin:3},["ASK_FOR_DETAILS"],"multi_three_plus_questions");

  // Primary claim: claim interpretation selects canonical NPC facts, never mutates them.
  add("R1861_PRIMARY_LOVE_FEAR_TRUE",965,{primaryClaimAny:{conceptAny:["love","like"],typeAny:["speaker_fear","speaker_suspicion","question","accusation"]},factEq:{lovesHeroine:true}},["AFFIRM_LOVE"],"primary_love_fear_true",["DENY_LOVE","EXPRESS_UNCERTAINTY"]);
  add("R1862_PRIMARY_LOVE_FEAR_FALSE",965,{primaryClaimAny:{conceptAny:["love","like"],typeAny:["speaker_fear","speaker_suspicion","question","accusation"]},factEq:{lovesHeroine:false}},["DENY_LOVE"],"primary_love_fear_false",["AFFIRM_LOVE"]);
  add("R1863_PRIMARY_BETRAY_FEAR_FALSE",970,{primaryClaimAny:{conceptAny:["betrayal"],typeAny:["speaker_fear","speaker_suspicion","question","accusation"]},factEq:{intendsBetrayal:false}},["DENY_BETRAYAL"],"primary_betrayal_fear_false",["ADMIT_BETRAYAL"]);
  add("R1864_PRIMARY_BETRAY_TRUE",975,{primaryClaimAny:{conceptAny:["betrayal"],typeAny:["speaker_fear","speaker_suspicion","question","accusation"]},factEq:{hasBetrayed:true}},["ADMIT_BETRAYAL"],"primary_betrayal_true",["DENY_BETRAYAL"]);
  add("R1865_PRIMARY_ABANDON_FALSE",965,{primaryClaimAny:{conceptAny:["abandonment"],typeAny:["speaker_fear","speaker_suspicion","question","accusation"]},factEq:{willAbandonHeroine:false}},["DENY_ABANDONMENT","REASSURE_NOT_LEAVING"],"primary_abandonment_false",["ANSWER_UNKNOWN"]);
  add("R1866_PRIMARY_TRUST_TRUE",955,{primaryClaimAny:{conceptAny:["trust"],typeAny:["speaker_fear","speaker_suspicion","question","accusation"]},factEq:{trustsHeroine:true}},["CONFIRM_TRUST"],"primary_trust_true",["ANSWER_UNKNOWN"]);
  add("R1867_PRIMARY_CHOICE_TRUE",950,{primaryClaimAny:{conceptAny:["relationship","other_person"],typeAny:["speaker_fear","speaker_suspicion","question","accusation"]},factEq:{choosesHeroine:true}},["CONFIRM_CHOICE"],"primary_choice_true",["ANSWER_UNKNOWN"]);
  add("R1868_PRIMARY_HARM_FALSE",970,{primaryClaimAny:{conceptAny:["harm","death"],typeAny:["speaker_fear","speaker_suspicion","question","accusation"]},factEq:{wantsToHarmHeroine:false}},["REJECT_DEATH_WISH_CLAIM"],"primary_harm_false",["ANSWER_UNKNOWN"]);
  add("R1869_PRIMARY_LOYAL_TRUE",955,{primaryClaimAny:{conceptAny:["betrayal","trust"],typeAny:["speaker_fear","speaker_suspicion","question","accusation"]},factEq:{loyalToHeroine:true}},["PROMISE_LOYALTY"],"primary_loyal_true",["ANSWER_UNKNOWN"]);
  add("R1870_PRIMARY_REPORT_EVENT",620,{primaryClaimAny:{typeAny:["report"]},intentAny:["report_event"]},["ACKNOWLEDGE_EVENT"],"primary_report_event");
  add("R1871_PRIMARY_REPORT_HURT",630,{primaryClaimAny:{typeAny:["report"]},emotionMin:{hurt:45}},["EXPRESS_CONCERN"],"primary_report_hurt");
  add("R1872_PRIMARY_REPORT_SAD",620,{primaryClaimAny:{typeAny:["report"]},emotionMin:{sadness:45}},["EXPRESS_SYMPATHY"],"primary_report_sad");
  add("R1873_PRIMARY_PREF_CLAIM",540,{primaryClaimAny:{typeAny:["preference"]}},["ACKNOWLEDGE_EVENT"],"primary_preference_claim");
  add("R1874_PRIMARY_PLAN_CLAIM",540,{primaryClaimAny:{typeAny:["plan"]}},["ACKNOWLEDGE_EVENT"],"primary_plan_claim");
  add("R1875_PRIMARY_BOUNDARY_CLAIM",1180,{primaryClaimAny:{typeAny:["boundary"]}},["RESPECT_BOUNDARY"],"primary_boundary_claim");
  add("R1876_PRIMARY_REQUEST_CLAIM",600,{primaryClaimAny:{typeAny:["request"]}},["EXPRESS_NEED_CLARITY"],"primary_request_claim");
  add("R1877_PRIMARY_ACCUSATION_HIGH_HURT",650,{primaryClaimAny:{typeAny:["accusation"]},emotionMin:{hurt:50}},["EXPRESS_CONCERN"],"primary_accusation_high_hurt");
  add("R1878_PRIMARY_SUSPICION_DISTRUST",640,{primaryClaimAny:{typeAny:["speaker_suspicion"]},emotionMin:{distrust:50}},["ASK_FOR_HONEST_ANSWER"],"primary_suspicion_distrust");
  add("R1879_PRIMARY_FEAR_ANXIETY",630,{primaryClaimAny:{typeAny:["speaker_fear"]},emotionMin:{anxiety:50}},["EXPRESS_CARE"],"primary_fear_anxiety");
  add("R1880_PRIMARY_QUESTION_CLAIM",600,{primaryClaimAny:{typeAny:["question"]}},["EXPRESS_NEED_CLARITY"],"primary_question_claim");

  // Multi-claim combinations: primary claim remains dominant while related secondary claims add context.
  add("R1881_MULTI_PRIMARY_LOVE_BETRAY",980,{claimCountMin:2,primaryClaimAny:{conceptAny:["love","like"]},claimAny:{conceptAny:["betrayal"]},factEq:{lovesHeroine:true,intendsBetrayal:false}},["AFFIRM_LOVE","DENY_BETRAYAL"],"multi_love_betray_true",["DENY_LOVE","ADMIT_BETRAYAL"]);
  add("R1882_MULTI_PRIMARY_BETRAY_LOVE",980,{claimCountMin:2,primaryClaimAny:{conceptAny:["betrayal"]},claimAny:{conceptAny:["love","like"]},factEq:{intendsBetrayal:false,lovesHeroine:true}},["DENY_BETRAYAL","AFFIRM_LOVE"],"multi_betray_love_true",["ADMIT_BETRAYAL","DENY_LOVE"]);
  add("R1883_MULTI_LOVE_ABANDON",970,{claimCountMin:2,primaryClaimAny:{conceptAny:["love","like"]},claimAny:{conceptAny:["abandonment"]},factEq:{lovesHeroine:true,willAbandonHeroine:false}},["AFFIRM_LOVE","DENY_ABANDONMENT"],"multi_love_abandon",["DENY_LOVE"]);
  add("R1884_MULTI_TRUST_BETRAY",970,{claimCountMin:2,primaryClaimAny:{conceptAny:["trust"]},claimAny:{conceptAny:["betrayal"]},factEq:{trustsHeroine:true,intendsBetrayal:false}},["CONFIRM_TRUST","DENY_BETRAYAL"],"multi_trust_betray",["ADMIT_BETRAYAL"]);
  add("R1885_MULTI_ABANDON_CHOICE",960,{claimCountMin:2,primaryClaimAny:{conceptAny:["abandonment"]},claimAny:{conceptAny:["relationship","other_person"]},factEq:{willAbandonHeroine:false,choosesHeroine:true}},["DENY_ABANDONMENT","CONFIRM_CHOICE"],"multi_abandon_choice");
  add("R1886_MULTI_HARM_LOVE",970,{claimCountMin:2,primaryClaimAny:{conceptAny:["harm","death"]},claimAny:{conceptAny:["love","like"]},factEq:{wantsToHarmHeroine:false,lovesHeroine:true}},["REJECT_DEATH_WISH_CLAIM","AFFIRM_LOVE"],"multi_harm_love",["DENY_LOVE"]);
  add("R1887_MULTI_FEAR_SUSPICION",640,{claimCountMin:2,primaryClaimAny:{typeAny:["speaker_fear"]},claimAny:{typeAny:["speaker_suspicion"]}},["EXPRESS_CARE","ASK_FOR_HONEST_ANSWER"],"multi_fear_suspicion");
  add("R1888_MULTI_ACCUSATION_FEAR",650,{claimCountMin:2,primaryClaimAny:{typeAny:["accusation"]},claimAny:{typeAny:["speaker_fear"]}},["EXPRESS_CONCERN","ASK_FOR_HONEST_ANSWER"],"multi_accusation_fear");
  add("R1889_MULTI_REPORT_FEAR",620,{claimCountMin:2,primaryClaimAny:{typeAny:["report"]},claimAny:{typeAny:["speaker_fear"]}},["ACKNOWLEDGE_EVENT","EXPRESS_CARE"],"multi_report_fear");
  add("R1890_MULTI_REPORT_SUSPICION",620,{claimCountMin:2,primaryClaimAny:{typeAny:["report"]},claimAny:{typeAny:["speaker_suspicion"]}},["ACKNOWLEDGE_EVENT","ASK_FOR_HONEST_ANSWER"],"multi_report_suspicion");
  add("R1891_MULTI_BOUNDARY_ANY",1190,{claimCountMin:2,claimAny:{typeAny:["boundary"]}},["RESPECT_BOUNDARY"],"multi_claim_boundary");
  add("R1892_MULTI_PRIMARY_BOUNDARY",1200,{claimCountMin:2,primaryClaimAny:{typeAny:["boundary"]}},["RESPECT_BOUNDARY"],"multi_primary_boundary");
  add("R1893_MULTI_THREE_CLAIMS",590,{claimCountMin:3},["EXPRESS_NEED_CLARITY"],"three_or_more_claims");
  add("R1894_MULTI_PRIMARY_ACCUSATION",650,{claimCountMin:2,primaryClaimAny:{typeAny:["accusation"]},relationshipMin:{conscience:60}},["ASK_FOR_HONEST_ANSWER"],"multi_primary_accusation");
  add("R1895_MULTI_PRIMARY_FEAR",640,{claimCountMin:2,primaryClaimAny:{typeAny:["speaker_fear"]},relationshipMin:{goodwill:60}},["EXPRESS_CARE"],"multi_primary_fear");
  add("R1896_MULTI_PRIMARY_SUSPICION",640,{claimCountMin:2,primaryClaimAny:{typeAny:["speaker_suspicion"]},relationshipMin:{trust:60}},["ASK_FOR_HONEST_ANSWER"],"multi_primary_suspicion");
  add("R1897_MULTI_PRIMARY_REPORT",580,{claimCountMin:2,primaryClaimAny:{typeAny:["report"]}},["ACKNOWLEDGE_EVENT"],"multi_primary_report");
  add("R1898_MULTI_PRIMARY_PREF",560,{claimCountMin:2,primaryClaimAny:{typeAny:["preference"]}},["ACKNOWLEDGE_EVENT"],"multi_primary_preference_claim");
  add("R1899_MULTI_PRIMARY_PLAN",560,{claimCountMin:2,primaryClaimAny:{typeAny:["plan"]}},["ACKNOWLEDGE_EVENT"],"multi_primary_plan_claim");
  add("R1900_MULTI_BOUNDARY_FINAL",1200,{claimCountMin:2,claimAny:{typeAny:["boundary"]},boundaryAny:["leave_me_alone","do_not_follow","do_not_touch","do_not_kiss","do_not_hug","do_not_contact","do_not_ask","do_not_enter","stop_conversation","do_not_wait","do_not_visit","do_not_call","do_not_message"]},["RESPECT_BOUNDARY"],"multi_boundary_final");

  if (R.length !== 100) throw new Error("Expected 100 response rules, got " + R.length);
  HMW.Dialogue.registerResponseRules(R);
})();