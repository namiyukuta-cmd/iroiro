(() => {
  "use strict";
  window.HMW = window.HMW || {};
  HMW.Dialogue = HMW.Dialogue || {};

  const R = [];
  const add = (id, priority, when, meanings, reason=id) =>
    R.push({ id, priority, when, meanings, reason });

  // Action requests, permissions, invitations and boundaries.
  add("R401_REQ_TOUCH_ALLOW",780,{intentAny:["request_action"],questionActionAny:["touch"],policyEq:{"requestResponses.touch":true},boundaryNone:["do_not_touch"]},["ACCEPT_ACTION_REQUEST"],"request_touch_allowed");
  add("R402_REQ_TOUCH_DENY",800,{intentAny:["request_action"],questionActionAny:["touch"],policyEq:{"requestResponses.touch":false}},["DECLINE_ACTION_REQUEST"],"request_touch_denied");
  add("R403_REQ_HUG_ALLOW",780,{intentAny:["request_action"],questionActionAny:["hug"],policyEq:{"requestResponses.hug":true},boundaryNone:["do_not_hug","do_not_touch"]},["ACCEPT_ACTION_REQUEST"],"request_hug_allowed");
  add("R404_REQ_HUG_DENY",800,{intentAny:["request_action"],questionActionAny:["hug"],policyEq:{"requestResponses.hug":false}},["DECLINE_ACTION_REQUEST"],"request_hug_denied");
  add("R405_REQ_KISS_ALLOW",780,{intentAny:["request_action"],questionActionAny:["kiss"],policyEq:{"requestResponses.kiss":true},boundaryNone:["do_not_kiss","do_not_touch"]},["ACCEPT_ACTION_REQUEST"],"request_kiss_allowed");
  add("R406_REQ_KISS_DENY",800,{intentAny:["request_action"],questionActionAny:["kiss"],policyEq:{"requestResponses.kiss":false}},["DECLINE_ACTION_REQUEST"],"request_kiss_denied");
  add("R407_REQ_CALL_ALLOW",750,{intentAny:["request_action"],questionActionAny:["call"],policyEq:{"requestResponses.call":true},boundaryNone:["do_not_call","do_not_contact"]},["ACCEPT_ACTION_REQUEST"],"request_call_allowed");
  add("R408_REQ_CALL_DENY",780,{intentAny:["request_action"],questionActionAny:["call"],policyEq:{"requestResponses.call":false}},["DECLINE_ACTION_REQUEST"],"request_call_denied");
  add("R409_REQ_MESSAGE_ALLOW",750,{intentAny:["request_action"],questionActionAny:["message"],policyEq:{"requestResponses.message":true},boundaryNone:["do_not_message","do_not_contact"]},["ACCEPT_ACTION_REQUEST"],"request_message_allowed");
  add("R410_REQ_MESSAGE_DENY",780,{intentAny:["request_action"],questionActionAny:["message"],policyEq:{"requestResponses.message":false}},["DECLINE_ACTION_REQUEST"],"request_message_denied");
  add("R411_INVITE_TALK_ALLOW",750,{intentAny:["invite_action"],questionActionAny:["talk"],policyEq:{"invitationResponses.talk":true},boundaryNone:["stop_conversation"]},["ACCEPT_INVITATION"],"invite_talk_allowed");
  add("R412_INVITE_TALK_DENY",750,{intentAny:["invite_action"],questionActionAny:["talk"],policyEq:{"invitationResponses.talk":false}},["DECLINE_INVITATION"],"invite_talk_denied");
  add("R413_INVITE_GO_ALLOW",740,{intentAny:["invite_action"],questionActionAny:["go"],policyEq:{"invitationResponses.go":true}},["ACCEPT_INVITATION"],"invite_go_allowed");
  add("R414_INVITE_GO_DENY",740,{intentAny:["invite_action"],questionActionAny:["go"],policyEq:{"invitationResponses.go":false}},["DECLINE_INVITATION"],"invite_go_denied");
  add("R415_SUGGEST_WAIT_ALLOW",730,{intentAny:["suggest_action"],questionActionAny:["wait"],policyEq:{"suggestionResponses.wait":true}},["ACCEPT_SUGGESTION"],"suggest_wait_allowed");
  add("R416_SUGGEST_WAIT_DENY",730,{intentAny:["suggest_action"],questionActionAny:["wait"],policyEq:{"suggestionResponses.wait":false}},["DECLINE_SUGGESTION"],"suggest_wait_denied");
  add("R417_BOUNDARY_NO_ASK",990,{boundaryAny:["do_not_ask"]},["RESPECT_BOUNDARY"],"boundary_do_not_ask");
  add("R418_BOUNDARY_NO_ENTER",990,{boundaryAny:["do_not_enter"]},["RESPECT_BOUNDARY"],"boundary_do_not_enter");
  add("R419_BOUNDARY_NO_VISIT_STRICT",990,{boundaryAny:["do_not_visit"]},["RESPECT_BOUNDARY"],"boundary_do_not_visit_strict");
  add("R420_BOUNDARY_MULTI_PHYSICAL",995,{boundaryAny:["do_not_touch","do_not_hug","do_not_kiss"]},["RESPECT_BOUNDARY"],"physical_boundary_active");

  // Daily-state interpretation and supportive replies.
  add("R421_HUNGER_WITH_FEAR",640,{focusAny:["hunger","food"],emotionMin:{fear:45}},["EXPRESS_CONCERN"],"hunger_with_fear");
  add("R422_HUNGER_WITH_SADNESS",610,{focusAny:["hunger","food"],emotionMin:{sadness:45}},["EXPRESS_SYMPATHY"],"hunger_with_sadness");
  add("R423_THIRST_WITH_FEAR",640,{focusAny:["thirst","water"],emotionMin:{fear:45}},["EXPRESS_CONCERN"],"thirst_with_fear");
  add("R424_TIRED_WITH_HURT",630,{focusAny:["tiredness","sleep"],emotionMin:{hurt:45}},["OFFER_REST"],"tiredness_with_hurt");
  add("R425_SLEEP_WITH_ANXIETY",620,{focusAny:["sleep"],emotionMin:{anxiety:45}},["OFFER_REST"],"sleep_with_anxiety");
  add("R426_HEALTH_WITH_SADNESS",640,{focusAny:["health","injury","illness"],emotionMin:{sadness:45}},["EXPRESS_SYMPATHY"],"health_with_sadness");
  add("R427_HEALTH_WITH_RELIEF",580,{focusAny:["health","injury","illness"],emotionMin:{relief:50}},["EXPRESS_RELIEF"],"health_with_relief");
  add("R428_HOME_WITH_ANXIETY",620,{focusAny:["home","shelter"],emotionMin:{anxiety:45}},["EXPRESS_CONCERN"],"home_with_anxiety");
  add("R429_HOME_WITH_COLD",620,{focusAll:["home","weather"]},["OFFER_WARMTH"],"home_with_weather");
  add("R430_WORK_WITH_ANXIETY",620,{focusAny:["work","job"],emotionMin:{anxiety:45}},["EXPRESS_CONCERN"],"work_with_anxiety");
  add("R431_WORK_WITH_FRUSTRATION",610,{focusAny:["work","job"],emotionMin:{frustration:50}},["EXPRESS_CONCERN"],"work_with_frustration");
  add("R432_MONEY_WITH_FEAR",630,{focusAny:["money","rent"],emotionMin:{fear:45}},["EXPRESS_CONCERN"],"money_with_fear");
  add("R433_MONEY_WITH_SHAME",610,{focusAny:["money","rent"],emotionMin:{shame:45}},["EXPRESS_SYMPATHY"],"money_with_shame");
  add("R434_TRAVEL_WITH_ANXIETY",620,{focusAny:["travel","destination"],emotionMin:{anxiety:45}},["EXPRESS_CONCERN"],"travel_with_anxiety");
  add("R435_TRAVEL_WITH_JOY",560,{focusAny:["travel","destination"],emotionMin:{joy:50}},["EXPRESS_APPROVAL"],"travel_with_joy");
  add("R436_MEETING_WITH_ANXIETY",600,{focusAny:["meeting"],emotionMin:{anxiety:45}},["EXPRESS_CONCERN"],"meeting_with_anxiety");
  add("R437_FAMILY_WITH_JOY",550,{focusAny:["family"],emotionMin:{joy:50}},["EXPRESS_JOY"],"family_with_joy");
  add("R438_FRIEND_WITH_SADNESS",600,{focusAny:["friend"],emotionMin:{sadness:45}},["EXPRESS_SYMPATHY"],"friend_with_sadness");
  add("R439_CONTACT_WITH_ANXIETY",610,{focusAny:["contact"],emotionMin:{anxiety:45}},["EXPRESS_CONCERN"],"contact_with_anxiety");
  add("R440_RETURN_WITH_JOY",560,{focusAny:["return"],emotionMin:{joy:50}},["EXPRESS_JOY"],"return_with_joy");

  // Conversation management and repair.
  add("R441_CONFUSION_HIGH_DETAILS",640,{emotionMin:{confusion:70}},["ASK_FOR_DETAILS"],"high_confusion_details");
  add("R442_CONFUSION_WITH_QUESTION",650,{intentAny:["ask_question"],emotionMin:{confusion:55}},["EXPRESS_NEED_CLARITY"],"confused_question_needs_clarity");
  add("R443_DISTRUST_WITH_QUESTION",670,{intentAny:["ask_question"],emotionMin:{distrust:55}},["ASK_FOR_HONEST_ANSWER"],"distrustful_question_honesty");
  add("R444_ANGER_WITH_QUESTION",650,{intentAny:["ask_question"],emotionMin:{anger:55}},["REQUEST_TIME"],"angry_question_time");
  add("R445_HURT_WITH_QUESTION",660,{intentAny:["ask_question"],emotionMin:{hurt:55}},["EXPRESS_CONCERN"],"hurt_question_concern");
  add("R446_SILENT_STYLE",560,{toneEq:{style:["silent","very_quiet"]}},["EXPRESS_CONCERN"],"silent_style_signal");
  add("R447_HESITATION_VERY_HIGH",680,{toneMin:{hesitation:85}},["ASK_IF_OKAY"],"very_high_hesitation");
  add("R448_NEGATIVITY_VERY_HIGH",660,{toneMin:{negativity:85}},["EXPRESS_CONCERN"],"very_high_negativity");
  add("R449_POSITIVITY_VERY_HIGH",540,{toneMin:{positivity:90},toneMax:{hesitation:30}},["EXPRESS_JOY"],"very_high_positivity");
  add("R450_FRIENDLINESS_VERY_HIGH",530,{toneMin:{friendliness:90}},["EXPRESS_CARE"],"very_high_friendliness");
  add("R451_APOLOGY_WITH_SHAME",650,{intentAny:["apologize"],emotionMin:{shame:50}},["EXPRESS_REPAIR_DESIRE"],"apology_with_shame");
  add("R452_APOLOGY_WITH_GUILT",650,{intentAny:["apologize"],emotionMin:{guilt:50}},["EXPRESS_REPAIR_DESIRE"],"apology_with_guilt");
  add("R453_REJECT_APOLOGY_HURT",700,{intentAny:["reject_apology"],emotionMin:{hurt:45}},["DECLINE_FOR_NOW"],"rejected_apology_hurt");
  add("R454_ACCEPT_APOLOGY_RELIEF",620,{intentAny:["accept_apology"],emotionMin:{relief:45}},["EXPRESS_RELIEF"],"accepted_apology_relief");
  add("R455_REPORT_NEEDS_DETAILS",500,{intentAny:["report_event"],toneEq:{certainty:["low","uncertain"]}},["ASK_FOR_DETAILS"],"uncertain_event_details");
  add("R456_GENERIC_HURT_REPORT",610,{claimTypeAny:["report"],emotionMin:{hurt:50}},["EXPRESS_CONCERN"],"hurt_report_claim");
  add("R457_GENERIC_SAD_REPORT",600,{claimTypeAny:["report"],emotionMin:{sadness:50}},["EXPRESS_SYMPATHY"],"sad_report_claim");
  add("R458_GENERIC_JOY_REPORT",550,{claimTypeAny:["report"],emotionMin:{joy:50}},["EXPRESS_APPROVAL"],"joy_report_claim");
  add("R459_GENERIC_FEAR_REPORT",620,{claimTypeAny:["report"],emotionMin:{fear:50}},["EXPRESS_CONCERN"],"fear_report_claim");
  add("R460_GENERIC_SURPRISE_REPORT",560,{claimTypeAny:["report"],emotionMin:{surprise:50}},["EXPRESS_SURPRISE"],"surprise_report_claim");

  // Relationship and attachment nuance.
  add("R461_LOVE_WITH_JOY",610,{focusAny:["love","like"],emotionMin:{joy:50}},["EXPRESS_JOY"],"love_with_joy");
  add("R462_LOVE_WITH_SADNESS",650,{focusAny:["love","like"],emotionMin:{sadness:50}},["EXPRESS_CARE"],"love_with_sadness");
  add("R463_LOVE_WITH_ANXIETY",660,{focusAny:["love","like"],emotionMin:{anxiety:50}},["EXPRESS_CARE"],"love_with_anxiety");
  add("R464_TRUST_WITH_HURT",660,{focusAny:["trust"],emotionMin:{hurt:50}},["EXPRESS_CONCERN"],"trust_with_hurt");
  add("R465_TRUST_WITH_ANGER",650,{focusAny:["trust"],emotionMin:{anger:50}},["ASK_FOR_HONEST_ANSWER"],"trust_with_anger");
  add("R466_BETRAYAL_WITH_FEAR",680,{focusAny:["betrayal"],emotionMin:{fear:50}},["EXPRESS_CONCERN"],"betrayal_with_fear");
  add("R467_BETRAYAL_WITH_ANGER",680,{focusAny:["betrayal"],emotionMin:{anger:50}},["ASK_FOR_HONEST_ANSWER"],"betrayal_with_anger");
  add("R468_ABANDONMENT_WITH_LONELINESS",680,{focusAny:["abandonment"],emotionMin:{loneliness:50},boundaryNone:["leave_me_alone","stop_conversation"]},["OFFER_COMPANY"],"abandonment_with_loneliness");
  add("R469_ABANDONMENT_WITH_SADNESS",680,{focusAny:["abandonment"],emotionMin:{sadness:50}},["EXPRESS_CARE"],"abandonment_with_sadness");
  add("R470_RELATIONSHIP_WITH_CONFUSION",620,{focusAny:["relationship"],emotionMin:{confusion:50}},["ASK_TO_TALK"],"relationship_with_confusion");
  add("R471_RELATIONSHIP_WITH_DISTRUST",660,{focusAny:["relationship"],emotionMin:{distrust:50}},["ASK_FOR_TRUST"],"relationship_with_distrust");
  add("R472_RELATIONSHIP_WITH_RELIEF",570,{focusAny:["relationship"],emotionMin:{relief:50}},["EXPRESS_RELIEF"],"relationship_with_relief");
  add("R473_RELATIONSHIP_WITH_PRIDE",560,{focusAny:["relationship"],intentAny:["express_pride"]},["EXPRESS_PRIDE"],"relationship_with_pride");
  add("R474_DISTANCE_WITH_HURT",700,{intentAny:["request_distance"],emotionMin:{hurt:50}},["ACCEPT_DISTANCE"],"distance_with_hurt");
  add("R475_DISTANCE_WITH_ANGER",710,{intentAny:["request_distance"],emotionMin:{anger:50}},["ACCEPT_DISTANCE"],"distance_with_anger");
  add("R476_DISTANCE_WITH_SADNESS",690,{intentAny:["request_distance"],emotionMin:{sadness:50}},["TEMPORARY_STEP_BACK"],"distance_with_sadness");
  add("R477_GOODBYE_WITH_SADNESS",590,{intentAny:["say_goodbye"],emotionMin:{sadness:50}},["SAY_GOODBYE_TEMPORARY"],"goodbye_with_sadness");
  add("R478_GOODBYE_WITH_AFFECTION",590,{intentAny:["say_goodbye"],emotionMin:{affection:50}},["EXPRESS_MISSING"],"goodbye_with_affection");
  add("R479_GREETING_WITH_AFFECTION",550,{intentAny:["greet"],emotionMin:{affection:50}},["EXPRESS_CARE"],"greeting_with_affection");
  add("R480_GREETING_WITH_JOY",540,{intentAny:["greet"],emotionMin:{joy:50}},["EXPRESS_JOY"],"greeting_with_joy");

  // NPC psychology interacting with current input.
  add("R481_PSY_CARE_HESITATION",610,{psychologyMin:{care:65},toneMin:{hesitation:55}},["EXPRESS_CONCERN"],"npc_care_hesitant_input");
  add("R482_PSY_TENDER_SAD",610,{psychologyMin:{tenderness:65},emotionMin:{sadness:50}},["EXPRESS_SYMPATHY"],"npc_tender_sad_input");
  add("R483_PSY_EMPATHY_HURT",620,{psychologyMin:{empathy:65},emotionMin:{hurt:50}},["EXPRESS_CONCERN"],"npc_empathy_hurt_input");
  add("R484_PSY_EMPATHY_FEAR",620,{psychologyMin:{empathy:65},emotionMin:{fear:50}},["EXPRESS_CONCERN"],"npc_empathy_fear_input");
  add("R485_PSY_CARE_LONELY",610,{psychologyMin:{care:65},emotionMin:{loneliness:50},boundaryNone:["leave_me_alone","stop_conversation"]},["OFFER_COMPANY"],"npc_care_lonely_input");
  add("R486_PSY_FEARLOSS_DISTANCE",700,{psychologyMin:{fearOfLoss:65},intentAny:["request_distance"]},["EXPRESS_FEAR_OF_LOSS"],"npc_fear_loss_distance");
  add("R487_PSY_FEARLOSS_GOODBYE",620,{psychologyMin:{fearOfLoss:65},intentAny:["say_goodbye"]},["ASK_NOT_TO_DISAPPEAR"],"npc_fear_loss_goodbye");
  add("R488_PSY_JEALOUS_OTHER",600,{psychologyMin:{jealousy:65},focusAny:["other_person"]},["ASK_ABOUT_OTHER_PERSON"],"npc_jealous_other_person");
  add("R489_PSY_ANGER_APOLOGY",620,{psychologyMin:{anger:65},intentAny:["apologize"]},["REQUEST_TIME"],"npc_anger_apology");
  add("R490_PSY_CONFUSION_REPORT",580,{psychologyMin:{confusion:65},intentAny:["report_event"]},["ASK_FOR_DETAILS"],"npc_confusion_report");
  add("R491_PSY_CARE_HEALTH",600,{psychologyMin:{care:65},focusAny:["health","injury","illness"]},["EXPRESS_CONCERN"],"npc_care_health");
  add("R492_PSY_CARE_HOME",570,{psychologyMin:{care:65},focusAny:["home","shelter"]},["EXPRESS_CARE"],"npc_care_home");
  add("R493_PSY_CARE_WORK",570,{psychologyMin:{care:65},focusAny:["work","job"]},["EXPRESS_CARE"],"npc_care_work");
  add("R494_PSY_TENDER_GREETING",550,{psychologyMin:{tenderness:65},intentAny:["greet"]},["EXPRESS_CARE"],"npc_tender_greeting");
  add("R495_PSY_TENDER_GOODBYE",560,{psychologyMin:{tenderness:65},intentAny:["say_goodbye"]},["EXPRESS_MISSING"],"npc_tender_goodbye");
  add("R496_PSY_EMPATHY_APOLOGY",590,{psychologyMin:{empathy:65},intentAny:["apologize"]},["EXPRESS_REPAIR_DESIRE"],"npc_empathy_apology");
  add("R497_PSY_LONELY_GREETING",540,{psychologyMin:{loneliness:65},intentAny:["greet"]},["EXPRESS_JOY"],"npc_lonely_greeting");
  add("R498_PSY_LONELY_DEPARTURE",570,{psychologyMin:{loneliness:65},intentAny:["confirm_departure"]},["EXPRESS_MISSING"],"npc_lonely_departure");
  add("R499_PSY_CARE_RETURN",560,{psychologyMin:{care:65},focusAny:["return"]},["EXPRESS_RELIEF"],"npc_care_return");
  add("R500_PSY_EMPATHY_CONFLICT",610,{psychologyMin:{empathy:65},emotionMin:{anger:45,hurt:45}},["EXPRESS_CONCERN"],"npc_empathy_conflict");

  if (R.length !== 100) throw new Error("Expected 100 response rules, got " + R.length);
  HMW.Dialogue.registerResponseRules(R);
})();