(() => {
  "use strict";

  window.HMW = window.HMW || {};
  const HMW = window.HMW;

  const POLICIES = {
    police_check: {
      chance: 0.42,
      blockedText: "巡回中の警官に呼び止められている。応じるまで、移動や別の行動には移れない。"
    },
    thug_presence: {
      chance: 0.38,
      blockedText: "不良に進路を塞がれている。避けるか、そのまま通るかを決める必要がある。"
    },
    resident_complaint: {
      chance: 0.34,
      blockedText: "住民から直接声をかけられている。このまま無視して居続けることはできない。"
    }
  };

  const clone = (value) => JSON.parse(JSON.stringify(value));
  const clamp = (value, min = 0, max = 100) => Math.max(min, Math.min(max, value));

  const stableRoll = (key) => {
    let hash = 2166136261;
    for (let i = 0; i < key.length; i += 1) {
      hash ^= key.charCodeAt(i);
      hash = Math.imul(hash, 16777619);
    }
    return (hash >>> 0) / 4294967296;
  };

  // love-interests.js の displayName:null が temporaryLabel を上書きする問題をここで吸収する。
  if (typeof HMW.getLoveInterestsAtLocation === "function") {
    const original = HMW.getLoveInterestsAtLocation;
    HMW.getLoveInterestsAtLocation = (...args) => original(...args).map((person) => ({
      ...person,
      displayName: person.displayName || person.temporaryLabel || person.role || "人物"
    }));
  }
  if (typeof HMW.getLoveInterest === "function") {
    const original = HMW.getLoveInterest;
    HMW.getLoveInterest = (...args) => {
      const person = original(...args);
      return person ? {
        ...person,
        displayName: person.displayName || person.temporaryLabel || person.role || "人物"
      } : null;
    };
  }

  const ensureGateState = () => {
    const player = HMW.state?.player;
    if (!player) return null;
    player.progression = player.progression || {};
    player.progression.eventGate = player.progression.eventGate || {
      checked: {},
      forcedMoveFrom: null,
      forcedReason: null
    };
    const gate = player.progression.eventGate;
    gate.checked = gate.checked && typeof gate.checked === "object" ? gate.checked : {};
    gate.forcedMoveFrom = gate.forcedMoveFrom || null;
    gate.forcedReason = gate.forcedReason || null;
    return gate;
  };

  const currentKey = () => {
    const state = HMW.state;
    const arrival = state?.player?.survival?.arrivalCount || 0;
    return `${state?.world?.day || 1}:${state?.world?.time || "morning"}:${state?.world?.locationId || "none"}:${arrival}`;
  };

  const getActiveBlocking = () => {
    const active = HMW.state?.events?.active || [];
    const locationId = HMW.state?.world?.locationId;
    const instance = active.find((entry) => entry.locationId === locationId && POLICIES[entry.eventId]);
    if (!instance) return null;
    const definition = HMW.getEvent?.(instance.eventId);
    return definition ? { instance, definition, policy: POLICIES[instance.eventId] } : null;
  };

  const rawGetTurnContext = typeof HMW.getTurnContext === "function"
    ? HMW.getTurnContext.bind(HMW)
    : null;

  const chooseBlockingCandidate = () => {
    if (!rawGetTurnContext) return null;
    const raw = rawGetTurnContext();
    if (raw?.event?.id && POLICIES[raw.event.id]) {
      return HMW.getEvent?.(raw.event.id) || null;
    }

    const candidates = (HMW.getEligibleEvents?.() || []).filter((event) => POLICIES[event.id]);
    if (!candidates.length) return null;

    const key = currentKey();
    return candidates.find((event) => stableRoll(`blocking:${key}:${event.id}`) < (POLICIES[event.id].chance || 0)) || null;
  };

  const ensureBlockingEvent = () => {
    const player = HMW.state?.player;
    if (!player || player.lifeStatus !== "active") return getActiveBlocking();

    const existing = getActiveBlocking();
    if (existing) return existing;

    const gate = ensureGateState();
    if (!gate || gate.forcedMoveFrom) return null;

    const key = currentKey();
    if (gate.checked[key]) return null;
    gate.checked[key] = true;

    const candidate = chooseBlockingCandidate();
    if (!candidate) return null;

    const instance = HMW.startEvent?.(candidate.id);
    if (!instance) return null;
    return getActiveBlocking();
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
      context.mustLeaveLocation = true;
      return context;
    }

    if (context.event?.id && POLICIES[context.event.id] && gate?.checked?.[currentKey()]) {
      context.event = null;
    }

    return context;
  };

  if (rawGetTurnContext) {
    HMW.getTurnContext = wrappedTurnContext;
    HMW.getAIPacket = () => ({
      instruction: "blockingEvent または mustLeaveLocation がある間は、それを解決する行動以外を成立させない。イベントを無視して移動・仕事・休息などを進めない。",
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

  const refreshBase = () => {
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

  const applyOutcomeConsequence = (eventId, outcomeId) => {
    const condition = HMW.state.player.condition;
    let text = "対応した。";

    if (eventId === "police_check") {
      if (outcomeId === "answer_calmly") {
        condition.fatigue = clamp(condition.fatigue + 1);
        text = "警官の確認に応じた。少し時間と気力を使ったが、その場での確認は終わった。";
      } else if (outcomeId === "leave_area") {
        condition.fatigue = clamp(condition.fatigue + 2);
        setForcedMove("警官から、この場所を離れるよう求められている。");
        text = "警官からここを離れるよう求められた。別の場所へ移動するまで、ほかの行動には移れない。";
      }
    }

    if (eventId === "thug_presence") {
      if (outcomeId === "avoid") {
        condition.fatigue = clamp(condition.fatigue + 3);
        setForcedMove("不良を避けるため、この場所から離れる必要がある。");
        text = "近づかないことにした。遠回りになるため疲労が増え、この場所から離れる必要がある。";
      } else if (outcomeId === "pass_through") {
        const roll = stableRoll(`thug-result:${HMW.state.world.day}:${HMW.state.world.time}:${HMW.state.world.locationId}:${HMW.state.player.survival?.arrivalCount || 0}`);
        if (roll < 0.34 && HMW.state.player.money > 0) {
          const loss = Math.min(HMW.state.player.money, 20);
          HMW.state.player.money -= loss;
          text = `そのまま通ろうとして絡まれ、${loss}を失った。`;
        } else if (roll < 0.64) {
          condition.health = clamp(condition.health - 6);
          condition.fatigue = clamp(condition.fatigue + 4);
          text = "そのまま通ろうとして揉め、体力を失った。";
        } else {
          condition.fatigue = clamp(condition.fatigue + 2);
          text = "緊張したまま通り抜けた。何も取られなかったが疲労が増えた。";
        }
      }
    }

    if (eventId === "resident_complaint") {
      if (outcomeId === "leave") {
        condition.fatigue = clamp(condition.fatigue + 1);
        setForcedMove("住民から、この場所に留まらないよう求められている。");
        text = "住民に退去を求められた。この場所から離れるまで、ほかの行動はできない。";
      } else if (outcomeId === "explain") {
        const roll = stableRoll(`resident-result:${HMW.state.world.day}:${HMW.state.world.time}:${HMW.state.world.locationId}:${HMW.state.player.survival?.arrivalCount || 0}`);
        condition.fatigue = clamp(condition.fatigue + 1);
        if (roll < 0.45) {
          text = "事情を説明し、今すぐ追い立てられることは避けられた。";
        } else {
          setForcedMove("説明しても住民の警戒は解けず、この場所を離れるよう求められている。");
          text = "事情を説明したが受け入れられず、ここを離れるよう求められた。";
        }
      }
    }

    return text;
  };

  const resolveBlockingEvent = (outcomeId) => {
    const blocking = getActiveBlocking();
    if (!blocking) return;

    const eventId = blocking.definition.id;
    const completed = HMW.resolveEvent?.(blocking.instance.instanceId, outcomeId);
    if (!completed) return;

    const resultText = applyOutcomeConsequence(eventId, outcomeId);
    refreshBase();

    const gate = ensureGateState();
    if (gate?.forcedMoveFrom === HMW.state.world.locationId) {
      const content = openPanel("この場所を離れる");
      if (content) {
        content.append(paragraph(resultText));
        const destinations = HMW.getConnectedLocations?.(HMW.state.world.locationId) || [];
        destinations.forEach((location) => {
          content.append(button(location.name, () => forceMoveTo(location.id)));
        });
      }
    } else {
      HMW.app?.closeModal?.();
      const notice = document.getElementById("noticeArea");
      if (notice) {
        notice.textContent = resultText;
        notice.hidden = false;
      }
    }
    setTimeout(renderGate, 0);
  };

  const openBlockingEvent = () => {
    const blocking = ensureBlockingEvent();
    if (!blocking) return;

    const content = openPanel(blocking.definition.name || "対応が必要");
    if (!content) return;
    content.append(paragraph(blocking.policy.blockedText));

    Object.entries(blocking.definition.outcomes || {}).forEach(([outcomeId, outcome]) => {
      content.append(button(outcome.label, () => resolveBlockingEvent(outcomeId)));
    });
  };

  function forceMoveTo(locationId) {
    const gate = ensureGateState();
    const from = HMW.state.world.locationId;
    const previousReason = gate?.forcedReason || null;
    clearForcedMove();

    HMW.lifeLoop?.moveTo?.(locationId);
    const moved = HMW.state.world.locationId !== from;

    if (!moved) {
      const restored = ensureGateState();
      if (restored) {
        restored.forcedMoveFrom = from;
        restored.forcedReason = previousReason;
      }
      setTimeout(renderGate, 0);
      return;
    }

    HMW.app?.closeModal?.();
    ensureBlockingEvent();
    setTimeout(renderGate, 0);
  }

  const openForcedMove = () => {
    const gate = ensureGateState();
    if (!gate?.forcedMoveFrom || gate.forcedMoveFrom !== HMW.state.world.locationId) return;

    const content = openPanel("この場所を離れる");
    if (!content) return;
    content.append(paragraph(gate.forcedReason || "この場所には留まれない。"));
    const destinations = HMW.getConnectedLocations?.(HMW.state.world.locationId) || [];
    destinations.forEach((location) => content.append(button(location.name, () => forceMoveTo(location.id))));
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

  const renderGate = () => {
    const player = HMW.state?.player;
    if (!player) return;

    refreshBase();

    const gateState = ensureGateState();
    const blocking = ensureBlockingEvent();
    const forced = gateState?.forcedMoveFrom === HMW.state.world.locationId;
    const buttons = [...document.querySelectorAll("[data-flow-slot]")];
    const text = document.getElementById("sceneText");

    if (blocking) {
      if (text) text.textContent = blocking.policy.blockedText;
      if (buttons[0]) {
        buttons[0].textContent = "対応する";
        buttons[0].disabled = false;
      }
      if (buttons[1]) {
        buttons[1].textContent = "対応が必要";
        buttons[1].disabled = true;
      }
      if (buttons[2]) {
        buttons[2].textContent = "移動できない";
        buttons[2].disabled = true;
      }
      setMapGate(true);
      return;
    }

    if (forced) {
      if (text) text.textContent = `${gateState.forcedReason || "この場所には留まれない。"} 先に場所を移る必要がある。`;
      if (buttons[0]) {
        buttons[0].textContent = "この場所を離れる";
        buttons[0].disabled = false;
      }
      if (buttons[1]) {
        buttons[1].textContent = "先に移動が必要";
        buttons[1].disabled = true;
      }
      if (buttons[2]) {
        buttons[2].textContent = "先に移動が必要";
        buttons[2].disabled = true;
      }
      setMapGate(true);
      return;
    }

    setMapGate(false);
  };

  document.addEventListener("click", (event) => {
    const blocking = getActiveBlocking();
    const gateState = ensureGateState();
    const forced = gateState?.forcedMoveFrom === HMW.state?.world?.locationId;
    if (!blocking && !forced) return;

    const flowButton = event.target.closest?.("[data-flow-slot]");
    const mapTarget = event.target.closest?.("#mapButton, .hmw-map-node");
    const inventory = event.target.closest?.("#inventoryButton");

    if (!flowButton && !mapTarget && !inventory) return;

    event.preventDefault();
    event.stopImmediatePropagation();

    if (flowButton?.getAttribute("data-flow-slot") === "1") {
      if (blocking) openBlockingEvent();
      else if (forced) openForcedMove();
    }
  }, true);

  document.addEventListener("click", () => {
    setTimeout(renderGate, 1);
  });

  document.addEventListener("DOMContentLoaded", () => {
    ensureGateState();
    ensureBlockingEvent();
    setTimeout(renderGate, 0);
  });

  HMW.eventGate = {
    render: renderGate,
    ensureBlockingEvent,
    openBlockingEvent,
    openForcedMove,
    getActiveBlocking
  };
})();