(() => {
  "use strict";

  const D = window.HOUSE_DATA;
  const SAVE_KEY = "iroiroHouseBuilderV1";
  const gridEl = document.getElementById("grid");
  const moneyEl = document.getElementById("money");
  const statusEl = document.getElementById("statusText");
  const progressEl = document.getElementById("goalProgress");
  const goalTitleEl = document.getElementById("goalTitle");
  const toastEl = document.getElementById("toast");
  const completeBtn = document.getElementById("completeBtn");

  let selectedTool = "floor";
  let goalIndex = 0;
  let money = D.startMoney;
  let cells = createBlankCells();
  let toastTimer = 0;

  function createBlankCells() {
    return Array.from({ length: D.cols * D.rows }, () => ({ base: "empty", furniture: null }));
  }

  function showToast(message) {
    clearTimeout(toastTimer);
    toastEl.textContent = message;
    toastEl.classList.add("show");
    toastTimer = setTimeout(() => toastEl.classList.remove("show"), 1500);
  }

  function moneyText(value) {
    return Number(value).toLocaleString("ja-JP");
  }

  function countAll() {
    const counts = { floor: 0, wall: 0, door: 0, window: 0, bed: 0, table: 0, sofa: 0, stove: 0, toilet: 0 };
    for (const c of cells) {
      if (counts[c.base] !== undefined) counts[c.base]++;
      if (c.furniture && counts[c.furniture] !== undefined) counts[c.furniture]++;
    }
    return counts;
  }

  function costOfCell(cell) {
    let total = 0;
    if (D.base[cell.base]) total += D.base[cell.base].price;
    if (cell.furniture && D.furniture[cell.furniture]) total += D.furniture[cell.furniture].price;
    return total;
  }

  function requirementLabel(key) {
    if (D.base[key]) return D.base[key].label;
    if (D.furniture[key]) return D.furniture[key].name;
    return key;
  }

  function renderGoal() {
    const goal = D.goals[Math.min(goalIndex, D.goals.length - 1)];
    const counts = countAll();
    goalTitleEl.textContent = goal.title;
    progressEl.innerHTML = "";
    for (const [key, needed] of Object.entries(goal.requirements)) {
      const have = counts[key] || 0;
      const el = document.createElement("span");
      el.className = "req" + (have >= needed ? " ok" : "");
      el.textContent = requirementLabel(key) + " " + have + "/" + needed;
      progressEl.appendChild(el);
    }
    completeBtn.textContent = goalIndex >= D.goals.length ? "全依頼完了" : "完成判定";
    completeBtn.disabled = goalIndex >= D.goals.length;
  }

  function render() {
    moneyEl.textContent = moneyText(money);
    gridEl.innerHTML = "";
    cells.forEach((cell, index) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "cell " + cell.base;
      btn.dataset.index = index;
      btn.setAttribute("role", "gridcell");
      btn.setAttribute("aria-label", (index + 1) + "番マス " + cell.base);
      if (cell.furniture) {
        const f = document.createElement("span");
        f.className = "furn " + cell.furniture;
        f.textContent = D.furniture[cell.furniture].label;
        btn.appendChild(f);
      }
      gridEl.appendChild(btn);
    });
    renderGoal();
  }

  function canPay(price) {
    if (money < price) {
      showToast("お金が足りません");
      return false;
    }
    return true;
  }

  function placeStructure(cell, type) {
    const item = D.base[type];
    if (!item) return;

    if (type === "door" || type === "window") {
      if (cell.base !== "wall") {
        showToast("扉・窓は壁のマスに置きます");
        return;
      }
      const extra = Math.max(0, item.price - D.base.wall.price);
      if (!canPay(extra)) return;
      money -= extra;
      cell.base = type;
      statusEl.textContent = item.label + "を取り付けました";
      return;
    }

    if (cell.base !== "empty") {
      showToast("先に撤去してください");
      return;
    }
    if (!canPay(item.price)) return;
    money -= item.price;
    cell.base = type;
    statusEl.textContent = item.label + "を置きました";
  }

  function placeFurniture(cell, type) {
    const item = D.furniture[type];
    if (!item) return;
    if (cell.base !== "floor") {
      showToast("家具は床の上に置きます");
      return;
    }
    if (cell.furniture) {
      showToast("このマスには家具があります");
      return;
    }
    if (!canPay(item.price)) return;
    money -= item.price;
    cell.furniture = type;
    statusEl.textContent = item.name + "を置きました";
  }

  function removeFrom(cell) {
    if (cell.furniture) {
      const price = D.furniture[cell.furniture].price;
      const name = D.furniture[cell.furniture].name;
      money += Math.floor(price / 2);
      cell.furniture = null;
      statusEl.textContent = name + "を撤去しました";
      return;
    }
    if (cell.base !== "empty") {
      const price = D.base[cell.base]?.price || 0;
      const name = D.base[cell.base]?.label || cell.base;
      money += Math.floor(price / 2);
      cell.base = "empty";
      statusEl.textContent = name + "を撤去しました";
      return;
    }
    showToast("ここには何もありません");
  }

  function applyTool(index) {
    const cell = cells[index];
    if (!cell) return;
    if (selectedTool === "remove") removeFrom(cell);
    else if (D.base[selectedTool]) placeStructure(cell, selectedTool);
    else if (D.furniture[selectedTool]) placeFurniture(cell, selectedTool);
    render();
  }

  function selectTool(tool) {
    selectedTool = tool;
    document.querySelectorAll(".tool").forEach(btn => {
      btn.classList.toggle("active", btn.dataset.tool === tool);
    });
    const label = D.base[tool]?.label || D.furniture[tool]?.name || "撤去";
    statusEl.textContent = label + "を選択中";
  }

  function switchTab(tab) {
    document.querySelectorAll(".tab").forEach(btn => btn.classList.toggle("active", btn.dataset.tab === tab));
    document.getElementById("structureTools").classList.toggle("hidden", tab !== "structure");
    document.getElementById("furnitureTools").classList.toggle("hidden", tab !== "furniture");
    document.getElementById("manageTools").classList.toggle("hidden", tab !== "manage");
    if (tab === "structure" && !D.base[selectedTool] && selectedTool !== "remove") selectTool("floor");
    if (tab === "furniture" && !D.furniture[selectedTool]) selectTool("bed");
  }

  function isGoalComplete(goal) {
    const counts = countAll();
    return Object.entries(goal.requirements).every(([key, needed]) => (counts[key] || 0) >= needed);
  }

  function completeGoal() {
    if (goalIndex >= D.goals.length) return;
    const goal = D.goals[goalIndex];
    if (!isGoalComplete(goal)) {
      showToast("まだ依頼条件を満たしていません");
      return;
    }
    money += goal.reward;
    goalIndex++;
    if (goalIndex >= D.goals.length) {
      showToast("全ての依頼を完成しました");
      statusEl.textContent = "好きな家を作れます";
    } else {
      showToast("完成！ 報酬 " + moneyText(goal.reward) + "円");
      statusEl.textContent = "次の依頼：" + D.goals[goalIndex].title;
    }
    render();
  }

  function saveGame() {
    const payload = { version: 1, money, goalIndex, cells };
    localStorage.setItem(SAVE_KEY, JSON.stringify(payload));
    showToast("保存しました");
  }

  function loadGame() {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) {
      showToast("保存データがありません");
      return;
    }
    try {
      const data = JSON.parse(raw);
      if (!Array.isArray(data.cells) || data.cells.length !== D.cols * D.rows) throw new Error("bad data");
      money = Number.isFinite(data.money) ? data.money : D.startMoney;
      goalIndex = Number.isInteger(data.goalIndex) ? Math.max(0, Math.min(data.goalIndex, D.goals.length)) : 0;
      cells = data.cells.map(c => ({
        base: ["empty","floor","wall","door","window"].includes(c.base) ? c.base : "empty",
        furniture: D.furniture[c.furniture] ? c.furniture : null
      }));
      render();
      showToast("読み込みました");
    } catch {
      showToast("保存データを読み込めません");
    }
  }

  function resetGame() {
    if (!confirm("現在の家を更地に戻しますか？")) return;
    money = D.startMoney;
    goalIndex = 0;
    cells = createBlankCells();
    statusEl.textContent = "更地に戻しました";
    render();
  }

  gridEl.addEventListener("click", event => {
    const cell = event.target.closest(".cell");
    if (!cell) return;
    applyTool(Number(cell.dataset.index));
  });

  document.querySelectorAll(".tool").forEach(btn => {
    btn.addEventListener("click", () => selectTool(btn.dataset.tool));
  });

  document.querySelectorAll(".tab").forEach(btn => {
    btn.addEventListener("click", () => switchTab(btn.dataset.tab));
  });

  completeBtn.addEventListener("click", completeGoal);
  document.getElementById("saveBtn").addEventListener("click", saveGame);
  document.getElementById("loadBtn").addEventListener("click", loadGame);
  document.getElementById("resetBtn").addEventListener("click", resetGame);

  render();
})();