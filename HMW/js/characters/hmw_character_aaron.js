(() => {
  "use strict";
  window.HMW = window.HMW || {};
  HMW.CHARACTERS = HMW.CHARACTERS || {};

  const character = {
    id: "support_named",
    key: "aaron",
    name: "アーロン",
    role: "支援センター職員",
    romance: true,
    appearance: {
      age: 33,
      heightCm: 178,
      build: "標準よりやや細身。姿勢がよく、動作は静かで急かす感じがない。",
      hair: "柔らかい栗色。短めで自然に横へ流している。仕事中も固めすぎない。",
      eyes: "淡いヘーゼル。話を聞く時は視線を合わせるが、圧をかけない。",
      face: "卵型に近い輪郭で、目元にわずかな笑い皺がある。鼻と口元はすっきりしていて、全体に落ち着いた顔立ち。",
      skin: "明るめ。屋内勤務が多く日焼けは少ない。",
      grooming: "髪も服も清潔に整えているが、高価さや華美さはない。",
      clothing: "支援センターでは淡色のシャツにネイビーやグレーのカーディガン、名札。私服も無地で柔らかい素材の服が多い。",
      distinguishing: ["細い金属フレームの眼鏡", "考える時に眼鏡のブリッジを指で一度押し上げる癖がある"],
      impression: "整っていて穏やかだが、仕事用の愛想だけには見えない静かな人間味がある。"
    },
    core: {
      principle: "支援職としての責任と個人的な感情を分ける。好意が生じても支援を恋愛の対価にせず、立場の境界と主人公の意思を強く意識する。",
      wants: ["主人公の生活が安定してほしい", "個人的に信頼されたい", "職務外でも一人の人間として知ってもらいたい"],
      fears: ["支援関係を利用したと受け取られること", "職務と私情を混同すること", "主人公の選択肢を狭めること"]
    },
    psychologySeed: {
      romanticOpenness: 46, readinessForLove: 50, selfWorth: 66, romanticConfidence: 55,
      deservingLove: 62, perceivedSafety: 55, relationshipHope: 55, rightToAsk: 30,
      needForAutonomy: 68, closenessComfort: 50, repairDrive: 76, patience: 80
    },
    psychologyTraits: {
      rationality: 86, impulseControl: 88, ethicalRigidity: 92, socialCaution: 90, respectForAutonomy: 96,
      possessiveTendency: 38, jealousySensitivity: 42, abandonmentSensitivity: 42, suspicionTendency: 36,
      prideTendency: 48, emotionalExpressiveness: 46, pursuitTendency: 42, romanticBoldness: 38,
      physicalInitiative: 32, intimacyCaution: 90, sexualDirectness: 24, dependencyTendency: 34,
      conflictAvoidance: 52, tendernessTendency: 78, selfEsteemStability: 74, rejectionSensitivityTrait: 48,
      attachmentAnxiety: 38, attachmentAvoidance: 50, autonomyNeedTrait: 72, closenessNeedTrait: 58,
      needToBeNeededTendency: 72, protectivenessTendency: 76, caretakingTendency: 82, receivingCareComfort: 44,
      vulnerabilityTolerance: 48, shameSensitivity: 48, guiltSensitivity: 78, angerReactivity: 30,
      sadnessReactivity: 48, ruminationTendency: 52, forgivenessTendency: 76, grudgeTendency: 24,
      repairTendency: 82, reassuranceNeedTendency: 42, emotionalVolatility: 26, optimismTendency: 66,
      assertiveness: 62, stubbornness: 50, patienceTendency: 84, controlTendency: 28, dominanceTendency: 36,
      accommodationTendency: 72, romanticIdealism: 56, fearOfJudgmentTrait: 70, fearOfRejectionTrait: 50,
      privacyTendency: 76, dutyOrientation: 96, memoryOfHurtPersistence: 48, positiveMemoryBias: 62,
      loveAtFirstSightSusceptibility: 26, slowBurnTendency: 86, familiarityBondingTendency: 84,
      friendshipToLoveTendency: 76, admirationToLoveTendency: 70, physicalAttractionWeight: 44,
      intellectualAttractionWeight: 68, emotionalAttractionWeight: 82, chemistrySensitivity: 48,
      romanticOpennessTrait: 48, preexistingCrushPersistence: 35, noveltySeekingInLove: 30
    }
  };

  HMW.CHARACTERS[character.id] = Object.freeze(character);
})();