(() => {
  "use strict";

  window.HMW = window.HMW || {};
  HMW.Dialogue = HMW.Dialogue || {};

  const AARON_EMERGENCY_CASE = {
    analysis: {
      rawText: "助けて！助けてください！もう何日も食べてないし、お風呂にだって入れていません！いつ支援が受けれるんですか！？死ねっていうんですか！！！？？？",
      emotions: {
        desperation: 95,
        fear: 85,
        anger: 90,
        frustration: 90,
        anxiety: 85
      },
      intents: ["ask_for_help", "report_condition", "ask_when", "ask_question"],
      focusConcepts: ["food", "health", "safety", "death"],
      lexicalTargets: ["help", "food", "support"],
      boundaries: [],
      claims: [
        {
          concept: "food",
          type: "speaker_fact",
          polarity: false,
          certainty: "high",
          text: "もう何日も食べてない"
        },
        {
          concept: "hygiene",
          type: "speaker_fact",
          polarity: false,
          certainty: "high",
          text: "お風呂に入れていない"
        },
        {
          concept: "death",
          type: "accusation",
          polarity: true,
          certainty: "medium",
          text: "死ねっていうんですか"
        }
      ],
      questions: [
        {
          kind: "when",
          concept: "support",
          target: "support",
          requestedField: "supportTime",
          text: "いつ支援が受けれるんですか"
        },
        {
          kind: "fact",
          concept: "death",
          target: "death",
          text: "死ねっていうんですか"
        }
      ],
      tone: {
        style: "urgent",
        positivity: 0,
        hesitation: 0
      },
      analysisVersion: 2
    },
    characterFacts: {
      name: "Aaron",
      role: "support worker",
      wantsHeroineDead: false,
      wantsToHarmHeroine: false,
      availableTime: "today"
    },
    characterPolicy: {
      willingToHelp: true,
      canOfferFood: true,
      maxResponseMeanings: 5
    },
    psychology: {
      care: 78,
      tenderness: 78,
      fearOfLoss: 0,
      anger: 0,
      confusion: 0
    },
    relationship: {
      trust: 0,
      goodwill: 0,
      flags: {}
    },
    conversationContext: {
      availableNow: true,
      canTalkFreely: true,
      timePressure: false,
      mustLeaveNow: false
    },
    variantSeed: 0,
    recentMeaningIds: []
  };

  const clone = value => JSON.parse(JSON.stringify(value));

  HMW.DialogueTest = HMW.DialogueTest || {};

  HMW.DialogueTest.run = function run(input = {}) {
    if (typeof HMW.Dialogue.runDialoguePipeline !== "function") {
      throw new Error("runDialoguePipeline が読み込まれていません。");
    }
    const result = HMW.Dialogue.runDialoguePipeline({
      analysis: input.analysis || {},
      characterFacts: input.characterFacts || {},
      characterPolicy: input.characterPolicy || {},
      psychology: input.psychology || {},
      relationship: input.relationship || {},
      conversationContext: input.conversationContext || {},
      variantSeed: Number(input.variantSeed) || 0,
      slotOverridesByMeaning: input.slotOverridesByMeaning || {},
      recentMeaningIds: Array.isArray(input.recentMeaningIds) ? input.recentMeaningIds : []
    });

    return {
      english: result.english,
      selectedMeaningIds: result.plan?.selectedMeaningIds || [],
      allMeaningIds: result.plan?.meaningIds || [],
      prioritizedMeaningIds: result.plan?.prioritizedMeaningIds || [],
      matchedRuleIds: result.plan?.matchedResponseRuleIds || [],
      reasons: result.plan?.reasons || [],
      composed: (result.composed?.results || []).map(item => ({
        meaningId: item.meaningId,
        english: item.english,
        source: item.source,
        patternId: item.patternId,
        ok: item.ok
      })),
      raw: result
    };
  };

  HMW.DialogueTest.presets = {
    aaronEmergency: clone(AARON_EMERGENCY_CASE)
  };

  const inputEl = document.getElementById("test-input");
  const englishEl = document.getElementById("english");
  const meaningEl = document.getElementById("meaning-ids");
  const detailsEl = document.getElementById("details");

  const loadPreset = () => {
    inputEl.value = JSON.stringify(HMW.DialogueTest.presets.aaronEmergency, null, 2);
  };

  const render = () => {
    try {
      const input = JSON.parse(inputEl.value);
      const result = HMW.DialogueTest.run(input);
      englishEl.classList.remove("error");
      englishEl.textContent = result.english || "(英文なし)";
      meaningEl.textContent = result.selectedMeaningIds.join("\n");
      detailsEl.textContent = JSON.stringify({
        allMeaningIds: result.allMeaningIds,
        prioritizedMeaningIds: result.prioritizedMeaningIds,
        matchedRuleIds: result.matchedRuleIds,
        reasons: result.reasons,
        composed: result.composed
      }, null, 2);
    } catch (error) {
      englishEl.classList.add("error");
      englishEl.textContent = String(error && error.message ? error.message : error);
      meaningEl.textContent = "";
      detailsEl.textContent = "";
    }
  };

  document.getElementById("run-test").addEventListener("click", render);
  document.getElementById("reset-aaron").addEventListener("click", () => {
    loadPreset();
    render();
  });

  loadPreset();
  render();
})();
