(() => {
  "use strict";
  const V = window.HMW?.Dialogue?.Vocabulary;
  if (!V) throw new Error("Vocabulary registry must load first.");

  // Weather, environment and immediate surroundings for everyday dialogue.
  const words = {
    verb: [
      "freeze","melt","rain","shine","snow","storm","blow","cool","warm"
    ],
    noun: [
      "air","cloud","fog","rain","sky","snow","storm","sun","sunlight","temperature",
      "weather","wind","season","spring","summer","autumn","winter","shade"
    ],
    adjective: [
      "bright","cloudy","cool","dark","dry","foggy","freezing","rainy","sunny",
      "windy","humid","mild","stormy"
    ],
    adverb: [
      "brightly","outdoors"
    ]
  };

  const entries = [];
  for (const [pos, lemmas] of Object.entries(words)) {
    for (const lemma of lemmas) {
      entries.push({
        lemma,
        pos,
        tags: ["weather","environment","surroundings","daily-life","conversation","batch040"]
      });
    }
  }

  V.register(entries);
})();
