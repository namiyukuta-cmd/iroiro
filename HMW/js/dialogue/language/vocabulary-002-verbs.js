(() => {
  "use strict";
  const V = window.HMW?.Dialogue?.Vocabulary;
  if (!V) throw new Error("Vocabulary registry must load first.");
  V.register([
  {
    "lemma": "be",
    "pos": "verb",
    "past": "were",
    "pastParticiple": "been",
    "ing": "being"
  },
  {
    "lemma": "have",
    "pos": "verb",
    "past": "had",
    "pastParticiple": "had",
    "ing": "having"
  },
  {
    "lemma": "do",
    "pos": "verb",
    "past": "did",
    "pastParticiple": "done",
    "ing": "doing"
  },
  {
    "lemma": "say",
    "pos": "verb",
    "past": "said",
    "pastParticiple": "said",
    "ing": "saying"
  },
  {
    "lemma": "tell",
    "pos": "verb",
    "past": "told",
    "pastParticiple": "told",
    "ing": "telling"
  },
  {
    "lemma": "speak",
    "pos": "verb",
    "past": "spoke",
    "pastParticiple": "spoken",
    "ing": "speaking"
  },
  {
    "lemma": "talk",
    "pos": "verb",
    "past": "talked",
    "pastParticiple": "talked",
    "ing": "talking"
  },
  {
    "lemma": "ask",
    "pos": "verb",
    "past": "asked",
    "pastParticiple": "asked",
    "ing": "asking"
  },
  {
    "lemma": "answer",
    "pos": "verb",
    "past": "answered",
    "pastParticiple": "answered",
    "ing": "answering"
  },
  {
    "lemma": "know",
    "pos": "verb",
    "past": "knew",
    "pastParticiple": "known",
    "ing": "knowing"
  },
  {
    "lemma": "think",
    "pos": "verb",
    "past": "thought",
    "pastParticiple": "thought",
    "ing": "thinking"
  },
  {
    "lemma": "understand",
    "pos": "verb",
    "past": "understood",
    "pastParticiple": "understood",
    "ing": "understanding"
  },
  {
    "lemma": "remember",
    "pos": "verb",
    "past": "remembered",
    "pastParticiple": "remembered",
    "ing": "remembering"
  },
  {
    "lemma": "forget",
    "pos": "verb",
    "past": "forgot",
    "pastParticiple": "forgotten",
    "ing": "forgetting"
  },
  {
    "lemma": "mean",
    "pos": "verb",
    "past": "meant",
    "pastParticiple": "meant",
    "ing": "meaning"
  },
  {
    "lemma": "believe",
    "pos": "verb",
    "past": "believed",
    "pastParticiple": "believed",
    "ing": "believing"
  },
  {
    "lemma": "trust",
    "pos": "verb",
    "past": "trusted",
    "pastParticiple": "trusted",
    "ing": "trusting"
  },
  {
    "lemma": "love",
    "pos": "verb",
    "past": "loved",
    "pastParticiple": "loved",
    "ing": "loving"
  },
  {
    "lemma": "like",
    "pos": "verb",
    "past": "liked",
    "pastParticiple": "liked",
    "ing": "liking"
  },
  {
    "lemma": "hate",
    "pos": "verb",
    "past": "hated",
    "pastParticiple": "hated",
    "ing": "hating"
  },
  {
    "lemma": "want",
    "pos": "verb",
    "past": "wanted",
    "pastParticiple": "wanted",
    "ing": "wanting"
  },
  {
    "lemma": "need",
    "pos": "verb",
    "past": "needed",
    "pastParticiple": "needed",
    "ing": "needing"
  },
  {
    "lemma": "hope",
    "pos": "verb",
    "past": "hoped",
    "pastParticiple": "hoped",
    "ing": "hoping"
  },
  {
    "lemma": "wish",
    "pos": "verb",
    "past": "wished",
    "pastParticiple": "wished",
    "ing": "wishing"
  },
  {
    "lemma": "feel",
    "pos": "verb",
    "past": "felt",
    "pastParticiple": "felt",
    "ing": "feeling"
  },
  {
    "lemma": "care",
    "pos": "verb",
    "past": "cared",
    "pastParticiple": "cared",
    "ing": "caring"
  },
  {
    "lemma": "worry",
    "pos": "verb",
    "past": "worried",
    "pastParticiple": "worried",
    "ing": "worrying"
  },
  {
    "lemma": "fear",
    "pos": "verb",
    "past": "feared",
    "pastParticiple": "feared",
    "ing": "fearing"
  },
  {
    "lemma": "hurt",
    "pos": "verb",
    "past": "hurt",
    "pastParticiple": "hurt",
    "ing": "hurting"
  },
  {
    "lemma": "miss",
    "pos": "verb",
    "past": "missed",
    "pastParticiple": "missed",
    "ing": "missing"
  },
  {
    "lemma": "forgive",
    "pos": "verb",
    "past": "forgave",
    "pastParticiple": "forgiven",
    "ing": "forgiving"
  },
  {
    "lemma": "apologize",
    "pos": "verb",
    "past": "apologized",
    "pastParticiple": "apologized",
    "ing": "apologizing"
  },
  {
    "lemma": "betray",
    "pos": "verb",
    "past": "betrayed",
    "pastParticiple": "betrayed",
    "ing": "betraying"
  },
  {
    "lemma": "leave",
    "pos": "verb",
    "past": "left",
    "pastParticiple": "left",
    "ing": "leaving"
  },
  {
    "lemma": "stay",
    "pos": "verb",
    "past": "stayed",
    "pastParticiple": "stayed",
    "ing": "staying"
  },
  {
    "lemma": "come",
    "pos": "verb",
    "past": "came",
    "pastParticiple": "come",
    "ing": "coming"
  },
  {
    "lemma": "go",
    "pos": "verb",
    "past": "went",
    "pastParticiple": "gone",
    "ing": "going"
  },
  {
    "lemma": "return",
    "pos": "verb",
    "past": "returned",
    "pastParticiple": "returned",
    "ing": "returning"
  },
  {
    "lemma": "wait",
    "pos": "verb",
    "past": "waited",
    "pastParticiple": "waited",
    "ing": "waiting"
  },
  {
    "lemma": "follow",
    "pos": "verb",
    "past": "followed",
    "pastParticiple": "followed",
    "ing": "following"
  },
  {
    "lemma": "stop",
    "pos": "verb",
    "past": "stopped",
    "pastParticiple": "stopped",
    "ing": "stopping"
  },
  {
    "lemma": "start",
    "pos": "verb",
    "past": "started",
    "pastParticiple": "started",
    "ing": "starting"
  },
  {
    "lemma": "continue",
    "pos": "verb",
    "past": "continued",
    "pastParticiple": "continued",
    "ing": "continuing"
  },
  {
    "lemma": "try",
    "pos": "verb",
    "past": "tried",
    "pastParticiple": "tried",
    "ing": "trying"
  },
  {
    "lemma": "choose",
    "pos": "verb",
    "past": "chose",
    "pastParticiple": "chosen",
    "ing": "choosing"
  },
  {
    "lemma": "decide",
    "pos": "verb",
    "past": "decided",
    "pastParticiple": "decided",
    "ing": "deciding"
  },
  {
    "lemma": "agree",
    "pos": "verb",
    "past": "agreed",
    "pastParticiple": "agreed",
    "ing": "agreeing"
  },
  {
    "lemma": "refuse",
    "pos": "verb",
    "past": "refused",
    "pastParticiple": "refused",
    "ing": "refusing"
  },
  {
    "lemma": "accept",
    "pos": "verb",
    "past": "accepted",
    "pastParticiple": "accepted",
    "ing": "accepting"
  },
  {
    "lemma": "promise",
    "pos": "verb",
    "past": "promised",
    "pastParticiple": "promised",
    "ing": "promising"
  },
  {
    "lemma": "give",
    "pos": "verb",
    "past": "gave",
    "pastParticiple": "given",
    "ing": "giving"
  },
  {
    "lemma": "take",
    "pos": "verb",
    "past": "took",
    "pastParticiple": "taken",
    "ing": "taking"
  },
  {
    "lemma": "bring",
    "pos": "verb",
    "past": "brought",
    "pastParticiple": "brought",
    "ing": "bringing"
  },
  {
    "lemma": "get",
    "pos": "verb",
    "past": "got",
    "pastParticiple": "gotten",
    "ing": "getting"
  },
  {
    "lemma": "keep",
    "pos": "verb",
    "past": "kept",
    "pastParticiple": "kept",
    "ing": "keeping"
  },
  {
    "lemma": "put",
    "pos": "verb",
    "past": "put",
    "pastParticiple": "put",
    "ing": "putting"
  },
  {
    "lemma": "make",
    "pos": "verb",
    "past": "made",
    "pastParticiple": "made",
    "ing": "making"
  },
  {
    "lemma": "use",
    "pos": "verb",
    "past": "used",
    "pastParticiple": "used",
    "ing": "using"
  },
  {
    "lemma": "find",
    "pos": "verb",
    "past": "found",
    "pastParticiple": "found",
    "ing": "finding"
  },
  {
    "lemma": "lose",
    "pos": "verb",
    "past": "lost",
    "pastParticiple": "lost",
    "ing": "losing"
  },
  {
    "lemma": "show",
    "pos": "verb",
    "past": "showed",
    "pastParticiple": "shown",
    "ing": "showing"
  },
  {
    "lemma": "look",
    "pos": "verb",
    "past": "looked",
    "pastParticiple": "looked",
    "ing": "looking"
  },
  {
    "lemma": "see",
    "pos": "verb",
    "past": "saw",
    "pastParticiple": "seen",
    "ing": "seeing"
  },
  {
    "lemma": "watch",
    "pos": "verb",
    "past": "watched",
    "pastParticiple": "watched",
    "ing": "watching"
  },
  {
    "lemma": "hear",
    "pos": "verb",
    "past": "heard",
    "pastParticiple": "heard",
    "ing": "hearing"
  },
  {
    "lemma": "listen",
    "pos": "verb",
    "past": "listened",
    "pastParticiple": "listened",
    "ing": "listening"
  },
  {
    "lemma": "touch",
    "pos": "verb",
    "past": "touched",
    "pastParticiple": "touched",
    "ing": "touching"
  },
  {
    "lemma": "hold",
    "pos": "verb",
    "past": "held",
    "pastParticiple": "held",
    "ing": "holding"
  },
  {
    "lemma": "hug",
    "pos": "verb",
    "past": "hugged",
    "pastParticiple": "hugged",
    "ing": "hugging"
  },
  {
    "lemma": "kiss",
    "pos": "verb",
    "past": "kissed",
    "pastParticiple": "kissed",
    "ing": "kissing"
  },
  {
    "lemma": "smile",
    "pos": "verb",
    "past": "smiled",
    "pastParticiple": "smiled",
    "ing": "smiling"
  },
  {
    "lemma": "laugh",
    "pos": "verb",
    "past": "laughed",
    "pastParticiple": "laughed",
    "ing": "laughing"
  },
  {
    "lemma": "cry",
    "pos": "verb",
    "past": "cried",
    "pastParticiple": "cried",
    "ing": "crying"
  },
  {
    "lemma": "sleep",
    "pos": "verb",
    "past": "slept",
    "pastParticiple": "slept",
    "ing": "sleeping"
  },
  {
    "lemma": "wake",
    "pos": "verb",
    "past": "woke",
    "pastParticiple": "woken",
    "ing": "waking"
  },
  {
    "lemma": "rest",
    "pos": "verb",
    "past": "rested",
    "pastParticiple": "rested",
    "ing": "resting"
  },
  {
    "lemma": "eat",
    "pos": "verb",
    "past": "ate",
    "pastParticiple": "eaten",
    "ing": "eating"
  },
  {
    "lemma": "drink",
    "pos": "verb",
    "past": "drank",
    "pastParticiple": "drunk",
    "ing": "drinking"
  },
  {
    "lemma": "cook",
    "pos": "verb",
    "past": "cooked",
    "pastParticiple": "cooked",
    "ing": "cooking"
  },
  {
    "lemma": "buy",
    "pos": "verb",
    "past": "bought",
    "pastParticiple": "bought",
    "ing": "buying"
  },
  {
    "lemma": "pay",
    "pos": "verb",
    "past": "paid",
    "pastParticiple": "paid",
    "ing": "paying"
  },
  {
    "lemma": "work",
    "pos": "verb",
    "past": "worked",
    "pastParticiple": "worked",
    "ing": "working"
  },
  {
    "lemma": "help",
    "pos": "verb",
    "past": "helped",
    "pastParticiple": "helped",
    "ing": "helping"
  },
  {
    "lemma": "live",
    "pos": "verb",
    "past": "lived",
    "pastParticiple": "lived",
    "ing": "living"
  },
  {
    "lemma": "die",
    "pos": "verb",
    "past": "died",
    "pastParticiple": "died",
    "ing": "dying"
  },
  {
    "lemma": "walk",
    "pos": "verb",
    "past": "walked",
    "pastParticiple": "walked",
    "ing": "walking"
  },
  {
    "lemma": "run",
    "pos": "verb",
    "past": "ran",
    "pastParticiple": "run",
    "ing": "running"
  },
  {
    "lemma": "sit",
    "pos": "verb",
    "past": "sat",
    "pastParticiple": "sat",
    "ing": "sitting"
  },
  {
    "lemma": "stand",
    "pos": "verb",
    "past": "stood",
    "pastParticiple": "stood",
    "ing": "standing"
  },
  {
    "lemma": "open",
    "pos": "verb",
    "past": "opened",
    "pastParticiple": "opened",
    "ing": "opening"
  },
  {
    "lemma": "close",
    "pos": "verb",
    "past": "closed",
    "pastParticiple": "closed",
    "ing": "closing"
  },
  {
    "lemma": "move",
    "pos": "verb",
    "past": "moved",
    "pastParticiple": "moved",
    "ing": "moving"
  },
  {
    "lemma": "meet",
    "pos": "verb",
    "past": "met",
    "pastParticiple": "met",
    "ing": "meeting"
  },
  {
    "lemma": "call",
    "pos": "verb",
    "past": "called",
    "pastParticiple": "called",
    "ing": "calling"
  },
  {
    "lemma": "send",
    "pos": "verb",
    "past": "sent",
    "pastParticiple": "sent",
    "ing": "sending"
  },
  {
    "lemma": "read",
    "pos": "verb",
    "past": "read",
    "pastParticiple": "read",
    "ing": "reading"
  },
  {
    "lemma": "write",
    "pos": "verb",
    "past": "wrote",
    "pastParticiple": "written",
    "ing": "writing"
  },
  {
    "lemma": "change",
    "pos": "verb",
    "past": "changed",
    "pastParticiple": "changed",
    "ing": "changing"
  },
  {
    "lemma": "happen",
    "pos": "verb",
    "past": "happened",
    "pastParticiple": "happened",
    "ing": "happening"
  },
  {
    "lemma": "matter",
    "pos": "verb",
    "past": "mattered",
    "pastParticiple": "mattered",
    "ing": "mattering"
  }
]);
})();
