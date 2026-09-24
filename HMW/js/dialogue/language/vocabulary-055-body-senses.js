(() => {
  "use strict";
  const V = window.HMW?.Dialogue?.Vocabulary;
  if (!V) throw new Error("Vocabulary registry must load first.");

  // Broad sensory, perception and physical-state vocabulary.
  const words = {
    verb: [
      "see","look","watch","notice","observe","stare","glance","hear","listen","sound",
      "smell","taste","touch","feel","sense","breathe","blink","nod","shake","smile",
      "laugh","cry","sigh","yawn","cough","sneeze","bleed","ache","hurt","heal",
      "recover","relax","exercise","stand","sit","lie","kneel","bend","stretch","turn",
      "walk","run","jump","fall","rise","wake","sleep","eat","drink","swallow"
    ],
    noun: [
      "body","head","face","eye","ear","nose","mouth","tooth","neck","shoulder",
      "arm","hand","finger","chest","back","stomach","leg","knee","foot","skin",
      "hair","voice","sound","smell","taste","touch","breath","blood","pain","ache",
      "injury","wound","fever","health","strength","energy","sleep","hunger","thirst","fatigue",
      "sight","hearing","sense","movement","expression","smile","tear","heartbeat","pulse","temperature"
    ],
    adjective: [
      "awake","asleep","alive","tired","sleepy","hungry","thirsty","sick","healthy","injured",
      "hurt","sore","dizzy","weak","strong","pale","warm","cold","hot","cool",
      "wet","dry","clean","dirty","loud","silent","bright","dark","visible","invisible",
      "soft","hard","smooth","rough","sharp","blunt","heavy","light","comfortable","uncomfortable"
    ],
    adverb: [
      "aloud","silently","softly","loudly","gently","firmly","slowly","quickly","carefully","suddenly",
      "physically","deeply","barely","closely","briefly","steadily","weakly","strongly","visibly","quietly"
    ]
  };

  const entries = [];
  for (const [pos, lemmas] of Object.entries(words)) {
    for (const lemma of lemmas) {
      entries.push({
        lemma,
        pos,
        tags: ["body","sense","perception","physical-state","conversation","batch055"]
      });
    }
  }

  V.register(entries);
})();
