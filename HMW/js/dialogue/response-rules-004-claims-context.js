(() => {
  "use strict";
  window.HMW = window.HMW || {};
  HMW.Dialogue = HMW.Dialogue || {};

  const R = [];
  const add = (id, priority, when, meanings, reason=id) =>
    R.push({ id, priority, when, meanings, reason });

  // Claim interpretation from step 4: treat claims as claims, never as NPC facts.
  add("R301_CLAIM_FEAR_LOVE",760,{claimConceptAny:["love","like"],claimTypeAny:["speaker_fear"]},["ASK_AFFECTION_REASON","EXPRESS_CARE"],"speaker_fear_about_affection");
  add("R302_CLAIM_SUSPICION_LOVE",740,{claimConceptAny:["love","like"],claimTypeAny:["speaker_suspicion"]},["ASK_AFFECTION_REASON"],"speaker_suspicion_about_affection");
  add("R303_CLAIM_QUESTION_LOVE",750,{claimConceptAny:["love","like"],claimTypeAny:["question"]},["ASK_AFFECTION_REASON"],"speaker_question_about_affection");
  add("R304_CLAIM_FEAR_BETRAYAL",780,{claimConceptAny:["betrayal"],claimTypeAny:["speaker_fear"]},["EXPRESS_CONCERN"],"speaker_fear_about_betrayal");
  add("R305_CLAIM_SUSPICION_BETRAYAL",780,{claimConceptAny:["betrayal"],claimTypeAny:["speaker_suspicion"]},["EXPRESS_NEED_CLARITY"],"speaker_suspicion_about_betrayal");
  add("R306_CLAIM_ACCUSATION_BETRAYAL",790,{claimConceptAny:["betrayal"],claimTypeAny:["accusation"]},["ASK_FOR_HONEST_ANSWER"],"speaker_accusation_about_betrayal");
  add("R307_CLAIM_FEAR_ABANDONMENT",790,{claimConceptAny:["abandonment"],claimTypeAny:["speaker_fear"]},["EXPRESS_CARE"],"speaker_fear_about_abandonment");
  add("R308_CLAIM_SUSPICION_ABANDONMENT",760,{claimConceptAny:["abandonment"],claimTypeAny:["speaker_suspicion"]},["ASK_TO_TALK"],"speaker_suspicion_about_abandonment");
  add("R309_CLAIM_FEAR_HARM",800,{claimConceptAny:["harm"],claimTypeAny:["speaker_fear"]},["REASSURE_SAFETY"],"speaker_fear_about_harm");
  add("R310_CLAIM_FEAR_DEATH",800,{claimConceptAny:["death"],claimTypeAny:["speaker_fear"]},["EXPRESS_CONCERN"],"speaker_fear_about_death");
  add("R311_CLAIM_TRUST_POSITIVE",650,{claimConceptAny:["trust"],claimTypeAny:["speaker_fact"],claimPolarityEq:true},["CONFIRM_TRUST"],"speaker_reports_trust");
  add("R312_CLAIM_TRUST_NEGATIVE",700,{claimConceptAny:["trust"],claimTypeAny:["speaker_fact"],claimPolarityEq:false},["ASK_FOR_TRUST"],"speaker_reports_distrust");
  add("R313_CLAIM_PLAN",520,{claimTypeAny:["plan"]},["STATE_PLAN"],"speaker_plan_claim");
  add("R314_CLAIM_PREFERENCE",520,{claimTypeAny:["preference"]},["STATE_PREFERENCE"],"speaker_preference_claim");
  add("R315_CLAIM_REQUEST",610,{claimTypeAny:["request"]},["ASK_FOR_ANSWER"],"speaker_request_claim");
  add("R316_CLAIM_BOUNDARY",970,{claimTypeAny:["boundary"]},["RESPECT_BOUNDARY"],"speaker_boundary_claim");
  add("R317_CLAIM_REPORT",500,{claimTypeAny:["report"]},["ACKNOWLEDGE_EVENT"],"speaker_report_claim");
  add("R318_CLAIM_QUESTION_GENERIC",480,{claimTypeAny:["question"]},["ANSWER_UNKNOWN"],"speaker_question_claim");
  add("R319_CLAIM_ACCUSATION_GENERIC",620,{claimTypeAny:["accusation"]},["EXPRESS_NEED_CLARITY"],"speaker_accusation_generic");
  add("R320_CLAIM_SUSPICION_GENERIC",590,{claimTypeAny:["speaker_suspicion"]},["EXPRESS_NEED_CLARITY"],"speaker_suspicion_generic");

  // Questions combined with emotion.
  add("R321_Q_FEAR",660,{intentAny:["ask_question"],emotionMin:{fear:60}},["EXPRESS_CONCERN"],"fearful_question");
  add("R322_Q_HURT",660,{intentAny:["ask_question"],emotionMin:{hurt:60}},["EXPRESS_CONCERN"],"hurt_question");
  add("R323_Q_ANGER",650,{intentAny:["ask_question"],emotionMin:{anger:60}},["EXPRESS_NEED_CLARITY"],"angry_question");
  add("R324_Q_ANXIETY",650,{intentAny:["ask_question"],emotionMin:{anxiety:60}},["EXPRESS_CONCERN"],"anxious_question");
  add("R325_Q_DISTRUST",660,{intentAny:["ask_question"],emotionMin:{distrust:60}},["ASK_FOR_HONEST_ANSWER"],"distrustful_question");
  add("R326_Q_LONELINESS",620,{intentAny:["ask_question"],emotionMin:{loneliness:60},boundaryNone:["leave_me_alone","stop_conversation"]},["OFFER_COMPANY"],"lonely_question");
  add("R327_Q_JEALOUSY",620,{intentAny:["ask_question"],emotionMin:{jealousy:60}},["ASK_ABOUT_OTHER_PERSON"],"jealous_question");
  add("R328_Q_CONFUSION",620,{intentAny:["ask_question"],emotionMin:{confusion:60}},["ASK_FOR_DETAILS"],"confused_question");
  add("R329_Q_SADNESS",620,{intentAny:["ask_question"],emotionMin:{sadness:60}},["EXPRESS_SYMPATHY"],"sad_question");
  add("R330_Q_HOPE",560,{intentAny:["ask_question"],emotionMin:{hope:60}},["EXPRESS_HOPE"],"hopeful_question");
  add("R331_Q_RELATIONSHIP_FEAR",760,{questionKindAny:["relationship_status","feelings"],emotionMin:{fear:50}},["EXPRESS_CARE"],"relationship_question_fear");
  add("R332_Q_RELATIONSHIP_HURT",760,{questionKindAny:["relationship_status","feelings"],emotionMin:{hurt:50}},["EXPRESS_CONCERN"],"relationship_question_hurt");
  add("R333_Q_PERMISSION_ANXIETY",690,{questionKindAny:["permission"],emotionMin:{anxiety:50}},["EXPRESS_CARE"],"permission_question_anxiety");
  add("R334_Q_REQUEST_HESITANT",650,{questionKindAny:["request_action"],toneMin:{hesitation:55}},["EXPRESS_CARE"],"request_action_hesitant");
  add("R335_Q_INVITE_HESITANT",620,{questionKindAny:["invitation"],toneMin:{hesitation:55}},["EXPRESS_CARE"],"invitation_hesitant");
  add("R336_Q_REASON_ANGER",650,{questionKindAny:["reason"],emotionMin:{anger:50}},["ASK_FOR_HONEST_ANSWER"],"reason_question_anger");
  add("R337_Q_FACT_DISTRUST",650,{questionKindAny:["fact"],emotionMin:{distrust:50}},["ASK_FOR_HONEST_ANSWER"],"fact_question_distrust");
  add("R338_Q_CERTAINTY_ANXIETY",650,{questionKindAny:["certainty"],emotionMin:{anxiety:50}},["EXPRESS_CONCERN"],"certainty_question_anxiety");
  add("R339_Q_PLAN_ANXIETY",630,{questionKindAny:["plan"],emotionMin:{anxiety:50}},["EXPRESS_CONCERN"],"plan_question_anxiety");
  add("R340_Q_WHERE_FEAR",650,{questionKindAny:["where"],emotionMin:{fear:50}},["EXPRESS_CONCERN"],"where_question_fear");

  // Relationship facts and policy combinations.
  add("R341_FACT_LOVE_TRUE_FEAR",870,{focusAny:["love"],factEq:{"lovesHeroine":true},emotionMin:{fear:45}},["AFFIRM_LOVE","EXPRESS_CARE"],"love_true_with_fear");
  add("R342_FACT_LOVE_TRUE_HURT",870,{focusAny:["love"],factEq:{"lovesHeroine":true},emotionMin:{hurt:45}},["AFFIRM_LOVE","EXPRESS_CONCERN"],"love_true_with_hurt");
  add("R343_FACT_LOVE_FALSE_QUESTION",870,{intentAny:["question_affection"],factEq:{"lovesHeroine":false}},["DENY_LOVE"],"love_false_question");
  add("R344_FACT_TRUST_TRUE_DISTRUST",840,{focusAny:["trust"],factEq:{"trustsHeroine":true},emotionMin:{distrust:45}},["CONFIRM_TRUST"],"trust_true_despite_distrust");
  add("R345_FACT_LOYAL_TRUE_FEAR",840,{focusAny:["betrayal"],factEq:{"loyalToHeroine":true},emotionMin:{fear:45}},["PROMISE_LOYALTY"],"loyal_true_with_fear");
  add("R346_FACT_NOT_ABANDON_FEAR",850,{focusAny:["abandonment"],factEq:{"willAbandonHeroine":false},emotionMin:{fear:45}},["DENY_ABANDONMENT","REASSURE_NOT_LEAVING"],"not_abandoning_with_fear");
  add("R347_FACT_CHOICE_TRUE_HURT",840,{focusAny:["relationship"],factEq:{"choosesHeroine":true},emotionMin:{hurt:45}},["CONFIRM_CHOICE","EXPRESS_CONCERN"],"choice_true_with_hurt");
  add("R348_PSY_CARE_RELATIONSHIP",620,{focusAny:["relationship","love"],psychologyMin:{care:60}},["EXPRESS_CARE"],"care_relationship");
  add("R349_PSY_TENDER_RELATIONSHIP",620,{focusAny:["relationship","love"],psychologyMin:{tenderness:60}},["EXPRESS_CARE"],"tenderness_relationship");
  add("R350_PSY_EMPATHY_HURT",640,{intentAny:["express_hurt"],psychologyMin:{empathy:60}},["EXPRESS_CONCERN"],"empathy_to_hurt");
  add("R351_PSY_FEARLOSS_ABANDON",650,{focusAny:["abandonment"],psychologyMin:{fearOfLoss:60}},["EXPRESS_FEAR_OF_LOSS"],"fear_loss_abandonment");
  add("R352_PSY_JEALOUS_RELATION",600,{focusAny:["relationship"],psychologyMin:{jealousy:60}},["EXPRESS_JEALOUSY"],"npc_jealousy_relationship");
  add("R353_PSY_LONELY_RELATION",600,{focusAny:["relationship"],psychologyMin:{loneliness:60},boundaryNone:["leave_me_alone","stop_conversation"]},["EXPRESS_LONELINESS"],"npc_loneliness_relationship");
  add("R354_REPAIR_CARE_HIGH",650,{focusAny:["apology"],psychologyMin:{care:60}},["ASK_TO_REPAIR"],"repair_with_care");
  add("R355_REPAIR_EMPATHY_HIGH",640,{intentAny:["apologize"],psychologyMin:{empathy:60}},["EXPRESS_REPAIR_DESIRE"],"repair_with_empathy");
  add("R356_REPAIR_ANGER_HIGH",650,{intentAny:["apologize"],psychologyMin:{anger:70}},["REQUEST_TIME"],"repair_with_anger");
  add("R357_DISTANCE_CARE_HIGH",700,{intentAny:["request_distance"],psychologyMin:{care:60}},["ACCEPT_DISTANCE","TEMPORARY_STEP_BACK"],"distance_with_care");
  add("R358_DISTANCE_FEARLOSS_HIGH",690,{intentAny:["request_distance"],psychologyMin:{fearOfLoss:70}},["EXPRESS_FEAR_OF_LOSS"],"distance_fear_of_loss");
  add("R359_GOODBYE_CARE",590,{intentAny:["say_goodbye"],psychologyMin:{care:60}},["SAY_GOODBYE_TEMPORARY"],"goodbye_with_care");
  add("R360_GOODBYE_RETURN",600,{intentAny:["say_goodbye"],factEq:{"willReturn":true}},["PROMISE_RETURN"],"goodbye_return_fact");

  // Daily-life and event response combinations.
  add("R361_REPORT_WORK_HURT",630,{intentAny:["report_event"],focusAny:["work"],emotionMin:{hurt:50}},["EXPRESS_SYMPATHY"],"work_event_hurt");
  add("R362_REPORT_WORK_ANGER",620,{intentAny:["report_event"],focusAny:["work"],emotionMin:{anger:50}},["EXPRESS_CONCERN"],"work_event_anger");
  add("R363_REPORT_WORK_JOY",570,{intentAny:["report_event"],focusAny:["work"],emotionMin:{joy:50}},["EXPRESS_APPROVAL"],"work_event_joy");
  add("R364_REPORT_MONEY_ANXIETY",630,{intentAny:["report_event","report_condition"],focusAny:["money"],emotionMin:{anxiety:50}},["EXPRESS_CONCERN"],"money_report_anxiety");
  add("R365_REPORT_HOME_FEAR",630,{intentAny:["report_event"],focusAny:["home"],emotionMin:{fear:50}},["EXPRESS_CONCERN"],"home_event_fear");
  add("R366_REPORT_TRAVEL_FEAR",630,{intentAny:["report_event"],focusAny:["travel"],emotionMin:{fear:50}},["EXPRESS_CONCERN"],"travel_event_fear");
  add("R367_REPORT_MEETING_JOY",570,{intentAny:["report_event"],focusAny:["meeting"],emotionMin:{joy:50}},["EXPRESS_JOY"],"meeting_event_joy");
  add("R368_REPORT_FAMILY_SAD",620,{intentAny:["report_event"],focusAny:["family"],emotionMin:{sadness:50}},["EXPRESS_SYMPATHY"],"family_event_sad");
  add("R369_REPORT_FRIEND_HURT",620,{intentAny:["report_event"],focusAny:["friend"],emotionMin:{hurt:50}},["EXPRESS_SYMPATHY"],"friend_event_hurt");
  add("R370_REPORT_HEALTH_FEAR",650,{intentAny:["report_condition"],focusAny:["health","injury","illness"],emotionMin:{fear:50}},["EXPRESS_CONCERN"],"health_report_fear");
  add("R371_REPORT_HEALTH_RELIEF",580,{intentAny:["report_condition"],focusAny:["health"],emotionMin:{relief:50}},["EXPRESS_RELIEF"],"health_report_relief");
  add("R372_REPORT_SLEEP_BAD",610,{intentAny:["report_condition"],focusAny:["sleep"],toneMin:{negativity:50}},["OFFER_REST"],"sleep_report_negative");
  add("R373_REPORT_HUNGER_NEG",600,{intentAny:["report_condition"],focusAny:["hunger"],toneMin:{negativity:45}},["ASK_HUNGER"],"hunger_negative");
  add("R374_REPORT_THIRST_NEG",600,{intentAny:["report_condition"],focusAny:["thirst"],toneMin:{negativity:45}},["ASK_THIRST"],"thirst_negative");
  add("R375_REPORT_COLD_NEG",610,{intentAny:["report_condition"],focusAny:["weather"],toneMin:{negativity:45}},["OFFER_WARMTH"],"cold_negative");
  add("R376_PLAN_TRAVEL",540,{claimTypeAny:["plan"],focusAny:["travel"]},["STATE_PLAN"],"travel_plan_claim");
  add("R377_PLAN_RETURN",560,{claimTypeAny:["plan"],focusAny:["return"]},["PROMISE_RETURN"],"return_plan_claim");
  add("R378_PREFERENCE_FOOD",520,{claimTypeAny:["preference"],focusAny:["food"]},["STATE_PREFERENCE"],"food_preference_claim");
  add("R379_PREFERENCE_PLACE",520,{claimTypeAny:["preference"],focusAny:["place","home"]},["STATE_PREFERENCE"],"place_preference_claim");
  add("R380_REPORT_NEUTRAL",430,{claimTypeAny:["report"],emotionMax:{anger:35,hurt:35,fear:35,sadness:35,joy:35}},["ACKNOWLEDGE_EVENT"],"neutral_report_claim");

  // Tone and NPC psychology combinations.
  add("R381_TONE_WARM_HESITANT",600,{toneEq:{style:["warm","friendly"]},toneMin:{hesitation:50}},["EXPRESS_CARE"],"warm_hesitant_tone");
  add("R382_TONE_SUBDUED_HURT",650,{toneEq:{style:["subdued","quiet"]},emotionMin:{hurt:45}},["EXPRESS_CONCERN"],"subdued_hurt_tone");
  add("R383_TONE_SUBDUED_SAD",640,{toneEq:{style:["subdued","quiet"]},emotionMin:{sadness:45}},["EXPRESS_SYMPATHY"],"subdued_sad_tone");
  add("R384_TONE_PLAYFUL_JOY",540,{toneEq:{style:["playful","cheerful"]},emotionMin:{joy:45}},["EXPRESS_JOY"],"playful_joy_tone");
  add("R385_TONE_AFFECTIONATE",570,{toneEq:{style:["affectionate","warm"]},emotionMin:{affection:45}},["EXPRESS_CARE"],"affectionate_tone");
  add("R386_TONE_NERVOUS_FEAR",650,{toneEq:{style:["nervous"]},emotionMin:{fear:45}},["EXPRESS_CONCERN"],"nervous_fear_tone");
  add("R387_TONE_ANGRY_HURT",650,{toneEq:{style:["angry"]},emotionMin:{hurt:45}},["EXPRESS_CONCERN"],"angry_hurt_tone");
  add("R388_TONE_COLD_RELATION",650,{toneEq:{style:["cold","distant"]},focusAny:["relationship"]},["ASK_TO_TALK"],"cold_relationship_tone");
  add("R389_TONE_DOUBTFUL_TRUST",650,{toneEq:{style:["doubtful"]},focusAny:["trust"]},["ASK_FOR_TRUST"],"doubtful_trust_tone");
  add("R390_TONE_APOLOGETIC_RELATION",610,{toneEq:{style:["apologetic"]},focusAny:["relationship","apology"]},["EXPRESS_REPAIR_DESIRE"],"apologetic_relationship_tone");
  add("R391_PSY_CARE_FEAR",600,{psychologyMin:{care:60},emotionMin:{fear:50}},["EXPRESS_CONCERN"],"care_response_to_fear");
  add("R392_PSY_CARE_SAD",600,{psychologyMin:{care:60},emotionMin:{sadness:50}},["EXPRESS_SYMPATHY"],"care_response_to_sadness");
  add("R393_PSY_EMPATHY_ANXIETY",610,{psychologyMin:{empathy:60},emotionMin:{anxiety:50}},["EXPRESS_CONCERN"],"empathy_response_to_anxiety");
  add("R394_PSY_EMPATHY_SHAME",610,{psychologyMin:{empathy:60},emotionMin:{shame:50}},["EXPRESS_SYMPATHY"],"empathy_response_to_shame");
  add("R395_PSY_EMPATHY_GUILT",610,{psychologyMin:{empathy:60},emotionMin:{guilt:50}},["EXPRESS_SYMPATHY"],"empathy_response_to_guilt");
  add("R396_PSY_ANGER_DISTRUST",610,{psychologyMin:{anger:60},emotionMin:{distrust:50}},["EXPRESS_NEED_CLARITY"],"anger_response_to_distrust");
  add("R397_PSY_CONFUSION_QUESTION",590,{psychologyMin:{confusion:60},intentAny:["ask_question"]},["ASK_FOR_DETAILS"],"npc_confusion_question");
  add("R398_PSY_LONELY_GOODBYE",590,{psychologyMin:{loneliness:60},intentAny:["say_goodbye"]},["EXPRESS_MISSING"],"npc_loneliness_goodbye");
  add("R399_PSY_FEARLOSS_GOODBYE",620,{psychologyMin:{fearOfLoss:65},intentAny:["say_goodbye"]},["ASK_NOT_TO_DISAPPEAR"],"npc_fear_loss_goodbye");
  add("R400_PSY_TENDER_GREETING",540,{psychologyMin:{tenderness:65},intentAny:["greet"]},["EXPRESS_CARE"],"npc_tender_greeting");

  if (R.length !== 100) throw new Error("Expected 100 response rules, got " + R.length);
  HMW.Dialogue.registerResponseRules(R);
})();