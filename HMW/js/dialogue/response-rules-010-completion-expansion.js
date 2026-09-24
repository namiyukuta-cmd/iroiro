(() => {
  "use strict";
  window.HMW = window.HMW || {};
  HMW.Dialogue = HMW.Dialogue || {};

  const R = [];
  const add = (id, priority, when, meanings, reason=id) =>
    R.push({ id, priority, when, meanings, reason });

  // Practical question nuance.
  add("R901_PLAN_HESITANT",590,{questionAny:{kindAny:["plan"]},toneMin:{hesitation:55}},["EXPRESS_NEED_CLARITY"],"plan_question_hesitant");
  add("R902_PLAN_HOPEFUL",550,{questionAny:{kindAny:["plan"]},emotionMin:{hope:45}},["EXPRESS_HOPE"],"plan_question_hopeful");
  add("R903_PREFERENCE_HESITANT",570,{questionAny:{kindAny:["preference"]},toneMin:{hesitation:55}},["EXPRESS_CARE"],"preference_question_hesitant");
  add("R904_PREFERENCE_JOY",530,{questionAny:{kindAny:["preference"]},emotionMin:{joy:45}},["EXPRESS_JOY"],"preference_question_joy");
  add("R905_DESIRE_ANXIOUS",600,{questionAny:{kindAny:["desire"]},emotionMin:{anxiety:45}},["EXPRESS_CONCERN"],"desire_question_anxious");
  add("R906_DESIRE_HOPE",540,{questionAny:{kindAny:["desire"]},emotionMin:{hope:45}},["EXPRESS_HOPE"],"desire_question_hopeful");
  add("R907_NEED_ANXIOUS",610,{questionAny:{kindAny:["need"]},emotionMin:{anxiety:45}},["EXPRESS_CONCERN"],"need_question_anxious");
  add("R908_NEED_HURT",610,{questionAny:{kindAny:["need"]},emotionMin:{hurt:45}},["EXPRESS_CONCERN"],"need_question_hurt");
  add("R909_CHOICE_HESITANT",580,{questionAny:{kindAny:["choice"]},toneMin:{hesitation:55}},["EXPRESS_NEED_CLARITY"],"choice_question_hesitant");
  add("R910_CHOICE_RELIEF",530,{questionAny:{kindAny:["choice"]},emotionMin:{relief:45}},["EXPRESS_RELIEF"],"choice_question_relief");
  add("R911_EVENT_ANXIOUS",600,{questionAny:{kindAny:["event"]},emotionMin:{anxiety:45}},["EXPRESS_CONCERN"],"event_question_anxious");
  add("R912_EVENT_CONFUSED",590,{questionAny:{kindAny:["event"]},emotionMin:{confusion:45}},["ASK_FOR_DETAILS"],"event_question_confused");
  add("R913_REL_STATUS_DISTRUST",660,{questionAny:{kindAny:["relationship_status"]},emotionMin:{distrust:45}},["ASK_FOR_HONEST_ANSWER"],"relationship_status_distrust");
  add("R914_FEELINGS_DISTRUST",660,{questionAny:{kindAny:["feelings"]},emotionMin:{distrust:45}},["ASK_FOR_HONEST_ANSWER"],"feelings_question_distrust");
  add("R915_PERMISSION_HESITANT",620,{questionAny:{kindAny:["permission"]},toneMin:{hesitation:55}},["EXPRESS_CARE"],"permission_question_hesitant");
  add("R916_REQUEST_HESITANT",620,{questionAny:{kindAny:["request_action"]},toneMin:{hesitation:55}},["EXPRESS_CARE"],"request_question_hesitant");
  add("R917_INVITATION_JOY",540,{questionAny:{kindAny:["invitation"]},emotionMin:{joy:45}},["EXPRESS_JOY"],"invitation_question_joy");
  add("R918_INVITATION_ANXIOUS",600,{questionAny:{kindAny:["invitation"]},emotionMin:{anxiety:45}},["EXPRESS_CONCERN"],"invitation_question_anxious");
  add("R919_SUGGESTION_HOPE",540,{questionAny:{kindAny:["suggestion"]},emotionMin:{hope:45}},["EXPRESS_HOPE"],"suggestion_question_hope");
  add("R920_SUGGESTION_DISTRUST",610,{questionAny:{kindAny:["suggestion"]},emotionMin:{distrust:45}},["EXPRESS_NEED_CLARITY"],"suggestion_question_distrust");

  // Exact action policy coverage.
  add("R921_PERMISSION_HELP_ALLOW",740,{questionAny:{kindAny:["permission"],actionAny:["help"]},policyEq:{"permissions.help":true}},["GRANT_PERMISSION"],"permission_help_allow");
  add("R922_PERMISSION_HELP_DENY",750,{questionAny:{kindAny:["permission"],actionAny:["help"]},policyEq:{"permissions.help":false}},["DENY_PERMISSION"],"permission_help_deny");
  add("R923_PERMISSION_MEET_ALLOW",740,{questionAny:{kindAny:["permission"],actionAny:["meet"]},policyEq:{"permissions.meet":true},boundaryNone:["do_not_visit"]},["GRANT_PERMISSION"],"permission_meet_allow");
  add("R924_PERMISSION_MEET_DENY",760,{questionAny:{kindAny:["permission"],actionAny:["meet"]},policyEq:{"permissions.meet":false}},["DENY_PERMISSION"],"permission_meet_deny");
  add("R925_PERMISSION_EAT_ALLOW",730,{questionAny:{kindAny:["permission"],actionAny:["eat"]},policyEq:{"permissions.eat":true}},["GRANT_PERMISSION"],"permission_eat_allow");
  add("R926_PERMISSION_EAT_DENY",730,{questionAny:{kindAny:["permission"],actionAny:["eat"]},policyEq:{"permissions.eat":false}},["DENY_PERMISSION"],"permission_eat_deny");
  add("R927_PERMISSION_DRINK_ALLOW",730,{questionAny:{kindAny:["permission"],actionAny:["drink"]},policyEq:{"permissions.drink":true}},["GRANT_PERMISSION"],"permission_drink_allow");
  add("R928_PERMISSION_DRINK_DENY",730,{questionAny:{kindAny:["permission"],actionAny:["drink"]},policyEq:{"permissions.drink":false}},["DENY_PERMISSION"],"permission_drink_deny");
  add("R929_REQUEST_CALL_ALLOW",750,{questionAny:{kindAny:["request_action"],actionAny:["call"]},policyEq:{"requestResponses.call":true},boundaryNone:["do_not_call","do_not_contact"]},["ACCEPT_ACTION_REQUEST"],"request_call_allow");
  add("R930_REQUEST_CALL_DENY",770,{questionAny:{kindAny:["request_action"],actionAny:["call"]},policyEq:{"requestResponses.call":false}},["DECLINE_ACTION_REQUEST"],"request_call_deny");
  add("R931_REQUEST_MESSAGE_ALLOW",750,{questionAny:{kindAny:["request_action"],actionAny:["message"]},policyEq:{"requestResponses.message":true},boundaryNone:["do_not_message","do_not_contact"]},["ACCEPT_ACTION_REQUEST"],"request_message_allow");
  add("R932_REQUEST_MESSAGE_DENY",770,{questionAny:{kindAny:["request_action"],actionAny:["message"]},policyEq:{"requestResponses.message":false}},["DECLINE_ACTION_REQUEST"],"request_message_deny");
  add("R933_REQUEST_GO_ALLOW",740,{questionAny:{kindAny:["request_action"],actionAny:["go"]},policyEq:{"requestResponses.go":true}},["ACCEPT_ACTION_REQUEST"],"request_go_allow");
  add("R934_REQUEST_GO_DENY",740,{questionAny:{kindAny:["request_action"],actionAny:["go"]},policyEq:{"requestResponses.go":false}},["DECLINE_ACTION_REQUEST"],"request_go_deny");
  add("R935_INVITE_CALL_ALLOW",730,{questionAny:{kindAny:["invitation"],actionAny:["call"]},policyEq:{"invitationResponses.call":true},boundaryNone:["do_not_call","do_not_contact"]},["ACCEPT_INVITATION"],"invite_call_allow");
  add("R936_INVITE_CALL_DENY",740,{questionAny:{kindAny:["invitation"],actionAny:["call"]},policyEq:{"invitationResponses.call":false}},["DECLINE_INVITATION"],"invite_call_deny");
  add("R937_INVITE_MESSAGE_ALLOW",730,{questionAny:{kindAny:["invitation"],actionAny:["message"]},policyEq:{"invitationResponses.message":true},boundaryNone:["do_not_message","do_not_contact"]},["ACCEPT_INVITATION"],"invite_message_allow");
  add("R938_INVITE_MESSAGE_DENY",740,{questionAny:{kindAny:["invitation"],actionAny:["message"]},policyEq:{"invitationResponses.message":false}},["DECLINE_INVITATION"],"invite_message_deny");
  add("R939_SUGGEST_HELP_ALLOW",720,{questionAny:{kindAny:["suggestion"],actionAny:["help"]},policyEq:{"suggestionResponses.help":true}},["ACCEPT_SUGGESTION"],"suggest_help_allow");
  add("R940_SUGGEST_HELP_DENY",730,{questionAny:{kindAny:["suggestion"],actionAny:["help"]},policyEq:{"suggestionResponses.help":false}},["DECLINE_SUGGESTION"],"suggest_help_deny");

  // Daily-topic claim handling.
  add("R941_CLAIM_WORK_PLAN",540,{claimAny:{conceptAny:["work","job"],typeAny:["plan"]}},["STATE_PLAN"],"work_plan_claim");
  add("R942_CLAIM_WORK_PREFERENCE",520,{claimAny:{conceptAny:["work","job"],typeAny:["preference"]}},["STATE_PREFERENCE"],"work_preference_claim");
  add("R943_CLAIM_MONEY_REPORT",530,{claimAny:{conceptAny:["money","rent"],typeAny:["report"]}},["ACKNOWLEDGE_EVENT"],"money_report_claim");
  add("R944_CLAIM_FOOD_REPORT",520,{claimAny:{conceptAny:["food","hunger"],typeAny:["report"]}},["ACKNOWLEDGE_EVENT"],"food_report_claim");
  add("R945_CLAIM_WATER_REPORT",520,{claimAny:{conceptAny:["water","thirst"],typeAny:["report"]}},["ACKNOWLEDGE_EVENT"],"water_report_claim");
  add("R946_CLAIM_SLEEP_REPORT",530,{claimAny:{conceptAny:["sleep","tiredness"],typeAny:["report"]}},["ACKNOWLEDGE_EVENT"],"sleep_report_claim");
  add("R947_CLAIM_HEALTH_FEAR",650,{claimAny:{conceptAny:["health","injury","illness"],typeAny:["speaker_fear"]}},["EXPRESS_CONCERN"],"health_fear_claim");
  add("R948_CLAIM_HEALTH_REPORT",570,{claimAny:{conceptAny:["health","injury","illness"],typeAny:["report"]}},["ASK_IF_OKAY"],"health_report_claim");
  add("R949_CLAIM_HOME_PLAN",540,{claimAny:{conceptAny:["home","shelter"],typeAny:["plan"]}},["STATE_PLAN"],"home_plan_claim");
  add("R950_CLAIM_HOME_PREFERENCE",520,{claimAny:{conceptAny:["home","place"],typeAny:["preference"]}},["STATE_PREFERENCE"],"home_preference_claim");
  add("R951_CLAIM_TRAVEL_PLAN",540,{claimAny:{conceptAny:["travel","destination"],typeAny:["plan"]}},["STATE_PLAN"],"travel_plan_claim");
  add("R952_CLAIM_TRAVEL_REPORT",520,{claimAny:{conceptAny:["travel"],typeAny:["report"]}},["ACKNOWLEDGE_EVENT"],"travel_report_claim");
  add("R953_CLAIM_MEETING_PLAN",540,{claimAny:{conceptAny:["meeting"],typeAny:["plan"]}},["STATE_PLAN"],"meeting_plan_claim");
  add("R954_CLAIM_MEETING_REPORT",520,{claimAny:{conceptAny:["meeting"],typeAny:["report"]}},["ACKNOWLEDGE_EVENT"],"meeting_report_claim");
  add("R955_CLAIM_FAMILY_REPORT",520,{claimAny:{conceptAny:["family"],typeAny:["report"]}},["ACKNOWLEDGE_EVENT"],"family_report_claim");
  add("R956_CLAIM_FRIEND_REPORT",520,{claimAny:{conceptAny:["friend"],typeAny:["report"]}},["ACKNOWLEDGE_EVENT"],"friend_report_claim");
  add("R957_CLAIM_RETURN_PLAN",560,{claimAny:{conceptAny:["return"],typeAny:["plan"]}},["PROMISE_RETURN"],"return_plan_claim");
  add("R958_CLAIM_CONTACT_PLAN",540,{claimAny:{conceptAny:["contact"],typeAny:["plan"]}},["STATE_PLAN"],"contact_plan_claim");
  add("R959_CLAIM_CONTACT_REQUEST",600,{claimAny:{conceptAny:["contact"],typeAny:["request"]}},["REQUEST_CONTACT"],"contact_request_claim");
  add("R960_CLAIM_DISTANCE_REQUEST",700,{claimAny:{conceptAny:["distance"],typeAny:["request"]}},["ACCEPT_DISTANCE"],"distance_request_claim");

  // Relationship facts + affect.
  add("R961_LOVE_TRUE_JOY",830,{focusAny:["love","like"],factEq:{"lovesHeroine":true},emotionMin:{joy:45}},["AFFIRM_LOVE","EXPRESS_JOY"],"love_true_joy");
  add("R962_LOVE_TRUE_ANXIETY",850,{focusAny:["love","like"],factEq:{"lovesHeroine":true},emotionMin:{anxiety:45}},["AFFIRM_LOVE","EXPRESS_CARE"],"love_true_anxiety");
  add("R963_LOVE_FALSE_HURT",850,{focusAny:["love","like"],factEq:{"lovesHeroine":false},emotionMin:{hurt:45}},["DENY_LOVE","EXPRESS_CONCERN"],"love_false_hurt");
  add("R964_TRUST_TRUE_ANXIETY",830,{focusAny:["trust"],factEq:{"trustsHeroine":true},emotionMin:{anxiety:45}},["CONFIRM_TRUST"],"trust_true_anxiety");
  add("R965_TRUST_TRUE_HURT",830,{focusAny:["trust"],factEq:{"trustsHeroine":true},emotionMin:{hurt:45}},["CONFIRM_TRUST","EXPRESS_CONCERN"],"trust_true_hurt");
  add("R966_LOYAL_TRUE_DISTRUST",840,{focusAny:["betrayal","trust"],factEq:{"loyalToHeroine":true},emotionMin:{distrust:45}},["PROMISE_LOYALTY"],"loyal_true_distrust");
  add("R967_NO_ABANDON_ANXIETY",850,{focusAny:["abandonment"],factEq:{"willAbandonHeroine":false},emotionMin:{anxiety:45}},["DENY_ABANDONMENT","REASSURE_NOT_LEAVING"],"no_abandon_anxiety");
  add("R968_CHOICE_TRUE_ANXIETY",830,{focusAny:["relationship"],factEq:{"choosesHeroine":true},emotionMin:{anxiety:45}},["CONFIRM_CHOICE"],"choice_true_anxiety");
  add("R969_BETRAYAL_FALSE_DISTRUST",850,{focusAny:["betrayal"],factEq:{"intendsBetrayal":false},emotionMin:{distrust:45}},["DENY_BETRAYAL"],"betrayal_false_distrust");
  add("R970_BETRAYAL_TRUE_HURT",880,{focusAny:["betrayal"],factEq:{"hasBetrayed":true},emotionMin:{hurt:45}},["ADMIT_BETRAYAL","EXPRESS_CONCERN"],"betrayal_true_hurt");
  add("R971_REASSURE_CARE_HIGH",650,{intentAny:["request_reassurance","seek_reassurance"],psychologyMin:{care:65}},["EXPRESS_CARE"],"reassure_care_high");
  add("R972_REASSURE_TENDER_HIGH",650,{intentAny:["request_reassurance","seek_reassurance"],psychologyMin:{tenderness:65}},["EXPRESS_CARE"],"reassure_tender_high");
  add("R973_REASSURE_EMPATHY_HIGH",650,{intentAny:["request_reassurance","seek_reassurance"],psychologyMin:{empathy:65}},["EXPRESS_CONCERN"],"reassure_empathy_high");
  add("R974_DENY_AFFECTION_CARE",620,{intentAny:["deny_affection"],psychologyMin:{care:60}},["ASK_TO_TALK"],"deny_affection_care");
  add("R975_DENY_AFFECTION_TENDER",620,{intentAny:["deny_affection"],psychologyMin:{tenderness:60}},["EXPRESS_CARE"],"deny_affection_tender");
  add("R976_ACCUSATION_EMPATHY",640,{claimTypeAny:["accusation"],psychologyMin:{empathy:60}},["EXPRESS_CONCERN"],"accusation_empathy");
  add("R977_ACCUSATION_ANGER",640,{claimTypeAny:["accusation"],psychologyMin:{anger:60}},["REQUEST_TIME"],"accusation_anger");
  add("R978_APOLOGY_FEARLOSS",630,{intentAny:["apologize"],psychologyMin:{fearOfLoss:60}},["EXPRESS_REPAIR_DESIRE"],"apology_fearloss");
  add("R979_DISTANCE_TENDER",690,{intentAny:["request_distance"],psychologyMin:{tenderness:60}},["TEMPORARY_STEP_BACK"],"distance_tender");
  add("R980_DISTANCE_EMPATHY",690,{intentAny:["request_distance"],psychologyMin:{empathy:60}},["ACCEPT_DISTANCE"],"distance_empathy");

  // Social and conversational continuity.
  add("R981_EXPRESS_FEAR",620,{intentAny:["express_fear"]},["EXPRESS_CONCERN"],"fear_expression");
  add("R982_EXPRESS_FEAR_CARE",630,{intentAny:["express_fear"],psychologyMin:{care:55}},["EXPRESS_CARE"],"fear_expression_care");
  add("R983_EXPRESS_LONELINESS_CARE",620,{intentAny:["express_loneliness"],psychologyMin:{care:55},boundaryNone:["leave_me_alone"]},["OFFER_COMPANY"],"loneliness_expression_care");
  add("R984_EXPRESS_JEALOUSY_CARE",600,{intentAny:["express_jealousy"],psychologyMin:{care:55}},["ASK_ABOUT_OTHER_PERSON"],"jealousy_expression_care");
  add("R985_EXPRESS_HURT_REPAIR",640,{intentAny:["express_hurt"],psychologyMin:{care:55}},["ASK_TO_REPAIR"],"hurt_expression_repair");
  add("R986_EXPRESS_ANGER_REPAIR",630,{intentAny:["express_anger"],psychologyMin:{empathy:55}},["ASK_TO_TALK"],"anger_expression_repair");
  add("R987_DISAPPOINTMENT_CARE",620,{intentAny:["express_disappointment"],psychologyMin:{care:55}},["EXPRESS_SYMPATHY"],"disappointment_care");
  add("R988_HOPE_CARE",560,{intentAny:["express_hope"],psychologyMin:{care:55}},["EXPRESS_HOPE"],"hope_care");
  add("R989_PRIDE_CARE",550,{intentAny:["express_pride"],psychologyMin:{care:55}},["EXPRESS_APPROVAL"],"pride_care");
  add("R990_SURPRISE_CONFUSION",580,{intentAny:["express_surprise"],psychologyMin:{confusion:55}},["ASK_FOR_DETAILS"],"surprise_confusion");
  add("R991_REPORT_EVENT_EMPATHY",570,{intentAny:["report_event"],psychologyMin:{empathy:55}},["ACKNOWLEDGE_EVENT"],"event_report_empathy");
  add("R992_REPORT_CONDITION_CARE",580,{intentAny:["report_condition"],psychologyMin:{care:55}},["EXPRESS_CARE"],"condition_report_care");
  add("R993_STATE_PLAN_CARE",530,{intentAny:["state_plan"],psychologyMin:{care:55}},["EXPRESS_CARE"],"state_plan_care");
  add("R994_STATE_PREFERENCE_CARE",520,{intentAny:["state_preference"],psychologyMin:{care:55}},["EXPRESS_CARE"],"state_preference_care");
  add("R995_CONFIRM_ARRIVAL_CARE",550,{intentAny:["confirm_arrival"],psychologyMin:{care:55}},["EXPRESS_RELIEF"],"confirm_arrival_care");
  add("R996_CONFIRM_DEPARTURE_CARE",560,{intentAny:["confirm_departure"],psychologyMin:{care:55}},["EXPRESS_MISSING"],"confirm_departure_care");
  add("R997_OFFER_CONTACT_GRATEFUL",520,{intentAny:["offer_contact"],psychologyMin:{care:55}},["EXPRESS_GRATITUDE"],"offer_contact_grateful");
  add("R998_OFFER_COMPANY_GRATEFUL",520,{intentAny:["offer_company"],psychologyMin:{care:55}},["EXPRESS_GRATITUDE"],"offer_company_grateful");
  add("R999_AGREE_CARE",510,{intentAny:["agree"],psychologyMin:{care:55}},["EXPRESS_RELIEF"],"agreement_care");
  add("R1000_REFUSE_BOUNDARY",950,{intentAny:["refuse"]},["RESPECT_BOUNDARY"],"refusal_boundary_final");

  if (R.length !== 100) throw new Error("Expected 100 response rules, got " + R.length);
  HMW.Dialogue.registerResponseRules(R);
})();