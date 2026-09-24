(() => {
  "use strict";
  const V = window.HMW?.Dialogue?.Vocabulary;
  if (!V) throw new Error("Vocabulary registry must load first.");

  // Needs, wants and preferences for NPC fact/policy based answers.
  const words = {
    verb: [
      "desire","need","want","favor","dislike","enjoy","hate","like","love","require",
      "wish","crave","value"
    ],
    noun: [
      "desire","need","want","preference","requirement","wish","favorite","dislike",
      "pleasure","interest","necessity","priority"
    ],
    adjective: [
      "desired","essential","favorite","interested","needed","preferred","required",
      "unwanted","willing","eager","reluctant"
    ],
    adverb: [
      "eagerly","especially","preferably","reluctantly","strongly"
    ]
  };

  const entries = [];
  for (const [pos, lemmas] of Object.entries(words)) {
    for (const lemma of lemmas) {
      entries.push({
        lemma,
        pos,
        tags: ["want","need","preference","character-fact","response-planning","batch037"]
      });
    }
  }

  V.register(entries);
})();
