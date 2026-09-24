(() => {
  "use strict";
  const V = window.HMW?.Dialogue?.Vocabulary;
  if (!V) throw new Error("Vocabulary registry must load first.");

  // Clothing, appearance, grooming and personal-item vocabulary.
  const words = {
    verb: [
      "wear","dress","undress","change","button","unbutton","zip","unzip","tie","untie",
      "wash","dry","brush","comb","shave","trim","cut","style","fit","match",
      "choose","buy","sell","try","carry","pack","unpack","fold","hang","iron",
      "clean","stain","tear","repair","replace","borrow","lend","lose","find","bring",
      "take","put","remove","cover","wrap","adjust","fasten","loosen","tighten","measure"
    ],
    noun: [
      "clothes","shirt","blouse","jacket","coat","sweater","dress","skirt","pants","jeans",
      "shorts","sock","shoe","boot","hat","cap","glove","scarf","belt","pocket",
      "button","zipper","bag","wallet","purse","umbrella","watch","ring","necklace","glasses",
      "hair","face","skin","beard","mustache","appearance","style","size","color","fabric",
      "cotton","wool","leather","uniform","suit","outfit","laundry","towel","mirror","comb"
    ],
    adjective: [
      "dressed","undressed","clean","dirty","wet","dry","formal","casual","plain","fashionable",
      "comfortable","uncomfortable","tight","loose","large","small","long","short","thick","thin",
      "black","white","red","blue","green","yellow","brown","gray","bright","dark",
      "new","old","worn","torn","stained","neat","messy","bare","covered","matching"
    ],
    adverb: [
      "neatly","casually","formally","comfortably","loosely","tightly","carefully","plainly","smartly","properly",
      "personally","physically","quickly","slowly","outside","inside","together","separately","lightly","heavily"
    ]
  };

  const entries = [];
  for (const [pos, lemmas] of Object.entries(words)) {
    for (const lemma of lemmas) {
      entries.push({
        lemma,
        pos,
        tags: ["clothing","appearance","grooming","personal-item","conversation","batch071"]
      });
    }
  }

  V.register(entries);
})();
