(() => {
  "use strict";
  const V = window.HMW?.Dialogue?.Vocabulary;
  if (!V) throw new Error("Vocabulary registry must load first.");

  // Work, money and transaction vocabulary for practical NPC dialogue.
  const words = {
    verb: [
      "apply","budget","calculate","collect","deposit","earn","employ","estimate","invoice",
      "owe","refund","repay","sell","ship","trade","transfer","work","rent","tip","waste"
    ],
    noun: [
      "account","balance","budget","business","career","coin","contract","cost","credit",
      "currency","customer","debt","deposit","discount","employee","employer","fee","income",
      "invoice","job","loan","manager","order","price","profit","purchase","refund","salary",
      "sale","service","shift","tax","trade","wage","work"
    ],
    adjective: [
      "affordable","employed","financial","profitable","refundable","unemployed","unpaid",
      "valuable","worthless"
    ],
    adverb: [
      "financially","monthly","weekly","yearly"
    ]
  };

  const entries = [];
  for (const [pos, lemmas] of Object.entries(words)) {
    for (const lemma of lemmas) {
      entries.push({
        lemma,
        pos,
        tags: ["work","money","transaction","conversation","batch028"]
      });
    }
  }

  V.register(entries);
})();
