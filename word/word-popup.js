(() => {
  "use strict";

  const dialog = document.getElementById("editorDialog");
  const openButton = document.getElementById("openEditor");
  const closeButton = document.getElementById("closeEditor");
  const editor = document.getElementById("userText");
  const savedList = document.getElementById("savedList");

  function openEditor(focusInput = true) {
    if (!dialog.open) {
      dialog.showModal();
    }
    if (focusInput) editor.focus();
  }

  openButton.addEventListener("click", () => openEditor(true));
  closeButton.addEventListener("click", () => dialog.close());

  // 保存済み文章を選択すると、入力ポップアップを開きます。
  // 文章自体の読み込みは従来の word_index.js が行います。
  savedList.addEventListener("click", (event) => {
    if (event.target.closest("button")) openEditor(false);
  });

  const popupStatus = document.getElementById("editorStatus");
  const standaloneStatus = document.getElementById("saveStatus");
  const novelStatus = document.getElementById("novelStatus");

  // 保存処理の表示は元の場所にも残し、ポップアップ内にも反映します。
  for (const source of [standaloneStatus, novelStatus]) {
    new MutationObserver(() => {
      if (dialog.open) popupStatus.textContent = source.textContent;
    }).observe(source, { childList: true, characterData: true, subtree: true });
  }

  // 閉じても編集途中の文章は消しません。
})();
