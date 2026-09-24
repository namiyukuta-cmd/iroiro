(() => {
  "use strict";
  window.HMW = window.HMW || {};
  HMW.Dialogue = HMW.Dialogue || {};

  const R = [];
  const add = (id, priority, when, meanings, reason=id) =>
    R.push({ id, priority, when, meanings, reason });

  // Questions and information seeking.
  add("R101_ASK_REASON",620,{intentAny:["ask_reason"]},["ANSWER_UNKNOWN"],"ask_reason_received");
  add("R102_ASK_WHERE",620,{intentAny:["ask_where"]},["ANSWER_UNKNOWN"],"ask_where_received");
  add("R103_ASK_WHEN",620,{intentAny:["ask_when"]},["ANSWER_UNKNOWN"],"ask_when_received");
  add("R104_ASK_HEALTH",630,{intentAny:["ask_health"]},["ANSWER_UNKNOWN"],"ask_health_received");
  add("R105_ASK_SLEEP",610,{intentAny:["ask_sleep"]},["ANSWER_UNKNOWN"],"ask_sleep_received");
  add("R106_ASK_FOOD",610,{intentAny:["ask_food"]},["ANSWER_UNKNOWN"],"ask_food_received");
  add("R107_ASK_HOME",600,{intentAny:["ask_home"]},["ANSWER_UNKNOWN"],"ask_home_received");
  add("R108_ASK_PLAN",600,{intentAny:["ask_plan"]},["ANSWER_UNKNOWN"],"ask_plan_received");
  add("R109_ASK_PREFERENCE",600,{intentAny:["ask_preference"]},["ANSWER_UNKNOWN"],"ask_preference_received");
  add("R110_ASK_WORK",590,{intentAny:["ask_work"]},["ANSWER_UNKNOWN"],"ask_work_received");
  add("R111_ASK_MONEY",590,{intentAny:["ask_money"]},["ANSWER_UNKNOWN"],"ask_money_received");
  add("R112_ASK_HUNGER",610,{intentAny:["ask_hunger"]},["ANSWER_UNKNOWN"],"ask_hunger_received");
  add("R113_ASK_THIRST",610,{intentAny:["ask_thirst"]},["ANSWER_UNKNOWN"],"ask_thirst_received");
  add("R114_ASK_TIREDNESS",610,{intentAny:["ask_tiredness"]},["ANSWER_UNKNOWN"],"ask_tiredness_received");
  add("R115_ASK_RELATIONSHIP_STATUS",690,{intentAny:["ask_relationship_status"]},["ANSWER_UNKNOWN"],"ask_relationship_status_received");
  add("R116_ASK_FEELINGS",690,{intentAny:["ask_feelings"]},["ANSWER_UNKNOWN"],"ask_feelings_received");
  add("R117_ASK_IDENTITY",600,{intentAny:["ask_identity"]},["ANSWER_UNKNOWN"],"ask_identity_received");
  add("R118_ASK_ORIGIN",600,{intentAny:["ask_origin"]},["ANSWER_UNKNOWN"],"ask_origin_received");
  add("R119_ASK_DESTINATION",600,{intentAny:["ask_destination"]},["ANSWER_UNKNOWN"],"ask_destination_received");
  add("R120_ASK_OPINION",600,{intentAny:["ask_opinion"]},["ANSWER_UNKNOWN"],"ask_opinion_received");

  // Requests, offers, invitations and contact.
  add("R121_HELP_REQUEST_ALLOW",730,{intentAny:["ask_for_help"],policyEq:{"willingToHelp":true}},["OFFER_HELP"],"help_request_allowed");
  add("R122_HELP_REQUEST_DENY",730,{intentAny:["ask_for_help"],policyEq:{"willingToHelp":false}},["DECLINE_REQUEST"],"help_request_denied");
  add("R123_OFFER_HELP_GENERAL",590,{intentAny:["offer_help"]},["EXPRESS_GRATITUDE"],"help_offer_received");
  add("R124_REQUEST_STAY_ALLOW",720,{intentAny:["request_stay"],policyEq:{"willingToStay":true},boundaryNone:["leave_me_alone","stop_conversation"]},["AGREE_REQUEST"],"stay_request_allowed");
  add("R125_REQUEST_STAY_DENY",720,{intentAny:["request_stay"],policyEq:{"willingToStay":false}},["DECLINE_REQUEST"],"stay_request_denied");
  add("R126_REQUEST_CONTACT_ALLOW",720,{intentAny:["request_contact"],policyEq:{"allowContact":true},boundaryNone:["do_not_contact","do_not_call","do_not_message"]},["ACCEPT_CONTACT"],"contact_request_allowed");
  add("R127_REQUEST_CONTACT_DENY",760,{intentAny:["request_contact"],policyEq:{"allowContact":false}},["DECLINE_CONTACT"],"contact_request_denied");
  add("R128_OFFER_CONTACT",600,{intentAny:["offer_contact"],boundaryNone:["do_not_contact","do_not_call","do_not_message"]},["OFFER_CONTACT"],"contact_offer_received");
  add("R129_OFFER_COMPANY",610,{intentAny:["offer_company"],boundaryNone:["leave_me_alone","stop_conversation"]},["OFFER_COMPANY"],"company_offer_received");
  add("R130_ASK_TO_MEET_ALLOW",710,{intentAny:["ask_to_meet"],policyEq:{"willingToMeet":true},boundaryNone:["leave_me_alone","do_not_visit"]},["AGREE_REQUEST"],"meeting_request_allowed");
  add("R131_ASK_TO_MEET_DENY",710,{intentAny:["ask_to_meet"],policyEq:{"willingToMeet":false}},["DECLINE_REQUEST"],"meeting_request_denied");
  add("R132_ASK_TO_TALK_ALLOW",710,{intentAny:["ask_to_talk"],policyEq:{"willingToTalk":true},boundaryNone:["stop_conversation"]},["AGREE_REQUEST"],"talk_request_allowed");
  add("R133_ASK_TO_TALK_DENY",710,{intentAny:["ask_to_talk"],policyEq:{"willingToTalk":false}},["DECLINE_REQUEST"],"talk_request_denied");
  add("R134_PERMISSION_ENTER_ALLOW",730,{intentAny:["ask_permission_enter"],policyEq:{"allowEntry":true}},["AGREE_REQUEST"],"entry_permission_allowed");
  add("R135_PERMISSION_ENTER_DENY",730,{intentAny:["ask_permission_enter"],policyEq:{"allowEntry":false}},["DECLINE_REQUEST"],"entry_permission_denied");
  add("R136_PERMISSION_WAIT_ALLOW",720,{intentAny:["ask_permission_wait"],policyEq:{"allowWaiting":true}},["AGREE_REQUEST"],"wait_permission_allowed");
  add("R137_PERMISSION_WAIT_DENY",720,{intentAny:["ask_permission_wait"],policyEq:{"allowWaiting":false}},["DECLINE_REQUEST"],"wait_permission_denied");
  add("R138_REQUEST_DISTANCE",900,{intentAny:["request_distance"]},["RESPECT_BOUNDARY","ACCEPT_DISTANCE"],"distance_request_received");
  add("R139_INVITE_ACTION",610,{intentAny:["invite_action"]},["ANSWER_UNKNOWN"],"invitation_received");
  add("R140_SUGGEST_ACTION",600,{intentAny:["suggest_action"]},["ANSWER_UNKNOWN"],"suggestion_received");

  // Daily conditions and care.
  add("R141_REPORT_HEALTH",650,{intentAny:["report_condition"],focusAny:["health","injury","illness"],toneMax:{positivity:60}},["ASK_IF_OKAY"],"health_condition_reported");
  add("R142_REPORT_HUNGER",620,{intentAny:["report_condition"],focusAny:["food","hunger"],policyEq:{"canOfferFood":true}},["OFFER_FOOD"],"hunger_reported");
  add("R143_REPORT_THIRST",620,{intentAny:["report_condition"],focusAny:["water","thirst"],policyEq:{"canOfferWater":true}},["OFFER_DRINK"],"thirst_reported");
  add("R144_REPORT_TIRED",620,{intentAny:["report_condition"],focusAny:["sleep","tiredness"]},["OFFER_REST"],"tiredness_reported");
  add("R145_REPORT_COLD",610,{intentAny:["report_condition"],focusAny:["weather"],toneMax:{positivity:55}},["OFFER_WARMTH"],"cold_weather_condition");
  add("R146_REPORT_NEED_SHELTER",610,{intentAny:["report_condition"],focusAny:["shelter","home"],toneMax:{positivity:55}},["OFFER_SHELTER"],"shelter_need_reported");
  add("R147_REPORT_EVENT_SAD",640,{intentAny:["report_event"],emotionMin:{sadness:55}},["ACKNOWLEDGE_EVENT","EXPRESS_SYMPATHY"],"sad_event_reported");
  add("R148_REPORT_EVENT_HURT",650,{intentAny:["report_event"],emotionMin:{hurt:55}},["ACKNOWLEDGE_EVENT","EXPRESS_CONCERN"],"hurt_event_reported");
  add("R149_REPORT_EVENT_FEAR",650,{intentAny:["report_event"],emotionMin:{fear:55}},["ACKNOWLEDGE_EVENT","EXPRESS_CONCERN"],"fear_event_reported");
  add("R150_REPORT_EVENT_JOY",620,{intentAny:["report_event"],emotionMin:{joy:55}},["ACKNOWLEDGE_EVENT","EXPRESS_APPROVAL"],"joy_event_reported");
  add("R151_REPORT_EVENT_SURPRISE",610,{intentAny:["report_event"],emotionMin:{surprise:55}},["ACKNOWLEDGE_EVENT","EXPRESS_SURPRISE"],"surprising_event_reported");
  add("R152_REPORT_EVENT_NEUTRAL",500,{intentAny:["report_event"],emotionMax:{sadness:40,hurt:40,fear:40,joy:40,surprise:40}},["ACKNOWLEDGE_EVENT","ASK_FOR_DETAILS"],"neutral_event_reported");
  add("R153_STATE_PLAN",520,{intentAny:["state_plan"]},["STATE_PLAN"],"plan_stated");
  add("R154_STATE_PREFERENCE",520,{intentAny:["state_preference"]},["STATE_PREFERENCE"],"preference_stated");
  add("R155_CONFIRM_ARRIVAL",560,{intentAny:["confirm_arrival"]},["CONFIRM_ARRIVAL"],"arrival_confirmed");
  add("R156_CONFIRM_DEPARTURE",560,{intentAny:["confirm_departure"]},["CONFIRM_DEPARTURE"],"departure_confirmed");
  add("R157_ASK_RETURN_TIME",610,{intentAny:["ask_return_time"]},["ANSWER_UNKNOWN"],"return_time_asked");
  add("R158_HOME_AND_TIRED",630,{focusAll:["home","tiredness"]},["OFFER_REST"],"home_tiredness_combination");
  add("R159_WEATHER_AND_HOME",620,{focusAll:["weather","home"]},["OFFER_SHELTER"],"weather_home_combination");
  add("R160_HEALTH_AND_FEAR",660,{focusAny:["health","injury","illness"],emotionMin:{fear:50}},["EXPRESS_CONCERN"],"health_fear_combination");

  // Relationship, trust and repair.
  add("R161_AFFECTION_QUESTION_LOVES_TRUE",860,{intentAny:["question_affection"],factEq:{"lovesHeroine":true}},["AFFIRM_LOVE"],"affection_question_fact_true");
  add("R162_AFFECTION_QUESTION_LOVES_FALSE",860,{intentAny:["question_affection"],factEq:{"lovesHeroine":false}},["DENY_LOVE"],"affection_question_fact_false");
  add("R163_AFFECTION_QUESTION_UNKNOWN",720,{intentAny:["question_affection"],factEq:{"lovesHeroine":null}},["EXPRESS_UNCERTAINTY"],"affection_question_fact_unknown");
  add("R164_AFFIRM_AFFECTION_MUTUAL",650,{intentAny:["affirm_affection"],factEq:{"lovesHeroine":true}},["EXPRESS_CARE"],"mutual_affection");
  add("R165_FEAR_BETRAYAL_FALSE",850,{intentAny:["fear_betrayal"],factEq:{"intendsBetrayal":false}},["DENY_BETRAYAL"],"betrayal_fear_false");
  add("R166_ACCUSE_BETRAYAL_FALSE",850,{intentAny:["accuse_betrayal"],factEq:{"intendsBetrayal":false}},["DENY_BETRAYAL"],"betrayal_accusation_false");
  add("R167_BETRAYAL_TRUE",870,{intentAny:["fear_betrayal","accuse_betrayal"],factEq:{"hasBetrayed":true}},["ADMIT_BETRAYAL"],"betrayal_fact_true");
  add("R168_REASSURE_NOT_LEAVING",780,{intentAny:["seek_reassurance","request_reassurance"],factEq:{"willAbandonHeroine":false}},["REASSURE_NOT_LEAVING"],"not_abandoning_fact");
  add("R169_CONFIRM_CHOICE",780,{intentAny:["seek_reassurance","request_reassurance"],factEq:{"choosesHeroine":true}},["CONFIRM_CHOICE"],"choice_fact_true");
  add("R170_CONFIRM_TRUST",770,{intentAny:["seek_reassurance","request_reassurance"],factEq:{"trustsHeroine":true}},["CONFIRM_TRUST"],"trust_fact_true");
  add("R171_PROMISE_LOYALTY",760,{focusAny:["betrayal","trust"],factEq:{"loyalToHeroine":true}},["PROMISE_LOYALTY"],"loyalty_fact_true");
  add("R172_EXPRESS_CARE_HIGH",650,{focusAny:["relationship","love","like"],psychologyMin:{care:65}},["EXPRESS_CARE"],"relationship_care_high");
  add("R173_EXPRESS_LOSS_FEAR",640,{focusAny:["relationship","abandonment"],psychologyMin:{fearOfLoss:65}},["EXPRESS_FEAR_OF_LOSS"],"relationship_fear_of_loss");
  add("R174_REPAIR_DESIRE",640,{focusAny:["apology"],psychologyMin:{care:55}},["EXPRESS_REPAIR_DESIRE"],"repair_desire");
  add("R175_ACCEPT_APOLOGY_EMPATHY",700,{intentAny:["apologize"],policyEq:{"acceptApology":true},psychologyMin:{empathy:50}},["ACCEPT_APOLOGY"],"apology_accept_empathy");
  add("R176_DECLINE_APOLOGY_ANGER",700,{intentAny:["apologize"],policyEq:{"acceptApology":false},psychologyMin:{anger:50}},["DECLINE_FOR_NOW"],"apology_decline_anger");
  add("R177_JEALOUSY_ASK_OTHER",610,{intentAny:["express_jealousy"],boundaryNone:["stop_conversation"]},["ASK_ABOUT_OTHER_PERSON"],"jealousy_followup");
  add("R178_LONELINESS_COMPANY",620,{intentAny:["express_loneliness"],boundaryNone:["leave_me_alone","stop_conversation"]},["OFFER_COMPANY"],"loneliness_company");
  add("R179_HURT_EMPATHY",650,{intentAny:["express_hurt"],psychologyMin:{empathy:45}},["EXPRESS_CONCERN"],"hurt_empathy");
  add("R180_ANGER_CLARITY",620,{intentAny:["express_anger"],psychologyMin:{confusion:40}},["EXPRESS_NEED_CLARITY"],"anger_needs_clarity");

  // Tone combinations and conversational nuance from step 4.
  add("R181_HESITANT_POSITIVE",610,{toneMin:{hesitation:55,positivity:55}},["EXPRESS_CONCERN"],"hesitant_positive_tone");
  add("R182_HESITANT_NEGATIVE",660,{toneMin:{hesitation:65,negativity:55}},["ASK_IF_OKAY"],"hesitant_negative_tone");
  add("R183_WARM_POSITIVE",560,{toneMin:{positivity:70},toneEq:{style:["warm","friendly"]}},["EXPRESS_JOY"],"warm_positive_tone");
  add("R184_FLAT_NEGATIVE",640,{toneMin:{negativity:55},toneEq:{style:["flat","subdued"]}},["EXPRESS_CONCERN"],"flat_negative_tone");
  add("R185_QUIET_HESITANT",650,{toneMin:{hesitation:65},toneEq:{style:["quiet","subdued"]}},["ASK_IF_OKAY"],"quiet_hesitant_tone");
  add("R186_FRIENDLY_NEUTRAL",530,{toneMin:{friendliness:65},toneMax:{negativity:40}},["EXPRESS_CARE"],"friendly_neutral_tone");
  add("R187_COLD_HIGH_NEGATIVE",650,{toneMin:{negativity:65},toneEq:{style:["cold","distant"]}},["EXPRESS_NEED_CLARITY"],"cold_negative_tone");
  add("R188_CONFIDENT_POSITIVE",540,{toneMin:{positivity:65},toneEq:{certainty:["high","explicit"]}},["EXPRESS_APPROVAL"],"confident_positive_tone");
  add("R189_UNCERTAIN_QUESTION",620,{intentAny:["ask_question"],toneEq:{certainty:["low","uncertain"]}},["EXPRESS_NEED_CLARITY"],"uncertain_question_tone");
  add("R190_HIGH_HESITATION_HEALTH",680,{focusAny:["health"],toneMin:{hesitation:75}},["ASK_IF_OKAY"],"health_high_hesitation");
  add("R191_HIGH_HESITATION_RELATIONSHIP",670,{focusAny:["relationship","love","trust"],toneMin:{hesitation:75}},["EXPRESS_CARE"],"relationship_high_hesitation");
  add("R192_HIGH_NEGATIVE_APOLOGY",650,{intentAny:["apologize"],toneMin:{negativity:65}},["EXPRESS_REPAIR_DESIRE"],"apology_negative_tone");
  add("R193_POSITIVE_GREETING",560,{intentAny:["greet"],toneMin:{positivity:70}},["EXPRESS_JOY"],"positive_greeting");
  add("R194_SUBDUED_GOODBYE",560,{intentAny:["say_goodbye"],toneEq:{style:["subdued","quiet"]}},["SAY_GOODBYE_TEMPORARY"],"subdued_goodbye");
  add("R195_STRONG_FRIENDLY_OFFER",550,{intentAny:["offer_help","offer_company"],toneMin:{friendliness:75}},["EXPRESS_GRATITUDE"],"friendly_offer");
  add("R196_RELIEF_AFTER_AGREEMENT",570,{intentAny:["agree"],emotionMin:{relief:45}},["EXPRESS_RELIEF"],"agreement_relief");
  add("R197_HURT_PLUS_ANGER",670,{emotionMin:{hurt:50,anger:50}},["EXPRESS_CONCERN"],"hurt_anger_combination");
  add("R198_FEAR_PLUS_DISTRUST",680,{emotionMin:{fear:50,distrust:50}},["EXPRESS_CONCERN","ASK_FOR_TRUST"],"fear_distrust_combination");
  add("R199_JOY_PLUS_AFFECTION",600,{emotionMin:{joy:50,affection:50}},["EXPRESS_JOY","EXPRESS_CARE"],"joy_affection_combination");
  add("R200_SADNESS_PLUS_LONELINESS",650,{emotionMin:{sadness:50,loneliness:50},boundaryNone:["leave_me_alone","stop_conversation"]},["EXPRESS_SYMPATHY","OFFER_COMPANY"],"sadness_loneliness_combination");

  if (R.length !== 100) throw new Error("Expected 100 response rules, got " + R.length);
  HMW.Dialogue.registerResponseRules(R);
})();