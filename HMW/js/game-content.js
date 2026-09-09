(() => {
  "use strict";

  window.HMW = window.HMW || {};
  const HMW = window.HMW;

  const clone = (value) => JSON.parse(JSON.stringify(value));
  const clamp = (value, min = 0, max = 100) => Math.max(min, Math.min(max, value));

  const stableRoll = (key) => {
    let hash = 2166136261;
    const text = String(key);
    for (let i = 0; i < text.length; i += 1) {
      hash ^= text.charCodeAt(i);
      hash = Math.imul(hash, 16777619);
    }
    return (hash >>> 0) / 4294967296;
  };

  const day = () => HMW.state.world.day;
  const time = () => HMW.state.world.time;
  const locationId = () => HMW.state.world.locationId;
  const player = () => HMW.state.player;
  const condition = () => player().condition;
  const loc = () => HMW.getLocation?.(locationId()) || null;

  const ensure = () => {
    const p = player();
    p.progression = p.progression || {};
    p.progression.gameContent = p.progression.gameContent || {
      flags: {},
      tips: [],
      contacts: {},
      visits: {},
      daily: { day: day(), actions: {}, conversations: {} }
    };
    const g = p.progression.gameContent;
    g.flags = g.flags || {};
    g.tips = Array.isArray(g.tips) ? g.tips : [];
    g.contacts = g.contacts || {};
    g.visits = g.visits || {};
    if (!g.daily || g.daily.day !== day()) {
      g.daily = { day: day(), actions: {}, conversations: {} };
    }
    g.daily.actions = g.daily.actions || {};
    g.daily.conversations = g.daily.conversations || {};
    return g;
  };

  const remember = (tip) => {
    const g = ensure();
    if (!g.tips.includes(tip)) g.tips.push(tip);
    const social = player().progression?.social;
    if (social?.knownTips && !social.knownTips.includes(tip)) social.knownTips.push(tip);
  };

  const hasTip = (tip) => ensure().tips.includes(tip) || player().progression?.social?.knownTips?.includes(tip);
  const setFlag = (key, value = true) => { ensure().flags[key] = value; };
  const flag = (key) => ensure().flags[key];

  const history = (type, text, extra = {}) => {
    if (HMW.app?.appendHistory) HMW.app.appendHistory(type, text, extra);
    else HMW.state.history.push({ day: day(), time: time(), locationId: locationId(), type, text, ...clone(extra) });
  };

  const modal = (titleText) => {
    const layer = document.getElementById("modalLayer");
    const title = document.getElementById("modalTitle");
    const content = document.getElementById("modalContent");
    if (!layer || !title || !content) return null;
    title.textContent = titleText;
    content.replaceChildren();
    layer.hidden = false;
    return content;
  };

  const paragraph = (text) => {
    const p = document.createElement("p");
    p.textContent = text;
    p.style.margin = "0 0 12px";
    p.style.lineHeight = "1.65";
    return p;
  };

  const heading = (text) => {
    const h = document.createElement("strong");
    h.textContent = text;
    h.style.display = "block";
    h.style.margin = "16px 0 8px";
    return h;
  };

  const button = (label, run, disabled = false) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "action-button";
    b.textContent = label;
    b.disabled = disabled;
    if (run) b.addEventListener("click", run);
    return b;
  };

  const show = (titleText, lines = [], actions = []) => {
    const content = modal(titleText);
    if (!content) return;
    lines.filter(Boolean).forEach((line) => content.append(paragraph(line)));
    actions.forEach((action) => content.append(button(action.label, action.run, action.disabled)));
    refresh();
  };

  const baseActions = () => HMW.lifeLoop?.getContextActions?.() || [];
  const baseAction = (id) => baseActions().find((action) => action.id === id) || null;
  const runBase = (id) => {
    const action = baseAction(id);
    if (action?.run) action.run();
  };

  const relationship = (id) => {
    if (id?.startsWith("romance_") && HMW.ensureLoveInterestRelationship) return HMW.ensureLoveInterestRelationship(id);
    HMW.state.relationships = HMW.state.relationships || {};
    HMW.state.relationships[id] = HMW.state.relationships[id] || { familiarity: 0, trust: 0, goodwill: 0, caution: 0, irritation: 0 };
    return HMW.state.relationships[id];
  };

  const addRel = (id, changes = {}) => {
    const r = relationship(id);
    Object.entries(changes).forEach(([key, amount]) => {
      r[key] = (r[key] || 0) + amount;
    });
    ensure().contacts[id] = (ensure().contacts[id] || 0) + 1;
    return r;
  };

  const markDaily = (key) => { ensure().daily.actions[key] = true; };
  const didDaily = (key) => Boolean(ensure().daily.actions[key]);

  const inspectStationBoard = () => {
    if (flag("station_board")) {
      show("駅前の案内", ["前に確認した案内がある。支援施設、職業相談所、公衆トイレの場所は把握している。"]);
      return;
    }
    setFlag("station_board");
    remember("charity_center");
    remember("labor_office");
    remember("public_toilet");
    history("information", "駅前で支援施設・職業相談所・公衆トイレの案内を確認した。");
    show("駅前の案内", [
      "掲示や案内図を一つずつ確認した。無料の生活相談をしている支援施設、公的な職業相談所、公衆トイレの場所が分かった。",
      "どこへ行っても問題が即座に解決するわけではないが、少なくとも行き先はできた。"
    ]);
  };

  const inspectShoppingStreet = () => {
    const key = `shopping_notice:${time()}`;
    if (didDaily(key)) {
      show("商店街を調べる", ["同じ時間帯に見られる範囲はもう確認した。新しい張り紙や情報は見当たらない。"]);
      return;
    }
    markDaily(key);
    const r = stableRoll(`shopping:${day()}:${time()}`);
    if (r < 0.34) {
      remember("convenience_clerk");
      history("information", "商店街で、夕方以降も開いているコンビニを確認した。");
      show("商店街を調べる", ["店先や張り紙を見て回った。夕方以降も開いているコンビニがあり、少なくとも安い食べ物を買える場所として使えそうだ。"]);
    } else if (r < 0.62) {
      remember("charity_center");
      history("information", "商店街の掲示で支援施設の案内を見つけた。");
      show("商店街を調べる", ["地域の掲示板に生活相談の案内が残っていた。支援施設の場所を確認できた。"]);
    } else {
      show("商店街を調べる", ["張り紙や店先を見て回ったが、今日すぐ使えそうな情報は見つからなかった。時間だけは使った。"]);
    }
    condition().fatigue = clamp(condition().fatigue + 2);
  };

  const checkParkSituation = () => {
    const key = `park:${time()}`;
    if (didDaily(key)) {
      show("公園の様子", ["この時間帯の公園は一度見て回った。状況は大きく変わっていない。"]);
      return;
    }
    markDaily(key);
    if (["evening", "night", "lateNight"].includes(time())) {
      remember("park_sleep");
      history("information", "公園で夜に人目の少なくなる場所を確認した。");
      show("公園の様子", ["ベンチ、照明、巡回の通り道、遅い時間まで人が残る場所を確認した。ここで寝られるかどうかは夜になって実際に探さないと分からないが、見る場所の見当はついた。"]);
      return;
    }
    remember("charity_center");
    show("公園の様子", ["人の流れを見ていると、公園の先に支援施設へ向かう人がいる。昼なら食料配布や生活相談がある日もあるらしい。毎日確実とは限らない。"]);
  };

  const checkUnderpass = () => {
    const key = `underpass:${time()}`;
    if (!didDaily(key)) {
      markDaily(key);
      remember("underpass_sleep");
      history("information", "高架下の人目・風・先客の様子を確認した。");
    }
    show("高架下の様子", [
      "雨風は多少避けられるが、先客の荷物や縄張りらしい場所がある。空いて見える場所でも勝手に安全な寝床とは決められない。",
      "夜に寝場所を探すなら、先客・不良・巡回の様子を見ながら判断する必要がある。"
    ]);
  };

  const checkLaborRequirements = () => {
    const access = player().workAccess || {};
    const labels = {
      contactAddress: "連絡先として使える住所",
      identityDocument: "本人確認書類",
      phone: "連絡に使える電話",
      bankAccount: "給与を受け取る口座"
    };
    const missing = Object.entries(access).filter(([, value]) => !value).map(([key]) => labels[key] || key);
    if (missing.length) {
      show("応募条件を確認する", [
        `現状で不足しているもの：${missing.join("、")}。`,
        "求人が存在していても、これらが必要な仕事には今のままでは応募できない。支援施設の生活相談から手続きを進める必要がある。"
      ], [{ label: "求人そのものを見る", run: () => runBase("work_search") }]);
    } else {
      show("応募条件を確認する", ["最低限の連絡・本人確認手段はそろっている。ここから先は、その日の募集の有無、仕事内容、採用条件の問題になる。"], [
        { label: "求人を探す", run: () => runBase("work_search") }
      ]);
    }
  };

  const askPoliceDesk = () => {
    if (!flag("police_support_info")) {
      setFlag("police_support_info");
      remember("charity_center");
      history("information", "警察署で生活相談先として支援施設の情報を聞いた。");
      show("警察署で尋ねる", ["生活に困っているとだけ伝えて相談先を尋ねた。警察が住居や仕事を用意するわけではないが、地域の支援窓口の場所は教えられた。"]);
      return;
    }
    show("警察署で尋ねる", ["前に案内された支援窓口の情報以上に、ここですぐ生活を立て直せる話は出てこない。"]);
  };

  const askRecycler = () => {
    remember("scrap_route");
    const r = relationship("recycler_staff");
    r.familiarity = (r.familiarity || 0) + 1;
    history("information", "廃品回収所で、持ち込める廃品について聞いた。");
    show("廃品回収所で聞く", ["何でも金になるわけではない。状態の悪い物や価値のない物は断られるが、工業地区や川沿いで見つかる一部の廃品なら引き取れることがある、と分かった。"]);
  };

  const inspectIndustrial = () => {
    const key = `industrial:${time()}`;
    if (didDaily(key)) {
      show("工業地区を調べる", ["この時間帯に見られる範囲はもう確認した。状況は変わっていない。"]);
      return;
    }
    markDaily(key);
    const r = stableRoll(`industrial:${day()}:${time()}`);
    if (r < 0.42) {
      remember("scrap_route");
      show("工業地区を調べる", ["搬出後らしい場所に、回収業者へ持ち込めるかもしれない物が出ることがある。ただし勝手に持っていける物ばかりではない。廃棄物として明確に出されている場所を探す必要がある。"]);
    } else {
      show("工業地区を調べる", ["求人や廃品になりそうな物を探して歩いたが、今すぐ使えるものは見つからなかった。募集がある日とは限らない。"]);
    }
    condition().fatigue = clamp(condition().fatigue + 2);
  };

  const inspectConvenience = () => {
    const clerk = relationship("convenience_clerk");
    const lines = ["店内なら値段を見て、今の所持金で買える物があるか確認できる。店員は主人公を特別扱いする理由をまだ持っていない。"];
    if ((clerk.familiarity || 0) >= 5) lines.push("何度も顔を合わせているため、店員は主人公を見覚えている。廃棄予定品について尋ねる余地はあるが、必ずもらえるわけではない。");
    show("コンビニ", lines, [
      { label: "安い物を見る", run: () => runBase("buy") },
      { label: "店員に話しかける", run: () => contactGeneric({ id: "convenience_clerk", displayName: "コンビニ店員", role: "店員" }) }
    ]);
  };

  const askForLeftovers = () => {
    const r = relationship("convenience_clerk");
    const key = "leftovers";
    if (didDaily(key)) {
      show("廃棄予定品を尋ねる", ["今日はもう一度尋ねている。これ以上繰り返すと店員の負担になる。"]);
      return;
    }
    markDaily(key);
    if ((r.familiarity || 0) < 5) {
      r.caution = (r.caution || 0) + 1;
      show("廃棄予定品を尋ねる", ["まだ店員から見ればほとんど知らない相手だ。店の物を勝手に渡すことはできない、と断られた。"]);
      return;
    }
    const success = stableRoll(`leftovers:${day()}`) < 0.35;
    if (!success) {
      show("廃棄予定品を尋ねる", ["今日は渡せる物がない、あるいは店の処理上渡せないと言われた。顔馴染みでも毎回食べ物が出てくるわけではない。"]);
      return;
    }
    HMW.addItem?.("leftover_food", 1);
    r.goodwill = (r.goodwill || 0) + 1;
    history("food", "コンビニ店員から廃棄予定の食べ物を一つ受け取った。");
    show("廃棄予定品を尋ねる", ["今日はたまたま渡せる物が一つあった。店員が周囲を確認してから、廃棄予定の食べ物を一つ渡した。"]);
  };

  const contactGeneric = (npc) => {
    const id = npc.id;
    const r = relationship(id);
    r.familiarity = (r.familiarity || 0) + 1;
    ensure().contacts[id] = (ensure().contacts[id] || 0) + 1;
    history("npc_contact", `${npc.displayName || npc.role || id}と話した。`, { npcId: id });

    if (id === "convenience_clerk") {
      const actions = [];
      if ((r.familiarity || 0) >= 5 && ["evening", "night"].includes(time())) actions.push({ label: "廃棄予定品がないか尋ねる", run: askForLeftovers });
      show("コンビニ店員", [
        (r.familiarity || 0) < 3 ? "短い会話だけで終わった。店員にとっては、まだ数いる客の一人に近い。" : "何度か顔を合わせているため、店員はこちらを見覚えている。だからといって店の規則がなくなるわけではない。"
      ], actions);
      return;
    }
    if (id === "charity_staff") {
      show("支援施設の職員", ["生活相談と食料支援は別の手続きとして扱われる。話しただけで住居や仕事が決まることはない。"], [
        { label: "生活相談をする", run: () => runBase("support_consult") },
        { label: "食料支援を確認する", run: () => runBase("food_support") }
      ]);
      return;
    }
    if (id === "labor_staff") {
      show("職業相談所の職員", ["今の状態で応募できる仕事と、そもそも応募条件を満たせない仕事を分けて考える必要がある、と説明される。"], [
        { label: "応募条件を確認する", run: checkLaborRequirements },
        { label: "求人を探す", run: () => runBase("work_search") }
      ]);
      return;
    }
    if (id === "recycler_staff") {
      show("廃品回収所の人", ["持ち込める物と持ち込めない物がある。顔を合わせる回数が増えれば、仕分けの手伝いなど別の話につながる可能性はある。"], [
        { label: "持ち込める物を聞く", run: askRecycler },
        { label: "廃品を売る", run: () => runBase("sell_scrap") }
      ]);
      return;
    }
    show(npc.displayName || npc.role || "人", ["短い会話になった。相手にも用事や生活があり、主人公のために何かをしてくれるとは限らない。"]);
  };

  const consumeOneFood = () => {
    for (const id of ["bread", "food_pack", "leftover_food"]) {
      if ((HMW.getItemCount?.(id) || 0) > 0) {
        HMW.removeItem?.(id, 1);
        return id;
      }
    }
    return null;
  };

  const contactRomance = (npc) => {
    const id = npc.id;
    const r = relationship(id);
    const name = npc.displayName || npc.temporaryLabel || npc.role || "人物";

    if (id === "romance_homeless") {
      const actions = [
        { label: "距離を置いて挨拶する", run: () => { addRel(id, { familiarity: 1 }); history("npc_contact", `${name}に挨拶した。`, { npcId: id }); show(name, ["相手もこちらを見ている。親しげではないが、顔は覚えられたようだ。"]); } }
      ];
      if ((r.familiarity || 0) >= 2) actions.push({ label: "食料支援のことを聞く", run: () => {
        if ((r.goodwill || 0) >= 1 || (r.familiarity || 0) >= 3) {
          remember("charity_meal"); addRel(id, { familiarity: 1 }); show(name, ["昼に支援施設へ行けば、配布がある日もある。ただし毎日あると思うな、とだけ教えられた。"]);
        } else show(name, ["『自分で見てこい』と短く返される。まだ情報を渡すほどの間柄ではない。"]);
      }});
      if ((r.familiarity || 0) >= 3) actions.push({ label: "寝られそうな場所を聞く", run: () => {
        if ((r.trust || 0) >= 1 || (r.goodwill || 0) >= 2) {
          remember("park_sleep"); remember("underpass_sleep"); addRel(id, { trust: 1 }); show(name, ["公園と高架下について、巡回や先客を見る時間帯を少しだけ教えられた。具体的な自分の寝場所までは教えない。"]);
        } else show(name, ["寝場所は簡単に他人へ教えるものではない、と断られた。"]);
      }});
      if ((HMW.getItemCount?.("bread") || 0) + (HMW.getItemCount?.("food_pack") || 0) + (HMW.getItemCount?.("leftover_food") || 0) > 0) {
        actions.push({ label: "食べ物を一つ分ける", run: () => {
          const item = consumeOneFood();
          if (!item) return;
          addRel(id, { goodwill: 2, trust: 1, familiarity: 1 });
          history("npc_contact", `${name}に食べ物を一つ分けた。`, { npcId: id });
          show(name, ["相手はすぐ礼を言うような態度ではない。それでも食べ物は受け取った。この一度で何でも教えてくれる関係になるわけではない。"]);
        }});
      }
      show(name, ["同じ街で路上生活をしている相手だ。情報も寝床も食料も、自分の生活に直結するため簡単には差し出さない。"], actions);
      return;
    }

    if (id === "romance_police") {
      show(name, ["巡回中の警官だ。こちらを覚えていても、まず職務上の距離を取る。"], [
        { label: "短く応じる", run: () => { addRel(id, { familiarity: 1 }); history("npc_contact", `${name}と短く話した。`, { npcId: id }); show(name, ["必要以上には踏み込まない短いやり取りで終わった。警官はそのまま巡回に戻る。"]); } },
        { label: "生活相談先だけ尋ねる", run: () => { remember("charity_center"); addRel(id, { familiarity: 1, concern: 1 }); show(name, ["警官は支援施設の場所を伝えるが、自分が継続支援の担当になるようなことは言わない。"]); } },
        { label: "会話を切り上げる", run: () => { addRel(id, { caution: 1 }); show(name, ["警官は追いすがらず、ただこちらの様子を少し長く見てから離れた。"]); } }
      ]);
      return;
    }

    if (id === "romance_support") {
      show(name, ["支援関係者として接している。親しく話せても、支援する側とされる側の境界は残る。"], [
        { label: "生活相談をする", run: () => { addRel(id, { familiarity: 1 }); runBase("support_consult"); } },
        { label: "食料支援を確認する", run: () => { addRel(id, { familiarity: 1 }); runBase("food_support"); } },
        { label: "少しだけ話す", run: () => { addRel(id, { familiarity: 1, concern: 1 }); show(name, ["仕事の合間の短い会話で終わる。特別扱いはされないが、顔と状況は少しずつ覚えられていく。"]); } }
      ]);
      return;
    }

    if (id === "romance_thug") {
      const actions = [
        { label: "距離を取る", run: () => show(name, ["相手も追ってはこない。安全だと分かったわけではなく、今日は距離が保たれただけだ。"]) },
        { label: "何か用か聞く", run: () => {
          const roll = stableRoll(`thug-contact:${day()}:${ensure().contacts[id] || 0}`);
          addRel(id, { familiarity: 1, caution: 1, irritation: roll > 0.75 ? 1 : 0 });
          show(name, [roll > 0.75 ? "『別に』と返されるが、露骨に機嫌を悪くした。こちらを面白がっているわけではない。" : "相手は少し意外そうに見る。短いやり取りだけで終わったが、顔は覚えられた。"]);
        } }
      ];
      if ((r.familiarity || 0) >= 3) actions.push({ label: "この辺の危ない時間を聞く", run: () => {
        remember("industrial_night"); addRel(id, { familiarity: 1 }); show(name, ["夜の工業地区で避けた方がいい一角を、曖昧に教えられた。親切というより、自分の縄張りに面倒を持ち込まれたくないらしい。"]);
      }});
      show(name, ["街の不良だ。主人公に興味を持つことがあっても、それだけで安全な相手になるわけではない。"], actions);
    }
  };

  const presentPeople = () => {
    const location = locationId();
    const slot = time();
    const people = [];
    const romance = HMW.getLoveInterestsAtLocation?.(location, slot) || [];
    romance.forEach((person) => {
      const base = person.id === "romance_support" && location === "charity_center" ? 0.72 : person.id === "romance_homeless" && ["underpass", "riverside"].includes(location) ? 0.68 : 0.48;
      const seenBefore = (ensure().contacts[person.id] || 0) > 0;
      const chance = Math.min(0.82, base + (seenBefore ? 0.08 : 0));
      if (stableRoll(`present:${day()}:${slot}:${location}:${person.id}`) < chance) people.push({ ...person, romance: true });
    });

    const regular = HMW.getNpcsAtLocation?.(location, slot) || [];
    regular.forEach((person) => {
      if (!["charity_staff", "labor_staff", "convenience_clerk", "recycler_staff", "homeless_a", "homeless_b"].includes(person.id)) return;
      if (stableRoll(`regular:${day()}:${slot}:${location}:${person.id}`) < 0.72) people.push(person);
    });
    return people;
  };

  const openPeople = () => {
    const content = modal("人と関わる");
    if (!content) return;
    const people = presentPeople();
    if (!people.length) {
      content.append(paragraph("今この時間に、こちらから意味のある話を持ちかけられそうな相手は見当たらない。人通りがあることと、助けや会話につながる相手がいることは別だ。"));
      return;
    }
    content.append(paragraph("今ここで実際に声をかけられそうな相手。相手にも都合や警戒があり、話しかければ必ず得をするわけではない。"));
    people.forEach((person) => {
      const label = person.displayName || person.temporaryLabel || person.role || person.id;
      content.append(button(label, () => person.romance || person.id?.startsWith("romance_") ? contactRomance(person) : contactGeneric(person)));
    });
  };

  const getLocationActions = () => {
    const id = locationId();
    const actions = [];
    const add = (id2, label, run, priority = 50) => actions.push({ id: id2, label, run, priority });

    if (id === "station_front") {
      add("station_board", flag("station_board") ? "案内を見直す" : "周辺の案内を調べる", inspectStationBoard, flag("station_board") ? 70 : 10);
      if (baseAction("beg")) add("beg", "人に金を求める", () => runBase("beg"), 65);
      if (baseAction("scavenge")) add("scavenge", "使えるものを探す", () => runBase("scavenge"), 60);
    }
    if (id === "shopping_street") {
      add("shopping_notice", "商店街を調べる", inspectShoppingStreet, 25);
      if (baseAction("buy")) add("buy", "安い物を見る", () => runBase("buy"), 55);
      if (baseAction("scavenge")) add("scavenge", "使えるものを探す", () => runBase("scavenge"), 58);
    }
    if (id === "convenience_store") {
      add("convenience", "店内と店員の様子を見る", inspectConvenience, 20);
      if (baseAction("buy")) add("buy", "安い物を買う", () => runBase("buy"), 45);
    }
    if (id === "park") {
      add("park_check", "公園の様子を調べる", checkParkSituation, 25);
      if (baseAction("sleep_spot") && ["evening", "night", "lateNight"].includes(time())) add("sleep_spot", "今夜の寝場所を探す", () => runBase("sleep_spot"), 15);
      if (baseAction("scavenge")) add("scavenge", "使えるものを探す", () => runBase("scavenge"), 55);
    }
    if (id === "underpass") {
      add("underpass_check", "高架下の様子を確かめる", checkUnderpass, 20);
      if (baseAction("sleep_spot") && ["evening", "night", "lateNight"].includes(time())) add("sleep_spot", "今夜の寝場所を探す", () => runBase("sleep_spot"), 15);
    }
    if (id === "riverside") {
      if (baseAction("scavenge")) add("scavenge", "換金できる物を探す", () => runBase("scavenge"), hasTip("scrap_route") ? 20 : 40);
      if (baseAction("sleep_spot") && ["evening", "night", "lateNight"].includes(time())) add("sleep_spot", "今夜の寝場所を探す", () => runBase("sleep_spot"), 18);
    }
    if (id === "charity_center") {
      if (baseAction("food_support")) add("food_support", "食料支援を確認する", () => runBase("food_support"), condition().hunger >= 55 && time() === "daytime" ? 5 : 30);
      if (baseAction("support_consult")) add("support_consult", "生活相談をする", () => runBase("support_consult"), player().progression?.support?.caseOpened ? 32 : 8);
      if (baseAction("wash")) add("wash", "身なりを整える", () => runBase("wash"), condition().hygiene < 30 ? 12 : 50);
    }
    if (id === "labor_office") {
      add("work_requirements", "応募条件を確認する", checkLaborRequirements, 12);
      if (baseAction("work_search")) add("work_search", "求人を探す", () => runBase("work_search"), 35);
    }
    if (id === "public_toilet") {
      if (baseAction("wash")) add("wash", "身なりを整える", () => runBase("wash"), condition().hygiene < 35 ? 8 : 32);
      if (baseAction("rest")) add("rest", "少し休む", () => runBase("rest"), condition().fatigue >= 65 ? 10 : 50);
    }
    if (id === "residential_alley") {
      if (baseAction("scavenge")) add("scavenge", "使えるものを探す", () => runBase("scavenge"), 42);
      if (baseAction("sleep_spot") && ["evening", "night", "lateNight"].includes(time())) add("sleep_spot", "寝られそうな場所を探す", () => runBase("sleep_spot"), 25);
    }
    if (id === "industrial_street") {
      add("industrial_check", "工業地区を調べる", inspectIndustrial, 22);
      if (baseAction("scavenge")) add("scavenge", "廃品を探す", () => runBase("scavenge"), hasTip("scrap_route") ? 16 : 40);
      if (baseAction("work_search")) add("work_search", "求人を探す", () => runBase("work_search"), 38);
    }
    if (id === "recycling_yard") {
      add("recycler_info", "持ち込める物を聞く", askRecycler, hasTip("scrap_route") ? 45 : 10);
      if (baseAction("sell_scrap")) add("sell_scrap", "廃品を売る", () => runBase("sell_scrap"), (HMW.getItemCount?.("scrap_piece") || 0) > 0 ? 5 : 55);
      if (baseAction("work_search")) add("work_search", "手伝い仕事がないか聞く", () => runBase("work_search"), 40);
    }
    if (id === "police_station") add("police_help", "生活相談先を尋ねる", askPoliceDesk, flag("police_support_info") ? 55 : 18);

    if (baseAction("rest") && !actions.some((a) => a.id === "rest")) add("rest", "少し休む", () => runBase("rest"), condition().fatigue >= 75 ? 12 : 80);
    return actions.sort((a, b) => a.priority - b.priority);
  };

  const getThreads = () => {
    const p = player();
    const c = condition();
    const threads = [];
    const foodCount = (HMW.getItemCount?.("food_pack") || 0) + (HMW.getItemCount?.("bread") || 0) + (HMW.getItemCount?.("leftover_food") || 0);

    if (c.hunger >= 65 && !foodCount) threads.push("食料の確保");
    if (["evening", "night", "lateNight"].includes(time()) && !p.sleepingPlaceId) threads.push("今夜の寝床");
    if (c.hygiene < 30) threads.push("身なりを整える場所");
    if (!p.progression?.support?.caseOpened) threads.push("継続して相談できる窓口につながる");
    else if (Object.values(p.workAccess || {}).some((value) => !value)) threads.push("応募に必要な手続きを進める");
    else if (!p.employment?.workHistory?.length) threads.push("実際に応募できる募集を探す");
    if (p.money <= 0 && !threads.includes("実際に応募できる募集を探す")) threads.push("少額でも現金につながる手段");
    return threads.slice(0, 3);
  };

  const locationFlavor = () => {
    const id = locationId();
    const map = {
      station_front: "人の出入りは多いが、主人公の事情を知る者はいない。案内、通行人、巡回、店への導線が集まっている。",
      shopping_street: "店と人通りはある。金がなければ買えない物が多い一方、掲示や店員との接点は拾える。",
      convenience_store: "屋内で商品と店員がいる。金がなければ買い物はできず、顔馴染みになるにも回数が必要だ。",
      park: "休める場所と人目の少ない場所があるが、時間帯によって巡回・先客・周囲の目が変わる。",
      underpass: "雨風は少し避けられる。先客や縄張り、不良の危険があり、空いている場所がそのまま安全とは限らない。",
      riverside: "人目は少ない。寝場所や廃品を探す余地はあるが、支援や店からは遠い。",
      charity_center: "食料配布、身なりを整える場所、生活相談がある。ただし一度来ただけで住居や仕事が決まる場所ではない。",
      labor_office: "求人の情報はあるが、応募条件を満たさなければ入口で止まる。募集があることと採用されることも別だ。",
      public_toilet: "最低限、身なりを整えたり短く休んだりできる。生活全体を立て直す場所ではない。",
      residential_alley: "人目が少ない時間もあるが、住民の生活圏でもある。長居すれば警戒されることがある。",
      industrial_street: "求人や廃品につながる可能性はあるが、毎回何かが見つかる場所ではない。夜は危険も増える。",
      recycling_yard: "価値のある廃品を持ち込めれば現金に変えられる。何も持たずに来ても金は出ない。",
      police_station: "警察の場所。生活困窮そのものを解決する窓口ではないが、必要なら他の相談先を尋ねることはできる。"
    };
    return map[id] || "街の一角にいる。";
  };

  const getSceneSummary = () => {
    ensure();
    const parts = [locationFlavor()];
    const threads = getThreads();
    if (threads.length) parts.push(`今残っている問題：${threads.join("／")}。`);
    const actions = getLocationActions();
    if (actions.length) parts.push(`ここで実際にできること：${actions.slice(0, 3).map((a) => `「${a.label}」`).join("、")}。`);
    return parts.join(" ");
  };

  const getPrimaryAction = () => {
    const c = condition();
    const actions = getLocationActions();
    const find = (id) => actions.find((a) => a.id === id);
    const hasFoodNow = (HMW.getItemCount?.("food_pack") || 0) + (HMW.getItemCount?.("bread") || 0) + (HMW.getItemCount?.("leftover_food") || 0) > 0;

    if (c.hunger >= 65 && hasFoodNow) return { id: "inventory_food", label: "持ち物から食べる", run: () => document.getElementById("inventoryButton")?.click() };
    if (c.hunger >= 65) {
      for (const id of ["food_support", "buy", "scavenge", "beg"]) if (find(id)) return find(id);
    }
    if (c.fatigue >= 75 && find("rest")) return find("rest");
    if (["evening", "night", "lateNight"].includes(time()) && !player().sleepingPlaceId && find("sleep_spot")) return find("sleep_spot");
    if (c.hygiene < 30 && find("wash")) return find("wash");
    if (!player().progression?.support?.caseOpened && find("support_consult")) return find("support_consult");
    return actions[0] || null;
  };

  const openActions = () => {
    const content = modal(loc()?.name || "ここでできること");
    if (!content) return;
    const threads = getThreads();
    if (threads.length) content.append(paragraph(`今残っている問題：${threads.join("／")}。`));
    const actions = getLocationActions();
    if (!actions.length) {
      content.append(paragraph("今ここで明確に進められることは少ない。別の場所へ行くか、人との接点を探す必要がある。"));
      return;
    }
    actions.forEach((action) => content.append(button(action.label, action.run)));
  };

  const oldPacket = HMW.getAIPacket;
  const getAIPacket = () => {
    const base = typeof oldPacket === "function" ? oldPacket() : { context: HMW.getTurnContext?.() || {} };
    return {
      ...base,
      instruction: `${base.instruction || ""} gameContentにない成功・支援・仕事・人間関係の進展をAIが勝手に確定してはいけない。`,
      gameContent: {
        scene: getSceneSummary(),
        unresolvedThreads: getThreads(),
        availableActions: getLocationActions().map((a) => ({ id: a.id, label: a.label })),
        tips: clone(ensure().tips),
        flags: clone(ensure().flags)
      }
    };
  };

  const render = () => {
    ensure();
    const text = document.getElementById("sceneText");
    const buttons = [...document.querySelectorAll("[data-flow-slot]")];
    if (text && player().lifeStatus !== "dead" && !HMW.eventGate?.getActiveBlocking?.()) {
      const summary = getSceneSummary();
      if (text.textContent !== summary) text.textContent = summary;
    }
    if (buttons.length >= 3 && player().lifeStatus === "active") {
      const forced = HMW.state.player.progression?.eventGate?.forcedMoveFrom === locationId();
      const blocking = HMW.eventGate?.getActiveBlocking?.();
      if (!forced && !blocking) {
        const primary = getPrimaryAction();
        if (primary) {
          buttons[0].textContent = primary.label;
          buttons[0].disabled = false;
          buttons[0].onclick = primary.run;
        } else {
          buttons[0].textContent = "ここでできること";
          buttons[0].disabled = false;
          buttons[0].onclick = openActions;
        }
        buttons[1].textContent = presentPeople().length ? "人と関わる" : "周囲・行動を見る";
        buttons[1].disabled = false;
        buttons[1].onclick = presentPeople().length ? openPeople : openActions;
      }
    }
  };

  const install = () => {
    ensure();
    const originalFlowRender = HMW.flowUI?.render;
    if (HMW.flowUI && !HMW.flowUI.__gameContentWrapped) {
      HMW.flowUI.__gameContentWrapped = true;
      HMW.flowUI.render = () => {
        originalFlowRender?.();
        setTimeout(render, 0);
      };
    }

    HMW.getAIPacket = getAIPacket;

    document.addEventListener("click", (event) => {
      const slot = event.target.closest?.("[data-flow-slot]");
      if (!slot) return;
      const blocking = HMW.eventGate?.getActiveBlocking?.();
      const forced = HMW.state.player.progression?.eventGate?.forcedMoveFrom === locationId();
      if (blocking || forced) return;
      const index = slot.getAttribute("data-flow-slot");
      if (index === "1") {
        const primary = getPrimaryAction();
        if (!primary?.run) return;
        event.preventDefault();
        event.stopImmediatePropagation();
        primary.run();
        setTimeout(render, 0);
      } else if (index === "2") {
        event.preventDefault();
        event.stopImmediatePropagation();
        if (presentPeople().length) openPeople();
        else openActions();
        setTimeout(render, 0);
      }
    }, true);

    const actionArea = document.getElementById("actionArea");
    const sceneText = document.getElementById("sceneText");
    let pending = false;
    const observer = new MutationObserver(() => {
      if (pending) return;
      pending = true;
      setTimeout(() => {
        pending = false;
        render();
      }, 0);
    });
    if (actionArea) observer.observe(actionArea, { childList: true, subtree: true, characterData: true, attributes: true });
    if (sceneText) observer.observe(sceneText, { childList: true, subtree: true, characterData: true });
    render();
  };

  HMW.gameContent = {
    ensure,
    getSceneSummary,
    getThreads,
    getLocationActions,
    getPrimaryAction,
    openActions,
    openPeople,
    render,
    getAIPacket
  };

  document.addEventListener("DOMContentLoaded", install);
})();
