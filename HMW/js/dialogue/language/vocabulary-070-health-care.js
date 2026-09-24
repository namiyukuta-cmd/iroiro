(() => {
  "use strict";
  const V = window.HMW?.Dialogue?.Vocabulary;
  if (!V) throw new Error("Vocabulary registry must load first.");

  // Health, treatment, care and recovery vocabulary.
  const words = {
    verb: [
      "ache","bleed","breathe","cough","sneeze","hurt","injure","heal","recover","rest",
      "sleep","wake","eat","drink","swallow","vomit","faint","tremble","sweat","exercise",
      "walk","stretch","treat","examine","diagnose","prescribe","bandage","clean","wash","disinfect",
      "measure","check","monitor","help","care","support","protect","call","visit","admit",
      "release","improve","worsen","reduce","relieve","prevent","avoid","infect","spread","survive"
    ],
    noun: [
      "health","illness","disease","injury","wound","pain","ache","fever","cold","cough",
      "headache","stomachache","infection","symptom","condition","treatment","medicine","tablet","pill","bandage",
      "doctor","nurse","patient","hospital","clinic","pharmacy","appointment","examination","diagnosis","recovery",
      "rest","sleep","exercise","diet","food","water","breath","blood","temperature","pulse",
      "emergency","ambulance","accident","care","help","support","risk","danger","allergy","fatigue"
    ],
    adjective: [
      "healthy","sick","ill","injured","hurt","wounded","tired","sleepy","weak","strong",
      "dizzy","nauseous","feverish","sore","painful","swollen","infected","bleeding","unconscious","awake",
      "stable","unstable","better","worse","serious","mild","urgent","medical","safe","dangerous",
      "clean","dirty","rested","exhausted","hungry","thirsty","allergic","recovering","treated","untreated"
    ],
    adverb: [
      "physically","medically","carefully","slowly","deeply","regularly","daily","immediately","urgently","safely",
      "properly","fully","partly","gradually","suddenly","seriously","mildly","steadily","comfortably","painfully"
    ]
  };

  const entries = [];
  for (const [pos, lemmas] of Object.entries(words)) {
    for (const lemma of lemmas) {
      entries.push({
        lemma,
        pos,
        tags: ["health","treatment","care","recovery","conversation","batch070"]
      });
    }
  }

  V.register(entries);
})();
