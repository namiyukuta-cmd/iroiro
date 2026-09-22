(() => {
  "use strict";
  const HMW = window.HMW = window.HMW || {};
  const SLOT_COUNT = 3;
  const LOCAL_PREFIX = "hmw_save_v2_slot_";
  const LEGACY_LOCAL_KEY = "hmw_save_v1";
  const ACTIVE_SLOT_KEY = "hmw_active_save_slot_v1";
  const TOKEN_KEYS = ["private_game_github_token_v1", "homedeco_github_token_v1"];
  const OWNER = "namiyukuta-cmd";
  const REPO = "private-game-data";

  const normalizeSlot = (slot) => {
    const n = Math.floor(Number(slot) || 1);
    return Math.max(1, Math.min(SLOT_COUNT, n));
  };

  const localKey = (slot) => `${LOCAL_PREFIX}${normalizeSlot(slot)}`;
  const privatePath = (slot) => `HMW/saves/slot${normalizeSlot(slot)}.json`;

  const readActiveSlot = () => {
    try {
      return normalizeSlot(localStorage.getItem(ACTIVE_SLOT_KEY) || 1);
    } catch (_) {
      return 1;
    }
  };

  HMW.SAVE_SLOT_COUNT = SLOT_COUNT;
  HMW.activeSaveSlot = readActiveSlot();

  HMW.setActiveSaveSlot = (slot) => {
    HMW.activeSaveSlot = normalizeSlot(slot);
    try { localStorage.setItem(ACTIVE_SLOT_KEY, String(HMW.activeSaveSlot)); } catch (_) {}
    return HMW.activeSaveSlot;
  };

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

  const validSave = (parsed) => !!(
    parsed &&
    typeof parsed === "object" &&
    parsed.stats &&
    parsed.location
  );

  const getToken = () => {
    for (const key of TOKEN_KEYS) {
      const token = localStorage.getItem(key);
      if (token) return token;
    }
    return "";
  };

  const readLocalRaw = (slot) => {
    const normalized = normalizeSlot(slot);
    try {
      let raw = localStorage.getItem(localKey(normalized));
      if (!raw && normalized === 1) {
        raw = localStorage.getItem(LEGACY_LOCAL_KEY);
        if (raw) localStorage.setItem(localKey(1), raw);
      }
      return raw || "";
    } catch (_) {
      return "";
    }
  };

  HMW.peekLocalSave = (slot) => {
    try {
      const raw = readLocalRaw(slot);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      return validSave(parsed) ? parsed : null;
    } catch (_) {
      return null;
    }
  };

  HMW.describeSaveSlot = (slot) => {
    const normalized = normalizeSlot(slot);
    const saved = HMW.peekLocalSave(normalized);
    if (!saved) return `スロット${normalized}`;
    const day = Number(saved.day) || 1;
    const slotName = HMW.DATA?.slots?.[Number(saved.slot) || 0] || "";
    const locationName = HMW.DATA?.locations?.[saved.location]?.name || saved.location || "";
    return `スロット${normalized}　DAY${day} ${slotName}　${locationName}`;
  };

  HMW.saveLocal = (slot = HMW.activeSaveSlot) => {
    const normalized = HMW.setActiveSaveSlot(slot);
    try {
      localStorage.setItem(localKey(normalized), JSON.stringify(HMW.state));
      if (normalized === 1) localStorage.setItem(LEGACY_LOCAL_KEY, JSON.stringify(HMW.state));
      return true;
    } catch (_) {
      return false;
    }
  };

  HMW.loadLocal = (slot = HMW.activeSaveSlot) => {
    const normalized = normalizeSlot(slot);
    try {
      const raw = readLocalRaw(normalized);
      if (!raw) return false;
      const parsed = JSON.parse(raw);
      if (!validSave(parsed)) return false;
      HMW.state = parsed;
      HMW.setActiveSaveSlot(normalized);
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

  HMW.savePrivate = async (slot = HMW.activeSaveSlot) => {
    const normalized = normalizeSlot(slot);
    const token = getToken();
    if (!token) return { ok: false, skipped: true };
    const path = privatePath(normalized);
    const url = `https://api.github.com/repos/${OWNER}/${REPO}/contents/${path}`;
    let sha = null;
    try {
      const existing = await githubRequest("GET", url);
      sha = existing.sha || null;
    } catch (error) {
      if (!String(error.message).startsWith("404")) throw error;
    }
    const body = {
      message: `Save HMW slot${normalized} DAY${HMW.state.day}`,
      content: utf8ToBase64(JSON.stringify(HMW.state, null, 2)),
      ...(sha ? { sha } : {})
    };
    await githubRequest("PUT", url, body);
    return { ok: true, slot: normalized };
  };

  HMW.loadPrivate = async (slot = HMW.activeSaveSlot) => {
    const normalized = normalizeSlot(slot);
    const token = getToken();
    if (!token) return { ok: false, skipped: true };
    const path = privatePath(normalized);
    const url = `https://api.github.com/repos/${OWNER}/${REPO}/contents/${path}`;
    try {
      const data = await githubRequest("GET", url);
      const parsed = JSON.parse(base64ToUtf8(data.content || ""));
      if (!validSave(parsed)) throw new Error("invalid save");
      HMW.state = parsed;
      HMW.setActiveSaveSlot(normalized);
      HMW.saveLocal(normalized);
      return { ok: true, slot: normalized };
    } catch (error) {
      if (String(error.message).startsWith("404")) return { ok: false, missing: true };
      throw error;
    }
  };

  HMW.saveGame = async (slot = HMW.activeSaveSlot) => {
    const normalized = HMW.setActiveSaveSlot(slot);
    HMW.saveLocal(normalized);
    try {
      const result = await HMW.savePrivate(normalized);
      HMW.addHistory(result.ok
        ? `スロット${normalized}へセーブした。端末とprivate-game-dataに保存済み。`
        : `スロット${normalized}へ端末保存した。GitHubトークン未登録のためprivate-game-data同期は行っていない。`);
    } catch (error) {
      HMW.addHistory(`スロット${normalized}へ端末保存した。private-game-dataへの同期には失敗した。`);
      console.error(error);
    }
  };

  HMW.loadGame = async (slot = HMW.activeSaveSlot) => {
    const normalized = normalizeSlot(slot);
    try {
      const result = await HMW.loadPrivate(normalized);
      if (result.ok) {
        HMW.addHistory(`private-game-dataのスロット${normalized}をロードした。`);
        return true;
      }
    } catch (error) {
      console.error(error);
    }
    const local = HMW.loadLocal(normalized);
    if (local) {
      HMW.addHistory(`端末内のスロット${normalized}をロードした。`);
      return true;
    }
    return false;
  };
})();