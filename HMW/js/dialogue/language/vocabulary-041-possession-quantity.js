(() => {
  "use strict";
  const V = window.HMW?.Dialogue?.Vocabulary;
  if (!V) throw new Error("Vocabulary registry must load first.");

  // Objects, ownership and quantity vocabulary for fact-based answers.
  const words = {
    verb: [
      "belong","contain","count","hold","keep","own","possess","share","lack","include"
    ],
    noun: [
      "amount","item","object","owner","pair","piece","set","supply","total","property",
      "belonging","container","box","pocket","stock"
    ],
    adjective: [
      "additional","enough","extra","few","individual","multiple","numerous","personal",
      "separate","several","single","whole"
    ],
    adverb: [
      "entirely","partly","separately"
    ]
  };

  const entries = [];
  for (const [pos, lemmas] of Object.entries(words)) {
    for (const lemma of lemmas) {
      entries.push({
        lemma,
        pos,
        tags: ["possession","quantity","object","character-fact","conversation","batch041"]
      });
    }
  }

  V.register(entries);
})();
