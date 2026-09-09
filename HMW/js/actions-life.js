(() => {
  "use strict";
  const H = window.HMW;
  const D = H.DATA;
  const G = H.Game;
  const { rel, random, changeStats, unlock, advanceTime, policeCheck, openModal, closeModal, info } = G;

  function board() {
    unlock("charity_center", "支援センターの場所を確認した。");
    unlock("labor_office", "労働窓口の場所を確認した。");
    unlock("public_toilet", "公衆トイレの位置を確認した。");
    unlock("recycling_yard", "廃品回収所の場所を確認した。");
    unlock("industrial_street", "工業通りの場所を確認した。");
    H.state.progression.informal.recyclingNoticeKnown = true;
    H.state.progression.informal.casualWorkKnown = true;
    H.completeLead("first_board");
    H.addLead("support_case", "支援センターで相談する");
    H.addLead("scrap_money", "工業通りで廃品を集め、回収所で売る");
    H.addLead("casual_work", "駅前で今日の小仕事を確認する");
    H.addHistory("掲示板から複数の生活手段を得た。調べただけなので時間は進まない。");
    G.refresh();
  }

  function shoppingLook() {
    unlock("convenience_store", "コンビニの場所を確認した。");
    unlock("residential_alley", "住宅裏への抜け道を確認した。");
    H.addHistory("店と裏道を把握した。時間は進まない。");
    G.refresh();
  }

  function checkCasualWork() {
    if (H.state.daily.casualChecked) return;
    H.state.daily.casualChecked = true;
    H.state.daily.casualOffer = random(`casual-${H.state.day}`, 1, 100) <= 72;
    H.addHistory(H.state.daily.casualOffer
      ? "今日だけの荷下ろし手伝いが一件ある。"
      : "今日は書類なしの小仕事は出ていない。別の稼ぎ方を選べる。");
    G.refresh();
  }

  function casualWork() {
    if (!H.state.daily.casualOffer || H.state.daily.casualDone) return;
    if (H.state.stats.fatigue > 82 || H.state.stats.hunger > 86 || H.state.stats.health < 30) {
      info("小仕事", "今日は体調条件に届かない。仕事の口は消えない。");
      return;
    }
    H.state.daily.casualDone = true;
    H.state.money += 550;
    changeStats({ fatigue: 9, hunger: 4, hygiene: -3 });
    H.completeLead("casual_work");
    advanceTime(1, "荷下ろしを手伝い550円を得た。正式手続きとは別の仕事だ。");
  }

  function beg() {
    const id = H.state.location;
    const used = H.state.daily.beg[id] || 0;
    if (used >= 2 || policeCheck("beg")) return;
    H.state.daily.beg[id] = used + 1;
    const money = random(`beg-${id}-${used}`, 55, 180);
    H.state.money += money;
    H.state.world.policeAttention += 1;
    G.locState(id).heat += 1;
    advanceTime(1, `${D.locations[id].name}で${money}円を得た。代わりに警察の注意が増えた。`);
  }

  function scavenge() {
    const id = H.state.location;
    const used = H.state.daily.scavenge[id] || 0;
    if (used >= 1) return;
    if (["station_front", "shopping_street"].includes(id) && policeCheck("scavenge")) return;
    H.state.daily.scavenge[id] = used + 1;
    G.locState(id).depletion += 1;
    changeStats({ fatigue: 4, hygiene: -6 });
    if (["industrial_street", "riverside"].includes(id)) {
      H.addItem("aluminum_can", random(`can-${id}`, 1, 3));
      if (random(`metal-${id}`, 1, 100) <= 58) H.addItem("scrap_piece", 1);
    } else {
      H.addItem("aluminum_can", 1);
      if (random(`card-${id}`, 1, 100) <= 35) H.addItem("cardboard", 1);
    }
    advanceTime(1, "使える廃品を拾った。売る・使うという次の選択につながる。");
  }

  function rest() {
    const id = H.state.location;
    if (H.state.daily.rest[id]) return;
    H.state.daily.rest[id] = true;
    changeStats({ fatigue: -18, warmth: 2 });
    advanceTime(1, "時間を使って休み、疲労を戻した。");
  }

  function wash() {
    const id = H.state.location;
    if (H.state.daily.wash[id]) return;
    H.state.daily.wash[id] = true;
    changeStats({ hygiene: 32, wetness: -10 });
    H.addHistory("身支度をした。短い行動なので時間は進まない。");
    G.refresh();
  }

  function foodSupport() {
    if (H.state.daily.foodSupport || H.state.slot === 3) return;
    H.state.daily.foodSupport = true;
    H.addItem("food_pack", 1);
    changeStats({ hunger: -18 });
    H.completeLead("food_today");
    H.addHistory("支援食を受け取り少し食べ、残りを持ち物に入れた。時間は進まない。");
    G.refresh();
  }

  function supportStart(priority) {
    const p = H.state.progression.support;
    p.stage = 1;
    p.caseOpened = true;
    p.priority = priority;
    p.nextDay = H.state.day + 1;
    rel("support_named").familiarity += 1;
    rel("support_named").trust += 1;
    H.addLead("support_return", `DAY${p.nextDay}以降に再相談する`);
    closeModal();
    advanceTime(1, "相談記録が作られ、次回までに確認してもらうことになった。");
  }

  function supportConsult() {
    const p = H.state.progression.support;
    if (!p.stage) {
      openModal("相談で優先すること", "一度で全部は解決しない。何を先に進めるか選ぶ。", [
        { label: "身分証と手続き", onClick: () => supportStart("identity") },
        { label: "連絡手段と住所", onClick: () => supportStart("contact") },
        { label: "仕事につながる準備", onClick: () => supportStart("work") }
      ]);
      return;
    }
    if (H.state.day < p.nextDay) {
      info("支援相談", `次はDAY${p.nextDay}以降。今日は別の生活手段を使える。`);
      return;
    }
    p.stage += 1;
    p.nextDay = H.state.day + 1;
    rel("support_named").familiarity += 1;
    rel("support_named").trust += 1;
    let text = "手続きを一段進めた。";
    if (p.stage === 2) {
      p.shelterReferral = true;
      H.state.sleep.known.charity_referral = true;
      text = "一時宿泊相談を一度使えるようになった。";
    }
    if (p.stage === 4) {
      p.workAccess = true;
      H.addLead("formal_work", "労働窓口で正式な日雇いを確認する");
      text = "正式な日雇い紹介を使えるようになった。";
    }
    advanceTime(1, text);
  }

  function openShop() {
    const ids = ["bread", "rice_ball", "bottled_water", "wet_wipes", "soap", "bandage"];
    openModal("買い物", `所持金 ${H.state.money}円`, ids.map((id) => ({
      label: `${D.items[id].name} ${D.items[id].price}円`,
      disabled: H.state.money < D.items[id].price,
      onClick: () => {
        H.state.money -= D.items[id].price;
        H.addItem(id, 1);
        H.addHistory(`${D.items[id].name}を買った。時間は進まない。`);
        closeModal();
        G.refresh();
      }
    })));
  }

  function clerkWork() {
    if (H.state.daily.clerkWork) return;
    if (H.state.stats.fatigue > 88 || H.state.stats.hunger > 90) {
      info("清掃仕事", "今日は状態が悪い。関係自体は失われない。");
      return;
    }
    H.state.daily.clerkWork = true;
    H.state.money += 450;
    rel("clerk").trust += 1;
    changeStats({ fatigue: 8, hunger: 3, hygiene: -3 });
    advanceTime(1, "店の清掃で450円を得た。関係が継続的な小仕事につながった。");
  }

  function clerkTalk() {
    if (H.state.daily.talk.clerk) return;
    const r = rel("clerk");
    openModal("コンビニ店員", "何を話すかで店との関係が変わる。", [
      {
        label: "普通に話す",
        onClick: () => {
          H.state.daily.talk.clerk = true;
          r.familiarity += 1;
          H.state.progression.clerk.visits += 1;
          if (r.irritation > 0) r.irritation -= 1;
          if (r.familiarity >= 3) {
            H.state.progression.clerk.cleanupUnlocked = true;
            H.addLead("clerk_cleanup", "夕方以降に店の清掃仕事を聞く");
          }
          closeModal();
          advanceTime(1, r.familiarity >= 3 ? "店の裏清掃を頼む日があると教えられた。" : "顔を覚えられてきた。");
        }
      },
      {
        label: "廃棄予定の食べ物を聞く",
        disabled: r.familiarity < 2 || H.state.slot < 2,
        onClick: () => {
          H.state.daily.talk.clerk = true;
          const chance = G.clamp(18 + r.familiarity * 12 + r.goodwill * 8 - r.irritation * 18, 5, 78);
          const ok = random(`leftover-${H.state.day}`, 1, 100) <= chance;
          if (ok) { H.addItem("leftover_food", 1); r.goodwill += 1; }
          else r.irritation += 1;
          closeModal();
          advanceTime(1, ok ? "今日は食べ物を一つ分けてもらえた。" : "今日は断られ、しつこさへの警戒が増えた。");
        }
      },
      {
        label: "清掃の仕事を聞く",
        disabled: !H.state.progression.clerk.cleanupUnlocked || H.state.slot < 2,
        onClick: () => { closeModal(); clerkWork(); }
      }
    ]);
  }

  Object.assign(G, {
    board, shoppingLook, checkCasualWork, casualWork, beg, scavenge, rest, wash,
    foodSupport, supportConsult, openShop, clerkTalk, clerkWork
  });
})();