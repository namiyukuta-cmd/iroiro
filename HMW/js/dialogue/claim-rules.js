(() => {
  "use strict";

  window.HMW = window.HMW || {};
  HMW.Dialogue = HMW.Dialogue || {};

  const NON_CANONICAL_NPC_TYPES = new Set([
    "speaker_belief",
    "speaker_fear",
    "speaker_suspicion",
    "question",
    "accusation",
    "request",
    "boundary",
    "report",
    "preference",
    "plan"
  ]);

  const normalize = claim => ({
    concept: String(claim?.concept || "").trim(),
    type: String(claim?.type || "speaker_belief").trim(),
    polarity: claim?.polarity === false ? false : true,
    certainty: String(claim?.certainty || "medium").trim(),
    text: String(claim?.text || "")
  });

  HMW.Dialogue.interpretClaims = function interpretClaims(claims = []) {
    const normalized = Array.isArray(claims)
      ? claims.filter(Boolean).map(normalize).filter(c => c.concept)
      : [];

    const concepts = [...new Set(normalized.map(c => c.concept))];
    const fearOrSuspicionConcepts = [
      ...new Set(
        normalized
          .filter(c => c.type === "speaker_fear" || c.type === "speaker_suspicion")
          .map(c => c.concept)
      )
    ];
    const questionedConcepts = [
      ...new Set(
        normalized
          .filter(c => c.type === "question")
          .map(c => c.concept)
      )
    ];
    const accusedConcepts = [
      ...new Set(
        normalized
          .filter(c => c.type === "accusation")
          .map(c => c.concept)
      )
    ];
    const speakerFacts = normalized.filter(c => c.type === "speaker_fact");
    const boundaryClaims = normalized.filter(c => c.type === "boundary");

    return {
      claims: normalized,
      concepts,
      fearOrSuspicionConcepts,
      questionedConcepts,
      accusedConcepts,
      speakerFacts,
      boundaryClaims,

      has(concept) {
        return concepts.includes(String(concept || ""));
      },

      hasType(concept, types = []) {
        const wanted = new Set(Array.isArray(types) ? types : [types]);
        return normalized.some(
          c => c.concept === concept && wanted.has(c.type)
        );
      },

      needsNpcFactLookup(concept) {
        return normalized.some(c =>
          c.concept === concept &&
          (
            NON_CANONICAL_NPC_TYPES.has(c.type) ||
            c.type === "speaker_fact"
          )
        );
      },

      npcFactMutations: [],

      rulesApplied: [
        "speaker fear/suspicion/question/accusation never becomes an NPC fact",
        "speaker_fact remains a speaker report and does not overwrite NPC canonical facts",
        "claim concepts may select which canonical NPC fact JS must inspect",
        "NPC truth must come from characterFacts or other JS-owned state"
      ]
    };
  };
})();
