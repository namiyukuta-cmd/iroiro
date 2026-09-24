(() => {
  "use strict";
  const V = window.HMW?.Dialogue?.Vocabulary;
  if (!V) throw new Error("Vocabulary registry must load first.");

  // Safety, danger and emergency vocabulary for situational dialogue.
  const words = {
    verb: [
      "escape","hide","rescue","protect","warn","attack","injure","threaten","save",
      "avoid","survive","guard","call"
    ],
    noun: [
      "accident","danger","emergency","escape","fire","guard","harm","risk","safety",
      "threat","warning","rescue","shelter","alarm","police","hospital"
    ],
    adjective: [
      "dangerous","safe","unsafe","urgent","serious","protected","injured","missing",
      "secure","threatened"
    ],
    adverb: [
      "safely","urgently","immediately","carefully"
    ]
  };

  const entries = [];
  for (const [pos, lemmas] of Object.entries(words)) {
    for (const lemma of lemmas) {
      entries.push({
        lemma,
        pos,
        tags: ["safety","danger","emergency","situation","conversation","batch048"]
      });
    }
  }

  V.register(entries);
})();
