(() => {
  "use strict";

  window.HMW = window.HMW || {};

  const worldData = {
    cityName: null,
    defaultStartLocationId: "station_front",

    timeSlots: {
      morning: { label: "朝", order: 0 },
      daytime: { label: "昼", order: 1 },
      evening: { label: "夕方", order: 2 },
      night: { label: "夜", order: 3 },
      lateNight: { label: "深夜", order: 4 }
    },

    weather: {
      clear: { label: "晴れ", wetnessRisk: 0, coldRisk: 0 },
      cloudy: { label: "曇り", wetnessRisk: 0, coldRisk: 0 },
      rain: { label: "雨", wetnessRisk: 2, coldRisk: 1 },
      heavyRain: { label: "大雨", wetnessRisk: 3, coldRisk: 2 },
      cold: { label: "寒い", wetnessRisk: 0, coldRisk: 2 }
    },

    districts: {
      central: { name: "中心街" },
      residential: { name: "住宅街" },
      riverside: { name: "川沿い" },
      industrial: { name: "工業地区" }
    },

    locations: {
      station_front: {
        name: "駅前",
        districtId: "central",
        type: "street",
        indoor: false,
        unlockedFromStart: true,
        connections: ["shopping_street", "park", "labor_office", "police_station"],
        services: {
          begging: true,
          dumpster: true,
          toilet: false,
          wash: false,
          foodSupport: false,
          work: false,
          buy: true,
          sell: false,
          sleep: false
        },
        risks: {
          police: 3,
          thugs: 1,
          theft: 1,
          weatherExposure: 3
        }
      },

      shopping_street: {
        name: "商店街",
        districtId: "central",
        type: "street",
        indoor: false,
        unlockedFromStart: true,
        connections: ["station_front", "convenience_store", "public_toilet", "residential_alley"],
        services: {
          begging: true,
          dumpster: true,
          toilet: false,
          wash: false,
          foodSupport: false,
          work: false,
          buy: true,
          sell: false,
          sleep: false
        },
        risks: {
          police: 2,
          thugs: 1,
          theft: 1,
          weatherExposure: 3
        }
      },

      convenience_store: {
        name: "コンビニ",
        districtId: "central",
        type: "shop",
        indoor: true,
        unlockedFromStart: true,
        connections: ["shopping_street"],
        services: {
          begging: false,
          dumpster: true,
          toilet: false,
          wash: false,
          foodSupport: false,
          work: false,
          buy: true,
          sell: false,
          sleep: false
        },
        risks: {
          police: 1,
          thugs: 0,
          theft: 0,
          weatherExposure: 0
        }
      },

      park: {
        name: "公園",
        districtId: "residential",
        type: "outdoor",
        indoor: false,
        unlockedFromStart: true,
        connections: ["station_front", "underpass", "charity_center", "public_toilet"],
        services: {
          begging: true,
          dumpster: true,
          toilet: false,
          wash: false,
          foodSupport: false,
          work: false,
          buy: false,
          sell: false,
          sleep: true
        },
        risks: {
          police: 1,
          thugs: 1,
          theft: 1,
          weatherExposure: 3
        }
      },

      underpass: {
        name: "高架下",
        districtId: "riverside",
        type: "shelter",
        indoor: false,
        unlockedFromStart: true,
        connections: ["park", "riverside", "recycling_yard"],
        services: {
          begging: false,
          dumpster: false,
          toilet: false,
          wash: false,
          foodSupport: false,
          work: false,
          buy: false,
          sell: false,
          sleep: true
        },
        risks: {
          police: 1,
          thugs: 3,
          theft: 2,
          weatherExposure: 1
        }
      },

      riverside: {
        name: "川沿い",
        districtId: "riverside",
        type: "outdoor",
        indoor: false,
        unlockedFromStart: true,
        connections: ["underpass", "industrial_street"],
        services: {
          begging: false,
          dumpster: true,
          toilet: false,
          wash: false,
          foodSupport: false,
          work: false,
          buy: false,
          sell: false,
          sleep: true
        },
        risks: {
          police: 0,
          thugs: 2,
          theft: 2,
          weatherExposure: 3
        }
      },

      charity_center: {
        name: "支援施設",
        districtId: "residential",
        type: "support",
        indoor: true,
        unlockedFromStart: true,
        connections: ["park", "residential_alley"],
        services: {
          begging: false,
          dumpster: false,
          toilet: true,
          wash: true,
          foodSupport: true,
          work: true,
          buy: false,
          sell: false,
          sleep: false
        },
        risks: {
          police: 0,
          thugs: 0,
          theft: 0,
          weatherExposure: 0
        }
      },

      labor_office: {
        name: "職業相談所",
        districtId: "central",
        type: "public_service",
        indoor: true,
        unlockedFromStart: true,
        connections: ["station_front"],
        services: {
          begging: false,
          dumpster: false,
          toilet: false,
          wash: false,
          foodSupport: false,
          work: true,
          buy: false,
          sell: false,
          sleep: false
        },
        risks: {
          police: 0,
          thugs: 0,
          theft: 0,
          weatherExposure: 0
        }
      },

      public_toilet: {
        name: "公衆トイレ",
        districtId: "central",
        type: "facility",
        indoor: true,
        unlockedFromStart: true,
        connections: ["shopping_street", "park"],
        services: {
          begging: false,
          dumpster: false,
          toilet: true,
          wash: true,
          foodSupport: false,
          work: false,
          buy: false,
          sell: false,
          sleep: false
        },
        risks: {
          police: 0,
          thugs: 0,
          theft: 1,
          weatherExposure: 0
        }
      },

      residential_alley: {
        name: "住宅街の路地",
        districtId: "residential",
        type: "street",
        indoor: false,
        unlockedFromStart: true,
        connections: ["shopping_street", "charity_center"],
        services: {
          begging: false,
          dumpster: true,
          toilet: false,
          wash: false,
          foodSupport: false,
          work: false,
          buy: false,
          sell: false,
          sleep: true
        },
        risks: {
          police: 2,
          thugs: 1,
          theft: 1,
          weatherExposure: 2
        }
      },

      industrial_street: {
        name: "工業地区",
        districtId: "industrial",
        type: "street",
        indoor: false,
        unlockedFromStart: true,
        connections: ["riverside", "recycling_yard"],
        services: {
          begging: false,
          dumpster: true,
          toilet: false,
          wash: false,
          foodSupport: false,
          work: true,
          buy: false,
          sell: false,
          sleep: false
        },
        risks: {
          police: 1,
          thugs: 2,
          theft: 1,
          weatherExposure: 3
        }
      },

      recycling_yard: {
        name: "廃品回収所",
        districtId: "industrial",
        type: "shop",
        indoor: true,
        unlockedFromStart: true,
        connections: ["underpass", "industrial_street"],
        services: {
          begging: false,
          dumpster: false,
          toilet: false,
          wash: false,
          foodSupport: false,
          work: false,
          buy: false,
          sell: true,
          sleep: false
        },
        risks: {
          police: 0,
          thugs: 1,
          theft: 0,
          weatherExposure: 0
        }
      },

      police_station: {
        name: "警察署",
        districtId: "central",
        type: "public_service",
        indoor: true,
        unlockedFromStart: true,
        connections: ["station_front"],
        services: {
          begging: false,
          dumpster: false,
          toilet: false,
          wash: false,
          foodSupport: false,
          work: false,
          buy: false,
          sell: false,
          sleep: false
        },
        risks: {
          police: 3,
          thugs: 0,
          theft: 0,
          weatherExposure: 0
        }
      }
    }
  };

  const clone = (value) => JSON.parse(JSON.stringify(value));

  window.HMW.worldData = worldData;

  window.HMW.getLocation = (locationId) => {
    const location = worldData.locations[locationId];
    return location ? clone(location) : null;
  };

  window.HMW.getConnectedLocations = (locationId) => {
    const location = worldData.locations[locationId];
    if (!location) return [];

    return location.connections
      .map((id) => ({ id, ...clone(worldData.locations[id]) }))
      .filter((locationData) => locationData.name);
  };
})();
