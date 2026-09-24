(() => {
  "use strict";
  const V = window.HMW?.Dialogue?.Vocabulary;
  if (!V) throw new Error("Vocabulary registry must load first.");

  // Broad emotion, attitude and interpersonal-state vocabulary.
  const words = {
    verb: [
      "adore","appreciate","care","desire","dislike","envy","fear","hate","hope","love",
      "regret","resent","respect","trust","worry","annoy","bother","calm","comfort","delight",
      "disappoint","embarrass","encourage","excite","frighten","frustrate","interest","relieve","satisfy","surprise",
      "admire","doubt","forgive","miss","prefer","reassure","suspect","value","welcome","wish",
      "panic","hesitate","relax","smile","laugh","cry","complain","praise","apologize","confess"
    ],
    noun: [
      "affection","anger","anxiety","attraction","comfort","confidence","curiosity","desire","disappointment","embarrassment",
      "emotion","envy","excitement","fear","frustration","guilt","happiness","hope","interest","jealousy",
      "joy","love","mood","nervousness","panic","pleasure","pride","regret","relief","sadness",
      "satisfaction","shock","sorrow","stress","surprise","tension","trust","worry","admiration","respect",
      "resentment","doubt","patience","courage","shame","loneliness","kindness","sympathy","gratitude","attitude"
    ],
    adjective: [
      "afraid","angry","anxious","ashamed","attracted","bored","calm","confident","confused","curious",
      "delighted","disappointed","embarrassed","emotional","excited","frightened","frustrated","glad","grateful","guilty",
      "happy","interested","jealous","lonely","nervous","proud","relaxed","relieved","sad","satisfied",
      "scared","shocked","stressed","surprised","upset","worried","affectionate","caring","hopeful","hopeless"
    ],
    adverb: [
      "affectionately","angrily","anxiously","calmly","cheerfully","emotionally","excitedly","fearfully","fondly","gladly",
      "happily","nervously","proudly","reluctantly","sadly","sincerely","warmly","eagerly","gratefully","hopefully"
    ]
  };

  const entries = [];
  for (const [pos, lemmas] of Object.entries(words)) {
    for (const lemma of lemmas) {
      entries.push({
        lemma,
        pos,
        tags: ["emotion","attitude","interpersonal","conversation","batch056"]
      });
    }
  }

  V.register(entries);
})();
