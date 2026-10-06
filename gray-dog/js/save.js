window.GrayGame = window.GrayGame || {};

(() => {
  "use strict";

  const OWNER = "namiyukuta-cmd";
  const REPO = "private-game-data";
  const SAVE_PATH = "gray-dog/saves/slot1.json";
  const TOKEN_KEYS = ["private_game_github_token_v1", "homedeco_github_token_v1"];

  const getToken = () => {
    for (const key of TOKEN_KEYS) {
      try {
        const token = localStorage.getItem(key);
        if (token) return token;
      } catch (_) {}
    }
    return "";
  };

  const utf8ToBase64 = (text) => {
    const bytes = new TextEncoder().encode(text);
    let binary = "";
    bytes.forEach((b) => { binary += String.fromCharCode(b); });
    return btoa(binary);
  };

  const base64ToUtf8 = (base64) => {
    const binary = atob(String(base64 || "").replace(/\n/g, ""));
    const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
    return new TextDecoder().decode(bytes);
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
      const error = new Error(`${response.status} ${text}`);
      error.status = response.status;
      throw error;
    }
    return response.json();
  }

  GrayGame.privateSavePath = SAVE_PATH;

  GrayGame.savePrivate = async () => {
    if (!getToken()) return { ok:false, skipped:true };

    const url = `https://api.github.com/repos/${OWNER}/${REPO}/contents/${SAVE_PATH}`;
    let sha = null;

    try {
      const existing = await githubRequest("GET", url);
      sha = existing.sha || null;
    } catch (error) {
      if (error.status !== 404) throw error;
    }

    const current = GrayGame.exportState();
    // 「保存」を押した時だけ端末にも明示保存する。
    GrayGame.saveLocalManual();
    const body = {
      message: `Save Gray dog game ${GrayGame.dayLabel()}`,
      content: utf8ToBase64(JSON.stringify(current, null, 2)),
      ...(sha ? { sha } : {})
    };

    await githubRequest("PUT", url, body);
    return { ok:true, path:SAVE_PATH };
  };

  GrayGame.loadPrivate = async () => {
    if (!getToken()) return { ok:false, skipped:true };

    const url = `https://api.github.com/repos/${OWNER}/${REPO}/contents/${SAVE_PATH}`;
    try {
      const data = await githubRequest("GET", url);
      const parsed = JSON.parse(base64ToUtf8(data.content));
      GrayGame.replaceState(parsed);
      GrayGame.saveLocalManual();
      return { ok:true, path:SAVE_PATH };
    } catch (error) {
      if (error.status === 404) return { ok:false, missing:true };
      throw error;
    }
  };
})();