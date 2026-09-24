(() => {
  "use strict";
  const V = window.HMW?.Dialogue?.Vocabulary;
  if (!V) throw new Error("Vocabulary registry must load first.");

  // Health, body condition and care vocabulary for everyday dialogue.
  const words = {
    verb: [
      "ache","bleed","breathe","cough","diagnose","exercise","heal","hurt","recover",
      "relax","sneeze","treat","vomit","weigh","wound"
    ],
    noun: [
      "ache","allergy","bandage","blood","breath","cough","disease","fever","headache",
      "health","injury","pain","pulse","recovery","rest","sneeze","stress","symptom",
      "treatment","wound"
    ],
    adjective: [
      "allergic","awake","dizzy","healthy","injured","painful","pale","sleepy","sore",
      "stressed","unwell","weak"
    ],
    adverb: [
      "badly","physically","slowly"
    ]
  };

  const entries = [];
  for (const [pos, lemmas] of Object.entries(words)) {
    for (const lemma of lemmas) {
      entries.push({
        lemma,
        pos,
        tags: ["health","condition","care","conversation","batch029"]
      });
    }
  }

  V.register(entries);
})();
