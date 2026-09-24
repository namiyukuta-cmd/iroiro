(() => {
  "use strict";
  const V = window.HMW?.Dialogue?.Vocabulary;
  if (!V) throw new Error("Vocabulary registry must load first.");

  // Romance, attachment, intimacy-safe and relationship-state vocabulary.
  const words = {
    verb: [
      "love","like","adore","admire","attract","care","cherish","trust","miss","want",
      "need","prefer","choose","date","marry","kiss","hug","hold","touch","meet",
      "invite","stay","leave","return","wait","promise","commit","support","comfort","reassure",
      "confess","flirt","tease","smile","blush","hesitate","approach","avoid","reject","accept",
      "forgive","apologize","argue","reconcile","betray","doubt","suspect","believe","share","protect"
    ],
    noun: [
      "love","affection","attraction","romance","relationship","couple","partner","date","marriage","commitment",
      "trust","loyalty","jealousy","desire","interest","feeling","emotion","confession","promise","kiss",
      "hug","touch","closeness","distance","bond","connection","support","comfort","care","attention",
      "flirtation","teasing","blush","smile","argument","conflict","apology","forgiveness","betrayal","doubt",
      "suspicion","reassurance","choice","future","home","privacy","boundary","permission","respect","separation"
    ],
    adjective: [
      "romantic","loving","affectionate","attracted","interested","close","distant","loyal","faithful","jealous",
      "trusting","suspicious","caring","gentle","tender","warm","shy","embarrassed","nervous","comfortable",
      "uncomfortable","single","married","committed","serious","casual","private","intimate","welcome","unwelcome",
      "wanted","unwanted","important","special","honest","dishonest","faithful","unfaithful","protective","supportive"
    ],
    adverb: [
      "affectionately","romantically","gently","tenderly","warmly","closely","privately","honestly","faithfully","shyly",
      "nervously","comfortably","seriously","casually","lovingly","respectfully","willingly","reluctantly","quietly","openly"
    ]
  };

  const entries = [];
  for (const [pos, lemmas] of Object.entries(words)) {
    for (const lemma of lemmas) {
      entries.push({
        lemma,
        pos,
        tags: ["romance","relationship","attachment","intimacy-safe","conversation","batch067"]
      });
    }
  }

  V.register(entries);
})();
