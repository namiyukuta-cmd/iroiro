(() => {
  "use strict";
  window.HMW = window.HMW || {};
  HMW.Dialogue = HMW.Dialogue || {};

  const R = [];
  const add = (id, priority, when, meanings, reason=id) =>
    R.push({ id, priority, when, meanings, reason });

  // Relationship-stage-specific behavior.
  add("R1101_STAGE_STRANGER_QUESTION",560,{intentAny:["ask_question"],relationshipEq:{"stage":"stranger"}},["EXPRESS_NEED_CLARITY"],"stranger_question");
  add("R1102_STAGE_STRANGER_HELP",550,{intentAny:["ask_for_help"],relationshipEq:{"stage":"stranger"}},["OFFER_HELP"],"stranger_help");
  add("R1103_STAGE_STRANGER_PERSONAL",610,{focusAny:["love","relationship","trust"],relationshipEq:{"stage":"stranger"}},["EXPRESS_NEED_CLARITY"],"stranger_personal_topic");
  add("R1104_STAGE_ACQUAINTANCE_HELP",560,{intentAny:["ask_for_help"],relationshipEq:{"stage":"acquaintance"}},["OFFER_HELP"],"acquaintance_help");
  add("R1105_STAGE_ACQUAINTANCE_REPORT",540,{intentAny:["report_event"],relationshipEq:{"stage":"acquaintance"}},["ACKNOWLEDGE_EVENT"],"acquaintance_report");
  add("R1106_STAGE_ACQUAINTANCE_REASSURE",580,{intentAny:["request_reassurance","seek_reassurance"],relationshipEq:{"stage":"acquaintance"}},["EXPRESS_CARE"],"acquaintance_reassurance");
  add("R1107_STAGE_FRIEND_HELP",580,{intentAny:["ask_for_help"],relationshipEq:{"stage":"friend"}},["OFFER_HELP"],"friend_help");
  add("R1108_STAGE_FRIEND_HURT",610,{intentAny:["express_hurt"],relationshipEq:{"stage":"friend"}},["EXPRESS_CONCERN"],"friend_hurt");
  add("R1109_STAGE_FRIEND_GOODBYE",560,{intentAny:["say_goodbye"],relationshipEq:{"stage":"friend"}},["SAY_GOODBYE_TEMPORARY"],"friend_goodbye");
  add("R1110_STAGE_CLOSE_REASSURE",640,{intentAny:["request_reassurance","seek_reassurance"],relationshipEq:{"stage":"close"}},["EXPRESS_CARE"],"close_reassurance");
  add("R1111_STAGE_CLOSE_HURT",630,{intentAny:["express_hurt"],relationshipEq:{"stage":"close"}},["ASK_TO_REPAIR"],"close_hurt");
  add("R1112_STAGE_CLOSE_ANGER",620,{intentAny:["express_anger"],relationshipEq:{"stage":"close"}},["ASK_TO_TALK"],"close_anger");
  add("R1113_STAGE_ROMANTIC_REASSURE",690,{intentAny:["request_reassurance","seek_reassurance"],relationshipEq:{"stage":"romantic"}},["EXPRESS_CARE"],"romantic_reassurance");
  add("R1114_STAGE_ROMANTIC_AFFECTION_Q",720,{intentAny:["question_affection"],relationshipEq:{"stage":"romantic"}},["ASK_AFFECTION_REASON"],"romantic_affection_question");
  add("R1115_STAGE_ROMANTIC_GOODBYE",590,{intentAny:["say_goodbye"],relationshipEq:{"stage":"romantic"}},["EXPRESS_MISSING"],"romantic_goodbye");
  add("R1116_STAGE_PARTNER_REASSURE",730,{intentAny:["request_reassurance","seek_reassurance"],relationshipEq:{"stage":"partner"}},["EXPRESS_CARE"],"partner_reassurance");
  add("R1117_STAGE_PARTNER_HURT",660,{intentAny:["express_hurt"],relationshipEq:{"stage":"partner"}},["ASK_TO_REPAIR"],"partner_hurt");
  add("R1118_STAGE_PARTNER_ANGER",650,{intentAny:["express_anger"],relationshipEq:{"stage":"partner"}},["ASK_TO_TALK"],"partner_anger");
  add("R1119_STAGE_PARTNER_GOODBYE",610,{intentAny:["say_goodbye"],relationshipEq:{"stage":"partner"}},["EXPRESS_MISSING"],"partner_goodbye");
  add("R1120_STAGE_PARTNER_REPORT",580,{intentAny:["report_event"],relationshipEq:{"stage":"partner"}},["EXPRESS_CARE"],"partner_report");

  // Relationship numeric combinations.
  add("R1121_LOW_FAM_LOW_TRUST",610,{intentAny:["ask_question"],relationshipMax:{familiarity:25,trust:25}},["EXPRESS_NEED_CLARITY"],"low_familiarity_low_trust");
  add("R1122_LOW_FAM_HIGH_GOODWILL",560,{intentAny:["greet"],relationshipMax:{familiarity:25},relationshipMin:{goodwill:65}},["EXPRESS_JOY"],"low_familiarity_high_goodwill");
  add("R1123_HIGH_FAM_LOW_TRUST",620,{focusAny:["relationship","trust"],relationshipMin:{familiarity:70},relationshipMax:{trust:30}},["ASK_FOR_TRUST"],"high_familiarity_low_trust");
  add("R1124_HIGH_FAM_HIGH_TRUST",630,{focusAny:["relationship"],relationshipMin:{familiarity:70,trust:70}},["EXPRESS_CARE"],"high_familiarity_high_trust");
  add("R1125_HIGH_GOODWILL_LOW_TRUST",620,{intentAny:["request_reassurance","seek_reassurance"],relationshipMin:{goodwill:70},relationshipMax:{trust:30}},["ASK_FOR_TRUST"],"high_goodwill_low_trust");
  add("R1126_HIGH_GOODWILL_HIGH_TRUST",680,{intentAny:["request_reassurance","seek_reassurance"],relationshipMin:{goodwill:70,trust:70}},["EXPRESS_CARE","CONFIRM_TRUST"],"high_goodwill_high_trust");
  add("R1127_HIGH_DESIRE_LOW_CONSCIENCE",580,{focusAny:["love","relationship"],relationshipMin:{desire:75},relationshipMax:{conscience:25}},["EXPRESS_UNCERTAINTY"],"high_desire_low_conscience");
  add("R1128_HIGH_DESIRE_HIGH_CONSCIENCE",630,{focusAny:["love","relationship"],relationshipMin:{desire:75,conscience:70}},["EXPRESS_CARE"],"high_desire_high_conscience");
  add("R1129_HIGH_MALICE_LOW_TRUST",630,{claimTypeAny:["accusation"],relationshipMin:{malice:70},relationshipMax:{trust:30}},["REQUEST_TIME"],"high_malice_low_trust");
  add("R1130_HIGH_MALICE_HIGH_TRUST",590,{claimTypeAny:["accusation"],relationshipMin:{malice:70,trust:70}},["EXPRESS_NEED_CLARITY"],"high_malice_high_trust");
  add("R1131_HIGH_CONSCIENCE_LOW_MALICE",640,{intentAny:["apologize"],relationshipMin:{conscience:70},relationshipMax:{malice:20}},["EXPRESS_REPAIR_DESIRE"],"high_conscience_low_malice");
  add("R1132_LOW_CONSCIENCE_HIGH_MALICE",610,{intentAny:["apologize"],relationshipMax:{conscience:25},relationshipMin:{malice:70}},["REQUEST_TIME"],"low_conscience_high_malice");
  add("R1133_HIGH_TRUST_HIGH_GOODWILL_HURT",660,{intentAny:["express_hurt"],relationshipMin:{trust:70,goodwill:70}},["ASK_TO_REPAIR"],"trusted_goodwill_hurt");
  add("R1134_HIGH_TRUST_HIGH_GOODWILL_ANGER",640,{intentAny:["express_anger"],relationshipMin:{trust:70,goodwill:70}},["ASK_TO_TALK"],"trusted_goodwill_anger");
  add("R1135_HIGH_TRUST_HIGH_GOODWILL_GOODBYE",590,{intentAny:["say_goodbye"],relationshipMin:{trust:70,goodwill:70}},["SAY_GOODBYE_TEMPORARY"],"trusted_goodwill_goodbye");
  add("R1136_LOW_GOODWILL_HIGH_MALICE",630,{focusAny:["relationship"],relationshipMax:{goodwill:25},relationshipMin:{malice:70}},["EXPRESS_NEED_CLARITY"],"low_goodwill_high_malice");
  add("R1137_HIGH_GOODWILL_HIGH_CONSCIENCE",620,{intentAny:["express_hurt"],relationshipMin:{goodwill:70,conscience:70}},["EXPRESS_CONCERN"],"goodwill_conscience_hurt");
  add("R1138_HIGH_FAM_HIGH_GOODWILL_REPORT",570,{intentAny:["report_event"],relationshipMin:{familiarity:70,goodwill:70}},["ACKNOWLEDGE_EVENT","EXPRESS_CARE"],"familiar_goodwill_report");
  add("R1139_HIGH_FAM_HIGH_GOODWILL_LONELY",610,{intentAny:["express_loneliness"],relationshipMin:{familiarity:70,goodwill:70},boundaryNone:["leave_me_alone"]},["OFFER_COMPANY"],"familiar_goodwill_loneliness");
  add("R1140_HIGH_TRUST_HIGH_CONSCIENCE_REPAIR",660,{focusAny:["apology","relationship"],relationshipMin:{trust:70,conscience:70}},["ASK_TO_REPAIR"],"trust_conscience_repair");

  // Last-response-sensitive continuity.
  add("R1141_LAST_AFFIRM_LOVE",650,{intentAny:["question_affection"],historyLastAny:["AFFIRM_LOVE"]},["EXPRESS_CARE"],"last_was_love_confirmation");
  add("R1142_LAST_DENY_LOVE",650,{intentAny:["question_affection"],historyLastAny:["DENY_LOVE"]},["ASK_AFFECTION_REASON"],"last_was_love_denial");
  add("R1143_LAST_CONFIRM_TRUST",640,{focusAny:["trust"],historyLastAny:["CONFIRM_TRUST"]},["EXPRESS_CARE"],"last_was_trust_confirmation");
  add("R1144_LAST_DENY_BETRAYAL",660,{focusAny:["betrayal"],historyLastAny:["DENY_BETRAYAL"],factEq:{"loyalToHeroine":true}},["PROMISE_LOYALTY"],"last_was_betrayal_denial");
  add("R1145_LAST_ADMIT_BETRAYAL",680,{focusAny:["betrayal","relationship"],historyLastAny:["ADMIT_BETRAYAL"]},["ASK_TO_REPAIR"],"last_was_betrayal_admission");
  add("R1146_LAST_REASSURE_NOT_LEAVING",650,{intentAny:["request_reassurance","seek_reassurance"],historyLastAny:["REASSURE_NOT_LEAVING"]},["EXPRESS_CARE"],"last_was_not_leaving_reassurance");
  add("R1147_LAST_CONFIRM_CHOICE",640,{intentAny:["request_reassurance","seek_reassurance"],historyLastAny:["CONFIRM_CHOICE"]},["EXPRESS_CARE"],"last_was_choice_confirmation");
  add("R1148_LAST_EXPRESS_CONCERN",590,{intentAny:["report_condition","express_hurt","express_fear"],historyLastAny:["EXPRESS_CONCERN"]},["ASK_IF_OKAY"],"last_was_concern");
  add("R1149_LAST_EXPRESS_SYMPATHY",570,{intentAny:["report_event"],historyLastAny:["EXPRESS_SYMPATHY"]},["ACKNOWLEDGE_EVENT"],"last_was_sympathy");
  add("R1150_LAST_ASK_IF_OKAY",600,{intentAny:["report_condition"],historyLastAny:["ASK_IF_OKAY"],toneMin:{hesitation:50}},["EXPRESS_CONCERN"],"last_was_ask_if_okay");
  add("R1151_LAST_ASK_DETAILS",560,{intentAny:["report_event"],historyLastAny:["ASK_FOR_DETAILS"]},["ACKNOWLEDGE_EVENT"],"last_was_ask_details");
  add("R1152_LAST_RETURN_GREETING",510,{intentAny:["greet"],historyLastAny:["RETURN_GREETING"]},["EXPRESS_JOY"],"last_was_return_greeting");
  add("R1153_LAST_SAY_GOODBYE",530,{intentAny:["say_goodbye"],historyLastAny:["SAY_GOODBYE"]},["SAY_GOODBYE_TEMPORARY"],"last_was_goodbye");
  add("R1154_LAST_OFFER_HELP",550,{intentAny:["ask_for_help"],historyLastAny:["OFFER_HELP"]},["EXPRESS_CARE"],"last_was_offer_help");
  add("R1155_LAST_OFFER_COMPANY",560,{intentAny:["express_loneliness"],historyLastAny:["OFFER_COMPANY"],boundaryNone:["leave_me_alone"]},["EXPRESS_CARE"],"last_was_offer_company");
  add("R1156_LAST_ACCEPT_DISTANCE",990,{intentAny:["request_distance"],historyLastAny:["ACCEPT_DISTANCE"]},["RESPECT_BOUNDARY"],"last_was_accept_distance");
  add("R1157_LAST_REPAIR_DESIRE",620,{intentAny:["apologize","express_hurt"],historyLastAny:["EXPRESS_REPAIR_DESIRE"]},["ASK_TO_REPAIR"],"last_was_repair_desire");
  add("R1158_LAST_REQUEST_TIME",600,{intentAny:["express_anger","apologize"],historyLastAny:["REQUEST_TIME"]},["EXPRESS_NEED_CLARITY"],"last_was_request_time");
  add("R1159_LAST_EXPRESS_RELIEF",520,{intentAny:["agree","accept_apology"],historyLastAny:["EXPRESS_RELIEF"]},["EXPRESS_JOY"],"last_was_relief");
  add("R1160_LAST_EXPRESS_JOY",510,{intentAny:["greet","report_event"],historyLastAny:["EXPRESS_JOY"]},["EXPRESS_CARE"],"last_was_joy");

  // Recent-window / repeated-topic handling.
  add("R1161_RECENT_LOVE_CONFIRM",640,{intentAny:["question_affection"],historyRecentAny:["AFFIRM_LOVE"],historyRecentWindow:3},["EXPRESS_CARE"],"recent_love_confirmation");
  add("R1162_RECENT_TRUST_CONFIRM",630,{focusAny:["trust"],historyRecentAny:["CONFIRM_TRUST"],historyRecentWindow:3},["EXPRESS_CARE"],"recent_trust_confirmation");
  add("R1163_RECENT_BETRAYAL_DENIAL",650,{focusAny:["betrayal"],historyRecentAny:["DENY_BETRAYAL"],historyRecentWindow:3},["PROMISE_LOYALTY"],"recent_betrayal_denial");
  add("R1164_RECENT_NOT_LEAVING",640,{focusAny:["abandonment"],historyRecentAny:["REASSURE_NOT_LEAVING"],historyRecentWindow:3},["EXPRESS_CARE"],"recent_not_leaving");
  add("R1165_RECENT_REPAIR",610,{focusAny:["apology","relationship"],historyRecentAny:["EXPRESS_REPAIR_DESIRE","ASK_TO_REPAIR"],historyRecentWindow:4},["EXPRESS_CARE"],"recent_repair_discussion");
  add("R1166_RECENT_CONCERN",580,{intentAny:["report_condition"],historyRecentAny:["EXPRESS_CONCERN"],historyRecentWindow:3},["ASK_IF_OKAY"],"recent_concern");
  add("R1167_RECENT_SYMPATHY",560,{intentAny:["report_event"],historyRecentAny:["EXPRESS_SYMPATHY"],historyRecentWindow:3},["ACKNOWLEDGE_EVENT"],"recent_sympathy");
  add("R1168_RECENT_HELP",540,{intentAny:["ask_for_help"],historyRecentAny:["OFFER_HELP"],historyRecentWindow:3},["EXPRESS_CARE"],"recent_help");
  add("R1169_RECENT_COMPANY",550,{intentAny:["express_loneliness"],historyRecentAny:["OFFER_COMPANY"],historyRecentWindow:3,boundaryNone:["leave_me_alone"]},["EXPRESS_CARE"],"recent_company_offer");
  add("R1170_RECENT_GOODBYE",520,{intentAny:["say_goodbye"],historyRecentAny:["SAY_GOODBYE","SAY_GOODBYE_TEMPORARY"],historyRecentWindow:3},["EXPRESS_MISSING"],"recent_goodbye");
  add("R1171_REPEAT_UNKNOWN_3",620,{intentAny:["ask_question"],historyCountMin:{"ANSWER_UNKNOWN":3}},["ASK_FOR_DETAILS"],"unknown_answer_repeated_three");
  add("R1172_REPEAT_CONCERN_3",590,{intentAny:["report_condition"],historyCountMin:{"EXPRESS_CONCERN":3}},["ASK_IF_OKAY"],"concern_repeated_three");
  add("R1173_REPEAT_DETAILS_3",560,{intentAny:["report_event"],historyCountMin:{"ASK_FOR_DETAILS":3}},["ACKNOWLEDGE_EVENT"],"details_repeated_three");
  add("R1174_REPEAT_LOVE_2",650,{intentAny:["question_affection"],historyCountMin:{"AFFIRM_LOVE":2}},["EXPRESS_CARE"],"love_confirmation_repeated");
  add("R1175_REPEAT_TRUST_2",640,{focusAny:["trust"],historyCountMin:{"CONFIRM_TRUST":2}},["EXPRESS_CARE"],"trust_confirmation_repeated");
  add("R1176_REPEAT_BETRAYAL_2",650,{focusAny:["betrayal"],historyCountMin:{"DENY_BETRAYAL":2}},["PROMISE_LOYALTY"],"betrayal_denial_repeated");
  add("R1177_REPEAT_BOUNDARY_2",995,{boundaryAny:["leave_me_alone","stop_conversation"],historyCountMin:{"RESPECT_BOUNDARY":2}},["RESPECT_BOUNDARY","ACCEPT_DISTANCE"],"boundary_repeated_twice");
  add("R1178_REPEAT_TOUCH_BOUNDARY_2",995,{boundaryAny:["do_not_touch"],historyCountMin:{"PROMISE_NOT_TOUCH":2}},["RESPECT_BOUNDARY","PROMISE_NOT_TOUCH"],"touch_boundary_repeated_twice");
  add("R1179_REPEAT_CONTACT_BOUNDARY_2",995,{boundaryAny:["do_not_contact"],historyCountMin:{"PROMISE_NOT_CONTACT":2}},["RESPECT_BOUNDARY","PROMISE_NOT_CONTACT"],"contact_boundary_repeated_twice");
  add("R1180_REPEAT_APOLOGY_2",620,{intentAny:["apologize"],historyCountMin:{"EXPRESS_REPAIR_DESIRE":2}},["ASK_TO_REPAIR"],"apology_repair_repeated");

  // Policy + relationship + boundary exceptions.
  add("R1181_HELP_POLICY_LOW_GOODWILL",600,{intentAny:["ask_for_help"],policyEq:{"willingToHelp":false},relationshipMax:{goodwill:30}},["DECLINE_REQUEST"],"help_policy_low_goodwill");
  add("R1182_HELP_POLICY_HIGH_GOODWILL",610,{intentAny:["ask_for_help"],policyEq:{"willingToHelp":true},relationshipMin:{goodwill:70}},["OFFER_HELP"],"help_policy_high_goodwill");
  add("R1183_MEET_POLICY_LOW_TRUST",600,{intentAny:["ask_to_meet"],policyEq:{"willingToMeet":false},relationshipMax:{trust:30}},["DECLINE_REQUEST"],"meet_policy_low_trust");
  add("R1184_MEET_POLICY_HIGH_TRUST",620,{intentAny:["ask_to_meet"],policyEq:{"willingToMeet":true},relationshipMin:{trust:70},boundaryNone:["do_not_visit","leave_me_alone"]},["AGREE_REQUEST"],"meet_policy_high_trust");
  add("R1185_TALK_POLICY_CONFLICT",650,{intentAny:["ask_to_talk"],policyEq:{"willingToTalk":true},relationshipFlagEq:{"conflict":true},boundaryNone:["stop_conversation"]},["AGREE_REQUEST","ASK_TO_REPAIR"],"talk_policy_conflict");
  add("R1186_TALK_POLICY_DENY",650,{intentAny:["ask_to_talk"],policyEq:{"willingToTalk":false}},["DECLINE_REQUEST"],"talk_policy_denied");
  add("R1187_CONTACT_POLICY_HIGH_TRUST",620,{intentAny:["request_contact"],policyEq:{"allowContact":true},relationshipMin:{trust:70},boundaryNone:["do_not_contact","do_not_call","do_not_message"]},["ACCEPT_CONTACT"],"contact_policy_high_trust");
  add("R1188_CONTACT_POLICY_NO_CONTACT_FLAG",995,{intentAny:["request_contact"],relationshipFlagEq:{"noContact":true}},["DECLINE_CONTACT","RESPECT_BOUNDARY"],"contact_blocked_by_flag");
  add("R1189_STAY_POLICY_HIGH_GOODWILL",620,{intentAny:["request_stay"],policyEq:{"willingToStay":true},relationshipMin:{goodwill:70},boundaryNone:["leave_me_alone"]},["AGREE_REQUEST"],"stay_policy_high_goodwill");
  add("R1190_STAY_POLICY_DISTANCE_FLAG",990,{intentAny:["request_stay"],relationshipFlagEq:{"distanceRequested":true}},["DECLINE_REQUEST","ACCEPT_DISTANCE"],"stay_blocked_by_distance_flag");
  add("R1191_APOLOGY_ACCEPT_HIGH_TRUST",680,{intentAny:["apologize"],policyEq:{"acceptApology":true},relationshipMin:{trust:70}},["ACCEPT_APOLOGY","EXPRESS_RELIEF"],"apology_accept_high_trust");
  add("R1192_APOLOGY_DECLINE_CONFLICT",690,{intentAny:["apologize"],policyEq:{"acceptApology":false},relationshipFlagEq:{"conflict":true}},["DECLINE_FOR_NOW","REQUEST_TIME"],"apology_decline_conflict");
  add("R1193_FOOD_OFFER_HIGH_GOODWILL",580,{intentAny:["report_condition"],focusAny:["food","hunger"],policyEq:{"canOfferFood":true},relationshipMin:{goodwill:60}},["OFFER_FOOD"],"food_offer_high_goodwill");
  add("R1194_WATER_OFFER_HIGH_GOODWILL",580,{intentAny:["report_condition"],focusAny:["water","thirst"],policyEq:{"canOfferWater":true},relationshipMin:{goodwill:60}},["OFFER_DRINK"],"water_offer_high_goodwill");
  add("R1195_OTHER_PERSON_POLICY_OFF",570,{focusAny:["other_person"],policyEq:{"askAboutOtherPerson":false}},["EXPRESS_NEED_CLARITY"],"other_person_policy_off");
  add("R1196_OTHER_PERSON_POLICY_ON",590,{focusAny:["other_person"],policyEq:{"askAboutOtherPerson":true},relationshipMin:{trust:40}},["ASK_ABOUT_OTHER_PERSON"],"other_person_policy_on");
  add("R1197_BOUNDARY_TRUST_HIGH",995,{boundaryAny:["leave_me_alone","do_not_contact","stop_conversation"],relationshipMin:{trust:80}},["RESPECT_BOUNDARY"],"boundary_overrides_high_trust");
  add("R1198_BOUNDARY_GOODWILL_HIGH",995,{boundaryAny:["do_not_touch","do_not_kiss","do_not_hug"],relationshipMin:{goodwill:80}},["RESPECT_BOUNDARY"],"boundary_overrides_high_goodwill");
  add("R1199_BOUNDARY_DESIRE_HIGH",995,{boundaryAny:["do_not_touch","do_not_kiss","do_not_hug"],relationshipMin:{desire:80}},["RESPECT_BOUNDARY"],"boundary_overrides_high_desire");
  add("R1200_BOUNDARY_PARTNER_STAGE",999,{boundaryAny:["leave_me_alone","do_not_contact","stop_conversation","do_not_touch"],relationshipEq:{"stage":"partner"}},["RESPECT_BOUNDARY"],"boundary_overrides_partner_stage");

  if (R.length !== 100) throw new Error("Expected 100 response rules, got " + R.length);
  HMW.Dialogue.registerResponseRules(R);
})();