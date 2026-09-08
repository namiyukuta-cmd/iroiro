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
  const getLocation = () => HMW.getLocation?.(HMW.state.world.locationId) || null;
  const getCondition = () => HMW.state.player.condition;

  const ensureState = () => {
    const p = HMW.state.player;
    p.lifeStatus = p.lifeStatus || "active";
    p.causeOfDeath = p.causeOfDeath || null;
    p.survival = p.survival || {};
    p.survival.movementCount = isNumber(p.survival.movementCount) ? p.survival.movementCount : 0;
    p.survival.movesThisSlot = isNumber(p.survival.movesThisSlot) ? p.survival.movesThisSlot : 0;
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
    p.progression.social = p.progression.social || { lastMeaningfulContact: {} };
    p.progression.social.lastMeaningfulContact = p.progression.social.lastMeaningfulContact || {};

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
        npcContacts: {}
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
      p.progression.daily = oldDaily;
    }

    const support = p.progression.support;
    Object.entries(support).forEach(([key, entry]) => {
      if (!entry || typeof entry !== "object" || entry.status !== "pending") return;
      if (isNumber(entry.readyDay) && getDay() >= entry.readyDay) {
        entry.status = "ready";
        if (key in p.workAccess) p.workAccess[key] = true;
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
      locationId: HMW.state.world.locationId,
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

  const paragraph = (text) => {
    const p = document.createElement("p");
    p.textContent = text;
    p.style.margin = "0 0 12px";
    p.style.lineHeight = "1.7";
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

  const refresh = () => {
    HMW.app?.render?.();
    HMW.renderConditionPanel?.();
    const slot2 = document.querySelector('[data-action-slot="2"]');
    if (slot2) slot2.textContent = "周囲・行動";
  };

  const showResult = (title, lines, actions = []) => {
    const content = modal(title);
    if (!content) return;
    lines.filter(Boolean).forEach((line) => content.append(paragraph(line)));
    actions.forEach((action) => content.append(button(action.label, action.onClick, action.disabled)));
    refresh();
  };

  const disableGameActions = () => {
    document.querySelectorAll("[data-action-slot], #mapButton").forEach((el) => {
      el.disabled = true;
    });
  };

  const die = (reason) => {
    const p = HMW.state.player;
    if (p.lifeStatus === "dead") return true;
    p.lifeStatus = "dead";
    p.causeOfDeath = reason;
    p.condition.health = 0;
    addHistory("death", reason);
    disableGameActions();
    showResult("死亡", [reason, "このセーブでは行動を続けられない。LOADから以前の状態を読み込める。"]);
    return true;
  };

  const conditionWarning = () => {
    const c = getCondition();
    if (HMW.state.player.lifeStatus === "dead") return "死亡している。";
    if (c.health <= 10) return "体力が限界に近い。通常の移動はできない。";
    if (c.hunger >= 100) return "空腹が限界で、歩き続けられない。";
    if (c.fatigue >= 100) return "疲労が限界で、歩き続けられない。";
    if (c.warmth <= 0) return "身体が冷え切っている。移動を続けるのは危険だ。";
    if (c.hunger >= 85) return "強い空腹で体力を消耗しやすい。";
    if (c.fatigue >= 85) return "強い疲労で動作が鈍っている。";
    return null;
  };

  const resolveCriticalState = (trigger = "state") => {
    ensureState();
    const c = getCondition();
    const p = HMW.state.player;
    if (p.lifeStatus === "dead") return { dead: true, blocked: true, reason: p.causeOfDeath };
    if (c.health <= 0) return { dead: die("衰弱して動けなくなり、そのまま命を落とした。"), blocked: true, reason: "体力が尽きた。" };

    const key = `${getDay()}:${getTime()}:${trigger}`;
    let blocked = false;
    let reason = "";

    if (c.hunger >= 100) {
      blocked = true;
      reason = "空腹が限界で、立って歩き続けることができない。食べるものを確保する必要がある。";
      if (p.survival.lastCriticalKey !== key) {
        c.health = clamp(c.health - 6);
        c.fatigue = clamp(c.fatigue + 4);
        p.survival.lastCriticalKey = key;
        addHistory("critical", "空腹が限界に達し、体力を失った。", { trigger });
      }
    } else if (c.fatigue >= 100) {
      blocked = true;
      reason = "疲労が限界で、身体が言うことをきかない。休まなければ移動できない。";
      if (p.survival.lastCriticalKey !== key) {
        c.health = clamp(c.health - 4);
        p.survival.lastCriticalKey = key;
        addHistory("critical", "疲労が限界に達し、体力を失った。", { trigger });
      }
    } else if (c.warmth <= 0) {
      blocked = true;
      reason = "身体が冷え切り、まともに動けない。暖を取らなければ危険だ。";
      if (p.survival.lastCriticalKey !== key) {
        c.health = clamp(c.health - 7);
        p.survival.lastCriticalKey = key;
        addHistory("critical", "身体が冷え切り、体力を失った。", { trigger });
      }
    } else if (c.health <= 10) {
      blocked = true;
      reason = "体力が落ちすぎている。通常の移動を続けられない。";
    }

    if (c.health <= 0) return { dead: die("衰弱して動けなくなり、そのまま命を落とした。"), blocked: true, reason };
    return { dead: false, blocked, reason };
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

  const getRelationship = (npcId) => {
    HMW.state.relationships = HMW.state.relationships || {};
    if (!HMW.state.relationships[npcId]) {
      const npc = HMW.getNpc?.(npcId);
      HMW.state.relationships[npcId] = npc?.relationship ? clone(npc.relationship) : { familiarity: 0, trust: 0, goodwill: 0, caution: 0 };
    }
    return HMW.state.relationships[npcId];
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
      lines.push("同じ街で暮らす人だ。支援や危険な場所について知っていることはあるが、初対面から無条件に助けてくれるわけではない。");
      actions.push({
        label: "情報を聞く",
        onClick: () => {
          const r = getRelationship(npc.id);
          const known = (r.familiarity || 0) >= 2;
          if (known) r.goodwill = (r.goodwill || 0) + 1;
          addHistory("information", known ? "支援施設の配布時間について聞いた。" : "詳しい情報はまだ教えてもらえなかった。", { npcId: npc.id });
          showResult("情報", [known ? "昼なら支援施設で食料配布がある日がある、と教えられた。毎日とは限らない。" : "まだ警戒されていて、詳しいことは教えてもらえなかった。"]);
        }
      });
    } else if (npc.templateId === "police") {
      lines.push("警官は巡回中だ。こちらの事情より先に、職務上の判断で接する。");
    } else if (npc.templateId === "shopClerk") {
      lines.push("店員はまず客として対応する。関係ができても店の規則と警戒は残る。");
    } else if (npc.romance) {
      lines.push("顔を合わせた。関係はこの一度では決まらず、これまでの接触が次回以降に残る。");
    } else {
      lines.push("短い接触になった。相手がこちらを覚えるかは今後の積み重ね次第だ。");
    }

    showResult(name, lines, actions);
  };

  const rest = () => {
    const c = getCondition();
    c.fatigue = clamp(c.fatigue - 15);
    daily().restCount += 1;
    HMW.app?.advanceTime?.(1);
    addHistory("rest", "しばらく休んだ。");
    const critical = resolveCriticalState("rest");
    if (critical.dead) return;
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
    if (d.beggingAttempts >= 3) {
      showResult("金を求める", ["今日はこの辺りで何度も人に声をかけた。これ以上続けると警戒されやすい。"]);
      return;
    }
    const critical = resolveCriticalState("begging");
    if (critical.dead) return;
    if (critical.blocked) {
      showResult("動けない", [critical.reason]);
      return;
    }

    d.beggingAttempts += 1;
    const c = getCondition();
    c.hunger = clamp(c.hunger + 1);
    c.fatigue = clamp(c.fatigue + 3);
    HMW.app?.advanceTime?.(1);

    const roll = stableRoll(`beg:${getDay()}:${HMW.state.world.locationId}:${d.beggingAttempts}`);
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
    if (d.scavengingAttempts >= 3) {
      showResult("使えるものを探す", ["今日はすでに何度も探している。目につくものはほとんど残っていない。"]);
      return;
    }
    const critical = resolveCriticalState("scavenge");
    if (critical.dead) return;
    if (critical.blocked) {
      showResult("動けない", [critical.reason]);
      return;
    }

    d.scavengingAttempts += 1;
    const c = getCondition();
    c.hunger = clamp(c.hunger + 1);
    c.fatigue = clamp(c.fatigue + 3);
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
    const total = count * unit;
    HMW.removeItem?.("scrap_piece", count);
    HMW.state.player.money += total;
    addHistory("sell", `廃品${count}個を${total}で売った。`, { money: total });
    showResult("廃品を売る", [`廃品${count}個を引き取ってもらい、${total}になった。大きな収入ではない。`]);
  };

  const findSleepSpot = () => {
    const loc = getLocation();
    if (!loc?.services?.sleep) return;
    if (!["evening", "night", "lateNight"].includes(getTime())) {
      showResult("寝場所を探す", ["今の時間では、ここを今夜の寝場所にできるかまだ判断しにくい。"]);
      return;
    }
    const d = daily();
    const id = HMW.state.world.locationId;
    d.sleepSpotAttempts[id] = (d.sleepSpotAttempts[id] || 0) + 1;
    const risk = (loc.risks?.police || 0) + (loc.risks?.thugs || 0) + (loc.risks?.theft || 0);
    const chance = clamp(0.78 - risk * 0.08, 0.22, 0.75);
    const roll = stableRoll(`sleep:${getDay()}:${id}:${d.sleepSpotAttempts[id]}`);

    if (roll < chance) {
      HMW.state.player.sleepingPlaceId = id;
      addHistory("sleep_spot", `${loc.name}で今夜休めそうな場所を確保した。`);
      showResult("寝場所", ["今夜ここで横になれそうな場所を見つけた。安全が保証されたわけではない。"], [
        { label: "ここで寝る", onClick: sleepNow }
      ]);
    } else {
      HMW.state.player.sleepingPlaceId = null;
      addHistory("sleep_spot", `${loc.name}では今夜の寝場所を確保できなかった。`);
      showResult("寝場所", ["人目、巡回、先客、周囲の危険などがあり、今夜ここで落ち着いて寝るのは難しい。"]);
    }
  };

  function sleepNow() {
    const id = HMW.state.player.sleepingPlaceId;
    if (!id || id !== HMW.state.world.locationId) {
      showResult("寝る", ["今夜休める場所をまだ確保していない。"]);
      return;
    }
    const order = ["morning", "daytime", "evening", "night", "lateNight"];
    const index = Math.max(0, order.indexOf(getTime()));
    HMW.app?.advanceTime?.(order.length - index);
    HMW.state.player.sleepingPlaceId = null;
    ensureState();
    const critical = resolveCriticalState("sleep");
    if (critical.dead) return;
    addHistory("sleep", "確保した場所で夜を越した。");
    showResult("朝", ["夜を越した。十分な休息とは限らないが、次の日になった。", conditionWarning()]);
  }

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
      if (stableRoll(`leftover:${getDay()}:${getTime()}:${HMW.state.player.survival.movementCount}`) < 0.12) {
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
    HMW.state.player.survival.lastCriticalKey = null;
    addHistory("item_use", text, { itemId, consumed });
    const critical = resolveCriticalState("item");
    if (critical.dead) return;
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
    const actions = [{ id: "rest", label: "少し休む", run: rest }];
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

  const getArrivalEvent = () => {
    const eligible = (HMW.getEligibleEvents?.() || []).filter((event) => event.id !== "charity_meal");
    if (!eligible.length) return null;
    const key = `arrival-event:${getDay()}:${getTime()}:${HMW.state.world.locationId}:${HMW.state.player.survival.movementCount}`;
    if (stableRoll(key) > 0.58) return null;
    return eligible[Math.floor(stableRoll(`${key}:pick`) * eligible.length)] || null;
  };

  const renderEvent = (container, event) => {
    const instance = HMW.startEvent?.(event.id);
    if (!instance) return;
    container.append(heading("起きていること"));
    container.append(paragraph(event.summary || event.name));
    Object.entries(event.outcomes || {}).forEach(([outcomeId, outcome]) => {
      container.append(button(outcome.label, () => {
        HMW.resolveEvent?.(instance.instanceId, outcomeId);
        addHistory("arrival_event", `${event.name}：${outcome.label}`, { eventId: event.id, outcomeId });
        const critical = resolveCriticalState(`event:${event.id}`);
        if (critical.dead) return;
        openArrival("event");
      }));
    });
  };

  const openArrival = (source = "arrival") => {
    ensureState();
    const critical = resolveCriticalState(source);
    if (critical.dead) return;

    const loc = getLocation();
    const content = modal(loc?.name || "現在地");
    if (!content) return;

    content.append(paragraph(`${loc?.name || "この場所"}にいる。${conditionWarning() ? ` ${conditionWarning()}` : ""}`));

    const event = getArrivalEvent();
    if (event) renderEvent(content, event);

    const people = possiblePeople();
    content.append(heading("人"));
    if (people.length) {
      people.forEach((npc) => content.append(button(npc.displayName || npc.label || npc.name || npc.id, () => contactNpc(npc))));
    } else {
      content.append(paragraph("今ここで継続して話せる相手は見当たらない。"));
    }

    content.append(heading("できること"));
    getContextActions().forEach((action) => content.append(button(action.label, action.run)));

    if (critical.blocked) {
      const moveButtons = [...content.querySelectorAll("button")];
      moveButtons.forEach(() => {});
    }
  };

  const moveTo = (locationId) => {
    ensureState();
    const critical = resolveCriticalState("move");
    if (critical.dead) return;
    if (critical.blocked) {
      showResult("移動できない", [critical.reason]);
      return;
    }

    const current = HMW.worldData.locations[HMW.state.world.locationId];
    if (!current?.connections?.includes(locationId)) return;

    applyMovementCost();
    HMW.state.world.locationId = locationId;
    HMW.state.player.sleepingPlaceId = null;
    addHistory("move", `${HMW.getLocation?.(locationId)?.name || locationId}へ移動した。`);
    refresh();

    const after = resolveCriticalState("move-end");
    if (after.dead) return;
    openArrival("arrival");
  };

  const openMove = () => {
    ensureState();
    const critical = resolveCriticalState("open-move");
    if (critical.dead) return;
    if (critical.blocked) {
      showResult("移動できない", [critical.reason], [
        { label: "周囲でできることを見る", onClick: () => openArrival("critical") }
      ]);
      return;
    }

    const content = modal("移動");
    if (!content) return;
    const destinations = HMW.getConnectedLocations?.(HMW.state.world.locationId) || [];
    const warning = conditionWarning();
    if (warning) content.append(paragraph(warning));
    destinations.forEach((loc) => content.append(button(loc.name, () => moveTo(loc.id))));
  };

  const wrapAdvanceTime = () => {
    if (!HMW.app?.advanceTime || HMW.app.advanceTime.__lifeLoopWrapped) return;
    const original = HMW.app.advanceTime;
    const wrapped = (steps = 1) => {
      original(steps);
      ensureState();
      const c = getCondition();
      if (c.hunger >= 100) c.health = clamp(c.health - Math.max(1, steps * 2));
      if (c.fatigue >= 100) c.health = clamp(c.health - Math.max(1, steps));
      if (c.warmth <= 0) c.health = clamp(c.health - Math.max(1, steps * 2));
      resolveCriticalState("time");
      return HMW.state.world.time;
    };
    wrapped.__lifeLoopWrapped = true;
    HMW.app.advanceTime = wrapped;
  };

  const getTurnContext = () => {
    ensureState();
    const loc = getLocation();
    return {
      day: getDay(),
      time: getTime(),
      weather: HMW.state.world.weather,
      locationId: HMW.state.world.locationId,
      locationName: loc?.name || null,
      money: HMW.state.player.money,
      lifeStatus: HMW.state.player.lifeStatus,
      condition: clone(getCondition()),
      warning: conditionWarning(),
      sleepingPlaceId: HMW.state.player.sleepingPlaceId,
      workAccess: clone(HMW.state.player.workAccess),
      supportProgress: clone(HMW.state.player.progression.support),
      inventory: HMW.getInventorySummary?.() || clone(HMW.state.player.inventory),
      people: possiblePeople().map((p) => ({
        id: p.id,
        name: p.displayName || p.label || p.name || p.id,
        role: p.role || p.type || null,
        romance: Boolean(p.romance)
      })),
      actions: getContextActions().map((a) => ({ id: a.id, label: a.label })),
      eligibleEvents: (HMW.getEligibleEvents?.() || []).map((e) => ({ id: e.id, name: e.name, summary: e.summary }))
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
      openArrival("around");
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
    refresh();
    if (HMW.state.player.lifeStatus === "dead") disableGameActions();
  });

  HMW.lifeLoop = {
    ensureState,
    openAround: () => openArrival("around"),
    openMove,
    moveTo,
    openArrival,
    getContextActions,
    getTurnContext,
    conditionWarning,
    resolveCriticalState
  };
  HMW.getTurnContext = getTurnContext;
})();
