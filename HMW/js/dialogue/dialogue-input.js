(() => {
  "use strict";

  window.HMW = window.HMW || {};
  HMW.Dialogue = HMW.Dialogue || {};

  const clamp = (value, min = 0, max = 100) => {
    const n = Number(value);
    if (!Number.isFinite(n)) return min;
    return Math.max(min, Math.min(max, n));
  };

  const uniqueStrings = value =>
    Array.isArray(value)
      ? [...new Set(value.map(String).map(v => v.trim()).filter(Boolean))]
      : [];

  const normalizeBoundaries = value => {
    if (Array.isArray(value)) return uniqueStrings(value);
    if (!value || typeof value !== "object") return [];
    return Object.entries(value)
      .filter(([, active]) => !!active)
      .map(([key]) => String(key));
  };

  const normalizeClaims = value => {
    if (Array.isArray(value)) {
      return value
        .filter(item => item && typeof item === "object")
        .map(item => ({
          concept: String(item.concept || ""),
          type: String(item.type || "speaker_belief"),
          polarity: item.polarity === false ? false : true,
          certainty: String(item.certainty || "medium"),
          text: String(item.text || "")
        }));
    }

    if (value && typeof value === "object") {
      return Object.entries(value).map(([concept, raw]) => {
        if (raw && typeof raw === "object") {
          return {
            concept: String(concept),
            type: String(raw.type || "speaker_belief"),
            polarity: raw.polarity === false ? false : true,
            certainty: String(raw.certainty || "medium"),
            text: String(raw.text || "")
          };
        }
        return {
          concept: String(concept),
          type: "speaker_belief",
          polarity: !!raw,
          certainty: "medium",
          text: ""
        };
      });
    }

    return [];
  };

  const normalizeQuestions = value => {
    if (!Array.isArray(value)) return [];
    return value
      .filter(item => item && typeof item === "object")
      .map(item => ({
        kind: String(item.kind || "generic"),
        concept: String(item.concept || ""),
        target: String(item.target || ""),
        action: String(item.action || ""),
        requestedField: String(item.requestedField || ""),
        text: String(item.text || "")
      }));
  };

  HMW.Dialogue.normalizeInputAnalysis = function normalizeInputAnalysis(raw = {}) {
    const emotions = {};
    for (const [key, value] of Object.entries(raw.emotions || {})) {
      emotions[String(key)] = clamp(value);
    }

    return {
      rawText: String(raw.rawText || ""),
      emotions,
      intents: uniqueStrings(raw.intents),
      focusConcepts: uniqueStrings(raw.focusConcepts),
      lexicalTargets: uniqueStrings(raw.lexicalTargets),
      boundaries: normalizeBoundaries(raw.boundaries),
      claims: normalizeClaims(raw.claims),
      questions: normalizeQuestions(raw.questions),
      references: Array.isArray(raw.references) ? [...raw.references] : [],
      tone: raw.tone && typeof raw.tone === "object" ? { ...raw.tone } : {},
      analysisVersion: Number(raw.analysisVersion) || 1
    };
  };
})();
