(() => {
  "use strict";
  const V = window.HMW?.Dialogue?.Vocabulary;
  if (!V) throw new Error("Vocabulary registry must load first.");

  // Home, household and routine vocabulary for everyday dialogue.
  const words = {
    verb: [
      "bathe","brush","dry","fold","hang","iron","move","organize","sweep","tidy",
      "vacuum","wake","wipe"
    ],
    noun: [
      "apartment","bathroom","bed","bedroom","blanket","chair","closet","curtain",
      "desk","furniture","garage","garden","hallway","home","house","household",
      "lamp","mirror","pillow","roof","shelf","shower","sink","sofa","stair",
      "table","towel","yard"
    ],
    adjective: [
      "comfortable","cozy","domestic","messy","neat","noisy","silent","spacious",
      "tiny"
    ],
    adverb: [
      "daily","home","overnight"
    ]
  };

  const entries = [];
  for (const [pos, lemmas] of Object.entries(words)) {
    for (const lemma of lemmas) {
      entries.push({
        lemma,
        pos,
        tags: ["home","household","routine","daily-life","conversation","batch032"]
      });
    }
  }

  V.register(entries);
})();
