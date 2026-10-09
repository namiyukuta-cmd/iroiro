(() => {
  "use strict";

  const OWNER = "namiyukuta-cmd";
  const REPO = "private-game-data";
  const SAVE_DIRECTORY = "word";
  const TOKEN_KEY = "private_game_github_token_v1";
  const TOKEN_KEYS = [TOKEN_KEY, "homedeco_github_token_v1"];
  const LEGACY_LOCAL_KEY = "iroiro.word.userText.v1";

  const editor = document.getElementById("userText");
  const saveButton = document.getElementById("saveText");
  const newButton = document.getElementById("newText");
  const refreshButton = document.getElementById("refreshSaves");
  const status = document.getElementById("saveStatus");
  const savedList = document.getElementById("savedList");
  const settings = document.getElementById("githubSettings");
  const tokenInput = document.getElementById("githubToken");
  const registerButton = document.getElementById("registerToken");

  let currentPath = null;
  let currentSha = null;
  let lastSavedText = "";
  let busy = false;

  function setStatus(message) { status.textContent = message; }
  function confirmEditor(message) {
    return window.wordEditorConfirm ? window.wordEditorConfirm(message) : window.confirm(message);
  }
  function getToken() {
    try {
      for (const key of TOKEN_KEYS) {
        const value = localStorage.getItem(key);
        if (value) return value;
      }
    } catch (_) {}
    return "";
  }
  function requireToken() {
    const token = getToken();
    if (!token) {
      settings.open = true;
      throw new Error("GitHubトークンが未登録です。GitHub接続設定から登録してください。");
    }
    return token;
  }
  function encode(text) {
    const bytes = new TextEncoder().encode(text);
    let binary = "";
    for (let i = 0; i < bytes.length; i += 8192) {
      binary += String.fromCharCode(...bytes.subarray(i, i + 8192));
    }
    return btoa(binary);
  }
  function decode(encoded) {
    const binary = atob(String(encoded || "").replace(/\s/g, ""));
    return new TextDecoder().decode(Uint8Array.from(binary, c => c.charCodeAt(0)));
  }
  async function request(method, url, body) {
    const response = await fetch(url, {
      method,
      headers: {
        "Accept": "application/vnd.github+json",
        "Authorization": "Bearer " + requireToken(),
        "X-GitHub-Api-Version": "2022-11-28",
        ...(body ? { "Content-Type": "application/json" } : {})
      },
      body: body ? JSON.stringify(body) : undefined,
      cache: "no-store"
    });
    if (!response.ok) {
      if (response.status === 401) throw new Error("GitHubトークンが無効です（401）。");
      if (response.status === 403) throw new Error("GitHubへのアクセス権限がありません（403）。");
      if (response.status === 404) throw new Error("保存先が見つかりません（404）。トークンのリポジトリアクセス権限を確認してください。");
      throw new Error("GitHub通信エラー（" + response.status + "）。");
    }
    return response.json();
  }
  function apiUrl(path) {
    return "https://api.github.com/repos/" + OWNER + "/" + REPO + "/contents/" + path;
  }
  function createFilename() {
    const now = new Date();
    const pad = number => String(number).padStart(2, "0");
    const date = now.getFullYear() + pad(now.getMonth() + 1) + pad(now.getDate());
    const time = pad(now.getHours()) + pad(now.getMinutes()) + pad(now.getSeconds());
    const id = (typeof crypto !== "undefined" && crypto.randomUUID)
      ? crypto.randomUUID().slice(0, 8)
      : Math.random().toString(36).slice(2, 10);
    return "text-" + date + "-" + time + "-" + id + ".txt";
  }
  function displayName(filename) {
    const match = /^text-(\d{4})(\d{2})(\d{2})-(\d{2})(\d{2})(\d{2})-/.exec(filename);
    return match ? match[1] + "/" + match[2] + "/" + match[3] + " " +
      match[4] + ":" + match[5] + ":" + match[6] : filename;
  }
  function setBusy(value) {
    busy = value;
    saveButton.disabled = value;
    refreshButton.disabled = value;
    newButton.disabled = value;
  }
  function hasUnsavedChanges() { return editor.value !== lastSavedText; }

  async function listSaves() {
    savedList.textContent = "読み込み中…";
    const data = await request("GET", apiUrl(SAVE_DIRECTORY) + "?_=" + Date.now());
    if (!Array.isArray(data)) throw new Error("保存一覧を取得できませんでした。");
    const files = data.filter(file => file.type === "file" && /^text-.*\.txt$/.test(file.name))
      .sort((a, b) => b.name.localeCompare(a.name));
    savedList.replaceChildren();
    if (!files.length) {
      const empty = document.createElement("p");
      empty.textContent = "保存済みの文章はありません。";
      savedList.append(empty);
      return;
    }
    for (const file of files) {
      const button = document.createElement("button");
      button.type = "button";
      button.textContent = displayName(file.name);
      button.setAttribute("aria-current", String(currentPath === file.path));
      button.addEventListener("click", () => loadSave(file));
      savedList.append(button);
    }
  }

  async function loadSave(file) {
    if (busy) return;
    if (hasUnsavedChanges() && !confirmEditor("未保存の文章があります。別の文章を読み込みますか？")) return;
    if (window.wordEditorOpen) window.wordEditorOpen();
    setBusy(true);
    setStatus("GitHubから読み込み中…");
    try {
      const data = await request("GET", apiUrl(file.path) + "?_=" + Date.now());
      const content = decode(data.content);
      editor.value = content;
      lastSavedText = content;
      currentPath = file.path;
      currentSha = data.sha;
      setStatus("GitHubから読み込みました：" + displayName(file.name));
      for (const button of savedList.querySelectorAll("button")) {
        button.setAttribute("aria-current", String(button.textContent === displayName(file.name)));
      }
    } catch (error) {
      setStatus("読み込み失敗：" + error.message);
    } finally {
      setBusy(false);
    }
  }

  saveButton.addEventListener("click", async () => {
    if (busy) return;
    if (!editor.value.trim()) {
      setStatus("保存する文章を入力してください。");
      return;
    }
    setBusy(true);
    setStatus("非公開GitHubへ保存中…");
    const snapshot = editor.value;
    const path = currentPath || SAVE_DIRECTORY + "/" + createFilename();
    try {
      const result = await request("PUT", apiUrl(path), {
        message: "Save word text " + path.split("/").pop(),
        content: encode(snapshot),
        ...(currentSha ? { sha: currentSha } : {})
      });
      currentPath = path;
      currentSha = result.content.sha;
      lastSavedText = snapshot;
      try { localStorage.removeItem(LEGACY_LOCAL_KEY); } catch (_) {}
      setStatus(editor.value === snapshot
        ? "非公開リポジトリの " + path + " に保存しました。"
        : "GitHubに保存しましたが、その後の入力は未保存です。");
      try { await listSaves(); } catch (error) { /* save itself succeeded */ }
    } catch (error) {
      setStatus("GitHubへの保存に失敗しました：" + error.message + " 入力中の文章は消していません。");
    } finally {
      setBusy(false);
    }
  });

  newButton.addEventListener("click", () => {
    if (busy) return;
    if (hasUnsavedChanges() && !confirmEditor("未保存の文章があります。新しい文章を始めますか？")) return;
    editor.value = "";
    currentPath = null;
    currentSha = null;
    lastSavedText = "";
    setStatus("新しい文章です。GitHubにはまだ保存されていません。");
    editor.focus();
  });

  refreshButton.addEventListener("click", async () => {
    if (busy) return;
    setBusy(true);
    try { await listSaves(); setStatus("保存一覧を更新しました。"); }
    catch (error) { savedList.textContent = ""; setStatus("一覧を取得できませんでした：" + error.message); }
    finally { setBusy(false); }
  });

  registerButton.addEventListener("click", async () => {
    const token = tokenInput.value.trim();
    if (!token) { setStatus("GitHubトークンを入力してください。"); return; }
    try {
      localStorage.setItem(TOKEN_KEY, token);
      tokenInput.value = "";
      settings.open = false;
      setStatus("GitHub接続情報を登録しました。");
      await listSaves();
    } catch (error) {
      setStatus("接続設定に失敗しました：" + error.message);
    }
  });

  editor.addEventListener("input", () => {
    setStatus(hasUnsavedChanges() ? "未保存の変更があります。" : "保存済みです。");
  });

  // 以前の端末保存に文章がある場合は、消さずに引き継ぎます。
  try {
    const old = localStorage.getItem(LEGACY_LOCAL_KEY);
    if (old !== null && old !== "") {
      editor.value = old;
      setStatus("以前の端末保存の文章を表示しています。GitHubへ保存してください。");
    }
  } catch (_) {}

  if (getToken()) {
    listSaves().catch(error => {
      savedList.textContent = "";
      setStatus("保存一覧を取得できませんでした：" + error.message);
    });
  } else {
    savedList.textContent = "GitHub接続設定からトークンを登録してください。";
  }
})();
