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
    slotOverridesByMeaning = {}
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

    const responseMeaningIds =
      typeof HMW.Dialogue.prioritizeResponseMeanings === "function"
        ? HMW.Dialogue.prioritizeResponseMeanings(plan.meaningIds || [], {
            maxMeanings: characterPolicy.maxResponseMeanings
          })
        : (plan.meaningIds || []);

    const mergedSlotOverridesByMeaning = {
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
        prioritizedMeaningIds: responseMeaningIds
      },
      composed,
      english: composed.english,
      lexicalTargets,
      matchedLexicalTargets,
      unmatchedLexicalTargets: lexicalTargets.filter(
        word => !matchedLexicalTargets.includes(word)
      ),
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
