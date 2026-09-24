(() => {
  "use strict";
  const V = window.HMW?.Dialogue?.Vocabulary;
  if (!V) throw new Error("Vocabulary registry must load first.");

  // Shopping, service and transaction vocabulary for everyday NPC dialogue.
  const words = {
    verb: [
      "buy","choose","compare","exchange","order","purchase","recommend","return",
      "sell","shop","try","wrap","deliver","reserve"
    ],
    noun: [
      "buyer","cashier","checkout","counter","customer","delivery","exchange","goods",
      "product","receipt","recommendation","seller","shop","store","package","brand",
      "size","stock","sale","discount"
    ],
    adjective: [
      "available","cheap","costly","expensive","popular","sold","unavailable",
      "discounted","recommended","returnable"
    ],
    adverb: [
      "online","locally","cheaply"
    ]
  };

  const entries = [];
  for (const [pos, lemmas] of Object.entries(words)) {
    for (const lemma of lemmas) {
      entries.push({
        lemma,
        pos,
        tags: ["shopping","service","transaction","daily-life","conversation","batch049"]
      });
    }
  }

  V.register(entries);
})();
