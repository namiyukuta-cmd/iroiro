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

  const getLocation = () => HMW.getLocation?.(HMW.state.world.locationId) || null;
  const getTime = () => HMW.state.world.time;
  const getDay = () => HMW.state.world.day;
  const getCondition = () => HMW.state.player.condition;

  const ensureState = () => {
    const p = HMW.state.player;
    p.progression = p.progression || {};
    p.progression.support = p.progression.support || {
      caseOpened: false,
      visits: 0,
      contactAddress: { status: "not_started", readyDay: null },
      identityDocument: { status: "not_started", readyDay: null },
      phone: { status: "not_started", readyDay: null },
      bankAccount: { status: "not_started", readyDay: null }
    };
    p.progression.daily = p.progression.daily || {};
    p.progression.social = p.progression.social || { lastMeaningfulContact: {} };
    p.progression.social.lastMeaningfulContact = p.progression.social.lastMeaningfulContact || {};
    p.survival = p.survival || {};
    p.survival.movesThisSlot = isNumber(p.survival.movesThisSlot) ? p.survival.movesThisSlot : 0;
    p.survival.movementCount = isNumber(p.survival.movementCount) ? p.survival.movementCount : 0;
    p.workAccess = p.workAccess || {
      identityDocument: false,
      phone: false,
      bankAccount: false,
      contactAddress: false
    };

    const d = p.progression.daily;
    if (d.day !== getDay()) {
      p.progression.daily = {
        day: getDay(),
        beggingAttempts: 0,
        scavengingAttempts: 0,
        restCount: 0,
        washed: false,
        foodSupportReceived: false,
        supportConsulted: false,
        sleepSpotAttempts: {},
        npcContacts: {}
      };
    } else {
      d.beggingAttempts = d.beggingAttempts || 0;
      d.scavengingAttempts = d.scavengingAttempts || 0;
      d.restCount = d.restCount || 0;
      d.washed = Boolean(d.washed);
      d.foodSupportReceived = Boolean(d.foodSupportReceived);
      d.supportConsulted = Boolean(d.supportConsulted);
      d.sleepSpotAttempts = d.sleepSpotAttempts || {};
      d.npcContacts = d.npcContacts || {};
    }

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
      locationId: HMW.state.world.locationId,
      type,
      text,
      ...clone(extra)
    });
  };

  const refresh = () => {
    HMW.app?.render?.();
    HMW.renderConditionPanel?.();
    const slot2 = document.querySelector('[data-action-slot="2"]');
    if (slot2) slot2.textContent = "周囲・行動";
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
    p.style.lineHeight = "1.7";
    return p;
  };

  const button = (label, fn, disabled = false) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "action-button";
    b.textContent = label;
    b.disabled = disabled;
    b.addEventListener("click", fn);
    return b;
  };

  const heading = (text) => {
    const h = document.createElement("strong");
    h.textContent = text;
    h.style.display = "block";
    h.style.margin = "14px 0 8px";
    return h;
  };

  const showResult = (titleText, lines, actions = []) => {
    const content = modal(titleText);
    if (!content) return;
    lines.filter(Boolean).forEach((line) => content.append(paragraph(line)));
    actions.forEach((action) => content.append(button(action.label, action.onClick, action.disabled)));
    refresh();
  };

  const getRelationship = (npcId) => {
    if (!npcId) return null;
    HMW.state.relationships = HMW.state.relationships || {};
    if (!HMW.state.relationships[npcId]) {
      const npc = HMW.getNpc?.(npcId);
      if (npc?.relationship) HMW.state.relationships[npcId] = clone(npc.relationship);
      else HMW.state.relationships[npcId] = { familiarity: 0, trust: 0, goodwill: 0, caution: 0 };
    }
    return HMW.state.relationships[npcId];
  };

  const conditionWarning = () => {
    const c = getCondition();
    if (c.health <= 15) return "体力がかなり落ちている。無理に動くのは危険だ。";
    if (c.hunger >= 95) return "空腹が限界に近く、まともに動き続けられない。";
    if (c.fatigue >= 95) return "疲労が限界に近く、足元も危うい。";
    if (c.warmth <= 15) return "身体が冷え切っている。まず寒さをしのぐ必要がある。";
    return null;
  };

  const applyStrain = (kind = "action") => {
    const c = getCondition();
    let damage = 0;
    if (c.hunger >= 80) damage += 1;
    if (c.hunger >= 95) damage += 2;
    if (c.fatigue >= 85) damage += 1;
    if (c.warmth <= 20) damage += 2;
    if (c.wetness >= 80) damage += 1;
    if (damage > 0) c.health = clamp(c.health - damage);

    if (kind === "search") {
      c.hunger = clamp(c.hunger + 1);
      c.fatigue = clamp(c.fatigue + 3);
    }
  };

  const canDoDemandingAction = () => {
    const c = getCondition();
    if (c.health <= 10) return { ok: false, reason: "体力が落ちすぎている。まず休むか支援につながる必要がある。" };
    if (c.hunger >= 95) return { ok: false, reason: "空腹が限界で、この行動を続けられない。" };
    if (c.fatigue >= 95) return { ok: false, reason: "疲労が限界で、この行動を続けられない。" };
    return { ok: true, reason: "" };
  };

  const maybeCollapse = (key) => {
    const c = getCondition();
    let chance = 0;
    if (c.hunger >= 90) chance += 0.28;
    if (c.fatigue >= 90) chance += 0.30;
    if (c.health <= 20) chance += 0.22;
    if (c.warmth <= 15) chance += 0.22;
    if (chance <= 0 || stableRoll(`${key}:${getDay()}:${getTime()}:${HMW.state.player.survival.movementCount}`) >= Math.min(0.85, chance)) return false;

    c.health = clamp(c.health - 5);
    c.fatigue = clamp(c.fatigue + 8);
    HMW.app?.advanceTime?.(1);
    addHistory("collapse", "体調が悪化し、その場で動けなくなって時間を失った。");
    showResult("動けない", ["身体がついてこない。しばらくその場から動けず、時間だけが過ぎた。", conditionWarning()]);
    return true;
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
    s.movesThisSlot += 1;
    applyStrain();

    if (s.movesThisSlot >= 2) {
      s.movesThisSlot = 0;
      HMW.app?.advanceTime?.(1);
    }
  };

  const possiblePeople = () => {
    const locationId = HMW.state.world.locationId;
    const time = getTime();
    const regular = HMW.getNpcsAtLocation?.(locationId, time) || [];
    const romance = HMW.getLoveInterestsAtLocation?.(locationId, time) || [];
    return [...regular, ...romance.map((person) => ({ ...person, romance: true }))];
  };

  const contactNpc = (npc) => {
    const d = daily();
    const already = Boolean(d.npcContacts[npc.id]);
    d.npcContacts[npc.id] = true;

    let relationship = null;
    if (npc.romance && HMW.ensureLoveInterestRelationship) {
      relationship = HMW.ensureLoveInterestRelationship(npc.id);
    } else {
      relationship = getRelationship(npc.id);
    }

    if (relationship && !already) relationship.familiarity = (relationship.familiarity || 0) + 1;
    HMW.state.player.progression.social.lastMeaningfulContact[npc.id] = { day: getDay(), time: getTime() };
    addHistory("npc_contact", `${npc.displayName || npc.label || npc.name || npc.id}と接触した。`, { npcId: npc.id });

    const lines = [];
    if (npc.templateId === "volunteer" || npc.id === "charity_staff") {
      lines.push("支援施設の職員と話せる。相談内容によっては、食料だけでなく住所・身分証・連絡手段などの手続きにつながる。即日すべて解決するわけではない。");
    } else if (npc.templateId === "laborStaff" || npc.id === "labor_staff") {
      lines.push("職員は求人の有無だけでなく、応募に足りない条件も確認する。条件が欠けていれば、その日は仕事にはつながらない。");
    } else if (npc.templateId === "homeless") {
      lines.push("同じ場所で暮らしている人から、支援の時間や危険な場所などの情報を聞けることがある。ただし初対面から何でも教えてくれるわけではない。");
    } else if (npc.templateId === "shopClerk") {
      lines.push("店員は客として対応する。顔馴染みになっても、店の都合や警戒は残る。");
    } else if (npc.templateId === "police") {
      lines.push("警官はまず職務上の立場で対応する。こちらの事情だけで態度が決まるわけではない。");
    } else if (npc.romance) {
      lines.push("顔を合わせた。関係はこの一度では決まらない。相手の立場とこれまでの接触が次回以降に残る。");
    } else {
      lines.push("短い接触になった。相手がこちらを覚えるかどうかは、今後の積み重ね次第だ。");
    }

    showResult(npc.displayName || npc.label || npc.name || "人", lines);
  };

  const maybeEncounter = () => {
    const people = possiblePeople();
    if (!people.length) return false;

    const loc = getLocation();
    const base = people.some((p) => p.romance) ? 0.55 : 0.68;
    const roll = stableRoll(`encounter:${HMW.state.world.locationId}:${getDay()}:${getTime()}:${HMW.state.player.survival.movementCount}`);
    if (roll >= base) return false;

    const index = Math.floor(stableRoll(`encounter-pick:${getDay()}:${getTime()}:${HMW.state.world.locationId}`) * people.length);
    const npc = people[Math.min(index, people.length - 1)];
    const content = modal("遭遇");
    if (!content) return false;
    content.append(paragraph(`${loc?.name || "この場所"}で、${npc.displayName || npc.label || npc.name || "誰か"}と顔を合わせた。`));
    content.append(button("話しかける", () => contactNpc(npc)));
    content.append(button("そのままにする", () => {
      addHistory("npc_pass", `${npc.displayName || npc.label || npc.name || npc.id}とは話さずに通り過ぎた。`, { npcId: npc.id });
      closeModal();
      refresh();
    }));
    return true;
  };

  const moveTo = (locationId) => {
    const current = HMW.worldData.locations[HMW.state.world.locationId];
    if (!current?.connections?.includes(locationId)) return;

    const demanding = canDoDemandingAction();
    if (!demanding.ok) {
      showResult("移動できない", [demanding.reason]);
      return;
    }

    if (maybeCollapse(`move:${locationId}`)) return;

    applyMovementCost();
    HMW.state.world.locationId = locationId;
    HMW.state.player.sleepingPlaceId = null;
    addHistory("move", `${HMW.getLocation?.(locationId)?.name || locationId}へ移動した。`);
    closeModal();
    refresh();

    if (!maybeEncounter()) {
      const warning = conditionWarning();
      if (warning) HMW.app?.showNotice?.(warning);
    }
  };

  const openMove = () => {
    const content = modal("移動");
    if (!content) return;
    const destinations = HMW.getConnectedLocations?.(HMW.state.world.locationId) || [];
    if (!destinations.length) {
      content.append(paragraph("ここから直接移動できる場所はない。"));
      return;
    }
    const warning = conditionWarning();
    if (warning) content.append(paragraph(warning));
    destinations.forEach((loc) => content.append(button(loc.name, () => moveTo(loc.id))));
  };

  const rest = () => {
    const c = getCondition();
    c.fatigue = clamp(c.fatigue - 12);
    daily().restCount += 1;
    HMW.app?.advanceTime?.(1);
    addHistory("rest", "しばらく休んだ。");
    showResult("休む", ["しばらく身体を休めた。時間が過ぎ、空腹は少し進んだ。", conditionWarning()]);
  };

  const wash = () => {
    const loc = getLocation();
    if (!loc?.services?.wash) return;
    const d = daily();
    if (d.washed) {
      showResult("身なりを整える", ["今日はすでにここで身なりを整えている。これ以上できることは少ない。"]);
      return;
    }
    const c = getCondition();
    c.hygiene = clamp(c.hygiene + 18);
    c.wetness = clamp(c.wetness - 4);
    d.washed = true;
    addHistory("wash", `${loc.name}で身なりを整えた。`);
    showResult("身なりを整える", ["使える範囲で身体と服の汚れを落とした。十分な入浴や洗濯とは違うが、少し整った。"]);
  };

  const begging = () => {
    const loc = getLocation();
    const d = daily();
    if (!loc?.services?.begging) return;
    if (d.beggingAttempts >= 3) {
      showResult("金を求める", ["今日はこの辺りで何度も人に声をかけた。これ以上続けると、警戒されたり移動を求められたりする可能性が高い。"]);
      return;
    }

    d.beggingAttempts += 1;
    applyStrain("search");
    HMW.app?.advanceTime?.(1);
    const roll = stableRoll(`beg:${getDay()}:${HMW.state.world.locationId}:${d.beggingAttempts}`);
    let amount = 0;
    let text = "何人かに声をかけたが、金にはならなかった。";
    if (roll < 0.28) {
      amount = 5 + Math.floor(stableRoll(`beg-money:${getDay()}:${d.beggingAttempts}`) * 16);
      HMW.state.player.money += amount;
      text = `${amount}だけ手元に残った。長く続けても安定した収入にはならない。`;
    } else if (roll > 0.88) {
      text = "人の目が厳しくなり、この場所ではこれ以上続けにくい。";
    }
    addHistory("begging", text, { money: amount });
    showResult("金を求める", [text, conditionWarning()]);
  };

  const scavenge = () => {
    const loc = getLocation();
    const d = daily();
    if (!loc?.services?.dumpster) return;
    if (d.scavengingAttempts >= 3) {
      showResult("使えるものを探す", ["今日はすでに何度も探している。目につくものはほとんど残っていない。"]);
      return;
    }
    const demanding = canDoDemandingAction();
    if (!demanding.ok) {
      showResult("使えるものを探す", [demanding.reason]);
      return;
    }

    d.scavengingAttempts += 1;
    applyStrain("search");
    HMW.app?.advanceTime?.(1);
    const roll = stableRoll(`scavenge:${getDay()}:${HMW.state.world.locationId}:${d.scavengingAttempts}`);
    let text = "時間をかけて探したが、持っていく価値のあるものは見つからなかった。";
    if (roll < 0.28) {
      HMW.addItem?.("scrap_piece", 1);
      text = "換金できるかもしれない廃品を一つ見つけた。";
    } else if (roll < 0.38) {
      HMW.addItem?.("cardboard", 1);
      text = "まだ使えそうな段ボールを見つけた。";
    } else if (roll < 0.43) {
      HMW.addItem?.("leftover_food", 1);
      text = "食べられるか判断が必要な、廃棄された食べ物を見つけた。安全とは限らない。";
    }
    addHistory("scavenge", text);
    showResult("使えるものを探す", [text, conditionWarning()]);
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

    const event = (HMW.getEligibleEvents?.() || []).find((e) => e.id === "charity_meal");
    if (!event) {
      showResult("食料支援", ["今日は配布がないか、すでに予定数が終わっている。"]);
      return;
    }

    HMW.addItem?.("food_pack", 1);
    d.foodSupportReceived = true;
    addHistory("food_support", "支援施設で一人分の食料を受け取った。");
    showResult("食料支援", ["一人分の食料を受け取った。今食べるか、後で使うかは持ち物から選べる。"]);
  };

  const processSupportStep = (key, label, waitDays) => {
    const support = ensureState().support;
    const item = support[key];
    if (!item) return null;

    if (item.status === "ready") return `${label}はすでに確保できている。`;
    if (item.status === "pending") {
      if (getDay() >= item.readyDay) {
        item.status = "ready";
        HMW.state.player.workAccess[key] = true;
        return `${label}の手続きが進み、仕事の応募条件として使える状態になった。`;
      }
      return `${label}は手続き中。今日すぐには終わらない。`;
    }

    item.status = "pending";
    item.readyDay = getDay() + waitDays;
    return `${label}の手続きを始めた。即日では終わらない。`;
  };

  const supportConsult = () => {
    const d = daily();
    const support = ensureState().support;
    if (d.supportConsulted) {
      showResult("生活相談", ["今日はすでに相談している。必要な手続きは次の開所日や準備待ちになっている。"]);
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

    const availability = stableRoll(`support:${getDay()}:${support.visits}`);
    if (availability > 0.82) {
      addHistory("support", "相談したが、この日は必要な手続きを進められなかった。");
      showResult("生活相談", ["相談はできたが、担当や必要な手続きの都合で今日は先に進まなかった。次回また来る必要がある。"]);
      return;
    }

    let result;
    if (!HMW.state.player.workAccess.contactAddress) {
      result = processSupportStep("contactAddress", "連絡先として使える住所", 1);
    } else if (!HMW.state.player.workAccess.identityDocument) {
      result = processSupportStep("identityDocument", "本人確認書類", 2);
    } else if (!HMW.state.player.workAccess.phone) {
      result = processSupportStep("phone", "連絡に使える電話", 2);
    } else if (!HMW.state.player.workAccess.bankAccount) {
      result = processSupportStep("bankAccount", "給与を受け取る口座", 2);
    } else {
      result = "応募に必要な最低限の連絡・本人確認手段はそろっている。次は求人ごとの条件と採用の問題になる。";
    }

    addHistory("support", result);
    showResult("生活相談", [result]);
  };

  const findSleepSpot = () => {
    const loc = getLocation();
    if (!loc?.services?.sleep) return;
    if (!["evening", "night", "lateNight"].includes(getTime())) {
      showResult("寝場所を探す", ["まだ人通りや周囲の状況が変わりやすく、今ここを今夜の寝場所にできるか判断しにくい。"]);
      return;
    }

    const d = daily();
    const id = HMW.state.world.locationId;
    d.sleepSpotAttempts[id] = (d.sleepSpotAttempts[id] || 0) + 1;
    const attempt = d.sleepSpotAttempts[id];
    const risk = (loc.risks?.police || 0) + (loc.risks?.thugs || 0) + (loc.risks?.theft || 0);
    const chance = clamp(0.78 - risk * 0.08, 0.22, 0.75);
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

  const sleepNow = () => {
    const id = HMW.state.player.sleepingPlaceId;
    if (!id || id !== HMW.state.world.locationId) {
      showResult("寝る", ["今夜休める場所をまだ確保していない。"]);
      return;
    }

    const order = ["morning", "daytime", "evening", "night", "lateNight"];
    const currentIndex = Math.max(0, order.indexOf(getTime()));
    const steps = order.length - currentIndex;
    const oldDay = getDay();
    HMW.app?.advanceTime?.(steps);
    if (getDay() > oldDay) {
      HMW.state.player.sleepingPlaceId = null;
      ensureState();
    }
    addHistory("sleep", "確保した場所で夜を越した。");
    showResult("朝", ["夜を越した。十分な休息とは限らないが、次の日になった。", conditionWarning()]);
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

  const getContextActions = () => {
    const loc = getLocation();
    if (!loc) return [];
    const actions = [];

    actions.push({ id: "rest", label: "少し休む", run: rest });
    if (loc.services?.wash) actions.push({ id: "wash", label: "身なりを整える", run: wash });
    if (loc.services?.begging) actions.push({ id: "beg", label: "人に金を求める", run: begging });
    if (loc.services?.dumpster) actions.push({ id: "scavenge", label: "使えるものを探す", run: scavenge });
    if (HMW.state.world.locationId === "charity_center") {
      actions.push({ id: "food_support", label: "食料支援を確認する", run: foodSupport });
      actions.push({ id: "support_consult", label: "生活相談をする", run: supportConsult });
    }
    if (loc.services?.sleep) actions.push({ id: "sleep_spot", label: "今夜の寝場所を探す", run: findSleepSpot });
    if (HMW.state.world.locationId === "recycling_yard") actions.push({ id: "sell_scrap", label: "廃品を売る", run: sellScrap });

    return actions;
  };

  const openAround = () => {
    const content = modal("周囲・行動");
    if (!content) return;
    const people = possiblePeople();
    const actions = getContextActions();
    const warning = conditionWarning();

    if (warning) content.append(paragraph(warning));

    if (people.length) {
      content.append(heading("人"));
      people.forEach((npc) => content.append(button(npc.displayName || npc.label || npc.name || npc.id, () => contactNpc(npc))));
    } else {
      content.append(paragraph("今ここで継続して話せる相手は見当たらない。"));
    }

    content.append(heading("できること"));
    actions.forEach((action) => content.append(button(action.label, action.run)));
  };

  const wrapAdvanceTime = () => {
    if (!HMW.app?.advanceTime || HMW.app.advanceTime.__lifeLoopWrapped) return;
    const original = HMW.app.advanceTime;
    const wrapped = (steps = 1) => {
      const oldDay = getDay();
      original(steps);
      if (getDay() !== oldDay) {
        HMW.state.player.sleepingPlaceId = null;
        ensureState();
      }
      return HMW.state.world.time;
    };
    wrapped.__lifeLoopWrapped = true;
    HMW.app.advanceTime = wrapped;
  };

  const getTurnContext = () => {
    ensureState();
    const location = getLocation();
    const people = possiblePeople().map((p) => ({
      id: p.id,
      name: p.displayName || p.label || p.name || p.id,
      role: p.role || p.type || null,
      romance: Boolean(p.romance)
    }));
    const actions = getContextActions().map((a) => ({ id: a.id, label: a.label }));
    const eligibleEvents = (HMW.getEligibleEvents?.() || []).map((e) => ({ id: e.id, name: e.name, summary: e.summary }));

    return {
      day: getDay(),
      time: getTime(),
      weather: HMW.state.world.weather,
      locationId: HMW.state.world.locationId,
      locationName: location?.name || null,
      money: HMW.state.player.money,
      condition: clone(getCondition()),
      sleepingPlaceId: HMW.state.player.sleepingPlaceId,
      workAccess: clone(HMW.state.player.workAccess),
      supportProgress: clone(HMW.state.player.progression.support),
      inventory: HMW.getInventorySummary?.() || clone(HMW.state.player.inventory),
      people,
      actions,
      eligibleEvents,
      warning: conditionWarning()
    };
  };

  document.addEventListener("click", (event) => {
    const move = event.target.closest?.('[data-action-slot="1"]');
    const around = event.target.closest?.('[data-action-slot="2"]');
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
      openAround();
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
    wrapAdvanceTime();
    const slot2 = document.querySelector('[data-action-slot="2"]');
    if (slot2) slot2.textContent = "周囲・行動";
  });

  HMW.lifeLoop = {
    ensureState,
    openAround,
    openMove,
    moveTo,
    getContextActions,
    getTurnContext,
    conditionWarning
  };
  HMW.getTurnContext = getTurnContext;
})();
