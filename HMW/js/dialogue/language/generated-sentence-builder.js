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
    const target=words.find(w=>lexicalTargets.includes(w));
    return target || words[0];
  };

  HMW.Dialogue.buildGeneratedMeaning=function buildGeneratedMeaning(
    meaningId,{variantSeed=0,lexicalTargets=[]}={}
  ){
    const spec=HMW.Dialogue.GENERATION_SPECS?.[String(meaningId||"")];
    if(!spec) return null;
    const candidate=choose(spec.candidates||[],variantSeed);
    if(!candidate) return null;
    if(candidate.surfaceOverride){
      return {meaningId,ok:true,patternId:candidate.pattern||null,english:candidate.surfaceOverride,source:"generation_spec"};
    }

    const verb=chooseWord(candidate.verbs,lexicalTargets);
    const adjective=chooseWord(candidate.adjectives,lexicalTargets);
    const subject=candidate.subject||"I";
    const M=HMW.Dialogue.Morphology;
    let slots={};

    if(verb){
      const pattern=candidate.pattern||"PRESENT_SIMPLE_SVO";
      if(pattern==="PRESENT_SIMPLE_SVO"){
        slots=HMW.Dialogue.fillVerbSlots({subject,verb,object:candidate.object||"",tense:"present"});
      }else if(pattern==="PRESENT_SIMPLE_NEG"){
        slots=HMW.Dialogue.fillVerbSlots({subject,verb,object:candidate.object||"",tense:"present",negative:true});
      }else if(pattern==="PAST_SIMPLE_SVO"){
        slots=HMW.Dialogue.fillVerbSlots({subject,verb,object:candidate.object||"",tense:"past"});
      }else if(pattern==="PAST_SIMPLE_QUESTION"){
        slots={SUBJECT:subject,VERB_BASE:verb,OBJECT:candidate.object||""};
      }else if(pattern==="PRESENT_CONTINUOUS"){
        slots=HMW.Dialogue.fillVerbSlots({subject,verb,object:candidate.object||"",tense:"continuous"});
      }else if(pattern==="FUTURE_SIMPLE" || pattern==="FUTURE_NEG"){
        slots=HMW.Dialogue.fillVerbSlots({subject,verb,object:candidate.object||"",tense:"future"});
      }else{
        slots={SUBJECT:subject,VERB_BASE:verb,VERB:verb,OBJECT:candidate.object||""};
      }
    }

    if(adjective){
      slots.SUBJECT=subject;
      slots.ADJECTIVE=adjective;
      slots.BE=M?.beFor?.(subject)||"am";
    }

    if(candidate.nounPhrase) slots.NOUN_PHRASE=candidate.nounPhrase;
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
