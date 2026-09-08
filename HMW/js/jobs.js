(() => {
  "use strict";

  window.HMW = window.HMW || {};
  const HMW = window.HMW;

  const jobData = {
    definitions: {
      charity_dog_walk: {
        name: "犬の散歩",
        category: "support",
        locationId: "charity_center",
        providerNpcId: "charity_staff",
        repeatable: true,
        timeSlots: ["morning", "daytime", "evening"],
        availabilityChance: 0.30,
        requirements: {
          relationship: {
            npcId: "charity_staff",
            minFamiliarity: 3,
            minGoodwill: 1
          }
        },
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
        notes: "支援施設で何度か顔を合わせ、信頼されてから頼まれることがある小仕事。"
      },

      street_cleaning: {
        name: "道路清掃",
        category: "temporary",
        locationId: "labor_office",
        providerNpcId: "labor_staff",
        repeatable: true,
        timeSlots: ["morning", "daytime"],
        availabilityChance: 0.30,
        requirements: {
          workAccess: {
            identityDocument: true,
            contactAddress: true
          },
          condition: {
            minHealth: 40,
            maxFatigue: 75
          }
        },
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
        notes: "求人がある日に、本人確認と連絡先情報を確認されたうえで紹介される短時間仕事。"
      },

      delivery: {
        name: "配達",
        category: "temporary",
        locationId: "labor_office",
        providerNpcId: "labor_staff",
        repeatable: true,
        timeSlots: ["morning", "daytime"],
        availabilityChance: 0.22,
        requirements: {
          workAccess: {
            identityDocument: true,
            phone: true,
            bankAccount: true,
            contactAddress: true
          },
          condition: {
            minHealth: 45,
            maxFatigue: 70
          }
        },
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
        notes: "登録と連絡手段が必要な臨時仕事。募集が毎日あるわけではない。"
      },

      warehouse_day_labor: {
        name: "倉庫の日雇い",
        category: "day_labor",
        locationId: "industrial_street",
        providerNpcId: null,
        repeatable: true,
        timeSlots: ["morning", "daytime"],
        availabilityChance: 0.20,
        requirements: {
          workAccess: {
            identityDocument: true,
            phone: true,
            bankAccount: true,
            contactAddress: true
          },
          condition: {
            minHealth: 55,
            maxFatigue: 55
          }
        },
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
        notes: "未経験可でも、その場で飛び込み就労はできない。登録・本人確認・連絡手段などが必要。"
      },

      recycling_sorting: {
        name: "廃品の仕分け",
        category: "small_job",
        locationId: "recycling_yard",
        providerNpcId: "recycler_staff",
        repeatable: true,
        timeSlots: ["morning", "daytime", "evening"],
        availabilityChance: 0.45,
        requirements: {
          relationship: {
            npcId: "recycler_staff",
            minFamiliarity: 5
          },
          condition: {
            minHealth: 35,
            maxFatigue: 80
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
        notes: "少し顔馴染みになったあと、手が足りない日にだけ頼まれることがある。"
      },

      convenience_cleanup: {
        name: "店まわりの片付け",
        category: "small_job",
        locationId: "convenience_store",
        providerNpcId: "convenience_clerk",
        repeatable: true,
        timeSlots: ["daytime", "evening"],
        availabilityChance: 0.35,
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
        notes: "店員との関係ができたあと、たまたま人手が必要な日に発生する小仕事。"
      }
    }
  };

  const clone = (value) => JSON.parse(JSON.stringify(value));
  const isNumber = (value) => typeof value === "number" && Number.isFinite(value);

  const getRelationship = (npcId) => {
    if (!npcId) return {};
    if (HMW.state?.relationships?.[npcId]) return HMW.state.relationships[npcId];
    const npc = typeof HMW.getNpc === "function" ? HMW.getNpc(npcId) : null;
    return npc?.relationship || {};
  };

  const availabilityRoll = (jobId, day) => {
    const text = `${jobId}:${day}`;
    let hash = 2166136261;
    for (let i = 0; i < text.length; i += 1) {
      hash ^= text.charCodeAt(i);
      hash = Math.imul(hash, 16777619);
    }
    return (hash >>> 0) / 4294967296;
  };

  const isAvailableToday = (jobId, job, day = HMW.state?.world?.day || 1) => {
    if (!isNumber(job.availabilityChance)) return true;
    return availabilityRoll(jobId, day) < job.availabilityChance;
  };

  const checkRelationship = (requirement) => {
    if (!requirement) return null;
    const relationship = getRelationship(requirement.npcId);

    if (isNumber(requirement.minFamiliarity) && (relationship.familiarity || 0) < requirement.minFamiliarity) {
      return "まだ仕事を頼まれるほどの顔馴染みではない。";
    }
    if (isNumber(requirement.minGoodwill) && (relationship.goodwill || 0) < requirement.minGoodwill) {
      return "まだ相手から仕事を任せてもらえる関係ではない。";
    }
    if (isNumber(requirement.minTrust) && (relationship.trust || 0) < requirement.minTrust) {
      return "まだ十分に信用されていない。";
    }
    return null;
  };

  const checkWorkAccess = (requirement) => {
    if (!requirement) return null;
    const access = HMW.state?.player?.workAccess || {};
    const labels = {
      identityDocument: "本人確認書類",
      phone: "連絡に使える電話",
      bankAccount: "給与を受け取れる口座",
      contactAddress: "登録に使える連絡先住所"
    };

    const missing = Object.entries(requirement)
      .filter(([, required]) => required)
      .filter(([key]) => !access[key])
      .map(([key]) => labels[key] || key);

    return missing.length ? `${missing.join("・")}がなく、応募手続きを進められない。` : null;
  };

  const checkCondition = (requirement) => {
    if (!requirement) return null;
    const condition = HMW.state?.player?.condition || {};

    if (isNumber(requirement.minHealth) && (condition.health || 0) < requirement.minHealth) {
      return "今の体調ではこの仕事を受けにくい。";
    }
    if (isNumber(requirement.maxFatigue) && (condition.fatigue || 0) > requirement.maxFatigue) {
      return "疲労が強く、この仕事をこなせる状態ではない。";
    }
    return null;
  };

  const getJobAccessStatus = (jobId, options = {}) => {
    const job = jobData.definitions[jobId];
    if (!job) return { ok: false, reason: "仕事情報がない。" };

    const relationshipReason = checkRelationship(job.requirements?.relationship);
    if (relationshipReason) return { ok: false, reason: relationshipReason };

    const accessReason = checkWorkAccess(job.requirements?.workAccess);
    if (accessReason) return { ok: false, reason: accessReason };

    const conditionReason = checkCondition(job.requirements?.condition);
    if (conditionReason) return { ok: false, reason: conditionReason };

    if (!options.ignoreAvailability && !isAvailableToday(jobId, job, options.day)) {
      return { ok: false, reason: "今日は募集がない、またはすでに枠が埋まっている。" };
    }

    return { ok: true, reason: "" };
  };

  window.HMW.jobData = jobData;

  window.HMW.getJob = (jobId) => {
    const job = jobData.definitions[jobId];
    return job ? { id: jobId, ...clone(job) } : null;
  };

  window.HMW.getJobAccessStatus = getJobAccessStatus;

  window.HMW.getJobLeadsAtLocation = (locationId, timeSlot = null) => {
    return Object.entries(jobData.definitions)
      .filter(([, job]) => job.locationId === locationId)
      .filter(([, job]) => !timeSlot || job.timeSlots.includes(timeSlot))
      .map(([jobId, job]) => ({
        id: jobId,
        ...clone(job),
        access: getJobAccessStatus(jobId)
      }));
  };

  window.HMW.getJobsAtLocation = (locationId, timeSlot = null) => {
    return Object.entries(jobData.definitions)
      .filter(([, job]) => job.locationId === locationId)
      .filter(([, job]) => !timeSlot || job.timeSlots.includes(timeSlot))
      .filter(([jobId]) => getJobAccessStatus(jobId).ok)
      .map(([jobId, job]) => ({ id: jobId, ...clone(job) }));
  };
})();
