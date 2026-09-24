(() => {
  "use strict";
  const V = window.HMW?.Dialogue?.Vocabulary;
  if (!V) throw new Error("Vocabulary registry must load first.");

  // Requests, offers and cooperation vocabulary for action-response dialogue.
  const words = {
    verb: [
      "assist","cooperate","help","offer","request","support","volunteer","join",
      "handle","fetch","deliver","pass","show","wait"
    ],
    noun: [
      "assistance","cooperation","help","offer","request","support","task","favor",
      "instruction","permission","invitation","suggestion","action","turn"
    ],
    adjective: [
      "helpful","cooperative","available","busy","ready","willing","unavailable",
      "possible","impossible","acceptable"
    ],
    adverb: [
      "gladly","kindly","readily","together","voluntarily"
    ]
  };

  const entries = [];
  for (const [pos, lemmas] of Object.entries(words)) {
    for (const lemma of lemmas) {
      entries.push({
        lemma,
        pos,
        tags: ["request","offer","cooperation","action-response","conversation","batch046"]
      });
    }
  }

  V.register(entries);
})();
