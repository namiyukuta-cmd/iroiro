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

  GrayGame.data = { PREP_ITEMS, HOME_ACTIONS };

  const zoneMeters = [4, 3, 2, 1, 0.5];

  const useTurn = (patch, journal) => {
    const s = GrayGame.getState();
    const left = Math.max(0, s.momentsLeft - 1);
    GrayGame.patch({
      momentsLeft:left,
      acted:left <= 0,
      sessionTurn:s.sessionTurn + 1,
      ...patch
    });
    if (journal) GrayGame.addJournal(journal);
  };

  const addDistanceFirsts = () => {
    const s = GrayGame.getState();
    const gap = Math.max(0, s.grayZone - s.playerZone);
    if (gap <= 2) GrayGame.addFirst("within2", "初めて、2mほどの距離に残った");
    if (gap <= 1) GrayGame.addFirst("within1", "初めて、1mほどの距離に残った");
  };

  GrayGame.zoneLabel = (zone) => zoneMeters[zone] ? `${zoneMeters[zone]}m` : "そば";

  GrayGame.sitAt = (zone) => {
    const s = GrayGame.getState();
    if (s.momentsLeft <= 0 || zone < 0 || zone > 3) return null;

    const gap = s.grayZone - zone;
    let ease = s.sessionEase;
    let observation = "";
    if (gap >= 2) {
      ease += 2;
      observation = "グレイは伏せた姿勢のまま。耳だけがこちらへ向きます。";
    } else {
      ease += 1;
      observation = "グレイは少し顔を上げます。位置は変えず、そのままこちらを見ています。";
    }

    const text = `${GrayGame.zoneLabel(zone)}ほど離れた位置に座ります。`;
    useTurn({
      playerZone:zone,
      sessionEase:ease,
      lastEvent:"sit",
      lastOutcome:"move",
      lastResultText:text,
      lastObservationText:observation
    }, `${text} ${observation}`);

    addDistanceFirsts();
    return true;
  };

  GrayGame.placeSnack = (zone) => {
    const s = GrayGame.getState();
    if (s.momentsLeft <= 0 || zone < 1 || zone > 3) return null;

    let grayZone = s.grayZone;
    let ease = s.sessionEase + 1;
    let moved = false;

    if (zone < grayZone && zone > s.playerZone) {
      grayZone = Math.max(zone, grayZone - 1);
      moved = grayZone !== s.grayZone;
      ease += moved ? 1 : 0;
    }

    const text = `${GrayGame.zoneLabel(zone)}の位置におやつを置きます。`;
    const observation = moved
      ? "しばらく待つと、グレイが立ち上がって一歩だけ近づき、おやつを食べました。"
      : "グレイは鼻先を少し上げます。すぐには動かず、置かれた場所を見ています。";

    useTurn({
      grayZone,
      snackZone:zone,
      sessionEase:ease,
      lastEvent:"snack",
      lastOutcome:moved ? "approach" : "move",
      lastResultText:text,
      lastObservationText:observation
    }, `${text} ${observation}`);

    if (moved) GrayGame.addFirst("snack_step", "初めて、おやつのために一歩近づいた");
    addDistanceFirsts();
    return true;
  };

  GrayGame.waitQuietly = () => {
    const s = GrayGame.getState();
    if (s.momentsLeft <= 0) return null;

    let grayZone = s.grayZone;
    let ease = s.sessionEase + 1;
    let moved = false;
    const gap = grayZone - s.playerZone;

    if (ease >= 3 && gap >= 2) {
      grayZone -= 1;
      ease = Math.max(0, ease - 2);
      moved = true;
    }

    const text = "何もせず、そのまま待ちます。";
    const observation = moved
      ? "数分後、グレイが自分から立ち上がり、ひとつ近い場所で伏せ直しました。"
      : "グレイは姿勢を変えずにいます。呼吸だけが少しゆっくりになりました。";

    useTurn({
      grayZone,
      sessionEase:ease,
      lastEvent:"wait",
      lastOutcome:moved ? "approach" : "move",
      lastResultText:text,
      lastObservationText:observation
    }, `${text} ${observation}`);

    if (moved) GrayGame.addFirst("self_step", "初めて、自分から一歩近づいた");
    addDistanceFirsts();
    return true;
  };

  GrayGame.offerHand = () => {
    const s = GrayGame.getState();
    if (s.momentsLeft <= 0 || s.visit < 3) return null;

    const gap = s.grayZone - s.playerZone;
    const text = "手を低い位置で止めて待ちます。";
    let observation = "まだ届く距離ではありません。グレイは手の方を見ただけでした。";
    let outcome = "move";

    if (gap <= 1) {
      observation = "グレイが首を少し伸ばし、鼻先で短く匂いを確かめました。";
      outcome = "approach";
      GrayGame.addFirst("scent", "初めて、手の匂いを確かめた");
    }

    useTurn({
      sessionEase:s.sessionEase + 1,
      lastEvent:"hand",
      lastOutcome:outcome,
      lastResultText:text,
      lastObservationText:observation
    }, `${text} ${observation}`);

    return true;
  };

  GrayGame.takeWalk = () => {
    const s = GrayGame.getState();
    if (s.momentsLeft <= 0 || s.visit < 3) return null;

    const nextGray = Math.max(s.playerZone + 1, s.grayZone - 1);
    const text = "スタッフと一緒に、短く外を歩きます。";
    const observation = nextGray < s.grayZone
      ? "戻ってくると、グレイはさっきより一つ近い場所で伏せました。"
      : "帰り道は半歩ほど後ろ。施設へ戻ると、いつもの場所で伏せました。";

    useTurn({
      grayZone:nextGray,
      sessionEase:s.sessionEase + 2,
      lastEvent:"walk",
      lastOutcome:nextGray < s.grayZone ? "approach" : "move",
      lastResultText:text,
      lastObservationText:observation
    }, `${text} ${observation}`);

    GrayGame.addFirst("walk", "初めて、一緒に散歩した");
    if (s.visit >= 4) GrayGame.addFirst("walk_side", "初めて、帰り道で横に並んだ");
    addDistanceFirsts();
    return true;
  };

  GrayGame.advanceFacility = () => {
    const s = GrayGame.getState();
    const baseGray = Math.max(2, 4 - Math.floor((s.visit + 1) / 4));
    GrayGame.patch({
      visit:s.visit + 1,
      acted:false,
      momentsLeft:4,
      usedActions:[],
      lastEvent:"return",
      lastOutcome:"",
      lastResultText:"",
      lastObservationText:"",
      playerZone:0,
      grayZone:baseGray,
      snackZone:null,
      sessionEase:Math.min(2, Math.floor(s.familiarity / 6)),
      sessionTurn:0,
      familiarity:s.familiarity + 1
    });
  };

  GrayGame.canTrial = () => {
    const s = GrayGame.getState();
    return s.visit >= 6 && s.prep.length >= 4 && s.firsts.some(x => x.id === "scent");
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
      quiet:["同じ部屋で、何も求めず過ごします。","グレイは少し離れた場所で横になりました。"],
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