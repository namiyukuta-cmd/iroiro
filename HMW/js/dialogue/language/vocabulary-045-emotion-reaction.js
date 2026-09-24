(() => {
  "use strict";
  const V = window.HMW?.Dialogue?.Vocabulary;
  if (!V) throw new Error("Vocabulary registry must load first.");

  // Emotion and reaction vocabulary for interpreting and expressing dialogue state.
  const words = {
    verb: [
      "fear","panic","smile","laugh","cry","shiver","startle","surprise","frustrate",
      "annoy","delight","excite"
    ],
    noun: [
      "fear","panic","joy","sadness","surprise","frustration","annoyance","delight",
      "excitement","relief","shock","mood","reaction","smile","tear"
    ],
    adjective: [
      "annoyed","delighted","excited","frightened","frustrated","happy","sad","shocked",
      "terrified","uneasy","cheerful","miserable"
    ],
    adverb: [
      "anxiously","cheerfully","happily","nervously","sadly","uneasily"
    ]
  };

  const entries = [];
  for (const [pos, lemmas] of Object.entries(words)) {
    for (const lemma of lemmas) {
      entries.push({
        lemma,
        pos,
        tags: ["emotion","reaction","mood","conversation","batch045"]
      });
    }
  }

  V.register(entries);
})();
