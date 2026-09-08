(() => {
  "use strict";

  window.HMW = window.HMW || {};
  const HMW = window.HMW;

  const TOKEN_KEYS = [
    "private_game_github_token_v1",
    "homedeco_github_token_v1"
  ];

  const CLOUD = {
    owner: "namiyukuta-cmd",
    repo: "private-game-data",
    basePath: "HMW/saves"
  };

  const PENDING_LOAD_KEY = "hmw_pending_cloud_load_v1";

  const clone = (value) => JSON.parse(JSON.stringify(value));

  const restorePendingState = () => {
    try {
      const raw = sessionStorage.getItem(PENDING_LOAD_KEY);
      if (!raw) return;

      sessionStorage.removeItem(PENDING_LOAD_KEY);
      const state = JSON.parse(raw);

      if (!state || typeof state !== "object") return;
      if (state.meta?.gameId && state.meta.gameId !== "HMW") return;

      HMW.state = state;
    } catch (error) {
      console.error("HMW pending load restore failed", error);
    }
  };

  restorePendingState();

  const cleanToken = (token) => String(token || "").replace(/\s+/g, "");

  const getToken = () => {
    for (const key of TOKEN_KEYS) {
      const token = cleanToken(localStorage.getItem(key) || "");
      if (token) return token;
    }
    return "";
  };

  const rememberToken = (token) => {
    const cleaned = cleanToken(token);
    if (cleaned) localStorage.setItem(TOKEN_KEYS[0], cleaned);
    return cleaned;
  };

  const requireToken = () => {
    const current = getToken();
    if (current) return current;

    const input = prompt("private-game-data を使うGitHubトークンを入力してください");
    if (!input) throw new Error("中止しました");
    return rememberToken(input);
  };

  const headers = (token) => ({
    Accept: "application/vnd.github+json",
    Authorization: `Bearer ${token}`,
    "X-GitHub-Api-Version": "2022-11-28"
  });

  const apiUrl = (path) => {
    const encodedPath = String(path)
      .split("/")
      .map(encodeURIComponent)
      .join("/");

    return `https://api.github.com/repos/${encodeURIComponent(CLOUD.owner)}/${encodeURIComponent(CLOUD.repo)}/contents/${encodedPath}`;
  };

  const encode64 = (text) => {
    const bytes = new TextEncoder().encode(text);
    let binary = "";
    for (const byte of bytes) binary += String.fromCharCode(byte);
    return btoa(binary);
  };

  const decode64 = (text) => {
    const raw = atob(String(text || "").replace(/\s/g, ""));
    const bytes = Uint8Array.from(raw, (char) => char.charCodeAt(0));
    return new TextDecoder().decode(bytes);
  };

  const makeSaveId = () => {
    const now = new Date();
    const stamp = [
      now.getFullYear(),
      String(now.getMonth() + 1).padStart(2, "0"),
      String(now.getDate()).padStart(2, "0"),
      String(now.getHours()).padStart(2, "0"),
      String(now.getMinutes()).padStart(2, "0"),
      String(now.getSeconds()).padStart(2, "0")
    ].join("");

    return `save_${stamp}_${Math.random().toString(36).slice(2, 6)}`;
  };

  const savePath = (saveId) => `${CLOUD.basePath}/${saveId}.json`;

  const getLocationName = (locationId) => {
    if (!locationId) return "現在地未設定";
    return HMW.getLocation?.(locationId)?.name || locationId;
  };

  const getTimeLabel = (timeId) => {
    return HMW.worldData?.timeSlots?.[timeId]?.label || timeId || "―";
  };

  const buildRecord = (saveId, saveName, createdAt = null) => {
    const now = new Date().toISOString();

    HMW.state.meta = HMW.state.meta || {};
    HMW.state.meta.gameId = "HMW";
    HMW.state.meta.stateVersion = HMW.state.meta.stateVersion || 1;
    HMW.state.meta.saveId = saveId;
    HMW.state.meta.createdAt = createdAt || HMW.state.meta.createdAt || now;
    HMW.state.meta.updatedAt = now;

    const state = HMW.getStateSnapshot
      ? HMW.getStateSnapshot()
      : clone(HMW.state);

    return {
      format: "HMW_SAVE",
      version: 1,
      saveId,
      saveName,
      createdAt: HMW.state.meta.createdAt,
      updatedAt: now,
      summary: {
        playerName: state.player?.name || "主人公",
        day: state.world?.day ?? 1,
        time: state.world?.time || "morning",
        money: state.player?.money ?? 0,
        locationId: state.world?.locationId || null,
        locationName: getLocationName(state.world?.locationId)
      },
      state
    };
  };

  const validateRecord = (record) => {
    if (!record || typeof record !== "object") {
      throw new Error("セーブデータが不正です");
    }

    if (record.format !== "HMW_SAVE" || !record.state) {
      throw new Error("HMWのセーブデータではありません");
    }

    if (record.state.meta?.gameId && record.state.meta.gameId !== "HMW") {
      throw new Error("別ゲームのセーブデータです");
    }

    return record;
  };

  const readFile = async (token, path) => {
    const response = await fetch(apiUrl(path), {
      headers: headers(token),
      cache: "no-store"
    });

    if (response.status === 404) return null;
    if (!response.ok) {
      throw new Error(`private-game-data を読み込めませんでした (${response.status})`);
    }

    const file = await response.json();
    return {
      path,
      sha: file.sha || "",
      data: JSON.parse(decode64(file.content))
    };
  };

  const listFiles = async (token) => {
    const response = await fetch(apiUrl(CLOUD.basePath), {
      headers: headers(token),
      cache: "no-store"
    });

    if (response.status === 404) return [];
    if (!response.ok) {
      throw new Error(`セーブ一覧を読み込めませんでした (${response.status})`);
    }

    const entries = await response.json();
    if (!Array.isArray(entries)) return [];

    return entries.filter((entry) => entry.type === "file" && entry.name.endsWith(".json"));
  };

  const listSaves = async (token) => {
    const files = await listFiles(token);
    const records = await Promise.all(
      files.map(async (file) => {
        try {
          const loaded = await readFile(token, file.path);
          if (!loaded) return null;
          const record = validateRecord(loaded.data);
          return {
            ...record,
            path: file.path,
            sha: loaded.sha
          };
        } catch (error) {
          console.warn("HMW save ignored", file.path, error);
          return null;
        }
      })
    );

    return records
      .filter(Boolean)
      .sort((a, b) => String(b.updatedAt || "").localeCompare(String(a.updatedAt || "")));
  };

  const writeSave = async (token, record, sha = "") => {
    const body = {
      message: `Save HMW: ${record.saveName}`,
      content: encode64(JSON.stringify(record, null, 2))
    };

    if (sha) body.sha = sha;

    const response = await fetch(apiUrl(savePath(record.saveId)), {
      method: "PUT",
      headers: {
        ...headers(token),
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      throw new Error(`private-game-data へ保存できませんでした (${response.status})`);
    }

    return response.json();
  };

  const deleteSave = async (token, record) => {
    const response = await fetch(apiUrl(record.path || savePath(record.saveId)), {
      method: "DELETE",
      headers: {
        ...headers(token),
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        message: `Delete HMW save: ${record.saveName}`,
        sha: record.sha
      })
    });

    if (!response.ok) {
      throw new Error(`セーブを削除できませんでした (${response.status})`);
    }
  };

  const modalElements = () => ({
    layer: document.getElementById("modalLayer"),
    title: document.getElementById("modalTitle"),
    content: document.getElementById("modalContent")
  });

  const button = (label, onClick, className = "action-button") => {
    const element = document.createElement("button");
    element.type = "button";
    element.className = className;
    element.textContent = label;
    element.addEventListener("click", onClick);
    return element;
  };

  const paragraph = (text) => {
    const element = document.createElement("p");
    element.textContent = text;
    element.style.margin = "0 0 10px";
    return element;
  };

  const setStatus = (container, text) => {
    let status = container.querySelector("[data-save-status]");
    if (!status) {
      status = document.createElement("p");
      status.dataset.saveStatus = "true";
      status.style.margin = "10px 0";
      container.prepend(status);
    }
    status.textContent = text;
  };

  const formatUpdatedAt = (iso) => {
    if (!iso) return "更新日時不明";
    const date = new Date(iso);
    if (Number.isNaN(date.getTime())) return iso;

    return new Intl.DateTimeFormat("ja-JP", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit"
    }).format(date);
  };

  const createNewSave = async (token, existingRecords) => {
    const defaultName = `セーブ ${existingRecords.length + 1}`;
    const input = prompt("セーブ名を入力してください", defaultName);
    if (input === null) return false;

    const saveName = String(input).trim() || defaultName;
    const saveId = makeSaveId();
    const record = buildRecord(saveId, saveName);

    await writeSave(token, record);
    return true;
  };

  const overwriteSave = async (token, record) => {
    const confirmed = confirm(`「${record.saveName}」に上書きしますか？`);
    if (!confirmed) return false;

    const updated = buildRecord(record.saveId, record.saveName, record.createdAt);
    await writeSave(token, updated, record.sha);
    return true;
  };

  const loadSave = async (token, record) => {
    const loaded = await readFile(token, record.path || savePath(record.saveId));
    if (!loaded) throw new Error("セーブデータが見つかりません");

    const fullRecord = validateRecord(loaded.data);
    const confirmed = confirm(`「${fullRecord.saveName}」を読み込みますか？`);
    if (!confirmed) return;

    sessionStorage.setItem(PENDING_LOAD_KEY, JSON.stringify(fullRecord.state));
    window.location.reload();
  };

  const removeSave = async (token, record) => {
    const confirmed = confirm(`「${record.saveName}」を削除しますか？\nこの操作は取り消せません。`);
    if (!confirmed) return false;

    await deleteSave(token, record);

    if (HMW.state.meta?.saveId === record.saveId) {
      HMW.state.meta.saveId = null;
    }

    return true;
  };

  const renderSavePanel = async () => {
    const { layer, title, content } = modalElements();
    if (!layer || !title || !content) return;

    title.textContent = "セーブ";
    content.replaceChildren();
    content.append(paragraph("private-game-data / HMW / saves に保存します。"));

    const current = HMW.state.meta?.saveId;
    if (current) {
      content.append(paragraph(`現在のセーブID：${current}`));
    }

    const createButton = button("新しいセーブ", async () => {
      createButton.disabled = true;
      try {
        const token = requireToken();
        const records = await listSaves(token);
        const saved = await createNewSave(token, records);
        if (saved) await renderSavePanel();
      } catch (error) {
        setStatus(content, error.message || "保存に失敗しました");
      } finally {
        createButton.disabled = false;
      }
    });

    content.append(createButton);

    const status = document.createElement("p");
    status.dataset.saveStatus = "true";
    status.style.margin = "12px 0";
    status.textContent = "セーブ一覧を読み込んでいます…";
    content.append(status);

    layer.hidden = false;

    try {
      const token = requireToken();
      const records = await listSaves(token);
      status.textContent = records.length ? `${records.length}件のセーブがあります。` : "まだセーブはありません。";

      for (const record of records) {
        const card = document.createElement("section");
        card.style.padding = "12px 0";
        card.style.borderTop = "1px solid #d0c9bd";

        const heading = document.createElement("strong");
        heading.textContent = record.saveName || record.saveId;
        card.append(heading);

        const summary = record.summary || {};
        const detail = paragraph(
          `DAY ${summary.day ?? "―"} / ${getTimeLabel(summary.time)} / ${summary.locationName || getLocationName(summary.locationId)}\n` +
          `所持金 ${summary.money ?? "―"} / ${formatUpdatedAt(record.updatedAt)}`
        );
        detail.style.whiteSpace = "pre-line";
        card.append(detail);

        const controls = document.createElement("div");
        controls.style.display = "grid";
        controls.style.gridTemplateColumns = "repeat(3, minmax(0, 1fr))";
        controls.style.gap = "7px";

        const loadButton = button("読込", async () => {
          loadButton.disabled = true;
          try {
            await loadSave(token, record);
          } catch (error) {
            setStatus(content, error.message || "読込に失敗しました");
            loadButton.disabled = false;
          }
        });

        const overwriteButton = button("上書き", async () => {
          overwriteButton.disabled = true;
          try {
            const saved = await overwriteSave(token, record);
            if (saved) await renderSavePanel();
          } catch (error) {
            setStatus(content, error.message || "上書きに失敗しました");
          } finally {
            overwriteButton.disabled = false;
          }
        });

        const deleteButton = button("削除", async () => {
          deleteButton.disabled = true;
          try {
            const removed = await removeSave(token, record);
            if (removed) await renderSavePanel();
          } catch (error) {
            setStatus(content, error.message || "削除に失敗しました");
          } finally {
            deleteButton.disabled = false;
          }
        });

        controls.append(loadButton, overwriteButton, deleteButton);
        card.append(controls);
        content.append(card);
      }
    } catch (error) {
      status.textContent = error.message || "セーブ一覧を読み込めませんでした";
    }
  };

  document.addEventListener(
    "click",
    (event) => {
      const target = event.target.closest?.("button, a");
      if (!target) return;

      const isSaveButton = target.id === "saveButton" || target.textContent.trim() === "セーブ";
      if (!isSaveButton) return;

      event.preventDefault();
      event.stopImmediatePropagation();
      renderSavePanel();
    },
    true
  );

  HMW.saveManager = {
    listSaves: async () => listSaves(requireToken()),
    open: renderSavePanel,
    createNew: async () => {
      const token = requireToken();
      const records = await listSaves(token);
      return createNewSave(token, records);
    },
    load: async (saveId) => {
      const token = requireToken();
      const loaded = await readFile(token, savePath(saveId));
      if (!loaded) throw new Error("セーブデータが見つかりません");
      return loadSave(token, { ...loaded.data, path: savePath(saveId), sha: loaded.sha });
    }
  };
})();
