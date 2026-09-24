(() => {
  "use strict";
  const V = window.HMW?.Dialogue?.Vocabulary;
  if (!V) throw new Error("Vocabulary registry must load first.");

  // Broad people, family, social-role and interaction vocabulary.
  const words = {
    verb: [
      "introduce","meet","greet","welcome","contact","invite","join","visit","marry","raise",
      "teach","learn","lead","manage","employ","serve","assist","help","protect","support",
      "respect","admire","praise","thank","apologize","forgive","blame","criticize","argue","negotiate",
      "cooperate","share","offer","request","advise","encourage","comfort","reassure","persuade","convince",
      "trust","suspect","recognize","remember","forget","miss","avoid","follow","choose","refuse"
    ],
    noun: [
      "person","people","adult","child","parent","mother","father","daughter","son","sibling",
      "brother","sister","relative","family","couple","spouse","husband","wife","partner","friend",
      "neighbor","guest","host","stranger","colleague","coworker","employee","employer","manager","leader",
      "teacher","student","doctor","nurse","driver","seller","buyer","customer","worker","resident",
      "citizen","visitor","group","team","crowd","relationship","friendship","marriage","meeting","conversation"
    ],
    adjective: [
      "adult","young","old","friendly","unfriendly","kind","unkind","polite","rude","helpful",
      "supportive","independent","dependent","responsible","reliable","unreliable","familiar","unfamiliar","social","professional",
      "married","single","related","close","distant","welcome","unwelcome","respectful","disrespectful","patient",
      "impatient","generous","selfish","honest","dishonest","loyal","disloyal","trustworthy","suspicious","cooperative"
    ],
    adverb: [
      "politely","rudely","kindly","patiently","respectfully","professionally","socially","together","alone","personally",
      "honestly","openly","privately","publicly","warmly","coldly","calmly","angrily","quietly","seriously"
    ]
  };

  const entries = [];
  for (const [pos, lemmas] of Object.entries(words)) {
    for (const lemma of lemmas) {
      entries.push({
        lemma,
        pos,
        tags: ["people","family","social-role","interaction","conversation","batch054"]
      });
    }
  }

  V.register(entries);
})();
