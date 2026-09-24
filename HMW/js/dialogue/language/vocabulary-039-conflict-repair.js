(() => {
  "use strict";
  const V = window.HMW?.Dialogue?.Vocabulary;
  if (!V) throw new Error("Vocabulary registry must load first.");

  // Conflict, repair and reconciliation vocabulary for relationship dialogue.
  const words = {
    verb: [
      "argue","betray","complain","confront","deceive","hurt","reconcile","resolve",
      "settle","accuse","calm","comfort","repair","trust"
    ],
    noun: [
      "argument","betrayal","complaint","confrontation","deception","conflict","fault",
      "harm","reconciliation","resolution","trust","promise","excuse","apology"
    ],
    adjective: [
      "betrayed","defensive","dishonest","fair","honest","hurt","peaceful","sorry",
      "trustworthy","unfair","untrustworthy"
    ],
    adverb: [
      "fairly","peacefully","sincerely","wrongly"
    ]
  };

  const entries = [];
  for (const [pos, lemmas] of Object.entries(words)) {
    for (const lemma of lemmas) {
      entries.push({
        lemma,
        pos,
        tags: ["conflict","repair","trust","relationship","conversation","batch039"]
      });
    }
  }

  V.register(entries);
})();
