(() => {
  "use strict";

  window.HMW = window.HMW || {};
  HMW.Dialogue = HMW.Dialogue || {};

  HMW.Dialogue.TEST_CASES = [
    {
      id: "complex_rejection_fear_001",
      sourceJa: "もう放っておいて！！！私のこと好きじゃないんでしょ！？裏切るんでしょ！！！！死んで欲しいんでしょ！！",
      analysis: {
        analysisVersion: 1,
        rawText: "もう放っておいて！！！私のこと好きじゃないんでしょ！？裏切るんでしょ！！！！死んで欲しいんでしょ！！",
        emotions: {
          anger: 90,
          hurt: 95,
          fear: 92,
          distrust: 88,
          desperation: 85
        },
        intents: [
          "request_distance",
          "question_affection",
          "fear_betrayal",
          "seek_reassurance"
        ],
        focusConcepts: [
          "distance",
          "love",
          "betrayal",
          "death",
          "abandonment"
        ],
        lexicalTargets: [
          "love",
          "betray",
          "leave",
          "die"
        ],
        boundaries: [
          "leave_me_alone"
        ],
        claims: [
          {
            concept: "love",
            type: "speaker_suspicion",
            polarity: false,
            certainty: "high",
            text: "私のこと好きじゃないんでしょ"
          },
          {
            concept: "betrayal",
            type: "speaker_fear",
            polarity: true,
            certainty: "high",
            text: "裏切るんでしょ"
          },
          {
            concept: "death",
            type: "speaker_suspicion",
            polarity: true,
            certainty: "high",
            text: "死んで欲しいんでしょ"
          }
        ]
      },
      characterFacts: {
        lovesHeroine: true,
        choosesHeroine: true,
        intendsBetrayal: false,
        hasBetrayed: false,
        loyalToHeroine: true,
        wantsHeroineDead: false,
        wantsToHarmHeroine: false,
        willAbandonHeroine: false,
        trustsHeroine: true
      },
      characterPolicy: {
        willingToHelp: true,
        willingToMeet: true,
        willingToStay: true
      },
      psychology: {
        fearOfLoss: 72,
        care: 75,
        tenderness: 70
      },
      expectedMeaningIds: [
        "RESPECT_BOUNDARY",
        "ACCEPT_DISTANCE",
        "AFFIRM_LOVE",
        "CONFIRM_CHOICE",
        "DENY_BETRAYAL",
        "PROMISE_LOYALTY",
        "DENY_ABANDONMENT",
        "REJECT_DEATH_WISH_CLAIM",
        "EXPRESS_FEAR_OF_LOSS",
        "EXPRESS_CARE"
      ],
      forbiddenMeaningIds: [
        "DENY_LOVE",
        "ADMIT_BETRAYAL"
      ]
    },
    {
      id: "no_love_answer_001",
      sourceJa: "私のこと好きじゃないんでしょ？",
      analysis: {
        analysisVersion: 1,
        rawText: "私のこと好きじゃないんでしょ？",
        emotions: {
          anxiety: 55,
          hurt: 40
        },
        intents: ["question_affection"],
        focusConcepts: ["love"],
        lexicalTargets: ["love"],
        boundaries: [],
        claims: [
          {
            concept: "love",
            type: "speaker_suspicion",
            polarity: false,
            certainty: "medium",
            text: "好きじゃないんでしょ"
          }
        ]
      },
      characterFacts: {
        lovesHeroine: false
      },
      characterPolicy: {},
      psychology: {},
      expectedMeaningIds: ["DENY_LOVE"],
      forbiddenMeaningIds: ["AFFIRM_LOVE"]
    }
  ];

  HMW.Dialogue.runDialogueTests = function runDialogueTests() {
    return HMW.Dialogue.TEST_CASES.map(test => {
      const result = HMW.Dialogue.runDialoguePipeline({
        analysis: test.analysis,
        characterFacts: test.characterFacts,
        characterPolicy: test.characterPolicy,
        psychology: test.psychology,
        variantSeed: 0
      });

      const produced = result.plan?.meaningIds || [];
      const missingExpected = (test.expectedMeaningIds || []).filter(id => !produced.includes(id));
      const forbiddenProduced = (test.forbiddenMeaningIds || []).filter(id => produced.includes(id));

      return {
        id: test.id,
        pass: missingExpected.length === 0 && forbiddenProduced.length === 0,
        missingExpected,
        forbiddenProduced,
        meaningIds: produced,
        english: result.english,
        lexicalTargets: result.lexicalTargets,
        matchedLexicalTargets: result.matchedLexicalTargets
      };
    });
  };
})();
