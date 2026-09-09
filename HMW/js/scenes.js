(() => {
  "use strict";
  const H = window.HMW;
  const G = H.Game;
  const { rel, unlock, changeStats } = G;

  function seen(id) { return !!H.state.story.seen[id]; }
  function mark(id) { H.state.story.seen[id] = true; }
  function dailySeen(id) { return !!H.state.daily.sceneKeys[id]; }
  function markDaily(id) { H.state.daily.sceneKeys[id] = true; }

  const scenes = [
    {
      id: "station_morning_work",
      title: "駅の搬入口",
      when: () => H.state.location === "station_front" && H.state.day === 1 && H.state.slot === 0 && !seen("station_morning_work"),
      text: "駅ビルの搬入口で、台車を押す人が何度も出入りしている。脇の紙には『当日手伝い・現金払い・欠員時のみ』とある。毎日ある仕事ではなさそうだ。",
      actions: [
        {
          label: "募集の出し方を覚えておく",
          run: () => {
            H.state.progression.informal.casualWorkKnown = true;
            H.addLead("casual_work", "駅前で今日の小仕事を確認する");
            mark("station_morning_work");
            H.addHistory("駅前の搬入口で、書類なしの当日仕事が出る場所を覚えた。");
            G.refresh();
          }
        },
        {
          label: "今は通り過ぎる",
          run: () => { mark("station_morning_work"); H.addHistory("搬入口の様子だけ覚えて、その場を離れた。"); G.refresh(); }
        }
      ]
    },
    {
      id: "station_police_first",
      title: "通勤客の流れの向こう",
      when: () => H.state.location === "station_front" && H.state.slot >= 1 && !seen("station_police_first"),
      text: "制服の警官が駅前を見回っている。こちらを特別に追っているわけではないが、一度だけ視線が止まる。同じ街にいれば、また顔を合わせるだろう。",
      actions: [
        {
          label: "目が合った時だけ会釈する",
          run: () => {
            rel("police_named").familiarity += 1;
            mark("station_police_first");
            H.addHistory("駅前の警官と一度だけ目が合い、会釈だけ交わした。");
            G.refresh();
          }
        },
        { label: "関わらずにいる", run: () => { mark("station_police_first"); G.refresh(); } }
      ]
    },
    {
      id: "park_homeless_first",
      title: "同じ場所を使う人",
      when: () => H.state.location === "park" && H.state.slot >= 2 && !seen("park_homeless_first"),
      text: "ベンチの端に、ここをよく使っているらしいホームレスがいる。荷物の置き方から、この辺りの夜を知っている人だと分かる。こちらを助ける理由はまだない。",
      actions: [
        {
          label: "少し離れた場所に座る",
          run: () => {
            rel("homeless_named").familiarity += 1;
            mark("park_homeless_first");
            H.addHistory("同じ公園を使うホームレスと、互いの顔を覚える程度の距離で過ごした。");
            G.refresh();
          }
        },
        { label: "今日は近づかない", run: () => { mark("park_homeless_first"); G.refresh(); } }
      ]
    },
    {
      id: "charity_support_first",
      title: "受付の名札",
      when: () => H.state.location === "charity_center" && H.state.slot !== 3 && !seen("charity_support_first"),
      text: "受付の支援員が、来所者の名前と相談内容を一件ずつ記録している。食事を受け取るだけの人と、継続相談をする人では、その後の動きが違うらしい。",
      actions: [
        {
          label: "相談の流れだけ聞く",
          run: () => {
            rel("support_named").familiarity += 1;
            mark("charity_support_first");
            H.addHistory("支援員から、継続相談は日をまたいで手続きを進めるものだと聞いた。");
            G.refresh();
          }
        },
        {
          label: "そのまま相談を始める",
          run: () => { mark("charity_support_first"); G.refresh(); G.supportConsult(); }
        }
      ]
    },
    {
      id: "convenience_clerk_first",
      title: "レジの向こう",
      when: () => H.state.location === "convenience_store" && !seen("convenience_clerk_first"),
      text: "店員は忙しく、こちらだけを気にしてはいない。ただ、毎日同じ店を使えば顔は覚えられる。店の裏では段ボールと清掃道具が積まれている。",
      actions: [
        {
          label: "普通の客として挨拶する",
          run: () => {
            rel("clerk").familiarity += 1;
            H.state.progression.clerk.visits += 1;
            mark("convenience_clerk_first");
            H.addHistory("店員に短く挨拶した。特別扱いはないが、最初の面識ができた。");
            G.refresh();
          }
        },
        { label: "棚だけ見て出る", run: () => { mark("convenience_clerk_first"); G.refresh(); } }
      ]
    },
    {
      id: "recycler_first",
      title: "計量台",
      when: () => H.state.location === "recycling_yard" && !seen("recycler_first"),
      text: "回収所では、持ち込まれた缶や金属片を種類ごとに分けて計量している。常連らしい人は、作業員と短く言葉を交わしている。",
      actions: [
        {
          label: "買い取る物を聞く",
          run: () => {
            rel("recycler").familiarity += 1;
            unlock("industrial_street", "金属片が出やすい工業通りの場所を聞いた。");
            mark("recycler_first");
            H.addHistory("回収所で買い取る物と、金属片が出やすい場所を聞いた。");
            G.refresh();
          }
        },
        { label: "計量の様子を見る", run: () => { mark("recycler_first"); G.refresh(); } }
      ]
    },
    {
      id: "industrial_thug_first",
      title: "閉まったシャッターの前",
      when: () => H.state.location === "industrial_street" && H.state.slot >= 2 && !seen("industrial_thug_first"),
      text: "閉まった倉庫の前に、近所の作業員とは雰囲気の違う人物がいる。こちらが廃品を探しているのを見ても何も言わない。目だけが動く。",
      actions: [
        {
          label: "視線だけ返して通る",
          run: () => {
            rel("thug_named").familiarity += 1;
            H.state.progression.thug.familiarity = rel("thug_named").familiarity;
            mark("industrial_thug_first");
            H.addHistory("工業通りの不良と、言葉を交わさないまま互いの顔を覚えた。");
            G.refresh();
          }
        },
        { label: "別の通りへ回る", run: () => { mark("industrial_thug_first"); G.refresh(); } }
      ]
    },
    {
      id: "rain_awning",
      title: "雨脚が強くなる",
      when: () => ["shopping_street", "convenience_store"].includes(H.state.location) && H.state.world.weather === "rain" && !dailySeen("rain_awning"),
      text: "急に雨脚が強くなり、通りの人が軒下へ寄る。店先の庇なら少しだけ濡れを落ち着かせられる。",
      actions: [
        {
          label: "軒下で雨脚が弱まるのを待つ",
          run: () => {
            changeStats({ wetness: -8, warmth: 2 });
            markDaily("rain_awning");
            H.addHistory("軒下で雨脚をやり過ごし、濡れを少し乾かした。");
            G.refresh();
          }
        },
        { label: "そのまま行く", run: () => { markDaily("rain_awning"); G.refresh(); } }
      ]
    },
    {
      id: "support_followup",
      title: "前回のメモ",
      when: () => H.state.location === "charity_center" && H.state.progression.support.stage >= 2 && rel("support_named").trust >= 2 && !seen("support_followup"),
      text: "支援員は前回の相談記録を開き、こちらが何を優先したかを確認してから話を始める。毎回ゼロから説明し直す必要はない。",
      actions: [
        {
          label: "前回から変わったことを伝える",
          run: () => {
            rel("support_named").trust += 1;
            H.state.progression.stability.supportBase = true;
            mark("support_followup");
            H.addHistory("前回から変わったことを伝え、相談記録に追加してもらった。");
            G.refresh();
          }
        }
      ]
    }
  ];

  function getCityScene() {
    return scenes.find((scene) => scene.when()) || null;
  }

  Object.assign(G, { getCityScene });
})();