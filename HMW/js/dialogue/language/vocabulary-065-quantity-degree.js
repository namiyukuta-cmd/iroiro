(() => {
  "use strict";
  const V = window.HMW?.Dialogue?.Vocabulary;
  if (!V) throw new Error("Vocabulary registry must load first.");

  // Quantity, degree, comparison, frequency and measurement vocabulary.
  const words = {
    verb: [
      "add","subtract","increase","decrease","reduce","double","halve","count","measure","weigh",
      "compare","equal","match","exceed","lack","contain","include","remain","divide","multiply",
      "total","average","estimate","limit","fill","empty","share","split","combine","separate",
      "grow","shrink","expand","narrow","raise","lower","repeat","continue","vary","range"
    ],
    noun: [
      "amount","number","quantity","total","half","quarter","pair","dozen","hundred","thousand",
      "million","percent","percentage","average","maximum","minimum","limit","difference","balance","remainder",
      "weight","length","height","width","depth","size","distance","speed","temperature","degree",
      "frequency","rate","level","portion","piece","part","whole","group","set","pair",
      "meter","centimeter","kilometer","gram","kilogram","liter","milliliter","minute","hour","time"
    ],
    adjective: [
      "many","few","several","numerous","multiple","single","double","half","whole","enough",
      "extra","additional","remaining","equal","unequal","more","less","most","least","maximum",
      "minimum","large","small","huge","tiny","heavy","light","long","short","high",
      "low","wide","narrow","deep","shallow","frequent","rare","common","exact","approximate"
    ],
    adverb: [
      "much","little","more","less","most","least","enough","almost","approximately","exactly",
      "twice","once","often","frequently","usually","sometimes","occasionally","rarely","never","always",
      "partly","fully","completely","slightly","greatly","equally","mostly","entirely","roughly","nearly"
    ]
  };

  const entries = [];
  for (const [pos, lemmas] of Object.entries(words)) {
    for (const lemma of lemmas) {
      entries.push({
        lemma,
        pos,
        tags: ["quantity","degree","comparison","measurement","conversation","batch065"]
      });
    }
  }

  V.register(entries);
})();
