(() => {
  "use strict";
  window.HMW = window.HMW || {};
  HMW.Dialogue = HMW.Dialogue || {};

  const R = [];
  const add = (id, priority, when, meanings, reason=id) =>
    R.push({ id, priority, when, meanings, reason });

  // Question + emotion/tone combinations.
  add("R701_WHERE_ANXIOUS",620,{questionAny:{kindAny:["where"]},emotionMin:{anxiety:45}},["EXPRESS_CONCERN"],"where_question_anxious");
  add("R702_WHERE_HURT",610,{questionAny:{kindAny:["where"]},emotionMin:{hurt:45}},["EXPRESS_CONCERN"],"where_question_hurt");
  add("R703_WHEN_ANXIOUS",620,{questionAny:{kindAny:["when"]},emotionMin:{anxiety:45}},["EXPRESS_CONCERN"],"when_question_anxious");
  add("R704_WHEN_HESITANT",580,{questionAny:{kindAny:["when"]},toneMin:{hesitation:55}},["EXPRESS_NEED_CLARITY"],"when_question_hesitant");
  add("R705_REASON_HURT",650,{questionAny:{kindAny:["reason"]},emotionMin:{hurt:45}},["ASK_FOR_HONEST_ANSWER"],"reason_question_hurt");
  add("R706_REASON_DISTRUST",660,{questionAny:{kindAny:["reason"]},emotionMin:{distrust:45}},["ASK_FOR_HONEST_ANSWER"],"reason_question_distrust");
  add("R707_HEALTH_ANXIOUS",640,{questionAny:{kindAny:["health"]},emotionMin:{anxiety:45}},["EXPRESS_CONCERN"],"health_question_anxious");
  add("R708_SLEEP_CONCERNED",600,{questionAny:{kindAny:["sleep"]},emotionMin:{anxiety:40}},["EXPRESS_CONCERN"],"sleep_question_concerned");
  add("R709_FOOD_CONCERNED",600,{questionAny:{kindAny:["food"]},emotionMin:{anxiety:40}},["EXPRESS_CONCERN"],"food_question_concerned");
  add("R710_HOME_FEAR",630,{questionAny:{kindAny:["home"]},emotionMin:{fear:45}},["EXPRESS_CONCERN"],"home_question_fear");
  add("R711_WORK_FRUSTRATED",600,{questionAny:{kindAny:["work"]},emotionMin:{frustration:45}},["EXPRESS_CONCERN"],"work_question_frustrated");
  add("R712_MONEY_ANXIOUS",620,{questionAny:{kindAny:["money"]},emotionMin:{anxiety:45}},["EXPRESS_CONCERN"],"money_question_anxious");
  add("R713_IDENTITY_WARY",610,{questionAny:{kindAny:["identity"]},emotionMin:{distrust:45}},["EXPRESS_NEED_CLARITY"],"identity_question_wary");
  add("R714_ORIGIN_WARY",590,{questionAny:{kindAny:["origin"]},emotionMin:{distrust:45}},["EXPRESS_NEED_CLARITY"],"origin_question_wary");
  add("R715_DESTINATION_ANXIOUS",620,{questionAny:{kindAny:["destination"]},emotionMin:{anxiety:45}},["EXPRESS_CONCERN"],"destination_question_anxious");
  add("R716_OPINION_HURT",610,{questionAny:{kindAny:["opinion"]},emotionMin:{hurt:45}},["EXPRESS_CONCERN"],"opinion_question_hurt");
  add("R717_KNOWLEDGE_DISTRUST",610,{questionAny:{kindAny:["knowledge"]},emotionMin:{distrust:45}},["ASK_FOR_HONEST_ANSWER"],"knowledge_question_distrust");
  add("R718_FACT_DISTRUST",620,{questionAny:{kindAny:["fact"]},emotionMin:{distrust:45}},["ASK_FOR_HONEST_ANSWER"],"fact_question_distrust");
  add("R719_DESIRE_HESITANT",590,{questionAny:{kindAny:["desire"]},toneMin:{hesitation:55}},["EXPRESS_NEED_CLARITY"],"desire_question_hesitant");
  add("R720_NEED_HESITANT",590,{questionAny:{kindAny:["need"]},toneMin:{hesitation:55}},["EXPRESS_NEED_CLARITY"],"need_question_hesitant");

  // Exact permission/request/invite/suggest actions.
  add("R721_PERMISSION_FOLLOW_ALLOW",760,{questionAny:{kindAny:["permission"],actionAny:["follow"]},policyEq:{"permissions.follow":true},boundaryNone:["do_not_follow"]},["GRANT_PERMISSION"],"permission_follow_allow");
  add("R722_PERMISSION_FOLLOW_DENY",780,{questionAny:{kindAny:["permission"],actionAny:["follow"]},policyEq:{"permissions.follow":false}},["DENY_PERMISSION"],"permission_follow_deny");
  add("R723_PERMISSION_STAY_ALLOW",750,{questionAny:{kindAny:["permission"],actionAny:["stay"]},policyEq:{"permissions.stay":true},boundaryNone:["leave_me_alone"]},["GRANT_PERMISSION"],"permission_stay_allow");
  add("R724_PERMISSION_STAY_DENY",770,{questionAny:{kindAny:["permission"],actionAny:["stay"]},policyEq:{"permissions.stay":false}},["DENY_PERMISSION"],"permission_stay_deny");
  add("R725_PERMISSION_TALK_ALLOW",750,{questionAny:{kindAny:["permission"],actionAny:["talk"]},policyEq:{"permissions.talk":true},boundaryNone:["stop_conversation","do_not_ask"]},["GRANT_PERMISSION"],"permission_talk_allow");
  add("R726_PERMISSION_TALK_DENY",770,{questionAny:{kindAny:["permission"],actionAny:["talk"]},policyEq:{"permissions.talk":false}},["DENY_PERMISSION"],"permission_talk_deny");
  add("R727_PERMISSION_SIT_ALLOW",740,{questionAny:{kindAny:["permission"],actionAny:["sit"]},policyEq:{"permissions.sit":true}},["GRANT_PERMISSION"],"permission_sit_allow");
  add("R728_PERMISSION_SIT_DENY",740,{questionAny:{kindAny:["permission"],actionAny:["sit"]},policyEq:{"permissions.sit":false}},["DENY_PERMISSION"],"permission_sit_deny");
  add("R729_REQUEST_ENTER_ALLOW",750,{questionAny:{kindAny:["request_action"],actionAny:["enter"]},policyEq:{"requestResponses.enter":true},boundaryNone:["do_not_enter"]},["ACCEPT_ACTION_REQUEST"],"request_enter_allow");
  add("R730_REQUEST_ENTER_DENY",780,{questionAny:{kindAny:["request_action"],actionAny:["enter"]},policyEq:{"requestResponses.enter":false}},["DECLINE_ACTION_REQUEST"],"request_enter_deny");
  add("R731_REQUEST_VISIT_ALLOW",750,{questionAny:{kindAny:["request_action"],actionAny:["visit"]},policyEq:{"requestResponses.visit":true},boundaryNone:["do_not_visit"]},["ACCEPT_ACTION_REQUEST"],"request_visit_allow");
  add("R732_REQUEST_VISIT_DENY",780,{questionAny:{kindAny:["request_action"],actionAny:["visit"]},policyEq:{"requestResponses.visit":false}},["DECLINE_ACTION_REQUEST"],"request_visit_deny");
  add("R733_INVITE_HOME_ALLOW",740,{questionAny:{kindAny:["invitation"],actionAny:["home"]},policyEq:{"invitationResponses.home":true}},["ACCEPT_INVITATION"],"invite_home_allow");
  add("R734_INVITE_HOME_DENY",740,{questionAny:{kindAny:["invitation"],actionAny:["home"]},policyEq:{"invitationResponses.home":false}},["DECLINE_INVITATION"],"invite_home_deny");
  add("R735_INVITE_WORK_ALLOW",730,{questionAny:{kindAny:["invitation"],actionAny:["work"]},policyEq:{"invitationResponses.work":true}},["ACCEPT_INVITATION"],"invite_work_allow");
  add("R736_INVITE_WORK_DENY",730,{questionAny:{kindAny:["invitation"],actionAny:["work"]},policyEq:{"invitationResponses.work":false}},["DECLINE_INVITATION"],"invite_work_deny");
  add("R737_SUGGEST_STAY_ALLOW",730,{questionAny:{kindAny:["suggestion"],actionAny:["stay"]},policyEq:{"suggestionResponses.stay":true},boundaryNone:["leave_me_alone"]},["ACCEPT_SUGGESTION"],"suggest_stay_allow");
  add("R738_SUGGEST_STAY_DENY",740,{questionAny:{kindAny:["suggestion"],actionAny:["stay"]},policyEq:{"suggestionResponses.stay":false}},["DECLINE_SUGGESTION"],"suggest_stay_deny");
  add("R739_SUGGEST_CALL_ALLOW",720,{questionAny:{kindAny:["suggestion"],actionAny:["call"]},policyEq:{"suggestionResponses.call":true},boundaryNone:["do_not_call","do_not_contact"]},["ACCEPT_SUGGESTION"],"suggest_call_allow");
  add("R740_SUGGEST_CALL_DENY",740,{questionAny:{kindAny:["suggestion"],actionAny:["call"]},policyEq:{"suggestionResponses.call":false}},["DECLINE_SUGGESTION"],"suggest_call_deny");

  // Boundary combinations and precedence-safe reactions.
  add("R741_BOUNDARY_DISTANCE_HURT",995,{boundaryAny:["leave_me_alone"],emotionMin:{hurt:45}},["RESPECT_BOUNDARY","ACCEPT_DISTANCE"],"distance_boundary_hurt");
  add("R742_BOUNDARY_DISTANCE_ANGER",995,{boundaryAny:["leave_me_alone"],emotionMin:{anger:45}},["RESPECT_BOUNDARY","ACCEPT_DISTANCE"],"distance_boundary_anger");
  add("R743_BOUNDARY_DISTANCE_FEAR",995,{boundaryAny:["leave_me_alone"],emotionMin:{fear:45}},["RESPECT_BOUNDARY","ACCEPT_DISTANCE"],"distance_boundary_fear");
  add("R744_BOUNDARY_NO_FOLLOW_FEAR",995,{boundaryAny:["do_not_follow"],emotionMin:{fear:45}},["RESPECT_BOUNDARY","PROMISE_NOT_FOLLOW"],"no_follow_boundary_fear");
  add("R745_BOUNDARY_NO_TOUCH_FEAR",995,{boundaryAny:["do_not_touch"],emotionMin:{fear:45}},["RESPECT_BOUNDARY","PROMISE_NOT_TOUCH"],"no_touch_boundary_fear");
  add("R746_BOUNDARY_NO_HUG_FEAR",995,{boundaryAny:["do_not_hug"],emotionMin:{fear:45}},["RESPECT_BOUNDARY","PROMISE_NOT_HUG"],"no_hug_boundary_fear");
  add("R747_BOUNDARY_NO_KISS_FEAR",995,{boundaryAny:["do_not_kiss"],emotionMin:{fear:45}},["RESPECT_BOUNDARY","PROMISE_NOT_KISS"],"no_kiss_boundary_fear");
  add("R748_BOUNDARY_NO_CONTACT_FEAR",995,{boundaryAny:["do_not_contact"],emotionMin:{fear:45}},["RESPECT_BOUNDARY","PROMISE_NOT_CONTACT"],"no_contact_boundary_fear");
  add("R749_BOUNDARY_STOP_TALK_ANGER",995,{boundaryAny:["stop_conversation"],emotionMin:{anger:45}},["RESPECT_BOUNDARY","ACCEPT_DISTANCE"],"stop_talk_boundary_anger");
  add("R750_BOUNDARY_NO_ASK_HURT",995,{boundaryAny:["do_not_ask"],emotionMin:{hurt:45}},["RESPECT_BOUNDARY"],"no_ask_boundary_hurt");
  add("R751_BOUNDARY_NO_ENTER_FEAR",995,{boundaryAny:["do_not_enter"],emotionMin:{fear:45}},["RESPECT_BOUNDARY"],"no_enter_boundary_fear");
  add("R752_BOUNDARY_NO_WAIT_ANGER",995,{boundaryAny:["do_not_wait"],emotionMin:{anger:45}},["RESPECT_BOUNDARY"],"no_wait_boundary_anger");
  add("R753_BOUNDARY_NO_VISIT_FEAR",995,{boundaryAny:["do_not_visit"],emotionMin:{fear:45}},["RESPECT_BOUNDARY"],"no_visit_boundary_fear");
  add("R754_BOUNDARY_NO_CALL_ANGER",995,{boundaryAny:["do_not_call"],emotionMin:{anger:45}},["RESPECT_BOUNDARY","PROMISE_NOT_CONTACT"],"no_call_boundary_anger");
  add("R755_BOUNDARY_NO_MESSAGE_HURT",995,{boundaryAny:["do_not_message"],emotionMin:{hurt:45}},["RESPECT_BOUNDARY","PROMISE_NOT_CONTACT"],"no_message_boundary_hurt");
  add("R756_BOUNDARY_PHYSICAL_MULTI",999,{boundaryAll:["do_not_touch","do_not_kiss"]},["RESPECT_BOUNDARY","PROMISE_NOT_TOUCH","PROMISE_NOT_KISS"],"multiple_physical_boundaries");
  add("R757_BOUNDARY_CONTACT_MULTI",999,{boundaryAll:["do_not_call","do_not_message"]},["RESPECT_BOUNDARY","PROMISE_NOT_CONTACT"],"multiple_contact_boundaries");
  add("R758_BOUNDARY_DISTANCE_MULTI",999,{boundaryAll:["leave_me_alone","do_not_follow"]},["RESPECT_BOUNDARY","ACCEPT_DISTANCE","PROMISE_NOT_FOLLOW"],"multiple_distance_boundaries");
  add("R759_BOUNDARY_STOP_AND_CONTACT",999,{boundaryAll:["stop_conversation","do_not_contact"]},["RESPECT_BOUNDARY","ACCEPT_DISTANCE","PROMISE_NOT_CONTACT"],"stop_and_contact_boundaries");
  add("R760_BOUNDARY_ENTER_VISIT",999,{boundaryAll:["do_not_enter","do_not_visit"]},["RESPECT_BOUNDARY"],"entry_visit_boundaries");

  // Relationship repair and reassurance.
  add("R761_REASSURE_LOVE_TRUE",850,{intentAny:["request_reassurance","seek_reassurance"],factEq:{"lovesHeroine":true}},["AFFIRM_LOVE"],"reassurance_love_true");
  add("R762_REASSURE_TRUST_TRUE",840,{intentAny:["request_reassurance","seek_reassurance"],factEq:{"trustsHeroine":true}},["CONFIRM_TRUST"],"reassurance_trust_true");
  add("R763_REASSURE_CHOICE_TRUE",840,{intentAny:["request_reassurance","seek_reassurance"],factEq:{"choosesHeroine":true}},["CONFIRM_CHOICE"],"reassurance_choice_true");
  add("R764_REASSURE_NOT_ABANDON",850,{intentAny:["request_reassurance","seek_reassurance"],factEq:{"willAbandonHeroine":false}},["REASSURE_NOT_LEAVING"],"reassurance_not_abandon");
  add("R765_REASSURE_LOYAL",840,{intentAny:["request_reassurance","seek_reassurance"],factEq:{"loyalToHeroine":true}},["PROMISE_LOYALTY"],"reassurance_loyal");
  add("R766_HURT_REPAIR_CARE",650,{intentAny:["express_hurt"],psychologyMin:{care:55}},["EXPRESS_REPAIR_DESIRE"],"hurt_repair_care");
  add("R767_ANGER_REPAIR_EMPATHY",640,{intentAny:["express_anger"],psychologyMin:{empathy:55}},["ASK_TO_TALK"],"anger_repair_empathy");
  add("R768_DISAPPOINTMENT_REPAIR",630,{intentAny:["express_disappointment"],psychologyMin:{care:55}},["EXPRESS_REPAIR_DESIRE"],"disappointment_repair");
  add("R769_APOLOGY_CARE_HIGH",650,{intentAny:["apologize"],psychologyMin:{care:70}},["ASK_TO_REPAIR"],"apology_care_high");
  add("R770_APOLOGY_EMPATHY_HIGH",650,{intentAny:["apologize"],psychologyMin:{empathy:70}},["EXPRESS_REPAIR_DESIRE"],"apology_empathy_high");
  add("R771_LOVE_FEAR_REASSURE",770,{focusAny:["love"],emotionMin:{fear:55},factEq:{"lovesHeroine":true}},["AFFIRM_LOVE","EXPRESS_CARE"],"love_fear_reassure");
  add("R772_TRUST_FEAR_REASSURE",760,{focusAny:["trust"],emotionMin:{fear:55},factEq:{"trustsHeroine":true}},["CONFIRM_TRUST"],"trust_fear_reassure");
  add("R773_BETRAYAL_FEAR_REASSURE",780,{focusAny:["betrayal"],emotionMin:{fear:55},factEq:{"intendsBetrayal":false}},["DENY_BETRAYAL"],"betrayal_fear_reassure");
  add("R774_ABANDON_FEAR_REASSURE",790,{focusAny:["abandonment"],emotionMin:{fear:55},factEq:{"willAbandonHeroine":false}},["DENY_ABANDONMENT","REASSURE_NOT_LEAVING"],"abandonment_fear_reassure");
  add("R775_OTHER_PERSON_JEALOUS",620,{focusAny:["other_person"],emotionMin:{jealousy:50}},["ASK_ABOUT_OTHER_PERSON"],"other_person_jealousy");
  add("R776_RELATIONSHIP_HOPE_CARE",590,{focusAny:["relationship"],emotionMin:{hope:50},psychologyMin:{care:55}},["EXPRESS_HOPE","EXPRESS_CARE"],"relationship_hope_care");
  add("R777_RELATIONSHIP_SAD_CARE",630,{focusAny:["relationship"],emotionMin:{sadness:50},psychologyMin:{care:55}},["EXPRESS_CARE"],"relationship_sad_care");
  add("R778_RELATIONSHIP_HURT_EMPATHY",650,{focusAny:["relationship"],emotionMin:{hurt:50},psychologyMin:{empathy:55}},["EXPRESS_CONCERN"],"relationship_hurt_empathy");
  add("R779_RELATIONSHIP_CONFUSED",620,{focusAny:["relationship"],emotionMin:{confusion:50}},["ASK_TO_TALK"],"relationship_confused");
  add("R780_RELATIONSHIP_RELIEF",570,{focusAny:["relationship"],emotionMin:{relief:50}},["EXPRESS_RELIEF"],"relationship_relief");

  // Daily/event/social continuity.
  add("R781_ARRIVAL_JOY",550,{intentAny:["confirm_arrival"],emotionMin:{joy:45}},["EXPRESS_JOY"],"arrival_joy");
  add("R782_ARRIVAL_RELIEF",560,{intentAny:["confirm_arrival"],emotionMin:{relief:45}},["EXPRESS_RELIEF"],"arrival_relief");
  add("R783_DEPARTURE_SAD",580,{intentAny:["confirm_departure"],emotionMin:{sadness:45}},["EXPRESS_MISSING"],"departure_sad");
  add("R784_DEPARTURE_ANXIOUS",590,{intentAny:["confirm_departure"],emotionMin:{anxiety:45}},["EXPRESS_CONCERN"],"departure_anxious");
  add("R785_PLAN_JOY",540,{intentAny:["state_plan"],emotionMin:{joy:45}},["EXPRESS_APPROVAL"],"plan_joy");
  add("R786_PLAN_ANXIETY",600,{intentAny:["state_plan"],emotionMin:{anxiety:45}},["EXPRESS_CONCERN"],"plan_anxiety");
  add("R787_PREFERENCE_JOY",530,{intentAny:["state_preference"],emotionMin:{joy:45}},["EXPRESS_APPROVAL"],"preference_joy");
  add("R788_PREFERENCE_HESITANT",560,{intentAny:["state_preference"],toneMin:{hesitation:55}},["EXPRESS_CARE"],"preference_hesitant");
  add("R789_REPORT_SURPRISE_JOY",550,{intentAny:["report_event"],emotionMin:{surprise:45,joy:45}},["EXPRESS_JOY"],"report_surprise_joy");
  add("R790_REPORT_SURPRISE_FEAR",620,{intentAny:["report_event"],emotionMin:{surprise:45,fear:45}},["EXPRESS_CONCERN"],"report_surprise_fear");
  add("R791_REPORT_DISAPPOINTMENT",610,{intentAny:["report_event"],emotionMin:{disappointment:50}},["EXPRESS_SYMPATHY"],"report_disappointment");
  add("R792_REPORT_HOPE",550,{intentAny:["report_event"],emotionMin:{hope:50}},["EXPRESS_HOPE"],"report_hope");
  add("R793_GREETING_RELIEF",530,{intentAny:["greet"],emotionMin:{relief:45}},["EXPRESS_RELIEF"],"greeting_relief");
  add("R794_GREETING_SURPRISE",530,{intentAny:["greet"],emotionMin:{surprise:45}},["EXPRESS_SURPRISE"],"greeting_surprise");
  add("R795_GOODBYE_HOPE",550,{intentAny:["say_goodbye"],emotionMin:{hope:45}},["PROMISE_RETURN"],"goodbye_hope");
  add("R796_GOODBYE_RELIEF",530,{intentAny:["say_goodbye"],emotionMin:{relief:45}},["SAY_GOODBYE_TEMPORARY"],"goodbye_relief");
  add("R797_OFFER_HELP_GRATEFUL",530,{intentAny:["offer_help"],emotionMin:{affection:40}},["EXPRESS_GRATITUDE"],"help_offer_affection");
  add("R798_OFFER_COMPANY_GRATEFUL",530,{intentAny:["offer_company"],emotionMin:{affection:40}},["EXPRESS_GRATITUDE"],"company_offer_affection");
  add("R799_AGREE_JOY",520,{intentAny:["agree"],emotionMin:{joy:45}},["EXPRESS_JOY"],"agreement_joy");
  add("R800_REFUSE_SUBDUED",900,{intentAny:["refuse"],toneEq:{style:["subdued","quiet"]}},["RESPECT_BOUNDARY"],"subdued_refusal");

  if (R.length !== 100) throw new Error("Expected 100 response rules, got " + R.length);
  HMW.Dialogue.registerResponseRules(R);
})();