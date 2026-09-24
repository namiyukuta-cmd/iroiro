"use strict";

const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const assert = require("node:assert/strict");
const root = path.resolve(__dirname, "..");
const context = vm.createContext({ window: {}, console });
context.window.HMW = context.HMW = {};
const loader = fs.readFileSync(path.join(root, "js/dialogue-loader.js"), "utf8");
const files = [];
context.document = { write(html) {
  assert.equal((html.match(/<script /g) || []).length, (html.match(/<\/script>/g) || []).length);
  for (const match of html.matchAll(/src="([^"?]+)/g)) files.push(match[1]);
} };
vm.runInContext(loader, context);
for (const file of files) {
  vm.runInContext(fs.readFileSync(path.join(root, file), "utf8"), context, { filename: file });
}
const D = context.HMW.Dialogue;
const ids = [...new Set([
  ...Object.keys(D.MEANINGS || {}),
  ...Object.keys(D.GENERATION_SPECS || {}),
  ...Object.keys(D.MEANING_PATTERN_MAP || {})
])];
const patterns = new Set();
const eligiblePatterns = new Set();
const words = new Set();
const failures = [];
const samples = {};
let generated = 0;
for (const id of ids) {
  const constraints = D.getMeaningGenerationConstraints(id);
  assert(constraints.category && constraints.semanticTags.length, id + ": missing semantic category");
  assert(constraints.candidates.length, id + ": missing candidate constraints");
  for (const candidate of constraints.candidates) {
    for (const rule of candidate.lexical) {
      for (const lemma of rule.lemmas) assert(D.Vocabulary.has(lemma, rule.pos), id + ": missing dictionary entry " + lemma);
    }
  }
  const sentences = new Set();
  const candidates = [
    ...(D.GENERATION_SPECS[id]?.candidates || []),
    ...(D.MEANING_PATTERN_MAP[id] || [])
  ];
  for (const candidate of candidates) {
    if (!candidate.surfaceOverride) {
      D.getCompatibleGenerationPatterns(candidate.pattern).forEach(id => eligiblePatterns.add(id));
    }
  }
  for (let seed = 0; seed < 12; seed++) {
    const routes = D.getMeaningGenerationRoutes(id, { variantSeed: seed });
    if (!routes.length) failures.push({ id, seed, reason: "no routes" });
    for (const route of routes) {
      generated++;
      sentences.add(route.english);
      patterns.add(route.patternId);
      if (!route.english || /\{[^}]+\}/.test(route.english)) {
        failures.push({ id, seed, english: route.english });
      }
      for (const value of Object.values(route.slots || {})) {
        if (D.Vocabulary.has(value)) words.add(String(value).toLowerCase());
      }
    }
    const composed = D.composeMeaning(id, { variantSeed: seed });
    if (!composed.ok || composed.source !== "semantic_router") failures.push({ id, seed, reason: "composer bypassed router" });
  }
  samples[id] = [...sentences];
}
// Caller vocabulary preferences must never replace the intended answer.
const baseline = D.getMeaningGenerationRoutes("AFFIRM_LOVE");
const hostile = D.getMeaningGenerationRoutes("AFFIRM_LOVE", { lexicalTargets: ["hate", "leave", "hurt"] });
assert.deepEqual(hostile.map(x => x.english), baseline.map(x => x.english));
// New registered templates are found without extending the manual ID table.
D.SENTENCE_PATTERNS.AUDIT_EQUIVALENT = D.SENTENCE_PATTERNS.PRESENT_SIMPLE_SVO;
D.SENTENCE_PATTERNS.AUDIT_NEGATIVE = D.SENTENCE_PATTERNS.PRESENT_SIMPLE_NEG;
assert(D.getCompatibleGenerationPatterns("PRESENT_SIMPLE_SVO").includes("AUDIT_EQUIVALENT"));
assert(!D.getCompatibleGenerationPatterns("PRESENT_SIMPLE_SVO").includes("AUDIT_NEGATIVE"));
delete D.SENTENCE_PATTERNS.AUDIT_EQUIVALENT;
delete D.SENTENCE_PATTERNS.AUDIT_NEGATIVE;
assert(D.getCompatibleGenerationPatterns("REQUEST_CAN_YOU").includes("QUESTION_WOULD_YOU_MIND"));
assert(!D.getCompatibleGenerationPatterns("QUESTION_CAN_YOU").includes("QUESTION_WOULD_YOU_MIND"));
assert(!D.getCompatibleGenerationPatterns("REQUEST_CAN_YOU").includes("REQUEST_DONT_ACTION"));
assert.equal(D.fillPatternSlots("DECLARATIVE_SVO", { requireSemanticSlots: true }).ok, false);
const expected = {
  ASK_ABOUT_OTHER_PERSON: "Who is that person?",
  STATE_IDENTITY_ROLE: "I am a worker.",
  STATE_DESTINATION: "I am going there.",
  STATE_WORK_LOCATION: "I work here.",
  STATE_JOB_ROLE: "I work as a worker.",
  STATE_FEELINGS_TOWARD_HEROINE: "I feel affection toward you.",
  ASK_FOR_HELP: "Would you mind helping me?"
};
for (const [id, english] of Object.entries(expected)) assert(samples[id].includes(english), id + ": " + english);
for (const sentences of Object.values(samples)) {
  for (const english of sentences) {
    assert(!/\b(?:going to there|work at here|am worker|is the thing)\b/i.test(english), english);
    assert(/^[A-Z]/.test(english), english);
  }
}
assert.equal(D.renderSentencePattern("ANSWER_DESTINATION", { PLACE: "the park" }), "I am going to the park");
assert.equal(D.renderSentencePattern("ANSWER_WORK_LOCATION", { PLACE: "the shop" }), "I work at the shop");
assert.equal(D.renderSentencePattern("ANSWER_IDENTITY_ROLE", { ROLE: "engineer" }), "I am an engineer");
assert(D.getMeaningGenerationRoutes("AFFIRM_LOVE", { slotOverrides: { SUBJECT: "she" } }).some(r => r.english === "She loves you."));
const report = {
  meanings: ids.length,
  vocabularyEntries: D.Vocabulary.entries.length,
  registeredPatterns: Object.keys(D.SENTENCE_PATTERNS).length,
  sampledRoutes: generated,
  usedPatterns: patterns.size,
  eligiblePatterns: eligiblePatterns.size,
  observedDictionarySlotValues: words.size,
  ineligiblePatterns: Object.keys(D.SENTENCE_PATTERNS).filter(id => !eligiblePatterns.has(id)),
  failures,
  samples,
  scope: "12 seeds per meaning, composer integration, semantic constraints and targeted grammar regressions. Not exhaustive English quality certification."
};
if (process.argv.includes("--write")) {
  const directory = path.join(root, "reports");
  fs.mkdirSync(directory, { recursive: true });
  fs.writeFileSync(path.join(directory, "semantic-router-audit.json"), JSON.stringify(report, null, 2) + "\n");
}
console.log(JSON.stringify(report, null, 2));
process.exitCode = failures.length ? 1 : 0;
