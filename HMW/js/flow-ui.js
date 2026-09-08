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
  const contextActions = () => HMW.lifeLoop?.getContextActions?.() || [];
  const actionById = (id) => contextActions().find((action) => action.id === id) || null;

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

  const getGateState = () => {
    const gateApi = HMW.eventGate;
    let blocking = null;
    if (gateApi?.ensureBlockingEvent) blocking = gateApi.ensureBlockingEvent();
    if (!blocking && gateApi?.getActiveBlocking) blocking = gateApi.getActiveBlocking();

    const gate = HMW.state?.player?.progression?.eventGate || null;
    const forced = Boolean(
      gate?.forcedMoveFrom &&
      gate.forcedMoveFrom === HMW.state?.world?.locationId
    );

    return { blocking, forced, gate };
  };

  const movementBlock = () => {
    const gateState = getGateState();
    if (gateState.blocking) return gateState.blocking.policy?.blockedText || "先に目の前の出来事へ対応する必要がある。";
    if (gateState.forced) return gateState.gate?.forcedReason || "先にこの場所を離れる必要がある。";

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
    const gateState = getGateState();
    if (gateState.blocking) {
      HMW.eventGate?.openBlockingEvent?.();
      return;
    }
    if (gateState.forced) {
      HMW.eventGate?.openForcedMove?.();
      return;
    }

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
      content.append(makeParagraph("声をかけた相手が、食べられる物を一つ渡した。今すぐ食べることはできる。"));
    } else if (emergency === "fatigue") {
      c.fatigue = Math.min(c.fatigue, 90);
      c.health = Math.max(6, c.health);
      content.append(makeParagraph("その場で座って休めるようにされ、疲労が少し下がった。"));
    } else if (emergency === "cold") {
      c.warmth = Math.max(c.warmth, 12);
      c.health = Math.max(6, c.health);
      content.append(makeParagraph("短時間だけ寒さを避けられる場所につながり、身体の冷えが少しましになった。"));
    } else {
      c.health = Math.max(c.health, 12);
      content.append(makeParagraph("周囲の人が異変に気づき、最低限の救急対応につながった。"));
    }

    HMW.app?.appendHistory?.("emergency_help", "助けを求め、最低限の援助につながった。", { success: true, emergency });
    renderMain();
  };

  const choosePrimaryAction = () => {
    const gateState = getGateState();
    if (gateState.blocking) {
      return {
        kind: "blocking_event",
        label: "対応する",
        run: () => HMW.eventGate?.openBlockingEvent?.()
      };
    }
    if (gateState.forced) {
      return {
        kind: "forced_move",
        label: "この場所を離れる",
        run: () => HMW.eventGate?.openForcedMove?.()
      };
    }

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
    const gateState = getGateState();
    if (gateState.blocking) {
      return gateState.blocking.policy?.blockedText || "目の前の出来事に対応する必要がある。";
    }
    if (gateState.forced) {
      return `${gateState.gate?.forcedReason || "この場所には留まれない。"} 先にこの場所を離れる必要がある。`;
    }

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

    const otherActions = contextActions()
      .filter((action) => action.id !== primary?.id)
      .slice(0, 3)
      .map((action) => action.label);
    if (otherActions.length) parts.push(`ほかに「${otherActions.join("」「")}」もできる。`);
    return parts.join(" ");
  };

  const setButton = (button, label, onClick, disabled = false) => {
    if (!button) return;
    button.textContent = label;
    button.disabled = disabled;
    button.onclick = disabled ? null : onClick;
  };

  const renderMain = () => {
    const state = HMW.state?.player;
    if (!state) return;

    const gateState = getGateState();
    const text = document.getElementById("sceneText");
    const buttons = getFlowButtons();
    if (buttons.length < 3) return;

    if (gateState.blocking) {
      const blockedText = gateState.blocking.policy?.blockedText || "目の前の出来事に対応する必要がある。";
      if (text && text.textContent !== blockedText) text.textContent = blockedText;
      setButton(buttons[0], "対応する", () => HMW.eventGate?.openBlockingEvent?.(), false);
      setButton(buttons[1], "対応が必要", null, true);
      setButton(buttons[2], "移動できない", null, true);
      const map = document.getElementById("mapButton");
      if (map) map.disabled = true;
      return;
    }

    if (gateState.forced) {
      const forcedText = `${gateState.gate?.forcedReason || "この場所には留まれない。"} 先にこの場所を離れる必要がある。`;
      if (text && text.textContent !== forcedText) text.textContent = forcedText;
      setButton(buttons[0], "この場所を離れる", () => HMW.eventGate?.openForcedMove?.(), false);
      setButton(buttons[1], "先に移動が必要", null, true);
      setButton(buttons[2], "先に移動が必要", null, true);
      const map = document.getElementById("mapButton");
      if (map) map.disabled = true;
      return;
    }

    const map = document.getElementById("mapButton");
    if (map && map.dataset.eventGateDisabled !== "true") map.disabled = false;

    if (text) {
      const summary = contextSummary();
      if (text.textContent !== summary) text.textContent = summary;
    }

    if (state.lifeStatus === "dead") {
      setButton(buttons[0], "死亡", null, true);
      setButton(buttons[1], "行動できない", null, true);
      setButton(buttons[2], "移動できない", null, true);
      return;
    }

    const primary = choosePrimaryAction();
    const context = HMW.getTurnContext?.() || {};
    const peopleCount = (context.people || []).length;
    const ambientCount = (context.ambientPeople || []).length;

    setButton(buttons[0], primary?.label || "ここで行動する", () => primary?.run?.(), !primary?.run);

    const peopleLabel = context.event
      ? "人・出来事を見る"
      : (peopleCount || ambientCount ? "人と関わる" : "周囲を見る");
    setButton(buttons[1], peopleLabel, () => HMW.lifeLoop?.openCurrentScene?.(), false);

    const blocked = movementBlock();
    setButton(buttons[2], blocked ? "移動できない" : "移動する", blocked ? null : openMove, Boolean(blocked));
  };

  const afterMove = (locationId) => {
    const gateState = getGateState();
    if (gateState.blocking) {
      HMW.eventGate?.openBlockingEvent?.();
      return;
    }
    if (gateState.forced) {
      HMW.eventGate?.openForcedMove?.();
      return;
    }

    const blocked = movementBlock();
    if (blocked) {
      const content = openModal("移動できない");
      content?.append(makeParagraph(blocked));
      renderMain();
      return;
    }

    HMW.lifeLoop?.moveTo?.(locationId);
    renderMain();
  };

  function openMove() {
    const gateState = getGateState();
    if (gateState.blocking) {
      HMW.eventGate?.openBlockingEvent?.();
      return;
    }
    if (gateState.forced) {
      HMW.eventGate?.openForcedMove?.();
      return;
    }

    const blocked = movementBlock();
    if (blocked) {
      const content = openModal("移動できない");
      if (!content) return;
      content.append(makeParagraph(blocked));
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
      let scheduled = false;
      const observer = new MutationObserver(() => {
        if (scheduled) return;
        scheduled = true;
        setTimeout(() => {
          scheduled = false;
          renderMain();
        }, 0);
      });
      observer.observe(sceneText, { childList: true, characterData: true, subtree: true });
    }

    document.addEventListener("click", (event) => {
      const gateState = getGateState();
      if (gateState.blocking || gateState.forced) {
        const target = event.target.closest?.("[data-flow-slot]");
        if (target && target.getAttribute("data-flow-slot") !== "1") {
          event.preventDefault();
          event.stopImmediatePropagation();
          if (gateState.blocking) HMW.eventGate?.openBlockingEvent?.();
          else HMW.eventGate?.openForcedMove?.();
          return;
        }
      }

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
  HMW.flowUI = {
    render: renderMain,
    openMove,
    moveTo: afterMove,
    requestEmergencyHelp,
    movementBlock
  };
})();