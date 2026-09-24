(() => {
  "use strict";
  const V = window.HMW?.Dialogue?.Vocabulary;
  if (!V) throw new Error("Vocabulary registry must load first.");

  // Memory, knowledge and understanding vocabulary for factual/unknown answers.
  const words = {
    verb: [
      "forget","learn","memorize","recognize","remember","understand","discover",
      "recall","study","teach","notice","observe"
    ],
    noun: [
      "knowledge","memory","understanding","lesson","experience","discovery","recognition",
      "thought","idea","attention","awareness","observation","detail","information"
    ],
    adjective: [
      "known","unknown","memorable","forgettable","knowledgeable","confused","aware",
      "unaware","familiar","unfamiliar","certain","uncertain"
    ],
    adverb: [
      "knowingly","unknowingly","mentally","consciously"
    ]
  };

  const entries = [];
  for (const [pos, lemmas] of Object.entries(words)) {
    for (const lemma of lemmas) {
      entries.push({
        lemma,
        pos,
        tags: ["knowledge","memory","understanding","fact-answer","conversation","batch043"]
      });
    }
  }

  V.register(entries);
})();
