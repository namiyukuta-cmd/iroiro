(() => {
  "use strict";
  window.HMW = window.HMW || {};
  const H = window.HMW;

  const JOBS = Object.freeze({
    casual_unloading: Object.freeze({
      id: "casual_unloading",
      name: "荷下ろしの小仕事",
      source: "駅前",
      legitimate: true,
      referral: false,
      description: "書類不要の当日仕事。序盤の現金収入になる。"
    }),
    clerk_cleanup: Object.freeze({
      id: "clerk_cleanup",
      name: "店舗裏の清掃",
      source: "コンビニ",
      legitimate: true,
      referral: false,
      description: "店との信用から生まれる継続仕事。"
    }),
    recycler_sort: Object.freeze({
      id: "recycler_sort",
      name: "回収所の仕分け",
      source: "回収所",
      legitimate: true,
      referral: false,
      description: "持ち込み実績から仕事へつながる。"
    }),
    warehouse_day: Object.freeze({
      id: "warehouse_day",
      name: "倉庫の日雇い",
      source: "労働窓口",
      legitimate: true,
      referral: true,
      requiredVerifiedDays: 0,
      description: "支援経由の正式な日雇い。伝票を見て箱を揃える。"
    }),
    delivery_sort: Object.freeze({
      id: "delivery_sort",
      name: "配送所の仕分け",
      source: "労働窓口",
      legitimate: true,
      referral: true,
      requiredVerifiedDays: 10,
      description: "勤務実績10日で紹介。荷物を配送先ごとに仕分ける。"
    }),
    hotel_linen: Object.freeze({
      id: "hotel_linen",
      name: "ホテルのリネン作業",
      source: "労働窓口",
      legitimate: true,
      referral: true,
      requiredVerifiedDays: 15,
      description: "勤務実績15日で紹介。シーツやタオルを種類ごとにまとめる。"
    })
  });

  const freshRecord = () => ({
    days: 0,
    earnings: 0,
    perfectDays: 0,
    lastDay: 0,
    lastPay: 0,
    bestScore: 0,
    bestRounds: 0
  });

  function parsePay(text) {
    const matches = [...String(text || "").matchAll(/(\d+)円/g)];
    if (!matches.length) return 0;
    return Number(matches[matches.length - 1][1]) || 0;
  }

  function jobFromHistory(text) {
    const t = String(text || "");
    if (/荷下ろし/.test(t) && /円/.test(t)) return "casual_unloading";
    if (/コンビニ/.test(t) && /清掃/.test(t) && /円/.test(t)) return "clerk_cleanup";
    if (/回収所/.test(t) && /仕分け/.test(t) && /円/.test(t)) return "recycler_sort";
    if (/倉庫/.test(t) && /(勤務|日雇い)/.test(t) && /円/.test(t)) return "warehouse_day";
    return null;
  }

  H.ensureJobProgress = () => {
    const progression = H.state.progression || (H.state.progression = {});
    const jobs = progression.jobs || (progression.jobs = {});
    jobs.version = 1;
    jobs.verifiedWorkDays = Number(jobs.verifiedWorkDays) || 0;
    jobs.totalEarnings = Number(jobs.totalEarnings) || 0;
    jobs.reliability = Number(jobs.reliability) || 0;
    jobs.records = jobs.records || {};
    Object.keys(JOBS).forEach((id) => {
      jobs.records[id] = { ...freshRecord(), ...(jobs.records[id] || {}) };
    });

    if ((Number(jobs.historyBackfillVersion) || 0) < 1) {
      const seen = {};
      Object.keys(JOBS).forEach((id) => { seen[id] = freshRecord(); });

      (H.state.history || []).forEach((line) => {
        const id = jobFromHistory(line);
        if (!id) return;
        const record = seen[id];
        const pay = parsePay(line);
        record.days += 1;
        record.earnings += pay;
        record.lastPay = pay || record.lastPay;
        if (/ミス0回|6\/6正解|5\/5/.test(line)) record.perfectDays += 1;
      });

      const recognizedDays = Object.values(seen).reduce((sum, r) => sum + r.days, 0);
      const recognizedEarnings = Object.values(seen).reduce((sum, r) => sum + r.earnings, 0);
      Object.keys(seen).forEach((id) => {
        if (!seen[id].days) return;
        jobs.records[id] = { ...jobs.records[id], ...seen[id] };
      });
      jobs.verifiedWorkDays = Math.max(jobs.verifiedWorkDays, recognizedDays);
      jobs.totalEarnings = Math.max(jobs.totalEarnings, recognizedEarnings);
      jobs.historyBackfillVersion = 1;
    }
    return jobs;
  };

  H.getJob = (id) => JOBS[id] || null;

  H.getJobUnlock = (id) => {
    const job = JOBS[id];
    const jobs = H.ensureJobProgress();
    if (!job) return { unlocked: false, reason: "不明な仕事" };
    if (job.referral && !H.state.progression.support?.workAccess) {
      return { unlocked: false, reason: "正式な仕事紹介がまだ使えない" };
    }
    const need = Number(job.requiredVerifiedDays) || 0;
    if (jobs.verifiedWorkDays < need) {
      return { unlocked: false, reason: `勤務実績 ${jobs.verifiedWorkDays}/${need}日` };
    }
    return { unlocked: true, reason: "紹介可能" };
  };

  H.canTakeJob = (id) => {
    const unlock = H.getJobUnlock(id);
    if (!unlock.unlocked) return unlock;
    if (H.state.slot === 3) return { unlocked: true, available: false, reason: "深夜は受付終了" };
    if (H.state.daily?.jobs?.[id]) return { unlocked: true, available: false, reason: "今日は勤務済み" };
    const s = H.state.stats || {};
    if ((Number(s.health) || 0) < 40) return { unlocked: true, available: false, reason: "体力40以上が必要" };
    if ((Number(s.fatigue) || 0) > 75) return { unlocked: true, available: false, reason: "疲労75以下が必要" };
    if ((Number(s.hygiene) || 0) < 25) return { unlocked: true, available: false, reason: "衛生25以上が必要" };
    if ((Number(s.hunger) || 0) > 82) return { unlocked: true, available: false, reason: "空腹82以下が必要" };
    return { unlocked: true, available: true, reason: "勤務可能" };
  };

  H.recordJobResult = (id, result = {}) => {
    const job = JOBS[id];
    if (!job) return null;
    const jobs = H.ensureJobProgress();
    const record = jobs.records[id] || (jobs.records[id] = freshRecord());
    const pay = Math.max(0, Math.floor(Number(result.pay) || 0));
    const score = Math.max(0, Number(result.score) || 0);
    const rounds = Math.max(0, Number(result.rounds) || 0);
    const perfect = rounds > 0 ? score >= rounds : Number(result.mistakes) === 0;

    record.days += 1;
    record.earnings += pay;
    record.lastDay = H.state.day;
    record.lastPay = pay;
    if (rounds > 0 && (record.bestRounds === 0 || score / rounds > record.bestScore / record.bestRounds)) {
      record.bestScore = score;
      record.bestRounds = rounds;
    }
    if (perfect) record.perfectDays += 1;

    jobs.totalEarnings += pay;
    if (job.legitimate) {
      jobs.verifiedWorkDays += 1;
      H.state.progression.stability.paidWorkDays += 1;
      jobs.reliability += perfect ? 2 : 1;
    }
    H.state.progression.stability.regularIncome = true;
    H.state.daily.jobs = H.state.daily.jobs || {};
    H.state.daily.jobs[id] = true;
    return { job, record, jobs };
  };

  H.getLaborOfficeOffers = () => Object.values(JOBS)
    .filter((job) => job.referral)
    .map((job) => ({ ...job, status: H.getJobUnlock(job.id), availability: H.canTakeJob(job.id) }));

  H.getNextJobReferral = () => {
    const jobs = H.ensureJobProgress();
    const next = Object.values(JOBS)
      .filter((job) => job.referral && (Number(job.requiredVerifiedDays) || 0) > jobs.verifiedWorkDays)
      .sort((a, b) => a.requiredVerifiedDays - b.requiredVerifiedDays)[0];
    return next || null;
  };

  H.getJobSummary = () => {
    const jobs = H.ensureJobProgress();
    const next = H.getNextJobReferral();
    return {
      verifiedWorkDays: jobs.verifiedWorkDays,
      totalEarnings: jobs.totalEarnings,
      reliability: jobs.reliability,
      nextReferral: next ? {
        id: next.id,
        name: next.name,
        requiredDays: next.requiredVerifiedDays,
        remainingDays: Math.max(0, next.requiredVerifiedDays - jobs.verifiedWorkDays)
      } : null,
      records: jobs.records
    };
  };
})();