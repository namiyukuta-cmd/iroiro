(() => {
  "use strict";
  const V = window.HMW?.Dialogue?.Vocabulary;
  if (!V) throw new Error("Vocabulary registry must load first.");

  // Broad planning, time, change and consequence vocabulary.
  const words = {
    verb: [
      "begin","start","continue","stop","finish","end","delay","postpone","cancel","schedule",
      "arrange","prepare","plan","expect","intend","decide","choose","change","remain","become",
      "improve","worsen","increase","decrease","grow","reduce","develop","prevent","cause","affect",
      "result","happen","occur","follow","lead","allow","require","depend","avoid","solve",
      "try","succeed","fail","manage","complete","repeat","continue","wait","hurry","last"
    ],
    noun: [
      "beginning","start","continuation","end","delay","schedule","plan","intention","decision","choice",
      "change","result","cause","effect","consequence","condition","requirement","possibility","probability","chance",
      "success","failure","attempt","progress","problem","solution","step","process","period","moment",
      "minute","hour","day","week","month","year","morning","afternoon","evening","night",
      "past","present","future","deadline","appointment","event","occasion","turn","order","timing"
    ],
    adjective: [
      "early","late","current","previous","next","future","past","present","temporary","permanent",
      "immediate","eventual","sudden","gradual","possible","impossible","probable","unlikely","necessary","unnecessary",
      "required","optional","planned","unexpected","successful","unsuccessful","finished","unfinished","ready","unready",
      "urgent","delayed","available","pending","continuous","repeated","final","initial","recent","upcoming"
    ],
    adverb: [
      "already","soon","later","now","currently","previously","eventually","immediately","finally","initially",
      "gradually","suddenly","temporarily","permanently","repeatedly","continuously","before","afterward","meanwhile","eventually"
    ]
  };

  const entries = [];
  for (const [pos, lemmas] of Object.entries(words)) {
    for (const lemma of lemmas) {
      entries.push({
        lemma,
        pos,
        tags: ["planning","time","change","consequence","conversation","batch060"]
      });
    }
  }

  V.register(entries);
})();
