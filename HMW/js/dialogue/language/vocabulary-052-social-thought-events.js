(() => {
  "use strict";
  const V = window.HMW?.Dialogue?.Vocabulary;
  if (!V) throw new Error("Vocabulary registry must load first.");

  // Broad social, thought and event vocabulary for flexible dialogue generation.
  const words = {
    verb: [
      "accept","achieve","act","appear","believe","care","compare","complain","decide","expect",
      "feel","follow","hope","imagine","improve","invite","judge","mean","mind","notice",
      "prefer","promise","realize","refuse","seem","suppose","trust","wonder","agree","disagree",
      "admit","deny","encourage","forgive","guess","ignore","insist","recommend","remind","suggest",
      "support","warn","worry","depend","deserve","matter","occur","remain","require","solve"
    ],
    noun: [
      "action","behavior","chance","choice","decision","event","experience","fact","goal","hope",
      "idea","meaning","mind","opinion","plan","reason","result","situation","thought","truth",
      "behavior","character","conversation","decision","difference","example","expectation","experience",
      "feeling","future","habit","interest","matter","memory","possibility","purpose","question",
      "relationship","response","secret","story","suggestion","support","trust","view","warning",
      "wish","problem","change","chance"
    ],
    adjective: [
      "acceptable","actual","careful","certain","common","complete","different","fair","general","important",
      "interesting","natural","necessary","normal","possible","real","reasonable","right","same","special",
      "strange","true","wrong","likely","unlikely","clear","unclear","honest","dishonest","serious",
      "simple","complex","positive","negative","certain","uncertain","correct","incorrect","personal","public"
    ],
    adverb: [
      "almost","basically","clearly","completely","especially","generally","hardly","mostly","naturally","nearly",
      "obviously","partly","really","simply","truly","usually","possibly","probably","seriously","personally"
    ]
  };

  const entries = [];
  for (const [pos, lemmas] of Object.entries(words)) {
    for (const lemma of lemmas) {
      entries.push({
        lemma,
        pos,
        tags: ["social","thought","event","general","conversation","batch052"]
      });
    }
  }

  V.register(entries);
})();
