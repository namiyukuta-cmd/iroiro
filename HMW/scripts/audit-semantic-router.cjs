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
  for (const match of html.matchAll(/src="([^"?]+)/g)) files.push(match[1]);
} };
vm.runInContext(loader, context);
for (const file of files) {
  vm.runInContext(fs.readFileSync(path.join(root, file), "utf8"), context, { filename: file });
}
const D = context.HMW.Dialogue;
const ids = [...new Set([
  ...Object.keys(D.GENERATION_SPECS || {}),
  ...Object.keys(D.MEANING_PATTERN_MAP || {})
])];
const patterns = new Set();
const eligiblePatterns = new Set();
const words = new Set();
const failures = [];
let generated = 0;
for (const id of ids) {
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
      patterns.add(route.patternId);
      if (!route.english || /\{[^}]+\}/.test(route.english)) {
        failures.push({ id, seed, english: route.english });
      }
      for (const value of Object.values(route.slots || {})) {
        if (D.Vocabulary.has(value)) words.add(String(value).toLowerCase());
      }
    }
  }
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
  scope: "12 seeds per meaning; slot values only, not complete lexical coverage or English quality approval"
};
console.log(JSON.stringify(report, null, 2));
process.exitCode = failures.length ? 1 : 0;
