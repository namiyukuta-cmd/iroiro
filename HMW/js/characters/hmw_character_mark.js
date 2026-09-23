(() => {
  "use strict";
  window.HMW = window.HMW || {};
  HMW.CHARACTERS = HMW.CHARACTERS || {};

  const character = {
    id: "police_named",
    key: "mark",
    name: "マーク",
    role: "警察官",
    romance: true,
    core: {
      principle: "職務上の警戒と個人的関心を同時に持てる。規則を曲げて便宜を図る人物にはせず、私情が出るほど自制との葛藤が強くなる。",
      wants: ["主人公が危険を避けてほしい", "自分の言葉を信頼してほしい", "職務外の一面も知ってもらいたい"],
      fears: ["職務判断を私情で歪めること", "主人公に権力で迫ったと思われること", "守れなかった結果を背負うこと"]
    },
    psychologySeed: {
      romanticOpenness: 48, readinessForLove: 54, selfWorth: 72, romanticConfidence: 58,
      deservingLove: 66, perceivedSafety: 52, relationshipHope: 56, rightToAsk: 40,
      needForAutonomy: 70, closenessComfort: 50, repairDrive: 72, patience: 72
    },
    psychologyTraits: {
      rationality: 82, impulseControl: 84, ethicalRigidity: 84, socialCaution: 86, respectForAutonomy: 90,
      possessiveTendency: 50, jealousySensitivity: 50, abandonmentSensitivity: 46, suspicionTendency: 62,
      prideTendency: 62, emotionalExpressiveness: 42, pursuitTendency: 54, romanticBoldness: 48,
      physicalInitiative: 44, intimacyCaution: 82, sexualDirectness: 32, dependencyTendency: 34,
      conflictAvoidance: 40, tendernessTendency: 62, selfEsteemStability: 78, rejectionSensitivityTrait: 46,
      attachmentAnxiety: 40, attachmentAvoidance: 48, autonomyNeedTrait: 76, closenessNeedTrait: 58,
      needToBeNeededTendency: 58, protectivenessTendency: 82, caretakingTendency: 60, receivingCareComfort: 42,
      vulnerabilityTolerance: 42, shameSensitivity: 44, guiltSensitivity: 68, angerReactivity: 46,
      sadnessReactivity: 44, ruminationTendency: 50, forgivenessTendency: 64, grudgeTendency: 38,
      repairTendency: 72, reassuranceNeedTendency: 40, emotionalVolatility: 32, optimismTendency: 58,
      assertiveness: 74, stubbornness: 62, patienceTendency: 72, controlTendency: 48, dominanceTendency: 58,
      accommodationTendency: 48, romanticIdealism: 48, fearOfJudgmentTrait: 68, fearOfRejectionTrait: 46,
      privacyTendency: 72, dutyOrientation: 92, memoryOfHurtPersistence: 52, positiveMemoryBias: 54,
      loveAtFirstSightSusceptibility: 30, slowBurnTendency: 78, familiarityBondingTendency: 72,
      friendshipToLoveTendency: 68, admirationToLoveTendency: 60, physicalAttractionWeight: 52,
      intellectualAttractionWeight: 58, emotionalAttractionWeight: 68, chemistrySensitivity: 52,
      romanticOpennessTrait: 50, preexistingCrushPersistence: 34, noveltySeekingInLove: 34
    }
  };

  HMW.CHARACTERS[character.id] = Object.freeze(character);
})();