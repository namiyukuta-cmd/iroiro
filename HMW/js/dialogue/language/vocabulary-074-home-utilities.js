(() => {
  "use strict";
  const V = window.HMW?.Dialogue?.Vocabulary;
  if (!V) throw new Error("Vocabulary registry must load first.");

  // Home, maintenance, utilities and neighborhood vocabulary.
  const words = {
    verb: [
      "live","move","rent","own","share","stay","enter","leave","lock","unlock",
      "open","close","repair","fix","replace","install","remove","clean","wash","dry",
      "sweep","mop","vacuum","cook","heat","cool","light","turn","plug","unplug",
      "charge","connect","disconnect","fill","empty","store","throw","recycle","collect","deliver",
      "visit","invite","borrow","lend","complain","report","pay","save","build","maintain"
    ],
    noun: [
      "home","house","apartment","room","kitchen","bathroom","bedroom","hall","stairs","balcony",
      "yard","garden","roof","wall","floor","ceiling","door","window","key","lock",
      "electricity","water","gas","heat","air","light","power","internet","rent","bill",
      "furniture","table","chair","bed","sofa","shelf","closet","fridge","oven","stove",
      "sink","shower","toilet","laundry","trash","neighbor","landlord","tenant","building","maintenance"
    ],
    adjective: [
      "residential","domestic","private","shared","rented","owned","available","occupied","vacant","furnished",
      "unfurnished","clean","dirty","tidy","messy","quiet","noisy","warm","cold","bright",
      "dark","broken","fixed","working","connected","disconnected","locked","unlocked","open","closed",
      "safe","unsafe","comfortable","uncomfortable","nearby","local","monthly","electric","automatic","manual"
    ],
    adverb: [
      "home","indoors","upstairs","downstairs","inside","outside","nearby","locally","monthly","daily",
      "privately","quietly","automatically","manually","properly","safely","together","separately","temporarily","permanently"
    ]
  };

  const entries = [];
  for (const [pos, lemmas] of Object.entries(words)) {
    for (const lemma of lemmas) {
      entries.push({
        lemma,
        pos,
        tags: ["home","maintenance","utilities","neighborhood","conversation","batch074"]
      });
    }
  }

  V.register(entries);
})();
