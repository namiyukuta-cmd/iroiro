(() => {
  "use strict";

  const channel = "word-editor-window-v1";
  const editor = document.getElementById("userText");
  const author = document.getElementById("novelAuthor");
  const novelSelect = document.getElementById("novelSelect");
  const popupStatus = document.getElementById("editorStatus");
  const standaloneStatus = document.getElementById("saveStatus");
  const novelStatus = document.getElementById("novelStatus");
  const controls = ["saveText", "newText", "appendNovelLog"].map(id => document.getElementById(id));
  const windowName = "wordEditor_" + Date.now() + "_" + Math.random().toString(36).slice(2);
  let editorWindow = null;
  let lastText = editor.value;
  let statusText = standaloneStatus.textContent || novelStatus.textContent;

  function sync(includeText = false, focus = false) {
    if (!editorWindow || editorWindow.closed) return;
    const textChanged = editor.value !== lastText;
    const state = {
      channel,
      type: "state",
      author: author.value,
      title: novelSelect.selectedOptions[0]?.textContent || "作品を選択してください",
      status: statusText,
      disabled: Object.fromEntries(controls.map(button => [button.id, button.disabled])),
      focus
    };
    if (includeText || textChanged) state.text = editor.value;
    lastText = editor.value;
    editorWindow.postMessage(state, location.origin);
  }

  function openEditor() {
    if (editorWindow && !editorWindow.closed) {
      editorWindow.focus();
      sync(true, true);
      return;
    }
    editorWindow = window.open("word-editor.html?v=20261010window1", windowName,
      "popup=yes,width=600,height=800,resizable=yes,scrollbars=yes");
    if (!editorWindow) {
      standaloneStatus.textContent = "文章入力ウィンドウを開けませんでした。ブラウザのポップアップ設定を確認してください。";
    }
  }

  window.wordEditorOpen = openEditor;
  window.wordEditorConfirm = message =>
    (editorWindow && !editorWindow.closed ? editorWindow : window).confirm(message);

  document.getElementById("openEditor").addEventListener("click", openEditor);
  window.addEventListener("message", event => {
    if (event.origin !== location.origin || event.source !== editorWindow) return;
    const data = event.data;
    if (!data || data.channel !== channel) return;
    if (data.type === "ready") {
      sync(true, true);
    } else if (data.type === "input" && typeof data.text === "string") {
      editor.value = data.text;
      lastText = data.text;
      editor.dispatchEvent(new Event("input", { bubbles: true }));
    } else if (data.type === "author" && ["user", "chatgpt"].includes(data.author)) {
      author.value = data.author;
      author.dispatchEvent(new Event("change", { bubbles: true }));
    } else if (data.type === "action" && controls.some(button => button.id === data.id)) {
      const button = document.getElementById(data.id);
      if (!button.disabled) button.click();
      sync();
    }
  });

  for (const source of [standaloneStatus, novelStatus]) {
    new MutationObserver(() => {
      statusText = source.textContent;
      popupStatus.textContent = statusText;
      sync();
    }).observe(source, { childList: true, characterData: true, subtree: true });
  }
  for (const button of controls) {
    new MutationObserver(() => sync()).observe(button, { attributes: true, attributeFilter: ["disabled"] });
  }
  novelSelect.addEventListener("change", () => sync());
  new MutationObserver(() => sync()).observe(novelSelect, { childList: true, subtree: true });
})();
