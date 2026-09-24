(() => {
  "use strict";
  const V = window.HMW?.Dialogue?.Vocabulary;
  if (!V) throw new Error("Vocabulary registry must load first.");

  // Shopping, customer service, payment and transaction vocabulary.
  const words = {
    verb: [
      "buy","sell","pay","charge","cost","spend","save","order","choose","compare",
      "try","return","exchange","refund","reserve","book","cancel","deliver","ship","collect",
      "pack","wrap","open","close","check","scan","weigh","measure","count","add",
      "remove","offer","recommend","request","ask","answer","show","find","search","stock",
      "replace","repair","borrow","rent","hire","sign","confirm","receive","send","tip"
    ],
    noun: [
      "shop","store","market","customer","seller","cashier","clerk","product","item","goods",
      "price","cost","discount","sale","offer","deal","cash","card","payment","receipt",
      "change","coin","bill","account","order","delivery","package","box","bag","size",
      "color","brand","model","stock","service","counter","queue","line","refund","exchange",
      "reservation","booking","fee","tax","total","tip","warranty","repair","rental","choice"
    ],
    adjective: [
      "cheap","expensive","affordable","free","available","unavailable","sold-out","discounted","regular","special",
      "new","used","damaged","broken","working","refundable","nonrefundable","returnable","exchangeable","reserved",
      "paid","unpaid","cashless","local","imported","large","small","medium","correct","incorrect",
      "open","closed","busy","crowded","empty","ready","late","early","popular","recommended"
    ],
    adverb: [
      "cheaply","expensively","online","locally","directly","immediately","later","separately","together","correctly",
      "incorrectly","fully","partly","exactly","approximately","currently","temporarily","officially","personally","freely"
    ]
  };

  const entries = [];
  for (const [pos, lemmas] of Object.entries(words)) {
    for (const lemma of lemmas) {
      entries.push({
        lemma,
        pos,
        tags: ["shopping","service","payment","transaction","conversation","batch073"]
      });
    }
  }

  V.register(entries);
})();
