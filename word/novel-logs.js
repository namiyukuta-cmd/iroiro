(() => {
  "use strict";

  const OWNER = "namiyukuta-cmd";
  const REPO = "private-game-data";
  const NOVELS_DIR = "word/novels";
  const TOKEN_KEYS = ["private_game_github_token_v1", "homedeco_github_token_v1"];
  const SELECTED_KEY = "iroiro.word.selectedNovel.v1";

  const select = document.getElementById("novelSelect");
  const novelTitle = document.getElementById("novelTitle");
  const createNovelButton = document.getElementById("createNovel");
  const refreshNovelsButton = document.getElementById("refreshNovels");
  const refreshLogsButton = document.getElementById("refreshNovelLogs");
  const addLogButton = document.getElementById("appendNovelLog");
  const copyAllButton = document.getElementById("copyNovelLog");
  const authorSelect = document.getElementById("novelAuthor");
  const editor = document.getElementById("userText");
  const status = document.getElementById("novelStatus");
  const logArea = document.getElementById("novelEntries");
  const githubSettings = document.getElementById("githubSettings");
  const tokenRegister = document.getElementById("registerToken");

  let novels = [];
  let currentNovelId = "";
  let entries = [];
  let busy = false;

  function setStatus(message) { status.textContent = message; }
  function getToken() {
    try {
      for (const key of TOKEN_KEYS) {
        const token = localStorage.getItem(key);
        if (token) return token;
      }
    } catch (_) {}
    return "";
  }
  function requireToken() {
    const token = getToken();
    if (!token) {
      githubSettings.open = true;
      throw new Error("GitHub接続設定からトークンを登録してください。");
    }
    return token;
  }
  function api(path) {
    return "https://api.github.com/repos/" + OWNER + "/" + REPO + "/contents/" + path;
  }
  function encodeUtf8(text) {
    const bytes = new TextEncoder().encode(text);
    let encoded = "";
    for (let i = 0; i < bytes.length; i += 8192) {
      encoded += String.fromCharCode(...bytes.subarray(i, i + 8192));
    }
    return btoa(encoded);
  }
  function decodeUtf8(content) {
    const binary = atob(String(content || "").replace(/\s/g, ""));
    return new TextDecoder().decode(Uint8Array.from(binary, char => char.charCodeAt(0)));
  }
  async function request(method, path, body, allowMissing = false) {
    const token = requireToken();
    const response = await fetch(api(path) + (method === "GET" ? "?_=" + Date.now() : ""), {
      method,
      headers: {
        "Accept": "application/vnd.github+json",
        "Authorization": "Bearer " + token,
        "X-GitHub-Api-Version": "2022-11-28",
        ...(body ? { "Content-Type": "application/json" } : {})
      },
      body: body ? JSON.stringify(body) : undefined,
      cache: "no-store"
    });
    if (response.status === 404 && allowMissing) return null;
    if (!response.ok) {
      if (response.status === 401) throw new Error("GitHubトークンが無効です（401）。");
      if (response.status === 403) throw new Error("GitHubへのアクセス権限がありません（403）。");
      if (response.status === 404) throw new Error("GitHubの保存先を読み込めません（404）。トークンの権限を確認してください。");
      if (response.status === 409) throw new Error("同時保存の競合が起きました（409）。一覧を更新して再度お試しください。");
      throw new Error("GitHub通信エラー（" + response.status + "）。");
    }
    return response.json();
  }
  function uniqueId() {
    if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID().replace(/-/g, "");
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 12);
  }
  function sortableStamp() {
    return new Date().toISOString().replace(/[-:]/g, "").replace(".", "");
  }
  function saveSelection() {
    try { localStorage.setItem(SELECTED_KEY, currentNovelId); } catch (_) {}
  }
  function readSelection() {
    try { return localStorage.getItem(SELECTED_KEY) || ""; } catch (_) { return ""; }
  }
  function setBusy(working) {
    busy = working;
    select.disabled = working;
    createNovelButton.disabled = working;
    refreshNovelsButton.disabled = working;
    refreshLogsButton.disabled = working;
    addLogButton.disabled = working;
    copyAllButton.disabled = working;
  }
  function showPlaceholder(message) {
    logArea.replaceChildren();
    const p = document.createElement("p");
    p.textContent = message;
    logArea.append(p);
  }
  function authorLabel(author) {
    return author === "chatgpt" ? "ChatGPT" : "自分";
  }
  function formatTime(time) {
    const date = new Date(time);
    return Number.isNaN(date.getTime()) ? time : date.toLocaleString("ja-JP");
  }

  async function fetchNovels() {
    const listing = await request("GET", NOVELS_DIR);
    if (!Array.isArray(listing)) throw new Error("作品一覧の形式が正しくありません。");
    const directories = listing.filter(item => item.type === "dir" && /^novel-[a-zA-Z0-9-]+$/.test(item.name));
    const result = [];
    for (let i = 0; i < directories.length; i += 5) {
      const group = directories.slice(i, i + 5);
      const metas = await Promise.all(group.map(async item => {
        const meta = await request("GET", NOVELS_DIR + "/" + item.name + "/meta.json");
        const parsed = JSON.parse(decodeUtf8(meta.content));
        if (parsed.id !== item.name || typeof parsed.title !== "string") throw new Error("作品情報の形式が正しくありません。");
        return parsed;
      }));
      result.push(...metas);
    }
    return result.sort((a, b) => String(b.createdAt || "").localeCompare(String(a.createdAt || "")));
  }
  function renderNovelSelect() {
    const previous = currentNovelId || readSelection();
    select.replaceChildren();
    const placeholder = document.createElement("option");
    placeholder.value = "";
    placeholder.textContent = "作品を選択してください";
    select.append(placeholder);
    for (const novel of novels) {
      const option = document.createElement("option");
      option.value = novel.id;
      option.textContent = novel.title;
      select.append(option);
    }
    currentNovelId = novels.some(novel => novel.id === previous) ? previous : "";
    select.value = currentNovelId;
    saveSelection();
  }

  async function fetchLogEntries(id) {
    const folder = NOVELS_DIR + "/" + id + "/logs";
    const listing = await request("GET", folder, null, true);
    if (listing === null) return [];
    if (!Array.isArray(listing)) throw new Error("投稿一覧の形式が正しくありません。");
    const files = listing.filter(file => file.type === "file" && /^[0-9TZ]+_[a-z0-9]+\.json$/.test(file.name))
      .sort((a, b) => a.name.localeCompare(b.name));
    const loaded = [];
    for (let i = 0; i < files.length; i += 5) {
      const group = files.slice(i, i + 5);
      const records = await Promise.all(group.map(async file => {
        const result = await request("GET", file.path);
        const entry = JSON.parse(decodeUtf8(result.content));
        if (typeof entry.text !== "string" || !["user", "chatgpt"].includes(entry.author)) {
          throw new Error("投稿データの形式が正しくありません：" + file.name);
        }
        return { ...entry, path: file.path };
      }));
      loaded.push(...records);
      if (files.length > 5) setStatus("投稿を読み込み中：" + Math.min(i + 5, files.length) + " / " + files.length);
    }
    return loaded;
  }

  async function copyText(content) {
    if (!navigator.clipboard || !navigator.clipboard.writeText) {
      throw new Error("このブラウザではコピーできません。");
    }
    await navigator.clipboard.writeText(content);
  }
  function renderLogs() {
    logArea.replaceChildren();
    if (!currentNovelId) { showPlaceholder("作品を選択してください。"); return; }
    if (entries.length === 0) { showPlaceholder("まだ投稿がありません。"); return; }
    entries.forEach((entry, index) => {
      const card = document.createElement("article");
      card.className = "novel-entry";
      card.dataset.author = entry.author;
      const head = document.createElement("div");
      head.className = "novel-entry-head";
      const who = document.createElement("strong");
      who.textContent = "第" + (index + 1) + "投稿｜" + authorLabel(entry.author);
      const time = document.createElement("time");
      time.dateTime = entry.createdAt || "";
      time.textContent = formatTime(entry.createdAt || "");
      head.append(who, time);
      const body = document.createElement("div");
      body.className = "novel-entry-text";
      body.textContent = entry.text;
      const copy = document.createElement("button");
      copy.type = "button";
      copy.className = "novel-entry-copy";
      copy.textContent = "この投稿をコピー";
      copy.addEventListener("click", async () => {
        try { await copyText(entry.text); setStatus("第" + (index + 1) + "投稿をコピーしました。"); }
        catch (error) { setStatus("コピー失敗：" + error.message); }
      });
      card.append(head, body, copy);
      logArea.append(card);
    });
  }

  async function reloadSelectedLogs() {
    if (!currentNovelId) {
      entries = [];
      renderLogs();
      return;
    }
    showPlaceholder("投稿ログを取得中…");
    entries = await fetchLogEntries(currentNovelId);
    renderLogs();
  }

  async function refreshNovelList(preferredId = "") {
    if (busy) return;
    setBusy(true);
    setStatus("作品一覧を取得中…");
    try {
      novels = await fetchNovels();
      if (preferredId) currentNovelId = preferredId;
      renderNovelSelect();
      await reloadSelectedLogs();
      setStatus(currentNovelId ? "作品と投稿ログを読み込みました。" : "作品を選択するか、新しく作成してください。");
    } catch (error) {
      setStatus("作品一覧の取得に失敗しました：" + error.message);
    } finally {
      setBusy(false);
    }
  }

  select.addEventListener("change", async () => {
    if (busy) return;
    currentNovelId = select.value;
    saveSelection();
    setBusy(true);
    try {
      await reloadSelectedLogs();
      setStatus(currentNovelId ? "投稿ログを読み込みました。" : "作品を選択してください。");
    } catch (error) {
      setStatus("投稿ログの取得に失敗しました：" + error.message);
    } finally {
      setBusy(false);
    }
  });

  createNovelButton.addEventListener("click", async () => {
    if (busy) return;
    const title = novelTitle.value.trim();
    if (!title) { setStatus("新しい作品名を入力してください。"); return; }
    const id = "novel-" + sortableStamp().replace(/[^0-9TZ]/g, "").toLowerCase() + "-" + uniqueId().slice(0, 12);
    const meta = { version: 1, id, title, createdAt: new Date().toISOString() };
    setBusy(true);
    setStatus("非公開GitHubに作品を作成中…");
    try {
      await request("PUT", NOVELS_DIR + "/" + id + "/meta.json", {
        message: "Create exchange novel " + id,
        content: encodeUtf8(JSON.stringify(meta, null, 2))
      });
      novelTitle.value = "";
      // A successful write must not be reported as a failure if the following listing has a transient error.
      setStatus("作品「" + title + "」を作成しました。");
    } catch (error) {
      setStatus("作品の作成に失敗しました：" + error.message);
      setBusy(false);
      return;
    }
    setBusy(false);
    await refreshNovelList(id);
  });

  addLogButton.addEventListener("click", async () => {
    if (busy) return;
    if (!currentNovelId || !novels.some(novel => novel.id === currentNovelId)) {
      setStatus("投稿先の作品を選択してください。");
      return;
    }
    const text = editor.value;
    if (!text.trim()) { setStatus("投稿する文章を入力してください。"); return; }
    const author = authorSelect.value;
    if (!["user", "chatgpt"].includes(author)) { setStatus("投稿者を選択してください。"); return; }
    const previous = entries[entries.length - 1];
    if (previous && previous.text === text && previous.author === author) {
      if (!(window.wordEditorConfirm ? window.wordEditorConfirm("直前と同じ文章です。もう一度投稿しますか？") : window.confirm("直前と同じ文章です。もう一度投稿しますか？"))) return;
    }
    const id = sortableStamp() + "_" + uniqueId().slice(0, 12);
    const createdAt = new Date().toISOString();
    const data = { version: 1, id, author, text, createdAt };
    const path = NOVELS_DIR + "/" + currentNovelId + "/logs/" + id + ".json";
    setBusy(true);
    setStatus("非公開GitHubへ投稿を保存中…");
    try {
      await request("PUT", path, {
        message: "Add exchange novel entry " + id,
        content: encodeUtf8(JSON.stringify(data, null, 2))
      });
      entries.push({ ...data, path });
      entries.sort((a, b) => String(a.path).localeCompare(String(b.path)));
      renderLogs();
      setStatus("第" + entries.length + "投稿をGitHubに保存しました。入力欄の文章は残しています。");
    } catch (error) {
      setStatus("投稿に失敗しました：" + error.message + " 入力欄の文章は消していません。");
    } finally {
      setBusy(false);
    }
  });

  refreshNovelsButton.addEventListener("click", () => refreshNovelList());
  refreshLogsButton.addEventListener("click", async () => {
    if (busy) return;
    setBusy(true);
    try { await reloadSelectedLogs(); setStatus("投稿ログを再読み込みしました。"); }
    catch (error) { setStatus("再読み込みに失敗しました：" + error.message); }
    finally { setBusy(false); }
  });
  copyAllButton.addEventListener("click", async () => {
    if (!entries.length) { setStatus("コピーする投稿がありません。"); return; }
    const content = entries.map((entry, index) => {
      return "第" + (index + 1) + "投稿｜" + authorLabel(entry.author) + "\n" + entry.text;
    }).join("\n\n");
    try { await copyText(content); setStatus("交換小説の全投稿をコピーしました。"); }
    catch (error) { setStatus("コピー失敗：" + error.message); }
  });

  // The existing Word page registers the token first; this handler then refreshes the novel list.
  tokenRegister.addEventListener("click", () => {
    if (getToken()) refreshNovelList();
  });

  if (getToken()) {
    refreshNovelList();
  } else {
    setStatus("保存と読み込みには、GitHub接続設定でprivate-game-data用トークンを登録してください。");
    showPlaceholder("作品を選択するか、新しく作成してください。");
  }
})();
