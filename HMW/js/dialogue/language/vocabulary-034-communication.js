(() => {
  "use strict";
  const V = window.HMW?.Dialogue?.Vocabulary;
  if (!V) throw new Error("Vocabulary registry must load first.");

  // Communication and information vocabulary for question/answer dialogue.
  const words = {
    verb: [
      "announce","ask","call","describe","discuss","hear","inform","listen","read",
      "speak","tell","translate","write"
    ],
    noun: [
      "announcement","call","description","discussion","email","language","letter",
      "meaning","news","note","notice","phrase","response","sentence","signal",
      "sound","text","translation","word"
    ],
    adjective: [
      "clear","detailed","exact","formal","informal","loud","spoken","written"
    ],
    adverb: [
      "clearly","directly","formally","honestly","loudly","openly","seriously"
    ]
  };

  const entries = [];
  for (const [pos, lemmas] of Object.entries(words)) {
    for (const lemma of lemmas) {
      entries.push({
        lemma,
        pos,
        tags: ["communication","information","question-answer","conversation","batch034"]
      });
    }
  }

  V.register(entries);
})();
