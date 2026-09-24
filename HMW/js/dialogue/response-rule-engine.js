(() => {
  "use strict";
  window.HMW = window.HMW || {};
  HMW.Dialogue = HMW.Dialogue || {};

  const D = HMW.Dialogue;
  const rules = D.RESPONSE_RULES || [];

  const arr = value => Array.isArray(value) ? value : [];
  const hasAny = (source, wanted) => arr(wanted).some(v => arr(source).includes(v));
  const hasAll = (source, wanted) => arr(wanted).every(v => arr(source).includes(v));
  const num = value => Number.isFinite(Number(value)) ? Number(value) : 0;

  const getToneValue = (tone, key) => {
    const value = tone?.[key];
    if (typeof value === "number") return value;
    const map = {
      none:0, very_low:10, low:25, mild:30, medium:50,
      moderate:50, high:75, very_high:90, positive:75,
      neutral:50, negative:25, friendly:75, subdued:30,
      warm:80, cold:20
    };
    return map[String(value || "").toLowerCase()] ?? value;
  };

  const comparePath = (root, path, expected) => {
    const parts = String(path || "").split(".").filter(Boolean);
    let value = root;
    for (const part of parts) value = value?.[part];
    if (Array.isArray(expected)) return expected.includes(value);
    return value === expected;
  };

  const matches = (rule, ctx) => {
    const w = rule.when || {};
    const a = ctx.analysis || {};
    const questions = arr(a.questions);

    if (w.intentAny && !hasAny(a.intents, w.intentAny)) return false;
    if (w.intentAll && !hasAll(a.intents, w.intentAll)) return false;
    if (w.intentNone && hasAny(a.intents, w.intentNone)) return false;

    if (w.focusAny && !hasAny(a.focusConcepts, w.focusAny)) return false;
    if (w.focusAll && !hasAll(a.focusConcepts, w.focusAll)) return false;
    if (w.focusNone && hasAny(a.focusConcepts, w.focusNone)) return false;

    if (w.boundaryAny && !hasAny(a.boundaries, w.boundaryAny)) return false;
    if (w.boundaryAll && !hasAll(a.boundaries, w.boundaryAll)) return false;
    if (w.boundaryNone && hasAny(a.boundaries, w.boundaryNone)) return false;

    if (w.questionKindAny && !questions.some(q => arr(w.questionKindAny).includes(q?.kind))) return false;

    if (w.questionActionAny && !questions.some(q => arr(w.questionActionAny).includes(q?.action))) return false;
    if (w.questionTargetAny && !questions.some(q => arr(w.questionTargetAny).includes(q?.target))) return false;
    if (w.questionRequestedFieldAny && !questions.some(q => arr(w.questionRequestedFieldAny).includes(q?.requestedField))) return false;

    if (w.questionAny) {
      const spec = w.questionAny;
      const matched = questions.some(q => {
        if (spec.kindAny && !arr(spec.kindAny).includes(q?.kind)) return false;
        if (spec.actionAny && !arr(spec.actionAny).includes(q?.action)) return false;
        if (spec.targetAny && !arr(spec.targetAny).includes(q?.target)) return false;
        if (spec.requestedFieldAny && !arr(spec.requestedFieldAny).includes(q?.requestedField)) return false;
        if (spec.conceptAny && !arr(spec.conceptAny).includes(q?.concept)) return false;
        return true;
      });
      if (!matched) return false;
    }

    if (w.claimConceptAny) {
      const claims = arr(a.claims);
      if (!claims.some(claim => arr(w.claimConceptAny).includes(claim?.concept))) return false;
    }
    if (w.claimTypeAny) {
      const claims = arr(a.claims);
      if (!claims.some(claim => arr(w.claimTypeAny).includes(claim?.type))) return false;
    }
    if (w.claimPolarityEq !== undefined) {
      const claims = arr(a.claims);
      if (!claims.some(claim => claim?.polarity === w.claimPolarityEq)) return false;
    }

    if (w.claimAny) {
      const spec = w.claimAny;
      const claims = arr(a.claims);
      const matched = claims.some(claim => {
        if (spec.conceptAny && !arr(spec.conceptAny).includes(claim?.concept)) return false;
        if (spec.typeAny && !arr(spec.typeAny).includes(claim?.type)) return false;
        if (spec.certaintyAny && !arr(spec.certaintyAny).includes(claim?.certainty)) return false;
        if (spec.polarityEq !== undefined && claim?.polarity !== spec.polarityEq) return false;
        return true;
      });
      if (!matched) return false;
    }

    if (w.lexicalTargetAny && !hasAny(a.lexicalTargets, w.lexicalTargetAny)) return false;
    if (w.lexicalTargetAll && !hasAll(a.lexicalTargets, w.lexicalTargetAll)) return false;

    for (const [key,min] of Object.entries(w.emotionMin || {})) {
      if (num(a.emotions?.[key]) < Number(min)) return false;
    }
    for (const [key,max] of Object.entries(w.emotionMax || {})) {
      if (num(a.emotions?.[key]) > Number(max)) return false;
    }

    for (const [key,min] of Object.entries(w.toneMin || {})) {
      if (num(getToneValue(a.tone, key)) < Number(min)) return false;
    }
    for (const [key,max] of Object.entries(w.toneMax || {})) {
      if (num(getToneValue(a.tone, key)) > Number(max)) return false;
    }
    for (const [key,expected] of Object.entries(w.toneEq || {})) {
      const value = a.tone?.[key];
      if (Array.isArray(expected)) {
        if (!expected.includes(value)) return false;
      } else if (value !== expected) return false;
    }

    for (const [path,expected] of Object.entries(w.factEq || {})) {
      if (!comparePath(ctx.characterFacts || {}, path, expected)) return false;
    }
    for (const [path,expected] of Object.entries(w.policyEq || {})) {
      if (!comparePath(ctx.characterPolicy || {}, path, expected)) return false;
    }
    for (const [key,min] of Object.entries(w.psychologyMin || {})) {
      if (num(ctx.psychology?.[key]) < Number(min)) return false;
    }
    for (const [key,max] of Object.entries(w.psychologyMax || {})) {
      if (num(ctx.psychology?.[key]) > Number(max)) return false;
    }

    if (typeof rule.test === "function" && !rule.test(ctx)) return false;
    return true;
  };

  D.registerResponseRules = function registerResponseRules(entries = []) {
    for (const rule of entries) {
      if (!rule || !rule.id) continue;
      const index = rules.findIndex(x => x.id === rule.id);
      const normalized = {
        priority: 500,
        meanings: [],
        reason: rule.id,
        ...rule,
        meanings: [...new Set(arr(rule.meanings).filter(Boolean))]
      };
      if (index >= 0) rules[index] = normalized;
      else rules.push(normalized);
    }
    rules.sort((a,b) => Number(b.priority || 0) - Number(a.priority || 0));
    D.RESPONSE_RULES = rules;
  };

  D.evaluateResponseRules = function evaluateResponseRules({
    analysis = {},
    characterFacts = {},
    characterPolicy = {},
    psychology = {}
  } = {}) {
    const normalized = D.normalizeInputAnalysis
      ? D.normalizeInputAnalysis(analysis)
      : analysis;

    const ctx = { analysis:normalized, characterFacts, characterPolicy, psychology };
    const meaningIds = [];
    const reasons = [];
    const matchedRuleIds = [];
    const slotOverridesByMeaning = {};

    for (const rule of rules) {
      if (!matches(rule, ctx)) continue;
      matchedRuleIds.push(rule.id);
      if (rule.reason) reasons.push(rule.reason);
      for (const id of arr(rule.meanings)) {
        if (!meaningIds.includes(id)) meaningIds.push(id);
      }
      if (rule.slots && typeof rule.slots === "object") {
        for (const [meaningId,slots] of Object.entries(rule.slots)) {
          slotOverridesByMeaning[meaningId] = {
            ...(slotOverridesByMeaning[meaningId] || {}),
            ...(slots || {})
          };
        }
      }
      if (rule.stop === true) break;
    }

    return { meaningIds, reasons, matchedRuleIds, slotOverridesByMeaning };
  };
})();