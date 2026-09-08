(() => {
  "use strict";

  window.HMW = window.HMW || {};
  const HMW = window.HMW;

  const clone = (value) => JSON.parse(JSON.stringify(value));
  const clamp = (value, min = 0, max = 100) => Math.max(min, Math.min(max, value));
  const isNumber = (value) => typeof value === "number" && Number.isFinite(value);

  const stableRoll = (key) => {
    let hash = 2166136261;
    for (let i = 0; i < key.length; i += 1) {
      hash ^= key.charCodeAt(i);
      hash = Math.imul(hash, 16777619);
    }
    return (hash >>> 0) / 4294967296;
  };

  const getDay = () => HMW.state.world.day;
  const getTime = () => HMW.state.world.time;
  const getLocationId = () => HMW.state.world.locationId;
  const getLocation = () => HMW.getLocation?.(getLocationId()) || null;
  const getCondition = () => HMW.state.player.condition;

  const ensureState = () => {
    const p = HMW.state.player;

    p.lifeStatus = p.lifeStatus || "active";
    p.causeOfDeath = p.causeOfDeath || null;

    p.survival = p.survival || {};
    p.survival.movementCount = isNumber(p.survival.movementCount) ? p.survival.movementCount : 0;
    p.survival.movesThisSlot = isNumber(p.survival.movesThisSlot) ? p.survival.movesThisSlot : 0;
    p.survival.arrivalCount = isNumber(p.survival.arrivalCount) ? p.survival.arrivalCount : 0;
    p.survival.collapseCount = isNumber(p.survival.collapseCount) ? p.survival.collapseCount : 0;
    p.survival.lastCriticalKey = p.survival.lastCriticalKey || null;

    p.workAccess = p.workAccess || {
      identityDocument: false,
      phone: false,
      bankAccount: false,
      contactAddress: false
    };

    p.progression = p.progression || {};
    p.progression.support = p.progression.support || {
      caseOpened: false,
      visits: 0,
      contactAddress: { status: "not_started", readyDay: null },
      identityDocument: { status: "not_started", readyDay: null },
      phone: { status: "not_started", readyDay: null },
      bankAccount: { status: "not_started", readyDay: null }
    };
    p.progression.social = p.progression.social || {
      lastMeaningfulContact: {},
      knownTips: []
    };
    p.progression.social.lastMeaningfulContact = p.progression.social.lastMeaningfulContact || {};
    p.progression.social.knownTips = Array.isArray(p.progression.social.knownTips)
      ? p.progression.social.knownTips
      : [];

    const oldDaily = p.progression.daily || {};
    if (oldDaily.day !== getDay()) {
      p.progression.daily = {
        day: getDay(),
        beggingAttempts: 0,
        scavengingAttempts: 0,
        restCount: 0,
        washed: false,
        foodSupportReceived: false,
        supportConsulted: false,
        sleepSpotAttempts: {},
        npcContacts: {},
        ambientContacts: {}
      };
    } else {
      oldDaily.beggingAttempts = oldDaily.beggingAttempts || 0;
      oldDaily.scavengingAttempts = oldDaily.scavengingAttempts || 0;
      oldDaily.restCount = oldDaily.restCount || 0;
      oldDaily.washed = Boolean(oldDaily.washed);
      oldDaily.foodSupportReceived = Boolean(oldDaily.foodSupportReceived);
      oldDaily.supportConsulted = Boolean(oldDaily.supportConsulted);
      oldDaily.sleepSpotAttempts = oldDaily.sleepSpotAttempts || {};
      oldDaily.npcContacts = oldDaily.npcContacts || {};
      oldDaily.ambientContacts = oldDaily.ambientContacts || {};
      p.progression.daily = oldDaily;
    }

    const support = p.progression.support;
    ["contactAddress", "identityDocument", "phone", "bankAccount"].forEach((key) => {
      const entry = support[key];
      if (!entry || entry.status !== "pending") return;
      if (isNumber(entry.readyDay) && getDay() >= entry.readyDay) {
        entry.status = "ready";
        p.workAccess[key] = true;
      }
    });

    return p.progression;
  };

  const daily = () => ensureState().daily;

  const addHistory = (type, text, extra = {}) => {
    if (HMW.app?.appendHistory) {
      HMW.app.appendHistory(type, text, extra);
      return;
    }
    HMW.state.history.push({
      day: getDay(),
      time: getTime(),
      locationId: getLocationId(),
      type,
      text,
      ...clone(extra)
    });
  };

  const modal = (titleText) => {
    const layer = document.getElementById("modalLayer");
    const title = document.getElementById("modalTitle");
    const content = document.getElementById("modalContent");
    if (!layer || !title || !content) return null;
    title.textContent = titleText;
    content.replaceChildren();
    layer.hidden = false;
    return content;
  };

  const closeModal = () => HMW.app?.closeModal?.();

  const paragraph = (text) => {
    const p = document.createElement("p");
    p.textContent = text;
    p.style.margin = "0 0 12px";
    p.style.lineHeight = "1.65";
    return p;
  };

  const heading = (text) => {
    const h = document.createElement("strong");
    h.textContent = text;
    h.style.display = "block";
    h.style.margin = "14px 0 8px";
    return h;
  };

  const button = (label, onClick, disabled = false) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "action-button";
    b.textContent = label;
    b.disabled = disabled;
    b.addEventListener("click", onClick);
    return b;
  };

  const showResult = (title, lines, actions = []) => {
    const content = modal(title);
    if (!content) return;
    lines.filter(Boolean).forEach((line) => content.append(paragraph(line)));
    actions.forEach((action) => content.append(button(action.label, action.onClick, action.disabled)));
    refresh();
  };

  const possiblePeople = () => {
    const regular = HMW.getNpcsAtLocation?.(getLocationId(), getTime()) || [];
    const romance = HMW.getLoveInterestsAtLocation?.(getLocationId(), getTime()) || [];
    return [...regular, ...romance.map((person) => ({ ...person, romance: true }))];
  };

  const ambientTypes = () => HMW.getAmbientNpcTypes?.(getLocationId()) || [];

  const getRelationship = (npcId) => {
    HMW.state.relationships = HMW.state.relationships || {};
    if (!HMW.state.relationships[npcId]) {
      const npc = HMW.getNpc?.(npcId);
      HMW.state.relationships[npcId] = npc?.relationship
        ? clone(npc.relationship)
        : { familiarity: 0, trust: 0, goodwill: 0, caution: 0 };
    }
    return HMW.state.relationships[npcId];
  };

  const conditionWarning = () => {
    const c = getCondition();
    const status = HMW.state.player.lifeStatus;
    if (status === "dead") return "死亡している。";
    if (status === "collapsed") return "倒れていて、通常の行動はできない。";
    if (c.health <= 10) return "体力が限界に近く、通常の移動はできない。";
    if (c.hunger >= 100) return "空腹が限界で、歩き続けられない。";
    if (c.fatigue >= 100) return "疲労が限界で、歩き続けられない。";
    if (c.warmth <= 0) return "身体が冷え切っていて、移動を続けられない。";
    if (c.hunger >= 85) return "強い空腹で体力を消耗しやすい。";
    if (c.fatigue >= 85) return "強い疲労で動作が鈍っている。";
    if (c.health <= 25) return "体力がかなり落ちている。";
    return null;
  };

  const disableGameActions = () => {
    document.querySelectorAll("[data-action-slot], #mapButton").forEach((el) => {
      el.disabled = true;
    });
  };

  const die = (reason) => {
    const p = HMW.state.player;
    p.lifeStatus = "dead";
    p.causeOfDeath = reason;
    p.condition.health = 0;
    addHistory("death", reason);
    disableGameActions();
    showResult("死亡", [reason, "このセーブでは行動を続けられない。LOADから以前の状態を読み込める。"]);
  };

  const rescueChance = () => {
    const id = getLocationId();
    const busy = {
      station_front: 0.70,
      shopping_street: 0.62,
      convenience_store: 0.78,
      charity_center: 0.92,
      labor_office: 0.78,
      public_toilet: 0.48,
      police_station: 0.95,
      park: 0.46,
      residential_alley: 0.32,
      industrial_street: 0.30,
      recycling_yard: 0.45,
      underpass: 0.24,
      riverside: 0.20
    };
    let chance = busy[id] ?? 0.28;
    if (["morning", "daytime", "evening"].includes(getTime())) chance += 0.08;
    if (possiblePeople().length) chance += 0.08;
    const charity = HMW.state.relationships?.charity_staff;
    if ((charity?.familiarity || 0) >= 3 && ["park", "charity_center"].includes(id)) chance += 0.05;
    return clamp(chance, 0.10, 0.97);
  };

  const attemptRescue = (reason) => {
    const p = HMW.state.player;
    p.lifeStatus = "collapsed";
    p.survival.collapseCount += 1;
    const attempt = p.survival.collapseCount;
    const roll = stableRoll(`rescue:${getDay()}:${getTime()}:${getLocationId()}:${attempt}`);

    if (roll < rescueChance()) {
      const c = getCondition();
      c.health = Math.max(12, c.health);
      c.fatigue = Math.max(88, c.fatigue);
      c.warmth = Math.max(8, c.warmth);
      p.lifeStatus = "active";
      addHistory("rescued", "倒れたところを周囲の人に気づかれ、最低限の救急対応につながった。", { reason });
      showResult("倒れた", [
        reason,
        "周囲の人に気づかれ、最低限の救急対応につながった。生き延びたが、生活上の問題が解決したわけではない。",
        conditionWarning()
      ]);
      return;
    }

    addHistory("collapse", "衰弱してその場で倒れた。", { reason, attempt });
    showResult("倒れた", [
      reason,
      "すぐには誰にも気づかれなかった。通常の移動や仕事はできない。"
    ], [
      { label: "助けを待つ", onClick: waitForHelp }
    ]);
  };

  function waitForHelp() {
    const p = HMW.state.player;
    if (p.lifeStatus !== "collapsed") return;
    HMW.app?.advanceTime?.(1);
    const c = getCondition();
    c.health = Math.max(0, c.health - 3);
    const attempt = p.survival.collapseCount + 1;
    p.survival.collapseCount = attempt;
    const roll = stableRoll(`rescue-wait:${getDay()}:${getTime()}:${getLocationId()}:${attempt}`);

    if (roll < Math.min(0.98, rescueChance() + 0.10)) {
      c.health = 10;
      c.fatigue = Math.max(90, c.fatigue);
      c.warmth = Math.max(8, c.warmth);
      p.lifeStatus = "active";
      addHistory("rescued", "倒れた後、時間が経ってから人に発見された。", { attempt });
      showResult("発見された", ["時間が経ってから人に発見され、意識を戻した。体調は非常に悪い。", conditionWarning()]);
      return;
    }

    if (attempt >= 3) {
      die("衰弱して倒れたまま発見されず、命を落とした。");
      return;
    }

    showResult("まだ動けない", ["まだ助けは来ない。時間が過ぎ、さらに体力を失った。"], [
      { label: "さらに待つ", onClick: waitForHelp }
    ]);
  }

  const resolveCriticalState = (trigger = "state") => {
    ensureState();
    const p = HMW.state.player;
    const c = getCondition();

    if (p.lifeStatus === "dead") return { blocked: true, dead: true, reason: p.causeOfDeath };
    if (p.lifeStatus === "collapsed") return { blocked: true, dead: false, reason: "倒れていて動けない。" };

    const key = `${getDay()}:${getTime()}:${trigger}`;
    let blocked = false;
    let reason = "";

    if (c.hunger >= 100) {
      blocked = true;
      reason = "空腹が限界で、歩き続けることができない。食べるものを確保する必要がある。";
      if (p.survival.lastCriticalKey !== key) {
        c.health = clamp(c.health - 6);
        c.fatigue = clamp(c.fatigue + 4);
        p.survival.lastCriticalKey = key;
      }
    } else if (c.fatigue >= 100) {
      blocked = true;
      reason = "疲労が限界で、身体が言うことをきかない。休まなければ移動できない。";
      if (p.survival.lastCriticalKey !== key) {
        c.health = clamp(c.health - 4);
        p.survival.lastCriticalKey = key;
      }
    } else if (c.warmth <= 0) {
      blocked = true;
      reason = "身体が冷え切り、まともに動けない。暖を取らなければ危険だ。";
      if (p.survival.lastCriticalKey !== key) {
        c.health = clamp(c.health - 7);
        p.survival.lastCriticalKey = key;
      }
    } else if (c.health <= 10) {
      blocked = true;
      reason = "体力が落ちすぎていて、通常の移動を続けられない。";
    }

    if (c.health <= 0) {
      attemptRescue(reason || "体力が尽きて、その場で倒れた。");
      return { blocked: true, dead: HMW.state.player.lifeStatus === "dead", reason };
    }

    return { blocked, dead: false, reason };
  };

  const applyMovementCost = () => {
    const c = getCondition();
    const s = HMW.state.player.survival;
    c.hunger = clamp(c.hunger + 1);
    c.fatigue = clamp(c.fatigue + 2);
    c.hygiene = clamp(c.hygiene - 1);

    if (HMW.state.world.weather === "rain") {
      c.wetness = clamp(c.wetness + 5);
      c.warmth = clamp(c.warmth - 2);
    } else if (HMW.state.world.weather === "heavyRain") {
      c.wetness = clamp(c.wetness + 10);
      c.warmth = clamp(c.warmth - 4);
    } else if (HMW.state.world.weather === "cold") {
      c.warmth = clamp(c.warmth - 4);
    }

    s.movementCount += 1;
    s.arrivalCount += 1;
    s.movesThisSlot += 1;

    if (s.movesThisSlot >= 2) {
      s.movesThisSlot = 0;
      HMW.app?.advanceTime?.(1);
    }
  };

  const getArrivalEvent = () => {
    const eligible = (HMW.getEligibleEvents?.() || [])
      .filter((event) => event.id !== "charity_meal");
    if (!eligible.length) return null;
    const index = Math.floor(stableRoll(`arrival-event:${getDay()}:${getTime()}:${getLocationId()}:${HMW.state.player.survival.arrivalCount}`) * eligible.length);
    return eligible[Math.min(index, eligible.length - 1)] || null;
  };

  const resolveEventChoice = (event, outcomeId) => {
    let active = (HMW.getActiveEvents?.() || []).find((entry) => entry.eventId === event.id);
    if (!active) active = HMW.startEvent?.(event.id);
    if (!active) {
      showResult(event.name, ["状況が変わり、この出来事はもう起きていない。"]);
      return;
    }
    const completed = HMW.resolveEvent?.(active.instanceId, outcomeId);
    const outcome = event.outcomes?.[outcomeId];
    showResult(event.name, [completed ? outcome?.label || "行動した。" : "結果を確定できなかった。", conditionWarning()]);
  };

  const renderEvent = (container, event) => {
    if (!event) return;
    container.append(heading("今起きていること"));
    container.append(paragraph(event.summary || event.name));
    Object.entries(event.outcomes || {}).forEach(([outcomeId, outcome]) => {
      container.append(button(outcome.label, () => resolveEventChoice(event, outcomeId)));
    });
  };

  const supportConsult = () => {
    const d = daily();
    const support = ensureState().support;
    if (d.supportConsulted) {
      showResult("生活相談", ["今日はすでに相談している。次に進められるのは、手続きの待ち時間が過ぎるか、次に相談できる日になってからだ。"]);
      return;
    }

    d.supportConsulted = true;
    support.visits = (support.visits || 0) + 1;
    HMW.app?.advanceTime?.(1);

    if (!support.caseOpened) {
      support.caseOpened = true;
      addHistory("support", "支援施設で生活相談につながった。");
      showResult("生活相談", ["事情を聞かれ、継続して相談できる記録が作られた。今日だけで住居や仕事が決まるわけではないが、次から具体的な手続きを進められる。"]);
      return;
    }

    const order = [
      ["contactAddress", "連絡先として使える住所", 1],
      ["identityDocument", "本人確認書類", 2],
      ["phone", "連絡に使える電話", 2],
      ["bankAccount", "給与を受け取る口座", 2]
    ];

    const pending = order.find(([key]) => support[key]?.status === "pending");
    if (pending) {
      const [key, label] = pending;
      if (getDay() >= support[key].readyDay) {
        support[key].status = "ready";
        HMW.state.player.workAccess[key] = true;
        addHistory("support", `${label}の手続きが完了した。`);
        showResult("生活相談", [`${label}の手続きが進み、仕事の応募条件として使える状態になった。`]);
      } else {
        showResult("生活相談", [`${label}はまだ手続き中で、今日すぐには終わらない。`]);
      }
      return;
    }

    const next = order.find(([key]) => !HMW.state.player.workAccess[key]);
    if (!next) {
      showResult("生活相談", ["応募に必要な最低限の連絡・本人確認手段はそろっている。次は求人ごとの条件と採用の問題になる。"]);
      return;
    }

    const [key, label, waitDays] = next;
    if (stableRoll(`support-delay:${getDay()}:${support.visits}:${key}`) > 0.84) {
      addHistory("support", `${label}の手続きを始められなかった。`);
      showResult("生活相談", ["相談はできたが、担当や必要書類の都合で今日は手続きを始められなかった。"]);
      return;
    }

    support[key].status = "pending";
    support[key].readyDay = getDay() + waitDays;
    addHistory("support", `${label}の手続きを始めた。`);
    showResult("生活相談", [`${label}の手続きを始めた。即日では終わらない。`]);
  };

  const foodSupport = () => {
    const d = daily();
    if (d.foodSupportReceived) {
      showResult("食料支援", ["今日はすでに一人分を受け取っている。"]);
      return;
    }
    if (getTime() !== "daytime") {
      showResult("食料支援", ["今は配布時間ではない。"]);
      return;
    }
    const eligible = (HMW.getEligibleEvents?.() || []).some((e) => e.id === "charity_meal");
    if (!eligible) {
      showResult("食料支援", ["今日は配布がないか、予定数が終わっている。"]);
      return;
    }
    HMW.addItem?.("food_pack", 1);
    d.foodSupportReceived = true;
    addHistory("food_support", "支援施設で一人分の食料を受け取った。");
    showResult("食料支援", ["一人分の食料を受け取った。食べるか持っておくかは持ち物から選べる。"]);
  };

  const rememberTip = (tip) => {
    const tips = ensureState().social.knownTips;
    if (!tips.includes(tip)) tips.push(tip);
  };

  const contactNpc = (npc) => {
    const d = daily();
    const already = Boolean(d.npcContacts[npc.id]);
    d.npcContacts[npc.id] = true;

    let relationship;
    if (npc.romance && HMW.ensureLoveInterestRelationship) relationship = HMW.ensureLoveInterestRelationship(npc.id);
    else relationship = getRelationship(npc.id);
    if (relationship && !already) relationship.familiarity = (relationship.familiarity || 0) + 1;

    HMW.state.player.progression.social.lastMeaningfulContact[npc.id] = { day: getDay(), time: getTime() };
    addHistory("npc_contact", `${npc.displayName || npc.label || npc.name || npc.id}と接触した。`, { npcId: npc.id });

    const name = npc.displayName || npc.label || npc.name || "人";
    const actions = [];
    const lines = [];

    if (npc.id === "charity_staff" || npc.templateId === "volunteer") {
      lines.push("支援施設の職員。食料だけでなく、生活相談や仕事に必要な手続きにつながる窓口でもある。");
      actions.push({ label: "生活相談をする", onClick: supportConsult });
      actions.push({ label: "食料支援を確認する", onClick: foodSupport });
    } else if (npc.id === "labor_staff" || npc.templateId === "laborStaff") {
      lines.push("職員は求人だけでなく、応募に足りない条件も確認する。条件がなければ仕事には進めない。");
      actions.push({ label: "仕事について聞く", onClick: () => HMW.jobSearch?.open?.() });
    } else if (npc.id === "recycler_staff" || npc.templateId === "recycler") {
      lines.push("廃品を持っていれば買い取ってもらえる。何も持っていなければ取引にはならない。");
      actions.push({ label: "廃品を売る", onClick: sellScrap });
    } else if (npc.templateId === "homeless") {
      lines.push("同じ街で暮らす人だ。こちらをどこまで信用するかは、それまでの接触で変わる。");
      actions.push({
        label: "情報を聞く",
        onClick: () => {
          const r = getRelationship(npc.id);
          const familiarity = r.familiarity || 0;
          if (familiarity < 2) {
            showResult("情報", ["まだ警戒されていて、詳しいことは教えてもらえなかった。"]);
            return;
          }
          r.goodwill = (r.goodwill || 0) + 1;
          const tip = familiarity >= 4 ? "park_sleep" : "charity_meal";
          rememberTip(tip);
          addHistory("information", tip === "park_sleep" ? "公園で比較的目立ちにくい場所の話を聞いた。" : "支援施設の配布時間について聞いた。", { npcId: npc.id });
          showResult("情報", [tip === "park_sleep"
            ? "公園でも場所によって巡回や人目が違う、と教えられた。寝場所探しの見当が少しついた。"
            : "昼なら支援施設で食料配布がある日がある、と教えられた。毎日とは限らない。"]);
        }
      });
    } else if (npc.templateId === "police") {
      lines.push("警官は巡回中だ。こちらの事情より先に、職務上の判断で接する。");
    } else if (npc.templateId === "shopClerk") {
      lines.push("店員はまず客として対応する。顔を覚えられても、店の規則と警戒は残る。");
    } else if (npc.romance) {
      lines.push("顔を合わせた。関係はこの一度では決まらず、これまでの接触が次回以降に残る。");
    } else {
      lines.push("短い接触になった。相手がこちらを覚えるかは今後の積み重ね次第だ。");
    }

    showResult(name, lines, actions);
  };

  const ambientContact = (type) => {
    const d = daily();
    const key = `${getLocationId()}:${type}`;
    d.ambientContacts[key] = (d.ambientContacts[key] || 0) + 1;
    const count = d.ambientContacts[key];
    const roll = stableRoll(`ambient:${getDay()}:${getTime()}:${key}:${count}`);

    const labels = {
      passerby: "通行人",
      police: "警官",
      homeless: "路上生活者",
      thug: "不良",
      resident: "住民",
      volunteer: "支援関係者",
      shopClerk: "店員",
      laborStaff: "職員",
      recycler: "廃品回収関係者"
    };

    let text = "短い接触だけで終わった。";
    if (type === "passerby") text = roll < 0.18 ? "声をかけると短く応じたが、そのまま立ち去った。" : "目を合わせず通り過ぎていった。";
    if (type === "resident") text = roll < 0.35 ? "こちらを気にして様子を見ている。長く居続ければ警戒されそうだ。" : "特に関わらず通り過ぎた。";
    if (type === "police") text = roll < 0.45 ? "巡回中の警官がこちらの様子を確認している。" : "巡回中の警官は今のところ通り過ぎた。";
    if (type === "homeless") text = "見覚えのない路上生活者がいる。互いに警戒している距離だ。";
    if (type === "thug") {
      if (roll < 0.30) {
        const loss = Math.min(HMW.state.player.money, 10);
        HMW.state.player.money -= loss;
        text = loss > 0 ? `絡まれ、${loss}を失った。` : "絡まれたが、取られる金もなく追い払われた。";
      } else {
        text = "視線を向けられたが、今のところ直接は絡まれていない。";
      }
    }
    addHistory("ambient_contact", text, { type });
    showResult(labels[type] || type, [text]);
  };

  const rest = () => {
    const p = HMW.state.player;
    if (p.lifeStatus === "collapsed") {
      waitForHelp();
      return;
    }
    const c = getCondition();
    c.fatigue = clamp(c.fatigue - 15);
    daily().restCount += 1;
    HMW.app?.advanceTime?.(1);
    addHistory("rest", "しばらく休んだ。");
    const critical = resolveCriticalState("rest");
    if (critical.blocked && c.health <= 0) return;
    showResult("休む", ["身体を休めた。疲労は少し軽くなったが、時間が過ぎた分だけ空腹は進んだ。", conditionWarning()]);
  };

  const wash = () => {
    const loc = getLocation();
    if (!loc?.services?.wash) return;
    if (daily().washed) {
      showResult("身なりを整える", ["今日はすでにここで身なりを整えている。"]);
      return;
    }
    const c = getCondition();
    c.hygiene = clamp(c.hygiene + 18);
    c.wetness = clamp(c.wetness - 4);
    daily().washed = true;
    addHistory("wash", `${loc.name}で身なりを整えた。`);
    showResult("身なりを整える", ["使える範囲で汚れを落とした。十分な入浴や洗濯とは違うが、少し整った。"]);
  };

  const begging = () => {
    const loc = getLocation();
    const d = daily();
    if (!loc?.services?.begging) return;
    const critical = resolveCriticalState("begging");
    if (critical.blocked) {
      showResult("動けない", [critical.reason]);
      return;
    }
    if (d.beggingAttempts >= 3) {
      showResult("金を求める", ["今日はこの辺りで何度も人に声をかけた。これ以上続けると警戒されやすい。"]);
      return;
    }

    d.beggingAttempts += 1;
    const c = getCondition();
    c.hunger = clamp(c.hunger + 1);
    c.fatigue = clamp(c.fatigue + 3);
    HMW.app?.advanceTime?.(1);

    const roll = stableRoll(`beg:${getDay()}:${getLocationId()}:${d.beggingAttempts}`);
    let amount = 0;
    let text = "何人かに声をかけたが、金にはならなかった。";
    if (roll < 0.28) {
      amount = 5 + Math.floor(stableRoll(`beg-money:${getDay()}:${d.beggingAttempts}`) * 16);
      HMW.state.player.money += amount;
      text = `${amount}だけ手元に残った。安定した収入にはならない。`;
    } else if (roll > 0.88) {
      text = "人の目が厳しくなり、この場所ではこれ以上続けにくい。";
    }
    addHistory("begging", text, { money: amount });
    resolveCriticalState("begging-end");
    showResult("金を求める", [text, conditionWarning()]);
  };

  const scavenge = () => {
    const loc = getLocation();
    const d = daily();
    if (!loc?.services?.dumpster) return;
    const critical = resolveCriticalState("scavenge");
    if (critical.blocked) {
      showResult("動けない", [critical.reason]);
      return;
    }
    if (d.scavengingAttempts >= 3) {
      showResult("使えるものを探す", ["今日はすでに何度も探している。目につくものはほとんど残っていない。"]);
      return;
    }

    d.scavengingAttempts += 1;
    const c = getCondition();
    c.hunger = clamp(c.hunger + 1);
    c.fatigue = clamp(c.fatigue + 3);
    HMW.app?.advanceTime?.(1);

    const roll = stableRoll(`scavenge:${getDay()}:${getLocationId()}:${d.scavengingAttempts}`);
    let text = "時間をかけて探したが、持っていく価値のあるものは見つからなかった。";
    if (roll < 0.28) {
      HMW.addItem?.("scrap_piece", 1);
      text = "換金できるかもしれない廃品を一つ見つけた。";
    } else if (roll < 0.38) {
      HMW.addItem?.("cardboard", 1);
      text = "まだ使えそうな段ボールを見つけた。";
    } else if (roll < 0.43) {
      HMW.addItem?.("leftover_food", 1);
      text = "廃棄された食べ物を見つけた。食べられるかは分からない。";
    }
    addHistory("scavenge", text);
    resolveCriticalState("scavenge-end");
    showResult("使えるものを探す", [text, conditionWarning()]);
  };

  const sellScrap = () => {
    const count = HMW.getItemCount?.("scrap_piece") || 0;
    if (!count) {
      showResult("廃品を売る", ["売れる廃品を持っていない。"]);
      return;
    }
    const unit = 8 + Math.floor(stableRoll(`scrap-price:${getDay()}`) * 9);
    const total = unit * count;
    HMW.removeItem?.("scrap_piece", count);
    HMW.state.player.money += total;
    addHistory("sell", `廃品${count}個を${total}で売った。`, { money: total });
    showResult("廃品を売る", [`廃品${count}個を引き取ってもらい、${total}になった。大きな収入ではない。`]);
  };

  const buyItem = (itemId, price) => {
    const item = HMW.getItem?.(itemId);
    if (!item) return;
    if (HMW.state.player.money < price) {
      showResult("買う", [`${item.name}は${price}。今の所持金では買えない。`]);
      return;
    }
    HMW.state.player.money -= price;
    HMW.addItem?.(itemId, 1);
    addHistory("buy", `${item.name}を${price}で買った。`, { itemId, money: -price });
    showResult("買う", [`${item.name}を${price}で買った。`]);
  };

  const openShop = () => {
    const content = modal("買う");
    if (!content) return;
    content.append(paragraph(`所持金 ${HMW.state.player.money}`));
    content.append(button("パン 30", () => buyItem("bread", 30), HMW.state.player.money < 30));
    content.append(button("ウェットティッシュ 25", () => buyItem("wet_wipes", 25), HMW.state.player.money < 25));
    content.append(button("手当用品 55", () => buyItem("bandage", 55), HMW.state.player.money < 55));
  };

  const useItem = (itemId) => {
    const c = getCondition();
    const loc = getLocation();
    let text = "今ここでは使えない。";
    let consumed = false;

    if (itemId === "food_pack") {
      c.hunger = clamp(c.hunger - 18);
      text = "支援でもらった食料を食べた。";
      consumed = true;
    } else if (itemId === "leftover_food") {
      c.hunger = clamp(c.hunger - 13);
      const bad = stableRoll(`leftover:${getDay()}:${getTime()}:${HMW.state.player.survival.movementCount}`) < 0.12;
      if (bad) {
        c.health = clamp(c.health - 5);
        text = "廃棄された食べ物を口にした。空腹はましになったが、体調を崩した。";
      } else {
        text = "廃棄された食べ物を食べた。空腹はいくらかましになった。";
      }
      consumed = true;
    } else if (itemId === "bread") {
      c.hunger = clamp(c.hunger - 10);
      text = "パンを食べた。";
      consumed = true;
    } else if (itemId === "wet_wipes") {
      c.hygiene = clamp(c.hygiene + 8);
      text = "ウェットティッシュで汚れを少し落とした。";
      consumed = true;
    } else if (itemId === "soap" && loc?.services?.wash) {
      c.hygiene = clamp(c.hygiene + 15);
      text = "石けんを使って、できる範囲で身体を洗った。";
      consumed = true;
    } else if (itemId === "bandage") {
      c.health = clamp(c.health + 7);
      text = "手当用品を使った。";
      consumed = true;
    }

    if (consumed) HMW.removeItem?.(itemId, 1);
    if (consumed && HMW.state.player.lifeStatus === "collapsed" && c.health > 0) HMW.state.player.lifeStatus = "active";
    addHistory("item_use", text, { itemId, consumed });
    showResult("持ち物", [text, conditionWarning()]);
  };

  const openInventory = () => {
    const content = modal("持ち物");
    if (!content) return;
    const items = HMW.getInventorySummary?.() || [];
    if (!items.length) {
      content.append(paragraph("持ち物はない。"));
      return;
    }
    items.forEach((item) => {
      content.append(heading(`${item.name}${item.quantity > 1 ? ` ×${item.quantity}` : ""}`));
      if (item.usable) content.append(button("使う", () => useItem(item.id)));
    });
  };

  const findSleepSpot = () => {
    const loc = getLocation();
    if (!loc?.services?.sleep) return;
    if (!["evening", "night", "lateNight"].includes(getTime())) {
      showResult("寝場所を探す", ["まだ人通りや周囲の状況が変わりやすく、今ここを今夜の寝場所にできるか判断しにくい。"]);
      return;
    }

    const d = daily();
    const id = getLocationId();
    d.sleepSpotAttempts[id] = (d.sleepSpotAttempts[id] || 0) + 1;
    const attempt = d.sleepSpotAttempts[id];
    const risk = (loc.risks?.police || 0) + (loc.risks?.thugs || 0) + (loc.risks?.theft || 0);
    let chance = clamp(0.76 - risk * 0.08, 0.20, 0.72);
    if (ensureState().social.knownTips.includes("park_sleep") && id === "park") chance += 0.10;
    const roll = stableRoll(`sleep:${getDay()}:${id}:${attempt}`);

    if (roll < chance) {
      HMW.state.player.sleepingPlaceId = id;
      addHistory("sleep_spot", `${loc.name}で今夜休めそうな場所を確保した。`);
      showResult("寝場所", ["今夜ここで横になれそうな場所を見つけた。ただし安全が保証されたわけではない。"], [
        { label: "ここで寝る", onClick: sleepNow }
      ]);
    } else {
      HMW.state.player.sleepingPlaceId = null;
      addHistory("sleep_spot", `${loc.name}では今夜の寝場所を確保できなかった。`);
      showResult("寝場所", ["人目、巡回、先客、周囲の危険などがあり、今夜ここで落ち着いて寝るのは難しそうだ。"]);
    }
  };

  function sleepNow() {
    const id = HMW.state.player.sleepingPlaceId;
    if (!id || id !== getLocationId()) {
      showResult("寝る", ["今夜休める場所をまだ確保していない。"]);
      return;
    }
    const order = ["morning", "daytime", "evening", "night", "lateNight"];
    const index = Math.max(0, order.indexOf(getTime()));
    const steps = order.length - index;
    const oldDay = getDay();
    HMW.app?.advanceTime?.(steps);
    if (getDay() > oldDay) {
      HMW.state.player.sleepingPlaceId = null;
      ensureState();
    }
    addHistory("sleep", "確保した場所で夜を越した。");
    const critical = resolveCriticalState("sleep-end");
    if (critical.blocked && getCondition().health <= 0) return;
    showResult("朝", ["夜を越した。十分な休息とは限らないが、次の日になった。", conditionWarning()]);
  }

  const getContextActions = () => {
    const loc = getLocation();
    if (!loc) return [];
    const actions = [];

    actions.push({ id: "rest", label: "少し休む", run: rest });
    if (loc.services?.wash) actions.push({ id: "wash", label: "身なりを整える", run: wash });
    if (loc.services?.begging) actions.push({ id: "beg", label: "人に金を求める", run: begging });
    if (loc.services?.dumpster) actions.push({ id: "scavenge", label: "使えるものを探す", run: scavenge });
    if (loc.services?.buy) actions.push({ id: "buy", label: "安い物を買う", run: openShop });
    if (getLocationId() === "charity_center") {
      actions.push({ id: "food_support", label: "食料支援を確認する", run: foodSupport });
      actions.push({ id: "support_consult", label: "生活相談をする", run: supportConsult });
    }
    if (loc.services?.sleep) actions.push({ id: "sleep_spot", label: "今夜の寝場所を探す", run: findSleepSpot });
    if (getLocationId() === "recycling_yard") actions.push({ id: "sell_scrap", label: "廃品を売る", run: sellScrap });
    if (["labor_office", "industrial_street", "charity_center", "recycling_yard", "convenience_store"].includes(getLocationId())) {
      actions.push({ id: "work_search", label: "仕事につながるものを探す", run: () => HMW.jobSearch?.open?.() });
    }

    return actions;
  };

  const sceneSummary = () => {
    ensureState();
    const loc = getLocation();
    if (!loc) return "場所情報を読み込めない。";

    const people = possiblePeople();
    const event = getArrivalEvent();
    const actions = getContextActions();
    const parts = [];

    const district = HMW.worldData?.districts?.[loc.districtId]?.name;
    if (district) parts.push(`${district}にいる。`);
    if (people.length) parts.push(`${people.map((p) => p.displayName || p.label || p.name || p.id).slice(0, 3).join("、")}がいる。`);
    else if (ambientTypes().length) parts.push(`${ambientTypes().length}種類ほどの人の出入りがある。`);
    else parts.push("今は目立って関われる人はいない。" );
    if (event?.summary) parts.push(event.summary);
    if (actions.length) parts.push(`ここでは「${actions.slice(0, 3).map((a) => a.label).join("」「")}」などができる。`);
    const warning = conditionWarning();
    if (warning) parts.push(warning);
    return parts.join(" ");
  };

  const refreshScene = () => {
    const text = document.getElementById("sceneText");
    if (text) text.textContent = sceneSummary();
    const slot1 = document.querySelector('[data-action-slot="1"]');
    const slot2 = document.querySelector('[data-action-slot="2"]');
    const slot3 = document.querySelector('[data-action-slot="3"]');
    if (slot1) slot1.textContent = "移動する";
    if (slot2) slot2.textContent = "周囲・行動";
    if (slot3) slot3.textContent = "手がかり";
  };

  function refresh() {
    HMW.app?.render?.();
    HMW.renderConditionPanel?.();
    refreshScene();
  }

  const openCurrentScene = (titleText = null) => {
    ensureState();
    const content = modal(titleText || getLocation()?.name || "周囲");
    if (!content) return;

    const warning = conditionWarning();
    if (warning) content.append(paragraph(warning));

    const event = getArrivalEvent();
    renderEvent(content, event);

    const people = possiblePeople();
    if (people.length) {
      content.append(heading("ここにいる人"));
      people.forEach((npc) => content.append(button(npc.displayName || npc.label || npc.name || npc.id, () => contactNpc(npc))));
    }

    const ambient = ambientTypes();
    if (ambient.length) {
      const labels = {
        passerby: "通行人",
        police: "警官",
        homeless: "路上生活者",
        thug: "不良",
        resident: "住民",
        volunteer: "支援関係者",
        shopClerk: "店員",
        laborStaff: "職員",
        recycler: "廃品回収関係者"
      };
      content.append(heading("周囲の人"));
      ambient.slice(0, 4).forEach((type) => content.append(button(labels[type] || type, () => ambientContact(type))));
    }

    const actions = getContextActions();
    content.append(heading("ここでできること"));
    actions.forEach((action) => content.append(button(action.label, action.run)));
  };

  const moveTo = (locationId) => {
    const current = HMW.worldData.locations[getLocationId()];
    if (!current?.connections?.includes(locationId)) return;

    const critical = resolveCriticalState("move-start");
    if (critical.blocked) {
      showResult("移動できない", [critical.reason]);
      return;
    }

    applyMovementCost();
    HMW.state.world.locationId = locationId;
    HMW.state.player.sleepingPlaceId = null;
    addHistory("move", `${HMW.getLocation?.(locationId)?.name || locationId}へ移動した。`);
    refresh();

    const after = resolveCriticalState("move-end");
    if (after.blocked && getCondition().health <= 0) return;
    openCurrentScene(HMW.getLocation?.(locationId)?.name || "到着");
  };

  const openMove = () => {
    const critical = resolveCriticalState("open-move");
    if (critical.blocked) {
      showResult("移動できない", [critical.reason]);
      return;
    }

    const content = modal("移動");
    if (!content) return;
    const destinations = HMW.getConnectedLocations?.(getLocationId()) || [];
    if (!destinations.length) {
      content.append(paragraph("ここから直接移動できる場所はない。"));
      return;
    }
    destinations.forEach((loc) => content.append(button(loc.name, () => moveTo(loc.id))));
  };

  const openGuide = () => {
    ensureState();
    const c = getCondition();
    const p = HMW.state.player;
    const lines = [];

    if (p.lifeStatus === "collapsed") {
      showResult("今できること", ["倒れていて通常の行動はできない。助けを待つしかない。"], [
        { label: "助けを待つ", onClick: waitForHelp }
      ]);
      return;
    }

    if (c.hunger >= 70 && !(HMW.getItemCount?.("food_pack") || HMW.getItemCount?.("bread") || HMW.getItemCount?.("leftover_food"))) {
      lines.push("食料がない。昼の支援施設、買える食料、使える物探しのいずれかが必要。食料支援は毎日必ずあるわけではない。" );
    }
    if (c.fatigue >= 75) lines.push("疲労が強い。今いる場所で休むか、夜なら寝場所を確保する必要がある。" );
    if (c.hygiene < 30) lines.push("清潔状態が悪く、仕事によっては応募条件で不利になる。公衆トイレか支援施設で身なりを整えられる。" );

    const missing = Object.entries(p.workAccess || {}).filter(([, value]) => !value).map(([key]) => key);
    if (missing.length) {
      lines.push("通常の仕事に進むための条件が足りない。支援施設で生活相談を続けると、連絡先住所・本人確認・電話・口座の手続きを順番に進められる。" );
    } else {
      lines.push("仕事応募の基礎条件はそろっている。職業相談所や工業地区などで募集を探せるが、募集・採用は保証されない。" );
    }

    if ((HMW.getItemCount?.("scrap_piece") || 0) > 0) lines.push("売れそうな廃品を持っている。廃品回収所で換金できる。" );
    if (p.progression.social.knownTips.includes("charity_meal")) lines.push("路上生活者から、支援施設の食料配布は昼だと聞いている。" );
    if (!lines.length) lines.push("今すぐ解決する課題は一つではない。食料、休息、寝床、支援、人間関係、仕事への準備のどれを優先するか選べる。" );

    showResult("手がかり", lines);
  };

  const getTurnContext = () => {
    ensureState();
    const loc = getLocation();
    const people = possiblePeople().map((p) => ({
      id: p.id,
      name: p.displayName || p.label || p.name || p.id,
      role: p.role || p.type || null,
      romance: Boolean(p.romance)
    }));
    const event = getArrivalEvent();
    const actions = getContextActions().map((a) => ({ id: a.id, label: a.label }));
    const moves = (HMW.getConnectedLocations?.(getLocationId()) || []).map((l) => ({ id: l.id, label: l.name }));

    return {
      stateVersion: HMW.state.meta?.stateVersion || null,
      day: getDay(),
      time: getTime(),
      weather: HMW.state.world.weather,
      locationId: getLocationId(),
      locationName: loc?.name || null,
      lifeStatus: HMW.state.player.lifeStatus,
      money: HMW.state.player.money,
      condition: clone(getCondition()),
      sleepingPlaceId: HMW.state.player.sleepingPlaceId,
      workAccess: clone(HMW.state.player.workAccess),
      supportProgress: clone(HMW.state.player.progression.support),
      inventory: HMW.getInventorySummary?.() || clone(HMW.state.player.inventory),
      people,
      ambientPeople: clone(ambientTypes()),
      event: event ? { id: event.id, name: event.name, summary: event.summary, outcomes: clone(event.outcomes || {}) } : null,
      allowedActions: actions,
      allowedMoves: moves,
      knownTips: clone(HMW.state.player.progression.social.knownTips),
      warning: conditionWarning()
    };
  };

  const getAIPacket = () => ({
    instruction: "このcontextにない人物・資源・仕事・支援結果・所持品・金銭変化・移動結果をAIが新規確定してはいけない。ユーザーの行動に対応するJS上の処理結果だけを描写する。",
    rules: typeof HMW.getAIRulesText === "function" ? HMW.getAIRulesText() : null,
    context: getTurnContext()
  });

  document.addEventListener("click", (event) => {
    const move = event.target.closest?.('[data-action-slot="1"]');
    const around = event.target.closest?.('[data-action-slot="2"]');
    const guide = event.target.closest?.('[data-action-slot="3"]');
    const inventory = event.target.closest?.("#inventoryButton");

    if (move) {
      event.preventDefault();
      event.stopImmediatePropagation();
      openMove();
      return;
    }
    if (around) {
      event.preventDefault();
      event.stopImmediatePropagation();
      openCurrentScene();
      return;
    }
    if (guide) {
      event.preventDefault();
      event.stopImmediatePropagation();
      openGuide();
      return;
    }
    if (inventory) {
      event.preventDefault();
      event.stopImmediatePropagation();
      openInventory();
    }
  }, true);

  document.addEventListener("DOMContentLoaded", () => {
    ensureState();
    refreshScene();
    resolveCriticalState("load");
  });

  HMW.lifeLoop = {
    ensureState,
    openCurrentScene,
    openMove,
    openGuide,
    moveTo,
    getContextActions,
    getTurnContext,
    getAIPacket,
    conditionWarning,
    resolveCriticalState
  };
  HMW.getTurnContext = getTurnContext;
  HMW.getAIPacket = getAIPacket;
})();