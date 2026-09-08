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

  const choosePrimaryAction = () => {
    const state = HMW.state?.player;
    const world = HMW.state?.world;
    const condition = state?.condition || {};
    if (!state || !world) return null;

    if (state.lifeStatus === "dead") return { kind: "dead", label: "死亡" };
    if (state.lifeStatus === "collapsed") {
      return { kind: "guide", label: "助けを待つ", run: () => HMW.lifeLoop?.openGuide?.() };
    }

    if (condition.hunger >= 60 && hasFood()) {
      return {
        kind: "inventory",
        label: "食べる",
        run: () => document.getElementById("inventoryButton")?.click()
      };
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

    if (context.lifeStatus === "dead") {
      return "この主人公は死亡している。このセーブでは行動を続けられない。";
    }

    const parts = [];
    const people = context.people || [];
    const ambient = context.ambientPeople || [];
    const condition = context.condition || {};

    if (people.length) {
      parts.push(`${people.slice(0, 3).map((person) => person.name).join("、")}がいる。`);
    } else if (ambient.length) {
      parts.push(`${ambient.slice(0, 3).map((type) => AMBIENT_LABELS[type] || type).join("、")}の出入りがある。`);
    } else {
      parts.push("今は人影が少ない。");
    }

    if (context.event?.summary) parts.push(context.event.summary);

    if (condition.hunger >= 85) parts.push("空腹が強く、食料確保を優先しないと体力が持たない。");
    else if (condition.hunger >= 60) parts.push("空腹が進んでいる。食べ物を確保したい。");

    if (condition.fatigue >= 85) parts.push("疲労が強く、このまま動き続けるのは危険だ。");
    else if (condition.fatigue >= 70) parts.push("疲労がたまっている。");

    if (condition.hygiene < 30) parts.push("身なりがかなり崩れている。仕事や対人場面で不利になりやすい。");
    if (condition.warmth <= 20) parts.push("身体が冷えている。");

    const primary = choosePrimaryAction();
    if (primary?.label && primary.kind !== "dead") {
      parts.push(`今ここでまず出来ることは「${primary.label}」。`);
    }

    const otherActions = contextActions()
      .filter((action) => action.id !== primary?.id)
      .slice(0, 3)
      .map((action) => action.label);
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
      buttons.forEach((button) => {
        button.disabled = true;
      });
      buttons[0].textContent = "死亡";
      buttons[1].textContent = "行動できない";
      buttons[2].textContent = "行動できない";
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

    buttons[2].disabled = state.lifeStatus === "collapsed";
    buttons[2].textContent = "移動する";
    buttons[2].onclick = openMove;
  };

  const afterMove = (locationId) => {
    const destinationName = HMW.getLocation?.(locationId)?.name || null;
    HMW.lifeLoop?.moveTo?.(locationId);

    const layer = document.getElementById("modalLayer");
    const title = document.getElementById("modalTitle");
    if (layer && !layer.hidden && destinationName && title?.textContent === destinationName && HMW.state?.player?.lifeStatus === "active") {
      HMW.app?.closeModal?.();
    }

    renderMain();
  };

  function openMove() {
    const context = HMW.getTurnContext?.();
    if (!context || context.lifeStatus !== "active") {
      HMW.lifeLoop?.openGuide?.();
      return;
    }

    const content = openModal("移動");
    if (!content) return;
    content.append(makeParagraph("行き先を選ぶ。移動すれば空腹と疲労が進み、時間も経つ。"));

    const destinations = HMW.getConnectedLocations?.(HMW.state.world.locationId) || [];
    destinations.forEach((location) => {
      content.append(makeButton(location.name, () => afterMove(location.id)));
    });
  }

  const install = () => {
    replaceActionButtons();

    if (HMW.app && HMW.lifeLoop?.moveTo) {
      HMW.app.moveTo = afterMove;
    }

    renderMain();

    const sceneText = document.getElementById("sceneText");
    if (sceneText) {
      const observer = new MutationObserver(() => {
        queueMicrotask(renderMain);
      });
      observer.observe(sceneText, { childList: true, characterData: true, subtree: true });
    }

    document.addEventListener("click", () => {
      setTimeout(renderMain, 0);
    });
  };

  document.addEventListener("DOMContentLoaded", install);
  HMW.flowUI = { render: renderMain, openMove, moveTo: afterMove };
})();