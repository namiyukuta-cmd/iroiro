(() => {
  "use strict";

  window.HMW = window.HMW || {};

  const npcData = {
    templates: {
      police: {
        category: "police",
        relationshipEnabled: true,
        defaultRelationship: {
          familiarity: 0,
          trust: 0,
          goodwill: 0,
          caution: 0,
          irritation: 0
        },
        possibleActions: [
          "patrol",
          "observe",
          "question",
          "warn",
          "move_along",
          "intervene"
        ]
      },

      volunteer: {
        category: "support",
        relationshipEnabled: true,
        defaultRelationship: {
          familiarity: 0,
          trust: 0,
          goodwill: 0
        },
        possibleActions: [
          "talk",
          "give_information",
          "offer_food_support",
          "offer_hygiene_support",
          "offer_small_job"
        ]
      },

      homeless: {
        category: "homeless",
        relationshipEnabled: true,
        defaultRelationship: {
          familiarity: 0,
          trust: 0,
          goodwill: 0,
          caution: 0
        },
        possibleActions: [
          "talk",
          "share_information",
          "trade",
          "ask_favor",
          "warn_about_area"
        ]
      },

      thug: {
        category: "danger",
        relationshipEnabled: false,
        possibleActions: [
          "loiter",
          "intimidate",
          "demand_money",
          "follow",
          "start_conflict"
        ]
      },

      shopClerk: {
        category: "shop",
        relationshipEnabled: true,
        defaultRelationship: {
          familiarity: 0,
          trust: 0,
          goodwill: 0,
          annoyance: 0
        },
        possibleActions: [
          "sell",
          "talk",
          "ask_to_leave",
          "ignore",
          "offer_leftovers",
          "offer_small_job"
        ]
      },

      laborStaff: {
        category: "work",
        relationshipEnabled: true,
        defaultRelationship: {
          familiarity: 0,
          trust: 0,
          goodwill: 0
        },
        possibleActions: [
          "talk",
          "give_job_information",
          "offer_job",
          "refuse_job"
        ]
      },

      recycler: {
        category: "trade",
        relationshipEnabled: true,
        defaultRelationship: {
          familiarity: 0,
          trust: 0,
          goodwill: 0
        },
        possibleActions: [
          "buy_scrap",
          "talk",
          "give_information"
        ]
      },

      passerby: {
        category: "ambient",
        relationshipEnabled: false,
        possibleActions: [
          "pass_by",
          "react_to_begging",
          "avoid",
          "brief_talk"
        ]
      },

      resident: {
        category: "resident",
        relationshipEnabled: false,
        possibleActions: [
          "pass_by",
          "watch",
          "complain",
          "call_police",
          "ignore"
        ]
      }
    },

    persistent: {
      police_a: {
        displayName: "警官A",
        templateId: "police",
        named: false,
        role: "巡回警官",
        locations: ["station_front", "shopping_street"],
        timeSlots: ["morning", "daytime", "evening"],
        notes: "駅前と商店街をよく巡回する。"
      },

      police_b: {
        displayName: "警官B",
        templateId: "police",
        named: false,
        role: "巡回警官",
        locations: ["park", "residential_alley"],
        timeSlots: ["daytime", "evening", "night"],
        notes: "公園や住宅街を巡回することが多い。"
      },

      police_c: {
        displayName: "警官C",
        templateId: "police",
        named: false,
        role: "巡回警官",
        locations: ["industrial_street", "riverside"],
        timeSlots: ["evening", "night", "lateNight"],
        notes: "工業地区と川沿いを巡回する。"
      },

      charity_staff: {
        displayName: "支援員",
        templateId: "volunteer",
        named: false,
        role: "支援施設スタッフ",
        locations: ["charity_center"],
        timeSlots: ["morning", "daytime", "evening"]
      },

      labor_staff: {
        displayName: "職業相談所の職員",
        templateId: "laborStaff",
        named: false,
        role: "仕事紹介担当",
        locations: ["labor_office"],
        timeSlots: ["morning", "daytime"]
      },

      convenience_clerk: {
        displayName: "コンビニ店員",
        templateId: "shopClerk",
        named: false,
        role: "店員",
        locations: ["convenience_store"],
        timeSlots: ["morning", "daytime", "evening", "night", "lateNight"],
        notes: "顔を合わせる回数によって態度が変わる余地がある。"
      },

      recycler_staff: {
        displayName: "廃品回収所の人",
        templateId: "recycler",
        named: false,
        role: "買取担当",
        locations: ["recycling_yard"],
        timeSlots: ["morning", "daytime", "evening"]
      },

      homeless_a: {
        displayName: "ホームレスA",
        templateId: "homeless",
        named: false,
        role: "路上生活者",
        locations: ["park", "underpass"],
        timeSlots: ["morning", "evening", "night", "lateNight"],
        notes: "周辺の危険や炊き出しなどの情報源になり得る。"
      },

      homeless_b: {
        displayName: "ホームレスB",
        templateId: "homeless",
        named: false,
        role: "路上生活者",
        locations: ["station_front", "shopping_street", "park"],
        timeSlots: ["morning", "daytime", "evening"]
      }
    },

    ambientByLocation: {
      station_front: ["passerby", "police", "homeless"],
      shopping_street: ["passerby", "resident", "police"],
      convenience_store: ["shopClerk", "passerby"],
      park: ["homeless", "passerby", "resident", "thug"],
      underpass: ["homeless", "thug"],
      riverside: ["homeless", "thug", "passerby"],
      charity_center: ["volunteer", "homeless"],
      labor_office: ["laborStaff", "homeless"],
      public_toilet: ["passerby", "homeless"],
      residential_alley: ["resident", "police", "homeless"],
      industrial_street: ["passerby", "thug", "police"],
      recycling_yard: ["recycler", "homeless"],
      police_station: ["police"]
    },

    special: {
      loveInterestNpcId: null
    }
  };

  const clone = (value) => JSON.parse(JSON.stringify(value));

  const buildNpc = (npcId, npc) => {
    const template = npcData.templates[npc.templateId] || {};
    return {
      id: npcId,
      ...clone(template),
      ...clone(npc),
      relationship: template.relationshipEnabled
        ? clone(template.defaultRelationship || {})
        : null
    };
  };

  window.HMW.npcData = npcData;

  window.HMW.getNpc = (npcId) => {
    const npc = npcData.persistent[npcId];
    return npc ? buildNpc(npcId, npc) : null;
  };

  window.HMW.getNpcsAtLocation = (locationId, timeSlot = null) => {
    return Object.entries(npcData.persistent)
      .filter(([, npc]) => npc.locations.includes(locationId))
      .filter(([, npc]) => !timeSlot || npc.timeSlots.includes(timeSlot))
      .map(([npcId, npc]) => buildNpc(npcId, npc));
  };

  window.HMW.getAmbientNpcTypes = (locationId) => {
    return clone(npcData.ambientByLocation[locationId] || []);
  };
})();
