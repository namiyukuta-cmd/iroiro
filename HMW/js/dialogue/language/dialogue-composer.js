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
    const total = items.reduce(
      (sum, item) => sum + Math.max(1, Number(item.weight) || 1),
      0
    );
    let cursor = Math.abs(Number(seed) || 0) % total;
    for (const item of items) {
      cursor -= Math.max(1, Number(item.weight) || 1);
      if (cursor < 0) return item;
    }
    return items[0];
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

  const renderMappedChoice = (choice, slotOverrides = {}) => {
    const slots = { ...(choice.slots || {}), ...slotOverrides };

    if (choice.surfaceOverride) {
      return {
        english: normalizeSpacing(choice.surfaceOverride),
        slots,
        source: "meaning_pattern_map"
      };
    }

    const pattern = HMW.Dialogue.SENTENCE_PATTERNS?.[choice.pattern];
    if (!pattern) {
      return { english: "", slots, source: "meaning_pattern_map" };
    }

    let english = renderTemplate((pattern.tokens || []).join(" "), slots);

    if (choice.prefix) {
      english = normalizeSpacing(choice.prefix + " " + english);
    }

    if (english && !/[.!?]$/.test(english)) english += ".";

    return {
      english,
      slots,
      source: "meaning_pattern_map"
    };
  };

  HMW.Dialogue.renderPhrase = function renderPhrase(phraseId, slots = {}) {
    const phrase = HMW.Dialogue.Phrases?.get?.(phraseId);
    if (!phrase) return "";
    return renderTemplate(phrase.text, slots);
  };

  HMW.Dialogue.renderSentencePattern = function renderSentencePattern(
    patternId,
    slots = {}
  ) {
    const pattern = HMW.Dialogue.SENTENCE_PATTERNS?.[patternId];
    if (!pattern) return "";
    return renderTemplate((pattern.tokens || []).join(" "), slots);
  };

  HMW.Dialogue.composeMeaning = function composeMeaning(
    meaningId,
    {
      variantSeed = 0,
      slotOverrides = {},
      lexicalTargets = [],
      preferGenerated = true
    } = {}
  ) {
    const id = String(meaningId || "");
    const candidates = [];

    const mappedChoices = HMW.Dialogue.MEANING_PATTERN_MAP?.[id] || [];
    mappedChoices.forEach(choice => {
      const rendered = renderMappedChoice(choice, slotOverrides);
      if (!rendered.english) return;
      candidates.push({
        meaningId: id,
        ok: true,
        patternId: choice.pattern || null,
        english: rendered.english,
        slots: rendered.slots,
        source: rendered.source,
        lexicalScore: targetScore(rendered.english, lexicalTargets),
        weight: Math.max(1, Number(choice.weight) || 1)
      });
    });

    if (typeof HMW.Dialogue.getMeaningGenerationRoutes === "function") {
      const routed = HMW.Dialogue.getMeaningGenerationRoutes(id, {
        variantSeed,
        lexicalTargets,
        slotOverrides
      });

      for (const route of routed) {
        candidates.push({
          meaningId: id,
          ok: true,
          patternId: route.patternId || null,
          english: route.english,
          slots: route.slots || {},
          source: "semantic_router",
          lexicalScore: targetScore(route.english, lexicalTargets),
          weight: Math.max(1, Number(route.weight) || 1) + (preferGenerated ? 8 : 2)
        });
      }
    }

    if (typeof HMW.Dialogue.buildGeneratedMeaning === "function") {
      const generated = HMW.Dialogue.buildGeneratedMeaning(id, {
        variantSeed,
        lexicalTargets
      });

      if (generated?.ok && generated.english) {
        const mergedSlots = {
          ...(generated.slots || {}),
          ...slotOverrides
        };

        let generatedEnglish = generated.english;

        if (
          generated.patternId &&
          Object.keys(slotOverrides || {}).length > 0 &&
          typeof HMW.Dialogue.renderSentencePattern === "function"
        ) {
          const rerendered = HMW.Dialogue.renderSentencePattern(
            generated.patternId,
            mergedSlots
          );
          if (rerendered) {
            generatedEnglish = /[.!?]$/.test(rerendered)
              ? rerendered
              : rerendered + ".";
          }
        }

        candidates.push({
          meaningId: id,
          ok: true,
          patternId: generated.patternId || null,
          english: generatedEnglish,
          slots: mergedSlots,
          source: "generation_spec",
          lexicalScore: targetScore(generatedEnglish, lexicalTargets),
          weight: preferGenerated ? 6 : 2
        });
      }
    }

    if (!candidates.length) {
      return {
        meaningId: id,
        ok: false,
        english: "",
        reason: "NO_RENDERABLE_PATTERN"
      };
    }

    const bestLexicalScore = Math.max(
      ...candidates.map(item => item.lexicalScore || 0)
    );

    const lexicalPreferred = bestLexicalScore > 0
      ? candidates.filter(item => item.lexicalScore === bestLexicalScore)
      : candidates;

    const routedPreferred =
      preferGenerated &&
      lexicalPreferred.some(item => item.source === "semantic_router")
        ? lexicalPreferred.filter(item => item.source === "semantic_router")
        : lexicalPreferred;

    const generatedPreferred =
      preferGenerated &&
      !routedPreferred.some(item => item.source === "semantic_router") &&
      routedPreferred.some(item => item.source === "generation_spec")
        ? routedPreferred.filter(item => item.source === "generation_spec")
        : routedPreferred;

    const selected = weightedPick(generatedPreferred, variantSeed);

    return {
      meaningId: id,
      ok: true,
      patternId: selected.patternId,
      english: selected.english,
      slots: selected.slots,
      lexicalScore: selected.lexicalScore,
      source: selected.source
    };
  };

  HMW.Dialogue.composeMeanings = function composeMeanings(
    meaningIds = [],
    {
      variantSeed = 0,
      slotOverridesByMeaning = {},
      lexicalTargets = [],
      preferGenerated = true
    } = {}
  ) {
    const results = meaningIds.map((meaningId, index) =>
      HMW.Dialogue.composeMeaning(meaningId, {
        variantSeed: variantSeed + index,
        slotOverrides: slotOverridesByMeaning?.[meaningId] || {},
        lexicalTargets,
        preferGenerated
      })
    );

    return {
      results,
      english: results
        .filter(item => item.ok)
        .map(item => item.english)
        .join(" "),
      missingMeaningIds: results
        .filter(item => !item.ok)
        .map(item => item.meaningId),
      routedMeaningIds: results
        .filter(item => item.ok && item.source === "semantic_router")
        .map(item => item.meaningId),
      generatedMeaningIds: results
        .filter(item => item.ok && item.source === "generation_spec")
        .map(item => item.meaningId),
      mappedMeaningIds: results
        .filter(item => item.ok && item.source === "meaning_pattern_map")
        .map(item => item.meaningId)
    };
  };
})();
