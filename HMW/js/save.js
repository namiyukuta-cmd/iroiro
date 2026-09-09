(() => {
  "use strict";
  const HMW = window.HMW = window.HMW || {};
  const LOCAL_KEY = "hmw_save_v1";
  const TOKEN_KEYS = ["private_game_github_token_v1", "homedeco_github_token_v1"];
  const OWNER = "namiyukuta-cmd";
  const REPO = "private-game-data";
  const PATH = "HMW/saves/slot1.json";

  const utf8ToBase64 = (text) => {
    const bytes = new TextEncoder().encode(text);
    let binary = "";
    bytes.forEach((b) => { binary += String.fromCharCode(b); });
    return btoa(binary);
  };

  const base64ToUtf8 = (base64) => {
    const binary = atob(base64.replace(/\n/g, ""));
    const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
    return new TextDecoder().decode(bytes);
  };

  const getToken = () => {
    for (const key of TOKEN_KEYS) {
      const token = localStorage.getItem(key);
      if (token) return token;
    }
    return "";
  };

  HMW.saveLocal = () => {
    try {
      localStorage.setItem(LOCAL_KEY, JSON.stringify(HMW.state));
      return true;
    } catch (_) {
      return false;
    }
  };

  HMW.loadLocal = () => {
    try {
      const raw = localStorage.getItem(LOCAL_KEY);
      if (!raw) return false;
      const parsed = JSON.parse(raw);
      if (!parsed || typeof parsed !== "object" || !parsed.stats || !parsed.location) return false;
      HMW.state = parsed;
      return true;
    } catch (_) {
      return false;
    }
  };

  async function githubRequest(method, url, body) {
    const token = getToken();
    if (!token) throw new Error("GitHub token is not registered");
    const response = await fetch(url, {
      method,
      headers: {
        "Accept": "application/vnd.github+json",
        "Authorization": `Bearer ${token}`,
        "X-GitHub-Api-Version": "2022-11-28",
        ...(body ? { "Content-Type": "application/json" } : {})
      },
      body: body ? JSON.stringify(body) : undefined
    });
    if (!response.ok) {
      const text = await response.text();
      throw new Error(`${response.status} ${text}`);
    }
    return response.json();
  }

  HMW.savePrivate = async () => {
    const token = getToken();
    if (!token) return { ok: false, skipped: true };
    const url = `https://api.github.com/repos/${OWNER}/${REPO}/contents/${PATH}`;
    let sha = null;
    try {
      const existing = await githubRequest("GET", url);
      sha = existing.sha || null;
    } catch (error) {
      if (!String(error.message).startsWith("404")) throw error;
    }
    const body = {
      message: `Save HMW DAY${HMW.state.day}`,
      content: utf8ToBase64(JSON.stringify(HMW.state, null, 2)),
      ...(sha ? { sha } : {})
    };
    await githubRequest("PUT", url, body);
    return { ok: true };
  };

  HMW.loadPrivate = async () => {
    const token = getToken();
    if (!token) return { ok: false, skipped: true };
    const url = `https://api.github.com/repos/${OWNER}/${REPO}/contents/${PATH}`;
    try {
      const data = await githubRequest("GET", url);
      const parsed = JSON.parse(base64ToUtf8(data.content || ""));
      if (!parsed || !parsed.stats || !parsed.location) throw new Error("invalid save");
      HMW.state = parsed;
      HMW.saveLocal();
      return { ok: true };
    } catch (error) {
      if (String(error.message).startsWith("404")) return { ok: false, missing: true };
      throw error;
    }
  };

  HMW.saveGame = async () => {
    HMW.saveLocal();
    try {
      const result = await HMW.savePrivate();
      HMW.addHistory(result.ok ? "端末とprivate-game-dataへセーブした。" : "端末にセーブした。GitHubトークン未登録のためprivate-game-data同期は行っていない。");
    } catch (error) {
      HMW.addHistory("端末にはセーブした。private-game-dataへの同期には失敗した。");
      console.error(error);
    }
  };

  HMW.loadGame = async () => {
    try {
      const result = await HMW.loadPrivate();
      if (result.ok) {
        HMW.addHistory("private-game-dataのセーブをロードした。 ");
        return true;
      }
    } catch (error) {
      console.error(error);
    }
    const local = HMW.loadLocal();
    if (local) HMW.addHistory("端末内のセーブをロードした。 ");
    return local;
  };
})();