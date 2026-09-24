(() => {
  "use strict";
  window.HMW = window.HMW || {};
  HMW.Dialogue = HMW.Dialogue || {};

  const R = [];
  const add = (id, priority, when, meanings, reason=id) =>
    R.push({ id, priority, when, meanings, reason });

  // Relationship-aware question handling.
  add("R1301_REL_LOW_WHERE",560,{questionAny:{kindAny:["where"]},relationshipMax:{familiarity:25}},["EXPRESS_NEED_CLARITY"],"low_familiarity_where");
  add("R1302_REL_HIGH_WHERE",540,{questionAny:{kindAny:["where"]},relationshipMin:{familiarity:70}},["EXPRESS_CARE"],"high_familiarity_where");
  add("R1303_REL_LOW_WHEN",560,{questionAny:{kindAny:["when"]},relationshipMax:{familiarity:25}},["EXPRESS_NEED_CLARITY"],"low_familiarity_when");
  add("R1304_REL_HIGH_WHEN",540,{questionAny:{kindAny:["when"]},relationshipMin:{familiarity:70}},["EXPRESS_CARE"],"high_familiarity_when");
  add("R1305_REL_LOW_REASON",620,{questionAny:{kindAny:["reason"]},relationshipMax:{trust:25}},["ASK_FOR_HONEST_ANSWER"],"low_trust_reason");
  add("R1306_REL_HIGH_REASON",560,{questionAny:{kindAny:["reason"]},relationshipMin:{trust:75}},["EXPRESS_CARE"],"high_trust_reason");
  add("R1307_REL_LOW_FEELINGS",640,{questionAny:{kindAny:["feelings"]},relationshipMax:{trust:25}},["EXPRESS_NEED_CLARITY"],"low_trust_feelings");
  add("R1308_REL_HIGH_FEELINGS",620,{questionAny:{kindAny:["feelings"]},relationshipMin:{trust:75,goodwill:70}},["EXPRESS_CARE"],"high_trust_feelings");
  add("R1309_REL_LOW_PLAN",550,{questionAny:{kindAny:["plan"]},relationshipMax:{familiarity:25}},["EXPRESS_NEED_CLARITY"],"low_familiarity_plan");
  add("R1310_REL_HIGH_PLAN",540,{questionAny:{kindAny:["plan"]},relationshipMin:{familiarity:70}},["EXPRESS_CARE"],"high_familiarity_plan");
  add("R1311_REL_LOW_PREF",550,{questionAny:{kindAny:["preference"]},relationshipMax:{familiarity:25}},["EXPRESS_NEED_CLARITY"],"low_familiarity_preference");
  add("R1312_REL_HIGH_PREF",530,{questionAny:{kindAny:["preference"]},relationshipMin:{familiarity:70}},["EXPRESS_CARE"],"high_familiarity_preference");
  add("R1313_REL_LOW_HOME",560,{questionAny:{kindAny:["home"]},relationshipMax:{trust:25}},["EXPRESS_NEED_CLARITY"],"low_trust_home");
  add("R1314_REL_HIGH_HOME",540,{questionAny:{kindAny:["home"]},relationshipMin:{trust:70,goodwill:65}},["EXPRESS_CARE"],"high_trust_home");
  add("R1315_REL_LOW_WORK",540,{questionAny:{kindAny:["work"]},relationshipMax:{familiarity:20}},["EXPRESS_NEED_CLARITY"],"low_familiarity_work");
  add("R1316_REL_HIGH_WORK",530,{questionAny:{kindAny:["work"]},relationshipMin:{familiarity:65}},["EXPRESS_CARE"],"high_familiarity_work");
  add("R1317_REL_LOW_MONEY",570,{questionAny:{kindAny:["money"]},relationshipMax:{trust:20}},["EXPRESS_NEED_CLARITY"],"low_trust_money");
  add("R1318_REL_HIGH_MONEY",550,{questionAny:{kindAny:["money"]},relationshipMin:{trust:70,goodwill:65}},["EXPRESS_CONCERN"],"high_trust_money");
  add("R1319_REL_LOW_HEALTH",550,{questionAny:{kindAny:["health"]},relationshipMax:{familiarity:20}},["EXPRESS_NEED_CLARITY"],"low_familiarity_health");
  add("R1320_REL_HIGH_HEALTH",560,{questionAny:{kindAny:["health"]},relationshipMin:{goodwill:70}},["EXPRESS_CARE"],"high_goodwill_health");

  // Relationship-aware requests and offers.
  add("R1321_REL_LOW_HELP_REQUEST",570,{intentAny:["ask_for_help"],relationshipMax:{goodwill:20}},["EXPRESS_NEED_CLARITY"],"low_goodwill_help_request");
  add("R1322_REL_HIGH_HELP_REQUEST",600,{intentAny:["ask_for_help"],relationshipMin:{goodwill:70}},["OFFER_HELP"],"high_goodwill_help_request");
  add("R1323_REL_LOW_MEET_REQUEST",580,{intentAny:["ask_to_meet"],relationshipMax:{trust:25}},["EXPRESS_NEED_CLARITY"],"low_trust_meet_request");
  add("R1324_REL_HIGH_MEET_REQUEST",620,{intentAny:["ask_to_meet"],relationshipMin:{trust:70,goodwill:65},boundaryNone:["do_not_visit","leave_me_alone"]},["AGREE_REQUEST"],"high_trust_meet_request");
  add("R1325_REL_LOW_TALK_REQUEST",580,{intentAny:["ask_to_talk"],relationshipMax:{trust:20}},["EXPRESS_NEED_CLARITY"],"low_trust_talk_request");
  add("R1326_REL_HIGH_TALK_REQUEST",620,{intentAny:["ask_to_talk"],relationshipMin:{trust:70},boundaryNone:["stop_conversation"]},["AGREE_REQUEST"],"high_trust_talk_request");
  add("R1327_REL_LOW_STAY_REQUEST",590,{intentAny:["request_stay"],relationshipMax:{goodwill:20}},["EXPRESS_NEED_CLARITY"],"low_goodwill_stay_request");
  add("R1328_REL_HIGH_STAY_REQUEST",630,{intentAny:["request_stay"],relationshipMin:{goodwill:70,trust:60},boundaryNone:["leave_me_alone"]},["AGREE_REQUEST"],"high_goodwill_stay_request");
  add("R1329_REL_LOW_CONTACT_REQUEST",590,{intentAny:["request_contact"],relationshipMax:{trust:20}},["EXPRESS_NEED_CLARITY"],"low_trust_contact_request");
  add("R1330_REL_HIGH_CONTACT_REQUEST",620,{intentAny:["request_contact"],relationshipMin:{trust:70},boundaryNone:["do_not_contact"]},["ACCEPT_CONTACT"],"high_trust_contact_request");
  add("R1331_REL_HIGH_OFFER_HELP",540,{intentAny:["offer_help"],relationshipMin:{goodwill:70}},["EXPRESS_GRATITUDE"],"high_goodwill_offer_help");
  add("R1332_REL_HIGH_OFFER_COMPANY",540,{intentAny:["offer_company"],relationshipMin:{goodwill:70}},["EXPRESS_GRATITUDE"],"high_goodwill_offer_company");
  add("R1333_REL_HIGH_OFFER_CONTACT",530,{intentAny:["offer_contact"],relationshipMin:{trust:70},boundaryNone:["do_not_contact"]},["EXPRESS_GRATITUDE"],"high_trust_offer_contact");
  add("R1334_REL_LOW_OFFER_CONTACT",520,{intentAny:["offer_contact"],relationshipMax:{trust:20}},["EXPRESS_NEED_CLARITY"],"low_trust_offer_contact");
  add("R1335_REL_HIGH_REASSURE",690,{intentAny:["request_reassurance","seek_reassurance"],relationshipMin:{trust:75,goodwill:75}},["EXPRESS_CARE","CONFIRM_TRUST"],"high_relationship_reassurance");
  add("R1336_REL_LOW_REASSURE",610,{intentAny:["request_reassurance","seek_reassurance"],relationshipMax:{trust:25}},["ASK_FOR_TRUST"],"low_trust_reassurance");
  add("R1337_REL_HIGH_DISTANCE",710,{intentAny:["request_distance"],relationshipMin:{goodwill:70}},["ACCEPT_DISTANCE","EXPRESS_CARE"],"high_goodwill_distance_request");
  add("R1338_REL_LOW_DISTANCE",700,{intentAny:["request_distance"],relationshipMax:{goodwill:25}},["ACCEPT_DISTANCE"],"low_goodwill_distance_request");
  add("R1339_REL_HIGH_APOLOGY",660,{intentAny:["apologize"],relationshipMin:{trust:70,goodwill:70}},["EXPRESS_REPAIR_DESIRE"],"high_relationship_apology");
  add("R1340_REL_LOW_APOLOGY",610,{intentAny:["apologize"],relationshipMax:{trust:25,goodwill:25}},["EXPRESS_NEED_CLARITY"],"low_relationship_apology");

  // History-sensitive question follow-through.
  add("R1341_AFTER_LOCATION_ANSWER",540,{questionAny:{kindAny:["where"]},historyLastAny:["STATE_CURRENT_LOCATION"]},["EXPRESS_CARE"],"after_location_answer");
  add("R1342_AFTER_TIME_ANSWER",540,{questionAny:{kindAny:["when"]},historyLastAny:["STATE_AVAILABLE_TIME","STATE_RETURN_TIME"]},["EXPRESS_CARE"],"after_time_answer");
  add("R1343_AFTER_HEALTH_ANSWER",550,{questionAny:{kindAny:["health"]},historyLastAny:["STATE_CONDITION"]},["EXPRESS_CARE"],"after_health_answer");
  add("R1344_AFTER_SLEEP_GOOD",530,{questionAny:{kindAny:["sleep"]},historyLastAny:["STATE_SLEEP_STATUS_GOOD"]},["EXPRESS_RELIEF"],"after_good_sleep_answer");
  add("R1345_AFTER_SLEEP_BAD",570,{questionAny:{kindAny:["sleep"]},historyLastAny:["STATE_SLEEP_STATUS_BAD"]},["EXPRESS_CONCERN"],"after_bad_sleep_answer");
  add("R1346_AFTER_FOOD_EATEN",530,{questionAny:{kindAny:["food"]},historyLastAny:["STATE_FOOD_STATUS_EATEN"]},["EXPRESS_RELIEF"],"after_food_eaten_answer");
  add("R1347_AFTER_FOOD_NOT_EATEN",580,{questionAny:{kindAny:["food"]},historyLastAny:["STATE_FOOD_STATUS_NOT_EATEN"]},["EXPRESS_CONCERN"],"after_food_not_eaten_answer");
  add("R1348_AFTER_MONEY_NO",580,{questionAny:{kindAny:["money"]},historyLastAny:["STATE_NO_MONEY"]},["EXPRESS_CONCERN"],"after_no_money_answer");
  add("R1349_AFTER_WORK_STATUS",540,{questionAny:{kindAny:["work"]},historyLastAny:["STATE_WORK_STATUS"]},["EXPRESS_CARE"],"after_work_status_answer");
  add("R1350_AFTER_PLAN_ANSWER",530,{questionAny:{kindAny:["plan"]},historyLastAny:["STATE_CURRENT_PLAN"]},["EXPRESS_CARE"],"after_plan_answer");
  add("R1351_AFTER_PREF_ANSWER",520,{questionAny:{kindAny:["preference"]},historyLastAny:["STATE_CURRENT_PREFERENCE"]},["EXPRESS_CARE"],"after_preference_answer");
  add("R1352_AFTER_REASON_ANSWER",550,{questionAny:{kindAny:["reason"]},historyLastAny:["STATE_REASON"]},["EXPRESS_CARE"],"after_reason_answer");
  add("R1353_AFTER_OPINION_ANSWER",530,{questionAny:{kindAny:["opinion"]},historyLastAny:["STATE_OPINION"]},["EXPRESS_CARE"],"after_opinion_answer");
  add("R1354_AFTER_PRICE_ANSWER",520,{questionAny:{kindAny:["price"]},historyLastAny:["STATE_PRICE"]},["ACKNOWLEDGE_EVENT"],"after_price_answer");
  add("R1355_AFTER_COUNT_ANSWER",520,{questionAny:{kindAny:["quantity"]},historyLastAny:["STATE_COUNT"]},["ACKNOWLEDGE_EVENT"],"after_count_answer");
  add("R1356_AFTER_CAPABILITY_CONFIRM",530,{questionAny:{kindAny:["capability"]},historyLastAny:["CONFIRM_CAPABILITY"]},["EXPRESS_RELIEF"],"after_capability_confirm");
  add("R1357_AFTER_CAPABILITY_DENY",560,{questionAny:{kindAny:["capability"]},historyLastAny:["DENY_CAPABILITY"]},["EXPRESS_NEED_CLARITY"],"after_capability_deny");
  add("R1358_AFTER_AVAILABILITY_CONFIRM",530,{questionAny:{kindAny:["availability"]},historyLastAny:["CONFIRM_AVAILABLE"]},["EXPRESS_JOY"],"after_availability_confirm");
  add("R1359_AFTER_AVAILABILITY_DENY",560,{questionAny:{kindAny:["availability"]},historyLastAny:["DENY_AVAILABLE"]},["EXPRESS_NEED_CLARITY"],"after_availability_deny");
  add("R1360_AFTER_UNKNOWN",610,{intentAny:["ask_question"],historyLastAny:["ANSWER_UNKNOWN"]},["ASK_FOR_DETAILS"],"after_unknown_answer");

  // Repetition control and continuation.
  add("R1361_RECENT_CARE_REPEAT",530,{historyRecentCountMin:{"EXPRESS_CARE":3},historyRecentWindow:5,intentAny:["report_event","report_condition"]},["ACKNOWLEDGE_EVENT"],"care_repeated_recently");
  add("R1362_RECENT_CONCERN_REPEAT",560,{historyRecentCountMin:{"EXPRESS_CONCERN":3},historyRecentWindow:5,intentAny:["report_condition"]},["ASK_IF_OKAY"],"concern_repeated_recently");
  add("R1363_RECENT_SYMPATHY_REPEAT",540,{historyRecentCountMin:{"EXPRESS_SYMPATHY":2},historyRecentWindow:5,intentAny:["report_event"]},["ACKNOWLEDGE_EVENT"],"sympathy_repeated_recently");
  add("R1364_RECENT_REPAIR_REPEAT",610,{historyRecentCountMin:{"ASK_TO_REPAIR":2},historyRecentWindow:5,focusAny:["relationship","apology"]},["EXPRESS_REPAIR_DESIRE"],"repair_request_repeated_recently");
  add("R1365_RECENT_CLARITY_REPEAT",590,{historyRecentCountMin:{"EXPRESS_NEED_CLARITY":2},historyRecentWindow:5,intentAny:["ask_question"]},["ASK_FOR_DETAILS"],"clarity_repeated_recently");
  add("R1366_RECENT_TRUST_REPEAT",620,{historyRecentCountMin:{"ASK_FOR_TRUST":2},historyRecentWindow:5,focusAny:["trust"]},["EXPRESS_CARE"],"trust_request_repeated_recently");
  add("R1367_RECENT_HONEST_REPEAT",620,{historyRecentCountMin:{"ASK_FOR_HONEST_ANSWER":2},historyRecentWindow:5,focusAny:["trust","betrayal"]},["EXPRESS_NEED_CLARITY"],"honesty_request_repeated_recently");
  add("R1368_RECENT_COMPANY_REPEAT",540,{historyRecentCountMin:{"OFFER_COMPANY":2},historyRecentWindow:5,intentAny:["express_loneliness"],boundaryNone:["leave_me_alone"]},["EXPRESS_CARE"],"company_offer_repeated_recently");
  add("R1369_RECENT_HELP_REPEAT",540,{historyRecentCountMin:{"OFFER_HELP":2},historyRecentWindow:5,intentAny:["ask_for_help"]},["EXPRESS_CARE"],"help_offer_repeated_recently");
  add("R1370_RECENT_GOODBYE_REPEAT",530,{historyRecentCountMin:{"SAY_GOODBYE_TEMPORARY":2},historyRecentWindow:5,intentAny:["say_goodbye"]},["EXPRESS_MISSING"],"temporary_goodbye_repeated_recently");
  add("R1371_NO_RECENT_CONCERN",540,{intentAny:["report_condition"],historyRecentNone:["EXPRESS_CONCERN"],historyRecentWindow:4,emotionMin:{fear:45}},["EXPRESS_CONCERN"],"new_concern_not_recent");
  add("R1372_NO_RECENT_SYMPATHY",530,{intentAny:["report_event"],historyRecentNone:["EXPRESS_SYMPATHY"],historyRecentWindow:4,emotionMin:{sadness:45}},["EXPRESS_SYMPATHY"],"new_sympathy_not_recent");
  add("R1373_NO_RECENT_RELIEF",520,{intentAny:["agree","accept_apology"],historyRecentNone:["EXPRESS_RELIEF"],historyRecentWindow:4},["EXPRESS_RELIEF"],"new_relief_not_recent");
  add("R1374_NO_RECENT_JOY",510,{intentAny:["greet"],historyRecentNone:["EXPRESS_JOY"],historyRecentWindow:4},["EXPRESS_JOY"],"new_joy_not_recent");
  add("R1375_NO_RECENT_REPAIR",590,{intentAny:["apologize"],historyRecentNone:["EXPRESS_REPAIR_DESIRE","ASK_TO_REPAIR"],historyRecentWindow:4},["EXPRESS_REPAIR_DESIRE"],"new_repair_not_recent");
  add("R1376_SUFFIX_UNKNOWN_DETAILS",600,{intentAny:["ask_question"],historySuffix:["ANSWER_UNKNOWN","ASK_FOR_DETAILS"]},["EXPRESS_NEED_CLARITY"],"unknown_then_details");
  add("R1377_SUFFIX_HURT_REPAIR",620,{intentAny:["express_hurt"],historySuffix:["EXPRESS_CONCERN","ASK_TO_REPAIR"]},["EXPRESS_CARE"],"hurt_then_repair");
  add("R1378_SUFFIX_ANGER_TIME",610,{intentAny:["express_anger"],historySuffix:["EXPRESS_ANGER","REQUEST_TIME"]},["EXPRESS_NEED_CLARITY"],"anger_then_time");
  add("R1379_SUFFIX_LONELY_COMPANY",570,{intentAny:["express_loneliness"],historySuffix:["EXPRESS_LONELINESS","OFFER_COMPANY"],boundaryNone:["leave_me_alone"]},["EXPRESS_CARE"],"lonely_then_company");
  add("R1380_SUFFIX_APOLOGY_RELIEF",560,{intentAny:["apologize","accept_apology"],historySuffix:["ACCEPT_APOLOGY","EXPRESS_RELIEF"]},["EXPRESS_CARE"],"apology_then_relief");

  // Priority/exception rules.
  add("R1381_BOUNDARY_BLOCKS_MEET",999,{intentAny:["ask_to_meet"],boundaryAny:["leave_me_alone","do_not_visit","stop_conversation"]},["RESPECT_BOUNDARY","DECLINE_REQUEST"],"boundary_blocks_meeting");
  add("R1382_BOUNDARY_BLOCKS_TALK",999,{intentAny:["ask_to_talk"],boundaryAny:["stop_conversation","do_not_ask"]},["RESPECT_BOUNDARY","DECLINE_REQUEST"],"boundary_blocks_talk");
  add("R1383_BOUNDARY_BLOCKS_STAY",999,{intentAny:["request_stay"],boundaryAny:["leave_me_alone","stop_conversation"]},["RESPECT_BOUNDARY","DECLINE_REQUEST"],"boundary_blocks_stay");
  add("R1384_BOUNDARY_BLOCKS_CONTACT",999,{intentAny:["request_contact","offer_contact"],boundaryAny:["do_not_contact","do_not_call","do_not_message"]},["RESPECT_BOUNDARY","DECLINE_CONTACT"],"boundary_blocks_contact");
  add("R1385_NO_CONTACT_FLAG_PRIORITY",999,{relationshipFlagEq:{"noContact":true},intentAny:["request_contact","offer_contact"]},["RESPECT_BOUNDARY","DECLINE_CONTACT"],"no_contact_flag_priority");
  add("R1386_DISTANCE_FLAG_PRIORITY",999,{relationshipFlagEq:{"distanceRequested":true},intentAny:["ask_to_meet","ask_to_talk","request_contact","request_stay"]},["RESPECT_BOUNDARY","ACCEPT_DISTANCE"],"distance_flag_priority");
  add("R1387_TRUST_BROKEN_OVER_REASSURE",700,{relationshipFlagEq:{"trustBroken":true},intentAny:["request_reassurance","seek_reassurance"]},["ASK_TO_REPAIR"],"trust_broken_priority_reassurance");
  add("R1388_CONFLICT_OVER_RELIEF",680,{relationshipFlagEq:{"conflict":true},intentAny:["agree","accept_apology"]},["EXPRESS_NEED_CLARITY"],"conflict_priority_relief");
  add("R1389_RECONCILING_REPAIR",670,{relationshipFlagEq:{"reconciling":true},focusAny:["relationship","apology"]},["ASK_TO_REPAIR"],"reconciling_priority_repair");
  add("R1390_REPAIRED_RELIEF",630,{relationshipFlagEq:{"repaired":true},focusAny:["relationship","apology"]},["EXPRESS_RELIEF"],"repaired_priority_relief");
  add("R1391_HIGH_DESIRE_NEVER_TOUCH_BOUNDARY",999,{relationshipMin:{desire:80},boundaryAny:["do_not_touch","do_not_hug","do_not_kiss"]},["RESPECT_BOUNDARY"],"desire_boundary_priority");
  add("R1392_HIGH_TRUST_NEVER_CONTACT_BOUNDARY",999,{relationshipMin:{trust:80},boundaryAny:["do_not_contact"]},["RESPECT_BOUNDARY","DECLINE_CONTACT"],"trust_contact_boundary_priority");
  add("R1393_PARTNER_NEVER_DISTANCE_OVERRIDE",999,{relationshipEq:{"stage":"partner"},boundaryAny:["leave_me_alone","stop_conversation"]},["RESPECT_BOUNDARY","ACCEPT_DISTANCE"],"partner_distance_boundary_priority");
  add("R1394_ROMANTIC_NEVER_TOUCH_OVERRIDE",999,{relationshipEq:{"stage":"romantic"},boundaryAny:["do_not_touch","do_not_hug","do_not_kiss"]},["RESPECT_BOUNDARY"],"romantic_touch_boundary_priority");
  add("R1395_FACT_LOVE_TRUE_TRUST_BROKEN",860,{factEq:{"lovesHeroine":true},relationshipFlagEq:{"trustBroken":true},focusAny:["love","trust","relationship"]},["AFFIRM_LOVE","ASK_TO_REPAIR"],"love_true_trust_broken");
  add("R1396_FACT_LOYAL_TRUE_TRUST_BROKEN",850,{factEq:{"loyalToHeroine":true},relationshipFlagEq:{"trustBroken":true},focusAny:["betrayal","trust"]},["PROMISE_LOYALTY","ASK_TO_REPAIR"],"loyal_true_trust_broken");
  add("R1397_FACT_NOT_ABANDON_DISTANCE",850,{factEq:{"willAbandonHeroine":false},intentAny:["request_distance"]},["ACCEPT_DISTANCE"],"not_abandoning_but_respect_distance");
  add("R1398_FACT_CHOICE_TRUE_JEALOUS",840,{factEq:{"choosesHeroine":true},emotionMin:{jealousy:50}},["CONFIRM_CHOICE"],"choice_true_jealousy");
  add("R1399_FACT_TRUST_TRUE_DISTRUST",840,{factEq:{"trustsHeroine":true},emotionMin:{distrust:50}},["CONFIRM_TRUST"],"trust_true_distrust");
  add("R1400_FACT_BETRAY_FALSE_ACCUSATION",860,{factEq:{"intendsBetrayal":false},claimTypeAny:["accusation"],focusAny:["betrayal"]},["DENY_BETRAYAL"],"betrayal_false_accusation");

  if (R.length !== 100) throw new Error("Expected 100 response rules, got " + R.length);
  HMW.Dialogue.registerResponseRules(R);
})();