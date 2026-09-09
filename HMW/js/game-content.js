(() => {
  "use strict";

  window.HMW = window.HMW || {};
  const HMW = window.HMW;
  const clone = (v) => JSON.parse(JSON.stringify(v));
  const clamp = (v, a = 0, b = 100) => Math.max(a, Math.min(b, v));

  const day = () => HMW.state.world.day;
  const time = () => HMW.state.world.time;
  const locationId = () => HMW.state.world.locationId;
  const player = () => HMW.state.player;
  const condition = () => player().condition;
  const location = () => HMW.getLocation?.(locationId()) || null;
  const isNight = () => ["evening", "night", "lateNight"].includes(time());

  const stableRoll = (key) => {
    let hash = 2166136261;
    const text = String(key);
    for (let i = 0; i < text.length; i += 1) {
      hash ^= text.charCodeAt(i);
      hash = Math.imul(hash, 16777619);
    }
    return (hash >>> 0) / 4294967296;
  };

  const ensure = () => {
    const p = player();
    p.progression = p.progression || {};
    p.progression.story = p.progression.story || {
      flags: {},
      tips: [],
      contacts: {},
      favors: {},
      income: { recyclerShifts: 0, storeShifts: 0, industrialShifts: 0 },
      daily: { day: day(), used: {} }
    };
    const s = p.progression.story;
    s.flags = s.flags || {};
    s.tips = Array.isArray(s.tips) ? s.tips : [];
    s.contacts = s.contacts || {};
    s.favors = s.favors || {};
    s.income = s.income || { recyclerShifts: 0, storeShifts: 0, industrialShifts: 0 };
    if (!s.daily || s.daily.day !== day()) s.daily = { day: day(), used: {} };
    s.daily.used = s.daily.used || {};
    return s;
  };

  const flag = (id) => Boolean(ensure().flags[id]);
  const setFlag = (id, value = true) => { ensure().flags[id] = value; };
  const remember = (tip) => {
    const s = ensure();
    if (!s.tips.includes(tip)) s.tips.push(tip);
    const known = player().progression?.social?.knownTips;
    if (Array.isArray(known) && !known.includes(tip)) known.push(tip);
  };
  const knows = (tip) => ensure().tips.includes(tip) || player().progression?.social?.knownTips?.includes(tip);
  const onceUsed = (key) => Boolean(ensure().daily.used[key]);
  const markUsed = (key) => { ensure().daily.used[key] = true; };

  const addHistory = (type, text, extra = {}) => {
    if (HMW.app?.appendHistory) HMW.app.appendHistory(type, text, extra);
    else HMW.state.history.push({ day: day(), time: time(), locationId: locationId(), type, text, ...clone(extra) });
  };

  const relationship = (id) => {
    if (id?.startsWith("romance_") && HMW.ensureLoveInterestRelationship) return HMW.ensureLoveInterestRelationship(id);
    HMW.state.relationships = HMW.state.relationships || {};
    if (!HMW.state.relationships[id]) {
      const npc = HMW.getNpc?.(id);
      HMW.state.relationships[id] = npc?.relationship
        ? clone(npc.relationship)
        : { familiarity: 0, trust: 0, goodwill: 0, caution: 0, irritation: 0 };
    }
    return HMW.state.relationships[id];
  };

  const addRel = (id, changes = {}) => {
    const r = relationship(id);
    Object.entries(changes).forEach(([k, n]) => {
      if (typeof n === "number") r[k] = (r[k] || 0) + n;
    });
    ensure().contacts[id] = (ensure().contacts[id] || 0) + 1;
    return r;
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

  const p = (text) => {
    const el = document.createElement("p");
    el.textContent = text;
    el.style.margin = "0 0 12px";
    el.style.lineHeight = "1.65";
    return el;
  };

  const h = (text) => {
    const el = document.createElement("strong");
    el.textContent = text;
    el.style.display = "block";
    el.style.margin = "16px 0 8px";
    return el;
  };

  const button = (label, run, disabled = false) => {
    const el = document.createElement("button");
    el.type = "button";
    el.className = "action-button";
    el.textContent = label;
    el.disabled = disabled;
    if (run) el.addEventListener("click", run);
    return el;
  };

  const show = (title, lines = [], actions = []) => {
    const box = modal(title);
    if (!box) return;
    lines.filter(Boolean).forEach((line) => box.append(p(line)));
    actions.forEach((a) => box.append(button(a.label, a.run, a.disabled)));
    refresh();
  };

  const baseActions = () => HMW.lifeLoop?.getContextActions?.() || [];
  const baseAction = (id) => baseActions().find((a) => a.id === id) || null;
  const runBase = (id) => baseAction(id)?.run?.();
  const getCount = (id) => HMW.getItemCount?.(id) || 0;
  const foodCount = () => getCount("food_pack") + getCount("bread") + getCount("leftover_food");

  const smallCost = (fatigue = 1, hunger = 0) => {
    condition().fatigue = clamp(condition().fatigue + fatigue);
    condition().hunger = clamp(condition().hunger + hunger);
  };

  const stationBoard = () => {
    if (flag("station_board")) {
      show("駅前の案内", ["支援施設、職業相談所、公衆トイレの場所はもう把握している。"]);
      return;
    }
    setFlag("station_board");
    remember("charity_center");
    remember("labor_office");
    remember("public_toilet");
    addHistory("information", "駅前で生活に使えそうな案内を確認した。");
    show("駅前の案内", [
      "無料の生活相談をしている支援施設、公的な職業相談所、公衆トイレの場所が分かった。",
      "少なくとも、食料・身なり・仕事の相談をそれぞれどこで始めればいいかは分かった。"
    ]);
  };

  const askPasserby = () => {
    const key = `passerby:${time()}`;
    if (onceUsed(key)) {
      show("通行人に聞く", ["同じ時間帯に何人かへ聞いた。これ以上繰り返しても今日は新しい話は出そうにない。"]);
      return;
    }
    markUsed(key);
    smallCost(1, 0);
    const roll = stableRoll(`passerby:${day()}:${time()}`);
    if (roll < 0.34) {
      remember("industrial_morning_work");
      show("通行人に聞く", ["朝の工業地区で、荷下ろしや片付けを一日単位で探している人がいることがある、と聞いた。毎日ある仕事ではないらしい。"]);
    } else if (roll < 0.62) {
      remember("charity_meal");
      show("通行人に聞く", ["昼に支援施設で食料配布をしている日がある、と教えられた。数に限りがあり、毎日確実ではない。"]);
    } else {
      show("通行人に聞く", ["急いでいる人が多く、まとまった情報は得られなかった。無視されたり、短く断られたりした。"]);
    }
  };

  const inspectPark = () => {
    const key = `park:${time()}`;
    if (onceUsed(key)) {
      show("公園を調べる", ["この時間帯に確認できる場所は一度見た。状況は大きく変わっていない。"]);
      return;
    }
    markUsed(key);
    smallCost(2, 0);
    if (isNight()) {
      remember("park_sleep");
      show("公園を調べる", ["照明、ベンチ、巡回の通り道、先客のいる場所を確認した。夜を越すなら、ただ空いている場所より人目と巡回を避ける位置を選ぶ必要がある。"]);
      return;
    }
    const roll = stableRoll(`park-find:${day()}:${time()}`);
    if (roll < 0.35) {
      HMW.addItem?.("cardboard", 1);
      show("公園を調べる", ["濡れていない段ボールを一枚確保できた。寝る時の敷物や風よけには使えそうだ。"]);
    } else if (roll < 0.58) {
      remember("charity_center");
      show("公園を調べる", ["支援施設へ向かう人の流れがある。昼なら食料配布や生活相談につながる可能性がある。"]);
    } else {
      show("公園を調べる", ["使えそうな物も新しい情報も見つからなかった。人の流れと巡回の様子だけ確認した。"]);
    }
  };

  const inspectUnderpass = () => {
    remember("underpass_sleep");
    const homeless = relationship("romance_homeless");
    const lines = ["雨風は少し避けられるが、先客の荷物や縄張りらしい場所がある。勝手に場所を取れば揉める可能性がある。"];
    const actions = [];
    if (isNight()) {
      actions.push({ label: "空いている場所を探す", run: () => runBase("sleep_spot") });
      if ((homeless.familiarity || 0) >= 2) {
        actions.push({ label: "先客に使っていい場所を聞く", run: () => {
          const roll = stableRoll(`underpass-permission:${day()}:${homeless.trust || 0}`);
          if (roll < 0.45 + Math.min(0.25, (homeless.trust || 0) * 0.08)) {
            player().sleepingPlaceId = "underpass";
            addRel("romance_homeless", { goodwill: 1 });
            show("高架下", ["先客が使っていない端を一晩だけなら、と示した。相手の場所に踏み込まないことが条件だ。"]);
          } else {
            show("高架下", ["今日は空きがない、と断られた。顔見知りでも寝場所を毎回融通してもらえるわけではない。"]);
          }
        }});
      }
    }
    show("高架下", lines, actions);
  };

  const searchScrap = (area) => {
    const key = `scrap:${area}:${time()}`;
    if (onceUsed(key)) {
      show("廃品を探す", ["この時間帯に見られる範囲はもう探した。もう一度歩き回っても今日は同じ場所しか見られない。"]);
      return;
    }
    markUsed(key);
    smallCost(5, 1);
    const hasRoute = knows("scrap_route");
    const roll = stableRoll(`scrap:${day()}:${time()}:${area}`);
    const chance = hasRoute ? 0.62 : 0.34;
    if (roll < chance) {
      HMW.addItem?.("scrap_piece", 1);
      if (roll < chance * 0.35) HMW.addItem?.("aluminum_can", 2);
      addHistory("resource", "換金できそうな廃品を見つけた。", { area });
      show("廃品を探す", ["捨てられた物の中から、回収所へ持ち込めそうな物を分けて確保した。何でも持っていけるわけではない。"]);
    } else {
      show("廃品を探す", ["使えそうに見える物はあったが、所有物か廃棄物か分からない物や、値段にならない物ばかりだった。今日は持ち帰れる物はない。"]);
    }
  };

  const recyclerInfo = () => {
    remember("scrap_route");
    const r = addRel("recycler_staff", { familiarity: 1 });
    setFlag("recycler_known");
    show("廃品回収所", [
      "担当者に、持ち込める物と断られる物を教えてもらった。工業地区と川沿いなら、明確に廃棄された物の中から値段になる物が出ることがある。",
      (r.familiarity || 0) >= 3 ? "何度か顔を合わせているため、忙しい日に仕分けを手伝えるか聞ける関係になってきた。" : "まだ取引相手として顔を覚えられ始めた程度だ。"
    ]);
  };

  const recyclerShift = () => {
    const key = "recycler_shift";
    if (onceUsed(key)) {
      show("仕分けの手伝い", ["今日はもう手伝い仕事をした。次に頼めるとしても別の日だ。"]);
      return;
    }
    const r = relationship("recycler_staff");
    if ((r.familiarity || 0) < 3) {
      show("仕分けの手伝い", ["まだ顔を覚えられた程度で、作業を任せてもらえる関係ではない。まず何度か持ち込みや会話をする必要がある。"]);
      return;
    }
    markUsed(key);
    const roll = stableRoll(`recycler-shift:${day()}`);
    if (roll > 0.62) {
      addRel("recycler_staff", { familiarity: 1 });
      show("仕分けの手伝い", ["今日は人手が足りている、と断られた。顔見知りでも毎日仕事があるわけではない。"]);
      return;
    }
    const pay = 80 + Math.floor(stableRoll(`recycler-pay:${day()}`) * 41);
    player().money += pay;
    condition().fatigue = clamp(condition().fatigue + 10);
    condition().hunger = clamp(condition().hunger + 4);
    ensure().income.recyclerShifts += 1;
    addRel("recycler_staff", { trust: 1, goodwill: 1, familiarity: 1 });
    HMW.app?.advanceTime?.(1);
    addHistory("work", `廃品回収所の仕分けを手伝い、${pay}を受け取った。`, { pay });
    show("仕分けの手伝い", [`短時間の仕分けと片付けを手伝った。終わってから${pay}を受け取った。継続雇用ではなく、その日だけの仕事だ。`]);
  };

  const sellScrap = () => {
    const count = getCount("scrap_piece") + getCount("aluminum_can") + getCount("plastic_bottle");
    if (!count) {
      show("廃品を売る", ["買い取ってもらえる物を持っていない。"]);
      return;
    }
    const pieces = getCount("scrap_piece");
    const cans = getCount("aluminum_can");
    const bottles = getCount("plastic_bottle");
    const total = pieces * 24 + cans * 5 + bottles * 2;
    if (pieces) HMW.removeItem?.("scrap_piece", pieces);
    if (cans) HMW.removeItem?.("aluminum_can", cans);
    if (bottles) HMW.removeItem?.("plastic_bottle", bottles);
    player().money += total;
    addRel("recycler_staff", { familiarity: 1 });
    addHistory("sell", `廃品を${total}で売った。`, { total });
    show("廃品を売る", [`持ち込んだ物を選別され、合計${total}になった。まとまった収入ではないが、現金になった。`]);
  };

  const storeTalk = () => {
    const r = addRel("convenience_clerk", { familiarity: 1 });
    const actions = [];
    const lines = [];
    if ((r.familiarity || 0) < 3) lines.push("会計や短い挨拶程度のやり取り。店員にとってはまだ数いる客の一人に近い。");
    else if ((r.familiarity || 0) < 5) lines.push("何度か顔を合わせているため、店員はこちらを見覚えている。特別扱いはされないが、以前より会話は短く切られなくなった。");
    else lines.push("店員は顔を覚えている。店の規則は変わらないが、廃棄予定品や店前の片付けについて聞ける程度の関係にはなった。");

    if ((r.familiarity || 0) >= 5 && ["evening", "night"].includes(time())) {
      actions.push({ label: "廃棄予定品がないか聞く", run: storeLeftovers });
    }
    if ((r.familiarity || 0) >= 5 && (r.goodwill || 0) >= 1) {
      actions.push({ label: "店前の片付けを手伝えるか聞く", run: storeCleanup });
    }
    show("コンビニ店員", lines, actions);
  };

  const storeLeftovers = () => {
    if (onceUsed("leftovers")) {
      show("廃棄予定品", ["今日はもう一度聞いている。これ以上繰り返しても渡せる物は増えない。"]);
      return;
    }
    markUsed("leftovers");
    const r = relationship("convenience_clerk");
    if ((r.familiarity || 0) < 5) {
      r.caution = (r.caution || 0) + 1;
      show("廃棄予定品", ["店の物を勝手に渡せない、と断られた。まだそういう話を頼める関係でもない。"]);
      return;
    }
    const success = stableRoll(`leftovers:${day()}`) < 0.36;
    if (!success) {
      show("廃棄予定品", ["今日は渡せる物がない、あるいは処理上渡せないと言われた。顔馴染みでも毎回食べ物が出てくるわけではない。"]);
      return;
    }
    HMW.addItem?.("leftover_food", 1);
    addRel("convenience_clerk", { goodwill: 1 });
    addHistory("food", "コンビニで廃棄予定の食べ物を一つ受け取った。");
    show("廃棄予定品", ["今日はたまたま渡せる物が一つあった。店員が周囲を確認してから、廃棄予定の食べ物を一つ渡した。"]);
  };

  const storeCleanup = () => {
    if (onceUsed("store_cleanup")) {
      show("店前の片付け", ["今日はもう片付けを手伝った。続けて頼める仕事ではない。"]);
      return;
    }
    const r = relationship("convenience_clerk");
    if ((r.familiarity || 0) < 5 || (r.goodwill || 0) < 1) {
      show("店前の片付け", ["店員から見れば、まだ仕事を頼むほど信用できる相手ではない。"]);
      return;
    }
    markUsed("store_cleanup");
    const success = stableRoll(`store-cleanup:${day()}`) < 0.48;
    if (!success) {
      show("店前の片付け", ["今日は頼める作業がない、と断られた。"]);
      return;
    }
    const pay = 60;
    player().money += pay;
    condition().fatigue = clamp(condition().fatigue + 6);
    ensure().income.storeShifts += 1;
    addRel("convenience_clerk", { trust: 1, goodwill: 1 });
    HMW.app?.advanceTime?.(1);
    addHistory("work", `店前の片付けを手伝い、${pay}を受け取った。`, { pay });
    show("店前の片付け", [`店前の段ボールやごみをまとめ、短い片付けを手伝った。終わってから${pay}を渡された。一度きりの小さな仕事だ。`]);
  };

  const industrialDayWork = () => {
    if (!knows("industrial_morning_work")) {
      show("日雇いを探す", ["どこで誰に聞けばいいか分からない。駅前で人に聞いたり、職業相談所で情報を探した方がよさそうだ。"]);
      return;
    }
    if (time() !== "morning") {
      show("日雇いを探す", ["人を集めるなら朝早い時間だと聞いている。今からでは遅い。"]);
      return;
    }
    if (onceUsed("industrial_daywork")) {
      show("日雇いを探す", ["今朝の募集はもう確認した。"]);
      return;
    }
    markUsed("industrial_daywork");
    const c = condition();
    if (c.health < 45 || c.fatigue > 72) {
      show("日雇いを探す", ["作業を任せるには体調が悪そうだと見られ、今日は断られた。"]);
      return;
    }
    const roll = stableRoll(`industrial-work:${day()}`);
    if (roll > 0.38) {
      show("日雇いを探す", ["今朝は人手が足りているか、経験者だけで埋まっていた。仕事には入れなかった。"]);
      return;
    }
    const pay = 130 + Math.floor(stableRoll(`industrial-pay:${day()}`) * 51);
    player().money += pay;
    c.fatigue = clamp(c.fatigue + 18);
    c.hunger = clamp(c.hunger + 7);
    ensure().income.industrialShifts += 1;
    HMW.app?.advanceTime?.(2);
    addHistory("work", `工業地区の一日仕事に入り、${pay}を受け取った。`, { pay });
    show("日雇い", [`荷物の移動と片付けに入れた。作業後に${pay}を受け取った。明日も同じ仕事がある保証はない。`]);
  };

  const laborRequirements = () => {
    const labels = {
      contactAddress: "連絡先として使える住所",
      identityDocument: "本人確認書類",
      phone: "連絡に使える電話",
      bankAccount: "給与を受け取る口座"
    };
    const missing = Object.entries(player().workAccess || {}).filter(([, v]) => !v).map(([k]) => labels[k] || k);
    if (missing.length) {
      show("応募条件", [`不足しているもの：${missing.join("、")}。`, "正式な求人の多くは今のままでは応募条件を満たせない。支援施設の生活相談で順番に手続きを進める必要がある。"], [
        { label: "求人そのものを見る", run: () => runBase("work_search") }
      ]);
    } else {
      show("応募条件", ["最低限の連絡・本人確認手段はそろっている。ここからは募集の有無、仕事内容、採用条件の問題になる。"], [
        { label: "求人を探す", run: () => runBase("work_search") }
      ]);
    }
  };

  const supportDesk = () => {
    const opened = Boolean(player().progression?.support?.caseOpened);
    const lines = opened
      ? ["前回までの相談記録が残っている。今日は、未完了の手続きや今困っていることを続きから相談できる。"]
      : ["ここでは食料配布と生活相談が別に行われている。最初に事情を話せば継続相談の記録を作れる。"];
    const actions = [];
    if (baseAction("support_consult")) actions.push({ label: opened ? "相談の続きをする" : "生活相談を始める", run: () => runBase("support_consult") });
    if (baseAction("food_support")) actions.push({ label: "食料支援を確認する", run: () => runBase("food_support") });
    if (baseAction("wash")) actions.push({ label: "身なりを整える", run: () => runBase("wash") });
    show("支援施設", lines, actions);
  };

  const policeDesk = () => {
    if (!flag("police_support_info")) {
      setFlag("police_support_info");
      remember("charity_center");
      show("警察署", ["生活に困っているとだけ伝えると、警察が住居や仕事を用意することはできないが、地域の支援窓口の場所は教えられた。"]);
      return;
    }
    show("警察署", ["以前案内された支援窓口以上に、ここですぐ生活を立て直す話は出てこない。必要なら事件や安全上の相談はできる。"]);
  };

  const genericContact = (npc) => {
    const id = npc.id;
    const name = npc.displayName || npc.role || id;
    const r = addRel(id, { familiarity: 1 });
    if (id === "charity_staff") {
      show(name, ["支援員は主人公の事情を聞けるが、話しただけで住居や仕事を決めることはできない。"], [
        { label: "生活相談をする", run: () => runBase("support_consult") },
        { label: "食料支援を確認する", run: () => runBase("food_support") }
      ]);
      return;
    }
    if (id === "labor_staff") {
      show(name, ["職員は、応募できる仕事と、条件不足で応募できない仕事を分けて説明する。"], [
        { label: "応募条件を確認する", run: laborRequirements },
        { label: "求人を探す", run: () => runBase("work_search") }
      ]);
      return;
    }
    if (id === "convenience_clerk") {
      storeTalk();
      return;
    }
    if (id === "recycler_staff") {
      const actions = [
        { label: "持ち込める物を聞く", run: recyclerInfo },
        { label: "廃品を売る", run: sellScrap }
      ];
      if ((r.familiarity || 0) >= 3) actions.push({ label: "仕分けを手伝えるか聞く", run: recyclerShift });
      show(name, ["持ち込みを繰り返すうちに顔を覚えられていく。何も持たずに来れば金にはならないが、関係ができれば別の話が出ることもある。"], actions);
      return;
    }
    if (npc.templateId === "homeless") {
      const actions = [{ label: "支援や寝場所の情報を聞く", run: () => {
        if ((r.familiarity || 0) < 2) {
          show(name, ["まだ警戒されていて、『自分で見てこい』とだけ返された。"]);
          return;
        }
        remember(isNight() ? "park_sleep" : "charity_meal");
        r.goodwill = (r.goodwill || 0) + 1;
        show(name, [isNight() ? "公園と高架下は時間帯で巡回と先客が変わる、とだけ教えられた。自分の寝場所までは話さない。" : "昼なら支援施設で食料配布がある日もある、と教えられた。"]);
      }}];
      show(name, ["同じ街で暮らしている人だ。情報も寝場所も、自分の生活に直結するため簡単には差し出さない。"], actions);
      return;
    }
    show(name, ["短い会話で終わった。相手にも生活があり、主人公のために動く理由はまだない。"]);
  };

  const consumeFood = () => {
    for (const id of ["bread", "food_pack", "leftover_food"]) {
      if (getCount(id) > 0) {
        HMW.removeItem?.(id, 1);
        return id;
      }
    }
    return null;
  };

  const romanceContact = (npc) => {
    const id = npc.id;
    const name = npc.displayName || npc.temporaryLabel || npc.role || "人物";
    const r = relationship(id);
    const contactCount = ensure().contacts[id] || 0;

    if (id === "romance_homeless") {
      const actions = [];
      if (contactCount === 0) {
        actions.push({ label: "距離を空けて挨拶する", run: () => { addRel(id, { familiarity: 1 }); show(name, ["相手は一度こちらを見た。愛想はないが、追い払われもしなかった。"]); } });
        actions.push({ label: "ここで寝てもいいか聞く", run: () => { addRel(id, { familiarity: 1, caution: 2 }); show(name, ["『知らない奴に寝場所を教えると思うか』と断られた。寝床は生活そのものだ。"]); } });
      } else {
        actions.push({ label: "少し話す", run: () => { addRel(id, { familiarity: 1 }); show(name, ["互いのことをほとんど知らないままでも、顔を合わせた回数だけは増えていく。"]); } });
        if ((r.familiarity || 0) >= 2) actions.push({ label: "支援のことを聞く", run: () => { remember("charity_meal"); addRel(id, { familiarity: 1 }); show(name, ["昼の支援施設なら配布がある日もある、と教えられた。『毎日あると思うな』と念を押される。"]); } });
        if ((r.trust || 0) >= 1 || (r.goodwill || 0) >= 2) actions.push({ label: "寝場所の見方を聞く", run: () => { remember("park_sleep"); remember("underpass_sleep"); addRel(id, { trust: 1 }); show(name, ["巡回が来る時間、先客の荷物、風の入り方を見ることを教えられた。相手自身の寝場所は教えない。"]); } });
      }
      if (foodCount() > 0) actions.push({ label: "食べ物を一つ分ける", run: () => {
        const used = consumeFood();
        if (!used) return;
        addRel(id, { goodwill: 2, trust: 1, familiarity: 1 });
        addHistory("relationship", `${name}に食べ物を一つ分けた。`, { npcId: id });
        show(name, ["相手は少し迷ってから受け取った。一度の食事で何でも教える関係にはならないが、借りは覚えているようだ。"]);
      }});
      show(name, ["同じ路上で暮らす相手だ。食料も寝床も情報も有限で、親切だけでは生活できない。"], actions);
      return;
    }

    if (id === "romance_police") {
      const actions = [
        { label: "必要なことだけ答える", run: () => { addRel(id, { familiarity: 1 }); show(name, ["警官は必要な確認だけして巡回へ戻った。顔は覚えられたようだ。"]); } },
        { label: "支援先だけ尋ねる", run: () => { remember("charity_center"); addRel(id, { familiarity: 1, concern: 1 }); show(name, ["警官は支援施設の場所を伝える。自分が生活支援の担当になるようなことは言わない。"]); } },
        { label: "会話を切り上げる", run: () => { addRel(id, { caution: 1 }); show(name, ["警官は追いすがらない。ただ、こちらの様子を少し長く確認してから離れた。"]); } }
      ];
      if (contactCount >= 3 && condition().health < 35) {
        actions.unshift({ label: "体調が悪いことを認める", run: () => { addRel(id, { concern: 2, familiarity: 1 }); remember("charity_center"); show(name, ["警官はその場で生活を解決しようとはしないが、体調を見て支援窓口と救急相談の選択肢を示した。"]); } });
      }
      show(name, [contactCount ? "何度か街で顔を合わせている巡回警官だ。覚えられていても、まず職務上の距離がある。" : "巡回中の警官がこちらを気に留めた。最初から好意的な知人として扱われることはない。"], actions);
      return;
    }

    if (id === "romance_support") {
      show(name, [contactCount ? "相談記録と顔を覚えられている。親しく話せても、支援する側とされる側の境界は残る。" : "支援関係者として初めて顔を合わせる。まずは主人公の生活上の問題を確認する立場だ。"], [
        { label: "生活相談をする", run: () => { addRel(id, { familiarity: 1 }); runBase("support_consult"); } },
        { label: "食料支援を確認する", run: () => { addRel(id, { familiarity: 1 }); runBase("food_support"); } },
        { label: "短く雑談する", run: () => { addRel(id, { familiarity: 1, concern: 1 }); show(name, ["仕事の合間の短い会話で終わる。特別扱いはないが、顔と状況は少しずつ覚えられる。"]); } }
      ]);
      return;
    }

    if (id === "romance_thug") {
      const actions = [
        { label: "距離を取る", run: () => { addRel(id, { familiarity: 1 }); show(name, ["相手も追ってはこない。安全だと分かったわけではなく、今日は距離が保たれただけだ。"]); } },
        { label: "何か用か聞く", run: () => {
          const roll = stableRoll(`thug:${day()}:${contactCount}`);
          addRel(id, { familiarity: 1, caution: 1, irritation: roll > 0.75 ? 1 : 0 });
          show(name, [roll > 0.75 ? "『別に』と返されるが、露骨に機嫌を悪くした。面白がっているわけではない。" : "少し意外そうに見られた。短いやり取りだけで終わるが、顔は覚えられた。"]);
        } }
      ];
      if ((r.familiarity || 0) >= 3) actions.push({ label: "この辺の危ない時間を聞く", run: () => { remember("industrial_night"); addRel(id, { familiarity: 1 }); show(name, ["夜の工業地区で避けた方がいい一角を曖昧に教えられた。親切というより、自分の縄張りへ面倒を持ち込まれたくないらしい。"]); } });
      show(name, ["街の不良だ。主人公に興味を持つことがあっても、それだけで安全な相手になるわけではない。"], actions);
    }
  };

  const presentPeople = () => {
    const result = [];
    const seen = new Set();
    const regular = HMW.getNpcsAtLocation?.(locationId(), time()) || [];
    regular.forEach((npc) => {
      const serviceStaff = ["charity_staff", "labor_staff", "convenience_clerk", "recycler_staff"].includes(npc.id);
      const chance = serviceStaff ? 1 : 0.72;
      if (stableRoll(`regular:${day()}:${time()}:${locationId()}:${npc.id}`) < chance) {
        result.push(npc);
        seen.add(npc.id);
      }
    });
    const romance = HMW.getLoveInterestsAtLocation?.(locationId(), time()) || [];
    romance.forEach((npc) => {
      if (seen.has(npc.id)) return;
      let chance = 0.46;
      if (npc.id === "romance_support" && locationId() === "charity_center") chance = 0.82;
      if (npc.id === "romance_homeless" && ["underpass", "riverside", "park"].includes(locationId())) chance = 0.66;
      if ((ensure().contacts[npc.id] || 0) > 0) chance += 0.08;
      if (stableRoll(`romance:${day()}:${time()}:${locationId()}:${npc.id}`) < Math.min(0.88, chance)) result.push({ ...npc, romance: true });
    });
    return result;
  };

  const ambientContact = (type) => {
    const key = `ambient:${type}:${locationId()}:${time()}`;
    if (onceUsed(key)) {
      show("周囲の人", ["この時間帯に声をかけられそうな相手には一度当たった。これ以上同じことを繰り返しても今日は変わらない。"]);
      return;
    }
    markUsed(key);
    const roll = stableRoll(`${key}:${day()}`);
    if (type === "passerby") {
      if (roll < 0.28) { remember("charity_center"); show("通行人", ["足を止めた人から、支援施設の場所だけは教えてもらえた。"]); }
      else show("通行人", ["足を止めず通り過ぎる人が多い。短く断られた。"]);
      return;
    }
    if (type === "homeless") {
      if (roll < 0.40) { remember(isNight() ? "underpass_sleep" : "charity_meal"); show("路上生活者", [isNight() ? "寝場所は先客と巡回を見て決めろ、と短く言われた。" : "昼の支援施設なら配布がある日もある、と教えられた。"]); }
      else show("路上生活者", ["警戒され、詳しい話はしてもらえなかった。"]);
      return;
    }
    if (type === "police") { show("警官", [roll < 0.5 ? "こちらを一度確認しただけで巡回を続けた。" : "長居しないよう注意された。今すぐ強制的に何かが起きたわけではない。"]); return; }
    if (type === "thug") { condition().fatigue = clamp(condition().fatigue + (roll < 0.35 ? 3 : 1)); show("不良", [roll < 0.35 ? "近づかないよう遠回りした。少し余計に疲れた。" : "こちらには特に構わず、その場にたむろしている。"]); return; }
    show("周囲の人", ["短い接触だけで終わった。"]);
  };

  const openPeople = () => {
    const box = modal("人と関わる");
    if (!box) return;
    const people = presentPeople();
    if (people.length) {
      box.append(h("今ここで話せる相手"));
      people.forEach((npc) => box.append(button(npc.displayName || npc.temporaryLabel || npc.role || npc.id, () => npc.romance || npc.id?.startsWith("romance_") ? romanceContact(npc) : genericContact(npc))));
    }
    const ambient = HMW.getAmbientNpcTypes?.(locationId()) || [];
    if (ambient.length) {
      box.append(h("周囲の人に声をかける"));
      const labels = { passerby: "通行人", police: "警官", homeless: "路上生活者", thug: "不良", resident: "住民", volunteer: "支援関係者", shopClerk: "店員", laborStaff: "職員", recycler: "廃品回収関係者" };
      ambient.slice(0, 4).forEach((type) => box.append(button(labels[type] || type, () => ambientContact(type))));
    }
    if (!people.length && !ambient.length) box.append(p("今は声をかけられそうな相手が見当たらない。"));
  };

  const getActions = () => {
    const id = locationId();
    const a = [];
    const add = (id2, label, run, priority = 50) => a.push({ id: id2, label, run, priority });

    if (id === "station_front") {
      add("station_board", flag("station_board") ? "案内を見直す" : "生活に使える案内を探す", stationBoard, flag("station_board") ? 70 : 5);
      add("ask_passerby", "通行人に仕事や支援の場所を聞く", askPasserby, 25);
      if (baseAction("beg")) add("beg", "人に金を求める", () => runBase("beg"), 55);
      if (baseAction("scavenge")) add("scavenge", "使えるものを探す", () => runBase("scavenge"), 60);
    }
    if (id === "shopping_street") {
      add("ask_passerby", "人に地域の支援情報を聞く", askPasserby, 25);
      if (baseAction("buy")) add("buy", "安い物を見る", () => runBase("buy"), 35);
      if (baseAction("scavenge")) add("scavenge", "使えるものを探す", () => runBase("scavenge"), 50);
    }
    if (id === "convenience_store") {
      add("store_talk", "店員に話しかける", storeTalk, 15);
      if (baseAction("buy")) add("buy", "商品を見る", () => runBase("buy"), 30);
      if ((relationship("convenience_clerk").familiarity || 0) >= 5 && ["evening", "night"].includes(time())) add("leftovers", "廃棄予定品がないか聞く", storeLeftovers, 20);
    }
    if (id === "park") {
      add("park", "公園を調べる", inspectPark, 18);
      if (baseAction("sleep_spot") && isNight()) add("sleep", "今夜の寝場所を探す", () => runBase("sleep_spot"), 10);
      if (baseAction("rest")) add("rest", "少し休む", () => runBase("rest"), condition().fatigue >= 70 ? 12 : 65);
    }
    if (id === "underpass") {
      add("underpass", "先客と空いている場所を確認する", inspectUnderpass, 12);
      if (baseAction("sleep_spot") && isNight()) add("sleep", "今夜の寝場所を探す", () => runBase("sleep_spot"), 10);
    }
    if (id === "riverside") {
      add("scrap", knows("scrap_route") ? "換金できる廃品を探す" : "使えそうな物を探す", () => searchScrap("riverside"), 20);
      if (baseAction("sleep_spot") && isNight()) add("sleep", "今夜の寝場所を探す", () => runBase("sleep_spot"), 15);
    }
    if (id === "charity_center") {
      add("support", "支援窓口で話す", supportDesk, 5);
      if (baseAction("food_support")) add("food", "食料支援を確認する", () => runBase("food_support"), condition().hunger >= 60 ? 4 : 25);
      if (baseAction("wash")) add("wash", "身なりを整える", () => runBase("wash"), condition().hygiene < 30 ? 8 : 35);
    }
    if (id === "labor_office") {
      add("requirements", "応募条件を確認する", laborRequirements, 8);
      if (baseAction("work_search")) add("jobs", "今日の求人を探す", () => runBase("work_search"), 20);
      if (!knows("industrial_morning_work")) add("industrial_tip", "日雇いの情報も聞く", () => { remember("industrial_morning_work"); show("職業相談所", ["正式な求人とは別に、工業地区で朝に単発の作業人員を探すことがある、と聞いた。毎日あるとは限らない。"]); }, 30);
    }
    if (id === "public_toilet") {
      if (baseAction("wash")) add("wash", "身なりを整える", () => runBase("wash"), condition().hygiene < 35 ? 5 : 25);
      if (baseAction("rest")) add("rest", "少し休む", () => runBase("rest"), condition().fatigue >= 70 ? 8 : 40);
    }
    if (id === "residential_alley") {
      if (baseAction("scavenge")) add("scavenge", "捨てられた物を確認する", () => runBase("scavenge"), 25);
      if (baseAction("sleep_spot") && isNight()) add("sleep", "寝られそうな場所を探す", () => runBase("sleep_spot"), 18);
    }
    if (id === "industrial_street") {
      add("scrap", knows("scrap_route") ? "廃品を探す" : "周辺を調べる", () => searchScrap("industrial"), 20);
      add("daywork", "単発の作業を探す", industrialDayWork, knows("industrial_morning_work") && time() === "morning" ? 5 : 35);
      if (baseAction("work_search")) add("jobs", "求人を探す", () => runBase("work_search"), 40);
    }
    if (id === "recycling_yard") {
      add("recycler_info", "持ち込める物を聞く", recyclerInfo, knows("scrap_route") ? 35 : 5);
      add("sell", "廃品を売る", sellScrap, getCount("scrap_piece") + getCount("aluminum_can") > 0 ? 4 : 30);
      if ((relationship("recycler_staff").familiarity || 0) >= 3) add("shift", "仕分けを手伝えるか聞く", recyclerShift, 18);
    }
    if (id === "police_station") add("police", "生活相談先を尋ねる", policeDesk, flag("police_support_info") ? 40 : 12);

    if (baseAction("rest") && !a.some((x) => x.id === "rest")) add("rest", "少し休む", () => runBase("rest"), condition().fatigue >= 78 ? 10 : 80);
    return a.sort((x, y) => x.priority - y.priority);
  };

  const getGoals = () => {
    const goals = [];
    const c = condition();
    const p2 = player();
    if (c.hunger >= 65 && foodCount() === 0) goals.push("今日食べるものを確保する");
    if (isNight() && !p2.sleepingPlaceId) goals.push("今夜休める場所を確保する");
    if (!p2.progression?.support?.caseOpened) goals.push("継続して相談できる窓口につながる");
    else if (Object.values(p2.workAccess || {}).some((v) => !v)) goals.push("仕事に必要な手続きを一つ進める");
    if (p2.money <= 0) goals.push("少額でも現金になる手段を作る");
    if (!flag("recycler_known")) goals.push("街で換金できる物のルートを知る");
    if (!goals.length) goals.push("食料・寝床・収入の余裕を一日分増やす");
    return goals.slice(0, 3);
  };

  const sceneSummary = () => {
    ensure();
    const loc = location();
    if (!loc) return "場所情報を読み込めない。";
    const people = presentPeople();
    const actions = getActions();
    const goals = getGoals();
    const parts = [`${loc.name}。`];
    if (people.length) parts.push(`${people.slice(0, 3).map((x) => x.displayName || x.temporaryLabel || x.role).join("、")}に声をかけられる。`);
    parts.push(`今の課題：${goals.join("／")}。`);
    if (actions.length) parts.push(`ここでできること：${actions.slice(0, 3).map((x) => `「${x.label}」`).join("、")}。`);
    return parts.join(" ");
  };

  const primaryAction = () => {
    const actions = getActions();
    const c = condition();
    const find = (id) => actions.find((a) => a.id === id);
    if (c.hunger >= 65 && foodCount() > 0) return { id: "eat", label: "持ち物から食べる", run: () => document.getElementById("inventoryButton")?.click() };
    if (c.hunger >= 65) {
      for (const id of ["food", "buy", "scavenge", "beg"]) if (find(id)) return find(id);
    }
    if (c.fatigue >= 75 && find("rest")) return find("rest");
    if (isNight() && !player().sleepingPlaceId && find("sleep")) return find("sleep");
    if (!player().progression?.support?.caseOpened && find("support")) return find("support");
    if (player().money <= 0) {
      for (const id of ["daywork", "sell", "shift", "scrap"]) if (find(id)) return find(id);
    }
    return actions[0] || null;
  };

  const openActions = () => {
    const box = modal(location()?.name || "ここでできること");
    if (!box) return;
    box.append(p(`今の課題：${getGoals().join("／")}。`));
    const actions = getActions();
    if (!actions.length) {
      box.append(p("今ここで進められることは少ない。人に声をかけるか、別の場所へ移る必要がある。"));
      return;
    }
    actions.forEach((a) => box.append(button(a.label, a.run)));
  };

  const render = () => {
    ensure();
    if (player().lifeStatus !== "active") return;
    const blocking = HMW.eventGate?.getActiveBlocking?.();
    const forced = player().progression?.eventGate?.forcedMoveFrom === locationId();
    if (blocking || forced) return;

    const text = document.getElementById("sceneText");
    if (text) text.textContent = sceneSummary();

    const buttons = [...document.querySelectorAll("[data-flow-slot]")];
    if (buttons.length < 3) return;
    const primary = primaryAction();
    buttons[0].textContent = primary?.label || "ここでできること";
    buttons[0].disabled = false;
    buttons[0].onclick = primary?.run || openActions;

    const people = presentPeople();
    buttons[1].textContent = people.length ? "人と関わる" : "周囲と関わる";
    buttons[1].disabled = false;
    buttons[1].onclick = openPeople;

    const blocked = HMW.flowUI?.movementBlock?.();
    buttons[2].textContent = blocked ? "移動できない" : "移動する";
    buttons[2].disabled = Boolean(blocked);
    buttons[2].onclick = blocked ? null : () => HMW.flowUI?.openMove?.();
  };

  const oldPacket = HMW.getAIPacket;
  const getAIPacket = () => {
    const base = typeof oldPacket === "function" ? oldPacket() : { context: HMW.getTurnContext?.() || {} };
    return {
      ...base,
      instruction: `${base.instruction || ""} JSで確定していない金銭・食料・仕事・住居・関係進展をAIが勝手に成功扱いしてはいけない。`,
      playableContent: {
        goals: getGoals(),
        scene: sceneSummary(),
        actions: getActions().map((a) => ({ id: a.id, label: a.label })),
        people: presentPeople().map((x) => ({ id: x.id, name: x.displayName || x.temporaryLabel || x.role })),
        tips: clone(ensure().tips),
        flags: clone(ensure().flags),
        income: clone(ensure().income)
      }
    };
  };

  const install = () => {
    ensure();
    HMW.getAIPacket = getAIPacket;
    HMW.gameContent = {
      ensure,
      getGoals,
      getActions,
      primaryAction,
      openActions,
      openPeople,
      presentPeople,
      sceneSummary,
      render,
      getAIPacket
    };

    const originalFlowRender = HMW.flowUI?.render;
    if (HMW.flowUI && !HMW.flowUI.__playableContentWrapped) {
      HMW.flowUI.__playableContentWrapped = true;
      HMW.flowUI.render = () => {
        originalFlowRender?.();
        setTimeout(render, 0);
      };
    }

    document.addEventListener("click", () => setTimeout(render, 0));
    const actionArea = document.getElementById("actionArea");
    const scene = document.getElementById("sceneText");
    let pending = false;
    const observer = new MutationObserver(() => {
      if (pending) return;
      pending = true;
      setTimeout(() => { pending = false; render(); }, 0);
    });
    if (actionArea) observer.observe(actionArea, { subtree: true, childList: true, attributes: true, characterData: true });
    if (scene) observer.observe(scene, { subtree: true, childList: true, characterData: true });
    render();
  };

  document.addEventListener("DOMContentLoaded", install);
})();