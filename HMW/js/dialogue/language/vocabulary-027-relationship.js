(() => {
  "use strict";
  const V = window.HMW?.Dialogue?.Vocabulary;
  if (!V) throw new Error("Vocabulary registry must load first.");

  // Social and relationship vocabulary used by the dialogue planner/generator.
  const words = {
    verb: [
      "admire","appreciate","blame","care","confess","criticize","defend","encourage",
      "envy","flirt","greet","hug","kiss","miss","offend","praise","protect","regret",
      "respect","suspect","tease","thank","welcome","worry"
    ],
    noun: [
      "admiration","affection","anger","anxiety","attraction","comfort","confession",
      "conflict","crush","disappointment","embarrassment","emotion","feeling","friendship",
      "guilt","jealousy","kiss","love","partner","relationship","romance","suspicion",
      "tension","worry"
    ],
    adjective: [
      "affectionate","angry","attracted","caring","close","distant","emotional","friendly",
      "guilty","interested","lonely","loving","protective","romantic","suspicious",
      "thankful","worried"
    ],
    adverb: [
      "affectionately","awkwardly","emotionally","fondly","privately","quietly","warmly"
    ]
  };

  const entries = [];
  for (const [pos, lemmas] of Object.entries(words)) {
    for (const lemma of lemmas) {
      entries.push({
        lemma,
        pos,
        tags: ["social","relationship","conversation","batch027"]
      });
    }
  }

  V.register(entries);
})();
