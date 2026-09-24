(() => {
  "use strict";
  window.HMW = window.HMW || {};
  HMW.Dialogue = HMW.Dialogue || {};

  const choose=(items,seed=0)=>{
    if(!Array.isArray(items)||!items.length) return null;
    const total=items.reduce((s,x)=>s+Math.max(1,Number(x.weight)||1),0);
    let n=Math.abs(Number(seed)||0)%total;
    for(const x of items){
      n-=Math.max(1,Number(x.weight)||1);
      if(n<0) return x;
    }
    return items[0];
  };

  const chooseWord=(list,lexicalTargets=[])=>{
    const words=Array.isArray(list)?list:[];
    if(!words.length) return "";
    const normalizedTargets=(lexicalTargets||[]).map(x=>String(x).toLowerCase());
    const target=words.find(w=>normalizedTargets.includes(String(w).toLowerCase()));
    return target || words[0];
  };

  const applySlotCandidates=(slots,candidate,lexicalTargets)=>{
    const groups=candidate?.slotCandidates || {};
    for(const [slot,options] of Object.entries(groups)){
      if(slots[slot] === undefined || slots[slot] === null || slots[slot] === ""){
        slots[slot]=chooseWord(options,lexicalTargets);
      }
    }
    return slots;
  };

  HMW.Dialogue.buildGeneratedMeaning=function buildGeneratedMeaning(
    meaningId,{variantSeed=0,lexicalTargets=[]}={}
  ){
    const spec=HMW.Dialogue.GENERATION_SPECS?.[String(meaningId||"")];
    if(!spec) return null;
    const candidate=choose(spec.candidates||[],variantSeed);
    if(!candidate) return null;

    if(candidate.surfaceOverride){
      return {
        meaningId,
        ok:true,
        patternId:candidate.pattern||null,
        english:candidate.surfaceOverride,
        slots:{...(candidate.slots||{})},
        source:"generation_spec"
      };
    }

    const verb=chooseWord(candidate.verbs,lexicalTargets);
    const adjective=chooseWord(candidate.adjectives,lexicalTargets);
    const subject=candidate.subject||candidate.slots?.SUBJECT||"I";
    const M=HMW.Dialogue.Morphology;
    let slots={...(candidate.slots||{})};

    if(verb){
      const pattern=candidate.pattern||"PRESENT_SIMPLE_SVO";
      let verbSlots={};
      if(pattern==="PRESENT_SIMPLE_SVO"){
        verbSlots=HMW.Dialogue.fillVerbSlots({subject,verb,object:candidate.object||slots.OBJECT||"",tense:"present"});
      }else if(pattern==="PRESENT_SIMPLE_NEG"){
        verbSlots=HMW.Dialogue.fillVerbSlots({subject,verb,object:candidate.object||slots.OBJECT||"",tense:"present",negative:true});
      }else if(pattern==="PAST_SIMPLE_SVO"){
        verbSlots=HMW.Dialogue.fillVerbSlots({subject,verb,object:candidate.object||slots.OBJECT||"",tense:"past"});
      }else if(pattern==="PAST_SIMPLE_QUESTION"){
        verbSlots={SUBJECT:subject,VERB_BASE:verb,OBJECT:candidate.object||slots.OBJECT||""};
      }else if(pattern==="PRESENT_CONTINUOUS"){
        verbSlots=HMW.Dialogue.fillVerbSlots({subject,verb,object:candidate.object||slots.OBJECT||"",tense:"continuous"});
      }else if(pattern==="FUTURE_SIMPLE" || pattern==="FUTURE_NEG"){
        verbSlots=HMW.Dialogue.fillVerbSlots({subject,verb,object:candidate.object||slots.OBJECT||"",tense:"future"});
      }else{
        verbSlots={
          SUBJECT:subject,
          VERB_BASE:verb,
          VERB:verb,
          OBJECT:candidate.object||slots.OBJECT||""
        };
      }
      slots={...slots,...verbSlots};
    }

    if(adjective){
      slots.SUBJECT=slots.SUBJECT||subject;
      slots.ADJECTIVE=adjective;
      slots.BE=slots.BE||M?.beFor?.(subject)||"am";
    }

    if(candidate.nounPhrase && !slots.NOUN_PHRASE){
      slots.NOUN_PHRASE=candidate.nounPhrase;
    }

    applySlotCandidates(slots,candidate,lexicalTargets);

    const english=HMW.Dialogue.renderSentencePattern?.(candidate.pattern,slots)||"";
    return {
      meaningId,
      ok:!!english,
      patternId:candidate.pattern||null,
      english:english && /[.!?]$/.test(english)?english:english+".",
      slots,
      source:"generation_spec"
    };
  };
})();