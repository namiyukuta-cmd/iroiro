"use strict";
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const assert = require("node:assert/strict");
const root = path.resolve(__dirname, "..");
const HMW = {};
const files = [];
const context = vm.createContext({ HMW, window: { HMW }, console, document: {
  write(html) { for (const match of html.matchAll(/src="([^"?]+)/g)) files.push(match[1]); }
} });
vm.runInContext(fs.readFileSync(path.join(root,"js/dialogue-loader.js"),"utf8"),context);
for (const file of files) vm.runInContext(fs.readFileSync(path.join(root,file),"utf8"),context,{filename:file});
const D = HMW.Dialogue;
const base = {
  characterPolicy: { willingToTalk:true, willingToHelp:true, canOfferFood:true, maxResponseMeanings:5 },
  characterFacts: { name:"Test", availableTime:"today" },
  psychology: { care:90, tenderness:90, empathy:90, patience:60, anger:0, confusion:0, fearOfLoss:0 },
  relationship: { trust:0, goodwill:0, flags:{} },
  conversationContext: { availableNow:true, canTalkFreely:true, timePressure:false, mustLeaveNow:false }
};
const run = analysis => D.runDialoguePipeline({ ...base, analysis });
const meanings = result => Array.from(result.plan.selectedMeaningIds);
for (const tone of [{},{style:"neutral"}]) {
  const result=run({rawText:"Hello.",intents:["greet"],tone});
  assert.deepEqual(meanings(result),["RETURN_GREETING"]);
  console.log("greeting:",result.english);
}
const help=run({intents:["greet","ask_for_help"]});
assert(meanings(help).includes("OFFER_HELP"));
assert(!meanings(help).some(id=>["EXPRESS_CARE","EXPRESS_JOY","EXPRESS_SYMPATHY"].includes(id)));
const sad=run({intents:["report_event"],emotions:{sadness:70}});
assert(meanings(sad).includes("EXPRESS_SYMPATHY"));
const reassurance=run({intents:["request_reassurance"]});
assert(meanings(reassurance).includes("EXPRESS_CARE"));
const joyful=run({intents:["greet"],emotions:{joy:70}});
assert(meanings(joyful).includes("EXPRESS_JOY"));
console.log("PASS: neutral greetings, greeting with help, sad report, reassurance, joyful greeting");
