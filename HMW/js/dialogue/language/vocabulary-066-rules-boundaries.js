(() => {
  "use strict";
  const V = window.HMW?.Dialogue?.Vocabulary;
  if (!V) throw new Error("Vocabulary registry must load first.");

  // Obligation, permission, rules, safety and social-boundary vocabulary.
  const words = {
    verb: [
      "allow","permit","forbid","require","order","request","ask","refuse","accept","agree",
      "obey","follow","break","respect","protect","prevent","avoid","stop","continue","warn",
      "advise","recommend","insist","promise","guarantee","authorize","approve","deny","restrict","limit",
      "control","check","confirm","report","complain","apologize","forgive","interrupt","disturb","bother",
      "touch","enter","leave","wait","stay","help","call","contact","escape","hide"
    ],
    noun: [
      "permission","rule","law","order","request","warning","advice","agreement","refusal","approval",
      "restriction","limit","boundary","privacy","safety","danger","risk","emergency","problem","help",
      "choice","right","responsibility","duty","promise","condition","requirement","exception","mistake","violation",
      "permission","consent","decision","control","protection","security","trust","respect","complaint","apology",
      "contact","distance","space","door","exit","police","doctor","hospital","phone","address"
    ],
    adjective: [
      "allowed","forbidden","required","optional","legal","illegal","safe","unsafe","dangerous","risky",
      "acceptable","unacceptable","appropriate","inappropriate","necessary","unnecessary","responsible","irresponsible","careful","careless",
      "private","public","personal","restricted","free","available","unavailable","urgent","serious","secure",
      "protected","unprotected","permitted","prohibited","willing","unwilling","ready","unable","able","certain"
    ],
    adverb: [
      "legally","illegally","safely","carefully","responsibly","privately","publicly","freely","strictly","firmly",
      "politely","respectfully","immediately","urgently","necessarily","optionally","willingly","reluctantly","properly","clearly"
    ]
  };

  const entries = [];
  for (const [pos, lemmas] of Object.entries(words)) {
    for (const lemma of lemmas) {
      entries.push({
        lemma,
        pos,
        tags: ["obligation","permission","rules","safety","boundary","conversation","batch066"]
      });
    }
  }

  V.register(entries);
})();
