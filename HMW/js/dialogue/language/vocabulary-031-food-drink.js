(() => {
  "use strict";
  const V = window.HMW?.Dialogue?.Vocabulary;
  if (!V) throw new Error("Vocabulary registry must load first.");

  // Food, drink and meal vocabulary for daily NPC conversation.
  const words = {
    verb: [
      "bake","boil","chew","drink","eat","feed","fry","grill","pour","serve",
      "slice","taste","toast"
    ],
    noun: [
      "breakfast","dinner","lunch","snack","bread","rice","meat","fish","vegetable",
      "fruit","soup","salad","sandwich","egg","cheese","milk","coffee","tea","juice",
      "bottle","cup","plate","bowl","spoon","fork","knife","restaurant","cafe",
      "menu","dish","ingredient","taste","appetite"
    ],
    adjective: [
      "bitter","delicious","fresh","salty","spicy","sweet","tasty","raw","cooked",
      "hot","edible"
    ],
    adverb: [
      "hungrily","thirstily"
    ]
  };

  const entries = [];
  for (const [pos, lemmas] of Object.entries(words)) {
    for (const lemma of lemmas) {
      entries.push({
        lemma,
        pos,
        tags: ["food","drink","meal","daily-life","conversation","batch031"]
      });
    }
  }

  V.register(entries);
})();
