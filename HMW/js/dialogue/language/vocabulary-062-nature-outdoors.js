(() => {
  "use strict";
  const V = window.HMW?.Dialogue?.Vocabulary;
  if (!V) throw new Error("Vocabulary registry must load first.");

  // Nature, weather, terrain, animals and outdoor-world vocabulary.
  const words = {
    verb: [
      "rain","snow","freeze","melt","blow","shine","rise","set","flow","flood",
      "grow","bloom","plant","harvest","dig","climb","swim","hunt","fish","camp",
      "burn","smoke","storm","cool","warm","dry","wet","cross","follow","explore",
      "approach","leave","surround","appear","disappear","fall","drift","shake","spread","cover",
      "gather","scatter","sink","float","fly","crawl","bite","scratch","roar","bark"
    ],
    noun: [
      "weather","rain","snow","wind","storm","cloud","fog","sun","moon","star",
      "sky","air","ground","soil","sand","rock","stone","mountain","hill","valley",
      "forest","tree","grass","flower","field","river","lake","sea","ocean","beach",
      "island","coast","road","path","bridge","cave","fire","smoke","water","ice",
      "animal","bird","fish","horse","dog","cat","insect","farm","garden","wilderness"
    ],
    adjective: [
      "sunny","cloudy","rainy","snowy","windy","foggy","stormy","clear","dry","wet",
      "icy","frozen","muddy","rocky","sandy","grassy","wooded","steep","flat","deep",
      "shallow","wild","natural","outdoor","indoor","bright","dark","warm","cool","cold",
      "hot","fresh","calm","rough","quiet","noisy","nearby","distant","high","low"
    ],
    adverb: [
      "outside","outdoors","uphill","downhill","upstream","downstream","ashore","overhead","underground","nearby",
      "farther","north","south","east","west","inland","offshore","naturally","wildly","steadily"
    ]
  };

  const entries = [];
  for (const [pos, lemmas] of Object.entries(words)) {
    for (const lemma of lemmas) {
      entries.push({
        lemma,
        pos,
        tags: ["nature","weather","terrain","outdoors","conversation","batch062"]
      });
    }
  }

  V.register(entries);
})();
