(() => {
  "use strict";
  const V = window.HMW?.Dialogue?.Vocabulary;
  if (!V) throw new Error("Vocabulary registry must load first.");

  // Ability, permission and obligation vocabulary for policy-driven answers.
  const words = {
    verb: [
      "allow","authorize","enable","force","oblige","prevent","prohibit","require",
      "restrict","permit","forbid","manage","succeed","fail"
    ],
    noun: [
      "ability","permission","obligation","authorization","restriction","rule",
      "requirement","responsibility","duty","limit","failure","success","skill"
    ],
    adjective: [
      "able","capable","unable","allowed","forbidden","permitted","required",
      "responsible","restricted","successful","unsuccessful","mandatory"
    ],
    adverb: [
      "legally","officially","successfully","necessarily"
    ]
  };

  const entries = [];
  for (const [pos, lemmas] of Object.entries(words)) {
    for (const lemma of lemmas) {
      entries.push({
        lemma,
        pos,
        tags: ["ability","permission","obligation","policy","response-planning","batch038"]
      });
    }
  }

  V.register(entries);
})();
