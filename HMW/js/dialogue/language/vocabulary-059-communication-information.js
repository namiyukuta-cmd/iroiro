(() => {
  "use strict";
  const V = window.HMW?.Dialogue?.Vocabulary;
  if (!V) throw new Error("Vocabulary registry must load first.");

  // Broad communication, language, information and media vocabulary.
  const words = {
    verb: [
      "ask","answer","say","tell","speak","talk","mention","explain","describe","discuss",
      "repeat","reply","respond","call","text","message","write","read","spell","pronounce",
      "translate","understand","misunderstand","clarify","confirm","inform","announce","report","quote","summarize",
      "express","communicate","contact","notify","show","share","send","receive","post","publish",
      "search","find","check","verify","record","remember","learn","teach","listen","hear"
    ],
    noun: [
      "answer","question","word","sentence","phrase","language","meaning","message","reply","response",
      "conversation","discussion","explanation","description","information","detail","news","report","notice","announcement",
      "letter","email","text","call","voice","sound","name","title","address","number",
      "page","book","note","list","sign","label","picture","photo","video","screen",
      "phone","computer","internet","website","article","document","record","translation","example","topic"
    ],
    adjective: [
      "clear","unclear","direct","indirect","formal","informal","spoken","written","verbal","silent",
      "correct","incorrect","accurate","inaccurate","specific","general","detailed","brief","simple","complex",
      "public","private","personal","official","online","offline","available","unavailable","readable","unreadable",
      "understandable","confusing","important","relevant","irrelevant","recent","old","new","true","false"
    ],
    adverb: [
      "clearly","directly","briefly","specifically","generally","formally","informally","verbally","silently","correctly",
      "incorrectly","accurately","personally","officially","online","publicly","privately","recently","again","immediately"
    ]
  };

  const entries = [];
  for (const [pos, lemmas] of Object.entries(words)) {
    for (const lemma of lemmas) {
      entries.push({
        lemma,
        pos,
        tags: ["communication","language","information","media","conversation","batch059"]
      });
    }
  }

  V.register(entries);
})();
