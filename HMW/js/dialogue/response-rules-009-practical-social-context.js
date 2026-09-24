(() => {
  "use strict";
  window.HMW = window.HMW || {};
  HMW.Dialogue = HMW.Dialogue || {};

  const R = [];
  const add = (id, priority, when, meanings, reason=id) =>
    R.push({ id, priority, when, meanings, reason });

  // Practical questions + affect.
  add("R801_PRICE_ANXIOUS",610,{questionAny:{kindAny:["price"]},emotionMin:{anxiety:45}},["EXPRESS_CONCERN"],"price_question_anxious");
  add("R802_PRICE_FRUSTRATED",600,{questionAny:{kindAny:["price"]},emotionMin:{frustration:45}},["EXPRESS_CONCERN"],"price_question_frustrated");
  add("R803_QUANTITY_ANXIOUS",600,{questionAny:{kindAny:["quantity"]},emotionMin:{anxiety:45}},["EXPRESS_CONCERN"],"quantity_question_anxious");
  add("R804_QUANTITY_CONFUSED",590,{questionAny:{kindAny:["quantity"]},emotionMin:{confusion:45}},["ASK_FOR_DETAILS"],"quantity_question_confused");
  add("R805_POSSESSION_ANXIOUS",610,{questionAny:{kindAny:["possession"]},emotionMin:{anxiety:45}},["EXPRESS_CONCERN"],"possession_question_anxious");
  add("R806_POSSESSION_DISTRUST",620,{questionAny:{kindAny:["possession"]},emotionMin:{distrust:45}},["ASK_FOR_HONEST_ANSWER"],"possession_question_distrust");
  add("R807_CAPABILITY_ANXIOUS",610,{questionAny:{kindAny:["capability"]},emotionMin:{anxiety:45}},["EXPRESS_CONCERN"],"capability_question_anxious");
  add("R808_CAPABILITY_HOPEFUL",550,{questionAny:{kindAny:["capability"]},emotionMin:{hope:45}},["EXPRESS_HOPE"],"capability_question_hopeful");
  add("R809_AVAILABILITY_ANXIOUS",610,{questionAny:{kindAny:["availability"]},emotionMin:{anxiety:45}},["EXPRESS_CONCERN"],"availability_question_anxious");
  add("R810_AVAILABILITY_JOY",540,{questionAny:{kindAny:["availability"]},emotionMin:{joy:45}},["EXPRESS_JOY"],"availability_question_joy");
  add("R811_WORK_LOCATION_ANXIOUS",600,{questionAny:{kindAny:["work_location"]},emotionMin:{anxiety:45}},["EXPRESS_CONCERN"],"work_location_question_anxious");
  add("R812_JOB_ROLE_FRIENDLY",520,{questionAny:{kindAny:["job_role"]},toneMin:{friendliness:60}},["EXPRESS_CARE"],"job_role_question_friendly");
  add("R813_KNOWLEDGE_CONFUSED",590,{questionAny:{kindAny:["knowledge"]},emotionMin:{confusion:45}},["ASK_FOR_DETAILS"],"knowledge_question_confused");
  add("R814_FACT_CONFUSED",590,{questionAny:{kindAny:["fact"]},emotionMin:{confusion:45}},["ASK_FOR_DETAILS"],"fact_question_confused");
  add("R815_CHOICE_ANXIOUS",610,{questionAny:{kindAny:["choice"]},emotionMin:{anxiety:45}},["EXPRESS_CONCERN"],"choice_question_anxious");
  add("R816_CHOICE_HOPE",550,{questionAny:{kindAny:["choice"]},emotionMin:{hope:45}},["EXPRESS_HOPE"],"choice_question_hopeful");
  add("R817_CERTAINTY_DISTRUST",620,{questionAny:{kindAny:["certainty"]},emotionMin:{distrust:45}},["ASK_FOR_HONEST_ANSWER"],"certainty_question_distrust");
  add("R818_CERTAINTY_FEAR",620,{questionAny:{kindAny:["certainty"]},emotionMin:{fear:45}},["EXPRESS_CONCERN"],"certainty_question_fear");
  add("R819_EVENT_SAD_QUESTION",610,{questionAny:{kindAny:["event"]},emotionMin:{sadness:45}},["EXPRESS_SYMPATHY"],"event_question_sad");
  add("R820_EVENT_HURT_QUESTION",620,{questionAny:{kindAny:["event"]},emotionMin:{hurt:45}},["EXPRESS_CONCERN"],"event_question_hurt");

  // Practical daily reports.
  add("R821_WORK_REPORT_NEUTRAL",500,{intentAny:["report_event"],focusAny:["work","job"],emotionMax:{anger:35,hurt:35,fear:35,sadness:35,joy:35}},["ACKNOWLEDGE_EVENT"],"neutral_work_report");
  add("R822_WORK_REPORT_JOY",550,{intentAny:["report_event"],focusAny:["work","job"],emotionMin:{joy:45}},["EXPRESS_APPROVAL"],"positive_work_report");
  add("R823_WORK_REPORT_SAD",610,{intentAny:["report_event"],focusAny:["work","job"],emotionMin:{sadness:45}},["EXPRESS_SYMPATHY"],"sad_work_report");
  add("R824_WORK_REPORT_ANGER",610,{intentAny:["report_event"],focusAny:["work","job"],emotionMin:{anger:45}},["EXPRESS_CONCERN"],"angry_work_report");
  add("R825_MONEY_REPORT_NEUTRAL",500,{intentAny:["report_event"],focusAny:["money","rent"],emotionMax:{anxiety:35,fear:35,sadness:35}},["ACKNOWLEDGE_EVENT"],"neutral_money_report");
  add("R826_MONEY_REPORT_SAD",610,{intentAny:["report_event"],focusAny:["money","rent"],emotionMin:{sadness:45}},["EXPRESS_SYMPATHY"],"sad_money_report");
  add("R827_MONEY_REPORT_FRUSTRATED",610,{intentAny:["report_event"],focusAny:["money","rent"],emotionMin:{frustration:45}},["EXPRESS_CONCERN"],"frustrated_money_report");
  add("R828_HOME_REPORT_JOY",540,{intentAny:["report_event"],focusAny:["home"],emotionMin:{joy:45}},["EXPRESS_JOY"],"positive_home_report");
  add("R829_HOME_REPORT_SAD",600,{intentAny:["report_event"],focusAny:["home"],emotionMin:{sadness:45}},["EXPRESS_SYMPATHY"],"sad_home_report");
  add("R830_TRAVEL_REPORT_JOY",540,{intentAny:["report_event"],focusAny:["travel"],emotionMin:{joy:45}},["EXPRESS_APPROVAL"],"positive_travel_report");
  add("R831_TRAVEL_REPORT_ANXIETY",610,{intentAny:["report_event"],focusAny:["travel"],emotionMin:{anxiety:45}},["EXPRESS_CONCERN"],"anxious_travel_report");
  add("R832_MEETING_REPORT_JOY",540,{intentAny:["report_event"],focusAny:["meeting"],emotionMin:{joy:45}},["EXPRESS_JOY"],"positive_meeting_report");
  add("R833_MEETING_REPORT_DISAPPOINTED",600,{intentAny:["report_event"],focusAny:["meeting"],emotionMin:{disappointment:45}},["EXPRESS_SYMPATHY"],"disappointing_meeting_report");
  add("R834_FAMILY_REPORT_JOY",540,{intentAny:["report_event"],focusAny:["family"],emotionMin:{joy:45}},["EXPRESS_JOY"],"positive_family_report");
  add("R835_FAMILY_REPORT_HURT",610,{intentAny:["report_event"],focusAny:["family"],emotionMin:{hurt:45}},["EXPRESS_SYMPATHY"],"hurt_family_report");
  add("R836_FRIEND_REPORT_JOY",540,{intentAny:["report_event"],focusAny:["friend"],emotionMin:{joy:45}},["EXPRESS_JOY"],"positive_friend_report");
  add("R837_FRIEND_REPORT_ANGER",600,{intentAny:["report_event"],focusAny:["friend"],emotionMin:{anger:45}},["EXPRESS_CONCERN"],"angry_friend_report");
  add("R838_HEALTH_REPORT_SAD",620,{intentAny:["report_condition"],focusAny:["health","injury","illness"],emotionMin:{sadness:45}},["EXPRESS_SYMPATHY"],"sad_health_report");
  add("R839_HEALTH_REPORT_HOPE",560,{intentAny:["report_condition"],focusAny:["health","injury","illness"],emotionMin:{hope:45}},["EXPRESS_HOPE"],"hopeful_health_report");
  add("R840_SLEEP_REPORT_FRUSTRATED",590,{intentAny:["report_condition"],focusAny:["sleep","tiredness"],emotionMin:{frustration:45}},["OFFER_REST"],"frustrated_sleep_report");

  // Social continuity and tone.
  add("R841_GREETING_WARM",540,{intentAny:["greet"],toneEq:{style:["warm","friendly"]}},["EXPRESS_JOY"],"warm_greeting");
  add("R842_GREETING_PLAYFUL",540,{intentAny:["greet"],toneEq:{style:["playful","cheerful"]}},["EXPRESS_JOY"],"playful_greeting");
  add("R843_GREETING_SUBDUED",590,{intentAny:["greet"],toneEq:{style:["subdued","quiet"]}},["EXPRESS_CONCERN"],"subdued_greeting");
  add("R844_GREETING_COLD",580,{intentAny:["greet"],toneEq:{style:["cold","distant"]}},["EXPRESS_NEED_CLARITY"],"cold_greeting");
  add("R845_GOODBYE_WARM",540,{intentAny:["say_goodbye"],toneEq:{style:["warm","friendly"]}},["SAY_GOODBYE_TEMPORARY"],"warm_goodbye");
  add("R846_GOODBYE_PLAYFUL",530,{intentAny:["say_goodbye"],toneEq:{style:["playful","cheerful"]}},["SAY_GOODBYE"],"playful_goodbye");
  add("R847_GOODBYE_SUBDUED",590,{intentAny:["say_goodbye"],toneEq:{style:["subdued","quiet"]}},["EXPRESS_MISSING"],"subdued_goodbye");
  add("R848_GOODBYE_ANGRY",620,{intentAny:["say_goodbye"],toneEq:{style:["angry"]}},["REQUEST_TIME"],"angry_goodbye");
  add("R849_AGREE_POSITIVE",530,{intentAny:["agree"],toneMin:{positivity:65}},["EXPRESS_RELIEF"],"positive_agreement");
  add("R850_AGREE_SUBDUED",590,{intentAny:["agree"],toneEq:{style:["subdued","quiet"]}},["EXPRESS_CONCERN"],"subdued_agreement");
  add("R851_REFUSE_COLD",900,{intentAny:["refuse"],toneEq:{style:["cold","distant"]}},["RESPECT_BOUNDARY"],"cold_refusal");
  add("R852_REFUSE_NERVOUS",910,{intentAny:["refuse"],toneEq:{style:["nervous"]}},["RESPECT_BOUNDARY"],"nervous_refusal");
  add("R853_APOLOGY_WARM",560,{intentAny:["apologize"],toneEq:{style:["warm","gentle"]}},["EXPRESS_REPAIR_DESIRE"],"warm_apology");
  add("R854_APOLOGY_COLD",620,{intentAny:["apologize"],toneEq:{style:["cold","distant"]}},["EXPRESS_NEED_CLARITY"],"cold_apology");
  add("R855_APPROVAL_WARM",530,{intentAny:["express_approval"],toneEq:{style:["warm","friendly"]}},["EXPRESS_JOY"],"warm_approval");
  add("R856_DISAPPROVAL_HURT",610,{intentAny:["express_disapproval"],emotionMin:{hurt:45}},["EXPRESS_CONCERN"],"hurt_disapproval");
  add("R857_SURPRISE_JOY",540,{intentAny:["express_surprise"],emotionMin:{joy:45}},["EXPRESS_JOY"],"joyful_surprise");
  add("R858_SURPRISE_FEAR",610,{intentAny:["express_surprise"],emotionMin:{fear:45}},["EXPRESS_CONCERN"],"fearful_surprise");
  add("R859_HOPE_ANXIETY",570,{intentAny:["express_hope"],emotionMin:{anxiety:45}},["EXPRESS_HOPE"],"anxious_hope");
  add("R860_PRIDE_AFFECTION",540,{intentAny:["express_pride"],emotionMin:{affection:45}},["EXPRESS_CARE"],"pride_affection");

  // Relationship and reassurance detail.
  add("R861_AFFECTION_POSITIVE_REPORT",600,{intentAny:["affirm_affection"],emotionMin:{joy:45}},["EXPRESS_JOY"],"affirm_affection_joy");
  add("R862_AFFECTION_ANXIOUS_REPORT",640,{intentAny:["affirm_affection"],emotionMin:{anxiety:45}},["EXPRESS_CARE"],"affirm_affection_anxiety");
  add("R863_DENY_AFFECTION_HURT",720,{intentAny:["deny_affection"],emotionMin:{hurt:45}},["EXPRESS_CONCERN"],"deny_affection_hurt");
  add("R864_DENY_AFFECTION_COLD",700,{intentAny:["deny_affection"],toneEq:{style:["cold","distant"]}},["EXPRESS_NEED_CLARITY"],"deny_affection_cold");
  add("R865_FEAR_BETRAYAL_HURT",760,{intentAny:["fear_betrayal"],emotionMin:{hurt:45}},["EXPRESS_CONCERN"],"fear_betrayal_hurt");
  add("R866_FEAR_BETRAYAL_DISTRUST",770,{intentAny:["fear_betrayal"],emotionMin:{distrust:45}},["ASK_FOR_HONEST_ANSWER"],"fear_betrayal_distrust");
  add("R867_ACCUSE_BETRAYAL_ANGER",790,{intentAny:["accuse_betrayal"],emotionMin:{anger:45}},["ASK_FOR_HONEST_ANSWER"],"accuse_betrayal_anger");
  add("R868_ACCUSE_BETRAYAL_HURT",790,{intentAny:["accuse_betrayal"],emotionMin:{hurt:45}},["EXPRESS_CONCERN"],"accuse_betrayal_hurt");
  add("R869_REASSURE_ANXIETY",660,{intentAny:["request_reassurance","seek_reassurance"],emotionMin:{anxiety:45}},["EXPRESS_CARE"],"reassurance_anxiety");
  add("R870_REASSURE_DISTRUST",670,{intentAny:["request_reassurance","seek_reassurance"],emotionMin:{distrust:45}},["ASK_FOR_TRUST"],"reassurance_distrust");
  add("R871_RELATIONSHIP_STATUS_HURT",650,{intentAny:["ask_relationship_status"],emotionMin:{hurt:45}},["EXPRESS_CONCERN"],"relationship_status_hurt");
  add("R872_RELATIONSHIP_STATUS_FEAR",660,{intentAny:["ask_relationship_status"],emotionMin:{fear:45}},["EXPRESS_CARE"],"relationship_status_fear");
  add("R873_FEELINGS_HURT",650,{intentAny:["ask_feelings"],emotionMin:{hurt:45}},["EXPRESS_CONCERN"],"feelings_question_hurt");
  add("R874_FEELINGS_FEAR",660,{intentAny:["ask_feelings"],emotionMin:{fear:45}},["EXPRESS_CARE"],"feelings_question_fear");
  add("R875_MEET_REQUEST_ANXIOUS",610,{intentAny:["ask_to_meet"],emotionMin:{anxiety:45}},["EXPRESS_CONCERN"],"meeting_request_anxiety");
  add("R876_TALK_REQUEST_ANXIOUS",620,{intentAny:["ask_to_talk"],emotionMin:{anxiety:45}},["EXPRESS_CONCERN"],"talk_request_anxiety");
  add("R877_STAY_REQUEST_FEAR",650,{intentAny:["request_stay"],emotionMin:{fear:45},boundaryNone:["leave_me_alone"]},["EXPRESS_CARE"],"stay_request_fear");
  add("R878_CONTACT_REQUEST_FEAR",630,{intentAny:["request_contact"],emotionMin:{fear:45},boundaryNone:["do_not_contact"]},["EXPRESS_CARE"],"contact_request_fear");
  add("R879_DISTANCE_REQUEST_HURT",710,{intentAny:["request_distance"],emotionMin:{hurt:45}},["ACCEPT_DISTANCE"],"distance_request_hurt");
  add("R880_DISTANCE_REQUEST_FEAR",720,{intentAny:["request_distance"],emotionMin:{fear:45}},["ACCEPT_DISTANCE"],"distance_request_fear");

  // NPC psychology interacting with practical/social context.
  add("R881_CARE_WORK",570,{focusAny:["work","job"],psychologyMin:{care:60}},["EXPRESS_CARE"],"npc_care_work_context");
  add("R882_CARE_MONEY",580,{focusAny:["money","rent"],psychologyMin:{care:60}},["EXPRESS_CONCERN"],"npc_care_money_context");
  add("R883_CARE_HEALTH",610,{focusAny:["health","injury","illness"],psychologyMin:{care:60}},["EXPRESS_CONCERN"],"npc_care_health_context");
  add("R884_CARE_HOME",570,{focusAny:["home","shelter"],psychologyMin:{care:60}},["EXPRESS_CARE"],"npc_care_home_context");
  add("R885_CARE_TRAVEL",570,{focusAny:["travel"],psychologyMin:{care:60}},["EXPRESS_CONCERN"],"npc_care_travel_context");
  add("R886_EMPATHY_WORK",580,{focusAny:["work","job"],psychologyMin:{empathy:60},emotionMin:{frustration:40}},["EXPRESS_SYMPATHY"],"npc_empathy_work_context");
  add("R887_EMPATHY_MONEY",590,{focusAny:["money","rent"],psychologyMin:{empathy:60},emotionMin:{anxiety:40}},["EXPRESS_SYMPATHY"],"npc_empathy_money_context");
  add("R888_EMPATHY_HEALTH",620,{focusAny:["health","injury","illness"],psychologyMin:{empathy:60}},["EXPRESS_SYMPATHY"],"npc_empathy_health_context");
  add("R889_TENDER_RELATIONSHIP",600,{focusAny:["relationship","love"],psychologyMin:{tenderness:60}},["EXPRESS_CARE"],"npc_tender_relationship_context");
  add("R890_TENDER_GOODBYE",560,{intentAny:["say_goodbye"],psychologyMin:{tenderness:60}},["EXPRESS_MISSING"],"npc_tender_goodbye_context");
  add("R891_FEARLOSS_REASSURE",660,{intentAny:["request_reassurance","seek_reassurance"],psychologyMin:{fearOfLoss:60}},["EXPRESS_FEAR_OF_LOSS"],"npc_fearloss_reassure");
  add("R892_FEARLOSS_MEET",590,{intentAny:["ask_to_meet"],psychologyMin:{fearOfLoss:60}},["EXPRESS_WANT_TO_BE_TOGETHER"],"npc_fearloss_meeting");
  add("R893_LONELY_MEET",590,{intentAny:["ask_to_meet"],psychologyMin:{loneliness:60},boundaryNone:["leave_me_alone"]},["EXPRESS_WANT_TO_BE_TOGETHER"],"npc_lonely_meeting");
  add("R894_LONELY_CONTACT",580,{intentAny:["request_contact"],psychologyMin:{loneliness:60},boundaryNone:["do_not_contact"]},["ACCEPT_CONTACT"],"npc_lonely_contact");
  add("R895_JEALOUS_OTHER_PERSON",610,{focusAny:["other_person"],psychologyMin:{jealousy:60}},["EXPRESS_JEALOUSY"],"npc_jealous_other_person_context");
  add("R896_ANGER_ACCUSATION",620,{claimTypeAny:["accusation"],psychologyMin:{anger:60}},["EXPRESS_ANGER"],"npc_anger_accusation_context");
  add("R897_CONFUSION_QUESTION",580,{intentAny:["ask_question"],psychologyMin:{confusion:60}},["ASK_FOR_DETAILS"],"npc_confusion_question_context");
  add("R898_CONFUSION_EVENT",570,{intentAny:["report_event"],psychologyMin:{confusion:60}},["ASK_FOR_DETAILS"],"npc_confusion_event_context");
  add("R899_CARE_REFUSAL",900,{intentAny:["refuse"],psychologyMin:{care:60}},["RESPECT_BOUNDARY"],"npc_care_refusal");
  add("R900_EMPATHY_REFUSAL",900,{intentAny:["refuse"],psychologyMin:{empathy:60}},["RESPECT_BOUNDARY"],"npc_empathy_refusal");

  if (R.length !== 100) throw new Error("Expected 100 response rules, got " + R.length);
  HMW.Dialogue.registerResponseRules(R);
})();