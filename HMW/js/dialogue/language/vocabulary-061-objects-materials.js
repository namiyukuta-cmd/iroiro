(() => {
  "use strict";
  const V = window.HMW?.Dialogue?.Vocabulary;
  if (!V) throw new Error("Vocabulary registry must load first.");

  // Broad objects, tools, materials and everyday physical-world vocabulary.
  const words = {
    verb: [
      "build","break","fix","repair","make","create","use","hold","grab","pick","drop","lift","push","pull",
      "carry","move","place","remove","attach","separate","connect","cover","wrap","tie","untie","open","close",
      "lock","unlock","turn","press","pull","cut","tear","fold","pour","fill","empty","weigh","measure","light",
      "burn","cool","heat","charge","plug","unplug","pack","unpack","wear","remove"
    ],
    noun: [
      "tool","machine","device","key","lock","box","bag","basket","container","rope","string","paper","cloth",
      "wood","metal","glass","plastic","stone","brick","steel","iron","wire","battery","light","lamp","clock",
      "watch","camera","radio","television","computer","phone","charger","cable","button","handle","wheel","engine",
      "fuel","oil","soap","brush","comb","scissors","needle","thread","hammer","nail","screw","board","piece"
    ],
    adjective: [
      "wooden","metal","plastic","glass","round","square","flat","thick","thin","wide","narrow","long","short",
      "deep","shallow","solid","hollow","sharp","blunt","smooth","rough","heavy","light","strong","weak","tight",
      "loose","broken","fixed","damaged","new","old","useful","useless","portable","electric","manual","empty",
      "full","locked","unlocked","open","closed","connected","separate","covered","uncovered","clean","dirty"
    ],
    adverb: [
      "inside","outside","above","below","underneath","beside","nearby","apart","together","firmly","loosely","tightly",
      "carefully","roughly","manually","automatically","physically","upright","sideways","forward","backward"
    ]
  };

  const entries = [];
  for (const [pos, lemmas] of Object.entries(words)) {
    for (const lemma of lemmas) {
      entries.push({
        lemma,
        pos,
        tags: ["object","tool","material","physical-world","conversation","batch061"]
      });
    }
  }

  V.register(entries);
})();
