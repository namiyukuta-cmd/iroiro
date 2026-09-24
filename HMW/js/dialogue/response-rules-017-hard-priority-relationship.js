(() => {
  "use strict";
  window.HMW = window.HMW || {};
  HMW.Dialogue = HMW.Dialogue || {};

  const R = [];
  const add = (id, priority, when, meanings, reason=id, suppressMeanings=[]) =>
    R.push({ id, priority, when, meanings, reason, suppressMeanings });

  // Hard priority exceptions: impossible or explicitly blocked actions suppress lower approvals.
  add("R1601_UNAVAILABLE_MEET_HARD",1100,{intentAny:["ask_to_meet"],contextEq:{availableNow:false}},["DECLINE_REQUEST","REQUEST_TIME"],"unavailable_meet_hard",["AGREE_REQUEST"]);
  add("R1602_LEAVING_MEET_HARD",1100,{intentAny:["ask_to_meet"],contextEq:{mustLeaveNow:true}},["DECLINE_REQUEST","REQUEST_TIME"],"leaving_meet_hard",["AGREE_REQUEST"]);
  add("R1603_TIME_TALK_HARD",1100,{intentAny:["ask_to_talk"],contextEq:{timePressure:true}},["DECLINE_REQUEST","REQUEST_TIME"],"time_pressure_talk_hard",["AGREE_REQUEST"]);
  add("R1604_PRIVACY_TALK_HARD",1100,{intentAny:["ask_to_talk"],contextEq:{canTalkFreely:false}},["DECLINE_REQUEST","REQUEST_TIME"],"privacy_blocks_talk_hard",["AGREE_REQUEST"]);
  add("R1605_LEAVING_STAY_HARD",1100,{intentAny:["request_stay"],contextEq:{mustLeaveNow:true}},["DECLINE_REQUEST","REQUEST_TIME"],"leaving_blocks_stay_hard",["AGREE_REQUEST"]);
  add("R1606_NO_CONTACT_HARD",1150,{intentAny:["request_contact"],relationshipFlagEq:{noContact:true}},["RESPECT_BOUNDARY","DECLINE_CONTACT"],"no_contact_hard",["ACCEPT_CONTACT","OFFER_CONTACT"]);
  add("R1607_DISTANCE_CONTACT_HARD",1140,{intentAny:["request_contact"],relationshipFlagEq:{distanceRequested:true}},["RESPECT_BOUNDARY","ACCEPT_DISTANCE","DECLINE_CONTACT"],"distance_contact_hard",["ACCEPT_CONTACT","OFFER_CONTACT"]);
  add("R1608_DISTANCE_MEET_HARD",1140,{intentAny:["ask_to_meet"],relationshipFlagEq:{distanceRequested:true}},["RESPECT_BOUNDARY","ACCEPT_DISTANCE","DECLINE_REQUEST"],"distance_meet_hard",["AGREE_REQUEST"]);
  add("R1609_DISTANCE_STAY_HARD",1140,{intentAny:["request_stay"],relationshipFlagEq:{distanceRequested:true}},["RESPECT_BOUNDARY","ACCEPT_DISTANCE","DECLINE_REQUEST"],"distance_stay_hard",["AGREE_REQUEST"]);
  add("R1610_STOP_TALK_HARD",1160,{intentAny:["ask_to_talk"],boundaryAny:["stop_conversation","do_not_ask"]},["RESPECT_BOUNDARY","DECLINE_REQUEST"],"stop_talk_hard",["AGREE_REQUEST","ASK_TO_TALK"]);
  add("R1611_NO_VISIT_MEET_HARD",1160,{intentAny:["ask_to_meet"],boundaryAny:["do_not_visit","leave_me_alone"]},["RESPECT_BOUNDARY","DECLINE_REQUEST"],"no_visit_meet_hard",["AGREE_REQUEST"]);
  add("R1612_NO_CONTACT_REQUEST_HARD",1160,{intentAny:["request_contact"],boundaryAny:["do_not_contact","do_not_call","do_not_message"]},["RESPECT_BOUNDARY","DECLINE_CONTACT"],"explicit_no_contact_hard",["ACCEPT_CONTACT","OFFER_CONTACT"]);
  add("R1613_NO_TOUCH_PERMISSION_HARD",1160,{questionAny:{kindAny:["permission"],actionAny:["touch"]},boundaryAny:["do_not_touch"]},["RESPECT_BOUNDARY","DENY_PERMISSION"],"no_touch_permission_hard",["GRANT_PERMISSION"]);
  add("R1614_NO_HUG_PERMISSION_HARD",1160,{questionAny:{kindAny:["permission"],actionAny:["hug"]},boundaryAny:["do_not_hug","do_not_touch"]},["RESPECT_BOUNDARY","DENY_PERMISSION"],"no_hug_permission_hard",["GRANT_PERMISSION"]);
  add("R1615_NO_KISS_PERMISSION_HARD",1160,{questionAny:{kindAny:["permission"],actionAny:["kiss"]},boundaryAny:["do_not_kiss","do_not_touch"]},["RESPECT_BOUNDARY","DENY_PERMISSION"],"no_kiss_permission_hard",["GRANT_PERMISSION"]);
  add("R1616_NO_TOUCH_REQUEST_HARD",1160,{questionAny:{kindAny:["request_action"],actionAny:["touch"]},boundaryAny:["do_not_touch"]},["RESPECT_BOUNDARY","DECLINE_ACTION_REQUEST"],"no_touch_request_hard",["ACCEPT_ACTION_REQUEST"]);
  add("R1617_NO_HUG_REQUEST_HARD",1160,{questionAny:{kindAny:["request_action"],actionAny:["hug"]},boundaryAny:["do_not_hug","do_not_touch"]},["RESPECT_BOUNDARY","DECLINE_ACTION_REQUEST"],"no_hug_request_hard",["ACCEPT_ACTION_REQUEST"]);
  add("R1618_NO_KISS_REQUEST_HARD",1160,{questionAny:{kindAny:["request_action"],actionAny:["kiss"]},boundaryAny:["do_not_kiss","do_not_touch"]},["RESPECT_BOUNDARY","DECLINE_ACTION_REQUEST"],"no_kiss_request_hard",["ACCEPT_ACTION_REQUEST"]);
  add("R1619_NO_ENTRY_HARD",1160,{questionAny:{kindAny:["permission","request_action"],actionAny:["enter"]},boundaryAny:["do_not_enter"]},["RESPECT_BOUNDARY","DENY_PERMISSION","DECLINE_ACTION_REQUEST"],"no_entry_hard",["GRANT_PERMISSION","ACCEPT_ACTION_REQUEST"]);
  add("R1620_NO_FOLLOW_HARD",1160,{questionAny:{kindAny:["permission","request_action"],actionAny:["follow"]},boundaryAny:["do_not_follow"]},["RESPECT_BOUNDARY","DENY_PERMISSION","DECLINE_ACTION_REQUEST"],"no_follow_hard",["GRANT_PERMISSION","ACCEPT_ACTION_REQUEST"]);

  // Relationship state progression / regression and repair.
  add("R1621_CONFLICT_HURT_CLOSE",700,{relationshipFlagEq:{conflict:true},relationshipMin:{familiarity:70},intentAny:["express_hurt"]},["ASK_TO_REPAIR","EXPRESS_CONCERN"],"conflict_hurt_close");
  add("R1622_CONFLICT_ANGER_CLOSE",690,{relationshipFlagEq:{conflict:true},relationshipMin:{familiarity:70},intentAny:["express_anger"]},["ASK_TO_TALK","REQUEST_TIME"],"conflict_anger_close");
  add("R1623_CONFLICT_APOLOGY_HIGH_CONSCIENCE",720,{relationshipFlagEq:{conflict:true},relationshipMin:{conscience:70},intentAny:["apologize"]},["EXPRESS_REPAIR_DESIRE"],"conflict_apology_high_conscience");
  add("R1624_RECONCILING_HURT",680,{relationshipFlagEq:{reconciling:true},intentAny:["express_hurt"]},["EXPRESS_CARE","ASK_TO_REPAIR"],"reconciling_hurt");
  add("R1625_RECONCILING_ANGER",670,{relationshipFlagEq:{reconciling:true},intentAny:["express_anger"]},["ASK_TO_TALK"],"reconciling_anger");
  add("R1626_RECONCILING_APOLOGY",700,{relationshipFlagEq:{reconciling:true},intentAny:["apologize"]},["EXPRESS_REPAIR_DESIRE"],"reconciling_apology");
  add("R1627_REPAIRED_REASSURANCE",650,{relationshipFlagEq:{repaired:true},intentAny:["request_reassurance","seek_reassurance"]},["EXPRESS_CARE","EXPRESS_RELIEF"],"repaired_reassurance");
  add("R1628_REPAIRED_HURT",620,{relationshipFlagEq:{repaired:true},intentAny:["express_hurt"]},["EXPRESS_CONCERN"],"repaired_hurt");
  add("R1629_STABLE_REASSURANCE_HIGH_TRUST",670,{relationshipFlagEq:{stable:true},relationshipMin:{trust:70},intentAny:["request_reassurance","seek_reassurance"]},["CONFIRM_TRUST","EXPRESS_CARE"],"stable_high_trust_reassurance");
  add("R1630_STABLE_JEALOUSY",640,{relationshipFlagEq:{stable:true},intentAny:["express_jealousy"]},["EXPRESS_CARE","ASK_ABOUT_OTHER_PERSON"],"stable_jealousy");
  add("R1631_TRUST_BROKEN_HURT",720,{relationshipFlagEq:{trustBroken:true},intentAny:["express_hurt"]},["ASK_TO_REPAIR","EXPRESS_CONCERN"],"trust_broken_hurt");
  add("R1632_TRUST_BROKEN_DISTRUST",720,{relationshipFlagEq:{trustBroken:true},emotionMin:{distrust:50}},["ASK_TO_REPAIR","ASK_FOR_HONEST_ANSWER"],"trust_broken_distrust");
  add("R1633_TRUST_BROKEN_APOLOGY",730,{relationshipFlagEq:{trustBroken:true},intentAny:["apologize"]},["EXPRESS_REPAIR_DESIRE","ASK_TO_REPAIR"],"trust_broken_apology");
  add("R1634_EXCLUSIVE_JEALOUSY",690,{relationshipFlagEq:{exclusive:true},emotionMin:{jealousy:50}},["CONFIRM_CHOICE","EXPRESS_CARE"],"exclusive_jealousy");
  add("R1635_DATING_HURT",650,{relationshipFlagEq:{dating:true},intentAny:["express_hurt"]},["EXPRESS_CONCERN","ASK_TO_TALK"],"dating_hurt");
  add("R1636_DATING_REASSURE",660,{relationshipFlagEq:{dating:true},intentAny:["request_reassurance","seek_reassurance"]},["EXPRESS_CARE"],"dating_reassurance");
  add("R1637_ROMANTIC_HURT",660,{relationshipFlagEq:{romantic:true},intentAny:["express_hurt"]},["EXPRESS_CONCERN","ASK_TO_REPAIR"],"romantic_hurt");
  add("R1638_ROMANTIC_REASSURE",670,{relationshipFlagEq:{romantic:true},intentAny:["request_reassurance","seek_reassurance"]},["EXPRESS_CARE"],"romantic_reassure");
  add("R1639_DISTANCE_REQUESTED_REASSURE",700,{relationshipFlagEq:{distanceRequested:true},intentAny:["request_reassurance","seek_reassurance"]},["ACCEPT_DISTANCE","EXPRESS_CARE"],"distance_requested_reassure");
  add("R1640_NO_CONTACT_REASSURE",710,{relationshipFlagEq:{noContact:true},intentAny:["request_reassurance","seek_reassurance"]},["RESPECT_BOUNDARY","EXPRESS_CARE"],"no_contact_reassure");

  // Promise / past / future continuity.
  add("R1641_PROMISE_TOPIC",580,{focusAny:["promise"]},["EXPRESS_NEED_CLARITY"],"promise_topic");
  add("R1642_PROMISE_AFTER_RETURN",620,{focusAny:["promise","return"],historyRecentAny:["PROMISE_RETURN"],historyRecentWindow:6},["EXPRESS_CARE"],"promise_after_return");
  add("R1643_PROMISE_AFTER_LOYALTY",630,{focusAny:["promise","trust","betrayal"],historyRecentAny:["PROMISE_LOYALTY"],historyRecentWindow:6},["EXPRESS_CARE"],"promise_after_loyalty");
  add("R1644_PROMISE_AFTER_NO_CONTACT",995,{focusAny:["promise","contact"],historyRecentAny:["PROMISE_NOT_CONTACT"],historyRecentWindow:6,boundaryAny:["do_not_contact"]},["RESPECT_BOUNDARY","PROMISE_NOT_CONTACT"],"promise_after_no_contact");
  add("R1645_PROMISE_AFTER_NO_TOUCH",995,{focusAny:["promise"],historyRecentAny:["PROMISE_NOT_TOUCH"],historyRecentWindow:6,boundaryAny:["do_not_touch"]},["RESPECT_BOUNDARY","PROMISE_NOT_TOUCH"],"promise_after_no_touch");
  add("R1646_FUTURE_PLAN",550,{focusAny:["future","plan"],intentAny:["state_plan"]},["STATE_PLAN"],"future_plan");
  add("R1647_FUTURE_QUESTION",550,{focusAny:["future"],intentAny:["ask_question"]},["EXPRESS_NEED_CLARITY"],"future_question");
  add("R1648_PAST_EVENT",530,{focusAny:["past"],intentAny:["report_event"]},["ACKNOWLEDGE_EVENT"],"past_event");
  add("R1649_PAST_HURT",620,{focusAny:["past"],intentAny:["express_hurt"]},["EXPRESS_CONCERN"],"past_hurt");
  add("R1650_PAST_BETRAYAL",700,{focusAny:["past","betrayal"],relationshipFlagEq:{trustBroken:true}},["ASK_TO_REPAIR"],"past_betrayal_trust_broken");
  add("R1651_RETURN_PROMISE_GOODBYE",640,{focusAny:["return"],intentAny:["say_goodbye"],factEq:{willReturn:true}},["PROMISE_RETURN"],"return_promise_goodbye");
  add("R1652_RETURN_QUESTION_ANXIOUS",620,{focusAny:["return"],emotionMin:{anxiety:45}},["EXPRESS_CONCERN"],"return_question_anxious");
  add("R1653_ARRIVAL_RELIEF",560,{focusAny:["arrival"],emotionMin:{relief:45}},["EXPRESS_RELIEF"],"arrival_relief");
  add("R1654_ARRIVAL_JOY",550,{focusAny:["arrival"],emotionMin:{joy:45}},["EXPRESS_JOY"],"arrival_joy");
  add("R1655_DEPARTURE_SAD",590,{focusAny:["departure"],emotionMin:{sadness:45}},["EXPRESS_MISSING"],"departure_sad");
  add("R1656_DEPARTURE_ANXIETY",600,{focusAny:["departure"],emotionMin:{anxiety:45}},["EXPRESS_CONCERN"],"departure_anxiety");
  add("R1657_TIME_TOPIC",520,{focusAny:["time"],intentAny:["ask_question"]},["EXPRESS_NEED_CLARITY"],"time_topic");
  add("R1658_PLACE_TOPIC",520,{focusAny:["place"],intentAny:["ask_question"]},["EXPRESS_NEED_CLARITY"],"place_topic");
  add("R1659_WAITING_TOPIC",530,{focusAny:["waiting"]},["ASK_TO_WAIT"],"waiting_topic");
  add("R1660_ENTRY_TOPIC",530,{focusAny:["entry"]},["EXPRESS_NEED_CLARITY"],"entry_topic");

  // Contextual questions and practical continuations.
  add("R1661_CURRENT_PLACE_PRIVATE",540,{questionAny:{kindAny:["where"]},contextEq:{privacy:"private"}},["EXPRESS_CARE"],"where_private");
  add("R1662_CURRENT_PLACE_PUBLIC",520,{questionAny:{kindAny:["where"]},contextEq:{privacy:"public"}},["EXPRESS_NEED_CLARITY"],"where_public");
  add("R1663_TIME_PRESSURE_WHEN",600,{questionAny:{kindAny:["when"]},contextEq:{timePressure:true}},["REQUEST_TIME"],"when_under_time_pressure");
  add("R1664_AVAILABLE_WHEN",540,{questionAny:{kindAny:["when"]},contextEq:{availableNow:true}},["EXPRESS_CARE"],"when_available");
  add("R1665_HOME_HEALTH_QUESTION",570,{questionAny:{kindAny:["health"]},contextEq:{locationType:"home"}},["EXPRESS_CARE"],"health_question_home");
  add("R1666_WORK_HEALTH_QUESTION",550,{questionAny:{kindAny:["health"]},contextEq:{locationType:"work"}},["EXPRESS_CONCERN"],"health_question_work");
  add("R1667_NIGHT_SLEEP_QUESTION",560,{questionAny:{kindAny:["sleep"]},contextEq:{timeOfDay:"night"}},["OFFER_REST"],"sleep_question_night");
  add("R1668_HOME_FOOD_QUESTION",550,{questionAny:{kindAny:["food"]},contextEq:{locationType:"home"},policyEq:{canOfferFood:true}},["OFFER_FOOD"],"food_question_home");
  add("R1669_HOME_MONEY_QUESTION",540,{questionAny:{kindAny:["money"]},contextEq:{locationType:"home"}},["EXPRESS_CONCERN"],"money_question_home");
  add("R1670_WORK_MONEY_QUESTION",530,{questionAny:{kindAny:["money"]},contextEq:{locationType:"work"}},["EXPRESS_NEED_CLARITY"],"money_question_work");
  add("R1671_HOME_PLAN_QUESTION",540,{questionAny:{kindAny:["plan"]},contextEq:{locationType:"home"}},["EXPRESS_CARE"],"plan_question_home");
  add("R1672_WORK_PLAN_QUESTION",530,{questionAny:{kindAny:["plan"]},contextEq:{locationType:"work"}},["EXPRESS_NEED_CLARITY"],"plan_question_work");
  add("R1673_REUNION_FEELINGS",620,{questionAny:{kindAny:["feelings"]},contextEq:{reunion:true}},["EXPRESS_CARE"],"feelings_question_reunion");
  add("R1674_FIRST_MEETING_FEELINGS",620,{questionAny:{kindAny:["feelings"]},contextEq:{firstMeeting:true}},["EXPRESS_NEED_CLARITY"],"feelings_question_first_meeting");
  add("R1675_PRIVATE_REL_STATUS",620,{questionAny:{kindAny:["relationship_status"]},contextEq:{privacy:"private"}},["EXPRESS_CARE"],"relationship_status_private");
  add("R1676_PUBLIC_REL_STATUS",590,{questionAny:{kindAny:["relationship_status"]},contextEq:{privacy:"public"}},["EXPRESS_NEED_CLARITY"],"relationship_status_public");
  add("R1677_CROWDED_REASON",570,{questionAny:{kindAny:["reason"]},contextEq:{crowded:true}},["REQUEST_TIME"],"reason_question_crowded");
  add("R1678_NOISY_REASON",570,{questionAny:{kindAny:["reason"]},contextEq:{noisy:true}},["EXPRESS_NEED_CLARITY"],"reason_question_noisy");
  add("R1679_INTERRUPTED_EVENT",580,{questionAny:{kindAny:["event"]},contextEq:{interrupted:true}},["ASK_FOR_DETAILS"],"event_question_interrupted");
  add("R1680_LONG_CONVERSATION_REASON",560,{questionAny:{kindAny:["reason"]},contextMin:{turnCount:9}},["EXPRESS_CARE"],"reason_question_long_conversation");

  // Relationship/context-aware permissions and action responses.
  add("R1681_TOUCH_PARTNER_ALLOW",760,{questionAny:{kindAny:["permission"],actionAny:["touch"]},relationshipEq:{stage:"partner"},policyEq:{"permissions.touch":true},boundaryNone:["do_not_touch","do_not_hug","do_not_kiss"]},["GRANT_PERMISSION"],"touch_partner_allow");
  add("R1682_HUG_PARTNER_ALLOW",760,{questionAny:{kindAny:["permission"],actionAny:["hug"]},relationshipEq:{stage:"partner"},policyEq:{"permissions.hug":true},boundaryNone:["do_not_hug","do_not_touch"]},["GRANT_PERMISSION"],"hug_partner_allow");
  add("R1683_KISS_PARTNER_ALLOW",760,{questionAny:{kindAny:["permission"],actionAny:["kiss"]},relationshipEq:{stage:"partner"},policyEq:{"permissions.kiss":true},boundaryNone:["do_not_kiss","do_not_touch"]},["GRANT_PERMISSION"],"kiss_partner_allow");
  add("R1684_TOUCH_STRANGER_DENY",780,{questionAny:{kindAny:["permission"],actionAny:["touch"]},relationshipEq:{stage:"stranger"},policyEq:{"permissions.touch":false}},["DENY_PERMISSION"],"touch_stranger_deny");
  add("R1685_HUG_STRANGER_DENY",780,{questionAny:{kindAny:["permission"],actionAny:["hug"]},relationshipEq:{stage:"stranger"},policyEq:{"permissions.hug":false}},["DENY_PERMISSION"],"hug_stranger_deny");
  add("R1686_KISS_STRANGER_DENY",780,{questionAny:{kindAny:["permission"],actionAny:["kiss"]},relationshipEq:{stage:"stranger"},policyEq:{"permissions.kiss":false}},["DENY_PERMISSION"],"kiss_stranger_deny");
  add("R1687_PRIVATE_HUG_ALLOW",750,{questionAny:{kindAny:["permission"],actionAny:["hug"]},contextEq:{privacy:"private"},policyEq:{"permissions.hug":true},boundaryNone:["do_not_hug","do_not_touch"]},["GRANT_PERMISSION"],"private_hug_allow");
  add("R1688_PUBLIC_HUG_POLICY",740,{questionAny:{kindAny:["permission"],actionAny:["hug"]},contextEq:{privacy:"public"},policyEq:{"permissions.hug":true},boundaryNone:["do_not_hug","do_not_touch"]},["GRANT_PERMISSION"],"public_hug_allow");
  add("R1689_PRIVATE_KISS_ALLOW",750,{questionAny:{kindAny:["permission"],actionAny:["kiss"]},contextEq:{privacy:"private"},policyEq:{"permissions.kiss":true},boundaryNone:["do_not_kiss","do_not_touch"]},["GRANT_PERMISSION"],"private_kiss_allow");
  add("R1690_PUBLIC_KISS_POLICY",740,{questionAny:{kindAny:["permission"],actionAny:["kiss"]},contextEq:{privacy:"public"},policyEq:{"permissions.kiss":true},boundaryNone:["do_not_kiss","do_not_touch"]},["GRANT_PERMISSION"],"public_kiss_allow");
  add("R1691_HUG_REQUEST_PARTNER",750,{questionAny:{kindAny:["request_action"],actionAny:["hug"]},relationshipEq:{stage:"partner"},policyEq:{"requestResponses.hug":true},boundaryNone:["do_not_hug","do_not_touch"]},["ACCEPT_ACTION_REQUEST"],"hug_request_partner");
  add("R1692_KISS_REQUEST_PARTNER",750,{questionAny:{kindAny:["request_action"],actionAny:["kiss"]},relationshipEq:{stage:"partner"},policyEq:{"requestResponses.kiss":true},boundaryNone:["do_not_kiss","do_not_touch"]},["ACCEPT_ACTION_REQUEST"],"kiss_request_partner");
  add("R1693_TOUCH_REQUEST_PARTNER",750,{questionAny:{kindAny:["request_action"],actionAny:["touch"]},relationshipEq:{stage:"partner"},policyEq:{"requestResponses.touch":true},boundaryNone:["do_not_touch"]},["ACCEPT_ACTION_REQUEST"],"touch_request_partner");
  add("R1694_CALL_REQUEST_CLOSE",740,{questionAny:{kindAny:["request_action"],actionAny:["call"]},relationshipMin:{trust:70},policyEq:{"requestResponses.call":true},boundaryNone:["do_not_call","do_not_contact"]},["ACCEPT_ACTION_REQUEST"],"call_request_close");
  add("R1695_MESSAGE_REQUEST_CLOSE",740,{questionAny:{kindAny:["request_action"],actionAny:["message"]},relationshipMin:{trust:70},policyEq:{"requestResponses.message":true},boundaryNone:["do_not_message","do_not_contact"]},["ACCEPT_ACTION_REQUEST"],"message_request_close");
  add("R1696_VISIT_REQUEST_CLOSE",740,{questionAny:{kindAny:["request_action"],actionAny:["visit"]},relationshipMin:{trust:70},policyEq:{"requestResponses.visit":true},boundaryNone:["do_not_visit","leave_me_alone"]},["ACCEPT_ACTION_REQUEST"],"visit_request_close");
  add("R1697_ENTER_REQUEST_PRIVATE",740,{questionAny:{kindAny:["request_action"],actionAny:["enter"]},contextEq:{privacy:"private"},policyEq:{"requestResponses.enter":true},boundaryNone:["do_not_enter"]},["ACCEPT_ACTION_REQUEST"],"enter_request_private");
  add("R1698_WAIT_REQUEST_AVAILABLE",730,{questionAny:{kindAny:["request_action"],actionAny:["wait"]},contextEq:{availableNow:true},policyEq:{"requestResponses.wait":true},boundaryNone:["do_not_wait"]},["ACCEPT_ACTION_REQUEST"],"wait_request_available");
  add("R1699_GO_REQUEST_TIME_PRESSURE",760,{questionAny:{kindAny:["request_action"],actionAny:["go"]},contextEq:{timePressure:true}},["DECLINE_ACTION_REQUEST","REQUEST_TIME"],"go_request_time_pressure");
  add("R1700_ACTION_BOUNDARY_FINAL",1200,{questionAny:{kindAny:["permission","request_action"]},boundaryAny:["do_not_touch","do_not_hug","do_not_kiss","do_not_contact","do_not_enter","do_not_wait","do_not_visit","do_not_follow","stop_conversation"]},["RESPECT_BOUNDARY"],"action_boundary_final");

  if (R.length !== 100) throw new Error("Expected 100 response rules, got " + R.length);
  HMW.Dialogue.registerResponseRules(R);
})();