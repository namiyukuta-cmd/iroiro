(() => {
  "use strict";
  const V = window.HMW?.Dialogue?.Vocabulary;
  if (!V) throw new Error("Vocabulary registry must load first.");

  // Transport, travel logistics, lodging and navigation vocabulary.
  const words = {
    verb: [
      "travel","depart","arrive","board","land","drive","ride","fly","sail","walk",
      "transfer","change","book","reserve","cancel","check","pack","unpack","carry","load",
      "unload","park","stop","wait","miss","catch","follow","cross","turn","continue",
      "enter","exit","visit","stay","rent","return","pay","confirm","delay","hurry",
      "guide","navigate","locate","ask","show","reach","leave","approach","pass","commute"
    ],
    noun: [
      "trip","journey","travel","ticket","passport","visa","luggage","bag","suitcase","map",
      "route","direction","station","stop","platform","terminal","airport","port","harbor","hotel",
      "hostel","room","reservation","booking","reception","key","train","bus","taxi","car",
      "bicycle","motorcycle","plane","flight","ship","boat","driver","passenger","seat","fare",
      "schedule","departure","arrival","delay","transfer","destination","entrance","exit","address","guide"
    ],
    adjective: [
      "local","international","domestic","direct","indirect","one-way","round-trip","available","full","vacant",
      "reserved","delayed","cancelled","early","late","nearby","distant","lost","ready","packed",
      "unpacked","open","closed","public","private","crowded","empty","safe","unsafe","fast",
      "slow","convenient","inconvenient","cheap","expensive","central","remote","overnight","daily","scheduled"
    ],
    adverb: [
      "aboard","abroad","away","nearby","downtown","overseas","locally","directly","indirectly","north",
      "south","east","west","forward","backward","upstairs","downstairs","early","late","overnight"
    ]
  };

  const entries = [];
  for (const [pos, lemmas] of Object.entries(words)) {
    for (const lemma of lemmas) {
      entries.push({
        lemma,
        pos,
        tags: ["transport","travel","lodging","navigation","conversation","batch072"]
      });
    }
  }

  V.register(entries);
})();
