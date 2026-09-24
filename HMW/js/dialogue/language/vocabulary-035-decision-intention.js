(() => {
  "use strict";
  const V = window.HMW?.Dialogue?.Vocabulary;
  if (!V) throw new Error("Vocabulary registry must load first.");

  // Decisions, intentions and possibility vocabulary for response planning.
  const words = {
    verb: [
      "attempt","avoid","consider","expect","intend","manage","plan","risk","try",
      "change","continue","stop"
    ],
    noun: [
      "attempt","choice","decision","expectation","intention","possibility","priority",
      "purpose","risk","step","strategy","alternative","consequence","opportunity"
    ],
    adjective: [
      "avoidable","careful","decisive","expected","intentional","optional","planned",
      "probable","risky","unlikely","willing","unwilling"
    ],
    adverb: [
      "carefully","deliberately","intentionally","likely","necessarily","preferably",
      "willingly"
    ]
  };

  const entries = [];
  for (const [pos, lemmas] of Object.entries(words)) {
    for (const lemma of lemmas) {
      entries.push({
        lemma,
        pos,
        tags: ["decision","intention","possibility","response-planning","conversation","batch035"]
      });
    }
  }

  V.register(entries);
})();
