(() => {
  "use strict";
  const V = window.HMW?.Dialogue?.Vocabulary;
  if (!V) throw new Error("Vocabulary registry must load first.");

  // Learning, knowledge, reasoning and problem-solving vocabulary.
  const words = {
    verb: [
      "learn","study","teach","practice","remember","forget","know","understand","recognize","notice",
      "think","consider","compare","analyze","examine","check","test","prove","guess","assume",
      "discover","find","solve","calculate","count","measure","estimate","explain","describe","define",
      "identify","classify","organize","connect","separate","include","exclude","choose","decide","conclude",
      "question","answer","research","review","repeat","memorize","imagine","predict","confirm","verify"
    ],
    noun: [
      "knowledge","information","fact","idea","concept","thought","memory","lesson","study","practice",
      "skill","ability","experience","example","question","answer","problem","solution","reason","evidence",
      "proof","result","method","rule","pattern","difference","similarity","choice","decision","conclusion",
      "possibility","probability","mistake","error","detail","point","subject","topic","meaning","definition",
      "number","amount","total","part","whole","level","step","test","research","logic"
    ],
    adjective: [
      "known","unknown","clear","unclear","logical","reasonable","possible","impossible","correct","incorrect",
      "right","wrong","true","false","certain","uncertain","simple","difficult","easy","complex",
      "basic","advanced","general","specific","similar","different","equal","exact","approximate","complete",
      "incomplete","useful","useless","important","relevant","obvious","hidden","likely","unlikely","familiar"
    ],
    adverb: [
      "clearly","logically","exactly","approximately","probably","possibly","certainly","apparently","obviously","actually",
      "basically","generally","specifically","correctly","incorrectly","carefully","easily","simply","finally","therefore"
    ]
  };

  const entries = [];
  for (const [pos, lemmas] of Object.entries(words)) {
    for (const lemma of lemmas) {
      entries.push({
        lemma,
        pos,
        tags: ["knowledge","reasoning","learning","problem-solving","conversation","batch063"]
      });
    }
  }

  V.register(entries);
})();
