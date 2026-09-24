(() => {
  "use strict";
  const V = window.HMW?.Dialogue?.Vocabulary;
  if (!V) throw new Error("Vocabulary registry must load first.");

  // Broad environment, travel, community and practical-life vocabulary.
  const words = {
    verb: [
      "arrive","depart","enter","exit","visit","travel","return","cross","follow","approach",
      "leave","pass","climb","descend","wander","explore","locate","guide","drive","ride",
      "board","park","commute","deliver","collect","borrow","lend","repair","replace","rent",
      "reserve","cancel","pay","spend","save","earn","trade","hire","work","rest",
      "sleep","wake","cook","wash","clean","shop","pack","unpack","carry","store"
    ],
    noun: [
      "building","bridge","road","street","path","route","station","airport","terminal","platform",
      "vehicle","train","bus","taxi","bicycle","hotel","room","office","school","hospital",
      "market","store","restaurant","cafe","park","garden","farm","factory","warehouse","harbor",
      "village","town","city","district","neighborhood","country","region","border","entrance","exit",
      "destination","journey","trip","travel","community","service","worker","customer","neighbor","visitor"
    ],
    adjective: [
      "central","distant","nearby","remote","urban","rural","crowded","quiet","busy","empty",
      "available","closed","open","local","foreign","public","private","free","occupied","vacant",
      "temporary","permanent","daily","weekly","monthly","annual","early","late","ready","finished",
      "broken","repaired","lost","found","packed","unpacked","safe","unsafe","accessible","unavailable"
    ],
    adverb: [
      "abroad","ahead","around","away","downtown","elsewhere","everywhere","home","indoors","nearby",
      "nowhere","outdoors","overseas","somewhere","upstairs","downstairs","locally","remotely","temporarily","permanently"
    ]
  };

  const entries = [];
  for (const [pos, lemmas] of Object.entries(words)) {
    for (const lemma of lemmas) {
      entries.push({
        lemma,
        pos,
        tags: ["practical-life","travel","community","environment","conversation","batch053"]
      });
    }
  }

  V.register(entries);
})();
