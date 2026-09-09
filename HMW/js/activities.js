(() => {
  "use strict";
  const H = window.HMW;
  const D = H.DATA;
  const G = H.Game;
  const { $, random, changeStats, openModal, closeModal, advanceTime, rel } = G;

  function addReward(found, id, qty = 1) {
    found[id] = (found[id] || 0) + qty;
  }

  function rewardLabel(id, qty) {
    return `${D.items[id]?.name || id}${qty > 1 ? `×${qty}` : ""}`;
  }

  function searchReward(locationId, index) {
    const roll = random(`search-${locationId}-${index}`, 1, 100);
    if (["industrial_street", "riverside"].includes(locationId)) {
      if (roll <= 36) return { id: "aluminum_can", qty: 2 };
      if (roll <= 66) return { id: "scrap_piece", qty: 1 };
      if (roll <= 82) return { id: "cardboard", qty: 1 };
      return null;
    }
    if (locationId === "residential_alley") {
      if (roll <= 32) return { id: "aluminum_can", qty: 1 };
      if (roll <= 52) return { id: "cardboard", qty: 1 };
      if (roll <= 61) return { id: "wet_wipes", qty: 1 };
      return null;
    }
    if (locationId === "park") {
      if (roll <= 35) return { id: "aluminum_can", qty: 1 };
      if (roll <= 48) return { id: "bread", qty: 1 };
      if (roll <= 62) return { id: "cardboard", qty: 1 };
      return null;
    }
    if (roll <= 40) return { id: "aluminum_can", qty: 1 };
    if (roll <= 58) return { id: "cardboard", qty: 1 };
    if (roll <= 66) return { id: "wet_wipes", qty: 1 };
    return null;
  }

  function startScavenge() {
    const id = H.state.location;
    if (H.state.daily.scavenge[id]) return;
    const found = {};
    let opened = 0;
    const rewards = Array.from({ length: 9 }, (_, i) => searchReward(id, i));

    openModal("使える物を探す", "三か所だけ調べられる。中身を見て、見つけた物を持ち帰る。", [], false);
    const body = $("modal-body");
    body.innerHTML = `<p class="activity-help">気になる場所を3つタップ。</p><div class="search-grid" id="hmw-search-grid"></div><div class="activity-result" id="hmw-search-result">まだ何も調べていない。</div>`;
    const grid = document.getElementById("hmw-search-grid");
    const result = document.getElementById("hmw-search-result");

    rewards.forEach((reward, i) => {
      const b = document.createElement("button");
      b.className = "search-tile";
      b.textContent = ["植え込み", "箱", "袋", "ベンチ下", "棚脇", "路地端", "ゴミ箱横", "柵際", "隅"][i];
      b.addEventListener("click", () => {
        if (b.dataset.opened || opened >= 3) return;
        b.dataset.opened = "1";
        opened += 1;
        if (reward) {
          addReward(found, reward.id, reward.qty);
          b.textContent = rewardLabel(reward.id, reward.qty);
          b.classList.add("found");
        } else {
          b.textContent = "何もない";
          b.classList.add("empty");
        }
        const list = Object.entries(found).map(([itemId, qty]) => rewardLabel(itemId, qty));
        result.textContent = list.length ? `見つけた物：${list.join("、")}` : "まだ持ち帰れる物は見つかっていない。";
        if (opened >= 3) finishButton();
      });
      grid.appendChild(b);
    });

    function finishButton() {
      const box = $("modal-actions");
      if (box.querySelector("[data-finish-search]")) return;
      const finish = document.createElement("button");
      finish.className = "modal-btn good";
      finish.dataset.finishSearch = "1";
      finish.textContent = "探すのを終える";
      finish.addEventListener("click", () => {
        Object.entries(found).forEach(([itemId, qty]) => H.addItem(itemId, qty));
        H.state.daily.scavenge[id] = 1;
        G.locState(id).depletion += 1;
        changeStats({ fatigue: 3, hygiene: -4 });
        closeModal();
        const list = Object.entries(found).map(([itemId, qty]) => rewardLabel(itemId, qty));
        advanceTime(1, list.length ? `${list.join("、")}を持ち帰った。` : "三か所探したが、今日は使える物を見つけられなかった。");
      });
      box.appendChild(finish);
    }
  }

  function startSortJob({ title, rounds = 6, payBase, payPerCorrect, onFinish }) {
    const symbols = ["▲", "●", "■"];
    const bins = ["A", "B", "C"];
    const shift = random(`${title}-mapping`, 0, 2);
    const mapping = {};
    symbols.forEach((symbol, i) => { mapping[symbol] = bins[(i + shift) % 3]; });
    const queue = Array.from({ length: rounds }, (_, i) => symbols[random(`${title}-parcel-${i}`, 0, 2)]);
    let index = 0;
    let score = 0;

    openModal(title, "", [], true);
    const body = $("modal-body");
    body.innerHTML = `<div class="work-card"><p><b>仕分け表</b>　${symbols.map((s) => `${s}→${mapping[s]}`).join("　")}</p><div class="work-progress" id="hmw-work-progress"></div><div class="parcel-symbol" id="hmw-parcel"></div><div class="job-bins" id="hmw-job-bins"></div><div class="activity-result" id="hmw-work-result">荷札を見て置き場を選ぶ。</div></div>`;
    const parcel = document.getElementById("hmw-parcel");
    const progress = document.getElementById("hmw-work-progress");
    const result = document.getElementById("hmw-work-result");
    const binBox = document.getElementById("hmw-job-bins");

    bins.forEach((bin) => {
      const b = document.createElement("button");
      b.className = "work-bin";
      b.textContent = `置き場 ${bin}`;
      b.addEventListener("click", () => answer(bin));
      binBox.appendChild(b);
    });

    function draw() {
      progress.textContent = `${index + 1} / ${rounds}　正解 ${score}`;
      parcel.textContent = queue[index];
    }

    function answer(bin) {
      const symbol = queue[index];
      if (mapping[symbol] === bin) {
        score += 1;
        result.textContent = "正しい置き場。";
      } else {
        result.textContent = `違う置き場だった。${symbol} は ${mapping[symbol]}。`;
      }
      index += 1;
      if (index >= rounds) return finish();
      draw();
    }

    function finish() {
      parcel.textContent = "完了";
      binBox.innerHTML = "";
      const pay = payBase + score * payPerCorrect;
      result.textContent = `${rounds}個を仕分けた。正解 ${score}/${rounds}。報酬 ${pay}円。`;
      const finish = document.createElement("button");
      finish.className = "modal-btn good";
      finish.textContent = "仕事を終える";
      finish.addEventListener("click", () => {
        closeModal();
        onFinish(pay, score, rounds);
      });
      $("modal-actions").appendChild(finish);
    }

    draw();
  }

  function startCasualWork() {
    if (!H.state.daily.casualOffer || H.state.daily.casualDone) return;
    startSortJob({
      title: "荷下ろしの小仕事",
      rounds: 6,
      payBase: 340,
      payPerCorrect: 35,
      onFinish: (pay, score, rounds) => {
        H.state.daily.casualDone = true;
        H.state.money += pay;
        H.state.progression.stability.paidWorkDays += 1;
        changeStats({ fatigue: 8, hunger: 4, hygiene: -2 });
        H.completeLead("casual_work");
        advanceTime(1, `荷下ろしを終え${pay}円を受け取った。仕分けは${score}/${rounds}正解だった。`);
      }
    });
  }

  function startCleanupWork() {
    if (H.state.daily.clerkWork) return;
    const dirty = new Set();
    for (let i = 0; dirty.size < 4; i += 1) dirty.add(random(`cleanup-${H.state.day}-${i}`, 0, 7));
    let cleaned = 0;
    openModal("店の裏を清掃する", "汚れている場所を全部タップして片付ける。", [], false);
    const body = $("modal-body");
    body.innerHTML = `<div class="cleanup-grid" id="hmw-cleanup-grid"></div><div class="activity-result" id="hmw-cleanup-result">汚れ 4か所。</div>`;
    const grid = document.getElementById("hmw-cleanup-grid");
    const result = document.getElementById("hmw-cleanup-result");
    for (let i = 0; i < 8; i += 1) {
      const b = document.createElement("button");
      b.className = `cleanup-tile ${dirty.has(i) ? "dirty" : ""}`;
      b.textContent = dirty.has(i) ? "汚れ" : "床";
      b.addEventListener("click", () => {
        if (!dirty.has(i) || b.dataset.cleaned) return;
        b.dataset.cleaned = "1";
        b.classList.remove("dirty");
        b.classList.add("clean");
        b.textContent = "済";
        cleaned += 1;
        result.textContent = `あと ${4 - cleaned}か所。`;
        if (cleaned === 4) finish();
      });
      grid.appendChild(b);
    }

    function finish() {
      result.textContent = "裏口と搬入口の清掃が終わった。";
      const b = document.createElement("button");
      b.className = "modal-btn good";
      b.textContent = "店員に報告する";
      b.addEventListener("click", () => {
        H.state.daily.clerkWork = true;
        H.state.money += 450;
        H.state.progression.stability.paidWorkDays += 1;
        H.state.progression.stability.regularIncome = true;
        rel("clerk").trust += 1;
        changeStats({ fatigue: 7, hunger: 3, hygiene: -3 });
        closeModal();
        advanceTime(1, "清掃を終え450円を受け取った。店との仕事の関係が一段深まった。");
      });
      $("modal-actions").appendChild(b);
    }
  }

  function startRecyclerWork(trial = false) {
    startSortJob({
      title: trial ? "回収所・試し仕分け" : "回収所・仕分け仕事",
      rounds: 7,
      payBase: trial ? 390 : 430,
      payPerCorrect: trial ? 30 : 32,
      onFinish: (pay, score, rounds) => {
        const p = H.state.progression.recycler;
        if (trial) {
          p.trialDone = true;
          p.recurringWork = true;
          p.reliability += 2;
          rel("recycler").trust += 2;
        } else {
          H.state.daily.recyclerWork = true;
          p.reliability += 1;
        }
        H.state.money += pay;
        H.state.progression.stability.paidWorkDays += 1;
        H.state.progression.stability.regularIncome = true;
        changeStats({ fatigue: trial ? 9 : 10, hunger: 4, hygiene: -6 });
        closeModal();
        advanceTime(1, `回収所の仕分けを終え${pay}円を受け取った。正解 ${score}/${rounds}。`);
      }
    });
  }

  function startFormalWork() {
    const rounds = 5;
    const crates = ["12", "24", "31", "47", "58", "63"];
    const target = Array.from({ length: rounds }, (_, i) => crates[random(`formal-target-${i}`, 0, crates.length - 1)]);
    let index = 0;
    let mistakes = 0;
    openModal("倉庫の日雇い", "伝票に書かれた番号の箱を順番に拾う。", [], false);
    const body = $("modal-body");
    body.innerHTML = `<div class="work-card"><p>伝票：<b id="hmw-pick-target"></b></p><div class="pick-grid" id="hmw-pick-grid"></div><div class="activity-result" id="hmw-pick-result">指定番号をタップ。</div></div>`;
    const grid = document.getElementById("hmw-pick-grid");
    const targetEl = document.getElementById("hmw-pick-target");
    const result = document.getElementById("hmw-pick-result");

    crates.forEach((number) => {
      const b = document.createElement("button");
      b.className = "pick-crate";
      b.textContent = number;
      b.addEventListener("click", () => {
        if (number === target[index]) {
          index += 1;
          result.textContent = "伝票どおり。";
        } else {
          mistakes += 1;
          result.textContent = `違う箱。必要なのは ${target[index]}。`;
        }
        if (index >= rounds) finish(); else draw();
      });
      grid.appendChild(b);
    });

    function draw() { targetEl.textContent = `${index + 1}/${rounds}　箱 ${target[index]}`; }
    function finish() {
      targetEl.textContent = "完了";
      grid.innerHTML = "";
      const pay = Math.max(950, 1250 - mistakes * 50);
      result.textContent = `伝票分を揃えた。ミス ${mistakes}回。報酬 ${pay}円。`;
      const b = document.createElement("button");
      b.className = "modal-btn good";
      b.textContent = "勤務を終える";
      b.addEventListener("click", () => {
        H.state.daily.formalWork = true;
        H.state.money += pay;
        H.state.progression.stability.paidWorkDays += 1;
        H.state.progression.stability.regularIncome = true;
        changeStats({ fatigue: 16, hunger: 7, hygiene: -7 });
        closeModal();
        advanceTime(2, `倉庫勤務を終え${pay}円を受け取った。`);
      });
      $("modal-actions").appendChild(b);
    }
    draw();
  }

  Object.assign(G, {
    startScavenge,
    startCasualWork,
    startCleanupWork,
    startRecyclerWork,
    startFormalWork
  });
})();