(() => {
  "use strict";

  window.HMW = window.HMW || {};

  const HMW = window.HMW;
  const $ = (id) => document.getElementById(id);
  const elements = {};

  const clamp = (value, min = 0, max = 100) => Math.max(min, Math.min(max, value));
  const isNumber = (value) => typeof value === "number" && Number.isFinite(value);
  const clone = (value) => JSON.parse(JSON.stringify(value));

  const getTimeLabel = (timeId) => HMW.worldData?.timeSlots?.[timeId]?.label || timeId || "―";

  const getWeatherDisplay = (weatherId) => {
    const icons = {
      clear: "☀️",
      cloudy: "☁️",
      rain: "🌧️",
      heavyRain: "🌧️",
      cold: "❄️"
    };
    return icons[weatherId] || "―";
  };

  const getCurrentLocation = () => {
    const locationId = HMW.state?.world?.locationId;
    return locationId ? HMW.getLocation(locationId) : null;
  };

  const ensureInitialLocation = () => {
    if (!HMW.state.world.locationId) {
      HMW.state.world.locationId = HMW.worldData.defaultStartLocationId;
    }
  };

  const ensureSurvivalState = () => {
    HMW.state.player.survival = HMW.state.player.survival || {};
    const survival = HMW.state.player.survival;
    survival.movementCount = isNumber(survival.movementCount) ? survival.movementCount : 0;
    survival.movesThisSlot = isNumber(survival.movesThisSlot) ? survival.movesThisSlot : 0;
    survival.lastProcessedDay = isNumber(survival.lastProcessedDay) ? survival.lastProcessedDay : HMW.state.world.day;
    return survival;
  };

  const appendHistory = (type, text, extra = {}) => {
    HMW.state.history.push({
      day: HMW.state.world.day,
      time: HMW.state.world.time,
      locationId: HMW.state.world.locationId,
      type,
      text,
      ...clone(extra)
    });
  };

  const showNotice = (message) => {
    elements.noticeArea.textContent = message;
    elements.noticeArea.hidden = false;
  };

  const clearNotice = () => {
    elements.noticeArea.textContent = "";
    elements.noticeArea.hidden = true;
  };

  const closeModal = () => {
    elements.modalLayer.hidden = true;
    elements.modalContent.replaceChildren();
  };

  const openModal = (title, buildContent) => {
    elements.modalTitle.textContent = title;
    elements.modalContent.replaceChildren();
    buildContent(elements.modalContent);
    elements.modalLayer.hidden = false;
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
    return p;
  };

  const makeSectionTitle = (text) => {
    const heading = document.createElement("h3");
    heading.textContent = text;
    heading.style.margin = "18px 0 8px";
    heading.style.fontSize = "1rem";
    return heading;
  };

  const applyHealthPressure = () => {
    const condition = HMW.state.player.condition;
    let damage = 0;

    if (condition.hunger >= 90) damage += 3;
    if (condition.fatigue >= 90) damage += 2;
    if (condition.warmth <= 20) damage += 3;
    if (condition.wetness >= 80) damage += 2;

    if (damage > 0) condition.health = clamp(condition.health - damage);
  };

  const applyTimePassingCost = () => {
    const condition = HMW.state.player.condition;
    condition.hunger = clamp(condition.hunger + 3);
    condition.fatigue = clamp(condition.fatigue + 2);
    condition.hygiene = clamp(condition.hygiene - 1);
    applyHealthPressure();
  };

  const applyOvernightConsequences = () => {
    const condition = HMW.state.player.condition;
    const hasSleepingPlace = Boolean(HMW.state.player.sleepingPlaceId);

    if (hasSleepingPlace) {
      condition.fatigue = clamp(condition.fatigue - 20);
      condition.hygiene = clamp(condition.hygiene - 2);
    } else {
      condition.fatigue = clamp(condition.fatigue + 20);
      condition.health = clamp(condition.health - 5);
      condition.hygiene = clamp(condition.hygiene - 5);
      condition.warmth = clamp(condition.warmth - 5);
      appendHistory("overnight", "寝床を確保できないまま朝を迎えた。");
    }

    const survival = ensureSurvivalState();
    survival.movesThisSlot = 0;
    survival.lastProcessedDay = HMW.state.world.day;
    applyHealthPressure();
  };

  const advanceTime = (steps = 1) => {
    const slots = Object.entries(HMW.worldData.timeSlots)
      .sort(([, a], [, b]) => a.order - b.order)
      .map(([id]) => id);

    if (!slots.length) return;

    let index = Math.max(0, slots.indexOf(HMW.state.world.time));

    for (let i = 0; i < steps; i += 1) {
      applyTimePassingCost();
      index += 1;

      if (index >= slots.length) {
        index = 0;
        HMW.state.world.day += 1;
        HMW.state.world.time = slots[index];
        applyOvernightConsequences();
      } else {
        HMW.state.world.time = slots[index];
      }
    }
  };

  const applyMovementCost = () => {
    const condition = HMW.state.player.condition;
    const survival = ensureSurvivalState();

    condition.fatigue = clamp(condition.fatigue + 2);
    condition.hunger = clamp(condition.hunger + 1);
    condition.hygiene = clamp(condition.hygiene - 1);

    if (HMW.state.world.weather === "rain") {
      condition.wetness = clamp(condition.wetness + 5);
      condition.warmth = clamp(condition.warmth - 2);
    } else if (HMW.state.world.weather === "heavyRain") {
      condition.wetness = clamp(condition.wetness + 10);
      condition.warmth = clamp(condition.warmth - 4);
    } else if (HMW.state.world.weather === "cold") {
      condition.warmth = clamp(condition.warmth - 4);
    }

    survival.movementCount += 1;
    survival.movesThisSlot += 1;
    applyHealthPressure();

    if (survival.movesThisSlot >= 2) {
      survival.movesThisSlot = 0;
      advanceTime(1);
    }
  };

  const getRelationship = (npcId) => {
    if (!HMW.state.relationships[npcId]) {
      const npc = HMW.getNpc(npcId);
      if (npc?.relationship) HMW.state.relationships[npcId] = clone(npc.relationship);
    }
    return HMW.state.relationships[npcId] || null;
  };

  const executeJob = (jobId) => {
    if (HMW.jobSearch?.perform) {
      HMW.jobSearch.perform(jobId);
      return;
    }
    showNotice("この仕事は、検索・応募・採用の手順を経てからでないと始められません。");
  };

  const moveTo = (locationId) => {
    const currentId = HMW.state.world.locationId;
    const current = HMW.worldData.locations[currentId];

    if (!current?.connections?.includes(locationId)) {
      showNotice("そこへはここから直接移動できません。");
      return;
    }

    const destination = HMW.getLocation(locationId);
    if (!destination) return;

    applyMovementCost();
    HMW.state.world.locationId = locationId;
    appendHistory("move", `${destination.name}へ移動した。`);

    closeModal();
    clearNotice();
    render();
  };

  const openMoveMenu = () => {
    const currentId = HMW.state.world.locationId;
    const destinations = HMW.getConnectedLocations(currentId);

    openModal("移動", (container) => {
      if (!destinations.length) {
        container.append(makeParagraph("ここから移動できる場所はありません。"));
        return;
      }

      destinations.forEach((location) => {
        container.append(makeButton(location.name, () => moveTo(location.id)));
      });
    });
  };

  const openNpcMenu = () => {
    const locationId = HMW.state.world.locationId;
    const time = HMW.state.world.time;
    const npcs = HMW.getNpcsAtLocation(locationId, time);
    const ambientTypes = HMW.getAmbientNpcTypes(locationId);

    openModal("この場所にいる人", (container) => {
      if (!npcs.length && !ambientTypes.length) {
        container.append(makeParagraph("今は特に人がいません。"));
        return;
      }

      if (npcs.length) {
        container.append(makeSectionTitle("人"));
        npcs.forEach((npc) => {
          const p = document.createElement("p");
          p.style.margin = "0 0 12px";
          p.textContent = npc.role ? `${npc.displayName} — ${npc.role}` : npc.displayName;
          container.append(p);
        });
      }

      if (ambientTypes.length) {
        container.append(makeSectionTitle("周囲"));
        const labels = {
          police: "警官",
          volunteer: "支援関係者",
          homeless: "路上生活者",
          thug: "不良",
          shopClerk: "店員",
          laborStaff: "職員",
          recycler: "廃品回収関係者",
          passerby: "通行人",
          resident: "住民"
        };
        container.append(makeParagraph(ambientTypes.map((id) => labels[id] || id).join("・")));
      }
    });
  };

  const openJobsMenu = () => {
    if (HMW.jobSearch?.open) {
      HMW.jobSearch.open();
      return;
    }

    openModal("仕事を探す", (container) => {
      container.append(makeParagraph("仕事探しの処理を読み込んでいます。"));
    });
  };

  const openStatus = () => {
    const c = HMW.state.player.condition;
    const displayValue = (value) => isNumber(value) ? String(value) : "未設定";

    openModal("状態", (container) => {
      [
        ["体力", c.health],
        ["空腹", c.hunger],
        ["清潔", c.hygiene],
        ["体温", c.warmth],
        ["濡れ", c.wetness],
        ["疲労", c.fatigue]
      ].forEach(([label, value]) => {
        container.append(makeParagraph(`${label}：${displayValue(value)}`));
      });

      const sleepingPlace = HMW.state.player.sleepingPlaceId
        ? HMW.getLocation(HMW.state.player.sleepingPlaceId)?.name || HMW.state.player.sleepingPlaceId
        : "未定";
      container.append(makeParagraph(`今夜の寝床：${sleepingPlace}`));
    });
  };

  const openInventory = () => {
    const inventory = HMW.state.player.inventory;

    openModal("持ち物", (container) => {
      if (!inventory.length) {
        container.append(makeParagraph("持ち物はありません。"));
        return;
      }

      inventory.forEach((item) => {
        const label = typeof item === "string" ? item : (item.name || item.id || "アイテム");
        container.append(makeParagraph(label));
      });
    });
  };

  const openLog = () => {
    openModal("記録", (container) => {
      if (!HMW.state.history.length) {
        container.append(makeParagraph("まだ記録はありません。"));
        return;
      }

      [...HMW.state.history].reverse().forEach((entry) => {
        const location = entry.locationId ? HMW.getLocation(entry.locationId) : null;
        const p = document.createElement("p");
        p.style.margin = "0 0 12px";
        p.textContent = `DAY ${entry.day} / ${getTimeLabel(entry.time)}${location ? ` / ${location.name}` : ""}\n${entry.text}`;
        p.style.whiteSpace = "pre-line";
        container.append(p);
      });
    });
  };

  const openSavePlaceholder = () => {
    openModal("セーブ", (container) => {
      container.append(makeParagraph("セーブ機能を読み込んでいます。"));
    });
  };

  const openMainMenu = () => {
    openModal("メニュー", (container) => {
      container.append(makeButton("持ち物", openInventory));
      container.append(makeButton("記録", openLog));
      container.append(makeButton("セーブ", openSavePlaceholder));
    });
  };

  const buildSceneText = (location) => {
    if (!location) return "場所情報を読み込めません。";

    const district = HMW.worldData.districts?.[location.districtId]?.name;
    const people = HMW.getNpcsAtLocation(HMW.state.world.locationId, HMW.state.world.time);
    const parts = [];

    if (district) parts.push(`${district}にいます。`);
    if (people.length) parts.push(`目につく人が${people.length}人います。`);
    if (!people.length) parts.push("今は特に目立った人はいません。");

    return parts.join(" ");
  };

  const render = () => {
    ensureInitialLocation();
    ensureSurvivalState();

    const state = HMW.state;
    const location = getCurrentLocation();

    elements.dayValue.textContent = state.world.day;
    elements.timeValue.textContent = getTimeLabel(state.world.time);
    elements.moneyValue.textContent = state.player.money;
    elements.weatherValue.textContent = getWeatherDisplay(state.world.weather);

    const locationName = location?.name || "現在地不明";
    elements.locationName.textContent = locationName;
    elements.sceneTitle.textContent = locationName;
    elements.sceneTime.textContent = getTimeLabel(state.world.time);
    elements.sceneText.textContent = buildSceneText(location);

    elements.actionButtons[0].textContent = "移動する";
    elements.actionButtons[1].textContent = "人を見る";
    elements.actionButtons[2].textContent = "仕事を探す";
  };

  const bindEvents = () => {
    elements.actionButtons[0].addEventListener("click", openMoveMenu);
    elements.actionButtons[1].addEventListener("click", openNpcMenu);
    elements.actionButtons[2].addEventListener("click", openJobsMenu);

    elements.statusButton.addEventListener("click", openStatus);
    elements.inventoryButton.addEventListener("click", openInventory);
    elements.logButton.addEventListener("click", openLog);
    elements.saveButton.addEventListener("click", openSavePlaceholder);
    elements.menuButton.addEventListener("click", openMainMenu);

    elements.modalCloseButton.addEventListener("click", closeModal);
    document.querySelectorAll("[data-close-modal]").forEach((node) => {
      node.addEventListener("click", closeModal);
    });
  };

  const init = () => {
    elements.dayValue = $("dayValue");
    elements.timeValue = $("timeValue");
    elements.moneyValue = $("moneyValue");
    elements.weatherValue = $("weatherValue");
    elements.locationName = $("locationName");
    elements.sceneTitle = $("sceneTitle");
    elements.sceneTime = $("sceneTime");
    elements.sceneText = $("sceneText");
    elements.noticeArea = $("noticeArea");
    elements.modalLayer = $("modalLayer");
    elements.modalTitle = $("modalTitle");
    elements.modalContent = $("modalContent");
    elements.modalCloseButton = $("modalCloseButton");
    elements.menuButton = $("menuButton");
    elements.statusButton = $("statusButton");
    elements.inventoryButton = $("inventoryButton");
    elements.logButton = $("logButton");
    elements.saveButton = $("saveButton");
    elements.actionButtons = [...document.querySelectorAll("[data-action-slot]")];

    ensureInitialLocation();
    ensureSurvivalState();
    bindEvents();
    render();
  };

  HMW.app = {
    render,
    openMoveMenu,
    openNpcMenu,
    openJobsMenu,
    executeJob,
    moveTo,
    appendHistory,
    advanceTime,
    showNotice,
    closeModal
  };

  document.addEventListener("DOMContentLoaded", init);
})();
