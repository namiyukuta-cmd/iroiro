(() => {
  "use strict";

  window.HMW = window.HMW || {};

  const HMW = window.HMW;
  const $ = (id) => document.getElementById(id);

  const elements = {};

  const clamp = (value, min = 0, max = 100) => Math.max(min, Math.min(max, value));
  const isNumber = (value) => typeof value === "number" && Number.isFinite(value);
  const clone = (value) => JSON.parse(JSON.stringify(value));

  const getTimeLabel = (timeId) => {
    return HMW.worldData?.timeSlots?.[timeId]?.label || timeId || "―";
  };

  const getWeatherLabel = (weatherId) => {
    if (!weatherId) return "―";
    return HMW.worldData?.weather?.[weatherId]?.label || weatherId;
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

  const advanceTime = (steps = 1) => {
    const slots = Object.entries(HMW.worldData.timeSlots)
      .sort(([, a], [, b]) => a.order - b.order)
      .map(([id]) => id);

    if (!slots.length) return;

    let index = Math.max(0, slots.indexOf(HMW.state.world.time));

    for (let i = 0; i < steps; i += 1) {
      index += 1;
      if (index >= slots.length) {
        index = 0;
        HMW.state.world.day += 1;
      }
    }

    HMW.state.world.time = slots[index];
  };

  const getRelationship = (npcId) => {
    if (!HMW.state.relationships[npcId]) {
      const npc = HMW.getNpc(npcId);
      if (npc?.relationship) {
        HMW.state.relationships[npcId] = clone(npc.relationship);
      }
    }
    return HMW.state.relationships[npcId] || null;
  };

  const checkJobRequirements = (job) => {
    const requirement = job.requirements?.relationship;
    if (!requirement) return { ok: true, reason: "" };

    const relationship = getRelationship(requirement.npcId) || {};

    if (isNumber(requirement.minFamiliarity) && (relationship.familiarity || 0) < requirement.minFamiliarity) {
      return { ok: false, reason: "まだ十分な顔馴染みではありません。" };
    }

    if (isNumber(requirement.minGoodwill) && (relationship.goodwill || 0) < requirement.minGoodwill) {
      return { ok: false, reason: "まだ相手から十分な好意を得ていません。" };
    }

    if (isNumber(requirement.minTrust) && (relationship.trust || 0) < requirement.minTrust) {
      return { ok: false, reason: "まだ十分な信頼を得ていません。" };
    }

    return { ok: true, reason: "" };
  };

  const applyConditionCost = (cost = {}) => {
    const condition = HMW.state.player.condition;

    if (isNumber(condition.fatigue) && isNumber(cost.fatigue)) {
      condition.fatigue = clamp(condition.fatigue + cost.fatigue);
    }

    if (isNumber(condition.hunger) && isNumber(cost.hunger)) {
      condition.hunger = clamp(condition.hunger + cost.hunger);
    }
  };

  const applyRelationshipReward = (reward) => {
    if (!reward?.npcId) return;

    const relationship = getRelationship(reward.npcId);
    if (!relationship) return;

    ["familiarity", "trust", "goodwill", "caution", "irritation", "annoyance"].forEach((key) => {
      if (isNumber(reward[key])) {
        relationship[key] = (relationship[key] || 0) + reward[key];
      }
    });
  };

  const executeJob = (jobId) => {
    const job = HMW.getJob(jobId);
    if (!job) return;

    if (job.locationId !== HMW.state.world.locationId) {
      showNotice("この場所ではその仕事を受けられません。");
      return;
    }

    if (!job.timeSlots.includes(HMW.state.world.time)) {
      showNotice("今の時間帯はその仕事を受けられません。");
      return;
    }

    const requirement = checkJobRequirements(job);
    if (!requirement.ok) {
      showNotice(requirement.reason);
      return;
    }

    const min = job.reward?.moneyMin || 0;
    const max = job.reward?.moneyMax ?? min;
    const money = Math.floor(Math.random() * (max - min + 1)) + min;

    HMW.state.player.money += money;
    applyConditionCost(job.cost);
    applyRelationshipReward(job.reward?.relationship);
    advanceTime(job.cost?.timeSteps || 0);

    appendHistory("job", `${job.name}をして${money}獲得した。`, {
      jobId,
      money
    });

    closeModal();
    showNotice(`${job.name}を終えました。${money}獲得。`);
    render();
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
        container.append(makeSectionTitle("顔を覚えられる人"));
        npcs.forEach((npc) => {
          const relationship = getRelationship(npc.id);
          const p = document.createElement("p");
          p.style.margin = "0 0 12px";
          p.textContent = npc.role ? `${npc.displayName} — ${npc.role}` : npc.displayName;
          container.append(p);

          if (relationship) {
            relationship.familiarity = (relationship.familiarity || 0) + 1;
          }
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
    const locationId = HMW.state.world.locationId;
    const time = HMW.state.world.time;
    const jobs = HMW.getJobsAtLocation(locationId, time);

    openModal("仕事", (container) => {
      if (!jobs.length) {
        container.append(makeParagraph("今この場所で受けられる仕事はありません。"));
        return;
      }

      jobs.forEach((job) => {
        const requirement = checkJobRequirements(job);
        const min = job.reward?.moneyMin || 0;
        const max = job.reward?.moneyMax ?? min;
        const rewardText = min === max ? `${min}` : `${min}〜${max}`;

        const block = document.createElement("div");
        block.style.marginBottom = "14px";

        const title = document.createElement("strong");
        title.textContent = job.name;
        block.append(title);

        const detail = document.createElement("p");
        detail.style.margin = "5px 0 8px";
        detail.textContent = `報酬 ${rewardText} / 所要 ${job.cost?.timeSteps || 0}区分`;
        block.append(detail);

        if (!requirement.ok) {
          const reason = document.createElement("p");
          reason.style.margin = "0 0 8px";
          reason.textContent = requirement.reason;
          block.append(reason);
        }

        block.append(makeButton("この仕事をする", () => executeJob(job.id), !requirement.ok));
        container.append(block);
      });
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
      container.append(makeParagraph("HMWの複数セーブ機能は save.js で接続します。"));
      container.append(makeParagraph("現在のゲーム状態はすでに state.js にまとまっているため、この状態をそのままセーブデータにできます。"));
    });
  };

  const openMainMenu = () => {
    openModal("メニュー", (container) => {
      container.append(makeButton("状態", openStatus));
      container.append(makeButton("持ち物", openInventory));
      container.append(makeButton("記録", openLog));
      container.append(makeButton("セーブ", openSavePlaceholder));

      const back = document.createElement("a");
      back.href = "../index.html";
      back.className = "action-button";
      back.textContent = "ゲーム選択へ戻る";
      back.style.display = "block";
      back.style.marginTop = "8px";
      back.style.textDecoration = "none";
      container.append(back);
    });
  };

  const buildSceneText = (location) => {
    if (!location) return "場所情報を読み込めません。";

    const district = HMW.worldData.districts?.[location.districtId]?.name;
    const people = HMW.getNpcsAtLocation(HMW.state.world.locationId, HMW.state.world.time);
    const jobs = HMW.getJobsAtLocation(HMW.state.world.locationId, HMW.state.world.time);

    const parts = [];
    if (district) parts.push(`${district}にいます。`);
    if (people.length) parts.push(`顔を覚えられる人が${people.length}人います。`);
    if (jobs.length) parts.push(`今受けられる仕事が${jobs.length}件あります。`);
    if (!people.length && !jobs.length) parts.push("今は特に目立った用事はありません。");

    return parts.join(" ");
  };

  const render = () => {
    ensureInitialLocation();

    const state = HMW.state;
    const location = getCurrentLocation();

    elements.dayValue.textContent = state.world.day;
    elements.timeValue.textContent = getTimeLabel(state.world.time);
    elements.moneyValue.textContent = state.player.money;
    elements.weatherValue.textContent = getWeatherLabel(state.world.weather);

    const locationName = location?.name || "現在地不明";
    elements.locationName.textContent = locationName;
    elements.sceneTitle.textContent = locationName;
    elements.sceneTime.textContent = getTimeLabel(state.world.time);
    elements.sceneText.textContent = buildSceneText(location);

    elements.actionButtons[0].textContent = "移動する";
    elements.actionButtons[1].textContent = "人を見る";
    elements.actionButtons[2].textContent = "仕事を見る";
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
    advanceTime
  };

  document.addEventListener("DOMContentLoaded", init);
})();
