(() => {
  "use strict";
  window.HMW = window.HMW || {};
  HMW.Dialogue = HMW.Dialogue || {};

  const R = [];
  const add = (id, priority, when, meanings, reason=id) =>
    R.push({ id, priority, when, meanings, reason });

  // First meeting / reunion context.
  add("R1501_FIRST_MEETING_GREETING",570,{intentAny:["greet"],contextEq:{firstMeeting:true}},["RETURN_GREETING"],"first_meeting_greeting");
  add("R1502_FIRST_MEETING_IDENTITY",560,{questionAny:{kindAny:["identity"]},contextEq:{firstMeeting:true}},["EXPRESS_NEED_CLARITY"],"first_meeting_identity");
  add("R1503_FIRST_MEETING_PERSONAL",620,{focusAny:["love","relationship","trust"],contextEq:{firstMeeting:true}},["EXPRESS_NEED_CLARITY"],"first_meeting_personal_topic");
  add("R1504_FIRST_MEETING_HELP",540,{intentAny:["ask_for_help"],contextEq:{firstMeeting:true}},["OFFER_HELP"],"first_meeting_help");
  add("R1505_FIRST_MEETING_CONTACT",590,{intentAny:["request_contact"],contextEq:{firstMeeting:true}},["EXPRESS_NEED_CLARITY"],"first_meeting_contact");
  add("R1506_REUNION_GREETING",590,{intentAny:["greet"],contextEq:{reunion:true}},["EXPRESS_JOY"],"reunion_greeting");
  add("R1507_REUNION_CLOSE",610,{intentAny:["greet"],contextEq:{reunion:true},relationshipMin:{familiarity:70,goodwill:70}},["EXPRESS_JOY","EXPRESS_CARE"],"reunion_close");
  add("R1508_REUNION_AFTER_GOODBYE",600,{intentAny:["greet"],contextEq:{reunion:true},historyRecentAny:["SAY_GOODBYE","SAY_GOODBYE_TEMPORARY"],historyRecentWindow:6},["EXPRESS_JOY"],"reunion_after_goodbye");
  add("R1509_REUNION_AFTER_MISSING",610,{intentAny:["greet"],contextEq:{reunion:true},historyRecentAny:["EXPRESS_MISSING"],historyRecentWindow:6},["EXPRESS_CARE"],"reunion_after_missing");
  add("R1510_REUNION_CONFLICT",620,{intentAny:["greet"],contextEq:{reunion:true},relationshipFlagEq:{conflict:true}},["EXPRESS_NEED_CLARITY"],"reunion_with_conflict");

  // Time pressure / availability / must-leave context.
  add("R1511_TIME_PRESSURE_TALK",800,{intentAny:["ask_to_talk"],contextEq:{timePressure:true}},["DECLINE_REQUEST","REQUEST_TIME"],"time_pressure_talk");
  add("R1512_TIME_PRESSURE_MEET",800,{intentAny:["ask_to_meet"],contextEq:{timePressure:true}},["REQUEST_TIME"],"time_pressure_meet");
  add("R1513_TIME_PRESSURE_REPORT",590,{intentAny:["report_event"],contextEq:{timePressure:true}},["ACKNOWLEDGE_EVENT"],"time_pressure_report");
  add("R1514_TIME_PRESSURE_QUESTION",600,{intentAny:["ask_question"],contextEq:{timePressure:true}},["EXPRESS_NEED_CLARITY"],"time_pressure_question");
  add("R1515_MUST_LEAVE_TALK",820,{intentAny:["ask_to_talk"],contextEq:{mustLeaveNow:true}},["DECLINE_REQUEST","REQUEST_TIME"],"must_leave_talk");
  add("R1516_MUST_LEAVE_MEET",820,{intentAny:["ask_to_meet"],contextEq:{mustLeaveNow:true}},["DECLINE_REQUEST","REQUEST_TIME"],"must_leave_meet");
  add("R1517_MUST_LEAVE_STAY",820,{intentAny:["request_stay"],contextEq:{mustLeaveNow:true}},["DECLINE_REQUEST","REQUEST_TIME"],"must_leave_stay");
  add("R1518_MUST_LEAVE_GOODBYE",600,{intentAny:["say_goodbye"],contextEq:{mustLeaveNow:true}},["SAY_GOODBYE"],"must_leave_goodbye");
  add("R1519_NOT_AVAILABLE_MEET",810,{intentAny:["ask_to_meet"],contextEq:{availableNow:false}},["DECLINE_REQUEST","REQUEST_TIME"],"not_available_meet");
  add("R1520_AVAILABLE_MEET",600,{intentAny:["ask_to_meet"],contextEq:{availableNow:true},policyEq:{willingToMeet:true},boundaryNone:["leave_me_alone","do_not_visit"]},["AGREE_REQUEST"],"available_meet");

  // Crowded / noisy / interrupted context.
  add("R1521_CROWDED_RELATIONSHIP",600,{focusAny:["love","relationship","trust"],contextEq:{crowded:true}},["EXPRESS_NEED_CLARITY"],"crowded_relationship_topic");
  add("R1522_CROWDED_APOLOGY",590,{intentAny:["apologize"],contextEq:{crowded:true}},["REQUEST_TIME"],"crowded_apology");
  add("R1523_CROWDED_HURT",590,{intentAny:["express_hurt"],contextEq:{crowded:true}},["REQUEST_TIME"],"crowded_hurt");
  add("R1524_CROWDED_REASSURE",600,{intentAny:["request_reassurance","seek_reassurance"],contextEq:{crowded:true}},["EXPRESS_CARE"],"crowded_reassurance");
  add("R1525_NOISY_QUESTION",590,{intentAny:["ask_question"],contextEq:{noisy:true}},["EXPRESS_NEED_CLARITY"],"noisy_question");
  add("R1526_NOISY_TALK",610,{intentAny:["ask_to_talk"],contextEq:{noisy:true}},["REQUEST_TIME"],"noisy_talk");
  add("R1527_NOISY_REPORT",560,{intentAny:["report_event"],contextEq:{noisy:true}},["ACKNOWLEDGE_EVENT"],"noisy_report");
  add("R1528_INTERRUPTED_REPAIR",620,{focusAny:["apology","relationship"],contextEq:{interrupted:true}},["REQUEST_TIME"],"interrupted_repair");
  add("R1529_INTERRUPTED_REASSURE",610,{intentAny:["request_reassurance","seek_reassurance"],contextEq:{interrupted:true}},["EXPRESS_CARE"],"interrupted_reassurance");
  add("R1530_INTERRUPTED_GOODBYE",540,{intentAny:["say_goodbye"],contextEq:{interrupted:true}},["SAY_GOODBYE_TEMPORARY"],"interrupted_goodbye");

  // Turn count and topic persistence.
  add("R1531_EARLY_TURN_GREETING",520,{intentAny:["greet"],contextMax:{turnCount:2}},["RETURN_GREETING"],"early_turn_greeting");
  add("R1532_EARLY_TURN_PERSONAL",590,{focusAny:["love","relationship","trust"],contextMax:{turnCount:2}},["EXPRESS_NEED_CLARITY"],"early_turn_personal_topic");
  add("R1533_MID_TURN_REPORT",520,{intentAny:["report_event"],contextMin:{turnCount:3},contextMax:{turnCount:8}},["ACKNOWLEDGE_EVENT"],"mid_turn_report");
  add("R1534_LONG_CONVERSATION_CARE",550,{contextMin:{turnCount:9},relationshipMin:{goodwill:60},intentAny:["report_event","report_condition"]},["EXPRESS_CARE"],"long_conversation_care");
  add("R1535_LONG_CONVERSATION_HURT",620,{contextMin:{turnCount:9},intentAny:["express_hurt"]},["EXPRESS_CONCERN"],"long_conversation_hurt");
  add("R1536_LONG_CONVERSATION_GOODBYE",560,{contextMin:{turnCount:9},intentAny:["say_goodbye"]},["SAY_GOODBYE_TEMPORARY"],"long_conversation_goodbye");
  add("R1537_SAME_TOPIC_2",540,{contextMin:{sameTopicTurns:2},intentAny:["report_event"]},["ACKNOWLEDGE_EVENT"],"same_topic_two_turns");
  add("R1538_SAME_TOPIC_3_QUESTION",590,{contextMin:{sameTopicTurns:3},intentAny:["ask_question"]},["ASK_FOR_DETAILS"],"same_topic_three_turns_question");
  add("R1539_SAME_TOPIC_3_HURT",610,{contextMin:{sameTopicTurns:3},intentAny:["express_hurt"]},["ASK_TO_TALK"],"same_topic_three_turns_hurt");
  add("R1540_SAME_TOPIC_4_RELATIONSHIP",620,{contextMin:{sameTopicTurns:4},focusAny:["relationship","love","trust"]},["EXPRESS_CARE"],"same_topic_four_relationship");

  // Explicit topic shift / subject continuity.
  add("R1541_TOPIC_SHIFT_REQUESTED",560,{contextEq:{topicShiftRequested:true}},["EXPRESS_NEED_CLARITY"],"topic_shift_requested");
  add("R1542_TOPIC_SHIFT_AFTER_HURT",600,{contextEq:{topicShiftRequested:true},historyRecentAny:["EXPRESS_CONCERN","EXPRESS_HURT"],historyRecentWindow:4},["EXPRESS_CARE"],"topic_shift_after_hurt");
  add("R1543_TOPIC_SHIFT_AFTER_CONFLICT",610,{contextEq:{topicShiftRequested:true},relationshipFlagEq:{conflict:true}},["REQUEST_TIME"],"topic_shift_after_conflict");
  add("R1544_CONTINUE_SAME_TOPIC",540,{contextEq:{continueTopic:true},intentAny:["report_event"]},["ACKNOWLEDGE_EVENT"],"continue_same_topic");
  add("R1545_CONTINUE_RELATIONSHIP_TOPIC",600,{contextEq:{continueTopic:true},focusAny:["relationship","love","trust"]},["EXPRESS_CARE"],"continue_relationship_topic");
  add("R1546_CONTINUE_HEALTH_TOPIC",590,{contextEq:{continueTopic:true},focusAny:["health","injury","illness"]},["ASK_IF_OKAY"],"continue_health_topic");
  add("R1547_CONTINUE_WORK_TOPIC",550,{contextEq:{continueTopic:true},focusAny:["work","job"]},["ASK_ABOUT_WORK"],"continue_work_topic");
  add("R1548_CONTINUE_MONEY_TOPIC",560,{contextEq:{continueTopic:true},focusAny:["money","rent"]},["ASK_ABOUT_MONEY"],"continue_money_topic");
  add("R1549_CONTINUE_HOME_TOPIC",550,{contextEq:{continueTopic:true},focusAny:["home","shelter"]},["ASK_ABOUT_HOME"],"continue_home_topic");
  add("R1550_CONTINUE_RETURN_TOPIC",550,{contextEq:{continueTopic:true},focusAny:["return"]},["ASK_IF_COMING_BACK"],"continue_return_topic");

  // Relationship stage x context.
  add("R1551_STRANGER_PUBLIC",550,{relationshipEq:{stage:"stranger"},contextEq:{privacy:"public"},intentAny:["greet","ask_question"]},["RETURN_GREETING"],"stranger_public");
  add("R1552_STRANGER_PRIVATE_PERSONAL",610,{relationshipEq:{stage:"stranger"},contextEq:{privacy:"private"},focusAny:["love","relationship","trust"]},["EXPRESS_NEED_CLARITY"],"stranger_private_personal");
  add("R1553_FRIEND_PRIVATE_HURT",630,{relationshipEq:{stage:"friend"},contextEq:{privacy:"private"},intentAny:["express_hurt"]},["EXPRESS_CONCERN"],"friend_private_hurt");
  add("R1554_FRIEND_PUBLIC_HURT",590,{relationshipEq:{stage:"friend"},contextEq:{privacy:"public"},intentAny:["express_hurt"]},["REQUEST_TIME"],"friend_public_hurt");
  add("R1555_CLOSE_PRIVATE_REPAIR",650,{relationshipEq:{stage:"close"},contextEq:{privacy:"private"},relationshipFlagEq:{conflict:true}},["ASK_TO_REPAIR"],"close_private_repair");
  add("R1556_CLOSE_PUBLIC_REPAIR",610,{relationshipEq:{stage:"close"},contextEq:{privacy:"public"},relationshipFlagEq:{conflict:true}},["REQUEST_TIME"],"close_public_repair");
  add("R1557_ROMANTIC_PRIVATE_REASSURE",690,{relationshipEq:{stage:"romantic"},contextEq:{privacy:"private"},intentAny:["request_reassurance","seek_reassurance"]},["EXPRESS_CARE"],"romantic_private_reassure");
  add("R1558_ROMANTIC_PUBLIC_REASSURE",630,{relationshipEq:{stage:"romantic"},contextEq:{privacy:"public"},intentAny:["request_reassurance","seek_reassurance"]},["EXPRESS_CARE"],"romantic_public_reassure");
  add("R1559_PARTNER_PRIVATE_REPAIR",700,{relationshipEq:{stage:"partner"},contextEq:{privacy:"private"},relationshipFlagEq:{conflict:true}},["ASK_TO_REPAIR"],"partner_private_repair");
  add("R1560_PARTNER_PUBLIC_REPAIR",640,{relationshipEq:{stage:"partner"},contextEq:{privacy:"public"},relationshipFlagEq:{conflict:true}},["REQUEST_TIME"],"partner_public_repair");

  // History + context exceptions.
  add("R1561_RECENT_LOVE_PUBLIC",600,{contextEq:{privacy:"public"},historyRecentAny:["AFFIRM_LOVE"],historyRecentWindow:4,focusAny:["love"]},["EXPRESS_CARE"],"recent_love_public");
  add("R1562_RECENT_LOVE_PRIVATE",640,{contextEq:{privacy:"private"},historyRecentAny:["AFFIRM_LOVE"],historyRecentWindow:4,focusAny:["love"]},["EXPRESS_CARE"],"recent_love_private");
  add("R1563_RECENT_TRUST_PUBLIC",600,{contextEq:{privacy:"public"},historyRecentAny:["CONFIRM_TRUST"],historyRecentWindow:4,focusAny:["trust"]},["EXPRESS_CARE"],"recent_trust_public");
  add("R1564_RECENT_TRUST_PRIVATE",630,{contextEq:{privacy:"private"},historyRecentAny:["CONFIRM_TRUST"],historyRecentWindow:4,focusAny:["trust"]},["EXPRESS_CARE"],"recent_trust_private");
  add("R1565_RECENT_REPAIR_PUBLIC",610,{contextEq:{privacy:"public"},historyRecentAny:["ASK_TO_REPAIR","EXPRESS_REPAIR_DESIRE"],historyRecentWindow:4},["REQUEST_TIME"],"recent_repair_public");
  add("R1566_RECENT_REPAIR_PRIVATE",640,{contextEq:{privacy:"private"},historyRecentAny:["ASK_TO_REPAIR","EXPRESS_REPAIR_DESIRE"],historyRecentWindow:4},["EXPRESS_CARE"],"recent_repair_private");
  add("R1567_RECENT_BOUNDARY_PUBLIC",999,{contextEq:{privacy:"public"},historyRecentAny:["RESPECT_BOUNDARY"],historyRecentWindow:4,boundaryAny:["leave_me_alone","stop_conversation","do_not_contact"]},["RESPECT_BOUNDARY"],"recent_boundary_public");
  add("R1568_RECENT_BOUNDARY_PRIVATE",999,{contextEq:{privacy:"private"},historyRecentAny:["RESPECT_BOUNDARY"],historyRecentWindow:4,boundaryAny:["leave_me_alone","stop_conversation","do_not_contact"]},["RESPECT_BOUNDARY"],"recent_boundary_private");
  add("R1569_RECENT_UNKNOWN_TIME_PRESSURE",620,{contextEq:{timePressure:true},historyRecentAny:["ANSWER_UNKNOWN"],historyRecentWindow:4,intentAny:["ask_question"]},["ASK_FOR_DETAILS"],"recent_unknown_time_pressure");
  add("R1570_RECENT_GOODBYE_REUNION",590,{contextEq:{reunion:true},historyRecentAny:["SAY_GOODBYE_TEMPORARY","EXPRESS_MISSING"],historyRecentWindow:6},["EXPRESS_JOY"],"recent_goodbye_reunion");

  // Immediate context blockers and precedence.
  add("R1571_CONTEXT_BLOCK_MEET_UNAVAILABLE",900,{intentAny:["ask_to_meet"],contextEq:{availableNow:false}},["DECLINE_REQUEST","REQUEST_TIME"],"context_blocks_meet_unavailable");
  add("R1572_CONTEXT_BLOCK_MEET_LEAVING",910,{intentAny:["ask_to_meet"],contextEq:{mustLeaveNow:true}},["DECLINE_REQUEST","REQUEST_TIME"],"context_blocks_meet_leaving");
  add("R1573_CONTEXT_BLOCK_TALK_TIME",910,{intentAny:["ask_to_talk"],contextEq:{timePressure:true}},["DECLINE_REQUEST","REQUEST_TIME"],"context_blocks_talk_time");
  add("R1574_CONTEXT_BLOCK_TALK_FREE",920,{intentAny:["ask_to_talk"],contextEq:{canTalkFreely:false}},["DECLINE_REQUEST","REQUEST_TIME"],"context_blocks_talk_privacy");
  add("R1575_CONTEXT_BLOCK_STAY_LEAVING",910,{intentAny:["request_stay"],contextEq:{mustLeaveNow:true}},["DECLINE_REQUEST","REQUEST_TIME"],"context_blocks_stay_leaving");
  add("R1576_CONTEXT_BOUNDARY_MEET",999,{intentAny:["ask_to_meet"],boundaryAny:["leave_me_alone","do_not_visit","stop_conversation"]},["RESPECT_BOUNDARY","DECLINE_REQUEST"],"context_boundary_meet");
  add("R1577_CONTEXT_BOUNDARY_TALK",999,{intentAny:["ask_to_talk"],boundaryAny:["stop_conversation","do_not_ask"]},["RESPECT_BOUNDARY","DECLINE_REQUEST"],"context_boundary_talk");
  add("R1578_CONTEXT_BOUNDARY_STAY",999,{intentAny:["request_stay"],boundaryAny:["leave_me_alone","stop_conversation"]},["RESPECT_BOUNDARY","DECLINE_REQUEST"],"context_boundary_stay");
  add("R1579_CONTEXT_BOUNDARY_CONTACT",999,{intentAny:["request_contact"],boundaryAny:["do_not_contact","do_not_call","do_not_message"]},["RESPECT_BOUNDARY","DECLINE_CONTACT"],"context_boundary_contact");
  add("R1580_CONTEXT_NO_CONTACT_FLAG",999,{intentAny:["request_contact"],relationshipFlagEq:{noContact:true}},["RESPECT_BOUNDARY","DECLINE_CONTACT"],"context_no_contact_flag");

  // Context-sensitive daily care.
  add("R1581_HOME_HUNGER_PRIVATE",570,{focusAny:["food","hunger"],contextEq:{locationType:"home",privacy:"private"},policyEq:{canOfferFood:true}},["OFFER_FOOD"],"home_private_hunger");
  add("R1582_HOME_THIRST_PRIVATE",570,{focusAny:["water","thirst"],contextEq:{locationType:"home",privacy:"private"},policyEq:{canOfferWater:true}},["OFFER_DRINK"],"home_private_thirst");
  add("R1583_HOME_TIRED_PRIVATE",560,{focusAny:["sleep","tiredness"],contextEq:{locationType:"home",privacy:"private"}},["OFFER_REST"],"home_private_tired");
  add("R1584_STREET_HUNGER",560,{focusAny:["food","hunger"],contextEq:{locationType:"street"},policyEq:{canOfferFood:true}},["OFFER_FOOD"],"street_hunger");
  add("R1585_STREET_THIRST",560,{focusAny:["water","thirst"],contextEq:{locationType:"street"},policyEq:{canOfferWater:true}},["OFFER_DRINK"],"street_thirst");
  add("R1586_STREET_TIRED",550,{focusAny:["sleep","tiredness"],contextEq:{locationType:"street"}},["ASK_TO_REST"],"street_tired");
  add("R1587_WORK_TIRED",540,{focusAny:["sleep","tiredness"],contextEq:{locationType:"work"}},["EXPRESS_WORK_TIREDNESS"],"work_tired");
  add("R1588_TRANSIT_TIRED",540,{focusAny:["sleep","tiredness"],contextEq:{locationType:"transit"}},["EXPRESS_TIRED"],"transit_tired");
  add("R1589_NIGHT_HUNGER",550,{focusAny:["food","hunger"],contextEq:{timeOfDay:"night"},policyEq:{canOfferFood:true}},["OFFER_FOOD"],"night_hunger");
  add("R1590_NIGHT_COLD",560,{focusAny:["weather"],contextEq:{timeOfDay:"night"}},["OFFER_WARMTH"],"night_cold");

  // Relationship + context + fact consistency.
  add("R1591_PRIVATE_LOVE_TRUE",850,{focusAny:["love"],factEq:{lovesHeroine:true},contextEq:{privacy:"private"}},["AFFIRM_LOVE"],"private_love_true");
  add("R1592_PUBLIC_LOVE_TRUE",830,{focusAny:["love"],factEq:{lovesHeroine:true},contextEq:{privacy:"public"}},["AFFIRM_LOVE"],"public_love_true");
  add("R1593_PRIVATE_TRUST_TRUE",830,{focusAny:["trust"],factEq:{trustsHeroine:true},contextEq:{privacy:"private"}},["CONFIRM_TRUST"],"private_trust_true");
  add("R1594_PUBLIC_TRUST_TRUE",810,{focusAny:["trust"],factEq:{trustsHeroine:true},contextEq:{privacy:"public"}},["CONFIRM_TRUST"],"public_trust_true");
  add("R1595_PRIVATE_BETRAY_FALSE",850,{focusAny:["betrayal"],factEq:{intendsBetrayal:false},contextEq:{privacy:"private"}},["DENY_BETRAYAL"],"private_betrayal_false");
  add("R1596_PUBLIC_BETRAY_FALSE",830,{focusAny:["betrayal"],factEq:{intendsBetrayal:false},contextEq:{privacy:"public"}},["DENY_BETRAYAL"],"public_betrayal_false");
  add("R1597_PRIVATE_NOT_ABANDON",840,{focusAny:["abandonment"],factEq:{willAbandonHeroine:false},contextEq:{privacy:"private"}},["DENY_ABANDONMENT","REASSURE_NOT_LEAVING"],"private_not_abandoning");
  add("R1598_PUBLIC_NOT_ABANDON",820,{focusAny:["abandonment"],factEq:{willAbandonHeroine:false},contextEq:{privacy:"public"}},["DENY_ABANDONMENT"],"public_not_abandoning");
  add("R1599_TRUST_BROKEN_PRIVATE_FACT_TRUE",860,{relationshipFlagEq:{trustBroken:true},factEq:{trustsHeroine:true},contextEq:{privacy:"private"},focusAny:["trust"]},["CONFIRM_TRUST","ASK_TO_REPAIR"],"trust_broken_private_fact_true");
  add("R1600_CONFLICT_PUBLIC_FACT_LOVE",860,{relationshipFlagEq:{conflict:true},factEq:{lovesHeroine:true},contextEq:{privacy:"public"},focusAny:["love","relationship"]},["AFFIRM_LOVE","REQUEST_TIME"],"conflict_public_love_true");

  if (R.length !== 100) throw new Error("Expected 100 response rules, got " + R.length);
  HMW.Dialogue.registerResponseRules(R);
})();