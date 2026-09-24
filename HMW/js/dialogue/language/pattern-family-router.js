(() => {
  "use strict";
  window.HMW = window.HMW || {};
  HMW.Dialogue = HMW.Dialogue || {};
  const D = HMW.Dialogue;

  const FAMILIES = {
    PRESENT_SIMPLE_SVO:["PRESENT_SIMPLE_SVO","DECLARATIVE_SVO"],
    PRESENT_SIMPLE_NEG:["PRESENT_SIMPLE_NEG","NEGATIVE_DO_SVO"],
    PAST_SIMPLE_SVO:["PAST_SIMPLE_SVO","PAST_SVO"],
    FUTURE_SIMPLE:["FUTURE_SIMPLE","FUTURE_WILL"],
    FUTURE_NEG:["FUTURE_NEG","FUTURE_WILL_NOT"],
    FEEL_ADJECTIVE:["FEEL_ADJECTIVE","G17_FEELING_I_FEEL_ADJ"],
    REQUEST_PLEASE:["REQUEST_PLEASE","G17_REQUEST_PLEASE"],
    REQUEST_CAN_YOU:["REQUEST_CAN_YOU","G17_REQUEST_CAN_YOU","G17_REQUEST_COULD_YOU","G17_REQUEST_WOULD_YOU","G17_REQUEST_WILL_YOU"],
    OFFER_CAN_I:["OFFER_CAN_I","OFFER_SHALL_I_ACTION","OFFER_WOULD_YOU_LIKE_ME_TO"],
    SUGGEST_LETS:["SUGGEST_LETS","SUGGEST_LETS_ACTION","G17_INVITE_LETS","G17_INVITE_SHALL_WE","G17_INVITE_WE_COULD"],
    WANT_TO_PATTERN:["WANT_TO_PATTERN","G17_PLAN_IM_PLANNING_TO","G17_PLAN_I_INTEND_TO","G17_PLAN_I_MIGHT"]
  };

  const pick=(items,seed=0)=>items[Math.abs(Number(seed)||0)%items.length];

  D.getPatternFamily = function getPatternFamily(patternId){
    return (FAMILIES[patternId] || [patternId]).filter(id=>D.SENTENCE_PATTERNS?.[id]);
  };

  D.buildRoutedMeaning = function buildRoutedMeaning(
    meaningId,{variantSeed=0,lexicalTargets=[],slotOverrides={}}={}
  ){
    const spec=D.GENERATION_SPECS?.[String(meaningId||"")];
    const candidates=spec?.candidates||[];
    if(!candidates.length || typeof D.buildSentenceFromPattern!=="function") return null;

    const usable=candidates.filter(c=>!c.surfaceOverride && c.pattern && D.SENTENCE_PATTERNS?.[c.pattern]);
    if(!usable.length) return null;

    const candidate=pick(usable,variantSeed);
    const family=D.getPatternFamily(candidate.pattern);
    const patternId=pick(family,variantSeed+1);

    const preferred=[
      ...(candidate.verbs||[]),
      ...(candidate.adjectives||[]),
      ...(lexicalTargets||[])
    ];

    const slots={
      ...(candidate.slots||{}),
      ...(candidate.subject?{SUBJECT:candidate.subject}:{}),
      ...(candidate.object!==undefined?{OBJECT:candidate.object}:{}),
      ...slotOverrides
    };

    const built=D.buildSentenceFromPattern(patternId,{
      slotOverrides:slots,
      lexicalTargets:preferred,
      subject:candidate.subject||slots.SUBJECT||"I",
      seed:variantSeed,
      fillOptional:false
    });

    if(!built?.ok || !built.english) return null;
    return {
      meaningId,
      ok:true,
      patternId,
      english:built.english,
      slots:built.slots,
      source:"pattern_family_router"
    };
  };
})();