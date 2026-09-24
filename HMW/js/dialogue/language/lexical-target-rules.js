(() => {
  "use strict";
  window.HMW = window.HMW || {};
  HMW.Dialogue = HMW.Dialogue || {};

  HMW.Dialogue.LEXICAL_TARGET_RULES = {
    love: ["love","care","feelings"],
    like: ["like","care"],
    trust: ["trust","believe"],
    betrayal: ["betray","trust","loyal"],
    rejection: ["want","leave","relationship"],
    abandonment: ["leave","stay","come back"],
    distance: ["leave","space","distance"],
    safety: ["safe","hurt","protect"],
    death: ["die","lose"],
    harm: ["hurt","safe"],
    relationship: ["relationship","together","us"],
    jealousy: ["jealous","other person"],
    other_person: ["who","person","them"],
    apology: ["sorry","apology","forgive"],
    promise: ["promise","trust"],
    work: ["work","job"],
    money: ["money","afford","pay"],
    food: ["food","eat","hungry"],
    water: ["water","drink","thirsty"],
    sleep: ["sleep","rest","tired"],
    health: ["sick","hurt","health"],
    weather: ["rain","cold","weather"],
    home: ["home","stay","go"],
    meeting: ["meet","see","again"]
  };

  HMW.Dialogue.expandLexicalTargets = function expandLexicalTargets(analysis = {}) {
    const explicit = Array.isArray(analysis.lexicalTargets) ? analysis.lexicalTargets : [];
    const concepts = Array.isArray(analysis.focusConcepts) ? analysis.focusConcepts : [];
    const expanded = [...explicit];

    for (const concept of concepts) {
      const candidates = HMW.Dialogue.LEXICAL_TARGET_RULES[String(concept)] || [];
      for (const word of candidates) {
        if (!expanded.includes(word)) expanded.push(word);
      }
    }
    return expanded;
  };
})();
