(() => {
  "use strict";
  window.HMW = window.HMW || {};
  HMW.Dialogue = HMW.Dialogue || {};

  const store = HMW.Dialogue.Phrases || {
    byId: {},
    entries: []
  };

  store.register = function register(entries = []) {
    for (const entry of entries) {
      if (!entry || !entry.id || !entry.text) continue;
      const normalized = {
        tags: [],
        slots: [],
        ...entry,
        id: String(entry.id),
        text: String(entry.text)
      };
      this.byId[normalized.id] = normalized;
      const i = this.entries.findIndex(item => item.id === normalized.id);
      if (i >= 0) this.entries[i] = normalized;
      else this.entries.push(normalized);
    }
  };

  store.get = function get(id) {
    return this.byId[String(id || "")] || null;
  };

  store.findByTag = function findByTag(tag) {
    const t = String(tag || "");
    return this.entries.filter(item => Array.isArray(item.tags) && item.tags.includes(t));
  };

  HMW.Dialogue.Phrases = store;
})();
