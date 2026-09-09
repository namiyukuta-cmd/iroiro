(() => {
  "use strict";

  window.HMW = window.HMW || {};
  const HMW = window.HMW;

  const POLICIES = {
    police_check: {
      chance: 0.18,
      cooldownDays: 3,
      blockedText: "巡回中の警官に呼び止められている。応じるまで、移動や別の行動には移れない。"
    },
    thug_presence: {
      chance: 0.16,
      cooldownDays: 2,
      blockedText: "不良に進路を塞がれている。避けるか、そのまま通るかを決める必要がある。"
    },
    resident_complaint: {
      chance: 0.12,
      cooldownDays: 2,
      blockedText: "住民から直接声をかけられている。このまま無視して居続けることはできない。"
    }
  };

  const clone = (value) => JSON.parse(JSON.stringify(value));
  const clamp = (value, min = 0, max = 100) => Math.max(min, Math.min(max, value));

  const rawGetEligibleEvents = typeof HMW.getEligibleEvents === "function"
    ? HMW.getEligibleEvents.bind(HMW)
    : null;
  const rawGetTurnContext = typeof HMW.getTurnContext === "function"
    ? HMW.getTurnContext.bind(HMW)
    : null;

  // 通常の「周囲を見る」では、強制イベント候補を説明文として出さない。
  // 強制イベントはこのファイルだけが発生・解決を管理する。
  if (rawGetEligibleEvents) {
    HMW.getEligibleEvents = (context = {}) => rawGetEligibleEvents(context)
      .filter((event) => !POLICIES[event.id]);
  }

  const ensureGateState = () => {
    const player = HMW.state?.player;
    if (!player) return null;

    player.progression = player.progression || {};
    player.progression.eventGate = player.progression.eventGate || {};
    const gate = player.progression.eventGate;

    gate.checked = gate.checked && typeof gate.checked === "object" ? gate.checked : {};
    gate.forcedMoveFrom = gate.forcedMoveFrom || null;
    gate.forcedReason = gate.forcedReason || null;
    gate.lastBlockingDay = Number(gate.lastBlockingDay) || 0;
    gate.lastBlockingArrival = Number(gate.lastBlockingArrival) || 0;
    gate.lastEventDay = gate.lastEventDay && typeof gate.lastEventDay === "object" ? gate.lastEventDay : {};

    // 既存セーブの完了履歴からクールダウンを復元する。
    const completed = HMW.state?.events?.completed || [];
    completed.forEach((entry) => {
      if (!POLICIES[entry.eventId]) return;
      const day = Number(entry.completedDay || entry.day) || 0;
      gate.lastBlockingDay = Math.max(gate.lastBlockingDay, day);
      gate.lastEventDay[entry.eventId] = Math.max(Number(gate.lastEventDay[entry.eventId]) || 0, day);
    });

    return gate;
  };

  const currentArrival = () => Number(HMW.state?.player?.survival?.arrivalCount) || 0;
  const currentKey = () => `${HMW.state?.world?.day || 1}:${HMW.state?.world?.locationId || "none"}:${currentArrival()}`;

  const getActiveBlocking = () => {
    const active = HMW.state?.events?.active || [];
    const locationId = HMW.state?.world?.locationId;
    const instance = active.find((entry) => entry.locationId === locationId && POLICIES[entry.eventId]);
    if (!instance) return null;

    const definition = HMW.getEvent?.(instance.eventId);
    if (!definition) return null;
    return { instance, definition, policy: POLICIES[instance.eventId] };
  };

  const isCritical = () => {
    const player = HMW.state?.player;
    const c = player?.condition || {};
    if (!player || player.lifeStatus !== "active") return true;
    return (c.health ?? 100) <= 20 ||
      (c.hunger ?? 0) >= 90 ||
      (c.fatigue ?? 0) >= 95 ||
      (c.warmth ?? 100) <= 10;
  };

  const canStartBlockingEvent = (eventId) => {
    const gate = ensureGateState();
    if (!gate || gate.forcedMoveFrom || isCritical()) return false;

    const day = Number(HMW.state?.world?.day) || 1;
    const arrival = currentArrival();
    if (arrival <= 0) return false;

    // 強制イベント全体で最低2日空ける。
    if (gate.lastBlockingDay && day - gate.lastBlockingDay < 2) return false;

    // 同種イベントはさらに個別クールダウンを持つ。
    const lastSame = Number(gate.lastEventDay[eventId]) || 0;
    const cooldown = POLICIES[eventId]?.cooldownDays || 2;
    if (lastSame && day - lastSame < cooldown) return false;

    return true;
  };

  const chooseBlockingCandidate = () => {
    if (!rawGetEligibleEvents || isCritical()) return null;

    const candidates = rawGetEligibleEvents().filter((event) => POLICIES[event.id]);
    if (!candidates.length) return null;

    for (const event of candidates) {
      if (!canStartBlockingEvent(event.id)) continue;
      if (Math.random() < POLICIES[event.id].chance) return event;
    }
    return null;
  };

  const ensureBlockingEvent = () => {
    const existing = getActiveBlocking();
    if (existing) return existing;

    const player = HMW.state?.player;
    const gate = ensureGateState();
    if (!player || player.lifeStatus !== "active" || !gate || gate.forcedMoveFrom) return null;

    const key = currentKey();
    if (gate.checked[key]) return null;
    gate.checked[key] = true;

    if (isCritical()) return null;

    const candidate = chooseBlockingCandidate();
    if (!candidate) return null;

    const instance = HMW.startEvent?.(candidate.id);
    return instance ? getActiveBlocking() : null;
  };

  const wrappedTurnContext = () => {
    const context = rawGetTurnContext ? rawGetTurnContext() : null;
    if (!context) return context;

    const gate = ensureGateState();
    const active = getActiveBlocking();

    if (active) {
      context.event = {
        id: active.definition.id,
        name: active.definition.name,
        summary: active.policy.blockedText,
        outcomes: clone(active.definition.outcomes || {}),
        blocking: true
      };
      context.allowedActions = [{ id: "resolve_blocking_event", label: "対応する" }];
      context.allowedMoves = [];
      context.blockedByEvent = active.definition.id;
      return context;
    }

    if (gate?.forcedMoveFrom === HMW.state?.world?.locationId) {
      context.event = null;
      context.allowedActions = [{ id: "forced_move", label: "この場所を離れる" }];
      context.allowedMoves = (HMW.getConnectedLocations?.(HMW.state.world.locationId) || [])
        .map((location) => ({ id: location.id, label: location.name }));
      context.mustLeaveLocation = true;
      return context;
    }

    if (context.event?.id && POLICIES[context.event.id]) context.event = null;
    return context;
  };

  if (rawGetTurnContext) {
    HMW.getTurnContext = wrappedTurnContext;
    HMW.getAIPacket = () => ({
      instruction: "blockingEvent または mustLeaveLocation がある間だけ、その解決を優先する。解決後は通常の生活行動へ戻す。同種の強制イベントを連続発生させない。",
      rules: typeof HMW.getAIRulesText === "function" ? HMW.getAIRulesText() : null,
      context: wrappedTurnContext()
    });
  }

  const modalElements = () => ({
    layer: document.getElementById("modalLayer"),
    title: document.getElementById("modalTitle"),
    content: document.getElementById("modalContent")
  });

  const paragraph = (text) => {
    const p = document.createElement("p");
    p.textContent = text;
    p.style.margin = "0 0 14px";
    p.style.lineHeight = "1.65";
    return p;
  };

  const button = (label, onClick) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "action-button";
    b.textContent = label;
    b.addEventListener("click", onClick);
    return b;
  };

  const openPanel = (titleText) => {
    const { layer, title, content } = modalElements();
    if (!layer || !title || !content) return null;
    title.textContent = titleText;
    content.replaceChildren();
    layer.hidden = false;
    return content;
  };

  const refresh = () => {
    HMW.app?.render?.();
    HMW.renderConditionPanel?.();
    HMW.flowUI?.render?.();
  };

  const setForcedMove = (reason) => {
    const gate = ensureGateState();
    if (!gate) return;
    gate.forcedMoveFrom = HMW.state.world.locationId;
    gate.forcedReason = reason;
  };

  const clearForcedMove = () => {
    const gate = ensureGateState();
    if (!gate) return;
    gate.forcedMoveFrom = null;
    gate.forcedReason = null;
  };

  const rememberResolvedEvent = (eventId) => {
    const gate = ensureGateState();
    if (!gate) return;
    const day = Number(HMW.state.world.day) || 1;
    gate.lastBlockingDay = day;
    gate.lastBlockingArrival = currentArrival();
    gate.lastEventDay[eventId] = day;
  };

  const applyOutcomeConsequence = (eventId, outcomeId) => {
    const c = HMW.state.player.condition;

    if (eventId === "police_check") {
      if (outcomeId === "answer_calmly") {
        c.fatigue = clamp(c.fatigue + 1);
        return "警官の確認に応じた。確認はここで終わった。";
      }
      if (outcomeId === "leave_area") {
        c.fatigue = clamp(c.fatigue + 2);
        setForcedMove("警官から、この場所を離れるよう求められている。");
        return "警官からここを離れるよう求められた。別の場所へ移れば、この件は終わる。";
      }
    }

    if (eventId === "thug_presence") {
      if (outcomeId === "avoid") {
        c.fatigue = clamp(c.fatigue + 3);
        setForcedMove("不良を避けるため、この場所から離れる必要がある。");
        return "不良を避けることにした。この場所から離れれば、この件は終わる。";
      }
      if (outcomeId === "pass_through") {
        const roll = Math.random();
        if (roll < 0.30 && HMW.state.player.money > 0) {
          const loss = Math.min(HMW.state.player.money, 20);
          HMW.state.player.money -= loss;
          return `絡まれ、${loss}を失った。`;
        }
        if (roll < 0.58) {
          c.health = clamp(c.health - 6);
          c.fatigue = clamp(c.fatigue + 4);
          return "揉めて体力を失った。";
        }
        c.fatigue = clamp(c.fatigue + 2);
        return "緊張したが、そのまま通り抜けた。";
      }
    }

    if (eventId === "resident_complaint") {
      if (outcomeId === "leave") {
        c.fatigue = clamp(c.fatigue + 1);
        setForcedMove("住民から、この場所に留まらないよう求められている。");
        return "住民から退去を求められた。別の場所へ移れば、この件は終わる。";
      }
      if (outcomeId === "explain") {
        c.fatigue = clamp(c.fatigue + 1);
        if (Math.random() < 0.45) return "事情を説明し、今すぐ追い立てられることは避けられた。";
        setForcedMove("説明しても住民の警戒は解けず、この場所を離れるよう求められている。");
        return "事情を説明したが受け入れられず、ここを離れるよう求められた。";
      }
    }

    return "対応した。";
  };

  const resolveBlockingEvent = (outcomeId) => {
    const blocking = getActiveBlocking();
    if (!blocking) return;

    const eventId = blocking.definition.id;
    const completed = HMW.resolveEvent?.(blocking.instance.instanceId, outcomeId);
    if (!completed) return;

    rememberResolvedEvent(eventId);
    const resultText = applyOutcomeConsequence(eventId, outcomeId);
    refresh();

    const gate = ensureGateState();
    if (gate?.forcedMoveFrom === HMW.state.world.locationId) {
      const content = openPanel("この場所を離れる");
      if (!content) return;
      content.append(paragraph(resultText));
      (HMW.getConnectedLocations?.(HMW.state.world.locationId) || [])
        .forEach((location) => content.append(button(location.name, () => forceMoveTo(location.id))));
      return;
    }

    HMW.app?.closeModal?.();
    const notice = document.getElementById("noticeArea");
    if (notice) {
      notice.textContent = resultText;
      notice.hidden = false;
    }
    setTimeout(refresh, 0);
  };

  const openBlockingEvent = () => {
    const blocking = getActiveBlocking() || ensureBlockingEvent();
    if (!blocking) return;

    const content = openPanel(blocking.definition.name || "対応が必要");
    if (!content) return;
    content.append(paragraph(blocking.policy.blockedText));
    Object.entries(blocking.definition.outcomes || {}).forEach(([outcomeId, outcome]) => {
      content.append(button(outcome.label, () => resolveBlockingEvent(outcomeId)));
    });
  };

  // 強制退去は通常移動とは別処理。
  // 疲労100などで「退去しろと言われたのに移動不能」の詰みを起こさない。
  function forceMoveTo(locationId) {
    const from = HMW.state?.world?.locationId;
    const connected = HMW.getConnectedLocations?.(from) || [];
    if (!connected.some((location) => location.id === locationId)) return;

    const player = HMW.state?.player;
    if (!player || player.lifeStatus === "dead") return;

    clearForcedMove();
    HMW.state.world.locationId = locationId;
    HMW.state.player.sleepingPlaceId = null;
    HMW.state.player.survival = HMW.state.player.survival || {};
    HMW.state.player.survival.movementCount = (HMW.state.player.survival.movementCount || 0) + 1;
    HMW.state.player.survival.arrivalCount = (HMW.state.player.survival.arrivalCount || 0) + 1;

    const c = HMW.state.player.condition;
    c.hunger = clamp(c.hunger + 1);
    c.hygiene = clamp(c.hygiene - 1);
    if (c.fatigue < 100) c.fatigue = clamp(c.fatigue + 1);

    HMW.app?.appendHistory?.("forced_move", `${HMW.getLocation?.(locationId)?.name || locationId}へ退去した。`, { from, to: locationId });
    HMW.app?.closeModal?.();

    // 強制退去の直後に別の強制イベントを連鎖させない。
    const gate = ensureGateState();
    if (gate) gate.checked[currentKey()] = true;

    HMW.lifeLoop?.resolveCriticalState?.("forced-move-end");
    refresh();
  }

  const openForcedMove = () => {
    const gate = ensureGateState();
    if (!gate?.forcedMoveFrom || gate.forcedMoveFrom !== HMW.state.world.locationId) return;

    const content = openPanel("この場所を離れる");
    if (!content) return;
    content.append(paragraph(gate.forcedReason || "この場所には留まれない。"));
    (HMW.getConnectedLocations?.(HMW.state.world.locationId) || [])
      .forEach((location) => content.append(button(location.name, () => forceMoveTo(location.id))));
  };

  const setMapGate = (blocked) => {
    const map = document.getElementById("mapButton");
    if (!map) return;
    if (blocked) {
      map.dataset.eventGateDisabled = "true";
      map.disabled = true;
    } else if (map.dataset.eventGateDisabled === "true") {
      delete map.dataset.eventGateDisabled;
      map.disabled = false;
    }
  };

  const render = () => {
    const player = HMW.state?.player;
    if (!player) return;

    const gate = ensureGateState();
    const blocking = ensureBlockingEvent();
    const forced = Boolean(gate?.forcedMoveFrom && gate.forcedMoveFrom === HMW.state.world.locationId);

    HMW.flowUI?.render?.();
    setMapGate(Boolean(blocking || forced));
  };

  document.addEventListener("click", (event) => {
    const blocking = getActiveBlocking();
    const gate = ensureGateState();
    const forced = Boolean(gate?.forcedMoveFrom && gate.forcedMoveFrom === HMW.state?.world?.locationId);
    if (!blocking && !forced) return;

    const flowButton = event.target.closest?.("[data-flow-slot]");
    const mapTarget = event.target.closest?.("#mapButton, .hmw-map-node");
    const inventory = event.target.closest?.("#inventoryButton");
    if (!flowButton && !mapTarget && !inventory) return;

    event.preventDefault();
    event.stopImmediatePropagation();

    if (flowButton?.getAttribute("data-flow-slot") === "1") {
      if (blocking) openBlockingEvent();
      else openForcedMove();
    }
  }, true);

  document.addEventListener("click", () => setTimeout(render, 0));
  document.addEventListener("DOMContentLoaded", () => {
    ensureGateState();
    setTimeout(render, 0);
  });

  HMW.eventGate = {
    render,
    ensureBlockingEvent,
    openBlockingEvent,
    openForcedMove,
    getActiveBlocking
  };
})();