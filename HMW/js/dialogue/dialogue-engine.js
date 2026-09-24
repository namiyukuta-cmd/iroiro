(() => {
  "use strict";

  window.HMW = window.HMW || {};
  HMW.Dialogue = HMW.Dialogue || {};

  const pick = (items, index = 0) => {
    if (!Array.isArray(items) || items.length === 0) return "";
    const i = Math.abs(Number(index) || 0) % items.length;
    return items[i];
  };

  HMW.Dialogue.buildBaseReply = function buildBaseReply({
    meaningIds = [],
    variantSeed = 0,
    lexicalTargets = []
  } = {}) {
    const patterns = HMW.Dialogue.BASIC_PATTERNS || {};
    const meanings = HMW.Dialogue.MEANINGS || {};
    const used = [];
    const missing = [];
    const sentences = [];

    meaningIds.forEach((meaningId, index) => {
      const id = String(meaningId);
      if (!meanings[id] || !patterns[id]) {
        missing.push(id);
        return;
      }

      const sentence = pick(patterns[id], variantSeed + index);
      if (!sentence) {
        missing.push(id);
        return;
      }

      used.push(id);
      sentences.push(sentence);
    });

    return {
      meaningIds: used,
      missingMeaningIds: missing,
      lexicalTargets: Array.isArray(lexicalTargets) ? [...lexicalTargets] : [],
      english: sentences.join(" "),
      translationPolicy: {
        preserveMeaningIds: true,
        doNotAddNewIntent: true,
        doNotWeakenAffectionOrRejection: true,
        doNotReverseNegation: true
      }
    };
  };
})();
