(() => {
  "use strict";

  window.HMW = window.HMW || {};
  HMW.Dialogue = HMW.Dialogue || {};

  const normalizeSpacing = text => String(text || "")
    .replace(/\s+([,.!?;:])/g, "$1")
    .replace(/([,.!?;:])([^\s"'])/g, "$1 $2")
    .replace(/\s+/g, " ")
    .trim();

  const renderTemplate = (text, slots = {}) =>
    normalizeSpacing(
      String(text || "").replace(/\{([A-Z_]+)(\?)?\}/g, (_, key) => {
        const value = slots[key];
        return value === undefined || value === null ? "" : String(value);
      })
    );

  const weightedPick = (items, seed = 0) => {
    if (!Array.isArray(items) || !items.length) return null;
    const total = items.reduce((sum, item) => sum + Math.max(1, Number(item.weight) || 1), 0);
    let cursor = Math.abs(Number(seed) || 0) % total;
    for (const item of items) {
      cursor -= Math.max(1, Number(item.weight) || 1);
      if (cursor < 0) return item;
    }
    return items[0];
  };

  const renderChoice = (choice, slotOverrides = {}) => {
    const slots = { ...(choice.slots || {}), ...slotOverrides };
    if (choice.surfaceOverride) {
      return { english: normalizeSpacing(choice.surfaceOverride), slots };
    }
    const pattern = HMW.Dialogue.SENTENCE_PATTERNS?.[choice.pattern];
    if (!pattern) return { english: "", slots };
    let english = renderTemplate((pattern.tokens || []).join(" "), slots);
    if (choice.prefix) english = normalizeSpacing(choice.prefix + " " + english);
    if (english && !/[.!?]$/.test(english)) english += ".";
    return { english, slots };
  };

  const targetScore = (english, lexicalTargets = []) => {
    const lower = String(english || "").toLowerCase();
    let score = 0;
    for (const target of lexicalTargets || []) {
      const t = String(target || "").toLowerCase().trim();
      if (t && lower.includes(t)) score += 1;
    }
    return score;
  };

  HMW.Dialogue.renderPhrase = function renderPhrase(phraseId, slots = {}) {
    const phrase = HMW.Dialogue.Phrases?.get?.(phraseId);
    if (!phrase) return "";
    return renderTemplate(phrase.text, slots);
  };

  HMW.Dialogue.renderSentencePattern = function renderSentencePattern(patternId, slots = {}) {
    const pattern = HMW.Dialogue.SENTENCE_PATTERNS?.[patternId];
    if (!pattern) return "";
    return renderTemplate((pattern.tokens || []).join(" "), slots);
  };

  HMW.Dialogue.composeMeaning = function composeMeaning(
    meaningId,
    { variantSeed = 0, slotOverrides = {}, lexicalTargets = [] } = {}
  ) {
    const id = String(meaningId || "");
    const choices = HMW.Dialogue.MEANING_PATTERN_MAP?.[id] || [];

    if (!choices.length) {
      return { meaningId:id, ok:false, english:"", reason:"NO_PATTERN_MAPPING" };
    }

    const rendered = choices.map(choice => {
      const result = renderChoice(choice, slotOverrides);
      return {
        choice,
        english: result.english,
        slots: result.slots,
        lexicalScore: targetScore(result.english, lexicalTargets)
      };
    }).filter(item => item.english);

    if (!rendered.length) {
      return { meaningId:id, ok:false, english:"", reason:"NO_RENDERABLE_PATTERN" };
    }

    const bestLexicalScore = Math.max(...rendered.map(item => item.lexicalScore));
    const preferred = bestLexicalScore > 0
      ? rendered.filter(item => item.lexicalScore === bestLexicalScore)
      : rendered;

    const selectedItem = weightedPick(
      preferred.map(item => ({...item, weight:item.choice.weight || 1})),
      variantSeed
    );

    return {
      meaningId:id,
      ok:true,
      patternId:selectedItem.choice.pattern || null,
      english:selectedItem.english,
      slots:selectedItem.slots,
      lexicalScore:selectedItem.lexicalScore
    };
  };

  HMW.Dialogue.composeMeanings = function composeMeanings(
    meaningIds = [],
    { variantSeed = 0, slotOverridesByMeaning = {}, lexicalTargets = [] } = {}
  ) {
    const results = meaningIds.map((meaningId,index) =>
      HMW.Dialogue.composeMeaning(meaningId,{
        variantSeed:variantSeed + index,
        slotOverrides:slotOverridesByMeaning?.[meaningId] || {},
        lexicalTargets
      })
    );

    return {
      results,
      english:results.filter(item=>item.ok).map(item=>item.english).join(" "),
      missingMeaningIds:results.filter(item=>!item.ok).map(item=>item.meaningId)
    };
  };
})();
