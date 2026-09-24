(() => {
  "use strict";
  const V = window.HMW?.Dialogue?.Vocabulary;
  if (!V) throw new Error("Vocabulary registry must load first.");

  // Everyday conversation expansion: communication, plans, movement, household,
  // work, shopping, health, relationships and common descriptive language.
  const words = {
    verb: [
      "acknowledge","advise","answer","approach","assume","borrow","cancel","choose",
      "compare","contact","decide","delay","deny","disclose","encounter","explain",
      "follow","guess","ignore","mention","notice","offer","order","prefer","prepare",
      "promise","prove","question","realize","receive","reject","request","reserve",
      "return","save","select","solve","state","trust","visit"
    ],
    noun: [
      "advice","answer","appointment","attitude","chance","condition","conversation",
      "detail","direction","explanation","favor","goal","habit","idea","information",
      "issue","message","mistake","option","problem","question","reservation","result",
      "situation","solution","statement","subject","topic","visit","voice"
    ],
    adjective: [
      "aware","available","certain","correct","different","difficult","direct","easy",
      "familiar","important","likely","necessary","normal","obvious","patient","possible",
      "quiet","reasonable","responsible","similar","specific","strange","sure","uncertain",
      "unusual","urgent"
    ],
    adverb: [
      "absolutely","eventually","immediately","normally","occasionally","personally",
      "possibly","recently","simply","suddenly","usually"
    ]
  };

  const entries = [];
  for (const [pos, lemmas] of Object.entries(words)) {
    for (const lemma of lemmas) {
      entries.push({
        lemma,
        pos,
        tags: ["conversation","daily","common","batch025"]
      });
    }
  }

  V.register(entries);
})();
