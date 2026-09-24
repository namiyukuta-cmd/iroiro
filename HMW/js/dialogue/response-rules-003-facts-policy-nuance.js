(() => {
  "use strict";
  window.HMW = window.HMW || {};
  HMW.Dialogue = HMW.Dialogue || {};

  const R = [];
  const add = (id, priority, when, meanings, reason=id) =>
    R.push({ id, priority, when, meanings, reason });

  // Fact-backed question answers.
  add("R201_FACT_LOCATION",900,{questionKindAny:["where"],factEq:{"currentLocation":"home"}},["STATE_CURRENT_LOCATION"],"known_current_location");
  add("R202_FACT_AVAILABLE_TRUE",900,{questionKindAny:["availability"],factEq:{"available":true}},["CONFIRM_AVAILABLE"],"known_available_true");
  add("R203_FACT_AVAILABLE_FALSE",900,{questionKindAny:["availability"],factEq:{"available":false}},["DENY_AVAILABLE"],"known_available_false");
  add("R204_FACT_SLEPT_TRUE",900,{intentAny:["ask_sleep"],factEq:{"sleptWell":true}},["STATE_SLEEP_STATUS_GOOD"],"known_sleep_good");
  add("R205_FACT_SLEPT_FALSE",900,{intentAny:["ask_sleep"],factEq:{"sleptWell":false}},["STATE_SLEEP_STATUS_BAD"],"known_sleep_bad");
  add("R206_FACT_EATEN_TRUE",900,{intentAny:["ask_food"],factEq:{"hasEaten":true}},["STATE_FOOD_STATUS_EATEN"],"known_food_eaten");
  add("R207_FACT_EATEN_FALSE",900,{intentAny:["ask_food"],factEq:{"hasEaten":false}},["STATE_FOOD_STATUS_NOT_EATEN"],"known_food_not_eaten");
  add("R208_FACT_HUNGRY_TRUE",900,{intentAny:["ask_hunger"],factEq:{"hungry":true}},["STATE_CONDITION"],"known_hungry_true");
  add("R209_FACT_HUNGRY_FALSE",900,{intentAny:["ask_hunger"],factEq:{"hungry":false}},["STATE_CONDITION"],"known_hungry_false");
  add("R210_FACT_THIRSTY_TRUE",900,{intentAny:["ask_thirst"],factEq:{"thirsty":true}},["STATE_CONDITION"],"known_thirsty_true");
  add("R211_FACT_THIRSTY_FALSE",900,{intentAny:["ask_thirst"],factEq:{"thirsty":false}},["STATE_CONDITION"],"known_thirsty_false");
  add("R212_FACT_TIRED_TRUE",900,{intentAny:["ask_tiredness"],factEq:{"tired":true}},["STATE_CONDITION"],"known_tired_true");
  add("R213_FACT_TIRED_FALSE",900,{intentAny:["ask_tiredness"],factEq:{"tired":false}},["STATE_CONDITION"],"known_tired_false");
  add("R214_FACT_HAS_ENOUGH_MONEY_FALSE",900,{intentAny:["ask_money"],factEq:{"hasEnoughMoney":false}},["STATE_NO_MONEY"],"known_no_money");
  add("R215_FACT_HAS_ENOUGH_MONEY_TRUE",900,{intentAny:["ask_money"],factEq:{"hasEnoughMoney":true}},["STATE_MONEY_STATUS"],"known_money_ok");
  add("R216_FACT_CERTAIN_TRUE",890,{questionKindAny:["certainty"],factEq:{"certain":true}},["EXPRESS_CERTAINTY"],"known_certainty_true");
  add("R217_FACT_CERTAIN_FALSE",890,{questionKindAny:["certainty"],factEq:{"certain":false}},["EXPRESS_UNCERTAINTY"],"known_certainty_false");
  add("R218_FACT_LOYAL_TRUE",860,{focusAny:["trust","betrayal"],factEq:{"loyalToHeroine":true}},["PROMISE_LOYALTY"],"known_loyalty_true");
  add("R219_FACT_ABANDON_FALSE",860,{focusAny:["abandonment"],factEq:{"willAbandonHeroine":false}},["DENY_ABANDONMENT"],"known_no_abandonment");
  add("R220_FACT_CHOOSES_TRUE",850,{focusAny:["relationship","love"],factEq:{"choosesHeroine":true}},["CONFIRM_CHOICE"],"known_choice_true");

  // Permission / action / invitation / suggestion policy.
  add("R221_PERMISSION_TOUCH_ALLOW",760,{questionAny:{kindAny:["permission"],actionAny:["touch"]},policyEq:{"permissions.touch":true}},["GRANT_PERMISSION"],"permission_touch_allow");
  add("R222_PERMISSION_TOUCH_DENY",760,{questionAny:{kindAny:["permission"],actionAny:["touch"]},policyEq:{"permissions.touch":false}},["DENY_PERMISSION"],"permission_touch_deny");
  add("R223_PERMISSION_HUG_ALLOW",760,{questionAny:{kindAny:["permission"],actionAny:["hug"]},policyEq:{"permissions.hug":true}},["GRANT_PERMISSION"],"permission_hug_allow");
  add("R224_PERMISSION_HUG_DENY",760,{questionAny:{kindAny:["permission"],actionAny:["hug"]},policyEq:{"permissions.hug":false}},["DENY_PERMISSION"],"permission_hug_deny");
  add("R225_PERMISSION_KISS_ALLOW",760,{questionAny:{kindAny:["permission"],actionAny:["kiss"]},policyEq:{"permissions.kiss":true}},["GRANT_PERMISSION"],"permission_kiss_allow");
  add("R226_PERMISSION_KISS_DENY",760,{questionAny:{kindAny:["permission"],actionAny:["kiss"]},policyEq:{"permissions.kiss":false}},["DENY_PERMISSION"],"permission_kiss_deny");
  add("R227_ACTION_HELP_ALLOW",750,{questionAny:{kindAny:["request_action"],actionAny:["help"]},policyEq:{"requestResponses.help":true}},["ACCEPT_ACTION_REQUEST"],"request_help_allow");
  add("R228_ACTION_HELP_DENY",750,{questionAny:{kindAny:["request_action"],actionAny:["help"]},policyEq:{"requestResponses.help":false}},["DECLINE_ACTION_REQUEST"],"request_help_deny");
  add("R229_ACTION_WAIT_ALLOW",750,{questionAny:{kindAny:["request_action"],actionAny:["wait"]},policyEq:{"requestResponses.wait":true}},["ACCEPT_ACTION_REQUEST"],"request_wait_allow");
  add("R230_ACTION_WAIT_DENY",750,{questionAny:{kindAny:["request_action"],actionAny:["wait"]},policyEq:{"requestResponses.wait":false}},["DECLINE_ACTION_REQUEST"],"request_wait_deny");
  add("R231_INVITE_MEET_ALLOW",740,{questionAny:{kindAny:["invitation"],actionAny:["meet"]},policyEq:{"invitationResponses.meet":true}},["ACCEPT_INVITATION"],"invite_meet_allow");
  add("R232_INVITE_MEET_DENY",740,{questionAny:{kindAny:["invitation"],actionAny:["meet"]},policyEq:{"invitationResponses.meet":false}},["DECLINE_INVITATION"],"invite_meet_deny");
  add("R233_INVITE_EAT_ALLOW",740,{questionAny:{kindAny:["invitation"],actionAny:["eat"]},policyEq:{"invitationResponses.eat":true}},["ACCEPT_INVITATION"],"invite_eat_allow");
  add("R234_INVITE_EAT_DENY",740,{questionAny:{kindAny:["invitation"],actionAny:["eat"]},policyEq:{"invitationResponses.eat":false}},["DECLINE_INVITATION"],"invite_eat_deny");
  add("R235_SUGGEST_REST_ALLOW",730,{questionAny:{kindAny:["suggestion"],actionAny:["rest"]},policyEq:{"suggestionResponses.rest":true}},["ACCEPT_SUGGESTION"],"suggest_rest_allow");
  add("R236_SUGGEST_REST_DENY",730,{questionAny:{kindAny:["suggestion"],actionAny:["rest"]},policyEq:{"suggestionResponses.rest":false}},["DECLINE_SUGGESTION"],"suggest_rest_deny");
  add("R237_SUGGEST_TALK_ALLOW",730,{questionAny:{kindAny:["suggestion"],actionAny:["talk"]},policyEq:{"suggestionResponses.talk":true}},["ACCEPT_SUGGESTION"],"suggest_talk_allow");
  add("R238_SUGGEST_TALK_DENY",730,{questionAny:{kindAny:["suggestion"],actionAny:["talk"]},policyEq:{"suggestionResponses.talk":false}},["DECLINE_SUGGESTION"],"suggest_talk_deny");
  add("R239_CONTACT_BOUNDARY_OVERRIDES",980,{intentAny:["request_contact"],boundaryAny:["do_not_contact","do_not_call","do_not_message"]},["DECLINE_CONTACT","RESPECT_BOUNDARY"],"contact_boundary_override");
  add("R240_TOUCH_BOUNDARY_OVERRIDES",980,{questionKindAny:["permission"],boundaryAny:["do_not_touch","do_not_kiss","do_not_hug"]},["DENY_PERMISSION","RESPECT_BOUNDARY"],"physical_boundary_override");

  // Conversation repair and clarification.
  add("R241_CONFUSION_ASK_DETAILS",610,{emotionMin:{confusion:50}},["ASK_FOR_DETAILS"],"confusion_needs_details");
  add("R242_DISTRUST_NEEDS_CLARITY",640,{emotionMin:{distrust:55}},["EXPRESS_NEED_CLARITY"],"distrust_needs_clarity");
  add("R243_HURT_NEEDS_TALK",620,{intentAny:["express_hurt"],boundaryNone:["stop_conversation"]},["ASK_TO_TALK"],"hurt_needs_talk");
  add("R244_ANGER_NEEDS_TIME",630,{intentAny:["express_anger"],emotionMin:{anger:65}},["REQUEST_TIME"],"anger_needs_time");
  add("R245_APOLOGY_REPAIR",650,{intentAny:["apologize"],psychologyMin:{care:50}},["EXPRESS_REPAIR_DESIRE"],"apology_repair");
  add("R246_REJECT_APOLOGY_NEEDS_TIME",700,{intentAny:["reject_apology"]},["DECLINE_FOR_NOW","REQUEST_TIME"],"apology_rejected_for_now");
  add("R247_ACCEPT_APOLOGY",700,{intentAny:["accept_apology"]},["EXPRESS_RELIEF"],"apology_accepted_by_heroine");
  add("R248_ASK_FOR_HONEST_ANSWER",630,{focusAny:["trust"],toneMin:{negativity:50}},["ASK_FOR_HONEST_ANSWER"],"trust_needs_honesty");
  add("R249_ASK_FOR_ANSWER",620,{intentAny:["ask_question"],toneMin:{hesitation:50}},["ASK_FOR_ANSWER"],"question_needs_answer");
  add("R250_NEED_CLARITY_GENERIC",450,{toneEq:{certainty:["low","uncertain"]}},["EXPRESS_NEED_CLARITY"],"generic_uncertainty");

  // Relationship nuance.
  add("R251_RELATIONSHIP_WARM",610,{focusAny:["relationship"],toneEq:{style:["warm","friendly"]}},["EXPRESS_CARE"],"warm_relationship_tone");
  add("R252_RELATIONSHIP_COLD",650,{focusAny:["relationship"],toneEq:{style:["cold","distant"]}},["ASK_TO_TALK"],"cold_relationship_tone");
  add("R253_LOVE_FEAR_HIGH",760,{intentAny:["question_affection"],emotionMin:{fear:55}},["EXPRESS_CARE"],"affection_fear_high");
  add("R254_LOVE_HURT_HIGH",760,{intentAny:["question_affection"],emotionMin:{hurt:55}},["EXPRESS_CONCERN"],"affection_hurt_high");
  add("R255_TRUST_FEAR_HIGH",750,{focusAny:["trust"],emotionMin:{fear:55}},["ASK_FOR_TRUST"],"trust_fear_high");
  add("R256_BETRAYAL_HURT_HIGH",760,{focusAny:["betrayal"],emotionMin:{hurt:55}},["EXPRESS_CONCERN"],"betrayal_hurt_high");
  add("R257_ABANDONMENT_FEAR_HIGH",770,{focusAny:["abandonment"],emotionMin:{fear:55}},["REASSURE_NOT_LEAVING"],"abandonment_fear_high");
  add("R258_RELATIONSHIP_LONELY",650,{focusAny:["relationship"],emotionMin:{loneliness:55},boundaryNone:["leave_me_alone","stop_conversation"]},["OFFER_COMPANY"],"relationship_loneliness");
  add("R259_RELATIONSHIP_JEALOUS",640,{focusAny:["relationship"],emotionMin:{jealousy:55}},["ASK_ABOUT_OTHER_PERSON"],"relationship_jealousy");
  add("R260_RELATIONSHIP_HOPEFUL",600,{focusAny:["relationship"],emotionMin:{hope:55}},["EXPRESS_HOPE"],"relationship_hope");

  // Daily life combinations.
  add("R261_WORK_TIRED",610,{focusAll:["work","tiredness"]},["OFFER_REST"],"work_tiredness");
  add("R262_WORK_HURT",620,{focusAll:["work","health"]},["EXPRESS_CONCERN"],"work_health");
  add("R263_MONEY_ANXIETY",620,{focusAny:["money"],emotionMin:{anxiety:55}},["EXPRESS_CONCERN"],"money_anxiety");
  add("R264_HOME_RELIEF",570,{focusAny:["home"],emotionMin:{relief:55}},["EXPRESS_RELIEF"],"home_relief");
  add("R265_TRAVEL_FEAR",620,{focusAny:["travel"],emotionMin:{fear:55}},["EXPRESS_CONCERN"],"travel_fear");
  add("R266_TRAVEL_PLAN",540,{focusAny:["travel","destination"],intentAny:["state_plan"]},["STATE_PLAN"],"travel_plan");
  add("R267_RETURN_REASSURANCE",620,{focusAny:["return"],emotionMin:{anxiety:50}},["PROMISE_RETURN"],"return_reassurance");
  add("R268_MEETING_JOY",570,{focusAny:["meeting"],emotionMin:{joy:55}},["EXPRESS_JOY"],"meeting_joy");
  add("R269_FAMILY_CONCERN",590,{focusAny:["family"],emotionMin:{fear:45}},["EXPRESS_CONCERN"],"family_concern");
  add("R270_FRIEND_TRUST",560,{focusAny:["friend"],emotionMax:{distrust:40}},["CONFIRM_TRUST"],"friend_trust");
  add("R271_SHELTER_COLD",630,{focusAll:["shelter","weather"]},["OFFER_WARMTH","OFFER_SHELTER"],"shelter_cold");
  add("R272_FOOD_JOY",540,{focusAny:["food"],emotionMin:{joy:55}},["EXPRESS_APPROVAL"],"food_joy");
  add("R273_HEALTH_RELIEF",560,{focusAny:["health"],emotionMin:{relief:55}},["EXPRESS_RELIEF"],"health_relief");
  add("R274_SLEEP_RELIEF",550,{focusAny:["sleep"],emotionMin:{relief:55}},["EXPRESS_RELIEF"],"sleep_relief");
  add("R275_WORK_PRIDE",560,{focusAny:["work"],intentAny:["express_pride"]},["EXPRESS_PRIDE"],"work_pride");

  // Tone and punctuation interpretation supplied by AI in step 4.
  add("R276_TONE_PLAYFUL",520,{toneEq:{style:["playful","cheerful"]}},["EXPRESS_JOY"],"playful_tone");
  add("R277_TONE_GENTLE",520,{toneEq:{style:["gentle","soft"]}},["EXPRESS_CARE"],"gentle_tone");
  add("R278_TONE_TENSE",610,{toneEq:{style:["tense"]}},["EXPRESS_CONCERN"],"tense_tone");
  add("R279_TONE_BLUNT",560,{toneEq:{style:["blunt"]}},["EXPRESS_NEED_CLARITY"],"blunt_tone");
  add("R280_TONE_APOLOGETIC",590,{toneEq:{style:["apologetic"]}},["EXPRESS_REPAIR_DESIRE"],"apologetic_tone");
  add("R281_TONE_SARCASTIC",600,{toneEq:{style:["sarcastic"]}},["EXPRESS_NEED_CLARITY"],"sarcastic_tone");
  add("R282_TONE_NERVOUS",620,{toneEq:{style:["nervous"]}},["EXPRESS_CONCERN"],"nervous_tone");
  add("R283_TONE_EXCITED",540,{toneEq:{style:["excited"]}},["EXPRESS_JOY"],"excited_tone");
  add("R284_TONE_SAD",610,{toneEq:{style:["sad"]}},["EXPRESS_SYMPATHY"],"sad_tone");
  add("R285_TONE_ANGRY",620,{toneEq:{style:["angry"]}},["EXPRESS_NEED_CLARITY"],"angry_tone");
  add("R286_TONE_RELIEVED",540,{toneEq:{style:["relieved"]}},["EXPRESS_RELIEF"],"relieved_tone");
  add("R287_TONE_DOUBTFUL",610,{toneEq:{style:["doubtful"]}},["EXPRESS_NEED_CLARITY"],"doubtful_tone");
  add("R288_TONE_DISTANT",620,{toneEq:{style:["distant"]}},["ASK_TO_TALK"],"distant_tone");
  add("R289_TONE_AFFECTIONATE",550,{toneEq:{style:["affectionate"]}},["EXPRESS_CARE"],"affectionate_tone");
  add("R290_TONE_NEUTRAL",400,{toneEq:{style:["neutral"]}},["ACKNOWLEDGE_EVENT"],"neutral_tone");

  // Fallback and response-shaping rules.
  add("R291_QUESTION_WITH_FEAR",630,{intentAny:["ask_question"],emotionMin:{fear:50}},["EXPRESS_CONCERN"],"fearful_question");
  add("R292_QUESTION_WITH_HURT",630,{intentAny:["ask_question"],emotionMin:{hurt:50}},["EXPRESS_CONCERN"],"hurt_question");
  add("R293_QUESTION_WITH_ANGER",620,{intentAny:["ask_question"],emotionMin:{anger:50}},["EXPRESS_NEED_CLARITY"],"angry_question");
  add("R294_REPORT_WITH_JOY",550,{intentAny:["report_event","report_condition"],emotionMin:{joy:55}},["EXPRESS_APPROVAL"],"positive_report");
  add("R295_REPORT_WITH_FEAR",620,{intentAny:["report_event","report_condition"],emotionMin:{fear:55}},["EXPRESS_CONCERN"],"fearful_report");
  add("R296_REPORT_WITH_HURT",620,{intentAny:["report_event","report_condition"],emotionMin:{hurt:55}},["EXPRESS_CONCERN"],"hurt_report");
  add("R297_HIGH_EMPATHY_REPLY",510,{psychologyMin:{empathy:80}},["EXPRESS_SYMPATHY"],"npc_empathy_very_high");
  add("R298_HIGH_CARE_REPLY",510,{psychologyMin:{care:80}},["EXPRESS_CARE"],"npc_care_very_high");
  add("R299_HIGH_ANGER_REPLY",500,{psychologyMin:{anger:80},boundaryNone:["stop_conversation"]},["EXPRESS_ANGER"],"npc_anger_very_high");
  add("R300_HIGH_CONFUSION_REPLY",500,{psychologyMin:{confusion:80}},["EXPRESS_CONFUSION"],"npc_confusion_very_high");

  if (R.length !== 100) throw new Error("Expected 100 response rules, got " + R.length);
  HMW.Dialogue.registerResponseRules(R);
})();