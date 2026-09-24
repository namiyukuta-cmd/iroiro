(() => {
  "use strict";
  window.HMW = window.HMW || {};
  HMW.Dialogue = HMW.Dialogue || {};

  const R = [];
  const add = (id, priority, when, meanings, reason=id) =>
    R.push({ id, priority, when, meanings, reason });

  // Low-priority lexical fallbacks from step-4 normalized lexical targets.
  add("R601_LEX_LOVE",430,{lexicalTargetAny:["love","loving"]},["ASK_AFFECTION_REASON"],"lexical_love");
  add("R602_LEX_LIKE",420,{lexicalTargetAny:["like","liking"]},["ASK_AFFECTION_REASON"],"lexical_like");
  add("R603_LEX_TRUST",430,{lexicalTargetAny:["trust","trusted"]},["ASK_FOR_TRUST"],"lexical_trust");
  add("R604_LEX_BETRAY",440,{lexicalTargetAny:["betray","betrayal","betrayed"]},["EXPRESS_NEED_CLARITY"],"lexical_betrayal");
  add("R605_LEX_LEAVE",420,{lexicalTargetAny:["leave","leaving"]},["EXPRESS_CARE"],"lexical_leave");
  add("R606_LEX_STAY",420,{lexicalTargetAny:["stay","staying"]},["REQUEST_STAY"],"lexical_stay");
  add("R607_LEX_HELP",410,{lexicalTargetAny:["help","assist"]},["OFFER_HELP"],"lexical_help");
  add("R608_LEX_HURT",430,{lexicalTargetAny:["hurt","pain"]},["EXPRESS_CONCERN"],"lexical_hurt");
  add("R609_LEX_SORRY",430,{lexicalTargetAny:["sorry","apologize","apology"]},["EXPRESS_REPAIR_DESIRE"],"lexical_apology");
  add("R610_LEX_WAIT",400,{lexicalTargetAny:["wait","waiting"]},["ASK_TO_WAIT"],"lexical_wait");
  add("R611_LEX_HOME",400,{lexicalTargetAny:["home","house"]},["ASK_ABOUT_HOME"],"lexical_home");
  add("R612_LEX_WORK",400,{lexicalTargetAny:["work","job"]},["ASK_ABOUT_WORK"],"lexical_work");
  add("R613_LEX_FOOD",400,{lexicalTargetAny:["food","eat","hungry"]},["ASK_HUNGER"],"lexical_food");
  add("R614_LEX_DRINK",400,{lexicalTargetAny:["drink","water","thirsty"]},["ASK_THIRST"],"lexical_drink");
  add("R615_LEX_SLEEP",400,{lexicalTargetAny:["sleep","sleepy","tired"]},["ASK_TIREDNESS"],"lexical_sleep");
  add("R616_LEX_MEET",400,{lexicalTargetAny:["meet","meeting"]},["ASK_TO_MEET"],"lexical_meet");
  add("R617_LEX_CALL",390,{lexicalTargetAny:["call","phone"]},["OFFER_CONTACT"],"lexical_call");
  add("R618_LEX_MESSAGE",390,{lexicalTargetAny:["message","text"]},["OFFER_CONTACT"],"lexical_message");
  add("R619_LEX_RETURN",400,{lexicalTargetAny:["return","back"]},["ASK_IF_COMING_BACK"],"lexical_return");
  add("R620_LEX_SAFE",410,{lexicalTargetAny:["safe","safety"]},["REASSURE_SAFETY"],"lexical_safety");

  // Same-claim certainty/polarity handling.
  add("R621_CLAIM_LOVE_FEAR_LOW",690,{claimAny:{conceptAny:["love","like"],typeAny:["speaker_fear"],certaintyAny:["low"]}},["EXPRESS_CARE"],"love_fear_low_certainty");
  add("R622_CLAIM_LOVE_FEAR_HIGH",760,{claimAny:{conceptAny:["love","like"],typeAny:["speaker_fear"],certaintyAny:["high","explicit"]}},["ASK_AFFECTION_REASON","EXPRESS_CARE"],"love_fear_high_certainty");
  add("R623_CLAIM_LOVE_SUSPICION_LOW",680,{claimAny:{conceptAny:["love","like"],typeAny:["speaker_suspicion"],certaintyAny:["low"]}},["EXPRESS_NEED_CLARITY"],"love_suspicion_low");
  add("R624_CLAIM_LOVE_SUSPICION_HIGH",740,{claimAny:{conceptAny:["love","like"],typeAny:["speaker_suspicion"],certaintyAny:["high","explicit"]}},["ASK_AFFECTION_REASON"],"love_suspicion_high");
  add("R625_CLAIM_TRUST_FEAR",720,{claimAny:{conceptAny:["trust"],typeAny:["speaker_fear"]}},["ASK_FOR_TRUST"],"trust_fear_claim");
  add("R626_CLAIM_TRUST_SUSPICION",730,{claimAny:{conceptAny:["trust"],typeAny:["speaker_suspicion"]}},["ASK_FOR_HONEST_ANSWER"],"trust_suspicion_claim");
  add("R627_CLAIM_TRUST_NEG_FACT",720,{claimAny:{conceptAny:["trust"],typeAny:["speaker_fact"],polarityEq:false}},["ASK_FOR_TRUST"],"trust_negative_fact_claim");
  add("R628_CLAIM_BETRAYAL_FEAR_LOW",720,{claimAny:{conceptAny:["betrayal"],typeAny:["speaker_fear"],certaintyAny:["low"]}},["EXPRESS_CONCERN"],"betrayal_fear_low");
  add("R629_CLAIM_BETRAYAL_FEAR_HIGH",780,{claimAny:{conceptAny:["betrayal"],typeAny:["speaker_fear"],certaintyAny:["high","explicit"]}},["ASK_FOR_HONEST_ANSWER"],"betrayal_fear_high");
  add("R630_CLAIM_BETRAYAL_ACCUSATION",800,{claimAny:{conceptAny:["betrayal"],typeAny:["accusation"]}},["ASK_FOR_HONEST_ANSWER"],"betrayal_accusation");
  add("R631_CLAIM_ABANDON_FEAR_LOW",720,{claimAny:{conceptAny:["abandonment"],typeAny:["speaker_fear"],certaintyAny:["low"]}},["EXPRESS_CARE"],"abandonment_fear_low");
  add("R632_CLAIM_ABANDON_FEAR_HIGH",790,{claimAny:{conceptAny:["abandonment"],typeAny:["speaker_fear"],certaintyAny:["high","explicit"]}},["REASSURE_NOT_LEAVING"],"abandonment_fear_high");
  add("R633_CLAIM_HARM_FEAR_LOW",760,{claimAny:{conceptAny:["harm"],typeAny:["speaker_fear"],certaintyAny:["low"]}},["REASSURE_SAFETY"],"harm_fear_low");
  add("R634_CLAIM_HARM_FEAR_HIGH",810,{claimAny:{conceptAny:["harm"],typeAny:["speaker_fear"],certaintyAny:["high","explicit"]}},["REASSURE_SAFETY","EXPRESS_CONCERN"],"harm_fear_high");
  add("R635_CLAIM_RELATIONSHIP_QUESTION",650,{claimAny:{conceptAny:["relationship"],typeAny:["question"]}},["ASK_RELATIONSHIP_STATUS"],"relationship_question_claim");
  add("R636_CLAIM_OTHER_PERSON_QUESTION",620,{claimAny:{conceptAny:["other_person"],typeAny:["question"]}},["ASK_ABOUT_OTHER_PERSON"],"other_person_question_claim");
  add("R637_CLAIM_APOLOGY_REPORT",580,{claimAny:{conceptAny:["apology"],typeAny:["report"]}},["ACKNOWLEDGE_EVENT"],"apology_report_claim");
  add("R638_CLAIM_PROMISE_REPORT",590,{claimAny:{conceptAny:["promise"],typeAny:["report"]}},["ACKNOWLEDGE_EVENT"],"promise_report_claim");
  add("R639_CLAIM_SAFETY_REPORT",610,{claimAny:{conceptAny:["safety"],typeAny:["report"]}},["REASSURE_SAFETY"],"safety_report_claim");
  add("R640_CLAIM_CONTACT_BOUNDARY",980,{claimAny:{conceptAny:["contact"],typeAny:["boundary"]}},["RESPECT_BOUNDARY","DECLINE_CONTACT"],"contact_boundary_claim");

  // Exact same-question action policies.
  add("R641_REQ_TALK_ALLOW",760,{questionAny:{kindAny:["request_action"],actionAny:["talk"]},policyEq:{"requestResponses.talk":true},boundaryNone:["stop_conversation"]},["ACCEPT_ACTION_REQUEST"],"request_talk_allow");
  add("R642_REQ_TALK_DENY",780,{questionAny:{kindAny:["request_action"],actionAny:["talk"]},policyEq:{"requestResponses.talk":false}},["DECLINE_ACTION_REQUEST"],"request_talk_deny");
  add("R643_REQ_MEET_ALLOW",760,{questionAny:{kindAny:["request_action"],actionAny:["meet"]},policyEq:{"requestResponses.meet":true},boundaryNone:["do_not_visit"]},["ACCEPT_ACTION_REQUEST"],"request_meet_allow");
  add("R644_REQ_MEET_DENY",780,{questionAny:{kindAny:["request_action"],actionAny:["meet"]},policyEq:{"requestResponses.meet":false}},["DECLINE_ACTION_REQUEST"],"request_meet_deny");
  add("R645_REQ_EAT_ALLOW",740,{questionAny:{kindAny:["request_action"],actionAny:["eat"]},policyEq:{"requestResponses.eat":true}},["ACCEPT_ACTION_REQUEST"],"request_eat_allow");
  add("R646_REQ_EAT_DENY",740,{questionAny:{kindAny:["request_action"],actionAny:["eat"]},policyEq:{"requestResponses.eat":false}},["DECLINE_ACTION_REQUEST"],"request_eat_deny");
  add("R647_REQ_DRINK_ALLOW",740,{questionAny:{kindAny:["request_action"],actionAny:["drink"]},policyEq:{"requestResponses.drink":true}},["ACCEPT_ACTION_REQUEST"],"request_drink_allow");
  add("R648_REQ_DRINK_DENY",740,{questionAny:{kindAny:["request_action"],actionAny:["drink"]},policyEq:{"requestResponses.drink":false}},["DECLINE_ACTION_REQUEST"],"request_drink_deny");
  add("R649_REQ_REST_ALLOW",740,{questionAny:{kindAny:["request_action"],actionAny:["rest"]},policyEq:{"requestResponses.rest":true}},["ACCEPT_ACTION_REQUEST"],"request_rest_allow");
  add("R650_REQ_REST_DENY",740,{questionAny:{kindAny:["request_action"],actionAny:["rest"]},policyEq:{"requestResponses.rest":false}},["DECLINE_ACTION_REQUEST"],"request_rest_deny");
  add("R651_INVITE_STAY_ALLOW",740,{questionAny:{kindAny:["invitation"],actionAny:["stay"]},policyEq:{"invitationResponses.stay":true},boundaryNone:["leave_me_alone"]},["ACCEPT_INVITATION"],"invite_stay_allow");
  add("R652_INVITE_STAY_DENY",750,{questionAny:{kindAny:["invitation"],actionAny:["stay"]},policyEq:{"invitationResponses.stay":false}},["DECLINE_INVITATION"],"invite_stay_deny");
  add("R653_INVITE_VISIT_ALLOW",740,{questionAny:{kindAny:["invitation"],actionAny:["visit"]},policyEq:{"invitationResponses.visit":true},boundaryNone:["do_not_visit"]},["ACCEPT_INVITATION"],"invite_visit_allow");
  add("R654_INVITE_VISIT_DENY",750,{questionAny:{kindAny:["invitation"],actionAny:["visit"]},policyEq:{"invitationResponses.visit":false}},["DECLINE_INVITATION"],"invite_visit_deny");
  add("R655_SUGGEST_EAT_ALLOW",730,{questionAny:{kindAny:["suggestion"],actionAny:["eat"]},policyEq:{"suggestionResponses.eat":true}},["ACCEPT_SUGGESTION"],"suggest_eat_allow");
  add("R656_SUGGEST_EAT_DENY",730,{questionAny:{kindAny:["suggestion"],actionAny:["eat"]},policyEq:{"suggestionResponses.eat":false}},["DECLINE_SUGGESTION"],"suggest_eat_deny");
  add("R657_SUGGEST_DRINK_ALLOW",730,{questionAny:{kindAny:["suggestion"],actionAny:["drink"]},policyEq:{"suggestionResponses.drink":true}},["ACCEPT_SUGGESTION"],"suggest_drink_allow");
  add("R658_SUGGEST_DRINK_DENY",730,{questionAny:{kindAny:["suggestion"],actionAny:["drink"]},policyEq:{"suggestionResponses.drink":false}},["DECLINE_SUGGESTION"],"suggest_drink_deny");
  add("R659_SUGGEST_MEET_ALLOW",730,{questionAny:{kindAny:["suggestion"],actionAny:["meet"]},policyEq:{"suggestionResponses.meet":true}},["ACCEPT_SUGGESTION"],"suggest_meet_allow");
  add("R660_SUGGEST_MEET_DENY",730,{questionAny:{kindAny:["suggestion"],actionAny:["meet"]},policyEq:{"suggestionResponses.meet":false}},["DECLINE_SUGGESTION"],"suggest_meet_deny");

  // Emotion combinations to make response selection less one-dimensional.
  add("R661_HURT_FEAR",680,{emotionMin:{hurt:50,fear:50}},["EXPRESS_CONCERN"],"hurt_fear_combination");
  add("R662_HURT_SADNESS",650,{emotionMin:{hurt:50,sadness:50}},["EXPRESS_SYMPATHY"],"hurt_sadness_combination");
  add("R663_HURT_DISTRUST",670,{emotionMin:{hurt:50,distrust:50}},["ASK_FOR_HONEST_ANSWER"],"hurt_distrust_combination");
  add("R664_ANGER_FEAR",660,{emotionMin:{anger:50,fear:50}},["EXPRESS_NEED_CLARITY"],"anger_fear_combination");
  add("R665_ANGER_SADNESS",650,{emotionMin:{anger:50,sadness:50}},["EXPRESS_CONCERN"],"anger_sadness_combination");
  add("R666_ANGER_DISTRUST",670,{emotionMin:{anger:50,distrust:50}},["ASK_FOR_HONEST_ANSWER"],"anger_distrust_combination");
  add("R667_ANXIETY_FEAR",660,{emotionMin:{anxiety:50,fear:50}},["EXPRESS_CONCERN"],"anxiety_fear_combination");
  add("R668_ANXIETY_LONELINESS",640,{emotionMin:{anxiety:50,loneliness:50},boundaryNone:["leave_me_alone","stop_conversation"]},["OFFER_COMPANY"],"anxiety_loneliness_combination");
  add("R669_ANXIETY_HOPE",590,{emotionMin:{anxiety:50,hope:50}},["EXPRESS_HOPE"],"anxiety_hope_combination");
  add("R670_SADNESS_LONELINESS",650,{emotionMin:{sadness:50,loneliness:50},boundaryNone:["leave_me_alone","stop_conversation"]},["OFFER_COMPANY","EXPRESS_SYMPATHY"],"sadness_loneliness");
  add("R671_SADNESS_AFFECTION",610,{emotionMin:{sadness:50,affection:50}},["EXPRESS_CARE"],"sadness_affection");
  add("R672_JOY_RELIEF",550,{emotionMin:{joy:50,relief:50}},["EXPRESS_JOY"],"joy_relief");
  add("R673_JOY_HOPE",550,{emotionMin:{joy:50,hope:50}},["EXPRESS_HOPE"],"joy_hope");
  add("R674_JOY_AFFECTION",570,{emotionMin:{joy:50,affection:50}},["EXPRESS_CARE"],"joy_affection");
  add("R675_SHAME_GUILT",630,{emotionMin:{shame:50,guilt:50}},["EXPRESS_SYMPATHY"],"shame_guilt");
  add("R676_SHAME_HURT",630,{emotionMin:{shame:50,hurt:50}},["EXPRESS_CONCERN"],"shame_hurt");
  add("R677_GUILT_ANXIETY",620,{emotionMin:{guilt:50,anxiety:50}},["EXPRESS_REPAIR_DESIRE"],"guilt_anxiety");
  add("R678_CONFUSION_ANXIETY",620,{emotionMin:{confusion:50,anxiety:50}},["ASK_FOR_DETAILS"],"confusion_anxiety");
  add("R679_SURPRISE_JOY",540,{emotionMin:{surprise:50,joy:50}},["EXPRESS_JOY"],"surprise_joy");
  add("R680_SURPRISE_FEAR",630,{emotionMin:{surprise:50,fear:50}},["EXPRESS_CONCERN"],"surprise_fear");

  // Context + NPC psychology/policy combinations.
  add("R681_CARE_REASSURANCE",650,{intentAny:["request_reassurance","seek_reassurance"],psychologyMin:{care:55}},["EXPRESS_CARE"],"care_reassurance");
  add("R682_EMPATHY_REASSURANCE",640,{intentAny:["request_reassurance","seek_reassurance"],psychologyMin:{empathy:55}},["EXPRESS_CONCERN"],"empathy_reassurance");
  add("R683_TENDER_AFFECTION",620,{intentAny:["affirm_affection"],psychologyMin:{tenderness:55}},["EXPRESS_CARE"],"tender_affection");
  add("R684_CARE_GOODBYE",590,{intentAny:["say_goodbye"],psychologyMin:{care:55}},["SAY_GOODBYE_TEMPORARY"],"care_goodbye");
  add("R685_CARE_ARRIVAL",560,{intentAny:["confirm_arrival"],psychologyMin:{care:55}},["EXPRESS_RELIEF"],"care_arrival");
  add("R686_CARE_DEPARTURE",570,{intentAny:["confirm_departure"],psychologyMin:{care:55}},["EXPRESS_CONCERN"],"care_departure");
  add("R687_EMPATHY_DISAPPOINTMENT",610,{intentAny:["express_disappointment"],psychologyMin:{empathy:55}},["EXPRESS_SYMPATHY"],"empathy_disappointment");
  add("R688_EMPATHY_LONELINESS",610,{intentAny:["express_loneliness"],psychologyMin:{empathy:55},boundaryNone:["leave_me_alone"]},["OFFER_COMPANY"],"empathy_loneliness");
  add("R689_CONFUSION_ACCUSATION",620,{claimTypeAny:["accusation"],psychologyMin:{confusion:55}},["EXPRESS_CONFUSION"],"confusion_accusation");
  add("R690_ANGER_ACCUSATION",630,{claimTypeAny:["accusation"],psychologyMin:{anger:55}},["REQUEST_TIME"],"anger_accusation");
  add("R691_CARE_HEALTH_REPORT",610,{intentAny:["report_condition"],focusAny:["health"],psychologyMin:{care:55}},["EXPRESS_CONCERN"],"care_health_report");
  add("R692_CARE_HUNGER_REPORT",580,{intentAny:["report_condition"],focusAny:["hunger","food"],psychologyMin:{care:55},policyEq:{"canOfferFood":true}},["OFFER_FOOD"],"care_hunger_report");
  add("R693_CARE_THIRST_REPORT",580,{intentAny:["report_condition"],focusAny:["thirst","water"],psychologyMin:{care:55},policyEq:{"canOfferWater":true}},["OFFER_DRINK"],"care_thirst_report");
  add("R694_CARE_TIRED_REPORT",580,{intentAny:["report_condition"],focusAny:["tiredness","sleep"],psychologyMin:{care:55}},["OFFER_REST"],"care_tired_report");
  add("R695_EMPATHY_WORK_REPORT",570,{intentAny:["report_event"],focusAny:["work"],psychologyMin:{empathy:55}},["ACKNOWLEDGE_EVENT"],"empathy_work_report");
  add("R696_EMPATHY_MONEY_REPORT",580,{intentAny:["report_event"],focusAny:["money"],psychologyMin:{empathy:55}},["EXPRESS_SYMPATHY"],"empathy_money_report");
  add("R697_TENDER_GREETING",540,{intentAny:["greet"],psychologyMin:{tenderness:55}},["RETURN_GREETING"],"tender_greeting");
  add("R698_TENDER_GOODBYE",550,{intentAny:["say_goodbye"],psychologyMin:{tenderness:55}},["EXPRESS_MISSING"],"tender_goodbye");
  add("R699_FEARLOSS_DISTANCE",690,{intentAny:["request_distance"],psychologyMin:{fearOfLoss:55}},["EXPRESS_FEAR_OF_LOSS"],"fearloss_distance");
  add("R700_FEARLOSS_RETURN",580,{focusAny:["return"],psychologyMin:{fearOfLoss:55}},["EXPRESS_RELIEF"],"fearloss_return");

  if (R.length !== 100) throw new Error("Expected 100 response rules, got " + R.length);
  HMW.Dialogue.registerResponseRules(R);
})();
