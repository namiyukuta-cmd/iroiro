(() => {
  "use strict";
  window.HMW = window.HMW || {};
  HMW.Dialogue = HMW.Dialogue || {};

  const store = HMW.Dialogue.Vocabulary || {
    byLemma: {},
    entries: []
  };

  store.register = function register(entries = []) {
    for (const entry of entries) {
      if (!entry || !entry.lemma) continue;
      const lemma = String(entry.lemma).toLowerCase();
      const normalized = { ...entry, lemma };
      this.byLemma[lemma] = normalized;
      const i = this.entries.findIndex(item => item.lemma === lemma);
      if (i >= 0) this.entries[i] = normalized;
      else this.entries.push(normalized);
    }
  };

  store.get = function get(lemma) {
    return this.byLemma[String(lemma || "").toLowerCase()] || null;
  };

  store.has = function has(lemma) {
    return !!this.get(lemma);
  };

  HMW.Dialogue.Vocabulary = store;
})();
