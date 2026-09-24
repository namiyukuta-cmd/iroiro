(() => {
  "use strict";
  window.HMW = window.HMW || {};
  HMW.Dialogue = HMW.Dialogue || {};

  const store = HMW.Dialogue.Vocabulary || {
    byLemma: {},
    byKey: {},
    entries: []
  };

  store.register = function register(entries = []) {
    for (const entry of entries) {
      if (!entry || !entry.lemma) continue;

      const lemma = String(entry.lemma).toLowerCase();
      const pos = String(entry.pos || "unknown");
      const key = lemma + ":" + pos;
      const normalized = { ...entry, lemma, pos };

      this.byKey[key] = normalized;

      const index = this.entries.findIndex(item =>
        item.lemma === lemma && item.pos === pos
      );

      if (index >= 0) this.entries[index] = normalized;
      else this.entries.push(normalized);

      this.byLemma[lemma] = this.entries.filter(item => item.lemma === lemma);
    }
  };

  store.get = function get(lemma, pos = null) {
    const normalizedLemma = String(lemma || "").toLowerCase();
    if (pos) {
      return this.byKey[normalizedLemma + ":" + String(pos)] || null;
    }
    return (this.byLemma[normalizedLemma] || [])[0] || null;
  };

  store.getAll = function getAll(lemma) {
    return [...(this.byLemma[String(lemma || "").toLowerCase()] || [])];
  };

  store.has = function has(lemma, pos = null) {
    return !!this.get(lemma, pos);
  };

  HMW.Dialogue.Vocabulary = store;
})();
