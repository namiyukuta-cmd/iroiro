(() => {
  "use strict";

  const dialog = document.getElementById("editorDialog");
  const openButton = document.getElementById("openEditor");
  const closeButton = document.getElementById("closeEditor");
  const editor = document.getElementById("userText");
  const savedList = document.getElementById("savedList");

  function openEditor(focusInput = true) {
    if (!dialog.open) dialog.showModal();
    if (focusInput) editor.focus();
  }

  openButton.addEventListener("click", () => openEditor());
  closeButton.addEventListener("click", () => dialog.close());

  // 保存済み文章の選択後、読み込んだ文章を表示するポップアップを開きます。
  savedList.addEventListener("click", event => {
    if (event.target.closest("button")) openEditor(false);
  });

  // 閉じる際は入力内容を消しません。
})();
