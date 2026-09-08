(() => {
  "use strict";

  window.HMW = window.HMW || {};
  const HMW = window.HMW;

  const clone = (value) => JSON.parse(JSON.stringify(value));
  const isNumber = (value) => typeof value === "number" && Number.isFinite(value);
  const clamp = (value, min = 0, max = 100) => Math.max(min, Math.min(max, value));

  const eventData = {
    definitions: {
      police_check: {
        name: "警官に声をかけられる",
        category: "police",
        repeatable: true,
        weight: 4,
        locations: ["station_front", "shopping_street", "park", "residential_alley", "industrial_street"],
        timeSlots: ["morning", "daytime", "evening", "night"],
        conditions: {},
        participants: ["police"],
        aiTags: ["police", "questioning", "street_life", "caution"],
        summary: "巡回中の警官が主人公を気に留め、声をかける。",
        outcomes: {
          answer_calmly: { label: "落ち着いて応じる", effects: {} },
          leave_area: { label: "その場を離れる", effects: {} }
        }
      },

      thug_presence: {
        name: "不良がたむろしている",
        category: "danger",
        repeatable: true,
        weight: 4,
        locations: ["park", "underpass", "riverside", "industrial_street"],
        timeSlots: ["evening", "night", "lateNight"],
        conditions: {},
        participants: ["thug"],
        aiTags: ["danger", "thug", "avoidance", "street_life"],
        summary: "この辺りに不良が集まっている。通るか避けるか判断が必要になる。",
        outcomes: {
          avoid: { label: "近づかない", effects: {} },
          pass_through: { label: "そのまま通る", effects: {} }
        }
      },

      charity_meal: {
        name: "食料支援",
        category: "support",
        repeatable: true,
        oncePerDay: true,
        dailyChance: 0.65,
        weight: 5,
        locations: ["charity_center"],
        timeSlots: ["daytime"],
        conditions: {},
        participants: ["charity_staff"],
        aiTags: ["support", "food", "volunteer", "limited_supply"],
        summary: "配布時間に間に合い、食料が残っていれば一人分を受け取れる。毎日必ず配布されるわけではない。",
        outcomes: {
          receive: {
            label: "受け取る",
            effects: {
              condition: { hunger: -12 }
            }
          },
          decline: { label: "今回は受け取らない", effects: {} }
        }
      },

      homeless_warning: {
        name: "危険な場所の噂",
        category: "information",
        repeatable: true,
        oncePerDay: true,
        weight: 3,
        locations: ["park", "underpass", "riverside"],
        timeSlots: ["morning", "evening", "night", "lateNight"],
        conditions: {},
        participants: ["homeless_a"],
        aiTags: ["homeless", "information", "danger_warning"],
        summary: "顔見知りの路上生活者から、今日は避けた方がいい場所の話を聞く。",
        outcomes: {
          listen: {
            label: "話を聞く",
            effects: {
              relationship: {
                npcId: "homeless_a",
                familiarity: 1,
                goodwill: 1
              }
            }
          },
          ignore: { label: "聞き流す", effects: {} }
        }
      },

      convenience_leftovers: {
        name: "店員が廃棄予定の食べ物を気にする",
        category: "shop",
        repeatable: true,
        oncePerDay: true,
        dailyChance: 0.35,
        weight: 2,
        locations: ["convenience_store"],
        timeSlots: ["evening", "night"],
        conditions: {
          relationship: {
            npcId: "convenience_clerk",
            minFamiliarity: 5,
            minGoodwill: 1
          }
        },
        participants: ["convenience_clerk"],
        aiTags: ["shop", "leftovers", "familiarity", "small_kindness"],
        summary: "何度も顔を合わせている店員が、たまたま廃棄予定の食べ物を渡せそうな日がある。",
        outcomes: {
          accept: {
            label: "受け取る",
            effects: {
              condition: { hunger: -10 },
              relationship: {
                npcId: "convenience_clerk",
                familiarity: 1,
                goodwill: 1
              }
            }
          },
          decline: {
            label: "断る",
            effects: {
              relationship: {
                npcId: "convenience_clerk",
                familiarity: 1
              }
            }
          }
        }
      },

      rain_shelter: {
        name: "雨宿り",
        category: "weather",
        repeatable: true,
        weight: 4,
        locations: ["shopping_street", "convenience_store", "underpass"],
        timeSlots: ["morning", "daytime", "evening", "night", "lateNight"],
        conditions: {
          weather: ["rain", "heavyRain"]
        },
        participants: [],
        aiTags: ["rain", "shelter", "weather", "street_life"],
        summary: "雨を避けられる場所がある。ここで少しやり過ごすことができる。",
        outcomes: {
          shelter: { label: "雨宿りする", effects: { condition: { wetness: -8 } } },
          continue: { label: "移動を続ける", effects: {} }
        }
      },

      resident_complaint: {
        name: "住民に警戒される",
        category: "resident",
        repeatable: true,
        weight: 3,
        locations: ["residential_alley"],
        timeSlots: ["evening", "night", "lateNight"],
        conditions: {},
        participants: ["resident"],
        aiTags: ["resident", "complaint", "police_risk", "street_life"],
        summary: "住宅街で長く留まっていることを住民に警戒される。",
        outcomes: {
          leave: { label: "場所を離れる", effects: {} },
          explain: { label: "事情を説明する", effects: {} }
        }
      },

      scrap_find: {
        name: "売れそうな廃品を見つける",
        category: "resource",
        repeatable: true,
        oncePerDay: true,
        dailyChance: 0.45,
        weight: 3,
        locations: ["riverside", "industrial_street"],
        timeSlots: ["morning", "daytime", "evening"],
        conditions: {},
        participants: [],
        aiTags: ["scrap", "resource", "street_life"],
        summary: "探せば必ず見つかるわけではないが、道端に換金できそうな廃品が残っていることがある。",
        outcomes: {
          take: {
            label: "拾う",
            effects: {
              inventoryAdd: [{ id: "scrap_piece", name: "売れそうな廃品", quantity: 1 }]
            }
          },
          leave: { label: "そのままにする", effects: {} }
        }
      }
    }
  };

  const stableRoll = (key) => {
    let hash = 2166136261;
    for (let i = 0; i < key.length; i += 1) {
      hash ^= key.charCodeAt(i);
      hash = Math.imul(hash, 16777619);
    }
    return (hash >>> 0) / 4294967296;
  };

  const getRelationship = (npcId) => {
    if (!npcId) return null;

    if (!HMW.state.relationships[npcId] && typeof HMW.getNpc === "function") {
      const npc = HMW.getNpc(npcId);
      if (npc?.relationship) HMW.state.relationships[npcId] = clone(npc.relationship);
    }

    return HMW.state.relationships[npcId] || null;
  };

  const relationshipMeets = (requirement) => {
    if (!requirement) return true;

    const relationship = getRelationship(requirement.npcId) || {};
    const checks = [
      ["minFamiliarity", "familiarity"],
      ["minTrust", "trust"],
      ["minGoodwill", "goodwill"],
      ["maxCaution", "caution"],
      ["maxIrritation", "irritation"],
      ["maxAnnoyance", "annoyance"]
    ];

    return checks.every(([requirementKey, relationshipKey]) => {
      if (!isNumber(requirement[requirementKey])) return true;
      const current = relationship[relationshipKey] || 0;
      return requirementKey.startsWith("min")
        ? current >= requirement[requirementKey]
        : current <= requirement[requirementKey];
    });
  };

  const eventMatches = (eventId, event, context) => {
    const locationId = context.locationId ?? HMW.state.world.locationId;
    const time = context.time ?? HMW.state.world.time;
    const weather = context.weather ?? HMW.state.world.weather;
    const day = context.day ?? HMW.state.world.day;

    if (event.locations?.length && !event.locations.includes(locationId)) return false;
    if (event.timeSlots?.length && !event.timeSlots.includes(time)) return false;
    if (isNumber(event.conditions?.minDay) && day < event.conditions.minDay) return false;
    if (event.conditions?.weather?.length && !event.conditions.weather.includes(weather)) return false;
    if (!relationshipMeets(event.conditions?.relationship)) return false;

    if (isNumber(event.dailyChance) && stableRoll(`event:${eventId}:${day}`) >= event.dailyChance) return false;

    const active = HMW.state.events.active || [];
    if (active.some((entry) => entry.eventId === eventId)) return false;

    const completed = HMW.state.events.completed || [];
    if (event.oncePerDay && completed.some((entry) => entry.eventId === eventId && entry.completedDay === day)) return false;
    if (!event.repeatable && completed.some((entry) => entry.eventId === eventId)) return false;

    return true;
  };

  const weightedPick = (entries) => {
    const total = entries.reduce((sum, [, event]) => sum + Math.max(0, event.weight || 1), 0);
    if (total <= 0) return null;

    let roll = Math.random() * total;
    for (const entry of entries) {
      roll -= Math.max(0, entry[1].weight || 1);
      if (roll <= 0) return entry;
    }

    return entries[entries.length - 1] || null;
  };

  const addHistory = (type, text, extra = {}) => {
    HMW.state.history.push({
      day: HMW.state.world.day,
      time: HMW.state.world.time,
      locationId: HMW.state.world.locationId,
      type,
      text,
      ...clone(extra)
    });
  };

  const applyEffects = (effects = {}) => {
    if (isNumber(effects.money)) HMW.state.player.money += effects.money;

    if (effects.condition) {
      Object.entries(effects.condition).forEach(([key, amount]) => {
        const current = HMW.state.player.condition[key];
        if (isNumber(current) && isNumber(amount)) HMW.state.player.condition[key] = clamp(current + amount);
      });
    }

    if (effects.relationship?.npcId) {
      const relationship = getRelationship(effects.relationship.npcId);
      if (relationship) {
        Object.entries(effects.relationship).forEach(([key, amount]) => {
          if (key === "npcId" || !isNumber(amount)) return;
          relationship[key] = (relationship[key] || 0) + amount;
        });
      }
    }

    if (Array.isArray(effects.inventoryAdd)) {
      effects.inventoryAdd.forEach((item) => HMW.state.player.inventory.push(clone(item)));
    }
  };

  const getEvent = (eventId) => {
    const event = eventData.definitions[eventId];
    return event ? { id: eventId, ...clone(event) } : null;
  };

  const getEligibleEvents = (context = {}) => Object.entries(eventData.definitions)
    .filter(([eventId, event]) => eventMatches(eventId, event, context))
    .map(([eventId, event]) => ({ id: eventId, ...clone(event) }));

  const startEvent = (eventId, context = {}) => {
    const event = eventData.definitions[eventId];
    if (!event || !eventMatches(eventId, event, context)) return null;

    const instance = {
      instanceId: `event_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      eventId,
      name: event.name,
      category: event.category,
      day: HMW.state.world.day,
      time: HMW.state.world.time,
      locationId: HMW.state.world.locationId,
      status: "active"
    };

    HMW.state.events.active.push(instance);
    addHistory("event_start", `${event.name}が発生した。`, { eventId, instanceId: instance.instanceId });
    return clone(instance);
  };

  const rollEvent = (options = {}) => {
    const chance = isNumber(options.chance) ? clamp(options.chance, 0, 1) : 0.35;
    if (Math.random() > chance) return null;

    const eligible = Object.entries(eventData.definitions)
      .filter(([eventId, event]) => eventMatches(eventId, event, options));

    const picked = weightedPick(eligible);
    if (!picked) return null;
    return startEvent(picked[0], options);
  };

  const resolveEvent = (instanceId, outcomeId) => {
    const index = HMW.state.events.active.findIndex((entry) => entry.instanceId === instanceId);
    if (index < 0) return null;

    const instance = HMW.state.events.active[index];
    const event = eventData.definitions[instance.eventId];
    const outcome = event?.outcomes?.[outcomeId];
    if (!event || !outcome) return null;

    applyEffects(outcome.effects || {});

    const completed = {
      ...instance,
      status: "completed",
      outcomeId,
      outcomeLabel: outcome.label,
      completedDay: HMW.state.world.day,
      completedTime: HMW.state.world.time,
      completedLocationId: HMW.state.world.locationId
    };

    HMW.state.events.active.splice(index, 1);
    HMW.state.events.completed.push(completed);

    addHistory("event_end", `${event.name}：${outcome.label}`, {
      eventId: instance.eventId,
      instanceId,
      outcomeId
    });

    return clone(completed);
  };

  window.HMW.eventData = eventData;
  window.HMW.getEvent = getEvent;
  window.HMW.getEligibleEvents = getEligibleEvents;
  window.HMW.startEvent = startEvent;
  window.HMW.rollEvent = rollEvent;
  window.HMW.resolveEvent = resolveEvent;
  window.HMW.getActiveEvents = () => clone(HMW.state.events.active || []);
})();
