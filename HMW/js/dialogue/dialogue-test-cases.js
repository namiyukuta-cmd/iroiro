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
    },
    {
      id: "greeting_001",
      sourceJa: "こんにちは",
      analysis: {
        analysisVersion: 2,
        rawText: "こんにちは",
        emotions: {},
        intents: ["greet"],
        focusConcepts: [],
        lexicalTargets: [],
        boundaries: [],
        claims: []
      },
      characterFacts: {},
      characterPolicy: {},
      psychology: {},
      expectedMeaningIds: ["RETURN_GREETING"],
      forbiddenMeaningIds: []
    },
    {
      id: "condition_health_001",
      sourceJa: "ちょっと具合悪い",
      analysis: {
        analysisVersion: 2,
        rawText: "ちょっと具合悪い",
        emotions: {},
        intents: ["report_condition"],
        focusConcepts: ["health"],
        lexicalTargets: ["sick"],
        boundaries: [],
        claims: [
          {
            concept: "health",
            type: "speaker_fact",
            polarity: true,
            certainty: "explicit",
            text: "具合悪い"
          }
        ]
      },
      characterFacts: {},
      characterPolicy: {},
      psychology: {},
      expectedMeaningIds: ["ASK_IF_OKAY"],
      forbiddenMeaningIds: []
    },
    {
      id: "sad_event_001",
      sourceJa: "仕事を失った",
      analysis: {
        analysisVersion: 2,
        rawText: "仕事を失った",
        emotions: {
          sadness: 80
        },
        intents: ["report_event"],
        focusConcepts: ["work","job"],
        lexicalTargets: ["job","work"],
        boundaries: [],
        claims: [
          {
            concept: "job",
            type: "speaker_fact",
            polarity: true,
            certainty: "explicit",
            text: "仕事を失った"
          }
        ]
      },
      characterFacts: {},
      characterPolicy: {},
      psychology: {},
      expectedMeaningIds: ["ACKNOWLEDGE_EVENT","EXPRESS_SYMPATHY"],
      forbiddenMeaningIds: []
    },
    {
      id: "touch_boundary_001",
      sourceJa: "触らないで",
      analysis: {
        analysisVersion: 2,
        rawText: "触らないで",
        emotions: {
          anger: 50
        },
        intents: ["refuse"],
        focusConcepts: ["distance"],
        lexicalTargets: ["touch"],
        boundaries: ["do_not_touch"],
        claims: [
          {
            concept: "touch",
            type: "boundary",
            polarity: false,
            certainty: "explicit",
            text: "触らないで"
          }
        ]
      },
      characterFacts: {},
      characterPolicy: {},
      psychology: {},
      expectedMeaningIds: ["RESPECT_BOUNDARY","PROMISE_NOT_TOUCH"],
      forbiddenMeaningIds: ["ASK_PERMISSION_TOUCH"]
    },
    {
      id: "answer_location_001",
      sourceJa: "今どこにいるの？",
      analysis: {
        analysisVersion: 2,
        rawText: "今どこにいるの？",
        emotions: {},
        intents: ["ask_where"],
        focusConcepts: ["place"],
        lexicalTargets: ["market"],
        boundaries: [],
        claims: [],
        questions: [
          {
            kind: "where",
            concept: "place",
            target: "npc",
            requestedField: "currentLocation",
            text: "今どこにいるの？"
          }
        ]
      },
      characterFacts: {
        currentLocation: "at the market"
      },
      characterPolicy: {},
      psychology: {},
      expectedMeaningIds: ["STATE_CURRENT_LOCATION"],
      forbiddenMeaningIds: ["ASK_WHERE","ASK_FOR_ANSWER"],
      expectedEnglishIncludes: ["market"]
    },
    {
      id: "answer_possession_001",
      sourceJa: "水持ってる？",
      analysis: {
        analysisVersion: 2,
        rawText: "水持ってる？",
        emotions: {},
        intents: ["ask_possession"],
        focusConcepts: ["water"],
        lexicalTargets: ["water"],
        boundaries: [],
        claims: [],
        questions: [
          {
            kind: "possession",
            concept: "water",
            target: "water",
            requestedField: "possessions",
            text: "水持ってる？"
          }
        ]
      },
      characterFacts: {
        possessions: {
          water: true
        }
      },
      characterPolicy: {},
      psychology: {},
      expectedMeaningIds: ["CONFIRM_POSSESSION"],
      forbiddenMeaningIds: ["ASK_FOR_ANSWER"],
      expectedEnglishIncludes: ["water"]
    },
    {
      id: "answer_capability_001",
      sourceJa: "手伝える？",
      analysis: {
        analysisVersion: 2,
        rawText: "手伝える？",
        emotions: {},
        intents: ["ask_capability"],
        focusConcepts: [],
        lexicalTargets: ["help"],
        boundaries: [],
        claims: [],
        questions: [
          {
            kind: "capability",
            concept: "help",
            target: "help",
            action: "help",
            requestedField: "capabilities",
            text: "手伝える？"
          }
        ]
      },
      characterFacts: {
        capabilities: {
          help: true
        }
      },
      characterPolicy: {},
      psychology: {},
      expectedMeaningIds: ["CONFIRM_CAPABILITY"],
      forbiddenMeaningIds: ["ASK_FOR_ANSWER"],
      expectedEnglishIncludes: ["help"]
    },
    {
      id: "answer_unknown_001",
      sourceJa: "いつ戻るの？",
      analysis: {
        analysisVersion: 2,
        rawText: "いつ戻るの？",
        emotions: {},
        intents: ["ask_return_time"],
        focusConcepts: ["return","time"],
        lexicalTargets: ["return"],
        boundaries: [],
        claims: [],
        questions: [
          {
            kind: "when",
            concept: "return",
            target: "npc",
            requestedField: "returnTime",
            text: "いつ戻るの？"
          }
        ]
      },
      characterFacts: {},
      characterPolicy: {},
      psychology: {},
      expectedMeaningIds: ["ANSWER_UNKNOWN"],
      forbiddenMeaningIds: ["ASK_RETURN_TIME","ASK_FOR_ANSWER"],
      expectedEnglishIncludes: ["know"]
    },
    {
      id: "answer_identity_name_001",
      sourceJa: "名前は？",
      analysis: {
        analysisVersion: 2,
        rawText: "名前は？",
        emotions: {},
        intents: ["ask_identity"],
        focusConcepts: [],
        lexicalTargets: ["name"],
        boundaries: [],
        claims: [],
        questions: [
          {
            kind: "identity",
            concept: "identity",
            target: "npc",
            requestedField: "name",
            text: "名前は？"
          }
        ]
      },
      characterFacts: {
        name: "Sam"
      },
      characterPolicy: {},
      psychology: {},
      expectedMeaningIds: ["STATE_IDENTITY_NAME"],
      forbiddenMeaningIds: ["ANSWER_UNKNOWN"],
      expectedEnglishIncludes: ["Sam"]
    },
    {
      id: "answer_price_001",
      sourceJa: "これいくら？",
      analysis: {
        analysisVersion: 2,
        rawText: "これいくら？",
        emotions: {},
        intents: ["ask_price"],
        focusConcepts: ["money"],
        lexicalTargets: ["bread"],
        boundaries: [],
        claims: [],
        questions: [
          {
            kind: "price",
            concept: "price",
            target: "bread",
            requestedField: "prices",
            text: "これいくら？"
          }
        ]
      },
      characterFacts: {
        prices: {
          bread: "$3"
        }
      },
      characterPolicy: {},
      psychology: {},
      expectedMeaningIds: ["STATE_PRICE"],
      forbiddenMeaningIds: ["ANSWER_UNKNOWN"],
      expectedEnglishIncludes: ["$3"]
    },
    {
      id: "answer_reason_001",
      sourceJa: "どうしてここにいるの？",
      analysis: {
        analysisVersion: 2,
        rawText: "どうしてここにいるの？",
        emotions: {},
        intents: ["ask_reason"],
        focusConcepts: ["place"],
        lexicalTargets: [],
        boundaries: [],
        claims: [],
        questions: [
          {
            kind: "reason",
            concept: "place",
            target: "here",
            action: "stay",
            requestedField: "reasons",
            text: "どうしてここにいるの？"
          }
        ]
      },
      characterFacts: {
        reasons: {
          here: "I am waiting for someone"
        }
      },
      characterPolicy: {},
      psychology: {},
      expectedMeaningIds: ["STATE_REASON"],
      forbiddenMeaningIds: ["ANSWER_UNKNOWN"],
      expectedEnglishIncludes: ["waiting for someone"]
    },
    {
      id: "priority_boundary_before_affection_001",
      sourceJa: "触らないで。私のこと好き？",
      analysis: {
        analysisVersion: 2,
        rawText: "触らないで。私のこと好き？",
        emotions: {
          fear: 70
        },
        intents: ["refuse","question_affection"],
        focusConcepts: ["love","distance"],
        lexicalTargets: ["touch","love"],
        boundaries: ["do_not_touch"],
        claims: [],
        questions: []
      },
      characterFacts: {
        lovesHeroine: true
      },
      characterPolicy: {},
      psychology: {},
      expectedMeaningIds: ["RESPECT_BOUNDARY","PROMISE_NOT_TOUCH","AFFIRM_LOVE"],
      forbiddenMeaningIds: [],
      expectedFirstMeaningId: "RESPECT_BOUNDARY"
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
      const englishLower = String(result.english || "").toLowerCase();
      const missingEnglish = (test.expectedEnglishIncludes || []).filter(
        text => !englishLower.includes(String(text).toLowerCase())
      );

      const firstMeaningId =
        result.plan?.prioritizedMeaningIds?.[0] ||
        result.plan?.meaningIds?.[0] ||
        null;
      const firstMeaningMismatch =
        test.expectedFirstMeaningId &&
        firstMeaningId !== test.expectedFirstMeaningId;

      return {
        id: test.id,
        pass:
          missingExpected.length === 0 &&
          forbiddenProduced.length === 0 &&
          missingEnglish.length === 0 &&
          !firstMeaningMismatch,
        missingExpected,
        forbiddenProduced,
        missingEnglish,
        firstMeaningId,
        firstMeaningMismatch,
        meaningIds: produced,
        english: result.english,
        lexicalTargets: result.lexicalTargets,
        matchedLexicalTargets: result.matchedLexicalTargets
      };
    });
  };
})();
