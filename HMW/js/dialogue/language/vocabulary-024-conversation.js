(() => {
  "use strict";
  const V = window.HMW?.Dialogue?.Vocabulary;
  if (!V) throw new Error("Vocabulary registry must load first.");

  // Conversation-focused vocabulary batch.
  // The registry de-duplicates by lemma + part of speech, so loading this batch is safe
  // even when a lemma already exists in an earlier vocabulary file.
  const words = {
    verb: [
      "accept","agree","apologize","clarify","convince","doubt","forbid","forgive",
      "hesitate","insist","interrupt","invite","misunderstand","negotiate","permit",
      "persuade","reassure","refuse","remind","repeat","reply","suggest","warn","wonder"
    ],
    noun: [
      "apology","clarification","certainty","doubt","evidence","forgiveness","hesitation",
      "honesty","lie","misunderstanding","negotiation","opinion","patience","plan",
      "preference","privacy","reason","reply","respect","secret","truth","uncertainty",
      "warning","want","need"
    ],
    adjective: [
      "afraid","anxious","busy","calm","comfortable","confused","curious","dangerous",
      "disappointed","embarrassed","free","grateful","jealous","nervous","private",
      "public","ready","relieved","safe","serious","surprised","uncomfortable","upset"
    ],
    adverb: [
      "actually","already","apart","apparently","certainly","definitely","exactly",
      "instead","later","maybe","nearby","otherwise","perhaps","probably","soon",
      "still","together","tomorrow","tonight","yesterday","yet"
    ]
  };

  const entries = [];
  for (const [pos, lemmas] of Object.entries(words)) {
    for (const lemma of lemmas) {
      entries.push({
        lemma,
        pos,
        tags: ["conversation","common","batch024"]
      });
    }
  }

  V.register(entries);
})();
