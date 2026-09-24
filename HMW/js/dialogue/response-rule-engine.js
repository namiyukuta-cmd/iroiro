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

  const pathValue = (root, path) => {
    const parts = String(path || "").split(".").filter(Boolean);
    let value = root;
    for (const part of parts) value = value?.[part];
    return value;
  };

  const comparePath = (root, path, expected) => {
    const value = pathValue(root, path);
    if (Array.isArray(expected)) return expected.includes(value);
    return value === expected;
  };

  const hasValueAtPath = (root, path) => {
    const value = pathValue(root, path);
    return value !== undefined && value !== null && value !== "";
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

    if (w.questionCountMin !== undefined && questions.length < Number(w.questionCountMin)) return false;
    if (w.questionCountMax !== undefined && questions.length > Number(w.questionCountMax)) return false;

    if (w.primaryQuestionAny) {
      const spec = w.primaryQuestionAny;
      const q = questions[0];
      if (!q) return false;
      if (spec.kindAny && !arr(spec.kindAny).includes(q?.kind)) return false;
      if (spec.actionAny && !arr(spec.actionAny).includes(q?.action)) return false;
      if (spec.targetAny && !arr(spec.targetAny).includes(q?.target)) return false;
      if (spec.requestedFieldAny && !arr(spec.requestedFieldAny).includes(q?.requestedField)) return false;
      if (spec.conceptAny && !arr(spec.conceptAny).includes(q?.concept)) return false;
    }

    if (w.secondaryQuestionAny) {
      const spec = w.secondaryQuestionAny;
      const matched = questions.slice(1).some(q => {
        if (spec.kindAny && !arr(spec.kindAny).includes(q?.kind)) return false;
        if (spec.actionAny && !arr(spec.actionAny).includes(q?.action)) return false;
        if (spec.targetAny && !arr(spec.targetAny).includes(q?.target)) return false;
        if (spec.requestedFieldAny && !arr(spec.requestedFieldAny).includes(q?.requestedField)) return false;
        if (spec.conceptAny && !arr(spec.conceptAny).includes(q?.concept)) return false;
        return true;
      });
      if (!matched) return false;
    }

    if (w.questionAt) {
      const spec = w.questionAt;
      const index = Number(spec.index);
      const q = Number.isInteger(index) && index >= 0 ? questions[index] : null;
      if (!q) return false;
      if (spec.kindAny && !arr(spec.kindAny).includes(q?.kind)) return false;
      if (spec.actionAny && !arr(spec.actionAny).includes(q?.action)) return false;
      if (spec.targetAny && !arr(spec.targetAny).includes(q?.target)) return false;
      if (spec.requestedFieldAny && !arr(spec.requestedFieldAny).includes(q?.requestedField)) return false;
      if (spec.conceptAny && !arr(spec.conceptAny).includes(q?.concept)) return false;
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

    const claims = arr(a.claims);
    if (w.claimCountMin !== undefined && claims.length < Number(w.claimCountMin)) return false;
    if (w.claimCountMax !== undefined && claims.length > Number(w.claimCountMax)) return false;

    if (w.primaryClaimAny) {
      const spec = w.primaryClaimAny;
      const claim = claims[0];
      if (!claim) return false;
      if (spec.conceptAny && !arr(spec.conceptAny).includes(claim?.concept)) return false;
      if (spec.typeAny && !arr(spec.typeAny).includes(claim?.type)) return false;
      if (spec.certaintyAny && !arr(spec.certaintyAny).includes(claim?.certainty)) return false;
      if (spec.polarityEq !== undefined && claim?.polarity !== spec.polarityEq) return false;
    }

    if (w.secondaryClaimAny) {
      const spec = w.secondaryClaimAny;
      const matched = claims.slice(1).some(claim => {
        if (spec.conceptAny && !arr(spec.conceptAny).includes(claim?.concept)) return false;
        if (spec.typeAny && !arr(spec.typeAny).includes(claim?.type)) return false;
        if (spec.certaintyAny && !arr(spec.certaintyAny).includes(claim?.certainty)) return false;
        if (spec.polarityEq !== undefined && claim?.polarity !== spec.polarityEq) return false;
        return true;
      });
      if (!matched) return false;
    }

    if (w.claimAt) {
      const spec = w.claimAt;
      const index = Number(spec.index);
      const claim = Number.isInteger(index) && index >= 0 ? claims[index] : null;
      if (!claim) return false;
      if (spec.conceptAny && !arr(spec.conceptAny).includes(claim?.concept)) return false;
      if (spec.typeAny && !arr(spec.typeAny).includes(claim?.type)) return false;
      if (spec.certaintyAny && !arr(spec.certaintyAny).includes(claim?.certainty)) return false;
      if (spec.polarityEq !== undefined && claim?.polarity !== spec.polarityEq) return false;
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
    if (w.factPresent && !arr(w.factPresent).every(path => hasValueAtPath(ctx.characterFacts || {}, path))) return false;
    if (w.factAbsent && !arr(w.factAbsent).every(path => !hasValueAtPath(ctx.characterFacts || {}, path))) return false;
    for (const [path,expected] of Object.entries(w.policyEq || {})) {
      if (!comparePath(ctx.characterPolicy || {}, path, expected)) return false;
    }
    if (w.policyPresent && !arr(w.policyPresent).every(path => hasValueAtPath(ctx.characterPolicy || {}, path))) return false;
    if (w.policyAbsent && !arr(w.policyAbsent).every(path => !hasValueAtPath(ctx.characterPolicy || {}, path))) return false;
    for (const [path,expected] of Object.entries(w.relationshipEq || {})) {
      if (!comparePath(ctx.relationship || {}, path, expected)) return false;
    }
    for (const [key,min] of Object.entries(w.relationshipMin || {})) {
      const value = ctx.relationship?.[key];
      if (!Number.isFinite(Number(value)) || Number(value) < Number(min)) return false;
    }
    for (const [key,max] of Object.entries(w.relationshipMax || {})) {
      const value = ctx.relationship?.[key];
      if (!Number.isFinite(Number(value)) || Number(value) > Number(max)) return false;
    }
    for (const [path,expected] of Object.entries(w.relationshipFlagEq || {})) {
      if (!comparePath(ctx.relationship?.flags || {}, path, expected)) return false;
    }
    if (w.relationshipPresent && !arr(w.relationshipPresent).every(path => hasValueAtPath(ctx.relationship || {}, path))) return false;
    if (w.relationshipAbsent && !arr(w.relationshipAbsent).every(path => !hasValueAtPath(ctx.relationship || {}, path))) return false;

    for (const [path,expected] of Object.entries(w.contextEq || {})) {
      if (!comparePath(ctx.conversationContext || {}, path, expected)) return false;
    }
    for (const [key,min] of Object.entries(w.contextMin || {})) {
      const value = ctx.conversationContext?.[key];
      if (!Number.isFinite(Number(value)) || Number(value) < Number(min)) return false;
    }
    for (const [key,max] of Object.entries(w.contextMax || {})) {
      const value = ctx.conversationContext?.[key];
      if (!Number.isFinite(Number(value)) || Number(value) > Number(max)) return false;
    }
    if (w.contextPresent && !arr(w.contextPresent).every(path => hasValueAtPath(ctx.conversationContext || {}, path))) return false;
    if (w.contextAbsent && !arr(w.contextAbsent).every(path => !hasValueAtPath(ctx.conversationContext || {}, path))) return false;

    const recentMeaningIds = arr(ctx.recentMeaningIds);
    if (w.historyAny && !hasAny(recentMeaningIds, w.historyAny)) return false;
    if (w.historyAll && !hasAll(recentMeaningIds, w.historyAll)) return false;
    if (w.historyNone && hasAny(recentMeaningIds, w.historyNone)) return false;
    if (w.historyLastAny) {
      const last = recentMeaningIds[recentMeaningIds.length - 1];
      if (!arr(w.historyLastAny).includes(last)) return false;
    }
    if (w.historyLastNone) {
      const last = recentMeaningIds[recentMeaningIds.length - 1];
      if (arr(w.historyLastNone).includes(last)) return false;
    }
    if (w.historyRecentAny) {
      const limit = Math.max(1, Number(w.historyRecentWindow) || 3);
      const slice = recentMeaningIds.slice(-limit);
      if (!hasAny(slice, w.historyRecentAny)) return false;
    }
    if (w.historyRecentNone) {
      const limit = Math.max(1, Number(w.historyRecentWindow) || 3);
      const slice = recentMeaningIds.slice(-limit);
      if (hasAny(slice, w.historyRecentNone)) return false;
    }
    if (w.historySuffix) {
      const suffix = arr(w.historySuffix);
      if (suffix.length > recentMeaningIds.length) return false;
      const tail = recentMeaningIds.slice(-suffix.length);
      if (!suffix.every((id,index) => tail[index] === id)) return false;
    }
    for (const [id,min] of Object.entries(w.historyRecentCountMin || {})) {
      const limit = Math.max(1, Number(w.historyRecentWindow) || 3);
      const count = recentMeaningIds.slice(-limit).filter(item => item === id).length;
      if (count < Number(min)) return false;
    }
    for (const [id,max] of Object.entries(w.historyRecentCountMax || {})) {
      const limit = Math.max(1, Number(w.historyRecentWindow) || 3);
      const count = recentMeaningIds.slice(-limit).filter(item => item === id).length;
      if (count > Number(max)) return false;
    }
    for (const [id,min] of Object.entries(w.historyCountMin || {})) {
      const count = recentMeaningIds.filter(item => item === id).length;
      if (count < Number(min)) return false;
    }
    for (const [id,max] of Object.entries(w.historyCountMax || {})) {
      const count = recentMeaningIds.filter(item => item === id).length;
      if (count > Number(max)) return false;
    }
    for (const [key,min] of Object.entries(w.psychologyMin || {})) {
      const value = ctx.psychology?.[key];
      if (!Number.isFinite(Number(value)) || Number(value) < Number(min)) return false;
    }
    for (const [key,max] of Object.entries(w.psychologyMax || {})) {
      const value = ctx.psychology?.[key];
      if (!Number.isFinite(Number(value)) || Number(value) > Number(max)) return false;
    }
    if (w.psychologyPresent && !arr(w.psychologyPresent).every(path => hasValueAtPath(ctx.psychology || {}, path))) return false;
    if (w.psychologyAbsent && !arr(w.psychologyAbsent).every(path => !hasValueAtPath(ctx.psychology || {}, path))) return false;

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
    psychology = {},
    relationship = {},
    conversationContext = {},
    recentMeaningIds = []
  } = {}) {
    const normalized = D.normalizeInputAnalysis
      ? D.normalizeInputAnalysis(analysis)
      : analysis;

    const ctx = { analysis:normalized, characterFacts, characterPolicy, psychology, relationship, conversationContext, recentMeaningIds };
    const meaningIds = [];
    const reasons = [];
    const matchedRuleIds = [];
    const slotOverridesByMeaning = {};
    const suppressedMeaningIds = new Set();
    const preferredMeaningMeta = new Map();
    let preferredSequence = 0;

    const rulePreferenceRank = rule => {
      if (Number.isFinite(Number(rule.preferRank))) return Number(rule.preferRank);
      const qIndex = rule.when?.questionAt?.index;
      if (Number.isInteger(Number(qIndex)) && Number(qIndex) >= 0) return Number(qIndex);
      if (rule.when?.primaryQuestionAny) return 0;
      if (rule.when?.secondaryQuestionAny) return 1;
      const cIndex = rule.when?.claimAt?.index;
      if (Number.isInteger(Number(cIndex)) && Number(cIndex) >= 0) return 100 + Number(cIndex);
      if (rule.when?.primaryClaimAny) return 100;
      if (rule.when?.secondaryClaimAny) return 101;
      return 500;
    };

    for (const rule of rules) {
      if (!matches(rule, ctx)) continue;
      matchedRuleIds.push(rule.id);
      if (rule.reason) reasons.push(rule.reason);

      for (const id of arr(rule.suppressMeanings)) {
        suppressedMeaningIds.add(id);
        const index = meaningIds.indexOf(id);
        if (index >= 0) meaningIds.splice(index, 1);
        preferredMeaningMeta.delete(id);
      }

      for (const id of arr(rule.meanings)) {
        if (suppressedMeaningIds.has(id)) continue;
        if (!meaningIds.includes(id)) meaningIds.push(id);
        if (
          rule.primary === true ||
          rule.prefer === true ||
          rule.when?.questionAt ||
          rule.when?.claimAt ||
          (
            (rule.when?.primaryQuestionAny || rule.when?.primaryClaimAny) &&
            Number(rule.priority || 0) >= 900
          )
        ) {
          const rank = rulePreferenceRank(rule);
          const existing = preferredMeaningMeta.get(id);
          if (!existing || rank < existing.rank) {
            preferredMeaningMeta.set(id, { rank, sequence: preferredSequence++ });
          }
        }
      }
      if (rule.slots && typeof rule.slots === "object") {
        for (const [meaningId,slots] of Object.entries(rule.slots)) {
          slotOverridesByMeaning[meaningId] = {
            ...(slots || {}),
            ...(slotOverridesByMeaning[meaningId] || {})
          };
        }
      }
      if (rule.stop === true) break;
    }

    return {
      meaningIds,
      reasons,
      matchedRuleIds,
      slotOverridesByMeaning,
      suppressedMeaningIds:[...suppressedMeaningIds],
      preferredMeaningIds: [...preferredMeaningMeta.entries()]
        .filter(([id]) => !suppressedMeaningIds.has(id))
        .sort((a,b) => a[1].rank - b[1].rank || a[1].sequence - b[1].sequence)
        .map(([id]) => id)
    };
  };
})();