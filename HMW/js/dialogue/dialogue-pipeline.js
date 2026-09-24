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

    const plan = HMW.Dialogue.planResponse
      ? HMW.Dialogue.planResponse({
          analysis: normalized,
          characterFacts,
          characterPolicy,
          psychology
        })
      : { meaningIds: [], lexicalTargets: [], reasons: ["NO_RESPONSE_PLANNER"] };

    const composed = HMW.Dialogue.composeMeanings
      ? HMW.Dialogue.composeMeanings(plan.meaningIds || [], {
          variantSeed,
          slotOverridesByMeaning
        })
      : { english: "", results: [], missingMeaningIds: plan.meaningIds || [] };

    const matchedLexicalTargets = (plan.lexicalTargets || []).filter(word =>
      composed.english.toLowerCase().includes(String(word).toLowerCase())
    );

    return {
      analysis: normalized,
      plan,
      composed,
      english: composed.english,
      lexicalTargets: plan.lexicalTargets || [],
      matchedLexicalTargets,
      unmatchedLexicalTargets: (plan.lexicalTargets || []).filter(
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
          "replace JS-decided facts with the AI's own interpretation"
        ]
      }
    };
  };
})();
