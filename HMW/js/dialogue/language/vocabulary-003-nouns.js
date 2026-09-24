(() => {
  "use strict";
  const V = window.HMW?.Dialogue?.Vocabulary;
  if (!V) throw new Error("Vocabulary registry must load first.");
  V.register([
  {
    "lemma": "person",
    "pos": "noun"
  },
  {
    "lemma": "people",
    "pos": "noun"
  },
  {
    "lemma": "man",
    "pos": "noun"
  },
  {
    "lemma": "woman",
    "pos": "noun"
  },
  {
    "lemma": "friend",
    "pos": "noun"
  },
  {
    "lemma": "stranger",
    "pos": "noun"
  },
  {
    "lemma": "family",
    "pos": "noun"
  },
  {
    "lemma": "mother",
    "pos": "noun"
  },
  {
    "lemma": "father",
    "pos": "noun"
  },
  {
    "lemma": "parent",
    "pos": "noun"
  },
  {
    "lemma": "child",
    "pos": "noun"
  },
  {
    "lemma": "boy",
    "pos": "noun"
  },
  {
    "lemma": "girl",
    "pos": "noun"
  },
  {
    "lemma": "name",
    "pos": "noun"
  },
  {
    "lemma": "word",
    "pos": "noun"
  },
  {
    "lemma": "voice",
    "pos": "noun"
  },
  {
    "lemma": "question",
    "pos": "noun"
  },
  {
    "lemma": "answer",
    "pos": "noun"
  },
  {
    "lemma": "truth",
    "pos": "noun"
  },
  {
    "lemma": "lie",
    "pos": "noun"
  },
  {
    "lemma": "reason",
    "pos": "noun"
  },
  {
    "lemma": "idea",
    "pos": "noun"
  },
  {
    "lemma": "thought",
    "pos": "noun"
  },
  {
    "lemma": "feeling",
    "pos": "noun"
  },
  {
    "lemma": "emotion",
    "pos": "noun"
  },
  {
    "lemma": "fear",
    "pos": "noun"
  },
  {
    "lemma": "anger",
    "pos": "noun"
  },
  {
    "lemma": "pain",
    "pos": "noun"
  },
  {
    "lemma": "hurt",
    "pos": "noun"
  },
  {
    "lemma": "love",
    "pos": "noun"
  },
  {
    "lemma": "trust",
    "pos": "noun"
  },
  {
    "lemma": "hope",
    "pos": "noun"
  },
  {
    "lemma": "worry",
    "pos": "noun"
  },
  {
    "lemma": "problem",
    "pos": "noun"
  },
  {
    "lemma": "mistake",
    "pos": "noun"
  },
  {
    "lemma": "choice",
    "pos": "noun"
  },
  {
    "lemma": "promise",
    "pos": "noun"
  },
  {
    "lemma": "secret",
    "pos": "noun"
  },
  {
    "lemma": "memory",
    "pos": "noun"
  },
  {
    "lemma": "dream",
    "pos": "noun"
  },
  {
    "lemma": "life",
    "pos": "noun"
  },
  {
    "lemma": "death",
    "pos": "noun"
  },
  {
    "lemma": "day",
    "pos": "noun"
  },
  {
    "lemma": "night",
    "pos": "noun"
  },
  {
    "lemma": "morning",
    "pos": "noun"
  },
  {
    "lemma": "afternoon",
    "pos": "noun"
  },
  {
    "lemma": "evening",
    "pos": "noun"
  },
  {
    "lemma": "today",
    "pos": "noun"
  },
  {
    "lemma": "tomorrow",
    "pos": "noun"
  },
  {
    "lemma": "yesterday",
    "pos": "noun"
  },
  {
    "lemma": "time",
    "pos": "noun"
  },
  {
    "lemma": "hour",
    "pos": "noun"
  },
  {
    "lemma": "minute",
    "pos": "noun"
  },
  {
    "lemma": "week",
    "pos": "noun"
  },
  {
    "lemma": "month",
    "pos": "noun"
  },
  {
    "lemma": "year",
    "pos": "noun"
  },
  {
    "lemma": "moment",
    "pos": "noun"
  },
  {
    "lemma": "place",
    "pos": "noun"
  },
  {
    "lemma": "home",
    "pos": "noun"
  },
  {
    "lemma": "house",
    "pos": "noun"
  },
  {
    "lemma": "room",
    "pos": "noun"
  },
  {
    "lemma": "door",
    "pos": "noun"
  },
  {
    "lemma": "street",
    "pos": "noun"
  },
  {
    "lemma": "road",
    "pos": "noun"
  },
  {
    "lemma": "station",
    "pos": "noun"
  },
  {
    "lemma": "park",
    "pos": "noun"
  },
  {
    "lemma": "shop",
    "pos": "noun"
  },
  {
    "lemma": "store",
    "pos": "noun"
  },
  {
    "lemma": "work",
    "pos": "noun"
  },
  {
    "lemma": "job",
    "pos": "noun"
  },
  {
    "lemma": "money",
    "pos": "noun"
  },
  {
    "lemma": "price",
    "pos": "noun"
  },
  {
    "lemma": "food",
    "pos": "noun"
  },
  {
    "lemma": "water",
    "pos": "noun"
  },
  {
    "lemma": "bread",
    "pos": "noun"
  },
  {
    "lemma": "meal",
    "pos": "noun"
  },
  {
    "lemma": "drink",
    "pos": "noun"
  },
  {
    "lemma": "bed",
    "pos": "noun"
  },
  {
    "lemma": "clothes",
    "pos": "noun"
  },
  {
    "lemma": "coat",
    "pos": "noun"
  },
  {
    "lemma": "shoe",
    "pos": "noun"
  },
  {
    "lemma": "bag",
    "pos": "noun"
  },
  {
    "lemma": "phone",
    "pos": "noun"
  },
  {
    "lemma": "hand",
    "pos": "noun"
  },
  {
    "lemma": "arm",
    "pos": "noun"
  },
  {
    "lemma": "face",
    "pos": "noun"
  },
  {
    "lemma": "eye",
    "pos": "noun"
  },
  {
    "lemma": "head",
    "pos": "noun"
  },
  {
    "lemma": "hair",
    "pos": "noun"
  },
  {
    "lemma": "body",
    "pos": "noun"
  },
  {
    "lemma": "heart",
    "pos": "noun"
  },
  {
    "lemma": "smile",
    "pos": "noun"
  },
  {
    "lemma": "tear",
    "pos": "noun"
  },
  {
    "lemma": "weather",
    "pos": "noun"
  },
  {
    "lemma": "rain",
    "pos": "noun"
  },
  {
    "lemma": "wind",
    "pos": "noun"
  },
  {
    "lemma": "cold",
    "pos": "noun"
  },
  {
    "lemma": "heat",
    "pos": "noun"
  },
  {
    "lemma": "car",
    "pos": "noun"
  },
  {
    "lemma": "bus",
    "pos": "noun"
  },
  {
    "lemma": "train",
    "pos": "noun"
  },
  {
    "lemma": "walk",
    "pos": "noun"
  },
  {
    "lemma": "trip",
    "pos": "noun"
  },
  {
    "lemma": "way",
    "pos": "noun"
  },
  {
    "lemma": "side",
    "pos": "noun"
  },
  {
    "lemma": "front",
    "pos": "noun"
  },
  {
    "lemma": "back",
    "pos": "noun"
  },
  {
    "lemma": "inside",
    "pos": "noun"
  },
  {
    "lemma": "outside",
    "pos": "noun"
  },
  {
    "lemma": "city",
    "pos": "noun"
  },
  {
    "lemma": "town",
    "pos": "noun"
  },
  {
    "lemma": "country",
    "pos": "noun"
  },
  {
    "lemma": "world",
    "pos": "noun"
  },
  {
    "lemma": "thing",
    "pos": "noun"
  },
  {
    "lemma": "something",
    "pos": "noun"
  },
  {
    "lemma": "nothing",
    "pos": "noun"
  },
  {
    "lemma": "anything",
    "pos": "noun"
  },
  {
    "lemma": "everything",
    "pos": "noun"
  },
  {
    "lemma": "part",
    "pos": "noun"
  },
  {
    "lemma": "kind",
    "pos": "noun"
  },
  {
    "lemma": "sort",
    "pos": "noun"
  },
  {
    "lemma": "number",
    "pos": "noun"
  },
  {
    "lemma": "chance",
    "pos": "noun"
  },
  {
    "lemma": "plan",
    "pos": "noun"
  },
  {
    "lemma": "help",
    "pos": "noun"
  },
  {
    "lemma": "care",
    "pos": "noun"
  },
  {
    "lemma": "relationship",
    "pos": "noun"
  },
  {
    "lemma": "date",
    "pos": "noun"
  },
  {
    "lemma": "kiss",
    "pos": "noun"
  },
  {
    "lemma": "hug",
    "pos": "noun"
  },
  {
    "lemma": "touch",
    "pos": "noun"
  },
  {
    "lemma": "distance",
    "pos": "noun"
  },
  {
    "lemma": "space",
    "pos": "noun"
  },
  {
    "lemma": "betrayal",
    "pos": "noun"
  },
  {
    "lemma": "jealousy",
    "pos": "noun"
  },
  {
    "lemma": "loneliness",
    "pos": "noun"
  },
  {
    "lemma": "safety",
    "pos": "noun"
  },
  {
    "lemma": "danger",
    "pos": "noun"
  },
  {
    "lemma": "rest",
    "pos": "noun"
  },
  {
    "lemma": "sleep",
    "pos": "noun"
  },
  {
    "lemma": "hunger",
    "pos": "noun"
  },
  {
    "lemma": "workplace",
    "pos": "noun"
  },
  {
    "lemma": "boss",
    "pos": "noun"
  },
  {
    "lemma": "coworker",
    "pos": "noun"
  },
  {
    "lemma": "customer",
    "pos": "noun"
  },
  {
    "lemma": "police",
    "pos": "noun"
  },
  {
    "lemma": "doctor",
    "pos": "noun"
  },
  {
    "lemma": "hospital",
    "pos": "noun"
  },
  {
    "lemma": "school",
    "pos": "noun"
  },
  {
    "lemma": "table",
    "pos": "noun"
  },
  {
    "lemma": "chair",
    "pos": "noun"
  },
  {
    "lemma": "window",
    "pos": "noun"
  },
  {
    "lemma": "light",
    "pos": "noun"
  },
  {
    "lemma": "key",
    "pos": "noun"
  },
  {
    "lemma": "book",
    "pos": "noun"
  },
  {
    "lemma": "paper",
    "pos": "noun"
  },
  {
    "lemma": "letter",
    "pos": "noun"
  },
  {
    "lemma": "message",
    "pos": "noun"
  },
  {
    "lemma": "gift",
    "pos": "noun"
  },
  {
    "lemma": "picture",
    "pos": "noun"
  },
  {
    "lemma": "music",
    "pos": "noun"
  },
  {
    "lemma": "game",
    "pos": "noun"
  },
  {
    "lemma": "story",
    "pos": "noun"
  }
]);
})();
