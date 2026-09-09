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

  function dailyKey(location) { return `daily_city_${location}`; }

  function finishDaily(location, text) {
    markDaily(dailyKey(location));
    if (text) H.addHistory(text);
    G.refresh();
  }

  function dailyVariant(location, count) {
    return G.random(`daily-city-${location}-${H.state.day}`, 0, count - 1);
  }

  function getDailyCityScene() {
    if (H.state.day < 2) return null;
    const id = H.state.location;
    if (!H.state.daily?.sceneKeys || dailySeen(dailyKey(id))) return null;

    if (id === "station_front") {
      const variant = dailyVariant(id, 3);
      if (variant === 0) {
        return {
          id: "daily_station_coin",
          title: "自販機の下",
          text: "自販機の下に50円玉が一枚落ちている。周囲に探している人はいない。",
          actions: [
            {
              label: "拾っておく",
              run: () => {
                H.state.money += 50;
                finishDaily(id, "駅前の自販機の下で50円を拾った。");
              }
            },
            {
              label: "交番へ届ける",
              run: () => {
                rel("police_named").goodwill += 1;
                finishDaily(id, "拾った50円を交番へ届けた。警官側にはその行動が残った。");
              }
            }
          ]
        };
      }
      if (variant === 1) {
        return {
          id: "daily_station_shortage",
          title: "搬入口で一人足りない",
          text: "駅ビルの搬入口で、作業員が『今日だけ一人足りない』と話している。今なら当日の手伝いに入れそうだ。",
          actions: [
            {
              label: "仕事のことを聞く",
              run: () => {
                H.state.progression.informal.casualWorkKnown = true;
                H.state.daily.casualChecked = true;
                H.state.daily.casualOffer = true;
                H.addLead("casual_work", "駅前で今日の小仕事をする");
                finishDaily(id, "搬入口で今日の荷下ろし手伝いが一件あると聞いた。");
              }
            },
            { label: "今日は見送る", run: () => finishDaily(id, "搬入口の欠員募集は今日は見送った。") }
          ]
        };
      }
      return {
        id: "daily_station_jobsheet",
        title: "無料求人紙の束",
        text: "ベンチ脇のラックに無料求人紙が補充されている。日雇い窓口の場所と受付条件が載っている。",
        actions: [
          {
            label: "必要なところだけ読む",
            run: () => {
              unlock("labor_office", "求人紙で労働窓口の場所を確認した。");
              H.addLead("labor_office_info", "労働窓口で仕事の条件を確認する");
              finishDaily(id, "無料求人紙から労働窓口の場所と受付条件を確認した。");
            }
          },
          { label: "今は読まない", run: () => finishDaily(id, "無料求人紙には手を伸ばさなかった。") }
        ]
      };
    }

    if (id === "park") {
      const variant = dailyVariant(id, 3);
      if (variant === 0) {
        return {
          id: "daily_park_cans",
          title: "清掃のあと",
          text: "清掃で集めきれなかった空き缶が二つ、植え込みの縁に転がっている。",
          actions: [
            {
              label: "回収しておく",
              run: () => {
                H.addItem("aluminum_can", 2);
                finishDaily(id, "公園で空き缶を2本拾った。");
              }
            },
            { label: "そのままにする", run: () => finishDaily(id, "公園の空き缶には手を付けなかった。") }
          ]
        };
      }
      if (variant === 1) {
        return {
          id: "daily_park_water",
          title: "ベンチの未開封ボトル",
          text: "ベンチの端に、封の切られていない水のボトルが一本置き忘れられている。",
          actions: [
            {
              label: "持っていく",
              run: () => {
                H.addItem("bottled_water", 1);
                finishDaily(id, "公園で未開封の水を一本拾った。");
              }
            },
            { label: "置いておく", run: () => finishDaily(id, "置き忘れられた水はそのままにした。") }
          ]
        };
      }
      return {
        id: "daily_park_support_notice",
        title: "掲示板の新しい紙",
        text: "公園の掲示板に、食料と生活相談を受け付ける支援センターの案内が新しく貼られている。",
        actions: [
          {
            label: "場所を確認する",
            run: () => {
              unlock("charity_center", "公園の掲示で支援センターの場所を確認した。");
              H.addLead("support_case", "支援センターへ行ってみる");
              finishDaily(id, "公園の掲示から支援センターの場所を確認した。");
            }
          },
          { label: "今は行かない", run: () => finishDaily(id, "支援センターの案内だけ目に留めた。") }
        ]
      };
    }

    if (id === "underpass") {
      const variant = dailyVariant(id, 3);
      if (variant === 0) {
        return {
          id: "daily_underpass_cardboard",
          title: "乾いた段ボール",
          text: "雨の当たらない柱の陰に、まだ使えそうな乾いた段ボールが一枚残っている。",
          actions: [
            {
              label: "使えるように取っておく",
              run: () => {
                H.addItem("cardboard", 1);
                finishDaily(id, "高架下で乾いた段ボールを一枚確保した。");
              }
            },
            { label: "置いておく", run: () => finishDaily(id, "段ボールはその場に残した。") }
          ]
        };
      }
      if (variant === 1) {
        return {
          id: "daily_underpass_route",
          title: "柱の古い書き込み",
          text: "柱に残った古い書き込みに、河川敷と回収所へ抜ける道順が簡単に記されている。",
          actions: [
            {
              label: "道順を覚える",
              run: () => {
                unlock("riverside", "高架下の書き込みから河川敷への道を知った。");
                unlock("recycling_yard", "高架下の書き込みから回収所への道を知った。");
                H.state.progression.stability.streetNetwork = true;
                finishDaily(id, "高架下から河川敷と回収所へ抜ける道順を覚えた。");
              }
            },
            { label: "気にせず通る", run: () => finishDaily(id, "柱の古い書き込みは読み流した。") }
          ]
        };
      }
      const samKnown = rel("homeless_named").familiarity >= 2;
      return {
        id: "daily_underpass_sleep_tip",
        title: samKnown ? "サムのひと言" : "高架下を使う男のひと言",
        text: samKnown
          ? "サムが、夜に人の出入りが増える入口と、比較的静かな側を短く教える。"
          : "高架下を使っている男が、夜は入口側を避けた方がいいと独り言のように言う。",
        actions: [
          {
            label: "覚えておく",
            run: () => {
              H.state.progression.homelessNetwork.safeSleepAdvice = true;
              H.state.progression.stability.streetNetwork = true;
              if (samKnown) rel("homeless_named").goodwill += 1;
              finishDaily(id, samKnown
                ? "サムから高架下で避ける入口を聞いた。"
                : "高架下で避けた方がいい入口を聞き覚えた。");
            }
          },
          { label: "聞き流す", run: () => finishDaily(id, "高架下の寝場所情報は聞き流した。") }
        ]
      };
    }

    if (id === "shopping_street") {
      const variant = dailyVariant(id, 3);
      if (variant === 0) {
        return {
          id: "daily_shopping_carry",
          title: "店先まであと少し",
          text: "小さな店の人が、重そうな箱を台車から店先へ移している。あと数箱だけらしい。",
          actions: [
            {
              label: "運ぶのを手伝う",
              run: () => {
                H.state.money += 80;
                changeStats({ fatigue: 4 });
                markDaily(dailyKey(id));
                G.advanceTime(1, "店先への荷運びを手伝い、80円を受け取った。");
              }
            },
            { label: "通り過ぎる", run: () => finishDaily(id, "店先の荷運びは手伝わず通り過ぎた。") }
          ]
        };
      }
      if (variant === 1) {
        return {
          id: "daily_shopping_cardboard",
          title: "資源ごみの束",
          text: "店先に『持っていって構いません』と書かれた、畳まれた段ボールの束が置かれている。",
          actions: [
            {
              label: "一枚もらう",
              run: () => {
                H.addItem("cardboard", 1);
                finishDaily(id, "商店街で自由に持ち帰れる段ボールを一枚もらった。");
              }
            },
            { label: "今はいらない", run: () => finishDaily(id, "無料の段ボールは持っていかなかった。") }
          ]
        };
      }
      return {
        id: "daily_shopping_work_notice",
        title: "短時間手伝いの貼り紙",
        text: "店先の掲示に『短時間の片付け・当日相談可』という紙が出ている。毎日募集するわけではなさそうだ。",
        actions: [
          {
            label: "場所を覚えておく",
            run: () => {
              H.state.progression.informal.casualWorkKnown = true;
              H.addLead("casual_work", "駅前や商店街で当日の小仕事を確認する");
              finishDaily(id, "商店街にも短時間の手伝いが出ることを覚えた。");
            }
          },
          { label: "今日は気にしない", run: () => finishDaily(id, "短時間手伝いの貼り紙は見送った。") }
        ]
      };
    }

    if (id === "public_toilet") {
      const variant = dailyVariant(id, 3);
      if (variant === 0) {
        return {
          id: "daily_toilet_cleanup",
          title: "清掃のごみ袋",
          text: "清掃員が、まとめたごみ袋を外の集積場所まで運ぼうとしている。数分で済みそうだ。",
          actions: [
            {
              label: "運ぶのを手伝う",
              run: () => {
                H.state.money += 50;
                changeStats({ fatigue: 3 });
                markDaily(dailyKey(id));
                G.advanceTime(1, "清掃員のごみ運びを手伝い、礼として50円を受け取った。");
              }
            },
            { label: "そのまま出る", run: () => finishDaily(id, "清掃員の作業を横目にそのまま出た。") }
          ]
        };
      }
      if (variant === 1) {
        return {
          id: "daily_toilet_support_card",
          title: "洗面台脇の案内カード",
          text: "洗面台の脇に、食料・洗面・生活相談を受け付ける支援センターの案内カードが置かれている。",
          actions: [
            {
              label: "一枚見る",
              run: () => {
                unlock("charity_center", "案内カードで支援センターの場所を確認した。");
                H.addLead("support_case", "支援センターへ行ってみる");
                finishDaily(id, "公衆トイレの案内カードで支援センターの場所を確認した。");
              }
            },
            { label: "見ない", run: () => finishDaily(id, "案内カードには手を伸ばさなかった。") }
          ]
        };
      }
      return {
        id: "daily_toilet_free_soap",
        title: "無料配布の小さな石けん",
        text: "洗面台脇のかごに『ご自由に一つ』と書かれた小さな石けんがいくつか入っている。",
        actions: [
          {
            label: "一つもらう",
            run: () => {
              H.addItem("soap", 1);
              finishDaily(id, "公衆トイレで無料配布の石けんを一つもらった。");
            }
          },
          { label: "今はいらない", run: () => finishDaily(id, "無料配布の石けんは取らなかった。") }
        ]
      };
    }

    return null;
  }

  function getCityScene() {
    return scenes.find((scene) => scene.when()) || getDailyCityScene();
  }

  Object.assign(G, { getCityScene });
})();
