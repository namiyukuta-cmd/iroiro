(() => {
  "use strict";
  const V = window.HMW?.Dialogue?.Vocabulary;
  if (!V) throw new Error("Vocabulary registry must load first.");

  // Practical daily-life vocabulary for dialogue generation.
  const words = {
    verb: [
      "afford","arrive","book","bring","carry","charge","check","clean","close","cook",
      "cross","drop","enter","exchange","fix","hire","leave","lend","lock","miss",
      "open","pack","pay","pick","purchase","repair","replace","rest","send","spend",
      "stay","store","travel","unlock","wash","wear","withdraw"
    ],
    noun: [
      "address","bag","bank","bill","booking","building","card","cash","change","corner",
      "door","entrance","exit","fare","floor","key","kitchen","laundry","market","meal",
      "medicine","neighborhood","package","payment","phone","rent","room","shop","station",
      "street","ticket","trip","wallet","window","workplace"
    ],
    adjective: [
      "broken","cheap","clean","closed","crowded","dirty","empty","expensive","full",
      "hungry","late","local","lost","near","open","paid","remote","sick","thirsty",
      "tired","wet","warm","cold"
    ],
    adverb: [
      "abroad","ahead","away","downstairs","indoors","outside","upstairs"
    ]
  };

  const entries = [];
  for (const [pos, lemmas] of Object.entries(words)) {
    for (const lemma of lemmas) {
      entries.push({
        lemma,
        pos,
        tags: ["daily-life","practical","common","batch026"]
      });
    }
  }

  V.register(entries);
})();
