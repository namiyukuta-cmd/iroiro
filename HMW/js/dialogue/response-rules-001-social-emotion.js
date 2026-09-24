(() => {
  "use strict";
  window.HMW = window.HMW || {};
  HMW.Dialogue = HMW.Dialogue || {};

  const R = [];
  const add = (id, priority, when, meanings, reason=id) =>
    R.push({ id, priority, when, meanings, reason });

  // Boundaries: explicit protagonist boundaries always outrank social follow-up.
  add("R001_BOUNDARY_LEAVE_ALONE",1000,{boundaryAny:["leave_me_alone"]},["RESPECT_BOUNDARY","ACCEPT_DISTANCE"],"boundary_leave_me_alone");
  add("R002_BOUNDARY_NO_FOLLOW",1000,{boundaryAny:["do_not_follow"]},["RESPECT_BOUNDARY","PROMISE_NOT_FOLLOW"],"boundary_do_not_follow");
  add("R003_BOUNDARY_NO_TOUCH",1000,{boundaryAny:["do_not_touch"]},["RESPECT_BOUNDARY","PROMISE_NOT_TOUCH"],"boundary_do_not_touch");
  add("R004_BOUNDARY_NO_KISS",1000,{boundaryAny:["do_not_kiss"]},["RESPECT_BOUNDARY","PROMISE_NOT_KISS"],"boundary_do_not_kiss");
  add("R005_BOUNDARY_NO_HUG",1000,{boundaryAny:["do_not_hug"]},["RESPECT_BOUNDARY","PROMISE_NOT_HUG"],"boundary_do_not_hug");
  add("R006_BOUNDARY_NO_CONTACT",1000,{boundaryAny:["do_not_contact"]},["RESPECT_BOUNDARY","PROMISE_NOT_CONTACT"],"boundary_do_not_contact");
  add("R007_BOUNDARY_STOP_TALK",1000,{boundaryAny:["stop_conversation"]},["RESPECT_BOUNDARY","ACCEPT_DISTANCE"],"boundary_stop_conversation");
  add("R008_BOUNDARY_NO_WAIT",995,{boundaryAny:["do_not_wait"]},["RESPECT_BOUNDARY"],"boundary_do_not_wait");
  add("R009_BOUNDARY_NO_VISIT",995,{boundaryAny:["do_not_visit"]},["RESPECT_BOUNDARY"],"boundary_do_not_visit");
  add("R010_BOUNDARY_NO_MESSAGE",995,{boundaryAny:["do_not_message","do_not_call"]},["RESPECT_BOUNDARY","PROMISE_NOT_CONTACT"],"boundary_no_message_or_call");

  // Social and conversational intents.
  add("R011_GREETING",700,{intentAny:["greet"]},["RETURN_GREETING"],"social_greeting");
  add("R012_GOODBYE",700,{intentAny:["say_goodbye"]},["SAY_GOODBYE"],"social_goodbye");
  add("R013_APOLOGY_ACCEPT",720,{intentAny:["apologize"],policyEq:{"acceptApology":true}},["ACCEPT_APOLOGY"],"apology_accept_policy");
  add("R014_APOLOGY_DECLINE",720,{intentAny:["apologize"],policyEq:{"acceptApology":false}},["DECLINE_FOR_NOW"],"apology_decline_policy");
  add("R015_AGREEMENT",650,{intentAny:["agree"]},["EXPRESS_RELIEF"],"agreement_received");
  add("R016_REFUSAL",900,{intentAny:["refuse"]},["RESPECT_BOUNDARY"],"refusal_received");
  add("R017_APPROVAL",620,{intentAny:["express_approval"]},["EXPRESS_APPROVAL"],"approval_received");
  add("R018_DISAPPROVAL",620,{intentAny:["express_disapproval"]},["EXPRESS_DISAPPROVAL"],"disapproval_received");
  add("R019_SURPRISE",610,{intentAny:["express_surprise"]},["EXPRESS_SURPRISE"],"surprise_received");
  add("R020_HOPE",610,{intentAny:["express_hope"]},["EXPRESS_HOPE"],"hope_received");
  add("R021_PRIDE",610,{intentAny:["express_pride"]},["EXPRESS_PRIDE"],"pride_received");
  add("R022_DISAPPOINTMENT",630,{intentAny:["express_disappointment"]},["EXPRESS_SYMPATHY"],"disappointment_received");
  add("R023_REQUEST_REASSURANCE",760,{intentAny:["request_reassurance","seek_reassurance"]},["EXPRESS_CARE"],"reassurance_requested");
  add("R024_REPORT_EVENT",520,{intentAny:["report_event"]},["ACKNOWLEDGE_EVENT"],"event_reported");
  add("R025_GENERIC_QUESTION",300,{intentAny:["ask_question"]},["ANSWER_UNKNOWN"],"generic_question");

  // Protagonist emotion signals -> safe response meanings, not invented protagonist facts.
  add("R026_EMOTION_ANGER",580,{emotionMin:{anger:60}},["EXPRESS_NEED_CLARITY"],"strong_anger_signal");
  add("R027_EMOTION_HURT",650,{emotionMin:{hurt:55}},["EXPRESS_CONCERN"],"hurt_signal");
  add("R028_EMOTION_FEAR",660,{emotionMin:{fear:55}},["EXPRESS_CONCERN"],"fear_signal");
  add("R029_EMOTION_SADNESS",650,{emotionMin:{sadness:55}},["EXPRESS_SYMPATHY"],"sadness_signal");
  add("R030_EMOTION_ANXIETY",650,{emotionMin:{anxiety:55}},["EXPRESS_CONCERN"],"anxiety_signal");
  add("R031_EMOTION_DISTRUST",610,{emotionMin:{distrust:55}},["ASK_FOR_TRUST"],"distrust_signal");
  add("R032_EMOTION_JEALOUSY",610,{emotionMin:{jealousy:55}},["ASK_ABOUT_OTHER_PERSON"],"jealousy_signal");
  add("R033_EMOTION_LONELINESS",620,{emotionMin:{loneliness:55},boundaryNone:["leave_me_alone","stop_conversation"]},["OFFER_COMPANY"],"loneliness_signal");
  add("R034_EMOTION_JOY",590,{emotionMin:{joy:60}},["EXPRESS_JOY"],"joy_signal");
  add("R035_EMOTION_RELIEF",590,{emotionMin:{relief:60}},["EXPRESS_RELIEF"],"relief_signal");
  add("R036_EMOTION_AFFECTION",600,{emotionMin:{affection:60}},["EXPRESS_CARE"],"affection_signal");
  add("R037_EMOTION_DESPERATION",680,{emotionMin:{desperation:60}},["EXPRESS_CONCERN"],"desperation_signal");
  add("R038_EMOTION_CONFUSION",570,{emotionMin:{confusion:55}},["EXPRESS_NEED_CLARITY"],"confusion_signal");
  add("R039_EMOTION_SHAME",600,{emotionMin:{shame:55}},["EXPRESS_SYMPATHY"],"shame_signal");
  add("R040_EMOTION_GUILT",600,{emotionMin:{guilt:55}},["EXPRESS_SYMPATHY"],"guilt_signal");
  add("R041_EMOTION_FRUSTRATION",600,{emotionMin:{frustration:55}},["EXPRESS_CONCERN"],"frustration_signal");
  add("R042_EMOTION_SURPRISE",560,{emotionMin:{surprise:60}},["EXPRESS_SURPRISE"],"surprise_emotion_signal");
  add("R043_EMOTION_DISAPPOINTMENT",610,{emotionMin:{disappointment:55}},["EXPRESS_SYMPATHY"],"disappointment_emotion_signal");
  add("R044_EMOTION_HOPE",560,{emotionMin:{hope:60}},["EXPRESS_HOPE"],"hope_emotion_signal");

  // Focus concepts.
  add("R045_FOCUS_LOVE",700,{focusAny:["love","like"]},["ASK_AFFECTION_REASON"],"affection_topic");
  add("R046_FOCUS_TRUST",700,{focusAny:["trust"]},["CONFIRM_TRUST"],"trust_topic");
  add("R047_FOCUS_BETRAYAL",720,{focusAny:["betrayal"]},["EXPRESS_NEED_CLARITY"],"betrayal_topic");
  add("R048_FOCUS_ABANDONMENT",720,{focusAny:["abandonment"]},["EXPRESS_CARE"],"abandonment_topic");
  add("R049_FOCUS_SAFETY",690,{focusAny:["safety"]},["REASSURE_SAFETY"],"safety_topic");
  add("R050_FOCUS_HARM",690,{focusAny:["harm"]},["EXPRESS_CONCERN"],"harm_topic");
  add("R051_FOCUS_RELATIONSHIP",650,{focusAny:["relationship"]},["ASK_RELATIONSHIP_STATUS"],"relationship_topic");
  add("R052_FOCUS_APOLOGY",610,{focusAny:["apology"]},["EXPRESS_REPAIR_DESIRE"],"apology_topic");
  add("R053_FOCUS_WORK",500,{focusAny:["work","job"]},["ASK_ABOUT_WORK"],"work_topic");
  add("R054_FOCUS_FOOD",520,{focusAny:["food","hunger"]},["ASK_HUNGER"],"food_topic");
  add("R055_FOCUS_WATER",520,{focusAny:["water","thirst"]},["ASK_THIRST"],"water_topic");
  add("R056_FOCUS_SLEEP",520,{focusAny:["sleep","tiredness"]},["ASK_TIREDNESS"],"sleep_topic");
  add("R057_FOCUS_HEALTH",540,{focusAny:["health","injury","illness"]},["ASK_IF_OKAY"],"health_topic");
  add("R058_FOCUS_HOME",500,{focusAny:["home","shelter"]},["ASK_ABOUT_HOME"],"home_topic");
  add("R059_FOCUS_PLAN",500,{focusAny:["plan","future"]},["ASK_PLAN"],"plan_topic");

  // Question kinds. Known facts in response-planner outrank ANSWER_UNKNOWN later.
  add("R060_Q_WHERE",500,{questionKindAny:["where"]},["ANSWER_UNKNOWN"],"question_where");
  add("R061_Q_WHEN",500,{questionKindAny:["when"]},["ANSWER_UNKNOWN"],"question_when");
  add("R062_Q_REASON",500,{questionKindAny:["reason"]},["ANSWER_UNKNOWN"],"question_reason");
  add("R063_Q_POSSESSION",500,{questionKindAny:["possession"]},["ANSWER_UNKNOWN"],"question_possession");
  add("R064_Q_CAPABILITY",500,{questionKindAny:["capability"]},["ANSWER_UNKNOWN"],"question_capability");
  add("R065_Q_AVAILABILITY",500,{questionKindAny:["availability"]},["ANSWER_UNKNOWN"],"question_availability");
  add("R066_Q_PLAN",500,{questionKindAny:["plan"]},["ANSWER_UNKNOWN"],"question_plan");
  add("R067_Q_PREFERENCE",500,{questionKindAny:["preference"]},["ANSWER_UNKNOWN"],"question_preference");
  add("R068_Q_HEALTH",500,{questionKindAny:["health"]},["ANSWER_UNKNOWN"],"question_health");
  add("R069_Q_RELATIONSHIP",500,{questionKindAny:["relationship_status"]},["ANSWER_UNKNOWN"],"question_relationship");
  add("R070_Q_FEELINGS",500,{questionKindAny:["feelings"]},["ANSWER_UNKNOWN"],"question_feelings");
  add("R071_Q_PERMISSION",620,{questionKindAny:["permission"]},["ANSWER_UNKNOWN"],"question_permission");
  add("R072_Q_REQUEST_ACTION",620,{questionKindAny:["request_action"]},["ANSWER_UNKNOWN"],"question_request_action");
  add("R073_Q_INVITATION",620,{questionKindAny:["invitation"]},["ANSWER_UNKNOWN"],"question_invitation");
  add("R074_Q_SUGGESTION",620,{questionKindAny:["suggestion"]},["ANSWER_UNKNOWN"],"question_suggestion");

  // Tone / hesitation. These are interpretations supplied by step 4, not facts about the protagonist.
  add("R075_TONE_HESITATION_HIGH",640,{toneMin:{hesitation:70}},["ASK_IF_OKAY"],"high_hesitation_signal");
  add("R076_TONE_HESITATION_MEDIUM",560,{toneMin:{hesitation:45},toneMax:{hesitation:69}},["EXPRESS_CONCERN"],"medium_hesitation_signal");
  add("R077_TONE_FRIENDLY_GREETING",610,{intentAny:["greet"],toneMin:{friendliness:60}},["EXPRESS_JOY"],"friendly_greeting_signal");
  add("R078_TONE_POSITIVE_REPORT",590,{intentAny:["report_condition"],toneMin:{positivity:65},toneMax:{hesitation:35}},["EXPRESS_RELIEF"],"positive_condition_report");
  add("R079_TONE_SUBDUED_REPORT",640,{intentAny:["report_condition"],toneEq:{style:["subdued","quiet","flat"]}},["ASK_IF_OKAY"],"subdued_condition_report");
  add("R080_TONE_WARM",570,{toneEq:{style:["warm","friendly"]}},["EXPRESS_CARE"],"warm_tone_signal");
  add("R081_TONE_COLD",560,{toneEq:{style:["cold","distant"]}},["EXPRESS_NEED_CLARITY"],"cold_tone_signal");
  add("R082_TONE_UNCERTAIN",590,{toneEq:{certainty:["low","uncertain"]}},["EXPRESS_NEED_CLARITY"],"uncertain_tone_signal");
  add("R083_TONE_STRONG_NEGATIVE",620,{toneMin:{negativity:70}},["EXPRESS_CONCERN"],"strong_negative_tone");
  add("R084_TONE_STRONG_POSITIVE",540,{toneMin:{positivity:75}},["EXPRESS_JOY"],"strong_positive_tone");

  // Character facts and policies decide responses; protagonist wording never overwrites these facts.
  add("R085_FACT_LOVES_TRUE",840,{intentAny:["question_affection"],factEq:{"lovesHeroine":true}},["AFFIRM_LOVE"],"fact_loves_heroine_true");
  add("R086_FACT_LOVES_FALSE",840,{intentAny:["question_affection"],factEq:{"lovesHeroine":false}},["DENY_LOVE"],"fact_loves_heroine_false");
  add("R087_FACT_TRUST_TRUE",820,{focusAny:["trust"],factEq:{"trustsHeroine":true}},["CONFIRM_TRUST"],"fact_trusts_heroine");
  add("R088_POLICY_HELP_TRUE",700,{intentAny:["ask_for_help"],policyEq:{"willingToHelp":true}},["OFFER_HELP"],"policy_help_true");
  add("R089_POLICY_HELP_FALSE",700,{intentAny:["ask_for_help"],policyEq:{"willingToHelp":false}},["DECLINE_REQUEST"],"policy_help_false");
  add("R090_POLICY_TALK_TRUE",700,{intentAny:["ask_to_talk"],policyEq:{"willingToTalk":true}},["AGREE_REQUEST"],"policy_talk_true");
  add("R091_POLICY_TALK_FALSE",700,{intentAny:["ask_to_talk"],policyEq:{"willingToTalk":false}},["DECLINE_REQUEST"],"policy_talk_false");
  add("R092_POLICY_MEET_FALSE",700,{intentAny:["ask_to_meet"],policyEq:{"willingToMeet":false}},["DECLINE_REQUEST"],"policy_meet_false");

  // NPC psychology can influence what JS chooses, without inventing protagonist state.
  add("R093_PSY_CARE_HIGH",530,{psychologyMin:{care:70}},["EXPRESS_CARE"],"npc_care_high");
  add("R094_PSY_TENDER_HIGH",530,{psychologyMin:{tenderness:70}},["EXPRESS_CARE"],"npc_tenderness_high");
  add("R095_PSY_EMPATHY_HIGH",540,{psychologyMin:{empathy:70}},["EXPRESS_SYMPATHY"],"npc_empathy_high");
  add("R096_PSY_FEAR_LOSS_HIGH",550,{psychologyMin:{fearOfLoss:70}},["EXPRESS_FEAR_OF_LOSS"],"npc_fear_of_loss_high");
  add("R097_PSY_JEALOUSY_HIGH",520,{psychologyMin:{jealousy:70}},["EXPRESS_JEALOUSY"],"npc_jealousy_high");
  add("R098_PSY_ANGER_HIGH",520,{psychologyMin:{anger:70}},["EXPRESS_ANGER"],"npc_anger_high");
  add("R099_PSY_CONFUSION_HIGH",510,{psychologyMin:{confusion:70}},["EXPRESS_CONFUSION"],"npc_confusion_high");
  add("R100_PSY_LONELINESS_HIGH",510,{psychologyMin:{loneliness:70},boundaryNone:["leave_me_alone","stop_conversation"]},["EXPRESS_LONELINESS"],"npc_loneliness_high");

  if (R.length !== 100) throw new Error("Expected 100 response rules, got " + R.length);
  HMW.Dialogue.registerResponseRules(R);
})();