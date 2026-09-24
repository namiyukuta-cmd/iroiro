(() => {
  "use strict";
  window.HMW = window.HMW || {};
  HMW.Dialogue = HMW.Dialogue || {};

  const R = [];
  const add = (id, priority, when, meanings, reason=id) =>
    R.push({ id, priority, when, meanings, reason });

  // Exact action-specific permission/request/invitation/suggestion rules.
  add("R501_PERMISSION_ENTER_ALLOW",770,{questionAny:{kindAny:["permission"],actionAny:["enter"]},policyEq:{"permissions.enter":true},boundaryNone:["do_not_enter"]},["GRANT_PERMISSION"],"permission_enter_allow");
  add("R502_PERMISSION_ENTER_DENY",790,{questionAny:{kindAny:["permission"],actionAny:["enter"]},policyEq:{"permissions.enter":false}},["DENY_PERMISSION"],"permission_enter_deny");
  add("R503_PERMISSION_WAIT_ALLOW",760,{questionAny:{kindAny:["permission"],actionAny:["wait"]},policyEq:{"permissions.wait":true},boundaryNone:["do_not_wait"]},["GRANT_PERMISSION"],"permission_wait_allow");
  add("R504_PERMISSION_WAIT_DENY",780,{questionAny:{kindAny:["permission"],actionAny:["wait"]},policyEq:{"permissions.wait":false}},["DENY_PERMISSION"],"permission_wait_deny");
  add("R505_PERMISSION_VISIT_ALLOW",760,{questionAny:{kindAny:["permission"],actionAny:["visit"]},policyEq:{"permissions.visit":true},boundaryNone:["do_not_visit"]},["GRANT_PERMISSION"],"permission_visit_allow");
  add("R506_PERMISSION_VISIT_DENY",780,{questionAny:{kindAny:["permission"],actionAny:["visit"]},policyEq:{"permissions.visit":false}},["DENY_PERMISSION"],"permission_visit_deny");
  add("R507_PERMISSION_CALL_ALLOW",750,{questionAny:{kindAny:["permission"],actionAny:["call"]},policyEq:{"permissions.call":true},boundaryNone:["do_not_call","do_not_contact"]},["GRANT_PERMISSION"],"permission_call_allow");
  add("R508_PERMISSION_CALL_DENY",780,{questionAny:{kindAny:["permission"],actionAny:["call"]},policyEq:{"permissions.call":false}},["DENY_PERMISSION"],"permission_call_deny");
  add("R509_PERMISSION_MESSAGE_ALLOW",750,{questionAny:{kindAny:["permission"],actionAny:["message"]},policyEq:{"permissions.message":true},boundaryNone:["do_not_message","do_not_contact"]},["GRANT_PERMISSION"],"permission_message_allow");
  add("R510_PERMISSION_MESSAGE_DENY",780,{questionAny:{kindAny:["permission"],actionAny:["message"]},policyEq:{"permissions.message":false}},["DENY_PERMISSION"],"permission_message_deny");
  add("R511_REQUEST_STAY_ALLOW",760,{questionAny:{kindAny:["request_action"],actionAny:["stay"]},policyEq:{"requestResponses.stay":true},boundaryNone:["leave_me_alone","stop_conversation"]},["ACCEPT_ACTION_REQUEST"],"request_stay_allow");
  add("R512_REQUEST_STAY_DENY",780,{questionAny:{kindAny:["request_action"],actionAny:["stay"]},policyEq:{"requestResponses.stay":false}},["DECLINE_ACTION_REQUEST"],"request_stay_deny");
  add("R513_REQUEST_FOLLOW_ALLOW",760,{questionAny:{kindAny:["request_action"],actionAny:["follow"]},policyEq:{"requestResponses.follow":true},boundaryNone:["do_not_follow"]},["ACCEPT_ACTION_REQUEST"],"request_follow_allow");
  add("R514_REQUEST_FOLLOW_DENY",780,{questionAny:{kindAny:["request_action"],actionAny:["follow"]},policyEq:{"requestResponses.follow":false}},["DECLINE_ACTION_REQUEST"],"request_follow_deny");
  add("R515_INVITE_REST_ALLOW",740,{questionAny:{kindAny:["invitation"],actionAny:["rest"]},policyEq:{"invitationResponses.rest":true}},["ACCEPT_INVITATION"],"invite_rest_allow");
  add("R516_INVITE_REST_DENY",740,{questionAny:{kindAny:["invitation"],actionAny:["rest"]},policyEq:{"invitationResponses.rest":false}},["DECLINE_INVITATION"],"invite_rest_deny");
  add("R517_INVITE_DRINK_ALLOW",740,{questionAny:{kindAny:["invitation"],actionAny:["drink"]},policyEq:{"invitationResponses.drink":true}},["ACCEPT_INVITATION"],"invite_drink_allow");
  add("R518_INVITE_DRINK_DENY",740,{questionAny:{kindAny:["invitation"],actionAny:["drink"]},policyEq:{"invitationResponses.drink":false}},["DECLINE_INVITATION"],"invite_drink_deny");
  add("R519_SUGGEST_GO_ALLOW",730,{questionAny:{kindAny:["suggestion"],actionAny:["go"]},policyEq:{"suggestionResponses.go":true}},["ACCEPT_SUGGESTION"],"suggest_go_allow");
  add("R520_SUGGEST_GO_DENY",730,{questionAny:{kindAny:["suggestion"],actionAny:["go"]},policyEq:{"suggestionResponses.go":false}},["DECLINE_SUGGESTION"],"suggest_go_deny");

  // Question-kind nuance driven by step-4 analysis.
  add("R521_IDENTITY_QUESTION_FRIENDLY",520,{questionKindAny:["identity"],toneMin:{friendliness:60}},["EXPRESS_CARE"],"identity_question_friendly");
  add("R522_ORIGIN_QUESTION_FRIENDLY",510,{questionKindAny:["origin"],toneMin:{friendliness:60}},["EXPRESS_CARE"],"origin_question_friendly");
  add("R523_DESTINATION_QUESTION_FEAR",620,{questionKindAny:["destination"],emotionMin:{fear:45}},["EXPRESS_CONCERN"],"destination_question_fear");
  add("R524_OPINION_QUESTION_HESITANT",600,{questionKindAny:["opinion"],toneMin:{hesitation:50}},["EXPRESS_NEED_CLARITY"],"opinion_question_hesitant");
  add("R525_PRICE_QUESTION_ANXIETY",600,{questionKindAny:["price"],emotionMin:{anxiety:45}},["EXPRESS_CONCERN"],"price_question_anxiety");
  add("R526_QUANTITY_QUESTION_ANXIETY",590,{questionKindAny:["quantity"],emotionMin:{anxiety:45}},["EXPRESS_CONCERN"],"quantity_question_anxiety");
  add("R527_WORK_LOCATION_QUESTION",500,{questionKindAny:["work_location"]},["ANSWER_UNKNOWN"],"work_location_question");
  add("R528_JOB_ROLE_QUESTION",500,{questionKindAny:["job_role"]},["ANSWER_UNKNOWN"],"job_role_question");
  add("R529_KNOWLEDGE_QUESTION",500,{questionKindAny:["knowledge"]},["ANSWER_UNKNOWN"],"knowledge_question");
  add("R530_FACT_QUESTION",500,{questionKindAny:["fact"]},["ANSWER_UNKNOWN"],"fact_question");
  add("R531_DESIRE_QUESTION",500,{questionKindAny:["desire"]},["ANSWER_UNKNOWN"],"desire_question");
  add("R532_NEED_QUESTION",500,{questionKindAny:["need"]},["ANSWER_UNKNOWN"],"need_question");
  add("R533_CHOICE_QUESTION",500,{questionKindAny:["choice"]},["ANSWER_UNKNOWN"],"choice_question");
  add("R534_EVENT_QUESTION",500,{questionKindAny:["event"]},["ANSWER_UNKNOWN"],"event_question");
  add("R535_POSSESSION_QUESTION_HESITANT",580,{questionKindAny:["possession"],toneMin:{hesitation:50}},["EXPRESS_NEED_CLARITY"],"possession_question_hesitant");
  add("R536_CAPABILITY_QUESTION_HESITANT",580,{questionKindAny:["capability"],toneMin:{hesitation:50}},["EXPRESS_NEED_CLARITY"],"capability_question_hesitant");
  add("R537_AVAILABILITY_QUESTION_WARM",520,{questionKindAny:["availability"],toneEq:{style:["warm","friendly"]}},["EXPRESS_CARE"],"availability_question_warm");
  add("R538_PLAN_QUESTION_FEAR",620,{questionKindAny:["plan"],emotionMin:{fear:45}},["EXPRESS_CONCERN"],"plan_question_fear");
  add("R539_PREFERENCE_QUESTION_FRIENDLY",520,{questionKindAny:["preference"],toneMin:{friendliness:60}},["EXPRESS_CARE"],"preference_question_friendly");
  add("R540_EVENT_QUESTION_SURPRISE",560,{questionKindAny:["event"],emotionMin:{surprise:50}},["EXPRESS_SURPRISE"],"event_question_surprise");

  // Requested-field-specific question interpretation.
  add("R541_FIELD_CURRENT_LOCATION",540,{questionRequestedFieldAny:["currentLocation"]},["ANSWER_UNKNOWN"],"requested_current_location");
  add("R542_FIELD_RETURN_TIME",540,{questionRequestedFieldAny:["returnTime"]},["ANSWER_UNKNOWN"],"requested_return_time");
  add("R543_FIELD_AVAILABLE_TIME",540,{questionRequestedFieldAny:["availableTime"]},["ANSWER_UNKNOWN"],"requested_available_time");
  add("R544_FIELD_NAME",540,{questionRequestedFieldAny:["name"]},["ANSWER_UNKNOWN"],"requested_name");
  add("R545_FIELD_ROLE",540,{questionRequestedFieldAny:["role","jobRole"]},["ANSWER_UNKNOWN"],"requested_role");
  add("R546_FIELD_ORIGIN",540,{questionRequestedFieldAny:["origin"]},["ANSWER_UNKNOWN"],"requested_origin");
  add("R547_FIELD_DESTINATION",540,{questionRequestedFieldAny:["destination"]},["ANSWER_UNKNOWN"],"requested_destination");
  add("R548_FIELD_WORK_LOCATION",540,{questionRequestedFieldAny:["workLocation"]},["ANSWER_UNKNOWN"],"requested_work_location");
  add("R549_FIELD_RELATIONSHIP",600,{questionRequestedFieldAny:["relationshipStatus"]},["ANSWER_UNKNOWN"],"requested_relationship_status");
  add("R550_FIELD_FEELINGS",620,{questionRequestedFieldAny:["feelingsTowardHeroine"]},["ANSWER_UNKNOWN"],"requested_feelings");
  add("R551_FIELD_HEALTH",550,{questionRequestedFieldAny:["healthStatus"]},["ANSWER_UNKNOWN"],"requested_health_status");
  add("R552_FIELD_WORK_STATUS",540,{questionRequestedFieldAny:["workStatus"]},["ANSWER_UNKNOWN"],"requested_work_status");
  add("R553_FIELD_MONEY",540,{questionRequestedFieldAny:["moneyAmount","hasEnoughMoney"]},["ANSWER_UNKNOWN"],"requested_money_status");
  add("R554_FIELD_PLAN",540,{questionRequestedFieldAny:["currentPlan"]},["ANSWER_UNKNOWN"],"requested_current_plan");
  add("R555_FIELD_PREFERENCE",540,{questionRequestedFieldAny:["currentPreference"]},["ANSWER_UNKNOWN"],"requested_current_preference");
  add("R556_FIELD_DESIRE",540,{questionRequestedFieldAny:["currentDesire"]},["ANSWER_UNKNOWN"],"requested_current_desire");
  add("R557_FIELD_NEED",540,{questionRequestedFieldAny:["currentNeed"]},["ANSWER_UNKNOWN"],"requested_current_need");
  add("R558_FIELD_CHOICE",540,{questionRequestedFieldAny:["currentChoice"]},["ANSWER_UNKNOWN"],"requested_current_choice");
  add("R559_FIELD_EVENT",540,{questionRequestedFieldAny:["lastEvent"]},["ANSWER_UNKNOWN"],"requested_last_event");
  add("R560_FIELD_CERTAINTY",540,{questionRequestedFieldAny:["certain","certainty"]},["ANSWER_UNKNOWN"],"requested_certainty");

  // Claim + context combinations without converting protagonist claims into NPC facts.
  add("R561_CLAIM_LOVE_NEG_HURT",760,{claimAny:{conceptAny:["love","like"],polarityEq:false},emotionMin:{hurt:45}},["EXPRESS_CONCERN"],"negative_love_claim_hurt");
  add("R562_CLAIM_LOVE_NEG_FEAR",760,{claimAny:{conceptAny:["love","like"],polarityEq:false},emotionMin:{fear:45}},["EXPRESS_CARE"],"negative_love_claim_fear");
  add("R563_CLAIM_TRUST_NEG_HURT",740,{claimAny:{conceptAny:["trust"],polarityEq:false},emotionMin:{hurt:45}},["EXPRESS_CONCERN"],"negative_trust_claim_hurt");
  add("R564_CLAIM_TRUST_NEG_ANGER",740,{claimAny:{conceptAny:["trust"],polarityEq:false},emotionMin:{anger:45}},["ASK_FOR_HONEST_ANSWER"],"negative_trust_claim_anger");
  add("R565_CLAIM_BETRAYAL_FEAR",780,{claimAny:{conceptAny:["betrayal"],typeAny:["speaker_fear"]},emotionMin:{fear:45}},["EXPRESS_CONCERN"],"betrayal_claim_fear");
  add("R566_CLAIM_BETRAYAL_HURT",780,{claimConceptAny:["betrayal"],emotionMin:{hurt:45}},["EXPRESS_CONCERN"],"betrayal_claim_hurt");
  add("R567_CLAIM_ABANDON_FEAR",790,{claimConceptAny:["abandonment"],emotionMin:{fear:45}},["EXPRESS_CARE"],"abandonment_claim_fear");
  add("R568_CLAIM_ABANDON_SAD",760,{claimConceptAny:["abandonment"],emotionMin:{sadness:45}},["EXPRESS_CARE"],"abandonment_claim_sadness");
  add("R569_CLAIM_HARM_FEAR",800,{claimConceptAny:["harm"],emotionMin:{fear:45}},["REASSURE_SAFETY"],"harm_claim_fear");
  add("R570_CLAIM_RELATIONSHIP_CONFUSION",650,{claimConceptAny:["relationship"],emotionMin:{confusion:45}},["ASK_TO_TALK"],"relationship_claim_confusion");
  add("R571_CLAIM_WORK_REPORT",520,{claimAny:{conceptAny:["work","job"],typeAny:["report"]}},["ACKNOWLEDGE_EVENT"],"work_claim_report");
  add("R572_CLAIM_MONEY_REPORT",520,{claimAny:{conceptAny:["money"],typeAny:["report"]}},["ACKNOWLEDGE_EVENT"],"money_claim_report");
  add("R573_CLAIM_HEALTH_REPORT",550,{claimAny:{conceptAny:["health","injury","illness"],typeAny:["report"]}},["ASK_IF_OKAY"],"health_claim_report");
  add("R574_CLAIM_HOME_REPORT",520,{claimAny:{conceptAny:["home","shelter"],typeAny:["report"]}},["ACKNOWLEDGE_EVENT"],"home_claim_report");
  add("R575_CLAIM_TRAVEL_PLAN",540,{claimAny:{conceptAny:["travel"],typeAny:["plan"]}},["STATE_PLAN"],"travel_claim_plan");
  add("R576_CLAIM_MEETING_PLAN",540,{claimAny:{conceptAny:["meeting"],typeAny:["plan"]}},["STATE_PLAN"],"meeting_claim_plan");
  add("R577_CLAIM_CONTACT_PLAN",540,{claimAny:{conceptAny:["contact"],typeAny:["plan"]}},["STATE_PLAN"],"contact_claim_plan");
  add("R578_CLAIM_FOOD_PREFERENCE",530,{claimAny:{conceptAny:["food"],typeAny:["preference"]}},["STATE_PREFERENCE"],"food_claim_preference");
  add("R579_CLAIM_HOME_PREFERENCE",530,{claimAny:{conceptAny:["home","place"],typeAny:["preference"]}},["STATE_PREFERENCE"],"home_claim_preference");
  add("R580_CLAIM_BOUNDARY_HURT",980,{claimTypeAny:["boundary"],emotionMin:{hurt:45}},["RESPECT_BOUNDARY"],"hurt_boundary_claim");

  // Social/emotional combinations for more varied response selection.
  add("R581_GREETING_NERVOUS",590,{intentAny:["greet"],toneEq:{style:["nervous"]}},["EXPRESS_CARE"],"nervous_greeting");
  add("R582_GREETING_QUIET",570,{intentAny:["greet"],toneEq:{style:["quiet","subdued"]}},["EXPRESS_CARE"],"quiet_greeting");
  add("R583_GREETING_EXCITED",550,{intentAny:["greet"],toneEq:{style:["excited","cheerful"]}},["EXPRESS_JOY"],"excited_greeting");
  add("R584_GOODBYE_NERVOUS",600,{intentAny:["say_goodbye"],toneEq:{style:["nervous"]}},["EXPRESS_CONCERN"],"nervous_goodbye");
  add("R585_GOODBYE_COLD",590,{intentAny:["say_goodbye"],toneEq:{style:["cold","distant"]}},["SAY_GOODBYE"],"cold_goodbye");
  add("R586_APOLOGY_NERVOUS",620,{intentAny:["apologize"],toneEq:{style:["nervous"]}},["EXPRESS_REPAIR_DESIRE"],"nervous_apology");
  add("R587_APOLOGY_QUIET",610,{intentAny:["apologize"],toneEq:{style:["quiet","subdued"]}},["EXPRESS_REPAIR_DESIRE"],"quiet_apology");
  add("R588_AGREE_WARM",540,{intentAny:["agree"],toneEq:{style:["warm","friendly"]}},["EXPRESS_RELIEF"],"warm_agreement");
  add("R589_AGREE_HESITANT",590,{intentAny:["agree"],toneMin:{hesitation:60}},["EXPRESS_CONCERN"],"hesitant_agreement");
  add("R590_REFUSE_HURT",900,{intentAny:["refuse"],emotionMin:{hurt:45}},["RESPECT_BOUNDARY"],"hurt_refusal");
  add("R591_REFUSE_ANGER",910,{intentAny:["refuse"],emotionMin:{anger:45}},["RESPECT_BOUNDARY"],"angry_refusal");
  add("R592_REFUSE_FEAR",920,{intentAny:["refuse"],emotionMin:{fear:45}},["RESPECT_BOUNDARY"],"fearful_refusal");
  add("R593_OFFER_HELP_WARM",540,{intentAny:["offer_help"],toneEq:{style:["warm","friendly"]}},["EXPRESS_GRATITUDE"],"warm_help_offer");
  add("R594_OFFER_COMPANY_WARM",540,{intentAny:["offer_company"],toneEq:{style:["warm","friendly"]}},["EXPRESS_GRATITUDE"],"warm_company_offer");
  add("R595_REQUEST_CONTACT_ANXIOUS",620,{intentAny:["request_contact"],emotionMin:{anxiety:45}},["EXPRESS_CONCERN"],"anxious_contact_request");
  add("R596_MEET_REQUEST_JOY",550,{intentAny:["ask_to_meet"],emotionMin:{joy:45}},["EXPRESS_JOY"],"joyful_meeting_request");
  add("R597_TALK_REQUEST_HURT",630,{intentAny:["ask_to_talk"],emotionMin:{hurt:45}},["EXPRESS_CONCERN"],"hurt_talk_request");
  add("R598_STAY_REQUEST_LONELY",640,{intentAny:["request_stay"],emotionMin:{loneliness:45},boundaryNone:["leave_me_alone","stop_conversation"]},["OFFER_COMPANY"],"lonely_stay_request");
  add("R599_REASSURANCE_REQUEST_FEAR",680,{intentAny:["request_reassurance","seek_reassurance"],emotionMin:{fear:45}},["EXPRESS_CARE"],"fearful_reassurance_request");
  add("R600_REASSURANCE_REQUEST_HURT",680,{intentAny:["request_reassurance","seek_reassurance"],emotionMin:{hurt:45}},["EXPRESS_CONCERN"],"hurt_reassurance_request");

  if (R.length !== 100) throw new Error("Expected 100 response rules, got " + R.length);
  HMW.Dialogue.registerResponseRules(R);
})();