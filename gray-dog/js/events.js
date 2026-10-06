window.GrayGame = window.GrayGame || {};

(() => {
  "use strict";

  const FACILITY_PATTERNS = [
    {
      id:"guarded",
      title:"距離を測っている",
      clue:"耳だけがこちらへ向きます。目は合わせず、伏せた姿勢のままです。",
      good:["observe","sit"],
      first:["read_guarded","初めて、グレイが安心できる距離を読めた"]
    },
    {
      id:"food",
      title:"興味はある",
      clue:"こちらが動くたび鼻先が少し上がります。足元と手元を交互に確認しています。",
      good:["snack","observe"],
      first:["read_food","初めて、興味を示すサインに気づいた"]
    },
    {
      id:"scent",
      title:"確認したい",
      clue:"体は動かしませんが、鼻先だけがこちらへ向きます。逃げる準備はしていません。",
      good:["hand","sit"],
      first:["read_scent","初めて、グレイの方から確認したい瞬間を読めた"]
    },
    {
      id:"movement",
      title:"外へ意識が向いている",
      clue:"入口の音に耳が立ち、リードを見ると一度だけ立ち上がりかけます。",
      good:["walk","staff"],
      first:["read_walk","初めて、グレイが歩きたいタイミングを読めた"]
    },
    {
      id:"contact",
      title:"近くても平気",
      clue:"こちらが一歩近づいても体が固まりません。視線を外したまま、その場に残っています。",
      good:["touch","sit"],
      first:["read_contact","初めて、触れてもよいタイミングを読めた"]
    },
    {
      id:"familiar",
      title:"来たことを知っている",
      clue:"入ってきた時点で耳がこちらを追います。伏せ直してから、近くの床へ視線を落とします。",
      good:["sit","hand","walk"],
      first:["read_familiar","初めて、グレイが来訪を待つような仕草を見せた"]
    }
  ];

  const HOME_PATTERNS = [
    {
      id:"rest",
      title:"休みたい",
      clue:"あくびをして、部屋の端を何度も見ています。",
      good:["quiet","sit_home"],
      first:["home_rest","初めて、この家で深く休めた"]
    },
    {
      id:"hungry",
      title:"食事を待っている",
      clue:"水入れのそばを通り、食器のある場所を一度確認します。",
      good:["meal"],
      first:["home_meal","初めて、ごはんの場所を自分から確認した"]
    },
    {
      id:"outside",
      title:"外へ出たい",
      clue:"玄関の音に反応して立ち上がり、ドアの方を見ています。",
      good:["walk_home"],
      first:["home_walk","初めて、自分から散歩を待った"]
    },
    {
      id:"company",
      title:"同じ場所にいたい",
      clue:"こちらが座ると、少し離れた場所へ移動して同じ向きに伏せます。",
      good:["sit_home","quiet"],
      first:["home_company","初めて、自分から同じ場所を選んだ"]
    }
  ];

  const FACILITY_ACTIONS = [
    { id:"observe", label:"少し離れて見る", minVisit:1, fit:"視線と耳の動きを読む" },
    { id:"sit", label:"近くに座って待つ", minVisit:1, fit:"何も要求せず同じ空間にいる" },
    { id:"staff", label:"スタッフに聞く", minVisit:1, fit:"今日の様子を確認する" },
    { id:"snack", label:"おやつを離して置く", minVisit:2, fit:"手渡しせず興味を確かめる" },
    { id:"hand", label:"手を低く出して待つ", minVisit:3, fit:"グレイから確認できるようにする" },
    { id:"walk", label:"一緒に外へ出る", minVisit:4, fit:"歩く気配に合わせる" },
    { id:"touch", label:"肩の後ろへ一度触れる", minVisit:5, fit:"触れてよい時だけ短く触れる" }
  ];

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

  const successFacility = {
    observe:["急がず見ていると、グレイの耳がこちらへ向いたままになります。","こちらを意識しながらも、伏せた姿勢を崩しません。"],
    sit:["距離を残して座ると、しばらくしてグレイが伏せ直しました。","同じ空間にいても、体の力が少し抜けています。"],
    staff:["スタッフと話している間、グレイは入口を何度か確認します。","今日は外の音への反応が強いことが分かりました。"],
    snack:["おやつを離して置くと、少し待ってから自分で取りに来ました。","食べ終えたあと、すぐ元の場所へ戻らずこちらを確認します。"],
    hand:["手を止めて待つと、グレイから鼻先を寄せて短く匂いを確かめました。","確認が終わると、その場に残ったまま伏せ直します。"],
    walk:["外へ出ると、最初は半歩後ろ。帰り道では同じくらいの位置を歩きます。","歩幅が少しずつこちらと揃っています。"],
    touch:["一度だけ肩の後ろへ触れると、グレイは固まらずこちらを一度見ました。","手を離したあとも、その場から動きません。"]
  };

  const neutralFacility = {
    observe:["今日は見続けても大きな変化はありません。","ただ、こちらが静かにいることには慣れているようです。"],
    sit:["座るとグレイは少しだけ位置を変えました。","嫌がってはいません。今日は別のことへ意識が向いています。"],
    staff:["スタッフの話を聞いている間、グレイは静かにしています。","今日のサインは、会話だけではまだ読み切れません。"],
    snack:["おやつにはすぐ反応せず、そのまま置いておきます。","今は食べ物より周囲の方が気になっているようです。"],
    hand:["手はその位置で止めたまま。グレイは今日は嗅ぎに来ません。","近づけずに待ったので、距離はそのまま保てています。"],
    walk:["リードを見せても今日は立ち上がりません。","無理に誘わず、その場で終えました。"],
    touch:["触れずに手を引きました。","体が少し硬かったので、今日はまだ待つ方がよさそうです。"]
  };

  const successHome = {
    quiet:["何も求めず過ごすと、グレイは横向きになって眠り始めました。","呼吸がゆっくりになっています。"],
    meal:["食器を置くと迷わず近づき、食べ終えたあともその場に少し残ります。","ごはんの場所をもう覚えています。"],
    walk_home:["玄関を開けると自分から立ち上がりました。帰宅時も自分から中へ入ります。","家と散歩道がつながり始めています。"],
    sit_home:["床に座ると、少ししてグレイも同じ部屋へ移動して伏せました。","以前より近い場所を自分で選んでいます。"]
  };

  const neutralHome = {
    quiet:["静かにしていると、グレイは部屋を一周してから伏せました。","まだ落ち着く場所を探しています。"],
    meal:["ごはんを置きましたが、少し時間を置いてから食べ始めました。","今日は食事より別のことが気になっていたようです。"],
    walk_home:["外へ誘うと玄関までは来ますが、今日はそこで止まりました。","無理に出ず、短く終えます。"],
    sit_home:["床に座ると、グレイはこちらを確認して別の場所へ伏せます。","同じ部屋にはいます。距離はグレイに任せます。"]
  };

  GrayGame.data = { FACILITY_ACTIONS, PREP_ITEMS, HOME_ACTIONS, FACILITY_PATTERNS, HOME_PATTERNS };

  GrayGame.currentPattern = () => {
    const s = GrayGame.getState();
    const list = s.mode === "home" ? HOME_PATTERNS : FACILITY_PATTERNS;
    const index = s.mode === "home" ? s.homeDay % list.length : (s.visit - 1) % list.length;
    return list[index];
  };

  GrayGame.availableFacilityActions = () => {
    const s = GrayGame.getState();
    return FACILITY_ACTIONS.filter((a) => a.minVisit <= s.visit);
  };

  GrayGame.doFacilityAction = (id) => {
    const s = GrayGame.getState();
    if (s.momentsLeft <= 0) return null;
    const action = FACILITY_ACTIONS.find((a) => a.id === id && a.minVisit <= s.visit);
    if (!action) return null;

    const pattern = GrayGame.currentPattern();
    const matched = pattern.good.includes(id);
    const [result, observation] = (matched ? successFacility : neutralFacility)[id];
    const left = s.momentsLeft - 1;

    GrayGame.patch({
      momentsLeft:left,
      acted:left <= 0,
      todayWins:s.todayWins + (matched ? 1 : 0),
      trust:s.trust + (matched ? 2 : 0),
      familiarity:s.familiarity + 1,
      lastEvent:id,
      lastOutcome:matched ? "fit" : "neutral",
      lastResultText:result,
      lastObservationText:observation
    });

    GrayGame.addJournal(`${action.label}：${result}`);
    if (matched && pattern.first) GrayGame.addFirst(pattern.first[0], pattern.first[1]);
    return { action, matched, result, observation, pattern };
  };

  GrayGame.advanceFacility = () => {
    const s = GrayGame.getState();
    GrayGame.patch({
      visit:s.visit + 1,
      acted:false,
      momentsLeft:2,
      todayWins:0,
      lastEvent:"return",
      lastOutcome:"",
      lastResultText:"",
      lastObservationText:""
    });
  };

  GrayGame.canTrial = () => {
    const s = GrayGame.getState();
    return s.visit >= 6 && s.prep.length >= 4 && s.trust >= 8;
  };

  GrayGame.startTrial = () => {
    if (!GrayGame.canTrial()) return false;
    GrayGame.patch({
      mode:"home",
      homeDay:0,
      acted:false,
      momentsLeft:2,
      todayWins:0,
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
    if (s.momentsLeft <= 0) return null;
    const action = HOME_ACTIONS.find((a) => a.id === id);
    if (!action) return null;

    const pattern = GrayGame.currentPattern();
    const matched = pattern.good.includes(id);
    const [result, observation] = (matched ? successHome : neutralHome)[id];
    const left = s.momentsLeft - 1;

    GrayGame.patch({
      momentsLeft:left,
      acted:left <= 0,
      todayWins:s.todayWins + (matched ? 1 : 0),
      trust:s.trust + (matched ? 1 : 0),
      familiarity:s.familiarity + 1,
      lastEvent:id,
      lastOutcome:matched ? "fit" : "neutral",
      lastResultText:result,
      lastObservationText:observation
    });

    GrayGame.addJournal(`${action.label}：${result}`);
    if (matched && pattern.first) GrayGame.addFirst(pattern.first[0], pattern.first[1]);
    return { action, matched, result, observation, pattern };
  };

  GrayGame.advanceHome = () => {
    const s = GrayGame.getState();
    GrayGame.patch({
      homeDay:s.homeDay + 1,
      acted:false,
      momentsLeft:2,
      todayWins:0,
      lastEvent:"new_day",
      lastOutcome:"",
      lastResultText:"",
      lastObservationText:""
    });
  };
})();