(() => {
  "use strict";
  const V = window.HMW?.Dialogue?.Vocabulary;
  if (!V) throw new Error("Vocabulary registry must load first.");

  // Broad everyday-action batch. Kept compact enough for safe repository updates.
  const words = {
    verb: [
      "add","adjust","adopt","attach","build","cancel","catch","connect","copy","cut",
      "damage","divide","draw","empty","fill","find","gather","give","grab","grow",
      "hand","hold","insert","lift","lose","make","measure","mix","place","pull",
      "push","reach","remove","search","set","shake","sort","take","throw","touch",
      "turn","use","watch","break","cover","create","destroy","move","prepare"
    ],
    noun: [
      "area","basket","board","bottom","bottle","case","center","corner","edge","equipment",
      "front","ground","handle","inside","machine","material","middle","part","place","side",
      "surface","tool","top","wall","way","back","base","cover","device","piece",
      "shape","space","spot","thing","type","use","weight","height","length","width"
    ],
    adjective: [
      "big","small","large","little","heavy","light","hard","soft","strong","weak",
      "thick","thin","wide","narrow","deep","shallow","high","low","long","short",
      "round","square","flat","sharp","smooth","rough","solid","loose","tight","empty",
      "full","damaged","fixed","useful","useless"
    ],
    adverb: [
      "back","down","inside","outside","up","forward","backward","nearby","farther",
      "quickly","slowly","easily","hardly","properly","completely","partially"
    ]
  };

  const entries = [];
  for (const [pos, lemmas] of Object.entries(words)) {
    for (const lemma of lemmas) {
      entries.push({
        lemma,
        pos,
        tags: ["everyday","action","object","description","conversation","batch051"]
      });
    }
  }

  V.register(entries);
})();
