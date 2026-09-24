(() => {
  "use strict";
  const V = window.HMW?.Dialogue?.Vocabulary;
  if (!V) throw new Error("Vocabulary registry must load first.");

  // Broad food, household and routine vocabulary for everyday generation.
  const words = {
    verb: [
      "bake","boil","cook","cut","drink","eat","feed","fry","grill","mix",
      "pour","serve","slice","taste","toast","wash","dry","clean","sweep","wipe",
      "fold","hang","iron","tidy","vacuum","bathe","brush","dress","change","wake",
      "sleep","rest","sit","stand","open","close","lock","unlock","fill","empty",
      "store","carry","bring","take","put","place","remove","use","prepare","share"
    ],
    noun: [
      "breakfast","lunch","dinner","meal","snack","bread","rice","meat","fish","vegetable",
      "fruit","soup","salad","egg","cheese","milk","coffee","tea","juice","water",
      "bottle","cup","plate","bowl","spoon","fork","knife","kitchen","bathroom","bedroom",
      "bed","blanket","pillow","chair","table","desk","shelf","closet","curtain","mirror",
      "shower","sink","towel","lamp","sofa","floor","wall","door","window","house"
    ],
    adjective: [
      "bitter","delicious","fresh","salty","spicy","sweet","tasty","raw","cooked","hot",
      "cold","warm","clean","dirty","wet","dry","comfortable","cozy","messy","neat",
      "empty","full","open","closed","soft","hard","fresh","stale","hungry","thirsty",
      "sleepy","awake","ready","busy","quiet","noisy","small","large","heavy","light"
    ],
    adverb: [
      "daily","usually","often","sometimes","rarely","never","early","late","indoors","outside",
      "upstairs","downstairs","carefully","quickly","slowly","quietly","warmly","properly","together","alone"
    ]
  };

  const entries = [];
  for (const [pos, lemmas] of Object.entries(words)) {
    for (const lemma of lemmas) {
      entries.push({
        lemma,
        pos,
        tags: ["food","household","routine","daily-life","conversation","batch058"]
      });
    }
  }

  V.register(entries);
})();
