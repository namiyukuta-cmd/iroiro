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
        discoveryMode: "relationship",
        timeSlots: ["daytime", "evening"],
        leadChance: 0.22,
        availabilityChance: 0.35,
        acceptanceChance: 0.90,
        requirements: {
          relationship: {
            npcId: "charity_staff",
            minFamiliarity: 4,
            minGoodwill: 2,
            minTrust: 1
          },
          condition: {
            minHealth: 35,
            maxFatigue: 75
          }
        },
        reward: {
          moneyMin: 50,
          moneyMax: 80,
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
        notes: "支援施設で何度か顔を合わせ、相手から頼まれた時だけ発生する小仕事。"
      },

      street_cleaning: {
        name: "道路清掃",
        category: "temporary",
        locationId: "labor_office",
        providerNpcId: "labor_staff",
        repeatable: true,
        discoveryMode: "listing",
        timeSlots: ["morning", "daytime"],
        leadChance: 0.38,
        availabilityChance: 0.30,
        acceptanceChance: 0.62,
        requirements: {
          workAccess: {
            identityDocument: true,
            contactAddress: true
          },
          condition: {
            minHealth: 40,
            minHygiene: 25,
            maxFatigue: 70
          }
        },
        reward: {
          moneyMin: 120,
          moneyMax: 180
        },
        cost: {
          fatigue: 15,
          hunger: 5,
          timeSteps: 2
        },
        notes: "求人がある日に本人確認と連絡先を確認され、その上で選考される短時間仕事。"
      },

      delivery: {
        name: "配達",
        category: "temporary",
        locationId: "labor_office",
        providerNpcId: "labor_staff",
        repeatable: true,
        discoveryMode: "listing",
        timeSlots: ["morning", "daytime"],
        leadChance: 0.28,
        availabilityChance: 0.22,
        acceptanceChance: 0.50,
        requirements: {
          workAccess: {
            identityDocument: true,
            phone: true,
            bankAccount: true,
            contactAddress: true
          },
          condition: {
            minHealth: 45,
            minHygiene: 35,
            maxFatigue: 65
          }
        },
        reward: {
          moneyMin: 150,
          moneyMax: 220
        },
        cost: {
          fatigue: 18,
          hunger: 6,
          timeSteps: 2
        },
        notes: "登録・本人確認・電話・給与受取口座などが必要。募集があっても採用されるとは限らない。"
      },

      warehouse_day_labor: {
        name: "倉庫の日雇い",
        category: "day_labor",
        locationId: "industrial_street",
        providerNpcId: null,
        repeatable: true,
        discoveryMode: "listing",
        timeSlots: ["morning"],
        leadChance: 0.22,
        availabilityChance: 0.18,
        acceptanceChance: 0.55,
        requirements: {
          workAccess: {
            identityDocument: true,
            phone: true,
            bankAccount: true,
            contactAddress: true
          },
          condition: {
            minHealth: 55,
            minHygiene: 30,
            maxFatigue: 55
          }
        },
        reward: {
          moneyMin: 250,
          moneyMax: 350
        },
        cost: {
          fatigue: 30,
          hunger: 10,
          timeSteps: 3
        },
        notes: "未経験可でも飛び込み就労はできない。早い時間の募集で、登録条件を満たしていても枠に入れないことがある。"
      },

      recycling_sorting: {
        name: "廃品の仕分け",
        category: "small_job",
        locationId: "recycling_yard",
        providerNpcId: "recycler_staff",
        repeatable: true,
        discoveryMode: "relationship",
        timeSlots: ["morning", "daytime", "evening"],
        leadChance: 0.30,
        availabilityChance: 0.40,
        acceptanceChance: 0.85,
        requirements: {
          relationship: {
            npcId: "recycler_staff",
            minFamiliarity: 6,
            minTrust: 2
          },
          condition: {
            minHealth: 35,
            maxFatigue: 75
          }
        },
        reward: {
          moneyMin: 100,
          moneyMax: 160,
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
        notes: "顔馴染みになったあと、手が足りない日に声をかけられて初めて発生する。"
      },

      convenience_cleanup: {
        name: "店まわりの片付け",
        category: "small_job",
        locationId: "convenience_store",
        providerNpcId: "convenience_clerk",
        repeatable: true,
        discoveryMode: "relationship",
        timeSlots: ["daytime", "evening"],
        leadChance: 0.20,
        availabilityChance: 0.30,
        acceptanceChance: 0.85,
        requirements: {
          relationship: {
            npcId: "convenience_clerk",
            minFamiliarity: 10,
            minGoodwill: 5,
            minTrust: 2
          },
          condition: {
            minHygiene: 35,
            maxFatigue: 75
          }
        },
        reward: {
          moneyMin: 80,
          moneyMax: 120,
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
        notes: "店員との関係ができ、かつ人手が足りない時だけ頼まれる。"
      }
    }
  };

  const clone = (value) => JSON.parse(JSON.stringify(value));
  const isNumber = (value) => typeof value === "number" && Number.isFinite(value);

  const stableRoll = (key) => {
    let hash = 2166136261;
    for (let i = 0; i < key.length; i += 1) {
      hash ^= key.charCodeAt(i);
      hash = Math.imul(hash, 16777619);
    }
    return (hash >>> 0) / 4294967296;
  };

  const getRelationship = (npcId) => {
    if (!npcId) return {};
    if (HMW.state?.relationships?.[npcId]) return HMW.state.relationships[npcId];
    const npc = typeof HMW.getNpc === "function" ? HMW.getNpc(npcId) : null;
    return npc?.relationship || {};
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
      return "今の体調では、この仕事を任せてもらえる状態ではない。";
    }
    if (isNumber(requirement.minHygiene) && (condition.hygiene || 0) < requirement.minHygiene) {
      return "身なりを整えられておらず、この仕事では不利になる。";
    }
    if (isNumber(requirement.maxFatigue) && (condition.fatigue || 0) > requirement.maxFatigue) {
      return "疲労が強く、この仕事をこなせる状態ではない。";
    }
    return null;
  };

  const getRequirementStatus = (jobId) => {
    const job = jobData.definitions[jobId];
    if (!job) return { ok: false, reason: "仕事情報がない。" };

    const relationshipReason = checkRelationship(job.requirements?.relationship);
    if (relationshipReason) return { ok: false, reason: relationshipReason, barrier: "relationship" };

    const accessReason = checkWorkAccess(job.requirements?.workAccess);
    if (accessReason) return { ok: false, reason: accessReason, barrier: "workAccess" };

    const conditionReason = checkCondition(job.requirements?.condition);
    if (conditionReason) return { ok: false, reason: conditionReason, barrier: "condition" };

    return { ok: true, reason: "", barrier: null };
  };

  const isLeadFound = (jobId, day, searchAttempt) => {
    const job = jobData.definitions[jobId];
    if (!job) return false;
    const chance = isNumber(job.leadChance) ? job.leadChance : 1;
    return stableRoll(`lead:${jobId}:${day}:${searchAttempt}`) < chance;
  };

  const isAvailableToday = (jobId, day = HMW.state?.world?.day || 1) => {
    const job = jobData.definitions[jobId];
    if (!job) return false;
    const chance = isNumber(job.availabilityChance) ? job.availabilityChance : 1;
    return stableRoll(`availability:${jobId}:${day}`) < chance;
  };

  const isAccepted = (jobId, day, applicationAttempt) => {
    const job = jobData.definitions[jobId];
    if (!job) return false;
    const chance = isNumber(job.acceptanceChance) ? job.acceptanceChance : 1;
    return stableRoll(`acceptance:${jobId}:${day}:${applicationAttempt}`) < chance;
  };

  const getJobSearchCandidates = (locationId, timeSlot = null) => {
    return Object.entries(jobData.definitions)
      .filter(([, job]) => job.locationId === locationId)
      .filter(([, job]) => !timeSlot || job.timeSlots.includes(timeSlot))
      .filter(([jobId, job]) => {
        if (job.discoveryMode !== "relationship") return true;
        return getRequirementStatus(jobId).barrier !== "relationship";
      })
      .map(([jobId, job]) => ({ id: jobId, ...clone(job) }));
  };

  const getApplicationStatus = (jobId, options = {}) => {
    const job = jobData.definitions[jobId];
    if (!job) return { ok: false, reason: "仕事情報がない。" };

    const requirementStatus = getRequirementStatus(jobId);
    if (!requirementStatus.ok) return requirementStatus;

    const day = options.day ?? HMW.state?.world?.day ?? 1;
    if (!isAvailableToday(jobId, day)) {
      return { ok: false, reason: "募集は見つかったが、今日はもう枠がない。", barrier: "availability" };
    }

    return { ok: true, reason: "", barrier: null };
  };

  window.HMW.jobData = jobData;
  window.HMW.getJob = (jobId) => {
    const job = jobData.definitions[jobId];
    return job ? { id: jobId, ...clone(job) } : null;
  };
  window.HMW.getJobRequirementStatus = getRequirementStatus;
  window.HMW.getJobApplicationStatus = getApplicationStatus;
  window.HMW.getJobSearchCandidates = getJobSearchCandidates;
  window.HMW.isJobLeadFound = isLeadFound;
  window.HMW.isJobAvailableToday = isAvailableToday;
  window.HMW.isJobAccepted = isAccepted;

  // 旧UIから検索・応募・採用を飛ばして仕事を直接出さない。
  window.HMW.getJobsAtLocation = (locationId, timeSlot = null) => {
    const day = HMW.state?.world?.day;
    const accepted = HMW.state?.player?.employment?.search?.accepted || [];

    return accepted
      .filter((entry) => entry.day === day && entry.status === "accepted")
      .map((entry) => window.HMW.getJob(entry.jobId))
      .filter(Boolean)
      .filter((job) => job.locationId === locationId)
      .filter((job) => !timeSlot || job.timeSlots.includes(timeSlot));
  };
})();
