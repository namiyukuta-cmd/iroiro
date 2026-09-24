(() => {
  "use strict";
  const V = window.HMW?.Dialogue?.Vocabulary;
  if (!V) throw new Error("Vocabulary registry must load first.");

  // Conversation control and turn-taking vocabulary for dialogue management.
  const words = {
    verb: [
      "continue","pause","interrupt","repeat","respond","reply","clarify","summarize",
      "change","finish","listen","mention","explain","answer"
    ],
    noun: [
      "turn","pause","silence","reply","response","summary","clarification","topic",
      "subject","point","conversation","discussion","question","answer","remark",
      "comment","statement","example"
    ],
    adjective: [
      "brief","direct","clear","unclear","relevant","irrelevant","finished","unfinished",
      "specific","general"
    ],
    adverb: [
      "briefly","directly","first","finally","next","again","instead","anyway"
    ]
  };

  const entries = [];
  for (const [pos, lemmas] of Object.entries(words)) {
    for (const lemma of lemmas) {
      entries.push({
        lemma,
        pos,
        tags: ["dialogue-control","turn-taking","conversation","response-planning","batch050"]
      });
    }
  }

  V.register(entries);
})();
