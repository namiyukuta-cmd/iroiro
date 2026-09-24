(() => {
  "use strict";
  const V = window.HMW?.Dialogue?.Vocabulary;
  if (!V) throw new Error("Vocabulary registry must load first.");
  V.register([
  {
    "lemma": "good",
    "pos": "adjective"
  },
  {
    "lemma": "bad",
    "pos": "adjective"
  },
  {
    "lemma": "right",
    "pos": "adjective"
  },
  {
    "lemma": "wrong",
    "pos": "adjective"
  },
  {
    "lemma": "happy",
    "pos": "adjective"
  },
  {
    "lemma": "sad",
    "pos": "adjective"
  },
  {
    "lemma": "angry",
    "pos": "adjective"
  },
  {
    "lemma": "afraid",
    "pos": "adjective"
  },
  {
    "lemma": "scared",
    "pos": "adjective"
  },
  {
    "lemma": "worried",
    "pos": "adjective"
  },
  {
    "lemma": "calm",
    "pos": "adjective"
  },
  {
    "lemma": "tired",
    "pos": "adjective"
  },
  {
    "lemma": "sleepy",
    "pos": "adjective"
  },
  {
    "lemma": "hungry",
    "pos": "adjective"
  },
  {
    "lemma": "thirsty",
    "pos": "adjective"
  },
  {
    "lemma": "cold",
    "pos": "adjective"
  },
  {
    "lemma": "warm",
    "pos": "adjective"
  },
  {
    "lemma": "hot",
    "pos": "adjective"
  },
  {
    "lemma": "safe",
    "pos": "adjective"
  },
  {
    "lemma": "dangerous",
    "pos": "adjective"
  },
  {
    "lemma": "kind",
    "pos": "adjective"
  },
  {
    "lemma": "nice",
    "pos": "adjective"
  },
  {
    "lemma": "mean",
    "pos": "adjective"
  },
  {
    "lemma": "honest",
    "pos": "adjective"
  },
  {
    "lemma": "serious",
    "pos": "adjective"
  },
  {
    "lemma": "ready",
    "pos": "adjective"
  },
  {
    "lemma": "sure",
    "pos": "adjective"
  },
  {
    "lemma": "certain",
    "pos": "adjective"
  },
  {
    "lemma": "possible",
    "pos": "adjective"
  },
  {
    "lemma": "impossible",
    "pos": "adjective"
  },
  {
    "lemma": "easy",
    "pos": "adjective"
  },
  {
    "lemma": "hard",
    "pos": "adjective"
  },
  {
    "lemma": "difficult",
    "pos": "adjective"
  },
  {
    "lemma": "simple",
    "pos": "adjective"
  },
  {
    "lemma": "important",
    "pos": "adjective"
  },
  {
    "lemma": "special",
    "pos": "adjective"
  },
  {
    "lemma": "different",
    "pos": "adjective"
  },
  {
    "lemma": "same",
    "pos": "adjective"
  },
  {
    "lemma": "alone",
    "pos": "adjective"
  },
  {
    "lemma": "together",
    "pos": "adjective"
  },
  {
    "lemma": "close",
    "pos": "adjective"
  },
  {
    "lemma": "far",
    "pos": "adjective"
  },
  {
    "lemma": "near",
    "pos": "adjective"
  },
  {
    "lemma": "early",
    "pos": "adjective"
  },
  {
    "lemma": "late",
    "pos": "adjective"
  },
  {
    "lemma": "busy",
    "pos": "adjective"
  },
  {
    "lemma": "free",
    "pos": "adjective"
  },
  {
    "lemma": "quiet",
    "pos": "adjective"
  },
  {
    "lemma": "loud",
    "pos": "adjective"
  },
  {
    "lemma": "young",
    "pos": "adjective"
  },
  {
    "lemma": "old",
    "pos": "adjective"
  },
  {
    "lemma": "new",
    "pos": "adjective"
  },
  {
    "lemma": "small",
    "pos": "adjective"
  },
  {
    "lemma": "big",
    "pos": "adjective"
  },
  {
    "lemma": "long",
    "pos": "adjective"
  },
  {
    "lemma": "short",
    "pos": "adjective"
  },
  {
    "lemma": "strong",
    "pos": "adjective"
  },
  {
    "lemma": "weak",
    "pos": "adjective"
  },
  {
    "lemma": "sick",
    "pos": "adjective"
  },
  {
    "lemma": "fine",
    "pos": "adjective"
  },
  {
    "lemma": "okay",
    "pos": "adjective"
  },
  {
    "lemma": "beautiful",
    "pos": "adjective"
  },
  {
    "lemma": "pretty",
    "pos": "adjective"
  },
  {
    "lemma": "handsome",
    "pos": "adjective"
  },
  {
    "lemma": "strange",
    "pos": "adjective"
  },
  {
    "lemma": "weird",
    "pos": "adjective"
  },
  {
    "lemma": "real",
    "pos": "adjective"
  },
  {
    "lemma": "true",
    "pos": "adjective"
  },
  {
    "lemma": "false",
    "pos": "adjective"
  },
  {
    "lemma": "sorry",
    "pos": "adjective"
  },
  {
    "lemma": "glad",
    "pos": "adjective"
  },
  {
    "lemma": "lonely",
    "pos": "adjective"
  },
  {
    "lemma": "jealous",
    "pos": "adjective"
  },
  {
    "lemma": "gentle",
    "pos": "adjective"
  },
  {
    "lemma": "careful",
    "pos": "adjective"
  },
  {
    "lemma": "open",
    "pos": "adjective"
  },
  {
    "lemma": "closed",
    "pos": "adjective"
  },
  {
    "lemma": "empty",
    "pos": "adjective"
  },
  {
    "lemma": "full",
    "pos": "adjective"
  },
  {
    "lemma": "clean",
    "pos": "adjective"
  },
  {
    "lemma": "dirty",
    "pos": "adjective"
  },
  {
    "lemma": "wet",
    "pos": "adjective"
  },
  {
    "lemma": "dry",
    "pos": "adjective"
  },
  {
    "lemma": "poor",
    "pos": "adjective"
  },
  {
    "lemma": "rich",
    "pos": "adjective"
  },
  {
    "lemma": "enough",
    "pos": "adjective"
  },
  {
    "lemma": "more",
    "pos": "adjective"
  },
  {
    "lemma": "less",
    "pos": "adjective"
  },
  {
    "lemma": "very",
    "pos": "adverb"
  },
  {
    "lemma": "really",
    "pos": "adverb"
  },
  {
    "lemma": "quite",
    "pos": "adverb"
  },
  {
    "lemma": "too",
    "pos": "adverb"
  },
  {
    "lemma": "also",
    "pos": "adverb"
  },
  {
    "lemma": "still",
    "pos": "adverb"
  },
  {
    "lemma": "already",
    "pos": "adverb"
  },
  {
    "lemma": "again",
    "pos": "adverb"
  },
  {
    "lemma": "always",
    "pos": "adverb"
  },
  {
    "lemma": "never",
    "pos": "adverb"
  },
  {
    "lemma": "often",
    "pos": "adverb"
  },
  {
    "lemma": "sometimes",
    "pos": "adverb"
  },
  {
    "lemma": "usually",
    "pos": "adverb"
  },
  {
    "lemma": "maybe",
    "pos": "adverb"
  },
  {
    "lemma": "probably",
    "pos": "adverb"
  },
  {
    "lemma": "perhaps",
    "pos": "adverb"
  },
  {
    "lemma": "here",
    "pos": "adverb"
  },
  {
    "lemma": "there",
    "pos": "adverb"
  },
  {
    "lemma": "now",
    "pos": "adverb"
  },
  {
    "lemma": "then",
    "pos": "adverb"
  },
  {
    "lemma": "soon",
    "pos": "adverb"
  },
  {
    "lemma": "later",
    "pos": "adverb"
  },
  {
    "lemma": "today",
    "pos": "adverb"
  },
  {
    "lemma": "tomorrow",
    "pos": "adverb"
  },
  {
    "lemma": "yesterday",
    "pos": "adverb"
  },
  {
    "lemma": "together",
    "pos": "adverb"
  },
  {
    "lemma": "alone",
    "pos": "adverb"
  },
  {
    "lemma": "away",
    "pos": "adverb"
  },
  {
    "lemma": "back",
    "pos": "adverb"
  },
  {
    "lemma": "inside",
    "pos": "adverb"
  },
  {
    "lemma": "outside",
    "pos": "adverb"
  },
  {
    "lemma": "well",
    "pos": "adverb"
  },
  {
    "lemma": "badly",
    "pos": "adverb"
  },
  {
    "lemma": "slowly",
    "pos": "adverb"
  },
  {
    "lemma": "quickly",
    "pos": "adverb"
  },
  {
    "lemma": "carefully",
    "pos": "adverb"
  },
  {
    "lemma": "honestly",
    "pos": "adverb"
  },
  {
    "lemma": "almost",
    "pos": "adverb"
  },
  {
    "lemma": "just",
    "pos": "adverb"
  },
  {
    "lemma": "only",
    "pos": "adverb"
  },
  {
    "lemma": "even",
    "pos": "adverb"
  }
]);
})();
