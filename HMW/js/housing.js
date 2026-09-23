(() => {
  "use strict";
  window.HMW = window.HMW || {};
  const H = window.HMW;

  const HOUSING_TYPES = Object.freeze([
    {
      id: "street_base",
      name: "野宿拠点",
      examples: ["段ボールハウス", "テント"],
      category: "street",
      support: "基本は支援外。認められた敷地や屋根付き区画を使う場合のみ支援ルートにできる。",
      duration: "不定",
      privacy: "低い",
      description: "家賃はほぼ不要だが、安全・衛生・立ち退きの不安が大きい。正式な住居ではない。",
      questRoute: false
    },
    {
      id: "vehicle_dwelling",
      name: "車上生活",
      examples: ["乗用車", "バン", "キャンピングカー", "セーフパーキング"],
      category: "vehicle",
      support: "車そのものは原則自力。支援団体の安全な駐車場所を使うルートはあり得る。",
      duration: "不定",
      privacy: "中",
      description: "寝場所を移動できるが、車両入手費・維持費・燃料などが必要。現在は将来拡張ルート。",
      questRoute: false
    },
    {
      id: "emergency_shelter",
      name: "緊急シェルター",
      examples: ["1泊紹介", "生理中の短期連泊"],
      category: "support",
      support: "支援センター経由",
      duration: "1泊〜数日",
      privacy: "低〜中",
      description: "急場を安全に越えるための宿泊先。長期住居とは別枠。",
      questRoute: false
    },
    {
      id: "dormitory",
      name: "簡易宿舎・ドミトリー",
      examples: ["相部屋", "ベッド単位の宿泊"],
      category: "support",
      support: "支援あり／低額利用",
      duration: "数日〜数週間",
      privacy: "低",
      description: "シェルターより長く滞在できる共同宿泊。門限や生活ルールがある場合がある。",
      questRoute: false
    },
    {
      id: "transitional_housing",
      name: "移行住宅",
      examples: ["支援付き個室", "短期の小部屋"],
      category: "support",
      support: "支援センター経由",
      duration: "数週間〜数か月",
      privacy: "中〜高",
      description: "仕事を始めたが普通の賃貸にはまだ届かない段階の住居。生活基盤づくりと並行して使う。",
      questRoute: true,
      requirements: [
        { key: "supportStage", label: "支援相談", target: 5 },
        { key: "paidWorkDays", label: "勤務日数", target: 2 },
        { key: "money", label: "所持金", target: 3000, unit: "円" }
      ]
    },
    {
      id: "sro_shared",
      name: "SRO・シェアハウス",
      examples: ["鍵付き小個室", "台所・浴室共用", "共同住宅"],
      category: "independent",
      support: "民間中心。保証や紹介のみ支援を使う場合がある。",
      duration: "中〜長期",
      privacy: "高",
      description: "普通の賃貸より初期費用を抑えやすい。一般の主人公には「グループホーム」よりこちらが自然。",
      questRoute: true,
      requirements: [
        { key: "housingConsultation", label: "住居相談", target: 1 },
        { key: "paidWorkDays", label: "勤務日数", target: 5 },
        { key: "regularIncome", label: "継続収入", target: 1 },
        { key: "money", label: "所持金", target: 20000, unit: "円" }
      ]
    },
    {
      id: "rental",
      name: "普通の賃貸",
      examples: ["ワンルーム", "小さなアパート"],
      category: "independent",
      support: "原則自力。物件紹介や初期費用支援が入る場合はある。",
      duration: "長期",
      privacy: "高",
      description: "最終的な自立住居。継続収入とまとまった初期費用が必要。",
      questRoute: true,
      requirements: [
        { key: "housingConsultation", label: "住居相談", target: 1 },
        { key: "paidWorkDays", label: "勤務日数", target: 10 },
        { key: "regularIncome", label: "継続収入", target: 1 },
        { key: "money", label: "所持金", target: 50000, unit: "円" }
      ]
    }
  ]);

  const getValue = (key) => {
    const s = H.state || {};
    const p = s.progression || {};
    if (key === "supportStage") return Number(p.support?.stage) || 0;
    if (key === "housingConsultation") return p.support?.housingConsultation ? 1 : 0;
    if (key === "paidWorkDays") {
      const verified = Number(p.jobs?.verifiedWorkDays);
      return Number.isFinite(verified) ? verified : (Number(p.stability?.paidWorkDays) || 0);
    }
    if (key === "regularIncome") return p.stability?.regularIncome ? 1 : 0;
    if (key === "money") return Number(s.money) || 0;
    return 0;
  };

  const requirementStatus = (req) => {
    const value = getValue(req.key);
    return {
      ...req,
      value,
      met: value >= req.target,
      text: req.key === "regularIncome" || req.key === "housingConsultation"
        ? `${req.label}：${value >= req.target ? "済" : "未"}`
        : `${req.label}：${value}/${req.target}${req.unit || ""}`
    };
  };

  H.HOUSING_TYPES = HOUSING_TYPES;

  H.getHousingProgress = () => {
    const housingState = H.state?.progression?.housing || {};
    return HOUSING_TYPES.map((type) => {
      const requirements = (type.requirements || []).map(requirementStatus);
      return {
        ...type,
        requirements,
        unlocked: type.questRoute ? requirements.every((x) => x.met) : false,
        current: housingState.current === type.id
      };
    });
  };

  H.getNextHousingGoal = () => {
    const housingState = H.state?.progression?.housing || {};
    const routes = H.getHousingProgress().filter((x) => x.questRoute);
    const targetId = housingState.target;
    const explicit = routes.find((x) => x.id === targetId);
    if (explicit && !explicit.unlocked) return explicit;
    return routes.find((x) => !x.unlocked) || routes[routes.length - 1] || null;
  };

  H.getHousingGoalText = () => {
    const goal = H.getNextHousingGoal();
    if (!goal) return "住居目標：未設定";
    const unmet = goal.requirements.filter((x) => !x.met);
    if (!unmet.length) return `住居目標：${goal.name}　条件達成`;
    return `住居目標：${goal.name}　${unmet.map((x) => x.text).join("・")}`;
  };
})();