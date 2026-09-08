(() => {
  "use strict";

  window.HMW = window.HMW || {};
  const HMW = window.HMW;

  const MAX_SEARCHES_PER_DAY = 6;
  const SEARCH_FATIGUE = 4;
  const SEARCH_HUNGER = 1;
  const SEARCHES_PER_TIME_STEP = 2;

  const clone = (value) => JSON.parse(JSON.stringify(value));
  const isNumber = (value) => typeof value === "number" && Number.isFinite(value);
  const clamp = (value, min = 0, max = 100) => Math.max(min, Math.min(max, value));

  const ensureEmploymentState = () => {
    HMW.state.player = HMW.state.player || {};
    HMW.state.player.employment = HMW.state.player.employment || {};
    const employment = HMW.state.player.employment;

    employment.currentJobId ??= null;
    employment.workHistory = Array.isArray(employment.workHistory) ? employment.workHistory : [];
    employment.search = employment.search || {};

    const search = employment.search;
    search.day = isNumber(search.day) ? search.day : HMW.state.world.day;
    search.slotKey = search.slotKey || `${HMW.state.world.day}:${HMW.state.world.time}`;
    search.attemptsToday = isNumber(search.attemptsToday) ? search.attemptsToday : 0;
    search.attemptsThisSlot = isNumber(search.attemptsThisSlot) ? search.attemptsThisSlot : 0;
    search.discoveredJobIds = Array.isArray(search.discoveredJobIds) ? search.discoveredJobIds : [];
    search.applications = Array.isArray(search.applications) ? search.applications : [];
    search.accepted = Array.isArray(search.accepted) ? search.accepted : [];

    return employment;
  };

  const syncSearchClock = () => {
    const employment = ensureEmploymentState();
    const search = employment.search;
    const day = HMW.state.world.day;
    const slotKey = `${day}:${HMW.state.world.time}`;

    if (search.day !== day) {
      search.day = day;
      search.attemptsToday = 0;
      search.attemptsThisSlot = 0;
      search.discoveredJobIds = [];
      search.applications = [];
      search.accepted = [];
      search.slotKey = slotKey;
      return search;
    }

    if (search.slotKey !== slotKey) {
      search.slotKey = slotKey;
      search.attemptsThisSlot = 0;
    }

    return search;
  };

  const modalElements = () => ({
    layer: document.getElementById("modalLayer"),
    title: document.getElementById("modalTitle"),
    content: document.getElementById("modalContent")
  });

  const paragraph = (text) => {
    const p = document.createElement("p");
    p.textContent = text;
    p.style.margin = "0 0 12px";
    p.style.lineHeight = "1.7";
    return p;
  };

  const button = (label, onClick, disabled = false) => {
    const el = document.createElement("button");
    el.type = "button";
    el.className = "action-button";
    el.textContent = label;
    el.disabled = disabled;
    el.addEventListener("click", onClick);
    return el;
  };

  const openPanel = (titleText) => {
    const { layer, title, content } = modalElements();
    if (!layer || !title || !content) return null;
    title.textContent = titleText;
    content.replaceChildren();
    layer.hidden = false;
    return content;
  };

  const closePanel = () => {
    const { layer, content } = modalElements();
    if (content) content.replaceChildren();
    if (layer) layer.hidden = true;
  };

  const refreshUI = () => {
    HMW.app?.render?.();
    HMW.renderConditionPanel?.();
    const action = document.querySelector('[data-action-slot="3"]');
    if (action) action.textContent = "仕事を探す";
  };

  const addHistory = (type, text, extra = {}) => {
    if (typeof HMW.app?.appendHistory === "function") {
      HMW.app.appendHistory(type, text, extra);
      return;
    }

    HMW.state.history.push({
      day: HMW.state.world.day,
      time: HMW.state.world.time,
      locationId: HMW.state.world.locationId,
      type,
      text,
      ...clone(extra)
    });
  };

  const applySearchCost = () => {
    const search = syncSearchClock();
    const condition = HMW.state.player.condition;

    if (isNumber(condition.fatigue)) condition.fatigue = clamp(condition.fatigue + SEARCH_FATIGUE);
    if (isNumber(condition.hunger)) condition.hunger = clamp(condition.hunger + SEARCH_HUNGER);

    search.attemptsThisSlot += 1;

    if (search.attemptsThisSlot >= SEARCHES_PER_TIME_STEP && typeof HMW.app?.advanceTime === "function") {
      HMW.app.advanceTime(1);
      search.attemptsThisSlot = 0;
      search.slotKey = `${HMW.state.world.day}:${HMW.state.world.time}`;
    }
  };

  const getRelationship = (npcId) => {
    if (!npcId) return null;
    HMW.state.relationships = HMW.state.relationships || {};
    if (!HMW.state.relationships[npcId] && typeof HMW.getNpc === "function") {
      const npc = HMW.getNpc(npcId);
      if (npc?.relationship) HMW.state.relationships[npcId] = clone(npc.relationship);
    }
    return HMW.state.relationships[npcId] || null;
  };

  const applyRelationshipReward = (reward) => {
    if (!reward?.npcId) return;
    const relationship = getRelationship(reward.npcId);
    if (!relationship) return;

    Object.entries(reward).forEach(([key, amount]) => {
      if (key === "npcId" || !isNumber(amount)) return;
      relationship[key] = (relationship[key] || 0) + amount;
    });
  };

  const findExistingApplication = (jobId, day) => {
    const search = ensureEmploymentState().search;
    return search.applications.find((entry) => entry.jobId === jobId && entry.day === day) || null;
  };

  const findAcceptance = (jobId, day) => {
    const search = ensureEmploymentState().search;
    return search.accepted.find((entry) => entry.jobId === jobId && entry.day === day && entry.status === "accepted") || null;
  };

  const renderKnownApplication = (container, job, application) => {
    if (application.result === "accepted") {
      container.append(paragraph("応募は通っている。今日の開始時間内なら働ける。"));
      container.append(button("この仕事をする", () => performJob(job.id)));
      return;
    }

    container.append(paragraph(application.reason || "今回は採用されなかった。"));
  };

  const applyToJob = (jobId, discoveredDay) => {
    const job = HMW.getJob?.(jobId);
    if (!job) return;

    const content = openPanel("応募結果");
    if (!content) return;

    const currentDay = HMW.state.world.day;
    if (currentDay !== discoveredDay) {
      content.append(paragraph("日が変わり、この募集にはもう応募できない。"));
      return;
    }

    const existing = findExistingApplication(jobId, currentDay);
    if (existing) {
      content.append(paragraph(job.name));
      renderKnownApplication(content, job, existing);
      return;
    }

    const status = HMW.getJobApplicationStatus?.(jobId, { day: currentDay }) || { ok: false, reason: "応募条件を確認できない。" };
    const search = ensureEmploymentState().search;
    const attemptNumber = search.applications.length + 1;

    if (!status.ok) {
      const application = {
        jobId,
        day: currentDay,
        result: "blocked",
        reason: status.reason,
        barrier: status.barrier || null
      };
      search.applications.push(application);
      addHistory("job_application", `${job.name}に応募できなかった。${status.reason}`, { jobId, result: "blocked" });
      content.append(paragraph(job.name));
      content.append(paragraph(status.reason));
      refreshUI();
      return;
    }

    const accepted = HMW.isJobAccepted?.(jobId, currentDay, attemptNumber) ?? false;
    if (!accepted) {
      const reason = "条件を満たして応募したが、今回は採用されなかった。";
      search.applications.push({
        jobId,
        day: currentDay,
        result: "rejected",
        reason
      });
      addHistory("job_application", `${job.name}に応募したが採用されなかった。`, { jobId, result: "rejected" });
      content.append(paragraph(job.name));
      content.append(paragraph(reason));
      refreshUI();
      return;
    }

    search.applications.push({
      jobId,
      day: currentDay,
      result: "accepted",
      reason: ""
    });
    search.accepted.push({
      jobId,
      day: currentDay,
      acceptedTime: HMW.state.world.time,
      status: "accepted"
    });

    addHistory("job_application", `${job.name}の応募が通った。`, { jobId, result: "accepted" });
    content.append(paragraph(job.name));
    content.append(paragraph("応募は通った。今日の開始時間内なら働ける。"));
    content.append(button("この仕事をする", () => performJob(jobId)));
    refreshUI();
  };

  const performJob = (jobId) => {
    const job = HMW.getJob?.(jobId);
    if (!job) return;

    const content = openPanel("仕事");
    if (!content) return;

    const day = HMW.state.world.day;
    const acceptance = findAcceptance(jobId, day);
    if (!acceptance) {
      content.append(paragraph("この仕事にはまだ採用されていない。"));
      return;
    }

    if (job.locationId !== HMW.state.world.locationId) {
      content.append(paragraph("仕事の場所まで移動する必要がある。"));
      return;
    }

    if (!job.timeSlots.includes(HMW.state.world.time)) {
      content.append(paragraph("今日の開始時間を過ぎてしまった。"));
      acceptance.status = "missed";
      return;
    }

    const requirementStatus = HMW.getJobRequirementStatus?.(jobId) || { ok: false, reason: "条件を確認できない。" };
    if (!requirementStatus.ok) {
      content.append(paragraph(requirementStatus.reason));
      return;
    }

    const min = job.reward?.moneyMin || 0;
    const max = job.reward?.moneyMax ?? min;
    const money = Math.floor(Math.random() * (max - min + 1)) + min;
    const condition = HMW.state.player.condition;

    HMW.state.player.money += money;
    if (isNumber(condition.fatigue) && isNumber(job.cost?.fatigue)) condition.fatigue = clamp(condition.fatigue + job.cost.fatigue);
    if (isNumber(condition.hunger) && isNumber(job.cost?.hunger)) condition.hunger = clamp(condition.hunger + job.cost.hunger);
    applyRelationshipReward(job.reward?.relationship);

    if (typeof HMW.app?.advanceTime === "function") HMW.app.advanceTime(job.cost?.timeSteps || 0);

    acceptance.status = "completed";
    const employment = ensureEmploymentState();
    employment.workHistory.push({
      jobId,
      name: job.name,
      day,
      money
    });

    addHistory("job", `${job.name}をして${money}獲得した。`, { jobId, money });
    closePanel();

    const notice = document.getElementById("noticeArea");
    if (notice) {
      notice.textContent = `${job.name}を終えた。${money}獲得。`;
      notice.hidden = false;
    }

    refreshUI();
  };

  const renderLead = (container, job, searchDay) => {
    const heading = document.createElement("strong");
    heading.textContent = job.name;
    heading.style.display = "block";
    heading.style.marginBottom = "8px";
    container.append(heading);

    container.append(paragraph(job.notes || "募集情報を見つけた。"));

    const existing = findExistingApplication(job.id, searchDay);
    if (existing) {
      renderKnownApplication(container, job, existing);
      return;
    }

    const requirement = HMW.getJobRequirementStatus?.(job.id) || { ok: false, reason: "応募条件を確認できない。" };
    if (!requirement.ok) {
      container.append(paragraph(`応募条件を確認すると、${requirement.reason}`));
      return;
    }

    if (!(HMW.isJobAvailableToday?.(job.id, searchDay) ?? false)) {
      container.append(paragraph("募集情報はあったが、今日はすでに枠が埋まっている。"));
      return;
    }

    container.append(button("応募する", () => applyToJob(job.id, searchDay)));
  };

  const searchForWork = () => {
    const search = syncSearchClock();
    const day = HMW.state.world.day;
    const time = HMW.state.world.time;
    const locationId = HMW.state.world.locationId;
    const locationName = HMW.getLocation?.(locationId)?.name || "この場所";
    const content = openPanel("仕事を探す");
    if (!content) return;

    if (search.attemptsToday >= MAX_SEARCHES_PER_DAY) {
      content.append(paragraph("今日はかなりの時間と体力を仕事探しに使った。これ以上探しても動ける範囲がほとんど残っていない。"));
      return;
    }

    search.attemptsToday += 1;
    const attempt = search.attemptsToday;
    const candidates = HMW.getJobSearchCandidates?.(locationId, time) || [];
    const found = candidates.find((job) => HMW.isJobLeadFound?.(job.id, day, attempt));

    applySearchCost();
    addHistory("job_search", `${locationName}で仕事を探した。`, {
      searchAttempt: attempt,
      foundJobId: found?.id || null
    });

    if (!candidates.length) {
      content.append(paragraph(`${locationName}で仕事につながりそうな情報を探したが、今の時間に当たれる募集先は見つからなかった。`));
      content.append(paragraph("歩き回った分、空腹と疲労だけが少し増えた。"));
      refreshUI();
      return;
    }

    if (!found) {
      content.append(paragraph("求人の掲示や人づての情報を探したが、今すぐ応募につながるものは見つからなかった。"));
      content.append(paragraph("探した時間と体力は消費した。"));
      refreshUI();
      return;
    }

    if (!search.discoveredJobIds.includes(found.id)) search.discoveredJobIds.push(found.id);
    content.append(paragraph("募集につながりそうな情報を一件見つけた。"));
    renderLead(content, found, day);
    refreshUI();
  };

  const keepActionLabel = () => {
    const action = document.querySelector('[data-action-slot="3"]');
    if (!action) return;
    action.textContent = "仕事を探す";

    const observer = new MutationObserver(() => {
      if (action.textContent !== "仕事を探す") action.textContent = "仕事を探す";
    });
    observer.observe(action, { childList: true, characterData: true, subtree: true });
  };

  document.addEventListener("click", (event) => {
    const target = event.target.closest?.('[data-action-slot="3"]');
    if (!target) return;

    event.preventDefault();
    event.stopImmediatePropagation();
    searchForWork();
  }, true);

  document.addEventListener("DOMContentLoaded", () => {
    ensureEmploymentState();
    keepActionLabel();
  });

  HMW.jobSearch = {
    open: searchForWork,
    apply: applyToJob,
    perform: performJob,
    ensureState: ensureEmploymentState
  };
})();
