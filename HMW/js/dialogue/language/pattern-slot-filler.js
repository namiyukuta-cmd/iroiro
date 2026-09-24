(() => {
  "use strict";

  window.HMW = window.HMW || {};
  HMW.Dialogue = HMW.Dialogue || {};

  const D = HMW.Dialogue;

  const OPTIONAL = /\?$/;
  const bare = slot => String(slot || "").replace(/\?$/, "");

  const DEFAULTS = {
    verb: ["know","see","want","need","like","help","tell","ask","give","take"],
    noun: ["thing","time","place","work","home","food","money","friend","plan","question"],
    adjective: ["good","ready","sure","safe","happy","clear","important","possible"],
    adverb: ["now","here","again","together","probably","really","always","sometimes"]
  };

  const entryFor = (lemma, pos) => D.Vocabulary?.get?.(lemma, pos) || null;

  const pickLexeme = (pos, { lexicalTargets = [], preferred = [], seed = 0 } = {}) => {
    const wanted = [...lexicalTargets, ...preferred]
      .map(x => String(x || "").toLowerCase().trim())
      .filter(Boolean);

    for (const lemma of wanted) {
      const hit = entryFor(lemma, pos);
      if (hit) return hit.lemma;
    }

    const curated = (DEFAULTS[pos] || []).filter(lemma => entryFor(lemma, pos));
    if (curated.length) return curated[Math.abs(Number(seed) || 0) % curated.length];

    const pool = (D.Vocabulary?.entries || []).filter(entry => entry.pos === pos);
    if (!pool.length) return "";
    return pool[Math.abs(Number(seed) || 0) % pool.length].lemma;
  };

  const pluralize = noun => {
    const word = String(noun || "");
    if (!word) return "";
    if (/(s|x|z|ch|sh)$/i.test(word)) return word + "es";
    if (/[^aeiou]y$/i.test(word)) return word.slice(0, -1) + "ies";
    return word + "s";
  };

  const comparative = adjective => {
    const word = String(adjective || "");
    if (!word) return "";
    const irregular = { good:"better", bad:"worse", far:"farther", little:"less", many:"more", much:"more" };
    if (irregular[word]) return irregular[word];
    if (/y$/i.test(word) && !/[aeiou]y$/i.test(word)) return word.slice(0,-1) + "ier";
    if (/e$/i.test(word)) return word + "r";
    if (word.length <= 5) return word + "er";
    return "more " + word;
  };

  const superlative = adjective => {
    const word = String(adjective || "");
    if (!word) return "";
    const irregular = { good:"best", bad:"worst", far:"farthest", little:"least", many:"most", much:"most" };
    if (irregular[word]) return irregular[word];
    if (/y$/i.test(word) && !/[aeiou]y$/i.test(word)) return word.slice(0,-1) + "iest";
    if (/e$/i.test(word)) return word + "st";
    if (word.length <= 5) return word + "est";
    return "most " + word;
  };

  const articleFor = noun => /^[aeiou]/i.test(String(noun || "")) ? "an" : "a";
  const cap = word => {
    const s = String(word || "");
    return s ? s[0].toUpperCase() + s.slice(1) : s;
  };

  const normalize = text => String(text || "")
    .replace(/\s+([,.!?;:])/g, "$1")
    .replace(/\s+/g, " ")
    .trim();

  const simpleClause = ({
    subject = "I",
    verb = "know",
    noun = "thing"
  } = {}) => {
    const M = D.Morphology;
    const form = /^(he|she|it)$/i.test(subject)
      ? (M?.verbForm?.(verb, "third") || verb)
      : verb;
    return normalize(subject + " " + form + " the " + noun);
  };

  D.fillPatternSlots = function fillPatternSlots(
    patternId,
    {
      slotOverrides = {},
      lexicalTargets = [],
      subject = "I",
      seed = 0,
      fillOptional = false
    } = {}
  ) {
    const pattern = D.SENTENCE_PATTERNS?.[patternId];
    if (!pattern) {
      return { ok:false, patternId, slots:{}, unresolvedSlots:[], chosenWords:{}, reason:"UNKNOWN_PATTERN" };
    }

    const M = D.Morphology;
    const slots = { ...slotOverrides };
    const explicitSlots = new Set(Object.keys(slotOverrides || {}));

    const verb = pickLexeme("verb", { lexicalTargets, seed });
    const remainingForNoun = (lexicalTargets || []).filter(
      target => String(target || "").toLowerCase() !== String(verb || "").toLowerCase()
    );
    const verb2 = pickLexeme("verb", {
      lexicalTargets: (lexicalTargets || []).filter(
        target => String(target || "").toLowerCase() !== String(verb || "").toLowerCase()
      ),
      seed:seed + 1,
      preferred:["help","tell","ask","give","take"]
    });
    const noun = pickLexeme("noun", {
      lexicalTargets: remainingForNoun,
      seed,
      preferred:["thing","home","time","place","work","friend"]
    });
    const noun2 = pickLexeme("noun", {
      lexicalTargets: remainingForNoun.filter(
        target => String(target || "").toLowerCase() !== String(noun || "").toLowerCase()
      ),
      seed:seed + 1,
      preferred:["time","place","work","home","friend"]
    });
    const adjective = pickLexeme("adjective", { lexicalTargets, seed });
    const adverb = pickLexeme("adverb", { lexicalTargets, seed });

    const baseSubject = slots.SUBJECT || subject || "I";
    const clause = simpleClause({ subject:baseSubject, verb:verb || "know", noun:noun || "thing" });
    const clause2 = simpleClause({ subject:"you", verb:verb2 || "see", noun:noun2 || "time" });

    const values = {
      SUBJECT: baseSubject,
      SUBJECT_A: baseSubject,
      SUBJECT_B: baseSubject === "I" ? "you" : "I",
      CLAUSE_SUBJECT: baseSubject,

      VERB: /^(he|she|it)$/i.test(baseSubject) ? (M?.verbForm?.(verb,"third") || verb) : verb,
      VERB2: /^(he|she|it)$/i.test(baseSubject) ? (M?.verbForm?.(verb2,"third") || verb2) : verb2,
      VERB_A: verb,
      VERB_B: verb2,
      VERB_BASE: verb,
      VERB_FORM: verb,
      VERB_ING: M?.verbForm?.(verb,"ing") || verb,
      VERB_PAST: M?.verbForm?.(verb,"past") || verb,
      VERB_PP: M?.verbForm?.(verb,"pp") || verb,
      CLAUSE_VERB: verb,

      NOUN: noun,
      NOUN_PLURAL: pluralize(noun),
      NOUN_PHRASE: "the " + noun,
      NOUN_PHRASE_A: "the " + noun,
      NOUN_PHRASE_B: "the " + noun2,
      NOUN_OR_GERUND: noun,
      OBJECT: "the " + noun,
      OBJECT2: "the " + noun2,
      OBJECT_A: "the " + noun,
      OBJECT_B: "the " + noun2,
      OBJECT_PLURAL: "the " + pluralize(noun),
      OPTION_A: "the " + noun,
      OPTION_B: "the " + noun2,
      SUBJECT_COMPLEMENT: "the " + noun,
      GROUP: "the group",
      FOCUS: "the " + noun,
      AGENT: "me",

      ADJECTIVE: adjective,
      ADJECTIVE_OR_NOUN: adjective || noun,
      ADJECTIVE_OR_PROGRESSIVE: adjective || (M?.verbForm?.(verb,"ing") || verb),
      COMPARATIVE: comparative(adjective),
      SUPERLATIVE: superlative(adjective),
      ADVERB: adverb,

      BE: M?.beFor?.(baseSubject) || "am",
      BE_CAP: cap(M?.beFor?.(baseSubject) || "am"),
      BE_PAST: M?.beFor?.(baseSubject,"past") || "was",
      DO_AUX: M?.doFor?.(baseSubject) || "do",
      DO_AUX_CAP: cap(M?.doFor?.(baseSubject) || "do"),
      HAVE_AUX: M?.haveFor?.(baseSubject) || "have",
      HAVE_AUX_CAP: cap(M?.haveFor?.(baseSubject) || "have"),
      AUX: M?.doFor?.(baseSubject) || "do",
      MODAL: "can",

      CLAUSE: clause,
      CLAUSE_A: clause,
      CLAUSE_B: clause2,
      MAIN_CLAUSE: clause2,

      ARTICLE: articleFor(noun),
      AMOUNT: "some",
      QUANTITY: "some",
      AVAILABILITY: "available",
      FEELING: adjective || "good",
      FEELINGS: "feelings",
      RELATIONSHIP: "friend",
      ROLE: "friend",
      NAME: "someone",

      PLACE: "here",
      LOCATION: "here",
      DATE: "today",
      TIME: "now",
      TIME_PERIOD: "the morning",
      TIME_POINT: "today",
      TIME_SPAN: "a while",
      DURATION: "a while",
      TIME_OR_PLACE: "today",

      PREP_PHRASE: "with the " + noun,
      ABOUT: "about the " + noun,
      WH_WORD: "why",
      TAG: "right"
    };

    const requested = Array.isArray(pattern.slots) ? pattern.slots : [];
    for (const rawSlot of requested) {
      const key = bare(rawSlot);
      if (explicitSlots.has(key)) continue;
      if (slots[key] !== undefined && slots[key] !== null && slots[key] !== "") continue;
      if (OPTIONAL.test(rawSlot) && !fillOptional) continue;

      let value = values[key];
      if (value === undefined && key === "ARTICLE") value = articleFor(noun);
      if (value === undefined && key === "ADJECTIVE") value = adjective;
      if (value === undefined && key === "ADVERB") value = adverb;
      if (value !== undefined && value !== null && value !== "") slots[key] = value;
    }

    const unresolvedSlots = requested
      .filter(rawSlot => {
        const key = bare(rawSlot);
        if (explicitSlots.has(key)) return false;
        if (OPTIONAL.test(rawSlot) && !fillOptional) return false;
        return slots[key] === undefined || slots[key] === null || slots[key] === "";
      })
      .map(bare);

    return {
      ok: unresolvedSlots.length === 0,
      patternId,
      slots,
      unresolvedSlots,
      chosenWords: { verb, verb2, noun, noun2, adjective, adverb }
    };
  };

  D.buildSentenceFromPattern = function buildSentenceFromPattern(
    patternId,
    options = {}
  ) {
    const filled = D.fillPatternSlots(patternId, options);
    if (!filled.ok) return { ...filled, english:"" };

    let english = D.renderSentencePattern?.(patternId, filled.slots) || "";
    english = normalize(english);
    if (english && !/[.!?]$/.test(english)) english += ".";

    return {
      ...filled,
      ok: !!english && !/\{[A-Z_]+\??\}/.test(english),
      english,
      source: "pattern_slot_filler"
    };
  };
})();
