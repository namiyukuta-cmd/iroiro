window.GrayGame = window.GrayGame || {};

(() => {
  const FACILITY_ACTIONS = [
    { id:'observe', label:'少し離れて見る', minVisit:1, result:'急がず、その場でグレイを見ています。しばらくして、グレイの耳が一度だけこちらへ向きました。', observation:'視線は合いません。ただ、こちらの位置は分かっているようです。', trust:1, familiarity:1, first:['ear','初めて、こちらへ耳を向けた'] },
    { id:'sit', label:'近くに座る', minVisit:1, result:'少し距離を残して腰を下ろします。グレイは動きません。けれど、席を立つまでその場にいました。', observation:'離れてはいきません。体の力が抜けるまで、少し時間がかかっています。', trust:1, familiarity:2, first:['same_space','初めて、近くで一緒に過ごした'] },
    { id:'staff', label:'スタッフに聞く', minVisit:1, result:'スタッフから、グレイは嫌なことも我慢してしまうと聞きました。反応が薄い時ほど、急がない方がよさそうです。', observation:'今日は何かをさせるより、様子を見る方がよさそうです。', trust:0, familiarity:1, first:['learn','グレイの「我慢する癖」を知った'] },
    { id:'snack', label:'おやつを置く', minVisit:2, result:'手渡しはせず、少し離れた場所に置きます。すぐには動きません。帰り際、振り返るとおやつはなくなっていました。', observation:'人の手からではなくても、こちらが置いたものを食べられました。', trust:2, familiarity:1, first:['snack','初めて、置いたおやつを食べた'] },
    { id:'hand', label:'手の匂いを嗅いでもらう', minVisit:3, result:'手を低い位置で止めて待ちます。グレイは少しだけ首を伸ばし、短く匂いを確かめてから元の姿勢へ戻りました。', observation:'逃げずに、自分から確認しました。ほんの数秒でした。', trust:3, familiarity:2, first:['scent','初めて、手の匂いを確かめた'] },
    { id:'walk', label:'一緒に散歩する', minVisit:4, result:'スタッフと一緒に外へ出ます。最初は半歩後ろでしたが、帰り道では同じくらいの位置を歩きました。', observation:'外では周囲をよく見ています。こちらの歩幅にも少し合わせています。', trust:4, familiarity:3, first:['walk','初めて、一緒に散歩した'] },
    { id:'touch', label:'背中に少し触れる', minVisit:5, result:'手を見せてから、肩より後ろへ一度だけ触れます。グレイは固まりませんでした。触れた手を離すと、こちらを一度見ました。', observation:'「耐えた」というより、今日はそのままでいられたように見えます。', trust:5, familiarity:3, first:['touch','初めて、力まずに触れさせてくれた'] }
  ];

  const PREP_ITEMS = [
    { id:'bed', label:'大きな寝床', text:'体を伸ばせる大きさのベッドを用意した。' },
    { id:'mat', label:'滑り止めマット', text:'滑りやすい床にマットを敷いた。' },
    { id:'bowl', label:'食器と水入れ', text:'大型犬用の食器と、倒れにくい水入れを用意した。' },
    { id:'gate', label:'落ち着ける区画', text:'来客から離れて休める場所を作った。' },
    { id:'vet', label:'動物病院を確認', text:'通える動物病院と移動手段を確認した。' },
    { id:'route', label:'散歩道を確認', text:'静かな散歩コースを歩いて確認した。' }
  ];

  const HOME_ACTIONS = [
    { id:'quiet', label:'そっとしておく', text:'同じ部屋にいながら、グレイには何も求めず過ごしました。', obs:'少し離れた場所で横になっています。眠りは浅いようです。', first:['rest_home','初めて、この家で横になった'] },
    { id:'meal', label:'ごはんを出す', text:'決まった場所にごはんを置き、少し離れて待ちました。しばらくして食べ始めます。', obs:'食べ終えたあとも、すぐには隅へ戻りませんでした。', first:['meal_home','初めて、この家でごはんを食べた'] },
    { id:'walk_home', label:'短く散歩する', text:'家の周りを短く歩きました。玄関へ戻ると、グレイは足を止めましたが、そのあと自分から中へ入りました。', obs:'帰る場所として玄関を覚え始めています。', first:['return_home','初めて、自分から家へ戻った'] },
    { id:'sit_home', label:'床に座って過ごす', text:'床に座って静かに過ごします。しばらくして、グレイは前より少し近い場所で伏せました。', obs:'近くにいても、休める時間が少しずつ伸びています。', first:['near_home','初めて、自分から近い場所で休んだ'] }
  ];

  GrayGame.data = { FACILITY_ACTIONS, PREP_ITEMS, HOME_ACTIONS };

  GrayGame.availableFacilityActions = () => {
    const s = GrayGame.getState();
    return FACILITY_ACTIONS.filter(a => a.minVisit <= s.visit);
  };

  GrayGame.doFacilityAction = (id) => {
    const s = GrayGame.getState();
    if (s.acted) return null;
    const action = FACILITY_ACTIONS.find(a => a.id === id && a.minVisit <= s.visit);
    if (!action) return null;
    GrayGame.patch({ acted:true, trust:s.trust + action.trust, familiarity:s.familiarity + action.familiarity, lastEvent:action.id });
    GrayGame.addJournal(action.result);
    if (action.first) GrayGame.addFirst(action.first[0], action.first[1]);
    return action;
  };

  GrayGame.advanceFacility = () => {
    const s = GrayGame.getState();
    GrayGame.patch({ visit:s.visit + 1, acted:false, lastEvent:'return' });
  };

  GrayGame.canTrial = () => {
    const s = GrayGame.getState();
    return s.visit >= 6 && s.prep.length >= 4 && s.trust >= 8;
  };

  GrayGame.startTrial = () => {
    if (!GrayGame.canTrial()) return false;
    GrayGame.patch({ mode:'home', homeDay:0, acted:false, lastEvent:'trial' });
    GrayGame.addFirst('home', 'グレイが家に来た');
    GrayGame.addJournal('今日からトライアル。グレイが家に来た。', '一緒に暮らして 1日目');
    return true;
  };

  GrayGame.doHomeAction = (id) => {
    const s = GrayGame.getState();
    if (s.acted) return null;
    const action = HOME_ACTIONS.find(a => a.id === id);
    if (!action) return null;
    GrayGame.patch({ acted:true, trust:s.trust + 1, familiarity:s.familiarity + 2, lastEvent:id });
    GrayGame.addJournal(action.text);
    if (action.first) GrayGame.addFirst(action.first[0], action.first[1]);
    return action;
  };

  GrayGame.advanceHome = () => {
    const s = GrayGame.getState();
    GrayGame.patch({ homeDay:s.homeDay + 1, acted:false, lastEvent:'new_day' });
  };
})();