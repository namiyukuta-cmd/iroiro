(() => {
  "use strict";

  window.HMW = window.HMW || {};
  HMW.Dialogue = HMW.Dialogue || {};

  HMW.Dialogue.runDialoguePipeline = function runDialoguePipeline({
    analysis,
    characterFacts = {},
    characterPolicy = {},
    psychology = {},
    variantSeed = 0,
    slotOverridesByMeaning = {},
    recentMeaningIds = []
  } = {}) {
    const normalized = HMW.Dialogue.normalizeInputAnalysis
      ? HMW.Dialogue.normalizeInputAnalysis(analysis || {})
      : (analysis || {});

    const expandedLexicalTargets = HMW.Dialogue.expandLexicalTargets
      ? HMW.Dialogue.expandLexicalTargets(normalized)
      : (normalized.lexicalTargets || []);

    const plan = HMW.Dialogue.planResponse
      ? HMW.Dialogue.planResponse({
          analysis: normalized,
          characterFacts,
          characterPolicy,
          psychology
        })
      : {
          meaningIds: [],
          lexicalTargets: expandedLexicalTargets,
          reasons: ["NO_RESPONSE_PLANNER"]
        };

    const lexicalTargets = plan.lexicalTargets?.length
      ? plan.lexicalTargets
      : expandedLexicalTargets;

    const prioritizedMeaningIds =
      typeof HMW.Dialogue.prioritizeResponseMeanings === "function"
        ? HMW.Dialogue.prioritizeResponseMeanings(plan.meaningIds || [], {
            maxMeanings: null
          })
        : (plan.meaningIds || []);

    const nonRepeatedMeaningIds =
      typeof HMW.Dialogue.filterRepeatedMeanings === "function"
        ? HMW.Dialogue.filterRepeatedMeanings(prioritizedMeaningIds, {
            recentMeaningIds,
            repeatWindow: characterPolicy.repeatMeaningWindow ?? 4
          })
        : prioritizedMeaningIds;

    const responseMeaningIds =
      typeof HMW.Dialogue.selectResponseMeanings === "function"
        ? HMW.Dialogue.selectResponseMeanings(nonRepeatedMeaningIds, {
            maxMeanings: characterPolicy.maxResponseMeanings ?? 5,
            boundaryActive: !!plan.boundaryActive
          })
        : nonRepeatedMeaningIds;

    const resolvedFactSlots =
      typeof HMW.Dialogue.resolveFactSlots === "function"
        ? HMW.Dialogue.resolveFactSlots({
            analysis: normalized,
            characterFacts
          })
        : {};

    const mergedSlotOverridesByMeaning = {
      ...resolvedFactSlots,
      ...(plan.slotOverridesByMeaning || {}),
      ...(slotOverridesByMeaning || {})
    };

    const composed = HMW.Dialogue.composeMeanings
      ? HMW.Dialogue.composeMeanings(responseMeaningIds, {
          variantSeed,
          slotOverridesByMeaning: mergedSlotOverridesByMeaning,
          lexicalTargets
        })
      : { english:"", results:[], missingMeaningIds:plan.meaningIds || [] };

    const lowerEnglish = composed.english.toLowerCase();
    const matchedLexicalTargets = lexicalTargets.filter(word =>
      lowerEnglish.includes(String(word).toLowerCase())
    );

    return {
      analysis: normalized,
      plan: {
        ...plan,
        prioritizedMeaningIds,
        nonRepeatedMeaningIds,
        selectedMeaningIds: responseMeaningIds
      },
      composed,
      english: composed.english,
      lexicalTargets,
      matchedLexicalTargets,
      unmatchedLexicalTargets: lexicalTargets.filter(
        word => !matchedLexicalTargets.includes(word)
      ),
      nextMeaningHistory:
        typeof HMW.Dialogue.updateMeaningHistory === "function"
          ? HMW.Dialogue.updateMeaningHistory(recentMeaningIds, responseMeaningIds)
          : [...recentMeaningIds, ...responseMeaningIds],
      aiFinalRole: {
        allowed: [
          "preserve the JS-decided meaning",
          "add character-specific surface flavor without changing intent",
          "translate the final English into natural Japanese"
        ],
        forbidden: [
          "change love into uncertainty or rejection",
          "change rejection into affection",
          "reverse negation",
          "invent new protagonist actions, consent, thoughts, or feelings",
          "replace JS-decided facts with the AI's own interpretation",
          "remove a JS-selected boundary",
          "invent a new promise or relationship fact"
        ]
      }
    };
  };
})();
