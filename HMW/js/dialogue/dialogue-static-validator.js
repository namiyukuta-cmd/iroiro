(() => {
  "use strict";

  window.HMW = window.HMW || {};
  HMW.Dialogue = HMW.Dialogue || {};

  const unique = list => [...new Set(list)];

  const requiredSlots = pattern =>
    Array.isArray(pattern?.slots)
      ? pattern.slots.filter(slot => !String(slot).endsWith("?"))
      : [];

  HMW.Dialogue.validateDialogueLanguage = function validateDialogueLanguage() {
    const meanings = HMW.Dialogue.MEANINGS || {};
    const patterns = HMW.Dialogue.SENTENCE_PATTERNS || {};
    const maps = HMW.Dialogue.MEANING_PATTERN_MAP || {};
    const specs = HMW.Dialogue.GENERATION_SPECS || {};
    const phrases = HMW.Dialogue.Phrases?.entries || [];

    const errors = [];
    const warnings = [];

    for (const [meaningId, choices] of Object.entries(maps)) {
      if (!meanings[meaningId]) {
        errors.push({
          type: "UNKNOWN_MEANING_IN_MAP",
          meaningId
        });
      }

      for (const choice of choices || []) {
        if (choice.surfaceOverride) continue;

        const patternId = choice.pattern;
        const pattern = patterns[patternId];

        if (!pattern) {
          errors.push({
            type: "UNKNOWN_PATTERN_IN_MAP",
            meaningId,
            patternId
          });
          continue;
        }

        const slots = choice.slots || {};
        for (const slot of requiredSlots(pattern)) {
          if (
            slots[slot] === undefined &&
            !["SUBJECT","VERB","VERB_BASE","VERB_PAST","VERB_PP","VERB_ING","BE"].includes(slot)
          ) {
            warnings.push({
              type: "MISSING_DEFAULT_SLOT_IN_MAP",
              meaningId,
              patternId,
              slot
            });
          }
        }
      }
    }

    for (const [meaningId, spec] of Object.entries(specs)) {
      if (!meanings[meaningId]) {
        errors.push({
          type: "UNKNOWN_MEANING_IN_GENERATION_SPEC",
          meaningId
        });
      }

      for (const candidate of spec?.candidates || []) {
        if (candidate.surfaceOverride) continue;
        if (candidate.pattern && !patterns[candidate.pattern]) {
          errors.push({
            type: "UNKNOWN_PATTERN_IN_GENERATION_SPEC",
            meaningId,
            patternId: candidate.pattern
          });
        }
      }
    }

    const phraseIds = phrases.map(p => String(p?.id || "")).filter(Boolean);
    const duplicatePhraseIds = unique(
      phraseIds.filter((id, index) => phraseIds.indexOf(id) !== index)
    );

    for (const id of duplicatePhraseIds) {
      errors.push({
        type: "DUPLICATE_PHRASE_ID",
        phraseId: id
      });
    }

    const mappedMeaningIds = Object.keys(maps);
    const specMeaningIds = Object.keys(specs);
    const meaningIds = Object.keys(meanings);

    const uncoveredMeaningIds = meaningIds.filter(
      id => !mappedMeaningIds.includes(id) && !specMeaningIds.includes(id)
    );

    return {
      ok: errors.length === 0,
      errors,
      warnings,
      counts: {
        meanings: meaningIds.length,
        patterns: Object.keys(patterns).length,
        phrases: phraseIds.length,
        mappedMeanings: mappedMeaningIds.length,
        generatedMeanings: specMeaningIds.length,
        uncoveredMeanings: uncoveredMeaningIds.length
      },
      uncoveredMeaningIds
    };
  };
})();
