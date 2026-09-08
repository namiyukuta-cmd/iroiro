(() => {
  "use strict";

  window.HMW = window.HMW || {};
  const HMW = window.HMW;

  const clone = (value) => JSON.parse(JSON.stringify(value));

  const loveInterestData = {
    routeLock: false,
    allowMultipleDevelopingRelationships: true,

    definitions: {
      romance_police: {
        displayName: null,
        temporaryLabel: "名前付き警官",
        category: "police",
        role: "巡回警官",
        knownFromStart: false,
        locations: ["station_front", "shopping_street", "park", "residential_alley", "police_station"],
        timeSlots: ["morning", "daytime", "evening", "night"],
        personality: [
          "職業柄、疑い深く慎重。",
          "感情を表に出しにくく、怒っているように見られることがある。",
          "根は単純なところもあるが、職業倫理で自制する。",
          "主人公に惹かれても、警官としての警戒や判断を捨てない。"
        ],
        relationshipRules: [
          "好意が上がっても警官としての立場は消えない。",
          "主人公を簡単に信用しない。",
          "保護欲だけで主人公を自宅へ連れて行くような安易な行動はしない。",
          "職務と私情が衝突した場合、その葛藤を残す。"
        ],
        defaultRelationship: {
          familiarity: 0,
          trust: 0,
          goodwill: 0,
          attraction: 0,
          concern: 0,
          caution: 15,
          irritation: 0,
          closeness: 0
        },
        aiTags: ["love_interest", "police", "duty", "caution", "slow_burn"]
      },

      romance_homeless: {
        displayName: null,
        temporaryLabel: "名前付きホームレス",
        category: "homeless",
        role: "路上生活者",
        knownFromStart: false,
        locations: ["station_front", "park", "underpass", "riverside"],
        timeSlots: ["morning", "daytime", "evening", "night", "lateNight"],
        personality: [
          "路上生活の現実をよく知っている。",
          "自分の食料、寝床、情報、人間関係を守る意識が強い。",
          "親切にすることはあっても、主人公のためだけに生きている人物ではない。",
          "同じ立場だからこそ分かり合える部分と、資源を奪い合う緊張の両方がある。"
        ],
        relationshipRules: [
          "主人公に何でも譲らない。",
          "自分自身の空腹、安全、寝床、予定を優先することがある。",
          "信頼が育つまでは重要な情報や安全な寝床を簡単には教えない。",
          "親しくなっても依存一辺倒にはしない。"
        ],
        defaultRelationship: {
          familiarity: 0,
          trust: 0,
          goodwill: 0,
          attraction: 0,
          concern: 0,
          caution: 10,
          irritation: 0,
          closeness: 0
        },
        aiTags: ["love_interest", "homeless", "survival", "mutuality", "slow_burn"]
      },

      romance_support: {
        displayName: null,
        temporaryLabel: "名前付き支援員",
        category: "support",
        role: "支援関係者",
        knownFromStart: false,
        locations: ["charity_center", "park", "station_front"],
        timeSlots: ["morning", "daytime", "evening"],
        personality: [
          "人を助けることには慣れているが、相手の人生を代わりに背負おうとはしない。",
          "穏やかでも、必要な時には断る。",
          "主人公に同情だけで接しない。",
          "私情が生まれた場合、支援する側とされる側という関係を意識する。"
        ],
        relationshipRules: [
          "支援を恋愛の見返りにしない。",
          "好意があっても職務上の境界を簡単には越えない。",
          "主人公が支援を拒めば、その意思を尊重する。",
          "助けられることと助けられないことを区別する。"
        ],
        defaultRelationship: {
          familiarity: 0,
          trust: 0,
          goodwill: 5,
          attraction: 0,
          concern: 5,
          caution: 5,
          irritation: 0,
          closeness: 0
        },
        aiTags: ["love_interest", "support", "boundaries", "care", "slow_burn"]
      },

      romance_thug: {
        displayName: null,
        temporaryLabel: "名前付き不良",
        category: "thug",
        role: "街の不良",
        knownFromStart: false,
        locations: ["park", "underpass", "riverside", "industrial_street"],
        timeSlots: ["evening", "night", "lateNight"],
        personality: [
          "縄張り意識が強く、他人を簡単には信用しない。",
          "仲間内の立場や面子を気にする。",
          "主人公に興味を持っても、それだけで危険性や荒さが消える人物ではない。",
          "気まぐれな親切と威圧が同居する余地がある。"
        ],
        relationshipRules: [
          "恋愛相手だからといって最初から安全な人物にしない。",
          "主人公への好意だけで仲間や縄張りを捨てない。",
          "怒り、警戒、嫉妬、面子などの負の感情も保持する。",
          "主人公が逆らえば必ず喜ぶ、という都合の良い反応にしない。"
        ],
        defaultRelationship: {
          familiarity: 0,
          trust: 0,
          goodwill: 0,
          attraction: 0,
          concern: 0,
          caution: 20,
          irritation: 5,
          closeness: 0
        },
        aiTags: ["love_interest", "thug", "danger", "territory", "slow_burn"]
      }
    }
  };

  const buildLoveInterest = (id, data) => {
    const copy = clone(data);
    return {
      id,
      named: true,
      romanceCandidate: true,
      ...copy,
      displayName: copy.displayName || copy.temporaryLabel || copy.role || "人物"
    };
  };

  const ensureRelationship = (id) => {
    const data = loveInterestData.definitions[id];
    if (!data) return null;

    if (!HMW.state.relationships[id]) {
      HMW.state.relationships[id] = clone(data.defaultRelationship);
    }

    return HMW.state.relationships[id];
  };

  const getLoveInterest = (id) => {
    const data = loveInterestData.definitions[id];
    return data ? buildLoveInterest(id, data) : null;
  };

  const getLoveInterestsAtLocation = (locationId, timeSlot = null) => {
    return Object.entries(loveInterestData.definitions)
      .filter(([, data]) => data.locations.includes(locationId))
      .filter(([, data]) => !timeSlot || data.timeSlots.includes(timeSlot))
      .map(([id, data]) => buildLoveInterest(id, data));
  };

  const setLoveInterestName = (id, name) => {
    const data = loveInterestData.definitions[id];
    if (!data) return false;

    const trimmed = String(name || "").trim();
    data.displayName = trimmed || null;
    return true;
  };

  const getLoveInterestAIContext = (id) => {
    const npc = getLoveInterest(id);
    if (!npc) return null;

    return {
      id: npc.id,
      name: npc.displayName,
      category: npc.category,
      role: npc.role,
      personality: clone(npc.personality),
      relationshipRules: clone(npc.relationshipRules),
      relationship: clone(ensureRelationship(id)),
      aiTags: clone(npc.aiTags)
    };
  };

  window.HMW.loveInterestData = loveInterestData;
  window.HMW.getLoveInterest = getLoveInterest;
  window.HMW.getLoveInterestsAtLocation = getLoveInterestsAtLocation;
  window.HMW.ensureLoveInterestRelationship = ensureRelationship;
  window.HMW.setLoveInterestName = setLoveInterestName;
  window.HMW.getLoveInterestAIContext = getLoveInterestAIContext;
})();