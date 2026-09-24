(() => {
  "use strict";
  const D = window.HMW = window.HMW || {};
  D.Dialogue = D.Dialogue || {};
  D.Dialogue.VocabularyManifest = [
  "vocabulary-001-function.js",
  "vocabulary-002-verbs.js",
  "vocabulary-003-nouns.js",
  "vocabulary-004-descriptors.js",
  "vocabulary-005-common.js",
  "vocabulary-006-common.js",
  "vocabulary-007-common.js",
  "vocabulary-008-common.js",
  "vocabulary-009-common.js",
  "vocabulary-010-unique-common.js",
  "vocabulary-011-unique-common.js",
  "vocabulary-012-unique-common.js",
  "vocabulary-013-unique-common.js",
  "vocabulary-014-unique-common.js",
  "vocabulary-015-concrete.js",
  "vocabulary-016-daily-life.js",
  "vocabulary-017-concrete.js",
  "vocabulary-018-daily.js",
  "vocabulary-019-unique-common.js",
  "vocabulary-020-concrete.js",
  "vocabulary-021-concrete.js",
  "vocabulary-022-concrete.js",
  "vocabulary-023-conversation.js",
  "vocabulary-024-conversation.js",
  "vocabulary-025-conversation.js",
  "vocabulary-026-daily-life.js",
  "vocabulary-027-relationship.js",
  "vocabulary-028-work-money.js",
  "vocabulary-029-health.js",
  "vocabulary-030-travel-location.js",
  "vocabulary-031-food-drink.js",
  "vocabulary-032-home-routine.js",
  "vocabulary-033-time-schedule.js",
  "vocabulary-034-communication.js",
  "vocabulary-035-decision-intention.js",
  "vocabulary-036-agreement-certainty.js",
  "vocabulary-037-wants-needs.js",
  "vocabulary-038-ability-permission.js",
  "vocabulary-039-conflict-repair.js",
  "vocabulary-040-weather-environment.js",
  "vocabulary-041-possession-quantity.js",
  "vocabulary-042-identity-social-role.js",
  "vocabulary-043-knowledge-memory.js",
  "vocabulary-044-cause-result.js",
  "vocabulary-045-emotion-reaction.js",
  "vocabulary-046-request-cooperation.js",
  "vocabulary-047-clothing-appearance.js",
  "vocabulary-048-safety-emergency.js",
  "vocabulary-049-shopping-service.js",
  "vocabulary-050-dialogue-control.js",
  "vocabulary-051-everyday-actions.js",
  "vocabulary-052-social-thought-events.js",
  "vocabulary-053-practical-community.js",
  "vocabulary-054-people-social.js",
  "vocabulary-055-body-senses.js",
  "vocabulary-056-emotion-attitude.js",
  "vocabulary-057-work-commerce.js",
  "vocabulary-058-food-household.js",
  "vocabulary-059-communication-information.js",
  "vocabulary-060-planning-change.js",
  "vocabulary-061-objects-materials.js",
  "vocabulary-062-nature-outdoors.js",
  "vocabulary-063-knowledge-reasoning.js",
  "vocabulary-064-space-direction.js",
  "vocabulary-065-quantity-degree.js",
  "vocabulary-066-rules-boundaries.js",
  "vocabulary-067-romance-relationship.js",
  "vocabulary-068-conflict-negotiation.js",
  "vocabulary-069-culture-leisure.js",
  "vocabulary-070-health-care.js",
  "vocabulary-071-clothing-personal.js",
  "vocabulary-072-transport-lodging.js",
  "vocabulary-073-shopping-transaction.js",
  "vocabulary-074-home-utilities.js"
];

  D.Dialogue.auditVocabulary = function auditVocabulary() {
    const V = D.Dialogue.Vocabulary;
    if (!V || !Array.isArray(V.entries)) throw new Error("Load vocabulary registry and all manifest files before auditing.");
    const unique = new Map();
    const byPos = {};
    for (const entry of V.entries) {
      const lemma = String(entry.lemma || "").trim().toLowerCase();
      const pos = String(entry.pos || "").trim().toLowerCase();
      if (!lemma || !pos) continue;
      unique.set(lemma + ":" + pos, entry);
    }
    for (const entry of unique.values()) {
      const pos = String(entry.pos).toLowerCase();
      byPos[pos] = (byPos[pos] || 0) + 1;
    }
    return {
      manifestFiles: D.Dialogue.VocabularyManifest.length,
      registryEntries: V.entries.length,
      uniqueLemmaPos: unique.size,
      byPos
    };
  };
})();
