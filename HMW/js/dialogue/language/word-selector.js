(() => {
  "use strict";
  window.HMW = window.HMW || {};
  HMW.Dialogue = HMW.Dialogue || {};

  const scoreEntry=(entry,{pos,tags=[],concepts=[],preferred=[]}={})=>{
    let score=0;
    if (pos && entry.pos===pos) score+=20;
    const etags=Array.isArray(entry.tags)?entry.tags:[];
    for(const tag of tags) if(etags.includes(tag)) score+=4;
    for(const concept of concepts) if(etags.includes(concept) || entry.lemma===concept) score+=3;
    if(preferred.includes(entry.lemma)) score+=12;
    return score;
  };

  HMW.Dialogue.selectVocabulary=function selectVocabulary({
    pos=null,tags=[],concepts=[],preferred=[],limit=10
  }={}){
    const entries=HMW.Dialogue.Vocabulary?.entries || [];
    return entries
      .filter(entry=>!pos || entry.pos===pos)
      .map(entry=>({entry,score:scoreEntry(entry,{pos,tags,concepts,preferred})}))
      .sort((a,b)=>b.score-a.score || a.entry.lemma.localeCompare(b.entry.lemma))
      .slice(0,Math.max(1,Number(limit)||10))
      .map(item=>item.entry);
  };

  HMW.Dialogue.fillVerbSlots=function fillVerbSlots({
    subject="I",verb,object="",tense="present",negative=false
  }={}){
    const M=HMW.Dialogue.Morphology;
    if(!M || !verb) return {};
    if(tense==="past"){
      return negative
        ? {SUBJECT:subject,VERB_BASE:verb,OBJECT:object,DO_AUX:"did"}
        : {SUBJECT:subject,VERB_PAST:M.verbForm(verb,"past"),OBJECT:object};
    }
    if(tense==="future"){
      return {SUBJECT:subject,VERB_BASE:verb,OBJECT:object};
    }
    if(tense==="continuous"){
      return {SUBJECT:subject,BE:M.beFor(subject),VERB_ING:M.verbForm(verb,"ing"),OBJECT:object};
    }
    if(tense==="perfect"){
      return {SUBJECT:subject,HAVE_AUX:M.haveFor(subject),VERB_PP:M.verbForm(verb,"pp"),OBJECT:object};
    }
    if(negative){
      return {SUBJECT:subject,DO_AUX:M.doFor(subject),VERB_BASE:verb,OBJECT:object};
    }
    const form=/^(he|she|it)$/i.test(subject)?M.verbForm(verb,"third"):verb;
    return {SUBJECT:subject,VERB:form,OBJECT:object};
  };
})();
