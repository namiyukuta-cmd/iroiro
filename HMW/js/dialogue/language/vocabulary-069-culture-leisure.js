(() => {
  "use strict";
  const V = window.HMW?.Dialogue?.Vocabulary;
  if (!V) throw new Error("Vocabulary registry must load first.");

  // Education, culture, entertainment and leisure vocabulary.
  const words = {
    verb: [
      "study","learn","teach","practice","train","read","write","draw","paint","sing",
      "dance","play","watch","listen","perform","create","design","build","collect","visit",
      "travel","explore","photograph","record","celebrate","enjoy","relax","exercise","compete","win",
      "lose","join","attend","participate","invite","entertain","cook","garden","fish","camp",
      "hike","swim","ride","shop","browse","borrow","return","share","recommend","review"
    ],
    noun: [
      "school","class","lesson","course","teacher","student","book","story","novel","poem",
      "music","song","movie","film","show","game","sport","art","painting","drawing",
      "photo","camera","museum","library","theater","concert","festival","party","holiday","vacation",
      "hobby","interest","collection","club","team","competition","practice","training","exercise","walk",
      "trip","camp","picnic","garden","park","beach","restaurant","cafe","shop","market"
    ],
    adjective: [
      "educational","cultural","creative","artistic","musical","interesting","boring","fun","enjoyable","entertaining",
      "popular","famous","traditional","modern","classic","original","new","old","public","private",
      "indoor","outdoor","active","relaxing","competitive","casual","serious","skilled","beginner","advanced",
      "favorite","available","free","busy","crowded","quiet","local","foreign","live","recorded"
    ],
    adverb: [
      "creatively","artistically","musically","actively","casually","seriously","regularly","occasionally","together","alone",
      "indoors","outdoors","live","online","locally","abroad","freely","quietly","happily","competitively"
    ]
  };

  const entries = [];
  for (const [pos, lemmas] of Object.entries(words)) {
    for (const lemma of lemmas) {
      entries.push({
        lemma,
        pos,
        tags: ["education","culture","entertainment","leisure","conversation","batch069"]
      });
    }
  }

  V.register(entries);
})();
