(() => {
  "use strict";

  window.HMW = window.HMW || {};
  const HMW = window.HMW;

  const AMBIENT_LABELS = {
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

  const isNight = (time) => ["evening", "night", "lateNight"].includes(time);
  const getCount = (itemId) => HMW.getItemCount?.(itemId) || 0;
  const hasFood = () => getCount("food_pack") + getCount("bread") + getCount("leftover_food") > 0;
  const getFlowButtons = () => [...document.querySelectorAll("[data-flow-slot]")];

  const replaceActionButtons = () => {
    const originals = [...document.querySelectorAll("[data-action-slot]")];
    originals.forEach((oldButton, index) => {
      const replacement = oldButton.cloneNode(true);
      replacement.removeAttribute("data-action-slot");
      replacement.setAttribute("data-flow-slot", String(index + 1));
      replacement.disabled = false;
      oldButton.replaceWith(replacement);
    });
  };

  const openModal = (titleText) => {
    const layer = document.getElementById("modalLayer");
    const title = document.getElementById("modalTitle");
    const content = document.getElementById("modalContent");
    if (!layer || !title || !content) return null;
    title.textContent = titleText;
    content.replaceChildren();
    layer.hidden = false;
    return content;
  };

  const makeButton = (label, onClick, disabled = false) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "action-button";
    button.textContent = label;
    button.disabled = disabled;
    button.addEventListener("click", onClick);
    return button;
  };

  const makeParagraph = (text) => {
    const p = document.createElement("p");
    p.textContent = text;
    p.style.margin = "0 0 12px";
    p.style.lineHeight = "1.65";
    return p;
  };

  const contextActions = () => HMW.lifeLoop?.getContextActions?.() || [];
  const actionById = (id) => contextActions().find((action) => action.id === id) || null;

  const movementBlock = () => {
    const player = HMW.state?.player;
    const c = player?.condition || {};
    if (!player) return "状態を読み込めない。";
    if (player.lifeStatus === "dead") return "死亡している。";
    if (player.lifeStatus === "collapsed") return "倒れていて移動できない。";
    if ((c.health ?? 100) <= 10) return "体力が落ちすぎていて歩けない。";
    if ((c.hunger ?? 0) >= 100) return "空腹が限界で歩けない。";
    if ((c.fatigue ?? 0) >= 100) return "疲労が限界で歩けない。";
    if ((c.warmth ?? 100) <= 0) return "身体が冷え切っていて歩けない。";
    return null;
  };

  const getEmergencyState = () => {
    const player = HMW.state?.player;
    const c = player?.condition || {};
    if (!player || player.lifeStatus === "dead") return null;
    if (player.lifeStatus === "collapsed") return "collapsed";
    if ((c.hunger ?? 0) >= 100) return "hunger";
    if ((c.fatigue ?? 0) >= 100) return "fatigue";
    if ((c.warmth ?? 100) <= 0) return "cold";
    if ((c.health ?? 100) <= 10) return "health";
    return null;
  };

  const ensureEmergencyCounter = () => {
    const player = HMW.state.player;
    player.progression = player.progression || {};
    player.progression.daily = player.progression.daily || { day: HMW.state.world.day };
    const daily = player.progression.daily;
    if (daily.day !== HMW.state.world.day) {
      daily.day = HMW.state.world.day;
      daily.emergencyHelpAttempts = 0;
    }
    daily.emergencyHelpAttempts = Number(daily.emergencyHelpAttempts) || 0;
    return daily;
  };

  const requestEmergencyHelp = () => {
    const player = HMW.state.player;
    const c = player.condition;
    const emergency = getEmergencyState();

    if (emergency === "collapsed") {
      HMW.lifeLoop?.openGuide?.();
      return;
    }
    if (!emergency) {
      HMW.lifeLoop?.openCurrentScene?.();
      return;
    }

    const content = openModal("助けを求める");
    if (!content) return;

    const daily = ensureEmergencyCounter();
    daily.emergencyHelpAttempts += 1;
    const attempt = daily.emergencyHelpAttempts;
    const locationId = HMW.state.world.locationId;
    const chances = {
      police_station: 0.88,
      charity_center: 0.82,
      station_front: 0.58,
      convenience_store: 0.52,
      labor_office: 0.50,
      shopping_street: 0.44,
      public_toilet: 0.34,
      park: 0.30,
      recycling_yard: 0.28,
      residential_alley: 0.24,
      industrial_street: 0.22,
      underpass: 0.18,
      riverside: 0.16
    };
    const chance = Math.min(0.95, (chances[locationId] ?? 0.20) + Math.min(0.12, (attempt - 1) * 0.03));
    const success = Math.random() < chance;

    if (!success) {
      c.health = Math.max(0, c.health - 2);
      HMW.app?.appendHistory?.("emergency_help", "助けを求めたが、すぐには誰も応じなかった。", { success: false });
      content.append(makeParagraph("助けを求めたが、すぐには誰も応じなかった。体力だけが少し削られた。"));
      if (c.health <= 0) HMW.lifeLoop?.resolveCriticalState?.("emergency-help-failed");
      renderMain();
      return;
    }

    if (emergency === "hunger") {
      HMW.addItem?.("bread", 1);
      c.health = Math.max(6, c.health);
      content.append(makeParagraph("声をかけた相手が、食べられる物を一つ渡した。これで生活が解決するわけではないが、今すぐ食べることはできる。"));
    } else if (emergency === "fatigue") {
      c.fatigue = Math.min(c.fatigue, 90);
      c.health = Math.max(6, c.health);
      content.append(makeParagraph("その場で座って休めるようにされ、しばらく動かずに済んだ。疲労が少し下がった。"));
    } else if (emergency === "cold") {
      c.warmth = Math.max(c.warmth, 12);
      c.health = Math.max(6, c.health);
      content.append(makeParagraph("短時間だけ寒さを避けられる場所につながった。身体の冷えが少しましになった。"));
    } else {
      c.health = Math.max(c.health, 12);
      content.append(makeParagraph("周囲の人が異変に気づき、最低限の救急対応につながった。動ける程度まで持ち直したが、生活上の問題は残っている。"));
    }

    HMW.app?.appendHistory?.("emergency_help", "助けを求め、最低限の援助につながった。", { success: true, emergency });
    content.append(makeButton("持ち物・状態を確認する", () => {
      document.getElementById("inventoryButton")?.click();
    }));
    renderMain();
  };

  const choosePrimaryAction = () => {
    const state = HMW.state?.player;
    const world = HMW.state?.world;
    const condition = state?.condition || {};
    if (!state || !world) return null;

    if (state.lifeStatus === "dead") return { kind: "dead", label: "死亡" };
    if (state.lifeStatus === "collapsed") return { kind: "guide", label: "助けを待つ", run: () => HMW.lifeLoop?.openGuide?.() };

    const emergency = getEmergencyState();
    if (emergency === "hunger" && hasFood()) {
      return { kind: "inventory", label: "今すぐ食べる", run: () => document.getElementById("inventoryButton")?.click() };
    }
    if (emergency === "fatigue") {
      const rest = actionById("rest");
      if (rest) return { kind: "context", ...rest, label: "動かず休む" };
    }
    if (emergency) return { kind: "emergency", label: "助けを求める", run: requestEmergencyHelp };

    if (condition.hunger >= 60 && hasFood()) {
      return { kind: "inventory", label: "食べる", run: () => document.getElementById("inventoryButton")?.click() };
    }

    if (condition.hunger >= 60) {
      for (const id of ["food_support", "buy", "scavenge", "beg"]) {
        const action = actionById(id);
        if (action) return { kind: "context", ...action };
      }
    }

    if (condition.fatigue >= 72) {
      const rest = actionById("rest");
      if (rest) return { kind: "context", ...rest };
    }

    if (isNight(world.time) && !state.sleepingPlaceId) {
      const sleep = actionById("sleep_spot");
      if (sleep) return { kind: "context", ...sleep };
    }

    if (condition.hygiene < 30) {
      const wash = actionById("wash");
      if (wash) return { kind: "context", ...wash };
    }

    if (getCount("scrap_piece") > 0) {
      const sell = actionById("sell_scrap");
      if (sell) return { kind: "context", ...sell };
    }

    const missingWorkAccess = Object.values(state.workAccess || {}).some((value) => !value);
    if (missingWorkAccess) {
      const support = actionById("support_consult");
      if (support) return { kind: "context", ...support };
    } else {
      const work = actionById("work_search");
      if (work) return { kind: "context", ...work };
    }

    for (const id of ["scavenge", "beg", "food_support", "support_consult", "sell_scrap", "work_search", "wash", "buy", "sleep_spot"]) {
      const action = actionById(id);
      if (action) return { kind: "context", ...action };
    }

    const rest = actionById("rest");
    return rest ? { kind: "context", ...rest } : null;
  };

  const contextSummary = () => {
    const context = HMW.getTurnContext?.();
    if (!context) return "現在の状況を読み込めない。";
    if (context.lifeStatus === "dead") return "この主人公は死亡している。このセーブでは行動を続けられない。";

    const parts = [];
    const people = context.people || [];
    const ambient = context.ambientPeople || [];
    const condition = context.condition || {};

    if (people.length) parts.push(`${people.slice(0, 3).map((person) => person.name).join("、")}がいる。`);
    else if (ambient.length) parts.push(`${ambient.slice(0, 3).map((type) => AMBIENT_LABELS[type] || type).join("、")}の出入りがある。`);
    else parts.push("今は人影が少ない。");

    if (context.event?.summary) parts.push(context.event.summary);
    if (condition.hunger >= 100) parts.push("空腹が限界で、通常の移動はできない。");
    else if (condition.hunger >= 85) parts.push("空腹が強く、食料確保を優先しないと体力が持たない。");
    else if (condition.hunger >= 60) parts.push("空腹が進んでいる。食べ物を確保したい。");

    if (condition.fatigue >= 100) parts.push("疲労が限界で、通常の移動はできない。");
    else if (condition.fatigue >= 85) parts.push("疲労が強く、このまま動き続けるのは危険だ。");
    else if (condition.fatigue >= 70) parts.push("疲労がたまっている。");

    if (condition.hygiene < 30) parts.push("身なりがかなり崩れている。仕事や対人場面で不利になりやすい。");
    if (condition.warmth <= 0) parts.push("身体が冷え切り、通常の移動はできない。");
    else if (condition.warmth <= 20) parts.push("身体が冷えている。");

    const primary = choosePrimaryAction();
    if (primary?.label && primary.kind !== "dead") parts.push(`今ここでまず出来ることは「${primary.label}」。`);

    const otherActions = contextActions().filter((action) => action.id !== primary?.id).slice(0, 3).map((action) => action.label);
    if (otherActions.length) parts.push(`ほかに「${otherActions.join("」「")}」もできる。`);
    return parts.join(" ");
  };

  const renderMain = () => {
    const state = HMW.state?.player;
    if (!state) return;

    const text = document.getElementById("sceneText");
    if (text) {
      const summary = contextSummary();
      if (text.textContent !== summary) text.textContent = summary;
    }

    const buttons = getFlowButtons();
    if (buttons.length < 3) return;
    const primary = choosePrimaryAction();
    const context = HMW.getTurnContext?.() || {};
    const peopleCount = (context.people || []).length;
    const ambientCount = (context.ambientPeople || []).length;

    if (state.lifeStatus === "dead") {
      buttons.forEach((button) => { button.disabled = true; button.onclick = null; });
      buttons[0].textContent = "死亡";
      buttons[1].textContent = "行動できない";
      buttons[2].textContent = "移動できない";
      return;
    }

    buttons[0].disabled = !primary?.run;
    buttons[0].textContent = primary?.label || "ここで行動する";
    buttons[0].onclick = () => primary?.run?.();

    buttons[1].disabled = false;
    if (context.event) buttons[1].textContent = "人・出来事を見る";
    else if (peopleCount || ambientCount) buttons[1].textContent = "人と関わる";
    else buttons[1].textContent = "周囲を見る";
    buttons[1].onclick = () => HMW.lifeLoop?.openCurrentScene?.();

    const blocked = movementBlock();
    buttons[2].disabled = Boolean(blocked);
    buttons[2].textContent = blocked ? "移動できない" : "移動する";
    buttons[2].onclick = blocked ? null : openMove;
  };

  const afterMove = (locationId) => {
    const blocked = movementBlock();
    if (blocked) {
      const content = openModal("移動できない");
      content?.append(makeParagraph(blocked));
      content?.append(makeButton("今できることを見る", requestEmergencyHelp));
      renderMain();
      return;
    }

    HMW.lifeLoop?.moveTo?.(locationId);
    renderMain();
  };

  function openMove() {
    const blocked = movementBlock();
    if (blocked) {
      const content = openModal("移動できない");
      if (!content) return;
      content.append(makeParagraph(blocked));
      content.append(makeButton("助けを求める", requestEmergencyHelp));
      return;
    }

    const content = openModal("移動");
    if (!content) return;
    content.append(makeParagraph("行き先を選ぶ。移動すれば空腹と疲労が進み、時間も経つ。"));
    const destinations = HMW.getConnectedLocations?.(HMW.state.world.locationId) || [];
    destinations.forEach((location) => content.append(makeButton(location.name, () => afterMove(location.id))));
  }

  const install = () => {
    replaceActionButtons();
    if (HMW.app && HMW.lifeLoop?.moveTo) HMW.app.moveTo = afterMove;
    renderMain();

    const sceneText = document.getElementById("sceneText");
    if (sceneText) {
      const observer = new MutationObserver(() => queueMicrotask(renderMain));
      observer.observe(sceneText, { childList: true, characterData: true, subtree: true });
    }

    document.addEventListener("click", (event) => {
      const sleepButton = event.target.closest?.("button");
      if (sleepButton?.textContent?.trim() === "ここで寝る") {
        const c = HMW.state?.player?.condition || {};
        if ((c.hunger ?? 0) >= 90 || (c.health ?? 100) <= 12 || (c.warmth ?? 100) <= 5) {
          event.preventDefault();
          event.stopImmediatePropagation();
          const content = openModal("今は眠り続けられない");
          content?.append(makeParagraph("この状態で朝まで眠り続けるのは危険だ。空腹・体調・寒さへの対応を先にする必要がある。"));
          if (hasFood()) content?.append(makeButton("持ち物から食べる", () => document.getElementById("inventoryButton")?.click()));
          else content?.append(makeButton("助けを求める", requestEmergencyHelp));
          renderMain();
          return;
        }
      }
      setTimeout(renderMain, 0);
    }, true);
  };

  document.addEventListener("DOMContentLoaded", install);
  HMW.flowUI = { render: renderMain, openMove, moveTo: afterMove, requestEmergencyHelp, movementBlock };
})();
