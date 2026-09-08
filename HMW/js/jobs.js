(() => {
  "use strict";

  window.HMW = window.HMW || {};

  const jobData = {
    definitions: {
      charity_dog_walk: {
        name: "犬の散歩",
        category: "support",
        locationId: "charity_center",
        providerNpcId: "charity_staff",
        repeatable: true,
        timeSlots: ["morning", "daytime", "evening"],
        requirements: {},
        reward: {
          moneyMin: 50,
          moneyMax: 80,
          items: [],
          relationship: {
            npcId: "charity_staff",
            trust: 1,
            goodwill: 1
          }
        },
        cost: {
          fatigue: 5,
          hunger: 2,
          timeSteps: 1
        },
        notes: "支援施設で頼まれる小さな仕事。"
      },

      street_cleaning: {
        name: "道路清掃",
        category: "temporary",
        locationId: "labor_office",
        providerNpcId: "labor_staff",
        repeatable: true,
        timeSlots: ["morning", "daytime"],
        requirements: {},
        reward: {
          moneyMin: 120,
          moneyMax: 180,
          items: []
        },
        cost: {
          fatigue: 15,
          hunger: 5,
          timeSteps: 2
        },
        notes: "職業相談所から紹介される短時間の清掃仕事。"
      },

      delivery: {
        name: "配達",
        category: "temporary",
        locationId: "labor_office",
        providerNpcId: "labor_staff",
        repeatable: true,
        timeSlots: ["morning", "daytime"],
        requirements: {},
        reward: {
          moneyMin: 150,
          moneyMax: 220,
          items: []
        },
        cost: {
          fatigue: 18,
          hunger: 6,
          timeSteps: 2
        },
        notes: "徒歩で荷物を届ける臨時仕事。"
      },

      warehouse_day_labor: {
        name: "倉庫の日雇い",
        category: "day_labor",
        locationId: "industrial_street",
        providerNpcId: null,
        repeatable: true,
        timeSlots: ["morning", "daytime"],
        requirements: {},
        reward: {
          moneyMin: 250,
          moneyMax: 350,
          items: []
        },
        cost: {
          fatigue: 30,
          hunger: 10,
          timeSteps: 3
        },
        notes: "体力を使う代わりに比較的まとまった現金が入る。"
      },

      recycling_sorting: {
        name: "廃品の仕分け",
        category: "small_job",
        locationId: "recycling_yard",
        providerNpcId: "recycler_staff",
        repeatable: true,
        timeSlots: ["morning", "daytime", "evening"],
        requirements: {
          relationship: {
            npcId: "recycler_staff",
            minFamiliarity: 5
          }
        },
        reward: {
          moneyMin: 100,
          moneyMax: 160,
          items: [],
          relationship: {
            npcId: "recycler_staff",
            trust: 1,
            goodwill: 1
          }
        },
        cost: {
          fatigue: 12,
          hunger: 4,
          timeSteps: 1
        },
        notes: "少し顔馴染みになると頼まれることがある。"
      },

      convenience_cleanup: {
        name: "店まわりの片付け",
        category: "small_job",
        locationId: "convenience_store",
        providerNpcId: "convenience_clerk",
        repeatable: true,
        timeSlots: ["daytime", "evening"],
        requirements: {
          relationship: {
            npcId: "convenience_clerk",
            minFamiliarity: 10,
            minGoodwill: 5
          }
        },
        reward: {
          moneyMin: 80,
          moneyMax: 120,
          items: ["leftover_food_chance"],
          relationship: {
            npcId: "convenience_clerk",
            trust: 1,
            goodwill: 1
          }
        },
        cost: {
          fatigue: 8,
          hunger: 3,
          timeSteps: 1
        },
        notes: "店員との関係が良くなると発生する小さな仕事。"
      }
    }
  };

  const clone = (value) => JSON.parse(JSON.stringify(value));

  window.HMW.jobData = jobData;

  window.HMW.getJob = (jobId) => {
    const job = jobData.definitions[jobId];
    return job ? { id: jobId, ...clone(job) } : null;
  };

  window.HMW.getJobsAtLocation = (locationId, timeSlot = null) => {
    return Object.entries(jobData.definitions)
      .filter(([, job]) => job.locationId === locationId)
      .filter(([, job]) => !timeSlot || job.timeSlots.includes(timeSlot))
      .map(([jobId, job]) => ({ id: jobId, ...clone(job) }));
  };
})();
