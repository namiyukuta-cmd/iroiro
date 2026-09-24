(() => {
  "use strict";
  const V = window.HMW?.Dialogue?.Vocabulary;
  if (!V) throw new Error("Vocabulary registry must load first.");
  V.register([
  {
    "lemma": "I",
    "pos": "pronoun"
  },
  {
    "lemma": "you",
    "pos": "pronoun"
  },
  {
    "lemma": "he",
    "pos": "pronoun"
  },
  {
    "lemma": "she",
    "pos": "pronoun"
  },
  {
    "lemma": "we",
    "pos": "pronoun"
  },
  {
    "lemma": "they",
    "pos": "pronoun"
  },
  {
    "lemma": "me",
    "pos": "pronoun"
  },
  {
    "lemma": "him",
    "pos": "pronoun"
  },
  {
    "lemma": "her",
    "pos": "pronoun"
  },
  {
    "lemma": "us",
    "pos": "pronoun"
  },
  {
    "lemma": "them",
    "pos": "pronoun"
  },
  {
    "lemma": "my",
    "pos": "determiner"
  },
  {
    "lemma": "your",
    "pos": "determiner"
  },
  {
    "lemma": "his",
    "pos": "determiner"
  },
  {
    "lemma": "our",
    "pos": "determiner"
  },
  {
    "lemma": "their",
    "pos": "determiner"
  },
  {
    "lemma": "mine",
    "pos": "pronoun"
  },
  {
    "lemma": "yours",
    "pos": "pronoun"
  },
  {
    "lemma": "hers",
    "pos": "pronoun"
  },
  {
    "lemma": "ours",
    "pos": "pronoun"
  },
  {
    "lemma": "theirs",
    "pos": "pronoun"
  },
  {
    "lemma": "this",
    "pos": "determiner"
  },
  {
    "lemma": "that",
    "pos": "determiner"
  },
  {
    "lemma": "these",
    "pos": "determiner"
  },
  {
    "lemma": "those",
    "pos": "determiner"
  },
  {
    "lemma": "a",
    "pos": "article"
  },
  {
    "lemma": "an",
    "pos": "article"
  },
  {
    "lemma": "the",
    "pos": "article"
  },
  {
    "lemma": "some",
    "pos": "determiner"
  },
  {
    "lemma": "any",
    "pos": "determiner"
  },
  {
    "lemma": "no",
    "pos": "determiner"
  },
  {
    "lemma": "all",
    "pos": "determiner"
  },
  {
    "lemma": "each",
    "pos": "determiner"
  },
  {
    "lemma": "every",
    "pos": "determiner"
  },
  {
    "lemma": "both",
    "pos": "determiner"
  },
  {
    "lemma": "another",
    "pos": "determiner"
  },
  {
    "lemma": "and",
    "pos": "conjunction"
  },
  {
    "lemma": "but",
    "pos": "conjunction"
  },
  {
    "lemma": "or",
    "pos": "conjunction"
  },
  {
    "lemma": "so",
    "pos": "conjunction"
  },
  {
    "lemma": "because",
    "pos": "conjunction"
  },
  {
    "lemma": "if",
    "pos": "conjunction"
  },
  {
    "lemma": "when",
    "pos": "conjunction"
  },
  {
    "lemma": "while",
    "pos": "conjunction"
  },
  {
    "lemma": "though",
    "pos": "conjunction"
  },
  {
    "lemma": "although",
    "pos": "conjunction"
  },
  {
    "lemma": "before",
    "pos": "conjunction"
  },
  {
    "lemma": "after",
    "pos": "conjunction"
  },
  {
    "lemma": "until",
    "pos": "conjunction"
  },
  {
    "lemma": "unless",
    "pos": "conjunction"
  },
  {
    "lemma": "in",
    "pos": "preposition"
  },
  {
    "lemma": "on",
    "pos": "preposition"
  },
  {
    "lemma": "at",
    "pos": "preposition"
  },
  {
    "lemma": "to",
    "pos": "preposition"
  },
  {
    "lemma": "from",
    "pos": "preposition"
  },
  {
    "lemma": "for",
    "pos": "preposition"
  },
  {
    "lemma": "with",
    "pos": "preposition"
  },
  {
    "lemma": "without",
    "pos": "preposition"
  },
  {
    "lemma": "about",
    "pos": "preposition"
  },
  {
    "lemma": "of",
    "pos": "preposition"
  },
  {
    "lemma": "by",
    "pos": "preposition"
  },
  {
    "lemma": "near",
    "pos": "preposition"
  },
  {
    "lemma": "under",
    "pos": "preposition"
  },
  {
    "lemma": "over",
    "pos": "preposition"
  },
  {
    "lemma": "between",
    "pos": "preposition"
  },
  {
    "lemma": "through",
    "pos": "preposition"
  },
  {
    "lemma": "around",
    "pos": "preposition"
  },
  {
    "lemma": "into",
    "pos": "preposition"
  },
  {
    "lemma": "out",
    "pos": "preposition"
  },
  {
    "lemma": "up",
    "pos": "particle"
  },
  {
    "lemma": "down",
    "pos": "particle"
  },
  {
    "lemma": "back",
    "pos": "particle"
  },
  {
    "lemma": "away",
    "pos": "particle"
  },
  {
    "lemma": "not",
    "pos": "adverb"
  },
  {
    "lemma": "yes",
    "pos": "interjection"
  },
  {
    "lemma": "no",
    "pos": "interjection"
  },
  {
    "lemma": "please",
    "pos": "interjection"
  },
  {
    "lemma": "thanks",
    "pos": "interjection"
  },
  {
    "lemma": "what",
    "pos": "question"
  },
  {
    "lemma": "who",
    "pos": "question"
  },
  {
    "lemma": "where",
    "pos": "question"
  },
  {
    "lemma": "when",
    "pos": "question"
  },
  {
    "lemma": "why",
    "pos": "question"
  },
  {
    "lemma": "how",
    "pos": "question"
  },
  {
    "lemma": "which",
    "pos": "question"
  },
  {
    "lemma": "whose",
    "pos": "question"
  },
  {
    "lemma": "can",
    "pos": "modal"
  },
  {
    "lemma": "could",
    "pos": "modal"
  },
  {
    "lemma": "will",
    "pos": "modal"
  },
  {
    "lemma": "would",
    "pos": "modal"
  },
  {
    "lemma": "shall",
    "pos": "modal"
  },
  {
    "lemma": "should",
    "pos": "modal"
  },
  {
    "lemma": "may",
    "pos": "modal"
  },
  {
    "lemma": "might",
    "pos": "modal"
  },
  {
    "lemma": "must",
    "pos": "modal"
  }
]);
})();
