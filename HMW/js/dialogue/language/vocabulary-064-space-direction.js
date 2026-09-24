(() => {
  "use strict";
  const V = window.HMW?.Dialogue?.Vocabulary;
  if (!V) throw new Error("Vocabulary registry must load first.");

  // Space, direction, distance, position and movement vocabulary.
  const words = {
    verb: [
      "approach","arrive","back","circle","climb","cross","descend","enter","exit","follow",
      "go","head","leave","move","pass","reach","return","rise","turn","walk",
      "run","drive","ride","travel","wander","stop","stay","stand","sit","lie",
      "place","position","move","shift","slide","roll","fall","drop","lift","raise",
      "lower","push","pull","carry","bring","take","send","guide","lead","direct"
    ],
    noun: [
      "place","position","location","direction","distance","side","center","middle","front","back",
      "top","bottom","left","right","north","south","east","west","inside","outside",
      "entrance","exit","corner","edge","surface","ground","floor","level","space","area",
      "route","way","path","road","street","crossing","bridge","stairs","step","door",
      "gate","destination","distance","journey","movement","speed","line","point","spot","direction"
    ],
    adjective: [
      "near","far","close","distant","inside","outside","upper","lower","left","right",
      "central","middle","front","rear","north","south","east","west","horizontal","vertical",
      "straight","curved","wide","narrow","high","low","deep","shallow","nearby","remote",
      "local","direct","indirect","open","closed","blocked","clear","accessible","hidden","visible"
    ],
    adverb: [
      "here","there","nearby","away","ahead","behind","above","below","inside","outside",
      "upstairs","downstairs","upward","downward","forward","backward","leftward","rightward","northward","southward",
      "eastward","westward","around","across","along","through","toward","apart","together","straight",
      "near","far","home","abroad","overhead","underground","indoors","outdoors","somewhere","elsewhere"
    ]
  };

  const entries = [];
  for (const [pos, lemmas] of Object.entries(words)) {
    for (const lemma of lemmas) {
      entries.push({
        lemma,
        pos,
        tags: ["space","direction","position","movement","conversation","batch064"]
      });
    }
  }

  V.register(entries);
})();
