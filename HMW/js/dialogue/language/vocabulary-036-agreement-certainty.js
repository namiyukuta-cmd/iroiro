(() => {
  "use strict";
  const V = window.HMW?.Dialogue?.Vocabulary;
  if (!V) throw new Error("Vocabulary registry must load first.");

  // Agreement, disagreement and certainty vocabulary for factual responses.
  const words = {
    verb: [
      "confirm","contradict","disagree","object","verify","approve","oppose","admit",
      "conclude","determine","believe","disbelieve"
    ],
    noun: [
      "agreement","disagreement","confirmation","contradiction","objection","approval",
      "belief","conclusion","proof","fact","certainty","possibility","probability"
    ],
    adjective: [
      "accurate","false","true","incorrect","confirmed","doubtful","undeniable",
      "believable","impossible","probable","valid","invalid"
    ],
    adverb: [
      "accurately","certainly","clearly","correctly","probably","surely","truly"
    ]
  };

  const entries = [];
  for (const [pos, lemmas] of Object.entries(words)) {
    for (const lemma of lemmas) {
      entries.push({
        lemma,
        pos,
        tags: ["agreement","certainty","fact","response-planning","conversation","batch036"]
      });
    }
  }

  V.register(entries);
})();
