(() => {
  "use strict";
  const V = window.HMW?.Dialogue?.Vocabulary;
  if (!V) throw new Error("Vocabulary registry must load first.");

  // Clothing, appearance and personal-item vocabulary for everyday dialogue.
  const words = {
    verb: [
      "dress","change","button","zip","remove","fit","match","carry","comb","shave"
    ],
    noun: [
      "shirt","coat","jacket","dress","skirt","pants","shoe","sock","hat","glove",
      "scarf","belt","button","pocket","uniform","clothes","hair","face","hand",
      "appearance","size","color"
    ],
    adjective: [
      "casual","formal","loose","tight","plain","clean","dirty","wet","dry",
      "bare","dressed","undressed"
    ],
    adverb: [
      "casually","neatly","properly"
    ]
  };

  const entries = [];
  for (const [pos, lemmas] of Object.entries(words)) {
    for (const lemma of lemmas) {
      entries.push({
        lemma,
        pos,
        tags: ["clothing","appearance","personal-item","daily-life","conversation","batch047"]
      });
    }
  }

  V.register(entries);
})();
