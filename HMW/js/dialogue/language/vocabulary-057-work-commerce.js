(() => {
  "use strict";
  const V = window.HMW?.Dialogue?.Vocabulary;
  if (!V) throw new Error("Vocabulary registry must load first.");

  // Broad work, money, commerce and responsibility vocabulary.
  const words = {
    verb: [
      "apply","approve","budget","calculate","charge","collect","deposit","earn","employ","estimate",
      "hire","invest","invoice","owe","pay","purchase","refund","repay","sell","spend",
      "trade","transfer","withdraw","work","manage","organize","prepare","produce","provide","serve",
      "deliver","order","reserve","book","cancel","repair","maintain","operate","report","record",
      "check","count","measure","plan","schedule","finish","start","continue","complete","handle"
    ],
    noun: [
      "account","balance","bank","bill","budget","business","cash","coin","contract","cost",
      "credit","currency","customer","debt","deposit","discount","employee","employer","fee","income",
      "invoice","job","loan","manager","money","order","payment","price","profit","purchase",
      "refund","salary","sale","service","shift","tax","trade","wage","work","career",
      "company","office","task","project","responsibility","duty","schedule","deadline","meeting","appointment"
    ],
    adjective: [
      "affordable","available","busy","cheap","costly","employed","expensive","financial","free","profitable",
      "refundable","responsible","scheduled","unavailable","unemployed","unpaid","valuable","worthless","professional","temporary",
      "permanent","finished","unfinished","complete","incomplete","necessary","optional","required","urgent","important",
      "daily","weekly","monthly","annual","paid","financial","commercial","official","private","public"
    ],
    adverb: [
      "financially","monthly","weekly","yearly","officially","professionally","commercially","regularly","immediately","eventually",
      "currently","temporarily","permanently","properly","carefully","quickly","slowly","directly","locally","online"
    ]
  };

  const entries = [];
  for (const [pos, lemmas] of Object.entries(words)) {
    for (const lemma of lemmas) {
      entries.push({
        lemma,
        pos,
        tags: ["work","money","commerce","responsibility","conversation","batch057"]
      });
    }
  }

  V.register(entries);
})();
