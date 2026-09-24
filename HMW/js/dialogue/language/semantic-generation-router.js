(() => {
  "use strict";

  window.HMW = window.HMW || {};
  HMW.Dialogue = HMW.Dialogue || {};
  const D = HMW.Dialogue;

  const arr = value => Array.isArray(value) ? value : [];
  const normalize = value => String(value || "").replace(/\s+/g, " ").trim();

  const CATEGORY_TAGS = {
    affection:["romance","relationship","attachment","intimacy-safe","emotion"],
    trust:["relationship","reasoning","communication"],
    care:["care","health","social","relationship"],
    emotion:["emotion","expression","relationship"],
    positive:["emotion","expression","social"],
    condition:["health","daily"],
    request:["conversation","communication","interaction"],
    closeness:["relationship","attachment","social"],
    clarity:["conversation","reasoning","communication"],
    daily:["daily","practical","home","work"],
    environment:["weather","nature","outdoors"],
    parting:["movement","relationship","social"],
    contact:["communication","social","technology"],
    movement:["movement","travel"],
    answer:["conversation","reasoning","daily"],
    response:["conversation","communication","social"],
    boundary:["communication","conflict","relationship"],
    physical:["interaction","intimacy-safe","relationship"],
    repair:["repair","conflict","relationship","communication"],
    commitment:["relationship","attachment","trust"],
    social:["social","conversation","communication"]
  };

  const patternText = pattern =>
    normalize(arr(pattern?.tokens).join(" ")).toLowerCase();

  const hasSlot = (pattern, slot) =>
    arr(pattern?.slots).some(raw => String(raw || "").replace(/\?$/, "") === slot);

  const sameSlots = (pattern, required = []) =>
    required.every(slot => hasSlot(pattern, slot));

  const familyFor = patternId => {
    const id = String(patternId || "");
    const p = D.SENTENCE_PATTERNS?.[id];
    if (!p) return null;
    const t = patternText(p);

    if (
      sameSlots(p, ["VERB_BASE"]) &&
      /^(can you|could you|would you|would you please|will you|please)\b/.test(t)
    ) return "request_direct";

    if (
      sameSlots(p, ["VERB_BASE"]) &&
      /^(can i|shall i|would you like me to)\b/.test(t)
    ) return "offer_direct";

    if (
      (sameSlots(p, ["VERB_BASE"]) || sameSlots(p, ["VERB_ING"])) &&
      /^(let us|we should|should we|we could|maybe we should)\b/.test(t)
    ) return "suggest_direct";

    if (
      (sameSlots(p, ["VERB_BASE"]) || sameSlots(p, ["VERB_ING"])) &&
      /^(do you want to|would you like to|how about|why not|shall we)\b/.test(t)
    ) return "invite_direct";

    if (
      sameSlots(p, ["VERB_BASE"]) &&
      /^(can i|may i|is it okay if i|do you mind if i|would it be okay if i)\b/.test(t)
    ) return "permission_ask";

    if (
      sameSlots(p, ["ADJECTIVE"]) &&
      /^(\{subject\}|i) (feel|am) \{adjective\}/.test(t)
    ) return "feeling_adjective";

    if (
      sameSlots(p, ["SUBJECT","VERB","OBJECT"]) &&
      /^\{subject\} \{verb\} \{object\??\}$/.test(t)
    ) return "present_svo";

    if (
      sameSlots(p, ["SUBJECT","VERB_BASE"]) &&
      /^\{subject\} (do|does|\{do_aux\}) not \{verb_base\}/.test(t)
    ) return "present_neg";

    if (
      sameSlots(p, ["SUBJECT","VERB_PAST"]) &&
      /^\{subject\} \{verb_past\}/.test(t)
    ) return "past_svo";

    if (
      sameSlots(p, ["SUBJECT","VERB_BASE"]) &&
      /^\{subject\} will \{verb_base\}/.test(t)
    ) return "future_svo";

    if (
      sameSlots(p, ["SUBJECT","VERB_BASE"]) &&
      /^\{subject\} will not \{verb_base\}/.test(t)
    ) return "future_neg";

    if (
      sameSlots(p, ["SUBJECT","BE","VERB_ING"]) &&
      /^\{subject\} \{be\} \{verb_ing\}/.test(t)
    ) return "present_continuous";

    if (
      sameSlots(p, ["SUBJECT","VERB_BASE"]) &&
      /^did \{subject\} \{verb_base\}/.test(t)
    ) return "past_question";

    if (
      sameSlots(p, ["SUBJECT","VERB_BASE"]) &&
      /^when will \{subject\} \{verb_base\}/.test(t)
    ) return "when_future";

    if (
      sameSlots(p, ["SUBJECT","VERB_BASE"]) &&
      /^\{subject\} can \{verb_base\}/.test(t)
    ) return "modal_can";

    if (
      sameSlots(p, ["SUBJECT","VERB_BASE"]) &&
      /^\{subject\} want to \{verb_base\}/.test(t)
    ) return "want_to";

    return null;
  };

  const EQUIVALENT_PATTERN_GROUPS = [
    ["DECLARATIVE_SVO","PRESENT_SIMPLE_SVO"],
    ["NEGATIVE_DO_SVO","PRESENT_SIMPLE_NEG"],
    ["PAST_SVO","PAST_SIMPLE_SVO"],
    ["FUTURE_WILL","FUTURE_SIMPLE"],
    ["FUTURE_WILL_NOT","FUTURE_NEG"],
    ["FEEL_ADJECTIVE","G17_FEELING_I_FEEL_ADJ"],
    ["REQUEST_CAN_YOU","G17_REQUEST_CAN_YOU","POLITE_REQUEST_CAN_YOU"],
    ["REQUEST_COULD_YOU","G17_REQUEST_COULD_YOU","POLITE_REQUEST_COULD_YOU"],
    ["REQUEST_WOULD_YOU","G17_REQUEST_WOULD_YOU","POLITE_REQUEST_WOULD_YOU"],
    ["REQUEST_WILL_YOU","G17_REQUEST_WILL_YOU"],
    ["REQUEST_PLEASE","REQUEST_PLEASE_ACTION","G17_REQUEST_PLEASE"],
    ["OFFER_CAN_I","OFFER_SHALL_I","OFFER_SHALL_I_ACTION","OFFER_WOULD_YOU_LIKE_ME_TO"],
    ["SUGGEST_LETS","SUGGEST_LETS_ACTION","G17_INVITE_LETS","G17_INVITE_SHALL_WE","G17_INVITE_WE_COULD"],
    ["PERMISSION_CAN_I","PERMISSION_MAY_I","ASK_PERMISSION_CAN_I","ASK_PERMISSION_MAY_I","ASK_IF_OKAY_TO","ASK_DO_YOU_MIND_IF","ASK_WOULD_IT_BE_OKAY"]
  ];

  const equivalentPatternIndex = new Map();
  for (const group of EQUIVALENT_PATTERN_GROUPS) {
    for (const id of group) equivalentPatternIndex.set(id, group);
  }

  const compatiblePatterns = basePatternId => {
    const id = String(basePatternId || "");
    if (!id) return [];
    const group = equivalentPatternIndex.get(id);
    const candidates = [...(group || [id])];
    // Identical templates preserve polarity, tense and participant roles.
    const signature = patternText(D.SENTENCE_PATTERNS?.[id]);
    if (signature) {
      for (const [patternId, pattern] of Object.entries(D.SENTENCE_PATTERNS || {})) {
        if (patternText(pattern) === signature) candidates.push(patternId);
      }
    }
    return [...new Set(candidates.filter(patternId => D.SENTENCE_PATTERNS?.[patternId]))];
  };

  D.getCompatibleGenerationPatterns = compatiblePatterns;

  const choose = (items, seed = 0) => {
    const list = arr(items).filter(Boolean);
    if (!list.length) return "";
    return list[Math.abs(Number(seed) || 0) % list.length];
  };

  const chooseLexeme = (items, pos, lexicalTargets = [], seed = 0, semanticTags = []) => {
    const source = [...new Set(arr(items).map(x => String(x || "").toLowerCase()).filter(Boolean))];
    const requested = arr(lexicalTargets).map(x => String(x || "").toLowerCase()).filter(Boolean);

    for (const word of requested) {
      // Topic tags alone do not make two words interchangeable (love/hate).
      if (!source.includes(word)) continue;
      const entry = D.Vocabulary?.get?.(word, pos);
      if (!entry) continue;
      const tags = arr(entry.tags);
      if (!semanticTags.length || semanticTags.some(tag => tags.includes(tag))) return entry.lemma;
    }

    const target = source.find(word => requested.includes(word) && D.Vocabulary?.has?.(word, pos));
    if (target) return target;
    if (!source.length) return "";

    const existing = source.filter(word => D.Vocabulary?.has?.(word, pos));
    return choose(existing.length ? existing : source, seed);
  };

  const forcedVerbSlots = (subject, verb) => {
    if (!verb) return {};
    const M = D.Morphology;
    return {
      SUBJECT: subject,
      VERB: /^(he|she|it)$/i.test(subject)
        ? (M?.verbForm?.(verb, "third") || verb)
        : verb,
      VERB_BASE: verb,
      VERB_PAST: M?.verbForm?.(verb, "past") || verb,
      VERB_PP: M?.verbForm?.(verb, "pp") || verb,
      VERB_ING: M?.verbForm?.(verb, "ing") || verb,
      BE: M?.beFor?.(subject) || "am",
      DO_AUX: M?.doFor?.(subject) || "do",
      HAVE_AUX: M?.haveFor?.(subject) || "have"
    };
  };

  D.getMeaningGenerationRoutes = function getMeaningGenerationRoutes(
    meaningId,
    { lexicalTargets = [], slotOverrides = {}, variantSeed = 0 } = {}
  ) {
    const id = String(meaningId || "");
    const spec = D.GENERATION_SPECS?.[id];
    const mapped = arr(D.MEANING_PATTERN_MAP?.[id]);

    const specCandidates = arr(spec?.candidates).map(candidate => ({
      ...candidate,
      routeSource: "generation_spec"
    }));

    const mappedCandidates = mapped
      .filter(choice => choice?.pattern && !choice.surfaceOverride)
      .map(choice => {
        const slots = { ...(choice.slots || {}) };
        const baseVerb = slots.VERB_BASE && D.Vocabulary?.has?.(slots.VERB_BASE, "verb")
          ? [slots.VERB_BASE]
          : [];
        const adjective = slots.ADJECTIVE && D.Vocabulary?.has?.(slots.ADJECTIVE, "adjective")
          ? [slots.ADJECTIVE]
          : [];
        return {
          pattern: choice.pattern,
          slots,
          verbs: baseVerb,
          adjectives: adjective,
          weight: choice.weight,
          routeSource: "meaning_pattern_map"
        };
      });

    const candidates = [...specCandidates, ...mappedCandidates];
    if (!candidates.length) return [];

    const semanticCategory = spec?.category || D.MEANINGS?.[id]?.category || "";
    const semanticTags = CATEGORY_TAGS[String(semanticCategory)] || [];
    const routes = [];

    candidates.forEach((candidate, candidateIndex) => {
      if (!candidate?.pattern || candidate.surfaceOverride) return;

      const patterns = compatiblePatterns(candidate.pattern);
      const verb = chooseLexeme(
        candidate.verbs,
        "verb",
        lexicalTargets,
        variantSeed + candidateIndex,
        semanticTags
      );
      const adjective = chooseLexeme(
        candidate.adjectives,
        "adjective",
        lexicalTargets,
        variantSeed + candidateIndex,
        semanticTags
      );

      const subject = candidate.subject || candidate.slots?.SUBJECT || "I";
      const baseSlots = {
        ...(candidate.slots || {}),
        ...forcedVerbSlots(subject, verb)
      };

      if (candidate.object !== undefined) {
        baseSlots.OBJECT =
          verb === "return" && String(candidate.object).trim().toLowerCase() === "back"
            ? ""
            : candidate.object;
      }
      if (candidate.nounPhrase !== undefined) baseSlots.NOUN_PHRASE = candidate.nounPhrase;
      if (adjective) baseSlots.ADJECTIVE = adjective;

      const slotCandidates = candidate.slotCandidates || {};
      for (const [slot, values] of Object.entries(slotCandidates)) {
        if (baseSlots[slot] !== undefined && baseSlots[slot] !== "") continue;
        baseSlots[slot] = choose(values, variantSeed + candidateIndex);
      }

      patterns.forEach((patternId, patternIndex) => {
        const built = D.buildSentenceFromPattern?.(patternId, {
          subject,
          seed: variantSeed + candidateIndex + patternIndex,
          lexicalTargets: [
            verb,
            adjective,
            ...arr(lexicalTargets)
          ].filter(Boolean),
          vocabularyTags: semanticTags,
          slotOverrides: {
            ...baseSlots,
            ...(slotOverrides || {})
          },
          fillOptional: false
        });

        if (!built?.ok || !built.english) return;
        routes.push({
          meaningId: id,
          ok: true,
          patternId,
          english: built.english,
          slots: built.slots,
          chosenWords: built.chosenWords,
          source: "semantic_router",
          routeSource: candidate.routeSource || "generation_spec",
          family: familyFor(patternId),
          candidateIndex,
          weight: Math.max(1, Number(candidate.weight) || 1)
        });
      });
    });

    const seen = new Set();
    return routes.filter(route => {
      const key = normalize(route.english).toLowerCase();
      if (!key || seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  };

  D.buildRoutedMeaning = function buildRoutedMeaning(
    meaningId,
    {
      lexicalTargets = [],
      slotOverrides = {},
      variantSeed = 0
    } = {}
  ) {
    const routes = D.getMeaningGenerationRoutes(meaningId, {
      lexicalTargets,
      slotOverrides,
      variantSeed
    });
    if (!routes.length) return null;
    return routes[Math.abs(Number(variantSeed) || 0) % routes.length];
  };

  D.getMeaningGenerationCapacity = function getMeaningGenerationCapacity(meaningId) {
    const routes = D.getMeaningGenerationRoutes(meaningId, { variantSeed: 0 });
    return {
      meaningId: String(meaningId || ""),
      routedVariants: routes.length,
      patternIds: [...new Set(routes.map(x => x.patternId))],
      families: [...new Set(routes.map(x => x.family).filter(Boolean))]
    };
  };
})();
