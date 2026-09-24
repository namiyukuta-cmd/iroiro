(() => {
  "use strict";
  window.HMW = window.HMW || {};
  HMW.Dialogue = HMW.Dialogue || {};

  const R = [];
  const add = (id, priority, when, meanings, reason=id) =>
    R.push({ id, priority, when, meanings, reason });

  // Stage-specific requests, reassurance, conflict and boundaries.
  add("R1201_STRANGER_MEET",560,{intentAny:["ask_to_meet"],relationshipEq:{"stage":"stranger"}},["EXPRESS_NEED_CLARITY"],"stranger_meeting_request");
  add("R1202_STRANGER_CONTACT",570,{intentAny:["request_contact"],relationshipEq:{"stage":"stranger"}},["EXPRESS_NEED_CLARITY"],"stranger_contact_request");
  add("R1203_STRANGER_AFFECTION",610,{intentAny:["affirm_affection","question_affection"],relationshipEq:{"stage":"stranger"}},["EXPRESS_NEED_CLARITY"],"stranger_affection_topic");
  add("R1204_ACQUAINTANCE_MEET",570,{intentAny:["ask_to_meet"],relationshipEq:{"stage":"acquaintance"}},["AGREE_REQUEST"],"acquaintance_meeting_request");
  add("R1205_ACQUAINTANCE_CONTACT",570,{intentAny:["request_contact"],relationshipEq:{"stage":"acquaintance"}},["ACCEPT_CONTACT"],"acquaintance_contact_request");
  add("R1206_FRIEND_REASSURE",620,{intentAny:["request_reassurance","seek_reassurance"],relationshipEq:{"stage":"friend"}},["EXPRESS_CARE"],"friend_reassurance");
  add("R1207_FRIEND_CONFLICT",620,{focusAny:["relationship","apology"],relationshipEq:{"stage":"friend"},relationshipFlagEq:{"conflict":true}},["ASK_TO_REPAIR"],"friend_conflict");
  add("R1208_CLOSE_CONTACT",600,{intentAny:["request_contact"],relationshipEq:{"stage":"close"},boundaryNone:["do_not_contact"]},["ACCEPT_CONTACT"],"close_contact_request");
  add("R1209_CLOSE_DISTANCE",700,{intentAny:["request_distance"],relationshipEq:{"stage":"close"}},["ACCEPT_DISTANCE"],"close_distance_request");
  add("R1210_ROMANTIC_CONTACT",620,{intentAny:["request_contact"],relationshipEq:{"stage":"romantic"},boundaryNone:["do_not_contact"]},["ACCEPT_CONTACT"],"romantic_contact_request");
  add("R1211_ROMANTIC_DISTANCE",710,{intentAny:["request_distance"],relationshipEq:{"stage":"romantic"}},["ACCEPT_DISTANCE","EXPRESS_CARE"],"romantic_distance_request");
  add("R1212_ROMANTIC_CONFLICT",650,{focusAny:["relationship","apology"],relationshipEq:{"stage":"romantic"},relationshipFlagEq:{"conflict":true}},["ASK_TO_REPAIR"],"romantic_conflict");
  add("R1213_PARTNER_CONTACT",630,{intentAny:["request_contact"],relationshipEq:{"stage":"partner"},boundaryNone:["do_not_contact"]},["ACCEPT_CONTACT"],"partner_contact_request");
  add("R1214_PARTNER_DISTANCE",720,{intentAny:["request_distance"],relationshipEq:{"stage":"partner"}},["ACCEPT_DISTANCE","EXPRESS_CARE"],"partner_distance_request");
  add("R1215_PARTNER_CONFLICT",670,{focusAny:["relationship","apology"],relationshipEq:{"stage":"partner"},relationshipFlagEq:{"conflict":true}},["ASK_TO_REPAIR"],"partner_conflict");
  add("R1216_PARTNER_TRUST_BROKEN",680,{focusAny:["trust","betrayal"],relationshipEq:{"stage":"partner"},relationshipFlagEq:{"trustBroken":true}},["ASK_TO_REPAIR"],"partner_trust_broken");
  add("R1217_STAGE_BOUNDARY_STRANGER",990,{relationshipEq:{"stage":"stranger"},boundaryAny:["do_not_touch","do_not_contact","stop_conversation"]},["RESPECT_BOUNDARY"],"stranger_boundary");
  add("R1218_STAGE_BOUNDARY_CLOSE",995,{relationshipEq:{"stage":"close"},boundaryAny:["do_not_touch","do_not_contact","stop_conversation"]},["RESPECT_BOUNDARY"],"close_boundary");
  add("R1219_STAGE_BOUNDARY_ROMANTIC",995,{relationshipEq:{"stage":"romantic"},boundaryAny:["do_not_touch","do_not_contact","stop_conversation"]},["RESPECT_BOUNDARY"],"romantic_boundary");
  add("R1220_STAGE_BOUNDARY_PARTNER",999,{relationshipEq:{"stage":"partner"},boundaryAny:["do_not_touch","do_not_contact","stop_conversation"]},["RESPECT_BOUNDARY"],"partner_boundary");

  // Flags and relationship exceptions.
  add("R1221_FLAG_CONFLICT_HURT",660,{intentAny:["express_hurt"],relationshipFlagEq:{"conflict":true}},["ASK_TO_REPAIR"],"conflict_flag_hurt");
  add("R1222_FLAG_CONFLICT_ANGER",650,{intentAny:["express_anger"],relationshipFlagEq:{"conflict":true}},["REQUEST_TIME"],"conflict_flag_anger");
  add("R1223_FLAG_CONFLICT_APOLOGY",670,{intentAny:["apologize"],relationshipFlagEq:{"conflict":true}},["EXPRESS_REPAIR_DESIRE"],"conflict_flag_apology");
  add("R1224_FLAG_REPAIRED_GREETING",550,{intentAny:["greet"],relationshipFlagEq:{"repaired":true}},["EXPRESS_RELIEF"],"repaired_flag_greeting");
  add("R1225_FLAG_REPAIRED_RELATIONSHIP",560,{focusAny:["relationship"],relationshipFlagEq:{"repaired":true}},["EXPRESS_RELIEF"],"repaired_flag_relationship");
  add("R1226_FLAG_RECONCILING_HURT",640,{intentAny:["express_hurt"],relationshipFlagEq:{"reconciling":true}},["ASK_TO_REPAIR"],"reconciling_hurt");
  add("R1227_FLAG_RECONCILING_APOLOGY",650,{intentAny:["apologize"],relationshipFlagEq:{"reconciling":true}},["EXPRESS_REPAIR_DESIRE"],"reconciling_apology");
  add("R1228_FLAG_STABLE_REASSURE",630,{intentAny:["request_reassurance","seek_reassurance"],relationshipFlagEq:{"stable":true}},["EXPRESS_CARE"],"stable_relationship_reassurance");
  add("R1229_FLAG_STABLE_CONFLICT",610,{focusAny:["relationship"],relationshipFlagEq:{"stable":true},emotionMin:{hurt:45}},["ASK_TO_TALK"],"stable_relationship_hurt");
  add("R1230_FLAG_EXCLUSIVE_REASSURE",650,{intentAny:["request_reassurance","seek_reassurance"],relationshipFlagEq:{"exclusive":true}},["CONFIRM_CHOICE"],"exclusive_reassurance");
  add("R1231_FLAG_EXCLUSIVE_OTHER_PERSON",650,{focusAny:["other_person"],relationshipFlagEq:{"exclusive":true}},["CONFIRM_CHOICE"],"exclusive_other_person");
  add("R1232_FLAG_DATING_AFFECTION",620,{intentAny:["affirm_affection"],relationshipFlagEq:{"dating":true}},["EXPRESS_CARE"],"dating_affection");
  add("R1233_FLAG_DATING_GOODBYE",580,{intentAny:["say_goodbye"],relationshipFlagEq:{"dating":true}},["EXPRESS_MISSING"],"dating_goodbye");
  add("R1234_FLAG_ROMANTIC_REASSURE",640,{intentAny:["request_reassurance","seek_reassurance"],relationshipFlagEq:{"romantic":true}},["EXPRESS_CARE"],"romantic_flag_reassurance");
  add("R1235_FLAG_ROMANTIC_AFFECTION",620,{intentAny:["affirm_affection"],relationshipFlagEq:{"romantic":true}},["EXPRESS_CARE"],"romantic_flag_affection");
  add("R1236_FLAG_TRUST_BROKEN_REASSURE",670,{intentAny:["request_reassurance","seek_reassurance"],relationshipFlagEq:{"trustBroken":true}},["ASK_TO_REPAIR"],"trust_broken_reassurance");
  add("R1237_FLAG_TRUST_BROKEN_ACCUSATION",680,{claimTypeAny:["accusation"],relationshipFlagEq:{"trustBroken":true}},["ASK_FOR_HONEST_ANSWER"],"trust_broken_accusation");
  add("R1238_FLAG_DISTANCE_REQUESTED_MEET",995,{intentAny:["ask_to_meet"],relationshipFlagEq:{"distanceRequested":true}},["DECLINE_REQUEST","ACCEPT_DISTANCE"],"distance_requested_meeting");
  add("R1239_FLAG_DISTANCE_REQUESTED_CONTACT",995,{intentAny:["request_contact"],relationshipFlagEq:{"distanceRequested":true}},["DECLINE_CONTACT","ACCEPT_DISTANCE"],"distance_requested_contact");
  add("R1240_FLAG_NO_CONTACT_OFFER",995,{intentAny:["offer_contact"],relationshipFlagEq:{"noContact":true}},["RESPECT_BOUNDARY"],"no_contact_offer");

  // Last-turn and short-sequence continuation.
  add("R1241_SUFFIX_LOVE_CARE",640,{intentAny:["question_affection"],historySuffix:["AFFIRM_LOVE","EXPRESS_CARE"]},["EXPRESS_CARE"],"love_then_care_sequence");
  add("R1242_SUFFIX_LOVE_CHOICE",650,{intentAny:["question_affection"],historySuffix:["AFFIRM_LOVE","CONFIRM_CHOICE"]},["EXPRESS_CARE"],"love_then_choice_sequence");
  add("R1243_SUFFIX_TRUST_CARE",630,{focusAny:["trust"],historySuffix:["CONFIRM_TRUST","EXPRESS_CARE"]},["EXPRESS_CARE"],"trust_then_care_sequence");
  add("R1244_SUFFIX_BETRAYAL_LOYALTY",660,{focusAny:["betrayal"],historySuffix:["DENY_BETRAYAL","PROMISE_LOYALTY"]},["EXPRESS_CARE"],"betrayal_then_loyalty_sequence");
  add("R1245_SUFFIX_CONCERN_OKAY",610,{intentAny:["report_condition"],historySuffix:["EXPRESS_CONCERN","ASK_IF_OKAY"]},["EXPRESS_CARE"],"concern_then_check_sequence");
  add("R1246_SUFFIX_SYMPATHY_EVENT",570,{intentAny:["report_event"],historySuffix:["EXPRESS_SYMPATHY","ACKNOWLEDGE_EVENT"]},["EXPRESS_CARE"],"sympathy_then_ack_sequence");
  add("R1247_SUFFIX_REPAIR_TALK",630,{focusAny:["relationship","apology"],historySuffix:["EXPRESS_REPAIR_DESIRE","ASK_TO_TALK"]},["ASK_TO_REPAIR"],"repair_then_talk_sequence");
  add("R1248_SUFFIX_DISTANCE_BOUNDARY",995,{boundaryAny:["leave_me_alone","stop_conversation"],historySuffix:["ACCEPT_DISTANCE","RESPECT_BOUNDARY"]},["RESPECT_BOUNDARY"],"distance_boundary_sequence");
  add("R1249_SUFFIX_GOODBYE_MISSING",550,{intentAny:["say_goodbye"],historySuffix:["SAY_GOODBYE_TEMPORARY","EXPRESS_MISSING"]},["EXPRESS_CARE"],"goodbye_missing_sequence");
  add("R1250_SUFFIX_HELP_CARE",550,{intentAny:["ask_for_help"],historySuffix:["OFFER_HELP","EXPRESS_CARE"]},["OFFER_HELP"],"help_care_sequence");
  add("R1251_RECENT_LOVE_COUNT",640,{intentAny:["question_affection"],historyRecentCountMin:{"AFFIRM_LOVE":2},historyRecentWindow:5},["EXPRESS_CARE"],"recent_love_count");
  add("R1252_RECENT_TRUST_COUNT",630,{focusAny:["trust"],historyRecentCountMin:{"CONFIRM_TRUST":2},historyRecentWindow:5},["EXPRESS_CARE"],"recent_trust_count");
  add("R1253_RECENT_UNKNOWN_COUNT",620,{intentAny:["ask_question"],historyRecentCountMin:{"ANSWER_UNKNOWN":2},historyRecentWindow:4},["ASK_FOR_DETAILS"],"recent_unknown_count");
  add("R1254_RECENT_CONCERN_COUNT",590,{intentAny:["report_condition"],historyRecentCountMin:{"EXPRESS_CONCERN":2},historyRecentWindow:4},["ASK_IF_OKAY"],"recent_concern_count");
  add("R1255_RECENT_DETAILS_COUNT",560,{intentAny:["report_event"],historyRecentCountMin:{"ASK_FOR_DETAILS":2},historyRecentWindow:4},["ACKNOWLEDGE_EVENT"],"recent_details_count");
  add("R1256_RECENT_REPAIR_COUNT",620,{focusAny:["relationship","apology"],historyRecentCountMin:{"EXPRESS_REPAIR_DESIRE":2},historyRecentWindow:5},["ASK_TO_REPAIR"],"recent_repair_count");
  add("R1257_RECENT_BOUNDARY_COUNT",995,{boundaryAny:["leave_me_alone","stop_conversation"],historyRecentCountMin:{"RESPECT_BOUNDARY":2},historyRecentWindow:5},["RESPECT_BOUNDARY","ACCEPT_DISTANCE"],"recent_boundary_count");
  add("R1258_RECENT_TOUCH_BOUNDARY_COUNT",995,{boundaryAny:["do_not_touch"],historyRecentCountMin:{"PROMISE_NOT_TOUCH":2},historyRecentWindow:5},["RESPECT_BOUNDARY","PROMISE_NOT_TOUCH"],"recent_touch_boundary_count");
  add("R1259_RECENT_CONTACT_BOUNDARY_COUNT",995,{boundaryAny:["do_not_contact"],historyRecentCountMin:{"PROMISE_NOT_CONTACT":2},historyRecentWindow:5},["RESPECT_BOUNDARY","PROMISE_NOT_CONTACT"],"recent_contact_boundary_count");
  add("R1260_RECENT_GOODBYE_COUNT",540,{intentAny:["say_goodbye"],historyRecentCountMin:{"SAY_GOODBYE":2},historyRecentWindow:5},["SAY_GOODBYE_TEMPORARY"],"recent_goodbye_count");

  // Stage-backed relationship-status answers.
  R.push({
    id:"R1261_STATUS_STRANGER",
    priority:920,
    when:{intentAny:["ask_relationship_status"],relationshipEq:{"stage":"stranger"}},
    meanings:["STATE_RELATIONSHIP_STATUS"],
    reason:"status_stranger",
    slots:{STATE_RELATIONSHIP_STATUS:{RELATIONSHIP:"strangers"}}
  });
  R.push({
    id:"R1262_STATUS_ACQUAINTANCE",
    priority:920,
    when:{intentAny:["ask_relationship_status"],relationshipEq:{"stage":"acquaintance"}},
    meanings:["STATE_RELATIONSHIP_STATUS"],
    reason:"status_acquaintance",
    slots:{STATE_RELATIONSHIP_STATUS:{RELATIONSHIP:"acquaintances"}}
  });
  R.push({
    id:"R1263_STATUS_FRIEND",
    priority:920,
    when:{intentAny:["ask_relationship_status"],relationshipEq:{"stage":"friend"}},
    meanings:["STATE_RELATIONSHIP_STATUS"],
    reason:"status_friend",
    slots:{STATE_RELATIONSHIP_STATUS:{RELATIONSHIP:"friends"}}
  });
  R.push({
    id:"R1264_STATUS_CLOSE",
    priority:920,
    when:{intentAny:["ask_relationship_status"],relationshipEq:{"stage":"close"}},
    meanings:["STATE_RELATIONSHIP_STATUS"],
    reason:"status_close",
    slots:{STATE_RELATIONSHIP_STATUS:{RELATIONSHIP:"close"}}
  });
  R.push({
    id:"R1265_STATUS_ROMANTIC",
    priority:920,
    when:{intentAny:["ask_relationship_status"],relationshipEq:{"stage":"romantic"}},
    meanings:["STATE_RELATIONSHIP_STATUS"],
    reason:"status_romantic",
    slots:{STATE_RELATIONSHIP_STATUS:{RELATIONSHIP:"romantic"}}
  });
  R.push({
    id:"R1266_STATUS_PARTNER",
    priority:920,
    when:{intentAny:["ask_relationship_status"],relationshipEq:{"stage":"partner"}},
    meanings:["STATE_RELATIONSHIP_STATUS"],
    reason:"status_partner",
    slots:{STATE_RELATIONSHIP_STATUS:{RELATIONSHIP:"partners"}}
  });
  add("R1267_STATUS_DATING_FLAG",900,{intentAny:["ask_relationship_status"],relationshipFlagEq:{"dating":true}},["STATE_RELATIONSHIP_STATUS"],"dating_status_flag");
  add("R1268_STATUS_EXCLUSIVE_FLAG",900,{intentAny:["ask_relationship_status"],relationshipFlagEq:{"exclusive":true}},["CONFIRM_CHOICE"],"exclusive_status_flag");
  add("R1269_STATUS_STABLE_FLAG",580,{intentAny:["ask_relationship_status"],relationshipFlagEq:{"stable":true}},["EXPRESS_RELIEF"],"stable_status_flag");
  add("R1270_STATUS_CONFLICT_FLAG",620,{intentAny:["ask_relationship_status"],relationshipFlagEq:{"conflict":true}},["ASK_TO_REPAIR"],"conflict_status_flag");

  // Relationship-value reactions to questions and disclosures.
  add("R1271_HIGH_TRUST_REASON",610,{questionAny:{kindAny:["reason"]},relationshipMin:{trust:75}},["EXPRESS_CARE"],"high_trust_reason_question");
  add("R1272_LOW_TRUST_REASON",640,{questionAny:{kindAny:["reason"]},relationshipMax:{trust:25}},["ASK_FOR_HONEST_ANSWER"],"low_trust_reason_question");
  add("R1273_HIGH_TRUST_FEELINGS",650,{questionAny:{kindAny:["feelings"]},relationshipMin:{trust:75}},["EXPRESS_CARE"],"high_trust_feelings_question");
  add("R1274_LOW_TRUST_FEELINGS",650,{questionAny:{kindAny:["feelings"]},relationshipMax:{trust:25}},["EXPRESS_NEED_CLARITY"],"low_trust_feelings_question");
  add("R1275_HIGH_GOODWILL_HEALTH",590,{questionAny:{kindAny:["health"]},relationshipMin:{goodwill:70}},["EXPRESS_CARE"],"high_goodwill_health_question");
  add("R1276_HIGH_GOODWILL_HOME",570,{questionAny:{kindAny:["home"]},relationshipMin:{goodwill:70}},["EXPRESS_CARE"],"high_goodwill_home_question");
  add("R1277_HIGH_GOODWILL_WORK",570,{questionAny:{kindAny:["work"]},relationshipMin:{goodwill:70}},["EXPRESS_CARE"],"high_goodwill_work_question");
  add("R1278_HIGH_GOODWILL_MONEY",580,{questionAny:{kindAny:["money"]},relationshipMin:{goodwill:70}},["EXPRESS_CONCERN"],"high_goodwill_money_question");
  add("R1279_HIGH_FAMILIARITY_PLAN",560,{questionAny:{kindAny:["plan"]},relationshipMin:{familiarity:70}},["EXPRESS_CARE"],"high_familiarity_plan_question");
  add("R1280_HIGH_FAMILIARITY_PREF",550,{questionAny:{kindAny:["preference"]},relationshipMin:{familiarity:70}},["EXPRESS_CARE"],"high_familiarity_preference_question");

  // Exceptions and precedence around boundaries, contact, conflict and repair.
  add("R1281_NO_CONTACT_OVERRIDES_STAGE",999,{relationshipFlagEq:{"noContact":true},relationshipEq:{"stage":"partner"},intentAny:["request_contact","offer_contact"]},["RESPECT_BOUNDARY","DECLINE_CONTACT"],"no_contact_overrides_partner");
  add("R1282_DISTANCE_OVERRIDES_ROMANTIC",999,{relationshipFlagEq:{"distanceRequested":true},relationshipEq:{"stage":"romantic"},intentAny:["ask_to_meet","request_contact","request_stay"]},["ACCEPT_DISTANCE"],"distance_overrides_romantic");
  add("R1283_DISTANCE_OVERRIDES_PARTNER",999,{relationshipFlagEq:{"distanceRequested":true},relationshipEq:{"stage":"partner"},intentAny:["ask_to_meet","request_contact","request_stay"]},["ACCEPT_DISTANCE"],"distance_overrides_partner");
  add("R1284_BOUNDARY_OVERRIDES_HIGH_TRUST",999,{relationshipMin:{trust:90},boundaryAny:["leave_me_alone","stop_conversation","do_not_contact","do_not_touch"]},["RESPECT_BOUNDARY"],"boundary_overrides_very_high_trust");
  add("R1285_BOUNDARY_OVERRIDES_HIGH_GOODWILL",999,{relationshipMin:{goodwill:90},boundaryAny:["leave_me_alone","stop_conversation","do_not_contact","do_not_touch"]},["RESPECT_BOUNDARY"],"boundary_overrides_very_high_goodwill");
  add("R1286_BOUNDARY_OVERRIDES_HIGH_DESIRE",999,{relationshipMin:{desire:90},boundaryAny:["leave_me_alone","stop_conversation","do_not_contact","do_not_touch","do_not_kiss","do_not_hug"]},["RESPECT_BOUNDARY"],"boundary_overrides_very_high_desire");
  add("R1287_TRUST_BROKEN_BLOCKS_EASY_REASSURE",690,{intentAny:["request_reassurance","seek_reassurance"],relationshipFlagEq:{"trustBroken":true}},["ASK_TO_REPAIR"],"trust_broken_blocks_simple_reassurance");
  add("R1288_CONFLICT_BLOCKS_SIMPLE_RELIEF",650,{intentAny:["agree","accept_apology"],relationshipFlagEq:{"conflict":true}},["EXPRESS_NEED_CLARITY"],"conflict_blocks_simple_relief");
  add("R1289_REPAIRED_ALLOWS_RELIEF",620,{intentAny:["accept_apology"],relationshipFlagEq:{"repaired":true}},["EXPRESS_RELIEF"],"repaired_allows_relief");
  add("R1290_RECONCILING_ALLOWS_TALK",640,{intentAny:["ask_to_talk"],relationshipFlagEq:{"reconciling":true},boundaryNone:["stop_conversation"]},["AGREE_REQUEST","ASK_TO_REPAIR"],"reconciling_allows_talk");
  add("R1291_STABLE_RELATIONSHIP_HURT",620,{intentAny:["express_hurt"],relationshipFlagEq:{"stable":true}},["ASK_TO_TALK"],"stable_relationship_hurt");
  add("R1292_STABLE_RELATIONSHIP_FEAR",610,{intentAny:["express_fear"],relationshipFlagEq:{"stable":true}},["EXPRESS_CARE"],"stable_relationship_fear");
  add("R1293_EXCLUSIVE_JEALOUSY",630,{intentAny:["express_jealousy"],relationshipFlagEq:{"exclusive":true}},["CONFIRM_CHOICE"],"exclusive_relationship_jealousy");
  add("R1294_DATING_REASSURANCE",630,{intentAny:["request_reassurance","seek_reassurance"],relationshipFlagEq:{"dating":true}},["EXPRESS_CARE"],"dating_reassurance");
  add("R1295_ROMANTIC_REASSURANCE",640,{intentAny:["request_reassurance","seek_reassurance"],relationshipFlagEq:{"romantic":true}},["EXPRESS_CARE"],"romantic_reassurance");
  add("R1296_TRUST_BROKEN_APOLOGY",670,{intentAny:["apologize"],relationshipFlagEq:{"trustBroken":true}},["ASK_TO_REPAIR"],"trust_broken_apology");
  add("R1297_TRUST_BROKEN_HURT",670,{intentAny:["express_hurt"],relationshipFlagEq:{"trustBroken":true}},["ASK_TO_REPAIR"],"trust_broken_hurt");
  add("R1298_NO_CONTACT_BOUNDARY_REPEAT",999,{relationshipFlagEq:{"noContact":true},historyRecentAny:["DECLINE_CONTACT","RESPECT_BOUNDARY"],historyRecentWindow:4},["RESPECT_BOUNDARY","DECLINE_CONTACT"],"no_contact_recent_boundary");
  add("R1299_DISTANCE_BOUNDARY_REPEAT",999,{relationshipFlagEq:{"distanceRequested":true},historyRecentAny:["ACCEPT_DISTANCE","RESPECT_BOUNDARY"],historyRecentWindow:4},["RESPECT_BOUNDARY","ACCEPT_DISTANCE"],"distance_recent_boundary");
  add("R1300_CONFLICT_REPAIR_REPEAT",650,{relationshipFlagEq:{"conflict":true},historyRecentAny:["ASK_TO_REPAIR","EXPRESS_REPAIR_DESIRE"],historyRecentWindow:4},["ASK_TO_REPAIR"],"conflict_repair_recent");

  if (R.length !== 100) throw new Error("Expected 100 response rules, got " + R.length);
  HMW.Dialogue.registerResponseRules(R);
})();