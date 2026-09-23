(() => {
  "use strict";
  window.HMW = window.HMW || {};
  HMW.CHARACTERS = HMW.CHARACTERS || {};

  const character = {
    id: "thug_named",
    key: "leon",
    name: "レオン",
    role: "工業通りの男",
    romance: true,
    appearance: {
      age: 31,
      heightCm: 183,
      build: "細身寄りの筋肉質。肩と背中に厚みがあり、立っているだけでも身体の使い方に慣れていることが分かる。",
      hair: "黒に近いダークブラウン。横は短く、上は少し長めで無造作に流している。",
      eyes: "濃い琥珀色。警戒している時ほど目だけで相手の動きを追う。",
      face: "やや鋭い眉、深めの目元、骨ばった顎。左眉を横切る短い傷跡がある。薄い無精ひげを残していることが多い。",
      skin: "やや日に焼けている。手や腕には仕事や揉め事でできた細かな傷が残る。",
      grooming: "清潔さには無頓着ではないが、きっちり整えることにも興味がない。髪や髭は自分で適当に切る。",
      clothing: "黒いワークジャケット、色褪せたTシャツ、暗色のカーゴパンツ、重いワークブーツ。装飾品はほとんど着けない。",
      distinguishing: ["左眉の短い傷跡", "右前腕の内側に小さな古い黒インクのタトゥー"],
      impression: "派手な格好ではないのに、視線と立ち方のせいで人混みでも見つけやすい。"
    },
    core: {
      principle: "利益・縄張り・警戒心を持つ危うい人物。好意が生じても安全な支援者へ急変させず、独占欲・疑い・欲求と主人公の明確な拒絶を止まる線として同時に扱う。",
      wants: ["自分を恐れるだけではなく一人の人間として見られたい", "主人公の注意を他人より自分へ向けたい", "自分の縄張りでは自分を頼ってほしい"],
      fears: ["弱みを握られること", "利用されて捨てられること", "競争相手に奪われること"]
    },
    psychologySeed: {
      romanticOpenness: 58, readinessForLove: 42, selfWorth: 62, romanticConfidence: 68,
      deservingLove: 58, perceivedSafety: 34, relationshipHope: 40, rightToAsk: 70,
      needForAutonomy: 82, closenessComfort: 40, repairDrive: 48, patience: 34
    },
    psychologyTraits: {
      rationality: 46, impulseControl: 38, ethicalRigidity: 24, socialCaution: 44, respectForAutonomy: 48,
      possessiveTendency: 88, jealousySensitivity: 86, abandonmentSensitivity: 72, suspicionTendency: 82,
      prideTendency: 88, emotionalExpressiveness: 54, pursuitTendency: 84, romanticBoldness: 82,
      physicalInitiative: 84, intimacyCaution: 34, sexualDirectness: 74, dependencyTendency: 52,
      conflictAvoidance: 22, tendernessTendency: 38, selfEsteemStability: 58, rejectionSensitivityTrait: 72,
      attachmentAnxiety: 68, attachmentAvoidance: 66, autonomyNeedTrait: 84, closenessNeedTrait: 70,
      needToBeNeededTendency: 62, protectivenessTendency: 56, caretakingTendency: 34, receivingCareComfort: 34,
      vulnerabilityTolerance: 28, shameSensitivity: 38, guiltSensitivity: 28, angerReactivity: 84,
      sadnessReactivity: 46, ruminationTendency: 70, forgivenessTendency: 40, grudgeTendency: 76,
      repairTendency: 50, reassuranceNeedTendency: 58, emotionalVolatility: 74, optimismTendency: 42,
      assertiveness: 88, stubbornness: 86, patienceTendency: 32, controlTendency: 86, dominanceTendency: 90,
      accommodationTendency: 24, romanticIdealism: 34, fearOfJudgmentTrait: 36, fearOfRejectionTrait: 72,
      privacyTendency: 66, dutyOrientation: 30, memoryOfHurtPersistence: 78, positiveMemoryBias: 38,
      loveAtFirstSightSusceptibility: 62, slowBurnTendency: 48, familiarityBondingTendency: 56,
      friendshipToLoveTendency: 38, admirationToLoveTendency: 34, physicalAttractionWeight: 78,
      intellectualAttractionWeight: 42, emotionalAttractionWeight: 48, chemistrySensitivity: 82,
      romanticOpennessTrait: 56, preexistingCrushPersistence: 42, noveltySeekingInLove: 72
    }
  };

  HMW.CHARACTERS[character.id] = Object.freeze(character);
})();