(() => {
  "use strict";
  window.HMW = window.HMW || {};
  const H = window.HMW;

  const clamp = (value, min = 0, max = 100) => {
    const n = Number(value);
    if (!Number.isFinite(n)) return min;
    return Math.max(min, Math.min(max, n));
  };

  const clone = (value) => JSON.parse(JSON.stringify(value ?? null));

  const historySnapshot = (state = {}, changes = {}) => {
    const coreKeys = [
      "stage", "stageName", "romanceScore", "seekHeroine", "attachment", "trust",
      "romanticAwareness", "jealousy", "fearOfLoss", "longing", "repairDrive",
      "possessiveness", "physicalNeed", "passion", "reason", "selfControl",
      "ethics", "respectForHeroine", "hurt", "anger", "sadness",
      "unresolvedConflictWeight", "unresolvedEmotion", "lastChangeReason"
    ];
    const keys = new Set([...coreKeys, ...Object.keys(changes || {})]);
    const snapshot = {};
    keys.forEach((key) => {
      if (state[key] !== undefined) snapshot[key] = clone(state[key]);
    });
    return snapshot;
  };

  const compactEvaluation = (evaluations = {}) => ({
    romanceOnset: evaluations.romanceOnset ? {
      onsetType: evaluations.romanceOnset.onsetType,
      confidence: evaluations.romanceOnset.confidence
    } : null,
    conflict: evaluations.conflict ? {
      outcome: evaluations.conflict.outcome,
      desirePressure: evaluations.conflict.desirePressure,
      restraintPressure: evaluations.conflict.restraintPressure,
      delta: evaluations.conflict.delta
    } : null,
    approachAvoidance: evaluations.approachAvoidance ? {
      mode: evaluations.approachAvoidance.mode,
      approachPressure: evaluations.approachAvoidance.approachPressure,
      avoidancePressure: evaluations.approachAvoidance.avoidancePressure,
      delta: evaluations.approachAvoidance.delta
    } : null,
    attachmentTension: evaluations.attachmentTension ? {
      mode: evaluations.attachmentTension.mode,
      closenessPull: evaluations.attachmentTension.closenessPull,
      distancePull: evaluations.attachmentTension.distancePull,
      difference: evaluations.attachmentTension.difference
    } : null,
    repair: evaluations.repair ? {
      mode: evaluations.repair.mode,
      repairPressure: evaluations.repair.repairPressure,
      resistance: evaluations.repair.resistance,
      delta: evaluations.repair.delta
    } : null,
    intimacy: evaluations.intimacy ? {
      mode: evaluations.intimacy.mode,
      score: evaluations.intimacy.score,
      intimacyDesire: evaluations.intimacy.intimacyDesire
    } : null
  });

  const stageFromRelationship = (rel = {}) => {
    const familiarity = clamp(rel.familiarity);
    const trust = clamp(rel.trust);
    const goodwill = clamp(rel.goodwill);
    if (goodwill >= 85 && trust >= 60) return { stage: 8, stageName: "交際" };
    if (goodwill >= 70) return { stage: 6, stageName: "恋愛緊張" };
    if (goodwill >= 55) return { stage: 5, stageName: "恋愛自覚" };
    if (goodwill >= 40) return { stage: 4, stageName: "恋愛自覚前" };
    if (goodwill >= 25) return { stage: 3, stageName: "特別" };
    if (goodwill >= 10 || familiarity >= 15) return { stage: 2, stageName: "親しみ" };
    if (familiarity >= 5) return { stage: 1, stageName: "興味" };
    return { stage: 0, stageName: "他人" };
  };

  const EVENT_DELTAS = Object.freeze({
    conversation: Object.freeze({
      familiarity: 1, memoryFrequency: 2, spontaneousThought: 1, anticipation: 1,
      desireForContact: 1, intrigue: 1, emotionalActivation: 1
    }),
    shared_time: Object.freeze({
      familiarity: 2, comfort: 3, attachment: 2, joy: 2, recentAcceptanceImpact: 2,
      positiveMemorySalience: 2, desireForContact: 2
    }),
    share_food: Object.freeze({
      attachment: 4, gratitude: 7, tenderness: 4, perceivedAffection: 5,
      recentAffectionImpact: 5, recentAcceptanceImpact: 4, perceivedSafety: 3,
      relationshipHope: 3, positiveMemorySalience: 4
    }),
    help: Object.freeze({
      gratitude: 6, perceivedSafety: 4, attachment: 3, perceivedAffection: 3,
      recentAcceptanceImpact: 3, relationshipHope: 3, positiveMemorySalience: 3
    }),
    personal: Object.freeze({
      perceivedSafety: 5, attachment: 4, emotionalAttraction: 4, vulnerability: 3,
      recentAcceptanceImpact: 4, trust: 2, comfort: 3, memoryFrequency: 3
    }),
    affection: Object.freeze({
      perceivedAffection: 9, recentAffectionImpact: 9, attachment: 5, seekHeroine: 5,
      emotionalNeed: 4, joy: 6, euphoria: 4, perceivedReciprocity: 5,
      certaintyOfHerAffection: 4, romanticMomentum: 5
    }),
    confession: Object.freeze({
      certaintyOfHerAffection: 16, perceivedReciprocity: 14, perceivedAffection: 12,
      seekHeroine: 9, romanticAwareness: 12, attachment: 9, euphoria: 10,
      romanticConfidence: 9, relationshipHope: 9, needForReciprocity: 5,
      romanticMomentum: 8, recentAffectionImpact: 12
    }),
    touch: Object.freeze({
      physicalNeed: 5, touchImpulse: 7, handTouchImpulse: 4, embraceImpulse: 5,
      kissImpulse: 5, recentAffectionImpact: 6, attachment: 3, passion: 4,
      privateTimeWish: 4, emotionalActivation: 4
    }),
    overnight: Object.freeze({
      attachment: 7, closenessComfort: 6, seekHeroine: 5, physicalNeed: 4,
      privateTimeWish: 6, reluctanceToPart: 5, separationDistress: 3,
      recentAffectionImpact: 7, positiveMemorySalience: 6, perceivedSafety: 4
    }),
    rejection: Object.freeze({
      perceivedRejection: 18, rejectionPain: 18, hurt: 16, sadness: 8,
      recentRejectionImpact: 20, withdrawalImpulse: 10, fearOfRejection: 10,
      hesitation: 8, perceivedAffection: -8, romanticConfidence: -7,
      certaintyOfHerAffection: -8
    }),
    jealousy_trigger: Object.freeze({
      jealousy: 14, perceivedRivalThreat: 14, insecurity: 8, anxiety: 6,
      recentJealousyImpact: 16, exclusivityNeed: 8, possessiveness: 7,
      reassuranceSeeking: 7, emotionalActivation: 8
    }),
    conflict: Object.freeze({
      hurt: 9, anger: 8, frustration: 10, unresolvedConflictWeight: 12,
      negativeMemorySalience: 8, emotionalPressure: 9, emotionalActivation: 8,
      repairDrive: 2
    }),
    repair: Object.freeze({
      repairDrive: 7, apologyImpulse: 5, forgivenessReadiness: 5,
      expectationOfRepair: 7, relationshipHope: 6, unresolvedConflictWeight: -8,
      hurt: -4, anger: -4, resentment: -4, perceivedSafety: 4
    }),
    separation: Object.freeze({
      longing: 7, separationDistress: 7, memoryFrequency: 4, spontaneousThought: 4,
      desireForContact: 5, reluctanceToPart: 4
    }),
    reunion: Object.freeze({
      relief: 8, joy: 7, reunionImpact: 9, recentAcceptanceImpact: 5,
      desireForContact: 4, emotionalActivation: 5
    })
  });

  H.PSYCHOLOGY_EVENT_DELTAS = EVENT_DELTAS;

  H.createPsychologyState = (id, rel = {}) => {
    const engine = window.HMWPsychologyParameters;
    const character = H.CHARACTERS?.[id] || {};
    const traits = character.psychologyTraits || {};
    const seed = character.psychologySeed || {};
    const stage = stageFromRelationship(rel);
    const familiarity = clamp(rel.familiarity);
    const trust = clamp(rel.trust);
    const goodwill = clamp(rel.goodwill);
    const desire = clamp(rel.desire);
    const conscience = clamp(rel.conscience);
    const sharedNightBonus = rel.flags?.sharedNight ? 8 : 0;
    const darkenedNightBonus = rel.flags?.darkenedNight ? 4 : 0;

    const raw = {
      characterId: id,
      characterName: character.name || H.DATA?.people?.[id]?.name || id,
      roleLabel: character.role || H.DATA?.people?.[id]?.role || "",
      psychologyModelVersion: engine?.version || 3,
      psychologyTraits: traits,
      ...seed,
      ...stage,
      romanceScore: Math.max(goodwill, Math.round((familiarity + trust + goodwill + desire) / 4)),
      familiarity,
      trust,
      physicalNeed: Math.max(Number(seed.physicalNeed) || 0, desire),
      sexualAttraction: Math.max(Number(seed.sexualAttraction) || 0, Math.round(desire * 0.8)),
      emotionalAttraction: Math.max(Number(seed.emotionalAttraction) || 0, goodwill),
      attachment: Math.max(Number(seed.attachment) || 0, Math.round((familiarity + trust + goodwill) / 3) + sharedNightBonus),
      seekHeroine: Math.max(
        Number(seed.seekHeroine) || 0,
        Math.round(goodwill * 0.58 + desire * 0.24 + familiarity * 0.18) + sharedNightBonus + darkenedNightBonus
      ),
      romanticAwareness: Math.max(Number(seed.romanticAwareness) || 0, stage.stage >= 5 ? 65 : stage.stage * 10),
      perceivedAffection: Math.max(Number(seed.perceivedAffection) || 0, goodwill),
      perceivedReciprocity: Math.max(Number(seed.perceivedReciprocity) || 0, Math.round((trust + goodwill) / 2)),
      certaintyOfHerAffection: Math.max(Number(seed.certaintyOfHerAffection) || 0, Math.round(goodwill * 0.75)),
      desireForContact: Math.max(Number(seed.desireForContact) || 0, Math.round((goodwill + familiarity) / 2)),
      needForAffection: Math.max(Number(seed.needForAffection) || 0, goodwill),
      needToBeChosen: Math.max(Number(seed.needToBeChosen) || 0, Math.round(goodwill * 0.9)),
      ethics: conscience,
      reason: Math.max(Number(seed.reason) || 0, Number(traits.rationality) || 50),
      selfControl: Math.max(Number(seed.selfControl) || 0, Number(traits.impulseControl) || 50),
      socialRestraint: Math.max(Number(seed.socialRestraint) || 0, Number(traits.socialCaution) || 50),
      respectForHeroine: Math.max(Number(seed.respectForHeroine) || 0, Number(traits.respectForAutonomy) || 70),
      lastPsychologyConflict: null,
      lastIntimacyInitiative: null,
      lastApproachAvoidance: null,
      lastRepairEvaluation: null,
      lastAttachmentTension: null,
      lastRomanceOnsetEvaluation: null,
      lastChangeReason: "HMW既存関係値から詳細心理を初期化",
      unresolvedEmotion: ""
    };

    return engine?.normalizeState ? engine.normalizeState(raw, id) : raw;
  };

  H.ensureRelationshipPsychology = (id, rel) => {
    if (!rel || !H.DATA?.people?.[id]?.romance) return null;
    const engine = window.HMWPsychologyParameters;
    if (!rel.psychology) rel.psychology = H.createPsychologyState(id, rel);
    else {
      rel.psychology.characterId = id;
      const character = H.CHARACTERS?.[id];
      if (character?.psychologyTraits) {
        rel.psychology.psychologyTraits = {
          ...(rel.psychology.psychologyTraits || {}),
          ...character.psychologyTraits
        };
      }
      if (engine?.normalizeState) rel.psychology = engine.normalizeState(rel.psychology, id);
    }
    if (!Array.isArray(rel.psychologyHistory)) rel.psychologyHistory = [];
    return rel.psychology;
  };

  H.evaluateNpcPsychology = (id) => {
    const rel = H.state?.relationships?.[id];
    if (!rel || !H.DATA?.people?.[id]?.romance) return null;
    const engine = window.HMWPsychologyParameters;
    if (!engine) return null;
    const state = H.ensureRelationshipPsychology(id, rel);
    const evaluations = {
      romanceOnset: engine.evaluateRomanceOnset(state, id),
      conflict: engine.evaluateConflict(state, id),
      approachAvoidance: engine.evaluateApproachAvoidance(state, id),
      attachmentTension: engine.evaluateAttachmentTension(state, id),
      repair: engine.evaluateRepairDrive(state, id),
      intimacy: engine.evaluateIntimacyInitiative(state, id)
    };
    state.lastRomanceOnsetEvaluation = evaluations.romanceOnset;
    state.lastPsychologyConflict = evaluations.conflict;
    state.lastApproachAvoidance = evaluations.approachAvoidance;
    state.lastAttachmentTension = evaluations.attachmentTension;
    state.lastRepairEvaluation = evaluations.repair;
    state.lastIntimacyInitiative = evaluations.intimacy;
    return { state, evaluations, behavior: H.CHARACTER_BEHAVIORS?.[id] || null };
  };

  H.applyPsychologyEvent = (id, eventName, context = {}) => {
    const rel = H.state?.relationships?.[id];
    if (!rel || !H.DATA?.people?.[id]?.romance) return null;
    const engine = window.HMWPsychologyParameters;
    if (!engine) return null;

    const current = H.ensureRelationshipPsychology(id, rel);
    const before = clone(current);
    const next = clone(current);
    const base = EVENT_DELTAS[eventName] || {};
    const extra = context.psychologyChanges || {};
    const changes = { ...base };

    Object.entries(extra).forEach(([key, amount]) => {
      changes[key] = (Number(changes[key]) || 0) + (Number(amount) || 0);
    });

    Object.entries(changes).forEach(([key, amount]) => {
      if (typeof amount !== "number" || !Number.isFinite(amount)) return;
      next[key] = clamp((Number(next[key]) || 0) + amount);
    });

    // 画面表示用の既存6項目を正本として、対応する心理値を同期する。
    next.familiarity = clamp(rel.familiarity);
    next.trust = clamp(rel.trust);
    next.physicalNeed = clamp(Math.max(Number(next.physicalNeed) || 0, Number(rel.desire) || 0));
    next.perceivedAffection = clamp(Math.max(Number(next.perceivedAffection) || 0, Number(rel.goodwill) || 0));
    next.ethics = clamp(rel.conscience);

    const stage = stageFromRelationship(rel);
    if (stage.stage > (Number(next.stage) || 0)) {
      next.stage = stage.stage;
      next.stageName = stage.stageName;
    }
    next.romanceScore = clamp(Math.max(Number(next.romanceScore) || 0, Number(rel.goodwill) || 0));
    next.lastChangeReason = context.reason || eventName;

    // 最新恋愛ゲーム側の順序に合わせ、before + change → normalize → evaluate の順で固定する。
    rel.psychology = engine.normalizeState(next, id);
    const snapshot = H.evaluateNpcPsychology(id);
    if (!snapshot) return null;

    const after = clone(snapshot.state);
    const entry = {
      schemaVersion: 2,
      day: H.state.day,
      slot: H.state.slot,
      event: eventName,
      reason: context.reason || "",
      before: historySnapshot(before, changes),
      change: clone(changes),
      after: historySnapshot(after, changes),
      evaluation: compactEvaluation(snapshot.evaluations)
    };

    rel.psychologyHistory.unshift(entry);
    rel.psychologyHistory = rel.psychologyHistory.slice(0, 80);
    return snapshot;
  };

  H.decayPsychologyDay = () => {
    const relationships = H.state?.relationships || {};
    Object.entries(relationships).forEach(([id, rel]) => {
      if (!H.DATA?.people?.[id]?.romance || !rel?.psychology) return;
      H.applyPsychologyEvent(id, "daily_decay", {
        reason: "1日経過による直近感情の減衰",
        psychologyChanges: {
          recentAcceptanceImpact: -6,
          recentRejectionImpact: -5,
          recentAffectionImpact: -5,
          recentJealousyImpact: -5,
          euphoria: -4,
          emotionalActivation: -3,
          encounterImpact: -3,
          reunionImpact: -3
        }
      });
    });
  };

  H.getPsychologySnapshot = (id) => {
    const result = H.evaluateNpcPsychology(id);
    if (!result) return null;
    return {
      character: H.CHARACTERS?.[id] || null,
      behavior: result.behavior,
      state: result.state,
      evaluations: result.evaluations,
      recentPsychologyHistory: (H.state.relationships[id].psychologyHistory || []).slice(0, 12)
    };
  };
})();