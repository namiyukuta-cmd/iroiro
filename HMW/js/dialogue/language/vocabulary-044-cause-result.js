(() => {
  "use strict";
  const V = window.HMW?.Dialogue?.Vocabulary;
  if (!V) throw new Error("Vocabulary registry must load first.");

  // Cause, result and explanation vocabulary for reason-answer generation.
  const words = {
    verb: [
      "cause","affect","influence","lead","result","depend","explain","justify",
      "occur","prevent","trigger","solve"
    ],
    noun: [
      "cause","effect","reason","result","outcome","influence","explanation",
      "justification","factor","source","consequence","solution","problem"
    ],
    adjective: [
      "causal","effective","related","relevant","unrelated","avoidable","preventable",
      "reasonable","logical","illogical"
    ],
    adverb: [
      "consequently","therefore","thus","because","accordingly","logically"
    ]
  };

  const entries = [];
  for (const [pos, lemmas] of Object.entries(words)) {
    for (const lemma of lemmas) {
      entries.push({
        lemma,
        pos,
        tags: ["cause","reason","result","explanation","response-generation","batch044"]
      });
    }
  }

  V.register(entries);
})();
