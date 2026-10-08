window.GrayGame = window.GrayGame || {};

(() => {
  "use strict";

  const PREP_ITEMS = [
    { id:"bed", label:"大きな寝床", text:"体を伸ばせる大きさのベッドを用意した。" },
    { id:"mat", label:"滑り止めマット", text:"滑りやすい床にマットを敷いた。" },
    { id:"bowl", label:"食器と水入れ", text:"大型犬用の食器と、倒れにくい水入れを用意した。" },
    { id:"gate", label:"落ち着ける区画", text:"来客から離れて休める場所を作った。" },
    { id:"vet", label:"動物病院を確認", text:"通える動物病院と移動手段を確認した。" },
    { id:"route", label:"散歩道を確認", text:"静かな散歩コースを歩いて確認した。" }
  ];

  const HOME_ACTIONS = [
    { id:"quiet", label:"そっとしておく" },
    { id:"meal", label:"ごはんを出す" },
    { id:"walk_home", label:"短く散歩する" },
    { id:"sit_home", label:"床に座って過ごす" }
  ];

  const ACTIONS = {
    sit: { label:"近くに座る" },
    snack: { label:"おやつを置く" },
    hand: { label:"手を出して待つ" },
    walk: { label:"一緒に散歩する" },
    staff: { label:"スタッフに聞く" }
  };

  GrayGame.data = { PREP_ITEMS, HOME_ACTIONS, ACTIONS };

  function useFacilityAction(id, result, observation, first) {
    const s = GrayGame.getState();
    if (s.momentsLeft <= 0 || s.usedActions.includes(id)) return null;

    const counts = { ...s.actionCounts, [id]:(s.actionCounts[id] || 0) + 1 };
    const left = s.momentsLeft - 1;

    GrayGame.patch({
      momentsLeft:left,
      acted:left <= 0,
      usedActions:[...s.usedActions,id],
      actionCounts:counts,
      familiarity:s.familiarity + 1,
      trust:s.trust + 1,
      lastEvent:id,
      lastOutcome:first ? "first" : "move",
      lastResultText:result,
      lastObservationText:observation
    });

    GrayGame.addJournal(`${ACTIONS[id].label}：${result}`);
    if (first) GrayGame.addFirst(first[0], first[1]);
    return true;
  }

  GrayGame.availableFacilityActions = () => {
    const s = GrayGame.getState();
    const list = ["sit","staff"];

    if (s.actionCounts.sit >= 1 || s.visit >= 2) list.push("snack");
    if (s.actionCounts.snack >= 1 || s.familiarity >= 3) list.push("hand");
    if (s.visit >= 3 && (s.actionCounts.sit >= 2 || s.actionCounts.hand >= 1)) list.push("walk");

    return list.filter((id) => !s.usedActions.includes(id));
  };

  GrayGame.doFacilityAction = (id) => {
    const s = GrayGame.getState();
    const n = (s.actionCounts[id] || 0) + 1;

    if (id === "sit") {
      if (n === 1) return useFacilityAction(
        id,
        "少し距離を残して座ります。",
        "グレイはその場を離れません。耳だけがこちらへ向きました。",
        ["sit_first","初めて、近くで一緒に過ごした"]
      );
      if (n === 2) return useFacilityAction(
        id,
        "前と同じように、何もせず座ります。",
        "しばらくして、グレイがこちらを一度見てから伏せ直しました。",
        ["look_back","初めて、こちらを見て伏せ直した"]
      );
      if (n === 3) return useFacilityAction(
        id,
        "今日も同じ場所に座ります。",
        "グレイは前より近い位置へ自分から移動し、そのまま横になりました。",
        ["near_rest","初めて、自分から近くへ来て休んだ"]
      );
      if (n === 4) return useFacilityAction(
        id,
        "いつものように座ります。",
        "少しして、グレイが自分からこちらのそばまで来て伏せました。離れようとはしません。",
        ["beside_rest","初めて、自分からそばまで来て伏せた"]
      );
      return useFacilityAction(
        id,
        "座っていると、グレイも落ち着いたまま過ごします。",
        "こちらがいることを気にしすぎず、伏せたまま目を閉じています。"
      );
    }

    if (id === "snack") {
      if (n === 1) return useFacilityAction(
        id,
        "手渡しせず、少し離れた場所におやつを置きます。",
        "すぐには動きません。しばらくしてから自分で取りに来ました。",
        ["snack_first","初めて、置いたおやつを食べた"]
      );
      if (n === 2) return useFacilityAction(
        id,
        "いつもの場所におやつを置きます。",
        "今日は前より早く立ち上がり、こちらがいる間に食べました。",
        ["snack_near","初めて、こちらがいる間におやつを食べた"]
      );
      return useFacilityAction(
        id,
        "おやつを置くと、グレイは少し待ってから近づきます。",
        "食べ終えると、すぐ元の場所には戻らずこちらを見ています。"
      );
    }

    if (id === "hand") {
      if (n === 1) return useFacilityAction(
        id,
        "手を低い位置で止めて待ちます。",
        "グレイが首を少し伸ばし、短く匂いを確かめました。",
        ["scent","初めて、手の匂いを確かめた"]
      );
      if (n === 2) return useFacilityAction(
        id,
        "手を出して、そのまま待ちます。",
        "今日は自分から鼻先を寄せ、前より長く匂いを確かめました。",
        ["nose_touch","初めて、鼻先が手に触れた"]
      );
      if (n === 3) return useFacilityAction(
        id,
        "手を低く出して待ちます。",
        "グレイは迷わず近づき、鼻先を触れたあと、そのまま手のそばに残りました。",
        ["hand_stay","初めて、手に触れたあともそばに残った"]
      );
      return useFacilityAction(
        id,
        "手を出すと、グレイは少し迷ってから近づきます。",
        "確認が終わっても、その場から離れません。"
      );
    }

    if (id === "walk") {
      if (n === 1) return useFacilityAction(
        id,
        "スタッフと一緒に外へ出ます。",
        "最初は半歩後ろでしたが、帰り道では少し近くを歩きました。",
        ["walk_first","初めて、一緒に散歩した"]
      );
      if (n === 2) return useFacilityAction(
        id,
        "今日も短い散歩へ出ます。",
        "帰り道で自分から横に並び、その位置のまま施設まで歩きました。",
        ["walk_side","初めて、自分から横に並んで歩いた"]
      );
      if (n === 3) return useFacilityAction(
        id,
        "リードを手に取ります。",
        "グレイは呼ばれる前に立ち上がり、こちらのそばまで来て散歩を待ちました。",
        ["walk_wait","初めて、自分からそばへ来て散歩を待った"]
      );
      return useFacilityAction(
        id,
        "静かな道を一緒に歩きます。",
        "グレイは時々こちらを確認しながら、ほぼ同じ歩幅で歩いています。"
      );
    }

    if (id === "staff") {
      if (n === 1) return useFacilityAction(
        id,
        "スタッフから、グレイは嫌なことも我慢してしまうと聞きます。",
        "反応が薄い時ほど、無理に何かをさせない方がよさそうです。",
        ["learn","グレイの「我慢する癖」を知った"]
      );
      return useFacilityAction(
        id,
        "最近のグレイの様子をスタッフに聞きます。",
        "こちらが来る日は、入口の音に反応することが増えたそうです。"
      );
    }

    return null;
  };

  GrayGame.advanceFacility = () => {
    const s = GrayGame.getState();
    GrayGame.patch({
      visit:s.visit + 1,
      acted:false,
      momentsLeft:4,
      usedActions:[],
      lastEvent:"return",
      lastOutcome:"",
      lastResultText:"",
      lastObservationText:""
    });
  };

  GrayGame.canTrial = () => {
    const s = GrayGame.getState();
    return s.visit >= 6 && s.prep.length >= 4;
  };

  GrayGame.startTrial = () => {
    if (!GrayGame.canTrial()) return false;
    GrayGame.patch({
      mode:"home",
      homeDay:0,
      acted:false,
      momentsLeft:2,
      usedActions:[],
      lastEvent:"trial",
      lastOutcome:"",
      lastResultText:"",
      lastObservationText:""
    });
    GrayGame.addFirst("home", "グレイが家に来た");
    GrayGame.addJournal("今日からトライアル。グレイが家に来た。", "一緒に暮らして 1日目");
    return true;
  };

  GrayGame.doHomeAction = (id) => {
    const s = GrayGame.getState();
    if (s.momentsLeft <= 0 || s.usedActions.includes(id)) return null;
    const action = HOME_ACTIONS.find(a => a.id === id);
    if (!action) return null;

    const copy = {
      quiet:["何も求めず、同じ部屋で静かに過ごします。","グレイは少し離れた場所で横になりました。"],
      meal:["決まった場所にごはんを置きます。","食べ終えたあとも、すぐには隅へ戻りませんでした。"],
      walk_home:["家の周りを短く歩きます。","帰ると、自分から玄関の中へ入りました。"],
      sit_home:["床に座って静かに過ごします。","少しして、グレイも前より近い場所で伏せました。"]
    }[id];

    const left = s.momentsLeft - 1;
    GrayGame.patch({
      momentsLeft:left,
      acted:left <= 0,
      usedActions:[...s.usedActions,id],
      lastEvent:id,
      lastOutcome:"move",
      lastResultText:copy[0],
      lastObservationText:copy[1]
    });
    GrayGame.addJournal(`${copy[0]} ${copy[1]}`);
    return true;
  };

  GrayGame.advanceHome = () => {
    const s = GrayGame.getState();
    GrayGame.patch({
      homeDay:s.homeDay + 1,
      acted:false,
      momentsLeft:2,
      usedActions:[],
      lastEvent:"new_day",
      lastOutcome:"",
      lastResultText:"",
      lastObservationText:""
    });
  };
})();