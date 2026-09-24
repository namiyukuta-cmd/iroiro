(() => {
  "use strict";

  window.HMW = window.HMW || {};
  HMW.Dialogue = HMW.Dialogue || {};

  const clamp = (value, min = 0, max = 100) => {
    const n = Number(value);
    if (!Number.isFinite(n)) return min;
    return Math.max(min, Math.min(max, n));
  };

  HMW.Dialogue.normalizeInputAnalysis = function normalizeInputAnalysis(raw = {}) {
    const emotions = {};
    for (const [key, value] of Object.entries(raw.emotions || {})) {
      emotions[key] = clamp(value);
    }

    return {
      rawText: String(raw.rawText || ""),
      emotions,
      intents: Array.isArray(raw.intents) ? [...new Set(raw.intents.map(String))] : [],
      focusConcepts: Array.isArray(raw.focusConcepts) ? [...new Set(raw.focusConcepts.map(String))] : [],
      lexicalTargets: Array.isArray(raw.lexicalTargets) ? [...new Set(raw.lexicalTargets.map(String))] : [],
      boundaries: raw.boundaries && typeof raw.boundaries === "object" ? { ...raw.boundaries } : {},
      claims: raw.claims && typeof raw.claims === "object" ? { ...raw.claims } : {},
      references: Array.isArray(raw.references) ? [...raw.references] : []
    };
  };
})();
