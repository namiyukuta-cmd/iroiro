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
    appearance: {
      age: 30,
      heightCm: 181,
      build: "細身だが肩と腕には日常的に荷物を運ぶ筋肉がついている。痩せすぎではなく、しなやかな体つき。",
      hair: "くすんだダークブロンド。耳に少しかかる長さで、手ぐしで後ろへ払うことが多い。きれいに整えてはいない。",
      eyes: "灰緑色。普段は警戒して周囲をよく見ているが、笑うと目元が柔らかくなる。",
      face: "頬骨がやや高く、細めの顎。疲れが残る顔立ちだが老け込んではいない。数日分ほどの無精ひげがある。",
      skin: "屋外で過ごす時間が長く、頬や鼻には薄く日焼けと乾燥が見える。",
      grooming: "身なりを完璧に整えられる環境ではないが、洗える時には洗い、髪やひげも最低限は自分で整える。",
      clothing: "色褪せたチャコールのフード付きパーカーに、古いカーキのワークジャケット。濃いデニムと履き込んだ革靴。",
      distinguishing: ["右手の親指の付け根に古い小さな切り傷の跡", "寒い時はワークジャケットの襟を立てる癖がある"],
      impression: "荒んで見せようとはしないが、街で長く暮らしてきた警戒心と生活感が自然に滲む。"
    },
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