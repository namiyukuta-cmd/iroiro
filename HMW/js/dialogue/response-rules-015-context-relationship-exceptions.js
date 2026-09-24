(() => {
  "use strict";
  window.HMW = window.HMW || {};
  HMW.Dialogue = HMW.Dialogue || {};

  const R = [];
  const add = (id, priority, when, meanings, reason=id) =>
    R.push({ id, priority, when, meanings, reason });

  // Privacy / whether the NPC can speak freely.
  add("R1401_PRIVATE_AFFECTION",610,{intentAny:["affirm_affection"],contextEq:{privacy:"private"}},["EXPRESS_CARE"],"private_affection");
  add("R1402_PUBLIC_AFFECTION",570,{intentAny:["affirm_affection"],contextEq:{privacy:"public"}},["EXPRESS_CARE"],"public_affection");
  add("R1403_PRIVATE_REASSURANCE",650,{intentAny:["request_reassurance","seek_reassurance"],contextEq:{privacy:"private"}},["EXPRESS_CARE"],"private_reassurance");
  add("R1404_PUBLIC_REASSURANCE",610,{intentAny:["request_reassurance","seek_reassurance"],contextEq:{privacy:"public"}},["EXPRESS_CARE"],"public_reassurance");
  add("R1405_PRIVATE_HURT",630,{intentAny:["express_hurt"],contextEq:{privacy:"private"}},["ASK_TO_TALK"],"private_hurt");
  add("R1406_PUBLIC_HURT",590,{intentAny:["express_hurt"],contextEq:{privacy:"public"}},["EXPRESS_CONCERN"],"public_hurt");
  add("R1407_PRIVATE_ANGER",620,{intentAny:["express_anger"],contextEq:{privacy:"private"}},["ASK_TO_TALK"],"private_anger");
  add("R1408_PUBLIC_ANGER",590,{intentAny:["express_anger"],contextEq:{privacy:"public"}},["REQUEST_TIME"],"public_anger");
  add("R1409_PRIVATE_APOLOGY",620,{intentAny:["apologize"],contextEq:{privacy:"private"}},["EXPRESS_REPAIR_DESIRE"],"private_apology");
  add("R1410_PUBLIC_APOLOGY",580,{intentAny:["apologize"],contextEq:{privacy:"public"}},["EXPRESS_NEED_CLARITY"],"public_apology");
  add("R1411_ALONE_RELATIONSHIP",620,{focusAny:["relationship","love","trust"],contextEq:{alone:true}},["EXPRESS_CARE"],"relationship_topic_alone");
  add("R1412_NOT_ALONE_RELATIONSHIP",570,{focusAny:["relationship","love","trust"],contextEq:{alone:false}},["EXPRESS_NEED_CLARITY"],"relationship_topic_not_alone");
  add("R1413_CAN_TALK_FREELY",590,{intentAny:["ask_to_talk"],contextEq:{canTalkFreely:true},policyEq:{willingToTalk:true}},["AGREE_REQUEST"],"can_talk_freely");
  add("R1414_CANNOT_TALK_FREELY",650,{intentAny:["ask_to_talk"],contextEq:{canTalkFreely:false}},["DECLINE_REQUEST","REQUEST_TIME"],"cannot_talk_freely");
  add("R1415_INTERRUPTED_REPORT",600,{intentAny:["report_event","report_condition"],contextEq:{interrupted:true}},["ASK_FOR_DETAILS"],"interrupted_report");
  add("R1416_INTERRUPTED_QUESTION",600,{intentAny:["ask_question"],contextEq:{interrupted:true}},["EXPRESS_NEED_CLARITY"],"interrupted_question");
  add("R1417_PRIVATE_TRUST_BROKEN",670,{focusAny:["trust","relationship"],relationshipFlagEq:{trustBroken:true},contextEq:{privacy:"private"}},["ASK_TO_REPAIR"],"private_trust_broken");
  add("R1418_PUBLIC_TRUST_BROKEN",620,{focusAny:["trust","relationship"],relationshipFlagEq:{trustBroken:true},contextEq:{privacy:"public"}},["REQUEST_TIME"],"public_trust_broken");
  add("R1419_PRIVATE_CONFLICT",660,{relationshipFlagEq:{conflict:true},contextEq:{privacy:"private"},focusAny:["relationship","apology"]},["ASK_TO_REPAIR"],"private_conflict");
  add("R1420_PUBLIC_CONFLICT",620,{relationshipFlagEq:{conflict:true},contextEq:{privacy:"public"},focusAny:["relationship","apology"]},["REQUEST_TIME"],"public_conflict");

  // Danger and urgency.
  add("R1421_DANGER_HIGH_GENERIC",900,{contextMin:{dangerLevel:70}},["REASSURE_SAFETY","EXPRESS_CONCERN"],"high_danger_context");
  add("R1422_DANGER_HIGH_FEAR",910,{contextMin:{dangerLevel:70},emotionMin:{fear:45}},["REASSURE_SAFETY","EXPRESS_CONCERN"],"high_danger_fear");
  add("R1423_DANGER_HIGH_HURT",900,{contextMin:{dangerLevel:70},emotionMin:{hurt:45}},["EXPRESS_CONCERN"],"high_danger_hurt");
  add("R1424_DANGER_HIGH_HEALTH",910,{contextMin:{dangerLevel:70},focusAny:["health","injury","illness"]},["ASK_IF_OKAY","EXPRESS_CONCERN"],"high_danger_health");
  add("R1425_DANGER_HIGH_HOME",880,{contextMin:{dangerLevel:70},focusAny:["home","shelter"]},["OFFER_SHELTER"],"high_danger_home");
  add("R1426_DANGER_HIGH_WEATHER",880,{contextMin:{dangerLevel:70},focusAny:["weather"]},["OFFER_SHELTER","OFFER_WARMTH"],"high_danger_weather");
  add("R1427_DANGER_LOW_RELIEF",540,{contextMax:{dangerLevel:20},emotionMin:{relief:45}},["EXPRESS_RELIEF"],"low_danger_relief");
  add("R1428_URGENCY_HIGH_HELP",850,{contextMin:{urgency:75},intentAny:["ask_for_help"]},["OFFER_HELP"],"urgent_help_request");
  add("R1429_URGENCY_HIGH_HEALTH",860,{contextMin:{urgency:75},focusAny:["health","injury","illness"]},["EXPRESS_CONCERN"],"urgent_health_context");
  add("R1430_URGENCY_HIGH_FOOD",780,{contextMin:{urgency:75},focusAny:["food","hunger"],policyEq:{canOfferFood:true}},["OFFER_FOOD"],"urgent_food_context");
  add("R1431_URGENCY_HIGH_WATER",780,{contextMin:{urgency:75},focusAny:["water","thirst"],policyEq:{canOfferWater:true}},["OFFER_DRINK"],"urgent_water_context");
  add("R1432_URGENCY_HIGH_SHELTER",790,{contextMin:{urgency:75},focusAny:["home","shelter","weather"]},["OFFER_SHELTER"],"urgent_shelter_context");
  add("R1433_URGENCY_HIGH_QUESTION",650,{contextMin:{urgency:75},intentAny:["ask_question"]},["EXPRESS_NEED_CLARITY"],"urgent_question");
  add("R1434_URGENCY_LOW_REPORT",510,{contextMax:{urgency:25},intentAny:["report_event"]},["ACKNOWLEDGE_EVENT"],"low_urgency_report");
  add("R1435_DANGER_HIGH_BOUNDARY",999,{contextMin:{dangerLevel:70},boundaryAny:["leave_me_alone","do_not_follow","do_not_touch","stop_conversation"]},["RESPECT_BOUNDARY"],"danger_never_overrides_boundary");
  add("R1436_URGENCY_HIGH_BOUNDARY",999,{contextMin:{urgency:75},boundaryAny:["leave_me_alone","do_not_contact","do_not_touch","stop_conversation"]},["RESPECT_BOUNDARY"],"urgency_never_overrides_boundary");
  add("R1437_DANGER_HIGH_PARTNER",900,{contextMin:{dangerLevel:70},relationshipEq:{stage:"partner"}},["EXPRESS_CARE","EXPRESS_CONCERN"],"high_danger_partner");
  add("R1438_DANGER_HIGH_STRANGER",860,{contextMin:{dangerLevel:70},relationshipEq:{stage:"stranger"}},["EXPRESS_CONCERN"],"high_danger_stranger");
  add("R1439_URGENCY_HIGH_TRUST",820,{contextMin:{urgency:75},relationshipMin:{trust:70}},["EXPRESS_CARE"],"urgent_high_trust");
  add("R1440_URGENCY_HIGH_LOW_TRUST",780,{contextMin:{urgency:75},relationshipMax:{trust:25}},["EXPRESS_NEED_CLARITY"],"urgent_low_trust");

  // Conversation phase and time of day.
  add("R1441_PHASE_OPENING_GREETING",540,{intentAny:["greet"],contextEq:{conversationPhase:"opening"}},["RETURN_GREETING"],"opening_greeting");
  add("R1442_PHASE_OPENING_QUESTION",520,{intentAny:["ask_question"],contextEq:{conversationPhase:"opening"}},["EXPRESS_NEED_CLARITY"],"opening_question");
  add("R1443_PHASE_ONGOING_REPORT",520,{intentAny:["report_event"],contextEq:{conversationPhase:"ongoing"}},["ACKNOWLEDGE_EVENT"],"ongoing_report");
  add("R1444_PHASE_ONGOING_HURT",620,{intentAny:["express_hurt"],contextEq:{conversationPhase:"ongoing"}},["EXPRESS_CONCERN"],"ongoing_hurt");
  add("R1445_PHASE_CLOSING_GOODBYE",570,{intentAny:["say_goodbye"],contextEq:{conversationPhase:"closing"}},["SAY_GOODBYE"],"closing_goodbye");
  add("R1446_PHASE_CLOSING_CARE",550,{intentAny:["say_goodbye"],contextEq:{conversationPhase:"closing"},relationshipMin:{goodwill:65}},["SAY_GOODBYE_TEMPORARY"],"closing_goodbye_care");
  add("R1447_MORNING_GREETING",510,{intentAny:["greet"],contextEq:{timeOfDay:"morning"}},["RETURN_GREETING"],"morning_greeting");
  add("R1448_DAY_GREETING",510,{intentAny:["greet"],contextEq:{timeOfDay:"day"}},["RETURN_GREETING"],"day_greeting");
  add("R1449_EVENING_GREETING",510,{intentAny:["greet"],contextEq:{timeOfDay:"evening"}},["RETURN_GREETING"],"evening_greeting");
  add("R1450_NIGHT_GOODBYE",540,{intentAny:["say_goodbye"],contextEq:{timeOfDay:"night"}},["SAY_GOODBYE_TEMPORARY"],"night_goodbye");
  add("R1451_NIGHT_TIRED",560,{focusAny:["sleep","tiredness"],contextEq:{timeOfDay:"night"}},["OFFER_REST"],"night_tiredness");
  add("R1452_MORNING_PLAN",520,{questionAny:{kindAny:["plan"]},contextEq:{timeOfDay:"morning"}},["EXPRESS_CARE"],"morning_plan_question");
  add("R1453_EVENING_RETURN",540,{focusAny:["return"],contextEq:{timeOfDay:"evening"}},["ASK_IF_COMING_BACK"],"evening_return_topic");
  add("R1454_NIGHT_RETURN",550,{focusAny:["return"],contextEq:{timeOfDay:"night"}},["ASK_IF_COMING_BACK"],"night_return_topic");
  add("R1455_CLOSING_REASSURANCE",610,{intentAny:["request_reassurance","seek_reassurance"],contextEq:{conversationPhase:"closing"}},["EXPRESS_CARE"],"closing_reassurance");
  add("R1456_OPENING_REUNION",540,{intentAny:["greet"],contextEq:{conversationPhase:"opening"},historyRecentAny:["SAY_GOODBYE","SAY_GOODBYE_TEMPORARY"],historyRecentWindow:5},["EXPRESS_JOY"],"opening_after_goodbye");
  add("R1457_ONGOING_REPAIR",620,{focusAny:["relationship","apology"],contextEq:{conversationPhase:"ongoing"},relationshipFlagEq:{reconciling:true}},["ASK_TO_REPAIR"],"ongoing_reconciliation");
  add("R1458_CLOSING_CONFLICT",620,{relationshipFlagEq:{conflict:true},contextEq:{conversationPhase:"closing"}},["REQUEST_TIME"],"closing_conflict");
  add("R1459_CLOSING_BOUNDARY",995,{boundaryAny:["stop_conversation","leave_me_alone"],contextEq:{conversationPhase:"closing"}},["RESPECT_BOUNDARY","ACCEPT_DISTANCE"],"closing_boundary");
  add("R1460_OPENING_BOUNDARY",995,{boundaryAny:["do_not_contact","leave_me_alone"],contextEq:{conversationPhase:"opening"}},["RESPECT_BOUNDARY"],"opening_boundary");

  // Location context.
  add("R1461_HOME_HEALTH",560,{focusAny:["health","injury","illness"],contextEq:{locationType:"home"}},["EXPRESS_CONCERN"],"home_health_context");
  add("R1462_HOME_TIRED",540,{focusAny:["sleep","tiredness"],contextEq:{locationType:"home"}},["OFFER_REST"],"home_tired_context");
  add("R1463_HOME_FOOD",530,{focusAny:["food","hunger"],contextEq:{locationType:"home"},policyEq:{canOfferFood:true}},["OFFER_FOOD"],"home_food_context");
  add("R1464_HOME_WATER",530,{focusAny:["water","thirst"],contextEq:{locationType:"home"},policyEq:{canOfferWater:true}},["OFFER_DRINK"],"home_water_context");
  add("R1465_WORK_WORK_TOPIC",540,{focusAny:["work","job"],contextEq:{locationType:"work"}},["ASK_ABOUT_WORK"],"workplace_work_topic");
  add("R1466_WORK_PRIVATE_TOPIC",580,{focusAny:["love","relationship"],contextEq:{locationType:"work"}},["EXPRESS_NEED_CLARITY"],"workplace_private_topic");
  add("R1467_STREET_WEATHER",540,{focusAny:["weather"],contextEq:{locationType:"street"}},["COMMENT_COLD_WEATHER"],"street_weather");
  add("R1468_STREET_HOME",550,{focusAny:["home","shelter"],contextEq:{locationType:"street"}},["ASK_ABOUT_HOME"],"street_home_topic");
  add("R1469_STREET_DANGER",850,{contextEq:{locationType:"street"},contextMin:{dangerLevel:60}},["EXPRESS_CONCERN"],"street_danger");
  add("R1470_TRANSIT_DESTINATION",530,{questionAny:{kindAny:["destination"]},contextEq:{locationType:"transit"}},["ASK_DESTINATION"],"transit_destination");
  add("R1471_TRANSIT_GOODBYE",530,{intentAny:["say_goodbye"],contextEq:{locationType:"transit"}},["SAY_GOODBYE_TEMPORARY"],"transit_goodbye");
  add("R1472_SHOP_PRICE",520,{questionAny:{kindAny:["price"]},contextEq:{locationType:"shop"}},["ACKNOWLEDGE_EVENT"],"shop_price_question");
  add("R1473_SHOP_QUANTITY",520,{questionAny:{kindAny:["quantity"]},contextEq:{locationType:"shop"}},["ACKNOWLEDGE_EVENT"],"shop_quantity_question");
  add("R1474_SHELTER_SLEEP",540,{focusAny:["sleep","tiredness"],contextEq:{locationType:"shelter"}},["OFFER_REST"],"shelter_sleep");
  add("R1475_SHELTER_WEATHER",540,{focusAny:["weather"],contextEq:{locationType:"shelter"}},["EXPRESS_RELIEF"],"shelter_weather");
  add("R1476_HOME_RELATIONSHIP_PRIVATE",620,{focusAny:["relationship","love"],contextEq:{locationType:"home",privacy:"private"}},["EXPRESS_CARE"],"home_private_relationship");
  add("R1477_WORK_RELATIONSHIP_PUBLIC",590,{focusAny:["relationship","love"],contextEq:{locationType:"work",privacy:"public"}},["EXPRESS_NEED_CLARITY"],"work_public_relationship");
  add("R1478_STREET_RELATIONSHIP_PUBLIC",580,{focusAny:["relationship","love"],contextEq:{locationType:"street",privacy:"public"}},["EXPRESS_NEED_CLARITY"],"street_public_relationship");
  add("R1479_HOME_REPAIR_PRIVATE",640,{focusAny:["apology","relationship"],relationshipFlagEq:{conflict:true},contextEq:{locationType:"home",privacy:"private"}},["ASK_TO_REPAIR"],"home_private_repair");
  add("R1480_PUBLIC_REPAIR_DELAY",620,{focusAny:["apology","relationship"],relationshipFlagEq:{conflict:true},contextEq:{privacy:"public"}},["REQUEST_TIME"],"public_repair_delay");

  // Combined context + relationship + history exceptions.
  add("R1481_PRIVATE_PARTNER_REASSURE",700,{intentAny:["request_reassurance","seek_reassurance"],relationshipEq:{stage:"partner"},contextEq:{privacy:"private"}},["EXPRESS_CARE"],"private_partner_reassurance");
  add("R1482_PUBLIC_PARTNER_REASSURE",640,{intentAny:["request_reassurance","seek_reassurance"],relationshipEq:{stage:"partner"},contextEq:{privacy:"public"}},["EXPRESS_CARE"],"public_partner_reassurance");
  add("R1483_PRIVATE_TRUST_BROKEN_REPAIR",690,{relationshipFlagEq:{trustBroken:true},contextEq:{privacy:"private"},focusAny:["trust","relationship"]},["ASK_TO_REPAIR"],"private_trust_broken_repair");
  add("R1484_PUBLIC_TRUST_BROKEN_DELAY",650,{relationshipFlagEq:{trustBroken:true},contextEq:{privacy:"public"},focusAny:["trust","relationship"]},["REQUEST_TIME"],"public_trust_broken_delay");
  add("R1485_HIGH_DANGER_RECENT_CONCERN",900,{contextMin:{dangerLevel:70},historyRecentAny:["EXPRESS_CONCERN"],historyRecentWindow:3},["REASSURE_SAFETY"],"high_danger_after_concern");
  add("R1486_HIGH_DANGER_RECENT_SAFETY",890,{contextMin:{dangerLevel:70},historyRecentAny:["REASSURE_SAFETY"],historyRecentWindow:3},["EXPRESS_CONCERN"],"high_danger_after_safety");
  add("R1487_URGENT_RECENT_HELP",820,{contextMin:{urgency:75},historyRecentAny:["OFFER_HELP"],historyRecentWindow:3},["EXPRESS_CARE"],"urgent_after_help");
  add("R1488_PRIVATE_RECENT_REPAIR",650,{contextEq:{privacy:"private"},historyRecentAny:["ASK_TO_REPAIR","EXPRESS_REPAIR_DESIRE"],historyRecentWindow:4},["EXPRESS_CARE"],"private_after_repair");
  add("R1489_PUBLIC_RECENT_REPAIR",610,{contextEq:{privacy:"public"},historyRecentAny:["ASK_TO_REPAIR","EXPRESS_REPAIR_DESIRE"],historyRecentWindow:4},["REQUEST_TIME"],"public_after_repair");
  add("R1490_CLOSING_RECENT_BOUNDARY",999,{contextEq:{conversationPhase:"closing"},historyRecentAny:["RESPECT_BOUNDARY"],historyRecentWindow:3,boundaryAny:["leave_me_alone","stop_conversation"]},["RESPECT_BOUNDARY"],"closing_after_boundary");
  add("R1491_OPENING_RECENT_GOODBYE",550,{contextEq:{conversationPhase:"opening"},historyRecentAny:["SAY_GOODBYE_TEMPORARY"],historyRecentWindow:4,intentAny:["greet"]},["EXPRESS_JOY"],"opening_after_temporary_goodbye");
  add("R1492_HOME_HIGH_GOODWILL_HURT",640,{contextEq:{locationType:"home"},relationshipMin:{goodwill:70},intentAny:["express_hurt"]},["EXPRESS_CONCERN"],"home_high_goodwill_hurt");
  add("R1493_WORK_HIGH_TRUST_PRIVATE_TOPIC",590,{contextEq:{locationType:"work"},relationshipMin:{trust:70},focusAny:["relationship","love"]},["EXPRESS_CARE"],"work_high_trust_private_topic");
  add("R1494_STREET_HIGH_DANGER_PARTNER",920,{contextEq:{locationType:"street"},contextMin:{dangerLevel:70},relationshipEq:{stage:"partner"}},["EXPRESS_CONCERN","EXPRESS_CARE"],"street_danger_partner");
  add("R1495_NIGHT_PARTNER_GOODBYE",600,{contextEq:{timeOfDay:"night"},relationshipEq:{stage:"partner"},intentAny:["say_goodbye"]},["EXPRESS_MISSING"],"night_partner_goodbye");
  add("R1496_NIGHT_LONELY_HIGH_GOODWILL",600,{contextEq:{timeOfDay:"night"},relationshipMin:{goodwill:70},intentAny:["express_loneliness"],boundaryNone:["leave_me_alone"]},["OFFER_COMPANY"],"night_loneliness_high_goodwill");
  add("R1497_PUBLIC_BOUNDARY_ALWAYS",999,{contextEq:{privacy:"public"},boundaryAny:["do_not_contact","do_not_touch","stop_conversation"]},["RESPECT_BOUNDARY"],"public_boundary_priority");
  add("R1498_PRIVATE_BOUNDARY_ALWAYS",999,{contextEq:{privacy:"private"},boundaryAny:["do_not_contact","do_not_touch","stop_conversation"]},["RESPECT_BOUNDARY"],"private_boundary_priority");
  add("R1499_DANGER_BOUNDARY_ALWAYS",999,{contextMin:{dangerLevel:70},boundaryAny:["leave_me_alone","do_not_follow","do_not_touch","do_not_contact","stop_conversation"]},["RESPECT_BOUNDARY"],"danger_boundary_priority");
  add("R1500_URGENCY_BOUNDARY_ALWAYS",999,{contextMin:{urgency:75},boundaryAny:["leave_me_alone","do_not_follow","do_not_touch","do_not_contact","stop_conversation"]},["RESPECT_BOUNDARY"],"urgency_boundary_priority");

  if (R.length !== 100) throw new Error("Expected 100 response rules, got " + R.length);
  HMW.Dialogue.registerResponseRules(R);
})();