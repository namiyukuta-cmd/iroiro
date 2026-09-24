(() => {
  "use strict";
  const V = window.HMW?.Dialogue?.Vocabulary;
  if (!V) throw new Error("Vocabulary registry must load first.");

  // Personal identity, origin and social-role vocabulary for character fact answers.
  const words = {
    verb: [
      "identify","introduce","live","reside","represent","serve","study","marry",
      "meet","know"
    ],
    noun: [
      "age","birthplace","citizen","family","guest","identity","neighbor","nationality",
      "occupation","resident","role","stranger","student","teacher","worker","colleague",
      "friend","relative","spouse","parent","child"
    ],
    adjective: [
      "adult","foreign","local","married","single","young","old","professional",
      "personal","social"
    ],
    adverb: [
      "professionally","socially"
    ]
  };

  const entries = [];
  for (const [pos, lemmas] of Object.entries(words)) {
    for (const lemma of lemmas) {
      entries.push({
        lemma,
        pos,
        tags: ["identity","origin","social-role","character-fact","conversation","batch042"]
      });
    }
  }

  V.register(entries);
})();
