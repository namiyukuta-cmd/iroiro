(() => {
  "use strict";
  window.HMW = window.HMW || {};
  HMW.Dialogue = HMW.Dialogue || {};

  HMW.Dialogue.LEXICAL_TARGET_RULES = {
    love: ["love","care","feelings","affection"],
    like: ["like","care","interest"],
    trust: ["trust","believe","honest"],
    betrayal: ["betray","trust","loyal"],
    rejection: ["want","leave","relationship","reject"],
    abandonment: ["leave","stay","return","come back"],
    distance: ["leave","space","distance","away"],
    safety: ["safe","hurt","protect","danger"],
    death: ["die","lose","death"],
    harm: ["hurt","safe","harm"],
    relationship: ["relationship","together","partner","us"],
    feelings: ["feel","care","love","like","attraction"],
    jealousy: ["jealous","other person"],
    other_person: ["who","person","them"],
    apology: ["sorry","apology","forgive"],
    promise: ["promise","trust","return","stay"],
    work: ["work","job","shift","salary"],
    job: ["job","work","hire","employment"],
    money: ["money","afford","pay","cost","price"],
    price: ["price","cost","pay","money"],
    food: ["food","eat","hungry","meal"],
    water: ["water","drink","thirsty"],
    sleep: ["sleep","rest","tired"],
    health: ["sick","hurt","health","medicine"],
    injury: ["hurt","injury","wound","pain"],
    illness: ["sick","illness","medicine","health"],
    weather: ["rain","cold","weather","warm"],
    home: ["home","stay","go","room"],
    meeting: ["meet","see","again"],
    time: ["when","time","later","now"],
    place: ["where","place","here","there"],
    travel: ["go","come","travel","route"],
    arrival: ["arrive","here"],
    departure: ["leave","go"],
    return: ["return","come back"],
    contact: ["call","message","contact"],
    future: ["will","plan","later"],
    past: ["was","did","before"],
    plan: ["plan","will","going to"],
    preference: ["prefer","like","want"],
    desire: ["want","wish","desire"],
    need: ["need","must","have to"],
    choice: ["choose","choice","prefer"],
    certainty: ["sure","certain","know"],
    event: ["happen","event","what"],
    identity: ["name","role","who"],
    origin: ["from","place","home"],
    destination: ["go","destination","where"],
    quantity: ["how many","number","amount"],
    possession: ["have","own","carry"],
    capability: ["can","able","help"],
    availability: ["available","free","time"],
    relationship_status: ["relationship","partner","friend","together"],
    hunger: ["hungry","food","eat"],
    thirst: ["thirsty","water","drink"],
    tiredness: ["tired","rest","sleep"],
    shelter: ["shelter","home","inside"],
    rent: ["rent","pay","home"],
    family: ["family","relative","parent","child"],
    friend: ["friend","trust","together"],
    company: ["together","stay","with"],
    entry: ["enter","inside","come in"],
    waiting: ["wait","stay","later"]
  };

  HMW.Dialogue.expandLexicalTargets = function expandLexicalTargets(analysis = {}) {
    const explicit = Array.isArray(analysis.lexicalTargets) ? analysis.lexicalTargets : [];
    const concepts = Array.isArray(analysis.focusConcepts) ? analysis.focusConcepts : [];
    const claims = Array.isArray(analysis.claims) ? analysis.claims : [];
    const questions = Array.isArray(analysis.questions) ? analysis.questions : [];
    const expanded = [...explicit];

    const addConcept = concept => {
      const candidates = HMW.Dialogue.LEXICAL_TARGET_RULES[String(concept)] || [];
      for (const word of candidates) {
        if (!expanded.includes(word)) expanded.push(word);
      }
    };

    for (const concept of concepts) addConcept(concept);
    for (const claim of claims) addConcept(claim?.concept);
    for (const question of questions) {
      addConcept(question?.concept);
      addConcept(question?.kind);
      if (question?.target && !expanded.includes(question.target)) {
        expanded.push(question.target);
      }
      if (question?.action && !expanded.includes(question.action)) {
        expanded.push(question.action);
      }
    }

    return expanded.filter(Boolean);
  };
})();
