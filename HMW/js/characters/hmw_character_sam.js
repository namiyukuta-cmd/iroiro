(() => {
  "use strict";
  window.HMW = window.HMW || {};
  HMW.CHARACTERS = HMW.CHARACTERS || {};

  const character = {
    id: "homeless_named",
    key: "sam",
    name: "サム",
    role: "高架下で暮らす男",
    romance: true,
    core: {
      principle: "路上生活の現実感と自尊心を持ち、助けられるだけの人物にはしない。親しくなるほど、自分から会話・心配・接近を増やす。",
      wants: ["主人公と対等に扱われたい", "頼られるだけでなく自分も頼りたい", "安全に一緒に過ごせる時間を増やしたい", "選ばれている確信がほしい"],
      fears: ["突然いなくなられること", "憐れみだけで近づかれること", "自分の生活状況が関係の負担になること"]
    },
    psychologySeed: {
      romanticOpenness: 62, readinessForLove: 58, selfWorth: 48, romanticConfidence: 46,
      deservingLove: 50, perceivedSafety: 48, relationshipHope: 58, rightToAsk: 48,
      needForAutonomy: 58, closenessComfort: 58, repairDrive: 68, patience: 58
    },
    psychologyTraits: {
      rationality: 56, impulseControl: 60, ethicalRigidity: 55, socialCaution: 48, respectForAutonomy: 78,
      possessiveTendency: 64, jealousySensitivity: 64, abandonmentSensitivity: 72, suspicionTendency: 46,
      prideTendency: 54, emotionalExpressiveness: 60, pursuitTendency: 66, romanticBoldness: 61,
      physicalInitiative: 62, intimacyCaution: 55, sexualDirectness: 46, dependencyTendency: 60,
      conflictAvoidance: 50, tendernessTendency: 72, selfEsteemStability: 48, rejectionSensitivityTrait: 66,
      attachmentAnxiety: 68, attachmentAvoidance: 44, autonomyNeedTrait: 58, closenessNeedTrait: 78,
      needToBeNeededTendency: 65, protectivenessTendency: 68, caretakingTendency: 60, receivingCareComfort: 58,
      vulnerabilityTolerance: 55, shameSensitivity: 44, guiltSensitivity: 50, angerReactivity: 50,
      sadnessReactivity: 65, ruminationTendency: 62, forgivenessTendency: 68, grudgeTendency: 40,
      repairTendency: 76, reassuranceNeedTendency: 64, emotionalVolatility: 54, optimismTendency: 52,
      assertiveness: 58, stubbornness: 52, patienceTendency: 60, controlTendency: 44, dominanceTendency: 46,
      accommodationTendency: 60, romanticIdealism: 58, fearOfJudgmentTrait: 46, fearOfRejectionTrait: 66,
      privacyTendency: 50, dutyOrientation: 44, memoryOfHurtPersistence: 60, positiveMemoryBias: 62,
      loveAtFirstSightSusceptibility: 42, slowBurnTendency: 82, familiarityBondingTendency: 84,
      friendshipToLoveTendency: 82, admirationToLoveTendency: 50, physicalAttractionWeight: 58,
      intellectualAttractionWeight: 48, emotionalAttractionWeight: 78, chemistrySensitivity: 66,
      romanticOpennessTrait: 62, preexistingCrushPersistence: 45, noveltySeekingInLove: 44
    }
  };

  HMW.CHARACTERS[character.id] = Object.freeze(character);
})();