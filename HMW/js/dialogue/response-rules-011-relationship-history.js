(() => {
  "use strict";
  window.HMW = window.HMW || {};
  HMW.Dialogue = HMW.Dialogue || {};

  const R = [];
  const add = (id, priority, when, meanings, reason=id) =>
    R.push({ id, priority, when, meanings, reason });

  // Familiarity / trust / goodwill thresholds.
  add("R1001_FAMILIARITY_LOW_GREETING",560,{intentAny:["greet"],relationshipMax:{familiarity:20}},["RETURN_GREETING"],"low_familiarity_greeting");
  add("R1002_FAMILIARITY_MID_GREETING",570,{intentAny:["greet"],relationshipMin:{familiarity:35},relationshipMax:{familiarity:69}},["EXPRESS_JOY"],"mid_familiarity_greeting");
  add("R1003_FAMILIARITY_HIGH_GREETING",590,{intentAny:["greet"],relationshipMin:{familiarity:70}},["EXPRESS_JOY","EXPRESS_CARE"],"high_familiarity_greeting");
  add("R1004_FAMILIARITY_LOW_PERSONAL",560,{focusAny:["relationship","love","trust"],relationshipMax:{familiarity:20}},["EXPRESS_NEED_CLARITY"],"low_familiarity_personal_topic");
  add("R1005_FAMILIARITY_HIGH_REPORT",550,{intentAny:["report_event"],relationshipMin:{familiarity:70}},["ACKNOWLEDGE_EVENT"],"high_familiarity_event_report");
  add("R1006_TRUST_LOW_QUESTION",610,{intentAny:["ask_question"],relationshipMax:{trust:25}},["EXPRESS_NEED_CLARITY"],"low_relationship_trust_question");
  add("R1007_TRUST_LOW_ACCUSATION",650,{claimTypeAny:["accusation"],relationshipMax:{trust:25}},["ASK_FOR_HONEST_ANSWER"],"low_relationship_trust_accusation");
  add("R1008_TRUST_MID_REASSURANCE",620,{intentAny:["request_reassurance","seek_reassurance"],relationshipMin:{trust:35},relationshipMax:{trust:69}},["EXPRESS_CARE"],"mid_relationship_trust_reassurance");
  add("R1009_TRUST_HIGH_REASSURANCE",700,{intentAny:["request_reassurance","seek_reassurance"],relationshipMin:{trust:70}},["CONFIRM_TRUST"],"high_relationship_trust_reassurance");
  add("R1010_TRUST_HIGH_BETRAYAL",690,{focusAny:["betrayal"],relationshipMin:{trust:75},factEq:{"intendsBetrayal":false}},["DENY_BETRAYAL"],"high_trust_betrayal_reassurance");
  add("R1011_TRUST_HIGH_HURT",620,{intentAny:["express_hurt"],relationshipMin:{trust:70}},["ASK_TO_TALK"],"high_trust_hurt");
  add("R1012_TRUST_HIGH_APOLOGY",620,{intentAny:["apologize"],relationshipMin:{trust:70}},["EXPRESS_REPAIR_DESIRE"],"high_trust_apology");
  add("R1013_GOODWILL_LOW_REQUEST",570,{intentAny:["ask_for_help","ask_to_meet","ask_to_talk"],relationshipMax:{goodwill:20}},["EXPRESS_NEED_CLARITY"],"low_goodwill_request");
  add("R1014_GOODWILL_MID_HELP",560,{intentAny:["ask_for_help"],relationshipMin:{goodwill:35},relationshipMax:{goodwill:69}},["OFFER_HELP"],"mid_goodwill_help");
  add("R1015_GOODWILL_HIGH_HELP",590,{intentAny:["ask_for_help"],relationshipMin:{goodwill:70}},["OFFER_HELP"],"high_goodwill_help");
  add("R1016_GOODWILL_HIGH_HURT",610,{intentAny:["express_hurt"],relationshipMin:{goodwill:70}},["EXPRESS_CONCERN"],"high_goodwill_hurt");
  add("R1017_GOODWILL_HIGH_SAD",600,{emotionMin:{sadness:50},relationshipMin:{goodwill:70}},["EXPRESS_SYMPATHY"],"high_goodwill_sadness");
  add("R1018_GOODWILL_HIGH_FEAR",610,{emotionMin:{fear:50},relationshipMin:{goodwill:70}},["EXPRESS_CARE"],"high_goodwill_fear");
  add("R1019_GOODWILL_HIGH_GOODBYE",570,{intentAny:["say_goodbye"],relationshipMin:{goodwill:70}},["SAY_GOODBYE_TEMPORARY"],"high_goodwill_goodbye");
  add("R1020_FAMILIARITY_TRUST_HIGH",620,{focusAny:["relationship"],relationshipMin:{familiarity:70,trust:70}},["EXPRESS_CARE"],"high_familiarity_and_trust");

  // Desire / conscience / malice. Desire never grants consent by itself.
  add("R1021_DESIRE_HIGH_AFFECTION",610,{intentAny:["affirm_affection"],relationshipMin:{desire:70},boundaryNone:["leave_me_alone","do_not_touch","stop_conversation"]},["EXPRESS_WANT_TO_BE_TOGETHER"],"high_desire_affection");
  add("R1022_DESIRE_HIGH_GOODBYE",580,{intentAny:["say_goodbye"],relationshipMin:{desire:70}},["EXPRESS_MISSING"],"high_desire_goodbye");
  add("R1023_DESIRE_HIGH_MEETING",590,{intentAny:["ask_to_meet"],relationshipMin:{desire:70},boundaryNone:["leave_me_alone","do_not_visit"]},["EXPRESS_WANT_TO_BE_TOGETHER"],"high_desire_meeting");
  add("R1024_DESIRE_HIGH_LONELY",600,{emotionMin:{loneliness:50},relationshipMin:{desire:70},boundaryNone:["leave_me_alone","stop_conversation"]},["OFFER_COMPANY"],"high_desire_loneliness");
  add("R1025_DESIRE_LOW_AFFECTION",540,{intentAny:["affirm_affection"],relationshipMax:{desire:20}},["EXPRESS_CARE"],"low_desire_affection");
  add("R1026_CONSCIENCE_HIGH_APOLOGY",650,{intentAny:["apologize"],relationshipMin:{conscience:70}},["EXPRESS_REPAIR_DESIRE"],"high_conscience_apology");
  add("R1027_CONSCIENCE_HIGH_HURT",640,{intentAny:["express_hurt"],relationshipMin:{conscience:70}},["EXPRESS_CONCERN"],"high_conscience_hurt");
  add("R1028_CONSCIENCE_HIGH_BOUNDARY",980,{boundaryAny:["leave_me_alone","do_not_touch","do_not_kiss","do_not_hug","stop_conversation"],relationshipMin:{conscience:70}},["RESPECT_BOUNDARY"],"high_conscience_boundary");
  add("R1029_CONSCIENCE_HIGH_CONFLICT",630,{emotionMin:{anger:45,hurt:45},relationshipMin:{conscience:70}},["ASK_TO_REPAIR"],"high_conscience_conflict");
  add("R1030_CONSCIENCE_LOW_CONFLICT",570,{emotionMin:{anger:50},relationshipMax:{conscience:25}},["REQUEST_TIME"],"low_conscience_conflict");
  add("R1031_MALICE_HIGH_ANGER",620,{emotionMin:{anger:50},relationshipMin:{malice:70},boundaryNone:["stop_conversation"]},["EXPRESS_ANGER"],"high_malice_anger");
  add("R1032_MALICE_HIGH_DISTRUST",620,{emotionMin:{distrust:50},relationshipMin:{malice:70}},["EXPRESS_NEED_CLARITY"],"high_malice_distrust");
  add("R1033_MALICE_HIGH_ACCUSATION",630,{claimTypeAny:["accusation"],relationshipMin:{malice:70}},["REQUEST_TIME"],"high_malice_accusation");
  add("R1034_MALICE_LOW_APOLOGY",610,{intentAny:["apologize"],relationshipMax:{malice:20}},["EXPRESS_REPAIR_DESIRE"],"low_malice_apology");
  add("R1035_DESIRE_HIGH_TRUST_LOW",600,{focusAny:["relationship","love"],relationshipMin:{desire:70},relationshipMax:{trust:30}},["EXPRESS_UNCERTAINTY"],"high_desire_low_trust");
  add("R1036_DESIRE_HIGH_TRUST_HIGH",630,{focusAny:["relationship","love"],relationshipMin:{desire:70,trust:70},boundaryNone:["leave_me_alone","stop_conversation"]},["EXPRESS_CARE"],"high_desire_high_trust");
  add("R1037_CONSCIENCE_HIGH_MALICE_LOW",620,{intentAny:["express_hurt","apologize"],relationshipMin:{conscience:70},relationshipMax:{malice:20}},["ASK_TO_REPAIR"],"high_conscience_low_malice");
  add("R1038_MALICE_HIGH_GOODWILL_LOW",590,{focusAny:["relationship"],relationshipMin:{malice:70},relationshipMax:{goodwill:25}},["EXPRESS_NEED_CLARITY"],"high_malice_low_goodwill");
  add("R1039_DESIRE_HIGH_BOUNDARY",990,{relationshipMin:{desire:70},boundaryAny:["do_not_touch","do_not_kiss","do_not_hug"]},["RESPECT_BOUNDARY"],"desire_never_overrides_boundary");
  add("R1040_MALICE_HIGH_BOUNDARY",995,{relationshipMin:{malice:70},boundaryAny:["leave_me_alone","do_not_contact","stop_conversation"]},["RESPECT_BOUNDARY"],"malice_never_overrides_boundary");

  // Multi-value relationship combinations.
  add("R1041_REL_EARLY_WARM",550,{intentAny:["greet"],relationshipMax:{familiarity:30},relationshipMin:{goodwill:40}},["RETURN_GREETING"],"early_but_warm_relationship");
  add("R1042_REL_EARLY_DISTRUST",600,{intentAny:["ask_question"],relationshipMax:{familiarity:30,trust:30}},["EXPRESS_NEED_CLARITY"],"early_low_trust_relationship");
  add("R1043_REL_CLOSE_TRUSTED",640,{focusAny:["relationship"],relationshipMin:{familiarity:70,trust:70,goodwill:70}},["EXPRESS_CARE"],"close_trusted_relationship");
  add("R1044_REL_CLOSE_HURT",650,{intentAny:["express_hurt"],relationshipMin:{familiarity:70,goodwill:60}},["EXPRESS_REPAIR_DESIRE"],"close_relationship_hurt");
  add("R1045_REL_CLOSE_ANGER",630,{intentAny:["express_anger"],relationshipMin:{familiarity:70,trust:60}},["ASK_TO_TALK"],"close_relationship_anger");
  add("R1046_REL_CLOSE_GOODBYE",590,{intentAny:["say_goodbye"],relationshipMin:{familiarity:70,goodwill:70}},["EXPRESS_MISSING"],"close_relationship_goodbye");
  add("R1047_REL_TRUST_GOODWILL_REASSURE",690,{intentAny:["request_reassurance","seek_reassurance"],relationshipMin:{trust:65,goodwill:65}},["EXPRESS_CARE","CONFIRM_TRUST"],"trusted_goodwill_reassurance");
  add("R1048_REL_TRUST_LOW_GOODWILL_HIGH",610,{focusAny:["trust","relationship"],relationshipMax:{trust:30},relationshipMin:{goodwill:70}},["ASK_FOR_TRUST"],"goodwill_high_trust_low");
  add("R1049_REL_TRUST_HIGH_GOODWILL_LOW",590,{focusAny:["relationship"],relationshipMin:{trust:70},relationshipMax:{goodwill:30}},["EXPRESS_NEED_CLARITY"],"trust_high_goodwill_low");
  add("R1050_REL_DESIRE_GOODWILL_HIGH",620,{intentAny:["affirm_affection"],relationshipMin:{desire:65,goodwill:65},boundaryNone:["leave_me_alone","stop_conversation"]},["EXPRESS_CARE"],"desire_goodwill_high");
  add("R1051_REL_DESIRE_HIGH_GOODWILL_LOW",590,{focusAny:["love","relationship"],relationshipMin:{desire:70},relationshipMax:{goodwill:25}},["EXPRESS_UNCERTAINTY"],"desire_high_goodwill_low");
  add("R1052_REL_CONSCIENCE_CARE",630,{intentAny:["express_hurt"],relationshipMin:{conscience:65,goodwill:55}},["EXPRESS_CONCERN"],"conscience_goodwill_hurt");
  add("R1053_REL_CONSCIENCE_REPAIR",640,{intentAny:["apologize"],relationshipMin:{conscience:65,trust:50}},["ASK_TO_REPAIR"],"conscience_trust_repair");
  add("R1054_REL_MALICE_TRUST_LOW",620,{emotionMin:{anger:45},relationshipMin:{malice:65},relationshipMax:{trust:30}},["EXPRESS_ANGER"],"malice_high_trust_low");
  add("R1055_REL_MALICE_TRUST_HIGH",590,{emotionMin:{anger:45},relationshipMin:{malice:65,trust:70}},["REQUEST_TIME"],"malice_high_trust_high");
  add("R1056_REL_HIGH_ALL_REASSURANCE",720,{intentAny:["request_reassurance","seek_reassurance"],relationshipMin:{familiarity:70,trust:70,goodwill:70}},["EXPRESS_CARE","CONFIRM_TRUST"],"high_relationship_reassurance");
  add("R1057_REL_HIGH_ALL_GREETING",580,{intentAny:["greet"],relationshipMin:{familiarity:70,trust:70,goodwill:70}},["EXPRESS_JOY","EXPRESS_CARE"],"high_relationship_greeting");
  add("R1058_REL_HIGH_ALL_REPORT",570,{intentAny:["report_event"],relationshipMin:{familiarity:70,trust:70,goodwill:70}},["ACKNOWLEDGE_EVENT","EXPRESS_CARE"],"high_relationship_report");
  add("R1059_REL_LOW_ALL_QUESTION",610,{intentAny:["ask_question"],relationshipMax:{familiarity:25,trust:25,goodwill:25}},["EXPRESS_NEED_CLARITY"],"low_relationship_question");
  add("R1060_REL_LOW_ALL_REQUEST",600,{intentAny:["ask_for_help","ask_to_meet","ask_to_talk"],relationshipMax:{familiarity:25,trust:25,goodwill:25}},["EXPRESS_NEED_CLARITY"],"low_relationship_request");

  // History-sensitive continuation / repetition handling.
  add("R1061_HISTORY_AFTER_LOVE_CONFIRM",650,{intentAny:["question_affection"],historyAny:["AFFIRM_LOVE"]},["EXPRESS_CARE"],"after_recent_love_confirmation");
  add("R1062_HISTORY_AFTER_TRUST_CONFIRM",640,{focusAny:["trust"],historyAny:["CONFIRM_TRUST"]},["EXPRESS_CARE"],"after_recent_trust_confirmation");
  add("R1063_HISTORY_AFTER_BETRAYAL_DENIAL",660,{intentAny:["fear_betrayal","accuse_betrayal"],historyAny:["DENY_BETRAYAL"],factEq:{"loyalToHeroine":true}},["PROMISE_LOYALTY"],"after_recent_betrayal_denial");
  add("R1064_HISTORY_AFTER_NOT_LEAVING",650,{intentAny:["request_reassurance","seek_reassurance"],historyAny:["REASSURE_NOT_LEAVING"],factEq:{"choosesHeroine":true}},["CONFIRM_CHOICE"],"after_recent_not_leaving");
  add("R1065_HISTORY_AFTER_CONCERN",600,{intentAny:["report_condition"],historyAny:["EXPRESS_CONCERN"]},["ASK_IF_OKAY"],"after_recent_concern");
  add("R1066_HISTORY_AFTER_ASK_OKAY",610,{intentAny:["report_condition"],historyAny:["ASK_IF_OKAY"],toneMin:{hesitation:55}},["EXPRESS_CONCERN"],"after_recent_ask_if_okay");
  add("R1067_HISTORY_AFTER_SYMPATHY",570,{intentAny:["report_event"],historyAny:["EXPRESS_SYMPATHY"]},["ACKNOWLEDGE_EVENT"],"after_recent_sympathy");
  add("R1068_HISTORY_AFTER_DETAILS",570,{intentAny:["report_event"],historyAny:["ASK_FOR_DETAILS"]},["ACKNOWLEDGE_EVENT"],"after_recent_details_question");
  add("R1069_HISTORY_AFTER_GREETING",520,{intentAny:["greet"],historyAny:["RETURN_GREETING"]},["EXPRESS_JOY"],"after_recent_greeting");
  add("R1070_HISTORY_AFTER_GOODBYE",540,{intentAny:["say_goodbye"],historyAny:["SAY_GOODBYE"]},["SAY_GOODBYE_TEMPORARY"],"after_recent_goodbye");
  add("R1071_HISTORY_UNKNOWN_REPEAT",610,{intentAny:["ask_question"],historyCountMin:{"ANSWER_UNKNOWN":2}},["ASK_FOR_DETAILS"],"repeated_unknown_answer");
  add("R1072_HISTORY_DETAILS_REPEAT",560,{intentAny:["report_event"],historyCountMin:{"ASK_FOR_DETAILS":2}},["ACKNOWLEDGE_EVENT"],"repeated_detail_questions");
  add("R1073_HISTORY_REPAIR_REPEAT",620,{intentAny:["apologize"],historyAny:["EXPRESS_REPAIR_DESIRE"]},["ASK_TO_REPAIR"],"continued_repair");
  add("R1074_HISTORY_BOUNDARY_REPEAT",995,{boundaryAny:["leave_me_alone","stop_conversation"],historyAny:["RESPECT_BOUNDARY"]},["RESPECT_BOUNDARY","ACCEPT_DISTANCE"],"repeated_distance_boundary");
  add("R1075_HISTORY_TOUCH_BOUNDARY_REPEAT",995,{boundaryAny:["do_not_touch"],historyAny:["PROMISE_NOT_TOUCH"]},["RESPECT_BOUNDARY","PROMISE_NOT_TOUCH"],"repeated_touch_boundary");
  add("R1076_HISTORY_CONTACT_BOUNDARY_REPEAT",995,{boundaryAny:["do_not_contact"],historyAny:["PROMISE_NOT_CONTACT"]},["RESPECT_BOUNDARY","PROMISE_NOT_CONTACT"],"repeated_contact_boundary");
  add("R1077_HISTORY_HELP_REPEAT",550,{intentAny:["ask_for_help"],historyAny:["OFFER_HELP"],relationshipMin:{goodwill:50}},["EXPRESS_CARE"],"repeated_help_request");
  add("R1078_HISTORY_MEET_REPEAT",550,{intentAny:["ask_to_meet"],historyAny:["AGREE_REQUEST"],relationshipMin:{familiarity:50}},["EXPRESS_JOY"],"repeated_meeting_request");
  add("R1079_HISTORY_LONELY_REPEAT",590,{intentAny:["express_loneliness"],historyAny:["OFFER_COMPANY"],boundaryNone:["leave_me_alone"]},["EXPRESS_CARE"],"continued_loneliness");
  add("R1080_HISTORY_HURT_REPEAT",620,{intentAny:["express_hurt"],historyAny:["EXPRESS_CONCERN"],relationshipMin:{goodwill:50}},["ASK_TO_REPAIR"],"continued_hurt");

  // Relationship stage / flags for future and character-specific state.
  add("R1081_STAGE_STRANGER_GREETING",550,{intentAny:["greet"],relationshipEq:{"stage":"stranger"}},["RETURN_GREETING"],"stranger_stage_greeting");
  add("R1082_STAGE_ACQUAINTANCE_GREETING",560,{intentAny:["greet"],relationshipEq:{"stage":"acquaintance"}},["EXPRESS_JOY"],"acquaintance_stage_greeting");
  add("R1083_STAGE_FRIEND_GREETING",570,{intentAny:["greet"],relationshipEq:{"stage":"friend"}},["EXPRESS_JOY","EXPRESS_CARE"],"friend_stage_greeting");
  add("R1084_STAGE_CLOSE_REPORT",580,{intentAny:["report_event"],relationshipEq:{"stage":"close"}},["EXPRESS_CARE"],"close_stage_report");
  add("R1085_STAGE_ROMANTIC_AFFECTION",620,{intentAny:["affirm_affection"],relationshipEq:{"stage":"romantic"}},["EXPRESS_CARE"],"romantic_stage_affection");
  add("R1086_STAGE_PARTNER_REASSURE",680,{intentAny:["request_reassurance","seek_reassurance"],relationshipEq:{"stage":"partner"}},["EXPRESS_CARE"],"partner_stage_reassurance");
  add("R1087_FLAG_CONFLICT",640,{focusAny:["relationship","apology"],relationshipFlagEq:{"conflict":true}},["EXPRESS_REPAIR_DESIRE"],"relationship_conflict_flag");
  add("R1088_FLAG_REPAIRED",560,{intentAny:["apologize","accept_apology"],relationshipFlagEq:{"repaired":true}},["EXPRESS_RELIEF"],"relationship_repaired_flag");
  add("R1089_FLAG_MET_BEFORE",530,{intentAny:["greet"],relationshipFlagEq:{"metBefore":true}},["EXPRESS_JOY"],"met_before_flag");
  add("R1090_FLAG_HELPED_BEFORE",560,{intentAny:["ask_for_help"],relationshipFlagEq:{"helpedBefore":true}},["OFFER_HELP"],"helped_before_flag");
  add("R1091_FLAG_SHARED_MEAL",530,{focusAny:["food"],relationshipFlagEq:{"sharedMeal":true}},["EXPRESS_APPROVAL"],"shared_meal_flag");
  add("R1092_FLAG_PROMISED_RETURN",600,{intentAny:["say_goodbye"],relationshipFlagEq:{"promisedReturn":true}},["PROMISE_RETURN"],"promised_return_flag");
  add("R1093_FLAG_TRUST_BROKEN",650,{focusAny:["trust","betrayal"],relationshipFlagEq:{"trustBroken":true}},["ASK_TO_REPAIR"],"trust_broken_flag");
  add("R1094_FLAG_EXCLUSIVE",640,{focusAny:["relationship","other_person"],relationshipFlagEq:{"exclusive":true}},["CONFIRM_CHOICE"],"exclusive_relationship_flag");
  R.push({
    id:"R1095_FLAG_DATING",
    priority:620,
    when:{intentAny:["ask_relationship_status"],relationshipFlagEq:{"dating":true}},
    meanings:["STATE_RELATIONSHIP_STATUS"],
    reason:"dating_flag",
    slots:{STATE_RELATIONSHIP_STATUS:{RELATIONSHIP:"dating"}}
  });
  add("R1096_FLAG_ROMANTIC",610,{intentAny:["affirm_affection"],relationshipFlagEq:{"romantic":true}},["EXPRESS_CARE"],"romantic_flag");
  add("R1097_FLAG_DISTANCE_REQUESTED",990,{relationshipFlagEq:{"distanceRequested":true},intentAny:["ask_to_meet","request_contact"]},["ACCEPT_DISTANCE"],"distance_requested_flag");
  add("R1098_FLAG_NO_CONTACT",995,{relationshipFlagEq:{"noContact":true},intentAny:["request_contact"]},["DECLINE_CONTACT","RESPECT_BOUNDARY"],"no_contact_flag");
  add("R1099_FLAG_RECONCILING",630,{focusAny:["relationship","apology"],relationshipFlagEq:{"reconciling":true}},["EXPRESS_REPAIR_DESIRE"],"reconciling_flag");
  add("R1100_FLAG_STABLE",580,{focusAny:["relationship"],relationshipFlagEq:{"stable":true},emotionMin:{relief:40}},["EXPRESS_RELIEF"],"stable_relationship_flag");

  if (R.length !== 100) throw new Error("Expected 100 response rules, got " + R.length);
  HMW.Dialogue.registerResponseRules(R);
})();