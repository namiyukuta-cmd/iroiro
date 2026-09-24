(() => {
  "use strict";

  window.HMW = window.HMW || {};
  HMW.Dialogue = HMW.Dialogue || {};

  const normalizeSpacing = text => String(text || "")
    .replace(/\s+([,.!?;:])/g, "$1")
    .replace(/([,.!?;:])([^\s"'])/g, "$1 $2")
    .replace(/\s+/g, " ")
    .trim();

  const chooseWeighted = (items, seed = 0) => {
    if (!Array.isArray(items) || !items.length) return null;
    const total = items.reduce((sum, item) => sum + Math.max(1, Number(item.weight) || 1), 0);
    let cursor = Math.abs(Number(seed) || 0) % total;
    for (const item of items) {
      cursor -= Math.max(1, Number(item.weight) || 1);
      if (cursor < 0) return item;
    }
    return items[0];
  };

  const renderTemplate = (text, slots = {}) => {
    return normalizeSpacing(
      String(text || "").replace(/\{([A-Z_]+)(\?)?\}/g, (_, key, optional) => {
        const value = slots[key];
        if (value === undefined || value === null || value === "") {
          return optional ? "" : "";
        }
        return String(value);
      })
    );
  };

  HMW.Dialogue.renderPhrase = function renderPhrase(phraseId, slots = {}) {
    const phrase = HMW.Dialogue.Phrases?.get?.(phraseId);
    if (!phrase) return "";
    return renderTemplate(phrase.text, slots);
  };

  HMW.Dialogue.renderSentencePattern = function renderSentencePattern(patternId, slots = {}) {
    const pattern = HMW.Dialogue.SENTENCE_PATTERNS?.[patternId];
    if (!pattern) return "";
    const source = Array.isArray(pattern.tokens) ? pattern.tokens.join(" ") : "";
    return renderTemplate(source, slots);
  };

  HMW.Dialogue.composeMeaning = function composeMeaning(
    meaningId,
    { variantSeed = 0, slotOverrides = {} } = {}
  ) {
    const id = String(meaningId || "");
    const choices = HMW.Dialogue.MEANING_PATTERN_MAP?.[id] || [];
    const selected = chooseWeighted(choices, variantSeed);

    if (!selected) {
      return {
        meaningId: id,
        ok: false,
        english: "",
        reason: "NO_PATTERN_MAPPING"
      };
    }

    if (selected.surfaceOverride) {
      return {
        meaningId: id,
        ok: true,
        patternId: selected.pattern || null,
        english: normalizeSpacing(selected.surfaceOverride),
        slots: { ...(selected.slots || {}), ...slotOverrides }
      };
    }

    const slots = { ...(selected.slots || {}), ...slotOverrides };
    let english = HMW.Dialogue.renderSentencePattern(selected.pattern, slots);

    if (selected.prefix) {
      english = normalizeSpacing(selected.prefix + " " + english);
    }

    if (english && !/[.!?]$/.test(english)) {
      english += ".";
    }

    return {
      meaningId: id,
      ok: !!english,
      patternId: selected.pattern || null,
      english,
      slots
    };
  };

  HMW.Dialogue.composeMeanings = function composeMeanings(
    meaningIds = [],
    { variantSeed = 0, slotOverridesByMeaning = {} } = {}
  ) {
    const results = meaningIds.map((meaningId, index) =>
      HMW.Dialogue.composeMeaning(meaningId, {
        variantSeed: variantSeed + index,
        slotOverrides: slotOverridesByMeaning?.[meaningId] || {}
      })
    );

    return {
      results,
      english: results.filter(item => item.ok).map(item => item.english).join(" "),
      missingMeaningIds: results.filter(item => !item.ok).map(item => item.meaningId)
    };
  };
})();
