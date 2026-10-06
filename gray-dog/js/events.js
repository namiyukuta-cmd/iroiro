window.GrayGame = window.GrayGame || {};

(() => {
  "use strict";

  const FACILITY_ACTIONS = [
    { id:"sit", label:"少し離れて座る", minVisit:1, text:"距離を残して座る。グレイはそのまま伏せている。帰る頃、一度だけこちらを見た。", first:["visit_sit","初めて、同じ場所で静かに過ごした"] },
    { id:"snack", label:"おやつを置く", minVisit:2, text:"少し離して置く。すぐには動かなかったが、帰る前にはなくなっていた。", first:["visit_snack","初めて、置いたおやつを食べた"] },
    { id:"hand", label:"手を低く出して待つ", minVisit:2, text:"手を止めて待つ。グレイは鼻先を少し伸ばし、短く匂いを確かめた。", first:["visit_hand","初めて、手の匂いを確かめた"] },
    { id:"walk", label:"短く一緒に歩く", minVisit:3, text:"スタッフと一緒に外へ出る。帰り道では、半歩ほど近いところを歩いた。", first:["visit_walk","初めて、一緒に散歩した"] }
  ];

  const PREP_ITEMS = [
    { id:"bed", label:"大きな寝床", text:"体を伸ばせる大きさのベッドを用意した。" },
    { id:"mat", label:"滑り止めマット", text:"滑りやすい床にマットを敷いた。" },
    { id:"bowl", label:"食器と水入れ", text:"大型犬用の食器と、倒れにくい水入れを用意した。" },
    { id:"gate", label:"落ち着ける場所", text:"来客から離れて休める場所を作った。" },
    { id:"vet", label:"動物病院を確認", text:"通える動物病院と移動手段を確認した。" },
    { id:"route", label:"散歩道を確認", text:"静かな散歩コースを歩いて確認した。" }
  ];

  const HOME_ACTIONS = [
    { id:"feed", label:"ごはん", hint:"空腹を満たす", unlock:() => true },
    { id:"water", label:"水を替える", hint:"新しい水を用意", unlock:() => true },
    { id:"walk_home", label:"散歩", hint:"外を歩いて気分転換", unlock:() => true },
    { id:"brush", label:"ブラッシング", hint:"毛並みと皮膚を整える", unlock:() => true },
    { id:"quiet", label:"静かに一緒にいる", hint:"何も求めず同じ部屋で過ごす", unlock:() => true },
    { id:"rest", label:"休ませる", hint:"今日はしっかり休む", unlock:() => true },
    { id:"nose", label:"匂い探し", hint:"部屋で小さなノーズワーク", unlock:(s) => s.homeDay >= 2 },
    { id:"training", label:"軽い練習", hint:"名前・待つ・玄関など", unlock:(s) => s.homeDay >= 4 && s.care.calm >= 45 }
  ];

  const HOME_COPY = {
    feed: {
      normal:["ごはんを用意すると、グレイは少し離れて待つ。器を置くと、静かに食べ始めた。","食べ終わると水を飲み、いつもの場所へ戻った。"],
      high:["器を置いても、今日はすぐには食べない。少ししてから数口だけ口をつけた。","空腹ではなかったようだ。残りは片づけた。"]
    },
    water: {
      normal:["水を替える。グレイは交換が終わるのを見てから近づき、長めに水を飲んだ。","水入れの場所はもう覚えている。"],
      high:["水を替える。グレイは一度確認しただけで、今は飲まなかった。","新しい水はそのまま置いておく。"]
    },
    walk_home: {
      normal:["リードを持つとグレイが立ち上がる。静かな道をゆっくり一周した。","帰り道は歩幅が少し揃っていた。"],
      tired:["玄関までは来たが、今日は足取りが重い。短い道だけ歩いて戻った。","今日は運動より休息が必要そうだ。"]
    },
    brush: {
      normal:["肩から背中へゆっくりブラシを通す。グレイは途中で一度こちらを見たが、その場にいた。","抜け毛が取れ、毛並みが少し整った。"],
      tense:["ブラシを見せると体が少し硬くなる。今日は数回だけで終えた。","嫌なことを我慢させない。続きは別の日にする。"]
    },
    quiet: {
      normal:["床に座って別のことをしていると、グレイも同じ部屋で伏せた。","しばらくすると呼吸がゆっくりになった。"]
    },
    rest: {
      normal:["今日は予定を増やさず、寝床を静かにして休ませた。","しばらくして横向きになり、深く眠った。"]
    },
    nose: {
      normal:["小さなおやつを数か所に隠す。グレイは鼻を使って一つずつ探した。","最後の一つを見つける頃には、尻尾が少し高くなっていた。"]
    },
    training: {
      normal:["短い練習だけにする。名前を呼び、こちらを見たらそこで終える。","繰り返すうち、名前を聞いて顔を上げるのが少し早くなった。"]
    }
  };

  GrayGame.data = { FACILITY_ACTIONS, PREP_ITEMS, HOME_ACTIONS };

  GrayGame.availableFacilityActions = () => {
    const s = GrayGame.getState();
    return FACILITY_ACTIONS.filter((a) => a.minVisit <= s.visit);
  };

  GrayGame.availableHomeActions = () => {
    const s = GrayGame.getState();
    return HOME_ACTIONS.filter((a) => a.unlock(s));
  };

  GrayGame.doFacilityAction = (id) => {
    const s = GrayGame.getState();
    if (s.momentsLeft <= 0) return null;
    const action = FACILITY_ACTIONS.find((a) => a.id === id && a.minVisit <= s.visit);
    if (!action) return null;

    GrayGame.patch({
      momentsLeft:0,
      acted:true,
      usedActions:[id],
      trust:s.trust + 1,
      familiarity:s.familiarity + 1,
      lastEvent:id,
      lastOutcome:"fit",
      lastResultText:action.text,
      lastObservationText:"今日はここまでにする。"
    });
    GrayGame.addJournal(action.text);
    if (action.first) GrayGame.addFirst(action.first[0], action.first[1]);
    return action;
  };

  GrayGame.advanceFacility = () => {
    const s = GrayGame.getState();
    GrayGame.patch({
      visit:s.visit + 1,
      acted:false,
      momentsLeft:1,
      usedActions:[],
      lastEvent:"return",
      lastOutcome:"",
      lastResultText:"",
      lastObservationText:""
    });
  };

  GrayGame.canTrial = () => GrayGame.getState().visit >= 3;

  GrayGame.startTrial = () => {
    if (!GrayGame.canTrial()) return false;
    GrayGame.patch({
      mode:"home",
      homeDay:0,
      acted:false,
      momentsLeft:4,
      usedActions:[],
      lastEvent:"trial",
      lastOutcome:"",
      lastResultText:"",
      lastObservationText:"",
      daySummary:""
    });
    GrayGame.addFirst("home", "グレイが家に来た");
    GrayGame.addJournal("今日からトライアル。グレイが家に来た。", "一緒に暮らして 1日目");
    return true;
  };

  function applyPassive(care, skipEnergyDrain=false) {
    return {
      ...care,
      satiety:GrayGame.clamp(care.satiety - 3),
      water:GrayGame.clamp(care.water - 4),
      energy:GrayGame.clamp(care.energy - (skipEnergyDrain ? 0 : 2))
    };
  }

  function spontaneousFirst(actionId, nextCare, counts, s) {
    const candidates = [];
    if (actionId === "feed" && counts.feed >= 2) candidates.push(["meal_wait","食器の音で、こちらを見るようになった"]);
    if (actionId === "walk_home" && counts.walk_home >= 2) candidates.push(["leash_wait","リードを見ると、自分から玄関へ来た"]);
    if (actionId === "quiet" && counts.quiet >= 3) candidates.push(["same_room_sleep","自分から同じ部屋で眠った"]);
    if (actionId === "brush" && counts.brush >= 3) candidates.push(["brush_ok","ブラシを見ても体を固くしなかった"]);
    if (s.homeDay >= 3 && nextCare.calm >= 55) candidates.push(["follow","部屋を移ると、少し遅れてついてきた"]);
    if (nextCare.calm >= 70) candidates.push(["near_rest","足元から少し離れた場所で、自分から伏せた"]);

    for (const [id,label] of candidates) {
      if (GrayGame.addFirst(id,label)) return label;
    }
    return "";
  }

  GrayGame.doHomeAction = (id) => {
    const s = GrayGame.getState();
    if (s.momentsLeft <= 0 || s.usedActions.includes(id)) return null;
    const action = GrayGame.availableHomeActions().find((a) => a.id === id);
    if (!action) return null;

    const c = { ...s.care };
    let next = { ...c };
    let copy = HOME_COPY[id].normal;

    if (id === "feed") {
      copy = c.satiety >= 85 ? HOME_COPY.feed.high : HOME_COPY.feed.normal;
      next.satiety += c.satiety >= 85 ? 6 : 38;
      next.water -= 2;
      next.calm += 2;
    } else if (id === "water") {
      copy = c.water >= 88 ? HOME_COPY.water.high : HOME_COPY.water.normal;
      next.water += c.water >= 88 ? 5 : 42;
    } else if (id === "walk_home") {
      copy = c.energy < 28 ? HOME_COPY.walk_home.tired : HOME_COPY.walk_home.normal;
      next.energy -= c.energy < 28 ? 7 : 20;
      next.water -= 12;
      next.satiety -= 7;
      next.hygiene -= 6;
      next.health += c.energy < 28 ? 0 : 3;
      next.calm += c.energy < 28 ? 2 : 10;
    } else if (id === "brush") {
      copy = c.calm < 35 ? HOME_COPY.brush.tense : HOME_COPY.brush.normal;
      next.hygiene += c.calm < 35 ? 8 : 28;
      next.calm += c.calm < 35 ? 1 : 6;
    } else if (id === "quiet") {
      next.calm += 14;
      next.energy += 7;
    } else if (id === "rest") {
      next.energy += 28;
      next.calm += 7;
    } else if (id === "nose") {
      next.calm += 10;
      next.energy -= 7;
      next.satiety -= 4;
    } else if (id === "training") {
      next.calm += 6;
      next.energy -= 8;
      next.health += 1;
    }

    next = applyPassive(next, id === "rest");
    Object.keys(next).forEach((k) => { next[k] = GrayGame.clamp(next[k]); });

    const counts = { ...s.careCounts, [id]:(s.careCounts[id] || 0) + 1 };
    const first = spontaneousFirst(id, next, counts, s);
    const result = first ? `${copy[0]}\n\n【はじめて】${first}` : copy[0];

    GrayGame.patchCare(next);
    GrayGame.patch({
      momentsLeft:s.momentsLeft - 1,
      acted:s.momentsLeft - 1 <= 0,
      usedActions:[...s.usedActions, id],
      careCounts:counts,
      familiarity:s.familiarity + 1,
      trust:s.trust + (id === "quiet" || id === "rest" ? 1 : 0),
      lastEvent:id,
      lastOutcome:first ? "first" : "care",
      lastResultText:result,
      lastObservationText:copy[1]
    });

    GrayGame.addJournal(result);
    return { action, result, observation:copy[1], first };
  };

  GrayGame.homeTimeLabel = () => {
    const left = GrayGame.getState().momentsLeft;
    return left >= 4 ? "朝" : left === 3 ? "昼" : left === 2 ? "夕方" : left === 1 ? "夜" : "就寝前";
  };

  GrayGame.lowestCareNeed = () => {
    const c = GrayGame.getState().care;
    const names = { satiety:"お腹", water:"水分", energy:"元気", hygiene:"清潔", health:"体調", calm:"安心" };
    const [key,value] = Object.entries(c).sort((a,b) => a[1]-b[1])[0];
    return { key, value, label:names[key] };
  };

  GrayGame.advanceHome = () => {
    const s = GrayGame.getState();
    const c = { ...s.care };
    const weak = [c.satiety,c.water,c.energy,c.hygiene].filter((v) => v < 30).length;
    const summary = weak === 0
      ? "今日は落ち着いて一日を終えた。"
      : weak === 1
        ? "少し気になるところを残して一日を終えた。"
        : "明日は世話の順番を少し変えた方がよさそうだ。";

    const nextCare = {
      satiety:GrayGame.clamp(c.satiety - 12),
      water:GrayGame.clamp(c.water - 15),
      energy:GrayGame.clamp(c.energy + 34),
      hygiene:GrayGame.clamp(c.hygiene - 3),
      health:GrayGame.clamp(c.health + (weak === 0 ? 2 : weak >= 2 ? -6 : -1)),
      calm:GrayGame.clamp(c.calm + (weak === 0 ? 3 : -3))
    };

    GrayGame.patchCare(nextCare);
    GrayGame.patch({
      homeDay:s.homeDay + 1,
      acted:false,
      momentsLeft:4,
      usedActions:[],
      lastEvent:"new_day",
      lastOutcome:"",
      lastResultText:"",
      lastObservationText:"",
      daySummary:summary
    });
    GrayGame.addJournal(summary, `一緒に暮らして ${s.homeDay + 1}日目・夜`);
  };
})();