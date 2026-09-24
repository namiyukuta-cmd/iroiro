(() => {
  "use strict";
  window.HMW = window.HMW || {};
  HMW.Dialogue = HMW.Dialogue || {};

  HMW.Dialogue.ANALYSIS_SCHEMA = {
    version: 1,

    emotions: [
      "anger","hurt","fear","sadness","anxiety","distrust","jealousy","loneliness",
      "joy","relief","affection","desperation","confusion","shame","guilt","frustration"
    ],

    intents: [
      "greet","say_goodbye","ask_question","ask_reason","ask_for_help","offer_help",
      "request_distance","request_stay","request_contact","request_reassurance",
      "question_affection","affirm_affection","deny_affection","fear_betrayal",
      "accuse_betrayal","seek_reassurance","express_hurt","express_anger",
      "express_fear","express_loneliness","express_jealousy","apologize",
      "accept_apology","reject_apology","ask_relationship_status","ask_feelings",
      "ask_to_meet","ask_to_talk","refuse","agree","report_condition",
      "report_event","state_plan","state_preference"
    ],

    focusConcepts: [
      "love","like","trust","betrayal","rejection","abandonment","distance","safety",
      "death","harm","relationship","jealousy","other_person","apology","promise",
      "work","money","food","water","sleep","health","weather","home","meeting"
    ],

    boundaries: [
      "leave_me_alone","do_not_follow","do_not_touch","do_not_kiss","do_not_hug",
      "do_not_contact","do_not_ask","do_not_enter","stop_conversation"
    ],

    claimTypes: [
      "speaker_belief","speaker_fear","speaker_suspicion","speaker_fact",
      "question","accusation","request","boundary"
    ],

    certainty: ["low","medium","high","explicit"],

    rule: [
      "主人公の疑い・恐れ・質問をNPC側の事実へ変換しない。",
      "『好きじゃないんでしょ』はquestion_affectionまたはspeaker_fearであり、npcDoesNotLove=trueではない。",
      "『裏切るんでしょ』はfear_betrayalまたはspeaker_suspicionであり、npcWillBetray=trueではない。",
      "明示された境界はboundariesへ別枠で入れる。",
      "原文にない主人公の心理・承諾・行動を追加しない。"
    ]
  };
})();
