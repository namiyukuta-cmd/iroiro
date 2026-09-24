(() => {
  "use strict";
  const V = window.HMW?.Dialogue?.Vocabulary;
  if (!V) throw new Error("Vocabulary registry must load first.");

  // Travel, location and movement vocabulary for question/answer dialogue.
  const words = {
    verb: [
      "board","commute","depart","drive","explore","fly","guide","head","navigate",
      "park","ride","rush","stop","tour","walk"
    ],
    noun: [
      "airport","avenue","bridge","bus","cab","city","country","crossing","district",
      "downtown","driver","flight","hotel","intersection","landmark","map","path",
      "road","subway","taxi","terminal","town","traffic","train","vehicle","village"
    ],
    adjective: [
      "central","far","international","nearby","northern","southern","eastern","western",
      "urban","rural"
    ],
    adverb: [
      "backward","east","forward","north","south","west"
    ]
  };

  const entries = [];
  for (const [pos, lemmas] of Object.entries(words)) {
    for (const lemma of lemmas) {
      entries.push({
        lemma,
        pos,
        tags: ["travel","location","movement","conversation","batch030"]
      });
    }
  }

  V.register(entries);
})();
