(() => {
  "use strict";

  window.HMW = window.HMW || {};
  HMW.Dialogue = HMW.Dialogue || {};
  HMW.DialogueTest = HMW.DialogueTest || {};

  const clone = value => JSON.parse(JSON.stringify(value));

  const EXAMPLE_ANALYSIS = {
    rawText: "こんにちは",
    emotions: {},
    intents: ["greet"],
    focusConcepts: [],
    lexicalTargets: [],
    boundaries: [],
    claims: [],
    questions: [],
    tone: {},
    analysisVersion: 2
  };

  const contextFor = characterId => {
    const c = HMW.CHARACTERS?.[characterId] || {};
    const traits = c.psychologyTraits || {};
    const seed = c.psychologySeed || {};

    const base = {
      characterFacts: {
        name: c.name || characterId,
        role: c.role || ""
      },
      characterPolicy: {
        willingToTalk: true,
        willingToHelp: true,
        maxResponseMeanings: 5
      },
      psychology: {
        care: Number(traits.caretakingTendency ?? 60),
        tenderness: Number(traits.tendernessTendency ?? 55),
        empathy: Number(traits.tendernessTendency ?? 55),
        patience: Number(seed.patience ?? traits.patienceTendency ?? 50),
        anger: 0,
        confusion: 0,
        fearOfLoss: 0
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
      }
    };

    if (characterId === "support_named") {
      base.characterFacts.availableTime = "today";
      base.characterPolicy.canOfferFood = true;
    }

    return base;
  };

  HMW.DialogueTest.runAnalysis = function runAnalysis(
    analysis = {},
    characterId = "support_named"
  ) {
    if (typeof HMW.Dialogue.runDialoguePipeline !== "function") {
      throw new Error("会話パイプラインが読み込まれていません。");
    }

    const context = contextFor(characterId);
    const result = HMW.Dialogue.runDialoguePipeline({
      analysis,
      ...context,
      variantSeed: 0,
      recentMeaningIds: []
    });

    return {
      characterId,
      context,
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
      }))
    };
  };

  const inputEl = document.getElementById("analysis-input");
  const characterEl = document.getElementById("character-select");
  const englishEl = document.getElementById("english");
  const meaningEl = document.getElementById("meaning-ids");
  const proofEl = document.getElementById("proof");
  const contextEl = document.getElementById("character-context");
  const detailsEl = document.getElementById("details");

  const loadExample = () => {
    inputEl.value = JSON.stringify(clone(EXAMPLE_ANALYSIS), null, 2);
  };

  const render = () => {
    try {
      const analysis = JSON.parse(inputEl.value);
      const result = HMW.DialogueTest.runAnalysis(analysis, characterEl.value);

      englishEl.classList.remove("error");
      englishEl.textContent = result.english || "(英文なし)";
      meaningEl.textContent = result.selectedMeaningIds.join("\n");

      proofEl.textContent = result.composed.map((item, index) =>
        [
          String(index + 1) + ". " + item.meaningId,
          "英文: " + (item.english || "(なし)"),
          "生成元: " + (item.source || "(不明)"),
          "文型: " + (item.patternId || "(なし)")
        ].join("\n")
      ).join("\n\n");

      contextEl.textContent = JSON.stringify(result.context, null, 2);
      detailsEl.textContent = JSON.stringify({
        allMeaningIds: result.allMeaningIds,
        prioritizedMeaningIds: result.prioritizedMeaningIds,
        matchedRuleIds: result.matchedRuleIds,
        reasons: result.reasons
      }, null, 2);
    } catch (error) {
      englishEl.classList.add("error");
      englishEl.textContent = String(error && error.message ? error.message : error);
      meaningEl.textContent = "";
      proofEl.textContent = "";
      contextEl.textContent = "";
      detailsEl.textContent = "";
    }
  };

  document.getElementById("run-test").addEventListener("click", render);
  document.getElementById("load-example").addEventListener("click", () => {
    loadExample();
    render();
  });
  characterEl.addEventListener("change", render);

  loadExample();
  render();
})();
