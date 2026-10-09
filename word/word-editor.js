(() => {
  "use strict";

  const channel = "word-editor-window-v1";
  const host = window.opener;
  const editor = document.getElementById("userText");
  const author = document.getElementById("novelAuthor");
  const status = document.getElementById("editorStatus");
  const controls = ["saveText", "newText", "appendNovelLog"];
  let connected = false;

  function send(message) {
    if (host && !host.closed) host.postMessage({ channel, ...message }, location.origin);
    else {
      status.textContent = "元の画面から「文章を入力する」を押して開いてください。";
      connected = false;
      controls.forEach(id => { document.getElementById(id).disabled = true; });
    }
  }

  window.addEventListener("message", event => {
    if (event.origin !== location.origin || event.source !== host) return;
    const data = event.data;
    if (!data || data.channel !== channel || data.type !== "state") return;
    connected = true;
    if (typeof data.text === "string" && editor.value !== data.text) editor.value = data.text;
    if (["user", "chatgpt"].includes(data.author)) author.value = data.author;
    document.getElementById("selectedNovel").textContent = data.title || "";
    status.textContent = data.status || "";
    controls.forEach(id => { document.getElementById(id).disabled = Boolean(data.disabled?.[id]); });
    if (data.focus) editor.focus();
  });

  editor.addEventListener("input", () => send({ type: "input", text: editor.value }));
  author.addEventListener("change", () => send({ type: "author", author: author.value }));
  controls.forEach(id => {
    document.getElementById(id).addEventListener("click", () => {
      if (!connected) return;
      send({ type: "input", text: editor.value });
      send({ type: "author", author: author.value });
      send({ type: "action", id });
    });
  });
  document.getElementById("closeEditor").addEventListener("click", () => {
    send({ type: "input", text: editor.value });
    if (host && !host.closed) {
      host.focus();
      window.close();
    } else {
      location.href = "word_index.html";
    }
  });

  send({ type: "ready" });
})();
