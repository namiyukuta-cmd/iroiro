(() => {
  "use strict";
  window.HMW = window.HMW || {};
  HMW.Dialogue = HMW.Dialogue || {};

  HMW.Dialogue.ANALYSIS_SCHEMA = {
    version: 2,

    emotions: [
      "anger","hurt","fear","sadness","anxiety","distrust","jealousy","loneliness",
      "joy","relief","affection","desperation","confusion","shame","guilt",
      "frustration","surprise","disappointment","hope"
    ],

    intents: [
      "greet","say_goodbye","ask_question","ask_reason","ask_where","ask_when",
      "ask_health","ask_sleep","ask_food","ask_home","ask_for_help","offer_help",
      "request_distance","request_stay","request_contact","request_reassurance",
      "question_affection","affirm_affection","deny_affection","fear_betrayal",
      "accuse_betrayal","seek_reassurance","express_hurt","express_anger",
      "express_fear","express_loneliness","express_jealousy","express_surprise",
      "express_approval","express_disapproval","apologize","accept_apology",
      "reject_apology","ask_relationship_status","ask_feelings","ask_to_meet",
      "ask_to_talk","refuse","agree","report_condition","report_event",
      "state_plan","state_preference"
    ],

    focusConcepts: [
      "love","like","trust","betrayal","rejection","abandonment","distance","safety",
      "death","harm","relationship","jealousy","other_person","apology","promise",
      "work","money","food","water","sleep","health","weather","home","meeting",
      "time","place","travel","job","rent","shelter","injury","illness","family",
      "friend","contact","future","past","plan","preference"
    ],

    boundaries: [
      "leave_me_alone","do_not_follow","do_not_touch","do_not_kiss","do_not_hug",
      "do_not_contact","do_not_ask","do_not_enter","stop_conversation",
      "do_not_wait","do_not_visit","do_not_call","do_not_message"
    ],

    claimTypes: [
      "speaker_belief","speaker_fear","speaker_suspicion","speaker_fact",
      "question","accusation","request","boundary","report","preference","plan"
    ],

    certainty: ["low","medium","high","explicit"],

    rule: [
      "主人公の疑い・恐れ・質問をNPC側の事実へ変換しない。",
      "『好きじゃないんでしょ』はquestion_affectionまたはspeaker_fearであり、npcDoesNotLove=trueではない。",
      "『裏切るんでしょ』はfear_betrayalまたはspeaker_suspicionであり、npcWillBetray=trueではない。",
      "主人公が報告した出来事はspeaker_factとして扱えるが、NPCの未確認事実へ拡張しない。",
      "明示された境界はboundariesへ別枠で入れる。",
      "原文にない主人公の心理・承諾・行動を追加しない。",
      "主人公のplanやpreferenceをNPC側のplanやpreferenceへコピーしない。"
    ]
  };
})();
