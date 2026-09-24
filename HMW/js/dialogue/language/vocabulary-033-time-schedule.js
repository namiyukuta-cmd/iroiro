(() => {
  "use strict";
  const V = window.HMW?.Dialogue?.Vocabulary;
  if (!V) throw new Error("Vocabulary registry must load first.");

  // Time, schedule and frequency vocabulary for dialogue planning and answers.
  const words = {
    verb: [
      "begin","continue","end","finish","happen","last","postpone","schedule","start"
    ],
    noun: [
      "afternoon","calendar","date","day","deadline","evening","future","hour","midnight",
      "minute","moment","morning","night","noon","past","schedule","second","today",
      "week","weekend","year"
    ],
    adjective: [
      "annual","current","early","future","immediate","previous","recent","scheduled",
      "temporary"
    ],
    adverb: [
      "afterward","beforehand","currently","early","frequently","hourly","meanwhile",
      "never","often","rarely","sometimes","temporarily"
    ]
  };

  const entries = [];
  for (const [pos, lemmas] of Object.entries(words)) {
    for (const lemma of lemmas) {
      entries.push({
        lemma,
        pos,
        tags: ["time","schedule","frequency","conversation","batch033"]
      });
    }
  }

  V.register(entries);
})();
