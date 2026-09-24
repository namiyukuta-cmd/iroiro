(() => {
  "use strict";
  const V = window.HMW?.Dialogue?.Vocabulary;
  if (!V) throw new Error("Vocabulary registry must load first.");

  // Conflict, disagreement, repair and negotiation vocabulary.
  const words = {
    verb: [
      "argue","disagree","object","oppose","refuse","reject","deny","accuse","blame","criticize",
      "complain","protest","insist","demand","threaten","warn","defend","protect","avoid","escape",
      "interrupt","ignore","confront","challenge","fight","hurt","offend","upset","annoy","frustrate",
      "apologize","forgive","admit","explain","clarify","discuss","negotiate","compromise","agree","accept",
      "repair","resolve","settle","reconcile","reassure","trust","listen","understand","respect","change"
    ],
    noun: [
      "argument","disagreement","conflict","problem","complaint","objection","refusal","rejection","denial","accusation",
      "blame","criticism","protest","demand","threat","warning","defense","challenge","fight","harm",
      "offense","anger","frustration","tension","misunderstanding","mistake","fault","apology","forgiveness","admission",
      "explanation","discussion","negotiation","compromise","agreement","solution","repair","resolution","reconciliation","trust",
      "respect","boundary","distance","choice","reason","truth","lie","promise","change","peace"
    ],
    adjective: [
      "angry","upset","annoyed","frustrated","offended","hurt","defensive","hostile","aggressive","calm",
      "peaceful","fair","unfair","reasonable","unreasonable","honest","dishonest","wrong","right","responsible",
      "guilty","innocent","serious","minor","avoidable","unavoidable","resolved","unresolved","acceptable","unacceptable",
      "willing","unwilling","forgiving","apologetic","respectful","disrespectful","clear","unclear","direct","firm"
    ],
    adverb: [
      "angrily","calmly","firmly","fairly","unfairly","honestly","openly","directly","seriously","peacefully",
      "respectfully","politely","rudely","defensively","reasonably","clearly","quietly","immediately","eventually","mutually"
    ]
  };

  const entries = [];
  for (const [pos, lemmas] of Object.entries(words)) {
    for (const lemma of lemmas) {
      entries.push({
        lemma,
        pos,
        tags: ["conflict","repair","negotiation","disagreement","conversation","batch068"]
      });
    }
  }

  V.register(entries);
})();
