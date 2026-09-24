(() => {
  "use strict";
  window.HMW = window.HMW || {};
  HMW.Dialogue = HMW.Dialogue || {};

  const irregular = {
  "be": {
    "past": "was",
    "pastPlural": "were",
    "pp": "been",
    "ing": "being",
    "third": "is"
  },
  "have": {
    "past": "had",
    "pp": "had",
    "ing": "having",
    "third": "has"
  },
  "do": {
    "past": "did",
    "pp": "done",
    "ing": "doing",
    "third": "does"
  },
  "go": {
    "past": "went",
    "pp": "gone",
    "ing": "going",
    "third": "goes"
  },
  "come": {
    "past": "came",
    "pp": "come",
    "ing": "coming",
    "third": "comes"
  },
  "see": {
    "past": "saw",
    "pp": "seen",
    "ing": "seeing",
    "third": "sees"
  },
  "say": {
    "past": "said",
    "pp": "said",
    "ing": "saying",
    "third": "says"
  },
  "tell": {
    "past": "told",
    "pp": "told",
    "ing": "telling",
    "third": "tells"
  },
  "think": {
    "past": "thought",
    "pp": "thought",
    "ing": "thinking",
    "third": "thinks"
  },
  "know": {
    "past": "knew",
    "pp": "known",
    "ing": "knowing",
    "third": "knows"
  },
  "feel": {
    "past": "felt",
    "pp": "felt",
    "ing": "feeling",
    "third": "feels"
  },
  "leave": {
    "past": "left",
    "pp": "left",
    "ing": "leaving",
    "third": "leaves"
  },
  "lose": {
    "past": "lost",
    "pp": "lost",
    "ing": "losing",
    "third": "loses"
  },
  "find": {
    "past": "found",
    "pp": "found",
    "ing": "finding",
    "third": "finds"
  },
  "give": {
    "past": "gave",
    "pp": "given",
    "ing": "giving",
    "third": "gives"
  },
  "take": {
    "past": "took",
    "pp": "taken",
    "ing": "taking",
    "third": "takes"
  },
  "bring": {
    "past": "brought",
    "pp": "brought",
    "ing": "bringing",
    "third": "brings"
  },
  "buy": {
    "past": "bought",
    "pp": "bought",
    "ing": "buying",
    "third": "buys"
  },
  "pay": {
    "past": "paid",
    "pp": "paid",
    "ing": "paying",
    "third": "pays"
  },
  "spend": {
    "past": "spent",
    "pp": "spent",
    "ing": "spending",
    "third": "spends"
  },
  "get": {
    "past": "got",
    "pp": "gotten",
    "ing": "getting",
    "third": "gets"
  },
  "keep": {
    "past": "kept",
    "pp": "kept",
    "ing": "keeping",
    "third": "keeps"
  },
  "hold": {
    "past": "held",
    "pp": "held",
    "ing": "holding",
    "third": "holds"
  },
  "hear": {
    "past": "heard",
    "pp": "heard",
    "ing": "hearing",
    "third": "hears"
  },
  "meet": {
    "past": "met",
    "pp": "met",
    "ing": "meeting",
    "third": "meets"
  },
  "sit": {
    "past": "sat",
    "pp": "sat",
    "ing": "sitting",
    "third": "sits"
  },
  "stand": {
    "past": "stood",
    "pp": "stood",
    "ing": "standing",
    "third": "stands"
  },
  "run": {
    "past": "ran",
    "pp": "run",
    "ing": "running",
    "third": "runs"
  },
  "sleep": {
    "past": "slept",
    "pp": "slept",
    "ing": "sleeping",
    "third": "sleeps"
  },
  "wake": {
    "past": "woke",
    "pp": "woken",
    "ing": "waking",
    "third": "wakes"
  },
  "eat": {
    "past": "ate",
    "pp": "eaten",
    "ing": "eating",
    "third": "eats"
  },
  "drink": {
    "past": "drank",
    "pp": "drunk",
    "ing": "drinking",
    "third": "drinks"
  },
  "wear": {
    "past": "wore",
    "pp": "worn",
    "ing": "wearing",
    "third": "wears"
  },
  "write": {
    "past": "wrote",
    "pp": "written",
    "ing": "writing",
    "third": "writes"
  },
  "read": {
    "past": "read",
    "pp": "read",
    "ing": "reading",
    "third": "reads"
  },
  "speak": {
    "past": "spoke",
    "pp": "spoken",
    "ing": "speaking",
    "third": "speaks"
  },
  "understand": {
    "past": "understood",
    "pp": "understood",
    "ing": "understanding",
    "third": "understands"
  },
  "forget": {
    "past": "forgot",
    "pp": "forgotten",
    "ing": "forgetting",
    "third": "forgets"
  },
  "forgive": {
    "past": "forgave",
    "pp": "forgiven",
    "ing": "forgiving",
    "third": "forgives"
  },
  "choose": {
    "past": "chose",
    "pp": "chosen",
    "ing": "choosing",
    "third": "chooses"
  },
  "begin": {
    "past": "began",
    "pp": "begun",
    "ing": "beginning",
    "third": "begins"
  },
  "fall": {
    "past": "fell",
    "pp": "fallen",
    "ing": "falling",
    "third": "falls"
  },
  "grow": {
    "past": "grew",
    "pp": "grown",
    "ing": "growing",
    "third": "grows"
  },
  "break": {
    "past": "broke",
    "pp": "broken",
    "ing": "breaking",
    "third": "breaks"
  },
  "catch": {
    "past": "caught",
    "pp": "caught",
    "ing": "catching",
    "third": "catches"
  },
  "throw": {
    "past": "threw",
    "pp": "thrown",
    "ing": "throwing",
    "third": "throws"
  },
  "win": {
    "past": "won",
    "pp": "won",
    "ing": "winning",
    "third": "wins"
  },
  "lead": {
    "past": "led",
    "pp": "led",
    "ing": "leading",
    "third": "leads"
  },
  "lend": {
    "past": "lent",
    "pp": "lent",
    "ing": "lending",
    "third": "lends"
  },
  "lie": {
    "past": "lay",
    "pp": "lain",
    "ing": "lying",
    "third": "lies"
  },
  "hurt": {
    "past": "hurt",
    "pp": "hurt",
    "ing": "hurting",
    "third": "hurts"
  },
  "put": {
    "past": "put",
    "pp": "put",
    "ing": "putting",
    "third": "puts"
  },
  "cut": {
    "past": "cut",
    "pp": "cut",
    "ing": "cutting",
    "third": "cuts"
  },
  "let": {
    "past": "let",
    "pp": "let",
    "ing": "letting",
    "third": "lets"
  },
  "cost": {
    "past": "cost",
    "pp": "cost",
    "ing": "costing",
    "third": "costs"
  }
};

  const regularPast = word => {
    if (/e$/i.test(word)) return word + "d";
    if (/[^aeiou]y$/i.test(word)) return word.slice(0,-1) + "ied";
    return word + "ed";
  };

  const regularIng = word => {
    if (/ie$/i.test(word)) return word.slice(0,-2) + "ying";
    if (/e$/i.test(word) && !/ee$/i.test(word)) return word.slice(0,-1) + "ing";
    return word + "ing";
  };

  const regularThird = word => {
    if (/(s|x|z|ch|sh|o)$/i.test(word)) return word + "es";
    if (/[^aeiou]y$/i.test(word)) return word.slice(0,-1) + "ies";
    return word + "s";
  };

  HMW.Dialogue.Morphology = {
    irregular,
    verbForm(lemma, form="base") {
      const word=String(lemma||"").toLowerCase();
      if (!word) return "";
      if (form==="base") return word;
      const item=irregular[word];
      if (item && item[form]) return item[form];
      if (form==="past" || form==="pp") return regularPast(word);
      if (form==="ing") return regularIng(word);
      if (form==="third") return regularThird(word);
      return word;
    },
    beFor(subject, tense="present") {
      const s=String(subject||"").toLowerCase();
      if (tense==="past") return s==="you" || s==="we" || s==="they" ? "were" : "was";
      if (s==="i") return "am";
      if (s==="you" || s==="we" || s==="they") return "are";
      return "is";
    },
    doFor(subject, tense="present") {
      if (tense==="past") return "did";
      return /^(he|she|it)$/i.test(String(subject||"")) ? "does" : "do";
    },
    haveFor(subject) {
      return /^(he|she|it)$/i.test(String(subject||"")) ? "has" : "have";
    }
  };
})();
