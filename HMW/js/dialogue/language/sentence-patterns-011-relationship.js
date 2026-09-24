(() => {
  "use strict";
  window.HMW=window.HMW||{};
  HMW.Dialogue=HMW.Dialogue||{};
  HMW.Dialogue.SENTENCE_PATTERNS=Object.assign(
    HMW.Dialogue.SENTENCE_PATTERNS||{},
    {
      ANSWER_RELATIONSHIP_STATUS:{
        tokens:["We are","{RELATIONSHIP}"],
        slots:["RELATIONSHIP"]
      },
      ANSWER_FEELINGS_TOWARD_HEROINE:{
        tokens:["I feel","{FEELINGS}","about you"],
        slots:["FEELINGS"]
      }
    }
  );
})();