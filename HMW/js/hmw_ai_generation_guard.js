(() => {
  "use strict";
  window.HMW = window.HMW || {};
  const H = window.HMW;

  const REQUIRED_FIELDS = Object.freeze([
    "characterId",
    "turnId",
    "sourceSaveSha",
    "psychologyRead",
    "psychologyUpdated",
    "directiveGenerated",
    "beforePsychology",
    "psychologyChanges",
    "afterPsychology",
    "directive",
    "psychologyHistorySaved",
    "stateSaved",
    "saveCommitSha"
  ]);

  H.ROMANCE_GENERATION_GUARD = Object.freeze({
    version: 1,
    required: true,
    scope: "HMWの恋愛相手（サム、アーロン、マーク、レオン）のAI回答生成",
    sourceOfTruth: "private-game-data/HMW/saves/slot1.json と iroiro/HMW/js 以下の現在ファイル",
    coreRule: "恋愛相手の本文を先に生成してはいけない。現在セーブとJSを実際に確認し、psychology更新・行動判定・保存を完了したターンだけ回答を有効とする。",
    requiredOrder: Object.freeze([
      "現在のprivate-game-dataセーブを取得し、sourceSaveShaを確定する",
      "対象キャラクターのcharacter・behavior・romance rules・psychology parameters・現在psychology・psychologyHistory・state.historyを読む",
      "主人公の今回入力によるpsychologyChangesを計算する",
      "beforePsychology + psychologyChanges から afterPsychology を確定する",
      "更新後psychologyで stage / seekHeroine / approach / intimacy / kissImpulse / embraceImpulse / jealousy等を評価し、directiveを確定する",
      "更新後psychologyとpsychologyHistoryをセーブへ保存する",
      "ここまで完了してから初めて恋愛相手の本文を生成する",
      "生成した恋愛相手の実行動をactualNpcActionとして記録し、必要ならpsychologyHistoryへ追記して保存する",
      "ユーザーに、確認可能な監査情報を短く表示する"
    ]),
    invalidIf: Object.freeze([
      "GitHubの現在セーブを取得せず、会話記憶や要約だけで恋愛相手を生成した",
      "psychologyを読む前に台詞や行動を考えた",
      "psychologyChangesを作らず、雰囲気だけで回答した",
      "更新後psychologyを確定せず回答した",
      "directiveを作らず回答した",
      "psychologyHistoryまたはセーブ保存を飛ばした",
      "『確認した』『保存した』と述べたが対応するGitHub取得・書込結果が存在しない"
    ]),
    protagonistAgency: "主人公の台詞・心理・身体反応・受諾・拒絶をAIが補完しない。NPC側の接近・抱擁の試み・キスの試み・引き止め・嫉妬・関係確認はdirectiveに従ってNPC自身の行動として生成できる。",
    antiStall: "恋愛段階と更新後psychologyが接近を要求しているのに、AI都合で雑談・無難な友人対応だけへ落としてはいけない。stage5以上かつ明確な拒絶がなく、directiveがromantic_approach以上なら、本文に対応する自発的恋愛行動を必ず含める。",
    auditDisplay: Object.freeze([
      "sourceSaveSha",
      "主要psychology before→after",
      "directive",
      "saveCommitSha"
    ]),
    trustRule: "AIの自己申告を証拠にしない。監査項目とGitHub書込結果が揃っているかで有効性を判断する。"
  });

  H.createRomanceGenerationAudit = (characterId, turnId = "") => ({
    guardVersion: H.ROMANCE_GENERATION_GUARD.version,
    characterId: characterId || "",
    turnId: turnId || "",
    sourceSaveSha: "",
    psychologyRead: false,
    psychologyUpdated: false,
    directiveGenerated: false,
    beforePsychology: null,
    psychologyChanges: null,
    afterPsychology: null,
    directive: null,
    psychologyHistorySaved: false,
    stateSaved: false,
    saveCommitSha: "",
    actualNpcAction: null,
    valid: false
  });

  H.validateRomanceGenerationAudit = (audit) => {
    const a = audit || {};
    const missing = REQUIRED_FIELDS.filter((key) => {
      if (!(key in a)) return true;
      if (["psychologyRead","psychologyUpdated","directiveGenerated","psychologyHistorySaved","stateSaved"].includes(key)) {
        return a[key] !== true;
      }
      if (["sourceSaveSha","saveCommitSha","characterId","turnId"].includes(key)) return !String(a[key] || "").trim();
      return a[key] == null;
    });
    return {
      valid: missing.length === 0,
      missing,
      rule: missing.length ? "恋愛相手本文は無効。必要処理を完了してから生成し直す。" : "恋愛相手本文を生成可能。"
    };
  };
})();