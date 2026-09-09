(() => {
  "use strict";
  const H = window.HMW;
  const D = H.DATA;
  const G = H.Game;
  const { rel, random, changeStats, unlock, advanceTime, underpassCheck, openModal, closeModal, info } = G;

  function homelessTalk() {
    const r = rel("homeless_named");
    const actions = [];
    if (!H.state.daily.talk.homeless_named) {
      actions.push({
        label: "この辺りの事情を聞く",
        onClick: () => {
          H.state.daily.talk.homeless_named = true;
          r.familiarity += 1;
          if (r.familiarity >= 2) {
            H.state.sleep.known.underpass = true;
            unlock("underpass", "高架下の場所を教えられた。");
          }
          if (r.familiarity >= 3) {
            unlock("riverside", "河川敷の場所を教えられた。");
            unlock("recycling_yard", "回収所を教えられた。");
          }
          closeModal();
          advanceTime(1, r.familiarity >= 3
            ? "拾える場所と巡回時間まで具体的に教えられた。"
            : "近辺の事情を少し聞いた。");
        }
      });
    }
    actions.push({
      label: "食べ物を一つ分ける",
      disabled: !["bread", "food_pack", "leftover_food"].some((id) => (H.state.inventory[id] || 0) > 0),
      onClick: () => {
        const id = ["bread", "food_pack", "leftover_food"].find((x) => (H.state.inventory[x] || 0) > 0);
        if (!id) return;
        H.removeItem(id, 1);
        r.goodwill += 2;
        r.trust += 1;
        if (r.trust >= 2) H.state.progression.homelessNetwork.safeSleepAdvice = true;
        H.addHistory("食べ物を分けた。関係が情報の質に影響する。");
        closeModal();
        G.refresh();
      }
    });
    actions.push({
      label: "今夜の寝場所を聞く",
      disabled: r.familiarity < 2,
      onClick: () => {
        H.state.sleep.known.underpass = true;
        unlock("underpass", "高架下の場所を教えられた。");
        if (r.trust >= 1 || r.goodwill >= 1) H.state.progression.homelessNetwork.safeSleepAdvice = true;
        closeModal();
        H.addHistory("寝場所の情報を得た。信頼があれば巡回を避ける具体的な助言も得られる。");
        G.refresh();
      }
    });
    openModal("名前付きホームレス", "相手にも自分の生活がある。助けは自動ではない。", actions);
  }

  function sellScrap() {
    let money = 0;
    let count = 0;
    ["aluminum_can", "scrap_piece"].forEach((id) => {
      const qty = H.state.inventory[id] || 0;
      if (!qty) return;
      money += qty * D.items[id].sell;
      count += qty;
      delete H.state.inventory[id];
    });
    if (!count) return;
    H.state.money += money;
    const p = H.state.progression.recycler;
    p.sales += 1;
    p.reliability += 1;
    rel("recycler").familiarity += 1;
    if (p.sales >= 2 && !p.trialDone) H.addLead("recycler_trial", "回収所で仕分けの試し仕事を聞く");
    H.addHistory(`廃品${count}点を${money}円で売った。時間は進まず、持ち込み実績が残る。`);
    G.refresh();
  }

  function recyclerTrial() {
    const p = H.state.progression.recycler;
    if (p.sales < 2 || p.trialDone) return;
    if (H.state.stats.fatigue > 85 || H.state.stats.health < 30) {
      info("試し仕事", "今日は体調条件に届かない。実績は残る。");
      return;
    }
    p.trialDone = true;
    p.recurringWork = true;
    H.state.money += 600;
    rel("recycler").trust += 2;
    changeStats({ fatigue: 10, hunger: 4, hygiene: -6 });
    advanceTime(1, "仕分けの試し仕事で600円を得た。持ち込み実績が仕事に変わった。");
  }

  function recyclerWork() {
    if (!H.state.progression.recycler.recurringWork || H.state.daily.recyclerWork) return;
    if (H.state.stats.fatigue > 88 || H.state.stats.hunger > 90) {
      info("回収所の仕事", "今日は状態が悪い。仕事の口は失われない。");
      return;
    }
    H.state.daily.recyclerWork = true;
    H.state.money += 650;
    changeStats({ fatigue: 11, hunger: 4, hygiene: -7 });
    advanceTime(1, "回収所の仕分けで650円を得た。");
  }

  function formalWork() {
    const p = H.state.progression.support;
    if (!p.workAccess || H.state.daily.formalWork) return;
    if (H.state.stats.health < 40 || H.state.stats.fatigue > 75 || H.state.stats.hygiene < 25 || H.state.stats.hunger > 82) {
      info("日雇い", "今日は条件不足。紹介資格は失われない。");
      return;
    }
    H.state.daily.formalWork = true;
    H.state.money += 1200;
    changeStats({ fatigue: 18, hunger: 7, hygiene: -8 });
    advanceTime(2, "日雇いを終え1200円を得た。半日を使った。");
  }

  function policeTalk() {
    if (H.state.daily.talk.police_named) return;
    const r = rel("police_named");
    openModal("名前付き警官", "職務上の距離を保っている。", [
      {
        label: "支援先を聞く",
        onClick: () => {
          H.state.daily.talk.police_named = true;
          r.familiarity += 1;
          H.state.progression.police.referralKnown = true;
          unlock("charity_center", "支援センターを教えられた。");
          closeModal();
          advanceTime(1, "警官は直接援助せず、使える窓口を案内した。");
        }
      },
      {
        label: "巡回について聞く",
        disabled: r.familiarity < 2,
        onClick: () => {
          H.state.daily.talk.police_named = true;
          r.familiarity += 1;
          r.trust += 1;
          H.state.progression.police.patrolTipKnown = true;
          H.state.world.policeAttention = Math.max(0, H.state.world.policeAttention - 1);
          closeModal();
          advanceTime(1, "苦情が出やすい場所と時間を一般論として教えられた。");
        }
      },
      {
        label: "用件だけで離れる",
        onClick: () => {
          H.state.daily.talk.police_named = true;
          r.familiarity += 1;
          closeModal();
          H.addHistory("距離を保ったまま顔だけは覚えられた。");
          G.refresh();
        }
      }
    ]);
  }

  function supportPersonTalk() {
    if (H.state.daily.talk.support_named) return;
    const r = rel("support_named");
    openModal("名前付き支援員", "手続きとは別に日々の状態を話せる。", [
      {
        label: "困っていることを正直に話す",
        onClick: () => {
          H.state.daily.talk.support_named = true;
          r.familiarity += 1;
          r.trust += 1;
          closeModal();
          advanceTime(1, "食事・寝場所・仕事のどれが苦しいかを伝えた。");
        }
      },
      {
        label: "必要な情報だけ聞く",
        onClick: () => {
          H.state.daily.talk.support_named = true;
          r.familiarity += 1;
          closeModal();
          H.addHistory("窓口と利用時間だけ確認した。距離は保った。");
          G.refresh();
        }
      }
    ]);
  }

  function thugTalk() {
    if (H.state.daily.talk.thug_named) return;
    const r = rel("thug_named");
    openModal("名前付き不良", "安全な支援者ではない。利益と危険が両方ある。", [
      {
        label: "高架下のことを聞く",
        onClick: () => {
          H.state.daily.talk.thug_named = true;
          r.familiarity += 1;
          H.state.sleep.known.underpass = true;
          unlock("underpass", "高架下の場所を聞いた。");
          if (r.familiarity >= 2) H.state.progression.thug.safePassage = true;
          closeModal();
          advanceTime(1, r.familiarity >= 2
            ? "名前を出せば高架下を使えると言われた。"
            : "場所だけ教えられた。安全保証はない。");
        }
      },
      {
        label: "金になる仕事を聞く",
        disabled: r.familiarity < 2,
        onClick: () => {
          H.state.daily.talk.thug_named = true;
          r.familiarity += 1;
          H.state.progression.thug.carryKnown = true;
          H.addLead("thug_carry", "中身不明の荷運びを受けるか決める");
          closeModal();
          advanceTime(1, "中身を聞かず運べば900円という話を出された。");
        }
      },
      {
        label: "距離を取る",
        onClick: () => {
          H.state.daily.talk.thug_named = true;
          r.familiarity += 1;
          closeModal();
          H.addHistory("深入りせず離れた。");
          G.refresh();
        }
      }
    ]);
  }

  function thugJob() {
    if (!H.state.progression.thug.carryKnown) return;
    H.state.money += 900;
    H.state.world.policeAttention += 2;
    rel("thug_named").trust += 1;
    H.state.progression.thug.debt += 1;
    changeStats({ fatigue: 10, hunger: 4 });
    advanceTime(1, "荷運びで900円を得た。警察の注意と相手への借りも増えた。");
  }

  function useItem(id) {
    const item = D.items[id];
    if (!item || !(H.state.inventory[id] > 0)) return;
    H.removeItem(id, 1);
    const effects = {};
    ["hunger", "health", "hygiene", "warmth", "wetness"].forEach((key) => {
      if (typeof item[key] === "number") effects[key] = item[key];
    });
    changeStats(effects);
    if (["bread", "rice_ball", "food_pack", "leftover_food"].includes(id)) H.completeLead("food_today");
    H.addHistory(`${item.name}を使った。時間は進まない。`);
    closeModal();
    G.refresh();
  }

  function sleepAt(place) {
    if (H.state.slot !== 3) return;
    if (place === "underpass" && underpassCheck()) return;
    const s = H.state.stats;
    let risk = 0;
    let text = "";
    if (place === "park") {
      risk = 30 + H.state.world.policeAttention * 5
        - (H.state.progression.homelessNetwork.safeSleepAdvice ? 14 : 0)
        - (H.state.progression.police.patrolTipKnown ? 8 : 0);
      s.fatigue -= 56; s.hygiene -= 4; s.warmth -= H.state.world.weather === "cold" ? 8 : 3;
      text = "公園で夜を越した。";
    } else if (place === "underpass") {
      risk = H.state.progression.thug.safePassage ? 7 : 24;
      s.fatigue -= 64; s.hygiene -= 4; s.warmth -= 2;
      text = "高架下で夜を越した。";
    } else if (place === "riverside") {
      risk = 20; s.fatigue -= 59; s.hygiene -= 5; s.warmth -= H.state.world.weather === "rain" ? 10 : 5;
      text = "河川敷で夜を越した。";
    } else if (place === "charity_referral") {
      s.fatigue -= 70; s.hygiene -= 1; s.warmth += 4;
      H.state.progression.support.shelterReferral = false;
      text = "紹介された一時宿泊先で休んだ。";
    }
    if (random(`sleep-${place}-${H.state.day}`, 1, 100) <= risk) {
      if (place === "park") { H.state.world.policeAttention += 1; s.fatigue += 9; text += " 夜中に起こされた。"; }
      if (place === "underpass") {
        const lost = Math.min(H.state.money, 120); H.state.money -= lost;
        text += ` 揉め事で${lost}円失った。体力は削られない。`;
      }
      if (place === "riverside") { s.wetness += 12; s.warmth -= 6; text += " 夜露で冷えた。"; }
    }
    H.state.day += 1;
    H.state.slot = 0;
    H.resetDaily();
    H.state.sleep.lastPlace = place;
    s.hunger += 7;
    H.clampStats();
    G.rollWeather();
    H.addHistory(text);
    G.refresh();
  }

  Object.assign(G, {
    homelessTalk, sellScrap, recyclerTrial, recyclerWork, formalWork,
    policeTalk, supportPersonTalk, thugTalk, thugJob, useItem, sleepAt
  });
})();